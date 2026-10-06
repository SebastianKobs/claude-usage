<!--
@component
The Input tokens tile: the total, a bar of its two parts (processed, and from cache) as two steps of one hue, a row
per part with its tokens, share and cost, and the context a main-thread turn read with the compact hint's threshold,
which a threshold can be chosen by. Null `context` or no turns leaves that note out.
-->
<script lang="ts">
  import type { ContextStats, Usage } from '../api/api';
  import { getApp } from '../app/app.svelte';
  import { inputTotal } from '../charts/charts';
  import { compact, money, percent } from '../ui/format';
  import { contextNote, splitDescription, splitSegments } from './tiles';
  import Swatch from '../ui/Swatch.svelte';

  let {
    totals,
    context,
    hintTokens,
  }: { totals: Usage; context: ContextStats | null; hintTokens: number } = $props();

  const { hype } = getApp();

  // what a compact hint threshold can be chosen by, said on hover
  const CONTEXT_TITLE =
    'The context a main-thread turn reads: new input, cache writes and reads. ' +
    'The conversation hints at compacting from the threshold on ([chat] compact_hint_tokens).';

  const input = $derived(inputTotal(totals));
  const segments = $derived(splitSegments(totals));
  const note = $derived(contextNote(context, hintTokens));
</script>

<div class="card">
  <div class="label">{hype('Input tokens')}</div>
  <div class="tile-value">{compact(input)}</div>
  <div class="split" role="img" aria-label={splitDescription(segments, totals)}>
    {#each segments.filter((part) => part.tokens > 0) as part (part.label)}
      <span style:flex-grow={part.tokens} style:background={part.color}></span>
    {/each}
  </div>
  {#each segments as part (part.label)}
    <div class="split-row" title={part.note}>
      <Swatch fill={part.color} />
      <span>{hype(part.label)}</span>
      <strong class="split-number">{compact(part.tokens)}</strong>
      <span class="split-number secondary">{percent(part.tokens, input)}</span>
      <span class="split-number">{money(part.cost)}</span>
    </div>
  {/each}
  {#if note !== null}
    <div class="note" title={CONTEXT_TITLE}>{note}</div>
  {/if}
</div>
