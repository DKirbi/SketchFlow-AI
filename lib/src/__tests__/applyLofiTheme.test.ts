import { afterEach, describe, expect, it } from 'vitest';
import { applyLofiTheme, themeFromLocation } from '../theme/applyLofiTheme';
import '../styles/index.scss';

function styleRules(): CSSStyleRule[] {
  return [...document.styleSheets]
    .flatMap((sheet) => {
      try {
        return [...sheet.cssRules];
      } catch {
        return [];
      }
    })
    .filter((rule): rule is CSSStyleRule => rule instanceof CSSStyleRule);
}

describe('applyLofiTheme', () => {
  afterEach(() => {
    applyLofiTheme('light');
    document.documentElement.removeAttribute('data-theme');
    document.documentElement.classList.remove('dark');
    document.documentElement.style.removeProperty('color-scheme');
  });

  it('sets data-theme, .dark, and color-scheme for dark', () => {
    applyLofiTheme('dark');
    const root = document.documentElement;
    expect(root.getAttribute('data-theme')).toBe('dark');
    expect(root.classList.contains('dark')).toBe(true);
    expect(root.style.colorScheme).toBe('dark');
  });

  it('sets data-theme light and removes .dark', () => {
    applyLofiTheme('dark');
    applyLofiTheme('light');
    const root = document.documentElement;
    expect(root.getAttribute('data-theme')).toBe('light');
    expect(root.classList.contains('dark')).toBe(false);
    expect(root.style.colorScheme).toBe('light');
  });

  it('reads theme from the current location search', () => {
    const url = new URL(window.location.href);
    url.searchParams.set('theme', 'dark');
    window.history.replaceState({}, '', url);
    expect(themeFromLocation()).toBe('dark');
    url.searchParams.delete('theme');
    window.history.replaceState({}, '', url);
  });
});

describe('LOFI color tokens', () => {
  it('exposes light grayscale on :root as --lofi-* variables', () => {
    const root = styleRules().find((rule) => rule.selectorText === ':root');
    expect(root).toBeDefined();
    expect(root!.style.getPropertyValue('--lofi-ink').trim()).toBe('#111');
    expect(root!.style.getPropertyValue('--lofi-paper').trim()).toBe('#fff');
    expect(root!.style.getPropertyValue('--lofi-ink-muted').trim()).toBe('#666');
    expect(root!.style.getPropertyValue('--lofi-overlay').trim().replace(/\s/g, '')).toBe(
      'rgba(0,0,0,0.35)',
    );
    expect(root!.style.colorScheme).toBe('light');
  });

  it('inverts grayscale on html[data-theme="dark"] and html.dark', () => {
    const dark = styleRules().find(
      (rule) => rule.style.getPropertyValue('--lofi-ink').trim() === '#eee',
    );
    expect(dark).toBeDefined();
    expect(dark!.selectorText).toMatch(/\[data-theme=['"]?dark['"]?\]/);
    expect(dark!.selectorText).toMatch(/html\.dark/);
    expect(dark!.style.getPropertyValue('--lofi-paper').trim()).toBe('#111');
    expect(dark!.style.getPropertyValue('--lofi-ink-muted').trim()).toBe('#999');
    expect(dark!.style.getPropertyValue('--lofi-overlay').trim().replace(/\s/g, '')).toBe(
      'rgba(255,255,255,0.35)',
    );
    expect(dark!.style.colorScheme).toBe('dark');
  });
});
