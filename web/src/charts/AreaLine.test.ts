import { render } from '@testing-library/svelte';
import { flushSync } from 'svelte';
import { expect, test } from 'vitest';
import AreaLine from './AreaLine.svelte';

function line(values = [2, 4, 3], extra: Record<string, unknown> = {}) {
  const view = render(AreaLine, {
    values,
    xOf: (index: number) => 10 + index * 20,
    yOf: (value: number) => 100 - value * 10,
    bottom: 100,
    color: 'var(--series-1)',
    ...extra,
  });
  return { ...view, paths: [...view.container.querySelectorAll('path')] };
}

test('it draws the area, then the line, in svg', () => {
  const { paths } = line();
  expect(paths).toHaveLength(2);
  expect(paths[0]?.namespaceURI).toBe('http://www.w3.org/2000/svg');
});

test('the area is the line closed down to the bottom, filled faintly in the color', () => {
  const { paths } = line();
  const area = paths[0];
  expect(area?.getAttribute('d')).toBe('M10,100L10.0,80.0L30.0,60.0L50.0,70.0L50,100Z');
  expect(area?.getAttribute('fill')).toBe('var(--series-1)');
  expect(area?.getAttribute('fill-opacity')).toBe('0.1');
});

test('the line is 2px, round, unfilled, in the color', () => {
  const stroke = line().paths[1];
  expect(stroke?.getAttribute('d')).toBe('M10.0,80.0L30.0,60.0L50.0,70.0');
  expect(stroke?.getAttribute('fill')).toBe('none');
  expect(stroke?.getAttribute('stroke')).toBe('var(--series-1)');
  expect(stroke?.getAttribute('stroke-width')).toBe('2');
  expect(stroke?.getAttribute('stroke-linejoin')).toBe('round');
  expect(stroke?.getAttribute('stroke-linecap')).toBe('round');
});

test('one value is a point: a line and an area of one', () => {
  const { paths } = line([5]);
  expect(paths[1]?.getAttribute('d')).toBe('M10.0,50.0');
  expect(paths[0]?.getAttribute('d')).toBe('M10,100L10.0,50.0L10,100Z');
});

test('no values draw nothing', () => {
  expect(line([]).paths).toEqual([]);
});

test('new values and a new color redraw the same paths', () => {
  const { container, rerender, paths } = line();
  void rerender({ values: [1, 1], color: 'red' });
  flushSync();
  expect(container.querySelectorAll('path')).toHaveLength(2);
  expect(container.querySelector('path')).toBe(paths[0]);
  expect(paths[1]?.getAttribute('d')).toBe('M10.0,90.0L30.0,90.0');
  expect(paths[1]?.getAttribute('stroke')).toBe('red');
});
