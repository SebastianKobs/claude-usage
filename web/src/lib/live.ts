// What a live card shows besides its totals, as badges: a session waiting for the user, a possible secret access,
// compacting now. A badge has a kind (its icon), a tone (a class suffix, or null) and the words its icon's hover
// shows. Also what waits while another session's view hides the live list.

import type { Gauge, LiveSession, SecretCounts, SessionDetail, Waiting } from './api.ts';
import { compactCallKind, PAYOFF_WORDS, payoffTone } from './compact.ts';
import { compact, money, when, whole } from './format.ts';

export type BadgeKind = 'permission' | 'waiting' | 'secret' | 'compact';

export interface LiveBadge {
  kind: BadgeKind;
  tone: string | null;
  text: string;
  /** The compact states it shows, which serve's desktop notifications hold to (`notify.compact_states`). */
  states?: string[];
}

/**
 * A session waiting for the user (`waiting` in /api/live: a question or a plan to approve without its result yet, or a
 * call a permission prompt asks about) as a badge in the waiting tone, which the card shows first: a speech bubble for
 * a question, a padlock for a permission; null while it waits for nothing.
 */
export function liveWaitBadge(waiting: Waiting | null): LiveBadge | null {
  if (!waiting) return null;
  const since = ` since ${when(waiting.since)}`;
  if (waiting.kind === 'permission') {
    const agent = waiting.agent_type ? ` (a ${waiting.agent_type} subagent)` : '';
    return {
      kind: 'permission',
      tone: 'waiting',
      text: `Waiting for your permission to use ${waiting.tool}${agent}${since}`,
    };
  }
  const what = waiting.tool === 'ExitPlanMode' ? 'you to approve the plan' : 'your answer';
  return { kind: 'waiting', tone: 'waiting', text: `Waiting for ${what}${since}` };
}

/** The session's calls that named a possible secret location, only from medium up (`secretTone`'s warning and alert):
 *  one sent out makes it high, else one that returned a result or may still makes it medium; null below that. */
export function liveSecretBadge(secrets: Partial<SecretCounts>): LiveBadge | null {
  const high = secrets.high ?? 0;
  const medium = secrets.medium ?? 0;
  if (!high && !medium) return null;
  const calls = (count: number): string => (count === 1 ? '1 call' : `${whole(count)} calls`);
  const reached = high
    ? `${calls(high)} sent out${medium ? `, ${whole(medium)} more returned a result or may still` : ''}`
    : `${calls(medium)} returned a result or may still`;
  return { kind: 'secret', tone: high ? 'high' : 'medium', text: `Possible secret access: ${reached}` };
}

/**
 * Compacting now, in the tone and words of the session view's estimate (`payoffTone`, `PAYOFF_WORDS`): when it pays
 * off against the replies still ahead on average, or what it saves at once where the call to compact says so
 * (`compactCallKind` "cold"), and past the compact hint; null without a gauge, where it would never pay off or only
 * once the context has grown (too early: nothing to do yet), without calls ahead to compare with where it doesn't pay
 * off within the longest finished stretch, or below the hint without an estimate.
 */
export function liveCompactBadge(current: Gauge | null, now: string): LiveBadge | null {
  const preview = current ? current.compact_now : null;
  if (!current || !preview) return null;
  const hint =
    current.context >= current.hint_tokens ? `Past your ${compact(current.hint_tokens)} compact hint.` : null;
  const hinted = hint ? ['hint'] : [];
  const hintOnly = (): LiveBadge | null =>
    hint ? { kind: 'compact', tone: null, text: hint, states: hinted } : null;
  const estimate = preview.estimate;
  if (!estimate) return hintOnly();
  const until = preview.cache_warm_until;
  const expired = until !== null && Date.parse(until) < Date.parse(now);
  const tone = payoffTone(estimate, expired);
  const badge = (state: string, words: string): LiveBadge => ({
    kind: 'compact',
    tone,
    text: [words, hint].filter(Boolean).join(' '),
    states: [state, ...hinted],
  });
  if (compactCallKind({ live: true, current }, now) === 'cold') {
    return badge('cold', `Compacting now saves ~${money(estimate.cold_saving)} at once: the cache has expired.`);
  }
  if (tone === 'later') return hintOnly();
  const breakeven = expired ? estimate.breakeven_cold : estimate.breakeven_calls;
  // without calls ahead to compare with, only a break-even within the longest finished stretch is worth an icon:
  // right after a compaction the context is small, which puts it far off, or out of reach at the median estimate
  const ahead = estimate.calls_ahead ?? null;
  const longest = estimate.calls_after_high ?? null;
  if (ahead === null && (breakeven === null || longest === null || breakeven > longest)) return hintOnly();
  if (breakeven === null) {
    if (expired || estimate.breakeven_low === null) return hintOnly();
    return badge('unlikely', 'Compacting now would likely not pay off.');
  }
  const replies = `pays off after ~${whole(breakeven)} replies`;
  if (!tone || ahead === null) return badge('pays', `Compacting now ${replies}.`);
  return badge(
    tone,
    `${PAYOFF_WORDS[tone]}: compacting now ${replies}, ~${whole(Math.round(ahead))} ahead on average.`,
  );
}

/** A live card's state as badges: a possible secret access first, as in the session view, then compacting now. */
export function liveStateBadges(
  sessionState: { current: Gauge | null; secrets: Partial<SecretCounts> },
  now: string,
): LiveBadge[] {
  const badges = [liveSecretBadge(sessionState.secrets), liveCompactBadge(sessionState.current, now)];
  return badges.filter((badge): badge is LiveBadge => badge !== null);
}

/** What waits for the user, and which session: a wait badge with the session's id and title (null for the open one,
 *  whose view says "This session"). */
export type SessionWait = LiveBadge & { session_id: string; title: string | null };

/**
 * What waits for the user while a session is open, whose view hides the live list: the open session's own wait first
 * (its `waiting` in /api/session), then the other live sessions' (the latest /api/live), each as its wait badge with
 * its session; the open one's entry in the list is left out, since the list may answer before or after it.
 */
export function sessionWaits(
  detail: Pick<SessionDetail, 'session_id' | 'waiting'>,
  sessions: Pick<LiveSession, 'session_id' | 'title' | 'waiting'>[],
): SessionWait[] {
  const ownBadge = liveWaitBadge(detail.waiting);
  const own = ownBadge ? [{ ...ownBadge, session_id: detail.session_id, title: null }] : [];
  const others: SessionWait[] = [];
  for (const session of sessions) {
    const badge = session.session_id === detail.session_id ? null : liveWaitBadge(session.waiting);
    if (badge) others.push({ ...badge, session_id: session.session_id, title: session.title || 'Untitled session' });
  }
  return [...own, ...others];
}

/** Whether the live list says the open session waits otherwise than its view shows (nothing where the list leaves it
 *  out): then the view asks at once, not at its next poll, a minute away while the session was quiet. */
export function waitChanged(
  detail: Pick<SessionDetail, 'session_id' | 'waiting'>,
  sessions: Pick<LiveSession, 'session_id' | 'waiting'>[],
): boolean {
  const entry = sessions.find((session) => session.session_id === detail.session_id);
  return entry !== undefined && JSON.stringify(entry.waiting ?? null) !== JSON.stringify(detail.waiting ?? null);
}
