import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vite';

// One ES module without hashes, and its CSS as one file, into the package's static folder, which the
// Python server serves from a fixed list: no chunks, no source maps, no public folder.
export default defineConfig({
  plugins: [svelte()],
  build: {
    outDir: '../claude_usage/static',
    emptyOutDir: false, // the folder holds the old scripts, the stylesheets and the page
    sourcemap: false,
    copyPublicDir: false,
    lib: {
      entry: 'src/main.ts',
      formats: ['es'],
      fileName: () => 'js/app.js',
      cssFileName: 'css/app',
    },
  },
});
