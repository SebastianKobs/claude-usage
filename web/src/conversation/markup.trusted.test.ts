// @vitest-environment jsdom
// The page's CSP says `require-trusted-types-for 'script'; trusted-types dompurify highlight`, so a string assigned to
// innerHTML throws and a policy under another name can't be created. This runs the real libraries against a stand-in
// for that enforcement, installed before `markup` is imported, as DOMPurify looks for the browser's `trustedTypes`
// when it loads (and a node package is loaded once per file, whatever `vi.resetModules` says).
import hljs from 'highlight.js/lib/common';
import { afterAll, beforeAll, describe, expect, test, vi } from 'vitest';

/** What a policy's createHTML returns: a class of its own, not a string, as in a browser. */
class FakeTrustedHTML {
  readonly html: string;
  constructor(html: string) {
    this.html = html;
  }
  toString(): string {
    return this.html;
  }
}

const ALLOWED = ['dompurify', 'highlight'];
const innerHTML = Object.getOwnPropertyDescriptor(Element.prototype, 'innerHTML') as PropertyDescriptor;
const created: string[] = [];
let page: typeof import('./markup');

beforeAll(async () => {
  vi.stubGlobal('trustedTypes', {
    createPolicy(name: string, rules: { createHTML: (html: string) => string }) {
      if (!ALLOWED.includes(name) || created.includes(name)) throw new TypeError(`policy ${name} is refused`);
      created.push(name);
      return { name, createHTML: (html: string) => new FakeTrustedHTML(rules.createHTML(html)) };
    },
  });
  // `require-trusted-types-for 'script'`: a plain string is no longer accepted
  Object.defineProperty(Element.prototype, 'innerHTML', {
    configurable: true,
    get: innerHTML.get,
    set(value: unknown) {
      if (!(value instanceof FakeTrustedHTML)) throw new TypeError('This assignment requires a TrustedHTML');
      innerHTML.set?.call(this, value.html);
    },
  });
  page = await import('./markup');
});

afterAll(() => {
  Object.defineProperty(Element.prototype, 'innerHTML', innerHTML);
  vi.unstubAllGlobals();
});

describe('under Trusted Types', () => {
  test('highlighted code goes in through the policy named highlight', () => {
    const node = document.createElement('code');
    page.highlight('const a = 1;', 'javascript')(node);
    expect(node.querySelector('.hljs-keyword')?.textContent).toBe('const');
    expect(created).toContain('highlight');
  });

  test('the policy hands highlight.js output over as it is, adding nothing', () => {
    const node = document.createElement('code');
    page.highlight('const a = 1;', 'javascript')(node);
    expect(node.innerHTML).toBe(hljs.highlight('const a = 1;', { language: 'javascript' }).value);
  });

  test('markdown goes in as what DOMPurify sanitized, through its own policy', () => {
    const node = document.createElement('div');
    page.markdown('**bold** <img src=x onerror=alert(1)>')(node);
    expect(node.querySelector('strong')?.textContent).toBe('bold');
    expect(node.querySelector('img')).toBeNull();
    expect(created).toContain('dompurify');
  });

  test('a fenced block in markdown is highlighted too', () => {
    const node = document.createElement('div');
    page.markdown('```js\nconst a = 1;\n```')(node);
    expect(node.querySelector('pre.code > code.hljs .hljs-keyword')?.textContent).toBe('const');
  });

  test('text in a language highlight.js lacks still goes in as text', () => {
    const node = document.createElement('code');
    page.highlight('<b>x</b>', 'klingon')(node);
    expect(node.textContent).toBe('<b>x</b>');
  });

  test('a string assigned to innerHTML is refused, so the stand-in enforces what the CSP does', () => {
    expect(() => {
      document.createElement('div').innerHTML = '<b>x</b>';
    }).toThrow(TypeError);
  });

  test('the two policies are the only ones created', () => {
    page.highlight('1', 'javascript')(document.createElement('code'));
    page.markdown('x')(document.createElement('div'));
    expect([...created].sort()).toEqual(ALLOWED);
  });
});
