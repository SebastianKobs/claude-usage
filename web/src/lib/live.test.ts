import { expect, test } from 'vitest';
import type { CompactEstimate, Gauge, LiveSession, SecretCounts, SessionDetail, Waiting } from './api.ts';
import {
  liveCompactBadge,
  liveEmpty,
  liveSecretBadge,
  livePastDay,
  liveStateBadges,
  liveWaitBadge,
  liveWindow,
  sessionWaits,
  waitChanged,
} from './live.ts';

const NOW = '2026-09-28T12:00:00.000+00:00';
const WARM = '2026-09-28T12:30:00.000+00:00';
const EXPIRED = '2026-09-28T11:00:00.000+00:00';

const QUESTION: Waiting = { kind: 'question', tool: 'AskUserQuestion', since: NOW, agent_type: null };
const PERMISSION: Waiting = { kind: 'permission', tool: 'Write', since: NOW, agent_type: null };

test('a question without an answer waits for the user', () => {
  const badge = liveWaitBadge(QUESTION);
  expect([badge?.kind, badge?.tone]).toEqual(['waiting', 'waiting']);
  expect(badge?.text).toMatch(/^Waiting for your answer since /);
});

test('a plan waits for its approval', () => {
  expect(liveWaitBadge({ ...QUESTION, tool: 'ExitPlanMode' })?.text).toMatch(
    /^Waiting for you to approve the plan since /,
  );
});

test('a permission prompt waits with its own icon in the same tone, a subagent named', () => {
  const badge = liveWaitBadge({ ...PERMISSION, tool: 'Bash' });
  expect([badge?.kind, badge?.tone]).toEqual(['permission', 'waiting']);
  expect(badge?.text).toMatch(/^Waiting for your permission to use Bash since /);
  expect(liveWaitBadge({ ...PERMISSION, agent_type: 'general-purpose' })?.text).toMatch(
    /^Waiting for your permission to use Write \(a general-purpose subagent\) since /,
  );
});

test('a session waiting for nothing has no wait badge', () => {
  expect(liveWaitBadge(null)).toBeNull();
});

test('a possible secret access shows only from medium up, high where one was sent out', () => {
  expect(liveSecretBadge({ high: 0, medium: 0, 'low-medium': 4, low: 9 })).toBeNull();
  expect(liveSecretBadge({})).toBeNull();
  expect(liveSecretBadge({ medium: 1 })).toEqual({
    kind: 'secret',
    tone: 'medium',
    text: 'Possible secret access: 1 call returned a result or may still',
  });
  expect(liveSecretBadge({ high: 2, medium: 3 })).toEqual({
    kind: 'secret',
    tone: 'high',
    text: 'Possible secret access: 2 calls sent out, 3 more returned a result or may still',
  });
  expect(liveSecretBadge({ high: 1 })?.text).toBe('Possible secret access: 1 call sent out');
  expect(liveSecretBadge({ high: 1, medium: 2 })?.text).toBe(
    'Possible secret access: 1 call sent out, 2 more returned a result or may still',
  );
});

/** An estimate with 40 calls ahead on average and a longest finished stretch of 60 calls, updated by these fields. */
function estimate(fields: Partial<CompactEstimate> = {}): CompactEstimate {
  return {
    breakeven_calls: 10,
    breakeven_low: 5,
    breakeven_high: 20,
    calls_ahead: 40,
    cold_saving: -0.5,
    breakeven_cold: 10,
    calls_after_high: 60,
    pays_later_in: null,
    pays_later_at: null,
    ...fields,
  } as CompactEstimate;
}

/** A gauge against a 200K hint holding this estimate; none once it compacted after its last call. */
function gauge(preview: CompactEstimate | null, context = 150_000, warmUntil: string | null = WARM): Gauge {
  return {
    context,
    hint_tokens: 200_000,
    compacted: null,
    compact_now: { cache_warm_until: warmUntil, estimate: preview },
  } as Gauge;
}

/** The compact badge as [tone, text] and its states, for a gauge. */
function compactBadge(current: Gauge | null) {
  const badge = liveCompactBadge(current, NOW);
  return badge ? { tone: badge.tone, text: badge.text, states: badge.states } : null;
}

test('compacting that pays off soon has the session view’s tone and words', () => {
  expect(compactBadge(gauge(estimate()))).toEqual({
    tone: 'soon',
    text: 'Soon: compacting now pays off after ~10 replies, ~40 ahead on average.',
    states: ['soon'],
  });
});

test('close and late pay-offs have their tones', () => {
  expect(compactBadge(gauge(estimate({ breakeven_calls: 30 })))).toMatchObject({
    tone: 'close',
    text: 'Close: compacting now pays off after ~30 replies, ~40 ahead on average.',
  });
  expect(compactBadge(gauge(estimate({ breakeven_calls: 50 })))?.tone).toBe('unlikely');
});

test('where compacting would never pay off there is no compact badge', () => {
  expect(compactBadge(gauge(estimate({ breakeven_calls: null, breakeven_low: null })))).toBeNull();
  expect(compactBadge(gauge(estimate({ breakeven_cold: null }), 150_000, EXPIRED))).toBeNull();
});

test('where compacting pays off only later there is no compact badge below the hint, only the hint past it', () => {
  expect(compactBadge(gauge(estimate({ breakeven_calls: 50, pays_later_in: 5 })))).toBeNull();
  expect(compactBadge(gauge(estimate({ breakeven_calls: null, breakeven_low: 60, pays_later_in: 5 })))).toBeNull();
  expect(compactBadge(gauge(estimate({ breakeven_calls: 50, pays_later_in: 5 }), 250_000))).toEqual({
    tone: null,
    text: 'Past your 200K compact hint.',
    states: ['hint'],
  });
});

test('where compacting likely does not pay off it says so, unless the cache has expired', () => {
  const unlikely = estimate({ breakeven_calls: null, breakeven_low: 50 });
  expect(compactBadge(gauge(unlikely))).toMatchObject({
    tone: 'unlikely',
    text: 'Compacting now would likely not pay off.',
    states: ['unlikely'],
  });
  expect(compactBadge(gauge({ ...unlikely, breakeven_cold: null }, 150_000, EXPIRED))).toBeNull();
});

test('once the cache has expired and compacting cold saves, it says what at once', () => {
  expect(compactBadge(gauge(estimate({ cold_saving: 1.234 }), 150_000, EXPIRED))).toMatchObject({
    tone: 'soon',
    text: 'Compacting now saves ~$1.23 at once: the cache has expired.',
    states: ['cold'],
  });
});

test('an expired cache without a cold saving goes by the cold break-even: soon, else close', () => {
  const cold = (breakevenCold: number) => estimate({ cold_saving: -0.5, breakeven_cold: breakevenCold });
  expect(compactBadge(gauge(cold(30), 150_000, EXPIRED))?.tone).toBe('close');
  expect(compactBadge(gauge(cold(10), 150_000, EXPIRED))?.tone).toBe('soon');
});

test('a cold saving shows its cents', () => {
  expect(compactBadge(gauge(estimate({ cold_saving: 1.2 }), 150_000, EXPIRED))?.text).toBe(
    'Compacting now saves ~$1.20 at once: the cache has expired.',
  );
});

test('past the hint the badge adds it to its words and its states', () => {
  expect(compactBadge(gauge(estimate(), 250_000))).toMatchObject({
    text: 'Soon: compacting now pays off after ~10 replies, ~40 ahead on average. Past your 200K compact hint.',
    states: ['soon', 'hint'],
  });
  expect(compactBadge(gauge(null, 250_000))).toEqual({
    tone: null,
    text: 'Past your 200K compact hint.',
    states: ['hint'],
  });
  expect(compactBadge(gauge(null))).toBeNull();
});

test('without calls ahead only a break-even within the longest finished stretch has a badge', () => {
  const unknown = { calls_ahead: null };
  expect(compactBadge(gauge(estimate({ ...unknown, breakeven_calls: 50 })))).toMatchObject({
    tone: null,
    text: 'Compacting now pays off after ~50 replies.',
    states: ['pays'],
  });
  expect(compactBadge(gauge(estimate({ ...unknown, breakeven_calls: 61 })))).toBeNull();
  expect(compactBadge(gauge(estimate({ ...unknown, calls_after_high: null })))).toBeNull();
  expect(compactBadge(gauge(estimate({ ...unknown, breakeven_calls: null })))).toBeNull();
});

test('without a gauge, or after a compaction with no call since, there is no compact badge', () => {
  expect(compactBadge(null)).toBeNull();
  expect(compactBadge({ ...gauge(estimate(), 250_000), compact_now: null })).toBeNull();
});

test('a card shows a possible secret access first, then compacting now', () => {
  const secrets: SecretCounts = { high: 0, medium: 1, 'low-medium': 0, low: 0 };
  const badges = liveStateBadges({ current: gauge(estimate()), secrets }, NOW);
  expect(badges.map((badge) => badge.kind)).toEqual(['secret', 'compact']);
  expect(liveStateBadges({ current: null, secrets: {} }, NOW)).toEqual([]);
});

const OPEN = { session_id: 's1', waiting: QUESTION } as SessionDetail;

function listed(id: string, title: string | null, waiting: Waiting | null): LiveSession {
  return { session_id: id, title, waiting } as LiveSession;
}

test('the open session says what it waits for', () => {
  const [wait, ...more] = sessionWaits(OPEN, []);
  expect(more).toEqual([]);
  expect([wait?.kind, wait?.session_id, wait?.title]).toEqual(['waiting', 's1', null]);
  expect(wait?.text).toMatch(/^Waiting for your answer since /);
});

test('the other live sessions’ waits follow with their titles, the open one left out of the list', () => {
  const sessions = [
    listed('s1', 'Open', QUESTION),
    listed('s2', 'Parser fix', PERMISSION),
    listed('s3', null, QUESTION),
    listed('s4', 'Busy', null),
  ];
  expect(sessionWaits(OPEN, sessions).map((wait) => [wait.session_id, wait.title, wait.kind])).toEqual([
    ['s1', null, 'waiting'],
    ['s2', 'Parser fix', 'permission'],
    ['s3', 'Untitled session', 'waiting'],
  ]);
});

test('the open session’s own wait comes from its detail, not the live list', () => {
  expect(sessionWaits({ ...OPEN, waiting: null }, [listed('s1', 'Open', QUESTION)])).toEqual([]);
});

test('a wait the live list saw first asks for the session at once, an answered one too', () => {
  const quiet = { ...OPEN, waiting: null };
  expect(waitChanged(quiet, [listed('s1', null, QUESTION)])).toBe(true);
  expect(waitChanged(OPEN, [listed('s1', null, QUESTION)])).toBe(false);
  expect(waitChanged(quiet, [listed('s1', null, null)])).toBe(false);
  expect(waitChanged(OPEN, [listed('s1', null, null)])).toBe(true);
});

test('a session off the live list says nothing of its wait', () => {
  expect(waitChanged(OPEN, [])).toBe(false);
  expect(waitChanged(OPEN, [listed('s2', null, null)])).toBe(false);
});

const TODAY = '2026-09-29';
const NO_SESSIONS: Pick<LiveSession, 'waiting'>[] = [];
const TODAY_LIVE = { minutes: 5, agent_minutes: 5, days: 1, until: TODAY, sessions: NO_SESSIONS };
const PAST_LIVE = { ...TODAY_LIVE, until: '2026-09-28' };

test('a past day is the day the live sessions were kept by', () => {
  expect(livePastDay(PAST_LIVE, TODAY)).toBe('2026-09-28');
  expect(livePastDay(TODAY_LIVE, TODAY)).toBeNull();
  expect(livePastDay({ days: 7, until: TODAY }, TODAY)).toBeNull();
  expect(livePastDay({ days: 7, until: '2026-09-25' }, TODAY)).toBeNull();
  expect(livePastDay({ days: null, until: null }, TODAY)).toBeNull();
});

test('the window names the minutes a session stays live', () => {
  expect(liveWindow(TODAY_LIVE, TODAY)).toBe('· changed in the last 5 min');
});

test('the window names the longer time agents at work keep a session', () => {
  expect(liveWindow({ ...TODAY_LIVE, agent_minutes: 180 }, TODAY)).toBe(
    '· changed in the last 5 min (180 min while agents work)',
  );
});

test('the window says a waiting session stays on the list past it', () => {
  const sessions = [{ waiting: null }, { waiting: QUESTION }];
  expect(liveWindow({ ...TODAY_LIVE, sessions }, TODAY)).toBe('· changed in the last 5 min or waiting for you');
});

test('the window names the past day the list was kept by', () => {
  expect(liveWindow(PAST_LIVE, TODAY)).toMatch(/^· changed in the last 5 min, active on \w{3}, \w{3} 28$/);
});

test('an empty list says how lately it looked, or which day', () => {
  expect(liveEmpty(TODAY_LIVE, TODAY)).toBe('No session active in the last 5 minutes.');
  expect(liveEmpty(PAST_LIVE, TODAY)).toMatch(/^No live session was active on \w{3}, \w{3} 28\.$/);
});
