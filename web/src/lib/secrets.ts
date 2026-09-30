// How the session view shows the calls that named a possible secret location ([secrets] patterns, matched by the
// server): how the card shows as a whole, where a path came from, and how far a call got, in words.

import type { SecretAccess } from './api.ts';
import { when, whole } from './format.ts';

/** How the secret accesses show: "alert" (open, red) while one was sent out, "warning" (folded, yellow) while one
 *  returned a result or may still, "quiet" (folded, plain) while each was blocked, returned nothing or returned only
 *  in a likely test (low-medium). */
export type SecretTone = 'alert' | 'warning' | 'quiet';

/** How the card shows, by the most severe access; null for none. */
export function secretTone(detail: { secret_accesses?: Pick<SecretAccess, 'severity'>[] }): SecretTone | null {
  const severities = (detail.secret_accesses ?? []).map((access) => access.severity);
  if (!severities.length) return null;
  if (severities.includes('high')) return 'alert';
  return severities.includes('medium') ? 'warning' : 'quiet';
}

/** The script a path came from, where the call ran one the transcript wrote; null for a path the call named itself. */
export function secretVia(access: Pick<SecretAccess, 'via'>): string | null {
  return access.via ? `in ${access.via}, which it ran` : null;
}

const REACH_WORDS: Record<string, string> = {
  sent: 'sent to a service',
  returned: 'into the conversation',
  empty: 'nothing returned',
  pending: 'no result yet',
};

/** How far a call that named a secret location got (`tool_kinds.secret_reach`), in words. */
export function secretReach(access: Pick<SecretAccess, 'reach' | 'sent' | 'test'>): string {
  if (access.reach === 'error') return access.sent ? 'error, the service may have got it' : 'error: blocked or failed';
  if (access.reach === 'returned' && access.test) return 'into the conversation, likely a test';
  return Object.hasOwn(REACH_WORDS, access.reach) ? (REACH_WORDS[access.reach] ?? '') : 'no result yet';
}

/** The table's columns; "Matched" says what it shows. */
export const SECRET_COLUMNS: { label: string; title?: string }[] = [
  { label: 'Time' },
  { label: 'Agent' },
  { label: 'Tool' },
  { label: 'Path' },
  { label: 'Matched', title: 'the [secrets] pattern it matched' },
  { label: 'Reached' },
];

/** A row of the table: one call, in the words it shows. */
export interface SecretRow {
  /** Unique among the rows (a call made twice at the same moment gets a number), so a row keeps its node. */
  key: string;
  time: string;
  agent: string;
  tool: string;
  path: string;
  /** The script the path came from, where there is one. */
  via: string | null;
  pattern: string;
  /** The mark's severity (its class is `secret-severity-<severity>`); a call without one counts as medium. */
  severity: string;
  reach: string;
}

/** The table's rows, in the order the server gives the accesses (the most severe first, then by time). */
export function secretRows(accesses: readonly SecretAccess[]): SecretRow[] {
  const seen = new Map<string, number>();
  return accesses.map((access) => {
    const identity = [access.time, access.agent_id, access.tool, access.path, access.pattern].join('\u0000');
    const times = seen.get(identity) ?? 0;
    seen.set(identity, times + 1);
    return {
      key: times ? `${identity}\u0000${times}` : identity,
      time: when(access.time),
      agent: access.agent_type,
      tool: access.tool,
      path: access.path,
      via: secretVia(access),
      pattern: access.pattern,
      severity: access.severity || 'medium',
      reach: secretReach(access),
    };
  });
}

function calls(accesses: readonly unknown[]): string {
  return accesses.length === 1 ? '1 call' : `${whole(accesses.length)} calls`;
}

function count(accesses: readonly Pick<SecretAccess, 'severity'>[], severity: SecretAccess['severity']): number {
  return accesses.filter((access) => access.severity === severity).length;
}

/** The open card's heading: how many calls, and how many of them sent their input out. */
export function secretAlertHeading(accesses: readonly Pick<SecretAccess, 'severity'>[]): string {
  return `Possible secret access: ${calls(accesses)} (${whole(count(accesses, 'high'))} sent out)`;
}

/** The folded card's one line, by how severe its worst call is (`warning` or `quiet`). */
export function secretSummary(
  accesses: readonly Pick<SecretAccess, 'severity'>[],
  tone: 'warning' | 'quiet',
): string {
  const named = `${calls(accesses)} named a possible secret location`;
  if (tone === 'warning') return `${named}, ${whole(count(accesses, 'medium'))} of them returned a result or may still`;
  const tests = count(accesses, 'low-medium');
  if (!tests) return `${named}, none reached anything`;
  return `${named}, ${whole(tests)} returned a result only in a likely test`;
}
