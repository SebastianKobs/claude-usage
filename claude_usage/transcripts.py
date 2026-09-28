"""Parser for Claude Code transcripts under ~/.claude/projects/<slug>/ (format notes in CLAUDE.md).

A transcript is read from a byte offset, so a growing file (a live session) is never read from the start again:
parse() returns a Chunk with what the new part holds and the offset to continue from. Only complete lines are
consumed; a last line without "\\n" is still being written and waits for the next read. Lines are split as bytes
and decoded one by one, so the offsets are exact byte positions whatever the text contains.
"""
import json
import re
from collections.abc import Iterable
from collections.abc import Iterator
from dataclasses import dataclass
from datetime import UTC
from datetime import datetime
from pathlib import Path
from typing import Any

MAIN_AGENT_TYPE = "main"
UNKNOWN_AGENT_TYPE = "?"
SYNTHETIC_MODEL = "<synthetic>"
STANDARD_SPEED = "standard"
SUBAGENTS_DIR = "subagents"
WORKFLOWS_DIR = "workflows"             # <session-id>/subagents/workflows/<run>/: a Workflow run's agents
AGENT_PREFIX = "agent-"
META_SUFFIX = ".meta.json"
MCP_PREFIX = "mcp__"
COST_STATE = "cost-state"
COMPACT_BOUNDARY = "compact_boundary"   # the subtype of the system record a compaction leaves
# ultracode's attachments on a human prompt: on (reminderType "full"), still on ("sparse"), and off
ULTRACODE_ON = "ultra_effort_enter"
ULTRACODE_OFF = "ultra_effort_exit"
ULTRACODE_REMINDERS = ("full", "sparse")
# Claude Code's cost records name the 1M-context variant "claude-opus-5-5[1m]"; assistant records don't.
CONTEXT_SUFFIX = re.compile(r"\[[^\]]*\]$")

Record = dict[str, Any]


@dataclass(frozen=True)
class MessageUsage:
    """The final token usage of one assistant message (one API call)."""
    message_id: str
    timestamp: datetime | None          # of the message's first record in this read
    model: str
    speed: str
    new_input: int
    cache_write_5m: int
    cache_write_1h: int
    cache_read: int
    output: int
    web_searches: int = 0               # server-side web search requests of this call
    skill: str | None = None            # the skill Claude Code attributes the call to (attributionSkill)
    mcp_server: str | None = None       # the MCP server it attributes the call to (attributionMcpServer)
    request_ts: datetime | None = None  # of the last user record before it (a prompt or a tool result): the request
    end_ts: datetime | None = None      # of its last record in this read: the end of the reply
    effort: str | None = None           # the effort level it ran at (effort), e.g. medium, high, max

    @property
    def context(self) -> int:
        """New input plus cache writes and reads: the whole context the call sent, as CONTEXT in queries.py."""
        return self.new_input + self.cache_write_5m + self.cache_write_1h + self.cache_read


@dataclass(frozen=True)
class ToolCall:
    """A tool_use block of an assistant message."""
    tool_use_id: str
    tool: str                           # display name, mcp__server__tool shown as server.tool
    timestamp: datetime | None = None   # of the record with the tool_use block


@dataclass(frozen=True)
class ToolResult:
    """The size of a tool's result, found in a later user record, possibly in a later read than its call."""
    tool_use_id: str
    chars: int
    timestamp: datetime | None = None   # of the user record with the result
    lines_added: int = 0                # by an Edit or a Write (toolUseResult)
    lines_removed: int = 0


@dataclass(frozen=True)
class ApiError:
    """A failed API call: Claude Code records it as a <synthetic> assistant message with isApiErrorMessage."""
    record_id: str                      # the record's uuid
    timestamp: datetime | None
    error: str                          # e.g. rate_limit, server_error
    status: int | None                  # the HTTP status (apiErrorStatus), e.g. 429
    limit_type: str | None              # for a rate limit, the quota that was hit (e.g. five_hour)
    resets_at: datetime | None          # and when it resets


@dataclass(frozen=True)
class Compaction:
    """A compaction of the conversation: Claude Code's compact_boundary system record and its compactMetadata. The
    counts are None when the record has no metadata."""
    record_id: str                      # the record's uuid
    timestamp: datetime | None
    trigger: str | None                 # manual (/compact) or auto
    pre_tokens: int | None              # the context before
    post_tokens: int | None             # and after
    duration_ms: int | None             # how long the summary took


@dataclass(frozen=True)
class UltracodeState:
    """Ultracode's state as Claude Code noted it on a human prompt: switched on, reminded that it still is, or
    switched off. Picking another effort level switches it off without a note."""
    record_id: str                      # the attachment record's uuid
    timestamp: datetime | None
    active: bool


@dataclass(frozen=True)
class ModelTotals:
    """One model's cumulative usage in a cost-state record."""
    model: str                          # without a [1m]-style suffix
    new_input: int
    cache_write: int                    # no 5m/1h split in cost-state records
    cache_read: int
    output: int
    cost_usd: float                     # Claude Code's own estimate
    web_searches: int = 0


@dataclass(frozen=True)
class CostState:
    """The usage Claude Code records when its process ends: the totals since that process started (a session run
    over several processes gets one per process). It includes calls that no transcript shows, such as Haiku for
    titles."""
    snapshot_ts: datetime | None        # of the last timestamped record before it in the same read
    models: tuple[ModelTotals, ...]
    start_ts: datetime | None = None    # when the process started (startTime)
    duration_ms: int = 0                # wall-clock time of the process (totalDuration)
    api_ms: int = 0                     # time spent waiting on API calls, retries included (totalAPIDuration)
    api_ms_without_retries: int = 0     # the same without retries (totalAPIDurationWithoutRetries)
    tool_ms: int = 0                    # time spent running tools (totalToolDuration)
    lines_added: int = 0                # lines the process's edits added (totalLinesAdded)
    lines_removed: int = 0              # and removed (totalLinesRemoved)


@dataclass(frozen=True)
class Chunk:
    """What one read of a transcript file found, from start_offset up to end_offset. Fields that the part doesn't
    contain are None (or empty)."""
    path: Path
    start_offset: int
    end_offset: int
    slug: str
    session_id: str
    agent_id: str | None                # None for the main thread
    agent_type: str                     # "main", the meta file's agentType, or "?"
    description: str | None
    cwd: str | None                     # the first one seen in this part
    git_branch: str | None              # the last one seen in this part
    title: str | None                   # the last ai-title of this part
    messages: tuple[MessageUsage, ...]
    tool_calls: tuple[ToolCall, ...]
    tool_results: tuple[ToolResult, ...]
    first_ts: datetime | None
    last_ts: datetime | None
    cost_state: CostState | None = None  # the last one in this part
    last_user_ts: datetime | None = None  # of the last user record in this part, the request of a reply in the next
    api_errors: tuple[ApiError, ...] = ()
    compactions: tuple[Compaction, ...] = ()
    ultracode_states: tuple[UltracodeState, ...] = ()
    tool_use_id: str | None = None      # of a subagent, the Agent tool call that spawned it (the meta's toolUseId)
    workflow_run: str | None = None     # of a workflow agent, its run's folder (wf_...)
    workflow_phase: str | None = None   # the meta's workflowPhase
    workflow_name: str | None = None    # the run's workflowName, from <session-id>/workflows/<run>.json


# --- reading -----------------------------------------------------------------------------------------------------

def decode_line(raw: bytes) -> Record | None:
    """The JSON object on one line, or None for blank, unreadable or non-object lines."""
    try:
        record = json.loads(raw.decode("utf-8", errors="replace"))
    except (ValueError, RecursionError):      # RecursionError: nested deeper than the decoder's stack
        return None
    if isinstance(record, dict):
        return record
    return None


def read_lines(path: Path, offset: int = 0) -> tuple[list[Record], int]:
    """The records from offset up to the last complete line, and the offset just after that line."""
    with path.open("rb") as handle:
        handle.seek(offset)
        data = handle.read()
    end = data.rfind(b"\n") + 1               # 0 when there is no complete line yet
    records = []
    for raw in data[:end].split(b"\n"):
        record = decode_line(raw)
        if record is not None:
            records.append(record)
    return records, offset + end


def iter_lines(path: Path) -> Iterator[Record]:
    """The records of a whole file, one line at a time, for reads that stop early."""
    with path.open("rb") as handle:
        for raw in handle:
            if not raw.endswith(b"\n"):
                return                         # still being written
            record = decode_line(raw)
            if record is not None:
                yield record


# --- field helpers -----------------------------------------------------------------------------------------------

def count(value: Any) -> int:
    """A token counter; missing, null or non-numeric values count as 0."""
    if isinstance(value, int) and not isinstance(value, bool):
        return value
    return 0


def text_or_none(value: Any) -> str | None:
    """value if it is a non-empty string, else None."""
    if isinstance(value, str) and value:
        return value
    return None


def parse_timestamp(value: Any) -> datetime | None:
    """An ISO timestamp like 2026-09-01T12:00:00.000Z, or None if it is missing or invalid. One without a zone
    counts as UTC, so every timestamp compares with every other."""
    if not isinstance(value, str):
        return None
    try:
        moment = datetime.fromisoformat(value)
    except ValueError:
        return None
    if moment.tzinfo is None:
        return moment.replace(tzinfo=UTC)
    return moment


def message_of(record: Record) -> Record | None:
    """The record's message object, or None."""
    message = record.get("message")
    if isinstance(message, dict):
        return message
    return None


def content_blocks(record: Record) -> list[Record]:
    """The dict blocks of a record's message content (a string content has none)."""
    message = message_of(record)
    content = message.get("content") if message else None
    if not isinstance(content, list):
        return []
    return [block for block in content if isinstance(block, dict)]


def display_name(tool: str) -> str:
    """mcp__<server>__<tool> as <server>.<tool>; other names unchanged."""
    if not tool.startswith(MCP_PREFIX):
        return tool
    server, separator, name = tool[len(MCP_PREFIX):].partition("__")
    if not separator:
        return tool
    return f"{server}.{name}"


def result_chars(content: Any) -> int:
    """Characters of a tool result: a string, or the text blocks of a list (images and references don't count)."""
    if isinstance(content, str):
        return len(content)
    if not isinstance(content, list):
        return 0
    return sum(len(block.get("text") or "") for block in content
               if isinstance(block, dict) and block.get("type") == "text")


# --- record groups -----------------------------------------------------------------------------------------------

def usage_of(message_id: str, timestamp: datetime | None, model: str, usage: Record,
             attribution: tuple[str | None, str | None] = (None, None),
             span: tuple[datetime | None, datetime | None] = (None, None),
             effort: str | None = None) -> MessageUsage:
    """A MessageUsage from a message.usage block, its (skill, MCP server) attribution, its (request, end) span and
    its effort level; without the 5m/1h split all cache writes count as 5m."""
    server_tools = usage.get("server_tool_use") if isinstance(usage.get("server_tool_use"), dict) else {}
    split = usage.get("cache_creation")
    if isinstance(split, dict):
        cache_write_5m = count(split.get("ephemeral_5m_input_tokens"))
        cache_write_1h = count(split.get("ephemeral_1h_input_tokens"))
    else:
        cache_write_5m = count(usage.get("cache_creation_input_tokens"))
        cache_write_1h = 0
    return MessageUsage(message_id=message_id, timestamp=timestamp, model=model,
                        speed=text_or_none(usage.get("speed")) or STANDARD_SPEED,
                        new_input=count(usage.get("input_tokens")),
                        cache_write_5m=cache_write_5m, cache_write_1h=cache_write_1h,
                        cache_read=count(usage.get("cache_read_input_tokens")),
                        output=count(usage.get("output_tokens")),
                        web_searches=count(server_tools.get("web_search_requests")),
                        skill=attribution[0], mcp_server=attribution[1], request_ts=span[0], end_ts=span[1],
                        effort=effort)


@dataclass
class MessageTrack:
    """What a MessageAccumulator keeps of one assistant message id while reading its records."""
    timestamp: datetime | None          # of its first record
    model: str
    usage: Record                       # the latest; the last record of an id carries the final usage
    request_ts: datetime | None
    end_ts: datetime | None = None
    attribution: tuple[str | None, str | None] = (None, None)
    effort: str | None = None


class MessageAccumulator:
    """The final usage per assistant message id, in order of first appearance. A message is stored as one record
    per content block; the last record of an id carries the final usage. Every record of an id carries the same
    attribution and effort level; the last one set counts. Synthetic messages are skipped."""

    def __init__(self) -> None:
        self.messages: dict[str, MessageTrack] = {}

    def add(self, record: Record, request_ts: datetime | None = None) -> str | None:
        """Take in one assistant record, whose request (the last user record before it) was at request_ts; returns
        its message id, or None for a record without usage."""
        message = message_of(record)
        if message is None:
            return None
        message_id = text_or_none(message.get("id"))
        model = text_or_none(message.get("model")) or ""
        usage = message.get("usage")
        if message_id is None or model == SYNTHETIC_MODEL or not isinstance(usage, dict):
            return None
        timestamp = parse_timestamp(record.get("timestamp"))
        track = self.messages.setdefault(message_id, MessageTrack(timestamp, model, usage, request_ts))
        track.end_ts = timestamp or track.end_ts
        track.usage = usage
        skill = text_or_none(record.get("attributionSkill"))
        mcp_server = text_or_none(record.get("attributionMcpServer"))
        if skill or mcp_server:
            track.attribution = (skill, mcp_server)
        track.effort = text_or_none(record.get("effort")) or track.effort
        return message_id

    def usage(self, message_id: str) -> MessageUsage:
        """The final usage of one message id taken in."""
        track = self.messages[message_id]
        return usage_of(message_id, track.timestamp, track.model, track.usage, track.attribution,
                        (track.request_ts, track.end_ts), track.effort)

    def usages(self) -> list[MessageUsage]:
        """The final usage of every message id taken in, in order of first appearance."""
        return [self.usage(message_id) for message_id in self.messages]


def message_usages(records: Iterable[Record], last_user_ts: datetime | None = None) -> list[MessageUsage]:
    """The final usage per assistant message id (see MessageAccumulator). A message's request is the last user
    record before it, last_user_ts when that was in an earlier read."""
    accumulator = MessageAccumulator()
    for record in records:
        if record.get("type") == "user":
            last_user_ts = parse_timestamp(record.get("timestamp")) or last_user_ts
        elif record.get("type") == "assistant":
            accumulator.add(record, last_user_ts)
    return accumulator.usages()


def tool_calls(records: Iterable[Record]) -> list[ToolCall]:
    """The tool_use blocks of assistant records, once per id."""
    calls: dict[str, ToolCall] = {}
    for record in records:
        if record.get("type") != "assistant":
            continue
        for block in content_blocks(record):
            tool_use_id = text_or_none(block.get("id"))
            name = text_or_none(block.get("name"))
            if block.get("type") == "tool_use" and tool_use_id and name and tool_use_id not in calls:
                calls[tool_use_id] = ToolCall(tool_use_id, display_name(name),
                                              parse_timestamp(record.get("timestamp")))
    return list(calls.values())


def changed_lines(result: Any) -> tuple[int, int]:
    """(added, removed) lines of an Edit's or a Write's toolUseResult: the "+" and "-" lines of its patch, or every
    line of a file it created. Only counted, never kept."""
    if not isinstance(result, dict):
        return 0, 0
    if result.get("type") == "create" and isinstance(result.get("content"), str):
        return len(result["content"].splitlines()), 0
    patch = result.get("structuredPatch")
    added = 0
    removed = 0
    for hunk in patch if isinstance(patch, list) else []:
        lines = hunk.get("lines") if isinstance(hunk, dict) else None
        for line in lines if isinstance(lines, list) else []:
            if isinstance(line, str) and line.startswith("+"):
                added += 1
            elif isinstance(line, str) and line.startswith("-"):
                removed += 1
    return added, removed


def tool_results(records: Iterable[Record]) -> list[ToolResult]:
    """The tool_result blocks of user records, with their size, time and the lines the tool changed (the record's
    toolUseResult, counted for its first result); the last one per id counts."""
    results: dict[str, ToolResult] = {}
    for record in records:
        if record.get("type") != "user":
            continue
        added, removed = changed_lines(record.get("toolUseResult"))
        for block in content_blocks(record):
            tool_use_id = text_or_none(block.get("tool_use_id"))
            if block.get("type") == "tool_result" and tool_use_id:
                results[tool_use_id] = ToolResult(tool_use_id, result_chars(block.get("content")),
                                                  parse_timestamp(record.get("timestamp")), added, removed)
                added = 0
                removed = 0
    return list(results.values())


def epoch_seconds(value: Any) -> datetime | None:
    """A time in seconds since the epoch as a UTC datetime, or None (also for one out of datetime's range, such as
    milliseconds given as seconds)."""
    if isinstance(value, bool) or not isinstance(value, (int, float)) or value <= 0:
        return None
    try:
        return datetime.fromtimestamp(value, UTC)
    except (ValueError, OverflowError, OSError):
        return None


def api_errors(records: Iterable[Record]) -> list[ApiError]:
    """The failed API calls, once per record uuid; records without one are skipped."""
    errors: dict[str, ApiError] = {}
    for record in records:
        record_id = text_or_none(record.get("uuid"))
        if record.get("type") != "assistant" or record.get("isApiErrorMessage") is not True or record_id is None:
            continue
        quota = record.get("quotaLimits") if isinstance(record.get("quotaLimits"), dict) else {}
        status = record.get("apiErrorStatus")
        errors.setdefault(record_id, ApiError(
            record_id=record_id, timestamp=parse_timestamp(record.get("timestamp")),
            error=text_or_none(record.get("error")) or "unknown",
            status=status if isinstance(status, int) and not isinstance(status, bool) else None,
            limit_type=text_or_none(quota.get("rateLimitType")), resets_at=epoch_seconds(quota.get("resetsAt"))))
    return list(errors.values())


def count_or_none(value: Any) -> int | None:
    """An integer count, or None if it is missing or not an integer."""
    if isinstance(value, int) and not isinstance(value, bool):
        return value
    return None


def compaction(record: Record, record_id: str) -> Compaction:
    """A compact_boundary record with its compactMetadata, filed under record_id."""
    metadata = record.get("compactMetadata") if isinstance(record.get("compactMetadata"), dict) else {}
    return Compaction(record_id=record_id, timestamp=parse_timestamp(record.get("timestamp")),
                      trigger=text_or_none(metadata.get("trigger")),
                      pre_tokens=count_or_none(metadata.get("preTokens")),
                      post_tokens=count_or_none(metadata.get("postTokens")),
                      duration_ms=count_or_none(metadata.get("durationMs")))


def compactions(records: Iterable[Record]) -> list[Compaction]:
    """The compactions, once per record uuid; records without one are skipped."""
    found: dict[str, Compaction] = {}
    for record in records:
        record_id = text_or_none(record.get("uuid"))
        if record.get("type") != "system" or record.get("subtype") != COMPACT_BOUNDARY or record_id is None:
            continue
        found.setdefault(record_id, compaction(record, record_id))
    return list(found.values())


def ultracode_active(record: Record) -> bool | None:
    """Whether an attachment record says ultracode is on (True) or switched off (False); None for other
    records."""
    attachment = record.get("attachment") if record.get("type") == "attachment" else None
    if not isinstance(attachment, dict):
        return None
    if attachment.get("type") == ULTRACODE_OFF:
        return False
    if attachment.get("type") == ULTRACODE_ON and attachment.get("reminderType") in ULTRACODE_REMINDERS:
        return True
    return None


def ultracode_states(records: Iterable[Record]) -> list[UltracodeState]:
    """Ultracode's states, once per record uuid; records without one are skipped."""
    found: dict[str, UltracodeState] = {}
    for record in records:
        record_id = text_or_none(record.get("uuid"))
        active = ultracode_active(record)
        if active is None or record_id is None:
            continue
        found.setdefault(record_id, UltracodeState(record_id, parse_timestamp(record.get("timestamp")), active))
    return list(found.values())


def cost_usd(value: Any) -> float:
    """A dollar amount; missing or non-numeric values count as 0."""
    if isinstance(value, (int, float)) and not isinstance(value, bool):
        return float(value)
    return 0.0


def start_time(value: Any) -> datetime | None:
    """A cost-state startTime (milliseconds since the epoch) as a UTC datetime, or None."""
    if isinstance(value, bool) or not isinstance(value, (int, float)):
        return None
    return epoch_seconds(value / 1000)


def cost_state_of(record: Record, snapshot_ts: datetime | None) -> CostState:
    """A CostState from a cost-state record; models are merged by their id without a [1m]-style suffix."""
    totals: dict[str, list[float]] = {}
    model_usage = record.get("modelUsage")
    for model, values in (model_usage.items() if isinstance(model_usage, dict) else []):
        if not isinstance(values, dict) or not isinstance(model, str):
            continue
        sums = totals.setdefault(CONTEXT_SUFFIX.sub("", model), [0, 0, 0, 0, 0.0, 0])
        sums[0] += count(values.get("inputTokens"))
        sums[1] += count(values.get("cacheCreationInputTokens"))
        sums[2] += count(values.get("cacheReadInputTokens"))
        sums[3] += count(values.get("outputTokens"))
        sums[4] += cost_usd(values.get("costUSD"))
        sums[5] += count(values.get("webSearchRequests"))
    models = tuple(ModelTotals(model, int(sums[0]), int(sums[1]), int(sums[2]), int(sums[3]), sums[4], int(sums[5]))
                   for model, sums in totals.items())
    return CostState(snapshot_ts, models, start_time(record.get("startTime")),
                     duration_ms=count(record.get("totalDuration")), api_ms=count(record.get("totalAPIDuration")),
                     api_ms_without_retries=count(record.get("totalAPIDurationWithoutRetries")),
                     tool_ms=count(record.get("totalToolDuration")),
                     lines_added=count(record.get("totalLinesAdded")),
                     lines_removed=count(record.get("totalLinesRemoved")))


# --- files -------------------------------------------------------------------------------------------------------

def session_folder(path: Path) -> Path | None:
    """The <session-id> folder of a subagent (<session-id>/subagents/agent-<id>.jsonl) or a workflow agent
    (<session-id>/subagents/workflows/<run>/agent-<id>.jsonl); None for a main transcript."""
    if not path.name.startswith(AGENT_PREFIX):
        return None
    if path.parent.name == SUBAGENTS_DIR:
        return path.parents[1]
    if len(path.parents) > 3 and path.parents[1].name == WORKFLOWS_DIR and path.parents[2].name == SUBAGENTS_DIR:
        return path.parents[3]
    return None


def is_subagent_file(path: Path) -> bool:
    """A subagent's or a workflow agent's transcript."""
    return session_folder(path) is not None


def workflow_run(path: Path) -> str | None:
    """A workflow agent's run (its folder's name); None for other transcripts."""
    if not is_subagent_file(path) or path.parent.name == SUBAGENTS_DIR:
        return None
    return path.parent.name


def workflow_name(path: Path, run: str) -> str | None:
    """The workflowName in the run's <session-id>/workflows/<run>.json, or None if it is missing or unreadable. The
    file also holds the run's script and results: only the name is read out of it."""
    folder = session_folder(path)
    try:
        values = json.loads((folder / WORKFLOWS_DIR / f"{run}.json").read_text(encoding="utf-8"))
    except (OSError, ValueError, RecursionError):
        return None
    return text_or_none(values.get("workflowName")) if isinstance(values, dict) else None


def slug_for(project_path: str) -> str:
    """The <slug> folder Claude Code uses for a project path: every non-alphanumeric character replaced by "-"."""
    return re.sub(r"[^A-Za-z0-9]", "-", project_path)


def project_slug(path: Path) -> str:
    """The <slug> folder a transcript belongs to."""
    folder = session_folder(path)
    return path.parent.name if folder is None else folder.parent.name


def parse_session_id(path: Path) -> str:
    """The session a transcript belongs to, from its path."""
    folder = session_folder(path)
    return path.stem if folder is None else folder.name


def meta_path(path: Path) -> Path:
    """The agent-<id>.meta.json next to a subagent's transcript."""
    return path.with_name(f"{path.stem}{META_SUFFIX}")


def read_meta(path: Path) -> Record:
    """A subagent's agent-<id>.meta.json, or {} if it is missing or unreadable."""
    try:
        meta = json.loads(meta_path(path).read_text(encoding="utf-8"))
    except (OSError, ValueError):
        return {}
    if isinstance(meta, dict):
        return meta
    return {}


def find_transcripts(projects_dir: Path) -> list[Path]:
    """The main (<slug>/<session-id>.jsonl) and subagent transcripts below projects_dir, sorted."""
    if not projects_dir.is_dir():
        raise FileNotFoundError(f"projects folder not found: {projects_dir}")
    main = projects_dir.glob("*/*.jsonl")
    subagents = projects_dir.glob(f"*/*/{SUBAGENTS_DIR}/{AGENT_PREFIX}*.jsonl")
    workflow_agents = projects_dir.glob(f"*/*/{SUBAGENTS_DIR}/{WORKFLOWS_DIR}/*/{AGENT_PREFIX}*.jsonl")
    return sorted(path for path in [*main, *subagents, *workflow_agents] if path.is_file())


def parse(path: Path, offset: int = 0, last_user_ts: datetime | None = None) -> Chunk:
    """The Chunk of a transcript from offset up to its last complete line; last_user_ts is the time of the last user
    record before offset, the request of a reply that starts this part."""
    records, end_offset = read_lines(path, offset)
    if is_subagent_file(path):
        meta = read_meta(path)
        session_id = parse_session_id(path)
        agent_id: str | None = path.stem[len(AGENT_PREFIX):]
        agent_type = text_or_none(meta.get("agentType")) or UNKNOWN_AGENT_TYPE
        description = text_or_none(meta.get("description"))
        tool_use_id = text_or_none(meta.get("toolUseId"))
        phase = text_or_none(meta.get("workflowPhase"))
    else:
        session_id = parse_session_id(path)
        agent_id = None
        agent_type = MAIN_AGENT_TYPE
        description = None
        tool_use_id = None
        phase = None
    run = workflow_run(path)

    cwd = None
    git_branch = None
    title = None
    cost_state = None
    timestamps = []
    user_timestamps = []
    for record in records:
        cwd = cwd or text_or_none(record.get("cwd"))
        git_branch = text_or_none(record.get("gitBranch")) or git_branch
        if record.get("type") == "ai-title":
            title = text_or_none(record.get("aiTitle")) or title
        if record.get("type") == COST_STATE:
            # the record has no timestamp of its own; the one before it marks when the totals were taken
            cost_state = cost_state_of(record, timestamps[-1] if timestamps else None)
        timestamp = parse_timestamp(record.get("timestamp"))
        if timestamp is not None:
            timestamps.append(timestamp)
        if timestamp is not None and record.get("type") == "user":
            user_timestamps.append(timestamp)

    return Chunk(path=path, start_offset=offset, end_offset=end_offset, slug=project_slug(path),
                 session_id=session_id, agent_id=agent_id, agent_type=agent_type, description=description,
                 cwd=cwd, git_branch=git_branch, title=title,
                 messages=tuple(message_usages(records, last_user_ts)),
                 tool_calls=tuple(tool_calls(records)),
                 tool_results=tuple(tool_results(records)),
                 first_ts=min(timestamps, default=None), last_ts=max(timestamps, default=None),
                 cost_state=cost_state, api_errors=tuple(api_errors(records)),
                 compactions=tuple(compactions(records)), ultracode_states=tuple(ultracode_states(records)),
                 tool_use_id=tool_use_id,
                 last_user_ts=user_timestamps[-1] if user_timestamps else None,
                 workflow_run=run, workflow_phase=phase if run else None,
                 workflow_name=None if run is None else workflow_name(path, run))


def prompt_text(record: Record) -> str | None:
    """The text of a user prompt record; None for meta and compact-summary records and tool results."""
    if record.get("type") != "user" or record.get("isMeta") or record.get("isCompactSummary"):
        return None
    message = message_of(record)
    content = message.get("content") if message else None
    if isinstance(content, str):
        return content
    blocks = content_blocks(record)
    if not blocks or any(block.get("type") == "tool_result" for block in blocks):
        return None
    return "\n".join(block.get("text") or "" for block in blocks if block.get("type") == "text")


def first_prompt(path: Path) -> str | None:
    """The first non-blank line of the session's first prompt, read from the file on demand (never stored);
    None if there is none or the file is gone."""
    try:
        for record in iter_lines(path):
            text = prompt_text(record)
            lines = [line.strip() for line in (text or "").splitlines() if line.strip()]
            if lines:
                return lines[0]
    except OSError:
        return None
    return None
