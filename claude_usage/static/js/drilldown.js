// One session's drilldown with its context per turn.
"use strict";

// --- drilldown -----------------------------------------------------------------------------------------------

function renderDrilldown(detail) {
  const panel = document.getElementById("drilldown");
  chatRequest++;                                          // a conversation still loading belongs to the old view
  // an open session is all the page shows: the range's filters, figures, charts and tables come back on close
  for (const id of ["filters", "summary"]) document.getElementById(id).hidden = Boolean(detail);
  if (!detail) {
    clearTimeout(gaugeTimer);
    panel.hidden = true;
    panel.replaceChildren();
    return;
  }
  if (detail.session_id !== contextSession) {           // another session starts at its main thread again
    contextSession = detail.session_id;
    contextAgent = "main";
  }
  const searches = detail.agents.some(agent => agent.web_searches);
  const head = el("tr", {}, el("th", {text: "Agent"}), el("th", {text: "Model"}),
                  el("th", {class: "num", text: "Turns"}), el("th", {class: "num", text: "Context first → last"}),
                  el("th", {class: "num", text: "Input total"}), el("th", {class: "num", text: "Cache read %"}),
                  el("th", {class: "num", text: "Output"}),
                  searches ? el("th", {class: "num", text: "Web searches"}) : null,
                  el("th", {class: "num", text: "Returned",
                            title: "what a subagent handed back: its result's characters"}),
                  el("th", {class: "num", text: "Cost"}));
  const agents = agentRows(detail.agents, searches);
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
    currentGauge(detail.current),
    el("div", {class: "chart-head"}, el("h3", {text: "Context per turn"}),
       el("span", {id: "context-note", class: "muted"}),
       el("span", {class: "spacer"}), contextPicker(detail),
       el("button", {type: "button", id: "context-table-toggle", "aria-pressed": "false", text: "Table view"})),
    el("div", {class: "legend"}, ...CONTEXT_PARTS.slice().reverse().map(part =>
       el("span", {}, el("span", {class: "swatch", style: `background:${part.color}`}), part.label)),
       el("span", {}, el("span", {class: "legend-rule"}), "compaction")),
    el("div", {id: "context-chart", class: "chart"}),
    el("div", {id: "context-table", class: "table-wrap", hidden: true}),
    el("div", {id: "context-details"}),
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
  scheduleGaugeRefresh(detail);
}

// one row per transcript; a workflow run's agents under one row per run, whose button shows or hides them
function agentRows(agents, searches) {
  const rows = [];
  const runs = new Map();
  for (const agent of agents) {
    if (agent.workflow_run === null) {
      rows.push(agentRow(agent, searches));
    } else if (runs.has(agent.workflow_run)) {
      runs.get(agent.workflow_run).push(agent);
    } else {
      const members = [agent];
      runs.set(agent.workflow_run, members);
      rows.push(members);                                 // filled in below, in the place of its first agent
    }
  }
  return rows.flatMap(row => (Array.isArray(row) ? workflowRows(row, searches) : [row]));
}

function agentRow(agent, searches, className = null) {
  const phase = agent.workflow_phase ? ` · ${agent.workflow_phase}` : "";
  return el("tr", {class: className},
    el("td", {}, el("strong", {text: agent.agent_type}),
       el("span", {class: "sub", text: `${agent.description || ""}${phase}`})),
    el("td", {}, ...agentModels(agent)), el("td", {class: "num", text: whole(agent.turns)}),
    el("td", {class: "num", text: `${compact(agent.context_first)} → ${compact(agent.context_last)}`}),
    el("td", {class: "num", text: compact(agent.input_total)}),
    el("td", {class: "num", text: percent(agent.cache_read, agent.input_total)}),
    el("td", {class: "num", text: compact(agent.output)}),
    searches ? el("td", {class: "num", text: whole(agent.web_searches)}) : null,
    el("td", {class: "num", text: compact(agent.returned_chars)}),
    el("td", {class: "num", text: money(agent.cost)}));
}

// a workflow run: its totals, then its agents, hidden until the button shows them
function workflowRows(agents, searches) {
  const sum = field => agents.reduce((total, agent) => total + (agent[field] || 0), 0);
  const costs = agents.map(agent => agent.cost).filter(cost => cost !== null);
  const name = agents[0].workflow_name || agents[0].workflow_run;
  const members = agents.map(agent => agentRow(agent, searches, "sub-row workflow-member"));
  for (const row of members) row.hidden = true;
  const toggle = el("button", {type: "button", class: "link-button", "aria-expanded": "false",
                               text: `${whole(agents.length)} agents`});
  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") !== "true";
    toggle.setAttribute("aria-expanded", String(open));
    for (const row of members) row.hidden = !open;
  });
  const models = [...new Set(agents.flatMap(agent => agent.models))];
  const head = el("tr", {class: "group-row"},
    el("td", {}, el("strong", {text: `workflow · ${name}`}), el("span", {class: "sub"}, toggle)),
    el("td", {}, ...models.map(model => el("div", {text: model}))), el("td", {class: "num", text: whole(sum("turns"))}),
    el("td", {class: "num", text: "–"}), el("td", {class: "num", text: compact(sum("input_total"))}),
    el("td", {class: "num", text: percent(sum("cache_read"), sum("input_total"))}),
    el("td", {class: "num", text: compact(sum("output"))}),
    searches ? el("td", {class: "num", text: whole(sum("web_searches"))}) : null,
    el("td", {class: "num", text: "–"}),
    el("td", {class: "num", text: costs.length ? money(costs.reduce((total, cost) => total + cost, 0)) : "–"}));
  return [head, ...members];
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

// --- context per turn: what each turn sent, stacked by part, for one agent at a time ----------------------------

const CONTEXT_PLOT = 160;
const CONTEXT_TOP = 18;                                   // room for the compaction labels above the plot
const RULE_LABEL_ROOM = 44;                               // a compaction rule's label only where it fits
// the parts of a turn's context, from the cheapest (bottom) to the dearest: one hue, light to dark, validated
// as an ordinal ramp in both modes
const CONTEXT_PARTS = [
  {field: "cache_read", label: "Cache read", color: "var(--context-read)"},
  {field: "cache_write", label: "Cache write", color: "var(--context-write)"},
  {field: "new_input", label: "New input", color: "var(--context-new)"},
];
const COMPACTION_TRIGGERS = {manual: "/compact", auto: "auto-compact"};

let contextAgent = "main";                                // the picked transcript's agent id; main thread "main"
let contextSession = null;                                // the session it was picked in

function agentKey(agent) { return agent.agent_id ?? "main"; }

// the transcripts with turns (background calls have none), the main thread first
function contextAgents(detail) {
  return detail.agents.filter(agent => agent.context_per_turn.length);
}

function agentName(agent) {
  if (agent.agent_id === null) return "main thread";
  return agent.description ? `${agent.agent_type} · ${agent.description}` : agent.agent_type;
}

function pickedAgent(detail) {
  const agents = contextAgents(detail);
  return agents.find(agent => agentKey(agent) === contextAgent) || agents[0] || null;
}

function contextPicker(detail) {
  const agents = contextAgents(detail);
  if (agents.length < 2) return null;
  const picked = pickedAgent(detail);
  const select = el("select", {id: "context-agent", "aria-label": "Transcript the context section shows"},
    ...agentOptions(agents, agentKey, agentName, picked));
  select.addEventListener("change", () => {
    contextAgent = select.value;
    renderContext(detail);
  });
  return select;
}

// the main thread's latest context against the auto-compact point, with the soft hint marked on the bar
function currentGauge(current) {
  if (!current) return null;
  const share = Math.min(1, current.context / current.auto_compact);
  const hint = current.hint_tokens < current.auto_compact ? current.hint_tokens / current.auto_compact : null;
  const since = current.last_compaction ? `since the last compaction (${when(current.last_compaction)})`
                                        : "since the session started";
  const pace = current.mean_step === null ? "too few turns for an estimate"
             : current.turns_left === null ? `${signed(current.mean_step)} per turn, not growing`
             : `about ${whole(current.turns_left)} turns left at ${signed(current.mean_step)} per turn ` +
               "(mean of the last 10)";
  return el("div", {class: "card gauge-card", id: "current-gauge"},
    el("div", {class: "label", text: `Latest context, main thread · ${current.model}`}),
    el("div", {class: "tile-value"}, `${compact(current.context)} `,
       el("span", {class: "secondary",
                   text: `of ${compact(current.auto_compact)} · ${percent(current.context, current.auto_compact)}`})),
    el("div", {class: "gauge", role: "meter", "aria-valuemin": 0, "aria-valuemax": current.auto_compact,
               "aria-valuenow": current.context,
               "aria-label": `Latest context ${compact(current.context)} of the auto-compact point ` +
                             `${compact(current.auto_compact)}`},
       el("span", {class: "gauge-fill", style: `width:${(share * 100).toFixed(1)}%`}),
       hint === null ? null : el("span", {class: "gauge-hint", style: `left:${(hint * 100).toFixed(1)}%`})),
    el("div", {class: "note", text: [
      `${compact(current.headroom)} until auto-compact`,
      hint === null ? null : `the mark is the compact hint at ${compact(current.hint_tokens)}, a heuristic`,
      `${whole(current.turns_since_compaction)} turns ${since}`, pace].filter(Boolean).join(" · ")}),
    ...compactNowNotes(current.compact_now));
}

// " (low–high)", or nothing where both ends read the same
function spread(low, high) { return low === high ? "" : ` (${low}–${high})`; }

// what compacting now would cost: the exact parts (each call's re-read, the cache's lifetime, keeping across a
// break), then the estimate from past compactions (turns.compact_preview)
function compactNowNotes(preview) {
  if (!preview) return [];
  const until = preview.cache_warm_until;
  const expired = until !== null && Date.parse(until) < Date.now();
  const cache = until === null ? null
    : expired ? `the cache has likely expired (${when(until)}): the next call rewrites it all, ` +
                `+${money(preview.keep_across_break)}`
    : `cache warm until ${when(until)} (${preview.cache_ttl_minutes} min from the last request); after that, ` +
      `keeping costs +${money(preview.keep_across_break)} at the next call`;
  const reread = `Each call re-reads ${compact(preview.before)} (${money(preview.reread_cost)})`;
  const exact = el("div", {class: "note", text: [reread, cache].filter(Boolean).join(" · ")});
  const estimate = preview.estimate;
  if (!estimate) {
    const stored = preview.stored_compactions;
    const why = stored ? `your ${whole(stored)} stored ${stored === 1 ? "compaction carries" : "compactions carry"} ` +
                         "no duration or output speed to estimate the summary from"
                       : "no stored compaction to learn from yet";
    return [exact, el("div", {class: "note", text: `No estimate of compacting now: ${why}.`})];
  }
  const count = `${whole(estimate.compactions)} stored ${estimate.compactions === 1 ? "compaction" : "compactions"}`;
  const parts = [`If you compact now: ${payoffText(estimate, expired)}`,
                 `context after about ${compact(estimate.after)}` +
                 spread(compact(estimate.after_low), compact(estimate.after_high)),
                 expired ? null : `one-time ~${money(estimate.one_time)}`, `estimated from ${count}`].filter(Boolean);
  if (estimate.calls_after_low !== null) {
    const low = whole(estimate.calls_after_low);
    const high = whole(estimate.calls_after_high);
    parts.push(`${low === high ? low : `${low}–${high}`} calls followed them until the next compaction`);
  }
  if (estimate.before_break !== null && !expired && until !== null) {
    parts.push(`compacting before a break past ${when(until)} pays off at once ` +
               `(about ${money(estimate.before_break)})`);
  }
  return [exact, el("div", {class: "note", text: parts.join(" · ")})];
}

// when compacting now pays off: warm against the next calls' reads; once the cache has expired, cold against
// keeping's rewrite of everything
function payoffText(estimate, expired) {
  if (expired) {
    if (estimate.breakeven_cold === null) return "would never pay off: the context is below what compacting leaves";
    return estimate.cold_saving >= 0
      ? `pays off at once (about ${money(estimate.cold_saving)}), since the next call rewrites it all anyway`
      : `would pay off after about ${whole(estimate.breakeven_cold)} calls`;
  }
  const calls = value => (value === null ? "never" : whole(value));
  if (estimate.breakeven_calls !== null) {
    return `would pay off after about ${whole(estimate.breakeven_calls)} calls` +
           spread(calls(estimate.breakeven_low), calls(estimate.breakeven_high));
  }
  return estimate.breakeven_low === null
    ? "would never pay off: the context is below what compacting leaves"
    : `would likely not pay off (at best after about ${whole(estimate.breakeven_low)} calls)`;
}

// the gauge's cache wording turns once the cache expires: draw it again then, if the session is still open
let gaugeTimer = null;
function scheduleGaugeRefresh(detail) {
  clearTimeout(gaugeTimer);
  const until = detail && detail.current && detail.current.compact_now
    ? detail.current.compact_now.cache_warm_until : null;
  const wait = until === null ? -1 : Date.parse(until) - Date.now();
  if (wait <= 0 || wait > 2 ** 31 - 1) return;
  gaugeTimer = setTimeout(() => {
    const gauge = document.getElementById("current-gauge");
    if (gauge && state.session === detail) gauge.replaceWith(currentGauge(detail.current));
  }, wait + 1000);
}

// the turn the chart puts a compaction before: the first turn after it
function compactionTurn(turns, compaction) {
  if (!compaction.ts) return -1;
  const moment = Date.parse(compaction.ts);
  return turns.findIndex(turn => turn.ts && Date.parse(turn.ts) > moment);
}

function renderContext(detail) {
  const container = document.getElementById("context-chart");
  if (!container) return;
  const agent = pickedAgent(detail);
  const turns = agent ? agent.context_per_turn : [];
  document.getElementById("context-note").textContent = agent
    ? `${agentName(agent)}: every turn sends its whole context again`
    : "";
  renderContextTable(turns);
  renderContextDetails(agent);
  if (!turns.length) {
    container.replaceChildren(el("div", {class: "empty", text: "No turns with usage."}));
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
  const root = chartRoot(width, bottom + AXIS_BAND,
                         `Context per turn of the ${agentName(agent)}, by cache read, cache write and new input: ` +
                         `${turns.length} turns, peak ${compact(values[peak])}, last ${compact(values[last])}; ` +
                         "table view available");
  drawYAxis(root, left, right, ticks(max, 4), yOf, compact);
  drawContextStack(root, turns, xOf, yOf, bottom);
  // the compact hint as a reference line, where the plot reaches it
  if (detail.compact_hint_tokens && detail.compact_hint_tokens <= max) {
    const y = Math.round(yOf(detail.compact_hint_tokens)) + 0.5;
    root.append(svg("line", {x1: left, x2: right, y1: y, y2: y, class: "reference-line"}));
    const label = svg("text", {x: right + 6, y: y + 4, class: "axis-text"});
    label.textContent = `hint ${compact(detail.compact_hint_tokens)}`;
    root.append(label);
  }
  const rules = drawCompactionRules(root, agent, turns, xOf, bottom);
  // direct labels on the two totals that matter: the peak and the latest turn; the peak's steps left of a rule
  // just after it
  for (const index of peak === last ? [last] : [peak, last]) {
    const atEnd = index === last;
    const ruleNear = rules.some(x => x >= xOf(index) && x - xOf(index) < RULE_LABEL_ROOM);
    const label = svg("text", {x: atEnd ? xOf(index) + 9 : ruleNear ? xOf(index) - 6 : xOf(index),
                               y: atEnd ? yOf(values[index]) + 4 : yOf(values[index]) - 8,
                               "text-anchor": atEnd ? "start" : ruleNear ? "end" : "middle", class: "value-text"});
    label.textContent = atEnd ? compact(values[index]) : `peak ${compact(values[index])}`;
    root.append(label);
  }
  drawXLabels(root, turns.length, xOf, bottom + 18, index => (index === 0 ? "turn 1" : String(index + 1)), 6);
  const crosshair = svg("line", {y1: CONTEXT_TOP, y2: bottom, class: "crosshair", visibility: "hidden"});
  const marker = pointDot("var(--context-new)", 0, 0, true);
  const tooltip = tooltipBox();
  const cursor = chartCursor(root, width, {x: left, y: 0, width: right - left, height: bottom}, {
    count: turns.length,
    indexAt: nearestIndex(left, right, turns.length),
    label: "Context per turn by part; arrow keys step through the turns",
    valueText: index => `${turnTitle(turns, index)}: ${turnFacts(turns[index]).join(", ")}`,
    show: index => {
      moveMark(crosshair, {x1: xOf(index), x2: xOf(index)});
      moveMark(marker, {cx: xOf(index), cy: yOf(values[index])});
      tooltip.replaceChildren(el("div", {class: "when", text: turnTitle(turns, index)}),
        ...CONTEXT_PARTS.slice().reverse().map(part =>
          tooltipRow(part.color, compact(turns[index][part.field]), part.label, true)),
        tooltipRow(null, compact(values[index]), "context"),
        ...turnNotes(turns[index]).map(text => el("div", {class: "name", text})));
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

// the three parts as stacked areas, each ringed on top by a 2px line of the surface so neighbours stay apart
function drawContextStack(root, turns, xOf, yOf, bottom) {
  let base = turns.map(() => 0);
  for (const part of CONTEXT_PARTS) {
    const top = base.map((value, index) => value + turns[index][part.field]);
    const upper = top.map((value, index) => `${xOf(index).toFixed(1)},${yOf(value).toFixed(1)}`);
    const lower = base.map((value, index) => `${xOf(index).toFixed(1)},${yOf(value).toFixed(1)}`).reverse();
    if (turns.length === 1) {
      // a single turn has no width: a short column instead
      const x = xOf(0);
      root.append(svg("rect", {x: x - 6, y: yOf(top[0]), width: 12, height: Math.max(0, yOf(base[0]) - yOf(top[0])),
                               fill: part.color}));
    } else {
      root.append(svg("path", {d: `M${upper.join("L")}L${lower.join("L")}Z`, fill: part.color}));
      root.append(svg("path", {d: `M${upper.join("L")}`, fill: "none", stroke: "var(--surface)", "stroke-width": 2,
                               "stroke-linejoin": "round"}));
    }
    base = top;
  }
  root.append(svg("line", {x1: xOf(0), x2: xOf(turns.length - 1), y1: bottom, y2: bottom, stroke: "var(--axis)"}));
}

// a dashed rule before the first turn after each compaction, labelled by its trigger where there is room; returns
// the rules' x positions
function drawCompactionRules(root, agent, turns, xOf, bottom) {
  const positions = [];
  let lastLabel = -Infinity;
  for (const compaction of agent.compactions) {
    const index = compactionTurn(turns, compaction);
    if (index < 0) continue;
    const x = index > 0 ? (xOf(index - 1) + xOf(index)) / 2 : xOf(0);
    root.append(svg("line", {x1: x, x2: x, y1: CONTEXT_TOP - 4, y2: bottom, class: "compaction-rule"}));
    positions.push(x);
    if (x - lastLabel < RULE_LABEL_ROOM) continue;
    const label = svg("text", {x, y: CONTEXT_TOP - 8, "text-anchor": "middle", class: "axis-text"});
    label.textContent = COMPACTION_TRIGGERS[compaction.trigger] || "compaction";
    root.append(label);
    lastLabel = x;
  }
  return positions;
}

function turnTitle(turns, index) {
  const effort = turns[index].effort ? ` · effort ${turns[index].effort}` : "";
  return `Turn ${whole(index + 1)} of ${whole(turns.length)} · ${when(turns[index].ts)}${effort}`;
}

// the growth and the rebuild of a turn, as short lines
function turnNotes(turn) {
  const notes = [];
  if (turn.growth !== null) notes.push(`grew ${signed(turn.growth)} beyond the last reply`);
  if (turn.rebuild) {
    const cost = turn.rebuild.extra_cost === null ? "" : `, +${money(turn.rebuild.extra_cost)}`;
    notes.push(`cache rebuilt: ${REBUILD_CAUSES[turn.rebuild.cause]} (${compact(turn.rebuild.lost)}${cost})`);
  }
  return notes;
}

function turnFacts(turn) {
  return [`context ${compact(turn.context)}`,
          ...CONTEXT_PARTS.map(part => `${part.label.toLowerCase()} ${compact(turn[part.field])}`),
          ...turnNotes(turn)];
}

function renderContextTable(turns) {
  const table = dataTable(
    [headCell("Turn", true), headCell("Time"), headCell("Effort"),
     ...CONTEXT_PARTS.map(part => headCell(part.label, true)), headCell("Context", true), headCell("Growth", true),
     headCell("Cache rebuild")],
    turns.map((turn, index) => el("tr", {}, cell(whole(index + 1), true), cell(when(turn.ts)),
      cell(turn.effort || "–"), ...CONTEXT_PARTS.map(part => cell(whole(turn[part.field]), true)),
      cell(whole(turn.context), true), cell(turn.growth === null ? "–" : signed(turn.growth), true),
      cell(turn.rebuild ? `${turn.rebuild.cause} · ${compact(turn.rebuild.lost)}` : "–"))));
  document.getElementById("context-table").replaceChildren(
    turns.length ? table : el("div", {class: "empty", text: "No turns with usage."}));
}

// under the chart, for the same transcript: the overhead, rebuild, compaction and growth tiles, the biggest
// growth steps and the compactions
function renderContextDetails(agent) {
  const target = document.getElementById("context-details");
  if (!agent) {
    target.replaceChildren();
    return;
  }
  const turns = agent.context_per_turn;
  const card = (label, value, note) => el("div", {class: "card"}, el("div", {class: "label", text: label}),
    el("div", {class: "tile-value", text: value}), el("div", {class: "note", text: note}));
  const overhead = agent.overhead;
  const rebuilds = agent.rebuilds;
  const triggers = Object.entries(COMPACTION_TRIGGERS)
    .map(([trigger, name]) => [name, agent.compactions.filter(row => row.trigger === trigger).length])
    .filter(([, count]) => count).map(([name, count]) => `${whole(count)} ${name}`);
  const growths = turns.map(turn => turn.growth).filter(growth => growth !== null);
  const meanGrowth = growths.length ? growths.reduce((sum, growth) => sum + growth, 0) / growths.length : null;
  target.replaceChildren(
    el("div", {class: "kpis session-kpis"},
       card("Fixed overhead", overhead ? compact(overhead.tokens) : "–",
            overhead ? `the first call's context (system prompt, tools, CLAUDE.md); reading it again cost ` +
                       money(overhead.cost) : "no turns"),
       card("Cache rebuilds", whole(rebuilds.count),
            rebuilds.count ? `${compact(rebuilds.lost)} tokens written again, ${money(rebuilds.cost)} extra`
                           : "every turn read the previous context from the cache"),
       card("Compactions", whole(agent.compactions.length), triggers.length ? triggers.join(", ") : "none"),
       card("Growth per turn", meanGrowth === null ? "–" : signed(Math.round(meanGrowth)),
            "mean of what each turn added beyond the last reply: tool results, prompts, attachments")),
    el("h3", {text: "Biggest growth steps"}), el("div", {class: "table-wrap"}, growthTable(agent)),
    el("h3", {text: "Compactions"}), el("div", {class: "table-wrap"}, compactionTable(agent)));
}

// the tools a call ran, by name with their count and result size: "Read ×3 12.4K, Bash 30"
function toolSummary(tools) {
  const byName = new Map();
  for (const tool of tools) {
    const entry = byName.get(tool.tool) || {calls: 0, chars: 0};
    entry.calls += 1;
    entry.chars += tool.result_chars;
    byName.set(tool.tool, entry);
  }
  return [...byName].map(([name, entry]) =>
    `${name}${entry.calls > 1 ? ` ×${entry.calls}` : ""} ${compact(entry.chars)}`).join(", ");
}

function growthTable(agent) {
  if (!agent.top_growth.length) return el("div", {class: "empty", text: "No turn grew the context."});
  const numbers = new Map(agent.context_per_turn.map((turn, index) => [turn.message_id, index + 1]));
  return dataTable([headCell("Turn", true), headCell("Time"), headCell("Growth", true),
                    headCell("Tools the call before ran (result characters)")],
    agent.top_growth.map(step => el("tr", {}, cell(whole(numbers.get(step.message_id) ?? null), true),
      cell(when(step.ts)), cell(compact(step.growth), true),
      cell(step.tools.length ? toolSummary(step.tools) : "none: a prompt or attachments"))));
}

// each compaction with what it cost once and saved per later call against keeping the context
function compactionTable(agent) {
  if (!agent.compactions.length) return el("div", {class: "empty", text: "No compactions."});
  const table = dataTable([headCell("Time"), headCell("Trigger"), headCell("Before", true), headCell("After", true),
                           headCell("Took", true), headCell("Each later call", true), headCell("One-time", true),
                           headCell("Pays off at", true), headCell("Calls after", true), headCell("Versus keeping")],
    agent.compactions.map(row => {
      const comparison = row.versus_keeping;
      const after = el("td", {class: "num", text: compact(row.next_context ?? row.post_tokens),
                              title: `Claude Code reports ${compact(row.post_tokens)}: without the system prompt, ` +
                                     "tools and CLAUDE.md the next call sends again"});
      if (!comparison) {
        return el("tr", {}, cell(when(row.ts)), cell(COMPACTION_TRIGGERS[row.trigger] || row.trigger || "–"),
                  cell(compact(row.pre_tokens), true), after, cell(duration(row.duration_ms), true),
                  el("td", {colspan: 5, class: "muted", text: "no call after it, or no price for its model"}));
      }
      const dropped = comparison.difference > 0
        ? `−${compact(comparison.difference)} · ${money(comparison.saving_per_call)}`
        : `+${compact(-comparison.difference)} · nothing saved`;
      return el("tr", {}, cell(when(row.ts)), cell(COMPACTION_TRIGGERS[row.trigger] || row.trigger || "–"),
        cell(compact(row.pre_tokens), true), after, cell(duration(row.duration_ms), true), cell(dropped, true),
        el("td", {class: "num", title: oneTimeTitle(comparison), text: oneTimeText(comparison)}),
        el("td", {class: "num", text: breakevenCall(comparison) ?? "–",
                  title: comparison.breakeven_call > comparison.calls_after ? "projected past the last call" : null}),
        el("td", {class: "num", text: whole(comparison.calls_after),
                  title: comparison.last_stretch ? "up to the last call" : "up to the next compaction"}),
        el("td", {title: verdictTitle(comparison), text: verdictText(comparison)}));
    }));
  return el("div", {}, table, el("div", {class: "note", text: `${VERSUS_KEEPING_NOTE} Each compaction is ` +
                                                               "compared on its own, so they don't add up."}));
}
