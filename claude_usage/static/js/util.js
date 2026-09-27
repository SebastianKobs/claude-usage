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

function svg(tag, attributes) {
  const node = document.createElementNS("http://www.w3.org/2000/svg", tag);
  for (const [name, value] of Object.entries(attributes || {})) node.setAttribute(name, value);
  return node;
}

const compactFormat = new Intl.NumberFormat("en", {notation: "compact", maximumFractionDigits: 1});
const wholeFormat = new Intl.NumberFormat("en");
function compact(value) { return value === null || value === undefined ? "–" : compactFormat.format(value); }
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
  if (!response.ok) throw new Error(`${path}: ${payload.error || "HTTP " + response.status}`);
  return payload;
}

function showError(message) { document.getElementById("error").textContent = message || ""; }

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
function slotColor(slot) { return slot === null ? "var(--series-other)" : `var(--series-${slot + 1})`; }
