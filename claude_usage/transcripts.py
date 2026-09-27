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
from dataclasses import replace
from datetime import UTC
from datetime import datetime
from pathlib import Path
from typing import Any

MAIN_AGENT_TYPE = "main"
UNKNOWN_AGENT_TYPE = "?"
SYNTHETIC_MODEL = "<synthetic>"
STANDARD_SPEED = "standard"
SUBAGENTS_DIR = "subagents"
AGENT_PREFIX = "agent-"
META_SUFFIX = ".meta.json"
MCP_PREFIX = "mcp__"
COST_STATE = "cost-state"
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


# --- reading -----------------------------------------------------------------------------------------------------

def decode_line(raw: bytes) -> Record | None:
    """The JSON object on one line, or None for blank, unreadable or non-object lines."""
    try:
        record = json.loads(raw.decode("utf-8", errors="replace"))
    except ValueError:
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
    """An ISO timestamp like 2026-09-01T12:00:00.000Z, or None if it is missing or invalid."""
    if not isinstance(value, str):
        return None
    try:
        return datetime.fromisoformat(value)
    except ValueError:
        return None


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


def message_usages(records: Iterable[Record], last_user_ts: datetime | None = None) -> list[MessageUsage]:
    """The final usage per assistant message id, in order of first appearance. A message is stored as one record
    per content block; the last record of an id carries the final usage. Every record of an id carries the same
    attribution and effort level; the last one set counts. A message's request is the last user record before it,
    last_user_ts when that was in an earlier read. Synthetic messages are skipped."""
    first_seen: dict[str, tuple[datetime | None, str]] = {}
    last_usage: dict[str, Record] = {}
    attributions: dict[str, tuple[str | None, str | None]] = {}
    requests: dict[str, datetime | None] = {}
    ends: dict[str, datetime | None] = {}
    efforts: dict[str, str] = {}
    for record in records:
        if record.get("type") == "user":
            last_user_ts = parse_timestamp(record.get("timestamp")) or last_user_ts
        if record.get("type") != "assistant":
            continue
        message = message_of(record)
        if message is None:
            continue
        message_id = text_or_none(message.get("id"))
        model = text_or_none(message.get("model")) or ""
        usage = message.get("usage")
        if message_id is None or model == SYNTHETIC_MODEL or not isinstance(usage, dict):
            continue
        first_seen.setdefault(message_id, (parse_timestamp(record.get("timestamp")), model))
        requests.setdefault(message_id, last_user_ts)
        ends[message_id] = parse_timestamp(record.get("timestamp")) or ends.get(message_id)
        last_usage[message_id] = usage
        skill = text_or_none(record.get("attributionSkill"))
        mcp_server = text_or_none(record.get("attributionMcpServer"))
        if skill or mcp_server:
            attributions[message_id] = (skill, mcp_server)
        effort = text_or_none(record.get("effort"))
        if effort:
            efforts[message_id] = effort
    return [usage_of(message_id, timestamp, model, last_usage[message_id],
                     attributions.get(message_id, (None, None)), (requests[message_id], ends[message_id]),
                     efforts.get(message_id))
            for message_id, (timestamp, model) in first_seen.items()]


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
    """A time in seconds since the epoch as a UTC datetime, or None."""
    if isinstance(value, bool) or not isinstance(value, (int, float)) or value <= 0:
        return None
    return datetime.fromtimestamp(value, UTC)


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

def is_subagent_file(path: Path) -> bool:
    """<slug>/<session-id>/subagents/agent-<id>.jsonl"""
    return path.parent.name == SUBAGENTS_DIR and path.name.startswith(AGENT_PREFIX)


def slug_for(project_path: str) -> str:
    """The <slug> folder Claude Code uses for a project path: every non-alphanumeric character replaced by "-"."""
    return re.sub(r"[^A-Za-z0-9]", "-", project_path)


def project_slug(path: Path) -> str:
    """The <slug> folder a transcript belongs to."""
    if is_subagent_file(path):
        return path.parents[2].name
    return path.parent.name


def parse_session_id(path: Path) -> str:
    """The session a transcript belongs to, from its path."""
    if is_subagent_file(path):
        return path.parents[1].name
    return path.stem


def read_meta(path: Path) -> Record:
    """A subagent's agent-<id>.meta.json, or {} if it is missing or unreadable."""
    meta_path = path.with_name(f"{path.stem}{META_SUFFIX}")
    try:
        meta = json.loads(meta_path.read_text(encoding="utf-8"))
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
    return sorted(path for path in [*main, *subagents] if path.is_file())


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
    else:
        session_id = parse_session_id(path)
        agent_id = None
        agent_type = MAIN_AGENT_TYPE
        description = None

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
                 last_user_ts=user_timestamps[-1] if user_timestamps else None)


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


# --- the conversation, for the session view: read from the file on demand, never stored --------------------------

CHAT_TOOL_LIMIT = 4000                  # characters of a tool's input or result the view gets
CHAT_TEXT_LIMIT = 20000                 # of a prompt or reply (a pasted log can be huge)
SUMMARY_LIMIT = 200
# the input field that says what a call does, in order: the first one a call has is its summary
SUMMARY_FIELDS = ("command", "file_path", "path", "pattern", "url", "query", "description", "skill", "prompt")


@dataclass(frozen=True)
class ToolField:
    """One field of a tool call's input: a string as it is, anything else as indented JSON; cut to
    CHAT_TOOL_LIMIT on its own, so one long field doesn't hide the others."""
    name: str
    value: str
    chars: int                          # the full length
    is_json: bool


@dataclass(frozen=True)
class ChatEntry:
    """One step of a conversation: a prompt, a reply's text or thinking, a tool call with its result, or a marker
    (a compaction, a failed API call)."""
    kind: str                           # prompt, text, thinking, tool, compaction or error
    timestamp: datetime | None
    text: str | None = None             # of a prompt, text, thinking or marker, cut to CHAT_TEXT_LIMIT
    model: str | None = None            # of a reply
    tool: str | None = None             # display name of a call
    summary: str | None = None          # what the call does, from its input
    tool_fields: tuple[ToolField, ...] = ()  # the input, field by field
    result: str | None = None           # None while the call has no result yet
    result_chars: int = 0
    is_error: bool = False
    effort: str | None = None           # of a reply: the effort level it ran at
    usage: MessageUsage | None = None   # on the last entry of an API call: its final token usage


def cut(text: str, limit: int) -> str:
    """text, cut to at most limit characters."""
    return text[:limit]


def result_text(content: Any) -> str:
    """A tool result as text: a string, or its text blocks with a marker for every other block (an image)."""
    if isinstance(content, str):
        return content
    if not isinstance(content, list):
        return ""
    parts = []
    for block in content:
        if not isinstance(block, dict):
            continue
        if block.get("type") == "text":
            parts.append(block.get("text") or "")
        else:
            parts.append(f"[{block.get('type') or 'block'}]")
    return "\n".join(parts)


def call_summary(tool_input: Any) -> str | None:
    """The first SUMMARY_FIELDS value of a call's input, as one short line."""
    if not isinstance(tool_input, dict):
        return None
    for field in SUMMARY_FIELDS:
        value = tool_input.get(field)
        if isinstance(value, str) and value.strip():
            return cut(value.strip().splitlines()[0], SUMMARY_LIMIT)
    return None


@dataclass
class Reply:
    """What conversation() tracks of one API call while reading: its last entry and its latest usage."""
    timestamp: datetime | None
    model: str
    effort: str | None
    usage: Record
    last_entry: int | None = None


def tool_fields(tool_input: Any) -> tuple[ToolField, ...]:
    """A call's input field by field; an input that isn't an object is one JSON field named input."""
    fields = tool_input.items() if isinstance(tool_input, dict) else [("input", tool_input)]
    result = []
    for name, value in fields:
        is_json = not isinstance(value, str)
        text = json.dumps(value, indent=2, ensure_ascii=False) if is_json else value
        result.append(ToolField(str(name), cut(text, CHAT_TOOL_LIMIT), len(text), is_json))
    return tuple(result)


def reply_entries(record: Record, calls: dict[str, int], entries: list[ChatEntry],
                  replies: dict[str, Reply]) -> None:
    """Append an assistant record's blocks to entries; calls maps each tool_use id to its entry's index, replies
    each message id to its Reply."""
    message = message_of(record) or {}
    timestamp = parse_timestamp(record.get("timestamp"))
    model = text_or_none(message.get("model"))
    effort = text_or_none(record.get("effort"))
    start = len(entries)
    for block in content_blocks(record):
        kind = block.get("type")
        if kind == "text" and text_or_none(block.get("text")):
            entries.append(ChatEntry("text", timestamp, cut(block["text"], CHAT_TEXT_LIMIT), model=model,
                                     effort=effort))
        elif kind == "thinking" and text_or_none(block.get("thinking")):
            entries.append(ChatEntry("thinking", timestamp, cut(block["thinking"], CHAT_TEXT_LIMIT), model=model,
                                     effort=effort))
        elif kind == "tool_use" and text_or_none(block.get("id")) and text_or_none(block.get("name")):
            calls[block["id"]] = len(entries)
            entries.append(ChatEntry("tool", timestamp, model=model, tool=display_name(block["name"]),
                                     summary=call_summary(block.get("input")),
                                     tool_fields=tool_fields(block.get("input")),
                                     effort=effort))
    message_id = text_or_none(message.get("id"))
    usage = message.get("usage")
    if message_id is None or model is None or model == SYNTHETIC_MODEL or not isinstance(usage, dict):
        return
    reply = replies.setdefault(message_id, Reply(timestamp, model, effort, usage))
    reply.usage = usage                 # the last record of a message id carries the final usage
    reply.effort = effort or reply.effort
    if len(entries) > start:
        reply.last_entry = len(entries) - 1


def add_usage(entries: list[ChatEntry], replies: dict[str, Reply]) -> None:
    """Put each API call's final usage on its last entry (a call without a shown entry has nowhere to go)."""
    for message_id, reply in replies.items():
        if reply.last_entry is not None:
            usage = usage_of(message_id, reply.timestamp, reply.model, reply.usage, effort=reply.effort)
            entries[reply.last_entry] = replace(entries[reply.last_entry], usage=usage)


def add_results(record: Record, calls: dict[str, int], entries: list[ChatEntry]) -> None:
    """Put a user record's tool results into the entries of their calls (a result without a call is dropped)."""
    for block in content_blocks(record):
        index = calls.get(text_or_none(block.get("tool_use_id")) or "")
        if block.get("type") != "tool_result" or index is None:
            continue
        text = result_text(block.get("content"))
        entries[index] = replace(entries[index], result=cut(text, CHAT_TOOL_LIMIT), result_chars=len(text),
                                 is_error=block.get("is_error") is True)


def conversation(path: Path) -> list[ChatEntry]:
    """The conversation of one transcript file in order: prompts, reply text and thinking with text, tool calls
    with their results, compactions and failed API calls. Injected user records (isMeta, skill text with
    sourceToolUseID, compact summaries) are left out. The last entry of each API call carries its final usage.
    Raises OSError if the file is gone."""
    entries: list[ChatEntry] = []
    calls: dict[str, int] = {}
    replies: dict[str, Reply] = {}
    for record in iter_lines(path):
        kind = record.get("type")
        timestamp = parse_timestamp(record.get("timestamp"))
        if kind == "system" and record.get("subtype") == "compact_boundary":
            entries.append(ChatEntry("compaction", timestamp, "Conversation compacted"))
        elif kind == "assistant" and record.get("isApiErrorMessage") is True:
            status = record.get("apiErrorStatus")
            error = text_or_none(record.get("error")) or "unknown"
            entries.append(ChatEntry("error", timestamp, f"{error} ({status})" if isinstance(status, int) else error))
        elif kind == "assistant":
            reply_entries(record, calls, entries, replies)
        elif kind == "user" and not record.get("sourceToolUseID"):
            add_results(record, calls, entries)
            text = prompt_text(record)
            if text and text.strip():
                entries.append(ChatEntry("prompt", timestamp, cut(text, CHAT_TEXT_LIMIT)))
    add_usage(entries, replies)
    return entries
