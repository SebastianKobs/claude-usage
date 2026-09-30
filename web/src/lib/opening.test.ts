import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { opening } from './opening.ts';

/** A page with a list of links, two sections to step aside and the view's root with its heading. */
function page(): { root: HTMLElement; links: HTMLAnchorElement[]; heading: HTMLElement } {
  document.body.innerHTML = `
    <div id="filters"><a href="#session/one">One</a></div>
    <div id="summary"><a href="#session/two">Two</a></div>
    <section id="view"><h2 id="view-title" tabindex="-1">Title</h2></section>`;
  return {
    root: document.getElementById('view')!,
    links: [...document.querySelectorAll<HTMLAnchorElement>('#summary a, #filters a')],
    heading: document.getElementById('view-title')!,
  };
}

const OPTIONS = { hide: ['filters', 'summary', 'missing'], focus: '#view-title' };

/** Runs the attachment as Svelte does, on the root, and returns what it cleans up with. */
function open(root: HTMLElement): () => void {
  const cleanup = opening(OPTIONS)(root);
  return cleanup as () => void;
}

let scrollTo: ReturnType<typeof vi.fn>;
let scrollIntoView: ReturnType<typeof vi.fn>;

beforeEach(() => {
  scrollTo = vi.fn();
  scrollIntoView = vi.fn();
  window.scrollTo = scrollTo as unknown as typeof window.scrollTo;
  Element.prototype.scrollIntoView = scrollIntoView as unknown as typeof Element.prototype.scrollIntoView;
});

afterEach(() => {
  document.body.innerHTML = '';
});

describe('opening', () => {
  test('hides the sections named, leaving out one that is not in the page', () => {
    const { root } = page();
    open(root);
    expect(document.getElementById('filters')?.hidden).toBe(true);
    expect(document.getElementById('summary')?.hidden).toBe(true);
  });

  test('scrolls the view to the top and focuses its heading', () => {
    const { root, heading } = page();
    open(root);
    expect(scrollIntoView).toHaveBeenCalledWith({ block: 'start' });
    expect(document.activeElement).toBe(heading);
  });

  test('focuses nothing where the view has no such element', () => {
    const { root, links } = page();
    links[1]!.focus();
    opening({ hide: [], focus: '#nowhere' })(root);
    expect(document.activeElement).toBe(links[1]);
  });
});

describe('closing', () => {
  test('shows the sections again', () => {
    const { root } = page();
    open(root)();
    expect(document.getElementById('filters')?.hidden).toBe(false);
    expect(document.getElementById('summary')?.hidden).toBe(false);
  });

  test('returns focus to the link that was focused when the view opened, not to the heading', () => {
    const { root, links } = page();
    links[1]!.focus();
    const close = open(root);
    expect(document.activeElement).not.toBe(links[1]);
    close();
    expect(document.activeElement).toBe(links[1]);
  });

  test('notes the link before the page is hidden, which would drop its focus', () => {
    const { root, links } = page();
    links[0]!.focus();
    const close = open(root);
    links[0]!.closest<HTMLElement>('#filters')!.hidden = false;
    close();
    expect(document.activeElement).toBe(links[0]);
  });

  test('scrolls back to where the page was', () => {
    const { root } = page();
    Object.defineProperty(window, 'scrollY', { value: 340, configurable: true });
    const close = open(root);
    Object.defineProperty(window, 'scrollY', { value: 0, configurable: true });
    close();
    expect(scrollTo).toHaveBeenCalledWith(0, 340);
  });

  test('returns to the very link that opened it where another link has the same address', () => {
    const { root, links } = page();
    const twin = document.createElement('a');
    twin.setAttribute('href', '#session/one');
    links[0]!.before(twin);
    links[0]!.focus();
    const close = open(root);
    close();
    expect(document.activeElement).toBe(links[0]);
  });

  test('finds the link by its address where the page was drawn again and the node is gone', () => {
    const { root, links } = page();
    links[1]!.focus();
    const close = open(root);
    const fresh = document.createElement('a');
    fresh.href = '#session/two';
    fresh.setAttribute('href', '#session/two');
    links[1]!.replaceWith(fresh);
    close();
    expect(document.activeElement).toBe(fresh);
  });

  test('has nowhere to return focus to where none was on a link, and then leaves focus alone', () => {
    const { root, heading } = page();
    (document.activeElement as HTMLElement | null)?.blur();
    const close = open(root);
    close();
    expect(document.activeElement).toBe(heading);
  });
});
