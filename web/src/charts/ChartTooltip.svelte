<!--
@component
A chart's tooltip: `div.tooltip` with its content, beside `anchor` (px from the container's left edge) and `top` px
from its top. It is placed by an attachment: left of the container's right edge, never left of its left one (the
container is the parent, which the stylesheet makes `position: relative`). Sizes are read once the tooltip is in the
page, and again when `anchor` or `top` changes.
-->
<script lang="ts">
  import type { Snippet } from 'svelte';
  import { tooltipLeft } from './chartkit';

  let { anchor, top = 8, children }: { anchor: number; top?: number; children: Snippet } = $props();

  // Through the CSSOM, which a strict CSP allows, unlike a style attribute.
  function place(tooltip: HTMLElement): void {
    const containerWidth = tooltip.parentElement?.clientWidth ?? 0;
    tooltip.style.left = `${tooltipLeft(anchor, tooltip.offsetWidth, containerWidth)}px`;
    tooltip.style.top = `${top}px`;
  }
</script>

<div class="tooltip" {@attach place}>{@render children()}</div>
