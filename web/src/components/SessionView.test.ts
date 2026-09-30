import { render, screen, within } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { flushSync } from 'svelte';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import type { SecretAccess, SessionDetail, Waiting } from '../lib/api';
import {
  agent,
  apiErrorEvent,
  gauge,
  live,
  liveSession,
  secretAccess,
  sessionDetail,
  sessionRuntime,
  usage,
} from '../lib/fixtures';
import { tablePages } from '../lib/paging.svelte';
import { payload, setPayload } from '../lib/payload.svelte';
import { preferences } from '../lib/prefs.svelte';
import SessionView from './SessionView.svelte';

const QUESTION: Waiting = {
  kind: 'question',
  tool: 'AskUserQuestion',
  since: '2026-09-29T11:58:00Z',
  agent_type: null,
};

/** A run's agent, which the agents table gathers under one row. */
function inRun(id: string) {
  return agent({
    agent_id: id,
    agent_type: 'workflow-subagent',
    workflow_run: 'wf_1',
    workflow_name: 'review',
    models: ['claude-sonnet-5-5'],
  });
}

/** A session with a model, the main thread and a helper, a skill and an MCP server, and an API error. */
function fullSession(changes: Partial<SessionDetail> = {}): SessionDetail {
  return sessionDetail({
    title: 'Checkout: split payment step',
    prompt: 'Split the payment step in two',
    git_branch: 'feature/split',
    models: [{ model: 'claude-opus-5-5', ...usage({ cost: 5 }) }],
    skills: [{ skill: 'review', ...usage({ cost: 1 }) }],
    mcp_servers: [{ mcp_server: 'index', ...usage({ cost: 2 }) }],
    api_errors: [apiErrorEvent()],
    agents: [agent(), agent({ agent_id: 'a-1', agent_type: 'Explore', description: 'Find the callers' })],
    ...changes,
  });
}

const TABLES = ['models', 'agents', 'skills', 'mcp-servers', 'api-errors'];
const KEYS = ['abc123', 'other'].flatMap((id) => TABLES.map((name) => `${id}-${name}`));

let scrollTo: ReturnType<typeof vi.fn>;

beforeEach(() => {
  localStorage.clear();
  preferences.pageSize = 25;
  scrollTo = vi.fn();
  window.scrollTo = scrollTo as unknown as typeof window.scrollTo;
  Element.prototype.scrollIntoView = vi.fn() as unknown as typeof Element.prototype.scrollIntoView;
  // the page's other sections and the link the view is opened from
  document.body.innerHTML = `
    <div id="filters"></div>
    <div id="summary"><a id="opener" href="#session/abc123">Checkout</a></div>`;
});

afterEach(() => {
  payload.reset();
  for (const key of KEYS) tablePages.forget(key);
  preferences.theme = null;
  preferences.pageSize = 25;
  localStorage.clear();
  location.hash = '';
  document.body.innerHTML = '';
});

/** Headings of the level given, in the order they come. */
const headings = (level: number) => screen.getAllByRole('heading', { level }).map((heading) => heading.textContent);

describe('without a session', () => {
  test('there is nothing in the page', () => {
    const { container } = render(SessionView);
    expect(container.children).toHaveLength(0);
    expect(screen.queryByRole('region')).toBeNull();
  });

  test('the other sections stay', () => {
    render(SessionView);
    expect(document.getElementById('filters')?.hidden).toBe(false);
    expect(document.getElementById('summary')?.hidden).toBe(false);
  });
});

describe('the heading', () => {
  test('is the section`s name: a level 2 heading with the title, taking no place in the tab order', () => {
    render(SessionView);
    setPayload({ session: fullSession() });
    const section = screen.getByRole('region', { name: 'Checkout: split payment step' });
    expect(section).toHaveAttribute('id', 'drilldown');
    expect(section).toHaveClass('card');
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toHaveAttribute('id', 'drilldown-title');
    expect(heading).toHaveAttribute('tabindex', '-1');
    expect(heading.parentElement).toHaveClass('chart-head');
  });

  test('calls a session without a title untitled', () => {
    render(SessionView);
    setPayload({ session: fullSession({ title: null }) });
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(/^Untitled session$/);
  });

  test('has the Close link, which goes to the page`s address, after a spacer', () => {
    render(SessionView);
    setPayload({ session: fullSession() });
    const close = screen.getByRole('link', { name: 'Close' });
    expect(close).toHaveAttribute('href', '#');
    expect(close).toHaveAttribute('aria-keyshortcuts', 'Escape');
    expect(close.previousElementSibling).toHaveClass('spacer');
  });

  test('is followed by the prompt where there is one, then the facts', () => {
    render(SessionView);
    setPayload({ session: fullSession() });
    const prompt = document.querySelector('.prompt');
    expect(prompt).toHaveTextContent(/^Split the payment step in two$/);
    expect(prompt?.previousElementSibling).toHaveClass('chart-head');
    const facts = prompt?.nextElementSibling;
    expect(facts).toHaveClass('muted');
    expect(facts?.textContent).toMatch(/^\/work\/demo · feature\/split · .+ · abc123$/);
  });

  test('has no prompt without one, the facts right after the heading', () => {
    render(SessionView);
    setPayload({ session: fullSession({ prompt: null }) });
    expect(document.querySelector('.prompt')).toBeNull();
    expect(document.querySelector('.chart-head')?.nextElementSibling).toHaveClass('muted');
  });
});

describe('opening and closing', () => {
  test('focuses the heading and steps the range`s filters and the summary aside', () => {
    render(SessionView);
    setPayload({ session: fullSession() });
    expect(screen.getByRole('heading', { level: 2 })).toHaveFocus();
    expect(document.getElementById('filters')?.hidden).toBe(true);
    expect(document.getElementById('summary')?.hidden).toBe(true);
  });

  test('shows the sections again when the session goes, and returns focus to the link that opened it', () => {
    render(SessionView);
    document.getElementById('opener')?.focus();
    setPayload({ session: fullSession() });
    expect(document.getElementById('opener')).not.toHaveFocus();
    setPayload({ session: null });
    expect(document.getElementById('filters')?.hidden).toBe(false);
    expect(document.getElementById('summary')?.hidden).toBe(false);
    expect(document.getElementById('opener')).toHaveFocus();
    expect(screen.queryByRole('region')).toBeNull();
  });

  test('scrolls back to where the page was', () => {
    Object.defineProperty(window, 'scrollY', { value: 250, configurable: true });
    render(SessionView);
    setPayload({ session: fullSession() });
    setPayload({ session: null });
    expect(scrollTo).toHaveBeenCalledWith(0, 250);
  });

  test('does not open again, or move focus, when the same session is refreshed', () => {
    render(SessionView);
    setPayload({ session: fullSession() });
    const section = screen.getByRole('region');
    const close = screen.getByRole('link', { name: 'Close' });
    close.focus();
    setPayload({ session: fullSession({ turns: 11 }) });
    expect(screen.getByRole('region')).toBe(section);
    expect(close).toHaveFocus();
    expect(document.getElementById('summary')?.hidden).toBe(true);
  });

  test('opens again for another session, without the page coming back in between', () => {
    render(SessionView);
    setPayload({ session: fullSession() });
    const section = screen.getByRole('region');
    setPayload({ session: fullSession({ session_id: 'other', title: 'Another one' }) });
    expect(screen.getByRole('region')).not.toBe(section);
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Another one');
    expect(screen.getByRole('heading', { level: 2 })).toHaveFocus();
    expect(document.getElementById('summary')?.hidden).toBe(true);
  });
});

describe('Escape', () => {
  test('clears the hash while a session is shown', async () => {
    const user = userEvent.setup();
    location.hash = '#session/abc123';
    render(SessionView);
    setPayload({ session: fullSession() });
    await user.keyboard('{Escape}');
    expect(location.hash).toBe('');
  });

  test('leaves the hash alone where something else took the key', async () => {
    const user = userEvent.setup();
    const take = (event: Event) => event.preventDefault();
    // in the capture phase, before the document's own listeners
    window.addEventListener('keydown', take, true);
    try {
      location.hash = '#session/abc123';
      render(SessionView);
      setPayload({ session: fullSession() });
      await user.keyboard('{Escape}');
      expect(location.hash).toBe('#session/abc123');
    } finally {
      window.removeEventListener('keydown', take, true);
    }
  });

  test('leaves the hash alone for another key', async () => {
    const user = userEvent.setup();
    location.hash = '#session/abc123';
    render(SessionView);
    setPayload({ session: fullSession() });
    await user.keyboard('a');
    expect(location.hash).toBe('#session/abc123');
  });

  test('does nothing where no session is shown', async () => {
    const user = userEvent.setup();
    location.hash = '#other';
    render(SessionView);
    await user.keyboard('{Escape}');
    expect(location.hash).toBe('#other');
  });

  test('does nothing once the session is closed', async () => {
    const user = userEvent.setup();
    render(SessionView);
    setPayload({ session: fullSession() });
    setPayload({ session: null });
    location.hash = '#other';
    await user.keyboard('{Escape}');
    expect(location.hash).toBe('#other');
  });
});

describe('the waits', () => {
  test('are a status notice under the facts, hidden while nothing waits', () => {
    render(SessionView);
    setPayload({ session: fullSession() });
    const notice = screen.getByRole('status', { hidden: true });
    expect(notice).toHaveClass('card', 'wait-notice');
    expect(notice).not.toBeVisible();
    expect(notice.previousElementSibling).toHaveClass('muted');
  });

  test('show the session`s own wait, and follow the live answer for the others', () => {
    render(SessionView);
    setPayload({ session: fullSession({ waiting: QUESTION }) });
    expect(screen.getByRole('status')).toHaveTextContent(/^This session is waiting for your answer since /);
    setPayload({ live: live({ sessions: [liveSession({ session_id: 'live-2', title: 'Blog', waiting: QUESTION })] }) });
    expect(screen.getByRole('link', { name: 'Blog' })).toHaveAttribute('href', '#session/live-2');
    setPayload({ live: live({ sessions: [liveSession({ session_id: 'live-2', title: 'Blog' })] }) });
    expect(screen.queryByRole('link', { name: 'Blog' })).toBeNull();
  });
});

describe('the tile rows', () => {
  test('are two: the cost, input, turns and output, then time and lines changed, in a labelled group', () => {
    render(SessionView);
    setPayload({ session: fullSession() });
    const rows = document.querySelectorAll('.kpis.session-kpis');
    expect(rows).toHaveLength(2);
    expect(rows[0]).not.toHaveAttribute('role');
    expect(within(rows[0] as HTMLElement).getByText(/Estimated cost/)).toBeInTheDocument();
    expect(within(rows[0] as HTMLElement).getByText(/this session/)).toBeInTheDocument();
    const group = screen.getByRole('group', { name: 'Time and lines changed' });
    expect(group).toBe(rows[1]);
    expect(group.previousElementSibling).toBe(rows[0]);
  });

  test('are one without a runtime: no group for the time', () => {
    render(SessionView);
    setPayload({ session: fullSession({ runtime: null }) });
    expect(document.querySelectorAll('.kpis.session-kpis')).toHaveLength(1);
    expect(screen.queryByRole('group', { name: 'Time and lines changed' })).toBeNull();
  });

  test('follow a refresh: the group comes when a runtime does', () => {
    render(SessionView);
    setPayload({ session: fullSession({ runtime: null }) });
    setPayload({ session: fullSession({ runtime: sessionRuntime({ source: 'transcripts' }) }) });
    expect(screen.getByRole('group', { name: 'Time and lines changed' })).toBeInTheDocument();
  });
});

describe('the secret accesses', () => {
  const accesses = (...severities: SecretAccess['severity'][]) =>
    severities.map((severity, index) => secretAccess({ severity, path: `place-${index}` }));

  test('come after the tile rows and before the gauge', () => {
    render(SessionView);
    setPayload({ session: fullSession({ live: true, current: gauge(), secret_accesses: accesses('medium') }) });
    const card = document.getElementById('secret-alert') as HTMLElement;
    expect(card.previousElementSibling).toBe(screen.getByRole('group', { name: 'Time and lines changed' }));
    expect(card.nextElementSibling).toBe(document.getElementById('current-gauge'));
  });

  test('leave nothing in the view for a session without any', () => {
    render(SessionView);
    setPayload({ session: fullSession({ live: true, current: gauge() }) });
    expect(document.getElementById('secret-alert')).toBeNull();
    const group = screen.getByRole('group', { name: 'Time and lines changed' });
    expect(group.nextElementSibling).toBe(document.getElementById('current-gauge'));
  });

  test('stay folded open or shut through a refresh, and start folded again in another session', async () => {
    const user = userEvent.setup();
    render(SessionView);
    setPayload({ session: fullSession({ secret_accesses: accesses('medium') }) });
    await user.click(screen.getByRole('button', { name: 'Show them' }));
    setPayload({ session: fullSession({ secret_accesses: accesses('medium', 'low') }) });
    expect(screen.getByRole('button', { name: 'Hide them' })).toHaveAttribute('aria-expanded', 'true');
    setPayload({ session: fullSession({ session_id: 'other', secret_accesses: accesses('medium') }) });
    expect(screen.getByRole('button', { name: 'Show them' })).toHaveAttribute('aria-expanded', 'false');
  });
});

describe('the gauge', () => {
  test('follows the tile rows and comes before the `#session-top` slot', () => {
    render(SessionView);
    setPayload({ session: fullSession({ live: true, current: gauge() }) });
    const gaugeCard = document.getElementById('current-gauge') as HTMLElement;
    const group = screen.getByRole('group', { name: 'Time and lines changed' });
    expect(gaugeCard.previousElementSibling).toBe(group);
    expect(gaugeCard.nextElementSibling).toBe(document.getElementById('session-top'));
  });

  test('leaves nothing between the tile rows and the slot for a session without a gauge', () => {
    render(SessionView);
    setPayload({ session: fullSession() });
    expect(document.getElementById('current-gauge')).toBeNull();
    const group = screen.getByRole('group', { name: 'Time and lines changed' });
    expect(group.nextElementSibling).toBe(document.getElementById('session-top'));
  });
});

describe('the slots for the old scripts', () => {
  const ids = () => [...document.querySelectorAll('.legacy-slot')].map((slot) => slot.id);

  test('are three empty divs, in order between the tile rows, the tables and the end', () => {
    render(SessionView);
    setPayload({ session: fullSession() });
    expect(ids()).toEqual(['session-top', 'session-mid', 'session-end']);
    for (const slot of document.querySelectorAll('.legacy-slot')) {
      expect(slot.tagName).toBe('DIV');
      expect(slot).toBeEmptyDOMElement();
    }
    const top = document.getElementById('session-top') as HTMLElement;
    expect(top.previousElementSibling).toBe(screen.getByRole('group', { name: 'Time and lines changed' }));
    expect(top.nextElementSibling).toBe(document.getElementById('session-models-title'));
    const mid = document.getElementById('session-mid') as HTMLElement;
    const agentsTable = screen.getByRole('table', { name: 'Main thread and subagents' });
    expect(mid.previousElementSibling).toBe(agentsTable.parentElement);
    expect(mid.nextElementSibling).toHaveClass('grid-2');
    expect(document.getElementById('session-end')?.nextElementSibling).toBeNull();
    expect(document.getElementById('session-end')?.previousElementSibling).toBe(
      screen.getByRole('table', { name: 'Rate limits and API errors' }).parentElement,
    );
  });

  test('stay the same nodes with what the old scripts put into them across a refresh of the same session', () => {
    render(SessionView);
    setPayload({ session: fullSession() });
    const slots = ids().map((id) => document.getElementById(id) as HTMLElement);
    const children = slots.map((slot) => slot.appendChild(document.createElement('section')));
    setPayload({ session: fullSession({ turns: 11, agents: [agent(), inRun('w-1')] }) });
    expect(ids().map((id) => document.getElementById(id))).toEqual(slots);
    expect(slots.map((slot) => [...slot.children])).toEqual(children.map((child) => [child]));
  });

  test('are new for another session', () => {
    render(SessionView);
    setPayload({ session: fullSession() });
    const slots = ids().map((id) => document.getElementById(id) as HTMLElement);
    slots[0]?.appendChild(document.createElement('section'));
    setPayload({ session: fullSession({ session_id: 'other' }) });
    const fresh = ids().map((id) => document.getElementById(id) as HTMLElement);
    for (const [index, slot] of fresh.entries()) {
      expect(slot).not.toBe(slots[index]);
      expect(slot).toBeEmptyDOMElement();
    }
  });
});

describe('the tables', () => {
  test('come in order under their headings: by model, the agents, by skill, by MCP server, the API errors', () => {
    render(SessionView);
    setPayload({ session: fullSession() });
    expect(headings(3)).toEqual([
      'By model',
      'Main thread and subagents',
      'By skill',
      'By MCP server',
      'Rate limits and API errors',
    ]);
    expect(screen.getAllByRole('table')).toHaveLength(5);
    for (const name of headings(3)) expect(screen.getByRole('table', { name })).toBeInTheDocument();
  });

  test('are no cards of their own: the session card holds them, the skills and servers side by side', () => {
    render(SessionView);
    setPayload({ session: fullSession() });
    expect(screen.getAllByRole('region')).toHaveLength(1);
    const grid = document.querySelector('.grid-2') as HTMLElement;
    expect([...grid.children].map((child) => child.tagName)).toEqual(['DIV', 'DIV']);
    expect(within(grid.children[0] as HTMLElement).getByRole('heading', { name: 'By skill' })).toBeInTheDocument();
    expect(within(grid.children[1] as HTMLElement).getByRole('heading', { name: 'By MCP server' })).toBeInTheDocument();
  });

  test('say their words for no rows', () => {
    render(SessionView);
    setPayload({ session: fullSession({ models: [], skills: [], mcp_servers: [], api_errors: [] }) });
    expect(screen.getByText('No usage in this range.')).toBeInTheDocument();
    expect(screen.getByText('No turns attributed to a skill.')).toBeInTheDocument();
    expect(screen.getByText('No turns attributed to an MCP server.')).toBeInTheDocument();
    expect(screen.getByText('No API errors in this session.')).toBeInTheDocument();
  });

  test('have the model with its swatch, the skill and the server by name', () => {
    render(SessionView);
    setPayload({ session: fullSession() });
    const models = screen.getByRole('table', { name: 'By model' });
    expect(within(models).getByText('claude-opus-5-5').querySelector('.swatch')).not.toBeNull();
    expect(within(screen.getByRole('table', { name: 'By skill' })).getByText('review')).toBeInTheDocument();
    expect(within(screen.getByRole('table', { name: 'By MCP server' })).getByText('index')).toBeInTheDocument();
  });

  test('have the main thread and the helper as agent rows', () => {
    render(SessionView);
    setPayload({ session: fullSession() });
    const table = screen.getByRole('table', { name: 'Main thread and subagents' });
    const names = within(table).getAllByRole('row').slice(1).map((row) => row.querySelector('strong')?.textContent);
    expect(names).toEqual(['main', 'Explore']);
  });

  test('have the API errors without the session column', () => {
    render(SessionView);
    setPayload({ session: fullSession() });
    const table = screen.getByRole('table', { name: 'Rate limits and API errors' });
    const heads = within(table).getAllByRole('columnheader').map((head) => head.textContent);
    expect(heads).toEqual(['When', 'Error', 'Quota', 'Resets', 'Agent']);
  });

  test('use the theme`s words for the headings they have', () => {
    preferences.theme = 'hacker';
    render(SessionView);
    setPayload({ session: fullSession() });
    expect(headings(3)[0]).not.toBe('By model');
    expect(headings(3)[1]).toBe('Main thread and subagents');
  });

  test('page under the session`s keys, so another session starts at the first page', async () => {
    const user = userEvent.setup();
    const errors = Array.from({ length: 30 }, (_unused, index) => apiErrorEvent({ record_id: `err-${index}` }));
    render(SessionView);
    setPayload({ session: fullSession({ api_errors: errors }) });
    const sizes = screen.getAllByRole('combobox', { name: 'Rows per page' }).map((select) => select.id);
    expect(sizes).toEqual(['pager-abc123-api-errors-size']);
    await user.click(screen.getByRole('button', { name: 'Next ›' }));
    expect(tablePages.first('abc123-api-errors')).toBe(25);
    setPayload({ session: fullSession({ session_id: 'other', api_errors: errors }) });
    expect(screen.getByRole('combobox', { name: 'Rows per page' }).id).toBe('pager-other-api-errors-size');
    const table = screen.getByRole('table', { name: 'Rate limits and API errors' });
    expect(within(table).getAllByRole('row')).toHaveLength(1 + 25);
  });

  test('keep the models` page under the session`s key too', () => {
    const models = Array.from({ length: 12 }, (_unused, index) => ({
      model: `m${index}`,
      ...usage({ cost: 50 - index }),
    }));
    render(SessionView);
    setPayload({ session: fullSession({ models }) });
    expect(screen.getByRole('combobox', { name: 'Rows per page' }).id).toBe('pager-abc123-models-size');
  });
});

describe('a workflow run', () => {
  const withRun = (changes: Partial<SessionDetail> = {}) =>
    fullSession({ agents: [agent(), inRun('w-1'), inRun('w-2')], ...changes });
  const fold = () => screen.getByRole('button', { name: '2 agents' });
  const agentRowCount = () =>
    within(screen.getByRole('table', { name: 'Main thread and subagents' })).getAllByRole('row').length - 1;

  test('opens its agents with its button, closed at first', async () => {
    const user = userEvent.setup();
    render(SessionView);
    setPayload({ session: withRun() });
    expect(fold()).toHaveAttribute('aria-expanded', 'false');
    expect(agentRowCount()).toBe(2);
    await user.click(fold());
    expect(fold()).toHaveAttribute('aria-expanded', 'true');
    expect(agentRowCount()).toBe(4);
  });

  test('stays open across a refresh of the same session', async () => {
    const user = userEvent.setup();
    render(SessionView);
    setPayload({ session: withRun() });
    await user.click(fold());
    const button = fold();
    setPayload({ session: withRun({ turns: 11 }) });
    flushSync();
    expect(fold()).toBe(button);
    expect(fold()).toHaveAttribute('aria-expanded', 'true');
    expect(agentRowCount()).toBe(4);
  });

  test('starts closed again for another session', async () => {
    const user = userEvent.setup();
    render(SessionView);
    setPayload({ session: withRun() });
    await user.click(fold());
    setPayload({ session: withRun({ session_id: 'other' }) });
    expect(fold()).toHaveAttribute('aria-expanded', 'false');
    expect(agentRowCount()).toBe(2);
  });
});
