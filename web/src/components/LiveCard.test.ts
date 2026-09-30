import { render, screen } from '@testing-library/svelte';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import type { CompactEstimate, Gauge, SessionState } from '../lib/api';
import { liveSession, liveSubagent } from '../lib/fixtures';
import LiveCard from './LiveCard.svelte';

const NOW = Date.parse('2026-09-29T12:00:00Z');

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(NOW);
});

afterEach(() => {
  vi.useRealTimers();
});

/** A state with a session's secret counts, and optionally a gauge. */
function state(secrets: Partial<SessionState['secrets']> = {}, current: Gauge | null = null): SessionState {
  return { session_id: 'live-1', current, secrets: { high: 0, medium: 0, 'low-medium': 0, low: 0, ...secrets } };
}

/** A gauge past its hint whose compacting pays off soon (10 of 40 replies), its cache warm until `warmUntil`. */
function gauge(warmUntil = '2026-09-29T12:30:00Z', saving = -0.5): Gauge {
  const estimate = {
    breakeven_calls: 10,
    breakeven_low: 5,
    breakeven_high: 20,
    calls_ahead: 40,
    cold_saving: saving,
    breakeven_cold: 10,
    calls_after_high: 60,
    pays_later_in: null,
    pays_later_at: null,
  } as CompactEstimate;
  return {
    context: 150_000,
    hint_tokens: 200_000,
    compacted: null,
    compact_now: { cache_warm_until: warmUntil, estimate },
  } as Gauge;
}

function draw(props: Partial<{ session: ReturnType<typeof liveSession>; sessionState: SessionState; now: number }>) {
  return render(LiveCard, { props: { session: liveSession(), sessionState: undefined, now: NOW, ...props } });
}

describe('the head', () => {
  test('has a dot and the title linking to the session view, nothing between them', () => {
    const { container } = draw({});
    const title = container.querySelector('.live-head > .title') as HTMLElement;
    expect([...title.childNodes].map((node) => (node as Element).tagName)).toEqual(['SPAN', 'A']);
    expect(title.firstElementChild).toHaveClass('dot');
    expect(title.firstElementChild).toHaveAttribute('aria-hidden', 'true');
    expect(screen.getByRole('link', { name: 'Checkout: split payment step' })).toHaveAttribute(
      'href',
      '#session/live-1',
    );
  });

  test('names a session without a title, and encodes its id in the link', () => {
    draw({ session: liveSession({ title: null, session_id: 'shop/1' }) });
    expect(screen.getByRole('link', { name: 'Untitled session' })).toHaveAttribute('href', '#session/shop%2F1');
  });

  test('has the state slot, empty without a state and without a wait', () => {
    const { container } = draw({});
    expect([...(container.querySelector('.live-head')?.children ?? [])].map((child) => child.className)).toEqual([
      'title',
      'live-states',
    ]);
    expect(container.querySelector('.live-states')?.children).toHaveLength(0);
    expect(screen.queryByRole('img')).toBeNull();
  });
});

describe('the wait badge', () => {
  test('is a padlock for a permission, described by its words, directly in the head after the title', () => {
    const waiting = { kind: 'permission', tool: 'Bash', since: '2026-09-29T11:58:00Z', agent_type: null } as const;
    const { container } = draw({ session: liveSession({ waiting }) });
    const icon = screen.getByRole('img', { name: /^Waiting for your permission to use Bash since / });
    expect(icon).toHaveClass('live-icon', 'live-icon-permission', 'live-icon-waiting');
    expect(icon).toHaveAttribute('title', icon.getAttribute('aria-label'));
    expect(icon.parentElement).toBe(container.querySelector('.live-head'));
    expect(icon.previousElementSibling).toBe(container.querySelector('.title'));
    expect(icon.nextElementSibling).toBe(container.querySelector('.live-states'));
  });

  test('is a speech bubble for a question', () => {
    const since = '2026-09-29T11:58:00Z';
    const waiting = { kind: 'question', tool: 'AskUserQuestion', since, agent_type: null } as const;
    draw({ session: liveSession({ waiting }) });
    const icon = screen.getByRole('img', { name: /^Waiting for your answer since / });
    expect(icon.className).toBe('live-icon live-icon-waiting live-icon-waiting');
  });
});

describe('the state icons', () => {
  test('are the secret access then compacting now, in the states slot', () => {
    const { container } = draw({ sessionState: state({ medium: 1 }, gauge()) });
    const icons = [...container.querySelectorAll('.live-states > .live-icon')];
    expect(icons.map((icon) => icon.className)).toEqual([
      'live-icon live-icon-secret live-icon-medium',
      'live-icon live-icon-compact live-icon-soon',
    ]);
    expect(icons[0]).toHaveAccessibleName('Possible secret access: 1 call returned a result or may still');
    expect(icons[1]).toHaveAccessibleName('Soon: compacting now pays off after ~10 replies, ~40 ahead on average.');
  });

  test('are only the ones the state calls for', () => {
    const { container } = draw({ sessionState: state({ low: 5 }) });
    expect(container.querySelector('.live-states')?.children).toHaveLength(0);
  });

  test('count the cache’s expiry from the time given', () => {
    const expired = '2026-09-29T11:00:00Z';
    const { container } = draw({ sessionState: state({}, gauge(expired, 1.25)) });
    const icon = container.querySelector('.live-icon-compact');
    expect(icon).toHaveAccessibleName(/^Compacting now saves ~\$1\.25 at once/);
  });
});

describe('the state icons over time', () => {
  test('are worked out at the time given, not the clock: a cache warm at the clock has expired at `now`', () => {
    const warm = '2026-09-29T12:30:00Z';
    const later = NOW + 60 * 60 * 1000;
    const { container } = draw({ sessionState: state({}, gauge(warm, 1.25)), now: later });
    const icon = container.querySelector('.live-icon-compact');
    expect(icon).toHaveAccessibleName(/^Compacting now saves ~\$1\.25 at once/);
  });

  test('keep their node while their words change', () => {
    const { container, rerender } = draw({ sessionState: state({ medium: 1 }) });
    const icon = container.querySelector('.live-icon-secret');
    void rerender({ session: liveSession(), sessionState: state({ medium: 2 }), now: NOW });
    expect(container.querySelector('.live-icon-secret')).toBe(icon);
    expect(icon).toHaveAccessibleName('Possible secret access: 2 calls returned a result or may still');
  });
});

describe('the numbers line', () => {
  test('has the project, the branch and how long ago the session changed, counted from now', () => {
    const { container } = draw({});
    expect(container.querySelector('.live-card > .muted')).toHaveTextContent('shop · main · 12 s ago');
  });

  test('leaves the branch out where there is none', () => {
    const { container } = draw({ session: liveSession({ git_branch: null }) });
    expect(container.querySelector('.live-card > .muted')?.textContent).toBe('shop · 12 s ago');
  });

  test('counts the time from the now given, not the clock', () => {
    const { container } = draw({ now: NOW + 120_000 });
    expect(container.querySelector('.live-card > .muted')).toHaveTextContent('shop · main · 2 min ago');
  });
});

describe('the totals', () => {
  test('are turns, output, last context and cost', () => {
    const session = liveSession({ turns: 1234, output: 56_000, last_context: 60_000, cost: 1.5 });
    const { container } = draw({ session });
    const cells = [...container.querySelectorAll('.numbers > div')];
    const pairs = cells.map((cell) => [
      cell.querySelector('span.label')?.textContent,
      cell.querySelector('strong')?.textContent,
    ]);
    expect(pairs).toEqual([
      ['Turns', '1,234'],
      ['Output', '56K'],
      ['Last context', '60K'],
      ['Cost', '$1.50'],
    ]);
  });
});

describe('the subagents', () => {
  test('are listed with their type, description and what they used', () => {
    const { container } = draw({ session: liveSession({ subagents: [liveSubagent()] }) });
    const item = container.querySelector('ul > li') as HTMLElement;
    expect(item.querySelector('strong')).toHaveTextContent('general-purpose');
    expect(item.querySelector('.secondary')).toHaveTextContent('Find the callers');
    expect(item.querySelector('.sub.muted')).toHaveTextContent(
      'claude-sonnet-5-5 · 4 turns · context 20K · 30 s ago',
    );
    expect(container.querySelector('.note')).toBeNull();
  });

  test('have a dash for an unknown model and nothing for a missing description', () => {
    const { container } = draw({
      session: liveSession({ subagents: [liveSubagent({ model: null, description: null })] }),
    });
    expect(container.querySelector('li .secondary')?.textContent).toBe('');
    expect(container.querySelector('li .sub')).toHaveTextContent('– · 4 turns');
  });

  test('keep their nodes by agent id', () => {
    const first = liveSubagent({ agent_id: 'a-1', description: 'One' });
    const second = liveSubagent({ agent_id: 'a-2', description: 'Two' });
    const { container, rerender } = draw({ session: liveSession({ subagents: [first, second] }) });
    const before = [...container.querySelectorAll('li')];
    void rerender({ session: liveSession({ subagents: [second, first] }), sessionState: undefined, now: NOW });
    expect([...container.querySelectorAll('li')]).toEqual([before[1], before[0]]);
  });

  test('are replaced by a note where none runs', () => {
    const { container } = draw({});
    expect(container.querySelector('ul')).toBeNull();
    expect(container.querySelector('.live-card > .note')).toHaveTextContent('No subagent running');
  });
});
