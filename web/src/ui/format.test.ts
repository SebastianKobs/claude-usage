import { expect, test } from 'vitest';
import {
  ago,
  compact,
  dayText,
  duration,
  longDay,
  longHour,
  money,
  parseDay,
  parseHour,
  percent,
  shortDay,
  shortHour,
  signed,
  when,
  whole,
} from './format';

const EN = 'en-US';
// a local moment as the ISO string the server sends, so the tests hold in any time zone
const local = (...parts: [number, number, number, number?, number?]): string => new Date(...parts).toISOString();

test('a missing number is an en dash', () => {
  expect([compact(null), compact(undefined), whole(null), money(undefined), duration(null)]).toEqual(Array(5).fill('–'));
});

test('compact shortens thousands and millions to one decimal', () => {
  expect([compact(0), compact(999), compact(1234), compact(12_345), compact(1_500_000)]).toEqual([
    '0',
    '999',
    '1.2K',
    '12.3K',
    '1.5M',
  ]);
});

test('signed puts the sign first, a true minus for a loss', () => {
  expect([signed(12_000), signed(-3000), signed(0)]).toEqual(['+12K', '−3K', '+0']);
});

test('whole separates thousands', () => {
  expect(whole(1234567)).toBe('1,234,567');
});

test('money shows cents, then whole dollars from $100, then compact from $1000', () => {
  expect([money(0), money(0.456), money(99.994), money(100), money(123.4), money(1000), money(1500)]).toEqual([
    '$0.00',
    '$0.46',
    '$99.99',
    '$100',
    '$123',
    '$1K',
    '$1.5K',
  ]);
});

test('a percentage has one decimal below 10% and none from there', () => {
  expect([percent(1, 3), percent(5, 100), percent(0, 100), percent(100, 100), percent(1, 0)]).toEqual([
    '33%',
    '5.0%',
    '0%',
    '100%',
    '–',
  ]);
});

test('a duration names its two largest units', () => {
  expect([0, 9000, 120_000, 123_000, 3_600_000, 3_900_000, 7_323_000].map(duration)).toEqual([
    '0 s',
    '9 s',
    '2 min',
    '2 min 3 s',
    '1 h',
    '1 h 5 min',
    '2 h 2 min',
  ]);
});

test('a duration rounds to the second', () => {
  expect([duration(499), duration(500), duration(59_500)]).toEqual(['0 s', '1 s', '1 min']);
});

test('a day parses to local midnight and writes back as it came', () => {
  const day = parseDay('2026-09-05');
  expect([day.getFullYear(), day.getMonth(), day.getDate(), day.getHours()]).toEqual([2026, 8, 5, 0]);
  expect(dayText(day)).toBe('2026-09-05');
  expect(dayText(new Date(2026, 0, 31, 23, 59))).toBe('2026-01-31');
});

test('days are written short and long', () => {
  expect(shortDay('2026-09-30', EN)).toBe('Sep 30');
  expect(longDay('2026-09-30', EN)).toBe('Wed, Sep 30');
});

test('an hour key is the local start of that hour', () => {
  const hour = parseHour('2026-09-30T14');
  expect([hour.getDate(), hour.getHours(), hour.getMinutes()]).toEqual([30, 14, 0]);
  expect(shortHour('2026-09-30T14', EN)).toBe('02:00 PM');
});

test('a long hour gives its day and both ends', () => {
  expect(longHour('2026-09-30T14', EN)).toBe('Wed, Sep 30, 02:00 PM–03:00 PM');
  expect(longHour('2026-09-30T23', EN)).toBe('Wed, Sep 30, 11:00 PM–12:00 AM');
});

test('a moment is written in local time, and a missing one is an en dash', () => {
  expect(when(local(2026, 8, 30, 14, 5), EN)).toBe('Sep 30, 02:05 PM');
  expect([when(null), when(undefined), when('')]).toEqual(['–', '–', '–']);
});

test('ago counts seconds, then minutes, then gives the moment', () => {
  const moment = local(2026, 8, 30, 14, 0);
  const at = (seconds: number): number => new Date(moment).getTime() + seconds * 1000;
  expect([0, 12, 59].map((seconds) => ago(moment, at(seconds)))).toEqual(['0 s ago', '12 s ago', '59 s ago']);
  expect([60, 119, 3599].map((seconds) => ago(moment, at(seconds)))).toEqual(['1 min ago', '1 min ago', '59 min ago']);
  expect(ago(moment, at(3600), EN)).toBe('Sep 30, 02:00 PM');
});

test('ago never goes below zero for a moment ahead of the clock', () => {
  const moment = local(2026, 8, 30, 14, 0);
  expect(ago(moment, new Date(moment).getTime() - 5000)).toBe('0 s ago');
  expect(ago(null)).toBe('–');
});
