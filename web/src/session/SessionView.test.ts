// @vitest-environment jsdom
import { render, screen, within } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { flushSync } from 'svelte';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { pagePerTest } from '../app/app.testing';
import type { SecretAccess, SessionDetail, Waiting } from '../api/api';
import {
  agent,
  apiErrorEvent,
  backgroundCalls,
  contextTurn,
  gauge,
  live,
  liveSession,
  secretAccess,
  sessionDetail,
  sessionRuntime,
  toolKindRow,
  usage,
} from '../api/fixtures';
import SessionView from './SessionView.svelte';

const page = pagePerTest();

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

/** A session with a model, the main thread, a helper and the background calls, a skill and an MCP server, and an
 *  API error. */
function fullSession(changes: Partial<SessionDetail> = {}): SessionDetail {
  return sessionDetail({
    title: 'Checkout: split payment step',
    prompt: 'Split the payment step in two',
    git_branch: 'feature/split',
    models: [{ model: 'claude-opus-5-5', ...usage({ cost: 5 }) }],
    skills: [{ skill: 'review', ...usage({ cost: 1 }) }],
    mcp_servers: [{ mcp_server: 'index', ...usage({ cost: 2 }) }],
    api_errors: [apiErrorEvent()],
    agents: [
      agent(),
      agent({ agent_id: 'a-1', agent_type: 'Explore', description: 'Find the callers' }),
      backgroundCalls(),
    ],
    ...changes,
  });
}

/** The transcript picker's name. */
const PICKER = 'Transcript the context section shows';

/** The main thread and a helper, each with a turn, so that there is something to pick between. */
function withTurns() {
  return [
    agent({ context_per_turn: [contextTurn({ message_id: 'm-1' })] }),
    agent({
      agent_id: 'a-1',
      agent_type: 'Explore',
      description: 'Find the callers',
      context_per_turn: [contextTurn({ message_id: 'm-2' })],
    }),
  ];
}

/** The section's heading row, the first thing of the context per turn. */
const contextHead = () =>
  screen.getByRole('heading', { level: 3, name: 'Context per turn' }).parentElement as HTMLElement;

const TABLES = ['models', 'agents', 'skills', 'mcp-servers', 'api-errors', 'tools'];
const KEYS = ['abc123', 'other'].flatMap((id) => TABLES.map((name) => `${id}-${name}`));

let scrollTo: ReturnType<typeof vi.fn>;

/** jsdom has no ResizeObserver, which the context chart's container is measured with. */
class IdleResizeObserver {
  observe(): void {}

  unobserve(): void {}

  disconnect(): void {}
}

beforeEach(() => {
  vi.stubGlobal('ResizeObserver', IdleResizeObserver);
  localStorage.clear();
  page.app.preferences.pageSize = 25;
  scrollTo = vi.fn();
  window.scrollTo = scrollTo as unknown as typeof window.scrollTo;
  Element.prototype.scrollIntoView = vi.fn() as unknown as typeof Element.prototype.scrollIntoView;
  // the page's other sections and the link the view is opened from
  document.body.innerHTML = `
    <div id="filters"></div>
    <div id="summary"><a id="opener" href="#session/abc123">Checkout</a></div>`;
});

afterEach(() => {
  vi.unstubAllGlobals();
  for (const key of KEYS) page.app.pages.forget(key);
  localStorage.clear();
  location.hash = '';
  document.body.innerHTML = '';
});

/** Headings of the level given, in the order they come. */
const headings = (level: number) => screen.getAllByRole('heading', { level }).map((heading) => heading.textContent);

describe('without a session', () => {
  test('there is nothing in the page', () => {
    const { container } = page.render(SessionView);
    expect(container.children).toHaveLength(0);
    expect(screen.queryByRole('region')).toBeNull();
  });

  test('the other sections stay', () => {
    page.render(SessionView);
    expect(document.getElementById('filters')?.hidden).toBe(false);
    expect(document.getElementById('summary')?.hidden).toBe(false);
  });
});

describe('the heading', () => {
  test('is the section`s name: a level 2 heading with the title, taking no place in the tab order', () => {
    page.render(SessionView);
    page.set({ session: fullSession() });
    const section = screen.getByRole('region', { name: 'Checkout: split payment step' });
    expect(section).toHaveAttribute('id', 'drilldown');
    expect(section).toHaveClass('card');
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toHaveAttribute('id', 'drilldown-title');
    expect(heading).toHaveAttribute('tabindex', '-1');
    expect(heading.parentElement).toHaveClass('chart-head');
  });

  test('calls a session without a title untitled', () => {
    page.render(SessionView);
    page.set({ session: fullSession({ title: null }) });
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(/^Untitled session$/);
  });

  test('has the Close link, which goes to the page`s address, after a spacer', () => {
    page.render(SessionView);
    page.set({ session: fullSession() });
    const close = screen.getByRole('link', { name: 'Close' });
    expect(close).toHaveAttribute('href', '#');
    expect(close).toHaveAttribute('aria-keyshortcuts', 'Escape');
    expect(close.previousElementSibling).toHaveClass('spacer');
  });

  test('is followed by the prompt where there is one, then the facts', () => {
    page.render(SessionView);
    page.set({ session: fullSession() });
    const prompt = document.querySelector('.prompt');
    expect(prompt).toHaveTextContent(/^Split the payment step in two$/);
    expect(prompt?.previousElementSibling).toHaveClass('chart-head');
    const facts = prompt?.nextElementSibling;
    expect(facts).toHaveClass('muted');
    expect(facts?.textContent).toMatch(/^\/work\/demo · feature\/split · .+ · abc123$/);
  });

  test('has no prompt without one, the facts right after the heading', () => {
    page.render(SessionView);
    page.set({ session: fullSession({ prompt: null }) });
    expect(document.querySelector('.prompt')).toBeNull();
    expect(document.querySelector('.chart-head')?.nextElementSibling).toHaveClass('muted');
  });
});

describe('opening and closing', () => {
  test('focuses the heading and steps the range`s filters and the summary aside', () => {
    page.render(SessionView);
    page.set({ session: fullSession() });
    expect(screen.getByRole('heading', { level: 2 })).toHaveFocus();
    expect(document.getElementById('filters')?.hidden).toBe(true);
    expect(document.getElementById('summary')?.hidden).toBe(true);
  });

  test('shows the sections again when the session goes, and returns focus to the link that opened it', () => {
    page.render(SessionView);
    document.getElementById('opener')?.focus();
    page.set({ session: fullSession() });
    expect(document.getElementById('opener')).not.toHaveFocus();
    page.set({ session: null });
    expect(document.getElementById('filters')?.hidden).toBe(false);
    expect(document.getElementById('summary')?.hidden).toBe(false);
    expect(document.getElementById('opener')).toHaveFocus();
    expect(screen.queryByRole('region')).toBeNull();
  });

  test('scrolls back to where the page was', () => {
    Object.defineProperty(window, 'scrollY', { value: 250, configurable: true });
    page.render(SessionView);
    page.set({ session: fullSession() });
    page.set({ session: null });
    expect(scrollTo).toHaveBeenCalledWith(0, 250);
  });

  test('does not open again, or move focus, when the same session is refreshed', () => {
    page.render(SessionView);
    page.set({ session: fullSession() });
    const section = screen.getByRole('region', { name: 'Checkout: split payment step' });
    const close = screen.getByRole('link', { name: 'Close' });
    close.focus();
    page.set({ session: fullSession({ turns: 11 }) });
    expect(screen.getByRole('region', { name: 'Checkout: split payment step' })).toBe(section);
    expect(close).toHaveFocus();
    expect(document.getElementById('summary')?.hidden).toBe(true);
  });

  test('opens again for another session, without the page coming back in between', () => {
    page.render(SessionView);
    page.set({ session: fullSession() });
    const section = screen.getByRole('region', { name: 'Checkout: split payment step' });
    page.set({ session: fullSession({ session_id: 'other', title: 'Another one' }) });
    expect(screen.getByRole('region', { name: 'Another one' })).not.toBe(section);
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Another one');
    expect(screen.getByRole('heading', { level: 2 })).toHaveFocus();
    expect(document.getElementById('summary')?.hidden).toBe(true);
  });
});

describe('Escape', () => {
  test('clears the hash while a session is shown', async () => {
    const user = userEvent.setup();
    location.hash = '#session/abc123';
    page.render(SessionView);
    page.set({ session: fullSession() });
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
      page.render(SessionView);
      page.set({ session: fullSession() });
      await user.keyboard('{Escape}');
      expect(location.hash).toBe('#session/abc123');
    } finally {
      window.removeEventListener('keydown', take, true);
    }
  });

  test('leaves the hash alone for another key', async () => {
    const user = userEvent.setup();
    location.hash = '#session/abc123';
    page.render(SessionView);
    page.set({ session: fullSession() });
    await user.keyboard('a');
    expect(location.hash).toBe('#session/abc123');
  });

  test('does nothing where no session is shown', async () => {
    const user = userEvent.setup();
    location.hash = '#other';
    page.render(SessionView);
    await user.keyboard('{Escape}');
    expect(location.hash).toBe('#other');
  });

  test('does nothing once the session is closed', async () => {
    const user = userEvent.setup();
    page.render(SessionView);
    page.set({ session: fullSession() });
    page.set({ session: null });
    location.hash = '#other';
    await user.keyboard('{Escape}');
    expect(location.hash).toBe('#other');
  });
});

describe('the waits', () => {
  test('are a status notice under the facts, hidden while nothing waits', () => {
    page.render(SessionView);
    page.set({ session: fullSession() });
    const notice = screen.getByRole('status', { hidden: true });
    expect(notice).toHaveClass('card', 'wait-notice');
    expect(notice).not.toBeVisible();
    expect(notice.previousElementSibling).toHaveClass('muted');
  });

  test('show the session`s own wait, and follow the live answer for the others', () => {
    page.render(SessionView);
    page.set({ session: fullSession({ waiting: QUESTION }) });
    expect(screen.getByRole('status')).toHaveTextContent(/^This session is waiting for your answer since /);
    page.set({ live: live({ sessions: [liveSession({ session_id: 'live-2', title: 'Blog', waiting: QUESTION })] }) });
    expect(screen.getByRole('link', { name: 'Blog' })).toHaveAttribute('href', '#session/live-2');
    page.set({ live: live({ sessions: [liveSession({ session_id: 'live-2', title: 'Blog' })] }) });
    expect(screen.queryByRole('link', { name: 'Blog' })).toBeNull();
  });
});

describe('the tile rows', () => {
  test('are two: the cost, input, turns and output, then time and lines changed, in a labelled group', () => {
    page.render(SessionView);
    page.set({ session: fullSession() });
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
    page.render(SessionView);
    page.set({ session: fullSession({ runtime: null }) });
    expect(document.querySelectorAll('.kpis.session-kpis')).toHaveLength(1);
    expect(screen.queryByRole('group', { name: 'Time and lines changed' })).toBeNull();
  });

  test('follow a refresh: the group comes when a runtime does', () => {
    page.render(SessionView);
    page.set({ session: fullSession({ runtime: null }) });
    page.set({ session: fullSession({ runtime: sessionRuntime({ source: 'transcripts' }) }) });
    expect(screen.getByRole('group', { name: 'Time and lines changed' })).toBeInTheDocument();
  });
});

describe('the secret accesses', () => {
  const accesses = (...severities: SecretAccess['severity'][]) =>
    severities.map((severity, index) => secretAccess({ severity, path: `place-${index}` }));

  test('come after the tile rows and before the gauge', () => {
    page.render(SessionView);
    page.set({ session: fullSession({ live: true, current: gauge(), secret_accesses: accesses('medium') }) });
    const card = document.getElementById('secret-alert') as HTMLElement;
    expect(card.previousElementSibling).toBe(screen.getByRole('group', { name: 'Time and lines changed' }));
    expect(card.nextElementSibling).toBe(document.getElementById('current-gauge'));
  });

  test('leave nothing in the view for a session without any', () => {
    page.render(SessionView);
    page.set({ session: fullSession({ live: true, current: gauge() }) });
    expect(document.getElementById('secret-alert')).toBeNull();
    const group = screen.getByRole('group', { name: 'Time and lines changed' });
    expect(group.nextElementSibling).toBe(document.getElementById('current-gauge'));
  });

  test('stay folded open or shut through a refresh, and start folded again in another session', async () => {
    const user = userEvent.setup();
    page.render(SessionView);
    page.set({ session: fullSession({ secret_accesses: accesses('medium') }) });
    await user.click(screen.getByRole('button', { name: 'Show them' }));
    page.set({ session: fullSession({ secret_accesses: accesses('medium', 'low') }) });
    expect(screen.getByRole('button', { name: 'Hide them' })).toHaveAttribute('aria-expanded', 'true');
    page.set({ session: fullSession({ session_id: 'other', secret_accesses: accesses('medium') }) });
    expect(screen.getByRole('button', { name: 'Show them' })).toHaveAttribute('aria-expanded', 'false');
  });
});

describe('the gauge', () => {
  test('follows the tile rows and comes before the context per turn', () => {
    page.render(SessionView);
    page.set({ session: fullSession({ live: true, current: gauge() }) });
    const gaugeCard = document.getElementById('current-gauge') as HTMLElement;
    const group = screen.getByRole('group', { name: 'Time and lines changed' });
    expect(gaugeCard.previousElementSibling).toBe(group);
    expect(gaugeCard.nextElementSibling).toBe(contextHead());
  });

  test('leaves nothing between the tile rows and the context per turn for a session without a gauge', () => {
    page.render(SessionView);
    page.set({ session: fullSession() });
    expect(document.getElementById('current-gauge')).toBeNull();
    const group = screen.getByRole('group', { name: 'Time and lines changed' });
    expect(group.nextElementSibling).toBe(contextHead());
  });
});

describe('the context per turn', () => {
  test('is a section of its own between the gauge and the By model table, its details closing it', () => {
    page.render(SessionView);
    page.set({ session: fullSession() });
    const head = contextHead();
    expect(head.nextElementSibling).toHaveClass('legend');
    expect(head.nextElementSibling?.nextElementSibling).toBe(document.getElementById('context-chart'));
    const details = document.getElementById('context-details') as HTMLElement;
    expect(details.nextElementSibling).toBe(document.getElementById('session-models-title'));
  });

  test('is not there without a session', () => {
    page.render(SessionView);
    expect(document.getElementById('context-chart')).toBeNull();
  });

  test('starts at the main thread again in another session', async () => {
    const user = userEvent.setup();
    page.render(SessionView);
    page.set({ session: fullSession({ agents: withTurns() }) });
    await user.selectOptions(screen.getByRole('combobox', { name: PICKER }), 'a-1');
    expect(screen.getByRole('combobox', { name: PICKER })).toHaveValue('a-1');
    page.set({ session: fullSession({ session_id: 'other', agents: withTurns() }) });
    expect(screen.getByRole('combobox', { name: PICKER })).toHaveValue('main');
    expect(document.getElementById('context-note')).toHaveTextContent(/^main thread: /);
  });

  test('keeps the transcript picked and the table view through a refresh of the same session', async () => {
    const user = userEvent.setup();
    page.render(SessionView);
    page.set({ session: fullSession({ agents: withTurns() }) });
    await user.selectOptions(screen.getByRole('combobox', { name: PICKER }), 'a-1');
    await user.click(screen.getByRole('button', { name: 'Table view' }));
    const nodes = [
      screen.getByRole('combobox', { name: PICKER }),
      document.getElementById('context-chart'),
      document.getElementById('context-table'),
    ];
    page.set({ session: fullSession({ turns: 11, agents: withTurns() }) });
    expect([
      screen.getByRole('combobox', { name: PICKER }),
      document.getElementById('context-chart'),
      document.getElementById('context-table'),
    ]).toEqual(nodes);
    expect(screen.getByRole('combobox', { name: PICKER })).toHaveValue('a-1');
    expect(document.getElementById('context-table-toggle')).toHaveAttribute('aria-pressed', 'true');
  });
});

/** The main thread with a Bash call, so that the Tools table has a row. */
const toolAgents = () => [agent({ tool_kinds: [toolKindRow({ tool: 'Bash', calls: 3 })] })];

/** The wrap of the Tools table, whether it holds the table or the words for none; a note comes before it. */
function toolsWrap(): Element | null {
  let node = document.getElementById('session-tools-title')?.nextElementSibling ?? null;
  while (node && !node.classList.contains('table-wrap')) node = node.nextElementSibling;
  return node;
}

describe('the conversation', () => {
  const sections = () => [...document.querySelectorAll('#chat-section')];

  test('is one section, after the agents and before the skills and servers, with a transcript', () => {
    page.render(SessionView);
    page.set({ session: fullSession({ transcript: true, agents: toolAgents() }) });
    expect(sections()).toHaveLength(1);
    const section = sections()[0] as HTMLElement;
    const agentsTable = screen.getByRole('table', { name: 'Main thread and subagents' });
    expect(section.previousElementSibling).toBe(agentsTable.parentElement);
    expect(section.nextElementSibling).toBe(document.getElementById('chat-end'));
    expect(document.getElementById('chat-end')?.nextElementSibling).toHaveClass('grid-2');
  });

  test('is last, after the API errors, without a transcript', () => {
    page.render(SessionView);
    page.set({ session: fullSession({ agents: toolAgents() }) });
    expect(sections()).toHaveLength(1);
    const section = sections()[0] as HTMLElement;
    const errors = screen.getByRole('table', { name: 'Rate limits and API errors' });
    expect(section.previousElementSibling).toBe(errors.parentElement);
    expect(section.nextElementSibling).toBe(document.getElementById('chat-end'));
    expect(document.getElementById('chat-end')?.nextElementSibling).toBeNull();
  });

  test('is the same node across a refresh of the same session, with what the reader opened', async () => {
    page.render(SessionView);
    page.set({ session: fullSession() });
    const section = sections()[0] as HTMLElement;
    await userEvent.selectOptions(screen.getByRole('combobox', { name: 'Conversation of' }), 'a-1');
    page.set({ session: fullSession({ turns: 11, agents: [agent(), inRun('w-1')] }) });
    expect(sections()[0]).toBe(section);
  });

  test('is new for another session, with its picker at the main thread', async () => {
    page.render(SessionView);
    page.set({ session: fullSession() });
    const section = sections()[0] as HTMLElement;
    await userEvent.selectOptions(screen.getByRole('combobox', { name: 'Conversation of' }), 'a-1');
    page.set({ session: fullSession({ session_id: 'other' }) });
    expect(sections()[0]).not.toBe(section);
    expect(screen.getByRole('combobox', { name: 'Conversation of' })).toHaveValue('');
  });
});

describe('the tables', () => {
  test('come in order under their headings: by model, agents, tools, by skill, by MCP server, API errors', () => {
    page.render(SessionView);
    page.set({ session: fullSession({ agents: toolAgents() }) });
    // the first is the context per turn's, which has no table without a transcript with turns
    expect(headings(3).slice(1)).toEqual([
      'By model',
      'Main thread and subagents',
      'Tools',
      'By skill',
      'By MCP server',
      'Rate limits and API errors',
      'Conversation',
    ]);
    expect(screen.getAllByRole('table')).toHaveLength(6);
    for (const name of headings(3).slice(1, -1)) expect(screen.getByRole('table', { name })).toBeInTheDocument();
  });

  test('come in order with a transcript too, the tools after the API errors', () => {
    page.render(SessionView);
    page.set({ session: fullSession({ transcript: true, agents: toolAgents() }) });
    expect(headings(3).slice(1)).toEqual([
      'By model',
      'Main thread and subagents',
      'Conversation',
      'By skill',
      'By MCP server',
      'Rate limits and API errors',
      'Tools',
    ]);
  });

  test('have the tools between the agents and the conversation without a transcript', () => {
    page.render(SessionView);
    page.set({ session: fullSession({ agents: toolAgents() }) });
    const tools = screen.getByRole('table', { name: 'Tools' });
    const agents = screen.getByRole('table', { name: 'Main thread and subagents' });
    expect(agents.parentElement?.nextElementSibling).toBe(document.getElementById('session-tools-title'));
    expect(tools.parentElement).toBe(toolsWrap());
    expect(tools.parentElement?.nextElementSibling).toHaveClass('grid-2');
  });

  test('have the tools after the API errors table, last in the card, with a transcript', () => {
    page.render(SessionView);
    page.set({ session: fullSession({ transcript: true, agents: toolAgents() }) });
    const errors = screen.getByRole('table', { name: 'Rate limits and API errors' });
    const tools = screen.getByRole('table', { name: 'Tools' });
    expect(errors.parentElement?.nextElementSibling).toBe(document.getElementById('session-tools-title'));
    expect(tools.parentElement?.nextElementSibling).toBeNull();
  });

  test('say there are no tool calls where the transcripts hold none', () => {
    page.render(SessionView);
    page.set({ session: fullSession() });
    expect(screen.getByText('No tool calls.')).toBeInTheDocument();
  });

  test('are no cards of their own: the session card holds them, the skills and servers side by side', () => {
    page.render(SessionView);
    page.set({ session: fullSession() });
    // the conversation is a section of its own inside it, named by its heading
    expect(screen.getAllByRole('region').map((region) => region.id)).toEqual(['drilldown', 'chat-section']);
    const grid = document.querySelector('.grid-2') as HTMLElement;
    expect([...grid.children].map((child) => child.tagName)).toEqual(['DIV', 'DIV']);
    expect(within(grid.children[0] as HTMLElement).getByRole('heading', { name: 'By skill' })).toBeInTheDocument();
    expect(within(grid.children[1] as HTMLElement).getByRole('heading', { name: 'By MCP server' })).toBeInTheDocument();
  });

  test('say their words for no rows', () => {
    page.render(SessionView);
    page.set({ session: fullSession({ models: [], skills: [], mcp_servers: [], api_errors: [] }) });
    expect(screen.getByText('No usage in this range.')).toBeInTheDocument();
    expect(screen.getByText('No turns attributed to a skill.')).toBeInTheDocument();
    expect(screen.getByText('No turns attributed to an MCP server.')).toBeInTheDocument();
    expect(screen.getByText('No API errors in this session.')).toBeInTheDocument();
  });

  test('have the model with its swatch, the skill and the server by name', () => {
    page.render(SessionView);
    page.set({ session: fullSession() });
    const models = screen.getByRole('table', { name: 'By model' });
    expect(within(models).getByText('claude-opus-5-5').querySelector('.swatch')).not.toBeNull();
    expect(within(screen.getByRole('table', { name: 'By skill' })).getByText('review')).toBeInTheDocument();
    expect(within(screen.getByRole('table', { name: 'By MCP server' })).getByText('index')).toBeInTheDocument();
  });

  test('have the main thread, the helper and the background calls as agent rows', () => {
    page.render(SessionView);
    page.set({ session: fullSession() });
    const table = screen.getByRole('table', { name: 'Main thread and subagents' });
    const names = within(table).getAllByRole('row').slice(1).map((row) => row.querySelector('strong')?.textContent);
    expect(names).toEqual(['main', 'Explore', '(background)']);
  });

  test('have the API errors without the session column', () => {
    page.render(SessionView);
    page.set({ session: fullSession() });
    const table = screen.getByRole('table', { name: 'Rate limits and API errors' });
    const heads = within(table).getAllByRole('columnheader').map((head) => head.textContent);
    expect(heads).toEqual(['When', 'Error', 'Quota', 'Resets', 'Agent']);
  });

  test('use the theme`s words for the headings they have', () => {
    page.app.preferences.theme = 'hacker';
    page.render(SessionView);
    page.set({ session: fullSession() });
    expect(headings(3)[0]).toBe('Context per turn');
    expect(headings(3)[1]).not.toBe('By model');
    expect(headings(3)[2]).toBe('Main thread and subagents');
  });

  test('page under the session`s keys, so another session starts at the first page', async () => {
    const user = userEvent.setup();
    const errors = Array.from({ length: 30 }, (_unused, index) => apiErrorEvent({ record_id: `err-${index}` }));
    page.render(SessionView);
    page.set({ session: fullSession({ api_errors: errors }) });
    const sizes = screen.getAllByRole('combobox', { name: 'Rows per page' }).map((select) => select.id);
    expect(sizes).toEqual(['pager-abc123-api-errors-size']);
    await user.click(screen.getByRole('button', { name: 'Next ›' }));
    expect(page.app.pages.first('abc123-api-errors')).toBe(25);
    page.set({ session: fullSession({ session_id: 'other', api_errors: errors }) });
    expect(screen.getByRole('combobox', { name: 'Rows per page' }).id).toBe('pager-other-api-errors-size');
    const table = screen.getByRole('table', { name: 'Rate limits and API errors' });
    expect(within(table).getAllByRole('row')).toHaveLength(1 + 25);
  });

  test('keep the models` page under the session`s key too', () => {
    const models = Array.from({ length: 12 }, (_unused, index) => ({
      model: `m${index}`,
      ...usage({ cost: 50 - index }),
    }));
    page.render(SessionView);
    page.set({ session: fullSession({ models }) });
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
    page.render(SessionView);
    page.set({ session: withRun() });
    expect(fold()).toHaveAttribute('aria-expanded', 'false');
    expect(agentRowCount()).toBe(2);
    await user.click(fold());
    expect(fold()).toHaveAttribute('aria-expanded', 'true');
    expect(agentRowCount()).toBe(4);
  });

  test('stays open across a refresh of the same session', async () => {
    const user = userEvent.setup();
    page.render(SessionView);
    page.set({ session: withRun() });
    await user.click(fold());
    const button = fold();
    page.set({ session: withRun({ turns: 11 }) });
    flushSync();
    expect(fold()).toBe(button);
    expect(fold()).toHaveAttribute('aria-expanded', 'true');
    expect(agentRowCount()).toBe(4);
  });

  test('starts closed again for another session', async () => {
    const user = userEvent.setup();
    page.render(SessionView);
    page.set({ session: withRun() });
    await user.click(fold());
    page.set({ session: withRun({ session_id: 'other' }) });
    expect(fold()).toHaveAttribute('aria-expanded', 'false');
    expect(agentRowCount()).toBe(2);
  });
});

describe('the tools', () => {
  const withBash = (changes: Partial<SessionDetail> = {}) =>
    fullSession({
      agents: [
        agent({
          tool_kinds: [
            toolKindRow({ tool: 'Bash', calls: 9 }),
            toolKindRow({ tool: 'Bash', kind: 'search', calls: 4 }),
            toolKindRow({ tool: 'Bash', kind: 'search', detail: 'grep', calls: 3 }),
          ],
        }),
      ],
      ...changes,
    });
  const fold = () => screen.getByRole('button', { name: '1 program' });
  const toolRowCount = () => within(screen.getByRole('table', { name: 'Tools' })).getAllByRole('row').length - 1;

  test('open what a row splits into with its button, closed at first', async () => {
    const user = userEvent.setup();
    page.render(SessionView);
    page.set({ session: withBash() });
    expect(fold()).toHaveAttribute('aria-expanded', 'false');
    expect(toolRowCount()).toBe(2);
    await user.click(fold());
    expect(toolRowCount()).toBe(3);
  });

  test('stay open across a refresh of the same session', async () => {
    const user = userEvent.setup();
    page.render(SessionView);
    page.set({ session: withBash() });
    await user.click(fold());
    const button = fold();
    page.set({ session: withBash({ turns: 11 }) });
    flushSync();
    expect(fold()).toBe(button);
    expect(toolRowCount()).toBe(3);
  });

  test('start closed again for another session, on the first page of their own key', () => {
    page.render(SessionView);
    page.set({ session: withBash() });
    page.set({ session: withBash({ session_id: 'other' }) });
    expect(fold()).toHaveAttribute('aria-expanded', 'false');
    expect(toolRowCount()).toBe(2);
  });

  test('page under the session`s key', () => {
    const tools = Array.from({ length: 12 }, (_unused, index) => toolKindRow({ tool: `Tool${index}` }));
    page.render(SessionView);
    page.set({ session: fullSession({ agents: [agent({ tool_kinds: tools })] }) });
    expect(screen.getByRole('combobox', { name: 'Rows per page' }).id).toBe('pager-abc123-tools-size');
  });
});
