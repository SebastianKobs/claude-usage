// The charts' maths: scales and ticks, where a point or a column falls, the time axis, the by-model chart's series and
// stacks, the rate-limit counts and windows, and the cost per session's split. Plain functions with no state and no
// drawing (the components draw the SVG), so the components share them and each is tested.
// Sizes and the current moment come in as arguments; the page's own values are the defaults or the caller's.
import type { Effort, Slot } from './colors.ts';
import {
  BACKGROUND_EFFORT,
  SLOT_COUNT,
  effortHatch,
  effortName,
  effortRank,
  effortShade,
  hatchTurn,
  modelSlots,
} from './colors.ts';
import { dayText, longDay, longHour, parseDay, shortDay, shortHour, when } from '../ui/format.ts';

// --- scales ---------------------------------------------------------------------------------------------------

/** The input side of a usage: new input, cache writes and cache reads, as a call's context counts. */
export function inputTotal(row: { new_input: number; cache_write: number; cache_read: number }): number {
  return row.new_input + row.cache_write + row.cache_read;
}

/** The top of an axis for a value: 1, 2, 2.5 or 5 times a power of ten, else the next power. 1 for nothing. */
export function niceMax(value: number): number {
  if (value <= 0) return 1;
  const power = Math.pow(10, Math.floor(Math.log10(value)));
  for (const step of [1, 2, 2.5, 5, 10]) {
    if (value <= step * power) return step * power;
  }
  return 10 * power;
}

/** 0, max / steps, ..., max: the values the gridlines sit at. */
export function ticks(max: number, steps: number): number[] {
  return Array.from({ length: steps + 1 }, (_, index) => (max * index) / steps);
}

/** The top of the rate-limit chart's axis: counts are whole and so is the middle gridline: an even top, at least 2. */
export function limitTop(peak: number): number {
  return Math.max(2, Math.ceil(niceMax(peak) / 2) * 2);
}

/** Where the points of a line fall: evenly from `left` to `right`, a single one in the middle. */
export function lineX(count: number, left: number, right: number): (index: number) => number {
  const last = count - 1;
  return (index) => (last > 0 ? left + ((right - left) * index) / last : (left + right) / 2);
}

/** The point of an evenly spaced line an x is nearest to; 0 for a single one. */
export function nearestIndex(left: number, right: number, count: number): (x: number) => number {
  return (x) => (count > 1 ? Math.round(((x - left) / (right - left)) * (count - 1)) : 0);
}

/** The column whose band an x falls in. */
export function bandIndex(left: number, band: number): (x: number) => number {
  return (x) => Math.floor((x - left) / band);
}

/** A column's width: 60 % of its band, between 2 and `widest`. */
export function columnWidth(band: number, widest = 24): number {
  return Math.max(2, Math.min(widest, band * 0.6));
}

/** A column's outline from its bottom left, the top corners rounded by `corner` (less where narrower or lower). */
export function columnPath(x: number, y: number, width: number, height: number, rounded: boolean, corner = 4): string {
  const radius = rounded ? Math.min(corner, width / 2, height) : 0;
  return (
    `M${x},${y + height}V${y + radius}` +
    (radius
      ? `Q${x},${y} ${x + radius},${y}H${x + width - radius}Q${x + width},${y} ${x + width},${y + radius}`
      : `H${x + width}`) +
    `V${y + height}Z`
  );
}

/** The index of the largest value, the first of equals; -1 for none. */
export function peakIndex(values: readonly number[]): number {
  return values.indexOf(Math.max(...values));
}

// --- the time axis --------------------------------------------------------------------------------------------

/** The days from `since` to `now`, as the store writes them. */
export function daysSince(since: string, now: Date = new Date()): string[] {
  const days: string[] = [];
  for (const day = parseDay(since); day <= now; day.setDate(day.getDate() + 1)) {
    days.push(dayText(day));
  }
  return days;
}

/** The time axis of the over-time charts: its keys, and how to name and read them. */
export interface TimeBuckets {
  keys: string[];
  unit: 'day' | 'hour';
  /** The table view's first column. */
  heading: string;
  short(key: string): string;
  long(key: string): string;
  /** The bucket of a row that has a `day` or an `hour`, by the axis' unit. */
  keyOf(row: { day?: string; hour?: string }): string;
}

/** The range's days, or for one day (today by default) its hours from midnight up to now, as a single day would be one
 *  point. A day shown that is not today gets all 24. */
export function timeBuckets(
  summary: { days: number; since: string; hour_model?: unknown },
  now: Date = new Date(),
): TimeBuckets {
  if (summary.days !== 1 || !summary.hour_model) {
    return {
      keys: daysSince(summary.since, now),
      unit: 'day',
      heading: 'Day',
      short: shortDay,
      long: longDay,
      keyOf: (row) => row.day ?? '',
    };
  }
  const lastHour = summary.since === dayText(now) ? now.getHours() : 23;
  const keys: string[] = [];
  for (let hour = 0; hour <= lastHour; hour += 1) keys.push(`${summary.since}T${String(hour).padStart(2, '0')}`);
  return { keys, unit: 'hour', heading: 'Hour', short: shortHour, long: longHour, keyOf: (row) => row.hour ?? '' };
}

/** The cost, input and output of a bucket. */
export interface BucketTotals {
  cost: number;
  input: number;
  output: number;
}

/** What a bucket holds when no row is in it. */
export const NO_USAGE: Readonly<BucketTotals> = { cost: 0, input: 0, output: 0 };

/** The usage a bucket's totals are summed from. */
interface UsageRow {
  cost: number | null;
  output: number;
  new_input: number;
  cache_write: number;
  cache_read: number;
}

/** The rows' cost, input and output summed per bucket. */
export function bucketTotals<Row extends UsageRow>(
  rows: readonly Row[],
  keyOf: (row: Row) => string,
): Map<string, BucketTotals> {
  const totals = new Map<string, BucketTotals>();
  for (const row of rows) {
    const key = keyOf(row);
    const bucket = totals.get(key) ?? { cost: 0, input: 0, output: 0 };
    bucket.cost += row.cost || 0;
    bucket.input += inputTotal(row);
    bucket.output += row.output;
    totals.set(key, bucket);
  }
  return totals;
}

// --- the by-model chart ---------------------------------------------------------------------------------------

/** One stacked series: a model at an effort level, its color and hatch, and its value per bucket. */
export interface Series {
  key: string;
  /** The model's name, "Other" where it is past the palette's slots. */
  model: string;
  effort: Effort;
  slot: Slot;
  color: string;
  hatch: string | null;
  turn: number | null;
  values: Map<string, number>;
}

/** A row of the by-model chart's data: a model's usage at an effort level in a bucket. */
interface ModelEffortRow {
  model: string;
  effort: string | null;
}

/** The series of the columns, one per model and effort level. A model keeps its color slot ("Other" past the eighth),
 *  its effort levels are shades of it, in stack order: models in slot order, within one the background calls and calls
 *  without a level first, as they wear the model's own color, then low to max. */
export function chartSeries<Row extends ModelEffortRow>(
  rows: readonly Row[],
  keyOf: (row: Row) => string,
  value: (row: Row) => number,
): Series[] {
  const slots = modelSlots([...new Set(rows.map((row) => row.model))]);
  const bySeries = new Map<string, Series>();
  for (const row of rows) {
    const slot = slots.get(row.model) ?? null;
    const model = slot === null ? 'Other' : row.model;
    const key = `${model} · ${effortName(row.effort)}`;
    let entry = bySeries.get(key);
    if (!entry) {
      entry = {
        key,
        model,
        effort: row.effort,
        slot,
        color: effortShade(slot, row.effort),
        hatch: effortHatch(slot, row.effort),
        turn: hatchTurn(row.effort),
        values: new Map(),
      };
      bySeries.set(key, entry);
    }
    const bucket = keyOf(row);
    entry.values.set(bucket, (entry.values.get(bucket) ?? 0) + value(row));
  }
  const effortOrder = (effort: Effort): number =>
    effort === BACKGROUND_EFFORT ? -2 : effort === null || effort === undefined ? -1 : effortRank(effort);
  return [...bySeries.values()].sort(
    (left, right) =>
      (left.slot ?? SLOT_COUNT) - (right.slot ?? SLOT_COUNT) ||
      left.model.localeCompare(right.model) ||
      effortOrder(left.effort) - effortOrder(right.effort) ||
      String(left.effort).localeCompare(String(right.effort)),
  );
}

/** A model and its series, in stack order. */
export interface ModelGroup<T> {
  model: string;
  entries: T[];
}

/** The series grouped by model: neighbours of one model together, in the order given. */
export function modelGroups<T extends { model: string }>(series: readonly T[]): ModelGroup<T>[] {
  const groups: ModelGroup<T>[] = [];
  for (const entry of series) {
    let group = groups[groups.length - 1];
    if (group?.model !== entry.model) {
      group = { model: entry.model, entries: [] };
      groups.push(group);
    }
    group.entries.push(entry);
  }
  return groups;
}

/** The series' sum per bucket, in the order of `keys`. */
export function columnTotals(series: readonly Series[], keys: readonly string[]): number[] {
  return keys.map((key) => series.reduce((sum, entry) => sum + (entry.values.get(key) ?? 0), 0));
}

/** A segment of a stacked column: where it starts, how high it is drawn, and whether it is the column's last. */
export interface Segment {
  /** The segment's place among the heights given. */
  position: number;
  y: number;
  height: number;
  /** The topmost of the column, which gets the rounded data end. */
  top: boolean;
}

/** The segments of a column stacked upward from `floor` (the plot's bottom), each of `heights` (bottom first) and of
 *  the model at the same place in `models`. Each segment but the first leaves a gap to the one below, `gap` within a
 *  model and `modelGap` between models (shades of two models can come close); a segment no higher than its gap is
 *  drawn whole, without one. */
export function stackSegments(
  models: readonly string[],
  heights: readonly number[],
  floor: number,
  gap = 2,
  modelGap = 4,
): Segment[] {
  const segments: Segment[] = [];
  let base = floor;
  heights.forEach((height, position) => {
    const wanted = position === 0 ? 0 : models[position - 1] === models[position] ? gap : modelGap;
    const drawn = height - (height > wanted ? wanted : 0);
    if (drawn > 0) segments.push({ position, y: base - height, height: drawn, top: position === heights.length - 1 });
    base -= height;
  });
  return segments;
}

// --- rate limits ----------------------------------------------------------------------------------------------

/** The error kind of a rate limit, which the dashboard plots in the status color. */
const RATE_LIMIT = 'rate_limit';

/** The mark before a rate limit's words, so its color never carries it alone. */
export const LIMIT_ICON = '⚠';

const LIMIT_TYPES: Readonly<Record<string, string>> = {
  five_hour: '5-hour limit',
  seven_day: 'weekly limit',
  seven_day_opus: 'weekly Opus limit',
};

/** A quota's name: "5-hour limit", an unknown one with its underscores spaced, an en dash for none. */
export function limitType(type: string | null): string {
  if (!type) return '–';
  return Object.hasOwn(LIMIT_TYPES, type) ? (LIMIT_TYPES[type] ?? type) : type.replaceAll('_', ' ');
}

/** A failed call's error in words, with its status: "⚠ Rate limit (429)", "server error (500)". */
export function errorText(event: { error: string; status: number | null }): string {
  const status = event.status ? ` (${event.status})` : '';
  if (event.error === RATE_LIMIT) return `${LIMIT_ICON} Rate limit${status}`;
  return `${event.error.replaceAll('_', ' ')}${status}`;
}

/** The failed calls in a bucket: rate-limit hits, and all other errors. */
export interface LimitCount {
  limits: number;
  other: number;
}

/** The error counts per bucket, the rate limits apart from the rest; a bucket without any has none. */
export function limitCounts<Row extends { error: string; count: number }>(
  rows: readonly Row[],
  keyOf: (row: Row) => string,
): (key: string) => LimitCount {
  const counts = new Map<string, LimitCount>();
  for (const row of rows) {
    const key = keyOf(row);
    const bucket = counts.get(key) ?? { limits: 0, other: 0 };
    if (row.error === RATE_LIMIT) bucket.limits += row.count;
    else bucket.other += row.count;
    counts.set(key, bucket);
  }
  return (key) => counts.get(key) ?? { limits: 0, other: 0 };
}

/** How long a window ran before its first hit, in milliseconds. */
export function windowHitAfter(window: { start: string; first_hit: string }): number {
  return Date.parse(window.first_hit) - Date.parse(window.start);
}

/** "Sep 28, 10:00 AM – 03:00 PM", the reset's day only where it isn't the start's. */
export function windowSpan(window: { start: string; resets_at: string }, locale?: string): string {
  const start = new Date(window.start);
  const end = new Date(window.resets_at);
  const endText =
    start.toDateString() === end.toDateString()
      ? end.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })
      : when(window.resets_at, locale);
  return `${when(window.start, locale)} – ${endText}`;
}

// --- cost per session -----------------------------------------------------------------------------------------

/** A session's cost in the two parts of its bar: cache reads from the baseline, then everything else. */
export function costSplit(session: { cost: number | null; cost_parts: { cache_read: number } }): {
  cacheRead: number;
  rest: number;
} {
  const cacheRead = session.cost_parts.cache_read;
  return { cacheRead, rest: Math.max(0, (session.cost || 0) - cacheRead) };
}

/** The cost the bars are measured against: the dearest session's, 1 where none cost anything. */
export function costTop(sessions: readonly { cost: number | null }[]): number {
  return Math.max(0, ...sessions.map((session) => session.cost || 0)) || 1;
}

/** A bar's length as a share of the longest, in percent. */
export function barShare(cost: number | null, top: number): number {
  return (100 * (cost || 0)) / top;
}
