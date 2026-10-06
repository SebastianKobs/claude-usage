import { render } from '@testing-library/svelte';
import { describe, expect, test } from 'vitest';
import { chatEntry } from '../api/fixtures';
import { when } from '../ui/format';
import ChatInjected from './ChatInjected.svelte';

const TIME = '2026-09-30T08:00:00.000Z';

function injected(items: { kind: string; chars: number; text: string }[]) {
  return chatEntry({ kind: 'injected', timestamp: TIME, text: null, items });
}

describe('the summary', () => {
  test('counts one piece as "1 item" with its characters', () => {
    const { container } = render(ChatInjected, { entry: injected([{ kind: 'skill', chars: 1234, text: 'x' }]) });
    const summary = container.querySelector('details.chat-tool.chat-injected > summary');
    expect(summary?.textContent?.replace(/\s+/g, ' ').trim()).toBe(
      `Added to the context 1 item · 1,234 characters ${when(TIME)}`,
    );
    expect(summary?.querySelector('strong')?.textContent).toBe('Added to the context');
    expect(summary?.querySelector('span.muted')?.textContent).toBe(when(TIME));
  });

  test('counts several pieces with thousands formatted', () => {
    const items = Array.from({ length: 1200 }, () => ({ kind: 'meta', chars: 10, text: 'x' }));
    const { container } = render(ChatInjected, { entry: injected(items) });
    expect(container.querySelector('summary')?.textContent).toContain('1,200 items · 12,000 characters');
  });

  test('is closed until it is opened', () => {
    const { container } = render(ChatInjected, { entry: injected([{ kind: 'skill', chars: 1, text: 'x' }]) });
    expect(container.querySelector('details')?.open).toBe(false);
  });
});

describe('the pieces', () => {
  test('each has its kind as a label over its text', () => {
    const { container } = render(ChatInjected, {
      entry: injected([
        { kind: 'deferred_tools_delta', chars: 5, text: 'first' },
        { kind: 'summary', chars: 6, text: 'second' },
      ]),
    });
    const labels = [...container.querySelectorAll('div.label')].map((label) => label.textContent);
    const blocks = [...container.querySelectorAll('pre.code')].map((block) => block.textContent);
    expect(labels).toEqual(['deferred tools delta', 'compact summary']);
    expect(blocks).toEqual(['first', 'second']);
  });

  test('a cut text says how much of it shows', () => {
    const { container } = render(ChatInjected, {
      entry: injected([{ kind: 'meta', chars: 12_345, text: 'x'.repeat(3000) }]),
    });
    expect(container.querySelector('div.label')?.textContent).toBe(
      'meta record · first 3,000 of 12,345 characters',
    );
  });

  test('a whole text has no note', () => {
    const { container } = render(ChatInjected, { entry: injected([{ kind: 'meta', chars: 3, text: 'abc' }]) });
    expect(container.querySelector('div.label')?.textContent).toBe('meta record');
  });

  test('a text with markup stays text', () => {
    const { container } = render(ChatInjected, {
      entry: injected([{ kind: 'meta', chars: 8, text: '<b>x</b>' }]),
    });
    expect(container.querySelector('pre.code')?.textContent).toBe('<b>x</b>');
    expect(container.querySelector('pre.code b')).toBeNull();
  });

  test('a text keeps its own whitespace', () => {
    const { container } = render(ChatInjected, {
      entry: injected([{ kind: 'meta', chars: 9, text: '\n  a\n    b\n' }]),
    });
    expect(container.querySelector('pre.code')?.textContent).toBe('\n  a\n    b\n');
  });

  test('no pieces, no labels', () => {
    const { container } = render(ChatInjected, { entry: injected([]) });
    expect(container.querySelector('div.label')).toBeNull();
    expect(container.querySelector('summary')?.textContent).toContain('0 items · 0 characters');
  });
});
