"""conversation.py: a transcript's conversation as the session view shows it, read from the file on demand."""
import json
import unittest
from datetime import UTC
from datetime import datetime

from claude_usage import conversation
from helpers import DEFAULT_MODEL
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
        return [(entry.kind, entry.text) for entry in conversation.conversation(self.main.path)]

    def test_prompts_and_replies_in_order_with_their_time(self):
        self.main.at(datetime(2026, 9, 1, 12, 0, tzinfo=UTC)).user("Fix the parser")
        self.main.assistant("m1", [text_block("Looking."), text_block("Done.")], usage(output=5))
        self.main.user("thanks", as_blocks=True)
        entries = conversation.conversation(self.main.path)
        self.assertEqual([(entry.kind, entry.text) for entry in entries],
                         [("prompt", "Fix the parser"), ("text", "Looking."), ("text", "Done."), ("prompt", "thanks")])
        self.assertEqual(entries[0].timestamp, datetime(2026, 9, 1, 12, 0, tzinfo=UTC))
        self.assertEqual(entries[1].model, DEFAULT_MODEL)

    def test_injected_user_records_are_skipped(self):
        self.main.user("skill text", isMeta=True)
        self.main.user("more skill text", sourceToolUseID="toolu_1")
        self.main.user("real prompt")
        self.assertEqual(self.entries(), [("prompt", "real prompt")])

    def test_a_tool_call_with_its_result(self):
        self.main.assistant("m1", [tool_use_block("t1", "Bash", {"command": "make test", "timeout": 60})],
                            usage(output=1))
        self.main.tool_result("t1", "OK", is_error=False)
        entry = conversation.conversation(self.main.path)[0]
        self.assertEqual((entry.kind, entry.tool, entry.summary, entry.result, entry.is_error),
                         ("tool", "Bash", "make test", "OK", False))

    def test_a_calls_input_comes_split_into_its_fields(self):
        self.main.assistant("m1", [tool_use_block("t1", "Bash", {"command": "make test", "description": "Run tests",
                                                                 "timeout": 60})], usage(output=1))
        fields = conversation.conversation(self.main.path)[0].tool_fields
        self.assertEqual(fields, (conversation.ToolField("command", "make test", 9, False),
                                  conversation.ToolField("description", "Run tests", 9, False),
                                  conversation.ToolField("timeout", "60", 2, True)))

    def test_structured_values_are_json(self):
        self.main.assistant("m1", [tool_use_block("t1", "mcp__srv__find", {"filter": {"kind": "fn", "limit": 3},
                                                                           "names": ["a", "b"]})], usage(output=1))
        fields = conversation.conversation(self.main.path)[0].tool_fields
        self.assertEqual([(field.name, field.is_json) for field in fields], [("filter", True), ("names", True)])
        self.assertEqual(json.loads(fields[0].value), {"kind": "fn", "limit": 3})

    def test_an_input_that_is_no_object_is_one_json_field(self):
        self.main.assistant("m1", [tool_use_block("t1", "Odd", None)], usage(output=1))
        self.main.path.write_text("", encoding="utf-8")
        self.main.bare({"type": "assistant", "timestamp": "2026-09-01T12:00:00.000Z", "message": {
            "id": "m1", "model": "claude-sonnet-5", "usage": usage(output=1),
            "content": [{"type": "tool_use", "id": "t1", "name": "Odd", "input": [1, 2]}]}})
        fields = conversation.conversation(self.main.path)[0].tool_fields
        self.assertEqual(fields, (conversation.ToolField("input", "[\n  1,\n  2\n]", 12, True),))

    def test_a_failed_call_and_one_without_a_result_yet(self):
        self.main.assistant("m1", [tool_use_block("t1", "Read", {"file_path": "/x"}),
                                   tool_use_block("t2", "mcp__srv__find", {"query": "q"})], usage(output=1))
        self.main.tool_result("t1", "no such file", is_error=True)
        first, second = conversation.conversation(self.main.path)
        self.assertEqual((first.summary, first.is_error), ("/x", True))
        self.assertEqual((second.tool, second.summary, second.result), ("srv.find", "q", None))

    def test_result_blocks_show_their_text_and_mark_images(self):
        self.main.assistant("m1", [tool_use_block("t1", "Read")], usage(output=1))
        self.main.tool_result("t1", [{"type": "text", "text": "abc"}, {"type": "image", "source": {}}])
        self.assertEqual(conversation.conversation(self.main.path)[0].result, "abc\n[image]")

    def test_long_inputs_and_results_are_cut_with_their_full_length(self):
        self.main.assistant("m1", [tool_use_block("t1", "Write", {"content": "x" * 10000})], usage(output=1))
        self.main.tool_result("t1", "y" * 10000)
        entry = conversation.conversation(self.main.path)[0]
        self.assertEqual((len(entry.result), entry.result_chars), (conversation.CHAT_TOOL_LIMIT, 10000))
        content = entry.tool_fields[0]
        self.assertEqual((content.name, len(content.value), content.chars), ("content", conversation.CHAT_TOOL_LIMIT,
                                                                             10000))

    def test_each_field_is_cut_on_its_own(self):
        self.main.assistant("m1", [tool_use_block("t1", "Write", {"content": "x" * 10000, "file_path": "/a.py"})],
                            usage(output=1))
        fields = conversation.conversation(self.main.path)[0].tool_fields
        self.assertEqual(fields[1], conversation.ToolField("file_path", "/a.py", 5, False))

    def test_only_thinking_with_text_is_shown(self):
        self.main.assistant("m1", [{"type": "thinking", "thinking": "", "signature": "s"},
                                   {"type": "thinking", "thinking": "Let me see.", "signature": "s"}],
                            usage(output=1))
        self.assertEqual(self.entries(), [("thinking", "Let me see.")])

    def test_compactions_and_api_errors_are_markers(self):
        self.main.record("system", subtype="compact_boundary", content="Conversation compacted")
        self.main.user("The summary of everything so far", isCompactSummary=True)
        self.main.api_error("e1")
        self.main.record("system", subtype="local_command", content="<command-name>/clear</command-name>")
        self.assertEqual(self.entries(), [("compaction", "Conversation compacted"), ("error", "rate_limit (429)")])

    def test_a_missing_file_raises(self):
        with self.assertRaises(OSError):
            conversation.conversation(self.main.path.with_name("gone.jsonl"))

    def test_replies_carry_their_effort_level(self):
        self.main.assistant("m1", [text_block("a"), tool_use_block("t1", "Read")], usage(output=5), effort="max")
        self.assertEqual([entry.effort for entry in conversation.conversation(self.main.path)], ["max", "max"])

    def test_the_last_entry_of_a_reply_carries_its_final_usage(self):
        self.main.user("hi")
        self.main.assistant("m1", [thinking_block("hm"), text_block("a"), tool_use_block("t1", "Read")],
                            usage(new=10, cache_5m=100, cache_read=1000, output=50), effort="high")
        self.main.tool_result("t1", "ok")
        self.main.assistant("m2", [text_block("done")],
                            dict(usage(output=7), server_tool_use={"web_search_requests": 2}))
        entries = conversation.conversation(self.main.path)
        self.assertEqual([entry.usage is not None for entry in entries], [False, False, False, True, True])
        first = entries[3].usage
        self.assertEqual((first.new_input, first.cache_write_5m, first.cache_read, first.output, first.model,
                          first.effort), (10, 100, 1000, 50, DEFAULT_MODEL, "high"))
        self.assertEqual((entries[4].usage.output, entries[4].usage.web_searches), (7, 2))

    def test_api_errors_carry_no_usage(self):
        self.main.api_error("e1")
        self.assertIsNone(conversation.conversation(self.main.path)[0].usage)



if __name__ == "__main__":
    unittest.main()
