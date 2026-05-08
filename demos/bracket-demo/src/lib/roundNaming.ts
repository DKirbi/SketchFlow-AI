/**
 * Shared cup-round naming utilities.
 *
 * These helpers are the single source of truth for converting bracket
 * round statistics into the abbreviations / full titles shown across
 * the UI. Both StructureSetupView (preview table) and the runtime
 * bracket builders use them so labels never drift.
 */

/**
 * Returns the standard cup-round abbreviation for a round given either
 * the number of matches it contains or its distance from the final.
 *
 * Priority: `stepsFromFinal` is used when provided (more reliable in
 * fully-seeded trees); `matchesInRound` is the fallback used when only
 * the tennis feed match count is available.
 *
 * Examples: 32 matches → "R64"   QF (4 matches) → "QF"
 */
export function cupRoundAbbrev(matchesInRound: number, stepsFromFinal?: number): string {
  if (stepsFromFinal !== undefined) {
    switch (stepsFromFinal) {
      case 0: return 'Final';
      case 1: return 'SF';
      case 2: return 'QF';
      case 3: return 'R16';
      case 4: return 'R32';
      case 5: return 'R64';
      case 6: return 'R128';
      default: return `Round of ${matchesInRound * 2}`;
    }
  }
  // Fallback: infer from match count (tennis / championship path)
  if (matchesInRound >= 64) return 'R128';
  if (matchesInRound >= 32) return 'R64';
  if (matchesInRound >= 16) return 'R32';
  if (matchesInRound >= 8)  return 'R16';
  if (matchesInRound >= 4)  return 'QF';
  if (matchesInRound >= 2)  return 'SF';
  return 'Final';
}

/**
 * Returns the compact match code used in tight spaces (e.g. "R64M2", "QFM1").
 *
 * For cup abbreviations that are already very short (QF, SF, Final) the
 * match number is appended directly. For verbose custom labels (e.g.
 * "Qualification round 1") we use only the first word-or-acronym segment
 * before a space.
 */
export function compactMatchCode(roundAbbrev: string, matchNumber: number | string): string {
  const abbrev = roundAbbrev.includes(' ')
    ? roundAbbrev.split(/\s+/)[0]!
    : roundAbbrev;
  return `${abbrev}M${matchNumber}`;
}

/**
 * Returns the full human-readable match title, e.g. "Round 64 Match 1",
 * "Quarterfinal Match 2", "Semifinal Match 1", "Final".
 *
 * This is the primary label shown in the match card header when there is
 * sufficient space.
 */
export function fullMatchTitle(roundAbbrev: string, matchNumber: number): string {
  const full = expandAbbrev(roundAbbrev);
  if (roundAbbrev === 'Final') return 'Final';
  return `${full} Match ${matchNumber}`;
}

/**
 * Expands a standard cup abbreviation into a readable round name.
 * Non-standard / custom labels are returned unchanged.
 */
export function expandAbbrev(abbrev: string): string {
  switch (abbrev) {
    case 'Final':  return 'Final';
    case 'SF':     return 'Semifinal';
    case 'QF':     return 'Quarterfinal';
    case 'R16':    return 'Round of 16';
    case 'R32':    return 'Round of 32';
    case 'R64':    return 'Round of 64';
    case 'R128':   return 'Round of 128';
    default: {
      // "Round of N" passthrough, or custom labels
      return abbrev;
    }
  }
}
