import { describe, expect, it } from 'vitest';
import { isAllowedOrigin, parseHostMessage, SHOWCASE_PROTOCOL_VERSION } from '../runtime/protocol';

describe('protocol', () => {
  it('parses valid host messages', () => {
    expect(
      parseHostMessage({
        type: 'showcase:start-interactive',
        version: SHOWCASE_PROTOCOL_VERSION,
      }),
    ).toEqual({
      type: 'showcase:start-interactive',
      version: SHOWCASE_PROTOCOL_VERSION,
    });

    expect(
      parseHostMessage({
        type: 'showcase:replay',
        version: SHOWCASE_PROTOCOL_VERSION,
      }),
    ).toEqual({
      type: 'showcase:replay',
      version: SHOWCASE_PROTOCOL_VERSION,
    });
  });

  it('rejects unknown or invalid messages', () => {
    expect(parseHostMessage(null)).toBeNull();
    expect(parseHostMessage({ type: 'showcase:replay', version: 99 })).toBeNull();
    expect(parseHostMessage({ type: 'other', version: SHOWCASE_PROTOCOL_VERSION })).toBeNull();
  });

  it('validates allowed origins', () => {
    expect(isAllowedOrigin('https://resume.example', ['https://resume.example'])).toBe(true);
    expect(isAllowedOrigin('https://evil.example', ['https://resume.example'])).toBe(false);
    expect(isAllowedOrigin('https://any.example', [])).toBe(true);
  });
});
