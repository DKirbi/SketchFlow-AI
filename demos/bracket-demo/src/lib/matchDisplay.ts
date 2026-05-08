import type { Bracket, Match } from '../types';
import { compactMatchCode, cupRoundAbbrev, fullMatchTitle } from './roundNaming';

/** Deterministic display id when `match.displayId` is not set (stable per internal id). */
export function getMatchDisplayId(match: Match): string {
  if (match.displayId?.trim()) return match.displayId;
  let h = 0;
  for (let i = 0; i < match.id.length; i++) {
    h = (Math.imul(31, h) + match.id.charCodeAt(i)) >>> 0;
  }
  const n = 100000 + (h % 900000);
  return `ID${n}`;
}

/** Random-style id for newly created matches (matches product screenshots). */
export function generateMatchDisplayId(): string {
  return `ID${Math.floor(100000 + Math.random() * 900000)}`;
}

/** Default short label for a match in a bracket when not explicitly set. */
export function shortLabelForMatch(bracket: Bracket, matchIndex: number): string {
  const n = matchIndex + 1;
  switch (bracket.id) {
    case 'bracket-a':
      return `GA${n}`;
    case 'bracket-b':
      return `GB${n}`;
    case 'bracket-qf-a':
      return `QF-A${n}`;
    case 'bracket-qf-b':
      return `QF-B${n}`;
    case 'bracket-sf':
      return `SF${n}`;
    case 'bracket-final':
      return 'FINAL';
    case 'bracket-3rd':
      return '3RD';
    default: {
      // Prefer the cup-style round label already on the bracket (e.g. "R64", "QF")
      const abbrev = bracket.roundLabel ?? cupRoundAbbrev(bracket.matches.length, undefined);
      return compactMatchCode(abbrev, n);
    }
  }
}

export function ensureMatchDisplayMeta(match: Match, bracket: Bracket, index: number): Match {
  const displayId = match.displayId?.trim() ? match.displayId : getMatchDisplayId(match);
  const shortLabel = match.shortLabel?.trim()
    ? match.shortLabel
    : shortLabelForMatch(bracket, index);
  const matchTitleFull = match.matchTitleFull?.trim()
    ? match.matchTitleFull
    : _buildFullTitle(bracket, index);
  return { ...match, displayId, shortLabel, matchTitleFull };
}

function _buildFullTitle(bracket: Bracket, index: number): string {
  switch (bracket.id) {
    case 'bracket-a':    return `Group A Match ${index + 1}`;
    case 'bracket-b':    return `Group B Match ${index + 1}`;
    case 'bracket-qf-a': return `Quarterfinal A Match ${index + 1}`;
    case 'bracket-qf-b': return `Quarterfinal B Match ${index + 1}`;
    case 'bracket-sf':   return `Semifinal Match ${index + 1}`;
    case 'bracket-final': return 'Final';
    case 'bracket-3rd':  return 'Third-place Match';
    default: {
      const abbrev = bracket.roundLabel ?? cupRoundAbbrev(bracket.matches.length, undefined);
      return fullMatchTitle(abbrev, index + 1);
    }
  }
}

export function seedBracketMatchesMeta(bracket: Bracket): Bracket {
  return {
    ...bracket,
    matches: bracket.matches.map((m, i) => ensureMatchDisplayMeta(m, bracket, i)),
  };
}

/**
 * Tournament-level meta pass: groups brackets by round so each bracket
 * knows how many matches are in its round, then seeds `shortLabel` and
 * `matchTitleFull` on every match using cup-round naming.
 *
 * For brackets that already carry a `roundLabel` (e.g. "R64", "QF") the
 * existing label is used; otherwise we derive the abbreviation from the
 * match count per round and distance-from-final, ensuring labels like
 * "R64M2" / "Round of 64 Match 2" even without a structure preset.
 */
export function seedAllBracketMatchMeta(brackets: Bracket[]): Bracket[] {
  if (brackets.length === 0) return brackets;

  // Group by round, count matches per round, find max round for stepsFromFinal.
  const byRound = new Map<number, Bracket[]>();
  for (const b of brackets) {
    const list = byRound.get(b.round) ?? [];
    list.push(b);
    byRound.set(b.round, list);
  }
  const rounds = [...byRound.keys()].sort((a, b) => a - b);
  const maxRound = rounds[rounds.length - 1]!;

  // Build a map: round → resolved cup abbrev
  const roundAbbrevMap = new Map<number, string>();
  for (const round of rounds) {
    const bracketsInRound = byRound.get(round)!;
    // Prefer an explicit roundLabel already on any bracket in this round
    const existing = bracketsInRound.find((b) => b.roundLabel)?.roundLabel;
    if (existing) {
      roundAbbrevMap.set(round, existing);
    } else {
      const matchesInRound = bracketsInRound.reduce((s, b) => s + b.matches.length, 0);
      const stepsFromFinal = maxRound - round;
      roundAbbrevMap.set(round, cupRoundAbbrev(matchesInRound, stepsFromFinal));
    }
  }

  // Record each bracket's 0-based index within its round so single-match
  // brackets get the correct match number (e.g. bracket #2 in R32 → Match 3,
  // not Match 1 which is what the within-bracket index would always give).
  const bracketRoundIndex = new Map<string, number>();
  for (const round of rounds) {
    byRound.get(round)!.forEach((b, idx) => bracketRoundIndex.set(b.id, idx));
  }

  return brackets.map((bracket) => {
    const abbrev = roundAbbrevMap.get(bracket.round)!;
    // Annotate roundLabel if it was missing so downstream utilities benefit too
    const updatedBracket = bracket.roundLabel ? bracket : { ...bracket, roundLabel: abbrev };
    const bracketIdxInRound = bracketRoundIndex.get(bracket.id) ?? 0;

    return {
      ...updatedBracket,
      matches: updatedBracket.matches.map((m, i) => {
        // Single-match bracket: match number = bracket's position in the round.
        // Multi-match bracket (group stage): match number = position within bracket.
        const matchNum = updatedBracket.matches.length === 1 ? bracketIdxInRound + 1 : i + 1;
        const displayId = m.displayId?.trim() ? m.displayId : getMatchDisplayId(m);
        const shortLabel = m.shortLabel?.trim()
          ? m.shortLabel
          : compactMatchCode(abbrev, matchNum);
        const matchTitleFull = m.matchTitleFull?.trim()
          ? m.matchTitleFull
          : fullMatchTitle(abbrev, matchNum);
        return { ...m, displayId, shortLabel, matchTitleFull };
      }),
    };
  });
}
