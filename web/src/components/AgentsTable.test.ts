import { render, screen, within } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { flushSync } from 'svelte';
import { afterEach, beforeEach, describe, expect, test } from 'vitest';
import { agent } from '../lib/fixtures';
import { tablePages } from '../lib/paging.svelte';
import { preferences } from '../lib/prefs.svelte';
import AgentsTable from './AgentsTable.svelte';

const helper = agent({
  agent_id: 'a-1',
  agent_type: 'Explore',
  description: 'Find the callers',
  models: ['claude-sonnet-5-5', 'claude-haiku-4-5'],
  model_efforts: [{ model: 'claude-sonnet-5-5', effort: 'high' }],
  turns: 4,
  cost: 0.25,
  returned_chars: 1_500,
  context_first: 5_000,
  context_last: 20_000,
});

/** An agent of the workflow run wf_1. */
function inRun(id: string, changes = {}) {
  return agent({
    agent_id: id,
    agent_type: 'workflow-subagent',
    description: `Agent ${id}`,
    workflow_run: 'wf_1',
    workflow_name: 'review',
    workflow_phase: 'verify',
    turns: 3,
    models: ['claude-sonnet-5-5'],
    ...changes,
  });
}

const DEFAULTS = { pagerKey: 's1-agents' };

function names(): (string | null)[] {
  return screen
    .getAllByRole('row')
    .slice(1)
    .map((row) => row.querySelector('strong')?.textContent ?? null);
}

const fold = () => screen.getByRole('button', { name: '2 agents' });

beforeEach(() => {
  localStorage.clear();
  preferences.pageSize = 25;
});

afterEach(() => {
  tablePages.forget('s1-agents');
  preferences.pageSize = 25;
  localStorage.clear();
});

describe('the table', () => {
  test('is named by its level 3 heading', () => {
    render(AgentsTable, { ...DEFAULTS, agents: [agent()] });
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(/^Main thread and subagents$/);
    expect(screen.getByRole('table', { name: 'Main thread and subagents' })).toBeInTheDocument();
  });

  test('is headed by the agent, model, turns, context, input, cache, output, returned and cost', () => {
    render(AgentsTable, { ...DEFAULTS, agents: [agent()] });
    const heads = screen.getAllByRole('columnheader');
    expect(heads.map((head) => head.textContent)).toEqual([
      'Agent',
      'Model',
      'Turns',
      'Context first → last',
      'Input total',
      'Cache read %',
      'Output',
      'Returned',
      'Cost',
    ]);
    expect(heads[7]).toHaveAttribute('title', "what a subagent handed back: its result's characters");
    expect(heads[0]).not.toHaveAttribute('title');
  });

  test('has a column of web searches where an agent made some', () => {
    render(AgentsTable, { ...DEFAULTS, agents: [agent(), agent({ agent_id: 'a-2', web_searches: 3 })] });
    const heads = screen.getAllByRole('columnheader').map((head) => head.textContent);
    expect(heads.slice(6, 9)).toEqual(['Output', 'Web searches', 'Returned']);
  });

  test('has a row per agent, the main thread first, with its description under its type', () => {
    render(AgentsTable, { ...DEFAULTS, agents: [agent(), helper] });
    expect(names()).toEqual(['main', 'Explore']);
    const first = screen.getAllByRole('row')[2] as HTMLElement;
    expect(first.querySelector('td > strong + span.sub')).toHaveTextContent(/^Find the callers$/);
  });

  test('has a line per model in its own div, then the numbers', () => {
    render(AgentsTable, { ...DEFAULTS, agents: [helper] });
    const cells = within(screen.getAllByRole('row')[1] as HTMLElement).getAllByRole('cell');
    const lines = [...(cells[1]?.querySelectorAll('div') ?? [])].map((line) => line.textContent);
    expect(lines).toEqual(['claude-sonnet-5-5 · high', 'claude-haiku-4-5']);
    expect(cells.slice(2).map((cell) => cell.textContent)).toEqual([
      '4',
      '5K → 20K',
      '1.2K',
      '75%',
      '50',
      '1.5K',
      '$0.25',
    ]);
    expect(cells.map((cell) => cell.classList.contains('num'))).toEqual([
      false,
      false,
      true,
      true,
      true,
      true,
      true,
      true,
      true,
    ]);
  });
});

describe('a workflow run', () => {
  const agents = () => [agent(), inRun('w-1'), helper, inRun('w-2')];

  test('is one group row of its totals with a closed button, its agents not in the table', () => {
    render(AgentsTable, { ...DEFAULTS, agents: agents() });
    expect(names()).toEqual(['main', 'workflow · review', 'Explore']);
    expect(fold()).toHaveAttribute('aria-expanded', 'false');
    expect(fold().parentElement).toHaveClass('sub');
    expect(fold()).toHaveClass('link-button');
    expect(fold().closest('tr')).toHaveClass('group-row');
  });

  test('has its agents under it, as sub-rows of the workflow-member class, once the button opens it', async () => {
    const user = userEvent.setup();
    render(AgentsTable, { ...DEFAULTS, agents: agents() });
    await user.click(fold());
    expect(fold()).toHaveAttribute('aria-expanded', 'true');
    expect(names()).toEqual(['main', 'workflow · review', 'workflow-subagent', 'workflow-subagent', 'Explore']);
    const rows = screen.getAllByRole('row').slice(1);
    const member = 'sub-row workflow-member';
    expect(rows.map((row) => row.className)).toEqual(['', 'group-row', member, member, '']);
    expect(rows[2]?.querySelector('.sub')).toHaveTextContent('Agent w-1 · verify');
  });

  test('closes its agents again with a second click, the button keeping its node', async () => {
    const user = userEvent.setup();
    render(AgentsTable, { ...DEFAULTS, agents: agents() });
    const button = fold();
    await user.click(button);
    await user.click(button);
    expect(fold()).toBe(button);
    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(names()).toHaveLength(3);
  });

  test('stays open while the agents change, the rows it had keeping their nodes', async () => {
    const user = userEvent.setup();
    const { rerender } = render(AgentsTable, { ...DEFAULTS, agents: agents() });
    await user.click(fold());
    const before = screen.getAllByRole('row').slice(1);
    void rerender({ agents: [agent(), inRun('w-1', { turns: 9 }), helper, inRun('w-2')] });
    flushSync();
    expect(fold()).toHaveAttribute('aria-expanded', 'true');
    const after = screen.getAllByRole('row').slice(1);
    expect(after).toHaveLength(5);
    expect(after[2]).toBe(before[2]);
    expect(within(after[2] as HTMLElement).getAllByRole('cell')[2]).toHaveTextContent('9');
  });

  test('has a sub-row stay with its run across a page boundary', async () => {
    const user = userEvent.setup();
    preferences.pageSize = 10;
    const others = Array.from({ length: 9 }, (_unused, index) =>
      agent({ agent_id: `o-${index}`, agent_type: `o${index}` }),
    );
    // the run is the tenth unit, the last one of the first page, so its agents come with it
    render(AgentsTable, { ...DEFAULTS, agents: [...others, inRun('w-1'), inRun('w-2'), helper] });
    await user.click(fold());
    expect(screen.getAllByRole('row')).toHaveLength(1 + 9 + 1 + 2);
    await user.click(screen.getByRole('button', { name: 'Next ›' }));
    expect(names()).toEqual(['Explore']);
  });
});
