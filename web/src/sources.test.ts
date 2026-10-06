// @vitest-environment node
// Rules over the page's own sources that no test of a single component sees: what the CSP refuses, a word the page
// avoids, and the gimmick themes' wording of every label it themes.
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, test } from 'vitest';
import { themedLabels } from './app/themes';

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

/** The page's own modules and components, without the tests. */
function pageSources(): string[] {
  return [...sources('.ts'), ...sources('.svelte')].filter((path) => !path.includes('.test.'));
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

describe('markup', () => {
  test('goes into the page only by the two sanitized paths in markup.ts', () => {
    const places = pageSources()
      .map((path): [string, number] => [path, read(path).match(/\binnerHTML\b|\{@html\b/g)?.length ?? 0])
      .filter(([, count]) => count > 0);
    expect(places).toEqual([['conversation/markup.ts', 2]]);
  });
});

describe('the words', () => {
  test('call an amount paid once a cost, never "one-time"', () => {
    // "one-time $0.12" read like a saving; the page says "costs $0.12 once"
    const strings = pageSources().flatMap((path) => read(path).match(/'[^'\n]*'|"[^"\n]*"|`[^`]*`/g) ?? []);
    expect(strings.filter((text) => /one-time/i.test(text))).toEqual([]);
  });
});

const GIMMICK_THEMES = ['hacker', 'startup', 'rgb'];

/** The labels the page themes: hype() and StatTile's label and themed note in the components, the tiles' parts in
 *  tiles.ts, and the by-model chart's title per time unit. */
function themedInPage(): Set<string> {
  const found = new Set<string>();
  for (const path of sources('.svelte')) {
    const text = read(path);
    for (const pattern of [/\bhype\('([^']+)'\)/g, /\bnote="([^"]+)" themedNote/g, /<StatTile\s+label="([^"]+)"/g]) {
      for (const match of text.matchAll(pattern)) found.add(match[1] ?? '');
    }
  }
  for (const match of read('tiles/tiles.ts').matchAll(/\blabel: '([^']+)'/g)) found.add(match[1] ?? '');
  return found;
}

describe('a gimmick theme', () => {
  // a label it misses shows plain, a wording no label uses is dead
  test('finds the labels the page themes', () => {
    expect([...themedInPage()]).toEqual(expect.arrayContaining(['Estimated cost', 'Sessions', 'Rate limits']));
  });

  test.each(GIMMICK_THEMES)('%s words every label the page themes', (theme) => {
    const worded = new Set(themedLabels(theme));
    expect([...themedInPage()].filter((label) => !worded.has(label)).sort()).toEqual([]);
  });

  test.each(GIMMICK_THEMES)('%s words only labels the page has', (theme) => {
    // a label can also reach hype() through a variable: then it is a string elsewhere in the page's sources
    const elsewhere = pageSources()
      .filter((path) => path !== 'app/themes.ts')
      .map(read)
      .join('');
    const labels = themedInPage();
    const dead = themedLabels(theme).filter((label) => !labels.has(label) && !elsewhere.includes(`'${label}'`));
    expect(dead.sort()).toEqual([]);
  });
});
