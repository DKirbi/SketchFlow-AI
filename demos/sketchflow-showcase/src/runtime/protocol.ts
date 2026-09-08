export const SHOWCASE_PROTOCOL_VERSION = 1 as const;

export type ShowcaseTheme = 'light' | 'dark';
export type ShowcaseLocale = 'en' | 'de' | 'sl';

export const DEFAULT_EMBED_ALLOWED_ORIGINS = [
  'https://davorkirbis.com',
  'https://www.davorkirbis.com',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
] as const;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

export function parseShowcaseTheme(value: unknown): ShowcaseTheme | null {
  return value === 'light' || value === 'dark' ? value : null;
}

export function parseShowcaseLocale(value: unknown): ShowcaseLocale | null {
  return value === 'en' || value === 'de' || value === 'sl' ? value : null;
}

export function themeFromParam(value: string | null | undefined): ShowcaseTheme {
  return parseShowcaseTheme(value) ?? 'light';
}

export function localeFromParam(value: string | null | undefined): ShowcaseLocale {
  return parseShowcaseLocale(value) ?? 'en';
}

/** Validate message origin against an allow-list (host integration guidance). */
export function isAllowedOrigin(origin: string, allowedOrigins: string[]): boolean {
  if (allowedOrigins.length === 0) return false;
  return allowedOrigins.includes(origin);
}

export function embedAllowedOrigins(): string[] {
  const extra =
    typeof import.meta !== 'undefined' && import.meta.env?.VITE_EMBED_ALLOWED_ORIGINS
      ? String(import.meta.env.VITE_EMBED_ALLOWED_ORIGINS)
          .split(',')
          .map((origin) => origin.trim())
          .filter(Boolean)
      : [];
  return [...DEFAULT_EMBED_ALLOWED_ORIGINS, ...extra];
}

export interface ShowcaseSetAppearanceMessage {
  type: 'showcase:set-appearance';
  version: typeof SHOWCASE_PROTOCOL_VERSION;
  theme: ShowcaseTheme;
  locale: ShowcaseLocale;
}

export interface ShowcaseAppearanceAppliedMessage {
  type: 'showcase:appearance-applied';
  version: typeof SHOWCASE_PROTOCOL_VERSION;
  theme: ShowcaseTheme;
  locale: ShowcaseLocale;
}

export type HostMessage =
  | ShowcaseSetAppearanceMessage
  | { type: string; version: typeof SHOWCASE_PROTOCOL_VERSION };

/** Parse host postMessage payloads. Appearance messages keep theme + locale. */
export function parseHostMessage(data: unknown): HostMessage | null {
  if (!isRecord(data) || data.version !== SHOWCASE_PROTOCOL_VERSION) return null;
  if (typeof data.type !== 'string' || !data.type.startsWith('showcase:')) return null;
  if (data.type === 'showcase:set-appearance') {
    const theme = parseShowcaseTheme(data.theme);
    const locale = parseShowcaseLocale(data.locale);
    if (!theme || !locale) return null;
    return {
      type: 'showcase:set-appearance',
      version: SHOWCASE_PROTOCOL_VERSION,
      theme,
      locale,
    };
  }
  return { type: data.type, version: SHOWCASE_PROTOCOL_VERSION };
}

export function isSetAppearanceMessage(
  message: HostMessage,
): message is ShowcaseSetAppearanceMessage {
  return message.type === 'showcase:set-appearance';
}
