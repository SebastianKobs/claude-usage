// The by-model chart, and cost per session.
"use strict";

// The over-time section is a component (web/src/components/OverTime.svelte).

// --- daily chart ---------------------------------------------------------------------------------------------

function chartData(summary) {
  const metric = METRICS[state.metric];
  const buckets = timeBuckets(summary);
  const rows = buckets.unit === "hour" ? summary.hour_model_effort : summary.day_model_effort;
  return {buckets, days: buckets.keys, series: chartSeries(rows, buckets.keyOf, metric.value), metric};
}

// per model its name, then a swatch for each of its effort levels in the range
function renderLegend(series) {
  document.getElementById("legend").replaceChildren(...modelGroups(series).map(group =>
    el("span", {class: "legend-group"}, el("strong", {text: group.model}),
       ...group.entries.map(entry => el("span", {}, seriesSwatch(entry), effortLabel(entry.effort))))));
}

// a series' key in the legend and the tooltip
function seriesSwatch(entry) {
  return el("span", {class: "swatch", style: `background:${swatchFill(entry.color, entry.hatch, entry.turn)}`});
}

// A hatched series' fill: its color with lines of its hatch at its angle, 2px on a 6px period
function hatchPattern(id, entry) {
  const pattern = svg("pattern", {id, width: 6, height: 6, patternUnits: "userSpaceOnUse",
                                  patternTransform: `rotate(${entry.turn})`});
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
  const totals = columnTotals(series, days);
  const top = niceMax(Math.max(...totals, 0));
  const scale = value => PLOT_HEIGHT * value / top;
  const band = (right - LEFT_AXIS) / days.length;
  const barWidth = columnWidth(band, BAR_MAX);
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
  const peak = peakIndex(totals);
  days.forEach((day, index) => {
    const x = LEFT_AXIS + band * index + (band - barWidth) / 2;
    const present = series.filter(entry => (entry.values.get(day) || 0) > 0);
    const heights = present.map(entry => scale(entry.values.get(day)));
    for (const segment of stackSegments(present.map(entry => entry.model), heights, PLOT_HEIGHT, GAP, MODEL_GAP)) {
      root.append(svg("path", {d: columnPath(x, segment.y, barWidth, segment.height, segment.top),
                               fill: fills.get(present[segment.position])}));
    }
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
      el("span", {}, seriesSwatch(entry), effortLabel(entry.effort)), entry.values.get(day)))]);
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
  {label: "Cache reads", color: "var(--split-soft)", value: session => costSplit(session).cacheRead},
  {label: "Everything else", color: "var(--split-strong)",
   value: session => costSplit(session).rest,
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
  const top = costTop(sessions);
  const tooltip = tooltipBox();
  const rows = sessions.map(session => {
    const cost = session.cost || 0;
    const parts = COSTLY_PARTS.map(part => ({...part, amount: part.value(session)}));
    const bar = el("div", {class: "bar", style: `width:${barShare(cost, top).toFixed(2)}%`},
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
