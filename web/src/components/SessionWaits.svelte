<!--
@component
The notice at the top of the session view that says what waits for the user, since the live list, whose cards show it
otherwise, is hidden while a session is open: the open session's own wait ("This session is waiting for your answer…"),
then each other live session's, linked. Read from the page's payload (the open session and the latest live answer). A
status that is always in the page and hidden while nothing waits, so a screen reader hears a wait appear.
-->
<script lang="ts">
  import { sessionHref } from '../lib/costly';
  import { sessionWaits } from '../lib/live';
  import { payload } from '../lib/payload.svelte';
  import LiveIcon from './LiveIcon.svelte';

  const session = $derived(payload.session);
  const waits = $derived(session ? sessionWaits(session, payload.live?.sessions ?? []) : []);
</script>

<div class="card wait-notice" role="status" hidden={waits.length === 0}>
  {#each waits as wait (wait.session_id)}
    <p class="wait-line">
      <span class="wait-icon"><LiveIcon badge={wait} /></span>
      {#if wait.title === null}
        <strong>This session is {wait.text.charAt(0).toLowerCase()}{wait.text.slice(1)}</strong>
      {:else}
        <span><a href={sessionHref(wait)}>{wait.title}</a>: {wait.text}</span>
      {/if}
    </p>
  {/each}
</div>
