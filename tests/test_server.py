"""server.py: the JSON API and the dashboard page, on a real server bound to a free loopback port."""
import collections
import contextlib
import http.client
import io
import json
import os
import re
import shutil
import socket
import stat
import threading
import unittest
import urllib.error
import urllib.request
from datetime import UTC
from datetime import date
from datetime import datetime
from datetime import timedelta
from unittest import mock

from claude_usage import compact
from claude_usage import permissions
from claude_usage import pricing
from claude_usage import scan
from claude_usage import secret_paths
from claude_usage import server
from claude_usage import store
from claude_usage import tool_kinds
from claude_usage import turns
from helpers import FakeClock
from helpers import MILLION
from helpers import TempDirTestCase
from helpers import text_block
from helpers import thinking_block
from helpers import tool_use_block
from helpers import usage

PRICES = pricing.parse_prices({
    "claude-sonnet-5": {"input": 2.0, "cache_write_5m": 2.5, "cache_write_1h": 4.0, "cache_read": 0.2,
                        "output": 10.0},
})
BUNDLE = "/static/js/app.js"
# what the bundle built from web/ contains as text, not as resources: the pages Svelte's errors link to (only the
# prefix: each names its error), the namespace names of the elements it creates, the links in highlight.js's and
# marked's messages, the prefix marked puts before a bare www. link, and the Objective-C keyword "@import" in
# highlight.js's list of them (a JavaScript file imports nothing that way)
BUNDLE_LINKS = (b"https://svelte.dev/e/", b"http://www.w3.org/1998/Math/MathML", b"http://www.w3.org/1999/xhtml",
                b"http://www.w3.org/1999/xlink", b"https://github.com/highlightjs/highlight.js/issues/2277",
                b"https://github.com/highlightjs/highlight.js/wiki/security", b".@import.",
                b"https://github.com/markedjs/marked.", b'"http://" + ')


class KeepRedirect(urllib.request.HTTPRedirectHandler):
    """Hands a redirect back as the answer instead of following it, so a test sees its headers."""

    def redirect_request(self, *arguments):
        return None


READ = tool_kinds.CallReader.read


def counted_reads():
    """CallReader.read, counting its calls."""
    return mock.patch.object(tool_kinds.CallReader, "read", autospec=True, side_effect=READ)


# urllib must not route 127.0.0.1 through a proxy from the environment
OPENER = urllib.request.build_opener(urllib.request.ProxyHandler({}))
NO_REDIRECT_OPENER = urllib.request.build_opener(urllib.request.ProxyHandler({}), KeepRedirect)


class ServerCase(TempDirTestCase):
    """Two sessions in two projects, and a server for them on a free port, reading the transcripts' tool calls in
    its own process unless read_processes is set."""
    project = None
    secret_patterns = ()
    read_processes = 0

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
        self.other = self.projects.session("s2", project="/home/dev/other").at(now)
        self.other.assistant("m3", [text_block("x")], usage(output=7))
        self.clock = FakeClock()
        self.store = store.Store(self.store_path, check_same_thread=False)
        self.addCleanup(self.store.close)
        self.app = server.UsageApp(self.store, self.projects.root, PRICES, live_minutes=5, project=self.project,
                                   prices_checked="2026-09-27", clock=self.clock,
                                   secret_settings=secret_paths.SecretSettings(self.secret_patterns,
                                                                               frozenset({"curl"}), ("tests",)),
                                   home="/home/dev", read_processes=self.read_processes)
        self.addCleanup(self.app.close)
        self.httpd = server.make_server(self.app, "127.0.0.1", 0)
        thread = threading.Thread(target=self.httpd.serve_forever, kwargs={"poll_interval": 0.05}, daemon=True)
        thread.start()
        self.addCleanup(thread.join)
        self.addCleanup(self.httpd.server_close)
        self.addCleanup(self.httpd.shutdown)
        self.port = self.httpd.server_address[1]

    def get(self, path, headers=None, token=True, opener=OPENER):
        """(status, headers, body) of a GET request, with the token's cookie unless token is False or headers set a
        Cookie; HTTP errors are returned, not raised."""
        sent = dict(headers or {})
        if token:
            sent.setdefault("Cookie", f"{server.cookie_name(self.port)}={self.app.token}")
        request = urllib.request.Request(f"http://127.0.0.1:{self.port}{path}", headers=sent)
        try:
            with opener.open(request, timeout=10) as response:
                return response.status, response.headers, response.read()
        except urllib.error.HTTPError as error:
            with error:
                return error.code, error.headers, error.read()

    def get_json(self, path, headers=None, token=True):
        """(status, parsed JSON body) of a GET request."""
        status, response_headers, body = self.get(path, headers, token)
        self.assertEqual(response_headers["Content-Type"], "application/json; charset=utf-8")
        return status, json.loads(body)


class UnixConnection(http.client.HTTPConnection):
    """An HTTP connection over a Unix socket, as curl --unix-socket makes it."""

    def __init__(self, path):
        super().__init__("localhost", timeout=10)
        self.socket_path = path

    def connect(self):
        """Connect to the socket instead of a host and port."""
        self.sock = socket.socket(socket.AF_UNIX, socket.SOCK_STREAM)
        self.sock.settimeout(10)
        self.sock.connect(str(self.socket_path))


@unittest.skipUnless(server.HAS_UNIX_SOCKETS, "needs Unix sockets")
class PromptSocketTest(ServerCase):
    HOOK_INPUT = {"hook_event_name": "PermissionRequest", "session_id": "s1", "tool_name": "Bash",
                  "tool_input": {"command": "rm -r build"}, "permission_mode": "default"}

    def setUp(self):
        super().setUp()
        self.main.assistant("m9", [tool_use_block("b9", "Bash", {"command": "rm -r build"})], usage(output=5))
        # the prompt comes after the call, whose time the test transcripts' clock sets ahead of the real one
        patcher = mock.patch.object(server, "utc_now", return_value=datetime.now(UTC) + timedelta(minutes=1))
        patcher.start()
        self.addCleanup(patcher.stop)
        self.socket_path = permissions.socket_path(self.store_path)
        self.prompt_server = self.open_socket()

    def open_socket(self):
        """The hook's socket next to the store, serving until the test ends."""
        prompt_server = server.open_prompt_socket(self.app, self.socket_path)
        prompt_server.start()
        self.addCleanup(server.close_prompt_socket, prompt_server)
        return prompt_server

    def post(self, body=None, path=server.PROMPT_PATH):
        """(status, body) of a POST over the socket, as the hook's curl sends it."""
        connection = UnixConnection(self.socket_path)
        self.addCleanup(connection.close)
        data = json.dumps(self.HOOK_INPUT if body is None else body).encode("utf-8")
        connection.request("POST", path, body=data, headers={"Content-Type": "application/json"})
        response = connection.getresponse()
        return response.status, response.read()

    def waiting(self, session_id="s1"):
        """The waiting of one session in /api/live."""
        _, payload = self.get_json("/api/live")
        return next(session for session in payload["sessions"] if session["session_id"] == session_id)["waiting"]

    def test_the_hook_notes_a_prompt_over_the_socket_and_gets_no_data_back(self):
        self.assertIsNone(self.waiting())
        self.assertEqual(self.post(), (204, b""))
        self.assertEqual(self.waiting()["kind"], "permission")

    def test_the_tcp_port_takes_no_post(self):
        # every API route there asks for the token, which the hook can't know
        request = urllib.request.Request(f"http://127.0.0.1:{self.port}{server.PROMPT_PATH}", method="POST",
                                         data=json.dumps(self.HOOK_INPUT).encode("utf-8"),
                                         headers={"Content-Type": "application/json"})
        with self.assertRaises(urllib.error.HTTPError) as caught:
            OPENER.open(request, timeout=10)
        caught.exception.close()
        self.assertEqual(list(self.app.prompts), [])

    @unittest.skipUnless(os.name == "posix", "POSIX modes")
    def test_the_socket_is_its_owners_alone(self):
        # Linux lets only who may write the socket connect
        self.assertEqual(stat.S_IMODE(self.socket_path.stat().st_mode), 0o600)

    def test_the_socket_serves_nothing_else(self):
        self.assertEqual(self.post(path="/api/live")[0], 404)
        connection = UnixConnection(self.socket_path)
        self.addCleanup(connection.close)
        connection.request("GET", "/api/live")
        self.assertEqual(connection.getresponse().status, 404)

    def test_the_calls_input_is_not_kept(self):
        self.post()
        self.assertNotIn("rm -r", repr(list(self.app.prompts)))

    def test_a_body_over_the_limit_is_refused(self):
        with mock.patch.object(server, "PROMPT_BODY_LIMIT", 10):
            self.assertEqual(self.post()[0], 413)

    def test_an_input_that_is_no_permission_prompt_is_refused(self):
        self.assertEqual(self.post({"hook_event_name": "Notification", "session_id": "s1"})[0], 400)

    def test_the_server_keeps_only_the_latest_prompts(self):
        self.app.prompts = collections.deque(maxlen=2)
        for session_id in ("a", "b", "c"):
            self.post({**self.HOOK_INPUT, "session_id": session_id})
        self.assertEqual([prompt.session_id for prompt in self.app.prompts], ["b", "c"])

    def test_another_dashboard_listening_is_left_alone(self):
        with self.assertRaises(server.PromptSocketError) as caught:
            server.open_prompt_socket(self.app, self.socket_path)
        self.assertIn("another dashboard", str(caught.exception))
        self.assertEqual(self.post()[0], 204)

    def test_closing_removes_the_socket(self):
        server.close_prompt_socket(self.prompt_server)
        self.assertFalse(self.socket_path.exists())


@unittest.skipUnless(server.HAS_UNIX_SOCKETS, "needs Unix sockets")
class PromptSocketOpenTest(ServerCase):
    def test_a_socket_a_stopped_dashboard_left_behind_is_taken_over(self):
        path = permissions.socket_path(self.store_path)
        left = socket.socket(socket.AF_UNIX, socket.SOCK_STREAM)
        left.bind(str(path))
        left.close()                                # the file stays, nobody listens
        prompt_server = server.open_prompt_socket(self.app, path)
        self.addCleanup(server.close_prompt_socket, prompt_server)
        self.assertTrue(stat.S_ISSOCK(path.stat().st_mode))

    def test_a_file_in_the_way_is_left_as_it_is(self):
        path = permissions.socket_path(self.store_path)
        path.write_text("not a socket", encoding="utf-8")
        with self.assertRaises(server.PromptSocketError):
            server.open_prompt_socket(self.app, path)
        self.assertEqual(path.read_text(encoding="utf-8"), "not a socket")

    def test_without_unix_sockets_it_says_so(self):
        # Windows: Claude Code's dialogs work as ever, only the dashboard can't show them
        with mock.patch.object(server, "HAS_UNIX_SOCKETS", False):
            with self.assertRaises(server.PromptSocketError) as caught:
                server.open_prompt_socket(self.app, permissions.socket_path(self.store_path))
        self.assertIn("no Unix sockets", str(caught.exception))

    def test_live_says_why_the_dashboard_shows_no_permission_prompts(self):
        self.assertIsNone(self.get_json("/api/live")[1]["prompts_unavailable"])
        self.app.prompts_unavailable = "this system has no Unix sockets"
        self.assertEqual(self.get_json("/api/live")[1]["prompts_unavailable"], "this system has no Unix sockets")

    def test_live_says_why_the_dashboard_sends_no_desktop_notifications(self):
        self.assertIsNone(self.get_json("/api/live")[1]["notifications_unavailable"])
        self.app.notifications_unavailable = "notify-send not found"
        self.assertEqual(self.get_json("/api/live")[1]["notifications_unavailable"], "notify-send not found")


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
            # text in the bundle, not resources; the CSP would block any load anyway
            for link in BUNDLE_LINKS if path == BUNDLE else ():
                body = body.replace(link, b"")
            for external in (b"https://", b"http://", b"@import"):
                with self.subTest(path=path, external=external):
                    self.assertNotIn(external, body)

    def test_the_policy_allows_no_style_attribute_and_no_untrusted_markup(self):
        # styles are set through the CSSOM, which a CSP doesn't block; markup only through the policies named
        # (test_contract holds them to the page's)
        _, headers, _ = self.get("/")
        directives = [part.strip() for part in headers["Content-Security-Policy"].split(";")]
        self.assertIn("style-src 'self'", directives)
        self.assertIn("require-trusted-types-for 'script'", directives)
        self.assertEqual(sum(directive.startswith("trusted-types ") for directive in directives), 1)
        self.assertNotIn("unsafe-inline", headers["Content-Security-Policy"])
        self.assertNotIn("unsafe-eval", headers["Content-Security-Policy"])

    def test_the_page_has_no_style_attribute_or_inline_script(self):
        _, _, body = self.get("/")
        self.assertNotRegex(body.decode("utf-8"), r"(?i)\sstyle\s*=|<style\b|<script(?![^>]*\ssrc=)")

    def test_the_markdown_renderer_sanitizer_and_highlighter_are_in_the_bundle(self):
        self.assertIn(BUNDLE, self.page_assets())
        _, _, body = self.get(BUNDLE)
        for marker in (b"markedjs/marked", b"DOMPurify", b"hljs-"):
            with self.subTest(marker=marker):
                self.assertIn(marker, body)

    def test_the_libraries_are_no_files_of_their_own(self):
        status, _, _ = self.get("/static/js/vendor/highlight.min.js")
        self.assertEqual(status, 404)

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

    def test_live_keeps_the_sessions_with_agents_at_work_for_the_agent_minutes(self):
        self.app.agent_live_minutes = 180
        with mock.patch.object(server.queries, "live_sessions", wraps=server.queries.live_sessions) as live:
            _, payload = self.get_json("/api/live")
        self.assertEqual(live.call_args.kwargs["agent_minutes"], 180)
        self.assertEqual(payload["agent_minutes"], 180)

    def test_live_without_a_range_lists_every_live_session(self):
        _, payload = self.get_json("/api/live")
        self.assertEqual((payload["days"], payload["since"], payload["until"]), (None, None, None))

    def test_live_of_a_range_keeps_the_sessions_active_in_it(self):
        status, payload = self.get_json("/api/live?days=1")
        self.assertEqual(status, 200)
        self.assertEqual(sorted(session["session_id"] for session in payload["sessions"]), ["s1", "s2"])
        today = date.today().isoformat()
        self.assertEqual((payload["days"], payload["since"], payload["until"]), (1, today, today))

    def test_live_of_a_past_day_leaves_out_the_sessions_not_active_on_it(self):
        yesterday = (date.today() - timedelta(days=1)).isoformat()
        _, payload = self.get_json(f"/api/live?days=1&until={yesterday}")
        self.assertEqual(payload["sessions"], [])
        self.assertEqual((payload["since"], payload["until"]), (yesterday, yesterday))

    def test_live_refuses_a_bad_range(self):
        for query in ("days=0", "days=x", "until=2026-13-01", f"until={date.today() + timedelta(days=1)}"):
            with self.subTest(query=query):
                self.assertEqual(self.get_json(f"/api/live?{query}")[0], 400)

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
        for days in ("abc", "0", "-3", "100000", "7.5", "%C2%B2"):     # the last one is "²", a digit to isdigit()
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

    def test_session_detail_says_whether_the_session_is_live(self):
        hour_ago = datetime.now(UTC).timestamp() - 3600
        os.utime(self.other.path, (hour_ago, hour_ago))
        self.assertTrue(self.get_json("/api/session/s1")[1]["live"])
        self.assertFalse(self.get_json("/api/session/s2")[1]["live"])

    def test_session_detail_says_what_it_waits_for(self):
        # the live list, which shows it otherwise, is hidden while a session is open
        self.other.assistant("m4", [tool_use_block("q1", "AskUserQuestion", {"questions": []})], usage(output=5))
        self.assertIsNone(self.get_json("/api/session/s1")[1]["waiting"])
        self.assertEqual(self.get_json("/api/session/s2")[1]["waiting"]["kind"], "question")

    def test_session_detail_waits_for_a_permission_the_hook_noted(self):
        self.other.assistant("m4", [tool_use_block("w1", "Write", {})], usage(output=5))
        self.app.prompts.append(permissions.Prompt(scan.iso(datetime.now(UTC)), "s2", None, "Write", "auto"))
        waiting = self.get_json("/api/session/s2")[1]["waiting"]
        self.assertEqual((waiting["kind"], waiting["tool"]), ("permission", "Write"))

    def test_a_session_waiting_for_the_user_is_live_past_the_window(self):
        # Claude Code writes nothing while it waits: the open session keeps polling fast
        self.other.assistant("m4", [tool_use_block("q1", "AskUserQuestion", {"questions": []})], usage(output=5))
        hour_ago = datetime.now(UTC).timestamp() - 3600
        os.utime(self.other.path, (hour_ago, hour_ago))
        self.assertTrue(self.get_json("/api/session/s2")[1]["live"])

    def test_session_detail_says_whether_its_transcript_still_exists(self):
        self.assertTrue(self.get_json("/api/session/s1")[1]["transcript"])
        self.other.path.unlink()
        self.assertFalse(self.get_json("/api/session/s2")[1]["transcript"])

    def test_session_detail_has_the_current_context(self):
        _, payload = self.get_json("/api/session/s1")
        current = payload["current"]
        self.assertEqual((current["context"], current["auto_compact"], current["hint_tokens"],
                          current["turns_since_compaction"]), (110, 967_000, 200_000, 1))

    def compacted(self, next_usage):
        """A compaction after m1 (context 110, reply 50), then a call with next_usage."""
        self.main.compaction()
        self.main.user("go on")
        self.main.assistant("m8", [text_block("b")], next_usage)

    def test_session_compactions_are_compared_with_keeping_the_context(self):
        self.compacted(usage(new=2, cache_5m=50, output=5))
        _, payload = self.get_json("/api/session/s1")
        [row] = payload["agents"][0]["compactions"]
        self.assertEqual((row["next_context"], row["versus_keeping"]["difference"]), (52, 108))
        self.assertIn(row["versus_keeping"]["verdict"], turns.VERDICTS)

    def test_a_compaction_that_never_pays_off_still_answers(self):
        self.compacted(usage(cache_5m=5_000, output=5))
        status, payload = self.get_json("/api/session/s1")
        comparison = payload["agents"][0]["compactions"][0]["versus_keeping"]
        self.assertEqual((status, comparison["breakeven_call"]), (200, None))

    def test_the_current_context_previews_compacting_now(self):
        _, payload = self.get_json("/api/session/s1")
        preview = payload["current"]["compact_now"]
        self.assertEqual((preview["before"], preview["estimate"]), (160, None))

    def test_the_preview_learns_from_compactions_of_other_sessions(self):
        earlier = self.projects.session("s0", project="/home/dev/app").at(datetime.now(UTC) - timedelta(hours=2))
        earlier.user("go")
        earlier.assistant("e1", [text_block("a")], usage(cache_1h=20_000, cache_read=180_000, output=500))
        earlier.compaction("e-c")
        earlier.user("more")
        earlier.assistant("e2", [text_block("b")], usage(cache_1h=500, cache_read=30_000))
        earlier.user("more")
        earlier.assistant("e3", [text_block("long")], usage(cache_read=30_500, output=5_000))
        _, payload = self.get_json("/api/session/s1")
        self.assertEqual(payload["current"]["compact_now"]["stored_compactions"], 1)

    def test_summary_and_session_say_what_compacting_saved_so_far(self):
        self.compacted(usage(new=2, cache_5m=50, output=5))
        _, summary = self.get_json("/api/summary?days=7")
        _, session = self.get_json("/api/session/s1")
        # without an output speed its summary is unknown, so it is counted, not summed
        self.assertEqual((summary["compaction_savings"]["compactions"], summary["compaction_savings"]["unknown"]),
                         (0, 1))
        self.assertEqual(session["compaction_savings"], summary["compaction_savings"])
        self.assertIsNone(self.get_json("/api/session/s2")[1]["compaction_savings"])

    def test_the_compaction_history_is_computed_again_only_after_the_store_changed(self):
        computed = server.queries.compaction_history
        with mock.patch.object(server.queries, "compaction_history", wraps=computed) as history:
            self.get_json("/api/session/s1")
            self.get_json("/api/session/s1")
            self.main.assistant("m9", [text_block("c")], usage(output=1))
            self.clock.now += server.SCAN_INTERVAL
            self.get_json("/api/session/s1")
        self.assertEqual(history.call_count, 2)

    def test_the_prompt_is_read_outside_the_lock(self):
        held = []
        read = server.transcripts.first_prompt

        def spy(path):
            """first_prompt, noting whether the app's lock was held meanwhile."""
            held.append(self.app.lock.locked())
            return read(path)

        with mock.patch.object(server.transcripts, "first_prompt", side_effect=spy):
            payload = self.app.session("s1")
        self.assertEqual((payload["prompt"], held), ("Fix the parser", [False]))

    def test_summary_has_the_run_totals(self):
        self.main.cost_state({}, totalDuration=60000, totalLinesAdded=5, totalLinesRemoved=2)
        _, payload = self.get_json("/api/summary?days=7")
        runtime = payload["runtime"]
        self.assertEqual((runtime["sessions"], runtime["duration_ms"], runtime["lines_added"],
                          runtime["lines_removed"]), (1, 60000, 5, 2))

    def test_session_detail_has_the_run_totals(self):
        self.main.cost_state({}, totalDuration=60000)
        _, payload = self.get_json("/api/session/s1")
        self.assertEqual(payload["runtime"]["duration_ms"], 60000)

    def test_summary_has_usage_by_skill_and_mcp_server_without_the_unattributed(self):
        self.main.assistant("m9", [text_block("s")], usage(output=3), attributionSkill="dataviz",
                            attributionMcpServer="codebase-memory-mcp")
        _, payload = self.get_json("/api/summary?days=7")
        self.assertEqual([(row["skill"], row["output"]) for row in payload["skill"]], [("dataviz", 3)])
        self.assertEqual([(row["mcp_server"], row["turns"]) for row in payload["mcp_server"]],
                         [("codebase-memory-mcp", 1)])

    def test_summary_has_api_errors_per_day_and_the_events(self):
        self.main.api_error("e1")
        _, payload = self.get_json("/api/summary?days=7")
        errors = payload["api_errors"]
        self.assertEqual([(row["day"], row["error"], row["count"]) for row in errors["day"]],
                         [(date.today().isoformat(), "rate_limit", 1)])
        self.assertEqual(errors["hour"], [])
        self.assertEqual([(event["record_id"], event["session_id"]) for event in errors["events"]], [("e1", "s1")])

    def test_summary_has_the_windows_that_hit_a_rate_limit_with_what_they_used(self):
        self.main.api_error("e1", resets_at=datetime.now(UTC) + timedelta(hours=1))
        _, payload = self.get_json("/api/summary?days=7")
        self.assertEqual([(window["hits"], window["used"]["output"]) for window in payload["api_errors"]["windows"]],
                         [(1, 50 + 5 + 7)])

    def test_summary_of_one_day_has_api_errors_per_hour(self):
        self.main.api_error("e1")
        _, payload = self.get_json("/api/summary?days=1")
        self.assertEqual([row["count"] for row in payload["api_errors"]["hour"]], [1])

    def test_session_detail_has_skills_mcp_servers_and_api_errors(self):
        self.main.assistant("m9", [text_block("s")], usage(output=3), attributionSkill="dataviz",
                            attributionMcpServer="codebase-memory-mcp")
        self.main.api_error("e1")
        _, payload = self.get_json("/api/session/s1")
        self.assertEqual([row["skill"] for row in payload["skills"]], ["dataviz"])
        self.assertEqual([row["mcp_server"] for row in payload["mcp_servers"]], ["codebase-memory-mcp"])
        self.assertEqual([event["record_id"] for event in payload["api_errors"]], ["e1"])

    def test_summary_has_usage_per_model_and_effort(self):
        self.main.assistant("m9", [text_block("e")], usage(output=3), effort="max")
        _, payload = self.get_json("/api/summary?days=7")
        self.assertIn(("claude-sonnet-5", "max", 1), [(row["model"], row["effort"], row["turns"])
                                                      for row in payload["model_effort"]])

    def test_summary_has_usage_per_day_or_hour_model_and_effort(self):
        self.main.assistant("m9", [text_block("e")], usage(output=3), effort="max")
        _, week = self.get_json("/api/summary?days=7")
        self.assertIn((date.today().isoformat(), "claude-sonnet-5", "max"),
                      [(row["day"], row["model"], row["effort"]) for row in week["day_model_effort"]])
        self.assertEqual(week["hour_model_effort"], [])
        _, today = self.get_json("/api/summary?days=1")
        self.assertIn("max", [row["effort"] for row in today["hour_model_effort"]])

    def test_summary_lists_every_session_of_the_range(self):
        # the page pages and filters the list: a cut would hide the older sessions without a word
        now = datetime.now(UTC)
        for index in range(60):
            extra = self.projects.session(f"x{index}", project="/home/dev/app").at(now - timedelta(minutes=index + 1))
            extra.assistant(f"mx{index}", [text_block("y")], usage(output=1))
        _, payload = self.get_json("/api/summary?days=7")
        self.assertEqual(len(payload["sessions"]), 62)

    def test_summary_sessions_carry_only_what_the_list_shows(self):
        _, payload = self.get_json("/api/summary?days=7")
        sessions = {session["session_id"]: session for session in payload["sessions"]}
        self.assertEqual(set(sessions["s1"]), {"session_id", "title", "project", "last_ts", "subagents", "turns",
                                               "context_avg", "context_peak", "output", "cost"})
        self.assertEqual((sessions["s1"]["title"], sessions["s1"]["project"], sessions["s1"]["subagents"],
                          sessions["s1"]["output"]), ("Parser fix", "/home/dev/app", 1, 55))

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


class ChatTest(ServerCase):
    """The conversation of a session's main thread or a subagent, read from the transcript on demand."""

    def test_the_main_threads_conversation(self):
        status, payload = self.get_json("/api/session/s1/chat")
        self.assertEqual(status, 200)
        self.assertEqual((payload["session_id"], payload["agent_id"], payload["available"]), ("s1", None, True))
        self.assertEqual([(entry["kind"], entry["text"] or entry["tool"]) for entry in payload["entries"]],
                         [("prompt", "Fix the parser"), ("tool", "Read")])
        self.assertEqual(payload["entries"][1]["result"], "abc")

    def test_a_subagents_conversation(self):
        _, payload = self.get_json("/api/session/s1/chat?agent=a1")
        self.assertEqual([(entry["kind"], entry["text"]) for entry in payload["entries"]], [("text", "ok")])

    def test_nothing_of_the_conversation_is_stored(self):
        self.main.user("PROMPT-MARKER-5f2")
        self.main.assistant("m8", [text_block("REPLY-MARKER-9c1"), tool_use_block("t8", "Bash", {"command": "ls"})],
                            usage(output=1))
        self.main.tool_result("t8", "RESULT-MARKER-3e7")
        self.main.attachment("hook_additional_context", "ATTACHMENT-MARKER-4d8")
        self.main.user("SUMMARY-MARKER-6b3", isCompactSummary=True)
        self.get_json("/api/summary?days=7")
        _, payload = self.get_json("/api/session/s1/chat")
        self.assertIn("REPLY-MARKER-9c1", json.dumps(payload))
        self.assertIn("ATTACHMENT-MARKER-4d8", json.dumps(payload))
        self.store.connection.execute("PRAGMA wal_checkpoint")
        stored = b"".join(path.read_bytes() for path in self.store_path.parent.glob(f"{self.store_path.name}*"))
        for marker in (b"PROMPT-MARKER-5f2", b"REPLY-MARKER-9c1", b"RESULT-MARKER-3e7", b"ATTACHMENT-MARKER-4d8",
                       b"SUMMARY-MARKER-6b3"):
            with self.subTest(marker=marker):
                self.assertNotIn(marker, stored)

    def test_replies_carry_their_usage_and_cost(self):
        self.main.assistant("m8", [text_block("priced")], usage(new=1_000_000, output=1_000_000), effort="high")
        self.main.assistant("m9", [text_block("unpriced")], usage(output=5), model="claude-mystery-1")
        _, payload = self.get_json("/api/session/s1/chat")
        priced, unpriced = payload["entries"][-2:]
        self.assertEqual((priced["effort"], priced["usage"]["new_input"], priced["usage"]["output"]),
                         ("high", 1_000_000, 1_000_000))
        self.assertAlmostEqual(priced["usage"]["cost"], 2.0 + 10.0)
        self.assertEqual(set(priced["usage"]["cost_parts"]), {"new_input", "cache_write", "cache_read", "output",
                                                              "web_search"})
        self.assertIsNone(unpriced["usage"]["cost"])
        self.assertEqual(payload["entries"][0]["usage"], None)

    def test_replies_made_in_ultracode_say_so(self):
        self.main.assistant("m7", [text_block("plain")], usage(output=5), effort="xhigh")
        self.main.ultracode("u1")
        self.main.assistant("m8", [thinking_block(), text_block("ultra")], usage(output=5), effort="xhigh")
        _, payload = self.get_json("/api/session/s1/chat")
        replies = [entry for entry in payload["entries"] if entry["kind"] in ("text", "thinking")]
        self.assertEqual([entry["effort"] for entry in replies], ["xhigh", "ultracode", "ultracode"])
        self.assertEqual(replies[-1]["usage"]["effort"], "ultracode")

    def test_each_calls_usage_carries_its_growth_and_rebuild(self):
        self.main.assistant("m8", [text_block("a")], usage(new=10, cache_5m=20_000, output=100))
        self.main.user("go on")
        self.main.assistant("m9", [text_block("b")], usage(new=5, cache_5m=20_000, cache_read=1_000, output=50))
        _, payload = self.get_json("/api/session/s1/chat")
        first, second = [entry["usage"] for entry in payload["entries"][-3:] if entry["usage"]]
        self.assertEqual((second["growth"], second["rebuild"]["cause"], second["rebuild"]["lost"]),
                         (21_005 - 20_010 - 100, "prefix", 19_010))
        self.assertAlmostEqual(second["rebuild"]["extra_cost"], 19_010 * (2.5 - 0.2) / MILLION)
        self.assertIsNone(first["rebuild"])
        self.assertNotIn("step", payload["entries"][-1])

    def test_each_calls_usage_carries_the_previous_reply(self):
        self.main.assistant("m8", [text_block("a")], usage(new=10, cache_5m=20_000, output=100))
        self.main.user("go on")
        self.main.assistant("m9", [text_block("b")], usage(new=5, cache_5m=1_000, cache_read=20_010, output=50))
        _, payload = self.get_json("/api/session/s1/chat")
        self.assertEqual(payload["entries"][-1]["usage"]["reply"], 100)

    def test_the_token_reminders_are_summed_and_on_each_calls_usage(self):
        for index in (8, 9):
            self.main.attachment("total_tokens_reminder", "r" * 86)
            self.main.assistant(f"m{index}", [text_block("a")], usage(output=1))
        _, payload = self.get_json("/api/session/s1/chat")
        self.assertEqual([entry["usage"]["reminder_chars"] for entry in payload["entries"][-2:]], [86, 86])
        self.assertEqual(payload["reminders"], {"calls": 2, "chars": 172})

    def test_compactions_and_injected_context_come_with_their_details(self):
        self.main.compaction(trigger="auto", pre_tokens=170_000, post_tokens=9_000, duration_ms=41_000)
        self.main.user("the summary", isCompactSummary=True)
        _, payload = self.get_json("/api/session/s1/chat")
        marker, injected = payload["entries"][-2:]
        self.assertEqual(marker["compaction"], {"trigger": "auto", "pre_tokens": 170_000, "post_tokens": 9_000,
                                                "duration_ms": 41_000})
        self.assertEqual(injected["items"], [{"kind": "summary", "chars": 11, "text": "the summary"}])

    def test_a_compaction_marker_carries_its_comparison_with_keeping(self):
        self.main.compaction()
        self.main.user("go on")
        self.main.assistant("m8", [text_block("b")], usage(new=2, cache_5m=50, output=5))
        _, payload = self.get_json("/api/session/s1/chat")
        [marker] = [entry for entry in payload["entries"] if entry["kind"] == "compaction"]
        self.assertEqual(marker["versus_keeping"]["difference"], 108)

    def test_a_compaction_without_a_call_after_it_has_no_comparison(self):
        self.main.compaction()
        _, payload = self.get_json("/api/session/s1/chat")
        self.assertIsNone(payload["entries"][-1]["versus_keeping"])

    def test_tool_calls_carry_their_input_fields(self):
        self.main.assistant("m8", [tool_use_block("t8", "Bash", {"command": "ls", "description": "List"})],
                            usage(output=1))
        _, payload = self.get_json("/api/session/s1/chat")
        self.assertEqual(payload["entries"][-1]["tool_fields"],
                         [{"name": "command", "value": "ls", "chars": 2, "is_json": False},
                          {"name": "description", "value": "List", "chars": 4, "is_json": False}])

    def test_replies_carry_their_context_and_compact_hints(self):
        self.app.compact = compact.CompactSettings(hint_tokens=1000, warn_share=0.8, auto_compact={"default": 967_000})
        self.main.assistant("m8", [text_block("big")], usage(new=10, cache_5m=90, cache_read=1400, output=1))
        _, payload = self.get_json("/api/session/s1/chat")
        entry = payload["entries"][-1]
        self.assertEqual(entry["usage"]["context"], 1500)
        self.assertEqual((entry["compact_hint"]["kind"], entry["compact_hint"]["threshold"]), ("soft", 1000))

    def test_replies_where_compacting_likely_pays_carry_the_estimate_and_a_warning(self):
        estimate = {"breakeven_calls": 3, "calls_ahead": 20.0, "ahead_from": "all", "one_time": 0.1,
                    "after": 40_000}

        def every_call_pays(history, moments, past, prices):
            """pays_estimates saying compacting pays after every call."""
            return [estimate] * len(history)

        with mock.patch.object(server.turns, "pays_estimates", side_effect=every_call_pays) as estimates:
            _, payload = self.get_json("/api/session/s1/chat")
            _, agent = self.get_json("/api/session/s1/chat?agent=a1")
        entry = payload["entries"][-1]
        self.assertEqual((entry["usage"]["compact_pays"], entry["compact_hint"]["kind"]), (estimate, "pays"))
        # a subagent can't be compacted
        self.assertNotIn("compact_pays", agent["entries"][-1]["usage"])
        self.assertEqual(estimates.call_count, 1)

    def test_without_stored_compactions_nothing_is_predicted_to_pay(self):
        _, payload = self.get_json("/api/session/s1/chat")
        self.assertNotIn("compact_pays", payload["entries"][-1]["usage"])

    def test_summary_and_session_carry_the_context_stats_and_the_hint(self):
        _, summary = self.get_json("/api/summary?days=7")
        self.assertEqual((summary["context"]["turns"], summary["compact_hint_tokens"]), (2, 200_000))
        _, session = self.get_json("/api/session/s1")
        self.assertEqual((session["context"]["turns"], session["compact_hint_tokens"]), (1, 200_000))

    def test_a_deleted_transcript_is_unavailable(self):
        self.get_json("/api/summary?days=7")
        self.main.path.unlink()
        status, payload = self.get_json("/api/session/s1/chat")
        self.assertEqual((status, payload["available"], payload["entries"], payload["reminders"]),
                         (200, False, [], {"calls": 0, "chars": 0}))

    def test_unknown_session_or_agent_is_404(self):
        for path in ("/api/session/nope/chat", "/api/session/s1/chat?agent=nope"):
            with self.subTest(path=path):
                self.assertEqual(self.get_json(path)[0], 404)

    def test_a_malformed_agent_id_is_400(self):
        status, payload = self.get_json("/api/session/s1/chat?agent=..%2Fx")
        self.assertEqual(status, 400)
        self.assertIn("agent", payload["error"])


class ToolKindsTest(ServerCase):
    """Each transcript's tools by kind in /api/session, read from the transcript on demand."""

    def kinds(self, agent_index=0):
        """(tool, kind, detail, options, calls) of one agent's tool_kinds, or None."""
        _, payload = self.get_json("/api/session/s1")
        rows = payload["agents"][agent_index]["tool_kinds"]
        return None if rows is None else [(row["tool"], row["kind"], row["detail"], row["options"], row["calls"])
                                          for row in rows]

    def test_each_transcript_has_its_tools_with_bash_by_kind(self):
        self.main.assistant("m8", [tool_use_block("t8", "Bash", {"command": "grep -rn x src"})], usage(output=1))
        self.main.tool_result("t8", "src/a.go:1:x")
        self.assertEqual(self.kinds(), [("Bash", None, None, None, 1), ("Bash", "search", None, None, 1),
                                        ("Bash", "search", "grep", None, 1), ("Bash", "search", "grep", "-rn", 1),
                                        ("Read", None, None, None, 1), ("Read", None, "", None, 1),
                                        ("Read", None, "", "", 1)])
        self.assertEqual(self.kinds(1), [])

    def test_the_rows_carry_sizes_and_costs(self):
        _, payload = self.get_json("/api/session/s1")
        row = payload["agents"][0]["tool_kinds"][0]
        self.assertEqual((row["result_chars"], row["result_median"], row["errors"], row["calls_after_median"]),
                         (3, 3, 0, 0))
        self.assertIn("carried", row)
        self.assertIn("input_cost", row)

    def test_once_the_transcript_is_gone_only_the_stored_tools_remain(self):
        self.get_json("/api/summary?days=7")
        self.main.path.unlink()
        _, payload = self.get_json("/api/session/s1")
        self.assertIsNone(payload["agents"][0]["tool_kinds"])
        self.assertEqual(payload["agents"][0]["tools"], [{"tool": "Read", "calls": 1, "result_chars": 3}])

    def test_an_unchanged_transcript_is_not_read_again(self):
        with counted_reads() as read:
            self.get_json("/api/session/s1")
            self.get_json("/api/session/s1")
        self.assertEqual(read.call_count, 2)                    # the main thread and the subagent, once each

    def test_a_changed_transcript_is_read_on_from_where_it_stopped(self):
        self.get_json("/api/session/s1")
        self.main.assistant("m8", [tool_use_block("t8", "Read")], usage(output=1))
        add = mock.patch.object(tool_kinds.CallReader, "add", autospec=True, side_effect=tool_kinds.CallReader.add)
        with add as added:
            self.assertEqual(self.kinds()[0], ("Read", None, None, None, 2))
        self.assertEqual(added.call_count, 1)

    def test_the_main_threads_exploration_goes_with_the_gauge(self):
        _, payload = self.get_json("/api/session/s1")
        self.assertEqual((payload["current"]["exploration"]["calls"], payload["current"]["exploration"]["chars"]),
                         (1, len("{}") + 3))
        self.assertEqual((payload["delegate_hint_tokens"], payload["delegate_calls_ahead"]), (20_000, 60))

    def test_the_background_calls_have_no_tools_by_kind(self):
        self.main.cost_state({"claude-sonnet-5": (100, 5000, 5000, 500, 0.1)})
        _, payload = self.get_json("/api/session/s1")
        background = payload["agents"][-1]
        self.assertEqual((background["agent_type"], background["tool_kinds"]), (store.BACKGROUND, None))

    def test_the_background_calls_leave_the_main_threads_exploration(self):
        self.main.cost_state({"claude-sonnet-5": (100, 5000, 5000, 500, 0.1)})
        _, payload = self.get_json("/api/session/s1")
        self.assertEqual(payload["current"]["exploration"]["calls"], 1)

    def test_without_its_transcript_the_gauge_has_no_exploration(self):
        self.get_json("/api/summary?days=7")
        self.main.path.unlink()
        _, payload = self.get_json("/api/session/s1")
        self.assertIsNone(payload["current"]["exploration"])

    def test_no_command_reaches_the_payload_or_the_store(self):
        command = "grep -rn COMMAND-MARKER-7a1 src"
        self.main.assistant("m8", [tool_use_block("t8", "Bash", {"command": command})], usage(output=1))
        self.main.tool_result("t8", "RESULT-MARKER-2b9")
        _, payload = self.get_json("/api/session/s1")
        self.assertNotIn("COMMAND-MARKER-7a1", json.dumps(payload))
        self.store.connection.execute("PRAGMA wal_checkpoint")
        stored = b"".join(path.read_bytes() for path in self.store_path.parent.glob(f"{self.store_path.name}*"))
        self.assertNotIn(b"COMMAND-MARKER-7a1", stored)
        self.assertNotIn(b"RESULT-MARKER-2b9", stored)


class SecretAccessTest(ServerCase):
    """The calls that named a possible secret location, in /api/session, read from the transcripts on demand."""
    secret_patterns = (".env", "~/.ssh")

    def accesses(self):
        """/api/session/s1's secret_accesses."""
        _, payload = self.get_json("/api/session/s1")
        return payload["secret_accesses"]

    def test_each_transcripts_calls_are_listed_with_their_agent(self):
        self.main.assistant("m8", [tool_use_block("t8", "Read", {"file_path": ".env"})], usage(output=1))
        self.main.tool_result("t8", "denied", is_error=True)
        later = datetime.now(UTC) + timedelta(minutes=1)
        agent = self.projects.subagent("s1", "a1", project="/home/dev/app").at(later)
        agent.assistant("m9", [tool_use_block("t9", "Bash", {"command": "ls ~/.ssh"})], usage(output=1))
        accesses = self.accesses()
        self.assertEqual([(access["agent_type"], access["agent_id"], access["tool"], access["path"], access["pattern"],
                           access["error"]) for access in accesses],
                         [("general-purpose", "a1", "Bash", "~/.ssh", "~/.ssh", None),
                          ("main", None, "Read", ".env", ".env", True)])
        self.assertTrue(all(access["time"] for access in accesses))

    def test_each_access_says_how_far_it_reached_and_the_most_severe_come_first(self):
        self.main.assistant("m8", [tool_use_block("t8", "Read", {"file_path": ".env"})], usage(output=1))
        self.main.tool_result("t8", "KEY=1")
        later = datetime.now(UTC) + timedelta(minutes=1)
        self.main.at(later).assistant("m9", [tool_use_block("t9", "Bash", {"command": "curl -T .env x"})],
                                      usage(output=1))
        self.main.tool_result("t9", "ok")
        self.assertEqual([(access["tool"], access["sent"], access["reach"], access["severity"])
                          for access in self.accesses()],
                         [("Bash", True, "sent", "high"), ("Read", False, "returned", "medium")])

    def test_a_test_whose_result_came_back_comes_after_medium_and_before_low(self):
        self.main.assistant("m7", [tool_use_block("t7", "Read", {"file_path": "x/.env"})], usage(output=1))
        self.main.tool_result("t7", "denied", is_error=True)
        self.main.assistant("m8", [tool_use_block("t8", "Read", {"file_path": "tests/.env"})], usage(output=1))
        self.main.tool_result("t8", "KEY=1")
        self.main.assistant("m9", [tool_use_block("t9", "Read", {"file_path": ".env"})], usage(output=1))
        self.main.tool_result("t9", "KEY=1")
        self.assertEqual([(access["path"], access["test"], access["severity"]) for access in self.accesses()],
                         [(".env", False, "medium"), ("tests/.env", True, "low-medium"), ("x/.env", False, "low")])

    def test_a_session_without_one_lists_none(self):
        self.assertEqual(self.accesses(), [])

    def test_a_session_with_background_calls_lists_each_access_once(self):
        self.main.assistant("m8", [tool_use_block("t8", "Read", {"file_path": ".env"})], usage(output=1))
        self.main.cost_state({"claude-sonnet-5": (100, 5000, 5000, 500, 0.1)})
        self.assertEqual([access["agent_type"] for access in self.accesses()], ["main"])

    def test_once_the_transcript_is_gone_its_calls_are_not_listed(self):
        self.main.assistant("m8", [tool_use_block("t8", "Read", {"file_path": ".env"})], usage(output=1))
        self.get_json("/api/summary?days=7")
        self.main.path.unlink()
        self.assertEqual(self.accesses(), [])

    def test_no_path_reaches_the_store(self):
        self.main.assistant("m8", [tool_use_block("t8", "Read", {"file_path": "/srv/PATH-MARKER-3d4/.env"})],
                            usage(output=1))
        self.assertEqual(self.accesses()[0]["path"], "/srv/PATH-MARKER-3d4/.env")
        self.store.connection.execute("PRAGMA wal_checkpoint")
        stored = b"".join(path.read_bytes() for path in self.store_path.parent.glob(f"{self.store_path.name}*"))
        self.assertNotIn(b"PATH-MARKER-3d4", stored)


class SessionStateTest(ServerCase):
    """/api/session/<id>/state: what a live card shows besides its totals, the gauge and the secret accesses."""
    secret_patterns = (".env", "~/.ssh")

    def state(self, session_id="s1"):
        """(status, payload) of a session's state."""
        return self.get_json(f"/api/session/{session_id}/state")

    def test_the_state_has_the_main_threads_gauge(self):
        _, payload = self.state()
        self.assertEqual((payload["session_id"], payload["current"]["context"]), ("s1", 110))
        self.assertIn("compact_now", payload["current"])

    def test_the_secret_accesses_are_counted_by_severity(self):
        self.main.assistant("m8", [tool_use_block("t8", "Read", {"file_path": ".env"})], usage(output=1))
        self.main.tool_result("t8", "KEY=1")
        self.main.assistant("m9", [tool_use_block("t9", "Bash", {"command": "curl -T .env x"})], usage(output=1))
        self.main.tool_result("t9", "ok")
        _, payload = self.state()
        self.assertEqual(payload["secrets"], {"high": 1, "medium": 1, "low-medium": 0, "low": 0})

    def test_the_subagents_accesses_count_too(self):
        later = datetime.now(UTC) + timedelta(minutes=1)
        agent = self.projects.subagent("s1", "a1", project="/home/dev/app").at(later)
        agent.assistant("m9", [tool_use_block("t9", "Bash", {"command": "ls ~/.ssh"})], usage(output=1))
        agent.tool_result("t9", "denied", is_error=True)
        _, payload = self.state()
        self.assertEqual(payload["secrets"]["low"], 1)

    def test_no_path_reaches_the_state(self):
        self.main.assistant("m8", [tool_use_block("t8", "Read", {"file_path": "/srv/PATH-MARKER-3d4/.env"})],
                            usage(output=1))
        _, payload = self.state()
        self.assertEqual(payload["secrets"]["medium"], 1)
        self.assertNotIn("PATH-MARKER-3d4", json.dumps(payload))

    def test_an_unknown_session_is_not_found(self):
        self.assertEqual(self.state("s9")[0], 404)

    def test_a_new_access_shows_in_the_next_state(self):
        self.state()
        self.main.assistant("m8", [tool_use_block("t8", "Read", {"file_path": ".env"})], usage(output=1))
        self.assertEqual(self.state()[1]["secrets"]["medium"], 1)

    def test_the_session_view_reads_a_changed_transcript_at_once(self):
        self.state()
        self.main.assistant("m8", [tool_use_block("t8", "Read", {"file_path": ".env"})], usage(output=1))
        _, payload = self.get_json("/api/session/s1")
        self.assertEqual(len(payload["secret_accesses"]), 1)


class ReadProcessTest(ServerCase):
    """The transcripts' tool calls read in reader processes, as serve does."""
    secret_patterns = (".env",)
    read_processes = 1

    def test_the_session_views_tools_and_secret_accesses_come_from_a_reader_process(self):
        self.main.assistant("m8", [tool_use_block("t8", "Read", {"file_path": ".env"})], usage(output=1))
        with mock.patch.object(tool_kinds.CallReader, "read", side_effect=AssertionError("read in the server")):
            status, payload = self.get_json("/api/session/s1")
        self.assertEqual(status, 200)
        self.assertEqual(payload["agents"][0]["tool_kinds"][0]["calls"], 2)
        self.assertEqual([access["path"] for access in payload["secret_accesses"]], [".env"])

    def test_a_live_cards_state_comes_from_a_reader_process(self):
        self.main.assistant("m8", [tool_use_block("t8", "Read", {"file_path": ".env"})], usage(output=1))
        _, payload = self.get_json("/api/session/s1/state")
        self.assertEqual(payload["secrets"]["medium"], 1)


class SessionStateWithoutPatternsTest(ServerCase):
    def test_without_secret_patterns_no_transcript_is_read(self):
        with counted_reads() as read:
            _, payload = self.get_json("/api/session/s1/state")
        self.assertEqual(read.call_count, 0)
        self.assertEqual(payload["secrets"], {"high": 0, "medium": 0, "low-medium": 0, "low": 0})


class DayNavigationTest(unittest.TestCase):
    TODAY = date(2026, 9, 27)

    def navigation(self, days, until, previous_day, next_day):
        """day_navigation with a fixed today."""
        return server.day_navigation(days, until, previous_day, next_day, today=self.TODAY)

    def test_only_a_single_day_has_arrows(self):
        self.assertEqual(self.navigation(7, date(2026, 9, 20), date(2026, 9, 1), date(2026, 9, 25)),
                         {"previous_day": None, "next_day": None})

    def test_today_has_no_next_day(self):
        self.assertEqual(self.navigation(1, self.TODAY, date(2026, 9, 25), None),
                         {"previous_day": "2026-09-25", "next_day": None})

    def test_an_earlier_day_always_reaches_today(self):
        self.assertEqual(self.navigation(1, date(2026, 9, 20), None, None)["next_day"], "2026-09-27")
        self.assertEqual(self.navigation(1, date(2026, 9, 20), None, date(2026, 9, 30))["next_day"], "2026-09-27")
        self.assertEqual(self.navigation(1, date(2026, 9, 20), None, date(2026, 9, 22))["next_day"], "2026-09-22")


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


class TokenTest(ServerCase):
    def test_the_api_refuses_a_request_without_the_token(self):
        for path in ("/api/live", "/api/summary?days=7", "/api/session/s1", "/api/session/s1/chat", "/api/nothing"):
            with self.subTest(path=path):
                status, payload = self.get_json(path, token=False)
                self.assertEqual(status, 403)
                self.assertIn("make status", payload["error"])

    def test_a_wrong_or_old_token_is_refused(self):
        for cookie in (f"{server.cookie_name(self.port)}=wrong", f"{server.cookie_name(self.port)}=",
                       f"{server.cookie_name(self.port + 1)}={self.app.token}", "\x00; =; ;;"):
            with self.subTest(cookie=cookie):
                self.assertEqual(self.get_json("/api/live", headers={"Cookie": cookie})[0], 403)

    def test_the_token_among_other_cookies_is_found(self):
        cookie = f'_xsrf="2|a,b]"; {server.cookie_name(self.port)}={self.app.token}; theme=dark'
        self.assertEqual(self.get_json("/api/live", headers={"Cookie": cookie})[0], 200)

    def test_the_page_and_its_scripts_hold_no_data_and_need_no_token(self):
        for path in ("/", "/static/js/app.js"):
            with self.subTest(path=path):
                self.assertEqual(self.get(path, token=False)[0], 200)

    def test_the_link_sets_the_cookie_and_takes_the_token_out_of_the_address(self):
        status, headers, _ = self.get(f"/?token={self.app.token}", token=False, opener=NO_REDIRECT_OPENER)
        self.assertEqual((status, headers["Location"]), (303, "/"))
        cookie = headers["Set-Cookie"]
        self.assertTrue(cookie.startswith(f"{server.cookie_name(self.port)}={self.app.token};"))
        for attribute in ("Path=/", "HttpOnly", "SameSite=Strict", "Max-Age="):
            with self.subTest(attribute=attribute):
                self.assertIn(attribute, cookie)

    def test_a_link_with_a_wrong_token_sets_no_cookie(self):
        status, headers, _ = self.get("/?token=wrong", token=False, opener=NO_REDIRECT_OPENER)
        self.assertEqual((status, headers["Location"], headers["Set-Cookie"]), (303, "/", None))

    def test_the_cookie_answers_the_api(self):
        _, headers, _ = self.get(f"/?token={self.app.token}", token=False, opener=NO_REDIRECT_OPENER)
        cookie = headers["Set-Cookie"].split(";")[0]
        self.assertEqual(self.get_json("/api/live", headers={"Cookie": cookie})[0], 200)

    def test_each_start_has_a_new_token(self):
        other = server.UsageApp(self.store, self.projects.root, PRICES, live_minutes=5)
        self.assertNotEqual(other.token, self.app.token)
        self.assertGreaterEqual(len(other.token), 40)

    def test_the_cookie_is_named_by_the_port(self):
        # cookies don't tell ports apart: two dashboards on one host must not replace each other's
        self.assertNotEqual(server.cookie_name(8765), server.cookie_name(8766))


class CookieValueTest(unittest.TestCase):
    def test_the_value_of_the_named_cookie(self):
        self.assertEqual(server.cookie_value("a=1; b=2;c=3", "b"), "2")
        self.assertEqual(server.cookie_value("a=1; b=2;c=3", "c"), "3")

    def test_none_without_it(self):
        for header in ("", "a=1", "b", "ab=2", "; ;"):
            with self.subTest(header=header):
                self.assertIsNone(server.cookie_value(header, "b"))


class ScanTest(ServerCase):
    def test_requests_scan_at_most_every_interval(self):
        with mock.patch.object(server.scan, "scan", wraps=scan.scan) as scanned:
            self.get("/api/live")
            self.get("/api/summary")
            self.assertEqual(scanned.call_count, 1)
            self.clock.now += server.SCAN_INTERVAL
            self.get("/api/live")
            self.assertEqual(scanned.call_count, 2)

    def test_new_data_shows_after_the_interval(self):
        self.get("/api/live")
        self.main.assistant("m4", [text_block("more")], usage(output=1))
        self.assertEqual(self.get_json("/api/session/s1")[1]["turns"], 2)
        self.clock.now += server.SCAN_INTERVAL
        self.assertEqual(self.get_json("/api/session/s1")[1]["turns"], 3)

    def test_a_failing_scan_still_serves_the_history_with_its_error(self):
        self.get("/api/live")
        shutil.rmtree(self.projects.root)
        self.clock.now += server.SCAN_INTERVAL
        with contextlib.redirect_stderr(io.StringIO()) as err:
            status, live = self.get_json("/api/live")
        self.assertEqual(status, 200)
        self.assertEqual(len(live["sessions"]), 2)
        self.assertIn("projects folder not found", live["scan_errors"][0])
        self.assertIn("projects folder not found", err.getvalue())
        self.assertIn("projects folder not found", self.get_json("/api/summary")[1]["scan_errors"][0])

    def test_a_file_the_scan_skipped_is_reported(self):
        with mock.patch.object(server.scan.transcripts, "parse", side_effect=ValueError("bad line")):
            with contextlib.redirect_stderr(io.StringIO()):
                _, live = self.get_json("/api/live")
        self.assertEqual(len(live["scan_errors"]), 3)
        self.assertIn("bad line", live["scan_errors"][0])

    def test_a_clean_scan_has_no_errors(self):
        self.assertEqual(self.get_json("/api/live")[1]["scan_errors"], [])


class ErrorTest(ServerCase):
    def test_an_unexpected_error_is_a_json_500_and_its_traceback_is_logged(self):
        with mock.patch.object(self.app, "live", side_effect=RuntimeError("boom")):
            with contextlib.redirect_stderr(io.StringIO()) as err:
                status, payload = self.get_json("/api/live")
        self.assertEqual((status, payload), (500, {"error": "RuntimeError: boom"}))
        self.assertIn("Traceback", err.getvalue())
        self.assertIn("boom", err.getvalue())

    def test_idle_connections_time_out(self):
        self.assertEqual(server.Handler.timeout, server.CONNECTION_TIMEOUT)


class RetentionTest(ServerCase):
    def setUp(self):
        super().setUp()
        self.app.retention_days = 7
        long_ago = datetime.now(UTC) - timedelta(days=40)
        self.projects.session("old").at(long_ago).assistant("m9", [text_block("x")], usage(output=9))

    def test_a_longer_range_is_cut_to_the_retention(self):
        _, payload = self.get_json("/api/summary?days=30")
        today = date.today()
        self.assertEqual((payload["days"], payload["retention_days"], payload["since"]),
                         (7, 7, (today - timedelta(days=6)).isoformat()))

    def test_the_live_sessions_range_is_cut_to_the_retention_too(self):
        _, payload = self.get_json("/api/live?days=30")
        self.assertEqual((payload["days"], payload["since"]), (7, (date.today() - timedelta(days=6)).isoformat()))

    def test_the_summary_says_where_the_history_starts(self):
        _, payload = self.get_json("/api/summary?days=7")
        self.assertEqual(payload["history_since"], date.today().isoformat())

    def test_the_requests_scan_prunes_old_sessions(self):
        self.get_json("/api/live")
        self.assertEqual(self.store.connection.execute(
            "SELECT COUNT(*) FROM messages WHERE message_id = 'm9'").fetchone()[0], 0)


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
