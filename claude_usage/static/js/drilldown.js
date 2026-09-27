// One session's drilldown with its context per turn.
"use strict";

// --- drilldown -----------------------------------------------------------------------------------------------

function renderDrilldown(detail) {
  const panel = document.getElementById("drilldown");
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
    el("div", {class: "chart-head"}, el("h2", {text: detail.title || "Untitled session"}), el("span", {class: "spacer"}),
       el("a", {href: "#", text: "Close"})),
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
  const width = Math.max(320, container.clientWidth);
  const left = LEFT_AXIS;
  const right = width - RIGHT_PAD;
  const bottom = CONTEXT_TOP + CONTEXT_PLOT;
  const height = bottom + AXIS_BAND;
  const last = turns.length - 1;
  const xOf = index => (last > 0 ? left + (right - left) * index / last : (left + right) / 2);
  const values = turns.map(turn => turn.context);
  const peak = values.indexOf(Math.max(...values));
  const max = niceMax(values[peak]);
  const yOf = value => bottom - CONTEXT_PLOT * value / max;
  const color = slotColor(0);
  const root = svg("svg", {viewBox: `0 0 ${width} ${height}`, height, role: "img",
                          "aria-label": `Context per turn of the main thread: ${turns.length} turns, peak ${compact(values[peak])}, last ${compact(values[last])}; table view available`});
  for (const fraction of [0, 0.25, 0.5, 0.75, 1]) {
    const y = Math.round(yOf(max * fraction)) + 0.5;
    root.append(svg("line", {x1: left, x2: right, y1: y, y2: y, "stroke-width": 1,
                             stroke: fraction === 0 ? "var(--axis)" : "var(--grid)"}));
    const label = svg("text", {x: left - 8, y: y + 4, "text-anchor": "end", class: "axis-text"});
    label.textContent = compact(max * fraction);
    root.append(label);
  }
  const points = values.map((value, index) => `${xOf(index).toFixed(1)},${yOf(value).toFixed(1)}`);
  root.append(svg("path", {d: `M${xOf(0)},${bottom}L${points.join("L")}L${xOf(last)},${bottom}Z`,
                           fill: color, "fill-opacity": 0.1}));
  root.append(svg("path", {d: `M${points.join("L")}`, fill: "none", stroke: color, "stroke-width": 2,
                           "stroke-linejoin": "round", "stroke-linecap": "round"}));
  // direct labels on the two values that matter: the peak and the latest turn
  const labelled = peak === last ? [last] : [peak, last];
  for (const index of labelled) {
    root.append(svg("circle", {cx: xOf(index), cy: yOf(values[index]), r: 4, fill: color, stroke: "var(--surface)",
                               "stroke-width": 2}));
    const atEnd = index === last;
    const label = svg("text", {x: atEnd ? xOf(index) + 9 : xOf(index), y: atEnd ? yOf(values[index]) + 4 : yOf(values[index]) - 8,
                               "text-anchor": atEnd ? "start" : "middle", class: "value-text"});
    label.textContent = atEnd ? compact(values[index]) : `peak ${compact(values[index])}`;
    root.append(label);
  }
  // x axis: turn numbers, about six of them
  const every = Math.max(1, Math.ceil(turns.length / 6));
  for (let index = 0; index <= last; index += every) {
    const label = svg("text", {x: xOf(index), y: bottom + 18, "text-anchor": "middle", class: "axis-text"});
    label.textContent = index === 0 ? "turn 1" : String(index + 1);
    root.append(label);
  }
  // one hit layer: the crosshair snaps to the nearest turn; arrow keys, Page Up/Down, Home and End move it
  const crosshair = svg("line", {y1: CONTEXT_TOP, y2: bottom, class: "crosshair", visibility: "hidden"});
  const marker = svg("circle", {r: 4, fill: color, stroke: "var(--surface)", "stroke-width": 2, visibility: "hidden"});
  const hit = svg("rect", {x: left, y: 0, width: Math.max(1, right - left), height: bottom, class: "hit trend-hit",
                           tabindex: 0, "aria-label": "Context per turn; arrow keys step through the turns"});
  const tooltip = el("div", {class: "tooltip", hidden: true});
  let current = last;
  const show = index => {
    current = Math.min(Math.max(0, index), last);
    const x = xOf(current);
    crosshair.setAttribute("x1", x);
    crosshair.setAttribute("x2", x);
    crosshair.setAttribute("visibility", "visible");
    marker.setAttribute("cx", x);
    marker.setAttribute("cy", yOf(values[current]));
    marker.setAttribute("visibility", "visible");
    const effort = turns[current].effort ? ` · effort ${turns[current].effort}` : "";
    tooltip.replaceChildren(
      el("div", {class: "when",
                 text: `Turn ${whole(current + 1)} of ${whole(turns.length)} · ${when(turns[current].ts)}${effort}`}),
      el("div", {class: "row"}, el("span", {class: "key", style: `background:${color}`}),
         el("strong", {text: compact(values[current])}), el("span", {class: "name", text: "context"})));
    tooltip.hidden = false;
    const scale = root.getBoundingClientRect().width / width || 1;
    tooltip.style.left = `${Math.min(Math.max(0, x * scale + 12), container.clientWidth - tooltip.offsetWidth)}px`;
    tooltip.style.top = "8px";
  };
  const hide = () => {
    crosshair.setAttribute("visibility", "hidden");
    marker.setAttribute("visibility", "hidden");
    tooltip.hidden = true;
  };
  hit.addEventListener("pointermove", event => {
    const bounds = root.getBoundingClientRect();
    const x = (event.clientX - bounds.left) * width / bounds.width;
    show(last > 0 ? Math.round((x - left) / (right - left) * last) : 0);
  });
  hit.addEventListener("focus", () => show(current));
  hit.addEventListener("keydown", event => {
    const page = Math.max(1, Math.round(turns.length / 10));
    const steps = {ArrowLeft: -1, ArrowRight: 1, PageUp: -page, PageDown: page};
    if (event.key in steps) show(current + steps[event.key]);
    else if (event.key === "Home") show(0);
    else if (event.key === "End") show(last);
    else return;
    event.preventDefault();
  });
  hit.addEventListener("pointerleave", hide);
  hit.addEventListener("blur", hide);
  root.append(crosshair, marker, hit);
  container.replaceChildren(root, tooltip);
}

function renderContextTable(turns) {
  const head = el("tr", {}, el("th", {class: "num", text: "Turn"}), el("th", {text: "Time"}),
                  el("th", {text: "Effort"}), el("th", {class: "num", text: "Context"}));
  const rows = turns.map((turn, index) => el("tr", {}, el("td", {class: "num", text: whole(index + 1)}),
    el("td", {text: when(turn.ts)}), el("td", {text: turn.effort || "–"}),
    el("td", {class: "num", text: whole(turn.context)})));
  document.getElementById("context-table").replaceChildren(
    turns.length ? el("table", {}, el("thead", {}, head), el("tbody", {}, ...rows))
                 : el("div", {class: "empty", text: "No turns in the main thread."}));
}
