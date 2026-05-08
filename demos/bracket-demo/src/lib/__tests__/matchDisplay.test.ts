import { describe, it, expect } from 'vitest';
import {
  getMatchDisplayId,
  generateMatchDisplayId,
  shortLabelForMatch,
  ensureMatchDisplayMeta,
  seedAllBracketMatchMeta,
} from '../matchDisplay';
import type { Bracket, Match } from '../../types';

// ── Helpers ────────────────────────────────────────────────────────────────────

function makeMatch(overrides: Partial<Match> = {}): Match {
  return {
    id: 'match-1',
    teamA: null,
    teamB: null,
    status: 'SCHEDULED',
    ...overrides,
  };
}

function makeBracket(overrides: Partial<Bracket> = {}): Bracket {
  return {
    id: 'bracket-a',
    title: 'Group A',
    round: 1,
    position: { x: 0, y: 0 },
    matches: [makeMatch()],
    ...overrides,
  };
}

// ── getMatchDisplayId ──────────────────────────────────────────────────────────

describe('getMatchDisplayId', () => {
  it('returns match.displayId when it is set and non-empty', () => {
    const match = makeMatch({ displayId: 'ID474339' });
    expect(getMatchDisplayId(match)).toBe('ID474339');
  });

  it('derives a deterministic ID from match.id when displayId is absent', () => {
    const match = makeMatch({ id: 'some-stable-id' });
    const id1 = getMatchDisplayId(match);
    const id2 = getMatchDisplayId(match);
    expect(id1).toBe(id2);
    expect(id1).toMatch(/^ID\d{6}$/);
  });

  it('produces different IDs for different match.id values', () => {
    const a = getMatchDisplayId(makeMatch({ id: 'id-aaa' }));
    const b = getMatchDisplayId(makeMatch({ id: 'id-bbb' }));
    expect(a).not.toBe(b);
  });

  it('ignores a whitespace-only displayId and falls back to derivation', () => {
    const match = makeMatch({ id: 'some-stable-id', displayId: '   ' });
    expect(getMatchDisplayId(match)).toMatch(/^ID\d{6}$/);
  });
});

// ── generateMatchDisplayId ─────────────────────────────────────────────────────

describe('generateMatchDisplayId', () => {
  it('returns a string matching the ID###### format', () => {
    expect(generateMatchDisplayId()).toMatch(/^ID\d{6}$/);
  });

  it('produces different values across calls (random)', () => {
    const ids = new Set(Array.from({ length: 20 }, generateMatchDisplayId));
    expect(ids.size).toBeGreaterThan(1);
  });
});

// ── shortLabelForMatch ─────────────────────────────────────────────────────────

describe('shortLabelForMatch — hard-coded bracket ids', () => {
  const cases: [string, number, string][] = [
    ['bracket-a', 0, 'GA1'],
    ['bracket-a', 2, 'GA3'],
    ['bracket-b', 0, 'GB1'],
    ['bracket-qf-a', 0, 'QF-A1'],
    ['bracket-qf-b', 1, 'QF-B2'],
    ['bracket-sf', 0, 'SF1'],
    ['bracket-final', 0, 'FINAL'],
    ['bracket-3rd', 0, '3RD'],
  ];

  it.each(cases)('bracket "%s" match %d → "%s"', (bracketId, matchIndex, expected) => {
    const bracket = makeBracket({ id: bracketId });
    expect(shortLabelForMatch(bracket, matchIndex)).toBe(expected);
  });
});

describe('shortLabelForMatch — default cupRound path', () => {
  it('uses roundLabel when available', () => {
    const bracket = makeBracket({ id: 'custom-bracket', roundLabel: 'QF' });
    expect(shortLabelForMatch(bracket, 0)).toBe('QFM1');
  });

  it('falls back to cupRoundAbbrev from match count when no roundLabel', () => {
    // 4 matches → QF abbreviation
    const bracket = makeBracket({
      id: 'custom-bracket',
      matches: [makeMatch(), makeMatch(), makeMatch(), makeMatch()],
    });
    const label = shortLabelForMatch(bracket, 0);
    expect(label).toMatch(/^QF/);
  });
});

// ── ensureMatchDisplayMeta ─────────────────────────────────────────────────────

describe('ensureMatchDisplayMeta', () => {
  it('preserves existing displayId / shortLabel / matchTitleFull', () => {
    const match = makeMatch({
      displayId: 'ID999',
      shortLabel: 'MY-LABEL',
      matchTitleFull: 'My Full Title',
    });
    const bracket = makeBracket({ id: 'bracket-a', matches: [match] });
    const result = ensureMatchDisplayMeta(match, bracket, 0);
    expect(result.displayId).toBe('ID999');
    expect(result.shortLabel).toBe('MY-LABEL');
    expect(result.matchTitleFull).toBe('My Full Title');
  });

  it('fills missing displayId from the deterministic hash', () => {
    const match = makeMatch({ id: 'my-match-id' });
    const bracket = makeBracket({ id: 'bracket-a', matches: [match] });
    const result = ensureMatchDisplayMeta(match, bracket, 0);
    expect(result.displayId).toMatch(/^ID\d{6}$/);
  });

  it('fills missing shortLabel for a known bracket id', () => {
    const match = makeMatch();
    const bracket = makeBracket({ id: 'bracket-sf', matches: [match] });
    const result = ensureMatchDisplayMeta(match, bracket, 0);
    expect(result.shortLabel).toBe('SF1');
  });

  it('fills missing matchTitleFull for a known bracket id', () => {
    const match = makeMatch();
    const bracket = makeBracket({ id: 'bracket-sf', matches: [match] });
    const result = ensureMatchDisplayMeta(match, bracket, 0);
    expect(result.matchTitleFull).toBe('Semifinal Match 1');
  });
});

// ── seedAllBracketMatchMeta ────────────────────────────────────────────────────

describe('seedAllBracketMatchMeta', () => {
  it('returns an empty array unchanged', () => {
    expect(seedAllBracketMatchMeta([])).toEqual([]);
  });

  it('assigns displayId to every match that lacks one', () => {
    const bracket = makeBracket({
      id: 'b1',
      round: 1,
      matches: [makeMatch({ id: 'm1' }), makeMatch({ id: 'm2' })],
    });
    const result = seedAllBracketMatchMeta([bracket]);
    for (const m of result[0]!.matches) {
      expect(m.displayId).toMatch(/^ID\d{6}$/);
    }
  });

  it('uses existing roundLabel to derive the match short label', () => {
    const bracket = makeBracket({
      id: 'custom-b',
      round: 1,
      roundLabel: 'QF',
      matches: [makeMatch({ id: 'm1' })],
    });
    const result = seedAllBracketMatchMeta([bracket]);
    expect(result[0]!.matches[0]!.shortLabel).toBe('QFM1');
  });

  it('propagates roundLabel to a bracket that was missing it', () => {
    // Two brackets in the same round — neither has a roundLabel yet.
    // With 2 single-match brackets in round 1 and max round = 1,
    // stepsFromFinal = 0 → cupRoundAbbrev → "Final" (1 match total).
    const b1 = makeBracket({ id: 'b1', round: 1, matches: [makeMatch({ id: 'm1' })] });
    const b2 = makeBracket({ id: 'b2', round: 1, matches: [makeMatch({ id: 'm2' })] });
    const result = seedAllBracketMatchMeta([b1, b2]);
    // Both should have received the same derived roundLabel
    expect(result[0]!.roundLabel).toBe(result[1]!.roundLabel);
  });

  it('preserves existing displayId / shortLabel / matchTitleFull', () => {
    const match = makeMatch({
      id: 'm1',
      displayId: 'ID-KEPT',
      shortLabel: 'KEPT',
      matchTitleFull: 'Kept Title',
    });
    const bracket = makeBracket({ id: 'b1', round: 1, matches: [match] });
    const result = seedAllBracketMatchMeta([bracket]);
    expect(result[0]!.matches[0]!.displayId).toBe('ID-KEPT');
    expect(result[0]!.matches[0]!.shortLabel).toBe('KEPT');
    expect(result[0]!.matches[0]!.matchTitleFull).toBe('Kept Title');
  });

  it('numbers single-match brackets by their position in the round', () => {
    // Three single-match brackets all in round 1: match numbers should be 1, 2, 3
    const b1 = makeBracket({ id: 'b1', round: 1, roundLabel: 'R16', matches: [makeMatch({ id: 'm1' })] });
    const b2 = makeBracket({ id: 'b2', round: 1, roundLabel: 'R16', matches: [makeMatch({ id: 'm2' })] });
    const b3 = makeBracket({ id: 'b3', round: 1, roundLabel: 'R16', matches: [makeMatch({ id: 'm3' })] });
    const result = seedAllBracketMatchMeta([b1, b2, b3]);
    expect(result[0]!.matches[0]!.shortLabel).toBe('R16M1');
    expect(result[1]!.matches[0]!.shortLabel).toBe('R16M2');
    expect(result[2]!.matches[0]!.shortLabel).toBe('R16M3');
  });
});
