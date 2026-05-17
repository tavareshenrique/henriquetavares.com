import { Window as HappyWindow } from 'happy-dom';
import { describe, expect, it, vi } from 'vitest';
import {
  THEME_STORAGE_KEY,
  bootstrapThemeFromWindow,
  resolveTheme,
  safeLocalStorageGetItem,
  safeLocalStorageSetItem,
} from '../../src/lib/theme';

describe('theme preference helpers', () => {
  it('falls back to light when nothing is saved and the system prefers light', () => {
    expect(resolveTheme(null, true)).toBe('light');
  });

  it('falls back to dark when nothing is saved and the system prefers dark', () => {
    expect(resolveTheme(null, false)).toBe('dark');
  });

  it('uses saved light preference even when the system would choose dark', () => {
    expect(resolveTheme('light', false)).toBe('light');
  });

  it('uses saved dark preference even when the system would choose light', () => {
    expect(resolveTheme('dark', true)).toBe('dark');
  });

  it('does not throw when localStorage reads throw during safe get', () => {
    const storage = {
      getItem() {
        throw new Error('blocked');
      },
    } as Storage;
    expect(safeLocalStorageGetItem(storage, THEME_STORAGE_KEY)).toBeNull();
  });

  it('does not throw when localStorage writes fail during safe set', () => {
    const storage = {
      setItem() {
        throw new Error('blocked');
      },
    } as Storage;
    expect(() =>
      safeLocalStorageSetItem(storage, THEME_STORAGE_KEY, 'light')
    ).not.toThrow();
  });

  it('bootstrap does not throw when localStorage reads throw', () => {
    const win = new HappyWindow({ url: 'https://henriquetavares.com/' });
    const meta = win.document.createElement('meta');
    meta.setAttribute('name', 'theme-color');
    meta.setAttribute('content', '#282c35');
    win.document.head.appendChild(meta);
    const spy = vi.spyOn(win.localStorage, 'getItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    expect(() =>
      bootstrapThemeFromWindow(win as unknown as Window)
    ).not.toThrow();
    spy.mockRestore();
  });
});
