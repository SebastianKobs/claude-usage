import { describe, expect, test } from 'vitest';
import { TablePages } from './paging.svelte.ts';

describe('TablePages', () => {
  test('a table without a page starts at unit 0', () => {
    expect(new TablePages().first('usage')).toBe(0);
  });

  test('a page set is given back, by key', () => {
    const pages = new TablePages();
    pages.set('usage', 30);
    expect(pages.first('usage')).toBe(30);
    expect(pages.first('other')).toBe(0);
  });

  test('forgetting a table starts it at 0 again and leaves the others', () => {
    const pages = new TablePages();
    pages.set('usage', 30);
    pages.set('other', 10);
    pages.forget('usage');
    expect([pages.first('usage'), pages.first('other')]).toEqual([0, 10]);
  });
});
