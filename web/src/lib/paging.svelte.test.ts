import { screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { flushSync } from 'svelte';
import { afterEach, beforeEach, describe, expect, test } from 'vitest';
import { TablePages, mountPager, releaseDetachedPagers, shownWindow, tablePages } from './paging.svelte.ts';
import { preferences } from './prefs.svelte.ts';
import { pageUnits } from './tables.ts';

const KEYS = ['usage', 'other', 'cards'];

function makeRows(count: number, subRows: number[] = []) {
  const rows = Array.from({ length: count }, () => document.createElement('tr'));
  const units = pageUnits(rows.map((_row, index) => subRows.includes(index)));
  return { rows, units };
}

function hidden(rows: HTMLElement[]): number[] {
  return rows.flatMap((row, index) => (row.classList.contains('off-page') ? [index] : []));
}

function range(first: number, last: number): number[] {
  return Array.from({ length: last - first }, (_unused, index) => first + index);
}

/** A mounted pager put into the document, as the old code does with what it gets back. */
function place(pager: HTMLElement, parent: HTMLElement = document.body): HTMLElement {
  parent.append(pager);
  return pager;
}

beforeEach(() => {
  localStorage.clear();
  preferences.pageSize = 25;
});

afterEach(() => {
  // what a test left mounted, whether or not it was placed
  document.body.replaceChildren();
  releaseDetachedPagers();
  for (const key of KEYS) tablePages.forget(key);
  preferences.pageSize = 25;
  localStorage.clear();
});

describe('TablePages', () => {
  test('a table without a page starts at unit 0', () => {
    expect(new TablePages().first('usage')).toBe(0);
  });

  test('a page set is given back, by key', () => {
    const pages = new TablePages();
    pages.set('usage', 30);
    expect(pages.first('usage')).toBe(30);
    expect(pages.first('other')).toBe(0);
  });

  test('forgetting a table starts it at 0 again and leaves the others', () => {
    const pages = new TablePages();
    pages.set('usage', 30);
    pages.set('other', 10);
    pages.forget('usage');
    expect([pages.first('usage'), pages.first('other')]).toEqual([0, 10]);
  });

  test('the singleton is one TablePages', () => {
    expect(tablePages).toBeInstanceOf(TablePages);
  });
});

describe('shownWindow', () => {
  test('a table without a page shows its first, at the page size of the preference', () => {
    expect(shownWindow('usage', 60)).toEqual({ page: 0, pages: 3, first: 0, last: 25 });
    preferences.pageSize = 10;
    expect(shownWindow('usage', 60)).toEqual({ page: 0, pages: 6, first: 0, last: 10 });
  });

  test('the page holding the stored first unit shows, on any page size', () => {
    tablePages.set('usage', 30);
    expect(shownWindow('usage', 60)).toEqual({ page: 1, pages: 3, first: 25, last: 50 });
    preferences.pageSize = 10;
    expect(shownWindow('usage', 60)).toEqual({ page: 3, pages: 6, first: 30, last: 40 });
  });

  test('a stored page beyond the end shows the last page, without changing what is stored', () => {
    tablePages.set('usage', 500);
    expect(shownWindow('usage', 60)).toEqual({ page: 2, pages: 3, first: 50, last: 60 });
    expect(tablePages.first('usage')).toBe(500);
  });

  test('another key has its own page', () => {
    tablePages.set('usage', 25);
    expect(shownWindow('other', 60).page).toBe(0);
  });

  test('it is reactive: a turned page and a new page size are both seen by what reads it', () => {
    const seen: number[] = [];
    const stop = $effect.root(() => {
      $effect(() => {
        const window = shownWindow('usage', 120);
        seen.push(window.first, window.last);
      });
    });
    flushSync();
    tablePages.set('usage', 25);
    flushSync();
    preferences.pageSize = 50;
    flushSync();
    stop();
    expect(seen).toEqual([0, 25, 25, 50, 0, 50]);
  });
});

describe('mountPager', () => {
  test('it returns the pager itself: a group named Pages with its controls', () => {
    const { rows, units } = makeRows(60);
    const pager = mountPager({ key: 'usage', noun: 'rows', rows, units });
    expect(pager).toBeInstanceOf(HTMLElement);
    expect(pager).toHaveClass('pager');
    expect(pager).toHaveAttribute('role', 'group');
    expect(pager).toHaveAttribute('aria-label', 'Pages');
    expect(pager.querySelector('#pager-usage-size')).toBeInstanceOf(HTMLSelectElement);
    expect(pager.querySelector('#pager-usage-previous')).toBeInstanceOf(HTMLButtonElement);
    expect(pager.querySelector('#pager-usage-next')).toBeInstanceOf(HTMLButtonElement);
  });

  test('the rows have their classes at once, before the pager is put in the page', () => {
    const { rows, units } = makeRows(60);
    mountPager({ key: 'usage', noun: 'rows', rows, units });
    expect(hidden(rows)).toEqual(range(25, 60));
  });

  test('it works after being moved, also into a title row next to the table', async () => {
    const user = userEvent.setup();
    const { rows, units } = makeRows(60);
    const pager = mountPager({ key: 'usage', noun: 'rows', rows, units });
    const titleRow = document.body.appendChild(document.createElement('div'));
    titleRow.className = 'title-row';
    place(pager, titleRow);
    expect(pager.parentElement).toBe(titleRow);
    await user.click(screen.getByRole('button', { name: 'Next ›' }));
    expect(screen.getByText('rows 26–50 of 60')).toBeInTheDocument();
    expect(hidden(rows)).toEqual([...range(0, 25), ...range(50, 60)]);
  });

  test('a card grid says its noun', () => {
    const { rows, units } = makeRows(300);
    place(mountPager({ key: 'cards', noun: 'sessions', rows, units }));
    expect(screen.getByText('sessions 1–25 of 300')).toBeInTheDocument();
  });

  test('a pager drawn again with the same key is on the page it was on', async () => {
    const user = userEvent.setup();
    const first = makeRows(60);
    const old = place(mountPager({ key: 'usage', noun: 'rows', rows: first.rows, units: first.units }));
    await user.click(screen.getByRole('button', { name: 'Next ›' }));
    old.remove();
    releaseDetachedPagers();
    const again = makeRows(60);
    place(mountPager({ key: 'usage', noun: 'rows', rows: again.rows, units: again.units }));
    expect(screen.getByText('rows 26–50 of 60')).toBeInTheDocument();
    expect(hidden(again.rows)).toEqual([...range(0, 25), ...range(50, 60)]);
  });

  test('a different key starts at the first page', async () => {
    const user = userEvent.setup();
    const first = makeRows(60);
    place(mountPager({ key: 'usage', noun: 'rows', rows: first.rows, units: first.units }));
    await user.click(screen.getByRole('button', { name: 'Next ›' }));
    const other = makeRows(60);
    place(mountPager({ key: 'other', noun: 'rows', rows: other.rows, units: other.units }));
    expect(screen.getByText('rows 1–25 of 60')).toBeInTheDocument();
  });

  test('a stored page beyond the end is clamped and written back', () => {
    tablePages.set('usage', 900);
    const { rows, units } = makeRows(60);
    place(mountPager({ key: 'usage', noun: 'rows', rows, units }));
    expect(screen.getByText('rows 51–60 of 60')).toBeInTheDocument();
    expect(tablePages.first('usage')).toBe(50);
  });

  test('changing the size in one pager pages both, keeping the page of the first row shown', async () => {
    const user = userEvent.setup();
    preferences.pageSize = 10;
    const left = makeRows(120);
    const right = makeRows(120);
    place(mountPager({ key: 'usage', noun: 'rows', rows: left.rows, units: left.units }));
    place(mountPager({ key: 'other', noun: 'rows', rows: right.rows, units: right.units }));
    const [leftNext, rightNext] = screen.getAllByRole('button', { name: 'Next ›' }) as HTMLElement[];
    await user.click(leftNext as HTMLElement);
    for (let turn = 0; turn < 3; turn += 1) await user.click(rightNext as HTMLElement);
    await user.selectOptions(screen.getAllByRole('combobox')[0] as HTMLElement, '25');
    expect(preferences.pageSize).toBe(25);
    expect(localStorage.getItem('claude-usage.page_size')).toBe('25');
    expect(hidden(left.rows)).toEqual(range(25, 120));
    expect(hidden(right.rows)).toEqual([...range(0, 25), ...range(50, 120)]);
    expect(screen.getAllByRole<HTMLSelectElement>('combobox').map((select) => select.value)).toEqual(['25', '25']);
  });
});

describe('a pager without rows', () => {
  test('it draws and pages, with nothing to mark off the page', async () => {
    const user = userEvent.setup();
    const units = pageUnits(Array.from({ length: 60 }, () => false));
    place(mountPager({ key: 'usage', noun: 'rows', units }));
    expect(screen.getByText('rows 1–25 of 60')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Next ›' }));
    expect(screen.getByText('rows 26–50 of 60')).toBeInTheDocument();
    expect(tablePages.first('usage')).toBe(25);
  });
});

describe('releaseDetachedPagers', () => {
  test('a pager that is in the page stays mounted and reacts', async () => {
    const { rows, units } = makeRows(120);
    const pager = place(mountPager({ key: 'usage', noun: 'rows', rows, units }));
    releaseDetachedPagers();
    preferences.pageSize = 50;
    flushSync();
    expect(pager.isConnected).toBe(true);
    expect(screen.getByText('rows 1–50 of 120')).toBeInTheDocument();
    expect(hidden(rows)).toEqual(range(50, 120));
  });

  test('a pager that is not in the page is unmounted: its element is gone and its rows stop following', () => {
    const { rows, units } = makeRows(120);
    const pager = mountPager({ key: 'usage', noun: 'rows', rows, units });
    const holder = pager.parentElement;
    expect(holder).not.toBeNull();
    releaseDetachedPagers();
    expect(holder?.contains(pager)).toBe(false);
    const before = hidden(rows);
    preferences.pageSize = 50;
    flushSync();
    expect(hidden(rows)).toEqual(before);
    expect(before).toEqual(range(25, 120));
  });

  test('it unmounts only the detached ones, also after one was moved out of its holder and removed', () => {
    const kept = makeRows(120);
    const moved = makeRows(120);
    const dropped = makeRows(120);
    const keptPager = place(mountPager({ key: 'usage', noun: 'rows', rows: kept.rows, units: kept.units }));
    const movedPager = place(mountPager({ key: 'other', noun: 'rows', rows: moved.rows, units: moved.units }));
    mountPager({ key: 'cards', noun: 'rows', rows: dropped.rows, units: dropped.units });
    movedPager.remove();
    releaseDetachedPagers();
    preferences.pageSize = 50;
    flushSync();
    expect(hidden(kept.rows)).toEqual(range(50, 120));
    expect(hidden(moved.rows)).toEqual(range(25, 120));
    expect(hidden(dropped.rows)).toEqual(range(25, 120));
    expect(keptPager.isConnected).toBe(true);
    // the moved one's element is gone from everywhere it was: a second release has nothing left to do
    expect(movedPager.isConnected).toBe(false);
    expect(() => releaseDetachedPagers()).not.toThrow();
  });

  test('unmounting takes a pager out of the detached element it was moved into', () => {
    const { rows, units } = makeRows(120);
    const pager = mountPager({ key: 'usage', noun: 'rows', rows, units });
    const titleRow = document.createElement('div');
    titleRow.append(pager);
    releaseDetachedPagers();
    expect(titleRow.contains(pager)).toBe(false);
    expect(titleRow.childElementCount).toBe(0);
  });

  test('a pager is unmounted once: a second release does nothing more', () => {
    const { rows, units } = makeRows(120);
    mountPager({ key: 'usage', noun: 'rows', rows, units });
    releaseDetachedPagers();
    expect(() => releaseDetachedPagers()).not.toThrow();
  });
});
