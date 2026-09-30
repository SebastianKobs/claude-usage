// Numbers, money, percentages, durations, days, hours and moments as the dashboard writes them. Plain functions with
// no state, so the old scripts (through the bridge) and the components share them. A missing value is an en dash.
// `locale` is for the tests: the page leaves it out and gets the browser's.

const MISSING = '–';
const compactFormat = new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 });
const wholeFormat = new Intl.NumberFormat('en');
const DAY_SHORT: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
const DAY_LONG: Intl.DateTimeFormatOptions = { weekday: 'short', month: 'short', day: 'numeric' };
const TIME: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit' };

type Missing = null | undefined;

/** 12,345 as "12.3K". */
export function compact(value: number | Missing): string {
  return value === null || value === undefined ? MISSING : compactFormat.format(value);
}

/** A change with its sign: "+12K", "−3K". */
export function signed(value: number): string {
  return value < 0 ? `−${compact(-value)}` : `+${compact(value)}`;
}

/** A count with thousands separators: "12,345". */
export function whole(value: number | Missing): string {
  return value === null || value === undefined ? MISSING : wholeFormat.format(value);
}

/** Dollars: cents below $100, whole dollars to $1000, compact from there ("$1.5K"). */
export function money(value: number | Missing): string {
  if (value === null || value === undefined) return MISSING;
  if (Math.abs(value) >= 1000) return '$' + compactFormat.format(value);
  return '$' + value.toFixed(value >= 100 ? 0 : 2);
}

/** A part's share of a total: "42%", with one decimal below 10% so a small part doesn't read as 0% or a round 1%. */
export function percent(part: number, total: number): string {
  if (!total) return MISSING;
  const share = (100 * part) / total;
  return (share > 0 && share < 10 ? share.toFixed(1) : String(Math.round(share))) + '%';
}

/** Milliseconds as "1 h 5 min", "2 min 3 s" or "9 s". */
export function duration(milliseconds: number | Missing): string {
  if (milliseconds === null || milliseconds === undefined) return MISSING;
  const seconds = Math.round(milliseconds / 1000);
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours) return minutes ? `${hours} h ${minutes} min` : `${hours} h`;
  if (minutes) return seconds % 60 ? `${minutes} min ${seconds % 60} s` : `${minutes} min`;
  return `${seconds} s`;
}

/** The local date of a store day, "YYYY-MM-DD", at midnight. */
export function parseDay(text: string): Date {
  const [year = 0, month = 1, day = 1] = text.split('-').map(Number);
  return new Date(year, month - 1, day);
}

/** A local date as the store's day, "YYYY-MM-DD". */
export function dayText(date: Date): string {
  const pad = (number: number): string => String(number).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** "Sep 30". */
export function shortDay(text: string, locale?: string): string {
  return parseDay(text).toLocaleDateString(locale, DAY_SHORT);
}

/** "Wed, Sep 30". */
export function longDay(text: string, locale?: string): string {
  return parseDay(text).toLocaleDateString(locale, DAY_LONG);
}

/** The start of a store hour, "YYYY-MM-DDTHH" in local time. */
export function parseHour(text: string): Date {
  const [day = '', hour = '0'] = text.split('T');
  const moment = parseDay(day);
  moment.setHours(Number(hour));
  return moment;
}

/** The hour's start as a clock time: "02:00 PM". */
export function shortHour(text: string, locale?: string): string {
  return parseHour(text).toLocaleTimeString(locale, TIME);
}

/** The hour with its day and end: "Wed, Sep 30, 02:00 PM–03:00 PM". */
export function longHour(text: string, locale?: string): string {
  const start = parseHour(text);
  const end = new Date(start.getTime() + 3600 * 1000);
  const time = (moment: Date): string => moment.toLocaleTimeString(locale, TIME);
  return `${start.toLocaleDateString(locale, DAY_LONG)}, ${time(start)}–${time(end)}`;
}

/** A moment as "Sep 30, 02:05 PM" in local time. */
export function when(iso: string | Missing, locale?: string): string {
  if (!iso) return MISSING;
  return new Date(iso).toLocaleString(locale, { ...DAY_SHORT, ...TIME });
}

/** How long ago a moment was: "12 s ago", "5 min ago", and from an hour on the moment itself. */
export function ago(iso: string | Missing, now: number = Date.now(), locale?: string): string {
  if (!iso) return MISSING;
  const seconds = Math.max(0, Math.round((now - new Date(iso).getTime()) / 1000));
  if (seconds < 60) return `${seconds} s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
  return when(iso, locale);
}
