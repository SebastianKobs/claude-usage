<!--
@component
The session view's gauge and the calls above it, read from the page's payload: nothing without an open session that has
a main thread's gauge. The call to compact (for a live session past the compact hint, or once the cache has expired
and compacting first saves at once) and the hint to delegate exploration come first, then the gauge: the context
against the auto-compact point with the compact hint marked, or after a compaction without a reply since the
compaction itself, and under it what compacting now would cost. The cache's clock is an external subscription
(`cacheClock`): the call, its words and the notes turn once when the cache expires, and the gauge card stays the same
node, as it does while the session refreshes.
-->
<script lang="ts">
  import { getApp } from '../lib/app.svelte';
  import { cacheClock } from '../lib/clock.svelte';
  import { compactCallKind, delegateCallShown } from '../lib/compact';
  import { compactCall, compactNotes, delegateCall, gaugeCard } from '../lib/gauge';
  import CompactCall from './CompactCall.svelte';
  import DelegateCall from './DelegateCall.svelte';

  const { payload } = getApp();

  const session = $derived(payload.session);
  const current = $derived(session?.current ?? null);
  const until = $derived(current?.compact_now?.cache_warm_until ?? null);
  // a string is the same value for a refresh that changes nothing of it, which keeps the clock (and its timer)
  const clock = $derived(cacheClock(until));
  const kind = $derived(session ? compactCallKind(session, clock.now) : null);
  const call = $derived(current && kind ? compactCall(current, kind, clock.expired) : null);
  const delegate = $derived(session && current && delegateCallShown(session) ? delegateCall(current) : null);
  const card = $derived(current ? gaugeCard(current) : null);
  const notes = $derived(
    card?.kind === 'meter' && current?.compact_now ? compactNotes(current.compact_now, clock.expired) : null,
  );
</script>

{#if card}
  {#if call}
    <CompactCall {call} />
  {/if}
  {#if delegate}
    <DelegateCall call={delegate} />
  {/if}
  <div class="card gauge-card" id="current-gauge">
    <div class="label">{card.label}</div>
    <div class="tile-value">{card.value} <span class="secondary">{card.secondary}</span></div>
    {#if card.kind === 'meter'}
      <div
        class="gauge"
        role="meter"
        aria-valuemin="0"
        aria-valuemax={card.max}
        aria-valuenow={card.now}
        aria-label={card.meterLabel}
      >
        <span class="gauge-fill" style:width={card.fill}></span>
        {#if card.hintAt !== null}
          <span class="gauge-hint" style:left={card.hintAt}></span>
        {/if}
      </div>
    {/if}
    <div class="note">{card.note}</div>
    {#if notes}
      <div class="note">{notes.exact}</div>
      {#if notes.estimate}
        {@const estimate = notes.estimate}
        <p class="compact-estimate">
          {estimate.lead}{#if estimate.tone}<span
              class="payoff-mark payoff-{estimate.tone}"
              aria-hidden="true"
            ></span>{/if}<strong>{estimate.phrase}</strong>{estimate.rest}
        </p>
      {:else if notes.missing}
        <div class="note">{notes.missing}</div>
      {/if}
    {/if}
  </div>
{/if}
