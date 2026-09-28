"""queries.py: the totals, sessions and details behind the report and the dashboard."""
import os
import time
import unittest
from datetime import date
from datetime import timedelta

from claude_usage import compact
from claude_usage import queries
from claude_usage import scan
from claude_usage import store
from claude_usage import turns
from helpers import DAY_1
from helpers import DAY_3
from helpers import HAIKU
from helpers import MILLION
from helpers import PRICES
from helpers import StoreCase
from helpers import build_session
from helpers import create_result
from helpers import edit_result
from helpers import local_day
from helpers import local_hour
from helpers import text_block
from helpers import thinking_block
from helpers import tool_use_block
from helpers import usage


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
        totals = queries.runtime_totals(self.store, None, PRICES)
        self.assertEqual((totals["sessions"], totals["duration_ms"], totals["api_ms"], totals["api_ms_without_retries"],
                          totals["tool_ms"], totals["lines_added"], totals["lines_removed"]),
                         (2, 660000, 270000, 230000, 95000, 160, 50))

    def test_since_until_and_project(self):
        self.assertEqual(queries.runtime_totals(self.store, DAY_3.date(), PRICES)["lines_added"], 10)
        self.assertEqual(queries.runtime_totals(self.store, None, PRICES, until=DAY_1.date())["lines_added"], 150)
        self.assertEqual(queries.runtime_totals(self.store, None, PRICES, project="/home/dev/other")["sessions"], 1)

    def test_cost_per_100_lines_changed_counts_the_whole_sessions(self):
        totals = queries.runtime_totals(self.store, None, PRICES)
        self.assertAlmostEqual(totals["cost"], 20.0)
        self.assertAlmostEqual(totals["cost_per_100_lines"], 20.0 / 210 * 100)

    def test_no_lines_changed_means_no_cost_per_line(self):
        totals = queries.runtime_totals(self.store, date(2030, 1, 1), PRICES)
        self.assertEqual((totals["sessions"], totals["lines_added"], totals["duration_ms"]), (0, 0, 0))
        self.assertIsNone(totals["cost_per_100_lines"])

    def test_session_detail_has_the_run_totals(self):
        runtime = queries.session_detail(self.store, "s1", PRICES)["runtime"]
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
        runtime = queries.session_detail(self.store, "s1", PRICES)["runtime"]
        # session: 12:00:00 to 12:00:30; API: m1 5 s, m2 10 s (from the tool result), a1-m1 3 s;
        # tools: t1 15 s (from the record with the tool_use block), t2 2 s
        self.assertEqual(runtime, {"source": "transcripts", "duration_ms": 30000, "api_ms": 18000,
                                   "api_ms_without_retries": None, "tool_ms": 17000, "lines_added": 4,
                                   "lines_removed": 1})

    def test_reading_in_pieces_gives_the_same_estimate(self):
        whole = queries.session_detail(self.store, "s1", PRICES)["runtime"]
        self.store.close()
        self.store_path.unlink()
        self.store = store.Store(self.store_path)
        self.addCleanup(self.store.close)
        lines = self.main.path.read_bytes().splitlines(keepends=True)
        self.main.path.write_bytes(b"".join(lines[:1]))           # the next read starts with m1
        self.scan()
        self.main.path.write_bytes(b"".join(lines))
        self.scan()
        self.assertEqual(queries.session_detail(self.store, "s1", PRICES)["runtime"], whole)

    def test_a_cost_record_replaces_the_estimate(self):
        self.main.cost_state({}, totalDuration=99000)
        self.scan()
        runtime = queries.session_detail(self.store, "s1", PRICES)["runtime"]
        self.assertEqual((runtime["source"], runtime["duration_ms"]), ("cost_record", 99000))

    def test_a_session_without_timestamps_has_no_run_totals(self):
        self.projects.session("s3").ai_title("only a title")
        self.scan()
        self.assertIsNone(queries.session_detail(self.store, "s3", PRICES)["runtime"])


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
                for row in queries.api_errors_by(self.store, group, since, **options)]

    def test_errors_are_stored_with_their_quota(self):
        self.assertEqual(self.rows("SELECT record_id, error, status, limit_type, resets_at, day FROM api_errors "
                                   "WHERE record_id = 'e1'"),
                         [("e1", "rate_limit", 429, "five_hour", scan.iso(self.resets), local_day(DAY_1))])

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
            queries.api_errors_by(self.store, "model", None)

    def test_events_newest_first_with_their_session(self):
        events = queries.api_error_events(self.store, None)
        self.assertEqual([event["record_id"] for event in events], ["e5", "e4", "e3", "e2", "e1"])
        self.assertEqual({key: events[1][key] for key in ("session_id", "title", "agent_type", "limit_type")},
                         {"session_id": "s1", "title": "Parser fix", "agent_type": "general-purpose",
                          "limit_type": "seven_day"})
        self.assertEqual(events[-1]["resets_at"], scan.iso(self.resets))

    def test_events_limit_and_filters(self):
        self.assertEqual([event["record_id"] for event in queries.api_error_events(self.store, None, limit=2)],
                         ["e5", "e4"])
        self.assertEqual([event["record_id"] for event in queries.api_error_events(
            self.store, None, project="/home/dev/app", until=DAY_1.date())], ["e2", "e1"])

    def test_a_forked_copy_is_not_counted_twice(self):
        fork = self.projects.session("s9", project="/home/dev/app")
        fork.at(DAY_1).api_error("e1", resets_at=self.resets)
        self.scan()
        self.assertEqual(self.rows("SELECT path FROM api_errors WHERE record_id = 'e1'"), [(str(self.main.path),)])


class FirstStoredDayTest(StoreCase):
    def test_the_earliest_day_with_usage(self):
        self.projects.session("s1").at(DAY_3).assistant("m1", [text_block("a")], usage(output=1))
        self.projects.session("s2", project="/home/dev/other").at(DAY_1).assistant("m2", [text_block("b")],
                                                                                  usage(output=1))
        self.scan()
        self.assertEqual(queries.first_stored_day(self.store), date.fromisoformat(local_day(DAY_1)))
        self.assertEqual(queries.first_stored_day(self.store, project="/home/dev/app"),
                         date.fromisoformat(local_day(DAY_3)))

    def test_none_without_usage(self):
        self.assertIsNone(queries.first_stored_day(self.store))


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
        rows = queries.totals_by(self.store, group, since, PRICES)
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
        for row in queries.totals_by(self.store, "day", None, PRICES):
            with self.subTest(day=row["day"]):
                self.assertAlmostEqual(sum(row["cost_parts"].values()), row["cost"])
        opus = self.totals("model")["claude-opus-5"]["cost_parts"]
        self.assertEqual(opus, {"new_input": 0.0, "cache_write": 16.25, "cache_read": 0.5, "output": 25.0,
                                "web_search": 0.0})

    def test_combined_adds_the_cost_parts(self):
        rows = queries.totals_by(self.store, "model", None, PRICES)
        total = queries.combined(rows)
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
        rows = queries.totals_by(self.store, "day", None, PRICES, until=until)
        self.assertEqual([row["day"] for row in rows], [local_day(DAY_1)])

    def test_nearest_days_with_usage_skip_empty_days(self):
        middle = date.fromisoformat(local_day(DAY_1)) + timedelta(days=1)
        self.assertEqual(queries.nearest_days(self.store, middle),
                         (date.fromisoformat(local_day(DAY_1)), date.fromisoformat(local_day(DAY_3))))

    def test_nearest_days_are_none_past_the_ends(self):
        self.assertEqual(queries.nearest_days(self.store, date.fromisoformat(local_day(DAY_1))),
                         (None, date.fromisoformat(local_day(DAY_3))))
        self.assertEqual(queries.nearest_days(self.store, date.fromisoformat(local_day(DAY_3))),
                         (date.fromisoformat(local_day(DAY_1)), None))

    def test_nearest_days_of_one_project(self):
        day_3 = date.fromisoformat(local_day(DAY_3)) + timedelta(days=1)
        self.assertEqual(queries.nearest_days(self.store, day_3, project="/home/dev/other"),
                         (date.fromisoformat(local_day(DAY_3)), None))
        self.assertEqual(queries.nearest_days(self.store, date.fromisoformat(local_day(DAY_3)),
                                            project="/home/dev/other"), (None, None))

    def test_since_filter_is_inclusive(self):
        since = date.fromisoformat(local_day(DAY_3))
        self.assertEqual(sorted(self.totals("day", since)), [local_day(DAY_3)])
        self.assertEqual(self.totals("model", since)["claude-opus-5"]["turns"], 2)

    def test_rows_are_ordered_by_key(self):
        days = [row["day"] for row in queries.totals_by(self.store, "day", None, PRICES)]
        self.assertEqual(days, sorted(days))

    def test_unknown_group_raises(self):
        with self.assertRaises(ValueError):
            queries.totals_by(self.store, "weekday", None, PRICES)

    def test_project_filter(self):
        rows = queries.totals_by(self.store, "model", None, PRICES, project="/home/dev/other")
        self.assertEqual([(row["model"], row["turns"]) for row in rows], [("claude-mystery-9", 1)])

    def test_web_searches_of_messages_are_priced_without_the_fast_multiplier(self):
        searcher = self.projects.session("s4")
        searcher.at(DAY_1).assistant("m6", [text_block("w")],
                                     dict(usage(speed="fast"), server_tool_use={"web_search_requests": 100}),
                                     model="claude-opus-5")
        self.scan()
        row = {row["project"]: row for row in queries.totals_by(self.store, "project", None, PRICES)}["/home/dev/app"]
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
        return queries.live_sessions(self.store, minutes, PRICES, now=self.now)

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
        self.assertEqual(queries.live_sessions(self.store, 5, PRICES, now=self.now, project="/home/dev/other"), [])
        live = queries.live_sessions(self.store, 5, PRICES, now=self.now, project="/home/dev/app")
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
        self.assertIsNone(queries.session_detail(self.store, "nope", PRICES))

    def test_session_fields_and_prompt(self):
        detail = queries.session_detail(self.store, "s1", PRICES)
        self.assertEqual((detail["session_id"], detail["project"], detail["title"], detail["prompt"]),
                         ("s1", "/home/dev/app", "Parser fix", "Fix the parser"))
        self.assertEqual((detail["turns"], detail["output"]), (3, 100))

    def test_main_thread_first_then_subagents(self):
        agents = queries.session_detail(self.store, "s1", PRICES)["agents"]
        self.assertEqual([(agent["agent_id"], agent["agent_type"]) for agent in agents],
                         [(None, "main"), ("a1", "Explore")])

    def test_per_agent_numbers(self):
        main = queries.session_detail(self.store, "s1", PRICES)["agents"][0]
        self.assertEqual((main["turns"], main["context_first"], main["context_last"]), (2, 1010, 1205))
        self.assertEqual(main["input_total"], 1010 + 1205)
        self.assertEqual((main["new_input"], main["cache_write_5m"], main["cache_read"], main["output"]),
                         (15, 1200, 1000, 70))
        self.assertEqual(main["models"], ["claude-sonnet-5"])
        expected = (15 * 2.0 + 1200 * 2.5 + 1000 * 0.2 + 70 * 10.0) / MILLION
        self.assertAlmostEqual(main["cost"], expected)

    def test_tools_per_agent(self):
        agents = queries.session_detail(self.store, "s1", PRICES)["agents"]
        self.assertEqual(agents[0]["tools"], [{"tool": "Read", "calls": 1, "result_chars": 300}])
        self.assertEqual(agents[1]["tools"], [{"tool": "srv.find", "calls": 1, "result_chars": 4}])

    def test_history_without_the_file_has_no_prompt(self):
        self.main.path.unlink()
        detail = queries.session_detail(self.store, "s1", PRICES)
        self.assertIsNone(detail["prompt"])
        self.assertEqual(detail["turns"], 3)

    def test_context_per_turn_in_time_order(self):
        main = queries.session_detail(self.store, "s1", PRICES)["agents"][0]
        self.assertEqual([turn["context"] for turn in main["context_per_turn"]], [1010, 1205])
        timestamps = [turn["ts"] for turn in main["context_per_turn"]]
        self.assertEqual(timestamps, sorted(timestamps))

    def test_background_has_no_context_per_turn(self):
        self.main.cost_state({"claude-sonnet-5": (100, 5000, 5000, 500, 0.1)})
        self.scan()
        agents = queries.session_detail(self.store, "s1", PRICES)["agents"]
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
        self.detail = queries.session_detail(self.store, "s1", PRICES)

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
        detail = queries.session_detail(self.store, "s3", PRICES)
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
        self.detail = queries.session_detail(self.store, "s1", PRICES)

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
        main = queries.session_detail(self.store, "s1", PRICES)["agents"][0]
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
        self.assertEqual(queries.context_stats(self.store, DAY_1.date(), until=DAY_1.date()),
                         {"turns": 5, "median": 300, "p90": 760})

    def test_subagents_do_not_count(self):
        self.assertEqual(queries.context_stats(self.store, None, session_id="s1")["turns"], 5)

    def test_project_and_session_filters(self):
        self.assertEqual(queries.context_stats(self.store, None, project="/home/dev/other"),
                         {"turns": 1, "median": 100, "p90": 100})
        self.assertEqual(queries.context_stats(self.store, None, session_id="s2")["median"], 100)

    def test_no_turns_means_no_values(self):
        self.assertEqual(queries.context_stats(self.store, date(2030, 1, 1)), {"turns": 0, "median": None, "p90": None})


class TranscriptPathTest(StoreCase):
    def setUp(self):
        super().setUp()
        self.main, self.agent = build_session(self.projects)
        self.scan()

    def test_the_main_thread_and_a_subagent(self):
        self.assertEqual(queries.transcript_path(self.store, "s1", None), self.main.path)
        self.assertEqual(queries.transcript_path(self.store, "s1", "a1"), self.agent.path)

    def test_unknown_session_or_agent_is_none(self):
        self.assertIsNone(queries.transcript_path(self.store, "nope", None))
        self.assertIsNone(queries.transcript_path(self.store, "s1", "nope"))


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
        sessions = queries.recent_sessions(self.store, None, PRICES)
        self.assertEqual([(session["session_id"], session["subagents"], session["output"]) for session in sessions],
                         [("s2", 1, 25), ("s1", 0, 10)])

    def test_project_filter(self):
        sessions = queries.recent_sessions(self.store, None, PRICES, project="/home/dev/app")
        self.assertEqual([session["session_id"] for session in sessions], ["s1"])

    def test_until(self):
        until = date.fromisoformat(local_day(DAY_1))
        sessions = queries.recent_sessions(self.store, None, PRICES, until=until)
        self.assertEqual([session["session_id"] for session in sessions], ["s1"])

    def test_limit_and_since(self):
        self.assertEqual(len(queries.recent_sessions(self.store, None, PRICES, limit=1)), 1)
        since = date.fromisoformat(local_day(DAY_3))
        self.assertEqual([session["session_id"] for session in queries.recent_sessions(self.store, since, PRICES)],
                         ["s2"])

    def test_no_limit_lists_every_session(self):
        self.assertEqual(len(queries.recent_sessions(self.store, None, PRICES, limit=None)), 2)

    def test_the_number_of_queries_does_not_grow_with_the_sessions(self):
        for number in range(5):
            self.projects.session(f"more{number}").at(DAY_3).assistant(f"n{number}", [text_block("x")],
                                                                        usage(output=1))
        self.scan()
        statements = []
        self.store.connection.set_trace_callback(statements.append)
        self.addCleanup(self.store.connection.set_trace_callback, None)
        sessions = queries.recent_sessions(self.store, None, PRICES, limit=None)
        self.assertEqual(len(sessions), 7)
        self.assertLessEqual(len(statements), 3)


class RangeFilterTest(StoreCase):
    def plan(self, sql, parameters):
        """The EXPLAIN QUERY PLAN details of a query, as one text."""
        return " | ".join(row["detail"] for row in self.store.connection.execute(f"EXPLAIN QUERY PLAN {sql}",
                                                                                 parameters))

    def test_no_filter_is_always_true(self):
        self.assertEqual(queries.range_filter(queries.USAGE_COLUMNS, None, None), ("1", {}))

    def test_only_the_set_bounds_become_clauses(self):
        condition, parameters = queries.range_filter(queries.USAGE_COLUMNS, date(2026, 9, 1), None,
                                                   project="/home/dev/app")
        self.assertEqual(condition, "u.day >= :since AND u.slug = :slug")
        self.assertEqual(parameters, {"since": "2026-09-01", "slug": "-home-dev-app"})

    def test_a_session_filter(self):
        condition, parameters = queries.range_filter(queries.USAGE_COLUMNS, None, date(2026, 9, 3), session_id="s1")
        self.assertEqual(condition, "u.day <= :until AND u.session_id = :session")
        self.assertEqual(parameters, {"until": "2026-09-03", "session": "s1"})

    def test_a_day_range_searches_the_day_index(self):
        condition, parameters = queries.range_filter(queries.USAGE_COLUMNS, date(2026, 9, 1), date(2026, 9, 3))
        self.assertIn("USING INDEX messages_day", self.plan(f"SELECT * FROM usage_rows u WHERE {condition}",
                                                            parameters))

    def test_an_error_range_searches_the_day_index(self):
        condition, parameters = queries.range_filter(queries.ERROR_COLUMNS, date(2026, 9, 1), date(2026, 9, 3))
        sql = f"SELECT * FROM api_errors e JOIN transcripts t ON t.path = e.path WHERE {condition}"
        self.assertIn("USING INDEX api_errors_day", self.plan(sql, parameters))


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
        return {session["session_id"]: session for session in queries.recent_sessions(self.store, None, PRICES)}

    def test_average_and_peak_context_of_the_main_thread(self):
        session = self.sessions()["s1"]
        self.assertEqual((session["context_avg"], session["context_peak"]), (2000, 3000))

    def test_no_main_thread_turns_means_no_context(self):
        session = self.sessions()["s2"]
        self.assertEqual((session["context_avg"], session["context_peak"]), (None, None))


class ContextPartsTest(StoreCase):
    """Per turn parts, growth and rebuilds, the compactions, the fixed overhead and the biggest growth steps."""

    def setUp(self):
        super().setUp()
        main = self.projects.session("s1")
        main.user("go")
        main.assistant("m1", [tool_use_block("t1", "Read")], usage(new=10, cache_5m=20_000, output=100))
        main.tool_result("t1", "x" * 4000)
        main.assistant("m2", [tool_use_block("t2", "Bash")],
                       usage(new=5, cache_5m=1_000, cache_read=20_010, output=50))
        main.tool_result("t2", "y" * 30)
        main.assistant("m3", [tool_use_block("toolu_a1", "Agent")],
                       usage(new=5, cache_5m=21_000, cache_read=100, output=20))
        main.tool_result("toolu_a1", "z" * 700)
        self.boundary = main.compaction("c1")
        main.user("again")
        main.assistant("m4", [text_block("ok")], usage(cache_5m=3_000, output=10))
        self.projects.subagent("s1", "a1").assistant("a1-m1", [text_block("found")], usage(cache_5m=5_000))
        self.projects.subagent("s1", "a2", meta=False).assistant("a2-m1", [text_block("x")], usage(cache_5m=10))
        self.scan()
        agents = queries.session_detail(self.store, "s1", PRICES)["agents"]
        self.main, self.agent, self.metaless = agents[:3]

    def test_each_turn_has_its_parts_and_growth(self):
        parts = [(turn["new_input"], turn["cache_write"], turn["cache_read"], turn["growth"])
                 for turn in self.main["context_per_turn"]]
        self.assertEqual(parts, [(10, 20_000, 0, None), (5, 1_000, 20_010, 905), (5, 21_000, 100, 40),
                                 (0, 3_000, 0, None)])

    def test_each_turn_has_its_message_id(self):
        self.assertEqual([turn["message_id"] for turn in self.main["context_per_turn"]], ["m1", "m2", "m3", "m4"])

    def test_a_turn_that_rewrote_the_cache_carries_its_rebuild(self):
        rebuilds = [turn["rebuild"] for turn in self.main["context_per_turn"]]
        lost = 21_015 - 100
        self.assertEqual(rebuilds[:2] + rebuilds[3:], [None, None, None])
        self.assertEqual((rebuilds[2]["cause"], rebuilds[2]["lost"]), ("prefix", lost))
        self.assertAlmostEqual(rebuilds[2]["extra_cost"], lost * (2.5 - 0.2) / MILLION)

    def test_the_rebuilds_add_up(self):
        lost = 21_015 - 100
        self.assertEqual((self.main["rebuilds"]["count"], self.main["rebuilds"]["lost"]), (1, lost))
        self.assertAlmostEqual(self.main["rebuilds"]["cost"], lost * (2.5 - 0.2) / MILLION)

    def test_the_compactions_of_the_file(self):
        [row] = self.main["compactions"]
        self.assertEqual({key: row[key] for key in ("ts", "trigger", "pre_tokens", "post_tokens", "duration_ms")},
                         {"ts": self.boundary["timestamp"].replace("Z", "+00:00"), "trigger": "manual",
                          "pre_tokens": 150_000, "post_tokens": 12_000, "duration_ms": 30_000})
        self.assertEqual(self.agent["compactions"], [])

    def test_a_compaction_carries_the_next_calls_context(self):
        self.assertEqual(self.main["compactions"][0]["next_context"], 3_000)

    def test_a_compaction_is_compared_with_keeping_the_context(self):
        comparison = self.main["compactions"][0]["versus_keeping"]
        # the last call before carried 21,105 and replied 20; the next call's context is 3,000
        self.assertEqual((comparison["before"], comparison["difference"], comparison["calls_after"]),
                         (21_125, 18_125, 1))
        self.assertIn(comparison["verdict"], turns.VERDICTS)

    def test_the_fixed_overhead_and_what_reading_it_again_cost(self):
        self.assertEqual(self.main["overhead"]["tokens"], 20_010)
        self.assertAlmostEqual(self.main["overhead"]["cost"], (20_010 + 100) * 0.2 / MILLION)

    def test_the_biggest_growth_steps_with_the_tools_before_them(self):
        top = [(step["message_id"], step["growth"], step["tools"]) for step in self.main["top_growth"]]
        self.assertEqual(top, [("m2", 905, [{"tool": "Read", "result_chars": 4000}]),
                               ("m3", 40, [{"tool": "Bash", "result_chars": 30}])])

    def test_a_subagent_has_what_it_returned(self):
        self.assertEqual((self.main["returned_chars"], self.agent["returned_chars"]), (None, 700))

    def test_a_subagent_without_meta_returned_nothing_known(self):
        self.assertIsNone(self.metaless["returned_chars"])

    def test_the_current_context_of_the_main_thread(self):
        current = queries.current_context(self.store, "s1", compact.DEFAULT_COMPACT, PRICES)
        self.assertEqual((current["context"], current["turns_since_compaction"], current["last_compaction"]),
                         (3_000, 1, self.boundary["timestamp"].replace("Z", "+00:00")))

    def test_no_current_context_without_main_thread_turns(self):
        self.assertIsNone(queries.current_context(self.store, "nope", compact.DEFAULT_COMPACT, PRICES))


class CompactionHistoryTest(StoreCase):
    """Every stored main-thread compaction compared with keeping the context, what the preview learns from."""

    def compacted(self, transcript, prefix):
        """A call, a compaction and three calls after it, message ids starting with prefix."""
        transcript.user("go")
        transcript.assistant(f"{prefix}1", [text_block("a")], usage(cache_1h=20_000, cache_read=180_000, output=500))
        transcript.compaction(f"{prefix}-c")
        for index in range(2, 5):
            transcript.user("more")
            transcript.assistant(f"{prefix}{index}", [text_block("b")], usage(cache_1h=500, cache_read=30_000))

    def test_main_thread_compactions_of_every_session(self):
        self.compacted(self.projects.session("s1"), "a")
        self.compacted(self.projects.session("s2"), "b")
        self.compacted(self.projects.subagent("s1", "x1"), "c")
        self.scan()
        history = queries.compaction_history(self.store, PRICES, compact.DEFAULT_COMPACT)
        self.assertEqual([item.calls_after for item in history], [3, 3])

    def test_every_compaction_of_a_file(self):
        main = self.projects.session("s1")
        self.compacted(main, "a")
        self.compacted(main, "b")
        self.scan()
        history = queries.compaction_history(self.store, PRICES, compact.DEFAULT_COMPACT)
        self.assertEqual([(item.calls_after, item.last_stretch) for item in history], [(4, False), (3, True)])


class WorkflowAgentTest(StoreCase):
    def test_a_sessions_workflow_agents_carry_their_run(self):
        self.projects.session("s1").at(DAY_1).assistant("m1", [text_block("a")], usage(output=5))
        agent = self.projects.workflow_agent("s1", "wf_1", "b1", name="review")
        agent.at(DAY_1).assistant("m2", [text_block("b")], usage(cache_read=100, output=7))
        self.scan()
        agents = queries.session_detail(self.store, "s1", PRICES)["agents"]
        self.assertEqual([(row["agent_type"], row["workflow_run"], row["workflow_phase"], row["workflow_name"],
                           row["output"]) for row in agents],
                         [("main", None, None, None, 5), ("workflow-subagent", "wf_1", "Review", "review", 7)])


class OutputRateTest(StoreCase):
    def test_output_speeds_come_from_the_main_threads_only(self):
        main = self.projects.session("s1")
        main.user("go")
        main.assistant("m1", [text_block("a")], usage(cache_5m=10, output=4_000))
        agent = self.projects.subagent("s1", "a1")
        agent.user("look")
        agent.assistant("a1-m1", [text_block("b")], usage(cache_5m=10, output=9_000), model="claude-opus-5")
        self.scan()
        rates = queries.output_rates(self.store)
        self.assertEqual(set(rates), {"claude-sonnet-5"})
        self.assertEqual(rates["claude-sonnet-5"].median, 4_000.0)


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
        sessions = queries.recent_sessions(self.store, since, PRICES, limit=None, project=project)
        return [session["session_id"] for session in queries.costliest(sessions, limit)]

    def test_costliest_first_and_unpriced_last(self):
        self.assertEqual(self.costliest(), ["dear", "elsewhere", "cheap", "unpriced"])

    def test_limit(self):
        self.assertEqual(self.costliest(limit=2), ["dear", "elsewhere"])

    def test_since_and_project(self):
        self.assertEqual(self.costliest(since=date.fromisoformat(local_day(DAY_3))),
                         ["elsewhere", "cheap", "unpriced"])
        self.assertEqual(self.costliest(project="/home/dev/app"), ["dear", "cheap", "unpriced"])

    def test_the_cost_counts_the_subagents(self):
        sessions = queries.recent_sessions(self.store, None, PRICES, limit=None)
        dear = queries.costliest(sessions, 1)[0]
        self.assertAlmostEqual(dear["cost"], (8 * MILLION * 0.2 + 100 * 10.0) / MILLION)
        self.assertAlmostEqual(dear["cost_parts"]["cache_read"], 8 * MILLION * 0.2 / MILLION)


if __name__ == "__main__":
    unittest.main()
