# claude-usage

Token usage of Claude Code across all projects on this machine: a SQLite history of what the transcripts held,
and a local dashboard (127.0.0.1 only) with live sessions, totals by day, model, agent type and project, a
per-session drilldown and estimated cost. The history keeps 30 days by default, as Claude Code keeps its
transcripts; set `retention_days` to 90 or 365 (or 0 for everything) to keep usage past their cleanup.

Usage is split by model and effort level. Calls made while ultracode was on count as a level of their own,
`ultracode`, hatched in the chart: Claude Code notes ultracode only on your prompts, so a call counts if it ran at
xhigh between switching ultracode on and switching it off or picking another effort level. Subagents and Workflow
agents count by that time too.

Tables longer than 10 rows come in pages, with 10, 25 or 50 rows per page (the choice is remembered) and
previous and next below them; a refresh stays on the page you are reading.

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

## Updating
```
make backup FILE=~/backups/usage-$(date +%F).sqlite   # optional; the store may hold days Claude Code deleted
git pull --recurse-submodules
make restart                                          # the running dashboard picks up the new code
```
Installed with pip, run `pip install .` again in the updated checkout and restart `claude-usage serve`. The store
updates itself on the next start or scan: migrations only add tables and columns, so no history is lost. Some
updates need data only a new read gives; then the next scan reads every transcript again, which takes a little
longer once. An open dashboard tab needs a reload for the new page.

## The session view
Click a session to open it. While the session is running the view updates itself every few seconds, the
conversation too, without closing what you opened. Besides its cost, time and tables, it shows what its context
holds:
- the main thread's latest context against the auto-compact point, with the compact hint marked, the turns since
  the last compaction and an estimate of the turns left at the recent pace. Below it, what compacting now would
  cost: what each call re-reads, until when the cache stays warm and what keeping costs after that, and from your
  stored compactions after how many replies compacting would pay off. While the session runs, a callout above it
  says in plain words when to compact, with a button that copies `/compact`: once the cache has expired and
  compacting saves at once, and once the context has passed your compact hint (200K by default), whatever the
  estimate says, since how many replies still follow can't be predicted. Replayed on stored sessions, compacting
  past the hint saved by far the most; an earlier call where compacting likely pays added next to nothing;
- the context per turn as cache read, cache write and new input, with each `/compact` or auto-compact as a rule;
  the picker switches between the main thread and its subagents;
- for that transcript, the fixed overhead (the first call's context, which every later call reads again), the
  cache rebuilds and what they cost extra, the compactions, and the turns that grew the context most with the
  tools the call before ran;
- per subagent, what it returned to the main thread; a Workflow run's agents under one row per run;
- each compaction against keeping the context: what it cost once, what each later call saved, the call at which it
  paid off, and whether it saved (green) or cost more (red), at API list prices with the summary call estimated. The
  table's heading adds them up. The conversation shows the same at each compaction marker, and the Estimated cost
  tile, here and on the overview, what compacting saved so far;
- the conversation, on request, in its own frame right after the agents while its transcript still exists (the tools
  table then moves to the end), with Close to put it away again: newest first, or in the transcript's order with the
  arrow (down: newest first, up: oldest first). It hints at compacting where the context passes 200K, warns more
  sternly where compacting now would pay for itself within the replies that, going by your past compactions, you
  make on average before the next one, and most sternly near the auto-compact point.

## How the compaction estimate works
All amounts are at API list prices, as if you paid per token; on a subscription they show where your limits go.

**Every reply re-reads the whole conversation.** Claude has no memory between replies: each one sends everything
said so far again. Most of it comes from the prompt cache, which is cheap, but you pay for it on every single reply.
A long conversation costs a little more with each reply, forever.

**Compacting costs once.** `/compact` has Claude write a summary and starts again from it. That costs once: the
summary call reads the conversation one last time and writes the summary, and the next reply has to put the new,
shorter start into the cache.

**Then every reply is cheaper.** From then on each reply re-reads the short version instead of the long one. The
break-even is the number of replies after which these small savings have covered the one-time cost.

**A worked example** (Opus 5.5, cache reads at $0.20 per million tokens):
- The conversation holds 300K tokens, so every reply re-reads it for about $0.06.
- Compacting would shrink it to about 50K. Each reply then re-reads 250K less and saves about $0.05.
- Compacting costs about $0.40 once (the summary plus caching the new start).
- $0.40 ÷ $0.05 = 8: after about 8 replies compacting has paid for itself; every reply after that is profit.
- After your past compactions you went on for 25 replies on average. 8 is less than 25, so compacting now would
  likely save money, and the conversation says so at that reply.

**Where the numbers come from.** The 300K and the $0.06 are exact: they are your last call. The rest is learnt from
your stored compactions: how big the context was right after them (the summary plus what Claude Code sends every
time: the system prompt, tools and CLAUDE.md), how long the summaries took, and how many replies followed until the
next compaction. That is why each figure comes with a range, and why there is no estimate before your first
compaction. Once the current stretch has run a while, it is compared only with the past stretches that lasted at
least that long, if there are enough of them.

**Breaks.** The cache forgets a conversation after 5 minutes without a reply (an hour, where Claude Code pays for
the longer cache). The first reply after that writes the whole conversation into the cache again, at up to 40 times
the read price: about $1.50 for the 300K above, against about $0.25 for the compacted 50K. So compacting right
before a longer break pays off at once, and the page gives the time the cache runs out and what that saves. Once
the cache has expired, compacting still saves at once if the summary costs less than rewriting everything.

**What it can't know.**
- How many replies you will make: the average of your past stretches is a guess, not a promise. Guessing too long
  loses at most the one-time cost; guessing too short misses a saving on every reply.
- Which files Claude has to read again after compacting, since they were in the old conversation. The transcripts
  don't keep tool inputs, so this isn't counted; the compactions table gives how many re-read tokens would cancel a
  saving.
- The summary's exact size: it isn't in any transcript, so it is estimated from how long the compaction took.

**Afterwards.** Each past compaction is checked against keeping the context: the same later replies, each carrying
the longer conversation. It shows what compacting cost once, what each later reply saved and the reply at which it
paid off: saved in green, cost more in red, and the latest one, while it is still behind, as its loss so far.

**Where the page shows it.**
- The gauge in the session view: what each reply re-reads, when the cache runs out, and what compacting now would
  cost and after how many replies it would pay off.
- The callout above it, with a button that copies `/compact`, once the cache has expired and compacting saves at
  once, and whenever the context is past your compact hint.
- The conversation: a warning at the reply where compacting started to pay, sterner than the 200K hint.
- The compactions table and the marker at each compaction in the conversation: how each past one worked out,
  and the table's heading the total.
- The Estimated cost tile, in the session view and on the overview: what compacting saved so far, all added up.

## Keeping the history safe
After each scan, sessions whose last activity is older than `retention_days` are deleted from the store; the
dashboard offers no range longer than that. Lowering it deletes the older sessions at the next scan. SQLite reuses
the freed space rather than shrinking the file; `make backup` writes a compacted copy.

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
| `retention_days` | days of history kept: 7, 30 (default), 90 or 365, or 0 for everything |
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
