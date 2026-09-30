// Cost per session.
"use strict";

// The over-time and by-model sections are components (web/src/components/OverTime.svelte, ByModel.svelte).

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
