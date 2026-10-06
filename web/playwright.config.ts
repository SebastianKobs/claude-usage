import { defineConfig, devices } from '@playwright/test';

// The browser check (make browser-check): the built page on the demo's made-up transcripts, in Chromium, which
// enforces the page's Trusted Types, and in Firefox. Apart from Vitest (src/**/*.test.ts); its scratch goes under
// tests/.tmp like every other test's.
export default defineConfig({
  testDir: 'browser',
  testMatch: '*.spec.ts',
  globalSetup: './browser/demo.ts',
  outputDir: '../tests/.tmp/browser-results',
  forbidOnly: true,
  reporter: 'list',
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
  ],
});
