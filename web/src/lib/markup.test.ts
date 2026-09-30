// @vitest-environment jsdom
// DOMPurify's README calls happy-dom not safe, so the sanitizing is checked under jsdom, with the real libraries.
import DOMPurify from 'dompurify';
import { afterAll, beforeAll, describe, expect, test, vi } from 'vitest';
import { highlight, highlightable, markdown, markdownAvailable, renderMarkdown } from './markup';
import { disableSanitizer, enableSanitizer } from './sanitizer.testing';

function rendered(text: string, breaks = false): HTMLElement {
  const host = document.createElement('div');
  markdown(text, breaks)(host);
  return host;
}

describe('where DOMPurify cannot work', () => {
  beforeAll(disableSanitizer);
  afterAll(enableSanitizer);

  test('there is no markdown', () => {
    expect(markdownAvailable()).toBe(false);
    expect(renderMarkdown('# hi', false)).toBeNull();
  });

  test('markdown leaves the element empty', () => {
    const host = rendered('# hi');
    expect(host.childNodes).toHaveLength(0);
  });
});

describe('the libraries', () => {
  test('knows the languages highlight.js has, and not others', () => {
    expect(highlightable('python')).toBe(true);
    expect(highlightable('klingon')).toBe(false);
    expect(highlightable(null)).toBe(false);
  });

  test('code in a language it does not know goes in as text', () => {
    const node = document.createElement('code');
    highlight('a < b', 'klingon')(node);
    expect(node.textContent).toBe('a < b');
    expect(node.children).toHaveLength(0);
  });

  test('highlights code into spans that only carry classes', () => {
    const node = document.createElement('code');
    highlight('const a = "x";', 'javascript')(node);
    expect(node.querySelector('span.hljs-keyword')?.textContent).toBe('const');
    for (const span of node.querySelectorAll('span')) expect(span.getAttributeNames()).toEqual(['class']);
  });

  test('highlights what is illegal in its language as far as it can', () => {
    const node = document.createElement('code');
    highlight('{"a": <oops', 'json')(node);
    expect(node.querySelector('.hljs-attr')?.textContent).toBe('"a"');
    expect(node.textContent).toBe('{"a": <oops');
  });

  test('escapes what it highlights', () => {
    const node = document.createElement('code');
    highlight('<img src=x onerror=alert(1)> & "q"', 'xml')(node);
    expect(node.querySelector('img')).toBeNull();
    expect(node.textContent).toBe('<img src=x onerror=alert(1)> & "q"');
  });

  test('code in a language highlight.js lacks goes in as text', () => {
    const node = document.createElement('code');
    highlight('<b>x</b>', 'klingon')(node);
    expect(node.querySelector('b')).toBeNull();
    expect(node.textContent).toBe('<b>x</b>');
  });

  test('renders markdown: emphasis, lists, headings, tables, code', () => {
    const host = rendered('# T\n\n**bold** and `code`\n\n- a\n- b\n\n| x | y |\n|---|---|\n| 1 | 2 |');
    expect(host.querySelector('h1')?.textContent).toBe('T');
    expect(host.querySelector('strong')?.textContent).toBe('bold');
    expect(host.querySelectorAll('li')).toHaveLength(2);
    expect(host.querySelectorAll('td')).toHaveLength(2);
    expect(host.querySelector('p code')?.textContent).toBe('code');
  });

  test('keeps single line breaks only where asked', () => {
    expect(rendered('one\ntwo').querySelector('br')).toBeNull();
    expect(rendered('one\ntwo', true).querySelector('br')).not.toBeNull();
  });

  test('highlights a fenced block by its language, in the code style of the tool calls', () => {
    const host = rendered('```py\nprint(1)\n```');
    const block = host.querySelector('pre.code > code.hljs');
    expect(block).not.toBeNull();
    expect(block?.querySelector('.hljs-built_in, .hljs-title, .hljs-number')).not.toBeNull();
    expect(block?.textContent).toBe('print(1)\n');
  });

  test('shows a fenced block in an unknown language as text', () => {
    const host = rendered('```klingon\n<b>x</b>\n```');
    expect(host.querySelector('pre.code > code.hljs b')).toBeNull();
    expect(host.querySelector('pre.code > code.hljs')?.textContent).toBe('<b>x</b>\n');
  });

  test('drops scripts, event attributes, images, styles and forms', () => {
    const host = rendered(
      '<script>window.x=1</script><img src=x onerror=alert(1)><p onclick="x()" style="color:red">p</p>' +
        '<style>p{color:red}</style><form action="/x"><input name=a></form><iframe src="/x"></iframe>',
    );
    expect(host.querySelector('script, img, style, form, input, iframe')).toBeNull();
    const paragraph = host.querySelector('p');
    expect(paragraph?.getAttributeNames()).toEqual([]);
  });

  test('keeps links to http, https and mailto only, opened without passing anything on', () => {
    const host = rendered('[a](https://x.test) [b](mailto:a@x.test) [c](javascript:alert(1)) [d](data:text/html,x)');
    const links = [...host.querySelectorAll('a')];
    expect(links.map((link) => link.getAttribute('href'))).toEqual(['https://x.test', 'mailto:a@x.test', null, null]);
    for (const link of links) {
      expect(link.getAttribute('target')).toBe('_blank');
      expect(link.getAttribute('rel')).toBe('noopener noreferrer');
    }
  });

  test('keeps a class only as the language of a code element', () => {
    const host = rendered('<p class="chat-marker">fake note</p><span class="verdict-gain">x</span>\n\n```js\n1\n```');
    expect(host.querySelector('.chat-marker, .verdict-gain')).toBeNull();
    expect(host.querySelector('p')?.hasAttribute('class')).toBe(false);
  });

  test('drops a language class anywhere but on code, and one with more than a language in it', () => {
    const host = rendered(
      '<p class="language-js">p</p> <code class="language-js chat-marker">a</code> <code class="language-">b</code>' +
        ' <code class="x-language-js">c</code>',
    );
    expect(host.querySelector('p')?.hasAttribute('class')).toBe(false);
    expect([...host.querySelectorAll('code')].map((code) => code.getAttribute('class'))).toEqual([null, null, null]);
  });

  test('keeps a class on code only where it names a language', () => {
    const host = rendered('<code class="language-js">a</code> <code class="chat-marker">b</code>');
    const codes = [...host.querySelectorAll('code')];
    expect(codes.map((code) => code.getAttribute('class'))).toEqual(['language-js', null]);
  });

  test('takes a fence for a file suffix where it is one', () => {
    const host = rendered('```cfg\n[section]\nkey=1\n```');
    expect(host.querySelector('pre.code > code.hljs .hljs-section')?.textContent).toBe('[section]');
  });

  test('leaves no trace of a form field, only a task list has a box', () => {
    const host = rendered('<input type="text" name="a"> <input type="checkbox" checked> text');
    expect(host.querySelector('input')).toBeNull();
    expect(host.textContent).not.toContain('☐');
  });

  test('turns a task list checkbox into a character', () => {
    const host = rendered('- [x] done\n- [ ] todo');
    expect(host.querySelector('input')).toBeNull();
    expect(host.textContent).toContain('☑ done');
    expect(host.textContent).toContain('☐ todo');
  });

  test('replaces what the element held', () => {
    const host = rendered('first');
    markdown('second')(host);
    expect(host.textContent?.trim()).toBe('second');
  });

  test('is available once DOMPurify can work again', () => {
    disableSanitizer();
    expect(markdownAvailable()).toBe(false);
    enableSanitizer();
    expect(markdownAvailable()).toBe(true);
  });

  test('hooks DOMPurify once, however often markdown is rendered', () => {
    expect(markdownAvailable()).toBe(true);
    const hooks = vi.spyOn(DOMPurify, 'addHook');
    const host = rendered('[c](javascript:alert(1)) <img src=x onerror=alert(1)> <p class="x">p</p>');
    rendered('again');
    expect(hooks).not.toHaveBeenCalled();
    hooks.mockRestore();
    expect(host.querySelector('img')).toBeNull();
    expect(host.querySelector('a')?.hasAttribute('href')).toBe(false);
    expect(host.querySelector('p')?.hasAttribute('class')).toBe(false);
  });
});
