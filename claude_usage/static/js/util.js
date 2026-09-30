// DOM builders and fetching. The number, date and time formatting (compact, money, duration, when, ago, …) and the
// model colors (modelSlots, effortShade, swatchFill, …) come from the bundle (web/src/lib/format.ts and colors.ts,
// handed over by web/src/legacy.svelte.ts).
"use strict";

// --- helpers -------------------------------------------------------------------------------------------------

function el(tag, attributes, ...children) {
  const node = document.createElement(tag);
  for (const [name, value] of Object.entries(attributes || {})) {
    if (value === null || value === undefined || value === false) continue;
    if (name === "text") node.textContent = value;
    else if (name === "class") node.className = value;
    else node.setAttribute(name, value === true ? "" : value);
  }
  for (const child of children) {
    if (child === null || child === undefined) continue;
    node.append(child instanceof Node ? child : document.createTextNode(String(child)));
  }
  return node;
}

// Replace a node's children, leaving out the missing ones: replaceChildren itself would show null as text
function fill(node, ...children) {
  node.replaceChildren(...children.filter(child => child !== null && child !== undefined && child !== false));
}

// A view drawn again in place keeps what the reader was looking at: the first of `nodes` still showing at the top
// of the window, and how far from the top it starts. keepScroll puts that node (or the one that replaced it) back.
function scrollAnchor(nodes) {
  for (const node of nodes) {
    const box = node.getBoundingClientRect();
    if (box.bottom > 0) return {node, top: box.top};
  }
  return null;
}
function keepScroll(anchor, node) {
  if (anchor && node && node.isConnected) window.scrollBy(0, node.getBoundingClientRect().top - anchor.top);
}

const FOCUSABLE = "a[href], button, select, summary, [tabindex]";

// An element whose text is a label in the theme's wording; data-label lets applyTheme reword it in place, so a
// view that isn't drawn again (a session's) follows a theme change too
function themed(tag, label, attributes) {
  return el(tag, {...attributes, "data-label": label, text: hype(label)});
}

function svg(tag, attributes) {
  const node = document.createElementNS("http://www.w3.org/2000/svg", tag);
  for (const [name, value] of Object.entries(attributes || {})) node.setAttribute(name, value);
  return node;
}

function inputTotal(row) { return row.new_input + row.cache_write + row.cache_read; }

// "12 s ago" that refreshAgo() keeps current, so an unchanged live list needn't be drawn again
function agoSpan(iso) {
  return el("span", {"data-ago": iso || "", text: ago(iso)});
}
function refreshAgo() {
  for (const span of document.querySelectorAll("[data-ago]")) span.textContent = ago(span.dataset.ago || null);
}
function sessionLink(session) {
  return el("a", {href: `#session/${encodeURIComponent(session.session_id)}`,
                  text: session.title || "Untitled session"});
}

async function fetchJson(path) {
  const response = await fetch(path, {cache: "no-store"});
  let payload;
  try {
    payload = await response.json();
  } catch (error) {
    throw new Error(`${path}: HTTP ${response.status}, not JSON`);
  }
  // refused (no token, or a foreign host name): the reason alone, the same for every request
  if (response.status === 403) throw new Error(payload.error || "HTTP 403");
  if (!response.ok) throw new Error(`${path}: ${payload.error || "HTTP " + response.status}`);
  return payload;
}

// showError(source, message) and hasError(source) come from the bundle (web/src/legacy.svelte.ts): the banner keeps
// one message per source (live, summary, session, scan), so one source's success doesn't hide another's failure

// Files the last scan skipped, or why it failed: the page still shows the stored history
function showScanErrors(payload) {
  const found = payload.scan_errors || [];
  const more = found.length > 1 ? ` (and ${found.length - 1} more, see the server's log)` : "";
  showError("scan", found.length ? `Scan: ${found[0]}${more}` : "");
}
