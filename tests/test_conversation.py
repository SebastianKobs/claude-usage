"""conversation.py: a transcript's conversation as the session view shows it, read from the file on demand."""
import json
import unittest
from datetime import UTC
from datetime import datetime

from claude_usage import conversation
from helpers import DEFAULT_MODEL
from helpers import MILLION
from helpers import PRICES
from helpers import TempDirTestCase
from helpers import text_block
from helpers import thinking_block
from helpers import tool_use_block
from helpers import usage


class ConversationTest(TempDirTestCase):
    def setUp(self):
        super().setUp()
        self.main = self.projects.session("s1")

    def entries(self):
        """(kind, text) of each entry."""
        return [(entry.kind, entry.text) for entry in conversation.conversation(self.main.path, PRICES)]

    def test_prompts_and_replies_in_order_with_their_time(self):
        self.main.at(datetime(2026, 9, 1, 12, 0, tzinfo=UTC)).user("Fix the parser")
        self.main.assistant("m1", [text_block("Looking."), text_block("Done.")], usage(output=5))
        self.main.user("thanks", as_blocks=True)
        entries = conversation.conversation(self.main.path, PRICES)
        self.assertEqual([(entry.kind, entry.text) for entry in entries],
                         [("prompt", "Fix the parser"), ("text", "Looking."), ("text", "Done."), ("prompt", "thanks")])
        self.assertEqual(entries[0].timestamp, datetime(2026, 9, 1, 12, 0, tzinfo=UTC))
        self.assertEqual(entries[1].model, DEFAULT_MODEL)

    def items(self):
        """(kind, text) of the items of each injected entry."""
        return [[(item.kind, item.text) for item in entry.items]
                for entry in conversation.conversation(self.main.path, PRICES) if entry.kind == "injected"]

    def test_injected_user_records_are_no_prompts(self):
        self.main.user("meta text", isMeta=True)
        self.main.user("skill text", as_blocks=True, sourceToolUseID="toolu_1")
        self.main.user("real prompt")
        self.assertEqual(self.entries(), [("injected", None), ("prompt", "real prompt")])
        self.assertEqual(self.items(), [[("meta", "meta text"), ("skill", "skill text")]])

    def test_attachments_that_reach_the_model_are_injected_items(self):
        self.main.attachment("hook_additional_context", "hook says hi")
        self.main.attachment("file", ["part one", "part two"])
        self.main.attachment("hook_success")
        self.assertEqual(self.items(), [[("hook_additional_context", "hook says hi"),
                                         ("file", "part one\npart two")]])

    def test_block_contents_of_an_attachment_count_their_text(self):
        self.main.attachment("file", [[{"type": "text", "text": "abc"}]])
        self.assertEqual(self.items(), [[("file", "abc")]])

    def test_a_visible_entry_between_them_starts_a_new_group(self):
        self.main.attachment("date", "today")
        self.main.user("go")
        self.main.attachment("date", "tomorrow")
        self.assertEqual(self.items(), [[("date", "today")], [("date", "tomorrow")]])

    def test_tool_results_do_not_split_a_group(self):
        self.main.assistant("m1", [tool_use_block("t1", "Read")], usage(output=1))
        self.main.attachment("date", "today")
        self.main.tool_result("t1", "ok")
        self.main.attachment("model", "sonnet")
        self.assertEqual(self.items(), [[("date", "today"), ("model", "sonnet")]])

    def test_the_token_reminder_is_folded_into_the_next_calls_usage(self):
        self.main.assistant("m1", [tool_use_block("t1", "Read")], usage(output=1))
        self.main.attachment("total_tokens_reminder", "r" * 86)
        self.main.tool_result("t1", "ok")
        self.main.assistant("m2", [text_block("done")], usage(output=1))
        entries = conversation.conversation(self.main.path, PRICES)
        self.assertEqual([entry.kind for entry in entries], ["tool", "text"])
        self.assertEqual([entry.reminder_chars for entry in entries], [0, 86])

    def test_only_the_reminder_leaves_a_group(self):
        self.main.attachment("total_tokens_reminder", "r" * 86)
        self.main.attachment("date", "today")
        self.assertEqual(self.items(), [[("date", "today")]])

    def test_an_injected_entry_has_the_time_of_its_first_item(self):
        self.main.at(datetime(2026, 9, 1, 12, 0, tzinfo=UTC)).attachment("date", "today")
        self.main.attachment("model", "sonnet")
        entry = conversation.conversation(self.main.path, PRICES)[0]
        self.assertEqual(entry.timestamp, datetime(2026, 9, 1, 12, 0, tzinfo=UTC))

    def test_long_injected_text_is_cut_with_its_full_length(self):
        self.main.attachment("instructions", "x" * 30_000)
        item = conversation.conversation(self.main.path, PRICES)[0].items[0]
        self.assertEqual((len(item.text), item.chars), (conversation.CHAT_TEXT_LIMIT, 30_000))

    def test_a_tool_call_with_its_result(self):
        self.main.assistant("m1", [tool_use_block("t1", "Bash", {"command": "make test", "timeout": 60})],
                            usage(output=1))
        self.main.tool_result("t1", "OK", is_error=False)
        entry = conversation.conversation(self.main.path, PRICES)[0]
        self.assertEqual((entry.kind, entry.tool, entry.summary, entry.result, entry.is_error),
                         ("tool", "Bash", "make test", "OK", False))

    def test_a_calls_input_comes_split_into_its_fields(self):
        self.main.assistant("m1", [tool_use_block("t1", "Bash", {"command": "make test", "description": "Run tests",
                                                                 "timeout": 60})], usage(output=1))
        fields = conversation.conversation(self.main.path, PRICES)[0].tool_fields
        self.assertEqual(fields, (conversation.ToolField("command", "make test", 9, False),
                                  conversation.ToolField("description", "Run tests", 9, False),
                                  conversation.ToolField("timeout", "60", 2, True)))

    def test_structured_values_are_json(self):
        self.main.assistant("m1", [tool_use_block("t1", "mcp__srv__find", {"filter": {"kind": "fn", "limit": 3},
                                                                           "names": ["a", "b"]})], usage(output=1))
        fields = conversation.conversation(self.main.path, PRICES)[0].tool_fields
        self.assertEqual([(field.name, field.is_json) for field in fields], [("filter", True), ("names", True)])
        self.assertEqual(json.loads(fields[0].value), {"kind": "fn", "limit": 3})

    def test_an_input_that_is_no_object_is_one_json_field(self):
        self.main.assistant("m1", [tool_use_block("t1", "Odd", None)], usage(output=1))
        self.main.path.write_text("", encoding="utf-8")
        self.main.bare({"type": "assistant", "timestamp": "2026-09-01T12:00:00.000Z", "message": {
            "id": "m1", "model": "claude-sonnet-5", "usage": usage(output=1),
            "content": [{"type": "tool_use", "id": "t1", "name": "Odd", "input": [1, 2]}]}})
        fields = conversation.conversation(self.main.path, PRICES)[0].tool_fields
        self.assertEqual(fields, (conversation.ToolField("input", "[\n  1,\n  2\n]", 12, True),))

    def test_a_failed_call_and_one_without_a_result_yet(self):
        self.main.assistant("m1", [tool_use_block("t1", "Read", {"file_path": "/x"}),
                                   tool_use_block("t2", "mcp__srv__find", {"query": "q"})], usage(output=1))
        self.main.tool_result("t1", "no such file", is_error=True)
        first, second = conversation.conversation(self.main.path, PRICES)
        self.assertEqual((first.summary, first.is_error), ("/x", True))
        self.assertEqual((second.tool, second.summary, second.result), ("srv.find", "q", None))

    def test_result_blocks_show_their_text_and_mark_images(self):
        self.main.assistant("m1", [tool_use_block("t1", "Read")], usage(output=1))
        self.main.tool_result("t1", [{"type": "text", "text": "abc"}, {"type": "image", "source": {}}])
        self.assertEqual(conversation.conversation(self.main.path, PRICES)[0].result, "abc\n[image]")

    def test_long_inputs_and_results_are_cut_with_their_full_length(self):
        self.main.assistant("m1", [tool_use_block("t1", "Write", {"content": "x" * 10000})], usage(output=1))
        self.main.tool_result("t1", "y" * 10000)
        entry = conversation.conversation(self.main.path, PRICES)[0]
        self.assertEqual((len(entry.result), entry.result_chars), (conversation.CHAT_TOOL_LIMIT, 10000))
        content = entry.tool_fields[0]
        self.assertEqual((content.name, len(content.value), content.chars), ("content", conversation.CHAT_TOOL_LIMIT,
                                                                             10000))

    def test_each_field_is_cut_on_its_own(self):
        self.main.assistant("m1", [tool_use_block("t1", "Write", {"content": "x" * 10000, "file_path": "/a.py"})],
                            usage(output=1))
        fields = conversation.conversation(self.main.path, PRICES)[0].tool_fields
        self.assertEqual(fields[1], conversation.ToolField("file_path", "/a.py", 5, False))

    def test_only_thinking_with_text_is_shown(self):
        self.main.assistant("m1", [{"type": "thinking", "thinking": "", "signature": "s"},
                                   {"type": "thinking", "thinking": "Let me see.", "signature": "s"}],
                            usage(output=1))
        self.assertEqual(self.entries(), [("thinking", "Let me see.")])

    def test_compactions_and_api_errors_are_markers(self):
        self.main.compaction()
        self.main.user("The summary of everything so far", isCompactSummary=True)
        self.main.api_error("e1")
        self.main.record("system", subtype="local_command", content="<command-name>/clear</command-name>")
        self.assertEqual(self.entries(), [("compaction", "Conversation compacted"), ("injected", None),
                                          ("error", "rate_limit (429)")])
        self.assertEqual(self.items(), [[("summary", "The summary of everything so far")]])

    def test_a_compaction_carries_its_metadata(self):
        self.main.compaction(trigger="auto", pre_tokens=170_000, post_tokens=9_000, duration_ms=41_000)
        marker = conversation.conversation(self.main.path, PRICES)[0].compaction
        self.assertEqual(marker, conversation.CompactionMarker("auto", 170_000, 9_000, 41_000))

    def test_a_compaction_without_metadata_has_none(self):
        self.main.compaction(trigger=None)
        marker = conversation.conversation(self.main.path, PRICES)[0].compaction
        self.assertEqual(marker, conversation.CompactionMarker(None, None, None, None))

    def test_a_missing_file_raises(self):
        with self.assertRaises(OSError):
            conversation.conversation(self.main.path.with_name("gone.jsonl"), PRICES)

    def test_replies_carry_their_effort_level(self):
        self.main.assistant("m1", [text_block("a"), tool_use_block("t1", "Read")], usage(output=5), effort="max")
        self.assertEqual([entry.effort for entry in conversation.conversation(self.main.path, PRICES)], ["max", "max"])

    def test_the_last_entry_of_a_reply_carries_its_final_usage(self):
        self.main.user("hi")
        self.main.assistant("m1", [thinking_block("hm"), text_block("a"), tool_use_block("t1", "Read")],
                            usage(new=10, cache_5m=100, cache_read=1000, output=50), effort="high")
        self.main.tool_result("t1", "ok")
        self.main.assistant("m2", [text_block("done")],
                            dict(usage(output=7), server_tool_use={"web_search_requests": 2}))
        entries = conversation.conversation(self.main.path, PRICES)
        self.assertEqual([entry.usage is not None for entry in entries], [False, False, False, True, True])
        first = entries[3].usage
        self.assertEqual((first.new_input, first.cache_write_5m, first.cache_read, first.output, first.model,
                          first.effort), (10, 100, 1000, 50, DEFAULT_MODEL, "high"))
        self.assertEqual((entries[4].usage.output, entries[4].usage.web_searches), (7, 2))

    def test_api_errors_carry_no_usage(self):
        self.main.api_error("e1")
        self.assertIsNone(conversation.conversation(self.main.path, PRICES)[0].usage)


class StepTest(TempDirTestCase):
    def setUp(self):
        super().setUp()
        self.main = self.projects.session("s1")

    def steps(self):
        """The step of each entry that carries a call's usage."""
        return [entry.step for entry in conversation.conversation(self.main.path, PRICES) if entry.usage]

    def test_each_call_carries_its_growth(self):
        self.main.assistant("m1", [text_block("a")], usage(new=10, cache_5m=20_000, output=100))
        self.main.assistant("m2", [text_block("b")], usage(new=5, cache_5m=1_000, cache_read=20_010, output=50))
        self.assertEqual([step.growth for step in self.steps()], [None, 21_015 - 20_010 - 100])

    def test_a_cache_rebuild_with_its_cause_and_extra_cost(self):
        self.main.assistant("m1", [text_block("a")], usage(new=10, cache_5m=20_000, output=100))
        self.main.user("go on")
        self.main.assistant("m2", [text_block("b")], usage(new=5, cache_5m=20_000, cache_read=1_000, output=50))
        rebuild = self.steps()[1].rebuild
        self.assertEqual((rebuild.cause, rebuild.lost), ("prefix", 19_010))
        self.assertAlmostEqual(rebuild.extra_cost, 19_010 * (2.5 - 0.2) / MILLION)

    def test_the_request_time_tells_an_idle_rebuild(self):
        start = datetime(2026, 9, 1, 12, 0, tzinfo=UTC)
        self.main.at(start).assistant("m1", [text_block("a")], usage(cache_5m=20_000))
        self.main.at(start.replace(minute=10)).user("back again")
        self.main.at(start.replace(minute=10, second=5)).assistant("m2", [text_block("b")], usage(cache_5m=20_000))
        self.assertEqual(self.steps()[1].rebuild.cause, "idle")

    def test_the_first_call_after_a_compaction_has_no_growth(self):
        start = datetime(2026, 9, 1, 12, 0, tzinfo=UTC)
        self.main.at(start).assistant("m1", [text_block("a")], usage(cache_5m=20_000, output=100))
        self.main.at(start.replace(minute=1)).compaction()
        self.main.at(start.replace(minute=2)).assistant("m2", [text_block("b")], usage(cache_5m=3_000))
        self.assertEqual(self.steps()[1], conversation.turns.Step(None, None))

    def test_a_call_without_a_shown_entry_still_counts_for_the_next(self):
        self.main.assistant("m1", [text_block("a")], usage(cache_5m=20_000, output=100))
        self.main.assistant("m2", [{"type": "thinking", "thinking": "", "signature": "s"}],
                            usage(cache_5m=500, cache_read=20_000, output=10))
        self.main.assistant("m3", [text_block("c")], usage(cache_5m=100, cache_read=20_500, output=10))
        self.assertEqual([step.growth for step in self.steps()], [None, 20_600 - 20_500 - 10])



if __name__ == "__main__":
    unittest.main()
