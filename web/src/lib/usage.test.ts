import { describe, expect, test } from 'vitest';
import { modelSlots } from './colors';
import { usage } from './fixtures';
import { modelRows, usageColumns, usageRows } from './usage';

describe('the columns', () => {
  test('are the name, then the usage columns, all of them numeric but the name', () => {
    const columns = usageColumns('Agent type');
    expect(columns.map((column) => column.label)).toEqual([
      'Agent type',
      'Turns',
      'Input',
      'Cache read %',
      'Output',
      'Cost',
    ]);
    expect(columns.map((column) => Boolean(column.numeric))).toEqual([false, true, true, true, true, true]);
  });
});

describe('the rows of a plain usage table', () => {
  test('come dearest first, the one with more turns first among equals', () => {
    const rows = usageRows(
      [
        { agent_type: 'Explore', ...usage({ cost: 1, turns: 3 }) },
        { agent_type: 'main', ...usage({ cost: 2, turns: 1 }) },
        { agent_type: 'Plan', ...usage({ cost: 1, turns: 9 }) },
      ],
      (row) => row.agent_type,
    );
    expect(rows.map((row) => row.name)).toEqual(['main', 'Plan', 'Explore']);
    expect(rows.map((row) => row.key)).toEqual(['main', 'Plan', 'Explore']);
  });

  test('carry the usage cells and stand alone', () => {
    const [row] = usageRows([{ skill: 'review', ...usage({ turns: 10, cost: 1.5 }) }], (skill) => skill.skill);
    expect(row?.cells).toEqual(['10', '1.2K', '75%', '50', '$1.50']);
    expect([row?.kind, row?.swatch, row?.sub, row?.group]).toEqual(['plain', null, false, false]);
  });

  test('leave the rows given as they were', () => {
    const given = [
      { skill: 'a', ...usage({ cost: 1 }) },
      { skill: 'b', ...usage({ cost: 2 }) },
    ];
    usageRows(given, (row) => row.skill);
    expect(given.map((row) => row.skill)).toEqual(['a', 'b']);
  });
});

describe('the rows of the by-model table', () => {
  const opus = { model: 'claude-opus-5-5', ...usage({ cost: 5 }) };
  const sonnet = { model: 'claude-sonnet-5-5', ...usage({ cost: 2 }) };
  const slots = modelSlots([opus.model, sonnet.model]);

  test('put each model first and its effort levels under it, least effort first', () => {
    const rows = modelRows(
      [sonnet, opus],
      [
        { ...opus, effort: 'high', ...usage({ cost: 3 }) },
        { ...opus, effort: 'low', ...usage({ cost: 1 }) },
        { ...opus, effort: 'background', ...usage({ cost: 1 }) },
        { ...sonnet, effort: 'medium', ...usage({ cost: 2 }) },
      ],
      slots,
    );
    expect(rows.map((row) => [row.kind, row.name])).toEqual([
      ['model', 'claude-opus-5-5'],
      ['effort', 'effort low'],
      ['effort', 'effort high'],
      ['effort', 'background calls'],
      ['model', 'claude-sonnet-5-5'],
      ['effort', 'effort medium'],
    ]);
  });

  test('order unknown levels after the known ones, by name', () => {
    const rows = modelRows(
      [opus],
      [
        { ...opus, effort: 'zeta' },
        { ...opus, effort: 'alpha' },
        { ...opus, effort: 'max' },
      ],
      slots,
    );
    expect(rows.slice(1).map((row) => row.name)).toEqual(['effort max', 'effort alpha', 'effort zeta']);
  });

  test('mark the effort rows as sub-rows and the model rows as groups', () => {
    const rows = modelRows([opus], [{ ...opus, effort: 'high' }], slots);
    expect(rows.map((row) => [row.sub, row.group])).toEqual([
      [false, true],
      [true, false],
    ]);
  });

  test('leave out the calls without an effort level, but a model stays as a group with none under it', () => {
    const rows = modelRows([opus], [{ ...opus, effort: null }], slots);
    expect(rows.map((row) => row.kind)).toEqual(['model']);
    expect(rows[0]?.group).toBe(true);
  });

  test('give a model its color, the other slot for one without', () => {
    const [known] = modelRows([opus], [], slots);
    expect(known?.swatch).toBe('var(--series-1)');
    const [unknown] = modelRows([opus], [], new Map());
    expect(unknown?.swatch).toBe('var(--series-other)');
  });

  test('take the effort rows cells from their own usage and key them by model and level', () => {
    const rows = modelRows([opus], [{ ...opus, effort: 'high', ...usage({ turns: 4, cost: 0.25 }) }], slots);
    expect(rows[1]?.cells).toEqual(['4', '1.2K', '75%', '50', '$0.25']);
    expect(new Set(rows.map((row) => row.key)).size).toBe(2);
  });
});
