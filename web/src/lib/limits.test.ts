import { describe, expect, test } from 'vitest';
import { BAR_MAX, RIGHT_EDGE } from './bymodel';
import { LEFT_AXIS } from './chartkit';
import { apiErrorEvent, limitWindow, summary, usage } from './fixtures';
import {
  LIMIT_CHART_HEIGHT,
  LIMIT_COLOR,
  LIMIT_PLOT,
  eventColumns,
  eventRows,
  limitBar,
  limitChartLabel,
  limitCursorLabel,
  limitNote,
  limitTable,
  limitTip,
  limitValueText,
  limitsOf,
  windowRows,
  windowsHead,
} from './limits';

const NOON = new Date(2026, 8, 30, 12, 0, 0);

/** A summary of three days with errors on the last two. */
function withErrors() {
  return summary({
    days: 3,
    since: '2026-09-28',
    api_errors: {
      day: [
        { day: '2026-09-29', error: 'rate_limit', count: 2 },
        { day: '2026-09-29', error: 'server_error', count: 1 },
        { day: '2026-09-30', error: 'rate_limit', count: 5 },
      ],
      hour: [],
      events: [],
      windows: [],
    },
  });
}

describe('the chart of a summary', () => {
  test('has the days of the range with their rate-limit hits and their other errors', () => {
    const chart = limitsOf(withErrors(), NOON);
    expect(chart.buckets.keys).toEqual(['2026-09-28', '2026-09-29', '2026-09-30']);
    expect(chart.limits).toEqual([0, 2, 5]);
    expect(chart.others).toEqual([0, 1, 0]);
    expect(chart.total).toBe(7);
  });

  test('reads the hours for a single day', () => {
    const chart = limitsOf(
      summary({
        days: 1,
        since: '2026-09-30',
        hour_model: [],
        api_errors: {
          day: [],
          hour: [{ hour: '2026-09-30T09', error: 'rate_limit', count: 4 }],
          events: [],
          windows: [],
        },
      }),
      NOON,
    );
    expect(chart.buckets.unit).toBe('hour');
    expect(chart.limits.at(9)).toBe(4);
    expect(chart.total).toBe(4);
  });

  test('tops the axis at an even number, at least 2, so the middle gridline is whole', () => {
    expect(limitsOf(withErrors(), NOON).top).toBe(6);
    expect(limitsOf(summary({ days: 3, since: '2026-09-28' }), NOON).top).toBe(2);
  });

  test('is empty only where there is neither a rate limit nor another error', () => {
    expect(limitsOf(summary({ days: 3, since: '2026-09-28' }), NOON).empty).toBe(true);
    expect(limitsOf(withErrors(), NOON).empty).toBe(false);
    const others = summary({
      days: 3,
      since: '2026-09-28',
      api_errors: { day: [{ day: '2026-09-29', error: 'server_error', count: 1 }], hour: [], events: [], windows: [] },
    });
    expect(limitsOf(others, NOON).empty).toBe(false);
  });

  test('marks the peak bucket for its value label, none where there are no hits', () => {
    expect(limitsOf(withErrors(), NOON).peak).toBe(2);
    expect(limitsOf(summary({ days: 3, since: '2026-09-28' }), NOON).peak).toBeNull();
  });
});

describe('the drawing', () => {
  test('is the plot and the x labels band high, in the status color', () => {
    expect(LIMIT_PLOT).toBe(120);
    expect(LIMIT_CHART_HEIGHT).toBe(148);
    expect(LIMIT_COLOR).toBe('var(--status-critical)');
  });

  test('puts a bar in its band, from the plot bottom up by its share of the axis top', () => {
    const bar = limitBar(400, 3, 1, 3, 6);
    expect(bar.height).toBe(60);
    expect(bar.y).toBe(60);
    // the column is centred in the band: 3 bands across the plot of a drawing 400 wide, the column 60 % of a band
    const band = (400 - RIGHT_EDGE - LEFT_AXIS) / 3;
    expect(bar.width).toBe(Math.min(BAR_MAX, band * 0.6));
    expect(bar.x).toBeCloseTo(LEFT_AXIS + band + (band - bar.width) / 2);
  });

  test('has no height for no hits', () => {
    expect(limitBar(400, 3, 0, 0, 6).height).toBe(0);
  });
});

describe('the words', () => {
  test('say which unit the hits are per, and where the other errors are', () => {
    expect(limitNote('day')).toBe(
      'rate-limit hits per day; other API errors are in the tooltip, the table view and the list',
    );
    expect(limitNote('hour')).toContain('per hour');
  });

  test('name the drawing for a screen reader, with the total', () => {
    expect(limitChartLabel('day', 1234)).toBe('Rate-limit hits per day: 1,234 in the range; table view available');
  });

  test('name the cursor slider', () => {
    expect(limitCursorLabel('hour')).toBe('Rate-limit hits per hour; arrow keys step through them');
  });

  test('read a bucket as its name and both counts', () => {
    const chart = limitsOf(withErrors(), NOON);
    expect(limitValueText(chart, 1)).toBe(`${chart.buckets.long('2026-09-29')}: 2 rate-limit hits, 1 other API errors`);
  });

  test('give the tooltip the bucket, the hits with their icon and the other errors', () => {
    const chart = limitsOf(withErrors(), NOON);
    expect(limitTip(chart, 2)).toEqual({
      when: chart.buckets.long('2026-09-30'),
      limits: '5',
      others: '0',
    });
  });
});

describe('the table view', () => {
  test('has the bucket, the rate-limit hits and the other errors, newest first', () => {
    const table = limitTable(limitsOf(withErrors(), NOON));
    expect(table.head).toEqual([
      { label: 'Day' },
      { label: 'Rate-limit hits', numeric: true },
      { label: 'Other API errors', numeric: true },
    ]);
    expect(table.rows.map((row) => row.key)).toEqual(['2026-09-30', '2026-09-29', '2026-09-28']);
    expect(table.rows[0]?.cells.slice(1)).toEqual(['5', '0']);
    expect(table.rows[1]?.cells.slice(1)).toEqual(['2', '1']);
  });
});

describe('the windows', () => {
  test('have a heading that names the window, how long it took to hit, the hits, then the usage', () => {
    expect(windowsHead.map((column) => column.label)).toEqual([
      'Window',
      'Hit after',
      'Hits',
      'Turns',
      'Input',
      'Cache read %',
      'Output',
      'Cost',
    ]);
    expect(windowsHead.every((column, index) => (index === 0) === !column.numeric)).toBe(true);
  });

  test('come with their models under them as sub-rows, dearest first', () => {
    const window = limitWindow({
      start: new Date(2026, 8, 29, 8).toISOString(),
      first_hit: new Date(2026, 8, 29, 11, 12).toISOString(),
      resets_at: new Date(2026, 8, 29, 13).toISOString(),
      models: [
        { model: 'sonnet', ...usage({ cost: 0.5 }) },
        { model: 'opus', ...usage({ cost: 1 }) },
      ],
    });
    const rows = windowRows([window], 'en-US');
    expect(rows.map((row) => [row.kind, row.name])).toEqual([
      ['window', 'Sep 29, 08:00 AM – 01:00 PM'],
      ['model', 'opus'],
      ['model', 'sonnet'],
    ]);
    expect(rows.map((row) => row.sub)).toEqual([false, true, true]);
    expect(rows.map((row) => row.group)).toEqual([true, false, false]);
  });

  test('write a window row with its time to the first hit and its hit count before the usage', () => {
    const [row] = windowRows([limitWindow({ hits: 3 })], 'en-US');
    expect(row?.cells.slice(0, 2)).toEqual(['3 h 12 min', '3']);
    expect(row?.cells.slice(2)).toEqual(['10', '1.2K', '75%', '50', '$1.50']);
  });

  test('leave a model row without the window cells', () => {
    const opus = { model: 'opus', ...usage({ turns: 4, cost: 0.25 }) };
    const rows = windowRows([limitWindow({ models: [opus] })], 'en-US');
    expect(rows[1]?.cells.slice(0, 2)).toEqual(['', '']);
    expect(rows[1]?.cells.slice(2)).toEqual(['4', '1.2K', '75%', '50', '$0.25']);
  });

  test('have a group only where models follow', () => {
    const [row] = windowRows([limitWindow()], 'en-US');
    expect(row?.group).toBe(false);
  });

  test('key each row by its window and model, so no two share one', () => {
    const one = limitWindow({ models: [{ model: 'opus', ...usage() }] });
    const two = limitWindow({ resets_at: '2026-09-29T18:00:00Z', models: [{ model: 'opus', ...usage() }] });
    const keys = windowRows([one, two], 'en-US').map((row) => row.key);
    expect(new Set(keys).size).toBe(4);
  });
});

describe('the latest errors', () => {
  test('have a row per failed call with its time, its error, its quota, its reset, its session and its agent', () => {
    const failed = apiErrorEvent({ record_id: 'err-2', error: 'server_error', status: 500 });
    const rows = eventRows([apiErrorEvent(), failed]);
    expect(rows.map((row) => row.key)).toEqual(['err-1', 'err-2']);
    expect(rows[0]?.error).toBe('⚠ Rate limit (429)');
    expect(rows[1]?.error).toBe('server error (500)');
    expect(rows[0]?.quota).toBe('5-hour limit');
    expect(rows[0]?.agent).toBe('main');
    expect(rows[0]?.session).toEqual({ href: '#session/abc-1', name: 'Checkout: split payment step', project: 'shop' });
  });

  test('name an untitled session and leave out a reset that is not known', () => {
    const [row] = eventRows([apiErrorEvent({ title: null, resets_at: null, limit_type: null })]);
    expect(row?.session.name).toBe('Untitled session');
    expect(row?.resets).toBe('–');
    expect(row?.quota).toBe('–');
  });

  test('are headed by the time, the error, the quota, its reset, the session and the agent', () => {
    expect(eventColumns(true).map((column) => column.label)).toEqual([
      'When',
      'Error',
      'Quota',
      'Resets',
      'Session',
      'Agent',
    ]);
  });

  test('leave out the session column where the session is the one shown', () => {
    expect(eventColumns(false).map((column) => column.label)).toEqual(['When', 'Error', 'Quota', 'Resets', 'Agent']);
  });
});
