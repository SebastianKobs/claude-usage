"""Parser for Claude Code transcripts under ~/.claude/projects/<slug>/ (format notes in todo.md).

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


@dataclass(frozen=True)
class ToolCall:
    """A tool_use block of an assistant message."""
    tool_use_id: str
    tool: str                           # display name, mcp__server__tool shown as server.tool


@dataclass(frozen=True)
class ToolResult:
    """The size of a tool's result, found in a later user record, possibly in a later read than its call."""
    tool_use_id: str
    chars: int


@dataclass(frozen=True)
class ModelTotals:
    """One model's cumulative usage in a cost-state record."""
    model: str                          # without a [1m]-style suffix
    new_input: int
    cache_write: int                    # no 5m/1h split in cost-state records
    cache_read: int
    output: int
    cost_usd: float                     # Claude Code's own estimate


@dataclass(frozen=True)
class CostState:
    """The cumulative usage Claude Code records when a session ends (again with the new totals after a resume).
    It includes calls that no transcript shows, such as Haiku for titles."""
    snapshot_ts: datetime | None        # of the last timestamped record before it in the same read
    models: tuple[ModelTotals, ...]


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

def usage_of(message_id: str, timestamp: datetime | None, model: str, usage: Record) -> MessageUsage:
    """A MessageUsage from a message.usage block; without the 5m/1h split all cache writes count as 5m."""
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
                        output=count(usage.get("output_tokens")))


def message_usages(records: Iterable[Record]) -> list[MessageUsage]:
    """The final usage per assistant message id, in order of first appearance. A message is stored as one record
    per content block; the last record of an id carries the final usage. Synthetic messages are skipped."""
    first_seen: dict[str, tuple[datetime | None, str]] = {}
    last_usage: dict[str, Record] = {}
    for record in records:
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
        last_usage[message_id] = usage
    return [usage_of(message_id, timestamp, model, last_usage[message_id])
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
                calls[tool_use_id] = ToolCall(tool_use_id, display_name(name))
    return list(calls.values())


def tool_results(records: Iterable[Record]) -> list[ToolResult]:
    """The tool_result blocks of user records, with their size; the last one per id counts."""
    results: dict[str, ToolResult] = {}
    for record in records:
        if record.get("type") != "user":
            continue
        for block in content_blocks(record):
            tool_use_id = text_or_none(block.get("tool_use_id"))
            if block.get("type") == "tool_result" and tool_use_id:
                results[tool_use_id] = ToolResult(tool_use_id, result_chars(block.get("content")))
    return list(results.values())


def cost_usd(value: Any) -> float:
    """A dollar amount; missing or non-numeric values count as 0."""
    if isinstance(value, (int, float)) and not isinstance(value, bool):
        return float(value)
    return 0.0


def cost_state_of(record: Record, snapshot_ts: datetime | None) -> CostState:
    """A CostState from a cost-state record; models are merged by their id without a [1m]-style suffix."""
    totals: dict[str, list[float]] = {}
    model_usage = record.get("modelUsage")
    for model, values in (model_usage.items() if isinstance(model_usage, dict) else []):
        if not isinstance(values, dict) or not isinstance(model, str):
            continue
        sums = totals.setdefault(CONTEXT_SUFFIX.sub("", model), [0, 0, 0, 0, 0.0])
        sums[0] += count(values.get("inputTokens"))
        sums[1] += count(values.get("cacheCreationInputTokens"))
        sums[2] += count(values.get("cacheReadInputTokens"))
        sums[3] += count(values.get("outputTokens"))
        sums[4] += cost_usd(values.get("costUSD"))
    models = tuple(ModelTotals(model, int(sums[0]), int(sums[1]), int(sums[2]), int(sums[3]), sums[4])
                   for model, sums in totals.items())
    return CostState(snapshot_ts, models)


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


def parse(path: Path, offset: int = 0) -> Chunk:
    """The Chunk of a transcript from offset up to its last complete line."""
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

    return Chunk(path=path, start_offset=offset, end_offset=end_offset, slug=project_slug(path),
                 session_id=session_id, agent_id=agent_id, agent_type=agent_type, description=description,
                 cwd=cwd, git_branch=git_branch, title=title,
                 messages=tuple(message_usages(records)),
                 tool_calls=tuple(tool_calls(records)),
                 tool_results=tuple(tool_results(records)),
                 first_ts=min(timestamps, default=None), last_ts=max(timestamps, default=None),
                 cost_state=cost_state)


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
