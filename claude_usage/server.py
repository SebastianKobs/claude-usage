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
import math
import re
import socket
import sqlite3
import sys
import threading
import time
import traceback
from collections.abc import Callable
from datetime import date
from datetime import timedelta
from http import HTTPStatus
from http.server import BaseHTTPRequestHandler
from http.server import ThreadingHTTPServer
from pathlib import Path
from typing import Any
from urllib.parse import parse_qs
from urllib.parse import urlsplit

from claude_usage import config
from claude_usage import pricing
from claude_usage import store
from claude_usage import transcripts

STATIC = Path(__file__).resolve().parent / "static"
DASHBOARD = STATIC / "dashboard.html"
ASSET_TYPES = {".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8"}
# URL path -> file, fixed at start: only what is in these folders is served, so no URL can reach another file
ASSETS = {f"/static/{path.relative_to(STATIC).as_posix()}": path
          for folder in ("css", "js") for path in sorted((STATIC / folder).rglob("*")) if path.suffix in ASSET_TYPES}
SCAN_INTERVAL = 5.0                     # seconds between scans triggered by requests
CONNECTION_TIMEOUT = 30                 # seconds an idle connection may keep its handler thread
DEFAULT_DAYS = 30
MAX_DAYS = 3650
SESSION_PATH = re.compile(r"/api/session/([A-Za-z0-9_-]{1,128})")
CHAT_PATH = re.compile(r"/api/session/([A-Za-z0-9_-]{1,128})/chat")
AGENT_ID = re.compile(r"[A-Za-z0-9_-]{1,128}")
HOST_WITH_PORT = re.compile(r"^\[?(?P<host>[^\]]*?)\]?(?::\d+)?$")
# no inline scripts or stylesheets; style attributes stay allowed, as the charts set colors and sizes with them
DASHBOARD_POLICY = ("default-src 'none'; script-src 'self'; style-src 'self'; style-src-attr 'unsafe-inline'; "
                    "connect-src 'self'; img-src data:; base-uri 'none'; form-action 'none'; frame-ancestors 'none'")

Payload = dict[str, Any]


class BadRequest(Exception):
    """The request is malformed; the message is sent back as the error."""


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
        return DEFAULT_DAYS
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


@dataclasses.dataclass(frozen=True)
class CompactSettings:
    """When the conversation hints at compacting ([chat] and [auto_compact] in the config)."""
    hint_tokens: int                    # the soft hint: a heuristic threshold, not an Anthropic number
    warn_share: float                   # the stronger warning from this share of the auto-compact point on
    auto_compact: dict[str, int]        # where Claude Code auto-compacts, by model id prefix, and "default"
    reminder_step: float = 0.5          # a soft reminder at each further this share of hint_tokens
    auto_reminder_step: float = 0.05    # an auto reminder at each further this share of the auto-compact point


# about 967K on models with a native 1M window, 200K on 200K windows (code.claude.com/docs/en/model-config)
DEFAULT_COMPACT = CompactSettings(hint_tokens=200_000, warn_share=0.8, auto_compact={"default": 967_000})


def positive_number(owner: str, value: Any, whole: bool) -> float:
    """value as a positive finite number (a whole one if whole); raises ConfigError naming owner otherwise."""
    kinds = (int,) if whole else (int, float)
    if isinstance(value, bool) or not isinstance(value, kinds) or not math.isfinite(value) or value <= 0:
        raise config.ConfigError(f"{owner}: expected a positive {'whole ' if whole else ''}number, got {value!r}")
    return value


def parse_compact_settings(values: Payload) -> CompactSettings:
    """The compact settings of the config's [chat] and [auto_compact] tables, missing values from
    DEFAULT_COMPACT; raises ConfigError for a value that isn't a positive number (a share at most 1)."""
    for table in ("chat", "auto_compact"):
        if not isinstance(values.get(table, {}), dict):
            raise config.ConfigError(f"{table}: expected a table, got {values[table]!r}")
    chat = values.get("chat") or {}
    hint = positive_number("chat.compact_hint_tokens", chat.get("compact_hint_tokens", DEFAULT_COMPACT.hint_tokens),
                           whole=True)
    share = positive_number("chat.auto_compact_warn_share",
                            chat.get("auto_compact_warn_share", DEFAULT_COMPACT.warn_share), whole=False)
    if share > 1:
        raise config.ConfigError(f"chat.auto_compact_warn_share: expected a share up to 1, got {share!r}")
    step = positive_number("chat.compact_reminder_step",
                           chat.get("compact_reminder_step", DEFAULT_COMPACT.reminder_step), whole=False)
    auto_step = positive_number("chat.auto_compact_reminder_step",
                                chat.get("auto_compact_reminder_step", DEFAULT_COMPACT.auto_reminder_step),
                                whole=False)
    if auto_step > 1:
        raise config.ConfigError(f"chat.auto_compact_reminder_step: expected a share up to 1, got {auto_step!r}")
    points = {**DEFAULT_COMPACT.auto_compact}
    for model, point in (values.get("auto_compact") or {}).items():
        points[model] = int(positive_number(f"auto_compact.{model}", point, whole=True))
    return CompactSettings(int(hint), float(share), points, float(step), float(auto_step))


def auto_compact_point(settings: CompactSettings, model: str) -> int:
    """Where Claude Code auto-compacts a conversation with this model: the longest prefix's, else the default."""
    by_model = {prefix: point for prefix, point in settings.auto_compact.items() if prefix != "default"}
    return pricing.longest_prefix(by_model, model) or settings.auto_compact["default"]


def next_milestone(ratio: float, start: float, step: float) -> float:
    """The first of start, start + step, start + 2 step, ... above ratio: where the next reminder is due."""
    # the small tolerance keeps a ratio that lands exactly on a milestone from being taken for one below it
    return start + (math.floor((ratio - start) / step + 1e-9) + 1) * step


def compact_hints(entries: list[Payload], settings: CompactSettings) -> None:
    """Set compact_hint on the conversation entries, per stretch between compactions, in two tiers:
    - soft: "soft" where a call's context first reaches hint_tokens (with what re-reading it cost), then a
      "soft_reminder" at each further reminder_step of hint_tokens (1.5x, 2x, ... by default);
    - auto: "auto" where it first reaches warn_share of the model's auto-compact point, then an "auto_reminder"
      at each further auto_reminder_step of that point (85 %, 90 %, ... by default).
    A call gets at most one hint, the highest milestone it passed; once the auto tier has spoken the soft tier is
    quiet, so the stronger one takes over."""
    soft_next: float | None = None      # the next soft milestone, as a multiple of hint_tokens; None: not yet shown
    auto_next: float | None = None      # the next auto milestone, as a share of the auto-compact point
    for entry in entries:
        if entry.get("kind") == "compaction":
            soft_next = None
            auto_next = None
            continue
        usage = entry.get("usage")
        if not usage:
            continue
        context = usage["context"]
        point = auto_compact_point(settings, usage["model"])
        share = context / point
        times = context / settings.hint_tokens
        if auto_next is None and share >= settings.warn_share:
            entry["compact_hint"] = {"kind": "auto", "context": context, "auto_compact": point,
                                     "share": round(share, 2)}
            auto_next = next_milestone(share, settings.warn_share, settings.auto_reminder_step)
        elif auto_next is not None:
            if share >= auto_next - 1e-9:
                entry["compact_hint"] = {"kind": "auto_reminder", "context": context, "auto_compact": point,
                                         "share": round(share, 2)}
                auto_next = next_milestone(share, settings.warn_share, settings.auto_reminder_step)
        elif soft_next is None and times >= 1:
            entry["compact_hint"] = {"kind": "soft", "context": context, "threshold": settings.hint_tokens,
                                     "reread_cost": usage["cost_parts"]["cache_read"]}
            soft_next = next_milestone(times, 1.0, settings.reminder_step)
        elif soft_next is not None and times >= soft_next - 1e-9:
            entry["compact_hint"] = {"kind": "soft_reminder", "context": context, "threshold": settings.hint_tokens,
                                     "times": round(times, 1)}
            soft_next = next_milestone(times, 1.0, settings.reminder_step)


def usage_payload(usage: transcripts.MessageUsage, prices: pricing.Prices) -> Payload:
    """One API call's tokens with their estimated cost per category; cost is None for a model without a price (the
    web-search fee counts either way, as in the totals)."""
    counts = {"new_input": usage.new_input, "cache_write_5m": usage.cache_write_5m,
              "cache_write_1h": usage.cache_write_1h, "cache_read": usage.cache_read, "output": usage.output}
    fee = pricing.web_search_cost(prices, usage.web_searches)
    parts = pricing.cost_parts(prices, usage.model, usage.speed, **counts)
    cost_parts = {**dict.fromkeys(store.COST_PARTS, 0.0), **(parts or {}), "web_search": fee}
    context = usage.new_input + usage.cache_write_5m + usage.cache_write_1h + usage.cache_read
    return {**counts, "cache_write": usage.cache_write_5m + usage.cache_write_1h, "web_searches": usage.web_searches,
            "context": context,
            "model": usage.model, "speed": usage.speed, "effort": usage.effort,
            "cost": None if parts is None else sum(parts.values()) + fee, "cost_parts": cost_parts}


def entry_payload(entry: transcripts.ChatEntry, prices: pricing.Prices) -> Payload:
    """A conversation entry as JSON-ready fields, a reply's usage with its cost."""
    return {**dataclasses.asdict(entry), "timestamp": store.iso(entry.timestamp),
            "usage": None if entry.usage is None else usage_payload(entry.usage, prices)}


class UsageApp:
    """What the API serves: the store, the transcripts it scans, prices, and the scan throttle."""

    def __init__(self, usage_store: store.Store, projects_dir: Path, prices: pricing.Prices, live_minutes: float,
                 project: str | None = None, prices_checked: str | None = None,
                 clock: Callable[[], float] = time.monotonic, compact: CompactSettings = DEFAULT_COMPACT) -> None:
        self.store = usage_store
        self.projects_dir = projects_dir
        self.prices = prices
        self.live_minutes = live_minutes
        self.project = project
        self.prices_checked = prices_checked
        self.clock = clock
        self.compact = compact
        self.lock = threading.Lock()
        self.last_scan: float | None = None
        self.scan_errors: tuple[str, ...] = ()

    def refresh(self) -> None:
        """Scan if the last scan is SCAN_INTERVAL or more ago. Call with the lock held. A failure keeps the stored
        history servable: the history matters most once the transcripts are gone. New errors go to stderr."""
        now = self.clock()
        if self.last_scan is not None and now - self.last_scan < SCAN_INTERVAL:
            return
        try:
            errors = store.scan(self.store, self.projects_dir, self.project).errors
        except (OSError, sqlite3.Error) as exc:     # no projects folder, or another scan holds the store too long
            errors = (str(exc),)
        if errors != self.scan_errors:
            for error in errors:
                print(f"scan: {error}", file=sys.stderr, flush=True)
        self.scan_errors = errors
        self.last_scan = now

    def live(self) -> Payload:
        """/api/live"""
        with self.lock:
            self.refresh()
            sessions = store.live_sessions(self.store, self.live_minutes, self.prices, project=self.project)
            scan_errors = list(self.scan_errors)
        return {"minutes": self.live_minutes, "sessions": sessions, "scan_errors": scan_errors}

    def summary(self, days: int, until: date | None = None) -> Payload:
        """/api/summary: totals of the `days` local days up to until (default today, included), per hour too for a
        single day with the nearest days before and after it that have usage, the run totals of the sessions that
        ended in them, the failed API calls (rate limits), the newest sessions and the costliest."""
        until = until or date.today()
        since = until - timedelta(days=days - 1)
        with self.lock:
            self.refresh()
            groups = {group: store.totals_by(self.store, group, since, self.prices, project=self.project,
                                             until=until)
                      for group in ("day_model", "agent_type", "project", "model", "model_effort")}
            # only the turns Claude Code attributes to a skill or an MCP server
            for group in ("skill", "mcp_server"):
                groups[group] = [row for row in store.totals_by(self.store, group, since, self.prices,
                                                                project=self.project, until=until)
                                 if row[group] is not None]
            # hours only for a single day: the dashboard draws them instead of one point
            groups["hour_model"] = (store.totals_by(self.store, "hour_model", since, self.prices,
                                                    project=self.project, until=until)
                                    if days == 1 else [])
            # the by-model chart splits its columns by model or by effort level
            groups["day_model_effort"] = store.totals_by(self.store, "day_model_effort", since, self.prices,
                                                         project=self.project, until=until)
            groups["hour_model_effort"] = (store.totals_by(self.store, "hour_model_effort", since, self.prices,
                                                           project=self.project, until=until)
                                           if days == 1 else [])
            api_errors = {
                "day": store.api_errors_by(self.store, "day", since, project=self.project, until=until),
                "hour": (store.api_errors_by(self.store, "hour", since, project=self.project, until=until)
                         if days == 1 else []),
                "events": store.api_error_events(self.store, since, project=self.project, until=until),
            }
            context = store.context_stats(self.store, since, project=self.project, until=until)
            runtime = store.runtime_totals(self.store, since, self.prices, project=self.project, until=until)
            # every session of the range once: the newest for the list, the costliest for the ranking
            sessions = store.recent_sessions(self.store, since, self.prices, limit=None, project=self.project,
                                             until=until)
            previous_day, next_day = (None, None)
            if days == 1:
                previous_day, next_day = store.nearest_days(self.store, until, project=self.project)
            scan_errors = list(self.scan_errors)
        # today stays reachable without usage, and a day past it (a skewed clock) is not
        if days != 1 or until >= date.today():
            next_day = None
        elif next_day is None or next_day > date.today():
            next_day = date.today()
        nearest = {name: None if day is None else day.isoformat()
                   for name, day in (("previous_day", previous_day), ("next_day", next_day))}
        return {"days": days, "since": since.isoformat(), "until": until.isoformat(), **nearest,
                "project_filter": self.project,
                "prices_checked": self.prices_checked, "totals": store.combined(groups["model"]), **groups,
                "runtime": runtime, "api_errors": api_errors, "context": context,
                "compact_hint_tokens": self.compact.hint_tokens, "scan_errors": scan_errors,
                "sessions": sessions[:store.DEFAULT_SESSION_LIMIT], "costly_sessions": store.costliest(sessions)}

    def chat(self, session_id: str, agent_id: str | None) -> Payload | None:
        """/api/session/<id>/chat[?agent=<id>]: the conversation of the main thread or a subagent, read from the
        transcript for this request and never stored; None for an unknown session or agent. Once Claude Code has
        deleted the file, it is unavailable."""
        with self.lock:
            self.refresh()
            path = store.transcript_path(self.store, session_id, agent_id)
        if path is None:
            return None
        try:
            entries = [entry_payload(entry, self.prices) for entry in transcripts.conversation(path)]
        except OSError:
            return {"session_id": session_id, "agent_id": agent_id, "available": False, "entries": []}
        compact_hints(entries, self.compact)
        return {"session_id": session_id, "agent_id": agent_id, "available": True, "entries": entries}

    def session(self, session_id: str) -> Payload | None:
        """/api/session/<id>, or None for an unknown id."""
        with self.lock:
            self.refresh()
            detail = store.session_detail(self.store, session_id, self.prices, read_prompt=False)
            path = store.transcript_path(self.store, session_id, None)
        if detail is None:
            return None
        # a file read needn't hold up the other requests
        prompt = None if path is None else transcripts.first_prompt(path)
        return {**detail, "prompt": prompt, "compact_hint_tokens": self.compact.hint_tokens}


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
            if url.path == "/api/live":
                self.send_json(HTTPStatus.OK, app.live())
                return
            if url.path == "/api/summary":
                self.send_json(HTTPStatus.OK, app.summary(parse_days(url.query), parse_until(url.query)))
                return
            match = CHAT_PATH.fullmatch(url.path)
            if match:
                chat = app.chat(match.group(1), parse_agent(url.query))
                if chat is None:
                    self.send_json(HTTPStatus.NOT_FOUND, {"error": f"unknown session or agent {match.group(1)}"})
                else:
                    self.send_json(HTTPStatus.OK, chat)
                return
            match = SESSION_PATH.fullmatch(url.path)
            if match:
                detail = app.session(match.group(1))
                if detail is None:
                    self.send_json(HTTPStatus.NOT_FOUND, {"error": f"unknown session {match.group(1)}"})
                else:
                    self.send_json(HTTPStatus.OK, detail)
                return
            self.send_json(HTTPStatus.NOT_FOUND, {"error": f"not found: {url.path}"})
        except BadRequest as exc:
            self.send_json(HTTPStatus.BAD_REQUEST, {"error": str(exc)})
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
