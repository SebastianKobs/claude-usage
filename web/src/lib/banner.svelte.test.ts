import { flushSync } from 'svelte';
import { expect, test } from 'vitest';
import { BannerMessages } from './banner.svelte';

test('a message shows once, however many sources say it', () => {
  const messages = new BannerMessages();
  messages.show('live', 'refused');
  messages.show('summary', 'refused');
  messages.show('scan', 'Scan: one file');
  expect(messages.text).toBe('refused\nScan: one file');
});

test("one source's success leaves another's failure", () => {
  const messages = new BannerMessages();
  messages.show('live', 'live failed');
  messages.show('summary', 'summary failed');
  messages.show('live', '');
  expect(messages.text).toBe('summary failed');
});

test('what reads the text follows it', () => {
  const seen: string[] = [];
  const cleanup = $effect.root(() => {
    const messages = new BannerMessages();
    $effect(() => {
      seen.push(messages.text);
    });
    flushSync();
    messages.show('live', 'down');
    flushSync();
    messages.show('live', '');
    flushSync();
  });
  cleanup();
  expect(seen).toEqual(['', 'down', '']);
});
