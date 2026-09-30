// What the session view's gauge and the calls above it say: the main thread's context against the auto-compact point,
// what compacting now would cost (the exact parts, then the estimate), the call to compact and the hint to delegate
// exploration. Plain functions over the server's answers, so the components only draw them; whether the cache has
// expired is an argument, since the clock is the component's.

import type { CompactEstimate, CompactNow, Gauge, SessionGauge } from './api.ts';
import {
  type CompactCallKind,
  type PayoffTone,
  payoffAhead,
  payoffText,
  payoffTone,
  spread,
} from './compact.ts';
import { compact, money, percent, signed, when, whole } from './format.ts';

/** The gauge card: the context before a compaction that no reply has followed, or the meter. */
export type GaugeCard =
  | {
      kind: 'compacted';
      label: string;
      value: string;
      secondary: string;
      note: string;
    }
  | {
      kind: 'meter';
      label: string;
      value: string;
      secondary: string;
      /** The meter's own words for a screen reader. */
      meterLabel: string;
      /** The auto-compact point, and the context against it. */
      max: number;
      now: number;
      /** The fill's width and the hint mark's left edge, as CSS percentages; the mark is null where the hint is not
       *  below the auto-compact point. */
      fill: string;
      hintAt: string | null;
      note: string;
    };

/** The gauge's words after a compaction without a reply since: the context before it; what it left shows with the
 *  next call, which sends the prefix again (postTokens isn't that call's context). */
export function compactedNote(current: Pick<Gauge, 'context' | 'auto_compact'>): string {
  return (
    `Before it, the context was ${compact(current.context)} of ${compact(current.auto_compact)}. The next ` +
    'reply shows the new one: the summary, with the system prompt, tools and CLAUDE.md sent again.'
  );
}

function percentage(share: number): string {
  return `${(share * 100).toFixed(1)}%`;
}

/** The main thread's latest context against the auto-compact point, with the compact hint marked on the bar; once it
 *  compacted after its last call, the compaction, since the context it now has shows only with the next call. */
export function gaugeCard(current: Gauge): GaugeCard {
  const label = `Latest context, main thread · ${current.model}`;
  if (current.compacted) {
    return {
      kind: 'compacted',
      label,
      value: 'Compacted',
      secondary: `at ${when(current.compacted)}, no reply since`,
      note: compactedNote(current),
    };
  }
  const hint = current.hint_tokens < current.auto_compact ? current.hint_tokens / current.auto_compact : null;
  const since = current.last_compaction
    ? `since the last compaction (${when(current.last_compaction)})`
    : 'since the session started';
  const pace =
    current.mean_step === null
      ? 'too few turns for an estimate'
      : current.turns_left === null
        ? `${signed(current.mean_step)} per turn, not growing`
        : `about ${whole(current.turns_left)} turns left at ${signed(current.mean_step)} per turn ` +
          '(mean of the last 10)';
  return {
    kind: 'meter',
    label,
    value: compact(current.context),
    secondary: `of ${compact(current.auto_compact)} · ${percent(current.context, current.auto_compact)}`,
    meterLabel:
      `Latest context ${compact(current.context)} of the auto-compact point ${compact(current.auto_compact)}`,
    max: current.auto_compact,
    now: current.context,
    fill: percentage(Math.min(1, current.context / current.auto_compact)),
    hintAt: hint === null ? null : percentage(hint),
    note: [
      `${compact(current.headroom)} until auto-compact`,
      hint === null ? null : `the mark is the compact hint at ${compact(current.hint_tokens)}, a heuristic`,
      `${whole(current.turns_since_compaction)} turns ${since}`,
      pace,
    ]
      .filter(Boolean)
      .join(' · '),
  };
}

/** The estimate of compacting now, as the paragraph's parts: `lead` up to the pay-off phrase (which carries the tone's
 *  mark and is bold), then `rest`. */
export interface EstimateNote {
  lead: string;
  tone: PayoffTone | null;
  phrase: string;
  rest: string;
}

/** What compacting now would cost: the exact parts (each call's re-read, the cache's lifetime, keeping across a
 *  break) as one note, then the estimate from past compactions (turns.compact_preview), or why there is none. */
export interface CompactNotes {
  exact: string;
  /** Why there is no estimate; null where there is one. */
  missing: string | null;
  estimate: EstimateNote | null;
}

/** The notes under the gauge for the preview of compacting now; `expired` is whether the cache has run out. */
export function compactNotes(preview: CompactNow, expired: boolean): CompactNotes {
  const until = preview.cache_warm_until;
  const cache =
    until === null
      ? null
      : expired
        ? `The cache has likely expired (${when(until)}): the next reply sends it all at the full price, ` +
          `${money(preview.keep_across_break)} more.`
        : `The cache stays warm until ${when(until)} (${preview.cache_ttl_minutes} min after the last request); ` +
          `after that, the next reply costs ${money(preview.keep_across_break)} more.`;
  const reread =
    `Every reply sends the whole conversation again: ${compact(preview.before)}, ` +
    `${money(preview.reread_cost)} each time from the cache.`;
  const exact = [reread, cache].filter(Boolean).join(' ');
  const estimate = preview.estimate;
  if (!estimate) {
    const stored = preview.stored_compactions;
    const why = stored
      ? `your ${whole(stored)} stored ${stored === 1 ? 'compaction carries' : 'compactions carry'} ` +
        'no duration or output speed to estimate the summary from'
      : 'no stored compaction to learn from yet';
    return { exact, missing: `No estimate of compacting now: ${why}.`, estimate: null };
  }
  return { exact, missing: null, estimate: estimateNote(preview, estimate, expired) };
}

function estimateNote(preview: CompactNow, estimate: CompactEstimate, expired: boolean): EstimateNote {
  const until = preview.cache_warm_until;
  const count = `${whole(estimate.compactions)} stored ${estimate.compactions === 1 ? 'compaction' : 'compactions'}`;
  const low = whole(estimate.calls_after_low);
  const high = whole(estimate.calls_after_high);
  const followed =
    estimate.calls_after_low === null
      ? ''
      : `, which were followed by ${low === high ? low : `${low}–${high}`} replies until the next one`;
  const tone = payoffTone(estimate, expired);
  const after = [payoffAhead(tone, estimate, expired), `Learnt from your ${count}${followed}.`];
  if (estimate.before_break !== null && !expired && until !== null) {
    after.push(`Compacting before a break past ${when(until)} saves about ${money(estimate.before_break)} at once.`);
  }
  return {
    lead:
      `If you compacted now, it would shrink to about ${compact(estimate.after)}` +
      `${spread(compact(estimate.after_low), compact(estimate.after_high))}. ` +
      (expired ? 'Compacting ' : `That costs ~${money(estimate.one_time)} once and `),
    tone,
    phrase: payoffText(estimate, expired),
    rest: `. ${after.filter(Boolean).join(' ')}`,
  };
}

/** The call past the hint, which claims no saving: what each reply re-reads, and what compacting would cost and when
 *  it would pay off where past compactions give an estimate. */
function thresholdLines(preview: CompactNow, expired: boolean): string[] {
  const estimate = preview.estimate;
  const lines = [
    expired
      ? `The cache has expired, so the next reply sends your whole conversation (${compact(preview.before)}) again ` +
        'at the full price.'
      : `Every reply sends your whole conversation again: ${compact(preview.before)}, ` +
        `~${money(preview.reread_cost)} each time from the cache.`,
  ];
  if (estimate) {
    lines.push(
      `Compacting would shrink it to about ${compact(estimate.after)}` +
        (expired
          ? ` and ${payoffText(estimate, true)}.`
          : `. That costs ~${money(estimate.one_time)} once and ${payoffText(estimate, false)}.`),
    );
  }
  return lines;
}

/** The call to compact: its title and its paragraphs, in plain words. */
export interface CompactCall {
  title: string;
  lines: string[];
}

/**
 * The call to compact for a `kind` that `compactCallKind` gave: "cold" once the cache has expired and compacting cold
 * saves at once; "threshold" past the compact hint, whatever the savings (the replies still to come can't be
 * predicted, and the last line says why it shows). `expired` is whether the cache has run out.
 */
export function compactCall(current: Gauge, kind: CompactCallKind, expired: boolean): CompactCall | null {
  const preview = current.compact_now;
  if (!preview) return null;
  const estimate = preview.estimate;
  const until = preview.cache_warm_until;
  if (kind === 'cold') {
    if (!estimate) return null;
    return {
      title: '⚠ The cache has expired: compacting now saves money',
      lines: [
        `The cache has expired, so the next reply sends your whole conversation (${compact(preview.before)}) again ` +
          `at the full price. Compacting would shrink it to about ${compact(estimate.after)}. Doing it now saves ` +
          `about ${money(estimate.cold_saving)} at once.`,
      ],
    };
  }
  const lines = thresholdLines(preview, expired);
  if (!expired && estimate && estimate.before_break !== null && estimate.before_break > 0 && until !== null) {
    lines.push(
      `Taking a break past ${when(until)}? Compact before it: the cache expires then, and compacting first saves ` +
        `about ${money(estimate.before_break)} at the next reply.`,
    );
  }
  lines.push(
    "How many replies still follow can't be predicted, so past your own threshold ([chat] compact_hint_tokens) " +
      'this shows whatever the estimate says.',
  );
  return { title: `⚠ Your context is past your ${compact(current.hint_tokens)} compact hint`, lines };
}

/** The hint to delegate exploration: its paragraphs, and the muted note saying it is a heuristic. */
export interface DelegateCall {
  title: string;
  lines: string[];
  note: string;
}

/** The hint to delegate exploration, in plain words, from the exploration since the last compaction and the replies
 *  still ahead on average; null without either (`delegateCallShown` decides whether it shows at all). */
export function delegateCall(current: SessionGauge): DelegateCall | null {
  const exploration = current.exploration;
  const estimate = current.compact_now?.estimate;
  if (!exploration || !estimate || estimate.calls_ahead === null) return null;
  const ahead = whole(Math.round(estimate.calls_ahead));
  return {
    title: 'Explore in a subagent',
    lines: [
      `Since the last compaction the main thread has read, searched and listed ` +
        `${compact(exploration.tokens)} tokens in ${whole(exploration.calls)} calls. They stay in the ` +
        `context: every reply reads them again, ~${money(exploration.reread)} each and ` +
        `~${money(exploration.carried)} so far.`,
      (estimate.ahead_from === 'longer'
        ? `After your past compactions, a stretch this long went on for about ${ahead} more replies on average. `
        : `After your past compactions you went on for about ${ahead} replies on average. `) +
        'A subagent (such as Explore) reads in its own context and hands back only its summary, so the next search ' +
        'costs less delegated.',
    ],
    note:
      'A heuristic ([chat] delegate_hint_tokens and delegate_calls_ahead): replayed on real sessions, delegating ' +
      'was cheaper in 52 of 53 cases with 60 to 150 calls ahead, and about even with 20 to 60.',
  };
}
