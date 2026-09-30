<!--
@component
The section every chart lives in: a heading named by `title` (themed by the caller) with an optional `note` after it,
optional `controls`, and the Table view toggle; then the optional `legend`, the `chart` (the caller writes its own
`div.chart`, since it measures its width), the `table` while the toggle is pressed, and an optional `extra` below
(notes, more tables). The heading labels the section. Whether the table shows is the card's own state, kept as long as
the card lives.
-->
<script lang="ts">
  import type { Snippet } from 'svelte';

  let {
    id,
    title,
    note,
    controls,
    legend,
    chart,
    table,
    extra,
  }: {
    /** The card's name in ids: `<id>-title` is the heading's, `<id>-table-toggle` the toggle's. */
    id: string;
    /** The heading, already in the theme's wording. */
    title: string;
    /** What the chart shows, after the heading. */
    note?: string;
    /** What goes in the head between the note and the toggle: a metric switch, say. */
    controls?: Snippet;
    /** The legend, above the chart. */
    legend?: Snippet;
    /** The chart: the page's `div.chart`. */
    chart: Snippet;
    /** The table view, shown while the toggle is pressed. */
    table: Snippet;
    /** Whatever follows the chart and its table. */
    extra?: Snippet;
  } = $props();

  let showTable = $state(false);
</script>

<section class="card" aria-labelledby="{id}-title">
  <div class="chart-head">
    <h2 id="{id}-title">{title}</h2>
    {#if note}
      <span class="muted">{note}</span>
    {/if}
    {@render controls?.()}
    <span class="spacer"></span>
    <button type="button" id="{id}-table-toggle" aria-pressed={showTable} onclick={() => (showTable = !showTable)}
      >Table view</button
    >
  </div>
  {@render legend?.()}
  {@render chart()}
  {#if showTable}
    {@render table()}
  {/if}
  {@render extra?.()}
</section>
