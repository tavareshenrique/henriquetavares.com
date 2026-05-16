/**
 * Blog theme preference — shared by the pre-paint inline script (duplicated logic)
 * and bundled client scripts. Keep key + resolution rules in sync with
 * `BaseLayout.astro` inline bootstrap.
 */
export const THEME_STORAGE_KEY = 'henrique-blog-theme';

export const THEME_COLOR_LIGHT = '#ffffff';
export const THEME_COLOR_DARK = '#282c35';

export type BlogTheme = 'light' | 'dark';

export function parseStoredTheme(value: string | null): BlogTheme | null {
  if (value === 'light' || value === 'dark') return value;
  return null;
}

/**
 * @param stored - Raw `localStorage` value (or null when unavailable / unset)
 * @param systemPrefersLight - `matchMedia('(prefers-color-scheme: light)').matches`
 */
export function resolveTheme(
  stored: string | null,
  systemPrefersLight: boolean
): BlogTheme {
  const parsed = parseStoredTheme(stored);
  if (parsed) return parsed;
  return systemPrefersLight ? 'light' : 'dark';
}

export function applyThemeClass(html: HTMLElement, theme: BlogTheme): void {
  if (theme === 'light') {
    html.classList.add('light');
  } else {
    html.classList.remove('light');
  }
}

export function themeColorHex(theme: BlogTheme): string {
  return theme === 'light' ? THEME_COLOR_LIGHT : THEME_COLOR_DARK;
}

export function safeLocalStorageGetItem(
  storage: Storage | undefined,
  key: string
): string | null {
  if (!storage) return null;
  try {
    return storage.getItem(key);
  } catch {
    return null;
  }
}

export function safeLocalStorageSetItem(
  storage: Storage | undefined,
  key: string,
  value: string
): void {
  if (!storage) return;
  try {
    storage.setItem(key, value);
  } catch {
    /* ignore — private mode / blocked storage */
  }
}

export function readCurrentThemeFromClass(html: HTMLElement): BlogTheme {
  return html.classList.contains('light') ? 'light' : 'dark';
}

export function oppositeTheme(theme: BlogTheme): BlogTheme {
  return theme === 'light' ? 'dark' : 'light';
}

/**
 * Run before paint: read persisted + system preference, apply `light` class, sync meta.
 * Used only from tests / SSR fixtures; production uses the inline script in `BaseLayout`.
 */
export function bootstrapThemeFromWindow(win: Window): BlogTheme {
  const stored = safeLocalStorageGetItem(win.localStorage, THEME_STORAGE_KEY);
  let systemPrefersLight = false;
  try {
    systemPrefersLight = win.matchMedia(
      '(prefers-color-scheme: light)'
    ).matches;
  } catch {
    /* matchMedia unavailable */
  }
  const theme = resolveTheme(stored, systemPrefersLight);
  applyThemeClass(win.document.documentElement, theme);
  const meta = win.document.querySelector('meta[name="theme-color"]');
  if (meta) {
    meta.setAttribute('content', themeColorHex(theme));
  }
  return theme;
}
