// What the over-time section draws: three aligned panels (cost, input, output), one y axis each, sharing one time axis
// (never a second axis on one plot). The panels' geometry, their values per bucket and the words around them, as plain
// functions, so the component only draws them.

import type { DayModelUsage, HourModelUsage, Summary } from '../api/api';
import { AXIS_BAND } from '../charts/chartkit';
import type { BucketTotals, TimeBuckets } from '../charts/charts';
import { NO_USAGE, bucketTotals, timeBuckets } from '../charts/charts';
import type { Slot } from '../charts/colors';
import { compact, money } from '../ui/format';

/** One panel: its line's series slot, what it plots of a bucket and how the axis and tooltip write it. */
export interface TrendPanel {
  label: string;
  slot: Slot;
  value: (totals: BucketTotals) => number;
  format: (value: number) => string;
}

export const TREND_PANELS: readonly TrendPanel[] = [
  { label: 'Estimated cost', slot: 0, value: (totals) => totals.cost, format: money },
  { label: 'Input tokens', slot: 1, value: (totals) => totals.input, format: compact },
  { label: 'Output tokens', slot: 2, value: (totals) => totals.output, format: compact },
];

/** The height of a panel's title row, of its plot, and of the gap before the next panel. */
export const PANEL_TITLE = 22;
export const PANEL_PLOT = 76;
export const PANEL_GAP = 18;

/** Where a panel's plot starts and ends, in the drawing's y. */
export function panelBox(position: number): { top: number; bottom: number } {
  const top = position * (PANEL_TITLE + PANEL_PLOT + PANEL_GAP) + PANEL_TITLE;
  return { top, bottom: top + PANEL_PLOT };
}

/** The drawing's height: the panels, no gap after the last, and the x labels' band. */
export function trendHeight(): number {
  return panelBox(TREND_PANELS.length - 1).bottom + AXIS_BAND;
}

/** The time axis and what each of its buckets used. */
export interface Trend {
  buckets: TimeBuckets;
  /** One per bucket, nothing where no row falls in it. */
  totals: BucketTotals[];
}

/** The range's days, or for one day its hours, each with its usage summed over the models. */
export function trendOf(summary: Summary, now: Date = new Date()): Trend {
  const buckets = timeBuckets(summary, now);
  // Typed as the union of both row kinds, which the key function reads either of.
  const rows: (DayModelUsage | HourModelUsage)[] = buckets.unit === 'hour' ? summary.hour_model : summary.day_model;
  const sums = bucketTotals(rows, buckets.keyOf);
  return { buckets, totals: buckets.keys.map((key) => sums.get(key) ?? NO_USAGE) };
}

/** A panel's value in each bucket. */
export function panelValues(trend: Trend, panel: TrendPanel): number[] {
  return trend.totals.map((totals) => panel.value(totals));
}

/** The note after the heading. */
export function trendNote(unit: TimeBuckets['unit']): string {
  return `estimated cost, input and output tokens per ${unit}`;
}

/** The drawing's name for a screen reader. */
export function trendLabel(unit: TimeBuckets['unit']): string {
  return `Estimated cost, input tokens and output tokens per ${unit}; table view available`;
}

/** The cursor slider's name. */
export function trendCursorLabel(unit: TimeBuckets['unit']): string {
  return `Estimated cost, input and output tokens per ${unit}; arrow keys step through them`;
}

/** A bucket as the slider reads it: its name, then each panel's value. */
export function trendValueText(trend: Trend, index: number): string {
  const totals = trend.totals[index] ?? NO_USAGE;
  const values = TREND_PANELS.map((panel) => `${panel.label} ${panel.format(panel.value(totals))}`).join(', ');
  return `${trend.buckets.long(trend.buckets.keys[index] ?? '')}: ${values}`;
}

/** The table view: a heading and a row per bucket, newest first, as tables read best. */
export function trendTable(trend: Trend): { head: string[]; rows: { key: string; cells: string[] }[] } {
  const rows = trend.buckets.keys
    .map((key, index) => ({
      key,
      cells: [
        trend.buckets.short(key),
        ...TREND_PANELS.map((panel) => panel.format(panel.value(trend.totals[index] ?? NO_USAGE))),
      ],
    }))
    .reverse();
  return { head: [trend.buckets.heading, ...TREND_PANELS.map((panel) => panel.label)], rows };
}
