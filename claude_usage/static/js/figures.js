// The KPI tiles, the day selector, and the live sessions.
"use strict";

// --- figures -------------------------------------------------------------------------------------------------

function renderKpis(summary) {
  document.getElementById("kpis").replaceChildren(...kpiTiles(summary.totals, rangeText(summary), summary.context,
                                                              summary.compact_hint_tokens,
                                                              summary.compaction_savings));
}

// The cost, input, turns and output tiles of a usage total: the range's on the page, a session's in its view.
// context is the median and p90 context per main-thread turn, shown with the compact hint's threshold; savings what
// the main threads' compactions saved so far against keeping the context.
function kpiTiles(totals, scope, context, hintTokens, savings) {
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
       el("div", {class: "note", text: notes.join(" · ")}), savingsNote(savings)),
    inputSplit(totals, parts, context, hintTokens),
    tile("Turns", whole(totals.turns), themed("div", "API calls with usage", {class: "note"})),
    tile("Output tokens", compact(totals.output), el("div", {class: "note", text: money(parts.output)}))];
}

// What compacting saved so far, as a gain or a loss (the sign and arrow carry it, like the compactions table), with
// how many compactions it sums; null without one
function savingsNote(savings) {
  if (!savings) return null;
  const count = savings.compactions === 1 ? "1 compaction" : `${whole(savings.compactions)} compactions`;
  const unknown = savings.unknown ? `${whole(savings.unknown)} without an estimate` : null;
  const title = "Each main-thread compaction against keeping its context, over its stretch up to the next one, " +
    "summed; a stretch not paid off yet as it stands, forced compactions left out. ~: the summary call is " +
    "estimated.";
  if (!savings.compactions) {
    return el("div", {class: "note", title, text: `Compacting: ${unknown}`});
  }
  const gain = savings.net >= 0;
  const amount = gain ? `▲ compacting saved ~${money(savings.net)} so far`
                      : `▼ compacting cost ~${money(-savings.net)} more so far`;
  // the count on a line of its own, so the amount reads at a glance
  return el("div", {class: "note", title},
            el("div", {class: gain ? "verdict-gain" : "verdict-loss", text: amount}),
            el("div", {text: `(${[count, unknown].filter(Boolean).join(", ")})`}));
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
  // paged even when none is live, so a pager left from a longer list goes
  container.replaceChildren(paged("live", live.sessions.length
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
// session waiting for the user's answer
const LIVE_ICONS = {
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

// a session waiting for the user's answer (waiting in /api/live: a question, or a plan to approve, without its
// result yet) as a badge in the waiting tone, which the card shows first; null while it waits for nothing
function liveWaitBadge(waiting) {
  if (!waiting) return null;
  const what = waiting.tool === "ExitPlanMode" ? "you to approve the plan" : "your answer";
  return {kind: "waiting", tone: "waiting", text: `Waiting for ${what} since ${when(waiting.since)}`};
}

// A live card's state as badges of a kind (secret, compact), a tone (a class suffix, or null) and the words its
// icon's hover shows: a possible secret access first, as in the session view, then compacting now
function liveStateBadges(sessionState, now) {
  return [liveSecretBadge(sessionState.secrets), liveCompactBadge(sessionState.current, now)].filter(Boolean);
}

// the session's calls that named a possible secret location, only from medium up (secretTone's warning and alert):
// one sent out makes it high, else one that returned a result or may still makes it medium; null below that
function liveSecretBadge(secrets) {
  const high = secrets.high || 0;
  const medium = secrets.medium || 0;
  if (!high && !medium) return null;
  const calls = count => (count === 1 ? "1 call" : `${whole(count)} calls`);
  const reached = high
    ? `${calls(high)} sent out${medium ? `, ${whole(medium)} more returned a result or may still` : ""}`
    : `${calls(medium)} returned a result or may still`;
  return {kind: "secret", tone: high ? "high" : "medium", text: `Possible secret access: ${reached}`};
}

// compacting now, in the tone and words of the session view's estimate (payoffTone, PAYOFF_WORDS): when it pays off
// against the replies still ahead on average, or what it saves at once where the call to compact says so
// (compactCallKind "cold"), and past the compact hint; null without a gauge, where it would never pay off or only
// once the context has grown (too early: nothing to do yet), or below the hint without an estimate
function liveCompactBadge(current, now) {
  const preview = current ? current.compact_now : null;
  if (!preview) return null;
  const hint = current.context >= current.hint_tokens ? `Past your ${compact(current.hint_tokens)} compact hint.`
                                                      : null;
  const estimate = preview.estimate;
  if (!estimate) return hint ? {kind: "compact", tone: null, text: hint} : null;
  const until = preview.cache_warm_until;
  const expired = until !== null && Date.parse(until) < Date.parse(now);
  const tone = payoffTone(estimate, expired);
  const badge = words => ({kind: "compact", tone, text: [words, hint].filter(Boolean).join(" ")});
  if (compactCallKind({live: true, current}, now) === "cold") {
    return badge(`Compacting now saves ~${money(estimate.cold_saving)} at once: the cache has expired.`);
  }
  if (tone === "later") return hint ? {kind: "compact", tone: null, text: hint} : null;
  const breakeven = expired ? estimate.breakeven_cold : estimate.breakeven_calls;
  if (breakeven === null) {
    if (expired || estimate.breakeven_low === null) return hint ? {kind: "compact", tone: null, text: hint} : null;
    return badge("Compacting now would likely not pay off.");
  }
  const replies = `pays off after ~${whole(breakeven)} replies`;
  if (!tone) return badge(`Compacting now ${replies}.`);
  return badge(`${PAYOFF_WORDS[tone]}: compacting now ${replies}, ` +
               `~${whole(Math.round(estimate.calls_ahead))} ahead on average.`);
}
