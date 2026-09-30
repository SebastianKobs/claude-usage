// Settings, the chart sizes, and the page state.
"use strict";

const LIVE_INTERVAL_MS = 5000;
const SUMMARY_INTERVAL_MS = 60000;
const PLOT_HEIGHT = 220;
const AXIS_BAND = 28;
const LEFT_AXIS = 56;

// the range shown is `range` (web/src/lib/range.svelte.ts)
const state = {summary: null, session: null};
// the sessions whose live card's state (/api/session/<id>/state, kept in the payload) is on its way
const liveStateRequests = new Set();
