import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { screen } from '@testing-library/svelte';
import { afterEach, beforeEach, expect, test } from 'vitest';
import { bridge, type Bridge } from './legacy.svelte';
import * as charts from './lib/charts';
import * as colors from './lib/colors';
import * as compact from './lib/compact';
import * as format from './lib/format';
import { summary } from './lib/fixtures';
import * as live from './lib/live';
import * as overview from './lib/overview.svelte';
import * as paging from './lib/paging.svelte';
import * as payload from './lib/payload.svelte';
import * as prefs from './lib/prefs.svelte';
import * as scroll from './lib/scroll';
import * as secrets from './lib/secrets';
import * as tables from './lib/tables';
import * as themes from './lib/themes';

const MODULES = [
  format,
  colors,
  compact,
  secrets,
  live,
  tables,
  charts,
  themes,
  prefs,
  paging,
  scroll,
  payload,
  overview,
];

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
  payload.payload.reset();
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

test.each([
  ['formatters', format, 'money'],
  ['colors', colors, 'slotColor'],
  ['compacting helpers', compact, 'payoffTone'],
  ['secrets helpers', secrets, 'secretTone'],
  ['live helpers', live, 'liveWaitBadge'],
  ['tables helpers', tables, 'pageWindow'],
  ['charts helpers', charts, 'niceMax'],
  ['theme wording', themes, 'themeLabel'],
  ['preferences', prefs, 'savedOption'],
  ['paging', paging, 'mountPager'],
  ['scrolling', scroll, 'scrollAnchor'],
  ['payload', payload, 'setPayload'],
  ['overview tiles', overview, 'mountSessionKpis'],
])("the old scripts' %s are the module's exports", (_kind, module, sample) => {
  const names = Object.keys(module) as (keyof typeof module & keyof Window)[];
  expect(names).toContain(sample);
  for (const name of names) expect(window[name], name).toBe(module[name]);
});

test('no export name is in two modules', () => {
  const names = MODULES.flatMap((module) => Object.keys(module));
  expect(names.filter((name, index) => names.indexOf(name) !== index)).toEqual([]);
});

test('the formatters answer as the old scripts call them', () => {
  expect(window.money(1500)).toBe('$1.5K');
  expect(window.duration(123000)).toBe('2 min 3 s');
  expect(window.ago(null)).toBe('–');
});

test('the colors answer as the old scripts call them', () => {
  expect(window.slotColor(0)).toBe('var(--series-1)');
  expect(window.effortName('high')).toBe('effort high');
  expect(window.SLOT_COUNT).toBe(8);
});

test('the compacting, secrets and live helpers answer as the old scripts call them', () => {
  expect(window.PAYOFF_WORDS.soon).toBe('Soon');
  expect(window.secretReach({ reach: 'sent', sent: true, test: false })).toBe('sent to a service');
  const waiting = { kind: 'question', tool: 'AskUserQuestion', since: null, agent_type: null } as const;
  expect(window.waitChanged({ session_id: 's', waiting: null }, [{ session_id: 's', waiting }])).toBe(true);
});

test("the old scripts' preferences are the module's own state, and hype follows its theme", () => {
  try {
    expect(window.preferences).toBe(prefs.preferences);
    expect(window.hype('Estimated cost')).toBe('Estimated cost');
    window.preferences.theme = 'hacker';
    expect(prefs.preferences.theme).toBe('hacker');
    expect(window.hype('Estimated cost')).toBe('burn_rate');
  } finally {
    prefs.preferences.theme = null;
    localStorage.clear();
  }
});

function tilesOf(id: string): HTMLElement {
  const container = document.getElementById(id);
  if (!container) throw new Error(`no #${id}`);
  return container;
}

test('the overview rows say loading until the old scripts hand over a summary', () => {
  expect(tilesOf('kpis')).toHaveTextContent(/^Loading…$/);
  expect(tilesOf('runtime').children).toHaveLength(0);
});

test('the rows are drawn at once by setPayload, in the page containers with their classes', () => {
  window.setPayload({ summary: summary() });
  expect(tilesOf('kpis')).toHaveClass('kpis', 'stack');
  expect([...tilesOf('kpis').querySelectorAll('.label')].map((label) => label.textContent)).toEqual([
    'Estimated cost, last 7 days',
    'Input tokens',
    'Turns',
    'Output tokens',
  ]);
  expect(tilesOf('runtime').querySelectorAll('.card')).toHaveLength(4);
  expect(tilesOf('runtime')).toHaveAttribute('aria-label', 'Time and lines changed');
});

test('a failed summary shows the failure in the kpis row, and a summary replaces it', () => {
  window.setPayload({ summaryFailed: true });
  expect(tilesOf('kpis')).toHaveTextContent(/^Could not load the summary\.$/);
  window.setPayload({ summary: summary() });
  expect(tilesOf('kpis')).not.toHaveTextContent('Could not load');
  expect(tilesOf('kpis').querySelectorAll('.card')).toHaveLength(4);
});

test('the payload the old scripts read is the same state the tiles draw', () => {
  window.setPayload({ summary: summary() });
  expect(window.payload.summary?.days).toBe(7);
  expect(window.payload.summaryFailed).toBe(false);
});

test('the over-time section is mounted in its container: a card, drawn from the payload', () => {
  const card = tilesOf('trend-card');
  expect(screen.getByRole('region', { name: 'Over time' })).toBeInTheDocument();
  expect(card).toContainElement(screen.getByRole('region', { name: 'Over time' }));
  expect(card.querySelector('svg')).toBeNull();
  window.setPayload({ summary: summary() });
  expect(card.querySelector('svg')).not.toBeNull();
  expect(card.querySelectorAll('.panel-title')).toHaveLength(3);
});

test('the by-model section is mounted in its container: a card, drawn from the payload', () => {
  const card = tilesOf('chart-card');
  expect(screen.getByRole('region', { name: 'Per day, by model' })).toBeInTheDocument();
  expect(card).toContainElement(screen.getByRole('region', { name: 'Per day, by model' }));
  expect(card.querySelector('svg')).toBeNull();
  window.setPayload({ summary: summary() });
  expect(screen.getByRole('region', { name: 'Per day, by model and effort' })).toBeInTheDocument();
  expect(card.querySelector('svg')).not.toBeNull();
  expect(card.querySelectorAll('.segmented button')).toHaveLength(3);
});

test('a page without the tile containers fails loudly and mounts nothing', () => {
  bridged.stop();
  document.body.replaceChildren(pageBody());
  document.getElementById('runtime')?.remove();
  expect(() => bridge(window)).toThrow('The page has no #runtime container for the tiles');
  expect(document.getElementById('error')).not.toBeNull();
  expect(document.getElementById('kpis')?.children).toHaveLength(0);
  bridged = { stop() {} };
});

test('a page without the over-time container fails loudly and mounts nothing', () => {
  bridged.stop();
  document.body.replaceChildren(pageBody());
  document.getElementById('trend-card')?.remove();
  expect(() => bridge(window)).toThrow('The page has no #trend-card container for the over-time section');
  expect(document.getElementById('error')).not.toBeNull();
  expect(document.getElementById('kpis')?.children).toHaveLength(0);
  bridged = { stop() {} };
});

test('a page without the by-model container fails loudly and mounts nothing', () => {
  bridged.stop();
  document.body.replaceChildren(pageBody());
  document.getElementById('chart-card')?.remove();
  expect(() => bridge(window)).toThrow('The page has no #chart-card container for the by-model section');
  expect(document.getElementById('error')).not.toBeNull();
  expect(document.getElementById('kpis')?.children).toHaveLength(0);
  expect(document.getElementById('trend-card')?.children).toHaveLength(0);
  bridged = { stop() {} };
});

test('stopping takes the by-model section away too', () => {
  bridged.stop();
  expect(tilesOf('chart-card').children).toHaveLength(0);
  bridged = { stop() {} };
});

test('stopping takes the over-time section away too', () => {
  bridged.stop();
  expect(tilesOf('trend-card').children).toHaveLength(0);
  bridged = { stop() {} };
});

test('stopping takes the tiles away too', () => {
  window.setPayload({ summary: summary() });
  bridged.stop();
  expect(tilesOf('kpis').children).toHaveLength(0);
  expect(tilesOf('runtime').children).toHaveLength(0);
  bridged = { stop() {} };
});

test('stopping takes the banner and the globals away', () => {
  bridged.stop();
  expect(screen.queryByRole('alert')).toBeNull();
  expect('showError' in window).toBe(false);
  expect('hasError' in window).toBe(false);
  for (const name of MODULES.flatMap((module) => Object.keys(module))) expect(name in window, name).toBe(false);
  bridged = { stop() {} };
});
