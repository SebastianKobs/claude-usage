import { describe, expect, test } from 'vitest';
import type { CompactHint, ToolField } from './api';
import {
  compactChip,
  compactionText,
  contextChange,
  costText,
  cutNote,
  diffText,
  fenceLanguage,
  fieldLines,
  hintBlock,
  injectedCount,
  injectedKind,
  isReminder,
  languageOfFile,
  markerText,
  modelNote,
  prettyJson,
  promptBody,
  rebuildChip,
  reminderTitle,
  resultLabel,
  roleOf,
  toolInput,
  toolResult,
  toolStatus,
  toolSummary,
  usageParts,
  usageTint,
  versusKeepingParts,
} from './entries';
import { callUsage, versusKeeping } from './fixtures';

function field(name: string, value: string, chars = value.length, isJson = false): ToolField {
  return { name, value, chars, is_json: isJson };
}

describe('the head of an entry', () => {
  test('names who speaks, and the kind itself where it has no label', () => {
    expect([roleOf('prompt'), roleOf('text'), roleOf('thinking'), roleOf('tool')]).toEqual([
      'You',
      'Claude',
      'Thinking',
      'tool',
    ]);
  });

  test('says the model and the effort a reply was written at', () => {
    expect(modelNote({ kind: 'text', model: 'claude-opus-5-5', effort: 'high' })).toBe(
      'claude-opus-5-5 · effort high',
    );
    expect(modelNote({ kind: 'text', model: 'claude-opus-5-5', effort: null })).toBe('claude-opus-5-5');
    expect(modelNote({ kind: 'thinking', model: null, effort: 'max' })).toBe('effort max');
    expect(modelNote({ kind: 'text', model: null, effort: null })).toBe('');
  });

  test('says nothing of the model for a prompt', () => {
    expect(modelNote({ kind: 'prompt', model: 'claude-opus-5-5', effort: 'high' })).toBe('');
  });

  test('says how much of a cut text shows, and nothing for a whole one', () => {
    expect(cutNote('abc', 3)).toBe('');
    expect(cutNote('abc', 4)).toBe(' · first 3 of 4 characters');
    expect(cutNote('x'.repeat(4000), 12_345)).toBe(' · first 4,000 of 12,345 characters');
  });
});

describe('a prompt', () => {
  test('is a slash command as typed, with its arguments', () => {
    expect(promptBody('<command-name>/compact</command-name><command-args>keep the plan</command-args>')).toEqual({
      kind: 'command',
      text: '/compact keep the plan',
    });
  });

  test('is a slash command with the spaces around its name and arguments dropped', () => {
    expect(promptBody('<command-name> /x </command-name><command-args> a b </command-args>')).toEqual({
      kind: 'command',
      text: '/x a b',
    });
  });

  test('is a slash command without arguments or with empty ones', () => {
    expect(promptBody('<command-name> /clear </command-name>')).toEqual({ kind: 'command', text: '/clear' });
    expect(promptBody('<command-name>/clear</command-name><command-args></command-args>')).toEqual({
      kind: 'command',
      text: '/clear',
    });
  });

  test('is JSON pretty-printed where the whole prompt is JSON', () => {
    expect(promptBody(' {"a":1,"b":[2]} ')).toEqual({ kind: 'json', code: '{\n  "a": 1,\n  "b": [\n    2\n  ]\n}' });
    expect(promptBody('[1]')).toEqual({ kind: 'json', code: '[\n  1\n]' });
  });

  test('is markdown where it only starts like JSON', () => {
    expect(promptBody('{not json} at all')).toEqual({ kind: 'markdown', text: '{not json} at all' });
    expect(promptBody('[link](x) and more')).toEqual({ kind: 'markdown', text: '[link](x) and more' });
  });

  test('is markdown otherwise, as it was written', () => {
    expect(promptBody('fix the **bug**\nplease')).toEqual({ kind: 'markdown', text: 'fix the **bug**\nplease' });
  });

  test('prettyJson gives only whole documents', () => {
    expect(prettyJson('{"a":1}')).toBe('{\n  "a": 1\n}');
    expect(prettyJson('42')).toBeNull();
    expect(prettyJson('{"a":')).toBeNull();
  });
});

describe('the language of code', () => {
  test('follows the file name, then its suffix in any case', () => {
    expect(languageOfFile('/repo/Makefile')).toBe('makefile');
    expect(languageOfFile('/repo/Dockerfile')).toBe('bash');
    expect(languageOfFile('/home/u/.bashrc')).toBe('bash');
    expect(languageOfFile('/repo/app/main.PY')).toBe('python');
    expect(languageOfFile('a.tsx')).toBe('typescript');
    expect(languageOfFile('notes.md')).toBe('markdown');
  });

  test('is none for a file without a known suffix, a hidden file or no path', () => {
    expect(languageOfFile('/repo/LICENSE')).toBeNull();
    expect(languageOfFile('/repo/.gitignore')).toBeNull();
    expect(languageOfFile('/repo/.py')).toBeNull();
    expect(languageOfFile('/repo/data.unknown')).toBeNull();
    expect(languageOfFile('')).toBeNull();
    expect(languageOfFile(null)).toBeNull();
    expect(languageOfFile(undefined)).toBeNull();
  });

  test('of a fence is a suffix as its language, else the name as written', () => {
    expect(fenceLanguage('py')).toBe('python');
    expect(fenceLanguage('python')).toBe('python');
    expect(fenceLanguage('klingon')).toBe('klingon');
    expect(fenceLanguage(undefined)).toBeNull();
    expect(fenceLanguage('')).toBeNull();
  });
});

describe('a tool call', () => {
  test("says what a Bash call does in its description, else the entry's summary", () => {
    const fields = [field('command', 'ls'), field('description', 'List files')];
    expect(toolSummary({ tool: 'Bash', summary: 'ls', tool_fields: fields })).toBe('List files');
    expect(toolSummary({ tool: 'Bash', summary: 'ls', tool_fields: [field('command', 'ls')] })).toBe('ls');
    expect(toolSummary({ tool: 'Read', summary: 'a.py', tool_fields: fields })).toBe('a.py');
    expect(toolSummary({ tool: 'Read', summary: null, tool_fields: [] })).toBe('');
  });

  test('says how it went', () => {
    expect(toolStatus({ result: null, is_error: false })).toBe(' · no result yet');
    expect(toolStatus({ result: 'x', is_error: true })).toBe(' · ⚠ failed');
    expect(toolStatus({ result: 'x', is_error: false })).toBe('');
    expect(toolStatus({ result: '', is_error: false })).toBe('');
  });

  test('labels each field with how much of it shows, and tells JSON, blocks and lines apart', () => {
    const lines = fieldLines([
      field('flag', 'yes'),
      field('text', 'a\nb', 10),
      field('body', '{"a":1}', 7, true),
      field('rows', '{\n"a":1\n}', 9, true),
    ]);
    expect(lines.map((line) => line.label)).toEqual(['flag', 'text · first 3 of 10 characters', 'body', 'rows']);
    expect(lines.map((line) => line.shape)).toEqual(['line', 'block', 'json', 'json']);
    expect(lines.map((line) => line.inline)).toEqual([true, false, true, false]);
  });

  test('shows an Edit as one diff: every old line with -, every new one with +', () => {
    expect(diffText('a\nb', 'c')).toBe('- a\n- b\n+ c');
    expect(diffText('', 'new')).toBe('+ new');
    expect(diffText('old', '')).toBe('- old');
  });

  test("shows a Bash call's command with its description and the rest of its fields", () => {
    const input = toolInput({
      tool: 'Bash',
      tool_fields: [
        field('command', 'ls -la', 9),
        field('description', 'List'),
        field('timeout', '5000'),
      ],
    });
    expect(input).toMatchObject({
      kind: 'bash',
      description: 'List',
      label: 'Command · first 6 of 9 characters',
      command: 'ls -la',
    });
    if (input.kind !== 'bash') throw new Error('not bash');
    expect(input.rest.map((line) => line.name)).toEqual(['timeout']);
  });

  test('shows a Bash call without a description', () => {
    const input = toolInput({ tool: 'Bash', tool_fields: [field('command', 'ls')] });
    expect(input).toMatchObject({ kind: 'bash', description: null, label: 'Command', rest: [] });
  });

  test('shows an Edit as a change of its file, cut notes on either side', () => {
    const input = toolInput({
      tool: 'Edit',
      tool_fields: [
        field('file_path', '/a/b.py'),
        field('old_string', 'x'),
        field('new_string', 'y'),
        field('replace_all', 'true'),
      ],
    });
    expect(input).toMatchObject({ kind: 'edit', path: '/a/b.py', label: 'Change', diff: '- x\n+ y' });
    if (input.kind !== 'edit') throw new Error('not an edit');
    expect(input.rest.map((line) => line.name)).toEqual(['replace_all']);
    const cut = toolInput({
      tool: 'Edit',
      tool_fields: [field('file_path', '/a/b.py'), field('old_string', 'x', 9_000), field('new_string', 'y')],
    });
    expect(cut).toMatchObject({ label: 'Change · cut to the first 4,000 characters of each side' });
    const newCut = toolInput({
      tool: 'Edit',
      tool_fields: [field('file_path', '/a'), field('old_string', 'x'), field('new_string', 'y', 9_000)],
    });
    expect(newCut).toMatchObject({ label: 'Change · cut to the first 4,000 characters of each side' });
  });

  test('shows an Edit with only one side, and not one without either', () => {
    const newOnly = toolInput({ tool: 'Edit', tool_fields: [field('file_path', '/a'), field('new_string', 'y')] });
    expect(newOnly).toMatchObject({ kind: 'edit', diff: '+ y' });
    expect(toolInput({ tool: 'Edit', tool_fields: [field('file_path', '/a')] }).kind).toBe('fields');
  });

  test('shows a Write as its file with the content in its language', () => {
    const input = toolInput({
      tool: 'Write',
      tool_fields: [field('file_path', '/a/run.sh'), field('content', 'echo', 10)],
    });
    expect(input).toMatchObject({
      kind: 'write',
      path: '/a/run.sh',
      label: 'Content · first 4 of 10 characters',
      content: 'echo',
      language: 'bash',
      rest: [],
    });
  });

  test('shows the fields of any other call, or of a Bash, Edit or Write call without its main fields', () => {
    const plain = toolInput({ tool: 'Grep', tool_fields: [field('pattern', 'x')] });
    expect(plain).toMatchObject({ kind: 'fields', label: 'Input' });
    expect(toolInput({ tool: 'Bash', tool_fields: [field('description', 'x')] }).kind).toBe('fields');
    expect(toolInput({ tool: 'Grep', tool_fields: [field('command', 'ls')] }).kind).toBe('fields');
    expect(toolInput({ tool: 'Write', tool_fields: [field('file_path', '/a')] }).kind).toBe('fields');
    expect(toolInput({ tool: 'Read', tool_fields: [] })).toEqual({ kind: 'fields', label: 'Input', rest: [] });
  });

  test('shows a whole JSON result pretty-printed and highlighted', () => {
    const entry = { tool: 'Grep', tool_fields: [], result: '{"a":1}', result_chars: 7, is_error: false };
    expect(toolResult(entry)).toEqual({ kind: 'code', code: '{\n  "a": 1\n}', language: 'json' });
  });

  test('shows a cut JSON result as text, since it is no longer a document', () => {
    const entry = { tool: 'Grep', tool_fields: [], result: '[1, 2]', result_chars: 9_000, is_error: false };
    expect(toolResult(entry)).toEqual({ kind: 'text', text: '[1, 2]' });
  });

  test("shows a Read's result in its file's language", () => {
    const entry = {
      tool: 'Read',
      tool_fields: [field('file_path', '/a/b.py')],
      result: 'print(1)',
      result_chars: 8,
      is_error: false,
    };
    expect(toolResult(entry)).toEqual({ kind: 'code', code: 'print(1)', language: 'python' });
    expect(toolResult({ ...entry, tool_fields: [field('file_path', '/a/LICENSE')] })).toEqual({
      kind: 'code',
      code: 'print(1)',
      language: null,
    });
  });

  test('shows a failed Read, or a Read without a file, as text', () => {
    const entry = {
      tool: 'Read',
      tool_fields: [field('file_path', '/a/b.py')],
      result: 'No such file',
      result_chars: 12,
      is_error: true,
    };
    expect(toolResult(entry)).toEqual({ kind: 'text', text: 'No such file' });
    expect(toolResult({ ...entry, tool_fields: [], is_error: false })).toEqual({ kind: 'text', text: 'No such file' });
  });

  test('shows any other result as text', () => {
    const entry = { tool: 'Bash', tool_fields: [], result: 'done\n', result_chars: 5, is_error: false };
    expect(toolResult(entry)).toEqual({ kind: 'text', text: 'done\n' });
  });

  test('labels the result with how much of it shows', () => {
    expect(resultLabel({ result: 'abc', result_chars: 3 })).toBe('Result');
    expect(resultLabel({ result: 'abc', result_chars: 5_000 })).toBe('Result · first 3 of 5,000 characters');
  });
});

describe('hidden context', () => {
  test('names the kinds that are no attachment type, and spells out an attachment type', () => {
    expect(injectedKind('meta')).toBe('meta record');
    expect(injectedKind('skill')).toBe('skill text');
    expect(injectedKind('summary')).toBe('compact summary');
    expect(injectedKind('hook_success')).toBe('hook success');
    expect(injectedKind('todo_reminder')).toBe('todo reminder');
  });

  test('counts its items and characters', () => {
    expect(injectedCount([{ chars: 86 }])).toBe('1 item · 86 characters');
    expect(injectedCount([{ chars: 1_000 }, { chars: 234 }])).toBe('2 items · 1,234 characters');
  });
});

describe('a compaction or an error', () => {
  const marker = { trigger: 'auto', pre_tokens: 150_000, post_tokens: 5_000, duration_ms: 65_000 };

  test('says how it was triggered, the context before and after, and how long it took', () => {
    const entry = { text: 'Conversation compacted', compaction: marker, versus_keeping: null };
    expect(compactionText(entry)).toBe('Conversation compacted · auto · 150K → 5K tokens · took 1 min 5 s');
  });

  test("says the next call's context where it is known", () => {
    const entry = { text: 'Compacted', compaction: marker, versus_keeping: versusKeeping({ after: 40_000 }) };
    expect(compactionText(entry)).toBe('Compacted · auto · 150K → next call 40K · took 1 min 5 s');
  });

  test('leaves out what its record does not have', () => {
    const bare = { trigger: null, pre_tokens: null, post_tokens: null, duration_ms: null };
    expect(compactionText({ text: 'Compacted', compaction: bare, versus_keeping: null })).toBe('Compacted');
    expect(compactionText({ text: 'Compacted', compaction: null, versus_keeping: null })).toBe('Compacted');
    const zero = { ...marker, pre_tokens: 0, duration_ms: 0 };
    expect(compactionText({ text: 'C', compaction: zero, versus_keeping: null })).toBe('C · auto · 0 → 5K tokens');
  });

  test('says an API error with its text', () => {
    expect(markerText({ kind: 'error', text: 'rate_limit', compaction: null, versus_keeping: null })).toBe(
      '⚠ API error: rate_limit',
    );
    expect(markerText({ kind: 'compaction', text: 'Compacted', compaction: marker, versus_keeping: null })).toContain(
      'Compacted · auto',
    );
  });

  test("lists what follows the verdict: the break-even, the calls after, the one-time cost", () => {
    expect(versusKeepingParts(versusKeeping())).toBe('paid off at call 5 · 40 calls after · cost ~$0.30 once');
    expect(versusKeepingParts(versusKeeping({ verdict: 'forced' }))).toBe('40 calls after · cost ~$0.30 once');
  });
});

describe("a call's usage", () => {
  test('splits the context change into the previous reply and what was added, so the parts add up', () => {
    expect(contextChange(callUsage({ growth: 5_900, reply: 414 }))).toBe(' (+6.3K: reply 414, added 5.9K)');
  });

  test('says the change alone where there was no reply to send again', () => {
    expect(contextChange(callUsage({ growth: 2_000, reply: 0 }))).toBe(' (+2K)');
    expect(contextChange(callUsage({ growth: 2_000, reply: null }))).toBe(' (+2K)');
  });

  test('signs a change that shrank, in the added part too', () => {
    expect(contextChange(callUsage({ growth: -3_000, reply: 0 }))).toBe(' (−3K)');
    expect(contextChange(callUsage({ growth: -1_000, reply: 400 }))).toBe(' (−600: reply 400, added −1K)');
  });

  test('says nothing without a growth (a first call)', () => {
    expect(contextChange(callUsage({ growth: null }))).toBe('');
  });

  test('lists the context, the new input and the output, with the cache only where it was used', () => {
    expect(usageParts(callUsage())).toEqual([
      'context 50K (+2.5K: reply 500, added 2K)',
      'in 1K',
      'cache write 4K',
      'cache read 45K',
      'out 500',
    ]);
    const bare = usageParts(callUsage({ cache_write: 0, cache_read: 0, growth: null }));
    expect(bare).toEqual(['context 50K', 'in 1K', 'out 500']);
  });

  test('adds web searches, and fast mode where the speed is not standard', () => {
    expect(usageParts(callUsage({ web_searches: 1_200, speed: 'fast' })).slice(-2)).toEqual([
      '1,200 web searches',
      'fast mode',
    ]);
    expect(usageParts(callUsage({ web_searches: 0, speed: 'standard' })).join()).not.toContain('fast');
  });

  test('says the cost, or that there is no price', () => {
    expect(costText(callUsage({ cost: 0.25 }))).toBe('$0.25');
    expect(costText(callUsage({ cost: null }))).toBe('no price');
    expect(costText(callUsage({ cost: 0 }))).toBe('$0.00');
  });

  test("explains the token reminder's characters, where there are any", () => {
    expect(reminderTitle(callUsage({ reminder_chars: 0 }))).toBeNull();
    expect(reminderTitle(callUsage({ reminder_chars: 1_720 }))).toBe(
      "The context includes Claude Code's token reminder (1,720 characters)",
    );
  });

  test('says what a cache rebuild cost and why', () => {
    expect(rebuildChip({ cause: 'idle', lost: 80_000, extra_cost: 0.5 })).toEqual({
      text: '↻ cache rebuilt (idle) · 80K · +$0.50',
      title: '80K tokens written to the cache again: the cache expired while idle',
    });
    expect(rebuildChip({ cause: 'model', lost: 1_000, extra_cost: null }).text).toBe('↻ cache rebuilt (model) · 1K');
  });
});

describe('the hints to compact', () => {
  const soft: CompactHint = { kind: 'soft', context: 210_000, threshold: 200_000, reread_cost: 0.3 };
  const softAgain: CompactHint = { kind: 'soft_reminder', context: 300_000, threshold: 200_000, times: 1.5 };
  const pays: CompactHint = {
    kind: 'pays',
    context: 300_000,
    pays_off_in: 12,
    calls_ahead: 40,
    ahead_from: 'longer',
    one_time: 0.6,
    after: 50_000,
  };
  const paysAgain: CompactHint = { kind: 'pays_reminder', context: 450_000, pays_off_in: 9 };
  const auto: CompactHint = { kind: 'auto', context: 850_000, auto_compact: 1_000_000, share: 0.85 };
  const autoAgain: CompactHint = { kind: 'auto_reminder', context: 900_000, auto_compact: 1_000_000, share: 0.9 };

  test('tells a reminder from a first hint', () => {
    expect([soft, pays, auto].map((hint) => isReminder(hint))).toEqual([false, false, false]);
    expect([softAgain, paysAgain, autoAgain].map((hint) => isReminder(hint))).toEqual([true, true, true]);
    expect(isReminder(undefined)).toBe(false);
  });

  test('tints the badge by its reminder, and not at all without one', () => {
    expect(usageTint(undefined)).toBe('');
    expect(usageTint(soft)).toBe('');
    expect(usageTint(softAgain)).toBe('chat-usage-remind');
    expect(usageTint(paysAgain)).toBe('chat-usage-remind-pays');
    expect(usageTint(autoAgain)).toBe('chat-usage-remind-auto');
  });

  test('is a chip in the badge for a reminder, in its own tone', () => {
    expect(compactChip(softAgain)).toEqual({ tone: '', text: 'ℹ 300K · 1.5× your 200K hint' });
    expect(compactChip(paysAgain)).toEqual({
      tone: 'compact-chip-pays',
      text: '⚠ 450K · compacting pays after ~9 replies',
    });
    expect(compactChip(autoAgain)).toEqual({
      tone: 'compact-chip-auto',
      text: '⚠ 90% of auto-compact (1M)',
    });
  });

  test('is no block for a reminder', () => {
    expect(hintBlock(undefined)).toBeNull();
    expect(hintBlock(softAgain)).toBeNull();
    expect(hintBlock(paysAgain)).toBeNull();
    expect(hintBlock(autoAgain)).toBeNull();
  });

  test('is a soft block with what a turn cost in cache reads', () => {
    expect(hintBlock(soft)).toEqual({
      tone: '',
      label: 'ℹ Consider compacting',
      text:
        'Context 210K, over the 200K hint (a heuristic, [chat] compact_hint_tokens in config.toml). ' +
        'Every turn re-reads it: this turn cost $0.30 in cache reads. /compact, or /clear when the task changes.',
    });
    expect(hintBlock({ ...soft, reread_cost: 0 })?.text).not.toContain('this turn cost');
  });

  test('is a pays block with the size after, the cost once and when it pays back', () => {
    const block = hintBlock(pays);
    expect(block).toMatchObject({ tone: 'compact-pays', label: '⚠ Compacting pays on average' });
    expect(block?.text).toBe(
      'Context 300K, and every reply reads all of it again. /compact would shrink it to about 50K. ' +
        'That costs ~$0.60 once, and the cheaper replies pay it back within about 12 replies. ' +
        'After your past compactions, a stretch this long went on for about 40 more on average.',
    );
  });

  test('says where the replies ahead were learnt from', () => {
    expect(hintBlock({ ...pays, ahead_from: 'all' })?.text).toContain(
      'After your past compactions you went on for about 40 replies on average.',
    );
  });

  test('is an auto block with the share of the auto-compact point', () => {
    expect(hintBlock(auto)).toEqual({
      tone: 'compact-auto',
      label: '⚠ Compact soon',
      text:
        'Context 850K: 85% of the 1M where Claude Code auto-compacts. /compact now to choose what to keep.',
    });
  });
});
