<!--
@component
The cost-per-session section, read from the page's payload: a ranked bar per session (the costliest the server sent,
each bar measured against the dearest), split into the cost's cache reads and everything else, with the session's
name, project, turns and average context beside it, and its cost after it. Each row links to the session's view; while
a row is hovered or focused a tooltip gives its parts with their shares, the total and the context. The table view
lists the same sessions with their turns, contexts and parts. Without a summary the card has its heading and no chart.
-->
<script lang="ts">
  import { getApp } from '../lib/app.svelte';
  import {
    COSTLY_PARTS,
    costlyRows,
    costlyTable,
    costlyTip,
    legendText,
    sessionHref,
    sessionName,
  } from '../lib/costly';
  import ChartCard from './ChartCard.svelte';
  import ChartTooltip from './ChartTooltip.svelte';
  import Swatch from './Swatch.svelte';
  import TableView from './TableView.svelte';

  type TableRow = ReturnType<typeof costlyTable>['rows'][number];

  const { payload, hype } = getApp();

  const summary = $derived(payload.summary);
  const sessions = $derived(summary?.costly_sessions ?? []);
  const rows = $derived(costlyRows(sessions));
  const tableView = $derived(costlyTable(sessions));
  const title = $derived(hype('Cost per session'));

  // The tooltip belongs to the session it was shown for, so it goes with that session's row when a new summary
  // leaves it out.
  let shown = $state<{ id: string; anchor: number; top: number } | null>(null);
  const tipRow = $derived(shown ? rows.find((row) => row.session.session_id === shown?.id) : undefined);
  const tip = $derived(tipRow ? costlyTip(tipRow) : null);

  // Beside the pointer, or for keyboard focus (no pointer position) beside the row's middle; under the row. The
  // frame is the chart's container, which the tooltip is placed in.
  function show(event: Event, id: string): void {
    const row = event.currentTarget as HTMLElement;
    const frame = row.closest('.chart')?.getBoundingClientRect();
    if (!frame) return;
    const box = row.getBoundingClientRect();
    const clientX = 'clientX' in event ? (event.clientX as number) : 0;
    shown = {
      id,
      anchor: clientX ? clientX - frame.left : box.left - frame.left + box.width / 2,
      top: row.offsetTop + row.offsetHeight + 4,
    };
  }

  function hide(): void {
    shown = null;
  }
</script>

<ChartCard
  id="costly"
  {title}
  note="the costliest sessions by what they used in the range, with their subagents"
  {legend}
  {chart}
  table={tableSnippet}
/>

{#snippet legend()}
  <div class="legend">
    {#if summary}
      {#each COSTLY_PARTS as part (part.label)}
        <span><Swatch fill={part.color} />{legendText(part)}</span>
      {/each}
    {/if}
  </div>
{/snippet}

{#snippet chart()}
  <div class="chart">
    {#if summary}
      {#if rows.length}
        <div class="bars">
          {#each rows as row (row.session.session_id)}
            <a
              class="bar-row"
              href={row.href}
              aria-label={row.label}
              onpointermove={(event) => show(event, row.session.session_id)}
              onfocus={(event) => show(event, row.session.session_id)}
              onpointerleave={hide}
              onblur={hide}
            >
              <span class="bar-name"><strong>{row.title}</strong><span class="sub">{row.detail}</span></span>
              <span class="bar-track">
                <div class="bar" style:width="{row.share.toFixed(2)}%">
                  {#each row.parts as { part, amount } (part.label)}
                    {#if amount > 0}
                      <span style:flex-grow={amount} style:background={part.color}></span>
                    {/if}
                  {/each}
                </div>
              </span>
              <span class="bar-value">{row.cost}</span>
            </a>
          {/each}
        </div>
        {#if shown && tip}
          <ChartTooltip anchor={shown.anchor} top={shown.top}>
            <div class="when">{tip.title}</div>
            {#each tip.parts as part (part.label)}
              <div class="row">
                <Swatch fill={part.color} /><strong>{part.amount}</strong><span class="name"
                  >{part.label} · {part.share}</span
                >
              </div>
            {/each}
            <div class="row"><Swatch fill={null} /><strong>{tip.total}</strong><span class="name">total</span></div>
            <div class="name">{tip.context}</div>
          </ChartTooltip>
        {/if}
      {:else}
        <div class="empty">No sessions in this range.</div>
      {/if}
    {/if}
  </div>
{/snippet}

{#snippet tableSnippet()}
  {#if summary}
    {@const others = tableView.head.slice(1)}
    <TableView
      key="costly-table"
      labelledby="costly-title"
      columns={tableView.head}
      rows={tableView.rows}
      rowKey={(row) => row.key}
      {cells}
    />

    {#snippet cells(row: TableRow)}
      <td>
        <a href={sessionHref(row.session)}>{sessionName(row.session)}</a><span class="sub">{row.session.project}</span>
      </td>
      {#each others as column, position (column.label)}
        <td class="num">{row.cells[position]}</td>
      {/each}
    {/snippet}
  {/if}
{/snippet}
