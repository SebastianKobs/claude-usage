import { describe, expect, test } from 'vitest';
import { agent, sessionDetail } from './fixtures.ts';
import { agentColumns, agentModels, agentRows, hasSearches, sessionFacts } from './session.ts';

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
