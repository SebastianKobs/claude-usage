import { flushSync } from 'svelte';
import { beforeEach, describe, expect, test } from 'vitest';
import { AppState } from './app.svelte.ts';

beforeEach(() => {
  localStorage.clear();
});

describe('a page', () => {
  test('has state of its own: two pages share no payload, range, preference, table page or message', () => {
    const left = new AppState();
    const right = new AppState();
    left.preferences.theme = 'hacker';
    left.pages.set('usage', 25);
    left.messages.show('live', 'down');
    expect(right.preferences.theme).toBeNull();
    expect(right.pages.first('usage')).toBe(0);
    expect(right.messages.has('live')).toBe(false);
    expect(left.payload).not.toBe(right.payload);
    expect(left.range).not.toBe(right.range);
  });

  test('reads the saved preferences and range as it starts', () => {
    localStorage.setItem('claude-usage.theme', 'dark');
    localStorage.setItem('claude-usage.days', '7');
    const app = new AppState();
    expect(app.preferences.theme).toBe('dark');
    expect(app.range.days).toBe(7);
  });
});

describe('hype and footerCopy', () => {
  test('follow the theme of the page', () => {
    const app = new AppState();
    expect(app.hype('Estimated cost')).toBe('Estimated cost');
    expect(app.footerCopy()).toBe('');
    app.preferences.theme = 'hacker';
    expect(app.hype('Estimated cost')).toBe('burn_rate');
    expect(app.footerCopy()).toContain('Works on my machine');
  });

  test('can be taken out of the page and still know which page they belong to', () => {
    const app = new AppState();
    const { hype } = app;
    app.preferences.theme = 'hacker';
    expect(hype('Estimated cost')).toBe('burn_rate');
  });

  test('a label the theme does not know stays as it is', () => {
    const app = new AppState();
    app.preferences.theme = 'startup';
    expect(app.hype('No such label')).toBe('No such label');
  });

  test('are reactive: what reads them follows a new theme', () => {
    const app = new AppState();
    const seen: string[] = [];
    const stop = $effect.root(() => {
      $effect(() => {
        seen.push(app.hype('Estimated cost'));
      });
    });
    flushSync();
    app.preferences.theme = 'hacker';
    flushSync();
    stop();
    expect(seen).toEqual(['Estimated cost', 'burn_rate']);
  });
});

describe('shownWindow', () => {
  test('a table without a page shows its first, at the page size of the preference', () => {
    const app = new AppState();
    expect(app.shownWindow('usage', 60)).toEqual({ page: 0, pages: 3, first: 0, last: 25 });
    app.preferences.pageSize = 10;
    expect(app.shownWindow('usage', 60)).toEqual({ page: 0, pages: 6, first: 0, last: 10 });
  });

  test('the page holding the stored first unit shows, on any page size', () => {
    const app = new AppState();
    app.pages.set('usage', 30);
    expect(app.shownWindow('usage', 60)).toEqual({ page: 1, pages: 3, first: 25, last: 50 });
    app.preferences.pageSize = 10;
    expect(app.shownWindow('usage', 60)).toEqual({ page: 3, pages: 6, first: 30, last: 40 });
  });

  test('a stored page beyond the end shows the last page, without changing what is stored', () => {
    const app = new AppState();
    app.pages.set('usage', 500);
    expect(app.shownWindow('usage', 60)).toEqual({ page: 2, pages: 3, first: 50, last: 60 });
    expect(app.pages.first('usage')).toBe(500);
  });

  test('another key has its own page', () => {
    const app = new AppState();
    app.pages.set('usage', 25);
    expect(app.shownWindow('other', 60).page).toBe(0);
  });

  test('is reactive: a turned page and a new page size are both seen by what reads it', () => {
    const app = new AppState();
    const seen: number[] = [];
    const stop = $effect.root(() => {
      $effect(() => {
        const shown = app.shownWindow('usage', 120);
        seen.push(shown.first, shown.last);
      });
    });
    flushSync();
    app.pages.set('usage', 25);
    flushSync();
    app.preferences.pageSize = 50;
    flushSync();
    stop();
    expect(seen).toEqual([0, 25, 25, 50, 0, 50]);
  });
});
