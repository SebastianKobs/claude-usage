// One session's drilldown: the parts of the view the components have not taken over yet (the tools, the conversation).
"use strict";

// --- drilldown -----------------------------------------------------------------------------------------------

// The view's frame is the SessionView component (web/src/components/SessionView.svelte), drawn from the payload: its
// heading and facts, the waits, the tiles, the secret accesses, the gauge with the calls above it (ContextGauge), the
// context per turn (ContextPerTurn), and the model, agent, skill, MCP server and API error tables. It leaves two
// empty slots, #session-mid and #session-end, for the sections still drawn here.
// refresh: the same session drawn again with newer numbers, keeping what the reader had open (keptView)
function renderDrilldown(detail, refresh = false) {
  const kept = refresh && document.getElementById("chat") ? keptView(document.getElementById("drilldown")) : null;
  if (!kept) chatRequest++;                               // a conversation still loading belongs to the old view
  if (!detail) {
    setPayload({session: null});                          // the view goes: the page comes back, focus to the link
    return;
  }
  // the session's tables page by their own keys, so another session starts at the first page
  const key = name => `${detail.session_id}-${name}`;
  const order = toolsAndChat(detail.transcript,
                             [el("h3", {text: "Tools"}), toolsNote(detail.agents),
                              el("div", {class: "table-wrap"}, paged(key("tools"), toolsTable(detail.agents)))],
                             kept ? kept.chat : [chatSection(detail)]);
  setPayload({session: detail});
  const panel = document.getElementById("drilldown");
  fill(document.getElementById("session-mid"), ...order[0]);
  fill(document.getElementById("session-end"), ...order[1]);
  if (kept) restoreView(panel, kept);
  if (kept) restoreFocusAndScroll(panel, kept);
}

// the view's elements as the reader sees them in order: its own children, and the children of the slots the old
// sections are drawn into
function panelItems(panel) {
  return [...panel.children].flatMap(child =>
    (child.classList.contains("legacy-slot") ? [...child.children] : [child]));
}

// What a refresh keeps: the conversation's nodes as they are (moved into the new view, so a loaded conversation
// and its picker stay), the folds open (tool details), focus, and the element at the top of the window
function keptView(panel) {
  const active = panel.contains(document.activeElement) ? document.activeElement : null;
  const anchor = scrollAnchor(panelItems(panel));
  return {
    chat: [document.getElementById("chat-section")],
    folds: new Set([...panel.querySelectorAll("[data-fold][aria-expanded='true']")].map(node => node.dataset.fold)),
    active,
    activeId: active && active.id,
    activeFold: active && active.dataset.fold,
    activeIndex: active ? [...panel.querySelectorAll(FOCUSABLE)].indexOf(active) : -1,
    anchor,
    anchorIndex: anchor ? panelItems(panel).indexOf(anchor.node) : -1,
  };
}

function restoreView(panel, kept) {
  for (const toggle of panel.querySelectorAll("[data-fold]")) if (kept.folds.has(toggle.dataset.fold)) toggle.click();
}

// the same element where it still exists (in the conversation), else by id, by fold, or by position
function restoreFocusAndScroll(panel, kept) {
  const anchored = kept.anchor && kept.anchor.node.isConnected ? kept.anchor.node : panelItems(panel)[kept.anchorIndex];
  keepScroll(kept.anchor, anchored);
  if (!kept.active) return;
  const target = kept.active.isConnected ? kept.active
    : (kept.activeId && document.getElementById(kept.activeId))
      || (kept.activeFold && panel.querySelector(`[data-fold="${CSS.escape(kept.activeFold)}"]`))
      || panel.querySelectorAll(FOCUSABLE)[kept.activeIndex] || document.getElementById("drilldown-title");
  target.focus({preventScroll: true});
}

function toolsTable(agents) {
  const rows = toolTableRows(agents);
  if (!rows.length) return el("div", {class: "empty", text: "No tool calls."});
  const heading = (text, title) => el("th", {class: "num", text, title});
  const head = el("tr", {}, el("th", {text: "Agent"}), el("th", {text: "Tool"}), heading("Calls"),
    heading("Errors", "calls whose result was an error"), heading("Result characters"),
    heading("Median", "a result's characters, the median call"), heading("p90", "…and at the 90th percentile"),
    heading("Input median", "the characters of a call's input, which the model wrote"),
    heading("Calls after", "how many later calls carried it in their context, the median call, up to the next " +
                           "compaction"),
    heading("~Carried", "what the later calls paid to have its input and result in their context"),
    heading("~Input cost", "its input at the output price"));
  // the rows' folds come from tables.ts: a row shows while every fold above it is open
  const {above, folds} = toolFolds(rows);
  const names = rows.map(row => {
    const name = toolRowName(row);
    return el("span", {class: name.className, text: name.text});
  });
  const body = rows.map((row, index) => {
    const tr = el("tr", {class: toolRowClass(row, rows[index + 1])},
      el("td", {text: row.sub ? "" : row.agent}), el("td", {}, names[index]),
      el("td", {class: "num", text: whole(row.calls)}), el("td", {class: "num", text: whole(row.errors)}),
      el("td", {class: "num", text: compact(row.result_chars)}),
      el("td", {class: "num", text: compact(row.result_median)}),
      el("td", {class: "num", text: compact(row.result_p90)}),
      el("td", {class: "num", text: compact(row.input_median)}),
      el("td", {class: "num", text: whole(row.calls_after_median)}),
      el("td", {class: "num", text: money(row.carried)}), el("td", {class: "num", text: money(row.input_cost)}));
    tr.dataset.key = row.key;
    return tr;
  });
  const open = new Set();
  const update = () => {
    body.forEach((tr, index) => { tr.hidden = !toolRowShown(above[index], open); });
  };
  for (const {fold, row, label} of folds) {
    const toggle = foldToggle(fold, label, isOpen => {
      if (isOpen) open.add(fold); else open.delete(fold);
      update();
    });
    names[row].append(" (", toggle, ")");
  }
  update();
  return el("table", {}, el("thead", {}, head), el("tbody", {}, ...body));
}

// A button that opens or closes a fold, closed at first: onToggle(open) shows or hides its rows. A refresh opens it
// again by its data-fold.
function foldToggle(fold, text, onToggle) {
  const toggle = el("button", {type: "button", class: "link-button", "aria-expanded": "false", "data-fold": fold,
                               text});
  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") !== "true";
    toggle.setAttribute("aria-expanded", String(open));
    onToggle(open);
  });
  return toggle;
}

// how the costs are estimated, while a transcript tells them
function toolsNote(agents) {
  if (!agents.some(agent => agent.tool_kinds && agent.tool_kinds.length)) return null;
  return el("div", {class: "note", text: "Bash splits by what a command does, MCP by server. A call's input and " +
    "result stay in the context, so every later call up to the next compaction reads them again: ~Carried " +
    "estimates what that cost, taking a token as 2.3 characters (measured on real transcripts, a heuristic)."});
}
