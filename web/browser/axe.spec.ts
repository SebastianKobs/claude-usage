import AxeBuilder from '@axe-core/playwright';
import type { Page } from '@playwright/test';
import { demoSessions, expect, openDemo, openSession, settled, showConversation, test } from './page';

// The session the docs' screenshots show: compactions, secret accesses, subagents, tools and a long conversation.
const SHOWCASE = 'Checkout: split payment step';

/** What axe finds on the page once it is still: a line per rule, with how many nodes break it and the first. */
async function violations(page: Page): Promise<string[]> {
  await settled(page);
  const results = await new AxeBuilder({ page }).analyze();
  return results.violations.map(
    (rule) => `${rule.id}: ${rule.help} (${rule.nodes.length}, e.g. ${rule.nodes[0]?.target.join(' ')})`,
  );
}

for (const theme of ['light', 'dark']) {
  test.describe(`in the ${theme} theme`, () => {
    test.use({ bypassCSP: true }); // axe runs a script of its own, which the page's CSP refuses
    test.beforeEach(async ({ page }) => {
      // the saved choice, since an emulated colour scheme doesn't reach the page's 'auto' in every browser
      await page.addInitScript((name) => {
        if (location.protocol === 'http:') localStorage.setItem('claude-usage.theme', name);
      }, theme);
    });

    test('the overview has no accessibility violation', async ({ page }) => {
      await openDemo(page);
      expect(await violations(page)).toEqual([]);
    });

    test('a session view with its conversation has none', async ({ page }) => {
      test.setTimeout(120_000); // axe checks the colours of the conversation's thousands of nodes: 25 to 40 s
      await openDemo(page);
      const showcase = (await demoSessions(page)).find((session) => session.title === SHOWCASE);
      expect(showcase, `the demo's session "${SHOWCASE}"`).toBeDefined();
      await openSession(page, showcase!.id);
      await showConversation(page);
      expect(await violations(page)).toEqual([]);
    });
  });
}
