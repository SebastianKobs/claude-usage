"""__main__.py: the scan, report and serve commands, their exit codes and output."""
import contextlib
import io
import json
import os
import shutil
import subprocess
import sys
import unittest
from datetime import UTC
from datetime import datetime
from pathlib import Path
from unittest import mock

from claude_usage import __main__ as cli
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
        now = datetime.now(UTC)
        main = self.projects.session("s1", project="/home/dev/app").at(now)
        main.user("Fix the parser")
        main.ai_title("Parser fix")
        main.assistant("m1", [tool_use_block("t1", "Read")], usage(new=10, cache_read=100, output=50),
                       model="claude-sonnet-5")
        main.tool_result("t1", "abc")
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

    def test_session_text(self):
        code, out, _ = self.run_cli("report", "--session", "s1")
        self.assertEqual(code, 0)
        self.assertIn("Parser fix", out)
        self.assertIn("main", out)
        self.assertIn("Read", out)

    def test_unknown_session_exits_1(self):
        code, _, err = self.run_cli("report", "--session", "nope")
        self.assertEqual(code, 1)
        self.assertIn("nope", err)

    def test_negative_days_exit_2(self):
        code, _, err = self.run_cli("report", "--days", "-1")
        self.assertEqual(code, 2)
        self.assertIn("days", err)


class ServeCommandTest(CliCase):
    def test_serve_prints_the_url_and_stops_on_ctrl_c(self):
        with mock.patch.object(server.UsageServer, "serve_forever", side_effect=KeyboardInterrupt):
            code, out, _ = self.run_cli("serve", "--port", "0", "--live-minutes", "3")
        self.assertEqual(code, 0)
        self.assertIn("http://127.0.0.1:", out)

    def test_port_in_use_exits_1(self):
        with mock.patch.object(server, "make_server", side_effect=OSError("Address already in use")):
            code, _, err = self.run_cli("serve", "--port", "8765")
        self.assertEqual(code, 1)
        self.assertIn("Address already in use", err)


class ArgumentTest(CliCase):
    def test_help_exits_0(self):
        for arguments in (["--help"], ["scan", "--help"], ["report", "--help"], ["serve", "--help"]):
            with self.subTest(arguments=arguments):
                self.assertEqual(self.run_cli(*arguments, paths=False)[0], 0)

    def test_unknown_option_exits_2(self):
        self.assertEqual(self.run_cli("scan", "--frobnicate")[0], 2)

    def test_missing_or_unknown_command_exits_2(self):
        self.assertEqual(self.run_cli(paths=False)[0], 2)
        self.assertEqual(self.run_cli("explode")[0], 2)

    def test_unknown_group_exits_2(self):
        self.assertEqual(self.run_cli("report", "--by", "weekday")[0], 2)


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
