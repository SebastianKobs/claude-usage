"""tool_reader.py: the transcripts' tool calls kept in memory by path and read on from where they stopped, in the
server's own process (ToolsReader) or in reader processes (ReaderPool)."""
import concurrent.futures
import threading
from unittest import mock

from claude_usage import secret_paths
from claude_usage import tool_kinds
from claude_usage import tool_reader
from helpers import PRICES
from helpers import TempDirTestCase
from helpers import tool_use_block
from helpers import usage

SETTINGS = secret_paths.SecretSettings((".env",), frozenset({"curl"}), ("tests",))
READ = tool_kinds.CallReader.read


def counted_reads():
    """CallReader.read, counting its calls."""
    return mock.patch.object(tool_kinds.CallReader, "read", autospec=True, side_effect=READ)


class ReaderCase(TempDirTestCase):
    """A session whose main thread made one Read call, and one other session."""

    def setUp(self):
        super().setUp()
        self.main = self.projects.session("s1")
        self.main.assistant("m1", [tool_use_block("t1", "Read", {"file_path": "a.go"})], usage(output=5))
        self.main.tool_result("t1", "abc")
        self.other = self.projects.session("s2")
        self.other.assistant("m2", [tool_use_block("t2", "Grep", {"pattern": "x"})], usage(output=5))


class ToolsReaderTest(ReaderCase):
    def setUp(self):
        super().setUp()
        self.reader = tool_reader.ToolsReader(PRICES, SETTINGS, "/home/dev")

    def test_the_rows_and_secret_accesses_of_a_transcript(self):
        self.main.assistant("m3", [tool_use_block("t3", "Read", {"file_path": ".env"})], usage(output=5))
        tools = self.reader.tools(self.main.path)
        self.assertEqual(tools["rows"][0]["calls"], 2)
        self.assertEqual([access["path"] for access in tools["secret_accesses"]], [".env"])

    def test_an_unchanged_transcript_is_not_read_again(self):
        with counted_reads() as read:
            self.reader.tools(self.main.path)
            self.reader.tools(self.main.path)
        self.assertEqual(read.call_count, 1)

    def test_a_changed_transcript_is_read_on_from_where_it_stopped(self):
        self.reader.tools(self.main.path)
        self.main.assistant("m3", [tool_use_block("t3", "Read", {"file_path": "b.go"})], usage(output=5))
        add = mock.patch.object(tool_kinds.CallReader, "add", autospec=True, side_effect=tool_kinds.CallReader.add)
        with add as added:
            self.assertEqual(self.reader.tools(self.main.path)["rows"][0]["calls"], 2)
        self.assertEqual(added.call_count, 1)

    def test_a_changed_transcript_asked_for_twice_at_once_is_read_once(self):
        started = threading.Event()
        release = threading.Event()
        reads = []

        def slow_read(reader, path):
            """CallReader.read, counted, once the test lets it go on."""
            reads.append(path)
            started.set()
            release.wait(10)
            READ(reader, path)

        results = []
        with mock.patch.object(tool_kinds.CallReader, "read", autospec=True, side_effect=slow_read):
            first = threading.Thread(target=lambda: results.append(self.reader.tools(self.main.path)))
            first.start()
            started.wait(10)
            second = threading.Thread(target=lambda: results.append(self.reader.tools(self.main.path)))
            second.start()
            second.join(0.3)                # long enough to start a read of its own, if it would
            release.set()
            first.join(10)
            second.join(10)
        self.assertEqual(len(reads), 1)
        self.assertEqual(results[0], results[1])

    def test_the_memo_keeps_the_transcripts_used_last(self):
        third = self.projects.session("s3")
        third.assistant("m4", [tool_use_block("t4", "Read", {"file_path": "c.go"})], usage(output=5))
        with mock.patch.object(tool_reader, "MEMO_LIMIT", 2):
            with counted_reads() as read:
                for path in (self.main.path, self.other.path, self.main.path, third.path, self.main.path):
                    self.reader.tools(path)
        self.assertEqual(read.call_count, 3)                    # the main thread stayed, as it was used again

    def test_a_gone_transcript_has_none(self):
        self.reader.tools(self.main.path)
        self.main.path.unlink()
        self.assertIsNone(self.reader.tools(self.main.path))

    def test_without_secret_patterns_no_access_is_listed(self):
        self.main.assistant("m3", [tool_use_block("t3", "Read", {"file_path": ".env"})], usage(output=5))
        reader = tool_reader.ToolsReader(PRICES, secret_paths.SecretSettings((), frozenset(), ()), "/home/dev")
        self.assertEqual(reader.tools(self.main.path)["secret_accesses"], ())


class ReaderPoolTest(ReaderCase):
    def setUp(self):
        super().setUp()
        self.pool = tool_reader.ReaderPool(2, PRICES, SETTINGS, "/home/dev")
        self.addCleanup(self.pool.close)

    def test_the_transcripts_are_read_in_the_reader_processes(self):
        self.main.assistant("m3", [tool_use_block("t3", "Read", {"file_path": ".env"})], usage(output=5))
        with mock.patch.object(tool_kinds.CallReader, "read", side_effect=AssertionError("read in this process")):
            tools = self.pool.tools(self.main.path)
        self.assertEqual(tools["rows"][0]["calls"], 2)
        self.assertEqual([access["path"] for access in tools["secret_accesses"]], [".env"])

    def test_a_grown_transcript_gives_its_new_calls(self):
        self.pool.tools(self.main.path)
        self.main.assistant("m3", [tool_use_block("t3", "Read", {"file_path": "b.go"})], usage(output=5))
        self.assertEqual(self.pool.tools(self.main.path)["rows"][0]["calls"], 2)

    def test_each_transcript_always_goes_to_the_same_process(self):
        slots = {self.pool.slot(self.main.path) for _ in range(3)}
        self.assertEqual(len(slots), 1)
        self.assertIn(slots.pop(), range(2))

    def test_a_gone_transcript_has_none(self):
        self.main.path.unlink()
        self.assertIsNone(self.pool.tools(self.main.path))

    def test_a_reader_process_that_broke_is_replaced(self):
        broken = concurrent.futures.Future()
        broken.set_exception(concurrent.futures.BrokenExecutor("a reader died"))
        failing = mock.Mock(submit=mock.Mock(return_value=broken))
        slot = self.pool.slot(self.main.path)
        self.pool.workers[slot] = failing
        with self.assertRaises(concurrent.futures.BrokenExecutor):
            self.pool.tools(self.main.path)
        self.assertIsNot(self.pool.workers[slot], failing)
        self.assertEqual(self.pool.tools(self.main.path)["rows"][0]["calls"], 1)
