import { flushSync } from 'svelte';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { cacheClock } from './clock.svelte.ts';

const NOW = Date.parse('2026-09-30T12:00:00.000Z');
const SOON = '2026-09-30T12:05:00.000Z';

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['Date', 'setTimeout', 'clearTimeout'] });
  vi.setSystemTime(NOW);
});

afterEach(() => {
  vi.useRealTimers();
});

/** Reads a clock in an effect, as a component does, and records what it saw each run. */
function watch(until: string | null) {
  const clock = cacheClock(until);
  const seen: { expired: boolean; now: string }[] = [];
  const stop = $effect.root(() => {
    $effect(() => {
      seen.push({ expired: clock.expired, now: clock.now });
    });
  });
  flushSync();
  return { seen, stop };
}

/** Lets the microtask run that drops a subscription once its effect is gone. */
async function settle() {
  await Promise.resolve();
}

describe('a clock with a moment ahead', () => {
  test('is not expired before it and expired after, a second past it', () => {
    const { seen, stop } = watch(SOON);
    expect(seen.map((one) => one.expired)).toEqual([false]);
    vi.advanceTimersByTime(5 * 60_000 + 999);
    flushSync();
    expect(seen).toHaveLength(1);
    vi.advanceTimersByTime(1);
    flushSync();
    expect(seen.map((one) => one.expired)).toEqual([false, true]);
    stop();
  });

  test('moves now at the expiry and not before', () => {
    const { seen, stop } = watch(SOON);
    expect(seen[0]?.now).toBe('2026-09-30T12:00:00.000Z');
    vi.advanceTimersByTime(3 * 60_000);
    flushSync();
    expect(seen).toHaveLength(1);
    vi.advanceTimersByTime(2 * 60_000 + 1000);
    flushSync();
    expect(seen[1]?.now).toBe('2026-09-30T12:05:01.000Z');
    stop();
  });

  test('sets one timer, and none more once it has fired', () => {
    const { stop } = watch(SOON);
    expect(vi.getTimerCount()).toBe(1);
    vi.advanceTimersByTime(5 * 60_000 + 1000);
    flushSync();
    expect(vi.getTimerCount()).toBe(0);
    stop();
  });

  test('gives one timer to readers that share it', () => {
    const clock = cacheClock(SOON);
    const stops = [1, 2].map(() =>
      $effect.root(() => {
        $effect(() => {
          void clock.expired;
        });
      }),
    );
    flushSync();
    expect(vi.getTimerCount()).toBe(1);
    for (const stop of stops) stop();
  });

  test('clears its timer once the reader is gone', async () => {
    const { stop } = watch(SOON);
    expect(vi.getTimerCount()).toBe(1);
    stop();
    await settle();
    expect(vi.getTimerCount()).toBe(0);
  });
});

describe('a clock without a tick to wait for', () => {
  test.each([
    ['no moment', null],
    ['a moment passed', '2026-09-30T11:00:00.000Z'],
    ['a moment not a date', 'soon'],
    ['a moment too far ahead', new Date(NOW + 2 ** 31).toISOString()],
  ])('sets no timer for %s', (_name, until) => {
    const { stop } = watch(until);
    expect(vi.getTimerCount()).toBe(0);
    stop();
  });

  test('says expired for a moment passed and never for none', () => {
    const past = watch('2026-09-30T11:59:59.000Z');
    const none = watch(null);
    expect(past.seen[0]?.expired).toBe(true);
    expect(none.seen[0]?.expired).toBe(false);
    past.stop();
    none.stop();
  });

  test('is not expired for a moment beyond the longest timer, and leaves the time as it was', () => {
    const far = watch(new Date(NOW + 2 ** 31).toISOString());
    vi.advanceTimersByTime(60_000);
    flushSync();
    expect(far.seen).toHaveLength(1);
    expect(far.seen[0]?.expired).toBe(false);
    far.stop();
  });
});

describe('a clock read in a derived value', () => {
  test('keeps now as it was until the tick', () => {
    const clock = cacheClock(SOON);
    const seen: string[] = [];
    const stop = $effect.root(() => {
      const stamp = $derived(clock.now);
      $effect(() => {
        seen.push(stamp);
      });
    });
    flushSync();
    vi.advanceTimersByTime(60_000);
    flushSync();
    expect(seen).toEqual(['2026-09-30T12:00:00.000Z']);
    vi.advanceTimersByTime(4 * 60_000 + 1000);
    flushSync();
    expect(seen).toEqual(['2026-09-30T12:00:00.000Z', '2026-09-30T12:05:01.000Z']);
    stop();
  });

  test('leaves the old clock`s timer when a derived value makes a new one', async () => {
    let until = $state<string | null>(SOON);
    const seen: boolean[] = [];
    const stop = $effect.root(() => {
      const clock = $derived(cacheClock(until));
      $effect(() => {
        seen.push(clock.expired);
      });
    });
    flushSync();
    expect(vi.getTimerCount()).toBe(1);
    until = '2026-09-30T12:10:00.000Z';
    flushSync();
    await settle();
    expect(vi.getTimerCount()).toBe(1);
    vi.advanceTimersByTime(5 * 60_000 + 1000);
    flushSync();
    expect(seen).toEqual([false, false]);
    vi.advanceTimersByTime(5 * 60_000);
    flushSync();
    expect(seen).toEqual([false, false, true]);
    stop();
  });
});
