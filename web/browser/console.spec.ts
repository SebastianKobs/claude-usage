import { closeSession, demoSessions, expect, openDemo, openSession, showConversation, test } from './page';

test('the overview draws without a complaint', async ({ page }) => {
  await openDemo(page);
  await expect(page.getByRole('heading', { level: 2, name: /^Sessions/ })).toBeVisible();
});

test('every session opens, with its conversation in both orders, without a complaint', async ({ page }) => {
  test.setTimeout(180_000); // the demo's 31 sessions, each with its conversation
  await openDemo(page);
  const sessions = await demoSessions(page);
  expect(sessions.length).toBeGreaterThan(0);
  for (const session of sessions) {
    await test.step(session.title, async () => {
      await openSession(page, session.id);
      if (await page.getByRole('button', { name: 'Show conversation' }).isVisible()) {
        await showConversation(page);
        await page.getByRole('button', { name: 'Oldest first' }).click();
      }
      await closeSession(page);
    });
  }
});
