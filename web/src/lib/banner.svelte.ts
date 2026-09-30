import { SvelteMap } from 'svelte/reactivity';

/**
 * The error banner's messages: one per source (live, summary, session, scan), so one source's success doesn't
 * hide another's failure.
 */
export class BannerMessages {
  #messages = new SvelteMap<string, string>();
  // Each message once: two sources refused alike say the same.
  #text = $derived(
    [...this.#messages.values()].filter((message, index, all) => all.indexOf(message) === index).join('\n'),
  );

  /** The messages, one per line, in the order their sources began to fail. */
  get text(): string {
    return this.#text; // a getter, since a public $derived field could be assigned
  }

  /** Sets a source's message, or removes it when the message is empty. */
  show(source: string, message: string): void {
    if (message) this.#messages.set(source, message);
    else this.#messages.delete(source);
  }

  /** Whether a source has a message now: a failing summary is polled again as soon as the server answers. */
  has(source: string): boolean {
    return this.#messages.has(source);
  }
}
