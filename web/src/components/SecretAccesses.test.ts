import { render, screen, within } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, test } from 'vitest';
import type { SecretAccess, SessionDetail } from '../lib/api';
import { when } from '../lib/format';
import { secretAccess, sessionDetail } from '../lib/fixtures';
import { tablePages } from '../lib/paging.svelte';
import { payload, setPayload } from '../lib/payload.svelte';
import { preferences } from '../lib/prefs.svelte';
import SecretAccesses from './SecretAccesses.svelte';

/** A session with the accesses given. */
function session(accesses: SecretAccess[], changes: Partial<SessionDetail> = {}): SessionDetail {
  return sessionDetail({ secret_accesses: accesses, ...changes });
}

/** Distinct calls, so each has a row of its own. */
function calls(count: number): SecretAccess[] {
  return Array.from({ length: count }, (_unused, index) => secretAccess({ path: `place-${index}` }));
}

const SENT = secretAccess({ severity: 'high', reach: 'sent', sent: true, tool: 'mcp', path: 'place-sent' });
const RETURNED = secretAccess({ severity: 'medium' });
const BLOCKED = secretAccess({ severity: 'low', reach: 'error', error: true });
const TEST = secretAccess({ severity: 'low-medium', test: true });

/** The card: a region named by its heading. */
const card = () => screen.getByRole('region');
const toggle = () => screen.getByRole('button', { name: /^(Show|Hide) them$/ });
/** The body of a folded card: the div that follows its heading line. */
const body = () => card().querySelector('.secret-folded-line + div') as HTMLElement;
/** The cells of a row of the table, the heading row being 0; hidden too, since a folded card hides its rows. */
const cells = (index: number) =>
  within(screen.getAllByRole('row', { hidden: true })[index] as HTMLElement).getAllByRole('cell', { hidden: true });

beforeEach(() => {
  localStorage.clear();
  preferences.pageSize = 25;
});

afterEach(() => {
  payload.reset();
  tablePages.forget('abc123-secrets');
  tablePages.forget('other-secrets');
  preferences.pageSize = 25;
  localStorage.clear();
});

describe('without anything to show', () => {
  test('writes nothing without a session', () => {
    const { container } = render(SecretAccesses);
    expect(container.children).toHaveLength(0);
  });

  test('writes nothing for a session without accesses', () => {
    render(SecretAccesses);
    setPayload({ session: session([]) });
    expect(screen.queryByRole('region')).toBeNull();
  });
});

describe('an alert', () => {
  test('is open, with its heading, its icon and a region named by it', () => {
    render(SecretAccesses);
    setPayload({ session: session([SENT, RETURNED]) });
    const region = screen.getByRole('region', { name: 'Possible secret access: 2 calls (1 sent out)' });
    expect(region).toHaveAttribute('id', 'secret-alert');
    expect(region).toHaveClass('card', 'secret-alert');
    const heading = within(region).getByRole('heading', { level: 3 });
    expect(heading).toHaveClass('secret-alert-head');
    expect(heading).toHaveAttribute('id', 'secret-alert-title');
    const icon = heading.querySelector('.secret-alert-icon');
    expect(icon).toHaveTextContent('!');
    expect(icon).toHaveAttribute('aria-hidden', 'true');
  });

  test('has no toggle and shows its rows', () => {
    render(SecretAccesses);
    setPayload({ session: session([SENT, RETURNED]) });
    expect(screen.queryByRole('button', { name: /them$/ })).toBeNull();
    expect(screen.getByRole('table')).toBeVisible();
    expect(screen.getAllByRole('row')).toHaveLength(1 + 2);
  });
});

describe('a folded card', () => {
  test('is a warning while a call returned a result: folded, with its summary', () => {
    render(SecretAccesses);
    setPayload({ session: session([RETURNED, BLOCKED]) });
    expect(card()).toHaveClass('card', 'secret-folded', 'secret-warning');
    expect(card()).not.toHaveClass('secret-alert');
    expect(card()).toHaveAttribute('id', 'secret-alert');
    expect(card()).toHaveAttribute('aria-labelledby', 'secret-alert-title');
    const heading = screen.getByRole('heading', { level: 3 });
    expect(heading).toHaveClass('secret-folded-head');
    expect(heading).toHaveAttribute('id', 'secret-alert-title');
    expect(heading).toHaveTextContent(
      '2 calls named a possible secret location, 1 of them returned a result or may still',
    );
    expect(heading.parentElement).toHaveClass('secret-folded-line');
    expect(toggle()).toHaveTextContent('Show them');
    expect(toggle()).toHaveAttribute('aria-expanded', 'false');
    expect(body()).toHaveAttribute('hidden');
  });

  test('is quiet, without the warning class, where nothing returned a result', () => {
    render(SecretAccesses);
    setPayload({ session: session([BLOCKED]) });
    expect(card()).toHaveClass('card', 'secret-folded');
    expect(card()).not.toHaveClass('secret-warning');
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(
      '1 call named a possible secret location, none reached anything',
    );
  });

  test('says how many returned only in a likely test', () => {
    render(SecretAccesses);
    setPayload({ session: session([TEST, BLOCKED]) });
    expect(card()).not.toHaveClass('secret-warning');
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(
      '2 calls named a possible secret location, 1 returned a result only in a likely test',
    );
  });

  test('Show them opens the body and Hide them folds it again', async () => {
    const user = userEvent.setup();
    render(SecretAccesses);
    setPayload({ session: session([RETURNED]) });
    await user.click(toggle());
    expect(body()).not.toHaveAttribute('hidden');
    expect(toggle()).toHaveTextContent('Hide them');
    expect(toggle()).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('table')).toBeVisible();
    await user.click(toggle());
    expect(body()).toHaveAttribute('hidden');
    expect(toggle()).toHaveTextContent('Show them');
    expect(toggle()).toHaveAttribute('aria-expanded', 'false');
  });
});

describe('a refresh', () => {
  test('keeps the fold and the same nodes for the same session', async () => {
    const user = userEvent.setup();
    render(SecretAccesses);
    setPayload({ session: session([RETURNED]) });
    await user.click(toggle());
    const before = [card(), toggle(), screen.getByRole('table'), screen.getAllByRole('row')[1]];
    setPayload({ session: session([RETURNED]) });
    expect(card()).toBe(before[0]);
    expect(toggle()).toBe(before[1]);
    expect(screen.getByRole('table')).toBe(before[2]);
    expect(screen.getAllByRole('row')[1]).toBe(before[3]);
    expect(toggle()).toHaveAttribute('aria-expanded', 'true');
    expect(body()).not.toHaveAttribute('hidden');
  });

  test('swaps the card where an alert turns into a folded one', () => {
    render(SecretAccesses);
    setPayload({ session: session([SENT, RETURNED]) });
    const alert = card();
    setPayload({ session: session([RETURNED]) });
    expect(card()).not.toBe(alert);
    expect(card()).toHaveClass('secret-folded');
    expect(screen.queryByRole('heading', { name: /Possible secret access/ })).toBeNull();
    expect(toggle()).toHaveTextContent('Show them');
  });

  test('swaps the card the other way where a call is sent out', () => {
    render(SecretAccesses);
    setPayload({ session: session([RETURNED]) });
    setPayload({ session: session([SENT, RETURNED]) });
    expect(card()).toHaveClass('secret-alert');
    expect(screen.queryByRole('button', { name: /them$/ })).toBeNull();
  });

  test('takes the card away where the accesses go', () => {
    render(SecretAccesses);
    setPayload({ session: session([RETURNED]) });
    setPayload({ session: session([]) });
    expect(screen.queryByRole('region')).toBeNull();
  });
});

describe('the rows', () => {
  test('show time, agent, tool, path, pattern and how far the call got', () => {
    render(SecretAccesses);
    setPayload({
      session: session([
        secretAccess({
          time: '2026-09-30T08:30:00.000Z',
          agent_type: 'Explore',
          tool: 'Read',
          path: 'place-one',
          pattern: 'pattern-one',
          severity: 'high',
          reach: 'sent',
          sent: true,
        }),
      ]),
    });
    expect(screen.getAllByRole('columnheader').map((heading) => heading.textContent)).toEqual([
      'Time',
      'Agent',
      'Tool',
      'Path',
      'Matched',
      'Reached',
    ]);
    const row = cells(1);
    expect(row.map((cell) => cell.textContent)).toEqual([
      when('2026-09-30T08:30:00.000Z'),
      'Explore',
      'Read',
      'place-one',
      'pattern-one',
      'sent to a service',
    ]);
    expect(row[3]?.querySelector('.secret-path')).toHaveTextContent('place-one');
    expect(row[3]?.querySelector('.secret-via')).toBeNull();
  });

  test('show the script a path came from after it', () => {
    render(SecretAccesses);
    setPayload({ session: session([secretAccess({ path: 'place-one', via: 'deploy.sh' })]) });
    const path = cells(1)[3] as HTMLElement;
    expect(path.querySelector('.secret-via')).toHaveTextContent('in deploy.sh, which it ran');
    expect(path.textContent).toBe('place-onein deploy.sh, which it ran');
  });

  test.each([
    ['high', 'secret-severity-high'],
    ['medium', 'secret-severity-medium'],
    ['low-medium', 'secret-severity-low-medium'],
    ['low', 'secret-severity-low'],
  ] as const)('mark a %s call with %s, hidden from assistive technology', (severity, markClass) => {
    render(SecretAccesses);
    setPayload({ session: session([secretAccess({ severity })]) });
    const mark = cells(1)[5]?.querySelector('.secret-severity');
    expect(mark).toHaveClass('secret-severity', markClass);
    expect(mark).toHaveAttribute('aria-hidden', 'true');
  });

  test('mark a call without a severity as medium', () => {
    render(SecretAccesses);
    setPayload({ session: session([RETURNED, secretAccess({ path: 'place-two', severity: '' as never })]) });
    expect(cells(2)[5]?.querySelector('.secret-severity')).toHaveClass('secret-severity-medium');
  });

  test('read the reach as plain words in the last cell', () => {
    render(SecretAccesses);
    setPayload({ session: session([SENT, RETURNED, BLOCKED, TEST]) });
    expect([1, 2, 3, 4].map((index) => cells(index)[5]?.textContent)).toEqual([
      'sent to a service',
      'into the conversation',
      'error: blocked or failed',
      'into the conversation, likely a test',
    ]);
  });

  test('keep a row for each call, so two calls at one moment both show', () => {
    render(SecretAccesses);
    setPayload({ session: session([SENT, SENT]) });
    expect(screen.getAllByRole('row')).toHaveLength(1 + 2);
  });
});

describe('the table', () => {
  test('is named by the card`s heading', () => {
    render(SecretAccesses);
    setPayload({ session: session([SENT]) });
    expect(screen.getByRole('table', { name: 'Possible secret access: 1 call (1 sent out)' })).toBeVisible();
  });

  test('sits between the two notes', () => {
    render(SecretAccesses);
    setPayload({ session: session([SENT]) });
    const notes = card().querySelectorAll('p');
    expect(notes).toHaveLength(2);
    expect(notes[0]).toHaveTextContent(/^These tool calls named a path that matches a possible secret location\./);
    expect(notes[0]).toHaveTextContent(/Check that each was meant\.$/);
    expect(notes[1]).toHaveClass('muted');
    expect(notes[1]).toHaveTextContent(/^Matched against \[secrets\] patterns in the config:/);
    expect(notes[1]).toHaveTextContent(/returns output too\.$/);
    expect(notes[0]?.nextElementSibling).toHaveClass('table-wrap');
    expect(card().querySelector('.table-wrap')?.nextElementSibling).toBe(notes[1]);
  });

  test('has no pager up to 10 rows', () => {
    render(SecretAccesses);
    setPayload({ session: session(calls(10)) });
    expect(screen.queryByRole('combobox', { name: 'Rows per page' })).toBeNull();
  });

  test('pages past 10 rows under the session`s key, and keeps its page across a refresh', async () => {
    const user = userEvent.setup();
    preferences.pageSize = 10;
    render(SecretAccesses);
    setPayload({ session: session([...calls(12), SENT]) });
    expect(screen.getByRole('combobox', { name: 'Rows per page' }).id).toBe('pager-abc123-secrets-size');
    expect(screen.getAllByRole('row')).toHaveLength(1 + 10);
    await user.click(screen.getByRole('button', { name: 'Next ›' }));
    expect(tablePages.first('abc123-secrets')).toBe(10);
    expect(screen.getAllByRole('row')).toHaveLength(1 + 3);
    setPayload({ session: session([...calls(12), SENT]) });
    expect(screen.getAllByRole('row')).toHaveLength(1 + 3);
  });

  test('starts another session at its first page', async () => {
    const user = userEvent.setup();
    preferences.pageSize = 10;
    render(SecretAccesses);
    setPayload({ session: session([...calls(12), SENT]) });
    await user.click(screen.getByRole('button', { name: 'Next ›' }));
    setPayload({ session: session([...calls(12), SENT], { session_id: 'other' }) });
    expect(screen.getByRole('combobox', { name: 'Rows per page' }).id).toBe('pager-other-secrets-size');
    expect(screen.getAllByRole('row')).toHaveLength(1 + 10);
  });
});
