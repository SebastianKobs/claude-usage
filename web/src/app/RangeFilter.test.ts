import { render, screen, within } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { flushSync } from 'svelte';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { pagePerTest } from './app.testing';
import { summary } from '../api/fixtures';
import { readPreference } from './prefs.svelte';
import RangeFilter from './RangeFilter.svelte';

const page = pagePerTest();

const TODAY = '2026-09-30';

/** The range buttons' texts, in order, the day's arrows left out. */
function rangeButtons(): string[] {
  return screen
    .getAllByRole('button')
    .filter((button) => !button.closest('.day-nav'))
    .map((button) => button.textContent?.trim() ?? '');
}

function today(): ReturnType<typeof summary> {
  return summary({ days: 1, since: TODAY, until: TODAY, previous_day: '2026-09-28', next_day: null });
}

beforeEach(() => {
  localStorage.clear();
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(new Date(2026, 8, 30, 12));
});

afterEach(() => {
  vi.useRealTimers();
  localStorage.clear();
});

describe('the ranges on offer', () => {
  test('are all five before a summary is loaded', () => {
    page.render(RangeFilter);
    expect(screen.getByText('Range')).toHaveClass('label');
    expect(rangeButtons()).toEqual(['Daily', '7 days', '30 days', '90 days', '1 year']);
  });

  test('stop at the retention', () => {
    page.set({ summary: summary({ retention_days: 30 }) });
    page.render(RangeFilter);
    expect(rangeButtons()).toEqual(['Daily', '7 days', '30 days']);
  });

  test('are all of them for a store that keeps everything', () => {
    page.set({ summary: summary({ retention_days: 0 }) });
    page.render(RangeFilter);
    expect(rangeButtons()).toHaveLength(5);
  });

  test('keep their buttons when the retention arrives late', () => {
    page.render(RangeFilter);
    const week = screen.getByRole('button', { name: '7 days' });
    page.set({ summary: summary({ retention_days: 30 }) });
    expect(screen.getByRole('button', { name: '7 days' })).toBe(week);
    expect(screen.queryByRole('button', { name: '1 year' })).toBeNull();
  });
});

describe('a range button', () => {
  test('is pressed for the range shown', () => {
    page.render(RangeFilter);
    expect(screen.getByRole('button', { name: '30 days' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: '7 days' })).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByRole('button', { name: 'Daily' })).toHaveAttribute('aria-pressed', 'false');
  });

  test('selects its range, saves it, reloads once and returns the Daily range to today', async () => {
    const onchange = vi.fn();
    page.app.range.onchange = onchange;
    page.render(RangeFilter);
    await userEvent.click(screen.getByRole('button', { name: '7 days' }));
    expect(page.app.range.days).toBe(7);
    expect(page.app.range.day).toBeNull();
    expect(readPreference('days')).toBe('7');
    expect(onchange).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('button', { name: '7 days' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: '30 days' })).toHaveAttribute('aria-pressed', 'false');
  });

  test('reloads again where it is pressed already', async () => {
    const onchange = vi.fn();
    page.app.range.onchange = onchange;
    page.render(RangeFilter);
    await userEvent.click(screen.getByRole('button', { name: '30 days' }));
    expect(onchange).toHaveBeenCalledTimes(1);
    expect(page.app.range.days).toBe(30);
  });

  test('keeps its node across selections', async () => {
    page.render(RangeFilter);
    const week = screen.getByRole('button', { name: '7 days' });
    await userEvent.click(week);
    await userEvent.click(screen.getByRole('button', { name: 'Daily' }));
    await userEvent.click(screen.getByRole('button', { name: '90 days' }));
    expect(screen.getByRole('button', { name: '7 days' })).toBe(week);
  });
});

describe('the day navigation', () => {
  test('shows only while Daily is pressed, right after its button', () => {
    page.render(RangeFilter);
    expect(screen.queryByRole('group', { name: 'Day' })).toBeNull();
    page.app.range.select(1);
    flushSync();
    const nav = screen.getByRole('group', { name: 'Day' });
    expect(nav).toHaveClass('day-nav');
    expect(nav.previousElementSibling).toBe(screen.getByRole('button', { name: 'Daily' }));
    expect(nav.nextElementSibling).toBe(screen.getByRole('button', { name: '7 days' }));
    page.app.range.select(7);
    flushSync();
    expect(screen.queryByRole('group', { name: 'Day' })).toBeNull();
  });

  test('keeps the Daily button when it shows', () => {
    page.render(RangeFilter);
    const daily = screen.getByRole('button', { name: 'Daily' });
    page.app.range.select(1);
    flushSync();
    expect(screen.getByRole('button', { name: 'Daily' })).toBe(daily);
  });

  test('says Today for the day that follows today, else the day in full', () => {
    page.app.range.select(1);
    page.render(RangeFilter);
    const label = within(screen.getByRole('group', { name: 'Day' })).getByRole('status');
    expect(label).toHaveTextContent('Today');
    page.set({ summary: today() });
    page.app.range.step('previous_day', page.app.payload.summary);
    flushSync();
    expect(label).toHaveTextContent('Mon, Sep 28');
  });

  test('has a label that is a polite live region', () => {
    page.app.range.select(1);
    page.render(RangeFilter);
    expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'polite');
    expect(screen.getByRole('status').tagName).toBe('OUTPUT');
  });

  test('disables its arrows without a summary', () => {
    page.app.range.select(1);
    page.render(RangeFilter);
    expect(screen.getByRole('button', { name: 'Previous day' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Next day' })).toBeDisabled();
  });

  test('disables its arrows with a summary of another day, which is still loading', () => {
    page.app.range.select(1);
    const loaded = { days: 1, since: '2026-09-27', until: '2026-09-27' };
    page.set({ summary: summary({ ...loaded, previous_day: '2026-09-25', next_day: '2026-09-29' }) });
    page.render(RangeFilter);
    expect(screen.getByRole('button', { name: 'Previous day' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Next day' })).toBeDisabled();
  });

  test('disables the arrow where there is no neighbour', () => {
    page.app.range.select(1);
    page.set({ summary: today() });
    page.render(RangeFilter);
    expect(screen.getByRole('button', { name: 'Previous day' })).toBeEnabled();
    expect(screen.getByRole('button', { name: 'Next day' })).toBeDisabled();
  });

  test('enables both arrows with neighbours', () => {
    page.app.range.select(1);
    page.set({ summary: summary({ days: 1, until: TODAY, previous_day: '2026-09-25', next_day: '2026-09-29' }) });
    page.render(RangeFilter);
    expect(screen.getByRole('button', { name: 'Previous day' })).toBeEnabled();
    expect(screen.getByRole('button', { name: 'Next day' })).toBeEnabled();
  });

  test('goes to the previous day with usage and reloads', async () => {
    const onchange = vi.fn();
    page.app.range.select(1);
    page.set({ summary: today() });
    page.render(RangeFilter);
    page.app.range.onchange = onchange;
    await userEvent.click(screen.getByRole('button', { name: 'Previous day' }));
    expect(page.app.range.day).toBe('2026-09-28');
    expect(onchange).toHaveBeenCalledTimes(1);
  });

  test('goes from an earlier day to following today', async () => {
    const onchange = vi.fn();
    page.app.range.select(1);
    page.app.range.step('previous_day', today());
    page.set({
      summary: summary({ days: 1, since: '2026-09-28', until: '2026-09-28', previous_day: null, next_day: TODAY }),
    });
    page.render(RangeFilter);
    page.app.range.onchange = onchange;
    await userEvent.click(screen.getByRole('button', { name: 'Next day' }));
    expect(page.app.range.day).toBeNull();
    expect(onchange).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('status')).toHaveTextContent('Today');
  });
});
