"""The SQLite usage history: its schema, the migrations and backups.

Rows go only by the retention (scan.prune): once Claude Code removes a transcript, the store is the only record of
it. Message and tool rows keep only the file path; project, session and agent come from the transcripts table, so a
cwd or meta file that shows up later corrects every row at once. The usage_rows view puts messages and background
rows (see scan.py) side by side, so every query includes both; background rows have no turns. scan.py fills the
store, queries.py reads it.
"""
import sqlite3
from collections.abc import Iterator
from contextlib import contextmanager
from pathlib import Path
from typing import Any

SCHEMA_VERSION = 12                     # 2: cost_states and background; 3: web_searches; 4: start_ts;
                                        # 5: the run totals of cost_states; 6: skill and mcp_server;
                                        # 7: api_errors; 8: the times and lines the run totals
                                        # are estimated from without a cost record; 9: effort;
                                        # 10: meta_mtime_ns; 11: compactions and tool_use_id;
                                        # 12: workflow_run, workflow_phase and workflow_name (the files
                                        # were never read, so no re-read)
REREAD_BELOW = 11                       # stores older than this lack data only a new read of every file gives
SCHEMA = """
CREATE TABLE IF NOT EXISTS meta (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS transcripts (
    path TEXT PRIMARY KEY,
    slug TEXT NOT NULL,
    cwd TEXT,                       -- the first one seen
    project TEXT NOT NULL,          -- cwd, else slug
    session_id TEXT NOT NULL,
    agent_id TEXT,                  -- NULL for the main thread
    agent_type TEXT NOT NULL,
    description TEXT,
    title TEXT,
    git_branch TEXT,
    size INTEGER NOT NULL,
    mtime_ns INTEGER NOT NULL,
    read_offset INTEGER NOT NULL,   -- bytes read so far
    head_hash TEXT,                 -- SHA-256 of the first line, to notice a rewritten file
    first_ts TEXT,
    last_ts TEXT,
    last_user_ts TEXT,              -- of the last user record read: the request of a reply in the next read
    meta_mtime_ns INTEGER,          -- of a subagent's meta file when it was read (NULL without one)
    tool_use_id TEXT,               -- of a subagent: the Agent tool call that spawned it
    workflow_run TEXT,              -- of a workflow agent: its run (wf_...)
    workflow_phase TEXT,            -- the phase it ran in
    workflow_name TEXT              -- and the workflow's name
);
CREATE TABLE IF NOT EXISTS messages (
    message_id TEXT PRIMARY KEY,
    path TEXT NOT NULL,             -- the file that stored the id first owns it
    model TEXT NOT NULL,
    speed TEXT NOT NULL,
    ts TEXT,
    day TEXT,                       -- local date of ts
    new_input INTEGER NOT NULL,
    cache_write_5m INTEGER NOT NULL,
    cache_write_1h INTEGER NOT NULL,
    cache_read INTEGER NOT NULL,
    output INTEGER NOT NULL,
    web_searches INTEGER NOT NULL DEFAULT 0,
    skill TEXT,                     -- the skill Claude Code attributes the call to
    mcp_server TEXT,                -- the MCP server it attributes the call to
    request_ts TEXT,                -- of the last user record before it (a prompt or a tool result)
    end_ts TEXT,                    -- of its last record: request_ts to end_ts is the time waiting on the API
    effort TEXT                     -- the effort level it ran at, e.g. medium, high, max
);
CREATE TABLE IF NOT EXISTS tool_calls (
    tool_use_id TEXT PRIMARY KEY,
    path TEXT NOT NULL,
    tool TEXT NOT NULL,
    result_chars INTEGER,
    call_ts TEXT,                   -- of the record with the call
    result_ts TEXT,                 -- of the record with the result: in between, the tool ran (or waited for
                                    -- permission)
    lines_added INTEGER NOT NULL DEFAULT 0,             -- by an Edit or a Write
    lines_removed INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS cost_states (
    session_id TEXT PRIMARY KEY,
    path TEXT NOT NULL,             -- the main transcript it was read from
    snapshot_ts TEXT,
    start_ts TEXT,                  -- when the process that wrote it started: the snapshot covers only that run
    models TEXT NOT NULL,           -- JSON: [{model, new_input, cache_write, cache_read, output, cost_usd,
                                    --         web_searches}, ...]; older rows: the same as positional lists
    day TEXT,                       -- local date of snapshot_ts
    duration_ms INTEGER NOT NULL DEFAULT 0,             -- wall-clock time of the run
    api_ms INTEGER NOT NULL DEFAULT 0,                  -- waiting on API calls, retries included
    api_ms_without_retries INTEGER NOT NULL DEFAULT 0,
    tool_ms INTEGER NOT NULL DEFAULT 0,                 -- running tools
    lines_added INTEGER NOT NULL DEFAULT 0,
    lines_removed INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS background (
    session_id TEXT NOT NULL,
    model TEXT NOT NULL,
    path TEXT NOT NULL,
    ts TEXT,
    day TEXT,
    new_input INTEGER NOT NULL,
    cache_write INTEGER NOT NULL,   -- no 5m/1h split in cost-state records; priced as 5m
    cache_read INTEGER NOT NULL,
    output INTEGER NOT NULL,
    web_searches INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (session_id, model)
);
CREATE TABLE IF NOT EXISTS api_errors (
    record_id TEXT PRIMARY KEY,     -- the record's uuid
    path TEXT NOT NULL,             -- the file that stored the id first owns it
    ts TEXT,
    day TEXT,                       -- local date of ts
    error TEXT NOT NULL,            -- e.g. rate_limit, server_error
    status INTEGER,                 -- HTTP status, e.g. 429
    limit_type TEXT,                -- for a rate limit, the quota that was hit, e.g. five_hour
    resets_at TEXT                  -- and when it resets
);
CREATE TABLE IF NOT EXISTS compactions (
    record_id TEXT PRIMARY KEY,     -- the compact_boundary record's uuid
    path TEXT NOT NULL,             -- the file that stored the id first owns it
    ts TEXT,
    day TEXT,                       -- local date of ts
    trigger TEXT,                   -- manual or auto; NULL without compactMetadata, like the counts
    pre_tokens INTEGER,             -- the context before
    post_tokens INTEGER,            -- and after
    duration_ms INTEGER
);
CREATE TABLE IF NOT EXISTS dirty_sessions (
    session_id TEXT PRIMARY KEY     -- a file of it was scanned, its background is not recomputed yet
);
"""
# after ADDED_COLUMNS, so an index may use an added column
INDEXES = """
CREATE INDEX IF NOT EXISTS transcripts_session ON transcripts (session_id);
CREATE INDEX IF NOT EXISTS messages_path ON messages (path);
CREATE INDEX IF NOT EXISTS messages_day ON messages (day);
CREATE INDEX IF NOT EXISTS tool_calls_path ON tool_calls (path);
CREATE INDEX IF NOT EXISTS api_errors_day ON api_errors (day);
CREATE INDEX IF NOT EXISTS compactions_path ON compactions (path);
"""
# A view holds no data, so it is replaced whenever its definition here changes.
VIEW = """CREATE VIEW usage_rows AS
SELECT m.path AS path, t.session_id AS session_id, t.agent_id AS agent_id, t.agent_type AS agent_type,
       t.project AS project, t.slug AS slug, m.model AS model, m.speed AS speed, m.ts AS ts, m.day AS day,
       m.new_input AS new_input, m.cache_write_5m AS cache_write_5m, m.cache_write_1h AS cache_write_1h,
       m.cache_read AS cache_read, m.output AS output, m.web_searches AS web_searches, 1 AS turn,
       m.skill AS skill, m.mcp_server AS mcp_server, m.effort AS effort
FROM messages m JOIN transcripts t ON t.path = m.path
UNION ALL
SELECT b.path, b.session_id, NULL, '(background)', t.project, t.slug, b.model, 'standard', b.ts, b.day,
       b.new_input, b.cache_write, 0, b.cache_read, b.output, b.web_searches, 0, NULL, NULL, NULL
FROM background b JOIN transcripts t ON t.path = b.path"""
BACKGROUND = "(background)"               # the agent type of background rows, as in VIEW
# the run totals of a cost-state record, as cost_states columns and CostState fields
RUN_FIELDS = ("duration_ms", "api_ms", "api_ms_without_retries", "tool_ms", "lines_added", "lines_removed")
# columns added after version 1, for stores created before them: (table, column, declaration). No comma in the
# comment before a table's last column: SQLite's DROP COLUMN, which the migration tests use, takes it for the
# separator.
ADDED_COLUMNS = (("messages", "web_searches", "INTEGER NOT NULL DEFAULT 0"),
                 ("background", "web_searches", "INTEGER NOT NULL DEFAULT 0"),
                 ("cost_states", "start_ts", "TEXT"),
                 ("cost_states", "day", "TEXT"),
                 ("messages", "skill", "TEXT"),
                 ("messages", "mcp_server", "TEXT"),
                 ("messages", "request_ts", "TEXT"),
                 ("messages", "end_ts", "TEXT"),
                 ("messages", "effort", "TEXT"),
                 ("tool_calls", "call_ts", "TEXT"),
                 ("tool_calls", "result_ts", "TEXT"),
                 ("tool_calls", "lines_added", "INTEGER NOT NULL DEFAULT 0"),
                 ("tool_calls", "lines_removed", "INTEGER NOT NULL DEFAULT 0"),
                 ("transcripts", "last_user_ts", "TEXT"),
                 ("transcripts", "meta_mtime_ns", "INTEGER"),
                 ("transcripts", "tool_use_id", "TEXT"),
                 ("transcripts", "workflow_run", "TEXT"),
                 ("transcripts", "workflow_phase", "TEXT"),
                 ("transcripts", "workflow_name", "TEXT"),
                 *(("cost_states", column, "INTEGER NOT NULL DEFAULT 0") for column in RUN_FIELDS))
Row = dict[str, Any]


class StoreError(Exception):
    """The store can't be used, e.g. it was written by a newer version of this tool."""


class Store:
    """An open usage history. Usable as a context manager; pass check_same_thread=False to share it between the
    server's threads (the server serializes access with a lock)."""

    def __init__(self, path: Path, check_same_thread: bool = True) -> None:
        path.parent.mkdir(parents=True, exist_ok=True)
        self.path = path
        # autocommit mode: transactions are opened explicitly, one per scanned file
        self.connection = sqlite3.connect(path, isolation_level=None, check_same_thread=check_same_thread,
                                          timeout=10)
        self.connection.row_factory = sqlite3.Row
        try:
            self.migrate()
        except Exception:
            self.connection.close()
            raise

    def migrate(self) -> None:
        """Create missing tables and check the schema version. Migrations only ever add."""
        self.connection.execute("PRAGMA journal_mode = WAL")      # a cron scan may run while the server reads
        self.connection.executescript(SCHEMA)
        # one writer at a time: a cron scan and the server opening an old store together would both add columns
        with self.transaction():
            row = self.connection.execute("SELECT value FROM meta WHERE key = 'schema_version'").fetchone()
            if row is None:
                self.connection.execute("INSERT INTO meta (key, value) VALUES ('schema_version', ?)",
                                        (str(SCHEMA_VERSION),))
            elif int(row["value"]) > SCHEMA_VERSION:
                raise StoreError(f"{self.path} has schema version {row['value']}, newer than this tool's "
                                 f"{SCHEMA_VERSION}; update claude-usage")
            elif int(row["value"]) < SCHEMA_VERSION:
                self.add_missing_columns()
                if int(row["value"]) < REREAD_BELOW:
                    # older versions didn't keep all of the data: read every file again on the next scan (the
                    # upserts make that idempotent; no row is removed)
                    self.connection.execute("UPDATE transcripts SET read_offset = 0, size = -1")
                self.connection.execute("UPDATE meta SET value = ? WHERE key = 'schema_version'",
                                        (str(SCHEMA_VERSION),))
            view = self.connection.execute(
                "SELECT sql FROM sqlite_master WHERE type = 'view' AND name = 'usage_rows'").fetchone()
            if view is None or view["sql"] != VIEW:
                self.connection.execute("DROP VIEW IF EXISTS usage_rows")
                self.connection.execute(VIEW)
        self.connection.executescript(INDEXES)

    def add_missing_columns(self) -> None:
        """Add the columns of ADDED_COLUMNS that a store from an older version lacks."""
        for table, column, declaration in ADDED_COLUMNS:
            existing = {row["name"] for row in self.connection.execute(f"PRAGMA table_info({table})")}
            if column not in existing:
                self.connection.execute(f"ALTER TABLE {table} ADD COLUMN {column} {declaration}")

    @contextmanager
    def transaction(self) -> Iterator[None]:
        """Commit everything inside the block together, or nothing if it raises."""
        self.connection.execute("BEGIN IMMEDIATE")
        try:
            yield
        except BaseException:
            if self.connection.in_transaction:        # SQLite may have rolled back by itself, e.g. on a full disk
                self.connection.execute("ROLLBACK")
            raise
        self.connection.execute("COMMIT")

    def close(self) -> None:
        """Close the connection."""
        self.connection.close()

    def __enter__(self) -> "Store":
        return self

    def __exit__(self, *exc_info: object) -> None:
        self.close()


def backup(store: Store, target: Path) -> None:
    """A consistent copy of the store in a new file (VACUUM INTO, safe while others read or scan); raises
    StoreError if target exists, so a backup never overwrites anything."""
    if target.exists():
        raise StoreError(f"{target} exists; pick a new file for the backup")
    target.parent.mkdir(parents=True, exist_ok=True)
    store.connection.execute("VACUUM INTO ?", (str(target),))
