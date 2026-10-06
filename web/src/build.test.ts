// @vitest-environment node
// The build, read from the checkout: the bundle and its licenses built from the files as they are (web/build.json,
// which the build writes), what the bundle holds, asks for and leaves out, and the settings it is built with.
import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, test } from 'vitest';
import svelteConfig from '../svelte.config.js';

const REPO = fileURLToPath(new URL('../..', import.meta.url));
const STALE = 'run make build: the bundle was built from other sources';
// what the build reads besides the modules it bundles: the installed versions and every setting
const SETTINGS = ['package.json', 'package-lock.json', 'tsconfig.json', 'svelte.config.js', 'vite.config.ts'];
const BUNDLE = 'claude_usage/static/js/app.js';
const STYLESHEET = 'claude_usage/static/css/app.css';
// what the bundle holds of other packages, and their licenses
const LICENSES = 'claude_usage/static/js/app-licenses.md';
// what the bundle holds as text, not as resources: the pages Svelte's errors link to (only the prefix: each names its
// error), the namespace names of the elements it creates, the links in highlight.js's and marked's messages, the
// prefix marked puts before a bare www. link, and the Objective-C keyword "@import" in highlight.js's list of them (a
// JavaScript file imports nothing that way)
const BUNDLE_LINKS = [
  'https://svelte.dev/e/',
  'http://www.w3.org/1998/Math/MathML',
  'http://www.w3.org/1999/xhtml',
  'http://www.w3.org/1999/xlink',
  'http://www.w3.org/2000/svg',
  'https://github.com/highlightjs/highlight.js/issues/2277',
  'https://github.com/highlightjs/highlight.js/wiki/security',
  '.@import.',
  'https://github.com/markedjs/marked.',
  '"http://" + ',
];

/** A file of the checkout, by its path from the root. */
function read(path: string): string {
  return readFileSync(join(REPO, path), 'utf-8');
}

/** A file's sha256, as the build records it. */
function digest(path: string): string {
  return createHash('sha256').update(readFileSync(join(REPO, path))).digest('hex');
}

/** What the last build read (sources) and wrote (outputs): each file's sha256 by its path in the checkout. */
function recorded(): { sources: Record<string, string>; outputs: Record<string, string> } {
  expect(existsSync(join(REPO, 'web/build.json')), STALE).toBe(true);
  return JSON.parse(read('web/build.json'));
}

describe('the build', () => {
  test('built the bundle from the files as they are', () => {
    // a source changed or removed since the build, or a bundle committed without its build
    const { sources, outputs } = recorded();
    const stale = Object.entries({ ...sources, ...outputs })
      .filter(([path, sha]) => !existsSync(join(REPO, path)) || digest(path) !== sha)
      .map(([path]) => path);
    expect(stale, STALE).toEqual([]);
  });

  test('records its settings and its entry', () => {
    const wanted = [...SETTINGS.map((name) => `web/${name}`), 'web/src/main.ts'];
    expect(Object.keys(recorded().sources)).toEqual(expect.arrayContaining(wanted));
  });

  test('records only our own sources', () => {
    // the lockfile stands for what node_modules holds
    const outside = Object.keys(recorded().sources).filter(
      (path) => !path.startsWith('web/') || path.split('/').includes('node_modules'),
    );
    expect(outside).toEqual([]);
  });

  test('records the bundle, its licenses and its stylesheet', () => {
    expect(Object.keys(recorded().outputs)).toEqual(expect.arrayContaining([BUNDLE, LICENSES, STYLESHEET]));
  });
});

describe('the bundle', () => {
  test('ships the licenses of what it holds', () => {
    const licenses = read(LICENSES);
    for (const name of ['svelte', 'marked', 'dompurify', 'highlight.js']) expect(licenses).toContain(`## ${name} - `);
  });

  test('holds the markdown renderer, the sanitizer and the highlighter', () => {
    const bundle = read(BUNDLE);
    for (const marker of ['markedjs/marked', 'DOMPurify', 'hljs-']) expect(bundle).toContain(marker);
  });

  test('creates only the Trusted Types policies the contract names, which the CSP does', () => {
    // fragments: 'tree' builds templates without one of Svelte's own; DOMPurify's and ours for highlight.js's output
    const bundle = read(BUNDLE);
    const { trusted_types: policies } = JSON.parse(read('web/contract.json')) as { trusted_types: string[] };
    expect(bundle.match(/createPolicy\(/g)).toHaveLength(policies.length);
    for (const name of policies) expect(bundle).toContain(`"${name}"`);
  });

  test('asks for the API’s answers', () => {
    const bundle = read(BUNDLE);
    for (const endpoint of ['/api/live', '/api/summary', '/api/session/']) expect(bundle).toContain(endpoint);
  });

  test('loads nothing from elsewhere: every link it holds is text', () => {
    // the CSP would block any load anyway
    const bundle = BUNDLE_LINKS.reduce((text, link) => text.replaceAll(link, ''), read(BUNDLE));
    for (const external of ['https://', 'http://', '@import']) expect(bundle).not.toContain(external);
  });
});

describe('the stylesheet', () => {
  test('loads nothing from elsewhere', () => {
    const stylesheet = read(STYLESHEET);
    for (const external of ['https://', 'http://', '@import', 'url(']) expect(stylesheet).not.toContain(external);
  });
});

describe('the settings', () => {
  test('let the compiler neither inject CSS nor build templates from HTML', () => {
    // injected CSS needs a <style> the CSP refuses, html fragments a Trusted Types policy of Svelte's own that it
    // doesn't name
    expect(svelteConfig.compilerOptions?.css).toBeUndefined();
    expect(svelteConfig.compilerOptions?.fragments).toBe('tree');
  });

  test('pin exact versions, of dev dependencies only', () => {
    // the lockfile pins what is installed, the exact versions what the plan checked to fit together; nothing is
    // installed to run the page: the libraries the bundle holds are built in
    const settings = JSON.parse(read('web/package.json')) as Record<string, Record<string, string>>;
    const ranges = Object.entries(settings.devDependencies ?? {}).filter(
      ([, version]) => !/^\d+\.\d+\.\d+$/.test(version),
    );
    expect(ranges).toEqual([]);
    expect(settings).not.toHaveProperty('dependencies');
  });
});
