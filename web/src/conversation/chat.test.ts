import { describe, expect, test } from 'vitest';
import type { Chat, ChatEntry } from '../api/api';
import { agent } from '../api/fixtures';
import {
  agentChoices,
  chatNotice,
  chatUrl,
  orderTitle,
  reminderNote,
  reuseEntries,
  sameChat,
} from './chat';

function entry(changes: Partial<ChatEntry> = {}): ChatEntry {
  return {
    kind: 'text',
    timestamp: '2026-09-30T08:00:00.000Z',
    text: 'hello',
    model: null,
    tool: null,
    summary: null,
    tool_fields: [],
    result: null,
    result_chars: 0,
    is_error: false,
    effort: null,
    message_id: null,
    usage: null,
    items: [],
    compaction: null,
    ...changes,
  };
}

function chat(entries: ChatEntry[], changes: Partial<Chat> = {}): Chat {
  return {
    session_id: 's1',
    agent_id: null,
    available: true,
    entries,
    reminders: { calls: 0, chars: 0 },
    ...changes,
  };
}

describe('chatUrl', () => {
  test('is the main thread without a query', () => {
    expect(chatUrl('s1', null)).toBe('/api/session/s1/chat');
  });

  test('names the agent in the query', () => {
    expect(chatUrl('s1', 'a1')).toBe('/api/session/s1/chat?agent=a1');
  });

  test('encodes both', () => {
    expect(chatUrl('a/b', 'x y&z')).toBe('/api/session/a%2Fb/chat?agent=x%20y%26z');
  });
});

describe('orderTitle', () => {
  test('says what a click does', () => {
    expect(orderTitle(true)).toBe('Oldest first: click for newest first');
    expect(orderTitle(false)).toBe('Newest first: click for oldest first');
  });
});

describe('agentChoices', () => {
  test('lists the main thread by its name and a subagent by its type and description', () => {
    const choices = agentChoices([
      agent(),
      agent({ agent_id: 'a1', agent_type: 'Explore', description: 'find the parser' }),
      agent({ agent_id: 'a2', agent_type: 'Plan' }),
    ]);
    expect(choices).toEqual([
      { value: '', label: 'Main thread' },
      { value: 'a1', label: 'Explore · find the parser' },
      { value: 'a2', label: 'Plan' },
    ]);
  });

  test('leaves the background calls out, which have no transcript', () => {
    expect(agentChoices([agent(), agent({ agent_type: '(background)' })])).toEqual([
      { value: '', label: 'Main thread' },
    ]);
  });

  test("groups a workflow run's agents in one group, at the place of its first agent", () => {
    const choices = agentChoices([
      agent(),
      agent({ agent_id: 'w1', agent_type: 'workflow-subagent', workflow_run: 'wf_1', workflow_name: 'review' }),
      agent({ agent_id: 'a1', agent_type: 'Explore' }),
      agent({ agent_id: 'w2', agent_type: 'workflow-subagent', workflow_run: 'wf_1', workflow_name: 'review' }),
      agent({ agent_id: 'w3', agent_type: 'workflow-subagent', workflow_run: 'wf_2' }),
    ]);
    expect(choices).toEqual([
      { value: '', label: 'Main thread' },
      {
        group: 'workflow · review',
        options: [
          { value: 'w1', label: 'workflow-subagent' },
          { value: 'w2', label: 'workflow-subagent' },
        ],
      },
      { value: 'a1', label: 'Explore' },
      { group: 'workflow · wf_2', options: [{ value: 'w3', label: 'workflow-subagent' }] },
    ]);
  });
});

describe('reminderNote', () => {
  test('is nothing without reminders', () => {
    expect(reminderNote({ calls: 0, chars: 0 })).toBeNull();
  });

  test('sums the calls and characters in one line', () => {
    expect(reminderNote({ calls: 1234, chars: 106_124 })).toBe(
      "Claude Code's token reminder went with 1,234 calls, 106,124 characters in all; " +
        "each call's badge counts it (hover the badge).",
    );
  });
});

describe('chatNotice', () => {
  test('says the transcript is gone where it is', () => {
    expect(chatNotice(chat([], { available: false }))).toBe(
      'The transcript is gone: Claude Code deleted it after its cleanup period. The usage history stays.',
    );
  });

  test('says there is no conversation yet for an empty one', () => {
    expect(chatNotice(chat([]))).toBe('No conversation in this transcript yet.');
  });

  test('is nothing where there is a conversation', () => {
    expect(chatNotice(chat([entry()]))).toBeNull();
  });
});

describe('sameChat', () => {
  test('holds for equal content in other objects', () => {
    expect(sameChat(chat([entry()]), chat([entry()]))).toBe(true);
  });

  test('fails for a changed entry, or a new one', () => {
    expect(sameChat(chat([entry()]), chat([entry({ text: 'other' })]))).toBe(false);
    expect(sameChat(chat([entry()]), chat([entry(), entry()]))).toBe(false);
  });

  test('fails for changed reminders', () => {
    expect(sameChat(chat([entry()]), chat([entry()], { reminders: { calls: 1, chars: 86 } }))).toBe(false);
  });
});

describe('reuseEntries', () => {
  test('keeps the old object where an entry did not change, so what shows it is not drawn again', () => {
    const before = chat([entry({ text: 'a' }), entry({ text: 'b', kind: 'prompt' })]);
    const after = chat([entry({ text: 'a' }), entry({ text: 'b', kind: 'prompt' }), entry({ text: 'c' })]);
    const reused = reuseEntries(before, after);
    expect(reused.entries[0]).toBe(before.entries[0]);
    expect(reused.entries[1]).toBe(before.entries[1]);
    expect(reused.entries[2]).toBe(after.entries[2]);
  });

  test('takes the new object where an entry changed (a tool call that got its result)', () => {
    const before = chat([entry({ kind: 'tool', result: null })]);
    const after = chat([entry({ kind: 'tool', result: 'done' })]);
    expect(reuseEntries(before, after).entries[0]).toBe(after.entries[0]);
  });

  test('takes everything from the new chat without an old one, and keeps its other fields', () => {
    const after = chat([entry()], { reminders: { calls: 2, chars: 172 } });
    const reused = reuseEntries(null, after);
    expect(reused.entries[0]).toBe(after.entries[0]);
    expect(reused.reminders).toEqual({ calls: 2, chars: 172 });
  });

  test('does not change the new chat it is given', () => {
    const before = chat([entry()]);
    const after = chat([entry()]);
    reuseEntries(before, after);
    expect(after.entries[0]).not.toBe(before.entries[0]);
  });
});
