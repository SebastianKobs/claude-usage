// The bridge between the bundle and the page's old classic scripts: it hands them what has moved to Svelte, as
// globals, and mounts the moved sections into their containers, until 3.32 mounts the whole app. A .svelte.ts
// file, since the payloads the later sections take from the old scripts are $state.raw, which needs runes.
import { flushSync, mount, unmount } from 'svelte';
import Banner from './components/Banner.svelte';
import { BannerMessages } from './lib/banner.svelte';
import * as charts from './lib/charts';
import * as colors from './lib/colors';
import * as compact from './lib/compact';
import * as format from './lib/format';
import * as live from './lib/live';
import * as secrets from './lib/secrets';
import * as tables from './lib/tables';

// Typed from the modules themselves, so what Window declares can't drift from what the old scripts are handed. The
// formatters are lib/format.ts (numbers, money, durations, days, hours, moments), the colors lib/colors.ts (the
// chart palette's slots, models and effort shades), compacting lib/compact.ts (when compacting pays off, the call to
// compact, the delegate hint, the verdict's tone and the compactions' sum), the secrets lib/secrets.ts (the secret
// access tone, origin and reach words), the live cards lib/live.ts (their badges and what waits) and the tables
// lib/tables.ts (paging, the sessions filter and count, the Tools table's rows, folds and labels, the conversation's
// order) and the charts lib/charts.ts (scales and ticks, the time axis, the by-model series and stacks, the rate-limit
// counts and windows, the cost bars' split). Their names must stay apart: a shared one would be handed over twice, the
// second silently winning.
type Formatters = typeof format;
type Colors = typeof colors;
type Compacting = typeof compact;
type Secrets = typeof secrets;
type Live = typeof live;
type Tables = typeof tables;
type Charts = typeof charts;

// Every module handed over: a new one is imported above, typed in Window's extends and listed here.
const MODULES = [format, colors, compact, secrets, live, tables, charts];

declare global {
  interface Window extends Formatters, Colors, Compacting, Secrets, Live, Tables, Charts {
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
  // Mounted before the placeholder, which then goes, so the banner keeps its place and there is one alert.
  const banner = mount(Banner, { target: placeholder.parentElement, anchor: placeholder, props: { messages } });
  placeholder.remove();

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
      // Reflect, since the Window interface declares them always there, which a plain delete refuses.
      Reflect.deleteProperty(target, 'showError');
      Reflect.deleteProperty(target, 'hasError');
      for (const name of MODULES.flatMap((module) => Object.keys(module))) Reflect.deleteProperty(target, name);
    },
  };
}
