# claude-usage

Token usage of Claude Code across all projects on this machine: a persistent SQLite history that outlives the
transcripts Claude Code deletes after its cleanup period, and a local dashboard (127.0.0.1 only) with live
sessions, totals by day, model, agent type and project, a per-session drilldown and estimated cost.

Python ≥ 3.12, standard library only. Run it from the checkout as it is, or install it with `pip install .` to get
a `claude-usage` command.

## Usage
```
make start                     # dashboard on http://127.0.0.1:8765 in the background (PORT=, LIVE_MINUTES=)
make status | stop | restart | logs
make scan                      # read new transcript data into the store
make report ARGS="--days 7 --by project"
make session ID=<session-id>   # one session: main thread, subagents, background, tools
make test                      # the app's and the guard hook's tests
make help                      # everything else
```

The same without make (or with `claude-usage` instead of `python3 -m claude_usage` once installed):
```
python3 -m claude_usage scan
python3 -m claude_usage report --days 7       # totals as text (--json for JSON)
python3 -m claude_usage serve                 # dashboard in the foreground, Ctrl+C to stop
```

To keep the history without the dashboard running, scan from cron (`make cron-line` prints this line for your
checkout):
```
*/30 * * * * cd /path/to/usage-inspector && python3 -m claude_usage scan
```

## Configuration
The defaults ship with the package in `claude_usage/config.toml`: transcript folder, store, port, prices. To change
any of them, put just those keys into `~/.config/claude-usage/config.toml`. In a source checkout,
`config.local.toml` (gitignored) is read after that. Tables are merged key by key, so an override can change a
single price.

The store is `data/usage.sqlite` when running from a checkout, and `~/.local/share/claude-usage/usage.sqlite` when
installed (`$XDG_DATA_HOME` and `$XDG_CONFIG_HOME` are respected). `--store` and `--projects-dir` override both.

## Privacy
The store keeps token counts, model names, tool names and result sizes, session titles and project paths. It never
stores prompt text; the drilldown reads the first prompt from the transcript while that still exists.

## Development
See `CLAUDE.md` for the working rules, the style, the transcript format and the design rules.
