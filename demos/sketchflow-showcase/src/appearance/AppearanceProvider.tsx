/* eslint-disable react-refresh/only-export-components -- provider + useAppearance hook */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { useSearchParams } from 'react-router-dom';
import { applyLofiTheme } from 'lofi-kit';
import { CHROME, type ChromeCopy } from './chrome';
import { parseAppearanceSearch } from './params';
import {
  SHOWCASE_PROTOCOL_VERSION,
  embedAllowedOrigins,
  isAllowedOrigin,
  isSetAppearanceMessage,
  parseHostMessage,
  type ShowcaseLocale,
  type ShowcaseTheme,
} from '../runtime/protocol';

export interface AppearanceValue {
  theme: ShowcaseTheme;
  locale: ShowcaseLocale;
  chrome: ChromeCopy;
  pinned: boolean;
}

const AppearanceContext = createContext<AppearanceValue | null>(null);

export function useAppearance(): AppearanceValue {
  const value = useContext(AppearanceContext);
  if (!value) {
    throw new Error('useAppearance must be used inside AppearanceProvider');
  }
  return value;
}

function applyDocumentAppearance(theme: ShowcaseTheme, locale: ShowcaseLocale) {
  applyLofiTheme(theme);
  document.documentElement.lang = locale;
}

export function AppearanceProvider({ children }: { children: ReactNode }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const initial = parseAppearanceSearch(searchParams);
  const [theme, setTheme] = useState<ShowcaseTheme>(initial.theme);
  const [locale, setLocale] = useState<ShowcaseLocale>(initial.locale);
  const [pinned, setPinned] = useState(initial.pinned);

  const apply = useCallback((nextTheme: ShowcaseTheme, nextLocale: ShowcaseLocale, pin: boolean) => {
    setTheme(nextTheme);
    setLocale(nextLocale);
    applyDocumentAppearance(nextTheme, nextLocale);
    if (pin) setPinned(true);
  }, []);

  useEffect(() => {
    applyDocumentAppearance(theme, locale);
  }, [theme, locale]);

  useEffect(() => {
    const allowed = embedAllowedOrigins();
    function onMessage(event: MessageEvent) {
      if (!isAllowedOrigin(event.origin, allowed)) return;
      const message = parseHostMessage(event.data);
      if (!message || !isSetAppearanceMessage(message)) return;
      apply(message.theme, message.locale, true);
      if (window.parent !== window) {
        const applied = {
          type: 'showcase:appearance-applied' as const,
          version: SHOWCASE_PROTOCOL_VERSION,
          theme: message.theme,
          locale: message.locale,
        };
        window.parent.postMessage(applied, event.origin);
      }
    }
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [apply]);

  useEffect(() => {
    if (!pinned) return;
    if (searchParams.get('theme') === theme && searchParams.get('locale') === locale) {
      return;
    }
    setSearchParams(
      (current) => {
        const next = new URLSearchParams(current);
        next.set('theme', theme);
        next.set('locale', locale);
        return next;
      },
      { replace: true },
    );
  }, [locale, pinned, searchParams, setSearchParams, theme]);

  const value = useMemo<AppearanceValue>(
    () => ({
      theme,
      locale,
      chrome: CHROME[locale],
      pinned,
    }),
    [locale, pinned, theme],
  );

  return <AppearanceContext.Provider value={value}>{children}</AppearanceContext.Provider>;
}
