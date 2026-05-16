// @vitest-environment happy-dom

import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  THEME_STORAGE_KEY,
  bootstrapThemeFromWindow,
} from '../../src/lib/theme';

afterEach(() => {
  localStorage.clear();
  document.documentElement.removeAttribute('class');
});

describe('theme toggle wiring (integration)', () => {
  it('clicking the manual toggle flips the root class and persists preference', async () => {
    vi.resetModules();
    document.documentElement.lang = 'en';
    document.head.innerHTML = '<meta name="theme-color" content="#282c35">';
    document.body.innerHTML =
      '<button type="button" data-testid="theme-toggle">Theme</button>';

    await import('../../src/scripts/theme-toggle.ts');

    const button = document.querySelector<HTMLButtonElement>(
      '[data-testid="theme-toggle"]'
    );
    expect(button).toBeTruthy();

    expect(document.documentElement.classList.contains('light')).toBe(false);
    button!.click();
    expect(document.documentElement.classList.contains('light')).toBe(true);
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('light');

    button!.click();
    expect(document.documentElement.classList.contains('light')).toBe(false);
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark');
  });

  it('re-applies persisted theme on bootstrap (reload simulation)', () => {
    document.documentElement.lang = 'en';
    document.head.innerHTML = '';
    const meta = document.createElement('meta');
    meta.setAttribute('name', 'theme-color');
    meta.setAttribute('content', '#282c35');
    document.head.appendChild(meta);

    localStorage.setItem(THEME_STORAGE_KEY, 'light');
    document.documentElement.classList.remove('light');

    bootstrapThemeFromWindow(window);
    expect(document.documentElement.classList.contains('light')).toBe(true);
    expect(meta.getAttribute('content')).toBe('#ffffff');
  });
});
