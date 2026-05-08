import type { Bracket, Progression } from '../types';

export interface TreeLayoutOptions {
  baseX?: number;
  baseY?: number;
  /** Vertical distance between leaf (round-1) nodes */
  leafSpacing?: number;
  /** Horizontal distance between round columns */
  columnSpacing?: number;
}

/**
 * Lay out brackets for a single-elimination tree.
 *
 * Leaves (min round) are stacked vertically in their original order.
 * Each parent bracket is vertically centered between the two feeders
 * targeting it (derived from progressions).
 *
 * Returns new bracket objects with updated `position`; does not mutate inputs.
 */
export function layoutSingleElimination(
  brackets: Bracket[],
  progressions: Progression[],
  options: TreeLayoutOptions = {},
): Bracket[] {
  const { baseX = 60, baseY = 60, leafSpacing = 250, columnSpacing = 480 } = options;

  if (brackets.length === 0) return [];

  const minRound = Math.min(...brackets.map((b) => b.round));
  const maxRound = Math.max(...brackets.map((b) => b.round));

  // Group brackets by round
  const byRound = new Map<number, Bracket[]>();
  for (const b of brackets) {
    const list = byRound.get(b.round) ?? [];
    list.push(b);
    byRound.set(b.round, list);
  }

  // Build: destBracketId → list of fromBracketIds feeding into it
  const feeders = new Map<string, string[]>();
  for (const p of progressions) {
    const r = p.rules[0];
    if (!r) continue;
    const list = feeders.get(r.toBracketId) ?? [];
    if (!list.includes(r.fromBracketId)) list.push(r.fromBracketId);
    feeders.set(r.toBracketId, list);
  }

  // Track computed y position for each bracket
  const yMap = new Map<string, number>();

  // Assign stable positions to leaves.
  // Offset the first leaf by leafSpacing/2 so the top and bottom margins
  // match half the inter-bracket gap, giving a visually balanced rhythm.
  const leaves = byRound.get(minRound) ?? [];
  const leafOriginY = baseY + leafSpacing / 2;
  for (let i = 0; i < leaves.length; i++) {
    yMap.set(leaves[i]!.id, leafOriginY + i * leafSpacing);
  }

  // For each subsequent round, center bracket between its feeders
  for (let r = minRound + 1; r <= maxRound; r++) {
    const roundBrackets = byRound.get(r) ?? [];
    // Track fallback index for orphaned brackets in this round
    let fallbackIdx = 0;
    for (const b of roundBrackets) {
      const feederIds = feeders.get(b.id) ?? [];
      const knownYs = feederIds
        .map((fid) => yMap.get(fid))
        .filter((y): y is number => y !== undefined);

      let y: number;
      if (knownYs.length > 0) {
        y = knownYs.reduce((sum, v) => sum + v, 0) / knownYs.length;
      } else {
        // Orphan: space sequentially near the center of this round's expected range
        const leafCount = leaves.length;
        const totalHeight = (leafCount - 1) * leafSpacing;
        y = leafOriginY + totalHeight / 2 + fallbackIdx * leafSpacing;
        fallbackIdx++;
      }
      yMap.set(b.id, y);
    }
  }

  return brackets.map((b) => {
    const colIndex = b.round - minRound;
    const x = baseX + colIndex * columnSpacing;
    const y = yMap.get(b.id) ?? baseY;
    if (b.position.x === x && b.position.y === y) return b;
    return { ...b, position: { x, y } };
  });
}
