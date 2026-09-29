"""secret_paths.py: which paths a tool call names, and which of them match a possible secret location."""
import unittest

from claude_usage import config
from claude_usage import secret_paths

HOME = "/home/dev"
PATTERNS = (".env", ".env.*", "!.env.example", "*.pem", "id_rsa", "~/.ssh", "~/.aws", "~/.claude/.credentials.json",
            "/mnt/?/Users/*/.ssh")


def matching(path, cwd=None, patterns=PATTERNS):
    """The pattern the path matches, with the test's home."""
    return secret_paths.matching_pattern(path, patterns, HOME, cwd)


class MatchingPatternTest(unittest.TestCase):
    def test_a_name_matches_anywhere_in_the_path(self):
        self.assertEqual(matching("/srv/app/.env"), ".env")
        self.assertEqual(matching("config/.env"), ".env")
        self.assertEqual(matching("/srv/app/.env.local"), ".env.*")
        self.assertEqual(matching("certs/server.pem"), "*.pem")

    def test_a_name_matches_a_folder_too(self):
        self.assertEqual(matching("/srv/.env/values"), ".env")

    def test_a_negated_pattern_exempts_what_it_matches(self):
        self.assertIsNone(matching("/srv/app/.env.example"))

    def test_a_later_pattern_matches_again_after_a_negation(self):
        self.assertEqual(matching(".env.example", patterns=(".env.*", "!.env.example", ".env.example")),
                         ".env.example")

    def test_other_files_match_nothing(self):
        for path in ("/srv/app/main.go", "README.md", ".environment", "id_rsa.pub", "/home/dev/.sshx"):
            with self.subTest(path=path):
                self.assertIsNone(matching(path))

    def test_a_home_pattern_matches_the_folder_and_everything_in_it(self):
        self.assertEqual(matching("/home/dev/.ssh"), "~/.ssh")
        self.assertEqual(matching("/home/dev/.ssh/config"), "~/.ssh")
        self.assertEqual(matching("/home/dev/.claude/.credentials.json"), "~/.claude/.credentials.json")

    def test_a_home_pattern_needs_the_home_folder(self):
        self.assertIsNone(matching("/srv/.ssh/config"))

    def test_the_home_may_be_written_as_a_tilde_or_the_variable(self):
        for path in ("~/.aws/credentials", "$HOME/.aws/credentials", "${HOME}/.aws/credentials"):
            with self.subTest(path=path):
                self.assertEqual(matching(path), "~/.aws")

    def test_a_relative_path_counts_from_the_working_folder(self):
        self.assertEqual(matching(".ssh/id_ed25519", cwd="/home/dev"), "~/.ssh")
        self.assertEqual(matching("../.aws/config", cwd="/home/dev/app"), "~/.aws")

    def test_an_absolute_pattern_matches_with_wildcards_per_part(self):
        self.assertEqual(matching("/mnt/c/Users/dev/.ssh/id_rsa"), "/mnt/?/Users/*/.ssh")
        self.assertIsNone(matching("/mnt/cd/Users/dev/.ssh/known"))

    def test_backslashes_count_as_slashes(self):
        self.assertEqual(matching("C:\\Users\\dev\\app\\.env"), ".env")


class CallPathsTest(unittest.TestCase):
    def paths(self, name, tool_input):
        """The paths the call names."""
        return secret_paths.call_paths(name, tool_input)

    def test_a_file_tool_names_its_file(self):
        self.assertEqual(self.paths("Read", {"file_path": "/srv/.env", "limit": 5}), ["/srv/.env"])
        self.assertEqual(self.paths("NotebookEdit", {"notebook_path": "a.ipynb", "new_source": "~/.ssh"}),
                         ["a.ipynb"])

    def test_text_a_call_writes_names_no_path(self):
        self.assertEqual(self.paths("Edit", {"file_path": "a.md", "old_string": ".env", "new_string": "id_rsa"}),
                         ["a.md"])

    def test_a_search_names_its_folder_and_glob_but_not_its_pattern(self):
        self.assertEqual(self.paths("Grep", {"pattern": "id_rsa", "path": "/srv", "glob": "*.pem"}), ["/srv", "*.pem"])
        self.assertEqual(self.paths("Glob", {"pattern": "**/*.pem", "path": "/srv"}), ["**/*.pem", "/srv"])

    def test_any_other_tool_names_the_inputs_that_hold_paths(self):
        tool_input = {"relative_path": "a/.env", "paths": ["b", "c"], "query": ".env", "root": "/srv", "limit": 3}
        self.assertEqual(self.paths("mcp__code__read", tool_input), ["a/.env", "b", "c", "/srv"])

    def test_a_command_names_its_words(self):
        self.assertEqual(self.paths("Bash", {"command": "cat ~/.aws/credentials | head -5 > out.txt"}),
                         ["cat", "~/.aws/credentials", "head", "out.txt"])

    def test_an_options_value_counts_but_not_the_option(self):
        self.assertEqual(self.paths("Bash", {"command": "docker run --env-file=.env app"}),
                         ["docker", "run", ".env", "app"])

    def test_quoted_text_counts_only_where_it_holds_a_path(self):
        self.assertEqual(self.paths("Bash", {"command": "git commit -m 'load .env' && cat \"/srv/.env\""}),
                         ["git", "commit", "cat", "/srv/.env"])

    def test_a_url_is_no_path(self):
        self.assertEqual(self.paths("Bash", {"command": "curl https://example.com/.env"}), ["curl"])

    def test_a_heredoc_written_to_a_file_names_no_path(self):
        command = "cat > notes.md <<'EOF'\nkeep keys out of ~/.ssh/config\nEOF"
        self.assertEqual(self.paths("Bash", {"command": command}), ["cat", "notes.md"])

    def test_an_inline_scripts_heredoc_names_its_quoted_paths(self):
        command = "python3 - <<'EOF'\nprint(open('/home/dev/.aws/credentials').read(), 'x')\nEOF"
        self.assertEqual(self.paths("Bash", {"command": command}), ["python3", "/home/dev/.aws/credentials"])

    def test_a_variable_set_in_the_command_is_expanded(self):
        self.assertIn("~/.ssh/id_rsa", self.paths("Bash", {"command": "D=~/.ss; cat ${D}h/id_rsa"}))
        self.assertIn("~/.ssh/id_rsa", self.paths("Bash", {"command": "export D=~/.ssh; cat $D/id_rsa"}))

    def test_a_quoted_value_is_expanded_too(self):
        command = 'K="$HOME/.aws"; cat "$K/credentials"'
        self.assertIn("$HOME/.aws/credentials", self.paths("Bash", {"command": command}))

    def test_single_quoted_text_is_not_expanded(self):
        self.assertIn("$F/y", self.paths("Bash", {"command": "F=x; echo '$F/y'"}))

    def test_a_longer_name_is_another_variable(self):
        self.assertIn("$Dh", self.paths("Bash", {"command": "D=~/.ssh; cat $Dh"}))

    def test_an_option_is_no_assignment(self):
        self.assertEqual(self.paths("Bash", {"command": "cut --delimiter=x $delimiter"}),
                         ["cut", "x", "$delimiter"])

    def test_a_word_counts_once(self):
        self.assertEqual(self.paths("Bash", {"command": "cat .env .env"}), ["cat", ".env"])


class SecretMatchesTest(unittest.TestCase):
    def test_each_path_that_matches_with_its_pattern(self):
        matches = secret_paths.secret_matches("Bash", {"command": "cp .env ~/.ssh/backup && ls"}, PATTERNS, HOME,
                                              "/srv/app")
        self.assertEqual(matches, [(".env", ".env"), ("~/.ssh/backup", "~/.ssh")])

    def test_a_finder_starts_a_scan_with_its_patterns_and_home(self):
        scan = secret_paths.finder(PATTERNS, HOME)()
        self.assertEqual(scan("Read", {"file_path": ".ssh/config"}, "/home/dev"), [(".ssh/config", "~/.ssh", None)])

    def test_each_scan_starts_without_the_files_another_one_saw_written(self):
        start = secret_paths.finder(PATTERNS, HOME)
        start()("Write", {"file_path": "/srv/a.py", "content": "open('/home/dev/.aws/x')"}, "/srv")
        self.assertEqual(start()("Bash", {"command": "python a.py"}, "/srv"), [])

    def test_without_patterns_nothing_matches(self):
        self.assertEqual(secret_paths.secret_matches("Read", {"file_path": ".env"}, (), HOME, None), [])


class ScriptTest(unittest.TestCase):
    """A script the transcript wrote, and later ran: its text is scanned as the command's."""

    def setUp(self):
        self.scan = secret_paths.TranscriptScan(PATTERNS, HOME)

    def run_calls(self, *calls, cwd="/srv/app"):
        """What the scan found in the last of these calls (name, input)."""
        found = None
        for name, tool_input in calls:
            found = self.scan(name, tool_input, cwd)
        return found

    def test_a_script_run_names_the_paths_in_its_code(self):
        found = self.run_calls(("Write", {"file_path": "/srv/app/deploy.py",
                                          "content": "keys = open('/home/dev/.aws/credentials').read()\n"}),
                               ("Bash", {"command": "python3 deploy.py --dry-run"}))
        self.assertEqual(found, [("/home/dev/.aws/credentials", "~/.aws", "deploy.py")])

    def test_writing_a_script_names_no_path_in_it(self):
        found = self.run_calls(("Write", {"file_path": "/srv/app/deploy.py", "content": "open('/home/dev/.ssh/x')"}))
        self.assertEqual(found, [])

    def test_a_shell_script_is_scanned_like_a_command(self):
        write = ("Write", {"file_path": "run.sh", "content": "#!/bin/sh\nD=~/.ssh\ncat $D/id_rsa\n"})
        cases = {"bash run.sh": "run.sh", "./run.sh": "./run.sh", "sh /srv/app/run.sh": "/srv/app/run.sh",
                 "source run.sh && make": "run.sh"}
        for command, via in cases.items():
            with self.subTest(command=command):
                self.assertEqual(self.run_calls(write, ("Bash", {"command": command})),
                                 [("~/.ssh", "~/.ssh", via), ("~/.ssh/id_rsa", "~/.ssh", via)])

    def test_an_edit_adds_its_new_text(self):
        found = self.run_calls(("Write", {"file_path": "a.py", "content": "print(1)"}),
                               ("Edit", {"file_path": "/srv/app/a.py", "old_string": "print(1)",
                                         "new_string": "print(open('/home/dev/.ssh/config').read())"}),
                               ("Bash", {"command": "python a.py"}))
        self.assertEqual(found, [("/home/dev/.ssh/config", "~/.ssh", "a.py")])

    def test_a_write_replaces_what_was_written(self):
        found = self.run_calls(("Write", {"file_path": "a.py", "content": "open('/home/dev/.ssh/config')"}),
                               ("Write", {"file_path": "a.py", "content": "print(1)"}),
                               ("Bash", {"command": "python a.py"}))
        self.assertEqual(found, [])

    def test_viewing_a_script_does_not_run_it(self):
        found = self.run_calls(("Write", {"file_path": "a.py", "content": "open('/home/dev/.ssh/config')"}),
                               ("Bash", {"command": "cat a.py"}))
        self.assertEqual(found, [])

    def test_a_script_not_written_here_is_unknown(self):
        self.assertEqual(self.run_calls(("Bash", {"command": "python other.py"})), [])

    def test_the_command_itself_still_counts(self):
        found = self.run_calls(("Write", {"file_path": "a.py", "content": "open('/home/dev/.ssh/config')"}),
                               ("Bash", {"command": "python a.py .env"}))
        self.assertEqual(found, [(".env", ".env", None), ("/home/dev/.ssh/config", "~/.ssh", "a.py")])


class ParsePatternsTest(unittest.TestCase):
    def test_the_defaults_list_the_usual_secret_locations(self):
        patterns = secret_paths.parse_patterns(config.load(overrides=[]).values)
        for pattern in (".env", "!.env.example", "*.pem", "id_ed25519", "~/.ssh", "~/.claude/.credentials.json"):
            with self.subTest(pattern=pattern):
                self.assertIn(pattern, patterns)

    def test_no_table_gives_no_patterns(self):
        self.assertEqual(secret_paths.parse_patterns({}), ())

    def test_patterns_must_be_a_list_of_text(self):
        for patterns in (".env", [".env", 3], [""], None):
            with self.subTest(patterns=patterns):
                with self.assertRaises(config.ConfigError) as caught:
                    secret_paths.parse_patterns({"secrets": {"patterns": patterns}})
                self.assertIn("secrets.patterns", str(caught.exception))

    def test_the_table_is_a_known_setting(self):
        loaded = config.load(overrides=[])
        loaded.values["secrets"] = {"patterns": [".env"]}
        config.check_keys(loaded)


if __name__ == "__main__":
    unittest.main()
