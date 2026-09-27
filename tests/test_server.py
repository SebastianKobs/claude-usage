"""server.py: the JSON API and the dashboard page, on a real server bound to a free loopback port."""
import json
import shutil
import threading
import unittest
import urllib.error
import urllib.request
from datetime import UTC
from datetime import date
from datetime import datetime
from datetime import timedelta
from unittest import mock

from claude_usage import pricing
from claude_usage import server
from claude_usage import store
from helpers import TempDirTestCase
from helpers import text_block
from helpers import tool_use_block
from helpers import usage

PRICES = pricing.parse_prices({
    "claude-sonnet-5": {"input": 2.0, "cache_write_5m": 2.5, "cache_write_1h": 4.0, "cache_read": 0.2,
                        "output": 10.0},
})
# urllib must not route 127.0.0.1 through a proxy from the environment
OPENER = urllib.request.build_opener(urllib.request.ProxyHandler({}))


class FakeClock:
    """A monotonic clock the test moves by hand."""

    def __init__(self):
        self.now = 1000.0

    def __call__(self):
        return self.now


class ServerCase(TempDirTestCase):
    """Two sessions in two projects, and a server for them on a free port."""
    project = None

    def setUp(self):
        super().setUp()
        now = datetime.now(UTC)         # the summary counts days back from today
        self.main = self.projects.session("s1", project="/home/dev/app").at(now)
        self.main.user("Fix the parser")
        self.main.ai_title("Parser fix")
        self.main.assistant("m1", [tool_use_block("t1", "Read")], usage(new=10, cache_read=100, output=50))
        self.main.tool_result("t1", "abc")
        agent = self.projects.subagent("s1", "a1", project="/home/dev/app").at(now)
        agent.assistant("m2", [text_block("ok")], usage(output=5))
        other = self.projects.session("s2", project="/home/dev/other").at(now)
        other.assistant("m3", [text_block("x")], usage(output=7))
        self.clock = FakeClock()
        self.store = store.Store(self.store_path, check_same_thread=False)
        self.addCleanup(self.store.close)
        self.app = server.UsageApp(self.store, self.projects.root, PRICES, live_minutes=5, project=self.project,
                                   prices_checked="2026-09-27", clock=self.clock)
        self.httpd = server.make_server(self.app, "127.0.0.1", 0)
        thread = threading.Thread(target=self.httpd.serve_forever, kwargs={"poll_interval": 0.05}, daemon=True)
        thread.start()
        self.addCleanup(thread.join)
        self.addCleanup(self.httpd.server_close)
        self.addCleanup(self.httpd.shutdown)
        self.port = self.httpd.server_address[1]

    def get(self, path, headers=None):
        """(status, headers, body) of a GET request; HTTP errors are returned, not raised."""
        request = urllib.request.Request(f"http://127.0.0.1:{self.port}{path}", headers=headers or {})
        try:
            with OPENER.open(request, timeout=10) as response:
                return response.status, response.headers, response.read()
        except urllib.error.HTTPError as error:
            with error:
                return error.code, error.headers, error.read()

    def get_json(self, path, headers=None):
        """(status, parsed JSON body) of a GET request."""
        status, response_headers, body = self.get(path, headers)
        self.assertEqual(response_headers["Content-Type"], "application/json; charset=utf-8")
        return status, json.loads(body)


class DashboardTest(ServerCase):
    def test_root_serves_the_dashboard(self):
        status, headers, body = self.get("/")
        self.assertEqual(status, 200)
        self.assertEqual(headers["Content-Type"], "text/html; charset=utf-8")
        self.assertTrue(body.lstrip().lower().startswith(b"<!doctype html>"))

    def test_dashboard_is_self_contained(self):
        _, headers, body = self.get("/")
        self.assertIn("default-src 'none'", headers["Content-Security-Policy"])
        body = body.replace(b"http://www.w3.org/2000/svg", b"")      # the SVG namespace name, not a resource
        for external in (b"<script src=", b'<link rel="stylesheet"', b"https://", b"http://"):
            with self.subTest(external=external):
                self.assertNotIn(external, body)

    def test_dashboard_calls_the_api_endpoints(self):
        _, _, body = self.get("/")
        for endpoint in (b"/api/live", b"/api/summary", b"/api/session/"):
            with self.subTest(endpoint=endpoint):
                self.assertIn(endpoint, body)


class ApiTest(ServerCase):
    def test_live(self):
        status, payload = self.get_json("/api/live")
        self.assertEqual(status, 200)
        self.assertEqual(payload["minutes"], 5)
        sessions = {session["session_id"]: session for session in payload["sessions"]}
        self.assertEqual(sorted(sessions), ["s1", "s2"])
        self.assertEqual((sessions["s1"]["title"], sessions["s1"]["turns"]), ("Parser fix", 2))

    def test_summary_shape(self):
        status, payload = self.get_json("/api/summary?days=7")
        self.assertEqual(status, 200)
        self.assertEqual(payload["days"], 7)
        self.assertEqual(payload["since"], (date.today() - timedelta(days=6)).isoformat())
        self.assertEqual(payload["prices_checked"], "2026-09-27")
        for key in ("day_model", "agent_type", "project", "model", "sessions"):
            with self.subTest(key=key):
                self.assertIsInstance(payload[key], list)
        self.assertEqual(set(payload["day_model"][0]) >= {"day", "model", "turns", "output", "cost"}, True)
        self.assertEqual(payload["totals"]["turns"], 3)
        self.assertEqual(payload["totals"]["output"], 62)

    def test_summary_defaults_to_30_days(self):
        _, payload = self.get_json("/api/summary")
        self.assertEqual((payload["days"], payload["since"]),
                         (30, (date.today() - timedelta(days=29)).isoformat()))

    def test_summary_rejects_bad_days(self):
        for days in ("abc", "0", "-3", "100000", "7.5"):
            with self.subTest(days=days):
                status, payload = self.get_json(f"/api/summary?days={days}")
                self.assertEqual(status, 400)
                self.assertIn("days", payload["error"])

    def test_session_detail(self):
        status, payload = self.get_json("/api/session/s1")
        self.assertEqual(status, 200)
        self.assertEqual((payload["title"], payload["prompt"]), ("Parser fix", "Fix the parser"))
        self.assertEqual([agent["agent_type"] for agent in payload["agents"]], ["main", "general-purpose"])
        self.assertEqual(payload["agents"][0]["tools"], [{"tool": "Read", "calls": 1, "result_chars": 3}])

    def test_unknown_session_is_404(self):
        status, payload = self.get_json("/api/session/nope")
        self.assertEqual(status, 404)
        self.assertIn("nope", payload["error"])

    def test_unknown_paths_are_404(self):
        for path in ("/nothing", "/api", "/api/session/", "/api/session/a/b", "/api/session/..%2F..%2Fetc"):
            with self.subTest(path=path):
                status, payload = self.get_json(path)
                self.assertEqual(status, 404)
                self.assertIn("error", payload)

    def test_json_is_not_cached(self):
        _, headers, _ = self.get("/api/live")
        self.assertEqual(headers["Cache-Control"], "no-store")
        self.assertEqual(headers["X-Content-Type-Options"], "nosniff")


class HostTest(ServerCase):
    def test_non_loopback_bind_is_refused(self):
        for host in ("0.0.0.0", "192.168.1.5", "example.com", "::"):
            with self.subTest(host=host):
                with self.assertRaises(ValueError):
                    server.make_server(self.app, host, 0)

    def test_loopback_names_are_accepted(self):
        for host in ("127.0.0.1", "localhost", "::1", "127.0.0.2"):
            with self.subTest(host=host):
                self.assertTrue(server.is_loopback(host))

    def test_foreign_host_header_is_forbidden(self):
        for host in ("evil.example", "evil.example:8765", "192.168.1.5"):
            with self.subTest(host=host):
                status, payload = self.get_json("/api/live", headers={"Host": host})
                self.assertEqual(status, 403)
                self.assertIn("error", payload)

    def test_loopback_host_headers_are_allowed(self):
        for host in (f"localhost:{self.port}", f"127.0.0.1:{self.port}", f"[::1]:{self.port}", "localhost"):
            with self.subTest(host=host):
                self.assertEqual(self.get("/api/live", headers={"Host": host})[0], 200)


class ScanTest(ServerCase):
    def test_requests_scan_at_most_every_interval(self):
        with mock.patch.object(server.store, "scan", wraps=store.scan) as scan:
            self.get("/api/live")
            self.get("/api/summary")
            self.assertEqual(scan.call_count, 1)
            self.clock.now += server.SCAN_INTERVAL
            self.get("/api/live")
            self.assertEqual(scan.call_count, 2)

    def test_new_data_shows_after_the_interval(self):
        self.get("/api/live")
        self.main.assistant("m4", [text_block("more")], usage(output=1))
        self.assertEqual(self.get_json("/api/session/s1")[1]["turns"], 2)
        self.clock.now += server.SCAN_INTERVAL
        self.assertEqual(self.get_json("/api/session/s1")[1]["turns"], 3)

    def test_a_failing_scan_is_a_json_500(self):
        shutil.rmtree(self.projects.root)
        status, payload = self.get_json("/api/live")
        self.assertEqual(status, 500)
        self.assertIn("projects folder not found", payload["error"])


class ProjectFilterTest(ServerCase):
    project = "/home/dev/other"

    def test_only_the_projects_sessions(self):
        _, live = self.get_json("/api/live")
        self.assertEqual([session["session_id"] for session in live["sessions"]], ["s2"])
        _, summary = self.get_json("/api/summary")
        self.assertEqual([row["project"] for row in summary["project"]], ["/home/dev/other"])
        self.assertEqual(summary["project_filter"], "/home/dev/other")


if __name__ == "__main__":
    unittest.main()
