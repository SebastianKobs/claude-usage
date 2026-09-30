// What the session view and the live cards say about compacting and delegating: when compacting pays off against the
// replies still ahead, the call to compact, the hint to delegate exploration, a compaction's verdict and their sum.
// Plain functions over the server's answers (api.ts), so the components share them and each is tested; the wording that
// carries a tone is here too, since the mark's color never does.

import type { Compaction, CompactEstimate, Rebuild, SessionDetail, SessionGauge, VersusKeeping } from './api.ts';
import { compact, money, whole } from './format.ts';

/** How soon compacting pays off: within half of the replies ahead, within them, once the context has grown, or past
 *  them. */
export type PayoffTone = 'soon' | 'close' | 'later' | 'unlikely';

/** Why the session view calls for compacting: the cache has expired and compacting cold saves at once, or the context
 *  is past the hint. */
export type CompactCallKind = 'cold' | 'threshold';

export const PAYOFF_WORDS: Record<PayoffTone, string> = {
  soon: 'Soon',
  close: 'Close',
  later: 'Not yet',
  unlikely: 'Likely too late',
};

/** " (low–high)", or nothing where both ends read the same. */
export function spread(low: string, high: string): string {
  return low === high ? '' : ` (${low}–${high})`;
}

/**
 * How soon compacting now pays off against the replies still ahead on average (`calls_ahead`): "soon" within half of
 * them, "close" within them; else "later" where it would once the context has grown at its recent pace
 * (`pays_later_in`: too early, not too late), "unlikely" past them or never; null without calls ahead to compare with.
 */
export function payoffTone(estimate: CompactEstimate, expired: boolean): PayoffTone | null {
  const ahead = estimate.calls_ahead;
  let breakeven = estimate.breakeven_calls;
  if (expired) {
    if (estimate.cold_saving >= 0) return 'soon';
    breakeven = estimate.breakeven_cold;
  }
  if (breakeven !== null && ahead !== null && ahead !== undefined && breakeven <= ahead) {
    return breakeven <= ahead / 2 ? 'soon' : 'close';
  }
  if ((estimate.pays_later_in ?? null) !== null) return 'later';
  if (breakeven === null) return 'unlikely';
  return ahead !== null && ahead !== undefined ? 'unlikely' : null;
}

/** The tone in words, which carry it, not the mark's color: against the replies still ahead on average, or when the
 *  context will have grown enough; nothing where the pay-off phrase already says it all (never, likely not, or at
 *  once). */
export function payoffAhead(tone: PayoffTone | null, estimate: CompactEstimate, expired: boolean): string | null {
  if (!tone || estimate.calls_ahead === null || estimate.calls_ahead === undefined) return null;
  if (tone === 'later') {
    const replies = estimate.pays_later_in === 1 ? '1 reply' : `${whole(estimate.pays_later_in)} replies`;
    return (
      `${PAYOFF_WORDS.later}: growing at its recent pace, the context reaches about ` +
      `${compact(estimate.pays_later_at)} in ${replies}, and compacting then would pay off within the replies ` +
      'still ahead on average.'
    );
  }
  const breakeven = expired ? (estimate.cold_saving >= 0 ? null : estimate.breakeven_cold) : estimate.breakeven_calls;
  if (breakeven === null) return null;
  const ahead = whole(Math.round(estimate.calls_ahead));
  return (
    `${PAYOFF_WORDS[tone]}: ` +
    (estimate.ahead_from === 'longer'
      ? `after your past compactions, a stretch this long went on for about ${ahead} more replies on average.`
      : `after your past compactions you went on for about ${ahead} replies on average.`)
  );
}

/** When compacting now pays off: warm against the next calls' reads; once the cache has expired, cold against
 *  keeping's rewrite of everything. A context below what compacting leaves pays off not yet, rather than never, where
 *  it will once it has grown (`pays_later_in`). */
export function payoffText(estimate: CompactEstimate, expired: boolean): string {
  const never = (estimate.pays_later_in ?? null) === null ? 'would never pay off' : 'would not pay off yet';
  if (expired) {
    if (estimate.breakeven_cold === null) return `${never}: the context is below what compacting leaves`;
    return estimate.cold_saving >= 0
      ? `pays off at once (about ${money(estimate.cold_saving)}), since the next reply sends it all anyway`
      : `would pay off after about ${whole(estimate.breakeven_cold)} replies`;
  }
  const calls = (value: number | null): string => (value === null ? 'never' : whole(value));
  if (estimate.breakeven_calls !== null) {
    return (
      `would pay off after about ${whole(estimate.breakeven_calls)} replies` +
      spread(calls(estimate.breakeven_low), calls(estimate.breakeven_high))
    );
  }
  return estimate.breakeven_low === null
    ? `${never}: the context is below what compacting leaves`
    : `would likely not pay off (at best after about ${whole(estimate.breakeven_low)} replies)`;
}

/** What `compactCallKind` reads of a session: whether it is live and its gauge. */
export interface CompactSubject {
  live: boolean;
  current: SessionGauge | null;
}

/**
 * Whether the session view calls for compacting: "cold" once a live session's cache has expired and compacting first
 * saves at once, else "threshold" where the context is at or past the configured hint, else null. A warm cache below
 * the hint gets no call: replayed on the stored sessions, it added next to nothing (features 11.3).
 */
export function compactCallKind(subject: CompactSubject, now: string): CompactCallKind | null {
  const current = subject.live ? subject.current : null;
  const preview = current ? current.compact_now : null;
  if (!current || !preview) return null;
  // past the hint the call comes whatever the savings: how many replies still follow can't be predicted
  const fallback = current.context >= current.hint_tokens ? 'threshold' : null;
  const estimate = preview.estimate;
  const until = preview.cache_warm_until;
  if (estimate && until !== null && Date.parse(until) < Date.parse(now) && estimate.cold_saving >= 0) return 'cold';
  return fallback;
}

/** Whether the session view suggests delegating exploration: a live session whose main thread has read, searched and
 *  listed at least `delegate_hint_tokens` since its last compaction, with at least `delegate_calls_ahead` calls ahead
 *  on average (the compaction estimate's `calls_ahead`). */
export function delegateCallShown(
  detail: Pick<SessionDetail, 'live' | 'current' | 'delegate_hint_tokens' | 'delegate_calls_ahead'>,
): boolean {
  const current = detail.live ? detail.current : null;
  const exploration = current ? current.exploration : null;
  const estimate = current && current.compact_now ? current.compact_now.estimate : null;
  if (!exploration || !estimate || estimate.calls_ahead === null || estimate.calls_ahead === undefined) return false;
  return exploration.tokens >= detail.delegate_hint_tokens && estimate.calls_ahead >= detail.delegate_calls_ahead;
}

/** A saving is a gain, a proven loss a loss, and so is a last stretch still behind as it stands; the rest (about even,
 *  forced, unknown) is neutral. */
export function verdictTone(comparison: Pick<VersusKeeping, 'verdict' | 'net'>): 'gain' | 'loss' | null {
  if (comparison.verdict === 'saved') return 'gain';
  if (comparison.verdict === 'cost_more') return 'loss';
  if (comparison.verdict === 'open' && (comparison.net ?? 0) < 0) return 'loss';
  return null;
}

/** What a transcript's compactions saved: `net` over `compactions` of them, `unknown` more without an estimate. */
export interface CompactionTotal {
  net: number;
  compactions: number;
  unknown: number;
}

/** What a transcript's compactions saved against keeping the context, summed like `turns.savings_total`: forced ones
 *  left out, those without a summary estimate counted but not summed; null without one to count. */
export function compactionTotal(compactions: readonly Pick<Compaction, 'versus_keeping'>[]): CompactionTotal | null {
  const counted = compactions
    .map((row) => row.versus_keeping)
    .filter((comparison): comparison is VersusKeeping => comparison !== null && comparison.verdict !== 'forced');
  if (!counted.length) return null;
  const nets = counted.map((comparison) => comparison.net).filter((net): net is number => net !== null);
  const net = nets.reduce((sum, value) => sum + value, 0);
  return { net, compactions: nets.length, unknown: counted.length - nets.length };
}

/** A call that wrote the cache again instead of reading it, the cause in words. */
export const REBUILD_CAUSES: Record<Rebuild['cause'], string> = {
  model: 'the model changed',
  idle: 'the cache expired while idle',
  prefix: 'something early in the context changed',
};

/** What each verdict says where it has no amount of its own. */
export const COMPACTION_VERDICTS: Record<VersusKeeping['verdict'], string> = {
  saved: 'saved',
  cost_more: 'cost more',
  even: 'about even',
  forced: 'forced: keeping would have auto-compacted',
  open: 'not paid off by the last call',
  unknown: 'unknown without an output speed or duration',
};

/** What a compaction's comparison with keeping the context assumes, for the titles and the note under the table. */
export const VERSUS_KEEPING_NOTE =
  'Compared with keeping the context: the same later calls, each reading the dropped tokens again from the cache, ' +
  'at API list prices. ~ marks the summary call\'s output, estimated from its duration at your output speed; ▲ + ' +
  '(saved, green) holds even at your fastest, ▼ − (cost more, red) even without the summary, or so far for the ' +
  "stretch still running. Re-reading files after compacting isn't counted.";

/** The verdict with its amount: a gain or loss signed, with an arrow (the sign and the arrow carry it, not the
 *  color); the other verdicts in words. */
export function verdictText(
  comparison: Pick<VersusKeeping, 'verdict' | 'net' | 'net_high'>,
): string {
  const { verdict, net, net_high: high } = comparison;
  if (verdict === 'saved') return `▲ +${money(net)}`;
  if (verdict === 'cost_more') return net === null ? `▼ −${money(-high)} or more` : `▼ −${money(-net)}`;
  if (verdict === 'open' && net !== null) return net < 0 ? `▼ −${money(-net)} so far` : 'about even so far';
  if (verdict === 'unknown' && high > 0) return `saved at most ${money(high)}, the summary call unknown`;
  return COMPACTION_VERDICTS[verdict];
}

/** The words under the verdict's mark (its title): what a gain or a loss means; nothing for a neutral one. */
export function verdictWords(comparison: Pick<VersusKeeping, 'verdict' | 'net'>): string | null {
  const tone = verdictTone(comparison);
  if (tone === 'gain') return 'Saved against keeping the context';
  if (comparison.verdict === 'open') return 'Not paid off by the last call: cost more than keeping the context so far';
  return tone === 'loss' ? 'Cost more than keeping the context' : null;
}

/** The break-even call, judged at the fastest summary like `saved`; without a summary estimate a lower bound; none for
 *  a forced compaction, which had nothing to pay off against. */
export function breakevenCall(
  comparison: Pick<VersusKeeping, 'verdict' | 'breakeven_call' | 'breakeven_at_least'>,
): string | null {
  if (comparison.verdict === 'forced') return null;
  if (comparison.breakeven_call === null) return 'never';
  return `${comparison.breakeven_at_least ? '≥ ' : ''}call ${whole(comparison.breakeven_call)}`;
}

/** The break-even as a phrase: paid off at a call, would at one past the last, or never. */
export function breakevenText(
  comparison: Pick<VersusKeeping, 'verdict' | 'breakeven_call' | 'breakeven_at_least' | 'calls_after'>,
): string | null {
  const call = breakevenCall(comparison);
  if (call === null) return null;
  if (call === 'never') return 'never pays off';
  if (comparison.breakeven_at_least) return `pays off at call ${whole(comparison.breakeven_call)} or later`;
  return (comparison.breakeven_call ?? 0) > comparison.calls_after ? `would pay off at ${call}` : `paid off at ${call}`;
}

/** What compacting cost once: the summary call and the rewrite (only the input side without an output speed). */
export function oneTimeText(comparison: Pick<VersusKeeping, 'one_time' | 'call_low' | 'rewrite'>): string {
  return comparison.one_time === null
    ? `≥ ${money(comparison.call_low + comparison.rewrite)}`
    : `~${money(comparison.one_time)}`;
}

/** What the one-time cost is made of: the summary call (its size, its input side, the cache) and the rewrite. */
export function oneTimeTitle(
  comparison: Pick<
    VersusKeeping,
    'summary_tokens' | 'summary_high' | 'cache_warm' | 'call_cost' | 'call_low' | 'rewrite'
  >,
): string {
  const summary =
    comparison.summary_tokens === null
      ? 'its summary unknown'
      : `a summary of about ${compact(comparison.summary_tokens)} tokens, at most ${compact(comparison.summary_high)}`;
  const cache = comparison.cache_warm ? 'warm' : 'cold';
  return (
    `The summary call ${comparison.call_cost === null ? '' : `~${money(comparison.call_cost)} `}(${summary}; ` +
    `input ${money(comparison.call_low)}, cache ${cache}) and rewriting the next call's context ` +
    money(comparison.rewrite)
  );
}

/** The re-work that would cancel a saving, and where the kept session would have auto-compacted itself; null for
 *  neither. */
export function verdictTitle(comparison: Pick<VersusKeeping, 'rework_margin' | 'capped_at'>): string | null {
  const notes: string[] = [];
  if (comparison.rework_margin !== null) {
    notes.push(`Re-reading about ${compact(comparison.rework_margin)} tokens after compacting would cancel the saving`);
  }
  if (comparison.capped_at !== null) {
    notes.push(`The kept session would have auto-compacted at call ${whole(comparison.capped_at)}`);
  }
  return notes.join('. ') || null;
}
