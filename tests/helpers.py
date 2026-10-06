"""Test support: a throwaway projects folder laid out like ~/.claude/projects under tests/.tmp/, and a builder that
appends transcript records the way Claude Code writes them, and StoreCase with a store over that folder. Tests never
read real transcripts."""
import json
import re
import shutil
import tempfile
import unittest
import uuid
from datetime import UTC
from datetime import datetime
from datetime import timedelta
from pathlib import Path

from claude_usage import pricing
from claude_usage import scan
from claude_usage import store

TESTS_DIR = Path(__file__).resolve().parent
TMP_DIR = TESTS_DIR / ".tmp"
PAGE_SOURCES = TESTS_DIR.parent / "web" / "src"        # the page's modules and components, a folder per section
START = datetime(2026, 9, 1, 12, 0, tzinfo=UTC)
DEFAULT_MODEL = "claude-sonnet-5"
DEFAULT_PROJECT = "/home/dev/app"


def page_file(name):
    """A file of the page's sources by its name, in whichever section's folder it is (the names are unique)."""
    found = sorted(PAGE_SOURCES.rglob(name))
    if len(found) != 1:
        raise FileNotFoundError(f"{len(found)} files named {name} under {PAGE_SOURCES}")
    return found[0]


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


def edit_result(*hunks):
    """The toolUseResult of an Edit: each hunk a list of lines prefixed with "+", "-" or " "."""
    return {"filePath": "/home/dev/app/x.py", "oldString": "old", "newString": "new", "userModified": False,
            "structuredPatch": [{"oldStart": 1, "oldLines": 1, "newStart": 1, "newLines": 1, "lines": list(lines)}
                                for lines in hunks]}


def create_result(content):
    """The toolUseResult of a Write that created a file with this content."""
    return {"type": "create", "filePath": "/home/dev/app/new.py", "content": content, "structuredPatch": []}


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

    def cost_state(self, model_usage, start=START, **run_totals):
        """A cost-state record as Claude Code writes it when a process ends: no timestamp, the totals since the
        process started (start) per model. model_usage maps a model id to
        (input, cache_write, cache_read, output, cost_usd[, web_searches]); run_totals adds fields such as
        totalDuration=60000 or totalLinesAdded=12."""
        usage_by_model = {}
        for model, values in model_usage.items():
            new_input, cache_write, cache_read, output, cost = values[:5]
            web_searches = values[5] if len(values) > 5 else 0
            usage_by_model[model] = {"inputTokens": new_input, "outputTokens": output, "thinkingTokens": 0,
                                     "cacheReadInputTokens": cache_read, "cacheCreationInputTokens": cache_write,
                                     "webSearchRequests": web_searches, "costUSD": cost}
        return self.bare({"type": "cost-state", "sessionId": self.session_id,
                          "totalCostUSD": sum(values["costUSD"] for values in usage_by_model.values()),
                          "startTime": int(start.timestamp() * 1000), "modelUsage": usage_by_model,
                          "hasUnknownModelCost": False, **run_totals})

    def queue_operation(self, operation="enqueue"):
        """A queue-operation record: timestamp and sessionId, but no cwd (main transcripts often start with one)."""
        return self.bare({"type": "queue-operation", "operation": operation, "timestamp": self.timestamp(),
                          "sessionId": self.session_id})

    def api_error(self, record_id, error="rate_limit", status=429, limit_type="five_hour", resets_at=None):
        """A failed API call as Claude Code records it: a <synthetic> assistant message with isApiErrorMessage,
        the error kind and HTTP status, and for a rate limit the quota that was hit (limit_type=None leaves
        quotaLimits out, as for a server error). resets_at is a datetime, written as epoch seconds."""
        fields = {"isApiErrorMessage": True, "error": error, "uuid": record_id}
        if status is not None:
            fields["apiErrorStatus"] = status
        if limit_type is not None:
            fields["quotaLimits"] = {"status": "rejected", "rateLimitType": limit_type,
                                     "resetsAt": int(resets_at.timestamp()) if resets_at else None,
                                     "isUsingOverage": False}
        message = {"id": f"msg_{record_id}", "type": "message", "role": "assistant", "model": "<synthetic>",
                   "content": [text_block("API Error")], "usage": usage()}
        return self.record("assistant", message=message, **fields)

    def compaction(self, record_id="c1", trigger="manual", pre_tokens=150_000, post_tokens=12_000, duration_ms=30_000):
        """A compact_boundary system record as Claude Code writes it, followed by nothing (the summary is a separate
        isCompactSummary user record). trigger=None leaves compactMetadata out."""
        fields = {"subtype": "compact_boundary", "content": "Conversation compacted", "level": "info",
                  "uuid": record_id}
        if trigger is not None:
            fields["compactMetadata"] = {"trigger": trigger, "preTokens": pre_tokens, "postTokens": post_tokens,
                                         "durationMs": duration_ms, "cumulativeDroppedTokens": 0}
        return self.record("system", **fields)

    def attachment(self, kind, rendered=None, **fields):
        """An attachment record: what Claude Code attaches to the next request. rendered is the text that reaches
        the model (a string, a list of strings for several parts, or None for a bookkeeping record)."""
        parts = [rendered] if isinstance(rendered, str) else rendered
        return self.record("attachment", attachment={"type": kind, **fields},
                           rendered=None if parts is None else [{"content": part} for part in parts],
                           uuid=f"att-{uuid.uuid4().hex}")

    def ultracode(self, record_id, reminder="full"):
        """Ultracode's attachment on a human prompt: switched on (reminder "full"), a reminder that it still is
        ("sparse"), or with reminder=None switched off (ultra_effort_exit)."""
        if reminder is None:
            attachment = {"type": "ultra_effort_exit"}
        else:
            attachment = {"type": "ultra_effort_enter", "reminderType": reminder}
        return self.record("attachment", attachment=attachment, rendered=[{"content": "ultracode"}], uuid=record_id)

    def tool_result(self, tool_use_id, content, is_error=None, **fields):
        """A user record carrying a tool result; content is a string or a list of text blocks. is_error True marks
        a failed call; fields adds e.g. toolUseResult (see edit_result and create_result)."""
        block = {"type": "tool_result", "tool_use_id": tool_use_id, "content": content}
        if is_error is not None:
            block["is_error"] = is_error
        return self.record("user", message={"role": "user", "content": [block]}, **fields)

    def assistant(self, message_id, blocks, final_usage, model=DEFAULT_MODEL, **fields):
        """An assistant message, stored as one record per content block with the same message id. Only the last
        record carries final_usage; the earlier ones carry the usage seen while streaming (output_tokens 1), so a
        parser that doesn't keep the last usage per id gets the output wrong. fields goes on every record, e.g.
        attributionSkill="dataviz"."""
        records = []
        for index, block in enumerate(blocks):
            is_last = index == len(blocks) - 1
            block_usage = final_usage if is_last else dict(final_usage, output_tokens=1)
            message = {"id": message_id, "type": "message", "role": "assistant", "model": model,
                       "content": [block], "usage": block_usage}
            records.append(self.record("assistant", message=message, **fields))
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

    def workflow_agent(self, session_id, run_id, agent_id, project=DEFAULT_PROJECT, meta=None, name=None, **options):
        """A workflow agent's transcript <slug>/<session-id>/subagents/workflows/<run>/agent-<id>.jsonl, with its
        meta file (a workflow-subagent in phase Review unless meta overrides it), the run's journal.jsonl (never
        read) and, with name, the run's <session-id>/workflows/<run>.json that names the workflow."""
        folder = self.project_dir(project) / session_id / "subagents" / "workflows" / run_id
        transcript = Transcript(folder / f"agent-{agent_id}.jsonl", session_id, cwd=project, agent_id=agent_id,
                                **options)
        meta_values = {"agentType": "workflow-subagent", "description": f"step {agent_id}", "spawnDepth": 1,
                       "requestNonInteractive": True, "workflowPhase": "Review"}
        meta_values.update(meta or {})
        (folder / f"agent-{agent_id}.meta.json").write_text(json.dumps(meta_values), encoding="utf-8")
        (folder / "journal.jsonl").write_text(json.dumps({"type": "launched"}) + "\n", encoding="utf-8")
        if name is not None:
            run_file = self.project_dir(project) / session_id / "workflows" / f"{run_id}.json"
            run_file.parent.mkdir(parents=True, exist_ok=True)
            run_file.write_text(json.dumps({"runId": run_id, "workflowName": name, "script": "SCRIPT-MARKER"}),
                                encoding="utf-8")
        return transcript

    def tool_results_file(self, session_id, name, text="output", project=DEFAULT_PROJECT):
        """A file in <slug>/<session-id>/tool-results/, which the parser must ignore."""
        path = self.project_dir(project) / session_id / "tool-results" / name
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(text, encoding="utf-8")
        return path


class FakeClock:
    """A monotonic clock the test moves by hand."""

    def __init__(self):
        self.now = 1000.0

    def __call__(self):
        return self.now


class TempDirTestCase(unittest.TestCase):
    """Gives each test self.tmp (a fresh folder under tests/.tmp/), self.projects in it and self.store_path."""

    def setUp(self):
        TMP_DIR.mkdir(exist_ok=True)
        self.tmp = Path(tempfile.mkdtemp(dir=TMP_DIR))
        self.addCleanup(shutil.rmtree, self.tmp)
        self.projects = ProjectsDir(self.tmp / "projects")
        self.store_path = self.tmp / "usage.sqlite"


# --- a store over the projects folder, for the store, scan and query tests -------------------------

PRICES = pricing.parse_prices({
    "claude-sonnet-5": {"input": 2.0, "cache_write_5m": 2.5, "cache_write_1h": 4.0, "cache_read": 0.2,
                        "output": 10.0},
    "claude-opus-5": {"input": 5.0, "cache_write_5m": 6.25, "cache_write_1h": 10.0, "cache_read": 0.5,
                      "output": 25.0, "fast_multiplier": 2.0},
    "claude-haiku-4-5": {"input": 1.0, "cache_write_5m": 1.25, "cache_write_1h": 2.0, "cache_read": 0.1,
                         "output": 5.0},
})
HAIKU = "claude-haiku-4-5-20251001"
MILLION = 1_000_000
DAY_1 = datetime(2026, 9, 1, 12, 0, tzinfo=UTC)
DAY_3 = datetime(2026, 9, 3, 12, 0, tzinfo=UTC)
DATE_AFTER = datetime(2026, 9, 4, 9, 0, tzinfo=UTC)


def local_day(moment):
    """The local date string the store files a UTC timestamp under."""
    return moment.astimezone().date().isoformat()


def local_hour(moment):
    """The local hour string the store groups a UTC timestamp under for hourly totals."""
    return moment.astimezone().strftime("%Y-%m-%dT%H")


class StoreCase(TempDirTestCase):
    """A temp projects folder and an open store on self.store_path."""

    def setUp(self):
        super().setUp()
        self.store = store.Store(self.store_path)
        self.addCleanup(self.store.close)

    def scan(self, project_filter=None):
        """One incremental scan of the temp projects folder."""
        return scan.scan(self.store, self.projects.root, project_filter)

    def rows(self, sql, *parameters):
        """All rows of a query as tuples."""
        return [tuple(row) for row in self.store.connection.execute(sql, parameters)]

    def count(self, table):
        """The number of rows in a table."""
        return self.rows(f"SELECT COUNT(*) FROM {table}")[0][0]

    def dump(self):
        """Every row of the data tables, for comparing two stores."""
        return {table: self.rows(f"SELECT * FROM {table} ORDER BY 1")
                for table in ("transcripts", "messages", "tool_calls")}


def build_session(projects, session_id="s1", project="/home/dev/app"):
    """A main transcript with two turns, a tool call and its result, a title, and one Explore subagent."""
    main = projects.session(session_id, project=project)
    main.user("Fix the parser")
    main.ai_title("Parser fix")
    main.assistant(f"{session_id}-m1", [thinking_block(), tool_use_block(f"{session_id}-t1", "Read")],
                   usage(new=10, cache_5m=1000, cache_read=0, output=50))
    main.tool_result(f"{session_id}-t1", "x" * 300)
    main.assistant(f"{session_id}-m2", [text_block("done")], usage(new=5, cache_5m=200, cache_read=1000, output=20))
    agent = projects.subagent(session_id, "a1", project=project, meta={"agentType": "Explore",
                                                                        "description": "look around"})
    agent.assistant(f"{session_id}-a1-m1", [tool_use_block(f"{session_id}-t2", "mcp__srv__find")],
                    usage(new=3, cache_1h=400, output=30), model="claude-opus-5")
    agent.tool_result(f"{session_id}-t2", [{"type": "text", "text": "abcd"}])
    return main, agent
