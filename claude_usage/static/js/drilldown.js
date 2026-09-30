// One session's drilldown with its context per turn.
"use strict";

// --- drilldown -----------------------------------------------------------------------------------------------

// The view's frame is the SessionView component (web/src/components/SessionView.svelte), drawn from the payload: its
// heading and facts, the waits, the tiles, the gauge with the calls above it (ContextGauge), and the model, agent,
// skill, MCP server and API error tables. It leaves four empty slots, #session-secrets, #session-top, #session-mid and
// #session-end, for the sections still drawn here.
// refresh: the same session drawn again with newer numbers, keeping what the reader had open (keptView)
function renderDrilldown(detail, refresh = false) {
  const kept = refresh && document.getElementById("chat") ? keptView(document.getElementById("drilldown")) : null;
  if (!kept) chatRequest++;                               // a conversation still loading belongs to the old view
  if (!detail) {
    setPayload({session: null});                          // the view goes: the page comes back, focus to the link
    return;
  }
  if (detail.session_id !== contextSession) {           // another session starts at its main thread again
    contextSession = detail.session_id;
    contextAgent = "main";
  }
  // the session's tables page by their own keys, so another session starts at the first page
  const key = name => `${detail.session_id}-${name}`;
  const order = toolsAndChat(detail.transcript,
                             [el("h3", {text: "Tools"}), toolsNote(detail.agents),
                              el("div", {class: "table-wrap"}, paged(key("tools"), toolsTable(detail.agents)))],
                             kept ? kept.chat : [chatSection(detail)]);
  setPayload({session: detail});
  const panel = document.getElementById("drilldown");
  fill(document.getElementById("session-secrets"), secretAccesses(detail, key("secrets")));
  fill(document.getElementById("session-top"),
    el("div", {class: "chart-head"}, el("h3", {text: "Context per turn"}),
       el("span", {id: "context-note", class: "muted"}),
       el("span", {class: "spacer"}), contextPicker(detail),
       el("button", {type: "button", id: "context-table-toggle", "aria-pressed": "false", text: "Table view"})),
    el("div", {class: "legend"}, ...CONTEXT_PARTS.slice().reverse().map(part =>
       el("span", {}, el("span", {class: "swatch", style: `background:${part.color}`}), part.label)),
       el("span", {}, el("span", {class: "legend-rule"}), "compaction")),
    el("div", {id: "context-chart", class: "chart"}),
    el("div", {id: "context-table", class: "table-wrap", hidden: true}),
    el("div", {id: "context-details"}));
  fill(document.getElementById("session-mid"), ...order[0]);
  fill(document.getElementById("session-end"), ...order[1]);
  document.getElementById("context-table-toggle").addEventListener("click", event => {
    const table = document.getElementById("context-table");
    table.hidden = !table.hidden;
    event.currentTarget.setAttribute("aria-pressed", String(!table.hidden));
  });
  if (kept) restoreView(panel, kept);                     // before the chart, which fills the table view
  renderContext(detail);                                  // the view is in the page, so the chart can measure it
  if (kept) restoreFocusAndScroll(panel, kept);
}

// the view's elements as the reader sees them in order: its own children, and the children of the slots the old
// sections are drawn into
function panelItems(panel) {
  return [...panel.children].flatMap(child =>
    (child.classList.contains("legacy-slot") ? [...child.children] : [child]));
}

// What a refresh keeps: the conversation's nodes as they are (moved into the new view, so a loaded conversation
// and its picker stay), the table view and the folds open (workflow runs, tool details), focus, and the element at
// the top of the window
function keptView(panel) {
  const active = panel.contains(document.activeElement) ? document.activeElement : null;
  const anchor = scrollAnchor(panelItems(panel));
  return {
    chat: [document.getElementById("chat-section")],
    table: !document.getElementById("context-table").hidden,
    folds: new Set([...panel.querySelectorAll("[data-fold][aria-expanded='true']")].map(node => node.dataset.fold)),
    active,
    activeId: active && active.id,
    activeFold: active && active.dataset.fold,
    activeIndex: active ? [...panel.querySelectorAll(FOCUSABLE)].indexOf(active) : -1,
    anchor,
    anchorIndex: anchor ? panelItems(panel).indexOf(anchor.node) : -1,
  };
}

function restoreView(panel, kept) {
  if (kept.table) {
    document.getElementById("context-table").hidden = false;
    document.getElementById("context-table-toggle").setAttribute("aria-pressed", "true");
  }
  for (const toggle of panel.querySelectorAll("[data-fold]")) if (kept.folds.has(toggle.dataset.fold)) toggle.click();
}

// the same element where it still exists (in the conversation), else by id, by fold, or by position
function restoreFocusAndScroll(panel, kept) {
  const anchored = kept.anchor && kept.anchor.node.isConnected ? kept.anchor.node : panelItems(panel)[kept.anchorIndex];
  keepScroll(kept.anchor, anchored);
  if (!kept.active) return;
  const target = kept.active.isConnected ? kept.active
    : (kept.activeId && document.getElementById(kept.activeId))
      || (kept.activeFold && panel.querySelector(`[data-fold="${CSS.escape(kept.activeFold)}"]`))
      || panel.querySelectorAll(FOCUSABLE)[kept.activeIndex] || document.getElementById("drilldown-title");
  target.focus({preventScroll: true});
}

function toolsTable(agents) {
  const rows = toolTableRows(agents);
  if (!rows.length) return el("div", {class: "empty", text: "No tool calls."});
  const heading = (text, title) => el("th", {class: "num", text, title});
  const head = el("tr", {}, el("th", {text: "Agent"}), el("th", {text: "Tool"}), heading("Calls"),
    heading("Errors", "calls whose result was an error"), heading("Result characters"),
    heading("Median", "a result's characters, the median call"), heading("p90", "…and at the 90th percentile"),
    heading("Input median", "the characters of a call's input, which the model wrote"),
    heading("Calls after", "how many later calls carried it in their context, the median call, up to the next " +
                           "compaction"),
    heading("~Carried", "what the later calls paid to have its input and result in their context"),
    heading("~Input cost", "its input at the output price"));
  // the rows' folds come from tables.ts: a row shows while every fold above it is open
  const {above, folds} = toolFolds(rows);
  const names = rows.map(row => {
    const name = toolRowName(row);
    return el("span", {class: name.className, text: name.text});
  });
  const body = rows.map((row, index) => {
    const tr = el("tr", {class: toolRowClass(row, rows[index + 1])},
      el("td", {text: row.sub ? "" : row.agent}), el("td", {}, names[index]),
      el("td", {class: "num", text: whole(row.calls)}), el("td", {class: "num", text: whole(row.errors)}),
      el("td", {class: "num", text: compact(row.result_chars)}),
      el("td", {class: "num", text: compact(row.result_median)}),
      el("td", {class: "num", text: compact(row.result_p90)}),
      el("td", {class: "num", text: compact(row.input_median)}),
      el("td", {class: "num", text: whole(row.calls_after_median)}),
      el("td", {class: "num", text: money(row.carried)}), el("td", {class: "num", text: money(row.input_cost)}));
    tr.dataset.key = row.key;
    return tr;
  });
  const open = new Set();
  const update = () => {
    body.forEach((tr, index) => { tr.hidden = !toolRowShown(above[index], open); });
  };
  for (const {fold, row, label} of folds) {
    const toggle = foldToggle(fold, label, isOpen => {
      if (isOpen) open.add(fold); else open.delete(fold);
      update();
    });
    names[row].append(" (", toggle, ")");
  }
  update();
  return el("table", {}, el("thead", {}, head), el("tbody", {}, ...body));
}

// A button that opens or closes a fold, closed at first: onToggle(open) shows or hides its rows. A refresh opens it
// again by its data-fold.
function foldToggle(fold, text, onToggle) {
  const toggle = el("button", {type: "button", class: "link-button", "aria-expanded": "false", "data-fold": fold,
                               text});
  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") !== "true";
    toggle.setAttribute("aria-expanded", String(open));
    onToggle(open);
  });
  return toggle;
}

// how the costs are estimated, while a transcript tells them
function toolsNote(agents) {
  if (!agents.some(agent => agent.tool_kinds && agent.tool_kinds.length)) return null;
  return el("div", {class: "note", text: "Bash splits by what a command does, MCP by server. A call's input and " +
    "result stay in the context, so every later call up to the next compaction reads them again: ~Carried " +
    "estimates what that cost, taking a token as 2.3 characters (measured on real transcripts, a heuristic)."});
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

// Every call that named a possible secret location ([secrets] patterns, matched by the server), the most severe
// first: the path as the call gave it, the pattern, and how far it got. Open as a warning that draws the eye while
// one sent its input out (secretTone "alert"); else folded behind its heading, edged in the warning color while one
// returned a result or may still, a plain card while each was blocked or returned nothing; nothing while none named
// one.
function secretAccesses(detail, pagerKey) {
  const accesses = detail.secret_accesses || [];
  const tone = secretTone(detail);
  if (!tone) return null;
  const head = el("tr", {}, el("th", {text: "Time"}), el("th", {text: "Agent"}), el("th", {text: "Tool"}),
                  el("th", {text: "Path"}), el("th", {text: "Matched", title: "the [secrets] pattern it matched"}),
                  el("th", {text: "Reached"}));
  const rows = accesses.map(access => el("tr", {},
    el("td", {text: when(access.time)}), el("td", {text: access.agent_type}), el("td", {text: access.tool}),
    el("td", {}, el("span", {class: "secret-path", text: access.path}),
       secretVia(access) ? el("span", {class: "secret-via", text: secretVia(access)}) : null),
    el("td", {text: access.pattern}),
    el("td", {}, el("span", {class: `secret-severity secret-severity-${access.severity || "medium"}`,
                             "aria-hidden": "true"}),
       secretReach(access))));
  const calls = accesses.length === 1 ? "1 call" : `${whole(accesses.length)} calls`;
  const count = severity => accesses.filter(access => access.severity === severity).length;
  const body = el("div", {},
    el("p", {text: "These tool calls named a path that matches a possible secret location. Most severe first: sent " +
                   "to an MCP server or a network program, then returned into the conversation (and so to the API), " +
                   "then blocked, failed or empty. Check that each was meant."}),
    el("div", {class: "table-wrap"}, paged(pagerKey, el("table", {}, el("thead", {}, head), el("tbody", {}, ...rows)))),
    el("p", {class: "muted", text: "Matched against [secrets] patterns in the config: file tools by their path, " +
      "commands by their words with the variables they set (quoted text only where it holds a path), and scripts " +
      "this transcript wrote and then ran by their text. Variables from earlier calls and other scripts are " +
      "unknown. A result counts whatever it held: a test that only mentions a path returns output too."}));
  const region = attributes => ({id: "secret-alert", role: "region", "aria-labelledby": "secret-alert-title",
                                  ...attributes});
  if (tone === "alert") {
    return el("div", region({class: "card secret-alert"}),
      el("h3", {class: "secret-alert-head", id: "secret-alert-title"},
         el("span", {class: "secret-alert-icon", "aria-hidden": "true", text: "!"}),
         `Possible secret access: ${calls} (${whole(count("high"))} sent out)`),
      body);
  }
  body.hidden = true;
  const toggle = foldToggle("secret-accesses", "Show them", open => {
    body.hidden = !open;
    toggle.textContent = open ? "Hide them" : "Show them";
  });
  const tests = count("low-medium");
  const summary = tone === "warning"
    ? `${calls} named a possible secret location, ${whole(count("medium"))} of them returned a result or may still`
    : tests ? `${calls} named a possible secret location, ${whole(tests)} returned a result only in a likely test`
      : `${calls} named a possible secret location, none reached anything`;
  return el("div", region({class: `card secret-folded${tone === "warning" ? " secret-warning" : ""}`}),
    el("div", {class: "secret-folded-line"},
       el("h3", {class: "secret-folded-head", id: "secret-alert-title", text: summary}), toggle),
    body);
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
  // the picked transcript's tables page by their own keys: another transcript starts at the first page
  const key = `${detail.session_id}-${agent ? agentKey(agent) : "none"}`;
  renderContextTable(turns, key);
  renderContextDetails(agent, key);
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

function renderContextTable(turns, key) {
  const table = dataTable(
    [headCell("Turn", true), headCell("Time"), headCell("Effort"),
     ...CONTEXT_PARTS.map(part => headCell(part.label, true)), headCell("Context", true), headCell("Growth", true),
     headCell("Cache rebuild")],
    turns.map((turn, index) => el("tr", {}, cell(whole(index + 1), true), cell(when(turn.ts)),
      cell(turn.effort || "–"), ...CONTEXT_PARTS.map(part => cell(whole(turn[part.field]), true)),
      cell(whole(turn.context), true), cell(turn.growth === null ? "–" : signed(turn.growth), true),
      cell(turn.rebuild ? `${turn.rebuild.cause} · ${compact(turn.rebuild.lost)}` : "–"))));
  document.getElementById("context-table").replaceChildren(
    turns.length ? paged(`${key}-turns`, table) : el("div", {class: "empty", text: "No turns with usage."}));
}

// under the chart, for the same transcript: the overhead, rebuild, compaction and growth tiles, the biggest
// growth steps and the compactions
function renderContextDetails(agent, key) {
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
    el("h3", {}, "Compactions", compactionTotalText(compactionTotal(agent.compactions))),
    el("div", {class: "table-wrap"}, paged(`${key}-compactions`, compactionTable(agent))));
}

// the total beside the heading, as a gain or a loss (the sign and arrow carry it, like the Estimated cost tile)
function compactionTotalText(total) {
  if (!total || !total.compactions) return null;
  const gain = total.net >= 0;
  return el("span", {class: `compaction-total verdict-${gain ? "gain" : "loss"}`,
                     title: "Each compaction against keeping its context, over its stretch up to the next one, " +
                            "summed; a stretch not paid off yet as it stands, forced compactions left out" +
                            (total.unknown ? `, ${whole(total.unknown)} without an estimate not summed` : "") + ".",
                     text: gain ? `▲ saved ~${money(total.net)} so far` : `▼ cost ~${money(-total.net)} more so far`});
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
                           headCell("Took", true), headCell("Each later call", true), headCell("Cost once", true),
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
        el("td", {title: verdictTitle(comparison)}, verdictBadge(comparison)));
    }));
  return el("div", {}, table, el("div", {class: "note", text: `${VERSUS_KEEPING_NOTE} Each compaction is ` +
                                                               "compared over its own stretch, up to the next one; " +
                                                               "the Estimated cost tile adds up the main thread's."}));
}
