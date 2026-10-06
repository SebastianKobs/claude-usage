import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import type { Live, SessionDetail, SessionState, Summary, Waiting } from '../api/api';
import { AppState } from './app.svelte';
import { live, liveSession, sessionDetail, summary } from '../api/fixtures';
import { Loader, LIVE_INTERVAL_MS, SUMMARY_INTERVAL_MS } from './loader';

/** A server the test answers by hand: each request waits until it is answered. */
class Server {
  requests: { path: string; answer: (body: unknown) => void; fail: (message: string) => void }[] = [];

  fetchJson = <T>(path: string): Promise<T> =>
    new Promise<T>((resolve, reject) => {
      this.requests.push({ path, answer: (body) => resolve(body as T), fail: (message) => reject(new Error(message)) });
    });

  /** The paths asked for so far, in order. */
  get paths(): string[] {
    return this.requests.map((request) => request.path);
  }

  /** The requests for `prefix` not answered yet, oldest first. */
  open(prefix: string): Server['requests'] {
    return this.requests.filter((request) => request.path.startsWith(prefix) && !this.answered.has(request));
  }

  /** The requests for exactly `path` not answered yet (a session's own, not its state). */
  openFor(path: string): Server['requests'] {
    return this.open(path).filter((request) => request.path === path);
  }

  answered = new Set<Server['requests'][number]>();

  /** Answers the oldest open request for `prefix`. */
  reply(prefix: string, body: unknown): void {
    const request = this.open(prefix)[0];
    if (!request) throw new Error(`no open request for ${prefix}`);
    this.answered.add(request);
    request.answer(body);
  }

  /** Fails the oldest open request for `prefix`. */
  refuse(prefix: string, message: string): void {
    const request = this.open(prefix)[0];
    if (!request) throw new Error(`no open request for ${prefix}`);
    this.answered.add(request);
    request.fail(message);
  }

  /** Answers every request open now with what `bodies` holds for its path's start. */
  replyAll(bodies: Record<string, unknown>): void {
    for (const request of this.open('')) {
      const prefix = Object.keys(bodies).find((start) => request.path.startsWith(start));
      if (prefix) {
        this.answered.add(request);
        request.answer(bodies[prefix]);
      }
    }
  }
}

let server: Server;
let app: AppState;
let hash: string;
let hidden: boolean;
let kept: number;
let loader: Loader;

function make(): Loader {
  return new Loader(app, {
    fetchJson: server.fetchJson,
    hidden: () => hidden,
    hash: () => hash,
    keep: (draw) => {
      kept++;
      draw();
    },
  });
}

/** Lets the answers already given settle. */
async function settle(): Promise<void> {
  await vi.advanceTimersByTimeAsync(0);
}

beforeEach(() => {
  localStorage.clear();
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2026-09-30T12:00:00'));
  server = new Server();
  app = new AppState();
  hash = '';
  hidden = false;
  kept = 0;
  loader = make();
});

afterEach(() => {
  loader.stop();
  vi.useRealTimers();
  localStorage.clear();
});

const WAITING: Waiting = {
  kind: 'question',
  tool: 'AskUserQuestion',
  since: '2026-09-30T11:59:00Z',
  agent_type: null,
};
const SUMMARY = '/api/summary';
const LIVE = '/api/live';

describe('the start', () => {
  test('asks for the summary and the live sessions of the range shown', () => {
    loader.start();
    expect([...server.paths].sort()).toEqual([`${LIVE}?days=30`, `${SUMMARY}?days=30`]);
  });

  test('asks for both with the day of the Daily range', () => {
    app.range.select(1);
    loader.stop();
    loader = make();
    app.range.step('previous_day', summary({ days: 1, until: '2026-09-30', previous_day: '2026-09-28' }));
    loader.start();
    expect(server.paths.every((path) => path.endsWith('days=1&until=2026-09-28'))).toBe(true);
    expect(server.paths).toHaveLength(2);
  });

  test('draws what comes', async () => {
    loader.start();
    const answer = summary({ days: 30 });
    const liveAnswer = live();
    server.replyAll({ [SUMMARY]: answer, [LIVE]: liveAnswer });
    await settle();
    expect(app.payload.summary).toEqual(answer);
    expect(app.payload.live).toEqual(liveAnswer);
    expect(app.payload.liveAt).toBe(Date.now());
    expect(app.payload.summaryLoading).toBe(false);
  });

  test('dims the overview while a summary loads', async () => {
    loader.start();
    expect(app.payload.summaryLoading).toBe(true);
    server.reply(SUMMARY, summary());
    await settle();
    expect(app.payload.summaryLoading).toBe(false);
  });

  test('opens no session without one in the address', () => {
    loader.start();
    expect(server.paths.some((path) => path.startsWith('/api/session/'))).toBe(false);
  });

  test('stop takes the range listener away again', () => {
    loader.start();
    expect(app.range.onchange).not.toBeNull();
    loader.stop();
    expect(app.range.onchange).toBeNull();
  });
});

describe('the summary', () => {
  test('cuts the range to what the answer covers', async () => {
    loader.start();
    server.replyAll({ [SUMMARY]: summary({ days: 7 }) });
    await settle();
    expect(app.range.days).toBe(7);
  });

  test('is not drawn again where it is unchanged', async () => {
    loader.start();
    server.replyAll({ [SUMMARY]: summary({ days: 30 }) });
    await settle();
    const first = app.payload.summary;
    void loader.loadSummary();
    server.reply(SUMMARY, summary({ days: 30 }));
    await settle();
    expect(app.payload.summary).toBe(first);
  });

  test('is drawn again once it changed', async () => {
    loader.start();
    server.replyAll({ [SUMMARY]: summary({ days: 30 }) });
    await settle();
    void loader.loadSummary();
    server.reply(SUMMARY, summary({ days: 30, history_since: '2026-01-01' }));
    await settle();
    expect(app.payload.summary?.history_since).toBe('2026-01-01');
  });

  test('is drawn again once the hour changed, as the charts run up to now', async () => {
    loader.start();
    server.replyAll({ [SUMMARY]: summary({ days: 30 }) });
    await settle();
    const first = app.payload.summary;
    vi.setSystemTime(new Date('2026-09-30T13:00:00'));
    void loader.loadSummary();
    server.reply(SUMMARY, summary({ days: 30 }));
    await settle();
    expect(app.payload.summary).not.toBe(first);
  });

  test('only the newest request is drawn, whichever answers last', async () => {
    loader.start();
    void loader.loadSummary();
    const [older, newer] = server.open(SUMMARY).slice(-2);
    older?.answer(summary({ days: 30, history_since: 'older' }));
    await settle();
    // the older answer is dropped, and the newer request is still on its way
    expect(app.payload.summary).toBeNull();
    expect(app.payload.summaryLoading).toBe(true);
    newer?.answer(summary({ days: 30, history_since: 'newer' }));
    await settle();
    expect(app.payload.summary?.history_since).toBe('newer');
    expect(app.payload.summaryLoading).toBe(false);
  });

  test('a failed first load says so in the banner and on the page', async () => {
    loader.start();
    server.refuse(SUMMARY, 'HTTP 500');
    await settle();
    expect(app.messages.text).toBe('HTTP 500');
    expect(app.payload.summaryFailed).toBe(true);
    expect(app.payload.summaryLoading).toBe(false);
  });

  test('a failed later load keeps what is shown', async () => {
    loader.start();
    server.replyAll({ [SUMMARY]: summary({ days: 30 }) });
    await settle();
    void loader.loadSummary();
    server.refuse(SUMMARY, 'HTTP 500');
    await settle();
    expect(app.messages.text).toBe('HTTP 500');
    expect(app.payload.summaryFailed).toBe(false);
    expect(app.payload.summary).not.toBeNull();
  });

  test('an answer clears its message', async () => {
    loader.start();
    server.refuse(SUMMARY, 'HTTP 500');
    await settle();
    void loader.loadSummary();
    server.reply(SUMMARY, summary({ days: 30 }));
    await settle();
    expect(app.messages.has('summary')).toBe(false);
    expect(app.payload.summaryFailed).toBe(false);
  });

  test('a request that failed and was replaced does not say so', async () => {
    loader.start();
    void loader.loadSummary();
    const [older, newer] = server.open(SUMMARY).slice(-2);
    older?.fail('late failure');
    await settle();
    expect(app.messages.has('summary')).toBe(false);
    newer?.answer(summary({ days: 30 }));
    await settle();
    expect(app.payload.summaryLoading).toBe(false);
  });

  test('the files a scan skipped are named, with how many more', async () => {
    loader.start();
    server.replyAll({ [SUMMARY]: summary({ days: 30, scan_errors: ['a.jsonl: bad', 'b.jsonl: bad'] }) });
    await settle();
    expect(app.messages.text).toBe("Scan: a.jsonl: bad (and 1 more, see the server's log)");
  });

  test('one skipped file is named alone, and the message goes once none is', async () => {
    loader.start();
    server.replyAll({ [SUMMARY]: summary({ days: 30, scan_errors: ['a.jsonl: bad'] }) });
    await settle();
    expect(app.messages.text).toBe('Scan: a.jsonl: bad');
    void loader.loadSummary();
    server.reply(SUMMARY, summary({ days: 30, scan_errors: [], history_since: 'x' }));
    await settle();
    expect(app.messages.has('scan')).toBe(false);
  });
});

describe('the live sessions', () => {
  test('are drawn with when they came, even unchanged, so the cards run on', async () => {
    loader.start();
    server.replyAll({ [LIVE]: live() });
    await settle();
    const first = app.payload.live;
    await vi.advanceTimersByTimeAsync(LIVE_INTERVAL_MS);
    server.replyAll({ [LIVE]: live() });
    await settle();
    expect(app.payload.live).toBe(first);
    expect(app.payload.liveAt).toBe(Date.now());
  });

  test('only the newest request is drawn', async () => {
    loader.start();
    void loader.loadLive();
    const [older, newer] = server.open(LIVE).slice(-2);
    newer?.answer(live({ sessions: [liveSession({ session_id: 'newer' })] }));
    await settle();
    older?.answer(live({ sessions: [liveSession({ session_id: 'older' })] }));
    await settle();
    expect(app.payload.live?.sessions.map((session) => session.session_id)).toEqual(['newer']);
  });

  test('a failed first load says so, a later one keeps the list', async () => {
    loader.start();
    server.refuse(LIVE, 'HTTP 500');
    await settle();
    expect(app.payload.liveFailed).toBe(true);
    expect(app.messages.text).toBe('HTTP 500');
    await vi.advanceTimersByTimeAsync(LIVE_INTERVAL_MS);
    server.reply(LIVE, live());
    await settle();
    expect(app.payload.liveFailed).toBe(false);
    expect(app.messages.has('live')).toBe(false);
    await vi.advanceTimersByTimeAsync(LIVE_INTERVAL_MS);
    server.refuse(LIVE, 'HTTP 500');
    await settle();
    expect(app.payload.liveFailed).toBe(false);
    expect(app.payload.live).not.toBeNull();
    expect(app.messages.text).toBe('HTTP 500');
  });

  test('ask for each card state once, and not again while one is on its way', async () => {
    loader.start();
    const sessions = [liveSession({ session_id: 'a' }), liveSession({ session_id: 'b' })];
    server.replyAll({ [LIVE]: live({ sessions }) });
    await settle();
    expect(server.paths.filter((path) => path.endsWith('/state'))).toEqual([
      '/api/session/a/state',
      '/api/session/b/state',
    ]);
    await vi.advanceTimersByTimeAsync(LIVE_INTERVAL_MS);
    server.replyAll({ [LIVE]: live({ sessions }) });
    await settle();
    expect(server.paths.filter((path) => path.endsWith('/state'))).toHaveLength(2);
  });

  test('keep a card state for its session, and drop those of sessions no longer live', async () => {
    loader.start();
    const sessions = [liveSession({ session_id: 'a' }), liveSession({ session_id: 'b' })];
    server.replyAll({ [LIVE]: live({ sessions }) });
    await settle();
    const state = { current: null } as unknown as SessionState;
    server.reply('/api/session/a/state', state);
    server.reply('/api/session/b/state', state);
    await settle();
    expect(app.payload.liveState('a')).toBe(state);
    await vi.advanceTimersByTimeAsync(LIVE_INTERVAL_MS);
    server.reply(LIVE, live({ sessions: [liveSession({ session_id: 'a' })] }));
    await settle();
    expect(app.payload.liveState('b')).toBeUndefined();
    expect(app.payload.liveState('a')).toBe(state);
  });

  test('a card state that fails keeps the one shown and is asked for again at the next poll', async () => {
    loader.start();
    const sessions = [liveSession({ session_id: 'a' })];
    server.replyAll({ [LIVE]: live({ sessions }) });
    await settle();
    const state = { current: null } as unknown as SessionState;
    server.reply('/api/session/a/state', state);
    await settle();
    await vi.advanceTimersByTimeAsync(LIVE_INTERVAL_MS);
    server.reply(LIVE, live({ sessions }));
    await settle();
    server.refuse('/api/session/a/state', 'HTTP 500');
    await settle();
    expect(app.payload.liveState('a')).toBe(state);
    expect(app.messages.has('live')).toBe(false);
    await vi.advanceTimersByTimeAsync(LIVE_INTERVAL_MS);
    server.reply(LIVE, live({ sessions }));
    await settle();
    expect(server.paths.filter((path) => path.endsWith('/state'))).toHaveLength(3);
  });
});

describe('the polling', () => {
  test('goes by the intervals the page documents: live every 5 s, the summary every 60 s', () => {
    expect([LIVE_INTERVAL_MS, SUMMARY_INTERVAL_MS]).toEqual([5000, 60_000]);
  });

  test('does not wait for the card states', async () => {
    loader.start();
    const sessions = [liveSession({ session_id: 'a' })];
    server.replyAll({ [SUMMARY]: summary({ days: 30 }), [LIVE]: live({ sessions }) });
    await settle();
    expect(server.openFor('/api/session/a/state')).toHaveLength(1);
    await vi.advanceTimersByTimeAsync(LIVE_INTERVAL_MS);
    expect(server.openFor('/api/live?days=30')).toHaveLength(1);
  });

  async function started(answers: { live?: Live; summary?: Summary } = {}): Promise<void> {
    loader.start();
    server.replyAll({ [SUMMARY]: answers.summary ?? summary({ days: 30 }), [LIVE]: answers.live ?? live() });
    await settle();
  }

  test('asks for the live sessions every 5 s and the summary every 60 s', async () => {
    await started();
    const count = (prefix: string) => server.paths.filter((path) => path.startsWith(prefix)).length;
    expect([count(LIVE), count(SUMMARY)]).toEqual([1, 1]);
    await vi.advanceTimersByTimeAsync(LIVE_INTERVAL_MS - 1);
    expect(count(LIVE)).toBe(1);
    await vi.advanceTimersByTimeAsync(1);
    expect([count(LIVE), count(SUMMARY)]).toEqual([2, 1]);
    server.replyAll({ [LIVE]: live() });
    await vi.advanceTimersByTimeAsync(SUMMARY_INTERVAL_MS - LIVE_INTERVAL_MS);
    expect(count(SUMMARY)).toBe(2);
  });

  test('asks again only after the answer, so a slow server never gets two at once', async () => {
    loader.start();
    await vi.advanceTimersByTimeAsync(SUMMARY_INTERVAL_MS * 2);
    expect(server.open(LIVE)).toHaveLength(1);
    expect(server.open(SUMMARY)).toHaveLength(1);
  });

  test('a hidden tab asks nothing more, showing it again asks at once', async () => {
    await started();
    hidden = true;
    loader.visibilityChanged();
    const before = server.paths.length;
    await vi.advanceTimersByTimeAsync(SUMMARY_INTERVAL_MS * 2);
    expect(server.paths).toHaveLength(before);
    hidden = false;
    loader.visibilityChanged();
    expect(server.paths.slice(before).sort()).toEqual([`${LIVE}?days=30`, `${SUMMARY}?days=30`]);
  });

  test('a request on its way when the tab was hidden sets no timer', async () => {
    loader.start();
    hidden = true;
    loader.visibilityChanged();
    server.replyAll({ [SUMMARY]: summary({ days: 30 }), [LIVE]: live() });
    await vi.advanceTimersByTimeAsync(SUMMARY_INTERVAL_MS * 2);
    expect(server.paths.filter((path) => path.startsWith(LIVE))).toHaveLength(1);
  });

  test('two chains merge into one', async () => {
    await started();
    loader.visibilityChanged();
    server.replyAll({ [SUMMARY]: summary({ days: 30 }), [LIVE]: live() });
    await settle();
    const before = server.paths.filter((path) => path.startsWith(LIVE)).length;
    await vi.advanceTimersByTimeAsync(LIVE_INTERVAL_MS);
    expect(server.paths.filter((path) => path.startsWith(LIVE)).length).toBe(before + 1);
  });

  test('a summary that failed is asked for again as soon as the server answers the live sessions', async () => {
    loader.start();
    server.refuse(SUMMARY, 'HTTP 500');
    server.reply(LIVE, live());
    await settle();
    expect(server.open(SUMMARY)).toHaveLength(1);
  });

  test('stop ends it, and answers still on their way draw nothing', async () => {
    await started();
    const shown = app.payload.live;
    void loader.loadLive();
    loader.stop();
    server.reply(LIVE, live({ sessions: [liveSession({ session_id: 'late' })] }));
    await settle();
    expect(app.payload.live).toBe(shown);
    const before = server.paths.length;
    await vi.advanceTimersByTimeAsync(SUMMARY_INTERVAL_MS * 2);
    expect(server.paths).toHaveLength(before);
  });
});

describe('a new range', () => {
  test('reloads the summary and the live sessions at once', async () => {
    loader.start();
    server.replyAll({ [SUMMARY]: summary({ days: 30 }), [LIVE]: live() });
    await settle();
    const before = server.paths.length;
    app.range.select(7);
    expect(server.paths.slice(before).sort()).toEqual([`${LIVE}?days=7`, `${SUMMARY}?days=7`]);
  });
});

describe('the open session', () => {
  const OPEN = '#session/abc-1';

  async function opened(changes: Partial<SessionDetail> = {}): Promise<void> {
    hash = OPEN;
    loader.start();
    server.reply('/api/session/abc-1', sessionDetail({ session_id: 'abc-1', live: false, ...changes }));
    await settle();
  }

  test('is loaded from the address, and draws as the view', async () => {
    await opened();
    expect(app.payload.session?.session_id).toBe('abc-1');
    expect(app.messages.has('session')).toBe(false);
  });

  test('an id is escaped in the request', async () => {
    hash = '#session/a_b-c';
    loader.start();
    expect(server.paths).toContain('/api/session/a_b-c');
  });

  test('an address that is not a session link says so and closes the view', async () => {
    await opened();
    hash = '#session/not a link';
    loader.hashChanged();
    await settle();
    expect(app.messages.text).toBe('Not a session link.');
    expect(app.payload.session).toBeNull();
  });

  test('another address closes it without a message, and stops its poll', async () => {
    await opened({ live: true });
    hash = '#something';
    loader.hashChanged();
    await settle();
    expect(app.payload.session).toBeNull();
    expect(app.messages.has('session')).toBe(false);
    const before = server.paths.filter((path) => path.startsWith('/api/session/abc-1')).length;
    await vi.advanceTimersByTimeAsync(SUMMARY_INTERVAL_MS * 2);
    expect(server.paths.filter((path) => path.startsWith('/api/session/abc-1')).length).toBe(before);
  });

  test('a failed load says why', async () => {
    hash = OPEN;
    loader.start();
    server.refuse('/api/session/abc-1', 'HTTP 404');
    await settle();
    expect(app.messages.text).toBe('HTTP 404');
    expect(app.payload.session).toBeNull();
  });

  test('a late answer for a session left since draws nothing', async () => {
    hash = OPEN;
    loader.start();
    hash = '#session/other';
    loader.hashChanged();
    const first = server.requests.find((request) => request.path === '/api/session/abc-1');
    first?.answer(sessionDetail({ session_id: 'abc-1' }));
    await settle();
    expect(app.payload.session).toBeNull();
    server.reply('/api/session/other', sessionDetail({ session_id: 'other' }));
    await settle();
    expect(app.payload.session?.session_id).toBe('other');
  });

  test('the open one is not refreshed while another loads, whose answer that would drop', async () => {
    await opened({ live: true });
    hash = '#session/other';
    loader.hashChanged();
    await vi.advanceTimersByTimeAsync(LIVE_INTERVAL_MS);
    expect(server.openFor('/api/session/abc-1')).toHaveLength(0);
    server.reply('/api/session/other', sessionDetail({ session_id: 'other' }));
    await settle();
    expect(app.payload.session?.session_id).toBe('other');
  });

  test('a live one asks again every 5 s, another every 60 s', async () => {
    await opened({ live: true });
    const asked = () => server.paths.filter((path) => path === '/api/session/abc-1').length;
    await vi.advanceTimersByTimeAsync(LIVE_INTERVAL_MS);
    expect(asked()).toBe(2);
    server.reply('/api/session/abc-1', sessionDetail({ session_id: 'abc-1', live: false }));
    await settle();
    await vi.advanceTimersByTimeAsync(SUMMARY_INTERVAL_MS - 1);
    expect(asked()).toBe(2);
    await vi.advanceTimersByTimeAsync(1);
    expect(asked()).toBe(3);
  });

  test('a changed one is drawn in place, an unchanged one is not drawn again', async () => {
    await opened({ live: true });
    const first = app.payload.session;
    await vi.advanceTimersByTimeAsync(LIVE_INTERVAL_MS);
    server.reply('/api/session/abc-1', sessionDetail({ session_id: 'abc-1', live: true }));
    await settle();
    expect(app.payload.session).toBe(first);
    expect(kept).toBe(0);
    await vi.advanceTimersByTimeAsync(LIVE_INTERVAL_MS);
    server.reply('/api/session/abc-1', sessionDetail({ session_id: 'abc-1', live: true, title: 'New title' }));
    await settle();
    expect(app.payload.session?.title).toBe('New title');
    expect(kept).toBe(1);
  });

  test('the first draw is not a refresh', async () => {
    await opened();
    expect(kept).toBe(0);
  });

  test('a failed refresh says why and keeps the view', async () => {
    await opened({ live: true });
    await vi.advanceTimersByTimeAsync(LIVE_INTERVAL_MS);
    server.refuse('/api/session/abc-1', 'HTTP 500');
    await settle();
    expect(app.messages.text).toBe('HTTP 500');
    expect(app.payload.session?.session_id).toBe('abc-1');
    await vi.advanceTimersByTimeAsync(LIVE_INTERVAL_MS);
    expect(server.openFor('/api/session/abc-1')).toHaveLength(1);
  });

  test('a hidden tab stops its poll, showing it again asks at once', async () => {
    await opened({ live: true });
    hidden = true;
    loader.visibilityChanged();
    const before = server.paths.filter((path) => path === '/api/session/abc-1').length;
    await vi.advanceTimersByTimeAsync(SUMMARY_INTERVAL_MS * 2);
    expect(server.paths.filter((path) => path === '/api/session/abc-1')).toHaveLength(before);
    hidden = false;
    loader.visibilityChanged();
    expect(server.paths.filter((path) => path === '/api/session/abc-1')).toHaveLength(before + 1);
  });

  test('a live answer that sees its wait change asks for it at once', async () => {
    await opened({ live: true, waiting: null });
    server.replyAll({ [SUMMARY]: summary({ days: 30 }) });
    const waiting = WAITING;
    server.reply(LIVE, live({ sessions: [liveSession({ session_id: 'abc-1', waiting })] }));
    await settle();
    expect(server.openFor('/api/session/abc-1')).toHaveLength(1);
  });

  test('not while another session loads', async () => {
    await opened({ live: true, waiting: null });
    hash = '#session/other';
    const waiting = WAITING;
    server.reply(LIVE, live({ sessions: [liveSession({ session_id: 'abc-1', waiting })] }));
    await settle();
    expect(server.openFor('/api/session/abc-1')).toHaveLength(0);
  });
});
