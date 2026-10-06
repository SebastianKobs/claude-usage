// The two places markup goes into the page, and the only two: highlight.js's output for a code block, and Claude's
// answers and the user's prompts as markdown (marked's HTML after DOMPurify). Both are attachments on the element that
// holds them. A test counts the places where a string becomes markup in the page's sources. The page's CSP accepts
// markup only from two Trusted Types policies: DOMPurify's own (`dompurify`) and `highlight` below.

import DOMPurify from 'dompurify';
import hljs from 'highlight.js/lib/common';
import { marked } from 'marked';
import type { Attachment } from 'svelte/attachments';
import { fenceLanguage } from './entries';

/** The part of the browser's `trustedTypes` used here; the project's types don't load the global ones. */
interface TrustedTypes {
  createPolicy(name: string, rules: { createHTML: (html: string) => string }): { createHTML(html: string): unknown };
}

const HIGHLIGHT_POLICY = 'highlight';
/** The Trusted Types policies the page creates, which the CSP names: DOMPurify's own, and ours for highlight.js. */
export const TRUSTED_TYPES = ['dompurify', HIGHLIGHT_POLICY] as const;

// Under the CSP's `require-trusted-types-for 'script'` a string can't be put into an element as markup. This policy
// hands highlight.js's output over as it is, which is safe only because that output escapes the text it is given (<,
// >, & and quotes) and adds nothing but spans with classes: a test runs it against the real library. Without Trusted
// Types (a test's DOM) there is no policy and the string goes in as it is.
const highlightPolicy = (globalThis as { trustedTypes?: TrustedTypes }).trustedTypes?.createPolicy(HIGHLIGHT_POLICY, {
  createHTML: (html) => html,
});

/** Whether `language` is one highlight.js knows. */
export function highlightable(language: string | null | undefined): language is string {
  return Boolean(language && hljs.getLanguage(language));
}

/** Puts `code` into `node` highlighted where the language is known, else as text. highlight.js escapes the text it is
 *  given (<, >, & and quotes), and its spans only carry classes. */
function highlightInto(node: HTMLElement, code: string, language: string | null | undefined): void {
  if (highlightable(language)) {
    const { value } = hljs.highlight(code, { language, ignoreIllegals: true });
    node.innerHTML = (highlightPolicy?.createHTML(value) ?? value) as string;
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
let hooked = false;

function setup(): boolean {
  // DOMPurify needs a DOM it can work in; without one the text goes in as text
  if (!DOMPurify.isSupported) return false;
  if (hooked) return true;
  // a task list's checkbox becomes a character, as the sanitized markdown has no form elements
  DOMPurify.addHook('uponSanitizeElement', (node) => {
    if (node instanceof HTMLInputElement && node.getAttribute('type') === 'checkbox') {
      node.replaceWith(document.createTextNode(node.hasAttribute('checked') ? '☑' : '☐'));
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
  hooked = true;
  return true;
}

/** Whether the sanitizer can work here, so text can be shown as markdown. */
export function markdownAvailable(): boolean {
  return setup();
}

/** Claude's text as markdown: marked turns the text into HTML (raw HTML in the text included), DOMPurify keeps only
 *  the allowed tags and attributes, and fenced code is then highlighted like the tool calls. `breaks` keeps single line
 *  breaks, as typed in a prompt. Null where the sanitizer can't work. */
export function renderMarkdown(text: string, breaks: boolean): Node[] | null {
  if (!setup()) return null;
  const container = document.createElement('div');
  // DOMPurify's TrustedHTML, from its own policy, is what the CSP lets in as markup
  container.innerHTML = DOMPurify.sanitize(marked.parse(text, { gfm: true, breaks, async: false }), {
    ALLOWED_TAGS: TAGS,
    ALLOWED_ATTR: ATTRIBUTES,
    ALLOWED_URI_REGEXP: LINKS,
    RETURN_TRUSTED_TYPE: true,
  }) as unknown as string;
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
