import { fireEvent, render, screen, within } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { flushSync } from 'svelte';
import { afterEach, beforeEach, describe, expect, test } from 'vitest';
import type { CostlySession } from '../lib/api';
import { costlySession, summary, usage } from '../lib/fixtures';
import { tablePages } from '../lib/paging.svelte';
import { payload, setPayload } from '../lib/payload.svelte';
import { preferences } from '../lib/prefs.svelte';
import CostPerSession from './CostPerSession.svelte';

/** A session with its cache reads and the rest of its cost (the parts are cache reads and what is left over). */
function session(id: string, cost: number, cacheRead: number, changes: Partial<CostlySession> = {}): CostlySession {
  return costlySession({
    session_id: id,
    title: `Session ${id}`,
    cost,
    cost_parts: { ...usage().cost_parts, cache_read: cacheRead },
    ...changes,
  });
}

/** The two costliest sessions: $3 (of which $1 cache reads) and $1.50 that was all cache reads. */
function ranking() {
  return summary({
    costly_sessions: [
      session('big', 3, 1, { project: 'shop', turns: 1234, context_avg: 12_345, context_peak: 99_000 }),
      session('small', 1.5, 1.5, { title: null, project: 'blog' }),
    ],
  });
}

/** A month of sessions, the costliest first. */
function many(count: number) {
  return summary({
    costly_sessions: Array.from({ length: count }, (_unused, index) => session(`s${index}`, count - index, 0)),
  });
}

/** Gives every element a clientWidth, as a browser lays it out (the simulated DOM has none). */
function measure(width: number) {
  Object.defineProperty(HTMLElement.prototype, 'clientWidth', { configurable: true, get: () => width });
}

/** Lays a row out on the page, as a browser does: the box it is in, and where it stands in its container. */
function layOut(row: HTMLElement, box: { left: number; width: number }, offsetTop: number, offsetHeight: number) {
  row.getBoundingClientRect = () => new DOMRect(box.left, 0, box.width, offsetHeight);
  Object.defineProperty(row, 'offsetTop', { configurable: true, value: offsetTop });
  Object.defineProperty(row, 'offsetHeight', { configurable: true, value: offsetHeight });
}

/** The chart's container, which the tooltip is placed in, starting `left` px from the window's edge. */
function layOutContainer(left: number) {
  const container = document.querySelector<HTMLElement>('.chart');
  if (!container) throw new Error('no chart');
  container.getBoundingClientRect = () => new DOMRect(left, 0, 600, 400);
}

const rowLinks = () => [...document.querySelectorAll<HTMLAnchorElement>('a.bar-row')];
const tooltip = () => document.querySelector<HTMLElement>('.tooltip');
const toggle = () => screen.getByRole('button', { name: 'Table view' });

function texts(selector: string, root: ParentNode = document): (string | null)[] {
  return [...root.querySelectorAll(selector)].map((node) => node.textContent);
}

beforeEach(() => {
  localStorage.clear();
  preferences.pageSize = 25;
});

afterEach(() => {
  payload.reset();
  tablePages.forget('costly-table');
  preferences.theme = null;
  preferences.pageSize = 25;
  localStorage.clear();
  Reflect.deleteProperty(HTMLElement.prototype, 'clientWidth');
});

describe('the card', () => {
  test('is a section named for its heading, with the note after it', () => {
    const { container } = render(CostPerSession);
    expect(screen.getByRole('region', { name: 'Cost per session' })).toHaveClass('card');
    expect(screen.getByRole('heading', { level: 2 })).toHaveAttribute('id', 'costly-title');
    expect(container.querySelector('.chart-head .muted')).toHaveTextContent(
      /^the costliest sessions by what they used in the range, with their subagents$/,
    );
  });

  test('has its table toggle named for the card', () => {
    render(CostPerSession);
    expect(toggle()).toHaveAttribute('id', 'costly-table-toggle');
    expect(toggle()).toHaveAttribute('aria-pressed', 'false');
  });

  test('before any summary it has its heading and no legend, bars, note or table', async () => {
    const user = userEvent.setup();
    const { container } = render(CostPerSession);
    expect(container.querySelector('.legend')?.children).toHaveLength(0);
    expect(container.querySelector('.chart')).toBeEmptyDOMElement();
    await user.click(toggle());
    expect(screen.queryByRole('table')).toBeNull();
  });

  test('the heading is in the theme`s words', () => {
    preferences.theme = 'hacker';
    render(CostPerSession);
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(/^sort -rn cost \| head$/);
    preferences.theme = 'startup';
    flushSync();
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(/^Burn per sprint$/);
  });

  test('the theme changes the heading in place', () => {
    render(CostPerSession);
    setPayload({ summary: ranking() });
    const heading = screen.getByRole('heading', { level: 2 });
    preferences.theme = 'hacker';
    flushSync();
    expect(screen.getByRole('heading', { level: 2 })).toBe(heading);
    expect(heading).toHaveTextContent('sort -rn cost | head');
  });
});

describe('the legend', () => {
  test('names the two parts, the last with what it holds, before the chart', () => {
    const { container } = render(CostPerSession);
    setPayload({ summary: ranking() });
    expect(texts('.legend > span', container)).toEqual([
      'Cache reads',
      'Everything else (new input, cache writes, output and web searches)',
    ]);
    expect(container.querySelector('.legend + .chart')).not.toBeNull();
  });

  test('has a swatch per part in its color', () => {
    const { container } = render(CostPerSession);
    setPayload({ summary: ranking() });
    const swatches = [...container.querySelectorAll<HTMLElement>('.legend .swatch')];
    expect(swatches.map((swatch) => swatch.style.background)).toEqual(['var(--split-soft)', 'var(--split-strong)']);
  });

  test('is there for a range without sessions too', () => {
    const { container } = render(CostPerSession);
    setPayload({ summary: summary() });
    expect(container.querySelectorAll('.legend > span')).toHaveLength(2);
  });
});

describe('the bars', () => {
  test('a link per session, in the order sent, to its view, named for a screen reader', () => {
    render(CostPerSession);
    setPayload({ summary: ranking() });
    const links = rowLinks();
    expect(links.map((link) => link.getAttribute('href'))).toEqual(['#session/big', '#session/small']);
    expect(links.map((link) => link.getAttribute('aria-label'))).toEqual([
      'Session big: $3.00; Cache reads $1.00, Everything else $2.00',
      'Untitled session: $1.50; Cache reads $1.50, Everything else $0.00',
    ]);
    expect(links[0]?.parentElement).toHaveClass('bars');
  });

  test('a row has the name, the line under it, the bar and the cost, in that order', () => {
    render(CostPerSession);
    setPayload({ summary: ranking() });
    const [first, second] = rowLinks() as [HTMLAnchorElement, HTMLAnchorElement];
    expect([...first.children].map((child) => child.className)).toEqual(['bar-name', 'bar-track', 'bar-value']);
    expect(first.querySelector('.bar-name strong')).toHaveTextContent('Session big');
    expect(first.querySelector('.bar-name .sub')).toHaveTextContent('shop · 1,234 turns · avg context 12.3K');
    expect(first.querySelector('.bar-value')).toHaveTextContent('$3.00');
    expect(second.querySelector('.bar-name strong')).toHaveTextContent('Untitled session');
    expect(second.querySelector('.bar-value')).toHaveTextContent('$1.50');
  });

  test('a bar is as long as its cost against the dearest, the dearest all of the track', () => {
    render(CostPerSession);
    setPayload({ summary: ranking() });
    const bars = [...document.querySelectorAll<HTMLElement>('.bar-track > .bar')];
    expect(bars.map((bar) => bar.style.width)).toEqual(['100.00%', '50.00%']);
  });

  test('a bar is split by its parts, each growing as its amount, in its color', () => {
    render(CostPerSession);
    setPayload({ summary: ranking() });
    const [first] = document.querySelectorAll('.bar');
    const parts = [...(first?.children ?? [])] as HTMLElement[];
    expect(parts.map((part) => part.style.flexGrow)).toEqual(['1', '2']);
    expect(parts.map((part) => part.style.background)).toEqual(['var(--split-soft)', 'var(--split-strong)']);
  });

  test('a part without an amount is left out of the bar', () => {
    render(CostPerSession);
    setPayload({ summary: ranking() });
    const bars = [...document.querySelectorAll('.bar')];
    expect(bars.map((bar) => bar.children.length)).toEqual([2, 1]);
    expect((bars[1]?.firstElementChild as HTMLElement).style.background).toBe('var(--split-soft)');
  });

  test('a range without sessions says so, with no bars', () => {
    const { container } = render(CostPerSession);
    setPayload({ summary: summary() });
    expect(container.querySelector('.empty')).toHaveTextContent(/^No sessions in this range\.$/);
    expect(container.querySelector('.bars')).toBeNull();
  });

  test('every session of the range is drawn, however many', () => {
    render(CostPerSession);
    setPayload({ summary: many(40) });
    expect(rowLinks()).toHaveLength(40);
  });
});

describe('a new summary', () => {
  test('draws again: the rows of the new sessions, the old ones gone', () => {
    const { container } = render(CostPerSession);
    setPayload({ summary: ranking() });
    setPayload({ summary: summary({ costly_sessions: [session('other', 2, 1)] }) });
    expect(rowLinks().map((link) => link.getAttribute('href'))).toEqual(['#session/other']);
    expect(container.querySelector('.bar-value')).toHaveTextContent('$2.00');
  });

  test('a session that stays keeps its row, with the new numbers', () => {
    render(CostPerSession);
    setPayload({ summary: ranking() });
    const [before] = rowLinks();
    setPayload({ summary: summary({ costly_sessions: [session('big', 6, 6), session('small', 1.5, 1.5)] }) });
    const [after] = rowLinks();
    expect(after).toBe(before);
    expect(after?.querySelector('.bar-value')).toHaveTextContent('$6.00');
    expect(after?.querySelectorAll('.bar > span')).toHaveLength(1);
  });

  test('sessions give way to the note when the range has none', () => {
    const { container } = render(CostPerSession);
    setPayload({ summary: ranking() });
    setPayload({ summary: summary() });
    expect(container.querySelector('.bars')).toBeNull();
    expect(container.querySelector('.empty')).not.toBeNull();
  });

  test('losing the summary takes the chart away again without throwing', () => {
    const { container } = render(CostPerSession);
    setPayload({ summary: ranking() });
    payload.reset();
    flushSync();
    expect(container.querySelector('.chart')).toBeEmptyDOMElement();
    expect(container.querySelector('.legend')?.children).toHaveLength(0);
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Cost per session');
  });
});

describe('the tooltip', () => {
  test('is not there until a row is hovered or focused', () => {
    render(CostPerSession);
    setPayload({ summary: ranking() });
    expect(tooltip()).toBeNull();
  });

  test('a pointer over a row shows it, inside the chart, with the row`s numbers', async () => {
    render(CostPerSession);
    setPayload({ summary: ranking() });
    await fireEvent.pointerMove(rowLinks()[0] as HTMLElement, { clientX: 100 });
    const box = tooltip() as HTMLElement;
    expect(box.parentElement).toHaveClass('chart');
    expect(box.querySelector('.when')).toHaveTextContent(/^Session big$/);
    expect(texts('.row strong', box)).toEqual(['$1.00', '$2.00', '$3.00']);
    expect(texts('.row .name', box)).toEqual(['Cache reads · 33%', 'Everything else · 67%', 'total']);
    expect(texts(':scope > .name', box)).toEqual(['1,234 turns · context avg 12.3K, peak 99K']);
  });

  test('its lines have a swatch each, the parts in their colors, the total in the default one', async () => {
    render(CostPerSession);
    setPayload({ summary: ranking() });
    await fireEvent.pointerMove(rowLinks()[0] as HTMLElement, { clientX: 100 });
    const swatches = [...(tooltip()?.querySelectorAll<HTMLElement>('.row .swatch') ?? [])];
    expect(swatches.map((swatch) => swatch.style.background)).toEqual(['var(--split-soft)', 'var(--split-strong)', '']);
  });

  test('names an untitled session', async () => {
    render(CostPerSession);
    setPayload({ summary: ranking() });
    await fireEvent.pointerMove(rowLinks()[1] as HTMLElement, { clientX: 100 });
    expect(tooltip()?.querySelector('.when')).toHaveTextContent(/^Untitled session$/);
  });

  test('keyboard focus shows it too', async () => {
    const user = userEvent.setup();
    render(CostPerSession);
    setPayload({ summary: ranking() });
    await user.tab();
    await user.tab();
    expect(rowLinks()[0]).toHaveFocus();
    expect(tooltip()?.querySelector('.when')).toHaveTextContent('Session big');
  });

  test('leaving the row hides it', async () => {
    render(CostPerSession);
    setPayload({ summary: ranking() });
    const link = rowLinks()[0] as HTMLElement;
    await fireEvent.pointerMove(link, { clientX: 100 });
    await fireEvent.pointerLeave(link);
    expect(tooltip()).toBeNull();
  });

  test('losing focus hides it', async () => {
    const user = userEvent.setup();
    render(CostPerSession);
    setPayload({ summary: ranking() });
    await user.tab();
    await user.tab();
    expect(tooltip()).not.toBeNull();
    await user.tab();
    expect(rowLinks()[1]).toHaveFocus();
    expect(tooltip()?.querySelector('.when')).toHaveTextContent('Untitled session');
    await user.tab();
    expect(tooltip()).toBeNull();
  });

  test('moving to another row shows that row`s', async () => {
    render(CostPerSession);
    setPayload({ summary: ranking() });
    await fireEvent.pointerMove(rowLinks()[0] as HTMLElement, { clientX: 100 });
    await fireEvent.pointerMove(rowLinks()[1] as HTMLElement, { clientX: 100 });
    expect(document.querySelectorAll('.tooltip')).toHaveLength(1);
    expect(tooltip()?.querySelector('.when')).toHaveTextContent('Untitled session');
  });

  test('stands a gap right of the pointer, under its row', async () => {
    measure(600);
    render(CostPerSession);
    setPayload({ summary: ranking() });
    layOutContainer(50);
    const link = rowLinks()[0] as HTMLElement;
    layOut(link, { left: 60, width: 400 }, 30, 40);
    await fireEvent.pointerMove(link, { clientX: 150 });
    // the pointer is 100 px into the container; the tooltip is 12 px further, 4 px under the row's bottom
    expect(tooltip()?.style.left).toBe('112px');
    expect(tooltip()?.style.top).toBe('74px');
  });

  test('follows the pointer along the row', async () => {
    measure(600);
    render(CostPerSession);
    setPayload({ summary: ranking() });
    layOutContainer(50);
    const link = rowLinks()[0] as HTMLElement;
    layOut(link, { left: 60, width: 400 }, 30, 40);
    await fireEvent.pointerMove(link, { clientX: 150 });
    await fireEvent.pointerMove(link, { clientX: 250 });
    expect(tooltip()?.style.left).toBe('212px');
  });

  test('for the keyboard stands beside the row`s middle', async () => {
    measure(600);
    const user = userEvent.setup();
    render(CostPerSession);
    setPayload({ summary: ranking() });
    layOutContainer(50);
    const link = rowLinks()[0] as HTMLElement;
    layOut(link, { left: 60, width: 400 }, 30, 40);
    await user.tab();
    await user.tab();
    // the row's middle is 60 + 200 from the window's edge, 210 into the container
    expect(tooltip()?.style.left).toBe('222px');
    expect(tooltip()?.style.top).toBe('74px');
  });

  test('never passes the container`s edges', async () => {
    measure(600);
    render(CostPerSession);
    setPayload({ summary: ranking() });
    layOutContainer(50);
    const link = rowLinks()[0] as HTMLElement;
    layOut(link, { left: 60, width: 400 }, 30, 40);
    await fireEvent.pointerMove(link, { clientX: 700 });
    expect(tooltip()?.style.left).toBe('600px');
  });

  test('goes with its session when a new summary leaves it out', async () => {
    render(CostPerSession);
    setPayload({ summary: ranking() });
    await fireEvent.pointerMove(rowLinks()[0] as HTMLElement, { clientX: 100 });
    setPayload({ summary: summary({ costly_sessions: [session('small', 1.5, 1.5)] }) });
    expect(tooltip()).toBeNull();
  });

  test('stays, with the new numbers, when its session is still there', async () => {
    render(CostPerSession);
    setPayload({ summary: ranking() });
    await fireEvent.pointerMove(rowLinks()[0] as HTMLElement, { clientX: 100 });
    setPayload({ summary: summary({ costly_sessions: [session('big', 8, 2)] }) });
    expect(texts('.row strong', tooltip() as HTMLElement)).toEqual(['$2.00', '$6.00', '$8.00']);
  });
});

describe('the table view', () => {
  async function shown(summaryToShow = ranking()) {
    const user = userEvent.setup();
    const view = render(CostPerSession);
    setPayload({ summary: summaryToShow });
    await user.click(toggle());
    return { user, ...view };
  }

  test('is not drawn until the toggle is pressed', () => {
    render(CostPerSession);
    setPayload({ summary: ranking() });
    expect(screen.queryByRole('table')).toBeNull();
  });

  test('pressing the toggle shows it, pressing again hides it, the bars staying', async () => {
    const { user, container } = await shown();
    expect(toggle()).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('table')).toBeInTheDocument();
    await user.click(toggle());
    expect(screen.queryByRole('table')).toBeNull();
    expect(container.querySelectorAll('a.bar-row')).toHaveLength(2);
  });

  test('is headed by the session, its contexts, each part and the cost, the numbers aligned right', async () => {
    await shown();
    const heads = screen.getAllByRole('columnheader');
    expect(heads.map((head) => head.textContent)).toEqual([
      'Session',
      'Turns',
      'Avg context',
      'Peak context',
      'Cache reads',
      'Everything else',
      'Cost',
    ]);
    expect(heads.map((head) => head.classList.contains('num'))).toEqual([false, true, true, true, true, true, true]);
  });

  test('has a row per session: a link to it with its project under, then the numbers', async () => {
    await shown();
    const rows = screen.getAllByRole('row').slice(1);
    expect(rows).toHaveLength(2);
    const [first, second] = rows.map((row) => within(row as HTMLElement).getAllByRole('cell'));
    expect(within(first?.[0] as HTMLElement).getByRole('link')).toHaveAttribute('href', '#session/big');
    expect(first?.[0]?.querySelector('a')).toHaveTextContent('Session big');
    expect(first?.[0]?.querySelector('.sub')).toHaveTextContent('shop');
    expect(first?.slice(1).map((cell) => cell.textContent)).toEqual([
      '1,234',
      '12.3K',
      '99K',
      '$1.00',
      '$2.00',
      '$3.00',
    ]);
    expect(first?.map((cell) => cell.classList.contains('num'))).toEqual([false, true, true, true, true, true, true]);
    expect(within(second?.[0] as HTMLElement).getByRole('link')).toHaveTextContent('Untitled session');
    expect(second?.slice(4).map((cell) => cell.textContent)).toEqual(['$1.50', '$0.00', '$1.50']);
  });

  test('has no rows for a range without sessions, only its heading', async () => {
    await shown(summary());
    expect(screen.getAllByRole('columnheader')).toHaveLength(7);
    expect(screen.getAllByRole('row')).toHaveLength(1);
  });

  test('pages past ten sessions, under the key of the table', async () => {
    const { user } = await shown(many(40));
    expect(screen.getByRole('group', { name: 'Pages' })).toBeInTheDocument();
    expect(screen.getByText('rows 1–25 of 40')).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: 'Rows per page' }).id).toBe('pager-costly-table-size');
    expect(screen.getAllByRole('row')).toHaveLength(26);
    await user.click(screen.getByRole('button', { name: 'Next ›' }));
    expect(screen.getByText('rows 26–40 of 40')).toBeInTheDocument();
    expect(screen.getAllByRole('row')).toHaveLength(16);
  });

  test('a short list shows no pager', async () => {
    await shown();
    expect(screen.queryByRole('group', { name: 'Pages' })).toBeNull();
  });

  test('the page is kept when a new summary comes', async () => {
    const { user } = await shown(many(40));
    await user.click(screen.getByRole('button', { name: 'Next ›' }));
    setPayload({ summary: many(40) });
    expect(screen.getByText('rows 26–40 of 40')).toBeInTheDocument();
  });

  test('is updated in place, its rows keeping their nodes by session', async () => {
    await shown();
    const before = screen.getAllByRole('row');
    setPayload({ summary: summary({ costly_sessions: [session('big', 9, 3), session('small', 1.5, 1.5)] }) });
    const after = screen.getAllByRole('row');
    after.forEach((row, index) => expect(row).toBe(before[index]));
    expect(within(after[1] as HTMLElement).getAllByRole('cell')[6]).toHaveTextContent('$9.00');
  });
});
