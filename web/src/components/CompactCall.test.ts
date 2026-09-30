import { fireEvent, render, screen, waitFor } from '@testing-library/svelte';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import CompactCall from './CompactCall.svelte';

const CALL = {
  title: '⚠ Your context is past your 200K compact hint',
  lines: ['Every reply sends your whole conversation again.', 'Compacting would shrink it.'],
};

const original = Object.getOwnPropertyDescriptor(navigator, 'clipboard');

/** Replaces the page's clipboard, or takes it away with undefined. */
function clipboard(value: { writeText: (text: string) => Promise<void> } | undefined): void {
  Object.defineProperty(navigator, 'clipboard', { value, configurable: true });
}

beforeEach(() => {
  clipboard(undefined);
});

afterEach(() => {
  if (original) Object.defineProperty(navigator, 'clipboard', original);
  else Reflect.deleteProperty(navigator, 'clipboard');
});

describe('the card', () => {
  test('is a labelled region with the title and a paragraph for each line', () => {
    render(CompactCall, { call: CALL });
    const region = screen.getByRole('region', { name: CALL.title });
    expect(region).toHaveClass('card', 'compact-call');
    expect(region).toHaveAttribute('id', 'compact-call');
    expect(region.querySelector('strong')).toHaveAttribute('id', 'compact-call-title');
    expect([...region.querySelectorAll('p')].map((line) => line.textContent)).toEqual(CALL.lines);
  });

  test('has the copy button and an empty status after the lines', () => {
    render(CompactCall, { call: CALL });
    const button = screen.getByRole('button', { name: 'Copy /compact' });
    expect(button).toHaveAttribute('type', 'button');
    expect(button).toHaveAttribute('id', 'compact-copy');
    const actions = button.parentElement as HTMLElement;
    expect(actions).toHaveClass('compact-call-actions');
    const status = screen.getByRole('status');
    expect(status).toHaveClass('compact-call-status');
    expect(status).toBeEmptyDOMElement();
    expect(actions.lastElementChild).toBe(status);
  });

  test('keeps its nodes while the call is reworded', async () => {
    const { rerender } = render(CompactCall, { call: CALL });
    const first = screen.getByText(CALL.lines[0] as string);
    const button = screen.getByRole('button');
    await rerender({ call: { title: 'Another', lines: [CALL.lines[0] as string, 'Something new.'] } });
    expect(screen.getByText(CALL.lines[0] as string)).toBe(first);
    expect(screen.getByRole('button')).toBe(button);
    expect(screen.getByText('Something new.')).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Another' })).toBeInTheDocument();
  });
});

describe('copying', () => {
  test('writes /compact to the clipboard and says it was copied', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    clipboard({ writeText });
    render(CompactCall, { call: CALL });
    await fireEvent.click(screen.getByRole('button', { name: 'Copy /compact' }));
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('Copied: paste it into Claude Code.'));
    expect(writeText).toHaveBeenCalledExactlyOnceWith('/compact');
    expect(screen.queryByRole('textbox')).toBeNull();
  });

  test('shows the command selected in a field where there is no clipboard', async () => {
    render(CompactCall, { call: CALL });
    await fireEvent.click(screen.getByRole('button', { name: 'Copy /compact' }));
    const status = screen.getByRole('status');
    expect(status).toHaveTextContent('Copy it from here:');
    const field = screen.getByRole('textbox', { name: 'The command to copy' }) as HTMLInputElement;
    expect(field).toHaveValue('/compact');
    expect(field).toHaveAttribute('readonly');
    expect(field).toHaveClass('compact-call-field');
    expect(status).toContainElement(field);
    expect(field.selectionStart).toBe(0);
    expect(field.selectionEnd).toBe('/compact'.length);
  });

  test('shows the field too where the clipboard is refused', async () => {
    const writeText = vi.fn().mockRejectedValue(new DOMException('denied', 'NotAllowedError'));
    clipboard({ writeText });
    render(CompactCall, { call: CALL });
    await fireEvent.click(screen.getByRole('button', { name: 'Copy /compact' }));
    expect(await screen.findByRole('textbox', { name: 'The command to copy' })).toHaveValue('/compact');
    expect(screen.getByRole('status')).toHaveTextContent(/^Copy it from here:/);
    expect(writeText).toHaveBeenCalledOnce();
  });

  test('keeps the field where it was put across another copy', async () => {
    render(CompactCall, { call: CALL });
    await fireEvent.click(screen.getByRole('button', { name: 'Copy /compact' }));
    const field = screen.getByRole('textbox');
    await fireEvent.click(screen.getByRole('button', { name: 'Copy /compact' }));
    expect(screen.getByRole('textbox')).toBe(field);
  });
});
