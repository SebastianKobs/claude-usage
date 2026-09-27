"""Command line: scan | report | serve. Settings come from config.toml (+ config.local.toml); --projects-dir and
--store override them, before or after the command. Only main() prints errors and picks the exit code: 0 on
success, 1 on an error, 2 on bad arguments."""
import argparse
import json
import sqlite3
import sys
from collections.abc import Callable
from datetime import date
from datetime import timedelta
from pathlib import Path
from typing import Any

from claude_usage import config
from claude_usage import pricing
from claude_usage import server
from claude_usage import store

REPORT_GROUPS = ("day", "model", "agent_type", "project")
DEFAULT_DAYS = 30
DEFAULT_PORT = 8765
DEFAULT_LIVE_MINUTES = 5
HOST = "127.0.0.1"


class CliError(Exception):
    """A command failed in a way the user can fix; the message is printed."""


class Context:
    """What every command needs: the parsed arguments, settings, prices and the two paths."""

    def __init__(self, args: argparse.Namespace, settings: config.Config) -> None:
        self.args = args
        self.settings = settings
        self.prices = pricing.parse_prices(settings.values.get("prices") or {}, settings.values.get("fees"))
        self.projects_dir = path_option(args.projects_dir) or settings.path("projects_dir")
        self.store_path = path_option(args.store) or settings.path("store")

    def setting(self, table: str, key: str, default: Any) -> Any:
        """A value from a table of the config, or default."""
        values = self.settings.values.get(table)
        if isinstance(values, dict) and key in values:
            return values[key]
        return default


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
    rows = [[str(row[group]), *usage_cells(row)] for row in payload["rows"]]
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
    searches = f", {whole(detail['web_searches'])} web searches" if detail["web_searches"] else ""
    lines += ["", f"Total: {whole(detail['turns'])} turns, {whole(detail['output'])} output tokens{searches}, "
                  f"{money(detail['cost'])}"]
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
    port = args.port if args.port is not None else context.setting("serve", "port", DEFAULT_PORT)
    live_minutes = (args.live_minutes if args.live_minutes is not None
                    else context.setting("serve", "live_minutes", DEFAULT_LIVE_MINUTES))
    checked = context.settings.values.get("prices_checked")
    with store.Store(context.store_path, check_same_thread=False) as usage_store:
        app = server.UsageApp(usage_store, context.projects_dir, context.prices, live_minutes, project=args.project,
                              prices_checked=str(checked) if checked else None)
        with app.lock:
            app.refresh()                  # fail early on a bad projects folder; the first page load is quick
        httpd = server.make_server(app, HOST, port)
        try:
            print(f"Serving http://{HOST}:{httpd.server_address[1]}  (Ctrl+C to stop)", flush=True)
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("Stopped.")
        finally:
            httpd.server_close()
    return 0


COMMANDS: dict[str, Callable[[Context], int]] = {"scan": run_scan, "report": run_report, "serve": run_serve}


# --- arguments ---------------------------------------------------------------------------------------------------

def days_option(text: str) -> int:
    """--days: a whole number of days, 0 for all time."""
    if not text.isdigit():
        raise argparse.ArgumentTypeError(f"days must be a whole number, 0 for all time; got {text!r}")
    return int(text)


def add_path_options(parser: argparse.ArgumentParser, default: Any) -> None:
    """--projects-dir and --store; on the commands with default SUPPRESS, so they don't override the global ones."""
    parser.add_argument("--projects-dir", type=Path, default=default, metavar="DIR",
                        help="Claude Code's transcripts (default: projects_dir in config.toml, ~/.claude/projects)")
    parser.add_argument("--store", type=Path, default=default, metavar="FILE",
                        help="the SQLite history (default: store in config.toml, data/usage.sqlite)")


def build_parser() -> argparse.ArgumentParser:
    """The argument parser with the scan, report and serve commands."""
    parser = argparse.ArgumentParser(prog="claude-usage",
                                     description="Persistent history and a local dashboard for Claude Code usage.")
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
    serve.add_argument("--port", type=int, help=f"port (default: serve.port in config.toml, {DEFAULT_PORT})")
    serve.add_argument("--live-minutes", type=float,
                       help=f"a session is live if changed within this many minutes (default {DEFAULT_LIVE_MINUTES})")
    serve.add_argument("--project", metavar="PATH", help="only this project")
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


if __name__ == "__main__":
    sys.exit(main())
