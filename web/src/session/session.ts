// The session view's frame: the facts under its heading, the main thread and subagents table, whose workflow runs fold
// their agents away, and the Tools table with its folds. Plain functions, so the components only draw them.

import type { Agent, SessionDetail } from '../api/api.ts';
import { compact, money, percent, when, whole } from '../ui/format.ts';
import { toolFolds, toolRowClass, toolRowName, toolRowShown, toolTableRows } from '../ui/tables.ts';

/** The facts under the heading: project, branch, first to last record and the session's id. */
export function sessionFacts(
  detail: Pick<SessionDetail, 'project' | 'git_branch' | 'first_ts' | 'last_ts' | 'session_id'>,
): string {
  const branch = detail.git_branch ? ` · ${detail.git_branch}` : '';
  return `${detail.project}${branch} · ${when(detail.first_ts)} – ${when(detail.last_ts)} · ${detail.session_id}`;
}

/** Whether any agent made web searches, which gives the table a column for them. */
export function hasSearches(agents: readonly Pick<Agent, 'web_searches'>[]): boolean {
  return agents.some((agent) => agent.web_searches);
}

/** The agents table's columns; the web searches' only where `searches`. Some say what they count. */
export function agentColumns(searches: boolean): { label: string; numeric?: boolean; title?: string }[] {
  return [
    { label: 'Agent' },
    { label: 'Model' },
    { label: 'Turns', numeric: true },
    { label: 'Context first → last', numeric: true },
    { label: 'Input total', numeric: true },
    { label: 'Cache read %', numeric: true },
    { label: 'Output', numeric: true },
    ...(searches ? [{ label: 'Web searches', numeric: true }] : []),
    { label: 'Returned', numeric: true, title: "what a subagent handed back: its result's characters" },
    { label: 'Cost', numeric: true },
  ];
}

/** A row of the agents table. A workflow run's agents sit under its row, which carries the fold that shows them. */
export interface AgentRow {
  /** Unique among the rows, so a row keeps its node while others come and go. */
  key: string;
  /** An agent (the main thread too), a workflow run (its agents' totals) or one of a run's agents. */
  kind: 'agent' | 'run' | 'member';
  /** The agent type, or "workflow · name" for a run. */
  name: string;
  /** What the agent was asked to do and, in a run, its phase; nothing for a run. */
  detail: string;
  /** One line per model, with its effort levels; a dash where there is none. */
  models: string[];
  /** On a run's row: the run's id, and the button's words. */
  fold: { run: string; label: string } | null;
  /** The cells after the model, in `agentColumns`: turns to cost, the web searches' only where `searches`. */
  cells: string[];
}

/** An agent's models, one line each with its effort levels ("claude-opus-5-5 · high, max"); background calls have
 *  none. */
export function agentModels(agent: Pick<Agent, 'models' | 'model_efforts'>): string[] {
  if (!agent.models.length) return ['–'];
  return agent.models.map((model) => {
    const efforts = agent.model_efforts.filter((entry) => entry.model === model).map((entry) => entry.effort);
    return efforts.length ? `${model} · ${efforts.join(', ')}` : model;
  });
}

function agentCells(agent: Agent, searches: boolean): string[] {
  return [
    whole(agent.turns),
    `${compact(agent.context_first)} → ${compact(agent.context_last)}`,
    compact(agent.input_total),
    percent(agent.cache_read, agent.input_total),
    compact(agent.output),
    ...(searches ? [whole(agent.web_searches)] : []),
    compact(agent.returned_chars),
    money(agent.cost),
  ];
}

function agentRow(agent: Agent, searches: boolean, kind: 'agent' | 'member'): AgentRow {
  const phase = agent.workflow_phase ? ` · ${agent.workflow_phase}` : '';
  return {
    key: agent.agent_id ?? agent.agent_type, // no id: the main thread ("main") or the background calls
    kind,
    name: agent.agent_type,
    detail: `${agent.description || ''}${phase}`,
    models: agentModels(agent),
    fold: null,
    cells: agentCells(agent, searches),
  };
}

/** A workflow run's row: its agents' totals, where only some of the cells add up (the context and what was handed
 *  back don't). */
function runRow(run: string, agents: Agent[], searches: boolean): AgentRow {
  const sum = (field: 'turns' | 'input_total' | 'cache_read' | 'output' | 'web_searches') =>
    agents.reduce((total, agent) => total + (agent[field] || 0), 0);
  const costs = agents.map((agent) => agent.cost).filter((cost): cost is number => cost !== null);
  const first = agents[0]!;
  return {
    key: `run:${run}`,
    kind: 'run',
    name: `workflow · ${first.workflow_name || run}`,
    detail: '',
    models: [...new Set(agents.flatMap((agent) => agent.models))],
    fold: { run, label: `${whole(agents.length)} agents` },
    cells: [
      whole(sum('turns')),
      '–',
      compact(sum('input_total')),
      percent(sum('cache_read'), sum('input_total')),
      compact(sum('output')),
      ...(searches ? [whole(sum('web_searches'))] : []),
      '–',
      costs.length ? money(costs.reduce((total, cost) => total + cost, 0)) : '–',
    ],
  };
}

/**
 * The agents table's rows in the order the server gives the agents, a workflow run's agents gathered under one row in
 * the place of the run's first agent. The agents of a run show only where the run is in `open`.
 */
export function agentRows(agents: readonly Agent[], open: readonly string[]): AgentRow[] {
  const searches = hasSearches(agents);
  const runs = new Map<string, Agent[]>();
  const order: (Agent | string)[] = [];
  for (const agent of agents) {
    if (agent.workflow_run === null) {
      order.push(agent);
    } else if (runs.has(agent.workflow_run)) {
      runs.get(agent.workflow_run)!.push(agent);
    } else {
      runs.set(agent.workflow_run, [agent]);
      order.push(agent.workflow_run);
    }
  }
  return order.flatMap((entry) => {
    if (typeof entry !== 'string') return [agentRow(entry, searches, 'agent')];
    const members = runs.get(entry)!;
    return [
      runRow(entry, members, searches),
      ...(open.includes(entry) ? members.map((member) => agentRow(member, searches, 'member')) : []),
    ];
  });
}

// --- the Tools table -------------------------------------------------------------------------------------------

/** The Tools table's columns: the agent and the tool, then the counts. Some say what they count. */
export function toolsColumns(): { label: string; numeric?: boolean; title?: string }[] {
  return [
    { label: 'Agent' },
    { label: 'Tool' },
    { label: 'Calls', numeric: true },
    { label: 'Errors', numeric: true, title: 'calls whose result was an error' },
    { label: 'Result characters', numeric: true },
    { label: 'Median', numeric: true, title: "a result's characters, the median call" },
    { label: 'p90', numeric: true, title: '…and at the 90th percentile' },
    { label: 'Input median', numeric: true, title: "the characters of a call's input, which the model wrote" },
    {
      label: 'Calls after',
      numeric: true,
      title: 'how many later calls carried it in their context, the median call, up to the next compaction',
    },
    {
      label: '~Carried',
      numeric: true,
      title: 'what the later calls paid to have its input and result in their context',
    },
    { label: '~Input cost', numeric: true, title: 'its input at the output price' },
  ];
}

/** How the costs are estimated, while a transcript tells them; nothing once every transcript is gone. */
export function toolsNote(agents: readonly Pick<Agent, 'tool_kinds'>[]): string | null {
  if (!agents.some((agent) => agent.tool_kinds?.length)) return null;
  return (
    'Bash splits by what a command does, MCP by server. A call’s input and result stay in the context, so every ' +
    'later call up to the next compaction reads them again: ~Carried estimates what that cost, taking a token as ' +
    '2.3 characters (measured on real transcripts, a heuristic).'
  );
}

/** A row of the Tools table. */
export interface ToolsRow {
  /** Unique in the table and the same whatever else shows, so an open fold stays the same row. */
  key: string;
  /** The agent's type; nothing on a row under another. */
  agent: string;
  /** The name's words and the class that indents it by what it is. */
  name: { className: string | null; text: string };
  /** The button that opens what the row splits into, where it does. */
  fold: { fold: string; label: string; open: boolean } | null;
  sub: boolean;
  /** Whether the next row splits from this one. */
  group: boolean;
  /** The cells after the name, in `toolsColumns`. */
  cells: string[];
}

/**
 * The Tools table's rows: each agent's tools, Bash and the rest split by kind, detail and options. A row shows while
 * every fold above it is in `open`; the tools and the kinds always show.
 */
export function toolsRows(agents: readonly Agent[], open: readonly string[]): ToolsRow[] {
  const rows = toolTableRows([...agents]);
  const { above, folds } = toolFolds(rows);
  const opened = new Set(open);
  const foldOf = new Map(folds.map((fold) => [fold.row, fold]));
  return rows.flatMap((row, index): ToolsRow[] => {
    if (!toolRowShown(above[index] ?? [], opened)) return [];
    const fold = foldOf.get(index);
    return [
      {
        key: row.key,
        agent: row.sub ? '' : row.agent,
        name: toolRowName(row),
        fold: fold ? { fold: fold.fold, label: fold.label, open: opened.has(fold.fold) } : null,
        sub: row.sub,
        group: toolRowClass(row, rows[index + 1]) === 'group-row',
        cells: [
          whole(row.calls),
          whole(row.errors),
          compact(row.result_chars),
          compact(row.result_median),
          compact(row.result_p90),
          compact(row.input_median),
          whole(row.calls_after_median),
          money(row.carried),
          money(row.input_cost),
        ],
      },
    ];
  });
}
