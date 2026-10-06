// @vitest-environment jsdom
import { screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { tick } from 'svelte';
import { afterEach, beforeEach, describe, expect, test } from 'vitest';
import { pagePerTest } from './app.testing';
import ThemePicker from './ThemePicker.svelte';

const page = pagePerTest();

beforeEach(() => {
  localStorage.clear();
});

afterEach(() => {
  localStorage.clear();
});

const picker = () => screen.getByLabelText('Theme') as HTMLSelectElement;

describe('the options', () => {
  test('are auto, light and dark, then the themes just for fun', () => {
    page.render(ThemePicker);
    const options = [...picker().querySelectorAll('option')].map((option) => [option.value, option.textContent]);
    expect(options).toEqual([
      ['auto', 'auto'],
      ['light', 'light'],
      ['dark', 'dark'],
      ['hacker', 'terminal hacker 💻'],
      ['startup', 'startup flex ✨'],
      ['rgb', 'RGB battlestation 🌈'],
    ]);
    expect(picker().querySelector('optgroup')?.label).toBe('Just for fun');
    const fun = [...(picker().querySelector('optgroup')?.children ?? [])];
    expect(fun.map((option) => option.getAttribute('value'))).toEqual(['hacker', 'startup', 'rgb']);
  });

  test('keep their own words whatever the theme', () => {
    page.app.preferences.theme = 'hacker';
    page.render(ThemePicker);
    expect(picker().querySelector('option[value="hacker"]')?.textContent).toBe('terminal hacker 💻');
  });
});

describe('the choice', () => {
  test('shows auto where none is saved', () => {
    page.render(ThemePicker);
    expect(picker().value).toBe('auto');
  });

  test('shows the saved theme', () => {
    page.app.preferences.theme = 'rgb';
    page.render(ThemePicker);
    expect(picker().value).toBe('rgb');
  });

  test('picking a theme sets and saves it', async () => {
    page.render(ThemePicker);
    await userEvent.setup().selectOptions(picker(), 'dark');
    expect(page.app.preferences.theme).toBe('dark');
    expect(localStorage.getItem('claude-usage.theme')).toBe('dark');
  });

  test('picking auto goes back to the system theme', async () => {
    page.app.preferences.theme = 'hacker';
    page.render(ThemePicker);
    await userEvent.setup().selectOptions(picker(), 'auto');
    expect(page.app.preferences.theme).toBeNull();
    expect(localStorage.getItem('claude-usage.theme')).toBe('auto');
  });

  test('follows a theme chosen elsewhere', async () => {
    page.render(ThemePicker);
    page.app.preferences.theme = 'startup';
    await tick();
    expect(picker().value).toBe('startup');
  });
});
