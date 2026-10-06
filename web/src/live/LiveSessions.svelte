<!--
@component
The overview's live sessions card, read from the page's payload: a card for each session that changed lately, most
recent first, in a grid, with notes where serve couldn't open the permission hook's socket or find a notifier. The
heading says how lately a session must have changed (and that one waiting for the user stays on the list), and which
past day the list was kept by. Past ten sessions the grid is paged, its pager sharing the heading's row, each card its
own unit, and the page is kept across refreshes: the cards are keyed by session, so a refresh keeps their nodes and the
focus inside them. "Ago" counts from the time of the newest live answer, even an unchanged one. Without an answer the
card says it is loading, or that loading failed.
-->
<script lang="ts">
  import { getApp } from '../app/app.svelte';
  import { dayText } from '../ui/format';
  import { liveEmpty, liveWindow } from './live';
  import { PAGE_SIZES, pageUnits } from '../ui/tables';
  import LiveCard from './LiveCard.svelte';
  import Pager from '../ui/Pager.svelte';

  const { payload, hype, shownWindow } = getApp();

  const KEY = 'live';

  const live = $derived(payload.live);
  const now = $derived(payload.liveAt ?? Date.now());
  const today = $derived(dayText(new Date(now)));
  const sessions = $derived(live?.sessions ?? []);
  // Every card is a unit of its own.
  const units = $derived(pageUnits(sessions.map(() => false)));
  const count = $derived(sessions.length);
  // The window is clamped, so a stored page beyond the end of a shrunken list shows the last page.
  const shown = $derived(shownWindow(KEY, count));
  const onPage = $derived(sessions.slice(shown.first, shown.last));
  const paged = $derived(count > PAGE_SIZES[0]!);
</script>

<section class="card" aria-labelledby="live-title">
  {#if paged}
    <div class="title-row">
      {@render heading()}
      <Pager key={KEY} noun="sessions" {units} />
    </div>
  {:else}
    {@render heading()}
  {/if}
  {#if !live}
    <div class="empty">{payload.liveFailed ? 'Could not load the live sessions.' : 'Loading…'}</div>
  {:else}
    {#if live.prompts_unavailable}
      <!-- the hook's socket couldn't be opened: Claude Code still asks, only no padlock shows it -->
      <div class="note">Permission prompts can't show here: {live.prompts_unavailable}.</div>
    {/if}
    {#if live.notifications_unavailable}
      <!-- serve found no notifier, or it failed; switched off in the config, they say nothing -->
      <div class="note">Desktop notifications can't show: {live.notifications_unavailable}.</div>
    {/if}
    {#if onPage.length}
      <div class="live-grid">
        {#each onPage as session (session.session_id)}
          <LiveCard {session} sessionState={payload.liveState(session.session_id)} {now} />
        {/each}
      </div>
    {:else}
      <div class="empty">{liveEmpty(live, today)}</div>
    {/if}
  {/if}
</section>

{#snippet heading()}
  <h2 id="live-title">
    <span>{hype('Live sessions')}</span>
    <span class="muted">{live ? liveWindow(live, today) : ''}</span>
  </h2>
{/snippet}
