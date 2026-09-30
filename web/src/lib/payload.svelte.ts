// What the page has loaded, for the components that draw it: the summary of the range shown, the live sessions and
// their cards' states, the session open, or that loading one failed. The loader (lib/loader.ts) fetches it and sets
// the parts; one instance per page, in the app's context (lib/app.svelte.ts).

import { SvelteMap } from 'svelte/reactivity';
import type { Live, SessionDetail, SessionState, Summary } from './api';

/** The parts of the payload. */
export interface PayloadParts {
  /** The summary of the range shown. */
  summary: Summary;
  /** Whether loading the first summary failed, so the tiles say so instead of loading. */
  summaryFailed: boolean;
  /** Whether a summary is being loaded, which dims the overview until it arrives. */
  summaryLoading: boolean;
  /** The live sessions, /api/live's answer. */
  live: Live;
  /** Whether loading the live sessions failed, so the card says so instead of loading. */
  liveFailed: boolean;
  /** When the newest live answer came, in ms since the epoch, even one unchanged: the cards' "ago" counts from it. */
  liveAt: number;
  /** The session the view shows, /api/session's answer; null closes the view. */
  session: SessionDetail | null;
}

/** The page's payload as reactive state. */
export class Payload {
  // $state.raw: the summary is replaced whole by each load, never changed in place, and is large.
  #summary = $state.raw<Summary | null>(null);
  #summaryFailed = $state(false);
  #summaryLoading = $state(false);
  // Likewise replaced whole by each answer.
  #live = $state.raw<Live | null>(null);
  #liveFailed = $state(false);
  #liveAt = $state<number | null>(null);
  // The open session, replaced whole by each refresh, which comes every few seconds while it is live.
  #session = $state.raw<SessionDetail | null>(null);
  // A live card's state by session: a map that is reactive per key, so one card's state moving redraws that card only.
  #liveStates = new SvelteMap<string, SessionState>();

  /** The summary of the range shown, null until one is loaded. */
  get summary(): Summary | null {
    return this.#summary;
  }

  /** Whether loading the summary failed and none was loaded since. */
  get summaryFailed(): boolean {
    return this.#summaryFailed;
  }

  /** Whether a summary is being loaded now, which the page shows by dimming the overview. */
  get summaryLoading(): boolean {
    return this.#summaryLoading;
  }

  /** The live sessions, null until an answer is loaded. */
  get live(): Live | null {
    return this.#live;
  }

  /** Whether loading the live sessions failed and none was loaded since. */
  get liveFailed(): boolean {
    return this.#liveFailed;
  }

  /** When the newest live answer came (ms since the epoch), null until one has. */
  get liveAt(): number | null {
    return this.#liveAt;
  }

  /** The session the view shows, null while none is open. */
  get session(): SessionDetail | null {
    return this.#session;
  }

  /** A live card's state, undefined until it is loaded or once its session is no longer live. */
  liveState(sessionId: string): SessionState | undefined {
    return this.#liveStates.get(sessionId);
  }

  /** Keeps a live card's state. */
  setLiveState(sessionId: string, state: SessionState): void {
    this.#liveStates.set(sessionId, state);
  }

  /** Drops the states of every session but these, the ones still live. */
  keepLiveStates(sessionIds: Iterable<string>): void {
    const keep = [...sessionIds];
    for (const sessionId of [...this.#liveStates.keys()]) {
      if (!keep.includes(sessionId)) this.#liveStates.delete(sessionId);
    }
  }

  /** Sets the parts given. A summary also clears the failure: it is what the failure was about; so does a live
   *  answer for the live one. A session of null closes the view. */
  set(parts: Partial<PayloadParts>): void {
    if (parts.summary !== undefined) {
      this.#summary = parts.summary;
      this.#summaryFailed = false;
    }
    if (parts.summaryFailed !== undefined) this.#summaryFailed = parts.summaryFailed;
    if (parts.summaryLoading !== undefined) this.#summaryLoading = parts.summaryLoading;
    if (parts.live !== undefined) {
      this.#live = parts.live;
      this.#liveFailed = false;
    }
    if (parts.liveFailed !== undefined) this.#liveFailed = parts.liveFailed;
    if (parts.liveAt !== undefined) this.#liveAt = parts.liveAt;
    if (parts.session !== undefined) this.#session = parts.session;
  }
}
