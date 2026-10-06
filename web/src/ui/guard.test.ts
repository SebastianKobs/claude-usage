import { describe, expect, test } from 'vitest';
import { BannerMessages } from '../app/banner.svelte';
import { announceFailure, drawFailure } from './guard';

describe('what a section that could not be drawn says', () => {
  test('names the section and the error`s message', () => {
    const error = new TypeError("Cannot read properties of null (reading 'windows')");
    expect(drawFailure('Rate limits', error)).toBe(
      "“Rate limits” couldn't be drawn: Cannot read properties of null (reading 'windows')",
    );
  });

  test('says a thrown value that is no error as it is', () => {
    expect(drawFailure('Totals', 'no tiles')).toBe("“Totals” couldn't be drawn: no tiles");
  });
});

describe('the banner line of a failed section', () => {
  test('shows while the failure is in the page and goes with it', () => {
    const messages = new BannerMessages();
    const remove = announceFailure(messages, 'Rate limits', new Error('no windows'))(document.createElement('div'));
    expect(messages.text).toBe("“Rate limits” couldn't be drawn: no windows");
    remove?.();
    expect(messages.text).toBe('');
  });

  test('is one per section, so a section that draws again leaves the others` lines', () => {
    const messages = new BannerMessages();
    const removeLimits = announceFailure(messages, 'Rate limits', new Error('no windows'))(document.createElement('p'));
    announceFailure(messages, 'Sessions', new Error('no rows'))(document.createElement('p'));
    expect(messages.text).toBe("“Rate limits” couldn't be drawn: no windows\n“Sessions” couldn't be drawn: no rows");
    removeLimits?.();
    expect(messages.text).toBe("“Sessions” couldn't be drawn: no rows");
  });

  test('leaves the loader`s own lines alone', () => {
    const messages = new BannerMessages();
    messages.show('summary', 'HTTP 500');
    const remove = announceFailure(messages, 'Summary', new Error('no tiles'))(document.createElement('p'));
    remove?.();
    expect(messages.text).toBe('HTTP 500');
  });
});
