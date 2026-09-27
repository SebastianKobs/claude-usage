// The usage tables and the sessions list.
"use strict";

// --- tables --------------------------------------------------------------------------------------------------

function byCost(left, right) { return (right.cost ?? -1) - (left.cost ?? -1) || right.turns - left.turns; }

function usageHead(nameHeader) {
  return el("tr", {}, el("th", {text: nameHeader}), el("th", {class: "num", text: "Turns"}),
            el("th", {class: "num", text: "Input"}), el("th", {class: "num", text: "Cache read %"}),
            el("th", {class: "num", text: "Output"}), el("th", {class: "num", text: "Cost"}));
}

function usageRow(row, name, className) {
  return el("tr", {class: className}, el("td", {}, name),
    el("td", {class: "num", text: whole(row.turns)}), el("td", {class: "num", text: compact(inputTotal(row))}),
    el("td", {class: "num", text: percent(row.cache_read, inputTotal(row))}),
    el("td", {class: "num", text: compact(row.output)}), el("td", {class: "num", text: money(row.cost)}));
}

function usageTable(rows, nameHeader, nameCell, emptyText = "No usage in this range.") {
  if (!rows.length) return el("div", {class: "empty", text: emptyText});
  const body = rows.slice().sort(byCost).map(row => usageRow(row, nameCell(row)));
  return el("table", {}, el("thead", {}, usageHead(nameHeader)), el("tbody", {}, ...body));
}

// Each model's totals, then its usage per effort level as indented rows; background calls have no effort level
// and show no row of their own
function modelEffortTable(models, modelEfforts, nameCell) {
  if (!models.length) return el("div", {class: "empty", text: "No usage in this range."});
  const body = [];
  for (const model of models.slice().sort(byCost)) {
    body.push(usageRow(model, nameCell(model), "group-row"));
    const efforts = modelEfforts.filter(row => row.model === model.model && row.effort !== null)
      .sort((left, right) => effortRank(left.effort) - effortRank(right.effort) ||
                             left.effort.localeCompare(right.effort));
    for (const row of efforts) {
      body.push(usageRow(row, el("span", {class: "effort", text: `effort ${row.effort}`}), "sub-row"));
    }
  }
  return el("table", {}, el("thead", {}, usageHead("Model")), el("tbody", {}, ...body));
}

function renderTables(summary) {
  const slots = modelSlots([...new Set(summary.day_model.map(row => row.model))]);
  document.getElementById("by-agent").replaceChildren(usageTable(summary.agent_type, "Agent type",
    row => row.agent_type));
  document.getElementById("by-model").replaceChildren(modelEffortTable(summary.model, summary.model_effort, row =>
    el("span", {}, el("span", {class: "swatch", style: `background:${slotColor(slots.has(row.model) ? slots.get(row.model) : null)}`}), row.model)));
  document.getElementById("by-project").replaceChildren(usageTable(summary.project, "Project",
    row => row.project));
  document.getElementById("by-skill").replaceChildren(usageTable(summary.skill, "Skill", row => row.skill,
    "No turns attributed to a skill in this range."));
  document.getElementById("by-mcp-server").replaceChildren(usageTable(summary.mcp_server, "MCP server",
    row => row.mcp_server, "No turns attributed to an MCP server in this range."));
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
