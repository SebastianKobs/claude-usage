// What opening and closing the session view do to the page around it: the rest of the page steps aside, the view takes
// focus and the top of the window; closing puts the page back and returns focus and scroll to the link that opened it.
// An attachment of the view's root, so the order is the same every time: the link is noted before the page is hidden
// (hiding a section drops the focus from inside it).

import type { Attachment } from 'svelte/attachments';

/** Where the reader was when the view opened: the link with focus, its address and the page's scroll. */
interface Opener {
  href: string | null;
  element: Element | null;
  scroll: number;
}

/** The link focus is on, the page scrolled where it is: what closing returns to. */
function noteOpener(): Opener {
  const active = document.activeElement;
  const link = active && active !== document.body ? active : null;
  return { href: link?.getAttribute('href') ?? null, element: link, scroll: window.scrollY };
}

/** The link the view was opened from: the same node where it is still in the page, else the link with the same address
 *  (the page may have been drawn again meanwhile). */
function openerLink(opener: Opener): HTMLElement | null {
  if (opener.element?.isConnected) return opener.element as HTMLElement;
  if (opener.href === null) return null;
  const links = [...document.querySelectorAll<HTMLElement>('a[href]')];
  return links.find((link) => link.getAttribute('href') === opener.href) ?? null;
}

/**
 * An attachment for the view's root: it hides the page's other sections (by id), scrolls the view to the top and
 * focuses `focus` (a selector inside it, the heading, which is focusable without being in the tab order). When the view
 * goes, the sections are shown again and the page is scrolled back and focus returned to the link that opened the view.
 */
export function opening(options: { hide: readonly string[]; focus: string }): Attachment<HTMLElement> {
  return (root) => {
    const opener = noteOpener();
    const hidden: HTMLElement[] = [];
    for (const id of options.hide) {
      const section = document.getElementById(id);
      if (section) {
        section.hidden = true;
        hidden.push(section);
      }
    }
    root.scrollIntoView({ block: 'start' });
    root.querySelector<HTMLElement>(options.focus)?.focus({ preventScroll: true });
    return () => {
      for (const section of hidden) section.hidden = false;
      window.scrollTo(0, opener.scroll);
      openerLink(opener)?.focus({ preventScroll: true });
    };
  };
}
