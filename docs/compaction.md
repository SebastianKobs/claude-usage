# When compacting pays off

[← Back to the README](../README.md)

This page explains how the dashboard estimates whether `/compact` would save money, and where the page shows it.

> [!NOTE]
> All amounts are at API list prices, as if you paid per token. On a subscription they show where your limits go.

- [The idea in three steps](#the-idea-in-three-steps)
- [A worked example](#a-worked-example)
- [Where the numbers come from](#where-the-numbers-come-from)
- [Breaks](#breaks)
- [What it can't know](#what-it-cant-know)
- [Afterwards](#afterwards)
- [Where the page shows it](#where-the-page-shows-it)

## The idea in three steps

1. **Every reply re-reads the whole conversation.** Claude has no memory between replies: each one sends everything
   said so far again. Most of it comes from the prompt cache, which is cheap, but you pay for it on every single reply.
   A long conversation costs a little more with each reply, forever.
2. **Compacting costs once.** `/compact` has Claude write a summary and start again from it. The summary call reads the
   conversation one last time and writes the summary, and the next reply has to put the new, shorter start into the
   cache.
3. **Then every reply is cheaper.** From then on each reply re-reads the short version instead of the long one. The
   **break-even** is the number of replies after which these small savings have covered the one-time cost.

## A worked example

Opus 5.5, with cache reads at $0.20 per million tokens:

| Step | Amount |
|---|---|
| The conversation holds 300K tokens, so every reply re-reads it for | about $0.06 |
| Compacting would shrink it to about 50K. Each reply then re-reads 250K less and saves | about $0.05 |
| Compacting costs once (the summary, plus caching the new start) | about $0.40 |
| Break-even: $0.40 ÷ $0.05 | **8 replies** |

After about 8 replies compacting has paid for itself, and every reply after that is profit. After your past
compactions you went on for 25 replies on average. 8 is less than 25, so compacting now would likely save money, and
the conversation says so at that reply.

## Where the numbers come from

The 300K and the $0.06 are exact: they are your last call. The rest is learnt from your stored compactions:

- how big the context was right after them: the summary plus what Claude Code sends every time (the system prompt,
  tools and CLAUDE.md);
- how long the summaries took;
- how many replies followed until the next compaction.

That is why each figure comes with a range, and why there is no estimate before your first compaction. Once the
current stretch has run a while, it is compared only with the past stretches that lasted at least that long, if there
are enough of them.

## Breaks

The cache forgets a conversation after 5 minutes without a reply, or after an hour where Claude Code pays for the
longer cache. The first reply after that writes the whole conversation into the cache again, at up to 40 times the
read price: about $1.50 for the 300K above, against about $0.25 for the compacted 50K.

- **Compacting right before a longer break pays off at once.** The page gives the time the cache runs out, and what
  compacting before then saves.
- **Once the cache has expired**, compacting still saves at once if the summary costs less than rewriting everything.

## What it can't know

- **How many replies you will make.** The average of your past stretches is a guess, not a promise. Guessing too long
  loses at most the one-time cost; guessing too short misses a saving on every reply.
- **Which files Claude has to read again after compacting**, since they were in the old conversation. The
  transcripts don't keep tool inputs, so this isn't counted. The compactions table gives how many re-read tokens would
  cancel a saving.
- **The summary's exact size.** It isn't in any transcript, so it is estimated from how long the compaction took.

## Afterwards

Each past compaction is checked against keeping the context: the same later replies, each carrying the longer
conversation. It shows what compacting cost once, what each later reply saved, and the reply at which it paid off:

- saved, in green (▲ +$);
- cost more, in red (▼ −$);
- the latest one, while it is still behind, as its loss so far.

## Where the page shows it

| Where | What it shows |
|---|---|
| The [gauge](session-view.md#the-context-gauge) in the session view | What each reply re-reads, when the cache runs out, what compacting now would cost, and after how many replies it would pay off |
| The [callout](session-view.md#the-call-to-compact) above it | A button that copies `/compact`, once the cache has expired and compacting saves at once, and whenever the context is past your compact hint |
| The [conversation](session-view.md#the-conversation) | A warning at the reply where compacting started to pay, sterner than the 200K hint |
| The [compactions table](session-view.md#compactions) and each compaction marker in the conversation | How each past compaction worked out; the table's heading gives the total |
| The Estimated cost tile, in the session view and on the overview | What compacting saved so far, all added up |
