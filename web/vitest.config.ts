import { svelteTesting } from '@testing-library/svelte/vite';
import { defineConfig, mergeConfig } from 'vitest/config';
import vite from './vite.config.ts';

// The build's settings with a simulated DOM: happy-dom, or jsdom where a file asks for it (`// @vitest-environment
// jsdom`: DOMPurify doesn't trust happy-dom). svelteTesting() resolves Svelte's browser build, which mount needs,
// and cleans up after each test. Kept apart from vite.config.ts, which the build manifest records.
export default mergeConfig(
  vite,
  defineConfig({
    plugins: [svelteTesting()],
    test: {
      include: ['src/**/*.test.ts'],
      environment: 'happy-dom',
      setupFiles: ['./vitest-setup.ts'],
    },
  }),
);
