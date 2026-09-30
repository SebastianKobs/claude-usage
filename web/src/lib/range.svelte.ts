// The range the page shows, as reactive state: how many days, and for the Daily range which day. The range filter
// draws it and changes it; the old classic scripts reload the page's data when it changes, through `onchange`.

import type { Summary } from './api';
import { dayText } from './format.ts';
import { readPreference, savePreference } from './prefs.svelte.ts';
import { dayStep, rangeDays, shownDay } from './range.ts';

/** The range in days the page starts with: the saved one, else a month. */
function savedDays(): number {
  return rangeDays(Number(readPreference('days'))) ?? 30;
}

/** The range shown as reactive state. Not named `Range`: the bridge hands this module's exports to `window`, where
 *  that would overwrite the DOM's own `Range`. */
export class RangeState {
  #days = $state(savedDays());
  // null follows today, which stays today past midnight.
  #day = $state<string | null>(null);

  /** What to do once the range changed: the old scripts set it to reload the page's data. Not reactive. */
  onchange: (() => void) | null = null;

  /** The range's length in days: 1 for the Daily range. */
  get days(): number {
    return this.#days;
  }

  /** The day the Daily range shows, null for today. */
  get day(): string | null {
    return this.#day;
  }

  /** Picks a range, which is saved, and starts the Daily range at today again. Reloads even where it is the range
   *  already shown: pressing it again is how to look again. A length that is none of the ranges is ignored. */
  select(days: number): void {
    if (rangeDays(days) === null) return;
    this.#days = days;
    this.#day = null;
    savePreference('days', days);
    this.onchange?.();
  }

  /** Goes to the nearest day with usage before or after the one shown, where `summary` is that day's and names it. */
  step(name: 'previous_day' | 'next_day', summary: Summary | null): void {
    const today = dayText(new Date());
    const target = dayStep(shownDay(summary, this.#day, today), name, today);
    if (target === undefined) return;
    this.#day = target;
    this.onchange?.();
  }

  /** Cuts the range to what the summary covers: the server cuts a saved range longer than the retention. Nothing is
   *  reloaded, the data shown is already that. */
  fit(summary: Summary): void {
    if (summary.days >= this.#days) return;
    this.#days = summary.days;
    savePreference('days', summary.days);
  }

  /** Back to the saved range, today and no listener: for the tests, which share the singleton. */
  reset(): void {
    this.#days = savedDays();
    this.#day = null;
    this.onchange = null;
  }
}

// A module singleton for now, like `payload` in payload.svelte.ts: the old scripts reach it as a global through the
// bridge; it moves into context (3.32) once the components own the page.
export const range = new RangeState();
