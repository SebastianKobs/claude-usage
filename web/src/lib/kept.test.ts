import * as svelte from 'svelte';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { keepingView } from './kept';

// the real flushSync, watched: a draw must be in the page before the reader's place is put back
vi.mock('svelte', async (original) => {
  const actual = await original<typeof import('svelte')>();
  return { ...actual, flushSync: vi.fn(actual.flushSync) };
});

let panel: HTMLElement;

beforeEach(() => {
  document.body.innerHTML =
    '<button id="outside">outside</button>' +
    '<div id="drilldown"><h2 id="drilldown-title" tabindex="-1">Title</h2>' +
    '<section id="one"><button id="first">first</button></section>' +
    '<section id="two"><button>second</button><details><summary>more</summary>text</details>' +
    '<a href="#x" id="link">link</a></section></div>';
  panel = document.getElementById('drilldown') as HTMLElement;
});

afterEach(() => {
  vi.restoreAllMocks();
  document.body.innerHTML = '';
});

/** Draws the panel again: its sections are new nodes with the same content, the way a refreshed view is. */
function redraw(edit: (host: HTMLElement) => void = () => undefined): void {
  const fresh = panel.cloneNode(true) as HTMLElement;
  edit(fresh);
  panel.replaceChildren(...fresh.childNodes);
}

describe('without the view open', () => {
  test('only draws', () => {
    panel.remove();
    const draw = vi.fn();
    keepingView(draw);
    expect(draw).toHaveBeenCalledTimes(1);
  });
});

describe('focus', () => {
  test('stays on the same element where it is still in the page, whatever was added before it', () => {
    const button = panel.querySelectorAll('button')[1] as HTMLElement;
    button.focus();
    keepingView(() => panel.prepend(Object.assign(document.createElement('a'), { href: '#new' })));
    expect(document.activeElement).toBe(button);
  });

  test('goes to the element with the same id where the node was replaced, wherever it is now', () => {
    (document.getElementById('first') as HTMLElement).focus();
    const extra = Object.assign(document.createElement('button'), { id: 'new' });
    keepingView(() => redraw((host) => host.querySelector('#one')?.prepend(extra)));
    expect(document.activeElement?.id).toBe('first');
    expect(document.activeElement?.isConnected).toBe(true);
  });

  test('goes to a summary at the same position where it has no id', () => {
    (panel.querySelector('summary') as HTMLElement).focus();
    keepingView(() => redraw());
    expect(document.activeElement?.tagName).toBe('SUMMARY');
    expect(document.activeElement?.isConnected).toBe(true);
  });

  test('is put back without scrolling to it', () => {
    const focus = vi.spyOn(HTMLElement.prototype, 'focus');
    (document.getElementById('first') as HTMLElement).focus();
    focus.mockClear();
    keepingView(() => redraw());
    expect(focus).toHaveBeenCalledExactlyOnceWith({ preventScroll: true });
  });

  test('draws at once, before the place is put back', () => {
    const order: string[] = [];
    vi.mocked(svelte.flushSync).mockImplementationOnce(() => void order.push('flush'));
    keepingView(() => order.push('draw'));
    expect(order).toEqual(['draw', 'flush']);
  });

  test('goes to the focusable element at the same position where it has no id', () => {
    const second = panel.querySelectorAll('button')[1] as HTMLElement;
    second.focus();
    keepingView(() => redraw());
    expect(document.activeElement?.textContent).toBe('second');
    expect(document.activeElement?.isConnected).toBe(true);
  });

  test('goes to the heading where nothing is left to go to', () => {
    (document.getElementById('link') as HTMLElement).focus();
    keepingView(() => panel.replaceChildren(...[...panel.children].slice(0, 1)));
    expect(document.activeElement?.id).toBe('drilldown-title');
  });

  test('is left where it is outside the view', () => {
    const outside = document.getElementById('outside') as HTMLElement;
    outside.focus();
    keepingView(() => redraw());
    expect(document.activeElement).toBe(outside);
  });

  test('is not pulled into the view where it was outside, whatever becomes of it', () => {
    const outside = document.getElementById('outside') as HTMLElement;
    outside.focus();
    keepingView(() => outside.remove());
    expect(panel.contains(document.activeElement)).toBe(false);
  });

  test('is not moved where none was in the view', () => {
    keepingView(() => redraw());
    expect(document.activeElement).toBe(document.body);
  });
});

describe('scroll', () => {
  function boxes(tops: Map<Element, number>): void {
    vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function (this: Element) {
      const top = tops.get(this) ?? -500;
      return { top, bottom: top + 50, left: 0, right: 0, width: 0, height: 50, x: 0, y: top, toJSON: () => ({}) };
    });
  }

  test('keeps the element at the top of the window where it was', () => {
    const scroll = vi.spyOn(window, 'scrollBy').mockImplementation(() => undefined);
    const anchor = document.getElementById('two') as HTMLElement;
    const tops = new Map<Element, number>([[anchor, 100]]);
    boxes(tops);
    keepingView(() => tops.set(anchor, 160));
    expect(scroll).toHaveBeenCalledWith(0, 60);
  });

  test('follows the element that replaced it, by position', () => {
    const scroll = vi.spyOn(window, 'scrollBy').mockImplementation(() => undefined);
    const anchor = document.getElementById('two') as HTMLElement;
    const tops = new Map<Element, number>([[anchor, 100]]);
    boxes(tops);
    keepingView(() => {
      redraw();
      tops.set(document.getElementById('two') as HTMLElement, 130);
    });
    expect(scroll).toHaveBeenCalledWith(0, 30);
  });

  test('does nothing where nothing shows at the top', () => {
    const scroll = vi.spyOn(window, 'scrollBy').mockImplementation(() => undefined);
    boxes(new Map());
    keepingView(() => redraw());
    expect(scroll).not.toHaveBeenCalled();
  });
});
