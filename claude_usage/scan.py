"""The incremental scan: transcripts into the store.

scan() reads each transcript from where the last scan stopped (the stored byte offset) and merges the new part into
the rows it already has, in one transaction per file.

Background usage: when a process ends, Claude Code writes a cost-state record with its cumulative usage per model
since the process started, including calls no transcript shows (Haiku for titles, classifiers); a long session may
write several. Every snapshot is kept in cost_snapshots, the latest one per session in cost_states (its run totals).
After each scan, background_parts gets, per snapshot and model, what it counts beyond the transcripts of its process
up to its time, less what the process's earlier snapshots counted so (per category, never below 0), filed under the
snapshot's day: usage of an evening is not moved to the morning the process ended.

Ultracode: no call records it, only a note on a human prompt in the main thread. After each scan, the messages of
every touched session made at xhigh while it was on are marked (update_ultracode).
"""
import json
import sqlite3
from dataclasses import dataclass
from datetime import UTC
from datetime import date
from datetime import datetime
from datetime import timedelta
from pathlib import Path
from typing import Any

from claude_usage import transcripts
from claude_usage.store import RUN_FIELDS
from claude_usage.store import Store

BACKGROUND_FIELDS = ("new_input", "cache_write", "cache_read", "output", "web_searches")
# a snapshot model's fields as cost_states.models keeps them, as ModelTotals names them
SNAPSHOT_FIELDS = ("model", "new_input", "cache_write", "cache_read", "output", "cost_usd", "web_searches")
ULTRACODE_EFFORT = "xhigh"              # the effort level ultracode runs at: it is on only while this one is


@dataclass(frozen=True)
class ScanResult:
    """What one scan did."""
    files_scanned: int
    files_skipped: int                  # unchanged since the last scan
    messages_upserted: int
    bytes_read: int
    errors: tuple[str, ...] = ()        # files that vanished or couldn't be read, with the reason
    sessions_pruned: int = 0            # deleted as older than the retention


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


def upsert_transcript(store: Store, chunk: transcripts.Chunk, size: int, mtime_ns: int, meta_mtime_ns: int | None,
                      head: str | None) -> None:
    """Insert or merge the file's row: title and branch take the newest value, cwd and first_ts the first one."""
    store.connection.execute("""
        INSERT INTO transcripts (path, slug, cwd, project, session_id, agent_id, agent_type, description, title,
                                 git_branch, size, mtime_ns, meta_mtime_ns, read_offset, head_hash, first_ts,
                                 last_ts, last_user_ts, tool_use_id, workflow_run, workflow_phase, workflow_name)
        VALUES (:path, :slug, :cwd, COALESCE(:cwd, :slug), :session_id, :agent_id, :agent_type, :description,
                :title, :git_branch, :size, :mtime_ns, :meta_mtime_ns, :read_offset, :head_hash, :first_ts,
                :last_ts, :last_user_ts, :tool_use_id, :workflow_run, :workflow_phase, :workflow_name)
        ON CONFLICT (path) DO UPDATE SET
            cwd = COALESCE(transcripts.cwd, excluded.cwd),
            project = COALESCE(transcripts.cwd, excluded.cwd, excluded.slug),
            agent_type = CASE WHEN excluded.agent_type = :unknown THEN transcripts.agent_type
                              ELSE excluded.agent_type END,
            description = COALESCE(excluded.description, transcripts.description),
            tool_use_id = COALESCE(excluded.tool_use_id, transcripts.tool_use_id),
            workflow_run = COALESCE(excluded.workflow_run, transcripts.workflow_run),
            workflow_phase = COALESCE(excluded.workflow_phase, transcripts.workflow_phase),
            workflow_name = COALESCE(excluded.workflow_name, transcripts.workflow_name),
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
              "tool_use_id": chunk.tool_use_id, "workflow_run": chunk.workflow_run,
              "workflow_phase": chunk.workflow_phase, "workflow_name": chunk.workflow_name,
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


def insert_compactions(store: Store, chunk: transcripts.Chunk) -> None:
    """Insert the chunk's compactions; ids already stored (by this or another file) are kept as they are."""
    store.connection.executemany(
        "INSERT OR IGNORE INTO compactions (record_id, path, ts, day, trigger, pre_tokens, post_tokens, duration_ms) "
        "VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [(compaction.record_id, str(chunk.path), iso(compaction.timestamp), local_day(compaction.timestamp),
          compaction.trigger, compaction.pre_tokens, compaction.post_tokens, compaction.duration_ms)
         for compaction in chunk.compactions])


def insert_ultracode_states(store: Store, chunk: transcripts.Chunk) -> None:
    """Insert the chunk's ultracode states; ids already stored (by this or another file) are kept as they are."""
    store.connection.executemany(
        "INSERT OR IGNORE INTO ultracode_states (record_id, path, ts, active) VALUES (?, ?, ?, ?)",
        [(state.record_id, str(chunk.path), iso(state.timestamp), int(state.active))
         for state in chunk.ultracode_states])


def snapshot_models(cost_state: transcripts.CostState) -> str:
    """A snapshot's models as cost_states.models and cost_snapshots.models keep them: JSON by field name."""
    return json.dumps([{field: getattr(model, field) for field in SNAPSHOT_FIELDS} for model in cost_state.models])


def upsert_cost_state(store: Store, chunk: transcripts.Chunk, previous_last_ts: str | None) -> None:
    """Keep every cost-state snapshot of the session in cost_snapshots, and its newest one in cost_states (only
    main transcripts write them). Without a timestamped record before it in this read, the snapshot time is the last
    one seen in earlier reads; one without any stands only in cost_states."""
    cost_state = chunk.cost_state
    if cost_state is None or chunk.agent_id is not None:
        return
    for snapshot in chunk.cost_states:
        moment = iso(snapshot.snapshot_ts) or previous_last_ts
        if moment is None:
            continue
        # a snapshot repeated after the same record is the same one: the later copy wins
        store.connection.execute(
            "INSERT INTO cost_snapshots (session_id, path, snapshot_ts, start_ts, models) VALUES (?, ?, ?, ?, ?) "
            "ON CONFLICT (session_id, snapshot_ts) DO UPDATE SET path = excluded.path, start_ts = excluded.start_ts, "
            "models = excluded.models",
            (chunk.session_id, str(chunk.path), moment, iso(snapshot.start_ts), snapshot_models(snapshot)))
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
        """, (chunk.session_id, str(chunk.path), snapshot_ts, iso(cost_state.start_ts), snapshot_models(cost_state),
              local_day(snapshot), *(getattr(cost_state, field) for field in RUN_FIELDS)))


def snapshot_model(entry: dict[str, Any] | list[Any]) -> dict[str, Any]:
    """One model of a stored snapshot by field name. Versions before SNAPSHOT_FIELDS stored positional lists in
    that order, the oldest without web_searches."""
    if isinstance(entry, dict):
        return entry
    return {"web_searches": 0, **dict(zip(SNAPSHOT_FIELDS, entry))}


def session_snapshots(store: Store, session_id: str) -> list[dict[str, Any]]:
    """The session's snapshots in time order: every stored one, and the cost_states row where it isn't among them (a
    store from before cost_snapshots whose transcript is gone, or a snapshot without a time), which sorts last."""
    snapshots = [dict(row) for row in store.connection.execute(
        "SELECT path, snapshot_ts, start_ts, models FROM cost_snapshots WHERE session_id = ? ORDER BY snapshot_ts",
        (session_id,))]
    latest = store.connection.execute(
        "SELECT path, snapshot_ts, start_ts, models FROM cost_states WHERE session_id = ?", (session_id,)).fetchone()
    if latest is not None and latest["snapshot_ts"] not in {snapshot["snapshot_ts"] for snapshot in snapshots}:
        snapshots.append(dict(latest))
    return snapshots


def transcript_totals(store: Store, session_id: str, start: str | None, snapshot: str | None) -> dict[str, Any]:
    """Per model, the session's transcript usage between a process start and a snapshot time (either may be
    missing: no bound), as BACKGROUND_FIELDS."""
    return {row["model"]: row for row in store.connection.execute("""
        SELECT m.model AS model, SUM(m.new_input) AS new_input,
               SUM(m.cache_write_5m + m.cache_write_1h) AS cache_write, SUM(m.cache_read) AS cache_read,
               SUM(m.output) AS output, SUM(m.web_searches) AS web_searches
        FROM messages m JOIN transcripts t ON t.path = m.path
        WHERE t.session_id = :session AND (:snapshot IS NULL OR m.ts <= :snapshot)
          AND (:start IS NULL OR m.ts >= :start)
        GROUP BY m.model""", {"session": session_id, "snapshot": snapshot, "start": start})}


def update_background(store: Store, session_ids: set[str]) -> None:
    """Recompute the background rows of these sessions. Per snapshot and model: what it counts beyond the session's
    transcripts between its process's start and its time (the span it covers), per category and never below 0,
    less what the process's earlier snapshots counted so. That is never below 0 either: a gap that shrinks (the
    transcripts caught up) gives nothing back, so the parts add up to the largest gap."""
    for session_id in sorted(session_ids):
        store.connection.execute("DELETE FROM background_parts WHERE session_id = ?", (session_id,))
        counted_so_far: dict[tuple[str | None, str], list[int]] = {}
        for snapshot in session_snapshots(store, session_id):
            start = snapshot["start_ts"]
            seen = transcript_totals(store, session_id, start, snapshot["snapshot_ts"])
            moment = datetime.fromisoformat(snapshot["snapshot_ts"]) if snapshot["snapshot_ts"] else None
            for entry in map(snapshot_model, json.loads(snapshot["models"])):
                model = entry["model"]
                row = seen.get(model)
                gap = [max(0, entry[field] - ((row[field] or 0) if row else 0)) for field in BACKGROUND_FIELDS]
                before = counted_so_far.get((start, model), [0] * len(BACKGROUND_FIELDS))
                counted_so_far[(start, model)] = [max(earlier, now) for earlier, now in zip(before, gap)]
                growth = [max(0, now - earlier) for earlier, now in zip(before, gap)]
                if not any(growth):
                    continue
                store.connection.execute(
                    "INSERT INTO background_parts (session_id, model, path, ts, day, new_input, cache_write, "
                    "cache_read, output, web_searches) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                    (session_id, model, snapshot["path"], snapshot["snapshot_ts"], local_day(moment), *growth))


def ultracode_spans(store: Store, session_id: str) -> list[tuple[str, str | None]]:
    """When ultracode was on in a session, as (start, end) ISO times, end None while it still is: from a note that
    it is on to a note that it is off, or to the first later main-thread call at another effort level (picking one
    switches it off without a note). A call without an effort level ends nothing."""
    states = store.connection.execute(
        "SELECT u.ts AS ts, u.active AS active FROM ultracode_states u JOIN transcripts t ON t.path = u.path "
        "WHERE t.session_id = ? AND u.ts IS NOT NULL", (session_id,)).fetchall()
    if not states:
        return []
    others = store.connection.execute(
        "SELECT m.ts AS ts FROM messages m JOIN transcripts t ON t.path = m.path "
        "WHERE t.session_id = ? AND t.agent_id IS NULL AND m.ts IS NOT NULL AND m.effort IS NOT NULL "
        "AND m.effort != ?", (session_id, ULTRACODE_EFFORT)).fetchall()
    # at the same moment an end comes first (False sorts before True)
    events = sorted([(row["ts"], bool(row["active"])) for row in states] + [(row["ts"], False) for row in others])
    spans: list[tuple[str, str | None]] = []
    start = None
    for moment, active in events:
        if active and start is None:
            start = moment
        elif not active and start is not None:
            spans.append((start, moment))
            start = None
    if start is not None:
        spans.append((start, None))
    return spans


def update_ultracode(store: Store, session_ids: set[str]) -> None:
    """Mark the messages of these sessions made while ultracode was on: at xhigh within one of its spans. Subagents
    and workflow agents note nothing of their own, so they count by the session's spans and their own effort."""
    for session_id in sorted(session_ids):
        paths = [(row["path"],) for row in store.connection.execute(
            "SELECT path FROM transcripts WHERE session_id = ?", (session_id,))]
        store.connection.executemany("UPDATE messages SET ultracode = 0 WHERE path = ? AND ultracode = 1", paths)
        for start, end in ultracode_spans(store, session_id):
            store.connection.executemany(
                "UPDATE messages SET ultracode = 1 WHERE path = ? AND effort = ? AND ts >= ? AND (? IS NULL OR ts < ?)",
                [(path, ULTRACODE_EFFORT, start, end, end) for (path,) in paths])


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
    head = transcripts.head_hash(path)
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
        insert_compactions(store, chunk)
        insert_ultracode_states(store, chunk)
        # with the file's data, so a scan that stops before update_background leaves the session for the next one
        store.connection.execute("INSERT OR IGNORE INTO dirty_sessions (session_id) VALUES (?)", (chunk.session_id,))
    return upserted, chunk.end_offset - offset


def last_activity(last_ts: str | None, mtime_ns: int) -> date:
    """The local day of a session's last record, or of its newest file's mtime without a timestamped record."""
    moment = datetime.fromisoformat(last_ts) if last_ts else datetime.fromtimestamp(mtime_ns / 1e9, UTC)
    return moment.astimezone().date()


def prune(store: Store, first_day: date) -> int:
    """Delete the sessions whose last activity (over all their files) lies before first_day, in one transaction:
    their messages, tool calls, API errors, compactions, ultracode states, background, cost-state and snapshot rows,
    whole sessions only, so no background or run total loses half its session. A transcript row stays while its file
    exists: it holds the offset the file was read to, and without it the next scan would read the old data back in.
    Returns the sessions that lost rows."""
    sessions = store.connection.execute(
        "SELECT session_id, MAX(last_ts) AS last_ts, MAX(mtime_ns) AS mtime_ns FROM transcripts GROUP BY session_id")
    old = [row["session_id"] for row in sessions if last_activity(row["last_ts"], row["mtime_ns"]) < first_day]
    pruned = 0
    with store.transaction():
        for session_id in old:
            before = store.connection.total_changes
            paths = [row["path"] for row in store.connection.execute(
                "SELECT path FROM transcripts WHERE session_id = ?", (session_id,))]
            for table in ("messages", "tool_calls", "api_errors", "compactions", "ultracode_states"):
                store.connection.executemany(f"DELETE FROM {table} WHERE path = ?", [(path,) for path in paths])
            for table in ("background", "background_parts", "cost_states", "cost_snapshots", "dirty_sessions"):
                store.connection.execute(f"DELETE FROM {table} WHERE session_id = ?", (session_id,))
            store.connection.executemany("DELETE FROM transcripts WHERE path = ?",
                                         [(path,) for path in paths if not Path(path).exists()])
            pruned += store.connection.total_changes > before
    return pruned


def scan(store: Store, projects_dir: Path, project_filter: str | None = None, retention_days: int = 0,
         today: date | None = None) -> ScanResult:
    """One incremental scan of all transcripts below projects_dir, or of one project's (by its path). With a
    retention, the sessions of every project whose last activity is older than its retention_days days up to
    today (default: the local date) are deleted afterwards."""
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
        update_ultracode(store, dirty)
        store.connection.execute("DELETE FROM dirty_sessions")
    pruned = 0
    if retention_days:
        pruned = prune(store, (today or date.today()) - timedelta(days=retention_days - 1))
    return ScanResult(scanned, skipped, upserted, bytes_read, tuple(errors), pruned)
