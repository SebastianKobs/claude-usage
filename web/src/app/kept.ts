// What a refresh of the open session keeps of the page while its view changes in place: where focus is, and the element
// at the top of the window. The components keep their own state (the table view, the folds open).

import { flushSync } from 'svelte';
import { keepScroll, scrollAnchor, type ScrollAnchor } from '../ui/scroll';

const FOCUSABLE = 'a[href], button, select, summary, [tabindex]';

/** What was noted before the draw: the focused element (by node, id and position), and the scroll anchor. */
interface Kept {
  active: HTMLElement | null;
  activeId: string;
  activeIndex: number;
  anchor: ScrollAnchor | null;
  anchorIndex: number;
}

function note(panel: HTMLElement): Kept {
  const focused = document.activeElement;
  const active = focused instanceof HTMLElement && panel.contains(focused) ? focused : null;
  const anchor = scrollAnchor([...panel.children]);
  return {
    active,
    activeId: active?.id ?? '',
    activeIndex: active ? [...panel.querySelectorAll(FOCUSABLE)].indexOf(active) : -1,
    anchor,
    anchorIndex: anchor ? [...panel.children].indexOf(anchor.node) : -1,
  };
}

/** The same element where it still exists, else by id or by position, else the heading. */
function restore(panel: HTMLElement, kept: Kept): void {
  const anchored = kept.anchor?.node.isConnected ? kept.anchor.node : panel.children[kept.anchorIndex];
  keepScroll(kept.anchor, anchored);
  if (!kept.active) return;
  const target =
    (kept.active.isConnected ? kept.active : null) ??
    (kept.activeId ? document.getElementById(kept.activeId) : null) ??
    (panel.querySelectorAll<HTMLElement>(FOCUSABLE)[kept.activeIndex] as HTMLElement | undefined) ??
    document.getElementById('drilldown-title');
  target?.focus({ preventScroll: true });
}

/** Runs `draw` (which changes what the session view shows) and draws it at once, keeping focus and the reader's place
 *  in the view, `#drilldown`; without the view open, it only draws. */
export function keepingView(draw: () => void): void {
  const panel = document.getElementById('drilldown');
  const kept = panel ? note(panel) : null;
  draw();
  flushSync();
  if (panel && kept) restore(panel, kept);
}
