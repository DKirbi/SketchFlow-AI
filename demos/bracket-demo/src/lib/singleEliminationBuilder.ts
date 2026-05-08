import type {
  Bracket,
  Match,
  Progression,
  ProgressionRule,
  TournamentEntrant,
} from '../types';
import { seedAllBracketMatchMeta } from './matchDisplay';
import { cupRoundAbbrev } from './roundNaming';
import { layoutSingleElimination } from './bracketTreeLayout';
import { scheduleFromEntrantPair } from './roundsetSchedule';

export interface SingleEliminationResult {
  brackets: Bracket[];
  progressions: Progression[];
}

/**
 * Key used to look up an existing match to overlay onto a skeleton slot.
 * Round is 1-based; matchIndex is 0-based within the round.
 */
export type MatchOverlayKey = `r${number}m${number}`;

export function makeOverlayKey(round: number, matchIndex: number): MatchOverlayKey {
  return `r${round}m${matchIndex}`;
}

/**
 * Build a complete single-elimination bracket tree from an ordered list of entrants.
 *
 * Round 1 pairs are formed consecutively: (0,1), (2,3), …  If the entrant count is odd
 * the last seed receives a bye (`isBye: true`, auto-FINISHED, winner pre-resolved).
 *
 * Every later round is populated in full: if a feeder match was already FINISHED (e.g. a
 * bye in round 1) the winner is resolved immediately; all other team slots use deterministic
 * placeholder strings so betting targets have stable IDs before results are known.
 *
 * Placeholder label format: "R{round} M{pos} · Team {1|2}" where round/pos describe the
 * *current* bracket slot, making each placeholder globally unique.
 *
 * Match IDs are deterministic: `se-{tid}-r{round}-m{matchIdx}`.
 * Bracket IDs:                 `se-{tid}-r{round}-b{matchIdx}`.
 * Progression IDs:             `se-prog-{fromBracketId}-to-{toBracketId}-{slot}`.
 *
 * @param entrants  Ordered participant list (index 0 = seed 1).
 * @param tournamentId  Stable tournament identifier used as part of generated IDs.
 * @param roundLabels  Optional per-round display labels (index 0 = round 1 label, etc.).
 * @param overlayMatches  Optional map from {@link MatchOverlayKey} to feed Match data that
 *   will be merged onto the skeleton slot (teamA, teamB, status, winner, scheduledAt, week).
 *   The skeleton `id` is always kept so betting targets remain stable.
 */
export function buildSingleEliminationFromEntrants(
  entrants: TournamentEntrant[],
  tournamentId: string,
  roundLabels: string[] = [],
  overlayMatches?: Map<MatchOverlayKey, Partial<Match>>,
): SingleEliminationResult {
  if (entrants.length < 2) return { brackets: [], progressions: [] };

  // Sanitise tournament id for use in composite keys.
  const tid = tournamentId.replace(/[^a-z0-9]/gi, '-').toLowerCase();

  const brackets: Bracket[] = [];
  const progressions: Progression[] = [];

  // Precompute match counts per round so we know the total number of rounds
  // upfront. This lets each round resolve its stepsFromFinal and therefore
  // derive the correct cup-round abbreviation (R128, R64, QF, …) when no
  // explicit roundLabel was supplied via roundLabels.
  const matchCountsPerRound: number[] = [];
  let _c = Math.ceil(entrants.length / 2);
  while (_c >= 1) {
    matchCountsPerRound.push(_c);
    if (_c === 1) break;
    _c = Math.ceil(_c / 2);
  }
  const totalRounds = matchCountsPerRound.length;

  // Resolve the round label for round index `rIdx` (0-based).
  // Explicit roundLabels from structure always win; otherwise derive from
  // match count and distance-from-final.
  function resolveRoundLabel(rIdx: number): string {
    if (roundLabels[rIdx]) return roundLabels[rIdx]!;
    const matchesInRound = matchCountsPerRound[rIdx] ?? 1;
    const stepsFromFinal = totalRounds - 1 - rIdx;
    return cupRoundAbbrev(matchesInRound, stepsFromFinal);
  }

  // ── Round 1 ──────────────────────────────────────────────────────────────
  const r1Count = Math.ceil(entrants.length / 2);
  const r1Label = resolveRoundLabel(0);

  for (let i = 0; i < r1Count; i++) {
    const ea = entrants[i * 2]!;
    const eb = entrants[i * 2 + 1]; // undefined when entrant count is odd
    const isBye = !eb;

    const matchId = `se-${tid}-r1-m${i}`;
    const bracketId = `se-${tid}-r1-b${i}`;

    const fromEntrants = scheduleFromEntrantPair(ea, eb);

    const match: Match = {
      id: matchId,
      teamA: { id: ea.id, name: ea.name },
      teamB: eb ? { id: eb.id, name: eb.name } : null,
      status: isBye ? 'FINISHED' : 'SCHEDULED',
      winner: isBye ? { id: ea.id, name: ea.name } : undefined,
      isBye: isBye || undefined,
      ...fromEntrants,
    };

    brackets.push({
      id: bracketId,
      title: `${r1Label} · Match ${i + 1}`,
      round: 1,
      roundLabel: r1Label,
      position: { x: 0, y: 0 },
      matches: [match],
    });
  }

  // ── Subsequent rounds ─────────────────────────────────────────────────────
  let prevRoundBrackets = brackets.slice(); // all round-1 brackets
  let roundNum = 2;

  while (prevRoundBrackets.length > 1) {
    const currCount = Math.ceil(prevRoundBrackets.length / 2);
    const labelIdx = roundNum - 1;
    const roundLabel = resolveRoundLabel(labelIdx);
    const currRoundBrackets: Bracket[] = [];

    for (let i = 0; i < currCount; i++) {
      const feederA = prevRoundBrackets[i * 2]!;
      const feederB = prevRoundBrackets[i * 2 + 1]; // undefined → bye

      const matchId = `se-${tid}-r${roundNum}-m${i}`;
      const bracketId = `se-${tid}-r${roundNum}-b${i}`;
      const pos = i + 1;

      const feederAMatch = feederA.matches[0]!;
      const feederBMatch = feederB?.matches[0];

      // Resolve immediately if a feeder was already finished (e.g. an earlier bye).
      const resolvedA =
        feederAMatch.status === 'FINISHED' && feederAMatch.winner ? feederAMatch.winner : null;
      const resolvedB =
        feederBMatch?.status === 'FINISHED' && feederBMatch.winner ? feederBMatch.winner : null;

      const isByeMatch = !feederB;

      const match: Match = {
        id: matchId,
        teamA: resolvedA,
        teamB: feederB ? resolvedB : null,
        teamAPlaceholder: resolvedA ? undefined : `${roundLabel} M${pos} · Team 1`,
        teamBPlaceholder: feederB
          ? (resolvedB ? undefined : `${roundLabel} M${pos} · Team 2`)
          : undefined,
        status: isByeMatch ? 'FINISHED' : 'SCHEDULED',
        winner: isByeMatch ? (resolvedA ?? undefined) : undefined,
        isBye: isByeMatch || undefined,
      };

      const bracket: Bracket = {
        id: bracketId,
        title: `${roundLabel} · Match ${pos}`,
        round: roundNum,
        roundLabel,
        position: { x: 0, y: 0 },
        matches: [match],
      };

      currRoundBrackets.push(bracket);
      brackets.push(bracket);

      // Progression: feederA → teamA
      const progA: ProgressionRule = {
        fromBracketId: feederA.id,
        fromMatchId: feederAMatch.id,
        toBracketId: bracketId,
        toMatchId: matchId,
        toSlot: 'teamA',
        trigger: 'AFTER_MATCH_END',
        condition: 'WINNER',
      };
      progressions.push({
        id: `se-prog-${feederA.id}-to-${bracketId}-a`,
        rules: [progA],
      });

      // Progression: feederB → teamB (only when a real opponent exists)
      if (feederB) {
        const progB: ProgressionRule = {
          fromBracketId: feederB.id,
          fromMatchId: feederBMatch!.id,
          toBracketId: bracketId,
          toMatchId: matchId,
          toSlot: 'teamB',
          trigger: 'AFTER_MATCH_END',
          condition: 'WINNER',
        };
        progressions.push({
          id: `se-prog-${feederB.id}-to-${bracketId}-b`,
          rules: [progB],
        });
      }
    }

    prevRoundBrackets = currRoundBrackets;
    roundNum++;
  }

  // Overlay feed match data onto skeleton slots when provided.
  // The skeleton match `id` is preserved so all external references (bets, etc.) stay stable.
  if (overlayMatches?.size) {
    for (const b of brackets) {
      b.matches = b.matches.map((m, mi) => {
        const key = makeOverlayKey(b.round, mi);
        const overlay = overlayMatches.get(key);
        if (!overlay) return m;
        return {
          ...m,
          teamA: overlay.teamA !== undefined ? overlay.teamA : m.teamA,
          teamB: overlay.teamB !== undefined ? overlay.teamB : m.teamB,
          status: overlay.status ?? m.status,
          winner: overlay.winner !== undefined ? overlay.winner : m.winner,
          scheduledAt: overlay.scheduledAt ?? m.scheduledAt,
          week: overlay.week ?? m.week,
          venueName: overlay.venueName !== undefined ? overlay.venueName : m.venueName,
          // Clear placeholder for slots that now have real teams.
          teamAPlaceholder: overlay.teamA ? undefined : m.teamAPlaceholder,
          teamBPlaceholder: overlay.teamB ? undefined : m.teamBPlaceholder,
        };
      });
    }
  }

  // Apply display meta (displayId, shortLabel, matchTitleFull) then layout.
  const seeded = seedAllBracketMatchMeta(brackets);
  const laidOut = layoutSingleElimination(seeded, progressions, {
    baseX: 60,
    baseY: 80,
    leafSpacing: 320,
    columnSpacing: 480,
  });

  return { brackets: laidOut, progressions };
}
