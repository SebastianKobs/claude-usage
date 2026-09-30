// The bridge between the bundle and the page's old classic scripts: it hands them what has moved to Svelte, as
// globals, and mounts the moved sections into their containers, until 3.32 mounts the whole app. A .svelte.ts
// file, since the payloads the later sections take from the old scripts are $state.raw, which needs runes.
import { flushSync, mount, unmount } from 'svelte';
import Banner from './components/Banner.svelte';
import ByModel from './components/ByModel.svelte';
import CostPerSession from './components/CostPerSession.svelte';
import LiveSessions from './components/LiveSessions.svelte';
import OverTime from './components/OverTime.svelte';
import RangeFilter from './components/RangeFilter.svelte';
import RateLimits from './components/RateLimits.svelte';
import SessionsList from './components/SessionsList.svelte';
import SessionView from './components/SessionView.svelte';
import SummaryTiles from './components/SummaryTiles.svelte';
import UsageTables from './components/UsageTables.svelte';
import { BannerMessages } from './lib/banner.svelte';
import * as charts from './lib/charts';
import * as colors from './lib/colors';
import * as compact from './lib/compact';
import * as format from './lib/format';
import * as live from './lib/live';
import * as paging from './lib/paging.svelte';
import * as payload from './lib/payload.svelte';
import * as prefs from './lib/prefs.svelte';
import * as rangeLib from './lib/range';
import * as rangeState from './lib/range.svelte';
import * as scroll from './lib/scroll';
import * as secrets from './lib/secrets';
import * as tables from './lib/tables';
import * as themes from './lib/themes';

// Typed from the modules themselves, so what Window declares can't drift from what the old scripts are handed. The
// formatters are lib/format.ts (numbers, money, durations, days, hours, moments), the colors lib/colors.ts (the
// chart palette's slots, models and effort shades), compacting lib/compact.ts (when compacting pays off, the call to
// compact, the delegate hint, the verdict's tone and the compactions' sum), the secrets lib/secrets.ts (the secret
// access tone, origin and reach words), the live cards lib/live.ts (their badges and what waits) and the tables
// lib/tables.ts (paging, the sessions filter and count, the Tools table's rows, folds and labels, the conversation's
// order) and the charts lib/charts.ts (scales and ticks, the time axis, the by-model series and stacks, the rate-limit
// counts and windows, the cost bars' split), the themes lib/themes.ts (the themes and their wording) and the saved
// preferences lib/prefs.svelte.ts (the theme, page size and conversation order, the theme's `hype` and footer copy),
// the paging lib/paging.svelte.ts (the table pagers, mounted for the old scripts, and the page each table is on) and
// scrolling lib/scroll.ts (keeping the reader's place while a view is redrawn), the page's payload
// lib/payload.svelte.ts (the summary loaded, or that loading it failed: `setPayload` hands the old scripts' summary to
// the components and draws at once: its `session` is the open session, null closing the view) and the page's range
// lib/range.ts (the ranges on offer, the query a range becomes, the day the Daily range shows) and
// lib/range.svelte.ts (`range`, the days and day shown as reactive state, which the old scripts reload the data on
// through its `onchange`). `tablePages`,
// `mountPager`, `payload` and the like reach the old scripts as globals, like everything else here. Their names must
// stay apart: a shared one would be handed
// over twice, the second silently winning. The overview's two tile rows, `#kpis` and `#runtime`, the live sessions,
// `#live-card`, the over-time section, `#trend-card`, the by-model section, `#chart-card`, the cost-per-session
// section, `#costly-card`, the rate-limits section, `#limits-card`, the usage tables, `#usage-cards`, the sessions
// list, `#sessions-card`, the range filter, `#filters`, and the session view's frame, `#session-card`, are mounted
// here from the payload, which `setPayload` sets. The old scripts fill what has not moved into the view's three
// slots, `#session-top`, `#session-mid` and `#session-end`.
type Formatters = typeof format;
type Colors = typeof colors;
type Compacting = typeof compact;
type Secrets = typeof secrets;
type Live = typeof live;
type Tables = typeof tables;
type Charts = typeof charts;
type Themes = typeof themes;
type Prefs = typeof prefs;
type Paging = typeof paging;
type Scroll = typeof scroll;
type Payload = typeof payload;
type RangeLib = typeof rangeLib;
type RangeStateModule = typeof rangeState;

// Every module handed over: a new one is imported above, typed in Window's extends and listed here.
const MODULES = [
  format,
  colors,
  compact,
  secrets,
  live,
  tables,
  charts,
  themes,
  prefs,
  paging,
  scroll,
  payload,
  rangeLib,
  rangeState,
];

declare global {
  interface Window
    extends Formatters,
      Colors,
      Compacting,
      Secrets,
      Live,
      Tables,
      Charts,
      Themes,
      Prefs,
      Paging,
      Scroll,
      Payload,
      RangeLib,
      RangeStateModule {
    /** Sets a source's banner message (empty removes it), drawn at once. */
    showError(source: string, message: string): void;
    /** Whether a source has a banner message now. */
    hasError(source: string): boolean;
  }
}

/** What the bridge set up, to take away again. */
export interface Bridge {
  /** Unmounts what was mounted and deletes the globals. */
  stop(): void;
}

/** Mounts the moved sections in the page and hands the old scripts their globals on `target`. */
export function bridge(target: Window): Bridge {
  const messages = new BannerMessages();
  const placeholder = target.document.getElementById('error');
  // A page without it was built for another bundle: better to fail loudly than show no errors.
  if (!placeholder?.parentElement) throw new Error('The page has no #error placeholder for the banner');
  // Both looked up before anything is mounted, so a page without one leaves nothing behind.
  const tileContainers = (['kpis', 'runtime'] as const).map((id) => {
    const container = target.document.getElementById(id);
    if (!container) throw new Error(`The page has no #${id} container for the tiles`);
    return { id, container };
  });
  const liveContainer = target.document.getElementById('live-card');
  if (!liveContainer) throw new Error('The page has no #live-card container for the live sessions');
  const trendContainer = target.document.getElementById('trend-card');
  if (!trendContainer) throw new Error('The page has no #trend-card container for the over-time section');
  const byModelContainer = target.document.getElementById('chart-card');
  if (!byModelContainer) throw new Error('The page has no #chart-card container for the by-model section');
  const costlyContainer = target.document.getElementById('costly-card');
  if (!costlyContainer) throw new Error('The page has no #costly-card container for the cost-per-session section');
  const limitsContainer = target.document.getElementById('limits-card');
  if (!limitsContainer) throw new Error('The page has no #limits-card container for the rate-limits section');
  const usageContainer = target.document.getElementById('usage-cards');
  if (!usageContainer) throw new Error('The page has no #usage-cards container for the usage tables');
  const sessionsContainer = target.document.getElementById('sessions-card');
  if (!sessionsContainer) throw new Error('The page has no #sessions-card container for the sessions list');
  const filtersContainer = target.document.getElementById('filters');
  if (!filtersContainer) throw new Error('The page has no #filters container for the range filter');
  const sessionContainer = target.document.getElementById('session-card');
  if (!sessionContainer) throw new Error('The page has no #session-card container for the session view');
  // Mounted before the placeholder, which then goes, so the banner keeps its place and there is one alert.
  const banner = mount(Banner, { target: placeholder.parentElement, anchor: placeholder, props: { messages } });
  placeholder.remove();

  // The overview's tile rows, in the page's own containers, which keep their classes.
  const rows = tileContainers.map(({ id, container }) =>
    mount(SummaryTiles, { target: container, props: { rows: id } }),
  );

  // The live sessions, which draw their own card into the container.
  const liveSessions = mount(LiveSessions, { target: liveContainer });
  // The over-time section likewise.
  const trend = mount(OverTime, { target: trendContainer });
  // And the by-model section.
  const byModel = mount(ByModel, { target: byModelContainer });
  // And the cost per session.
  const costly = mount(CostPerSession, { target: costlyContainer });
  // And the rate limits.
  const limits = mount(RateLimits, { target: limitsContainer });
  // And the usage tables.
  const usage = mount(UsageTables, { target: usageContainer });
  // And the sessions list.
  const sessions = mount(SessionsList, { target: sessionsContainer });
  // And the range filter.
  const filters = mount(RangeFilter, { target: filtersContainer });
  // And the session view's frame, which draws nothing until a session is open.
  const sessionView = mount(SessionView, { target: sessionContainer });

  target.showError = (source: string, message: string): void => {
    messages.show(source, message);
    // Drawn now, as the old textContent assignment was: its callers restore focus and scroll right after.
    flushSync();
  };
  target.hasError = (source: string): boolean => messages.has(source);
  // Every export, so a function added to any of the modules reaches the old scripts without touching the bridge.
  // Handed over as they are: the old scripts call them with their own arguments, never as an array callback.
  Object.assign(target, ...MODULES);

  return {
    stop(): void {
      void unmount(banner);
      for (const row of rows) void unmount(row);
      void unmount(liveSessions);
      void unmount(trend);
      void unmount(byModel);
      void unmount(costly);
      void unmount(limits);
      void unmount(usage);
      void unmount(sessions);
      void unmount(filters);
      void unmount(sessionView);
      // Reflect, since the Window interface declares them always there, which a plain delete refuses.
      Reflect.deleteProperty(target, 'showError');
      Reflect.deleteProperty(target, 'hasError');
      for (const name of MODULES.flatMap((module) => Object.keys(module))) Reflect.deleteProperty(target, name);
    },
  };
}
