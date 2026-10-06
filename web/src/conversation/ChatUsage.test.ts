import { render } from '@testing-library/svelte';
import { describe, expect, test } from 'vitest';
import type { AutoHint, CompactHint, PaysHint, PaysReminderHint, SoftHint, SoftReminderHint } from '../api/api';
import { callUsage } from '../api/fixtures';
import ChatUsage from './ChatUsage.svelte';

const soft: SoftHint = { kind: 'soft', context: 300_000, threshold: 200_000, reread_cost: 0.75 };
const softReminder: SoftReminderHint = { kind: 'soft_reminder', context: 300_000, threshold: 200_000, times: 1.5 };
const pays: PaysHint = {
  kind: 'pays',
  context: 300_000,
  pays_off_in: 7,
  calls_ahead: 40,
  ahead_from: 'longer',
  one_time: 1.5,
  after: 120_000,
};
const paysReminder: PaysReminderHint = { kind: 'pays_reminder', context: 400_000, pays_off_in: 5 };
const auto: AutoHint = { kind: 'auto', context: 850_000, auto_compact: 1_000_000, share: 0.85 };
const autoReminder: AutoHint = { ...auto, kind: 'auto_reminder', context: 900_000 };

function badge(container: HTMLElement): HTMLElement {
  return container.querySelector('.chat-usage') as HTMLElement;
}

function draw(changes = {}, hint?: CompactHint) {
  return render(ChatUsage, { usage: callUsage(changes), hint });
}

describe('the badge', () => {
  test('is the price in bold and what the call used after it', () => {
    const { container } = draw();
    expect(badge(container).querySelector('strong')?.textContent).toBe('$0.25');
    expect(badge(container).textContent).toBe(
      '$0.25 · context 50K (+2.5K: reply 500, added 2K) · in 1K · cache write 4K · cache read 45K · out 500',
    );
  });

  test('says there is no price where the model has none', () => {
    const { container } = draw({ cost: null });
    expect(badge(container).querySelector('strong')?.textContent).toBe('no price');
  });

  test('leaves out a cache that was not written or read', () => {
    const { container } = draw({ cache_write: 0, cache_read: 0 });
    expect(badge(container).textContent).not.toContain('cache');
  });

  test('counts web searches', () => {
    const { container } = draw({ web_searches: 2 });
    expect(badge(container).textContent).toContain(' · 2 web searches');
  });

  test('says fast mode', () => {
    const { container } = draw({ speed: 'fast' });
    expect(badge(container).textContent).toMatch(/ · fast mode$/);
  });

  test('has no hover text without the token reminder', () => {
    const { container } = draw();
    expect(badge(container)).not.toHaveAttribute('title');
  });

  test('says on hover that the token reminder is part of the context', () => {
    const { container } = draw({ reminder_chars: 1258 });
    expect(badge(container)).toHaveAttribute(
      'title',
      "The context includes Claude Code's token reminder (1,258 characters)",
    );
  });

  test('has no chip and no hint without one', () => {
    const { container } = draw();
    expect(badge(container).querySelector('span[role="note"]')).toBeNull();
    expect(container.querySelector('.compact-hint')).toBeNull();
    expect(container.children).toHaveLength(1);
  });
});

describe('the tint', () => {
  test('is none without a hint', () => {
    const { container } = draw();
    expect(badge(container).className).toBe('chat-usage');
  });

  test('is none for the first hint of a kind, which is a block', () => {
    for (const hint of [soft, pays, auto]) {
      const { container, unmount } = draw({}, hint);
      expect(badge(container).className).toBe('chat-usage');
      unmount();
    }
  });

  test('is the soft reminder`s', () => {
    const { container } = draw({}, softReminder);
    expect(badge(container).className).toBe('chat-usage chat-usage-remind');
  });

  test('is the pays reminder`s', () => {
    const { container } = draw({}, paysReminder);
    expect(badge(container).className).toBe('chat-usage chat-usage-remind-pays');
  });

  test('is the auto reminder`s', () => {
    const { container } = draw({}, autoReminder);
    expect(badge(container).className).toBe('chat-usage chat-usage-remind-auto');
  });
});

describe('the reminder chip', () => {
  const chip = (container: HTMLElement) => badge(container).querySelector('.compact-chip') as HTMLElement;

  test('a soft reminder says how many times the hint the context is', () => {
    const { container } = draw({}, softReminder);
    expect(chip(container).textContent).toBe('ℹ 300K · 1.5× your 200K hint');
    expect(chip(container).className).toBe('compact-chip');
    expect(chip(container)).toHaveAttribute('role', 'note');
  });

  test('a pays reminder says when compacting pays', () => {
    const { container } = draw({}, paysReminder);
    expect(chip(container).textContent).toBe('⚠ 400K · compacting pays after ~5 replies');
    expect(chip(container).className).toBe('compact-chip compact-chip-pays');
  });

  test('an auto reminder says how near the auto-compact point is', () => {
    const { container } = draw({}, autoReminder);
    expect(chip(container).textContent).toBe('⚠ 90% of auto-compact (1M)');
    expect(chip(container).className).toBe('compact-chip compact-chip-auto');
  });

  test('follows the parts after a space, inside the badge', () => {
    const { container } = draw({}, softReminder);
    expect(badge(container).textContent).toMatch(/out 500 ℹ 300K · 1\.5× your 200K hint$/);
  });

  test('the first hint of a kind gives no chip', () => {
    for (const hint of [soft, pays, auto]) {
      const { container, unmount } = draw({}, hint);
      expect(container.querySelector('.compact-chip')).toBeNull();
      unmount();
    }
  });
});

describe('the rebuild chip', () => {
  const rebuild = { cause: 'idle', lost: 52_000, extra_cost: 0.31 } as const;
  const chip = (container: HTMLElement) => badge(container).querySelector('.rebuild-chip') as HTMLElement;

  test('says the cache was written again, why and what it cost, with the reason on hover', () => {
    const { container } = draw({ rebuild });
    expect(chip(container).textContent).toBe('↻ cache rebuilt (idle) · 52K · +$0.31');
    expect(chip(container)).toHaveAttribute('role', 'note');
    expect(chip(container).getAttribute('title')).toMatch(/^52K tokens written to the cache again: .+/);
  });

  test('leaves the cost out where it is not known', () => {
    const { container } = draw({ rebuild: { ...rebuild, extra_cost: null } });
    expect(chip(container).textContent).toBe('↻ cache rebuilt (idle) · 52K');
  });

  test('follows the parts after a space', () => {
    const { container } = draw({ rebuild });
    expect(badge(container).textContent).toMatch(/out 500 ↻ cache rebuilt/);
  });

  test('comes after the reminder chip, each after a space', () => {
    const { container } = draw({ rebuild }, softReminder);
    expect(badge(container).textContent).toMatch(/hint ↻ cache rebuilt \(idle\) · 52K · \+\$0\.31$/);
    expect(chip(container).previousElementSibling?.className).toBe('compact-chip');
  });

  test('is not there without a rebuild', () => {
    const { container } = draw();
    expect(container.querySelector('.rebuild-chip')).toBeNull();
  });
});

describe('the hint block', () => {
  const block = (container: HTMLElement) => container.querySelector('.compact-hint') as HTMLElement;

  test('is a note after the badge, a sibling of it, its label in bold', () => {
    const { container } = draw({}, soft);
    expect(badge(container).nextElementSibling).toBe(block(container));
    expect(block(container)).toHaveAttribute('role', 'note');
    expect(block(container).querySelector('strong')?.textContent).toBe('ℹ Consider compacting');
    expect(block(container).textContent).toMatch(/^ℹ Consider compacting Context 300K, over the 200K hint/);
  });

  test('the soft hint says what the turn cost in cache reads, and has no tone', () => {
    const { container } = draw({}, soft);
    expect(block(container).className).toBe('compact-hint');
    expect(block(container).textContent).toContain('Every turn re-reads it: this turn cost $0.75 in cache reads.');
  });

  test('the soft hint leaves the cost out where there was none', () => {
    const { container } = draw({}, { ...soft, reread_cost: 0 });
    expect(block(container).textContent).toContain('Every turn re-reads it. /compact');
  });

  test('the pays hint says what compacting costs and when it pays back, in its tone', () => {
    const { container } = draw({}, pays);
    expect(block(container).className).toBe('compact-hint compact-pays');
    expect(block(container).querySelector('strong')?.textContent).toBe('⚠ Compacting pays on average');
    expect(block(container).textContent).toContain('shrink it to about 120K. That costs ~$1.50 once');
    expect(block(container).textContent).toContain('within about 7 replies');
  });

  test('the pays hint says a stretch this long went on for more, where it learnt from longer ones', () => {
    const { container } = draw({}, pays);
    expect(block(container).textContent).toContain('a stretch this long went on for about 40 more on average.');
  });

  test('the pays hint says how many replies followed, where it learnt from all stretches', () => {
    const { container } = draw({}, { ...pays, ahead_from: 'all' });
    expect(block(container).textContent).toContain('you went on for about 40 replies on average.');
  });

  test('the auto hint says how near the auto-compact point is, in its tone', () => {
    const { container } = draw({}, auto);
    expect(block(container).className).toBe('compact-hint compact-auto');
    expect(block(container).querySelector('strong')?.textContent).toBe('⚠ Compact soon');
    expect(block(container).textContent).toContain('Context 850K: 85% of the 1M where Claude Code auto-compacts.');
  });

  test('a reminder gives no block: it is a chip', () => {
    for (const hint of [softReminder, paysReminder, autoReminder]) {
      const { container, unmount } = draw({}, hint);
      expect(container.querySelector('.compact-hint')).toBeNull();
      unmount();
    }
  });

  test('is not there without a hint', () => {
    const { container } = draw();
    expect(container.querySelector('.compact-hint')).toBeNull();
  });
});
