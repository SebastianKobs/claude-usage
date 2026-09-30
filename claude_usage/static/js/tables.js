// Paging for the old scripts' tables (the usage tables are the UsageTables and UsageTable components, the sessions
// list the SessionsList component).
"use strict";

// --- paging -------------------------------------------------------------------------------------------------

// PAGE_SIZES, pageUnits, pageWindow and pageText come from the bundle (web/src/lib/tables.ts), the page size
// (preferences.pageSize) from web/src/lib/prefs.svelte.ts, the pager itself and the page each table is on
// (tablePages) from web/src/lib/paging.svelte.ts and scrollAnchor and keepScroll from web/src/lib/scroll.ts

// A table with more groups of rows than the smallest page, with a pager above it: the page size (a preference, which
// every pager follows), previous and next, and which rows show, named by `noun`. `node` is the table or an element
// holding it; the pager goes right before the table. Rows off the page get a class, not `hidden`, which a workflow
// run's switch uses.
function paged(key, node, noun = "rows") {
  const list = node.matches("table") ? node : node.querySelector("table");
  const rows = list ? [...list.tBodies[0].rows] : [];
  const units = pageUnits(rows.map(row => row.classList.contains("sub-row")));
  const count = units.length ? units[units.length - 1] + 1 : 0;
  if (count <= PAGE_SIZES[0]) {
    // a pager left in the title row from a longer draw goes
    queueMicrotask(() => placePager(node, null));
    queueMicrotask(releaseDetachedPagers);
    return node;
  }
  const id = `pager-${key}`;
  const refocus = document.activeElement && document.activeElement.id ? document.activeElement.id : null;
  const pager = mountPager({key, noun, rows, units});
  // once the caller has put the table in the page; before the refocus, since moving a control drops its focus
  queueMicrotask(() => placePager(pager, pager));
  queueMicrotask(releaseDetachedPagers);
  if (refocus && ["size", "previous", "next"].some(control => `${id}-${control}` === refocus)) {
    queueMicrotask(() => document.getElementById(refocus)?.focus({preventScroll: true}));
  }
  if (list === node) return el("div", {class: "paged"}, pager, list);
  list.before(pager);
  return node;
}

// The pager into its table's title row, right-aligned: the heading right before the table's wrap (a note may sit
// between them) becomes a row with it. A table without one, such as a chart's table
// view under its chart, keeps the pager above it. A redraw finds the row already made and swaps its pager, or drops
// it for a table without one (pager null); `node` is what the caller put in the page.
function placePager(node, pager) {
  const wrap = node.isConnected ? node.closest(".table-wrap") : null;
  let title = wrap ? wrap.previousElementSibling : null;
  while (title && title.classList.contains("note")) {
    title = title.previousElementSibling;
  }
  if (!title) return;
  if (title.classList.contains("title-row")) {
    title.querySelector(":scope > .pager")?.remove();
    if (pager) title.append(pager);
    return;
  }
  if (!pager || !["H2", "H3"].includes(title.tagName)) return;
  const row = el("div", {class: "title-row"});
  title.replaceWith(row);
  row.append(title, pager);
}
