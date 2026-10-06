import { render } from '@testing-library/svelte';
import { afterEach, expect, test, vi } from 'vitest';
import { pagePerTest } from '../app/app.testing';
import { runtimeTotals, summary, usage } from '../api/fixtures';
import SummaryTiles from './SummaryTiles.svelte';

const page = pagePerTest();

afterEach(() => {
  vi.useRealTimers();
});

function row(rows: 'kpis' | 'runtime'): HTMLElement {
  return page.render(SummaryTiles, { rows }).container;
}

function labels(container: HTMLElement): (string | null)[] {
  return [...container.querySelectorAll('.label')].map((label) => label.textContent);
}

test('the kpis row says it is loading until a summary comes', () => {
  const container = row('kpis');
  expect(container.querySelector('.empty')).toHaveTextContent(/^Loading…$/);
  expect(container.querySelector('.card')).toBeNull();
});

test('the kpis row says the summary could not be loaded where loading failed', () => {
  const container = row('kpis');
  page.set({ summaryFailed: true });
  expect(container.querySelector('.empty')).toHaveTextContent(/^Could not load the summary\.$/);
});

test('the runtime row is empty without a summary, loading or failed', () => {
  const container = row('runtime');
  expect(container.children).toHaveLength(0);
  page.set({ summaryFailed: true });
  expect(container.children).toHaveLength(0);
});

test('a summary draws the four kpi tiles for its range, at once', () => {
  const container = row('kpis');
  page.set({ summary: summary() });
  expect(container.querySelector('.empty')).toBeNull();
  expect(labels(container)).toEqual(['Estimated cost, last 7 days', 'Input tokens', 'Turns', 'Output tokens']);
  expect(container.querySelector('.hero')).toHaveTextContent(/^\$1\.50$/);
});

test('the kpi tiles carry the summary: context, hint and savings', () => {
  const container = row('kpis');
  page.set({ summary: summary({ compaction_savings: { net: 2, compactions: 2, unknown: 0 } }) });
  expect(container).toHaveTextContent('median context 40K per turn (p90 90K) · compact hint at 200K');
  expect(container.querySelector('.verdict-gain')).toHaveTextContent('compacting saved ~$2.00 so far');
});

test('a summary draws the four runtime tiles, worded by the sessions that ended', () => {
  const container = row('runtime');
  page.set({ summary: summary({ runtime: runtimeTotals({ sessions: 1 }) }) });
  expect(labels(container)).toEqual(['Session time', 'Waiting on the API', 'Running tools', 'Lines changed']);
  expect(container).toHaveTextContent('wall-clock, 1 session that ended in the range');
  expect(container).toHaveTextContent('$2.50 per 100 lines changed');
});

test('the runtime tiles say where sessions without a cost record are estimated into the totals', () => {
  const container = row('runtime');
  page.set({ summary: summary({ runtime: runtimeTotals({ sessions: 0, estimated_sessions: 2 }) }) });
  expect(container).toHaveTextContent('wall-clock, 2 sessions without a cost record yet (estimated), none ended');
});

test('a new summary updates the tiles in place', () => {
  // the range's day is "today" only on the day the summary names
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(new Date(2026, 8, 30, 12));
  const container = row('kpis');
  page.set({ summary: summary() });
  const before = [...container.querySelectorAll('.card')];
  page.set({ summary: summary({ days: 1, until: '2026-09-30', totals: usage({ cost: 3 }) }) });
  const after = [...container.querySelectorAll('.card')];
  expect(after).toHaveLength(4);
  after.forEach((card, index) => expect(card).toBe(before[index]));
  expect(container.querySelector('.label')).toHaveTextContent(/^Estimated cost, today$/);
  expect(container.querySelector('.hero')).toHaveTextContent(/^\$3\.00$/);
});

test('the runtime tiles are updated in place too', () => {
  const container = row('runtime');
  page.set({ summary: summary() });
  const before = [...container.querySelectorAll('.card')];
  page.set({ summary: summary({ runtime: runtimeTotals({ lines_added: 7 }) }) });
  [...container.querySelectorAll('.card')].forEach((card, index) => expect(card).toBe(before[index]));
  expect(container).toHaveTextContent('+7 / −30');
});

test('a summary clears an earlier failure, and a later failure keeps the tiles', () => {
  const container = row('kpis');
  page.set({ summaryFailed: true });
  page.set({ summary: summary() });
  expect(page.app.payload.summaryFailed).toBe(false);
  page.set({ summaryFailed: true });
  expect(container.querySelector('.card')).not.toBeNull();
  expect(container.querySelector('.empty')).toBeNull();
});
