"""__main__.py: the scan, report and serve commands, their exit codes and output."""
import contextlib
import io
import json
import os
import shutil
import signal
import sqlite3
import subprocess
import sys
import unittest
from datetime import UTC
from datetime import datetime
from datetime import timedelta
from pathlib import Path
from unittest import mock

import claude_usage
from claude_usage import __main__ as cli
from claude_usage import config
from claude_usage import server
from helpers import TempDirTestCase
from helpers import text_block
from helpers import tool_use_block
from helpers import usage

REPO = Path(__file__).resolve().parent.parent


class CliCase(TempDirTestCase):
    """Two sessions in two projects, and a runner for main() with the temp paths."""

    def setUp(self):
        super().setUp()
        # only the shipped defaults: the developer's own config.toml or config.local.toml must not change the output
        patcher = mock.patch.object(config, "override_files", return_value=[])
        patcher.start()
        self.addCleanup(patcher.stop)
        now = datetime.now(UTC)
        self.main = self.projects.session("s1", project="/home/dev/app").at(now)
        self.main.user("Fix the parser")
        self.main.ai_title("Parser fix")
        self.main.assistant("m1", [tool_use_block("t1", "Read")], usage(new=10, cache_read=100, output=50),
                            model="claude-sonnet-5")
        self.main.tool_result("t1", "abc")
        other = self.projects.session("s2", project="/home/dev/other").at(now)
        other.assistant("m2", [text_block("x")], usage(output=7), model="claude-opus-5-5")

    def run_cli(self, *arguments, paths=True):
        """(exit code, stdout, stderr) of main() with the temp projects folder and store unless paths=False."""
        argv = list(arguments)
        if paths:
            argv = ["--projects-dir", str(self.projects.root), "--store", str(self.store_path), *argv]
        stdout = io.StringIO()
        stderr = io.StringIO()
        with contextlib.redirect_stdout(stdout), contextlib.redirect_stderr(stderr):
            code = cli.main(argv)
        return code, stdout.getvalue(), stderr.getvalue()


class ScanCommandTest(CliCase):
    def test_scan_exits_0_and_reports_counts(self):
        code, out, _ = self.run_cli("scan")
        self.assertEqual(code, 0)
        self.assertIn("2 files scanned", out)
        self.assertIn("2 messages", out)
        self.assertTrue(self.store_path.exists())

    def test_second_scan_skips_everything(self):
        self.run_cli("scan")
        _, out, _ = self.run_cli("scan")
        self.assertIn("0 files scanned, 2 unchanged", out)

    def test_project_filter(self):
        _, out, _ = self.run_cli("scan", "--project", "/home/dev/other")
        self.assertIn("1 files scanned", out)

    def test_global_options_after_the_command(self):
        code, out, _ = self.run_cli("scan", "--projects-dir", str(self.projects.root), "--store",
                                    str(self.store_path), paths=False)
        self.assertEqual(code, 0)
        self.assertIn("2 files scanned", out)

    def test_missing_projects_dir_exits_1_without_a_traceback(self):
        code, _, err = self.run_cli("--projects-dir", str(self.tmp / "nothing"), "--store", str(self.store_path),
                                    "scan", paths=False)
        self.assertEqual(code, 1)
        self.assertIn("projects folder not found", err)
        self.assertNotIn("Traceback", err)


class RetentionCommandTest(CliCase):
    def setUp(self):
        super().setUp()
        long_ago = datetime.now(UTC) - timedelta(days=40)
        self.projects.session("old").at(long_ago).assistant("m9", [text_block("x")], usage(output=9))

    def test_scan_deletes_what_is_older_than_the_retention(self):
        code, out, _ = self.run_cli("scan")
        self.assertEqual(code, 0)
        self.assertIn("1 session older than 30 days deleted", out)

    def test_report_refuses_a_range_past_the_retention(self):
        code, _, err = self.run_cli("report", "--days", "90")
        self.assertEqual(code, 1)
        self.assertIn("retention_days", err)

    def test_report_without_days_keeps_to_a_shorter_retention(self):
        override = self.tmp / "config.toml"
        override.write_text("retention_days = 7\n", encoding="utf-8")
        with mock.patch.object(config, "override_files", return_value=[override]):
            code, out, _ = self.run_cli("report", "--json")
        self.assertEqual((code, json.loads(out)["days"]), (0, 7))

    def test_report_of_all_time_is_the_retention(self):
        code, out, _ = self.run_cli("report", "--days", "0", "--json")
        self.assertEqual((code, json.loads(out)["totals"]["turns"]), (0, 2))


class ReportCommandTest(CliCase):
    def test_report_json(self):
        code, out, _ = self.run_cli("report", "--json")
        self.assertEqual(code, 0)
        payload = json.loads(out)
        self.assertEqual((payload["by"], payload["days"]), ("model", 30))
        self.assertEqual(sorted(row["model"] for row in payload["rows"]), ["claude-opus-5-5", "claude-sonnet-5"])
        self.assertEqual(payload["totals"]["turns"], 2)

    def test_report_by_project(self):
        _, out, _ = self.run_cli("report", "--by", "project", "--json")
        projects = sorted(row["project"] for row in json.loads(out)["rows"])
        self.assertEqual(projects, ["/home/dev/app", "/home/dev/other"])

    def test_report_by_skill(self):
        self.main.assistant("m9", [text_block("s")], usage(output=3), attributionSkill="dataviz")
        code, out, _ = self.run_cli("report", "--by", "skill", "--json")
        self.assertEqual(code, 0)
        self.assertIn(("dataviz", 3), [(row["skill"], row["output"]) for row in json.loads(out)["rows"]])

    def test_report_text_names_the_unattributed_turns(self):
        _, out, _ = self.run_cli("report", "--by", "mcp_server")
        self.assertIn("(none)", out)
        self.assertNotIn("None", out)

    def test_report_by_effort(self):
        self.main.assistant("m9", [text_block("e")], usage(output=3), effort="medium")
        code, out, _ = self.run_cli("report", "--by", "effort")
        self.assertEqual(code, 0)
        self.assertIn("medium", out)

    def test_report_text(self):
        code, out, _ = self.run_cli("report", "--by", "model")
        self.assertEqual(code, 0)
        self.assertIn("claude-sonnet-5", out)
        self.assertIn("Total", out)
        self.assertIn("$", out)

    def test_all_time_with_days_0(self):
        _, out, _ = self.run_cli("report", "--days", "0", "--json")
        payload = json.loads(out)
        self.assertIsNone(payload["since"])
        self.assertEqual(payload["totals"]["turns"], 2)

    def test_report_scans_first_unless_told_not_to(self):
        _, out, _ = self.run_cli("report", "--no-scan", "--json")
        self.assertEqual(json.loads(out)["rows"], [])
        _, out, _ = self.run_cli("report", "--json")
        self.assertEqual(len(json.loads(out)["rows"]), 2)

    def test_session_json(self):
        code, out, _ = self.run_cli("report", "--session", "s1", "--json")
        self.assertEqual(code, 0)
        detail = json.loads(out)
        self.assertEqual((detail["title"], detail["agents"][0]["tools"][0]["tool"]), ("Parser fix", "Read"))

    def test_session_json_compares_compactions_at_the_configured_auto_compact_points(self):
        # the shipped config puts claude-haiku-4-5 at 200K: a 205K context was forced to compact
        self.main.assistant("m3", [text_block("a")], usage(cache_1h=5_000, cache_read=190_000, output=10_000),
                            model="claude-haiku-4-5")
        self.main.compaction()
        self.main.user("go on")
        self.main.assistant("m4", [text_block("b")], usage(cache_1h=20_000, output=10), model="claude-haiku-4-5")
        _, out, _ = self.run_cli("report", "--session", "s1", "--json")
        [row] = json.loads(out)["agents"][0]["compactions"]
        self.assertEqual(row["versus_keeping"]["verdict"], "forced")

    def test_session_text(self):
        code, out, _ = self.run_cli("report", "--session", "s1")
        self.assertEqual(code, 0)
        self.assertIn("Parser fix", out)
        self.assertIn("main", out)
        self.assertIn("Read", out)

    def test_session_text_shows_the_run_totals(self):
        self.main.cost_state({}, totalDuration=600000, totalAPIDuration=240000, totalAPIDurationWithoutRetries=200000,
                             totalToolDuration=90000, totalLinesAdded=150, totalLinesRemoved=50)
        _, out, _ = self.run_cli("report", "--session", "s1")
        self.assertIn("Run: 10 min wall-clock, API 4 min (3 min 20 s without retries), tools 1 min 30 s, "
                      "lines +150 / -50", out)

    def test_session_text_shows_skills_mcp_servers_and_api_errors(self):
        self.main.assistant("m9", [text_block("s")], usage(output=3), attributionSkill="dataviz",
                            attributionMcpServer="codebase-memory-mcp")
        self.main.api_error("e1")
        _, out, _ = self.run_cli("report", "--session", "s1")
        for expected in ("Skill", "dataviz", "MCP server", "codebase-memory-mcp", "rate_limit", "five_hour"):
            with self.subTest(expected=expected):
                self.assertIn(expected, out)

    def test_session_text_marks_estimated_run_totals(self):
        _, out, _ = self.run_cli("report", "--session", "s1")
        self.assertIn("Run (estimated from the transcripts; tool time includes waiting for permission): ", out)
        self.assertNotIn("without retries", out)

    def test_session_text_shows_usage_per_model_and_effort(self):
        self.main.assistant("m9", [text_block("e")], usage(output=3), effort="max")
        _, out, _ = self.run_cli("report", "--session", "s1")
        self.assertIn("Model / effort", out)
        self.assertIn("  max", out)

    def test_unknown_session_exits_1(self):
        code, _, err = self.run_cli("report", "--session", "nope")
        self.assertEqual(code, 1)
        self.assertIn("nope", err)

    def test_negative_days_exit_2(self):
        code, _, err = self.run_cli("report", "--days", "-1")
        self.assertEqual(code, 2)
        self.assertIn("days", err)


class BackupCommandTest(CliCase):
    def test_backup_copies_the_history_into_a_new_file(self):
        self.run_cli("scan")
        target = self.tmp / "backups" / "usage-copy.sqlite"
        code, out, _ = self.run_cli("backup", str(target))
        self.assertEqual(code, 0)
        self.assertIn(str(target), out)
        with contextlib.closing(sqlite3.connect(target)) as copy:
            self.assertEqual(copy.execute("SELECT COUNT(*) FROM messages").fetchone()[0], 2)

    def test_backup_never_overwrites_a_file(self):
        target = self.tmp / "existing.sqlite"
        target.write_text("keep me", encoding="utf-8")
        code, _, err = self.run_cli("backup", str(target))
        self.assertEqual(code, 1)
        self.assertIn("exists", err)
        self.assertEqual(target.read_text(encoding="utf-8"), "keep me")


class ServeCommandTest(CliCase):
    def test_serve_prints_the_url_and_stops_on_ctrl_c(self):
        with mock.patch.object(server.UsageServer, "serve_forever", side_effect=KeyboardInterrupt):
            code, out, _ = self.run_cli("serve", "--port", "0", "--live-minutes", "3")
        self.assertEqual(code, 0)
        self.assertIn("http://127.0.0.1:", out)

    def test_serve_prints_the_link_with_its_token(self):
        with mock.patch.object(server.UsageServer, "serve_forever", side_effect=KeyboardInterrupt):
            _, out, _ = self.run_cli("serve", "--port", "0")
        self.assertRegex(out, r"(?m)^Serving http://127\.0\.0\.1:\d+/\?token=[A-Za-z0-9_-]{40,}  \(Ctrl\+C to stop\)$")

    def test_serve_prints_the_url_before_the_first_scan(self):
        printed_before_scan = []

        def scan(*arguments):
            """Note whether the URL is out already, as `make start` waits for it."""
            printed_before_scan.append("Serving http://127.0.0.1:" in sys.stdout.getvalue())
            return server.scan.ScanResult(0, 0, 0, 0, ())

        with mock.patch.object(server.scan, "scan", side_effect=scan):
            with mock.patch.object(server.UsageServer, "serve_forever", side_effect=KeyboardInterrupt):
                self.run_cli("serve", "--port", "0")
        self.assertEqual(printed_before_scan, [True])

    def test_serve_warns_before_the_link_when_others_can_read_the_projects_folder(self):
        printed_before_warning = []

        def warnings(projects_dir):
            """Note whether the link is out already: `make start` shows only what comes before it."""
            printed_before_warning.append("Serving" in sys.stdout.getvalue())
            return ["2 of 3 files below the projects folder can be read by other users"]

        with mock.patch.object(cli.readers, "warnings", side_effect=warnings):
            with mock.patch.object(server.UsageServer, "serve_forever", side_effect=KeyboardInterrupt):
                _, _, err = self.run_cli("serve", "--port", "0")
        self.assertEqual(printed_before_warning, [False])
        self.assertIn("warning: 2 of 3 files below the projects folder can be read by other users\n", err)

    def test_serve_starts_when_who_else_can_read_the_projects_folder_is_unknown(self):
        with mock.patch.object(cli.readers, "warnings", side_effect=PermissionError("denied")):
            with mock.patch.object(server.UsageServer, "serve_forever", side_effect=KeyboardInterrupt):
                code, out, err = self.run_cli("serve", "--port", "0")
        self.assertEqual(code, 0)
        self.assertIn("Serving http://127.0.0.1:", out)
        self.assertIn(f"warning: who else can read {self.projects.root} is unknown: denied\n", err)

    def test_serve_without_a_projects_folder_serves_the_history_and_says_why(self):
        self.run_cli("scan")
        shutil.rmtree(self.projects.root)
        with mock.patch.object(server.UsageServer, "serve_forever", side_effect=KeyboardInterrupt):
            code, _, err = self.run_cli("serve", "--port", "0")
        self.assertEqual(code, 0)
        self.assertIn("projects folder not found", err)

    def test_port_in_use_exits_1(self):
        with mock.patch.object(server, "make_server", side_effect=OSError("Address already in use")):
            code, _, err = self.run_cli("serve", "--port", "8765")
        self.assertEqual(code, 1)
        self.assertIn("Address already in use", err)

    def test_serve_stops_cleanly_on_sigterm(self):
        def terminate():
            """What `make stop` does to the running server."""
            os.kill(os.getpid(), signal.SIGTERM)

        before = signal.getsignal(signal.SIGTERM)
        with mock.patch.object(server.UsageServer, "serve_forever", side_effect=terminate):
            code, out, _ = self.run_cli("serve", "--port", "0")
        self.assertEqual(code, 0)
        self.assertIn("Stopped.", out)
        self.assertIs(signal.getsignal(signal.SIGTERM), before)

    def test_a_bad_compact_setting_exits_1_without_a_traceback(self):
        settings = config.load(overrides=[])
        settings.values["chat"] = {"compact_hint_tokens": "lots"}
        with mock.patch.object(cli.config, "load", return_value=settings):
            code, _, err = self.run_cli("serve", "--port", "8765")
        self.assertEqual(code, 1)
        self.assertIn("compact_hint_tokens", err)
        self.assertNotIn("Traceback", err)

    def test_bad_secret_patterns_exit_1_without_a_traceback(self):
        settings = config.load(overrides=[])
        settings.values["secrets"] = {"patterns": ".env"}
        with mock.patch.object(cli.config, "load", return_value=settings):
            code, _, err = self.run_cli("serve", "--port", "8765")
        self.assertEqual(code, 1)
        self.assertIn("secrets.patterns", err)
        self.assertNotIn("Traceback", err)

    def test_bad_network_programs_exit_1_without_a_traceback(self):
        settings = config.load(overrides=[])
        settings.values["secrets"] = {"network_programs": "curl"}
        with mock.patch.object(cli.config, "load", return_value=settings):
            code, _, err = self.run_cli("serve", "--port", "8765")
        self.assertEqual(code, 1)
        self.assertIn("secrets.network_programs", err)
        self.assertNotIn("Traceback", err)


class ArgumentTest(CliCase):
    def test_help_exits_0(self):
        for arguments in (["--help"], ["scan", "--help"], ["report", "--help"], ["serve", "--help"]):
            with self.subTest(arguments=arguments):
                self.assertEqual(self.run_cli(*arguments, paths=False)[0], 0)

    def test_version(self):
        code, out, _ = self.run_cli("--version", paths=False)
        self.assertEqual((code, out.strip()), (0, f"claude-usage {claude_usage.__version__}"))

    def test_unknown_option_exits_2(self):
        self.assertEqual(self.run_cli("scan", "--frobnicate")[0], 2)

    def test_missing_or_unknown_command_exits_2(self):
        self.assertEqual(self.run_cli(paths=False)[0], 2)
        self.assertEqual(self.run_cli("explode")[0], 2)

    def test_unknown_group_exits_2(self):
        self.assertEqual(self.run_cli("report", "--by", "weekday")[0], 2)

    def test_out_of_range_numbers_exit_2(self):
        for arguments in (["report", "--days", "99999999"], ["report", "--days", "²"],
                          ["serve", "--port", "70000"], ["serve", "--port", "-1"],
                          ["serve", "--live-minutes", "0"], ["serve", "--live-minutes", "nan"],
                          ["serve", "--live-minutes", "inf"]):
            with self.subTest(arguments=arguments):
                code, _, err = self.run_cli(*arguments)
                self.assertEqual(code, 2)
                self.assertNotIn("Traceback", err)

    def test_ctrl_c_during_a_command_exits_130(self):
        with mock.patch.object(cli.scan, "scan", side_effect=KeyboardInterrupt):
            code, _, err = self.run_cli("scan")
        self.assertEqual(code, 130)
        self.assertIn("interrupted", err)


class InstalledCopyTest(CliCase):
    """The package on its own, as pip puts it into site-packages: no checkout, no config.toml next to it."""

    def test_runs_from_a_copy_without_the_checkout(self):
        site = self.tmp / "site"
        shutil.copytree(REPO / "claude_usage", site / "claude_usage",
                        ignore=shutil.ignore_patterns("__pycache__"))
        environ = dict(os.environ, PYTHONPATH=str(site), XDG_CONFIG_HOME=str(self.tmp / "config"),
                       XDG_DATA_HOME=str(self.tmp / "share"))
        result = subprocess.run([sys.executable, "-m", "claude_usage", "--projects-dir", str(self.projects.root),
                                 "scan"], cwd=self.tmp, env=environ, capture_output=True, text=True, timeout=60,
                                check=False)
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertIn("2 files scanned", result.stdout)
        self.assertTrue((self.tmp / "share" / "claude-usage" / "usage.sqlite").exists())


class ModuleTest(unittest.TestCase):
    def test_runs_as_a_module_without_installing(self):
        result = subprocess.run([sys.executable, "-m", "claude_usage", "--help"], cwd=REPO, capture_output=True,
                                text=True, timeout=60, check=False)
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertIn("scan", result.stdout)


if __name__ == "__main__":
    unittest.main()
