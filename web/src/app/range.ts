// The range filter's logic: the ranges on offer, the query a range becomes, and the day the Daily range shows.

import type { Summary } from '../api/api.ts';
import { longDay } from '../ui/format.ts';

/** A range the page offers: its length in days and its button's text. */
export interface RangeOption {
  days: number;
  label: string;
}

/** Every range, shortest first. The Daily range shows one day, which the arrows step through. */
export const RANGES: readonly RangeOption[] = [
  { days: 1, label: 'Daily' },
  { days: 7, label: '7 days' },
  { days: 30, label: '30 days' },
  { days: 90, label: '90 days' },
  { days: 365, label: '1 year' },
];

/** The range in `days`, or null where it is none of RANGES: a saved value can be anything. */
export function rangeDays(days: number): number | null {
  return RANGES.some((range) => range.days === days) ? days : null;
}

/** The ranges no longer than the store keeps: the server cuts a longer one to the retention, so those buttons would
 *  show the same. 0 keeps everything, and so cuts nothing. */
export function visibleRanges(retentionDays: number | null | undefined): readonly RangeOption[] {
  return retentionDays ? RANGES.filter((range) => range.days <= retentionDays) : RANGES;
}

/** The range as a query: the day only for a single day, which the arrows step through. */
export function rangeQuery(days: number, day: string | null): string {
  return `days=${days}` + (days === 1 && day !== null ? `&until=${day}` : '');
}

/** The summary of the day shown, which names the nearest days with usage; null while another day is loading. `day` is
 *  null for today, which follows the date past midnight. */
export function shownDay(summary: Summary | null, day: string | null, today: string): Summary | null {
  const shown = day ?? today;
  return summary && summary.days === 1 && summary.until === shown ? summary : null;
}

/** The day label: "Today", or the day in full. */
export function dayLabel(day: string | null): string {
  return day === null ? 'Today' : longDay(day);
}

/** The day an arrow goes to: the nearest day with usage, which is null for today (the day follows the date), or
 *  undefined where there is none (or another day is still loading). */
export function dayStep(
  shown: Summary | null,
  name: 'previous_day' | 'next_day',
  today: string,
): string | null | undefined {
  const target = shown?.[name];
  if (!target) return undefined;
  return target === today ? null : target;
}
