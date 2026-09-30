// How the session view shows the calls that named a possible secret location ([secrets] patterns, matched by the
// server): how the card shows as a whole, where a path came from, and how far a call got, in words.

import type { SecretAccess } from './api.ts';

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
