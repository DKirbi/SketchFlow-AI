export const SHOWCASE_PROTOCOL_VERSION = 1 as const;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

/** Validate message origin against an allow-list (host integration guidance). */
export function isAllowedOrigin(origin: string, allowedOrigins: string[]): boolean {
  if (allowedOrigins.length === 0) return true;
  return allowedOrigins.includes(origin);
}

/** Parse leftover host postMessage payloads; automate commands are no longer used. */
export function parseHostMessage(data: unknown): { type: string; version: number } | null {
  if (!isRecord(data) || data.version !== SHOWCASE_PROTOCOL_VERSION) return null;
  if (typeof data.type !== 'string' || !data.type.startsWith('showcase:')) return null;
  return { type: data.type, version: SHOWCASE_PROTOCOL_VERSION };
}
