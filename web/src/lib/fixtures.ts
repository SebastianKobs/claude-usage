// Made-up answers of the server for the tests of what draws them: a usage, a summary and a session's detail, each
// with the changes a test asks for on top of one plain default.

import type {
  Agent,
  ApiErrorEvent,
  Compaction,
  CompactEstimate,
  CompactNow,
  ContextTurn,
  CostlySession,
  LimitWindow,
  Live,
  LiveSession,
  LiveSubagent,
  RuntimeTotals,
  SecretAccess,
  SessionDetail,
  SessionGauge,
  SessionListItem,
  SessionRuntime,
  Summary,
  ToolKindRow,
  Usage,
  VersusKeeping,
} from './api';

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

/** One of the costliest sessions: $1.50 of which $0.20 was read from the cache. */
export function costlySession(changes: Partial<CostlySession> = {}): CostlySession {
  return {
    ...usage(),
    session_id: 'abc-1',
    project: 'shop',
    title: 'Checkout: split payment step',
    first_ts: '2026-09-29T09:00:00Z',
    last_ts: '2026-09-29T11:00:00Z',
    subagents: 2,
    context_avg: 40_000,
    context_peak: 90_000,
    ...changes,
  };
}

/** A row of the sessions list: a session of the project "shop" with 2 subagents, $1.50 in 10 turns. */
export function sessionItem(changes: Partial<SessionListItem> = {}): SessionListItem {
  return {
    session_id: 'abc-1',
    title: 'Checkout: split payment step',
    project: 'shop',
    last_ts: '2026-09-29T11:00:00Z',
    subagents: 2,
    turns: 10,
    context_avg: 40_000,
    context_peak: 90_000,
    output: 50,
    cost: 1.5,
    ...changes,
  };
}

/** A failed call: a rate limit of the 5-hour quota in the session "abc-1". */
export function apiErrorEvent(changes: Partial<ApiErrorEvent> = {}): ApiErrorEvent {
  return {
    record_id: 'err-1',
    ts: '2026-09-29T10:00:00Z',
    error: 'rate_limit',
    status: 429,
    limit_type: 'five_hour',
    resets_at: '2026-09-29T13:00:00Z',
    session_id: 'abc-1',
    project: 'shop',
    agent_type: 'main',
    title: 'Checkout: split payment step',
    ...changes,
  };
}

/** A 5-hour window that hit its limit after 3 h 12 min, with no models listed. */
export function limitWindow(changes: Partial<LimitWindow> = {}): LimitWindow {
  return {
    limit_type: 'five_hour',
    start: '2026-09-29T08:00:00Z',
    first_hit: '2026-09-29T11:12:00Z',
    resets_at: '2026-09-29T13:00:00Z',
    hits: 3,
    used: usage(),
    models: [],
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

/** A Bash call row of the Tools table: 4 calls, one of them an error, results of 90 characters in all. */
export function toolKindRow(changes: Partial<ToolKindRow> = {}): ToolKindRow {
  return {
    tool: 'Read',
    kind: null,
    detail: null,
    options: null,
    calls: 4,
    errors: 1,
    result_chars: 90,
    result_median: 30,
    result_p90: 50,
    input_median: 12,
    calls_after_median: 4.5,
    carried: 0.01,
    input_cost: 0.002,
    ...changes,
  };
}

/** The main thread: 10 turns on one model, its context from 10K to 50K, nothing handed back, no calls kept. */
export function agent(changes: Partial<Agent> = {}): Agent {
  return {
    ...usage(),
    agent_id: null,
    agent_type: 'main',
    description: null,
    workflow_run: null,
    workflow_phase: null,
    workflow_name: null,
    first_ts: '2026-09-30T08:00:00.000Z',
    last_ts: '2026-09-30T09:00:00.000Z',
    models: ['claude-opus-5-5'],
    model_efforts: [],
    context_first: 10_000,
    context_last: 50_000,
    input_total: 1_200,
    context_per_turn: [],
    tools: [],
    compactions: [],
    overhead: null,
    rebuilds: { count: 0, lost: 0, cost: null },
    top_growth: [],
    returned_chars: null,
    tool_kinds: null,
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

/** A call that named a possible secret location: a Bash `cat` of an env file whose result came back. */
export function secretAccess(changes: Partial<SecretAccess> = {}): SecretAccess {
  return {
    time: '2026-09-30T08:30:00.000Z',
    tool: 'Bash',
    path: '.env',
    pattern: '.env',
    error: false,
    via: null,
    sent: false,
    test: false,
    reach: 'returned',
    severity: 'medium',
    agent_type: 'main',
    agent_id: null,
    ...changes,
  };
}

/** A subagent at work: a general-purpose one on a Sonnet, 4 turns in, its context at 20K. */
export function liveSubagent(changes: Partial<LiveSubagent> = {}): LiveSubagent {
  return {
    agent_id: 'agent-1',
    agent_type: 'general-purpose',
    description: 'Find the callers',
    model: 'claude-sonnet-5-5',
    last_activity: '2026-09-29T11:59:30Z',
    turns: 4,
    last_context: 20_000,
    ...changes,
  };
}

/** A live session of the shop project on a branch, 10 turns, its last context 60K, without subagents or a wait. */
export function liveSession(changes: Partial<LiveSession> = {}): LiveSession {
  return {
    ...usage(),
    session_id: 'live-1',
    project: 'shop',
    title: 'Checkout: split payment step',
    git_branch: 'main',
    last_activity: '2026-09-29T11:59:48Z',
    last_context: 60_000,
    last_output: 300,
    subagents: [],
    waiting: null,
    ...changes,
  };
}

/** The live answer for today: one session, a 5-minute window, nothing to note. */
export function live(changes: Partial<Live> = {}): Live {
  return {
    minutes: 5,
    agent_minutes: 5,
    days: 1,
    since: '2026-09-29',
    until: '2026-09-29',
    sessions: [liveSession()],
    scan_errors: [],
    prompts_unavailable: null,
    notifications_unavailable: null,
    ...changes,
  };
}

/** What compacting would leave after 5 stored compactions: 50K, paying off after 10 of 40 replies ahead on average. */
export function compactEstimate(changes: Partial<CompactEstimate> = {}): CompactEstimate {
  return {
    compactions: 5,
    after: 50_000,
    after_low: 40_000,
    after_high: 60_000,
    summary_tokens: 3000,
    one_time: 0.3,
    breakeven_calls: 10,
    breakeven_low: 5,
    breakeven_high: 20,
    before_break: null,
    cold_saving: -0.5,
    breakeven_cold: 10,
    calls_after_low: 20,
    calls_after_high: 60,
    calls_ahead: 40,
    ahead_from: 'longer',
    stretches_ahead: 3,
    pays_later_in: null,
    pays_later_at: null,
    ...changes,
  };
}

/** Compacting right after the last call, from a 150K context, its cache warm until 12:30 UTC on 2026-09-28. */
export function compactNow(changes: Partial<CompactNow> = {}): CompactNow {
  return {
    before: 150_000,
    reread_cost: 0.06,
    cache_ttl_minutes: 5,
    cache_warm_until: '2026-09-28T12:30:00.000+00:00',
    keep_across_break: 0.9,
    stored_compactions: 5,
    estimate: compactEstimate(),
    ...changes,
  };
}

/** The main thread's gauge: 150K of the 967K auto-compact point, the hint at 200K, 40 turns since a compaction. */
export function gauge(changes: Partial<SessionGauge> = {}): SessionGauge {
  return {
    context: 150_000,
    model: 'claude-opus-5-5',
    auto_compact: 967_000,
    hint_tokens: 200_000,
    share: 0.155,
    headroom: 817_000,
    turns_since_compaction: 40,
    last_compaction: '2026-09-28T09:00:00.000+00:00',
    compacted: null,
    mean_growth: 3000,
    mean_step: 3500,
    turns_left: 230,
    compact_now: compactNow(),
    exploration: null,
    ...changes,
  };
}

/** A call of 50K context, nearly all read from the cache, which grew 2K beyond the last reply; `message_id` is the
 *  one thing each test gives its own. */
export function contextTurn(changes: Partial<ContextTurn> = {}): ContextTurn {
  return {
    message_id: 'msg-1',
    ts: '2026-09-30T08:00:00.000Z',
    context: 50_000,
    effort: null,
    new_input: 1_000,
    cache_write: 4_000,
    cache_read: 45_000,
    growth: 2_000,
    rebuild: null,
    ...changes,
  };
}

/** A compaction that saved: 60K dropped to 20K, $0.30 once, paid off at call 5 of the 40 after it, $2.10 net. */
export function versusKeeping(changes: Partial<VersusKeeping> = {}): VersusKeeping {
  return {
    model: 'claude-opus-5-5',
    before: 60_000,
    after: 20_000,
    difference: 40_000,
    saving_per_call: 0.02,
    rewrite: 0.1,
    one_time: 0.3,
    calls_after: 40,
    last_stretch: false,
    capped_at: null,
    cache_warm: true,
    breakeven_call: 5,
    breakeven_at_least: false,
    net: 2.1,
    net_low: 1.9,
    net_high: 2.3,
    verdict: 'saved',
    rework_margin: null,
    added: 500,
    prefix_read: 20_000,
    call_low: 0.1,
    call_cost: 0.2,
    call_high: 0.25,
    summary_tokens: 3_000,
    summary_high: 4_000,
    ...changes,
  };
}

/** An auto-compaction at 09:00 that took 30 s, compared with keeping the context. */
export function compaction(changes: Partial<Compaction> = {}): Compaction {
  return {
    ts: '2026-09-30T09:00:00.000Z',
    trigger: 'auto',
    pre_tokens: 60_000,
    post_tokens: 5_000,
    duration_ms: 30_000,
    next_context: 20_000,
    versus_keeping: versusKeeping(),
    ...changes,
  };
}
