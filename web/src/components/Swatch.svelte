<!--
@component
A color swatch: a small square in `fill` (any CSS background), the default swatch for null. Nothing draws it yet: the
old scripts build their swatches as DOM strings until the sections that draw them move to components (3.16 on).
-->
<script lang="ts">
  let { fill }: { fill: string | null } = $props();
</script>

<span class="swatch" style:background={fill}></span>
