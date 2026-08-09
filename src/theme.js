// src/theme.js
//
// Theme list plus a tiny external store over localStorage.
//
// The store shape matters for prerendering: `getServerSnapshot` returns null,
// so the server-rendered markup and the first client render always agree, and
// the real theme is picked up right after hydration. First paint is still
// correct because index.html applies `data-theme` inline before any CSS runs —
// keep the ids there in sync with THEMES below.

export const THEMES = [
  { id: "tech", color: "#2563eb", label: "Tech" },
  { id: "nature", color: "#059669", label: "Nature" },
  { id: "editorial", color: "#be123c", label: "Editorial" },
];

export const THEME_IDS = THEMES.map((t) => t.id);

export const DEFAULT_THEME = "tech";

export const THEME_STORAGE_KEY = "portfolio-theme";

const listeners = new Set();

function notify() {
  listeners.forEach((listener) => listener());
}

/** Push the current stored theme onto <html data-theme>. */
function applyThemeAttribute(theme) {
  document.documentElement.dataset.theme = theme;
}

export function subscribeTheme(listener) {
  listeners.add(listener);

  // Another tab changed the theme: apply it here too, not just in React state,
  // or the swatch indicator and the CSS palette would disagree.
  const onStorage = (event) => {
    if (event.key !== null && event.key !== THEME_STORAGE_KEY) return;
    applyThemeAttribute(getThemeSnapshot());
    listener();
  };

  window.addEventListener("storage", onStorage);

  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

/** Client snapshot. Returns a primitive so React can compare it cheaply. */
export function getThemeSnapshot() {
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    return THEME_IDS.includes(stored) ? stored : DEFAULT_THEME;
  } catch {
    // Private browsing / blocked storage.
    return DEFAULT_THEME;
  }
}

/** No theme is known during SSG — render the neutral state on both sides. */
export function getServerThemeSnapshot() {
  return null;
}

export function setTheme(theme) {
  if (!THEME_IDS.includes(theme)) return;

  applyThemeAttribute(theme);
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Persisting is best-effort; the attribute above still applies the theme.
  }

  notify();
}
