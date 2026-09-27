// The KPI tiles, the day selector, and the live sessions.
"use strict";

// --- figures -------------------------------------------------------------------------------------------------

function renderKpis(summary) {
  const totals = summary.totals;
  const parts = totals.cost_parts;
  const tile = (label, value, note) => el("div", {class: "card"},
    el("div", {class: "label", text: label}), el("div", {class: "tile-value", text: value}),
    note ? el("div", {class: "note", text: note}) : null);
  const notes = [totals.unpriced_turns ? `${whole(totals.unpriced_turns)} turns of models without a price are not included`
                                       : "at API list prices"];
  if (totals.web_searches) notes.push(`incl. ${whole(totals.web_searches)} web searches, ${money(parts.web_search)}`);
  document.getElementById("kpis").replaceChildren(
    el("div", {class: "card hero-card"},
       el("div", {class: "label", text: `${hype("Estimated cost")}, ${rangeText()}`}),
       el("div", {class: "hero", text: money(totals.cost)}),
       el("div", {class: "note", text: notes.join(" · ")})),
    inputSplit(totals, parts),
    tile(hype("Turns"), whole(totals.turns), hype("API calls with usage")),
    tile(hype("Output tokens"), compact(totals.output), `${money(parts.output)}`));
}

// Input tokens as processed (new input + cache writes, full price or more) vs. from cache (cache reads, 0.1x): two
// parts of one whole, so two steps of one hue rather than two categorical colors. A compact tile in the KPI row.
function inputSplit(totals, parts) {
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
    el("span", {class: "split-label", text: hype(part.label)}),
    el("strong", {class: "split-number", text: compact(part.tokens)}),
    el("span", {class: "split-number secondary", text: percent(part.tokens, input)}),
    el("span", {class: "split-number", text: money(part.cost)})));
  return el("div", {class: "card"}, el("div", {class: "label", text: hype("Input tokens")}),
            el("div", {class: "tile-value", text: compact(input)}), bar, ...rows);
}

function rangeText() {
  if (state.days !== 1) return `last ${state.days} days`;
  return state.day === null ? "today" : longDay(state.day);
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
          el("span", {class: "sub muted", text: `${agent.model || "–"} · ${whole(agent.turns)} turns · context ${compact(agent.last_context)} · ${ago(agent.last_activity)}`}))))
      : el("div", {class: "note", text: "No subagent running"});
    return el("div", {class: "live-card"},
      el("div", {class: "title"}, el("span", {class: "dot", "aria-hidden": "true"}), sessionLink(session)),
      el("div", {class: "muted", text: `${session.project}${session.git_branch ? " · " + session.git_branch : ""} · ${ago(session.last_activity)}`}),
      el("div", {class: "numbers"}, number("Turns", whole(session.turns)), number("Output", compact(session.output)),
         number("Last context", compact(session.last_context)), number("Cost", money(session.cost))),
      agents);
  });
  container.replaceChildren(el("div", {class: "live-grid"}, ...cards));
}
