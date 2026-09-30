// An entry of the conversation drawn by the old script (`chatEntry`, chat.js) into a node of the component's own, until
// 3.30 draws them as components. A refresh hands an unchanged entry's node nothing new; a changed one is drawn again,
// which the old script does from scratch, so what the reader had open (its details) and where focus was is noted when
// it goes and put back.

import type { Attachment } from 'svelte/attachments';
import type { ChatEntry } from './api';

/** What the reader had done to an entry's drawing: which of its details were open, which control had focus. */
export interface EntryMemory {
  open: boolean[];
  focus: number;
}

// what a key reaches, as the old scripts' FOCUSABLE has it
const FOCUSABLE = 'a[href], button, select, summary, [tabindex]';

/** The attachment that draws `entry` into its node; `memory` (by the entry's key) carries the reader's changes from
 *  one drawing to the next. */
export function legacyEntry(
  entry: ChatEntry,
  key: string,
  memory: Map<string, EntryMemory>,
): Attachment<HTMLElement> {
  return (node) => {
    const draw = (globalThis as { chatEntry?: (entry: ChatEntry) => HTMLElement }).chatEntry;
    if (!draw) throw new Error('The old script has no chatEntry to draw the conversation with');
    node.replaceChildren(draw(entry));
    const kept = memory.get(key);
    if (kept) {
      node.querySelectorAll('details').forEach((details, index) => {
        details.open = Boolean(kept.open[index]);
      });
      if (kept.focus >= 0) node.querySelectorAll<HTMLElement>(FOCUSABLE)[kept.focus]?.focus({ preventScroll: true });
    }
    return () => {
      const active = document.activeElement;
      memory.set(key, {
        open: [...node.querySelectorAll('details')].map((details) => details.open),
        focus: active && node.contains(active) ? [...node.querySelectorAll(FOCUSABLE)].indexOf(active) : -1,
      });
    };
  };
}
