// @vitest-environment jsdom
// The code blocks are highlighted by the real highlight.js, so that a language given shows in the markup.
import { render } from '@testing-library/svelte';
import { describe, expect, test } from 'vitest';
import type { ToolField } from '../lib/api';
import { chatEntry } from '../lib/fixtures';
import { when } from '../lib/format';
import ChatToolCall from './ChatToolCall.svelte';

const TIME = '2026-09-30T08:00:00.000Z';

function field(name: string, value: string, changes: Partial<ToolField> = {}): ToolField {
  return { name, value, chars: value.length, is_json: false, ...changes };
}

/** A finished call: its result is there and went well. */
function call(changes = {}) {
  return chatEntry({
    kind: 'tool',
    timestamp: TIME,
    text: null,
    tool: 'Grep',
    result: 'done',
    result_chars: 4,
    ...changes,
  });
}

const details = (container: HTMLElement) => container.querySelector('details.chat-tool') as HTMLDetailsElement;
const summary = (container: HTMLElement) => container.querySelector('details > summary') as HTMLElement;
const input = (container: HTMLElement) => container.querySelector('details > div') as HTMLElement;
const dl = (container: HTMLElement) => container.querySelector('dl.tool-fields');

describe('the summary line', () => {
  test('names the tool, what the Bash call does from its description, how it went and when', () => {
    const entry = call({
      tool: 'Bash',
      tool_fields: [field('command', 'ls'), field('description', 'List files')],
      is_error: true,
    });
    const { container } = render(ChatToolCall, { entry });
    expect(summary(container).textContent).toBe(`Bash List files · ⚠ failed ${when(TIME)}`);
  });

  test('the tool is bold and the time is muted', () => {
    const { container } = render(ChatToolCall, { entry: call() });
    expect(summary(container).querySelector('strong')?.textContent).toBe('Grep');
    expect(summary(container).querySelector('span.muted')?.textContent).toBe(when(TIME));
  });

  test('another tool says what its summary says', () => {
    const { container } = render(ChatToolCall, { entry: call({ summary: 'TODO in src' }) });
    expect(summary(container).textContent).toBe(`Grep TODO in src ${when(TIME)}`);
  });

  test('a Bash call without a description says its summary', () => {
    const entry = call({ tool: 'Bash', summary: 'ls -la', tool_fields: [field('command', 'ls -la')] });
    const { container } = render(ChatToolCall, { entry });
    expect(summary(container).textContent).toBe(`Bash ls -la ${when(TIME)}`);
  });

  test('a call with nothing to add has one space between its tool and the time', () => {
    const { container } = render(ChatToolCall, { entry: call({ tool: 'Read' }) });
    expect(summary(container).textContent).toBe(`Read ${when(TIME)}`);
  });

  test('a call without a result yet says so', () => {
    const { container } = render(ChatToolCall, { entry: call({ result: null, summary: 'x' }) });
    expect(summary(container).textContent).toBe(`Grep x · no result yet ${when(TIME)}`);
  });

  test('a call without a result or a summary says so after the tool', () => {
    const { container } = render(ChatToolCall, { entry: call({ result: null }) });
    expect(summary(container).textContent).toBe(`Grep · no result yet ${when(TIME)}`);
  });

  test('a failed call says so', () => {
    const { container } = render(ChatToolCall, { entry: call({ is_error: true }) });
    expect(summary(container).textContent).toBe(`Grep · ⚠ failed ${when(TIME)}`);
  });

  test('a call without a time says so as the page does elsewhere', () => {
    const { container } = render(ChatToolCall, { entry: call({ timestamp: null }) });
    expect(summary(container).querySelector('span.muted')?.textContent).toBe(when(null));
  });

  test('is closed until the reader opens it', () => {
    const { container } = render(ChatToolCall, { entry: call() });
    expect(details(container).open).toBe(false);
  });
});

describe('a Bash call', () => {
  const bash = (fields: ToolField[], changes = {}) => call({ tool: 'Bash', tool_fields: fields, ...changes });

  test('shows its description, the command label and the command as highlighted bash', () => {
    const fields = [field('command', 'if true; then echo hi; fi'), field('description', 'Say hi')];
    const { container } = render(ChatToolCall, { entry: bash(fields) });
    expect([...input(container).children].map((child) => child.className)).toEqual([
      'tool-description',
      'label',
      'code',
    ]);
    expect(input(container).querySelector('.tool-description')?.textContent).toBe('Say hi');
    expect(input(container).querySelector('.label')?.textContent).toBe('Command');
    const code = input(container).querySelector('pre.code > code.hljs');
    expect(code?.textContent).toBe('if true; then echo hi; fi');
    expect(code?.querySelector('span.hljs-keyword')?.textContent).toBe('if');
  });

  test('without a description has no description line', () => {
    const { container } = render(ChatToolCall, { entry: bash([field('command', 'ls')]) });
    expect(input(container).querySelector('.tool-description')).toBeNull();
    expect(input(container).firstElementChild?.className).toBe('label');
  });

  test('says how much of a long command shows', () => {
    const { container } = render(ChatToolCall, { entry: bash([field('command', 'ls -l', { chars: 10 })]) });
    expect(input(container).querySelector('.label')?.textContent).toBe('Command · first 5 of 10 characters');
  });

  test('lists its other fields, not the command or the description', () => {
    const fields = [field('command', 'sleep 1'), field('description', 'Wait'), field('timeout', '5000')];
    const { container } = render(ChatToolCall, { entry: bash(fields) });
    expect([...(dl(container)?.querySelectorAll('dt') ?? [])].map((term) => term.textContent)).toEqual(['timeout']);
  });

  test('has no field list without other fields', () => {
    const { container } = render(ChatToolCall, { entry: bash([field('command', 'ls')]) });
    expect(dl(container)).toBeNull();
  });

  test('without a command shows its fields like any tool`s', () => {
    const { container } = render(ChatToolCall, { entry: bash([field('description', 'Wait')]) });
    expect(input(container).querySelector('.label')?.textContent).toBe('Input');
    expect(input(container).querySelector('pre.code')).toBeNull();
    expect(dl(container)?.querySelector('dt')?.textContent).toBe('description');
  });
});

describe('an Edit call', () => {
  const edit = (fields: ToolField[]) => call({ tool: 'Edit', tool_fields: fields });
  const fields = [field('file_path', 'src/a.py'), field('old_string', 'old'), field('new_string', 'new')];

  test('shows the path, the change label and the change as a highlighted diff', () => {
    const { container } = render(ChatToolCall, { entry: edit(fields) });
    expect([...input(container).children].map((child) => child.className)).toEqual([
      'tool-description',
      'label',
      'code',
    ]);
    expect(input(container).querySelector('.tool-description')?.textContent).toBe('src/a.py');
    expect(input(container).querySelector('.label')?.textContent).toBe('Change');
    const code = input(container).querySelector('pre.code > code.hljs');
    expect(code?.textContent).toBe('- old\n+ new');
    expect(code?.querySelector('span.hljs-deletion')).not.toBeNull();
    expect(code?.querySelector('span.hljs-addition')).not.toBeNull();
  });

  test('says where a side was cut', () => {
    const cut = [field('file_path', 'a.py'), field('old_string', 'old', { chars: 9000 }), field('new_string', 'new')];
    const { container } = render(ChatToolCall, { entry: edit(cut) });
    expect(input(container).querySelector('.label')?.textContent).toBe(
      'Change · cut to the first 4,000 characters of each side',
    );
  });

  test('lists its other fields', () => {
    const { container } = render(ChatToolCall, { entry: edit([...fields, field('replace_all', 'true')]) });
    expect([...(dl(container)?.querySelectorAll('dt') ?? [])].map((term) => term.textContent)).toEqual([
      'replace_all',
    ]);
  });
});

describe('a Write call', () => {
  const write = (path: string) =>
    call({ tool: 'Write', tool_fields: [field('file_path', path), field('content', 'def f():\n    pass\n')] });

  test('shows the path, the content label and the content in its file`s language', () => {
    const { container } = render(ChatToolCall, { entry: write('src/a.py') });
    expect([...input(container).children].map((child) => child.className)).toEqual([
      'tool-description',
      'label',
      'code',
    ]);
    expect(input(container).querySelector('.tool-description')?.textContent).toBe('src/a.py');
    expect(input(container).querySelector('.label')?.textContent).toBe('Content');
    const code = input(container).querySelector('pre.code > code.hljs');
    expect(code?.textContent).toBe('def f():\n    pass\n');
    expect(code?.querySelector('span.hljs-keyword')?.textContent).toBe('def');
  });

  test('shows content of a file type it does not know as text', () => {
    const { container } = render(ChatToolCall, { entry: write('notes.unknown') });
    expect(input(container).querySelector('code.hljs')?.children).toHaveLength(0);
  });

  test('says how much of a long file shows', () => {
    const fields = [field('file_path', 'a.py'), field('content', 'x = 1', { chars: 20 })];
    const { container } = render(ChatToolCall, { entry: call({ tool: 'Write', tool_fields: fields }) });
    expect(input(container).querySelector('.label')?.textContent).toBe('Content · first 5 of 20 characters');
  });

  test('lists its other fields', () => {
    const fields = [field('file_path', 'a.py'), field('content', 'x = 1'), field('mode', '755')];
    const { container } = render(ChatToolCall, { entry: call({ tool: 'Write', tool_fields: fields }) });
    expect([...(dl(container)?.querySelectorAll('dt') ?? [])].map((term) => term.textContent)).toEqual(['mode']);
  });
});

describe('any other call, and the field list', () => {
  test('has the label Input and its fields, in order, each a term and its value', () => {
    const fields = [field('pattern', 'TODO'), field('path', 'src')];
    const { container } = render(ChatToolCall, { entry: call({ tool_fields: fields }) });
    expect(input(container).querySelector('.label')?.textContent).toBe('Input');
    expect(input(container).querySelector('.tool-description')).toBeNull();
    const list = dl(container) as HTMLElement;
    expect([...list.children].map((child) => `${child.tagName} ${child.textContent}`)).toEqual([
      'DT pattern',
      'DD TODO',
      'DT path',
      'DD src',
    ]);
  });

  test('has no list without fields', () => {
    const { container } = render(ChatToolCall, { entry: call({ tool_fields: [] }) });
    expect(input(container).querySelector('.label')?.textContent).toBe('Input');
    expect(dl(container)).toBeNull();
  });

  test('a one-line value is plain text', () => {
    const { container } = render(ChatToolCall, { entry: call({ tool_fields: [field('pattern', 'a < b')] }) });
    const value = container.querySelector('dd') as HTMLElement;
    expect(value.textContent).toBe('a < b');
    expect(value.children).toHaveLength(0);
  });

  test('a value of several lines is a block', () => {
    const { container } = render(ChatToolCall, { entry: call({ tool_fields: [field('text', 'a\nb')] }) });
    const value = container.querySelector('dd') as HTMLElement;
    expect([...value.children].map((child) => child.tagName)).toEqual(['PRE']);
    expect(value.querySelector('pre.code')?.textContent).toBe('a\nb');
    expect(value.querySelector('code')).toBeNull();
  });

  test('JSON on one line is highlighted inline, without a block', () => {
    const fields = [field('options', '{"a":1}', { is_json: true })];
    const { container } = render(ChatToolCall, { entry: call({ tool_fields: fields }) });
    const value = container.querySelector('dd') as HTMLElement;
    expect(value.querySelector('pre')).toBeNull();
    expect(value.querySelector('code.hljs')?.textContent).toBe('{"a":1}');
    expect(value.querySelector('code.hljs span.hljs-attr')).not.toBeNull();
  });

  test('JSON of several lines is a highlighted block', () => {
    const fields = [field('options', '{\n"a":1\n}', { is_json: true })];
    const { container } = render(ChatToolCall, { entry: call({ tool_fields: fields }) });
    const value = container.querySelector('dd') as HTMLElement;
    expect(value.querySelector('pre.code > code.hljs span.hljs-attr')).not.toBeNull();
  });

  test('says how much of a long value shows, in its term', () => {
    const { container } = render(ChatToolCall, { entry: call({ tool_fields: [field('query', 'abc', { chars: 9 })] }) });
    expect(container.querySelector('dt')?.textContent).toBe('query · first 3 of 9 characters');
  });
});

describe('the result', () => {
  test('has none while the call has no result yet', () => {
    const { container } = render(ChatToolCall, { entry: call({ result: null }) });
    expect(container.querySelectorAll('.label')).toHaveLength(1);
    expect(details(container).querySelector(':scope > pre')).toBeNull();
  });

  test('is a label and plain text after the input, inside the details', () => {
    const { container } = render(ChatToolCall, { entry: call({ result: 'a < b', result_chars: 5 }) });
    expect([...details(container).children].map((child) => `${child.tagName} ${child.className}`)).toEqual([
      'SUMMARY ',
      'DIV ',
      'DIV label',
      'PRE code',
    ]);
    expect(details(container).querySelector(':scope > .label')?.textContent).toBe('Result');
    const text = details(container).querySelector(':scope > pre') as HTMLElement;
    expect(text.textContent).toBe('a < b');
    expect(text.children).toHaveLength(0);
  });

  test('says how much of a long result shows', () => {
    const { container } = render(ChatToolCall, { entry: call({ result: 'abc', result_chars: 1234 }) });
    expect(details(container).querySelector(':scope > .label')?.textContent).toBe(
      'Result · first 3 of 1,234 characters',
    );
  });

  test('an empty result is still a result: the label and an empty block', () => {
    const { container } = render(ChatToolCall, { entry: call({ result: '', result_chars: 0 }) });
    expect(details(container).querySelector(':scope > .label')?.textContent).toBe('Result');
    expect(details(container).querySelector(':scope > pre')?.textContent).toBe('');
  });

  test('a JSON result is pretty-printed and highlighted', () => {
    const { container } = render(ChatToolCall, { entry: call({ result: '{"a":[1]}', result_chars: 9 }) });
    const code = details(container).querySelector(':scope > pre.code > code.hljs');
    expect(code?.textContent).toBe('{\n  "a": [\n    1\n  ]\n}');
    expect(code?.querySelector('span.hljs-attr')).not.toBeNull();
  });

  test('a Read result is highlighted in its file`s language', () => {
    const entry = call({
      tool: 'Read',
      tool_fields: [field('file_path', 'a.py')],
      result: 'def f(): pass',
      result_chars: 13,
    });
    const { container } = render(ChatToolCall, { entry });
    const code = details(container).querySelector(':scope > pre.code > code.hljs');
    expect(code?.textContent).toBe('def f(): pass');
    expect(code?.querySelector('span.hljs-keyword')?.textContent).toBe('def');
  });
});

describe('when the entry changes', () => {
  const asked = () => call({ result: null, tool: 'Bash', tool_fields: [field('command', 'sleep 1')] });
  const answered = () => call({ result: 'done', tool: 'Bash', tool_fields: [field('command', 'sleep 1')] });

  test('the details keeps the nodes and the state the reader gave it', async () => {
    const { container, rerender } = render(ChatToolCall, { entry: asked() });
    const node = details(container);
    const head = summary(container);
    node.open = true;
    await rerender({ entry: answered() });
    expect(details(container)).toBe(node);
    expect(summary(container)).toBe(head);
    expect(node.open).toBe(true);
    expect(head.textContent).toBe(`Bash ${when(TIME)}`);
    expect(node.querySelector(':scope > pre')?.textContent).toBe('done');
  });

  test('a closed one stays closed', async () => {
    const { container, rerender } = render(ChatToolCall, { entry: asked() });
    await rerender({ entry: answered() });
    expect(details(container).open).toBe(false);
  });

  test('a focused summary stays focused', async () => {
    const { container, rerender } = render(ChatToolCall, { entry: asked() });
    summary(container).setAttribute('tabindex', '0');
    summary(container).focus();
    expect(summary(container)).toBe(document.activeElement);
    await rerender({ entry: answered() });
    expect(summary(container)).toBe(document.activeElement);
  });
});
