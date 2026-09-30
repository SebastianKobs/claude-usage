// The vendored libraries (highlight.js, marked, DOMPurify) as the page loads them, for the tests that need the real
// ones: each is a classic script that sets a global. Goes with 3.31, which imports them from npm.

import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const VENDOR = join(import.meta.dirname, '../../../claude_usage/static/js/vendor');

function run(file: string, name: string): void {
  const source = readFileSync(join(VENDOR, file), 'utf-8');
  // highlight.js declares `var hljs`, which a function's scope would keep; marked and DOMPurify set a global
  const read = `${source}\n;return typeof ${name} === 'undefined' ? undefined : ${name};`;
  const value = new Function(read).call(globalThis);
  (globalThis as Record<string, unknown>)[name] = value ?? (globalThis as Record<string, unknown>)[name];
}

/** Sets `hljs`, `marked` and `DOMPurify` as globals; needs a DOM where DOMPurify can work (jsdom). */
export function loadVendor(): void {
  run('highlight.min.js', 'hljs');
  run('marked.umd.min.js', 'marked');
  run('purify.min.js', 'DOMPurify');
}

/** Takes them away again. */
export function unloadVendor(): void {
  for (const name of ['hljs', 'marked', 'DOMPurify']) delete (globalThis as Record<string, unknown>)[name];
}
