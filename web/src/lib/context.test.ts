import { expect, test } from 'vitest';
import { lineX } from './charts.ts';
import {
  agentChoices,
  agentKey,
  agentName,
  COMPACTION_COLUMNS,
  compactionRows,
  compactionRules,
  compactionsTotal,
  compactionTurn,
  CONTEXT_BOTTOM,
  CONTEXT_PARTS,
  CONTEXT_PLOT,
  CONTEXT_TOP,
  contextAgents,
  contextKey,
  contextLabel,
  contextMax,
  contextNote,
  contextTiles,
  contextY,
  endLabels,
  GROWTH_COLUMNS,
  growthRows,
  hintLine,
  pickedAgent,
  RULE_LABEL_ROOM,
  stackShapes,
  toolSummary,
  TURN_COLUMNS,
  turnFacts,
  turnNotes,
  turnRows,
  turnTitle,
  turnValueText,
} from './context.ts';
import { agent, compaction, contextTurn, versusKeeping } from './fixtures.ts';
import { when } from './format.ts';

const turns = (...contexts: number[]) =>
  contexts.map((context, index) => contextTurn({ message_id: `msg-${index}`, context, ts: minute(index) }));

/** A moment `index` minutes after 08:00, in the turns' own time. */
function minute(index: number): string {
  return `2026-09-30T08:${String(index).padStart(2, '0')}:00.000Z`;
}

const main = (changes = {}) => agent({ context_per_turn: turns(10_000, 20_000), ...changes });
const sub = (id: string, changes = {}) =>
  agent({ agent_id: id, agent_type: 'Explore', context_per_turn: turns(5_000), ...changes });

// --- the picker ---

test('a transcript is the main thread, or its type with what it was asked to do', () => {
  expect(agentKey(agent())).toBe('main');
  expect(agentKey(sub('a1'))).toBe('a1');
  expect(agentName(agent())).toBe('main thread');
  expect(agentName(sub('a1'))).toBe('Explore');
  expect(agentName(sub('a1', { description: 'find the bug' }))).toBe('Explore · find the bug');
});

test('only transcripts with turns can be shown, and the one picked falls back to the first', () => {
  const background = agent({ agent_id: null, agent_type: '(background)', context_per_turn: [] });
  const agents = [background, main(), sub('a1')];
  expect(contextAgents(agents)).toEqual([agents[1], agents[2]]);
  expect(pickedAgent(agents, 'a1')).toBe(agents[2]);
  expect(pickedAgent(agents, 'gone')).toBe(agents[1]);
  expect(pickedAgent([background], 'main')).toBeNull();
  expect(pickedAgent([], 'main')).toBeNull();
});

test('there is nothing to choose between with fewer than two transcripts', () => {
  expect(agentChoices([])).toEqual([]);
  expect(agentChoices([main()])).toEqual([]);
  expect(agentChoices([main(), agent({ agent_id: 'b', context_per_turn: [] })])).toEqual([]);
});

test('the picker lists each transcript, a workflow run’s agents in one group', () => {
  const member = (id: string, name: string | null) =>
    sub(id, { workflow_run: 'wf_1', workflow_name: name, agent_type: 'workflow-subagent' });
  const choices = agentChoices([
    main(),
    sub('a1', { description: 'look' }),
    member('w1', 'review'),
    member('w2', 'review'),
  ]);
  expect(choices).toEqual([
    { kind: 'option', value: 'main', label: 'main thread' },
    { kind: 'option', value: 'a1', label: 'Explore · look' },
    {
      kind: 'group',
      key: 'wf_1',
      label: 'workflow · review',
      options: [
        { value: 'w1', label: 'workflow-subagent' },
        { value: 'w2', label: 'workflow-subagent' },
      ],
    },
  ]);
  expect(agentChoices([main(), member('w1', null)])[1]).toMatchObject({ label: 'workflow · wf_1' });
});

test('each transcript of each session pages its tables by a key of its own', () => {
  expect(contextKey('s1', agent())).toBe('s1-main');
  expect(contextKey('s1', sub('a1'))).toBe('s1-a1');
  expect(contextKey('s1', null)).toBe('s1-none');
});

test('the note and the chart’s name say which transcript and what it shows', () => {
  expect(contextNote(null)).toBe('');
  expect(contextNote(agent())).toBe('main thread: every turn sends its whole context again');
  expect(contextLabel(agent(), turns(10_000, 50_000, 30_000))).toBe(
    'Context per turn of the main thread, by cache read, cache write and new input: 3 turns, peak 50K, last 30K; ' +
      'table view available',
  );
});

// --- the chart ---

test('the stack parts run from the cheapest to the dearest, in the ramp’s colors', () => {
  expect(CONTEXT_PARTS.map((part) => part.field)).toEqual(['cache_read', 'cache_write', 'new_input']);
  expect(CONTEXT_PARTS.map((part) => part.color)).toEqual([
    'var(--context-read)',
    'var(--context-write)',
    'var(--context-new)',
  ]);
});

test('the axis tops at the peak rounded up, and a value falls between the plot’s bottom and top', () => {
  expect(contextMax(turns(10_000, 130_000, 50_000))).toBe(200_000);
  expect(contextMax([])).toBe(1);
  const yOf = contextY(200_000);
  expect(yOf(0)).toBe(CONTEXT_BOTTOM);
  expect(yOf(200_000)).toBe(CONTEXT_TOP);
  expect(yOf(100_000)).toBe(CONTEXT_TOP + CONTEXT_PLOT / 2);
});

test('the parts stack as areas, each edged on top, the next one starting where the last ended', () => {
  const two = [
    contextTurn({ cache_read: 100, cache_write: 50, new_input: 10, context: 160 }),
    contextTurn({ cache_read: 200, cache_write: 20, new_input: 30, context: 250 }),
  ];
  const xOf = lineX(2, 0, 100);
  const yOf = (value: number) => 300 - value;
  const shapes = stackShapes(two, xOf, yOf);
  expect(shapes.map((shape) => shape.kind)).toEqual(['area', 'area', 'area']);
  expect(shapes[0]).toMatchObject({
    area: 'M0.0,200.0L100.0,100.0L100.0,300.0L0.0,300.0Z',
    edge: 'M0.0,200.0L100.0,100.0',
  });
  expect(shapes[1]).toMatchObject({
    area: 'M0.0,150.0L100.0,80.0L100.0,100.0L0.0,200.0Z',
    edge: 'M0.0,150.0L100.0,80.0',
  });
  expect(shapes[2]).toMatchObject({ edge: 'M0.0,140.0L100.0,50.0' });
});

test('a single turn, which has no width, is a short column for each part', () => {
  const one = [contextTurn({ cache_read: 100, cache_write: 50, new_input: 10, context: 160 })];
  const shapes = stackShapes(one, lineX(1, 0, 100), (value) => 300 - value);
  expect(shapes).toEqual([
    { part: CONTEXT_PARTS[0], kind: 'column', x: 44, y: 200, width: 12, height: 100 },
    { part: CONTEXT_PARTS[1], kind: 'column', x: 44, y: 150, width: 12, height: 50 },
    { part: CONTEXT_PARTS[2], kind: 'column', x: 44, y: 140, width: 12, height: 10 },
  ]);
});

test('the compact hint is a reference line only where the plot reaches it', () => {
  const yOf = contextY(200_000);
  expect(hintLine(200_000, 200_000, yOf)).toEqual({ y: CONTEXT_TOP + 0.5, text: 'hint 200K' });
  expect(hintLine(100_000, 200_000, yOf)).toEqual({ y: CONTEXT_TOP + CONTEXT_PLOT / 2 + 0.5, text: 'hint 100K' });
  expect(hintLine(200_001, 200_000, yOf)).toBeNull();
  expect(hintLine(0, 200_000, yOf)).toBeNull();
});

test('a compaction goes before the first turn after it, and none without a time or a turn after it', () => {
  const list = turns(1, 2, 3);
  expect(compactionTurn(list, { ts: minute(0) })).toBe(1);
  expect(compactionTurn(list, { ts: '2026-09-30T08:00:30.000Z' })).toBe(1);
  expect(compactionTurn(list, { ts: minute(1) })).toBe(2);
  expect(compactionTurn(list, { ts: minute(2) })).toBe(-1);
  expect(compactionTurn(list, { ts: null })).toBe(-1);
  expect(compactionTurn(list, { ts: '2026-09-30T07:00:00.000Z' })).toBe(0);
});

test('a rule sits between the turns it falls between and is labelled by its trigger', () => {
  const list = turns(1, 2, 3, 4);
  const xOf = lineX(4, 0, 300);
  const rules = compactionRules(
    [
      { ts: '2026-09-30T08:00:30.000Z', trigger: 'manual' },
      { ts: '2026-09-30T07:00:00.000Z', trigger: 'auto' },
    ],
    list,
    xOf,
  );
  expect(rules).toEqual([
    { key: '0', x: 50, label: '/compact' },
    { key: '1', x: 0, label: null },
  ]);
});

test('a label needs room to the last one, a trigger it has no words for reads as a compaction', () => {
  const list = turns(1, 2, 3, 4, 5, 6);
  const xOf = lineX(6, 0, 500);
  const at = (index: number) => ({ ts: minute(index), trigger: 'auto' });
  const rules = compactionRules([at(0), at(1), at(3)], list, xOf);
  expect(rules.map((rule) => rule.x)).toEqual([50, 150, 350]);
  expect(rules.map((rule) => rule.label)).toEqual(['auto-compact', 'auto-compact', 'auto-compact']);
  const close = compactionRules([at(0), at(1)], list, lineX(6, 0, 100));
  expect(close.map((rule) => rule.label)).toEqual(['auto-compact', null]);
  expect(RULE_LABEL_ROOM).toBe(44);
  expect(compactionRules([{ ts: minute(0), trigger: 'odd' }], list, xOf)[0]?.label).toBe('compaction');
  expect(compactionRules([{ ts: minute(0), trigger: null }], list, xOf)[0]?.label).toBe('compaction');
  expect(compactionRules([{ ts: null, trigger: 'auto' }], list, xOf)).toEqual([]);
});

test('the latest total is labelled right of its point, the peak above its own', () => {
  const xOf = lineX(3, 0, 200);
  const yOf = contextY(100_000);
  const [peak, last] = endLabels([50_000, 100_000, 25_000], xOf, yOf, []);
  expect(peak).toEqual({ key: 'peak', x: 100, y: yOf(100_000) - 8, anchor: 'middle', text: 'peak 100K' });
  expect(last).toEqual({ key: 'last', x: 209, y: yOf(25_000) + 4, anchor: 'start', text: '25K' });
});

test('where the peak is the latest turn, one label says it', () => {
  const labels = endLabels([10_000, 100_000], lineX(2, 0, 200), contextY(100_000), []);
  expect(labels).toHaveLength(1);
  expect(labels[0]).toMatchObject({ key: 'last', text: '100K', anchor: 'start' });
});

test('a peak with a rule just after it ends at its point, so the rule’s label stays clear', () => {
  const xOf = lineX(3, 0, 200);
  const yOf = contextY(100_000);
  const near = endLabels([50_000, 100_000, 25_000], xOf, yOf, [120])[0];
  expect(near).toMatchObject({ key: 'peak', x: 94, anchor: 'end' });
  const far = endLabels([50_000, 100_000, 25_000], xOf, yOf, [100 + RULE_LABEL_ROOM])[0];
  expect(far).toMatchObject({ x: 100, anchor: 'middle' });
  const before = endLabels([50_000, 100_000, 25_000], xOf, yOf, [90])[0];
  expect(before).toMatchObject({ x: 100, anchor: 'middle' });
});

// --- a turn in words ---

test('a turn’s title counts it, gives its time and the effort where it has one', () => {
  const list = [contextTurn({ effort: 'high' }), contextTurn({ effort: null, ts: null })];
  expect(turnTitle(list, 0)).toBe(`Turn 1 of 2 · ${when('2026-09-30T08:00:00.000Z')} · effort high`);
  expect(turnTitle(list, 1)).toBe('Turn 2 of 2 · –');
});

test('the notes give the growth, and a rebuild with its cause and what it cost', () => {
  expect(turnNotes(contextTurn({ growth: null }))).toEqual([]);
  expect(turnNotes(contextTurn({ growth: -1_500 }))).toEqual(['grew −1.5K beyond the last reply']);
  expect(
    turnNotes(contextTurn({ growth: 2_000, rebuild: { cause: 'idle', lost: 40_000, extra_cost: 0.25 } })),
  ).toEqual([
    'grew +2K beyond the last reply',
    'cache rebuilt: the cache expired while idle (40K, +$0.25)',
  ]);
  expect(turnNotes(contextTurn({ growth: null, rebuild: { cause: 'model', lost: 1_000, extra_cost: null } }))).toEqual([
    'cache rebuilt: the model changed (1K)',
  ]);
});

test('a screen reader hears the context, its parts and the notes', () => {
  const list = [contextTurn({ growth: null })];
  expect(turnFacts(list[0]!)).toEqual(['context 50K', 'cache read 45K', 'cache write 4K', 'new input 1K']);
  expect(turnValueText(list, 0)).toBe(
    `Turn 1 of 1 · ${when('2026-09-30T08:00:00.000Z')}: context 50K, cache read 45K, cache write 4K, new input 1K`,
  );
  expect(turnValueText(list, 5)).toBe('');
});

test('the table view has a row per turn, each under the call’s own key', () => {
  const list = [
    contextTurn({ message_id: 'a', effort: 'max', growth: null }),
    contextTurn({ message_id: 'b', rebuild: { cause: 'model', lost: 12_000, extra_cost: null } }),
    contextTurn({ message_id: 'a' }),
  ];
  const rows = turnRows(list);
  expect(rows.map((row) => row.key)).toEqual(['a', 'b', 'a#1']);
  expect(rows[0]!.cells).toEqual([
    '1',
    when('2026-09-30T08:00:00.000Z'),
    'max',
    '45,000',
    '4,000',
    '1,000',
    '50,000',
    '–',
    '–',
  ]);
  expect(rows[1]!.cells.slice(2, 3)).toEqual(['–']);
  expect(rows[1]!.cells.at(-1)).toBe('model · 12K');
  expect(rows[1]!.cells.at(-2)).toBe('+2K');
  expect(TURN_COLUMNS).toHaveLength(rows[0]!.cells.length);
  expect(TURN_COLUMNS.map((column) => column.label)).toEqual([
    'Turn',
    'Time',
    'Effort',
    'Cache read',
    'Cache write',
    'New input',
    'Context',
    'Growth',
    'Cache rebuild',
  ]);
});

// --- under the chart ---

test('the tiles give the overhead, the rebuilds, the compactions and the mean growth', () => {
  const tiles = contextTiles(
    main({
      context_per_turn: [contextTurn({ growth: null }), contextTurn({ growth: 1_000 }), contextTurn({ growth: 2_000 })],
      overhead: { tokens: 12_000, cost: 0.4 },
      rebuilds: { count: 2, lost: 50_000, cost: 0.6 },
      compactions: [compaction(), compaction({ trigger: 'manual' }), compaction()],
    }),
  );
  expect(tiles).toEqual([
    {
      label: 'Fixed overhead',
      value: '12K',
      note: "the first call's context (system prompt, tools, CLAUDE.md); reading it again cost $0.40",
    },
    { label: 'Cache rebuilds', value: '2', note: '50K tokens written again, $0.60 extra' },
    { label: 'Compactions', value: '3', note: '1 /compact, 2 auto-compact' },
    {
      label: 'Growth per turn',
      value: '+1.5K',
      note: 'mean of what each turn added beyond the last reply: tool results, prompts, attachments',
    },
  ]);
});

test('the tiles say so where there is nothing to count', () => {
  const tiles = contextTiles(main({ context_per_turn: [contextTurn({ growth: null })], overhead: null }));
  expect(tiles.map((tile) => tile.value)).toEqual(['–', '0', '0', '–']);
  expect(tiles.map((tile) => tile.note).slice(0, 3)).toEqual([
    'no turns',
    'every turn read the previous context from the cache',
    'none',
  ]);
});

test('the tools a call ran are summed by name with their count and result size', () => {
  expect(toolSummary([])).toBe('');
  expect(
    toolSummary([
      { tool: 'Read', result_chars: 5_000 },
      { tool: 'Bash', result_chars: 30 },
      { tool: 'Read', result_chars: 7_400 },
      { tool: 'Read', result_chars: 0 },
    ]),
  ).toBe('Read ×3 12.4K, Bash 30');
});

test('the growth steps give their turn, time, growth and the tools the call before ran', () => {
  const rows = growthRows(
    main({
      context_per_turn: turns(10_000, 20_000, 40_000),
      top_growth: [
        {
          message_id: 'msg-2',
          ts: minute(2),
          growth: 18_000,
          tools: [{ tool: 'Read', result_chars: 9_000 }],
        },
        { message_id: 'msg-1', ts: minute(1), growth: 9_000, tools: [] },
        { message_id: 'gone', ts: null, growth: 1_000, tools: [] },
      ],
    }),
  );
  expect(rows.map((row) => row.key)).toEqual(['msg-2', 'msg-1', 'gone']);
  expect(rows[0]!.cells).toEqual(['3', when(minute(2)), '18K', 'Read 9K']);
  expect(rows[1]!.cells.at(-1)).toBe('none: a prompt or attachments');
  expect(rows[2]!.cells[0]).toBe('–');
  expect(GROWTH_COLUMNS).toHaveLength(rows[0]!.cells.length);
});

test('the compactions’ total is a gain or a loss, its title saying what is left out', () => {
  const saved = compactionsTotal([compaction(), compaction({ versus_keeping: versusKeeping({ net: 1.0 }) })]);
  expect(saved).toMatchObject({ tone: 'gain', text: '▲ saved ~$3.10 so far' });
  expect(saved!.title).toBe(
    'Each compaction against keeping its context, over its stretch up to the next one, summed; a stretch not paid ' +
      'off yet as it stands, forced compactions left out.',
  );
  const lost = compactionsTotal([compaction({ versus_keeping: versusKeeping({ verdict: 'cost_more', net: -0.4 }) })]);
  expect(lost).toMatchObject({ tone: 'loss', text: '▼ cost ~$0.40 more so far' });
  const unknown = compactionsTotal([
    compaction(),
    compaction({ versus_keeping: versusKeeping({ verdict: 'unknown', net: null }) }),
  ]);
  expect(unknown!.title).toContain(', 1 without an estimate not summed.');
  expect(compactionsTotal([])).toBeNull();
  expect(compactionsTotal([compaction({ versus_keeping: null })])).toBeNull();
});

test('a compaction row gives what it took, what it left and what it saved per later call', () => {
  const [row] = compactionRows([compaction()]);
  expect(row).toMatchObject({
    time: when('2026-09-30T09:00:00.000Z'),
    trigger: 'auto-compact',
    before: '60K',
    took: '30 s',
  });
  expect(row!.after).toEqual({
    text: '20K',
    title:
      'Claude Code reports 5K: without the system prompt, tools and CLAUDE.md the next call sends again',
  });
  expect(row!.versus).toEqual({
    each: '−40K · $0.02',
    oneTime: { text: '~$0.30', title: expect.stringContaining('The summary call ~$0.20') },
    paysOff: { text: 'call 5', title: null },
    callsAfter: { text: '40', title: 'up to the next compaction' },
    verdict: { text: '▲ +$2.10', tone: 'gain', words: 'Saved against keeping the context', title: null },
  });
  expect(COMPACTION_COLUMNS).toHaveLength(10);
});

test('what reaches past the last call, or the last stretch, says so', () => {
  const [row] = compactionRows([
    compaction({
      versus_keeping: versusKeeping({ breakeven_call: 50, calls_after: 40, last_stretch: true, rework_margin: 9_000 }),
    }),
  ]);
  expect(row!.versus!.paysOff.title).toBe('projected past the last call');
  expect(row!.versus!.callsAfter.title).toBe('up to the last call');
  expect(row!.versus!.verdict.title).toBe('Re-reading about 9K tokens after compacting would cancel the saving');
});

test('a compaction that kept the context’s size or grew it saved nothing per call', () => {
  const [row] = compactionRows([compaction({ versus_keeping: versusKeeping({ difference: -5_000 }) })]);
  expect(row!.versus!.each).toBe('+5K · nothing saved');
});

test('a compaction without a next context gives what Claude Code reported, one without a comparison has none', () => {
  const [row] = compactionRows([compaction({ next_context: null, versus_keeping: null })]);
  expect(row!.after.text).toBe('5K');
  expect(row!.versus).toBeNull();
});

test('a trigger it has no words for shows as it is, and none as a dash', () => {
  const rows = compactionRows([
    compaction({ trigger: 'manual' }),
    compaction({ trigger: 'odd', ts: minute(1) }),
    compaction({ trigger: null, ts: minute(2) }),
  ]);
  expect(rows.map((row) => row.trigger)).toEqual(['/compact', 'odd', '–']);
});

test('compactions at the same moment by the same trigger keep a key each, the same on every draw', () => {
  const twice = [compaction(), compaction(), compaction({ ts: minute(5) })];
  const keys = compactionRows(twice).map((row) => row.key);
  expect(new Set(keys).size).toBe(3);
  expect(compactionRows(twice).map((row) => row.key)).toEqual(keys);
  expect(compactionRows([compaction()])[0]!.key).toBe(keys[0]);
});

test('a label needs exactly the room, no more, and a rule at the peak’s own x is near it', () => {
  const list = turns(1, 2, 3, 4, 5, 6);
  const at = (index: number) => ({ ts: minute(index), trigger: 'auto' });
  // six turns 44 apart: the rules fall 44 px from each other, which is room enough
  const rules = compactionRules([at(0), at(1)], list, lineX(6, 0, 220));
  expect(rules.map((rule) => rule.x)).toEqual([22, 66]);
  expect(rules.map((rule) => rule.label)).toEqual(['auto-compact', 'auto-compact']);
  const xOf = lineX(3, 0, 200);
  const label = endLabels([50_000, 100_000, 25_000], xOf, contextY(100_000), [100])[0];
  expect(label).toMatchObject({ key: 'peak', x: 94, anchor: 'end' });
});

test('a total of nothing is a gain of nothing, and nothing but unknowns is no total', () => {
  const even = compaction({ versus_keeping: versusKeeping({ verdict: 'even', net: 0 }) });
  expect(compactionsTotal([even])).toMatchObject({ tone: 'gain', text: '▲ saved ~$0.00 so far' });
  const unknown = compaction({ versus_keeping: versusKeeping({ verdict: 'unknown', net: null }) });
  expect(compactionsTotal([unknown])).toBeNull();
});

test('a compaction that left the size as it was saved nothing per call', () => {
  const [row] = compactionRows([compaction({ versus_keeping: versusKeeping({ difference: 0 }) })]);
  expect(row!.versus!.each).toBe('+0 · nothing saved');
});

test('a break-even at the last call is paid off, not projected', () => {
  const same = versusKeeping({ breakeven_call: 40, calls_after: 40 });
  const [row] = compactionRows([compaction({ versus_keeping: same })]);
  expect(row!.versus!.paysOff).toEqual({ text: 'call 40', title: null });
});
