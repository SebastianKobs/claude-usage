// Keeping what the reader was looking at while a view changes under it: before, note the first of some elements still
// showing at the top of the window and how far from the top it starts; after, scroll so that element (or the one that
// replaced it) starts there again.

/** The element that held the reader's place, and how far from the top of the window it was. */
export interface ScrollAnchor {
  node: Element;
  top: number;
}

/** The first of `nodes` whose bottom is still below the top of the window, with where its top is; null if none. */
export function scrollAnchor(nodes: Iterable<Element>): ScrollAnchor | null {
  for (const node of nodes) {
    const box = node.getBoundingClientRect();
    if (box.bottom > 0) return { node, top: box.top };
  }
  return null;
}

/** Scrolls the window so `node` is as far from the top as the anchor's element was; nothing without either or once
 * `node` has left the page. */
export function keepScroll(anchor: ScrollAnchor | null, node: Element | null | undefined): void {
  if (anchor && node && node.isConnected) window.scrollBy(0, node.getBoundingClientRect().top - anchor.top);
}
