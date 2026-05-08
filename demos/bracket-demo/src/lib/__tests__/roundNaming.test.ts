import { describe, it, expect } from 'vitest';
import {
  cupRoundAbbrev,
  compactMatchCode,
  fullMatchTitle,
  expandAbbrev,
} from '../roundNaming';

// ── cupRoundAbbrev ─────────────────────────────────────────────────────────────

describe('cupRoundAbbrev — stepsFromFinal mode', () => {
  it('returns "Final" when stepsFromFinal is 0', () => {
    expect(cupRoundAbbrev(1, 0)).toBe('Final');
  });

  it('returns "SF" when stepsFromFinal is 1', () => {
    expect(cupRoundAbbrev(2, 1)).toBe('SF');
  });

  it('returns "QF" when stepsFromFinal is 2', () => {
    expect(cupRoundAbbrev(4, 2)).toBe('QF');
  });

  it('returns "R16" when stepsFromFinal is 3', () => {
    expect(cupRoundAbbrev(8, 3)).toBe('R16');
  });

  it('returns "R32" when stepsFromFinal is 4', () => {
    expect(cupRoundAbbrev(16, 4)).toBe('R32');
  });

  it('returns "R64" when stepsFromFinal is 5', () => {
    expect(cupRoundAbbrev(32, 5)).toBe('R64');
  });

  it('returns "R128" when stepsFromFinal is 6', () => {
    expect(cupRoundAbbrev(64, 6)).toBe('R128');
  });

  it('returns "Round of N" for an unknown stepsFromFinal (e.g. 7)', () => {
    expect(cupRoundAbbrev(128, 7)).toBe('Round of 256');
  });

  it('ignores matchesInRound when stepsFromFinal is provided', () => {
    // stepsFromFinal wins over any matchesInRound value
    expect(cupRoundAbbrev(999, 0)).toBe('Final');
    expect(cupRoundAbbrev(1, 2)).toBe('QF');
  });
});

describe('cupRoundAbbrev — matchesInRound fallback (no stepsFromFinal)', () => {
  it('returns "R128" for >= 64 matches', () => {
    expect(cupRoundAbbrev(64)).toBe('R128');
    expect(cupRoundAbbrev(100)).toBe('R128');
  });

  it('returns "R64" for 32–63 matches', () => {
    expect(cupRoundAbbrev(32)).toBe('R64');
    expect(cupRoundAbbrev(63)).toBe('R64');
  });

  it('returns "R32" for 16–31 matches', () => {
    expect(cupRoundAbbrev(16)).toBe('R32');
    expect(cupRoundAbbrev(31)).toBe('R32');
  });

  it('returns "R16" for 8–15 matches', () => {
    expect(cupRoundAbbrev(8)).toBe('R16');
    expect(cupRoundAbbrev(15)).toBe('R16');
  });

  it('returns "QF" for 4–7 matches', () => {
    expect(cupRoundAbbrev(4)).toBe('QF');
    expect(cupRoundAbbrev(7)).toBe('QF');
  });

  it('returns "SF" for 2–3 matches', () => {
    expect(cupRoundAbbrev(2)).toBe('SF');
    expect(cupRoundAbbrev(3)).toBe('SF');
  });

  it('returns "Final" for 1 match', () => {
    expect(cupRoundAbbrev(1)).toBe('Final');
  });
});

// ── compactMatchCode ───────────────────────────────────────────────────────────

describe('compactMatchCode', () => {
  it('appends match number to a short abbreviation', () => {
    expect(compactMatchCode('QF', 1)).toBe('QFM1');
    expect(compactMatchCode('SF', 2)).toBe('SFM2');
    expect(compactMatchCode('Final', 1)).toBe('FinalM1');
    expect(compactMatchCode('R64', 5)).toBe('R64M5');
  });

  it('uses only the first word segment when abbrev contains spaces', () => {
    expect(compactMatchCode('Qualification round 1', 1)).toBe('QualificationM1');
    expect(compactMatchCode('Round of 16', 3)).toBe('RoundM3');
  });

  it('accepts a string matchNumber', () => {
    expect(compactMatchCode('QF', '3')).toBe('QFM3');
  });
});

// ── fullMatchTitle ─────────────────────────────────────────────────────────────

describe('fullMatchTitle', () => {
  it('returns "Final" for the Final abbreviation regardless of matchNumber', () => {
    expect(fullMatchTitle('Final', 1)).toBe('Final');
  });

  it('expands known abbreviations into full titles', () => {
    expect(fullMatchTitle('SF', 1)).toBe('Semifinal Match 1');
    expect(fullMatchTitle('QF', 2)).toBe('Quarterfinal Match 2');
    expect(fullMatchTitle('R16', 3)).toBe('Round of 16 Match 3');
    expect(fullMatchTitle('R32', 1)).toBe('Round of 32 Match 1');
    expect(fullMatchTitle('R64', 4)).toBe('Round of 64 Match 4');
    expect(fullMatchTitle('R128', 1)).toBe('Round of 128 Match 1');
  });

  it('passes custom labels through unchanged', () => {
    expect(fullMatchTitle('Qualification round 1', 1)).toBe('Qualification round 1 Match 1');
    expect(fullMatchTitle('Group Stage', 5)).toBe('Group Stage Match 5');
  });
});

// ── expandAbbrev ───────────────────────────────────────────────────────────────

describe('expandAbbrev', () => {
  it('expands all standard cup abbreviations', () => {
    expect(expandAbbrev('Final')).toBe('Final');
    expect(expandAbbrev('SF')).toBe('Semifinal');
    expect(expandAbbrev('QF')).toBe('Quarterfinal');
    expect(expandAbbrev('R16')).toBe('Round of 16');
    expect(expandAbbrev('R32')).toBe('Round of 32');
    expect(expandAbbrev('R64')).toBe('Round of 64');
    expect(expandAbbrev('R128')).toBe('Round of 128');
  });

  it('returns custom / unknown labels unchanged', () => {
    expect(expandAbbrev('Qualification round 1')).toBe('Qualification round 1');
    expect(expandAbbrev('Bronze Final')).toBe('Bronze Final');
    expect(expandAbbrev('Group Stage')).toBe('Group Stage');
  });
});
