// One session's drilldown: what a refresh keeps of the page while the view is drawn again.
"use strict";

// --- drilldown -----------------------------------------------------------------------------------------------

// The view is the SessionView component (web/src/components/SessionView.svelte), drawn from the payload, its
// conversation (Conversation) included, which keeps its own state and reads itself again when the session changes.
// refresh: the same session drawn again with newer numbers, keeping the reader's place (keptView)
function renderDrilldown(detail, refresh = false) {
  const panel = refresh ? document.getElementById("drilldown") : null;
  const kept = panel ? keptView(panel) : null;
  setPayload({session: detail});                          // null closes the view: the page comes back, focus to the link
  if (kept) restoreFocusAndScroll(panel, kept);
}

// What a refresh keeps: focus, and the element at the top of the window. The components keep their own state.
function keptView(panel) {
  const active = panel.contains(document.activeElement) ? document.activeElement : null;
  const anchor = scrollAnchor([...panel.children]);
  return {
    active,
    activeId: active && active.id,
    activeIndex: active ? [...panel.querySelectorAll(FOCUSABLE)].indexOf(active) : -1,
    anchor,
    anchorIndex: anchor ? [...panel.children].indexOf(anchor.node) : -1,
  };
}

// the same element where it still exists, else by id or by position
function restoreFocusAndScroll(panel, kept) {
  const anchored = kept.anchor && kept.anchor.node.isConnected ? kept.anchor.node : panel.children[kept.anchorIndex];
  keepScroll(kept.anchor, anchored);
  if (!kept.active) return;
  const target = kept.active.isConnected ? kept.active
    : (kept.activeId && document.getElementById(kept.activeId))
      || panel.querySelectorAll(FOCUSABLE)[kept.activeIndex] || document.getElementById("drilldown-title");
  target.focus({preventScroll: true});
}
