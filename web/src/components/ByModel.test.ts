import { fireEvent, render, screen, within } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { flushSync } from 'svelte';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import type { DayModelEffortUsage, HourModelEffortUsage } from '../lib/api';
import { CHART_HEIGHT, PLOT_HEIGHT } from '../lib/bymodel';
import { summary, usage } from '../lib/fixtures';
import { tablePages } from '../lib/paging.svelte';
import { payload, setPayload } from '../lib/payload.svelte';
import { preferences } from '../lib/prefs.svelte';
import ByModel from './ByModel.svelte';

const OPUS_HIGH = 'color-mix(in oklab, var(--series-1), var(--shade-ink) calc(var(--shade-step-1) * 2))';
const OPUS_ULTRACODE = 'color-mix(in oklab, var(--series-1), var(--shade-ink) calc(var(--shade-step-1) * 3))';
const OPUS_ULTRACODE_HATCH = 'color-mix(in oklab, var(--series-1), var(--shade-ink) calc(var(--shade-step-1) * 4))';

function dayRow(
  day: string,
  model: string,
  effort: string | null,
  changes: Partial<DayModelEffortUsage> = {},
): DayModelEffortUsage {
  return { ...usage(), day, model, effort, ...changes };
}

function hourRow(
  hour: string,
  model: string,
  effort: string | null,
  changes: Partial<HourModelEffortUsage> = {},
): HourModelEffortUsage {
  return { ...usage(), hour, model, effort, ...changes };
}

/**
 * A week up to 2026-09-30. Yesterday: Opus at high effort, $3. Today, the peak at $4: Opus at high ($2) and in
 * ultracode ($1), and Sonnet without an effort level ($1).
 */
function week() {
  return summary({
    day_model_effort: [
      dayRow('2026-09-29', 'claude-opus-4', 'high', { cost: 3, output: 300 }),
      dayRow('2026-09-30', 'claude-opus-4', 'high', { cost: 2, output: 200 }),
      dayRow('2026-09-30', 'claude-opus-4', 'ultracode', { cost: 1, output: 100 }),
      dayRow('2026-09-30', 'claude-sonnet-4', null, { cost: 1, output: 50 }),
    ],
  });
}

/** Today alone: the hours, with usage at 09:00 by Opus at max effort. */
function today() {
  return summary({
    days: 1,
    since: '2026-09-30',
    hour_model_effort: [hourRow('2026-09-30T09', 'claude-opus-4', 'max', { cost: 3 })],
  });
}

/** A month up to today: 30 days, one row each, the cost its day of the month. */
function month() {
  const days = Array.from({ length: 30 }, (_unused, index) => `2026-09-${String(index + 1).padStart(2, '0')}`);
  return summary({
    days: 30,
    since: '2026-09-01',
    day_model_effort: days.map((day, index) => dayRow(day, 'claude-opus-4', 'high', { cost: index })),
  });
}

/** Gives every element a clientWidth, as a browser lays it out (the simulated DOM has none): 0 is not measured yet. */
function measure(width: number) {
  Object.defineProperty(HTMLElement.prototype, 'clientWidth', { configurable: true, get: () => width });
}

/** Gives the SVG a box on the page, as a browser lays it out. */
function layOut(left: number, width: number) {
  const svg = document.querySelector('svg');
  if (!svg) throw new Error('no svg');
  svg.getBoundingClientRect = () => new DOMRect(left, 0, width, CHART_HEIGHT);
}

/** Puts the focus on the slider: the three metric buttons and the table toggle come before it in the tab order. */
async function focusSlider(user: ReturnType<typeof userEvent.setup>) {
  for (let presses = 0; presses < 5; presses += 1) await user.tab();
  expect(screen.getByRole('slider')).toHaveFocus();
}

function texts(selector: string, root: ParentNode = document): (string | null)[] {
  return [...root.querySelectorAll(selector)].map((node) => node.textContent);
}

/** The numbers in a path's `d`. */
function numbers(path: Element): number[] {
  return (path.getAttribute('d') ?? '').match(/-?\d+(?:\.\d+)?/g)?.map(Number) ?? [];
}

/** The backgrounds set on elements from now on, in order: the simulated DOM drops what it can't parse (color-mix and
 *  gradients), so the swatches are read where Svelte sets them, a first time as the style text, later by property. */
function recordBackgrounds(): string[] {
  const seen: string[] = [];
  const prototype = CSSStyleDeclaration.prototype;
  const setProperty = prototype.setProperty;
  vi.spyOn(prototype, 'setProperty').mockImplementation(function (
    this: CSSStyleDeclaration,
    name: string,
    value: string | null,
    priority?: string,
  ) {
    if (name === 'background') seen.push(value ?? '');
    setProperty.call(this, name, value, priority);
  });
  const text = Object.getOwnPropertyDescriptor(prototype, 'cssText');
  if (!text?.set || !text.get) throw new Error('no cssText accessor to record');
  const { get, set } = text;
  Object.defineProperty(prototype, 'cssText', {
    configurable: true,
    get,
    set(this: CSSStyleDeclaration, value: string) {
      const match = /^background: (.*);$/.exec(value);
      if (match) seen.push(match[1] ?? '');
      set.call(this, value);
    },
  });
  restores.push(() => Object.defineProperty(prototype, 'cssText', text));
  return seen;
}

const restores: (() => void)[] = [];

const segments = () => [...document.querySelectorAll('g[role="img"] > path')];
const metricButton = (name: string) => screen.getByRole('button', { name });
const tooltip = () => document.querySelector<HTMLElement>('.tooltip');

// the geometry at a drawing 640 wide and 7 day buckets: the plot runs from 56 to 632, a band is 576 / 7 wide and a
// column, at most 24 wide, is centered in it
const BAND = 576 / 7;
const columnLeft = (index: number) => 56 + BAND * index + (BAND - 24) / 2;

beforeEach(() => {
  // the buckets run up to now; only the clock is faked, so that user-event keeps its timers
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(new Date(2026, 8, 30, 12, 0, 0));
  localStorage.clear();
  preferences.pageSize = 25;
  measure(0);
});

afterEach(() => {
  vi.restoreAllMocks();
  for (const restore of restores.splice(0)) restore();
  vi.useRealTimers();
  payload.reset();
  tablePages.forget('chart-table');
  preferences.theme = null;
  preferences.pageSize = 25;
  localStorage.clear();
  Reflect.deleteProperty(HTMLElement.prototype, 'clientWidth');
});

describe('the card', () => {
  test('before any summary the heading says per day, by model, and there is no chart', () => {
    const { container } = render(ByModel);
    expect(screen.getByRole('region', { name: 'Per day, by model' })).toHaveClass('card');
    expect(screen.getByRole('heading', { level: 2 })).toHaveAttribute('id', 'chart-title');
    expect(container.querySelector('.chart')).toBeEmptyDOMElement();
    expect(container.querySelector('svg')).toBeNull();
    expect(container.querySelector('.muted')).toBeNull();
  });

  test('without a summary the legend is empty and the table view has no table', async () => {
    const user = userEvent.setup();
    const { container } = render(ByModel);
    expect(container.querySelector('.legend')?.children).toHaveLength(0);
    await user.click(screen.getByRole('button', { name: 'Table view' }));
    expect(screen.queryByRole('table')).toBeNull();
  });

  test('a summary of days names the heading per day, by model and effort', () => {
    render(ByModel);
    setPayload({ summary: week() });
    expect(screen.getByRole('region', { name: 'Per day, by model and effort' })).toBeInTheDocument();
  });

  test('a single day names it per hour', () => {
    render(ByModel);
    setPayload({ summary: today() });
    expect(screen.getByRole('region', { name: 'Per hour, by model and effort' })).toBeInTheDocument();
  });

  test('the heading is in the theme`s words, in each of its three wordings', () => {
    preferences.theme = 'hacker';
    render(ByModel);
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(/^top -o model$/);
    setPayload({ summary: week() });
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(/^top -o model,effort$/);
    setPayload({ summary: today() });
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(/^top -o model,effort$/);
    preferences.theme = 'startup';
    flushSync();
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(/^Model × effort mix$/);
  });

  test('the table toggle is named for the card', () => {
    render(ByModel);
    expect(screen.getByRole('button', { name: 'Table view' })).toHaveAttribute('id', 'chart-table-toggle');
  });
});

describe('the metric switch', () => {
  test('is a group of three buttons: the cost, output and input tokens, the cost pressed', () => {
    const { container } = render(ByModel);
    const group = screen.getByRole('group', { name: 'Metric' });
    expect(group).toHaveClass('segmented');
    const buttons = within(group).getAllByRole('button');
    expect(buttons.map((button) => button.textContent)).toEqual(['Estimated cost', 'Output tokens', 'Input tokens']);
    expect(buttons.map((button) => button.getAttribute('aria-pressed'))).toEqual(['true', 'false', 'false']);
    expect(buttons.map((button) => button.getAttribute('type'))).toEqual(['button', 'button', 'button']);
    expect(container.querySelector('.chart-head')?.contains(group)).toBe(true);
  });

  test('a saved choice is the one pressed at mount', () => {
    localStorage.setItem('claude-usage.metric', 'input');
    render(ByModel);
    expect(metricButton('Input tokens')).toHaveAttribute('aria-pressed', 'true');
    expect(metricButton('Estimated cost')).toHaveAttribute('aria-pressed', 'false');
  });

  test('a saved name that is no metric leaves the cost', () => {
    localStorage.setItem('claude-usage.metric', 'nonsense');
    render(ByModel);
    expect(metricButton('Estimated cost')).toHaveAttribute('aria-pressed', 'true');
  });

  test('a click presses the button, releases the other and saves the choice', async () => {
    const user = userEvent.setup();
    render(ByModel);
    await user.click(metricButton('Output tokens'));
    expect(metricButton('Output tokens')).toHaveAttribute('aria-pressed', 'true');
    expect(metricButton('Estimated cost')).toHaveAttribute('aria-pressed', 'false');
    expect(localStorage.getItem('claude-usage.metric')).toBe('output');
    await user.click(metricButton('Estimated cost'));
    expect(localStorage.getItem('claude-usage.metric')).toBe('cost');
  });

  test('the output metric changes the axis, the peak label, the drawing`s name and the slider', async () => {
    const user = userEvent.setup();
    const { container } = render(ByModel);
    setPayload({ summary: week() });
    expect(texts('.axis-text[text-anchor="end"]', container)).toEqual(['$0.00', '$1.25', '$2.50', '$3.75', '$5.00']);
    expect(texts('.value-text', container)).toEqual(['$4.00']);
    await user.click(metricButton('Output tokens'));
    // 350 at most: the axis goes to 500
    expect(texts('.axis-text[text-anchor="end"]', container)).toEqual(['0', '125', '250', '375', '500']);
    expect(texts('.value-text', container)).toEqual(['350']);
    expect(screen.getByRole('img')).toHaveAccessibleName(
      'Output tokens per day by model and effort level; table view available',
    );
    expect(screen.getByRole('slider')).toHaveAccessibleName('Output tokens per day; arrow keys step through them');
    expect(screen.getByRole('slider').getAttribute('aria-valuetext')).toMatch(/: 350$/);
  });

  test('the input metric counts the whole input side', async () => {
    const user = userEvent.setup();
    const { container } = render(ByModel);
    setPayload({ summary: week() });
    await user.click(metricButton('Input tokens'));
    // 1,200 per row (100 new, 200 cache writes, 900 cache reads), three rows today
    expect(texts('.value-text', container)).toEqual(['3.6K']);
  });

  test('the table follows the metric', async () => {
    const user = userEvent.setup();
    render(ByModel);
    setPayload({ summary: week() });
    await user.click(screen.getByRole('button', { name: 'Table view' }));
    expect(within(screen.getAllByRole('row')[1] as HTMLElement).getAllByRole('cell')[4]).toHaveTextContent('$4.00');
    await user.click(metricButton('Output tokens'));
    expect(within(screen.getAllByRole('row')[1] as HTMLElement).getAllByRole('cell')[4]).toHaveTextContent('350');
  });
});

describe('the legend', () => {
  test('groups the efforts under their model, in the fixed model order', () => {
    const { container } = render(ByModel);
    setPayload({ summary: week() });
    const groups = [...container.querySelectorAll('.legend > .legend-group')];
    expect(groups.map((group) => group.querySelector('strong')?.textContent)).toEqual([
      'claude-opus-4',
      'claude-sonnet-4',
    ]);
    expect(groups.map((group) => texts(':scope > span', group))).toEqual([['high', 'ultracode'], ['no effort level']]);
  });

  test('each entry has a swatch in its series` color, a hatched series a striped one', () => {
    const backgrounds = recordBackgrounds();
    const { container } = render(ByModel);
    setPayload({ summary: week() });
    expect(container.querySelectorAll('.legend .swatch')).toHaveLength(3);
    expect(backgrounds).toEqual([
      OPUS_HIGH,
      `repeating-linear-gradient(135deg, ${OPUS_ULTRACODE_HATCH} 0 1.5px, ${OPUS_ULTRACODE} 1.5px 4px)`,
      'var(--series-2)',
    ]);
  });

  test('background calls are hatched the other way', () => {
    const backgrounds = recordBackgrounds();
    const { container } = render(ByModel);
    setPayload({
      summary: summary({
        day_model_effort: [dayRow('2026-09-30', 'claude-opus-4', 'background', { cost: 1 })],
      }),
    });
    expect(texts('.legend .legend-group > span', container)).toEqual(['background calls']);
    expect(backgrounds).toHaveLength(1);
    expect(backgrounds[0]).toMatch(/^repeating-linear-gradient\(45deg, /);
  });

  test('a range without usage has no groups', () => {
    const { container } = render(ByModel);
    setPayload({ summary: summary() });
    expect(container.querySelector('.legend')?.children).toHaveLength(0);
  });

  test('comes before the chart', () => {
    const { container } = render(ByModel);
    setPayload({ summary: week() });
    expect(container.querySelector('.legend + .chart')).not.toBeNull();
  });
});

describe('the chart', () => {
  test('a summary draws it at once: an image named for the metric and the unit, 248 high', () => {
    const { container } = render(ByModel);
    setPayload({ summary: week() });
    expect(container.querySelector('svg')?.getAttribute('height')).toBe(String(CHART_HEIGHT));
    expect(CHART_HEIGHT).toBe(248);
    expect(screen.getByRole('img')).toHaveAccessibleName(
      'Estimated cost per day by model and effort level; table view available',
    );
  });

  test('one image per hour for a single day', () => {
    render(ByModel);
    setPayload({ summary: today() });
    expect(screen.getByRole('img')).toHaveAccessibleName(
      'Estimated cost per hour by model and effort level; table view available',
    );
  });

  test('it is as wide as its container, but not narrower than the minimum', () => {
    measure(640);
    const { container } = render(ByModel);
    setPayload({ summary: week() });
    expect(container.querySelector('svg')?.getAttribute('viewBox')).toBe('0 0 640 248');
  });

  test('an unmeasured container draws at the minimum width', () => {
    const { container } = render(ByModel);
    setPayload({ summary: week() });
    expect(container.querySelector('svg')?.getAttribute('viewBox')).toBe('0 0 320 248');
  });

  test('a path per segment: one for yesterday, three for today, each in its series` fill', () => {
    render(ByModel);
    setPayload({ summary: week() });
    expect(segments().map((path) => path.getAttribute('fill'))).toEqual([
      OPUS_HIGH,
      OPUS_HIGH,
      'url(#model-hatch-0)',
      'var(--series-2)',
    ]);
  });

  test('a hatched series has a pattern: its color with 2 px lines of the hatch at its angle, on a 6 px period', () => {
    const { container } = render(ByModel);
    setPayload({ summary: week() });
    const patterns = [...container.querySelectorAll('defs > pattern')];
    expect(patterns).toHaveLength(1);
    const pattern = patterns[0] as Element;
    expect(pattern.id).toBe('model-hatch-0');
    expect(pattern.getAttribute('width')).toBe('6');
    expect(pattern.getAttribute('height')).toBe('6');
    expect(pattern.getAttribute('patternUnits')).toBe('userSpaceOnUse');
    expect(pattern.getAttribute('patternTransform')).toBe('rotate(45)');
    const rects = [...pattern.querySelectorAll('rect')];
    const sizes = rects.map((rect) => [rect.getAttribute('width'), rect.getAttribute('height')]);
    expect(sizes).toEqual([
      ['6', '6'],
      ['2', '6'],
    ]);
    expect(rects.map((rect) => rect.getAttribute('fill'))).toEqual([OPUS_ULTRACODE, OPUS_ULTRACODE_HATCH]);
  });

  test('background calls` pattern turns the other way, and each hatched series has its own', () => {
    const { container } = render(ByModel);
    setPayload({
      summary: summary({
        day_model_effort: [
          dayRow('2026-09-30', 'claude-opus-4', 'background', { cost: 1 }),
          dayRow('2026-09-30', 'claude-opus-4', 'ultracode', { cost: 1 }),
        ],
      }),
    });
    const patterns = [...container.querySelectorAll('defs > pattern')];
    expect(patterns.map((pattern) => pattern.id)).toEqual(['model-hatch-0', 'model-hatch-1']);
    expect(patterns.map((pattern) => pattern.getAttribute('patternTransform')).sort()).toEqual([
      'rotate(-45)',
      'rotate(45)',
    ]);
    expect(segments().map((path) => path.getAttribute('fill'))).toEqual(['url(#model-hatch-0)', 'url(#model-hatch-1)']);
  });

  test('without a hatched series there are no defs', () => {
    const { container } = render(ByModel);
    setPayload({
      summary: summary({ day_model_effort: [dayRow('2026-09-30', 'claude-opus-4', 'high', { cost: 1 })] }),
    });
    expect(container.querySelector('defs')).toBeNull();
  });

  test('the tallest column carries its total, and only it', () => {
    const { container } = render(ByModel);
    setPayload({ summary: week() });
    expect(texts('.value-text', container)).toEqual(['$4.00']);
  });

  test('of equally tall columns the first carries it', () => {
    const { container } = render(ByModel);
    setPayload({
      summary: summary({
        day_model_effort: [
          dayRow('2026-09-29', 'claude-opus-4', 'high', { cost: 2 }),
          dayRow('2026-09-30', 'claude-opus-4', 'high', { cost: 2 }),
        ],
      }),
    });
    expect(texts('.value-text', container)).toEqual(['$2.00']);
  });

  test('a range without usage has no columns and no peak label', () => {
    const { container } = render(ByModel);
    setPayload({ summary: summary() });
    expect(segments()).toHaveLength(0);
    expect(container.querySelector('.value-text')).toBeNull();
    // an axis to 1, the smallest nice top
    expect(texts('.axis-text[text-anchor="end"]', container)).toEqual(['$0.00', '$0.25', '$0.50', '$0.75', '$1.00']);
  });

  test('a day of an unpriced model counts as nothing', () => {
    const { container } = render(ByModel);
    setPayload({
      summary: summary({
        day_model_effort: [dayRow('2026-09-30', 'claude-opus-4', 'high', { cost: 0, unpriced_turns: 10 })],
      }),
    });
    expect(segments()).toHaveLength(0);
    expect(container.querySelector('.value-text')).toBeNull();
  });

  test('x labels run along the bottom, one per day of the week', () => {
    const { container } = render(ByModel);
    setPayload({ summary: week() });
    const labels = [...container.querySelectorAll('.axis-text[text-anchor="middle"]')];
    expect(labels).toHaveLength(7);
    expect(labels.every((label) => label.getAttribute('y') === String(PLOT_HEIGHT + 18))).toBe(true);
  });

  test('a single day labels its hours', () => {
    const { container } = render(ByModel);
    setPayload({ summary: today() });
    const labels = texts('.axis-text[text-anchor="middle"]', container);
    expect(labels.length).toBeGreaterThan(1);
    expect(labels.length).toBeLessThanOrEqual(13);
    expect(labels[0]).toBe('12:00 AM');
  });
});

describe('the drawing`s geometry', () => {
  test('a column is 24 px wide, centered in its band, the last one at the plot`s right', () => {
    measure(640);
    render(ByModel);
    setPayload({ summary: week() });
    // yesterday's column
    const yesterday = numbers(segments()[0] as Element);
    expect(yesterday[0]).toBeCloseTo(columnLeft(5), 6);
    expect(columnLeft(5)).toBeCloseTo(496.5714, 3);
    // the rounded top: M x,y+h V y+r Q x,y x+r,y H x+w-r Q x+w,y x+w,y+r V y+h Z, so it ends at the bottom
    expect(yesterday[yesterday.length - 1]).toBeCloseTo(220, 6);
    const todays = numbers(segments()[1] as Element);
    expect(todays[0]).toBeCloseTo(columnLeft(6), 6);
    expect(columnLeft(6)).toBeCloseTo(578.8571, 3);
  });

  test('a segment is as high as its share of the axis` top, the stack rising from the plot`s bottom', () => {
    measure(640);
    render(ByModel);
    setPayload({ summary: week() });
    // the axis goes to $5 over 220 px: yesterday's $3 is 132 px, the top segment rounded at the data end
    const yesterday = numbers(segments()[0] as Element);
    expect(yesterday[0]).toBeCloseTo(columnLeft(5), 6);
    expect(yesterday[1]).toBeCloseTo(220, 6);
    expect(yesterday[2]).toBeCloseTo(88 + 4, 6);
    // today: $2 is 88 px from the bottom; $1 is 44 px, less the 2 px gap between a model's shades; Sonnet's $1
    // is 44 px less the 4 px gap between models
    const [high, ultracode, sonnet] = segments().slice(1).map(numbers) as [number[], number[], number[]];
    expect(high.slice(0, 3)).toEqual([expect.closeTo(columnLeft(6), 6), 220, 132]);
    expect(high[3]).toBeCloseTo(columnLeft(6) + 24, 6);
    expect(ultracode.slice(0, 3)).toEqual([expect.closeTo(columnLeft(6), 6), 130, 88]);
    expect(sonnet[1]).toBeCloseTo(84, 6);
    expect(sonnet[2]).toBeCloseTo(44 + 4, 6);
  });

  test('the peak label is centered over its column, 6 px above its top', () => {
    measure(640);
    const { container } = render(ByModel);
    setPayload({ summary: week() });
    const label = container.querySelector('.value-text');
    expect(label?.getAttribute('text-anchor')).toBe('middle');
    expect(Number(label?.getAttribute('x'))).toBeCloseTo(columnLeft(6) + 12, 6);
    // $4 of $5: 176 px up from 220, less 6
    expect(Number(label?.getAttribute('y'))).toBeCloseTo(220 - 176 - 6, 6);
  });

  test('a label over a column that reaches the axis` top is 6 px above the plot', () => {
    measure(640);
    const { container } = render(ByModel);
    setPayload({
      summary: summary({ day_model_effort: [dayRow('2026-09-30', 'claude-opus-4', 'high', { cost: 5 })] }),
    });
    expect(Number(container.querySelector('.value-text')?.getAttribute('y'))).toBeCloseTo(-6, 6);
  });

  test('the gridlines run from the axis to 8 px before the drawing`s edge, the first in the axis color', () => {
    measure(640);
    const { container } = render(ByModel);
    setPayload({ summary: week() });
    const lines = [...container.querySelectorAll('g[role="img"] > line')];
    expect(lines).toHaveLength(5);
    expect(lines.map((line) => [line.getAttribute('x1'), line.getAttribute('x2')])).toEqual(
      Array.from({ length: 5 }, () => ['56', '632']),
    );
    expect(lines.map((line) => line.getAttribute('stroke'))).toEqual([
      'var(--axis)',
      'var(--grid)',
      'var(--grid)',
      'var(--grid)',
      'var(--grid)',
    ]);
    // 0, 1.25, ..., 5 at 220 px: a quarter of the plot apart, snapped to the middle of a pixel
    expect(lines.map((line) => line.getAttribute('y1'))).toEqual(['220.5', '165.5', '110.5', '55.5', '0.5']);
    expect(texts('.axis-text[text-anchor="end"]', container)).toHaveLength(5);
    const first = container.querySelector('.axis-text[text-anchor="end"]');
    expect(first?.getAttribute('x')).toBe('48');
  });

  test('the x labels are centered in their bands', () => {
    measure(640);
    const { container } = render(ByModel);
    setPayload({ summary: week() });
    const labels = [...container.querySelectorAll('.axis-text[text-anchor="middle"]')];
    labels.forEach((label, index) => expect(Number(label.getAttribute('x'))).toBeCloseTo(56 + BAND * (index + 0.5), 6));
  });

  test('the slider covers the plot, from the axis to 8 px before the drawing`s edge', () => {
    measure(640);
    render(ByModel);
    setPayload({ summary: week() });
    const slider = screen.getByRole('slider');
    expect(slider.getAttribute('x')).toBe('56');
    expect(slider.getAttribute('y')).toBe('0');
    expect(slider.getAttribute('width')).toBe(String(632 - 56));
    expect(slider.getAttribute('height')).toBe(String(PLOT_HEIGHT));
  });

  test('the band under the cursor is highlighted, wider than the column', async () => {
    measure(640);
    const user = userEvent.setup();
    const { container } = render(ByModel);
    setPayload({ summary: week() });
    await focusSlider(user);
    const mark = container.querySelector('rect.column-mark');
    expect(Number(mark?.getAttribute('x'))).toBeCloseTo(56 + BAND * 6, 6);
    expect(Number(mark?.getAttribute('width'))).toBeCloseTo(BAND, 6);
    expect(mark?.getAttribute('y')).toBe('0');
    expect(mark?.getAttribute('height')).toBe(String(PLOT_HEIGHT));
    await user.keyboard('{Home}');
    expect(Number(container.querySelector('rect.column-mark')?.getAttribute('x'))).toBeCloseTo(56, 6);
  });

  test('the tooltip stands a gap right of the band`s middle', async () => {
    measure(640);
    const user = userEvent.setup();
    render(ByModel);
    setPayload({ summary: week() });
    await focusSlider(user);
    // the band's middle is 56 + 6.5 bands; the tooltip is 12 px right of it
    expect(parseFloat(tooltip()?.style.left ?? '')).toBeCloseTo(56 + BAND * 6.5 + 12, 3);
    await user.keyboard('{Home}');
    expect(parseFloat(tooltip()?.style.left ?? '')).toBeCloseTo(56 + BAND * 0.5 + 12, 3);
  });
});

describe('the cursor', () => {
  test('one slider over the days, reading the day and its total', () => {
    render(ByModel);
    setPayload({ summary: week() });
    const slider = screen.getByRole('slider', { name: 'Estimated cost per day; arrow keys step through them' });
    expect(screen.getAllByRole('slider')).toHaveLength(1);
    expect(slider).toHaveAttribute('aria-valuemin', '1');
    expect(slider).toHaveAttribute('aria-valuemax', '7');
    expect(slider).toHaveAttribute('aria-valuenow', '7');
    expect(slider.getAttribute('aria-valuetext')).toMatch(/: \$4\.00$/);
  });

  test('a single day has its hours for buckets', () => {
    render(ByModel);
    setPayload({ summary: today() });
    expect(screen.getByRole('slider')).toHaveAccessibleName('Estimated cost per hour; arrow keys step through them');
    expect(screen.getByRole('slider')).toHaveAttribute('aria-valuemax', '13');
  });

  test('nothing is marked until the cursor is on a bucket', () => {
    const { container } = render(ByModel);
    setPayload({ summary: week() });
    expect(container.querySelector('.column-mark')).toBeNull();
    expect(tooltip()).toBeNull();
  });

  test('arrow keys step, Home and End go to the ends, the text following', async () => {
    const user = userEvent.setup();
    render(ByModel);
    setPayload({ summary: week() });
    await focusSlider(user);
    const slider = screen.getByRole('slider');
    await user.keyboard('{ArrowLeft}');
    expect(slider).toHaveAttribute('aria-valuenow', '6');
    expect(slider.getAttribute('aria-valuetext')).toMatch(/: \$3\.00$/);
    await user.keyboard('{ArrowRight}');
    expect(slider).toHaveAttribute('aria-valuenow', '7');
    await user.keyboard('{Home}');
    expect(slider).toHaveAttribute('aria-valuenow', '1');
    expect(slider.getAttribute('aria-valuetext')).toMatch(/: \$0\.00$/);
    await user.keyboard('{End}');
    expect(slider).toHaveAttribute('aria-valuenow', '7');
  });

  test('the highlight and the tooltip go when focus leaves', async () => {
    const user = userEvent.setup();
    const { container } = render(ByModel);
    setPayload({ summary: week() });
    await focusSlider(user);
    expect(container.querySelector('.column-mark')).not.toBeNull();
    expect(tooltip()).not.toBeNull();
    await user.tab();
    expect(container.querySelector('.column-mark')).toBeNull();
    expect(tooltip()).toBeNull();
  });

  test('the pointer picks the bucket under it', async () => {
    measure(640);
    const { container } = render(ByModel);
    setPayload({ summary: week() });
    layOut(0, 640);
    const slider = screen.getByRole('slider');
    // the second band: 56 + BAND to 56 + 2 BAND
    await fireEvent.pointerMove(slider, { clientX: 56 + BAND * 1.5 });
    expect(slider).toHaveAttribute('aria-valuenow', '2');
    expect(Number(container.querySelector('rect.column-mark')?.getAttribute('x'))).toBeCloseTo(56 + BAND, 6);
    await fireEvent.pointerMove(slider, { clientX: 56 + BAND * 4.1 });
    expect(slider).toHaveAttribute('aria-valuenow', '5');
    await fireEvent.pointerLeave(slider);
    expect(container.querySelector('.column-mark')).toBeNull();
  });

  test('a container narrower than the drawing scales the pointer back into it', async () => {
    measure(320);
    render(ByModel);
    setPayload({ summary: week() });
    // the drawing is the 320 minimum, the container 320: no scaling; a box half as wide maps twice as far
    layOut(0, 160);
    const slider = screen.getByRole('slider');
    const band = (312 - 56) / 7;
    await fireEvent.pointerMove(slider, { clientX: (56 + band * 2.5) / 2 });
    expect(slider).toHaveAttribute('aria-valuenow', '3');
  });
});

describe('the tooltip', () => {
  async function shown(summaryToShow = week()) {
    const user = userEvent.setup();
    const view = render(ByModel);
    setPayload({ summary: summaryToShow });
    await focusSlider(user);
    return { user, ...view };
  }

  test('names the day, then each model with its total and its efforts below, max first', async () => {
    await shown();
    const box = tooltip() as HTMLElement;
    expect(box.querySelector('.when')?.textContent).toBe(
      screen.getByRole('slider').getAttribute('aria-valuetext')?.split(':')[0],
    );
    const lines = [...box.querySelectorAll('.tip-line')];
    expect(lines.map((line) => line.className)).toEqual([
      'tip-line tip-model',
      'tip-line tip-effort',
      'tip-line tip-effort',
      'tip-line tip-model',
      'tip-line tip-effort',
      'tip-line tip-total',
    ]);
    expect(lines.map((line) => line.firstElementChild?.textContent)).toEqual([
      'claude-opus-4',
      'ultracode',
      'high',
      'claude-sonnet-4',
      'no effort level',
      'Total',
    ]);
    expect(lines.map((line) => line.querySelector('.tip-value')?.textContent)).toEqual([
      '$3.00',
      '$1.00',
      '$2.00',
      '$1.00',
      '$1.00',
      '$4.00',
    ]);
  });

  test('an effort line has the swatch of its series, hatched for ultracode', async () => {
    const backgrounds = recordBackgrounds();
    await shown();
    expect(tooltip()?.querySelectorAll('.tip-effort .swatch')).toHaveLength(3);
    // the legend's three come first
    expect(backgrounds.slice(3)).toEqual([
      `repeating-linear-gradient(135deg, ${OPUS_ULTRACODE_HATCH} 0 1.5px, ${OPUS_ULTRACODE} 1.5px 4px)`,
      OPUS_HIGH,
      'var(--series-2)',
    ]);
    expect(tooltip()?.querySelector('.tip-model .swatch')).toBeNull();
  });

  test('a day with one model has no total line', async () => {
    const { user } = await shown();
    await user.keyboard('{ArrowLeft}');
    const lines = [...(tooltip()?.querySelectorAll('.tip-line') ?? [])];
    expect(lines.map((line) => line.firstElementChild?.textContent)).toEqual(['claude-opus-4', 'high']);
    expect(tooltip()?.querySelector('.tip-total')).toBeNull();
  });

  test('a day without usage says so, and has no lines', async () => {
    const { user } = await shown();
    await user.keyboard('{Home}');
    expect(tooltip()?.querySelector('.name')).toHaveTextContent(/^No usage$/);
    expect(tooltip()?.querySelector('.tip-line')).toBeNull();
  });

  test('its values follow the metric', async () => {
    localStorage.setItem('claude-usage.metric', 'output');
    await shown();
    expect(texts('.tip-value', tooltip() as HTMLElement)).toEqual(['300', '100', '200', '50', '50', '350']);
  });

  test('a single day`s hour reads the same: the model and its effort, no total for one model', async () => {
    const { user } = await shown(today());
    // the last hour of the day so far is 12:00, the hour with usage 09:00
    await user.keyboard('{ArrowLeft}{ArrowLeft}{ArrowLeft}');
    expect(screen.getByRole('slider')).toHaveAttribute('aria-valuenow', '10');
    const box = tooltip() as HTMLElement;
    expect(texts('.tip-line > :first-child', box)).toEqual(['claude-opus-4', 'max']);
    expect(texts('.tip-value', box)).toEqual(['$3.00', '$3.00']);
  });
});

describe('the table view', () => {
  async function shown(summaryToShow = week()) {
    const user = userEvent.setup();
    const view = render(ByModel);
    setPayload({ summary: summaryToShow });
    await user.click(screen.getByRole('button', { name: 'Table view' }));
    return { user, ...view };
  }

  test('is not drawn until the toggle is pressed', () => {
    render(ByModel);
    setPayload({ summary: week() });
    expect(screen.queryByRole('table')).toBeNull();
    expect(screen.getByRole('button', { name: 'Table view' })).toHaveAttribute('aria-pressed', 'false');
  });

  test('is headed Day, a column per series and the total, the numbers aligned right', async () => {
    await shown();
    expect(screen.getByRole('button', { name: 'Table view' })).toHaveAttribute('aria-pressed', 'true');
    const heads = screen.getAllByRole('columnheader');
    expect(heads.map((head) => head.textContent)).toEqual([
      'Day',
      'claude-opus-4 · effort high',
      'claude-opus-4 · effort ultracode',
      'claude-sonnet-4 · no effort level',
      'Total',
    ]);
    expect(heads.map((head) => head.classList.contains('num'))).toEqual([false, true, true, true, true]);
  });

  test('has the newest day first, dashes where a series used nothing', async () => {
    await shown();
    const rows = screen.getAllByRole('row').slice(1);
    expect(rows).toHaveLength(7);
    const newest = within(rows[0] as HTMLElement).getAllByRole('cell');
    expect(newest.slice(1).map((cell) => cell.textContent)).toEqual(['$2.00', '$1.00', '$1.00', '$4.00']);
    expect(newest.map((cell) => cell.classList.contains('num'))).toEqual([false, true, true, true, true]);
    const yesterday = within(rows[1] as HTMLElement).getAllByRole('cell');
    expect(yesterday.slice(1).map((cell) => cell.textContent)).toEqual(['$3.00', '–', '–', '$3.00']);
    const empty = within(rows[2] as HTMLElement).getAllByRole('cell');
    expect(empty.slice(1).map((cell) => cell.textContent)).toEqual(['–', '–', '–', '$0.00']);
  });

  test('a single day is headed Hour', async () => {
    await shown(today());
    expect(screen.getAllByRole('columnheader')[0]).toHaveTextContent('Hour');
    expect(screen.getAllByRole('row')).toHaveLength(14);
  });

  test('pressing again hides it, the chart stays', async () => {
    const { user, container } = await shown();
    const svg = container.querySelector('svg');
    await user.click(screen.getByRole('button', { name: 'Table view' }));
    expect(screen.queryByRole('table')).toBeNull();
    expect(container.querySelector('svg')).toBe(svg);
  });

  test('a month pages from the newest day, under the key of the table', async () => {
    const { user } = await shown(month());
    expect(screen.getByRole('group', { name: 'Pages' })).toBeInTheDocument();
    expect(screen.getByText('rows 1–25 of 30')).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: 'Rows per page' }).id).toBe('pager-chart-table-size');
    expect(screen.getAllByRole('row')).toHaveLength(26);
    await user.click(screen.getByRole('button', { name: 'Next ›' }));
    expect(screen.getByText('rows 26–30 of 30')).toBeInTheDocument();
    expect(screen.getAllByRole('row')).toHaveLength(6);
  });

  test('a week shows no pager', async () => {
    await shown();
    expect(screen.queryByRole('group', { name: 'Pages' })).toBeNull();
  });

  test('the page is kept when a new summary comes', async () => {
    const { user } = await shown(month());
    await user.click(screen.getByRole('button', { name: 'Next ›' }));
    setPayload({ summary: month() });
    expect(screen.getByText('rows 26–30 of 30')).toBeInTheDocument();
  });
});

describe('a new summary', () => {
  test('updates the chart in place: the same svg and slider, the new values', () => {
    const { container } = render(ByModel);
    setPayload({ summary: week() });
    const svg = container.querySelector('svg');
    const slider = screen.getByRole('slider');
    setPayload({
      summary: summary({ day_model_effort: [dayRow('2026-09-30', 'claude-opus-4', 'high', { cost: 4 })] }),
    });
    expect(container.querySelector('svg')).toBe(svg);
    expect(screen.getByRole('slider')).toBe(slider);
    expect(segments()).toHaveLength(1);
    expect(texts('.value-text', container)).toEqual(['$4.00']);
    expect(texts('.legend .legend-group > span', container)).toEqual(['high']);
  });

  test('another range changes the buckets and the heading, the card staying', () => {
    render(ByModel);
    setPayload({ summary: week() });
    const card = screen.getByRole('region');
    expect(screen.getByRole('slider')).toHaveAttribute('aria-valuemax', '7');
    setPayload({ summary: month() });
    expect(screen.getByRole('slider')).toHaveAttribute('aria-valuemax', '30');
    setPayload({ summary: today() });
    expect(screen.getByRole('slider')).toHaveAttribute('aria-valuemax', '13');
    expect(screen.getByRole('region')).toBe(card);
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Per hour, by model and effort');
  });

  test('the metric and the table toggle are kept', async () => {
    const user = userEvent.setup();
    render(ByModel);
    setPayload({ summary: week() });
    await user.click(metricButton('Input tokens'));
    await user.click(screen.getByRole('button', { name: 'Table view' }));
    setPayload({ summary: month() });
    expect(metricButton('Input tokens')).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  test('the table is updated in place, its rows keeping their nodes by bucket', async () => {
    const user = userEvent.setup();
    render(ByModel);
    setPayload({ summary: week() });
    await user.click(screen.getByRole('button', { name: 'Table view' }));
    const before = screen.getAllByRole('row');
    setPayload({
      summary: summary({ day_model_effort: [dayRow('2026-09-30', 'claude-opus-4', 'high', { cost: 9 })] }),
    });
    const after = screen.getAllByRole('row');
    after.forEach((row, index) => expect(row).toBe(before[index]));
    expect(within(after[1] as HTMLElement).getAllByRole('cell')[1]).toHaveTextContent('$9.00');
  });

  test('the theme changes the heading in place', () => {
    render(ByModel);
    setPayload({ summary: week() });
    const heading = screen.getByRole('heading', { level: 2 });
    preferences.theme = 'hacker';
    flushSync();
    expect(screen.getByRole('heading', { level: 2 })).toBe(heading);
    expect(heading).toHaveTextContent('top -o model,effort');
  });

  test('losing the summary takes the chart away again without throwing', () => {
    const { container } = render(ByModel);
    setPayload({ summary: week() });
    payload.reset();
    flushSync();
    expect(container.querySelector('svg')).toBeNull();
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Per day, by model');
    expect(container.querySelector('.legend')?.children).toHaveLength(0);
  });
});
