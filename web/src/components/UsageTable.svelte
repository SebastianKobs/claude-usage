<!--
@component
One of the usage tables: a card with its heading (and, where there is one, a note under it) and a paged table of rows
named by `nameLabel`, then the usage columns, dearest first. The heading names the table, and past ten groups of rows
the pager shares its row. A model row carries a swatch of the model's color, an effort row is indented under its model.
With no rows the card says `empty` instead of the table; with `rows` null (no summary yet) it is its heading only.
`inline` is the session view's form: no card, the heading a level 3 one, the table part of the section around it, and
its pager under `pagerKey` (the session's, so another session starts at the first page) instead of the id.
-->
<script lang="ts">
  import { usageColumns, type UsageRow } from '../lib/usage';
  import Swatch from './Swatch.svelte';
  import TableView from './TableView.svelte';

  let {
    id,
    title,
    note,
    nameLabel,
    rows,
    empty,
    inline = false,
    pagerKey = id,
  }: {
    /** The table's id: its pager's key, and the heading's id is `<id>-title`. */
    id: string;
    /** The heading. */
    title: string;
    /** What the rows are, under the heading. */
    note?: string;
    /** The heading of the name column. */
    nameLabel: string;
    /** The rows, dearest first; null while no summary is loaded. */
    rows: UsageRow[] | null;
    /** What to say where there are no rows. */
    empty: string;
    /** Whether the table stands in a card of the page's (the session view's) instead of being a card. */
    inline?: boolean;
    /** The pager's key, which the page is kept under; the id unless given. */
    pagerKey?: string;
  } = $props();

  const others = $derived(usageColumns(nameLabel).slice(1));
</script>

{#if inline}
  {@render body()}
{:else}
  <section class="card" aria-labelledby="{id}-title">
    {@render body()}
  </section>
{/if}

{#snippet body()}
  {#if rows}
    <TableView
      key={pagerKey}
      columns={usageColumns(nameLabel)}
      {rows}
      rowKey={(row) => row.key}
      {cells}
      sub={(row) => row.sub}
      group={(row) => row.group}
      {heading}
      intro={note === undefined ? undefined : intro}
      {empty}
      labelledby="{id}-title"
    />
  {:else}
    {@render heading()}
  {/if}
{/snippet}

{#snippet heading()}
  {#if inline}
    <h3 id="{id}-title">{title}</h3>
  {:else}
    <h2 id="{id}-title">{title}</h2>
  {/if}
{/snippet}

{#snippet intro()}
  <p class="note">{note}</p>
{/snippet}

{#snippet cells(row: UsageRow)}
  <td>
    {#if row.kind === 'model'}
      <span><Swatch fill={row.swatch} />{row.name}</span>
    {:else if row.kind === 'effort'}
      <span class="effort">{row.name}</span>
    {:else}
      {row.name}
    {/if}
  </td>
  {#each others as column, position (column.label)}
    <td class="num">{row.cells[position]}</td>
  {/each}
{/snippet}
