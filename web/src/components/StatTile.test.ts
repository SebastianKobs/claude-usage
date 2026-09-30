import { render } from '@testing-library/svelte';
import { flushSync } from 'svelte';
import { afterEach, expect, test } from 'vitest';
import { preferences } from '../lib/prefs.svelte';
import StatTile from './StatTile.svelte';

afterEach(() => {
  preferences.theme = null;
  localStorage.clear();
});

function tile(props: { label: string; value: string; note?: string | null; themedNote?: boolean }): HTMLElement {
  const { container } = render(StatTile, props);
  const card = container.querySelector<HTMLElement>('div.card');
  if (!card) throw new Error('no card drawn');
  return card;
}

test('a card holds the label, the value and the note, in that order', () => {
  const card = tile({ label: 'Output tokens', value: '1.2K', note: '$0.70' });
  expect([...card.children].map((child) => [child.className, child.textContent])).toEqual([
    ['label', 'Output tokens'],
    ['tile-value', '1.2K'],
    ['note', '$0.70'],
  ]);
});

test('without a note, or with a null one, no note is drawn', () => {
  expect(tile({ label: 'Turns', value: '10' }).querySelector('.note')).toBeNull();
  expect(tile({ label: 'Turns', value: '10', note: null }).querySelector('.note')).toBeNull();
});

test('the label is worded by the theme', () => {
  preferences.theme = 'hacker';
  expect(tile({ label: 'Turns', value: '10' }).querySelector('.label')).toHaveTextContent(/^requests$/);
});

test('a plain note stays as it is in a theme, a themed one is worded', () => {
  preferences.theme = 'hacker';
  const plain = tile({ label: 'Turns', value: '10', note: 'API calls with usage' });
  const themed = tile({ label: 'Turns', value: '10', note: 'API calls with usage', themedNote: true });
  expect(plain.querySelector('.note')).toHaveTextContent(/^API calls with usage$/);
  expect(themed.querySelector('.note')).toHaveTextContent(/^200 OK, all of them$/);
});

test('the words follow the theme when it changes', () => {
  const card = tile({ label: 'Turns', value: '10', note: 'API calls with usage', themedNote: true });
  expect(card.querySelector('.label')?.textContent).toBe('Turns');
  preferences.theme = 'hacker';
  flushSync();
  expect(card.querySelector('.label')?.textContent).toBe('requests');
  expect(card.querySelector('.note')?.textContent).toBe('200 OK, all of them');
  preferences.theme = null;
  flushSync();
  expect(card.querySelector('.label')?.textContent).toBe('Turns');
  expect(card.querySelector('.note')?.textContent).toBe('API calls with usage');
});
