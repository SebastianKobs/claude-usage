import { screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { flushSync } from 'svelte';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { pagePerTest } from '../lib/app.testing';
import { keepScroll, scrollAnchor } from '../lib/scroll';
import { pageUnits } from '../lib/tables';
import Pager from './Pager.svelte';

const host = pagePerTest();

// The scroll helpers are tested on their own; here only that a pager calls them around what it changes.
vi.mock('../lib/scroll', () => ({ scrollAnchor: vi.fn(() => null), keepScroll: vi.fn() }));

const KEYS = ['usage', 'cards', 'other'];

/** The units of `count` rows, a sub-row (stays with the row above it) where `subRows` says so. */
function makeUnits(count: number, subRows: number[] = []) {
  return { units: pageUnits(Array.from({ length: count }, (_row, index) => subRows.includes(index))) };
}

function status(): string {
  return screen.getByText(/ of \d+$/).textContent ?? '';
}

beforeEach(() => {
  localStorage.clear();
  host.app.preferences.pageSize = 25;
  vi.mocked(scrollAnchor).mockClear();
  vi.mocked(keepScroll).mockClear();
});

afterEach(() => {
  for (const key of KEYS) host.app.pages.forget(key);
  host.app.preferences.pageSize = 25;
  localStorage.clear();
});

describe('what the pager shows', () => {
  test('a group named Pages with the controls, their ids made of the key', () => {
    const { units } = makeUnits(60);
    host.render(Pager, { key: 'usage', noun: 'rows', units });
    const pager = screen.getByRole('group', { name: 'Pages' });
    expect(pager).toHaveClass('pager');
    expect(screen.getByRole('combobox', { name: 'Rows per page' }).id).toBe('pager-usage-size');
    expect(screen.getByRole('button', { name: '‹ Previous' }).id).toBe('pager-usage-previous');
    expect(screen.getByRole('button', { name: 'Next ›' }).id).toBe('pager-usage-next');
  });

  test('the status counts the rows shown in the noun, politely announced', () => {
    const { units } = makeUnits(60);
    host.render(Pager, { key: 'usage', noun: 'rows', units });
    expect(screen.getByText('rows 1–25 of 60')).toHaveAttribute('aria-live', 'polite');
    expect(screen.getByText('rows 1–25 of 60')).toHaveClass('muted');
  });

  test('a grid of cards says its noun, also in the size control', () => {
    const { units } = makeUnits(300);
    host.app.preferences.pageSize = 10;
    host.render(Pager, { key: 'cards', noun: 'sessions', units });
    expect(screen.getByText('sessions 1–10 of 300')).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: 'Sessions per page' })).toBeInTheDocument();
    expect(screen.getAllByRole('option').map((option) => option.textContent)).toEqual([
      '10 sessions',
      '25 sessions',
      '50 sessions',
    ]);
  });

  test.each([10, 25, 50])('the size control follows the preference of %i', (size) => {
    const { units } = makeUnits(120);
    host.app.preferences.pageSize = size;
    host.render(Pager, { key: 'usage', noun: 'rows', units });
    expect(screen.getByRole<HTMLSelectElement>('combobox').value).toBe(String(size));
  });

});

describe('turning the page', () => {
  test('next shows the next rows and previous the ones before', async () => {
    const user = userEvent.setup();
    const { units } = makeUnits(60);
    host.render(Pager, { key: 'usage', noun: 'rows', units });
    await user.click(screen.getByRole('button', { name: 'Next ›' }));
    expect(status()).toBe('rows 26–50 of 60');
    await user.click(screen.getByRole('button', { name: 'Next ›' }));
    expect(status()).toBe('rows 51–60 of 60');
    await user.click(screen.getByRole('button', { name: '‹ Previous' }));
    expect(status()).toBe('rows 26–50 of 60');
  });

  test('previous is disabled on the first page and next on the last', async () => {
    const user = userEvent.setup();
    const { units } = makeUnits(60);
    host.render(Pager, { key: 'usage', noun: 'rows', units });
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
    const { units } = makeUnits(40, [10, 11]);
    host.app.preferences.pageSize = 10;
    host.render(Pager, { key: 'usage', noun: 'rows', units });
    expect(units[9]).toBe(9);
    expect(units.slice(9, 13)).toEqual([9, 9, 9, 10]);
    await user.click(screen.getByRole('button', { name: 'Next ›' }));
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
    const { units } = makeUnits(60);
    host.render(Pager, { key: 'usage', noun: 'rows', units });
    await user.click(screen.getByRole('button', { name: 'Next ›' }));
    expect(seen).toEqual(['rows 1–25 of 60']);
    expect(keepScroll).toHaveBeenCalledExactlyOnceWith(anchor, screen.getByRole('group', { name: 'Pages' }));
    vi.mocked(scrollAnchor).mockImplementation(() => null);
  });
});

describe('the page size', () => {
  test('changing it sets and saves the preference and pages again', async () => {
    const user = userEvent.setup();
    const { units } = makeUnits(120);
    host.render(Pager, { key: 'usage', noun: 'rows', units });
    await user.selectOptions(screen.getByRole('combobox'), '50');
    expect(host.app.preferences.pageSize).toBe(50);
    expect(localStorage.getItem('claude-usage.page_size')).toBe('50');
    expect(status()).toBe('rows 1–50 of 120');
  });

  test.each([
    { name: 'page 2 of 10 (first unit 10) at 25 is page 0', size: 10, page: 1, to: 25, text: 'rows 1–25 of 120' },
    { name: 'page 4 of 10 (unit 30) at 25 is page 1', size: 10, page: 3, to: 25, text: 'rows 26–50 of 120' },
    { name: 'first unit 50 at 25 is page 2', size: 25, page: 2, to: 10, text: 'rows 51–60 of 120' },
  ])('the page holding the first row shown stays: $name', async ({ size, page, to, text }) => {
    const user = userEvent.setup();
    const { units } = makeUnits(120);
    host.app.preferences.pageSize = size;
    host.render(Pager, { key: 'usage', noun: 'rows', units });
    for (let turned = 0; turned < page; turned += 1) {
      await user.click(screen.getByRole('button', { name: 'Next ›' }));
    }
    await user.selectOptions(screen.getByRole('combobox'), String(to));
    expect(status()).toBe(text);
  });

  test('every pager on the page follows, each keeping its own first row', async () => {
    const user = userEvent.setup();
    const left = makeUnits(120);
    const right = makeUnits(120);
    host.app.preferences.pageSize = 10;
    host.render(Pager, { key: 'usage', noun: 'rows', units: left.units });
    host.render(Pager, { key: 'other', noun: 'rows', units: right.units });
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
  });

  test('the pager that changed is kept in place on the screen', async () => {
    const user = userEvent.setup();
    const anchor = { node: document.createElement('div'), top: 3 };
    vi.mocked(scrollAnchor).mockReturnValue(anchor);
    const { units } = makeUnits(120);
    host.render(Pager, { key: 'usage', noun: 'rows', units });
    await user.selectOptions(screen.getByRole('combobox'), '10');
    expect(scrollAnchor).toHaveBeenCalledOnce();
    expect(keepScroll).toHaveBeenCalledExactlyOnceWith(anchor, screen.getByRole('group', { name: 'Pages' }));
    vi.mocked(scrollAnchor).mockImplementation(() => null);
  });
});

describe('the page kept across draws', () => {
  test('a pager drawn again with the same key is on the page it was on, another key starts at the first', async () => {
    const user = userEvent.setup();
    const first = makeUnits(60);
    const { unmount } = host.render(Pager, { key: 'usage', noun: 'rows', units: first.units });
    await user.click(screen.getByRole('button', { name: 'Next ›' }));
    unmount();
    const again = makeUnits(60);
    host.render(Pager, { key: 'usage', noun: 'rows', units: again.units });
    expect(status()).toBe('rows 26–50 of 60');
    const other = makeUnits(60);
    host.render(Pager, { key: 'other', noun: 'rows', units: other.units });
    expect(screen.getByText('rows 1–25 of 60')).toBeInTheDocument();
  });

  test('a stored page beyond the end is clamped to the last page and stored so', () => {
    host.app.pages.set('usage', 500);
    const { units } = makeUnits(60);
    host.render(Pager, { key: 'usage', noun: 'rows', units });
    expect(status()).toBe('rows 51–60 of 60');
    expect(host.app.pages.first('usage')).toBe(50);
  });

  test('a stored page that is already right is left as it is', () => {
    host.app.pages.set('usage', 25);
    const { units } = makeUnits(60);
    host.render(Pager, { key: 'usage', noun: 'rows', units });
    expect(host.app.pages.first('usage')).toBe(25);
  });

  test('rows replaced under a pager already drawn page again', () => {
    const { units } = makeUnits(60);
    const { rerender } = host.render(Pager, { key: 'usage', noun: 'rows', units });
    const more = makeUnits(90);
    void rerender({ key: 'usage', noun: 'rows', units: more.units });
    flushSync();
    expect(status()).toBe('rows 1–25 of 90');
  });
});

describe('a pager without rows', () => {
  test('a table a component draws hands over none: the pager still pages and stores the page', async () => {
    const user = userEvent.setup();
    const { units } = makeUnits(60);
    host.render(Pager, { key: 'usage', noun: 'rows', units });
    expect(status()).toBe('rows 1–25 of 60');
    await user.click(screen.getByRole('button', { name: 'Next ›' }));
    expect(status()).toBe('rows 26–50 of 60');
    expect(host.app.pages.first('usage')).toBe(25);
  });

  test('a stored page beyond the end is clamped and stored, as with rows', () => {
    host.app.pages.set('usage', 500);
    const { units } = makeUnits(60);
    host.render(Pager, { key: 'usage', noun: 'rows', units });
    expect(status()).toBe('rows 51–60 of 60');
    expect(host.app.pages.first('usage')).toBe(50);
  });

  test('the page size change pages it again', async () => {
    const user = userEvent.setup();
    const { units } = makeUnits(120);
    host.render(Pager, { key: 'usage', noun: 'rows', units });
    await user.selectOptions(screen.getByRole('combobox'), '50');
    expect(status()).toBe('rows 1–50 of 120');
  });
});
