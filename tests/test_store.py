"""store.py: the schema, its migrations and backups."""
import os
import sqlite3
import stat
import unittest
from datetime import timedelta
from pathlib import Path
from unittest import mock

from claude_usage import scan
from claude_usage import store
from helpers import DAY_1
from helpers import HAIKU
from helpers import TempDirTestCase
from helpers import build_session
from helpers import text_block
from helpers import usage


class SchemaTest(TempDirTestCase):
    def test_data_survives_reopening(self):
        build_session(self.projects)
        with store.Store(self.store_path) as first:
            scan.scan(first, self.projects.root)
        with store.Store(self.store_path) as second:
            self.assertEqual(second.connection.execute("SELECT COUNT(*) FROM messages").fetchone()[0], 3)
            self.assertEqual(scan.scan(second, self.projects.root).files_skipped, 2)

    def test_schema_version_is_recorded(self):
        with store.Store(self.store_path) as opened:
            version = opened.connection.execute("SELECT value FROM meta WHERE key = 'schema_version'").fetchone()[0]
        self.assertEqual(int(version), store.SCHEMA_VERSION)

    def test_a_version_1_store_reads_its_files_again(self):
        main = self.projects.session("s1")
        main.at(DAY_1).user("hi")
        main.assistant("m1", [text_block("a")], usage(output=5))
        main.cost_state({HAIKU: (100, 0, 0, 10, 0.01)})
        with store.Store(self.store_path) as first:
            scan.scan(first, self.projects.root)
            # what a version-1 store looks like: no cost states, and every file read to its end
            first.connection.execute("DELETE FROM cost_states")
            first.connection.execute("DELETE FROM background_parts")
            first.connection.execute("UPDATE meta SET value = '1' WHERE key = 'schema_version'")
        with store.Store(self.store_path) as second:
            result = scan.scan(second, self.projects.root)
            self.assertEqual(result.files_scanned, 1)
            self.assertEqual(second.connection.execute("SELECT COUNT(*) FROM messages").fetchone()[0], 1)
            self.assertEqual(second.connection.execute("SELECT model FROM background_parts").fetchall()[0][0], HAIKU)
            version = second.connection.execute("SELECT value FROM meta WHERE key = 'schema_version'").fetchone()[0]
            self.assertEqual(int(version), store.SCHEMA_VERSION)

    def test_a_version_2_store_gets_web_search_columns_and_reads_its_files_again(self):
        main = self.projects.session("s1")
        main.at(DAY_1).user("hi")
        main.assistant("m1", [text_block("a")], usage(output=5))
        main.cost_state({HAIKU: (100, 0, 0, 10, 0.02, 1)})
        with store.Store(self.store_path) as first:
            scan.scan(first, self.projects.root)
            # what a version-2 store looks like: no web_searches columns, snapshots without them
            first.connection.execute("DROP VIEW usage_rows")
            first.connection.execute("ALTER TABLE messages DROP COLUMN web_searches")
            first.connection.execute("ALTER TABLE background DROP COLUMN web_searches")
            first.connection.execute("DELETE FROM cost_states")
            first.connection.execute("DELETE FROM background_parts")
            first.connection.execute("UPDATE meta SET value = '2' WHERE key = 'schema_version'")
        with store.Store(self.store_path) as second:
            self.assertEqual(scan.scan(second, self.projects.root).files_scanned, 1)
            self.assertEqual(second.connection.execute("SELECT web_searches FROM background_parts").fetchall()[0][0], 1)
            self.assertEqual(second.connection.execute("SELECT web_searches FROM messages").fetchall()[0][0], 0)

    def test_a_version_4_store_gets_run_total_columns_and_reads_its_files_again(self):
        main = self.projects.session("s1")
        main.at(DAY_1).user("hi")
        main.assistant("m1", [text_block("a")], usage(output=5))
        main.cost_state({HAIKU: (100, 0, 0, 10, 0.01)}, totalDuration=60000, totalLinesAdded=7)
        with store.Store(self.store_path) as first:
            scan.scan(first, self.projects.root)
            # what a version-4 store looks like: cost states without the run totals
            first.connection.execute("DROP TABLE cost_states")
            first.connection.execute("CREATE TABLE cost_states (session_id TEXT PRIMARY KEY, path TEXT NOT NULL, "
                                     "snapshot_ts TEXT, start_ts TEXT, models TEXT NOT NULL)")
            first.connection.execute("UPDATE meta SET value = '4' WHERE key = 'schema_version'")
        with store.Store(self.store_path) as second:
            self.assertEqual(scan.scan(second, self.projects.root).files_scanned, 1)
            row = second.connection.execute("SELECT duration_ms, lines_added FROM cost_states").fetchone()
            self.assertEqual(tuple(row), (60000, 7))

    def test_a_version_5_store_gets_attribution_columns_and_reads_its_files_again(self):
        main = self.projects.session("s1")
        main.at(DAY_1).assistant("m1", [text_block("a")], usage(output=5), attributionSkill="dataviz")
        with store.Store(self.store_path) as first:
            scan.scan(first, self.projects.root)
            # what a version-5 store looks like: messages without the attribution columns
            first.connection.execute("DROP VIEW usage_rows")
            first.connection.execute("ALTER TABLE messages DROP COLUMN mcp_server")
            first.connection.execute("ALTER TABLE messages DROP COLUMN skill")
            first.connection.execute("UPDATE meta SET value = '5' WHERE key = 'schema_version'")
        with store.Store(self.store_path) as second:
            self.assertEqual(scan.scan(second, self.projects.root).files_scanned, 1)
            self.assertEqual(second.connection.execute("SELECT skill FROM messages").fetchone()[0], "dataviz")

    def test_a_version_6_store_reads_its_files_again_for_the_api_errors(self):
        main = self.projects.session("s1")
        main.at(DAY_1).api_error("e1")
        with store.Store(self.store_path) as first:
            scan.scan(first, self.projects.root)
            # what a version-6 store looks like: no api_errors table, every file read to its end
            first.connection.execute("DROP TABLE api_errors")
            first.connection.execute("UPDATE meta SET value = '6' WHERE key = 'schema_version'")
        with store.Store(self.store_path) as second:
            self.assertEqual(scan.scan(second, self.projects.root).files_scanned, 1)
            self.assertEqual(second.connection.execute("SELECT record_id FROM api_errors").fetchone()[0], "e1")

    def test_a_version_7_store_gets_timing_columns_and_reads_its_files_again(self):
        main = self.projects.session("s1")
        main.at(DAY_1).user("hi")
        main.assistant("m1", [text_block("a")], usage(output=5))
        with store.Store(self.store_path) as first:
            scan.scan(first, self.projects.root)
            # what a version-7 store looks like: no timing columns
            first.connection.execute("DROP VIEW usage_rows")
            for table, column in (("messages", "request_ts"), ("messages", "end_ts"), ("tool_calls", "call_ts"),
                                  ("tool_calls", "result_ts"), ("tool_calls", "lines_added"),
                                  ("tool_calls", "lines_removed"), ("transcripts", "last_user_ts")):
                first.connection.execute(f"ALTER TABLE {table} DROP COLUMN {column}")
            first.connection.execute("UPDATE meta SET value = '7' WHERE key = 'schema_version'")
        with store.Store(self.store_path) as second:
            self.assertEqual(scan.scan(second, self.projects.root).files_scanned, 1)
            row = second.connection.execute("SELECT request_ts, end_ts FROM messages").fetchone()
            self.assertEqual(tuple(row), (scan.iso(DAY_1), scan.iso(DAY_1 + timedelta(seconds=1))))

    def test_a_version_8_store_gets_the_effort_column_and_reads_its_files_again(self):
        main = self.projects.session("s1")
        main.at(DAY_1).assistant("m1", [text_block("a")], usage(output=5), effort="max")
        with store.Store(self.store_path) as first:
            scan.scan(first, self.projects.root)
            # what a version-8 store looks like: messages without the effort column
            first.connection.execute("DROP VIEW usage_rows")
            first.connection.execute("ALTER TABLE messages DROP COLUMN effort")
            first.connection.execute("UPDATE meta SET value = '8' WHERE key = 'schema_version'")
        with store.Store(self.store_path) as second:
            self.assertEqual(scan.scan(second, self.projects.root).files_scanned, 1)
            self.assertEqual(second.connection.execute("SELECT effort FROM messages").fetchone()[0], "max")

    def test_a_version_9_store_gets_the_meta_mtime_column(self):
        main = self.projects.session("s1")
        main.at(DAY_1).assistant("m1", [text_block("a")], usage(output=5))
        with store.Store(self.store_path) as first:
            scan.scan(first, self.projects.root)
            # what a version-9 store looks like: transcripts without meta_mtime_ns
            first.connection.execute("ALTER TABLE transcripts DROP COLUMN meta_mtime_ns")
            first.connection.execute("UPDATE meta SET value = '9' WHERE key = 'schema_version'")
        with store.Store(self.store_path) as second:
            columns = {row["name"] for row in second.connection.execute("PRAGMA table_info(transcripts)")}
            self.assertIn("meta_mtime_ns", columns)

    def test_a_version_10_store_gets_compactions_and_spawning_calls_by_reading_its_files_again(self):
        main = self.projects.session("s1")
        main.at(DAY_1).compaction("c1")
        self.projects.subagent("s1", "a1").at(DAY_1).assistant("m1", [text_block("a")], usage(output=5))
        with store.Store(self.store_path) as first:
            scan.scan(first, self.projects.root)
            # what a version-10 store looks like: no compactions table, transcripts without tool_use_id
            first.connection.execute("DROP TABLE compactions")
            first.connection.execute("ALTER TABLE transcripts DROP COLUMN tool_use_id")
            first.connection.execute("UPDATE meta SET value = '10' WHERE key = 'schema_version'")
        with store.Store(self.store_path) as second:
            self.assertEqual(scan.scan(second, self.projects.root).files_scanned, 2)
            self.assertEqual(second.connection.execute("SELECT record_id FROM compactions").fetchone()[0], "c1")
            self.assertEqual(second.connection.execute(
                "SELECT tool_use_id FROM transcripts WHERE agent_id = 'a1'").fetchone()[0], "toolu_a1")

    def test_a_version_11_store_gets_the_workflow_columns(self):
        self.projects.session("s1").at(DAY_1).assistant("m1", [text_block("a")], usage(output=5))
        with store.Store(self.store_path) as first:
            scan.scan(first, self.projects.root)
            # what a version-11 store looks like: transcripts without the workflow columns
            for column in ("workflow_run", "workflow_phase", "workflow_name"):
                first.connection.execute(f"ALTER TABLE transcripts DROP COLUMN {column}")
            first.connection.execute("UPDATE meta SET value = '11' WHERE key = 'schema_version'")
        with store.Store(self.store_path) as second:
            columns = {row["name"] for row in second.connection.execute("PRAGMA table_info(transcripts)")}
            self.assertLessEqual({"workflow_run", "workflow_phase", "workflow_name"}, columns)

    def test_a_version_12_store_gets_ultracode_by_reading_its_files_again(self):
        main = self.projects.session("s1")
        main.at(DAY_1).ultracode("u1")
        main.assistant("m1", [text_block("a")], usage(output=5), effort="xhigh")
        with store.Store(self.store_path) as first:
            scan.scan(first, self.projects.root)
            # what a version-12 store looks like: no ultracode_states table, messages without ultracode
            first.connection.execute("DROP TABLE ultracode_states")
            first.connection.execute("DROP VIEW usage_rows")
            first.connection.execute("ALTER TABLE messages DROP COLUMN ultracode")
            first.connection.execute("UPDATE meta SET value = '12' WHERE key = 'schema_version'")
        with store.Store(self.store_path) as second:
            self.assertEqual(scan.scan(second, self.projects.root).files_scanned, 1)
            self.assertEqual(second.connection.execute("SELECT effort FROM usage_rows").fetchone()[0], "ultracode")

    def test_a_version_13_store_gets_every_snapshot_by_reading_its_files_again(self):
        main = self.projects.session("s1")
        main.at(DAY_1).user("hi")
        main.cost_state({HAIKU: (100, 0, 0, 10, 0.01)})
        main.at(DAY_1 + timedelta(days=1)).user("next day")
        main.cost_state({HAIKU: (300, 0, 0, 30, 0.03)})
        with store.Store(self.store_path) as first:
            scan.scan(first, self.projects.root)
            # what a version-13 store looks like: only the latest snapshot, its background in one row
            first.connection.execute("DROP VIEW usage_rows")
            first.connection.execute("DROP TABLE cost_snapshots")
            first.connection.execute("DROP TABLE background_parts")
            first.connection.execute("UPDATE meta SET value = '13' WHERE key = 'schema_version'")
        with store.Store(self.store_path) as second:
            self.assertEqual(scan.scan(second, self.projects.root).files_scanned, 1)
            self.assertEqual([row[0] for row in second.connection.execute(
                "SELECT output FROM background_parts ORDER BY ts")], [10, 20])

    def test_reopening_leaves_the_schema_alone(self):
        with store.Store(self.store_path) as first:
            before = first.connection.execute("PRAGMA schema_version").fetchone()[0]
        with store.Store(self.store_path) as second:
            self.assertEqual(second.connection.execute("PRAGMA schema_version").fetchone()[0], before)

    def test_an_outdated_view_is_replaced(self):
        with store.Store(self.store_path) as first:
            first.connection.execute("DROP VIEW usage_rows")
            first.connection.execute("CREATE VIEW usage_rows AS SELECT 1 AS turn")
        with store.Store(self.store_path) as second:
            columns = [row["name"] for row in second.connection.execute("PRAGMA table_info(usage_rows)")]
            self.assertIn("effort", columns)

    def test_a_newer_schema_is_refused(self):
        with store.Store(self.store_path):
            pass
        connection = sqlite3.connect(self.store_path)
        connection.execute("UPDATE meta SET value = ? WHERE key = 'schema_version'", (str(store.SCHEMA_VERSION + 1),))
        connection.commit()
        connection.close()
        with self.assertRaises(store.StoreError):
            store.Store(self.store_path)

    def test_an_error_after_sqlite_rolled_back_by_itself_is_raised_as_it_is(self):
        with store.Store(self.store_path) as opened:
            with self.assertRaises(ValueError):
                with opened.transaction():
                    opened.connection.execute("ROLLBACK")        # as SQLite does itself on e.g. a full disk
                    raise ValueError("the original error")

    def test_the_parent_folder_is_created(self):
        with store.Store(self.tmp / "data" / "nested" / "usage.sqlite"):
            pass
        self.assertTrue((self.tmp / "data" / "nested" / "usage.sqlite").exists())


if __name__ == "__main__":
    unittest.main()


def mode(path):
    """A file's or folder's permission bits."""
    return stat.S_IMODE(path.stat().st_mode)


@unittest.skipUnless(os.name == "posix", "POSIX permissions")
class PermissionTest(TempDirTestCase):
    def test_a_new_store_and_its_new_folder_are_its_owners_alone(self):
        path = self.tmp / "history" / "usage.sqlite"
        with store.Store(path):
            pass
        self.assertEqual((mode(path), mode(path.parent)), (0o600, 0o700))

    def test_the_wal_files_follow_the_store(self):
        build_session(self.projects)
        with store.Store(self.store_path) as opened:
            scan.scan(opened, self.projects.root)
            for suffix in ("-wal", "-shm"):
                with self.subTest(suffix=suffix):
                    self.assertEqual(mode(Path(f"{self.store_path}{suffix}")), 0o600)

    def test_an_older_store_open_to_others_is_closed_when_opened(self):
        with store.Store(self.store_path):
            pass
        self.store_path.chmod(0o644)
        with store.Store(self.store_path):
            self.assertEqual(mode(self.store_path), 0o600)

    def test_wal_files_open_to_others_are_closed_too(self):
        with store.Store(self.store_path):
            wal = Path(f"{self.store_path}-wal")
            wal.chmod(0o644)
            with store.Store(self.store_path):
                self.assertEqual(mode(wal), 0o600)

    def test_a_store_of_another_owner_keeps_its_mode(self):
        with store.Store(self.store_path):
            pass
        self.store_path.chmod(0o640)
        with mock.patch.object(store.os, "geteuid", return_value=os.geteuid() + 1):
            with store.Store(self.store_path):
                self.assertEqual(mode(self.store_path), 0o640)

    def test_a_backup_is_its_owners_alone(self):
        target = self.tmp / "backups" / "copy.sqlite"
        with store.Store(self.store_path) as opened:
            store.backup(opened, target)
        self.assertEqual(mode(target), 0o600)

    def test_a_failed_backup_leaves_no_file(self):
        target = self.tmp / "copy.sqlite"
        with store.Store(self.store_path) as opened:
            opened.connection.close()
            with self.assertRaises(sqlite3.Error):
                store.backup(opened, target)
        self.assertFalse(target.exists())
