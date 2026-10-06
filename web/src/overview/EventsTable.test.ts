import { screen, within } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { flushSync } from 'svelte';
import { afterEach, beforeEach, describe, expect, test } from 'vitest';
import { pagePerTest } from '../app/app.testing';
import { apiErrorEvent } from '../api/fixtures';
import { eventRows } from './limits';
import EventsTable from './EventsTable.svelte';

const page = pagePerTest();

const DEFAULTS = { id: 'errors', title: 'Latest API errors', empty: 'No API errors.', pagerKey: 'errors-key' };

/** Two failed calls: a rate limit of the shop session and a server error of an untitled one. */
function events() {
  return eventRows([
    apiErrorEvent(),
    apiErrorEvent({
      record_id: 'err-2',
      error: 'server_error',
      status: 500,
      limit_type: null,
      resets_at: null,
      session_id: 'abc-2',
      project: 'blog',
      agent_type: 'Explore',
      title: null,
    }),
  ]);
}

beforeEach(() => {
  localStorage.clear();
  page.app.preferences.pageSize = 25;
});

afterEach(() => {
  localStorage.clear();
});

describe('the table', () => {
  test('is named by its level 3 heading, which stands bare before the wrap up to ten rows', () => {
    page.render(EventsTable, { ...DEFAULTS, rows: events() });
    const heading = screen.getByRole('heading', { level: 3 });
    expect(heading).toHaveTextContent(/^Latest API errors$/);
    expect(heading.id).toBe('errors-title');
    expect(heading.nextElementSibling).toHaveClass('table-wrap');
    expect(screen.getByRole('table', { name: 'Latest API errors' })).toBeInTheDocument();
  });

  test('is headed by the time, the error, the quota, its reset, the session and the agent', () => {
    page.render(EventsTable, { ...DEFAULTS, rows: events() });
    const heads = screen.getAllByRole('columnheader');
    expect(heads.map((head) => head.textContent)).toEqual(['When', 'Error', 'Quota', 'Resets', 'Session', 'Agent']);
  });

  test('has a row per call: the error in words, the quota, a link to its session with the project, the agent', () => {
    page.render(EventsTable, { ...DEFAULTS, rows: events() });
    const [first, second] = screen.getAllByRole('row').slice(1) as [HTMLElement, HTMLElement];
    const cells = within(first).getAllByRole('cell');
    expect(cells.map((cell) => cell.classList.contains('num'))).toEqual([true, false, false, true, false, false]);
    expect([1, 2, 5].map((index) => cells[index]?.textContent)).toEqual(['⚠ Rate limit (429)', '5-hour limit', 'main']);
    expect(within(cells[4] as HTMLElement).getByRole('link')).toHaveAttribute('href', '#session/abc-1');
    expect(cells[4]?.querySelector('.sub')).toHaveTextContent('shop');
    const other = within(second).getAllByRole('cell');
    expect([1, 2, 3, 5].map((index) => other[index]?.textContent)).toEqual(['server error (500)', '–', '–', 'Explore']);
    expect(within(other[4] as HTMLElement).getByRole('link')).toHaveTextContent('Untitled session');
  });
});

describe('without the session', () => {
  test('the session column is left out of the heading and every row', () => {
    page.render(EventsTable, { ...DEFAULTS, rows: events(), withSession: false });
    const heads = screen.getAllByRole('columnheader');
    expect(heads.map((head) => head.textContent)).toEqual(['When', 'Error', 'Quota', 'Resets', 'Agent']);
    const cells = within(screen.getAllByRole('row')[1] as HTMLElement).getAllByRole('cell');
    expect(cells.map((cell) => cell.textContent?.includes('Checkout'))).toEqual(Array(5).fill(false));
    expect(cells[4]).toHaveTextContent('main');
    expect(screen.queryByRole('link')).toBeNull();
  });
});

describe('without rows', () => {
  test('it says the empty text instead of the table, the heading staying', () => {
    const { container } = page.render(EventsTable, { ...DEFAULTS, rows: [] });
    expect(screen.queryByRole('table')).toBeNull();
    expect(container.querySelector('.table-wrap > .empty')).toHaveTextContent(/^No API errors\.$/);
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Latest API errors');
  });
});

describe('the pager', () => {
  function many(count: number) {
    return eventRows(Array.from({ length: count }, (_unused, index) => apiErrorEvent({ record_id: `err-${index}` })));
  }

  test('there is none up to ten rows; past them it shares a row with the heading, under the key given', async () => {
    const user = userEvent.setup();
    const { rerender, container } = page.render(EventsTable, { ...DEFAULTS, rows: many(10) });
    expect(container.querySelector('.title-row')).toBeNull();
    void rerender({ rows: many(30) });
    flushSync();
    expect(screen.getByRole('group', { name: 'Pages' }).parentElement).toHaveClass('title-row');
    expect(screen.getByRole('combobox', { name: 'Rows per page' }).id).toBe('pager-errors-key-size');
    await user.click(screen.getByRole('button', { name: 'Next ›' }));
    expect(screen.getAllByRole('row')).toHaveLength(6);
    expect(page.app.pages.first('errors-key')).toBe(25);
  });
});

describe('a redraw', () => {
  test('keeps a row`s node by its record when the rows come in another order', () => {
    const rows = events();
    const { rerender } = page.render(EventsTable, { ...DEFAULTS, rows });
    const before = screen.getAllByRole('row').slice(1);
    void rerender({ rows: [...rows].reverse() });
    flushSync();
    expect(screen.getAllByRole('row').slice(1)).toEqual([...before].reverse());
  });
});
