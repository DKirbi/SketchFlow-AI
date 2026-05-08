import type { Bracket, TournamentStructure } from '../types';

export interface RoundColumn {
  round: number;
  label: string;
  /** Left edge of the column band in canvas (world) coordinates */
  startX: number;
  /** Right edge of the column band in canvas coordinates */
  endX: number;
}

/** Approximate rendered width of a bracket node (matches .bracket-node min/max-width in CSS). */
const NODE_WIDTH_EST = 340;
/** Horizontal padding added outside the outermost bracket positions per column. */
const COL_PAD = 20;

/**
 * Derives per-round column bands and display labels from the current bracket positions.
 *
 * Label resolution order (first match wins):
 *   1. `tournamentStructure.rows` sorted by `order`, indexed by (round - minRound).
 *   2. First non-empty `bracket.roundLabel` in that round.
 *   3. First segment of the bracket `title` before ` · `.
 *   4. Fallback: `Round {round}`.
 */
export function deriveRoundColumns(
  brackets: Bracket[],
  tournamentStructure: TournamentStructure | null,
): RoundColumn[] {
  if (brackets.length === 0) return [];

  const byRound = new Map<number, Bracket[]>();
  for (const b of brackets) {
    const list = byRound.get(b.round) ?? [];
    list.push(b);
    byRound.set(b.round, list);
  }

  const rounds = [...byRound.keys()].sort((a, b) => a - b);
  const minRound = rounds[0]!;

  const sortedStructureRows = tournamentStructure?.rows
    ? [...tournamentStructure.rows].sort((a, b) => a.order - b.order)
    : null;

  return rounds.map((round) => {
    const bracketsInRound = byRound.get(round)!;
    const roundIdx = round - minRound;

    // Geometry
    const xs = bracketsInRound.map((b) => b.position.x);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const startX = minX - COL_PAD;
    const endX = maxX + NODE_WIDTH_EST + COL_PAD;

    // Label
    let label: string;
    if (sortedStructureRows && sortedStructureRows[roundIdx]?.cupRound) {
      label = sortedStructureRows[roundIdx]!.cupRound;
    } else {
      const firstWithLabel = bracketsInRound.find((b) => b.roundLabel);
      if (firstWithLabel?.roundLabel) {
        label = firstWithLabel.roundLabel;
      } else {
        const firstTitle = bracketsInRound[0]?.title ?? '';
        const dotIdx = firstTitle.indexOf(' · ');
        label = dotIdx >= 0 ? firstTitle.slice(0, dotIdx) : firstTitle || `Round ${round}`;
      }
    }

    return { round, label, startX, endX };
  });
}

/** Returns the X positions of dividers between adjacent columns (in canvas coords). */
export function deriveDividerX(columns: RoundColumn[]): number[] {
  const dividers: number[] = [];
  for (let i = 1; i < columns.length; i++) {
    const prev = columns[i - 1]!;
    const curr = columns[i]!;
    dividers.push((prev.endX + curr.startX) / 2);
  }
  return dividers;
}
