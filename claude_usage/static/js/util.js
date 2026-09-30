// DOM builders, number and date formatting, fetching, and the model colors.
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

const compactFormat = new Intl.NumberFormat("en", {notation: "compact", maximumFractionDigits: 1});
const wholeFormat = new Intl.NumberFormat("en");
function compact(value) { return value === null || value === undefined ? "–" : compactFormat.format(value); }
// a change with its sign: +12K, −3K
function signed(value) { return value < 0 ? `−${compact(-value)}` : `+${compact(value)}`; }
function whole(value) { return value === null || value === undefined ? "–" : wholeFormat.format(value); }
function money(value) {
  if (value === null || value === undefined) return "–";
  if (Math.abs(value) >= 1000) return "$" + compactFormat.format(value);
  return "$" + value.toFixed(value >= 100 ? 0 : 2);
}
function percent(part, total) {
  if (!total) return "–";
  const share = 100 * part / total;
  // one decimal below 10%, so a small part doesn't read as 0% or a round 1%
  return (share > 0 && share < 10 ? share.toFixed(1) : String(Math.round(share))) + "%";
}
function duration(milliseconds) {
  if (milliseconds === null || milliseconds === undefined) return "–";
  const seconds = Math.round(milliseconds / 1000);
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours) return minutes ? `${hours} h ${minutes} min` : `${hours} h`;
  if (minutes) return seconds % 60 ? `${minutes} min ${seconds % 60} s` : `${minutes} min`;
  return `${seconds} s`;
}
function inputTotal(row) { return row.new_input + row.cache_write + row.cache_read; }

function parseDay(text) {
  const [year, month, day] = text.split("-").map(Number);
  return new Date(year, month - 1, day);
}
function dayText(date) {
  const pad = number => String(number).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}
function shortDay(text) {
  return parseDay(text).toLocaleDateString(undefined, {month: "short", day: "numeric"});
}
function longDay(text) {
  return parseDay(text).toLocaleDateString(undefined, {weekday: "short", month: "short", day: "numeric"});
}
// hour keys are the store's local "YYYY-MM-DDTHH"
function parseHour(text) {
  const [day, hour] = text.split("T");
  const moment = parseDay(day);
  moment.setHours(Number(hour));
  return moment;
}
function shortHour(text) {
  return parseHour(text).toLocaleTimeString(undefined, {hour: "2-digit", minute: "2-digit"});
}
function longHour(text) {
  const start = parseHour(text);
  const end = new Date(start.getTime() + 3600 * 1000);
  const time = moment => moment.toLocaleTimeString(undefined, {hour: "2-digit", minute: "2-digit"});
  return `${start.toLocaleDateString(undefined, {weekday: "short", month: "short", day: "numeric"})}, ` +
    `${time(start)}–${time(end)}`;
}
function when(iso) {
  if (!iso) return "–";
  return new Date(iso).toLocaleString(undefined, {month: "short", day: "numeric", hour: "2-digit",
                                                  minute: "2-digit"});
}
function ago(iso) {
  if (!iso) return "–";
  const seconds = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 1000));
  if (seconds < 60) return `${seconds} s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
  return when(iso);
}
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

// --- colors --------------------------------------------------------------------------------------------------

function modelSlots(models) {
  const slots = new Map();
  const ordered = [...KNOWN_MODELS.filter(model => models.includes(model)),
                   ...models.filter(model => !KNOWN_MODELS.includes(model)).sort()];
  for (const model of KNOWN_MODELS) {
    if (models.includes(model)) slots.set(model, KNOWN_MODELS.indexOf(model));
  }
  const free = [...Array(SLOT_COUNT).keys()].filter(slot => ![...slots.values()].includes(slot));
  for (const model of ordered) {
    if (slots.has(model)) continue;
    slots.set(model, free.length ? free.shift() : null);        // null: folded into "Other"
  }
  return slots;
}
// effort levels from least to most, ultracode (xhigh with its workflows) last; others sort after them by name
const EFFORT_ORDER = ["low", "medium", "high", "xhigh", "max", "ultracode"];
function effortRank(effort) {
  const rank = EFFORT_ORDER.indexOf(effort);
  return rank === -1 ? EFFORT_ORDER.length : rank;
}
// the effort level of background usage (store.BACKGROUND_EFFORT): calls no transcript shows, so no level is known
const BACKGROUND_EFFORT = "background";
// an effort level as the tables and the series' keys name it ("effort high"), and as the legend and the tooltip do
// under their model ("high")
function effortName(effort) {
  if (effort === BACKGROUND_EFFORT) return "background calls";
  return effort ? `effort ${effort}` : "no effort level";
}
function effortLabel(effort) {
  if (effort === BACKGROUND_EFFORT) return "background calls";
  return effort ?? "no effort level";
}
// A model's color, shaded by effort level: the model's own color for low, none or an unknown level, then one step
// further from the surface each for medium, high and max (xhigh shares max's shade). Each slot's step is sized for
// the same lightness gap (--shade-step-*, validated per theme); the legend, tooltip and table name every level.
// Ultracode shares max's shade too, hatched at 45° with lines one step further (tone on tone), so it needs no color
// of its own. Background usage wears the model's own color, hatched the other way (135°) with lines one step further.
const EFFORT_SHADES = {background: 0, medium: 1, high: 2, xhigh: 3, max: 3, ultracode: 3};
const HATCH_SHADES = {background: 1, ultracode: 4};
// how far a hatch turns its vertical lines, in degrees (clockwise on screen): 45 draws "/", -45 draws "\"
const HATCH_TURNS = {background: -45, ultracode: 45};
function effortShade(slot, effort) { return shade(slot, EFFORT_SHADES[effort] || 0); }
// the color of the effort level's hatch lines, or null for a level without a hatch
function effortHatch(slot, effort) { return HATCH_SHADES[effort] ? shade(slot, HATCH_SHADES[effort]) : null; }
function hatchTurn(effort) { return HATCH_TURNS[effort] ?? null; }
function shade(slot, step) {
  const name = slot === null ? "other" : slot + 1;
  if (step === 0) return slotColor(slot);
  return `color-mix(in oklab, var(--series-${name}), var(--shade-ink) calc(var(--shade-step-${name}) * ${step}))`;
}
// a swatch's background: a series' color, with its hatch where it has one, its lines turned like the columns' (a
// gradient runs across its stripes, so 90° further)
function swatchFill(color, hatch, turn) {
  return hatch ? `repeating-linear-gradient(${90 + turn}deg, ${hatch} 0 1.5px, ${color} 1.5px 4px)` : color;
}
function slotColor(slot) { return slot === null ? "var(--series-other)" : `var(--series-${slot + 1})`; }
