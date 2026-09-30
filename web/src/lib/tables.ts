// What the dashboard's tables and lists decide before they draw: paging, the sessions list's filter and count, the
// Tools table's rows with their folds and labels, the conversation's order, and where the conversation sits in a
// session's view. Plain functions with no state. Every row a keyed `{#each}` will draw has its key chosen here: a
// tool row's `key`, a conversation entry's from its place in the transcript, a session's `session_id`, a project's
// name, never a position in what is shown.

import type { Agent, ChatEntry, SessionListItem, Usage } from './api.ts';
import { inputTotal } from './charts.ts';
import { compact, money, percent, whole } from './format.ts';

// --- paging ---------------------------------------------------------------------------------------------------

export const PAGE_SIZES = [10, 25, 50];
export const DEFAULT_PAGE_SIZE = 25;

/** The groups a page shows: from `first` up to, not including, `last`, with the page kept within the pages there
 *  are. */
export interface PageWindow {
  page: number;
  pages: number;
  first: number;
  last: number;
}

/** The group each row belongs to: a sub-row (an effort level under its model, an agent under its workflow run) stays
 *  with the row above it, so a page never splits a group. */
export function pageUnits(subRows: boolean[]): number[] {
  let unit = -1;
  return subRows.map((sub) => {
    if (!sub || unit < 0) unit += 1;
    return unit;
  });
}

export function pageWindow(count: number, size: number, page: number): PageWindow {
  const pages = Math.max(1, Math.ceil(count / size));
  const kept = Math.min(Math.max(page, 0), pages - 1);
  return { page: kept, pages, first: kept * size, last: Math.min(count, (kept + 1) * size) };
}

/** "rows 11–20 of 84", or the noun of a pager of cards ("sessions 1–10 of 300"). */
export function pageText(shown: PageWindow, count: number, noun = 'rows'): string {
  return `${noun} ${shown.first + 1}–${shown.last} of ${count}`;
}

/** A saved page size, if it is one on offer; else the fallback. */
export function pageSizeFrom(saved: string | null | undefined, sizes: number[], fallback: number): number {
  const size = Number(saved);
  return sizes.includes(size) ? size : fallback;
}

// --- the sessions list ----------------------------------------------------------------------------------------

/** What a session is filtered by. */
export type SessionText = Pick<SessionListItem, 'title' | 'project' | 'session_id'>;

/** Whether a session is of the project picked ("" for all) and holds every word, in any case, in its title, project or
 *  id. */
export function sessionMatches(session: SessionText, project: string, text: string): boolean {
  if (project && session.project !== project) return false;
  const haystack = `${session.title || ''} ${session.project} ${session.session_id}`.toLowerCase();
  return text
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((word) => haystack.includes(word));
}

export interface ProjectChoice {
  project: string;
  count: number;
}

/** The projects to pick from, by name, with their sessions; the one picked stays on offer in a range without it, so the
 *  filter still shows. */
export function sessionProjects(sessions: Pick<SessionListItem, 'project'>[], picked: string): ProjectChoice[] {
  const counts = new Map<string, number>();
  for (const session of sessions) counts.set(session.project, (counts.get(session.project) ?? 0) + 1);
  if (picked && !counts.has(picked)) counts.set(picked, 0);
  return [...counts]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([project, count]) => ({ project, count }));
}

/** "84 sessions", "1 session", or "12 of 84 sessions" while a filter holds some back. */
export function sessionCount(shown: number, total: number): string {
  const sessions = `${total} session${total === 1 ? '' : 's'}`;
  return shown === total ? sessions : `${shown} of ${sessions}`;
}

// --- the Tools table ------------------------------------------------------------------------------------------

/** What a Bash command does, by its programs (`tool_kinds.command_class`), never by its language; which programs is the
 *  fold under it. MCP's kinds are its servers, named as they are. */
export const TOOL_KINDS: Record<string, string> = {
  search: 'search',
  view: 'view',
  list: 'list',
  edit_in_place: 'edit in place',
  write_file: 'write a file',
  inline_script: 'inline script',
  git: 'git',
  run: 'run a program',
};

/** One row of the Tools table. From the transcript each has sizes and costs; once it is gone only the stored calls and
 *  characters are known, the rest null. */
export interface ToolRow {
  /** Unique in the table: the fold's key for a transcript's row, the agent and tool for a stored one. */
  key: string;
  agent: string;
  tool: string;
  kind: string | null;
  detail: string | null;
  options: string | null;
  /** The row's own fold, per agent, where a row splits into others; null for a stored row. */
  fold: string | null;
  /** The fold of the row this one splits from; the kinds, which always show, have none. */
  parent: string | null;
  sub: boolean;
  calls: number;
  errors: number | null;
  result_chars: number;
  result_median: number | null;
  result_p90: number | null;
  input_median: number | null;
  calls_after_median: number | null;
  carried: number | null;
  input_cost: number | null;
}

type ToolAgent = Pick<Agent, 'agent_type' | 'tools' | 'tool_kinds'> & Partial<Pick<Agent, 'agent_id'>>;

/**
 * The Tools table's rows, agent by agent: from the transcript (tool_kinds) each tool with its sizes and costs, Bash
 * followed by a sub-row per command kind and MCP by one per server, each kind by one per detail (its programs, a
 * server's tools), a file tool by one per file type (Grep by output mode, Glob by the type it matches, Agent by
 * subagent type, Skill by skill), each detail by one per set of options. A row's fold names it per agent; the rows it
 * splits into carry it as their parent, except the kinds, which are always shown.
 */
export function toolTableRows(agents: ToolAgent[]): ToolRow[] {
  return agents.flatMap((agent): ToolRow[] => {
    const agentId = agent.agent_id ?? '';
    if (!agent.tool_kinds) {
      return agent.tools.map((tool) => ({
        key: JSON.stringify([agentId, tool.tool, 'stored']),
        agent: agent.agent_type,
        tool: tool.tool,
        kind: null,
        detail: null,
        options: null,
        fold: null,
        parent: null,
        sub: false,
        calls: tool.calls,
        errors: null,
        result_chars: tool.result_chars,
        result_median: null,
        result_p90: null,
        input_median: null,
        calls_after_median: null,
        carried: null,
        input_cost: null,
      }));
    }
    return agent.tool_kinds.map((row) => {
      const parts = [row.tool, row.kind, row.detail, row.options];
      const depth = parts.findLastIndex((part) => part !== null);
      const keyOf = (keyParts: (string | null)[]): string => JSON.stringify([agentId, ...keyParts]);
      const above = parts.map((part, index) => (index === depth ? null : part));
      const fold = keyOf(parts);
      const parent = depth > 1 ? keyOf(above) : null;
      return { ...row, key: fold, agent: agent.agent_type, sub: depth > 0, fold, parent };
    });
  });
}

/** A Bash kind in words, an MCP server by its name, which may read like a kind. */
export function kindLabel(row: Pick<ToolRow, 'tool' | 'kind'>, labels: Record<string, string>): string {
  const kind = row.kind ?? '';
  return row.tool === 'Bash' && Object.hasOwn(labels, kind) ? (labels[kind] ?? kind) : kind;
}

/** A detail that is empty: a command without a program, a file without a type, a pattern matching more than one, a
 *  skill without a name. */
export function emptyDetail(row: Pick<ToolRow, 'tool' | 'kind'>): string {
  if (row.kind !== null) return '(none)';
  const words: Record<string, string> = { Glob: 'no single type', Skill: 'no name' };
  return Object.hasOwn(words, row.tool) ? (words[row.tool] ?? 'no type') : 'no type';
}

const KIND_NOUNS: Record<string, [string, string]> = {
  inline_script: ['interpreter', 'interpreters'],
  git: ['subcommand', 'subcommands'],
};
const TOOL_NOUNS: Record<string, [string, string]> = {
  Grep: ['output mode', 'output modes'],
  Agent: ['subagent type', 'subagent types'],
  Task: ['subagent type', 'subagent types'],
  Skill: ['skill', 'skills'],
};

/** What a row's details are, for the count on its fold. */
export function detailNoun(row: Pick<ToolRow, 'tool' | 'kind' | 'detail'>, count: number): string {
  const kind = row.kind ?? '';
  let nouns: [string, string];
  if (row.detail !== null) nouns = ['option set', 'option sets'];
  else if (row.kind === null) {
    nouns = (Object.hasOwn(TOOL_NOUNS, row.tool) && TOOL_NOUNS[row.tool]) || ['file type', 'file types'];
  }
  else if (row.tool === 'MCP') nouns = ['tool', 'tools'];
  else nouns = (Object.hasOwn(KIND_NOUNS, kind) && KIND_NOUNS[kind]) || ['program', 'programs'];
  return count === 1 ? nouns[0] : nouns[1];
}

/** A row's class: a sub-row under the row it splits from, a group row where the next row splits from it. */
export function toolRowClass(row: Pick<ToolRow, 'sub'>, next: Pick<ToolRow, 'sub'> | undefined): string | null {
  if (row.sub) return 'sub-row';
  return next?.sub ? 'group-row' : null;
}

/** The name cell: its text and the class that indents it by what it is (options, a detail, a kind, or the tool). */
export function toolRowName(row: ToolRow): { className: string | null; text: string } {
  // a file tool's details sit one step less deep: they have no kind above them
  const depth = row.kind === null ? ' under-tool' : '';
  if (row.options !== null) return { className: `tool-options${depth}`, text: row.options || 'no options' };
  if (row.detail !== null) return { className: `tool-detail${depth}`, text: row.detail || emptyDetail(row) };
  if (row.sub) return { className: 'tool-kind', text: kindLabel(row, TOOL_KINDS) };
  return { className: null, text: row.tool };
}

/** A fold that opens a row's details: its key, the row it is on, how many rows it holds and what its button says. */
export interface ToolFold {
  fold: string;
  /** Index in the rows of the row that splits. */
  row: number;
  members: number;
  label: string;
}

/**
 * Which rows fold under which: `above[i]` is row `i`'s folds from the outermost in, and each row that others split
 * from is a fold with the count of rows directly under it. A row whose parent isn't in the table counts as shown
 * always.
 */
export function toolFolds(rows: ToolRow[]): { above: string[][]; folds: ToolFold[] } {
  const known = new Map<string, { above: string[]; row: number; members: number }>();
  const above = rows.map((row, index) => {
    const parent = row.parent === null ? undefined : known.get(row.parent);
    const folds = row.parent !== null && parent ? [...parent.above, row.parent] : [];
    if (parent) parent.members += 1;
    if (row.fold) known.set(row.fold, { above: folds, row: index, members: 0 });
    return folds;
  });
  const folds: ToolFold[] = [];
  for (const [fold, { row, members }] of known) {
    const source = rows[row];
    if (!members || !source) continue;
    folds.push({ fold, row, members, label: `${whole(members)} ${detailNoun(source, members)}` });
  }
  return { above, folds };
}

/** A row shows while every fold above it is open, so closing one hides what was open under it too. */
export function toolRowShown(above: string[], open: ReadonlySet<string>): boolean {
  return above.every((fold) => open.has(fold));
}

// --- the conversation -----------------------------------------------------------------------------------------

/**
 * Newest first by default: the calls in reverse, each call's entries (one message id) kept in their order, so its
 * thinking, text and tools still lead to its usage badge; prompts, hidden context and markers stand alone.
 */
export function orderedEntries<T extends Pick<ChatEntry, 'message_id'>>(entries: T[], oldest: boolean): T[] {
  if (oldest) return entries;
  const groups: T[][] = [];
  for (const entry of entries) {
    const last = groups[groups.length - 1];
    if (entry.message_id && last?.[0]?.message_id === entry.message_id) last.push(entry);
    else groups.push([entry]);
  }
  return groups.reverse().flat();
}

/** An entry's key: where it is in the transcript, which a refresh keeps (by time, kind and position) and the order
 *  doesn't change. */
export function entryKey(entry: Pick<ChatEntry, 'timestamp' | 'kind'>, position: number): string {
  return `${entry.timestamp} ${entry.kind} ${position}`;
}

/** The entries in the order shown, each with its key. */
export function chatRows<T extends Pick<ChatEntry, 'message_id' | 'timestamp' | 'kind'>>(
  entries: T[],
  oldest: boolean,
): { key: string; entry: T }[] {
  const position = new Map(entries.map((entry, index) => [entry, index]));
  return orderedEntries(entries, oldest).map((entry) => ({ key: entryKey(entry, position.get(entry) ?? 0), entry }));
}

/** The conversation takes the Tools table's place while the session's transcript exists, the tools at the end then;
 *  without it the conversation, which can only say it is gone, stays last. */
export function toolsAndChat<T>(transcript: boolean, tools: T, chat: T): T[] {
  return transcript ? [chat, tools] : [tools, chat];
}

// --- usage tables ---------------------------------------------------------------------------------------------

/** Dearest first, the row with more turns first among equals, a row without a price after the priced ones. */
export function byCost(
  left: { cost: number | null; turns: number },
  right: { cost: number | null; turns: number },
): number {
  return (right.cost ?? -1) - (left.cost ?? -1) || right.turns - left.turns;
}

/** The columns every usage table has after its name. */
export const USAGE_COLUMNS: { label: string; numeric: boolean }[] = [
  { label: 'Turns', numeric: true },
  { label: 'Input', numeric: true },
  { label: 'Cache read %', numeric: true },
  { label: 'Output', numeric: true },
  { label: 'Cost', numeric: true },
];

/** A usage row's cells in `USAGE_COLUMNS`. */
export function usageCells(
  row: Pick<Usage, 'turns' | 'new_input' | 'cache_write' | 'cache_read' | 'output' | 'cost'>,
): string[] {
  const input = inputTotal(row);
  return [whole(row.turns), compact(input), percent(row.cache_read, input), compact(row.output), money(row.cost)];
}
