"""The local dashboard: a ThreadingHTTPServer on a loopback address only, serving static/dashboard.html with its
stylesheets and scripts, and a small JSON API. Every API request first runs an incremental scan, at most every
SCAN_INTERVAL seconds, behind a lock that also serializes all store access (one SQLite connection shared by the
handler threads). A scan that fails still leaves the stored history to serve; its errors go into the payload.

The API exposes session titles and first prompts, so besides binding to loopback the server refuses requests whose
Host header isn't a loopback name: that stops a web page from reading it through DNS rebinding.
"""
import dataclasses
import ipaddress
import json
import re
import socket
import sqlite3
import sys
import threading
import time
import traceback
from collections.abc import Callable
from datetime import date
from http import HTTPStatus
from http.server import BaseHTTPRequestHandler
from http.server import ThreadingHTTPServer
from pathlib import Path
from typing import Any
from urllib.parse import parse_qs
from urllib.parse import urlsplit

from claude_usage import compact
from claude_usage import conversation
from claude_usage import pricing
from claude_usage import queries
from claude_usage import scan
from claude_usage import secret_paths
from claude_usage import store
from claude_usage import tool_kinds
from claude_usage import transcripts
from claude_usage import turns

STATIC = Path(__file__).resolve().parent / "static"
DASHBOARD = STATIC / "dashboard.html"
ASSET_TYPES = {".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8"}
# URL path -> file, fixed at start: only what is in these folders is served, so no URL can reach another file
ASSETS = {f"/static/{path.relative_to(STATIC).as_posix()}": path
          for folder in ("css", "js") for path in sorted((STATIC / folder).rglob("*")) if path.suffix in ASSET_TYPES}
SCAN_INTERVAL = 5.0                     # seconds between scans triggered by requests
CONNECTION_TIMEOUT = 30                 # seconds an idle connection may keep its handler thread
TOOLS_MEMO_LIMIT = 256                  # transcripts whose tool rows stay in memory until the file changes
MAX_DAYS = 3650
# what the sessions list shows of each session: it holds every session of the range, so only that goes to the page
SESSION_LIST_FIELDS = ("session_id", "title", "project", "last_ts", "subagents", "turns", "context_avg",
                       "context_peak", "output", "cost")
SESSION_PATH = re.compile(r"/api/session/([A-Za-z0-9_-]{1,128})")
CHAT_PATH = re.compile(r"/api/session/([A-Za-z0-9_-]{1,128})/chat")
AGENT_ID = re.compile(r"[A-Za-z0-9_-]{1,128}")
SECRET_SEVERITIES = ("high", "medium", "low-medium", "low")
HOST_WITH_PORT = re.compile(r"^\[?(?P<host>[^\]]*?)\]?(?::\d+)?$")
# no inline scripts or stylesheets; style attributes stay allowed, as the charts set colors and sizes with them
DASHBOARD_POLICY = ("default-src 'none'; script-src 'self'; style-src 'self'; style-src-attr 'unsafe-inline'; "
                    "connect-src 'self'; img-src data:; base-uri 'none'; form-action 'none'; frame-ancestors 'none'")

Payload = dict[str, Any]


class BadRequest(Exception):
    """The request is malformed; the message is sent back as the error."""


class NotFound(Exception):
    """Nothing answers to the request; the message is sent back as the error."""


def is_loopback(host: str) -> bool:
    """True for localhost and loopback IP addresses (127.0.0.0/8, ::1)."""
    if host.lower() == "localhost":
        return True
    try:
        return ipaddress.ip_address(host).is_loopback
    except ValueError:
        return False


def parse_days(query: str) -> int:
    """The days parameter of a query string (default 30); raises BadRequest if it isn't a whole number in range."""
    values = parse_qs(query).get("days")
    if not values:
        return queries.DEFAULT_DAYS
    text = values[-1]
    if not re.fullmatch(r"[0-9]{1,4}", text) or not 1 <= int(text) <= MAX_DAYS:
        raise BadRequest(f"days must be a whole number from 1 to {MAX_DAYS}, got {text!r}")
    return int(text)


def parse_until(query: str) -> date:
    """The until parameter of a query string, the last day of the range (default today); raises BadRequest if it
    isn't an ISO date or lies in the future."""
    values = parse_qs(query).get("until")
    if not values:
        return date.today()
    text = values[-1]
    try:
        until = date.fromisoformat(text)
    except ValueError:
        raise BadRequest(f"until must be a date like 2026-09-27, got {text!r}") from None
    if until > date.today():
        raise BadRequest(f"until must not be after today, got {text!r}")
    return until


def parse_agent(query: str) -> str | None:
    """The agent parameter of a query string (a subagent's id; None for the main thread); raises BadRequest if it
    isn't a plain id."""
    values = parse_qs(query).get("agent")
    if not values:
        return None
    if not AGENT_ID.fullmatch(values[-1]):
        raise BadRequest(f"agent must be a subagent id, got {values[-1]!r}")
    return values[-1]


def usage_payload(usage: transcripts.MessageUsage, prices: pricing.Prices) -> Payload:
    """One API call's tokens with their estimated cost per category; cost is None for a model without a price (the
    web-search fee counts either way, as in the totals)."""
    counts = {"new_input": usage.new_input, "cache_write_5m": usage.cache_write_5m,
              "cache_write_1h": usage.cache_write_1h, "cache_read": usage.cache_read, "output": usage.output}
    fee = pricing.web_search_cost(prices, usage.web_searches)
    parts = pricing.cost_parts(prices, usage.model, usage.speed, **counts)
    cost_parts = {**dict.fromkeys(queries.COST_PARTS, 0.0), **(parts or {}), "web_search": fee}
    return {**counts, "cache_write": usage.cache_write_5m + usage.cache_write_1h, "web_searches": usage.web_searches,
            "context": usage.context,
            "model": usage.model, "speed": usage.speed, "effort": usage.effort,
            "cost": None if parts is None else sum(parts.values()) + fee, "cost_parts": cost_parts}


def entry_payload(entry: conversation.ChatEntry, prices: pricing.Prices) -> Payload:
    """A conversation entry as JSON-ready fields, a reply's usage with its cost, its growth, the previous reply it
    sent again, its cache rebuild and the token reminder sent with it."""
    fields = dataclasses.asdict(entry)
    step = fields.pop("step")
    reminder_chars = fields.pop("reminder_chars")
    usage = None
    if entry.usage is not None:
        usage = {**usage_payload(entry.usage, prices), "growth": step["growth"] if step else None,
                 "reply": step["reply"] if step else None, "rebuild": step["rebuild"] if step else None,
                 "reminder_chars": reminder_chars}
    return {**fields, "timestamp": scan.iso(entry.timestamp), "usage": usage}


def add_pays(chat_entries: list[conversation.ChatEntry], entries: list[Payload],
             past: list[turns.VersusKeeping | None], prices: pricing.Prices) -> None:
    """Put compact_pays, the estimate, on the usage of each call after which compacting likely pays off
    (turns.pays_estimates, learnt from the stored compactions known at that call, counting its calls since the
    transcript's last compaction)."""
    calls = [index for index, entry in enumerate(chat_entries) if entry.usage is not None]
    history = [conversation.as_turn(chat_entries[index].usage) for index in calls]
    moments = tuple(entry.timestamp for entry in chat_entries if entry.kind == "compaction" and entry.timestamp)
    for index, estimate in zip(calls, turns.pays_estimates(history, moments, past, prices)):
        if estimate is not None:
            entries[index]["usage"]["compact_pays"] = estimate


def reminder_totals(entries: list[Payload]) -> Payload:
    """How many calls had the token reminder folded into their usage, and its characters in all."""
    usages = [entry["usage"] for entry in entries if entry["usage"]]
    chars = [usage["reminder_chars"] for usage in usages if usage["reminder_chars"]]
    return {"calls": len(chars), "chars": sum(chars)}


def secret_order(access: Payload) -> tuple[int, str]:
    """A secret access's place in the list: the most severe first (tool_kinds.secret_reach), then by time."""
    severity = access["severity"]
    rank = SECRET_SEVERITIES.index(severity) if severity in SECRET_SEVERITIES else 0
    return rank, access["time"] or ""


def day_navigation(days: int, until: date, previous_day: date | None, next_day: date | None,
                   today: date) -> Payload:
    """The Daily range's arrows as ISO days: the nearest days with usage before and after until, None for no arrow.
    Only a single day has them. Today stays reachable without usage, and a day past it (a skewed clock) is not."""
    if days != 1:
        previous_day = None
    if days != 1 or until >= today:
        next_day = None
    elif next_day is None or next_day > today:
        next_day = today
    return {name: None if day is None else day.isoformat()
            for name, day in (("previous_day", previous_day), ("next_day", next_day))}


class UsageApp:
    """What the API serves: the store, the transcripts it scans, prices, and the scan throttle."""

    def __init__(self, usage_store: store.Store, projects_dir: Path, prices: pricing.Prices, live_minutes: float,
                 project: str | None = None, prices_checked: str | None = None, retention_days: int = 0,
                 clock: Callable[[], float] = time.monotonic,
                 compact: compact.CompactSettings = compact.DEFAULT_COMPACT,
                 secret_settings: secret_paths.SecretSettings | None = None, home: str | None = None) -> None:
        self.store = usage_store
        self.projects_dir = projects_dir
        self.prices = prices
        self.live_minutes = live_minutes
        self.project = project
        self.prices_checked = prices_checked
        self.clock = clock
        self.compact = compact
        self.retention_days = retention_days
        # the [secrets] patterns, matched against the paths the tool calls name; none looks for nothing
        self.find_secrets = (secret_paths.finder(secret_settings.patterns, home or str(Path.home()),
                                                 secret_settings.network_programs, secret_settings.test_patterns)
                             if secret_settings is not None and secret_settings.patterns else None)
        self.lock = threading.Lock()
        # every stored compaction compared with keeping the context, for the gauge's preview, and the store's change
        # count it was computed at: rebuilt only once a scan changed the store
        self.compaction_history: list[turns.VersusKeeping | None] = []
        self.history_changes: int | None = None
        self.last_scan: float | None = None
        self.scan_errors: tuple[str, ...] = ()
        # each transcript's tool rows and exploration (counts only) and the paths of its secret accesses by its path,
        # with the (size, mtime) they were read at, so an open session's poll reads only the files that changed; its
        # own lock, as it is read outside self.lock
        self.tools_memo: dict[str, tuple[tuple[int, int], Payload]] = {}
        self.tools_lock = threading.Lock()

    def refresh(self) -> None:
        """Scan if the last scan is SCAN_INTERVAL or more ago. Call with the lock held. A failure keeps the stored
        history servable: the history matters most once the transcripts are gone. New errors go to stderr."""
        now = self.clock()
        if self.last_scan is not None and now - self.last_scan < SCAN_INTERVAL:
            return
        try:
            errors = scan.scan(self.store, self.projects_dir, self.project, self.retention_days).errors
        except (OSError, sqlite3.Error) as exc:     # no projects folder, or another scan holds the store too long
            errors = (str(exc),)
        if errors != self.scan_errors:
            for error in errors:
                print(f"scan: {error}", file=sys.stderr, flush=True)
        self.scan_errors = errors
        self.last_scan = now

    def date_range(self, days: int, until: date | None) -> tuple[int, date, date]:
        """The `days` local days up to until (default today, included) as (days, since, until), cut to the retention:
        the store holds no more, so a longer range would only show empty days."""
        until = until or date.today()
        if self.retention_days:
            days = min(days, self.retention_days)
        return days, queries.first_day(days, until), until

    def live(self, days: int | None = None, until: date | None = None) -> Payload:
        """/api/live: the live sessions, with days or until only those active in that range (date_range), which the
        dashboard asks for so they follow the range it shows."""
        since = None
        if days is not None or until is not None:
            days, since, until = self.date_range(queries.DEFAULT_DAYS if days is None else days, until)
        with self.lock:
            self.refresh()
            sessions = queries.live_sessions(self.store, self.live_minutes, self.prices, project=self.project,
                                             since=since, until=until)
            scan_errors = list(self.scan_errors)
        return {"minutes": self.live_minutes, "days": days,
                "since": None if since is None else since.isoformat(),
                "until": None if until is None else until.isoformat(), "sessions": sessions,
                "scan_errors": scan_errors}

    def summary(self, days: int, until: date | None = None) -> Payload:
        """/api/summary: totals of the `days` local days up to until (default today, included), per hour too for a
        single day with the nearest days before and after it that have usage, the run totals of the sessions that
        ended in them, the failed API calls (rate limits), what the main threads' compactions of the range saved so
        far, the newest sessions and the costliest."""
        days, since, until = self.date_range(days, until)
        single_day = days == 1

        def totals(group: str) -> list[Payload]:
            """The range's totals per group."""
            return queries.totals_by(self.store, group, since, self.prices, project=self.project, until=until)

        with self.lock:
            self.refresh()
            groups = {group: totals(group) for group in ("day_model", "agent_type", "project", "model",
                                                         "model_effort", "day_model_effort")}
            # only the turns Claude Code attributes to a skill or an MCP server
            for group in ("skill", "mcp_server"):
                groups[group] = [row for row in totals(group) if row[group] is not None]
            # hours only for a single day: the dashboard draws them instead of one point
            for group in ("hour_model", "hour_model_effort"):
                groups[group] = totals(group) if single_day else []
            api_errors = {
                "day": queries.api_errors_by(self.store, "day", since, project=self.project, until=until),
                "hour": (queries.api_errors_by(self.store, "hour", since, project=self.project, until=until)
                         if single_day else []),
                "events": queries.api_error_events(self.store, since, project=self.project, until=until),
            }
            context = queries.context_stats(self.store, since, project=self.project, until=until)
            runtime = queries.runtime_totals(self.store, since, self.prices, project=self.project, until=until)
            # every session of the range once: all of them for the list, which the page pages and filters, the costliest
            # for the ranking
            sessions = queries.recent_sessions(self.store, since, self.prices, limit=None, project=self.project,
                                               until=until)
            history_since = queries.first_stored_day(self.store, project=self.project)
            savings = queries.compaction_savings(self.store, self.prices, self.compact, since, until, self.project)
            nearest = queries.nearest_days(self.store, until, project=self.project) if single_day else (None, None)
            scan_errors = list(self.scan_errors)
        return {"days": days, "since": since.isoformat(), "until": until.isoformat(),
                **day_navigation(days, until, *nearest, today=date.today()),
                "project_filter": self.project, "retention_days": self.retention_days,
                "history_since": None if history_since is None else history_since.isoformat(),
                "prices_checked": self.prices_checked, "totals": queries.combined(groups["model"]), **groups,
                "runtime": runtime, "api_errors": api_errors, "context": context,
                "compact_hint_tokens": self.compact.hint_tokens, "compaction_savings": savings,
                "scan_errors": scan_errors,
                "sessions": [{field: session[field] for field in SESSION_LIST_FIELDS} for session in sessions],
                "costly_sessions": queries.costliest(sessions)}

    def chat(self, session_id: str, agent_id: str | None) -> Payload | None:
        """/api/session/<id>/chat[?agent=<id>]: the conversation of the main thread or a subagent, read from the
        transcript for this request and never stored; None for an unknown session or agent. Once Claude Code has
        deleted the file, it is unavailable."""
        with self.lock:
            self.refresh()
            path = queries.transcript_path(self.store, session_id, agent_id)
            comparisons = queries.compaction_comparisons(self.store, session_id, agent_id, self.prices, self.compact)
            ultracode = set() if path is None else queries.ultracode_messages(self.store, str(path))
            # only the main thread can be compacted
            past = self.stored_comparisons() if agent_id is None else []
        if path is None:
            return None
        try:
            chat_entries = conversation.conversation(path, self.prices)
        except OSError:
            return {"session_id": session_id, "agent_id": agent_id, "available": False, "entries": [],
                    "reminders": reminder_totals([])}
        entries = [entry_payload(entry, self.prices) for entry in chat_entries]
        if agent_id is None:
            add_pays(chat_entries, entries, past, self.prices)
        for entry in entries:
            # the transcript says xhigh; the scan knows which of those calls ran while ultracode was on
            if entry["message_id"] in ultracode:
                entry["effort"] = store.ULTRACODE
                if entry["usage"] is not None:
                    entry["usage"]["effort"] = store.ULTRACODE
        for entry in entries:
            if entry["kind"] == "compaction":
                # both times come from the same record through scan.iso
                entry["versus_keeping"] = comparisons.get(entry["timestamp"])
        compact.compact_hints(entries, self.compact)
        return {"session_id": session_id, "agent_id": agent_id, "available": True, "entries": entries,
                "reminders": reminder_totals(entries)}

    def stored_comparisons(self) -> list[turns.VersusKeeping | None]:
        """queries.compaction_history, computed again only after the store changed. Call with the lock held."""
        changes = self.store.connection.total_changes
        if changes != self.history_changes:
            self.compaction_history = queries.compaction_history(self.store, self.prices, self.compact)
            self.history_changes = changes
        return self.compaction_history

    def session(self, session_id: str) -> Payload | None:
        """/api/session/<id>, with the main thread's current context against the auto-compact point, what its
        compactions saved so far, whether the session is live (the page polls it faster then), whether its main
        transcript still exists (the page shows the conversation higher up then), each transcript's tools by
        kind (tool_kinds, None once its file is gone), with the gauge the main thread's exploration since its last
        compaction (for the hint to delegate it), and every call of the transcripts still there that named a possible
        secret location (secret_accesses, the most severe first, then by time); None for an unknown id."""
        with self.lock:
            self.refresh()
            detail = queries.session_detail(self.store, session_id, self.prices, read_prompt=False,
                                            settings=self.compact)
            current = queries.current_context(self.store, session_id, self.compact, self.prices,
                                              self.stored_comparisons())
            path = queries.transcript_path(self.store, session_id, None)
            live = queries.session_live(self.store, session_id, self.live_minutes)
            savings = queries.compaction_savings(self.store, self.prices, self.compact, session_id=session_id)
            paths = {row["agent_id"]: Path(row["path"]) for row in queries.session_rows(self.store, session_id)}
        if detail is None:
            return None
        # file reads needn't hold up the other requests
        prompt = None if path is None else transcripts.first_prompt(path)
        secrets = []
        for agent in detail["agents"]:
            agent_path = paths.get(agent["agent_id"])
            tools = None if agent_path is None else self.transcript_tools(agent_path)
            agent["tool_kinds"] = None if tools is None else tools["rows"]
            secrets += [{**access, "agent_type": agent["agent_type"], "agent_id": agent["agent_id"]}
                        for access in (tools["secret_accesses"] if tools is not None else ())]
            if agent["agent_id"] is None and current is not None:
                current["exploration"] = None if tools is None else tools["exploration"]
        return {**detail, "prompt": prompt, "compact_hint_tokens": self.compact.hint_tokens, "current": current,
                "delegate_hint_tokens": self.compact.delegate_hint_tokens,
                "delegate_calls_ahead": self.compact.delegate_calls_ahead,
                "live": live, "compaction_savings": savings, "transcript": path is not None and path.exists(),
                "secret_accesses": sorted(secrets, key=secret_order)}

    def transcript_tools(self, path: Path) -> Payload | None:
        """A transcript's tool rows, exploration and secret accesses (tool_kinds.transcript_tools), read again only
        once the file changed; None once it is gone. Only the counts and those paths stay in memory, for at most
        TOOLS_MEMO_LIMIT files."""
        try:
            stat = path.stat()
            version = (stat.st_size, stat.st_mtime_ns)
            with self.tools_lock:
                cached = self.tools_memo.get(str(path))
            if cached is not None and cached[0] == version:
                return cached[1]
            tools = dataclasses.asdict(tool_kinds.transcript_tools(path, self.prices, self.find_secrets))
        except OSError:
            return None
        with self.tools_lock:
            self.tools_memo.pop(str(path), None)
            self.tools_memo[str(path)] = (version, tools)
            while len(self.tools_memo) > TOOLS_MEMO_LIMIT:
                del self.tools_memo[next(iter(self.tools_memo))]
        return tools


def route_live(app: UsageApp, match: re.Match[str], query: str) -> Payload:
    """/api/live[?days=<n>&until=<day>]: without either, every live session"""
    given = parse_qs(query)
    if "days" not in given and "until" not in given:
        return app.live()
    return app.live(parse_days(query), parse_until(query))


def route_summary(app: UsageApp, match: re.Match[str], query: str) -> Payload:
    """/api/summary?days=<n>&until=<day>"""
    return app.summary(parse_days(query), parse_until(query))


def route_chat(app: UsageApp, match: re.Match[str], query: str) -> Payload:
    """/api/session/<id>/chat?agent=<id>"""
    chat = app.chat(match.group(1), parse_agent(query))
    if chat is None:
        raise NotFound(f"unknown session or agent {match.group(1)}")
    return chat


def route_session(app: UsageApp, match: re.Match[str], query: str) -> Payload:
    """/api/session/<id>"""
    detail = app.session(match.group(1))
    if detail is None:
        raise NotFound(f"unknown session {match.group(1)}")
    return detail


# URL path -> what answers it, from the match and the query string; the first full match answers
API_ROUTES: tuple[tuple[re.Pattern[str], Callable[[UsageApp, re.Match[str], str], Payload]], ...] = (
    (re.compile(r"/api/live"), route_live),
    (re.compile(r"/api/summary"), route_summary),
    (CHAT_PATH, route_chat),
    (SESSION_PATH, route_session),
)


class Handler(BaseHTTPRequestHandler):
    """GET only: the dashboard at /, its stylesheets and scripts under /static/, the JSON API under /api/."""
    server: "UsageServer"
    server_version = "claude-usage"
    timeout = CONNECTION_TIMEOUT

    def do_GET(self) -> None:
        """Route one request; every error is answered as JSON {"error": ...}."""
        if not self.host_is_loopback():
            self.send_json(HTTPStatus.FORBIDDEN, {"error": "only loopback host names are served"})
            return
        url = urlsplit(self.path)
        app = self.server.app
        try:
            if url.path == "/":
                self.send_dashboard()
                return
            if url.path in ASSETS:
                self.send_asset(ASSETS[url.path])
                return
            for pattern, route in API_ROUTES:
                match = pattern.fullmatch(url.path)
                if match:
                    self.send_json(HTTPStatus.OK, route(app, match, url.query))
                    return
            raise NotFound(f"not found: {url.path}")
        except BadRequest as exc:
            self.send_json(HTTPStatus.BAD_REQUEST, {"error": str(exc)})
        except NotFound as exc:
            self.send_json(HTTPStatus.NOT_FOUND, {"error": str(exc)})
        except (BrokenPipeError, ConnectionResetError):
            return                                      # the page went away mid-answer; nobody to tell
        except Exception as exc:                        # deliberately broad: answer as JSON, keep serving
            traceback.print_exc()                       # into the log: the page only gets the message
            self.send_json(HTTPStatus.INTERNAL_SERVER_ERROR, {"error": f"{type(exc).__name__}: {exc}"})

    def host_is_loopback(self) -> bool:
        """True if the Host header names a loopback host (or is missing, as in HTTP/1.0)."""
        header = self.headers.get("Host")
        if header is None:
            return True
        match = HOST_WITH_PORT.match(header.strip())
        return match is not None and is_loopback(match.group("host"))

    def send_body(self, status: HTTPStatus, content_type: str, body: bytes, headers: dict[str, str]) -> None:
        """Send a complete response."""
        self.send_response(status)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.send_header("X-Content-Type-Options", "nosniff")
        for name, value in headers.items():
            self.send_header(name, value)
        self.end_headers()
        self.wfile.write(body)

    def send_json(self, status: HTTPStatus, payload: Payload) -> None:
        """Send a JSON response."""
        body = json.dumps(payload, ensure_ascii=False, allow_nan=False).encode("utf-8")   # the page's JSON has no NaN
        self.send_body(status, "application/json; charset=utf-8", body, {})

    def send_dashboard(self) -> None:
        """Send the dashboard page with its content security policy."""
        body = DASHBOARD.read_bytes()
        self.send_body(HTTPStatus.OK, "text/html; charset=utf-8", body,
                       {"Content-Security-Policy": DASHBOARD_POLICY, "Referrer-Policy": "no-referrer"})

    def send_asset(self, path: Path) -> None:
        """Send one of the dashboard's stylesheets or scripts."""
        self.send_body(HTTPStatus.OK, ASSET_TYPES[path.suffix], path.read_bytes(), {})

    def log_message(self, format: str, *args: Any) -> None:
        """Quiet: the dashboard polls every few seconds, so an access log would only be noise."""


class UsageServer(ThreadingHTTPServer):
    """The HTTP server, carrying the app for its handlers."""
    daemon_threads = True

    def __init__(self, address: tuple[str, int], app: UsageApp) -> None:
        self.app = app
        super().__init__(address, Handler)


class UsageServer6(UsageServer):
    """UsageServer on an IPv6 address (::1)."""
    address_family = socket.AF_INET6


def make_server(app: UsageApp, host: str, port: int) -> UsageServer:
    """A server bound to host:port; raises ValueError for anything but a loopback host."""
    if not is_loopback(host):
        raise ValueError(f"refusing to serve on {host}: only loopback addresses (127.0.0.1, ::1, localhost)")
    if ":" in host:
        return UsageServer6((host, port), app)
    return UsageServer((host, port), app)
