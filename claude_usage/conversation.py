"""The conversation of one transcript, for the session view: read from the file on demand, never stored."""
import json
from dataclasses import dataclass
from dataclasses import replace
from datetime import datetime
from pathlib import Path
from typing import Any

from claude_usage import transcripts

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
    usage: transcripts.MessageUsage | None = None   # on the last entry of an API call: its final token usage


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


def tool_fields(tool_input: Any) -> tuple[ToolField, ...]:
    """A call's input field by field; an input that isn't an object is one JSON field named input."""
    fields = tool_input.items() if isinstance(tool_input, dict) else [("input", tool_input)]
    result = []
    for name, value in fields:
        is_json = not isinstance(value, str)
        text = json.dumps(value, indent=2, ensure_ascii=False) if is_json else value
        result.append(ToolField(str(name), cut(text, CHAT_TOOL_LIMIT), len(text), is_json))
    return tuple(result)


def reply_entries(record: transcripts.Record, calls: dict[str, int], entries: list[ChatEntry],
                  accumulator: transcripts.MessageAccumulator, last_entries: dict[str, int]) -> None:
    """Append an assistant record's blocks to entries and take its usage in; calls maps each tool_use id to its
    entry's index, last_entries each message id to the index of its last entry."""
    message = transcripts.message_of(record) or {}
    timestamp = transcripts.parse_timestamp(record.get("timestamp"))
    model = transcripts.text_or_none(message.get("model"))
    effort = transcripts.text_or_none(record.get("effort"))
    start = len(entries)
    for block in transcripts.content_blocks(record):
        kind = block.get("type")
        if kind == "text" and transcripts.text_or_none(block.get("text")):
            entries.append(ChatEntry("text", timestamp, cut(block["text"], CHAT_TEXT_LIMIT), model=model,
                                     effort=effort))
        elif kind == "thinking" and transcripts.text_or_none(block.get("thinking")):
            entries.append(ChatEntry("thinking", timestamp, cut(block["thinking"], CHAT_TEXT_LIMIT), model=model,
                                     effort=effort))
        elif (kind == "tool_use" and transcripts.text_or_none(block.get("id"))
              and transcripts.text_or_none(block.get("name"))):
            calls[block["id"]] = len(entries)
            entries.append(ChatEntry("tool", timestamp, model=model, tool=transcripts.display_name(block["name"]),
                                     summary=call_summary(block.get("input")),
                                     tool_fields=tool_fields(block.get("input")),
                                     effort=effort))
    if model is None:
        return
    message_id = accumulator.add(record)
    if message_id is not None and len(entries) > start:
        last_entries[message_id] = len(entries) - 1


def add_usage(entries: list[ChatEntry], accumulator: transcripts.MessageAccumulator,
              last_entries: dict[str, int]) -> None:
    """Put each API call's final usage on its last entry (a call without a shown entry has nowhere to go)."""
    for message_id, index in last_entries.items():
        entries[index] = replace(entries[index], usage=accumulator.usage(message_id))


def add_results(record: transcripts.Record, calls: dict[str, int], entries: list[ChatEntry]) -> None:
    """Put a user record's tool results into the entries of their calls (a result without a call is dropped)."""
    for block in transcripts.content_blocks(record):
        index = calls.get(transcripts.text_or_none(block.get("tool_use_id")) or "")
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
    accumulator = transcripts.MessageAccumulator()
    last_entries: dict[str, int] = {}
    for record in transcripts.iter_lines(path):
        kind = record.get("type")
        timestamp = transcripts.parse_timestamp(record.get("timestamp"))
        if kind == "system" and record.get("subtype") == "compact_boundary":
            entries.append(ChatEntry("compaction", timestamp, "Conversation compacted"))
        elif kind == "assistant" and record.get("isApiErrorMessage") is True:
            status = record.get("apiErrorStatus")
            error = transcripts.text_or_none(record.get("error")) or "unknown"
            entries.append(ChatEntry("error", timestamp, f"{error} ({status})" if isinstance(status, int) else error))
        elif kind == "assistant":
            reply_entries(record, calls, entries, accumulator, last_entries)
        elif kind == "user" and not record.get("sourceToolUseID"):
            add_results(record, calls, entries)
            text = transcripts.prompt_text(record)
            if text and text.strip():
                entries.append(ChatEntry("prompt", timestamp, cut(text, CHAT_TEXT_LIMIT)))
    add_usage(entries, accumulator, last_entries)
    return entries
