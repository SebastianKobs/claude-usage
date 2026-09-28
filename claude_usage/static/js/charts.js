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
  const width = chartWidth(container);
  const left = LEFT_AXIS;
  const right = width - RIGHT_PAD;
  const last = days.length - 1;
  const xOf = index => (last > 0 ? left + (right - left) * index / last : (left + right) / 2);
  const panelHeight = PANEL_TITLE + PANEL_PLOT + PANEL_GAP;
  const plotsBottom = panelHeight * TREND_PANELS.length - PANEL_GAP;
  const root = chartRoot(width, plotsBottom + AXIS_BAND,
                         `Estimated cost, input tokens and output tokens per ${buckets.unit}; table view available`);
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
    drawYAxis(root, left, right, ticks(max, 2), yOf, panel.format);
    drawAreaLine(root, values, xOf, yOf, bottom, color);
    // end dot and the one direct label: the latest value
    root.append(pointDot(color, xOf(last), yOf(values[last])));
    const end = svg("text", {x: xOf(last) + 9, y: yOf(values[last]) + 4, class: "value-text"});
    end.textContent = panel.format(values[last]);
    root.append(end);
    const marker = pointDot(color, 0, 0, true);
    markers.push({marker, yOf, values});
    root.append(marker);
  });
  drawXLabels(root, days.length, xOf, plotsBottom + 18, index => buckets.short(days[index]));
  const crosshair = svg("line", {y1: PANEL_TITLE - 4, y2: plotsBottom, class: "crosshair", visibility: "hidden"});
  const tooltip = tooltipBox();
  const values = day => TREND_PANELS.map(panel => `${panel.label} ${panel.format(panel.value(at(day)))}`).join(", ");
  const cursor = chartCursor(root, width, {x: left, y: 0, width: right - left, height: plotsBottom}, {
    count: days.length,
    indexAt: nearestIndex(left, right, days.length),
    label: `Estimated cost, input and output tokens per ${buckets.unit}; arrow keys step through them`,
    valueText: index => `${buckets.long(days[index])}: ${values(days[index])}`,
    show: index => {
      const day = days[index];
      moveMark(crosshair, {x1: xOf(index), x2: xOf(index)});
      for (const {marker, yOf, values: series} of markers) moveMark(marker, {cx: xOf(index), cy: yOf(series[index])});
      tooltip.replaceChildren(el("div", {class: "when", text: buckets.long(day)}),
        ...TREND_PANELS.map(panel => tooltipRow(slotColor(panel.slot), panel.format(panel.value(at(day))),
                                                panel.label)));
      placeTooltipAt(tooltip, container, root, width, xOf(index));
    },
    hide: () => {
      hideMarks(crosshair, ...markers.map(({marker}) => marker));
      tooltip.hidden = true;
    },
  });
  root.append(crosshair, cursor);
  container.replaceChildren(root, tooltip);
}

function renderTrendTable(buckets, at) {
  fillTableView("trend-table", [headCell(buckets.heading), ...TREND_PANELS.map(panel => headCell(panel.label, true))],
    buckets.keys.slice().reverse().map(day => el("tr", {}, cell(buckets.short(day)),
      ...TREND_PANELS.map(panel => cell(panel.format(panel.value(at(day))), true)))));
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

// The columns' series: one per model and effort level. A model keeps its color slot ("Other" past the eighth) and
// its effort levels are shades of that color, in stack order low to max within the model.
function chartData(summary) {
  const metric = METRICS[state.metric];
  const buckets = timeBuckets(summary);
  const rows = buckets.unit === "hour" ? summary.hour_model_effort : summary.day_model_effort;
  const slots = modelSlots([...new Set(rows.map(row => row.model))]);
  const bySeries = new Map();
  for (const row of rows) {
    const slot = slots.get(row.model);
    const model = slot === null ? "Other" : row.model;
    const key = `${model} · ${effortName(row.effort)}`;
    if (!bySeries.has(key)) {
      bySeries.set(key, {key, model, effort: row.effort, slot, color: effortShade(slot, row.effort),
                         hatch: effortHatch(slot, row.effort), values: new Map()});
    }
    const entry = bySeries.get(key);
    const bucket = buckets.keyOf(row);
    entry.values.set(bucket, (entry.values.get(bucket) || 0) + metric.value(row));
  }
  // an unknown effort (background calls) first, as it wears the model's own color
  const effortOrder = effort => (effort === null ? -1 : effortRank(effort));
  const series = [...bySeries.values()].sort((left, right) =>
    (left.slot ?? SLOT_COUNT) - (right.slot ?? SLOT_COUNT) || left.model.localeCompare(right.model) ||
    effortOrder(left.effort) - effortOrder(right.effort) || String(left.effort).localeCompare(String(right.effort)));
  return {buckets, days: buckets.keys, series, metric};
}

// The series grouped by model, in stack order
function modelGroups(series) {
  const groups = [];
  for (const entry of series) {
    if (!groups.length || groups[groups.length - 1].model !== entry.model) {
      groups.push({model: entry.model, entries: []});
    }
    groups[groups.length - 1].entries.push(entry);
  }
  return groups;
}

// per model its name, then a swatch for each of its effort levels in the range
function renderLegend(series) {
  document.getElementById("legend").replaceChildren(...modelGroups(series).map(group =>
    el("span", {class: "legend-group"}, el("strong", {text: group.model}),
       ...group.entries.map(entry => el("span", {}, seriesSwatch(entry), entry.effort ?? "no effort level")))));
}

// a series' key in the legend and the tooltip
function seriesSwatch(entry) {
  return el("span", {class: "swatch", style: `background:${swatchFill(entry.color, entry.hatch)}`});
}

// A hatched series' fill: its color with lines of its hatch at 45°, 2px on a 6px period
function hatchPattern(id, entry) {
  const pattern = svg("pattern", {id, width: 6, height: 6, patternUnits: "userSpaceOnUse",
                                  patternTransform: "rotate(45)"});
  pattern.append(svg("rect", {width: 6, height: 6, fill: entry.color}),
                 svg("rect", {width: 2, height: 6, fill: entry.hatch}));
  return pattern;
}

function renderChart(summary) {
  const container = document.getElementById("chart");
  const {buckets, days, series, metric} = chartData(summary);
  const title = document.getElementById("chart-title");
  title.dataset.label = `Per ${buckets.unit}, by model and effort`;
  title.textContent = hype(title.dataset.label);
  renderLegend(series);
  renderModelTable(buckets, series, metric);
  const width = chartWidth(container);
  const right = width - 8;
  const totals = days.map(day => series.reduce((sum, entry) => sum + (entry.values.get(day) || 0), 0));
  const top = niceMax(Math.max(...totals, 0));
  const scale = value => PLOT_HEIGHT * value / top;
  const band = (right - LEFT_AXIS) / days.length;
  const barWidth = Math.max(2, Math.min(BAR_MAX, band * 0.6));
  const root = chartRoot(width, PLOT_HEIGHT + AXIS_BAND,
                         `${metric.label} per ${buckets.unit} by model and effort level; table view available`);
  drawYAxis(root, LEFT_AXIS, right, ticks(top, 4), value => PLOT_HEIGHT - scale(value), metric.format);
  drawXLabels(root, days.length, index => LEFT_AXIS + band * (index + 0.5), PLOT_HEIGHT + 18,
              index => buckets.short(days[index]));
  const hatched = series.filter(entry => entry.hatch);
  const fills = new Map(series.map(entry => [entry, entry.color]));
  if (hatched.length) {
    const defs = svg("defs", {});
    hatched.forEach((entry, index) => {
      defs.append(hatchPattern(`model-hatch-${index}`, entry));
      fills.set(entry, `url(#model-hatch-${index})`);
    });
    root.append(defs);
  }
  // stacked columns, a 2px surface gap between a model's shades and a wider one between models (the shades of two
  // models can come close), rounded data end on the top segment only
  const peak = totals.indexOf(Math.max(...totals));
  days.forEach((day, index) => {
    const x = LEFT_AXIS + band * index + (band - barWidth) / 2;
    const present = series.filter(entry => (entry.values.get(day) || 0) > 0);
    let base = PLOT_HEIGHT;
    present.forEach((entry, position) => {
      const height = scale(entry.values.get(day));
      const wanted = position === 0 ? 0 : present[position - 1].model === entry.model ? GAP : MODEL_GAP;
      const gap = height > wanted ? wanted : 0;
      const drawn = height - gap;
      if (drawn > 0) {
        root.append(svg("path", {d: columnPath(x, base - height, barWidth, drawn, position === present.length - 1),
                                 fill: fills.get(entry)}));
      }
      base -= height;
    });
    if (index === peak && totals[index] > 0) {
      const label = svg("text", {x: x + barWidth / 2, y: PLOT_HEIGHT - scale(totals[index]) - 6,
                                 "text-anchor": "middle", class: "value-text"});
      label.textContent = metric.format(totals[index]);
      root.append(label);
    }
  });
  // the whole band is highlighted, wider than the column
  const highlight = svg("rect", {y: 0, width: band, height: PLOT_HEIGHT, class: "column-mark", visibility: "hidden"});
  const tooltip = tooltipBox();
  const cursor = chartCursor(root, width, {x: LEFT_AXIS, y: 0, width: right - LEFT_AXIS, height: PLOT_HEIGHT}, {
    count: days.length,
    indexAt: bandIndex(LEFT_AXIS, band),
    label: `${metric.label} per ${buckets.unit}; arrow keys step through them`,
    valueText: index => `${buckets.long(days[index])}: ${metric.format(totals[index])}`,
    show: index => {
      moveMark(highlight, {x: LEFT_AXIS + band * index});
      modelTooltip(tooltip, buckets.long(days[index]), days[index], series, metric, totals[index]);
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

// The column's models in the fixed model order (flagship first), each a line with its total and its effort levels
// indented below (max first), names left and values right-aligned in one column; a total line for several models
function modelTooltip(tooltip, heading, day, series, metric, total) {
  const groups = modelGroups(series.filter(entry => entry.values.get(day)));
  const line = (className, name, value) => el("div", {class: `tip-line ${className}`}, name,
                                              el("span", {class: "tip-value", text: metric.format(value)}));
  const lines = groups.flatMap(group => [
    line("tip-model", el("span", {text: group.model}),
         group.entries.reduce((sum, entry) => sum + entry.values.get(day), 0)),
    ...group.entries.slice().reverse().map(entry => line("tip-effort",
      el("span", {}, seriesSwatch(entry), entry.effort ?? "no effort level"), entry.values.get(day)))]);
  fill(tooltip, el("div", {class: "when", text: heading}),
       ...(lines.length ? lines : [el("div", {class: "name", text: "No usage"})]),
       groups.length > 1 ? line("tip-total", el("span", {text: "Total"}), total) : null);
}

function renderModelTable(buckets, series, metric) {
  fillTableView("chart-table",
    [headCell(buckets.heading), ...series.map(entry => headCell(entry.key, true)), headCell("Total", true)],
    buckets.keys.slice().reverse().map(day => {
      const values = series.map(entry => entry.values.get(day) || 0);
      return el("tr", {}, cell(buckets.short(day)),
                ...values.map(value => cell(value ? metric.format(value) : "–", true)),
                cell(metric.format(values.reduce((sum, value) => sum + value, 0)), true));
    }));
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
  const tooltip = tooltipBox();
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
    onHover(row, show, () => { tooltip.hidden = true; });
    return row;
  });
  container.replaceChildren(el("div", {class: "bars"}, ...rows), tooltip);
}

function renderCostlyTable(sessions) {
  fillTableView("costly-table",
    [headCell("Session"), headCell("Turns", true), headCell("Avg context", true), headCell("Peak context", true),
     ...COSTLY_PARTS.map(part => headCell(part.label, true)), headCell("Cost", true)],
    sessions.map(session => el("tr", {},
      el("td", {}, sessionLink(session), el("span", {class: "sub", text: session.project})),
      cell(whole(session.turns), true), cell(compact(session.context_avg), true),
      cell(compact(session.context_peak), true),
      ...COSTLY_PARTS.map(part => cell(money(part.value(session)), true)), cell(money(session.cost), true))));
}
