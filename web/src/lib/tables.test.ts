import { expect, test } from 'vitest';
import type { ToolCount, ToolKindRow } from './api.ts';
import {
  chatRows,
  detailNoun,
  emptyDetail,
  entryKey,
  kindLabel,
  orderedEntries,
  pageSizeFrom,
  pageText,
  pageUnits,
  pageWindow,
  sessionCount,
  sessionMatches,
  sessionProjects,
  TOOL_KINDS,
  toolFolds,
  toolRowClass,
  toolRowName,
  toolRowShown,
  toolsAndChat,
  toolTableRows,
  type ToolRow,
} from './tables.ts';

// --- paging ---

test('a sub-row stays on the page of its group', () => {
  expect(pageUnits([false, true, true, false, false, true])).toEqual([0, 0, 0, 1, 2, 2]);
});

test('a first row that is a sub-row still starts a group', () => {
  expect(pageUnits([true, true, false])).toEqual([0, 0, 1]);
  expect(pageUnits([])).toEqual([]);
});

test('a page covers its share of the groups, the last one the rest', () => {
  expect(pageWindow(84, 10, 1)).toEqual({ page: 1, pages: 9, first: 10, last: 20 });
  expect(pageWindow(84, 25, 3)).toEqual({ page: 3, pages: 4, first: 75, last: 84 });
});

test('a page outside the pages falls back to the nearest, and no rows is one empty page', () => {
  expect(pageWindow(30, 25, 5).page).toBe(1);
  expect(pageWindow(30, 25, -1).page).toBe(0);
  expect(pageWindow(0, 25, 3)).toEqual({ page: 0, pages: 1, first: 0, last: 0 });
});

test('the pager names the rows shown, or the cards', () => {
  const shown = { page: 1, pages: 9, first: 10, last: 20 };
  expect(pageText(shown, 84)).toBe('rows 11–20 of 84');
  expect(pageText({ page: 0, pages: 30, first: 0, last: 10 }, 300, 'sessions')).toBe('sessions 1–10 of 300');
});

test('a saved page size counts only if it is offered', () => {
  expect(pageSizeFrom('50', [10, 25, 50], 25)).toBe(50);
  expect(pageSizeFrom('7', [10, 25, 50], 25)).toBe(25);
  expect([null, undefined, '', 'many'].map((saved) => pageSizeFrom(saved, [10, 25, 50], 25))).toEqual([25, 25, 25, 25]);
});

// --- the sessions list ---

const SESSIONS = [
  { session_id: 'abc-1', title: 'Parser fix', project: '/home/dev/app' },
  { session_id: 'def-2', title: null, project: '/home/dev/other' },
  { session_id: 'ghi-3', title: 'Chart colors', project: '/home/dev/app' },
];

const matching = (project: string, text: string): string[] =>
  SESSIONS.filter((session) => sessionMatches(session, project, text)).map((session) => session.session_id);

test('no filter keeps every session', () => {
  expect(matching('', '')).toEqual(['abc-1', 'def-2', 'ghi-3']);
  expect(matching('', '   ')).toEqual(['abc-1', 'def-2', 'ghi-3']);
});

test('a project keeps only its sessions', () => {
  expect(matching('/home/dev/app', '')).toEqual(['abc-1', 'ghi-3']);
});

test('every word must be in the title, project or id, in any case', () => {
  expect(matching('', 'parser')).toEqual(['abc-1']);
  expect(matching('', '  OTHER ')).toEqual(['def-2']);
  expect(matching('', 'ghi app')).toEqual(['ghi-3']);
  expect(matching('', 'parser other')).toEqual([]);
});

test('a session without a title is matched by its project and id, never by the word null', () => {
  expect(matching('', 'null')).toEqual([]);
});

test('the project and the words both count', () => {
  expect(matching('/home/dev/other', 'parser')).toEqual([]);
});

test('the projects to pick come by name with their sessions', () => {
  expect(sessionProjects(SESSIONS, '')).toEqual([
    { project: '/home/dev/app', count: 2 },
    { project: '/home/dev/other', count: 1 },
  ]);
});

test('a picked project stays on offer in a range without it', () => {
  expect(sessionProjects(SESSIONS.slice(0, 1), '/home/dev/gone')).toEqual([
    { project: '/home/dev/app', count: 1 },
    { project: '/home/dev/gone', count: 0 },
  ]);
  expect(sessionProjects([], '')).toEqual([]);
});

test('the count says how many of the ranges sessions show', () => {
  expect([sessionCount(84, 84), sessionCount(1, 1), sessionCount(12, 84), sessionCount(0, 1)]).toEqual([
    '84 sessions',
    '1 session',
    '12 of 84 sessions',
    '0 of 1 session',
  ]);
});

// --- the Tools table ---

const STORED: ToolCount[] = [{ tool: 'Bash', calls: 3, result_chars: 450 }];

function kindRow(
  tool: string,
  kind: string | null,
  calls: number,
  detail: string | null = null,
  options: string | null = null,
): ToolKindRow {
  return {
    tool,
    kind,
    detail,
    options,
    calls,
    errors: 1,
    result_chars: 90,
    result_median: 30,
    result_p90: 50,
    input_median: 12,
    calls_after_median: 4.5,
    carried: 0.01,
    input_cost: 0.002,
  };
}

const agentOf = (agentId: string | null, tool_kinds: ToolKindRow[] | null, agentType = 'main') => ({
  agent_id: agentId,
  agent_type: agentType,
  tools: STORED,
  tool_kinds,
});

test('every command kind has its words, and the words are the kinds the server names', () => {
  expect(Object.keys(TOOL_KINDS).sort()).toEqual(
    ['edit_in_place', 'git', 'inline_script', 'list', 'run', 'search', 'view', 'write_file'].sort(),
  );
});

test('Bash kinds are sub-rows under Bash, each carrying its agent and sizes', () => {
  const rows = toolTableRows([
    agentOf(null, [
      kindRow('Bash', null, 3),
      kindRow('Bash', 'search', 2),
      kindRow('Bash', 'view', 1),
      kindRow('Read', null, 1),
    ]),
  ]);
  expect(rows.map((row) => [row.tool, row.kind, row.sub])).toEqual([
    ['Bash', null, false],
    ['Bash', 'search', true],
    ['Bash', 'view', true],
    ['Read', null, false],
  ]);
  expect([rows[1]?.agent, rows[1]?.carried, rows[1]?.calls_after_median]).toEqual(['main', 0.01, 4.5]);
});

test('each row folds under the one it splits, but the kinds stay shown', () => {
  const rows = toolTableRows([
    agentOf(null, [
      kindRow('Bash', null, 3),
      kindRow('Bash', 'search', 2),
      kindRow('Bash', 'search', 2, 'grep'),
      kindRow('Bash', 'search', 2, 'grep', '-rn'),
    ]),
  ]);
  expect(rows.map((row) => row.sub)).toEqual([false, true, true, true]);
  expect(rows.map((row) => row.parent)).toEqual([null, null, rows[1]?.fold, rows[2]?.fold]);
  expect(new Set(rows.map((row) => row.fold)).size).toBe(4);
});

test('a tool without kinds folds its details itself', () => {
  const rows = toolTableRows([
    agentOf(null, [kindRow('Read', null, 2), kindRow('Read', null, 2, '.go'), kindRow('Read', null, 2, '.go', '')]),
  ]);
  expect(rows.map((row) => row.sub)).toEqual([false, true, true]);
  expect(rows.map((row) => row.parent)).toEqual([null, rows[0]?.fold, rows[1]?.fold]);
});

test('each agent has folds of its own', () => {
  const agent = (id: string | null): ReturnType<typeof agentOf> =>
    agentOf(id, [kindRow('Bash', null, 1), kindRow('Bash', 'list', 1), kindRow('Bash', 'list', 1, 'ls')]);
  const rows = toolTableRows([agent(null), agent('a1')]);
  expect(rows[2]?.parent).not.toBe(rows[5]?.parent);
  expect(new Set(rows.map((row) => row.key)).size).toBe(6);
});

test('a detail that is empty and one that is absent are different rows with different keys', () => {
  const rows = toolTableRows([agentOf(null, [kindRow('Read', null, 2, ''), kindRow('Read', null, 2, null, null)])]);
  expect(new Set(rows.map((row) => row.key)).size).toBe(2);
});

test('without the transcript the stored tools show, without what only it tells', () => {
  const [row, ...rest] = toolTableRows([agentOf(null, null, 'Explore')]);
  expect(rest).toEqual([]);
  expect(row).toMatchObject({
    agent: 'Explore',
    tool: 'Bash',
    calls: 3,
    result_chars: 450,
    sub: false,
    fold: null,
    parent: null,
    errors: null,
    carried: null,
    input_cost: null,
    calls_after_median: null,
  });
});

test('stored rows have keys of their own, never a kind row’s', () => {
  const rows = toolTableRows([agentOf(null, null), agentOf('a1', null), agentOf('a2', [kindRow('Bash', null, 1)])]);
  expect(new Set(rows.map((row) => row.key)).size).toBe(3);
});

test('the fold names what a row splits by', () => {
  const cases: [Partial<ToolRow> & Pick<ToolRow, 'tool'>, number, string][] = [
    [{ tool: 'Bash', kind: 'inline_script', detail: null }, 2, 'interpreters'],
    [{ tool: 'Bash', kind: 'git', detail: null }, 1, 'subcommand'],
    [{ tool: 'Bash', kind: 'search', detail: null }, 3, 'programs'],
    [{ tool: 'Bash', kind: 'search', detail: 'grep' }, 2, 'option sets'],
    [{ tool: 'Read', kind: null, detail: null }, 4, 'file types'],
    [{ tool: 'NotebookEdit', kind: null, detail: null }, 1, 'file type'],
    [{ tool: 'Read', kind: null, detail: '.go' }, 2, 'option sets'],
    [{ tool: 'Grep', kind: null, detail: null }, 2, 'output modes'],
    [{ tool: 'Glob', kind: null, detail: null }, 2, 'file types'],
    [{ tool: 'Agent', kind: null, detail: null }, 2, 'subagent types'],
    [{ tool: 'Task', kind: null, detail: null }, 1, 'subagent type'],
    [{ tool: 'Skill', kind: null, detail: null }, 3, 'skills'],
    [{ tool: 'MCP', kind: 'git', detail: null }, 2, 'tools'],
    [{ tool: 'MCP', kind: 'srv', detail: 'find' }, 2, 'option sets'],
  ];
  for (const [row, count, noun] of cases) {
    expect(detailNoun({ kind: null, detail: null, ...row }, count), JSON.stringify(row)).toBe(noun);
  }
});

test('a tool or kind named like a prototype property is no noun', () => {
  expect(detailNoun({ tool: 'toString', kind: null, detail: null }, 2)).toBe('file types');
  expect(detailNoun({ tool: 'Bash', kind: 'constructor', detail: null }, 2)).toBe('programs');
  expect(emptyDetail({ tool: 'constructor', kind: null })).toBe('no type');
});

test('an empty detail says what is missing', () => {
  expect(emptyDetail({ tool: 'Bash', kind: 'run' })).toBe('(none)');
  expect(emptyDetail({ tool: 'Read', kind: null })).toBe('no type');
  expect(emptyDetail({ tool: 'Glob', kind: null })).toBe('no single type');
  expect(emptyDetail({ tool: 'Skill', kind: null })).toBe('no name');
});

test('a kind is named in words for Bash and as it is for an MCP server', () => {
  const labels = { run: 'run a program' };
  expect(kindLabel({ tool: 'Bash', kind: 'run' }, labels)).toBe('run a program');
  expect(kindLabel({ tool: 'MCP', kind: 'run' }, labels)).toBe('run');
  expect(kindLabel({ tool: 'Bash', kind: 'unheard-of' }, labels)).toBe('unheard-of');
  expect(kindLabel({ tool: 'Bash', kind: 'constructor' }, labels)).toBe('constructor');
});

test('a name is indented by what the row is, a file tool’s details one step less', () => {
  const rows = toolTableRows([
    agentOf(null, [
      kindRow('Bash', null, 3),
      kindRow('Bash', 'search', 2),
      kindRow('Bash', 'search', 2, 'grep'),
      kindRow('Bash', 'search', 2, 'grep', '-rn'),
      kindRow('Bash', 'run', 1, ''),
      kindRow('Bash', 'run', 1, 'ls', ''),
      kindRow('Read', null, 2),
      kindRow('Read', null, 2, ''),
      kindRow('Read', null, 2, '.go', 'offset limit'),
    ]),
  ]);
  expect(rows.map((row) => toolRowName(row))).toEqual([
    { className: null, text: 'Bash' },
    { className: 'tool-kind', text: 'search' },
    { className: 'tool-detail', text: 'grep' },
    { className: 'tool-options', text: '-rn' },
    { className: 'tool-detail', text: '(none)' },
    { className: 'tool-options', text: 'no options' },
    { className: null, text: 'Read' },
    { className: 'tool-detail under-tool', text: 'no type' },
    { className: 'tool-options under-tool', text: 'offset limit' },
  ]);
});

test('a row is a sub-row, or a group row where the next one splits from it', () => {
  expect(toolRowClass({ sub: true }, undefined)).toBe('sub-row');
  expect(toolRowClass({ sub: false }, { sub: true })).toBe('group-row');
  expect(toolRowClass({ sub: false }, { sub: false })).toBeNull();
  expect(toolRowClass({ sub: false }, undefined)).toBeNull();
});

const GREP_ROWS = toolTableRows([
  agentOf(null, [
    kindRow('Bash', null, 9),
    kindRow('Bash', 'search', 4),
    kindRow('Bash', 'search', 3, 'grep'),
    kindRow('Bash', 'search', 3, 'grep', '-rn'),
    kindRow('Bash', 'search', 1, 'rg'),
    kindRow('Bash', 'view', 2),
    kindRow('Read', null, 1),
  ]),
]);

test('the folds count the rows directly under each and name what they are; the kinds have none above them', () => {
  const { folds } = toolFolds(GREP_ROWS);
  expect(folds.map((fold) => [GREP_ROWS[fold.row]?.detail, fold.members, fold.label])).toEqual([
    [null, 2, '2 programs'],
    ['grep', 1, '1 option set'],
  ]);
});

test('rows show while every fold above them is open', () => {
  const { above, folds } = toolFolds(GREP_ROWS);
  const [search, grep] = folds.map((fold) => fold.fold) as [string, string];
  const shown = (open: string[]): boolean[] => above.map((rowFolds) => toolRowShown(rowFolds, new Set(open)));
  // the kinds always show; their details hang under the kind's fold, the options under the detail's too
  expect(shown([])).toEqual([true, true, false, false, false, true, true]);
  expect(shown([search])).toEqual([true, true, true, false, true, true, true]);
  expect(shown([search, grep])).toEqual([true, true, true, true, true, true, true]);
  // closing the outer fold hides what was open under it too
  expect(shown([grep])).toEqual([true, true, false, false, false, true, true]);
});

test('a row whose parent is missing counts as shown always', () => {
  const [row] = toolTableRows([agentOf(null, [kindRow('Bash', 'search', 1, 'grep')])]);
  const { above, folds } = toolFolds(row ? [row] : []);
  expect(above).toEqual([[]]);
  expect(folds).toEqual([]);
});

// --- the conversation ---

const ENTRIES = [
  { kind: 'prompt', message_id: null, timestamp: 't0' },
  { kind: 'thinking', message_id: 'a', timestamp: 't1' },
  { kind: 'tool', message_id: 'a', timestamp: 't2' },
  { kind: 'injected', message_id: null, timestamp: null },
  { kind: 'text', message_id: 'b', timestamp: 't3' },
  { kind: 'text', message_id: 'c', timestamp: 't4' },
] as const;
const asEntries = [...ENTRIES] as unknown as Parameters<typeof chatRows>[0];

test('newest first keeps each call’s entries in their order', () => {
  const ordered = orderedEntries(asEntries, false);
  expect(ordered.map((entry) => [entry.kind, entry.message_id])).toEqual([
    ['text', 'c'],
    ['text', 'b'],
    ['injected', null],
    ['thinking', 'a'],
    ['tool', 'a'],
    ['prompt', null],
  ]);
});

test('oldest first is the transcript’s order, and the entries aren’t changed', () => {
  expect(orderedEntries(asEntries, true)).toEqual(asEntries);
  orderedEntries(asEntries, false);
  expect(asEntries.map((entry) => entry.kind)).toEqual(ENTRIES.map((entry) => entry.kind));
});

test('the entries of one message id that aren’t next to each other stay apart', () => {
  const entries = [
    { kind: 'text', message_id: 'a', timestamp: null },
    { kind: 'prompt', message_id: null, timestamp: null },
    { kind: 'text', message_id: 'a', timestamp: null },
  ] as unknown as Parameters<typeof chatRows>[0];
  expect(orderedEntries(entries, false).map((entry) => entry.kind)).toEqual(['text', 'prompt', 'text']);
});

test('a key is the time, kind and position in the transcript, in either order', () => {
  expect(entryKey({ timestamp: 't3', kind: 'text' }, 4)).toBe('t3 text 4');
  expect(chatRows(asEntries, false).map((row) => row.key)).toEqual([
    't4 text 5',
    't3 text 4',
    'null injected 3',
    't1 thinking 1',
    't2 tool 2',
    't0 prompt 0',
  ]);
  expect(chatRows(asEntries, true).map((row) => row.key)).toEqual(
    ENTRIES.map((entry, position) => `${entry.timestamp} ${entry.kind} ${position}`),
  );
});

test('the keys of a conversation are all different', () => {
  const same = Array.from({ length: 4 }, () => ({ kind: 'text', message_id: null, timestamp: 't' }));
  const keys = chatRows(same as unknown as Parameters<typeof chatRows>[0], false).map((row) => row.key);
  expect(new Set(keys).size).toBe(4);
});

test('the conversation takes the tools’ place while its transcript exists', () => {
  expect(toolsAndChat(true, 'tools', 'chat')).toEqual(['chat', 'tools']);
  expect(toolsAndChat(false, 'tools', 'chat')).toEqual(['tools', 'chat']);
});
