import { flushSync } from 'svelte';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import {
  Preferences,
  footerCopy,
  hype,
  preferences,
  readPreference,
  savePreference,
  savedOption,
} from './prefs.svelte.ts';

function blockStorage(): void {
  vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
    throw new Error('blocked');
  });
  vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
    throw new Error('blocked');
  });
}

beforeEach(() => {
  localStorage.clear();
});

afterEach(() => {
  vi.restoreAllMocks();
  preferences.theme = null;
  localStorage.clear();
});

describe('readPreference and savePreference', () => {
  test('a saved value comes back under the claude-usage key', () => {
    savePreference('days', 30);
    expect(localStorage.getItem('claude-usage.days')).toBe('30');
    expect(readPreference('days')).toBe('30');
  });

  test('nothing saved reads as null', () => {
    expect(readPreference('days')).toBeNull();
  });

  test('blocked storage reads as null and saves nothing, without throwing', () => {
    blockStorage();
    expect(readPreference('days')).toBeNull();
    expect(() => savePreference('days', 7)).not.toThrow();
  });
});

describe('savedOption', () => {
  test('a saved value among the options is given', () => {
    savePreference('metric', 'cost');
    expect(savedOption('metric', ['cost', 'tokens'])).toBe('cost');
  });

  test('nothing saved is null', () => {
    expect(savedOption('metric', ['cost', 'tokens'])).toBeNull();
  });

  test('a value outside the options is null', () => {
    savePreference('metric', 'turns');
    expect(savedOption('metric', ['cost', 'tokens'])).toBeNull();
  });

  test.each(['toString', 'constructor', '__proto__'])('the object word %s is no option', (word) => {
    savePreference('metric', word);
    expect(savedOption('metric', ['cost', 'tokens'])).toBeNull();
  });
});

describe('theme', () => {
  test('follows the system by default', () => {
    expect(new Preferences().theme).toBeNull();
  });

  test('a saved theme is read', () => {
    savePreference('theme', 'dark');
    expect(new Preferences().theme).toBe('dark');
  });

  test("an earlier version's name gives its new one", () => {
    savePreference('theme', 'techbro');
    expect(new Preferences().theme).toBe('rgb');
  });

  test.each(['auto', 'toString'])('a saved %s follows the system', (saved) => {
    savePreference('theme', saved);
    expect(new Preferences().theme).toBeNull();
  });

  test('the setter saves the choice', () => {
    const prefs = new Preferences();
    prefs.theme = 'hacker';
    expect(prefs.theme).toBe('hacker');
    expect(readPreference('theme')).toBe('hacker');
  });

  test('the setter saves auto for null and for an unknown name', () => {
    const prefs = new Preferences();
    prefs.theme = 'hacker';
    prefs.theme = null;
    expect(prefs.theme).toBeNull();
    expect(readPreference('theme')).toBe('auto');
    prefs.theme = 'startup';
    prefs.theme = 'solarized';
    expect(prefs.theme).toBeNull();
    expect(readPreference('theme')).toBe('auto');
  });

  test('the choice comes back in the next instance', () => {
    new Preferences().theme = 'startup';
    expect(new Preferences().theme).toBe('startup');
  });
});

describe('page size', () => {
  test('is 25 by default', () => {
    expect(new Preferences().pageSize).toBe(25);
  });

  test('a saved size is read', () => {
    savePreference('page_size', 50);
    expect(new Preferences().pageSize).toBe(50);
  });

  test.each(['7', 'abc'])('a saved %s gives the default', (saved) => {
    savePreference('page_size', saved);
    expect(new Preferences().pageSize).toBe(25);
  });

  test('the setter saves a size on offer', () => {
    const prefs = new Preferences();
    prefs.pageSize = 10;
    expect(prefs.pageSize).toBe(10);
    expect(readPreference('page_size')).toBe('10');
  });

  test('the setter ignores a size not on offer', () => {
    const prefs = new Preferences();
    prefs.pageSize = 7;
    expect(prefs.pageSize).toBe(25);
    expect(readPreference('page_size')).toBeNull();
  });
});

describe('conversation order', () => {
  test('is newest first by default', () => {
    expect(new Preferences().oldestFirst).toBe(false);
  });

  test('a saved true is oldest first', () => {
    savePreference('chat-oldest-first', 'true');
    expect(new Preferences().oldestFirst).toBe(true);
  });

  test.each(['false', 'yes'])('a saved %s is newest first', (saved) => {
    savePreference('chat-oldest-first', saved);
    expect(new Preferences().oldestFirst).toBe(false);
  });

  test('the setter saves true and false', () => {
    const prefs = new Preferences();
    prefs.oldestFirst = true;
    expect(readPreference('chat-oldest-first')).toBe('true');
    prefs.oldestFirst = false;
    expect(readPreference('chat-oldest-first')).toBe('false');
  });
});

describe('blocked storage', () => {
  test('the defaults hold and the setters still change what the page shows', () => {
    blockStorage();
    const prefs = new Preferences();
    expect(prefs.theme).toBeNull();
    expect(prefs.pageSize).toBe(25);
    expect(prefs.oldestFirst).toBe(false);
    prefs.theme = 'dark';
    prefs.pageSize = 50;
    prefs.oldestFirst = true;
    expect(prefs.theme).toBe('dark');
    expect(prefs.pageSize).toBe(50);
    expect(prefs.oldestFirst).toBe(true);
  });
});

describe('reactivity', () => {
  test('what reads the theme reruns when it changes', () => {
    const seen: (string | null)[] = [];
    const cleanup = $effect.root(() => {
      const prefs = new Preferences();
      $effect(() => {
        seen.push(prefs.theme);
      });
      flushSync();
      prefs.theme = 'rgb';
      flushSync();
      prefs.theme = null;
      flushSync();
    });
    cleanup();
    expect(seen).toEqual([null, 'rgb', null]);
  });
});

describe('the themed wording', () => {
  test('hype and footerCopy follow the theme of the page', () => {
    expect(hype('Estimated cost')).toBe('Estimated cost');
    expect(footerCopy()).toBe('');
    preferences.theme = 'hacker';
    expect(hype('Estimated cost')).toBe('burn_rate');
    expect(footerCopy()).toContain('Works on my machine');
  });

  test('a label the theme does not know stays as it is', () => {
    preferences.theme = 'startup';
    expect(hype('No such label')).toBe('No such label');
  });
});
