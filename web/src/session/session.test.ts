import { describe, expect, test } from 'vitest';
import { agent, sessionDetail, toolKindRow } from '../api/fixtures.ts';
import {
  agentColumns,
  agentModels,
  agentRows,
  hasSearches,
  sessionFacts,
  toolsColumns,
  toolsNote,
  toolsRows,
} from './session.ts';

describe('sessionFacts', () => {
  test('are the project, the branch, the span and the id, dot-separated', () => {
    const facts = sessionFacts(sessionDetail({ git_branch: 'main' }));
    expect(facts.split(' · ')).toHaveLength(4);
    expect(facts.startsWith('/work/demo · main · ')).toBe(true);
    expect(facts.endsWith(' · abc123')).toBe(true);
    expect(facts).toContain(' – ');
  });

  test('leave the branch out where there is none', () => {
    expect(sessionFacts(sessionDetail({ git_branch: null })).split(' · ')).toHaveLength(3);
  });

  test('have a dash for a moment that is not known', () => {
    expect(sessionFacts(sessionDetail({ first_ts: null, last_ts: null }))).toContain('– – –');
  });
});

describe('agentColumns', () => {
  test('have the web searches only where asked', () => {
    expect(agentColumns(false).map((column) => column.label)).toEqual([
      'Agent', 'Model', 'Turns', 'Context first → last', 'Input total', 'Cache read %', 'Output', 'Returned', 'Cost',
    ]);
    expect(agentColumns(true).map((column) => column.label)).toContain('Web searches');
    expect(agentColumns(true)).toHaveLength(10);
  });

  test('right-align the numbers, not the name and the model, and say what the returned characters are', () => {
    const columns = agentColumns(false);
    expect(columns.filter((column) => !column.numeric).map((column) => column.label)).toEqual(['Agent', 'Model']);
    expect(columns.find((column) => column.label === 'Returned')?.title).toMatch(/handed back/);
  });
});

describe('hasSearches', () => {
  test('is true where an agent searched', () => {
    expect(hasSearches([agent(), agent({ web_searches: 2 })])).toBe(true);
    expect(hasSearches([agent()])).toBe(false);
    expect(hasSearches([])).toBe(false);
  });
});

describe('agentModels', () => {
  test('are one line per model with its effort levels', () => {
    const entries = [
      { model: 'claude-opus-5-5', effort: 'high' },
      { model: 'claude-opus-5-5', effort: 'max' },
    ];
    const lines = agentModels(agent({ models: ['claude-opus-5-5', 'claude-haiku-4-5'], model_efforts: entries }));
    expect(lines).toEqual(['claude-opus-5-5 · high, max', 'claude-haiku-4-5']);
  });

  test('are a dash for background calls, which have no model', () => {
    expect(agentModels(agent({ models: [] }))).toEqual(['–']);
  });
});

describe('agentRows', () => {
  const main = agent();
  const helper = agent({
    agent_id: 'a-1',
    agent_type: 'Explore',
    description: 'Find the callers',
    turns: 4,
    cost: 0.25,
    returned_chars: 1_500,
    context_first: 5_000,
    context_last: 20_000,
  });
  const inRun = (id: string, changes = {}) =>
    agent({
      agent_id: id,
      agent_type: 'workflow-subagent',
      description: `Agent ${id}`,
      workflow_run: 'wf_1',
      workflow_name: 'review',
      workflow_phase: 'verify',
      turns: 3,
      input_total: 1_000,
      cache_read: 500,
      output: 100,
      cost: 0.5,
      models: ['claude-sonnet-5-5'],
      ...changes,
    });

  test('are one row per agent, the main thread first as the server sends it', () => {
    const rows = agentRows([main, helper], []);
    expect(rows.map((row) => [row.key, row.kind, row.name])).toEqual([
      ['main', 'agent', 'main'],
      ['a-1', 'agent', 'Explore'],
    ]);
    expect(rows[1]!.detail).toBe('Find the callers');
  });

  test('key the background calls apart from the main thread, since neither has an agent id', () => {
    const background = agent({ agent_type: '(background)', models: [], turns: 0 });
    const rows = agentRows([main, helper, background], []);
    expect(rows.map((row) => row.key)).toEqual(['main', 'a-1', '(background)']);
  });

  test('have the turns, context, input, cache read share, output, returned and cost as cells', () => {
    const cells = agentRows([helper], [])[0]!.cells;
    expect(cells).toEqual(['4', '5K → 20K', '1.2K', '75%', '50', '1.5K', '$0.25']);
  });

  test('add the web searches between the output and what was returned where an agent searched', () => {
    const rows = agentRows([main, agent({ agent_id: 'a-2', web_searches: 3 })], []);
    expect(rows[1]!.cells).toHaveLength(8);
    expect(rows[1]!.cells[5]).toBe('3');
    expect(rows[0]!.cells[5]).toBe('0');
  });

  test('gather a run under one row, at the place of its first agent, with its agents hidden until it is open', () => {
    const agents = [main, inRun('w-1'), helper, inRun('w-2')];
    expect(agentRows(agents, []).map((row) => [row.key, row.kind])).toEqual([
      ['main', 'agent'],
      ['run:wf_1', 'run'],
      ['a-1', 'agent'],
    ]);
    expect(agentRows(agents, ['wf_1']).map((row) => [row.key, row.kind])).toEqual([
      ['main', 'agent'],
      ['run:wf_1', 'run'],
      ['w-1', 'member'],
      ['w-2', 'member'],
      ['a-1', 'agent'],
    ]);
  });

  test('ignore a fold of a run that is not there', () => {
    expect(agentRows([main], ['wf_9'])).toHaveLength(1);
  });

  test('give a run its agents’ totals, a dash for what does not add up, and the button’s words', () => {
    const run = agentRows([inRun('w-1'), inRun('w-2')], [])[0]!;
    expect(run.name).toBe('workflow · review');
    expect(run.detail).toBe('');
    expect(run.models).toEqual(['claude-sonnet-5-5']);
    expect(run.fold).toEqual({ run: 'wf_1', label: '2 agents' });
    expect(run.cells).toEqual(['6', '–', '2K', '50%', '200', '–', '$1.00']);
  });

  test('name a run by its id where it has no name, and leave a cost out of the total where none is priced', () => {
    const run = agentRows([inRun('w-1', { workflow_name: null, cost: null })], [])[0]!;
    expect(run.name).toBe('workflow · wf_1');
    expect(run.cells.at(-1)).toBe('–');
  });

  test('sum only the priced agents’ cost', () => {
    const run = agentRows([inRun('w-1'), inRun('w-2', { cost: null })], [])[0]!;
    expect(run.cells.at(-1)).toBe('$0.50');
  });

  test('name a run’s agent by its type and its description with the phase', () => {
    const member = agentRows([inRun('w-1')], ['wf_1'])[1]!;
    expect(member.name).toBe('workflow-subagent');
    expect(member.detail).toBe('Agent w-1 · verify');
    expect(member.fold).toBeNull();
  });

  test('list each model of a run once', () => {
    const run = agentRows([inRun('w-1'), inRun('w-2', { models: ['claude-sonnet-5-5', 'claude-haiku-4-5'] })], [])[0]!;
    expect(run.models).toEqual(['claude-sonnet-5-5', 'claude-haiku-4-5']);
  });
});

// the main thread's calls: Bash, split by kind, its search kind by program, the program by option set, and Read
const BASH_CALLS = [
  toolKindRow({ tool: 'Bash', calls: 9 }),
  toolKindRow({ tool: 'Bash', kind: 'search', calls: 4 }),
  toolKindRow({ tool: 'Bash', kind: 'search', detail: 'grep', calls: 3 }),
  toolKindRow({ tool: 'Bash', kind: 'search', detail: 'grep', options: '-rn', calls: 3 }),
  toolKindRow({ tool: 'Bash', kind: 'view', calls: 2 }),
  toolKindRow({ tool: 'Read', calls: 1 }),
];
const SEARCH_FOLD = JSON.stringify(['', 'Bash', 'search', null, null]);
const GREP_FOLD = JSON.stringify(['', 'Bash', 'search', 'grep', null]);
const mainThread = (tool_kinds = BASH_CALLS) => agent({ agent_id: null, tool_kinds });
const keys = (open: string[]) => toolsRows([mainThread()], open).map((row) => row.key);

describe('toolsColumns', () => {
  test('name the agent and the tool, then the counts right-aligned', () => {
    const columns = toolsColumns();
    expect(columns.map((column) => column.label)).toEqual([
      'Agent', 'Tool', 'Calls', 'Errors', 'Result characters', 'Median', 'p90', 'Input median', 'Calls after',
      '~Carried', '~Input cost',
    ]);
    expect(columns.filter((column) => !column.numeric).map((column) => column.label)).toEqual(['Agent', 'Tool']);
  });

  test('say what the estimates count', () => {
    const titles = Object.fromEntries(toolsColumns().map((column) => [column.label, column.title]));
    expect(titles['Errors']).toMatch(/result was an error/);
    expect(titles['Calls after']).toMatch(/up to the next compaction/);
    expect(titles['~Carried']).toMatch(/later calls paid/);
    expect(titles['~Input cost']).toMatch(/output price/);
    expect(titles['Calls']).toBeUndefined();
  });
});

describe('toolsNote', () => {
  test('explains the estimates while a transcript gives them', () => {
    expect(toolsNote([mainThread()])).toMatch(/^Bash splits by what a command does.*2\.3 characters/);
  });

  test('is left out once every transcript is gone or held no calls', () => {
    expect(toolsNote([agent({ tool_kinds: null }), mainThread([])])).toBeNull();
    expect(toolsNote([])).toBeNull();
  });

  test('is there where any one agent has its transcript', () => {
    expect(toolsNote([agent({ tool_kinds: null }), mainThread()])).not.toBeNull();
  });
});

describe('toolsRows', () => {
  test('show the tools and the kinds, and keep what splits further folded', () => {
    expect(keys([])).toEqual([
      JSON.stringify(['', 'Bash', null, null, null]),
      JSON.stringify(['', 'Bash', 'search', null, null]),
      JSON.stringify(['', 'Bash', 'view', null, null]),
      JSON.stringify(['', 'Read', null, null, null]),
    ]);
  });

  test('open a fold to show the rows directly under it, the options under a detail only with both open', () => {
    expect(keys([SEARCH_FOLD])).toHaveLength(5);
    expect(keys([GREP_FOLD])).toHaveLength(4);
    expect(keys([SEARCH_FOLD, GREP_FOLD])).toHaveLength(6);
  });

  test('keep a row under its key however many rows show, so an open fold stays the same row', () => {
    const closed = toolsRows([mainThread()], []).find((row) => row.key === SEARCH_FOLD);
    const opened = toolsRows([mainThread()], [SEARCH_FOLD]).find((row) => row.key === SEARCH_FOLD);
    expect(closed?.fold).toEqual({ fold: SEARCH_FOLD, label: '1 program', open: false });
    expect(opened?.fold).toEqual({ fold: SEARCH_FOLD, label: '1 program', open: true });
  });

  test('carry a fold only on the rows that split, in words of what they split into', () => {
    const rows = toolsRows([mainThread()], [SEARCH_FOLD, GREP_FOLD]);
    expect(rows.map((row) => row.fold?.label ?? null)).toEqual([null, '1 program', '1 option set', null, null, null]);
  });

  test('say the agent on a top row and nothing on a sub-row', () => {
    const rows = toolsRows([mainThread()], []);
    expect(rows.map((row) => row.agent)).toEqual(['main', '', '', 'main']);
    expect(rows.map((row) => row.sub)).toEqual([false, true, true, false]);
  });

  test('group a row that the next one splits from', () => {
    const rows = toolsRows([mainThread()], []);
    expect(rows.map((row) => row.group)).toEqual([true, false, false, false]);
  });

  test('name each row by what it is and format its cells', () => {
    const [bash, search] = toolsRows([mainThread()], []);
    expect(bash?.name).toEqual({ className: null, text: 'Bash' });
    expect(search?.name).toEqual({ className: 'tool-kind', text: 'search' });
    expect(bash?.cells).toEqual(['9', '1', '90', '30', '50', '12', '4.5', '$0.01', '$0.00']);
  });

  test('a stored row, once the transcript is gone, has the calls and characters only', () => {
    const gone = agent({ tool_kinds: null, tools: [{ tool: 'Bash', calls: 3, result_chars: 450 }] });
    expect(toolsRows([gone], [])).toEqual([
      {
        key: JSON.stringify(['', 'Bash', 'stored']),
        agent: 'main',
        name: { className: null, text: 'Bash' },
        fold: null,
        sub: false,
        group: false,
        cells: ['3', '–', '450', '–', '–', '–', '–', '–', '–'],
      },
    ]);
  });

  test('keep each agent’s rows apart by the agent’s id', () => {
    const explorer = agent({ agent_id: 'a1', agent_type: 'Explore', tool_kinds: BASH_CALLS });
    const rows = toolsRows([mainThread(), explorer], []);
    expect(new Set(rows.map((row) => row.key)).size).toBe(8);
    expect(rows.filter((row) => row.agent === 'Explore')).toHaveLength(2);
  });

  test('are none without calls', () => {
    expect(toolsRows([], [])).toEqual([]);
    expect(toolsRows([mainThread([])], [])).toEqual([]);
  });
});
