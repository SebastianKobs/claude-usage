// Rate limits: hits per day (or hour), and the latest failed API calls.
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
  renderLimitEvents(summary.api_errors.events);
  if (!limits.some(Boolean) && !others.some(Boolean)) {
    container.replaceChildren(el("div", {class: "empty", text: "No rate limits or API errors in this range."}));
    return;
  }
  const width = Math.max(320, container.clientWidth);
  const plotWidth = width - LEFT_AXIS - 8;
  // counts are whole, and so is the middle gridline: an even top of at least 2
  const top = Math.max(2, Math.ceil(niceMax(Math.max(...limits, 0)) / 2) * 2);
  const scale = value => LIMIT_PLOT * value / top;
  const band = plotWidth / keys.length;
  const barWidth = Math.max(2, Math.min(BAR_MAX, band * 0.6));
  const total = limits.reduce((sum, value) => sum + value, 0);
  const root = svg("svg", {viewBox: `0 0 ${width} ${LIMIT_PLOT + AXIS_BAND}`, height: LIMIT_PLOT + AXIS_BAND,
                          role: "img", "aria-label": `Rate-limit hits per ${buckets.unit}: ${whole(total)} in the ` +
                                                     "range; table view available"});
  for (let index = 0; index <= 2; index += 1) {
    const value = top * index / 2;
    const y = LIMIT_PLOT - scale(value) + 0.5;
    root.append(svg("line", {x1: LEFT_AXIS, x2: width - 8, y1: y, y2: y,
                             stroke: index === 0 ? "var(--axis)" : "var(--grid)", "stroke-width": 1}));
    const label = svg("text", {x: LEFT_AXIS - 8, y: y + 4, "text-anchor": "end", class: "axis-text"});
    label.textContent = whole(value);
    root.append(label);
  }
  const every = Math.max(1, Math.ceil(keys.length / 8));
  keys.forEach((key, index) => {
    if (index % every !== 0) return;
    const label = svg("text", {x: LEFT_AXIS + band * (index + 0.5), y: LIMIT_PLOT + 18, "text-anchor": "middle",
                               class: "axis-text"});
    label.textContent = buckets.short(key);
    root.append(label);
  });
  const tooltip = el("div", {class: "tooltip", hidden: true});
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
    const summaryText = `${whole(limits[index])} rate-limit hits, ${whole(others[index])} other API errors`;
    const hit = svg("rect", {x: LEFT_AXIS + band * index, y: 0, width: band, height: LIMIT_PLOT, class: "hit",
                             tabindex: 0, "aria-label": `${buckets.short(key)}: ${summaryText}`});
    const show = event => {
      tooltip.replaceChildren(el("div", {class: "when", text: buckets.long(key)}),
        el("div", {class: "row"}, el("span", {class: "key", style: `background:${LIMIT_COLOR}`}),
           el("strong", {text: whole(limits[index])}),
           el("span", {class: "name", text: `${LIMIT_ICON} rate-limit hits`})),
        el("div", {class: "row"}, el("span", {class: "key"}), el("strong", {text: whole(others[index])}),
           el("span", {class: "name", text: "other API errors"})));
      placeTooltip(tooltip, container, event, hit);
    };
    const hide = () => { tooltip.hidden = true; };
    hit.addEventListener("pointermove", show);
    hit.addEventListener("focus", show);
    hit.addEventListener("pointerleave", hide);
    hit.addEventListener("blur", hide);
    root.append(hit);
  });
  container.replaceChildren(root, tooltip);
}

function renderLimitsTable(buckets, at) {
  const head = el("tr", {}, el("th", {text: buckets.heading}), el("th", {class: "num", text: "Rate-limit hits"}),
                  el("th", {class: "num", text: "Other API errors"}));
  const rows = buckets.keys.slice().reverse().map(key => el("tr", {}, el("td", {text: buckets.short(key)}),
    el("td", {class: "num", text: whole(at(key).limits)}), el("td", {class: "num", text: whole(at(key).other)})));
  document.getElementById("limits-table").replaceChildren(el("table", {}, el("thead", {}, head),
                                                             el("tbody", {}, ...rows)));
}

function renderLimitEvents(events) {
  document.getElementById("limit-events").replaceChildren(
    limitEventsTable(events, "No API errors in this range.", true));
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
