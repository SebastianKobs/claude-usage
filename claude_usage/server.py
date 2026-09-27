"""The local dashboard: a ThreadingHTTPServer on a loopback address only, serving static/dashboard.html with its
stylesheets and scripts, and a small JSON API. Every API request first runs an incremental scan, at most every SCAN_INTERVAL seconds, behind a lock that
also serializes all store access (one SQLite connection shared by the handler threads).

The API exposes session titles and first prompts, so besides binding to loopback the server refuses requests whose
Host header isn't a loopback name: that stops a web page from reading it through DNS rebinding.
"""
import ipaddress
import json
import re
import socket
import threading
import time
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

from claude_usage import pricing
from claude_usage import store

STATIC = Path(__file__).resolve().parent / "static"
DASHBOARD = STATIC / "dashboard.html"
ASSET_TYPES = {".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8"}
# URL path -> file, fixed at start: only what is in these folders is served, so no URL can reach another file
ASSETS = {f"/static/{path.relative_to(STATIC).as_posix()}": path
          for folder in ("css", "js") for path in sorted((STATIC / folder).rglob("*")) if path.suffix in ASSET_TYPES}
SCAN_INTERVAL = 5.0                     # seconds between scans triggered by requests
DEFAULT_DAYS = 30
MAX_DAYS = 3650
SESSION_PATH = re.compile(r"/api/session/([A-Za-z0-9_-]{1,128})")
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
    if not text.isdigit() or not 1 <= int(text) <= MAX_DAYS:
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


class UsageApp:
    """What the API serves: the store, the transcripts it scans, prices, and the scan throttle."""

    def __init__(self, usage_store: store.Store, projects_dir: Path, prices: pricing.Prices, live_minutes: float,
                 project: str | None = None, prices_checked: str | None = None,
                 clock: Callable[[], float] = time.monotonic) -> None:
        self.store = usage_store
        self.projects_dir = projects_dir
        self.prices = prices
        self.live_minutes = live_minutes
        self.project = project
        self.prices_checked = prices_checked
        self.clock = clock
        self.lock = threading.Lock()
        self.last_scan: float | None = None

    def refresh(self) -> None:
        """Scan if the last scan is SCAN_INTERVAL or more ago. Call with the lock held."""
        now = self.clock()
        if self.last_scan is not None and now - self.last_scan < SCAN_INTERVAL:
            return
        store.scan(self.store, self.projects_dir, self.project)
        self.last_scan = now

    def live(self) -> Payload:
        """/api/live"""
        with self.lock:
            self.refresh()
            sessions = store.live_sessions(self.store, self.live_minutes, self.prices, project=self.project)
        return {"minutes": self.live_minutes, "sessions": sessions}

    def summary(self, days: int, until: date | None = None) -> Payload:
        """/api/summary: totals of the `days` local days up to until (default today, included), per hour too for a
        single day with the nearest days before and after it that have usage, the newest sessions in them and the
        costliest."""
        until = until or date.today()
        since = until - timedelta(days=days - 1)
        with self.lock:
            self.refresh()
            groups = {group: store.totals_by(self.store, group, since, self.prices, project=self.project,
                                             until=until)
                      for group in ("day_model", "agent_type", "project", "model")}
            # hours only for a single day: the dashboard draws them instead of one point
            groups["hour_model"] = (store.totals_by(self.store, "hour_model", since, self.prices,
                                                    project=self.project, until=until)
                                    if days == 1 else [])
            # every session of the range once: the newest for the list, the costliest for the ranking
            sessions = store.recent_sessions(self.store, since, self.prices, limit=None, project=self.project,
                                             until=until)
            previous_day, next_day = (None, None)
            if days == 1:
                previous_day, next_day = store.nearest_days(self.store, until, project=self.project)
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
                "sessions": sessions[:store.DEFAULT_SESSION_LIMIT], "costly_sessions": store.costliest(sessions)}

    def session(self, session_id: str) -> Payload | None:
        """/api/session/<id>, or None for an unknown id."""
        with self.lock:
            self.refresh()
            return store.session_detail(self.store, session_id, self.prices)


class Handler(BaseHTTPRequestHandler):
    """GET only: the dashboard at /, its stylesheets and scripts under /static/, the JSON API under /api/."""
    server: "UsageServer"
    server_version = "claude-usage"

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
        except Exception as exc:                        # deliberately broad: answer as JSON, keep serving
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
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
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
