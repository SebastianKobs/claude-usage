// The themes the page offers and the gimmick themes' wording. Plain functions with no state: which theme a saved choice
// names, and what a label says in a theme. The DOM and the saved choice are prefs.svelte.ts's.

/** The themes besides "auto", which follows the system. */
export const THEMES = ['light', 'dark', 'hacker', 'startup', 'rgb'];

/** A saved choice from an earlier version, by its old name. */
const RENAMED_THEMES: Record<string, string> = { techbro: 'rgb' };

/** A theme's wording: a label (as data-label or themed() gives it) to what it says there; `footer` ends the page. */
type Copy = Record<string, string>;

// Copy of the gimmick themes; everything not listed keeps its normal label. Double quotes: the wording has
// apostrophes.
const COPY: Record<string, Copy> = {
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
    "Per day, by model and effort": "top -o model,effort",
    "Per hour, by model and effort": "top -o model,effort",
    "Cost per session": "sort -rn cost | head",
    "By agent type": "kubectl get agents",
    "By model": "model --benchmark",
    "By project": "ls ~/repos",
    "Sessions": "history | tail",
    "Session time": "uptime",
    "Waiting on the API": "await api.response()",
    "Running tools": "time ./tools.sh",
    "Lines changed": "git diff --stat",
    "Rate limits": "grep 429 access.log",
    "5-hour windows that hit the limit": "ulimit -t 18000",
    "Latest API errors": "tail -f error.log",
    "Rate limits and API errors": "tail -f error.log",
    "By skill": "ls ~/.claude/skills",
    "By MCP server": "netstat --mcp",
    "Conversation": "less session.jsonl",
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
    "Per day, by model and effort": "Model × effort mix",
    "Per hour, by model and effort": "Model × effort mix",
    "Cost per session": "Burn per sprint",
    "By agent type": "Team",
    "By model": "Stack",
    "By project": "Portfolio",
    "Sessions": "Changelog",
    "Session time": "Time to value",
    "Waiting on the API": "Vendor latency",
    "Running tools": "Automation hours",
    "Lines changed": "Velocity (LoC)",
    "Rate limits": "Hypergrowth friction",
    "5-hour windows that hit the limit": "Burn rate before the wall",
    "Latest API errors": "Incident postmortems",
    "Rate limits and API errors": "Incident postmortems",
    "By skill": "Core competencies",
    "By MCP server": "Integrations",
    "Conversation": "Standup notes",
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
    "Per day, by model and effort": "🎮 Loadout × difficulty per day",
    "Per hour, by model and effort": "🎮 Loadout × difficulty per hour",
    "Cost per session": "💀 Boss fights",
    "By agent type": "🕹️ Squad",
    "By model": "🏆 Tier list",
    "By project": "🗺️ Maps",
    "Sessions": "🎬 Match history",
    "Session time": "⏱️ Playtime",
    "Waiting on the API": "📡 Ping",
    "Running tools": "🛠️ Crafting time",
    "Lines changed": "⚔️ Combo counter",
    "Rate limits": "🧊 Cooldowns",
    "5-hour windows that hit the limit": "🔋 Stamina drained",
    "Latest API errors": "💥 Crash log",
    "Rate limits and API errors": "💥 Crash log",
    "By skill": "🎯 Skill tree",
    "By MCP server": "🔌 Mods",
    "Conversation": "🎙️ Voice chat",
    footer: " GG. RGB adds +15% performance.",
  },
};

/** The theme a saved choice names, or null for "auto" and anything unknown. Own keys only: a saved "toString" is no
 *  theme. */
export function themeName(saved: string | null | undefined): string | null {
  if (saved === null || saved === undefined) return null;
  const theme = (Object.hasOwn(RENAMED_THEMES, saved) ? RENAMED_THEMES[saved] : saved) ?? saved;
  return THEMES.includes(theme) ? theme : null;
}

/** A gimmick theme's copy; none for the others and for a name that is only an object's word. */
function copyOf(theme: string | null): Copy {
  return theme !== null && Object.hasOwn(COPY, theme) ? (COPY[theme] ?? {}) : {};
}

/** What a label says in a theme: its wording if the theme has one, else the label itself. */
export function themeLabel(theme: string | null, label: string): string {
  const copy = copyOf(theme);
  return Object.hasOwn(copy, label) ? (copy[label] ?? label) : label;
}

/** The labels a theme words its own way (the footer is none). */
export function themedLabels(theme: string): string[] {
  return Object.keys(copyOf(theme)).filter((label) => label !== 'footer');
}

/** The sentence a gimmick theme adds to the page's footer, or empty. */
export function themeFooter(theme: string | null): string {
  return copyOf(theme).footer ?? '';
}
