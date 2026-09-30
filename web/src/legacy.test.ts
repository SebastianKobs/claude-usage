import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { screen } from '@testing-library/svelte';
import { afterEach, beforeEach, expect, test } from 'vitest';
import { bridge, type Bridge } from './legacy.svelte';

// a path, not a URL: the simulated DOM's URL class isn't node's
const PAGE = join(import.meta.dirname, '../../claude_usage/static/dashboard.html');

/** The page's body without its scripts, parsed in a template, which loads nothing (its head would fetch styles). */
function pageBody(): DocumentFragment {
  const html = readFileSync(PAGE, 'utf-8');
  const template = document.createElement('template');
  template.innerHTML = html.slice(html.indexOf('<body'), html.lastIndexOf('</body>')).replace(/^<body[^>]*>/, '');
  for (const script of template.content.querySelectorAll('script')) script.remove();
  return template.content;
}

let bridged: Bridge;

// the page's own markup, so the banner mounts where the old code drew it
beforeEach(() => {
  document.body.replaceChildren(pageBody());
  bridged = bridge(window);
});

afterEach(() => {
  bridged.stop();
});

test("the banner takes the placeholder's place", () => {
  const placeholder = pageBody().getElementById('error');
  const banner = screen.getByRole('alert');
  expect(document.getElementById('error')).toBeNull();
  expect(banner).toHaveClass('banner');
  expect(banner.previousElementSibling?.outerHTML).toBe(placeholder?.previousElementSibling?.outerHTML);
  expect(banner.nextElementSibling?.outerHTML).toBe(placeholder?.nextElementSibling?.outerHTML);
});

test("the old scripts' showError shows at once in the banner", () => {
  window.showError('live', 'Live down');
  window.showError('summary', 'Live down');
  window.showError('scan', 'Scan: one file');
  expect(screen.getByRole('alert').textContent).toBe('Live down\nScan: one file');
  window.showError('live', '');
  window.showError('summary', '');
  expect(screen.getByRole('alert').textContent).toBe('Scan: one file');
});

test('hasError tells whether a source is failing', () => {
  window.showError('summary', 'Summary down');
  expect(window.hasError('summary')).toBe(true);
  expect(window.hasError('live')).toBe(false);
  window.showError('summary', '');
  expect(window.hasError('summary')).toBe(false);
});

test('stopping takes the banner and the globals away', () => {
  bridged.stop();
  expect(screen.queryByRole('alert')).toBeNull();
  expect('showError' in window).toBe(false);
  bridged = { stop() {} };
});
