<!--
@component
A point on a line: a dot of `color` at (`x`, `y`), ringed in the surface color so it stays clear of the line.
-->
<svelte:options namespace="svg" />

<script lang="ts">
  let { x, y, color }: { x: number; y: number; color: string } = $props();
</script>

<circle cx={x} cy={y} r="4" fill={color} stroke="var(--surface)" stroke-width="2" />
