"""Test support: a throwaway projects folder laid out like ~/.claude/projects under tests/.tmp/, and a builder that
appends transcript records the way Claude Code writes them. Tests never read real transcripts."""
import json
import re
import shutil
import tempfile
import unittest
from datetime import UTC
from datetime import datetime
from datetime import timedelta
from pathlib import Path

TESTS_DIR = Path(__file__).resolve().parent
TMP_DIR = TESTS_DIR / ".tmp"
START = datetime(2026, 9, 1, 12, 0, tzinfo=UTC)
DEFAULT_MODEL = "claude-sonnet-5"
DEFAULT_PROJECT = "/home/dev/app"


def slug(project_path):
    """The folder name Claude Code uses for a project: every non-alphanumeric character replaced by "-"."""
    return re.sub(r"[^A-Za-z0-9]", "-", project_path)


def usage(new=0, cache_5m=0, cache_1h=0, cache_read=0, output=0, speed="standard", thinking=None, split=True):
    """A message.usage block. split=False leaves out the cache_creation split and speed=None the speed, as older
    transcripts do."""
    block = {
        "input_tokens": new,
        "cache_creation_input_tokens": cache_5m + cache_1h,
        "cache_read_input_tokens": cache_read,
        "output_tokens": output,
    }
    if speed is not None:
        block["speed"] = speed
    if split:
        block["cache_creation"] = {"ephemeral_5m_input_tokens": cache_5m, "ephemeral_1h_input_tokens": cache_1h}
    if thinking is not None:
        block["output_tokens_details"] = {"thinking_tokens": thinking}
    return block


def text_block(text):
    """An assistant text content block."""
    return {"type": "text", "text": text}


def thinking_block(text="…"):
    """An assistant thinking content block."""
    return {"type": "thinking", "thinking": text}


def tool_use_block(tool_use_id, name, tool_input=None):
    """An assistant tool_use content block."""
    return {"type": "tool_use", "id": tool_use_id, "name": name, "input": tool_input or {}}


class Transcript:
    """Appends records to one transcript file, one JSON object per line, with the common fields Claude Code sets
    (plus agentId and isSidechain in a subagent's file). The clock starts at START and moves one second per
    timestamped record."""

    def __init__(self, path, session_id, cwd=DEFAULT_PROJECT, git_branch="main", version="2.1.0", agent_id=None):
        self.path = path
        self.session_id = session_id
        self.agent_id = agent_id
        self.cwd = cwd
        self.git_branch = git_branch
        self.version = version
        self.clock = START
        path.parent.mkdir(parents=True, exist_ok=True)
        path.touch()

    def at(self, when):
        """Set the clock for the next records; returns self for chaining."""
        self.clock = when
        return self

    def timestamp(self):
        """The current clock as Claude Code writes it (ISO UTC with milliseconds), then advance it."""
        stamp = f"{self.clock:%Y-%m-%dT%H:%M:%S}.000Z"
        self.clock += timedelta(seconds=1)
        return stamp

    def write_text(self, text):
        """Append raw text to the file, exactly as given."""
        with self.path.open("a", encoding="utf-8") as handle:
            handle.write(text)

    def raw(self, line):
        """Append one raw line (e.g. broken JSON or a non-object)."""
        self.write_text(f"{line}\n")

    def partial(self, text):
        """Append text without a newline: a line Claude Code is still writing."""
        self.write_text(text)

    def record(self, record_type, **fields):
        """Append a conversation record of the given type with the common fields; returns it."""
        record = {"type": record_type, "timestamp": self.timestamp(), "sessionId": self.session_id,
                  "cwd": self.cwd, "gitBranch": self.git_branch, "version": self.version}
        if self.agent_id is not None:
            record.update(agentId=self.agent_id, isSidechain=True)
        record.update(fields)
        return self.bare(record)

    def bare(self, record):
        """Append a record exactly as given (no common fields); returns it."""
        self.raw(json.dumps(record, ensure_ascii=False))
        return record

    def user(self, text, as_blocks=False, **fields):
        """A user prompt, its content a string or (as_blocks) one text block; fields adds e.g. isMeta=True."""
        content = [text_block(text)] if as_blocks else text
        return self.record("user", message={"role": "user", "content": content}, **fields)

    def ai_title(self, title):
        """An ai-title record: only type, aiTitle and sessionId, no timestamp."""
        return self.bare({"type": "ai-title", "aiTitle": title, "sessionId": self.session_id})

    def queue_operation(self, operation="enqueue"):
        """A queue-operation record: timestamp and sessionId, but no cwd (main transcripts often start with one)."""
        return self.bare({"type": "queue-operation", "operation": operation, "timestamp": self.timestamp(),
                          "sessionId": self.session_id})

    def tool_result(self, tool_use_id, content):
        """A user record carrying a tool result; content is a string or a list of text blocks."""
        block = {"type": "tool_result", "tool_use_id": tool_use_id, "content": content}
        return self.record("user", message={"role": "user", "content": [block]})

    def assistant(self, message_id, blocks, final_usage, model=DEFAULT_MODEL):
        """An assistant message, stored as one record per content block with the same message id. Only the last
        record carries final_usage; the earlier ones carry the usage seen while streaming (output_tokens 1), so a
        parser that doesn't keep the last usage per id gets the output wrong."""
        records = []
        for index, block in enumerate(blocks):
            is_last = index == len(blocks) - 1
            block_usage = final_usage if is_last else dict(final_usage, output_tokens=1)
            message = {"id": message_id, "type": "message", "role": "assistant", "model": model,
                       "content": [block], "usage": block_usage}
            records.append(self.record("assistant", message=message))
        return records


class ProjectsDir:
    """A throwaway projects folder laid out like ~/.claude/projects/<slug>/."""

    def __init__(self, root):
        self.root = root
        root.mkdir(parents=True, exist_ok=True)

    def project_dir(self, project=DEFAULT_PROJECT):
        """The <slug>/ folder of a project path."""
        return self.root / slug(project)

    def session(self, session_id, project=DEFAULT_PROJECT, **options):
        """The main transcript <slug>/<session-id>.jsonl."""
        path = self.project_dir(project) / f"{session_id}.jsonl"
        return Transcript(path, session_id, cwd=project, **options)

    def subagent(self, session_id, agent_id, project=DEFAULT_PROJECT, meta=None, **options):
        """A subagent transcript <slug>/<session-id>/subagents/agent-<id>.jsonl. meta is written to the
        agent-<id>.meta.json next to it (without model, as often in real data); meta=False writes none (the type
        is then "?")."""
        folder = self.project_dir(project) / session_id / "subagents"
        transcript = Transcript(folder / f"agent-{agent_id}.jsonl", session_id, cwd=project, agent_id=agent_id,
                                **options)
        if meta is not False:
            meta_values = {"agentType": "general-purpose", "description": "a subagent",
                           "toolUseId": f"toolu_{agent_id}", "spawnDepth": 1}
            meta_values.update(meta or {})
            meta_path = folder / f"agent-{agent_id}.meta.json"
            meta_path.write_text(json.dumps(meta_values), encoding="utf-8")
        return transcript

    def tool_results_file(self, session_id, name, text="output", project=DEFAULT_PROJECT):
        """A file in <slug>/<session-id>/tool-results/, which the parser must ignore."""
        path = self.project_dir(project) / session_id / "tool-results" / name
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(text, encoding="utf-8")
        return path


class TempDirTestCase(unittest.TestCase):
    """Gives each test self.tmp (a fresh folder under tests/.tmp/), self.projects in it and self.store_path."""

    def setUp(self):
        TMP_DIR.mkdir(exist_ok=True)
        self.tmp = Path(tempfile.mkdtemp(dir=TMP_DIR))
        self.addCleanup(shutil.rmtree, self.tmp)
        self.projects = ProjectsDir(self.tmp / "projects")
        self.store_path = self.tmp / "usage.sqlite"
