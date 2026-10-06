import { afterEach, expect, test } from 'vitest';
import { pagePerTest } from '../app/app.testing';
import type { CompactionSavings, Usage } from '../api/api';
import { usage } from '../api/fixtures';
import KpiTiles from './KpiTiles.svelte';

const page = pagePerTest();

afterEach(() => {
  localStorage.clear();
});

function cards(
  totals: Usage = usage(),
  savings: CompactionSavings | null = null,
  scope = 'last 7 days',
): HTMLElement[] {
  // `context` is also a mount option, so the props go in their own object
  const { container } = page.render(KpiTiles, {
    props: { totals, scope, context: { turns: 8, median: 40_000, p90: 90_000 }, hintTokens: 200_000, savings },
  });
  return [...container.querySelectorAll<HTMLElement>(':scope > div.card')];
}

function costNotes(element: HTMLElement | undefined): HTMLElement[] {
  return [...(element?.querySelectorAll<HTMLElement>('.note') ?? [])];
}

test('four cards come in the old order: cost, input, turns, output', () => {
  const labels = cards().map((card) => card.querySelector('.label')?.textContent);
  expect(labels).toEqual(['Estimated cost, last 7 days', 'Input tokens', 'Turns', 'Output tokens']);
});

test('the cost card names its scope after the label and shows the cost as the hero', () => {
  const [cost] = cards(usage(), null, 'this session');
  const label = cost?.querySelector('.label');
  expect(label?.firstElementChild?.tagName).toBe('SPAN');
  expect(label?.firstElementChild).toHaveTextContent(/^Estimated cost$/);
  expect(label).toHaveTextContent(/^Estimated cost, this session$/);
  expect(cost?.querySelector('.hero')).toHaveTextContent(/^\$1\.50$/);
});

test('the estimated cost label follows the theme, the scope does not', () => {
  page.app.preferences.theme = 'hacker';
  const [cost] = cards();
  expect(cost?.querySelector('.label')).toHaveTextContent(/^burn_rate, last 7 days$/);
});

test('the turns and output cards show their numbers and notes', () => {
  const [, , turns, output] = cards();
  expect(turns?.querySelector('.tile-value')).toHaveTextContent(/^10$/);
  expect(turns?.querySelector('.note')).toHaveTextContent(/^API calls with usage$/);
  expect(output?.querySelector('.tile-value')).toHaveTextContent(/^50$/);
  expect(output?.querySelector('.note')).toHaveTextContent(/^\$0\.70$/);
});

test('the turns note follows the theme, the output note is a price and stays', () => {
  page.app.preferences.theme = 'hacker';
  const [, , turns, output] = cards();
  expect(turns?.querySelector('.label')).toHaveTextContent(/^requests$/);
  expect(turns?.querySelector('.note')).toHaveTextContent(/^200 OK, all of them$/);
  expect(output?.querySelector('.note')).toHaveTextContent(/^\$0\.70$/);
});

test('the cost note says list prices', () => {
  expect(costNotes(cards()[0])[0]).toHaveTextContent(/^at API list prices$/);
});

test('turns of models without a price are counted in the note instead', () => {
  const [cost] = cards(usage({ unpriced_turns: 2 }));
  expect(costNotes(cost)[0]).toHaveTextContent(/^2 turns of models without a price are not included$/);
});

test('web searches and their fee join the note', () => {
  const totals = usage({ web_searches: 3, cost_parts: { ...usage().cost_parts, web_search: 0.03 } });
  expect(costNotes(cards(totals)[0])[0]).toHaveTextContent(/^at API list prices · incl\. 3 web searches, \$0\.03$/);
});

test('without savings the cost card has the one note', () => {
  expect(costNotes(cards()[0])).toHaveLength(1);
});

test('savings read as a gain, with the count on a line of its own', () => {
  const [, note] = costNotes(cards(usage(), { net: 1.25, compactions: 3, unknown: 1 })[0]);
  expect(note?.querySelector('.verdict-gain')).toHaveTextContent(/^▲ compacting saved ~\$1\.25 so far$/);
  expect(note?.querySelector('.verdict-loss')).toBeNull();
  expect(note?.children[1]).toHaveTextContent(/^\(3 compactions, 1 without an estimate\)$/);
  expect(note).toHaveAttribute('title', expect.stringContaining('summed'));
});

test('savings below nothing read as a loss', () => {
  const [, note] = costNotes(cards(usage(), { net: -0.4, compactions: 1, unknown: 0 })[0]);
  expect(note?.querySelector('.verdict-loss')).toHaveTextContent(/^▼ compacting cost ~\$0\.40 more so far$/);
  expect(note?.querySelector('.verdict-gain')).toBeNull();
  expect(note?.children[1]).toHaveTextContent(/^\(1 compaction\)$/);
});

test('compactions without an estimate show only their count, as text', () => {
  const [, note] = costNotes(cards(usage(), { net: 0, compactions: 0, unknown: 2 })[0]);
  expect(note).toHaveTextContent(/^Compacting: 2 without an estimate$/);
  expect(note?.children).toHaveLength(0);
  expect(note).toHaveAttribute('title', expect.stringContaining('summed'));
});
