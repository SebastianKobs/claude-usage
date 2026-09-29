"""scan.py: incremental scans into SQLite, background usage, what a scan stores."""
import json
import os
import sqlite3
import unittest
from datetime import date
from datetime import datetime
from datetime import timedelta
from unittest import mock

from claude_usage import queries
from claude_usage import scan
from claude_usage import store
from helpers import DATE_AFTER
from helpers import DAY_1
from helpers import DAY_3
from helpers import HAIKU
from helpers import MILLION
from helpers import PRICES
from helpers import StoreCase
from helpers import build_session
from helpers import local_day
from helpers import local_hour
from helpers import text_block
from helpers import thinking_block
from helpers import tool_use_block
from helpers import usage


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
        scan.scan(whole, self.projects.root)
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
        with mock.patch.object(scan, "insert_tool_calls", side_effect=sqlite3.OperationalError("disk full")):
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
        self.assertEqual(queries.totals_by(self.store, "model", None, PRICES)[0]["output"], 30)

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

    def test_a_subagent_keeps_the_tool_call_that_spawned_it(self):
        _, agent = build_session(self.projects)
        self.scan()
        agent.path.with_name("agent-a1.meta.json").unlink()
        agent.user("more")
        self.scan()
        self.assertEqual(self.rows("SELECT agent_id, tool_use_id FROM transcripts ORDER BY agent_id NULLS FIRST"),
                         [(None, None), ("a1", "toolu_a1")])

    def test_a_meta_file_that_appears_later_sets_the_spawning_call(self):
        agent = self.projects.subagent("s1", "a1", meta=False)
        agent.assistant("m1", [text_block("a")], usage(output=5))
        self.scan()
        meta_path = agent.path.with_name("agent-a1.meta.json")
        meta_path.write_text('{"agentType": "Explore", "toolUseId": "toolu_x"}', encoding="utf-8")
        later = agent.path.stat().st_mtime_ns + 1_000_000_000
        os.utime(meta_path, ns=(later, later))
        self.scan()
        self.assertEqual(self.rows("SELECT tool_use_id FROM transcripts"), [("toolu_x",)])

    def test_compactions_are_stored_once_by_the_file_that_had_them_first(self):
        original = self.projects.session("s1")
        original.at(DAY_1).compaction("c1", trigger="auto", pre_tokens=167_000, post_tokens=9_000,
                                      duration_ms=41_000)
        self.scan()
        copy = self.projects.session("s2")
        copy.compaction("c1", trigger="manual", pre_tokens=1, post_tokens=1, duration_ms=1)
        self.scan()
        self.scan()
        self.assertEqual(self.rows("SELECT record_id, path, ts, day, trigger, pre_tokens, post_tokens, duration_ms "
                                   "FROM compactions"),
                         [("c1", str(original.path), scan.iso(DAY_1), local_day(DAY_1), "auto", 167_000, 9_000,
                           41_000)])

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
        parse = scan.transcripts.parse

        def fail_for_s1(path, *arguments):
            """Parse every file except s1's main transcript, which raises like a parser bug would."""
            if path.name == "s1.jsonl":
                raise ValueError("year 58692 is out of range")
            return parse(path, *arguments)

        with mock.patch.object(scan.transcripts, "parse", side_effect=fail_for_s1):
            result = self.scan()
        self.assertEqual(len(result.errors), 1)
        self.assertIn("year 58692", result.errors[0])
        self.assertEqual(self.rows("SELECT session_id FROM transcripts WHERE agent_id IS NULL"), [("s2",)])
        self.scan()
        self.assertEqual(self.count("transcripts"), 4)

    def test_a_file_that_vanishes_during_the_scan_is_reported_and_skipped(self):
        build_session(self.projects)
        with mock.patch.object(scan.transcripts, "parse", side_effect=FileNotFoundError("gone")):
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
        """The background per model over all snapshots, as (model, new_input, cache_write, cache_read, output)."""
        return self.rows("SELECT model, SUM(new_input), SUM(cache_write), SUM(cache_read), SUM(output) "
                         "FROM background_parts GROUP BY model ORDER BY model")

    def parts(self):
        """The background rows as (day, model, output), in time order."""
        return self.rows("SELECT day, model, output FROM background_parts ORDER BY ts, model")

    def test_no_cost_state_no_background(self):
        self.scan()
        self.assertEqual(self.background(), [])

    def test_the_snapshot_minus_main_thread_and_subagents(self):
        self.main.cost_state({"claude-sonnet-5": (15, 100, 1500, 100, 1.0), HAIKU: (2000, 0, 0, 100, 0.01)})
        self.scan()
        self.assertEqual(self.background(), [(HAIKU, 2000, 0, 0, 100), ("claude-sonnet-5", 5, 0, 500, 20)])

    def test_the_snapshot_keeps_its_models_by_field_name(self):
        self.main.cost_state({HAIKU: (2000, 0, 0, 100, 0.01)})
        self.scan()
        models = json.loads(self.rows("SELECT models FROM cost_states")[0][0])
        self.assertEqual(models, [{"model": HAIKU, "new_input": 2000, "cache_write": 0, "cache_read": 0,
                                   "output": 100, "cost_usd": 0.01, "web_searches": 0}])

    def test_a_snapshot_stored_as_positional_lists_still_counts(self):
        self.main.cost_state({HAIKU: (2000, 0, 0, 100, 0.01)})
        self.scan()
        # as versions before named fields wrote it; the oldest lists lack web_searches
        old_row = json.dumps([[HAIKU, 1500, 0, 0, 90, 0.01]])
        self.store.connection.execute("UPDATE cost_states SET models = ?", (old_row,))
        self.store.connection.execute("UPDATE cost_snapshots SET models = ?", (old_row,))
        scan.update_background(self.store, {"s1"})
        self.assertEqual(self.background(), [(HAIKU, 1500, 0, 0, 90)])

    def test_workflow_agents_count_as_transcripts_not_background(self):
        workflow = self.projects.workflow_agent("s1", "wf_1", "b1")
        workflow.at(DAY_3).assistant("m3", [text_block("c")], usage(new=5, cache_read=500, output=20))
        self.main.cost_state({"claude-sonnet-5": (15, 100, 1500, 100, 1.0)})
        self.scan()
        self.assertEqual(self.background(), [])

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
        scan_file = scan.scan_file

        def lock_at_s2(usage_store, path, known):
            """Scan every file until s2's, where the store is locked, as when another scan holds it too long."""
            if path.name == "s2.jsonl":
                raise sqlite3.OperationalError("database is locked")
            return scan_file(usage_store, path, known)

        with mock.patch.object(scan, "scan_file", side_effect=lock_at_s2):
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

    def test_a_later_snapshot_of_the_same_process_adds_its_growth_under_its_own_day(self):
        self.main.cost_state({HAIKU: (100, 0, 0, 10, 0.01)})
        self.scan()
        self.main.at(DATE_AFTER).user("next morning")
        self.main.cost_state({HAIKU: (300, 0, 0, 30, 0.03)})
        self.scan()
        self.assertEqual(self.background(), [(HAIKU, 300, 0, 0, 30)])
        self.assertEqual(self.parts(), [(local_day(DAY_3), HAIKU, 10), (local_day(DATE_AFTER), HAIKU, 20)])

    def test_snapshots_read_together_are_split_too(self):
        self.main.cost_state({HAIKU: (100, 0, 0, 10, 0.01)})
        self.main.at(DATE_AFTER).user("next morning")
        self.main.cost_state({HAIKU: (300, 0, 0, 30, 0.03)})
        self.scan()
        self.assertEqual(self.parts(), [(local_day(DAY_3), HAIKU, 10), (local_day(DATE_AFTER), HAIKU, 20)])

    def test_a_transcript_call_after_a_snapshot_is_not_background_of_the_next(self):
        # the first snapshot counts m1 (50 output) and 20 more; the second adds m3's 500 and 30 more
        self.main.cost_state({"claude-sonnet-5": (10, 100, 1000, 100, 1.0)})
        self.main.at(DATE_AFTER).user("next morning")
        self.main.assistant("m3", [text_block("c")], usage(output=500))
        self.main.cost_state({"claude-sonnet-5": (10, 100, 1000, 630, 1.0)})
        self.scan()
        self.assertEqual(self.parts(), [(local_day(DAY_3), "claude-sonnet-5", 20),
                                        (local_day(DATE_AFTER), "claude-sonnet-5", 30)])

    def test_a_gap_that_shrinks_gives_back_nothing(self):
        # the second snapshot counts less beyond the transcripts than the first: its growth is none, not negative
        self.main.cost_state({"claude-sonnet-5": (10, 100, 1000, 100, 1.0)})
        self.main.at(DATE_AFTER).user("next morning")
        self.main.assistant("m3", [text_block("c")], usage(output=500))
        self.main.cost_state({"claude-sonnet-5": (10, 100, 1000, 590, 1.0)})
        self.scan()
        self.assertEqual(self.parts(), [(local_day(DAY_3), "claude-sonnet-5", 20)])

    def test_each_process_counts_its_own_snapshots(self):
        self.main.cost_state({HAIKU: (100, 0, 0, 10, 0.01)})
        self.main.at(DATE_AFTER).user("resumed")
        self.main.cost_state({HAIKU: (40, 0, 0, 4, 0.01)}, start=DATE_AFTER - timedelta(minutes=1))
        self.scan()
        self.assertEqual(self.parts(), [(local_day(DAY_3), HAIKU, 10), (local_day(DATE_AFTER), HAIKU, 4)])

    def test_a_repeated_snapshot_counts_once(self):
        self.main.cost_state({HAIKU: (100, 0, 0, 10, 0.01)})
        self.main.cost_state({HAIKU: (100, 0, 0, 10, 0.01)})
        self.scan()
        self.assertEqual(self.parts(), [(local_day(DAY_3), HAIKU, 10)])

    def test_the_run_totals_keep_only_the_latest_snapshot(self):
        self.main.cost_state({HAIKU: (100, 0, 0, 10, 0.01)})
        self.main.at(DATE_AFTER).user("next morning")
        self.main.cost_state({HAIKU: (300, 0, 0, 30, 0.03)})
        self.scan()
        self.assertEqual((self.count("cost_states"), self.count("cost_snapshots")), (1, 2))

    def test_without_stored_snapshots_the_cost_state_counts(self):
        # a store from before cost_snapshots whose transcript Claude Code has deleted keeps only the cost-state
        self.main.cost_state({HAIKU: (100, 0, 0, 10, 0.01)})
        self.scan()
        self.store.connection.execute("DELETE FROM cost_snapshots")
        scan.update_background(self.store, {"s1"})
        self.assertEqual(self.parts(), [(local_day(DAY_3), HAIKU, 10)])

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
        by_agent = {row["agent_type"]: row for row in queries.totals_by(self.store, "agent_type", None, PRICES)}
        self.assertEqual((by_agent[store.BACKGROUND]["turns"], by_agent[store.BACKGROUND]["new_input"]),
                         (0, 1_000_000))
        by_model = {row["model"]: row for row in queries.totals_by(self.store, "model", None, PRICES)}
        self.assertAlmostEqual(by_model[HAIKU]["cost"], 1.0)
        self.assertEqual(by_model["claude-sonnet-5"]["turns"], 2)

    def test_background_has_its_own_effort_level(self):
        self.main.cost_state({HAIKU: (100, 0, 0, 10, 0.01)})
        self.scan()
        rows = queries.totals_by(self.store, "model_effort", None, PRICES)
        self.assertEqual([(row["model"], row["effort"]) for row in rows if row["model"] == HAIKU],
                         [(HAIKU, store.BACKGROUND_EFFORT)])

    def test_background_is_filed_under_the_snapshot_day(self):
        self.main.cost_state({HAIKU: (100, 0, 0, 10, 0.01)})
        self.scan()
        self.assertEqual(self.rows("SELECT day FROM background_parts"), [(local_day(DAY_3 + timedelta(seconds=1)),)])

    def test_session_detail_lists_background_last(self):
        self.main.cost_state({HAIKU: (100, 0, 0, 10, 0.01)})
        self.scan()
        detail = queries.session_detail(self.store, "s1", PRICES)
        self.assertEqual([agent["agent_type"] for agent in detail["agents"]],
                         ["main", "general-purpose", store.BACKGROUND])
        background = detail["agents"][-1]
        self.assertEqual((background["turns"], background["new_input"], background["models"]), (0, 100, [HAIKU]))
        self.assertEqual(detail["agents"][0]["new_input"], 10)
        self.assertEqual(detail["new_input"], 110)

    def test_session_detail_background_spans_its_snapshots(self):
        self.main.cost_state({HAIKU: (100, 0, 0, 10, 0.01)})
        self.main.at(DATE_AFTER).user("next morning")
        self.main.cost_state({HAIKU: (300, 0, 0, 30, 0.03)})
        self.scan()
        background = queries.session_detail(self.store, "s1", PRICES)["agents"][-1]
        self.assertEqual((background["first_ts"][:10], background["last_ts"][:10], background["output"]),
                         ("2026-09-03", "2026-09-04", 30))

    def test_background_web_searches_are_counted_and_priced(self):
        self.main.cost_state({HAIKU: (0, 0, 0, 0, 0.09, 9)})
        self.scan()
        self.assertEqual(self.rows("SELECT model, web_searches FROM background_parts"), [(HAIKU, 9)])
        by_model = {row["model"]: row for row in queries.totals_by(self.store, "model", None, PRICES)}
        self.assertEqual(by_model[HAIKU]["web_searches"], 9)
        self.assertAlmostEqual(by_model[HAIKU]["cost"], 0.09)
        self.assertAlmostEqual(by_model[HAIKU]["cost_parts"]["web_search"], 0.09)

    def test_web_searches_in_the_transcripts_are_subtracted(self):
        self.main.assistant("m9", [text_block("w")], dict(usage(output=0), server_tool_use={"web_search_requests": 2}))
        self.main.cost_state({"claude-sonnet-5": (10, 100, 1000, 80, 1.0, 5)})
        self.scan()
        self.assertEqual(self.rows("SELECT web_searches FROM background_parts"), [(3,)])

    def test_an_unpriced_background_model_has_no_cost(self):
        self.main.cost_state({"claude-mystery-1": (100, 0, 0, 10, 0.01)})
        self.scan()
        by_model = {row["model"]: row for row in queries.totals_by(self.store, "model", None, PRICES)}
        self.assertIsNone(by_model["claude-mystery-1"]["cost"])


class RetentionTest(StoreCase):
    """With a retention, a scan deletes the sessions whose last activity lies before its first day."""

    def setUp(self):
        super().setUp()
        old = self.projects.session("old")
        old.at(DAY_1).user("hi")
        old.assistant("o1", [tool_use_block("ot1", "Read")], usage(output=10))
        old.tool_result("ot1", "abc")
        old.api_error("oe1")
        old.compaction("oc1")
        old.ultracode("ou1")
        old.cost_state({HAIKU: (100, 0, 0, 10, 0.01)}, totalDuration=1000)
        self.projects.subagent("old", "a1").at(DAY_1).assistant("o2", [text_block("b")], usage(output=5))
        self.projects.session("new").at(DAY_3).assistant("n1", [text_block("c")], usage(output=20))
        # the main thread is old, a subagent is recent: the session is recent
        self.projects.session("mixed").at(DAY_1).assistant("x1", [text_block("d")], usage(output=30))
        self.projects.subagent("mixed", "a2").at(DAY_3).assistant("x2", [text_block("e")], usage(output=40))
        self.first_kept = date.fromisoformat(local_day(DAY_3))
        self.today = self.first_kept + timedelta(days=6)        # 7 days: DAY_3 is the first one kept

    def scan_keeping(self, days):
        """A scan with a retention of `days` days up to self.today."""
        return scan.scan(self.store, self.projects.root, retention_days=days, today=self.today)

    def sessions(self, table):
        """The sessions with rows in a table."""
        return sorted({row[0] for row in self.rows(
            f"SELECT t.session_id FROM {table} x JOIN transcripts t ON t.path = x.path")})

    def test_an_old_session_goes_from_every_table(self):
        result = self.scan_keeping(7)
        self.assertEqual(result.sessions_pruned, 1)
        for table in ("messages", "tool_calls", "api_errors", "compactions", "ultracode_states", "background_parts",
                      "cost_states", "cost_snapshots"):
            with self.subTest(table=table):
                self.assertNotIn("old", self.sessions(table))
        self.assertEqual(self.sessions("messages"), ["mixed", "new"])

    def test_a_session_counts_by_its_latest_file(self):
        self.scan_keeping(7)
        self.assertEqual(self.rows("SELECT COUNT(*) FROM messages m JOIN transcripts t ON t.path = m.path "
                                   "WHERE t.session_id = 'mixed'"), [(2,)])

    def test_zero_keeps_everything(self):
        result = self.scan_keeping(0)
        self.assertEqual((result.sessions_pruned, self.sessions("messages")), (0, ["mixed", "new", "old"]))

    def test_the_rows_of_files_still_there_stay_so_they_are_not_read_again(self):
        self.scan_keeping(7)
        self.assertEqual(self.count("transcripts"), 5)
        again = self.scan_keeping(7)
        self.assertEqual((again.files_scanned, again.sessions_pruned, self.sessions("messages")),
                         (0, 0, ["mixed", "new"]))

    def test_the_rows_of_files_claude_code_deleted_go_too(self):
        for path in self.projects.project_dir().rglob("*.jsonl"):
            if "old" in path.parts or path.name == "old.jsonl":
                path.unlink()
        self.scan_keeping(7)
        self.assertEqual(self.rows("SELECT COUNT(*) FROM transcripts WHERE session_id = 'old'"), [(0,)])

    def test_a_longer_retention_keeps_the_old_session(self):
        self.assertEqual(self.scan_keeping(30).sessions_pruned, 0)


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
                for row in queries.totals_by(self.store, group, None, PRICES, **options)}

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
        rows = queries.totals_by(self.store, "model_effort", None, PRICES)
        self.assertEqual([(row["model"], row["effort"], row["turns"], row["cost"]) for row in rows],
                         [(HAIKU, store.BACKGROUND_EFFORT, 0, 1.0), ("claude-opus-5", "max", 1, 25.0),
                          ("claude-sonnet-5", "high", 2, 20.0), ("claude-sonnet-5", "medium", 1, 10.0)])

    def test_by_day_model_and_effort(self):
        rows = queries.totals_by(self.store, "day_model_effort", None, PRICES)
        self.assertIn((local_day(DAY_1), "claude-sonnet-5", "medium", 1),
                      [(row["day"], row["model"], row["effort"], row["turns"]) for row in rows])

    def test_by_local_hour_model_and_effort(self):
        rows = queries.totals_by(self.store, "hour_model_effort", None, PRICES)
        self.assertIn((local_hour(DAY_1), "claude-sonnet-5", "high", 2),
                      [(row["hour"], row["model"], row["effort"], row["turns"]) for row in rows])

    def test_by_effort(self):
        rows = {row["effort"]: row["turns"] for row in queries.totals_by(self.store, "effort", None, PRICES)}
        self.assertEqual(rows, {store.BACKGROUND_EFFORT: 0, "high": 2, "max": 1, "medium": 1})



class UltracodeTest(StoreCase):
    """Calls made while ultracode was on count as effort ultracode."""

    def setUp(self):
        super().setUp()
        self.main = self.projects.session("s1").at(DAY_1)

    def call(self, message_id, effort="xhigh", transcript=None):
        """One call at an effort level, in the main thread or in transcript."""
        (transcript or self.main).assistant(message_id, [text_block("a")], usage(output=5), effort=effort)

    def flagged(self):
        """The ids of the messages stored as ultracode, sorted."""
        return [row[0] for row in self.rows("SELECT message_id FROM messages WHERE ultracode = 1 ORDER BY 1")]

    def test_xhigh_calls_after_switching_it_on_count(self):
        self.call("m1")                                 # plain xhigh, before the switch
        self.main.ultracode("u1")
        self.call("m2")
        self.call("m3")
        self.scan()
        self.assertEqual(self.flagged(), ["m2", "m3"])

    def test_a_main_thread_call_at_another_effort_ends_it(self):
        self.main.ultracode("u1")
        self.call("m1")
        self.call("m2", effort="medium")
        self.call("m3")
        self.scan()
        self.assertEqual(self.flagged(), ["m1"])

    def test_a_call_without_an_effort_level_does_not_end_it(self):
        self.main.ultracode("u1")
        self.call("m1", effort=None)
        self.call("m2")
        self.scan()
        self.assertEqual(self.flagged(), ["m2"])

    def test_switching_it_off_ends_it(self):
        self.main.ultracode("u1")
        self.call("m1")
        self.main.ultracode("u2", reminder=None)
        self.call("m2")
        self.scan()
        self.assertEqual(self.flagged(), ["m1"])

    def test_a_reminder_that_it_is_still_on_starts_it_again(self):
        self.main.ultracode("u1")
        self.call("m1", effort="medium")
        self.call("m2")
        self.main.ultracode("u2", reminder="sparse")
        self.call("m3")
        self.scan()
        self.assertEqual(self.flagged(), ["m3"])

    def test_subagents_and_workflow_agents_count_by_time_and_their_own_effort(self):
        self.main.ultracode("u1")
        agent = self.projects.subagent("s1", "a1").at(DAY_1 + timedelta(seconds=10))
        self.call("a1", transcript=agent)
        self.call("a2", effort="high", transcript=agent)
        self.call("w1", transcript=self.projects.workflow_agent("s1", "wf_1", "w1").at(DAY_1 + timedelta(seconds=10)))
        self.main.at(DAY_1 + timedelta(seconds=20))
        self.call("m1", effort="medium")
        self.call("a3", transcript=agent.at(DAY_1 + timedelta(seconds=30)))
        self.scan()
        self.assertEqual(self.flagged(), ["a1", "w1"])

    def test_a_later_scan_moves_the_end(self):
        self.main.ultracode("u1")
        self.call("m1")
        self.call("a1", transcript=self.projects.subagent("s1", "a1").at(DAY_1 + timedelta(seconds=30)))
        self.scan()
        self.call("m2", effort="medium", transcript=self.main.at(DAY_1 + timedelta(seconds=20)))
        self.scan()
        self.assertEqual(self.flagged(), ["m1"])

    def test_other_sessions_are_not_affected(self):
        self.main.ultracode("u1")
        self.call("o1", transcript=self.projects.session("s2").at(DAY_1 + timedelta(seconds=5)))
        self.scan()
        self.assertEqual(self.flagged(), [])

    def test_usage_shows_them_as_effort_ultracode(self):
        self.call("m1")
        self.main.ultracode("u1")
        self.call("m2")
        self.scan()
        rows = {row["effort"]: row["turns"] for row in queries.totals_by(self.store, "effort", None, PRICES)}
        self.assertEqual(rows, {"xhigh": 1, "ultracode": 1})

    def test_states_are_stored_once_by_the_file_that_had_them_first(self):
        self.main.ultracode("u1")
        self.scan()
        self.projects.session("s2").ultracode("u1", reminder=None)
        self.scan()
        self.scan()
        self.assertEqual(self.rows("SELECT record_id, path, ts, active FROM ultracode_states"),
                         [("u1", str(self.main.path), scan.iso(DAY_1), 1)])


if __name__ == "__main__":
    unittest.main()
