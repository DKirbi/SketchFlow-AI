import { describe, expect, it } from 'vitest';
import {
  DEFAULT_EMBED_ALLOWED_ORIGINS,
  embedAllowedOrigins,
  isAllowedOrigin,
  parseHostMessage,
  SHOWCASE_PROTOCOL_VERSION,
} from '../runtime/protocol';

describe('protocol', () => {
  it('parses showcase-prefixed host messages', () => {
    expect(
      parseHostMessage({
        type: 'showcase:ready',
        version: SHOWCASE_PROTOCOL_VERSION,
      }),
    ).toEqual({
      type: 'showcase:ready',
      version: SHOWCASE_PROTOCOL_VERSION,
    });
  });

  it('parses appearance snapshots and rejects incomplete ones', () => {
    expect(
      parseHostMessage({
        type: 'showcase:set-appearance',
        version: SHOWCASE_PROTOCOL_VERSION,
        theme: 'dark',
        locale: 'de',
      }),
    ).toEqual({
      type: 'showcase:set-appearance',
      version: SHOWCASE_PROTOCOL_VERSION,
      theme: 'dark',
      locale: 'de',
    });
    expect(
      parseHostMessage({
        type: 'showcase:set-appearance',
        version: SHOWCASE_PROTOCOL_VERSION,
        theme: 'dark',
      }),
    ).toBeNull();
  });

  it('rejects unknown or invalid messages', () => {
    expect(parseHostMessage(null)).toBeNull();
    expect(parseHostMessage({ type: 'showcase:ready', version: 99 })).toBeNull();
    expect(parseHostMessage({ type: 'other', version: SHOWCASE_PROTOCOL_VERSION })).toBeNull();
  });

  it('validates allowed origins', () => {
    expect(isAllowedOrigin('https://resume.example', ['https://resume.example'])).toBe(true);
    expect(isAllowedOrigin('https://evil.example', ['https://resume.example'])).toBe(false);
    expect(isAllowedOrigin('https://any.example', [])).toBe(false);
    expect(DEFAULT_EMBED_ALLOWED_ORIGINS).toContain('https://davorkirbis.com');
    expect(isAllowedOrigin('https://evil.example', [...DEFAULT_EMBED_ALLOWED_ORIGINS])).toBe(false);
    expect(embedAllowedOrigins().length).toBeGreaterThan(0);
  });
});
