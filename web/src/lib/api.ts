// What the dashboard reads from the server: one type per answer of /api/summary, /api/live, /api/session/<id>, its
// /state and its /chat, and the parts they share. Each field is what claude_usage/server.py and queries.py put in
// the JSON; tests/test_api_types.py reads this file and checks every answer of a demo store against it, both ways
// (a declared field the server doesn't send, a field sent and not declared). So the file keeps to a small subset of
// TypeScript that test can parse: interfaces (with `extends`), aliases of string literals or of interfaces, `T[]`,
// `Record<string, T>`, `| null` and `?` on a field, and nothing else (no generics, intersections or tuples).
//
// A `null` is a value the server sends where it has nothing: a timestamp the transcript lacked, a column the store
// leaves empty, a figure that can't be worked out yet. Timestamps are ISO text in UTC with milliseconds, days are
// local dates (`2026-09-30`), hours `2026-09-30T14`.

/** The cost of a usage, by category: the parts add up to `cost` (plus rounding). */
export interface CostParts {
  new_input: number;
  cache_write: number;
  cache_read: number;
  output: number;
  web_search: number;
}

/** What one or more API calls used: tokens by kind (`cache_write` is both cache writes added), and their cost at the
 *  configured prices; `unpriced_turns` counts the turns of models without a price, which add no cost. */
export interface Usage {
  turns: number;
  new_input: number;
  cache_write_5m: number;
  cache_write_1h: number;
  cache_read: number;
  output: number;
  cache_write: number;
  web_searches: number;
  cost: number;
  cost_parts: CostParts;
  unpriced_turns: number;
}

/** A usage per model. */
export interface ModelUsage extends Usage {
  model: string;
}

/** A usage per model and effort level; the background calls have the effort `background`. */
export interface ModelEffortUsage extends ModelUsage {
  effort: string | null;
}

/** A usage per day and model. */
export interface DayModelUsage extends ModelUsage {
  day: string;
}

/** A usage per day, model and effort level. */
export interface DayModelEffortUsage extends ModelEffortUsage {
  day: string;
}

/** A usage per hour and model (a single day's range only). */
export interface HourModelUsage extends ModelUsage {
  hour: string;
}

/** A usage per hour, model and effort level (a single day's range only). */
export interface HourModelEffortUsage extends ModelEffortUsage {
  hour: string;
}

/** A usage per agent type: `main` for the main thread, `(background)` for the calls no transcript shows. */
export interface AgentTypeUsage extends Usage {
  agent_type: string;
}

/** A usage per project folder. */
export interface ProjectUsage extends Usage {
  project: string;
}

/** The turns Claude Code attributes to a skill. */
export interface SkillUsage extends Usage {
  skill: string;
}

/** The turns Claude Code attributes to an MCP server. */
export interface McpServerUsage extends Usage {
  mcp_server: string;
}

/** The context per main-thread turn: how many turns, and the median and 90th percentile. */
export interface ContextStats {
  turns: number;
  median: number;
  p90: number;
}

/** What the compactions of a range or session saved against keeping the context, in all: `unknown` of them had no
 *  summary estimate and aren't summed. */
export interface CompactionSavings {
  net: number;
  compactions: number;
  unknown: number;
}

/** A failed API call. */
export interface ApiErrorEvent {
  record_id: string;
  ts: string | null;
  error: string;
  status: number | null;
  limit_type: string | null;
  resets_at: string | null;
  session_id: string;
  project: string;
  agent_type: string;
  title: string | null;
}

/** The failed calls of a kind on a day. */
export interface DayErrors {
  day: string;
  error: string;
  count: number;
}

/** The failed calls of a kind in an hour. */
export interface HourErrors {
  hour: string;
  error: string;
  count: number;
}

/** A window that hit a rate limit: from its start to `resets_at`, with what was used up to the first hit. */
export interface LimitWindow {
  limit_type: string;
  start: string;
  first_hit: string;
  resets_at: string;
  hits: number;
  used: Usage;
  models: ModelUsage[];
}

/** The run totals of the sessions that ended in the range, from Claude Code's cost records. */
export interface RuntimeTotals {
  sessions: number;
  duration_ms: number;
  api_ms: number;
  api_ms_without_retries: number;
  tool_ms: number;
  lines_added: number;
  lines_removed: number;
  cost: number;
  cost_per_100_lines: number | null;
}

/** A session of the range in the list: what it used in the range. */
export interface SessionListItem {
  session_id: string;
  title: string | null;
  project: string;
  last_ts: string | null;
  subagents: number;
  turns: number;
  context_avg: number;
  context_peak: number;
  output: number;
  cost: number;
}

/** One of the costliest sessions of the range, with its usage in it. */
export interface CostlySession extends Usage {
  session_id: string;
  project: string;
  title: string | null;
  first_ts: string | null;
  last_ts: string | null;
  subagents: number;
  context_avg: number;
  context_peak: number;
}

/** /api/summary: the totals of the `days` local days up to `until`, cut to the retention. */
export interface Summary {
  days: number;
  since: string;
  until: string;
  previous_day: string | null;
  next_day: string | null;
  project_filter: string | null;
  retention_days: number;
  history_since: string | null;
  prices_checked: string | null;
  totals: Usage;
  day_model: DayModelUsage[];
  agent_type: AgentTypeUsage[];
  project: ProjectUsage[];
  model: ModelUsage[];
  model_effort: ModelEffortUsage[];
  day_model_effort: DayModelEffortUsage[];
  skill: SkillUsage[];
  mcp_server: McpServerUsage[];
  hour_model: HourModelUsage[];
  hour_model_effort: HourModelEffortUsage[];
  runtime: RuntimeTotals;
  api_errors: SummaryErrors;
  context: ContextStats;
  compact_hint_tokens: number;
  compaction_savings: CompactionSavings;
  scan_errors: string[];
  sessions: SessionListItem[];
  costly_sessions: CostlySession[];
}

/** The failed calls of a range. */
export interface SummaryErrors {
  day: DayErrors[];
  hour: HourErrors[];
  events: ApiErrorEvent[];
  windows: LimitWindow[];
}

/** What a session waits for: `question` (a question or a plan to approve) or `permission` (a prompt the hook posted),
 *  since when, and the subagent's type where the main thread isn't the one waiting. */
export interface Waiting {
  kind: 'question' | 'permission';
  tool: string;
  since: string | null;
  agent_type: string | null;
}

/** A subagent at work in a live session. */
export interface LiveSubagent {
  agent_id: string;
  agent_type: string;
  description: string | null;
  model: string | null;
  last_activity: string;
  turns: number;
  last_context: number;
}

/** A session that changed lately, with what it used (in the range, if one is asked for). */
export interface LiveSession extends Usage {
  session_id: string;
  project: string;
  title: string | null;
  git_branch: string | null;
  last_activity: string;
  last_context: number;
  last_output: number;
  subagents: LiveSubagent[];
  waiting: Waiting | null;
}

/** /api/live: the live sessions. `days`, `since` and `until` are set when the page asked for a range. */
export interface Live {
  minutes: number;
  agent_minutes: number;
  days: number | null;
  since: string | null;
  until: string | null;
  sessions: LiveSession[];
  scan_errors: string[];
  prompts_unavailable: string | null;
  notifications_unavailable: string | null;
}

/** A session's run totals: Claude Code's own (`cost_record`) or estimated from the transcripts (`transcripts`,
 *  without the retries). */
export interface SessionRuntime {
  source: 'cost_record' | 'transcripts';
  duration_ms: number;
  api_ms: number;
  api_ms_without_retries: number | null;
  tool_ms: number;
  lines_added: number;
  lines_removed: number;
}

/** A model and the effort level a transcript's calls ran it at. */
export interface ModelEffortPair {
  model: string;
  effort: string;
}

/** Why a call wrote the cache again. */
export interface Rebuild {
  cause: 'model' | 'idle' | 'prefix';
  lost: number;
  extra_cost: number | null;
}

/** One call of a transcript: its context by part, and what it grew by. */
export interface ContextTurn {
  message_id: string;
  ts: string | null;
  context: number;
  effort: string | null;
  new_input: number;
  cache_write: number;
  cache_read: number;
  growth: number | null;
  rebuild: Rebuild | null;
}

/** A transcript's calls of a tool. */
export interface ToolCount {
  tool: string;
  calls: number;
  result_chars: number;
}

/** A compaction compared with keeping the context (turns.VersusKeeping). `verdict` is what the comparison shows,
 *  `net` what compacting saved over the calls after it (negative: it cost more). */
export interface VersusKeeping {
  model: string;
  before: number;
  after: number;
  difference: number;
  saving_per_call: number;
  rewrite: number;
  one_time: number | null;
  calls_after: number;
  last_stretch: boolean;
  capped_at: number | null;
  cache_warm: boolean;
  breakeven_call: number | null;
  breakeven_at_least: boolean;
  net: number | null;
  net_low: number | null;
  net_high: number;
  verdict: 'saved' | 'cost_more' | 'even' | 'forced' | 'open' | 'unknown';
  rework_margin: number | null;
  added: number;
  prefix_read: number;
  call_low: number;
  call_cost: number | null;
  call_high: number | null;
  summary_tokens: number | null;
  summary_high: number | null;
}

/** A compaction of a transcript, with the next call's context. */
export interface Compaction {
  ts: string | null;
  trigger: string | null;
  pre_tokens: number | null;
  post_tokens: number | null;
  duration_ms: number | null;
  next_context: number | null;
  versus_keeping: VersusKeeping | null;
}

/** The first call's context, and what the later calls paid to read it again. */
export interface Overhead {
  tokens: number;
  cost: number;
}

/** The calls that wrote the cache again: how many, the tokens written again and what that cost extra. */
export interface RebuildTotals {
  count: number;
  lost: number;
  cost: number | null;
}

/** A call the context grew most at, and the tools the call before ran. */
export interface GrowthStep {
  message_id: string;
  ts: string | null;
  growth: number;
  tools: GrowthTool[];
}

/** A tool a growth step ran, with its result's size. */
export interface GrowthTool {
  tool: string;
  result_chars: number;
}

/** A transcript's tool calls of a kind, read from the file: counts and sizes only. */
export interface ToolKindRow {
  tool: string;
  kind: string | null;
  detail: string | null;
  options: string | null;
  calls: number;
  errors: number;
  result_chars: number;
  result_median: number | null;
  result_p90: number | null;
  input_median: number;
  calls_after_median: number;
  carried: number;
  input_cost: number;
}

/** The main thread's exploration since its last compaction: Read, Grep, Glob, LSP and Bash searches. */
export interface Exploration {
  calls: number;
  chars: number;
  tokens: number;
  carried: number;
  reread: number;
}

/** One transcript of a session: the main thread, a subagent, a workflow run's agent, or the background calls. */
export interface Agent extends Usage {
  agent_id: string | null;
  agent_type: string;
  description: string | null;
  workflow_run: string | null;
  workflow_phase: string | null;
  workflow_name: string | null;
  first_ts: string | null;
  last_ts: string | null;
  models: string[];
  model_efforts: ModelEffortPair[];
  context_first: number | null;
  context_last: number | null;
  input_total: number;
  context_per_turn: ContextTurn[];
  tools: ToolCount[];
  compactions: Compaction[];
  overhead: Overhead | null;
  rebuilds: RebuildTotals;
  top_growth: GrowthStep[];
  returned_chars: number | null;
  tool_kinds: ToolKindRow[] | null;
}

/** What compacting would leave, cost and when it would pay off, learnt from the stored compactions
 *  (turns.preview_estimate). `calls_ahead` is what the estimate is judged against, averaged over the stretches
 *  finished `longer` than this one, or `all` of them. */
export interface CompactEstimate {
  compactions: number;
  after: number;
  after_low: number;
  after_high: number;
  summary_tokens: number;
  one_time: number;
  breakeven_calls: number | null;
  breakeven_low: number | null;
  breakeven_high: number | null;
  before_break: number | null;
  cold_saving: number;
  breakeven_cold: number | null;
  calls_after_low: number | null;
  calls_after_high: number | null;
  calls_ahead: number | null;
  ahead_from: 'longer' | 'all' | null;
  stretches_ahead: number;
  pays_later_in: number | null;
  pays_later_at: number | null;
}

/** What compacting right after the last call would cost and when the cache runs out. */
export interface CompactNow {
  before: number;
  reread_cost: number;
  cache_ttl_minutes: number;
  cache_warm_until: string | null;
  keep_across_break: number;
  stored_compactions: number;
  estimate: CompactEstimate | null;
}

/** The main thread's context against the auto-compact point (queries.current_context). `compacted` is the time of a
 *  compaction after the last call, where the context isn't known yet and `compact_now` is null. */
export interface Gauge {
  context: number;
  model: string;
  auto_compact: number;
  hint_tokens: number;
  share: number;
  headroom: number;
  turns_since_compaction: number;
  last_compaction: string | null;
  compacted: string | null;
  mean_growth: number | null;
  mean_step: number | null;
  turns_left: number | null;
  compact_now: CompactNow | null;
}

/** The gauge in a session's answer, with the exploration the hint to delegate it is judged by. */
export interface SessionGauge extends Gauge {
  exploration?: Exploration | null;
}

/** How far a call that named a possible secret location got (tool_kinds.secret_reach). */
export type SecretReach = 'sent' | 'returned' | 'pending' | 'error' | 'empty';

/** How serious a secret access is (`low-medium`: a `returned` call that looks like a test). */
export type SecretSeverity = 'high' | 'medium' | 'low-medium' | 'low';

/** A call that named a path matching `[secrets] patterns`. The path is as the call gave it. */
export interface SecretAccess {
  time: string | null;
  tool: string;
  path: string;
  pattern: string;
  error: boolean;
  via: string | null;
  sent: boolean;
  test: boolean;
  reach: SecretReach;
  severity: SecretSeverity;
  agent_type: string;
  agent_id: string | null;
}

/** /api/session/<id>: a session's main thread and each agent, what it waits for, and its gauge. */
export interface SessionDetail extends Usage {
  session_id: string;
  project: string;
  title: string | null;
  git_branch: string | null;
  first_ts: string | null;
  last_ts: string | null;
  prompt: string | null;
  runtime: SessionRuntime | null;
  context: ContextStats;
  models: ModelUsage[];
  model_effort: ModelEffortUsage[];
  skills: SkillUsage[];
  mcp_servers: McpServerUsage[];
  api_errors: ApiErrorEvent[];
  agents: Agent[];
  compact_hint_tokens: number;
  current: SessionGauge | null;
  delegate_hint_tokens: number;
  delegate_calls_ahead: number;
  waiting: Waiting | null;
  live: boolean;
  compaction_savings: CompactionSavings | null;
  transcript: boolean;
  secret_accesses: SecretAccess[];
}

/** How many calls named a possible secret location, by severity (no paths). */
export interface SecretCounts {
  high: number;
  medium: number;
  'low-medium': number;
  low: number;
}

/** /api/session/<id>/state: what a live card shows besides its totals. */
export interface SessionState {
  session_id: string;
  current: Gauge | null;
  secrets: SecretCounts;
}

/** What one chat entry's call's usage is: tokens, cost and what its context grew by. */
export interface CallUsage {
  new_input: number;
  cache_write_5m: number;
  cache_write_1h: number;
  cache_read: number;
  output: number;
  cache_write: number;
  web_searches: number;
  context: number;
  model: string;
  speed: string;
  effort: string | null;
  cost: number | null;
  cost_parts: CostParts;
  growth: number | null;
  reply: number | null;
  rebuild: Rebuild | null;
  reminder_chars: number;
  compact_pays?: CompactEstimate;
}

/** A field of a tool call's input: its name, its value cut to the limit, its full length. */
export interface ToolField {
  name: string;
  value: string;
  chars: number;
  is_json: boolean;
}

/** A piece of hidden context Claude Code added to a request. */
export interface InjectedItem {
  kind: string;
  chars: number;
  text: string;
}

/** A compaction's metadata, null where its record has none. */
export interface CompactionMarker {
  trigger: string | null;
  pre_tokens: number | null;
  post_tokens: number | null;
  duration_ms: number | null;
}

/** The hint on a call whose context passed the compact threshold. */
export interface SoftHint {
  kind: 'soft' | 'soft_reminder';
  context: number;
  threshold: number;
  reread_cost: number;
}

/** The hint on a call after which compacting likely pays off, then its reminders. */
export interface PaysHint {
  kind: 'pays';
  context: number;
  pays_off_in: number;
  calls_ahead: number;
  ahead_from: 'longer' | 'all';
  one_time: number;
  after: number;
}

/** A reminder that compacting still likely pays off. */
export interface PaysReminderHint {
  kind: 'pays_reminder';
  context: number;
  pays_off_in: number;
}

/** The hint on a call near the auto-compact point, then its reminders. */
export interface AutoHint {
  kind: 'auto' | 'auto_reminder';
  context: number;
  auto_compact: number;
  share: number;
}

/** A hint to compact, by tier. */
export type CompactHint = SoftHint | PaysHint | PaysReminderHint | AutoHint;

/** One step of a conversation. */
export interface ChatEntry {
  kind: 'prompt' | 'text' | 'thinking' | 'tool' | 'injected' | 'compaction' | 'error';
  timestamp: string | null;
  text: string | null;
  model: string | null;
  tool: string | null;
  summary: string | null;
  tool_fields: ToolField[];
  result: string | null;
  result_chars: number;
  is_error: boolean;
  effort: string | null;
  message_id: string | null;
  usage: CallUsage | null;
  items: InjectedItem[];
  compaction: CompactionMarker | null;
  compact_hint?: CompactHint;
  versus_keeping?: VersusKeeping | null;
}

/** How many calls had the token reminder folded into their usage, and its characters in all. */
export interface Reminders {
  calls: number;
  chars: number;
}

/** /api/session/<id>/chat: a transcript's conversation, read on demand. `available` is false once Claude Code has
 *  deleted the file. */
export interface Chat {
  session_id: string;
  agent_id: string | null;
  available: boolean;
  entries: ChatEntry[];
  reminders: Reminders;
}
