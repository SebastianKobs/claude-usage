<!--
@component
The over-time section, read from the page's payload: three aligned panels (estimated cost, input tokens, output
tokens), each with its own y axis and its own series color, sharing one time axis (the range's days, or for one day its
hours), with a slider over the buckets and a table view. Without a summary the card has its heading and no chart.
-->
<script lang="ts">
  import { chartWidth, LEFT_AXIS, RIGHT_PAD } from '../lib/chartkit';
  import { lineX, nearestIndex, niceMax, ticks } from '../lib/charts';
  import { slotColor } from '../lib/colors';
  import { payload } from '../lib/payload.svelte';
  import { hype } from '../lib/prefs.svelte';
  import {
    PANEL_PLOT,
    PANEL_TITLE,
    TREND_PANELS,
    panelBox,
    panelValues,
    trendCursorLabel,
    trendHeight,
    trendLabel,
    trendNote,
    trendOf,
    trendTable,
    trendValueText,
    type TrendPanel,
  } from '../lib/trend';
  import AreaLine from './AreaLine.svelte';
  import Chart, { type ChartCursor } from './Chart.svelte';
  import ChartCard from './ChartCard.svelte';
  import PointDot from './PointDot.svelte';
  import TableView from './TableView.svelte';
  import XLabels from './XLabels.svelte';
  import YAxis from './YAxis.svelte';

  /** A panel placed in the drawing: its plot's top and bottom, its axis and what it plots. */
  interface PlacedPanel {
    panel: TrendPanel;
    top: number;
    bottom: number;
    color: string;
    values: number[];
    max: number;
    yOf: (value: number) => number;
  }

  type TrendRow = ReturnType<typeof trendTable>['rows'][number];

  const summary = $derived(payload.summary);
  const trend = $derived(summary ? trendOf(summary) : null);
  // Day until the first summary says otherwise, as the page's markup did.
  const unit = $derived(trend?.buckets.unit ?? 'day');
  const tableView = $derived(trend ? trendTable(trend) : null);

  // The chart's container is measured for the drawing's width; the SVG is scaled to fit it.
  let containerWidth = $state(0);
  const width = $derived(chartWidth(containerWidth));

  // The x labels go below the last plot.
  const plotsBottom = panelBox(TREND_PANELS.length - 1).bottom;
  const panels: PlacedPanel[] = $derived(
    trend
      ? TREND_PANELS.map((panel, position) => {
          const { top, bottom } = panelBox(position);
          const values = panelValues(trend, panel);
          const max = niceMax(Math.max(...values, 0));
          return {
            panel,
            top,
            bottom,
            color: slotColor(panel.slot),
            values,
            max,
            yOf: (value) => bottom - (PANEL_PLOT * value) / max,
          };
        })
      : [],
  );

  const cursor: ChartCursor | null = $derived(
    trend
      ? {
          count: trend.buckets.keys.length,
          label: trendCursorLabel(unit),
          valueText: (index) => trendValueText(trend, index),
          area: (drawn) => ({ x: LEFT_AXIS, y: 0, width: drawn - RIGHT_PAD - LEFT_AXIS, height: plotsBottom }),
          indexAt: (drawn) => nearestIndex(LEFT_AXIS, drawn - RIGHT_PAD, trend.buckets.keys.length),
          tipX: (drawn, index) => lineX(trend.buckets.keys.length, LEFT_AXIS, drawn - RIGHT_PAD)(index),
        }
      : null,
  );
</script>

<ChartCard id="trend" title={hype('Over time')} note={trendNote(unit)} {chart} table={tableSnippet} />

{#snippet chart()}
  <div class="chart" bind:clientWidth={containerWidth}>
    {#if trend}
      {@const buckets = trend.buckets}
      {@const keys = buckets.keys}
      <Chart height={trendHeight()} label={trendLabel(unit)} {width} {containerWidth} {cursor} {plot} {marks} {tip} />

      {#snippet plot(drawn: number)}
        {@const right = drawn - RIGHT_PAD}
        {@const xOf = lineX(keys.length, LEFT_AXIS, right)}
        {#each panels as { panel, top, bottom, color, values, max, yOf } (panel.label)}
          <!-- the panel title carries a line key, so identity never rests on color alone -->
          <line
            x1={LEFT_AXIS}
            x2={LEFT_AXIS + 14}
            y1={top - 10}
            y2={top - 10}
            stroke={color}
            stroke-width="2"
            stroke-linecap="round"
          />
          <text class="panel-title" x={LEFT_AXIS + 20} y={top - 6}>{panel.label}</text>
          <YAxis left={LEFT_AXIS} {right} values={ticks(max, 2)} {yOf} format={panel.format} />
          <AreaLine {values} {xOf} {yOf} {bottom} {color} />
          {#if values.length}
            <!-- the end dot and the one direct label: the latest value -->
            {@const end = values.length - 1}
            {@const latest = values[end] ?? 0}
            <PointDot x={xOf(end)} y={yOf(latest)} {color} />
            <text class="value-text" x={xOf(end) + 9} y={yOf(latest) + 4}>{panel.format(latest)}</text>
          {/if}
        {/each}
        <XLabels count={keys.length} {xOf} y={plotsBottom + 18} text={(index) => buckets.short(keys[index] ?? '')} />
      {/snippet}

      {#snippet marks(drawn: number, index: number)}
        {@const xOf = lineX(keys.length, LEFT_AXIS, drawn - RIGHT_PAD)}
        <line class="crosshair" x1={xOf(index)} x2={xOf(index)} y1={PANEL_TITLE - 4} y2={plotsBottom} />
        {#each panels as { panel, color, values, yOf } (panel.label)}
          <PointDot x={xOf(index)} y={yOf(values[index] ?? 0)} {color} />
        {/each}
      {/snippet}

      {#snippet tip(index: number)}
        <div class="when">{buckets.long(keys[index] ?? '')}</div>
        {#each panels as { panel, color, values } (panel.label)}
          <div class="row">
            <span class="key" style:background={color}></span>
            <strong>{panel.format(values[index] ?? 0)}</strong>
            <span class="name">{panel.label}</span>
          </div>
        {/each}
      {/snippet}
    {/if}
  </div>
{/snippet}

{#snippet tableSnippet()}
  {#if tableView}
    {@const [first = '', ...others] = tableView.head}
    <TableView
      key="trend-table"
      columns={[{ label: first }, ...others.map((label) => ({ label, numeric: true }))]}
      rows={tableView.rows}
      rowKey={(row) => row.key}
      {cells}
    />
  {/if}
{/snippet}

{#snippet cells(row: TrendRow)}
  <td>{row.cells[0]}</td>
  {#each TREND_PANELS as panel, position (panel.label)}
    <td class="num">{row.cells[position + 1]}</td>
  {/each}
{/snippet}
