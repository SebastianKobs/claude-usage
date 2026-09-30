import { expect, test } from 'vitest';
import type { Compaction, CompactEstimate, SessionDetail, SessionGauge, VersusKeeping } from './api.ts';
import {
  compactCallKind,
  compactionTotal,
  delegateCallShown,
  PAYOFF_WORDS,
  payoffAhead,
  payoffText,
  payoffTone,
  spread,
  verdictTone,
} from './compact.ts';

const NOW = '2026-09-28T12:00:00.000+00:00';
const WARM = '2026-09-28T12:30:00.000+00:00';
const EXPIRED = '2026-09-28T11:00:00.000+00:00';

/** An estimate with 40 calls ahead on average that pays off after 10 replies, updated by the given fields. */
function estimate(fields: Partial<CompactEstimate> = {}): CompactEstimate {
  return {
    compactions: 5,
    after: 50_000,
    after_low: 40_000,
    after_high: 60_000,
    summary_tokens: 3000,
    one_time: 0.3,
    breakeven_calls: 10,
    breakeven_low: 5,
    breakeven_high: 20,
    before_break: null,
    cold_saving: -0.5,
    breakeven_cold: 10,
    calls_after_low: 20,
    calls_after_high: 60,
    calls_ahead: 40,
    ahead_from: 'longer',
    stretches_ahead: 3,
    pays_later_in: null,
    pays_later_at: null,
    ...fields,
  };
}

/** A live session's gauge against a 200K hint, whose preview of compacting now holds this estimate. */
function gauge(context: number, warmUntil: string | null, preview: CompactEstimate | null): SessionGauge {
  return {
    context,
    hint_tokens: 200_000,
    compact_now: { cache_warm_until: warmUntil, estimate: preview },
  } as SessionGauge;
}

test('within half the calls ahead it pays back soon, within them it is close', () => {
  expect(payoffTone(estimate({ breakeven_calls: 20 }), false)).toBe('soon');
  expect(payoffTone(estimate({ breakeven_calls: 21 }), false)).toBe('close');
  expect(payoffTone(estimate({ breakeven_calls: 40 }), false)).toBe('close');
});

test('past the calls ahead or never it likely does not pay off', () => {
  expect(payoffTone(estimate({ breakeven_calls: 41 }), false)).toBe('unlikely');
  expect(payoffTone(estimate({ breakeven_calls: null }), false)).toBe('unlikely');
  expect(payoffTone(estimate({ breakeven_calls: null, breakeven_low: null, calls_ahead: null }), false)).toBe(
    'unlikely',
  );
});

test('without calls ahead a break-even has no tone', () => {
  expect(payoffTone(estimate({ calls_ahead: null }), false)).toBeNull();
});

test('an expired cache goes by the cold break-even', () => {
  expect(payoffTone(estimate({ cold_saving: 0.2 }), true)).toBe('soon');
  expect(payoffTone(estimate({ breakeven_cold: 30 }), true)).toBe('close');
  expect(payoffTone(estimate({ breakeven_cold: null }), true)).toBe('unlikely');
});

test('where it pays off only once the context has grown it is not yet, and paying off now goes first', () => {
  expect(payoffTone(estimate({ breakeven_calls: 41, pays_later_in: 5 }), false)).toBe('later');
  expect(payoffTone(estimate({ breakeven_calls: null, pays_later_in: 6 }), false)).toBe('later');
  expect(payoffTone(estimate({ breakeven_cold: 50, pays_later_in: 3 }), true)).toBe('later');
  expect(payoffTone(estimate({ breakeven_calls: 41, pays_later_in: null }), false)).toBe('unlikely');
  expect(payoffTone(estimate({ breakeven_calls: 20, pays_later_in: 1 }), false)).toBe('soon');
  expect(payoffTone(estimate({ cold_saving: 0.2, pays_later_in: 1 }), true)).toBe('soon');
});

test('every tone has its words', () => {
  expect(PAYOFF_WORDS).toEqual({ soon: 'Soon', close: 'Close', later: 'Not yet', unlikely: 'Likely too late' });
});

test('not yet says when compacting would pay off', () => {
  const later = estimate({ breakeven_calls: 60, pays_later_in: 5, pays_later_at: 70_000 });
  expect(payoffAhead('later', later, false)).toBe(
    'Not yet: growing at its recent pace, the context reaches about 70K in 5 replies, and compacting then would ' +
      'pay off within the replies still ahead on average.',
  );
  expect(payoffAhead('later', { ...later, pays_later_in: 1 }, false)).toContain('in 1 reply,');
});

test('the tone in words names the replies ahead, from longer stretches or all', () => {
  expect(payoffAhead('soon', estimate(), false)).toBe(
    'Soon: after your past compactions, a stretch this long went on for about 40 more replies on average.',
  );
  expect(payoffAhead('close', estimate({ ahead_from: 'all' }), false)).toBe(
    'Close: after your past compactions you went on for about 40 replies on average.',
  );
});

test('the tone has no words where the pay-off phrase says it all', () => {
  expect(payoffAhead(null, estimate(), false)).toBeNull();
  expect(payoffAhead('soon', estimate({ calls_ahead: null }), false)).toBeNull();
  expect(payoffAhead('unlikely', estimate({ breakeven_calls: null }), false)).toBeNull();
  expect(payoffAhead('soon', estimate({ cold_saving: 0.2 }), true)).toBeNull();
});

test('a context below what compacting leaves pays off not yet rather than never', () => {
  const below = { breakeven_calls: null, breakeven_low: null, breakeven_cold: null, cold_saving: -0.5 };
  for (const expired of [false, true]) {
    expect(payoffText(estimate({ ...below, pays_later_in: 6 }), expired)).toBe(
      'would not pay off yet: the context is below what compacting leaves',
    );
    expect(payoffText(estimate({ ...below, pays_later_in: null }), expired)).toBe(
      'would never pay off: the context is below what compacting leaves',
    );
  }
});

test('the pay-off phrase gives the break-even with its range, cold or warm', () => {
  expect(payoffText(estimate(), false)).toBe('would pay off after about 10 replies (5–20)');
  expect(payoffText(estimate({ breakeven_high: null }), false)).toBe('would pay off after about 10 replies (5–never)');
  expect(payoffText(estimate({ breakeven_low: 10, breakeven_high: 10 }), false)).toBe(
    'would pay off after about 10 replies',
  );
  expect(payoffText(estimate({ breakeven_calls: null, breakeven_low: 70 }), false)).toBe(
    'would likely not pay off (at best after about 70 replies)',
  );
  expect(payoffText(estimate({ breakeven_cold: 12 }), true)).toBe('would pay off after about 12 replies');
  expect(payoffText(estimate({ cold_saving: 1.234 }), true)).toBe(
    'pays off at once (about $1.23), since the next reply sends it all anyway',
  );
});

test('a spread is nothing where both ends read the same', () => {
  expect([spread('1', '1'), spread('1', '2')]).toEqual(['', ' (1–2)']);
});

test('below the hint a warm cache gets no call, even where compacting likely pays', () => {
  expect(compactCallKind({ live: true, current: gauge(150_000, WARM, estimate()) }, NOW)).toBeNull();
});

test('an ended session, one without a gauge or one that compacted after its last call gets no call', () => {
  expect(compactCallKind({ live: false, current: gauge(250_000, WARM, estimate()) }, NOW)).toBeNull();
  expect(compactCallKind({ live: true, current: null }, NOW)).toBeNull();
  const compacted = { ...gauge(250_000, WARM, estimate()), compact_now: null };
  expect(compactCallKind({ live: true, current: compacted }, NOW)).toBeNull();
});

/** What compactCallKind says of a live session with this context, cache and estimate. */
function kindOf(context: number, warmUntil: string | null, preview: CompactEstimate | null) {
  return compactCallKind({ live: true, current: gauge(context, warmUntil, preview) }, NOW);
}

test('once the cache has expired the call comes where compacting cold saves at once', () => {
  expect(kindOf(150_000, EXPIRED, estimate({ cold_saving: 1.2 }))).toBe('cold');
  expect(kindOf(150_000, EXPIRED, estimate({ cold_saving: 0 }))).toBe('cold');
  expect(kindOf(150_000, EXPIRED, estimate({ cold_saving: -0.5 }))).toBeNull();
});

test('past the hint the call comes whatever the savings, a cold one that saves still says so', () => {
  expect(kindOf(200_000, WARM, estimate())).toBe('threshold');
  expect(kindOf(250_000, WARM, null)).toBe('threshold');
  expect(kindOf(250_000, EXPIRED, estimate())).toBe('threshold');
  expect(kindOf(250_000, EXPIRED, estimate({ cold_saving: 1.2 }))).toBe('cold');
  expect(kindOf(199_999, WARM, estimate())).toBeNull();
});

/** A detail whose main thread explored `tokens` this stretch, with `calls` ahead on average. */
function explorer(tokens: number, callsAhead: number | null, live = true): SessionDetail {
  const current = {
    context: 100_000,
    exploration: { calls: 12, chars: tokens * 2.3, tokens, carried: 0.4, reread: 0.006 },
    compact_now: { estimate: estimate({ calls_ahead: callsAhead }) },
  };
  return { live, current, delegate_hint_tokens: 20_000, delegate_calls_ahead: 60 } as unknown as SessionDetail;
}

test('a live session with much exploration and many calls ahead gets the hint to delegate', () => {
  expect(delegateCallShown(explorer(30_000, 73.5))).toBe(true);
  expect(delegateCallShown(explorer(20_000, 60))).toBe(true);
});

test('little exploration or few calls ahead get none', () => {
  expect(delegateCallShown(explorer(19_999, 73.5))).toBe(false);
  expect(delegateCallShown(explorer(30_000, 59.9))).toBe(false);
});

test('without what the hint to delegate rests on there is none', () => {
  const base = explorer(30_000, 73.5);
  const current = base.current as SessionGauge;
  const cases = [
    explorer(30_000, 73.5, false),
    explorer(30_000, null),
    { ...base, current: { ...current, exploration: null } },
    { ...base, current: { ...current, exploration: undefined } },
    { ...base, current: { ...current, compact_now: { ...current.compact_now, estimate: null } } },
    { ...base, current: null },
  ] as SessionDetail[];
  for (const detail of cases) expect(delegateCallShown(detail)).toBe(false);
});

/** A comparison with the given verdict and net, the other fields left out. */
function comparison(verdict: VersusKeeping['verdict'], net: number | null = null): VersusKeeping {
  return { verdict, net, net_high: 0 } as VersusKeeping;
}

test('a saving is a gain and a proven loss a loss', () => {
  expect(verdictTone(comparison('saved', 0.4))).toBe('gain');
  expect(verdictTone(comparison('cost_more', -0.2))).toBe('loss');
});

test('the last stretch is a loss while it is behind, else neutral like the rest', () => {
  expect(verdictTone(comparison('open', -0.21))).toBe('loss');
  expect(verdictTone(comparison('open', 0.05))).toBeNull();
  expect(verdictTone(comparison('open', null))).toBeNull();
  for (const verdict of ['even', 'forced', 'unknown'] as const) {
    expect(verdictTone(comparison(verdict, -1))).toBeNull();
  }
});

/** A compaction row with its comparison. */
function row(versus: VersusKeeping | null): Pick<Compaction, 'versus_keeping'> {
  return { versus_keeping: versus };
}

test('the compactions add up, forced ones left out and those without an estimate counted but not summed', () => {
  const rows = [
    row(comparison('saved', 0.5)),
    row(comparison('cost_more', -0.2)),
    row(comparison('forced', 9)),
    row(comparison('unknown', null)),
    row(null),
  ];
  const total = compactionTotal(rows);
  expect(total?.compactions).toBe(2);
  expect(total?.unknown).toBe(1);
  expect(total?.net).toBeCloseTo(0.3);
});

test('without a compaction to count there is no total', () => {
  expect(compactionTotal([])).toBeNull();
  expect(compactionTotal([row(null), row(comparison('forced', 1))])).toBeNull();
});
