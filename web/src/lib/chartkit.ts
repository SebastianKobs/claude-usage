// The maths every chart of the page shares: its width, where the pointer is in it, how the cursor steps through its
// buckets, where its tooltip sits and which x labels show. The components (Chart, YAxis, XLabels) draw with these.

/** Narrower than this the plot stops shrinking, and the container's width is scaled. */
export const MIN_CHART_WIDTH = 320;

/** At most about this many labels under the x axis. */
export const X_LABELS = 8;

/** The tooltip's gap right of its anchor. */
const TOOLTIP_GAP = 12;

/** The chart's drawing width for a container `clientWidth` wide. */
export function chartWidth(clientWidth: number): number {
  return Math.max(MIN_CHART_WIDTH, clientWidth);
}

/** How much the SVG, drawn `width` wide, is scaled to fit its container (1 before either is measured). */
export function chartScale(clientWidth: number, width: number): number {
  return clientWidth && width ? clientWidth / width : 1;
}

/** A pointer's x in the chart's own coordinates, from its position on the page and the SVG's box. */
export function pointerX(clientX: number, boundsLeft: number, boundsWidth: number, width: number): number {
  return ((clientX - boundsLeft) * width) / (boundsWidth || width);
}

/**
 * The bucket the cursor goes to for a key, or null for a key it leaves alone. Arrow keys step one, Page Up and Down a
 * tenth of the buckets (at least one), Home and End go to the ends; the result stays within `count` buckets.
 */
export function cursorStep(key: string, current: number, count: number): number | null {
  const page = Math.max(1, Math.round(count / 10));
  const steps: Record<string, number> = {
    ArrowLeft: -1,
    ArrowDown: -1,
    ArrowRight: 1,
    ArrowUp: 1,
    PageUp: -page,
    PageDown: page,
  };
  const last = count - 1;
  if (key === 'Home') return 0;
  if (key === 'End') return last;
  const step = steps[key];
  if (step === undefined) return null;
  return Math.min(Math.max(0, current + step), last);
}

/** The tooltip's left edge beside an anchor, kept inside a container (the left edge wins where it is too wide). */
export function tooltipLeft(anchor: number, tooltipWidth: number, containerWidth: number): number {
  return Math.max(0, Math.min(anchor + TOOLTIP_GAP, containerWidth - tooltipWidth));
}

/** The buckets labelled under the x axis: evenly spaced, about `most` of them. */
export function xLabelIndexes(count: number, most = X_LABELS): number[] {
  const every = Math.max(1, Math.ceil(count / most));
  return Array.from({ length: Math.ceil(count / every) }, (_unused, position) => position * every);
}

/** A gridline's y snapped to the pixel grid, so a one-pixel line is sharp. */
export function gridY(y: number): number {
  return Math.round(y) + 0.5;
}

/** Room left of the plot for the y axis' labels. */
export const LEFT_AXIS = 56;

/** Room right of a line chart's plot for its end label. */
export const RIGHT_PAD = 64;

/** The band under the plot that holds the x labels. */
export const AXIS_BAND = 28;
