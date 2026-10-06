// What the page expects of the server, as data: web/contract.json, which `make contract` writes from here
// (contract.test.ts holds the committed file to it) and tests/test_contract.py checks the server against. So neither
// side reads the other's sources: the page's tests keep the file current, the server's keep to it. Only the tests
// import this module; the bundle never does.

import ts from 'typescript';
import type { CompactEstimate, Gauge } from './api';
import { compactEstimate, compactNow, gauge } from './fixtures';
import { SESSION_ID } from '../app/loader';
import { BACKGROUND_EFFORT, EFFORT_ORDER, HATCH_SHADES } from '../charts/colors';
import { COMPACTION_VERDICTS } from '../context/compact';
import { TRUSTED_TYPES } from '../conversation/markup';
import { liveCompactBadge } from '../live/live';
import { TOOL_KINDS } from '../ui/tables';

/** A type of api.ts as data: a primitive, a string literal, a list, a record keyed by text, a union or a name. */
export type Shape =
  | 'string'
  | 'number'
  | 'boolean'
  | 'null'
  | { literal: string }
  | { array: Shape }
  | { record: Shape }
  | { union: Shape[] }
  | { ref: string };

/** An interface (the interfaces it extends, its fields, those that may be left out) or an alias. */
export type Declaration = { extends: string[]; fields: Record<string, Shape>; optional: string[] } | { alias: Shape };

/** A gauge, and the compact states the live card's icon shows for it at that time. */
export interface CompactBadge {
  now: string;
  current: Gauge;
  states: string[];
}

export interface PageContract {
  about: string;
  /** The session ids a link to a session takes (`#session/<id>`), as a regular expression's text. */
  session_id: string;
  /** The Trusted Types policies the bundle creates, each of which the CSP has to name. */
  trusted_types: string[];
  /** The values the page has words for. */
  words: { compaction_verdicts: string[]; tool_kinds: string[] };
  /** The effort levels in the page's order, those drawn hatched, and the one of the background calls. */
  efforts: { order: string[]; hatched: string[]; background: string };
  /** What serve's desktop notifications have to agree with (`notify.compact_states`). */
  compact_badges: CompactBadge[];
  /** The types of the server's answers (api.ts). */
  types: Record<string, Declaration>;
}

const ABOUT =
  'What the page (web/) expects of the server. Written by `make contract` from web/src (src/api/contract.ts); ' +
  'tests/test_contract.py checks the server against it. Not to be edited by hand.';

const KEYWORDS: Partial<Record<ts.SyntaxKind, Shape>> = {
  [ts.SyntaxKind.StringKeyword]: 'string',
  [ts.SyntaxKind.NumberKeyword]: 'number',
  [ts.SyntaxKind.BooleanKeyword]: 'boolean',
};

/** Where a node starts, for an error. */
function where(node: ts.Node, file: ts.SourceFile): string {
  return `api.ts line ${file.getLineAndCharacterOfPosition(node.getStart(file)).line + 1}`;
}

function beyond(node: ts.Node, file: ts.SourceFile): Error {
  return new Error(`${where(node, file)}: ${node.getText(file)} is beyond what the contract describes`);
}

/** A type node as data; one of another kind is refused, so api.ts keeps to what the server's tests can check. */
function shape(node: ts.TypeNode, file: ts.SourceFile): Shape {
  const keyword = KEYWORDS[node.kind];
  if (keyword) return keyword;
  if (ts.isLiteralTypeNode(node) && node.literal.kind === ts.SyntaxKind.NullKeyword) return 'null';
  if (ts.isLiteralTypeNode(node) && ts.isStringLiteral(node.literal)) return { literal: node.literal.text };
  if (ts.isUnionTypeNode(node)) return { union: node.types.map((member) => shape(member, file)) };
  if (ts.isArrayTypeNode(node)) return { array: shape(node.elementType, file) };
  if (ts.isParenthesizedTypeNode(node)) return shape(node.type, file);
  if (ts.isTypeReferenceNode(node) && ts.isIdentifier(node.typeName)) {
    const [key, value, ...more] = node.typeArguments ?? [];
    if (!key) return { ref: node.typeName.text };
    if (node.typeName.text === 'Record' && key.kind === ts.SyntaxKind.StringKeyword && value && !more.length) {
      return { record: shape(value, file) };
    }
  }
  throw beyond(node, file);
}

/** An interface's parents, fields and optional fields. */
function interfaceOf(node: ts.InterfaceDeclaration, file: ts.SourceFile): Declaration {
  if (node.typeParameters) throw beyond(node, file);
  const parents = (node.heritageClauses ?? []).flatMap((clause) =>
    clause.types.map((parent) => {
      if (!ts.isIdentifier(parent.expression) || parent.typeArguments) throw beyond(parent, file);
      return parent.expression.text;
    }),
  );
  const fields: Record<string, Shape> = {};
  const optional: string[] = [];
  for (const member of node.members) {
    if (!ts.isPropertySignature(member) || !member.type) throw beyond(member, file);
    if (!ts.isIdentifier(member.name) && !ts.isStringLiteral(member.name)) throw beyond(member, file);
    fields[member.name.text] = shape(member.type, file);
    if (member.questionToken) optional.push(member.name.text);
  }
  return { extends: parents, fields, optional };
}

function exported(statement: ts.Statement): boolean {
  const modifiers = ts.canHaveModifiers(statement) ? ts.getModifiers(statement) : undefined;
  return Boolean(modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword));
}

/** The exported interfaces and type aliases of a TypeScript source, by name, as data. */
export function declarations(source: string): Record<string, Declaration> {
  const file = ts.createSourceFile('api.ts', source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  const declared: Record<string, Declaration> = {};
  for (const statement of file.statements) {
    if (exported(statement) && ts.isInterfaceDeclaration(statement)) {
      declared[statement.name.text] = interfaceOf(statement, file);
    } else if (exported(statement) && ts.isTypeAliasDeclaration(statement) && !statement.typeParameters) {
      declared[statement.name.text] = { alias: shape(statement.type, file) };
    } else {
      throw new Error(`${where(statement, file)}: only exported interfaces and type aliases describe the answers`);
    }
  }
  return declared;
}

// the gauges of notify's compact cases (tests/test_notify.py): a 200K hint, an estimate with ~40 calls ahead on
// average and a longest finished stretch of 60, its break-even after ~10 replies, the cache warm until 12:30
const BADGE_NOW = '2026-09-28T12:00:00.000+00:00';
const EXPIRED = '2026-09-28T11:00:00.000+00:00';

interface BadgeCase {
  context?: number;
  warmUntil?: string;
  /** The estimate's changes, or null for none. */
  estimate?: Partial<CompactEstimate> | null;
  /** A compaction after the last call, which leaves no preview. */
  compacted?: string;
}

function badgeGauge({ context = 150_000, warmUntil, estimate = {}, compacted }: BadgeCase): Gauge {
  if (compacted) return gauge({ context, compacted, compact_now: null });
  const preview = compactNow({ estimate: estimate && compactEstimate(estimate) });
  return gauge({ context, compact_now: warmUntil ? { ...preview, cache_warm_until: warmUntil } : preview });
}

const BADGE_CASES: BadgeCase[] = [
  {},
  { estimate: { breakeven_calls: 30 } },
  { estimate: { breakeven_calls: 50 } },
  { estimate: { breakeven_calls: null } },
  { estimate: { breakeven_calls: null, breakeven_low: null } },
  { estimate: { breakeven_calls: 50, pays_later_in: 5 } },
  { estimate: { calls_ahead: null } },
  { estimate: { calls_ahead: null, breakeven_calls: 60 } },
  { estimate: { calls_ahead: null, breakeven_calls: 61 } },
  { estimate: { calls_ahead: null, calls_after_high: null } },
  { estimate: { calls_ahead: null, breakeven_calls: null } },
  { context: 250_000, estimate: { calls_ahead: null, breakeven_calls: 100 } },
  { warmUntil: EXPIRED, estimate: { calls_ahead: null, breakeven_cold: 100 } },
  { context: 250_000 },
  { context: 250_000, estimate: { breakeven_calls: 50, pays_later_in: 5 } },
  { context: 250_000, estimate: null },
  { estimate: null },
  { warmUntil: EXPIRED, estimate: { cold_saving: 0.4 } },
  { warmUntil: EXPIRED, estimate: { breakeven_cold: 30 } },
  { warmUntil: EXPIRED, estimate: { breakeven_cold: null } },
  { context: 250_000, compacted: '2026-09-28T11:59:00.000+00:00' },
];

/** What the page expects of the server, from its sources and api.ts's text. */
export function pageContract(apiSource: string): PageContract {
  return {
    about: ABOUT,
    session_id: SESSION_ID,
    trusted_types: [...TRUSTED_TYPES],
    words: { compaction_verdicts: Object.keys(COMPACTION_VERDICTS), tool_kinds: Object.keys(TOOL_KINDS) },
    efforts: { order: [...EFFORT_ORDER], hatched: Object.keys(HATCH_SHADES), background: BACKGROUND_EFFORT },
    compact_badges: BADGE_CASES.map(badgeGauge).map((current) => ({
      now: BADGE_NOW,
      current,
      states: liveCompactBadge(current, BADGE_NOW)?.states ?? [],
    })),
    types: declarations(apiSource),
  };
}

/** The contract as web/contract.json holds it. */
export function contractText(contract: PageContract): string {
  return `${JSON.stringify(contract, null, 2)}\n`;
}
