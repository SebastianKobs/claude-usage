import { describe, expect, test } from 'vitest';
import type { DayModelEffortUsage, HourModelEffortUsage } from '../api/api';
import {
  BAR_MAX,
  CHART_HEIGHT,
  GAP,
  METRICS,
  METRIC_NAMES,
  MODEL_GAP,
  PLOT_HEIGHT,
  RIGHT_EDGE,
  columnGeometry,
  columnIndexAt,
  columnParts,
  columnX,
  legendGroups,
  metricName,
  modelChartLabel,
  modelChartOf,
  modelCursorLabel,
  modelTable,
  modelValueText,
  seriesFills,
  tipGroups,
} from './modelchart';
import { chartSeries } from '../charts/charts';
import { LEFT_AXIS } from '../charts/chartkit';
import { summary, usage } from '../api/fixtures';

const NOON = new Date(2026, 8, 30, 12, 0, 0);

function dayRow(day: string, model: string, effort: string | null, changes = {}): DayModelEffortUsage {
  return { ...usage(), day, model, effort, ...changes };
}

function hourRow(hour: string, model: string, effort: string | null, changes = {}): HourModelEffortUsage {
  return { ...usage(), hour, model, effort, ...changes };
}

describe('the metrics', () => {
  test('are chosen in the switch order: cost first', () => {
    expect(METRIC_NAMES).toEqual(['cost', 'output', 'input']);
  });

  test('count a row as its cost, its output or its whole input side', () => {
    const row = usage({ cost: 2.5, output: 70, new_input: 10, cache_write: 20, cache_read: 300 });
    expect(METRICS.cost.value(row)).toBe(2.5);
    expect(METRICS.output.value(row)).toBe(70);
    expect(METRICS.input.value(row)).toBe(330);
  });

  test('count a row without a price as nothing', () => {
    expect(METRICS.cost.value({ ...usage(), cost: null })).toBe(0);
  });

  test('write the cost as money and tokens compactly', () => {
    expect(METRICS.cost.format(1.5)).toBe('$1.50');
    expect(METRICS.output.format(1200)).toBe('1.2K');
    expect(METRICS.input.format(1200)).toBe('1.2K');
  });

  test('name the switch buttons in words', () => {
    expect(METRIC_NAMES.map((name) => METRICS[name].label)).toEqual([
      'Estimated cost',
      'Output tokens',
      'Input tokens',
    ]);
  });

  test('come back from a saved name, the cost where it is none', () => {
    expect(metricName('output')).toBe('output');
    expect(metricName('input')).toBe('input');
    expect(metricName('cost')).toBe('cost');
    expect(metricName(null)).toBe('cost');
    expect(metricName('nothing')).toBe('cost');
    expect(metricName('toString')).toBe('cost');
  });
});

describe('the chart of a summary', () => {
  const week = summary({
    day_model_effort: [
      dayRow('2026-09-30', 'claude-opus-4', 'high', { cost: 2 }),
      dayRow('2026-09-30', 'claude-sonnet-4', null, { cost: 1 }),
      dayRow('2026-09-29', 'claude-opus-4', 'high', { cost: 4 }),
    ],
  });

  test('stacks a series per model and effort level, and sums each day', () => {
    const chart = modelChartOf(week, 'cost', NOON);
    expect(chart.buckets.unit).toBe('day');
    expect(chart.buckets.keys).toHaveLength(7);
    expect(chart.series.map((entry) => entry.key)).toEqual([
      'claude-opus-4 · effort high',
      'claude-sonnet-4 · no effort level',
    ]);
    expect(chart.totals).toEqual([0, 0, 0, 0, 0, 4, 3]);
    expect(chart.metric).toBe(METRICS.cost);
  });

  test('plots what the metric counts', () => {
    const chart = modelChartOf(week, 'output', NOON);
    expect(chart.totals.slice(-2)).toEqual([50, 100]);
  });

  test('plots the hours of one day', () => {
    const today = summary({
      days: 1,
      since: '2026-09-30',
      hour_model: [],
      hour_model_effort: [hourRow('2026-09-30T09', 'claude-opus-4', 'max', { cost: 3 })],
    });
    const chart = modelChartOf(today, 'cost', NOON);
    expect(chart.buckets.unit).toBe('hour');
    expect(chart.buckets.keys).toHaveLength(13);
    expect(chart.totals[9]).toBe(3);
    expect(chart.totals.reduce((sum, value) => sum + value, 0)).toBe(3);
  });

  test('has nothing to stack without rows', () => {
    const chart = modelChartOf(summary(), 'cost', NOON);
    expect(chart.series).toEqual([]);
    expect(chart.totals).toEqual([0, 0, 0, 0, 0, 0, 0]);
  });
});

describe('where the columns fall', () => {
  test('the plot ends 8 px before the drawing does and the bands share what is left', () => {
    const { right, band } = columnGeometry(640, 7);
    expect(RIGHT_EDGE).toBe(8);
    expect(right).toBe(632);
    expect(band).toBeCloseTo((632 - LEFT_AXIS) / 7, 10);
  });

  test('a column is 60 % of its band, at most 24 px, at least 2', () => {
    expect(BAR_MAX).toBe(24);
    expect(columnGeometry(640, 7).barWidth).toBe(24);
    expect(columnGeometry(640, 100).barWidth).toBeCloseTo(((632 - LEFT_AXIS) / 100) * 0.6, 10);
    expect(columnGeometry(640, 1000).barWidth).toBe(2);
  });

  test('a column is centered in its band', () => {
    const { band, barWidth } = columnGeometry(640, 7);
    expect(columnX(640, 7, 0)).toBeCloseTo(LEFT_AXIS + (band - barWidth) / 2, 10);
    expect(columnX(640, 7, 3)).toBeCloseTo(LEFT_AXIS + band * 3 + (band - barWidth) / 2, 10);
  });

  test('the pointer picks the band under it', () => {
    const { band } = columnGeometry(640, 7);
    const indexAt = columnIndexAt(640, 7);
    expect(indexAt(LEFT_AXIS + 1)).toBe(0);
    expect(indexAt(LEFT_AXIS + band * 2 + 1)).toBe(2);
    expect(indexAt(LEFT_AXIS + band * 7 - 1)).toBe(6);
  });

  test('the drawing is the plot and the x labels', () => {
    expect(PLOT_HEIGHT).toBe(220);
    expect(CHART_HEIGHT).toBe(248);
  });
});

describe('a stacked column', () => {
  const rows = [
    dayRow('d', 'claude-opus-4', 'medium', { cost: 10 }),
    dayRow('d', 'claude-opus-4', 'high', { cost: 20 }),
    dayRow('d', 'claude-sonnet-4', null, { cost: 30 }),
    dayRow('e', 'claude-sonnet-4', null, { cost: 5 }),
  ];
  const series = chartSeries(rows, (row) => row.day, METRICS.cost.value);

  test('has a segment per series with usage, scaled to the axis top, from the floor up', () => {
    const parts = columnParts(series, 'd', 60);
    expect(parts.map((part) => part.entry.key)).toEqual([
      'claude-opus-4 · effort medium',
      'claude-opus-4 · effort high',
      'claude-sonnet-4 · no effort level',
    ]);
    // heights 220 * value / 60 = 36.7, 73.3, 110; none of the stacks gaps leaves the first
    expect(parts[0]?.segment.y).toBeCloseTo(PLOT_HEIGHT - (220 * 10) / 60, 10);
    expect(parts[0]?.segment.height).toBeCloseTo((220 * 10) / 60, 10);
  });

  test('leaves 2 px between a model’s shades and 4 px between models', () => {
    expect([GAP, MODEL_GAP]).toEqual([2, 4]);
    const parts = columnParts(series, 'd', 60);
    const [first, second, third] = parts.map((part) => part.segment);
    expect(second?.height).toBeCloseTo((220 * 20) / 60 - GAP, 10);
    expect(third?.height).toBeCloseTo((220 * 30) / 60 - MODEL_GAP, 10);
    expect(first?.top).toBe(false);
    expect(third?.top).toBe(true);
  });

  test('skips the series that used nothing that day', () => {
    const parts = columnParts(series, 'e', 60);
    expect(parts.map((part) => part.entry.model)).toEqual(['claude-sonnet-4']);
    expect(parts[0]?.segment.top).toBe(true);
  });

  test('is empty for a day without usage', () => {
    expect(columnParts(series, 'none', 60)).toEqual([]);
  });
});

describe('the fills', () => {
  const rows = [
    dayRow('d', 'claude-opus-4', 'high'),
    dayRow('d', 'claude-opus-4', 'ultracode'),
    dayRow('d', 'claude-opus-4', 'background'),
    dayRow('d', 'claude-sonnet-4', 'ultracode'),
  ];
  const series = chartSeries(rows, (row) => row.day, METRICS.cost.value);
  const fills = seriesFills(series);

  test('hatched series get a pattern each, numbered in series order', () => {
    expect(fills.patterns.map((pattern) => pattern.id)).toEqual(['model-hatch-0', 'model-hatch-1', 'model-hatch-2']);
    expect(fills.patterns.map((pattern) => pattern.entry.effort)).toEqual(['background', 'ultracode', 'ultracode']);
  });

  test('a hatched series is painted with its pattern, another with its color', () => {
    const plain = series.find((entry) => entry.effort === 'high');
    const hatched = series.find((entry) => entry.effort === 'background');
    expect(fills.fill(plain as (typeof series)[number])).toBe(plain?.color);
    expect(fills.fill(hatched as (typeof series)[number])).toBe('url(#model-hatch-0)');
  });

  test('there are no patterns without a hatched series', () => {
    expect(seriesFills(series.filter((entry) => !entry.hatch)).patterns).toEqual([]);
  });
});

describe('the words', () => {
  const week = summary({
    day_model_effort: [
      dayRow('2026-09-30', 'claude-opus-4', 'high', { cost: 2 }),
      dayRow('2026-09-30', 'claude-opus-4', 'low', { cost: 0.5 }),
      dayRow('2026-09-30', 'claude-sonnet-4', 'background', { cost: 1 }),
      dayRow('2026-09-29', 'claude-opus-4', 'high', { cost: 4 }),
    ],
  });
  const chart = modelChartOf(week, 'cost', NOON);

  test('the drawing and the slider are named by the metric and the unit', () => {
    expect(modelChartLabel(METRICS.output, 'day')).toBe(
      'Output tokens per day by model and effort level; table view available',
    );
    expect(modelChartLabel(METRICS.cost, 'hour')).toBe(
      'Estimated cost per hour by model and effort level; table view available',
    );
    expect(modelCursorLabel(METRICS.input, 'hour')).toBe('Input tokens per hour; arrow keys step through them');
  });

  test('the slider reads a bucket’s name and total', () => {
    expect(modelValueText(chart, 6)).toBe(`${chart.buckets.long('2026-09-30')}: $3.50`);
    expect(modelValueText(chart, 0)).toBe(`${chart.buckets.long(chart.buckets.keys[0] as string)}: $0.00`);
  });

  test('the legend lists each model with its effort levels in stack order', () => {
    expect(legendGroups(chart.series).map((group) => [group.model, group.entries.map((one) => one.text)])).toEqual([
      ['claude-opus-4', ['low', 'high']],
      ['claude-sonnet-4', ['background calls']],
    ]);
  });

  test('the tooltip has a model’s total with its effort levels below, max first', () => {
    const groups = tipGroups(chart.series, '2026-09-30');
    expect(groups.map((group) => [group.model, group.value])).toEqual([
      ['claude-opus-4', 2.5],
      ['claude-sonnet-4', 1],
    ]);
    expect(groups[0]?.efforts.map((one) => [one.text, one.value])).toEqual([
      ['high', 2],
      ['low', 0.5],
    ]);
  });

  test('the tooltip leaves out the models that used nothing', () => {
    expect(tipGroups(chart.series, '2026-09-29').map((group) => group.model)).toEqual(['claude-opus-4']);
    expect(tipGroups(chart.series, '2026-09-01')).toEqual([]);
  });

  test('the table has a column per series and the total, newest first, a dash where nothing was used', () => {
    const table = modelTable(chart);
    expect(table.head).toEqual([
      'Day',
      'claude-opus-4 · effort low',
      'claude-opus-4 · effort high',
      'claude-sonnet-4 · background calls',
      'Total',
    ]);
    expect(table.rows[0]?.key).toBe('2026-09-30');
    expect(table.rows[0]?.cells.slice(1)).toEqual(['$0.50', '$2.00', '$1.00', '$3.50']);
    expect(table.rows[1]?.cells.slice(1)).toEqual(['–', '$4.00', '–', '$4.00']);
    expect(table.rows).toHaveLength(7);
    expect(table.rows[6]?.cells.slice(1)).toEqual(['–', '–', '–', '$0.00']);
  });

  test('the table’s first column names the unit, each row its bucket shortly', () => {
    const table = modelTable(chart);
    expect(table.rows[0]?.cells[0]).toBe(chart.buckets.short('2026-09-30'));
  });
});
