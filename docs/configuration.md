# Configuration and storage

[← Back to the README](../README.md)

Where claude-usage reads and writes, every setting, how long it keeps your history, and how to update it.

- [Config files](#config-files)
- [Settings](#settings)
- [Where the files live](#where-the-files-live)
- [CLAUDE_CONFIG_DIR](#claude_config_dir)
- [Retention and backups](#retention-and-backups)
- [Updating](#updating)

## Config files

The defaults ship with the package in [`claude_usage/config.toml`](../claude_usage/config.toml), with comments on
what they do. To change any of them, put just those keys into `~/.config/claude-usage/config.toml`. In a source checkout,
`config.local.toml` (gitignored) is read after that.

- Tables are merged key by key, so an override can change a single price.
- An unknown key is an error, so a typo never silently leaves a default in place.
- `--store` and `--projects-dir` on the command line override the config.

## Settings

| Key | What it sets |
|---|---|
| `projects_dir`, `store` | Claude Code's transcripts, and the SQLite history |
| `retention_days` | The days of history kept: 7, 30 (the default), 90 or 365, or 0 for everything |
| `[serve]` `port`, `live_minutes` | The dashboard's port (8765); how many minutes (5) a session counts as live |
| `[serve]` `agent_live_minutes` | How many minutes (180) a session stays live while one of its agents is at work |
| `[prices."<model prefix>"]` | $ per million tokens; the longest matching prefix wins. `prices_checked` dates them |
| `[fees]` `web_search_per_1000` | The flat web-search fee |
| `[chat]` | When the session view hints at compacting (a heuristic threshold, and reminder steps) and at delegating exploration |
| `[auto_compact]` | Where Claude Code auto-compacts, by model prefix; `default` for your `autoCompactWindow` |
| `[secrets]` `patterns` | Where secrets may be, for the session view's warning. `!` exempts a path; an override replaces the whole list |
| `[secrets]` `network_programs` | The programs that send what they get elsewhere (MCP tools always do); an override replaces the whole list |
| `[secrets]` `test_patterns` | What marks a call as a test, whose returned result then counts less; an override replaces the whole list |
| `[notify]` `enabled`, `command` | Desktop notifications on (the default) or off, and a program to show them instead |

A minimal override:

```toml
# ~/.config/claude-usage/config.toml
retention_days = 365

[serve]
port = 8800

[notify]
enabled = false
```

## Where the files live

| | Running from a checkout | Installed |
|---|---|---|
| The store | `data/usage.sqlite` | `~/.local/share/claude-usage/usage.sqlite` |
| Your config | `~/.config/claude-usage/config.toml`, then `config.local.toml` | `~/.config/claude-usage/config.toml` |
| The transcripts read | `~/.claude/projects` | `~/.claude/projects` |

`$XDG_DATA_HOME` and `$XDG_CONFIG_HOME` are respected. The transcripts come from `$CLAUDE_CONFIG_DIR/projects` when
that is set, as Claude Code does, and a `projects_dir` in a config file wins over both.

## CLAUDE_CONFIG_DIR

`CLAUDE_CONFIG_DIR` counts only where the dashboard's own process has it.

> [!IMPORTANT]
> If you set it only for Claude Code (in an alias, your editor's settings or Claude Code's `settings.json`), neither
> `make start` nor cron sees it. Set `projects_dir` instead.

One projects folder is read. For a second config folder, keep a second store with `--projects-dir` and `--store`.

## Retention and backups

After each scan, sessions whose last activity is older than `retention_days` are deleted from the store. The
dashboard offers no range longer than that. Lowering the value deletes the older sessions at the next scan. Rows go
only by this setting: a session stays even after Claude Code has deleted its transcript.

SQLite reuses the freed space rather than shrinking the file. `make backup` writes a compacted copy.

> [!WARNING]
> In a checkout the store is `data/usage.sqlite`, inside the working tree. `git clean -fdx` deletes it, and with it
> every day that Claude Code has already removed from its transcripts. Back it up outside the checkout now and then,
> or point `store` at a folder outside it.

```bash
make backup FILE=~/backups/usage-$(date +%F).sqlite   # or: claude-usage backup FILE
```

A backup never overwrites an existing file.

## Updating

From a checkout:

```bash
make backup FILE=~/backups/usage-$(date +%F).sqlite   # optional; the store may hold days Claude Code deleted
git pull --recurse-submodules
make restart                                          # the running dashboard picks up the new code
```

Installed with pip or pipx, run `pip install .` (or `pipx install --force .`) again in the updated checkout, and
restart `claude-usage serve`.

- **The store updates itself** on the next start or scan. Migrations only add tables and columns, so no history is
  lost.
- **Some updates need data only a new read gives.** Then the next scan reads every transcript again, which takes a
  little longer once.
- **The restarted dashboard has a new token:** open the link it prints.
