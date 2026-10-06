<!--
@component
One of the overview's two tile rows, read from the page's payload: the `kpis` row (cost, input, turns, output) or the
`runtime` row (time and lines changed). Without a summary the kpis row says it is loading, or that it failed; the
runtime row stays empty. The runtime row also counts the range's sessions that have no cost record yet, estimated from
their transcripts.
-->
<script lang="ts">
  import { getApp } from '../app/app.svelte';
  import { rangeText, runtimeFrom } from './tiles';
  import KpiTiles from './KpiTiles.svelte';
  import RuntimeTiles from './RuntimeTiles.svelte';

  let { rows }: { rows: 'kpis' | 'runtime' } = $props();

  const { payload } = getApp();

  const summary = $derived(payload.summary);
</script>

{#if summary}
  {#if rows === 'kpis'}
    <KpiTiles
      totals={summary.totals}
      scope={rangeText(summary)}
      context={summary.context}
      hintTokens={summary.compact_hint_tokens}
      savings={summary.compaction_savings}
    />
  {:else}
    <RuntimeTiles
      runtime={summary.runtime}
      from={runtimeFrom(summary.runtime.sessions, summary.runtime.estimated_sessions)}
      costPer100Lines={summary.runtime.cost_per_100_lines}
    />
  {/if}
{:else if rows === 'kpis'}
  <div class="empty">{payload.summaryFailed ? 'Could not load the summary.' : 'Loading…'}</div>
{/if}
