import { describe, expect, test } from 'vitest';
import { summary } from './fixtures.ts';
import { RANGES, dayLabel, dayStep, rangeDays, rangeQuery, shownDay, visibleRanges } from './range.ts';

describe('RANGES', () => {
  test('are daily, a week, a month, a quarter and a year, shortest first', () => {
    expect(RANGES.map((range) => [range.days, range.label])).toEqual([
      [1, 'Daily'],
      [7, '7 days'],
      [30, '30 days'],
      [90, '90 days'],
      [365, '1 year'],
    ]);
  });
});

describe('rangeDays', () => {
  test.each([1, 7, 30, 90, 365])('keeps %i', (days) => {
    expect(rangeDays(days)).toBe(days);
  });

  test.each([0, 2, 31, -7, Number.NaN])('drops %s', (days) => {
    expect(rangeDays(days)).toBeNull();
  });
});

describe('visibleRanges', () => {
  test('stop at the retention', () => {
    expect(visibleRanges(30).map((range) => range.days)).toEqual([1, 7, 30]);
    expect(visibleRanges(7).map((range) => range.days)).toEqual([1, 7]);
    expect(visibleRanges(90).map((range) => range.days)).toEqual([1, 7, 30, 90]);
  });

  test('include a range as long as the retention', () => {
    expect(visibleRanges(365).map((range) => range.days)).toEqual([1, 7, 30, 90, 365]);
  });

  test('are all of them for a store that keeps everything, or before a summary is loaded', () => {
    expect(visibleRanges(0)).toBe(RANGES);
    expect(visibleRanges(null)).toBe(RANGES);
    expect(visibleRanges(undefined)).toBe(RANGES);
  });
});

describe('rangeQuery', () => {
  test('names the day only for a single day', () => {
    expect(rangeQuery(1, '2026-09-28')).toBe('days=1&until=2026-09-28');
    expect(rangeQuery(1, null)).toBe('days=1');
    expect(rangeQuery(7, '2026-09-28')).toBe('days=7');
    expect(rangeQuery(7, null)).toBe('days=7');
  });
});

describe('shownDay', () => {
  const today = '2026-09-30';
  const daily = summary({ days: 1, since: today, until: today });

  test('is the summary of today while the day follows today', () => {
    expect(shownDay(daily, null, today)).toBe(daily);
  });

  test('is the summary of the day picked', () => {
    const earlier = summary({ days: 1, since: '2026-09-28', until: '2026-09-28' });
    expect(shownDay(earlier, '2026-09-28', today)).toBe(earlier);
  });

  test('is null while another day is loading', () => {
    expect(shownDay(daily, '2026-09-28', today)).toBeNull();
    expect(shownDay(daily, null, '2026-10-01')).toBeNull();
  });

  test('is null for a summary of several days, or none', () => {
    expect(shownDay(summary({ days: 7, until: today }), null, today)).toBeNull();
    expect(shownDay(null, null, today)).toBeNull();
  });
});

describe('dayLabel', () => {
  test('is Today for the day that follows today', () => {
    expect(dayLabel(null)).toBe('Today');
  });

  test('is the day in full otherwise', () => {
    expect(dayLabel('2026-09-28')).toBe('Mon, Sep 28');
  });
});

describe('dayStep', () => {
  const today = '2026-09-30';
  const shown = summary({ days: 1, until: '2026-09-28', previous_day: '2026-09-25', next_day: today });

  test('goes to the nearest day with usage', () => {
    expect(dayStep(shown, 'previous_day', today)).toBe('2026-09-25');
  });

  test('goes back to following today, not to the date', () => {
    expect(dayStep(shown, 'next_day', today)).toBeNull();
  });

  test('goes to a day after today as it is', () => {
    expect(dayStep(shown, 'next_day', '2026-09-29')).toBe('2026-09-30');
  });

  test('has nowhere to go without a neighbour, or before the day is loaded', () => {
    expect(dayStep(summary({ days: 1, previous_day: null }), 'previous_day', today)).toBeUndefined();
    expect(dayStep(null, 'next_day', today)).toBeUndefined();
  });
});
