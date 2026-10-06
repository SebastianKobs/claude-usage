import { screen, within } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { flushSync } from 'svelte';
import { afterEach, beforeEach, describe, expect, test } from 'vitest';
import { pagePerTest } from '../app/app.testing';
import { usage } from '../api/fixtures';
import { modelRows, usageRows, type UsageRow } from './usage';
import UsageTable from './UsageTable.svelte';

const page = pagePerTest();

/** `count` plain rows "name 0", "name 1", … from dearest to cheapest. */
function plainRows(count: number): UsageRow[] {
  return usageRows(
    Array.from({ length: count }, (_unused, index) => ({ name: `name ${index}`, ...usage({ cost: count - index }) })),
    (row) => row.name,
  );
}

const DEFAULTS = { id: 'by-agent', title: 'By agent type', nameLabel: 'Agent type', empty: 'No usage in this range.' };

function names(): (string | null)[] {
  return within(screen.getByRole('table'))
    .getAllByRole('row')
    .slice(1)
    .map((row) => row.firstElementChild?.textContent ?? null);
}

beforeEach(() => {
  localStorage.clear();
  page.app.preferences.pageSize = 25;
});

afterEach(() => {
  localStorage.clear();
});

describe('the card', () => {
  test('is a section named for its heading, which is a level 2 heading with the id the section names', () => {
    const { container } = page.render(UsageTable, { ...DEFAULTS, rows: plainRows(2) });
    const section = screen.getByRole('region', { name: 'By agent type' });
    expect(section).toBe(container.firstElementChild);
    expect(section).toHaveClass('card');
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toHaveTextContent(/^By agent type$/);
    expect(heading.id).toBe('by-agent-title');
    expect(section.getAttribute('aria-labelledby')).toBe('by-agent-title');
  });

  test('has a note under its heading where it has one, before the table', () => {
    const { container } = page.render(UsageTable, { ...DEFAULTS, note: 'turns of a skill', rows: plainRows(2) });
    const note = container.querySelector('.note');
    expect(note?.tagName).toBe('P');
    expect(note).toHaveTextContent(/^turns of a skill$/);
    expect(note?.previousElementSibling).toBe(screen.getByRole('heading', { level: 2 }));
    expect(note?.nextElementSibling).toHaveClass('table-wrap');
  });

  test('has no note without one', () => {
    const { container } = page.render(UsageTable, { ...DEFAULTS, rows: plainRows(2) });
    expect(container.querySelector('.note')).toBeNull();
  });
});

describe('the table', () => {
  test('is named by the heading, and every column heading has scope col', () => {
    page.render(UsageTable, { ...DEFAULTS, rows: plainRows(2) });
    const table = screen.getByRole('table', { name: 'By agent type' });
    expect(table.getAttribute('aria-labelledby')).toBe('by-agent-title');
    const heads = within(table).getAllByRole('columnheader');
    expect(heads.map((head) => head.getAttribute('scope'))).toEqual(Array(6).fill('col'));
  });

  test('has the name column, then the usage columns, all numeric but the name', () => {
    page.render(UsageTable, { ...DEFAULTS, nameLabel: 'Skill', rows: plainRows(1) });
    const heads = screen.getAllByRole('columnheader');
    expect(heads.map((head) => head.textContent)).toEqual([
      'Skill',
      'Turns',
      'Input',
      'Cache read %',
      'Output',
      'Cost',
    ]);
    expect(heads.map((head) => head.classList.contains('num'))).toEqual([false, true, true, true, true, true]);
  });

  test('has a row per entry, in the order given, with the name and the usage cells', () => {
    page.render(UsageTable, {
      ...DEFAULTS,
      rows: usageRows(
        [
          { name: 'Explore', ...usage({ cost: 1 }) },
          { name: 'main', ...usage({ cost: 2, turns: 4, output: 2_000 }) },
        ],
        (row) => row.name,
      ),
    });
    expect(names()).toEqual(['main', 'Explore']);
    const cells = within(screen.getAllByRole('row')[1] as HTMLElement).getAllByRole('cell');
    expect(cells.map((cell) => cell.textContent)).toEqual(['main', '4', '1.2K', '75%', '2K', '$2.00']);
    expect(cells.map((cell) => cell.classList.contains('num'))).toEqual([false, true, true, true, true, true]);
  });

  test('has plain rows without a swatch, an effort span or a row class', () => {
    const { container } = page.render(UsageTable, { ...DEFAULTS, rows: plainRows(3) });
    expect(container.querySelector('.swatch')).toBeNull();
    expect(container.querySelector('.effort')).toBeNull();
    expect(container.querySelector('.group-row, .sub-row')).toBeNull();
  });
});

describe('a model table', () => {
  function models(): UsageRow[] {
    return modelRows(
      [
        { model: 'claude-opus-5', ...usage({ cost: 5 }) },
        { model: 'claude-haiku-4-5', ...usage({ cost: 1 }) },
      ],
      [
        { model: 'claude-opus-5', effort: 'high', ...usage({ cost: 3 }) },
        { model: 'claude-opus-5', effort: 'low', ...usage({ cost: 2 }) },
        { model: 'claude-opus-5', effort: null, ...usage({ cost: 1 }) },
      ],
      new Map([
        ['claude-opus-5', 2],
        ['claude-haiku-4-5', 3],
      ]),
    );
  }

  function renderModels() {
    return page.render(UsageTable, { ...DEFAULTS, title: 'By model', nameLabel: 'Model', rows: models() });
  }

  test('has each model, then its effort levels from least to most, none for calls without one', () => {
    renderModels();
    expect(names()).toEqual(['claude-opus-5', 'effort low', 'effort high', 'claude-haiku-4-5']);
  });

  test('has the model rows as group rows and the effort rows as sub-rows', () => {
    renderModels();
    const rows = screen.getAllByRole('row').slice(1);
    expect(rows.map((row) => row.className)).toEqual(['group-row', 'sub-row', 'sub-row', 'group-row']);
  });

  test('has a swatch before a model`s name, in its slot`s color', () => {
    const { container } = renderModels();
    const swatches = container.querySelectorAll('tbody td:first-child > span > .swatch');
    expect(swatches).toHaveLength(2);
    expect(swatches[0]?.getAttribute('style')).toContain('var(--series-3)');
    expect(swatches[1]?.getAttribute('style')).toContain('var(--series-4)');
    expect(swatches[0]?.parentElement).toHaveTextContent('claude-opus-5');
  });

  test('has an effort level as a span of the effort class, without a swatch', () => {
    const { container } = renderModels();
    const efforts = [...container.querySelectorAll('td > span.effort')];
    expect(efforts.map((effort) => effort.textContent)).toEqual(['effort low', 'effort high']);
    expect(efforts[0]?.querySelector('.swatch')).toBeNull();
  });
});

describe('without rows', () => {
  test('it says the empty text instead of the table, the heading and note staying', () => {
    const { container } = page.render(UsageTable, { ...DEFAULTS, note: 'about it', rows: [], empty: 'Nothing used.' });
    expect(screen.queryByRole('table')).toBeNull();
    expect(container.querySelector('.table-wrap > .empty')).toHaveTextContent(/^Nothing used\.$/);
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('By agent type');
    expect(container.querySelector('.note')).toHaveTextContent('about it');
  });

  test('with null (no summary yet) it is the heading only: no note, table, empty text or pager', () => {
    const { container } = page.render(UsageTable, { ...DEFAULTS, note: 'about it', rows: null });
    expect(container.firstElementChild?.children).toHaveLength(1);
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('By agent type');
    expect(screen.getByRole('region', { name: 'By agent type' })).toBeInTheDocument();
    expect(container.querySelector('table, .table-wrap, .empty, .note, .pager')).toBeNull();
  });

  test('the table comes when the rows do', () => {
    const { container, rerender } = page.render(UsageTable, { ...DEFAULTS, rows: null });
    void rerender({ rows: plainRows(2) });
    flushSync();
    expect(names()).toEqual(['name 0', 'name 1']);
    expect(container.querySelectorAll('h2')).toHaveLength(1);
  });
});

describe('the pager', () => {
  test('there is none up to ten rows', () => {
    page.render(UsageTable, { ...DEFAULTS, rows: plainRows(10) });
    expect(screen.queryByRole('group', { name: 'Pages' })).toBeNull();
    expect(document.querySelector('.title-row')).toBeNull();
  });

  test('past ten rows it shares a row with the heading, after it', () => {
    const { container } = page.render(UsageTable, { ...DEFAULTS, rows: plainRows(40) });
    const titleRow = container.querySelector('.title-row') as HTMLElement;
    const pager = screen.getByRole('group', { name: 'Pages' });
    expect(pager.parentElement).toBe(titleRow);
    expect(pager.previousElementSibling).toBe(screen.getByRole('heading', { level: 2 }));
    expect(container.querySelector('.table-wrap .pager')).toBeNull();
    expect(names()).toHaveLength(25);
  });

  test('its page is kept under the table`s id, and next shows the rest', async () => {
    const user = userEvent.setup();
    page.render(UsageTable, { ...DEFAULTS, rows: plainRows(40) });
    expect(screen.getByRole('combobox', { name: 'Rows per page' }).id).toBe('pager-by-agent-size');
    await user.click(screen.getByRole('button', { name: 'Next ›' }));
    expect(names()[0]).toBe('name 25');
    expect(names()).toHaveLength(15);
  });

  test('the effort rows stay with their model across a page boundary', async () => {
    const user = userEvent.setup();
    page.app.preferences.pageSize = 10;
    const all = modelRows(
      Array.from({ length: 12 }, (_unused, index) => ({ model: `m${index}`, ...usage({ cost: 100 - index }) })),
      ['low', 'medium', 'high'].map((effort) => ({ model: 'm9', effort, ...usage() })),
      new Map(),
    );
    // m9 is the tenth model, the last unit of the first page, so its three effort rows come with it
    page.render(UsageTable, { ...DEFAULTS, title: 'By model', nameLabel: 'Model', rows: all });
    expect(names()).toEqual([
      ...Array.from({ length: 9 }, (_unused, index) => `m${index}`),
      'm9',
      'effort low',
      'effort medium',
      'effort high',
    ]);
    await user.click(screen.getByRole('button', { name: 'Next ›' }));
    expect(names()).toEqual(['m10', 'm11']);
  });
});

describe('a redraw', () => {
  test('takes new rows in place, the heading staying the same node', () => {
    const { rerender } = page.render(UsageTable, { ...DEFAULTS, rows: plainRows(2) });
    const heading = screen.getByRole('heading', { level: 2 });
    void rerender({ rows: plainRows(3) });
    flushSync();
    expect(names()).toEqual(['name 0', 'name 1', 'name 2']);
    expect(screen.getByRole('heading', { level: 2 })).toBe(heading);
  });

  test('keeps a row`s node by its key when the rows reorder', () => {
    const rows = plainRows(3);
    const { rerender } = page.render(UsageTable, { ...DEFAULTS, rows });
    const before = new Map(screen.getAllByRole('row').slice(1).map((row) => [row.firstElementChild?.textContent, row]));
    void rerender({ rows: [...rows].reverse() });
    flushSync();
    expect(names()).toEqual(['name 2', 'name 1', 'name 0']);
    for (const row of screen.getAllByRole('row').slice(1)) {
      expect(row).toBe(before.get(row.firstElementChild?.textContent));
    }
  });
});

describe('the inline form', () => {
  test('is no card: the heading is a level 3 one and the table is named by it, all in the parent`s place', () => {
    const { container } = page.render(UsageTable, { ...DEFAULTS, inline: true, rows: plainRows(2) });
    expect(container.querySelector('section')).toBeNull();
    const heading = screen.getByRole('heading', { level: 3 });
    expect(heading).toHaveTextContent(/^By agent type$/);
    expect(heading.id).toBe('by-agent-title');
    expect(container.firstElementChild).toBe(heading);
    expect(heading.nextElementSibling).toHaveClass('table-wrap');
    expect(screen.getByRole('table', { name: 'By agent type' })).toBeInTheDocument();
  });

  test('draws the same rows and cells as the card', () => {
    page.render(UsageTable, { ...DEFAULTS, inline: true, rows: plainRows(2) });
    expect(names()).toEqual(['name 0', 'name 1']);
    const cells = within(screen.getAllByRole('row')[1] as HTMLElement).getAllByRole('cell');
    expect(cells.map((cell) => cell.classList.contains('num'))).toEqual([false, true, true, true, true, true]);
  });

  test('keeps its page under the pager key given, not the id', async () => {
    const user = userEvent.setup();
    page.render(UsageTable, { ...DEFAULTS, inline: true, pagerKey: 's1-models', rows: plainRows(40) });
    expect(screen.getByRole('combobox', { name: 'Rows per page' }).id).toBe('pager-s1-models-size');
    await user.click(screen.getByRole('button', { name: 'Next ›' }));
    expect(page.app.pages.first('s1-models')).toBe(25);
    expect(page.app.pages.first('by-agent')).toBe(0);
  });

  test('says the empty text without rows, the heading staying', () => {
    const { container } = page.render(UsageTable, { ...DEFAULTS, inline: true, rows: [], empty: 'Nothing used.' });
    expect(container.querySelector('.table-wrap > .empty')).toHaveTextContent(/^Nothing used\.$/);
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('By agent type');
  });
});
