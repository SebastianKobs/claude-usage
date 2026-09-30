// What the KPI and runtime tiles say: the range in words, the cost's notes, what compacting saved so far, the input
// split's parts and the runtime's notes. Plain functions, so the components only draw them.

import type { CompactionSavings, ContextStats, CostParts, SessionRuntime, Summary, Usage } from './api';
import { inputTotal } from './charts';
import { compact, dayText, duration, longDay, money, percent, shortDay, whole } from './format';

/** The range the summary covers, in words, from the summary itself: the controls may already ask for another one.
 *  `today` is the store day of now. */
export function rangeText(
  summary: Pick<Summary, 'days' | 'since' | 'until' | 'history_since'>,
  today: string = dayText(new Date()),
  locale?: string,
): string {
  // a young store, or one with a retention, starts after the range does
  const since = summary.history_since;
  const history = since && since > summary.since ? ` (history since ${shortDay(since, locale)})` : '';
  if (summary.days !== 1) return `last ${summary.days} days${history}`;
  return summary.until === today ? 'today' : longDay(summary.until, locale);
}

/** The notes under the estimated cost: the price basis, or the turns left out for want of a price, and the web
 *  searches with their fee. */
export function costNotes(totals: Pick<Usage, 'unpriced_turns' | 'web_searches' | 'cost_parts'>): string {
  const notes = [
    totals.unpriced_turns
      ? `${whole(totals.unpriced_turns)} turns of models without a price are not included`
      : 'at API list prices',
  ];
  if (totals.web_searches) {
    notes.push(`incl. ${whole(totals.web_searches)} web searches, ${money(totals.cost_parts.web_search)}`);
  }
  return notes.join(' · ');
}

/** What compacting saved so far, as a line under the estimated cost. */
export interface SavingsNote {
  /** What the amount sums and what ~ means, for the hover. */
  title: string;
  /** Which way it went, which the sign and arrow in `amount` carry too; null without a summed compaction. */
  verdict: 'gain' | 'loss' | null;
  /** The amount in words, null where none compaction could be summed. */
  amount: string | null;
  /** How many compactions it sums and how many had no estimate; the whole line where there is no amount. */
  count: string;
}

const SAVINGS_TITLE =
  'Each main-thread compaction against keeping its context, over its stretch up to the next one, summed; a stretch ' +
  'not paid off yet as it stands, forced compactions left out. ~: the summary call is estimated.';

/** The savings of the compactions as a gain or a loss (the sign and arrow carry it, like the compactions table). */
export function savingsNote(savings: CompactionSavings): SavingsNote {
  const count = savings.compactions === 1 ? '1 compaction' : `${whole(savings.compactions)} compactions`;
  const unknown = savings.unknown ? `${whole(savings.unknown)} without an estimate` : null;
  if (!savings.compactions) {
    return { title: SAVINGS_TITLE, verdict: null, amount: null, count: `Compacting: ${unknown}` };
  }
  const gain = savings.net >= 0;
  return {
    title: SAVINGS_TITLE,
    verdict: gain ? 'gain' : 'loss',
    amount: gain
      ? `▲ compacting saved ~${money(savings.net)} so far`
      : `▼ compacting cost ~${money(-savings.net)} more so far`,
    count: `(${[count, unknown].filter(Boolean).join(', ')})`,
  };
}

/** One part of the input split. */
export interface SplitSegment {
  /** A label the theme words. */
  label: string;
  tokens: number;
  cost: number;
  /** The part's color, a series step of one hue. */
  color: string;
  /** What the part is, for the hover. */
  note: string;
}

/** The input tokens as two parts of one whole: processed (new input and cache writes, full price or more) and from
 *  cache (cache reads, a tenth of the price). */
export function splitSegments(
  totals: Pick<Usage, 'new_input' | 'cache_write' | 'cache_read' | 'cost_parts'>,
): SplitSegment[] {
  const parts: CostParts = totals.cost_parts;
  return [
    {
      label: 'Processed',
      tokens: totals.new_input + totals.cache_write,
      cost: parts.new_input + parts.cache_write,
      color: 'var(--split-strong)',
      note:
        `New input ${compact(totals.new_input)} + cache writes ${compact(totals.cache_write)}, ` +
        'billed at full price or more',
    },
    {
      label: 'From cache',
      tokens: totals.cache_read,
      cost: parts.cache_read,
      color: 'var(--split-soft)',
      note: 'Cache reads, billed at a tenth of the input price and not processed again',
    },
  ];
}

/** The split's parts as the bar's description: "Processed 25%, From cache 75%". */
export function splitDescription(
  segments: SplitSegment[],
  totals: Pick<Usage, 'new_input' | 'cache_write' | 'cache_read'>,
): string {
  const input = inputTotal(totals);
  return segments.map((part) => `${part.label} ${percent(part.tokens, input)}`).join(', ');
}

/** What a compact hint threshold can be chosen by: the context each main-thread turn read, with the threshold where
 *  there is one. Null without turns. */
export function contextNote(context: ContextStats | null, hintTokens: number): string | null {
  if (!context?.turns) return null;
  return (
    `median context ${compact(context.median)} per turn (p90 ${compact(context.p90)})` +
    (hintTokens ? ` · compact hint at ${compact(hintTokens)}` : '')
  );
}

/** The notes under the four runtime tiles. */
export interface RuntimeNotes {
  session: string;
  api: string;
  tools: string;
  lines: string;
}

/** The runtime tiles' notes. `from` says whose totals they are; `estimated` is for a session's totals taken from its
 *  transcripts, which don't show the retries and whose tool time runs from each call to its result, so includes
 *  waiting for permission. `costPer100Lines` is null without lines changed or a price. */
export function runtimeNotes(
  runtime: Pick<SessionRuntime, 'duration_ms' | 'api_ms' | 'api_ms_without_retries' | 'tool_ms'>,
  from: string,
  costPer100Lines: number | null,
  estimated: boolean,
): RuntimeNotes {
  const retries = runtime.api_ms_without_retries === null ? null : runtime.api_ms - runtime.api_ms_without_retries;
  let api = 'no time lost to retries';
  if (retries === null) api = 'retries are not in the transcripts';
  else if (retries > 0) api = `${duration(retries)} of it retries`;
  return {
    session: `wall-clock, ${from}`,
    api,
    tools: estimated
      ? 'from each call to its result, incl. waiting for permission'
      : `${percent(runtime.tool_ms, runtime.duration_ms)} of the session time`,
    lines: costPer100Lines === null ? 'no lines changed' : `${money(costPer100Lines)} per 100 lines changed`,
  };
}

/** Whose totals the overview's runtime tiles show. */
export function runtimeFrom(sessions: number): string {
  return `${whole(sessions)} ${sessions === 1 ? 'session' : 'sessions'} that ended in the range`;
}

/** Where a session's runtime comes from, in words: the cost record Claude Code writes when its process exits, until
 *  then the transcripts. */
export function runtimeSource(source: SessionRuntime['source']): string {
  return source === 'cost_record' ? 'from its cost record' : 'estimated from the transcripts';
}

/** A session's whole cost per 100 lines changed, as the summary computes it for a range; null without lines or a
 *  price. */
export function sessionCostPer100Lines(detail: {
  cost: number | null;
  runtime: Pick<SessionRuntime, 'lines_added' | 'lines_removed'>;
}): number | null {
  const lines = detail.runtime.lines_added + detail.runtime.lines_removed;
  return detail.cost === null || lines === 0 ? null : (detail.cost / lines) * 100;
}
