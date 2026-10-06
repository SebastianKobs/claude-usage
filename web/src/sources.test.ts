// @vitest-environment node
// Rules over the page's own sources that no test of a single component sees: what the CSP refuses.
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, test } from 'vitest';

const SRC = fileURLToPath(new URL('.', import.meta.url));

/** The page's files with this ending, by their path under src/, sorted. */
function sources(ending: string): string[] {
  return readdirSync(SRC, { recursive: true, encoding: 'utf-8' })
    .filter((path) => path.endsWith(ending))
    .sort();
}

function read(path: string): string {
  return readFileSync(join(SRC, path), 'utf-8');
}

/** A component's template: its text without the script and style blocks. */
function markup(path: string): string {
  return read(path).replace(/<(script|style)\b[\s\S]*?<\/\1>/g, '');
}

describe('no component', () => {
  test('injects its CSS', () => {
    // the CSP allows no <style> the page adds, and a custom element's CSS is always injected
    const injecting = sources('.svelte').filter((path) => {
      const options = read(path).match(/<svelte:options\b[^>]*>/g)?.join(' ') ?? '';
      return options.includes('css=') || options.includes('customElement');
    });
    expect(injecting).toEqual([]);
  });

  test('writes a style attribute', () => {
    // the CSP allows no style attribute: style: sets a style through the CSSOM, while a style attribute and a
    // component's --x prop, which wraps the component in an element with one, need them
    const styled = sources('.svelte').filter(
      (path) => /\sstyle\s*=/.test(markup(path)) || /<[A-Z][\w.]*\b[^>]*\s--[\w-]+\s*=/.test(markup(path)),
    );
    expect(styled).toEqual([]);
  });
});
