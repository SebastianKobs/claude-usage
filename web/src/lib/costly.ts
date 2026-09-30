// What the cost-per-session section draws: a ranked bar per session in two parts of its cost, and the words around
// them (the legend, the row's name, the tooltip, the table view). Plain functions, so the component only draws them.

import type { CostlySession } from './api';
import { barShare, costSplit, costTop } from './charts';
import { compact, money, percent, whole } from './format';

/** One part of a session's cost: two steps of one hue, as in the input split. */
export interface CostlyPart {
  label: string;
  /** The bar's and the swatch's color. */
  color: string;
  /** What the part holds, where its name doesn't say. */
  note?: string;
  value: (session: CostlySession) => number;
}

/** Cache reads (soft) from the baseline, so their lengths compare across sessions, then everything else (strong). */
export const COSTLY_PARTS: readonly CostlyPart[] = [
  { label: 'Cache reads', color: 'var(--split-soft)', value: (session) => costSplit(session).cacheRead },
  {
    label: 'Everything else',
    color: 'var(--split-strong)',
    note: 'new input, cache writes, output and web searches',
    value: (session) => costSplit(session).rest,
  },
];

/** A part in the legend: its name, and what it holds in brackets. */
export function legendText(part: CostlyPart): string {
  return part.note ? `${part.label} (${part.note})` : part.label;
}

/** A session's name, "Untitled session" where it has no title. */
export function sessionName(session: { title: string | null }): string {
  return session.title || 'Untitled session';
}

/** The link to a session's view. */
export function sessionHref(session: { session_id: string }): string {
  return `#session/${encodeURIComponent(session.session_id)}`;
}

/** A session's row in the ranking: its name, its bar and the amounts the bar is made of. */
export interface CostlyRow {
  session: CostlySession;
  title: string;
  href: string;
  /** The line under the name. */
  detail: string;
  /** The bar's length as a share of the dearest session's, in percent. */
  share: number;
  cost: string;
  /** Each part with its amount; the bar draws the ones above 0, in this order. */
  parts: { part: CostlyPart; amount: number }[];
  /** What a screen reader reads for the row. */
  label: string;
}

/** The ranking, in the order given (the server sends the costliest first), each bar measured against the dearest. */
export function costlyRows(sessions: readonly CostlySession[]): CostlyRow[] {
  const top = costTop(sessions);
  return sessions.map((session) => {
    const title = sessionName(session);
    const parts = COSTLY_PARTS.map((part) => ({ part, amount: part.value(session) }));
    const amounts = parts.map(({ part, amount }) => `${part.label} ${money(amount)}`).join(', ');
    return {
      session,
      title,
      href: sessionHref(session),
      detail: `${session.project} · ${whole(session.turns)} turns · avg context ${compact(session.context_avg)}`,
      share: barShare(session.cost, top),
      cost: money(session.cost),
      parts,
      label: `${title}: ${money(session.cost)}; ${amounts}`,
    };
  });
}

/** A row's tooltip: the parts with their amounts and shares of the cost, the total, and the context. */
export function costlyTip(row: CostlyRow): {
  title: string;
  parts: { label: string; color: string; amount: string; share: string }[];
  total: string;
  context: string;
} {
  const { session } = row;
  return {
    title: row.title,
    parts: row.parts.map(({ part, amount }) => ({
      label: part.label,
      color: part.color,
      amount: money(amount),
      share: percent(amount, session.cost || 0),
    })),
    total: row.cost,
    context:
      `${whole(session.turns)} turns · context avg ${compact(session.context_avg)}, ` +
      `peak ${compact(session.context_peak)}`,
  };
}

/** The table view: the columns, and a row per session with its cells as text (the first is drawn as a link). */
export function costlyTable(sessions: readonly CostlySession[]): {
  head: { label: string; numeric?: boolean }[];
  rows: { key: string; session: CostlySession; cells: string[] }[];
} {
  return {
    head: [
      { label: 'Session' },
      { label: 'Turns', numeric: true },
      { label: 'Avg context', numeric: true },
      { label: 'Peak context', numeric: true },
      ...COSTLY_PARTS.map((part) => ({ label: part.label, numeric: true })),
      { label: 'Cost', numeric: true },
    ],
    rows: sessions.map((session) => ({
      key: session.session_id,
      session,
      cells: [
        whole(session.turns),
        compact(session.context_avg),
        compact(session.context_peak),
        ...COSTLY_PARTS.map((part) => money(part.value(session))),
        money(session.cost),
      ],
    })),
  };
}
