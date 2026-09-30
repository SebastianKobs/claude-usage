// What every chart is built from: the SVG root, axes and gridlines, x labels, tooltips, the one
// focusable cursor layer, and the table view's shell.
"use strict";

const RIGHT_PAD = 64;                                     // room for a line's end label
const X_LABELS = 8;                                       // at most about this many labels under the x axis

function chartWidth(container) { return Math.max(320, container.clientWidth); }

function chartRoot(width, height, label) {
  return svg("svg", {viewBox: `0 0 ${width} ${height}`, height, role: "img", "aria-label": label});
}

// niceMax, ticks, columnPath, nearestIndex and bandIndex come from the bundle (web/src/lib/charts.ts)

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

// a point on a line, ringed in the surface color; a hidden one is a marker the cursor moves
function pointDot(color, x = 0, y = 0, hidden = false) {
  return svg("circle", {cx: x, cy: y, r: 4, fill: color, stroke: "var(--surface)", "stroke-width": 2,
                        visibility: hidden ? "hidden" : "visible"});
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
