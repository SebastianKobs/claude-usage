// The bridge between the bundle and the page's old classic scripts: it hands them what has moved to Svelte, as
// globals, and mounts the moved sections into their containers, until 3.32 mounts the whole app. A .svelte.ts
// file, since the payloads the later sections take from the old scripts are $state.raw, which needs runes.
import { flushSync, mount, unmount } from 'svelte';
import Banner from './components/Banner.svelte';
import SummaryTiles from './components/SummaryTiles.svelte';
import { BannerMessages } from './lib/banner.svelte';
import * as charts from './lib/charts';
import * as colors from './lib/colors';
import * as compact from './lib/compact';
import * as format from './lib/format';
import * as live from './lib/live';
import * as overview from './lib/overview.svelte';
import * as paging from './lib/paging.svelte';
import * as payload from './lib/payload.svelte';
import * as prefs from './lib/prefs.svelte';
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
// the components and draws at once) and the session view's tile rows lib/overview.svelte.ts (`mountSessionKpis` and
// `mountSessionRuntime`, rows the old scripts put into the page). `tablePages`, `mountPager`, `payload` and the like
// reach the old scripts as globals, like everything else here. Their names must stay apart: a shared one would be
// handed over twice, the second silently winning. The overview's two tile rows, `#kpis` and `#runtime`, are mounted
// here from the payload, which `setPayload` sets.
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
type Overview = typeof overview;

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
  overview,
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
      Overview {
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
  // Mounted before the placeholder, which then goes, so the banner keeps its place and there is one alert.
  const banner = mount(Banner, { target: placeholder.parentElement, anchor: placeholder, props: { messages } });
  placeholder.remove();

  // The overview's tile rows, in the page's own containers, which keep their classes.
  const rows = tileContainers.map(({ id, container }) =>
    mount(SummaryTiles, { target: container, props: { rows: id } }),
  );

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
      // Reflect, since the Window interface declares them always there, which a plain delete refuses.
      Reflect.deleteProperty(target, 'showError');
      Reflect.deleteProperty(target, 'hasError');
      for (const name of MODULES.flatMap((module) => Object.keys(module))) Reflect.deleteProperty(target, name);
    },
  };
}
