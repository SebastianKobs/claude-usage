import { expect, test } from 'vitest';
import type { Compaction, CompactEstimate, SessionDetail, SessionGauge, VersusKeeping } from './api.ts';
import { versusKeeping } from './fixtures.ts';
import {
  breakevenCall,
  breakevenText,
  compactCallKind,
  compactionTotal,
  COMPACTION_VERDICTS,
  delegateCallShown,
  oneTimeText,
  oneTimeTitle,
  PAYOFF_WORDS,
  payoffAhead,
  payoffText,
  payoffTone,
  REBUILD_CAUSES,
  spread,
  verdictText,
  verdictTitle,
  verdictTone,
  verdictWords,
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

test('a stretch not paid off yet is summed as it stands', () => {
  const rows = [row(comparison('saved', 1.25)), row(comparison('open', -0.25)), row(comparison('forced', 9))];
  expect(compactionTotal(rows)).toEqual({ net: 1, compactions: 2, unknown: 0 });
});

test('without a compaction to count there is no total', () => {
  expect(compactionTotal([])).toBeNull();
  expect(compactionTotal([row(null), row(comparison('forced', 1))])).toBeNull();
});

test('a saving shows as a signed gain, a loss as a signed loss, with an arrow', () => {
  expect(verdictText(versusKeeping({ verdict: 'saved', net: 2.1 }))).toBe('▲ +$2.10');
  expect(verdictText(versusKeeping({ verdict: 'cost_more', net: -0.4 }))).toBe('▼ −$0.40');
  expect(verdictText(versusKeeping({ verdict: 'cost_more', net: null, net_high: -0.3 }))).toBe('▼ −$0.30 or more');
});

test('the last stretch says so far, and a summary call unknown says how much it saved at most', () => {
  expect(verdictText(versusKeeping({ verdict: 'open', net: -0.25 }))).toBe('▼ −$0.25 so far');
  expect(verdictText(versusKeeping({ verdict: 'open', net: 0.05 }))).toBe('about even so far');
  expect(verdictText(versusKeeping({ verdict: 'open', net: null }))).toBe(COMPACTION_VERDICTS.open);
  expect(verdictText(versusKeeping({ verdict: 'unknown', net: null, net_high: 0.8 }))).toBe(
    'saved at most $0.80, the summary call unknown',
  );
  expect(verdictText(versusKeeping({ verdict: 'unknown', net: null, net_high: 0 }))).toBe(COMPACTION_VERDICTS.unknown);
});

test('the neutral verdicts have their words', () => {
  for (const verdict of ['even', 'forced'] as const) {
    expect(verdictText(versusKeeping({ verdict }))).toBe(COMPACTION_VERDICTS[verdict]);
  }
  expect(Object.keys(COMPACTION_VERDICTS).sort()).toEqual(['cost_more', 'even', 'forced', 'open', 'saved', 'unknown']);
  expect(Object.keys(REBUILD_CAUSES).sort()).toEqual(['idle', 'model', 'prefix']);
});

test('a gain and a loss say what they mean on hover, a neutral verdict nothing', () => {
  expect(verdictWords(versusKeeping({ verdict: 'saved' }))).toBe('Saved against keeping the context');
  expect(verdictWords(versusKeeping({ verdict: 'cost_more', net: -1 }))).toBe('Cost more than keeping the context');
  expect(verdictWords(versusKeeping({ verdict: 'open', net: -1 }))).toContain('Not paid off by the last call');
  expect(verdictWords(versusKeeping({ verdict: 'open', net: 1 }))).toContain('Not paid off by the last call');
  expect(verdictWords(versusKeeping({ verdict: 'even' }))).toBeNull();
});

test('the break-even is a call, a lower bound without a summary estimate, never, or nothing for a forced one', () => {
  expect(breakevenCall(versusKeeping({ breakeven_call: 5 }))).toBe('call 5');
  expect(breakevenCall(versusKeeping({ breakeven_call: 5, breakeven_at_least: true }))).toBe('≥ call 5');
  expect(breakevenCall(versusKeeping({ breakeven_call: null }))).toBe('never');
  expect(breakevenCall(versusKeeping({ verdict: 'forced', breakeven_call: 5 }))).toBeNull();
});

test('the break-even in words says whether it was reached', () => {
  expect(breakevenText(versusKeeping({ breakeven_call: 5, calls_after: 40 }))).toBe('paid off at call 5');
  expect(breakevenText(versusKeeping({ breakeven_call: 50, calls_after: 40 }))).toBe('would pay off at call 50');
  expect(breakevenText(versusKeeping({ breakeven_call: 5, breakeven_at_least: true }))).toBe(
    'pays off at call 5 or later',
  );
  expect(breakevenText(versusKeeping({ breakeven_call: null }))).toBe('never pays off');
  expect(breakevenText(versusKeeping({ verdict: 'forced' }))).toBeNull();
});

test('the one-time cost is the estimate, or without an output speed the input side at least', () => {
  expect(oneTimeText(versusKeeping({ one_time: 0.3 }))).toBe('~$0.30');
  expect(oneTimeText(versusKeeping({ one_time: null, call_low: 0.1, rewrite: 0.15 }))).toBe('≥ $0.25');
});

test('its title names the summary call, its cache and the rewrite', () => {
  expect(oneTimeTitle(versusKeeping())).toBe(
    'The summary call ~$0.20 (a summary of about 3K tokens, at most 4K; input $0.10, cache warm) and rewriting the ' +
      "next call's context $0.10",
  );
  const cold = oneTimeTitle(versusKeeping({ summary_tokens: null, call_cost: null, cache_warm: false }));
  expect(cold).toBe(
    "The summary call (its summary unknown; input $0.10, cache cold) and rewriting the next call's context $0.10",
  );
});

test('the verdict’s title names the re-work that would cancel a saving and where keeping would have compacted', () => {
  expect(verdictTitle(versusKeeping())).toBeNull();
  expect(verdictTitle(versusKeeping({ rework_margin: 12_000 }))).toBe(
    'Re-reading about 12K tokens after compacting would cancel the saving',
  );
  expect(verdictTitle(versusKeeping({ rework_margin: 12_000, capped_at: 30 }))).toBe(
    'Re-reading about 12K tokens after compacting would cancel the saving. ' +
      'The kept session would have auto-compacted at call 30',
  );
});

test('a last stretch that broke exactly even is about even, and a break-even at the last call was reached', () => {
  expect(verdictText(versusKeeping({ verdict: 'open', net: 0 }))).toBe('about even so far');
  expect(breakevenText(versusKeeping({ breakeven_call: 40, calls_after: 40 }))).toBe('paid off at call 40');
});
