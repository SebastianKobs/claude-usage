"""server.py: the JSON API and the dashboard page, on a real server bound to a free loopback port."""
import json
import re
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

    def page_assets(self):
        """The same-origin stylesheets and scripts the page links, in page order."""
        _, _, body = self.get("/")
        return re.findall(r'(?:href|src)="(/static/[^"]+)"', body.decode("utf-8"))

    def test_page_links_its_styles_and_scripts(self):
        assets = self.page_assets()
        self.assertTrue(any(asset.endswith(".css") for asset in assets))
        self.assertTrue(any(asset.endswith(".js") for asset in assets))

    def test_page_has_no_inline_styles_or_scripts(self):
        _, _, body = self.get("/")
        self.assertNotIn(b"<style", body)
        self.assertEqual(re.findall(rb"<script(?![^>]*\bsrc=)[^>]*>", body), [])

    def test_assets_are_served_with_their_type(self):
        types = {".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8"}
        for asset in self.page_assets():
            with self.subTest(asset=asset):
                status, headers, _ = self.get(asset)
                self.assertEqual(status, 200)
                self.assertEqual(headers["Content-Type"], types[asset[asset.rindex("."):]])
                self.assertEqual(headers["X-Content-Type-Options"], "nosniff")

    def test_only_existing_assets_are_served(self):
        for path in ("/static/js/missing.js", "/static/dashboard.html", "/static/../server.py",
                     "/static/js/../../server.py", "/static/config.toml"):
            with self.subTest(path=path):
                status, _, _ = self.get(path)
                self.assertEqual(status, 404)

    def test_dashboard_is_self_contained(self):
        _, headers, _ = self.get("/")
        policy = headers["Content-Security-Policy"]
        self.assertIn("default-src 'none'", policy)
        self.assertIn("script-src 'self';", policy)
        for path in ["/", *self.page_assets()]:
            _, _, body = self.get(path)
            body = body.replace(b"http://www.w3.org/2000/svg", b"")      # the SVG namespace name, not a resource
            for external in (b"https://", b"http://", b"@import"):
                with self.subTest(path=path, external=external):
                    self.assertNotIn(external, body)

    def test_dashboard_calls_the_api_endpoints(self):
        scripts = b"".join(self.get(asset)[2] for asset in self.page_assets() if asset.endswith(".js"))
        for endpoint in (b"/api/live", b"/api/summary", b"/api/session/"):
            with self.subTest(endpoint=endpoint):
                self.assertIn(endpoint, scripts)


class ApiTest(ServerCase):
    def test_live(self):
        status, payload = self.get_json("/api/live")
        self.assertEqual(status, 200)
        self.assertEqual(payload["minutes"], 5)
        sessions = {session["session_id"]: session for session in payload["sessions"]}
        self.assertEqual(sorted(sessions), ["s1", "s2"])
        self.assertEqual((sessions["s1"]["title"], sessions["s1"]["turns"]), ("Parser fix", 2))

    def test_summary_of_today_has_hourly_totals(self):
        status, payload = self.get_json("/api/summary?days=1")
        self.assertEqual(status, 200)
        self.assertTrue(payload["hour_model"])
        self.assertEqual(set(payload["hour_model"][0]) >= {"hour", "model", "turns", "output", "cost"}, True)
        self.assertTrue(all(row["hour"].startswith(date.today().isoformat()) for row in payload["hour_model"]))

    def test_summary_of_several_days_has_no_hourly_totals(self):
        status, payload = self.get_json("/api/summary?days=7")
        self.assertEqual(payload["hour_model"], [])

    def test_summary_shape(self):
        status, payload = self.get_json("/api/summary?days=7")
        self.assertEqual(status, 200)
        self.assertEqual(payload["days"], 7)
        self.assertEqual(payload["since"], (date.today() - timedelta(days=6)).isoformat())
        self.assertEqual(payload["prices_checked"], "2026-09-27")
        for key in ("day_model", "agent_type", "project", "model", "sessions", "costly_sessions"):
            with self.subTest(key=key):
                self.assertIsInstance(payload[key], list)
        self.assertEqual(set(payload["day_model"][0]) >= {"day", "model", "turns", "output", "cost"}, True)
        self.assertEqual(payload["totals"]["turns"], 3)
        self.assertEqual(payload["totals"]["output"], 62)
        self.assertEqual(set(payload["totals"]["cost_parts"]),
                         {"new_input", "cache_write", "cache_read", "output", "web_search"})

    def test_summary_defaults_to_30_days(self):
        _, payload = self.get_json("/api/summary")
        self.assertEqual((payload["days"], payload["since"]),
                         (30, (date.today() - timedelta(days=29)).isoformat()))

    def test_summary_until_a_past_day(self):
        yesterday = date.today() - timedelta(days=1)
        past = self.projects.session("s3", project="/home/dev/app").at(datetime.now(UTC) - timedelta(days=1))
        past.assistant("m4", [text_block("y")], usage(output=11))
        status, payload = self.get_json(f"/api/summary?days=1&until={yesterday.isoformat()}")
        self.assertEqual(status, 200)
        self.assertEqual((payload["since"], payload["until"]), (yesterday.isoformat(), yesterday.isoformat()))
        self.assertEqual(payload["totals"]["output"], 11)
        self.assertEqual([session["session_id"] for session in payload["sessions"]], ["s3"])
        self.assertTrue(all(row["hour"].startswith(yesterday.isoformat()) for row in payload["hour_model"]))

    def test_daily_summary_names_the_nearest_days_with_usage(self):
        today = date.today()
        past = self.projects.session("s3", project="/home/dev/app").at(datetime.now(UTC) - timedelta(days=3))
        past.assistant("m4", [text_block("y")], usage(output=11))
        _, payload = self.get_json("/api/summary?days=1")
        self.assertEqual((payload["previous_day"], payload["next_day"]),
                         ((today - timedelta(days=3)).isoformat(), None))
        _, payload = self.get_json(f"/api/summary?days=1&until={(today - timedelta(days=3)).isoformat()}")
        self.assertEqual((payload["previous_day"], payload["next_day"]), (None, today.isoformat()))

    def test_next_day_is_today_even_without_usage(self):
        usage_day = date.today()
        later = usage_day + timedelta(days=2)

        class LaterDate(date):
            @classmethod
            def today(cls):
                return later

        with mock.patch.object(server, "date", LaterDate):
            _, payload = self.get_json(f"/api/summary?days=1&until={usage_day.isoformat()}")
        self.assertEqual((payload["previous_day"], payload["next_day"]), (None, later.isoformat()))

    def test_summary_of_several_days_names_no_nearest_days(self):
        _, payload = self.get_json("/api/summary?days=7")
        self.assertEqual((payload["previous_day"], payload["next_day"]), (None, None))

    def test_summary_until_defaults_to_today(self):
        _, payload = self.get_json("/api/summary?days=1")
        self.assertEqual(payload["until"], date.today().isoformat())

    def test_summary_rejects_bad_until(self):
        tomorrow = (date.today() + timedelta(days=1)).isoformat()
        for until in ("abc", "2026-13-01", tomorrow):
            with self.subTest(until=until):
                status, payload = self.get_json(f"/api/summary?days=1&until={until}")
                self.assertEqual(status, 400)
                self.assertIn("until", payload["error"])

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

    def test_costly_sessions_rank_every_session_by_cost(self):
        _, payload = self.get_json("/api/summary?days=7")
        self.assertEqual([session["session_id"] for session in payload["costly_sessions"]], ["s1", "s2"])
        self.assertEqual(set(payload["costly_sessions"][0]) >= {"cost", "cost_parts", "context_avg", "context_peak"},
                         True)

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
