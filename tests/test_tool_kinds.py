"""tool_kinds.py: a transcript's tool calls by tool and Bash command kind, read from the file on demand."""
import unittest

from claude_usage import tool_kinds
from helpers import MILLION
from helpers import PRICES
from helpers import TempDirTestCase
from helpers import tool_use_block
from helpers import usage


class CommandKindTest(unittest.TestCase):
    def assertKinds(self, kind, commands):
        """Each command is of this kind."""
        for command in commands:
            with self.subTest(command=command):
                self.assertEqual(tool_kinds.command_kind(command), kind)

    def test_searches_in_any_project(self):
        self.assertKinds("search", ["grep -rn TODO src", "rg 'fn main' --type rust", "find . -name '*.go'",
                                    "fd Controller app", "ag needle", "git grep -n useState", "git ls-files '*.php'",
                                    "grep -rn 'a|b' lib | head -20"])

    def test_views_of_files(self):
        self.assertKinds("view", ["cat package.json", "head -50 main.go", "tail -n 20 storage/logs/laravel.log",
                                  "sed -n '10,40p' src/App.tsx", "awk 'NR<5' Gemfile", "jq .scripts package.json",
                                  "wc -l lib/*.rb", "cat composer.json | jq .require"])

    def test_listings(self):
        self.assertKinds("list", ["ls -la", "tree -L 2 src", "du -sh node_modules"])

    def test_edits_in_place(self):
        self.assertKinds("edit_in_place", ["sed -i 's/foo/bar/' main.go", "sed -i.bak -e 's/a/b/' x.rb",
                                           "perl -pi -e 's/old/new/g' lib/App.pm",
                                           "find . -name '*.ts' | xargs sed -i 's/var/let/'"])

    def test_writes_to_a_file(self):
        self.assertKinds("write_file", ["cat > src/config.ts <<'EOF'\nexport const a = 1 | 2;\nEOF",
                                        "cat <<EOF > app/.env\nA=1\nEOF", "echo 'module x' > go.mod",
                                        "printf '%s\\n' a b >> notes.txt", "tee Dockerfile <<'EOF'\nFROM php\nEOF"])

    def test_inline_scripts_in_any_language(self):
        self.assertKinds("inline_script", ["python3 - <<'EOF'\nprint(1)\nEOF", "python -c 'import sys'",
                                           "node -e 'console.log(1)'", "php -r 'echo 1;'", "ruby -e 'puts 1'",
                                           "deno eval 'console.log(1)'", "bun -e 'console.log(1)'",
                                           "bash -c 'echo hi'", "perl -e 'print 1'", "Rscript -e 'print(1)'",
                                           "cd app && node <<'EOF'\nconsole.log(1)\nEOF"])

    def test_an_inline_scripts_interpreter_is_named_without_its_version_or_path(self):
        cases = {"python3.12 - <<'EOF'\nprint(1)\nEOF": "python", "python -c 'import sys'": "python",
                 "/usr/bin/php -r 'echo 1;'": "php", "cd app && node -e 'console.log(1)'": "node",
                 "Rscript -e 'print(1)'": "rscript", "bash -c 'echo hi'": "bash"}
        for command, interpreter in cases.items():
            with self.subTest(command=command):
                self.assertEqual(tool_kinds.command_class(command)[:2], ("inline_script", interpreter))

    def assertClasses(self, cases):
        """Each command is of this kind with this detail."""
        for command, expected in cases.items():
            with self.subTest(command=command):
                self.assertEqual(tool_kinds.command_class(command)[:2], expected)

    def assertOptions(self, cases):
        """Each command's program ran with these options."""
        for command, expected in cases.items():
            with self.subTest(command=command):
                self.assertEqual(tool_kinds.command_class(command)[2], expected)

    def test_options_are_the_programs_flags_without_arguments_or_paths(self):
        self.assertOptions({"grep -rn x src/": "-rn", "ls -la /tmp": "-la", "make test": "",
                            "find . -name '*.go' -type f": "-name -type", "sed -n 1,9p a.go": "-n",
                            "cd /srv/app && rg -l x": "-l"})

    def test_an_options_value_is_left_out(self):
        self.assertOptions({"grep --include='*.go' -e 'secret' x": "--include -e", "grep -C3 x a": "-C",
                            "gcc -I/usr/include a.c": "-I", "sort --key=2 a": "--key"})

    def test_a_number_as_an_option_is_n(self):
        self.assertOptions({"head -20 a.txt": "-N", "tail -5 b.log": "-N"})

    def test_options_end_where_the_arguments_do(self):
        self.assertOptions({"grep -n -- -x a": "-n", "rg -n x | head -5": "-n"})

    def test_an_option_counts_once_in_the_order_given(self):
        self.assertOptions({"grep -n -i -n x": "-n -i"})

    def test_git_gives_its_subcommands_options_not_its_own(self):
        self.assertOptions({"git -C /srv/app log --oneline -5": "--oneline -N", "git commit -m 'text'": "-m",
                            "git status": ""})

    def test_an_edit_in_place_gives_the_editing_programs_options(self):
        self.assertOptions({"find . | xargs sed -i -e 's/a/b/'": "-i -e"})

    def test_an_inline_script_gives_its_interpreters_options(self):
        self.assertOptions({"python3 -c 'print(1)'": "-c", "python3 - <<'EOF'\nprint(1)\nEOF": "-",
                            "node <<'EOF'\nx\nEOF": ""})

    def test_other_kinds_name_their_program(self):
        self.assertClasses({"grep -rn x .": ("search", "grep"), "cd src && rg x": ("search", "rg"),
                            "/usr/bin/find . -name x": ("search", "find"), "sed -n 1,9p a.go": ("view", "sed"),
                            "ls -la": ("list", "ls"), "cat > a.ts <<'EOF'\nx\nEOF": ("write_file", "cat"),
                            "make test": ("run", "make"), "./vendor/bin/pest": ("run", "pest")})

    def test_an_edit_in_place_names_the_program_that_edits(self):
        self.assertClasses({"find . -name '*.ts' | xargs sed -i 's/a/b/'": ("edit_in_place", "sed"),
                            "perl -pi -e 's/a/b/' x.pm": ("edit_in_place", "perl")})

    def test_git_names_its_subcommand(self):
        self.assertClasses({"git status": ("git", "status"), "git -C sub log --oneline": ("git", "log"),
                            "git grep -n x": ("search", "git grep"), "git": ("git", "")})

    def test_an_interpreter_run_from_a_file_is_named_without_its_version_too(self):
        self.assertClasses({"python3 manage.py migrate": ("run", "python"), "pip3 install x": ("run", "pip3")})

    def test_an_empty_command_has_an_empty_program(self):
        self.assertClasses({"": ("run", ""), "cd src": ("run", "")})

    def test_scripts_run_from_a_file_are_runs(self):
        self.assertKinds("run", ["python3 manage.py migrate", "node server.js", "php artisan test", "bash build.sh"])

    def test_git_beyond_its_searches(self):
        self.assertKinds("git", ["git status", "git diff --stat", "git -C sub log --oneline", "git show HEAD:x.go"])

    def test_everything_else_runs_a_program(self):
        self.assertKinds("run", ["make test", "npm run build", "go test ./...", "cargo build", "composer install",
                                 "docker compose up -d", "curl -s localhost:8000", "bundle exec rspec",
                                 "./vendor/bin/pest", "mix test", "dotnet test", ""])

    def test_the_first_program_counts_past_cd_env_and_sudo(self):
        self.assertKinds("search", ["cd src && grep -rn x .", "FOO=1 BAR=2 rg x", "sudo find / -name x",
                                    "timeout 10 grep x y", "export A=1; grep x y"])
        self.assertKinds("view", ["for f in *.md; do cat $f; done"])

    def test_quoted_text_does_not_split_or_redirect(self):
        self.assertKinds("search", ["grep 'a > b; sed -i x' file", 'grep "x && cat y" z'])


class TranscriptToolsTest(TempDirTestCase):
    def setUp(self):
        super().setUp()
        self.main = self.projects.session("s1")

    def call(self, message_id, tool_use_id, name, tool_input, result, is_error=None, context=10_000, output=100):
        """One assistant call with one tool use, then its result."""
        self.main.assistant(message_id, [tool_use_block(tool_use_id, name, tool_input)],
                            usage(cache_read=context, output=output))
        self.main.tool_result(tool_use_id, result, is_error=is_error)

    def rows(self):
        """The rows by (tool, kind)."""
        return {(row.tool, row.kind): row for row in tool_kinds.transcript_tools(self.main.path, PRICES).rows
                if row.detail is None and row.options is None}

    def test_bash_calls_are_split_by_kind_under_their_total(self):
        self.call("m1", "t1", "Bash", {"command": "grep -rn x ."}, "a" * 100)
        self.call("m2", "t2", "Bash", {"command": "cat README.md"}, "b" * 300)
        self.call("m3", "t3", "Bash", {"command": "grep y ."}, "c" * 50)
        rows = self.rows()
        self.assertEqual(set(rows), {("Bash", None), ("Bash", "search"), ("Bash", "view")})
        self.assertEqual((rows[("Bash", None)].calls, rows[("Bash", None)].result_chars), (3, 450))
        self.assertEqual((rows[("Bash", "search")].calls, rows[("Bash", "search")].result_chars), (2, 150))

    def test_other_tools_get_one_row_named_as_shown(self):
        self.call("m1", "t1", "Read", {"file_path": "a.go"}, "x" * 10)
        self.call("m2", "t2", "mcp__srv__find", {"q": "y"}, "y")
        self.assertEqual(set(self.rows()), {("Read", None), ("srv.find", None)})

    def test_rows_go_by_calls_with_the_kinds_under_their_tool(self):
        for index in range(3):
            self.call(f"m{index}", f"t{index}", "Read", {"file_path": "a"}, "x")
        self.call("m3", "t3", "Bash", {"command": "ls"}, "x")
        self.call("m4", "t4", "Bash", {"command": "git status"}, "x")
        self.call("m5", "t5", "Bash", {"command": "git log"}, "x")
        self.call("m6", "t6", "Bash", {"command": "git diff"}, "x")
        order = [(row.kind, row.detail, row.options)
                 for row in tool_kinds.transcript_tools(self.main.path, PRICES).rows]
        self.assertEqual(order, [(None, None, None), ("git", None, None), ("git", "diff", None), ("git", "diff", ""),
                                 ("git", "log", None), ("git", "log", ""), ("git", "status", None),
                                 ("git", "status", ""), ("list", None, None), ("list", "ls", None),
                                 ("list", "ls", ""), (None, None, None)])

    def test_each_kind_splits_by_its_detail_under_it(self):
        self.call("m1", "t1", "Bash", {"command": "node -e 'console.log(1)'"}, "x" * 10)
        self.call("m2", "t2", "Bash", {"command": "python3 -c 'print(1)'"}, "x" * 20)
        self.call("m3", "t3", "Bash", {"command": "python - <<'EOF'\nprint(1)\nEOF"}, "x" * 30)
        self.call("m4", "t4", "Bash", {"command": "ls"}, "x")
        rows = tool_kinds.transcript_tools(self.main.path, PRICES).rows
        self.assertEqual([(row.kind, row.detail, row.options, row.calls) for row in rows],
                         [(None, None, None, 4), ("inline_script", None, None, 3),
                          ("inline_script", "python", None, 2), ("inline_script", "python", "-", 1),
                          ("inline_script", "python", "-c", 1), ("inline_script", "node", None, 1),
                          ("inline_script", "node", "-e", 1), ("list", None, None, 1), ("list", "ls", None, 1),
                          ("list", "ls", "", 1)])
        self.assertEqual((rows[2].result_chars, rows[3].result_chars), (50, 30))

    def test_errors_sizes_and_inputs(self):
        self.call("m1", "t1", "Edit", {"file_path": "a", "old_string": "x", "new_string": "y"}, "ok")
        self.call("m2", "t2", "Edit", {"file_path": "a", "old_string": "x", "new_string": "y"}, "not found",
                  is_error=True)
        self.call("m3", "t3", "Edit", {"file_path": "a", "old_string": "xyz", "new_string": "y"}, "o" * 1000)
        [row] = self.rows().values()
        self.assertEqual((row.calls, row.errors, row.result_chars), (3, 1, 1011))
        self.assertEqual((row.result_median, row.result_p90), (9, 1000))
        self.assertEqual(row.input_median, len('{"file_path": "a", "old_string": "x", "new_string": "y"}'))

    def test_a_call_without_a_result_yet_counts_without_its_size(self):
        self.main.assistant("m1", [tool_use_block("t1", "Read", {"file_path": "a"})], usage(output=5))
        [row] = self.rows().values()
        self.assertEqual((row.calls, row.result_chars, row.result_median), (1, 0, None))

    def test_the_calls_after_count_up_to_the_next_compaction(self):
        self.call("m1", "t1", "Read", {"file_path": "a"}, "x")
        self.call("m2", "t2", "Read", {"file_path": "b"}, "x")
        self.call("m3", "t3", "Read", {"file_path": "c"}, "x")
        self.main.compaction()
        self.call("m4", "t4", "Read", {"file_path": "d"}, "x")
        [row] = self.rows().values()
        # m1 is followed by m2 and m3, m2 by m3, m3 and m4 by none
        self.assertEqual(row.calls_after_median, 0.5)

    def test_what_later_calls_carry_is_priced_at_the_calling_models_rates(self):
        self.call("m1", "t1", "Read", {}, "x" * 2298, context=10_000)
        self.call("m2", "t2", "Bash", {"command": "ls"}, "", context=11_000)
        self.call("m3", "t3", "Bash", {"command": "ls"}, "", context=11_000)
        read = self.rows()[("Read", None)]
        tokens = (len("{}") + 2298) / tool_kinds.CHARS_PER_TOKEN
        # written once by the next call (all 5m here), read again by the one after
        self.assertAlmostEqual(read.carried, tokens * (2.5 + 0.2) / MILLION)
        self.assertAlmostEqual(read.input_cost, len("{}") / tool_kinds.CHARS_PER_TOKEN * 10.0 / MILLION)

    def test_the_last_call_carries_nothing_yet(self):
        self.call("m1", "t1", "Read", {}, "x" * 1000)
        self.assertEqual(self.rows()[("Read", None)].carried, 0.0)

    def test_an_unpriced_model_leaves_the_costs_unknown(self):
        self.main.assistant("m1", [tool_use_block("t1", "Read", {})], usage(output=5), model="gpt-x")
        self.main.tool_result("t1", "x")
        self.main.assistant("m2", [tool_use_block("t2", "Read", {})], usage(output=5), model="gpt-x")
        row = self.rows()[("Read", None)]
        self.assertIsNone(row.carried)
        self.assertIsNone(row.input_cost)

    def test_a_record_written_again_counts_once(self):
        [record] = self.main.assistant("m1", [tool_use_block("t1", "Bash", {"command": "ls"})], usage(output=5),
                                       uuid="r1")
        self.main.tool_result("t1", "x")
        # after a compaction Claude Code may write earlier records again, with the same uuid
        self.main.bare(dict(record, message=dict(record["message"], id="m2")))
        self.assertEqual(self.rows()[("Bash", None)].calls, 1)

    def exploration(self):
        """The transcript's exploration in its current stretch."""
        return tool_kinds.transcript_tools(self.main.path, PRICES).exploration

    def test_exploration_counts_reads_searches_views_and_listings(self):
        self.call("m1", "t1", "Read", {}, "x" * 228)
        self.call("m2", "t2", "Grep", {}, "x" * 228)
        self.call("m3", "t3", "Glob", {}, "x" * 228)
        self.call("m4", "t4", "Bash", {"command": "grep -rn x ."}, "x" * 100)
        self.call("m5", "t5", "Bash", {"command": "sed -n 1,9p a.rb"}, "x" * 100)
        self.call("m6", "t6", "Bash", {"command": "ls"}, "x" * 100)
        exploration = self.exploration()
        self.assertEqual(exploration.calls, 6)
        self.assertEqual(exploration.chars, 3 * (228 + 2) + sum(len(f'{{"command": "{command}"}}') + 100 for command
                                                                    in ("grep -rn x .", "sed -n 1,9p a.rb", "ls")))
        self.assertAlmostEqual(exploration.tokens, exploration.chars / tool_kinds.CHARS_PER_TOKEN)

    def test_edits_runs_and_other_tools_are_no_exploration(self):
        self.call("m1", "t1", "Edit", {}, "ok")
        self.call("m2", "t2", "Bash", {"command": "make test"}, "ok")
        self.call("m3", "t3", "mcp__srv__find", {}, "ok")
        self.call("m4", "t4", "Agent", {}, "ok")
        self.assertIsNone(self.exploration())

    def test_exploration_starts_again_after_a_compaction(self):
        self.call("m1", "t1", "Read", {}, "x" * 1000)
        self.main.compaction()
        self.assertIsNone(self.exploration())
        self.call("m2", "t2", "Read", {}, "x" * 10)
        self.assertEqual((self.exploration().calls, self.exploration().chars), (1, 12))

    def test_exploration_carries_its_cost_so_far_and_each_replys_reread(self):
        self.call("m1", "t1", "Read", {}, "x" * 2298)
        self.call("m2", "t2", "Edit", {}, "ok")
        self.call("m3", "t3", "Edit", {}, "ok")
        exploration = self.exploration()
        tokens = 2300 / tool_kinds.CHARS_PER_TOKEN
        self.assertAlmostEqual(exploration.carried, tokens * (2.5 + 0.2) / MILLION)
        self.assertAlmostEqual(exploration.reread, tokens * 0.2 / MILLION)

    def test_a_missing_file_raises(self):
        self.main.path.unlink()
        with self.assertRaises(OSError):
            tool_kinds.transcript_tools(self.main.path, PRICES)


if __name__ == "__main__":
    unittest.main()
