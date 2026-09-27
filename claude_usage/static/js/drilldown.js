// One session's drilldown with its context per turn.
"use strict";

// --- drilldown -----------------------------------------------------------------------------------------------

function renderDrilldown(detail) {
  const panel = document.getElementById("drilldown");
  chatRequest++;                                          // a conversation still loading belongs to the old view
  // an open session is all the page shows: the range's filters, figures, charts and tables come back on close
  for (const id of ["filters", "summary"]) document.getElementById(id).hidden = Boolean(detail);
  if (!detail) {
    panel.hidden = true;
    panel.replaceChildren();
    return;
  }
  const searches = detail.agents.some(agent => agent.web_searches);
  const head = el("tr", {}, el("th", {text: "Agent"}), el("th", {text: "Model"}),
                  el("th", {class: "num", text: "Turns"}), el("th", {class: "num", text: "Context first → last"}),
                  el("th", {class: "num", text: "Input total"}), el("th", {class: "num", text: "Cache read %"}),
                  el("th", {class: "num", text: "Output"}),
                  searches ? el("th", {class: "num", text: "Web searches"}) : null,
                  el("th", {class: "num", text: "Cost"}));
  const agents = detail.agents.map(agent => el("tr", {},
    el("td", {}, el("strong", {text: agent.agent_type}), el("span", {class: "sub", text: agent.description || ""})),
    el("td", {}, ...agentModels(agent)), el("td", {class: "num", text: whole(agent.turns)}),
    el("td", {class: "num", text: `${compact(agent.context_first)} → ${compact(agent.context_last)}`}),
    el("td", {class: "num", text: compact(agent.input_total)}),
    el("td", {class: "num", text: percent(agent.cache_read, agent.input_total)}),
    el("td", {class: "num", text: compact(agent.output)}),
    searches ? el("td", {class: "num", text: whole(agent.web_searches)}) : null,
    el("td", {class: "num", text: money(agent.cost)})));
  const toolRows = detail.agents.flatMap(agent => agent.tools.map(tool => el("tr", {},
    el("td", {text: agent.agent_type}), el("td", {text: tool.tool}), el("td", {class: "num", text: whole(tool.calls)}),
    el("td", {class: "num", text: compact(tool.result_chars)}))));
  const tools = toolRows.length
    ? el("table", {}, el("thead", {}, el("tr", {}, el("th", {text: "Agent"}), el("th", {text: "Tool"}),
                                          el("th", {class: "num", text: "Calls"}),
                                          el("th", {class: "num", text: "Result characters"}))),
         el("tbody", {}, ...toolRows))
    : el("div", {class: "empty", text: "No tool calls."});
  fill(panel,
    el("div", {class: "chart-head"},
       el("h2", {id: "drilldown-title", tabindex: -1, text: detail.title || "Untitled session"}),
       el("span", {class: "spacer"}),
       el("a", {href: "#", text: "Close", "aria-keyshortcuts": "Escape"})),
    detail.prompt ? el("div", {class: "prompt", text: detail.prompt}) : null,
    el("div", {class: "muted", text: `${detail.project}${detail.git_branch ? " · " + detail.git_branch : ""} · ${when(detail.first_ts)} – ${when(detail.last_ts)} · ${detail.session_id}`}),
    // the page's tile rows with this session's numbers: its whole usage, main thread, subagents and background
    el("div", {class: "kpis session-kpis"},
       ...kpiTiles(detail, "this session", detail.context, detail.compact_hint_tokens)),
    // from the cost record Claude Code writes when its process exits, until then estimated from the transcripts
    detail.runtime ? el("div", {class: "kpis session-kpis"},
                        ...runtimeTiles(detail.runtime, detail.runtime.source === "cost_record"
                                          ? "from its cost record" : "estimated from the transcripts",
                                        sessionCostPer100Lines(detail)))
                   : null,
    el("div", {class: "chart-head"}, el("h3", {text: "Context per turn, main thread"}),
       el("span", {class: "muted", text: "every turn reads its whole context again; drops are compactions"}),
       el("span", {class: "spacer"}),
       el("button", {type: "button", id: "context-table-toggle", "aria-pressed": "false", text: "Table view"})),
    el("div", {id: "context-chart", class: "chart"}),
    el("div", {id: "context-table", class: "table-wrap", hidden: true}),
    themed("h3", "By model"), el("div", {class: "table-wrap"}, sessionModelTable(detail)),
    el("h3", {text: "Main thread and subagents"}), el("div", {class: "table-wrap"}, el("table", {},
       el("thead", {}, head), el("tbody", {}, ...agents))),
    el("h3", {text: "Tools"}), el("div", {class: "table-wrap"}, tools),
    el("div", {class: "grid-2"},
       el("div", {}, themed("h3", "By skill"), el("div", {class: "table-wrap"},
          usageTable(detail.skills, "Skill", row => row.skill, "No turns attributed to a skill."))),
       el("div", {}, themed("h3", "By MCP server"), el("div", {class: "table-wrap"},
          usageTable(detail.mcp_servers, "MCP server", row => row.mcp_server,
                     "No turns attributed to an MCP server.")))),
    themed("h3", "Rate limits and API errors"),
    el("div", {class: "table-wrap"}, limitEventsTable(detail.api_errors, "No API errors in this session.", false)),
    chatControls(detail), el("div", {id: "chat"}));
  document.getElementById("context-table-toggle").addEventListener("click", event => {
    const table = document.getElementById("context-table");
    table.hidden = !table.hidden;
    event.currentTarget.setAttribute("aria-pressed", String(!table.hidden));
  });
  panel.hidden = false;
  renderContext(detail);                                  // after unhiding, so the chart can measure its width
}

// an agent's models, one line each with its effort levels ("claude-opus-5-5 · high, max"); background calls
// have none
function agentModels(agent) {
  if (!agent.models.length) return ["–"];
  return agent.models.map(model => {
    const efforts = agent.model_efforts.filter(entry => entry.model === model).map(entry => entry.effort);
    return el("div", {text: efforts.length ? `${model} · ${efforts.join(", ")}` : model});
  });
}

// the session's usage per model with its effort levels below, as the page's By model table
function sessionModelTable(detail) {
  const slots = modelSlots(detail.models.map(row => row.model));
  return modelEffortTable(detail.models, detail.model_effort, row =>
    el("span", {}, el("span", {class: "swatch", style: `background:${slotColor(slots.get(row.model) ?? null)}`}),
       row.model));
}

// the session's whole cost per 100 lines changed, as the summary computes it for a range
function sessionCostPer100Lines(detail) {
  const lines = detail.runtime.lines_added + detail.runtime.lines_removed;
  return detail.cost === null || lines === 0 ? null : detail.cost / lines * 100;
}

// --- context per turn: one line over the main thread's turns --------------------------------------------------

const CONTEXT_PLOT = 140;
const CONTEXT_TOP = 16;                                   // room for the peak label above the line

function mainTurns(detail) {
  const main = detail.agents.find(agent => agent.agent_type === "main" && agent.agent_id === null);
  return main ? main.context_per_turn : [];
}

function renderContext(detail) {
  const container = document.getElementById("context-chart");
  if (!container) return;
  const turns = mainTurns(detail);
  renderContextTable(turns);
  if (!turns.length) {
    container.replaceChildren(el("div", {class: "empty", text: "No turns in the main thread."}));
    return;
  }
  const width = chartWidth(container);
  const left = LEFT_AXIS;
  const right = width - RIGHT_PAD;
  const bottom = CONTEXT_TOP + CONTEXT_PLOT;
  const last = turns.length - 1;
  const xOf = index => (last > 0 ? left + (right - left) * index / last : (left + right) / 2);
  const values = turns.map(turn => turn.context);
  const peak = values.indexOf(Math.max(...values));
  const max = niceMax(values[peak]);
  const yOf = value => bottom - CONTEXT_PLOT * value / max;
  const color = slotColor(0);
  const root = chartRoot(width, bottom + AXIS_BAND,
                         `Context per turn of the main thread: ${turns.length} turns, peak ${compact(values[peak])}, ` +
                         `last ${compact(values[last])}; table view available`);
  drawYAxis(root, left, right, ticks(max, 4), yOf, compact);
  drawAreaLine(root, values, xOf, yOf, bottom, color);
  // direct labels on the two values that matter: the peak and the latest turn
  for (const index of peak === last ? [last] : [peak, last]) {
    root.append(pointDot(color, xOf(index), yOf(values[index])));
    const atEnd = index === last;
    const label = svg("text", {x: atEnd ? xOf(index) + 9 : xOf(index),
                               y: atEnd ? yOf(values[index]) + 4 : yOf(values[index]) - 8,
                               "text-anchor": atEnd ? "start" : "middle", class: "value-text"});
    label.textContent = atEnd ? compact(values[index]) : `peak ${compact(values[index])}`;
    root.append(label);
  }
  // x axis: turn numbers, about six of them
  drawXLabels(root, turns.length, xOf, bottom + 18, index => (index === 0 ? "turn 1" : String(index + 1)), 6);
  const crosshair = svg("line", {y1: CONTEXT_TOP, y2: bottom, class: "crosshair", visibility: "hidden"});
  const marker = pointDot(color, 0, 0, true);
  const tooltip = tooltipBox();
  const turnText = index => {
    const effort = turns[index].effort ? ` · effort ${turns[index].effort}` : "";
    return `Turn ${whole(index + 1)} of ${whole(turns.length)} · ${when(turns[index].ts)}${effort}`;
  };
  const cursor = chartCursor(root, width, {x: left, y: 0, width: right - left, height: bottom}, {
    count: turns.length,
    indexAt: nearestIndex(left, right, turns.length),
    label: "Context per turn; arrow keys step through the turns",
    valueText: index => `${turnText(index)}: context ${compact(values[index])}`,
    show: index => {
      moveMark(crosshair, {x1: xOf(index), x2: xOf(index)});
      moveMark(marker, {cx: xOf(index), cy: yOf(values[index])});
      tooltip.replaceChildren(el("div", {class: "when", text: turnText(index)}),
                              tooltipRow(color, compact(values[index]), "context"));
      placeTooltipAt(tooltip, container, root, width, xOf(index));
    },
    hide: () => {
      hideMarks(crosshair, marker);
      tooltip.hidden = true;
    },
  });
  root.append(crosshair, marker, cursor);
  container.replaceChildren(root, tooltip);
}

function renderContextTable(turns) {
  const table = dataTable([headCell("Turn", true), headCell("Time"), headCell("Effort"), headCell("Context", true)],
    turns.map((turn, index) => el("tr", {}, cell(whole(index + 1), true), cell(when(turn.ts)),
                                  cell(turn.effort || "–"), cell(whole(turn.context), true))));
  document.getElementById("context-table").replaceChildren(
    turns.length ? table : el("div", {class: "empty", text: "No turns in the main thread."}));
}
