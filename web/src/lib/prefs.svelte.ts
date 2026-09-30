// What the page remembers between visits: the theme, the page size of the tables and the conversation's order, each
// saved in localStorage as it is chosen. The days and the metric are still kept by the old scripts, through
// readPreference and savePreference.

import { DEFAULT_PAGE_SIZE, PAGE_SIZES, pageSizeFrom } from './tables.ts';
import { themeFooter, themeLabel, themeName } from './themes.ts';

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

/** The saved value if it is one of the options, else null. `includes` on the array, not a lookup in an object: a saved
 *  "toString" is no option. */
export function savedOption(name: string, options: readonly string[]): string | null {
  const saved = readPreference(name);
  return saved !== null && options.includes(saved) ? saved : null;
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

// The page's one instance. A module singleton for now, since the old classic scripts reach it as a global through the
// bridge; it moves into context (3.32) once the components own the page.
export const preferences = new Preferences();

/** A label as the chosen theme words it: the theme's wording if it has one, else the label. Reads the reactive theme. */
export function hype(label: string): string {
  return themeLabel(preferences.theme, label);
}

/** The sentence the chosen theme adds to the page's footer, or empty. Reads the reactive theme. */
export function footerCopy(): string {
  return themeFooter(preferences.theme);
}
