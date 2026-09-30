<!--
@component
A line over `values` (one per bucket, `xOf` and `yOf` place them) in `color`, with a faint area below it down to
`bottom`, as a fragment of SVG. Nothing is drawn without values.
-->
<svelte:options namespace="svg" />

<script lang="ts">
  let {
    values,
    xOf,
    yOf,
    bottom,
    color,
  }: {
    values: number[];
    xOf: (index: number) => number;
    yOf: (value: number) => number;
    bottom: number;
    color: string;
  } = $props();

  const points = $derived(values.map((value, index) => `${xOf(index).toFixed(1)},${yOf(value).toFixed(1)}`).join('L'));
  const area = $derived(`M${xOf(0)},${bottom}L${points}L${xOf(values.length - 1)},${bottom}Z`);
</script>

{#if values.length}
  <path d={area} fill={color} fill-opacity="0.1" />
  <path d="M{points}" fill="none" stroke={color} stroke-width="2" stroke-linejoin="round" stroke-linecap="round" />
{/if}
