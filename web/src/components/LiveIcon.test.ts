import { render, screen } from '@testing-library/svelte';
import { describe, expect, test } from 'vitest';
import type { BadgeKind, LiveBadge } from '../lib/live';
import LiveIcon from './LiveIcon.svelte';

function badge(kind: BadgeKind, tone: string | null = null): LiveBadge {
  return { kind, tone, text: `The ${kind} words` };
}

describe('the icon', () => {
  test('is an image described by the badge’s words, on hover and to screen readers', () => {
    render(LiveIcon, { props: { badge: badge('secret', 'high') } });
    const icon = screen.getByRole('img', { name: 'The secret words' });
    expect(icon).toHaveAttribute('title', 'The secret words');
    expect(icon.tagName).toBe('SPAN');
  });

  test('has its kind’s class and its tone’s', () => {
    render(LiveIcon, { props: { badge: badge('compact', 'soon') } });
    expect(screen.getByRole('img')).toHaveClass('live-icon', 'live-icon-compact', 'live-icon-soon');
  });

  test('has no tone class without a tone', () => {
    render(LiveIcon, { props: { badge: badge('compact') } });
    expect(screen.getByRole('img').className).toBe('live-icon live-icon-compact');
  });

  test('wraps a 24-unit svg that is hidden from screen readers and not focusable', () => {
    const { container } = render(LiveIcon, { props: { badge: badge('waiting', 'waiting') } });
    const drawing = container.querySelector('svg');
    expect(drawing).toHaveAttribute('viewBox', '0 0 24 24');
    expect(drawing).toHaveAttribute('aria-hidden', 'true');
    expect(drawing).toHaveAttribute('focusable', 'false');
  });

  test('sets no style attribute anywhere, which the page’s CSP would refuse', () => {
    const { container } = render(LiveIcon, { props: { badge: badge('secret', 'medium') } });
    expect(container.querySelectorAll('[style]')).toHaveLength(0);
  });
});

describe('the shapes', () => {
  test.each([
    ['permission', ['path', 'rect', 'circle', 'path']],
    ['waiting', ['path', 'path', 'circle']],
    ['secret', ['path', 'path', 'rect', 'rect', 'path', 'path']],
    ['compact', ['rect', 'path', 'rect', 'path']],
  ] as [BadgeKind, string[]][])('of %s are its own', (kind, tags) => {
    const { container } = render(LiveIcon, { props: { badge: badge(kind) } });
    expect([...(container.querySelector('svg')?.children ?? [])].map((shape) => shape.tagName)).toEqual(tags);
  });

  test('of the padlock are a shackle, a body, a keyhole and its slot, in currentColor', () => {
    const { container } = render(LiveIcon, { props: { badge: badge('permission') } });
    const shapes = [...(container.querySelectorAll('svg > *') ?? [])];
    expect(shapes[0]).toHaveAttribute('d', 'M8 10.5V7.8a4 4 0 0 1 8 0v2.7');
    expect(shapes[1]).toHaveAttribute('rx', '2');
    expect(shapes[2]).toHaveAttribute('fill', 'currentColor');
    expect(shapes[3]).toHaveAttribute('d', 'M12 15.4v2.4');
  });

  test('of the black hat have a coat drawn with the even-odd rule, so its collar is a notch', () => {
    const { container } = render(LiveIcon, { props: { badge: badge('secret') } });
    expect(container.querySelector('svg > path:last-child')).toHaveAttribute('fill-rule', 'evenodd');
  });

  test('of the speech bubble end in the question mark’s dot', () => {
    const { container } = render(LiveIcon, { props: { badge: badge('waiting') } });
    expect(container.querySelector('svg > circle')).toHaveAttribute('cy', '14.4');
  });

  test('of the trash compactor have its press over the bin', () => {
    const { container } = render(LiveIcon, { props: { badge: badge('compact') } });
    expect(container.querySelectorAll('svg > rect')[1]).toHaveAttribute('y', '7.8');
  });
});
