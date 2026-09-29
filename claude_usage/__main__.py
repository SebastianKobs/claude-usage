"""Command line: scan | report | serve | backup | hook-settings | notify-test. Settings come from the package's
config.toml with the user's overrides (see config.py); --projects-dir and --store override them, before or after the
command. Only main() prints errors and picks the exit code: 0 on success, 1 on an error, 2 on bad arguments, 130
when interrupted."""
import argparse
import json
import math
import re
import shlex
import signal
import sqlite3
import sys
from collections.abc import Callable
from datetime import date
from pathlib import Path
from typing import Any

import claude_usage
from claude_usage import compact
from claude_usage import config
from claude_usage import notify
from claude_usage import permissions
from claude_usage import pricing
from claude_usage import queries
from claude_usage import readers
from claude_usage import report
from claude_usage import scan
from claude_usage import secret_paths
from claude_usage import server
from claude_usage import store

REPORT_GROUPS = ("day", "model", "agent_type", "project", "skill", "mcp_server", "effort")
HOST = "127.0.0.1"
INTERRUPTED = 130                       # the shell's exit code for a command stopped by Ctrl+C (128 + SIGINT)


class CliError(Exception):
    """A command failed in a way the user can fix; the message is printed."""


class Context:
    """What every command needs: the parsed arguments, the config and its checked settings, prices and the two
    paths."""

    def __init__(self, args: argparse.Namespace, loaded: config.Config) -> None:
        self.args = args
        self.config = loaded
        self.settings = config.settings(loaded)
        self.prices = pricing.parse_prices(loaded.values.get("prices") or {}, loaded.values.get("fees"))
        self.projects_dir = path_option(args.projects_dir) or self.settings.projects_dir
        self.store_path = path_option(args.store) or self.settings.store


# --- options ------------------------------------------------------------------------------------------------------

def path_option(value: Path | None) -> Path | None:
    """A path given on the command line, with ~ expanded."""
    if value is None:
        return None
    return value.expanduser()


def print_json(payload: Any) -> None:
    """Print a payload as indented JSON."""
    print(json.dumps(payload, indent=2, ensure_ascii=False))


# --- commands ----------------------------------------------------------------------------------------------------

def run_scan(context: Context) -> int:
    """scan: one incremental scan; vanished files are warnings."""
    with store.Store(context.store_path) as usage_store:
        result = scan.scan(usage_store, context.projects_dir, context.args.project, context.settings.retention_days)
    print(f"{result.files_scanned} files scanned, {result.files_skipped} unchanged, "
          f"{result.messages_upserted} messages updated, {report.size(result.bytes_read)} read "
          f"(store: {context.store_path})")
    if result.sessions_pruned:
        noun = "session" if result.sessions_pruned == 1 else "sessions"
        print(f"{result.sessions_pruned} {noun} older than {context.settings.retention_days} days deleted "
              "(retention_days)")
    for error in result.errors:
        print(f"warning: {error}", file=sys.stderr)
    return 0


def run_report(context: Context) -> int:
    """report: totals per group or one session, as text or JSON; scans first unless --no-scan."""
    args = context.args
    retention = context.settings.retention_days
    # without --days the default range, or the whole retention if that is shorter
    days = args.days if args.days is not None else min(queries.DEFAULT_DAYS, retention or queries.DEFAULT_DAYS)
    if retention and days > retention:
        raise CliError(f"--days {days} reaches past the {retention} days the store keeps (retention_days in "
                       "the config); pick fewer days or raise it")
    with store.Store(context.store_path) as usage_store:
        if not args.no_scan:
            scan.scan(usage_store, context.projects_dir, args.project, retention)
        if args.session:
            detail = queries.session_detail(usage_store, args.session, context.prices,
                                            settings=compact.parse_compact_settings(context.config.values))
            if detail is None:
                raise CliError(f"unknown session {args.session}")
            if args.json:
                print_json(detail)
            else:
                print(report.session_text(detail))
            return 0
        since = None if days == 0 else queries.first_day(days, date.today())
        rows = queries.totals_by(usage_store, args.by, since, context.prices, project=args.project)
    payload = {"by": args.by, "days": days, "since": since.isoformat() if since else None,
               "project_filter": args.project, "rows": rows, "totals": queries.combined(rows)}
    if args.json:
        print_json(payload)
    else:
        print(report.totals_text(payload))
    return 0


def run_serve(context: Context) -> int:
    """serve: the dashboard on 127.0.0.1 until Ctrl+C."""
    args = context.args
    port = args.port if args.port is not None else context.settings.port
    live_minutes = args.live_minutes if args.live_minutes is not None else context.settings.live_minutes
    compact_settings = compact.parse_compact_settings(context.config.values)   # fails before the store is opened
    secret_settings = secret_paths.parse_secrets(context.config.values)
    notify_settings = notify.parse_notify(context.config.values)
    with store.Store(context.store_path, check_same_thread=False) as usage_store:
        app = server.UsageApp(usage_store, context.projects_dir, context.prices, live_minutes, project=args.project,
                              prices_checked=context.settings.prices_checked, compact=compact_settings,
                              retention_days=context.settings.retention_days, secret_settings=secret_settings,
                              read_processes=server.READ_PROCESSES,
                              agent_live_minutes=context.settings.agent_live_minutes)
        httpd = server.make_server(app, HOST, port)
        prompt_server = None
        sender = None
        watcher = None
        previous = signal.signal(signal.SIGTERM, stop_on_sigterm)
        try:
            try:
                start_warnings = readers.warnings(context.projects_dir)
            except OSError as exc:         # the check only informs: the dashboard starts without it
                start_warnings = [f"who else can read {context.projects_dir} is unknown: {exc}"]
            # the permission hook's socket, opened before any other thread starts (it sets the umask for a moment)
            try:
                prompt_server = server.open_prompt_socket(app, permissions.socket_path(context.store_path.resolve()))
                prompt_server.start()
            except server.PromptSocketError as exc:
                app.prompts_unavailable = str(exc)
                start_warnings.append(f"the dashboard shows no permission prompts: {exc}")
            notifier = None
            if notify_settings.enabled:
                try:
                    notifier = notify.detect(notify_settings, notify.Environment.current())
                except notify.NotifyError as exc:
                    app.notifications_unavailable = str(exc)
                    start_warnings.append(f"no desktop notifications: {exc}")
            # before the link: `make start` shows the warnings printed before it
            for warning in start_warnings:
                print(f"warning: {warning}", file=sys.stderr, flush=True)
            # before the first scan, which reads every file of a new store: `make start` waits for this line
            # the link carries this start's token, which the API asks for
            print(f"Serving http://{HOST}:{httpd.server_address[1]}/?{server.TOKEN_PARAMETER}={app.token}  "
                  "(Ctrl+C to stop)", flush=True)
            with app.lock:
                app.refresh()              # so the first page load is quick; scan errors go to stderr
            if notifier is not None:        # after the first scan: its first pass only notes the states
                sender = notify.Sender(notifier, warn, on_failure=notifications_failed(app))
                sender.start()
                watcher = notify.Watcher(app, sender, warn)
                watcher.start()
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("Stopped.")
        finally:
            # before the readers and the store close, which the watcher's pass uses
            if watcher is not None:
                watcher.stop()
            if sender is not None:
                sender.stop()
            signal.signal(signal.SIGTERM, previous)
            if prompt_server is not None:
                server.close_prompt_socket(prompt_server)
            httpd.server_close()
            app.close()
    return 0


def warn(message: str) -> None:
    """A warning of serve's on stderr, as those before the link."""
    print(f"warning: {message}", file=sys.stderr, flush=True)


def notifications_failed(app: server.UsageApp) -> Callable[[str], None]:
    """What the Sender calls at its first failure: the live sessions say why no notification shows."""
    def failed(reason: str) -> None:
        """Note the reason on the app."""
        app.notifications_unavailable = reason
    return failed


def stop_on_sigterm(signum: int, frame: object) -> None:
    """`make stop` sends SIGTERM: stop like Ctrl+C, so the server closes and a scan's transaction rolls back."""
    raise KeyboardInterrupt


def run_backup(context: Context) -> int:
    """backup: a copy of the store in a new file, e.g. outside a checkout whose data/ `git clean` would remove."""
    target = context.args.target.expanduser()
    with store.Store(context.store_path) as usage_store:
        store.backup(usage_store, target)
    print(f"backed up {context.store_path} to {target} ({report.size(target.stat().st_size)})")
    return 0


def hook_notes(socket_path: Path) -> str:
    """Where hook-settings' block belongs, and which dashboard it posts to."""
    return f"""\
# Paste this into ~/.claude/settings.json to see the permission prompts of every project, or into one project's
# .claude/settings.local.json for that project only (git-ignored). Never into a project's .claude/settings.json:
# it is committed, and everyone who works on the project would run the hook, whether they use claude-usage or
# not. Where the file has "hooks" already, add the "PermissionRequest" entry to them. The hook posts each prompt
# to the dashboard's socket {socket_path}; while no dashboard runs, it is ignored."""


def run_hook_settings(context: Context) -> int:
    """hook-settings: the settings block whose hook posts each permission prompt to the dashboard's socket next to the
    store (server.PROMPT_PATH) in the background, at most 2 s and quietly when none runs, with where the block
    belongs. Raises CliError without Unix sockets (Windows), where the dashboard can't take the prompts."""
    if not server.HAS_UNIX_SOCKETS:
        raise CliError("permission prompts reach the dashboard over Unix sockets, which this system has not: "
                       "Claude Code's own dialogs work as ever, only the dashboard can't show them")
    socket_path = permissions.socket_path(context.store_path.resolve())
    command = shlex.join(["curl", "-s", "-m", "2", "-o", "/dev/null", "--unix-socket", str(socket_path), "-H",
                          "Content-Type: application/json", "--data-binary", "@-",
                          f"http://localhost{server.PROMPT_PATH}"]) + " || true"
    print(hook_notes(socket_path))
    print_json({"hooks": {permissions.HOOK_EVENT: [
        {"matcher": "*", "hooks": [{"type": "command", "command": command, "async": True}]}]}})
    return 0


def run_notify_test(context: Context) -> int:
    """notify-test: one desktop notification through the notifier serve would use, shown now, and which one it is.
    Raises CliError where none is found or it fails."""
    settings = notify.parse_notify(context.config.values)
    test = notify.Notification("claude-usage", "A test notification: the dashboard's show like this.", notify.APP_ICON)
    try:
        notifier = notify.detect(settings, notify.Environment.current())
        notify.Sender(notifier, warn).deliver([test])
    except notify.NotifyError as exc:
        raise CliError(f"no desktop notification: {exc}") from exc
    off = "" if settings.enabled else " With [notify] enabled = false, serve sends none."
    print(f"sent via {notifier.method}.{off}")
    print("Nothing showed? The system may hold it back (Do Not Disturb, Focus Assist) or ask you to allow it first.")
    return 0


COMMANDS: dict[str, Callable[[Context], int]] = {"scan": run_scan, "report": run_report, "serve": run_serve,
                                                 "backup": run_backup, "hook-settings": run_hook_settings,
                                                 "notify-test": run_notify_test}


# --- arguments ---------------------------------------------------------------------------------------------------

def days_option(text: str) -> int:
    """--days: a whole number of days up to server.MAX_DAYS, 0 for all time."""
    if not re.fullmatch(r"[0-9]+", text) or int(text) > server.MAX_DAYS:
        raise argparse.ArgumentTypeError(f"days must be a whole number up to {server.MAX_DAYS}, 0 for all time; "
                                         f"got {text!r}")
    return int(text)


def port_option(text: str) -> int:
    """--port: 0 (any free port) to config.MAX_PORT."""
    if not re.fullmatch(r"[0-9]+", text) or int(text) > config.MAX_PORT:
        raise argparse.ArgumentTypeError(f"port must be a whole number from 0 to {config.MAX_PORT}; got {text!r}")
    return int(text)


def minutes_option(text: str) -> float:
    """--live-minutes: a finite number above 0."""
    try:
        minutes = float(text)
    except ValueError:
        minutes = math.nan
    if not math.isfinite(minutes) or minutes <= 0:
        raise argparse.ArgumentTypeError(f"live minutes must be a number above 0; got {text!r}")
    return minutes


def add_path_options(parser: argparse.ArgumentParser, default: Any) -> None:
    """--projects-dir and --store; on the commands with default SUPPRESS, so they don't override the global ones."""
    parser.add_argument("--projects-dir", type=Path, default=default, metavar="DIR",
                        help="Claude Code's transcripts (default: projects_dir in the config, else "
                             "$CLAUDE_CONFIG_DIR/projects, else ~/.claude/projects)")
    parser.add_argument("--store", type=Path, default=default, metavar="FILE",
                        help="the SQLite history (default: store in the config: data/usage.sqlite in a checkout, "
                             "else ~/.local/share/claude-usage/usage.sqlite)")


def build_parser() -> argparse.ArgumentParser:
    """The argument parser with the scan, report, serve, backup, hook-settings and notify-test commands."""
    parser = argparse.ArgumentParser(prog="claude-usage",
                                     description="Persistent history and a local dashboard for Claude Code usage.")
    parser.add_argument("--version", action="version", version=f"claude-usage {claude_usage.__version__}")
    add_path_options(parser, None)
    paths = argparse.ArgumentParser(add_help=False)
    add_path_options(paths, argparse.SUPPRESS)
    commands = parser.add_subparsers(dest="command", required=True, metavar="COMMAND")

    scan_command = commands.add_parser("scan", parents=[paths], help="read new transcript data into the store")
    scan_command.add_argument("--project", metavar="PATH", help="only this project's transcripts")

    report_command = commands.add_parser("report", parents=[paths], help="totals or one session, as text or JSON")
    report_command.add_argument("--days", type=days_option,
                                help=f"the last N days, today included (default {queries.DEFAULT_DAYS}, at most "
                                     "retention_days; 0 = all the store keeps)")
    report_command.add_argument("--by", choices=REPORT_GROUPS, default="model", help="group totals by (default model)")
    report_command.add_argument("--session", metavar="ID", help="one session: main thread, subagents and tools")
    report_command.add_argument("--project", metavar="PATH", help="only this project")
    report_command.add_argument("--json", action="store_true", help="print JSON")
    report_command.add_argument("--no-scan", action="store_true", help="report the stored history without scanning")

    serve = commands.add_parser("serve", parents=[paths], help="the dashboard on http://127.0.0.1")
    serve.add_argument("--port", type=port_option,
                       help="port (default: serve.port in the config, 8765)")
    serve.add_argument("--live-minutes", type=minutes_option,
                       help="a session is live if changed within this many minutes (default: serve.live_minutes "
                            "in the config, 5)")
    serve.add_argument("--project", metavar="PATH", help="only this project")

    backup = commands.add_parser("backup", parents=[paths], help="copy the store into a new file")
    backup.add_argument("target", type=Path, metavar="FILE", help="the copy; must not exist yet")

    commands.add_parser("hook-settings", parents=[paths],
                        help="print the settings block of the hook that shows permission prompts on the dashboard, "
                             "and where it belongs")
    commands.add_parser("notify-test", parents=[paths],
                        help="show one desktop notification the way serve shows them, and say how")
    return parser


def main(argv: list[str] | None = None) -> int:
    """Run one command; returns the exit code."""
    try:
        args = build_parser().parse_args(argv)
    except SystemExit as exc:              # --help (0) or bad arguments (2)
        return exc.code if isinstance(exc.code, int) else 2
    try:
        context = Context(args, config.load())
        return COMMANDS[args.command](context)
    except (CliError, config.ConfigError, pricing.PricingError, store.StoreError, sqlite3.Error, OSError) as exc:
        print(f"claude-usage: {exc}", file=sys.stderr)
        return 1
    except KeyboardInterrupt:              # a scan's transaction has rolled back; the store is as before it
        print("claude-usage: interrupted", file=sys.stderr)
        return INTERRUPTED


if __name__ == "__main__":
    sys.exit(main())
