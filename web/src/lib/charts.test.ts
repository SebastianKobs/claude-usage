import { expect, test } from 'vitest';
import {
  barShare,
  bandIndex,
  bucketTotals,
  chartSeries,
  columnPath,
  columnTotals,
  columnWidth,
  costSplit,
  costTop,
  errorText,
  inputTotal,
  lineX,
  limitCounts,
  limitTop,
  limitType,
  modelGroups,
  nearestIndex,
  niceMax,
  NO_USAGE,
  peakIndex,
  rangeDays,
  stackSegments,
  ticks,
  timeBuckets,
  windowHitAfter,
  windowSpan,
} from './charts.ts';

const EN = 'en-US';
const local = (...parts: [number, number, number, number?, number?]): Date => new Date(...parts);
const iso = (...parts: [number, number, number, number?, number?]): string => local(...parts).toISOString();

test('the input side of a usage is new input, cache writes and cache reads', () => {
  expect(inputTotal({ new_input: 1, cache_write: 20, cache_read: 300 })).toBe(321);
});

test('an axis tops out at 1, 2, 2.5 or 5 times a power of ten', () => {
  const cases: [number, number][] = [
    [0, 1],
    [-5, 1],
    [1, 1],
    [1.1, 2],
    [2, 2],
    [2.1, 2.5],
    [2.6, 5],
    [5.1, 10],
    [10, 10],
    [99, 100],
    [1234, 2000],
    [2100, 2500],
    [0.03, 0.05],
  ];
  for (const [value, top] of cases) expect(niceMax(value), `niceMax(${value})`).toBe(top);
});

test('the gridlines sit at equal steps from 0 to the top', () => {
  expect(ticks(10, 4)).toEqual([0, 2.5, 5, 7.5, 10]);
  expect(ticks(2, 2)).toEqual([0, 1, 2]);
  expect(ticks(5, 1)).toEqual([0, 5]);
});

test('the rate-limit axis tops out at an even count of at least 2', () => {
  expect([0, 1, 2, 3, 10, 12].map(limitTop)).toEqual([2, 2, 2, 6, 10, 20]);
  // whole middle gridline: half the top is a whole number
  for (const peak of [0, 1, 2, 3, 4, 5, 7, 9, 11, 40]) expect(limitTop(peak) % 2).toBe(0);
});

test('the points of a line spread evenly, a single one in the middle', () => {
  const x = lineX(5, 100, 500);
  expect([0, 1, 4].map(x)).toEqual([100, 200, 500]);
  expect(lineX(1, 100, 500)(0)).toBe(300);
  expect(lineX(0, 100, 500)(0)).toBe(300);
});

test('a line picks the nearest point, a single one always', () => {
  const at = nearestIndex(100, 500, 5);
  expect([100, 149, 151, 500].map(at)).toEqual([0, 0, 1, 4]);
  expect(nearestIndex(100, 500, 1)(400)).toBe(0);
});

test('columns own their band', () => {
  const at = bandIndex(56, 10);
  expect([56, 65.9, 66, 105].map(at)).toEqual([0, 0, 1, 4]);
});

test('a column takes 60 % of its band, between 2 and the widest', () => {
  expect(columnWidth(10)).toBe(6);
  expect(columnWidth(2)).toBe(2);
  expect(columnWidth(100)).toBe(24);
  expect(columnWidth(100, 30)).toBe(30);
});

test('a column is drawn from its bottom, the top corners rounded only for the top one', () => {
  expect(columnPath(10, 20, 8, 30, false)).toBe('M10,50V20H18V50Z');
  expect(columnPath(10, 20, 8, 30, true)).toBe('M10,50V24Q10,20 14,20H14Q18,20 18,24V50Z');
});

test('a corner is never rounder than half the column or its height', () => {
  expect(columnPath(0, 0, 4, 30, true)).toBe('M0,30V2Q0,0 2,0H2Q4,0 4,2V30Z');
  expect(columnPath(0, 0, 8, 1, true)).toBe('M0,1V1Q0,0 1,0H7Q8,0 8,1V1Z');
  expect(columnPath(0, 0, 8, 30, true, 2)).toBe('M0,30V2Q0,0 2,0H6Q8,0 8,2V30Z');
});

test('the peak is the first largest value, -1 without any', () => {
  expect(peakIndex([1, 5, 5, 2])).toBe(1);
  expect(peakIndex([0, 0])).toBe(0);
  expect(peakIndex([])).toBe(-1);
});

test('the range is every local day from its start up to now', () => {
  expect(rangeDays('2026-09-28', local(2026, 8, 30, 12))).toEqual(['2026-09-28', '2026-09-29', '2026-09-30']);
  expect(rangeDays('2026-09-30', local(2026, 8, 30, 0, 1))).toEqual(['2026-09-30']);
  expect(rangeDays('2026-10-01', local(2026, 8, 30, 12))).toEqual([]);
});

test('the range crosses a month and a year', () => {
  expect(rangeDays('2026-12-30', local(2027, 0, 2, 9))).toEqual([
    '2026-12-30',
    '2026-12-31',
    '2027-01-01',
    '2027-01-02',
  ]);
});

test('several days are plotted by day', () => {
  const buckets = timeBuckets({ days: 7, since: '2026-09-24', hour_model: [] }, local(2026, 8, 30, 12));
  expect(buckets.unit).toBe('day');
  expect(buckets.heading).toBe('Day');
  expect(buckets.keys).toHaveLength(7);
  expect(buckets.keys[0]).toBe('2026-09-24');
  expect(buckets.short('2026-09-30')).toBe('Sep 30');
  expect(buckets.keyOf({ day: '2026-09-30', hour: '2026-09-30T04' })).toBe('2026-09-30');
});

test('one day is plotted by hour, from midnight up to now for today', () => {
  const buckets = timeBuckets({ days: 1, since: '2026-09-30', hour_model: [] }, local(2026, 8, 30, 14, 30));
  expect(buckets.unit).toBe('hour');
  expect(buckets.heading).toBe('Hour');
  expect(buckets.keys).toHaveLength(15);
  expect([buckets.keys[0], buckets.keys[14]]).toEqual(['2026-09-30T00', '2026-09-30T14']);
  expect(buckets.keyOf({ day: '2026-09-30', hour: '2026-09-30T04' })).toBe('2026-09-30T04');
  expect(buckets.long('2026-09-30T14')).toContain('–');
});

test('an earlier day is plotted by hour, all 24', () => {
  const buckets = timeBuckets({ days: 1, since: '2026-09-29', hour_model: [] }, local(2026, 8, 30, 14));
  expect(buckets.keys).toHaveLength(24);
  expect(buckets.keys[23]).toBe('2026-09-29T23');
});

test('the first hour of the day has its own bucket', () => {
  const buckets = timeBuckets({ days: 1, since: '2026-09-30', hour_model: [] }, local(2026, 8, 30, 0, 5));
  expect(buckets.keys).toEqual(['2026-09-30T00']);
});

test('one day without hourly rows falls back to the day', () => {
  const buckets = timeBuckets({ days: 1, since: '2026-09-30' }, local(2026, 8, 30, 14));
  expect(buckets.unit).toBe('day');
  expect(buckets.keys).toEqual(['2026-09-30']);
});

test('the totals per bucket add cost, input and output, a missing cost as 0', () => {
  const row = (day: string, cost: number | null, output: number) => ({
    day,
    cost,
    output,
    new_input: 1,
    cache_write: 10,
    cache_read: 100,
  });
  const totals = bucketTotals([row('a', 1.5, 5), row('b', null, 7), row('a', 0.5, 3)], (entry) => entry.day);
  expect(totals.get('a')).toEqual({ cost: 2, input: 222, output: 8 });
  expect(totals.get('b')).toEqual({ cost: 0, input: 111, output: 7 });
  expect(totals.get('c')).toBeUndefined();
  expect(NO_USAGE).toEqual({ cost: 0, input: 0, output: 0 });
});

interface Row {
  day: string;
  model: string;
  effort: string | null;
  value: number;
}
const row = (model: string, effort: string | null, day: string, value: number): Row => ({ day, model, effort, value });
const seriesOf = (rows: Row[]) =>
  chartSeries(
    rows,
    (entry) => entry.day,
    (entry) => entry.value,
  );

test('the series come in stack order: models by slot, in one the levels low to max', () => {
  const series = seriesOf([
    row('claude-sonnet-5', 'max', 'd1', 1),
    row('claude-opus-5-5', 'high', 'd1', 1),
    row('claude-sonnet-5', 'low', 'd1', 1),
    row('claude-opus-5-5', 'low', 'd1', 1),
    row('claude-opus-5-5', 'xhigh', 'd1', 1),
  ]);
  expect(series.map((entry) => entry.key)).toEqual([
    'claude-opus-5-5 · effort low',
    'claude-opus-5-5 · effort high',
    'claude-opus-5-5 · effort xhigh',
    'claude-sonnet-5 · effort low',
    'claude-sonnet-5 · effort max',
  ]);
});

test('background calls and calls without a level come first in their model, they wear its own color', () => {
  const series = seriesOf([
    row('claude-opus-5-5', 'low', 'd1', 1),
    row('claude-opus-5-5', null, 'd1', 1),
    row('claude-opus-5-5', 'background', 'd1', 1),
  ]);
  expect(series.map((entry) => entry.effort)).toEqual(['background', null, 'low']);
  expect(series[0]?.color).toBe(series[2]?.color);
  expect(series[0]?.hatch).not.toBeNull();
  expect(series[0]?.turn).toBe(-45);
  expect(series[1]?.hatch).toBeNull();
  expect(series[1]?.turn).toBeNull();
});

test('ultracode shares max\'s shade, hatched the other way round', () => {
  const [max, ultra] = seriesOf([row('claude-opus-5-5', 'ultracode', 'd1', 1), row('claude-opus-5-5', 'max', 'd1', 1)]);
  expect(max?.effort).toBe('max');
  expect(ultra?.effort).toBe('ultracode');
  expect(ultra?.color).toBe(max?.color);
  expect(max?.hatch).toBeNull();
  expect(ultra?.hatch).not.toBeNull();
  expect(ultra?.turn).toBe(45);
});

test('the values of a series add up per bucket', () => {
  const [series] = seriesOf([
    row('claude-opus-5-5', 'low', 'd1', 2),
    row('claude-opus-5-5', 'low', 'd2', 3),
    row('claude-opus-5-5', 'low', 'd1', 4),
  ]);
  expect([...(series?.values ?? [])]).toEqual([
    ['d1', 6],
    ['d2', 3],
  ]);
});

test('a model past the eighth slot is folded into "Other", its series adding up', () => {
  const models = Array.from({ length: 10 }, (_, index) => `model-${String(index).padStart(2, '0')}`);
  const series = seriesOf(models.map((model) => row(model, 'high', 'd1', 1)));
  expect(series).toHaveLength(9);
  const other = series[8];
  expect(other?.model).toBe('Other');
  expect(other?.slot).toBeNull();
  expect(other?.key).toBe('Other · effort high');
  expect(other?.values.get('d1')).toBe(2);
});

test('an unknown model gets a free slot and keeps it whatever else is in the range', () => {
  const alone = seriesOf([row('zzz', 'low', 'd1', 1)]);
  const beside = seriesOf([row('claude-opus-5-5', 'low', 'd1', 1), row('zzz', 'low', 'd1', 1)]);
  expect(alone[0]?.slot).toBe(0);
  expect(beside.find((entry) => entry.model === 'zzz')?.slot).toBe(1);
});

test('the series of one model are grouped, in the order given', () => {
  const series = seriesOf([
    row('claude-opus-5-5', 'low', 'd1', 1),
    row('claude-opus-5-5', 'high', 'd1', 1),
    row('claude-sonnet-5', 'low', 'd1', 1),
  ]);
  const groups = modelGroups(series);
  expect(groups.map((group) => [group.model, group.entries.length])).toEqual([
    ['claude-opus-5-5', 2],
    ['claude-sonnet-5', 1],
  ]);
  expect(modelGroups([])).toEqual([]);
  // only neighbours group: the order is the caller's
  const neighbours = modelGroups([{ model: 'a' }, { model: 'b' }, { model: 'a' }]);
  expect(neighbours.map((group) => group.model)).toEqual(['a', 'b', 'a']);
});

test('a column is the sum of its series, 0 for a bucket none has', () => {
  const series = seriesOf([
    row('claude-opus-5-5', 'low', 'd1', 2),
    row('claude-sonnet-5', 'low', 'd1', 3),
    row('claude-sonnet-5', 'low', 'd2', 4),
  ]);
  expect(columnTotals(series, ['d1', 'd2', 'd3'])).toEqual([5, 4, 0]);
});

test('a stack leaves a gap of 2 within a model and 4 between models, none under the first segment', () => {
  const segments = stackSegments(['a', 'a', 'b'], [10, 10, 10], 100);
  expect(segments).toEqual([
    { position: 0, y: 90, height: 10, top: false },
    { position: 1, y: 80, height: 8, top: false },
    { position: 2, y: 70, height: 6, top: true },
  ]);
});

test('a stack takes its gaps as given', () => {
  expect(stackSegments(['a', 'a'], [10, 10], 100, 3, 5)[1]).toEqual({ position: 1, y: 80, height: 7, top: true });
  expect(stackSegments(['a', 'b'], [10, 10], 100, 3, 5)[1]).toEqual({ position: 1, y: 80, height: 5, top: true });
});

test('a segment no higher than its gap is drawn whole, and every segment still stacks on the one below', () => {
  const segments = stackSegments(['a', 'b', 'b'], [10, 3, 10], 100);
  expect(segments[1]).toEqual({ position: 1, y: 87, height: 3, top: false });
  expect(segments[2]).toEqual({ position: 2, y: 77, height: 8, top: true });
  // exactly as high as the gap: drawn whole too
  expect(stackSegments(['a', 'b'], [10, 4], 100)[1]).toEqual({ position: 1, y: 86, height: 4, top: true });
});

test('an empty segment is not drawn, the top one is the last that was asked for', () => {
  expect(stackSegments(['a', 'a'], [0, 10], 100)).toEqual([{ position: 1, y: 90, height: 8, top: true }]);
  expect(stackSegments([], [], 100)).toEqual([]);
});

test('a quota has its name, an unknown one its words, none a dash', () => {
  expect(limitType('five_hour')).toBe('5-hour limit');
  expect(limitType('seven_day')).toBe('weekly limit');
  expect(limitType('seven_day_opus')).toBe('weekly Opus limit');
  expect(limitType('seven_day_sonnet')).toBe('seven day sonnet');
  expect(limitType(null)).toBe('–');
  expect(limitType('')).toBe('–');
});

test('a quota named like an object property is not looked up in the prototype', () => {
  expect(limitType('constructor')).toBe('constructor');
  expect(limitType('toString')).toBe('toString');
  expect(limitType('hasOwnProperty')).toBe('hasOwnProperty');
});

test('an error reads as words with its status, a rate limit with its mark', () => {
  expect(errorText({ error: 'rate_limit', status: 429 })).toBe('⚠ Rate limit (429)');
  expect(errorText({ error: 'rate_limit', status: null })).toBe('⚠ Rate limit');
  expect(errorText({ error: 'server_error', status: 500 })).toBe('server error (500)');
  expect(errorText({ error: 'invalid_request', status: null })).toBe('invalid request');
});

test('the error counts split the rate limits from the rest, per bucket', () => {
  const at = limitCounts(
    [
      { day: 'd1', error: 'rate_limit', count: 2 },
      { day: 'd1', error: 'server_error', count: 1 },
      { day: 'd1', error: 'rate_limit', count: 3 },
      { day: 'd2', error: 'overloaded_error', count: 4 },
    ],
    (entry) => entry.day,
  );
  expect(at('d1')).toEqual({ limits: 5, other: 1 });
  expect(at('d2')).toEqual({ limits: 0, other: 4 });
  expect(at('d3')).toEqual({ limits: 0, other: 0 });
});

test('a bucket without errors is a fresh count, which the caller may not change for everyone', () => {
  const at = limitCounts([], (entry: { error: string; count: number }) => entry.error);
  expect(at('x')).not.toBe(at('x'));
});

const WINDOW = {
  start: '2026-09-01T12:00:00.000+00:00',
  first_hit: '2026-09-01T15:12:00.000+00:00',
  resets_at: '2026-09-01T17:00:00.000+00:00',
};

test('a window is hit after the time from its start to its first hit', () => {
  expect(windowHitAfter(WINDOW)).toBe((3 * 60 + 12) * 60 * 1000);
});

test('a window that ends on its start day names the end as a time only', () => {
  const window = { start: iso(2026, 8, 28, 10), resets_at: iso(2026, 8, 28, 15) };
  expect(windowSpan(window, EN)).toBe('Sep 28, 10:00 AM – 03:00 PM');
});

test('a window that ends on another day names that day too', () => {
  const window = { start: iso(2026, 8, 28, 22), resets_at: iso(2026, 8, 29, 3) };
  expect(windowSpan(window, EN)).toBe('Sep 28, 10:00 PM – Sep 29, 03:00 AM');
});

test('a session\'s bar is cache reads, then everything else, never below nothing', () => {
  expect(costSplit({ cost: 10, cost_parts: { cache_read: 6 } })).toEqual({ cacheRead: 6, rest: 4 });
  expect(costSplit({ cost: null, cost_parts: { cache_read: 0 } })).toEqual({ cacheRead: 0, rest: 0 });
  // rounding can put the parts a hair over the total
  expect(costSplit({ cost: 1, cost_parts: { cache_read: 1.0000001 } }).rest).toBe(0);
});

test('the bars are measured against the dearest session, 1 where none cost anything', () => {
  expect(costTop([{ cost: 2 }, { cost: 8 }, { cost: null }])).toBe(8);
  expect(costTop([{ cost: 0 }, { cost: null }])).toBe(1);
  expect(costTop([])).toBe(1);
});

test('a bar is its share of the longest in percent', () => {
  expect(barShare(2, 8)).toBe(25);
  expect(barShare(8, 8)).toBe(100);
  expect(barShare(null, 8)).toBe(0);
});
