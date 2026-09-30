// Loading the API, the controls, and the start of the page. Loaded last: it calls setup().
"use strict";

// --- loading -------------------------------------------------------------------------------------------------

// An unchanged payload isn't drawn again, which keeps focus and scroll position inside it. Today's date and hour
// count too: the charts run up to now.
function drawnKey(payload) {
  const now = new Date();
  return `${dayText(now)}T${now.getHours()} ${JSON.stringify(payload)}`;
}

// A new range (the range filter calls it): the live sessions follow it too, at once rather than at their next poll
function loadRange() {
  loadSummary();
  loadLive();
}

let summaryRequest = 0;
let summaryKey = null;
async function loadSummary() {
  const container = document.getElementById("summary");
  container.classList.add("loading");                      // keep the previous render, dimmed
  // stepping through days quickly overlaps requests: only the newest one may render
  const request = ++summaryRequest;
  try {
    const summary = await fetchJson(`/api/summary?${rangeQuery(range.days, range.day)}`);
    if (request !== summaryRequest) return;
    showError("summary", "");
    showScanErrors(summary);
    range.fit(summary);
    const key = drawnKey(summary);
    if (key !== summaryKey) {
      summaryKey = key;
      state.summary = summary;
      renderSummary();
    }
  } catch (error) {
    if (request !== summaryRequest) return;
    showError("summary", error.message);
    if (!state.summary) setPayload({summaryFailed: true});
  } finally {
    if (request === summaryRequest) container.classList.remove("loading");
  }
}

function renderSummary() {
  const summary = state.summary;
  if (!summary) return;
  setPayload({summary});
  const scope = summary.project_filter ? `project ${summary.project_filter}` : "all projects";
  document.getElementById("scope").textContent = `· ${scope}`;
  document.getElementById("footer").textContent = "Estimated cost at Claude API list prices" +
    (summary.prices_checked ? ` (checked ${summary.prices_checked})` : "") +
    ". “(background)” is usage Claude Code counted but no transcript shows (e.g. Haiku for titles), taken from the " +
    "cost records it writes during and at the end of a session: it has no turns, is filed under the time of the " +
    "record that first counted it, and is hatched in the chart." +
    footerCopy();
}

let liveRequest = 0;
let liveKey = null;
async function loadLive() {
  // a poll for the range before may answer after a new range's request: only the newest one may render
  const request = ++liveRequest;
  try {
    const live = await fetchJson(`/api/live?${rangeQuery(range.days, range.day)}`);
    if (request !== liveRequest) return;
    showError("live", "");
    showScanErrors(live);
    const key = JSON.stringify(live);
    if (key !== liveKey) {
      liveKey = key;
      setPayload({live, liveAt: Date.now()});
      // the open session's waits follow the list by themselves (SessionWaits); a changed one asks at once
      if (state.session && sessionShown() && waitChanged(state.session, live.sessions)) refreshSession();
    } else {
      setPayload({liveAt: Date.now()});    // the cards' "12 s ago" run on
    }
    loadLiveStates(live.sessions);
    document.getElementById("updated").textContent = `updated ${new Date().toLocaleTimeString()}`;
    return true;
  } catch (error) {
    if (request !== liveRequest) return;
    showError("live", error.message);
    if (liveKey === null) setPayload({liveFailed: true});
    return false;
  }
}

// Each live card's compact and security state, asked for once the list is drawn and not awaited: the server reads
// the transcripts for it, so neither the list nor its poll waits. The states of sessions no longer live go.
function loadLiveStates(sessions) {
  const ids = new Set(sessions.map(session => session.session_id));
  payload.keepLiveStates(ids);
  for (const id of ids) loadLiveState(id);
}

// One session's state into the payload, which its card draws from; one request per session at a time. A failed one
// keeps the state shown: the live list's own request shows what failed, and the next poll asks again.
async function loadLiveState(id) {
  if (liveStateRequests.has(id)) return;
  liveStateRequests.add(id);
  try {
    payload.setLiveState(id, await fetchJson(`/api/session/${encodeURIComponent(id)}/state`));
  } catch (error) {
    return;
  } finally {
    liveStateRequests.delete(id);
  }
}

// The next request goes out after the previous answer, so a slow server never gets two at once. A hidden tab asks
// nothing; showing it again asks at once. Timers are cleared before they are set, so two chains merge into one.
let liveTimer = null;
let summaryTimer = null;
async function pollLive() {
  const ok = await loadLive();
  // the server is back: the summary needn't wait for its next turn
  if (ok && hasError("summary")) pollSummary();
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
  clearTimeout(sessionTimer);
  if (document.hidden) return;
  pollLive();
  pollSummary();
  if (state.session) refreshSession();
}

// the server's session-id pattern: anything else isn't a session link
const SESSION_HASH = /^#session\/([A-Za-z0-9_-]{1,128})$/;
let sessionRequest = 0;
let sessionKey = null;
let sessionTimer = null;

async function loadSession() {
  const request = ++sessionRequest;                       // a late answer for a session left since doesn't render
  clearTimeout(sessionTimer);
  const match = location.hash.match(SESSION_HASH);
  if (!match) {
    showError("session", location.hash.startsWith("#session/") ? "Not a session link." : "");
    state.session = null;
    renderDrilldown(null);                                 // the view returns focus and scroll to its link
    return;
  }
  try {
    const session = await fetchJson(`/api/session/${encodeURIComponent(match[1])}`);
    if (request !== sessionRequest) return;
    showError("session", "");
    state.session = session;
    sessionKey = drawnKey(session);
    renderDrilldown(session);                              // the view takes focus and the top of the window
    pollSession();
  } catch (error) {
    if (request === sessionRequest) showError("session", error.message);
  }
}

// whether the open session is the one the address names: not while another one loads, whose answer a refresh of the
// open one would drop (sessionRequest)
function sessionShown() {
  const match = location.hash.match(SESSION_HASH);
  return Boolean(state.session && match && match[1] === state.session.session_id);
}

// The open session asks again after each answer: every LIVE_INTERVAL_MS while it is live, else every
// SUMMARY_INTERVAL_MS, which notices a resumed session. A hidden tab asks nothing; closing the session stops it.
function pollSession() {
  clearTimeout(sessionTimer);
  if (document.hidden || state.session === null) return;
  sessionTimer = setTimeout(refreshSession, state.session.live ? LIVE_INTERVAL_MS : SUMMARY_INTERVAL_MS);
}

// An unchanged session isn't drawn again. A changed one is drawn in place (renderDrilldown's refresh), and the
// conversation shown reads itself again with it (Conversation).
async function refreshSession() {
  const open = state.session;
  if (!open) return;
  const request = ++sessionRequest;
  try {
    const session = await fetchJson(`/api/session/${encodeURIComponent(open.session_id)}`);
    if (request !== sessionRequest) return;
    showError("session", "");
    const key = drawnKey(session);
    if (key !== sessionKey) {
      sessionKey = key;
      state.session = session;
      renderDrilldown(session, true);
    }
  } catch (error) {
    if (request !== sessionRequest) return;
    showError("session", error.message);
  }
  pollSession();
}

// --- controls ------------------------------------------------------------------------------------------------

function setup() {
  applyTheme();
  range.onchange = loadRange;
  document.getElementById("theme").addEventListener("change", event => {
    preferences.theme = event.target.value;
    applyTheme();
  });
  window.addEventListener("hashchange", loadSession);
  document.addEventListener("visibilitychange", pollWhileVisible);

  loadSession();
  pollWhileVisible();
}

setup();
