# claude-usage

Local dashboard and persistent SQLite history for Claude Code token usage, across all projects on this machine.
Claude Code deletes transcripts after its cleanup period (30 days by default); the store keeps what they held for
`retention_days` (7, 30, 90 or 365; 30 by default, 0 keeps everything).

## Working rules
- **TDD:** write the test first, then the implementation.
- **Stdlib only:** Python ≥ 3.12, no dependencies (`sqlite3`, `http.server`, `json`, `tomllib`, `argparse`,
  `unittest`).
- **Tests:** `make test` runs `python3 -m unittest discover -s tests`.
- **The guard** (`.claude/hooks/project-guard/`) is a git submodule of
  github.com/SebastianKobs/claude-project-guard. Clone with `--recurse-submodules`, or run
  `git submodule update --init`.
- **Never read real transcripts in tests.** Tests build their own under `tests/.tmp/` (see `tests/helpers.py`) and
  pass temp paths via `--projects-dir` and `--store`. Real `~/.claude/projects` is only read to verify a change
  against real data, and only when the user asks. Print counts and totals then, never prompt or message text.
- **Never store prompt text:** only token counts, tool names and sizes, titles and metadata. The drilldown reads the
  first prompt, and the conversation (`conversation.conversation`), from the transcript on demand.
  `last-prompt.lastPrompt` and `queue-operation.content` hold prompt text too; never store them either.
- **Keep the history:** rows go only by the configured retention (`scan.prune`, whole sessions whose last
  activity is older), never because a transcript is gone. A transcript row whose file still exists stays, since
  it holds the read offset.
  - Schema migrations only add: new tables, or `ALTER TABLE … ADD COLUMN` via `ADDED_COLUMNS`. They run under
    `BEGIN IMMEDIATE`; indexes come after the added columns.
  - A bump that needs data only a new read gives raises `REREAD_BELOW`: stores below it reset `read_offset` so
    the next scan reads every file again. The upserts make that idempotent.
- **Prices** come from the official pricing page (load the `claude-api` skill, or
  platform.claude.com/docs/en/about-claude/pricing), never from memory. Update `prices_checked` with them.

## Style
- **Layout:** PEP 8, max 120 columns, one import per line (stdlib, then local).
- **Naming:** descriptive names, no one-letter names except loop indices.
- **Statements and expressions:**
  - no one-line compound statements, no `;`, no assigned lambdas, no backslash continuations
  - f-strings only; regex flags spelled out
- **Types and records:** type hints, `@dataclass(frozen=True)` for records.
- **Errors:** library functions raise; only `main()` prints errors and picks the exit code (0 ok, 1 error without a
  traceback, 2 bad arguments, 130 interrupted).
- **Files and docs:** `pathlib.Path` with `encoding="utf-8"`; a docstring on every function and class; comments
  explain why.
- **Tests:** stdlib `unittest`, one behaviour per test method, no type hints. Temp dirs go under `tests/.tmp/`,
  never real `~/.claude`. Test classes, `setUp` and `__init__` need no docstring; shared base cases do.

## Layout
```
Makefile                     start/stop/status of the dashboard, scan, report, session, backup, test, clean,
                             cron-line
claude_usage/
  __main__.py                CLI: scan | report | serve | backup
  report.py                  the report as text (report without --json)
  config.py                  defaults in the package, user and checkout overrides, data folder
  config.toml                the defaults, including prices (shipped with the package)
  transcripts.py             parser: reads a transcript from a byte offset into a Chunk
  conversation.py            a transcript's conversation for the session view, read on demand
  tool_kinds.py              a transcript's tool calls by tool and Bash command kind, sizes and carried cost, read on
                             demand
  store.py                   the SQLite history: schema, migrations, backup
  scan.py                    incremental scan and background usage: transcripts into the store
  queries.py                 what the report and the dashboard read from the store
  pricing.py                 prices by model prefix, cost per category, web-search fee
  compact.py                 the conversation's compact hints and their settings
  turns.py                   growth per turn, cache rebuilds, the fixed overhead, the current-context gauge,
                             each compaction against keeping the context
  server.py                  loopback-only http.server + JSON API (a route table)
  static/                    the page: vanilla JS, inline SVG, no external resources (three vendored libraries)
    dashboard.html           the markup only
    css/common.css           layout and components, for every theme
    css/themes/              one file per theme (light, dark, hacker, startup, rgb); the gimmicks share dark's
                             palette, fun.css their other rules
    js/                      classic scripts sharing one scope, loaded in order: util, state, figures, chartkit,
                             charts, tables, limits, highlight.js, marked, DOMPurify, chat, drilldown, themes, main
                             (calls setup())
      vendor/                highlight.js 11.11.2 (common build, BSD-3), marked 18.0.14 (UMD, MIT), DOMPurify
                             3.4.16 (MPL-2.0 or Apache-2.0), each with its license
tests/                       helpers.py (projects-folder and transcript builders, StoreCase) and one test file per
                             module; test_static.py checks static/ without a browser
.claude/hooks/project-guard/  the guard hook: a git submodule, see its README and CLAUDE.md
```

## Transcript format
Checked against real data (145 transcripts, 2026-09-27); the parser relies on these facts.
- **Files:** `~/.claude/projects/<slug>/`, `<slug>` = the project path with every non-alphanumeric character
  replaced by `-`.
  - `<session-id>.jsonl` is the main thread.
  - `<session-id>/subagents/agent-<id>.jsonl` plus `agent-<id>.meta.json` is a subagent. The meta file holds
    `agentType`, `description`, `toolUseId` (the Agent tool call that spawned it; kept in
    `transcripts.tool_use_id`), `spawnDepth` and `parentAgentId`. It is often without `model`, and may be missing,
    in which case the type is `?`.
  - `<session-id>/subagents/workflows/<run>/agent-<id>.jsonl` plus its `.meta.json` is a Workflow run's agent
    (checked 2026-09-28, counts only: 39 agents in 3 runs). It has the same format as a subagent (the parent's
    `sessionId`). Its meta holds `agentType` ("workflow-subagent", or Explore/Plan when set), `description`,
    `workflowPhase` and `spawnDepth`, but no `toolUseId`. The run is the folder's name (`wf_…`), and its name is
    `workflowName` in `<session-id>/workflows/<run>.json`: only that key is read, since the file also holds the
    script and the agents' results. `journal.jsonl` and `workflows/scripts/` carry no usage and are not read. The
    session view groups a run's agents under one row.
  - `tool-results/`, `memory/` and anything else: ignore.
  - Paths sort a session's `subagents/` before its main file.
- **Records:** one JSON object per line. Skip unreadable lines (also nested too deeply to decode) and non-objects.
  - Claude Code may write earlier records again further down the file, identical with the same `uuid`, after a
    compaction (checked 2026-09-28: 3 files, 1,863 records). The conversation reads each uuid once; the scan's
    upserts by message and tool_use id make the copies change nothing.
  A timestamp without a zone counts as UTC; an epoch time out of range counts as missing.
  - Conversation records carry `timestamp` (ISO UTC with milliseconds), `sessionId`, `cwd`, `gitBranch` and
    `version`.
  - `ai-title` (`aiTitle`) and some other types have no timestamp.
  - Subagent records carry `agentId`, `isSidechain: true` and the parent's `sessionId`.
- **Assistant messages:** one record per content block with the same `message.id`; the last record carries the final
  `usage`. Skip `model == "<synthetic>"` (API errors with null counters).
- **Usage:**
  - Fields: `input_tokens` (new input), `cache_creation_input_tokens` (split into
    `cache_creation.ephemeral_5m/1h_input_tokens`; all 5m if the split is missing), `cache_read_input_tokens`,
    `output_tokens`, `server_tool_use.web_search_requests`.
  - Null or missing counters count as 0.
  - `speed` is missing or `standard`; anything else counts as fast.
  - `iterations` duplicates the top-level counters.
  - Context per turn is new input + cache writes + cache reads; an agent's input total is the sum over its turns.
- **API errors:** a failed call is a `<synthetic>` assistant record with `isApiErrorMessage: true`, `uuid`, `error`
  (`rate_limit`, `server_error`, …) and usually `apiErrorStatus` (429). A rate limit adds `quotaLimits` with
  `rateLimitType` (`five_hour`, …) and `resetsAt` in epoch seconds.
- **Compactions:** a `system` record with `subtype: "compact_boundary"`, `uuid` and `compactMetadata`
  (`trigger` manual or auto, `preTokens`, `postTokens`, `durationMs`, `cumulativeDroppedTokens`); checked
  2026-09-28 (10 of 10 with metadata). The summary follows as a user record with `isCompactSummary`. One row per
  uuid in `compactions`, owned by the file that stored it first. No microcompact records seen.
  - Checked 2026-09-28 on 11 compactions, counts only: `preTokens` is the last call's context plus its reply, and
    0 to 841 more. `postTokens` is not the next call's context: that call is 35K to 48K larger, since it sends the
    system prompt, tools and CLAUDE.md again (and reads them from the cache).
  - The compaction call is in no transcript, only in the cost-state totals. There it reads the last call's cache
    read, sends about 2.1K as plain input and writes the rest to the 5-minute cache, even where the main thread
    writes for an hour (Claude Code's costUSD matches to 1e-6).
- **Attachments:** `attachment` records (`uuid`, `timestamp`, `attachment.type`) carry what Claude Code adds to the
  next request; `rendered` is a list of `{content}` (the text the model gets; a string, rarely text blocks), or null
  for bookkeeping types (`hook_success`, `deferred_tools_record`, …). Never stored, like prompts. Checked 2026-09-28
  (15,169 records, 35 types): `total_tokens_reminder` (86 characters) comes before almost every call.
- **Edits:** the user record of an Edit's or a Write's result carries `toolUseResult`: `structuredPatch` hunks
  whose `lines` start with `+`, `-` or a space, or for a new file `type: "create"` with `content`. Count the lines,
  never keep them. Counted this way, lines match `totalLinesAdded`/`Removed` for most sessions.
- **Effort:** assistant records carry `effort` (`medium`, `high`, `max`, …), the same on every record of a message
  id. `perTurnEffort` is often null; ignore it.
- **Ultracode:** no call records it (checked 2026-09-28, Claude Code 2.1.283, counts only). It is a session setting,
  on only while the effort is xhigh. The main thread notes it in `attachment` records on human prompts:
  `ultra_effort_enter` with `reminderType` `full` (switched on) or `sparse` (a reminder that it still is), and
  `ultra_effort_exit` (switched off, noticed at the next prompt). Picking another effort level switches it off
  without a note; only the calls' `effort` shows it. `workflow_keyword_request` is a one-turn opt-in and changes
  nothing. One row per uuid in `ultracode_states`, owned by the file that stored it first.
- **Attribution:** assistant records may carry `attributionSkill`, and `attributionMcpServer` with
  `attributionMcpTool` (the bare tool name). All records of a message id carry the same values.
- **Tools:** `tool_use` blocks (`id`, `name`) and `tool_result` blocks in user records (`tool_use_id`, `content` as
  a string or blocks: count only `text` blocks). A result can come in a later read than its call. Show
  `mcp__<server>__<tool>` as `<server>.<tool>`.
- **Prompt:** the first line of the first user record that isn't `isMeta`, `isCompactSummary` or a tool result.
  **Project:** the first `cwd`, else the slug. Many main transcripts start with a record without `cwd`.
- **Background calls** (Haiku for titles and classifiers, WebSearch) are in no transcript. They appear only in
  `cost-state` records.
  - When Claude Code writes one: when its process ends, and sometimes while it runs (checked 2026-09-29, counts
    only: one process wrote 4, two of them identical after the same record). The record has no timestamp; the
    record before it marks the snapshot time.
  - They may count much more than the transcripts show: one session's process counted 1.31M Opus output against
    848K in its transcripts, with the missing input only about its 12 compaction calls'. The gap built up before a
    snapshot at 21:47 (458K), the compaction after it added 3.8K, a normal summary. Its source is unknown: not the
    compactions, the effort level, the workflow journals or a lost usage record.
  - `startTime` is the process start; the snapshot covers only that process's run.
  - Checked 2026-09-27 (161 transcripts): repeated cost-states in a main file share one `startTime` and their
    totals only grow, and no message id appears in two files. Keeping the latest cost-state per session for the run
    totals, taking each snapshot's growth over the one before, and letting the first file scanned own an id rest on
    that; re-check (counts only) if resumed or forked sessions change.
  - `modelUsage` has per-model `inputTokens`, `cacheCreationInputTokens` (no 5m/1h split),
    `cacheReadInputTokens`, `outputTokens`, `webSearchRequests` and `costUSD`. Model ids there may carry a `[1m]`
    suffix.
  - Run totals of the same process, integers: `totalDuration` (wall-clock), `totalAPIDuration` (retries included),
    `totalAPIDurationWithoutRetries`, `totalToolDuration` (all ms), `totalLinesAdded`, `totalLinesRemoved`.

## Design rules
- **Incremental scan** (`scan.scan`):
  - An unchanged file (same size and mtime, for a subagent also the same meta-file mtime) is skipped; a grown
    one is read from `read_offset`, complete lines only.
  - A file below its offset, or with a new first-line hash, was rewritten and is read again from 0.
  - One transaction per file; WAL mode so a cron scan can run while the server reads.
  - A file that fails to read or parse goes into the scan's `errors` and is skipped; only a store error
    (`sqlite3.Error`) stops the scan. One bad file must not keep the files after it out of the store.
  - `day` is the local date in the scanning process's time zone, fixed at scan time; hours are grouped at query
    time with SQLite's `localtime`. Cron and the server should run with the same `TZ`.
- **Ownership:**
  - The file that stored a message id first owns it. Later reads of that file update its counters (the last
    usage wins); copies in forked or resumed sessions change nothing.
  - Tool calls and result sizes follow the same rule.
  - Message rows keep only the path; project, session and agent come from `transcripts`.
- **Queries:** optional filters come from `queries.range_filter`, which writes only the clauses that are set: a
  `(:x IS NULL OR day >= :x)` clause keeps SQLite off the day index. A subquery doesn't reach into the
  `usage_rows` view, a list of values does, so per-session sums pass the ids as `IN (?, …)` in batches.
- **Background usage:**
  - Every snapshot goes into `cost_snapshots` (by session and snapshot time; one without a time only into
    `cost_states`, which also stands in for a store from before version 14 whose transcript is gone).
  - After each scan, per touched session, snapshot and model: the snapshot minus the transcripts between its
    `startTime` and its time, per category, never below 0, less what the same process's earlier snapshots counted
    so (never below 0: a gap that shrinks gives nothing back). A file's transaction marks its session in
    `dirty_sessions`, so a scan that stops early leaves the recomputation to the next one.
  - It goes into `background_parts`, filed under each snapshot's time and day, so an evening's usage stays on its
    evening when the process ends the next morning. `background` (one row per session and model) is no longer
    written. The `usage_rows` view unites the parts with the messages as agent type `(background)` and effort
    `background` (`store.BACKGROUND_EFFORT`), without turns.
- **Ultracode** (`scan.update_ultracode`, after each scan for the touched sessions): a span runs from a note that
  it is on to a note that it is off, or to the first later main-thread call at another effort level (a call without
  one ends nothing). Every message of the session at xhigh inside a span gets `messages.ultracode = 1`, subagents'
  and workflow agents' too, since they note nothing of their own. The view, the turn contexts and the chat show its
  effort as `ultracode` (`store.EFFORT`), ordered after max.
- **Run totals:** the latest cost-state per session, filed under its snapshot day. The summary sums the sessions that
  ended in the range, and prices their whole usage for the cost per 100 lines changed.
  - Without a cost-state (a session still running, or a process that never exited), the session view estimates
    them from the store: first to last record, each reply's request (the last user record before it, carried
    across reads in `transcripts.last_user_ts`) to its last record, each tool call to its result, and the edited
    lines. The API and session times match the cost-state within a few percent. Tool time runs about 3× over,
    since it includes waiting for permission, so the page says so. Retries are unknown.
- **API errors:** one row per record uuid in `api_errors`, owned by the file that stored it first. The dashboard
  plots the rate limits in `--status-critical` with an icon and a label; other errors are only listed.
- **Compact hints** (`compact.compact_hints`, per chat request, nothing stored):
  - A call's context is new input + cache writes + cache reads, like `CONTEXT` and Claude Code's `used_percentage`.
  - Anthropic publishes no "normal" context size; it only says quality degrades as the context fills
    (best-practices, context-windows docs). So `[chat] compact_hint_tokens` (200K, after Claude Code's
    `exceeds_200k_tokens`) is a heuristic, and the page says so.
  - The hard number is where Claude Code auto-compacts: about 967K on native 1M windows, 200K on 200K windows
    (code.claude.com/docs/en/model-config, checked 2026-09-27), in `[auto_compact]` by model prefix. It's
    user-changeable (`autoCompactWindow`), so `default` is configurable.
  - Three tiers, each announced once per stretch between compactions as a block with its advice, then reminded
    at milestones as a chip in the call's usage badge: soft every further `compact_reminder_step` of the
    threshold (1.5×, 2×, …), pays every further `compact_reminder_step` of the context it first fired at (while
    it still pays), auto every further `auto_compact_reminder_step` of the auto-compact point (85 %, 90 %, …).
    One hint per call, for the highest milestone passed; once a stronger tier has spoken the weaker ones are quiet.
  - The pays tier (main thread only): the call's usage carries `compact_pays`, the gauge's estimate for
    compacting right after it (`turns.pays_estimates`), where `turns.likely_pays` holds: the break-even is at most
    the calls still ahead on average (`turns.calls_ahead`). That is the mean of what the finished past stretches
    longer than the current one had left, with at least `AHEAD_MIN_STRETCHES` of them, else the mean finished
    stretch (having outlasted most says nothing about stopping soon). The mean, not a low bound, is the rule that
    saves most on average: a compaction that doesn't pay back loses at most its one-time cost, a long stretch saves
    on every call. It learns only from what was known at that call (`turns.known_at`: compactions before it, a
    stretch ending later still open), counting its calls since the transcript's last compaction. The gauge's
    estimate carries the same `calls_ahead`. Its edge is
    `--hint-critical-edge`, the critical hue lightened in dark mode to clear 3:1 on the warning wash.
  - The Input tokens tile shows the median and p90 context per main-thread turn (`queries.context_stats`) to choose
    the threshold by.
- **Context per turn** (`turns.py`, per request from the stored turns, nothing stored; checked 2026-09-28 against
  8,126 real turns, counts only):
  - Growth: context − previous context − previous output (tool results, prompts, attachments). None for the first
    turn and the first after a stored compaction; it may be negative (thinking dropped, context edited).
  - Cache rebuild: previous context ≥ `REBUILD_MIN_CONTEXT`, a cache read below half of it, and cache writes. Lost
    tokens = min(previous context − cache read, cache writes), priced at the write rate minus the read rate. Cause
    `model` (the model changed), `idle` (request − previous reply's end over the cache lifetime: 1 h for mostly
    1h writes, else 5 min), else `prefix`. Real data: 14 rebuilds, 11 of them idle.
  - Fixed overhead: the first turn's context; its cost carried is each later turn's cache read up to that size at
    the read price.
  - The gauge (`current` in `/api/session`): the main thread's last context against the auto-compact point, turns
    since the last compaction, the mean growth and context step over the last 10 steps since then, and the turns
    left at that pace. Its `compact_now` (`turns.compact_preview`) previews compacting after the last call:
    - Exact: each call's re-read (the last context and reply at the read price), the cache warm until the last
      request plus the `cache_ttl` of the latest call that wrote (a lower bound: other requests may refresh it),
      and keeping across a break past that (rewriting it all).
    - Estimated from every stored main-thread compaction (`queries.compaction_history`, which the server keeps
      until the store's change count moves), None without one that estimated a summary:
      - the context after: the median cached prefix plus what past compactions added beyond it (min to max;
        never this session's first call, which a resumed transcript makes large);
      - the summary (the same model's median), and the one-time cost with the rewrite never below nothing;
      - the calls to break even (a range);
      - how many calls followed finished stretches, and how many are still ahead on average (`calls_ahead`);
      - what compacting right before a break past the cache's lifetime saves at the fastest summary;
      - once the cache has expired, compacting cold against keeping's rewrite of everything (`cold_saving`,
        `breakeven_cold`), which the page switches to, drawing the gauge again when the cache runs out.
    - The page words it as a horizon, not advice: on real data "always compact" was never wrong, and how many calls
      follow is unknowable.
  - The biggest growth steps list the tools the call before ran (tool_use blocks between its first and last
    record); a subagent's `returned_chars` is its spawning Agent call's result size (`transcripts.tool_use_id`).
- **Compaction versus keeping** (`turns.versus_keeping`, per request, nothing stored; checked 2026-09-28 against
  11 real compactions, counts only):
  - The assumption: the kept session would have made the same later calls, each carrying D = the last call's
    context and reply minus the next call's context. It is a model; re-reading files after compacting isn't
    counted (tool inputs aren't stored), so the page gives the re-read tokens that would cancel a saving.
  - The one-time cost:
    - The compaction call, whose input side is known: warm, it reads the last cache read and writes the rest but
      `COMPACT_UNCACHED_TAIL` at the 5m price; cold (its start past the last request's `cache_ttl`), it writes all
      but the tail.
    - Its summary is estimated as the duration times the model's median main-thread output speed
      (`queries.output_rates`), bounded by the fastest. The page marks these amounts with ~.
    - Plus the rewrite: the next call's cache writes beyond the last reply, at the write price minus the read price.
  - Each later call saves D at its read price, or at its write price where it rebuilt the cache anyway. A kept
    first call after the cache expired would have written everything, the static prefix too. A following
    compaction's call reads D once more.
  - Where the kept context would have reached the auto-compact point, the kept session stops saving and compacts
    itself: at least reading its context from the cache, then rewriting as the actual next call did.
  - Verdicts:
    - `forced`: keeping couldn't go on (the last context and reply at the auto-compact point, or not even the next
      call fitting, e.g. after a switch to a 200K model).
    - `saved`: even at the fastest summary.
    - `cost_more`: a finished stretch fell short even of the input side alone.
    - `unknown`: no summary estimate (no output speed for the model, or no duration).
    - `open`: the last stretch hasn't paid off yet.
    - `even`: in between.
  - The page shows `saved` as a gain (▲ +$, `--gain-text`) and `cost_more` as a loss (▼ −$, `--loss-text`), an
    `open` stretch still behind as its loss so far (▼ −$ so far), the other verdicts in neutral words
    (`verdictTone`); the sign and the arrow carry it, not the color (≥ 4.5:1 on the surface, the page and the hover
    wash in both modes).
  - The break-even call is judged at the fastest summary, like `saved`; without an estimate at the input side
    alone (`breakeven_at_least`). It is projected past the last call, and None is "never".
  - Each comparison covers its own stretch, up to the next compaction, so they don't overlap and add up:
    `queries.compaction_savings` (by range, project or session) sums the main threads' nets
    (`turns.savings_total`: a stretch not paid off yet as it stands, forced compactions left out, those without a
    summary estimate counted, not summed). The Estimated cost tile shows it as a gain or loss, in the overview
    (`compaction_savings` in `/api/summary`, the compactions of the range's days) and the session view. The compactions
    table's heading shows the same total for the transcript picked (`compactionTotal`, summed on the page).
- **Pricing:**
  - The longest model-id prefix wins, and a `[1m]` suffix is ignored.
  - Fast mode multiplies every category, cache included.
  - Web searches are a flat `[fees] web_search_per_1000`.
  - Not modelled: US-only inference (1.1×) and the Batch discount.
  - Every usage total carries `cost_parts` per category.
- **Config:**
  - The defaults ship in `claude_usage/config.toml`. Overrides are `~/.config/claude-usage/config.toml`, then
    `config.local.toml` in a checkout.
  - Relative default paths count from the data folder: `data/` in a checkout, else
    `~/.local/share/claude-usage`.
  - `config.settings()` refuses unknown keys and checks `[serve]`; `[prices]`/`[fees]` are checked in
    `pricing.py`, `[chat]`/`[auto_compact]` in `compact.py`. Numbers must be finite.
  - The version lives in `claude_usage/__init__.py`; `pyproject.toml` reads it from there.
  - `package-data` must cover every file under `static/` (a test checks it), or an installed copy misses it.
- **Server:**
  - It binds to loopback only, and refuses requests whose `Host` header isn't a loopback name. The API exposes
    titles and first prompts, so this blocks DNS rebinding.
  - The page is served with a strict CSP: no inline scripts or stylesheets, only style attributes. JSON is
    `no-store`.
  - Only files under `static/css` and `static/js` are served, a list fixed at start: a new one needs a restart.
  - Each request scans at most every 5 s, behind one lock. A failed scan (no projects folder, a locked store)
    or a skipped file doesn't fail the request: the stored history is served with `scan_errors`, and new errors
    go to stderr. Unexpected errors answer a JSON 500 and log their traceback.
  - `serve` prints "Serving …" before its first scan (a new store's reads every file), since `make start` waits
    for that line; SIGTERM (`make stop`) stops it like Ctrl+C.
  - `/api/session/<id>` gives each agent `tool_kinds` (`tool_kinds.transcript_tools`), read from its transcript
    and kept in memory by path until the file's size or mtime changes (`TOOLS_MEMO_LIMIT` files, counts only), None
    once the file is gone; the Tools table then shows the stored `tools`.
    - A Bash call's kind comes from its programs, never from a language (`command_kind`): past `cd`, assignments,
      wrappers and quoted text, an edit in place anywhere (`sed -i`, `perl -i`), else by the first program: a file
      written (a heredoc or `echo`/`printf`/`cat` redirected, `tee`), an inline script (any interpreter fed code by a
      heredoc or `-c`/`-e`/`-r`), git's searches, search, view, list, git, else run.
    - Each call also names its kind's detail (`command_class`): the program that does it (the one that edits, an
      interpreter without path or version: `python3.12` is `python`), for git its subcommand; and that program's
      options (`option_names`, git's subcommand's): names only, each once, a number as `-N`, up to `--`. Values
      and arguments are left out (`-I/usr/include` is `-I`, `-m 'text'` is `-m`), since they hold paths and text.
    - A file tool's call (`FILE_TOOLS`: Read, Edit, MultiEdit, Write, NotebookRead, NotebookEdit) has no kind; its
      detail is the file's type (`file_type`: the last suffix or a dotfile's name, lower-cased, else empty; never
      the path or the name), its options the optional inputs it gave, by name (`offset limit`, `replace_all`).
      Grep's detail is its output mode (`files_with_matches` when none is given), since it sets the result's size;
      Glob's the file type its pattern matches. Their options likewise (`-C -n glob`, `path`), never the values.
      Agent's (and the older Task's) detail is its subagent type (`general-purpose` when none is given), Skill's its
      skill (`DELEGATING_TOOLS`). MCP tools count under one tool, `MCP` (`call_tool`), whose kinds are the servers
      and details their tools, the options every input given by name; a server's name is never a Bash kind, not
      even for exploration.
    - One row per detail under its kind (a file tool's under the tool), one per set of options under its detail. Each
      row that splits folds, until the button in its label ("git (4 subcommands)", "grep (3 option sets)") opens
      it; the kinds (and servers) always show. A row's `fold` is its key per agent, the rows under it carry it as
      `parent`, and a row shows while every fold above it is open.
    - Checked 2026-09-29 on real transcripts (counts only): moving between Read/Edit/Write and Bash saves nothing
      measurable (median results 3,066 for a whole-file Read against 6,600 for `cat` and 2,905 for `sed -n`; Edit
      input 707 characters against 674 for `sed -i`; heredocs fail 5.6 % against Write's 0.8 %). What costs is what
      later calls carry: a call's input and result at `CHARS_PER_TOKEN` (2.3, the median over 1,966 single-result
      steps), written once by the next call and read by each one after it up to the next compaction, at the calling
      message's rates. The input costs once more at the output price, since the model wrote it.
  - `/api/session/<id>/chat[?agent=<id>]` reads the conversation from the transcript per request, with tool inputs
    and results cut to `CHAT_TOOL_LIMIT`. Each reply carries its effort level, and the last entry of each API call
    its final usage with the cost at the configured prices, both computed per request. Nothing of it is stored,
    which a test checks against the store files.
    Once Claude Code has deleted the file, it answers `available: false`.
  - Hidden context in a row (attachments with `rendered`, meta records, skill text, the compact summary) is one
    `injected` entry of items (kind, full length, text cut to `CHAT_TEXT_LIMIT`); a tool result doesn't split it.
    `FOLDED_ATTACHMENTS` (the token reminder) are no items: their characters go on the next call's usage
    (`reminder_chars`) and the chat sums them (`reminders`), since a line before each call buried the badges.
    A compaction marker carries its metadata. Each call's usage carries `growth`, `reply` (the previous call's
    output, sent again) and `rebuild` from `turns.steps` over every call of the file, shown or not; on real
    data they match the store's (14 rebuilds, same causes).
    The badge splits the context's change into both, so its parts add up: `(+6.3K: reply 414, added 5.9K)`.
- **Dashboard:**
  - The by-model chart stacks every model × effort combination (`day_model_effort`, `hour_model_effort`): the
    model's color for low or no effort, one shade further from the surface each for medium, high and max (xhigh
    shares max). Ultracode shares max's shade too, hatched at 45° with 2px lines one shade further (tone on tone,
    the dataviz texture), in the columns as an SVG pattern and on the legend and tooltip swatches as a gradient.
    Background calls (effort `background`) wear the model's own color, hatched the other way (135°, `HATCH_TURNS`)
    with lines one shade further, first in the model's stack; the legend, tooltip and tables say "background calls".
    `--shade-step-*` per slot and theme sizes the steps for a lightness gap of 0.065; re-run the `--ordinal` and
    contrast checks when a series color changes. Models are 4px apart in a column, shades 2px.
  - Load the `dataviz` skill before changing a chart, and run its palette validator for any new colors.
  - Categorical colors come from its validated palette in a fixed order per model; past eight slots a model folds
    into "Other".
  - Never a second y-axis: cost and tokens get aligned panels, or a metric switch.
  - Every chart has a legend, a table view and hover or focus tooltips. Charts are built from `chartkit.js`
    (axes, x labels, area line, tooltips, table shell). Each has one focusable cursor layer (`chartCursor`, a
    slider): the pointer picks the bucket under it, arrow keys, Page Up/Down, Home and End step, and a screen
    reader reads each bucket's values; a column chart highlights the band, a line chart shows a crosshair.
  - The Daily range shows one day (today by default, earlier ones with the ‹ › arrows via `until`) and plots its
    local hours (`hour_model`, up to now for today) instead of a single point. The arrows skip days without
    usage (`previous_day`, `next_day`); › always reaches today.
  - Polling: live every 5 s, the summary every 60 s, each after the previous answer, none while the tab is hidden.
    An unchanged payload isn't drawn again, so focus stays put. The banner keeps one message per source (live,
    summary, session, scan), and a response only renders if it answers the newest request.
  - An open session polls too: every 5 s while it is `live` (a transcript changed within `live_minutes`), else
    every 60 s, which notices a resumed session. A changed one is drawn in place (`renderDrilldown(detail, true)`):
    the conversation's nodes move into the new view, and the table view, the folds open (a workflow run's agents,
    an inline script's interpreters: `data-fold`), focus and the element at the top of the window are kept. A conversation shown is read again and drawn only if it changed,
    keeping its open entries (by time, kind and position) and, once scrolled into, the entry at the top. It reads
    the transcript itself, so a reply the scan hasn't reached yet may show plain xhigh until the next change.
  - The range buttons stop at `retention_days`: the summary cuts a longer `days` to it and returns
    `retention_days` and `history_since` (the first stored day); the page hides the longer buttons, falls back
    from a saved longer range, and says "history since" when a range starts before the history does.
  - The session view takes focus on open; Escape or Close returns focus and scroll to the link that opened it.
  - The session view's context section (`drilldown.js`): the gauge (`current`) as a meter with the compact hint
    marked; the context per turn stacked as cache read, cache write and new input (`--context-read/-write/-new`,
    blue 400/550/700 in light and 500/350/200 in dark, validated as ordinal ramps), a dashed rule per compaction
    labelled by trigger where it fits, the compact hint as a reference line when the plot reaches it. A picker
    (only with subagents) switches the chart, its table view, the tiles (overhead, rebuilds, compactions, mean
    growth), the biggest growth steps and the compactions to one transcript; another session starts at the main
    thread.
  - The call to compact (`compactCall`, above the gauge), for a live session (`compactCallKind`): cold once the cache
    has expired where compacting cold saves at once; else `threshold` where the context is at or past `hint_tokens`,
    whatever the savings, since the replies still to come can't be predicted (the user's choice over waiting for a
    share of the mean stretch). No call for a warm cache below the hint: replayed on the stored sessions (37 main
    threads, 6,476 calls, 2026-09-29, counts only), heeding it added about $1.5 against $175 for the threshold, and
    without its gate it lost money. In plain words (each reply's re-read, the size after, the cost once, when it pays
    back, and compacting before a break; the threshold one claims no saving and says why it shows) with a "Copy
    /compact" button: the clipboard, else the command selected in a field. It turns with the cache, like the gauge.
  - The hint to delegate exploration (`delegateCall`, after the call to compact), for a live session
    (`delegateCallShown`): where the main thread's exploration since its last compaction (`current.exploration`
    from `tool_kinds.exploration`: Read, Grep, Glob, LSP and Bash search, view and list; MCP tools don't count)
    holds at least `[chat] delegate_hint_tokens` (20K) and the compaction estimate's `calls_ahead` is at least
    `delegate_calls_ahead` (60). It says what they cost so far and per reply, and that a subagent hands back only
    its summary. A heuristic, and the page says so. Checked 2026-09-29 on real transcripts (counts only): whether an
    MCP code index beats grep can't be told (no paired cases; searches that used the index read files too, 53 of
    80), but where exploration runs can. Against the main thread carrying a subagent's exploration itself (its
    results through the calls still ahead, and each of its rounds reading the main context), delegating was cheaper
    in 89 of 106 subagents, 52 of 53 with 60 to 150 calls ahead, and about even with 20 to 60.
  - The conversation is its own framed section (`chatSection`), its head sticky while scrolling through it. It lists
    newest first: the calls in reverse, each call's entries (one `message_id`) in their order above its usage badge. The
    order is an arrow button (`aria-label` "Oldest first", `aria-pressed`, kept as a preference): down for newest first,
    turned up for oldest first, the transcript's order; it draws the loaded conversation again. Close (`closeChat`)
    empties it, drops a load under way and stops its refresh, and returns focus to "Show conversation".
  - While the main transcript exists (`transcript` in `/api/session`), the conversation takes the Tools table's
    place, after the agents, and the tools go last (`toolsAndChat`); without it the conversation stays last.
  - Tables page (`paged(key, table)` in `tables.js`, every table and chart table view): past 10 groups of rows (a
    sub-row, an effort level or a workflow run's agent, stays with the row above it) a pager goes right-aligned into
    the row of the table's heading (`placePager`; above the table where there is none, like a chart's table view): 10,
    25 or 50 rows (25 by default, kept as a preference and applied to every table at once), previous and next, and
    "rows 11–20 of 84". Each table keeps its page by key across redraws (the session view's keys carry the session and
    the picked transcript, so another one starts at the first page), and its controls keep focus. Rows off the page
    get the `off-page` class, since a workflow run's switch uses `hidden`.
  - All data goes into the DOM via `textContent`. Two exceptions, both in `chat.js`:
    - `highlighted()` inserts the HTML of highlight.js, which escapes the text it is given and only adds spans
      with classes.
    - `markdown()` inserts Claude's answers and the user's prompts (line breaks kept; a slash command shown as
      typed, a whole-JSON prompt highlighted) as marked's HTML after DOMPurify. That keeps only `MARKDOWN_TAGS` and
      `MARKDOWN_ATTRIBUTES`: no images, styles, forms or event attributes, `class` only as `language-*` on
      `code`, and links only to http, https and mailto, opened with `noopener noreferrer`. Checked in jsdom
      against scripts, `onerror`, `javascript:` links and `<style>` (the `class` rule not yet).
  - highlight.js is vendored, not fetched: `static/js/vendor/highlight.min.js`, the cdnjs "common" build of
    11.11.2 (sha256 `62960a35…7d5a`). To update: download the new `highlight.min.js` and LICENSE from
    cdnjs / the tag, check its output still escapes `<`, `>` and `&`, and update the version here and in
    `test_server.VENDOR_LINKS` if its warning links change. marked (`lib/marked.umd.min.js`, sha256
    `e67a06aa…d905`) and DOMPurify (`purify.min.js`, sha256 `2c90a9b4…4ea2`) come from cdnjs the same way; after an
    update re-run the sanitizing checks. DOMPurify's source-map comment only makes developer tools ask the
    dashboard for a `.map` file, which answers 404. Its token colors are `--code-*` per theme (≥ 4.5:1 on
    the wash), not a highlight.js theme.
  - Contrast in every theme: text ≥ 4.5:1, marks ≥ 3:1. Categorical slots 3–5 in light mode are the palette's
    documented exception; the legend and table view carry them.
  - Documented exception, chosen by the user: the effort shades of two neighbouring models come closer than the
    palette's floor of ΔE 15 (12.8 in light, 9.3 in dark mode). The wider gap between models, the grouped legend,
    the tooltip and the table view carry the combination.
  - The gimmick themes (terminal hacker, startup flex, RGB battlestation) keep the dark-mode series colors and stop
    animating under `prefers-reduced-motion`.
