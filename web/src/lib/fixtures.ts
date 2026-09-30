// Made-up answers of the server for the tests of what draws them: a usage, a summary and a session's detail, each
// with the changes a test asks for on top of one plain default.

import type { RuntimeTotals, SessionDetail, SessionRuntime, Summary, Usage } from './api';

/** A usage of 10 turns: 1.5K input in all, 900 of it read from the cache, at a cost of $1.50. */
export function usage(changes: Partial<Usage> = {}): Usage {
  return {
    turns: 10,
    new_input: 100,
    cache_write_5m: 0,
    cache_write_1h: 0,
    cache_read: 900,
    output: 50,
    cache_write: 200,
    web_searches: 0,
    cost: 1.5,
    cost_parts: { new_input: 0.1, cache_write: 0.4, cache_read: 0.2, output: 0.7, web_search: 0 },
    unpriced_turns: 0,
    ...changes,
  };
}

/** The overview's runtime totals: a two-hour session with lines changed. */
export function runtimeTotals(changes: Partial<RuntimeTotals> = {}): RuntimeTotals {
  return {
    sessions: 3,
    duration_ms: 7_200_000,
    api_ms: 600_000,
    api_ms_without_retries: 540_000,
    tool_ms: 360_000,
    lines_added: 120,
    lines_removed: 30,
    cost: 4,
    cost_per_100_lines: 2.5,
    ...changes,
  };
}

/** A session's runtime from its cost record. */
export function sessionRuntime(changes: Partial<SessionRuntime> = {}): SessionRuntime {
  return {
    source: 'cost_record',
    duration_ms: 3_600_000,
    api_ms: 300_000,
    api_ms_without_retries: 300_000,
    tool_ms: 180_000,
    lines_added: 40,
    lines_removed: 10,
    ...changes,
  };
}

/** The summary of the last 7 days up to 2026-09-30, without anything but totals, context and runtime. */
export function summary(changes: Partial<Summary> = {}): Summary {
  return {
    days: 7,
    since: '2026-09-24',
    until: '2026-09-30',
    previous_day: null,
    next_day: null,
    project_filter: null,
    retention_days: 30,
    history_since: null,
    prices_checked: null,
    totals: usage(),
    day_model: [],
    agent_type: [],
    project: [],
    model: [],
    model_effort: [],
    day_model_effort: [],
    skill: [],
    mcp_server: [],
    hour_model: [],
    hour_model_effort: [],
    runtime: runtimeTotals(),
    api_errors: { day: [], hour: [], events: [], windows: [] },
    context: { turns: 8, median: 40_000, p90: 90_000 },
    compact_hint_tokens: 200_000,
    compaction_savings: null,
    scan_errors: [],
    sessions: [],
    costly_sessions: [],
    ...changes,
  };
}

/** A session's detail with a cost record, without agents, models or a transcript. */
export function sessionDetail(changes: Partial<SessionDetail> = {}): SessionDetail {
  return {
    ...usage(),
    session_id: 'abc123',
    project: '/work/demo',
    title: 'Demo session',
    git_branch: null,
    first_ts: '2026-09-30T08:00:00.000Z',
    last_ts: '2026-09-30T09:00:00.000Z',
    prompt: null,
    runtime: sessionRuntime(),
    context: { turns: 4, median: 30_000, p90: 60_000 },
    models: [],
    model_effort: [],
    skills: [],
    mcp_servers: [],
    api_errors: [],
    agents: [],
    compact_hint_tokens: 200_000,
    current: null,
    delegate_hint_tokens: 20_000,
    delegate_calls_ahead: 60,
    waiting: null,
    live: false,
    compaction_savings: null,
    transcript: false,
    secret_accesses: [],
    ...changes,
  };
}
