import { addons } from 'storybook/manager-api';
import { create } from 'storybook/theming/create';

const isEmbed = typeof window !== 'undefined' && window.parent !== window;

if (isEmbed) {
  document.documentElement.classList.add('sb-embed');
}

function cssVar(name: string, fallback: string): string {
  if (typeof document === 'undefined') return fallback;
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;
}

function lofiManagerTheme(mode: 'light' | 'dark') {
  const dark = mode === 'dark';
  const ink = cssVar('--lofi-ink', dark ? '#eee' : '#111');
  const paper = cssVar('--lofi-paper', dark ? '#111' : '#fff');
  const muted = cssVar('--lofi-ink-subtle', '#888');
  const hover = cssVar('--lofi-surface-hover', dark ? '#0f0f0f' : '#f0f0f0');
  const faint = cssVar('--lofi-border-faint', dark ? '#111' : '#eee');
  return create({
    base: dark ? 'dark' : 'light',
    fontBase: '"JetBrains Mono", "Courier New", Courier, monospace',
    fontCode: '"JetBrains Mono", "Courier New", Courier, monospace',
    colorPrimary: ink,
    colorSecondary: ink,
    appBg: paper,
    appContentBg: paper,
    appPreviewBg: paper,
    appBorderColor: ink,
    appBorderRadius: 0,
    textColor: ink,
    textInverseColor: paper,
    textMutedColor: muted,
    barTextColor: ink,
    barHoverColor: ink,
    barSelectedColor: ink,
    barBg: paper,
    buttonBg: paper,
    buttonBorder: ink,
    booleanBg: paper,
    booleanSelectedBg: dark ? hover : faint,
    inputBg: paper,
    inputBorder: ink,
    inputTextColor: ink,
    inputBorderRadius: 0,
    brandTitle: 'SketchFlowAI Patterns',
  });
}

function themeFromSearch(search: string): 'light' | 'dark' | null {
  const query = new URLSearchParams(search).get('theme');
  return query === 'dark' || query === 'light' ? query : null;
}

function themeFromPage(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  const fromOwn = themeFromSearch(window.location.search);
  if (fromOwn) return fromOwn;
  if (window.parent !== window) {
    try {
      const fromParent = themeFromSearch(window.parent.location.search);
      if (fromParent) return fromParent;
    } catch {
      /* cross-origin parent */
    }
  }
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
}

function applyManagerTheme(mode: 'light' | 'dark') {
  document.documentElement.dataset.theme = mode;
  document.documentElement.classList.toggle('dark', mode === 'dark');
  document.documentElement.style.colorScheme = mode;
  addons.setConfig({
    theme: lofiManagerTheme(mode),
    ...(isEmbed ? { navSize: 0 } : {}),
  });
}

applyManagerTheme(themeFromPage());

if (typeof window !== 'undefined') {
  window.addEventListener('message', (event) => {
    if (event.origin !== window.location.origin) return;
    const data = event.data as {
      type?: string;
      version?: number;
      theme?: string;
      locale?: string;
    } | null;
    if (!data || data.version !== 1 || data.type !== 'showcase:set-appearance') return;
    if (data.theme === 'dark' || data.theme === 'light') applyManagerTheme(data.theme);
    if (data.locale === 'en' || data.locale === 'de' || data.locale === 'sl') {
      document.documentElement.lang = data.locale;
    }
    const preview = document.getElementById('storybook-preview-iframe') as HTMLIFrameElement | null;
    preview?.contentWindow?.postMessage(data, window.location.origin);
  });
}
