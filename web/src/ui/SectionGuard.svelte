<!--
@component
One section of the page that can fail on its own: an error while drawing its `children`, first or with new data, puts a
card in its place naming the section and the reason, with a button to draw it again, and a banner line while that card
shows. Errors in event handlers and async work aren't caught here (the loader catches its own).
-->
<script lang="ts">
  import type { Snippet } from 'svelte';
  import { getApp } from '../app/app.svelte';
  import { announceFailure, drawFailure } from './guard';

  let {
    name,
    children,
  }: {
    /** The section's name in words, as its failure card and the banner say it. */
    name: string;
    /** The section. */
    children: Snippet;
  } = $props();

  const { messages } = getApp();
  const id = $props.id();

  /** Logs what went wrong, with its stack, for whoever opens the console: the card shows only the message. */
  function onerror(error: unknown): void {
    // still a console error, so the browser check fails on it as it did on the uncaught one before
    console.error(error);
  }
</script>

<svelte:boundary {onerror}>
  {@render children()}

  {#snippet failed(error, reset)}
    <div class="card draw-failed" {@attach announceFailure(messages, name, error)}>
      <p id="{id}-reason">{drawFailure(name, error)}</p>
      <button type="button" aria-describedby="{id}-reason" onclick={reset}>Try again</button>
    </div>
  {/snippet}
</svelte:boundary>
