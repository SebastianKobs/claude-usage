<!--
@component
A chart's frame, a fragment for the page's `<div class="chart">` (which the section measures: `width` is the drawing's,
`containerWidth` the container's, the SVG being scaled to fit it). It draws the SVG, whose `<g role="img">` holds
the section's `plot` and, while a bucket is active, its `marks` (crosshair, highlight, dots); then, beside that group
and not in it (an image's children are presentational, which would hide it from a screen reader), one focusable
layer, a slider over the `cursor`'s buckets. The pointer picks the bucket under it; arrow keys step, Page Up and Down
jump a tenth, Home and End go to the ends, and a screen reader reads `valueText` at each step. While a bucket is
active the `tip` shows in a tooltip beside it. Without a `cursor` (or with no buckets) there is no layer.
-->
<script lang="ts" module>
  /** What a chart's cursor needs to know of its buckets, in the drawing's coordinates. */
  export interface ChartCursor {
    /** How many buckets there are. */
    count: number;
    /** The slider's name. */
    label: string;
    /** What a screen reader reads for a bucket. */
    valueText: (index: number) => string;
    /** The rectangle of the cursor layer, which takes the pointer and the focus. */
    area: (width: number) => { x: number; y: number; width: number; height: number };
    /** The bucket under x (in the drawing's coordinates). */
    indexAt: (width: number) => (x: number) => number;
    /** Where the tooltip's anchor is for a bucket, in the drawing's coordinates. */
    tipX: (width: number, index: number) => number;
  }
</script>

<script lang="ts">
  import type { Snippet } from 'svelte';
  import { chartScale, cursorStep, pointerX } from './chartkit';
  import ChartTooltip from './ChartTooltip.svelte';

  let {
    height,
    label,
    width,
    containerWidth,
    plot,
    marks,
    tip,
    cursor,
    tipTop,
  }: {
    height: number;
    label: string;
    width: number;
    containerWidth: number;
    plot: Snippet<[width: number]>;
    marks?: Snippet<[width: number, index: number]>;
    tip?: Snippet<[index: number]>;
    cursor: ChartCursor | null;
    tipTop?: number;
  } = $props();

  const last = $derived((cursor?.count ?? 0) - 1);
  // The bucket last picked, else the last one; kept within the buckets as their number changes.
  let picked = $state<number | null>(null);
  const current = $derived(picked === null ? last : Math.min(picked, last));
  // The bucket shown, null while the cursor is away.
  let active = $state<number | null>(null);
  const shown = $derived(active === null || last < 0 ? null : Math.min(active, last));
  const area = $derived(cursor?.area(width));

  function move(index: number): void {
    picked = Math.min(Math.max(0, index), last);
    active = picked;
  }

  function point(event: PointerEvent & { currentTarget: SVGRectElement }): void {
    const bounds = event.currentTarget.ownerSVGElement?.getBoundingClientRect();
    if (!cursor || !bounds) return;
    move(cursor.indexAt(width)(pointerX(event.clientX, bounds.left, bounds.width, width)));
  }

  function press(event: KeyboardEvent): void {
    if (!cursor) return;
    const index = cursorStep(event.key, current, cursor.count);
    if (index === null) return;
    move(index);
    event.preventDefault();
  }
</script>

<svg viewBox="0 0 {width} {height}" {height}>
  <g role="img" aria-label={label}>
    {@render plot(width)}
    {#if shown !== null}
      {@render marks?.(width, shown)}
    {/if}
  </g>
  {#if cursor && area && last >= 0}
    <rect
      class="hit"
      x={area.x}
      y={area.y}
      width={Math.max(1, area.width)}
      height={area.height}
      tabindex="0"
      role="slider"
      aria-label={cursor.label}
      aria-valuemin="1"
      aria-valuemax={cursor.count}
      aria-valuenow={current + 1}
      aria-valuetext={cursor.valueText(current)}
      onpointermove={point}
      onfocus={() => move(current)}
      onkeydown={press}
      onpointerleave={() => (active = null)}
      onblur={() => (active = null)}
    />
  {/if}
</svg>
{#if cursor && shown !== null && tip}
  <ChartTooltip anchor={cursor.tipX(width, shown) * chartScale(containerWidth, width)} top={tipTop}>
    {@render tip(shown)}
  </ChartTooltip>
{/if}
