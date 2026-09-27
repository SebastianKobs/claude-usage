# claude-usage

Local dashboard and persistent SQLite history for Claude Code token usage. The spec and the TDD plan are in
`todo.md`; tick off its steps as they are done.

## Working rules
- **TDD:** write the test first, then the implementation, one step of `todo.md` at a time.
- **Stdlib only:** Python ≥ 3.12, no dependencies (`sqlite3`, `http.server`, `json`, `tomllib`, `argparse`,
  `unittest`).
- **Tests:** `make test` runs both suites.
  - the app: `python3 -m unittest discover -s tests` (`make test-app`)
  - the guard hook: `python3 -m unittest discover -s .claude/tests` (`make test-guard`)
- **Never read real transcripts in tests.** Tests build their own under `tests/.tmp/` (see `tests/helpers.py`) and
  pass temp paths via `--projects-dir` and `--store`. Real `~/.claude/projects` is only read for the verification
  steps in `todo.md`, and only when the user asks.
- **Never store prompt text:** only token counts, tool names and sizes, titles and metadata.
- **Keep the history:** never delete rows because a transcript is gone; schema migrations only add.

## Style
The full list is in `todo.md` ("Style"). In short:
- PEP 8, max 120 columns, one import per line (stdlib, then local); f-strings only.
- Descriptive names; no one-line compound statements, `;`, assigned lambdas or backslash continuations.
- Type hints, `@dataclass(frozen=True)` for records, `pathlib.Path` with `encoding="utf-8"`.
- A docstring on every function and class; comments explain why.
- Library functions raise; only `main()` prints errors and picks the exit code.
- Tests: `unittest`, one behaviour per test method, no type hints.
