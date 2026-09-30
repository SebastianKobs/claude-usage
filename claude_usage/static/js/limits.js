// The failed API calls as a table, which the session view still draws here until it moves to the bundle. The
// rate-limits section of the overview (chart, windows, latest errors) is web/src/components/RateLimits.svelte.
"use strict";
// limitType, errorText and when come from the bundle (web/src/lib/charts.ts, format.ts)

// failed API calls as a table; withSession adds the session column (the session view leaves it out)
function limitEventsTable(events, emptyText, withSession) {
  if (!events.length) return el("div", {class: "empty", text: emptyText});
  const head = el("tr", {}, el("th", {text: "When"}), el("th", {text: "Error"}), el("th", {text: "Quota"}),
                  el("th", {text: "Resets"}), withSession ? el("th", {text: "Session"}) : null,
                  el("th", {text: "Agent"}));
  const rows = events.map(event => el("tr", {},
    el("td", {class: "num", text: when(event.ts)}), el("td", {text: errorText(event)}),
    el("td", {text: limitType(event.limit_type)}), el("td", {class: "num", text: when(event.resets_at)}),
    withSession ? el("td", {}, sessionLink(event), el("span", {class: "sub", text: event.project})) : null,
    el("td", {text: event.agent_type})));
  return el("table", {}, el("thead", {}, head), el("tbody", {}, ...rows));
}
