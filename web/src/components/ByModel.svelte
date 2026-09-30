<!--
@component
The by-model section, read from the page's payload: one stacked column per day (or, for one day, per hour), a
segment per model and effort level, plotting the metric chosen in the switch (estimated cost, output or input
tokens). Hatched segments (ultracode, background calls) are drawn with a pattern each. The legend groups the efforts
under their model; a slider over the columns reads each bucket, and its tooltip lists the models and their efforts.
Without a summary the card has its heading and no chart.
-->
<script lang="ts">
  import {
    CHART_HEIGHT,
    METRIC_NAMES,
    METRICS,
    PLOT_HEIGHT,
    columnGeometry,
    columnIndexAt,
    columnParts,
    columnX,
    legendGroups,
    metricName,
    modelChartLabel,
    modelChartOf,
    modelCursorLabel,
    modelTable,
    modelValueText,
    seriesFills,
    tipGroups,
    type MetricName,
  } from '../lib/bymodel';
  import { getApp } from '../lib/app.svelte';
  import { chartWidth, LEFT_AXIS } from '../lib/chartkit';
  import { columnPath, niceMax, peakIndex, ticks } from '../lib/charts';
  import { swatchFill } from '../lib/colors';
  import { readPreference, savePreference } from '../lib/prefs.svelte';
  import Chart, { type ChartCursor } from './Chart.svelte';
  import ChartCard from './ChartCard.svelte';
  import Swatch from './Swatch.svelte';
  import TableView from './TableView.svelte';
  import XLabels from './XLabels.svelte';
  import YAxis from './YAxis.svelte';

  type ModelRow = ReturnType<typeof modelTable>['rows'][number];

  const { payload, hype } = getApp();

  const summary = $derived(payload.summary);
  let metric = $state<MetricName>(metricName(readPreference('metric')));
  const data = $derived(summary ? modelChartOf(summary, metric) : null);
  const unit = $derived(data?.buckets.unit ?? 'day');
  const fills = $derived(data ? seriesFills(data.series) : null);
  // Named per unit, as the page's heading was; the wording for days until the first summary says otherwise.
  const title = $derived(
    !summary
      ? hype('Per day, by model')
      : unit === 'hour'
        ? hype('Per hour, by model and effort')
        : hype('Per day, by model and effort'),
  );
  // The axis' top: a nice number over the tallest column.
  const top = $derived(niceMax(Math.max(...(data?.totals ?? []), 0)));
  const tableView = $derived(data ? modelTable(data) : null);

  // The chart's container is measured for the drawing's width; the SVG is scaled to fit it.
  let containerWidth = $state(0);
  const width = $derived(chartWidth(containerWidth));

  const cursor: ChartCursor | null = $derived(
    data
      ? {
          count: data.buckets.keys.length,
          label: modelCursorLabel(data.metric, unit),
          valueText: (index) => modelValueText(data, index),
          area: (drawn) => ({
            x: LEFT_AXIS,
            y: 0,
            width: columnGeometry(drawn, data.buckets.keys.length).right - LEFT_AXIS,
            height: PLOT_HEIGHT,
          }),
          indexAt: (drawn) => columnIndexAt(drawn, data.buckets.keys.length),
          tipX: (drawn, index) => LEFT_AXIS + columnGeometry(drawn, data.buckets.keys.length).band * (index + 0.5),
        }
      : null,
  );

  function choose(name: MetricName): void {
    metric = name;
    savePreference('metric', name);
  }
</script>

<ChartCard id="chart" {title} {controls} {legend} {chart} table={tableSnippet} />

{#snippet controls()}
  <div class="segmented" role="group" aria-label="Metric">
    {#each METRIC_NAMES as name (name)}
      <button type="button" aria-pressed={metric === name} onclick={() => choose(name)}>{METRICS[name].label}</button>
    {/each}
  </div>
{/snippet}

{#snippet legend()}
  <div class="legend">
    {#if data}
      {#each legendGroups(data.series) as group (group.model)}
        <span class="legend-group">
          <strong>{group.model}</strong>
          {#each group.entries as { entry, text } (entry.key)}
            <span><Swatch fill={swatchFill(entry.color, entry.hatch, entry.turn)} />{text}</span>
          {/each}
        </span>
      {/each}
    {/if}
  </div>
{/snippet}

{#snippet chart()}
  <div class="chart" bind:clientWidth={containerWidth}>
    {#if data && fills}
      {@const buckets = data.buckets}
      {@const keys = buckets.keys}
      {@const format = data.metric.format}
      <Chart
        height={CHART_HEIGHT}
        label={modelChartLabel(data.metric, unit)}
        {width}
        {containerWidth}
        {cursor}
        {plot}
        {marks}
        {tip}
      />

      {#snippet plot(drawn: number)}
        {@const { right, band, barWidth } = columnGeometry(drawn, keys.length)}
        {@const peak = peakIndex(data.totals)}
        {#if fills.patterns.length}
          <defs>
            {#each fills.patterns as { id, entry } (id)}
              <pattern {id} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate({entry.turn})">
                <rect width="6" height="6" fill={entry.color} />
                <rect width="2" height="6" fill={entry.hatch} />
              </pattern>
            {/each}
          </defs>
        {/if}
        <YAxis
          left={LEFT_AXIS}
          {right}
          values={ticks(top, 4)}
          yOf={(value) => PLOT_HEIGHT - (PLOT_HEIGHT * value) / top}
          {format}
        />
        <XLabels
          count={keys.length}
          xOf={(index) => LEFT_AXIS + band * (index + 0.5)}
          y={PLOT_HEIGHT + 18}
          text={(index) => buckets.short(keys[index] ?? '')}
        />
        {#each keys as key, index (key)}
          {@const x = columnX(drawn, keys.length, index)}
          {#each columnParts(data.series, key, top) as { entry, segment } (entry.key)}
            <path d={columnPath(x, segment.y, barWidth, segment.height, segment.top)} fill={fills.fill(entry)} />
          {/each}
          {#if index === peak && (data.totals[index] ?? 0) > 0}
            {@const total = data.totals[index] ?? 0}
            <text
              class="value-text"
              text-anchor="middle"
              x={x + barWidth / 2}
              y={PLOT_HEIGHT - (PLOT_HEIGHT * total) / top - 6}>{format(total)}</text
            >
          {/if}
        {/each}
      {/snippet}

      {#snippet marks(drawn: number, index: number)}
        {@const band = columnGeometry(drawn, keys.length).band}
        <!-- the whole band is highlighted, wider than the column -->
        <rect class="column-mark" x={LEFT_AXIS + band * index} y="0" width={band} height={PLOT_HEIGHT} />
      {/snippet}

      {#snippet tip(index: number)}
        {@const key = keys[index] ?? ''}
        {@const groups = tipGroups(data.series, key)}
        <div class="when">{buckets.long(key)}</div>
        {#each groups as group (group.model)}
          <div class="tip-line tip-model">
            <span>{group.model}</span><span class="tip-value">{format(group.value)}</span>
          </div>
          {#each group.efforts as { entry, text, value } (entry.key)}
            <div class="tip-line tip-effort">
              <span><Swatch fill={swatchFill(entry.color, entry.hatch, entry.turn)} />{text}</span>
              <span class="tip-value">{format(value)}</span>
            </div>
          {/each}
        {:else}
          <div class="name">No usage</div>
        {/each}
        {#if groups.length > 1}
          <div class="tip-line tip-total">
            <span>Total</span><span class="tip-value">{format(data.totals[index] ?? 0)}</span>
          </div>
        {/if}
      {/snippet}
    {/if}
  </div>
{/snippet}

{#snippet tableSnippet()}
  {#if tableView}
    {@const [first = '', ...others] = tableView.head}
    <TableView
      key="chart-table"
      labelledby="chart-title"
      columns={[{ label: first }, ...others.map((label) => ({ label, numeric: true }))]}
      rows={tableView.rows}
      rowKey={(row) => row.key}
      {cells}
    />

    {#snippet cells(row: ModelRow)}
      <td>{row.cells[0]}</td>
      {#each others as label, position (label)}
        <td class="num">{row.cells[position + 1]}</td>
      {/each}
    {/snippet}
  {/if}
{/snippet}
