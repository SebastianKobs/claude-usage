// The conversation's entries: what each says, before any markup. A prompt, Claude's reply, its thinking, a tool call
// with its input and result, hidden context, a compaction or an API error, and under a call's last entry its usage
// badge with the hints to compact. All of it text, for the components to put in place.

import type { CallUsage, ChatEntry, CompactHint, Rebuild, ToolField, VersusKeeping } from '../api/api';
import { breakevenText, oneTimeText, REBUILD_CAUSES } from '../context/compact';
import { compact, duration, money, percent, signed, whole } from '../ui/format';

// --- the head of a prompt, a reply or a thought ---------------------------------------------------------------

const ROLES: Record<string, string> = { prompt: 'You', text: 'Claude', thinking: 'Thinking' };

/** Who speaks: the role's label, the entry's kind where it has none. */
export function roleOf(kind: string): string {
  return ROLES[kind] ?? kind;
}

/** The model and effort a reply was written at, beside its role; a prompt has none. */
export function modelNote(entry: Pick<ChatEntry, 'kind' | 'model' | 'effort'>): string {
  if (entry.kind === 'prompt') return '';
  return [entry.model, entry.effort ? `effort ${entry.effort}` : null].filter(Boolean).join(' · ');
}

/** What a text cut to a limit says: how much of it shows. Nothing where it is whole. */
export function cutNote(shown: string, total: number): string {
  return total > shown.length ? ` · first ${whole(shown.length)} of ${whole(total)} characters` : '';
}

// --- prompts --------------------------------------------------------------------------------------------------

// Claude Code stores a slash command as <command-name>/x</command-name> with its <command-args>
const COMMAND_TAG = /<command-name>([^<]*)<\/command-name>/;
const COMMAND_ARGS = /<command-args>([^<]*)<\/command-args>/;

/** A prompt as it is shown: a slash command as typed, one that is JSON as a whole pretty-printed, anything else as
 *  markdown with its line breaks kept. */
export type PromptBody =
  | { kind: 'command'; text: string }
  | { kind: 'json'; code: string }
  | { kind: 'markdown'; text: string };

/** What a prompt's text is. */
export function promptBody(text: string): PromptBody {
  const command = text.match(COMMAND_TAG);
  if (command) {
    const args = (text.match(COMMAND_ARGS) ?? [])[1] ?? '';
    return { kind: 'command', text: `${(command[1] ?? '').trim()} ${args.trim()}`.trim() };
  }
  const json = prettyJson(text);
  return json === null ? { kind: 'markdown', text } : { kind: 'json', code: json };
}

/** A whole JSON object or array, indented; null for anything else (text that only starts like one included). */
export function prettyJson(text: string): string | null {
  const trimmed = text.trim();
  if (!trimmed.startsWith('{') && !trimmed.startsWith('[')) return null;
  try {
    return JSON.stringify(JSON.parse(trimmed), null, 2);
  } catch {
    return null;
  }
}

// --- code: the highlight.js language of a file ----------------------------------------------------------------

// file extensions and the highlight.js language of their content (only languages in the library's common build)
const CODE_LANGUAGES: Record<string, string> = {
  py: 'python', js: 'javascript', mjs: 'javascript', cjs: 'javascript', jsx: 'javascript', ts: 'typescript',
  tsx: 'typescript', json: 'json', sh: 'bash', bash: 'bash', zsh: 'bash', php: 'php', rb: 'ruby', go: 'go',
  rs: 'rust', java: 'java', kt: 'kotlin', swift: 'swift', c: 'c', h: 'c', cpp: 'cpp', hpp: 'cpp', cs: 'csharp',
  css: 'css', scss: 'scss', less: 'less', html: 'xml', xml: 'xml', svg: 'xml', vue: 'xml', md: 'markdown',
  yml: 'yaml', yaml: 'yaml', toml: 'ini', ini: 'ini', cfg: 'ini', sql: 'sql', lua: 'lua', pl: 'perl', r: 'r',
  graphql: 'graphql', diff: 'diff', patch: 'diff', mk: 'makefile',
};
const FILE_NAMES: Record<string, string> = {
  Makefile: 'makefile', Dockerfile: 'bash', '.bashrc': 'bash', '.zshrc': 'bash',
};

/** The language a file's content is highlighted in, by its name or suffix; null where it isn't known. */
export function languageOfFile(path: string | null | undefined): string | null {
  if (!path) return null;
  const name = path.split('/').pop() ?? '';
  const byName = FILE_NAMES[name];
  if (byName) return byName;
  const dot = name.lastIndexOf('.');
  return dot > 0 ? (CODE_LANGUAGES[name.slice(dot + 1).toLowerCase()] ?? null) : null;
}

/** The language a markdown fence names: a file suffix's language, else the name as it is. */
export function fenceLanguage(name: string | undefined): string | null {
  if (!name) return null;
  return CODE_LANGUAGES[name] ?? name;
}

// --- tool calls -----------------------------------------------------------------------------------------------

/** A call's input fields by name. */
function fieldMap(entry: Pick<ChatEntry, 'tool_fields'>): Record<string, ToolField> {
  return Object.fromEntries((entry.tool_fields ?? []).map((field) => [field.name, field]));
}

/** What a call's summary line adds to its tool's name: a Bash call says what it does in its description. */
export function toolSummary(entry: Pick<ChatEntry, 'tool' | 'summary' | 'tool_fields'>): string {
  const description = fieldMap(entry).description;
  return (entry.tool === 'Bash' && description ? description.value : entry.summary) ?? '';
}

/** What a call's summary line says of how it went. */
export function toolStatus(entry: Pick<ChatEntry, 'result' | 'is_error'>): string {
  if (entry.result === null) return ' · no result yet';
  return entry.is_error ? ' · ⚠ failed' : '';
}

/** Old and new text of an Edit as one diff: every old line with "-", every new one with "+". */
export function diffText(before: string, after: string): string {
  const lines = (text: string): string[] => (text ? text.split('\n') : []);
  return [...lines(before).map((line) => `- ${line}`), ...lines(after).map((line) => `+ ${line}`)].join('\n');
}

/** A field's name with how much of its value shows, and whether it is one line, several, or JSON. */
export interface FieldLine {
  name: string;
  label: string;
  value: string;
  shape: 'json' | 'block' | 'line';
  /** JSON on a line of its own in `code`, not a block. */
  inline: boolean;
}

/** The fields as a list: JSON highlighted, several lines as a block, the rest inline. */
export function fieldLines(fields: ToolField[]): FieldLine[] {
  return fields.map((field) => {
    const multiline = field.value.includes('\n');
    return {
      name: field.name,
      label: `${field.name}${cutNote(field.value, field.chars)}`,
      value: field.value,
      shape: field.is_json ? 'json' : multiline ? 'block' : 'line',
      inline: !multiline,
    };
  });
}

/** A call's input as the component draws it: a Bash command, an Edit's diff, a Write's file, or the fields. */
export type ToolInput =
  | { kind: 'bash'; description: string | null; label: string; command: string; rest: FieldLine[] }
  | { kind: 'edit'; path: string; label: string; diff: string; rest: FieldLine[] }
  | { kind: 'write'; path: string; label: string; content: string; language: string | null; rest: FieldLine[] }
  | { kind: 'fields'; label: string; rest: FieldLine[] };

/** What a tool call's input shows: Bash, Edit and Write have a view of their own where their main fields are there. */
export function toolInput(entry: Pick<ChatEntry, 'tool' | 'tool_fields'>): ToolInput {
  const fields = fieldMap(entry);
  const all = entry.tool_fields ?? [];
  const rest = (names: string[]): FieldLine[] => fieldLines(all.filter((field) => !names.includes(field.name)));
  const { command, description, file_path: path, old_string: oldText, new_string: newText, content } = fields;
  if (entry.tool === 'Bash' && command) {
    return {
      kind: 'bash',
      description: description ? description.value : null,
      label: `Command${cutNote(command.value, command.chars)}`,
      command: command.value,
      rest: rest(['command', 'description']),
    };
  }
  if (entry.tool === 'Edit' && path && (oldText || newText)) {
    const before = oldText ?? { value: '', chars: 0 };
    const after = newText ?? { value: '', chars: 0 };
    const cut = before.chars > before.value.length || after.chars > after.value.length;
    return {
      kind: 'edit',
      path: path.value,
      label: `Change${cut ? ' · cut to the first 4,000 characters of each side' : ''}`,
      diff: diffText(before.value, after.value),
      rest: rest(['file_path', 'old_string', 'new_string']),
    };
  }
  if (entry.tool === 'Write' && path && content) {
    return {
      kind: 'write',
      path: path.value,
      label: `Content${cutNote(content.value, content.chars)}`,
      content: content.value,
      language: languageOfFile(path.value),
      rest: rest(['file_path', 'content']),
    };
  }
  return { kind: 'fields', label: 'Input', rest: fieldLines(all) };
}

/** A result as it is shown: a whole JSON document pretty-printed and highlighted, a Read by its file's language, else
 *  as text. */
export type ToolResult =
  | { kind: 'code'; code: string; language: string | null }
  | { kind: 'text'; text: string };

/** What a finished call's result shows. */
export function toolResult(
  entry: Pick<ChatEntry, 'tool' | 'tool_fields' | 'result' | 'result_chars' | 'is_error'>,
): ToolResult {
  const result = entry.result ?? '';
  if (entry.result_chars <= result.length) {
    const json = prettyJson(result);
    if (json !== null) return { kind: 'code', code: json, language: 'json' };
  }
  const path = fieldMap(entry).file_path;
  if (entry.tool === 'Read' && path && !entry.is_error) {
    return { kind: 'code', code: result, language: languageOfFile(path.value) };
  }
  return { kind: 'text', text: result };
}

/** The label over a result: how much of it shows. */
export function resultLabel(entry: Pick<ChatEntry, 'result' | 'result_chars'>): string {
  return `Result${cutNote(entry.result ?? '', entry.result_chars)}`;
}

// --- hidden context -------------------------------------------------------------------------------------------

// the kinds of hidden context that aren't an attachment type
const INJECTED_KINDS: Record<string, string> = { meta: 'meta record', skill: 'skill text', summary: 'compact summary' };

/** What a piece of hidden context is called: an attachment's type with spaces for underscores. */
export function injectedKind(kind: string): string {
  return INJECTED_KINDS[kind] ?? kind.replaceAll('_', ' ');
}

/** The summary line of hidden context: how many pieces and characters. */
export function injectedCount(items: { chars: number }[]): string {
  const chars = items.reduce((sum, item) => sum + item.chars, 0);
  return `${items.length === 1 ? '1 item' : `${whole(items.length)} items`} · ${whole(chars)} characters`;
}

// --- a compaction or an API error -----------------------------------------------------------------------------

/** A compaction's line: how it was triggered, the context before and after (the next call's, which carries the system
 *  prompt, tools and CLAUDE.md again, once known), and how long the summary took. */
export function compactionText(entry: Pick<ChatEntry, 'text' | 'compaction' | 'versus_keeping'>): string {
  const marker = entry.compaction ?? { trigger: null, pre_tokens: null, post_tokens: null, duration_ms: null };
  const parts = [entry.text ?? ''];
  if (marker.trigger) parts.push(marker.trigger);
  if (marker.pre_tokens !== null) {
    const after = entry.versus_keeping
      ? `next call ${compact(entry.versus_keeping.after)}`
      : `${compact(marker.post_tokens)} tokens`;
    parts.push(`${compact(marker.pre_tokens)} → ${after}`);
  }
  if (marker.duration_ms) parts.push(`took ${duration(marker.duration_ms)}`);
  return parts.join(' · ');
}

/** What a marker says: the error, or the compaction. */
export function markerText(entry: Pick<ChatEntry, 'kind' | 'text' | 'compaction' | 'versus_keeping'>): string {
  return entry.kind === 'error' ? `⚠ API error: ${entry.text ?? ''}` : compactionText(entry);
}

/** What follows "vs keeping:" and the verdict under a compaction: the break-even, the calls after, the cost once. */
export function versusKeepingParts(comparison: VersusKeeping): string {
  const parts = [
    breakevenText(comparison),
    `${whole(comparison.calls_after)} calls after`,
    `cost ${oneTimeText(comparison)} once`,
  ];
  return parts.filter(Boolean).join(' · ');
}

// --- a call's usage -------------------------------------------------------------------------------------------

function growthText(growth: number): string {
  return ` (${signed(growth)})`;
}

/** The context's change since the previous call, split into the previous reply (sent again) and what was added from
 *  outside (tool results, prompts, attachments), so the parts add up: " (+6.3K: reply 0.4K, added 5.9K)". */
export function contextChange(usage: Pick<CallUsage, 'growth' | 'reply'>): string {
  if (usage.growth === null || usage.growth === undefined) return '';
  if (!usage.reply) return growthText(usage.growth);
  const added = usage.growth < 0 ? signed(usage.growth) : compact(usage.growth);
  return ` (${signed(usage.reply + usage.growth)}: reply ${compact(usage.reply)}, added ${added})`;
}

/** What a call's usage badge lists after its cost, joined by " · ". */
export function usageParts(usage: CallUsage): string[] {
  const parts = [`context ${compact(usage.context)}${contextChange(usage)}`, `in ${compact(usage.new_input)}`];
  if (usage.cache_write) parts.push(`cache write ${compact(usage.cache_write)}`);
  if (usage.cache_read) parts.push(`cache read ${compact(usage.cache_read)}`);
  parts.push(`out ${compact(usage.output)}`);
  if (usage.web_searches) parts.push(`${whole(usage.web_searches)} web searches`);
  if (usage.speed !== 'standard') parts.push('fast mode');
  return parts;
}

/** The badge's price in bold, before what it used. */
export function costText(usage: Pick<CallUsage, 'cost'>): string {
  return usage.cost === null ? 'no price' : money(usage.cost);
}

/** What hovering a badge says, where the token reminder is part of the context. */
export function reminderTitle(usage: Pick<CallUsage, 'reminder_chars'>): string | null {
  return usage.reminder_chars
    ? `The context includes Claude Code's token reminder (${whole(usage.reminder_chars)} characters)`
    : null;
}

/** Whether a hint is a reminder at a milestone after the first one of its kind, which is a chip in the badge. */
export function isReminder(hint: CompactHint | undefined): boolean {
  return hint !== undefined && hint.kind.endsWith('_reminder');
}

/** A reminder tints the whole badge in its status color, so it reads at a glance while scrolling. */
export function usageTint(hint: CompactHint | undefined): string {
  if (hint?.kind === 'auto_reminder') return 'chat-usage-remind-auto';
  if (hint?.kind === 'pays_reminder') return 'chat-usage-remind-pays';
  return hint?.kind === 'soft_reminder' ? 'chat-usage-remind' : '';
}

/** A reminder chip at the end of the usage badge: its class, and its one short line. */
export function compactChip(hint: CompactHint): { tone: string; text: string } {
  if (hint.kind === 'auto_reminder') {
    return {
      tone: 'compact-chip-auto',
      text: `⚠ ${percent(hint.context, hint.auto_compact)} of auto-compact (${compact(hint.auto_compact)})`,
    };
  }
  if (hint.kind === 'pays_reminder') {
    return {
      tone: 'compact-chip-pays',
      text: `⚠ ${compact(hint.context)} · compacting pays after ~${hint.pays_off_in} replies`,
    };
  }
  if (hint.kind === 'soft_reminder') {
    return { tone: '', text: `ℹ ${compact(hint.context)} · ${hint.times}× your ${compact(hint.threshold)} hint` };
  }
  return { tone: '', text: '' };
}

/** What a cache rebuild's chip says, and what hovering it explains. */
export function rebuildChip(rebuild: Rebuild): { text: string; title: string } {
  const cost = rebuild.extra_cost === null ? '' : ` · +${money(rebuild.extra_cost)}`;
  return {
    text: `↻ cache rebuilt (${rebuild.cause}) · ${compact(rebuild.lost)}${cost}`,
    title: `${compact(rebuild.lost)} tokens written to the cache again: ${REBUILD_CAUSES[rebuild.cause]}`,
  };
}

/** A hint to compact where a call's context first crosses a threshold: soft at the configured heuristic, sterner where
 *  compacting likely pays for itself (learnt from past compactions), strongest near the point where Claude Code
 *  auto-compacts. The icon and label carry the meaning, not the color. */
export interface HintBlock {
  tone: '' | 'compact-pays' | 'compact-auto';
  label: string;
  text: string;
}

/** The block a first hint of its kind is, null for a reminder (a chip in the badge). */
export function hintBlock(hint: CompactHint | undefined): HintBlock | null {
  if (hint === undefined) return null;
  if (hint.kind === 'pays') {
    const ahead =
      hint.ahead_from === 'longer'
        ? `After your past compactions, a stretch this long went on for about ${hint.calls_ahead} more on average.`
        : `After your past compactions you went on for about ${hint.calls_ahead} replies on average.`;
    return {
      tone: 'compact-pays',
      label: '⚠ Compacting pays on average',
      text:
        `Context ${compact(hint.context)}, and every reply reads all of it again. /compact would shrink it to about ` +
        `${compact(hint.after)}. That costs ~${money(hint.one_time)} once, and the cheaper replies pay it back ` +
        `within about ${hint.pays_off_in} replies. ${ahead}`,
    };
  }
  if (hint.kind === 'auto') {
    return {
      tone: 'compact-auto',
      label: '⚠ Compact soon',
      text:
        `Context ${compact(hint.context)}: ${percent(hint.context, hint.auto_compact)} of the ` +
        `${compact(hint.auto_compact)} where Claude Code auto-compacts. /compact now to choose what to keep.`,
    };
  }
  if (hint.kind !== 'soft') return null;
  const cost = hint.reread_cost ? `: this turn cost ${money(hint.reread_cost)} in cache reads` : '';
  return {
    tone: '',
    label: 'ℹ Consider compacting',
    text:
      `Context ${compact(hint.context)}, over the ${compact(hint.threshold)} hint (a heuristic, [chat] ` +
      `compact_hint_tokens in config.toml). Every turn re-reads it${cost}. /compact, or /clear when the task changes.`,
  };
}
