import { render, screen } from '@testing-library/svelte';
import { createRawSnippet, flushSync } from 'svelte';
import { afterEach, expect, test } from 'vitest';
import ChartTooltip from './ChartTooltip.svelte';

const children = createRawSnippet(() => ({ render: () => '<span data-testid="content">12 tokens</span>' }));

/** A container `width` wide, and every tooltip `tooltipWidth` wide, as the browser would measure them. */
function measure(width: number, tooltipWidth: number) {
  Object.defineProperty(HTMLElement.prototype, 'clientWidth', { configurable: true, get: () => width });
  Object.defineProperty(HTMLElement.prototype, 'offsetWidth', { configurable: true, get: () => tooltipWidth });
}

function tooltipIn(props: { anchor: number; top?: number }) {
  const host = document.createElement('div');
  document.body.append(host);
  const view = render(ChartTooltip, { target: host, props: { ...props, children } });
  const box = host.querySelector<HTMLElement>('div.tooltip');
  if (!box) throw new Error('no tooltip drawn');
  return { ...view, box, host };
}

afterEach(() => {
  Reflect.deleteProperty(HTMLElement.prototype, 'clientWidth');
  Reflect.deleteProperty(HTMLElement.prototype, 'offsetWidth');
});

test('the tooltip is a div of the tooltip class holding its content', () => {
  measure(400, 80);
  const { box } = tooltipIn({ anchor: 10 });
  expect(box.tagName).toBe('DIV');
  expect(box).toContainElement(screen.getByTestId('content'));
});

test('it sits 12px right of the anchor at the default top of 8px', () => {
  measure(400, 80);
  const { box } = tooltipIn({ anchor: 100 });
  expect(box.style.left).toBe('112px');
  expect(box.style.top).toBe('8px');
});

test('it takes the top it is given', () => {
  measure(400, 80);
  expect(tooltipIn({ anchor: 100, top: 30 }).box.style.top).toBe('30px');
});

test('it is clamped to the container`s right edge', () => {
  measure(400, 80);
  expect(tooltipIn({ anchor: 390 }).box.style.left).toBe('320px');
});

test('it is never left of the container, even when wider than it', () => {
  measure(50, 80);
  expect(tooltipIn({ anchor: 10 }).box.style.left).toBe('0px');
});

test('it is placed through the CSSOM: left and top, nothing else', () => {
  measure(400, 80);
  const { box } = tooltipIn({ anchor: 100 });
  expect(box.style.getPropertyValue('left')).toBe('112px');
  expect(box.style.length).toBe(2);
});

test('a new anchor or top moves it without drawing another', () => {
  measure(400, 80);
  const { box, host, rerender } = tooltipIn({ anchor: 100 });
  void rerender({ anchor: 200, top: 4 });
  flushSync();
  expect(host.querySelectorAll('div.tooltip')).toHaveLength(1);
  expect(box.style.left).toBe('212px');
  expect(box.style.top).toBe('4px');
});
