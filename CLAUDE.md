# claude-usage

Local dashboard and persistent SQLite history for Claude Code token usage, across all projects on this machine.
Claude Code deletes transcripts after its cleanup period (30 days by default); the store keeps what they held.

## Working rules
- **TDD:** write the test first, then the implementation.
- **Stdlib only:** Python ≥ 3.12, no dependencies (`sqlite3`, `http.server`, `json`, `tomllib`, `argparse`,
  `unittest`).
- **Tests:** `make test` runs both suites.
  - the app: `python3 -m unittest discover -s tests` (`make test-app`)
  - the guard hook: `python3 -m unittest discover -s .claude/hooks/project-guard/tests` (`make test-guard`)
- **The guard** (`.claude/hooks/project-guard/`) is a git submodule of
  github.com/SebastianKobs/claude-project-guard. Clone with `--recurse-submodules`, or run
  `git submodule update --init`.
- **Never read real transcripts in tests.** Tests build their own under `tests/.tmp/` (see `tests/helpers.py`) and
  pass temp paths via `--projects-dir` and `--store`. Real `~/.claude/projects` is only read to verify a change
  against real data, and only when the user asks. Print counts and totals then, never prompt or message text.
- **Never store prompt text:** only token counts, tool names and sizes, titles and metadata. The drilldown reads the
  first prompt from the transcript on demand. `last-prompt.lastPrompt` and `queue-operation.content` hold prompt
  text too; never store them either.
- **Keep the history:** never delete rows because a transcript is gone.
  - Schema migrations only add: new tables, or `ALTER TABLE … ADD COLUMN` via `ADDED_COLUMNS`.
  - A version bump may reset `read_offset` so the next scan reads every file again; the upserts make that
    idempotent.
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
  traceback, 2 bad arguments).
- **Files and docs:** `pathlib.Path` with `encoding="utf-8"`; a docstring on every function and class; comments
  explain why.
- **Tests:** stdlib `unittest`, one behaviour per test method, no type hints. Temp dirs go under `tests/.tmp/`,
  never real `~/.claude`. Test classes, `setUp` and `__init__` need no docstring; shared base cases do.

## Layout
```
Makefile                     start/stop/status of the dashboard, scan, report, session, test, clean, cron-line
claude_usage/
  __main__.py                CLI: scan | report | serve
  config.py                  defaults in the package, user and checkout overrides, data folder
  config.toml                the defaults, including prices (shipped with the package)
  transcripts.py             parser: reads a transcript from a byte offset into a Chunk
  store.py                   SQLite history: incremental scan, background usage, queries
  pricing.py                 prices by model prefix, cost per category, web-search fee
  server.py                  loopback-only http.server + JSON API
  static/                    the page: vanilla JS, inline SVG, no external resources
    dashboard.html           the markup only
    css/common.css           layout and components, for every theme
    css/themes/              one file per theme (light, dark, hacker, startup, rgb), fun.css what the gimmicks share
    js/                      classic scripts sharing one scope, loaded in order: util, state, figures, charts,
                             tables, drilldown, themes, main (calls setup())
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
- **Records:** one JSON object per line. Skip unreadable lines and non-objects.
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
  - `modelUsage` has per-model `inputTokens`, `cacheCreationInputTokens` (no 5m/1h split),
    `cacheReadInputTokens`, `outputTokens`, `webSearchRequests` and `costUSD`. Model ids there may carry a `[1m]`
    suffix.

## Design rules
- **Incremental scan** (`store.scan`):
  - An unchanged file (same size and mtime) is skipped; a grown one is read from `read_offset`, complete lines
    only.
  - A file below its offset, or with a new first-line hash, was rewritten and is read again from 0.
  - One transaction per file; WAL mode so a cron scan can run while the server reads.
- **Ownership:**
  - The file that stored a message id first owns it. Later reads of that file update its counters (the last
    usage wins); copies in forked or resumed sessions change nothing.
  - Tool calls and result sizes follow the same rule.
  - Message rows keep only the path; project, session and agent come from `transcripts`.
- **Background usage:**
  - After each scan, per touched session and model: the latest snapshot minus the transcripts between the
    snapshot's `startTime` and its snapshot time, per category, never below 0.
  - It goes into `background`. The `usage_rows` view unites it with the messages as agent type `(background)`,
    without turns, filed under the snapshot's day.
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
- **Server:**
  - It binds to loopback only, and refuses requests whose `Host` header isn't a loopback name. The API exposes
    titles and first prompts, so this blocks DNS rebinding.
  - The page is served with a strict CSP: no inline scripts or stylesheets, only style attributes. JSON is
    `no-store`.
  - Only files under `static/css` and `static/js` are served, a list fixed at start: a new one needs a restart.
  - Each request scans at most every 5 s, behind one lock.
- **Dashboard:**
  - Load the `dataviz` skill before changing a chart, and run its palette validator for any new colors.
  - Categorical colors come from its validated palette in a fixed order per model; past eight slots a model folds
    into "Other".
  - Never a second y-axis: cost and tokens get aligned panels, or a metric switch.
  - Every chart has a legend, a table view and hover or focus tooltips.
  - The Daily range shows one day (today by default, earlier ones with the ‹ › arrows via `until`) and plots its
    local hours (`hour_model`, up to now for today) instead of a single point. The arrows skip days without
    usage (`previous_day`, `next_day`); › always reaches today.
  - All data goes into the DOM via `textContent`.
  - Contrast in every theme: text ≥ 4.5:1, marks ≥ 3:1. Categorical slots 3–5 in light mode are the palette's
    documented exception; the legend and table view carry them.
  - The gimmick themes (terminal hacker, startup flex, RGB battlestation) keep the dark-mode series colors and stop
    animating under `prefers-reduced-motion`.
