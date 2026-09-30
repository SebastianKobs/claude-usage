import { render } from '@testing-library/svelte';
import { describe, expect, test } from 'vitest';
import type { ChatEntry } from '../lib/api';
import { callUsage, chatEntry, versusKeeping } from '../lib/fixtures';
import ConversationEntry from './ConversationEntry.svelte';

function draw(changes: Partial<ChatEntry>) {
  return render(ConversationEntry, { entry: chatEntry(changes) });
}

describe('by kind', () => {
  test('a prompt is a message of the user', () => {
    const { container } = draw({ kind: 'prompt', text: 'hi' });
    expect(container.querySelector(':scope > .chat-entry.chat-user')).not.toBeNull();
  });

  test('a reply is a message of Claude', () => {
    const { container } = draw({ kind: 'text', text: 'hello' });
    expect(container.querySelector(':scope > .chat-entry.chat-assistant')).not.toBeNull();
  });

  test('thinking is a closed message in a details', () => {
    const { container } = draw({ kind: 'thinking', text: 'hmm' });
    expect(container.querySelector(':scope > details.chat-entry.chat-thinking')).not.toBeNull();
  });

  test('a kind not known is a message, named as it is', () => {
    const { container } = draw({ kind: 'mystery' as ChatEntry['kind'], text: 'odd' });
    expect(container.querySelector(':scope > .chat-entry .chat-head strong')?.textContent).toBe('mystery');
    expect(container.querySelector('.chat-text')?.textContent).toBe('odd');
  });

  test('a tool call is a details with its input', () => {
    const { container } = draw({ kind: 'tool', tool: 'Grep' });
    expect(container.querySelector(':scope > details.chat-tool > summary strong')?.textContent).toBe('Grep');
    expect(container.querySelector('.chat-injected')).toBeNull();
    expect(container.querySelector('.chat-entry')).toBeNull();
  });

  test('hidden context is a details of its pieces', () => {
    const { container } = draw({ kind: 'injected', text: null, items: [{ kind: 'skill', chars: 3, text: 'abc' }] });
    expect(container.querySelector(':scope > details.chat-tool.chat-injected')).not.toBeNull();
  });

  test('a compaction is a marker with its line', () => {
    const { container } = draw({
      kind: 'compaction',
      text: 'Conversation compacted',
      compaction: { trigger: 'auto', pre_tokens: 150_000, post_tokens: 10_000, duration_ms: null },
    });
    expect(container.querySelector(':scope > .chat-marker')?.textContent).toContain('Conversation compacted · auto');
  });

  test('a compaction with its comparison says vs keeping', () => {
    const { container } = draw({ kind: 'compaction', text: 'Conversation compacted', versus_keeping: versusKeeping() });
    expect(container.querySelector('.chat-marker')?.textContent).toContain('vs keeping:');
  });

  test('an API error is a marker', () => {
    const { container } = draw({ kind: 'error', text: 'overloaded' });
    expect(container.querySelector(':scope > .chat-marker')?.textContent).toContain('⚠ API error: overloaded');
  });
});

describe('the usage', () => {
  test('is not there where the entry has none', () => {
    const { container } = draw({ kind: 'text' });
    expect(container.querySelector('.chat-usage')).toBeNull();
    expect(container.children).toHaveLength(1);
  });

  test('follows the entry, a sibling after it', () => {
    const { container } = draw({ kind: 'text', usage: callUsage() });
    expect([...container.children].map((child) => child.className)).toEqual([
      'chat-entry chat-assistant',
      'chat-usage',
    ]);
  });

  test('follows a tool call too', () => {
    const { container } = draw({ kind: 'tool', tool: 'Grep', usage: callUsage() });
    expect(container.children[0]?.className).toBe('chat-tool');
    expect(container.children[1]?.className).toBe('chat-usage');
  });

  test('follows a marker too', () => {
    const { container } = draw({ kind: 'error', text: 'x', usage: callUsage() });
    expect(container.children[0]?.className).toBe('chat-marker');
    expect(container.children[1]?.className).toBe('chat-usage');
  });

  test('is the call`s own: its cost shows', () => {
    const { container } = draw({ kind: 'text', usage: callUsage({ cost: 1.25 }) });
    expect(container.querySelector('.chat-usage strong')?.textContent).toBe('$1.25');
  });

  test('gets the entry`s hint: a reminder tints the badge', () => {
    const hint = { kind: 'soft_reminder', context: 300_000, threshold: 200_000, times: 1.5 } as const;
    const { container } = draw({ kind: 'text', usage: callUsage(), compact_hint: hint });
    expect(container.querySelector('.chat-usage')?.className).toBe('chat-usage chat-usage-remind');
    expect(container.querySelector('.compact-chip')).not.toBeNull();
  });

  test('gets the entry`s hint: a first hint is a block after the badge', () => {
    const hint = { kind: 'soft', context: 300_000, threshold: 200_000, reread_cost: 0.5 } as const;
    const { container } = draw({ kind: 'text', usage: callUsage(), compact_hint: hint });
    expect([...container.children].map((child) => child.className)).toEqual([
      'chat-entry chat-assistant',
      'chat-usage',
      'compact-hint',
    ]);
  });

  test('a hint without a usage shows nothing', () => {
    const hint = { kind: 'soft', context: 300_000, threshold: 200_000, reread_cost: 0.5 } as const;
    const { container } = draw({ kind: 'text', compact_hint: hint });
    expect(container.querySelector('.compact-hint')).toBeNull();
  });
});

describe('when the entry changes', () => {
  test('a tool call keeps its nodes and what the reader opened', async () => {
    const { container, rerender } = render(ConversationEntry, { entry: chatEntry({ kind: 'tool', tool: 'Grep' }) });
    const node = container.querySelector('details') as HTMLDetailsElement;
    node.open = true;
    await rerender({ entry: chatEntry({ kind: 'tool', tool: 'Grep', result: 'done', result_chars: 4 }) });
    expect(container.querySelector('details')).toBe(node);
    expect(node.open).toBe(true);
    expect(node.querySelector(':scope > pre')?.textContent).toBe('done');
  });

  test('a usage that arrives is added after the entry, which keeps its node', async () => {
    const { container, rerender } = render(ConversationEntry, { entry: chatEntry({ kind: 'text' }) });
    const node = container.firstElementChild;
    await rerender({ entry: chatEntry({ kind: 'text', usage: callUsage() }) });
    expect(container.firstElementChild).toBe(node);
    expect(container.children[1]?.className).toBe('chat-usage');
  });
});
