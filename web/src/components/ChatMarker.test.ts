import { render } from '@testing-library/svelte';
import { describe, expect, test } from 'vitest';
import { VERSUS_KEEPING_NOTE, verdictText, verdictWords } from '../lib/compact';
import { markerText, versusKeepingParts } from '../lib/entries';
import { chatEntry, versusKeeping } from '../lib/fixtures';
import { when } from '../lib/format';
import ChatMarker from './ChatMarker.svelte';

const TIME = '2026-09-30T09:00:00.000Z';

const MARKER = { trigger: 'auto', pre_tokens: 60_000, post_tokens: 5_000, duration_ms: 30_000 };

function compaction(versus: ReturnType<typeof versusKeeping> | null = versusKeeping(), marker = MARKER) {
  return chatEntry({
    kind: 'compaction',
    timestamp: TIME,
    text: 'Conversation compacted',
    compaction: marker,
    versus_keeping: versus,
  });
}

describe('a compaction', () => {
  test('says how it went, then when', () => {
    const entry = compaction(null, { ...MARKER, trigger: 'manual' });
    const { container } = render(ChatMarker, { entry });
    expect(markerText(entry)).toContain('manual');
    expect(container.querySelector('div.chat-marker')?.firstChild?.textContent?.trim()).toBe(markerText(entry));
    expect(container.querySelector('div.chat-marker > span.muted')?.textContent).toBe(when(TIME));
  });

  test('separates its line from the time with a space', () => {
    const entry = compaction(null);
    const { container } = render(ChatMarker, { entry });
    expect(container.querySelector('div.chat-marker')?.textContent?.replace(/\s+/g, ' ').trim()).toBe(
      `${markerText(entry)} ${when(TIME)}`,
    );
  });

  test('without metadata it is only the text', () => {
    const entry = chatEntry({ kind: 'compaction', timestamp: TIME, text: 'Conversation compacted', compaction: null });
    const { container } = render(ChatMarker, { entry });
    expect(container.querySelector('div.chat-marker')?.textContent?.replace(/\s+/g, ' ').trim()).toBe(
      `Conversation compacted ${when(TIME)}`,
    );
  });

  test('has no comparison without versus_keeping', () => {
    const { container } = render(ChatMarker, { entry: compaction(null) });
    expect(container.querySelector('div.muted')).toBeNull();
  });
});

describe('an API error', () => {
  test('is marked with the warning sign and the message', () => {
    const entry = chatEntry({ kind: 'error', timestamp: TIME, text: 'rate_limit', compaction: null });
    const { container } = render(ChatMarker, { entry });
    expect(container.querySelector('div.chat-marker')?.textContent?.replace(/\s+/g, ' ').trim()).toBe(
      `⚠ API error: rate_limit ${when(TIME)}`,
    );
    expect(container.querySelector('div.muted')).toBeNull();
  });

  test('without a text it is still an error', () => {
    const entry = chatEntry({ kind: 'error', timestamp: TIME, text: null });
    const { container } = render(ChatMarker, { entry });
    expect(container.querySelector('div.chat-marker')?.textContent).toContain('⚠ API error:');
  });
});

describe('the comparison with keeping', () => {
  function verdict(container: HTMLElement): HTMLElement {
    return container.querySelector('div.muted > span') as HTMLElement;
  }

  test('a gain is marked as one, with its words on hover', () => {
    const versus = versusKeeping({ verdict: 'saved', net: 2.1 });
    const { container } = render(ChatMarker, { entry: compaction(versus) });
    expect(verdict(container).className).toBe('verdict-gain');
    expect(verdict(container).textContent?.trim()).toBe(verdictText(versus));
    expect(verdict(container).textContent).toContain('▲ +');
    expect(verdict(container).title).toBe('Saved against keeping the context');
  });

  test('a loss is marked as one', () => {
    const versus = versusKeeping({ verdict: 'cost_more', net: -1.5, net_high: -1 });
    const { container } = render(ChatMarker, { entry: compaction(versus) });
    expect(verdict(container).className).toBe('verdict-loss');
    expect(verdict(container).textContent).toContain('▼ −');
    expect(verdict(container).title).toBe(verdictWords(versus));
    expect(verdict(container).title).toBe('Cost more than keeping the context');
  });

  test('a neutral verdict has no class and no title', () => {
    const versus = versusKeeping({ verdict: 'even', net: 0 });
    const { container } = render(ChatMarker, { entry: compaction(versus) });
    expect(verdict(container).hasAttribute('class')).toBe(false);
    expect(verdict(container).hasAttribute('title')).toBe(false);
    expect(verdict(container).textContent?.trim()).toBe(verdictText(versus));
  });

  test('reads as one line with the parts after a dot, and the note on hover', () => {
    const versus = versusKeeping();
    const { container } = render(ChatMarker, { entry: compaction(versus) });
    const comparison = container.querySelector('div.muted') as HTMLElement;
    expect(comparison.title).toBe(VERSUS_KEEPING_NOTE);
    expect(comparison.textContent?.replace(/\s+/g, ' ').trim()).toBe(
      `vs keeping: ${verdictText(versus)} · ${versusKeepingParts(versus)}`,
    );
  });

  test('sits inside the marker, after the time', () => {
    const { container } = render(ChatMarker, { entry: compaction() });
    const marker = container.querySelector('div.chat-marker') as HTMLElement;
    expect(marker.children[0]?.matches('span.muted')).toBe(true);
    expect(marker.children[1]?.matches('div.muted')).toBe(true);
    expect(marker.children).toHaveLength(2);
  });
});
