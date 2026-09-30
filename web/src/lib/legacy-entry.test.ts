import { afterEach, describe, expect, test } from 'vitest';
import type { ChatEntry } from './api';
import { legacyEntry, type EntryMemory } from './legacy-entry';

type Globals = { chatEntry?: (entry: ChatEntry) => HTMLElement };

/** An entry drawn as the old script does: a block with a details and a button in it. */
function install(): void {
  (globalThis as Globals).chatEntry = (entry) => {
    const block = document.createElement('div');
    block.className = 'chat-tool';
    block.innerHTML = `<details><summary>${entry.text}</summary><button>go</button></details>`;
    return block;
  };
}

function entry(text: string): ChatEntry {
  return { text } as ChatEntry;
}

afterEach(() => {
  delete (globalThis as Globals).chatEntry;
  document.body.replaceChildren();
});

describe('legacyEntry', () => {
  test("draws the entry with the old script's function into the node", () => {
    install();
    const node = document.createElement('div');
    legacyEntry(entry('first'), 'k1', new Map())(node);
    expect(node.querySelector('summary')?.textContent).toBe('first');
  });

  test('replaces what the node held, not adds to it', () => {
    install();
    const node = document.createElement('div');
    const memory = new Map<string, EntryMemory>();
    legacyEntry(entry('first'), 'k1', memory)(node)?.();
    legacyEntry(entry('second'), 'k1', memory)(node);
    expect(node.querySelectorAll('summary')).toHaveLength(1);
    expect(node.querySelector('summary')?.textContent).toBe('second');
  });

  test('opens again the details that were open when the entry is drawn again', () => {
    install();
    const node = document.createElement('div');
    const memory = new Map<string, EntryMemory>();
    const cleanup = legacyEntry(entry('first'), 'k1', memory)(node);
    node.querySelector('details')!.open = true;
    cleanup?.();
    legacyEntry(entry('second'), 'k1', memory)(node);
    expect(node.querySelector('details')!.open).toBe(true);
  });

  test('leaves the details closed that were closed', () => {
    install();
    const node = document.createElement('div');
    const memory = new Map<string, EntryMemory>();
    legacyEntry(entry('first'), 'k1', memory)(node)?.();
    legacyEntry(entry('second'), 'k1', memory)(node);
    expect(node.querySelector('details')!.open).toBe(false);
  });

  test('gives focus back to the same control of the new drawing', () => {
    install();
    const node = document.createElement('div');
    document.body.append(node);
    const memory = new Map<string, EntryMemory>();
    const cleanup = legacyEntry(entry('first'), 'k1', memory)(node);
    node.querySelector('details')!.open = true;
    node.querySelector('button')!.focus();
    cleanup?.();
    legacyEntry(entry('second'), 'k1', memory)(node);
    expect(document.activeElement).toBe(node.querySelector('button'));
  });

  test('keeps the memory of each entry apart by its key', () => {
    install();
    const first = document.createElement('div');
    const second = document.createElement('div');
    const memory = new Map<string, EntryMemory>();
    const cleanup = legacyEntry(entry('a'), 'k1', memory)(first);
    legacyEntry(entry('b'), 'k2', memory)(second)?.();
    first.querySelector('details')!.open = true;
    cleanup?.();
    const again = document.createElement('div');
    legacyEntry(entry('b'), 'k2', memory)(again);
    expect(again.querySelector('details')!.open).toBe(false);
  });

  test('says so where the old script is not there', () => {
    const node = document.createElement('div');
    expect(() => legacyEntry(entry('x'), 'k1', new Map())(node)).toThrow('chatEntry');
  });
});
