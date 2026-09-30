<!--
@component
A stat tile: a label the theme words, a value and, where there is one, a note under it. A `themedNote` is worded by the
theme too (the Turns tile's "API calls with usage"); a plain note is shown as given.
-->
<script lang="ts">
  import { getApp } from '../lib/app.svelte';

  let {
    label,
    value,
    note = null,
    themedNote = false,
  }: { label: string; value: string; note?: string | null; themedNote?: boolean } = $props();

  const { hype } = getApp();
</script>

<div class="card">
  <div class="label">{hype(label)}</div>
  <div class="tile-value">{value}</div>
  {#if note}
    <div class="note">{themedNote ? hype(note) : note}</div>
  {/if}
</div>
