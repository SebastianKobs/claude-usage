// The two places markup goes into the page, and the only two: highlight.js's output for a code block, and Claude's
// answers and the user's prompts as markdown (marked's HTML after DOMPurify). Both libraries are still the vendored
// classic scripts, found as globals, until 3.31 imports them; without them the text goes in as text. A test counts the
// places where a string becomes markup in the page's sources.

import type { Attachment } from 'svelte/attachments';
import { fenceLanguage } from './entries';

interface Highlighter {
  getLanguage(name: string): unknown;
  highlight(code: string, options: { language: string; ignoreIllegals: boolean }): { value: string };
}

interface Sanitizer {
  isSupported: boolean;
  addHook(name: string, hook: (node: Element) => void): void;
  sanitize(html: string, options: Record<string, unknown>): string;
}

interface Markdown {
  parse(text: string, options: { gfm: boolean; breaks: boolean; async: false }): string;
}

interface Libraries {
  hljs?: Highlighter;
  DOMPurify?: Sanitizer;
  marked?: Markdown;
}

function libraries(): Libraries {
  return globalThis as Libraries;
}

/** Whether `language` is one highlight.js knows. */
export function highlightable(language: string | null | undefined): language is string {
  const hljs = libraries().hljs;
  return Boolean(language && hljs && hljs.getLanguage(language));
}

/** Puts `code` into `node` highlighted where the language is known, else as text. highlight.js escapes the text it is
 *  given (<, >, & and quotes), and its spans only carry classes. */
function highlightInto(node: HTMLElement, code: string, language: string | null | undefined): void {
  const hljs = libraries().hljs;
  if (hljs && highlightable(language)) {
    node.innerHTML = hljs.highlight(code, { language, ignoreIllegals: true }).value;
  } else {
    node.textContent = code;
  }
}

/** An attachment that highlights `code` in the element it is on. */
export function highlight(code: string, language: string | null | undefined): Attachment<HTMLElement> {
  return (node) => {
    highlightInto(node, code, language);
  };
}

// What the sanitized markdown may contain: the elements marked produces, no images (the page loads nothing), no styles
// or event attributes, and links only to http, https and mailto
const TAGS = [
  'p', 'br', 'strong', 'em', 'del', 'code', 'pre', 'ul', 'ol', 'li', 'blockquote', 'hr', 'a', 'h1', 'h2', 'h3', 'h4',
  'h5', 'h6', 'table', 'thead', 'tbody', 'tr', 'th', 'td',
];
const ATTRIBUTES = ['href', 'title', 'class', 'align', 'start'];
// classes only name a fenced block's language: others could dress transcript text up as the page's own notes
const LANGUAGE_CLASS = /^language-[\w+-]+$/;
const LINKS = /^(?:https?|mailto):/i;
let hooked: Sanitizer | null = null;

function setup(): boolean {
  const { DOMPurify, marked } = libraries();
  if (!marked || !DOMPurify || !DOMPurify.isSupported) return false;
  if (hooked === DOMPurify) return true;
  // a task list's checkbox becomes a character, as the sanitized markdown has no form elements
  DOMPurify.addHook('uponSanitizeElement', (node) => {
    if (node.tagName === 'INPUT' && node.getAttribute('type') === 'checkbox') {
      node.replaceWith(node.ownerDocument.createTextNode(node.hasAttribute('checked') ? '☑' : '☐'));
    }
  });
  // links open in a new tab and pass nothing on
  DOMPurify.addHook('afterSanitizeAttributes', (node) => {
    const classes = node.getAttribute('class');
    if (classes !== null && !(node.tagName === 'CODE' && LANGUAGE_CLASS.test(classes))) {
      node.removeAttribute('class');
    }
    if (node.tagName === 'A') {
      node.setAttribute('target', '_blank');
      node.setAttribute('rel', 'noopener noreferrer');
    }
  });
  hooked = DOMPurify;
  return true;
}

/** Whether the libraries that turn text into markdown are there. */
export function markdownAvailable(): boolean {
  return setup();
}

/** Claude's text as markdown: marked turns the text into HTML (raw HTML in the text included), DOMPurify keeps only
 *  the allowed tags and attributes, and fenced code is then highlighted like the tool calls. `breaks` keeps single line
 *  breaks, as typed in a prompt. Null without the libraries. */
export function renderMarkdown(text: string, breaks: boolean): Node[] | null {
  if (!setup()) return null;
  const { DOMPurify, marked } = libraries();
  if (!DOMPurify || !marked) return null;
  const container = document.createElement('div');
  container.innerHTML = DOMPurify.sanitize(marked.parse(text, { gfm: true, breaks, async: false }), {
    ALLOWED_TAGS: TAGS,
    ALLOWED_ATTR: ATTRIBUTES,
    ALLOWED_URI_REGEXP: LINKS,
  });
  for (const code of container.querySelectorAll('pre > code')) {
    const name = code.className.match(/\blanguage-([\w+-]+)/)?.[1];
    const block = document.createElement('code');
    block.className = 'hljs';
    highlightInto(block, code.textContent ?? '', fenceLanguage(name));
    const pre = document.createElement('pre');
    pre.className = 'code';
    pre.append(block);
    code.parentElement?.replaceWith(pre);
  }
  return [...container.childNodes];
}

/** An attachment that puts `text` as markdown into the element it is on. */
export function markdown(text: string, breaks = false): Attachment<HTMLElement> {
  return (node) => {
    node.replaceChildren(...(renderMarkdown(text, breaks) ?? []));
  };
}
