import { createHash } from 'node:crypto';
import { existsSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, isAbsolute, join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig, type Plugin } from 'vite';

const WEB = dirname(fileURLToPath(import.meta.url));
const REPO = dirname(WEB);
const MANIFEST = join(WEB, 'build.json');
// What the build reads besides the modules it bundles: the installed versions and every setting.
const SETTINGS = ['package.json', 'package-lock.json', 'tsconfig.json', 'svelte.config.js', 'vite.config.ts'];

/** A file's sha256 in hex. */
function digest(path: string): string {
  return createHash('sha256').update(readFileSync(path)).digest('hex');
}

/** Each file's sha256 by its path from the checkout's root, sorted. */
function digests(paths: Iterable<string>): Record<string, string> {
  const entries = [...paths].map((path): [string, string] => [relative(REPO, path).split(sep).join('/'), digest(path)]);
  return Object.fromEntries(entries.sort(([left], [right]) => (left < right ? -1 : 1)));
}

/** Whether a path lies inside a folder. */
function within(folder: string, path: string): boolean {
  const inside = relative(folder, path);
  return inside !== '' && !inside.startsWith('..') && !isAbsolute(inside);
}

/** Whether a module is one of our sources: under web/, not installed. */
function ours(path: string): boolean {
  return within(WEB, path) && !relative(WEB, path).split(/[/\\]/).includes('node_modules');
}

/** Removes what the last build wrote into the static folder and this one didn't, since it isn't emptied. */
function removeLeftovers(outDir: string, outputs: Record<string, string>): void {
  if (!existsSync(MANIFEST)) return;
  const last: { outputs: Record<string, string> } = JSON.parse(readFileSync(MANIFEST, 'utf-8'));
  for (const path of Object.keys(last.outputs)) {
    const file = join(REPO, path);
    if (!(path in outputs) && within(outDir, file)) rmSync(file, { force: true });
  }
}

/**
 * Writes web/build.json: the sha256 of every source under web/ the build read and of every file it wrote.
 * src/build.test.ts compares them with the checkout, so a bundle built from other sources can't slip into a commit.
 */
function manifest(): Plugin {
  return {
    name: 'build-manifest',
    apply: 'build',
    writeBundle(options, bundle) {
      const read = new Set(SETTINGS.map((name) => join(WEB, name)));
      for (const id of this.getModuleIds()) {
        const path = id.split('?')[0] ?? id; // a component's styles are its own file with a query
        if (ours(path)) read.add(path);
      }
      if (!options.dir) throw new Error('the build writes no folder');
      const outDir = options.dir;
      const written = Object.keys(bundle).map((name) => join(outDir, name));
      const manifest = { sources: digests(read), outputs: digests(written) };
      removeLeftovers(outDir, manifest.outputs);
      writeFileSync(MANIFEST, `${JSON.stringify(manifest, null, 2)}\n`);
    },
  };
}

// One ES module without hashes, and its CSS as one file, into the package's static folder, which the
// Python server serves from a fixed list: no chunks, no source maps, no public folder. The licenses file isn't
// served (the server serves only scripts and stylesheets) but ships with the package.
export default defineConfig({
  plugins: [svelte(), manifest()],
  build: {
    outDir: '../claude_usage/static',
    emptyOutDir: false, // the folder holds the old scripts, the stylesheets and the page
    sourcemap: false,
    copyPublicDir: false,
    license: { fileName: 'js/app-licenses.md' }, // the bundled packages' licenses, shipped with the bundle
    lib: {
      entry: 'src/main.ts',
      formats: ['es'],
      fileName: () => 'js/app.js',
      cssFileName: 'css/app',
    },
  },
});
