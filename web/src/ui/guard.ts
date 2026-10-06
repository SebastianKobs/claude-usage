// A section of the page that couldn't be drawn (`SectionGuard`): what it says in its place and in the banner.

import type { Attachment } from 'svelte/attachments';
import type { BannerMessages } from '../app/banner.svelte';

/** What a section that couldn't be drawn says: its name and the error's message. */
export function drawFailure(section: string, error: unknown): string {
  const message = error instanceof Error ? error.message : String(error);
  return `“${section}” couldn't be drawn: ${message}`;
}

/** The banner says why a section couldn't be drawn while its failure is in the page, on a line of its own: a section
 *  drawn again, or taken away with the session it belonged to, leaves no stale line. */
export function announceFailure(messages: BannerMessages, section: string, error: unknown): Attachment {
  const source = `draw:${section}`; // apart from the loader's sources (live, summary, session, scan)
  return () => {
    messages.show(source, drawFailure(section, error));
    return () => messages.show(source, '');
  };
}
