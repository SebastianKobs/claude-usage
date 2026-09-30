import { render } from '@testing-library/svelte';
import { flushSync } from 'svelte';
import { expect, test } from 'vitest';
import YAxis from './YAxis.svelte';

const SVG = 'http://www.w3.org/2000/svg';

function axis(values = [0, 5, 10], extra: Record<string, unknown> = {}) {
  const view = render(YAxis, {
    left: 50,
    right: 350,
    values,
    yOf: (value: number) => 100 - value * 10,
    format: (value: number) => `${value} tok`,
    ...extra,
  });
  return {
    ...view,
    lines: [...view.container.querySelectorAll('line')],
    labels: [...view.container.querySelectorAll('text')],
  };
}

test('it draws a gridline and a label for each value, in svg', () => {
  const { lines, labels } = axis();
  expect(lines).toHaveLength(3);
  expect(labels).toHaveLength(3);
  expect(lines[0]?.namespaceURI).toBe(SVG);
  expect(labels[0]?.namespaceURI).toBe(SVG);
});

test('the first line, 0, is in the axis color and the others in the grid color, one pixel wide', () => {
  const { lines } = axis();
  expect(lines.map((line) => line.getAttribute('stroke'))).toEqual(['var(--axis)', 'var(--grid)', 'var(--grid)']);
  expect(lines.map((line) => line.getAttribute('stroke-width'))).toEqual(['1', '1', '1']);
});

test('a line spans from left to right at its value`s y, snapped to the pixel grid', () => {
  const { lines } = axis([0, 5, 10], { yOf: (value: number) => 100.3 - value * 10 });
  expect(lines.map((line) => line.getAttribute('y1'))).toEqual(['100.5', '50.5', '0.5']);
  for (const line of lines) {
    expect(line.getAttribute('x1')).toBe('50');
    expect(line.getAttribute('x2')).toBe('350');
    expect(line.getAttribute('y2')).toBe(line.getAttribute('y1'));
  }
});

test('a label is right-aligned 8px left of the plot, 4px under its line, in the axis text class, formatted', () => {
  const { labels } = axis();
  expect(labels.map((label) => label.textContent)).toEqual(['0 tok', '5 tok', '10 tok']);
  for (const label of labels) {
    expect(label.getAttribute('x')).toBe('42');
    expect(label.getAttribute('text-anchor')).toBe('end');
    expect(label).toHaveClass('axis-text');
  }
  expect(labels.map((label) => label.getAttribute('y'))).toEqual(['104.5', '54.5', '4.5']);
});

test('no values draw nothing', () => {
  const { container } = axis([]);
  expect(container.querySelector('line, text')).toBeNull();
});

test('new values redraw, keeping the line of a value that stays', () => {
  const { container, rerender, lines } = axis([0, 5]);
  void rerender({ values: [0, 8, 16] });
  flushSync();
  expect(container.querySelectorAll('line')).toHaveLength(3);
  expect(container.querySelector('line')).toBe(lines[0]);
  expect([...container.querySelectorAll('text')].map((label) => label.textContent)).toEqual([
    '0 tok',
    '8 tok',
    '16 tok',
  ]);
});
