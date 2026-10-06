import { expect, test } from 'vitest';
import type { SecretAccess } from '../api/api.ts';
import { secretAccess } from '../api/fixtures.ts';
import { when } from '../ui/format.ts';
import {
  SECRET_COLUMNS,
  secretAlertHeading,
  secretReach,
  secretRows,
  secretSummary,
  secretTone,
  secretVia,
} from './secrets.ts';

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

test('a row says each thing in words, the script a path came from and the severity of its mark', () => {
  const [row] = secretRows([
    secretAccess({
      time: '2026-09-30T09:00:00.000Z',
      path: '~/.ssh/id_rsa',
      pattern: '.ssh',
      via: 'deploy.sh',
      severity: 'high',
      reach: 'sent',
      sent: true,
    }),
  ]);
  expect(row).toMatchObject({
    time: when('2026-09-30T09:00:00.000Z'),
    agent: 'main',
    tool: 'Bash',
    path: '~/.ssh/id_rsa',
    via: 'in deploy.sh, which it ran',
    pattern: '.ssh',
    severity: 'high',
    reach: 'sent to a service',
  });
  expect(SECRET_COLUMNS.map((column) => column.label)).toEqual([
    'Time',
    'Agent',
    'Tool',
    'Path',
    'Matched',
    'Reached',
  ]);
});

test('a call without a severity counts as medium, and one without a time has a dash', () => {
  const [row] = secretRows([secretAccess({ time: null, severity: undefined as never })]);
  expect(row!.severity).toBe('medium');
  expect(row!.time).toBe('–');
});

test('a call made twice at the same moment has a key of its own, the same on every draw', () => {
  const twice = [secretAccess(), secretAccess(), secretAccess({ path: '.env.local' })];
  const keys = secretRows(twice).map((row) => row.key);
  expect(new Set(keys).size).toBe(3);
  expect(secretRows(twice).map((row) => row.key)).toEqual(keys);
  expect(secretRows([secretAccess()])[0]!.key).toBe(keys[0]);
});

test('the open card says how many calls and how many sent their input out', () => {
  const access = (severity: SecretAccess['severity']) => ({ severity });
  expect(secretAlertHeading([access('high')])).toBe('Possible secret access: 1 call (1 sent out)');
  expect(secretAlertHeading([access('high'), access('medium'), access('high')])).toBe(
    'Possible secret access: 3 calls (2 sent out)',
  );
});

test('the folded card says how far the worst of its calls got', () => {
  const access = (severity: SecretAccess['severity']) => ({ severity });
  expect(secretSummary([access('medium'), access('low'), access('medium')], 'warning')).toBe(
    '3 calls named a possible secret location, 2 of them returned a result or may still',
  );
  expect(secretSummary([access('low-medium'), access('low')], 'quiet')).toBe(
    '2 calls named a possible secret location, 1 returned a result only in a likely test',
  );
  expect(secretSummary([access('low')], 'quiet')).toBe(
    '1 call named a possible secret location, none reached anything',
  );
});

test('the same call by two agents keeps each its key when their order changes', () => {
  const first = secretAccess({ agent_id: 'agent-1', agent_type: 'Explore' });
  const second = secretAccess({ agent_id: 'agent-2', agent_type: 'Plan' });
  const keyOf = (rows: ReturnType<typeof secretRows>, agent: string) => rows.find((row) => row.agent === agent)!.key;
  const forward = secretRows([first, second]);
  const backward = secretRows([second, first]);
  expect(keyOf(forward, 'Explore')).toBe(keyOf(backward, 'Explore'));
  expect(keyOf(forward, 'Plan')).toBe(keyOf(backward, 'Plan'));
});
