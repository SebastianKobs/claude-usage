// The page each table is on, kept by the table's key, and what a pager pages. One TablePages per page, in the app's
// context (app/app.svelte.ts).

import { SvelteMap } from 'svelte/reactivity';

/** Which group of rows (unit) each table starts its page at, by the table's key, so a table drawn again (a refresh,
 *  another range) stays on its page. The first unit shown, not a page number: a new page size then keeps the page
 *  that holds the first row shown before. Reactive, so every pager follows. */
export class TablePages {
  #firsts = new SvelteMap<string, number>();

  /** The first unit of the table's page; 0 where it has none. */
  first(key: string): number {
    return this.#firsts.get(key) ?? 0;
  }

  /** Starts the table's page at `first`. */
  set(key: string, first: number): void {
    this.#firsts.set(key, first);
  }

  /** Forgets the table's page, so it starts at the first again. */
  forget(key: string): void {
    this.#firsts.delete(key);
  }
}

/** What a pager pages. */
export interface PagerProps {
  /** The table's key, which its page is kept under and its controls' ids are made from (`pager-<key>-size`). */
  key: string;
  /** What the rows are called: "rows", or "sessions" for a grid of cards. */
  noun: string;
  /** Each row's unit, from `pageUnits`: a sub-row shares the unit of the row above it. */
  units: number[];
}
