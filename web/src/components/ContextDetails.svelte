<!--
@component
What sits under the context chart, for the same transcript (`agent`): the overhead, rebuild, compaction and growth
tiles, the biggest growth steps, and the compactions, each against keeping its context, under a heading that carries
their total as a gain or a loss (the sign and the arrow carry it, not the color) and followed by a note on how it is
reckoned. Both tables page under `key` (the session's and the transcript's, so another one starts at the first page).
-->
<script lang="ts">
  import type { Agent } from '../lib/api';
  import {
    COMPACTION_COLUMNS,
    COMPACTION_NOTE,
    compactionRows,
    compactionsTotal,
    contextTiles,
    GROWTH_COLUMNS,
    growthRows,
    NO_COMPACTIONS,
    NO_GROWTH,
    type CompactionRow,
    type ContextRow,
  } from '../lib/context';
  import StatTile from './StatTile.svelte';
  import TableView from './TableView.svelte';

  let { agent, key }: { agent: Agent; key: string } = $props();

  const growth = $derived(growthRows(agent));
  const compactions = $derived(compactionRows(agent.compactions));
  const total = $derived(compactionsTotal(agent.compactions));
</script>

<div class="kpis session-kpis">
  {#each contextTiles(agent) as tile (tile.label)}
    <StatTile label={tile.label} value={tile.value} note={tile.note} />
  {/each}
</div>

<TableView
  key="{key}-growth"
  labelledby="growth-title"
  columns={GROWTH_COLUMNS}
  rows={growth}
  rowKey={(row) => row.key}
  cells={growthCells}
  heading={growthHeading}
  empty={NO_GROWTH}
/>

<TableView
  key="{key}-compactions"
  labelledby="compactions-title"
  columns={COMPACTION_COLUMNS}
  rows={compactions}
  rowKey={(row) => row.key}
  cells={compactionCells}
  heading={compactionsHeading}
  empty={NO_COMPACTIONS}
/>
{#if compactions.length}
  <div class="note">{COMPACTION_NOTE}</div>
{/if}

{#snippet growthHeading()}
  <h3 id="growth-title">Biggest growth steps</h3>
{/snippet}

{#snippet growthCells(row: ContextRow)}
  {#each GROWTH_COLUMNS as column, position (column.label)}
    <td class={column.numeric ? 'num' : undefined}>{row.cells[position]}</td>
  {/each}
{/snippet}

{#snippet compactionsHeading()}
  <h3 id="compactions-title">
    Compactions{#if total}<span class="compaction-total verdict-{total.tone}" title={total.title}>{total.text}</span
      >{/if}
  </h3>
{/snippet}

{#snippet compactionCells(row: CompactionRow)}
  <td>{row.time}</td>
  <td>{row.trigger}</td>
  <td class="num">{row.before}</td>
  <td class="num" title={row.after.title}>{row.after.text}</td>
  <td class="num">{row.took}</td>
  {#if row.versus}
    {@const { each, oneTime, paysOff, callsAfter, verdict } = row.versus}
    <td class="num">{each}</td>
    <td class="num" title={oneTime.title}>{oneTime.text}</td>
    <td class="num" title={paysOff.title}>{paysOff.text}</td>
    <td class="num" title={callsAfter.title}>{callsAfter.text}</td>
    <td title={verdict.title}
      ><span class={verdict.tone ? `verdict-${verdict.tone}` : undefined} title={verdict.words}
        >{verdict.text}</span
      ></td
    >
  {:else}
    <td colspan="5" class="muted">no call after it, or no price for its model</td>
  {/if}
{/snippet}
