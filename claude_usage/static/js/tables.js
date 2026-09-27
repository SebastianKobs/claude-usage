// The usage tables and the sessions list.
"use strict";

// --- tables --------------------------------------------------------------------------------------------------

function usageTable(rows, nameHeader, nameCell) {
  if (!rows.length) return el("div", {class: "empty", text: "No usage in this range."});
  const sorted = rows.slice().sort((left, right) => (right.cost ?? -1) - (left.cost ?? -1) || right.turns - left.turns);
  const head = el("tr", {}, el("th", {text: nameHeader}), el("th", {class: "num", text: "Turns"}),
                  el("th", {class: "num", text: "Input"}), el("th", {class: "num", text: "Cache read %"}),
                  el("th", {class: "num", text: "Output"}), el("th", {class: "num", text: "Cost"}));
  const body = sorted.map(row => el("tr", {}, el("td", {}, nameCell(row)),
    el("td", {class: "num", text: whole(row.turns)}), el("td", {class: "num", text: compact(inputTotal(row))}),
    el("td", {class: "num", text: percent(row.cache_read, inputTotal(row))}),
    el("td", {class: "num", text: compact(row.output)}), el("td", {class: "num", text: money(row.cost)})));
  return el("table", {}, el("thead", {}, head), el("tbody", {}, ...body));
}

function renderTables(summary) {
  const slots = modelSlots([...new Set(summary.day_model.map(row => row.model))]);
  document.getElementById("by-agent").replaceChildren(usageTable(summary.agent_type, "Agent type",
    row => row.agent_type));
  document.getElementById("by-model").replaceChildren(usageTable(summary.model, "Model", row =>
    el("span", {}, el("span", {class: "swatch", style: `background:${slotColor(slots.has(row.model) ? slots.get(row.model) : null)}`}), row.model)));
  document.getElementById("by-project").replaceChildren(usageTable(summary.project, "Project",
    row => row.project));
  renderSessions(summary.sessions);
  renderCostly(summary.costly_sessions);
}

function renderSessions(sessions) {
  const container = document.getElementById("sessions");
  if (!sessions.length) {
    container.replaceChildren(el("div", {class: "empty", text: "No sessions in this range."}));
    return;
  }
  const head = el("tr", {}, el("th", {text: "Last activity"}), el("th", {text: "Session"}),
                  el("th", {class: "num", text: "Subagents"}), el("th", {class: "num", text: "Turns"}),
                  el("th", {class: "num", text: "Avg context"}), el("th", {class: "num", text: "Peak context"}),
                  el("th", {class: "num", text: "Output"}), el("th", {class: "num", text: "Cost"}));
  const rows = sessions.map(session => el("tr", {},
    el("td", {class: "num", text: when(session.last_ts)}),
    el("td", {}, sessionLink(session), el("span", {class: "sub", text: session.project})),
    el("td", {class: "num", text: whole(session.subagents)}), el("td", {class: "num", text: whole(session.turns)}),
    el("td", {class: "num", text: compact(session.context_avg)}),
    el("td", {class: "num", text: compact(session.context_peak)}),
    el("td", {class: "num", text: compact(session.output)}), el("td", {class: "num", text: money(session.cost)})));
  container.replaceChildren(el("table", {}, el("thead", {}, head), el("tbody", {}, ...rows)));
}
