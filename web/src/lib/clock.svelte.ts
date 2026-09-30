// The cache's clock, as something outside Svelte's state: whether the prompt cache has run out is a fact that changes
// with the time alone, so a reader is told once, when it does, and not by a timer of its own to keep.

import { createSubscriber } from 'svelte/reactivity';

/** The longest wait `setTimeout` takes (a signed 32-bit number of ms): a longer one fires at once. */
const LONGEST_WAIT = 2 ** 31 - 1;

/** A second after the moment, so a reader comparing with the clock finds it passed. */
const SLACK_MS = 1000;

/** What a reader sees of the clock. */
export interface CacheClock {
  /** Whether `until` is past. */
  readonly expired: boolean;
  /** The time as of the last tick (an ISO string), which only moves when the cache expires. */
  readonly now: string;
}

/**
 * A clock for a cache that stays warm until `until` (null: no cache to watch). Whatever reads `expired` or `now` in an
 * effect, a derived value or the template is run again a second after `until`, and the timer goes once nothing reads
 * it: an unmounted reader leaves none. For another `until`, make another clock.
 */
export function cacheClock(until: string | null): CacheClock {
  let now = new Date().toISOString();
  const subscribe = createSubscriber((update) => {
    now = new Date().toISOString();
    const wait = until === null ? NaN : Date.parse(until) - Date.now();
    // only a moment still ahead (and one a timer can wait for) needs a tick
    if (!(wait > 0 && wait <= LONGEST_WAIT)) return undefined;
    const timer = setTimeout(() => {
      now = new Date().toISOString();
      update();
    }, wait + SLACK_MS);
    return () => clearTimeout(timer);
  });
  return {
    get expired(): boolean {
      subscribe();
      return until !== null && Date.parse(until) < Date.now();
    },
    get now(): string {
      subscribe();
      return now;
    },
  };
}
