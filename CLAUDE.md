# claude-usage

Local dashboard and persistent SQLite history for Claude Code token usage, across all projects on this machine.
Claude Code deletes transcripts after its cleanup period (30 days by default); the store keeps what they held.

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
  first prompt, and the conversation (`transcripts.conversation`), from the transcript on demand.
  `last-prompt.lastPrompt` and `queue-operation.content` hold prompt text too; never store them either.
- **Keep the history:** never delete rows because a transcript is gone.
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
  config.py                  defaults in the package, user and checkout overrides, data folder
  config.toml                the defaults, including prices (shipped with the package)
  transcripts.py             parser: reads a transcript from a byte offset into a Chunk
  store.py                   SQLite history: incremental scan, background usage, queries
  pricing.py                 prices by model prefix, cost per category, web-search fee
  server.py                  loopback-only http.server + JSON API
  static/                    the page: vanilla JS, inline SVG, no external resources (three vendored libraries)
    dashboard.html           the markup only
    css/common.css           layout and components, for every theme
    css/themes/              one file per theme (light, dark, hacker, startup, rgb), fun.css what the gimmicks share
    js/                      classic scripts sharing one scope, loaded in order: util, state, figures, charts,
                             tables, limits, highlight.js, marked, DOMPurify, chat, drilldown, themes, main
                             (calls setup())
      vendor/                highlight.js 11.11.2 (common build, BSD-3), marked 18.0.14 (UMD, MIT), DOMPurify
                             3.4.16 (MPL-2.0 or Apache-2.0), each with its license
tests/                       helpers.py (projects-folder and transcript builders) and one test file per module
.claude/hooks/project-guard/  the guard hook: a git submodule, see its README and CLAUDE.md
```

## Transcript format
Checked against real data (145 transcripts, 2026-09-27); the parser relies on these facts.
- **Files:** `~/.claude/projects/<slug>/`, `<slug>` = the project path with every non-alphanumeric character
  replaced by `-`.
  - `<session-id>.jsonl` is the main thread.
  - `<session-id>/subagents/agent-<id>.jsonl` plus `agent-<id>.meta.json` is a subagent. The meta file holds
    `agentType`, `description`, `toolUseId`, `spawnDepth` and `parentAgentId`. It is often without `model`, and
    may be missing, in which case the type is `?`.
  - `tool-results/`, `memory/` and anything else: ignore.
  - Paths sort a session's `subagents/` before its main file.
- **Records:** one JSON object per line. Skip unreadable lines (also nested too deeply to decode) and non-objects.
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
- **Edits:** the user record of an Edit's or a Write's result carries `toolUseResult`: `structuredPatch` hunks
  whose `lines` start with `+`, `-` or a space, or for a new file `type: "create"` with `content`. Count the lines,
  never keep them. Counted this way, lines match `totalLinesAdded`/`Removed` for most sessions.
- **Effort:** assistant records carry `effort` (`medium`, `high`, `max`, …), the same on every record of a message
  id. `perTurnEffort` is often null; ignore it.
- **Attribution:** assistant records may carry `attributionSkill`, and `attributionMcpServer` with
  `attributionMcpTool` (the bare tool name). All records of a message id carry the same values.
- **Tools:** `tool_use` blocks (`id`, `name`) and `tool_result` blocks in user records (`tool_use_id`, `content` as
  a string or blocks: count only `text` blocks). A result can come in a later read than its call. Show
  `mcp__<server>__<tool>` as `<server>.<tool>`.
- **Prompt:** the first line of the first user record that isn't `isMeta`, `isCompactSummary` or a tool result.
  **Project:** the first `cwd`, else the slug. Many main transcripts start with a record without `cwd`.
- **Background calls** (Haiku for titles and classifiers, WebSearch) are in no transcript. They appear only in
  `cost-state` records.
  - When Claude Code writes one: when its process ends. The record has no timestamp; the record before it marks
    the snapshot time.
  - `startTime` is the process start; the snapshot covers only that process's run.
  - Checked 2026-09-27 (161 transcripts): repeated cost-states in a main file share one `startTime` and their
    totals only grow, and no message id appears in two files. Keeping one cost-state per session and letting the
    first file scanned own an id rest on that; re-check (counts only) if resumed or forked sessions change.
  - `modelUsage` has per-model `inputTokens`, `cacheCreationInputTokens` (no 5m/1h split),
    `cacheReadInputTokens`, `outputTokens`, `webSearchRequests` and `costUSD`. Model ids there may carry a `[1m]`
    suffix.
  - Run totals of the same process, integers: `totalDuration` (wall-clock), `totalAPIDuration` (retries included),
    `totalAPIDurationWithoutRetries`, `totalToolDuration` (all ms), `totalLinesAdded`, `totalLinesRemoved`.

## Design rules
- **Incremental scan** (`store.scan`):
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
- **Background usage:**
  - After each scan, per touched session and model: the latest snapshot minus the transcripts between the
    snapshot's `startTime` and its snapshot time, per category, never below 0. A file's transaction marks its
    session in `dirty_sessions`, so a scan that stops early leaves the recomputation to the next one.
  - It goes into `background`. The `usage_rows` view unites it with the messages as agent type `(background)`,
    without turns, filed under the snapshot's day.
- **Run totals:** the latest cost-state per session, filed under its snapshot day. The summary sums the sessions that
  ended in the range, and prices their whole usage for the cost per 100 lines changed.
  - Without a cost-state (a session still running, or a process that never exited), the session view estimates
    them from the store: first to last record, each reply's request (the last user record before it, carried
    across reads in `transcripts.last_user_ts`) to its last record, each tool call to its result, and the edited
    lines. The API and session times match the cost-state within a few percent. Tool time runs about 3× over,
    since it includes waiting for permission, so the page says so. Retries are unknown.
- **API errors:** one row per record uuid in `api_errors`, owned by the file that stored it first. The dashboard
  plots the rate limits in `--status-critical` with an icon and a label; other errors are only listed.
- **Compact hints** (`server.compact_hints`, per chat request, nothing stored):
  - A call's context is new input + cache writes + cache reads, like `CONTEXT` and Claude Code's `used_percentage`.
  - Anthropic publishes no "normal" context size; it only says quality degrades as the context fills
    (best-practices, context-windows docs). So `[chat] compact_hint_tokens` (200K, after Claude Code's
    `exceeds_200k_tokens`) is a heuristic, and the page says so.
  - The hard number is where Claude Code auto-compacts: about 967K on native 1M windows, 200K on 200K windows
    (code.claude.com/docs/en/model-config, checked 2026-09-27), in `[auto_compact]` by model prefix. It's
    user-changeable (`autoCompactWindow`), so `default` is configurable.
  - Two tiers, each announced once per stretch between compactions as a block with its advice, then reminded
    at milestones as a chip in the call's usage badge: soft every further `compact_reminder_step` of the
    threshold (1.5×, 2×, …), auto every further `auto_compact_reminder_step` of the auto-compact point (85 %,
    90 %, …). One hint per call, for the highest milestone passed; once the auto tier has spoken the soft tier is
    quiet.
  - The Input tokens tile shows the median and p90 context per main-thread turn (`store.context_stats`) to choose
    the threshold by.
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
    `pricing.py`, `[chat]`/`[auto_compact]` in `server.py`. Numbers must be finite.
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
  - `/api/session/<id>/chat[?agent=<id>]` reads the conversation from the transcript per request, with tool inputs
    and results cut to `CHAT_TOOL_LIMIT`. Each reply carries its effort level, and the last entry of each API call
    its final usage with the cost at the configured prices, both computed per request. Nothing of it is stored,
    which a test checks against the store files.
    Once Claude Code has deleted the file, it answers `available: false`.
- **Dashboard:**
  - The by-model chart stacks every model × effort combination (`day_model_effort`, `hour_model_effort`): the
    model's color for low or no effort, one shade further from the surface each for medium, high and max (xhigh
    shares max). `--shade-step-*` per slot and theme sizes the steps for a lightness gap of 0.065; re-run the
    `--ordinal` and contrast checks when a series color changes. Models are 4px apart in a column, shades 2px.
  - Load the `dataviz` skill before changing a chart, and run its palette validator for any new colors.
  - Categorical colors come from its validated palette in a fixed order per model; past eight slots a model folds
    into "Other".
  - Never a second y-axis: cost and tokens get aligned panels, or a metric switch.
  - Every chart has a legend, a table view and hover or focus tooltips.
  - The Daily range shows one day (today by default, earlier ones with the ‹ › arrows via `until`) and plots its
    local hours (`hour_model`, up to now for today) instead of a single point. The arrows skip days without
    usage (`previous_day`, `next_day`); › always reaches today.
  - All data goes into the DOM via `textContent`. Two exceptions, both in `chat.js`:
    - `highlighted()` inserts the HTML of highlight.js, which escapes the text it is given and only adds spans
      with classes.
    - `markdown()` inserts Claude's answers and the user's prompts (line breaks kept; a slash command shown as
      typed, a whole-JSON prompt highlighted) as marked's HTML after DOMPurify. That keeps only `MARKDOWN_TAGS` and
      `MARKDOWN_ATTRIBUTES`: no images, styles, forms or event attributes, and links only to http, https and
      mailto, opened with `noopener noreferrer`. Checked in jsdom against scripts, `onerror`, `javascript:` links
      and `<style>`.
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
