import { afterEach, expect, test } from 'vitest';
import { summary } from './fixtures';
import { Payload, payload, setPayload } from './payload.svelte.ts';

afterEach(() => {
  payload.reset();
});

test('a new payload has no summary and no failure', () => {
  const fresh = new Payload();
  expect(fresh.summary).toBeNull();
  expect(fresh.summaryFailed).toBe(false);
});

test('a summary set is given back as it is', () => {
  const fresh = new Payload();
  const loaded = summary();
  fresh.set({ summary: loaded });
  expect(fresh.summary).toBe(loaded);
});

test('a failure is kept until a summary comes, which clears it', () => {
  const fresh = new Payload();
  fresh.set({ summaryFailed: true });
  expect(fresh.summaryFailed).toBe(true);
  fresh.set({ summary: summary() });
  expect(fresh.summaryFailed).toBe(false);
});

test('a failure after a summary keeps the summary', () => {
  const fresh = new Payload();
  const loaded = summary();
  fresh.set({ summary: loaded });
  fresh.set({ summaryFailed: true });
  expect(fresh.summary).toBe(loaded);
  expect(fresh.summaryFailed).toBe(true);
});

test('setting nothing changes nothing', () => {
  const fresh = new Payload();
  fresh.set({ summaryFailed: true });
  fresh.set({});
  expect(fresh.summaryFailed).toBe(true);
});

test('the values are read-only', () => {
  const fresh = new Payload();
  expect(() => Reflect.set(fresh, 'summary', summary())).not.toThrow();
  expect(fresh.summary).toBeNull();
});

test('reset forgets both', () => {
  const fresh = new Payload();
  fresh.set({ summary: summary() });
  fresh.set({ summaryFailed: true });
  fresh.reset();
  expect([fresh.summary, fresh.summaryFailed]).toEqual([null, false]);
});

test('setPayload sets the singleton', () => {
  const loaded = summary();
  setPayload({ summary: loaded });
  expect(payload.summary).toBe(loaded);
});
