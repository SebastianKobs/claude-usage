import { describe, expect, test } from 'vitest';
import { THEMES, themeFooter, themeLabel, themeName } from './themes.ts';

describe('themeName', () => {
  test.each(THEMES)('%s is a theme', (theme) => {
    expect(themeName(theme)).toBe(theme);
  });

  test('auto, nothing and unknown names follow the system', () => {
    expect(themeName('auto')).toBeNull();
    expect(themeName(null)).toBeNull();
    expect(themeName(undefined)).toBeNull();
    expect(themeName('')).toBeNull();
    expect(themeName('solarized')).toBeNull();
  });

  test('an earlier version\'s name gives its new one', () => {
    expect(themeName('techbro')).toBe('rgb');
  });

  test.each(['toString', 'constructor', 'hasOwnProperty', '__proto__'])('the object word %s is no theme', (word) => {
    expect(themeName(word)).toBeNull();
  });
});

describe('themeLabel', () => {
  test('a gimmick theme rewords a label it knows', () => {
    expect(themeLabel('hacker', 'Estimated cost')).toBe('burn_rate');
    expect(themeLabel('startup', 'Estimated cost')).toBe('Infra spend');
    expect(themeLabel('rgb', 'Estimated cost')).toBe('💸 Damage dealt');
  });

  test('a label a theme does not list keeps its wording', () => {
    expect(themeLabel('hacker', 'Something new')).toBe('Something new');
  });

  test('light, dark and auto keep every label', () => {
    for (const theme of ['light', 'dark', null]) expect(themeLabel(theme, 'Estimated cost')).toBe('Estimated cost');
  });

  test.each(['toString', 'constructor', 'hasOwnProperty'])('the object word %s stays as it is', (word) => {
    for (const theme of ['hacker', 'toString', 'constructor']) expect(themeLabel(theme, word)).toBe(word);
  });
});

describe('themeFooter', () => {
  test('each gimmick theme ends the page with its line', () => {
    expect(themeFooter('hacker')).toContain('Works on my machine');
    expect(themeFooter('startup')).toContain('hiring');
    expect(themeFooter('rgb')).toContain('GG');
  });

  test('the other themes add nothing', () => {
    for (const theme of ['light', 'dark', null, 'toString']) expect(themeFooter(theme)).toBe('');
  });
});
