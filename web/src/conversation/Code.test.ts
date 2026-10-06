// @vitest-environment jsdom
import { render } from '@testing-library/svelte';
import { describe, expect, test } from 'vitest';
import Code from './Code.svelte';

describe('without a language highlight.js knows', () => {
  test('a block is text in a pre', () => {
    const { container } = render(Code, { code: '{"a": 1}', language: 'klingon' });
    const code = container.querySelector('pre.code > code.hljs');
    expect(code?.textContent).toBe('{"a": 1}');
    expect(code?.children).toHaveLength(0);
  });
});

describe('with a language highlight.js knows', () => {
  test('a block is a pre around the highlighted code', () => {
    const { container } = render(Code, { code: 'const a = 1;', language: 'javascript' });
    const code = container.querySelector('pre.code > code.hljs');
    expect(code?.textContent).toBe('const a = 1;');
    expect(code?.querySelector('span.hljs-keyword')?.textContent).toBe('const');
  });

  test('inline is the code element alone', () => {
    const { container } = render(Code, { code: 'const a = 1;', language: 'javascript', inline: true });
    expect(container.querySelector('pre')).toBeNull();
    const code = container.firstElementChild;
    expect(code?.tagName).toBe('CODE');
    expect(code?.className).toBe('hljs');
    expect(code?.querySelector('span.hljs-keyword')).not.toBeNull();
  });

  test('a language highlight.js lacks is shown as text, markup included', () => {
    const { container } = render(Code, { code: '<b>x</b>', language: 'klingon' });
    const code = container.querySelector('code.hljs');
    expect(code?.textContent).toBe('<b>x</b>');
    expect(code?.children).toHaveLength(0);
  });

  test('no language is text too', () => {
    const { container } = render(Code, { code: '<b>x</b>' });
    const code = container.querySelector('code.hljs');
    expect(code?.textContent).toBe('<b>x</b>');
    expect(code?.children).toHaveLength(0);
  });

  test('a new code is put in again', async () => {
    const { container, rerender } = render(Code, { code: 'a', language: 'javascript' });
    await rerender({ code: 'const b = 2;', language: 'javascript' });
    expect(container.querySelector('code')?.textContent).toBe('const b = 2;');
    expect(container.querySelector('span.hljs-keyword')).not.toBeNull();
  });
});
