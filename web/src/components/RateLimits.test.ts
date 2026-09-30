import { render, screen, within } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { flushSync } from 'svelte';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { pagePerTest } from '../lib/app.testing';
import type { DayErrors, HourErrors, ModelUsage } from '../lib/api';
import { apiErrorEvent, limitWindow, summary, usage } from '../lib/fixtures';
import { LIMIT_CHART_HEIGHT, LIMIT_PLOT } from '../lib/limits';
import RateLimits from './RateLimits.svelte';

const page = pagePerTest();

const dayErrors = (day: string, error: string, count: number): DayErrors => ({ day, error, count });
const hourErrors = (hour: string, error: string, count: number): HourErrors => ({ hour, error, count });

/**
 * A week up to 2026-09-30. On the 28th one rate-limit hit, on the 29th three and two server errors, on the 30th two.
 * The axis goes to 6 (3 hits, niceMax 5, made even), so a hit is 20 px of the 120.
 */
function week(changes: Parameters<typeof summary>[0] = {}) {
  return summary({
    api_errors: {
      day: [
        dayErrors('2026-09-28', 'rate_limit', 1),
        dayErrors('2026-09-29', 'rate_limit', 3),
        dayErrors('2026-09-29', 'server_error', 2),
        dayErrors('2026-09-30', 'rate_limit', 2),
      ],
      hour: [],
      events: [],
      windows: [],
    },
    ...changes,
  });
}

/** Today alone: the hours, with two hits at 09:00 and an overloaded error at 10:00. */
function today() {
  return summary({
    days: 1,
    since: '2026-09-30',
    hour_model: [],
    api_errors: {
      day: [],
      hour: [hourErrors('2026-09-30T09', 'rate_limit', 2), hourErrors('2026-09-30T10', 'overloaded_error', 1)],
      events: [],
      windows: [],
    },
  });
}

/** Only other errors: no hit, so no label and no column. */
function onlyOthers() {
  return summary({
    api_errors: { day: [dayErrors('2026-09-30', 'server_error', 4)], hour: [], events: [], windows: [] },
  });
}

/** `count` windows, newest first, each hit at its own reset. */
function manyWindows(count: number) {
  return summary({
    api_errors: {
      day: [],
      hour: [],
      events: [],
      windows: Array.from({ length: count }, (_unused, index) =>
        limitWindow({ resets_at: new Date(Date.UTC(2026, 8, 1) + index * 3_600_000).toISOString(), hits: index + 1 }),
      ),
    },
  });
}

/** A model's usage row. */
function modelUsage(model: string, cost: number): ModelUsage {
  return { ...usage({ cost }), model };
}

/** Gives every element a clientWidth, as a browser lays it out (the simulated DOM has none): 0 is not measured yet. */
function measure(width: number) {
  Object.defineProperty(HTMLElement.prototype, 'clientWidth', { configurable: true, get: () => width });
}

/** Puts the focus on the slider: the table toggle comes before it in the tab order. */
async function focusSlider(user: ReturnType<typeof userEvent.setup>) {
  await user.tab();
  await user.tab();
  expect(screen.getByRole('slider')).toHaveFocus();
}

function texts(selector: string, root: ParentNode = document): (string | null)[] {
  return [...root.querySelectorAll(selector)].map((node) => node.textContent);
}

/** The numbers in a path's `d`. */
function numbers(path: Element): number[] {
  return (path.getAttribute('d') ?? '').match(/-?\d+(?:\.\d+)?/g)?.map(Number) ?? [];
}

const columns = () => [...document.querySelectorAll('g[role="img"] > path')];
const toggle = () => screen.getByRole('button', { name: 'Table view' });
const tooltip = () => document.querySelector<HTMLElement>('.tooltip');
const headings = () => screen.getAllByRole('heading', { level: 3 });

// the geometry at a drawing 640 wide and 7 day buckets: the plot runs from 56 to 632, a band is 576 / 7 wide and a
// column, at most 24 wide, is centered in it
const BAND = 576 / 7;
const columnLeft = (index: number) => 56 + BAND * index + (BAND - 24) / 2;

beforeEach(() => {
  // the buckets run up to now; only the clock is faked, so that user-event keeps its timers
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(new Date(2026, 8, 30, 12, 0, 0));
  localStorage.clear();
  page.app.preferences.pageSize = 25;
  measure(640);
});

afterEach(() => {
  vi.useRealTimers();
  for (const key of ['limits-table', 'limit-windows', 'limit-events']) page.app.pages.forget(key);
  localStorage.clear();
  Reflect.deleteProperty(HTMLElement.prototype, 'clientWidth');
});

describe('the card', () => {
  test('is a section named for its heading, with the note for days after it', () => {
    const { container } = page.render(RateLimits);
    page.set({ summary: week() });
    expect(screen.getByRole('region', { name: 'Rate limits' })).toHaveClass('card');
    expect(screen.getByRole('heading', { level: 2 })).toHaveAttribute('id', 'limits-title');
    expect(container.querySelector('.chart-head .muted')).toHaveTextContent(
      /^rate-limit hits per day; other API errors are in the tooltip, the table view and the list$/,
    );
  });

  test('the note names a single day`s hours', () => {
    const { container } = page.render(RateLimits);
    page.set({ summary: today() });
    expect(container.querySelector('.chart-head .muted')).toHaveTextContent(/^rate-limit hits per hour;/);
  });

  test('has its table toggle named for the card', () => {
    page.render(RateLimits);
    expect(toggle()).toHaveAttribute('id', 'limits-table-toggle');
    expect(toggle()).toHaveAttribute('aria-pressed', 'false');
  });

  test('before any summary it has its heading only: no note, legend entry, chart or tables', async () => {
    const user = userEvent.setup();
    const { container } = page.render(RateLimits);
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Rate limits');
    expect(container.querySelector('.muted')).toBeNull();
    expect(container.querySelector('.legend')?.children).toHaveLength(0);
    expect(container.querySelector('.chart')).toBeEmptyDOMElement();
    expect(screen.queryByRole('heading', { level: 3 })).toBeNull();
    await user.click(toggle());
    expect(screen.queryByRole('table')).toBeNull();
  });

  test('the headings are in the theme`s words', () => {
    page.app.preferences.theme = 'hacker';
    page.render(RateLimits);
    page.set({ summary: week() });
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(/^grep 429 access\.log$/);
    expect(headings().map((heading) => heading.textContent)).toEqual(['ulimit -t 18000', 'tail -f error.log']);
    page.app.preferences.theme = 'startup';
    flushSync();
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(/^Hypergrowth friction$/);
    expect(headings().map((heading) => heading.textContent)).toEqual([
      'Burn rate before the wall',
      'Incident postmortems',
    ]);
  });

  test('the theme changes the headings in place', () => {
    page.render(RateLimits);
    page.set({ summary: week() });
    const heading = screen.getByRole('heading', { level: 2 });
    const [windowsHeading] = headings();
    page.app.preferences.theme = 'hacker';
    flushSync();
    expect(screen.getByRole('heading', { level: 2 })).toBe(heading);
    expect(headings()[0]).toBe(windowsHeading);
    expect(heading).toHaveTextContent('grep 429 access.log');
  });
});

describe('the legend', () => {
  test('has one entry, the hit, with a swatch in the critical status color, before the chart', () => {
    const { container } = page.render(RateLimits);
    page.set({ summary: week() });
    expect(texts('.legend > span', container)).toEqual(['⚠ Rate-limit hit']);
    const swatch = container.querySelector<HTMLElement>('.legend .swatch');
    expect(swatch?.style.background).toBe('var(--status-critical)');
    expect(container.querySelector('.legend + .chart')).not.toBeNull();
  });

  test('is there for a range without hits too', () => {
    const { container } = page.render(RateLimits);
    page.set({ summary: summary() });
    expect(container.querySelectorAll('.legend > span')).toHaveLength(1);
  });
});

describe('the chart', () => {
  test('a summary draws it at once: an image named for the unit and the total, 148 high', () => {
    const { container } = page.render(RateLimits);
    page.set({ summary: week() });
    expect(container.querySelector('svg')?.getAttribute('height')).toBe(String(LIMIT_CHART_HEIGHT));
    expect(LIMIT_CHART_HEIGHT).toBe(148);
    expect(screen.getByRole('img')).toHaveAccessibleName(
      'Rate-limit hits per day: 6 in the range; table view available',
    );
  });

  test('one image per hour for a single day', () => {
    page.render(RateLimits);
    page.set({ summary: today() });
    expect(screen.getByRole('img')).toHaveAccessibleName(
      'Rate-limit hits per hour: 2 in the range; table view available',
    );
  });

  test('it is as wide as its container, but not narrower than the minimum', () => {
    const { container, unmount } = page.render(RateLimits);
    page.set({ summary: week() });
    expect(container.querySelector('svg')?.getAttribute('viewBox')).toBe('0 0 640 148');
    unmount();
    measure(0);
    const again = page.render(RateLimits);
    expect(again.container.querySelector('svg')?.getAttribute('viewBox')).toBe('0 0 320 148');
  });

  test('a column per bucket with hits, in the critical status color, the others drawing nothing', () => {
    page.render(RateLimits);
    page.set({ summary: week() });
    expect(columns().map((column) => column.getAttribute('fill'))).toEqual([
      'var(--status-critical)',
      'var(--status-critical)',
      'var(--status-critical)',
    ]);
  });

  test('a column is as high as its hits against the axis` top, 24 px wide and centered in its band', () => {
    page.render(RateLimits);
    page.set({ summary: week() });
    const [first, second, third] = columns().map(numbers) as [number[], number[], number[]];
    // M x,bottom V top+r Q ...: x, then the bottom, which is the plot's
    expect(first[0]).toBeCloseTo(columnLeft(4), 6);
    expect(first[1]).toBeCloseTo(LIMIT_PLOT, 6);
    expect(first[2]).toBeCloseTo(LIMIT_PLOT - 20 + 4, 6);
    expect(second[0]).toBeCloseTo(columnLeft(5), 6);
    expect(second[2]).toBeCloseTo(LIMIT_PLOT - 60 + 4, 6);
    expect(third[0]).toBeCloseTo(columnLeft(6), 6);
    expect(third[2]).toBeCloseTo(LIMIT_PLOT - 40 + 4, 6);
  });

  test('the gridlines run from the axis to 8 px before the drawing`s edge, whole numbers on the axis', () => {
    const { container } = page.render(RateLimits);
    page.set({ summary: week() });
    const lines = [...container.querySelectorAll('g[role="img"] > line')];
    expect(lines.map((line) => [line.getAttribute('x1'), line.getAttribute('x2')])).toEqual([
      ['56', '632'],
      ['56', '632'],
      ['56', '632'],
    ]);
    expect(lines.map((line) => line.getAttribute('stroke'))).toEqual(['var(--axis)', 'var(--grid)', 'var(--grid)']);
    expect(texts('.axis-text[text-anchor="end"]', container)).toEqual(['0', '3', '6']);
    expect(lines.map((line) => line.getAttribute('y1'))).toEqual(['120.5', '60.5', '0.5']);
  });

  test('the axis of a range with few hits is at least 2', () => {
    const { container } = page.render(RateLimits);
    page.set({
      summary: summary({
        api_errors: { day: [dayErrors('2026-09-30', 'rate_limit', 1)], hour: [], events: [], windows: [] },
      }),
    });
    expect(texts('.axis-text[text-anchor="end"]', container)).toEqual(['0', '1', '2']);
  });

  test('x labels run along the bottom, one per day of the week, centered in their bands', () => {
    const { container } = page.render(RateLimits);
    page.set({ summary: week() });
    const labels = [...container.querySelectorAll('.axis-text[text-anchor="middle"]')];
    expect(labels).toHaveLength(7);
    expect(labels.every((label) => label.getAttribute('y') === String(LIMIT_PLOT + 18))).toBe(true);
    labels.forEach((label, index) => expect(Number(label.getAttribute('x'))).toBeCloseTo(56 + BAND * (index + 0.5), 6));
  });

  test('a single day labels its hours', () => {
    const { container } = page.render(RateLimits);
    page.set({ summary: today() });
    const labels = texts('.axis-text[text-anchor="middle"]', container);
    expect(labels.length).toBeGreaterThan(1);
    expect(labels[0]).toBe('12:00 AM');
  });

  test('the tallest column carries its hits, centered over it, 6 px above its top, and only it', () => {
    const { container } = page.render(RateLimits);
    page.set({ summary: week() });
    expect(texts('.value-text', container)).toEqual(['3']);
    const label = container.querySelector('.value-text');
    expect(label?.getAttribute('text-anchor')).toBe('middle');
    expect(Number(label?.getAttribute('x'))).toBeCloseTo(columnLeft(5) + 12, 6);
    expect(Number(label?.getAttribute('y'))).toBeCloseTo(LIMIT_PLOT - 60 - 6, 6);
  });

  test('of equally tall columns the first carries it', () => {
    const { container } = page.render(RateLimits);
    page.set({
      summary: summary({
        api_errors: {
          day: [dayErrors('2026-09-29', 'rate_limit', 2), dayErrors('2026-09-30', 'rate_limit', 2)],
          hour: [],
          events: [],
          windows: [],
        },
      }),
    });
    expect(texts('.value-text', container)).toEqual(['2']);
    expect(Number(container.querySelector('.value-text')?.getAttribute('x'))).toBeCloseTo(columnLeft(5) + 12, 6);
  });

  test('other errors alone draw the chart without a column or a label', () => {
    const { container } = page.render(RateLimits);
    page.set({ summary: onlyOthers() });
    expect(container.querySelector('svg')).not.toBeNull();
    expect(columns()).toHaveLength(0);
    expect(container.querySelector('.value-text')).toBeNull();
    expect(container.querySelector('.chart > .empty')).toBeNull();
    expect(texts('.axis-text[text-anchor="end"]', container)).toEqual(['0', '1', '2']);
  });

  test('a range with neither hits nor errors says so in place of the chart', () => {
    const { container } = page.render(RateLimits);
    page.set({ summary: summary() });
    expect(container.querySelector('.chart > .empty')).toHaveTextContent(
      /^No rate limits or API errors in this range\.$/,
    );
    expect(container.querySelector('svg')).toBeNull();
    expect(screen.queryByRole('slider')).toBeNull();
  });

  test('the note and the tables stay for a range without errors', () => {
    const { container } = page.render(RateLimits);
    page.set({ summary: summary() });
    expect(container.querySelector('.chart-head .muted')).not.toBeNull();
    expect(texts('.table-wrap > .empty', container)).toEqual([
      'No 5-hour window hit its limit in this range.',
      'No API errors in this range.',
    ]);
  });
});

describe('the cursor and its tooltip', () => {
  test('one slider over the days, reading the day and both counts', () => {
    page.render(RateLimits);
    page.set({ summary: week() });
    const slider = screen.getByRole('slider', { name: 'Rate-limit hits per day; arrow keys step through them' });
    expect(screen.getAllByRole('slider')).toHaveLength(1);
    expect(slider).toHaveAttribute('aria-valuemin', '1');
    expect(slider).toHaveAttribute('aria-valuemax', '7');
    expect(slider).toHaveAttribute('aria-valuenow', '7');
    expect(slider.getAttribute('aria-valuetext')).toMatch(/: 2 rate-limit hits, 0 other API errors$/);
  });

  test('a single day has its hours for buckets', () => {
    page.render(RateLimits);
    page.set({ summary: today() });
    expect(screen.getByRole('slider')).toHaveAccessibleName('Rate-limit hits per hour; arrow keys step through them');
    expect(screen.getByRole('slider')).toHaveAttribute('aria-valuemax', '13');
  });

  test('the slider covers the plot, from the axis to 8 px before the drawing`s edge', () => {
    page.render(RateLimits);
    page.set({ summary: week() });
    const slider = screen.getByRole('slider');
    expect(slider.getAttribute('x')).toBe('56');
    expect(slider.getAttribute('y')).toBe('0');
    expect(slider.getAttribute('width')).toBe(String(632 - 56));
    expect(slider.getAttribute('height')).toBe(String(LIMIT_PLOT));
  });

  test('there is no tooltip and no highlight until the cursor is on the chart', () => {
    const { container } = page.render(RateLimits);
    page.set({ summary: week() });
    expect(tooltip()).toBeNull();
    expect(container.querySelector('.column-mark')).toBeNull();
  });

  test('focus shows the last day`s tooltip: the day, the hits with the icon, the other errors', async () => {
    const user = userEvent.setup();
    page.render(RateLimits);
    page.set({ summary: week() });
    await focusSlider(user);
    const box = tooltip() as HTMLElement;
    expect(box.querySelector('.when')).toHaveTextContent('Sep 30');
    expect(texts('.row strong', box)).toEqual(['2', '0']);
    expect(texts('.row .name', box)).toEqual(['⚠ rate-limit hits', 'other API errors']);
  });

  test('its first line has a swatch in the critical status color, its second the default one', async () => {
    const user = userEvent.setup();
    page.render(RateLimits);
    page.set({ summary: week() });
    await focusSlider(user);
    const swatches = [...(tooltip()?.querySelectorAll<HTMLElement>('.row .swatch') ?? [])];
    expect(swatches.map((swatch) => swatch.style.background)).toEqual(['var(--status-critical)', '']);
  });

  test('the arrow keys step through the days, the tooltip following', async () => {
    const user = userEvent.setup();
    page.render(RateLimits);
    page.set({ summary: week() });
    await focusSlider(user);
    await user.keyboard('{ArrowLeft}');
    expect(texts('.row strong', tooltip() as HTMLElement)).toEqual(['3', '2']);
    expect(tooltip()?.querySelector('.when')).toHaveTextContent('Sep 29');
    expect(screen.getByRole('slider')).toHaveAttribute('aria-valuenow', '6');
    expect(screen.getByRole('slider').getAttribute('aria-valuetext')).toMatch(
      /: 3 rate-limit hits, 2 other API errors$/,
    );
    await user.keyboard('{Home}');
    expect(texts('.row strong', tooltip() as HTMLElement)).toEqual(['0', '0']);
    await user.keyboard('{End}');
    expect(tooltip()?.querySelector('.when')).toHaveTextContent('Sep 30');
  });

  test('the band under the cursor is highlighted, wider than the column', async () => {
    const user = userEvent.setup();
    const { container } = page.render(RateLimits);
    page.set({ summary: week() });
    await focusSlider(user);
    const mark = container.querySelector('rect.column-mark');
    expect(Number(mark?.getAttribute('x'))).toBeCloseTo(56 + BAND * 6, 6);
    expect(Number(mark?.getAttribute('width'))).toBeCloseTo(BAND, 6);
    expect(mark?.getAttribute('y')).toBe('0');
    expect(mark?.getAttribute('height')).toBe(String(LIMIT_PLOT));
    await user.keyboard('{Home}');
    expect(Number(container.querySelector('rect.column-mark')?.getAttribute('x'))).toBeCloseTo(56, 6);
  });

  test('the tooltip stands a gap right of the band`s middle', async () => {
    const user = userEvent.setup();
    page.render(RateLimits);
    page.set({ summary: week() });
    await focusSlider(user);
    expect(parseFloat(tooltip()?.style.left ?? '')).toBeCloseTo(56 + BAND * 6.5 + 12, 3);
    await user.keyboard('{Home}');
    expect(parseFloat(tooltip()?.style.left ?? '')).toBeCloseTo(56 + BAND * 0.5 + 12, 3);
  });

  test('leaving the slider hides the tooltip and the highlight', async () => {
    const user = userEvent.setup();
    const { container } = page.render(RateLimits);
    page.set({ summary: week() });
    await focusSlider(user);
    await user.tab();
    expect(tooltip()).toBeNull();
    expect(container.querySelector('.column-mark')).toBeNull();
  });

  test('names the hour for a single day', async () => {
    const user = userEvent.setup();
    page.render(RateLimits);
    page.set({ summary: today() });
    await focusSlider(user);
    await user.keyboard('{ArrowLeft}');
    // 11:00, the hour before now: nothing there; 10:00 has the other error, 09:00 the hits
    expect(texts('.row strong', tooltip() as HTMLElement)).toEqual(['0', '0']);
    await user.keyboard('{ArrowLeft}');
    expect(texts('.row strong', tooltip() as HTMLElement)).toEqual(['0', '1']);
    await user.keyboard('{ArrowLeft}');
    expect(texts('.row strong', tooltip() as HTMLElement)).toEqual(['2', '0']);
  });

  test('a new summary gives the slider its new buckets, and a tooltip its new counts', async () => {
    const user = userEvent.setup();
    page.render(RateLimits);
    page.set({ summary: week() });
    await focusSlider(user);
    page.set({
      summary: summary({
        api_errors: { day: [dayErrors('2026-09-30', 'rate_limit', 7)], hour: [], events: [], windows: [] },
      }),
    });
    expect(texts('.row strong', tooltip() as HTMLElement)).toEqual(['7', '0']);
    expect(texts('.value-text')).toEqual(['7']);
  });
});

describe('a new summary', () => {
  test('draws the chart again: the columns of the new counts', () => {
    page.render(RateLimits);
    page.set({ summary: week() });
    page.set({ summary: onlyOthers() });
    expect(columns()).toHaveLength(0);
    page.set({ summary: week() });
    expect(columns()).toHaveLength(3);
  });

  test('gives way to the note when the range has no errors, and back', () => {
    const { container } = page.render(RateLimits);
    page.set({ summary: week() });
    page.set({ summary: summary() });
    expect(container.querySelector('svg')).toBeNull();
    expect(container.querySelector('.chart > .empty')).not.toBeNull();
    page.set({ summary: week() });
    expect(container.querySelector('svg')).not.toBeNull();
    expect(container.querySelector('.chart > .empty')).toBeNull();
  });

});

describe('the table view', () => {
  async function shown(summaryToShow = week()) {
    const user = userEvent.setup();
    const view = page.render(RateLimits);
    page.set({ summary: summaryToShow });
    await user.click(toggle());
    return { user, ...view };
  }

  /** The table view's table: the first one, before the windows' and the errors'. */
  const bucketTable = () => screen.getAllByRole('table')[0] as HTMLElement;

  test('is not drawn until the toggle is pressed, the chart staying after', async () => {
    const user = userEvent.setup();
    const { container } = page.render(RateLimits);
    page.set({ summary: week() });
    expect(toggle()).toHaveAttribute('aria-pressed', 'false');
    // the windows' and the errors' tables are there without an event
    expect(screen.queryByRole('columnheader', { name: 'Rate-limit hits' })).toBeNull();
    await user.click(toggle());
    expect(toggle()).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('columnheader', { name: 'Rate-limit hits' })).toBeInTheDocument();
    await user.click(toggle());
    expect(screen.queryByRole('columnheader', { name: 'Rate-limit hits' })).toBeNull();
    expect(container.querySelector('svg')).not.toBeNull();
  });

  test('is headed by the day, the hits and the other errors, the numbers aligned right', async () => {
    await shown();
    const heads = within(bucketTable()).getAllByRole('columnheader');
    expect(heads.map((head) => head.textContent)).toEqual(['Day', 'Rate-limit hits', 'Other API errors']);
    expect(heads.map((head) => head.classList.contains('num'))).toEqual([false, true, true]);
  });

  test('has a row per day, the newest first, with its counts', async () => {
    await shown();
    const rows = within(bucketTable()).getAllByRole('row').slice(1);
    expect(rows).toHaveLength(7);
    const cells = rows.map((row) => within(row).getAllByRole('cell').map((cell) => cell.textContent));
    expect(cells[0]).toEqual(['Sep 30', '2', '0']);
    expect(cells[1]).toEqual(['Sep 29', '3', '2']);
    expect(cells[2]).toEqual(['Sep 28', '1', '0']);
    expect(cells[6]?.slice(1)).toEqual(['0', '0']);
    expect(within(rows[0] as HTMLElement).getAllByRole('cell').map((cell) => cell.classList.contains('num'))).toEqual([
      false,
      true,
      true,
    ]);
  });

  test('has its hours for a single day, headed by the hour', async () => {
    await shown(today());
    expect(within(bucketTable()).getAllByRole('columnheader')[0]).toHaveTextContent('Hour');
    expect(within(bucketTable()).getAllByRole('row')).toHaveLength(14);
  });

  test('is there without a chart when the range has no errors', async () => {
    await shown(summary());
    expect(within(bucketTable()).getAllByRole('row')).toHaveLength(8);
  });

  test('pages past ten buckets, under its own key', async () => {
    const { user } = await shown(
      summary({
        days: 30,
        since: '2026-09-01',
        api_errors: { day: [dayErrors('2026-09-30', 'rate_limit', 1)], hour: [], events: [], windows: [] },
      }),
    );
    expect(screen.getByText('rows 1–25 of 30')).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: 'Rows per page' }).id).toBe('pager-limits-table-size');
    await user.click(screen.getByRole('button', { name: 'Next ›' }));
    expect(screen.getByText('rows 26–30 of 30')).toBeInTheDocument();
  });
});

describe('the windows table', () => {
  test('has its heading and its note before it, in the theme`s words', () => {
    const { container } = page.render(RateLimits);
    page.set({ summary: manyWindows(1) });
    const [heading] = headings();
    expect(heading).toHaveTextContent('5-hour windows that hit the limit');
    expect(heading?.parentElement).not.toHaveClass('title-row');
    const note = container.querySelector('h3 + .note');
    expect(note).toHaveTextContent(
      new RegExp(
        '^what each window used from its start \\(its reset less 5 hours\\) up to its first hit, ' +
          'as the transcripts here show it; the limit also counts what you use elsewhere$',
      ),
    );
    expect(note?.nextElementSibling).toHaveClass('table-wrap');
  });

  test('is headed by the window, when it was hit, the hits and what it used', () => {
    page.render(RateLimits);
    page.set({ summary: manyWindows(1) });
    const table = screen.getAllByRole('table')[0] as HTMLElement;
    const heads = within(table).getAllByRole('columnheader');
    expect(heads.map((head) => head.textContent)).toEqual([
      'Window',
      'Hit after',
      'Hits',
      'Turns',
      'Input',
      'Cache read %',
      'Output',
      'Cost',
    ]);
    expect(heads.map((head) => head.classList.contains('num'))).toEqual([false, ...Array(7).fill(true)]);
  });

  test('has a row per window: its span, time to the first hit, hits and usage', () => {
    page.render(RateLimits);
    page.set({ summary: summary({ api_errors: { day: [], hour: [], events: [], windows: [limitWindow()] } }) });
    const row = screen.getAllByRole('row')[1] as HTMLElement;
    const cells = within(row).getAllByRole('cell');
    expect(cells).toHaveLength(8);
    expect(cells[0]?.textContent).toMatch(/ – /);
    expect(cells[0]?.querySelector('.window-model')).toBeNull();
    expect(cells.slice(1).map((cell) => cell.textContent)).toEqual([
      '3 h 12 min',
      '3',
      '10',
      '1.2K',
      '75%',
      '50',
      '$1.50',
    ]);
    expect(cells.map((cell) => cell.classList.contains('num'))).toEqual([false, ...Array(7).fill(true)]);
  });

  test('a window with models is a group row, its models under it as sub-rows, the dearest first', () => {
    page.render(RateLimits);
    page.set({
      summary: summary({
        api_errors: {
          day: [],
          hour: [],
          events: [],
          windows: [
            limitWindow({ models: [modelUsage('claude-sonnet-4', 0.5), modelUsage('claude-opus-4', 1)] }),
            limitWindow({ resets_at: '2026-09-28T13:00:00Z', start: '2026-09-28T08:00:00Z' }),
          ],
        },
      }),
    });
    const rows = screen.getAllByRole('row').slice(1);
    expect(rows.map((row) => row.className)).toEqual(['group-row', 'sub-row', 'sub-row', '']);
    const names = texts('.window-model');
    expect(names).toEqual(['claude-opus-4', 'claude-sonnet-4']);
    const model = within(rows[1] as HTMLElement).getAllByRole('cell');
    expect(model[0]?.querySelector('span')).toHaveClass('window-model');
    expect(model.slice(1, 3).map((cell) => cell.textContent)).toEqual(['', '']);
    expect(model[7]?.textContent).toBe('$1.00');
    expect(model.every((cell, index) => index === 0 || cell.classList.contains('num'))).toBe(true);
  });

  test('without a window it says so in place of the table, the heading and the note staying', () => {
    const { container } = page.render(RateLimits);
    page.set({ summary: week() });
    const wrap = container.querySelector('h3 + .note + .table-wrap');
    expect(wrap?.querySelector('.empty')).toHaveTextContent(/^No 5-hour window hit its limit in this range\.$/);
    expect(wrap?.querySelector('table')).toBeNull();
  });

  test('pages past ten windows with the pager in the heading`s row, under its own key', async () => {
    const user = userEvent.setup();
    page.render(RateLimits);
    page.set({ summary: manyWindows(40) });
    const pager = screen.getByRole('group', { name: 'Pages' });
    expect(pager.parentElement).toHaveClass('title-row');
    expect(pager.previousElementSibling).toBe(headings()[0]);
    expect(screen.getByRole('combobox', { name: 'Rows per page' }).id).toBe('pager-limit-windows-size');
    expect(screen.getByText('rows 1–25 of 40')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Next ›' }));
    expect(screen.getByText('rows 26–40 of 40')).toBeInTheDocument();
  });

  test('keeps a model with its window at a page edge', async () => {
    const user = userEvent.setup();
    page.app.preferences.pageSize = 10;
    const windows = Array.from({ length: 12 }, (_unused, index) =>
      limitWindow({
        resets_at: `2026-09-29T${String(index).padStart(2, '0')}:00:00Z`,
        models: index === 9 ? [modelUsage('claude-opus-4', 1), modelUsage('claude-sonnet-4', 0.5)] : [],
      }),
    );
    page.render(RateLimits);
    page.set({ summary: summary({ api_errors: { day: [], hour: [], events: [], windows } }) });
    // the tenth window and its two models are on the first page
    expect(screen.getAllByRole('row').slice(1)).toHaveLength(12);
    await user.click(screen.getByRole('button', { name: 'Next ›' }));
    expect(screen.getAllByRole('row').slice(1)).toHaveLength(2);
    expect(screen.getByText('rows 11–12 of 12')).toBeInTheDocument();
  });

  test('keeps its page when a new summary comes', async () => {
    const user = userEvent.setup();
    page.render(RateLimits);
    page.set({ summary: manyWindows(40) });
    await user.click(screen.getByRole('button', { name: 'Next ›' }));
    page.set({ summary: manyWindows(40) });
    expect(screen.getByText('rows 26–40 of 40')).toBeInTheDocument();
  });
});

describe('the latest errors table', () => {
  function withEvents() {
    return summary({
      api_errors: {
        day: [],
        hour: [],
        events: [
          apiErrorEvent(),
          apiErrorEvent({
            record_id: 'err-2',
            error: 'server_error',
            status: 500,
            limit_type: null,
            resets_at: null,
            session_id: 'abc-2',
            project: 'blog',
            agent_type: 'Explore',
            title: null,
          }),
        ],
        windows: [],
      },
    });
  }

  const eventsTable = () => screen.getAllByRole('table').at(-1) as HTMLElement;

  test('has its heading, in the theme`s words, and no note', () => {
    const { container } = page.render(RateLimits);
    page.set({ summary: withEvents() });
    expect(headings()[1]).toHaveTextContent('Latest API errors');
    expect(headings()[1]?.parentElement).not.toHaveClass('title-row');
    expect(headings()[1]?.nextElementSibling).toHaveClass('table-wrap');
    expect(container.querySelectorAll('.note')).toHaveLength(1);
  });

  test('is headed by the time, the error, the quota, its reset, the session and the agent', () => {
    page.render(RateLimits);
    page.set({ summary: withEvents() });
    const heads = within(eventsTable()).getAllByRole('columnheader');
    expect(heads.map((head) => head.textContent)).toEqual(['When', 'Error', 'Quota', 'Resets', 'Session', 'Agent']);
    expect(heads.some((head) => head.classList.contains('num'))).toBe(false);
  });

  test('has a row per failed call: the error in words, the quota, a link to the session and its agent', () => {
    page.render(RateLimits);
    page.set({ summary: withEvents() });
    const [first, second] = within(eventsTable()).getAllByRole('row').slice(1) as [HTMLElement, HTMLElement];
    const cells = within(first).getAllByRole('cell');
    expect(cells.map((cell) => cell.classList.contains('num'))).toEqual([true, false, false, true, false, false]);
    expect([1, 2, 5].map((index) => cells[index]?.textContent)).toEqual(['⚠ Rate limit (429)', '5-hour limit', 'main']);
    expect(cells[0]?.textContent).toMatch(/Sep 29/);
    expect(within(cells[4] as HTMLElement).getByRole('link')).toHaveAttribute('href', '#session/abc-1');
    expect(cells[4]?.querySelector('a')).toHaveTextContent('Checkout: split payment step');
    expect(cells[4]?.querySelector('.sub')).toHaveTextContent('shop');
    const other = within(second).getAllByRole('cell');
    expect([1, 2, 3, 5].map((index) => other[index]?.textContent)).toEqual(['server error (500)', '–', '–', 'Explore']);
    expect(within(other[4] as HTMLElement).getByRole('link')).toHaveTextContent('Untitled session');
    expect(within(other[4] as HTMLElement).getByRole('link')).toHaveAttribute('href', '#session/abc-2');
    expect(other[4]?.querySelector('.sub')).toHaveTextContent('blog');
  });

  test('without an error it says so in place of the table, the heading staying', () => {
    const { container } = page.render(RateLimits);
    page.set({ summary: week() });
    const wrap = container.querySelector('.table-wrap:last-child');
    expect(wrap?.querySelector('.empty')).toHaveTextContent(/^No API errors in this range\.$/);
    expect(headings()[1]).toHaveTextContent('Latest API errors');
  });

  test('pages past ten errors, its pager in the heading`s row, under its own key', () => {
    page.render(RateLimits);
    page.set({
      summary: summary({
        api_errors: {
          day: [],
          hour: [],
          events: Array.from({ length: 12 }, (_unused, index) => apiErrorEvent({ record_id: `err-${index}` })),
          windows: [],
        },
      }),
    });
    const pager = screen.getByRole('group', { name: 'Pages' });
    expect(pager.parentElement).toContainElement(headings()[1] as HTMLElement);
    expect(screen.getByRole('combobox', { name: 'Rows per page' }).id).toBe('pager-limit-events-size');
    expect(screen.getByText('rows 1–12 of 12')).toBeInTheDocument();
  });

  test('a new summary updates the rows in place, by record', () => {
    page.render(RateLimits);
    page.set({ summary: withEvents() });
    const before = within(eventsTable()).getAllByRole('row');
    page.set({ summary: withEvents() });
    const after = within(eventsTable()).getAllByRole('row');
    after.forEach((row, index) => expect(row).toBe(before[index]));
  });
});
