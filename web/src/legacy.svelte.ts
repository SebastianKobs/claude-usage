// The bridge between the bundle and the page's old classic scripts: it hands them what has moved to Svelte, as
// globals, and mounts the moved sections into their containers, until 3.32 mounts the whole app. A .svelte.ts
// file, since the payloads the later sections take from the old scripts are $state.raw, which needs runes.
import { flushSync, mount, unmount } from 'svelte';
import Banner from './components/Banner.svelte';
import { BannerMessages } from './lib/banner.svelte';

declare global {
  interface Window {
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

  return {
    stop(): void {
      void unmount(banner);
      // Reflect, since the Window interface declares them always there, which a plain delete refuses.
      Reflect.deleteProperty(target, 'showError');
      Reflect.deleteProperty(target, 'hasError');
    },
  };
}
