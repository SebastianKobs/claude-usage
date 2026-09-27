// The over-time panels, the by-model chart, and cost per session.
"use strict";

// --- over time: three aligned panels, one y-axis each, one shared time axis (never a second axis on one plot) -

const TREND_PANELS = [
  {label: "Estimated cost", slot: 0, value: totals => totals.cost, format: money},
  {label: "Input tokens", slot: 1, value: totals => totals.input, format: compact},
  {label: "Output tokens", slot: 2, value: totals => totals.output, format: compact},
];
const PANEL_TITLE = 22;
const PANEL_PLOT = 76;
const PANEL_GAP = 18;
const RIGHT_PAD = 64;
const NO_USAGE = {cost: 0, input: 0, output: 0};

function bucketTotals(buckets) {
  const totals = new Map();
  for (const row of buckets.rows) {
    const key = buckets.keyOf(row);
    const bucket = totals.get(key) || {cost: 0, input: 0, output: 0};
    bucket.cost += row.cost || 0;
    bucket.input += inputTotal(row);
    bucket.output += row.output;
    totals.set(key, bucket);
  }
  return totals;
}

function renderTrend(summary) {
  const container = document.getElementById("trend");
  const buckets = timeBuckets(summary);
  const days = buckets.keys;
  const totals = bucketTotals(buckets);
  const at = day => totals.get(day) || NO_USAGE;
  document.getElementById("trend-note").textContent =
    `estimated cost, input and output tokens per ${buckets.unit}`;
  renderTrendTable(buckets, at);
  const width = Math.max(320, container.clientWidth);
  const left = LEFT_AXIS;
  const right = width - RIGHT_PAD;
  const last = days.length - 1;
  const xOf = index => (last > 0 ? left + (right - left) * index / last : (left + right) / 2);
  const panelHeight = PANEL_TITLE + PANEL_PLOT + PANEL_GAP;
  const plotsBottom = panelHeight * TREND_PANELS.length - PANEL_GAP;
  const height = plotsBottom + AXIS_BAND;
  const root = svg("svg", {viewBox: `0 0 ${width} ${height}`, height, role: "img",
                          "aria-label": `Estimated cost, input tokens and output tokens per ${buckets.unit}; table view available`});
  const markers = [];
  TREND_PANELS.forEach((panel, position) => {
    const top = position * panelHeight + PANEL_TITLE;
    const bottom = top + PANEL_PLOT;
    const color = slotColor(panel.slot);
    const values = days.map(day => panel.value(at(day)));
    const max = niceMax(Math.max(...values, 0));
    const yOf = value => bottom - PANEL_PLOT * value / max;
    // the panel title carries a line key, so identity never rests on color alone
    root.append(svg("line", {x1: left, x2: left + 14, y1: top - 10, y2: top - 10, stroke: color, "stroke-width": 2,
                             "stroke-linecap": "round"}));
    const title = svg("text", {x: left + 20, y: top - 6, class: "panel-title"});
    title.textContent = panel.label;
    root.append(title);
    for (const fraction of [0, 0.5, 1]) {
      const y = Math.round(yOf(max * fraction)) + 0.5;
      root.append(svg("line", {x1: left, x2: right, y1: y, y2: y, "stroke-width": 1,
                               stroke: fraction === 0 ? "var(--axis)" : "var(--grid)"}));
      const label = svg("text", {x: left - 8, y: y + 4, "text-anchor": "end", class: "axis-text"});
      label.textContent = panel.format(max * fraction);
      root.append(label);
    }
    const points = values.map((value, index) => `${xOf(index).toFixed(1)},${yOf(value).toFixed(1)}`);
    root.append(svg("path", {d: `M${xOf(0)},${bottom}L${points.join("L")}L${xOf(last)},${bottom}Z`,
                             fill: color, "fill-opacity": 0.1}));
    root.append(svg("path", {d: `M${points.join("L")}`, fill: "none", stroke: color, "stroke-width": 2,
                             "stroke-linejoin": "round", "stroke-linecap": "round"}));
    // end dot with a surface ring, and the one direct label: the latest value
    root.append(svg("circle", {cx: xOf(last), cy: yOf(values[last]), r: 4, fill: color, stroke: "var(--surface)",
                               "stroke-width": 2}));
    const end = svg("text", {x: xOf(last) + 9, y: yOf(values[last]) + 4, class: "value-text"});
    end.textContent = panel.format(values[last]);
    root.append(end);
    const marker = svg("circle", {r: 4, fill: color, stroke: "var(--surface)", "stroke-width": 2,
                                  visibility: "hidden"});
    markers.push({marker, yOf, values});
    root.append(marker);
  });
  const every = Math.max(1, Math.ceil(days.length / 8));
  days.forEach((day, index) => {
    if (index % every !== 0) return;
    const label = svg("text", {x: xOf(index), y: plotsBottom + 18, "text-anchor": "middle", class: "axis-text"});
    label.textContent = buckets.short(day);
    root.append(label);
  });
  // the crosshair finds the day or hour: each day owns the band up to the midpoints with its neighbours
  const crosshair = svg("line", {y1: PANEL_TITLE - 4, y2: plotsBottom, class: "crosshair", visibility: "hidden"});
  root.append(crosshair);
  const tooltip = el("div", {class: "tooltip", hidden: true});
  days.forEach((day, index) => {
    const from = index === 0 ? left : (xOf(index - 1) + xOf(index)) / 2;
    const to = index === last ? right : (xOf(index) + xOf(index + 1)) / 2;
    const summaryText = TREND_PANELS.map(panel => `${panel.label} ${panel.format(panel.value(at(day)))}`).join(", ");
    const hit = svg("rect", {x: from, y: 0, width: Math.max(1, to - from), height: plotsBottom,
                             class: "hit trend-hit", tabindex: 0, "aria-label": `${buckets.short(day)}: ${summaryText}`});
    const show = event => {
      crosshair.setAttribute("x1", xOf(index));
      crosshair.setAttribute("x2", xOf(index));
      crosshair.setAttribute("visibility", "visible");
      for (const {marker, yOf, values} of markers) {
        marker.setAttribute("cx", xOf(index));
        marker.setAttribute("cy", yOf(values[index]));
        marker.setAttribute("visibility", "visible");
      }
      tooltip.replaceChildren(
        el("div", {class: "when", text: buckets.long(day)}),
        ...TREND_PANELS.map(panel => el("div", {class: "row"},
          el("span", {class: "key", style: `background:${slotColor(panel.slot)}`}),
          el("strong", {text: panel.format(panel.value(at(day)))}), el("span", {class: "name", text: panel.label}))));
      placeTooltip(tooltip, container, event, hit);
    };
    const hide = () => {
      crosshair.setAttribute("visibility", "hidden");
      for (const {marker} of markers) marker.setAttribute("visibility", "hidden");
      tooltip.hidden = true;
    };
    hit.addEventListener("pointermove", show);
    hit.addEventListener("focus", show);
    hit.addEventListener("pointerleave", hide);
    hit.addEventListener("blur", hide);
    root.append(hit);
  });
  container.replaceChildren(root, tooltip);
}

function renderTrendTable(buckets, at) {
  const head = el("tr", {}, el("th", {text: buckets.heading}),
                  ...TREND_PANELS.map(panel => el("th", {class: "num", text: panel.label})));
  const rows = buckets.keys.slice().reverse().map(day => el("tr", {}, el("td", {text: buckets.short(day)}),
    ...TREND_PANELS.map(panel => el("td", {class: "num", text: panel.format(panel.value(at(day)))}))));
  document.getElementById("trend-table").replaceChildren(el("table", {}, el("thead", {}, head),
                                                            el("tbody", {}, ...rows)));
}

// --- daily chart ---------------------------------------------------------------------------------------------

function rangeDays(since) {
  const days = [];
  for (let day = parseDay(since); day <= new Date(); day.setDate(day.getDate() + 1)) {
    days.push(dayText(day));
  }
  return days;
}

// The time axis of both charts: days, or for today alone its hours from midnight up to now, since one day would
// be a single point
function timeBuckets(summary) {
  if (summary.days !== 1 || !summary.hour_model) {
    return {keys: rangeDays(summary.since), rows: summary.day_model, keyOf: row => row.day, unit: "day",
            heading: "Day", short: shortDay, long: longDay};
  }
  const now = new Date();
  const lastHour = summary.since === dayText(now) ? now.getHours() : 23;
  const keys = [];
  for (let hour = 0; hour <= lastHour; hour += 1) keys.push(`${summary.since}T${String(hour).padStart(2, "0")}`);
  return {keys, rows: summary.hour_model, keyOf: row => row.hour, unit: "hour", heading: "Hour", short: shortHour,
          long: longHour};
}

function chartData(summary) {
  const metric = METRICS[state.metric];
  const buckets = timeBuckets(summary);
  const models = [...new Set(buckets.rows.map(row => row.model))];
  const slots = modelSlots(models);
  // series: one per slot, plus "Other" for models past the eighth slot
  const series = [];
  const bySeries = new Map();
  for (const model of models) {
    const slot = slots.get(model);
    const key = slot === null ? "Other" : model;
    if (!bySeries.has(key)) {
      const entry = {key, slot, values: new Map()};
      bySeries.set(key, entry);
      series.push(entry);
    }
  }
  series.sort((left, right) => (left.slot ?? SLOT_COUNT) - (right.slot ?? SLOT_COUNT));
  for (const row of buckets.rows) {
    const slot = slots.get(row.model);
    const entry = bySeries.get(slot === null ? "Other" : row.model);
    const key = buckets.keyOf(row);
    entry.values.set(key, (entry.values.get(key) || 0) + metric.value(row));
  }
  return {buckets, days: buckets.keys, series, metric};
}

function niceMax(value) {
  if (value <= 0) return 1;
  const power = Math.pow(10, Math.floor(Math.log10(value)));
  for (const step of [1, 2, 2.5, 5, 10]) {
    if (value <= step * power) return step * power;
  }
  return 10 * power;
}

function renderLegend(series) {
  document.getElementById("legend").replaceChildren(...series.map(entry =>
    el("span", {}, el("span", {class: "swatch", style: `background:${slotColor(entry.slot)}`}), entry.key)));
}

function columnPath(x, y, width, height, rounded) {
  const radius = rounded ? Math.min(CORNER, width / 2, height) : 0;
  return `M${x},${y + height}V${y + radius}` +
    (radius ? `Q${x},${y} ${x + radius},${y}H${x + width - radius}Q${x + width},${y} ${x + width},${y + radius}`
            : `H${x + width}`) +
    `V${y + height}Z`;
}

function renderChart(summary) {
  const container = document.getElementById("chart");
  const {buckets, days, series, metric} = chartData(summary);
  const title = document.getElementById("chart-title");
  title.dataset.label = `Per ${buckets.unit}, by model`;
  title.textContent = hype(title.dataset.label);
  renderLegend(series);
  renderChartTable(buckets, series, metric);
  const width = Math.max(320, container.clientWidth);
  const plotWidth = width - LEFT_AXIS - 8;
  const totals = days.map(day => series.reduce((sum, entry) => sum + (entry.values.get(day) || 0), 0));
  const top = niceMax(Math.max(...totals, 0));
  const scale = value => PLOT_HEIGHT * value / top;
  const band = plotWidth / days.length;
  const barWidth = Math.max(2, Math.min(BAR_MAX, band * 0.6));
  const root = svg("svg", {viewBox: `0 0 ${width} ${PLOT_HEIGHT + AXIS_BAND}`, height: PLOT_HEIGHT + AXIS_BAND,
                          role: "img", "aria-label": `${metric.label} per ${buckets.unit} by model; table view available`});
  // gridlines and y ticks
  for (let index = 0; index <= 4; index += 1) {
    const value = top * index / 4;
    const y = PLOT_HEIGHT - scale(value) + 0.5;
    root.append(svg("line", {x1: LEFT_AXIS, x2: width - 8, y1: y, y2: y,
                             stroke: index === 0 ? "var(--axis)" : "var(--grid)", "stroke-width": 1}));
    const label = svg("text", {x: LEFT_AXIS - 8, y: y + 4, "text-anchor": "end", class: "axis-text"});
    label.textContent = metric.format(value);
    root.append(label);
  }
  // x labels: at most about eight, evenly spaced
  const every = Math.max(1, Math.ceil(days.length / 8));
  days.forEach((day, index) => {
    if (index % every !== 0) return;
    const label = svg("text", {x: LEFT_AXIS + band * (index + 0.5), y: PLOT_HEIGHT + 18, "text-anchor": "middle",
                               class: "axis-text"});
    label.textContent = buckets.short(day);
    root.append(label);
  });
  // stacked columns, 2px surface gap between segments, rounded data end on the top segment only
  const peak = totals.indexOf(Math.max(...totals));
  days.forEach((day, index) => {
    const x = LEFT_AXIS + band * index + (band - barWidth) / 2;
    const present = series.filter(entry => (entry.values.get(day) || 0) > 0);
    let base = PLOT_HEIGHT;
    present.forEach((entry, position) => {
      const height = scale(entry.values.get(day));
      const gap = position > 0 && height > GAP ? GAP : 0;
      const drawn = height - gap;
      if (drawn > 0) {
        root.append(svg("path", {d: columnPath(x, base - height, barWidth, drawn, position === present.length - 1),
                                 fill: slotColor(entry.slot)}));
      }
      base -= height;
    });
    if (index === peak && totals[index] > 0) {
      const label = svg("text", {x: x + barWidth / 2, y: PLOT_HEIGHT - scale(totals[index]) - 6,
                                 "text-anchor": "middle", class: "value-text"});
      label.textContent = metric.format(totals[index]);
      root.append(label);
    }
    // the whole column is the hit target, wider than the bar
    const hit = svg("rect", {x: LEFT_AXIS + band * index, y: 0, width: band, height: PLOT_HEIGHT, class: "hit",
                             tabindex: 0, "aria-label": `${buckets.short(day)}: ${metric.format(totals[index])}`});
    const show = event => showTooltip(event, container, hit, buckets.long(day), day, series, metric,
                                      totals[index]);
    hit.addEventListener("pointermove", show);
    hit.addEventListener("focus", show);
    hit.addEventListener("pointerleave", hideTooltip);
    hit.addEventListener("blur", hideTooltip);
    root.append(hit);
  });
  const tooltip = el("div", {class: "tooltip", id: "tooltip", hidden: true});
  container.replaceChildren(root, tooltip);
}

function showTooltip(event, container, hit, heading, day, series, metric, total) {
  const tooltip = document.getElementById("tooltip");
  const rows = series.filter(entry => entry.values.get(day)).reverse().map(entry =>
    el("div", {class: "row"}, el("span", {class: "key", style: `background:${slotColor(entry.slot)}`}),
       el("strong", {text: metric.format(entry.values.get(day))}), el("span", {class: "name", text: entry.key})));
  tooltip.replaceChildren(el("div", {class: "when", text: heading}),
                          ...(rows.length ? rows : [el("div", {class: "name", text: "No usage"})]),
                          rows.length > 1 ? el("div", {class: "row"}, el("span", {class: "key"}),
                                               el("strong", {text: metric.format(total)}),
                                               el("span", {class: "name", text: "total"})) : null);
  placeTooltip(tooltip, container, event, hit);
}

function placeTooltip(tooltip, container, event, hit, top = 8) {
  tooltip.hidden = false;
  const bounds = container.getBoundingClientRect();
  const target = hit.getBoundingClientRect();
  const anchor = event.clientX ? event.clientX - bounds.left : target.left - bounds.left + target.width / 2;
  const left = Math.min(Math.max(0, anchor + 12), bounds.width - tooltip.offsetWidth);
  tooltip.style.left = `${left}px`;
  tooltip.style.top = `${top}px`;
}

function hideTooltip() {
  const tooltip = document.getElementById("tooltip");
  if (tooltip) tooltip.hidden = true;
}

function renderChartTable(buckets, series, metric) {
  const head = el("tr", {}, el("th", {text: buckets.heading}), ...series.map(entry => el("th", {class: "num", text: entry.key})),
                  el("th", {class: "num", text: "Total"}));
  const rows = buckets.keys.slice().reverse().map(day => {
    const values = series.map(entry => entry.values.get(day) || 0);
    return el("tr", {}, el("td", {text: buckets.short(day)}),
              ...values.map(value => el("td", {class: "num", text: value ? metric.format(value) : "–"})),
              el("td", {class: "num", text: metric.format(values.reduce((sum, value) => sum + value, 0))}));
  });
  document.getElementById("chart-table").replaceChildren(el("table", {}, el("thead", {}, head),
                                                            el("tbody", {}, ...rows)));
}

// --- cost per session: ranked horizontal bars, cache reads vs. the rest --------------------------------------
// Two parts of one cost, so two steps of one hue as in the input split: cache reads (soft) from the baseline, so
// their lengths compare across sessions, then everything else (strong).

const COSTLY_PARTS = [
  {label: "Cache reads", color: "var(--split-soft)", value: session => session.cost_parts.cache_read},
  {label: "Everything else", color: "var(--split-strong)",
   value: session => Math.max(0, (session.cost || 0) - session.cost_parts.cache_read),
   note: "new input, cache writes, output and web searches"},
];

function renderCostly(sessions) {
  const container = document.getElementById("costly");
  document.getElementById("costly-legend").replaceChildren(...COSTLY_PARTS.map(part =>
    el("span", {}, el("span", {class: "swatch", style: `background:${part.color}`}),
       part.note ? `${part.label} (${part.note})` : part.label)));
  renderCostlyTable(sessions);
  if (!sessions.length) {
    container.replaceChildren(el("div", {class: "empty", text: "No sessions in this range."}));
    return;
  }
  const top = Math.max(...sessions.map(session => session.cost || 0)) || 1;
  const tooltip = el("div", {class: "tooltip", hidden: true});
  const rows = sessions.map(session => {
    const cost = session.cost || 0;
    const parts = COSTLY_PARTS.map(part => ({...part, amount: part.value(session)}));
    const bar = el("div", {class: "bar", style: `width:${(100 * cost / top).toFixed(2)}%`},
      ...parts.filter(part => part.amount > 0).map(part =>
        el("span", {style: `flex-grow:${part.amount};background:${part.color}`})));
    const summaryText = parts.map(part => `${part.label} ${money(part.amount)}`).join(", ");
    const row = el("a", {class: "bar-row", href: `#session/${encodeURIComponent(session.session_id)}`,
                         "aria-label": `${session.title || "Untitled session"}: ${money(session.cost)}; ${summaryText}`},
      el("span", {class: "bar-name"}, el("strong", {text: session.title || "Untitled session"}),
         el("span", {class: "sub", text: `${session.project} · ${whole(session.turns)} turns · avg context ${compact(session.context_avg)}`})),
      el("span", {class: "bar-track"}, bar),
      el("span", {class: "bar-value", text: money(session.cost)}));
    const show = event => {
      tooltip.replaceChildren(
        el("div", {class: "when", text: session.title || "Untitled session"}),
        ...parts.map(part => el("div", {class: "row"},
          el("span", {class: "swatch", style: `background:${part.color}`}), el("strong", {text: money(part.amount)}),
          el("span", {class: "name", text: `${part.label} · ${percent(part.amount, cost)}`}))),
        el("div", {class: "row"}, el("span", {class: "swatch"}), el("strong", {text: money(session.cost)}),
           el("span", {class: "name", text: "total"})),
        el("div", {class: "name", text: `${whole(session.turns)} turns · context avg ${compact(session.context_avg)}, peak ${compact(session.context_peak)}`}));
      placeTooltip(tooltip, container, event, row, row.offsetTop + row.offsetHeight + 4);
    };
    row.addEventListener("pointermove", show);
    row.addEventListener("focus", show);
    row.addEventListener("pointerleave", () => { tooltip.hidden = true; });
    row.addEventListener("blur", () => { tooltip.hidden = true; });
    return row;
  });
  container.replaceChildren(el("div", {class: "bars"}, ...rows), tooltip);
}

function renderCostlyTable(sessions) {
  const head = el("tr", {}, el("th", {text: "Session"}), el("th", {class: "num", text: "Turns"}),
                  el("th", {class: "num", text: "Avg context"}), el("th", {class: "num", text: "Peak context"}),
                  ...COSTLY_PARTS.map(part => el("th", {class: "num", text: part.label})),
                  el("th", {class: "num", text: "Cost"}));
  const rows = sessions.map(session => el("tr", {},
    el("td", {}, sessionLink(session), el("span", {class: "sub", text: session.project})),
    el("td", {class: "num", text: whole(session.turns)}), el("td", {class: "num", text: compact(session.context_avg)}),
    el("td", {class: "num", text: compact(session.context_peak)}),
    ...COSTLY_PARTS.map(part => el("td", {class: "num", text: money(part.value(session))})),
    el("td", {class: "num", text: money(session.cost)})));
  document.getElementById("costly-table").replaceChildren(el("table", {}, el("thead", {}, head),
                                                             el("tbody", {}, ...rows)));
}
