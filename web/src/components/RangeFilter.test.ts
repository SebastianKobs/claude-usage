import { render, screen, within } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { flushSync } from 'svelte';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { summary } from '../lib/fixtures';
import { payload, setPayload } from '../lib/payload.svelte';
import { readPreference } from '../lib/prefs.svelte';
import { range } from '../lib/range.svelte';
import RangeFilter from './RangeFilter.svelte';

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
  range.reset();
  payload.reset();
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(new Date(2026, 8, 30, 12));
});

afterEach(() => {
  vi.useRealTimers();
  localStorage.clear();
  range.reset();
  payload.reset();
});

describe('the ranges on offer', () => {
  test('are all five before a summary is loaded', () => {
    render(RangeFilter);
    expect(screen.getByText('Range')).toHaveClass('label');
    expect(rangeButtons()).toEqual(['Daily', '7 days', '30 days', '90 days', '1 year']);
  });

  test('stop at the retention', () => {
    setPayload({ summary: summary({ retention_days: 30 }) });
    render(RangeFilter);
    expect(rangeButtons()).toEqual(['Daily', '7 days', '30 days']);
  });

  test('are all of them for a store that keeps everything', () => {
    setPayload({ summary: summary({ retention_days: 0 }) });
    render(RangeFilter);
    expect(rangeButtons()).toHaveLength(5);
  });

  test('keep their buttons when the retention arrives late', () => {
    render(RangeFilter);
    const week = screen.getByRole('button', { name: '7 days' });
    setPayload({ summary: summary({ retention_days: 30 }) });
    expect(screen.getByRole('button', { name: '7 days' })).toBe(week);
    expect(screen.queryByRole('button', { name: '1 year' })).toBeNull();
  });
});

describe('a range button', () => {
  test('is pressed for the range shown', () => {
    render(RangeFilter);
    expect(screen.getByRole('button', { name: '30 days' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: '7 days' })).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByRole('button', { name: 'Daily' })).toHaveAttribute('aria-pressed', 'false');
  });

  test('selects its range, saves it, reloads once and returns the Daily range to today', async () => {
    const onchange = vi.fn();
    range.onchange = onchange;
    render(RangeFilter);
    await userEvent.click(screen.getByRole('button', { name: '7 days' }));
    expect(range.days).toBe(7);
    expect(range.day).toBeNull();
    expect(readPreference('days')).toBe('7');
    expect(onchange).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('button', { name: '7 days' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: '30 days' })).toHaveAttribute('aria-pressed', 'false');
  });

  test('reloads again where it is pressed already', async () => {
    const onchange = vi.fn();
    range.onchange = onchange;
    render(RangeFilter);
    await userEvent.click(screen.getByRole('button', { name: '30 days' }));
    expect(onchange).toHaveBeenCalledTimes(1);
    expect(range.days).toBe(30);
  });

  test('keeps its node across selections', async () => {
    render(RangeFilter);
    const week = screen.getByRole('button', { name: '7 days' });
    await userEvent.click(week);
    await userEvent.click(screen.getByRole('button', { name: 'Daily' }));
    await userEvent.click(screen.getByRole('button', { name: '90 days' }));
    expect(screen.getByRole('button', { name: '7 days' })).toBe(week);
  });
});

describe('the day navigation', () => {
  test('shows only while Daily is pressed, right after its button', () => {
    render(RangeFilter);
    expect(screen.queryByRole('group', { name: 'Day' })).toBeNull();
    range.select(1);
    flushSync();
    const nav = screen.getByRole('group', { name: 'Day' });
    expect(nav).toHaveClass('day-nav');
    expect(nav.previousElementSibling).toBe(screen.getByRole('button', { name: 'Daily' }));
    expect(nav.nextElementSibling).toBe(screen.getByRole('button', { name: '7 days' }));
    range.select(7);
    flushSync();
    expect(screen.queryByRole('group', { name: 'Day' })).toBeNull();
  });

  test('keeps the Daily button when it shows', () => {
    render(RangeFilter);
    const daily = screen.getByRole('button', { name: 'Daily' });
    range.select(1);
    flushSync();
    expect(screen.getByRole('button', { name: 'Daily' })).toBe(daily);
  });

  test('says Today for the day that follows today, else the day in full', () => {
    range.select(1);
    render(RangeFilter);
    const label = within(screen.getByRole('group', { name: 'Day' })).getByRole('status');
    expect(label).toHaveTextContent('Today');
    setPayload({ summary: today() });
    range.step('previous_day', payload.summary);
    flushSync();
    expect(label).toHaveTextContent('Mon, Sep 28');
  });

  test('has a label that is a polite live region', () => {
    range.select(1);
    render(RangeFilter);
    expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'polite');
    expect(screen.getByRole('status').tagName).toBe('OUTPUT');
  });

  test('disables its arrows without a summary', () => {
    range.select(1);
    render(RangeFilter);
    expect(screen.getByRole('button', { name: 'Previous day' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Next day' })).toBeDisabled();
  });

  test('disables its arrows with a summary of another day, which is still loading', () => {
    range.select(1);
    const loaded = { days: 1, since: '2026-09-27', until: '2026-09-27' };
    setPayload({ summary: summary({ ...loaded, previous_day: '2026-09-25', next_day: '2026-09-29' }) });
    render(RangeFilter);
    expect(screen.getByRole('button', { name: 'Previous day' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Next day' })).toBeDisabled();
  });

  test('disables the arrow where there is no neighbour', () => {
    range.select(1);
    setPayload({ summary: today() });
    render(RangeFilter);
    expect(screen.getByRole('button', { name: 'Previous day' })).toBeEnabled();
    expect(screen.getByRole('button', { name: 'Next day' })).toBeDisabled();
  });

  test('enables both arrows with neighbours', () => {
    range.select(1);
    setPayload({ summary: summary({ days: 1, until: TODAY, previous_day: '2026-09-25', next_day: '2026-09-29' }) });
    render(RangeFilter);
    expect(screen.getByRole('button', { name: 'Previous day' })).toBeEnabled();
    expect(screen.getByRole('button', { name: 'Next day' })).toBeEnabled();
  });

  test('goes to the previous day with usage and reloads', async () => {
    const onchange = vi.fn();
    range.select(1);
    setPayload({ summary: today() });
    render(RangeFilter);
    range.onchange = onchange;
    await userEvent.click(screen.getByRole('button', { name: 'Previous day' }));
    expect(range.day).toBe('2026-09-28');
    expect(onchange).toHaveBeenCalledTimes(1);
  });

  test('goes from an earlier day to following today', async () => {
    const onchange = vi.fn();
    range.select(1);
    range.step('previous_day', today());
    setPayload({
      summary: summary({ days: 1, since: '2026-09-28', until: '2026-09-28', previous_day: null, next_day: TODAY }),
    });
    render(RangeFilter);
    range.onchange = onchange;
    await userEvent.click(screen.getByRole('button', { name: 'Next day' }));
    expect(range.day).toBeNull();
    expect(onchange).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('status')).toHaveTextContent('Today');
  });
});
