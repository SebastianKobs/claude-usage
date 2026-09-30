// @vitest-environment jsdom
import { render, screen, within } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { flushSync } from 'svelte';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { pagePerTest } from '../lib/app.testing';
import type { Agent, ContextTurn, SessionDetail } from '../lib/api';
import { agent, compaction, contextTurn, sessionDetail, versusKeeping } from '../lib/fixtures';
import ContextPerTurn from './ContextPerTurn.svelte';

const page = pagePerTest();

/** `count` turns a minute apart, the context growing by 10K from 10K, the parts adding up to it. */
function turnsOf(count: number, changes: Partial<ContextTurn> = {}): ContextTurn[] {
  return Array.from({ length: count }, (_unused, index) => {
    const context = 10_000 * (index + 1);
    return contextTurn({
      message_id: `m${index}`,
      ts: `2026-09-30T08:${String(index).padStart(2, '0')}:00.000Z`,
      context,
      new_input: 1_000,
      cache_write: 1_000,
      cache_read: context - 2_000,
      growth: index === 0 ? null : 10_000,
      ...changes,
    });
  });
}

/** The main thread with five turns. */
function main(changes: Partial<Agent> = {}): Agent {
  return agent({ context_per_turn: turnsOf(5), ...changes });
}

/** A subagent with three turns. */
function helper(changes: Partial<Agent> = {}): Agent {
  return agent({
    agent_id: 'a-1',
    agent_type: 'Explore',
    description: 'Find the callers',
    context_per_turn: turnsOf(3),
    ...changes,
  });
}

function session(agents: Agent[], changes: Partial<SessionDetail> = {}): SessionDetail {
  return sessionDetail({ agents, ...changes });
}

/** jsdom has no ResizeObserver, which the chart's container is measured with: this one reports at once. */
class ImmediateResizeObserver {
  callback: ResizeObserverCallback;

  constructor(callback: ResizeObserverCallback) {
    this.callback = callback;
  }

  observe(target: Element): void {
    this.callback([{ target } as ResizeObserverEntry], this as unknown as ResizeObserver);
  }

  unobserve(): void {}

  disconnect(): void {}
}

/** Gives every element a clientWidth, as a browser lays it out (the simulated DOM has none): 0 is not measured yet. */
function measure(width: number) {
  Object.defineProperty(HTMLElement.prototype, 'clientWidth', { configurable: true, get: () => width });
}

function texts(selector: string, root: ParentNode = document): (string | null)[] {
  return [...root.querySelectorAll(selector)].map((node) => node.textContent);
}

/** Which of the turn table's columns are numbers. */
const NUMERIC = [true, false, false, true, true, true, true, true, false];

const chart = () => document.getElementById('context-chart') as HTMLElement;
const picker = () => screen.getByRole('combobox', { name: 'Transcript the context section shows' });
const toggle = () => screen.getByRole('button', { name: 'Table view' });
/** The areas and columns of the stack: a filled path or rect in the plot's image. */
const fills = () => [...chart().querySelectorAll('g[role="img"] > [fill^="var(--context"]')];

beforeEach(() => {
  vi.stubGlobal('ResizeObserver', ImmediateResizeObserver);
  localStorage.clear();
  page.app.preferences.pageSize = 25;
  measure(0);
});

afterEach(() => {
  vi.unstubAllGlobals();
  for (const key of ['abc123-main', 'abc123-a-1', 'abc123-none', 'other-main']) {
    for (const name of ['turns', 'growth', 'compactions']) page.app.pages.forget(`${key}-${name}`);
  }
  localStorage.clear();
  Reflect.deleteProperty(HTMLElement.prototype, 'clientWidth');
});

describe('without a session', () => {
  test('there is nothing in the page', () => {
    const { container } = page.render(ContextPerTurn);
    expect(container.children).toHaveLength(0);
  });
});

describe('the head', () => {
  test('is the heading, the note, a spacer and the table toggle, in a chart head', () => {
    page.render(ContextPerTurn);
    page.set({ session: session([main()]) });
    const head = document.querySelector('.chart-head') as HTMLElement;
    expect([...head.children].map((child) => child.tagName)).toEqual(['H3', 'SPAN', 'SPAN', 'BUTTON']);
    expect(head.children[0]).toHaveTextContent(/^Context per turn$/);
    expect(head.children[1]).toHaveAttribute('id', 'context-note');
    expect(head.children[1]).toHaveClass('muted');
    expect(head.children[2]).toHaveClass('spacer');
    expect(head.children[3]).toHaveAttribute('id', 'context-table-toggle');
    expect(head.children[3]).toHaveAttribute('type', 'button');
    expect(toggle()).toHaveAttribute('aria-pressed', 'false');
  });

  test('is not themed', () => {
    page.app.preferences.theme = 'hacker';
    page.render(ContextPerTurn);
    page.set({ session: session([main()]) });
    expect(screen.getByRole('heading', { level: 3, name: 'Context per turn' })).toBeInTheDocument();
    page.app.preferences.theme = null;
  });

  test('the note names the transcript shown', () => {
    page.render(ContextPerTurn);
    page.set({ session: session([main()]) });
    expect(document.getElementById('context-note')).toHaveTextContent(
      /^main thread: every turn sends its whole context again$/,
    );
  });

  test('the note is empty where no transcript has turns', () => {
    page.render(ContextPerTurn);
    page.set({ session: session([agent()]) });
    expect(document.getElementById('context-note')?.textContent).toBe('');
  });
});

describe('the legend', () => {
  test('lists the parts dearest first, each after its swatch, then the compaction rule', () => {
    page.render(ContextPerTurn);
    page.set({ session: session([main()]) });
    const legend = document.querySelector('.legend') as HTMLElement;
    expect(texts(':scope > span', legend)).toEqual(['New input', 'Cache write', 'Cache read', 'compaction']);
    expect(legend.previousElementSibling).toHaveClass('chart-head');
    const swatches = [...legend.querySelectorAll<HTMLElement>('.swatch')];
    expect(swatches.map((swatch) => swatch.style.background)).toEqual([
      'var(--context-new)',
      'var(--context-write)',
      'var(--context-read)',
    ]);
    expect(legend.lastElementChild?.firstElementChild).toHaveClass('legend-rule');
  });
});

describe('the picker', () => {
  test('is not there with one transcript', () => {
    page.render(ContextPerTurn);
    page.set({ session: session([main()]) });
    expect(screen.queryByRole('combobox')).toBeNull();
  });

  test('is not there where the others have no turns', () => {
    page.render(ContextPerTurn);
    page.set({ session: session([main(), helper({ context_per_turn: [] })]) });
    expect(screen.queryByRole('combobox')).toBeNull();
  });

  test('offers the transcripts with turns, the main thread first, between the note and the toggle', () => {
    page.render(ContextPerTurn);
    page.set({ session: session([main(), helper()]) });
    expect(picker()).toHaveAttribute('id', 'context-agent');
    expect(picker().previousElementSibling).toHaveClass('spacer');
    expect(picker().nextElementSibling).toBe(toggle());
    expect(texts('option', picker())).toEqual(['main thread', 'Explore · Find the callers']);
    expect(picker()).toHaveValue('main');
  });

  test('groups a workflow run`s agents under the run`s name', () => {
    page.render(ContextPerTurn);
    const inRun = (id: string) =>
      helper({
        agent_id: id,
        agent_type: 'workflow-subagent',
        description: null,
        workflow_run: 'wf_1',
        workflow_name: 'review',
      });
    page.set({ session: session([main(), inRun('w-1'), inRun('w-2')]) });
    const group = picker().querySelector('optgroup') as HTMLElement;
    expect(group).toHaveAttribute('label', 'workflow · review');
    expect(texts('option', group)).toEqual(['workflow-subagent', 'workflow-subagent']);
    expect(picker().children).toHaveLength(2);
  });

  test('switches the note, the chart, the table view and the tiles to the transcript picked', async () => {
    const user = userEvent.setup();
    page.render(ContextPerTurn);
    page.set({ session: session([main(), helper()]) });
    await user.click(toggle());
    expect(chart().querySelector('g[role="img"]')).toHaveAccessibleName(
      /^Context per turn of the main thread, .* 5 turns/,
    );
    expect(document.querySelectorAll('#context-table tbody tr')).toHaveLength(5);
    await user.selectOptions(picker(), 'a-1');
    expect(document.getElementById('context-note')).toHaveTextContent(/^Explore · Find the callers: every turn/);
    expect(chart().querySelector('g[role="img"]')).toHaveAccessibleName(
      /^Context per turn of the Explore · Find the callers, .* 3 turns/,
    );
    expect(document.querySelectorAll('#context-table tbody tr')).toHaveLength(3);
    expect(picker()).toHaveValue('a-1');
  });

  test('shows the main thread again where the transcript picked is gone', async () => {
    const user = userEvent.setup();
    page.render(ContextPerTurn);
    page.set({ session: session([main(), helper()]) });
    await user.selectOptions(picker(), 'a-1');
    page.set({ session: session([main(), helper({ agent_id: 'a-2' })]) });
    expect(picker()).toHaveValue('main');
    expect(document.getElementById('context-note')).toHaveTextContent(/^main thread: /);
  });
});

describe('the chart', () => {
  test('is a div of the chart class, in the order: head, legend, chart, details', () => {
    page.render(ContextPerTurn);
    page.set({ session: session([main()]) });
    expect(chart()).toHaveClass('chart');
    expect(chart().previousElementSibling).toHaveClass('legend');
    expect(chart().nextElementSibling).toHaveAttribute('id', 'context-details');
  });

  test('says so where there are no turns', () => {
    page.render(ContextPerTurn);
    page.set({ session: session([agent()]) });
    expect(chart().querySelector('svg')).toBeNull();
    expect(chart().querySelector('.empty')).toHaveTextContent(/^No turns with usage\.$/);
  });

  test('is as wide as its container, at the plot`s height with the x labels` band', () => {
    measure(640);
    page.render(ContextPerTurn);
    page.set({ session: session([main()]) });
    expect(chart().querySelector('svg')).toHaveAttribute('viewBox', '0 0 640 206');
  });

  test('has the y axis up to the peak rounded up, in steps of a quarter', () => {
    page.render(ContextPerTurn);
    page.set({ session: session([main()]) });
    expect(texts('text.axis-text', chart()).slice(0, 5)).toEqual(['0', '12.5K', '25K', '37.5K', '50K']);
  });

  test('stacks the parts, cache read at the bottom, each with an edge of the surface on top', () => {
    page.render(ContextPerTurn);
    page.set({ session: session([main()]) });
    const areas = fills();
    expect(areas.map((area) => area.getAttribute('fill'))).toEqual([
      'var(--context-read)',
      'var(--context-write)',
      'var(--context-new)',
    ]);
    const edges = [...chart().querySelectorAll('path[stroke="var(--surface)"]')];
    expect(edges).toHaveLength(3);
    for (const edge of edges) {
      expect(edge).toHaveAttribute('fill', 'none');
      expect(edge).toHaveAttribute('stroke-width', '2');
      expect(edge).toHaveAttribute('stroke-linejoin', 'round');
    }
  });

  test('a single turn is a short column per part, not an area', () => {
    page.render(ContextPerTurn);
    page.set({ session: session([agent({ context_per_turn: turnsOf(1) })]) });
    expect(fills().map((shape) => shape.tagName)).toEqual(['rect', 'rect', 'rect']);
    expect(fills()[0]).toHaveAttribute('width', '12');
  });

  test('draws the baseline from the first turn to the last', () => {
    measure(640);
    page.render(ContextPerTurn);
    page.set({ session: session([main()]) });
    const baseline = chart().querySelector('line[stroke="var(--axis)"][y1="178"]');
    expect(baseline).toHaveAttribute('x1', '56');
    expect(baseline).toHaveAttribute('x2', '576');
    expect(baseline).toHaveAttribute('y2', '178');
  });

  test('marks the compact hint where the axis reaches it, labelled at the right', () => {
    measure(640);
    page.render(ContextPerTurn);
    page.set({ session: session([main()], { compact_hint_tokens: 40_000 }) });
    const line = chart().querySelector('line.reference-line');
    expect(line).toHaveAttribute('x1', '56');
    expect(line).toHaveAttribute('x2', '576');
    expect(line).toHaveAttribute('y1', '50.5');
    const label = [...chart().querySelectorAll('text.axis-text')].find((text) => text.textContent === 'hint 40K');
    expect(label).toHaveAttribute('x', '582');
    expect(label).toHaveAttribute('y', '54.5');
  });

  test('leaves the hint out where the axis stops short of it', () => {
    page.render(ContextPerTurn);
    page.set({ session: session([main()], { compact_hint_tokens: 200_000 }) });
    expect(chart().querySelector('.reference-line')).toBeNull();
  });

  test('puts a dashed rule before the first turn after a compaction, labelled by its trigger', () => {
    measure(640);
    page.render(ContextPerTurn);
    const compactions = [compaction({ ts: '2026-09-30T08:01:30.000Z', trigger: 'manual' })];
    page.set({ session: session([main({ compactions })]) });
    const rule = chart().querySelector('line.compaction-rule');
    // between the second turn (x 186) and the third (316)
    expect(rule).toHaveAttribute('x1', '251');
    expect(rule).toHaveAttribute('x2', '251');
    expect(rule).toHaveAttribute('y1', '14');
    expect(rule).toHaveAttribute('y2', '178');
    const label = [...chart().querySelectorAll('text.axis-text')].find((text) => text.textContent === '/compact');
    expect(label).toHaveAttribute('text-anchor', 'middle');
    expect(label).toHaveAttribute('y', '10');
  });

  test('labels a rule only where it has room, two close ones sharing the first label', () => {
    measure(640);
    page.render(ContextPerTurn);
    const compactions = [
      compaction({ ts: '2026-09-30T08:00:30.000Z' }),
      compaction({ ts: '2026-09-30T08:00:40.000Z' }),
    ];
    page.set({ session: session([main({ compactions })]) });
    expect(chart().querySelectorAll('line.compaction-rule')).toHaveLength(2);
    expect(texts('text.axis-text[y="10"]', chart())).toEqual(['auto-compact']);
  });

  test('draws no rule for a compaction without a turn after it', () => {
    page.render(ContextPerTurn);
    const compactions = [compaction({ ts: '2026-09-30T12:00:00.000Z' }), compaction({ ts: null })];
    page.set({ session: session([main({ compactions })]) });
    expect(chart().querySelector('.compaction-rule')).toBeNull();
  });

  test('labels the latest turn, and the peak where it is another', () => {
    page.render(ContextPerTurn);
    page.set({ session: session([main()]) });
    expect(texts('text.value-text', chart())).toEqual(['50K']);
    const turns = turnsOf(5).map((turn, index) => (index === 2 ? { ...turn, context: 90_000 } : turn));
    page.set({ session: session([agent({ context_per_turn: turns })]) });
    expect(texts('text.value-text', chart())).toEqual(['peak 90K', '50K']);
  });

  test('labels the turns along the x axis, the first as turn 1', () => {
    page.render(ContextPerTurn);
    page.set({ session: session([main()]) });
    const labels = texts('text.axis-text[y="196"]', chart());
    expect(labels).toEqual(['turn 1', '2', '3', '4', '5']);
  });
});

describe('the slider', () => {
  test('is one, over the turns, reading the turn and its parts', () => {
    measure(640);
    page.render(ContextPerTurn);
    page.set({ session: session([main()]) });
    const slider = screen.getByRole('slider', { name: 'Context per turn by part; arrow keys step through the turns' });
    expect(screen.getAllByRole('slider')).toHaveLength(1);
    expect(slider).toHaveAttribute('aria-valuemin', '1');
    expect(slider).toHaveAttribute('aria-valuemax', '5');
    expect(slider).toHaveAttribute('aria-valuenow', '5');
    expect(slider.getAttribute('aria-valuetext')).toMatch(
      /^Turn 5 of 5 · .+: context 50K, cache read 48K, cache write 1K, new input 1K, grew \+10K beyond the last reply$/,
    );
    expect(slider).toHaveAttribute('x', '56');
    expect(slider).toHaveAttribute('width', String(640 - 64 - 56));
    expect(slider).toHaveAttribute('height', '178');
  });

  test('shows nothing until it is used', () => {
    page.render(ContextPerTurn);
    page.set({ session: session([main()]) });
    expect(chart().querySelector('.crosshair')).toBeNull();
    expect(chart().querySelector('.tooltip')).toBeNull();
  });

  test('stepping shows the crosshair, a dot at the context and the tooltip of the turn', async () => {
    measure(640);
    const user = userEvent.setup();
    page.render(ContextPerTurn);
    page.set({ session: session([main()]) });
    screen.getByRole('slider').focus();
    await user.keyboard('{ArrowLeft}');
    expect(screen.getByRole('slider')).toHaveAttribute('aria-valuenow', '4');
    const crosshair = chart().querySelector('.crosshair');
    expect(crosshair).toHaveAttribute('x1', '446');
    expect(crosshair).toHaveAttribute('x2', '446');
    expect(crosshair).toHaveAttribute('y1', '18');
    expect(crosshair).toHaveAttribute('y2', '178');
    const dot = chart().querySelector('circle');
    expect(dot).toHaveAttribute('fill', 'var(--context-new)');
    expect(dot).toHaveAttribute('cx', '446');
    // 40K of 50K on a plot 160 high, 178 at the bottom
    expect(dot).toHaveAttribute('cy', '50');
    const tooltip = chart().querySelector('.tooltip') as HTMLElement;
    expect(tooltip.querySelector('.when')?.textContent).toMatch(/^Turn 4 of 5 · /);
  });

  test('the tooltip has a row per part dearest first with its swatch, then the context without one', async () => {
    const user = userEvent.setup();
    page.render(ContextPerTurn);
    page.set({ session: session([main()]) });
    screen.getByRole('slider').focus();
    await user.keyboard('{End}');
    const tooltip = chart().querySelector('.tooltip') as HTMLElement;
    const rows = [...tooltip.querySelectorAll('.row')];
    const valueAndName = (row: Element) => [
      row.querySelector('strong')?.textContent,
      row.querySelector('.name')?.textContent,
    ];
    expect(rows.map(valueAndName)).toEqual([
      ['1K', 'New input'],
      ['1K', 'Cache write'],
      ['48K', 'Cache read'],
      ['50K', 'context'],
    ]);
    expect(rows.slice(0, 3).map((row) => row.firstElementChild?.className)).toEqual(['swatch', 'swatch', 'swatch']);
    expect(rows[3]?.firstElementChild).toHaveClass('key');
    expect(rows[3]?.firstElementChild).not.toHaveClass('swatch');
    expect(texts(':scope > div.name', tooltip)).toEqual(['grew +10K beyond the last reply']);
  });

  test('the tooltip adds the cache rebuild of the turn and its effort', async () => {
    const user = userEvent.setup();
    const turns = turnsOf(3);
    turns[2] = {
      ...contextTurn({ ...turns[2], effort: 'high' }),
      rebuild: { cause: 'idle', lost: 25_000, extra_cost: 0.12 },
    };
    page.render(ContextPerTurn);
    page.set({ session: session([agent({ context_per_turn: turns })]) });
    screen.getByRole('slider').focus();
    await user.keyboard('{End}');
    const tooltip = chart().querySelector('.tooltip') as HTMLElement;
    expect(tooltip.querySelector('.when')?.textContent).toMatch(/ · effort high$/);
    expect(texts(':scope > div.name', tooltip)).toHaveLength(2);
    expect(texts(':scope > div.name', tooltip)[1]).toMatch(/^cache rebuilt: .+ \(25K, \+\$0\.12\)$/);
  });

  test('the crosshair and the tooltip go when focus leaves', async () => {
    const user = userEvent.setup();
    page.render(ContextPerTurn);
    page.set({ session: session([main()]) });
    screen.getByRole('slider').focus();
    await user.keyboard('{Home}');
    expect(chart().querySelector('.crosshair')).not.toBeNull();
    screen.getByRole('slider').blur();
    flushSync();
    expect(chart().querySelector('.crosshair')).toBeNull();
    expect(chart().querySelector('.tooltip')).toBeNull();
  });
});

describe('the table view', () => {
  test('is hidden until the toggle is pressed, then a table in a wrap of its id after the chart', async () => {
    const user = userEvent.setup();
    page.render(ContextPerTurn);
    page.set({ session: session([main()]) });
    expect(document.getElementById('context-table')).toBeNull();
    await user.click(toggle());
    expect(toggle()).toHaveAttribute('aria-pressed', 'true');
    const wrap = document.getElementById('context-table') as HTMLElement;
    expect(wrap).toHaveClass('table-wrap');
    expect(wrap.previousElementSibling).toBe(chart());
    expect(wrap.nextElementSibling).toHaveAttribute('id', 'context-details');
    await user.click(toggle());
    expect(document.getElementById('context-table')).toBeNull();
  });

  test('has a column per part, the numbers right-aligned, and a row per turn', async () => {
    const user = userEvent.setup();
    page.render(ContextPerTurn);
    page.set({ session: session([main()]) });
    await user.click(toggle());
    const table = within(document.getElementById('context-table') as HTMLElement).getByRole('table');
    const heads = within(table).getAllByRole('columnheader');
    expect(heads.map((head) => head.textContent)).toEqual([
      'Turn',
      'Time',
      'Effort',
      'Cache read',
      'Cache write',
      'New input',
      'Context',
      'Growth',
      'Cache rebuild',
    ]);
    expect(heads.map((head) => head.classList.contains('num'))).toEqual(NUMERIC);
    const rows = within(table).getAllByRole('row').slice(1);
    expect(rows).toHaveLength(5);
    const cells = within(rows[1] as HTMLElement).getAllByRole('cell');
    expect(cells.map((cell) => cell.textContent)).toEqual([
      '2',
      cells[1]?.textContent,
      '–',
      '18,000',
      '1,000',
      '1,000',
      '20,000',
      '+10K',
      '–',
    ]);
    expect(cells.map((cell) => cell.classList.contains('num'))).toEqual(NUMERIC);
  });

  test('says so where there are no turns', async () => {
    const user = userEvent.setup();
    page.render(ContextPerTurn);
    page.set({ session: session([agent()]) });
    await user.click(toggle());
    expect(document.querySelector('#context-table .empty')).toHaveTextContent(/^No turns with usage\.$/);
  });

  test('pages past ten turns, under the transcript`s key', async () => {
    const user = userEvent.setup();
    page.render(ContextPerTurn);
    page.set({ session: session([agent({ context_per_turn: turnsOf(30) })]) });
    await user.click(toggle());
    expect(document.querySelectorAll('#context-table tbody tr')).toHaveLength(25);
    expect(document.getElementById('pager-abc123-main-turns-size')).not.toBeNull();
  });
});

describe('the details', () => {
  test('are four tiles, the growth steps and the compactions, in a div of their id', () => {
    page.render(ContextPerTurn);
    page.set({ session: session([main()]) });
    const details = document.getElementById('context-details') as HTMLElement;
    expect(texts('.kpis.session-kpis .label', details)).toEqual([
      'Fixed overhead',
      'Cache rebuilds',
      'Compactions',
      'Growth per turn',
    ]);
    expect(texts('h3', details)).toEqual(['Biggest growth steps', 'Compactions']);
  });

  test('are empty without a transcript with turns', () => {
    page.render(ContextPerTurn);
    page.set({ session: session([agent()]) });
    expect(document.getElementById('context-details')).toBeEmptyDOMElement();
  });

  test('follow the transcript picked', async () => {
    const user = userEvent.setup();
    page.render(ContextPerTurn);
    const compactions = [compaction(), compaction({ ts: '2026-09-30T09:30:00.000Z' })];
    page.set({ session: session([main(), helper({ compactions })]) });
    const details = document.getElementById('context-details') as HTMLElement;
    expect(within(details).getByText('Compactions', { selector: '.label' }).nextElementSibling).toHaveTextContent('0');
    await user.selectOptions(picker(), 'a-1');
    expect(within(details).getByText('Compactions', { selector: '.label' }).nextElementSibling).toHaveTextContent('2');
  });
});

describe('the growth steps', () => {
  test('say so where no turn grew the context', () => {
    page.render(ContextPerTurn);
    page.set({ session: session([main()]) });
    expect(document.querySelector('#context-details .empty')).toHaveTextContent(/^No turn grew the context\.$/);
  });

  test('are a row per step, with the tools the call before ran', () => {
    page.render(ContextPerTurn);
    const top_growth = [
      {
        message_id: 'm3',
        ts: '2026-09-30T08:03:00.000Z',
        growth: 10_000,
        tools: [{ tool: 'Read', result_chars: 12_400 }],
      },
      { message_id: 'm1', ts: '2026-09-30T08:01:00.000Z', growth: 9_000, tools: [] },
    ];
    page.set({ session: session([main({ top_growth })]) });
    const table = screen.getByRole('table');
    const rows = within(table).getAllByRole('row').slice(1);
    expect(within(rows[0] as HTMLElement).getAllByRole('cell').map((cell) => cell.textContent)).toEqual([
      '4',
      expect.any(String),
      '10K',
      'Read 12.4K',
    ]);
    expect(within(rows[1] as HTMLElement).getAllByRole('cell')[3]).toHaveTextContent('none: a prompt or attachments');
  });
});

describe('the compactions', () => {
  const heading = () => screen.getByRole('heading', { level: 3, name: /^Compactions/ });
  /** The compactions' table: the last one, as the growth steps have none where no turn grew. */
  const compactionsTable = () =>
    [...document.querySelectorAll<HTMLElement>('#context-details table')].at(-1) as HTMLElement;

  test('say so where there are none, with no total and no note', () => {
    page.render(ContextPerTurn);
    page.set({ session: session([main()]) });
    expect(heading()).toHaveTextContent(/^Compactions$/);
    expect(heading().querySelector('.compaction-total')).toBeNull();
    expect(document.querySelector('#context-details > .note')).toBeNull();
    expect(screen.getByText('No compactions.')).toHaveClass('empty');
  });

  test('come with a note on how they are reckoned, under the table', () => {
    page.render(ContextPerTurn);
    page.set({ session: session([main({ compactions: [compaction()] })]) });
    const note = document.querySelector('#context-details > .note');
    expect(note).toHaveTextContent(/compared over its own stretch, up to the next one/);
    expect(note?.previousElementSibling).toHaveClass('table-wrap');
  });

  test('page past ten rows, under the transcript`s key', () => {
    page.render(ContextPerTurn);
    const compactions = Array.from({ length: 12 }, (_unused, index) =>
      compaction({ ts: `2026-09-30T09:${String(index).padStart(2, '0')}:00.000Z` }),
    );
    page.set({ session: session([main({ compactions })]) });
    expect(compactionsTable().querySelectorAll('tbody tr')).toHaveLength(12);
    expect(document.getElementById('pager-abc123-main-compactions-size')).not.toBeNull();
    expect(document.getElementById('pager-abc123-main-growth-size')).toBeNull();
  });

  test('are a row with what they took and left, and how they fared against keeping the context', () => {
    page.render(ContextPerTurn);
    page.set({ session: session([main({ compactions: [compaction()] })]) });
    const table = compactionsTable() as HTMLElement;
    expect(within(table).getAllByRole('columnheader').map((head) => head.textContent)).toEqual([
      'Time',
      'Trigger',
      'Before',
      'After',
      'Took',
      'Each later call',
      'Cost once',
      'Pays off at',
      'Calls after',
      'Versus keeping',
    ]);
    const cells = within(within(table).getAllByRole('row')[1] as HTMLElement).getAllByRole('cell');
    expect(cells.map((cell) => cell.textContent)).toEqual([
      expect.any(String),
      'auto-compact',
      '60K',
      '20K',
      '30 s',
      '−40K · $0.02',
      '~$0.30',
      'call 5',
      '40',
      '▲ +$2.10',
    ]);
    expect(cells.map((cell) => cell.classList.contains('num'))).toEqual([
      false, false, true, true, true, true, true, true, true, false,
    ]);
    expect(cells[3]).toHaveAttribute(
      'title',
      expect.stringMatching(/^Claude Code reports 5K: without the system prompt/),
    );
    expect(cells[8]).toHaveAttribute('title', 'up to the next compaction');
  });

  test('a saving is a gain, marked in the verdict cell with the words in its title', () => {
    page.render(ContextPerTurn);
    page.set({ session: session([main({ compactions: [compaction()] })]) });
    const cell = compactionsTable()?.querySelector('tbody tr td:last-child') as HTMLElement;
    const mark = cell.querySelector('span') as HTMLElement;
    expect(mark).toHaveClass('verdict-gain');
    expect(mark).toHaveAttribute('title', 'Saved against keeping the context');
    expect(mark).toHaveTextContent('▲ +$2.10');
  });

  test('a dearer one is a loss, a neutral verdict has no class', () => {
    page.render(ContextPerTurn);
    const compactions = [
      compaction({ versus_keeping: versusKeeping({ verdict: 'cost_more', net: -0.5, net_high: -0.4 }) }),
      compaction({ ts: '2026-09-30T09:10:00.000Z', versus_keeping: versusKeeping({ verdict: 'even', net: 0 }) }),
    ];
    page.set({ session: session([main({ compactions })]) });
    const marks = [...document.querySelectorAll<HTMLElement>('tbody tr td:last-child span')];
    expect(marks[0]).toHaveClass('verdict-loss');
    expect(marks[0]).toHaveAttribute('title', 'Cost more than keeping the context');
    expect(marks[1]?.hasAttribute('class')).toBe(false);
    expect(marks[1]?.hasAttribute('title')).toBe(false);
  });

  test('one without a comparison has one muted cell across the last five columns', () => {
    page.render(ContextPerTurn);
    page.set({ session: session([main({ compactions: [compaction({ versus_keeping: null })] })]) });
    const row = compactionsTable()?.querySelector('tbody tr') as HTMLElement;
    expect(row.children).toHaveLength(6);
    const last = row.lastElementChild as HTMLElement;
    expect(last).toHaveAttribute('colspan', '5');
    expect(last).toHaveClass('muted');
    expect(last).toHaveTextContent('no call after it, or no price for its model');
  });

  test('the heading carries the total as a gain, titled, and a note follows the table', () => {
    page.render(ContextPerTurn);
    page.set({ session: session([main({ compactions: [compaction()] })]) });
    const total = heading().querySelector('.compaction-total') as HTMLElement;
    expect(total).toHaveClass('verdict-gain');
    expect(total).toHaveTextContent('▲ saved ~$2.10 so far');
    expect(total.getAttribute('title')).toMatch(/^Each compaction against keeping its context/);
    const wrap = compactionsTable()?.closest('.table-wrap') as HTMLElement;
    expect(wrap.nextElementSibling).toHaveClass('note');
    expect(wrap.nextElementSibling).toHaveTextContent(/Each compaction is compared over its own stretch/);
  });

  test('the total is a loss where the compactions cost more', () => {
    page.render(ContextPerTurn);
    const versus = versusKeeping({ verdict: 'cost_more', net: -0.5, net_high: -0.4 });
    page.set({ session: session([main({ compactions: [compaction({ versus_keeping: versus })] })]) });
    const total = heading().querySelector('.compaction-total') as HTMLElement;
    expect(total).toHaveClass('verdict-loss');
    expect(total).toHaveTextContent('▼ cost ~$0.50 more so far');
  });
});

describe('a refresh', () => {
  test('keeps the transcript picked and the table view, in the same nodes', async () => {
    const user = userEvent.setup();
    page.render(ContextPerTurn);
    page.set({ session: session([main(), helper()]) });
    await user.selectOptions(picker(), 'a-1');
    await user.click(toggle());
    const nodes = [picker(), toggle(), chart(), document.getElementById('context-table')];
    page.set({ session: session([main(), helper()], { turns: 11 }) });
    expect([picker(), toggle(), chart(), document.getElementById('context-table')]).toEqual(nodes);
    expect(picker()).toHaveValue('a-1');
    expect(toggle()).toHaveAttribute('aria-pressed', 'true');
    expect(document.getElementById('context-note')).toHaveTextContent(/^Explore/);
  });

  test('follows the new turns', () => {
    page.render(ContextPerTurn);
    page.set({ session: session([main()]) });
    expect(screen.getByRole('slider')).toHaveAttribute('aria-valuemax', '5');
    page.set({ session: session([agent({ context_per_turn: turnsOf(6) })]) });
    expect(screen.getByRole('slider')).toHaveAttribute('aria-valuemax', '6');
  });

  test('goes with the session', () => {
    page.render(ContextPerTurn);
    page.set({ session: session([main()]) });
    page.set({ session: null });
    expect(screen.queryByRole('heading')).toBeNull();
  });
});
