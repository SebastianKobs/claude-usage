<!--
@component
Chart's test bench: a `div.chart` holding a Chart of ten buckets whose plot, marks and tip show the bucket they were
given as data attributes and text. Only the tests use it.
-->
<script lang="ts">
  import Chart, { type ChartCursor } from './Chart.svelte';

  let {
    width = 400,
    containerWidth = 400,
    count = 10,
    tipTop,
    withCursor = true,
    withTip = true,
  }: {
    width?: number;
    containerWidth?: number;
    count?: number;
    tipTop?: number;
    withCursor?: boolean;
    withTip?: boolean;
  } = $props();

  const LEFT = 40;
  const cursor: ChartCursor = $derived({
    count,
    label: 'Steps; arrow keys step through them',
    valueText: (index) => `bucket ${index}`,
    area: (drawn) => ({ x: LEFT, y: 0, width: drawn - LEFT - 40, height: 100 }),
    indexAt: (drawn) => (x) => Math.round(((x - LEFT) / (drawn - LEFT - 40)) * (count - 1)),
    tipX: (drawn, index) => LEFT + (index * (drawn - LEFT - 40)) / (count - 1),
  });
</script>

<div class="chart" data-testid="host">
  <Chart
    height={120}
    label="The steps; table view available"
    {width}
    {containerWidth}
    {tipTop}
    cursor={withCursor ? cursor : null}
    tip={withTip ? tip : undefined}
    {plot}
    {marks}
  />
</div>

{#snippet plot(drawn: number)}
  <rect data-testid="plot" width={drawn} height="100" />
{/snippet}

{#snippet marks(drawn: number, index: number)}
  <line data-testid="mark" data-index={index} data-width={drawn} />
{/snippet}

{#snippet tip(index: number)}
  <div data-testid="tip-content">tip {index}</div>
{/snippet}
