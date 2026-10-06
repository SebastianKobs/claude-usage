<!--
@component
The page's range filter, drawn into its mount target (it is no section of its own): a button for each range the store
keeps, the pressed one marked, and while the Daily range is pressed the day's arrows right after its button. The range
is the app's `range` (range.svelte.ts) and the ranges on offer follow the summary's retention, so every button shows
before a summary is loaded. A button reloads the page's data even where it is pressed already, as looking again. The
arrows go to the nearest days with usage, which the summary of the day shown names; they are disabled without one,
and while another day is still loading.
-->
<script lang="ts">
  import { getApp } from './app.svelte';
  import { dayText } from '../ui/format';
  import { dayLabel, shownDay, visibleRanges } from './range';

  const { payload, range } = getApp();

  const options = $derived(visibleRanges(payload.summary?.retention_days));
  const shown = $derived(shownDay(payload.summary, range.day, dayText(new Date())));
</script>

<span class="label">Range</span>
<div class="segmented">
  {#each options as option (option.days)}
    <button type="button" aria-pressed={range.days === option.days} onclick={() => range.select(option.days)}>
      {option.label}
    </button>
    {#if option.days === 1 && range.days === 1}
      <div class="day-nav" role="group" aria-label="Day">
        <button
          type="button"
          aria-label="Previous day"
          disabled={!shown?.previous_day}
          onclick={() => range.step('previous_day', payload.summary)}>‹</button
        >
        <output aria-live="polite">{dayLabel(range.day)}</output>
        <button
          type="button"
          aria-label="Next day"
          disabled={!shown?.next_day}
          onclick={() => range.step('next_day', payload.summary)}>›</button
        >
      </div>
    {/if}
  {/each}
</div>
