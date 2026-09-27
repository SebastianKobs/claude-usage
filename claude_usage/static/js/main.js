// Loading the API, the controls, and the start of the page. Loaded last: it calls setup().
"use strict";

// --- loading -------------------------------------------------------------------------------------------------

let summaryRequest = 0;
async function loadSummary() {
  const container = document.getElementById("summary");
  container.classList.add("loading");                      // keep the previous render, dimmed
  // stepping through days quickly overlaps requests: only the newest one may render
  const request = ++summaryRequest;
  const until = state.days === 1 && state.day !== null ? `&until=${state.day}` : "";
  try {
    const summary = await fetchJson(`/api/summary?days=${state.days}${until}`);
    if (request !== summaryRequest) return;
    state.summary = summary;
    renderSummary();
    showError("");
  } catch (error) {
    if (request === summaryRequest) showError(error.message);
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

async function loadLive() {
  try {
    state.live = await fetchJson("/api/live");
    renderLive(state.live);
    document.getElementById("updated").textContent = `updated ${new Date().toLocaleTimeString()}`;
    showError("");
  } catch (error) {
    showError(error.message);
  }
}

async function loadSession() {
  const match = location.hash.match(/^#session\/(.+)$/);
  if (!match) {
    state.session = null;
    renderDrilldown(null);
    return;
  }
  try {
    state.session = await fetchJson(`/api/session/${match[1]}`);
    renderDrilldown(state.session);
    document.getElementById("drilldown").scrollIntoView({block: "start"});
  } catch (error) {
    showError(error.message);
  }
}

// --- controls ------------------------------------------------------------------------------------------------

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

  loadLive();
  loadSummary();
  loadSession();
  setInterval(loadLive, LIVE_INTERVAL_MS);
  setInterval(loadSummary, SUMMARY_INTERVAL_MS);
}

setup();
