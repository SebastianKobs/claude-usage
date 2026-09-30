// The tile rows the session view draws, mounted for the old classic scripts, which still build that view's markup: the
// same KpiTiles and RuntimeTiles the overview shows, in a row of their own. Until the session view moves to components
// the old code puts the holder each function returns into the page.

import { flushSync, mount, unmount } from 'svelte';
import KpiTiles from '../components/KpiTiles.svelte';
import RuntimeTiles from '../components/RuntimeTiles.svelte';
import type { SessionDetail, SessionRuntime } from './api';
import { runtimeSource, sessionCostPer100Lines } from './tiles';

// The rows mounted and not yet released: their component and holder. A plain Set: nothing draws from it.
const mounted = new Set<{ component: ReturnType<typeof mount>; holder: HTMLElement }>();

/** Unmounts every tile row that is no longer in the page, which a session view drawn again every few seconds would
 *  otherwise keep, for every old draw. */
export function releaseDetachedTiles(): void {
  for (const row of [...mounted]) {
    if (row.holder.isConnected) continue;
    mounted.delete(row);
    void unmount(row.component);
  }
}

/** A row of the session view's tiles: a holder with the classes the stylesheet spaces it by. */
function sessionRow(): HTMLElement {
  const holder = document.createElement('div');
  holder.className = 'kpis session-kpis';
  return holder;
}

/** Remembers a mounted row and lets go of the detached ones once the old code has put this one in the page, where the
 *  row it replaces has gone. */
function keep(component: ReturnType<typeof mount>, holder: HTMLElement): HTMLElement {
  // The old code reads the tiles at once, as it did while it built them.
  flushSync();
  mounted.add({ component, holder });
  queueMicrotask(releaseDetachedTiles);
  return holder;
}

/** The session's cost, input, turns and output tiles, in a row for the old code to put in the page. */
export function mountSessionKpis(detail: SessionDetail): HTMLElement {
  const holder = sessionRow();
  const component = mount(KpiTiles, {
    target: holder,
    props: {
      totals: detail,
      scope: 'this session',
      context: detail.context,
      hintTokens: detail.compact_hint_tokens,
      savings: detail.compaction_savings,
    },
  });
  return keep(component, holder);
}

/** The session's time and lines changed, from its cost record or estimated from its transcripts, in a row for the old
 *  code to put in the page. */
export function mountSessionRuntime(detail: SessionDetail & { runtime: SessionRuntime }): HTMLElement {
  const holder = sessionRow();
  holder.setAttribute('role', 'group');
  holder.setAttribute('aria-label', 'Time and lines changed');
  const component = mount(RuntimeTiles, {
    target: holder,
    props: {
      runtime: detail.runtime,
      from: runtimeSource(detail.runtime.source),
      costPer100Lines: sessionCostPer100Lines(detail),
    },
  });
  return keep(component, holder);
}
