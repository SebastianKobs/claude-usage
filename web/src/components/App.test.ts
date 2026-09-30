import { render, screen } from '@testing-library/svelte';
import { flushSync } from 'svelte';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { AppState } from '../lib/app.svelte';
import { live, liveSession, sessionDetail, summary } from '../lib/fixtures';
import type { LoaderOptions } from '../lib/loader';
import App from './App.svelte';

/** A server with an answer per path, or the reason it refuses: the paths asked for are kept. */
function server(answers: Record<string, unknown>) {
  const asked: string[] = [];
  const fetchJson = async <T>(path: string): Promise<T> => {
    asked.push(path);
    const key = Object.keys(answers).find((start) => path.startsWith(start));
    const answer = key === undefined ? undefined : answers[key];
    if (answer === undefined) throw new Error(`HTTP 404: ${path}`);
    if (answer instanceof Error) throw answer;
    return answer as T;
  };
  return { asked, fetchJson };
}

const ANSWERS = () => ({
  '/api/summary': summary({ days: 30, project_filter: null, prices_checked: '2026-09-01' }),
  '/api/live': live({ sessions: [liveSession({ session_id: 'live-1', title: 'Live one' })] }),
  '/api/session/live-1/state': {
    session_id: 'live-1',
    current: null,
    secrets: { high: 0, medium: 0, 'low-medium': 0, low: 0 },
  },
});

let hash = '';
let hidden = false;

function mountApp(answers: Record<string, unknown> = ANSWERS(), options: LoaderOptions = {}) {
  const fake = server(answers);
  const app = new AppState();
  const view = render(App, {
    app,
    loaderOptions: { fetchJson: fake.fetchJson, hash: () => hash, hidden: () => hidden, ...options },
  });
  return { ...view, app, asked: fake.asked };
}

/** Lets the requests the page made, and their answers, be drawn. */
async function settle(): Promise<void> {
  await vi.advanceTimersByTimeAsync(0);
  flushSync();
}

beforeEach(() => {
  localStorage.clear();
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2026-09-30T12:00:00'));
  hash = '';
  hidden = false;
});

afterEach(() => {
  vi.useRealTimers();
  localStorage.clear();
  delete document.documentElement.dataset.theme;
});

describe('the page', () => {
  test('has a heading, a banner, a filter row, the overview sections and a footer, each in its place', () => {
    const { container } = mountApp();
    const ids = [...container.querySelectorAll('[id]')].map((node) => node.id);
    const wanted = ['scope', 'updated', 'theme', 'session-card', 'filters', 'summary', 'kpis', 'runtime', 'live-card'];
    wanted.push('trend-card', 'chart-card', 'costly-card', 'limits-card', 'usage-cards', 'sessions-card', 'footer');
    for (const id of wanted) expect(ids).toContain(id);
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Claude usage');
    expect(screen.getByRole('alert').textContent).toBe('');
    expect(container.querySelector('#summary')?.contains(container.querySelector('#sessions-card'))).toBe(true);
    expect(container.querySelector('#filters')?.getAttribute('aria-label')).toBe('Filters');
    expect(container.querySelector('#runtime')?.getAttribute('aria-label')).toBe('Time and lines changed');
  });

  test('says it is loading until the summary comes', async () => {
    const { container } = mountApp();
    flushSync();
    expect(container.querySelector('#kpis')?.textContent).toContain('Loading…');
    expect(container.querySelector('#summary')?.classList.contains('loading')).toBe(true);
    await settle();
    expect(container.querySelector('#kpis')?.textContent).not.toContain('Loading…');
    expect(container.querySelector('#summary')?.classList.contains('loading')).toBe(false);
  });

  test('says where the summary came from, when the live answer came, and what the prices are', async () => {
    const { container } = mountApp();
    await settle();
    expect(container.querySelector('#scope')?.textContent).toBe('· all projects');
    expect(container.querySelector('#updated')?.textContent).toBe(`updated ${new Date().toLocaleTimeString()}`);
    expect(container.querySelector('#footer')?.textContent).toContain(
      'Estimated cost at Claude API list prices (checked 2026-09-01).',
    );
  });

  test('names a project the summary is cut to', async () => {
    const answers = { ...ANSWERS(), '/api/summary': summary({ days: 30, project_filter: 'api' }) };
    const { container } = mountApp(answers);
    await settle();
    expect(container.querySelector('#scope')?.textContent).toBe('· project api');
  });

  test('draws the live sessions from the live answer', async () => {
    const { container } = mountApp();
    await settle();
    expect(container.querySelector('#live-card')?.textContent).toContain('Live one');
  });

  test('says when loading failed, in the banner and where the data would be', async () => {
    const { container } = mountApp({ '/api/summary': new Error('HTTP 500'), '/api/live': new Error('HTTP 500') });
    await settle();
    expect(screen.getByRole('alert').textContent).toBe('HTTP 500');
    expect(container.querySelector('#kpis')?.textContent).toContain('Could not load the summary.');
  });

  test('words the heading and the footer in the theme chosen', async () => {
    const { app, container } = mountApp();
    await settle();
    app.preferences.theme = 'hacker';
    flushSync();
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('claude-usage --watch');
    expect(container.querySelector('#footer')?.textContent).toContain('Works on my machine');
  });
});

describe('the theme', () => {
  test('is on the page as chosen, and off again for auto', () => {
    const { app } = mountApp();
    expect(document.documentElement.dataset.theme).toBeUndefined();
    app.preferences.theme = 'dark';
    flushSync();
    expect(document.documentElement.dataset.theme).toBe('dark');
    app.preferences.theme = null;
    flushSync();
    expect(document.documentElement.dataset.theme).toBeUndefined();
  });

  test('is the saved one from the start', () => {
    localStorage.setItem('claude-usage.theme', 'rgb');
    mountApp();
    expect(document.documentElement.dataset.theme).toBe('rgb');
  });

  test('is taken away with the page', () => {
    const { app, unmount } = mountApp();
    app.preferences.theme = 'dark';
    flushSync();
    unmount();
    expect(document.documentElement.dataset.theme).toBeUndefined();
  });
});

describe('the polling', () => {
  test('goes on with the page and stops with it', async () => {
    const { asked, unmount } = mountApp();
    await settle();
    await vi.advanceTimersByTimeAsync(5000);
    const liveAsks = () => asked.filter((path) => path.startsWith('/api/live')).length;
    expect(liveAsks()).toBe(2);
    unmount();
    await vi.advanceTimersByTimeAsync(120_000);
    expect(liveAsks()).toBe(2);
  });

  test('a hidden tab asks nothing more, a shown one asks at once', async () => {
    const { asked } = mountApp();
    await settle();
    hidden = true;
    document.dispatchEvent(new Event('visibilitychange'));
    const before = asked.length;
    await vi.advanceTimersByTimeAsync(120_000);
    expect(asked).toHaveLength(before);
    hidden = false;
    document.dispatchEvent(new Event('visibilitychange'));
    await settle();
    expect(asked.length).toBeGreaterThan(before);
  });

  test('a new range loads both again', async () => {
    const { app, asked } = mountApp();
    await settle();
    asked.length = 0;
    app.range.select(7);
    await settle();
    expect(asked.filter((path) => path.includes('days=7')).sort()).toEqual(['/api/live?days=7', '/api/summary?days=7']);
  });
});

describe('the session in the address', () => {
  test('opens where the address names one, and the rest of the page steps aside', async () => {
    hash = '#session/abc-1';
    const answers = { ...ANSWERS(), '/api/session/abc-1': sessionDetail({ session_id: 'abc-1', title: 'Opened' }) };
    const { container } = mountApp(answers);
    await settle();
    expect(container.querySelector('#drilldown-title')?.textContent).toContain('Opened');
    expect(container.querySelector<HTMLElement>('#summary')?.hidden).toBe(true);
    expect(container.querySelector<HTMLElement>('#filters')?.hidden).toBe(true);
  });

  test('follows the address: another link opens, none closes and brings the page back', async () => {
    const answers = {
      ...ANSWERS(),
      '/api/session/abc-1': sessionDetail({ session_id: 'abc-1', title: 'Opened' }),
    };
    const { container } = mountApp(answers);
    await settle();
    expect(container.querySelector('#drilldown')).toBeNull();
    hash = '#session/abc-1';
    window.dispatchEvent(new Event('hashchange'));
    await settle();
    expect(container.querySelector('#drilldown')).not.toBeNull();
    hash = '';
    window.dispatchEvent(new Event('hashchange'));
    await settle();
    expect(container.querySelector('#drilldown')).toBeNull();
    expect(container.querySelector<HTMLElement>('#summary')?.hidden).toBe(false);
  });

  test('a link that is no session says so', async () => {
    hash = '#session/no way';
    mountApp();
    await settle();
    expect(screen.getByRole('alert').textContent).toBe('Not a session link.');
  });
});
