// The day selector.
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
