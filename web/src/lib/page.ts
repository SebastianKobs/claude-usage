// The page's own words: the scope after the heading, when the data was last fetched, and the footer.

import type { Summary } from './api';

/** What the heading's scope says: all projects, or the project the summary was cut to; empty before a summary. */
export function scopeText(summary: Summary | null): string {
  if (!summary) return '';
  return `· ${summary.project_filter ? `project ${summary.project_filter}` : 'all projects'}`;
}

/** When the live answer last came, as the clock shows it; empty before one has. */
export function updatedText(at: number | null): string {
  return at === null ? '' : `updated ${new Date(at).toLocaleTimeString()}`;
}

/** The footer: what the cost is (with the day the prices were checked), what "(background)" is, and the sentence the
 *  theme adds (`copy`); empty before a summary. */
export function footerText(summary: Summary | null, copy: string): string {
  if (!summary) return '';
  return (
    'Estimated cost at Claude API list prices' +
    (summary.prices_checked ? ` (checked ${summary.prices_checked})` : '') +
    '. “(background)” is usage Claude Code counted but no transcript shows (e.g. Haiku for titles), taken from the ' +
    'cost records it writes during and at the end of a session: it has no turns, is filed under the time of the ' +
    'record that first counted it, and is hatched in the chart.' +
    copy
  );
}
