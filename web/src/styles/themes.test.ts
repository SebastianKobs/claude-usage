// @vitest-environment node
// The stylesheets' themes: every variable the page reads is defined in every theme, dark is the same picked or
// automatic, the gimmick themes take its palette, and the gain and loss tones have a text color in light and dark.
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, test } from 'vitest';

const SRC = fileURLToPath(new URL('..', import.meta.url));
const GIMMICK_THEMES = ['hacker', 'startup', 'rgb'];
// variables a gimmick theme defines for its own file only
const PRIVATE_VARIABLE = /^--(term|flex|rgb)-[a-z]+$/;

/** A file under src/, by its path there. */
function read(path: string): string {
  return readFileSync(join(SRC, path), 'utf-8');
}

/** The page's files with one of these endings, by their path under src/, without the tests. */
function sources(...endings: string[]): string[] {
  return readdirSync(SRC, { recursive: true, encoding: 'utf-8' })
    .filter((path) => endings.some((ending) => path.endsWith(ending)) && !path.includes('.test.'))
    .sort();
}

/** The custom properties of the first rule whose selector starts with this one, name → value. */
function customProperties(css: string, selector: string): Record<string, string> {
  const start = css.indexOf(selector);
  expect(start, `no rule for ${selector}`).toBeGreaterThan(-1);
  const block = css.slice(css.indexOf('{', start) + 1, css.indexOf('}', start));
  return Object.fromEntries([...block.matchAll(/(--[\w-]+):\s*([^;]+);/g)].map((match) => [match[1], match[2]]));
}

describe('the themes', () => {
  test('define every variable the stylesheets and the page read', () => {
    // light.css and common.css apply in every theme; the others only override
    const defaults = new Set(
      [read('styles/themes/light.css'), read('styles/common.css')].flatMap((css) =>
        [...css.matchAll(/(--[\w-]+):/g)].map((match) => match[1]),
      ),
    );
    const used = new Set(
      sources('.css', '.ts', '.svelte')
        .flatMap((path) => [...read(path).matchAll(/var\((--[\w-]+)/g)].map((match) => match[1] ?? ''))
        .filter((name) => !name.endsWith('-')),
    );
    // a --series-N or --shade-step-N built in a script counts for every slot
    for (const kind of ['series', 'shade-step']) {
      for (const slot of [1, 2, 3, 4, 5, 6, 7, 8, 'other']) used.add(`--${kind}-${slot}`);
    }
    const missing = [...used].filter((name) => !defaults.has(name) && !PRIVATE_VARIABLE.test(name));
    expect(missing.sort()).toEqual([]);
  });

  test('give dark the same palette whether picked or automatic', () => {
    const dark = read('styles/themes/dark.css');
    expect(customProperties(dark, ':root:where(:not([data-theme="light"]))')).toEqual(
      customProperties(dark, ':root[data-theme="dark"]'),
    );
  });

  test.each(GIMMICK_THEMES)('give %s the dark palette', (theme) => {
    const selector = read('styles/themes/dark.css').match(/(:root\[data-theme="dark"\][^{]*)\{/)?.[1];
    expect(selector).toContain(`:root[data-theme="${theme}"]`);
  });

  test.each(['light', 'dark'])('give the gain and loss tones a text color in %s', (theme) => {
    const css = read(`styles/themes/${theme}.css`);
    expect(css).toContain('--gain-text:');
    expect(css).toContain('--loss-text:');
  });
});
