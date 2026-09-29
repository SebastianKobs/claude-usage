// The usage tables and the sessions list.
"use strict";

// --- paging -------------------------------------------------------------------------------------------------

const PAGE_SIZES = [10, 25, 50];
const DEFAULT_PAGE_SIZE = 25;
const PAGE_SIZE_PREFERENCE = "page_size";
// the page each table shows, by its key, so a table drawn again (a refresh, another range) stays on it
const tablePages = new Map();
// the pagers on the page, so a new page size applies to every table at once
const pagers = new Set();

// the group each row belongs to: a sub-row (an effort level under its model, an agent under its workflow run)
// stays with the row above it, so a page never splits a group
function pageUnits(subRows) {
  const units = [];
  let unit = -1;
  for (const sub of subRows) {
    if (!sub || unit < 0) unit += 1;
    units.push(unit);
  }
  return units;
}

// the groups a page shows, first to last (exclusive), with the page kept within the pages there are
function pageWindow(count, size, page) {
  const pages = Math.max(1, Math.ceil(count / size));
  const kept = Math.min(Math.max(page, 0), pages - 1);
  return {page: kept, pages, first: kept * size, last: Math.min(count, (kept + 1) * size)};
}

function pageText(shown, count, noun = "rows") {
  return `${noun} ${shown.first + 1}–${shown.last} of ${count}`;
}

// a saved page size, if it is one on offer
function pageSizeFrom(saved, sizes, fallback) {
  const size = Number(saved);
  return sizes.includes(size) ? size : fallback;
}

function pageSize() {
  return pageSizeFrom(readPreference(PAGE_SIZE_PREFERENCE), PAGE_SIZES, DEFAULT_PAGE_SIZE);
}

// A table with more groups of rows than the smallest page, or a grid with more cards (`paged-cards`, each card a
// group of its own), with a pager above it: the page size (a preference), previous and next, and which rows show,
// named by `noun`. `node` is the table or grid or an element holding it; the pager goes right before the table or
// grid. Rows off the page get a class, not `hidden`, which a workflow run's switch uses.
function paged(key, node, noun = "rows") {
  const list = node.matches("table, .paged-cards") ? node : node.querySelector("table, .paged-cards");
  let rows = [];
  if (list) rows = list.tagName === "TABLE" ? [...list.tBodies[0].rows] : [...list.children];
  const units = pageUnits(rows.map(row => row.classList.contains("sub-row")));
  const count = units.length ? units[units.length - 1] + 1 : 0;
  if (count <= PAGE_SIZES[0]) {
    // a pager left in the title row from a longer draw goes
    queueMicrotask(() => placePager(node, null));
    queueMicrotask(forgetDetachedPagers);
    return node;
  }
  const id = `pager-${key}`;
  const refocus = document.activeElement && document.activeElement.id ? document.activeElement.id : null;
  const size = el("select", {id: `${id}-size`, "aria-label": `${noun[0].toUpperCase()}${noun.slice(1)} per page`},
    ...PAGE_SIZES.map(option => el("option", {value: option, text: `${option} ${noun}`})));
  const previous = el("button", {type: "button", id: `${id}-previous`, text: "‹ Previous"});
  const next = el("button", {type: "button", id: `${id}-next`, text: "Next ›"});
  const status = el("span", {class: "muted", "aria-live": "polite"});
  const pager = el("div", {class: "pager", role: "group", "aria-label": "Pages"}, size, previous, status, next);
  const show = page => {
    const shown = pageWindow(count, pageSize(), page);
    tablePages.set(key, shown.page);
    rows.forEach((row, index) =>
      row.classList.toggle("off-page", units[index] < shown.first || units[index] >= shown.last));
    size.value = String(pageSize());
    previous.disabled = shown.page === 0;
    next.disabled = shown.page === shown.pages - 1;
    status.textContent = pageText(shown, count, noun);
  };
  // the pager stays where it was on the screen while the tables above it grow or shrink with the page size
  const turn = page => {
    const anchor = scrollAnchor([pager]);
    show(page);
    keepScroll(anchor, pager);
  };
  previous.addEventListener("click", () => turn(tablePages.get(key) - 1));
  next.addEventListener("click", () => turn(tablePages.get(key) + 1));
  size.addEventListener("change", () => {
    savePreference(PAGE_SIZE_PREFERENCE, size.value);
    for (const other of [...pagers]) {
      if (other.pager.isConnected) other.keepFirst();
      else pagers.delete(other);
    }
  });
  // at a new page size, the page that holds the first row shown before
  const keepFirst = () => {
    const first = rows.findIndex(row => !row.classList.contains("off-page"));
    turn(Math.floor(Math.max(units[first], 0) / pageSize()));
  };
  pagers.add({pager, keepFirst});
  show(tablePages.get(key) ?? 0);
  // once the caller has put the table in the page; before the refocus, since moving a control drops its focus
  queueMicrotask(() => placePager(pager, pager));
  queueMicrotask(forgetDetachedPagers);
  if (refocus && [size, previous, next].some(control => control.id === refocus)) {
    queueMicrotask(() => document.getElementById(refocus)?.focus({preventScroll: true}));
  }
  if (list === node) return el("div", {class: "paged"}, pager, list);
  list.before(pager);
  return node;
}

// Once a draw is in the page, the pagers it replaced go: a list drawn again every few seconds (the live sessions, an
// open live session) would otherwise keep every old draw alive through its pager
function forgetDetachedPagers() {
  for (const other of [...pagers]) {
    if (!other.pager.isConnected) pagers.delete(other);
  }
}

// The pager into its table's title row, right-aligned: the heading right before the table's wrap (or a grid's,
// `paged-wrap`; a note or the table's filters may sit between them) becomes a row with it. A table without one,
// such as a chart's table view under its chart, keeps the pager above it. A redraw finds the row already made and
// swaps its pager, or drops it for a table without one (pager null); `node` is what the caller put in the page.
function placePager(node, pager) {
  const wrap = node.isConnected ? node.closest(".table-wrap, .paged-wrap") : null;
  let title = wrap ? wrap.previousElementSibling : null;
  while (title && ["note", "table-filters"].some(name => title.classList.contains(name))) {
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

// --- tables --------------------------------------------------------------------------------------------------

function byCost(left, right) { return (right.cost ?? -1) - (left.cost ?? -1) || right.turns - left.turns; }

function usageHead(nameHeader) {
  return el("tr", {}, el("th", {text: nameHeader}), el("th", {class: "num", text: "Turns"}),
            el("th", {class: "num", text: "Input"}), el("th", {class: "num", text: "Cache read %"}),
            el("th", {class: "num", text: "Output"}), el("th", {class: "num", text: "Cost"}));
}

function usageRow(row, name, className) {
  return el("tr", {class: className}, el("td", {}, name),
    el("td", {class: "num", text: whole(row.turns)}), el("td", {class: "num", text: compact(inputTotal(row))}),
    el("td", {class: "num", text: percent(row.cache_read, inputTotal(row))}),
    el("td", {class: "num", text: compact(row.output)}), el("td", {class: "num", text: money(row.cost)}));
}

function usageTable(rows, nameHeader, nameCell, emptyText = "No usage in this range.") {
  if (!rows.length) return el("div", {class: "empty", text: emptyText});
  const body = rows.slice().sort(byCost).map(row => usageRow(row, nameCell(row)));
  return el("table", {}, el("thead", {}, usageHead(nameHeader)), el("tbody", {}, ...body));
}

// Each model's totals, then its usage per effort level as indented rows, background calls as one of them; calls
// without an effort level show no row of their own
function modelEffortTable(models, modelEfforts, nameCell) {
  if (!models.length) return el("div", {class: "empty", text: "No usage in this range."});
  const body = [];
  for (const model of models.slice().sort(byCost)) {
    body.push(usageRow(model, nameCell(model), "group-row"));
    const efforts = modelEfforts.filter(row => row.model === model.model && row.effort !== null)
      .sort((left, right) => effortRank(left.effort) - effortRank(right.effort) ||
                             left.effort.localeCompare(right.effort));
    for (const row of efforts) {
      body.push(usageRow(row, el("span", {class: "effort", text: effortName(row.effort)}), "sub-row"));
    }
  }
  return el("table", {}, el("thead", {}, usageHead("Model")), el("tbody", {}, ...body));
}

function renderTables(summary) {
  const slots = modelSlots([...new Set(summary.day_model.map(row => row.model))]);
  document.getElementById("by-agent").replaceChildren(paged("by-agent", usageTable(summary.agent_type,
    "Agent type", row => row.agent_type)));
  document.getElementById("by-model").replaceChildren(paged("by-model", modelEffortTable(summary.model,
    summary.model_effort, row => el("span", {}, el("span", {class: "swatch", style: `background:${slotColor(slots.has(row.model) ? slots.get(row.model) : null)}`}), row.model))));
  document.getElementById("by-project").replaceChildren(paged("by-project", usageTable(summary.project, "Project",
    row => row.project)));
  document.getElementById("by-skill").replaceChildren(paged("by-skill", usageTable(summary.skill, "Skill",
    row => row.skill, "No turns attributed to a skill in this range.")));
  document.getElementById("by-mcp-server").replaceChildren(paged("by-mcp-server", usageTable(summary.mcp_server,
    "MCP server", row => row.mcp_server, "No turns attributed to an MCP server in this range.")));
  renderSessions(summary.sessions);
  renderCostly(summary.costly_sessions);
}

// --- the sessions list: every session of the range, filtered by project and words ----------------------------

// whether a session is of the project picked ("" for all) and holds every word, in any case, in its title, project
// or id
function sessionMatches(session, project, text) {
  if (project && session.project !== project) return false;
  const haystack = `${session.title || ""} ${session.project} ${session.session_id}`.toLowerCase();
  return text.toLowerCase().split(/\s+/).filter(Boolean).every(word => haystack.includes(word));
}

// the projects to pick from, by name, with their sessions; the one picked stays on offer in a range without it, so
// the filter still shows
function sessionProjects(sessions, picked) {
  const counts = new Map();
  for (const session of sessions) counts.set(session.project, (counts.get(session.project) || 0) + 1);
  if (picked && !counts.has(picked)) counts.set(picked, 0);
  return [...counts].sort(([left], [right]) => left.localeCompare(right))
    .map(([project, count]) => ({project, count}));
}

function sessionCount(shown, total) {
  const sessions = `${total} session${total === 1 ? "" : "s"}`;
  return shown === total ? sessions : `${shown} of ${sessions}`;
}

// the range's sessions, drawn again through the filter as it changes; a refresh keeps the filter
let sessionList = [];
let sessionOptionsKey = null;

function renderSessions(sessions) {
  sessionList = sessions;
  const picker = document.getElementById("sessions-project");
  const picked = picker.value;
  const projects = sessionProjects(sessions, picked);
  // the options change only with the projects, so a refresh doesn't close the list while it is open
  const key = JSON.stringify(projects);
  if (key !== sessionOptionsKey) {
    sessionOptionsKey = key;
    picker.replaceChildren(el("option", {value: "", text: "All projects"}),
      ...projects.map(({project, count}) => el("option", {value: project, text: `${project} (${whole(count)})`})));
    picker.value = picked;
  }
  drawSessions();
}

function drawSessions() {
  const container = document.getElementById("sessions");
  const project = document.getElementById("sessions-project").value;
  const text = document.getElementById("sessions-search").value;
  const sessions = sessionList.filter(session => sessionMatches(session, project, text));
  document.getElementById("sessions-count").textContent = sessionCount(sessions.length, sessionList.length);
  const head = el("tr", {}, el("th", {text: "Last activity"}), el("th", {text: "Session"}),
                  el("th", {class: "num", text: "Subagents"}), el("th", {class: "num", text: "Turns"}),
                  el("th", {class: "num", text: "Avg context"}), el("th", {class: "num", text: "Peak context"}),
                  el("th", {class: "num", text: "Output"}), el("th", {class: "num", text: "Cost"}));
  const rows = sessions.map(session => el("tr", {},
    el("td", {class: "num", text: when(session.last_ts)}),
    el("td", {}, sessionLink(session), el("span", {class: "sub", text: session.project})),
    el("td", {class: "num", text: whole(session.subagents)}), el("td", {class: "num", text: whole(session.turns)}),
    el("td", {class: "num", text: compact(session.context_avg)}),
    el("td", {class: "num", text: compact(session.context_peak)}),
    el("td", {class: "num", text: compact(session.output)}), el("td", {class: "num", text: money(session.cost)})));
  const empty = sessionList.length ? "No sessions match the filter." : "No sessions in this range.";
  // paged even when empty, so a pager left from a longer list goes
  container.replaceChildren(paged("sessions", sessions.length
    ? el("table", {}, el("thead", {}, head), el("tbody", {}, ...rows))
    : el("div", {class: "empty", text: empty})));
}

// the controls are in the markup, outside what a redraw replaces, so typing keeps its focus; a new filter starts
// at the first page
function setupSessionFilters() {
  for (const [id, event] of [["sessions-project", "change"], ["sessions-search", "input"]]) {
    document.getElementById(id).addEventListener(event, () => {
      tablePages.delete("sessions");
      drawSessions();
    });
  }
}
