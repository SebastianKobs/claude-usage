<!--
@component
A chart's y axis as a fragment of SVG: a one-pixel gridline from `left` to `right` at each value (the first, 0, in the
axis color, the others in the grid color) and its label, right-aligned left of the plot. `yOf` maps a value to y.
-->
<svelte:options namespace="svg" />

<script lang="ts">
  import { gridY } from '../lib/chartkit';

  let {
    left,
    right,
    values,
    yOf,
    format,
  }: {
    left: number;
    right: number;
    values: number[];
    yOf: (value: number) => number;
    format: (value: number) => string;
  } = $props();
</script>

{#each values as value, position (value)}
  {@const y = gridY(yOf(value))}
  <line x1={left} x2={right} y1={y} y2={y} stroke-width="1" stroke={position === 0 ? 'var(--axis)' : 'var(--grid)'} />
  <text x={left - 8} y={y + 4} text-anchor="end" class="axis-text">{format(value)}</text>
{/each}
