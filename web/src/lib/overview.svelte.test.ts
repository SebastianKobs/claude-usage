import { screen } from '@testing-library/svelte';
import { afterEach, expect, test } from 'vitest';
import type { SessionDetail, SessionRuntime } from './api';
import { sessionDetail, sessionRuntime, usage } from './fixtures';
import { mountSessionKpis, mountSessionRuntime, releaseDetachedTiles } from './overview.svelte.ts';

afterEach(() => {
  document.body.replaceChildren();
  releaseDetachedTiles();
});

function withRuntime(runtime: SessionRuntime = sessionRuntime(), changes: Partial<SessionDetail> = {}) {
  return { ...sessionDetail(changes), runtime };
}

/** Lets the microtask the mount functions queue run. */
async function settle(): Promise<void> {
  await Promise.resolve();
}

test('the kpis row is a holder of the page tile row classes with the four tiles, readable at once', () => {
  const holder = mountSessionKpis(sessionDetail());
  expect(holder.tagName).toBe('DIV');
  expect(holder).toHaveClass('kpis', 'session-kpis');
  expect([...holder.querySelectorAll('.label')].map((label) => label.textContent)).toEqual([
    'Estimated cost, this session',
    'Input tokens',
    'Turns',
    'Output tokens',
  ]);
  expect(holder.querySelector('.hero')).toHaveTextContent(/^\$1\.50$/);
});

test("the kpis row shows the session's context and compaction savings", () => {
  const holder = mountSessionKpis(
    sessionDetail({ compaction_savings: { net: -1, compactions: 2, unknown: 0 } }),
  );
  expect(holder).toHaveTextContent('median context 30K per turn (p90 60K) · compact hint at 200K');
  expect(holder.querySelector('.verdict-loss')).toHaveTextContent('▼ compacting cost ~$1.00 more so far');
});

test('the kpis row counts the session as a usage of its own', () => {
  const holder = mountSessionKpis(sessionDetail({ ...usage({ turns: 42 }) }));
  expect(holder).toHaveTextContent('42');
});

test('the runtime row is a labelled group with the four tiles, readable at once', () => {
  const holder = mountSessionRuntime(withRuntime());
  expect(holder).toHaveClass('kpis', 'session-kpis');
  expect(holder).toHaveAttribute('role', 'group');
  expect(holder).toHaveAttribute('aria-label', 'Time and lines changed');
  expect([...holder.querySelectorAll('.tile-value')].map((value) => value.textContent)).toEqual([
    '1 h',
    '5 min',
    '3 min',
    '+40 / −10',
  ]);
});

test('the runtime row says where a cost record or an estimate comes from', () => {
  expect(mountSessionRuntime(withRuntime())).toHaveTextContent('wall-clock, from its cost record');
  const estimated = withRuntime(sessionRuntime({ source: 'transcripts', api_ms_without_retries: null }));
  const holder = mountSessionRuntime(estimated);
  expect(holder).toHaveTextContent('wall-clock, estimated from the transcripts');
  expect(holder).toHaveTextContent('retries are not in the transcripts');
  expect(holder).toHaveTextContent('incl. waiting for permission');
});

test("the runtime row's lines note is the session's cost per 100 lines", () => {
  // $1.50 over 50 lines
  expect(mountSessionRuntime(withRuntime())).toHaveTextContent('$3.00 per 100 lines changed');
  const none = withRuntime(sessionRuntime({ lines_added: 0, lines_removed: 0 }));
  expect(mountSessionRuntime(none)).toHaveTextContent('no lines changed');
});

test('a row works in the page once the old code has put it there', () => {
  const holder = mountSessionKpis(sessionDetail());
  document.body.append(holder);
  expect(screen.getByText('Input tokens')).toBeInTheDocument();
});

test('releasing unmounts a row that left the page, and keeps one that is in it', () => {
  const kept = mountSessionKpis(sessionDetail());
  const gone = mountSessionRuntime(withRuntime());
  document.body.append(kept, gone);
  gone.remove();
  releaseDetachedTiles();
  expect(gone.childNodes).toHaveLength(0);
  expect(kept.querySelectorAll('.card')).toHaveLength(4);
});

test('a row stays mounted while it is not in the page yet and is released after the next microtask', async () => {
  const row = mountSessionKpis(sessionDetail());
  expect(row.querySelectorAll('.card')).toHaveLength(4);
  await settle();
  // never put in the page: the old code dropped it, so it goes
  expect(row.childNodes).toHaveLength(0);
});

test('a row put in the page in the same turn survives the microtask', async () => {
  const row = mountSessionKpis(sessionDetail());
  document.body.append(row);
  await settle();
  expect(row.querySelectorAll('.card')).toHaveLength(4);
});

test('the row a new draw replaces is released once the new one is in the page', async () => {
  const old = mountSessionKpis(sessionDetail());
  document.body.append(old);
  await settle();
  const replacement = mountSessionKpis(sessionDetail());
  old.replaceWith(replacement);
  await settle();
  expect(old.childNodes).toHaveLength(0);
  expect(replacement.querySelectorAll('.card')).toHaveLength(4);
});

test('releasing twice is harmless', () => {
  mountSessionKpis(sessionDetail());
  releaseDetachedTiles();
  expect(() => releaseDetachedTiles()).not.toThrow();
});
