"""The SQLite usage history and the queries behind the report and the dashboard.

scan() reads each transcript from where the last scan stopped (the stored byte offset) and merges the new part into
the rows it already has, in one transaction per file. Rows are never deleted: once Claude Code removes a transcript,
the store is the only record of it. Message and tool rows keep only the file path; project, session and agent come
from the transcripts table, so a cwd or meta file that shows up later corrects every row at once.

Background usage: when a session ends, Claude Code writes a cost-state record with its cumulative usage per model,
including calls no transcript shows (Haiku for titles, classifiers). The latest one per session is kept in
cost_states; after each scan, the background table gets, per session and model, what that snapshot counts beyond
the transcripts up to the snapshot time (per category, never below 0). The usage_rows view puts messages and
background rows side by side, so every query includes both; background rows have no turns.
"""
import hashlib
import json
import sqlite3
import statistics
import time
from collections.abc import Iterator
from contextlib import contextmanager
from dataclasses import dataclass
from datetime import UTC
from datetime import date
from datetime import datetime
from pathlib import Path
from typing import Any

from claude_usage import pricing
from claude_usage import transcripts

SCHEMA_VERSION = 10                     # 2: cost_states and background; 3: web_searches; 4: start_ts;
                                        # 5: the run totals of cost_states; 6: skill and mcp_server;
                                        # 7: api_errors; 8: the times and lines the run totals
                                        # are estimated from without a cost record; 9: effort;
                                        # 10: meta_mtime_ns
REREAD_BELOW = 9                        # stores older than this lack data only a new read of every file gives
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
    meta_mtime_ns INTEGER           -- of a subagent's meta file when it was read, NULL without one
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
    models TEXT NOT NULL,           -- JSON: [[model, new_input, cache_write, cache_read, output, cost_usd,
                                    --         web_searches], ...]
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
# columns added after version 1, for stores created before them: (table, column, declaration)
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
                 *(("cost_states", column, "INTEGER NOT NULL DEFAULT 0") for column in RUN_FIELDS))
TOKEN_FIELDS = ("new_input", "cache_write_5m", "cache_write_1h", "cache_read", "output")
TOKEN_SUMS = ", ".join(f"SUM(u.{field}) AS {field}" for field in TOKEN_FIELDS)
USAGE_SUMS = f"SUM(u.turn) AS turns, COUNT(*) AS row_count, SUM(u.web_searches) AS web_searches, {TOKEN_SUMS}"
CONTEXT = "(m.new_input + m.cache_write_5m + m.cache_write_1h + m.cache_read)"
# group name -> the columns it groups by, as (SQL expression, result key)
GROUPS = {
    "day": (("u.day", "day"),),
    "model": (("u.model", "model"),),
    "agent_type": (("u.agent_type", "agent_type"),),
    "project": (("u.project", "project"),),
    # None for the turns without one
    "skill": (("u.skill", "skill"),),
    "mcp_server": (("u.mcp_server", "mcp_server"),),
    "effort": (("u.effort", "effort"),),
    "model_effort": (("u.model", "model"), ("u.effort", "effort")),
    "day_model_effort": (("u.day", "day"), ("u.model", "model"), ("u.effort", "effort")),
    "hour_model_effort": (("strftime('%Y-%m-%dT%H', u.ts, 'localtime')", "hour"), ("u.model", "model"),
                          ("u.effort", "effort")),
    "day_model": (("u.day", "day"), ("u.model", "model")),
    # ts is UTC; SQLite's localtime uses the same zone as local_day, so an hour falls on its day
    "hour_model": (("strftime('%Y-%m-%dT%H', u.ts, 'localtime')", "hour"), ("u.model", "model")),
}
COST_PARTS = ("new_input", "cache_write", "cache_read", "output", "web_search")
BACKGROUND_FIELDS = ("new_input", "cache_write", "cache_read", "output", "web_searches")
BACKGROUND_DESCRIPTION = "calls Claude Code counted that no transcript shows, e.g. Haiku for titles"
DEFAULT_SESSION_LIMIT = 50
DEFAULT_COSTLY_LIMIT = 10
DEFAULT_EVENT_LIMIT = 50
# api_errors_by group -> the column it counts by, as (SQL expression, result key)
ERROR_GROUPS = {
    "day": ("e.day", "day"),
    # ts is UTC; SQLite's localtime uses the same zone as local_day, as in GROUPS
    "hour": ("strftime('%Y-%m-%dT%H', e.ts, 'localtime')", "hour"),
}
NO_LIMIT = -1                             # SQLite's LIMIT for all rows
ID_BATCH = 500                            # ids per IN list: SQLite before 3.32 allows 999 variables
# effort levels from least to most; others sort after them by name, as on the dashboard
EFFORT_ORDER = ("low", "medium", "high", "xhigh", "max")

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


# --- scanning ----------------------------------------------------------------------------------------------------

@dataclass(frozen=True)
class ScanResult:
    """What one scan did."""
    files_scanned: int
    files_skipped: int                  # unchanged since the last scan
    messages_upserted: int
    bytes_read: int
    errors: tuple[str, ...] = ()        # files that vanished or couldn't be read, with the reason


def iso(moment: datetime | None) -> str | None:
    """A timestamp as ISO text in UTC with fixed millisecond precision, so text order is time order."""
    if moment is None:
        return None
    return moment.astimezone(UTC).isoformat(timespec="milliseconds")


def local_day(moment: datetime | None) -> str | None:
    """The local calendar date of a timestamp, for grouping by day."""
    if moment is None:
        return None
    return moment.astimezone().date().isoformat()


def head_hash(path: Path) -> str | None:
    """SHA-256 of the file's first line, or None while it has no complete line."""
    with path.open("rb") as handle:
        line = handle.readline()
    if not line.endswith(b"\n"):
        return None
    return hashlib.sha256(line).hexdigest()


def upsert_transcript(store: Store, chunk: transcripts.Chunk, size: int, mtime_ns: int, meta_mtime_ns: int | None,
                      head: str | None) -> None:
    """Insert or merge the file's row: title and branch take the newest value, cwd and first_ts the first one."""
    store.connection.execute("""
        INSERT INTO transcripts (path, slug, cwd, project, session_id, agent_id, agent_type, description, title,
                                 git_branch, size, mtime_ns, meta_mtime_ns, read_offset, head_hash, first_ts,
                                 last_ts, last_user_ts)
        VALUES (:path, :slug, :cwd, COALESCE(:cwd, :slug), :session_id, :agent_id, :agent_type, :description,
                :title, :git_branch, :size, :mtime_ns, :meta_mtime_ns, :read_offset, :head_hash, :first_ts,
                :last_ts, :last_user_ts)
        ON CONFLICT (path) DO UPDATE SET
            cwd = COALESCE(transcripts.cwd, excluded.cwd),
            project = COALESCE(transcripts.cwd, excluded.cwd, excluded.slug),
            agent_type = CASE WHEN excluded.agent_type = :unknown THEN transcripts.agent_type
                              ELSE excluded.agent_type END,
            description = COALESCE(excluded.description, transcripts.description),
            title = COALESCE(excluded.title, transcripts.title),
            git_branch = COALESCE(excluded.git_branch, transcripts.git_branch),
            size = excluded.size,
            mtime_ns = excluded.mtime_ns,
            meta_mtime_ns = excluded.meta_mtime_ns,
            read_offset = excluded.read_offset,
            head_hash = excluded.head_hash,
            first_ts = MIN(COALESCE(transcripts.first_ts, excluded.first_ts),
                           COALESCE(excluded.first_ts, transcripts.first_ts)),
            last_ts = MAX(COALESCE(transcripts.last_ts, excluded.last_ts),
                          COALESCE(excluded.last_ts, transcripts.last_ts)),
            last_user_ts = COALESCE(excluded.last_user_ts, transcripts.last_user_ts)
        """, {"path": str(chunk.path), "slug": chunk.slug, "cwd": chunk.cwd, "session_id": chunk.session_id,
              "agent_id": chunk.agent_id, "agent_type": chunk.agent_type, "description": chunk.description,
              "title": chunk.title, "git_branch": chunk.git_branch, "size": size, "mtime_ns": mtime_ns,
              "meta_mtime_ns": meta_mtime_ns,
              "read_offset": chunk.end_offset, "head_hash": head, "first_ts": iso(chunk.first_ts),
              "last_ts": iso(chunk.last_ts), "last_user_ts": iso(chunk.last_user_ts),
              "unknown": transcripts.UNKNOWN_AGENT_TYPE})


def upsert_messages(store: Store, chunk: transcripts.Chunk) -> int:
    """Insert new messages and update the counters of those this file owns; returns the rows changed. A copy of an
    id in another file (a forked or resumed session) changes nothing; ts and request_ts keep the first read's
    time, and end_ts moves to the latest record of a message split across reads."""
    cursor = store.connection.executemany("""
        INSERT INTO messages (message_id, path, model, speed, ts, day, new_input, cache_write_5m, cache_write_1h,
                              cache_read, output, web_searches, skill, mcp_server, request_ts, end_ts, effort)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT (message_id) DO UPDATE SET
            model = excluded.model,
            speed = excluded.speed,
            new_input = excluded.new_input,
            cache_write_5m = excluded.cache_write_5m,
            cache_write_1h = excluded.cache_write_1h,
            cache_read = excluded.cache_read,
            output = excluded.output,
            web_searches = excluded.web_searches,
            skill = COALESCE(excluded.skill, messages.skill),
            mcp_server = COALESCE(excluded.mcp_server, messages.mcp_server),
            effort = COALESCE(excluded.effort, messages.effort),
            request_ts = COALESCE(messages.request_ts, excluded.request_ts),
            end_ts = MAX(COALESCE(messages.end_ts, excluded.end_ts), COALESCE(excluded.end_ts, messages.end_ts))
        WHERE messages.path = excluded.path
        """, [(message.message_id, str(chunk.path), message.model, message.speed, iso(message.timestamp),
               local_day(message.timestamp), message.new_input, message.cache_write_5m, message.cache_write_1h,
               message.cache_read, message.output, message.web_searches, message.skill, message.mcp_server,
               iso(message.request_ts), iso(message.end_ts), message.effort) for message in chunk.messages])
    return max(cursor.rowcount, 0)


def insert_tool_calls(store: Store, chunk: transcripts.Chunk) -> None:
    """Insert the chunk's tool calls; ids already stored (by this or another file) are kept as they are."""
    store.connection.executemany(
        "INSERT OR IGNORE INTO tool_calls (tool_use_id, path, tool, result_chars, call_ts) VALUES (?, ?, ?, NULL, ?)",
        [(call.tool_use_id, str(chunk.path), call.tool, iso(call.timestamp)) for call in chunk.tool_calls])


def update_tool_results(store: Store, chunk: transcripts.Chunk) -> None:
    """Set the result size, time and changed lines on the calls this file owns; a result without a known call is
    dropped."""
    store.connection.executemany(
        "UPDATE tool_calls SET result_chars = ?, result_ts = ?, lines_added = ?, lines_removed = ? "
        "WHERE tool_use_id = ? AND path = ?",
        [(result.chars, iso(result.timestamp), result.lines_added, result.lines_removed, result.tool_use_id,
          str(chunk.path)) for result in chunk.tool_results])


def insert_api_errors(store: Store, chunk: transcripts.Chunk) -> None:
    """Insert the chunk's failed API calls; ids already stored (by this or another file) are kept as they are."""
    store.connection.executemany(
        "INSERT OR IGNORE INTO api_errors (record_id, path, ts, day, error, status, limit_type, resets_at) "
        "VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [(error.record_id, str(chunk.path), iso(error.timestamp), local_day(error.timestamp), error.error,
          error.status, error.limit_type, iso(error.resets_at)) for error in chunk.api_errors])


def upsert_cost_state(store: Store, chunk: transcripts.Chunk, previous_last_ts: str | None) -> None:
    """Keep the session's newest cost-state snapshot (only main transcripts write them). Without a timestamped
    record before it in this read, the snapshot time is the last one seen in earlier reads."""
    cost_state = chunk.cost_state
    if cost_state is None or chunk.agent_id is not None:
        return
    models = [[model.model, model.new_input, model.cache_write, model.cache_read, model.output, model.cost_usd,
               model.web_searches] for model in cost_state.models]
    snapshot_ts = iso(cost_state.snapshot_ts) or previous_last_ts
    snapshot = datetime.fromisoformat(snapshot_ts) if snapshot_ts else None
    run_columns = ", ".join(RUN_FIELDS)
    run_updates = ", ".join(f"{field} = excluded.{field}" for field in RUN_FIELDS)
    store.connection.execute(f"""
        INSERT INTO cost_states (session_id, path, snapshot_ts, start_ts, models, day, {run_columns})
        VALUES (?, ?, ?, ?, ?, ?, {", ".join("?" for _ in RUN_FIELDS)})
        ON CONFLICT (session_id) DO UPDATE SET path = excluded.path, snapshot_ts = excluded.snapshot_ts,
                                               start_ts = excluded.start_ts, models = excluded.models,
                                               day = excluded.day, {run_updates}
        """, (chunk.session_id, str(chunk.path), snapshot_ts, iso(cost_state.start_ts), json.dumps(models),
              local_day(snapshot), *(getattr(cost_state, field) for field in RUN_FIELDS)))


def update_background(store: Store, session_ids: set[str]) -> None:
    """Recompute the background rows of these sessions: per model and category, what the latest cost-state
    snapshot counts beyond the session's transcripts between the process start and the snapshot time (the span the
    snapshot covers), never below 0."""
    for session_id in sorted(session_ids):
        store.connection.execute("DELETE FROM background WHERE session_id = ?", (session_id,))
        state = store.connection.execute("SELECT * FROM cost_states WHERE session_id = ?", (session_id,)).fetchone()
        if state is None:
            continue
        seen = {row["model"]: row for row in store.connection.execute("""
            SELECT m.model AS model, SUM(m.new_input) AS new_input,
                   SUM(m.cache_write_5m + m.cache_write_1h) AS cache_write, SUM(m.cache_read) AS cache_read,
                   SUM(m.output) AS output, SUM(m.web_searches) AS web_searches
            FROM messages m JOIN transcripts t ON t.path = m.path
            WHERE t.session_id = :session AND (:snapshot IS NULL OR m.ts <= :snapshot)
              AND (:start IS NULL OR m.ts >= :start)
            GROUP BY m.model""", {"session": session_id, "snapshot": state["snapshot_ts"], "start": state["start_ts"]})}
        snapshot = datetime.fromisoformat(state["snapshot_ts"]) if state["snapshot_ts"] else None
        for entry in json.loads(state["models"]):
            model = entry[0]
            # new_input, cache_write, cache_read, output, then web_searches after cost_usd
            counted = [*entry[1:5], entry[6] if len(entry) > 6 else 0]
            row = seen.get(model)
            in_transcripts = [row[field] or 0 for field in BACKGROUND_FIELDS] if row else [0] * len(BACKGROUND_FIELDS)
            missing = [max(0, total - known) for total, known in zip(counted, in_transcripts)]
            if not any(missing):
                continue
            store.connection.execute(
                "INSERT INTO background (session_id, model, path, ts, day, new_input, cache_write, cache_read, "
                "output, web_searches) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                (session_id, model, state["path"], state["snapshot_ts"], local_day(snapshot), *missing))


def meta_modified_ns(path: Path) -> int | None:
    """The mtime of a subagent's meta file, or None for a main transcript or a subagent without one (yet)."""
    if not transcripts.is_subagent_file(path):
        return None
    try:
        return transcripts.meta_path(path).stat().st_mtime_ns
    except OSError:
        return None


def scan_file(store: Store, path: Path, known: sqlite3.Row | None) -> tuple[int, int] | None:
    """Read what's new in one file and merge it in one transaction; returns (messages upserted, bytes read), or
    None if the file is unchanged. A file that shrank below the stored offset or got a new first line was rewritten,
    so it's read again from the start (the upserts make that idempotent)."""
    stat = path.stat()
    meta_mtime_ns = meta_modified_ns(path)
    # a meta file written after the transcript stopped growing still gets read
    if (known is not None and known["size"] == stat.st_size and known["mtime_ns"] == stat.st_mtime_ns
            and known["meta_mtime_ns"] == meta_mtime_ns):
        return None
    head = head_hash(path)
    offset = 0
    last_user_ts = None
    if known is not None:
        rewritten = (stat.st_size < known["read_offset"]
                     or (known["head_hash"] is not None and head != known["head_hash"]))
        if not rewritten:
            offset = known["read_offset"]
            last_user_ts = datetime.fromisoformat(known["last_user_ts"]) if known["last_user_ts"] else None
    chunk = transcripts.parse(path, offset, last_user_ts)
    with store.transaction():
        upsert_cost_state(store, chunk, known["last_ts"] if known is not None else None)
        upsert_transcript(store, chunk, stat.st_size, stat.st_mtime_ns, meta_mtime_ns, head)
        upserted = upsert_messages(store, chunk)
        insert_tool_calls(store, chunk)
        update_tool_results(store, chunk)
        insert_api_errors(store, chunk)
        # with the file's data, so a scan that stops before update_background leaves the session for the next one
        store.connection.execute("INSERT OR IGNORE INTO dirty_sessions (session_id) VALUES (?)", (chunk.session_id,))
    return upserted, chunk.end_offset - offset


def scan(store: Store, projects_dir: Path, project_filter: str | None = None) -> ScanResult:
    """One incremental scan of all transcripts below projects_dir, or of one project's (by its path)."""
    paths = transcripts.find_transcripts(projects_dir)
    if project_filter is not None:
        wanted = transcripts.slug_for(project_filter)
        paths = [path for path in paths if transcripts.project_slug(path) == wanted]
    known = {row["path"]: row for row in store.connection.execute(
        "SELECT path, session_id, size, mtime_ns, meta_mtime_ns, read_offset, head_hash, last_ts, last_user_ts "
        "FROM transcripts")}
    scanned = 0
    skipped = 0
    upserted = 0
    bytes_read = 0
    errors = []
    for path in paths:
        try:
            outcome = scan_file(store, path, known.get(str(path)))
        except sqlite3.Error:
            raise                           # the store itself failed: every other file would fail the same way
        except Exception as exc:            # this file only: it vanished, or holds something the parser trips on
            # one bad file must not keep every file after it out of the store until Claude Code deletes them
            errors.append(f"{path}: {exc}")
            continue
        if outcome is None:
            skipped += 1
            continue
        scanned += 1
        upserted += outcome[0]
        bytes_read += outcome[1]
    # after all files, so every transcript of a touched session is in the store, whatever order they're listed in
    with store.transaction():
        dirty = {row["session_id"] for row in store.connection.execute("SELECT session_id FROM dirty_sessions")}
        update_background(store, dirty)
        store.connection.execute("DELETE FROM dirty_sessions")
    return ScanResult(scanned, skipped, upserted, bytes_read, tuple(errors))


# --- queries -----------------------------------------------------------------------------------------------------

class UsageSum:
    """Adds up token counts and cost over (model, speed) groups; models without a price count as unpriced."""

    def __init__(self) -> None:
        self.turns = 0
        self.tokens = dict.fromkeys(TOKEN_FIELDS, 0)
        self.web_searches = 0
        self.cost = 0.0
        self.cost_parts = dict.fromkeys(COST_PARTS, 0.0)
        self.priced_rows = 0
        self.unpriced_rows = 0
        self.unpriced_turns = 0

    def add(self, row: sqlite3.Row, prices: pricing.Prices) -> None:
        """Add one row with turns, row_count, web_searches, the TOKEN_FIELDS sums, price_model and speed. The
        web-search fee counts whether or not the model has a price."""
        counts = {field: row[field] or 0 for field in TOKEN_FIELDS}
        for field, value in counts.items():
            self.tokens[field] += value
        self.turns += row["turns"]
        searches = row["web_searches"] or 0
        self.web_searches += searches
        fee = pricing.web_search_cost(prices, searches)
        self.cost += fee
        self.cost_parts["web_search"] += fee
        parts = pricing.cost_parts(prices, row["price_model"], row["speed"], **counts)
        cost = None if parts is None else sum(parts.values())
        for part, value in (parts or {}).items():
            self.cost_parts[part] += value
        if cost is None:
            self.unpriced_turns += row["turns"]
            self.unpriced_rows += row["row_count"]
        else:
            self.cost += cost
            self.priced_rows += row["row_count"]

    def as_dict(self) -> Row:
        """The sums as JSON-ready fields; cost is None only if nothing had a price."""
        cost = None if self.priced_rows == 0 and self.unpriced_rows > 0 else self.cost
        return {"turns": self.turns, **self.tokens,
                "cache_write": self.tokens["cache_write_5m"] + self.tokens["cache_write_1h"],
                "web_searches": self.web_searches, "cost": cost, "cost_parts": dict(self.cost_parts),
                "unpriced_turns": self.unpriced_turns}


USAGE_FIELDS = ("turns", *TOKEN_FIELDS, "cache_write", "web_searches", "unpriced_turns")


def combined(rows: list[Row]) -> Row:
    """The sum of usage rows (e.g. the rows of all models) as one row; cost is None only if no turn had a price."""
    total: Row = {field: sum(row[field] for row in rows) for field in USAGE_FIELDS}
    costs = [row["cost"] for row in rows if row["cost"] is not None]
    total["cost"] = sum(costs) if costs or not rows else None
    total["cost_parts"] = {part: sum(row["cost_parts"][part] for row in rows) for part in COST_PARTS}
    return total


def usage_where(store: Store, condition: str, parameters: tuple[Any, ...], prices: pricing.Prices) -> UsageSum:
    """The UsageSum of the usage rows (messages and background) matching an SQL condition over u."""
    total = UsageSum()
    rows = store.connection.execute(
        f"SELECT u.model AS price_model, u.speed AS speed, {USAGE_SUMS} "
        f"FROM usage_rows u WHERE {condition} GROUP BY u.model, u.speed", parameters)
    for row in rows:
        total.add(row, prices)
    return total


def project_slug(project: str | None) -> str | None:
    """The slug a project path filter compares with, or None for no filter."""
    if project is None:
        return None
    return transcripts.slug_for(project)


@dataclass(frozen=True)
class FilterColumns:
    """The columns a range filter compares: the local day, the project slug and the session id."""
    day: str
    slug: str
    session: str


USAGE_COLUMNS = FilterColumns("u.day", "u.slug", "u.session_id")
ERROR_COLUMNS = FilterColumns("e.day", "t.slug", "t.session_id")
MESSAGE_COLUMNS = FilterColumns("m.day", "t.slug", "t.session_id")
COST_STATE_COLUMNS = FilterColumns("c.day", "t.slug", "t.session_id")


def range_filter(columns: FilterColumns, since: date | None, until: date | None, project: str | None = None,
                 session_id: str | None = None) -> tuple[str, Row]:
    """An SQL condition and its parameters for the local days since up to until (both inclusive), one project path
    and one session, each only if given ("1" without any). Only the set ones become clauses: a clause like
    `(:since IS NULL OR day >= :since)` keeps SQLite from using the day index."""
    clauses = []
    parameters: Row = {}
    for name, value, clause in (("since", since, f"{columns.day} >= :since"),
                                ("until", until, f"{columns.day} <= :until"),
                                ("slug", project_slug(project), f"{columns.slug} = :slug"),
                                ("session", session_id, f"{columns.session} = :session")):
        if value is None:
            continue
        clauses.append(clause)
        parameters[name] = value.isoformat() if isinstance(value, date) else value
    return " AND ".join(clauses) or "1", parameters


def totals_by(store: Store, group: str, since: date | None, prices: pricing.Prices,
              project: str | None = None, until: date | None = None, session_id: str | None = None) -> list[Row]:
    """Totals per day, model, agent_type, project, skill, mcp_server, effort, model_effort, day_model, hour_model,
    day_model_effort or hour_model_effort (from the local day since up to the local day until, both inclusive, and
    of one project path or session if given), ordered by the group key."""
    if group not in GROUPS:
        raise ValueError(f"unknown group {group!r}; expected one of {', '.join(GROUPS)}")
    columns = GROUPS[group]
    selected = ", ".join(f"{expression} AS {name}" for expression, name in columns)
    grouped = ", ".join(expression for expression, _ in columns)
    condition, parameters = range_filter(USAGE_COLUMNS, since, until, project, session_id)
    rows = store.connection.execute(
        f"SELECT {selected}, u.model AS price_model, u.speed AS speed, {USAGE_SUMS} "
        f"FROM usage_rows u WHERE {condition} GROUP BY {grouped}, u.model, u.speed", parameters)
    sums: dict[tuple[Any, ...], UsageSum] = {}
    for row in rows:
        key = tuple(row[name] for _, name in columns)
        sums.setdefault(key, UsageSum()).add(row, prices)
    names = [name for _, name in columns]
    ordered = sorted(sums.items(), key=lambda item: tuple("" if value is None else value for value in item[0]))
    return [{**dict(zip(names, key)), **total.as_dict()} for key, total in ordered]


def nearest_days(store: Store, day: date, project: str | None = None) -> tuple[date | None, date | None]:
    """The closest local days before and after day that have usage (of one project path if given), None where
    there is none; for stepping through days without the empty ones."""
    condition, parameters = range_filter(USAGE_COLUMNS, None, None, project)
    row = store.connection.execute(
        f"SELECT (SELECT MAX(u.day) FROM usage_rows u WHERE u.day < :day AND {condition}) AS previous_day, "
        f"(SELECT MIN(u.day) FROM usage_rows u WHERE u.day > :day AND {condition}) AS next_day",
        {**parameters, "day": day.isoformat()}).fetchone()
    return tuple(None if value is None else date.fromisoformat(value)
                 for value in (row["previous_day"], row["next_day"]))


def api_errors_by(store: Store, group: str, since: date | None, project: str | None = None,
                  until: date | None = None) -> list[Row]:
    """The failed API calls per local day or hour and error kind (from the local day since up to until, both
    inclusive, and of one project path if given), ordered by time and kind."""
    if group not in ERROR_GROUPS:
        raise ValueError(f"unknown group {group!r}; expected one of {', '.join(ERROR_GROUPS)}")
    expression, name = ERROR_GROUPS[group]
    condition, parameters = range_filter(ERROR_COLUMNS, since, until, project)
    rows = store.connection.execute(
        f"SELECT {expression} AS {name}, e.error AS error, COUNT(*) AS count "
        f"FROM api_errors e JOIN transcripts t ON t.path = e.path WHERE {condition} "
        f"GROUP BY 1, 2 ORDER BY 1, 2", parameters)
    return [dict(row) for row in rows]


def api_error_events(store: Store, since: date | None, project: str | None = None, until: date | None = None,
                     limit: int = DEFAULT_EVENT_LIMIT, session_id: str | None = None) -> list[Row]:
    """The failed API calls of the range (of one project path or session if given), newest first, with the
    session, its title and the agent they hit."""
    condition, parameters = range_filter(ERROR_COLUMNS, since, until, project, session_id)
    rows = store.connection.execute(
        "SELECT e.record_id AS record_id, e.ts AS ts, e.error AS error, e.status AS status, "
        "e.limit_type AS limit_type, e.resets_at AS resets_at, t.session_id AS session_id, t.project AS project, "
        "t.agent_type AS agent_type, (SELECT main.title FROM transcripts main WHERE main.session_id = t.session_id "
        "AND main.agent_id IS NULL AND main.title IS NOT NULL LIMIT 1) AS title "
        f"FROM api_errors e JOIN transcripts t ON t.path = e.path WHERE {condition} "
        "ORDER BY e.ts DESC, e.rowid DESC LIMIT :limit", {**parameters, "limit": limit})
    return [dict(row) for row in rows]


def activity_time(mtime_ns: int) -> str:
    """A file mtime as ISO text in UTC."""
    return datetime.fromtimestamp(mtime_ns / 1e9, UTC).isoformat(timespec="seconds")


def effort_order(effort: str | None) -> tuple[int, str]:
    """A sort key for effort levels: low to max, then unknown ones by name, then none."""
    if effort is None:
        return len(EFFORT_ORDER) + 1, ""
    if effort in EFFORT_ORDER:
        return EFFORT_ORDER.index(effort), effort
    return len(EFFORT_ORDER), effort


def turn_contexts(store: Store, path: str) -> list[sqlite3.Row]:
    """The file's messages in time order with their time, context size, model, output and effort level."""
    return store.connection.execute(
        f"SELECT m.ts AS ts, {CONTEXT} AS context, m.output AS output, m.model AS model, m.effort AS effort "
        "FROM messages m "
        "WHERE m.path = ? ORDER BY m.ts, m.rowid", (path,)).fetchall()


def transcript_path(store: Store, session_id: str, agent_id: str | None) -> Path | None:
    """The file of a session's main thread (agent_id None) or of one of its subagents, as last scanned; None if the
    store doesn't know it. The file itself may be gone."""
    row = store.connection.execute(
        "SELECT path FROM transcripts WHERE session_id = ? AND agent_id IS ?", (session_id, agent_id)).fetchone()
    return None if row is None else Path(row["path"])


def session_rows(store: Store, session_id: str) -> list[sqlite3.Row]:
    """The session's transcripts: the main thread first, then the subagents by start time."""
    return store.connection.execute(
        "SELECT * FROM transcripts WHERE session_id = ? "
        "ORDER BY agent_id IS NOT NULL, first_ts, path", (session_id,)).fetchall()


def live_sessions(store: Store, minutes: float, prices: pricing.Prices, now: float | None = None,
                  project: str | None = None) -> list[Row]:
    """Sessions with a transcript changed within `minutes` (by the mtime seen at the last scan), most recent first,
    with their totals so far, the main thread's last context and output, and the subagents active in the window."""
    moment = time.time() if now is None else now
    cutoff_ns = int((moment - minutes * 60) * 1e9)
    session_ids = [row["session_id"] for row in store.connection.execute(
        "SELECT DISTINCT session_id FROM transcripts WHERE mtime_ns >= ? AND (? IS NULL OR slug = ?)",
        (cutoff_ns, project_slug(project), project_slug(project)))]
    sessions = []
    for session_id in session_ids:
        rows = session_rows(store, session_id)
        main = rows[0]
        main_turns = turn_contexts(store, main["path"]) if main["agent_id"] is None else []
        subagents = []
        for row in rows:
            if row["agent_id"] is None or row["mtime_ns"] < cutoff_ns:
                continue
            turns = turn_contexts(store, row["path"])
            subagents.append({"agent_id": row["agent_id"], "agent_type": row["agent_type"],
                              "description": row["description"],
                              "model": turns[-1]["model"] if turns else None,
                              "last_activity": activity_time(row["mtime_ns"]), "turns": len(turns),
                              "last_context": turns[-1]["context"] if turns else None})
        last_ns = max(row["mtime_ns"] for row in rows)
        sessions.append({"session_id": session_id, "project": main["project"], "title": main["title"],
                         "git_branch": main["git_branch"], "last_activity": activity_time(last_ns),
                         **usage_where(store, "u.session_id = ?", (session_id,), prices).as_dict(),
                         "last_context": main_turns[-1]["context"] if main_turns else None,
                         "last_output": main_turns[-1]["output"] if main_turns else None,
                         "subagents": subagents, "_last_ns": last_ns})
    sessions.sort(key=lambda session: session["_last_ns"], reverse=True)
    for session in sessions:
        del session["_last_ns"]
    return sessions


def agent_detail(store: Store, row: sqlite3.Row, prices: pricing.Prices) -> Row:
    """One transcript of a session: its turns, context first -> last, input split, output, tools and cost."""
    turns = turn_contexts(store, row["path"])
    tools = store.connection.execute(
        "SELECT tool, COUNT(*) AS calls, COALESCE(SUM(result_chars), 0) AS result_chars FROM tool_calls "
        "WHERE path = ? GROUP BY tool ORDER BY calls DESC, tool", (row["path"],))
    return {"agent_id": row["agent_id"], "agent_type": row["agent_type"], "description": row["description"],
            "first_ts": row["first_ts"], "last_ts": row["last_ts"],
            "models": sorted({turn["model"] for turn in turns}),
            "model_efforts": [{"model": model, "effort": effort} for model, effort in
                              sorted({(turn["model"], turn["effort"]) for turn in turns if turn["effort"]},
                                     key=lambda pair: (pair[0], effort_order(pair[1])))],
            **usage_where(store, "u.path = ? AND u.turn = 1", (row["path"],), prices).as_dict(),
            "context_first": turns[0]["context"] if turns else None,
            "context_last": turns[-1]["context"] if turns else None,
            "input_total": sum(turn["context"] for turn in turns),
            "context_per_turn": [{"ts": turn["ts"], "context": turn["context"], "effort": turn["effort"]}
                                 for turn in turns],
            "tools": [dict(tool) for tool in tools]}


def session_detail(store: Store, session_id: str, prices: pricing.Prices, read_prompt: bool = True) -> Row | None:
    """The main thread plus each subagent of a session, or None for an unknown id. The prompt is read from the
    transcript on demand (never stored) and is None once the file is gone, or without read_prompt: the server
    reads it after letting go of the store."""
    rows = session_rows(store, session_id)
    if not rows:
        return None
    main = rows[0]
    prompt = transcripts.first_prompt(Path(main["path"])) if read_prompt and main["agent_id"] is None else None
    return {"session_id": session_id, "project": main["project"], "title": main["title"],
            "git_branch": main["git_branch"],
            "first_ts": min((row["first_ts"] for row in rows if row["first_ts"]), default=None),
            "last_ts": max((row["last_ts"] for row in rows if row["last_ts"]), default=None),
            "prompt": prompt, **usage_where(store, "u.session_id = ?", (session_id,), prices).as_dict(),
            "runtime": session_runtime(store, session_id),
            "context": context_stats(store, None, session_id=session_id),
            # the session's usage per model and per model and effort level, background included
            "models": totals_by(store, "model", None, prices, session_id=session_id),
            "model_effort": totals_by(store, "model_effort", None, prices, session_id=session_id),
            # only the turns Claude Code attributes to a skill or an MCP server, as in the summary
            **{key: [row for row in totals_by(store, group, None, prices, session_id=session_id)
                     if row[group] is not None]
               for key, group in (("skills", "skill"), ("mcp_servers", "mcp_server"))},
            "api_errors": api_error_events(store, None, limit=NO_LIMIT, session_id=session_id),
            "agents": [agent_detail(store, row, prices) for row in rows] + background_detail(store, session_id, prices)}


def milliseconds_between(start: str | None, end: str | None) -> int:
    """The milliseconds from one stored timestamp to a later one; 0 if either is missing or end is earlier."""
    if start is None or end is None:
        return 0
    return max(0, round((datetime.fromisoformat(end) - datetime.fromisoformat(start)).total_seconds() * 1000))


def session_runtime(store: Store, session_id: str) -> Row | None:
    """The session's run totals: from its latest cost-state record ("source": "cost_record"), else estimated from
    its transcripts ("transcripts"), or None without a timestamped record. The estimate: session time from the
    first record to the last, API time from each call's request to the end of its reply, tool time from each call
    to its result (so it includes waiting for permission), lines from the Edit and Write results; the retries
    are unknown."""
    row = store.connection.execute(f"SELECT {', '.join(RUN_FIELDS)} FROM cost_states WHERE session_id = ?",
                                   (session_id,)).fetchone()
    if row is not None:
        return {"source": "cost_record", **dict(row)}
    span = store.connection.execute("SELECT MIN(first_ts) AS first_ts, MAX(last_ts) AS last_ts FROM transcripts "
                                    "WHERE session_id = ?", (session_id,)).fetchone()
    if span["first_ts"] is None:
        return None
    replies = store.connection.execute(
        "SELECT m.request_ts, m.end_ts FROM messages m JOIN transcripts t ON t.path = m.path "
        "WHERE t.session_id = ?", (session_id,)).fetchall()
    calls = store.connection.execute(
        "SELECT c.call_ts, c.result_ts, c.lines_added, c.lines_removed FROM tool_calls c "
        "JOIN transcripts t ON t.path = c.path WHERE t.session_id = ?", (session_id,)).fetchall()
    return {"source": "transcripts", "duration_ms": milliseconds_between(span["first_ts"], span["last_ts"]),
            "api_ms": sum(milliseconds_between(reply["request_ts"], reply["end_ts"]) for reply in replies),
            "api_ms_without_retries": None,
            "tool_ms": sum(milliseconds_between(call["call_ts"], call["result_ts"]) for call in calls),
            "lines_added": sum(call["lines_added"] for call in calls),
            "lines_removed": sum(call["lines_removed"] for call in calls)}


def runtime_totals(store: Store, since: date | None, prices: pricing.Prices, project: str | None = None,
                   until: date | None = None) -> Row:
    """The run totals of the sessions whose latest cost-state record falls on a local day from since up to until
    (of one project path if given), with those sessions' whole cost and the cost per 100 lines changed (None
    without changed lines or a price). A record covers the process that wrote it, so a session filed here counts
    its whole run."""
    in_range, parameters = range_filter(COST_STATE_COLUMNS, since, until, project)
    condition = ("c.session_id IN (SELECT c.session_id FROM cost_states c JOIN transcripts t ON t.path = c.path "
                 f"WHERE {in_range})")
    sums = ", ".join(f"COALESCE(SUM(c.{field}), 0) AS {field}" for field in RUN_FIELDS)
    row = store.connection.execute(f"SELECT COUNT(*) AS sessions, {sums} FROM cost_states c WHERE {condition}",
                                   parameters).fetchone()
    session_ids = tuple(session["session_id"] for session in store.connection.execute(
        f"SELECT c.session_id AS session_id FROM cost_states c WHERE {condition}", parameters))
    placeholders = ", ".join("?" for _ in session_ids)
    cost = usage_where(store, f"u.session_id IN ({placeholders})", session_ids, prices).as_dict()["cost"]
    lines = row["lines_added"] + row["lines_removed"]
    per_100_lines = None if cost is None or lines == 0 else cost / lines * 100
    return {**dict(row), "cost": cost, "cost_per_100_lines": per_100_lines}


def background_detail(store: Store, session_id: str, prices: pricing.Prices) -> list[Row]:
    """The session's background usage as one pseudo agent, or [] if there is none."""
    rows = store.connection.execute("SELECT * FROM background WHERE session_id = ? ORDER BY model",
                                    (session_id,)).fetchall()
    if not rows:
        return []
    usage = usage_where(store, "u.session_id = ? AND u.turn = 0", (session_id,), prices).as_dict()
    return [{"agent_id": None, "agent_type": BACKGROUND, "description": BACKGROUND_DESCRIPTION,
             "first_ts": rows[0]["ts"], "last_ts": rows[0]["ts"], "models": [row["model"] for row in rows],
             **usage, "context_first": None, "context_last": None,
             "input_total": usage["new_input"] + usage["cache_write"] + usage["cache_read"], "model_efforts": [],
             "context_per_turn": [], "tools": []}]


def context_stats(store: Store, since: date | None, project: str | None = None, until: date | None = None,
                  session_id: str | None = None) -> Row:
    """The median and 90th percentile of the context per main-thread turn (subagents start small and would pull it
    down) from the local day since up to until, of one project path or session if given; None values without
    turns. What a compact hint threshold can be chosen by."""
    condition, parameters = range_filter(MESSAGE_COLUMNS, since, until, project, session_id)
    contexts = sorted(row["context"] for row in store.connection.execute(
        f"SELECT {CONTEXT} AS context FROM messages m JOIN transcripts t ON t.path = m.path "
        f"WHERE t.agent_id IS NULL AND {condition}", parameters))
    if not contexts:
        return {"turns": 0, "median": None, "p90": None}
    p90 = contexts[0] if len(contexts) == 1 else statistics.quantiles(contexts, n=10, method="inclusive")[8]
    return {"turns": len(contexts), "median": round(statistics.median(contexts)), "p90": round(p90)}


def recent_sessions(store: Store, since: date | None, prices: pricing.Prices,
                    limit: int | None = DEFAULT_SESSION_LIMIT, project: str | None = None,
                    until: date | None = None) -> list[Row]:
    """Sessions with messages from the local day since up to the local day until (either end open without it),
    newest first, with their whole totals and the main thread's average and peak context per turn (None without
    turns: every turn reads its whole context again, so these show how far a session grew before a /clear or a
    compaction); limit None lists every one. One query, plus two per ID_BATCH sessions."""
    days, parameters = range_filter(USAGE_COLUMNS, since, until)
    conditions = []
    if project is not None:
        conditions.append("slug = :slug")
        parameters["slug"] = project_slug(project)
    if since is not None or until is not None:
        conditions.append(f"session_id IN (SELECT u.session_id FROM usage_rows u WHERE {days})")
    parameters["limit"] = NO_LIMIT if limit is None else limit
    # project and title from the main thread, else the first subagent, as in session_rows
    rows = store.connection.execute(f"""
        WITH chosen AS (
            SELECT session_id, MIN(first_ts) AS first_ts, MAX(last_ts) AS last_ts,
                   SUM(agent_id IS NOT NULL) AS subagents
            FROM transcripts WHERE {" AND ".join(conditions) or "1"}
            GROUP BY session_id ORDER BY MAX(last_ts) DESC LIMIT :limit),
        ranked AS (
            SELECT session_id, project, title,
                   ROW_NUMBER() OVER (PARTITION BY session_id ORDER BY agent_id IS NOT NULL, first_ts, path) AS place
            FROM transcripts WHERE session_id IN (SELECT session_id FROM chosen))
        SELECT c.session_id AS session_id, r.project AS project, r.title AS title, c.first_ts AS first_ts,
               c.last_ts AS last_ts, c.subagents AS subagents
        FROM chosen c JOIN ranked r ON r.session_id = c.session_id AND r.place = 1
        ORDER BY c.last_ts DESC""", parameters).fetchall()
    ids = [row["session_id"] for row in rows]
    sums: dict[str, UsageSum] = {session_id: UsageSum() for session_id in ids}
    contexts: dict[str, sqlite3.Row] = {}
    # a list of values, unlike a subquery, reaches into the usage_rows view and its indexes; in batches, under
    # SQLite's limit on variables
    for start in range(0, len(ids), ID_BATCH):
        batch = ids[start:start + ID_BATCH]
        placeholders = ", ".join("?" for _ in batch)
        for row in store.connection.execute(
                f"SELECT u.session_id AS session_id, u.model AS price_model, u.speed AS speed, {USAGE_SUMS} "
                f"FROM usage_rows u WHERE u.session_id IN ({placeholders}) GROUP BY u.session_id, u.model, u.speed",
                batch):
            sums[row["session_id"]].add(row, prices)
        contexts.update((row["session_id"], row) for row in store.connection.execute(
            f"SELECT t.session_id AS session_id, AVG({CONTEXT}) AS average, MAX({CONTEXT}) AS peak "
            "FROM messages m JOIN transcripts t ON t.path = m.path "
            f"WHERE t.agent_id IS NULL AND t.session_id IN ({placeholders}) GROUP BY t.session_id", batch))
    sessions = []
    for row in rows:
        context = contexts.get(row["session_id"])
        average = None if context is None else round(context["average"])
        sessions.append({**dict(row), **sums[row["session_id"]].as_dict(), "context_avg": average,
                         "context_peak": None if context is None else context["peak"]})
    return sessions


def costliest(sessions: list[Row], limit: int = DEFAULT_COSTLY_LIMIT) -> list[Row]:
    """The `limit` costliest of recent_sessions() rows, sessions without a price last; ties keep their order."""
    ranked = sorted(sessions, key=lambda session: -1.0 if session["cost"] is None else session["cost"], reverse=True)
    return ranked[:limit]
