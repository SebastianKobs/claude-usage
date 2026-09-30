// The by-model chart's colors: a model's slot, its effort level's shade and hatch, and the swatches that show them.
// Plain functions and tables with no state; the colors themselves are the themes' custom properties (--series-N,
// --shade-step-N, --shade-ink), which these only name, so a theme change needs no redraw.

/** How many palette slots there are; a model past them is folded into "Other". */
export const SLOT_COUNT = 8;

/** Fixed slots so a model keeps its color whatever the range: known ids first, others after in name order. */
export const KNOWN_MODELS: readonly string[] = [
  'claude-opus-5-5',
  'claude-sonnet-5',
  'claude-opus-5',
  'claude-haiku-4-5',
  'claude-fable-5-1',
  'claude-opus-4-8',
  'claude-fable-5',
  'claude-sonnet-4-6',
];

/** A model's palette slot, or null where it is folded into "Other". */
export type Slot = number | null;

/** An effort level as the data carries it; missing for a call that has none. */
type Effort = string | null | undefined;

/** The slot of each model: a known one its own, the others the free slots in name order, then null. */
export function modelSlots(models: readonly string[]): Map<string, Slot> {
  const slots = new Map<string, Slot>();
  for (const [slot, model] of KNOWN_MODELS.entries()) {
    if (models.includes(model)) slots.set(model, slot);
  }
  const taken = new Set(slots.values());
  const free = Array.from({ length: SLOT_COUNT }, (_, slot) => slot).filter((slot) => !taken.has(slot));
  for (const model of models.filter((name) => !KNOWN_MODELS.includes(name)).sort()) {
    slots.set(model, free.shift() ?? null);
  }
  return slots;
}

/** Effort levels from least to most, ultracode (xhigh with its workflows) last; others sort after them by name. */
export const EFFORT_ORDER: readonly string[] = ['low', 'medium', 'high', 'xhigh', 'max', 'ultracode'];

/** Where a level sorts: its place in the order, else after them all. */
export function effortRank(effort: string): number {
  const rank = EFFORT_ORDER.indexOf(effort);
  return rank === -1 ? EFFORT_ORDER.length : rank;
}

/** The effort level of background usage (store.BACKGROUND_EFFORT): calls no transcript shows, so no level is known. */
export const BACKGROUND_EFFORT = 'background';

/** An effort level as the tables and the series' keys name it ("effort high"). */
export function effortName(effort: Effort): string {
  if (effort === BACKGROUND_EFFORT) return 'background calls';
  return effort ? `effort ${effort}` : 'no effort level';
}

/** An effort level as the legend and the tooltip name it under their model ("high"). */
export function effortLabel(effort: Effort): string {
  if (effort === BACKGROUND_EFFORT) return 'background calls';
  return effort ?? 'no effort level';
}

// A model's color, shaded by effort level: the model's own color for low, none or an unknown level, then one step
// further from the surface each for medium, high and max (xhigh shares max's shade). Each slot's step is sized for
// the same lightness gap (--shade-step-*, validated per theme); the legend, tooltip and table name every level.
// Ultracode shares max's shade too, hatched at 45° with lines one step further (tone on tone), so it needs no color
// of its own. Background usage wears the model's own color, hatched the other way (135°) with lines one step further.
export const EFFORT_SHADES: Readonly<Record<string, number>> = {
  background: 0,
  medium: 1,
  high: 2,
  xhigh: 3,
  max: 3,
  ultracode: 3,
};
export const HATCH_SHADES: Readonly<Record<string, number>> = { background: 1, ultracode: 4 };
/** How far a hatch turns its vertical lines, in degrees (clockwise on screen): 45 draws "/", -45 draws "\". */
export const HATCH_TURNS: Readonly<Record<string, number>> = { background: -45, ultracode: 45 };

/** An own entry of a table keyed by effort level: a level named like an Object method is no entry. */
function entry(table: Readonly<Record<string, number>>, effort: Effort): number | null {
  return effort && Object.hasOwn(table, effort) ? (table[effort] ?? null) : null;
}

/** The custom property's color of a slot. */
export function slotColor(slot: Slot): string {
  return slot === null ? 'var(--series-other)' : `var(--series-${slot + 1})`;
}

/** A slot's color moved `step` shades away from the surface. */
export function shade(slot: Slot, step: number): string {
  const name = slot === null ? 'other' : slot + 1;
  if (step === 0) return slotColor(slot);
  return `color-mix(in oklab, var(--series-${name}), var(--shade-ink) calc(var(--shade-step-${name}) * ${step}))`;
}

/** A model's color at an effort level. */
export function effortShade(slot: Slot, effort: Effort): string {
  return shade(slot, entry(EFFORT_SHADES, effort) ?? 0);
}

/** The color of the effort level's hatch lines, or null for a level without a hatch. */
export function effortHatch(slot: Slot, effort: Effort): string | null {
  const step = entry(HATCH_SHADES, effort);
  return step ? shade(slot, step) : null;
}

/** The angle of the level's hatch, or null for a level without one. */
export function hatchTurn(effort: Effort): number | null {
  return entry(HATCH_TURNS, effort);
}

/** A swatch's background: a series' color, with its hatch where it has one, its lines turned like the columns' (a
 * gradient runs across its stripes, so 90° further). */
export function swatchFill(color: string, hatch: string | null, turn: number | null): string {
  return !hatch || turn === null
    ? color
    : `repeating-linear-gradient(${90 + turn}deg, ${hatch} 0 1.5px, ${color} 1.5px 4px)`;
}
