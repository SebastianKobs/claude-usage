import { fireEvent, render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { flushSync, type ComponentProps } from 'svelte';
import { afterEach, describe, expect, test } from 'vitest';
import ChartFixture from './ChartFixture.test.svelte';

type Props = Partial<ComponentProps<typeof ChartFixture>>;

function chart(props: Props = {}) {
  const view = render(ChartFixture, props);
  return {
    ...view,
    get slider() {
      return screen.getByRole('slider');
    },
    svg: view.container.querySelector('svg') as SVGSVGElement,
  };
}

/** Gives the SVG a box on the page, as a browser lays it out: `left` from the page's edge, `width` wide. */
function layOut(svg: SVGSVGElement, left: number, width: number) {
  svg.getBoundingClientRect = () => new DOMRect(left, 0, width, 120);
}

const shownMark = () => screen.queryByTestId('mark');
const shownTip = () => screen.queryByTestId('tip-content');

describe('the frame', () => {
  test('the svg has the drawing as its viewBox and the height as an attribute, and no role', () => {
    const { svg } = chart({ width: 500 });
    expect(svg.getAttribute('viewBox')).toBe('0 0 500 120');
    expect(svg.getAttribute('height')).toBe('120');
    expect(svg.hasAttribute('role')).toBe(false);
  });

  test('it is a fragment: the svg and nothing else sit straight in the page`s chart div', () => {
    chart();
    const host = screen.getByTestId('host');
    expect([...host.children].map((child) => child.tagName.toLowerCase())).toEqual(['svg']);
  });

  test('the drawing is an image named by the label, holding the plot at the drawing width', () => {
    chart({ width: 500 });
    const image = screen.getByRole('img');
    expect(image).toHaveAccessibleName('The steps; table view available');
    const plot = screen.getByTestId('plot');
    expect(image).toContainElement(plot);
    expect(plot.getAttribute('width')).toBe('500');
    expect(plot.namespaceURI).toBe('http://www.w3.org/2000/svg');
  });

  test('the slider is not inside any image, which would make its children presentational', () => {
    const { slider } = chart();
    expect(slider.closest('[role="img"]')).toBeNull();
    expect(slider.parentElement?.tagName.toLowerCase()).toBe('svg');
  });

  test('without a cursor there is no slider, no marks and no tip', () => {
    chart({ withCursor: false });
    expect(screen.queryByRole('slider')).toBeNull();
    expect(screen.getByTestId('plot')).toBeInTheDocument();
    expect(shownMark()).toBeNull();
    expect(shownTip()).toBeNull();
  });

  test('without buckets there is no slider either', () => {
    chart({ count: 0 });
    expect(screen.queryByRole('slider')).toBeNull();
  });
});

describe('the slider', () => {
  test('it is the cursor layer: over its area, focusable, in the hit class', () => {
    const { slider } = chart({ width: 400 });
    expect(slider).toHaveClass('hit');
    expect(slider.tagName.toLowerCase()).toBe('rect');
    expect(slider.getAttribute('tabindex')).toBe('0');
    expect(slider.getAttribute('x')).toBe('40');
    expect(slider.getAttribute('y')).toBe('0');
    expect(slider.getAttribute('width')).toBe('320');
    expect(slider.getAttribute('height')).toBe('100');
  });

  test('it never collapses to nothing, even where the area has no width', () => {
    const { slider } = chart({ width: 60 });
    expect(slider.getAttribute('width')).toBe('1');
  });

  test('it is named by the cursor, runs from 1 to the count and starts at the last bucket', () => {
    const { slider } = chart();
    expect(slider).toHaveAccessibleName('Steps; arrow keys step through them');
    expect(slider.getAttribute('aria-valuemin')).toBe('1');
    expect(slider.getAttribute('aria-valuemax')).toBe('10');
    expect(slider.getAttribute('aria-valuenow')).toBe('10');
    expect(slider.getAttribute('aria-valuetext')).toBe('bucket 9');
  });

  test('the drawing is wider with its container: the area follows the width', () => {
    const { slider, rerender } = chart({ width: 400 });
    void rerender({ width: 600 });
    flushSync();
    expect(slider.getAttribute('width')).toBe('520');
  });

  test('fewer buckets keep a picked one inside them', async () => {
    const { slider, rerender } = chart();
    await userEvent.tab();
    await userEvent.keyboard('{Home}');
    await userEvent.keyboard('{End}');
    expect(slider.getAttribute('aria-valuenow')).toBe('10');
    void rerender({ count: 4 });
    flushSync();
    expect(slider.getAttribute('aria-valuenow')).toBe('4');
    expect(slider.getAttribute('aria-valuetext')).toBe('bucket 3');
  });
});

describe('the keyboard', () => {
  test.each([
    ['{ArrowLeft}', 8],
    ['{ArrowDown}', 8],
    ['{Home}', 0],
    ['{PageUp}', 8],
    ['{ArrowRight}', 9],
    ['{ArrowUp}', 9],
    ['{End}', 9],
    ['{PageDown}', 9],
  ])('%s from the last bucket goes to bucket %i', async (key, expected) => {
    const { slider } = chart();
    await userEvent.tab();
    expect(slider).toHaveFocus();
    await userEvent.keyboard(key);
    expect(slider.getAttribute('aria-valuenow')).toBe(String(expected + 1));
    expect(slider.getAttribute('aria-valuetext')).toBe(`bucket ${expected}`);
  });

  test('steps add up, stay within the buckets and stop at the ends', async () => {
    const { slider } = chart();
    await userEvent.tab();
    await userEvent.keyboard('{Home}{ArrowLeft}{PageUp}');
    expect(slider.getAttribute('aria-valuenow')).toBe('1');
    await userEvent.keyboard('{ArrowRight}{ArrowRight}{PageDown}');
    expect(slider.getAttribute('aria-valuenow')).toBe('4');
    await userEvent.keyboard('{End}{ArrowRight}{PageDown}');
    expect(slider.getAttribute('aria-valuenow')).toBe('10');
  });

  test.each(['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End'])(
    '%s is handled: its default is prevented',
    async (key) => {
      const { slider } = chart();
      expect(await fireEvent.keyDown(slider, { key })).toBe(false);
    },
  );

  test.each(['Tab', 'a', 'Enter', ' ', 'Escape', 'Shift'])('%s is left alone', async (key) => {
    const { slider } = chart();
    expect(await fireEvent.keyDown(slider, { key })).toBe(true);
    expect(slider.getAttribute('aria-valuenow')).toBe('10');
  });

  test('Tab moves on and a letter changes nothing', async () => {
    const { slider } = chart();
    await userEvent.tab();
    await userEvent.keyboard('x');
    expect(slider.getAttribute('aria-valuenow')).toBe('10');
    await userEvent.tab();
    expect(slider).not.toHaveFocus();
  });
});

describe('marks and tooltip', () => {
  test('neither shows while the cursor is away', () => {
    chart();
    expect(shownMark()).toBeNull();
    expect(shownTip()).toBeNull();
  });

  test('focus shows them for the last bucket, the marks inside the drawing with the width', async () => {
    chart({ width: 400 });
    await userEvent.tab();
    const mark = screen.getByTestId('mark');
    expect(mark.dataset.index).toBe('9');
    expect(mark.dataset.width).toBe('400');
    expect(screen.getByRole('img')).toContainElement(mark);
    expect(shownTip()).toHaveTextContent('tip 9');
  });

  test('keys move them, and a bucket picked earlier is where focus returns', async () => {
    const { slider } = chart();
    await userEvent.tab();
    await userEvent.keyboard('{Home}');
    expect(shownMark()?.dataset.index).toBe('0');
    expect(shownTip()).toHaveTextContent('tip 0');
    await userEvent.tab();
    expect(shownMark()).toBeNull();
    slider.focus();
    flushSync();
    expect(shownMark()?.dataset.index).toBe('0');
  });

  test('blur hides them', async () => {
    chart();
    await userEvent.tab();
    expect(shownMark()).not.toBeNull();
    await userEvent.tab();
    expect(shownMark()).toBeNull();
    expect(shownTip()).toBeNull();
  });

  test('the pointer leaving hides them', async () => {
    const { slider, svg } = chart();
    layOut(svg, 0, 400);
    await fireEvent.pointerMove(slider, { clientX: 100 });
    expect(shownMark()).not.toBeNull();
    await fireEvent.pointerLeave(slider);
    expect(shownMark()).toBeNull();
    expect(shownTip()).toBeNull();
  });

  test('a chart without a tip draws marks only', async () => {
    chart({ withTip: false });
    await userEvent.tab();
    expect(shownMark()).not.toBeNull();
    expect(shownTip()).toBeNull();
    expect(document.querySelector('.tooltip')).toBeNull();
  });
});

describe('the pointer', () => {
  test('it picks the bucket under it, and the slider says so', async () => {
    const { slider, svg } = chart({ width: 400, containerWidth: 400 });
    layOut(svg, 0, 400);
    await fireEvent.pointerMove(slider, { clientX: 40 });
    expect(slider.getAttribute('aria-valuenow')).toBe('1');
    expect(shownMark()?.dataset.index).toBe('0');
    await fireEvent.pointerMove(slider, { clientX: 200 });
    expect(slider.getAttribute('aria-valuetext')).toBe('bucket 5');
    expect(shownTip()).toHaveTextContent('tip 5');
  });

  test('the svg`s place on the page is taken off the pointer`s', async () => {
    const { slider, svg } = chart({ width: 400, containerWidth: 400 });
    layOut(svg, 300, 400);
    await fireEvent.pointerMove(slider, { clientX: 340 });
    expect(slider.getAttribute('aria-valuetext')).toBe('bucket 0');
  });

  test('a container narrower than the drawing scales the pointer back into the drawing', async () => {
    const { slider, svg } = chart({ width: 400, containerWidth: 200 });
    layOut(svg, 0, 200);
    await fireEvent.pointerMove(slider, { clientX: 100 });
    expect(slider.getAttribute('aria-valuetext')).toBe('bucket 5');
  });

  test('a bucket picked by the pointer is where the keys go on from', async () => {
    const { slider, svg } = chart({ width: 400 });
    layOut(svg, 0, 400);
    await fireEvent.pointerMove(slider, { clientX: 40 });
    await fireEvent.keyDown(slider, { key: 'ArrowRight' });
    expect(slider.getAttribute('aria-valuetext')).toBe('bucket 1');
  });

  test('a pointer beyond the ends stays on the first and the last bucket', async () => {
    const { slider, svg } = chart({ width: 400 });
    layOut(svg, 0, 400);
    await fireEvent.pointerMove(slider, { clientX: -500 });
    expect(slider.getAttribute('aria-valuetext')).toBe('bucket 0');
    await fireEvent.pointerMove(slider, { clientX: 5000 });
    expect(slider.getAttribute('aria-valuetext')).toBe('bucket 9');
  });
});

describe('the tooltip`s place', () => {
  afterEach(() => {
    Reflect.deleteProperty(HTMLElement.prototype, 'clientWidth');
    Reflect.deleteProperty(HTMLElement.prototype, 'offsetWidth');
  });

  function tooltip(): HTMLElement {
    const box = document.querySelector<HTMLElement>('.tooltip');
    if (!box) throw new Error('no tooltip shown');
    return box;
  }

  /** A container `width` wide with a tooltip `tooltipWidth` wide, as the browser would measure them. */
  function measure(width: number, tooltipWidth: number) {
    Object.defineProperty(HTMLElement.prototype, 'clientWidth', { configurable: true, get: () => width });
    Object.defineProperty(HTMLElement.prototype, 'offsetWidth', { configurable: true, get: () => tooltipWidth });
  }

  test('it sits 12px right of the bucket`s anchor, at the top given', async () => {
    measure(400, 80);
    chart({ width: 400, containerWidth: 400, tipTop: 20 });
    await userEvent.tab();
    await userEvent.keyboard('{Home}');
    expect(tooltip().style.left).toBe('52px');
    expect(tooltip().style.top).toBe('20px');
  });

  test('the top is 8px by default', async () => {
    measure(400, 80);
    chart();
    await userEvent.tab();
    expect(tooltip().style.top).toBe('8px');
  });

  test('it is a div of the tooltip class after the svg, placed through the CSSOM, not a style attribute', async () => {
    measure(400, 80);
    const { svg } = chart();
    await userEvent.tab();
    expect(tooltip()).toHaveClass('tooltip');
    expect(tooltip().previousElementSibling).toBe(svg);
    expect(tooltip().parentElement).toBe(screen.getByTestId('host'));
    expect(tooltip().style.left).not.toBe('');
  });

  test('it stays inside the container`s right edge', async () => {
    measure(400, 80);
    chart({ width: 400, containerWidth: 400 });
    await userEvent.tab();
    expect(tooltip().style.left).toBe('320px');
  });

  test('it never goes left of the container, even where it is wider than it', async () => {
    measure(50, 80);
    chart({ width: 400, containerWidth: 50 });
    await userEvent.tab();
    await userEvent.keyboard('{Home}');
    expect(tooltip().style.left).toBe('0px');
  });

  test('a container narrower than the drawing scales the anchor', async () => {
    measure(200, 40);
    chart({ width: 400, containerWidth: 200 });
    await userEvent.tab();
    await userEvent.keyboard('{Home}');
    // bucket 0 is at x = 40 in the drawing, 20 in the container, and the tooltip 12px beyond
    expect(tooltip().style.left).toBe('32px');
  });

  test('it moves with the bucket', async () => {
    measure(1000, 10);
    chart({ width: 1000, containerWidth: 1000 });
    await userEvent.tab();
    await userEvent.keyboard('{Home}');
    const first = tooltip().style.left;
    await userEvent.keyboard('{ArrowRight}');
    expect(Number.parseFloat(tooltip().style.left)).toBeGreaterThan(Number.parseFloat(first));
  });
});
