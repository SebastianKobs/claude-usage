// For the tests of what the page shows where DOMPurify can't work (no DOM it trusts): markdown then goes in as text.

import DOMPurify from 'dompurify';

/** Makes DOMPurify say it is not supported, as it does without a DOM. */
export function disableSanitizer(): void {
  DOMPurify.isSupported = false;
}

/** Puts it back. */
export function enableSanitizer(): void {
  DOMPurify.isSupported = true;
}
