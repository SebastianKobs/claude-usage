import { render } from '@testing-library/svelte';
import { flushSync } from 'svelte';
import { expect, test } from 'vitest';
import XLabels from './XLabels.svelte';

function labels(count: number, extra: Record<string, unknown> = {}) {
  const view = render(XLabels, {
    count,
    xOf: (index: number) => 10 + index * 5,
    y: 130,
    text: (index: number) => `day ${index}`,
    ...extra,
  });
  return { ...view, texts: [...view.container.querySelectorAll('text')] };
}

test('every bucket is labelled while there are few', () => {
  const { texts } = labels(5);
  expect(texts.map((text) => text.textContent)).toEqual(['day 0', 'day 1', 'day 2', 'day 3', 'day 4']);
});

test('a label is middle-anchored at its bucket`s x and the given y, in the axis text class, in svg', () => {
  const { texts } = labels(3);
  expect(texts.map((text) => text.getAttribute('x'))).toEqual(['10', '15', '20']);
  for (const text of texts) {
    expect(text.getAttribute('y')).toBe('130');
    expect(text.getAttribute('text-anchor')).toBe('middle');
    expect(text).toHaveClass('axis-text');
    expect(text.namespaceURI).toBe('http://www.w3.org/2000/svg');
  }
});

test('more than eight buckets are thinned to about eight, evenly spaced from the first', () => {
  const { texts } = labels(30);
  expect(texts.map((text) => text.textContent)).toEqual(
    ['day 0', 'day 4', 'day 8', 'day 12', 'day 16', 'day 20', 'day 24', 'day 28'],
  );
});

test('`most` sets how many', () => {
  const { texts } = labels(30, { most: 3 });
  expect(texts.map((text) => text.textContent)).toEqual(['day 0', 'day 10', 'day 20']);
});

test('no buckets draw nothing', () => {
  expect(labels(0).texts).toEqual([]);
});

test('a new count thins again', () => {
  const { container, rerender } = labels(4);
  void rerender({ count: 16 });
  flushSync();
  expect(container.querySelectorAll('text')).toHaveLength(8);
});
