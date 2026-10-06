<!--
@component
ChartCard's test bench: a card with the required snippets (a chart and a table, each a marked div) and, where asked, the
optional ones. Only the tests use it.
-->
<script lang="ts">
  import ChartCard from './ChartCard.svelte';

  let {
    note,
    withControls = false,
    withLegend = false,
    withExtra = false,
  }: { note?: string; withControls?: boolean; withLegend?: boolean; withExtra?: boolean } = $props();
</script>

<ChartCard
  id="demo"
  title="Demo chart"
  {note}
  controls={withControls ? controls : undefined}
  legend={withLegend ? legend : undefined}
  {chart}
  {table}
  extra={withExtra ? extra : undefined}
/>

{#snippet controls()}<button type="button">Metric</button>{/snippet}
{#snippet legend()}<div data-testid="legend">legend</div>{/snippet}
{#snippet chart()}<div class="chart" data-testid="chart">chart</div>{/snippet}
{#snippet table()}<div data-testid="table">table</div>{/snippet}
{#snippet extra()}<p data-testid="extra">extra</p>{/snippet}
