// Settings, the chart sizes, and the page state.
"use strict";

const LIVE_INTERVAL_MS = 5000;
const SUMMARY_INTERVAL_MS = 60000;
const PLOT_HEIGHT = 220;
const AXIS_BAND = 28;
const LEFT_AXIS = 56;

// day: the day the Daily range shows, as "YYYY-MM-DD"; null follows today, also past midnight
const state = {days: 30, day: null, summary: null, session: null};
// the sessions whose live card's state (/api/session/<id>/state, kept in the payload) is on its way
const liveStateRequests = new Set();
