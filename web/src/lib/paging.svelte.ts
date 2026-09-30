// The table pagers: the page each table is on, and the Pager component mounted for the old classic scripts, which
// still draw the tables' rows. Until 3.16 and later replace those with components, the old code hands a pager the
// rows it drew and puts the pager it gets back into the page.

import { flushSync, mount, unmount } from 'svelte';
import { SvelteMap } from 'svelte/reactivity';
import Pager from '../components/Pager.svelte';
import { preferences } from './prefs.svelte';
import { pageWindow, type PageWindow } from './tables';

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

// A module singleton for now, like `preferences` in prefs.svelte.ts: the old scripts reach it as a global through the
// bridge; it moves into context (3.32) once the components own the page.
export const tablePages = new TablePages();

/** The page a table shows: the one that holds its stored first unit at the current page size, kept within the
 *  `count` units there are. Reads the stored page and the page size, both reactive, so what draws from it follows a
 *  turned page and a new size. */
export function shownWindow(key: string, count: number): PageWindow {
  return pageWindow(count, preferences.pageSize, Math.floor(tablePages.first(key) / preferences.pageSize));
}

/** What a pager pages. */
export interface PagerProps {
  /** The table's key, which its page is kept under and its controls' ids are made from (`pager-<key>-size`). */
  key: string;
  /** What the rows are called: "rows", or "sessions" for a grid of cards. */
  noun: string;
  /** The rows the old code drew: a table's, or a card grid's children. Missing for a table a component draws, which
   *  shows only the rows of the page and has none to hide. */
  rows?: HTMLElement[];
  /** Each row's unit, from `pageUnits`: a sub-row shares the unit of the row above it. */
  units: number[];
}

// The pagers mounted and not yet released: their component and root element. A plain Set: nothing draws from it.
const mounted = new Set<{ component: ReturnType<typeof mount>; root: HTMLElement }>();

/** Mounts a pager for `props.rows` and returns its root element, for the old code to put in the page wherever it
 *  belongs (before the table, into its title row). It is mounted in a holder that isn't in the page, and works once
 *  moved: its events are delegated to the document. */
export function mountPager(props: PagerProps): HTMLElement {
  const holder = document.createElement('div');
  const component = mount(Pager, { target: holder, props });
  // The old code counts on the rows' classes at once, as the old pager set them while it was made.
  flushSync();
  const root = holder.firstElementChild;
  if (!(root instanceof HTMLElement)) throw new Error('The pager drew no element');
  mounted.add({ component, root });
  return root;
}

/** Unmounts every pager that is no longer in the page, which a list drawn again every few seconds (the live sessions,
 *  an open live session) would otherwise keep, with its rows, for every old draw. */
export function releaseDetachedPagers(): void {
  for (const pager of [...mounted]) {
    if (pager.root.isConnected) continue;
    mounted.delete(pager);
    void unmount(pager.component);
  }
}
