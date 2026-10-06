// @vitest-environment jsdom
// happy-dom does not know the :checked option that Svelte's select binding reads, so the picker needs jsdom.
import { screen, within } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { flushSync } from 'svelte';
import { afterEach, beforeEach, describe, expect, test } from 'vitest';
import { pagePerTest } from '../app/app.testing';
import type { SessionListItem } from '../api/api';
import { sessionItem, summary } from '../api/fixtures';
import SessionsList from './SessionsList.svelte';

const page = pagePerTest();

const SHOP = sessionItem({ session_id: 'abc-1', title: 'Checkout: split payment step', project: 'shop' });
const DOCS = sessionItem({ session_id: 'doc-2', title: 'Write the Guide', project: 'docs', cost: 0.25 });
const UNTITLED = sessionItem({ session_id: 'shop/3', title: null, project: 'shop', cost: 0.5 });

function withSessions(sessions: SessionListItem[]) {
  return summary({ sessions });
}

/** The session names in the table's rows, in order. */
function names(): (string | null)[] {
  return within(screen.getByRole('table'))
    .getAllByRole('row')
    .slice(1)
    .map((row) => row.querySelector('a')?.textContent ?? null);
}

function many(count: number): SessionListItem[] {
  return Array.from({ length: count }, (_unused, index) =>
    sessionItem({ session_id: `s-${index}`, title: `Session ${index}`, project: 'shop' }),
  );
}

beforeEach(() => {
  localStorage.clear();
  page.app.preferences.pageSize = 25;
});

afterEach(() => {
  localStorage.clear();
});

describe('without a summary', () => {
  test('there are the heading and the filters only, with an empty count', () => {
    const { container } = page.render(SessionsList);
    expect(screen.getByRole('heading', { name: 'Sessions what each used in the range' })).toBeInTheDocument();
    expect(screen.getByRole('search', { name: 'Filter the sessions' })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: 'Project' })).toHaveValue('');
    expect(screen.getByRole('searchbox', { name: 'Filter by title, project or session id' })).toHaveValue('');
    expect(container.querySelector('#sessions-count')).toHaveTextContent(/^$/);
    expect(container.querySelector('table, .empty, .pager')).toBeNull();
  });

  test('the heading comes first, then the filters, then the table once there are sessions', () => {
    const { container } = page.render(SessionsList);
    page.set({ summary: withSessions([SHOP]) });
    const order = [
      screen.getByRole('heading', { name: 'Sessions what each used in the range' }),
      screen.getByRole('search', { name: 'Filter the sessions' }),
      screen.getByRole('table'),
    ];
    expect(container).toContainElement(order[2] as HTMLElement);
    order.slice(1).forEach((node, index) => {
      const before = order[index] as HTMLElement;
      expect(before.compareDocumentPosition(node) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    });
  });

  test('the project picker offers all projects only', () => {
    page.render(SessionsList);
    expect(within(screen.getByRole('combobox', { name: 'Project' })).getAllByRole('option')).toHaveLength(1);
  });
});

describe('the card', () => {
  test('is a region named by its heading, with the heading and its note', () => {
    const { container } = page.render(SessionsList);
    page.set({ summary: withSessions([SHOP]) });
    const card = screen.getByRole('region', { name: 'Sessions what each used in the range' });
    expect(card).toHaveClass('card');
    expect(container.querySelector('h2')).toHaveAttribute('id', 'sessions-title');
    expect(card.querySelector('h2 .muted')).toHaveTextContent('what each used in the range');
  });

  test('has a table named by the heading, every column heading with scope', () => {
    page.render(SessionsList);
    page.set({ summary: withSessions([SHOP]) });
    expect(screen.getByRole('table', { name: 'Sessions what each used in the range' })).toBeInTheDocument();
    const heads = screen.getAllByRole('columnheader');
    expect(heads.map((head) => head.textContent)).toEqual([
      'Last activity',
      'Session',
      'Subagents',
      'Turns',
      'Avg context',
      'Peak context',
      'Output',
      'Cost',
    ]);
    expect(heads.every((head) => head.getAttribute('scope') === 'col')).toBe(true);
    expect(heads.map((head) => head.classList.contains('num'))).toEqual([
      false,
      false,
      true,
      true,
      true,
      true,
      true,
      true,
    ]);
  });
});

describe('a row', () => {
  test('has the last activity, the session with its project, then what it used', () => {
    page.render(SessionsList);
    page.set({ summary: withSessions([SHOP]) });
    const row = within(screen.getByRole('table')).getAllByRole('row')[1] as HTMLElement;
    const cells = within(row).getAllByRole('cell');
    expect(cells).toHaveLength(8);
    expect(cells.map((cell) => cell.className)).toEqual(['num', '', 'num', 'num', 'num', 'num', 'num', 'num']);
    expect(cells[1]).toHaveTextContent('Checkout: split payment step');
    expect(cells[1]?.querySelector('.sub')).toHaveTextContent('shop');
    expect(cells.slice(2).map((cell) => cell.textContent)).toEqual(['2', '10', '40K', '90K', '50', '$1.50']);
  });

  test('links to the session view, its id encoded', () => {
    page.render(SessionsList);
    page.set({ summary: withSessions([SHOP, UNTITLED]) });
    const link = screen.getByRole('link', { name: 'Checkout: split payment step' });
    expect(link).toHaveAttribute('href', '#session/abc-1');
    expect(screen.getByRole('link', { name: 'Untitled session' })).toHaveAttribute('href', '#session/shop%2F3');
  });

  test('are in the order given, not sorted', () => {
    page.render(SessionsList);
    page.set({ summary: withSessions([DOCS, SHOP, UNTITLED]) });
    expect(names()).toEqual(['Write the Guide', 'Checkout: split payment step', 'Untitled session']);
  });

  test('is kept apart from another session of the same title, by its id', () => {
    page.render(SessionsList);
    const twin = sessionItem({ session_id: 'abc-9', title: SHOP.title, project: 'shop' });
    page.set({ summary: withSessions([SHOP, twin, UNTITLED, sessionItem({ session_id: 'x-4', title: null })]) });
    expect(names()).toEqual([SHOP.title, SHOP.title, 'Untitled session', 'Untitled session']);
  });
});

describe('the project picker', () => {
  function options(): string[] {
    return within(screen.getByRole('combobox', { name: 'Project' }))
      .getAllByRole('option')
      .map((option) => option.textContent ?? '');
  }

  test('offers all projects, then each project by name with its sessions', () => {
    page.render(SessionsList);
    page.set({ summary: withSessions([SHOP, DOCS, UNTITLED]) });
    expect(options()).toEqual(['All projects', 'docs (1)', 'shop (2)']);
    expect(screen.getByRole('option', { name: 'All projects' })).toHaveValue('');
  });

  test('narrows the rows to the project, the count says so and the options stay', async () => {
    const user = userEvent.setup();
    page.render(SessionsList);
    page.set({ summary: withSessions([SHOP, DOCS, UNTITLED]) });
    expect(document.getElementById('sessions-count')).toHaveTextContent(/^3 sessions$/);
    expect(document.getElementById('sessions-count')).toHaveAttribute('aria-live', 'polite');
    await user.selectOptions(screen.getByRole('combobox', { name: 'Project' }), 'docs');
    expect(names()).toEqual(['Write the Guide']);
    expect(document.getElementById('sessions-count')).toHaveTextContent(/^1 of 3 sessions$/);
    expect(options()).toEqual(['All projects', 'docs (1)', 'shop (2)']);
  });

  test('goes back to all with All projects', async () => {
    const user = userEvent.setup();
    page.render(SessionsList);
    page.set({ summary: withSessions([SHOP, DOCS]) });
    await user.selectOptions(screen.getByRole('combobox', { name: 'Project' }), 'docs');
    await user.selectOptions(screen.getByRole('combobox', { name: 'Project' }), '');
    expect(names()).toHaveLength(2);
    expect(document.getElementById('sessions-count')).toHaveTextContent(/^2 sessions$/);
  });

  test('keeps a picked project on offer, with none, in a range without it', async () => {
    const user = userEvent.setup();
    page.render(SessionsList);
    page.set({ summary: withSessions([SHOP, DOCS]) });
    await user.selectOptions(screen.getByRole('combobox', { name: 'Project' }), 'docs');
    page.set({ summary: withSessions([SHOP]) });
    expect(options()).toEqual(['All projects', 'docs (0)', 'shop (1)']);
    expect(screen.getByRole('combobox', { name: 'Project' })).toHaveValue('docs');
    expect(screen.getByText('No sessions match the filter.')).toBeInTheDocument();
  });
});

describe('the text filter', () => {
  test('keeps the sessions holding every word, in any case, in the title, project or id', async () => {
    const user = userEvent.setup();
    page.render(SessionsList);
    page.set({ summary: withSessions([SHOP, DOCS, UNTITLED]) });
    const box = screen.getByRole('searchbox', { name: 'Filter by title, project or session id' });
    await user.type(box, 'GUIDE write');
    expect(names()).toEqual(['Write the Guide']);
    await user.clear(box);
    await user.type(box, 'shop checkout');
    expect(names()).toEqual(['Checkout: split payment step']);
    await user.clear(box);
    await user.type(box, 'doc-2');
    expect(names()).toEqual(['Write the Guide']);
    expect(document.getElementById('sessions-count')).toHaveTextContent(/^1 of 3 sessions$/);
  });

  test('says no session matches where none does, the table gone', async () => {
    const user = userEvent.setup();
    page.render(SessionsList);
    page.set({ summary: withSessions([SHOP]) });
    await user.type(screen.getByRole('searchbox'), 'nothing like it');
    expect(screen.getByText('No sessions match the filter.')).toBeInTheDocument();
    expect(screen.queryByRole('table')).toBeNull();
    expect(document.getElementById('sessions-count')).toHaveTextContent(/^0 of 1 session$/);
  });

  test('has the filters still, where the heading and the filters are all there is', async () => {
    const user = userEvent.setup();
    page.render(SessionsList);
    page.set({ summary: withSessions([SHOP]) });
    await user.type(screen.getByRole('searchbox'), 'zzz');
    expect(screen.getByRole('searchbox')).toHaveValue('zzz');
    expect(screen.getByRole('combobox', { name: 'Project' })).toBeInTheDocument();
  });
});

describe('the empty text', () => {
  test('says there are no sessions in the range, without the table', () => {
    page.render(SessionsList);
    page.set({ summary: withSessions([]) });
    expect(screen.getByText('No sessions in this range.')).toHaveClass('empty');
    expect(screen.queryByRole('table')).toBeNull();
    expect(document.getElementById('sessions-count')).toHaveTextContent(/^0 sessions$/);
  });

  test('goes where sessions come', () => {
    page.render(SessionsList);
    page.set({ summary: withSessions([]) });
    page.set({ summary: withSessions([SHOP]) });
    expect(screen.queryByText('No sessions in this range.')).toBeNull();
    expect(names()).toEqual(['Checkout: split payment step']);
  });
});

describe('a new summary', () => {
  test('keeps the filter, the controls and the focus in the text filter while typing', async () => {
    const user = userEvent.setup();
    const { container } = page.render(SessionsList);
    page.set({ summary: withSessions([SHOP, DOCS]) });
    const box = screen.getByRole('searchbox');
    const picker = screen.getByRole('combobox', { name: 'Project' });
    await user.selectOptions(picker, 'shop');
    await user.type(box, 'check');
    expect(box).toHaveFocus();
    page.set({ summary: withSessions([SHOP, DOCS, UNTITLED]) });
    expect(screen.getByRole('searchbox')).toBe(box);
    expect(screen.getByRole('combobox', { name: 'Project' })).toBe(picker);
    expect(box).toHaveFocus();
    expect(box).toHaveValue('check');
    expect(picker).toHaveValue('shop');
    expect(names()).toEqual(['Checkout: split payment step']);
    expect(container.querySelector('#sessions-count')).toHaveTextContent(/^1 of 3 sessions$/);
  });

  test('keeps the rows` nodes by session id', () => {
    page.render(SessionsList);
    page.set({ summary: withSessions([SHOP, DOCS]) });
    const before = within(screen.getByRole('table')).getAllByRole('row').slice(1);
    page.set({ summary: withSessions([DOCS, SHOP]) });
    const after = within(screen.getByRole('table')).getAllByRole('row').slice(1);
    expect(after).toEqual([before[1], before[0]]);
  });

  test('keeps the card itself', () => {
    const { container } = page.render(SessionsList);
    page.set({ summary: withSessions([SHOP]) });
    const card = container.querySelector('section');
    page.set({ summary: withSessions([]) });
    expect(container.querySelector('section')).toBe(card);
  });
});

describe('the pager', () => {
  test('is in the title row with the heading past ten sessions, the filters after it', () => {
    const { container } = page.render(SessionsList);
    page.set({ summary: withSessions(many(11)) });
    const titleRow = container.querySelector('.title-row') as HTMLElement;
    expect(titleRow.firstElementChild).toBe(screen.getByRole('heading'));
    expect(titleRow).toContainElement(screen.getByRole('group', { name: 'Pages' }));
    expect(titleRow.nextElementSibling).toBe(container.querySelector('.table-filters'));
  });

  test('is gone at ten sessions', () => {
    const { container } = page.render(SessionsList);
    page.set({ summary: withSessions(many(10)) });
    expect(screen.queryByRole('group', { name: 'Pages' })).toBeNull();
    expect(container.querySelector('.title-row')).toBeNull();
  });

  test('says which sessions are shown', () => {
    page.render(SessionsList);
    page.set({ summary: withSessions(many(40)) });
    expect(screen.getByRole('group', { name: 'Pages' })).toHaveTextContent('rows 1–25 of 40');
    expect(names()).toHaveLength(25);
  });

  test('starts at the first page again when the text filter changes', async () => {
    const user = userEvent.setup();
    page.render(SessionsList);
    page.set({ summary: withSessions(many(60)) });
    await user.click(screen.getByRole('button', { name: 'Next ›' }));
    expect(names()[0]).toBe('Session 25');
    await user.type(screen.getByRole('searchbox'), 'session');
    expect(names()[0]).toBe('Session 0');
  });

  test('starts at the first page again when the project changes', async () => {
    const user = userEvent.setup();
    const sessions = [...many(30), ...Array.from({ length: 30 }, (_unused, index) =>
      sessionItem({ session_id: `d-${index}`, title: `Doc ${index}`, project: 'docs' }),
    )];
    page.render(SessionsList);
    page.set({ summary: withSessions(sessions) });
    await user.click(screen.getByRole('button', { name: 'Next ›' }));
    expect(names()[0]).toBe('Session 25');
    await user.selectOptions(screen.getByRole('combobox', { name: 'Project' }), 'docs');
    expect(names()[0]).toBe('Doc 0');
  });
});

describe('the themes', () => {
  test('word the heading, which names the table', () => {
    page.render(SessionsList);
    page.set({ summary: withSessions([SHOP]) });
    page.app.preferences.theme = 'hacker';
    flushSync();
    expect(screen.getByRole('heading', { name: 'history | tail what each used in the range' })).toBeInTheDocument();
    expect(screen.getByRole('table', { name: 'history | tail what each used in the range' })).toBeInTheDocument();
  });

  test('word the heading of a card without a summary too', () => {
    page.app.preferences.theme = 'startup';
    page.render(SessionsList);
    expect(screen.getByRole('heading', { name: 'Changelog what each used in the range' })).toBeInTheDocument();
  });
});
