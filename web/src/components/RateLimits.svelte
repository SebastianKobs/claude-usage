<!--
@component
The rate-limits section, read from the page's payload: one column of rate-limit hits per day (or, for one day, per
hour) in the critical status color, the peak column labelled, and a slider over the columns whose tooltip gives a
bucket's hits and its other API errors. A range with neither says so instead of drawing the chart. The table view lists
a row per bucket. Below the chart come two tables: the 5-hour windows that hit their limit (what each used up to its
first hit, its models under it) and the latest failed calls, each with its words for none. Without a summary the card
has its heading and no chart or tables.
-->
<script lang="ts">
  import { columnGeometry, columnIndexAt } from '../lib/bymodel';
  import { chartWidth, LEFT_AXIS } from '../lib/chartkit';
  import { columnPath, LIMIT_ICON, ticks } from '../lib/charts';
  import { whole } from '../lib/format';
  import {
    LIMIT_CHART_HEIGHT,
    LIMIT_COLOR,
    LIMIT_PLOT,
    eventRows,
    limitBar,
    limitChartLabel,
    limitCursorLabel,
    limitNote,
    limitTable,
    limitTip,
    limitValueText,
    limitsOf,
    windowRows,
    windowsHead,
    type WindowRow,
  } from '../lib/limits';
  import { getApp } from '../lib/app.svelte';
  import Chart, { type ChartCursor } from './Chart.svelte';
  import ChartCard from './ChartCard.svelte';
  import EventsTable from './EventsTable.svelte';
  import Swatch from './Swatch.svelte';
  import TableView from './TableView.svelte';
  import XLabels from './XLabels.svelte';
  import YAxis from './YAxis.svelte';

  const { payload, hype } = getApp();

  type BucketRow = ReturnType<typeof limitTable>['rows'][number];

  const summary = $derived(payload.summary);
  const data = $derived(summary ? limitsOf(summary) : null);
  const unit = $derived(data?.buckets.unit ?? 'day');
  const title = $derived(hype('Rate limits'));
  const tableView = $derived(data ? limitTable(data) : null);
  const windows = $derived(summary ? windowRows(summary.api_errors.windows) : []);
  const events = $derived(summary ? eventRows(summary.api_errors.events) : []);
  const windowOthers = windowsHead.slice(1);

  // The chart's container is measured for the drawing's width; the SVG is scaled to fit it.
  let containerWidth = $state(0);
  const width = $derived(chartWidth(containerWidth));

  const cursor: ChartCursor | null = $derived(
    data
      ? {
          count: data.buckets.keys.length,
          label: limitCursorLabel(unit),
          valueText: (index) => limitValueText(data, index),
          area: (drawn) => ({
            x: LEFT_AXIS,
            y: 0,
            width: columnGeometry(drawn, data.buckets.keys.length).right - LEFT_AXIS,
            height: LIMIT_PLOT,
          }),
          indexAt: (drawn) => columnIndexAt(drawn, data.buckets.keys.length),
          tipX: (drawn, index) => LEFT_AXIS + columnGeometry(drawn, data.buckets.keys.length).band * (index + 0.5),
        }
      : null,
  );
</script>

<ChartCard
  id="limits"
  {title}
  note={data ? limitNote(unit) : undefined}
  {legend}
  {chart}
  table={tableSnippet}
  extra={tables}
/>

{#snippet legend()}
  <div class="legend">
    {#if data}
      <span><Swatch fill={LIMIT_COLOR} />{LIMIT_ICON} Rate-limit hit</span>
    {/if}
  </div>
{/snippet}

{#snippet chart()}
  <div class="chart" bind:clientWidth={containerWidth}>
    {#if data}
      {#if data.empty}
        <div class="empty">No rate limits or API errors in this range.</div>
      {:else}
        {@const buckets = data.buckets}
        {@const keys = buckets.keys}
        <Chart
          height={LIMIT_CHART_HEIGHT}
          label={limitChartLabel(unit, data.total)}
          {width}
          {containerWidth}
          {cursor}
          {plot}
          {marks}
          {tip}
        />

        {#snippet plot(drawn: number)}
          {@const { right, band } = columnGeometry(drawn, keys.length)}
          <YAxis
            left={LEFT_AXIS}
            {right}
            values={ticks(data.top, 2)}
            yOf={(value) => LIMIT_PLOT - (LIMIT_PLOT * value) / data.top}
            format={whole}
          />
          <XLabels
            count={keys.length}
            xOf={(index) => LEFT_AXIS + band * (index + 0.5)}
            y={LIMIT_PLOT + 18}
            text={(index) => buckets.short(keys[index] ?? '')}
          />
          {#each keys as key, index (key)}
            {@const value = data.limits[index] ?? 0}
            {@const bar = limitBar(drawn, keys.length, index, value, data.top)}
            {#if bar.height > 0}
              <path d={columnPath(bar.x, bar.y, bar.width, bar.height, true)} fill={LIMIT_COLOR} />
            {/if}
            {#if index === data.peak}
              <text class="value-text" text-anchor="middle" x={bar.x + bar.width / 2} y={bar.y - 6}
                >{whole(value)}</text
              >
            {/if}
          {/each}
        {/snippet}

        {#snippet marks(drawn: number, index: number)}
          {@const band = columnGeometry(drawn, keys.length).band}
          <!-- the whole band is highlighted, wider than the column -->
          <rect class="column-mark" x={LEFT_AXIS + band * index} y="0" width={band} height={LIMIT_PLOT} />
        {/snippet}

        {#snippet tip(index: number)}
          {@const counts = limitTip(data, index)}
          <div class="when">{counts.when}</div>
          <div class="row">
            <Swatch fill={LIMIT_COLOR} /><strong>{counts.limits}</strong><span class="name"
              >{LIMIT_ICON} rate-limit hits</span
            >
          </div>
          <div class="row">
            <Swatch fill={null} /><strong>{counts.others}</strong><span class="name">other API errors</span>
          </div>
        {/snippet}
      {/if}
    {/if}
  </div>
{/snippet}

{#snippet tableSnippet()}
  {#if tableView}
    {@const others = tableView.head.slice(1)}
    <TableView key="limits-table" columns={tableView.head} rows={tableView.rows} rowKey={(row) => row.key} {cells} />

    {#snippet cells(row: BucketRow)}
      <td>{row.cells[0]}</td>
      {#each others as column, position (column.label)}
        <td class="num">{row.cells[position + 1]}</td>
      {/each}
    {/snippet}
  {/if}
{/snippet}

{#snippet tables()}
  {#if summary}
    <TableView
      key="limit-windows"
      columns={windowsHead}
      rows={windows}
      rowKey={(row) => row.key}
      cells={windowCells}
      sub={(row) => row.sub}
      group={(row) => row.group}
      heading={windowsHeading}
      intro={windowsIntro}
      empty="No 5-hour window hit its limit in this range."
    />
    <EventsTable
      id="limit-events"
      title={hype('Latest API errors')}
      rows={events}
      empty="No API errors in this range."
      pagerKey="limit-events"
    />
  {/if}
{/snippet}

{#snippet windowsHeading()}
  <h3>{hype('5-hour windows that hit the limit')}</h3>
{/snippet}

{#snippet windowsIntro()}
  <p class="note">
    what each window used from its start (its reset less 5 hours) up to its first hit, as the transcripts here show it;
    the limit also counts what you use elsewhere
  </p>
{/snippet}

{#snippet windowCells(row: WindowRow)}
  <td>
    {#if row.kind === 'model'}
      <span class="window-model">{row.name}</span>
    {:else}
      {row.name}
    {/if}
  </td>
  {#each windowOthers as column, position (column.label)}
    <td class="num">{row.cells[position]}</td>
  {/each}
{/snippet}
