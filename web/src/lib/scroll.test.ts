import { afterEach, expect, test, vi } from 'vitest';
import { keepScroll, scrollAnchor } from './scroll';

/** An element whose box is where the test says, attached to the page unless told otherwise. */
function boxed(top: number, bottom: number, attached = true): HTMLElement {
  const node = document.createElement('div');
  node.getBoundingClientRect = () => ({ top, bottom }) as DOMRect;
  if (attached) document.body.append(node);
  return node;
}

afterEach(() => {
  document.body.replaceChildren();
  vi.restoreAllMocks();
});

test('the anchor is the first element still showing below the top of the window', () => {
  const above = boxed(-300, -100);
  const showing = boxed(-20, 80);
  const below = boxed(200, 300);
  expect(scrollAnchor([above, showing, below])).toEqual({ node: showing, top: -20 });
});

test('an element ending exactly at the top of the window is already gone', () => {
  const gone = boxed(-50, 0);
  const showing = boxed(0, 50);
  expect(scrollAnchor([gone, showing])?.node).toBe(showing);
});

test('with nothing showing there is no anchor', () => {
  expect(scrollAnchor([boxed(-300, -100)])).toBeNull();
  expect(scrollAnchor([])).toBeNull();
});

test('keeping the scroll moves the window by how far the element drifted', () => {
  const scrollBy = vi.spyOn(window, 'scrollBy').mockImplementation(() => undefined);
  const node = boxed(340, 400);
  keepScroll({ node, top: 100 }, node);
  expect(scrollBy).toHaveBeenCalledWith(0, 240);
});

test('it scrolls back toward the element that replaced the anchored one', () => {
  const scrollBy = vi.spyOn(window, 'scrollBy').mockImplementation(() => undefined);
  const old = boxed(100, 150);
  const replacement = boxed(60, 110);
  keepScroll({ node: old, top: 100 }, replacement);
  expect(scrollBy).toHaveBeenCalledWith(0, -40);
});

test('without an anchor, a node, or a node in the page it leaves the window alone', () => {
  const scrollBy = vi.spyOn(window, 'scrollBy').mockImplementation(() => undefined);
  const node = boxed(10, 20);
  keepScroll(null, node);
  keepScroll({ node, top: 0 }, null);
  keepScroll({ node, top: 0 }, undefined);
  keepScroll({ node, top: 0 }, boxed(10, 20, false));
  expect(scrollBy).not.toHaveBeenCalled();
});
