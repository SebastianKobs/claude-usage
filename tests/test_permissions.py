"""permissions.py: the permission prompt a PermissionRequest hook's input describes, as names, ids and times only."""
import dataclasses
import json
import unittest
from datetime import UTC
from datetime import datetime

from claude_usage import permissions

NOW = datetime(2026, 9, 29, 19, 9, 35, 413_000, tzinfo=UTC)


def hook_input(**fields):
    """A PermissionRequest hook's input as Claude Code sends it (checked 2026-09-29), updated by fields."""
    given = {"session_id": "s1", "transcript_path": "/home/dev/.claude/projects/-app/s1.jsonl", "cwd": "/app",
             "permission_mode": "auto", "hook_event_name": "PermissionRequest", "tool_name": "Bash",
             "tool_input": {"command": "cat ~/.ssh/id_rsa"}, "prompt_id": "p1", "effort": {"level": "high"}}
    given.update(fields)
    return json.dumps(given)


class PromptOfTest(unittest.TestCase):
    def test_a_prompt_has_its_session_tool_mode_and_time(self):
        self.assertEqual(permissions.prompt_of(hook_input(), NOW),
                         permissions.Prompt("2026-09-29T19:09:35.413+00:00", "s1", None, "Bash", "auto"))

    def test_the_calls_input_is_never_kept(self):
        # it holds commands and paths, as the store never does
        prompt = permissions.prompt_of(hook_input(), NOW)
        self.assertNotIn("ssh", json.dumps(dataclasses.asdict(prompt)))

    def test_a_subagents_prompt_carries_its_agent(self):
        # the transcript_path is the main thread's even then: only agent_id tells them apart
        prompt = permissions.prompt_of(hook_input(agent_id="a1", agent_type="general-purpose"), NOW)
        self.assertEqual(prompt.agent_id, "a1")

    def test_an_mcp_tool_is_named_as_the_store_names_it(self):
        self.assertEqual(permissions.prompt_of(hook_input(tool_name="mcp__github__create_issue"), NOW).tool,
                         "github.create_issue")

    def test_other_events_and_inputs_without_a_session_or_tool_describe_none(self):
        for text in (hook_input(hook_event_name="Notification"), hook_input(session_id=None),
                     hook_input(tool_name=""), "not json", "[]", ""):
            with self.subTest(text=text):
                self.assertIsNone(permissions.prompt_of(text, NOW))

    def test_an_agent_id_that_is_no_text_counts_as_the_main_thread(self):
        self.assertIsNone(permissions.prompt_of(hook_input(agent_id=7), NOW).agent_id)
