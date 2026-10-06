<!--
@component
The cost, input, turns and output tiles of a usage total: a range's on the overview, a session's in its view. `scope`
says whose ("last 7 days", "this session"); `context` and `hintTokens` are the input tile's context note; `savings` is
what the main threads' compactions saved against keeping the context, null without any.
-->
<script lang="ts">
  import type { CompactionSavings, ContextStats, Usage } from '../api/api';
  import { getApp } from '../app/app.svelte';
  import { compact, money, whole } from '../ui/format';
  import { costNotes, savingsNote } from './tiles';
  import InputSplit from './InputSplit.svelte';
  import StatTile from './StatTile.svelte';

  let {
    totals,
    scope,
    context,
    hintTokens,
    savings,
  }: {
    totals: Usage;
    scope: string;
    context: ContextStats | null;
    hintTokens: number;
    savings: CompactionSavings | null;
  } = $props();

  const { hype } = getApp();

  const saved = $derived(savings ? savingsNote(savings) : null);
</script>

<div class="card">
  <div class="label"><span>{hype('Estimated cost')}</span>, {scope}</div>
  <div class="hero">{money(totals.cost)}</div>
  <div class="note">{costNotes(totals)}</div>
  {#if saved}
    <div class="note" title={saved.title}>
      {#if saved.verdict}
        <div class={saved.verdict === 'gain' ? 'verdict-gain' : 'verdict-loss'}>{saved.amount}</div>
        <div>{saved.count}</div>
      {:else}
        {saved.count}
      {/if}
    </div>
  {/if}
</div>
<InputSplit {totals} {context} {hintTokens} />
<StatTile label="Turns" value={whole(totals.turns)} note="API calls with usage" themedNote />
<StatTile label="Output tokens" value={compact(totals.output)} note={money(totals.cost_parts.output)} />
