import {
  THEME_STORAGE_KEY,
  applyThemeClass,
  oppositeTheme,
  readCurrentThemeFromClass,
  safeLocalStorageSetItem,
  themeColorHex,
} from '../lib/theme';

function updateThemeColorMeta(theme: import('../lib/theme').BlogTheme): void {
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', themeColorHex(theme));
}

function wireThemeToggle(): void {
  const button = document.querySelector<HTMLButtonElement>(
    '[data-testid="theme-toggle"]'
  );
  if (!button) return;
  const toggleButton = button;

  const lang = document.documentElement.lang.toLowerCase().startsWith('pt')
    ? 'pt-br'
    : 'en';

  function syncSwitchState(): void {
    const current = readCurrentThemeFromClass(document.documentElement);
    const isLight = current === 'light';

    // Update aria-checked for switch semantics
    toggleButton.setAttribute('aria-checked', isLight ? 'true' : 'false');

    // Update data-theme-state for potential CSS targeting
    toggleButton.setAttribute('data-theme-state', current);

    // Update aria-label based on what the next click will do
    const next = oppositeTheme(current);
    toggleButton.setAttribute(
      'aria-label',
      next === 'light'
        ? lang === 'pt-br'
          ? 'Ativar tema claro'
          : 'Switch to light theme'
        : lang === 'pt-br'
          ? 'Ativar tema escuro'
          : 'Switch to dark theme'
    );
  }

  toggleButton.addEventListener('click', () => {
    const html = document.documentElement;
    const next = oppositeTheme(readCurrentThemeFromClass(html));
    applyThemeClass(html, next);
    safeLocalStorageSetItem(window.localStorage, THEME_STORAGE_KEY, next);
    updateThemeColorMeta(next);
    syncSwitchState();
  });

  syncSwitchState();
}

function run(): void {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', wireThemeToggle, {
      once: true,
    });
  } else {
    wireThemeToggle();
  }
}

run();
