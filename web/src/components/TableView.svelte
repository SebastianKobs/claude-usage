<!--
@component
A table of rows a component draws, paged: a chart's table view, later every table of the page. `rows` come in display
order; `cells` draws one row's `<td>`s, `sub` says which rows are sub-rows, which stay with the row above them on a
page (and get the class `sub-row`), `group` which rows head a group (the class `group-row`). Past `PAGE_SIZES[0]`
groups of rows a pager goes before the table, under `key`, which the page is kept under across draws. Only the rows of
the page are drawn, none is hidden: unlike the old code's tables this one has no rows off the page to mark.

A table with a `heading` has the pager in a title row with it, right-aligned, where there is a pager (the heading alone,
without a wrapper, where there is none: a flex row would stop its margin collapsing into the note's); `intro` (a note)
follows. Without a heading the pager is the wrap's first child. With `empty` and no rows the wrap holds that text
instead of the table. A `labelledby` names the table by the element with that id (the heading's, where it has one),
and every heading cell has `scope="col"`.
-->
<script lang="ts" generics="Row">
  import type { Snippet } from 'svelte';
  import { shownWindow } from '../lib/paging.svelte';
  import { PAGE_SIZES, pageUnits } from '../lib/tables';
  import Pager from './Pager.svelte';

  let {
    key,
    noun = 'rows',
    columns,
    rows,
    rowKey,
    cells,
    sub,
    group,
    heading,
    intro,
    empty,
    labelledby,
  }: {
    /** The pager's key: the page is kept under it, and the controls' ids are made of it (`pager-<key>-size`). */
    key: string;
    /** What the rows are called, in the pager. */
    noun?: string;
    /** The heading, `numeric` ones right-aligned. */
    columns: { label: string; numeric?: boolean }[];
    /** The rows, already in the order they show. */
    rows: Row[];
    /** A row's key, unique among the rows, which keeps its node while rows come and go or move. */
    rowKey: (row: Row) => string;
    /** One row's cells: its `<td>`s. */
    cells: Snippet<[row: Row]>;
    /** Whether a row is a sub-row of the one above it. */
    sub?: (row: Row) => boolean;
    /** Whether a row heads a group of sub-rows. */
    group?: (row: Row) => boolean;
    /** The table's heading, which the pager shares a row with. */
    heading?: Snippet;
    /** A note between the heading and the table. */
    intro?: Snippet;
    /** What to say instead of the table when there are no rows. */
    empty?: string;
    /** The id of the element that names the table (its heading), for assistive technology. */
    labelledby?: string;
  } = $props();

  const units = $derived(pageUnits(rows.map((row) => sub?.(row) ?? false)));
  const count = $derived((units.at(-1) ?? -1) + 1);
  // The window is clamped, so a stored page beyond the end of shrunken rows shows the last page.
  const shown = $derived(shownWindow(key, count));
  const onPage = $derived(
    rows.filter((_row, index) => {
      const unit = units[index] ?? 0;
      return unit >= shown.first && unit < shown.last;
    }),
  );
</script>

{#snippet pager()}
  {#if count > PAGE_SIZES[0]!}
    <Pager {key} {noun} {units} />
  {/if}
{/snippet}

{#if heading}
  {#if count > PAGE_SIZES[0]!}
    <div class="title-row">
      {@render heading()}
      {@render pager()}
    </div>
  {:else}
    {@render heading()}
  {/if}
{/if}
{@render intro?.()}
<div class="table-wrap">
  {#if !heading}
    {@render pager()}
  {/if}
  {#if rows.length === 0 && empty !== undefined}
    <div class="empty">{empty}</div>
  {:else}
    <table aria-labelledby={labelledby}>
      <thead>
        <tr>
          {#each columns as column (column.label)}
            <th scope="col" class={column.numeric ? 'num' : undefined}>{column.label}</th>
          {/each}
        </tr>
      </thead>
      <tbody>
        {#each onPage as row (rowKey(row))}
          <tr class={sub?.(row) ? 'sub-row' : group?.(row) ? 'group-row' : undefined}>{@render cells(row)}</tr>
        {/each}
      </tbody>
    </table>
  {/if}
</div>
