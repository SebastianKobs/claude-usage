"""guard.py, project boundary: tool calls that touch a path outside the repo or a never_access path prompt, in the
main session and every subagent."""
import json
import os
import re
import sys
import unittest

from helpers import REPO
from helpers import ProjectTestCase

HOOK = ".claude/hooks/guard.py"
NEVER = "src/prod-link"                      # never_access in the fixture config


class HookCase(ProjectTestCase):
    def setUp(self):
        super().setUp()
        os.makedirs(self.project.path("src"))
        os.symlink("/usr", self.project.path(NEVER))    # stands in for a symlink to a production system
        self.slug = re.sub(r"[^A-Za-z0-9]", "-", self.project.root)
        self.scratch = f"/tmp/claude-{os.getuid()}/{self.slug}/scratchpad/x.txt"
        self.memory = f"~/.claude/projects/{self.slug}/memory/MEMORY.md"

    def run_hook(self, stdin):
        return self.project.run([sys.executable, self.project.path(HOOK)], input=stdin)

    def hook(self, tool, **tool_input):
        """Run the fixture's hook; return the permission reason, or None when the call is allowed."""
        event = {"tool_name": tool, "tool_input": tool_input, "cwd": self.project.root}
        result = self.run_hook(json.dumps(event))
        self.assertEqual(result.returncode, 0, result.stderr)
        if not result.stdout:
            return None
        output = json.loads(result.stdout)["hookSpecificOutput"]
        self.assertEqual(output["permissionDecision"], "ask")
        return output["permissionDecisionReason"]


class GuardHookTest(HookCase):
    def test_repo_file_allowed(self):
        self.assertIsNone(self.hook("Read", file_path=".claude/guard.yml"))
        self.assertIsNone(self.hook("Read", file_path=self.project.path("src/index.php")))

    def test_never_access_prompts(self):
        reason = self.hook("Read", file_path=f"{NEVER}/index.php")
        self.assertIn(f"{NEVER}/index.php", reason)
        self.assertNotIn("config not loaded", reason)

    def test_never_access_relative_in_bash_prompts(self):
        self.assertIsNotNone(self.hook("Bash", command=f"cat {NEVER}/index.php"))

    def test_session_paths_allowed(self):
        self.assertIsNone(self.hook("Write", file_path=self.scratch))
        self.assertIsNone(self.hook("Read", file_path=self.memory))

    def test_other_projects_session_paths_prompt(self):
        self.assertIsNotNone(self.hook("Read", file_path="~/.claude/projects/-other-repo/memory/MEMORY.md"))

    def test_bash_system_programs_allowed(self):
        self.assertIsNone(self.hook("Bash", command="/usr/bin/env python3 x.py 2>/dev/null"))

    def test_bash_outside_data_paths_prompt(self):
        reason = self.hook("Bash", command="cat /etc/passwd ~/.bashrc")
        self.assertIn("/etc/passwd", reason)
        self.assertIn(".bashrc", reason)

    def test_bash_parent_dir_prompts(self):
        self.assertIsNotNone(self.hook("Bash", command="ls ../"))

    def test_bash_cd_outside_then_relative_path_prompts(self):
        self.assertIsNotNone(self.hook("Bash", command="cd /etc && cat hosts"))

    def test_allowed_exact_only_for_exact_paths(self):
        self.assertIsNone(self.hook("Read", file_path="/dev/null"))
        self.assertIsNotNone(self.hook("Read", file_path="/dev/sda"))

    def test_mcp_path_argument_outside_prompts(self):
        self.assertIsNotNone(self.hook("mcp__codebase-memory-mcp__index_repository", repo_path="/var/www"))

    def test_glob_pattern_outside_prompts(self):
        self.assertIsNotNone(self.hook("Glob", pattern="/etc/**/*.conf"))

    def test_local_extra_path_keeps_session_paths(self):
        self.project.write(".claude/guard.local.yml", "hooks:\n  extra_allowed_paths: [/opt/shared]\n")
        self.assertIsNone(self.hook("Read", file_path="/opt/shared/x.md"))
        self.assertIsNone(self.hook("Write", file_path=self.scratch))

    def test_tool_input_that_is_no_mapping_is_ignored(self):
        result = self.run_hook('{"tool_name": "Read", "tool_input": []}')
        self.assertEqual((result.returncode, result.stdout, result.stderr), (0, "", ""))

    def test_unreadable_input_is_denied(self):
        for stdin in ["not json", "[]"]:
            with self.subTest(stdin=stdin):
                result = self.run_hook(stdin)
                self.assertEqual(result.returncode, 0, result.stderr)
                output = json.loads(result.stdout)["hookSpecificOutput"]
                self.assertEqual(output["permissionDecision"], "deny")

    def test_configured_list_replaces_the_default(self):
        self.project.write(".claude/guard.local.yml", "hooks:\n  session_paths: []\n")
        self.assertIsNotNone(self.hook("Write", file_path=self.scratch))

    def test_key_without_value_keeps_the_default(self):
        self.project.write(".claude/guard.local.yml", "hooks:\n  session_paths:\n")
        self.assertIsNone(self.hook("Write", file_path=self.scratch))

    def test_malformed_hooks_section_prompts_instead_of_crashing(self):
        self.project.write(".claude/guard.local.yml", "hooks:\n  session_paths: 5\n")
        self.assertIn("guard error", self.hook("Read", file_path=".claude/guard.yml"))


class ProjectDirTest(HookCase):
    """The project directory is $CLAUDE_PROJECT_DIR, or else the directory two levels above the hook."""

    def decision(self, env, path):
        event = {"tool_name": "Read", "tool_input": {"file_path": path}, "cwd": self.project.root}
        result = self.project.run([sys.executable, self.project.path(HOOK)], input=json.dumps(event), env=env)
        self.assertEqual(result.returncode, 0, result.stderr)
        return result.stdout

    def test_without_the_variable_the_hook_location_counts(self):
        self.assertEqual(self.decision({"CLAUDE_PROJECT_DIR": None}, self.project.path("a.txt")), "")

    def test_the_variable_wins_over_the_hook_location(self):
        other = self.project.path("src")
        self.assertEqual(self.decision({"CLAUDE_PROJECT_DIR": other}, self.project.path("src/a.txt")), "")
        self.assertIn('"ask"', self.decision({"CLAUDE_PROJECT_DIR": other}, self.project.path("a.txt")))


class RegistrationTest(unittest.TestCase):
    def test_settings_register_the_one_guard_for_every_checked_tool(self):
        with open(os.path.join(REPO, ".claude", "settings.json"), encoding="utf-8") as settings_file:
            entries = json.load(settings_file)["hooks"]["PreToolUse"]
        commands = [hook["command"] for entry in entries for hook in entry["hooks"]]
        self.assertEqual(commands, ['python3 "$CLAUDE_PROJECT_DIR/.claude/hooks/guard.py"'])
        matcher = entries[0]["matcher"]
        for tool in ("Bash", "Read", "Write", "Edit", "MultiEdit", "NotebookEdit", "Glob", "Grep", "mcp__x"):
            with self.subTest(tool=tool):
                self.assertRegex(tool, f"^(?:{matcher})$")


class GuardHookWithoutConfigTest(HookCase):
    config = False

    def test_repo_file_allowed(self):
        self.assertIsNone(self.hook("Read", file_path=".claude/guard.yml"))

    def test_symlink_out_of_repo_still_prompts(self):
        self.assertIsNotNone(self.hook("Read", file_path=f"{NEVER}/index.php"))

    def test_default_session_paths_allowed(self):
        self.assertIsNone(self.hook("Write", file_path=self.scratch))
        self.assertIsNone(self.hook("Read", file_path=self.memory))

    def test_outside_prompt_says_nothing_about_the_config(self):
        self.assertNotIn("config not loaded", self.hook("Read", file_path="/etc/hosts"))

    def test_without_config_files_pyyaml_is_not_needed(self):
        self.project.write(".claude/hooks/yaml.py", "raise ImportError('no yaml')\n")   # shadows PyYAML
        self.assertIsNone(self.hook("Write", file_path=self.scratch))

    def test_missing_pyyaml_is_reported(self):
        self.project.write(".claude/hooks/yaml.py", "raise ImportError('no yaml')\n")
        self.project.write(".claude/guard.yml", "hooks:\n  allowed_exact: [/etc/hosts]\n")
        self.assertIn("guard config not loaded: PyYAML not installed", self.hook("Read", file_path="/etc/hosts"))

    def test_invalid_yaml_is_reported(self):
        self.project.write(".claude/guard.yml", "shared: [unclosed\n")
        self.assertIn("guard config not loaded: .claude/guard.yml", self.hook("Read", file_path="/etc/hosts"))


if __name__ == "__main__":
    unittest.main()
