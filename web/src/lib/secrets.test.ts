import { expect, test } from 'vitest';
import type { SecretAccess } from './api.ts';
import { secretReach, secretTone, secretVia } from './secrets.ts';

const tone = (...severities: SecretAccess['severity'][]) =>
  secretTone({ secret_accesses: severities.map((severity) => ({ severity })) });

test('only a high access raises the alarm, a medium one warns', () => {
  expect(tone('low', 'high', 'medium')).toBe('alert');
  expect(tone('low', 'medium')).toBe('warning');
  expect(tone('low', 'low')).toBe('quiet');
  expect(tone('low-medium', 'low')).toBe('quiet');
});

test('without an access there is no card', () => {
  expect(tone()).toBeNull();
  expect(secretTone({})).toBeNull();
});

test('each access says how far it reached', () => {
  const access = (reach: SecretAccess['reach'], sent = false, test = false) => secretReach({ reach, sent, test });
  expect(access('sent', true)).toBe('sent to a service');
  expect(access('returned')).toBe('into the conversation');
  expect(access('error')).toBe('error: blocked or failed');
  expect(access('error', true)).toBe('error, the service may have got it');
  expect(access('empty')).toBe('nothing returned');
  expect(access('pending')).toBe('no result yet');
});

test('a returned test says so, and only a returned one', () => {
  expect(secretReach({ reach: 'returned', sent: false, test: true })).toBe('into the conversation, likely a test');
  expect(secretReach({ reach: 'empty', sent: false, test: true })).toBe('nothing returned');
});

test('a reach it has no words for reads as no result yet, even one named like a built-in', () => {
  for (const reach of ['unknown', 'constructor', 'toString']) {
    expect(secretReach({ reach: reach as SecretAccess['reach'], sent: false, test: false })).toBe('no result yet');
  }
});

test('a path a script named says which script', () => {
  expect(secretVia({ via: 'deploy.py' })).toBe('in deploy.py, which it ran');
  expect(secretVia({ via: null })).toBeNull();
});
