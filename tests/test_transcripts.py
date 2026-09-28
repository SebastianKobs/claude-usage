"""transcripts.py: reading Claude Code transcripts, from the start or from a byte offset, into Chunks."""
import json
import unittest
from datetime import UTC
from datetime import datetime

from claude_usage import transcripts
from helpers import DEFAULT_MODEL
from helpers import TempDirTestCase
from helpers import create_result
from helpers import edit_result
from helpers import slug
from helpers import text_block
from helpers import thinking_block
from helpers import tool_use_block
from helpers import usage


class ParseCase(TempDirTestCase):
    """A temp projects folder with the main transcript s1 in self.main."""

    def setUp(self):
        super().setUp()
        self.main = self.projects.session("s1")

    def parse(self, transcript=None, offset=0):
        """The Chunk of a transcript (default: the main one) from offset."""
        return transcripts.parse((transcript or self.main).path, offset)

    def only_message(self, transcript=None):
        """The single MessageUsage of a transcript."""
        messages = self.parse(transcript).messages
        self.assertEqual(len(messages), 1)
        return messages[0]


class MessageUsageTest(ParseCase):
    def test_last_usage_per_message_id_wins(self):
        self.main.assistant("m1", [thinking_block(), text_block("a"), tool_use_block("t1", "Read")],
                            usage(new=3, cache_read=100, output=42))
        message = self.only_message()
        self.assertEqual((message.message_id, message.new_input, message.cache_read, message.output),
                         ("m1", 3, 100, 42))

    def test_messages_keep_their_order(self):
        self.main.assistant("m1", [text_block("a")], usage(output=1))
        self.main.assistant("m2", [text_block("b")], usage(output=2))
        self.assertEqual([message.message_id for message in self.parse().messages], ["m1", "m2"])

    def test_synthetic_messages_are_skipped(self):
        self.main.assistant("m1", [text_block("error")], usage(output=0), model="<synthetic>")
        self.assertEqual(self.parse().messages, ())

    def test_model_and_timestamp_of_the_first_record(self):
        self.main.at(datetime(2026, 9, 3, 8, 30, tzinfo=UTC))
        self.main.assistant("m1", [text_block("a"), text_block("b")], usage(output=5), model="claude-opus-5-5")
        message = self.only_message()
        self.assertEqual(message.model, "claude-opus-5-5")
        self.assertEqual(message.timestamp, datetime(2026, 9, 3, 8, 30, tzinfo=UTC))

    def test_cache_writes_split_into_5m_and_1h(self):
        self.main.assistant("m1", [text_block("a")], usage(cache_5m=7, cache_1h=11))
        message = self.only_message()
        self.assertEqual((message.cache_write_5m, message.cache_write_1h), (7, 11))

    def test_without_the_split_all_cache_writes_count_as_5m(self):
        self.main.assistant("m1", [text_block("a")], usage(cache_5m=7, cache_1h=11, split=False))
        message = self.only_message()
        self.assertEqual((message.cache_write_5m, message.cache_write_1h), (18, 0))

    def test_null_and_missing_counters_count_as_0(self):
        broken_usage = {"input_tokens": None, "cache_read_input_tokens": None, "output_tokens": 9,
                        "cache_creation": {"ephemeral_5m_input_tokens": None}}
        self.main.assistant("m1", [text_block("a")], broken_usage)
        message = self.only_message()
        self.assertEqual((message.new_input, message.cache_write_5m, message.cache_write_1h, message.cache_read,
                          message.output), (0, 0, 0, 0, 9))

    def test_speed_defaults_to_standard(self):
        self.main.assistant("m1", [text_block("a")], usage(speed=None))
        self.main.assistant("m2", [text_block("b")], usage(speed="fast"))
        self.assertEqual([message.speed for message in self.parse().messages], ["standard", "fast"])

    def test_web_searches_of_the_message(self):
        self.main.assistant("m1", [text_block("a")], dict(usage(output=1), server_tool_use={"web_search_requests": 3}))
        self.main.assistant("m2", [text_block("b")], usage(output=1))
        self.assertEqual([message.web_searches for message in self.parse().messages], [3, 0])

    def test_skill_and_mcp_server_the_message_is_attributed_to(self):
        self.main.assistant("m1", [text_block("a"), text_block("b")], usage(output=5),
                            attributionSkill="dataviz", attributionMcpServer="codebase-memory-mcp",
                            attributionMcpTool="search_graph")
        message = self.parse().messages[0]
        self.assertEqual((message.skill, message.mcp_server), ("dataviz", "codebase-memory-mcp"))

    def test_effort_level_of_the_message(self):
        self.main.assistant("m1", [text_block("a"), text_block("b")], usage(output=5), effort="medium")
        self.assertEqual(self.parse().messages[0].effort, "medium")

    def test_a_message_without_an_effort_level_has_none(self):
        self.main.assistant("m1", [text_block("a")], usage(output=5))
        self.assertIsNone(self.parse().messages[0].effort)

    def test_a_message_without_attribution_has_none(self):
        self.main.assistant("m1", [text_block("a")], usage(output=5), attributionSkill="")
        message = self.parse().messages[0]
        self.assertEqual((message.skill, message.mcp_server), (None, None))

    def test_assistant_record_without_usage_or_id_is_skipped(self):
        self.main.record("assistant", message={"id": "m1", "model": DEFAULT_MODEL, "content": []})
        self.main.record("assistant", message={"model": DEFAULT_MODEL, "content": [], "usage": usage(output=1)})
        self.assertEqual(self.parse().messages, ())


class ToolTest(ParseCase):
    def test_tool_calls_with_display_names(self):
        blocks = [tool_use_block("t1", "Read"), tool_use_block("t2", "mcp__codebase-memory-mcp__search_graph")]
        self.main.assistant("m1", blocks, usage(output=1))
        calls = self.parse().tool_calls
        self.assertEqual([(call.tool_use_id, call.tool) for call in calls],
                         [("t1", "Read"), ("t2", "codebase-memory-mcp.search_graph")])

    def test_mcp_server_names_with_underscores(self):
        self.assertEqual(transcripts.display_name("mcp__claude_ai_Claude_Docs__batch"), "claude_ai_Claude_Docs.batch")
        self.assertEqual(transcripts.display_name("Bash"), "Bash")

    def test_result_characters_of_a_string(self):
        self.main.tool_result("t1", "12345")
        self.assertEqual([(result.tool_use_id, result.chars) for result in self.parse().tool_results], [("t1", 5)])

    def test_result_characters_count_only_text_blocks(self):
        content = [{"type": "text", "text": "abc"}, {"type": "image", "source": {"data": "x" * 50}},
                   {"type": "tool_reference", "tool_name": "Read"}, {"type": "text", "text": "de"}]
        self.main.tool_result("t1", content)
        self.assertEqual(self.parse().tool_results[0].chars, 5)

    def test_result_in_a_later_read_than_its_call(self):
        self.main.assistant("m1", [tool_use_block("t1", "Grep")], usage(output=1))
        first = self.parse()
        self.main.tool_result("t1", "found")
        second = self.parse(offset=first.end_offset)
        self.assertEqual(second.tool_calls, ())
        self.assertEqual([(result.tool_use_id, result.chars) for result in second.tool_results], [("t1", 5)])


class TimingTest(ParseCase):
    """What the session time, API wait, tool time and lines changed are estimated from without a cost record."""

    def test_a_message_runs_from_the_user_record_before_it_to_its_last_record(self):
        self.main.at(datetime(2026, 9, 1, 12, 0, 0, tzinfo=UTC)).user("hi")
        self.main.at(datetime(2026, 9, 1, 12, 0, 5, tzinfo=UTC)).assistant(
            "m1", [thinking_block(), text_block("a")], usage(output=5))
        message = self.only_message()
        self.assertEqual((message.request_ts, message.end_ts),
                         (datetime(2026, 9, 1, 12, 0, 0, tzinfo=UTC), datetime(2026, 9, 1, 12, 0, 6, tzinfo=UTC)))

    def test_the_request_time_can_come_from_an_earlier_read(self):
        self.main.at(datetime(2026, 9, 1, 12, 0, 0, tzinfo=UTC)).user("hi")
        first = self.parse()
        self.assertEqual(first.last_user_ts, datetime(2026, 9, 1, 12, 0, 0, tzinfo=UTC))
        self.main.at(datetime(2026, 9, 1, 12, 0, 9, tzinfo=UTC)).assistant("m1", [text_block("a")], usage(output=5))
        second = transcripts.parse(self.main.path, first.end_offset, last_user_ts=first.last_user_ts)
        self.assertEqual(second.messages[0].request_ts, datetime(2026, 9, 1, 12, 0, 0, tzinfo=UTC))
        self.assertIsNone(second.last_user_ts)

    def test_without_a_user_record_before_it_a_message_has_no_request_time(self):
        self.main.assistant("m1", [text_block("a")], usage(output=5))
        self.assertIsNone(self.only_message().request_ts)

    def test_tool_calls_and_results_carry_their_time(self):
        self.main.at(datetime(2026, 9, 1, 12, 0, 0, tzinfo=UTC)).assistant(
            "m1", [tool_use_block("t1", "Bash")], usage(output=1))
        self.main.at(datetime(2026, 9, 1, 12, 0, 30, tzinfo=UTC)).tool_result("t1", "ok")
        chunk = self.parse()
        self.assertEqual(chunk.tool_calls[0].timestamp, datetime(2026, 9, 1, 12, 0, 0, tzinfo=UTC))
        self.assertEqual(chunk.tool_results[0].timestamp, datetime(2026, 9, 1, 12, 0, 30, tzinfo=UTC))

    def test_lines_an_edit_added_and_removed(self):
        self.main.tool_result("t1", "edited", toolUseResult=edit_result(["+a", "-b", " c", "+d"], ["-e"]))
        result = self.parse().tool_results[0]
        self.assertEqual((result.lines_added, result.lines_removed), (2, 2))

    def test_lines_of_a_created_file(self):
        self.main.tool_result("t1", "created", toolUseResult=create_result("one\ntwo\nthree\n"))
        result = self.parse().tool_results[0]
        self.assertEqual((result.lines_added, result.lines_removed), (3, 0))

    def test_other_results_change_no_lines(self):
        self.main.tool_result("t1", "output", toolUseResult={"stdout": "+not a patch", "stderr": ""})
        result = self.parse().tool_results[0]
        self.assertEqual((result.lines_added, result.lines_removed), (0, 0))


class AgentTest(ParseCase):
    def test_main_transcript(self):
        chunk = self.parse()
        self.assertEqual((chunk.session_id, chunk.agent_id, chunk.agent_type, chunk.description),
                         ("s1", None, "main", None))

    def test_subagent_with_meta(self):
        agent = self.projects.subagent("s1", "a7", meta={"agentType": "Explore", "description": "find things"})
        chunk = self.parse(agent)
        self.assertEqual((chunk.session_id, chunk.agent_id, chunk.agent_type, chunk.description),
                         ("s1", "a7", "Explore", "find things"))

    def test_subagent_without_meta_has_type_question_mark(self):
        agent = self.projects.subagent("s1", "a7", meta=False)
        self.assertEqual((self.parse(agent).agent_type, self.parse(agent).description), ("?", None))

    def test_subagent_carries_the_tool_call_that_spawned_it(self):
        agent = self.projects.subagent("s1", "a7")
        self.assertEqual(self.parse(agent).tool_use_id, "toolu_a7")

    def test_main_transcript_and_subagent_without_meta_have_no_spawning_call(self):
        agent = self.projects.subagent("s1", "a8", meta=False)
        self.main.user("hi")
        self.assertEqual((self.parse().tool_use_id, self.parse(agent).tool_use_id), (None, None))

    def test_a_workflow_agent_belongs_to_its_session(self):
        agent = self.projects.workflow_agent("s1", "wf_1", "b1", name="review")
        chunk = self.parse(agent)
        self.assertEqual((chunk.slug, chunk.session_id, chunk.agent_id, chunk.agent_type, chunk.description),
                         (self.main.path.parent.name, "s1", "b1", "workflow-subagent", "step b1"))

    def test_a_workflow_agent_carries_its_run_phase_and_workflow_name(self):
        agent = self.projects.workflow_agent("s1", "wf_1", "b1", name="review")
        chunk = self.parse(agent)
        self.assertEqual((chunk.workflow_run, chunk.workflow_phase, chunk.workflow_name), ("wf_1", "Review", "review"))

    def test_a_workflow_without_its_run_file_has_no_name(self):
        agent = self.projects.workflow_agent("s1", "wf_1", "b1")
        self.assertEqual((self.parse(agent).workflow_run, self.parse(agent).workflow_name), ("wf_1", None))

    def test_other_transcripts_belong_to_no_workflow(self):
        agent = self.projects.subagent("s1", "a7")
        self.main.user("hi")
        self.assertEqual([(chunk.workflow_run, chunk.workflow_phase) for chunk in (self.parse(), self.parse(agent))],
                         [(None, None), (None, None)])

    def test_unreadable_meta_counts_as_missing(self):
        agent = self.projects.subagent("s1", "a7")
        agent.path.with_name("agent-a7.meta.json").write_text("{broken", encoding="utf-8")
        self.assertEqual(self.parse(agent).agent_type, "?")

    def test_subagent_model_comes_from_its_messages(self):
        agent = self.projects.subagent("s1", "a7")
        agent.assistant("m1", [text_block("a")], usage(output=1), model="claude-haiku-4-5")
        self.assertEqual(self.only_message(agent).model, "claude-haiku-4-5")

    def test_slug_for_a_project_path(self):
        self.assertEqual(transcripts.slug_for("/home/dev/my.app_2"), "-home-dev-my-app-2")

    def test_slug(self):
        agent = self.projects.subagent("s1", "a7", project="/home/dev/other.repo")
        self.assertEqual(self.parse().slug, slug("/home/dev/app"))
        self.assertEqual(self.parse(agent).slug, "-home-dev-other-repo")


class SessionFieldsTest(ParseCase):
    def test_title_is_the_last_ai_title(self):
        self.main.ai_title("First")
        self.main.user("hi")
        self.main.ai_title("Second")
        self.assertEqual(self.parse().title, "Second")

    def test_no_title_is_none(self):
        self.main.user("hi")
        self.assertIsNone(self.parse().title)

    def test_cwd_is_the_first_one_seen(self):
        self.main.queue_operation()
        self.main.user("hi")
        self.main.cwd = "/elsewhere"
        self.main.user("again")
        self.assertEqual(self.parse().cwd, "/home/dev/app")

    def test_git_branch_is_the_last_one_seen(self):
        self.main.user("hi")
        self.main.git_branch = "feature"
        self.main.user("again")
        self.assertEqual(self.parse().git_branch, "feature")

    def test_first_and_last_timestamp_skip_records_without_one(self):
        self.main.ai_title("t")
        self.main.at(datetime(2026, 9, 2, 10, 0, tzinfo=UTC))
        self.main.user("hi")
        self.main.at(datetime(2026, 9, 2, 11, 0, tzinfo=UTC))
        self.main.assistant("m1", [text_block("a")], usage(output=1))
        self.main.ai_title("u")
        chunk = self.parse()
        self.assertEqual((chunk.first_ts, chunk.last_ts),
                         (datetime(2026, 9, 2, 10, 0, tzinfo=UTC), datetime(2026, 9, 2, 11, 0, tzinfo=UTC)))

    def test_invalid_timestamp_is_ignored(self):
        self.main.record("user", message={"role": "user", "content": "hi"}, timestamp="yesterday")
        self.assertIsNone(self.parse().first_ts)

    def test_a_timestamp_without_a_zone_counts_as_utc(self):
        self.main.record("user", message={"role": "user", "content": "hi"}, timestamp="2026-09-02T10:00:00")
        self.main.at(datetime(2026, 9, 2, 11, 0, tzinfo=UTC)).user("again")
        chunk = self.parse()
        self.assertEqual((chunk.first_ts, chunk.last_ts),
                         (datetime(2026, 9, 2, 10, 0, tzinfo=UTC), datetime(2026, 9, 2, 11, 0, tzinfo=UTC)))

    def test_empty_file(self):
        chunk = self.parse()
        self.assertEqual((chunk.messages, chunk.tool_calls, chunk.tool_results, chunk.end_offset), ((), (), (), 0))
        self.assertIsNone(chunk.cwd)


class CostStateTest(ParseCase):
    def test_no_cost_state_is_none(self):
        self.main.user("hi")
        self.assertIsNone(self.parse().cost_state)

    def test_the_last_cost_state_with_its_snapshot_time(self):
        self.main.at(datetime(2026, 9, 2, 10, 0, tzinfo=UTC)).user("hi")
        self.main.cost_state({"claude-sonnet-5": (1, 2, 3, 4, 0.5)})
        self.main.at(datetime(2026, 9, 2, 11, 0, tzinfo=UTC)).user("resumed")
        self.main.cost_state({"claude-sonnet-5": (10, 20, 30, 40, 5.0)})
        state = self.parse().cost_state
        self.assertEqual(state.snapshot_ts, datetime(2026, 9, 2, 11, 0, tzinfo=UTC))
        self.assertEqual([(model.model, model.new_input, model.cache_write, model.cache_read, model.output,
                           model.cost_usd) for model in state.models],
                         [("claude-sonnet-5", 10, 20, 30, 40, 5.0)])

    def test_web_searches_of_the_snapshot(self):
        self.main.user("hi")
        record = self.main.cost_state({"claude-haiku-4-5": (1, 0, 0, 1, 0.1)})
        self.main.path.write_text("", encoding="utf-8")
        self.main.user("hi")
        record["modelUsage"]["claude-haiku-4-5"]["webSearchRequests"] = 7
        self.main.bare(record)
        self.assertEqual(self.parse().cost_state.models[0].web_searches, 7)

    def test_start_time_of_the_process(self):
        self.main.user("hi")
        self.main.cost_state({"claude-sonnet-5": (1, 0, 0, 1, 0.1)}, start=datetime(2026, 9, 2, 8, 30, tzinfo=UTC))
        self.assertEqual(self.parse().cost_state.start_ts, datetime(2026, 9, 2, 8, 30, tzinfo=UTC))

    def test_a_start_time_out_of_range_is_none(self):
        self.main.bare({"type": "cost-state", "sessionId": "s1", "startTime": 10 ** 20, "modelUsage": {}})
        self.assertIsNone(self.parse().cost_state.start_ts)

    def test_missing_start_time_is_none(self):
        self.main.user("hi")
        self.main.bare({"type": "cost-state", "sessionId": "s1", "modelUsage": {}})
        self.assertIsNone(self.parse().cost_state.start_ts)

    def test_context_suffixes_are_merged_into_the_base_id(self):
        self.main.user("hi")
        self.main.cost_state({"claude-opus-5-5[1m]": (1, 0, 0, 2, 0.1), "claude-opus-5-5": (3, 0, 0, 4, 0.2)})
        models = self.parse().cost_state.models
        self.assertEqual([(model.model, model.new_input, model.output) for model in models],
                         [("claude-opus-5-5", 4, 6)])
        self.assertAlmostEqual(models[0].cost_usd, 0.3)

    def test_without_an_earlier_timestamp_in_the_read_the_snapshot_time_is_none(self):
        self.main.user("hi")
        first = self.parse()
        self.main.cost_state({"claude-sonnet-5": (1, 0, 0, 1, 0.1)})
        self.assertIsNone(self.parse(offset=first.end_offset).cost_state.snapshot_ts)

    def test_run_totals_of_the_process(self):
        self.main.user("hi")
        self.main.cost_state({}, totalDuration=600000, totalAPIDuration=240000, totalAPIDurationWithoutRetries=200000,
                             totalToolDuration=90000, totalLinesAdded=120, totalLinesRemoved=30)
        state = self.parse().cost_state
        self.assertEqual((state.duration_ms, state.api_ms, state.api_ms_without_retries, state.tool_ms,
                          state.lines_added, state.lines_removed), (600000, 240000, 200000, 90000, 120, 30))

    def test_missing_run_totals_count_as_0(self):
        self.main.user("hi")
        self.main.cost_state({}, totalDuration=None, totalLinesAdded="12")
        state = self.parse().cost_state
        self.assertEqual((state.duration_ms, state.api_ms, state.lines_added), (0, 0, 0))

    def test_broken_model_usage_is_skipped(self):
        self.main.user("hi")
        self.main.bare({"type": "cost-state", "sessionId": "s1",
                        "modelUsage": {"claude-x": "nonsense", "claude-y": {"outputTokens": None}}})
        models = self.parse().cost_state.models
        self.assertEqual([(model.model, model.output, model.cost_usd) for model in models], [("claude-y", 0, 0.0)])


class ApiErrorTest(ParseCase):
    def test_a_rate_limit_with_its_quota(self):
        resets = datetime(2026, 9, 1, 17, 0, tzinfo=UTC)
        self.main.at(datetime(2026, 9, 1, 14, 3, tzinfo=UTC)).api_error("e1", resets_at=resets)
        chunk = self.parse()
        self.assertEqual(chunk.api_errors, (transcripts.ApiError(
            record_id="e1", timestamp=datetime(2026, 9, 1, 14, 3, tzinfo=UTC), error="rate_limit", status=429,
            limit_type="five_hour", resets_at=resets),))
        self.assertEqual(chunk.messages, ())

    def test_a_server_error_without_quota(self):
        self.main.api_error("e1", error="server_error", status=None, limit_type=None)
        error = self.parse().api_errors[0]
        self.assertEqual((error.error, error.status, error.limit_type, error.resets_at),
                         ("server_error", None, None, None))

    def test_ordinary_messages_are_no_api_errors(self):
        self.main.assistant("m1", [text_block("a")], usage(output=5))
        self.assertEqual(self.parse().api_errors, ())

    def test_a_reset_time_in_milliseconds_is_none(self):
        record = self.main.api_error("e1", resets_at=datetime(2026, 9, 1, 17, 0, tzinfo=UTC))
        self.main.path.write_text("", encoding="utf-8")
        record["quotaLimits"]["resetsAt"] *= 1000
        self.main.bare(record)
        self.assertIsNone(self.parse().api_errors[0].resets_at)

    def test_an_error_without_a_record_id_is_skipped(self):
        record = self.main.api_error("e1")
        self.main.path.write_text("", encoding="utf-8")
        del record["uuid"]
        self.main.bare(record)
        self.assertEqual(self.parse().api_errors, ())


class CompactionTest(ParseCase):
    def test_a_compaction_with_its_metadata(self):
        self.main.at(datetime(2026, 9, 1, 14, 3, tzinfo=UTC)).compaction(
            "c1", trigger="auto", pre_tokens=167_000, post_tokens=9_000, duration_ms=41_000)
        self.assertEqual(self.parse().compactions, (transcripts.Compaction(
            record_id="c1", timestamp=datetime(2026, 9, 1, 14, 3, tzinfo=UTC), trigger="auto", pre_tokens=167_000,
            post_tokens=9_000, duration_ms=41_000),))

    def test_a_compaction_without_metadata_has_no_counts(self):
        self.main.compaction("c1", trigger=None)
        compaction = self.parse().compactions[0]
        self.assertEqual((compaction.trigger, compaction.pre_tokens, compaction.post_tokens, compaction.duration_ms),
                         (None, None, None, None))

    def test_a_compaction_without_a_record_id_is_skipped(self):
        record = self.main.compaction("c1")
        self.main.path.write_text("", encoding="utf-8")
        del record["uuid"]
        self.main.bare(record)
        self.assertEqual(self.parse().compactions, ())

    def test_other_system_records_are_no_compactions(self):
        self.main.record("system", subtype="turn_duration", uuid="x1", durationMs=5)
        self.main.attachment("skill_listing", "skills")
        self.assertEqual(self.parse().compactions, ())

    def test_compactions_keep_their_order(self):
        self.main.compaction("c1")
        self.main.compaction("c2", trigger="auto")
        self.assertEqual([compaction.record_id for compaction in self.parse().compactions], ["c1", "c2"])


class OffsetTest(ParseCase):
    def test_full_read_ends_at_the_file_size(self):
        self.main.user("hi")
        self.main.assistant("m1", [text_block("a")], usage(output=1))
        chunk = self.parse()
        self.assertEqual((chunk.start_offset, chunk.end_offset), (0, self.main.path.stat().st_size))

    def test_reading_from_an_offset_returns_only_the_appended_records(self):
        self.main.assistant("m1", [text_block("a")], usage(output=1))
        first = self.parse()
        self.main.assistant("m2", [text_block("b")], usage(output=2))
        second = self.parse(offset=first.end_offset)
        self.assertEqual([message.message_id for message in second.messages], ["m2"])
        self.assertEqual((second.start_offset, second.end_offset), (first.end_offset, self.main.path.stat().st_size))

    def test_a_message_split_across_reads_gives_its_final_usage_last(self):
        self.main.assistant("m1", [thinking_block()], dict(usage(output=40), output_tokens=1))
        first = self.parse()
        self.main.assistant("m1", [text_block("done")], usage(output=40))
        second = self.parse(offset=first.end_offset)
        self.assertEqual((first.messages[0].output, second.messages[0].output), (1, 40))

    def test_trailing_line_without_newline_is_left_for_the_next_read(self):
        self.main.user("hi")
        complete = self.main.path.stat().st_size
        line = json.dumps({"type": "ai-title", "aiTitle": "Late", "sessionId": "s1"})
        self.main.partial(line[:10])
        chunk = self.parse()
        self.assertEqual(chunk.end_offset, complete)
        self.assertIsNone(chunk.title)
        self.main.write_text(f"{line[10:]}\n")
        self.assertEqual(self.parse(offset=chunk.end_offset).title, "Late")

    def test_no_new_data_returns_an_empty_chunk_at_the_same_offset(self):
        self.main.user("hi")
        end = self.parse().end_offset
        chunk = self.parse(offset=end)
        self.assertEqual((chunk.start_offset, chunk.end_offset, chunk.messages), (end, end, ()))

    def test_multibyte_text_and_broken_lines_keep_offsets_exact(self):
        self.main.user("Grüße, 日本語 🎉")
        self.main.raw("{not json")
        self.main.raw("[1, 2]")
        self.main.raw(b"\xff\xfe broken utf-8".decode("latin-1"))
        middle = self.parse().end_offset
        self.assertEqual(middle, self.main.path.stat().st_size)
        self.main.assistant("m1", [text_block("ä")], usage(output=3))
        self.assertEqual([message.output for message in self.parse(offset=middle).messages], [3])

    def test_a_line_nested_too_deeply_is_skipped(self):
        self.main.raw("[" * 100_000)
        self.main.assistant("m1", [text_block("a")], usage(output=5))
        self.assertEqual(len(self.parse().messages), 1)

    def test_invalid_utf8_bytes_are_replaced_not_fatal(self):
        with self.main.path.open("ab") as handle:
            handle.write(b'{"type": "ai-title", "aiTitle": "caf\xe9", "sessionId": "s1"}\n')
        self.assertEqual(self.parse().title, "caf�")

    def test_read_lines_returns_records_and_offset(self):
        self.main.user("hi")
        self.main.raw("broken")
        records, end = transcripts.read_lines(self.main.path)
        self.assertEqual([record["type"] for record in records], ["user"])
        self.assertEqual(end, self.main.path.stat().st_size)


class FirstPromptTest(ParseCase):
    def test_first_line_of_the_first_user_prompt(self):
        self.main.queue_operation()
        self.main.user("Fix the parser\nand the tests")
        self.main.user("second prompt")
        self.assertEqual(transcripts.first_prompt(self.main.path), "Fix the parser")

    def test_meta_compact_and_tool_result_records_are_skipped(self):
        self.main.user("<local-command-caveat>…", isMeta=True)
        self.main.user("summary of earlier work", isCompactSummary=True)
        self.main.tool_result("t1", "output")
        self.main.user("the real prompt", as_blocks=True)
        self.assertEqual(transcripts.first_prompt(self.main.path), "the real prompt")

    def test_leading_blank_lines_are_skipped(self):
        self.main.user("\n\n  go on  \n")
        self.assertEqual(transcripts.first_prompt(self.main.path), "go on")

    def test_no_prompt_is_none(self):
        self.main.tool_result("t1", "output")
        self.assertIsNone(transcripts.first_prompt(self.main.path))

    def test_missing_file_is_none(self):
        self.main.path.unlink()
        self.assertIsNone(transcripts.first_prompt(self.main.path))


class FindTranscriptsTest(TempDirTestCase):
    def test_main_and_subagent_files_only(self):
        main = self.projects.session("s1")
        agent = self.projects.subagent("s1", "a1")
        other = self.projects.session("s2", project="/home/dev/other")
        self.projects.tool_results_file("s1", "big.txt")
        (self.projects.project_dir() / "memory").mkdir()
        (self.projects.project_dir() / "memory" / "MEMORY.md").write_text("x", encoding="utf-8")
        (self.projects.project_dir() / "notes.jsonl.bak").write_text("x", encoding="utf-8")
        found = transcripts.find_transcripts(self.projects.root)
        self.assertEqual(sorted(found), sorted([main.path, agent.path, other.path]))

    def test_workflow_agents_but_not_their_journal(self):
        main = self.projects.session("s1")
        agent = self.projects.workflow_agent("s1", "wf_1", "b1", name="review")
        found = transcripts.find_transcripts(self.projects.root)
        self.assertEqual(sorted(found), sorted([main.path, agent.path]))

    def test_missing_projects_dir_raises(self):
        with self.assertRaises(FileNotFoundError):
            transcripts.find_transcripts(self.tmp / "nothing")


if __name__ == "__main__":
    unittest.main()
