// The KPI tiles, the day selector, and the live sessions.
"use strict";

// --- figures -------------------------------------------------------------------------------------------------

function renderKpis(summary) {
  document.getElementById("kpis").replaceChildren(...kpiTiles(summary.totals, rangeText(summary), summary.context,
                                                              summary.compact_hint_tokens));
}

// The cost, input, turns and output tiles of a usage total: the range's on the page, a session's in its view.
// context is the median and p90 context per main-thread turn, shown with the compact hint's threshold.
function kpiTiles(totals, scope, context, hintTokens) {
  const parts = totals.cost_parts;
  const tile = (label, value, note) => el("div", {class: "card"},
    themed("div", label, {class: "label"}), el("div", {class: "tile-value", text: value}), note);
  const notes = [totals.unpriced_turns ? `${whole(totals.unpriced_turns)} turns of models without a price are not included`
                                       : "at API list prices"];
  if (totals.web_searches) notes.push(`incl. ${whole(totals.web_searches)} web searches, ${money(parts.web_search)}`);
  return [
    el("div", {class: "card"},
       el("div", {class: "label"}, themed("span", "Estimated cost"), `, ${scope}`),
       el("div", {class: "hero", text: money(totals.cost)}),
       el("div", {class: "note", text: notes.join(" · ")})),
    inputSplit(totals, parts, context, hintTokens),
    tile("Turns", whole(totals.turns), themed("div", "API calls with usage", {class: "note"})),
    tile("Output tokens", compact(totals.output), el("div", {class: "note", text: money(parts.output)}))];
}

function renderRuntime(summary) {
  const runtime = summary.runtime;
  const from = `${whole(runtime.sessions)} ${runtime.sessions === 1 ? "session" : "sessions"} that ended in the range`;
  document.getElementById("runtime").replaceChildren(...runtimeTiles(runtime, from, runtime.cost_per_100_lines));
}

// Time and lines changed from Claude Code's cost records, of the sessions that ended in the range or of one
// session. Four separate measures (the API and tool times overlap the wall-clock time and each other), so stat
// tiles, not a chart. costPer100Lines is null without lines changed or a price. A session's totals estimated from
// its transcripts (source "transcripts") don't show the retries, and their tool time runs from each call to its
// result, so it includes waiting for permission.
function runtimeTiles(runtime, from, costPer100Lines) {
  const estimated = runtime.source === "transcripts";
  const tile = (label, value, note) => el("div", {class: "card"},
    themed("div", label, {class: "label"}), el("div", {class: "tile-value", text: value}),
    el("div", {class: "note", text: note}));
  const retries = runtime.api_ms_without_retries === null ? null : runtime.api_ms - runtime.api_ms_without_retries;
  const retryNote = retries === null ? "retries are not in the transcripts"
                                     : retries > 0 ? `${duration(retries)} of it retries` : "no time lost to retries";
  const perLines = costPer100Lines === null ? "no lines changed" : `${money(costPer100Lines)} per 100 lines changed`;
  return [
    tile("Session time", duration(runtime.duration_ms), `wall-clock, ${from}`),
    tile("Waiting on the API", duration(runtime.api_ms), retryNote),
    tile("Running tools", duration(runtime.tool_ms),
         estimated ? "from each call to its result, incl. waiting for permission"
                   : `${percent(runtime.tool_ms, runtime.duration_ms)} of the session time`),
    tile("Lines changed", `+${whole(runtime.lines_added)} / −${whole(runtime.lines_removed)}`, perLines)];
}

// Input tokens as processed (new input + cache writes, full price or more) vs. from cache (cache reads, 0.1x): two
// parts of one whole, so two steps of one hue rather than two categorical colors. A compact tile in the KPI row.
function inputSplit(totals, parts, context, hintTokens) {
  const input = inputTotal(totals);
  const segments = [
    {label: "Processed", tokens: totals.new_input + totals.cache_write, cost: parts.new_input + parts.cache_write,
     color: "var(--split-strong)",
     note: `New input ${compact(totals.new_input)} + cache writes ${compact(totals.cache_write)}, billed at full price or more`},
    {label: "From cache", tokens: totals.cache_read, cost: parts.cache_read, color: "var(--split-soft)",
     note: "Cache reads, billed at a tenth of the input price and not processed again"},
  ];
  const bar = el("div", {class: "split", role: "img",
                         "aria-label": segments.map(part => `${part.label} ${percent(part.tokens, input)}`).join(", ")},
    ...segments.filter(part => part.tokens > 0).map(part =>
      el("span", {style: `flex-grow:${part.tokens};background:${part.color}`})));
  const rows = segments.map(part => el("div", {class: "split-row", title: part.note},
    el("span", {class: "swatch", style: `background:${part.color}`}),
    themed("span", part.label),
    el("strong", {class: "split-number", text: compact(part.tokens)}),
    el("span", {class: "split-number secondary", text: percent(part.tokens, input)}),
    el("span", {class: "split-number", text: money(part.cost)})));
  // what a compact hint threshold can be chosen by: the context each main-thread turn read
  const contextNote = context && context.turns
    ? el("div", {class: "note", title: "The context a main-thread turn reads: new input, cache writes and reads. " +
                 "The conversation hints at compacting from the threshold on ([chat] compact_hint_tokens)."},
         `median context ${compact(context.median)} per turn (p90 ${compact(context.p90)})` +
         (hintTokens ? ` · compact hint at ${compact(hintTokens)}` : ""))
    : null;
  return el("div", {class: "card"}, themed("div", "Input tokens", {class: "label"}),
            el("div", {class: "tile-value", text: compact(input)}), bar, ...rows, contextNote);
}

// the range the summary covers, from the summary itself: the controls may already ask for another one
function rangeText(summary) {
  // a young store, or one with a retention, starts after the range does
  const since = summary.history_since;
  const history = since && since > summary.since ? ` (history since ${shortDay(since)})` : "";
  if (summary.days !== 1) return `last ${summary.days} days${history}`;
  return summary.until === dayText(new Date()) ? "today" : longDay(summary.until);
}

// The summary of the shown day, which names the nearest days with usage; null while another day is loading
function shownDay() {
  const summary = state.summary;
  const day = state.day || dayText(new Date());
  return summary && summary.days === 1 && summary.until === day ? summary : null;
}

// the arrows skip days without usage: they go to the nearest day that has some, or back to today
function stepDay(name) {
  const shown = shownDay();
  if (!shown || !shown[name]) return;
  state.day = shown[name] === dayText(new Date()) ? null : shown[name];
  renderDayNav();
  loadSummary();
}

function renderDayNav() {
  const shown = shownDay();
  document.getElementById("day-nav").hidden = state.days !== 1;
  document.getElementById("day-label").textContent = state.day === null ? "Today" : longDay(state.day);
  document.getElementById("day-prev").disabled = !shown || !shown.previous_day;
  document.getElementById("day-next").disabled = !shown || !shown.next_day;
}

// --- live ----------------------------------------------------------------------------------------------------

function renderLive(live) {
  document.getElementById("live-window").textContent = `· changed in the last ${live.minutes} min`;
  const container = document.getElementById("live");
  if (!live.sessions.length) {
    container.replaceChildren(el("div", {class: "empty", text: `No session active in the last ${live.minutes} minutes.`}));
    return;
  }
  const cards = live.sessions.map(session => {
    const number = (label, value) => el("div", {}, el("span", {class: "label", text: label}),
                                        el("strong", {text: value}));
    const agents = session.subagents.length
      ? el("ul", {}, ...session.subagents.map(agent => el("li", {},
          el("strong", {text: agent.agent_type}), " ",
          el("span", {class: "secondary", text: agent.description || ""}),
          el("span", {class: "sub muted"},
             `${agent.model || "–"} · ${whole(agent.turns)} turns · context ${compact(agent.last_context)} · `,
             agoSpan(agent.last_activity)))))
      : el("div", {class: "note", text: "No subagent running"});
    return el("div", {class: "live-card"},
      el("div", {class: "title"}, el("span", {class: "dot", "aria-hidden": "true"}), sessionLink(session)),
      el("div", {class: "muted"}, `${session.project}${session.git_branch ? " · " + session.git_branch : ""} · `,
         agoSpan(session.last_activity)),
      el("div", {class: "numbers"}, number("Turns", whole(session.turns)), number("Output", compact(session.output)),
         number("Last context", compact(session.last_context)), number("Cost", money(session.cost))),
      agents);
  });
  container.replaceChildren(el("div", {class: "live-grid"}, ...cards));
}
