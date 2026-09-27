// The theme picker and the gimmick themes' copy.
"use strict";

// --- themes: auto (follows the system), light, dark, and the tech bro YouTube gimmick ----------------------

const THEMES = ["light", "dark", "hacker", "startup", "rgb"];   // besides "auto", which follows the system
const RENAMED_THEMES = {techbro: "rgb"};                   // a saved choice from an earlier version
// Copy of the gimmick themes; everything not listed keeps its normal label
const COPY = {
  hacker: {
    "Claude usage": "claude-usage --watch",
    "Estimated cost": "burn_rate",
    "Input tokens": "context_window.log",
    "Turns": "requests",
    "API calls with usage": "200 OK, all of them",
    "Output tokens": "tokens >> /dev/prod",
    "Processed": "cache_miss",
    "From cache": "cache_hit",
    "Live sessions": "ps aux | grep claude",
    "Over time": "git log --graph",
    "Per day, by model": "top -o model",
    "Per hour, by model": "top -o model",
    "Cost per session": "sort -rn cost | head",
    "By agent type": "kubectl get agents",
    "By model": "model --benchmark",
    "By project": "ls ~/repos",
    "Sessions": "history | tail",
    footer: " Works on my machine ¯\\_(ツ)_/¯",
  },
  startup: {
    "Claude usage": "Claude usage — Series A ready",
    "Estimated cost": "Infra spend",
    "Input tokens": "Context throughput",
    "Turns": "Inference calls",
    "API calls with usage": "p99 < vibes",
    "Output tokens": "Tokens shipped",
    "Processed": "Compute",
    "From cache": "Cached (efficient)",
    "Live sessions": "Shipping now",
    "Over time": "Growth",
    "Per day, by model": "Model mix",
    "Per hour, by model": "Model mix",
    "Cost per session": "Burn per sprint",
    "By agent type": "Team",
    "By model": "Stack",
    "By project": "Portfolio",
    "Sessions": "Changelog",
    footer: " We're hiring. (We're not.)",
  },
  rgb: {
    "Claude usage": "Claude usage // battlestation",
    "Estimated cost": "💸 Damage dealt",
    "Input tokens": "🧠 Context loaded",
    "Turns": "⚡ APM (API calls)",
    "API calls with usage": "no lag, every frame",
    "Output tokens": "🚀 Tokens fragged",
    "Processed": "Raw render",
    "From cache": "Cached frames",
    "Live sessions": "🔴 Live on stream",
    "Over time": "📈 K/D over time",
    "Per day, by model": "🎮 Loadout per day",
    "Per hour, by model": "🎮 Loadout per hour",
    "Cost per session": "💀 Boss fights",
    "By agent type": "🕹️ Squad",
    "By model": "🏆 Tier list",
    "By project": "🗺️ Maps",
    "Sessions": "🎬 Match history",
    footer: " GG. RGB adds +15% performance.",
  },
};

function themeCopy() { return COPY[document.documentElement.dataset.theme] || {}; }
function hype(label) { return themeCopy()[label] || label; }

function applyTheme(saved) {
  const theme = RENAMED_THEMES[saved] || saved;
  if (THEMES.includes(theme)) document.documentElement.dataset.theme = theme;
  else delete document.documentElement.dataset.theme;
  document.getElementById("theme").value = THEMES.includes(theme) ? theme : "auto";
  for (const node of document.querySelectorAll("[data-label]")) node.textContent = hype(node.dataset.label);
  renderSummary();                                        // the KPI labels follow the theme too
}
