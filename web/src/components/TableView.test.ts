import { render, screen, within } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { flushSync } from 'svelte';
import { afterEach, beforeEach, describe, expect, test } from 'vitest';
import { tablePages } from '../lib/paging.svelte';
import { preferences } from '../lib/prefs.svelte';
import TableViewFixture, { type BenchRow } from './TableViewFixture.test.svelte';

const KEYS = ['bench', 'other'];

/** `count` rows named "row 0", "row 1", …, with the sub-rows the indexes in `subs` name. */
function makeRows(count: number, subs: number[] = []): BenchRow[] {
  return Array.from({ length: count }, (_unused, index) => ({
    id: `r${index}`,
    name: `row ${index}`,
    amount: index * 10,
    sub: subs.includes(index),
  }));
}

function names(): (string | null)[] {
  return within(screen.getByRole('table'))
    .getAllByRole('row')
    .slice(1)
    .map((row) => row.firstElementChild?.textContent ?? null);
}

function status(): string {
  return screen.getByText(/ of \d+$/).textContent ?? '';
}

beforeEach(() => {
  localStorage.clear();
  preferences.pageSize = 25;
});

afterEach(() => {
  for (const key of KEYS) tablePages.forget(key);
  preferences.pageSize = 25;
  localStorage.clear();
});

describe('the table', () => {
  test('a wrap around a table whose heading cells are the columns, the numeric ones in the num class', () => {
    const { container } = render(TableViewFixture, { rows: makeRows(3) });
    expect(container.firstElementChild).toHaveClass('table-wrap');
    const heads = screen.getAllByRole('columnheader');
    expect(heads.map((head) => head.textContent)).toEqual(['Name', 'Amount']);
    expect(heads.map((head) => head.classList.contains('num'))).toEqual([false, true]);
  });

  test('each row draws its cells from the snippet, in the order given', () => {
    render(TableViewFixture, { rows: makeRows(3) });
    expect(names()).toEqual(['row 0', 'row 1', 'row 2']);
    const cells = within(screen.getAllByRole('row')[2] as HTMLElement).getAllByRole('cell');
    expect(cells.map((cell) => cell.textContent)).toEqual(['row 1', '10']);
    expect(cells.map((cell) => cell.classList.contains('num'))).toEqual([false, true]);
  });

  test('a table without rows is its heading only', () => {
    render(TableViewFixture, { rows: [] });
    expect(screen.getAllByRole('row')).toHaveLength(1);
    expect(screen.queryByRole('group', { name: 'Pages' })).toBeNull();
  });

  test('a sub-row has the class sub-row and the others none', () => {
    render(TableViewFixture, { rows: makeRows(3, [1]), withSub: true });
    const rows = screen.getAllByRole('row').slice(1);
    expect(rows.map((row) => row.classList.contains('sub-row'))).toEqual([false, true, false]);
  });

  test('without a sub function no row is a sub-row', () => {
    render(TableViewFixture, { rows: makeRows(3, [1]) });
    expect(document.querySelector('.sub-row')).toBeNull();
  });
});

describe('a column title', () => {
  test('is set on the heading cell of the column that has one', () => {
    render(TableViewFixture, { rows: makeRows(2), withTitle: true });
    const heads = screen.getAllByRole('columnheader');
    expect(heads.map((head) => head.getAttribute('title'))).toEqual([null, 'what it comes to']);
  });

  test('is not there without one', () => {
    render(TableViewFixture, { rows: makeRows(2) });
    expect(document.querySelector('th[title]')).toBeNull();
  });
});

describe('row classes', () => {
  test('a row gets the classes its function gives, the others none', () => {
    render(TableViewFixture, { rows: makeRows(3), withRowClass: true });
    const rows = screen.getAllByRole('row').slice(1);
    expect(rows.map((row) => row.className)).toEqual(['', 'flagged', '']);
  });

  test('they come with sub-row where the row is one', () => {
    render(TableViewFixture, { rows: makeRows(3, [1]), withSub: true, withRowClass: true });
    const rows = screen.getAllByRole('row').slice(1);
    expect(rows.map((row) => row.className)).toEqual(['', 'sub-row flagged', '']);
  });
});

describe('the table name', () => {
  test('every heading cell is a column heading by its scope', () => {
    render(TableViewFixture, { rows: makeRows(3) });
    const heads = screen.getAllByRole('columnheader');
    expect(heads.map((head) => head.getAttribute('scope'))).toEqual(['col', 'col']);
  });

  test('a labelledby names the table by the element with that id, the heading', () => {
    render(TableViewFixture, { rows: makeRows(3), withHeading: true, labelledby: 'bench-title' });
    expect(screen.getByRole('table')).toHaveAttribute('aria-labelledby', 'bench-title');
    expect(screen.getByRole('table', { name: 'Bench' })).toBeInTheDocument();
  });

  test('without one the table has no aria-labelledby', () => {
    render(TableViewFixture, { rows: makeRows(3), withHeading: true });
    expect(screen.getByRole('table')).not.toHaveAttribute('aria-labelledby');
  });
});

describe('group rows', () => {
  test('a group row has the class group-row, the others none', () => {
    render(TableViewFixture, {
      rows: makeRows(3).map((row, index) => ({ ...row, group: index === 0, sub: index === 1 })),
      withGroup: true,
      withSub: true,
    });
    const rows = screen.getAllByRole('row').slice(1);
    expect(rows.map((row) => row.className)).toEqual(['group-row', 'sub-row', '']);
  });

  test('without a group function no row is a group', () => {
    render(TableViewFixture, { rows: makeRows(3).map((row) => ({ ...row, group: true })) });
    expect(document.querySelector('.group-row')).toBeNull();
  });
});

describe('the heading', () => {
  test('unpaged it stands bare before the wrap, in no title row, the table after it', () => {
    const { container } = render(TableViewFixture, { rows: makeRows(3), withHeading: true });
    const [heading, wrap] = [...container.children];
    expect(heading?.tagName).toBe('H3');
    expect(heading).toHaveTextContent('Bench');
    expect(container.querySelector('.title-row')).toBeNull();
    expect(wrap).toHaveClass('table-wrap');
    expect(wrap?.querySelector('table')).not.toBeNull();
  });

  test('paged it goes with the pager in a title row before the wrap', () => {
    const { container } = render(TableViewFixture, { rows: makeRows(40), withHeading: true });
    const [titleRow, wrap] = [...container.children];
    expect(titleRow).toHaveClass('title-row');
    expect([...(titleRow?.children ?? [])].map((child) => child.tagName)).toEqual(['H3', 'DIV']);
    expect(wrap).toHaveClass('table-wrap');
  });

  test('takes the pager into its row, after the heading, past ten groups', () => {
    const { container } = render(TableViewFixture, { rows: makeRows(40), withHeading: true });
    const titleRow = container.querySelector('.title-row') as HTMLElement;
    const pager = screen.getByRole('group', { name: 'Pages' });
    expect(pager.parentElement).toBe(titleRow);
    expect(pager.previousElementSibling?.tagName).toBe('H3');
    expect(container.querySelector('.table-wrap .pager')).toBeNull();
  });

  test('gives up its title row when the rows shrink to one page', () => {
    const { container, rerender } = render(TableViewFixture, { rows: makeRows(40), withHeading: true });
    expect(container.querySelector('.title-row')).not.toBeNull();
    void rerender({ rows: makeRows(3) });
    flushSync();
    expect(container.querySelector('.title-row')).toBeNull();
    expect(container.firstElementChild?.tagName).toBe('H3');
  });

  test('without one the wrap is first and holds the pager', () => {
    const { container } = render(TableViewFixture, { rows: makeRows(40) });
    expect(container.querySelector('.title-row')).toBeNull();
    expect(container.firstElementChild).toHaveClass('table-wrap');
  });

  test('the pager keeps its page when the heading is there', async () => {
    const user = userEvent.setup();
    render(TableViewFixture, { rows: makeRows(40), withHeading: true });
    await user.click(screen.getByRole('button', { name: 'Next ›' }));
    expect(status()).toBe('rows 26–40 of 40');
  });
});

describe('the intro', () => {
  test('goes between the heading and the wrap', () => {
    const { container } = render(TableViewFixture, { rows: makeRows(3), withHeading: true, withIntro: true });
    const [heading, note, wrap] = [...container.children];
    expect(heading?.tagName).toBe('H3');
    expect(note).toHaveClass('note');
    expect(note).toHaveTextContent('About the bench');
    expect(wrap).toHaveClass('table-wrap');
  });

  test('shows without a heading, before the wrap', () => {
    const { container } = render(TableViewFixture, { rows: makeRows(3), withIntro: true });
    expect(container.firstElementChild).toHaveClass('note');
    expect(container.lastElementChild).toHaveClass('table-wrap');
  });
});

describe('the empty text', () => {
  test('replaces the table where there are no rows, the heading and intro staying', () => {
    const { container } = render(TableViewFixture, {
      rows: [],
      empty: 'Nothing here.',
      withHeading: true,
      withIntro: true,
    });
    expect(screen.queryByRole('table')).toBeNull();
    expect(container.querySelector('.table-wrap > .empty')).toHaveTextContent(/^Nothing here\.$/);
    expect(container.querySelector(':scope > h3')).not.toBeNull();
    expect(container.querySelector('.note')).not.toBeNull();
  });

  test('is not shown where there are rows', () => {
    render(TableViewFixture, { rows: makeRows(2), empty: 'Nothing here.' });
    expect(document.querySelector('.empty')).toBeNull();
    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  test('without it a table with no rows is its heading only', () => {
    render(TableViewFixture, { rows: [] });
    expect(document.querySelector('.empty')).toBeNull();
    expect(screen.getAllByRole('row')).toHaveLength(1);
  });

  test('gives way to the table when rows come', () => {
    const { rerender } = render(TableViewFixture, { rows: [], empty: 'Nothing here.' });
    void rerender({ rows: makeRows(2), empty: 'Nothing here.' });
    flushSync();
    expect(document.querySelector('.empty')).toBeNull();
    expect(names()).toEqual(['row 0', 'row 1']);
  });
});

describe('the pager', () => {
  test('there is none up to ten groups of rows, then it goes before the table in the wrap', () => {
    const { container, rerender } = render(TableViewFixture, { rows: makeRows(10) });
    expect(screen.queryByRole('group', { name: 'Pages' })).toBeNull();
    void rerender({ rows: makeRows(11) });
    flushSync();
    const pager = screen.getByRole('group', { name: 'Pages' });
    expect(pager.nextElementSibling?.tagName).toBe('TABLE');
    expect(pager.parentElement).toBe(container.firstElementChild);
  });

  test('its key makes the controls ids, its noun the words', () => {
    render(TableViewFixture, { rows: makeRows(40), tableKey: 'other', noun: 'days' });
    expect(screen.getByRole('combobox', { name: 'Days per page' }).id).toBe('pager-other-size');
    expect(status()).toBe('days 1–25 of 40');
  });

  test('the first page draws only its rows, none hidden', () => {
    render(TableViewFixture, { rows: makeRows(40) });
    expect(names()).toHaveLength(25);
    expect(names()[24]).toBe('row 24');
    expect(document.querySelector('.off-page')).toBeNull();
  });

  test('next shows the next rows and previous the ones before', async () => {
    const user = userEvent.setup();
    render(TableViewFixture, { rows: makeRows(40) });
    await user.click(screen.getByRole('button', { name: 'Next ›' }));
    expect(status()).toBe('rows 26–40 of 40');
    expect(names()).toEqual(Array.from({ length: 15 }, (_unused, index) => `row ${25 + index}`));
    await user.click(screen.getByRole('button', { name: '‹ Previous' }));
    expect(names()[0]).toBe('row 0');
  });

  test('a sub-row stays with its parent at the page edge', async () => {
    const user = userEvent.setup();
    preferences.pageSize = 10;
    // rows 10 and 11 belong to row 9, the last unit of the first page
    render(TableViewFixture, { rows: makeRows(30, [10, 11]), withSub: true });
    expect(names()).toHaveLength(12);
    expect(names().at(-1)).toBe('row 11');
    await user.click(screen.getByRole('button', { name: 'Next ›' }));
    expect(names()[0]).toBe('row 12');
    expect(names()).toHaveLength(10);
    expect(status()).toBe('rows 11–20 of 28');
  });

  test('a new page size pages again, keeping the page that holds the first row shown', async () => {
    const user = userEvent.setup();
    render(TableViewFixture, { rows: makeRows(120) });
    await user.click(screen.getByRole('button', { name: 'Next ›' }));
    await user.selectOptions(screen.getByRole('combobox'), '10');
    expect(status()).toBe('rows 21–30 of 120');
    expect(names()[0]).toBe('row 20');
  });
});

describe('the page kept', () => {
  test('rows replaced keep the page of the key', async () => {
    const user = userEvent.setup();
    const { rerender } = render(TableViewFixture, { rows: makeRows(60) });
    await user.click(screen.getByRole('button', { name: 'Next ›' }));
    void rerender({ rows: makeRows(90) });
    flushSync();
    expect(status()).toBe('rows 26–50 of 90');
    expect(names()[0]).toBe('row 25');
  });

  test('a table drawn again under the same key is on its page, another key starts at the first', async () => {
    const user = userEvent.setup();
    const { unmount } = render(TableViewFixture, { rows: makeRows(60) });
    await user.click(screen.getByRole('button', { name: 'Next ›' }));
    unmount();
    const { unmount: unmountAgain } = render(TableViewFixture, { rows: makeRows(60) });
    expect(names()[0]).toBe('row 25');
    unmountAgain();
    render(TableViewFixture, { rows: makeRows(60), tableKey: 'other' });
    expect(names()[0]).toBe('row 0');
  });

  test('rows that shrink below the stored page show the last page', async () => {
    const user = userEvent.setup();
    const { rerender } = render(TableViewFixture, { rows: makeRows(90) });
    await user.click(screen.getByRole('button', { name: 'Next ›' }));
    await user.click(screen.getByRole('button', { name: 'Next ›' }));
    void rerender({ rows: makeRows(30) });
    flushSync();
    expect(status()).toBe('rows 26–30 of 30');
    expect(names()).toEqual(['row 25', 'row 26', 'row 27', 'row 28', 'row 29']);
  });

  test('rows that shrink to one page lose the pager and show all, the stored page is clamped', async () => {
    const user = userEvent.setup();
    const { rerender } = render(TableViewFixture, { rows: makeRows(60) });
    await user.click(screen.getByRole('button', { name: 'Next ›' }));
    void rerender({ rows: makeRows(8) });
    flushSync();
    expect(screen.queryByRole('group', { name: 'Pages' })).toBeNull();
    expect(names()).toHaveLength(8);
  });
});

describe('the rows keep their nodes', () => {
  test('rows re-ordered are the same nodes in the new order', () => {
    const rows = makeRows(4);
    const { rerender } = render(TableViewFixture, { rows });
    const before = new Map(screen.getAllByRole('row').slice(1).map((row) => [row.textContent, row]));
    void rerender({ rows: [...rows].reverse() });
    flushSync();
    expect(names()).toEqual(['row 3', 'row 2', 'row 1', 'row 0']);
    for (const row of screen.getAllByRole('row').slice(1)) expect(row).toBe(before.get(row.textContent));
  });

  test('a row updated is the same node with new cells', () => {
    const rows = makeRows(3);
    const { rerender } = render(TableViewFixture, { rows });
    const node = screen.getAllByRole('row')[2];
    void rerender({ rows: rows.map((row) => (row.id === 'r1' ? { ...row, amount: 99 } : row)) });
    flushSync();
    expect(screen.getAllByRole('row')[2]).toBe(node);
    expect(within(node as HTMLElement).getAllByRole('cell').map((cell) => cell.textContent)).toEqual(['row 1', '99']);
  });
});
