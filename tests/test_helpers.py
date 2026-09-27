"""The test helpers write transcripts in the layout and record format the parser relies on."""
import json
import unittest

from helpers import TMP_DIR
from helpers import TempDirTestCase
from helpers import slug
from helpers import text_block
from helpers import tool_use_block
from helpers import usage


def read_lines(path):
    """The JSON records of a transcript file."""
    return [json.loads(line) for line in path.read_text(encoding="utf-8").splitlines()]


class LayoutTest(TempDirTestCase):
    def test_temp_dirs_are_under_tests_tmp(self):
        self.assertTrue(self.tmp.is_relative_to(TMP_DIR))
        self.assertTrue(self.projects.root.is_relative_to(self.tmp))

    def test_main_session_path(self):
        transcript = self.projects.session("s1", project="/home/dev/my.app")
        self.assertEqual(transcript.path, self.projects.root / "-home-dev-my-app" / "s1.jsonl")

    def test_subagent_path_and_meta(self):
        transcript = self.projects.subagent("s1", "a1", meta={"agentType": "Explore"})
        self.assertEqual(transcript.path.name, "agent-a1.jsonl")
        self.assertEqual(transcript.path.parent.name, "subagents")
        meta = json.loads(transcript.path.with_name("agent-a1.meta.json").read_text(encoding="utf-8"))
        self.assertEqual(meta["agentType"], "Explore")
        self.assertEqual(meta["spawnDepth"], 1)

    def test_subagent_without_meta(self):
        transcript = self.projects.subagent("s1", "a1", meta=False)
        self.assertFalse(transcript.path.with_name("agent-a1.meta.json").exists())

    def test_slug(self):
        self.assertEqual(slug("/home/x/repo_1"), "-home-x-repo-1")


class RecordTest(TempDirTestCase):
    def test_assistant_message_is_one_record_per_block_with_final_usage_last(self):
        transcript = self.projects.session("s1")
        transcript.assistant("m1", [text_block("hi"), tool_use_block("t1", "Read")], usage(new=5, output=40))
        records = read_lines(transcript.path)
        self.assertEqual([record["message"]["id"] for record in records], ["m1", "m1"])
        self.assertEqual([record["message"]["usage"]["output_tokens"] for record in records], [1, 40])
        self.assertEqual(len(records[0]["message"]["content"]), 1)

    def test_common_fields_and_clock(self):
        transcript = self.projects.session("s1", git_branch="dev")
        transcript.user("one")
        transcript.user("two")
        first, second = read_lines(transcript.path)
        self.assertEqual((first["sessionId"], first["cwd"], first["gitBranch"]), ("s1", "/home/dev/app", "dev"))
        self.assertEqual((first["timestamp"], second["timestamp"]),
                         ("2026-09-01T12:00:00.000Z", "2026-09-01T12:00:01.000Z"))

    def test_usage_split_and_fallback(self):
        self.assertEqual(usage(cache_5m=2, cache_1h=3)["cache_creation_input_tokens"], 5)
        self.assertNotIn("cache_creation", usage(cache_5m=2, split=False))

    def test_partial_line_has_no_newline(self):
        transcript = self.projects.session("s1")
        transcript.user("done")
        transcript.partial('{"type": "us')
        self.assertFalse(transcript.path.read_text(encoding="utf-8").endswith("\n"))

    def test_subagent_records_carry_agent_id(self):
        transcript = self.projects.subagent("s1", "a1")
        transcript.user("go")
        record = read_lines(transcript.path)[0]
        self.assertEqual((record["agentId"], record["isSidechain"], record["sessionId"]), ("a1", True, "s1"))

    def test_ai_title_has_no_timestamp(self):
        transcript = self.projects.session("s1")
        transcript.ai_title("A title")
        self.assertEqual(read_lines(transcript.path), [{"type": "ai-title", "aiTitle": "A title", "sessionId": "s1"}])

    def test_queue_operation_has_no_cwd(self):
        transcript = self.projects.session("s1")
        transcript.queue_operation()
        record = read_lines(transcript.path)[0]
        self.assertNotIn("cwd", record)
        self.assertIn("timestamp", record)

    def test_meta_and_block_prompts(self):
        transcript = self.projects.session("s1")
        meta = transcript.user("caveat", isMeta=True)
        blocks = transcript.user("hello", as_blocks=True)
        self.assertTrue(meta["isMeta"])
        self.assertEqual(blocks["message"]["content"], [{"type": "text", "text": "hello"}])

    def test_usage_without_speed(self):
        self.assertNotIn("speed", usage(speed=None))

    def test_tool_result_record(self):
        transcript = self.projects.session("s1")
        record = transcript.tool_result("t1", [{"type": "text", "text": "abc"}])
        self.assertEqual(record["message"]["content"][0]["tool_use_id"], "t1")


if __name__ == "__main__":
    unittest.main()
