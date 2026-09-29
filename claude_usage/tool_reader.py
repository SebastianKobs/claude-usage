"""The transcripts' tool calls for the session view and the live cards (tool_kinds.CallReader), kept in memory by path
and read on from where the last read stopped once a file grew: a live transcript costs the lines it added, not its
whole size again. The server reads in reader processes (ReaderPool), each file always in the same one, which keeps
its reading state: a first read of a large file parses it all in Python, and in the server's own process that starved
the thread holding the store lock (four first reads of 100 MB at once held the live list 18.6 s). The tests read in
their own process (ToolsReader), where they can patch the reader. Nothing of it is stored."""
import concurrent.futures
import dataclasses
import multiprocessing
import threading
import zlib
from pathlib import Path
from typing import Any

from claude_usage import pricing
from claude_usage import secret_paths
from claude_usage import tool_kinds

MEMO_LIMIT = 256                        # transcripts whose reader and rows stay in memory, the used last, per reader

Payload = dict[str, Any]


class Reading:
    """A transcript in the memo: its reader, which goes on from where it stopped, the (size, mtime) it last read at
    and the rows it gave then, and a lock that lets one request read it at a time: another one waits, then finds it
    read."""

    def __init__(self, find_secrets: tool_kinds.SecretFinder | None) -> None:
        self.reader = tool_kinds.CallReader(find_secrets)
        self.version: tuple[int, int] | None = None
        self.tools: Payload | None = None
        self.lock = threading.Lock()


class ToolsReader:
    """Each transcript's tool rows, exploration and, with [secrets] patterns, secret accesses, read in the caller's
    thread and kept for the MEMO_LIMIT files used last: their readers' counts, those paths and the texts of the files
    the transcripts wrote, in memory only."""

    def __init__(self, prices: pricing.Prices, secret_settings: secret_paths.SecretSettings | None, home: str) -> None:
        self.prices = prices
        self.find_secrets = (secret_paths.finder(secret_settings.patterns, home, secret_settings.network_programs,
                                                 secret_settings.test_patterns)
                             if secret_settings is not None and secret_settings.patterns else None)
        self.memo: dict[str, Reading] = {}
        self.lock = threading.Lock()

    def tools(self, path: Path) -> Payload | None:
        """A transcript's rows (tool_kinds.TranscriptTools as plain data), read on from where the last read stopped
        once the file changed; None once it is gone."""
        try:
            stat = path.stat()
        except OSError:
            return None
        version = (stat.st_size, stat.st_mtime_ns)
        with self.lock:
            reading = self.memo.pop(str(path), None) or Reading(self.find_secrets)
            self.memo[str(path)] = reading
            while len(self.memo) > MEMO_LIMIT:
                del self.memo[next(iter(self.memo))]
        with reading.lock:
            if reading.version != version:
                try:
                    reading.reader.read(path)
                except OSError:
                    return None
                reading.tools = dataclasses.asdict(reading.reader.tools(self.prices))
                reading.version = version
            return reading.tools

    def close(self) -> None:
        """Nothing to stop: it reads in the caller's thread."""


# a reader process's ToolsReader, made as the process starts (start_worker)
worker: ToolsReader | None = None


def start_worker(prices: pricing.Prices, secret_settings: secret_paths.SecretSettings | None, home: str) -> None:
    """A reader process's start: the ToolsReader it keeps its files' reading state in."""
    global worker
    worker = ToolsReader(prices, secret_settings, home)


def worker_tools(path: Path) -> Payload | None:
    """A transcript's rows, read in this reader process (ToolsReader.tools)."""
    if worker is None:
        raise RuntimeError("the reader process was not started with start_worker")
    return worker.tools(path)


class ReaderPool:
    """ToolsReaders in their own processes, one each, spawned (not forked: the server runs threads) at their first
    read. Each file always goes to the same one (slot), which keeps its reading state; a request only waits for the
    answer, which leaves the server's threads free. A reader process that died is replaced for the next request."""

    def __init__(self, processes: int, prices: pricing.Prices, secret_settings: secret_paths.SecretSettings | None,
                 home: str) -> None:
        self.settings = (prices, secret_settings, home)
        self.lock = threading.Lock()
        self.workers: list[concurrent.futures.Executor] = [self.start() for _ in range(processes)]

    def start(self) -> concurrent.futures.Executor:
        """One reader process, as an executor of one worker that starts with its ToolsReader."""
        return concurrent.futures.ProcessPoolExecutor(1, mp_context=multiprocessing.get_context("spawn"),
                                                      initializer=start_worker, initargs=self.settings)

    def slot(self, path: Path) -> int:
        """The reader process a file always goes to: by a checksum of its path, the same in every run."""
        return zlib.crc32(str(path).encode("utf-8")) % len(self.workers)

    def tools(self, path: Path) -> Payload | None:
        """A transcript's rows from its reader process (ToolsReader.tools); None once it is gone. Raises
        BrokenExecutor where that process died, after starting another one in its place."""
        slot = self.slot(path)
        with self.lock:
            worker_process = self.workers[slot]
        try:
            return worker_process.submit(worker_tools, path).result()
        except concurrent.futures.BrokenExecutor:
            with self.lock:
                if self.workers[slot] is worker_process:
                    self.workers[slot] = self.start()
            raise

    def close(self) -> None:
        """Stop the reader processes, dropping the reads not started yet."""
        with self.lock:
            workers = list(self.workers)
        for worker_process in workers:
            worker_process.shutdown(wait=False, cancel_futures=True)
