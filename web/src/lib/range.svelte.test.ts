import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { summary } from './fixtures.ts';
import { readPreference } from './prefs.svelte.ts';
import { RangeState, range } from './range.svelte.ts';

const TODAY = '2026-09-30';

beforeEach(() => {
  localStorage.clear();
  range.reset();
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(new Date(2026, 8, 30, 12));
});

afterEach(() => {
  vi.useRealTimers();
  localStorage.clear();
  range.reset();
});

describe('a new range', () => {
  test('is a month, following today', () => {
    const fresh = new RangeState();
    expect(fresh.days).toBe(30);
    expect(fresh.day).toBeNull();
    expect(fresh.onchange).toBeNull();
  });

  test('is the saved one', () => {
    localStorage.setItem('claude-usage.days', '7');
    expect(new RangeState().days).toBe(7);
  });

  test('is a month where the saved one is none of the ranges', () => {
    localStorage.setItem('claude-usage.days', '12');
    expect(new RangeState().days).toBe(30);
    localStorage.setItem('claude-usage.days', 'soon');
    expect(new RangeState().days).toBe(30);
  });
});

describe('select', () => {
  test('sets the days, saves them and reloads', () => {
    const onchange = vi.fn();
    range.onchange = onchange;
    range.select(90);
    expect(range.days).toBe(90);
    expect(readPreference('days')).toBe('90');
    expect(onchange).toHaveBeenCalledTimes(1);
  });

  test('starts the Daily range at today again', () => {
    range.select(1);
    range.step('previous_day', summary({ days: 1, since: TODAY, until: TODAY, previous_day: '2026-09-28' }));
    expect(range.day).toBe('2026-09-28');
    range.select(1);
    expect(range.day).toBeNull();
  });

  test('reloads for the range shown already', () => {
    const onchange = vi.fn();
    range.onchange = onchange;
    range.select(30);
    range.select(30);
    expect(onchange).toHaveBeenCalledTimes(2);
  });

  test('ignores a length that is none of the ranges', () => {
    const onchange = vi.fn();
    range.onchange = onchange;
    range.select(12);
    expect(range.days).toBe(30);
    expect(readPreference('days')).toBeNull();
    expect(onchange).not.toHaveBeenCalled();
  });

  test('works without a listener', () => {
    expect(() => range.select(7)).not.toThrow();
    expect(range.days).toBe(7);
  });
});

describe('step', () => {
  const shown = summary({
    days: 1,
    since: TODAY,
    until: TODAY,
    previous_day: '2026-09-28',
    next_day: null,
  });

  test('goes to the previous day with usage and reloads', () => {
    const onchange = vi.fn();
    range.onchange = onchange;
    range.step('previous_day', shown);
    expect(range.day).toBe('2026-09-28');
    expect(onchange).toHaveBeenCalledTimes(1);
  });

  test('goes back to following today, not to its date', () => {
    const earlier = summary({ days: 1, since: '2026-09-28', until: '2026-09-28', next_day: TODAY });
    range.step('previous_day', shown);
    range.step('next_day', earlier);
    expect(range.day).toBeNull();
  });

  test('does nothing without a neighbour', () => {
    const onchange = vi.fn();
    range.onchange = onchange;
    range.step('next_day', shown);
    expect(range.day).toBeNull();
    expect(onchange).not.toHaveBeenCalled();
  });

  test('does nothing while another day is loading, or without a summary', () => {
    const onchange = vi.fn();
    range.onchange = onchange;
    const other = summary({ days: 1, since: '2026-09-27', until: '2026-09-27', previous_day: '2026-09-25' });
    range.step('previous_day', other);
    range.step('previous_day', null);
    expect(range.day).toBeNull();
    expect(onchange).not.toHaveBeenCalled();
  });
});

describe('fit', () => {
  test('cuts the range to the days the summary covers, and saves it without reloading', () => {
    const onchange = vi.fn();
    range.onchange = onchange;
    range.fit(summary({ days: 7 }));
    expect(range.days).toBe(7);
    expect(readPreference('days')).toBe('7');
    expect(onchange).not.toHaveBeenCalled();
  });

  test('leaves a range the summary covers whole', () => {
    range.fit(summary({ days: 30 }));
    range.fit(summary({ days: 90 }));
    expect(range.days).toBe(30);
    expect(readPreference('days')).toBeNull();
  });
});

describe('reset', () => {
  test('goes back to the saved range, today and no listener', () => {
    range.onchange = vi.fn();
    range.select(1);
    range.step('previous_day', summary({ days: 1, since: TODAY, until: TODAY, previous_day: '2026-09-28' }));
    localStorage.clear();
    range.reset();
    expect(range.days).toBe(30);
    expect(range.day).toBeNull();
    expect(range.onchange).toBeNull();
  });
});
