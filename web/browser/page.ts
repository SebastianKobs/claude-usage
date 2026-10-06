// What the browser check's tests share: a test that fails on anything the page complains about, and the steps
// through the demo.

import { test as base, expect, type Page } from '@playwright/test';
import type { Summary } from '../src/api/api';

/** A Playwright test that fails where the page wrote an error to the console, threw, or had something blocked by its
 *  CSP: a page that works says nothing. */
export const test = base.extend<{ complaints: string[] }>({
  complaints: [
    async ({ page }, use) => {
      const complaints: string[] = [];
      await page.addInitScript(() => {
        // Firefox reports a violation in its own console only, which Playwright doesn't see
        document.addEventListener('securitypolicyviolation', (event) =>
          console.error(`CSP blocked ${event.blockedURI || 'inline code'} (${event.effectiveDirective})`),
        );
      });
      page.on('console', (message) => {
        if (message.type() === 'error') complaints.push(message.text());
      });
      page.on('pageerror', (error) => complaints.push(error.message));
      await use(complaints);
      expect(complaints, 'what the page complained about').toEqual([]);
    },
    { auto: true },
  ],
});

export { expect };

/** Opens the demo's overview, its token set as a cookie, and waits until the summary and the live list are drawn. */
export async function openDemo(page: Page): Promise<void> {
  const link = process.env.DEMO_LINK;
  if (!link) throw new Error('no DEMO_LINK: run the browser check through playwright.config.ts, which serves the demo');
  await page.goto(link);
  await expect(page.getByRole('heading', { level: 2, name: 'Cost per session' })).toBeVisible();
  await expect(page.getByRole('heading', { level: 2, name: /^Live sessions/ })).toBeVisible();
}

/** The demo's sessions, newest first, as the server lists them (the range cut to the retention). */
export async function demoSessions(page: Page): Promise<{ id: string; title: string }[]> {
  const summary: Summary = await page.evaluate(() => fetch('/api/summary?days=365').then((answer) => answer.json()));
  return summary.sessions.map((session) => ({ id: session.session_id, title: session.title ?? session.session_id }));
}

/** Opens a session's view as its link does, and waits until its heading has focus. */
export async function openSession(page: Page, id: string): Promise<void> {
  await page.evaluate((session) => (location.hash = `#session/${session}`), id);
  await expect(page.locator('#drilldown-title')).toBeFocused();
}

/** Shows the open session's conversation, where its transcript is there, and waits until it is drawn. */
export async function showConversation(page: Page): Promise<void> {
  await page.getByRole('button', { name: 'Show conversation' }).click();
  await expect(page.getByRole('button', { name: 'Reload' })).toBeVisible();
}

/** Waits until nothing on the page loads or moves: a dimmed summary fades back in, and colours caught in between
 *  measure wrong. */
export async function settled(page: Page): Promise<void> {
  await expect(page.locator('.loading')).toHaveCount(0);
  await page.waitForFunction(() => document.getAnimations().every((animation) => animation.playState !== 'running'));
}

/** Closes the session view with Escape, back to the overview. */
export async function closeSession(page: Page): Promise<void> {
  await page.keyboard.press('Escape');
  await expect(page.locator('#drilldown-title')).toBeHidden();
}
