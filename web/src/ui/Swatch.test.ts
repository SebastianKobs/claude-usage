import { render } from '@testing-library/svelte';
import { flushSync } from 'svelte';
import { expect, test } from 'vitest';
import Swatch from './Swatch.svelte';

function swatchOf(fill: string | null): HTMLElement {
  const { container } = render(Swatch, { fill });
  const swatch = container.querySelector<HTMLElement>('span');
  if (!swatch) throw new Error('no swatch drawn');
  return swatch;
}

test('the swatch is an empty span of the swatch class, which the stylesheet sizes', () => {
  const swatch = swatchOf('red');
  expect(swatch).toHaveClass('swatch');
  expect(swatch.textContent).toBe('');
});

test.each(['red', 'var(--series-1)', 'linear-gradient(45deg, red, blue)'])('the fill %s is its background', (fill) => {
  const swatch = swatchOf(fill);
  expect(swatch.style.background).toBe(fill);
  expect(swatch.style.getPropertyValue('background')).toBe(fill);
});

test('null draws the default swatch: no inline background and no style attribute', () => {
  const swatch = swatchOf(null);
  expect(swatch.style.background).toBe('');
  expect(swatch.hasAttribute('style')).toBe(false);
});

test('a new fill changes the background and null removes it again', () => {
  const { container, rerender } = render(Swatch, { fill: 'red' });
  const swatch = container.querySelector<HTMLElement>('span');
  void rerender({ fill: 'blue' });
  flushSync();
  expect(swatch?.style.background).toBe('blue');
  void rerender({ fill: null });
  flushSync();
  expect(swatch?.style.background).toBe('');
});
