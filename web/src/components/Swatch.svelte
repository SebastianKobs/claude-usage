<!--
@component
A color swatch: a small square in `fill` (any CSS background), the default swatch for null. The by-model section's
legend and tooltip draw it (a hatched series' fill is a gradient); the old scripts build the swatches of the sections
that have not moved yet as DOM strings.
-->
<script lang="ts">
  let { fill }: { fill: string | null } = $props();
</script>

<span class="swatch" style:background={fill}></span>
