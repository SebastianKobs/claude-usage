# claude-usage

Token usage of Claude Code across all projects on this machine: a persistent SQLite history that outlives the
transcripts Claude Code deletes after its cleanup period, and a local dashboard (127.0.0.1 only) with live
sessions, totals by day, model, agent type and project, a per-session drilldown and estimated cost.

Python ≥ 3.12, standard library only; nothing to install.

## Usage
```
python3 -m claude_usage scan                  # read new transcript data into data/usage.sqlite
python3 -m claude_usage report --days 7       # totals as text (--json for JSON)
python3 -m claude_usage serve                 # dashboard on http://127.0.0.1:8765
```

To keep the history without the dashboard running, scan from cron:
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
