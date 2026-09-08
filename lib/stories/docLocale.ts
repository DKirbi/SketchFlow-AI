import { useSyncExternalStore } from 'react';

export type DocLocale = 'en' | 'de' | 'sl';

function localeFromSearch(search: string): DocLocale | null {
  const value = new URLSearchParams(search).get('locale');
  return value === 'de' || value === 'sl' || value === 'en' ? value : null;
}

function readQueryLocale(): DocLocale {
  if (typeof window === 'undefined') return 'en';
  const fromOwn = localeFromSearch(window.location.search);
  if (fromOwn) return fromOwn;
  if (window.parent !== window) {
    try {
      const fromParent = localeFromSearch(window.parent.location.search);
      if (fromParent) return fromParent;
    } catch {
      /* cross-origin parent */
    }
  }
  return 'en';
}

let current: DocLocale = 'en';
const listeners = new Set<() => void>();

export function getDocLocale(): DocLocale {
  return current;
}

export function setDocLocale(next: DocLocale): void {
  if (current === next) return;
  current = next;
  if (typeof document !== 'undefined') document.documentElement.lang = next;
  listeners.forEach((listener) => listener());
}

export function subscribeDocLocale(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function bootDocLocale(): void {
  setDocLocale(readQueryLocale());
  if (typeof window === 'undefined') return;
  window.addEventListener('message', (event) => {
    if (event.origin !== window.location.origin) return;
    const data = event.data as { type?: string; version?: number; locale?: string } | null;
    if (!data || data.version !== 1 || data.type !== 'showcase:set-appearance') return;
    if (data.locale === 'en' || data.locale === 'de' || data.locale === 'sl') {
      setDocLocale(data.locale);
    }
  });
}

export function useDocLocale(): DocLocale {
  return useSyncExternalStore(subscribeDocLocale, getDocLocale, () => 'en');
}
