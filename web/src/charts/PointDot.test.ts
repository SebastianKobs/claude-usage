import { render } from '@testing-library/svelte';
import { flushSync } from 'svelte';
import { expect, test } from 'vitest';
import PointDot from './PointDot.svelte';

function dot() {
  const view = render(PointDot, { x: 30, y: 40, color: 'var(--series-2)' });
  const circle = view.container.querySelector('circle');
  if (!circle) throw new Error('no dot drawn');
  return { ...view, circle };
}

test('the dot is an svg circle of radius 4 at the point, in the color', () => {
  const { circle } = dot();
  expect(circle.namespaceURI).toBe('http://www.w3.org/2000/svg');
  expect(circle.getAttribute('cx')).toBe('30');
  expect(circle.getAttribute('cy')).toBe('40');
  expect(circle.getAttribute('r')).toBe('4');
  expect(circle.getAttribute('fill')).toBe('var(--series-2)');
});

test('it is ringed in the surface color, 2px', () => {
  const { circle } = dot();
  expect(circle.getAttribute('stroke')).toBe('var(--surface)');
  expect(circle.getAttribute('stroke-width')).toBe('2');
});

test('a new point moves the same dot', () => {
  const { container, circle, rerender } = dot();
  void rerender({ x: 5, y: 6, color: 'red' });
  flushSync();
  expect(container.querySelectorAll('circle')).toHaveLength(1);
  expect(circle.getAttribute('cx')).toBe('5');
  expect(circle.getAttribute('cy')).toBe('6');
  expect(circle.getAttribute('fill')).toBe('red');
});
