// The range the page shows, as reactive state: how many days, and for the Daily range which day. The range filter
// draws it and changes it; the loader (app/loader.ts) reloads the page's data when it changes, through `onchange`.

import type { Summary } from '../api/api';
import { dayText } from '../ui/format.ts';
import { readPreference, savePreference } from './prefs.svelte.ts';
import { dayStep, rangeDays, shownDay } from './range.ts';

/** The range in days the page starts with: the saved one, else a month. */
function savedDays(): number {
  return rangeDays(Number(readPreference('days'))) ?? 30;
}

/** The range shown as reactive state. Not named `Range`, which is the DOM's own class. */
export class RangeState {
  #days = $state(savedDays());
  // null follows today, which stays today past midnight.
  #day = $state<string | null>(null);

  /** What to do once the range changed: the loader sets it to reload the page's data. Not reactive. */
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
}
