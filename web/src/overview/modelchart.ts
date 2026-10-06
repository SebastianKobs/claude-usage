// What the by-model chart draws: the metric it plots, the stacked columns' series and geometry, the hatched fills, and
// the words around them (labels, tooltip lines, table rows). Plain functions, so the component only draws them.

import type { Summary } from '../api/api';
import { AXIS_BAND, LEFT_AXIS } from '../charts/chartkit';
import type { Segment, Series, TimeBuckets } from '../charts/charts';
import {
  bandIndex,
  chartSeries,
  columnTotals,
  columnWidth,
  inputTotal,
  modelGroups,
  stackSegments,
  timeBuckets,
} from '../charts/charts';
import { effortLabel } from '../charts/colors';
import { compact, money } from '../ui/format';

/** The usage a metric counts. */
interface MetricRow {
  cost: number | null;
  output: number;
  new_input: number;
  cache_write: number;
  cache_read: number;
}

/** What the chart plots: a name for the switch, how a row counts and how a value is written. */
export interface Metric {
  label: string;
  value: (row: MetricRow) => number;
  format: (value: number) => string;
}

export const METRICS = {
  cost: { label: 'Estimated cost', value: (row) => row.cost || 0, format: money },
  output: { label: 'Output tokens', value: (row) => row.output, format: compact },
  input: { label: 'Input tokens', value: inputTotal, format: compact },
} as const satisfies Record<string, Metric>;

export type MetricName = keyof typeof METRICS;

/** The switch's buttons in their order. */
export const METRIC_NAMES = Object.keys(METRICS) as MetricName[];

/** The metric a saved choice names, the cost where it names none. */
export function metricName(saved: string | null): MetricName {
  return METRIC_NAMES.find((name) => name === saved) ?? 'cost';
}

/** The plot's height, the widest a column gets, and the gaps of a stack: between a model's shades and, wider, between
 *  two models (the shades of two models can come close). The right edge leaves room for the last column's band. */
export const PLOT_HEIGHT = 220;
export const BAR_MAX = 24;
export const GAP = 2;
export const MODEL_GAP = 4;
export const RIGHT_EDGE = 8;

/** The drawing's height: the plot and the x labels' band. */
export const CHART_HEIGHT = PLOT_HEIGHT + AXIS_BAND;

/** The chart's data: the time axis, the series stacked in each bucket, and each bucket's total. */
export interface ModelChart {
  buckets: TimeBuckets;
  series: Series[];
  totals: number[];
  metric: Metric;
}

/** The range's days, or for one day its hours, with the models' efforts stacked, as `metric` counts them. */
export function modelChartOf(summary: Summary, metric: MetricName, now: Date = new Date()): ModelChart {
  const chosen: Metric = METRICS[metric];
  const buckets = timeBuckets(summary, now);
  const rows = buckets.unit === 'hour' ? summary.hour_model_effort : summary.day_model_effort;
  // Typed as the union of both row kinds, which the key function reads either of.
  const series = chartSeries<(typeof rows)[number]>(rows, buckets.keyOf, chosen.value);
  return { buckets, series, totals: columnTotals(series, buckets.keys), metric: chosen };
}

/** Where the columns fall in a drawing `width` wide: the plot's right edge, one bucket's band and the column in it. */
export function columnGeometry(width: number, count: number): { right: number; band: number; barWidth: number } {
  const right = width - RIGHT_EDGE;
  const band = (right - LEFT_AXIS) / count;
  return { right, band, barWidth: columnWidth(band, BAR_MAX) };
}

/** The bucket under x in a drawing `width` wide. */
export function columnIndexAt(width: number, count: number): (x: number) => number {
  return bandIndex(LEFT_AXIS, columnGeometry(width, count).band);
}

/** A column's left edge, for the bucket at `index`. */
export function columnX(width: number, count: number, index: number): number {
  const { band, barWidth } = columnGeometry(width, count);
  return LEFT_AXIS + band * index + (band - barWidth) / 2;
}

/** A stacked column's segments: each series with a value in the bucket, its place in the stack up from the plot's
 *  bottom, and its height scaled to `top`, the axis' maximum. */
export function columnParts(
  series: readonly Series[],
  key: string,
  top: number,
): { entry: Series; segment: Segment }[] {
  const present = series.filter((entry) => (entry.values.get(key) ?? 0) > 0);
  const heights = present.map((entry) => (PLOT_HEIGHT * (entry.values.get(key) ?? 0)) / top);
  return stackSegments(
    present.map((entry) => entry.model),
    heights,
    PLOT_HEIGHT,
    GAP,
    MODEL_GAP,
  ).map((segment) => ({ entry: present[segment.position] as Series, segment }));
}

/** A series' fill in the columns: its color, or a hatch pattern's reference where it has a hatch. */
export interface Fills {
  /** The patterns to define, by id. */
  patterns: { id: string; entry: Series }[];
  fill: (entry: Series) => string;
}

/** The fills of the series: hatched ones (ultracode, background calls) get a pattern each, in series order. */
export function seriesFills(series: readonly Series[]): Fills {
  const patterns = series
    .filter((entry) => entry.hatch)
    .map((entry, index) => ({ id: `model-hatch-${index}`, entry }));
  const ids = new Map(patterns.map((pattern) => [pattern.entry, pattern.id]));
  return {
    patterns,
    fill: (entry) => (ids.has(entry) ? `url(#${ids.get(entry)})` : entry.color),
  };
}

/** The drawing's name for a screen reader. */
export function modelChartLabel(metric: Metric, unit: TimeBuckets['unit']): string {
  return `${metric.label} per ${unit} by model and effort level; table view available`;
}

/** The cursor slider's name. */
export function modelCursorLabel(metric: Metric, unit: TimeBuckets['unit']): string {
  return `${metric.label} per ${unit}; arrow keys step through them`;
}

/** A bucket as the slider reads it: its name and total. */
export function modelValueText(chart: ModelChart, index: number): string {
  return `${chart.buckets.long(chart.buckets.keys[index] ?? '')}: ${chart.metric.format(chart.totals[index] ?? 0)}`;
}

/** A model in the legend: its name and the effort levels it stacks, each with its swatch. */
export function legendGroups(
  series: readonly Series[],
): { model: string; entries: { entry: Series; text: string }[] }[] {
  return modelGroups(series).map((group) => ({
    model: group.model,
    entries: group.entries.map((entry) => ({ entry, text: effortLabel(entry.effort) })),
  }));
}

/** A tooltip's line for a model: its total in the bucket, and its effort levels below it, max first. */
export interface TipGroup {
  model: string;
  value: number;
  efforts: { entry: Series; text: string; value: number }[];
}

/** The models with usage in a bucket, in the fixed model order (flagship first). */
export function tipGroups(series: readonly Series[], key: string): TipGroup[] {
  const present = series.filter((entry) => entry.values.get(key));
  return modelGroups(present).map((group) => ({
    model: group.model,
    value: group.entries.reduce((sum, entry) => sum + (entry.values.get(key) ?? 0), 0),
    efforts: group.entries
      .slice()
      .reverse()
      .map((entry) => ({ entry, text: effortLabel(entry.effort), value: entry.values.get(key) ?? 0 })),
  }));
}

/** The table view: a heading and a row per bucket, newest first, a column per series and the total; a dash where a
 *  series used nothing. */
export function modelTable(chart: ModelChart): { head: string[]; rows: { key: string; cells: string[] }[] } {
  const { buckets, series, metric } = chart;
  const rows = buckets.keys
    .slice()
    .reverse()
    .map((key) => {
      const values = series.map((entry) => entry.values.get(key) ?? 0);
      return {
        key,
        cells: [
          buckets.short(key),
          ...values.map((value) => (value ? metric.format(value) : '–')),
          metric.format(values.reduce((sum, value) => sum + value, 0)),
        ],
      };
    });
  return { head: [buckets.heading, ...series.map((entry) => entry.key), 'Total'], rows };
}
