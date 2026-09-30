import { afterEach, expect, test } from 'vitest';
import { live, summary } from './fixtures';
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

test('a new payload has no live sessions, no failure, no time and no states', () => {
  const fresh = new Payload();
  expect([fresh.live, fresh.liveFailed, fresh.liveAt]).toEqual([null, false, null]);
  expect(fresh.liveState('live-1')).toBeUndefined();
});

test('the live answer set is given back as it is, with the time it came', () => {
  const fresh = new Payload();
  const answer = live();
  fresh.set({ live: answer, liveAt: 1_000 });
  expect(fresh.live).toBe(answer);
  expect(fresh.liveAt).toBe(1_000);
});

test('a live answer unchanged still moves the time on, and keeps the answer', () => {
  const fresh = new Payload();
  const answer = live();
  fresh.set({ live: answer, liveAt: 1_000 });
  fresh.set({ liveAt: 6_000 });
  expect([fresh.live, fresh.liveAt]).toEqual([answer, 6_000]);
});

test('a live failure is kept until an answer comes, which clears it', () => {
  const fresh = new Payload();
  fresh.set({ liveFailed: true });
  expect(fresh.liveFailed).toBe(true);
  fresh.set({ live: live() });
  expect(fresh.liveFailed).toBe(false);
});

test('the summary and the live answer are set apart', () => {
  const fresh = new Payload();
  fresh.set({ summaryFailed: true });
  fresh.set({ live: live() });
  expect(fresh.summaryFailed).toBe(true);
  fresh.set({ liveFailed: true });
  fresh.set({ summary: summary() });
  expect(fresh.liveFailed).toBe(true);
});

const SESSION_STATE = { session_id: 'live-1', current: null, secrets: { high: 0, medium: 1, 'low-medium': 0, low: 0 } };

test('a live card’s state is kept by session', () => {
  const fresh = new Payload();
  fresh.setLiveState('live-1', SESSION_STATE);
  expect(fresh.liveState('live-1')).toBe(SESSION_STATE);
  expect(fresh.liveState('live-2')).toBeUndefined();
});

test('the states of sessions no longer live go', () => {
  const fresh = new Payload();
  fresh.setLiveState('live-1', SESSION_STATE);
  fresh.setLiveState('live-2', { ...SESSION_STATE, session_id: 'live-2' });
  fresh.keepLiveStates(['live-2', 'live-3']);
  expect(fresh.liveState('live-1')).toBeUndefined();
  expect(fresh.liveState('live-2')?.session_id).toBe('live-2');
});

test('reset forgets the live answer, its failure, its time and the states', () => {
  const fresh = new Payload();
  fresh.set({ live: live(), liveAt: 1_000 });
  fresh.set({ liveFailed: true });
  fresh.setLiveState('live-1', SESSION_STATE);
  fresh.reset();
  const left = [fresh.live, fresh.liveFailed, fresh.liveAt, fresh.liveState('live-1')];
  expect(left).toEqual([null, false, null, undefined]);
});

test('setPayload sets the singleton', () => {
  const loaded = summary();
  setPayload({ summary: loaded });
  expect(payload.summary).toBe(loaded);
});
