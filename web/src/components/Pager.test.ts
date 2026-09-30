import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { flushSync } from 'svelte';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { tablePages } from '../lib/paging.svelte';
import { preferences } from '../lib/prefs.svelte';
import { keepScroll, scrollAnchor } from '../lib/scroll';
import { pageUnits } from '../lib/tables';
import Pager from './Pager.svelte';

// The scroll helpers are tested on their own; here only that a pager calls them around what it changes.
vi.mock('../lib/scroll', () => ({ scrollAnchor: vi.fn(() => null), keepScroll: vi.fn() }));

const KEYS = ['usage', 'cards', 'other'];

/** `count` detached rows, sub-row where `subRows` says so, and their units. */
function makeRows(count: number, subRows: number[] = []) {
  const rows = Array.from({ length: count }, () => document.createElement('tr'));
  const units = pageUnits(rows.map((_row, index) => subRows.includes(index)));
  return { rows, units };
}

/** The indexes of the rows the class off-page hides. */
function hidden(rows: HTMLElement[]): number[] {
  return rows.flatMap((row, index) => (row.classList.contains('off-page') ? [index] : []));
}

/** The indexes from `first` up to, not including, `last`. */
function range(first: number, last: number): number[] {
  return Array.from({ length: last - first }, (_unused, index) => first + index);
}

function status(): string {
  return screen.getByText(/ of \d+$/).textContent ?? '';
}

beforeEach(() => {
  localStorage.clear();
  preferences.pageSize = 25;
  vi.mocked(scrollAnchor).mockClear();
  vi.mocked(keepScroll).mockClear();
});

afterEach(() => {
  for (const key of KEYS) tablePages.forget(key);
  preferences.pageSize = 25;
  localStorage.clear();
});

describe('what the pager shows', () => {
  test('a group named Pages with the controls, their ids made of the key', () => {
    const { rows, units } = makeRows(60);
    render(Pager, { key: 'usage', noun: 'rows', rows, units });
    const pager = screen.getByRole('group', { name: 'Pages' });
    expect(pager).toHaveClass('pager');
    expect(screen.getByRole('combobox', { name: 'Rows per page' }).id).toBe('pager-usage-size');
    expect(screen.getByRole('button', { name: '‹ Previous' }).id).toBe('pager-usage-previous');
    expect(screen.getByRole('button', { name: 'Next ›' }).id).toBe('pager-usage-next');
  });

  test('the status counts the rows shown in the noun, politely announced', () => {
    const { rows, units } = makeRows(60);
    render(Pager, { key: 'usage', noun: 'rows', rows, units });
    expect(screen.getByText('rows 1–25 of 60')).toHaveAttribute('aria-live', 'polite');
    expect(screen.getByText('rows 1–25 of 60')).toHaveClass('muted');
  });

  test('a grid of cards says its noun, also in the size control', () => {
    const { rows, units } = makeRows(300);
    preferences.pageSize = 10;
    render(Pager, { key: 'cards', noun: 'sessions', rows, units });
    expect(screen.getByText('sessions 1–10 of 300')).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: 'Sessions per page' })).toBeInTheDocument();
    expect(screen.getAllByRole('option').map((option) => option.textContent)).toEqual([
      '10 sessions',
      '25 sessions',
      '50 sessions',
    ]);
  });

  test.each([10, 25, 50])('the size control follows the preference of %i', (size) => {
    const { rows, units } = makeRows(120);
    preferences.pageSize = size;
    render(Pager, { key: 'usage', noun: 'rows', rows, units });
    expect(screen.getByRole<HTMLSelectElement>('combobox').value).toBe(String(size));
  });

  test('the rows of the first page show and the others are off the page, by class and never hidden', () => {
    const { rows, units } = makeRows(60);
    render(Pager, { key: 'usage', noun: 'rows', rows, units });
    expect(hidden(rows)).toEqual(range(25, 60));
    expect(rows.some((row) => row.hidden)).toBe(false);
  });
});

describe('turning the page', () => {
  test('next shows the next rows and previous the ones before', async () => {
    const user = userEvent.setup();
    const { rows, units } = makeRows(60);
    render(Pager, { key: 'usage', noun: 'rows', rows, units });
    await user.click(screen.getByRole('button', { name: 'Next ›' }));
    expect(status()).toBe('rows 26–50 of 60');
    expect(hidden(rows)).toEqual([...range(0, 25), ...range(50, 60)]);
    await user.click(screen.getByRole('button', { name: 'Next ›' }));
    expect(status()).toBe('rows 51–60 of 60');
    expect(hidden(rows)).toEqual(range(0, 50));
    await user.click(screen.getByRole('button', { name: '‹ Previous' }));
    expect(status()).toBe('rows 26–50 of 60');
    expect(hidden(rows)).toEqual([...range(0, 25), ...range(50, 60)]);
  });

  test('previous is disabled on the first page and next on the last', async () => {
    const user = userEvent.setup();
    const { rows, units } = makeRows(60);
    render(Pager, { key: 'usage', noun: 'rows', rows, units });
    const previous = screen.getByRole('button', { name: '‹ Previous' });
    const next = screen.getByRole('button', { name: 'Next ›' });
    expect([previous.hasAttribute('disabled'), next.hasAttribute('disabled')]).toEqual([true, false]);
    await user.click(next);
    expect([previous.hasAttribute('disabled'), next.hasAttribute('disabled')]).toEqual([false, false]);
    await user.click(next);
    expect([previous.hasAttribute('disabled'), next.hasAttribute('disabled')]).toEqual([false, true]);
  });

  test('a sub-row stays with the row above it at a page edge', async () => {
    const user = userEvent.setup();
    // rows 10 and 11 are sub-rows of row 9, the last of the first page of 10 units
    const { rows, units } = makeRows(40, [10, 11]);
    preferences.pageSize = 10;
    render(Pager, { key: 'usage', noun: 'rows', rows, units });
    expect(units[9]).toBe(9);
    expect(units.slice(9, 13)).toEqual([9, 9, 9, 10]);
    expect(hidden(rows)).toEqual(range(12, 40));
    await user.click(screen.getByRole('button', { name: 'Next ›' }));
    expect(hidden(rows)).toEqual([...range(0, 12), ...range(22, 40)]);
    // the status counts units, not rows: 38 of them
    expect(status()).toBe('rows 11–20 of 38');
  });

  test('turning keeps the reader in place around the change', async () => {
    const user = userEvent.setup();
    const anchor = { node: document.createElement('div'), top: 12 };
    const seen: string[] = [];
    vi.mocked(scrollAnchor).mockImplementation((nodes) => {
      // noted before the page changes
      seen.push(status());
      expect([...nodes].map((node) => node.className)).toEqual(['pager']);
      return anchor;
    });
    const { rows, units } = makeRows(60);
    render(Pager, { key: 'usage', noun: 'rows', rows, units });
    await user.click(screen.getByRole('button', { name: 'Next ›' }));
    expect(seen).toEqual(['rows 1–25 of 60']);
    expect(keepScroll).toHaveBeenCalledExactlyOnceWith(anchor, screen.getByRole('group', { name: 'Pages' }));
    vi.mocked(scrollAnchor).mockImplementation(() => null);
  });
});

describe('the page size', () => {
  test('changing it sets and saves the preference and pages again', async () => {
    const user = userEvent.setup();
    const { rows, units } = makeRows(120);
    render(Pager, { key: 'usage', noun: 'rows', rows, units });
    await user.selectOptions(screen.getByRole('combobox'), '50');
    expect(preferences.pageSize).toBe(50);
    expect(localStorage.getItem('claude-usage.page_size')).toBe('50');
    expect(status()).toBe('rows 1–50 of 120');
    expect(hidden(rows)).toEqual(range(50, 120));
  });

  test.each([
    { name: 'page 2 of 10 (first unit 10) at 25 is page 0', size: 10, page: 1, to: 25, text: 'rows 1–25 of 120' },
    { name: 'page 4 of 10 (unit 30) at 25 is page 1', size: 10, page: 3, to: 25, text: 'rows 26–50 of 120' },
    { name: 'first unit 50 at 25 is page 2', size: 25, page: 2, to: 10, text: 'rows 51–60 of 120' },
  ])('the page holding the first row shown stays: $name', async ({ size, page, to, text }) => {
    const user = userEvent.setup();
    const { rows, units } = makeRows(120);
    preferences.pageSize = size;
    render(Pager, { key: 'usage', noun: 'rows', rows, units });
    for (let turned = 0; turned < page; turned += 1) {
      await user.click(screen.getByRole('button', { name: 'Next ›' }));
    }
    await user.selectOptions(screen.getByRole('combobox'), String(to));
    expect(status()).toBe(text);
  });

  test('every pager on the page follows, each keeping its own first row', async () => {
    const user = userEvent.setup();
    const left = makeRows(120);
    const right = makeRows(120);
    preferences.pageSize = 10;
    render(Pager, { key: 'usage', noun: 'rows', rows: left.rows, units: left.units });
    render(Pager, { key: 'other', noun: 'rows', rows: right.rows, units: right.units });
    const [leftNext, rightNext] = screen.getAllByRole('button', { name: 'Next ›' });
    await user.click(leftNext as HTMLElement);
    await user.click(rightNext as HTMLElement);
    await user.click(rightNext as HTMLElement);
    await user.click(rightNext as HTMLElement);
    const [leftSize] = screen.getAllByRole('combobox');
    await user.selectOptions(leftSize as HTMLElement, '25');
    expect(screen.getAllByRole<HTMLSelectElement>('combobox').map((select) => select.value)).toEqual(['25', '25']);
    // left started at unit 10 (page 0 of 25), right at unit 30 (page 1)
    expect(screen.getByText('rows 1–25 of 120')).toBeInTheDocument();
    expect(screen.getByText('rows 26–50 of 120')).toBeInTheDocument();
    expect(hidden(left.rows)).toEqual(range(25, 120));
    expect(hidden(right.rows)).toEqual([...range(0, 25), ...range(50, 120)]);
  });

  test('the pager that changed is kept in place on the screen', async () => {
    const user = userEvent.setup();
    const anchor = { node: document.createElement('div'), top: 3 };
    vi.mocked(scrollAnchor).mockReturnValue(anchor);
    const { rows, units } = makeRows(120);
    render(Pager, { key: 'usage', noun: 'rows', rows, units });
    await user.selectOptions(screen.getByRole('combobox'), '10');
    expect(scrollAnchor).toHaveBeenCalledOnce();
    expect(keepScroll).toHaveBeenCalledExactlyOnceWith(anchor, screen.getByRole('group', { name: 'Pages' }));
    vi.mocked(scrollAnchor).mockImplementation(() => null);
  });
});

describe('the page kept across draws', () => {
  test('a pager drawn again with the same key is on the page it was on, another key starts at the first', async () => {
    const user = userEvent.setup();
    const first = makeRows(60);
    const { unmount } = render(Pager, { key: 'usage', noun: 'rows', rows: first.rows, units: first.units });
    await user.click(screen.getByRole('button', { name: 'Next ›' }));
    unmount();
    const again = makeRows(60);
    render(Pager, { key: 'usage', noun: 'rows', rows: again.rows, units: again.units });
    expect(status()).toBe('rows 26–50 of 60');
    expect(hidden(again.rows)).toEqual([...range(0, 25), ...range(50, 60)]);
    const other = makeRows(60);
    render(Pager, { key: 'other', noun: 'rows', rows: other.rows, units: other.units });
    expect(screen.getByText('rows 1–25 of 60')).toBeInTheDocument();
    expect(hidden(other.rows)).toEqual(range(25, 60));
  });

  test('a stored page beyond the end is clamped to the last page and stored so', () => {
    tablePages.set('usage', 500);
    const { rows, units } = makeRows(60);
    render(Pager, { key: 'usage', noun: 'rows', rows, units });
    expect(status()).toBe('rows 51–60 of 60');
    expect(tablePages.first('usage')).toBe(50);
    expect(hidden(rows)).toEqual(range(0, 50));
  });

  test('a stored page that is already right is left as it is', () => {
    tablePages.set('usage', 25);
    const { rows, units } = makeRows(60);
    render(Pager, { key: 'usage', noun: 'rows', rows, units });
    expect(tablePages.first('usage')).toBe(25);
  });

  test('rows replaced under a pager already drawn page again', () => {
    const { rows, units } = makeRows(60);
    const { rerender } = render(Pager, { key: 'usage', noun: 'rows', rows, units });
    const more = makeRows(90);
    void rerender({ key: 'usage', noun: 'rows', rows: more.rows, units: more.units });
    flushSync();
    expect(status()).toBe('rows 1–25 of 90');
    expect(hidden(more.rows)).toEqual(range(25, 90));
  });
});

describe('a pager without rows', () => {
  test('a table a component draws hands over none: the pager still pages and stores the page', async () => {
    const user = userEvent.setup();
    const { units } = makeRows(60);
    render(Pager, { key: 'usage', noun: 'rows', units });
    expect(status()).toBe('rows 1–25 of 60');
    await user.click(screen.getByRole('button', { name: 'Next ›' }));
    expect(status()).toBe('rows 26–50 of 60');
    expect(tablePages.first('usage')).toBe(25);
  });

  test('a stored page beyond the end is clamped and stored, as with rows', () => {
    tablePages.set('usage', 500);
    const { units } = makeRows(60);
    render(Pager, { key: 'usage', noun: 'rows', units });
    expect(status()).toBe('rows 51–60 of 60');
    expect(tablePages.first('usage')).toBe(50);
  });

  test('the page size change pages it again', async () => {
    const user = userEvent.setup();
    const { units } = makeRows(120);
    render(Pager, { key: 'usage', noun: 'rows', units });
    await user.selectOptions(screen.getByRole('combobox'), '50');
    expect(status()).toBe('rows 1–50 of 120');
  });
});
