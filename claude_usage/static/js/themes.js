// The theme picker's DOM. Which themes there are, their copy and the saved choice come from the bundle
// (web/src/lib/themes.ts, prefs.svelte.ts): THEMES, hype, footerCopy and preferences.
"use strict";

// Puts the chosen theme (preferences.theme, null for auto: the system's) on the page, its select and its labels
function applyTheme() {
  const theme = preferences.theme;
  if (theme) document.documentElement.dataset.theme = theme;
  else delete document.documentElement.dataset.theme;
  document.getElementById("theme").value = theme ?? "auto";
  for (const node of document.querySelectorAll("[data-label]")) node.textContent = hype(node.dataset.label);
  renderSummary();                                        // the KPI labels follow the theme too
}
