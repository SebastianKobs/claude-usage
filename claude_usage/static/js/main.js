// Loading the API, the controls, and the start of the page. Loaded last: it calls setup().
"use strict";

// --- loading -------------------------------------------------------------------------------------------------

// An unchanged payload isn't drawn again, which keeps focus and scroll position inside it. Today's date and hour
// count too: the charts run up to now.
function drawnKey(payload) {
  const now = new Date();
  return `${dayText(now)}T${now.getHours()} ${JSON.stringify(payload)}`;
}

// A note in a container that has nothing drawn yet: "Loading…", or why it failed
function placeholder(id, text) {
  document.getElementById(id).replaceChildren(el("div", {class: "empty", text}));
}

let summaryRequest = 0;
let summaryKey = null;
async function loadSummary() {
  const container = document.getElementById("summary");
  container.classList.add("loading");                      // keep the previous render, dimmed
  // stepping through days quickly overlaps requests: only the newest one may render
  const request = ++summaryRequest;
  const until = state.days === 1 && state.day !== null ? `&until=${state.day}` : "";
  try {
    const summary = await fetchJson(`/api/summary?days=${state.days}${until}`);
    if (request !== summaryRequest) return;
    showError("summary", "");
    showScanErrors(summary);
    applyRetention(summary);
    const key = drawnKey(summary);
    if (key !== summaryKey) {
      summaryKey = key;
      state.summary = summary;
      renderSummary();
    }
  } catch (error) {
    if (request !== summaryRequest) return;
    showError("summary", error.message);
    if (!state.summary) placeholder("kpis", "Could not load the summary.");
  } finally {
    if (request === summaryRequest) container.classList.remove("loading");
  }
}

function renderSummary() {
  const summary = state.summary;
  if (!summary) return;
  renderKpis(summary);
  renderRuntime(summary);
  renderDayNav();
  renderTrend(summary);
  renderChart(summary);
  renderTables(summary);
  renderLimits(summary);
  const scope = summary.project_filter ? `project ${summary.project_filter}` : "all projects";
  document.getElementById("scope").textContent = `· ${scope}`;
  document.getElementById("footer").textContent = "Estimated cost at Claude API list prices" +
    (summary.prices_checked ? ` (checked ${summary.prices_checked})` : "") +
    ". “(background)” is usage Claude Code counted but no transcript shows (e.g. Haiku for titles), taken from its " +
    "cost records when a session ends: it has no turns and is filed under the day the session ended." +
    (themeCopy().footer || "");
}

let liveKey = null;
async function loadLive() {
  try {
    const live = await fetchJson("/api/live");
    showError("live", "");
    showScanErrors(live);
    const key = JSON.stringify(live);
    if (key !== liveKey) {
      liveKey = key;
      renderLive(live);
    } else {
      refreshAgo();
    }
    document.getElementById("updated").textContent = `updated ${new Date().toLocaleTimeString()}`;
    return true;
  } catch (error) {
    showError("live", error.message);
    if (liveKey === null) placeholder("live", "Could not load the live sessions.");
    return false;
  }
}

// The next request goes out after the previous answer, so a slow server never gets two at once. A hidden tab asks
// nothing; showing it again asks at once. Timers are cleared before they are set, so two chains merge into one.
let liveTimer = null;
let summaryTimer = null;
async function pollLive() {
  const ok = await loadLive();
  // the server is back: the summary needn't wait for its next turn
  if (ok && errors.has("summary")) pollSummary();
  clearTimeout(liveTimer);
  if (!document.hidden) liveTimer = setTimeout(pollLive, LIVE_INTERVAL_MS);
}
async function pollSummary() {
  await loadSummary();
  clearTimeout(summaryTimer);
  if (!document.hidden) summaryTimer = setTimeout(pollSummary, SUMMARY_INTERVAL_MS);
}
function pollWhileVisible() {
  clearTimeout(liveTimer);
  clearTimeout(summaryTimer);
  if (document.hidden) return;
  pollLive();
  pollSummary();
}

// the server's session-id pattern: anything else isn't a session link
const SESSION_HASH = /^#session\/([A-Za-z0-9_-]{1,128})$/;
let sessionRequest = 0;
// the link that opened the session, and where the page was scrolled: closing the session returns to both
let opener = null;

async function loadSession() {
  const request = ++sessionRequest;                       // a late answer for a session left since doesn't render
  const match = location.hash.match(SESSION_HASH);
  if (!match) {
    showError("session", location.hash.startsWith("#session/") ? "Not a session link." : "");
    const wasOpen = state.session !== null;
    state.session = null;
    renderDrilldown(null);
    if (wasOpen) returnToOpener();
    return;
  }
  if (state.session === null && opener === null) {
    const active = document.activeElement;
    opener = {href: active && active.getAttribute("href"), element: active, scroll: window.scrollY};
  }
  try {
    const session = await fetchJson(`/api/session/${encodeURIComponent(match[1])}`);
    if (request !== sessionRequest) return;
    showError("session", "");
    state.session = session;
    renderDrilldown(session);
    document.getElementById("drilldown").scrollIntoView({block: "start"});
    document.getElementById("drilldown-title").focus({preventScroll: true});
  } catch (error) {
    if (request === sessionRequest) showError("session", error.message);
  }
}

function returnToOpener() {
  if (!opener) return;
  const {href, element, scroll} = opener;
  opener = null;
  window.scrollTo(0, scroll);
  // the summary may have been drawn again meanwhile: then the same link in the new render
  const target = element && element.isConnected ? element
               : href ? [...document.querySelectorAll("a[href]")].find(link => link.getAttribute("href") === href)
               : null;
  if (target) target.focus({preventScroll: true});
}

// --- controls ------------------------------------------------------------------------------------------------

// No range longer than the store keeps: those buttons hide, and a saved longer range (which the server cut to the
// retention) becomes the longest one kept
function applyRetention(summary) {
  const retention = summary.retention_days;
  for (const button of document.querySelectorAll("#range button[data-days]")) {
    button.hidden = Boolean(retention) && Number(button.dataset.days) > retention;
  }
  if (summary.days < state.days) {
    state.days = summary.days;
    savePreference("days", state.days);
    pressed("range", "days", state.days);
  }
}

function pressed(groupId, attribute, value) {
  for (const button of document.querySelectorAll(`#${groupId} button[data-${attribute}]`)) {
    button.setAttribute("aria-pressed", String(button.dataset[attribute] === String(value)));
  }
}

function savePreference(name, value) {
  try { localStorage.setItem(`claude-usage.${name}`, value); } catch (error) { /* storage unavailable */ }
}
function readPreference(name) {
  try { return localStorage.getItem(`claude-usage.${name}`); } catch (error) { return null; }
}

function setup() {
  const days = Number(readPreference("days"));
  if ([1, 7, 30, 90, 365].includes(days)) state.days = days;
  if (METRICS[readPreference("metric")]) state.metric = readPreference("metric");
  applyTheme(readPreference("theme"));
  pressed("range", "days", state.days);
  pressed("metric", "metric", state.metric);
  renderDayNav();

  document.getElementById("range").addEventListener("click", event => {
    const button = event.target.closest("button[data-days]");
    if (!button) return;
    state.days = Number(button.dataset.days);
    state.day = null;                                     // Daily starts at today again
    savePreference("days", state.days);
    pressed("range", "days", state.days);
    renderDayNav();
    loadSummary();
  });
  document.getElementById("day-prev").addEventListener("click", () => stepDay("previous_day"));
  document.getElementById("day-next").addEventListener("click", () => stepDay("next_day"));
  document.getElementById("metric").addEventListener("click", event => {
    const button = event.target.closest("button");
    if (!button) return;
    state.metric = button.dataset.metric;
    savePreference("metric", state.metric);
    pressed("metric", "metric", state.metric);
    if (state.summary) renderChart(state.summary);
  });
  for (const name of ["chart", "trend", "costly", "limits"]) {
    document.getElementById(`${name}-table-toggle`).addEventListener("click", event => {
      const table = document.getElementById(`${name}-table`);
      table.hidden = !table.hidden;
      event.currentTarget.setAttribute("aria-pressed", String(!table.hidden));
    });
  }
  document.getElementById("theme").addEventListener("change", event => {
    savePreference("theme", event.target.value);
    applyTheme(event.target.value);
  });
  window.addEventListener("hashchange", loadSession);
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && state.session && !event.defaultPrevented) location.hash = "";
  });
  document.addEventListener("visibilitychange", pollWhileVisible);
  const resize = new ResizeObserver(() => {
    if (state.session) renderContext(state.session);
    if (!state.summary) return;
    renderTrend(state.summary);
    renderChart(state.summary);
    renderLimits(state.summary);
  });
  resize.observe(document.getElementById("chart"));
  resize.observe(document.getElementById("trend"));
  resize.observe(document.getElementById("limits"));
  resize.observe(document.getElementById("drilldown"));

  placeholder("kpis", "Loading…");
  placeholder("live", "Loading…");
  loadSession();
  pollWhileVisible();
}

setup();
