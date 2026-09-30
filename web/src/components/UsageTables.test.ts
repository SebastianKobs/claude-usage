import { render, screen, within } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { flushSync } from 'svelte';
import { afterEach, beforeEach, describe, expect, test } from 'vitest';
import type { Summary } from '../lib/api';
import { modelSlots, slotColor } from '../lib/colors';
import { summary, usage } from '../lib/fixtures';
import { tablePages } from '../lib/paging.svelte';
import { payload, setPayload } from '../lib/payload.svelte';
import { preferences } from '../lib/prefs.svelte';
import UsageTables from './UsageTables.svelte';

const IDS = ['by-agent', 'by-model', 'by-project', 'by-skill', 'by-mcp-server'];

/** A summary with something in each of the five tables, the model with two effort levels. */
function full(changes: Partial<Summary> = {}): Summary {
  return summary({
    agent_type: [
      { agent_type: 'Explore', ...usage({ cost: 1 }) },
      { agent_type: 'main', ...usage({ cost: 4 }) },
    ],
    model: [
      { model: 'claude-haiku-4-5', ...usage({ cost: 1 }) },
      { model: 'claude-opus-5', ...usage({ cost: 4 }) },
    ],
    model_effort: [
      { model: 'claude-opus-5', effort: 'high', ...usage({ cost: 3 }) },
      { model: 'claude-opus-5', effort: 'low', ...usage({ cost: 1 }) },
    ],
    day_model: [
      { day: '2026-09-30', model: 'claude-opus-5', ...usage() },
      { day: '2026-09-30', model: 'claude-haiku-4-5', ...usage() },
    ],
    project: [
      { project: 'docs', ...usage({ cost: 1 }) },
      { project: 'shop', ...usage({ cost: 3 }) },
    ],
    skill: [{ skill: 'review', ...usage({ cost: 2 }) }],
    mcp_server: [{ mcp_server: 'github', ...usage({ cost: 2 }) }],
    ...changes,
  });
}

function section(name: string): HTMLElement {
  return screen.getByRole('region', { name });
}

function names(name: string): (string | null)[] {
  return within(screen.getByRole('table', { name }))
    .getAllByRole('row')
    .slice(1)
    .map((row) => row.firstElementChild?.textContent ?? null);
}

beforeEach(() => {
  localStorage.clear();
  preferences.pageSize = 25;
});

afterEach(() => {
  payload.reset();
  for (const id of IDS) tablePages.forget(id);
  preferences.theme = null;
  preferences.pageSize = 25;
  localStorage.clear();
});

describe('without a summary', () => {
  test('there are five cards, each its heading only', () => {
    const { container } = render(UsageTables);
    expect([...container.querySelectorAll('h2')].map((heading) => heading.textContent)).toEqual([
      'By agent type',
      'By model',
      'By project',
      'By skill',
      'By MCP server',
    ]);
    expect(container.querySelectorAll('section.card')).toHaveLength(5);
    expect(container.querySelector('table, .empty, .note, .pager')).toBeNull();
  });
});

describe('the layout', () => {
  test('is two columns of agent type and model, the project card, two columns of skill and MCP server', () => {
    const { container } = render(UsageTables);
    const [first, project, last] = [...container.children];
    expect(first).toHaveClass('grid-2', 'stack');
    expect([...(first?.children ?? [])].map((card) => card.querySelector('h2')?.id)).toEqual([
      'by-agent-title',
      'by-model-title',
    ]);
    expect(project?.tagName).toBe('SECTION');
    expect(project?.querySelector('h2')?.id).toBe('by-project-title');
    expect(last).toHaveClass('grid-2', 'stack');
    expect([...(last?.children ?? [])].map((card) => card.querySelector('h2')?.id)).toEqual([
      'by-skill-title',
      'by-mcp-server-title',
    ]);
    expect(container.children).toHaveLength(3);
  });
});

describe('the tables', () => {
  test('are five, each named by its heading', () => {
    render(UsageTables);
    setPayload({ summary: full() });
    for (const name of ['By agent type', 'By model', 'By project', 'By skill', 'By MCP server']) {
      expect(screen.getByRole('table', { name })).toBeInTheDocument();
    }
    expect(screen.getAllByRole('columnheader').every((head) => head.getAttribute('scope') === 'col')).toBe(true);
  });

  test('name their first column for what the rows are', () => {
    render(UsageTables);
    setPayload({ summary: full() });
    const first = (name: string) => within(screen.getByRole('table', { name })).getAllByRole('columnheader')[0];
    expect(first('By agent type')).toHaveTextContent('Agent type');
    expect(first('By model')).toHaveTextContent('Model');
    expect(first('By project')).toHaveTextContent('Project');
    expect(first('By skill')).toHaveTextContent('Skill');
    expect(first('By MCP server')).toHaveTextContent('MCP server');
  });

  test('list the dearest row first, with its usage cells', () => {
    render(UsageTables);
    setPayload({ summary: full() });
    expect(names('By agent type')).toEqual(['main', 'Explore']);
    expect(names('By project')).toEqual(['shop', 'docs']);
    expect(names('By skill')).toEqual(['review']);
    expect(names('By MCP server')).toEqual(['github']);
    const cells = within(within(screen.getByRole('table', { name: 'By skill' })).getAllByRole('row')[1] as HTMLElement)
      .getAllByRole('cell')
      .map((cell) => cell.textContent);
    expect(cells).toEqual(['review', '10', '1.2K', '75%', '50', '$2.00']);
  });

  test('list each model with its effort levels under it, a swatch on the model', () => {
    const { container } = render(UsageTables);
    setPayload({ summary: full() });
    expect(names('By model')).toEqual(['claude-opus-5', 'effort low', 'effort high', 'claude-haiku-4-5']);
    const table = screen.getByRole('table', { name: 'By model' });
    expect(within(table).getAllByRole('row').slice(1).map((row) => row.className)).toEqual([
      'group-row',
      'sub-row',
      'sub-row',
      'group-row',
    ]);
    expect(table.querySelectorAll('.swatch')).toHaveLength(2);
    expect(table.querySelectorAll('span.effort')).toHaveLength(2);
    expect(container.querySelectorAll('.swatch')).toHaveLength(2);
  });

  test('give the models the colors of the by-model chart: known ones their own slot', () => {
    render(UsageTables);
    setPayload({ summary: full() });
    const swatches = screen.getByRole('table', { name: 'By model' }).querySelectorAll('.swatch');
    // claude-opus-5 is the third known model, claude-haiku-4-5 the fourth
    expect([...swatches].map((swatch) => swatch.getAttribute('style'))).toEqual([
      expect.stringContaining('var(--series-3)'),
      expect.stringContaining('var(--series-4)'),
    ]);
  });
});

describe('the slots of the models', () => {
  test('are the chart\'s: counted over the models of the range\'s days, not only those the table lists', () => {
    render(UsageTables);
    const listed = [{ model: 'zz-model', ...usage({ cost: 1 }) }];
    const days = ['aa-model', 'zz-model'].map((model) => ({ day: '2026-09-30', model, ...usage() }));
    setPayload({ summary: full({ model: listed, model_effort: [], day_model: days }) });
    const slot = modelSlots(['aa-model', 'zz-model']).get('zz-model') ?? null;
    const swatch = screen.getByRole('table', { name: 'By model' }).querySelector('.swatch');
    expect(swatch?.getAttribute('style')).toContain(slotColor(slot));
    expect(slotColor(slot)).not.toBe(slotColor(modelSlots(['zz-model']).get('zz-model') ?? null));
  });
});

describe('the notes', () => {
  test('the skill and MCP server cards say what their turns are, the others have none', () => {
    const { container } = render(UsageTables);
    setPayload({ summary: full() });
    expect(section('By skill').querySelector('.note')).toHaveTextContent(
      /^turns Claude Code attributes to a skill while it runs$/,
    );
    expect(section('By MCP server').querySelector('.note')).toHaveTextContent(
      /^turns Claude Code attributes to an MCP server's tools$/,
    );
    expect(container.querySelectorAll('.note')).toHaveLength(2);
  });
});

describe('the empty texts', () => {
  test('say what is missing, in each card', () => {
    const { container } = render(UsageTables);
    setPayload({ summary: summary() });
    expect(screen.queryByRole('table')).toBeNull();
    expect(
      [...container.querySelectorAll('section')].map((card) => card.querySelector('.empty')?.textContent),
    ).toEqual([
      'No usage in this range.',
      'No usage in this range.',
      'No usage in this range.',
      'No turns attributed to a skill in this range.',
      'No turns attributed to an MCP server in this range.',
    ]);
    expect(container.querySelectorAll('h2')).toHaveLength(5);
  });

  test('are gone where rows come, in that card only', () => {
    const { container } = render(UsageTables);
    setPayload({ summary: summary() });
    setPayload({ summary: summary({ skill: [{ skill: 'review', ...usage() }] }) });
    expect(screen.getAllByRole('table')).toHaveLength(1);
    expect(section('By skill').querySelector('.empty')).toBeNull();
    expect(container.querySelectorAll('.empty')).toHaveLength(4);
  });
});

describe('the themes', () => {
  test('word the headings, which name their tables', () => {
    render(UsageTables);
    setPayload({ summary: full() });
    preferences.theme = 'hacker';
    flushSync();
    expect([...document.querySelectorAll('h2')].map((heading) => heading.textContent)).toEqual([
      'kubectl get agents',
      'model --benchmark',
      'ls ~/repos',
      'ls ~/.claude/skills',
      'netstat --mcp',
    ]);
    expect(screen.getByRole('table', { name: 'kubectl get agents' })).toBeInTheDocument();
    expect(screen.getByRole('table', { name: 'netstat --mcp' })).toBeInTheDocument();
  });

  test('change the headings in place', () => {
    render(UsageTables);
    setPayload({ summary: full() });
    const heading = screen.getByRole('heading', { name: 'By project' });
    preferences.theme = 'startup';
    flushSync();
    expect(screen.getByRole('heading', { name: 'Portfolio' })).toBe(heading);
  });

  test('word the headings of cards without a summary too', () => {
    preferences.theme = 'startup';
    render(UsageTables);
    expect(screen.getByRole('heading', { name: 'Team' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Integrations' })).toBeInTheDocument();
  });
});

describe('a new summary', () => {
  test('redraws the tables from it', () => {
    render(UsageTables);
    setPayload({ summary: full() });
    setPayload({ summary: full({ project: [{ project: 'api', ...usage() }] }) });
    expect(names('By project')).toEqual(['api']);
  });

  test('keeps the rows` nodes by key when the order changes', () => {
    render(UsageTables);
    setPayload({ summary: full() });
    const before = new Map(
      within(screen.getByRole('table', { name: 'By project' }))
        .getAllByRole('row')
        .slice(1)
        .map((row) => [row.firstElementChild?.textContent, row]),
    );
    setPayload({
      summary: full({
        project: [
          { project: 'docs', ...usage({ cost: 9 }) },
          { project: 'shop', ...usage({ cost: 3 }) },
        ],
      }),
    });
    expect(names('By project')).toEqual(['docs', 'shop']);
    const rows = within(screen.getByRole('table', { name: 'By project' })).getAllByRole('row').slice(1);
    for (const row of rows) expect(row).toBe(before.get(row.firstElementChild?.textContent));
  });

  test('keeps the cards themselves, only what is in them changes', () => {
    const { container } = render(UsageTables);
    setPayload({ summary: full() });
    const cards = [...container.querySelectorAll('section')];
    setPayload({ summary: full({ agent_type: [] }) });
    expect([...container.querySelectorAll('section')]).toEqual(cards);
    expect(cards[0]?.querySelector('.empty')).not.toBeNull();
  });
});

describe('the pagers', () => {
  function manyProjects(count: number): Summary {
    return full({
      project: Array.from({ length: count }, (_unused, index) => ({
        project: `project ${index}`,
        ...usage({ cost: count - index }),
      })),
    });
  }

  test('there is one in the title row of a table past ten rows, none in the others', () => {
    const { container } = render(UsageTables);
    setPayload({ summary: manyProjects(11) });
    expect(screen.getAllByRole('group', { name: 'Pages' })).toHaveLength(1);
    const titleRow = section('By project').querySelector('.title-row') as HTMLElement;
    expect(titleRow).toContainElement(screen.getByRole('group', { name: 'Pages' }));
    expect(titleRow.firstElementChild).toBe(screen.getByRole('heading', { name: 'By project' }));
    expect(container.querySelectorAll('.title-row')).toHaveLength(1);
  });

  test('there is none at ten rows', () => {
    render(UsageTables);
    setPayload({ summary: manyProjects(10) });
    expect(screen.queryByRole('group', { name: 'Pages' })).toBeNull();
  });

  test('turning the page shows the next rows of that table only', async () => {
    const user = userEvent.setup();
    render(UsageTables);
    setPayload({ summary: manyProjects(40) });
    await user.click(screen.getByRole('button', { name: 'Next ›' }));
    expect(names('By project')[0]).toBe('project 25');
    expect(names('By agent type')).toEqual(['main', 'Explore']);
  });
});
