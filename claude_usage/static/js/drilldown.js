// One session's drilldown: the part of the view the components have not taken over yet (the conversation).
"use strict";

// --- drilldown -----------------------------------------------------------------------------------------------

// The view's frame is the SessionView component (web/src/components/SessionView.svelte), drawn from the payload: its
// heading and facts, the waits, the tiles, the secret accesses, the gauge with the calls above it (ContextGauge), the
// context per turn (ContextPerTurn), the model, agent, skill, MCP server and API error tables and the Tools table
// (ToolsTable). It leaves two empty slots, #session-mid and #session-end, for the conversation: the first while the
// session's transcript exists (the tools come last then), else the second.
// refresh: the same session drawn again with newer numbers, keeping what the reader had open (keptView)
function renderDrilldown(detail, refresh = false) {
  const kept = refresh && document.getElementById("chat") ? keptView(document.getElementById("drilldown")) : null;
  if (!kept) chatRequest++;                               // a conversation still loading belongs to the old view
  if (!detail) {
    setPayload({session: null});                          // the view goes: the page comes back, focus to the link
    return;
  }
  setPayload({session: detail});
  const panel = document.getElementById("drilldown");
  const [chatSlot, otherSlot] = detail.transcript ? ["session-mid", "session-end"] : ["session-end", "session-mid"];
  fill(document.getElementById(chatSlot), ...(kept ? kept.chat : [chatSection(detail)]));
  fill(document.getElementById(otherSlot));               // a transcript that came or went leaves the other empty
  if (kept) restoreFocusAndScroll(panel, kept);
}

// the view's elements as the reader sees them in order: its own children, and the children of the slots the old
// sections are drawn into
function panelItems(panel) {
  return [...panel.children].flatMap(child =>
    (child.classList.contains("legacy-slot") ? [...child.children] : [child]));
}

// What a refresh keeps: the conversation's nodes as they are (moved into the new view, so a loaded conversation
// and its picker stay), focus, and the element at the top of the window. The components keep their own state.
function keptView(panel) {
  const active = panel.contains(document.activeElement) ? document.activeElement : null;
  const anchor = scrollAnchor(panelItems(panel));
  return {
    chat: [document.getElementById("chat-section")],
    active,
    activeId: active && active.id,
    activeIndex: active ? [...panel.querySelectorAll(FOCUSABLE)].indexOf(active) : -1,
    anchor,
    anchorIndex: anchor ? panelItems(panel).indexOf(anchor.node) : -1,
  };
}

// the same element where it still exists (in the conversation), else by id or by position
function restoreFocusAndScroll(panel, kept) {
  const anchored = kept.anchor && kept.anchor.node.isConnected ? kept.anchor.node : panelItems(panel)[kept.anchorIndex];
  keepScroll(kept.anchor, anchored);
  if (!kept.active) return;
  const target = kept.active.isConnected ? kept.active
    : (kept.activeId && document.getElementById(kept.activeId))
      || panel.querySelectorAll(FOCUSABLE)[kept.activeIndex] || document.getElementById("drilldown-title");
  target.focus({preventScroll: true});
}
