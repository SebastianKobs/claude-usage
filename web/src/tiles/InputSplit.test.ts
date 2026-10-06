import { flushSync } from 'svelte';
import { afterEach, expect, test } from 'vitest';
import { pagePerTest } from '../app/app.testing';
import type { ContextStats, Usage } from '../api/api';
import { usage } from '../api/fixtures';
import InputSplit from './InputSplit.svelte';

const page = pagePerTest();

afterEach(() => {
  localStorage.clear();
});

const CONTEXT: ContextStats = { turns: 8, median: 40_000, p90: 90_000 };

function card(totals: Usage = usage(), context: ContextStats | null = CONTEXT, hintTokens = 200_000): HTMLElement {
  // `context` is also a mount option, so the props go in their own object
  const { container } = page.render(InputSplit, { props: { totals, context, hintTokens } });
  const element = container.querySelector<HTMLElement>('div.card');
  if (!element) throw new Error('no card drawn');
  return element;
}

function bar(element: HTMLElement): HTMLElement {
  const found = element.querySelector<HTMLElement>('.split');
  if (!found) throw new Error('no bar drawn');
  return found;
}

test('the card has the label, the total and the bar, then a row per part', () => {
  const element = card();
  expect(element.querySelector('.label')).toHaveTextContent(/^Input tokens$/);
  expect(element.querySelector('.tile-value')).toHaveTextContent(/^1\.2K$/);
  expect(bar(element)).toHaveAttribute('role', 'img');
  expect(element.querySelectorAll('.split-row')).toHaveLength(2);
});

test('the bar is described by the share of each part', () => {
  expect(bar(card())).toHaveAttribute('aria-label', 'Processed 25%, From cache 75%');
});

test('each part of the bar grows by its tokens, in its color', () => {
  const spans = [...bar(card()).querySelectorAll('span')];
  expect(spans.map((span) => span.style.flexGrow)).toEqual(['300', '900']);
  expect(spans.map((span) => span.style.background)).toEqual(['var(--split-strong)', 'var(--split-soft)']);
});

test('a part without tokens is left out of the bar but keeps its row', () => {
  const element = card(usage({ cache_read: 0 }));
  expect(bar(element).querySelectorAll('span')).toHaveLength(1);
  expect(element.querySelectorAll('.split-row')).toHaveLength(2);
  expect(bar(element)).toHaveAttribute('aria-label', 'Processed 100%, From cache 0%');
});

test('a row has a swatch, the label, tokens, share and cost', () => {
  const [processed, cached] = [...card().querySelectorAll<HTMLElement>('.split-row')];
  expect(processed?.querySelector<HTMLElement>('.swatch')?.style.background).toBe('var(--split-strong)');
  expect([...(processed?.children ?? [])].map((child) => child.textContent)).toEqual([
    '',
    'Processed',
    '300',
    '25%',
    '$0.50',
  ]);
  expect(cached?.querySelector<HTMLElement>('.swatch')?.style.background).toBe('var(--split-soft)');
  expect([...(cached?.children ?? [])].map((child) => child.textContent)).toEqual([
    '',
    'From cache',
    '900',
    '75%',
    '$0.20',
  ]);
});

test('the numbers carry their classes: the tokens strong, the share secondary', () => {
  const row = card().querySelector('.split-row');
  expect(row?.querySelector('strong')).toHaveClass('split-number');
  expect(row?.querySelector('span.secondary')).toHaveClass('split-number');
});

test('hovering a row says what the part is', () => {
  const [processed, cached] = [...card().querySelectorAll('.split-row')];
  expect(processed).toHaveAttribute('title', 'New input 100 + cache writes 200, billed at full price or more');
  expect(cached).toHaveAttribute('title', expect.stringContaining('Cache reads'));
});

test('the context note gives the median, the p90 and the hint threshold', () => {
  const note = card().querySelector('.note');
  expect(note).toHaveTextContent(/^median context 40K per turn \(p90 90K\) · compact hint at 200K$/);
  expect(note).toHaveAttribute('title', expect.stringContaining('[chat] compact_hint_tokens'));
  expect(note).toHaveAttribute('title', expect.stringMatching(/^The context a main-thread turn reads: /));
});

test('without a hint threshold the note stops at the p90', () => {
  const note = card(usage(), CONTEXT, 0).querySelector('.note');
  expect(note).toHaveTextContent(/^median context 40K per turn \(p90 90K\)$/);
});

test('without context or without turns there is no note', () => {
  expect(card(usage(), null).querySelector('.note')).toBeNull();
  expect(card(usage(), { turns: 0, median: 0, p90: 0 }).querySelector('.note')).toBeNull();
});

test('the labels follow the theme', () => {
  const element = card();
  page.app.preferences.theme = 'hacker';
  flushSync();
  expect(element.querySelector('.label')?.textContent).toBe('context_window.log');
  expect([...element.querySelectorAll('.split-row > span:nth-child(2)')].map((label) => label.textContent)).toEqual([
    'cache_miss',
    'cache_hit',
  ]);
  // the bar's description keeps the plain words, which a screen reader reads
  expect(bar(element)).toHaveAttribute('aria-label', 'Processed 25%, From cache 75%');
});
