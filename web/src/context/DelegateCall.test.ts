import { render, screen } from '@testing-library/svelte';
import { describe, expect, test } from 'vitest';
import DelegateCall from './DelegateCall.svelte';

const CALL = {
  title: 'Explore in a subagent',
  lines: ['Since the last compaction the main thread has read 25K tokens.', 'A subagent hands back its summary.'],
  note: 'A heuristic.',
};

describe('the card', () => {
  test('is a labelled region with the title, a paragraph for each line, then the muted note', () => {
    render(DelegateCall, { call: CALL });
    const region = screen.getByRole('region', { name: 'Explore in a subagent' });
    expect(region).toHaveClass('card', 'delegate-call');
    expect(region).toHaveAttribute('id', 'delegate-call');
    expect(region.querySelector('strong')).toHaveAttribute('id', 'delegate-call-title');
    const paragraphs = [...region.querySelectorAll('p')];
    expect(paragraphs.map((line) => line.textContent)).toEqual([...CALL.lines, CALL.note]);
    expect(paragraphs.map((line) => line.className)).toEqual(['', '', 'muted']);
  });

  test('has no button: there is nothing to copy', () => {
    render(DelegateCall, { call: CALL });
    expect(screen.queryByRole('button')).toBeNull();
  });
});
