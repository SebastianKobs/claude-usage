import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { tick } from 'svelte';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import type { Chat, ChatEntry, SessionDetail } from '../lib/api';
import { agent, chatAnswer, chatEntry, sessionDetail } from '../lib/fixtures';
import { payload, setPayload } from '../lib/payload.svelte';
import { preferences } from '../lib/prefs.svelte';
import Conversation from './Conversation.svelte';

/** A session with the main thread, a helper, a workflow run's two agents and the background calls. */
function session(changes: Partial<SessionDetail> = {}): SessionDetail {
  const inRun = (id: string, description: string) =>
    agent({
      agent_id: id,
      agent_type: 'workflow-subagent',
      description,
      workflow_run: 'wf_1',
      workflow_name: 'review',
    });
  return sessionDetail({
    agents: [
      agent(),
      agent({ agent_id: 'a-1', agent_type: 'Explore', description: 'Find the callers' }),
      inRun('w-1', 'first pass'),
      inRun('w-2', 'second pass'),
      agent({ agent_type: '(background)', agent_id: null }),
    ],
    ...changes,
  });
}

/** A prompt, a call's two entries (one message) and a later reply: the order they come in. */
function entries(): ChatEntry[] {
  return [
    chatEntry({ kind: 'prompt', timestamp: '2026-09-30T08:00:00.000Z', text: 'the prompt' }),
    chatEntry({ timestamp: '2026-09-30T08:00:01.000Z', text: 'reply one', message_id: 'm-1' }),
    chatEntry({ kind: 'tool', timestamp: '2026-09-30T08:00:02.000Z', text: 'call one', message_id: 'm-1' }),
    chatEntry({ timestamp: '2026-09-30T08:00:03.000Z', text: 'reply two', message_id: 'm-2' }),
  ];
}

/** What the server answers: the body, with a status. */
function reply(body: unknown, status = 200) {
  return { ok: status < 400, status, json: async () => body };
}

/** A fetch that answers each request with the next of the answers, the last again (an Error rejects). */
function answering(...answers: (Chat | Error)[]) {
  let next = 0;
  const stub = vi.fn(async (_url: string) => {
    const answer = answers[Math.min(next++, answers.length - 1)];
    if (answer instanceof Error) throw answer;
    return reply(answer);
  });
  vi.stubGlobal('fetch', stub);
  return stub;
}

/** A fetch that answers nothing until the test does, each request on its own. */
function holding() {
  const pending: { url: string; resolve: (answer: Chat) => void; fail: (error: Error) => void }[] = [];
  const stub = vi.fn(
    (url: string) =>
      new Promise((resolve, reject) => {
        pending.push({ url, resolve: (answer) => resolve(reply(answer)), fail: reject });
      }),
  );
  vi.stubGlobal('fetch', stub);
  return { stub, pending };
}

/** The old script's drawing of an entry, reduced: a block with a details and the text. */
function stubEntryDrawing() {
  const draw = vi.fn((entry: ChatEntry) => {
    const block = document.createElement('div');
    block.className = 'entry';
    block.innerHTML = `<details><summary></summary><p>more</p></details>`;
    (block.querySelector('summary') as HTMLElement).textContent = entry.text;
    return block;
  });
  vi.stubGlobal('chatEntry', draw);
  return draw;
}

const chatNode = () => document.getElementById('chat') as HTMLElement;
const rows = () => [...document.querySelectorAll<HTMLElement>('.chat-row')];
const texts = () => rows().map((row) => row.querySelector('summary')?.textContent);
const showButton = () => screen.getByRole('button', { name: /^(Show conversation|Reload)$/ });
const closeButton = () => document.getElementById('chat-close') as HTMLButtonElement;
const picker = () => screen.getByRole('combobox', { name: 'Conversation of' });

/** Lets answers that are ready, and what they draw, come in. */
async function settle(): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 0));
  await tick();
}

/** Loads the conversation and waits for it. */
async function load(): Promise<void> {
  await userEvent.click(showButton());
  await settle();
}

let draw: ReturnType<typeof stubEntryDrawing>;

beforeEach(() => {
  localStorage.clear();
  preferences.oldestFirst = false;
  draw = stubEntryDrawing();
  setPayload({ session: session() });
});

afterEach(() => {
  vi.unstubAllGlobals();
  payload.reset();
  preferences.oldestFirst = false;
  localStorage.clear();
});

describe('before the conversation is asked for', () => {
  test('the section is named by its level 3 heading', () => {
    render(Conversation);
    expect(screen.getByRole('heading', { level: 3, name: 'Conversation' })).toHaveAttribute('id', 'chat-heading');
    expect(screen.getByRole('region', { name: 'Conversation' })).toHaveAttribute('id', 'chat-section');
    expect(screen.getByText('read from the transcript when you ask, never stored')).toBeInTheDocument();
  });

  test('the heading is worded by the theme', () => {
    preferences.theme = 'hacker';
    render(Conversation);
    expect(screen.getByRole('heading', { level: 3 })).not.toHaveTextContent(/^Conversation$/);
    preferences.theme = null;
  });

  test('only the button to show it is there: Close is hidden', () => {
    render(Conversation);
    expect(showButton()).toHaveTextContent('Show conversation');
    expect(closeButton().hidden).toBe(true);
  });

  test('#chat has no children, for the style that hides it while empty', () => {
    render(Conversation);
    expect(chatNode()).toBeEmptyDOMElement();
  });

  test('the end note follows the section, focusable by a script only', () => {
    render(Conversation);
    const end = document.getElementById('chat-end') as HTMLElement;
    expect(end).toHaveAttribute('tabindex', '-1');
    expect(end).toHaveAttribute('role', 'note');
    expect(end).toHaveAttribute('aria-label', 'End of the conversation');
    expect(end.previousElementSibling).toBe(document.getElementById('chat-section'));
  });

  test('nothing is fetched', () => {
    const stub = answering(chatAnswer());
    render(Conversation);
    expect(stub).not.toHaveBeenCalled();
  });
});

describe('the picker', () => {
  test('offers the main thread first, then a helper by its type and description', () => {
    render(Conversation);
    const options = [...picker().children].filter((child) => child.tagName === 'OPTION') as HTMLOptionElement[];
    expect(options.map((option) => [option.value, option.textContent])).toEqual([
      ['', 'Main thread'],
      ['a-1', 'Explore · Find the callers'],
    ]);
    expect(picker()).toHaveValue('');
  });

  test('groups a workflow run`s agents under one heading named by the run', () => {
    render(Conversation);
    const groups = [...picker().querySelectorAll('optgroup')];
    expect(groups.map((group) => group.label)).toEqual(['workflow · review']);
    expect([...(groups[0] as HTMLElement).querySelectorAll('option')].map((option) => option.value)).toEqual([
      'w-1',
      'w-2',
    ]);
  });

  test('leaves the background calls out, since they have no transcript', () => {
    render(Conversation);
    expect([...picker().querySelectorAll('option')].map((option) => option.textContent)).not.toContain('(background)');
    expect(picker().querySelectorAll('option')).toHaveLength(4);
  });

  test('changing it before the conversation is shown fetches nothing', async () => {
    const stub = answering(chatAnswer());
    render(Conversation);
    await userEvent.selectOptions(picker(), 'a-1');
    expect(stub).not.toHaveBeenCalled();
    expect(chatNode()).toBeEmptyDOMElement();
  });

  test('changing it while the conversation is shown loads that agent`s', async () => {
    const stub = answering(chatAnswer(entries()), chatAnswer([chatEntry({ text: 'the helper' })]));
    render(Conversation);
    await load();
    await userEvent.selectOptions(picker(), 'a-1');
    await settle();
    expect(stub).toHaveBeenLastCalledWith('/api/session/abc123/chat?agent=a-1', { cache: 'no-store' });
    expect(texts()).toEqual(['the helper']);
  });

  test('choosing a workflow agent asks for its id', async () => {
    const stub = answering(chatAnswer());
    render(Conversation);
    await load();
    await userEvent.selectOptions(picker(), 'w-2');
    await settle();
    expect(stub).toHaveBeenLastCalledWith('/api/session/abc123/chat?agent=w-2', { cache: 'no-store' });
  });

  test('going back to the main thread asks for no agent', async () => {
    const stub = answering(chatAnswer());
    render(Conversation);
    await load();
    await userEvent.selectOptions(picker(), 'a-1');
    await userEvent.selectOptions(picker(), '');
    await settle();
    expect(stub).toHaveBeenLastCalledWith('/api/session/abc123/chat', { cache: 'no-store' });
  });

  test('quick switches draw only the newest answer, whichever comes last', async () => {
    const { pending } = holding();
    render(Conversation);
    await userEvent.click(showButton());
    await userEvent.selectOptions(picker(), 'a-1');
    expect(pending.map((request) => request.url)).toEqual([
      '/api/session/abc123/chat',
      '/api/session/abc123/chat?agent=a-1',
    ]);
    pending[1]?.resolve(chatAnswer([chatEntry({ text: 'newest' })]));
    await settle();
    pending[0]?.resolve(chatAnswer([chatEntry({ text: 'stale' })]));
    await settle();
    expect(texts()).toEqual(['newest']);
    expect(draw).not.toHaveBeenCalledWith(expect.objectContaining({ text: 'stale' }));
  });
});

describe('loading', () => {
  test('says so while the answer is awaited, with no conversation yet', async () => {
    holding();
    render(Conversation);
    await userEvent.click(showButton());
    expect(chatNode()).toHaveTextContent(/^Loading…$/);
    expect(chatNode().querySelector('.empty')).not.toBeNull();
    expect(showButton()).toHaveTextContent('Show conversation');
    expect(closeButton().hidden).toBe(false);
  });

  test('asks for the main thread of the session', async () => {
    const stub = answering(chatAnswer());
    render(Conversation);
    await load();
    expect(stub).toHaveBeenCalledTimes(1);
    expect(stub).toHaveBeenCalledWith('/api/session/abc123/chat', { cache: 'no-store' });
  });

  test('lists the entries newest first, a call`s entries together in their order', async () => {
    answering(chatAnswer(entries()));
    render(Conversation);
    await load();
    expect(texts()).toEqual(['reply two', 'reply one', 'call one', 'the prompt']);
  });

  test('gives each entry a row with a unique key, its time, kind and place', async () => {
    answering(chatAnswer(entries()));
    render(Conversation);
    await load();
    const keys = rows().map((row) => row.dataset.key);
    expect(new Set(keys).size).toBe(4);
    expect(keys).toContain('2026-09-30T08:00:02.000Z tool 2');
  });

  test('puts the skip button first, then the reminders, then the entries', async () => {
    answering(chatAnswer(entries(), { reminders: { calls: 3, chars: 258 } }));
    render(Conversation);
    await load();
    const children = [...chatNode().children];
    expect(children.map((child) => child.tagName)).toEqual(['BUTTON', 'DIV', 'DIV']);
    expect(children.map((child) => child.className)).toEqual(['skip-link', 'chat-reminders muted', 'chat']);
    expect(children[0]).toHaveTextContent('Skip the conversation');
    expect(children[0]).toHaveAttribute('type', 'button');
  });

  test('the button then reads Reload and Close shows', async () => {
    answering(chatAnswer(entries()));
    render(Conversation);
    await load();
    expect(showButton()).toHaveTextContent('Reload');
    expect(closeButton().hidden).toBe(false);
  });

  test('Reload reads it again and draws the answer', async () => {
    answering(chatAnswer(entries()), chatAnswer([chatEntry({ text: 'later' })]));
    render(Conversation);
    await load();
    await load();
    expect(texts()).toEqual(['later']);
  });

  test('says the reminders in one line: the calls and their characters', async () => {
    answering(chatAnswer(entries(), { reminders: { calls: 3, chars: 258 } }));
    render(Conversation);
    await load();
    expect(chatNode().querySelector('.chat-reminders')).toHaveTextContent(
      "Claude Code's token reminder went with 3 calls, 258 characters in all",
    );
  });

  test('has no reminders line without reminders', async () => {
    answering(chatAnswer(entries()));
    render(Conversation);
    await load();
    expect(chatNode().querySelector('.chat-reminders')).toBeNull();
  });

  test('says where the transcript is gone, with no entries', async () => {
    answering(chatAnswer([], { available: false }));
    render(Conversation);
    await load();
    expect(chatNode()).toHaveTextContent(
      'The transcript is gone: Claude Code deleted it after its cleanup period. The usage history stays.',
    );
    expect(chatNode().querySelector('.skip-link')).toBeNull();
    expect(chatNode().querySelector('.chat')).toBeNull();
    expect(showButton()).toHaveTextContent('Reload');
  });

  test('says where there is no conversation yet', async () => {
    answering(chatAnswer([]));
    render(Conversation);
    await load();
    expect(chatNode()).toHaveTextContent(/^No conversation in this transcript yet\.$/);
    expect(chatNode().querySelector('.empty')).not.toBeNull();
    expect(chatNode().querySelector('.skip-link')).toBeNull();
  });

  test('shows why it failed, in place of the conversation', async () => {
    answering(new Error('HTTP 500, not JSON'));
    render(Conversation);
    await load();
    expect(chatNode()).toHaveTextContent('HTTP 500, not JSON');
    expect(chatNode().querySelector('.empty')).not.toBeNull();
    expect(showButton()).toHaveTextContent('Show conversation');
    expect(closeButton().hidden).toBe(false);
  });

  test('shows the server`s reason from a failed answer', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => reply({ error: 'no such session' }, 404)),
    );
    render(Conversation);
    await load();
    expect(chatNode()).toHaveTextContent('/api/session/abc123/chat: no such session');
  });

  test('an older failure does not replace a newer answer', async () => {
    const { pending } = holding();
    render(Conversation);
    await userEvent.click(showButton());
    await userEvent.selectOptions(picker(), 'a-1');
    pending[1]?.resolve(chatAnswer([chatEntry({ text: 'newest' })]));
    await settle();
    pending[0]?.fail(new Error('too late'));
    await settle();
    expect(texts()).toEqual(['newest']);
    expect(chatNode()).not.toHaveTextContent('too late');
  });

  test('the skip button moves focus to the end note', async () => {
    answering(chatAnswer(entries()));
    render(Conversation);
    await load();
    await userEvent.click(screen.getByRole('button', { name: 'Skip the conversation' }));
    expect(document.getElementById('chat-end')).toHaveFocus();
  });
});

describe('the order button', () => {
  const order = () => document.getElementById('chat-order') as HTMLElement;

  test('is named Oldest first, pressed or not, with a title saying what a click does', () => {
    render(Conversation);
    expect(order()).toHaveAttribute('aria-label', 'Oldest first');
    expect(order()).toHaveAttribute('aria-pressed', 'false');
    expect(order()).toHaveAttribute('title', 'Newest first: click for oldest first');
    expect(order().querySelector('.chat-order-arrow')).toHaveAttribute('aria-hidden', 'true');
  });

  test('turns the list to the transcript`s order', async () => {
    answering(chatAnswer(entries()));
    render(Conversation);
    await load();
    await userEvent.click(order());
    expect(texts()).toEqual(['the prompt', 'reply one', 'call one', 'reply two']);
  });

  test('presses, retitles and saves the choice', async () => {
    render(Conversation);
    await userEvent.click(order());
    expect(order()).toHaveAttribute('aria-pressed', 'true');
    expect(order()).toHaveAttribute('title', 'Oldest first: click for newest first');
    expect(preferences.oldestFirst).toBe(true);
    expect(localStorage.getItem('claude-usage.chat-oldest-first')).toBe('true');
  });

  test('clicked again goes back to newest first', async () => {
    answering(chatAnswer(entries()));
    render(Conversation);
    await load();
    await userEvent.click(order());
    await userEvent.click(order());
    expect(texts()).toEqual(['reply two', 'reply one', 'call one', 'the prompt']);
    expect(order()).toHaveAttribute('aria-pressed', 'false');
  });

  test('moves the entries` nodes without drawing them again', async () => {
    answering(chatAnswer(entries()));
    render(Conversation);
    await load();
    const before = new Map(rows().map((row) => [row.dataset.key, row]));
    const drawn = draw.mock.calls.length;
    await userEvent.click(order());
    expect(rows()).toHaveLength(4);
    for (const row of rows()) expect(row).toBe(before.get(row.dataset.key));
    expect(draw).toHaveBeenCalledTimes(drawn);
  });

  test('starts pressed where the saved choice is oldest first', async () => {
    preferences.oldestFirst = true;
    answering(chatAnswer(entries()));
    render(Conversation);
    expect(order()).toHaveAttribute('aria-pressed', 'true');
    await load();
    expect(texts()[0]).toBe('the prompt');
  });
});

describe('Close', () => {
  test('empties #chat, hides itself, reads Show conversation and focuses that button', async () => {
    answering(chatAnswer(entries()));
    render(Conversation);
    await load();
    await userEvent.click(closeButton());
    expect(chatNode()).toBeEmptyDOMElement();
    expect(closeButton().hidden).toBe(true);
    expect(showButton()).toHaveTextContent('Show conversation');
    expect(showButton()).toHaveFocus();
  });

  test('drops a load still under way', async () => {
    const { pending } = holding();
    render(Conversation);
    await userEvent.click(showButton());
    await userEvent.click(closeButton());
    expect(chatNode()).toBeEmptyDOMElement();
    pending[0]?.resolve(chatAnswer(entries()));
    await settle();
    expect(chatNode()).toBeEmptyDOMElement();
    expect(draw).not.toHaveBeenCalled();
    expect(showButton()).toHaveTextContent('Show conversation');
  });

  test('keeps a failure under way from showing too', async () => {
    const stub = vi.fn(() => Promise.reject(new Error('late failure')));
    vi.stubGlobal('fetch', stub);
    render(Conversation);
    await userEvent.click(showButton());
    await userEvent.click(closeButton());
    await settle();
    expect(chatNode()).toBeEmptyDOMElement();
  });

  test('lets the picker change fetch nothing again', async () => {
    const stub = answering(chatAnswer(entries()));
    render(Conversation);
    await load();
    await userEvent.click(closeButton());
    await userEvent.selectOptions(picker(), 'a-1');
    expect(stub).toHaveBeenCalledTimes(1);
  });

  test('shows the conversation again from the button', async () => {
    answering(chatAnswer(entries()));
    render(Conversation);
    await load();
    await userEvent.click(closeButton());
    await load();
    expect(texts()).toHaveLength(4);
    expect(closeButton().hidden).toBe(false);
  });
});

describe('when it is destroyed', () => {
  test('a load under way draws nothing', async () => {
    const { pending } = holding();
    const { unmount } = render(Conversation);
    await userEvent.click(showButton());
    unmount();
    pending[0]?.resolve(chatAnswer(entries()));
    await settle();
    expect(draw).not.toHaveBeenCalled();
  });
});

describe('a refresh of the session', () => {
  /** The page sees the same session change: a new object for it. */
  function refreshed(changes: Partial<SessionDetail> = {}): void {
    setPayload({ session: session({ turns: 11, ...changes }) });
  }

  test('reads the conversation shown again, from the agent shown', async () => {
    const stub = answering(chatAnswer(entries()));
    render(Conversation);
    await userEvent.selectOptions(picker(), 'a-1');
    await load();
    refreshed();
    await settle();
    expect(stub).toHaveBeenCalledTimes(2);
    expect(stub).toHaveBeenLastCalledWith('/api/session/abc123/chat?agent=a-1', { cache: 'no-store' });
  });

  test('draws nothing where the answer is the same', async () => {
    const stub = answering(chatAnswer(entries()));
    render(Conversation);
    await load();
    const before = rows();
    const drawn = draw.mock.calls.length;
    refreshed();
    await settle();
    expect(stub).toHaveBeenCalledTimes(2);
    expect(draw).toHaveBeenCalledTimes(drawn);
    expect(rows()).toEqual(before);
  });

  test('draws only the entries that changed or came, and keeps the nodes of the others', async () => {
    const first = entries();
    // as read from the server: equal entries, but other objects
    const second = structuredClone([
      ...first.slice(0, 3),
      chatEntry({ ...first[3], text: 'reply two, longer' }),
      chatEntry({ timestamp: '2026-09-30T08:00:04.000Z', text: 'reply three', message_id: 'm-3' }),
    ]);
    answering(chatAnswer(first), chatAnswer(second));
    render(Conversation);
    await load();
    const before = new Map(rows().map((row) => [row.dataset.key, row]));
    draw.mockClear();
    refreshed();
    await settle();
    expect(texts()).toEqual(['reply three', 'reply two, longer', 'reply one', 'call one', 'the prompt']);
    expect(draw.mock.calls.map(([entry]) => entry.text).sort()).toEqual(['reply three', 'reply two, longer']);
    for (const row of rows()) {
      const node = before.get(row.dataset.key);
      if (node) expect(row).toBe(node);
    }
  });

  test('keeps open what the reader opened in an entry that changed', async () => {
    const first = entries();
    const second = [...first.slice(0, 3), chatEntry({ ...first[3], text: 'reply two, longer' })];
    answering(chatAnswer(first), chatAnswer(second));
    render(Conversation);
    await load();
    (rows()[0]?.querySelector('details') as HTMLDetailsElement).open = true;
    (rows()[1]?.querySelector('details') as HTMLDetailsElement).open = false;
    refreshed();
    await settle();
    const [changed, untouched] = rows();
    expect(changed?.querySelector('summary')).toHaveTextContent('reply two, longer');
    expect((changed?.querySelector('details') as HTMLDetailsElement).open).toBe(true);
    expect((untouched?.querySelector('details') as HTMLDetailsElement).open).toBe(false);
  });

  test('keeps a fresh load from inheriting what was open before', async () => {
    answering(chatAnswer(entries()));
    render(Conversation);
    await load();
    (rows()[0]?.querySelector('details') as HTMLDetailsElement).open = true;
    await load();
    expect((rows()[0]?.querySelector('details') as HTMLDetailsElement).open).toBe(false);
  });

  test('keeps the reader`s place where the conversation starts above the window', async () => {
    const first = entries();
    const second = [...first, chatEntry({ timestamp: '2026-09-30T08:00:04.000Z', text: 'reply three' })];
    answering(chatAnswer(first), chatAnswer(second));
    render(Conversation);
    await load();
    const scrollBy = vi.fn();
    window.scrollBy = scrollBy as unknown as typeof window.scrollBy;
    chatNode().getBoundingClientRect = () => ({ top: -100 }) as DOMRect;
    let looked = 0;
    (rows()[0] as HTMLElement).getBoundingClientRect = () =>
      ({ top: looked++ === 0 ? -50 : -20, bottom: 100 }) as DOMRect;
    refreshed();
    await settle();
    expect(scrollBy).toHaveBeenCalledWith(0, 30);
  });

  test('does not move the window where the conversation starts in view', async () => {
    const first = entries();
    const second = [...first, chatEntry({ timestamp: '2026-09-30T08:00:04.000Z', text: 'reply three' })];
    answering(chatAnswer(first), chatAnswer(second));
    render(Conversation);
    await load();
    const scrollBy = vi.fn();
    window.scrollBy = scrollBy as unknown as typeof window.scrollBy;
    chatNode().getBoundingClientRect = () => ({ top: 10 }) as DOMRect;
    // an entry that would serve as the anchor, were one noted
    (rows()[0] as HTMLElement).getBoundingClientRect = () => ({ top: 5, bottom: 100 }) as DOMRect;
    refreshed();
    await settle();
    expect(texts()[0]).toBe('reply three');
    expect(scrollBy).not.toHaveBeenCalled();
  });

  test('keeps the conversation where reading it fails', async () => {
    answering(chatAnswer(entries()), new Error('HTTP 500'));
    render(Conversation);
    await load();
    const before = rows();
    const drawn = draw.mock.calls.length;
    refreshed();
    await settle();
    expect(rows()).toEqual(before);
    expect(draw).toHaveBeenCalledTimes(drawn);
    expect(chatNode()).not.toHaveTextContent('HTTP 500');
  });

  test('tries again with the next one after a failure', async () => {
    answering(chatAnswer(entries()), new Error('HTTP 500'), chatAnswer([chatEntry({ text: 'recovered' })]));
    render(Conversation);
    await load();
    refreshed();
    await settle();
    refreshed({ turns: 12 });
    await settle();
    expect(texts()).toEqual(['recovered']);
  });

  test('reads nothing while the conversation is not shown', async () => {
    const stub = answering(chatAnswer(entries()));
    render(Conversation);
    refreshed();
    await settle();
    expect(stub).not.toHaveBeenCalled();
  });

  test('reads nothing once it is closed', async () => {
    const stub = answering(chatAnswer(entries()));
    render(Conversation);
    await load();
    await userEvent.click(closeButton());
    refreshed();
    await settle();
    expect(stub).toHaveBeenCalledTimes(1);
    expect(chatNode()).toBeEmptyDOMElement();
  });

  test('reads nothing while the first load is under way', async () => {
    const { stub } = holding();
    render(Conversation);
    await userEvent.click(showButton());
    refreshed();
    await settle();
    expect(stub).toHaveBeenCalledTimes(1);
  });

  test('is dropped where a newer read started meanwhile', async () => {
    const { pending } = holding();
    render(Conversation);
    await userEvent.click(showButton());
    pending[0]?.resolve(chatAnswer(entries()));
    await settle();
    refreshed();
    await settle();
    refreshed({ turns: 12 });
    await settle();
    expect(pending).toHaveLength(3);
    pending[2]?.resolve(chatAnswer([chatEntry({ text: 'newest' })]));
    await settle();
    pending[1]?.resolve(chatAnswer([chatEntry({ text: 'stale' })]));
    await settle();
    expect(texts()).toEqual(['newest']);
  });

  test('keeps the nodes of the frame: the picker keeps its choice', async () => {
    answering(chatAnswer(entries()));
    render(Conversation);
    await userEvent.selectOptions(picker(), 'a-1');
    const node = picker();
    refreshed();
    await settle();
    expect(picker()).toBe(node);
    expect(picker()).toHaveValue('a-1');
  });
});
