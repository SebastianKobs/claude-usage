import contextlib
import http.cookiejar
import io
import json
import random
import shutil
import tempfile
import types
import unittest
import urllib.request
from datetime import UTC
from datetime import datetime
from datetime import timedelta
from pathlib import Path

from claude_usage import compact
from claude_usage import config
from claude_usage import notify
from claude_usage import permissions
from claude_usage import pricing
from claude_usage import scan
from claude_usage import secret_paths
from claude_usage import server
from claude_usage import store

import demo
from helpers import TMP_DIR

# one demo for the module: a build takes about two seconds
SHARED = types.SimpleNamespace()


def setUpModule():
    """Build the shared demo for the current time and scan it into its store."""
    TMP_DIR.mkdir(exist_ok=True)
    SHARED.root = Path(tempfile.mkdtemp(dir=TMP_DIR))
    SHARED.now = datetime.now(UTC).replace(microsecond=0)
    SHARED.paths = demo.build(SHARED.root / "demo", SHARED.now)
    SHARED.store = store.Store(SHARED.paths.store, check_same_thread=False)
    SHARED.scanned = scan.scan(SHARED.store, SHARED.paths.projects)


def tearDownModule():
    """Remove the shared demo."""
    SHARED.store.close()
    shutil.rmtree(SHARED.root)


def files_below(root):
    """Every file below root by its relative path, with its bytes and mtime."""
    return {path.relative_to(root): (path.read_bytes(), path.stat().st_mtime_ns)
            for path in sorted(root.rglob("*")) if path.is_file()}


def record_times(root):
    """The timestamp of every record in the transcripts below root."""
    times = []
    for path in root.rglob("*.jsonl"):
        for line in path.read_text(encoding="utf-8").splitlines():
            stamp = json.loads(line).get("timestamp")
            if stamp:
                times.append(datetime.fromisoformat(stamp))
    return times


class StubApp:
    """Stands in for the dashboard behind the prompt socket: keeps what the hook posted."""

    def __init__(self):
        self.prompts = []

    def note_prompt(self, prompt):
        """Keep a prompt the socket's handler read."""
        self.prompts.append(prompt)


def open_socket(case, path, app=None):
    """A dashboard's prompt socket at path for app (else a StubApp), serving until the test case ends; returns the
    app."""
    app = app or StubApp()
    prompt_server = server.open_prompt_socket(app, path)
    prompt_server.start()
    case.addCleanup(server.close_prompt_socket, prompt_server)
    return app


def earlier_demo(root):
    """A folder as an earlier build leaves it, without the cost of one: the marker and a transcript."""
    (root / "projects").mkdir(parents=True)
    (root / demo.MARKER).write_text("", encoding="utf-8")
    (root / "projects" / "old.jsonl").write_text("{}\n", encoding="utf-8")
    return demo.DemoPaths(root)


class TempCase(unittest.TestCase):
    """A fresh folder under tests/.tmp/ for each test."""

    def setUp(self):
        TMP_DIR.mkdir(exist_ok=True)
        self.tmp = Path(tempfile.mkdtemp(dir=TMP_DIR))
        self.addCleanup(shutil.rmtree, self.tmp)


class DemoCase(TempCase):
    """The shared demo, and a dashboard app over its store for each test, with the demo's config."""

    def setUp(self):
        super().setUp()
        self.now = SHARED.now
        self.paths = SHARED.paths
        self.store = SHARED.store
        values = config.load(overrides=[demo.config_file(self.paths)]).values
        prices = pricing.parse_prices(values["prices"], values.get("fees"))
        self.app = server.UsageApp(self.store, self.paths.projects, prices, live_minutes=5, agent_live_minutes=180,
                                   compact=compact.parse_compact_settings(values),
                                   secret_settings=secret_paths.parse_secrets(values))
        self.addCleanup(self.app.close)

    def rows(self, sql, *parameters):
        """All rows of a query on the demo's store as tuples."""
        return [tuple(row) for row in self.store.connection.execute(sql, parameters)]

    def live(self):
        """The live sessions by id."""
        return {session["session_id"]: session for session in self.app.live()["sessions"]}


class BuildTest(DemoCase):
    def test_every_transcript_scans_without_an_error(self):
        self.assertGreater(SHARED.scanned.files_scanned, 100)
        self.assertEqual(SHARED.scanned.errors, ())

    def test_no_record_lies_after_the_time_it_was_built_for(self):
        self.assertLessEqual(max(record_times(self.paths.projects)), self.now)

    def test_the_history_spans_the_thirty_days_the_store_keeps(self):
        days = [datetime.fromisoformat(day).date()
                for (day,) in self.rows("SELECT DISTINCT day FROM messages ORDER BY day")]
        today = self.now.astimezone().date()
        self.assertGreaterEqual(days[0], today - timedelta(days=29))
        self.assertLessEqual(days[0], today - timedelta(days=25))
        self.assertGreater(len(days), 18)

    def test_it_uses_opus_sonnet_and_haiku(self):
        models = {model for (model,) in self.rows("SELECT DISTINCT model FROM messages")}
        self.assertEqual(models, {demo.OPUS, demo.SONNET, demo.HAIKU})

    def test_some_calls_ran_in_ultracode(self):
        self.assertGreater(self.rows("SELECT COUNT(*) FROM messages WHERE ultracode = 1")[0][0], 0)

    def test_the_cost_states_add_background_calls(self):
        self.assertGreater(self.rows("SELECT COUNT(*) FROM background_parts")[0][0], 0)

    def test_a_rate_limit_was_hit(self):
        self.assertGreater(self.rows("SELECT COUNT(*) FROM api_errors WHERE error = 'rate_limit'")[0][0], 0)

    def test_calls_are_attributed_to_skills_and_mcp_servers(self):
        skills, servers = self.rows("SELECT COUNT(skill), COUNT(mcp_server) FROM messages")[0]
        self.assertGreater(skills, 0)
        self.assertGreater(servers, 0)

    def test_the_same_time_and_seed_build_the_same_files(self):
        again = demo.build(self.tmp / "again", self.now)
        self.assertEqual(files_below(again.projects), files_below(self.paths.projects))

    def test_another_seed_plans_other_sessions(self):
        self.assertNotEqual(demo.past_specs(self.now, random.Random(demo.SEED + 1)),
                            demo.past_specs(self.now, random.Random(demo.SEED)))


class LiveTest(DemoCase):
    def test_without_the_hook_the_waiting_and_the_busy_session_are_live(self):
        self.assertEqual(set(self.live()), {demo.FEATURED_SESSION, demo.BUSY_SESSION})

    def test_the_featured_session_waits_for_an_answer(self):
        waiting = self.live()[demo.FEATURED_SESSION]["waiting"]
        self.assertEqual((waiting["kind"], waiting["tool"]), ("question", "AskUserQuestion"))

    def test_the_busy_session_has_a_subagent_at_work(self):
        subagents = self.live()[demo.BUSY_SESSION]["subagents"]
        self.assertEqual([agent["agent_type"] for agent in subagents], ["general-purpose"])

    def test_a_posted_permission_prompt_makes_the_third_session_wait(self):
        open_socket(self, self.tmp / "p.sock", self.app)
        demo.post_prompt(self.tmp / "p.sock", demo.hook_input(demo.PERMISSION_SESSION, "Bash"))
        waiting = self.live()[demo.PERMISSION_SESSION]["waiting"]
        self.assertEqual((waiting["kind"], waiting["tool"]), ("permission", "Bash"))


class FeaturedSessionTest(DemoCase):
    def test_it_is_past_the_compact_hint(self):
        current = self.app.session(demo.FEATURED_SESSION)["current"]
        self.assertGreater(current["context"], current["hint_tokens"])

    def test_it_compacted_twice(self):
        count = self.rows("SELECT COUNT(*) FROM compactions JOIN transcripts USING (path) WHERE session_id = ?",
                          demo.FEATURED_SESSION)[0][0]
        self.assertEqual(count, 2)

    def test_one_secret_access_was_sent_out_and_one_came_back(self):
        accesses = self.app.session(demo.FEATURED_SESSION)["secret_accesses"]
        self.assertEqual([access["reach"] for access in accesses], ["sent", "returned"])

    def test_it_has_subagents_and_a_workflow_run(self):
        types_seen = {agent["agent_type"] for agent in self.app.session(demo.FEATURED_SESSION)["agents"]}
        self.assertLessEqual({"Explore", "general-purpose", "workflow-subagent"}, types_seen)


class ConfigTest(DemoCase):
    def test_the_demo_dashboard_sends_no_desktop_notifications(self):
        loaded = config.load(overrides=[demo.config_file(self.paths)])
        self.assertFalse(notify.parse_notify(loaded.values).enabled)

    def test_the_demo_keeps_thirty_days(self):
        loaded = config.load(overrides=[demo.config_file(self.paths)])
        self.assertEqual(config.settings(loaded).retention_days, 30)

    def test_the_config_file_is_where_serve_looks_with_the_demos_config_home(self):
        _, environment = demo.serve_command(self.paths, demo.DEFAULT_PORT)
        self.assertEqual(config.user_config_file(environment), demo.config_file(self.paths))


class RebuildTest(TempCase):
    def test_building_again_replaces_the_earlier_demo(self):
        paths = earlier_demo(self.tmp / "demo")
        demo.build(paths.root, datetime.now(UTC).replace(microsecond=0))
        self.assertFalse((paths.projects / "old.jsonl").exists())
        self.assertTrue((paths.root / demo.MARKER).exists())

    def test_a_folder_that_is_no_demo_is_left_alone(self):
        root = self.tmp / "mine"
        root.mkdir()
        (root / "keep.txt").write_text("mine", encoding="utf-8")
        with self.assertRaises(demo.DemoError):
            demo.build(root, datetime.now(UTC))
        self.assertEqual((root / "keep.txt").read_text(encoding="utf-8"), "mine")

    @unittest.skipUnless(server.HAS_UNIX_SOCKETS, "needs Unix sockets")
    def test_a_demo_whose_dashboard_still_runs_is_left_alone(self):
        paths = earlier_demo(self.tmp / "demo")
        open_socket(self, permissions.socket_path(paths.store))
        with self.assertRaises(demo.DemoError) as caught:
            demo.build(paths.root, datetime.now(UTC))
        self.assertIn("still runs", str(caught.exception))
        self.assertTrue((paths.projects / "old.jsonl").exists())


@unittest.skipUnless(server.HAS_UNIX_SOCKETS, "needs Unix sockets")
class PostPromptTest(TempCase):
    def test_the_prompt_reaches_the_dashboard_as_the_hook_sends_it(self):
        app = open_socket(self, self.tmp / "p.sock")
        demo.post_prompt(self.tmp / "p.sock", demo.hook_input("s1", "Bash"))
        self.assertEqual([(prompt.session_id, prompt.tool) for prompt in app.prompts], [("s1", "Bash")])

    def test_a_prompt_the_dashboard_refuses_raises(self):
        open_socket(self, self.tmp / "p.sock")
        with self.assertRaises(demo.DemoError) as caught:
            demo.post_prompt(self.tmp / "p.sock", {"hook_event_name": "Notification", "session_id": "s1"})
        self.assertIn("400", str(caught.exception))

    def test_posting_without_a_dashboard_raises(self):
        with self.assertRaises(demo.DemoError):
            demo.post_prompt(self.tmp / "none.sock", demo.hook_input("s1", "Bash"))


class ServeTest(DemoCase):
    def start(self):
        """The demo's dashboard on a free port, stopped when the test ends; returns the process and its link."""
        with contextlib.redirect_stdout(io.StringIO()):
            process, link = demo.start_dashboard(self.paths, 0)
        self.addCleanup(demo.stop_dashboard, process)
        return process, link

    def test_serve_runs_the_checkouts_dashboard_on_the_demo(self):
        command, environment = demo.serve_command(self.paths, 8799)
        self.assertEqual(command[1:4], ["-m", "claude_usage", "serve"])
        options = dict(zip(command[4::2], command[5::2]))
        self.assertEqual(options, {"--projects-dir": str(self.paths.projects), "--store": str(self.paths.store),
                                   "--port": "8799"})
        self.assertEqual(environment["XDG_CONFIG_HOME"], str(self.paths.config_home))

    @unittest.skipUnless(server.HAS_UNIX_SOCKETS, "needs Unix sockets")
    def test_the_dashboard_serves_the_demo_with_the_permission_prompt(self):
        _, link = self.start()
        demo.post_prompt(permissions.socket_path(self.paths.store),
                         demo.hook_input(demo.PERMISSION_SESSION, "Bash"))
        opener = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(http.cookiejar.CookieJar()))
        opener.open(link, timeout=30).close()                  # the link's token goes into the cookie
        with opener.open(f"{link.split('/?', 1)[0]}/api/live", timeout=30) as response:
            sessions = json.load(response)["sessions"]
        waits = {session["session_id"]: (session["waiting"] or {}).get("kind") for session in sessions}
        self.assertEqual(waits, {demo.FEATURED_SESSION: "question", demo.BUSY_SESSION: None,
                                 demo.PERMISSION_SESSION: "permission"})

    def test_stopping_the_dashboard_ends_its_process(self):
        process, _ = self.start()
        demo.stop_dashboard(process)
        self.assertIsNotNone(process.poll())


class MainTest(TempCase):
    def test_it_builds_the_demo_without_serving_when_asked(self):
        with contextlib.redirect_stdout(io.StringIO()) as output:
            code = demo.main(["--out", str(self.tmp / "demo"), "--no-serve"])
        self.assertEqual(code, 0)
        self.assertTrue((self.tmp / "demo" / "projects").is_dir())
        self.assertIn("-m claude_usage serve", output.getvalue())

    def test_bad_arguments_exit_with_2(self):
        with contextlib.redirect_stderr(io.StringIO()):
            self.assertEqual(demo.main(["--port", "x"]), 2)

    def test_a_folder_that_is_no_demo_exits_with_1_and_says_why(self):
        (self.tmp / "keep.txt").write_text("mine", encoding="utf-8")
        with contextlib.redirect_stderr(io.StringIO()) as errors:
            code = demo.main(["--out", str(self.tmp), "--no-serve"])
        self.assertEqual(code, 1)
        self.assertIn("isn't a demo folder", errors.getvalue())
