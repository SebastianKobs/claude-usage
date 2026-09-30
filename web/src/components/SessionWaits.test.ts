import { render, screen } from '@testing-library/svelte';
import { describe, expect, test } from 'vitest';
import { pagePerTest } from '../lib/app.testing';
import type { Waiting } from '../lib/api';
import { live, liveSession, sessionDetail } from '../lib/fixtures';
import SessionWaits from './SessionWaits.svelte';

const page = pagePerTest();

const QUESTION: Waiting = {
  kind: 'question',
  tool: 'AskUserQuestion',
  since: '2026-09-29T11:58:00Z',
  agent_type: null,
};
const PERMISSION: Waiting = { kind: 'permission', tool: 'Bash', since: '2026-09-29T11:59:00Z', agent_type: 'Explore' };


const notice = () => screen.getByRole('status', { hidden: true });

describe('the notice', () => {
  test('is a status card that is in the page from the start and hidden while nothing waits', () => {
    page.render(SessionWaits);
    expect(notice()).toHaveClass('card', 'wait-notice');
    expect(notice()).toBeInTheDocument();
    expect(notice()).not.toBeVisible();
    page.set({ session: sessionDetail(), live: live({ sessions: [liveSession()] }) });
    expect(notice()).not.toBeVisible();
    expect(notice().querySelector('.wait-line')).toBeNull();
  });

  test('stays hidden, without a line, while no session is open, whatever the live sessions wait for', () => {
    page.render(SessionWaits);
    page.set({ live: live({ sessions: [liveSession({ waiting: QUESTION })] }) });
    expect(notice()).not.toBeVisible();
  });

  test('shows the open session`s own wait first, as "This session is" with its words, and its icon', () => {
    page.render(SessionWaits);
    page.set({ session: sessionDetail({ waiting: QUESTION }) });
    expect(screen.getByRole('status')).toBeVisible();
    const line = notice().querySelector('.wait-line') as HTMLElement;
    expect(line.tagName).toBe('P');
    expect(line.querySelector('strong')?.textContent).toMatch(/^This session is waiting for your answer since /);
    expect(line.querySelector('.wait-icon .live-icon-waiting')).toHaveAttribute('role', 'img');
    expect(line.querySelector('a')).toBeNull();
  });

  test('keeps a session`s line while its wait changes to another, so a reader does not hear it again', () => {
    page.render(SessionWaits);
    page.set({ session: sessionDetail({ waiting: QUESTION }) });
    const line = notice().querySelector('.wait-line');
    page.set({ session: sessionDetail({ waiting: PERMISSION }) });
    expect(notice().querySelector('.wait-line')).toBe(line);
    expect(line?.textContent).toMatch(/permission/);
  });

  test('shows another live session`s wait as a link to it, its words after', () => {
    page.render(SessionWaits);
    page.set({
      session: sessionDetail(),
      live: live({ sessions: [liveSession({ session_id: 'other', title: 'Checkout', waiting: PERMISSION })] }),
    });
    const line = notice().querySelector('.wait-line') as HTMLElement;
    const link = screen.getByRole('link', { name: 'Checkout' });
    expect(link).toHaveAttribute('href', '#session/other');
    expect(line.textContent).toMatch(/Checkout: Waiting for your permission to use Bash \(a Explore subagent\) since /);
    expect(line.querySelector('.live-icon-permission')).not.toBeNull();
  });

  test('names an untitled session in the list, leaves the open one out of it and lists the own wait first', () => {
    page.render(SessionWaits);
    page.set({
      session: sessionDetail({ waiting: QUESTION }),
      live: live({
        sessions: [
          liveSession({ session_id: 'other', title: null, waiting: PERMISSION }),
          liveSession({ session_id: 'abc123', waiting: PERMISSION }),
        ],
      }),
    });
    const lines = [...notice().querySelectorAll('.wait-line')];
    expect(lines).toHaveLength(2);
    expect(lines[0]?.querySelector('strong')).not.toBeNull();
    expect(lines[1]?.querySelector('a')).toHaveTextContent('Untitled session');
  });

  test('follows the live answer: a wait that goes leaves the notice hidden again', () => {
    page.render(SessionWaits);
    page.set({ session: sessionDetail(), live: live({ sessions: [liveSession({ waiting: QUESTION })] }) });
    expect(screen.getByRole('status')).toBeVisible();
    page.set({ live: live({ sessions: [liveSession()] }) });
    expect(notice()).not.toBeVisible();
    expect(notice().querySelector('.wait-line')).toBeNull();
  });

  test('keeps a line`s node while the others change', () => {
    page.render(SessionWaits);
    const own = sessionDetail({ waiting: QUESTION });
    page.set({ session: own });
    const line = notice().querySelector('.wait-line');
    page.set({ live: live({ sessions: [liveSession({ waiting: PERMISSION })] }) });
    expect(notice().querySelectorAll('.wait-line')).toHaveLength(2);
    expect(notice().querySelector('.wait-line')).toBe(line);
  });
});
