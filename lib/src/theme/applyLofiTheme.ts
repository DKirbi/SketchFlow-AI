export type LofiTheme = 'light' | 'dark';

export function parseLofiTheme(value: string | null | undefined): LofiTheme {
  return value === 'dark' ? 'dark' : 'light';
}

function readSearch(win: Window): URLSearchParams {
  try {
    return new URLSearchParams(win.location.search);
  } catch {
    return new URLSearchParams();
  }
}

function themeFromSearch(search: URLSearchParams): LofiTheme | null {
  const value = search.get('theme');
  return value === 'dark' || value === 'light' ? value : null;
}

/** Query on this document, then same-origin parent (Storybook preview iframe). */
export function themeFromLocation(win: Window = window): LofiTheme {
  const fromOwn = themeFromSearch(readSearch(win));
  if (fromOwn) return fromOwn;
  if (win.parent !== win) {
    const fromParent = themeFromSearch(readSearch(win.parent));
    if (fromParent) return fromParent;
  }
  return 'light';
}

/** Apply light/dark to a document root. Standalone default is light. */
export function applyLofiTheme(
  theme: LofiTheme,
  root: HTMLElement = document.documentElement,
): void {
  root.dataset.theme = theme;
  root.classList.toggle('dark', theme === 'dark');
  root.style.colorScheme = theme;
}

export function readLofiCssVar(
  name: string,
  root: HTMLElement = document.documentElement,
): string {
  return getComputedStyle(root).getPropertyValue(name).trim();
}

const APPEARANCE_MESSAGE_TYPE = 'showcase:set-appearance';

/** Nested same-origin embeds: query on first paint, postMessage for live theme. */
export function bootEmbeddedLofiTheme(): void {
  if (typeof window === 'undefined') return;
  applyLofiTheme(themeFromLocation());
  window.addEventListener('message', (event) => {
    if (event.origin !== window.location.origin) return;
    const data = event.data as { type?: string; version?: number; theme?: string } | null;
    if (!data || data.version !== 1 || data.type !== APPEARANCE_MESSAGE_TYPE) return;
    if (data.theme === 'dark' || data.theme === 'light') applyLofiTheme(data.theme);
  });
}
