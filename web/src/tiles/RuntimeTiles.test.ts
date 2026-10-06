import { expect, test } from 'vitest';
import { pagePerTest } from '../app/app.testing';
import type { RuntimeTotals, SessionRuntime } from '../api/api';
import { runtimeTotals, sessionRuntime } from '../api/fixtures';
import RuntimeTiles from './RuntimeTiles.svelte';

const page = pagePerTest();

function tiles(
  runtime: RuntimeTotals | SessionRuntime = runtimeTotals(),
  costPer100Lines: number | null = 2.5,
  from = '3 sessions that ended in the range',
): string[][] {
  const { container } = page.render(RuntimeTiles, { runtime, from, costPer100Lines });
  return [...container.querySelectorAll('div.card')].map((card) =>
    [...card.children].map((child) => child.textContent ?? ''),
  );
}

test('four tiles: session time, API, tools and lines, each with a note', () => {
  expect(tiles()).toEqual([
    ['Session time', '2 h', 'wall-clock, 3 sessions that ended in the range'],
    ['Waiting on the API', '10 min', '1 min of it retries'],
    ['Running tools', '6 min', '5.0% of the session time'],
    ['Lines changed', '+120 / −30', '$2.50 per 100 lines changed'],
  ]);
});

test('the lines use a real minus sign', () => {
  const lines = tiles()[3]?.[1];
  expect(lines).toContain('−');
  expect(lines).not.toContain('-');
});

test('no retries lost is said so', () => {
  const [, api] = tiles(runtimeTotals({ api_ms_without_retries: 600_000 }));
  expect(api?.[2]).toBe('no time lost to retries');
});

test('no lines changed, or no price, says so', () => {
  const [, , , lines] = tiles(runtimeTotals({ lines_added: 0, lines_removed: 0 }), null);
  expect(lines).toEqual(['Lines changed', '+0 / −0', 'no lines changed']);
});

test('a session from its cost record shows the share of the session time the tools took', () => {
  const [session, , tools] = tiles(sessionRuntime(), null, 'from its cost record');
  expect(session?.[2]).toBe('wall-clock, from its cost record');
  expect(tools?.[2]).toBe('5.0% of the session time');
});

test('a session estimated from its transcripts says the tool time includes waiting, and has no retries', () => {
  const estimated = sessionRuntime({ source: 'transcripts', api_ms_without_retries: null });
  const [, api, tools] = tiles(estimated, null, 'estimated from the transcripts');
  expect(api?.[2]).toBe('retries are not in the transcripts');
  expect(tools?.[2]).toBe('from each call to its result, incl. waiting for permission');
});

test('the overview totals are never taken as estimated', () => {
  expect(tiles(runtimeTotals())[2]?.[2]).toBe('5.0% of the session time');
});
