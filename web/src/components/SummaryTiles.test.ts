import { render } from '@testing-library/svelte';
import { afterEach, expect, test } from 'vitest';
import { runtimeTotals, summary, usage } from '../lib/fixtures';
import { payload, setPayload } from '../lib/payload.svelte';
import SummaryTiles from './SummaryTiles.svelte';

afterEach(() => {
  payload.reset();
});

function row(rows: 'kpis' | 'runtime'): HTMLElement {
  return render(SummaryTiles, { rows }).container;
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
  setPayload({ summaryFailed: true });
  expect(container.querySelector('.empty')).toHaveTextContent(/^Could not load the summary\.$/);
});

test('the runtime row is empty without a summary, loading or failed', () => {
  const container = row('runtime');
  expect(container.children).toHaveLength(0);
  setPayload({ summaryFailed: true });
  expect(container.children).toHaveLength(0);
});

test('a summary draws the four kpi tiles for its range, at once', () => {
  const container = row('kpis');
  setPayload({ summary: summary() });
  expect(container.querySelector('.empty')).toBeNull();
  expect(labels(container)).toEqual(['Estimated cost, last 7 days', 'Input tokens', 'Turns', 'Output tokens']);
  expect(container.querySelector('.hero')).toHaveTextContent(/^\$1\.50$/);
});

test('the kpi tiles carry the summary: context, hint and savings', () => {
  const container = row('kpis');
  setPayload({ summary: summary({ compaction_savings: { net: 2, compactions: 2, unknown: 0 } }) });
  expect(container).toHaveTextContent('median context 40K per turn (p90 90K) · compact hint at 200K');
  expect(container.querySelector('.verdict-gain')).toHaveTextContent('compacting saved ~$2.00 so far');
});

test('a summary draws the four runtime tiles, worded by the sessions that ended', () => {
  const container = row('runtime');
  setPayload({ summary: summary({ runtime: runtimeTotals({ sessions: 1 }) }) });
  expect(labels(container)).toEqual(['Session time', 'Waiting on the API', 'Running tools', 'Lines changed']);
  expect(container).toHaveTextContent('wall-clock, 1 session that ended in the range');
  expect(container).toHaveTextContent('$2.50 per 100 lines changed');
});

test('a new summary updates the tiles in place', () => {
  const container = row('kpis');
  setPayload({ summary: summary() });
  const before = [...container.querySelectorAll('.card')];
  setPayload({ summary: summary({ days: 1, until: '2026-09-30', totals: usage({ cost: 3 }) }) });
  const after = [...container.querySelectorAll('.card')];
  expect(after).toHaveLength(4);
  after.forEach((card, index) => expect(card).toBe(before[index]));
  expect(container.querySelector('.label')).toHaveTextContent(/^Estimated cost, today$/);
  expect(container.querySelector('.hero')).toHaveTextContent(/^\$3\.00$/);
});

test('the runtime tiles are updated in place too', () => {
  const container = row('runtime');
  setPayload({ summary: summary() });
  const before = [...container.querySelectorAll('.card')];
  setPayload({ summary: summary({ runtime: runtimeTotals({ lines_added: 7 }) }) });
  [...container.querySelectorAll('.card')].forEach((card, index) => expect(card).toBe(before[index]));
  expect(container).toHaveTextContent('+7 / −30');
});

test('a summary clears an earlier failure, and a later failure keeps the tiles', () => {
  const container = row('kpis');
  setPayload({ summaryFailed: true });
  setPayload({ summary: summary() });
  expect(payload.summaryFailed).toBe(false);
  setPayload({ summaryFailed: true });
  expect(container.querySelector('.card')).not.toBeNull();
  expect(container.querySelector('.empty')).toBeNull();
});
