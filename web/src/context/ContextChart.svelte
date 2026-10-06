<!--
@component
The session view's context per turn as a fragment for its `<div class="chart">` (which the section measures:
`containerWidth`): what each turn sent, stacked as cache read, cache write and new input, with the compact hint as a
reference line where the plot reaches it, a dashed rule before the first turn after each compaction, and the peak and
the latest turn labelled. A slider over the turns reads each one (its tooltip gives the parts, the context and the
turn's growth and cache rebuild), with a crosshair and a dot at its context. `label` names the chart for a screen
reader.
-->
<script lang="ts">
  import type { Compaction, ContextTurn } from '../api/api';
  import { chartWidth, LEFT_AXIS, RIGHT_PAD } from '../charts/chartkit';
  import { lineX, nearestIndex, ticks } from '../charts/charts';
  import {
    CONTEXT_BOTTOM,
    CONTEXT_HEIGHT,
    CONTEXT_PARTS,
    CONTEXT_TOP,
    compactionRules,
    contextMax,
    contextY,
    endLabels,
    hintLine,
    stackShapes,
    turnNotes,
    turnTitle,
    turnValueText,
  } from './context';
  import { compact } from '../ui/format';
  import Chart, { type ChartCursor } from '../charts/Chart.svelte';
  import PointDot from '../charts/PointDot.svelte';
  import Swatch from '../ui/Swatch.svelte';
  import XLabels from '../charts/XLabels.svelte';
  import YAxis from '../charts/YAxis.svelte';

  let {
    turns,
    compactions,
    hintTokens,
    label,
    containerWidth,
  }: {
    /** The transcript's turns, at least one. */
    turns: ContextTurn[];
    /** Its compactions, each a rule before the first turn after it. */
    compactions: Compaction[];
    /** The compact hint's size in tokens, a line where the axis reaches it. */
    hintTokens: number;
    /** The chart's name for a screen reader. */
    label: string;
    /** The container's width, which the drawing is scaled to fit. */
    containerWidth: number;
  } = $props();

  const width = $derived(chartWidth(containerWidth));
  const max = $derived(contextMax(turns));
  const yOf = $derived(contextY(max));
  const contexts = $derived(turns.map((turn) => turn.context));

  const cursor: ChartCursor = $derived({
    count: turns.length,
    label: 'Context per turn by part; arrow keys step through the turns',
    valueText: (index) => turnValueText(turns, index),
    area: (drawn) => ({ x: LEFT_AXIS, y: 0, width: drawn - RIGHT_PAD - LEFT_AXIS, height: CONTEXT_BOTTOM }),
    indexAt: (drawn) => nearestIndex(LEFT_AXIS, drawn - RIGHT_PAD, turns.length),
    tipX: (drawn, index) => lineX(turns.length, LEFT_AXIS, drawn - RIGHT_PAD)(index),
  });
</script>

<Chart height={CONTEXT_HEIGHT} {label} {width} {containerWidth} {cursor} {plot} {marks} {tip} />

{#snippet plot(drawn: number)}
  {@const right = drawn - RIGHT_PAD}
  {@const xOf = lineX(turns.length, LEFT_AXIS, right)}
  {@const hint = hintLine(hintTokens, max, yOf)}
  {@const rules = compactionRules(compactions, turns, xOf)}
  <YAxis left={LEFT_AXIS} {right} values={ticks(max, 4)} {yOf} format={compact} />
  {#each stackShapes(turns, xOf, yOf) as shape (shape.part.field)}
    {#if shape.kind === 'area'}
      <path d={shape.area} fill={shape.part.color} />
      <path d={shape.edge} fill="none" stroke="var(--surface)" stroke-width="2" stroke-linejoin="round" />
    {:else}
      <!-- a single turn has no width: a short column instead -->
      <rect x={shape.x} y={shape.y} width={shape.width} height={shape.height} fill={shape.part.color} />
    {/if}
  {/each}
  <line x1={xOf(0)} x2={xOf(turns.length - 1)} y1={CONTEXT_BOTTOM} y2={CONTEXT_BOTTOM} stroke="var(--axis)" />
  {#if hint}
    <line x1={LEFT_AXIS} x2={right} y1={hint.y} y2={hint.y} class="reference-line" />
    <text x={right + 6} y={hint.y + 4} class="axis-text">{hint.text}</text>
  {/if}
  {#each rules as rule (rule.key)}
    <line x1={rule.x} x2={rule.x} y1={CONTEXT_TOP - 4} y2={CONTEXT_BOTTOM} class="compaction-rule" />
    {#if rule.label}
      <text x={rule.x} y={CONTEXT_TOP - 8} text-anchor="middle" class="axis-text">{rule.label}</text>
    {/if}
  {/each}
  <!-- direct labels on the two totals that matter: the peak and the latest turn -->
  {#each endLabels(contexts, xOf, yOf, rules.map((rule) => rule.x)) as end (end.key)}
    <text x={end.x} y={end.y} text-anchor={end.anchor} class="value-text">{end.text}</text>
  {/each}
  <XLabels
    count={turns.length}
    {xOf}
    y={CONTEXT_BOTTOM + 18}
    text={(index) => (index === 0 ? 'turn 1' : String(index + 1))}
    most={6}
  />
{/snippet}

{#snippet marks(drawn: number, index: number)}
  {@const x = lineX(turns.length, LEFT_AXIS, drawn - RIGHT_PAD)(index)}
  <line class="crosshair" x1={x} x2={x} y1={CONTEXT_TOP} y2={CONTEXT_BOTTOM} />
  <PointDot {x} y={yOf(contexts[index] ?? 0)} color="var(--context-new)" />
{/snippet}

{#snippet tip(index: number)}
  {@const turn = turns[index]}
  {#if turn}
    <div class="when">{turnTitle(turns, index)}</div>
    {#each CONTEXT_PARTS.toReversed() as part (part.field)}
      <div class="row">
        <Swatch fill={part.color} />
        <strong>{compact(turn[part.field])}</strong>
        <span class="name">{part.label}</span>
      </div>
    {/each}
    <div class="row">
      <span class="key"></span>
      <strong>{compact(turn.context)}</strong>
      <span class="name">context</span>
    </div>
    {#each turnNotes(turn) as note (note)}
      <div class="name">{note}</div>
    {/each}
  {/if}
{/snippet}
