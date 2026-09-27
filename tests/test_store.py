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
        with mock.patch.object(store, "insert_tool_calls", side_effect=RuntimeError("disk full")):
            with self.assertRaises(RuntimeError):
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

    def test_time_range_widens_across_reads(self):
        main = self.projects.session("s1")
        main.at(DAY_1).user("hi")
        self.scan()
        main.at(DAY_3).user("later")
        self.scan()
        first, last = self.rows("SELECT first_ts, last_ts FROM transcripts")[0]
        self.assertEqual((datetime.fromisoformat(first), datetime.fromisoformat(last)), (DAY_1, DAY_3))

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

    def test_messages_after_the_snapshot_do_not_count(self):
        self.main.cost_state({"claude-sonnet-5": (10, 100, 1000, 100, 1.0)})
        self.main.at(DATE_AFTER).user("resumed")
        self.main.assistant("m3", [text_block("c")], usage(output=500))
        self.scan()
        self.assertEqual(self.background(), [("claude-sonnet-5", 0, 0, 0, 20)])

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

    def test_an_unpriced_background_model_has_no_cost(self):
        self.main.cost_state({"claude-mystery-1": (100, 0, 0, 10, 0.01)})
        self.scan()
        by_model = {row["model"]: row for row in store.totals_by(self.store, "model", None, PRICES)}
        self.assertIsNone(by_model["claude-mystery-1"]["cost"])


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

    def test_a_newer_schema_is_refused(self):
        with store.Store(self.store_path):
            pass
        connection = sqlite3.connect(self.store_path)
        connection.execute("UPDATE meta SET value = ? WHERE key = 'schema_version'", (str(store.SCHEMA_VERSION + 1),))
        connection.commit()
        connection.close()
        with self.assertRaises(store.StoreError):
            store.Store(self.store_path)

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

    def test_limit_and_since(self):
        self.assertEqual(len(store.recent_sessions(self.store, None, PRICES, limit=1)), 1)
        since = date.fromisoformat(local_day(DAY_3))
        self.assertEqual([session["session_id"] for session in store.recent_sessions(self.store, since, PRICES)],
                         ["s2"])


if __name__ == "__main__":
    unittest.main()
