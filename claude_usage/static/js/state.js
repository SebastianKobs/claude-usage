// Settings, the metrics of the by-model chart, and the page state.
"use strict";

const LIVE_INTERVAL_MS = 5000;
const SUMMARY_INTERVAL_MS = 60000;
const PLOT_HEIGHT = 220;
const AXIS_BAND = 28;
const LEFT_AXIS = 56;
const BAR_MAX = 24;
const GAP = 2;
const MODEL_GAP = 4;                                      // between two models in a column, wider than between shades
const CORNER = 4;
const METRICS = {
  cost: {label: "Estimated cost", value: row => row.cost || 0, format: money},
  output: {label: "Output tokens", value: row => row.output, format: compact},
  input: {label: "Input tokens", value: inputTotal, format: compact},
};

// day: the day the Daily range shows, as "YYYY-MM-DD"; null follows today, also past midnight; live: the latest
// /api/live answer
const state = {days: 30, day: null, metric: "cost", summary: null, session: null, live: null};
// each live card's last state by session id (/api/session/<id>/state), so a redrawn list shows it at once, and the
// sessions whose state is on its way
const liveStates = new Map();
const liveStateRequests = new Set();
