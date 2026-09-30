import { expect, test } from 'vitest';
import {
  BACKGROUND_EFFORT,
  EFFORT_ORDER,
  EFFORT_SHADES,
  HATCH_SHADES,
  HATCH_TURNS,
  KNOWN_MODELS,
  SLOT_COUNT,
  effortHatch,
  effortLabel,
  effortName,
  effortRank,
  effortShade,
  hatchTurn,
  modelSlots,
  shade,
  slotColor,
  swatchFill,
} from './colors';

test('a known model keeps its slot whatever else the range holds', () => {
  const alone = modelSlots(['claude-haiku-4-5']);
  const among = modelSlots(['claude-haiku-4-5', 'claude-opus-5-5', 'zzz']);
  expect(alone.get('claude-haiku-4-5')).toBe(KNOWN_MODELS.indexOf('claude-haiku-4-5'));
  expect(among.get('claude-haiku-4-5')).toBe(alone.get('claude-haiku-4-5'));
  expect(among.get('claude-opus-5-5')).toBe(0);
});

test('other models take the free slots in name order', () => {
  const slots = modelSlots(['claude-sonnet-5', 'b-model', 'a-model']);
  expect([slots.get('claude-sonnet-5'), slots.get('a-model'), slots.get('b-model')]).toEqual([1, 0, 2]);
});

test('a model past the last slot is folded into other', () => {
  const names = Array.from({ length: SLOT_COUNT + 2 }, (_, index) => `model-${String(index).padStart(2, '0')}`);
  const slots = modelSlots(names);
  expect(names.map((name) => slots.get(name))).toEqual([0, 1, 2, 3, 4, 5, 6, 7, null, null]);
});

test('no models, no slots', () => {
  expect(modelSlots([]).size).toBe(0);
});

test('effort levels rank from low to ultracode, unknown ones after', () => {
  expect(EFFORT_ORDER.map(effortRank)).toEqual([0, 1, 2, 3, 4, 5]);
  expect(effortRank('mystery')).toBe(EFFORT_ORDER.length);
});

test('an effort level is named for the tables and for the legend', () => {
  expect([effortName('high'), effortName(null), effortName(BACKGROUND_EFFORT)]).toEqual([
    'effort high',
    'no effort level',
    'background calls',
  ]);
  expect([effortLabel('high'), effortLabel(null), effortLabel(BACKGROUND_EFFORT)]).toEqual([
    'high',
    'no effort level',
    'background calls',
  ]);
});

test('a slot is a series color, the other slot its own', () => {
  expect([slotColor(0), slotColor(7), slotColor(null)]).toEqual([
    'var(--series-1)',
    'var(--series-8)',
    'var(--series-other)',
  ]);
});

test('shade 0 is the model color, more mixes in the shade ink by the slot step', () => {
  expect(shade(2, 0)).toBe('var(--series-3)');
  expect(shade(2, 2)).toBe(
    'color-mix(in oklab, var(--series-3), var(--shade-ink) calc(var(--shade-step-3) * 2))',
  );
  expect(shade(null, 1)).toContain('var(--shade-step-other) * 1');
});

test('effort levels shade up to max, xhigh and ultracode sharing it', () => {
  const steps = ['low', 'medium', 'high', 'xhigh', 'max', 'ultracode'].map((level) => effortShade(0, level));
  expect(steps[0]).toBe(slotColor(0));
  expect(steps[1]).toBe(shade(0, 1));
  expect(steps[2]).toBe(shade(0, 2));
  expect(new Set(steps.slice(3)).size).toBe(1);
  expect(steps[3]).toBe(shade(0, 3));
});

test('no level, an unknown one or an object method name gets the model color', () => {
  for (const effort of [null, undefined, '', 'mystery', 'constructor', 'toString', '__proto__']) {
    expect(effortShade(1, effort)).toBe(slotColor(1));
  }
});

test('background calls wear the model color, hatched one shade further and turned the other way', () => {
  expect(effortShade(3, BACKGROUND_EFFORT)).toBe(slotColor(3));
  expect(effortHatch(3, BACKGROUND_EFFORT)).toBe(shade(3, 1));
  expect(hatchTurn(BACKGROUND_EFFORT)).toBe(-45);
});

test('ultracode is max shaded, its lines one shade further, at 45 degrees', () => {
  expect(effortShade(0, 'ultracode')).toBe(effortShade(0, 'max'));
  expect(effortHatch(0, 'ultracode')).toBe(shade(0, 4));
  expect(hatchTurn('ultracode')).toBe(45);
});

test('levels without a hatch have neither lines nor an angle', () => {
  for (const effort of ['low', 'max', null, undefined, 'constructor']) {
    expect([effortHatch(0, effort), hatchTurn(effort)]).toEqual([null, null]);
  }
});

test('every hatched level has a shade and an angle of its own', () => {
  expect(Object.keys(HATCH_SHADES).sort()).toEqual(Object.keys(HATCH_TURNS).sort());
  for (const level of Object.keys(HATCH_SHADES)) expect(EFFORT_SHADES).toHaveProperty(level);
  expect(new Set(Object.values(HATCH_TURNS)).size).toBe(Object.keys(HATCH_TURNS).length);
});

test("a swatch's hatch runs across the columns' lines, 90 degrees further", () => {
  expect(swatchFill('red', 'blue', 45)).toContain('repeating-linear-gradient(135deg, blue 0 1.5px, red 1.5px 4px)');
  expect(swatchFill('red', 'blue', -45)).toContain('(45deg,');
  expect(swatchFill('red', null, null)).toBe('red');
});
