import { describe, expect, test } from 'vitest';
import {
  chartScale,
  chartWidth,
  cursorStep,
  gridY,
  MIN_CHART_WIDTH,
  pointerX,
  tooltipLeft,
  xLabelIndexes,
} from './chartkit';

describe('chartWidth', () => {
  test('follows the container', () => {
    expect(chartWidth(900)).toBe(900);
  });

  test('never drops below the minimum, so a narrow container scrolls the plot rather than crushing it', () => {
    expect(chartWidth(100)).toBe(MIN_CHART_WIDTH);
    expect(chartWidth(0)).toBe(MIN_CHART_WIDTH);
  });
});

describe('chartScale', () => {
  test('is how much the SVG is scaled to fit its container', () => {
    expect(chartScale(160, 320)).toBe(0.5);
    expect(chartScale(640, 640)).toBe(1);
  });

  test('is 1 before anything is measured', () => {
    expect(chartScale(0, 320)).toBe(1);
    expect(chartScale(320, 0)).toBe(1);
  });
});

describe('pointerX', () => {
  test('turns a pointer position into the chart coordinates', () => {
    expect(pointerX(150, 50, 200, 400)).toBe(200);
  });

  test('is unscaled where the SVG has no measured width', () => {
    expect(pointerX(150, 50, 0, 400)).toBe(100);
  });
});

describe('cursorStep', () => {
  test('steps one with the arrow keys, either direction on both axes', () => {
    expect(cursorStep('ArrowRight', 5, 30)).toBe(6);
    expect(cursorStep('ArrowUp', 5, 30)).toBe(6);
    expect(cursorStep('ArrowLeft', 5, 30)).toBe(4);
    expect(cursorStep('ArrowDown', 5, 30)).toBe(4);
  });

  test('jumps a tenth of the buckets with Page Up and Page Down', () => {
    expect(cursorStep('PageDown', 5, 100)).toBe(15);
    expect(cursorStep('PageUp', 50, 100)).toBe(40);
  });

  test('jumps at least one bucket for a short chart', () => {
    expect(cursorStep('PageDown', 2, 7)).toBe(3);
  });

  test('goes to the ends with Home and End', () => {
    expect(cursorStep('Home', 5, 30)).toBe(0);
    expect(cursorStep('End', 5, 30)).toBe(29);
  });

  test('stays within the buckets', () => {
    expect(cursorStep('ArrowLeft', 0, 30)).toBe(0);
    expect(cursorStep('ArrowRight', 29, 30)).toBe(29);
    expect(cursorStep('PageDown', 28, 100)).toBe(38);
    expect(cursorStep('PageUp', 3, 100)).toBe(0);
  });

  test('ignores every other key, so Tab still leaves the chart', () => {
    expect(cursorStep('Tab', 5, 30)).toBeNull();
    expect(cursorStep('a', 5, 30)).toBeNull();
  });
});

describe('tooltipLeft', () => {
  test('sits a little right of the anchor', () => {
    expect(tooltipLeft(100, 170, 800)).toBe(112);
  });

  test('keeps inside the container on the right', () => {
    expect(tooltipLeft(780, 170, 800)).toBe(630);
  });

  test('keeps inside the container on the left', () => {
    expect(tooltipLeft(-40, 170, 800)).toBe(0);
  });

  test('prefers the left edge where the tooltip is wider than the container', () => {
    expect(tooltipLeft(10, 400, 300)).toBe(0);
  });
});

describe('xLabelIndexes', () => {
  test('labels every bucket while there are few', () => {
    expect(xLabelIndexes(5)).toEqual([0, 1, 2, 3, 4]);
  });

  test('labels about eight evenly spaced buckets of many', () => {
    expect(xLabelIndexes(30)).toEqual([0, 4, 8, 12, 16, 20, 24, 28]);
  });

  test('takes the most it is given', () => {
    expect(xLabelIndexes(10, 2)).toEqual([0, 5]);
  });

  test('labels nothing for no buckets', () => {
    expect(xLabelIndexes(0)).toEqual([]);
  });
});

describe('gridY', () => {
  test('snaps to the pixel grid, so a one-pixel line stays sharp', () => {
    expect(gridY(10.2)).toBe(10.5);
    expect(gridY(10.7)).toBe(11.5);
  });
});
