import { render, screen } from '@testing-library/svelte';
import { flushSync } from 'svelte';
import { expect, test } from 'vitest';
import { BannerMessages } from '../lib/banner.svelte';
import Banner from './Banner.svelte';

test('the banner is an alert with each message on a line of its own', () => {
  const messages = new BannerMessages();
  messages.show('live', 'Live down');
  messages.show('scan', 'Scan: one file');
  render(Banner, { messages });
  expect(screen.getByRole('alert').textContent).toBe('Live down\nScan: one file');
});

test('without a message the banner is empty, which the stylesheet hides', () => {
  render(Banner, { messages: new BannerMessages() });
  expect(screen.getByRole('alert')).toHaveClass('banner');
  expect(screen.getByRole('alert').matches(':empty')).toBe(true);
});

test('a message shown later appears in the banner already there', () => {
  const messages = new BannerMessages();
  render(Banner, { messages });
  const alert = screen.getByRole('alert');
  messages.show('summary', 'Summary down');
  flushSync();
  expect(alert.textContent).toBe('Summary down');
});
