import { render, screen, within } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { flushSync } from 'svelte';
import { afterEach, beforeEach, describe, expect, test } from 'vitest';
import { pagePerTest } from '../lib/app.testing';
import { agent, toolKindRow } from '../lib/fixtures';
import ToolsTable from './ToolsTable.svelte';

const page = pagePerTest();

// Bash, split by kind, its search kind by program, the program by option set, and Read
function calls(bashCalls = 9) {
  return [
    toolKindRow({ tool: 'Bash', calls: bashCalls }),
    toolKindRow({ tool: 'Bash', kind: 'search', calls: 4 }),
    toolKindRow({ tool: 'Bash', kind: 'search', detail: 'grep', calls: 3 }),
    toolKindRow({ tool: 'Bash', kind: 'search', detail: 'grep', options: '-rn', calls: 3 }),
    toolKindRow({ tool: 'Bash', kind: 'view', calls: 2 }),
    toolKindRow({ tool: 'Read', calls: 1 }),
  ];
}

const mainThread = (bashCalls = 9) => agent({ tool_kinds: calls(bashCalls) });

const DEFAULTS = { pagerKey: 's1-tools' };

/** The rows' name cells, whitespace as it is. */
function names(): string[] {
  return screen
    .getAllByRole('row')
    .slice(1)
    .map((row) => within(row).getAllByRole('cell')[1]?.textContent ?? '');
}

const searchFold = () => screen.getByRole('button', { name: '1 program' });
const grepFold = () => screen.getByRole('button', { name: '1 option set' });

beforeEach(() => {
  localStorage.clear();
  page.app.preferences.pageSize = 25;
});

afterEach(() => {
  localStorage.clear();
});

describe('the table', () => {
  test('is named by its level 3 heading', () => {
    page.render(ToolsTable, { ...DEFAULTS, agents: [mainThread()] });
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(/^Tools$/);
    expect(screen.getByRole('heading', { level: 3 })).toHaveAttribute('id', 'session-tools-title');
    expect(screen.getByRole('table', { name: 'Tools' })).toHaveAttribute('aria-labelledby', 'session-tools-title');
  });

  test('is headed by the agent, tool, calls, errors, result sizes, calls after and the estimated costs', () => {
    page.render(ToolsTable, { ...DEFAULTS, agents: [mainThread()] });
    const heads = screen.getAllByRole('columnheader');
    expect(heads.map((head) => head.textContent)).toEqual([
      'Agent',
      'Tool',
      'Calls',
      'Errors',
      'Result characters',
      'Median',
      'p90',
      'Input median',
      'Calls after',
      '~Carried',
      '~Input cost',
    ]);
    expect(heads[3]).toHaveAttribute('title', 'calls whose result was an error');
    expect(heads[0]).not.toHaveAttribute('title');
  });

  test('has the agent, the tool and then the numbers, right-aligned, in a row', () => {
    page.render(ToolsTable, { ...DEFAULTS, agents: [mainThread()] });
    const cells = within(screen.getAllByRole('row')[1] as HTMLElement).getAllByRole('cell');
    expect(cells.map((cell) => cell.textContent)).toEqual([
      'main',
      'Bash',
      '9',
      '1',
      '90',
      '30',
      '50',
      '12',
      '4.5',
      '$0.01',
      '$0.00',
    ]);
    expect(cells.map((cell) => cell.classList.contains('num'))).toEqual([
      false,
      false,
      ...Array.from({ length: 9 }, () => true),
    ]);
  });
});

describe('the note', () => {
  test('explains the estimates, between the heading and the table, while a transcript gives them', () => {
    page.render(ToolsTable, { ...DEFAULTS, agents: [mainThread()] });
    const note = document.querySelector('.note');
    expect(note).toHaveTextContent(/^Bash splits by what a command does.*2\.3 characters/);
    expect(note?.previousElementSibling).toBe(screen.getByRole('heading', { level: 3 }));
    expect(note?.nextElementSibling).toHaveClass('table-wrap');
  });

  test('is left out once every transcript is gone', () => {
    const gone = agent({ tool_kinds: null, tools: [{ tool: 'Bash', calls: 3, result_chars: 450 }] });
    page.render(ToolsTable, { ...DEFAULTS, agents: [gone] });
    expect(document.querySelector('.note')).toBeNull();
  });
});

describe('without calls', () => {
  test('says so instead of showing a table', () => {
    page.render(ToolsTable, { ...DEFAULTS, agents: [agent({ tool_kinds: [] })] });
    expect(screen.getByText('No tool calls.')).toBeInTheDocument();
    expect(screen.queryByRole('table')).toBeNull();
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Tools');
  });
});

describe('a stored row', () => {
  test('has the calls and result characters, and dashes for what needs the transcript', () => {
    const gone = agent({ tool_kinds: null, tools: [{ tool: 'Bash', calls: 3, result_chars: 450 }] });
    page.render(ToolsTable, { ...DEFAULTS, agents: [gone] });
    const cells = within(screen.getAllByRole('row')[1] as HTMLElement).getAllByRole('cell');
    expect(cells.map((cell) => cell.textContent)).toEqual([
      'main',
      'Bash',
      '3',
      '–',
      '450',
      '–',
      '–',
      '–',
      '–',
      '–',
      '–',
    ]);
  });
});

describe('the rows', () => {
  test('are the tools and the kinds, what splits further folded, each fold a closed button', () => {
    page.render(ToolsTable, { ...DEFAULTS, agents: [mainThread()] });
    expect(names()).toEqual(['Bash', 'search (1 program)', 'view', 'Read']);
    expect(searchFold()).toHaveAttribute('aria-expanded', 'false');
    expect(searchFold()).toHaveClass('link-button');
    expect(screen.queryByRole('button', { name: '1 option set' })).toBeNull();
  });

  test('name a kind by its class, with one space before the bracket and none inside it', () => {
    page.render(ToolsTable, { ...DEFAULTS, agents: [mainThread()] });
    const name = searchFold().parentElement as HTMLElement;
    expect(name).toHaveClass('tool-kind');
    expect(name.textContent).toBe('search (1 program)');
    expect(name.parentElement?.tagName).toBe('TD');
  });

  test('have a sub-row for a kind and a group-row for the tool it splits from', () => {
    page.render(ToolsTable, { ...DEFAULTS, agents: [mainThread()] });
    const rows = screen.getAllByRole('row').slice(1);
    expect(rows.map((row) => row.className)).toEqual(['group-row', 'sub-row', 'sub-row', '']);
  });

  test('leave the agent cell empty on a sub-row', () => {
    page.render(ToolsTable, { ...DEFAULTS, agents: [mainThread()] });
    const rows = screen.getAllByRole('row').slice(1);
    const agentCells = rows.map((row) => within(row).getAllByRole('cell')[0]?.textContent);
    expect(agentCells).toEqual(['main', '', '', 'main']);
  });
});

describe('a fold', () => {
  test('shows the rows under it once its button opens it, and hides them with a second click', async () => {
    const user = userEvent.setup();
    page.render(ToolsTable, { ...DEFAULTS, agents: [mainThread()] });
    await user.click(searchFold());
    expect(searchFold()).toHaveAttribute('aria-expanded', 'true');
    expect(names()).toEqual(['Bash', 'search (1 program)', 'grep (1 option set)', 'view', 'Read']);
    await user.click(searchFold());
    expect(searchFold()).toHaveAttribute('aria-expanded', 'false');
    expect(names()).toHaveLength(4);
  });

  test('has the options of a program only while both folds above them are open', async () => {
    const user = userEvent.setup();
    page.render(ToolsTable, { ...DEFAULTS, agents: [mainThread()] });
    await user.click(searchFold());
    await user.click(grepFold());
    expect(names()).toEqual(['Bash', 'search (1 program)', 'grep (1 option set)', '-rn', 'view', 'Read']);
  });

  test('hides an open inner fold’s rows with the outer one, and has them again when it opens', async () => {
    const user = userEvent.setup();
    page.render(ToolsTable, { ...DEFAULTS, agents: [mainThread()] });
    await user.click(searchFold());
    await user.click(grepFold());
    await user.click(searchFold());
    expect(names()).toEqual(['Bash', 'search (1 program)', 'view', 'Read']);
    await user.click(searchFold());
    expect(grepFold()).toHaveAttribute('aria-expanded', 'true');
    expect(names()).toHaveLength(6);
  });

  test('stays open while the agents change, the button and rows keeping their nodes and focus', async () => {
    const user = userEvent.setup();
    const { rerender } = page.render(ToolsTable, { ...DEFAULTS, agents: [mainThread()] });
    await user.click(searchFold());
    const button = searchFold();
    const before = screen.getAllByRole('row').slice(1);
    button.focus();
    void rerender({ agents: [mainThread(20)] });
    flushSync();
    expect(searchFold()).toBe(button);
    expect(button).toHaveFocus();
    expect(button).toHaveAttribute('aria-expanded', 'true');
    const after = screen.getAllByRole('row').slice(1);
    expect(after).toHaveLength(5);
    expect(after[0]).toBe(before[0]);
    expect(after[2]).toBe(before[2]);
    expect(within(after[0] as HTMLElement).getAllByRole('cell')[2]).toHaveTextContent('20');
  });

  test('starts closed again in a new component', async () => {
    const user = userEvent.setup();
    const first = page.render(ToolsTable, { ...DEFAULTS, agents: [mainThread()] });
    await user.click(searchFold());
    first.unmount();
    page.render(ToolsTable, { ...DEFAULTS, agents: [mainThread()] });
    expect(searchFold()).toHaveAttribute('aria-expanded', 'false');
  });
});

describe('the pager', () => {
  const tools = Array.from({ length: 12 }, (_unused, index) => toolKindRow({ tool: `Tool${index}`, calls: 1 }));

  test('joins the heading past 10 groups of rows, under the key it is given', () => {
    page.render(ToolsTable, { ...DEFAULTS, agents: [agent({ tool_kinds: tools })] });
    expect(screen.getByRole('combobox', { name: 'Rows per page' }).id).toBe('pager-s1-tools-size');
    expect(screen.getByRole('heading', { level: 3 }).parentElement).toHaveClass('title-row');
  });

  test('shows a page of rows and the next one with its button', async () => {
    const user = userEvent.setup();
    page.app.preferences.pageSize = 10;
    page.render(ToolsTable, { ...DEFAULTS, agents: [agent({ tool_kinds: tools })] });
    expect(names()).toHaveLength(10);
    await user.click(screen.getByRole('button', { name: 'Next ›' }));
    expect(names()).toEqual(['Tool10', 'Tool11']);
    expect(page.app.pages.first('s1-tools')).toBe(10);
  });

  test('is not there for fewer rows', () => {
    page.render(ToolsTable, { ...DEFAULTS, agents: [mainThread()] });
    expect(screen.queryByRole('combobox', { name: 'Rows per page' })).toBeNull();
  });
});
