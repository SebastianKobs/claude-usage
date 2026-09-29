// Rate limits: hits per day (or hour), the 5-hour windows that hit one, and the latest failed API calls.
"use strict";

// --- rate limits: one series of columns in the status color, with an icon and a label beside it --------------
// A rate limit is a state, not a category, so it wears the reserved critical status color rather than a series
// slot; other API errors are rarer and go into the tooltip, the table view and the list, not a second color.

const LIMIT_PLOT = 120;
const RATE_LIMIT = "rate_limit";
const LIMIT_COLOR = "var(--status-critical)";
const LIMIT_ICON = "⚠";
const LIMIT_TYPES = {five_hour: "5-hour limit", seven_day: "weekly limit", seven_day_opus: "weekly Opus limit"};

function limitType(type) {
  if (!type) return "–";
  return LIMIT_TYPES[type] || type.replaceAll("_", " ");
}

function errorText(event) {
  if (event.error === RATE_LIMIT) return `${LIMIT_ICON} Rate limit${event.status ? ` (${event.status})` : ""}`;
  return `${event.error.replaceAll("_", " ")}${event.status ? ` (${event.status})` : ""}`;
}

// the same time axis as the other charts: the range's days, or the day's hours
function limitCounts(summary) {
  const buckets = timeBuckets(summary);
  const rows = buckets.unit === "hour" ? summary.api_errors.hour : summary.api_errors.day;
  const counts = new Map();
  for (const row of rows) {
    const key = buckets.unit === "hour" ? row.hour : row.day;
    const bucket = counts.get(key) || {limits: 0, other: 0};
    if (row.error === RATE_LIMIT) bucket.limits += row.count;
    else bucket.other += row.count;
    counts.set(key, bucket);
  }
  return {buckets, at: key => counts.get(key) || {limits: 0, other: 0}};
}

function renderLimits(summary) {
  const container = document.getElementById("limits");
  const {buckets, at} = limitCounts(summary);
  const keys = buckets.keys;
  const limits = keys.map(key => at(key).limits);
  const others = keys.map(key => at(key).other);
  document.getElementById("limits-note").textContent =
    `rate-limit hits per ${buckets.unit}; other API errors are in the tooltip, the table view and the list`;
  document.getElementById("limits-legend").replaceChildren(
    el("span", {}, el("span", {class: "swatch", style: `background:${LIMIT_COLOR}`}),
       `${LIMIT_ICON} Rate-limit hit`));
  renderLimitsTable(buckets, at);
  renderLimitWindows(summary.api_errors.windows);
  renderLimitEvents(summary.api_errors.events);
  if (!limits.some(Boolean) && !others.some(Boolean)) {
    container.replaceChildren(el("div", {class: "empty", text: "No rate limits or API errors in this range."}));
    return;
  }
  const width = chartWidth(container);
  const right = width - 8;
  // counts are whole, and so is the middle gridline: an even top of at least 2
  const top = Math.max(2, Math.ceil(niceMax(Math.max(...limits, 0)) / 2) * 2);
  const scale = value => LIMIT_PLOT * value / top;
  const band = (right - LEFT_AXIS) / keys.length;
  const barWidth = Math.max(2, Math.min(BAR_MAX, band * 0.6));
  const total = limits.reduce((sum, value) => sum + value, 0);
  const root = chartRoot(width, LIMIT_PLOT + AXIS_BAND,
                         `Rate-limit hits per ${buckets.unit}: ${whole(total)} in the range; table view available`);
  drawYAxis(root, LEFT_AXIS, right, ticks(top, 2), value => LIMIT_PLOT - scale(value), whole);
  drawXLabels(root, keys.length, index => LEFT_AXIS + band * (index + 0.5), LIMIT_PLOT + 18,
              index => buckets.short(keys[index]));
  const peak = limits.indexOf(Math.max(...limits));
  keys.forEach((key, index) => {
    const x = LEFT_AXIS + band * index + (band - barWidth) / 2;
    const height = scale(limits[index]);
    if (height > 0) {
      root.append(svg("path", {d: columnPath(x, LIMIT_PLOT - height, barWidth, height, true), fill: LIMIT_COLOR}));
    }
    if (index === peak && limits[index] > 0) {
      const label = svg("text", {x: x + barWidth / 2, y: LIMIT_PLOT - height - 6, "text-anchor": "middle",
                                 class: "value-text"});
      label.textContent = whole(limits[index]);
      root.append(label);
    }
  });
  const highlight = svg("rect", {y: 0, width: band, height: LIMIT_PLOT, class: "column-mark", visibility: "hidden"});
  const tooltip = tooltipBox();
  const counts = index => `${whole(limits[index])} rate-limit hits, ${whole(others[index])} other API errors`;
  const cursor = chartCursor(root, width, {x: LEFT_AXIS, y: 0, width: right - LEFT_AXIS, height: LIMIT_PLOT}, {
    count: keys.length,
    indexAt: bandIndex(LEFT_AXIS, band),
    label: `Rate-limit hits per ${buckets.unit}; arrow keys step through them`,
    valueText: index => `${buckets.long(keys[index])}: ${counts(index)}`,
    show: index => {
      moveMark(highlight, {x: LEFT_AXIS + band * index});
      tooltip.replaceChildren(el("div", {class: "when", text: buckets.long(keys[index])}),
        tooltipRow(LIMIT_COLOR, whole(limits[index]), `${LIMIT_ICON} rate-limit hits`),
        tooltipRow(null, whole(others[index]), "other API errors"));
      placeTooltipAt(tooltip, container, root, width, LEFT_AXIS + band * (index + 0.5));
    },
    hide: () => {
      hideMarks(highlight);
      tooltip.hidden = true;
    },
  });
  root.append(highlight, cursor);
  container.replaceChildren(root, tooltip);
}

function renderLimitsTable(buckets, at) {
  fillTableView("limits-table",
    [headCell(buckets.heading), headCell("Rate-limit hits", true), headCell("Other API errors", true)],
    buckets.keys.slice().reverse().map(key => el("tr", {}, cell(buckets.short(key)),
      cell(whole(at(key).limits), true), cell(whole(at(key).other), true))));
}

// --- the 5-hour windows that hit a limit: what each used up to its first hit, its models under it ------------

function windowHitAfter(window) { return Date.parse(window.first_hit) - Date.parse(window.start); }

// "Sep 28, 10:00 – 15:00", the reset's day only where it isn't the start's
function windowSpan(window) {
  const start = new Date(window.start);
  const end = new Date(window.resets_at);
  const endText = start.toDateString() === end.toDateString()
    ? end.toLocaleTimeString(undefined, {hour: "2-digit", minute: "2-digit"}) : when(window.resets_at);
  return `${when(window.start)} – ${endText}`;
}

// a usage row with the window's own cells after its name
function limitWindowRow(usage, name, windowCells, className) {
  const row = usageRow(usage, name, className);
  row.firstElementChild.after(...windowCells);
  return row;
}

function limitWindowsTable(windows) {
  if (!windows.length) return el("div", {class: "empty", text: "No 5-hour window hit its limit in this range."});
  const head = el("tr", {}, headCell("Window"), headCell("Hit after", true), headCell("Hits", true),
                  headCell("Turns", true), headCell("Input", true), headCell("Cache read %", true),
                  headCell("Output", true), headCell("Cost", true));
  const body = [];
  for (const window of windows) {
    body.push(limitWindowRow(window.used, windowSpan(window),
      [cell(duration(windowHitAfter(window)), true), cell(whole(window.hits), true)],
      window.models.length ? "group-row" : null));
    for (const model of window.models.slice().sort(byCost)) {
      body.push(limitWindowRow(model, el("span", {class: "window-model", text: model.model}),
        [cell(""), cell("")], "sub-row"));
    }
  }
  return el("table", {}, el("thead", {}, head), el("tbody", {}, ...body));
}

function renderLimitWindows(windows) {
  document.getElementById("limit-windows").replaceChildren(paged("limit-windows", limitWindowsTable(windows)));
}

function renderLimitEvents(events) {
  document.getElementById("limit-events").replaceChildren(
    paged("limit-events", limitEventsTable(events, "No API errors in this range.", true)));
}

// failed API calls as a table; withSession adds the session column (the session view leaves it out)
function limitEventsTable(events, emptyText, withSession) {
  if (!events.length) return el("div", {class: "empty", text: emptyText});
  const head = el("tr", {}, el("th", {text: "When"}), el("th", {text: "Error"}), el("th", {text: "Quota"}),
                  el("th", {text: "Resets"}), withSession ? el("th", {text: "Session"}) : null,
                  el("th", {text: "Agent"}));
  const rows = events.map(event => el("tr", {},
    el("td", {class: "num", text: when(event.ts)}), el("td", {text: errorText(event)}),
    el("td", {text: limitType(event.limit_type)}), el("td", {class: "num", text: when(event.resets_at)}),
    withSession ? el("td", {}, sessionLink(event), el("span", {class: "sub", text: event.project})) : null,
    el("td", {text: event.agent_type})));
  return el("table", {}, el("thead", {}, head), el("tbody", {}, ...rows));
}
