<!--
@component
The session view's Tools table, paged under a heading that names it: a row per tool of each agent (the main thread
first), its calls, errors, result characters, the median and p90 of a result, the median input, the calls that carried
it after and what they paid, with a note on how those costs are estimated while a transcript gives them. Bash splits
by what a command does and MCP by server, each kind by program, each program by option set: a row that splits has a
button that opens what is under it, closed at first, and closing an outer one hides an open inner one's rows too. A
row keeps its node whichever folds are open, so focus and an open fold stay while the agents change, and the folds
start closed again in a new component (another session). Once a transcript is gone an agent's row is the stored calls
and result characters alone.
-->
<script lang="ts">
  import type { Agent } from '../lib/api';
  import { toolsColumns, toolsNote, toolsRows, type ToolsRow } from '../lib/session';
  import TableView from './TableView.svelte';

  let {
    agents,
    pagerKey,
  }: {
    /** The session's agents, as the server gives them. */
    agents: Agent[];
    /** The pager's key, which the page is kept under; the session's, so another session starts at the first page. */
    pagerKey: string;
  } = $props();

  // The folds that are open, by key: an array, since nothing else reads it and a fold opens or closes one at a time.
  let open = $state<string[]>([]);
  const columns = toolsColumns();
  const rows = $derived(toolsRows(agents, open));
  const note = $derived(toolsNote(agents));

  /** Opens a fold's rows, or closes them. */
  function toggle(fold: string): void {
    open = open.includes(fold) ? open.filter((entry) => entry !== fold) : [...open, fold];
  }
</script>

<TableView
  key={pagerKey}
  {columns}
  {rows}
  rowKey={(row) => row.key}
  {cells}
  sub={(row) => row.sub}
  group={(row) => row.group}
  {heading}
  intro={note === null ? undefined : intro}
  empty="No tool calls."
  labelledby="session-tools-title"
/>

{#snippet heading()}
  <h3 id="session-tools-title">Tools</h3>
{/snippet}

{#snippet intro()}
  <div class="note">{note}</div>
{/snippet}

{#snippet cells(row: ToolsRow)}
  <td>{row.agent}</td>
  <td>
    <!-- the space before the bracket goes with the name: a block trims what starts it -->
    <span class={row.name.className}
      >{row.fold ? `${row.name.text} (` : row.name.text}{#if row.fold}{@const fold = row.fold}<button
          type="button"
          class="link-button"
          aria-expanded={fold.open}
          onclick={() => toggle(fold.fold)}>{fold.label}</button
        >){/if}</span
    >
  </td>
  {#each row.cells as cell, position (position)}
    <td class="num">{cell}</td>
  {/each}
{/snippet}
