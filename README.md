# claude-usage

Token usage of Claude Code across all projects on this machine: a persistent SQLite history that outlives the
transcripts Claude Code deletes after its cleanup period, and a local dashboard (127.0.0.1 only) with live
sessions, totals by day, model, agent type and project, a per-session drilldown and estimated cost.

Python ≥ 3.12, standard library only; nothing to install.

## Usage
```
make start                     # dashboard on http://127.0.0.1:8765 in the background (PORT=, LIVE_MINUTES=)
make status | stop | restart | logs
make scan                      # read new transcript data into data/usage.sqlite
make report ARGS="--days 7 --by project"
make session ID=<session-id>   # one session: main thread, subagents, background, tools
make test                      # the app's and the guard hook's tests
make help                      # everything else
```

The same without make:
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
`config.toml` holds the defaults (transcript folder, store path, port, prices). Put local changes in
`config.local.toml`, which is gitignored.

## Privacy
The store keeps token counts, model names, tool names and result sizes, session titles and project paths. It never
stores prompt text; the drilldown reads the first prompt from the transcript while that still exists.

## Development
See `CLAUDE.md` for the working rules and `todo.md` for the spec and plan.
