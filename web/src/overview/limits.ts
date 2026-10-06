// What the rate-limits section draws: one column of hits per day (or hour) in the status color, and the words around
// it (the note, the labels, the tooltip, the table view), then the rows of the 5-hour windows that hit a limit and of
// the latest failed calls. Plain functions, so the components only draw them.
//
// A rate limit is a state, not a category, so it wears the reserved critical status color rather than a series slot;
// other API errors are rarer and go into the tooltip, the table view and the list, not a second color.

import type { ApiErrorEvent, LimitWindow, Summary } from '../api/api';
import { columnGeometry } from './modelchart';
import { AXIS_BAND, LEFT_AXIS } from '../charts/chartkit';
import type { TimeBuckets } from '../charts/charts';
import {
  errorText,
  limitCounts,
  limitTop,
  limitType,
  peakIndex,
  timeBuckets,
  windowHitAfter,
  windowSpan,
} from '../charts/charts';
import { sessionHref, sessionName } from './costly';
import { duration, when, whole } from '../ui/format';
import { byCost, usageCells } from '../ui/tables';

/** The plot's height, the drawing's (the plot and the x labels' band), and the color of the hits. */
export const LIMIT_PLOT = 120;
export const LIMIT_CHART_HEIGHT = LIMIT_PLOT + AXIS_BAND;
export const LIMIT_COLOR = 'var(--status-critical)';

/** The chart's data: the time axis, the hits and the other errors in each bucket, and what the axis needs. */
export interface LimitChart {
  buckets: TimeBuckets;
  limits: number[];
  others: number[];
  total: number;
  /** The axis' top: counts are whole, and so is the middle gridline. */
  top: number;
  /** The bucket with the most hits, which carries the value label; null where there are no hits. */
  peak: number | null;
  /** Whether there is neither a rate limit nor another error in the range. */
  empty: boolean;
}

/** The failed calls of the range's days, or for one day its hours. */
export function limitsOf(summary: Summary, now: Date = new Date()): LimitChart {
  const buckets = timeBuckets(summary, now);
  const rows = buckets.unit === 'hour' ? summary.api_errors.hour : summary.api_errors.day;
  // The rows are days or hours by the axis' unit, which `keyOf` reads whichever it is.
  const at = limitCounts<{ day?: string; hour?: string; error: string; count: number }>(rows, buckets.keyOf);
  const limits = buckets.keys.map((key) => at(key).limits);
  const others = buckets.keys.map((key) => at(key).other);
  const total = limits.reduce((sum, value) => sum + value, 0);
  const peak = peakIndex(limits);
  return {
    buckets,
    limits,
    others,
    total,
    top: limitTop(Math.max(...limits, 0)),
    peak: limits[peak] ? peak : null,
    empty: !limits.some(Boolean) && !others.some(Boolean),
  };
}

/** A bucket's column in a drawing `width` wide: its left edge, top and size, scaled to the axis' `top`. */
export function limitBar(
  width: number,
  count: number,
  index: number,
  value: number,
  top: number,
): { x: number; y: number; width: number; height: number } {
  const { band, barWidth } = columnGeometry(width, count);
  const height = (LIMIT_PLOT * value) / top;
  return { x: LEFT_AXIS + band * index + (band - barWidth) / 2, y: LIMIT_PLOT - height, width: barWidth, height };
}

/** What the chart shows, after the heading. */
export function limitNote(unit: TimeBuckets['unit']): string {
  return `rate-limit hits per ${unit}; other API errors are in the tooltip, the table view and the list`;
}

/** The drawing's name for a screen reader. */
export function limitChartLabel(unit: TimeBuckets['unit'], total: number): string {
  return `Rate-limit hits per ${unit}: ${whole(total)} in the range; table view available`;
}

/** The cursor slider's name. */
export function limitCursorLabel(unit: TimeBuckets['unit']): string {
  return `Rate-limit hits per ${unit}; arrow keys step through them`;
}

/** A bucket as the slider reads it: its name and both counts. */
export function limitValueText(chart: LimitChart, index: number): string {
  const name = chart.buckets.long(chart.buckets.keys[index] ?? '');
  return `${name}: ${whole(chart.limits[index])} rate-limit hits, ${whole(chart.others[index])} other API errors`;
}

/** A bucket's tooltip: its name and the two counts. */
export function limitTip(chart: LimitChart, index: number): { when: string; limits: string; others: string } {
  return {
    when: chart.buckets.long(chart.buckets.keys[index] ?? ''),
    limits: whole(chart.limits[index]),
    others: whole(chart.others[index]),
  };
}

/** The table view: a row per bucket, newest first, with the hits and the other errors. */
export function limitTable(chart: LimitChart): {
  head: { label: string; numeric?: boolean }[];
  rows: { key: string; cells: string[] }[];
} {
  const { buckets } = chart;
  return {
    head: [
      { label: buckets.heading },
      { label: 'Rate-limit hits', numeric: true },
      { label: 'Other API errors', numeric: true },
    ],
    rows: buckets.keys
      .map((key, index) => ({
        key,
        cells: [buckets.short(key), whole(chart.limits[index]), whole(chart.others[index])],
      }))
      .reverse(),
  };
}

/** The windows table's heading: the window, how long it ran before its first hit, its hits, and what it used. */
export const windowsHead: { label: string; numeric?: boolean }[] = [
  { label: 'Window' },
  { label: 'Hit after', numeric: true },
  { label: 'Hits', numeric: true },
  { label: 'Turns', numeric: true },
  { label: 'Input', numeric: true },
  { label: 'Cache read %', numeric: true },
  { label: 'Output', numeric: true },
  { label: 'Cost', numeric: true },
];

/** A row of the windows table: a window, or one of its models under it. */
export interface WindowRow {
  key: string;
  kind: 'window' | 'model';
  /** The window's span, or the model's name. */
  name: string;
  /** The cells after the name, in `windowsHead`'s columns. */
  cells: string[];
  /** A sub-row stays with the window above it on a page. */
  sub: boolean;
  /** A window with models under it is a group: its name is bold. */
  group: boolean;
}

/** The windows newest first as the server sends them, each followed by its models, dearest first. */
export function windowRows(windows: readonly LimitWindow[], locale?: string): WindowRow[] {
  return windows.flatMap((window) => {
    const key = `${window.limit_type} ${window.resets_at}`;
    const head: WindowRow = {
      key,
      kind: 'window',
      name: windowSpan(window, locale),
      cells: [duration(windowHitAfter(window)), whole(window.hits), ...usageCells(window.used)],
      sub: false,
      group: window.models.length > 0,
    };
    const models = window.models
      .slice()
      .sort(byCost)
      .map(
        (model): WindowRow => ({
          key: `${key} ${model.model}`,
          kind: 'model',
          name: model.model,
          cells: ['', '', ...usageCells(model)],
          sub: true,
          group: false,
        }),
      );
    return [head, ...models];
  });
}

/** A failed call's row: its time, its error in words, its quota, when that resets, its session and its agent. */
export interface EventRow {
  key: string;
  when: string;
  error: string;
  quota: string;
  resets: string;
  session: { href: string; name: string; project: string };
  agent: string;
}

/** The latest failed calls, in the order given, each keyed by its record. */
export function eventRows(events: readonly ApiErrorEvent[]): EventRow[] {
  return events.map((event) => ({
    key: event.record_id,
    when: when(event.ts),
    error: errorText(event),
    quota: limitType(event.limit_type),
    resets: when(event.resets_at),
    session: { href: sessionHref(event), name: sessionName(event), project: event.project },
    agent: event.agent_type,
  }));
}

/** The latest failed calls' columns; the session's only where `withSession` (a session's own view leaves it out). */
export function eventColumns(withSession: boolean): { label: string }[] {
  return [
    { label: 'When' },
    { label: 'Error' },
    { label: 'Quota' },
    { label: 'Resets' },
    ...(withSession ? [{ label: 'Session' }] : []),
    { label: 'Agent' },
  ];
}
