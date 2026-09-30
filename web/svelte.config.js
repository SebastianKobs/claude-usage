// Shared by Vite, svelte-check and Vitest.
/** @type {import('@sveltejs/vite-plugin-svelte').SvelteConfig} */
export default {
  compilerOptions: {
    // Runes for our own files only: forcing them on node_modules breaks libraries that still ship
    // legacy components (Testing Library does).
    runes: ({ filename }) => (filename.split(/[/\\]/).includes('node_modules') ? undefined : true),
    // Templates built as DOM trees, not HTML strings: html mode creates a Trusted Types policy of its
    // own, which the page's CSP won't allow.
    fragments: 'tree',
  },
};
