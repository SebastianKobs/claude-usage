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
import json
import hashlib
import sqlite3
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

SCHEMA_VERSION = 4                      # 2: cost_states and background; 3: web_searches; 4: start_ts
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
    last_ts TEXT
);
CREATE INDEX IF NOT EXISTS transcripts_session ON transcripts (session_id);
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
    web_searches INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS messages_path ON messages (path);
CREATE INDEX IF NOT EXISTS messages_day ON messages (day);
CREATE TABLE IF NOT EXISTS tool_calls (
    tool_use_id TEXT PRIMARY KEY,
    path TEXT NOT NULL,
    tool TEXT NOT NULL,
    result_chars INTEGER
);
CREATE INDEX IF NOT EXISTS tool_calls_path ON tool_calls (path);
CREATE TABLE IF NOT EXISTS cost_states (
    session_id TEXT PRIMARY KEY,
    path TEXT NOT NULL,             -- the main transcript it was read from
    snapshot_ts TEXT,
    start_ts TEXT,                  -- when the process that wrote it started: the snapshot covers only that run
    models TEXT NOT NULL            -- JSON: [[model, new_input, cache_write, cache_read, output, cost_usd,
                                    --         web_searches], ...]
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
"""
# A view holds no data, so it is simply recreated on every open.
VIEW = """
DROP VIEW IF EXISTS usage_rows;
CREATE VIEW usage_rows AS
SELECT m.path AS path, t.session_id AS session_id, t.agent_id AS agent_id, t.agent_type AS agent_type,
       t.project AS project, t.slug AS slug, m.model AS model, m.speed AS speed, m.ts AS ts, m.day AS day,
       m.new_input AS new_input, m.cache_write_5m AS cache_write_5m, m.cache_write_1h AS cache_write_1h,
       m.cache_read AS cache_read, m.output AS output, m.web_searches AS web_searches, 1 AS turn
FROM messages m JOIN transcripts t ON t.path = m.path
UNION ALL
SELECT b.path, b.session_id, NULL, '(background)', t.project, t.slug, b.model, 'standard', b.ts, b.day,
       b.new_input, b.cache_write, 0, b.cache_read, b.output, b.web_searches, 0
FROM background b JOIN transcripts t ON t.path = b.path;
"""
BACKGROUND = "(background)"               # the agent type of background rows, as in VIEW
# columns added after version 1, for stores created before them: (table, column, declaration)
ADDED_COLUMNS = (("messages", "web_searches", "INTEGER NOT NULL DEFAULT 0"),
                 ("background", "web_searches", "INTEGER NOT NULL DEFAULT 0"),
                 ("cost_states", "start_ts", "TEXT"))
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
    "day_model": (("u.day", "day"), ("u.model", "model")),
}
COST_PARTS = ("new_input", "cache_write", "cache_read", "output", "web_search")
BACKGROUND_FIELDS = ("new_input", "cache_write", "cache_read", "output", "web_searches")
BACKGROUND_DESCRIPTION = "calls Claude Code counted that no transcript shows, e.g. Haiku for titles"
DEFAULT_SESSION_LIMIT = 50
DEFAULT_COSTLY_LIMIT = 10
NO_LIMIT = -1                             # SQLite's LIMIT for all rows

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
        row = self.connection.execute("SELECT value FROM meta WHERE key = 'schema_version'").fetchone()
        if row is None:
            self.connection.execute("INSERT INTO meta (key, value) VALUES ('schema_version', ?)",
                                    (str(SCHEMA_VERSION),))
        elif int(row["value"]) > SCHEMA_VERSION:
            raise StoreError(f"{self.path} has schema version {row['value']}, newer than this tool's "
                             f"{SCHEMA_VERSION}; update claude-usage")
        elif int(row["value"]) < SCHEMA_VERSION:
            self.add_missing_columns()
            # versions 1 and 2 didn't keep (all of) the cost-state data: read every file again on the next scan
            # (the upserts make that idempotent; no row is removed)
            self.connection.execute("UPDATE transcripts SET read_offset = 0, size = -1")
            self.connection.execute("UPDATE meta SET value = ? WHERE key = 'schema_version'", (str(SCHEMA_VERSION),))
        self.connection.executescript(VIEW)

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


def upsert_transcript(store: Store, chunk: transcripts.Chunk, size: int, mtime_ns: int, head: str | None) -> None:
    """Insert or merge the file's row: title and branch take the newest value, cwd and first_ts the first one."""
    store.connection.execute("""
        INSERT INTO transcripts (path, slug, cwd, project, session_id, agent_id, agent_type, description, title,
                                 git_branch, size, mtime_ns, read_offset, head_hash, first_ts, last_ts)
        VALUES (:path, :slug, :cwd, COALESCE(:cwd, :slug), :session_id, :agent_id, :agent_type, :description,
                :title, :git_branch, :size, :mtime_ns, :read_offset, :head_hash, :first_ts, :last_ts)
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
            read_offset = excluded.read_offset,
            head_hash = excluded.head_hash,
            first_ts = MIN(COALESCE(transcripts.first_ts, excluded.first_ts),
                           COALESCE(excluded.first_ts, transcripts.first_ts)),
            last_ts = MAX(COALESCE(transcripts.last_ts, excluded.last_ts),
                          COALESCE(excluded.last_ts, transcripts.last_ts))
        """, {"path": str(chunk.path), "slug": chunk.slug, "cwd": chunk.cwd, "session_id": chunk.session_id,
              "agent_id": chunk.agent_id, "agent_type": chunk.agent_type, "description": chunk.description,
              "title": chunk.title, "git_branch": chunk.git_branch, "size": size, "mtime_ns": mtime_ns,
              "read_offset": chunk.end_offset, "head_hash": head, "first_ts": iso(chunk.first_ts),
              "last_ts": iso(chunk.last_ts), "unknown": transcripts.UNKNOWN_AGENT_TYPE})


def upsert_messages(store: Store, chunk: transcripts.Chunk) -> int:
    """Insert new messages and update the counters of those this file owns; returns the rows changed. A copy of an
    id in another file (a forked or resumed session) changes nothing, and ts keeps the first record's time."""
    cursor = store.connection.executemany("""
        INSERT INTO messages (message_id, path, model, speed, ts, day, new_input, cache_write_5m, cache_write_1h,
                              cache_read, output, web_searches)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT (message_id) DO UPDATE SET
            model = excluded.model,
            speed = excluded.speed,
            new_input = excluded.new_input,
            cache_write_5m = excluded.cache_write_5m,
            cache_write_1h = excluded.cache_write_1h,
            cache_read = excluded.cache_read,
            output = excluded.output,
            web_searches = excluded.web_searches
        WHERE messages.path = excluded.path
        """, [(message.message_id, str(chunk.path), message.model, message.speed, iso(message.timestamp),
               local_day(message.timestamp), message.new_input, message.cache_write_5m, message.cache_write_1h,
               message.cache_read, message.output, message.web_searches) for message in chunk.messages])
    return max(cursor.rowcount, 0)


def insert_tool_calls(store: Store, chunk: transcripts.Chunk) -> None:
    """Insert the chunk's tool calls; ids already stored (by this or another file) are kept as they are."""
    store.connection.executemany(
        "INSERT OR IGNORE INTO tool_calls (tool_use_id, path, tool, result_chars) VALUES (?, ?, ?, NULL)",
        [(call.tool_use_id, str(chunk.path), call.tool) for call in chunk.tool_calls])


def update_tool_results(store: Store, chunk: transcripts.Chunk) -> None:
    """Set the result size on the calls this file owns; a result without a known call is dropped."""
    store.connection.executemany(
        "UPDATE tool_calls SET result_chars = ? WHERE tool_use_id = ? AND path = ?",
        [(result.chars, result.tool_use_id, str(chunk.path)) for result in chunk.tool_results])


def upsert_cost_state(store: Store, chunk: transcripts.Chunk, previous_last_ts: str | None) -> None:
    """Keep the session's newest cost-state snapshot (only main transcripts write them). Without a timestamped
    record before it in this read, the snapshot time is the last one seen in earlier reads."""
    cost_state = chunk.cost_state
    if cost_state is None or chunk.agent_id is not None:
        return
    models = [[model.model, model.new_input, model.cache_write, model.cache_read, model.output, model.cost_usd,
               model.web_searches] for model in cost_state.models]
    store.connection.execute("""
        INSERT INTO cost_states (session_id, path, snapshot_ts, start_ts, models) VALUES (?, ?, ?, ?, ?)
        ON CONFLICT (session_id) DO UPDATE SET path = excluded.path, snapshot_ts = excluded.snapshot_ts,
                                               start_ts = excluded.start_ts, models = excluded.models
        """, (chunk.session_id, str(chunk.path), iso(cost_state.snapshot_ts) or previous_last_ts,
              iso(cost_state.start_ts), json.dumps(models)))


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


def scan_file(store: Store, path: Path, known: sqlite3.Row | None) -> tuple[int, int] | None:
    """Read what's new in one file and merge it in one transaction; returns (messages upserted, bytes read), or
    None if the file is unchanged. A file that shrank below the stored offset or got a new first line was rewritten,
    so it's read again from the start (the upserts make that idempotent)."""
    stat = path.stat()
    if known is not None and known["size"] == stat.st_size and known["mtime_ns"] == stat.st_mtime_ns:
        return None
    head = head_hash(path)
    offset = 0
    if known is not None:
        rewritten = (stat.st_size < known["read_offset"]
                     or (known["head_hash"] is not None and head != known["head_hash"]))
        if not rewritten:
            offset = known["read_offset"]
    chunk = transcripts.parse(path, offset)
    with store.transaction():
        upsert_cost_state(store, chunk, known["last_ts"] if known is not None else None)
        upsert_transcript(store, chunk, stat.st_size, stat.st_mtime_ns, head)
        upserted = upsert_messages(store, chunk)
        insert_tool_calls(store, chunk)
        update_tool_results(store, chunk)
    return upserted, chunk.end_offset - offset


def scan(store: Store, projects_dir: Path, project_filter: str | None = None) -> ScanResult:
    """One incremental scan of all transcripts below projects_dir, or of one project's (by its path)."""
    paths = transcripts.find_transcripts(projects_dir)
    if project_filter is not None:
        wanted = transcripts.slug_for(project_filter)
        paths = [path for path in paths if transcripts.project_slug(path) == wanted]
    known = {row["path"]: row for row in store.connection.execute(
        "SELECT path, session_id, size, mtime_ns, read_offset, head_hash, last_ts FROM transcripts")}
    touched = set()
    scanned = 0
    skipped = 0
    upserted = 0
    bytes_read = 0
    errors = []
    for path in paths:
        try:
            outcome = scan_file(store, path, known.get(str(path)))
        except OSError as exc:              # the file vanished or became unreadable between listing and reading
            errors.append(f"{path}: {exc}")
            continue
        if outcome is None:
            skipped += 1
            continue
        scanned += 1
        upserted += outcome[0]
        bytes_read += outcome[1]
        touched.add(transcripts.parse_session_id(path))
    # after all files, so every transcript of a touched session is in the store, whatever order they're listed in
    with store.transaction():
        update_background(store, touched)
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


def since_text(since: date | None) -> str | None:
    """A since date as the text the day column is compared with."""
    if since is None:
        return None
    return since.isoformat()


def totals_by(store: Store, group: str, since: date | None, prices: pricing.Prices,
              project: str | None = None) -> list[Row]:
    """Totals per day, model, agent_type, project or day_model (from the local day since, inclusive, and of one
    project path if given), ordered by the group key."""
    if group not in GROUPS:
        raise ValueError(f"unknown group {group!r}; expected one of {', '.join(GROUPS)}")
    columns = GROUPS[group]
    selected = ", ".join(f"{expression} AS {name}" for expression, name in columns)
    grouped = ", ".join(expression for expression, _ in columns)
    rows = store.connection.execute(
        f"SELECT {selected}, u.model AS price_model, u.speed AS speed, {USAGE_SUMS} "
        f"FROM usage_rows u WHERE (:since IS NULL OR u.day >= :since) AND (:slug IS NULL OR u.slug = :slug) "
        f"GROUP BY {grouped}, u.model, u.speed", {"since": since_text(since), "slug": project_slug(project)})
    sums: dict[tuple[Any, ...], UsageSum] = {}
    for row in rows:
        key = tuple(row[name] for _, name in columns)
        sums.setdefault(key, UsageSum()).add(row, prices)
    names = [name for _, name in columns]
    ordered = sorted(sums.items(), key=lambda item: tuple("" if value is None else value for value in item[0]))
    return [{**dict(zip(names, key)), **total.as_dict()} for key, total in ordered]


def activity_time(mtime_ns: int) -> str:
    """A file mtime as ISO text in UTC."""
    return datetime.fromtimestamp(mtime_ns / 1e9, UTC).isoformat(timespec="seconds")


def turn_contexts(store: Store, path: str) -> list[sqlite3.Row]:
    """The file's messages in time order with their time, context size, model and output."""
    return store.connection.execute(
        f"SELECT m.ts AS ts, {CONTEXT} AS context, m.output AS output, m.model AS model FROM messages m "
        "WHERE m.path = ? ORDER BY m.ts, m.rowid", (path,)).fetchall()


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
            **usage_where(store, "u.path = ? AND u.turn = 1", (row["path"],), prices).as_dict(),
            "context_first": turns[0]["context"] if turns else None,
            "context_last": turns[-1]["context"] if turns else None,
            "input_total": sum(turn["context"] for turn in turns),
            "context_per_turn": [{"ts": turn["ts"], "context": turn["context"]} for turn in turns],
            "tools": [dict(tool) for tool in tools]}


def session_detail(store: Store, session_id: str, prices: pricing.Prices) -> Row | None:
    """The main thread plus each subagent of a session, or None for an unknown id. The prompt is read from the
    transcript on demand (never stored) and is None once the file is gone."""
    rows = session_rows(store, session_id)
    if not rows:
        return None
    main = rows[0]
    prompt = transcripts.first_prompt(Path(main["path"])) if main["agent_id"] is None else None
    return {"session_id": session_id, "project": main["project"], "title": main["title"],
            "git_branch": main["git_branch"],
            "first_ts": min((row["first_ts"] for row in rows if row["first_ts"]), default=None),
            "last_ts": max((row["last_ts"] for row in rows if row["last_ts"]), default=None),
            "prompt": prompt, **usage_where(store, "u.session_id = ?", (session_id,), prices).as_dict(),
            "agents": [agent_detail(store, row, prices) for row in rows] + background_detail(store, session_id, prices)}


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
             "input_total": usage["new_input"] + usage["cache_write"] + usage["cache_read"],
             "context_per_turn": [], "tools": []}]


def main_context(store: Store, session_id: str) -> Row:
    """The average and peak context per turn of the session's main thread (None without turns). Every turn reads
    its whole context again, so these show how far a session grew before a /clear or a compaction."""
    row = store.connection.execute(
        f"SELECT AVG({CONTEXT}) AS average, MAX({CONTEXT}) AS peak FROM messages m "
        "JOIN transcripts t ON t.path = m.path WHERE t.session_id = ? AND t.agent_id IS NULL",
        (session_id,)).fetchone()
    return {"context_avg": None if row["average"] is None else round(row["average"]), "context_peak": row["peak"]}


def recent_sessions(store: Store, since: date | None, prices: pricing.Prices,
                    limit: int | None = DEFAULT_SESSION_LIMIT, project: str | None = None) -> list[Row]:
    """Sessions with messages from the local day since on (all without since), newest first, with totals and the
    main thread's context; limit None lists every one."""
    rows = store.connection.execute("""
        SELECT session_id, MIN(first_ts) AS first_ts, MAX(last_ts) AS last_ts,
               SUM(agent_id IS NOT NULL) AS subagents
        FROM transcripts
        WHERE (:slug IS NULL OR slug = :slug) AND (:since IS NULL OR session_id IN (
            SELECT u.session_id FROM usage_rows u WHERE u.day >= :since))
        GROUP BY session_id
        ORDER BY MAX(last_ts) DESC
        LIMIT :limit
        """, {"since": since_text(since), "limit": NO_LIMIT if limit is None else limit,
              "slug": project_slug(project)}).fetchall()
    sessions = []
    for row in rows:
        main = session_rows(store, row["session_id"])[0]
        sessions.append({"session_id": row["session_id"], "project": main["project"], "title": main["title"],
                         "first_ts": row["first_ts"], "last_ts": row["last_ts"], "subagents": row["subagents"],
                         **usage_where(store, "u.session_id = ?", (row["session_id"],), prices).as_dict(),
                         **main_context(store, row["session_id"])})
    return sessions


def costliest(sessions: list[Row], limit: int = DEFAULT_COSTLY_LIMIT) -> list[Row]:
    """The `limit` costliest of recent_sessions() rows, sessions without a price last; ties keep their order."""
    ranked = sorted(sessions, key=lambda session: -1.0 if session["cost"] is None else session["cost"], reverse=True)
    return ranked[:limit]
