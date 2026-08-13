import type { ShowcaseMode } from './types';

export const SHOWCASE_PROTOCOL_VERSION = 1 as const;

export type HostToIframeMessage =
  | { type: 'showcase:start-interactive'; version: typeof SHOWCASE_PROTOCOL_VERSION }
  | { type: 'showcase:replay'; version: typeof SHOWCASE_PROTOCOL_VERSION };

export type IframeToHostMessage =
  | {
      type: 'showcase:ready';
      version: typeof SHOWCASE_PROTOCOL_VERSION;
      slug: string;
    }
  | { type: 'showcase:preview-complete'; version: typeof SHOWCASE_PROTOCOL_VERSION }
  | { type: 'showcase:interaction-complete'; version: typeof SHOWCASE_PROTOCOL_VERSION }
  | {
      type: 'showcase:mode-change';
      version: typeof SHOWCASE_PROTOCOL_VERSION;
      mode: ShowcaseMode;
    };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

/** Parse an incoming postMessage payload from the host page. */
export function parseHostMessage(data: unknown): HostToIframeMessage | null {
  if (!isRecord(data) || data.version !== SHOWCASE_PROTOCOL_VERSION) return null;
  if (data.type === 'showcase:start-interactive' || data.type === 'showcase:replay') {
    return data as HostToIframeMessage;
  }
  return null;
}

/** Validate message origin against an allow-list (host integration guidance). */
export function isAllowedOrigin(origin: string, allowedOrigins: string[]): boolean {
  if (allowedOrigins.length === 0) return true;
  return allowedOrigins.includes(origin);
}

/** Build a typed outbound message for postMessage. */
export function createIframeMessage(message: IframeToHostMessage): IframeToHostMessage {
  return message;
}
