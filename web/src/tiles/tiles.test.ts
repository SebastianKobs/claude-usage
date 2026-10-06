import { expect, test } from 'vitest';
import type { CompactionSavings, ContextStats, RuntimeTotals, Usage } from '../api/api';
import {
  contextNote,
  costNotes,
  rangeText,
  runtimeFrom,
  runtimeNotes,
  runtimeSource,
  savingsNote,
  sessionCostPer100Lines,
  splitDescription,
  splitSegments,
} from './tiles';

const EN = 'en-US';

function usage(changes: Partial<Usage> = {}): Usage {
  return {
    turns: 10,
    new_input: 100,
    cache_write_5m: 0,
    cache_write_1h: 0,
    cache_read: 900,
    output: 50,
    cache_write: 200,
    web_searches: 0,
    cost: 1.5,
    cost_parts: { new_input: 0.1, cache_write: 0.4, cache_read: 0.2, output: 0.7, web_search: 0 },
    unpriced_turns: 0,
    ...changes,
  };
}

const span = { days: 7, since: '2026-09-24', until: '2026-09-30', history_since: null };

test('a week reads as the last days, and a young history says where it starts', () => {
  expect(rangeText(span, '2026-09-30', EN)).toBe('last 7 days');
  const young = { ...span, history_since: '2026-09-27' };
  expect(rangeText(young, '2026-09-30', EN)).toBe('last 7 days (history since Sep 27)');
});

test('a history that starts with the range, or before it, is not mentioned', () => {
  expect(rangeText({ ...span, history_since: '2026-09-24' }, '2026-09-30', EN)).toBe('last 7 days');
  expect(rangeText({ ...span, history_since: '2026-01-01' }, '2026-09-30', EN)).toBe('last 7 days');
});

test('one day is today, or the day written out', () => {
  const day = { ...span, days: 1, since: '2026-09-30', until: '2026-09-30' };
  expect(rangeText(day, '2026-09-30', EN)).toBe('today');
  expect(rangeText({ ...day, since: '2026-09-28', until: '2026-09-28' }, '2026-09-30', EN)).toBe('Mon, Sep 28');
});

test('the cost note says list prices, or counts the turns left out for want of a price', () => {
  expect(costNotes(usage())).toBe('at API list prices');
  expect(costNotes(usage({ unpriced_turns: 1234 }))).toBe('1,234 turns of models without a price are not included');
});

test('web searches and their fee join the cost note', () => {
  const searches = usage({ web_searches: 3, cost_parts: { ...usage().cost_parts, web_search: 0.03 } });
  expect(costNotes(searches)).toBe('at API list prices · incl. 3 web searches, $0.03');
});

function savings(changes: Partial<CompactionSavings> = {}): CompactionSavings {
  return { net: 2.5, compactions: 3, unknown: 0, ...changes };
}

test('a gain says what compacting saved, with its count', () => {
  const note = savingsNote(savings());
  expect(note).toMatchObject({ verdict: 'gain', amount: '▲ compacting saved ~$2.50 so far', count: '(3 compactions)' });
});

test('a loss says what it cost, in a positive amount', () => {
  expect(savingsNote(savings({ net: -1.25, compactions: 1 }))).toMatchObject({
    verdict: 'loss',
    amount: '▼ compacting cost ~$1.25 more so far',
    count: '(1 compaction)',
  });
});

test('a net of nothing is a gain, and the count names those without an estimate', () => {
  expect(savingsNote(savings({ net: 0, unknown: 2 }))).toMatchObject({
    verdict: 'gain',
    count: '(3 compactions, 2 without an estimate)',
  });
});

test('without a summed compaction only those without an estimate are counted, as no verdict', () => {
  const note = savingsNote(savings({ compactions: 0, unknown: 2, net: 0 }));
  expect(note).toMatchObject({ verdict: null, amount: null, count: 'Compacting: 2 without an estimate' });
});

test('every savings note explains what it sums and what ~ means', () => {
  for (const note of [savingsNote(savings()), savingsNote(savings({ compactions: 0, unknown: 1 }))]) {
    expect(note.title).toContain('over its stretch up to the next one');
    expect(note.title).toContain('~: the summary call is estimated');
  }
});

test('the split is two parts of one whole: processed, then from cache, each with its cost and its note', () => {
  const [processed, cached] = splitSegments(usage());
  expect(processed).toMatchObject({ label: 'Processed', tokens: 300, cost: 0.5, color: 'var(--split-strong)' });
  expect(processed?.note).toBe('New input 100 + cache writes 200, billed at full price or more');
  expect(cached).toMatchObject({ label: 'From cache', tokens: 900, cost: 0.2, color: 'var(--split-soft)' });
  expect(cached?.note).toBe('Cache reads, billed at a tenth of the input price and not processed again');
});

test('the bar is described by each part and its share of the input', () => {
  expect(splitDescription(splitSegments(usage()), usage())).toBe('Processed 25%, From cache 75%');
});

const context: ContextStats = { turns: 40, median: 120_000, p90: 180_000 };

test('the context note gives the median and p90, and the hint where there is one', () => {
  expect(contextNote(context, 200_000)).toBe('median context 120K per turn (p90 180K) · compact hint at 200K');
  expect(contextNote(context, 0)).toBe('median context 120K per turn (p90 180K)');
});

test('no turns, or no context, have no note', () => {
  expect(contextNote({ ...context, turns: 0 }, 200_000)).toBeNull();
  expect(contextNote(null, 200_000)).toBeNull();
});

function runtime(changes: Partial<RuntimeTotals> = {}): RuntimeTotals {
  return {
    sessions: 2,
    estimated_sessions: 0,
    duration_ms: 3_600_000,
    api_ms: 1_800_000,
    api_ms_without_retries: 1_740_000,
    tool_ms: 900_000,
    lines_added: 1200,
    lines_removed: 30,
    cost: 4,
    cost_per_100_lines: 0.33,
    ...changes,
  };
}

test('the runtime notes say where the time comes from and what it is a share of', () => {
  expect(runtimeNotes(runtime(), '2 sessions that ended in the range', 0.33, false)).toEqual({
    session: 'wall-clock, 2 sessions that ended in the range',
    api: '1 min of it retries',
    tools: '25% of the session time',
    lines: '$0.33 per 100 lines changed',
  });
});

test('no time lost to retries, and retries not in the transcripts, are said so', () => {
  expect(runtimeNotes(runtime({ api_ms_without_retries: 1_800_000 }), 'x', null, false).api).toBe(
    'no time lost to retries',
  );
  expect(runtimeNotes({ ...runtime(), api_ms_without_retries: null }, 'x', null, true).api).toBe(
    'retries are not in the transcripts',
  );
});

test('estimated totals say the tool time includes waiting for permission, and no lines is no price', () => {
  const notes = runtimeNotes(runtime(), 'x', null, true);
  expect(notes.tools).toBe('from each call to its result, incl. waiting for permission');
  expect(notes.lines).toBe('no lines changed');
});

test('the overview names the sessions its run totals sum, one in the singular', () => {
  expect(runtimeFrom(1, 0)).toBe('1 session that ended in the range');
  expect(runtimeFrom(0, 0)).toBe('0 sessions that ended in the range');
  expect(runtimeFrom(1500, 0)).toBe('1,500 sessions that ended in the range');
});

test('the overview says which sessions have no cost record yet and are estimated from their transcripts', () => {
  expect(runtimeFrom(2, 1)).toBe(
    '2 sessions that ended in the range, and 1 more without a cost record yet (estimated)',
  );
  expect(runtimeFrom(0, 3)).toBe('3 sessions without a cost record yet (estimated), none ended in the range');
  expect(runtimeFrom(0, 1)).toBe('1 session without a cost record yet (estimated), none ended in the range');
});

test('the source words follow the session runtime: its cost record, or the transcripts', () => {
  expect(runtimeSource('cost_record')).toBe('from its cost record');
  expect(runtimeSource('transcripts')).toBe('estimated from the transcripts');
});

test('the cost per 100 lines is the whole cost over the lines added and removed', () => {
  expect(sessionCostPer100Lines({ cost: 3, runtime: { lines_added: 200, lines_removed: 100 } })).toBe(1);
});

test('no lines or no price has no cost per line', () => {
  expect(sessionCostPer100Lines({ cost: 3, runtime: { lines_added: 0, lines_removed: 0 } })).toBeNull();
  expect(sessionCostPer100Lines({ cost: null, runtime: { lines_added: 5, lines_removed: 0 } })).toBeNull();
});
