import { describe, expect, test } from 'vitest';
import type { DayModelUsage, HourModelUsage } from './api';
import { summary, usage } from './fixtures';
import {
  PANEL_GAP,
  PANEL_PLOT,
  PANEL_TITLE,
  TREND_PANELS,
  panelBox,
  panelValues,
  trendHeight,
  trendLabel,
  trendNote,
  trendOf,
  trendTable,
  trendValueText,
} from './trend';

const NOON = new Date(2026, 8, 30, 12, 0, 0);

function dayRow(day: string, changes: Partial<DayModelUsage> = {}): DayModelUsage {
  return { ...usage(), day, model: 'claude-opus-4', ...changes };
}

function hourRow(hour: string, changes: Partial<HourModelUsage> = {}): HourModelUsage {
  return { ...usage(), hour, model: 'claude-opus-4', ...changes };
}

describe('the panels', () => {
  test('cost, input and output, each in its own series color and its own unit', () => {
    expect(TREND_PANELS.map((panel) => [panel.label, panel.slot])).toEqual([
      ['Estimated cost', 0],
      ['Input tokens', 1],
      ['Output tokens', 2],
    ]);
    const totals = { cost: 1.5, input: 12_000, output: 3_400 };
    expect(TREND_PANELS.map((panel) => panel.format(panel.value(totals)))).toEqual(['$1.50', '12K', '3.4K']);
  });

  test('each panel sits below the one before it, a gap apart, its plot under its title', () => {
    const first = panelBox(0);
    expect(first).toEqual({ top: PANEL_TITLE, bottom: PANEL_TITLE + PANEL_PLOT });
    expect(panelBox(1).top - first.bottom).toBe(PANEL_GAP + PANEL_TITLE);
  });

  test('the drawing ends under the last plot with the x labels band below, and no gap after it', () => {
    expect(trendHeight()).toBe(panelBox(2).bottom + 28);
  });
});

describe('the time axis', () => {
  test('a week is its days, summed over the models of each', () => {
    const trend = trendOf(
      summary({
        day_model: [
          dayRow('2026-09-29', { cost: 1, output: 10 }),
          dayRow('2026-09-29', { model: 'claude-sonnet-4', cost: 0.5, output: 5 }),
          dayRow('2026-09-30', { cost: 2 }),
        ],
      }),
      NOON,
    );
    expect(trend.buckets.unit).toBe('day');
    expect(trend.buckets.keys).toHaveLength(7);
    expect(panelValues(trend, TREND_PANELS[0]!).slice(-2)).toEqual([1.5, 2]);
    expect(panelValues(trend, TREND_PANELS[2]!).slice(-2)).toEqual([15, 50]);
  });

  test('a day without usage is a bucket of nothing, not a gap', () => {
    const trend = trendOf(summary({ day_model: [dayRow('2026-09-30', { cost: 2 })] }), NOON);
    expect(panelValues(trend, TREND_PANELS[0]!)).toEqual([0, 0, 0, 0, 0, 0, 2]);
  });

  test('one day is its hours up to now', () => {
    const today = summary({
      days: 1,
      since: '2026-09-30',
      hour_model: [hourRow('2026-09-30T09', { cost: 3 })],
    });
    const trend = trendOf(today, NOON);
    expect(trend.buckets.unit).toBe('hour');
    expect(trend.buckets.keys).toHaveLength(13);
    expect(panelValues(trend, TREND_PANELS[0]!)[9]).toBe(3);
  });
});

describe('the words', () => {
  test('the note and the drawing say the unit', () => {
    expect(trendNote('day')).toBe('estimated cost, input and output tokens per day');
    expect(trendNote('hour')).toBe('estimated cost, input and output tokens per hour');
    expect(trendLabel('day')).toBe('Estimated cost, input tokens and output tokens per day; table view available');
  });

  test('a bucket reads as its long name and each panel`s value', () => {
    const trend = trendOf(summary({ day_model: [dayRow('2026-09-30', { cost: 2, output: 1500 })] }), NOON);
    const text = trendValueText(trend, 6);
    expect(text).toBe(
      `${trend.buckets.long('2026-09-30')}: Estimated cost $2.00, Input tokens 1.2K, Output tokens 1.5K`,
    );
  });
});

describe('the table view', () => {
  test('the heading is the unit, then each panel; the newest bucket comes first', () => {
    const trend = trendOf(summary({ day_model: [dayRow('2026-09-30', { cost: 2 })] }), NOON);
    const table = trendTable(trend);
    expect(table.head).toEqual(['Day', 'Estimated cost', 'Input tokens', 'Output tokens']);
    expect(table.rows).toHaveLength(7);
    expect(table.rows[0]).toEqual({
      key: '2026-09-30',
      cells: [trend.buckets.short('2026-09-30'), '$2.00', '1.2K', '50'],
    });
    expect(table.rows.at(-1)?.key).toBe('2026-09-24');
  });

  test('an hourly range heads its first column Hour', () => {
    const trend = trendOf(summary({ days: 1, since: '2026-09-30', hour_model: [] }), NOON);
    expect(trendTable(trend).head[0]).toBe('Hour');
  });
});
