// What the page remembers between visits: the theme, the page size of the tables and the conversation's order, each
// saved in localStorage as it is chosen. The range's days (range.svelte.ts) and the by-model chart's metric (ByModel)
// are read and saved through readPreference and savePreference.

import { DEFAULT_PAGE_SIZE, PAGE_SIZES, pageSizeFrom } from './tables.ts';
import { themeName } from './themes.ts';

/** A saved preference, or null where none is saved or the storage can't be read (a blocked one throws). */
export function readPreference(name: string): string | null {
  try {
    return localStorage.getItem(`claude-usage.${name}`);
  } catch {
    return null; // storage unavailable
  }
}

/** Saves a preference; silently nothing where the storage is unavailable or full. */
export function savePreference(name: string, value: string | number): void {
  try {
    localStorage.setItem(`claude-usage.${name}`, String(value));
  } catch {
    // storage unavailable: the choice holds until the page closes
  }
}

/** The page's preferences. Each is read from the storage once, when this is made, and saved by its setter. */
export class Preferences {
  // Primitives, so plain $state. The setters save, not an $effect: a choice is an event, and an effect would also save
  // what was just read.
  #theme = $state<string | null>(themeName(readPreference('theme')));
  #pageSize = $state(pageSizeFrom(readPreference('page_size'), PAGE_SIZES, DEFAULT_PAGE_SIZE));
  #oldestFirst = $state(readPreference('chat-oldest-first') === 'true');

  /** The theme chosen, or null for "auto", which follows the system. */
  get theme(): string | null {
    return this.#theme;
  }

  set theme(name: string | null) {
    const theme = themeName(name);
    this.#theme = theme;
    savePreference('theme', theme ?? 'auto');
  }

  /** The rows a table page shows, one of PAGE_SIZES. */
  get pageSize(): number {
    return this.#pageSize;
  }

  set pageSize(size: number) {
    if (!PAGE_SIZES.includes(size)) return;
    this.#pageSize = size;
    savePreference('page_size', String(size));
  }

  /** Whether the conversation lists the transcript's order (oldest first) instead of the newest first. */
  get oldestFirst(): boolean {
    return this.#oldestFirst;
  }

  set oldestFirst(value: boolean) {
    this.#oldestFirst = value;
    savePreference('chat-oldest-first', String(value));
  }
}
