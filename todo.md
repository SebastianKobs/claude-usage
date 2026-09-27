# claude-usage: local dashboard for Claude Code token usage

Standalone project, built from an empty folder. Stdlib only (Python ≥ 3.12: `sqlite3`, `http.server`, `json`,
`tomllib`, `argparse`, `unittest`), no dependencies to install. This file is the project's `todo.md`: tick off the
TDD steps as they're done.

## Context
Claude Code writes a transcript of every session and subagent under `~/.claude/projects/`, including the token
usage of each model call. No local tool shows that usage across sessions and projects. Claude Code also deletes
transcripts after its cleanup period (30 days by default), so the history is lost.

Goal: a small local tool that, for **all projects on this machine**:
- keeps a **persistent history** in SQLite that outlives the transcripts
- serves a **local dashboard** (127.0.0.1 only) with these views:
  - **live sessions:** sessions and subagents active now
  - **totals:** by day, model, agent type and project
  - **per-session drilldown:** main thread plus each subagent
  - **estimated cost** from a price table

Origin: the `agent_usage.py` tool of the evopage8 agent toolkit (subagents of one session only). Its parsing rules
are written out below, so this project doesn't depend on it.

## Transcript format (what the parser must handle)
- **Layout under `~/.claude/projects/<slug>/`,** where `<slug>` is the project path with every non-alphanumeric
  character replaced by `-`:
  - `<session-id>.jsonl`: the main session
  - `<session-id>/subagents/agent-<id>.jsonl` + `agent-<id>.meta.json`: subagents.
    - The meta file holds `agentType`, `description`, `toolUseId` (the parent's Agent call), `spawnDepth` and, when
      nested, `parentAgentId`.
    - `model` is often missing (38 of 111 files), so take the model from the messages.
    - The meta file may be missing, in which case the type is `?`.
  - `<session-id>/tool-results/`, `memory/` and anything else that isn't a transcript: ignore.
  - Checked against the real data (2026-09-27, 34 main and 111 subagent transcripts).
- **Records:** one JSON object per line; skip unreadable lines (the real data has one) and non-objects.
  - Types: `assistant`, `user`, `attachment`, `ai-title`, `last-prompt`, `atis-latch`, `queue-operation`, `mode`,
    `file-history-*`, `cost-state`, `system`.
  - Conversation records (`assistant`, `user`, `attachment`, `system`) carry `timestamp` (ISO UTC,
    `2026-09-01T12:00:00.000Z`), `sessionId`, `cwd`, `gitBranch` and `version`. The others carry only some of these:
    `ai-title` has no timestamp, so `first_ts`/`last_ts` come from records that have one.
  - Records of a subagent carry `agentId` (the id in the file name), `isSidechain: true` and the parent's
    `sessionId`.
- **Assistant messages:**
  - A message is stored as **one record per content block**, all with the same `message.id`. The **last**
    record of an id carries the final `message.usage`, so keep the last usage per id.
    - Real data: exactly one block per record, and 1 to 6+ records per id.
    - The last record's output was never below an earlier one's.
  - Skip `message.model == "<synthetic>"`. Those records are API errors, with `null` in the usage fields.
- **The `message.usage` block:**
  - `input_tokens` (new input), `cache_creation_input_tokens`, `cache_read_input_tokens`, `output_tokens`
  - `cache_creation.ephemeral_5m_input_tokens` / `ephemeral_1h_input_tokens`: the split of cache writes, with
    different prices. If it's missing, count all cache writes as 5m.
  - `speed`: `standard`, or missing in older transcripts (treat that as standard).
    - Fast mode hasn't been seen in the real data yet, so count any other value as fast.
  - `output_tokens_details.thinking_tokens`
  - Any counter may be missing or `null`; treat it as 0.
  - Ignore these, because the real data shows nothing to add:
    - `iterations`: always one entry, equal to the top-level counters.
    - `server_tool_use` (`web_search_requests`, `web_fetch_requests`): always 0.
    - `service_tier` and `inference_geo`.
- **Context per turn** = `input_tokens + cache_creation_input_tokens + cache_read_input_tokens`. The input total
  of an agent is the sum over its turns, because every turn re-sends the context.
- **Tool calls:** `tool_use` blocks in assistant content (`id`, `name`). The results are `tool_result` blocks in
  `user` records (`tool_use_id`, `content` as a string or a list of blocks).
  - Count calls and result characters per tool. For characters, count only the `text` blocks of a list and skip
    `image` and `tool_reference`.
  - Show `mcp__<server>__<tool>` as `<server>.<tool>`.
- **Session title:** `aiTitle` of the last `ai-title` record.
- **Prompt:** the first line of the first `user` record that isn't `isMeta`, `isCompactSummary` or a tool result.
  Its content is a string or text blocks. Use it only for the drilldown; **never store prompt text**. The same goes
  for `last-prompt.lastPrompt` and `queue-operation.content`: never store them.
- **Project label:** the `cwd` of the first record that has one, falling back to the slug. Many main transcripts
  start with a `queue-operation` or `mode` record that has no `cwd`.
- **Not in the transcripts:** Claude Code's background calls, such as Haiku for titles and classifiers.
  - They only appear in `cost-state` records (`modelUsage` per model with tokens and `costUSD`, `totalCostUSD`).
  - Model ids there carry a `[1m]` suffix for the 1M context variant; the assistant records don't.
  - Possible later addition: show them as "background" usage per session, and use `costUSD` to cross-check
    `pricing.py`.

## Layout
```
claude-usage/
  todo.md  README.md  CLAUDE.md  pyproject.toml  .gitignore
  config.toml                    # defaults incl. prices; config.local.toml overrides (gitignored)
  claude_usage/
    __init__.py  __main__.py     # CLI: scan | report | serve
    config.py                    # load config.toml + config.local.toml (tomllib, deep merge)
    transcripts.py               # parser
    store.py                     # SQLite history + queries
    pricing.py                   # cost per message
    server.py                    # http.server + JSON API
    static/dashboard.html        # single self-contained page
  tests/
    helpers.py                   # Transcript builder, temp projects dir, temp store
    test_transcripts.py  test_config.py  test_store.py  test_pricing.py  test_server.py
```
- `.gitignore`: `data/`, `__pycache__/`, `config.local.toml`, `tests/.tmp/`.
- `pyproject.toml`: name, `requires-python = ">=3.12"`, no dependencies, and the script entry point
  `claude-usage = "claude_usage.__main__:main"`. It must also run as `python3 -m claude_usage` without installing.
- `CLAUDE.md`: short working rules: TDD, the style below, tests via
  `python3 -m unittest discover -s tests`, and "never read real transcripts in tests".

## Modules
### `transcripts.py`
- **Incremental reading:** the parser reads a transcript from a byte offset, so a growing file (a live session) is
  never re-read from the start. It returns what it found in the new part plus the new offset. The store merges
  that into what it already has.
  - It consumes complete lines only. A trailing line without `\n` is still being written: leave it and its bytes
    for the next scan.
  - Read in binary and decode per line (`utf-8`, errors replaced), so offsets are exact byte positions.
- **Records:**
  - `MessageUsage` (frozen): `message_id`, `timestamp`, `model`, `speed`, `new_input`, `cache_write_5m`,
    `cache_write_1h`, `cache_read`, `output`
  - `ToolCall` (frozen): `tool_use_id`, `tool` (display name). `ToolResult` (frozen): `tool_use_id`, `chars`.
    They are kept apart because a result can arrive in a later read than its call.
  - `Chunk` (frozen): what one read of a transcript file found.
    - Fields: `path`, `start_offset`, `end_offset`, `slug`, `session_id`, `agent_id` (None = main), `agent_type` (`main`
      for the main thread), `description`, `cwd`, `git_branch`, `title`, `messages`, `tool_calls`, `tool_results`,
      `first_ts`, `last_ts`.
    - Fields not seen in this part are None. `title` is the last `ai-title` of the part, and `cwd` the first seen.
- **Functions:**
  - `read_lines(path, offset=0) -> tuple[list[dict], int]`: records from `offset` up to the last complete line,
    and the offset after it.
  - `message_usages(records)`, `tool_calls(records)`, `tool_results(records)`
  - `parse(path, offset=0) -> Chunk`, with the agent meta read from `agent-<id>.meta.json`. Session, agent and
    slug come from the path.
  - `first_prompt(path)`: the prompt for the drilldown. It reads the file on demand and returns None once the file
    is gone. The prompt is never stored.
  - `find_transcripts(projects_dir) -> list[Path]`: main and subagent files
  - `project_slug(path)`, `display_name(tool)`
- **Derived per agent** (in the store queries, from the `messages` rows): turns, context first → last, input
  total. This gives the numbers of the per-agent report.

### `store.py`: SQLite, default path `data/usage.sqlite` (config `store`)
- **Tables:**
  - `transcripts(path PK, project, session_id, agent_id, agent_type, description, title, git_branch, size, mtime, offset, head_hash, first_ts, last_ts)`
    - `offset`: bytes read so far
    - `head_hash`: SHA-256 of the first line, to notice a file that was rewritten rather than appended to
  - `messages(message_id PK, path, project, session_id, agent_id, agent_type, model, speed, ts, day, new_input, cache_write_5m, cache_write_1h, cache_read, output)`
    - `day` = local date of `ts`
  - `tool_calls(tool_use_id PK, path, session_id, agent_id, tool, result_chars)`: one row per call, summed per tool
    in the queries
  - `meta(schema_version)`: migrations only add. Never drop tables or rows on a version change, since the history
    can't be rebuilt once the transcripts are gone.
- **`scan(store, projects_dir, project_filter=None) -> ScanResult`** (files scanned, skipped, messages upserted,
  bytes read):
  - **Unchanged file:** skip it when `(size, mtime)` is unchanged.
  - **Grown file:** read from the stored `offset` and merge the new part into the existing rows:
    - Upsert messages by `message_id`. The file that stored an id first owns it:
      - Later reads of that file update its counters, so the last usage per id still wins across reads.
      - Copies of the id in other files (forked or resumed sessions) change nothing. Otherwise old turns would move
        to the copy's session, or be counted twice.
    - Insert tool calls by `tool_use_id`, ignoring ids already stored.
    - Set `result_chars` on the call's row, by id; a result without a known call is dropped.
    - Transcript row: `title` and `git_branch` take the newest value seen. `project` (from the first `cwd`) and
      `first_ts` keep their first value. `last_ts`, `size`, `mtime` and `offset` move on.
  - **Truncated or rewritten file** (size below `offset`, or a different `head_hash`): read it again from 0. The
    upserts keep this idempotent.
  - **Per file, one transaction:** all rows and the new offset commit together, so an interrupted scan resumes at the
    last committed offset.
  - **Deleted transcripts:** never delete their rows; that's the history.
- **Queries**, pure functions returning JSON-ready dicts:
  - `totals_by(store, group, since, prices)` with group in `day | model | agent_type | project | day_model`:
    tokens split into new, cache write and cache read, plus output, turns and cost.
  - `live_sessions(store, projects_dir, minutes)`: sessions whose transcripts changed within `minutes` (by file
    mtime, after a scan). Each entry has project, title, branch, tokens so far, last context and output, and the
    subagents active within the window with their type and model.
  - `session_detail(store, session_id, prices)`: the main thread plus each subagent, with turns, context first →
    last, input split, output, tools and cost. Returns None for an unknown id.

### `pricing.py`
- **Config:** `[prices."<model-prefix>"]` with `input`, `cache_write_5m`, `cache_write_1h`, `cache_read` and
  `output` in $/MTok, plus an optional `fast_multiplier`. The top-level `prices_checked = 2026-09-27` is a TOML
  date and must sit before the first table.
- **Lookup:** by longest prefix match on the model id; a `[1m]`-style suffix is ignored. An unknown model gets
  `cost = None`, and the page shows "–".
  - Dated-only models get a prefix like `claude-opus-4-20`, so it can't catch unknown 4.x ids.
- **Fast mode:** any speed other than `standard`. The multiplier (2x on Opus 5.5, Opus 5 and Opus 4.8) applies to
  every category, cache included. Without one, a fast request costs standard rates (Opus 4.6 does that).
- **Not modelled:**
  - the 1.1x for US-only inference: `usage.inference_geo` is always `not_available` in the real data
  - long-context surcharges: there are none on 4.6 and later models
  - the Batch discount and web search fees
- **Prices:** from the official pricing page (checked 2026-09-27 via the `claude-api` skill and
  platform.claude.com/docs/en/about-claude/pricing), not from memory.
- **Cross-check against real data:** in 29 sessions with a `cost-state` record, our cost equals Claude Code's own
  `costUSD` to the cent for most sessions (Opus 5.5, Opus 5, Opus 4.8, Sonnet 5). The deviations:
  - We are higher where the last `cost-state` snapshot is older than the transcript.
  - Sonnet is sometimes 5–12% lower: background calls that aren't in the transcripts.
  - Haiku background calls are missing entirely ($1.40 over all sessions).

### `server.py` + `static/dashboard.html`
- **Server:** `ThreadingHTTPServer` on `127.0.0.1` only (refuse other hosts). Command:
  `serve [--port 8765] [--live-minutes 5] [--project PATH]`.
- **Endpoints:**
  - `/` serves `dashboard.html`.
  - `/api/live`
  - `/api/summary?days=30` returns `day_model`, `agent_type`, `project` and `model` totals.
  - `/api/session/<id>`: 404 for an unknown id.
  - Unknown paths get 404, and errors come back as JSON `{"error": …}`.
- **Scanning:** each API request runs an incremental scan behind a lock, at most every 5 s.
- **Page:**
  - One HTML file, with vanilla JS and inline-SVG charts, no CDN (works offline).
  - Color tokens for light and dark theme.
  - Updates: it polls `/api/live` every 5 s and the summary every 60 s.
  - Views: live cards; a stacked bar chart per day by model; tables by agent type (main vs subagents), project and model; a session list that links to the drilldown.
  - Load the `dataviz` skill before writing the chart code.

### `__main__.py` (CLI, argparse, `main(argv=None) -> int`)
- `scan [--project PATH]`: one incremental scan, prints the `ScanResult`. Useful from cron, to keep history
  without the server running.
- `report [--days N] [--by day|model|agent_type|project] [--session ID] [--json]`: text or JSON report.
- `serve …`: as above.
- **Global options:** `--projects-dir` (default `~/.claude/projects`) and `--store`, both overriding the config.
  Tests pass temp paths.

## Style (from the evopage8 toolkit, which this project comes from)
- **Layout:** PEP 8, max 120 columns, one import per line (stdlib, then local).
- **Naming:** descriptive names, no one-letter names except loop indices.
- **Statements and expressions:**
  - no one-line compound statements, no `;`, no assigned lambdas, no backslash continuations
  - f-strings only; regex flags spelled out
- **Types and records:** type hints, `@dataclass(frozen=True)` for records.
- **Errors:** library functions raise; only `main()` prints errors and picks the exit code.
- **Files and docs:** `pathlib.Path` with `encoding="utf-8"`; a docstring on every function and class; comments
  explain why.
- **Tests:** stdlib `unittest`, one behaviour per test method, no type hints. Temp dirs go under `tests/.tmp/`,
  never real `~/.claude`.

## TDD order
Write the test first, then the implementation, for each step:
1. ✅ **`test_config.py`:** defaults, local override deep-merged, broken TOML raises with the file name.
2. ✅ **`test_transcripts.py`**, with `helpers.Transcript` building records one per content block:
   - last usage per message id; `<synthetic>` skipped
   - 5m/1h split, and the fallback when `cache_creation` is missing
   - null counters count as 0
   - tool calls and result characters; mcp name shortening
   - meta missing → `?`
   - main vs subagent detection
   - title and prompt; project label from `cwd`
   - reading from an offset: only the appended records, and the returned offset is the file's byte length
   - a trailing line without `\n` is left for the next read; the offset stops before it
   - multi-byte UTF-8 and an unreadable line in the middle don't shift the offsets
   - a tool result in a later read than its call is still returned (as a `ToolResult`)
3. ✅ **`test_pricing.py`:** prefix match, unknown model → None, the fast multiplier, the 1h cache-write price.
4. **`test_store.py`:**
   - first scan fills the tables
   - unchanged file skipped
   - a grown file is read from its offset only: `bytes read` equals the appended bytes
   - reading a file in pieces gives the same rows as one full read, including:
     - a message whose content blocks span two reads (the last usage wins)
     - a tool result whose call came in an earlier read
     - a title set in a later read
   - a half-written last line is picked up on the next scan, once complete
   - a truncated or rewritten file (new `head_hash`) is read again from 0 without duplicates
   - an interrupted scan (exception inside a file's transaction) leaves that file's rows and offset as before
   - a forked copy doesn't double count, and doesn't take over the original's messages
   - rows stay after a transcript is deleted
   - `totals_by` for each group; the `since` filter
   - `live_sessions` by mtime, set with `os.utime`
   - `session_detail` for a known and an unknown id
   - project filter
5. **`test_server.py`:**
   - a server on port 0 in a thread; `/`, `/api/live`, `/api/summary` and `/api/session/<id>` return JSON of the right shape
   - 404s for unknown paths and ids
   - binding to a non-loopback host is refused
6. **CLI tests:** `scan`, `report --json` and `--help` exit 0; an unknown option exits 2.

## Verification
- `python3 -m unittest discover -s tests` passes.
- `python3 -m claude_usage scan` against the real `~/.claude/projects`, run by you, not by an agent in tests:
  - the counts look plausible
  - a second run reports all files skipped
  - during a live session, a scan reads only the bytes added since the last one
- For one evopage8 session, `python3 -m claude_usage report --session <id> --json` agrees with
  `python3 .claude/tools/agent_usage.py --session <id> --json` (run in evopage8) for the subagents.
- `python3 -m claude_usage serve`, then open `http://127.0.0.1:8765`:
  - the current session shows as live, and a running subagent appears within 5 s
  - daily and model charts render in light and dark
  - the drilldown of a doc-run session matches the report
- Optional: a cron entry `*/30 * * * * cd <folder> && python3 -m claude_usage scan` keeps the history even when the dashboard isn't running.

## Note for the implementing session
The tool reads `~/.claude/projects/`, which is outside the new project folder; that is its purpose. The session
itself should only read real transcripts when you ask it to, and only for the verification steps.
