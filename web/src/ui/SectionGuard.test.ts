import { screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, test, vi, type MockInstance } from 'vitest';
import { pagePerTest } from '../app/app.testing';
import GuardFixture from './GuardFixture.test.svelte';

const page = pagePerTest();

const TILES_FAILED = "“Tiles” couldn't be drawn: no Tiles";

let logged: MockInstance<typeof console.error>;

beforeEach(() => {
  logged = vi.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  logged.mockRestore();
});

const banner = () => page.app.messages.text;
const tryAgain = () => screen.getByRole('button', { name: 'Try again' });

describe('a guarded section', () => {
  test('is drawn as it is while nothing fails', () => {
    page.render(GuardFixture, { failing: [] });
    expect(screen.getByText('Tiles drawn')).toBeInTheDocument();
    expect(screen.getByText('Chart drawn')).toBeInTheDocument();
    expect(screen.queryByRole('button')).toBeNull();
    expect(banner()).toBe('');
    expect(logged).not.toHaveBeenCalled();
  });

  test('that fails as it is first drawn says so in its place, by name and reason, and in the banner', () => {
    page.render(GuardFixture, { failing: ['Tiles'] });
    expect(screen.queryByText('Tiles drawn')).toBeNull();
    expect(screen.getByText(TILES_FAILED).closest('.draw-failed')).toHaveClass('card');
    expect(banner()).toBe(TILES_FAILED);
  });

  test('that fails as new data comes is caught too', async () => {
    const view = page.render(GuardFixture, { failing: [] });
    await view.rerender({ failing: ['Tiles'] });
    expect(screen.queryByText('Tiles drawn')).toBeNull();
    expect(screen.getByText(TILES_FAILED)).toBeInTheDocument();
    expect(banner()).toBe(TILES_FAILED);
  });

  test('leaves the sections beside it drawn', () => {
    page.render(GuardFixture, { failing: ['Tiles'] });
    expect(screen.getByText('Chart drawn')).toBeInTheDocument();
  });

  test('logs the error itself, with its stack, for whoever opens the console', () => {
    page.render(GuardFixture, { failing: ['Tiles'] });
    expect(logged).toHaveBeenCalledWith(expect.objectContaining({ message: 'no Tiles', stack: expect.any(String) }));
  });

  test('offers to try again, the button described by what failed', () => {
    page.render(GuardFixture, { failing: ['Tiles', 'Chart'] });
    const buttons = screen.getAllByRole('button', { name: 'Try again' });
    expect(buttons.map((button) => button.getAttribute('type'))).toEqual(['button', 'button']);
    expect(screen.getByRole('button', { name: 'Try again', description: TILES_FAILED })).toBeInTheDocument();
  });

  test('stays failed when the data is fine again, until asked to try again: then it is drawn and its line goes', async () => {
    const view = page.render(GuardFixture, { failing: ['Tiles'] });
    await view.rerender({ failing: [] });
    expect(screen.getByText(TILES_FAILED)).toBeInTheDocument();
    await userEvent.click(tryAgain());
    expect(screen.getByText('Tiles drawn')).toBeInTheDocument();
    expect(screen.queryByText(TILES_FAILED)).toBeNull();
    expect(banner()).toBe('');
  });

  test('that fails again on trying keeps its failure and its banner line', async () => {
    page.render(GuardFixture, { failing: ['Tiles'] });
    await userEvent.click(tryAgain());
    expect(screen.getByText(TILES_FAILED)).toBeInTheDocument();
    expect(banner()).toBe(TILES_FAILED);
    expect(logged).toHaveBeenCalledTimes(2);
  });

  test('taken away while failed takes its banner line with it', () => {
    const view = page.render(GuardFixture, { failing: ['Tiles'] });
    view.unmount();
    expect(banner()).toBe('');
  });
});
