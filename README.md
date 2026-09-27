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
make backup FILE=<new file>    # a copy of the history
make test                      # the tests
make help                      # everything else
```

The same without make (or with `claude-usage` instead of `python3 -m claude_usage` once installed):
```
python3 -m claude_usage scan [--project PATH]
python3 -m claude_usage report --days 7       # totals as text (--json for JSON, --no-scan for the stored history)
python3 -m claude_usage report --session ID   # one session
python3 -m claude_usage serve                 # dashboard in the foreground, Ctrl+C to stop (--project PATH)
python3 -m claude_usage backup FILE           # a copy of the store; never overwrites
python3 -m claude_usage --version
```

To keep the history without the dashboard running, scan from cron. `make cron-line` prints the line for your
checkout, with the absolute interpreter path (cron's `python3` may be older than 3.12):
```
*/30 * * * * cd '/path/to/usage-inspector' && /usr/bin/python3 -m claude_usage scan >/dev/null
```
Errors go to stderr, so cron mails them.

## Keeping the history safe
In a checkout the store is `data/usage.sqlite`, inside the working tree: `git clean -fdx` deletes it, and with it
every day Claude Code has already removed from its transcripts. Back it up outside the checkout now and then
(`make backup FILE=~/backups/usage-$(date +%F).sqlite`), or point `store` at a folder outside it.

## Configuration
The defaults ship with the package in `claude_usage/config.toml`. To change any of them, put just those keys into
`~/.config/claude-usage/config.toml`. In a source checkout, `config.local.toml` (gitignored) is read after that.
Tables are merged key by key, so an override can change a single price. An unknown key is an error, so a typo
never silently leaves a default in place.

| Key | What it sets |
|---|---|
| `projects_dir`, `store` | Claude Code's transcripts, and the SQLite history |
| `[serve]` `port`, `live_minutes` | the dashboard's port; how many minutes a session counts as live |
| `[prices."<model prefix>"]` | $ per million tokens, longest matching prefix wins; `prices_checked` dates them |
| `[fees]` `web_search_per_1000` | the flat web-search fee |
| `[chat]` | when a session's conversation view hints at compacting (a heuristic threshold, and reminder steps) |
| `[auto_compact]` | where Claude Code auto-compacts, by model prefix; `default` for your `autoCompactWindow` |

The store is `data/usage.sqlite` when running from a checkout, and `~/.local/share/claude-usage/usage.sqlite` when
installed (`$XDG_DATA_HOME` and `$XDG_CONFIG_HOME` are respected). `--store` and `--projects-dir` override both.

## Privacy
The store keeps token counts, model names, tool names and result sizes, session titles and project paths. It never
stores prompt text. While a transcript still exists, the drilldown reads its first prompt, and on request the whole
conversation (prompts, replies, tool inputs and results, cut to a few thousand characters each), from the file for
that one request. The server answers only on loopback addresses and only to loopback host names.

## Development
See `CLAUDE.md` for the working rules, the style, the transcript format and the design rules.
