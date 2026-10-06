<!--
@component
The session view's "Main thread and subagents" table, paged under a heading that names it: a row per agent (the
main thread first), its description and workflow phase under its type, one line per model, then its turns, context,
input, cache reads, output, web searches (where any agent made some), what it handed back and cost. A workflow run's
agents are one row of the run's totals, with a button that opens the agents under it, closed at first; an open run
stays open while the agents change, and starts closed again in a new component (another session).
-->
<script lang="ts">
  import type { Agent } from '../api/api';
  import { agentColumns, agentRows, hasSearches, type AgentRow } from './session';
  import TableView from '../ui/TableView.svelte';

  let {
    agents,
    pagerKey,
  }: {
    /** The session's agents, as the server gives them. */
    agents: Agent[];
    /** The pager's key, which the page is kept under; the session's, so another session starts at the first page. */
    pagerKey: string;
  } = $props();

  // The runs whose agents show: an array, since nothing else reads it and a run is opened or closed one at a time.
  let open = $state<string[]>([]);
  const columns = $derived(agentColumns(hasSearches(agents)));
  const rows = $derived(agentRows(agents, open));

  /** Opens a run's agents, or closes them. */
  function toggle(run: string): void {
    open = open.includes(run) ? open.filter((entry) => entry !== run) : [...open, run];
  }
</script>

<TableView
  key={pagerKey}
  {columns}
  {rows}
  rowKey={(row) => row.key}
  {cells}
  sub={(row) => row.kind === 'member'}
  group={(row) => row.kind === 'run'}
  rowClass={(row) => (row.kind === 'member' ? 'workflow-member' : undefined)}
  {heading}
  labelledby="session-agents-title"
/>

{#snippet heading()}
  <h3 id="session-agents-title">Main thread and subagents</h3>
{/snippet}

{#snippet cells(row: AgentRow)}
  <td>
    <strong>{row.name}</strong>
    {#if row.fold}
      {@const fold = row.fold}
      {@const opened = open.includes(fold.run)}
      <span class="sub"
        ><button type="button" class="link-button" aria-expanded={opened} onclick={() => toggle(fold.run)}
          >{fold.label}</button
        ></span
      >
    {:else}
      <span class="sub">{row.detail}</span>
    {/if}
  </td>
  <td>
    {#each row.models as model (model)}
      <div>{model}</div>
    {/each}
  </td>
  {#each row.cells as cell, position (position)}
    <td class="num">{cell}</td>
  {/each}
{/snippet}
