<!--
@component
The latest failed API calls as a paged table under a level 3 heading that names it: when, the error in words, the quota,
when that resets, the session (a link, with its project) and the agent. The session view leaves the session out
(`withSession` off), since every call is its own. With no rows the heading is followed by `empty` instead of the table.
-->
<script lang="ts">
  import { eventColumns, type EventRow } from '../lib/limits';
  import TableView from './TableView.svelte';

  let {
    id,
    title,
    rows,
    empty,
    pagerKey,
    withSession = true,
  }: {
    /** The table's id: the heading's id is `<id>-title`. */
    id: string;
    /** The heading. */
    title: string;
    /** The failed calls, in the order they show. */
    rows: EventRow[];
    /** What to say where there are none. */
    empty: string;
    /** The pager's key, which the page is kept under across draws. */
    pagerKey: string;
    /** Whether each row names its session: the overview's, not a session view's. */
    withSession?: boolean;
  } = $props();
</script>

<TableView
  key={pagerKey}
  columns={eventColumns(withSession)}
  {rows}
  rowKey={(row) => row.key}
  {cells}
  {heading}
  {empty}
  labelledby="{id}-title"
/>

{#snippet heading()}
  <h3 id="{id}-title">{title}</h3>
{/snippet}

{#snippet cells(row: EventRow)}
  <td class="num">{row.when}</td>
  <td>{row.error}</td>
  <td>{row.quota}</td>
  <td class="num">{row.resets}</td>
  {#if withSession}
    <td><a href={row.session.href}>{row.session.name}</a><span class="sub">{row.session.project}</span></td>
  {/if}
  <td>{row.agent}</td>
{/snippet}
