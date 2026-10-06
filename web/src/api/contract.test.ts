// @vitest-environment node
import { readFileSync } from 'node:fs';
import { describe, expect, test } from 'vitest';
import { contractText, declarations, pageContract, type Shape } from './contract';

const API = readFileSync(new URL('./api.ts', import.meta.url), 'utf-8');

describe('the types as data', () => {
  test('an interface is its parents and its fields, each with its type', () => {
    const source = [
      'export interface Total extends Usage, Named {',
      '  turns: number;',
      '  label: string | null;',
      '  ok: boolean;',
      '}',
    ].join('\n');
    expect(declarations(source)).toEqual({
      Total: {
        extends: ['Usage', 'Named'],
        fields: { turns: 'number', label: { union: ['string', 'null'] }, ok: 'boolean' },
        optional: [],
      },
    });
  });

  test('a list, a record by text, a quoted name, an optional field and a literal', () => {
    const source = [
      'export interface Counts {',
      '  rows: Row[];',
      '  by_model: Record<string, number>;',
      "  'low-medium'?: number;",
      "  kind: 'soft' | 'pays';",
      '  pairs: (Row | null)[];',
      '}',
    ].join('\n');
    expect(declarations(source)).toEqual({
      Counts: {
        extends: [],
        fields: {
          rows: { array: { ref: 'Row' } },
          by_model: { record: 'number' },
          'low-medium': 'number',
          kind: { union: [{ literal: 'soft' }, { literal: 'pays' }] },
          pairs: { array: { union: [{ ref: 'Row' }, 'null'] } },
        },
        optional: ['low-medium'],
      },
    });
  });

  test('an alias is the type it names', () => {
    expect(declarations("export type Reach = 'sent' | 'empty';\nexport type Rows = Row[];")).toEqual({
      Reach: { alias: { union: [{ literal: 'sent' }, { literal: 'empty' }] } },
      Rows: { alias: { array: { ref: 'Row' } } },
    });
  });

  test('a type it can’t describe is refused, by its line', () => {
    const refused = [
      'export interface A {\n  pair: [string, number];\n}',
      'export interface A {\n  part: Partial<B>;\n}',
      'export interface A {\n  inner: { a: string };\n}',
      'export interface A {\n  count: 1;\n}',
      'export interface A {\n  keyed: Record<number, string>;\n}',
    ];
    for (const source of refused) expect(() => declarations(source)).toThrow(/^api\.ts line 2: .+ is beyond what/);
  });

  test('what isn’t an exported interface or type is refused, by its line', () => {
    expect(() => declarations('interface A {\n  a: string;\n}')).toThrow(/^api\.ts line 1: /);
    expect(() => declarations("export const A = 'a';")).toThrow(/^api\.ts line 1: /);
    expect(() => declarations('export interface A<T> {\n  a: T;\n}')).toThrow(/^api\.ts line 1: /);
    expect(() => declarations('export interface A {\n  read(): string;\n}')).toThrow(/^api\.ts line 2: /);
  });
});

/** The names a shape refers to. */
function references(shape: Shape): string[] {
  if (typeof shape === 'string' || 'literal' in shape) return [];
  if ('ref' in shape) return [shape.ref];
  if ('union' in shape) return shape.union.flatMap(references);
  return references('array' in shape ? shape.array : shape.record);
}

describe('the contract', () => {
  const contract = pageContract(API);

  test('declares every type its types refer to', () => {
    const shapes = Object.values(contract.types).flatMap((declared) =>
      'alias' in declared ? [declared.alias] : Object.values(declared.fields),
    );
    const parents = Object.values(contract.types).flatMap((declared) =>
      'extends' in declared ? declared.extends : [],
    );
    const undeclared = [...shapes.flatMap(references), ...parents].filter((name) => !(name in contract.types));
    expect(undeclared).toEqual([]);
  });

  test('holds the live card’s compact states for gauges of each kind', () => {
    const states = new Set(contract.compact_badges.flatMap((badge) => badge.states));
    expect([...states].sort()).toEqual(['close', 'cold', 'hint', 'pays', 'soon', 'unlikely']);
    expect(contract.compact_badges.some((badge) => badge.states.length === 0)).toBe(true);
  });

  test('is web/contract.json as committed (make contract writes it)', async () => {
    await expect(contractText(contract), 'run make contract').toMatchFileSnapshot('../../contract.json');
  });
});
