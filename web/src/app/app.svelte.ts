// The page's shared state, one instance per page in a context: the components take what they use from `getApp()`, so
// two pages (the tests mount many) never share a payload, a range or a saved preference by accident.

import { createContext } from 'svelte';
import { BannerMessages } from './banner.svelte';
import { TablePages } from '../ui/paging.svelte';
import { Payload } from './payload.svelte';
import { Preferences } from './prefs.svelte';
import { RangeState } from './range.svelte';
import { pageWindow, type PageWindow } from '../ui/tables';
import { themeFooter, themeLabel } from './themes';

/** Everything the page's components share. The fields never change once made, only what they hold, so a component
 *  destructures what it needs once. */
export class AppState {
  /** What the page has loaded. */
  readonly payload = new Payload();
  /** The range shown. */
  readonly range = new RangeState();
  /** The saved preferences. */
  readonly preferences = new Preferences();
  /** The page each table is on. */
  readonly pages = new TablePages();
  /** The error banner's messages. */
  readonly messages = new BannerMessages();

  // Arrow properties, so a component can destructure them and still have `this`.

  /** A label as the chosen theme words it: the theme's wording if it has one, else the label. Reads the reactive
   *  theme. */
  readonly hype = (label: string): string => themeLabel(this.preferences.theme, label);

  /** The sentence the chosen theme adds to the page's footer, or empty. Reads the reactive theme. */
  readonly footerCopy = (): string => themeFooter(this.preferences.theme);

  /** The page a table shows: the one that holds its stored first unit at the current page size, kept within the
   *  `count` units there are. Reads the stored page and the page size, both reactive, so what draws from it follows a
   *  turned page and a new size. */
  readonly shownWindow = (key: string, count: number): PageWindow => {
    const { pageSize } = this.preferences;
    return pageWindow(count, pageSize, Math.floor(this.pages.first(key) / pageSize));
  };
}

/** The page's state: `getApp` in a component, `setApp` where the page (or a test's fixture) starts. */
export const [getApp, setApp] = createContext<AppState>();
