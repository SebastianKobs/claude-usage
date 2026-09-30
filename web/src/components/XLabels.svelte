<!--
@component
The labels under a chart's x axis as a fragment of SVG: evenly spaced, at most about `most` of the `count` buckets,
each centered on `xOf(index)` at height `y`, reading `text(index)`.
-->
<svelte:options namespace="svg" />

<script lang="ts">
  import { xLabelIndexes } from '../lib/chartkit';

  let {
    count,
    xOf,
    y,
    text,
    most,
  }: {
    count: number;
    xOf: (index: number) => number;
    y: number;
    text: (index: number) => string;
    most?: number;
  } = $props();
</script>

{#each xLabelIndexes(count, most) as index (index)}
  <text x={xOf(index)} {y} text-anchor="middle" class="axis-text">{text(index)}</text>
{/each}
