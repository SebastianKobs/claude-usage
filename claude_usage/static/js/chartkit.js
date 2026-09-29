// What every chart is built from: the SVG root, axes and gridlines, x labels, the area line, tooltips, the one
// focusable cursor layer, and the table view's shell.
"use strict";

const RIGHT_PAD = 64;                                     // room for a line's end label
const X_LABELS = 8;                                       // at most about this many labels under the x axis

function chartWidth(container) { return Math.max(320, container.clientWidth); }

function chartRoot(width, height, label) {
  return svg("svg", {viewBox: `0 0 ${width} ${height}`, height, role: "img", "aria-label": label});
}

function niceMax(value) {
  if (value <= 0) return 1;
  const power = Math.pow(10, Math.floor(Math.log10(value)));
  for (const step of [1, 2, 2.5, 5, 10]) {
    if (value <= step * power) return step * power;
  }
  return 10 * power;
}

// 0, max / steps, ..., max: the values the gridlines sit at
function ticks(max, steps) {
  return Array.from({length: steps + 1}, (_, index) => max * index / steps);
}

// a gridline at each value, the first one (0) in the axis color, each labelled left of the plot
function drawYAxis(root, left, right, values, yOf, format) {
  values.forEach((value, index) => {
    const y = Math.round(yOf(value)) + 0.5;
    root.append(svg("line", {x1: left, x2: right, y1: y, y2: y, "stroke-width": 1,
                             stroke: index === 0 ? "var(--axis)" : "var(--grid)"}));
    const label = svg("text", {x: left - 8, y: y + 4, "text-anchor": "end", class: "axis-text"});
    label.textContent = format(value);
    root.append(label);
  });
}

// labels under the x axis, evenly spaced, at most about `most` of them; text(index) is each one's text
function drawXLabels(root, count, xOf, y, text, most = X_LABELS) {
  const every = Math.max(1, Math.ceil(count / most));
  for (let index = 0; index < count; index += every) {
    const label = svg("text", {x: xOf(index), y, "text-anchor": "middle", class: "axis-text"});
    label.textContent = text(index);
    root.append(label);
  }
}

// a line over the values with a faint area below it down to bottom
function drawAreaLine(root, values, xOf, yOf, bottom, color) {
  const last = values.length - 1;
  const points = values.map((value, index) => `${xOf(index).toFixed(1)},${yOf(value).toFixed(1)}`);
  root.append(svg("path", {d: `M${xOf(0)},${bottom}L${points.join("L")}L${xOf(last)},${bottom}Z`,
                           fill: color, "fill-opacity": 0.1}));
  root.append(svg("path", {d: `M${points.join("L")}`, fill: "none", stroke: color, "stroke-width": 2,
                           "stroke-linejoin": "round", "stroke-linecap": "round"}));
}

// a point on a line, ringed in the surface color; a hidden one is a marker the cursor moves
function pointDot(color, x = 0, y = 0, hidden = false) {
  return svg("circle", {cx: x, cy: y, r: 4, fill: color, stroke: "var(--surface)", "stroke-width": 2,
                        visibility: hidden ? "hidden" : "visible"});
}

function columnPath(x, y, width, height, rounded) {
  const radius = rounded ? Math.min(CORNER, width / 2, height) : 0;
  return `M${x},${y + height}V${y + radius}` +
    (radius ? `Q${x},${y} ${x + radius},${y}H${x + width - radius}Q${x + width},${y} ${x + width},${y + radius}`
            : `H${x + width}`) +
    `V${y + height}Z`;
}

// a vertical line (the crosshair) or a band (a column's highlight) that the cursor moves and shows
function moveMark(mark, attributes) {
  for (const [name, value] of Object.entries(attributes)) mark.setAttribute(name, value);
  mark.setAttribute("visibility", "visible");
}
function hideMarks(...marks) {
  for (const mark of marks) mark.setAttribute("visibility", "hidden");
}

// --- tooltips ------------------------------------------------------------------------------------------------

function tooltipBox() { return el("div", {class: "tooltip", hidden: true}); }

// beside a point x of the chart's own coordinates (the SVG is scaled to the container's width)
function placeTooltipAt(tooltip, container, root, width, x, top = 8) {
  tooltip.hidden = false;
  const scale = root.getBoundingClientRect().width / width || 1;
  tooltip.style.left = `${Math.min(Math.max(0, x * scale + 12), container.clientWidth - tooltip.offsetWidth)}px`;
  tooltip.style.top = `${top}px`;
}

// beside the pointer, or for keyboard focus beside the target's middle
function placeTooltip(tooltip, container, event, target, top = 8) {
  tooltip.hidden = false;
  const bounds = container.getBoundingClientRect();
  const box = target.getBoundingClientRect();
  const anchor = event.clientX ? event.clientX - bounds.left : box.left - bounds.left + box.width / 2;
  const left = Math.min(Math.max(0, anchor + 12), bounds.width - tooltip.offsetWidth);
  tooltip.style.left = `${left}px`;
  tooltip.style.top = `${top}px`;
}

// a tooltip line: a color key (a short line, or a swatch), the value and its name
function tooltipRow(color, value, name, swatch = false) {
  const key = el("span", {class: swatch ? "swatch" : "key", style: color ? `background:${color}` : null});
  return el("div", {class: "row"}, key, el("strong", {text: value}), el("span", {class: "name", text: name}));
}

// show on hover and focus, hide on leaving and blur
function onHover(target, show, hide) {
  target.addEventListener("pointermove", show);
  target.addEventListener("focus", show);
  target.addEventListener("pointerleave", hide);
  target.addEventListener("blur", hide);
}

// --- the cursor: one focusable layer per chart ---------------------------------------------------------------
// One tab stop per chart rather than one per day (a year would be 365). The pointer picks the bucket under it; as
// a slider, arrow keys step, Page Up/Down jump a tenth, Home and End go to the ends, and a screen reader reads
// valueText(index) at each step. show(index) draws the crosshair or highlight and the tooltip.

function chartCursor(root, width, area, options) {
  const {count, indexAt, show, hide, label, valueText} = options;
  const last = count - 1;
  const layer = svg("rect", {x: area.x, y: area.y, width: Math.max(1, area.width), height: area.height,
                             class: "hit", tabindex: 0, role: "slider", "aria-label": label,
                             "aria-valuemin": 1, "aria-valuemax": count});
  let current = last;
  const move = index => {
    current = Math.min(Math.max(0, index), last);
    layer.setAttribute("aria-valuenow", current + 1);
    layer.setAttribute("aria-valuetext", valueText(current));
    show(current);
  };
  layer.addEventListener("pointermove", event => {
    const bounds = root.getBoundingClientRect();
    move(indexAt((event.clientX - bounds.left) * width / (bounds.width || width)));
  });
  layer.addEventListener("focus", () => move(current));
  layer.addEventListener("keydown", event => {
    const page = Math.max(1, Math.round(count / 10));
    const steps = {ArrowLeft: -1, ArrowDown: -1, ArrowRight: 1, ArrowUp: 1, PageUp: -page, PageDown: page};
    if (event.key in steps) move(current + steps[event.key]);
    else if (event.key === "Home") move(0);
    else if (event.key === "End") move(last);
    else return;
    event.preventDefault();
  });
  layer.addEventListener("pointerleave", hide);
  layer.addEventListener("blur", hide);
  layer.setAttribute("aria-valuenow", count);
  layer.setAttribute("aria-valuetext", valueText(last));
  return layer;
}

// the bucket a point falls in: evenly spaced points (a line) snap to the nearest, columns own their band
function nearestIndex(left, right, count) {
  return x => (count > 1 ? Math.round((x - left) / (right - left) * (count - 1)) : 0);
}
function bandIndex(left, band) {
  return x => Math.floor((x - left) / band);
}

// --- table views ---------------------------------------------------------------------------------------------

function headCell(text, numeric = false) { return el("th", {class: numeric ? "num" : null, text}); }
function cell(text, numeric = false) { return el("td", {class: numeric ? "num" : null, text}); }

function dataTable(head, rows) {
  return el("table", {}, el("thead", {}, el("tr", {}, ...head)), el("tbody", {}, ...rows));
}

// a chart's table view into its container: newest first, as the tables read best, paged by its id
function fillTableView(id, head, rows) {
  document.getElementById(id).replaceChildren(paged(id, dataTable(head, rows)));
}
