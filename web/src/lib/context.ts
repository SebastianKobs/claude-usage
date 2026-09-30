// The session view's context per turn: what each turn sent, stacked by part, for one transcript at a time. The picker's
// choices, the chart's geometry (the stacked areas, the hint line, the compactions' rules, the two direct labels), the
// words of its tooltip and table view, and what sits under it: the tiles, the biggest growth steps and the
// compactions. Plain functions over the server's answers, so the components only draw them.

import type { Agent, Compaction, ContextTurn, GrowthTool } from './api.ts';
import { AXIS_BAND } from './chartkit.ts';
import { niceMax, peakIndex } from './charts.ts';
import {
  breakevenCall,
  type CompactionTotal,
  compactionTotal,
  oneTimeText,
  oneTimeTitle,
  REBUILD_CAUSES,
  VERSUS_KEEPING_NOTE,
  verdictText,
  verdictTitle,
  verdictTone,
  verdictWords,
} from './compact.ts';
import { compact, duration, money, signed, when, whole } from './format.ts';

/** The plot's height. */
export const CONTEXT_PLOT = 160;

/** Room above the plot for the compaction labels. */
export const CONTEXT_TOP = 18;

/** A compaction rule's label shows only where it has this much room to its left. */
export const RULE_LABEL_ROOM = 44;

/** A part of a turn's context: its field, its words and its color. */
export interface ContextPart {
  field: 'cache_read' | 'cache_write' | 'new_input';
  label: string;
  color: string;
}

/** The parts of a turn's context, from the cheapest (bottom) to the dearest: one hue, light to dark, validated as an
 *  ordinal ramp in both modes. */
export const CONTEXT_PARTS: readonly ContextPart[] = [
  { field: 'cache_read', label: 'Cache read', color: 'var(--context-read)' },
  { field: 'cache_write', label: 'Cache write', color: 'var(--context-write)' },
  { field: 'new_input', label: 'New input', color: 'var(--context-new)' },
];

/** How a compaction's trigger reads. */
export const COMPACTION_TRIGGERS: Record<string, string> = { manual: '/compact', auto: 'auto-compact' };

export const NO_TURNS = 'No turns with usage.';
export const NO_GROWTH = 'No turn grew the context.';
export const NO_COMPACTIONS = 'No compactions.';

/** The note under the compactions table. */
export const COMPACTION_NOTE =
  `${VERSUS_KEEPING_NOTE} Each compaction is compared over its own stretch, up to the next one; ` +
  "the Estimated cost tile adds up the main thread's.";

// --- the transcript picker ------------------------------------------------------------------------------------

/** The picker's value for a transcript: its agent id, "main" for the main thread. */
export function agentKey(agent: Pick<Agent, 'agent_id'>): string {
  return agent.agent_id ?? 'main';
}

/** A transcript in words: the main thread, or the agent's type with what it was asked to do. */
export function agentName(agent: Pick<Agent, 'agent_id' | 'agent_type' | 'description'>): string {
  if (agent.agent_id === null) return 'main thread';
  return agent.description ? `${agent.agent_type} · ${agent.description}` : agent.agent_type;
}

/** The transcripts with turns (background calls have none), in the order the session lists them. */
export function contextAgents<Row extends Pick<Agent, 'context_per_turn'>>(agents: readonly Row[]): Row[] {
  return agents.filter((agent) => agent.context_per_turn.length);
}

/** The transcript picked by its key, else the first (the main thread), else none. */
export function pickedAgent<Row extends Pick<Agent, 'agent_id' | 'context_per_turn'>>(
  agents: readonly Row[],
  key: string,
): Row | null {
  const withTurns = contextAgents(agents);
  return withTurns.find((agent) => agentKey(agent) === key) ?? withTurns[0] ?? null;
}

/** A picker option, or a group of them (a workflow run's agents). */
export type AgentChoice =
  | { kind: 'option'; value: string; label: string }
  | { kind: 'group'; key: string; label: string; options: { value: string; label: string }[] };

/** The picker's choices, one per transcript with turns, a workflow run's agents in one group per run; nothing where
 *  there is less than one to choose between. */
export function agentChoices(
  agents: readonly (Pick<Agent, 'agent_id' | 'agent_type' | 'description' | 'context_per_turn'> &
    Pick<Agent, 'workflow_run' | 'workflow_name'>)[],
): AgentChoice[] {
  const withTurns = contextAgents(agents);
  if (withTurns.length < 2) return [];
  const choices: AgentChoice[] = [];
  const groups = new Map<string, Extract<AgentChoice, { kind: 'group' }>>();
  for (const agent of withTurns) {
    const option = { value: agentKey(agent), label: agentName(agent) };
    if (agent.workflow_run === null) {
      choices.push({ kind: 'option', ...option });
      continue;
    }
    let group = groups.get(agent.workflow_run);
    if (!group) {
      group = {
        kind: 'group',
        key: agent.workflow_run,
        label: `workflow · ${agent.workflow_name || agent.workflow_run}`,
        options: [],
      };
      groups.set(agent.workflow_run, group);
      choices.push(group);
    }
    group.options.push(option);
  }
  return choices;
}

/** The pager key of the picked transcript's tables: another transcript, or session, starts at the first page. */
export function contextKey(sessionId: string, agent: Pick<Agent, 'agent_id'> | null): string {
  return `${sessionId}-${agent ? agentKey(agent) : 'none'}`;
}

/** What the heading's note says of the transcript shown. */
export function contextNote(agent: Pick<Agent, 'agent_id' | 'agent_type' | 'description'> | null): string {
  return agent ? `${agentName(agent)}: every turn sends its whole context again` : '';
}

/** The chart's name for a screen reader. */
export function contextLabel(
  agent: Pick<Agent, 'agent_id' | 'agent_type' | 'description'>,
  turns: readonly ContextTurn[],
): string {
  const values = turns.map((turn) => turn.context);
  const last = values[values.length - 1] ?? 0;
  return (
    `Context per turn of the ${agentName(agent)}, by cache read, cache write and new input: ` +
    `${turns.length} turns, peak ${compact(Math.max(...values))}, last ${compact(last)}; table view available`
  );
}

// --- the chart --------------------------------------------------------------------------------------------------

/** The plot's bottom edge. */
export const CONTEXT_BOTTOM = CONTEXT_TOP + CONTEXT_PLOT;

/** The drawing's height: the plot, its room above and the band of x labels. */
export const CONTEXT_HEIGHT = CONTEXT_BOTTOM + AXIS_BAND;

/** The top of the y axis for these turns: the peak context rounded up. */
export function contextMax(turns: readonly Pick<ContextTurn, 'context'>[]): number {
  return niceMax(Math.max(0, ...turns.map((turn) => turn.context)));
}

/** Where a value falls on the y axis that ends at `max`. */
export function contextY(max: number): (value: number) => number {
  return (value) => CONTEXT_BOTTOM - (CONTEXT_PLOT * value) / max;
}

/** A part drawn: stacked areas with a 2px line of the surface on top so neighbours stay apart, or, for a single turn,
 *  which has no width, a short column. */
export type StackShape =
  | { part: ContextPart; kind: 'area'; area: string; edge: string }
  | { part: ContextPart; kind: 'column'; x: number; y: number; width: number; height: number };

/** The three parts as stacked shapes, cheapest at the bottom. */
export function stackShapes(
  turns: readonly ContextTurn[],
  xOf: (index: number) => number,
  yOf: (value: number) => number,
): StackShape[] {
  let base = turns.map(() => 0);
  return CONTEXT_PARTS.map((part) => {
    const top = base.map((value, index) => value + (turns[index]?.[part.field] ?? 0));
    const point = (value: number, index: number): string => `${xOf(index).toFixed(1)},${yOf(value).toFixed(1)}`;
    const upper = top.map(point);
    const lower = base.map(point).reverse();
    const below = base;
    base = top;
    if (turns.length === 1) {
      const y = yOf(top[0] ?? 0);
      return { part, kind: 'column', x: xOf(0) - 6, y, width: 12, height: Math.max(0, yOf(below[0] ?? 0) - y) };
    }
    return { part, kind: 'area', area: `M${upper.join('L')}L${lower.join('L')}Z`, edge: `M${upper.join('L')}` };
  });
}

/** The compact hint as a reference line: where it falls and its label; null where the plot does not reach it. */
export function hintLine(
  hintTokens: number,
  max: number,
  yOf: (value: number) => number,
): { y: number; text: string } | null {
  if (!hintTokens || hintTokens > max) return null;
  return { y: Math.round(yOf(hintTokens)) + 0.5, text: `hint ${compact(hintTokens)}` };
}

/** The turn the chart puts a compaction before: the first turn after it; -1 without a time or a turn after it. */
export function compactionTurn(
  turns: readonly Pick<ContextTurn, 'ts'>[],
  compaction: Pick<Compaction, 'ts'>,
): number {
  if (!compaction.ts) return -1;
  const moment = Date.parse(compaction.ts);
  return turns.findIndex((turn) => turn.ts && Date.parse(turn.ts) > moment);
}

/** A dashed rule before the first turn after a compaction, and its label (the trigger) where there is room. */
export interface CompactionRule {
  key: string;
  x: number;
  label: string | null;
}

/** The rules of the compactions that have a turn after them, in order; a label only where `RULE_LABEL_ROOM` clears the
 *  last one that has it. */
export function compactionRules(
  compactions: readonly Pick<Compaction, 'ts' | 'trigger'>[],
  turns: readonly Pick<ContextTurn, 'ts'>[],
  xOf: (index: number) => number,
): CompactionRule[] {
  const rules: CompactionRule[] = [];
  let lastLabel = -Infinity;
  compactions.forEach((compaction, position) => {
    const index = compactionTurn(turns, compaction);
    if (index < 0) return;
    const x = index > 0 ? (xOf(index - 1) + xOf(index)) / 2 : xOf(0);
    const fits = x - lastLabel >= RULE_LABEL_ROOM;
    if (fits) lastLabel = x;
    rules.push({
      key: String(position),
      x,
      label: fits ? (COMPACTION_TRIGGERS[compaction.trigger ?? ''] ?? 'compaction') : null,
    });
  });
  return rules;
}

/** A direct label on the chart: the peak or the latest turn's total. */
export interface EndLabel {
  key: 'peak' | 'last';
  x: number;
  y: number;
  anchor: 'start' | 'middle' | 'end';
  text: string;
}

/**
 * The two totals that matter, the peak and the latest turn (one label where they are the same turn). The latest sits
 * right of its point; the peak above its own, its text ending at the point where a compaction rule follows within
 * `RULE_LABEL_ROOM`, so that the rule's label and this one do not meet.
 */
export function endLabels(
  values: readonly number[],
  xOf: (index: number) => number,
  yOf: (value: number) => number,
  ruleXs: readonly number[],
): EndLabel[] {
  const last = values.length - 1;
  const peak = peakIndex(values);
  const at = (index: number): EndLabel => {
    const atEnd = index === last;
    const value = values[index] ?? 0;
    const ruleNear = ruleXs.some((x) => x >= xOf(index) && x - xOf(index) < RULE_LABEL_ROOM);
    return {
      key: atEnd ? 'last' : 'peak',
      x: atEnd ? xOf(index) + 9 : ruleNear ? xOf(index) - 6 : xOf(index),
      y: atEnd ? yOf(value) + 4 : yOf(value) - 8,
      anchor: atEnd ? 'start' : ruleNear ? 'end' : 'middle',
      text: atEnd ? compact(value) : `peak ${compact(value)}`,
    };
  };
  return (peak === last ? [last] : [peak, last]).map(at);
}

// --- a turn in words --------------------------------------------------------------------------------------------

/** "Turn 3 of 40 · <time> · effort high": the tooltip's heading and the slider's first words. */
export function turnTitle(turns: readonly Pick<ContextTurn, 'ts' | 'effort'>[], index: number): string {
  const turn = turns[index];
  const effort = turn?.effort ? ` · effort ${turn.effort}` : '';
  return `Turn ${whole(index + 1)} of ${whole(turns.length)} · ${when(turn?.ts ?? null)}${effort}`;
}

/** The growth and the rebuild of a turn, as short lines. */
export function turnNotes(turn: Pick<ContextTurn, 'growth' | 'rebuild'>): string[] {
  const notes: string[] = [];
  if (turn.growth !== null) notes.push(`grew ${signed(turn.growth)} beyond the last reply`);
  if (turn.rebuild) {
    const cost = turn.rebuild.extra_cost === null ? '' : `, +${money(turn.rebuild.extra_cost)}`;
    notes.push(`cache rebuilt: ${REBUILD_CAUSES[turn.rebuild.cause]} (${compact(turn.rebuild.lost)}${cost})`);
  }
  return notes;
}

/** What a screen reader hears for a turn: its context, its parts and the notes. */
export function turnFacts(turn: ContextTurn): string[] {
  return [
    `context ${compact(turn.context)}`,
    ...CONTEXT_PARTS.map((part) => `${part.label.toLowerCase()} ${compact(turn[part.field])}`),
    ...turnNotes(turn),
  ];
}

/** The slider's words for a turn. */
export function turnValueText(turns: readonly ContextTurn[], index: number): string {
  const turn = turns[index];
  return turn ? `${turnTitle(turns, index)}: ${turnFacts(turn).join(', ')}` : '';
}

// --- a table's columns and rows --------------------------------------------------------------------------------

/** A column of one of the section's tables. */
export interface ContextColumn {
  label: string;
  numeric?: boolean;
}

/** A row of one of the section's simple tables: its cells in the columns' order, under a key of its own. */
export interface ContextRow {
  key: string;
  cells: string[];
}

export const TURN_COLUMNS: ContextColumn[] = [
  { label: 'Turn', numeric: true },
  { label: 'Time' },
  { label: 'Effort' },
  ...CONTEXT_PARTS.map((part) => ({ label: part.label, numeric: true })),
  { label: 'Context', numeric: true },
  { label: 'Growth', numeric: true },
  { label: 'Cache rebuild' },
];

/** The table view of the chart: a row per turn, its key the call's message (another call of the same id after a
 *  compaction's copy gets a counter). */
export function turnRows(turns: readonly ContextTurn[]): ContextRow[] {
  const seen = new Map<string, number>();
  return turns.map((turn, index) => {
    const count = seen.get(turn.message_id) ?? 0;
    seen.set(turn.message_id, count + 1);
    return {
      key: count ? `${turn.message_id}#${count}` : turn.message_id,
      cells: [
        whole(index + 1),
        when(turn.ts),
        turn.effort || '–',
        ...CONTEXT_PARTS.map((part) => whole(turn[part.field])),
        whole(turn.context),
        turn.growth === null ? '–' : signed(turn.growth),
        turn.rebuild ? `${turn.rebuild.cause} · ${compact(turn.rebuild.lost)}` : '–',
      ],
    };
  });
}

// --- under the chart: the tiles, the growth steps, the compactions -----------------------------------------------

/** A tile under the chart. */
export interface ContextTile {
  label: string;
  value: string;
  note: string;
}

/** The overhead, rebuild, compaction and growth tiles of a transcript. */
export function contextTiles(
  agent: Pick<Agent, 'context_per_turn' | 'compactions' | 'overhead' | 'rebuilds'>,
): ContextTile[] {
  const { overhead, rebuilds } = agent;
  const triggers = Object.entries(COMPACTION_TRIGGERS)
    .map(([trigger, name]) => [name, agent.compactions.filter((row) => row.trigger === trigger).length] as const)
    .filter(([, count]) => count)
    .map(([name, count]) => `${whole(count)} ${name}`);
  const growths = agent.context_per_turn
    .map((turn) => turn.growth)
    .filter((growth): growth is number => growth !== null);
  const mean = growths.length ? growths.reduce((sum, growth) => sum + growth, 0) / growths.length : null;
  return [
    {
      label: 'Fixed overhead',
      value: overhead ? compact(overhead.tokens) : '–',
      note: overhead
        ? `the first call's context (system prompt, tools, CLAUDE.md); reading it again cost ${money(overhead.cost)}`
        : 'no turns',
    },
    {
      label: 'Cache rebuilds',
      value: whole(rebuilds.count),
      note: rebuilds.count
        ? `${compact(rebuilds.lost)} tokens written again, ${money(rebuilds.cost)} extra`
        : 'every turn read the previous context from the cache',
    },
    {
      label: 'Compactions',
      value: whole(agent.compactions.length),
      note: triggers.length ? triggers.join(', ') : 'none',
    },
    {
      label: 'Growth per turn',
      value: mean === null ? '–' : signed(Math.round(mean)),
      note: 'mean of what each turn added beyond the last reply: tool results, prompts, attachments',
    },
  ];
}

/** The tools a call ran, by name with their count and result size: "Read ×3 12.4K, Bash 30". */
export function toolSummary(tools: readonly GrowthTool[]): string {
  const byName = new Map<string, { calls: number; chars: number }>();
  for (const tool of tools) {
    const entry = byName.get(tool.tool) ?? { calls: 0, chars: 0 };
    entry.calls += 1;
    entry.chars += tool.result_chars;
    byName.set(tool.tool, entry);
  }
  return [...byName]
    .map(([name, entry]) => `${name}${entry.calls > 1 ? ` ×${entry.calls}` : ''} ${compact(entry.chars)}`)
    .join(', ');
}

export const GROWTH_COLUMNS: ContextColumn[] = [
  { label: 'Turn', numeric: true },
  { label: 'Time' },
  { label: 'Growth', numeric: true },
  { label: 'Tools the call before ran (result characters)' },
];

/** The biggest growth steps: the turn each was, its time and growth, and the tools the call before ran. */
export function growthRows(agent: Pick<Agent, 'context_per_turn' | 'top_growth'>): ContextRow[] {
  const numbers = new Map(agent.context_per_turn.map((turn, index) => [turn.message_id, index + 1]));
  return agent.top_growth.map((step) => ({
    key: step.message_id,
    cells: [
      whole(numbers.get(step.message_id) ?? null),
      when(step.ts),
      compact(step.growth),
      step.tools.length ? toolSummary(step.tools) : 'none: a prompt or attachments',
    ],
  }));
}

/** The total beside the compactions' heading, as a gain or a loss: the sign and the arrow carry it. */
export function compactionTotalWords(
  total: CompactionTotal | null,
): { tone: 'gain' | 'loss'; text: string; title: string } | null {
  if (!total || !total.compactions) return null;
  const gain = total.net >= 0;
  return {
    tone: gain ? 'gain' : 'loss',
    title:
      'Each compaction against keeping its context, over its stretch up to the next one, summed; a stretch not paid ' +
      'off yet as it stands, forced compactions left out' +
      (total.unknown ? `, ${whole(total.unknown)} without an estimate not summed` : '') +
      '.',
    text: gain ? `▲ saved ~${money(total.net)} so far` : `▼ cost ~${money(-total.net)} more so far`,
  };
}

/** The compactions' total for the heading, from the transcript's rows. */
export function compactionsTotal(compactions: readonly Compaction[]): ReturnType<typeof compactionTotalWords> {
  return compactionTotalWords(compactionTotal(compactions));
}

export const COMPACTION_COLUMNS: ContextColumn[] = [
  { label: 'Time' },
  { label: 'Trigger' },
  { label: 'Before', numeric: true },
  { label: 'After', numeric: true },
  { label: 'Took', numeric: true },
  { label: 'Each later call', numeric: true },
  { label: 'Cost once', numeric: true },
  { label: 'Pays off at', numeric: true },
  { label: 'Calls after', numeric: true },
  { label: 'Versus keeping' },
];

/** A cell with a hover title. */
export interface TitledText {
  text: string;
  title: string | null;
}

/** A compaction's row: what it took and what it left, and, where the comparison with keeping the context has one, what
 *  it cost once and saved per later call. */
export interface CompactionRow {
  key: string;
  time: string;
  trigger: string;
  before: string;
  after: TitledText;
  took: string;
  versus: {
    each: string;
    oneTime: TitledText;
    paysOff: TitledText;
    callsAfter: TitledText;
    verdict: { text: string; tone: 'gain' | 'loss' | null; words: string | null; title: string | null };
  } | null;
}

/** The compactions as rows, each under a key of its own (its time and trigger, a counter for copies). */
export function compactionRows(compactions: readonly Compaction[]): CompactionRow[] {
  const seen = new Map<string, number>();
  return compactions.map((row) => {
    const identity = `${row.ts}|${row.trigger}`;
    const count = seen.get(identity) ?? 0;
    seen.set(identity, count + 1);
    const comparison = row.versus_keeping;
    const after = {
      text: compact(row.next_context ?? row.post_tokens),
      title:
        `Claude Code reports ${compact(row.post_tokens)}: without the system prompt, tools and CLAUDE.md the next ` +
        'call sends again',
    };
    return {
      key: count ? `${identity}#${count}` : identity,
      time: when(row.ts),
      trigger: COMPACTION_TRIGGERS[row.trigger ?? ''] || row.trigger || '–',
      before: compact(row.pre_tokens),
      after,
      took: duration(row.duration_ms),
      versus: comparison
        ? {
            each:
              comparison.difference > 0
                ? `−${compact(comparison.difference)} · ${money(comparison.saving_per_call)}`
                : `+${compact(Math.abs(comparison.difference))} · nothing saved`,
            oneTime: { text: oneTimeText(comparison), title: oneTimeTitle(comparison) },
            paysOff: {
              text: breakevenCall(comparison) ?? '–',
              title: (comparison.breakeven_call ?? 0) > comparison.calls_after ? 'projected past the last call' : null,
            },
            callsAfter: {
              text: whole(comparison.calls_after),
              title: comparison.last_stretch ? 'up to the last call' : 'up to the next compaction',
            },
            verdict: {
              text: verdictText(comparison),
              tone: verdictTone(comparison),
              words: verdictWords(comparison),
              title: verdictTitle(comparison),
            },
          }
        : null,
    };
  });
}
