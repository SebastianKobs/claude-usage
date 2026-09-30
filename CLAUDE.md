# claude-usage

Local dashboard and persistent SQLite history for Claude Code token usage, across all projects on this machine.
Claude Code deletes transcripts after its cleanup period (30 days by default); the store keeps what they held for
`retention_days` (7, 30, 90 or 365; 30 by default, 0 keeps everything).

## Working rules
- **TDD:** write the test first, then the implementation.
- **Stdlib only:** Python ≥ 3.12, no dependencies (`sqlite3`, `http.server`, `json`, `tomllib`, `argparse`,
  `unittest`).
- **Tests:** `make test` runs `python3 -m unittest discover -s tests`, then the page's svelte-check and Vitest where
  `web/node_modules` exists (`make build` installs it); the Python tests never need node.
- **The guard** (`.claude/hooks/project-guard/`) is a git submodule of
  github.com/SebastianKobs/claude-project-guard. Clone with `--recurse-submodules`, or run
  `git submodule update --init`.
- **Never read real transcripts in tests.** Tests build their own under `tests/.tmp/` (see `tests/helpers.py`) and
  pass temp paths via `--projects-dir` and `--store`. Real `~/.claude/projects` is only read to verify a change
  against real data, and only when the user asks. Print counts and totals then, never prompt or message text.
  Screenshots for `docs/images/` show only the demo, never real sessions: their titles and paths would be published.
  `make demo` (`tests/demo.py`) writes made-up transcripts with the builders in `tests/helpers.py` to
  `tests/.tmp/demo`, relative to now, and serves them on port 8799 with a permission prompt posted. Take the shots
  1280 px wide in the light theme: the overview's top at 870 px high (again in dark), the by-model chart's and the
  live sessions' cards, and in "Checkout: split payment step" the view from the call to compact at 740 px high and
  the secret warning.
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
README.md                    the overview: highlights, quick start, what to know first; the details are in docs/
docs/                        the user guide by topic (dashboard, session view, compaction, notifications,
                             configuration, privacy); images/ holds screenshots of demo data only
Makefile                     start/stop/status of the dashboard, scan, report, session, backup, test, clean,
                             hook-line, notify-test, cron-line, demo
claude_usage/
  __main__.py                CLI: scan | report | serve | backup | hook-settings | notify-test
  report.py                  the report as text (report without --json)
  config.py                  defaults in the package, user and checkout overrides, data folder
  config.toml                the defaults, including prices (shipped with the package)
  transcripts.py             parser: reads a transcript from a byte offset into a Chunk
  conversation.py            a transcript's conversation for the session view, read on demand
  tool_kinds.py              a transcript's tool calls by tool and Bash command kind, sizes and carried cost, read on
                             demand, from where the last read stopped (CallReader)
  tool_reader.py             those readers kept by path, in serve's reader processes (ReaderPool) or in-process
  secret_paths.py            the paths a tool call names, matched against the [secrets] patterns
  store.py                   the SQLite history: schema, migrations, backup
  permissions.py             the permission prompt a PermissionRequest hook posts to the dashboard's socket
  notify.py                  desktop notifications: the system's notifier, and what changed in the live sessions
                             (serve's watcher)
  scan.py                    incremental scan and background usage: transcripts into the store
  queries.py                 what the report and the dashboard read from the store
  pricing.py                 prices by model prefix, cost per category, web-search fee
  compact.py                 the conversation's compact hints and their settings
  turns.py                   growth per turn, cache rebuilds, the fixed overhead, the current-context gauge,
                             each compaction against keeping the context
  server.py                  loopback-only http.server + JSON API (a route table)
  readers.py                 who besides you can read the projects folder: serve's warnings at start
  icons/                     the desktop notifications' icons, PNG (notify.ICON_NAMES)
  static/                    the page: vanilla JS, inline SVG, no external resources (three vendored libraries)
    dashboard.html           the markup only
    css/common.css           layout and components, for every theme
    css/themes/              one file per theme (light, dark, hacker, startup, rgb); the gimmicks share dark's
                             palette, fun.css their other rules
    js/                      classic scripts sharing one scope, loaded in order: util, state, figures, chartkit,
                             charts, tables, limits, highlight.js, marked, DOMPurify, chat, drilldown, themes, main
                             (calls setup())
      app.js                 the bundle built from web/ (make build, committed): a module loaded before them,
                             which hands them what moved (web/src/legacy.svelte.ts); app-licenses.md the
                             licenses of the packages it holds
      vendor/                highlight.js 11.11.2 (common build, BSD-3), marked 18.0.14 (UMD, MIT), DOMPurify
                             3.4.16 (MPL-2.0 or Apache-2.0), each with its license
web/                         the page's Svelte 5 + TypeScript sources, which take over static/js section by
                             section; node only to build and test them, never to run the dashboard
  build.json                 what the last build read and wrote, by sha256: test_web.py says "run make build"
                             where the checkout differs
  src/lib/api.ts             the types of the server's answers: test_api_types.py checks the demo's against them,
                             so a field added in server.py or queries.py is added there too
  src/lib/format.ts          number, money, duration, day, hour and moment formatting, handed to the classic scripts
                             as globals; test_static.py's node tests import it as it is (node runs TypeScript)
  src/lib/colors.ts          the by-model chart's model slots, effort order, shades and hatches, handed over the same way
  src/lib/compact.ts         when compacting pays off (`payoffTone` and its words), the call to compact, the hint to
                             delegate, a compaction's verdict and their sum; handed over the same way
  src/lib/secrets.ts         how the secret accesses show: the card's tone, a path's script, how far a call got
  src/lib/live.ts            the live cards' badges (waiting, secret, compacting now) and what waits for the user
  src/lib/tables.ts          paging (page units, window and text), the sessions list's filter and count, the Tools
                             table's rows with their keys, folds and labels, the conversation's order and keys
  src/lib/charts.ts          the charts' maths: scales and ticks, where a point or column falls, the time axis, the
                             by-model series and stacks, the rate-limit counts and windows, the cost bars' split
  src/lib/themes.ts          the themes and the gimmick themes' wording (`test_static.py` reads its labels): which theme
                             a saved choice names, what a label and the footer say in a theme
  src/lib/prefs.svelte.ts    the saved preferences (theme, page size, the conversation's order) as reactive state,
                             written back in their setters, and `hype`, which words a label for the theme chosen
  src/lib/paging.svelte.ts   the page each table is on (`tablePages`, the first unit shown, reactive) and the pager
                             mounted for the old scripts (`mountPager`, `releaseDetachedPagers`)
  src/lib/chartkit.ts        the chart kit's maths: the drawing width and scale, the pointer's x, how the cursor steps
                             (`cursorStep`), where the tooltip sits, which x labels show, the gridline's pixel
                             (not handed to the old scripts yet: the components use it)
  src/lib/scroll.ts          keeping the reader's place while a view is redrawn (`scrollAnchor`, `keepScroll`)
  src/components/            the Svelte components (`Banner`, `Pager`, `Swatch`, and the chart kit: `Chart`, `ChartTooltip`, `YAxis`,
                             `XLabels`, `AreaLine`, `PointDot`), each with its Testing Library test
tests/                       helpers.py (projects-folder and transcript builders, StoreCase) and one test file per
                             module; test_static.py checks static/ without a browser; demo.py builds the demo for
                             the screenshots and serves it (make demo)
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
    - How agents end (checked 2026-09-29, counts only): a workflow agent hands its result back by calling
      `StructuredOutput`, and no reply follows its result (65 of 75); a subagent ends with a text reply (116 of
      122). The journal marks each agent `started` and `result` (75 and 68: one run of five was stopped midway).
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
  - A question (`AskUserQuestion`) or a plan to approve (`ExitPlanMode`) waits for the user until its result comes,
    and the transcript doesn't change for it meanwhile. Checked 2026-09-29 (counts only): 75 and 64 calls, all in
    main threads, each with a result (an error where declined: 2 and 19), after a median 46 and 72 s, at most
    40 min; 3 of the 39 with a stored call time waited longer than the 5-minute live window. No API call came
    between a call and its answer (0 of 141); what did were records without a timestamp (title, last prompt,
    mode), the results of the calls beside it in its message (25), hook results (19) and queued prompts (3), and in
    4 waits a background subagent's records.
- **Permission prompts:** no record marks one, open or answered; a refused call's result says "The user doesn't want
  to proceed" (14 tool calls, 2026-09-29, counts only), and a result's delay doesn't tell a prompt apart (even Edit and
  Write take over 10 s in 11 to 12 %). Only hooks see them. Checked 2026-09-29 with a logging hook (Claude Code in
  VS Code, auto mode): `PermissionRequest` fires as the dialog opens, 0.08 s after the call is written, for the main
  thread and subagents, and for AskUserQuestion's dialog too; never for a call that goes through without asking. Its
  input: `session_id`, `transcript_path` (the main transcript, even for a subagent), `cwd`, `permission_mode`,
  `hook_event_name`, `tool_name`, `tool_input`, `prompt_id`, `effort`, `scratchpad_dir`, and for a subagent
  `agent_id` (as in its file name) and `agent_type`. No `tool_use_id`, though the docs list one. `Notification` with
  `notification_type` `permission_prompt` comes about 6 s later, only while the dialog is still open, without a tool.
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
- **Store files:** the store holds titles and project paths, so it is its owner's alone (`store.PRIVATE_FILE`,
  0600, whatever the umask): created so, a new folder for it 0700, and an older store (and its `-wal`/`-shm` files)
  open to others closed at every open (`store.make_private`, only the owner's files, only on POSIX). SQLite gives
  new WAL files the store's mode. A backup is created empty at 0600 first (`O_EXCL`, so it never overwrites), which
  `VACUUM INTO` fills; a failed one is removed.
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
  - The windows that hit a rate limit (`queries.limit_windows`, `api_errors.windows` in `/api/summary`): one per
    quota of `LIMIT_WINDOWS` (only `five_hour`, 5 hours) and `resets_at`, which fixes the window's end and so its
    start. A window is in the range where one of its hits is; its first hit and hit count take all its hits (of the
    project, if one is set). It used what `usage_rows` holds from its start up to the first hit, per model and in
    total (`queries.usage_between`; background calls at their snapshot time), a lower bound, since the limit also
    counts use elsewhere. The Rate limits card lists them, newest first, each model as a sub-row.
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
    left at that pace. A compaction after the last call (`compacted`) starts a stretch without a call yet: until the
    next one the gauge shows the compaction and the context before it, and `compact_now` is None, so neither the
    call to compact nor a live card's trash compactor shows (the context left isn't known: `postTokens` isn't the
    next call's). Its `compact_now` (`turns.compact_preview`) previews compacting after the last call:
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
      - in how many replies compacting would pay off within the calls then still ahead, the context growing by the
        gauge's mean step through the cache (`pays_later_in`, `pays_later_at`: `turns.later_payoff`), since early
        in a stretch, a session's first too, compacting pays off too late only because the context is still small.
        A stretch's first call has no step of its own, so it grows at the mean step before it
        (`turns.mean_step_before`, the last `GAUGE_STEPS` with growth); without one the first call after every
        compaction read as too late, and notified so;
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
  - `CLAUDE_CONFIG_DIR`, when set, makes the default `projects_dir` `$CLAUDE_CONFIG_DIR/projects`, as Claude Code
    does (`config.claude_projects_dir`: the value as it is, no `~`, a relative one from the working folder); a
    `projects_dir` in an override still wins, and `--projects-dir` over that.
  - `config.settings()` refuses unknown keys and checks `[serve]`; `[prices]`/`[fees]` are checked in
    `pricing.py`, `[chat]`/`[auto_compact]` in `compact.py`, `[notify]` in `notify.py`. Numbers must be finite.
  - The version lives in `claude_usage/__init__.py`; `pyproject.toml` reads it from there.
  - `package-data` must cover every file under `static/` and `icons/` (a test checks it), or an installed copy misses
    it.
- **Server:**
  - It binds to loopback only, and refuses requests whose `Host` header isn't a loopback name. The API exposes
    titles and first prompts, so this blocks DNS rebinding.
  - Loopback is open to every local user, so the API (every path but the page and its files, which hold no data)
    answers only a request carrying this start's token in the cookie
    `claude_usage_<port>` (cookies don't tell ports apart), else a JSON 403 that the page's banner shows once
    (`BannerMessages`, web/src/lib/banner.svelte.ts). The token (`UsageApp.token`,
    `secrets.token_urlsafe`, new per start, compared in constant time) comes with the link `serve` prints:
    `/?token=…` sets the cookie (HttpOnly, SameSite=Strict, Path=/, 400 days) if it is right, and redirects to `/`
    either way, so the token leaves the address bar. The Cookie header is split by hand (`cookie_value`), since
    `http.cookies` stops at the first cookie it can't parse. `make start` writes its log, which shows the link,
    under umask 077.
  - The token keeps other users out of the dashboard, not out of the files it reads. So before the link `serve`
    warns on stderr (`readers.warnings`; `make start` shows what comes before its line) where files below the
    projects folder can be read by other users, or some of it belongs to one (not you, not root), and names the fix.
    - Readable goes by POSIX along the whole way from / down (`readers.can_read`): anyone else by the bits for
      others, a member of a shared group by the group's wherever an entry has that group. A group is shared unless
      nobody else is in it (`group_shared`: its members and the accounts whose primary group it is), so a private
      group opens nothing. Checked 2026-09-29 (counts only): Claude Code keeps `~/.claude` 700, while its meta files
      and tool results are 644, so the files' modes alone would warn about what nobody else can reach.
    - On a Windows drive (WSL's drvfs without `metadata`, found in /proc/self/mounts: `permissionless_mount`) chmod
      does nothing, so the fix is a mount option. A heuristic: ACLs, hard links elsewhere and the names in an open
      folder aren't counted.
  - The page is served with a strict CSP: no inline scripts or stylesheets, only style attributes. JSON is
    `no-store`.
  - Only files under `static/css` and `static/js` are served, a list fixed at start: a new one needs a restart.
  - Each request scans at most every 5 s, behind one lock. A failed scan (no projects folder, a locked store)
    or a skipped file doesn't fail the request: the stored history is served with `scan_errors`, and new errors
    go to stderr. Unexpected errors answer a JSON 500 and log their traceback.
  - `serve` prints "Serving …" before its first scan (a new store's reads every file), since `make start` waits
    for that line; SIGTERM (`make stop`) stops it like Ctrl+C.
  - `/api/session/<id>` gives each agent `tool_kinds`, read from its transcript (counts only), None once the file is
    gone; the Tools table then shows the stored `tools`.
    - Each transcript has a reader (`tool_kinds.CallReader`) that goes on from where its last read stopped once the
      file's size or mtime changed, as the scan does: complete lines only, from the start again once the file was
      rewritten (shorter than what was read, or another first line: `transcripts.head_hash`). A test checks that
      reading in two parts, wherever the file is split, gives what one full read gives. It keeps each message's
      rates, since building the rows was mostly working them out again (35,000 calls: 250 ms, now 75 ms).
    - The readers live in `serve`'s reader processes (`tool_reader.ReaderPool`, `READ_PROCESSES`, spawned at their
      first read), each file always in the same one (a checksum of its path), which keeps the readers of the
      `MEMO_LIMIT` files it used last; one request reads a file at a time, another waits and finds it read. A request
      only waits for the answer. Checked 2026-09-29 on four synthetic live sessions of 98 MB: reading in the
      server's own process, a first read's parsing starved the thread holding the store lock (the live list waited
      10.6 s while the four were read at once, 0.9 s while each grew by 5 calls); with the processes it waited
      0.17 and 0.19 s, as when idle. The tests read in-process (`tool_reader.ToolsReader`, `read_processes=0`), where
      they can patch the reader; a script starting the processes needs `if __name__ == "__main__":`, as spawning
      imports its main module again.
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
  - `/api/session/<id>` also gives `secret_accesses`: every call of the transcripts still there that named a path
    matching `[secrets] patterns` (`secret_paths`, found in the same read, `tool_kinds.CallReader(find_secrets)`),
    with its time, agent, tool, the path as given, the pattern, whether its result was an error, and how far it got,
    the most severe first, then by time. The paths stay in the readers with the counts, and so do the texts of the
    files the transcript wrote (the scan of scripts needs them), in memory only, never in the store (a test checks
    the store files).
    - A pattern is a name matching any part of a path (`.env`, `*.pem`), a path from `~` or `/` matching it and
      everything below it (wildcards per part), or either negated with `!`; the last match decides, as in a
      .gitignore. `~`, `$HOME` and `${HOME}` are the server's home, a relative path counts from the record's `cwd`.
      The patterns are compiled once (`compiled_patterns`, fnmatch's expressions), and one expression of all names
      rules out a part that none matches: a transcript names thousands of paths, and matching each part with
      `fnmatchcase` took 1.0 of 1.1 s for 17 MB with 6,000 calls (now 0.13 of 0.23 s, the read 0.1 s).
    - The paths a call names (`call_paths`): a file tool's path inputs by name (`PATH_KEY`: `file_path`, `path`,
      `glob`, …; Glob's `pattern` too, never Grep's regular expression or text a call writes); a command's words
      and option values (`--env-file=.env`), quoted text only where it holds a slash (a commit message naming
      `.env` is no access), no URLs, and a heredoc's quoted paths only for an inline script. The variables a
      command sets itself are expanded first (`D=~/.ss; cat ${D}h/id_rsa`), not in single quotes. A heuristic.
    - Scripts (`TranscriptScan`, one per transcript read: `finder` starts it, `read_calls` hands it every call in
      order): it remembers the text each file got (a Write's content, an Edit's or MultiEdit's new text added), and
      a later command of kind `run` whose word is such a file has that text scanned, a shell script (by suffix or
      `#!`) like a command, other code by its quoted paths. The row's `via` is that word. Variables from earlier
      calls, scripts from elsewhere and a script written in another transcript are unknown.
    - How far it got (`tool_kinds.secret_reach`, from the call and its result): `sent` (high) where the call handed
      its input out (`secret_paths.sends_out`: an MCP tool, whose server gets the input, or a command with one of
      `[secrets] network_programs`, past cd and wrappers); `returned` (medium) where a result went into the
      conversation, and so to the API with the next request; `pending` (medium) with no result yet; `error` (low,
      but medium where it was sent: a service may have got it before failing, and a blocked call looks the same);
      `empty` (low) for an empty result. A result counts whatever it held: a test run that only mentions a path
      returns output too, and telling that apart would mean reading the file, which it never does.
    - A `returned` call that looks like a test (`secret_paths.looks_like_test`: one of its words, the script it ran
      or the path it named matches `[secrets] test_patterns`, as a path from the record's `cwd`, which itself
      doesn't count) is `low-medium` instead, sorted after medium; every other reach stays as it is for a test. A
      heuristic: `cat .env && pytest` counts as a test too.
    - The page shows them under the tiles, before the call to compact (`secretAccesses`), each row's reach in words
      after a mark in `--hint-critical-edge`, `--hint-warning-edge`, `--series-1` (blue, low-medium) or
      `--text-secondary`, the table paged. By
      `secretTone`: with a high row (`alert`) the card is open, edged in `--status-critical`, its heading on the
      critical wash with a `!` mark; else it is folded to a one-line summary with a Show button (`data-fold`, kept
      across redraws), edged in `--hint-warning-edge` with a medium row (`warning`), a plain card with only low and
      low-medium rows (`quiet`); nothing without one.
  - `/api/session/<id>/state` (`UsageApp.session_state`) is what a live card shows besides its totals: the main
    thread's gauge (`current`, as in `/api/session`) and how many calls of the transcripts still there named a
    possible secret location, by severity (counts only, never the paths), from the same readers, so a card costs what
    its transcripts added since. Without `[secrets]` patterns it reads no transcript.
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
- **Desktop notifications** (`notify.py`, serve only; on unless `[notify] enabled = false`):
  - A watcher thread (`notify.Watcher`) looks every `WATCH_INTERVAL` (the scan's 5 s throttle) also while no page is
    open, since the page stops polling in a hidden tab: `app.live()` without a range, then `app.session_state` per
    session. It never holds `app.lock` itself (both take it), starts after the first scan with its first pass one
    interval later, and stops first at shutdown, before the readers and the store close. A failed session keeps its
    marks, and each distinct error goes to stderr once.
  - What notifies (`Memory`, the latest `MEMORY_LIMIT` sessions): a wait other than the last one notified (the live
    card's speech bubble or padlock), a secret level above the highest notified (`secret_level`, the black hat's
    medium and high), and each compact state once per stretch between compactions (`compact_states`: hint, cold,
    soon, close, unlikely or pays, the trash compactor's; a new `last_compaction` starts again), the user's choice
    over every change, since Soon and Close take turns as the estimate moves. The first pass only notes the states, so
    a start sends no burst. `compact_states` ports `liveCompactBadge`, whose `states` a test holds it to.
  - The texts hold the session's title (else its project folder, else its id's start), tool names and counts, never
    a prompt or a path: the system keeps them in its notification history.
  - The notifier (`detect`, paths only, nothing run but WSL's `wslpath`): `[notify] command` (its words with
    `{title}`, `{body}` and `{icon}`, the icon's path, replaced, one `re.sub` each, no shell); macOS osascript (the
    texts as `argv`, one starting with `-` behind a space; no icon, and it shows as Script Editor); Windows and WSL
    with interop on (`WSLInterop` in binfmt_misc) a toast from Windows PowerShell 5.1 (pwsh 7 can't load its WinRT
    types so), the texts as base64 of UTF-8 inside an `-EncodedCommand` script (curly quotes end a PowerShell text),
    a pass in one run since it starts in a second or two; else notify-send with `--icon`, the body's `& < >` escaped,
    on `DBUS_SESSION_BUS_ADDRESS` or the user's bus socket, else unavailable (D-Bus would start a bus that shows
    nothing and still succeed).
  - The toasts are `claude-usage`'s own (the user's choice): each run registers `APP_ID` under
    `HKCU\Software\Classes\AppUserModelId` (`DisplayName`, `IconUri`; no admin), which Windows names and lists in its
    notification settings (checked 2026-09-29 on Windows 11 26200, no Start-menu shortcut needed); where that fails,
    PowerShell's app id. Each shows its kind's icon as `appLogoOverride` (`ToastGeneric`), copied once into
    `%LOCALAPPDATA%\claude-usage\icons` under a name with its hash (`icon_file`), since a toast shows local images
    only; the source is the package's folder as Windows sees it (`wslpath -w` on WSL). A failed copy or registration
    costs only the icon or the name.
  - The icons (`icons/*.png`, `ICON_NAMES`): the live cards' `LIVE_ICONS` and a bar chart for the app, white on their
    tone's color from the light theme (`--series-1` waiting, `--gain-text`, `--hint-warning-edge`,
    `--hint-critical-edge`, `--text-secondary`; white on each ≥ 3:1), 96 px with 20 px corners, the glyph 64 px:
    rendered once in a browser (the page's `LIVE_ICONS` drawn on a canvas). Render them again when an icon or one of
    those colors changes. A compact state takes its tone's icon (`COMPACT_ICONS`: cold as soon, hint and pays
    neutral).
  - On WSL PowerShell runs from the C: drive's mount (`windows_drive`), so no `\\wsl.localhost` folder is handed to
    it, and with a live interop socket (`interop_socket`, per send): `make start` detaches serve, and the terminal's
    socket goes when it closes; init's `1_interop` outlives it. PowerShell comes from PATH, else the C: drive.
  - A `Sender` thread runs each pass (`SEND_TIMEOUT`, a bounded queue); failure is judged by the exit code only,
    since PowerShell writes to stderr as it succeeds. Where none is found, serve warns before the link; that reason or
    the first failure goes into `/api/live` as `notifications_unavailable`, which the live sessions note.
    `claude-usage notify-test` (`make notify-test`) shows one at once and names the method. A notification can't
    open the dashboard; the systems differ too much.
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
  - The live sessions follow the range shown: both requests carry it (`rangeQuery`), a new range loads both at once
    (`loadRange`), and the server cuts both to the retention (`UsageApp.date_range`). `/api/live` then keeps the
    live sessions active in the range (`queries.live_sessions` with since and until): with usage in it, as the
    sessions list counts them, else by their last activity (a session without a reply yet). So a past day shows
    only the running sessions that were active on it, and says so; without a range `/api/live` lists every one.
  - A session waiting for the user (`queries.waiting_calls`) stays on the live list past the window until it is
    answered, however long ago it asked, unless its transcript made an API call after it (the session moved on; the
    user's choice over a time limit): a call of `WAITING_TOOLS` without a result (kind `question`), or another call
    without one that a permission prompt asks about (kind `permission`). `/api/live` gives it as `waiting` (kind,
    tool, since when, the subagent's type), the card shows it first by the title (`liveWaitBadge`, in `--series-1`:
    nothing is wrong): a speech bubble with a question mark, or a padlock, described on hover; the heading adds "or
    waiting for you".
    - An open session's view hides the live list, so a notice under its heading (`showSessionWaits`, a status, in
      `--series-1`) shows what it waits for (`waiting` in `/api/session`, from the same `waiting_calls`) and what the
      other live sessions wait for (the latest `/api/live`), each linked; drawn again only where it changed. A wait
      makes the session `live`, so its view keeps polling every 5 s, and a live answer that sees the open session's
      wait change asks for it at once (`waitChanged`), unless another session is loading (`sessionShown`).
  - Permission prompts come from a `PermissionRequest` hook that posts Claude Code's hook input to the running
    dashboard over a Unix socket, `permission.sock` next to the store (`server.open_prompt_socket`, the user's choice
    over a file next to the store and over a TCP route without the token), so it works the same for a checkout and an
    installed copy, and a prompt while no dashboard runs, which nothing would show, is dropped. The socket is its
    owner's alone (created 0600 under `PRIVATE_SOCKET_UMASK`, in the store's folder; Linux lets only who may write it
    connect), no browser reaches it, and its handler (`PromptHandler`) takes only a POST to `PROMPT_PATH`, up to
    `PROMPT_BODY_LIMIT` (16 MB: the input holds the whole call, a Write with its file's text), answering 204 without
    data; the TCP port takes no POST. `serve` opens it before any other thread starts, takes over a socket file a
    stopped dashboard left, leaves one another dashboard listens on, and removes its own at stop. Where it can't (no
    Unix sockets on Windows, a folder that takes none, a path too long), it warns before the link and `/api/live`
    gives `prompts_unavailable`, which the live sessions note; Claude Code's own dialogs are unaffected. The server
    keeps session, agent id, tool (as the store names it), mode and time (`permissions.prompt_of`, at `utc_now`) of
    the `PROMPT_LIMIT` (500) latest prompts, in memory only, never the call's input; a restart forgets them. A prompt
    belongs to the latest call of its tool in its transcript (session and agent) from `PROMPT_SLACK` (1 s) before it
    up to that transcript's next call of the tool (`queries.prompt_for`); two calls of one tool at once can't be told
    apart. `claude-usage hook-settings` (`make hook-line`) prints the settings block: `curl --unix-socket` in the
    background (`async`), at most 2 s, `|| true` so a stopped dashboard is quietly ignored, for
    `~/.claude/settings.json` or a project's `.claude/settings.local.json`, and never into a project's committed
    `.claude/settings.json`, which would run it for everyone working on the project. Without the hook a permission
    prompt looks like a command still running (a call without a result) and isn't shown.
  - A session also stays live for `[serve] agent_live_minutes` (180) after its last change while one of its agents
    is at work (`queries.busy_agents`: a subagent or workflow agent in a call without a result, or with a result
    after its last reply unless it was `StructuredOutput`'s), since an agent in a long command or reply leaves every
    transcript quiet (3 gaps of 7 to 15 minutes in real data, each with an agent busy so), and a run stopped
    midway leaves its agents busy for good. The card lists those agents, the heading names the minutes. The main
    thread's own calls don't count (the user's choice: 7 of 55 main threads ended in a call).
  - Each live card's state comes from `/api/session/<id>/state`, asked for after every live answer and not awaited
    (`loadLiveStates`: one request per session at a time, a failed one keeps what is shown), and is kept by session
    (`liveStates`), so a redrawn list shows it at once. It shows as small icons right of the title (`LIVE_ICONS`,
    in currentColor, faintly glowing in the gimmick themes), each described on hover and to screen readers
    (`title`, `aria-label`) and colored as the session view's marks (`--gain-text`, `--hint-warning-edge`,
    `--hint-critical-edge`, else `--text-secondary`; each ≥ 3:1 on the card in every theme). `liveStateBadges`
    picks them: an agent in a black hat for a possible secret access, first and only from medium up (`secretTone`'s
    warning and alert: high where one was sent out), then a trash compactor for compacting now, in `payoffTone`'s
    tone with `PAYOFF_WORDS` where it has a break-even, what it saves at once where `compactCallKind` is cold, and
    past the compact hint. None where compacting would never pay off, or only once the context has grown (`later`),
    and without calls ahead to compare with, where it doesn't pay off within the longest finished stretch
    (`calls_after_high`): right after a compaction the small context puts the break-even far off, or out of reach
    at the median estimate, which said nothing worth a notification.
    A card's icons are drawn again only where they changed, which a cache expiring does too.
  - An open session polls too: every 5 s while it is `live` (a transcript changed within `live_minutes`, or waiting
    for the user), else every 60 s, which notices a resumed session. A changed one is drawn in place
    (`renderDrilldown(detail, true)`):
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
  - Under the gauge the exact parts are a muted note; the estimate (`compact-estimate`) is full-size text in
    `--text-secondary` under a `--border` hairline, its pay-off phrase bold in `--text-primary` after a mark by
    `payoffTone` against `calls_ahead`: `soon` within half of them (`--gain-text`), `close` within them
    (`--hint-warning-edge`); else `later` where it would once the context has grown (`pays_later_in`: too early,
    not too late; `--text-secondary`, and "would not pay off yet" rather than "never" below what compacting
    leaves), `unlikely` past them or never (`--hint-critical-edge`); once the cache has expired by the cold
    break-even, at once being soon. Words after it ("Soon:", "Close:", "Likely too late:" with the replies
    ahead, "Not yet:" with the replies and the context by then) carry the tone, not the mark's color. It calls
    for nothing: replayed on the stored sessions (38 main threads, 2026-09-29, counts only), heeding a warm hint
    below the threshold on top of it added at best $0.03, and lost with 10K re-read after compacting.
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
    get the `off-page` class, since a workflow run's switch uses `hidden`. The live sessions' cards page the same way
    (`paged-cards` in a `paged-wrap`, each card a group, "sessions 1–10 of 300"), most recent first like the sessions
    list: by the last record's time, then the mtime (`queries.live_sessions`; a copied transcript has a new mtime).
    Each card and subagent shows that time (`queries.activity_time`: the last record's, else the mtime); only
    whether a session is live goes by the mtime.
    Once a draw is in the page, the pagers it replaced are let go (`forgetDetachedPagers`), since a list drawn every
    5 s would keep each old draw.
  - The sessions list holds every session of the range, newest first (`sessions` in `/api/summary`, only
    `server.SESSION_LIST_FIELDS`, about 250 bytes each; the costliest keep their parts), so no older session is cut
    without a word. Each carries what it used in the range (`queries.recent_sessions`: totals, turns, the subagents that
    made calls in it and the main thread's context), so a session over several days splits across them, and the list and
    the costliest add up to the range's total; the session view shows it whole. A project picker (the range's projects
    by name, with their sessions; a picked one stays on offer in a range without it) and a text filter (every word, in
    any case, in the title, project or id: `sessionMatches`) narrow it, counted as "12 of 84 sessions". The controls are
    markup outside what a redraw replaces, so a refresh keeps the filter and typing keeps its focus; a new filter starts
    at the first page, and the pager joins the heading past them (`table-filters`).
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
