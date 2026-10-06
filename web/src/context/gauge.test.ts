import { expect, test } from 'vitest';
import { compactCall, compactedNote, compactNotes, delegateCall, gaugeCard } from './gauge.ts';
import { compactEstimate, compactNow, gauge } from '../api/fixtures.ts';
import { when } from '../ui/format.ts';

const WARM = '2026-09-28T12:30:00.000+00:00';

test('after a compaction without a reply since, the gauge gives the context before it', () => {
  expect(compactedNote({ context: 250_000, auto_compact: 967_000 })).toBe(
    'Before it, the context was 250K of 967K. The next reply shows the new one: the summary, with the system prompt, ' +
      'tools and CLAUDE.md sent again.',
  );
  const card = gaugeCard(gauge({ context: 250_000, compacted: '2026-09-28T11:00:00.000+00:00', compact_now: null }));
  expect(card).toMatchObject({
    kind: 'compacted',
    label: 'Latest context, main thread · claude-opus-5-5',
    value: 'Compacted',
    secondary: `at ${when('2026-09-28T11:00:00.000+00:00')}, no reply since`,
  });
  expect(card.note).toContain('Before it, the context was 250K of 967K.');
});

test('the meter shows the context against the auto-compact point, the hint marked on it', () => {
  const card = gaugeCard(gauge({ context: 193_400 }));
  expect(card).toMatchObject({
    kind: 'meter',
    value: '193.4K',
    secondary: 'of 967K · 20%',
    meterLabel: 'Latest context 193.4K of the auto-compact point 967K',
    max: 967_000,
    now: 193_400,
    fill: '20.0%',
    hintAt: '20.7%',
  });
});

test('the meter fills no further than the auto-compact point, with no hint mark where the hint is not below', () => {
  const card = gaugeCard(gauge({ context: 1_200_000, hint_tokens: 967_000 }));
  expect(card).toMatchObject({ kind: 'meter', fill: '100.0%', hintAt: null });
  expect(card.note).not.toContain('the mark is the compact hint');
});

test('the meter’s note counts the headroom, the turns since the compaction and the pace', () => {
  const card = gaugeCard(gauge({ context: 150_000 }));
  expect(card.note).toBe(
    '817K until auto-compact · the mark is the compact hint at 200K, a heuristic · 40 turns since the last ' +
      `compaction (${when('2026-09-28T09:00:00.000+00:00')}) · about 230 turns left at +3.5K per turn (mean of the ` +
      'last 10)',
  );
});

test('the pace says so where there are too few turns or the context is not growing', () => {
  expect(gaugeCard(gauge({ mean_step: null, turns_left: null })).note).toContain('too few turns for an estimate');
  expect(gaugeCard(gauge({ mean_step: -500, turns_left: null })).note).toContain('−500 per turn, not growing');
  expect(gaugeCard(gauge({ last_compaction: null })).note).toContain('40 turns since the session started');
});

test('the exact parts name the re-read and, while the cache is warm, when it runs out', () => {
  const notes = compactNotes(compactNow(), false);
  expect(notes.exact).toBe(
    'Every reply sends the whole conversation again: 150K, $0.06 each time from the cache. ' +
      `The cache stays warm until ${when(WARM)} (5 min after the last request); after that, the next reply costs ` +
      '$0.90 more.',
  );
});

test('once the cache has expired the exact parts say what the next reply costs more', () => {
  expect(compactNotes(compactNow(), true).exact).toContain(
    `The cache has likely expired (${when(WARM)}): the next reply sends it all at the full price, $0.90 more.`,
  );
});

test('without a cache lifetime the exact parts are the re-read alone', () => {
  const notes = compactNotes(compactNow({ cache_warm_until: null }), false);
  expect(notes.exact).toBe('Every reply sends the whole conversation again: 150K, $0.06 each time from the cache.');
});

test('without an estimate the note says why: no compaction stored, or none that carries a summary', () => {
  const none = compactNotes(compactNow({ estimate: null, stored_compactions: 0 }), false);
  expect(none.estimate).toBeNull();
  expect(none.missing).toBe('No estimate of compacting now: no stored compaction to learn from yet.');
  const one = compactNotes(compactNow({ estimate: null, stored_compactions: 1 }), false);
  expect(one.missing).toBe(
    'No estimate of compacting now: your 1 stored compaction carries no duration or output speed to estimate the ' +
      'summary from.',
  );
  expect(compactNotes(compactNow({ estimate: null, stored_compactions: 3 }), false).missing).toContain(
    'your 3 stored compactions carry no duration',
  );
});

test('the estimate gives the size after, the cost once and when it pays off, with the tone', () => {
  const notes = compactNotes(compactNow(), false);
  expect(notes.missing).toBeNull();
  expect(notes.estimate).toEqual({
    lead: 'If you compacted now, it would shrink to about 50K (40K–60K). That costs ~$0.30 once and ',
    tone: 'soon',
    phrase: 'would pay off after about 10 replies (5–20)',
    rest:
      '. Soon: after your past compactions, a stretch this long went on for about 40 more replies on average. ' +
      'Learnt from your 5 stored compactions, which were followed by 20–60 replies until the next one.',
  });
});

test('the estimate after the cache has expired compares compacting cold against keeping', () => {
  const notes = compactNotes(compactNow({ estimate: compactEstimate({ cold_saving: 1.2 }) }), true);
  expect(notes.estimate).toMatchObject({
    lead: 'If you compacted now, it would shrink to about 50K (40K–60K). Compacting ',
    tone: 'soon',
    phrase: 'pays off at once (about $1.20), since the next reply sends it all anyway',
  });
});

test('the estimate names a saving from compacting before a break while the cache is warm', () => {
  const estimate = compactEstimate({ before_break: 0.4, after_low: 50_000, after_high: 50_000, calls_after_low: null });
  const notes = compactNotes(compactNow({ estimate }), false);
  expect(notes.estimate!.lead).toContain('shrink to about 50K. ');
  expect(notes.estimate!.rest).toContain(`Compacting before a break past ${when(WARM)} saves about $0.40 at once.`);
  expect(notes.estimate!.rest).not.toContain('which were followed by');
  expect(compactNotes(compactNow({ estimate }), true).estimate!.rest).not.toContain('before a break');
});

test('a single number of replies is not a range', () => {
  const estimate = compactEstimate({ calls_after_low: 30, calls_after_high: 30 });
  expect(compactNotes(compactNow({ estimate }), false).estimate!.rest).toContain('followed by 30 replies');
});

test('the call for a cold cache says what compacting saves at once', () => {
  const current = gauge({ compact_now: compactNow({ estimate: compactEstimate({ cold_saving: 1.2 }) }) });
  expect(compactCall(current, 'cold', true)).toEqual({
    title: '⚠ The cache has expired: compacting now saves money',
    lines: [
      'The cache has expired, so the next reply sends your whole conversation (150K) again at the full price. ' +
        'Compacting would shrink it to about 50K. Doing it now saves about $1.20 at once.',
    ],
  });
});

test('the call past the hint says what each reply re-reads and what compacting costs, and why it shows', () => {
  const call = compactCall(gauge({ context: 250_000 }), 'threshold', false)!;
  expect(call.title).toBe('⚠ Your context is past your 200K compact hint');
  expect(call.lines).toEqual([
    'Every reply sends your whole conversation again: 150K, ~$0.06 each time from the cache.',
    'Compacting would shrink it to about 50K. That costs ~$0.30 once and would pay off after about 10 replies (5–20).',
    "How many replies still follow can't be predicted, so past your own threshold ([chat] compact_hint_tokens) this " +
      'shows whatever the estimate says.',
  ]);
});

test('the call past the hint advises compacting before a break while the cache is warm', () => {
  const estimate = compactEstimate({ before_break: 0.4 });
  const call = compactCall(gauge({ compact_now: compactNow({ estimate }) }), 'threshold', false)!;
  expect(call.lines).toContain(
    `Taking a break past ${when(WARM)}? Compact before it: the cache expires then, and compacting first saves ` +
      'about $0.40 at the next reply.',
  );
  const cold = compactCall(gauge({ compact_now: compactNow({ estimate }) }), 'threshold', true)!;
  expect(cold.lines.join(' ')).not.toContain('Taking a break');
});

test('the call past the hint says nothing of a break where compacting first saves nothing', () => {
  for (const before_break of [0, -0.2, null]) {
    const estimate = compactEstimate({ before_break });
    const call = compactCall(gauge({ compact_now: compactNow({ estimate }) }), 'threshold', false)!;
    expect(call.lines.join(' ')).not.toContain('Taking a break');
  }
});

test('the call past the hint with an expired cache says the next reply sends it all', () => {
  const current = gauge({ compact_now: compactNow({ estimate: compactEstimate({ cold_saving: -0.5 }) }) });
  const call = compactCall(current, 'threshold', true)!;
  expect(call.lines[0]).toBe(
    'The cache has expired, so the next reply sends your whole conversation (150K) again at the full price.',
  );
  expect(call.lines[1]).toContain('Compacting would shrink it to about 50K and ');
});

test('the call past the hint without an estimate has no word on compacting', () => {
  const call = compactCall(gauge({ compact_now: compactNow({ estimate: null }) }), 'threshold', false)!;
  expect(call.lines).toHaveLength(2);
  expect(call.lines[0]).toContain('Every reply sends your whole conversation again');
});

test('there is no call without a preview of compacting now, or a cold one without an estimate', () => {
  expect(compactCall(gauge({ compact_now: null }), 'threshold', false)).toBeNull();
  expect(compactCall(gauge({ compact_now: compactNow({ estimate: null }) }), 'cold', true)).toBeNull();
});

test('the hint to delegate says what the exploration costs so far and per reply, and that it is a heuristic', () => {
  const exploration = { calls: 12, chars: 69_000, tokens: 30_000, carried: 0.4, reread: 0.006 };
  const estimate = compactEstimate({ calls_ahead: 73.5 });
  const hint = delegateCall(gauge({ exploration, compact_now: compactNow({ estimate }) }))!;
  expect(hint.title).toBe('Explore in a subagent');
  expect(hint.lines[0]).toBe(
    'Since the last compaction the main thread has read, searched and listed 30K tokens in 12 calls. They stay in ' +
      'the context: every reply reads them again, ~$0.01 each and ~$0.40 so far.',
  );
  expect(hint.lines[1]).toBe(
    'After your past compactions, a stretch this long went on for about 74 more replies on average. A subagent ' +
      '(such as Explore) reads in its own context and hands back only its summary, so the next search costs less ' +
      'delegated.',
  );
  expect(hint.note).toContain('A heuristic');
});

test('the hint to delegate counts the replies after all finished stretches where none was longer', () => {
  const exploration = { calls: 12, chars: 69_000, tokens: 30_000, carried: 0.4, reread: 0.006 };
  const estimate = compactEstimate({ calls_ahead: 73.5, ahead_from: 'all' });
  const hint = delegateCall(gauge({ exploration, compact_now: compactNow({ estimate }) }))!;
  expect(hint.lines[1]).toContain('After your past compactions you went on for about 74 replies on average.');
});

test('there is no hint to delegate without exploration or replies ahead to compare with', () => {
  const exploration = { calls: 12, chars: 69_000, tokens: 30_000, carried: 0.4, reread: 0.006 };
  expect(delegateCall(gauge({ exploration: null }))).toBeNull();
  expect(delegateCall(gauge({ exploration, compact_now: null }))).toBeNull();
  expect(delegateCall(gauge({ exploration, compact_now: compactNow({ estimate: null }) }))).toBeNull();
  const unknown = compactEstimate({ calls_ahead: null });
  expect(delegateCall(gauge({ exploration, compact_now: compactNow({ estimate: unknown }) }))).toBeNull();
});
