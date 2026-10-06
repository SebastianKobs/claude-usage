import { describe, expect, test } from 'vitest';
import { COSTLY_PARTS, costlyRows, costlyTable, costlyTip, legendText, sessionHref, sessionName } from './costly';
import { costlySession, usage } from '../api/fixtures';

const cheap = costlySession({
  session_id: 'cheap/2',
  title: null,
  project: 'blog',
  cost: 0.5,
  cost_parts: { ...usage().cost_parts, cache_read: 0.5 },
});

describe('the parts', () => {
  test('cache reads come first, from the baseline, then everything else', () => {
    expect(COSTLY_PARTS.map((part) => part.label)).toEqual(['Cache reads', 'Everything else']);
    expect(COSTLY_PARTS.map((part) => part.color)).toEqual(['var(--split-soft)', 'var(--split-strong)']);
  });

  test('a session splits into the cache reads and the rest of its cost', () => {
    const session = costlySession();
    expect(COSTLY_PARTS.map((part) => part.value(session))).toEqual([0.2, 1.3]);
  });

  test('the legend names what the last part holds, and only that one', () => {
    expect(legendText(COSTLY_PARTS[0]!)).toBe('Cache reads');
    expect(legendText(COSTLY_PARTS[1]!)).toBe('Everything else (new input, cache writes, output and web searches)');
  });
});

describe('a session', () => {
  test('is named by its title, else "Untitled session"', () => {
    expect(sessionName({ title: 'Fix it' })).toBe('Fix it');
    expect(sessionName({ title: null })).toBe('Untitled session');
    expect(sessionName({ title: '' })).toBe('Untitled session');
  });

  test('links to its view, its id escaped', () => {
    expect(sessionHref({ session_id: 'abc-1' })).toBe('#session/abc-1');
    expect(sessionHref({ session_id: 'a b/c' })).toBe('#session/a%20b%2Fc');
  });
});

describe('the ranking', () => {
  test('has a row per session, in the order given, bars measured against the dearest', () => {
    const rows = costlyRows([costlySession(), cheap]);
    expect(rows.map((row) => row.session.session_id)).toEqual(['abc-1', 'cheap/2']);
    expect(rows.map((row) => row.share)).toEqual([100, (100 * 0.5) / 1.5]);
  });

  test('says what the row is: the project, the turns and the average context under the name', () => {
    const [row] = costlyRows([costlySession({ turns: 1234, context_avg: 12_345 })]);
    expect(row?.title).toBe('Checkout: split payment step');
    expect(row?.detail).toBe('shop · 1,234 turns · avg context 12.3K');
    expect(row?.cost).toBe('$1.50');
    expect(row?.href).toBe('#session/abc-1');
  });

  test('gives a screen reader the name, the cost and each part', () => {
    const [row] = costlyRows([costlySession()]);
    expect(row?.label).toBe('Checkout: split payment step: $1.50; Cache reads $0.20, Everything else $1.30');
  });

  test('keeps a part with no amount in the row, for the bar to leave out', () => {
    const [row] = costlyRows([cheap]);
    expect(row?.parts.map(({ amount }) => amount)).toEqual([0.5, 0]);
  });

  test('is empty without sessions', () => {
    expect(costlyRows([])).toEqual([]);
  });

  test('measures against 1 where nothing cost anything, so no bar is longer than it should be', () => {
    const free = costlySession({ cost: 0, cost_parts: { ...usage().cost_parts, cache_read: 0 } });
    expect(costlyRows([free])[0]?.share).toBe(0);
  });
});

describe('the tooltip', () => {
  test('lists each part with its amount and share, the total and the context', () => {
    const [row] = costlyRows([costlySession()]);
    expect(costlyTip(row!)).toEqual({
      title: 'Checkout: split payment step',
      parts: [
        { label: 'Cache reads', color: 'var(--split-soft)', amount: '$0.20', share: '13%' },
        { label: 'Everything else', color: 'var(--split-strong)', amount: '$1.30', share: '87%' },
      ],
      total: '$1.50',
      context: '10 turns · context avg 40K, peak 90K',
    });
  });

  test('names an untitled session', () => {
    const [row] = costlyRows([cheap]);
    expect(costlyTip(row!).title).toBe('Untitled session');
  });
});

describe('the table view', () => {
  test('has the session, its context, each part and the cost as columns, the numbers right-aligned', () => {
    const { head } = costlyTable([]);
    expect(head.map((column) => column.label)).toEqual([
      'Session',
      'Turns',
      'Avg context',
      'Peak context',
      'Cache reads',
      'Everything else',
      'Cost',
    ]);
    expect(head.map((column) => column.numeric ?? false)).toEqual([false, true, true, true, true, true, true]);
  });

  test('has a row per session keyed by its id, its cells after the session written out', () => {
    const { rows } = costlyTable([costlySession(), cheap]);
    expect(rows.map((row) => row.key)).toEqual(['abc-1', 'cheap/2']);
    expect(rows[0]?.cells).toEqual(['10', '40K', '90K', '$0.20', '$1.30', '$1.50']);
    expect(rows[1]?.cells).toEqual(['10', '40K', '90K', '$0.50', '$0.00', '$0.50']);
  });
});
