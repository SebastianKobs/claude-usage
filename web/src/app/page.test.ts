import { describe, expect, test } from 'vitest';
import { summary } from '../api/fixtures';
import { footerText, scopeText, updatedText } from './page';

describe('the scope', () => {
  test('says all projects without a filter', () => {
    expect(scopeText(summary({ project_filter: null }))).toBe('· all projects');
  });

  test('names the project the summary was cut to', () => {
    expect(scopeText(summary({ project_filter: 'api' }))).toBe('· project api');
  });

  test('is empty before a summary', () => {
    expect(scopeText(null)).toBe('');
  });
});

describe('when it was updated', () => {
  test('is the time of the live answer', () => {
    const at = new Date(2026, 8, 30, 12, 34, 56).getTime();
    expect(updatedText(at)).toBe(`updated ${new Date(at).toLocaleTimeString()}`);
  });

  test('is empty before one', () => {
    expect(updatedText(null)).toBe('');
  });
});

describe('the footer', () => {
  test('says what the cost is, with the day the prices were checked, and what background is', () => {
    const text = footerText(summary({ prices_checked: '2026-09-01' }), '');
    expect(text).toMatch(/^Estimated cost at Claude API list prices \(checked 2026-09-01\)\. “\(background\)” is/);
    expect(text.endsWith('and is hatched in the chart.')).toBe(true);
  });

  test('leaves the day out where prices were never checked', () => {
    expect(footerText(summary({ prices_checked: null }), '')).toMatch(/^Estimated cost at Claude API list prices\. /);
  });

  test('ends with what the theme adds', () => {
    expect(footerText(summary(), ' Stonks only go up.')).toMatch(/hatched in the chart\. Stonks only go up\.$/);
  });

  test('is empty before a summary', () => {
    expect(footerText(null, ' more')).toBe('');
  });
});
