"""server.py: the JSON API and the dashboard page, on a real server bound to a free loopback port."""
import contextlib
import io
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
from pathlib import Path
from unittest import mock

from claude_usage import config
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
VENDOR = "/static/js/vendor/"
# what the vendored libraries contain as text, not as resources: links in their messages and license notes, XML
# namespace names, the prefix marked puts before a bare www. link, and the Objective-C keyword "@import" of
# highlight.js's grammars (a JavaScript file imports nothing that way)
VENDOR_LINKS = (b"https://github.com/highlightjs/highlight.js/issues/2277",
                b"https://github.com/highlightjs/highlight.js/wiki/security", b'"@import"',
                b"https://github.com/markedjs/marked.", b'"http://"',
                b"http://www.w3.org/1998/Math/MathML", b"http://www.w3.org/1999/xhtml",
                b"https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE")
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
            if path.startswith(VENDOR):
                # text in the vendored file, not resources; the CSP would block any load anyway
                for link in VENDOR_LINKS:
                    body = body.replace(link, b"")
            for external in (b"https://", b"http://", b"@import"):
                with self.subTest(path=path, external=external):
                    self.assertNotIn(external, body)

    def test_the_vendored_markdown_renderer_and_sanitizer_are_served_and_loaded(self):
        for path, marker in (("/static/js/vendor/marked.umd.min.js", b"marked"),
                             ("/static/js/vendor/purify.min.js", b"DOMPurify 3.")):
            with self.subTest(path=path):
                self.assertIn(path, self.page_assets())
                status, headers, body = self.get(path)
                self.assertEqual((status, headers["Content-Type"]), (200, "text/javascript; charset=utf-8"))
                self.assertIn(marker, body)

    def test_the_vendored_highlighter_is_served_and_loaded(self):
        self.assertIn("/static/js/vendor/highlight.min.js", self.page_assets())
        status, headers, body = self.get("/static/js/vendor/highlight.min.js")
        self.assertEqual((status, headers["Content-Type"]), (200, "text/javascript; charset=utf-8"))
        self.assertIn(b"Highlight.js v11.", body)

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
        self.get_json("/api/summary?days=7")
        _, payload = self.get_json("/api/session/s1/chat")
        self.assertIn("REPLY-MARKER-9c1", json.dumps(payload))
        self.store.connection.execute("PRAGMA wal_checkpoint")
        stored = b"".join(path.read_bytes() for path in self.store_path.parent.glob(f"{self.store_path.name}*"))
        for marker in (b"PROMPT-MARKER-5f2", b"REPLY-MARKER-9c1", b"RESULT-MARKER-3e7"):
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

    def test_tool_calls_carry_their_input_fields(self):
        self.main.assistant("m8", [tool_use_block("t8", "Bash", {"command": "ls", "description": "List"})],
                            usage(output=1))
        _, payload = self.get_json("/api/session/s1/chat")
        self.assertEqual(payload["entries"][-1]["tool_fields"],
                         [{"name": "command", "value": "ls", "chars": 2, "is_json": False},
                          {"name": "description", "value": "List", "chars": 4, "is_json": False}])

    def test_replies_carry_their_context_and_compact_hints(self):
        self.app.compact = server.CompactSettings(hint_tokens=1000, warn_share=0.8, auto_compact={"default": 967_000})
        self.main.assistant("m8", [text_block("big")], usage(new=10, cache_5m=90, cache_read=1400, output=1))
        _, payload = self.get_json("/api/session/s1/chat")
        entry = payload["entries"][-1]
        self.assertEqual(entry["usage"]["context"], 1500)
        self.assertEqual((entry["compact_hint"]["kind"], entry["compact_hint"]["threshold"]), ("soft", 1000))

    def test_summary_and_session_carry_the_context_stats_and_the_hint(self):
        _, summary = self.get_json("/api/summary?days=7")
        self.assertEqual((summary["context"]["turns"], summary["compact_hint_tokens"]), (2, 200_000))
        _, session = self.get_json("/api/session/s1")
        self.assertEqual((session["context"]["turns"], session["compact_hint_tokens"]), (1, 200_000))

    def test_a_deleted_transcript_is_unavailable(self):
        self.get_json("/api/summary?days=7")
        self.main.path.unlink()
        status, payload = self.get_json("/api/session/s1/chat")
        self.assertEqual((status, payload["available"], payload["entries"]), (200, False, []))

    def test_unknown_session_or_agent_is_404(self):
        for path in ("/api/session/nope/chat", "/api/session/s1/chat?agent=nope"):
            with self.subTest(path=path):
                self.assertEqual(self.get_json(path)[0], 404)

    def test_a_malformed_agent_id_is_400(self):
        status, payload = self.get_json("/api/session/s1/chat?agent=..%2Fx")
        self.assertEqual(status, 400)
        self.assertIn("agent", payload["error"])


class PageTest(unittest.TestCase):
    def test_the_page_accepts_exactly_the_servers_session_ids(self):
        main = (Path(server.__file__).parent / "static" / "js" / "main.js").read_text(encoding="utf-8")
        page = re.search(r"const SESSION_HASH = /\^#session\\/\((.+?)\)\$/;", main).group(1)
        self.assertEqual(page, re.search(r"\((.+?)\)", server.SESSION_PATH.pattern).group(1))


def reply(context, model="claude-sonnet-5", cache_read_cost=0.01):
    """A conversation entry as the chat payload has it, with the usage fields compact_hints reads."""
    return {"kind": "text",
            "usage": {"context": context, "model": model, "cost_parts": {"cache_read": cache_read_cost}}}


class CompactHintsTest(unittest.TestCase):
    """Where the conversation hints at compacting: a configurable soft threshold, and near auto-compaction."""

    def setUp(self):
        self.settings = server.CompactSettings(hint_tokens=200_000, warn_share=0.8,
                                               auto_compact={"default": 967_000, "claude-haiku-4-5": 200_000})

    def hints(self, entries):
        """The compact_hint of each entry, after compact_hints."""
        server.compact_hints(entries, self.settings)
        return [entry.get("compact_hint") for entry in entries]

    def test_a_soft_hint_where_the_context_first_crosses_the_threshold(self):
        hints = self.hints([reply(150_000), reply(250_000, cache_read_cost=0.03), reply(290_000)])
        self.assertEqual(hints, [None, {"kind": "soft", "context": 250_000, "threshold": 200_000,
                                        "reread_cost": 0.03}, None])

    def test_soft_reminders_at_each_step_over_the_threshold(self):
        hints = self.hints([reply(210_000), reply(290_000), reply(310_000), reply(350_000), reply(400_000)])
        self.assertEqual([hint and hint["kind"] for hint in hints],
                         ["soft", None, "soft_reminder", None, "soft_reminder"])
        self.assertEqual(hints[2], {"kind": "soft_reminder", "context": 310_000, "threshold": 200_000, "times": 1.6})

    def test_a_jump_past_several_steps_reminds_once(self):
        hints = self.hints([reply(210_000), reply(520_000), reply(590_000), reply(600_000)])
        self.assertEqual([hint and hint["kind"] for hint in hints], ["soft", "soft_reminder", None, "soft_reminder"])

    def test_auto_reminders_at_each_step_of_the_auto_compact_point(self):
        contexts = (780_000, 800_000, 825_000, 830_000, 875_000)      # 80.7, 82.7, 85.3, 85.8, 90.5 %
        hints = self.hints([reply(context) for context in contexts])
        self.assertEqual([hint and hint["kind"] for hint in hints],
                         ["auto", None, "auto_reminder", None, "auto_reminder"])
        self.assertEqual(hints[4], {"kind": "auto_reminder", "context": 875_000, "auto_compact": 967_000,
                                    "share": 0.9})

    def test_no_soft_reminders_once_the_auto_tier_announced(self):
        hints = self.hints([reply(210_000), reply(790_000), reply(810_000)])
        self.assertEqual([hint and hint["kind"] for hint in hints], ["soft", "auto", None])

    def test_the_reminders_start_again_after_a_compaction(self):
        hints = self.hints([reply(210_000), reply(310_000), {"kind": "compaction"}, reply(220_000), reply(300_000)])
        self.assertEqual([hint and hint["kind"] for hint in hints],
                         ["soft", "soft_reminder", None, "soft", "soft_reminder"])

    def test_the_steps_come_from_the_settings(self):
        self.settings = server.CompactSettings(hint_tokens=100_000, warn_share=0.8, auto_compact={"default": 967_000},
                                               reminder_step=1.0, auto_reminder_step=0.1)
        hints = self.hints([reply(100_000), reply(150_000), reply(200_000)])
        self.assertEqual([hint and hint["kind"] for hint in hints], ["soft", None, "soft_reminder"])

    def test_the_hint_comes_again_after_a_compaction(self):
        hints = self.hints([reply(250_000), {"kind": "compaction"}, reply(40_000), reply(210_000)])
        self.assertEqual([hint and hint["kind"] for hint in hints], ["soft", None, None, "soft"])

    def test_near_the_auto_compact_point_of_the_model(self):
        haiku = self.hints([reply(170_000, model="claude-haiku-4-5-20251001")])
        self.assertEqual(haiku, [{"kind": "auto", "context": 170_000, "auto_compact": 200_000, "share": 0.85}])
        default = self.hints([reply(700_000), reply(780_000)])
        self.assertEqual([hint["kind"] for hint in default], ["soft", "auto"])
        self.assertEqual(default[1]["auto_compact"], 967_000)

    def test_crossing_both_at_once_warns_once(self):
        hints = self.hints([reply(800_000), reply(810_000)])
        self.assertEqual([hint and hint["kind"] for hint in hints], ["auto", None])

    def test_entries_without_usage_are_left_alone(self):
        self.assertEqual(self.hints([{"kind": "prompt", "usage": None}, {"kind": "tool"}]), [None, None])


class CompactSettingsTest(unittest.TestCase):
    def test_the_shipped_settings(self):
        settings = server.parse_compact_settings(config.load(overrides=[]).values)
        self.assertEqual((settings.hint_tokens, settings.warn_share), (200_000, 0.8))
        self.assertEqual((settings.reminder_step, settings.auto_reminder_step), (0.5, 0.05))
        self.assertEqual(server.auto_compact_point(settings, "claude-opus-5-5[1m]"), 967_000)
        self.assertEqual(server.auto_compact_point(settings, "claude-haiku-4-5-20251001"), 200_000)

    def test_missing_tables_take_the_defaults(self):
        self.assertEqual(server.parse_compact_settings({}), server.DEFAULT_COMPACT)

    def test_bad_values_raise(self):
        for values in ({"chat": {"compact_hint_tokens": "lots"}}, {"chat": {"auto_compact_warn_share": 2}},
                       {"auto_compact": {"default": -1}}, {"chat": {"compact_hint_tokens": True}},
                       {"chat": {"compact_reminder_step": 0}}, {"chat": {"auto_compact_reminder_step": 1.5}},
                       {"chat": {"compact_reminder_step": float("inf")}}, {"chat": {"auto_compact_warn_share": 5}},
                       {"chat": 5}, {"auto_compact": "x"}):
            with self.subTest(values=values):
                with self.assertRaises(config.ConfigError):
                    server.parse_compact_settings(values)


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
        with mock.patch.object(server.store.transcripts, "parse", side_effect=ValueError("bad line")):
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
