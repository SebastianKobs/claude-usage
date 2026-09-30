<!--
@component
A color swatch: a small square in `fill` (any CSS background), the default swatch for null. The by-model section's
legend and tooltip and the usage tables' model rows draw it (a hatched series' fill is a gradient).
-->
<script lang="ts">
  let { fill }: { fill: string | null } = $props();
</script>

<span class="swatch" style:background={fill}></span>
