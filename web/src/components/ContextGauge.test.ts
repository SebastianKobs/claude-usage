import { render, screen } from '@testing-library/svelte';
import { flushSync } from 'svelte';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { compactEstimate, compactNow, gauge, sessionDetail } from '../lib/fixtures';
import { compactNotes } from '../lib/gauge';
import { payload, setPayload } from '../lib/payload.svelte';
import ContextGauge from './ContextGauge.svelte';

const NOW = Date.parse('2026-09-30T12:00:00.000Z');
const WARM_UNTIL = '2026-09-30T12:05:00.000Z';

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['Date', 'setTimeout', 'clearTimeout'] });
  vi.setSystemTime(NOW);
});

afterEach(() => {
  payload.reset();
  vi.useRealTimers();
});

/** A live session whose gauge is 150K of 967K (below the 200K hint), its cache warm for five more minutes. */
function live(current = gauge({ compact_now: compactNow({ cache_warm_until: WARM_UNTIL }) })) {
  return sessionDetail({ live: true, current });
}

/** A live session whose cache is warm, with this estimate. */
function warm(estimate: ReturnType<typeof compactEstimate> | null) {
  return live(gauge({ compact_now: compactNow({ cache_warm_until: WARM_UNTIL, estimate }) }));
}

/** A gauge past the hint. */
function past(warmUntil = WARM_UNTIL, estimate = compactEstimate()) {
  return gauge({ context: 250_000, compact_now: compactNow({ cache_warm_until: warmUntil, estimate }) });
}

/** A gauge whose main thread has explored 25K tokens, with 80 calls ahead on average. */
function exploring(changes: Partial<ReturnType<typeof compactEstimate>> = {}, tokens = 25_000) {
  return gauge({
    exploration: { calls: 30, chars: tokens * 2, tokens, carried: 1.2, reread: 0.05 },
    compact_now: compactNow({ estimate: compactEstimate({ calls_ahead: 80, ...changes }) }),
  });
}

const card = () => document.getElementById('current-gauge') as HTMLElement;
const notes = () => [...card().querySelectorAll('.note')].map((note) => note.textContent ?? '');

describe('without a gauge', () => {
  test('draws nothing without a session', () => {
    const { container } = render(ContextGauge);
    expect(container.children).toHaveLength(0);
  });

  test('draws nothing for a session without a main thread`s gauge', () => {
    const { container } = render(ContextGauge);
    setPayload({ session: sessionDetail({ live: true, current: null }) });
    expect(container.children).toHaveLength(0);
    expect(document.getElementById('current-gauge')).toBeNull();
  });

  test('goes once the session closes', () => {
    render(ContextGauge);
    setPayload({ session: live() });
    expect(card()).toBeInTheDocument();
    setPayload({ session: null });
    expect(document.getElementById('current-gauge')).toBeNull();
  });
});

describe('the meter', () => {
  test('is a meter card: label, value with the share, the bar, then the note', () => {
    render(ContextGauge);
    setPayload({ session: live() });
    expect(card()).toHaveClass('card', 'gauge-card');
    expect(card().querySelector('.label')).toHaveTextContent('Latest context, main thread · claude-opus-5-5');
    const value = card().querySelector('.tile-value') as HTMLElement;
    expect(value).toHaveTextContent(/^150K of 967K · 16%$/);
    expect(value.querySelector('.secondary')).toHaveTextContent(/^of 967K/);
    const meter = screen.getByRole('meter');
    expect(meter).toHaveClass('gauge');
    expect(meter).toHaveAttribute('aria-valuemin', '0');
    expect(meter).toHaveAttribute('aria-valuemax', '967000');
    expect(meter).toHaveAttribute('aria-valuenow', '150000');
    expect(meter).toHaveAccessibleName('Latest context 150K of the auto-compact point 967K');
    expect(meter.previousElementSibling).toBe(value);
    expect(meter.nextElementSibling).toHaveClass('note');
    expect(notes()[0]).toMatch(/^817K until auto-compact · the mark is the compact hint at 200K, a heuristic/);
  });

  test('fills the bar to the share and puts the hint mark at its place', () => {
    render(ContextGauge);
    setPayload({ session: live() });
    const fill = screen.getByRole('meter').querySelector('.gauge-fill') as HTMLElement;
    const hint = screen.getByRole('meter').querySelector('.gauge-hint') as HTMLElement;
    expect(fill.style.width).toBe('15.5%');
    expect(hint.style.left).toBe('20.7%');
    expect(fill).not.toHaveAttribute('style', expect.stringContaining('left'));
  });

  test('caps the fill at the whole bar and has no hint mark where the hint is not below the auto-compact point', () => {
    render(ContextGauge);
    setPayload({ session: live(gauge({ context: 1_100_000, hint_tokens: 967_000 })) });
    const meter = screen.getByRole('meter');
    expect((meter.querySelector('.gauge-fill') as HTMLElement).style.width).toBe('100.0%');
    expect(meter.querySelector('.gauge-hint')).toBeNull();
    expect(notes()[0]).not.toMatch(/the mark is/);
  });

  test('is drawn for a session that is not live too, without a call', () => {
    render(ContextGauge);
    setPayload({ session: sessionDetail({ live: false, current: past() }) });
    expect(screen.getByRole('meter')).toBeInTheDocument();
    expect(document.getElementById('compact-call')).toBeNull();
  });
});

describe('after a compaction without a reply', () => {
  const compacted = () => gauge({ compacted: '2026-09-30T11:30:00.000Z', compact_now: null });

  test('is a card of the compaction, without a meter', () => {
    render(ContextGauge);
    setPayload({ session: live(compacted()) });
    expect(card().querySelector('.label')).toHaveTextContent('Latest context, main thread · claude-opus-5-5');
    const value = card().querySelector('.tile-value') as HTMLElement;
    expect(value).toHaveTextContent(/^Compacted at .+, no reply since$/);
    expect(value.querySelector('.secondary')).toHaveTextContent(/^at .+, no reply since$/);
    expect(screen.queryByRole('meter')).toBeNull();
    expect(notes()).toHaveLength(1);
    expect(notes()[0]).toMatch(/^Before it, the context was 150K of 967K\. The next reply shows the new one/);
    expect(card().querySelector('.compact-estimate')).toBeNull();
  });

  test('has no call to compact, however far the context had got', () => {
    render(ContextGauge);
    const late = gauge({ context: 500_000, compacted: '2026-09-30T11:30:00.000Z', compact_now: null });
    setPayload({ session: live(late) });
    expect(document.getElementById('compact-call')).toBeNull();
  });

  test('turns into the meter with the next call, in the same card', () => {
    render(ContextGauge);
    setPayload({ session: live(compacted()) });
    const before = card();
    setPayload({ session: live() });
    expect(card()).toBe(before);
    expect(screen.getByRole('meter')).toBeInTheDocument();
  });
});

describe('what compacting now would cost', () => {
  test('are notes under the gauge: the exact parts, then the estimate as a paragraph', () => {
    render(ContextGauge);
    const current = live().current;
    setPayload({ session: live() });
    const parts = compactNotes(current?.compact_now ?? compactNow(), false);
    expect(notes()[1]).toBe(parts.exact);
    expect(notes()[1]).toMatch(/^Every reply sends the whole conversation again: 150K, /);
    expect(notes()[1]).toMatch(/The cache stays warm until .+ \(5 min after the last request\); after that/);
    const estimate = card().querySelector('p.compact-estimate') as HTMLElement;
    expect(estimate.previousElementSibling).toHaveClass('note');
    expect(estimate.previousElementSibling).toHaveTextContent(parts.exact);
  });

  test('read as one sentence of the lead, the bold pay-off phrase and the rest', () => {
    render(ContextGauge);
    setPayload({ session: live() });
    const parts = compactNotes(compactNow({ cache_warm_until: WARM_UNTIL }), false).estimate;
    if (!parts) throw new Error('an estimate');
    const estimate = card().querySelector('.compact-estimate') as HTMLElement;
    expect(estimate.textContent).toBe(`${parts.lead}${parts.phrase}${parts.rest}`);
    expect(estimate).toHaveTextContent(/^If you compacted now, it would shrink to about 50K \(40K–60K\)\. /);
    expect(estimate.querySelector('strong')).toHaveTextContent(/^would pay off after about 10 replies \(5–20\)$/);
    expect(estimate.textContent).toMatch(/\. Soon: after your past compactions, a stretch this long went on/);
  });

  test('has the tone`s mark before the phrase, hidden from a screen reader', () => {
    render(ContextGauge);
    setPayload({ session: live() });
    const mark = card().querySelector('.compact-estimate .payoff-mark') as HTMLElement;
    expect(mark).toHaveClass('payoff-soon');
    expect(mark).toHaveAttribute('aria-hidden', 'true');
    expect(mark.nextElementSibling?.tagName).toBe('STRONG');
    expect(mark).toBeEmptyDOMElement();
  });

  test.each([
    ['close', { breakeven_calls: 30 }],
    ['later', { breakeven_calls: null, breakeven_low: null, pays_later_in: 12, pays_later_at: 300_000 }],
    ['unlikely', { breakeven_calls: 70 }],
  ])('marks %s in its own tone', (tone, changes) => {
    render(ContextGauge);
    setPayload({ session: warm(compactEstimate(changes)) });
    expect(card().querySelector('.payoff-mark')).toHaveClass(`payoff-${tone}`);
  });

  test('has no mark where there are no replies ahead to compare with', () => {
    render(ContextGauge);
    setPayload({ session: warm(compactEstimate({ calls_ahead: null })) });
    const estimate = card().querySelector('.compact-estimate') as HTMLElement;
    expect(estimate).toBeInTheDocument();
    expect(estimate.querySelector('.payoff-mark')).toBeNull();
    expect(estimate.querySelector('strong')).toBeInTheDocument();
  });

  test('says why there is no estimate, in a note instead of the paragraph', () => {
    render(ContextGauge);
    setPayload({ session: live(gauge({ compact_now: compactNow({ estimate: null, stored_compactions: 0 }) })) });
    expect(card().querySelector('.compact-estimate')).toBeNull();
    expect(notes().at(-1)).toBe('No estimate of compacting now: no stored compaction to learn from yet.');
    expect(notes()).toHaveLength(3);
  });

  test('has none where the session has nothing to compact', () => {
    render(ContextGauge);
    setPayload({ session: live(gauge({ compact_now: null })) });
    expect(notes()).toHaveLength(1);
    expect(card().querySelector('.compact-estimate')).toBeNull();
  });
});

describe('the call to compact', () => {
  test('comes before the gauge, for a live session past the hint, in the threshold`s words', () => {
    render(ContextGauge);
    setPayload({ session: live(past()) });
    const call = screen.getByRole('region', { name: /^⚠ Your context is past your 200K compact hint$/ });
    expect(call).toBe(document.getElementById('compact-call'));
    expect(call.nextElementSibling).toBe(card());
    expect(screen.getByRole('button', { name: 'Copy /compact' })).toBeInTheDocument();
    expect(call.textContent).toMatch(/How many replies still follow can't be predicted/);
  });

  test('is not there below the hint while the cache is warm', () => {
    render(ContextGauge);
    setPayload({ session: live() });
    expect(document.getElementById('compact-call')).toBeNull();
  });

  test('is not there for a session that is not live, past the hint or not', () => {
    render(ContextGauge);
    setPayload({ session: sessionDetail({ live: false, current: past() }) });
    expect(document.getElementById('compact-call')).toBeNull();
  });

  test('comes and goes with the session`s refreshes', () => {
    render(ContextGauge);
    setPayload({ session: live() });
    expect(document.getElementById('compact-call')).toBeNull();
    setPayload({ session: live(past()) });
    expect(document.getElementById('compact-call')).toBeInTheDocument();
    setPayload({ session: live() });
    expect(document.getElementById('compact-call')).toBeNull();
  });

  test('is cold where the cache has already expired and compacting saves at once', () => {
    render(ContextGauge);
    const estimate = compactEstimate({ cold_saving: 0.4 });
    const expired = compactNow({ cache_warm_until: '2026-09-30T11:00:00Z', estimate });
    setPayload({ session: live(gauge({ compact_now: expired })) });
    const call = screen.getByRole('region', { name: '⚠ The cache has expired: compacting now saves money' });
    expect(call).toHaveTextContent(/Doing it now saves about \$0\.40 at once\./);
  });

  test('is not cold where compacting cold would cost', () => {
    render(ContextGauge);
    setPayload({ session: live(gauge({ compact_now: compactNow({ cache_warm_until: '2026-09-30T11:00:00Z' }) })) });
    expect(document.getElementById('compact-call')).toBeNull();
  });
});

describe('the hint to delegate', () => {
  test('comes after the call to compact and before the gauge', () => {
    render(ContextGauge);
    setPayload({ session: live(exploring({}, 25_000)) });
    expect(document.getElementById('compact-call')).toBeNull();
    const hint = screen.getByRole('region', { name: 'Explore in a subagent' });
    expect(hint).toBe(document.getElementById('delegate-call'));
    expect(hint.nextElementSibling).toBe(card());
    expect(hint.textContent).toMatch(/read, searched and listed 25K tokens in 30 calls/);
    expect(hint.lastElementChild).toHaveClass('muted');
  });

  test('follows the call to compact where both show', () => {
    render(ContextGauge);
    const both = exploring();
    setPayload({ session: live({ ...both, context: 250_000 }) });
    const order = [...document.body.querySelectorAll('#compact-call, #delegate-call, #current-gauge')].map(
      (node) => node.id,
    );
    expect(order).toEqual(['compact-call', 'delegate-call', 'current-gauge']);
  });

  test('is not there with less exploration than the session asks for', () => {
    render(ContextGauge);
    setPayload({ session: live(exploring({}, 19_999)) });
    expect(document.getElementById('delegate-call')).toBeNull();
  });

  test('is not there with fewer calls ahead than the session asks for', () => {
    render(ContextGauge);
    setPayload({ session: live(exploring({ calls_ahead: 59 })) });
    expect(document.getElementById('delegate-call')).toBeNull();
  });

  test('is there at exactly both limits', () => {
    render(ContextGauge);
    setPayload({ session: live(exploring({ calls_ahead: 60 }, 20_000)) });
    expect(document.getElementById('delegate-call')).toBeInTheDocument();
  });

  test('is not there without exploration, or for a session that is not live', () => {
    render(ContextGauge);
    setPayload({ session: live(gauge({ exploration: null })) });
    expect(document.getElementById('delegate-call')).toBeNull();
    setPayload({ session: sessionDetail({ live: false, current: exploring() }) });
    expect(document.getElementById('delegate-call')).toBeNull();
  });
});

describe('the clock', () => {
  const tick = () => {
    vi.advanceTimersByTime(5 * 60_000 + 1000);
    flushSync();
  };

  /** A cold saving that makes the call to compact come when the cache expires. */
  const saving = compactEstimate({ cold_saving: 0.4 });

  test('says the cache stays warm until it runs out, and that it has likely expired after', () => {
    render(ContextGauge);
    setPayload({ session: live(gauge({ compact_now: compactNow({ cache_warm_until: WARM_UNTIL }) })) });
    expect(notes()[1]).toMatch(/The cache stays warm until /);
    expect(notes()[1]).not.toMatch(/has likely expired/);
    vi.advanceTimersByTime(5 * 60_000 + 999);
    flushSync();
    expect(notes()[1]).toMatch(/The cache stays warm until /);
    vi.advanceTimersByTime(1);
    flushSync();
    expect(notes()[1]).toMatch(/The cache has likely expired \(.+\): the next reply sends it all at the full price/);
    expect(notes()[1]).not.toMatch(/stays warm/);
  });

  test('rewords the estimate for the cache that has expired', () => {
    render(ContextGauge);
    setPayload({ session: live() });
    const warm = card().querySelector('.compact-estimate')?.textContent;
    expect(warm).toMatch(/That costs ~\$0\.30 once and would pay off after about 10 replies/);
    tick();
    const cold = card().querySelector('.compact-estimate')?.textContent;
    expect(cold).toMatch(/^If you compacted now, it would shrink to about 50K \(40K–60K\)\. Compacting /);
    expect(cold).not.toBe(warm);
  });

  test('brings the cold call in where compacting cold saves at once', () => {
    render(ContextGauge);
    setPayload({ session: warm(saving) });
    expect(document.getElementById('compact-call')).toBeNull();
    tick();
    const call = screen.getByRole('region', { name: '⚠ The cache has expired: compacting now saves money' });
    expect(call.nextElementSibling).toBe(card());
    expect(call).toHaveTextContent(/Doing it now saves about \$0\.40 at once\./);
  });

  test('rewords the threshold call as the cache expires, in the same card', () => {
    render(ContextGauge);
    setPayload({ session: live(past()) });
    const call = document.getElementById('compact-call');
    expect(call).toHaveTextContent(/Every reply sends your whole conversation again/);
    tick();
    expect(document.getElementById('compact-call')).toBe(call);
    expect(call).toHaveTextContent(/The cache has expired, so the next reply sends your whole conversation/);
    expect(call).not.toHaveTextContent(/Every reply sends your whole conversation again/);
  });

  test('keeps the gauge card`s node across the tick', () => {
    render(ContextGauge);
    setPayload({ session: live() });
    const before = card();
    const meter = screen.getByRole('meter');
    tick();
    expect(card()).toBe(before);
    expect(screen.getByRole('meter')).toBe(meter);
  });

  test('keeps the gauge card`s node across a refresh of the same session, and the clock with it', () => {
    render(ContextGauge);
    setPayload({ session: live() });
    const before = card();
    const grown = gauge({ context: 160_000, compact_now: compactNow({ cache_warm_until: WARM_UNTIL }) });
    setPayload({ session: live(grown) });
    expect(card()).toBe(before);
    expect(card().querySelector('.tile-value')).toHaveTextContent(/^160K of /);
    expect(vi.getTimerCount()).toBe(1);
    tick();
    expect(card()).toBe(before);
    expect(notes()[1]).toMatch(/has likely expired/);
  });

  test('follows another moment the refresh brings, with one timer', async () => {
    render(ContextGauge);
    setPayload({ session: live() });
    setPayload({
      session: live(gauge({ compact_now: compactNow({ cache_warm_until: '2026-09-30T12:20:00.000Z' }) })),
    });
    await Promise.resolve();
    expect(vi.getTimerCount()).toBe(1);
    tick();
    expect(notes()[1]).toMatch(/The cache stays warm until /);
    vi.advanceTimersByTime(15 * 60_000);
    flushSync();
    expect(notes()[1]).toMatch(/has likely expired/);
  });

  test('sets no timer for a cache that has expired already, or for none to watch', async () => {
    render(ContextGauge);
    setPayload({ session: live(gauge({ compact_now: compactNow({ cache_warm_until: '2026-09-30T11:00:00Z' }) })) });
    expect(vi.getTimerCount()).toBe(0);
    setPayload({ session: live(gauge({ compact_now: compactNow({ cache_warm_until: null }) })) });
    await Promise.resolve();
    expect(vi.getTimerCount()).toBe(0);
    expect(notes()[1]).not.toMatch(/The cache (stays|has)/);
  });

  test('leaves no timer once it is unmounted, or once the session closes', async () => {
    const { unmount } = render(ContextGauge);
    setPayload({ session: live() });
    expect(vi.getTimerCount()).toBe(1);
    setPayload({ session: null });
    await Promise.resolve();
    expect(vi.getTimerCount()).toBe(0);
    setPayload({ session: live() });
    expect(vi.getTimerCount()).toBe(1);
    unmount();
    await Promise.resolve();
    expect(vi.getTimerCount()).toBe(0);
  });
});
