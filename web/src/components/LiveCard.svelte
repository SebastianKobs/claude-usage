<!--
@component
A live session's card: its title linking to the session view, what it waits for (a padlock or a speech bubble, first),
the icons of its state (a possible secret access, compacting now) where its state is loaded, the project, branch and how
long ago it changed, its totals and the subagents at work (or that there are none). "Ago" counts from `now`, the time of
the newest live answer, so a card unchanged between answers still moves on.
-->
<script lang="ts">
  import type { LiveSession, SessionState } from '../lib/api';
  import { sessionHref, sessionName } from '../lib/costly';
  import { ago, compact, money, whole } from '../lib/format';
  import { liveStateBadges, liveWaitBadge } from '../lib/live';
  import LiveIcon from './LiveIcon.svelte';

  let {
    session,
    sessionState,
    now,
  }: {
    /** The live session. */
    session: LiveSession;
    /** What /api/session/<id>/state gave, undefined until it is loaded. */
    sessionState: SessionState | undefined;
    /** The time "ago" counts from, in ms since the epoch. */
    now: number;
  } = $props();

  const waitBadge = $derived(liveWaitBadge(session.waiting));
  // A cache that expires since the state was loaded changes its badges, so they are worked out from the time given.
  const badges = $derived(sessionState ? liveStateBadges(sessionState, new Date(now).toISOString()) : []);
  const numbers = $derived([
    { label: 'Turns', value: whole(session.turns) },
    { label: 'Output', value: compact(session.output) },
    { label: 'Last context', value: compact(session.last_context) },
    { label: 'Cost', value: money(session.cost) },
  ]);
</script>

<div class="live-card">
  <div class="live-head">
    <div class="title">
      <span class="dot" aria-hidden="true"></span><a href={sessionHref(session)}>{sessionName(session)}</a>
    </div>
    {#if waitBadge}
      <LiveIcon badge={waitBadge} />
    {/if}
    <div class="live-states">
      {#each badges as badge (badge.kind)}
        <LiveIcon {badge} />
      {/each}
    </div>
  </div>
  <div class="muted">
    {session.project}{session.git_branch ? ` · ${session.git_branch}` : ''} · {ago(session.last_activity, now)}
  </div>
  <div class="numbers">
    {#each numbers as number (number.label)}
      <div><span class="label">{number.label}</span><strong>{number.value}</strong></div>
    {/each}
  </div>
  {#if session.subagents.length}
    <ul>
      {#each session.subagents as agent (agent.agent_id)}
        <li>
          <strong>{agent.agent_type}</strong>
          <span class="secondary">{agent.description || ''}</span><span class="sub muted"
            >{agent.model || '–'} · {whole(agent.turns)} turns · context {compact(agent.last_context)} · {ago(
              agent.last_activity,
              now,
            )}</span
          >
        </li>
      {/each}
    </ul>
  {:else}
    <div class="note">No subagent running</div>
  {/if}
</div>
