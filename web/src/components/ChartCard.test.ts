import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { describe, expect, test } from 'vitest';
import ChartCardFixture from './ChartCardFixture.test.svelte';

describe('the frame', () => {
  test('the heading names the section, a card', () => {
    render(ChartCardFixture);
    const section = screen.getByRole('region', { name: 'Demo chart' });
    expect(section).toHaveClass('card');
    const heading = screen.getByRole('heading', { level: 2, name: 'Demo chart' });
    expect(heading.id).toBe('demo-title');
    expect(section).toHaveAttribute('aria-labelledby', 'demo-title');
  });

  test('the head holds the heading, the note, a spacer and the toggle, in that order', () => {
    const { container } = render(ChartCardFixture, { note: 'what it shows' });
    const head = container.querySelector('.chart-head');
    expect([...(head?.children ?? [])].map((child) => child.className || child.tagName)).toEqual([
      'H2',
      'muted',
      'spacer',
      'BUTTON',
    ]);
    expect(screen.getByText('what it shows')).toHaveClass('muted');
  });

  test('the chart comes after the head and the table is not drawn yet', () => {
    const { container } = render(ChartCardFixture);
    expect(container.querySelector('.chart-head')?.nextElementSibling).toBe(screen.getByTestId('chart'));
    expect(screen.queryByTestId('table')).toBeNull();
  });

  test('without the optional parts there is no note, controls, legend or extra', () => {
    const { container } = render(ChartCardFixture);
    expect(container.querySelector('.muted')).toBeNull();
    expect(screen.queryByRole('button', { name: 'Metric' })).toBeNull();
    expect(screen.queryByTestId('legend')).toBeNull();
    expect(screen.queryByTestId('extra')).toBeNull();
    expect([...(container.querySelector('.chart-head')?.children ?? [])]).toHaveLength(3);
  });
});

describe('the optional parts', () => {
  test('the controls sit in the head before the spacer', () => {
    const { container } = render(ChartCardFixture, { withControls: true });
    const controls = screen.getByRole('button', { name: 'Metric' });
    expect(controls.parentElement).toBe(container.querySelector('.chart-head'));
    expect(controls.nextElementSibling).toHaveClass('spacer');
  });

  test('the legend is above the chart and the extra below it', () => {
    render(ChartCardFixture, { withLegend: true, withExtra: true });
    expect(screen.getByTestId('legend').nextElementSibling).toBe(screen.getByTestId('chart'));
    expect(screen.getByTestId('chart').nextElementSibling).toBe(screen.getByTestId('extra'));
  });
});

describe('the table toggle', () => {
  test('it is a button named Table view, not pressed, its id made of the card`s', () => {
    render(ChartCardFixture);
    const toggle = screen.getByRole('button', { name: 'Table view' });
    expect(toggle.id).toBe('demo-table-toggle');
    expect(toggle).toHaveAttribute('type', 'button');
    expect(toggle).toHaveAttribute('aria-pressed', 'false');
  });

  test('pressing it shows the table after the chart, pressing again hides it', async () => {
    const user = userEvent.setup();
    render(ChartCardFixture, { withExtra: true });
    const toggle = screen.getByRole('button', { name: 'Table view' });
    await user.click(toggle);
    expect(toggle).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByTestId('chart').nextElementSibling).toBe(screen.getByTestId('table'));
    expect(screen.getByTestId('table').nextElementSibling).toBe(screen.getByTestId('extra'));
    await user.click(toggle);
    expect(toggle).toHaveAttribute('aria-pressed', 'false');
    expect(screen.queryByTestId('table')).toBeNull();
  });

  test('the chart stays while the table shows', async () => {
    const user = userEvent.setup();
    render(ChartCardFixture);
    const chart = screen.getByTestId('chart');
    await user.click(screen.getByRole('button', { name: 'Table view' }));
    expect(screen.getByTestId('chart')).toBe(chart);
  });
});
