// One session's drilldown with its context per turn.
"use strict";

// --- drilldown -----------------------------------------------------------------------------------------------

// refresh: the same session drawn again with newer numbers, keeping what the reader had open (keptView)
function renderDrilldown(detail, refresh = false) {
  const panel = document.getElementById("drilldown");
  const kept = refresh && document.getElementById("chat") ? keptView(panel) : null;
  if (!kept) chatRequest++;                               // a conversation still loading belongs to the old view
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
  // the session's tables page by their own keys, so another session starts at the first page
  const key = name => `${detail.session_id}-${name}`;
  const order = toolsAndChat(detail.transcript,
                             [el("h3", {text: "Tools"}), toolsNote(detail.agents),
                              el("div", {class: "table-wrap"}, paged(key("tools"), toolsTable(detail.agents)))],
                             kept ? kept.chat : [chatSection(detail)]);
  fill(panel,
    el("div", {class: "chart-head"},
       el("h2", {id: "drilldown-title", tabindex: -1, text: detail.title || "Untitled session"}),
       el("span", {class: "spacer"}),
       el("a", {href: "#", text: "Close", "aria-keyshortcuts": "Escape"})),
    detail.prompt ? el("div", {class: "prompt", text: detail.prompt}) : null,
    el("div", {class: "muted", text: `${detail.project}${detail.git_branch ? " · " + detail.git_branch : ""} · ${when(detail.first_ts)} – ${when(detail.last_ts)} · ${detail.session_id}`}),
    // the page's tile rows with this session's numbers: its whole usage, main thread, subagents and background
    el("div", {class: "kpis session-kpis"},
       ...kpiTiles(detail, "this session", detail.context, detail.compact_hint_tokens,
                 detail.compaction_savings)),
    // from the cost record Claude Code writes when its process exits, until then estimated from the transcripts
    detail.runtime ? el("div", {class: "kpis session-kpis"},
                        ...runtimeTiles(detail.runtime, detail.runtime.source === "cost_record"
                                          ? "from its cost record" : "estimated from the transcripts",
                                        sessionCostPer100Lines(detail)))
                   : null,
    compactCall(detail),
    delegateCall(detail),
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
    themed("h3", "By model"), el("div", {class: "table-wrap"}, paged(key("models"), sessionModelTable(detail))),
    el("h3", {text: "Main thread and subagents"}), el("div", {class: "table-wrap"}, paged(key("agents"), el("table", {},
       el("thead", {}, head), el("tbody", {}, ...agents)))),
    ...order[0],
    el("div", {class: "grid-2"},
       el("div", {}, themed("h3", "By skill"), el("div", {class: "table-wrap"},
          paged(key("skills"), usageTable(detail.skills, "Skill", row => row.skill,
                                          "No turns attributed to a skill.")))),
       el("div", {}, themed("h3", "By MCP server"), el("div", {class: "table-wrap"},
          paged(key("mcp-servers"), usageTable(detail.mcp_servers, "MCP server", row => row.mcp_server,
                                               "No turns attributed to an MCP server."))))),
    themed("h3", "Rate limits and API errors"),
    el("div", {class: "table-wrap"}, paged(key("api-errors"),
       limitEventsTable(detail.api_errors, "No API errors in this session.", false))),
    ...order[1]);
  document.getElementById("context-table-toggle").addEventListener("click", event => {
    const table = document.getElementById("context-table");
    table.hidden = !table.hidden;
    event.currentTarget.setAttribute("aria-pressed", String(!table.hidden));
  });
  panel.hidden = false;
  if (kept) restoreView(panel, kept);                     // before the chart, which fills the table view
  renderContext(detail);                                  // after unhiding, so the chart can measure its width
  if (kept) restoreFocusAndScroll(panel, kept);
  scheduleGaugeRefresh(detail);
}

// the conversation in the Tools table's place while its transcript exists, the tools at the end then; without it
// the conversation, which can only say it is gone, stays last
function toolsAndChat(transcript, tools, chat) {
  return transcript ? [chat, tools] : [tools, chat];
}

// What a refresh keeps: the conversation's nodes as they are (moved into the new view, so a loaded conversation
// and its picker stay), the table view and the folds open (workflow runs, tool details), focus, and the element at
// the top of the window
function keptView(panel) {
  const active = panel.contains(document.activeElement) ? document.activeElement : null;
  const anchor = scrollAnchor([...panel.children]);
  return {
    chat: [document.getElementById("chat-section")],
    table: !document.getElementById("context-table").hidden,
    folds: new Set([...panel.querySelectorAll("[data-fold][aria-expanded='true']")].map(node => node.dataset.fold)),
    active,
    activeId: active && active.id,
    activeFold: active && active.dataset.fold,
    activeIndex: active ? [...panel.querySelectorAll(FOCUSABLE)].indexOf(active) : -1,
    anchor,
    anchorIndex: anchor ? [...panel.children].indexOf(anchor.node) : -1,
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
  const anchored = kept.anchor && kept.anchor.node.isConnected ? kept.anchor.node : panel.children[kept.anchorIndex];
  keepScroll(kept.anchor, anchored);
  if (!kept.active) return;
  const target = kept.active.isConnected ? kept.active
    : (kept.activeId && document.getElementById(kept.activeId))
      || (kept.activeFold && panel.querySelector(`[data-fold="${CSS.escape(kept.activeFold)}"]`))
      || panel.querySelectorAll(FOCUSABLE)[kept.activeIndex] || document.getElementById("drilldown-title");
  target.focus({preventScroll: true});
}

// one row per transcript; a workflow run's agents under one row per run, whose button shows or hides them
// what a Bash command does, by its programs (tool_kinds.command_class), never by its language; which programs is
// the fold under it
const TOOL_KINDS = {
  search: "search", view: "view", list: "list", edit_in_place: "edit in place", write_file: "write a file",
  inline_script: "inline script", git: "git", run: "run a program",
};

// The Tools table's rows, agent by agent: from the transcript (tool_kinds) each tool with its sizes and costs, Bash
// followed by a sub-row per command kind, each kind by one per detail (its programs), which share the kind's fold;
// once the transcript is gone the stored calls and characters, the rest unknown (null)
function toolTableRows(agents) {
  return agents.flatMap(agent => agent.tool_kinds
    ? agent.tool_kinds.map(row => ({...row, agent: agent.agent_type, sub: row.kind !== null || row.detail !== null,
                                    fold: `tools:${agent.agent_id ?? ""}:${row.tool}:${row.kind ?? ""}`}))
    : agent.tools.map(tool => ({agent: agent.agent_type, tool: tool.tool, kind: null, detail: null, fold: null,
                                sub: false, calls: tool.calls, errors: null, result_chars: tool.result_chars,
                                result_median: null, result_p90: null, input_median: null, calls_after_median: null,
                                carried: null, input_cost: null})));
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
  const folds = new Map();                                // a row's name and its details' rows
  const body = rows.map((row, index) => {
    const name = row.detail !== null ? el("span", {class: "tool-detail", text: row.detail || "(none)"})
      : row.sub ? el("span", {class: "tool-kind", text: TOOL_KINDS[row.kind] || row.kind})
        : el("span", {text: row.tool});
    const tr = el("tr", {class: row.sub ? "sub-row" : rows[index + 1]?.sub ? "group-row" : null},
      el("td", {text: row.sub ? "" : row.agent}), el("td", {}, name),
      el("td", {class: "num", text: whole(row.calls)}), el("td", {class: "num", text: whole(row.errors)}),
      el("td", {class: "num", text: compact(row.result_chars)}),
      el("td", {class: "num", text: compact(row.result_median)}),
      el("td", {class: "num", text: compact(row.result_p90)}),
      el("td", {class: "num", text: compact(row.input_median)}),
      el("td", {class: "num", text: whole(row.calls_after_median)}),
      el("td", {class: "num", text: money(row.carried)}), el("td", {class: "num", text: money(row.input_cost)}));
    if (row.detail !== null) folds.get(row.fold).members.push(tr);
    else if (row.fold) folds.set(row.fold, {row, name, members: []});
    return tr;
  });
  for (const [fold, {row, name, members}] of folds) {
    if (!members.length) continue;
    const count = `${whole(members.length)} ${detailNoun(row, members.length)}`;
    name.append(" (", foldToggle(fold, members, count), ")");
  }
  return el("table", {}, el("thead", {}, head), el("tbody", {}, ...body));
}

// what a row's details are, for the count on its fold
function detailNoun(row, count) {
  const nouns = {inline_script: ["interpreter", "interpreters"], git: ["subcommand", "subcommands"]};
  const [one, many] = nouns[row.kind] || ["program", "programs"];
  return count === 1 ? one : many;
}

// A button that shows or hides these rows, hidden until then; a refresh opens it again by its data-fold
function foldToggle(fold, members, text) {
  for (const row of members) row.hidden = true;
  const toggle = el("button", {type: "button", class: "link-button", "aria-expanded": "false", "data-fold": fold,
                               text});
  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") !== "true";
    toggle.setAttribute("aria-expanded", String(open));
    for (const row of members) row.hidden = !open;
  });
  return toggle;
}

// how the costs are estimated, while a transcript tells them
function toolsNote(agents) {
  if (!agents.some(agent => agent.tool_kinds && agent.tool_kinds.length)) return null;
  return el("div", {class: "note", text: "Bash splits by what a command does. A call's input and result stay in " +
    "the context, so every later call up to the next compaction reads them again: ~Carried estimates what that " +
    "cost, taking a token as 2.3 characters (measured on real transcripts, a heuristic)."});
}

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
  const toggle = foldToggle(agents[0].workflow_run, members, `${whole(agents.length)} agents`);
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

// whether the session view calls for compacting: "cold" once a live session's cache has expired and compacting
// first saves at once, else "threshold" where the context is at or past the configured hint, else null. A warm cache
// below the hint gets no call: replayed on the stored sessions, it added next to nothing (todo 11.3)
function compactCallKind(detail, now) {
  const current = detail.live ? detail.current : null;
  const preview = current ? current.compact_now : null;
  if (!preview) return null;
  // past the hint the call comes whatever the savings: how many replies still follow can't be predicted
  const fallback = current.context >= current.hint_tokens ? "threshold" : null;
  const estimate = preview.estimate;
  const until = preview.cache_warm_until;
  if (estimate && until !== null && Date.parse(until) < Date.parse(now) && estimate.cold_saving !== null &&
      estimate.cold_saving >= 0) {
    return "cold";
  }
  return fallback;
}

// the call to compact above the gauge, in plain words, with a button that copies /compact
function compactCall(detail) {
  const now = new Date().toISOString();
  const kind = compactCallKind(detail, now);
  if (!kind) return null;
  const preview = detail.current.compact_now;
  const estimate = preview.estimate;
  const expired = preview.cache_warm_until !== null && Date.parse(preview.cache_warm_until) < Date.parse(now);
  const lines = kind === "threshold" ? thresholdCallLines(detail.current, expired)
    : [`The cache has expired, so the next reply sends your whole conversation (${compact(preview.before)}) again ` +
       `at the full price. Compacting would shrink it to about ${compact(estimate.after)}. Doing it now saves ` +
       `about ${money(estimate.cold_saving)} at once.`];
  if (kind === "threshold" && !expired && estimate && estimate.before_break !== null && estimate.before_break > 0 &&
      preview.cache_warm_until !== null) {
    lines.push(`Taking a break past ${when(preview.cache_warm_until)}? Compact before it: the cache expires ` +
               `then, and compacting first saves about ${money(estimate.before_break)} at the next reply.`);
  }
  if (kind === "threshold") {
    lines.push("How many replies still follow can't be predicted, so past your own threshold ([chat] " +
               "compact_hint_tokens) this shows whatever the estimate says.");
  }
  const status = el("span", {class: "compact-call-status", role: "status"});
  const button = el("button", {type: "button", id: "compact-copy", text: "Copy /compact"});
  button.addEventListener("click", () => copyCompact(status));
  return el("div", {class: "card compact-call", id: "compact-call", role: "region",
                    "aria-labelledby": "compact-call-title"},
    el("strong", {id: "compact-call-title", text: kind === "threshold"
      ? `⚠ Your context is past your ${compact(detail.current.hint_tokens)} compact hint`
      : "⚠ The cache has expired: compacting now saves money"}),
    ...lines.map(line => el("p", {text: line})),
    el("div", {class: "compact-call-actions"}, button, status));
}

// whether the session view suggests delegating exploration: a live session whose main thread has read, searched
// and listed at least delegate_hint_tokens since its last compaction, with at least delegate_calls_ahead calls
// ahead on average (the compaction estimate's calls_ahead)
function delegateCallShown(detail) {
  const current = detail.live ? detail.current : null;
  const exploration = current ? current.exploration : null;
  const estimate = current && current.compact_now ? current.compact_now.estimate : null;
  if (!exploration || !estimate || estimate.calls_ahead === null || estimate.calls_ahead === undefined) return false;
  return exploration.tokens >= detail.delegate_hint_tokens && estimate.calls_ahead >= detail.delegate_calls_ahead;
}

// the hint to delegate exploration, above the gauge, in plain words; a heuristic, so it says so
function delegateCall(detail) {
  if (!delegateCallShown(detail)) return null;
  const exploration = detail.current.exploration;
  const estimate = detail.current.compact_now.estimate;
  const ahead = whole(Math.round(estimate.calls_ahead));
  return el("div", {class: "card delegate-call", id: "delegate-call", role: "region",
                    "aria-labelledby": "delegate-call-title"},
    el("strong", {id: "delegate-call-title", text: "Explore in a subagent"}),
    el("p", {text: `Since the last compaction the main thread has read, searched and listed ` +
                   `${compact(exploration.tokens)} tokens in ${whole(exploration.calls)} calls. They stay in the ` +
                   `context: every reply reads them again, ~${money(exploration.reread)} each and ` +
                   `~${money(exploration.carried)} so far.`}),
    el("p", {text: (estimate.ahead_from === "longer"
      ? `After your past compactions, a stretch this long went on for about ${ahead} more replies on average. `
      : `After your past compactions you went on for about ${ahead} replies on average. `) +
      "A subagent (such as Explore) reads in its own context and hands back only its summary, so the next search " +
      "costs less delegated."}),
    el("p", {class: "muted", text: "A heuristic ([chat] delegate_hint_tokens and delegate_calls_ahead): replayed " +
      "on real sessions, delegating was cheaper in 52 of 53 cases with 60 to 150 calls ahead, and about even with " +
      "20 to 60."}));
}

// the call past the hint, which claims no saving: what each reply re-reads, and what compacting would cost and when
// it would pay off where past compactions give an estimate
function thresholdCallLines(current, expired) {
  const preview = current.compact_now;
  const estimate = preview.estimate;
  const lines = [expired
    ? `The cache has expired, so the next reply sends your whole conversation (${compact(preview.before)}) again ` +
      "at the full price."
    : `Every reply sends your whole conversation again: ${compact(preview.before)}, ` +
      `~${money(preview.reread_cost)} each time from the cache.`];
  if (estimate) {
    lines.push(`Compacting would shrink it to about ${compact(estimate.after)}` +
               (expired ? ` and ${payoffText(estimate, true)}.`
                        : `. That costs ~${money(estimate.one_time)} once and ${payoffText(estimate, false)}.`));
  }
  return lines;
}

// copies /compact for pasting into Claude Code; where the clipboard is refused, shows it selected to copy by hand
function copyCompact(status) {
  const fallback = () => {
    const field = el("input", {type: "text", readonly: true, value: "/compact", "aria-label": "The command to copy",
                               class: "compact-call-field"});
    status.replaceChildren("Copy it from here: ", field);
    field.select();
  };
  if (!navigator.clipboard) {
    fallback();
    return;
  }
  navigator.clipboard.writeText("/compact").then(
    () => { status.textContent = "Copied: paste it into Claude Code."; }, fallback);
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
    : expired ? `The cache has likely expired (${when(until)}): the next reply sends it all at the full price, ` +
                `${money(preview.keep_across_break)} more.`
    : `The cache stays warm until ${when(until)} (${preview.cache_ttl_minutes} min after the last request); ` +
      `after that, the next reply costs ${money(preview.keep_across_break)} more.`;
  const reread = `Every reply sends the whole conversation again: ${compact(preview.before)}, ` +
                 `${money(preview.reread_cost)} each time from the cache.`;
  const exact = el("div", {class: "note", text: [reread, cache].filter(Boolean).join(" ")});
  const estimate = preview.estimate;
  if (!estimate) {
    const stored = preview.stored_compactions;
    const why = stored ? `your ${whole(stored)} stored ${stored === 1 ? "compaction carries" : "compactions carry"} ` +
                         "no duration or output speed to estimate the summary from"
                       : "no stored compaction to learn from yet";
    return [exact, el("div", {class: "note", text: `No estimate of compacting now: ${why}.`})];
  }
  const count = `${whole(estimate.compactions)} stored ${estimate.compactions === 1 ? "compaction" : "compactions"}`;
  const parts = [`If you compacted now, it would shrink to about ${compact(estimate.after)}` +
                 `${spread(compact(estimate.after_low), compact(estimate.after_high))}.`,
                 expired ? `Compacting ${payoffText(estimate, expired)}.`
                         : `That costs ~${money(estimate.one_time)} once and ${payoffText(estimate, expired)}.`];
  const low = whole(estimate.calls_after_low);
  const high = whole(estimate.calls_after_high);
  const followed = estimate.calls_after_low === null ? ""
    : `, which were followed by ${low === high ? low : `${low}–${high}`} replies until the next one`;
  parts.push(`Learnt from your ${count}${followed}.`);
  if (estimate.before_break !== null && !expired && until !== null) {
    parts.push(`Compacting before a break past ${when(until)} saves about ${money(estimate.before_break)} at once.`);
  }
  return [exact, el("div", {class: "note", text: parts.join(" ")})];
}

// when compacting now pays off: warm against the next calls' reads; once the cache has expired, cold against
// keeping's rewrite of everything
function payoffText(estimate, expired) {
  if (expired) {
    if (estimate.breakeven_cold === null) return "would never pay off: the context is below what compacting leaves";
    return estimate.cold_saving >= 0
      ? `pays off at once (about ${money(estimate.cold_saving)}), since the next reply sends it all anyway`
      : `would pay off after about ${whole(estimate.breakeven_cold)} replies`;
  }
  const calls = value => (value === null ? "never" : whole(value));
  if (estimate.breakeven_calls !== null) {
    return `would pay off after about ${whole(estimate.breakeven_calls)} replies` +
           spread(calls(estimate.breakeven_low), calls(estimate.breakeven_high));
  }
  return estimate.breakeven_low === null
    ? "would never pay off: the context is below what compacting leaves"
    : `would likely not pay off (at best after about ${whole(estimate.breakeven_low)} replies)`;
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
    if (!gauge || state.session !== detail) return;
    gauge.replaceWith(currentGauge(detail.current));
    // the call to compact turns with the cache too: shown, gone or reworded
    const call = compactCall(detail);
    const shown = document.getElementById("compact-call");
    if (shown) shown.remove();
    if (call) document.getElementById("current-gauge").before(call);
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

// what this transcript's compactions saved against keeping the context, summed like turns.savings_total: forced
// ones left out, those without a summary estimate counted but not summed; null without one to count
function compactionTotal(compactions) {
  const counted = compactions.map(row => row.versus_keeping)
    .filter(comparison => comparison && comparison.verdict !== "forced");
  if (!counted.length) return null;
  const nets = counted.map(comparison => comparison.net).filter(net => net !== null);
  const net = nets.reduce((sum, value) => sum + value, 0);
  return {net, compactions: nets.length, unknown: counted.length - nets.length};
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
