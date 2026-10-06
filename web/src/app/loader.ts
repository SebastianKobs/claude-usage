// Loading the page's data and keeping it fresh: the live sessions every 5 s, the summary every 60 s, the open session
// every 5 s while it is live and every 60 s otherwise, none of it while the tab is hidden. Each request is told
// apart from older ones, so only the newest answer is drawn, and an answer unchanged since the last is not drawn again,
// which keeps focus and scroll position inside what is shown. The results go into the app's payload, and the failures
// into its banner, one message per source (live, summary, session, scan).

import { untrack } from 'svelte';
import type { Live, SessionDetail, Summary } from '../api/api';
import type { AppState } from './app.svelte';
import { dayText } from '../ui/format';
import { fetchJson as serverJson } from './http';
import { waitChanged } from '../live/live';
import { rangeQuery } from './range';

/** How often the live sessions, and an open live session, are asked for. */
export const LIVE_INTERVAL_MS = 5000;
/** How often the summary, and an open session that isn't live (which notices a resumed one), are asked for. */
export const SUMMARY_INTERVAL_MS = 60000;

// the server's session-id pattern: anything else isn't a session link
const SESSION_HASH = /^#session\/([A-Za-z0-9_-]{1,128})$/;

/** What the loader takes from outside, so a test can hand it a server, a tab and an address. */
export interface LoaderOptions {
  /** Fetches the server's JSON; rejects with the reason it gave. */
  fetchJson?: <T>(path: string) => Promise<T>;
  /** Whether the tab is hidden. */
  hidden?: () => boolean;
  /** The address's fragment, `#session/<id>` for an open session. */
  hash?: () => string;
  /** Draws a change of the open session in place (focus and the reader's place kept): it runs `draw`. */
  keep?: (draw: () => void) => void;
}

/** What a failed request says: the reason the server gave. */
function reason(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

/** Today's date and hour count in the key too, as the charts run up to now. */
function drawnKey(answer: unknown): string {
  const now = new Date();
  return `${dayText(now)}T${now.getHours()} ${JSON.stringify(answer)}`;
}

/** The loader of the page's data. `start` begins, `stop` ends (for a page taken down). */
export class Loader {
  readonly #app: AppState;
  readonly #fetchJson: <T>(path: string) => Promise<T>;
  readonly #hidden: () => boolean;
  readonly #hash: () => string;
  readonly #keep: (draw: () => void) => void;

  // The newest request of each kind and the key of what it last drew; an older answer is dropped.
  #summaryRequest = 0;
  #summaryKey: string | null = null;
  #liveRequest = 0;
  #liveKey: string | null = null;
  #sessionRequest = 0;
  #sessionKey: string | null = null;
  // The sessions whose live card's state is on its way: one request per session at a time.
  readonly #liveStateRequests = new Set<string>();
  // The next request goes out after the previous answer, so a slow server never gets two at once. Timers are cleared
  // before they are set, so two chains merge into one.
  #liveTimer: ReturnType<typeof setTimeout> | undefined;
  #summaryTimer: ReturnType<typeof setTimeout> | undefined;
  #sessionTimer: ReturnType<typeof setTimeout> | undefined;

  constructor(app: AppState, options: LoaderOptions = {}) {
    this.#app = app;
    this.#fetchJson = options.fetchJson ?? serverJson;
    this.#hidden = options.hidden ?? (() => document.hidden);
    this.#hash = options.hash ?? (() => location.hash);
    this.#keep = options.keep ?? ((draw) => draw());
  }

  /** Opens the session the address names and starts polling. A new range reloads the summary and the live sessions at
   *  once, since the live sessions follow the range shown. */
  start(): void {
    this.#app.range.onchange = () => this.loadRange();
    // what the first requests read (the range, the open session) is not what a caller's effect should depend on: a
    // new range reloads through `onchange`, not by starting again
    untrack(() => {
      void this.loadSession();
      this.visibilityChanged();
    });
  }

  /** Stops every timer and drops the answers still on their way. */
  stop(): void {
    this.#clearTimers();
    this.#summaryRequest++;
    this.#liveRequest++;
    this.#sessionRequest++;
    this.#app.range.onchange = null;
  }

  /** The tab was hidden or shown: a hidden tab asks nothing, showing it again asks at once. */
  visibilityChanged(): void {
    this.#clearTimers();
    if (this.#hidden()) return;
    void this.#pollLive();
    void this.#pollSummary();
    if (this.#app.payload.session) void this.refreshSession();
  }

  /** The address changed: another session, or none, is to be shown. */
  hashChanged(): void {
    void this.loadSession();
  }

  /** A new range: the live sessions follow it too, at once rather than at their next poll. */
  loadRange(): void {
    void this.loadSummary();
    void this.loadLive();
  }

  #clearTimers(): void {
    clearTimeout(this.#liveTimer);
    clearTimeout(this.#summaryTimer);
    clearTimeout(this.#sessionTimer);
  }

  #showScanErrors(answer: { scan_errors?: string[] }): void {
    const found = answer.scan_errors ?? [];
    const more = found.length > 1 ? ` (and ${found.length - 1} more, see the server's log)` : '';
    this.#app.messages.show('scan', found.length ? `Scan: ${found[0]}${more}` : '');
  }

  /** Loads the summary of the range shown; keeps the previous one dimmed while it loads. */
  async loadSummary(): Promise<void> {
    const { payload, messages, range } = this.#app;
    payload.set({ summaryLoading: true });
    // stepping through days quickly overlaps requests: only the newest one may draw
    const request = ++this.#summaryRequest;
    try {
      const summary = await this.#fetchJson<Summary>(`/api/summary?${rangeQuery(range.days, range.day)}`);
      if (request !== this.#summaryRequest) return;
      messages.show('summary', '');
      this.#showScanErrors(summary);
      range.fit(summary);
      const key = drawnKey(summary);
      if (key !== this.#summaryKey) {
        this.#summaryKey = key;
        payload.set({ summary });
      }
    } catch (error) {
      if (request !== this.#summaryRequest) return;
      messages.show('summary', reason(error));
      if (!payload.summary) payload.set({ summaryFailed: true });
    } finally {
      if (request === this.#summaryRequest) payload.set({ summaryLoading: false });
    }
  }

  /** Loads the live sessions of the range shown; true where it was the newest request and it succeeded. */
  async loadLive(): Promise<boolean> {
    const { payload, messages, range } = this.#app;
    // a poll for the range before may answer after a new range's request: only the newest one may draw
    const request = ++this.#liveRequest;
    try {
      const live = await this.#fetchJson<Live>(`/api/live?${rangeQuery(range.days, range.day)}`);
      if (request !== this.#liveRequest) return false;
      messages.show('live', '');
      this.#showScanErrors(live);
      const key = JSON.stringify(live);
      if (key !== this.#liveKey) {
        this.#liveKey = key;
        payload.set({ live, liveAt: Date.now() });
        // the open session's waits follow the list by themselves; a changed one asks at once
        const open = payload.session;
        if (open && this.#sessionShown() && waitChanged(open, live.sessions)) void this.refreshSession();
      } else {
        payload.set({ liveAt: Date.now() }); // the cards' "12 s ago" run on
      }
      this.#loadLiveStates(live.sessions);
      return true;
    } catch (error) {
      if (request !== this.#liveRequest) return false;
      messages.show('live', reason(error));
      if (this.#liveKey === null) payload.set({ liveFailed: true });
      return false;
    }
  }

  // Each live card's compact and security state, asked for once the list is drawn and not awaited: the server reads
  // the transcripts for it, so neither the list nor its poll waits. The states of sessions no longer live go.
  #loadLiveStates(sessions: { session_id: string }[]): void {
    const ids = new Set(sessions.map((session) => session.session_id));
    this.#app.payload.keepLiveStates(ids);
    for (const id of ids) void this.#loadLiveState(id);
  }

  // A failed one keeps the state shown: the live list's own request shows what failed, and the next poll asks again.
  async #loadLiveState(id: string): Promise<void> {
    if (this.#liveStateRequests.has(id)) return;
    this.#liveStateRequests.add(id);
    try {
      this.#app.payload.setLiveState(id, await this.#fetchJson(`/api/session/${encodeURIComponent(id)}/state`));
    } catch {
      // the next poll asks again
    } finally {
      this.#liveStateRequests.delete(id);
    }
  }

  async #pollLive(): Promise<void> {
    const ok = await this.loadLive();
    // the server is back: the summary needn't wait for its next turn
    if (ok && this.#app.messages.has('summary')) void this.#pollSummary();
    clearTimeout(this.#liveTimer);
    if (!this.#hidden()) this.#liveTimer = setTimeout(() => void this.#pollLive(), LIVE_INTERVAL_MS);
  }

  async #pollSummary(): Promise<void> {
    await this.loadSummary();
    clearTimeout(this.#summaryTimer);
    if (!this.#hidden()) this.#summaryTimer = setTimeout(() => void this.#pollSummary(), SUMMARY_INTERVAL_MS);
  }

  /** Opens the session the address names, or closes the view where it names none. */
  async loadSession(): Promise<void> {
    const { payload, messages } = this.#app;
    const request = ++this.#sessionRequest; // a late answer for a session left since doesn't draw
    clearTimeout(this.#sessionTimer);
    const hash = this.#hash();
    const match = hash.match(SESSION_HASH);
    if (!match) {
      messages.show('session', hash.startsWith('#session/') ? 'Not a session link.' : '');
      payload.set({ session: null }); // the view returns focus and scroll to its link
      return;
    }
    try {
      const session = await this.#fetchJson<SessionDetail>(`/api/session/${encodeURIComponent(match[1] as string)}`);
      if (request !== this.#sessionRequest) return;
      messages.show('session', '');
      this.#sessionKey = drawnKey(session);
      payload.set({ session }); // the view takes focus and the top of the window
      this.#pollSession();
    } catch (error) {
      if (request === this.#sessionRequest) messages.show('session', reason(error));
    }
  }

  // whether the open session is the one the address names: not while another one loads, whose answer a refresh of the
  // open one would drop (#sessionRequest)
  #sessionShown(): boolean {
    const match = this.#hash().match(SESSION_HASH);
    const open = this.#app.payload.session;
    return Boolean(open && match && match[1] === open.session_id);
  }

  // The open session asks again after each answer: every LIVE_INTERVAL_MS while it is live, else every
  // SUMMARY_INTERVAL_MS. A hidden tab asks nothing; closing the session stops it.
  #pollSession(): void {
    clearTimeout(this.#sessionTimer);
    const open = this.#app.payload.session;
    if (this.#hidden() || open === null) return;
    this.#sessionTimer = setTimeout(
      () => void this.refreshSession(),
      open.live ? LIVE_INTERVAL_MS : SUMMARY_INTERVAL_MS,
    );
  }

  /** Asks for the open session again. An unchanged one is not drawn again; a changed one is drawn in place, and the
   *  conversation shown reads itself again with it. */
  async refreshSession(): Promise<void> {
    const { payload, messages } = this.#app;
    const open = payload.session;
    if (!open) return;
    const request = ++this.#sessionRequest;
    try {
      const session = await this.#fetchJson<SessionDetail>(`/api/session/${encodeURIComponent(open.session_id)}`);
      if (request !== this.#sessionRequest) return;
      messages.show('session', '');
      const key = drawnKey(session);
      if (key !== this.#sessionKey) {
        this.#sessionKey = key;
        this.#keep(() => payload.set({ session }));
      }
    } catch (error) {
      if (request !== this.#sessionRequest) return;
      messages.show('session', reason(error));
    }
    this.#pollSession();
  }
}
