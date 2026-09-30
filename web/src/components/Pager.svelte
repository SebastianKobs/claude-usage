<!--
@component
A table's pager: the page size (kept as a preference, applied to every pager at once), previous and next, and which
rows show, named by `noun`. It only pages: the table or card grid that owns the rows draws the page it shows
(`shownWindow`).
-->
<script lang="ts">
  import { flushSync } from 'svelte';
  import { getApp } from '../lib/app.svelte';
  import type { PagerProps } from '../lib/paging.svelte';
  import { keepScroll, scrollAnchor } from '../lib/scroll';
  import { PAGE_SIZES, pageText, pageWindow } from '../lib/tables';

  let { key, noun, units }: PagerProps = $props();
  const { pages, preferences, shownWindow } = getApp();

  const count = $derived((units.at(-1) ?? -1) + 1);
  // The table's stored first unit on the current page size: the page that holds it.
  const shown = $derived(shownWindow(key, count));
  const nounLabel = $derived(`${noun.charAt(0).toUpperCase()}${noun.slice(1)}`);

  // Drawn again after the rows shrank, the stored page may lie beyond the end: what shows is stored, so the
  // pager's page and the stored one agree. Once, at the start, not in an effect.
  function storeShown(): void {
    if (pages.first(key) !== shown.first) pages.set(key, shown.first);
  }
  storeShown();

  // The pager stays where it was on the screen while the tables above it grow or shrink.
  function turn(control: HTMLElement, page: number): void {
    const root = control.closest('.pager');
    const anchor = scrollAnchor(root ? [root] : []);
    pages.set(key, pageWindow(count, preferences.pageSize, page).first);
    flushSync();
    keepScroll(anchor, root);
  }

  // Every mounted pager reads the preference, so they all page again; only this one is kept in place on the screen,
  // and each keeps the page holding the first unit it showed.
  function resize(control: HTMLElement, size: number): void {
    const root = control.closest('.pager');
    const anchor = scrollAnchor(root ? [root] : []);
    preferences.pageSize = size;
    flushSync();
    keepScroll(anchor, root);
  }
</script>

<div class="pager" role="group" aria-label="Pages">
  <select
    id="pager-{key}-size"
    aria-label="{nounLabel} per page"
    value={preferences.pageSize}
    onchange={(event) => resize(event.currentTarget, Number(event.currentTarget.value))}
  >
    {#each PAGE_SIZES as size (size)}
      <option value={size}>{size} {noun}</option>
    {/each}
  </select>
  <button
    type="button"
    id="pager-{key}-previous"
    disabled={shown.page === 0}
    onclick={(event) => turn(event.currentTarget, shown.page - 1)}>‹ Previous</button
  >
  <span class="muted" aria-live="polite">{pageText(shown, count, noun)}</span>
  <button
    type="button"
    id="pager-{key}-next"
    disabled={shown.page === shown.pages - 1}
    onclick={(event) => turn(event.currentTarget, shown.page + 1)}>Next ›</button
  >
</div>
