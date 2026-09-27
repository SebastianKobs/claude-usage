"""store.py: incremental scans into SQLite, and the queries behind the report and the dashboard."""
import os
import sqlite3
import time
import unittest
from datetime import UTC
from datetime import date
from datetime import datetime
from datetime import timedelta
from unittest import mock

from claude_usage import pricing
from claude_usage import store
from helpers import TempDirTestCase
from helpers import create_result
from helpers import edit_result
from helpers import text_block
from helpers import thinking_block
from helpers import tool_use_block
from helpers import usage

PRICES = pricing.parse_prices({
    "claude-sonnet-5": {"input": 2.0, "cache_write_5m": 2.5, "cache_write_1h": 4.0, "cache_read": 0.2,
                        "output": 10.0},
    "claude-opus-5": {"input": 5.0, "cache_write_5m": 6.25, "cache_write_1h": 10.0, "cache_read": 0.5,
                      "output": 25.0, "fast_multiplier": 2.0},
    "claude-haiku-4-5": {"input": 1.0, "cache_write_5m": 1.25, "cache_write_1h": 2.0, "cache_read": 0.1,
                         "output": 5.0},
})
HAIKU = "claude-haiku-4-5-20251001"
MILLION = 1_000_000
DAY_1 = datetime(2026, 9, 1, 12, 0, tzinfo=UTC)
DAY_3 = datetime(2026, 9, 3, 12, 0, tzinfo=UTC)
DATE_AFTER = datetime(2026, 9, 4, 9, 0, tzinfo=UTC)


def local_day(moment):
    """The local date string the store files a UTC timestamp under."""
    return moment.astimezone().date().isoformat()


def local_hour(moment):
    """The local hour string the store groups a UTC timestamp under for hourly totals."""
    return moment.astimezone().strftime("%Y-%m-%dT%H")


class StoreCase(TempDirTestCase):
    """A temp projects folder and an open store on self.store_path."""

    def setUp(self):
        super().setUp()
        self.store = store.Store(self.store_path)
        self.addCleanup(self.store.close)

    def scan(self, project_filter=None):
        """One incremental scan of the temp projects folder."""
        return store.scan(self.store, self.projects.root, project_filter)

    def rows(self, sql, *parameters):
        """All rows of a query as tuples."""
        return [tuple(row) for row in self.store.connection.execute(sql, parameters)]

    def count(self, table):
        """The number of rows in a table."""
        return self.rows(f"SELECT COUNT(*) FROM {table}")[0][0]

    def dump(self):
        """Every row of the data tables, for comparing two stores."""
        return {table: self.rows(f"SELECT * FROM {table} ORDER BY 1")
                for table in ("transcripts", "messages", "tool_calls")}


def build_session(projects, session_id="s1", project="/home/dev/app"):
    """A main transcript with two turns, a tool call and its result, a title, and one Explore subagent."""
    main = projects.session(session_id, project=project)
    main.user("Fix the parser")
    main.ai_title("Parser fix")
    main.assistant(f"{session_id}-m1", [thinking_block(), tool_use_block(f"{session_id}-t1", "Read")],
                   usage(new=10, cache_5m=1000, cache_read=0, output=50))
    main.tool_result(f"{session_id}-t1", "x" * 300)
    main.assistant(f"{session_id}-m2", [text_block("done")], usage(new=5, cache_5m=200, cache_read=1000, output=20))
    agent = projects.subagent(session_id, "a1", project=project, meta={"agentType": "Explore",
                                                                        "description": "look around"})
    agent.assistant(f"{session_id}-a1-m1", [tool_use_block(f"{session_id}-t2", "mcp__srv__find")],
                    usage(new=3, cache_1h=400, output=30), model="claude-opus-5")
    agent.tool_result(f"{session_id}-t2", [{"type": "text", "text": "abcd"}])
    return main, agent


class ScanTest(StoreCase):
    def test_first_scan_fills_the_tables(self):
        main, agent = build_session(self.projects)
        result = self.scan()
        self.assertEqual((result.files_scanned, result.files_skipped, result.messages_upserted),
                         (2, 0, 3))
        self.assertEqual(result.bytes_read, main.path.stat().st_size + agent.path.stat().st_size)
        self.assertEqual((self.count("transcripts"), self.count("messages"), self.count("tool_calls")), (2, 3, 2))
        self.assertEqual(self.rows("SELECT tool, result_chars FROM tool_calls ORDER BY tool"),
                         [("Read", 300), ("srv.find", 4)])
        self.assertEqual(self.rows("SELECT agent_type, description, project, title FROM transcripts "
                                   "ORDER BY agent_type"),
                         [("Explore", "look around", "/home/dev/app", None),
                          ("main", None, "/home/dev/app", "Parser fix")])

    def test_messages_keep_the_final_usage_and_the_local_day(self):
        main = self.projects.session("s1")
        main.at(DAY_3).assistant("m1", [thinking_block(), text_block("a")], usage(new=1, output=40))
        self.scan()
        self.assertEqual(self.rows("SELECT message_id, output, day FROM messages"), [("m1", 40, local_day(DAY_3))])

    def test_unchanged_files_are_skipped(self):
        build_session(self.projects)
        self.scan()
        result = self.scan()
        self.assertEqual((result.files_scanned, result.files_skipped, result.bytes_read), (0, 2, 0))

    def test_a_grown_file_is_read_from_its_offset(self):
        main, _ = build_session(self.projects)
        self.scan()
        before = main.path.stat().st_size
        main.assistant("s1-m3", [text_block("more")], usage(output=7))
        result = self.scan()
        self.assertEqual((result.files_scanned, result.files_skipped), (1, 1))
        self.assertEqual(result.bytes_read, main.path.stat().st_size - before)
        self.assertEqual(self.count("messages"), 4)
        self.assertEqual(self.rows("SELECT read_offset FROM transcripts WHERE agent_id IS NULL"),
                         [(main.path.stat().st_size,)])

    def test_reading_in_pieces_gives_the_same_rows_as_one_read(self):
        main = self.projects.session("s1")
        main.queue_operation()
        self.scan()
        main.user("start")
        main.assistant("m1", [thinking_block()], dict(usage(new=4, cache_read=10, output=40), output_tokens=1))
        self.scan()
        main.assistant("m1", [tool_use_block("t1", "Grep")], usage(new=4, cache_read=10, output=40))
        self.scan()
        main.tool_result("t1", "found it")
        main.git_branch = "feature"
        main.ai_title("Late title")
        main.assistant("m2", [text_block("ok")], usage(output=3))
        self.scan()
        pieces = self.dump()

        whole = store.Store(self.tmp / "whole.sqlite")
        self.addCleanup(whole.close)
        store.scan(whole, self.projects.root)
        whole_rows = {table: [tuple(row) for row in whole.connection.execute(f"SELECT * FROM {table} ORDER BY 1")]
                      for table in ("transcripts", "messages", "tool_calls")}
        self.assertEqual(pieces, whole_rows)
        self.assertEqual(self.rows("SELECT output FROM messages WHERE message_id = 'm1'"), [(40,)])
        self.assertEqual(self.rows("SELECT result_chars FROM tool_calls"), [(8,)])
        self.assertEqual(self.rows("SELECT title, git_branch FROM transcripts"), [("Late title", "feature")])

    def test_a_later_read_without_attribution_keeps_the_stored_one(self):
        main = self.projects.session("s1")
        main.assistant("m1", [thinking_block()], usage(output=1), attributionSkill="dataviz",
                       attributionMcpServer="github")
        self.scan()
        main.assistant("m1", [text_block("done")], usage(output=40))
        self.scan()
        self.assertEqual(self.rows("SELECT skill, mcp_server, output FROM messages"), [("dataviz", "github", 40)])

    def test_a_half_written_line_is_picked_up_once_complete(self):
        main = self.projects.session("s1")
        main.user("hi")
        line = '{"type": "ai-title", "aiTitle": "Done", "sessionId": "s1"}'
        main.partial(line[:20])
        self.scan()
        self.assertEqual(self.rows("SELECT title FROM transcripts"), [(None,)])
        main.write_text(f"{line[20:]}\n")
        self.scan()
        self.assertEqual(self.rows("SELECT title FROM transcripts"), [("Done",)])

    def test_a_truncated_file_is_read_again_from_the_start(self):
        main = self.projects.session("s1")
        main.assistant("m1", [text_block("a")], usage(output=1))
        main.assistant("m2", [text_block("b")], usage(output=2))
        self.scan()
        lines = main.path.read_text(encoding="utf-8").splitlines(keepends=True)
        main.path.write_text(lines[0], encoding="utf-8")
        self.scan()
        main.assistant("m3", [text_block("c")], usage(output=3))
        self.scan()
        self.assertEqual(self.rows("SELECT message_id, output FROM messages ORDER BY 1"),
                         [("m1", 1), ("m2", 2), ("m3", 3)])
        self.assertEqual(self.rows("SELECT read_offset FROM transcripts"), [(main.path.stat().st_size,)])

    def test_a_rewritten_file_with_a_new_first_line_is_read_again(self):
        main = self.projects.session("s1")
        main.assistant("m1", [text_block("a")], usage(output=1))
        self.scan()
        rewritten = self.projects.session("s1")
        rewritten.path.write_text("", encoding="utf-8")
        rewritten.user("a different start that is longer than the old first line was")
        rewritten.assistant("m1", [text_block("a")], usage(output=5))
        rewritten.assistant("m9", [text_block("b")], usage(output=9))
        self.scan()
        self.assertEqual(self.rows("SELECT message_id, output FROM messages ORDER BY 1"), [("m1", 5), ("m9", 9)])

    def test_an_interrupted_scan_leaves_the_file_as_before(self):
        main, _ = build_session(self.projects)
        self.scan()
        before = self.dump()
        main.assistant("s1-m3", [tool_use_block("s1-t9", "Bash")], usage(output=7))
        with mock.patch.object(store, "insert_tool_calls", side_effect=sqlite3.OperationalError("disk full")):
            with self.assertRaises(sqlite3.OperationalError):
                self.scan()
        self.assertEqual(self.dump(), before)
        self.scan()
        self.assertEqual(self.count("messages"), 4)

    def test_a_forked_copy_neither_double_counts_nor_takes_over(self):
        original = self.projects.session("s1")
        original.assistant("m1", [tool_use_block("t1", "Read")], usage(output=10))
        original.tool_result("t1", "abc")
        fork = self.projects.session("s2")
        fork.path.write_bytes(original.path.read_bytes().replace(b'"s1"', b'"s2"'))
        fork.assistant("m2", [text_block("new")], usage(output=20))
        self.scan()
        self.assertEqual(self.rows("SELECT m.message_id, t.session_id FROM messages m JOIN transcripts t "
                                   "ON t.path = m.path ORDER BY 1"), [("m1", "s1"), ("m2", "s2")])
        self.assertEqual(self.rows("SELECT tool_use_id, result_chars FROM tool_calls"), [("t1", 3)])
        self.assertEqual(store.totals_by(self.store, "model", None, PRICES)[0]["output"], 30)

    def test_a_copy_does_not_change_the_owners_counters(self):
        original = self.projects.session("s1")
        original.assistant("m1", [text_block("a")], usage(output=10))
        self.scan()
        copy = self.projects.session("s2")
        copy.assistant("m1", [text_block("a")], usage(output=99))
        self.scan()
        self.assertEqual(self.rows("SELECT output, path FROM messages"), [(10, str(original.path))])

    def test_a_copy_does_not_change_the_owners_tool_results(self):
        original = self.projects.session("s1")
        original.assistant("m1", [tool_use_block("t1", "Read")], usage(output=1))
        original.tool_result("t1", "abc")
        self.scan()
        copy = self.projects.session("s2")
        copy.tool_result("t1", "a much longer result")
        self.scan()
        self.assertEqual(self.rows("SELECT result_chars FROM tool_calls"), [(3,)])

    def test_rows_stay_after_a_transcript_is_deleted(self):
        main, agent = build_session(self.projects)
        self.scan()
        main.path.unlink()
        agent.path.unlink()
        self.scan()
        self.assertEqual((self.count("transcripts"), self.count("messages")), (2, 3))

    def test_project_filter(self):
        build_session(self.projects, "s1", project="/home/dev/app")
        build_session(self.projects, "s2", project="/home/dev/other")
        result = self.scan(project_filter="/home/dev/other")
        self.assertEqual(result.files_scanned, 2)
        self.assertEqual(self.rows("SELECT DISTINCT session_id FROM transcripts"), [("s2",)])

    def test_project_falls_back_to_the_slug_until_a_cwd_appears(self):
        main = self.projects.session("s1")
        main.queue_operation()
        self.scan()
        self.assertEqual(self.rows("SELECT project FROM transcripts"), [("-home-dev-app",)])
        main.user("hi")
        self.scan()
        self.assertEqual(self.rows("SELECT project FROM transcripts"), [("/home/dev/app",)])

    def test_first_cwd_is_kept(self):
        main = self.projects.session("s1")
        main.user("hi")
        self.scan()
        main.cwd = "/elsewhere"
        main.user("again")
        self.scan()
        self.assertEqual(self.rows("SELECT cwd, project FROM transcripts"), [("/home/dev/app", "/home/dev/app")])

    def test_agent_type_is_kept_when_the_meta_file_disappears(self):
        _, agent = build_session(self.projects)
        self.scan()
        agent.path.with_name("agent-a1.meta.json").unlink()
        agent.user("more")
        self.scan()
        self.assertEqual(self.rows("SELECT agent_type FROM transcripts WHERE agent_id = 'a1'"), [("Explore",)])

    def test_a_meta_file_that_appears_later_sets_the_agent_type(self):
        agent = self.projects.subagent("s1", "a1", meta=False)
        agent.assistant("m1", [text_block("a")], usage(output=5))
        self.scan()
        meta_path = agent.path.with_name("agent-a1.meta.json")
        meta_path.write_text('{"agentType": "Explore"}', encoding="utf-8")
        later = agent.path.stat().st_mtime_ns + 1_000_000_000
        os.utime(meta_path, ns=(later, later))
        self.scan()
        self.assertEqual(self.rows("SELECT agent_type FROM transcripts WHERE agent_id = 'a1'"), [("Explore",)])

    def test_time_range_widens_across_reads(self):
        main = self.projects.session("s1")
        main.at(DAY_1).user("hi")
        self.scan()
        main.at(DAY_3).user("later")
        self.scan()
        first, last = self.rows("SELECT first_ts, last_ts FROM transcripts")[0]
        self.assertEqual((datetime.fromisoformat(first), datetime.fromisoformat(last)), (DAY_1, DAY_3))

    def test_a_file_that_fails_to_parse_is_reported_and_the_others_are_stored(self):
        build_session(self.projects, "s1")
        build_session(self.projects, "s2")
        parse = store.transcripts.parse

        def fail_for_s1(path, *arguments):
            """Parse every file except s1's main transcript, which raises like a parser bug would."""
            if path.name == "s1.jsonl":
                raise ValueError("year 58692 is out of range")
            return parse(path, *arguments)

        with mock.patch.object(store.transcripts, "parse", side_effect=fail_for_s1):
            result = self.scan()
        self.assertEqual(len(result.errors), 1)
        self.assertIn("year 58692", result.errors[0])
        self.assertEqual(self.rows("SELECT session_id FROM transcripts WHERE agent_id IS NULL"), [("s2",)])
        self.scan()
        self.assertEqual(self.count("transcripts"), 4)

    def test_a_file_that_vanishes_during_the_scan_is_reported_and_skipped(self):
        build_session(self.projects)
        with mock.patch.object(store.transcripts, "parse", side_effect=FileNotFoundError("gone")):
            result = self.scan()
        self.assertEqual(len(result.errors), 2)
        self.assertIn("gone", result.errors[0])
        self.assertEqual(self.count("transcripts"), 0)


class BackgroundTest(StoreCase):
    """Usage Claude Code's cost-state records show but no transcript does, per session and model."""

    def setUp(self):
        super().setUp()
        self.main = self.projects.session("s1")
        self.main.at(DAY_3).user("hi")
        self.main.assistant("m1", [text_block("a")], usage(new=10, cache_5m=100, cache_read=1000, output=50))
        agent = self.projects.subagent("s1", "a1")
        agent.at(DAY_3).assistant("m2", [text_block("b")], usage(output=30))

    def background(self):
        """The background rows as (model, new_input, cache_write, cache_read, output)."""
        return self.rows("SELECT model, new_input, cache_write, cache_read, output FROM background ORDER BY model")

    def test_no_cost_state_no_background(self):
        self.scan()
        self.assertEqual(self.background(), [])

    def test_the_snapshot_minus_main_thread_and_subagents(self):
        self.main.cost_state({"claude-sonnet-5": (15, 100, 1500, 100, 1.0), HAIKU: (2000, 0, 0, 100, 0.01)})
        self.scan()
        self.assertEqual(self.background(), [(HAIKU, 2000, 0, 0, 100), ("claude-sonnet-5", 5, 0, 500, 20)])

    def test_a_category_below_the_transcripts_counts_as_zero(self):
        self.main.cost_state({"claude-sonnet-5": (0, 50, 1000, 90, 1.0)})
        self.scan()
        self.assertEqual(self.background(), [("claude-sonnet-5", 0, 0, 0, 10)])

    def test_nothing_missing_means_no_row(self):
        self.main.cost_state({"claude-sonnet-5": (10, 100, 1000, 80, 1.0)})
        self.scan()
        self.assertEqual(self.background(), [])

    def test_an_interrupted_scan_still_gets_its_background_on_the_next(self):
        self.main.cost_state({"claude-sonnet-5": (15, 100, 1000, 80, 1.0)})
        self.projects.session("s2").assistant("m9", [text_block("c")], usage(output=5))
        scan_file = store.scan_file

        def lock_at_s2(usage_store, path, known):
            """Scan every file until s2's, where the store is locked, as when another scan holds it too long."""
            if path.name == "s2.jsonl":
                raise sqlite3.OperationalError("database is locked")
            return scan_file(usage_store, path, known)

        with mock.patch.object(store, "scan_file", side_effect=lock_at_s2):
            with self.assertRaises(sqlite3.OperationalError):
                self.scan()
        self.scan()                             # s1's files are unchanged now, so this scan skips them
        self.assertEqual(self.background(), [("claude-sonnet-5", 5, 0, 0, 0)])

    def test_messages_after_the_snapshot_do_not_count(self):
        self.main.cost_state({"claude-sonnet-5": (10, 100, 1000, 100, 1.0)})
        self.main.at(DATE_AFTER).user("resumed")
        self.main.assistant("m3", [text_block("c")], usage(output=500))
        self.scan()
        self.assertEqual(self.background(), [("claude-sonnet-5", 0, 0, 0, 20)])

    def test_messages_before_the_process_start_do_not_count(self):
        # the snapshot covers only the process that wrote it: started after m1 (DAY_3), before the resume
        self.main.at(DATE_AFTER).user("resumed")
        self.main.assistant("m3", [text_block("c")], usage(output=30))
        self.main.cost_state({"claude-sonnet-5": (0, 0, 0, 100, 1.0)}, start=DATE_AFTER - timedelta(minutes=1))
        self.scan()
        self.assertEqual(self.background(), [("claude-sonnet-5", 0, 0, 0, 70)])

    def test_a_cost_state_in_a_subagent_file_is_ignored(self):
        self.main.cost_state({HAIKU: (100, 0, 0, 10, 0.01)})
        self.scan()
        agent = self.projects.subagent("s1", "a2")      # read after the main file's snapshot
        agent.at(DAY_3).user("x")
        agent.cost_state({HAIKU: (999, 0, 0, 999, 9.99)})
        self.scan()
        self.assertEqual(self.background(), [(HAIKU, 100, 0, 0, 10)])

    def test_a_later_cost_state_replaces_the_earlier(self):
        self.main.cost_state({HAIKU: (100, 0, 0, 10, 0.01)})
        self.scan()
        self.main.at(DATE_AFTER).user("resumed")
        self.main.cost_state({HAIKU: (300, 0, 0, 30, 0.03)})
        self.scan()
        self.assertEqual(self.background(), [(HAIKU, 300, 0, 0, 30)])

    def test_rescans_are_stable(self):
        self.main.cost_state({HAIKU: (100, 0, 0, 10, 0.01)})
        self.scan()
        self.projects.session("s2").user("unrelated")
        self.scan()
        self.assertEqual(self.background(), [(HAIKU, 100, 0, 0, 10)])

    def test_background_stays_after_the_transcripts_are_deleted(self):
        self.main.cost_state({HAIKU: (100, 0, 0, 10, 0.01)})
        self.scan()
        self.main.path.unlink()
        self.scan()
        self.assertEqual(self.background(), [(HAIKU, 100, 0, 0, 10)])

    def test_totals_include_background_without_turns(self):
        self.main.cost_state({HAIKU: (1_000_000, 0, 0, 0, 1.0)})
        self.scan()
        by_agent = {row["agent_type"]: row for row in store.totals_by(self.store, "agent_type", None, PRICES)}
        self.assertEqual((by_agent[store.BACKGROUND]["turns"], by_agent[store.BACKGROUND]["new_input"]),
                         (0, 1_000_000))
        by_model = {row["model"]: row for row in store.totals_by(self.store, "model", None, PRICES)}
        self.assertAlmostEqual(by_model[HAIKU]["cost"], 1.0)
        self.assertEqual(by_model["claude-sonnet-5"]["turns"], 2)

    def test_background_is_filed_under_the_snapshot_day(self):
        self.main.cost_state({HAIKU: (100, 0, 0, 10, 0.01)})
        self.scan()
        self.assertEqual(self.rows("SELECT day FROM background"), [(local_day(DAY_3 + timedelta(seconds=1)),)])

    def test_session_detail_lists_background_last(self):
        self.main.cost_state({HAIKU: (100, 0, 0, 10, 0.01)})
        self.scan()
        detail = store.session_detail(self.store, "s1", PRICES)
        self.assertEqual([agent["agent_type"] for agent in detail["agents"]],
                         ["main", "general-purpose", store.BACKGROUND])
        background = detail["agents"][-1]
        self.assertEqual((background["turns"], background["new_input"], background["models"]), (0, 100, [HAIKU]))
        self.assertEqual(detail["agents"][0]["new_input"], 10)
        self.assertEqual(detail["new_input"], 110)

    def test_background_web_searches_are_counted_and_priced(self):
        self.main.cost_state({HAIKU: (0, 0, 0, 0, 0.09, 9)})
        self.scan()
        self.assertEqual(self.rows("SELECT model, web_searches FROM background"), [(HAIKU, 9)])
        by_model = {row["model"]: row for row in store.totals_by(self.store, "model", None, PRICES)}
        self.assertEqual(by_model[HAIKU]["web_searches"], 9)
        self.assertAlmostEqual(by_model[HAIKU]["cost"], 0.09)
        self.assertAlmostEqual(by_model[HAIKU]["cost_parts"]["web_search"], 0.09)

    def test_web_searches_in_the_transcripts_are_subtracted(self):
        self.main.assistant("m9", [text_block("w")], dict(usage(output=0), server_tool_use={"web_search_requests": 2}))
        self.main.cost_state({"claude-sonnet-5": (10, 100, 1000, 80, 1.0, 5)})
        self.scan()
        self.assertEqual(self.rows("SELECT web_searches FROM background"), [(3,)])

    def test_an_unpriced_background_model_has_no_cost(self):
        self.main.cost_state({"claude-mystery-1": (100, 0, 0, 10, 0.01)})
        self.scan()
        by_model = {row["model"]: row for row in store.totals_by(self.store, "model", None, PRICES)}
        self.assertIsNone(by_model["claude-mystery-1"]["cost"])


class RuntimeTest(StoreCase):
    """Wall-clock, API and tool time and lines changed, from the sessions' cost-state records."""

    def setUp(self):
        super().setUp()
        self.main = self.projects.session("s1", project="/home/dev/app")
        self.main.at(DAY_1).assistant("m1", [text_block("a")], usage(output=MILLION))
        self.main.cost_state({}, totalDuration=600000, totalAPIDuration=240000, totalAPIDurationWithoutRetries=200000,
                             totalToolDuration=90000, totalLinesAdded=150, totalLinesRemoved=50)
        other = self.projects.session("s2", project="/home/dev/other")
        other.at(DAY_3).assistant("m2", [text_block("b")], usage(output=MILLION))
        other.cost_state({}, totalDuration=60000, totalAPIDuration=30000, totalAPIDurationWithoutRetries=30000,
                         totalToolDuration=5000, totalLinesAdded=10, totalLinesRemoved=0)
        self.scan()

    def test_the_snapshot_keeps_the_run_totals_and_its_day(self):
        self.assertEqual(self.rows("SELECT day, duration_ms, api_ms, api_ms_without_retries, tool_ms, lines_added, "
                                   "lines_removed FROM cost_states WHERE session_id = 's1'"),
                         [(local_day(DAY_1), 600000, 240000, 200000, 90000, 150, 50)])

    def test_totals_of_the_sessions_that_ended_in_the_range(self):
        totals = store.runtime_totals(self.store, None, PRICES)
        self.assertEqual((totals["sessions"], totals["duration_ms"], totals["api_ms"], totals["api_ms_without_retries"],
                          totals["tool_ms"], totals["lines_added"], totals["lines_removed"]),
                         (2, 660000, 270000, 230000, 95000, 160, 50))

    def test_since_until_and_project(self):
        self.assertEqual(store.runtime_totals(self.store, DAY_3.date(), PRICES)["lines_added"], 10)
        self.assertEqual(store.runtime_totals(self.store, None, PRICES, until=DAY_1.date())["lines_added"], 150)
        self.assertEqual(store.runtime_totals(self.store, None, PRICES, project="/home/dev/other")["sessions"], 1)

    def test_cost_per_100_lines_changed_counts_the_whole_sessions(self):
        totals = store.runtime_totals(self.store, None, PRICES)
        self.assertAlmostEqual(totals["cost"], 20.0)
        self.assertAlmostEqual(totals["cost_per_100_lines"], 20.0 / 210 * 100)

    def test_no_lines_changed_means_no_cost_per_line(self):
        totals = store.runtime_totals(self.store, date(2030, 1, 1), PRICES)
        self.assertEqual((totals["sessions"], totals["lines_added"], totals["duration_ms"]), (0, 0, 0))
        self.assertIsNone(totals["cost_per_100_lines"])

    def test_session_detail_has_the_run_totals(self):
        runtime = store.session_detail(self.store, "s1", PRICES)["runtime"]
        self.assertEqual(runtime, {"source": "cost_record", "duration_ms": 600000, "api_ms": 240000,
                                   "api_ms_without_retries": 200000, "tool_ms": 90000, "lines_added": 150,
                                   "lines_removed": 50})


class EstimatedRuntimeTest(StoreCase):
    """Without a cost record, the session view estimates the run totals from the stored transcript data."""

    def setUp(self):
        super().setUp()
        self.main = self.projects.session("s1")
        self.main.at(DAY_1).user("fix it")                                          # 12:00:00
        self.main.at(DAY_1 + timedelta(seconds=4)).assistant(                       # 12:00:04, 12:00:05
            "m1", [thinking_block(), tool_use_block("t1", "Edit")], usage(output=5))
        self.main.at(DAY_1 + timedelta(seconds=20)).tool_result(                    # 12:00:20
            "t1", "ok", toolUseResult=edit_result(["+a", "+b", "-c"]))
        self.main.at(DAY_1 + timedelta(seconds=30)).assistant("m2", [text_block("done")], usage(output=5))
        agent = self.projects.subagent("s1", "a1")
        agent.at(DAY_1 + timedelta(seconds=10)).user("look")                        # 12:00:10
        agent.at(DAY_1 + timedelta(seconds=13)).assistant(                          # 12:00:13
            "a1-m1", [tool_use_block("t2", "Write")], usage(output=5))
        agent.at(DAY_1 + timedelta(seconds=15)).tool_result("t2", "ok", toolUseResult=create_result("x\ny\n"))
        self.scan()

    def test_the_run_totals_are_estimated_from_the_transcripts(self):
        runtime = store.session_detail(self.store, "s1", PRICES)["runtime"]
        # session: 12:00:00 to 12:00:30; API: m1 5 s, m2 10 s (from the tool result), a1-m1 3 s;
        # tools: t1 15 s (from the record with the tool_use block), t2 2 s
        self.assertEqual(runtime, {"source": "transcripts", "duration_ms": 30000, "api_ms": 18000,
                                   "api_ms_without_retries": None, "tool_ms": 17000, "lines_added": 4,
                                   "lines_removed": 1})

    def test_reading_in_pieces_gives_the_same_estimate(self):
        whole = store.session_detail(self.store, "s1", PRICES)["runtime"]
        self.store.close()
        self.store_path.unlink()
        self.store = store.Store(self.store_path)
        self.addCleanup(self.store.close)
        lines = self.main.path.read_bytes().splitlines(keepends=True)
        self.main.path.write_bytes(b"".join(lines[:1]))           # the next read starts with m1
        self.scan()
        self.main.path.write_bytes(b"".join(lines))
        self.scan()
        self.assertEqual(store.session_detail(self.store, "s1", PRICES)["runtime"], whole)

    def test_a_cost_record_replaces_the_estimate(self):
        self.main.cost_state({}, totalDuration=99000)
        self.scan()
        runtime = store.session_detail(self.store, "s1", PRICES)["runtime"]
        self.assertEqual((runtime["source"], runtime["duration_ms"]), ("cost_record", 99000))

    def test_a_session_without_timestamps_has_no_run_totals(self):
        self.projects.session("s3").ai_title("only a title")
        self.scan()
        self.assertIsNone(store.session_detail(self.store, "s3", PRICES)["runtime"])


class AttributionTest(StoreCase):
    """Usage per skill and per MCP server, as Claude Code attributes the turns."""

    def setUp(self):
        super().setUp()
        self.main = self.projects.session("s1", project="/home/dev/app")
        self.main.at(DAY_1).assistant("m1", [text_block("a")], usage(output=MILLION), attributionSkill="dataviz")
        self.main.assistant("m2", [text_block("b")], usage(output=MILLION), attributionSkill="dataviz",
                            attributionMcpServer="codebase-memory-mcp", attributionMcpTool="search_graph")
        self.main.assistant("m3", [text_block("c")], usage(output=MILLION))
        other = self.projects.session("s2", project="/home/dev/other")
        other.at(DAY_3).assistant("m4", [text_block("d")], usage(output=MILLION),
                                  attributionMcpServer="laravel-boost", attributionMcpTool="search-docs")
        self.scan()

    def totals(self, group, **options):
        """totals_by as a dict from the group key to (turns, output, cost)."""
        return {row[group]: (row["turns"], row["output"], row["cost"])
                for row in store.totals_by(self.store, group, None, PRICES, **options)}

    def test_messages_keep_their_attribution(self):
        self.assertEqual(self.rows("SELECT message_id, skill, mcp_server FROM messages ORDER BY message_id"),
                         [("m1", "dataviz", None), ("m2", "dataviz", "codebase-memory-mcp"), ("m3", None, None),
                          ("m4", None, "laravel-boost")])

    def test_by_skill(self):
        self.assertEqual(self.totals("skill"), {None: (2, 2 * MILLION, 20.0), "dataviz": (2, 2 * MILLION, 20.0)})

    def test_by_mcp_server(self):
        self.assertEqual(self.totals("mcp_server"), {None: (2, 2 * MILLION, 20.0),
                                                     "codebase-memory-mcp": (1, MILLION, 10.0),
                                                     "laravel-boost": (1, MILLION, 10.0)})

    def test_project_filter(self):
        self.assertEqual(set(self.totals("mcp_server", project="/home/dev/other")), {"laravel-boost"})

    def test_background_is_attributed_to_nothing(self):
        self.main.cost_state({HAIKU: (MILLION, 0, 0, 0, 1.0)})
        self.scan()
        self.assertEqual(self.totals("skill")[None][1], 2 * MILLION)
        self.assertEqual(set(self.totals("skill")), {None, "dataviz"})


class ApiErrorTest(StoreCase):
    """Rate limits and other failed API calls, per day or hour and as a list of events."""

    def setUp(self):
        super().setUp()
        self.resets = DAY_1 + timedelta(hours=5)
        self.main = self.projects.session("s1", project="/home/dev/app")
        self.main.ai_title("Parser fix")
        self.main.at(DAY_1).api_error("e1", resets_at=self.resets)
        self.main.api_error("e2", resets_at=self.resets)
        self.main.at(DAY_3).api_error("e3", error="server_error", status=None, limit_type=None)
        agent = self.projects.subagent("s1", "a1", project="/home/dev/app")
        agent.at(DAY_3 + timedelta(minutes=5)).api_error("e4", limit_type="seven_day")
        other = self.projects.session("s2", project="/home/dev/other")
        other.at(DAY_3 + timedelta(minutes=10)).api_error("e5")
        self.scan()

    def counts(self, group, since=None, **options):
        """api_errors_by as (key, error, count) tuples."""
        return [(row[group], row["error"], row["count"])
                for row in store.api_errors_by(self.store, group, since, **options)]

    def test_errors_are_stored_with_their_quota(self):
        self.assertEqual(self.rows("SELECT record_id, error, status, limit_type, resets_at, day FROM api_errors "
                                   "WHERE record_id = 'e1'"),
                         [("e1", "rate_limit", 429, "five_hour", store.iso(self.resets), local_day(DAY_1))])

    def test_counts_per_day_and_error(self):
        self.assertEqual(self.counts("day"), [(local_day(DAY_1), "rate_limit", 2),
                                              (local_day(DAY_3), "rate_limit", 2),
                                              (local_day(DAY_3), "server_error", 1)])

    def test_counts_per_local_hour(self):
        self.assertEqual(self.counts("hour", since=DAY_3.date()),
                         [(local_hour(DAY_3), "rate_limit", 2), (local_hour(DAY_3), "server_error", 1)])

    def test_since_until_and_project(self):
        self.assertEqual(self.counts("day", until=DAY_1.date()), [(local_day(DAY_1), "rate_limit", 2)])
        self.assertEqual(self.counts("day", project="/home/dev/other"), [(local_day(DAY_3), "rate_limit", 1)])

    def test_unknown_group_raises(self):
        with self.assertRaises(ValueError):
            store.api_errors_by(self.store, "model", None)

    def test_events_newest_first_with_their_session(self):
        events = store.api_error_events(self.store, None)
        self.assertEqual([event["record_id"] for event in events], ["e5", "e4", "e3", "e2", "e1"])
        self.assertEqual({key: events[1][key] for key in ("session_id", "title", "agent_type", "limit_type")},
                         {"session_id": "s1", "title": "Parser fix", "agent_type": "general-purpose",
                          "limit_type": "seven_day"})
        self.assertEqual(events[-1]["resets_at"], store.iso(self.resets))

    def test_events_limit_and_filters(self):
        self.assertEqual([event["record_id"] for event in store.api_error_events(self.store, None, limit=2)],
                         ["e5", "e4"])
        self.assertEqual([event["record_id"] for event in store.api_error_events(
            self.store, None, project="/home/dev/app", until=DAY_1.date())], ["e2", "e1"])

    def test_a_forked_copy_is_not_counted_twice(self):
        fork = self.projects.session("s9", project="/home/dev/app")
        fork.at(DAY_1).api_error("e1", resets_at=self.resets)
        self.scan()
        self.assertEqual(self.rows("SELECT path FROM api_errors WHERE record_id = 'e1'"), [(str(self.main.path),)])


class EffortTest(StoreCase):
    """Usage per model and effort level."""

    def setUp(self):
        super().setUp()
        main = self.projects.session("s1")
        main.at(DAY_1).assistant("m1", [text_block("a")], usage(output=MILLION), effort="high")
        main.assistant("m2", [text_block("b")], usage(output=MILLION), effort="high")
        main.assistant("m3", [text_block("c")], usage(output=MILLION), effort="medium")
        main.assistant("m4", [text_block("d")], usage(output=MILLION), model="claude-opus-5", effort="max")
        main.cost_state({HAIKU: (MILLION, 0, 0, 0, 1.0)})
        self.scan()

    def test_by_model_and_effort(self):
        rows = store.totals_by(self.store, "model_effort", None, PRICES)
        self.assertEqual([(row["model"], row["effort"], row["turns"], row["cost"]) for row in rows],
                         [(HAIKU, None, 0, 1.0), ("claude-opus-5", "max", 1, 25.0),
                          ("claude-sonnet-5", "high", 2, 20.0), ("claude-sonnet-5", "medium", 1, 10.0)])

    def test_by_day_model_and_effort(self):
        rows = store.totals_by(self.store, "day_model_effort", None, PRICES)
        self.assertIn((local_day(DAY_1), "claude-sonnet-5", "medium", 1),
                      [(row["day"], row["model"], row["effort"], row["turns"]) for row in rows])

    def test_by_local_hour_model_and_effort(self):
        rows = store.totals_by(self.store, "hour_model_effort", None, PRICES)
        self.assertIn((local_hour(DAY_1), "claude-sonnet-5", "high", 2),
                      [(row["hour"], row["model"], row["effort"], row["turns"]) for row in rows])

    def test_by_effort(self):
        rows = {row["effort"]: row["turns"] for row in store.totals_by(self.store, "effort", None, PRICES)}
        self.assertEqual(rows, {None: 0, "high": 2, "max": 1, "medium": 1})


class SchemaTest(TempDirTestCase):
    def test_data_survives_reopening(self):
        build_session(self.projects)
        with store.Store(self.store_path) as first:
            store.scan(first, self.projects.root)
        with store.Store(self.store_path) as second:
            self.assertEqual(second.connection.execute("SELECT COUNT(*) FROM messages").fetchone()[0], 3)
            self.assertEqual(store.scan(second, self.projects.root).files_skipped, 2)

    def test_schema_version_is_recorded(self):
        with store.Store(self.store_path) as opened:
            version = opened.connection.execute("SELECT value FROM meta WHERE key = 'schema_version'").fetchone()[0]
        self.assertEqual(int(version), store.SCHEMA_VERSION)

    def test_a_version_1_store_reads_its_files_again(self):
        main = self.projects.session("s1")
        main.at(DAY_1).user("hi")
        main.assistant("m1", [text_block("a")], usage(output=5))
        main.cost_state({HAIKU: (100, 0, 0, 10, 0.01)})
        with store.Store(self.store_path) as first:
            store.scan(first, self.projects.root)
            # what a version-1 store looks like: no cost states, and every file read to its end
            first.connection.execute("DELETE FROM cost_states")
            first.connection.execute("DELETE FROM background")
            first.connection.execute("UPDATE meta SET value = '1' WHERE key = 'schema_version'")
        with store.Store(self.store_path) as second:
            result = store.scan(second, self.projects.root)
            self.assertEqual(result.files_scanned, 1)
            self.assertEqual(second.connection.execute("SELECT COUNT(*) FROM messages").fetchone()[0], 1)
            self.assertEqual(second.connection.execute("SELECT model FROM background").fetchall()[0][0], HAIKU)
            version = second.connection.execute("SELECT value FROM meta WHERE key = 'schema_version'").fetchone()[0]
            self.assertEqual(int(version), store.SCHEMA_VERSION)

    def test_a_version_2_store_gets_web_search_columns_and_reads_its_files_again(self):
        main = self.projects.session("s1")
        main.at(DAY_1).user("hi")
        main.assistant("m1", [text_block("a")], usage(output=5))
        main.cost_state({HAIKU: (100, 0, 0, 10, 0.02, 1)})
        with store.Store(self.store_path) as first:
            store.scan(first, self.projects.root)
            # what a version-2 store looks like: no web_searches columns, snapshots without them
            first.connection.execute("DROP VIEW usage_rows")
            first.connection.execute("ALTER TABLE messages DROP COLUMN web_searches")
            first.connection.execute("ALTER TABLE background DROP COLUMN web_searches")
            first.connection.execute("DELETE FROM cost_states")
            first.connection.execute("DELETE FROM background")
            first.connection.execute("UPDATE meta SET value = '2' WHERE key = 'schema_version'")
        with store.Store(self.store_path) as second:
            self.assertEqual(store.scan(second, self.projects.root).files_scanned, 1)
            self.assertEqual(second.connection.execute("SELECT web_searches FROM background").fetchall()[0][0], 1)
            self.assertEqual(second.connection.execute("SELECT web_searches FROM messages").fetchall()[0][0], 0)

    def test_a_version_4_store_gets_run_total_columns_and_reads_its_files_again(self):
        main = self.projects.session("s1")
        main.at(DAY_1).user("hi")
        main.assistant("m1", [text_block("a")], usage(output=5))
        main.cost_state({HAIKU: (100, 0, 0, 10, 0.01)}, totalDuration=60000, totalLinesAdded=7)
        with store.Store(self.store_path) as first:
            store.scan(first, self.projects.root)
            # what a version-4 store looks like: cost states without the run totals
            first.connection.execute("DROP TABLE cost_states")
            first.connection.execute("CREATE TABLE cost_states (session_id TEXT PRIMARY KEY, path TEXT NOT NULL, "
                                     "snapshot_ts TEXT, start_ts TEXT, models TEXT NOT NULL)")
            first.connection.execute("UPDATE meta SET value = '4' WHERE key = 'schema_version'")
        with store.Store(self.store_path) as second:
            self.assertEqual(store.scan(second, self.projects.root).files_scanned, 1)
            row = second.connection.execute("SELECT duration_ms, lines_added FROM cost_states").fetchone()
            self.assertEqual(tuple(row), (60000, 7))

    def test_a_version_5_store_gets_attribution_columns_and_reads_its_files_again(self):
        main = self.projects.session("s1")
        main.at(DAY_1).assistant("m1", [text_block("a")], usage(output=5), attributionSkill="dataviz")
        with store.Store(self.store_path) as first:
            store.scan(first, self.projects.root)
            # what a version-5 store looks like: messages without the attribution columns
            first.connection.execute("DROP VIEW usage_rows")
            first.connection.execute("ALTER TABLE messages DROP COLUMN mcp_server")
            first.connection.execute("ALTER TABLE messages DROP COLUMN skill")
            first.connection.execute("UPDATE meta SET value = '5' WHERE key = 'schema_version'")
        with store.Store(self.store_path) as second:
            self.assertEqual(store.scan(second, self.projects.root).files_scanned, 1)
            self.assertEqual(second.connection.execute("SELECT skill FROM messages").fetchone()[0], "dataviz")

    def test_a_version_6_store_reads_its_files_again_for_the_api_errors(self):
        main = self.projects.session("s1")
        main.at(DAY_1).api_error("e1")
        with store.Store(self.store_path) as first:
            store.scan(first, self.projects.root)
            # what a version-6 store looks like: no api_errors table, every file read to its end
            first.connection.execute("DROP TABLE api_errors")
            first.connection.execute("UPDATE meta SET value = '6' WHERE key = 'schema_version'")
        with store.Store(self.store_path) as second:
            self.assertEqual(store.scan(second, self.projects.root).files_scanned, 1)
            self.assertEqual(second.connection.execute("SELECT record_id FROM api_errors").fetchone()[0], "e1")

    def test_a_version_7_store_gets_timing_columns_and_reads_its_files_again(self):
        main = self.projects.session("s1")
        main.at(DAY_1).user("hi")
        main.assistant("m1", [text_block("a")], usage(output=5))
        with store.Store(self.store_path) as first:
            store.scan(first, self.projects.root)
            # what a version-7 store looks like: no timing columns
            first.connection.execute("DROP VIEW usage_rows")
            for table, column in (("messages", "request_ts"), ("messages", "end_ts"), ("tool_calls", "call_ts"),
                                  ("tool_calls", "result_ts"), ("tool_calls", "lines_added"),
                                  ("tool_calls", "lines_removed"), ("transcripts", "last_user_ts")):
                first.connection.execute(f"ALTER TABLE {table} DROP COLUMN {column}")
            first.connection.execute("UPDATE meta SET value = '7' WHERE key = 'schema_version'")
        with store.Store(self.store_path) as second:
            self.assertEqual(store.scan(second, self.projects.root).files_scanned, 1)
            row = second.connection.execute("SELECT request_ts, end_ts FROM messages").fetchone()
            self.assertEqual(tuple(row), (store.iso(DAY_1), store.iso(DAY_1 + timedelta(seconds=1))))

    def test_a_version_8_store_gets_the_effort_column_and_reads_its_files_again(self):
        main = self.projects.session("s1")
        main.at(DAY_1).assistant("m1", [text_block("a")], usage(output=5), effort="max")
        with store.Store(self.store_path) as first:
            store.scan(first, self.projects.root)
            # what a version-8 store looks like: messages without the effort column
            first.connection.execute("DROP VIEW usage_rows")
            first.connection.execute("ALTER TABLE messages DROP COLUMN effort")
            first.connection.execute("UPDATE meta SET value = '8' WHERE key = 'schema_version'")
        with store.Store(self.store_path) as second:
            self.assertEqual(store.scan(second, self.projects.root).files_scanned, 1)
            self.assertEqual(second.connection.execute("SELECT effort FROM messages").fetchone()[0], "max")

    def test_a_version_9_store_gets_the_meta_mtime_column_without_reading_its_files_again(self):
        main = self.projects.session("s1")
        main.at(DAY_1).assistant("m1", [text_block("a")], usage(output=5))
        with store.Store(self.store_path) as first:
            store.scan(first, self.projects.root)
            # what a version-9 store looks like: transcripts without meta_mtime_ns
            first.connection.execute("ALTER TABLE transcripts DROP COLUMN meta_mtime_ns")
            first.connection.execute("UPDATE meta SET value = '9' WHERE key = 'schema_version'")
        with store.Store(self.store_path) as second:
            self.assertEqual(store.scan(second, self.projects.root).files_scanned, 0)
            columns = {row["name"] for row in second.connection.execute("PRAGMA table_info(transcripts)")}
            self.assertIn("meta_mtime_ns", columns)

    def test_reopening_leaves_the_schema_alone(self):
        with store.Store(self.store_path) as first:
            before = first.connection.execute("PRAGMA schema_version").fetchone()[0]
        with store.Store(self.store_path) as second:
            self.assertEqual(second.connection.execute("PRAGMA schema_version").fetchone()[0], before)

    def test_an_outdated_view_is_replaced(self):
        with store.Store(self.store_path) as first:
            first.connection.execute("DROP VIEW usage_rows")
            first.connection.execute("CREATE VIEW usage_rows AS SELECT 1 AS turn")
        with store.Store(self.store_path) as second:
            columns = [row["name"] for row in second.connection.execute("PRAGMA table_info(usage_rows)")]
            self.assertIn("effort", columns)

    def test_a_newer_schema_is_refused(self):
        with store.Store(self.store_path):
            pass
        connection = sqlite3.connect(self.store_path)
        connection.execute("UPDATE meta SET value = ? WHERE key = 'schema_version'", (str(store.SCHEMA_VERSION + 1),))
        connection.commit()
        connection.close()
        with self.assertRaises(store.StoreError):
            store.Store(self.store_path)

    def test_an_error_after_sqlite_rolled_back_by_itself_is_raised_as_it_is(self):
        with store.Store(self.store_path) as opened:
            with self.assertRaises(ValueError):
                with opened.transaction():
                    opened.connection.execute("ROLLBACK")        # as SQLite does itself on e.g. a full disk
                    raise ValueError("the original error")

    def test_the_parent_folder_is_created(self):
        with store.Store(self.tmp / "data" / "nested" / "usage.sqlite"):
            pass
        self.assertTrue((self.tmp / "data" / "nested" / "usage.sqlite").exists())


class TotalsTest(StoreCase):
    def setUp(self):
        super().setUp()
        main = self.projects.session("s1", project="/home/dev/app")
        main.at(DAY_1).assistant("m1", [text_block("a")], usage(new=MILLION, output=MILLION))
        main.at(DAY_3).assistant("m2", [text_block("b")], usage(cache_5m=MILLION, cache_1h=MILLION,
                                                                 cache_read=MILLION), model="claude-opus-5")
        agent = self.projects.subagent("s1", "a1", project="/home/dev/app", meta={"agentType": "Explore"})
        agent.at(DAY_3).assistant("m3", [text_block("c")], usage(output=MILLION), model="claude-opus-5")
        other = self.projects.session("s2", project="/home/dev/other")
        other.at(DAY_3).assistant("m4", [text_block("d")], usage(output=MILLION), model="claude-mystery-9")
        self.scan()

    def totals(self, group, since=None):
        """totals_by as a dict from the group key (a tuple for day_model) to its row."""
        rows = store.totals_by(self.store, group, since, PRICES)
        if group == "day_model":
            return {(row["day"], row["model"]): row for row in rows}
        if group == "hour_model":
            return {(row["hour"], row["model"]): row for row in rows}
        return {row[group]: row for row in rows}

    def test_by_day(self):
        totals = self.totals("day")
        self.assertEqual(sorted(totals), [local_day(DAY_1), local_day(DAY_3)])
        self.assertEqual((totals[local_day(DAY_1)]["turns"], totals[local_day(DAY_3)]["turns"]), (1, 3))

    def test_by_model_with_cost(self):
        totals = self.totals("model")
        self.assertAlmostEqual(totals["claude-sonnet-5"]["cost"], 12.0)
        self.assertAlmostEqual(totals["claude-opus-5"]["cost"], 6.25 + 10.0 + 0.5 + 25.0)
        self.assertEqual((totals["claude-opus-5"]["cache_write_5m"], totals["claude-opus-5"]["cache_write_1h"],
                          totals["claude-opus-5"]["cache_write"], totals["claude-opus-5"]["cache_read"]),
                         (MILLION, MILLION, 2 * MILLION, MILLION))

    def test_cost_parts_add_up_to_the_cost(self):
        for row in store.totals_by(self.store, "day", None, PRICES):
            with self.subTest(day=row["day"]):
                self.assertAlmostEqual(sum(row["cost_parts"].values()), row["cost"])
        opus = self.totals("model")["claude-opus-5"]["cost_parts"]
        self.assertEqual(opus, {"new_input": 0.0, "cache_write": 16.25, "cache_read": 0.5, "output": 25.0,
                                "web_search": 0.0})

    def test_combined_adds_the_cost_parts(self):
        rows = store.totals_by(self.store, "model", None, PRICES)
        total = store.combined(rows)
        self.assertAlmostEqual(total["cost_parts"]["output"], 10.0 + 25.0)     # Sonnet m1, Opus agent m3
        self.assertAlmostEqual(sum(total["cost_parts"].values()), total["cost"])

    def test_unknown_model_has_no_cost(self):
        mystery = self.totals("model")["claude-mystery-9"]
        self.assertIsNone(mystery["cost"])
        self.assertEqual(mystery["unpriced_turns"], 1)

    def test_a_group_with_an_unknown_model_counts_the_known_part(self):
        day = self.totals("day")[local_day(DAY_3)]
        self.assertAlmostEqual(day["cost"], 6.25 + 10.0 + 0.5 + 25.0)
        self.assertEqual(day["unpriced_turns"], 1)

    def test_by_agent_type(self):
        totals = self.totals("agent_type")
        self.assertEqual(sorted(totals), ["Explore", "main"])
        self.assertEqual((totals["main"]["turns"], totals["Explore"]["output"]), (3, MILLION))

    def test_by_project(self):
        totals = self.totals("project")
        self.assertEqual({project: row["turns"] for project, row in totals.items()},
                         {"/home/dev/app": 3, "/home/dev/other": 1})

    def test_by_day_and_model(self):
        totals = self.totals("day_model")
        self.assertEqual(sorted(totals), sorted([(local_day(DAY_1), "claude-sonnet-5"),
                                                 (local_day(DAY_3), "claude-opus-5"),
                                                 (local_day(DAY_3), "claude-mystery-9")]))
        self.assertEqual(totals[(local_day(DAY_3), "claude-opus-5")]["turns"], 2)

    def test_by_local_hour_and_model(self):
        later = self.projects.session("s5")
        later.at(DAY_3 + timedelta(hours=2, minutes=30)).assistant("m7", [text_block("h")], usage(output=5),
                                                                   model="claude-opus-5")
        self.scan()
        totals = self.totals("hour_model", date.fromisoformat(local_day(DAY_3)))
        self.assertEqual(sorted(totals), sorted([(local_hour(DAY_3), "claude-opus-5"),
                                                 (local_hour(DAY_3), "claude-mystery-9"),
                                                 (local_hour(DAY_3 + timedelta(hours=2)), "claude-opus-5")]))
        self.assertEqual(totals[(local_hour(DAY_3), "claude-opus-5")]["turns"], 2)
        self.assertEqual(totals[(local_hour(DAY_3 + timedelta(hours=2)), "claude-opus-5")]["output"], 5)

    def test_until_filter_is_inclusive(self):
        until = date.fromisoformat(local_day(DAY_1))
        rows = store.totals_by(self.store, "day", None, PRICES, until=until)
        self.assertEqual([row["day"] for row in rows], [local_day(DAY_1)])

    def test_nearest_days_with_usage_skip_empty_days(self):
        middle = date.fromisoformat(local_day(DAY_1)) + timedelta(days=1)
        self.assertEqual(store.nearest_days(self.store, middle),
                         (date.fromisoformat(local_day(DAY_1)), date.fromisoformat(local_day(DAY_3))))

    def test_nearest_days_are_none_past_the_ends(self):
        self.assertEqual(store.nearest_days(self.store, date.fromisoformat(local_day(DAY_1))),
                         (None, date.fromisoformat(local_day(DAY_3))))
        self.assertEqual(store.nearest_days(self.store, date.fromisoformat(local_day(DAY_3))),
                         (date.fromisoformat(local_day(DAY_1)), None))

    def test_nearest_days_of_one_project(self):
        day_3 = date.fromisoformat(local_day(DAY_3)) + timedelta(days=1)
        self.assertEqual(store.nearest_days(self.store, day_3, project="/home/dev/other"),
                         (date.fromisoformat(local_day(DAY_3)), None))
        self.assertEqual(store.nearest_days(self.store, date.fromisoformat(local_day(DAY_3)),
                                            project="/home/dev/other"), (None, None))

    def test_since_filter_is_inclusive(self):
        since = date.fromisoformat(local_day(DAY_3))
        self.assertEqual(sorted(self.totals("day", since)), [local_day(DAY_3)])
        self.assertEqual(self.totals("model", since)["claude-opus-5"]["turns"], 2)

    def test_rows_are_ordered_by_key(self):
        days = [row["day"] for row in store.totals_by(self.store, "day", None, PRICES)]
        self.assertEqual(days, sorted(days))

    def test_unknown_group_raises(self):
        with self.assertRaises(ValueError):
            store.totals_by(self.store, "weekday", None, PRICES)

    def test_project_filter(self):
        rows = store.totals_by(self.store, "model", None, PRICES, project="/home/dev/other")
        self.assertEqual([(row["model"], row["turns"]) for row in rows], [("claude-mystery-9", 1)])

    def test_web_searches_of_messages_are_priced_without_the_fast_multiplier(self):
        searcher = self.projects.session("s4")
        searcher.at(DAY_1).assistant("m6", [text_block("w")],
                                     dict(usage(speed="fast"), server_tool_use={"web_search_requests": 100}),
                                     model="claude-opus-5")
        self.scan()
        row = {row["project"]: row for row in store.totals_by(self.store, "project", None, PRICES)}["/home/dev/app"]
        self.assertEqual(row["web_searches"], 100)
        self.assertAlmostEqual(row["cost"], 12.0 + 16.75 + 25.0 + 1.0)

    def test_fast_mode_is_priced(self):
        fast = self.projects.session("s3")
        fast.at(DAY_1).assistant("m5", [text_block("e")], usage(output=MILLION, speed="fast"), model="claude-opus-5")
        self.scan()
        self.assertAlmostEqual(self.totals("project")["/home/dev/app"]["cost"], 12.0 + 16.75 + 25.0 + 50.0)


class LiveSessionsTest(StoreCase):
    def setUp(self):
        super().setUp()
        self.now = time.time()
        self.main, self.agent = build_session(self.projects)
        self.old = self.projects.session("s-old")
        self.old.user("long ago")

    def age(self, transcript, seconds):
        """Set a transcript's mtime to `seconds` before now."""
        os.utime(transcript.path, (self.now - seconds, self.now - seconds))

    def live(self, minutes=5):
        """live_sessions after a scan."""
        self.scan()
        return store.live_sessions(self.store, minutes, PRICES, now=self.now)

    def test_only_recently_changed_sessions(self):
        self.age(self.main, 30)
        self.age(self.agent, 30)
        self.age(self.old, 3600)
        self.assertEqual([session["session_id"] for session in self.live()], ["s1"])

    def test_entry_fields(self):
        self.age(self.main, 30)
        self.age(self.agent, 60)
        self.age(self.old, 3600)
        session = self.live()[0]
        self.assertEqual((session["project"], session["title"], session["git_branch"]),
                         ("/home/dev/app", "Parser fix", "main"))
        self.assertEqual((session["turns"], session["output"]), (3, 100))
        self.assertEqual((session["last_context"], session["last_output"]), (5 + 200 + 1000, 20))
        self.assertEqual([(agent["agent_id"], agent["agent_type"], agent["model"]) for agent in session["subagents"]],
                         [("a1", "Explore", "claude-opus-5")])
        self.assertIsNotNone(session["cost"])

    def test_idle_subagents_are_not_listed_but_still_counted(self):
        self.age(self.main, 30)
        self.age(self.agent, 3600)
        self.age(self.old, 3600)
        session = self.live()[0]
        self.assertEqual(session["subagents"], [])
        self.assertEqual(session["turns"], 3)

    def test_a_running_subagent_keeps_its_session_live(self):
        self.age(self.main, 3600)
        self.age(self.agent, 10)
        self.age(self.old, 3600)
        sessions = self.live()
        self.assertEqual([session["session_id"] for session in sessions], ["s1"])
        self.assertEqual(len(sessions[0]["subagents"]), 1)

    def test_most_recent_first(self):
        self.age(self.main, 120)
        self.age(self.agent, 120)
        self.age(self.old, 10)
        self.assertEqual([session["session_id"] for session in self.live()], ["s-old", "s1"])

    def test_project_filter(self):
        for transcript in (self.main, self.agent, self.old):
            self.age(transcript, 30)
        self.scan()
        self.assertEqual(store.live_sessions(self.store, 5, PRICES, now=self.now, project="/home/dev/other"), [])
        live = store.live_sessions(self.store, 5, PRICES, now=self.now, project="/home/dev/app")
        self.assertEqual(len(live), 2)

    def test_window_in_minutes(self):
        for transcript in (self.main, self.agent, self.old):
            self.age(transcript, 600)
        self.assertEqual(self.live(minutes=5), [])
        self.assertEqual(len(self.live(minutes=15)), 2)


class SessionDetailTest(StoreCase):
    def setUp(self):
        super().setUp()
        self.main, self.agent = build_session(self.projects)
        self.scan()

    def test_unknown_session_is_none(self):
        self.assertIsNone(store.session_detail(self.store, "nope", PRICES))

    def test_session_fields_and_prompt(self):
        detail = store.session_detail(self.store, "s1", PRICES)
        self.assertEqual((detail["session_id"], detail["project"], detail["title"], detail["prompt"]),
                         ("s1", "/home/dev/app", "Parser fix", "Fix the parser"))
        self.assertEqual((detail["turns"], detail["output"]), (3, 100))

    def test_main_thread_first_then_subagents(self):
        agents = store.session_detail(self.store, "s1", PRICES)["agents"]
        self.assertEqual([(agent["agent_id"], agent["agent_type"]) for agent in agents],
                         [(None, "main"), ("a1", "Explore")])

    def test_per_agent_numbers(self):
        main = store.session_detail(self.store, "s1", PRICES)["agents"][0]
        self.assertEqual((main["turns"], main["context_first"], main["context_last"]), (2, 1010, 1205))
        self.assertEqual(main["input_total"], 1010 + 1205)
        self.assertEqual((main["new_input"], main["cache_write_5m"], main["cache_read"], main["output"]),
                         (15, 1200, 1000, 70))
        self.assertEqual(main["models"], ["claude-sonnet-5"])
        expected = (15 * 2.0 + 1200 * 2.5 + 1000 * 0.2 + 70 * 10.0) / MILLION
        self.assertAlmostEqual(main["cost"], expected)

    def test_tools_per_agent(self):
        agents = store.session_detail(self.store, "s1", PRICES)["agents"]
        self.assertEqual(agents[0]["tools"], [{"tool": "Read", "calls": 1, "result_chars": 300}])
        self.assertEqual(agents[1]["tools"], [{"tool": "srv.find", "calls": 1, "result_chars": 4}])

    def test_history_without_the_file_has_no_prompt(self):
        self.main.path.unlink()
        detail = store.session_detail(self.store, "s1", PRICES)
        self.assertIsNone(detail["prompt"])
        self.assertEqual(detail["turns"], 3)

    def test_context_per_turn_in_time_order(self):
        main = store.session_detail(self.store, "s1", PRICES)["agents"][0]
        self.assertEqual([turn["context"] for turn in main["context_per_turn"]], [1010, 1205])
        timestamps = [turn["ts"] for turn in main["context_per_turn"]]
        self.assertEqual(timestamps, sorted(timestamps))

    def test_background_has_no_context_per_turn(self):
        self.main.cost_state({"claude-sonnet-5": (100, 5000, 5000, 500, 0.1)})
        self.scan()
        agents = store.session_detail(self.store, "s1", PRICES)["agents"]
        self.assertEqual((agents[-1]["agent_type"], agents[-1]["context_per_turn"]), (store.BACKGROUND, []))


class SessionAttributionAndErrorsTest(StoreCase):
    """A session's usage per skill and MCP server and its failed API calls, without other sessions' rows."""

    def setUp(self):
        super().setUp()
        main = self.projects.session("s1")
        main.at(DAY_1).assistant("m1", [text_block("a")], usage(output=MILLION), attributionSkill="dataviz")
        main.assistant("m2", [text_block("b")], usage(output=MILLION), attributionMcpServer="codebase-memory-mcp")
        main.assistant("m3", [text_block("c")], usage(output=MILLION))
        main.api_error("e1")
        agent = self.projects.subagent("s1", "a1")
        agent.at(DAY_1 + timedelta(minutes=1)).assistant("m4", [text_block("d")], usage(output=MILLION),
                                                         attributionSkill="dataviz")
        agent.api_error("e2", error="server_error", status=None, limit_type=None)
        other = self.projects.session("s2")
        other.at(DAY_1).assistant("m5", [text_block("e")], usage(output=MILLION), attributionSkill="init",
                                  attributionMcpServer="laravel-boost")
        other.api_error("e3")
        self.scan()
        self.detail = store.session_detail(self.store, "s1", PRICES)

    def test_usage_per_skill_of_the_session_and_its_subagents(self):
        self.assertEqual([(row["skill"], row["turns"], row["cost"]) for row in self.detail["skills"]],
                         [("dataviz", 2, 20.0)])

    def test_usage_per_mcp_server_of_the_session(self):
        self.assertEqual([(row["mcp_server"], row["turns"]) for row in self.detail["mcp_servers"]],
                         [("codebase-memory-mcp", 1)])

    def test_api_errors_of_the_session_newest_first(self):
        self.assertEqual([(event["record_id"], event["agent_type"]) for event in self.detail["api_errors"]],
                         [("e2", "general-purpose"), ("e1", "main")])

    def test_a_session_without_any_has_empty_lists(self):
        self.projects.session("s3").at(DAY_1).assistant("m6", [text_block("f")], usage(output=1))
        self.scan()
        detail = store.session_detail(self.store, "s3", PRICES)
        self.assertEqual((detail["skills"], detail["mcp_servers"], detail["api_errors"]), ([], [], []))


class SessionEffortTest(StoreCase):
    """A session's usage per model and effort level, per agent and per turn."""

    def setUp(self):
        super().setUp()
        self.main = self.projects.session("s1")
        self.main.at(DAY_1).assistant("m1", [text_block("a")], usage(output=MILLION), effort="high")
        self.main.assistant("m2", [text_block("b")], usage(output=MILLION), effort="max")
        agent = self.projects.subagent("s1", "a1")
        agent.at(DAY_1).assistant("m3", [text_block("c")], usage(output=MILLION), model="claude-opus-5",
                                  effort="medium")
        self.main.cost_state({HAIKU: (MILLION, 0, 0, 0, 1.0)})
        self.projects.session("s2").at(DAY_1).assistant("m4", [text_block("d")], usage(output=MILLION), effort="low")
        self.scan()
        self.detail = store.session_detail(self.store, "s1", PRICES)

    def test_usage_per_model_of_the_session(self):
        self.assertEqual([(row["model"], row["turns"], row["cost"]) for row in self.detail["models"]],
                         [(HAIKU, 0, 1.0), ("claude-opus-5", 1, 25.0), ("claude-sonnet-5", 2, 20.0)])

    def test_usage_per_model_and_effort_of_the_session(self):
        self.assertEqual([(row["model"], row["effort"], row["turns"]) for row in self.detail["model_effort"]],
                         [(HAIKU, None, 0), ("claude-opus-5", "medium", 1), ("claude-sonnet-5", "high", 1),
                          ("claude-sonnet-5", "max", 1)])

    def test_each_agent_lists_its_models_and_effort_levels(self):
        main, agent = self.detail["agents"][:2]
        self.assertEqual(main["model_efforts"], [{"model": "claude-sonnet-5", "effort": "high"},
                                                 {"model": "claude-sonnet-5", "effort": "max"}])
        self.assertEqual(agent["model_efforts"], [{"model": "claude-opus-5", "effort": "medium"}])
        self.assertEqual(self.detail["agents"][-1]["model_efforts"], [])

    def test_effort_levels_are_ordered_low_to_max(self):
        self.main.assistant("m5", [text_block("e")], usage(output=1), effort="low")
        self.scan()
        main = store.session_detail(self.store, "s1", PRICES)["agents"][0]
        self.assertEqual([entry["effort"] for entry in main["model_efforts"]], ["low", "high", "max"])

    def test_each_turn_carries_its_effort_level(self):
        turns = self.detail["agents"][0]["context_per_turn"]
        self.assertEqual([turn["effort"] for turn in turns], ["high", "max"])


class ContextStatsTest(StoreCase):
    """The median and 90th percentile of the context per main-thread turn, to choose a compact hint by."""

    def setUp(self):
        super().setUp()
        main = self.projects.session("s1", project="/home/dev/app")
        for index, context in enumerate((100, 200, 300, 400, 1000)):
            main.at(DAY_1).assistant(f"m{index}", [text_block("a")], usage(cache_read=context, output=1))
        agent = self.projects.subagent("s1", "a1", project="/home/dev/app")
        agent.at(DAY_1).assistant("a1-m1", [text_block("b")], usage(cache_read=99999, output=1))
        other = self.projects.session("s2", project="/home/dev/other")
        other.at(DAY_3).assistant("o1", [text_block("c")], usage(new=50, cache_5m=50, output=1))
        self.scan()

    def test_median_and_p90_of_main_thread_turns(self):
        self.assertEqual(store.context_stats(self.store, DAY_1.date(), until=DAY_1.date()),
                         {"turns": 5, "median": 300, "p90": 760})

    def test_subagents_do_not_count(self):
        self.assertEqual(store.context_stats(self.store, None, session_id="s1")["turns"], 5)

    def test_project_and_session_filters(self):
        self.assertEqual(store.context_stats(self.store, None, project="/home/dev/other"),
                         {"turns": 1, "median": 100, "p90": 100})
        self.assertEqual(store.context_stats(self.store, None, session_id="s2")["median"], 100)

    def test_no_turns_means_no_values(self):
        self.assertEqual(store.context_stats(self.store, date(2030, 1, 1)), {"turns": 0, "median": None, "p90": None})


class TranscriptPathTest(StoreCase):
    def setUp(self):
        super().setUp()
        self.main, self.agent = build_session(self.projects)
        self.scan()

    def test_the_main_thread_and_a_subagent(self):
        self.assertEqual(store.transcript_path(self.store, "s1", None), self.main.path)
        self.assertEqual(store.transcript_path(self.store, "s1", "a1"), self.agent.path)

    def test_unknown_session_or_agent_is_none(self):
        self.assertIsNone(store.transcript_path(self.store, "nope", None))
        self.assertIsNone(store.transcript_path(self.store, "s1", "nope"))


class RecentSessionsTest(StoreCase):
    def setUp(self):
        super().setUp()
        first = self.projects.session("s1")
        first.at(DAY_1).assistant("m1", [text_block("a")], usage(output=10))
        second = self.projects.session("s2", project="/home/dev/other")
        second.at(DAY_3).assistant("m2", [text_block("b")], usage(output=20))
        self.projects.subagent("s2", "a1", project="/home/dev/other").at(DAY_3).assistant(
            "m3", [text_block("c")], usage(output=5))
        self.scan()

    def test_newest_first_with_totals(self):
        sessions = store.recent_sessions(self.store, None, PRICES)
        self.assertEqual([(session["session_id"], session["subagents"], session["output"]) for session in sessions],
                         [("s2", 1, 25), ("s1", 0, 10)])

    def test_project_filter(self):
        sessions = store.recent_sessions(self.store, None, PRICES, project="/home/dev/app")
        self.assertEqual([session["session_id"] for session in sessions], ["s1"])

    def test_until(self):
        until = date.fromisoformat(local_day(DAY_1))
        sessions = store.recent_sessions(self.store, None, PRICES, until=until)
        self.assertEqual([session["session_id"] for session in sessions], ["s1"])

    def test_limit_and_since(self):
        self.assertEqual(len(store.recent_sessions(self.store, None, PRICES, limit=1)), 1)
        since = date.fromisoformat(local_day(DAY_3))
        self.assertEqual([session["session_id"] for session in store.recent_sessions(self.store, since, PRICES)],
                         ["s2"])

    def test_no_limit_lists_every_session(self):
        self.assertEqual(len(store.recent_sessions(self.store, None, PRICES, limit=None)), 2)


class SessionContextTest(StoreCase):
    def setUp(self):
        super().setUp()
        main = self.projects.session("s1")
        main.assistant("m1", [text_block("a")], usage(new=10, cache_5m=90, cache_read=900))
        main.assistant("m2", [text_block("b")], usage(new=10, cache_5m=90, cache_read=2900))
        self.projects.subagent("s1", "a1").assistant("m3", [text_block("c")], usage(cache_read=50_000))
        self.projects.subagent("s2", "a2").assistant("m4", [text_block("d")], usage(cache_read=50_000))
        self.scan()

    def sessions(self):
        """recent_sessions by session id."""
        return {session["session_id"]: session for session in store.recent_sessions(self.store, None, PRICES)}

    def test_average_and_peak_context_of_the_main_thread(self):
        session = self.sessions()["s1"]
        self.assertEqual((session["context_avg"], session["context_peak"]), (2000, 3000))

    def test_no_main_thread_turns_means_no_context(self):
        session = self.sessions()["s2"]
        self.assertEqual((session["context_avg"], session["context_peak"]), (None, None))


class CostliestTest(StoreCase):
    def setUp(self):
        super().setUp()
        dear = self.projects.session("dear")
        dear.at(DAY_1).assistant("m1", [text_block("a")], usage(cache_read=3 * MILLION, output=100))
        self.projects.subagent("dear", "a1").at(DAY_1).assistant("m2", [text_block("b")],
                                                                 usage(cache_read=5 * MILLION))
        cheap = self.projects.session("cheap")
        cheap.at(DAY_3).assistant("m3", [text_block("c")], usage(new=10, output=10))
        elsewhere = self.projects.session("elsewhere", project="/home/dev/other")
        elsewhere.at(DAY_3).assistant("m4", [text_block("d")], usage(output=1000))
        unpriced = self.projects.session("unpriced")
        unpriced.at(DAY_3).assistant("m5", [text_block("e")], usage(output=MILLION), model="claude-unknown-9")
        self.scan()

    def costliest(self, limit=10, since=None, project=None):
        """The session ids of costliest() over every session from since on."""
        sessions = store.recent_sessions(self.store, since, PRICES, limit=None, project=project)
        return [session["session_id"] for session in store.costliest(sessions, limit)]

    def test_costliest_first_and_unpriced_last(self):
        self.assertEqual(self.costliest(), ["dear", "elsewhere", "cheap", "unpriced"])

    def test_limit(self):
        self.assertEqual(self.costliest(limit=2), ["dear", "elsewhere"])

    def test_since_and_project(self):
        self.assertEqual(self.costliest(since=date.fromisoformat(local_day(DAY_3))),
                         ["elsewhere", "cheap", "unpriced"])
        self.assertEqual(self.costliest(project="/home/dev/app"), ["dear", "cheap", "unpriced"])

    def test_the_cost_counts_the_subagents(self):
        sessions = store.recent_sessions(self.store, None, PRICES, limit=None)
        dear = store.costliest(sessions, 1)[0]
        self.assertAlmostEqual(dear["cost"], (8 * MILLION * 0.2 + 100 * 10.0) / MILLION)
        self.assertAlmostEqual(dear["cost_parts"]["cache_read"], 8 * MILLION * 0.2 / MILLION)


if __name__ == "__main__":
    unittest.main()
