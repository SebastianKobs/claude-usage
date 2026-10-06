// @vitest-environment jsdom
// DOMPurify's README calls happy-dom not safe, so the sanitizing is checked under jsdom, with the real libraries.
import { render } from '@testing-library/svelte';
import { afterAll, beforeAll, describe, expect, test } from 'vitest';
import { disableSanitizer, enableSanitizer } from './sanitizer.testing';
import Markdown from './Markdown.svelte';

// the first describe runs where DOMPurify can't work, the second with the real libraries
describe('where DOMPurify cannot work', () => {
  beforeAll(disableSanitizer);
  afterAll(enableSanitizer);

  test('the text is shown as text', () => {
    const { container } = render(Markdown, { text: '**not bold** <b>x</b>' });
    const node = container.querySelector('div.chat-markdown.chat-text');
    expect(node?.textContent).toBe('**not bold** <b>x</b>');
    expect(node?.children).toHaveLength(0);
  });
});

describe('with the libraries', () => {
  test('bold becomes strong, in a markdown block that is not the text fallback', () => {
    const { container } = render(Markdown, { text: 'a **bold** word' });
    const node = container.querySelector('div.chat-markdown');
    expect(node?.classList.contains('chat-text')).toBe(false);
    expect(node?.querySelector('strong')?.textContent).toBe('bold');
  });

  test('a script and an event attribute in the text are dropped', () => {
    const { container } = render(Markdown, { text: 'hi <script>alert(1)</script> <img src=x onerror=alert(2)> there' });
    expect(container.querySelector('script')).toBeNull();
    expect(container.querySelector('img')).toBeNull();
    expect(container.innerHTML).not.toContain('onerror');
    expect(container.textContent).toContain('hi');
  });

  test('a link opens in a new tab and a javascript one loses its address', () => {
    const { container } = render(Markdown, { text: '[ok](https://example.com) [bad](javascript:alert(1))' });
    const [ok, bad] = [...container.querySelectorAll('a')];
    expect(ok?.getAttribute('target')).toBe('_blank');
    expect(ok?.getAttribute('rel')).toBe('noopener noreferrer');
    expect(bad?.getAttribute('href')).toBeNull();
  });

  test('a single line break becomes a line break only with breaks', () => {
    const plain = render(Markdown, { text: 'one\ntwo' });
    expect(plain.container.querySelector('br')).toBeNull();
    plain.unmount();
    const kept = render(Markdown, { text: 'one\ntwo', breaks: true });
    expect(kept.container.querySelector('br')).not.toBeNull();
  });

  test('a fenced block is highlighted code', () => {
    const { container } = render(Markdown, { text: '```js\nconst a = 1;\n```' });
    expect(container.querySelector('pre.code > code.hljs span.hljs-keyword')?.textContent).toBe('const');
  });

  test('a new text is put in again', async () => {
    const { container, rerender } = render(Markdown, { text: 'a **b**' });
    await rerender({ text: 'an *c*' });
    expect(container.querySelector('strong')).toBeNull();
    expect(container.querySelector('em')?.textContent).toBe('c');
  });
});
