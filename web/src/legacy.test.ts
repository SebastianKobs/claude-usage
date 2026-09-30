import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { screen } from '@testing-library/svelte';
import { flushSync } from 'svelte';
import { afterEach, beforeEach, expect, test } from 'vitest';
import { bridge, type Bridge } from './legacy.svelte';
import * as charts from './lib/charts';
import * as colors from './lib/colors';
import * as compact from './lib/compact';
import * as format from './lib/format';
import {
  apiErrorEvent,
  costlySession,
  live as liveAnswer,
  sessionDetail,
  sessionItem,
  summary,
  usage,
} from './lib/fixtures';
import * as live from './lib/live';
import * as paging from './lib/paging.svelte';
import * as payload from './lib/payload.svelte';
import * as prefs from './lib/prefs.svelte';
import * as rangeLib from './lib/range';
import * as rangeState from './lib/range.svelte';
import * as scroll from './lib/scroll';
import * as tables from './lib/tables';
import * as themes from './lib/themes';

const MODULES = [
  format,
  colors,
  compact,
  live,
  tables,
  charts,
  themes,
  prefs,
  paging,
  scroll,
  payload,
  rangeLib,
  rangeState,
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
  rangeState.range.reset();
  localStorage.clear();
});

test("the banner takes the placeholder's place", () => {
  const placeholder = pageBody().getElementById('error');
  const banner = screen.getByRole('alert');
  expect(document.getElementById('error')).toBeNull();
  expect(banner).toHaveClass('banner');
  expect(banner.previousElementSibling?.outerHTML).toBe(placeholder?.previousElementSibling?.outerHTML);
  // by its id: the container that follows has a mounted view in it, which draws nothing but leaves a marker
  expect(banner.nextElementSibling?.id).toBe(placeholder?.nextElementSibling?.id);
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
  ['live helpers', live, 'liveWaitBadge'],
  ['tables helpers', tables, 'pageWindow'],
  ['charts helpers', charts, 'niceMax'],
  ['theme wording', themes, 'themeLabel'],
  ['preferences', prefs, 'savedOption'],
  ['paging', paging, 'mountPager'],
  ['scrolling', scroll, 'scrollAnchor'],
  ['payload', payload, 'setPayload'],
  ['range helpers', rangeLib, 'visibleRanges'],
  ['range state', rangeState, 'range'],
])("the old scripts' %s are the module's exports", (_kind, module, sample) => {
  const names = Object.keys(module) as (keyof typeof module & keyof Window)[];
  expect(names).toContain(sample);
  for (const name of names) expect(window[name], name).toBe(module[name]);
});

test('no export name is in two modules', () => {
  const names = MODULES.flatMap((module) => Object.keys(module));
  expect(names.filter((name, index) => names.indexOf(name) !== index)).toEqual([]);
});

test('the session view`s tile rows are no longer handed to the old scripts', () => {
  expect('mountSessionKpis' in window).toBe(false);
  expect('mountSessionRuntime' in window).toBe(false);
  expect('releaseDetachedTiles' in window).toBe(false);
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

test('the compacting and live helpers answer as the old scripts call them', () => {
  expect(window.PAYOFF_WORDS.soon).toBe('Soon');
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

test('the cost-per-session section is mounted in its container: a card, drawn from the payload', () => {
  const card = tilesOf('costly-card');
  expect(screen.getByRole('region', { name: 'Cost per session' })).toBeInTheDocument();
  expect(card).toContainElement(screen.getByRole('region', { name: 'Cost per session' }));
  expect(card.querySelector('.bars')).toBeNull();
  window.setPayload({ summary: summary({ costly_sessions: [costlySession()] }) });
  expect(card.querySelectorAll('a.bar-row')).toHaveLength(1);
  expect(card.querySelectorAll('.legend > span')).toHaveLength(2);
});

test('the rate-limits section is mounted in its container: a card, drawn from the payload', () => {
  const card = tilesOf('limits-card');
  expect(screen.getByRole('region', { name: 'Rate limits' })).toBeInTheDocument();
  expect(card).toContainElement(screen.getByRole('region', { name: 'Rate limits' }));
  expect(card.querySelector('svg')).toBeNull();
  window.setPayload({
    summary: summary({
      api_errors: { day: [], hour: [], events: [apiErrorEvent()], windows: [] },
    }),
  });
  expect(card.querySelectorAll('table')).toHaveLength(1);
  expect(card.querySelectorAll('h3')).toHaveLength(2);
  expect(card.querySelectorAll('.legend > span')).toHaveLength(1);
});

test('the live sessions are mounted in their container: a card, drawn from the payload', () => {
  const card = tilesOf('live-card');
  expect(screen.getByRole('region', { name: 'Live sessions' })).toBeInTheDocument();
  expect(card).toContainElement(screen.getByRole('region', { name: 'Live sessions' }));
  expect(card).toHaveTextContent('Loading…');
  expect(card.querySelector('.live-card')).toBeNull();
  window.setPayload({ live: liveAnswer(), liveAt: Date.now() });
  expect(card.querySelectorAll('.live-card')).toHaveLength(1);
  expect(card).toContainElement(screen.getByRole('link', { name: 'Checkout: split payment step' }));
  expect(card.querySelector('h2 .muted')).toHaveTextContent('· changed in the last 5 min');
});

test('a failed live answer shows the failure in the card, and an answer replaces it', () => {
  window.setPayload({ liveFailed: true });
  expect(tilesOf('live-card')).toHaveTextContent('Could not load the live sessions.');
  window.setPayload({ live: liveAnswer({ sessions: [], days: null, since: null, until: null }) });
  expect(tilesOf('live-card')).not.toHaveTextContent('Could not load');
  expect(tilesOf('live-card').querySelector('.empty')).toHaveTextContent('No session active in the last 5 minutes.');
});

test('the usage tables are mounted in their container: five headings, tables drawn from the payload', () => {
  const container = tilesOf('usage-cards');
  expect(container.querySelectorAll('section.card')).toHaveLength(5);
  expect(container.querySelectorAll('h2')).toHaveLength(5);
  expect(container.querySelector('table')).toBeNull();
  window.setPayload({ summary: summary({ project: [{ project: 'shop', ...usage() }] }) });
  expect(screen.getByRole('table', { name: 'By project' })).toBeInTheDocument();
  expect(container).toContainElement(screen.getByRole('table', { name: 'By project' }));
  expect(container.querySelectorAll('table')).toHaveLength(1);
});

test('the sessions list is mounted in its container: a card with its filters, the table drawn from the payload', () => {
  const card = tilesOf('sessions-card');
  expect(screen.getByRole('region', { name: 'Sessions what each used in the range' })).toBeInTheDocument();
  expect(card).toContainElement(screen.getByRole('region', { name: 'Sessions what each used in the range' }));
  expect(card.querySelector('#sessions-project')).not.toBeNull();
  expect(card.querySelector('table')).toBeNull();
  window.setPayload({ summary: summary({ sessions: [sessionItem()] }) });
  expect(card.querySelectorAll('tbody tr')).toHaveLength(1);
  expect(card.querySelector('#sessions-count')).toHaveTextContent('1 session');
  expect(card).toContainElement(screen.getByRole('link', { name: 'Checkout: split payment step' }));
});

test('the range filter is mounted in its container: the label and buttons, drawn from the payload', () => {
  const filters = tilesOf('filters');
  expect(filters.querySelector('.label')).toHaveTextContent('Range');
  expect(filters.querySelectorAll('.segmented > button')).toHaveLength(5);
  expect(filters.querySelector('.day-nav')).toBeNull();
  window.setPayload({ summary: summary({ retention_days: 7 }) });
  expect([...filters.querySelectorAll('.segmented > button')].map((button) => button.textContent?.trim())).toEqual([
    'Daily',
    '7 days',
  ]);
});

test('the range the old scripts read is the same state the filter draws', () => {
  expect(window.range).toBe(rangeState.range);
  window.range.select(1);
  flushSync();
  expect(screen.getByRole('button', { name: 'Daily' })).toHaveAttribute('aria-pressed', 'true');
  expect(tilesOf('filters').querySelector('.day-nav')).not.toBeNull();
  expect(window.rangeQuery(window.range.days, window.range.day)).toBe('days=1');
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

test('a page without the live container fails loudly and mounts nothing', () => {
  bridged.stop();
  document.body.replaceChildren(pageBody());
  document.getElementById('live-card')?.remove();
  expect(() => bridge(window)).toThrow('The page has no #live-card container for the live sessions');
  expect(document.getElementById('error')).not.toBeNull();
  expect(document.getElementById('kpis')?.children).toHaveLength(0);
  expect(document.getElementById('trend-card')?.children).toHaveLength(0);
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

test('a page without the cost-per-session container fails loudly and mounts nothing', () => {
  bridged.stop();
  document.body.replaceChildren(pageBody());
  document.getElementById('costly-card')?.remove();
  expect(() => bridge(window)).toThrow('The page has no #costly-card container for the cost-per-session section');
  expect(document.getElementById('error')).not.toBeNull();
  expect(document.getElementById('kpis')?.children).toHaveLength(0);
  expect(document.getElementById('chart-card')?.children).toHaveLength(0);
  bridged = { stop() {} };
});

test('a page without the rate-limits container fails loudly and mounts nothing', () => {
  bridged.stop();
  document.body.replaceChildren(pageBody());
  document.getElementById('limits-card')?.remove();
  expect(() => bridge(window)).toThrow('The page has no #limits-card container for the rate-limits section');
  expect(document.getElementById('error')).not.toBeNull();
  expect(document.getElementById('kpis')?.children).toHaveLength(0);
  expect(document.getElementById('costly-card')?.children).toHaveLength(0);
  bridged = { stop() {} };
});

test('a page without the usage-tables container fails loudly and mounts nothing', () => {
  bridged.stop();
  document.body.replaceChildren(pageBody());
  document.getElementById('usage-cards')?.remove();
  expect(() => bridge(window)).toThrow('The page has no #usage-cards container for the usage tables');
  expect(document.getElementById('error')).not.toBeNull();
  expect(document.getElementById('kpis')?.children).toHaveLength(0);
  expect(document.getElementById('limits-card')?.children).toHaveLength(0);
  bridged = { stop() {} };
});

test('a page without the sessions container fails loudly and mounts nothing', () => {
  bridged.stop();
  document.body.replaceChildren(pageBody());
  document.getElementById('sessions-card')?.remove();
  expect(() => bridge(window)).toThrow('The page has no #sessions-card container for the sessions list');
  expect(document.getElementById('error')).not.toBeNull();
  expect(document.getElementById('kpis')?.children).toHaveLength(0);
  expect(document.getElementById('usage-cards')?.children).toHaveLength(0);
  bridged = { stop() {} };
});

test('a page without the filters container fails loudly and mounts nothing', () => {
  bridged.stop();
  document.body.replaceChildren(pageBody());
  document.getElementById('filters')?.remove();
  expect(() => bridge(window)).toThrow('The page has no #filters container for the range filter');
  expect(document.getElementById('error')).not.toBeNull();
  expect(document.getElementById('kpis')?.children).toHaveLength(0);
  expect(document.getElementById('sessions-card')?.children).toHaveLength(0);
  bridged = { stop() {} };
});

test('a page without the session container fails loudly and mounts nothing', () => {
  bridged.stop();
  document.body.replaceChildren(pageBody());
  document.getElementById('session-card')?.remove();
  expect(() => bridge(window)).toThrow('The page has no #session-card container for the session view');
  expect(document.getElementById('error')).not.toBeNull();
  expect(document.getElementById('kpis')?.children).toHaveLength(0);
  expect(document.getElementById('filters')?.children).toHaveLength(0);
  bridged = { stop() {} };
});

test('an open session is drawn into its container with the old scripts` slots, and stopping takes it away', () => {
  window.setPayload({ session: sessionDetail() });
  const card = tilesOf('session-card');
  expect(card.querySelector('section#drilldown')).not.toBeNull();
  expect(card.querySelectorAll('.legacy-slot')).toHaveLength(3);
  expect(document.getElementById('session-top')).not.toBeNull();
  bridged.stop();
  expect(card.children).toHaveLength(0);
  bridged = { stop() {} };
});

test('closing the session empties its container again', () => {
  window.setPayload({ session: sessionDetail() });
  window.setPayload({ session: null });
  expect(tilesOf('session-card').children).toHaveLength(0);
});

test('stopping takes the range filter away too', () => {
  bridged.stop();
  expect(tilesOf('filters').children).toHaveLength(0);
  bridged = { stop() {} };
});

test('stopping takes the sessions list away too', () => {
  bridged.stop();
  expect(tilesOf('sessions-card').children).toHaveLength(0);
  bridged = { stop() {} };
});

test('stopping takes the usage tables away too', () => {
  bridged.stop();
  expect(tilesOf('usage-cards').children).toHaveLength(0);
  bridged = { stop() {} };
});

test('stopping takes the rate-limits section away too', () => {
  bridged.stop();
  expect(tilesOf('limits-card').children).toHaveLength(0);
  bridged = { stop() {} };
});

test('stopping takes the cost-per-session section away too', () => {
  bridged.stop();
  expect(tilesOf('costly-card').children).toHaveLength(0);
  bridged = { stop() {} };
});

test('stopping takes the by-model section away too', () => {
  bridged.stop();
  expect(tilesOf('chart-card').children).toHaveLength(0);
  bridged = { stop() {} };
});

test('stopping takes the live sessions away too', () => {
  bridged.stop();
  expect(tilesOf('live-card').children).toHaveLength(0);
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
