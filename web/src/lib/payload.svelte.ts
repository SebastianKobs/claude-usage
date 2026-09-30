// What the page has loaded, for the components that draw it: the summary of the range shown, or that loading it failed.
// The old classic scripts fetch it and hand it over through `setPayload`, until the app fetches it itself.

import { flushSync } from 'svelte';
import type { Summary } from './api';

/** The parts of the payload. */
export interface PayloadParts {
  /** The summary of the range shown. */
  summary: Summary;
  /** Whether loading the first summary failed, so the tiles say so instead of loading. */
  summaryFailed: boolean;
}

/** The page's payload as reactive state. */
export class Payload {
  // $state.raw: the summary is replaced whole by each load, never changed in place, and is large.
  #summary = $state.raw<Summary | null>(null);
  #summaryFailed = $state(false);

  /** The summary of the range shown, null until one is loaded. */
  get summary(): Summary | null {
    return this.#summary;
  }

  /** Whether loading the summary failed and none was loaded since. */
  get summaryFailed(): boolean {
    return this.#summaryFailed;
  }

  /** Sets the parts given. A summary also clears the failure: it is what the failure was about. */
  set(parts: Partial<PayloadParts>): void {
    if (parts.summary !== undefined) {
      this.#summary = parts.summary;
      this.#summaryFailed = false;
    }
    if (parts.summaryFailed !== undefined) this.#summaryFailed = parts.summaryFailed;
  }

  /** Back to nothing loaded, as at the page's start: for the tests, which share the singleton. */
  reset(): void {
    this.#summary = null;
    this.#summaryFailed = false;
  }
}

// A module singleton for now, like `preferences` in prefs.svelte.ts: the old scripts reach it as a global through the
// bridge; it moves into context (3.32) once the components own the page.
export const payload = new Payload();

/** Sets parts of the page's payload and draws at once, which the old scripts count on: they look at the page right
 *  after. */
export function setPayload(parts: Partial<PayloadParts>): void {
  payload.set(parts);
  flushSync();
}
