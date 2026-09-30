// The day selector and the live sessions.
"use strict";

// --- figures -------------------------------------------------------------------------------------------------

// The KPI and runtime tiles are components (web/src/components/KpiTiles.svelte, RuntimeTiles.svelte), drawn from
// `payload` (web/src/lib/payload.svelte.ts) in the overview, and mounted by mountSessionKpis and mountSessionRuntime
// (web/src/lib/overview.svelte.ts) in a session's view

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
  loadRange();
}

function renderDayNav() {
  const shown = shownDay();
  document.getElementById("day-nav").hidden = state.days !== 1;
  document.getElementById("day-label").textContent = state.day === null ? "Today" : longDay(state.day);
  document.getElementById("day-prev").disabled = !shown || !shown.previous_day;
  document.getElementById("day-next").disabled = !shown || !shown.next_day;
}

// --- live ----------------------------------------------------------------------------------------------------

// The day the live sessions were kept by, when the arrows went back to it: a running session shows there only if
// it was active on it. Null for a range up to today, or none.
function livePastDay(live, today) {
  return live.days === 1 && live.until !== today ? live.until : null;
}

function renderLive(live) {
  const pastDay = livePastDay(live, dayText(new Date()));
  const waits = live.sessions.some(session => session.waiting);
  const agents = live.agent_minutes > live.minutes ? ` (${live.agent_minutes} min while agents work)` : "";
  document.getElementById("live-window").textContent = `· changed in the last ${live.minutes} min${agents}` +
    `${waits ? " or waiting for you" : ""}${pastDay ? `, active on ${longDay(pastDay)}` : ""}`;
  const container = document.getElementById("live");
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
      el("div", {class: "live-head"},
         el("div", {class: "title"}, el("span", {class: "dot", "aria-hidden": "true"}), sessionLink(session)),
         session.waiting ? liveBadge(liveWaitBadge(session.waiting)) : null,
         showLiveState(el("div", {class: "live-states", "data-live-state": session.session_id}),
                       liveStates.get(session.session_id))),
      el("div", {class: "muted"}, `${session.project}${session.git_branch ? " · " + session.git_branch : ""} · `,
         agoSpan(session.last_activity)),
      el("div", {class: "numbers"}, number("Turns", whole(session.turns)), number("Output", compact(session.output)),
         number("Last context", compact(session.last_context)), number("Cost", money(session.cost))),
      agents);
  });
  // the hook's socket couldn't be opened: Claude Code still asks, only no padlock shows it
  const prompts = live.prompts_unavailable
    ? [el("div", {class: "note", text: `Permission prompts can't show here: ${live.prompts_unavailable}.`})] : [];
  // serve found no notifier, or it failed; switched off in the config, they say nothing
  const notices = live.notifications_unavailable
    ? [el("div", {class: "note", text: `Desktop notifications can't show: ${live.notifications_unavailable}.`})]
    : [];
  // paged even when none is live, so a pager left from a longer list goes
  container.replaceChildren(...prompts, ...notices, paged("live", live.sessions.length
    ? el("div", {class: "live-grid paged-cards"}, ...cards)
    : el("div", {class: "empty", text: pastDay ? `No live session was active on ${longDay(pastDay)}.`
                                               : `No session active in the last ${live.minutes} minutes.`}),
    "sessions"));
}

// A live card's state (/api/session/<id>/state, loaded after the list: loadLiveStates) as icons in its slot, which it
// returns, each colored by its tone and described on hover; drawn again only where they changed, which a cache that
// expired since also does
function showLiveState(slot, sessionState) {
  const badges = sessionState ? liveStateBadges(sessionState, new Date().toISOString()) : [];
  const key = JSON.stringify(badges);
  if (slot.dataset.shown === key) return slot;
  slot.dataset.shown = key;
  slot.replaceChildren(...badges.map(liveBadge));
  return slot;
}

// a badge as its icon, colored by its tone and described on hover and to screen readers
function liveBadge(badge) {
  return el("span", {class: `live-icon live-icon-${badge.kind}${badge.tone ? ` live-icon-${badge.tone}` : ""}`,
                     role: "img", "aria-label": badge.text, title: badge.text}, liveIcon(badge.kind));
}

// The icons, drawn in currentColor on a 24-unit grid: an agent in a black hat and dark glasses for a possible secret
// access, a trash compactor pressing down on its bin for compacting, a speech bubble with a question mark for a
// session waiting for the user's answer, a padlock for one waiting for a permission
const LIVE_ICONS = {
  permission: [
    ["path", {d: "M8 10.5V7.8a4 4 0 0 1 8 0v2.7", fill: "none", stroke: "currentColor", "stroke-width": "1.6",
              "stroke-linecap": "round"}],
    ["rect", {x: "4.8", y: "10.5", width: "14.4", height: "10", rx: "2", fill: "none", stroke: "currentColor",
              "stroke-width": "1.6"}],
    ["circle", {cx: "12", cy: "14.6", r: "1.4", fill: "currentColor"}],
    ["path", {d: "M12 15.4v2.4", fill: "none", stroke: "currentColor", "stroke-width": "1.6",
              "stroke-linecap": "round"}],
  ],
  waiting: [
    ["path", {d: "M5 3.5h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-8.2L6 20.5v-4H5a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2z",
              fill: "none", stroke: "currentColor", "stroke-width": "1.6", "stroke-linejoin": "round"}],
    ["path", {d: "M9.7 8.2a2.3 2.3 0 1 1 3.3 2.1c-.6.3-1 .8-1 1.5v.3", fill: "none", stroke: "currentColor",
              "stroke-width": "1.6", "stroke-linecap": "round"}],
    ["circle", {cx: "12", cy: "14.4", r: "1", fill: "currentColor"}],
  ],
  secret: [
    ["path", {d: "M7.2 9.6 8.6 4.4c.2-.8 1-1.2 1.8-1l1.6.4 1.6-.4c.8-.2 1.6.2 1.8 1l1.4 5.2z", fill: "currentColor"}],
    ["path", {d: "M2.8 10.4c0-.7 4.1-1.2 9.2-1.2s9.2.5 9.2 1.2-4.1 1.4-9.2 1.4-9.2-.7-9.2-1.4z",
              fill: "currentColor"}],
    ["rect", {x: "6.2", y: "13", width: "4.8", height: "3", rx: "1.3", fill: "currentColor"}],
    ["rect", {x: "13", y: "13", width: "4.8", height: "3", rx: "1.3", fill: "currentColor"}],
    ["path", {d: "M11 14h2", fill: "none", stroke: "currentColor", "stroke-width": "1.4"}],
    // the coat, its collar a notch
    ["path", {d: "M4 22.8c.5-2.9 3.6-4.6 8-4.6s7.5 1.7 8 4.6zM10.4 18.4l1.6 2.8 1.6-2.8z", fill: "currentColor",
              "fill-rule": "evenodd"}],
  ],
  compact: [
    ["rect", {x: "3.5", y: "2.5", width: "17", height: "19", rx: "2", fill: "none", stroke: "currentColor",
              "stroke-width": "1.6"}],
    ["path", {d: "M12 2.5v5.3M9.5 11.6l2.5 1.6 2.5-1.6", fill: "none", stroke: "currentColor", "stroke-width": "1.5",
              "stroke-linecap": "round", "stroke-linejoin": "round"}],
    ["rect", {x: "6", y: "7.8", width: "12", height: "2.3", rx: "0.6", fill: "currentColor"}],
    // what it crushed, jagged on top
    ["path", {d: "M6 19h12v-4.2l-2 1.3-2-1.3-2 1.3-2-1.3-2 1.3-2-1.3z", fill: "currentColor"}],
  ],
};

// a badge's icon, hidden from screen readers: the badge's label says it
function liveIcon(kind) {
  const icon = svg("svg", {viewBox: "0 0 24 24", "aria-hidden": "true", focusable: "false"});
  for (const [tag, attributes] of LIVE_ICONS[kind]) icon.append(svg(tag, attributes));
  return icon;
}

