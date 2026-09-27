"""Command line: scan | report | serve | backup. Settings come from the package's config.toml with the user's overrides
(see config.py); --projects-dir and --store override them, before or after the command. Only main() prints errors
and picks the exit code: 0 on success, 1 on an error, 2 on bad arguments, 130 when interrupted."""
import argparse
import json
import math
import re
import signal
import sqlite3
import sys
from collections.abc import Callable
from datetime import date
from datetime import timedelta
from pathlib import Path
from typing import Any

import claude_usage
from claude_usage import config
from claude_usage import pricing
from claude_usage import server
from claude_usage import store

REPORT_GROUPS = ("day", "model", "agent_type", "project", "skill", "mcp_server", "effort")
DEFAULT_DAYS = 30
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


# --- formatting --------------------------------------------------------------------------------------------------

def path_option(value: Path | None) -> Path | None:
    """A path given on the command line, with ~ expanded."""
    if value is None:
        return None
    return value.expanduser()


def whole(value: int | None) -> str:
    """A count with thousands separators, or "–"."""
    if value is None:
        return "–"
    return f"{value:,}"


def money(value: float | None) -> str:
    """A cost in dollars, or "–" for no price."""
    if value is None:
        return "–"
    return f"${value:,.2f}"


def size(byte_count: int) -> str:
    """A byte count as B, KB or MB."""
    if byte_count < 1000:
        return f"{byte_count} B"
    if byte_count < 1_000_000:
        return f"{byte_count / 1000:.1f} KB"
    return f"{byte_count / 1_000_000:.1f} MB"


def duration(milliseconds: int) -> str:
    """A duration as hours and minutes, minutes and seconds, or seconds."""
    seconds = round(milliseconds / 1000)
    hours, rest = divmod(seconds, 3600)
    minutes, seconds = divmod(rest, 60)
    if hours:
        return f"{hours} h {minutes} min" if minutes else f"{hours} h"
    if minutes:
        return f"{minutes} min {seconds} s" if seconds else f"{minutes} min"
    return f"{seconds} s"


def runtime_text(runtime: dict[str, Any]) -> str:
    """A session's run totals as one line: from its cost-state record, or marked as estimated from the transcripts
    (which don't show the retries)."""
    estimated = runtime["source"] == "transcripts"
    label = "Run (estimated from the transcripts; tool time includes waiting for permission)" if estimated else "Run"
    retries = ("" if runtime["api_ms_without_retries"] is None
               else f" ({duration(runtime['api_ms_without_retries'])} without retries)")
    return (f"{label}: {duration(runtime['duration_ms'])} wall-clock, API {duration(runtime['api_ms'])}{retries}, "
            f"tools {duration(runtime['tool_ms'])}, lines +{runtime['lines_added']:,} / -{runtime['lines_removed']:,}")


def input_total(row: dict[str, Any]) -> int:
    """New input plus cache writes and reads: everything sent to the model."""
    return row["new_input"] + row["cache_write"] + row["cache_read"]


def table(headers: list[str], rows: list[list[str]], right_aligned: set[int]) -> str:
    """A plain-text table; the columns in right_aligned are aligned right (numbers)."""
    widths = [max(len(str(cell)) for cell in column) for column in zip(headers, *rows)]
    lines = []
    for index, row in enumerate([headers, *rows]):
        cells = [str(cell).rjust(width) if column in right_aligned else str(cell).ljust(width)
                 for column, (cell, width) in enumerate(zip(row, widths))]
        lines.append("  ".join(cells).rstrip())
        if index == 0:
            lines.append("  ".join("-" * width for width in widths))
    return "\n".join(lines)


def usage_cells(row: dict[str, Any]) -> list[str]:
    """Turns, input, cache read, output and cost of a usage row."""
    return [whole(row["turns"]), whole(input_total(row)), whole(row["cache_read"]), whole(row["output"]),
            money(row["cost"])]


USAGE_HEADERS = ["Turns", "Input", "Cache read", "Output", "Cost"]


def totals_text(payload: dict[str, Any]) -> str:
    """The report of totals per group as a text table with a total row."""
    group = payload["by"]
    # None: the turns without a skill or MCP server
    rows = [["(none)" if row[group] is None else str(row[group]), *usage_cells(row)] for row in payload["rows"]]
    rows.append(["Total", *usage_cells(payload["totals"])])
    scope = "all time" if payload["since"] is None else f"since {payload['since']}"
    lines = [f"Usage by {group}, {scope}" + (f", project {payload['project_filter']}"
                                            if payload["project_filter"] else ""),
             "", table([group, *USAGE_HEADERS], rows, set(range(1, 6)))]
    if payload["totals"]["web_searches"]:
        lines.append(f"\nIncluding {payload['totals']['web_searches']:,} web searches.")
    if payload["totals"]["unpriced_turns"]:
        lines.append(f"\n{payload['totals']['unpriced_turns']:,} turns of models without a price have no cost.")
    return "\n".join(lines)


def session_text(detail: dict[str, Any]) -> str:
    """The drilldown of one session as text."""
    lines = [f"{detail['title'] or 'Untitled session'}  ({detail['session_id']})",
             f"{detail['project']} · {detail['git_branch'] or '-'} · {detail['first_ts']} – {detail['last_ts']}"]
    if detail["prompt"]:
        lines.append(f"Prompt: {detail['prompt']}")
    agent_rows = []
    tool_rows = []
    for agent in detail["agents"]:
        name = agent["agent_type"] if agent["agent_id"] is None else f"{agent['agent_type']} ({agent['agent_id']})"
        agent_rows.append([name, ", ".join(agent["models"]) or "-", whole(agent["turns"]),
                           f"{whole(agent['context_first'])} -> {whole(agent['context_last'])}",
                           whole(agent["input_total"]), whole(agent["output"]), money(agent["cost"])])
        tool_rows.extend([name, tool["tool"], whole(tool["calls"]), whole(tool["result_chars"])]
                         for tool in agent["tools"])
    lines += ["", table(["Agent", "Models", "Turns", "Context first -> last", "Input total", "Output", "Cost"],
                        agent_rows, {2, 3, 4, 5, 6})]
    if tool_rows:
        lines += ["", table(["Agent", "Tool", "Calls", "Result chars"], tool_rows, {2, 3})]
    model_rows = []
    for model in detail["models"]:
        model_rows.append([model["model"], *usage_cells(model)])
        efforts = sorted((row for row in detail["model_effort"]
                          if row["model"] == model["model"] and row["effort"] is not None),
                         key=lambda row: store.effort_order(row["effort"]))
        model_rows.extend([f"  {row['effort']}", *usage_cells(row)] for row in efforts)
    if model_rows:
        lines += ["", table(["Model / effort", *USAGE_HEADERS], model_rows, set(range(1, 6)))]
    for key, group, header in (("skills", "skill", "Skill"), ("mcp_servers", "mcp_server", "MCP server")):
        if detail[key]:
            lines += ["", table([header, *USAGE_HEADERS], [[row[group], *usage_cells(row)] for row in detail[key]],
                                set(range(1, 6)))]
    if detail["api_errors"]:
        error_rows = [[event["ts"] or "-", event["error"], str(event["status"] or "-"), event["limit_type"] or "-",
                       event["resets_at"] or "-", event["agent_type"]] for event in detail["api_errors"]]
        lines += ["", table(["API error at", "Error", "Status", "Quota", "Resets", "Agent"], error_rows, set())]
    searches = f", {whole(detail['web_searches'])} web searches" if detail["web_searches"] else ""
    lines += ["", f"Total: {whole(detail['turns'])} turns, {whole(detail['output'])} output tokens{searches}, "
                  f"{money(detail['cost'])}"]
    if detail["runtime"]:
        lines.append(runtime_text(detail["runtime"]))
    return "\n".join(lines)


def print_json(payload: Any) -> None:
    """Print a payload as indented JSON."""
    print(json.dumps(payload, indent=2, ensure_ascii=False))


# --- commands ----------------------------------------------------------------------------------------------------

def run_scan(context: Context) -> int:
    """scan: one incremental scan; vanished files are warnings."""
    with store.Store(context.store_path) as usage_store:
        result = store.scan(usage_store, context.projects_dir, context.args.project)
    print(f"{result.files_scanned} files scanned, {result.files_skipped} unchanged, "
          f"{result.messages_upserted} messages updated, {size(result.bytes_read)} read "
          f"(store: {context.store_path})")
    for error in result.errors:
        print(f"warning: {error}", file=sys.stderr)
    return 0


def run_report(context: Context) -> int:
    """report: totals per group or one session, as text or JSON; scans first unless --no-scan."""
    args = context.args
    with store.Store(context.store_path) as usage_store:
        if not args.no_scan:
            store.scan(usage_store, context.projects_dir, args.project)
        if args.session:
            detail = store.session_detail(usage_store, args.session, context.prices)
            if detail is None:
                raise CliError(f"unknown session {args.session}")
            if args.json:
                print_json(detail)
            else:
                print(session_text(detail))
            return 0
        since = None if args.days == 0 else date.today() - timedelta(days=args.days - 1)
        rows = store.totals_by(usage_store, args.by, since, context.prices, project=args.project)
    payload = {"by": args.by, "days": args.days, "since": since.isoformat() if since else None,
               "project_filter": args.project, "rows": rows, "totals": store.combined(rows)}
    if args.json:
        print_json(payload)
    else:
        print(totals_text(payload))
    return 0


def run_serve(context: Context) -> int:
    """serve: the dashboard on 127.0.0.1 until Ctrl+C."""
    args = context.args
    port = args.port if args.port is not None else context.settings.port
    live_minutes = args.live_minutes if args.live_minutes is not None else context.settings.live_minutes
    compact = server.parse_compact_settings(context.config.values)         # fails before the store is opened
    with store.Store(context.store_path, check_same_thread=False) as usage_store:
        app = server.UsageApp(usage_store, context.projects_dir, context.prices, live_minutes, project=args.project,
                              prices_checked=context.settings.prices_checked, compact=compact)
        httpd = server.make_server(app, HOST, port)
        previous = signal.signal(signal.SIGTERM, stop_on_sigterm)
        try:
            # before the first scan, which reads every file of a new store: `make start` waits for this line
            print(f"Serving http://{HOST}:{httpd.server_address[1]}  (Ctrl+C to stop)", flush=True)
            with app.lock:
                app.refresh()              # so the first page load is quick; scan errors go to stderr
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("Stopped.")
        finally:
            signal.signal(signal.SIGTERM, previous)
            httpd.server_close()
    return 0


def stop_on_sigterm(signum: int, frame: object) -> None:
    """`make stop` sends SIGTERM: stop like Ctrl+C, so the server closes and a scan's transaction rolls back."""
    raise KeyboardInterrupt


def run_backup(context: Context) -> int:
    """backup: a copy of the store in a new file, e.g. outside a checkout whose data/ `git clean` would remove."""
    target = context.args.target.expanduser()
    with store.Store(context.store_path) as usage_store:
        store.backup(usage_store, target)
    print(f"backed up {context.store_path} to {target} ({size(target.stat().st_size)})")
    return 0


COMMANDS: dict[str, Callable[[Context], int]] = {"scan": run_scan, "report": run_report, "serve": run_serve,
                                                 "backup": run_backup}


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
                        help="Claude Code's transcripts (default: projects_dir in the config, ~/.claude/projects)")
    parser.add_argument("--store", type=Path, default=default, metavar="FILE",
                        help="the SQLite history (default: store in the config: data/usage.sqlite in a checkout, "
                             "else ~/.local/share/claude-usage/usage.sqlite)")


def build_parser() -> argparse.ArgumentParser:
    """The argument parser with the scan, report and serve commands."""
    parser = argparse.ArgumentParser(prog="claude-usage",
                                     description="Persistent history and a local dashboard for Claude Code usage.")
    parser.add_argument("--version", action="version", version=f"claude-usage {claude_usage.__version__}")
    add_path_options(parser, None)
    paths = argparse.ArgumentParser(add_help=False)
    add_path_options(paths, argparse.SUPPRESS)
    commands = parser.add_subparsers(dest="command", required=True, metavar="COMMAND")

    scan = commands.add_parser("scan", parents=[paths], help="read new transcript data into the store")
    scan.add_argument("--project", metavar="PATH", help="only this project's transcripts")

    report = commands.add_parser("report", parents=[paths], help="totals or one session, as text or JSON")
    report.add_argument("--days", type=days_option, default=DEFAULT_DAYS,
                        help=f"the last N days, today included (default {DEFAULT_DAYS}; 0 = all time)")
    report.add_argument("--by", choices=REPORT_GROUPS, default="model", help="group totals by (default model)")
    report.add_argument("--session", metavar="ID", help="one session: main thread, subagents and tools")
    report.add_argument("--project", metavar="PATH", help="only this project")
    report.add_argument("--json", action="store_true", help="print JSON")
    report.add_argument("--no-scan", action="store_true", help="report the stored history without scanning")

    serve = commands.add_parser("serve", parents=[paths], help="the dashboard on http://127.0.0.1")
    serve.add_argument("--port", type=port_option,
                       help="port (default: serve.port in the config, 8765)")
    serve.add_argument("--live-minutes", type=minutes_option,
                       help="a session is live if changed within this many minutes (default: serve.live_minutes "
                            "in the config, 5)")
    serve.add_argument("--project", metavar="PATH", help="only this project")

    backup = commands.add_parser("backup", parents=[paths], help="copy the store into a new file")
    backup.add_argument("target", type=Path, metavar="FILE", help="the copy; must not exist yet")
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
