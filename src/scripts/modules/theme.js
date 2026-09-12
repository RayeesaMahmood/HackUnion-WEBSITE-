const STORAGE_KEY = 'hackunion-theme';

const readStoredTheme = () => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed === 'dark' || parsed === 'light' ? parsed : null;
  } catch (_error) {
    return null;
  }
};

const writeStoredTheme = (theme) => {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(theme));
  } catch (_error) {
    // Ignore storage errors (private browsing, quota, etc.) and keep the UI functional.
  }
};

const getThemeLabels = (theme) => (theme === 'dark'
  ? { text: 'Light mode', label: 'Activate light theme', pressed: 'true' }
  : { text: 'Dark mode', label: 'Activate dark theme', pressed: 'false' });

const syncThemeControls = (theme) => {
  const labels = getThemeLabels(theme);

  document.querySelectorAll('[data-theme-toggle]').forEach((toggle) => {
    toggle.setAttribute('aria-label', labels.label);
    toggle.setAttribute('aria-pressed', labels.pressed);

    const textNode = toggle.querySelector('[data-theme-toggle-text]');
    if (textNode) {
      textNode.textContent = labels.text;
    }
  });
};

const applyTheme = (theme) => {
  document.documentElement.dataset.theme = theme;
  writeStoredTheme(theme);
  syncThemeControls(theme);
};

export const initTheme = () => {
  const stored = readStoredTheme();
  const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
  const initialTheme = stored ?? (prefersDark ? 'dark' : 'light');

  applyTheme(initialTheme);

  document.querySelectorAll('[data-theme-toggle]').forEach((toggle) => {
    toggle.addEventListener('click', () => {
      const current = document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
      applyTheme(current === 'dark' ? 'light' : 'dark');
    });
  });
};

export const setTheme = (theme) => {
  applyTheme(theme === 'dark' ? 'dark' : 'light');
};
