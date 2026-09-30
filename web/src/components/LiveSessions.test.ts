import { render, screen, within } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { flushSync } from 'svelte';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import type { CompactEstimate, Gauge, LiveSession } from '../lib/api';
import { live, liveSession, liveSubagent } from '../lib/fixtures';
import { tablePages } from '../lib/paging.svelte';
import { payload } from '../lib/payload.svelte';
import { preferences } from '../lib/prefs.svelte';
import LiveSessions from './LiveSessions.svelte';

const NOW = Date.parse('2026-09-29T12:00:00Z');

beforeEach(() => {
  localStorage.clear();
  preferences.pageSize = 10;
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(NOW);
});

afterEach(() => {
  vi.useRealTimers();
  payload.reset();
  tablePages.forget('live');
  preferences.theme = null;
  preferences.pageSize = 25;
  localStorage.clear();
});

function many(count: number): LiveSession[] {
  return Array.from({ length: count }, (_unused, index) =>
    liveSession({ session_id: `s-${index}`, title: `Session ${index}` }),
  );
}

/** The titles of the cards shown, in order. */
function titles(container: HTMLElement): (string | null)[] {
  return [...container.querySelectorAll('.live-card .title a')].map((link) => link.textContent);
}

function gauge(): Gauge {
  const estimate = {
    breakeven_calls: 10,
    breakeven_low: 5,
    breakeven_high: 20,
    calls_ahead: 40,
    cold_saving: -0.5,
    breakeven_cold: 10,
    calls_after_high: 60,
    pays_later_in: null,
    pays_later_at: null,
  } as CompactEstimate;
  return {
    context: 150_000,
    hint_tokens: 200_000,
    compacted: null,
    compact_now: { cache_warm_until: '2026-09-29T12:30:00Z', estimate },
  } as Gauge;
}

describe('without an answer', () => {
  test('the card says it is loading, with the heading and no window', () => {
    const { container } = render(LiveSessions);
    expect(screen.getByRole('region', { name: 'Live sessions' })).toHaveClass('card');
    expect(container.querySelector('h2')).toHaveAttribute('id', 'live-title');
    expect(container.querySelector('h2 .muted')?.textContent).toBe('');
    expect(container.querySelector('.paged-wrap > .empty')).toHaveTextContent(/^Loading…$/);
    expect(container.querySelector('.live-grid, .pager')).toBeNull();
  });

  test('the card says loading failed', () => {
    const { container } = render(LiveSessions);
    payload.set({ liveFailed: true });
    flushSync();
    expect(container.querySelector('.paged-wrap > .empty')).toHaveTextContent(/^Could not load the live sessions\.$/);
  });

  test('an answer replaces both', () => {
    const { container } = render(LiveSessions);
    payload.set({ liveFailed: true });
    payload.set({ live: live() });
    flushSync();
    expect(container.querySelector('.empty')).toBeNull();
    expect(container.querySelectorAll('.live-card')).toHaveLength(1);
  });
});

describe('the card', () => {
  test('has a grid with a card for each session, the session’s text and link in it', () => {
    const { container } = render(LiveSessions);
    payload.set({ live: live() });
    flushSync();
    const grid = container.querySelector('.paged-wrap > .live-grid') as HTMLElement;
    expect(grid.children).toHaveLength(1);
    expect(within(grid).getByRole('link', { name: 'Checkout: split payment step' })).toHaveAttribute(
      'href',
      '#session/live-1',
    );
    expect(grid.querySelector('.muted')).toHaveTextContent('shop · main · 12 s ago');
  });

  test('counts "ago" from the time of the newest answer, even one unchanged', () => {
    const { container } = render(LiveSessions);
    payload.set({ live: live(), liveAt: NOW });
    flushSync();
    expect(container.querySelector('.live-card > .muted')).toHaveTextContent('12 s ago');
    payload.set({ liveAt: NOW + 48_000 });
    flushSync();
    expect(container.querySelector('.live-card > .muted')).toHaveTextContent('1 min ago');
  });

  test('lists the subagents and notes where none runs', () => {
    const { container } = render(LiveSessions);
    const agents = liveSession({ session_id: 'live-2', subagents: [liveSubagent()] });
    payload.set({ live: live({ sessions: [liveSession(), agents] }) });
    flushSync();
    const cards = container.querySelectorAll('.live-card');
    expect(cards[0]?.querySelector('.note')).toHaveTextContent('No subagent running');
    expect(cards[1]?.querySelectorAll('li')).toHaveLength(1);
  });

  test('shows the wait badge first in the head: a padlock or a speech bubble', () => {
    const permission = { kind: 'permission', tool: 'Bash', since: '2026-09-29T11:58:00Z', agent_type: null } as const;
    const since = '2026-09-29T11:58:00Z';
    const question = { kind: 'question', tool: 'AskUserQuestion', since, agent_type: null } as const;
    const { container } = render(LiveSessions);
    const sessions = [
      liveSession({ session_id: 'a', waiting: permission }),
      liveSession({ session_id: 'b', waiting: question }),
      liveSession({ session_id: 'c' }),
    ];
    payload.set({ live: live({ sessions }) });
    flushSync();
    const heads = [...container.querySelectorAll('.live-head')];
    expect(heads.map((head) => head.children[1]?.className)).toEqual([
      'live-icon live-icon-permission live-icon-waiting',
      'live-icon live-icon-waiting live-icon-waiting',
      'live-states',
    ]);
    expect(screen.getByRole('img', { name: /^Waiting for your permission to use Bash/ })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /^Waiting for your answer/ })).toBeInTheDocument();
  });
});

describe('the state icons', () => {
  test('come from the state kept by session: secret, then compacting now', () => {
    const { container } = render(LiveSessions);
    payload.set({ live: live() });
    payload.setLiveState('live-1', {
      session_id: 'live-1',
      current: gauge(),
      secrets: { high: 0, medium: 1, 'low-medium': 0, low: 0 },
    });
    flushSync();
    expect([...container.querySelectorAll('.live-states .live-icon')].map((icon) => icon.className)).toEqual([
      'live-icon live-icon-secret live-icon-medium',
      'live-icon live-icon-compact live-icon-soon',
    ]);
  });

  test('are none without a state', () => {
    const { container } = render(LiveSessions);
    payload.set({ live: live() });
    flushSync();
    expect(container.querySelector('.live-states')?.children).toHaveLength(0);
  });

  test('are worked out again where a new state replaces the old one', () => {
    const { container } = render(LiveSessions);
    payload.set({ live: live() });
    payload.setLiveState('live-1', {
      session_id: 'live-1',
      current: null,
      secrets: { high: 0, medium: 1, 'low-medium': 0, low: 0 },
    });
    flushSync();
    const icon = container.querySelector('.live-states .live-icon');
    expect(icon).toHaveClass('live-icon-medium');
    payload.setLiveState('live-1', {
      session_id: 'live-1',
      current: null,
      secrets: { high: 2, medium: 0, 'low-medium': 0, low: 0 },
    });
    flushSync();
    expect(container.querySelector('.live-states .live-icon')).toHaveClass('live-icon-high');
    payload.setLiveState('live-1', {
      session_id: 'live-1',
      current: null,
      secrets: { high: 0, medium: 0, 'low-medium': 0, low: 0 },
    });
    flushSync();
    expect(container.querySelector('.live-states')?.children).toHaveLength(0);
  });
});

describe('the heading’s window', () => {
  test('says how lately a session changed', () => {
    const { container } = render(LiveSessions);
    payload.set({ live: live() });
    flushSync();
    expect(container.querySelector('h2 .muted')?.textContent).toBe('· changed in the last 5 min');
    expect(screen.getByRole('heading')).toHaveTextContent('Live sessions · changed in the last 5 min');
  });

  test('says how long while agents work, and that a waiting session stays', () => {
    const { container } = render(LiveSessions);
    const waiting = { kind: 'question', tool: 'AskUserQuestion', since: null, agent_type: null } as const;
    payload.set({ live: live({ agent_minutes: 180, sessions: [liveSession({ waiting })] }) });
    flushSync();
    expect(container.querySelector('h2 .muted')).toHaveTextContent(
      '· changed in the last 5 min (180 min while agents work) or waiting for you',
    );
  });

  test('names the past day the list was kept by', () => {
    const { container } = render(LiveSessions);
    payload.set({ live: live({ since: '2026-09-27', until: '2026-09-27' }) });
    flushSync();
    expect(container.querySelector('h2 .muted')?.textContent).toMatch(/^· changed in the last 5 min, active on .+/);
  });
});

describe('the notes', () => {
  test('say that permission prompts cannot show', () => {
    const { container } = render(LiveSessions);
    payload.set({ live: live({ prompts_unavailable: 'no Unix sockets here' }) });
    flushSync();
    const notes = container.querySelectorAll('.paged-wrap > .note');
    expect(notes).toHaveLength(1);
    expect(notes[0]).toHaveTextContent("Permission prompts can't show here: no Unix sockets here.");
  });

  test('say that desktop notifications cannot show', () => {
    const { container } = render(LiveSessions);
    payload.set({ live: live({ notifications_unavailable: 'no notifier found' }) });
    flushSync();
    const notes = container.querySelectorAll('.paged-wrap > .note');
    expect(notes).toHaveLength(1);
    expect(notes[0]).toHaveTextContent("Desktop notifications can't show: no notifier found.");
  });

  test('come before the cards, prompts first', () => {
    const { container } = render(LiveSessions);
    payload.set({ live: live({ prompts_unavailable: 'a', notifications_unavailable: 'b' }) });
    flushSync();
    const wrap = container.querySelector('.paged-wrap') as HTMLElement;
    expect([...wrap.children].map((child) => child.className)).toEqual(['note', 'note', 'live-grid']);
    expect(wrap.children[0]).toHaveTextContent('Permission prompts');
  });

  test('are absent where nothing is wrong', () => {
    const { container } = render(LiveSessions);
    payload.set({ live: live() });
    flushSync();
    expect(container.querySelector('.paged-wrap > .note')).toBeNull();
  });
});

describe('without a live session', () => {
  test('the card says none was active in the window, today', () => {
    const { container } = render(LiveSessions);
    payload.set({ live: live({ sessions: [] }) });
    flushSync();
    expect(container.querySelector('.paged-wrap > .empty')).toHaveTextContent(
      /^No session active in the last 5 minutes\.$/,
    );
    expect(container.querySelector('.live-grid')).toBeNull();
  });

  test('the card says none was active on a past day', () => {
    const { container } = render(LiveSessions);
    payload.set({ live: live({ sessions: [], since: '2026-09-27', until: '2026-09-27' }) });
    flushSync();
    expect(container.querySelector('.paged-wrap > .empty')?.textContent).toMatch(
      /^No live session was active on .+\.$/,
    );
  });

  test('the notes still show', () => {
    const { container } = render(LiveSessions);
    payload.set({ live: live({ sessions: [], prompts_unavailable: 'x' }) });
    flushSync();
    expect(container.querySelectorAll('.paged-wrap > .note, .paged-wrap > .empty')).toHaveLength(2);
  });
});

describe('the themes', () => {
  test('word the heading', () => {
    render(LiveSessions);
    payload.set({ live: live() });
    preferences.theme = 'hacker';
    flushSync();
    expect(screen.getByRole('heading')).toHaveTextContent('ps aux | grep claude · changed in the last 5 min');
    expect(screen.getByRole('region', { name: /^ps aux \| grep claude/ })).toBeInTheDocument();
  });

  test('word the heading before an answer too', () => {
    preferences.theme = 'startup';
    render(LiveSessions);
    expect(screen.getByRole('heading', { name: 'Shipping now' })).toBeInTheDocument();
  });
});

describe('the pager', () => {
  test('is in the title row with the heading past ten sessions', () => {
    const { container } = render(LiveSessions);
    payload.set({ live: live({ sessions: many(11) }) });
    flushSync();
    const titleRow = container.querySelector('.title-row') as HTMLElement;
    expect(titleRow.firstElementChild).toBe(screen.getByRole('heading'));
    expect(titleRow).toContainElement(screen.getByRole('group', { name: 'Pages' }));
    expect(titleRow.parentElement).toBe(screen.getByRole('region'));
    expect(titleRow.nextElementSibling).toBe(container.querySelector('.paged-wrap'));
  });

  test('says which sessions show, and shows the first ten', () => {
    const { container } = render(LiveSessions);
    payload.set({ live: live({ sessions: many(11) }) });
    flushSync();
    expect(screen.getByRole('group', { name: 'Pages' })).toHaveTextContent('sessions 1–10 of 11');
    expect(screen.getByRole('combobox', { name: 'Sessions per page' })).toBeInTheDocument();
    expect(titles(container)).toEqual(many(10).map((session) => session.title));
  });

  test('is absent at ten sessions, and the heading stands alone', () => {
    const { container } = render(LiveSessions);
    payload.set({ live: live({ sessions: many(10) }) });
    flushSync();
    expect(screen.queryByRole('group', { name: 'Pages' })).toBeNull();
    expect(container.querySelector('.title-row')).toBeNull();
    expect(container.querySelectorAll('.live-card')).toHaveLength(10);
  });

  test('the next page shows the rest', async () => {
    const user = userEvent.setup();
    const { container } = render(LiveSessions);
    payload.set({ live: live({ sessions: many(11) }) });
    flushSync();
    await user.click(screen.getByRole('button', { name: 'Next ›' }));
    expect(titles(container)).toEqual(['Session 10']);
    expect(screen.getByRole('group', { name: 'Pages' })).toHaveTextContent('sessions 11–11 of 11');
  });

  test('keeps the page and the focus on Next through a refresh with the same sessions', async () => {
    const user = userEvent.setup();
    const { container } = render(LiveSessions);
    payload.set({ live: live({ sessions: many(25) }) });
    flushSync();
    await user.click(screen.getByRole('button', { name: 'Next ›' }));
    const next = screen.getByRole('button', { name: 'Next ›' });
    next.focus();
    const card = container.querySelector('.live-card');
    payload.set({ live: live({ sessions: many(25) }), liveAt: NOW + 5_000 });
    flushSync();
    expect(titles(container)[0]).toBe('Session 10');
    expect(screen.getByRole('button', { name: 'Next ›' })).toBe(next);
    expect(next).toHaveFocus();
    expect(container.querySelector('.live-card')).toBe(card);
  });

  test('goes once the list shrinks to ten', () => {
    const { container } = render(LiveSessions);
    payload.set({ live: live({ sessions: many(11) }) });
    flushSync();
    payload.set({ live: live({ sessions: many(10) }) });
    flushSync();
    expect(screen.queryByRole('group', { name: 'Pages' })).toBeNull();
    expect(container.querySelector('.title-row')).toBeNull();
  });

  test('shows the last page where the list shrank beyond the stored one', async () => {
    const user = userEvent.setup();
    const { container } = render(LiveSessions);
    payload.set({ live: live({ sessions: many(25) }) });
    flushSync();
    await user.click(screen.getByRole('button', { name: 'Next ›' }));
    await user.click(screen.getByRole('button', { name: 'Next ›' }));
    expect(titles(container)).toHaveLength(5);
    payload.set({ live: live({ sessions: many(12) }) });
    flushSync();
    expect(titles(container)).toEqual(['Session 10', 'Session 11']);
  });
});

describe('a redraw with a new answer', () => {
  test('keeps the cards’ nodes by session, in the new order, and the focus inside one', () => {
    const { container } = render(LiveSessions);
    const [first, second] = many(2) as [LiveSession, LiveSession];
    payload.set({ live: live({ sessions: [first, second] }) });
    flushSync();
    const before = [...container.querySelectorAll('.live-card')];
    const link = before[1]?.querySelector('a') as HTMLElement;
    link.focus();
    payload.set({ live: live({ sessions: [second, first] }) });
    flushSync();
    expect([...container.querySelectorAll('.live-card')]).toEqual([before[1], before[0]]);
    expect(link).toHaveFocus();
  });

  test('keeps the card itself', () => {
    const { container } = render(LiveSessions);
    payload.set({ live: live() });
    flushSync();
    const card = container.querySelector('section');
    payload.set({ live: live({ sessions: [] }) });
    flushSync();
    expect(container.querySelector('section')).toBe(card);
  });

  test('drops the node of a session that goes', () => {
    const { container } = render(LiveSessions);
    const [first, second] = many(2) as [LiveSession, LiveSession];
    payload.set({ live: live({ sessions: [first, second] }) });
    flushSync();
    const before = [...container.querySelectorAll('.live-card')];
    payload.set({ live: live({ sessions: [second] }) });
    flushSync();
    const after = [...container.querySelectorAll('.live-card')];
    expect(after).toEqual([before[1]]);
    expect(before[0]).not.toBeInTheDocument();
  });

  test('takes a new card in, the others staying', () => {
    const { container } = render(LiveSessions);
    const [first, second] = many(2) as [LiveSession, LiveSession];
    payload.set({ live: live({ sessions: [first] }) });
    flushSync();
    const card = container.querySelector('.live-card');
    payload.set({ live: live({ sessions: [second, first] }) });
    flushSync();
    expect(titles(container)).toEqual(['Session 1', 'Session 0']);
    expect(container.querySelectorAll('.live-card')[1]).toBe(card);
  });
});
