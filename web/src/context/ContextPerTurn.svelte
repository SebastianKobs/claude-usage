<!--
@component
The session view's context per turn, read from the page's payload: nothing without an open session. The heading, a
picker of the transcript shown (only where the session has two or more with turns; a workflow run's agents in a group
each), a legend, the chart of what each turn sent stacked by part, its table view and, under them, the tiles, the
biggest growth steps and the compactions of the same transcript (`ContextDetails`). The transcript picked and the
table view are this component's own state: a refresh of the same session keeps both, and the session view keys its
parts by session, so another session starts at the main thread. A picked transcript that is gone falls back to the main
thread.
-->
<script lang="ts">
  import { getApp } from '../app/app.svelte';
  import {
    agentChoices,
    agentKey,
    CONTEXT_PARTS,
    contextKey,
    contextLabel,
    contextNote,
    NO_TURNS,
    pickedAgent,
    TURN_COLUMNS,
    turnRows,
    type ContextRow,
  } from './context';
  import ContextChart from './ContextChart.svelte';
  import ContextDetails from './ContextDetails.svelte';
  import Swatch from '../ui/Swatch.svelte';
  import TableView from '../ui/TableView.svelte';

  const { payload } = getApp();

  const session = $derived(payload.session);
  let pickedKey = $state('main');
  let showTable = $state(false);
  // The container is measured for the drawing's width; the SVG is scaled to fit it.
  let containerWidth = $state(0);

  const agent = $derived(session ? pickedAgent(session.agents, pickedKey) : null);
  const turns = $derived(agent?.context_per_turn ?? []);
  const choices = $derived(session ? agentChoices(session.agents) : []);
  const pagerKey = $derived(session ? contextKey(session.session_id, agent) : '');
  const rows = $derived(turnRows(turns));
</script>

{#if session}
  <div class="chart-head">
    <h3 id="context-title">Context per turn</h3>
    <span id="context-note" class="muted">{contextNote(agent)}</span>
    <span class="spacer"></span>
    {#if choices.length}
      <select
        id="context-agent"
        aria-label="Transcript the context section shows"
        bind:value={() => (agent ? agentKey(agent) : pickedKey), (value) => (pickedKey = value)}
      >
        {#each choices as choice (choice.kind === 'group' ? `group:${choice.key}` : choice.value)}
          {#if choice.kind === 'group'}
            <optgroup label={choice.label}>
              {#each choice.options as option (option.value)}
                <option value={option.value}>{option.label}</option>
              {/each}
            </optgroup>
          {:else}
            <option value={choice.value}>{choice.label}</option>
          {/if}
        {/each}
      </select>
    {/if}
    <button type="button" id="context-table-toggle" aria-pressed={showTable} onclick={() => (showTable = !showTable)}
      >Table view</button
    >
  </div>
  <div class="legend">
    {#each CONTEXT_PARTS.toReversed() as part (part.field)}
      <span><Swatch fill={part.color} />{part.label}</span>
    {/each}
    <span><span class="legend-rule"></span>compaction</span>
  </div>
  <div id="context-chart" class="chart" bind:clientWidth={containerWidth}>
    {#if agent && turns.length}
      <ContextChart
        {turns}
        compactions={agent.compactions}
        hintTokens={session.compact_hint_tokens}
        label={contextLabel(agent, turns)}
        {containerWidth}
      />
    {:else}
      <div class="empty">{NO_TURNS}</div>
    {/if}
  </div>
  {#if showTable}
    <TableView
      id="context-table"
      labelledby="context-title"
      key="{pagerKey}-turns"
      columns={TURN_COLUMNS}
      {rows}
      rowKey={(row) => row.key}
      {cells}
      empty={NO_TURNS}
    />
  {/if}
  <div id="context-details">
    {#if agent}
      <ContextDetails {agent} key={pagerKey} />
    {/if}
  </div>
{/if}

{#snippet cells(row: ContextRow)}
  {#each TURN_COLUMNS as column, position (column.label)}
    <td class={column.numeric ? 'num' : undefined}>{row.cells[position]}</td>
  {/each}
{/snippet}
