import { screen, within } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { flushSync } from 'svelte';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { pagePerTest } from '../app/app.testing';
import type { DayModelUsage, HourModelUsage } from '../api/api';
import { summary, usage } from '../api/fixtures';
import { panelBox, trendHeight } from './trend';
import OverTime from './OverTime.svelte';

const page = pagePerTest();

function dayRow(day: string, changes: Partial<DayModelUsage> = {}): DayModelUsage {
  return { ...usage(), day, model: 'claude-opus-4', ...changes };
}

function hourRow(hour: string, changes: Partial<HourModelUsage> = {}): HourModelUsage {
  return { ...usage(), hour, model: 'claude-opus-4', ...changes };
}

/** A week up to today, with cost on the last two days. */
function week() {
  return summary({
    day_model: [dayRow('2026-09-29', { cost: 1 }), dayRow('2026-09-30', { cost: 2, output: 1500 })],
  });
}

/** A month up to today: 30 days, one row each, the cost its day of the month. */
function month() {
  const days = Array.from({ length: 30 }, (_unused, index) => `2026-09-${String(index + 1).padStart(2, '0')}`);
  return summary({ days: 30, since: '2026-09-01', day_model: days.map((day, index) => dayRow(day, { cost: index })) });
}

function today() {
  return summary({ days: 1, since: '2026-09-30', hour_model: [hourRow('2026-09-30T09', { cost: 3 })] });
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

beforeEach(() => {
  // the buckets run up to now; only the clock is faked, so that user-event keeps its timers
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(new Date(2026, 8, 30, 12, 0, 0));
  localStorage.clear();
  page.app.preferences.pageSize = 25;
  measure(0);
});

afterEach(() => {
  vi.useRealTimers();
  localStorage.clear();
  Reflect.deleteProperty(HTMLElement.prototype, 'clientWidth');
});

describe('the card', () => {
  test('a section named by its heading, with the note for days before any summary', () => {
    const { container } = page.render(OverTime);
    expect(screen.getByRole('region', { name: 'Over time' })).toHaveClass('card');
    expect(container.querySelector('.muted')).toHaveTextContent(/^estimated cost, input and output tokens per day$/);
    expect(screen.getByRole('button', { name: 'Table view' })).toHaveAttribute('aria-pressed', 'false');
  });

  test('without a summary there is a chart container and nothing in it', () => {
    const { container } = page.render(OverTime);
    expect(container.querySelector('.chart')).toBeEmptyDOMElement();
    expect(container.querySelector('svg')).toBeNull();
  });

  test('without a summary the table view has no table', async () => {
    const user = userEvent.setup();
    page.render(OverTime);
    await user.click(screen.getByRole('button', { name: 'Table view' }));
    expect(screen.queryByRole('table')).toBeNull();
  });

  test('a single day says its unit in the note and the drawing`s name', () => {
    const { container } = page.render(OverTime);
    page.set({ summary: today() });
    expect(container.querySelector('.muted')).toHaveTextContent(/^estimated cost, input and output tokens per hour$/);
    expect(screen.getByRole('img')).toHaveAccessibleName(
      'Estimated cost, input tokens and output tokens per hour; table view available',
    );
  });

  test('the heading is in the theme`s words', () => {
    page.app.preferences.theme = 'hacker';
    page.render(OverTime);
    expect(screen.getByRole('region', { name: 'git log --graph' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(/^git log --graph$/);
  });
});

describe('the chart', () => {
  test('a summary draws it at once: an image named for the unit, at the panels` height', () => {
    const { container } = page.render(OverTime);
    page.set({ summary: week() });
    const svg = container.querySelector('svg');
    expect(svg?.getAttribute('height')).toBe(String(trendHeight()));
    expect(screen.getByRole('img')).toHaveAccessibleName(
      'Estimated cost, input tokens and output tokens per day; table view available',
    );
  });

  test('it is as wide as its container, but not narrower than the minimum', () => {
    measure(640);
    const { container } = page.render(OverTime);
    page.set({ summary: week() });
    expect(container.querySelector('svg')?.getAttribute('viewBox')).toBe(`0 0 640 ${trendHeight()}`);
  });

  test('an unmeasured container draws at the minimum width', () => {
    const { container } = page.render(OverTime);
    page.set({ summary: week() });
    expect(container.querySelector('svg')?.getAttribute('viewBox')).toBe(`0 0 320 ${trendHeight()}`);
  });

  test('three panels, each titled, with its latest value at the line`s end', () => {
    const { container } = page.render(OverTime);
    page.set({ summary: week() });
    expect(texts('.panel-title', container)).toEqual(['Estimated cost', 'Input tokens', 'Output tokens']);
    expect(texts('.value-text', container)).toEqual(['$2.00', '1.2K', '1.5K']);
  });

  test('each panel has a line key, a line, its area and an end dot, in its own series color', () => {
    const { container } = page.render(OverTime);
    page.set({ summary: week() });
    const keys = [...container.querySelectorAll('g[role="img"] > line[stroke-linecap="round"]')];
    expect(keys.map((key) => key.getAttribute('stroke'))).toEqual([
      'var(--series-1)',
      'var(--series-2)',
      'var(--series-3)',
    ]);
    expect(keys.map((key) => key.getAttribute('y1'))).toEqual(
      [0, 1, 2].map((position) => String(panelBox(position).top - 10)),
    );
    expect(container.querySelectorAll('path[fill-opacity="0.1"]')).toHaveLength(3);
    expect(container.querySelectorAll('circle')).toHaveLength(3);
  });

  test('each panel has its own axis, scaled to a nice top of its own', () => {
    const { container } = page.render(OverTime);
    page.set({ summary: week() });
    const axis = texts('.axis-text[text-anchor="end"]', container);
    expect(axis).toHaveLength(9);
    expect(axis.slice(0, 3)).toEqual(['$0.00', '$1.00', '$2.00']);
    expect(axis.slice(3, 6)).toEqual(['0', '1K', '2K']);
    expect(axis.slice(6)).toEqual(['0', '1K', '2K']);
  });

  test('x labels run along the bottom, one per day of the week', () => {
    const { container } = page.render(OverTime);
    page.set({ summary: week() });
    const labels = [...container.querySelectorAll('.axis-text[text-anchor="middle"]')];
    expect(labels).toHaveLength(7);
    expect(labels.every((label) => label.getAttribute('y') === String(panelBox(2).bottom + 18))).toBe(true);
  });
});

describe('the drawing`s geometry', () => {
  test('the lines run from the axis to the right padding, each ending in a dot and its value beside it', () => {
    measure(640);
    const { container } = page.render(OverTime);
    page.set({ summary: week() });
    const dots = [...container.querySelectorAll('circle')];
    expect(dots.map((dot) => dot.getAttribute('cx'))).toEqual(['576', '576', '576']);
    expect(texts('.value-text', container)).toHaveLength(3);
    expect([...container.querySelectorAll('.value-text')].map((text) => text.getAttribute('x'))).toEqual([
      '585',
      '585',
      '585',
    ]);
  });

  test('a panel`s line key is a short stroke at the axis, left of its title', () => {
    measure(640);
    const { container } = page.render(OverTime);
    page.set({ summary: week() });
    const key = container.querySelector('g[role="img"] > line[stroke-linecap="round"]');
    expect([key?.getAttribute('x1'), key?.getAttribute('x2')]).toEqual(['56', '70']);
    expect(container.querySelector('.panel-title')?.getAttribute('x')).toBe('76');
  });

  test('each value is scaled to its own panel`s top: a peak sits at the plot`s top, 1.2K of 2K three fifths up', () => {
    measure(640);
    const { container } = page.render(OverTime);
    page.set({ summary: week() });
    const heights = [...container.querySelectorAll('circle')].map((dot) => Number(dot.getAttribute('cy')));
    expect(heights[0]).toBeCloseTo(panelBox(0).top);
    expect(heights[1]).toBeCloseTo(panelBox(1).bottom - 76 * 0.6);
    expect(heights[2]).toBeCloseTo(panelBox(2).bottom - 76 * 0.75);
  });

  test('the crosshair stands at the last bucket`s x, the tooltip a gap right of it', async () => {
    measure(640);
    const user = userEvent.setup();
    const { container } = page.render(OverTime);
    page.set({ summary: week() });
    await focusSlider(user);
    expect(container.querySelector('.crosshair')?.getAttribute('x1')).toBe('576');
    expect(container.querySelector<HTMLElement>('.tooltip')?.style.left).toBe('588px');
  });
});

describe('the cursor', () => {
  test('one slider over the days, reading the day and each panel`s value', () => {
    page.render(OverTime);
    page.set({ summary: week() });
    const slider = screen.getByRole('slider', {
      name: 'Estimated cost, input and output tokens per day; arrow keys step through them',
    });
    expect(screen.getAllByRole('slider')).toHaveLength(1);
    expect(slider).toHaveAttribute('aria-valuemin', '1');
    expect(slider).toHaveAttribute('aria-valuemax', '7');
    expect(slider).toHaveAttribute('aria-valuenow', '7');
    expect(slider.getAttribute('aria-valuetext')).toMatch(
      /: Estimated cost \$2\.00, Input tokens 1\.2K, Output tokens 1\.5K$/,
    );
  });

  test('the slider covers the plots, from the axis to the padding at the right', () => {
    measure(640);
    page.render(OverTime);
    page.set({ summary: week() });
    const slider = screen.getByRole('slider');
    expect(slider.getAttribute('x')).toBe('56');
    expect(slider.getAttribute('width')).toBe(String(640 - 64 - 56));
    expect(slider.getAttribute('height')).toBe(String(panelBox(2).bottom));
  });

  test('nothing is marked until the cursor is on a bucket', () => {
    const { container } = page.render(OverTime);
    page.set({ summary: week() });
    expect(container.querySelector('.crosshair')).toBeNull();
    expect(container.querySelector('.tooltip')).toBeNull();
  });

  test('stepping with the keyboard shows the crosshair, a dot per panel and the tooltip of the day', async () => {
    const user = userEvent.setup();
    const { container } = page.render(OverTime);
    page.set({ summary: week() });
    await focusSlider(user);
    const slider = screen.getByRole('slider');
    await user.keyboard('{ArrowLeft}');
    expect(slider).toHaveAttribute('aria-valuenow', '6');
    const crosshair = container.querySelector('.crosshair');
    expect(crosshair?.getAttribute('y1')).toBe('18');
    expect(crosshair?.getAttribute('y2')).toBe(String(panelBox(2).bottom));
    expect(crosshair?.getAttribute('x1')).toBe(crosshair?.getAttribute('x2'));
    // the three end dots and one more for each panel at the bucket
    expect(container.querySelectorAll('circle')).toHaveLength(6);
    const tooltip = container.querySelector<HTMLElement>('.tooltip');
    expect(tooltip?.querySelector('.when')?.textContent).toBe(slider.getAttribute('aria-valuetext')?.split(':')[0]);
    const rows = [...(tooltip?.querySelectorAll('.row') ?? [])];
    expect(rows.map((row) => row.querySelector('strong')?.textContent)).toEqual(['$1.00', '1.2K', '50']);
    expect(rows.map((row) => row.querySelector('.name')?.textContent)).toEqual([
      'Estimated cost',
      'Input tokens',
      'Output tokens',
    ]);
    expect(rows.map((row) => row.querySelector<HTMLElement>('span.key')?.style.background)).toEqual([
      'var(--series-1)',
      'var(--series-2)',
      'var(--series-3)',
    ]);
  });

  test('the crosshair and the tooltip go when focus leaves', async () => {
    const user = userEvent.setup();
    const { container } = page.render(OverTime);
    page.set({ summary: week() });
    await focusSlider(user);
    expect(container.querySelector('.crosshair')).not.toBeNull();
    await user.tab();
    expect(container.querySelector('.crosshair')).toBeNull();
    expect(container.querySelector('.tooltip')).toBeNull();
  });

  test('Home takes the crosshair to the first bucket, at the plots` left edge', async () => {
    const user = userEvent.setup();
    const { container } = page.render(OverTime);
    page.set({ summary: week() });
    await focusSlider(user);
    await user.keyboard('{Home}');
    expect(container.querySelector('.crosshair')?.getAttribute('x1')).toBe('56');
    expect(screen.getByRole('slider')).toHaveAttribute('aria-valuenow', '1');
  });
});

describe('the table view', () => {
  async function shown(summaryToShow = week()) {
    const user = userEvent.setup();
    const view = page.render(OverTime);
    page.set({ summary: summaryToShow });
    await user.click(screen.getByRole('button', { name: 'Table view' }));
    return { user, ...view };
  }

  test('is named by the card heading', async () => {
    await shown();
    expect(screen.getByRole('table', { name: 'Over time' })).toBeInTheDocument();
  });

  test('the toggle shows a table headed Day, then each panel, the numbers aligned right', async () => {
    await shown();
    expect(screen.getByRole('button', { name: 'Table view' })).toHaveAttribute('aria-pressed', 'true');
    const heads = screen.getAllByRole('columnheader');
    expect(heads.map((head) => head.textContent)).toEqual(['Day', 'Estimated cost', 'Input tokens', 'Output tokens']);
    expect(heads.map((head) => head.classList.contains('num'))).toEqual([false, true, true, true]);
  });

  test('the newest day is the first row, its numbers in num cells', async () => {
    await shown();
    const rows = screen.getAllByRole('row').slice(1);
    expect(rows).toHaveLength(7);
    const cells = within(rows[0] as HTMLElement).getAllByRole('cell');
    expect(cells.slice(1).map((cell) => cell.textContent)).toEqual(['$2.00', '1.2K', '1.5K']);
    expect(cells.map((cell) => cell.classList.contains('num'))).toEqual([false, true, true, true]);
    expect(within(rows[1] as HTMLElement).getAllByRole('cell')[1]).toHaveTextContent('$1.00');
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
    expect(screen.getByRole('combobox', { name: 'Rows per page' }).id).toBe('pager-trend-table-size');
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
    page.set({ summary: month() });
    expect(screen.getByText('rows 26–30 of 30')).toBeInTheDocument();
  });
});

describe('a new summary', () => {
  test('updates the chart in place: the same svg, the new values', () => {
    const { container } = page.render(OverTime);
    page.set({ summary: week() });
    const svg = container.querySelector('svg');
    const slider = screen.getByRole('slider');
    page.set({ summary: summary({ day_model: [dayRow('2026-09-30', { cost: 4 })] }) });
    expect(container.querySelector('svg')).toBe(svg);
    expect(screen.getByRole('slider')).toBe(slider);
    expect(texts('.value-text', container)[0]).toBe('$4.00');
  });

  test('another range changes the buckets and the note', () => {
    const { container } = page.render(OverTime);
    page.set({ summary: week() });
    expect(screen.getByRole('slider')).toHaveAttribute('aria-valuemax', '7');
    page.set({ summary: month() });
    expect(screen.getByRole('slider')).toHaveAttribute('aria-valuemax', '30');
    page.set({ summary: today() });
    flushSync();
    expect(screen.getByRole('slider')).toHaveAttribute('aria-valuemax', '13');
    expect(container.querySelector('.muted')).toHaveTextContent('per hour');
  });

  test('the table is updated in place too, its rows keeping their nodes by bucket', async () => {
    const user = userEvent.setup();
    page.render(OverTime);
    page.set({ summary: week() });
    await user.click(screen.getByRole('button', { name: 'Table view' }));
    const before = screen.getAllByRole('row');
    page.set({ summary: summary({ day_model: [dayRow('2026-09-30', { cost: 9 })] }) });
    const after = screen.getAllByRole('row');
    after.forEach((row, index) => expect(row).toBe(before[index]));
    expect(within(after[1] as HTMLElement).getAllByRole('cell')[1]).toHaveTextContent('$9.00');
  });

  test('the theme changes the heading in place', () => {
    page.render(OverTime);
    const heading = screen.getByRole('heading', { level: 2 });
    page.app.preferences.theme = 'hacker';
    flushSync();
    expect(screen.getByRole('heading', { level: 2 })).toBe(heading);
    expect(heading).toHaveTextContent('git log --graph');
  });
});
