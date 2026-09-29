"""The queries behind the report and the dashboard, over the usage_rows view (messages and background usage) and
the other tables of the store.
"""
import dataclasses
import sqlite3
import statistics
import time
from dataclasses import dataclass
from datetime import UTC
from datetime import date
from datetime import datetime
from datetime import timedelta
from pathlib import Path
from typing import Any

from claude_usage import compact
from claude_usage import pricing
from claude_usage import transcripts
from claude_usage import turns
from claude_usage.store import BACKGROUND
from claude_usage.store import EFFORT
from claude_usage.store import ULTRACODE
from claude_usage.store import RUN_FIELDS
from claude_usage.store import Row
from claude_usage.store import Store

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
BACKGROUND_DESCRIPTION = "calls Claude Code counted that no transcript shows, e.g. Haiku for titles"
DEFAULT_DAYS = 30                       # the range the dashboard and the report start with
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
# effort levels from least to most, ultracode (xhigh with its workflows) last; others sort after them by name, as on
# the dashboard
EFFORT_ORDER = ("low", "medium", "high", "xhigh", "max", ULTRACODE)
TOP_GROWTH = 5                            # the biggest growth steps a transcript's detail lists


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


def input_total(row: Row) -> int:
    """New input plus cache writes and reads of a usage row: everything sent to the model."""
    return row["new_input"] + row["cache_write"] + row["cache_read"]


def first_day(days: int, until: date) -> date:
    """The first local day of the `days` days up to until, both included."""
    return until - timedelta(days=days - 1)


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
COMPACTION_COLUMNS = FilterColumns("c.day", "t.slug", "t.session_id")


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


def first_stored_day(store: Store, project: str | None = None) -> date | None:
    """The earliest local day with usage (of one project path if given), None without any: where the history
    starts, which a retention or a young store puts after a range's first day."""
    condition, parameters = range_filter(USAGE_COLUMNS, None, None, project)
    row = store.connection.execute(f"SELECT MIN(u.day) AS day FROM usage_rows u WHERE {condition}",
                                   parameters).fetchone()
    return None if row["day"] is None else date.fromisoformat(row["day"])


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
    """A sort key for effort levels: low to max and ultracode, then unknown ones by name, then none."""
    if effort is None:
        return len(EFFORT_ORDER) + 1, ""
    if effort in EFFORT_ORDER:
        return EFFORT_ORDER.index(effort), effort
    return len(EFFORT_ORDER), effort


def turn_contexts(store: Store, path: str) -> list[sqlite3.Row]:
    """The file's messages in time order with their id, time, context size and its parts, model, speed, output,
    effort level, and request and end times."""
    return store.connection.execute(
        f"SELECT m.message_id AS message_id, m.ts AS ts, {CONTEXT} AS context, m.new_input AS new_input, "
        "m.cache_write_5m AS cache_write_5m, m.cache_write_1h AS cache_write_1h, m.cache_read AS cache_read, "
        f"m.output AS output, m.model AS model, m.speed AS speed, {EFFORT} AS effort, m.request_ts AS request_ts, "
        "m.end_ts AS end_ts "
        "FROM messages m "
        "WHERE m.path = ? ORDER BY m.ts, m.rowid", (path,)).fetchall()


def stored_time(text: str | None) -> datetime | None:
    """A stored ISO timestamp as a datetime, None for none."""
    return None if text is None else datetime.fromisoformat(text)


def as_turns(rows: list[sqlite3.Row]) -> list[turns.Turn]:
    """turn_contexts rows as the Turn records turns.py works on."""
    return [turns.Turn(message_id=row["message_id"], ts=stored_time(row["ts"]), model=row["model"],
                       speed=row["speed"], new_input=row["new_input"], cache_write_5m=row["cache_write_5m"],
                       cache_write_1h=row["cache_write_1h"], cache_read=row["cache_read"], output=row["output"],
                       request_ts=stored_time(row["request_ts"]), end_ts=stored_time(row["end_ts"]))
            for row in rows]


def ultracode_messages(store: Store, path: str) -> set[str]:
    """The ids of the file's messages made while ultracode was on."""
    return {row["message_id"] for row in store.connection.execute(
        "SELECT message_id FROM messages WHERE path = ? AND ultracode = 1", (path,))}


def compaction_rows(store: Store, path: str) -> list[Row]:
    """The compactions a file stored, in time order."""
    return [dict(row) for row in store.connection.execute(
        "SELECT ts, trigger, pre_tokens, post_tokens, duration_ms FROM compactions WHERE path = ? "
        "ORDER BY ts, rowid", (path,))]


def compaction_list(compactions: list[Row]) -> tuple[turns.Compaction, ...]:
    """compaction_rows as the Compaction records turns.py works on."""
    return tuple(turns.Compaction(ts=stored_time(row["ts"]), trigger=row["trigger"], pre_tokens=row["pre_tokens"],
                                  post_tokens=row["post_tokens"], duration_ms=row["duration_ms"])
                 for row in compactions)


def output_rates(store: Store) -> dict[str, turns.OutputRate]:
    """Each model's output speed on the main threads (subagents run other work), from each reply's request to its
    last record."""
    rows = store.connection.execute(
        "SELECT m.model AS model, m.output AS output, m.request_ts AS request_ts, m.end_ts AS end_ts "
        "FROM messages m JOIN transcripts t ON t.path = m.path "
        "WHERE t.agent_id IS NULL AND m.output >= ? AND m.request_ts IS NOT NULL AND m.end_ts IS NOT NULL",
        (turns.RATE_FASTEST_MIN_OUTPUT,))
    return turns.output_rates([(row["model"], row["output"],
                                (stored_time(row["end_ts"]) - stored_time(row["request_ts"])).total_seconds())
                               for row in rows])


def versus_keeping_payload(comparison: turns.VersusKeeping | None) -> Row | None:
    """A compaction's comparison with keeping the context as JSON-ready fields, without its times (the compaction's
    row has them)."""
    if comparison is None:
        return None
    fields = dataclasses.asdict(comparison)
    call = fields.pop("call")
    del fields["compacted_at"], fields["ended_at"]
    return {**fields, "call_low": call["low"], "call_cost": call["cost"], "call_high": call["high"],
            "summary_tokens": call["summary_tokens"], "summary_high": call["summary_high"]}


def next_context(history: list[turns.Turn], moment: datetime | None) -> int | None:
    """The context of the first call at or after a compaction; None without one."""
    if moment is None:
        return None
    return next((turn.context for turn in history if turn.ts is not None and turn.ts >= moment), None)


def compared_compactions(history: list[turns.Turn], compactions: list[Row], steps: list[turns.Step],
                         prices: pricing.Prices, settings: compact.CompactSettings,
                         rates: dict[str, turns.OutputRate]) -> list[Row]:
    """compaction_rows with the next call's context and the comparison with keeping the context."""
    records = compaction_list(compactions)
    comparisons = turns.versus_keeping(history, steps, records, prices, settings, rates)
    return [{**row, "next_context": next_context(history, record.ts),
             "versus_keeping": versus_keeping_payload(comparison)}
            for row, record, comparison in zip(compactions, records, comparisons)]


def compaction_comparisons(store: Store, session_id: str, agent_id: str | None, prices: pricing.Prices,
                           settings: compact.CompactSettings) -> dict[str, Row | None]:
    """The comparison with keeping the context of each compaction of one transcript, by its stored time: what the
    conversation's compaction markers show."""
    path = transcript_path(store, session_id, agent_id)
    if path is None:
        return {}
    history = as_turns(turn_contexts(store, str(path)))
    compactions = compaction_rows(store, str(path))
    steps = turns.steps(history, compaction_times(compactions), prices)
    rows = compared_compactions(history, compactions, steps, prices, settings, output_rates(store))
    return {row["ts"]: row["versus_keeping"] for row in rows if row["ts"] is not None}


def compaction_times(compactions: list[Row]) -> tuple[datetime, ...]:
    """The times of compaction_rows, without the ones that have none."""
    return tuple(stored_time(row["ts"]) for row in compactions if row["ts"] is not None)


def previous_call_tools(store: Store, path: str, turn: turns.Turn) -> list[Row]:
    """The tools a call ran (their tool_use blocks lie between its first and last record), with their result
    sizes: what the next call's context grew by."""
    start = turn.ts
    end = turn.end_ts or turn.ts
    if start is None or end is None:
        return []
    rows = store.connection.execute(
        "SELECT tool, COALESCE(result_chars, 0) AS result_chars FROM tool_calls "
        "WHERE path = ? AND call_ts >= ? AND call_ts <= ? ORDER BY call_ts, rowid",
        (path, start.isoformat(timespec="milliseconds"), end.isoformat(timespec="milliseconds")))
    return [dict(row) for row in rows]


def top_growth(store: Store, path: str, history: list[turns.Turn], steps: list[turns.Step]) -> list[Row]:
    """The TOP_GROWTH turns that grew the context most (only growing ones), biggest first, each with the tools the
    call before it ran."""
    grown = sorted((index for index, step in enumerate(steps) if step.growth is not None and step.growth > 0),
                   key=lambda index: steps[index].growth, reverse=True)[:TOP_GROWTH]
    return [{"message_id": history[index].message_id, "ts": turn_time(history[index]),
             "growth": steps[index].growth, "tools": previous_call_tools(store, path, history[index - 1])}
            for index in grown]


def turn_time(turn: turns.Turn) -> str | None:
    """A turn's time as stored."""
    return None if turn.ts is None else turn.ts.isoformat(timespec="milliseconds")


def rebuild_payload(rebuild: turns.Rebuild | None) -> Row | None:
    """A rebuild as JSON-ready fields."""
    if rebuild is None:
        return None
    return {"cause": rebuild.cause, "lost": rebuild.lost, "extra_cost": rebuild.extra_cost}


def rebuild_totals(steps: list[turns.Step]) -> Row:
    """How many turns rebuilt the cache, the tokens they wrote again and what that cost extra (None if no rebuild
    had a price)."""
    rebuilds = [step.rebuild for step in steps if step.rebuild is not None]
    costs = [rebuild.extra_cost for rebuild in rebuilds if rebuild.extra_cost is not None]
    return {"count": len(rebuilds), "lost": sum(rebuild.lost for rebuild in rebuilds),
            "cost": sum(costs) if costs or not rebuilds else None}


def returned_chars(store: Store, tool_use_id: str | None) -> int | None:
    """What a subagent handed back: the result size of the Agent call that spawned it; None if unknown."""
    if tool_use_id is None:
        return None
    row = store.connection.execute("SELECT result_chars FROM tool_calls WHERE tool_use_id = ?",
                                   (tool_use_id,)).fetchone()
    return None if row is None else row["result_chars"]


def current_context(store: Store, session_id: str, settings: compact.CompactSettings, prices: pricing.Prices,
                    past: list[turns.VersusKeeping | None] | None = None) -> Row | None:
    """The gauge of the session's main thread (turns.gauge) with what compacting now would cost and when it would
    pay off (turns.compact_preview, learning from past, by default every stored compaction), or None without
    main-thread turns."""
    path = transcript_path(store, session_id, None)
    if path is None:
        return None
    history = as_turns(turn_contexts(store, str(path)))
    moments = compaction_times(compaction_rows(store, str(path)))
    gauge = turns.gauge(history, turns.steps(history, moments, prices), moments, settings)
    if gauge is None:
        return None
    if past is None:
        past = compaction_history(store, prices, settings)
    return {**gauge, "compact_now": turns.compact_preview(history, past, prices, gauge["turns_since_compaction"])}


def compaction_history(store: Store, prices: pricing.Prices,
                       settings: compact.CompactSettings) -> list[turns.VersusKeeping | None]:
    """Every stored main-thread compaction compared with keeping the context: what compact_preview learns from."""
    rates = output_rates(store)
    paths = [row["path"] for row in store.connection.execute(
        "SELECT DISTINCT c.path AS path FROM compactions c JOIN transcripts t ON t.path = c.path "
        "WHERE t.agent_id IS NULL ORDER BY c.path")]
    comparisons: list[turns.VersusKeeping | None] = []
    for path in paths:
        history = as_turns(turn_contexts(store, path))
        records = compaction_list(compaction_rows(store, path))
        moments = tuple(record.ts for record in records if record.ts is not None)
        comparisons += turns.versus_keeping(history, turns.steps(history, moments, prices), records, prices,
                                            settings, rates)
    return comparisons


def compaction_savings(store: Store, prices: pricing.Prices, settings: compact.CompactSettings,
                       since: date | None = None, until: date | None = None, project: str | None = None,
                       session_id: str | None = None) -> Row | None:
    """What the main threads' compactions of the local days since up to until (of one project or session, if
    given) saved so far (turns.savings_total); None without one. Each is compared with every compaction of its file,
    since the next one ends its stretch."""
    condition, parameters = range_filter(COMPACTION_COLUMNS, since, until, project, session_id)
    wanted: dict[str, set[datetime]] = {}
    for row in store.connection.execute(
            "SELECT c.path AS path, c.ts AS ts FROM compactions c JOIN transcripts t ON t.path = c.path "
            f"WHERE t.agent_id IS NULL AND c.ts IS NOT NULL AND {condition} ORDER BY c.path", parameters):
        wanted.setdefault(row["path"], set()).add(stored_time(row["ts"]))
    rates = output_rates(store) if wanted else {}
    comparisons: list[turns.VersusKeeping | None] = []
    for path, moments in wanted.items():
        history = as_turns(turn_contexts(store, path))
        records = compaction_list(compaction_rows(store, path))
        times = tuple(record.ts for record in records if record.ts is not None)
        compared = turns.versus_keeping(history, turns.steps(history, times, prices), records, prices, settings,
                                        rates)
        comparisons += [item for item, record in zip(compared, records) if record.ts in moments]
    return turns.savings_total(comparisons)


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


def live_cutoff_ns(minutes: float, now: float | None) -> int:
    """The mtime in nanoseconds a transcript must have reached to count as live: `minutes` before now."""
    moment = time.time() if now is None else now
    return int((moment - minutes * 60) * 1e9)


def session_live(store: Store, session_id: str, minutes: float, now: float | None = None) -> bool:
    """Whether a transcript of the session changed within `minutes` (by the mtime seen at the last scan), as
    live_sessions counts it."""
    cutoff_ns = live_cutoff_ns(minutes, now)
    row = store.connection.execute("SELECT 1 FROM transcripts WHERE session_id = ? AND mtime_ns >= ? LIMIT 1",
                                   (session_id, cutoff_ns)).fetchone()
    return row is not None


def live_sessions(store: Store, minutes: float, prices: pricing.Prices, now: float | None = None,
                  project: str | None = None) -> list[Row]:
    """Sessions with a transcript changed within `minutes` (by the mtime seen at the last scan), most recent first,
    with their totals so far, the main thread's last context and output, and the subagents active in the window."""
    cutoff_ns = live_cutoff_ns(minutes, now)
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


def agent_detail(store: Store, row: sqlite3.Row, prices: pricing.Prices, settings: compact.CompactSettings,
                 rates: dict[str, turns.OutputRate]) -> Row:
    """One transcript of a session: its turns (each with its context parts, growth and cache rebuild), context
    first -> last, input split, output, tools and cost, its compactions (each compared with keeping the context),
    the fixed overhead, the rebuilds, the biggest growth steps, and for a subagent what it returned."""
    rows = turn_contexts(store, row["path"])
    history = as_turns(rows)
    compactions = compaction_rows(store, row["path"])
    steps = turns.steps(history, compaction_times(compactions), prices)
    overhead = turns.overhead(history, prices)
    tools = store.connection.execute(
        "SELECT tool, COUNT(*) AS calls, COALESCE(SUM(result_chars), 0) AS result_chars FROM tool_calls "
        "WHERE path = ? GROUP BY tool ORDER BY calls DESC, tool", (row["path"],))
    return {"agent_id": row["agent_id"], "agent_type": row["agent_type"], "description": row["description"],
            "workflow_run": row["workflow_run"], "workflow_phase": row["workflow_phase"],
            "workflow_name": row["workflow_name"],
            "first_ts": row["first_ts"], "last_ts": row["last_ts"],
            "models": sorted({turn["model"] for turn in rows}),
            "model_efforts": [{"model": model, "effort": effort} for model, effort in
                              sorted({(turn["model"], turn["effort"]) for turn in rows if turn["effort"]},
                                     key=lambda pair: (pair[0], effort_order(pair[1])))],
            **usage_where(store, "u.path = ? AND u.turn = 1", (row["path"],), prices).as_dict(),
            "context_first": rows[0]["context"] if rows else None,
            "context_last": rows[-1]["context"] if rows else None,
            "input_total": sum(turn["context"] for turn in rows),
            "context_per_turn": [{"message_id": turn["message_id"], "ts": turn["ts"], "context": turn["context"],
                                  "effort": turn["effort"], "new_input": turn["new_input"],
                                  "cache_write": turn["cache_write_5m"] + turn["cache_write_1h"],
                                  "cache_read": turn["cache_read"], "growth": step.growth,
                                  "rebuild": rebuild_payload(step.rebuild)}
                                 for turn, step in zip(rows, steps)],
            "tools": [dict(tool) for tool in tools],
            "compactions": compared_compactions(history, compactions, steps, prices, settings, rates),
            "overhead": None if overhead is None else {"tokens": overhead.tokens, "cost": overhead.cost},
            "rebuilds": rebuild_totals(steps), "top_growth": top_growth(store, row["path"], history, steps),
            "returned_chars": returned_chars(store, row["tool_use_id"])}


def session_detail(store: Store, session_id: str, prices: pricing.Prices, read_prompt: bool = True,
                   settings: compact.CompactSettings = compact.DEFAULT_COMPACT) -> Row | None:
    """The main thread plus each subagent of a session, or None for an unknown id. The prompt is read from the
    transcript on demand (never stored) and is None once the file is gone, or without read_prompt: the server
    reads it after letting go of the store. settings give the auto-compact points the compactions are compared at."""
    rows = session_rows(store, session_id)
    if not rows:
        return None
    main = rows[0]
    prompt = transcripts.first_prompt(Path(main["path"])) if read_prompt and main["agent_id"] is None else None
    rates = output_rates(store)
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
            "agents": [agent_detail(store, row, prices, settings, rates) for row in rows]
            + background_detail(store, session_id, prices)}


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
    """The session's background usage as one pseudo agent, from its first snapshot with any to its last, or [] if
    there is none."""
    span = store.connection.execute(
        "SELECT MIN(ts) AS first_ts, MAX(ts) AS last_ts, COUNT(*) AS parts FROM background_parts WHERE session_id = ?",
        (session_id,)).fetchone()
    if not span["parts"]:
        return []
    models = [row["model"] for row in store.connection.execute(
        "SELECT DISTINCT model FROM background_parts WHERE session_id = ? ORDER BY model", (session_id,))]
    usage = usage_where(store, "u.session_id = ? AND u.turn = 0", (session_id,), prices).as_dict()
    return [{"agent_id": None, "agent_type": BACKGROUND, "description": BACKGROUND_DESCRIPTION,
             "workflow_run": None, "workflow_phase": None, "workflow_name": None,
             "first_ts": span["first_ts"], "last_ts": span["last_ts"], "models": models,
             **usage, "context_first": None, "context_last": None,
             "input_total": input_total(usage), "model_efforts": [],
             "context_per_turn": [], "tools": [], "compactions": [], "overhead": None,
             "rebuilds": rebuild_totals([]), "top_growth": [], "returned_chars": None}]


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
