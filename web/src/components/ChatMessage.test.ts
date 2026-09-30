// @vitest-environment jsdom
// Claude's text is sanitized markdown, which needs DOMPurify under jsdom and the real libraries.
import { render } from '@testing-library/svelte';
import { afterAll, beforeAll, describe, expect, test } from 'vitest';
import { chatEntry } from '../lib/fixtures';
import { when } from '../lib/format';
import { loadVendor, unloadVendor } from '../lib/vendor.testing';
import ChatMessage from './ChatMessage.svelte';

const TIME = '2026-09-30T08:00:00.000Z';

function reply(changes = {}) {
  return chatEntry({ kind: 'text', timestamp: TIME, text: 'Hello', effort: 'high', ...changes });
}

function prompt(text: string | null) {
  return chatEntry({ kind: 'prompt', timestamp: TIME, text, model: null });
}

const head = (container: HTMLElement) => container.querySelector('.chat-head') as HTMLElement;

// the first describe runs without the libraries, the second with the real ones
describe('without the libraries', () => {
  test('a reply is plain text', () => {
    const { container } = render(ChatMessage, { entry: reply({ text: '**a** <b>x</b>' }) });
    const body = container.querySelector('.chat-assistant > .chat-markdown.chat-text');
    expect(body?.textContent).toBe('**a** <b>x</b>');
    expect(body?.children).toHaveLength(0);
  });

  test('a markdown prompt is plain text', () => {
    const { container } = render(ChatMessage, { entry: prompt('a\nb') });
    expect(container.querySelector('.chat-user > .chat-markdown.chat-text')?.textContent).toBe('a\nb');
  });

  test('a JSON prompt is text in a code block', () => {
    const { container } = render(ChatMessage, { entry: prompt('{"a":1}') });
    expect(container.querySelector('.chat-user > pre.code > code.hljs')?.textContent).toBe('{\n  "a": 1\n}');
  });
});

describe('the head', () => {
  test("a reply names Claude, its model and effort, and when, with the spaces in the text", () => {
    const { container } = render(ChatMessage, { entry: reply({ model: 'claude-opus-5-5' }) });
    expect(head(container).textContent).toBe(`Claude claude-opus-5-5 · effort high ${when(TIME)}`);
    expect(head(container).tagName).toBe('DIV');
    expect(head(container).querySelector('strong')?.textContent).toBe('Claude');
    expect([...head(container).querySelectorAll('span.muted')].map((span) => span.textContent)).toEqual([
      'claude-opus-5-5 · effort high',
      when(TIME),
    ]);
  });

  test('a prompt has no model note', () => {
    const { container } = render(ChatMessage, { entry: prompt('hi') });
    expect(head(container).textContent).toBe(`You ${when(TIME)}`);
    expect(head(container).querySelectorAll('span.muted')).toHaveLength(1);
  });

  test('a reply without a model or effort has no note', () => {
    const { container } = render(ChatMessage, { entry: reply({ model: null, effort: null }) });
    expect(head(container).textContent).toBe(`Claude ${when(TIME)}`);
  });

  test('a reply without a time says so as the page does elsewhere', () => {
    const { container } = render(ChatMessage, { entry: reply({ timestamp: null, model: null, effort: null }) });
    expect(head(container).textContent).toBe(`Claude ${when(null)}`);
  });

  test('an unknown kind is named as it is', () => {
    const { container } = render(ChatMessage, { entry: chatEntry({ kind: 'tool', timestamp: TIME, model: null }) });
    expect(head(container).querySelector('strong')?.textContent).toBe('tool');
  });
});

describe('thinking', () => {
  test('is a closed details whose summary holds the head as a span', () => {
    const entry = chatEntry({ kind: 'thinking', timestamp: TIME, text: 'hmm', model: 'claude-opus-5-5' });
    const { container } = render(ChatMessage, { entry });
    const details = container.querySelector('details.chat-entry.chat-thinking') as HTMLDetailsElement;
    expect(details.open).toBe(false);
    const inSummary = details.querySelector('summary > span.chat-head') as HTMLElement;
    expect(inSummary.textContent).toBe(`Thinking claude-opus-5-5 ${when(TIME)}`);
    expect(details.querySelector('div.chat-head')).toBeNull();
  });

  test('its text is plain, and markup in it stays text', () => {
    const entry = chatEntry({ kind: 'thinking', timestamp: TIME, text: '**a** <b>x</b>' });
    const { container } = render(ChatMessage, { entry });
    const body = container.querySelector('details > div.chat-text');
    expect(body?.textContent).toBe('**a** <b>x</b>');
    expect(body?.children).toHaveLength(0);
  });

  test('null text is empty', () => {
    const { container } = render(ChatMessage, { entry: chatEntry({ kind: 'thinking', text: null }) });
    expect(container.querySelector('details > div.chat-text')?.textContent).toBe('');
  });
});

describe('a prompt', () => {
  beforeAll(loadVendor);
  afterAll(unloadVendor);

  test('is a user entry', () => {
    const { container } = render(ChatMessage, { entry: prompt('hi') });
    const entry = container.firstElementChild as HTMLElement;
    expect(entry.className).toBe('chat-entry chat-user');
    expect(entry.firstElementChild?.className).toBe('chat-head');
  });

  test('a slash command is shown as typed', () => {
    const text = '<command-name>/compact</command-name><command-args>keep the tests</command-args>';
    const { container } = render(ChatMessage, { entry: prompt(text) });
    expect(container.querySelector('.chat-user > .chat-command > code')?.textContent).toBe('/compact keep the tests');
    expect(container.querySelector('.chat-markdown')).toBeNull();
  });

  test('a slash command without arguments is only its name', () => {
    const { container } = render(ChatMessage, { entry: prompt('<command-name>/clear</command-name>') });
    expect(container.querySelector('.chat-command > code')?.textContent).toBe('/clear');
  });

  test('JSON is pretty-printed and highlighted', () => {
    const { container } = render(ChatMessage, { entry: prompt('{"a":[1,2],"b":"x"}') });
    const code = container.querySelector('.chat-user > pre.code > code.hljs');
    expect(code?.textContent).toBe('{\n  "a": [\n    1,\n    2\n  ],\n  "b": "x"\n}');
    expect(code?.querySelector('span.hljs-attr')).not.toBeNull();
  });

  test('anything else is markdown with its line breaks kept', () => {
    const { container } = render(ChatMessage, { entry: prompt('one **two**\nthree') });
    const body = container.querySelector('.chat-user > .chat-markdown');
    expect(body?.querySelector('strong')?.textContent).toBe('two');
    expect(body?.querySelector('br')).not.toBeNull();
  });

  test('text that only starts like JSON is markdown', () => {
    const { container } = render(ChatMessage, { entry: prompt('{not json} and **bold**') });
    expect(container.querySelector('pre.code')).toBeNull();
    expect(container.querySelector('.chat-markdown strong')?.textContent).toBe('bold');
  });

  test('null text is an empty prompt', () => {
    const { container } = render(ChatMessage, { entry: prompt(null) });
    expect(container.querySelector('.chat-user > .chat-markdown')?.textContent).toBe('');
  });
});

describe("Claude's reply", () => {
  beforeAll(loadVendor);
  afterAll(unloadVendor);

  test('is an assistant entry with its head above its text', () => {
    const { container } = render(ChatMessage, { entry: reply() });
    const entry = container.firstElementChild as HTMLElement;
    expect(entry.className).toBe('chat-entry chat-assistant');
    expect([...entry.children].map((child) => child.className)).toEqual(['chat-head', 'chat-markdown']);
  });

  test('is markdown: bold becomes strong', () => {
    const { container } = render(ChatMessage, { entry: reply({ text: 'a **bold** word' }) });
    expect(container.querySelector('.chat-assistant .chat-markdown strong')?.textContent).toBe('bold');
  });

  test('keeps single line breaks together, as markdown does', () => {
    const { container } = render(ChatMessage, { entry: reply({ text: 'one\ntwo' }) });
    expect(container.querySelector('.chat-markdown br')).toBeNull();
  });

  test('loses a script and an event attribute', () => {
    const { container } = render(ChatMessage, {
      entry: reply({ text: 'x <script>alert(1)</script><img src=x onerror=alert(2)>' }),
    });
    expect(container.querySelector('script')).toBeNull();
    expect(container.querySelector('img')).toBeNull();
    expect(container.innerHTML).not.toContain('onerror');
  });

  test('null text is empty', () => {
    const { container } = render(ChatMessage, { entry: reply({ text: null }) });
    expect(container.querySelector('.chat-markdown')?.textContent).toBe('');
  });

  test('another kind shows its text as plain text', () => {
    const entry = chatEntry({ kind: 'tool', timestamp: TIME, text: '**a** <b>x</b>', model: null });
    const { container } = render(ChatMessage, { entry });
    const body = container.querySelector('.chat-assistant > div.chat-text');
    expect(body?.textContent).toBe('**a** <b>x</b>');
    expect(body?.children).toHaveLength(0);
    expect(container.querySelector('.chat-markdown')).toBeNull();
  });
});
