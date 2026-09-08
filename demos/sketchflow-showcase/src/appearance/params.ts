import type { ShowcaseLocale, ShowcaseTheme } from '../runtime/protocol';
import { localeFromParam, themeFromParam } from '../runtime/protocol';

export function appearanceSearchFromParams(params: URLSearchParams): string {
  const next = new URLSearchParams();
  const theme = params.get('theme');
  const locale = params.get('locale');
  if (theme === 'light' || theme === 'dark') next.set('theme', theme);
  if (locale === 'en' || locale === 'de' || locale === 'sl') next.set('locale', locale);
  const search = next.toString();
  return search ? `?${search}` : '';
}

export function parseAppearanceSearch(params: URLSearchParams): {
  theme: ShowcaseTheme;
  locale: ShowcaseLocale;
  pinned: boolean;
} {
  const rawTheme = params.get('theme');
  const rawLocale = params.get('locale');
  const pinned =
    rawTheme === 'light' ||
    rawTheme === 'dark' ||
    rawLocale === 'en' ||
    rawLocale === 'de' ||
    rawLocale === 'sl';
  return {
    theme: themeFromParam(rawTheme),
    locale: localeFromParam(rawLocale),
    pinned,
  };
}

function upsertQueryParam(url: string, key: string, value: string): string {
  const hashIndex = url.indexOf('#');
  const hash = hashIndex >= 0 ? url.slice(hashIndex) : '';
  const withoutHash = hashIndex >= 0 ? url.slice(0, hashIndex) : url;
  const re = new RegExp(`([?&])${key}=[^&]*`);
  if (re.test(withoutHash)) {
    return `${withoutHash.replace(re, `$1${key}=${value}`)}${hash}`;
  }
  const joiner = withoutHash.includes('?') ? '&' : '?';
  return `${withoutHash}${joiner}${key}=${value}${hash}`;
}

/** Merge theme + locale onto an embed URL without rewriting existing query encoding. */
export function appendAppearanceParams(
  url: string,
  theme: ShowcaseTheme,
  locale: ShowcaseLocale,
): string {
  return upsertQueryParam(upsertQueryParam(url, 'theme', theme), 'locale', locale);
}
