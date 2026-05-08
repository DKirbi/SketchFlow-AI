import { describe, it, expect } from 'vitest';
import { layoutSingleElimination } from '../bracketTreeLayout';
import type { Bracket, Progression } from '../../types';

// ── Helpers ────────────────────────────────────────────────────────────────────

function makeBracket(id: string, round: number): Bracket {
  return {
    id,
    title: id,
    round,
    position: { x: 0, y: 0 },
    matches: [{ id: `${id}-m1`, teamA: null, teamB: null, status: 'SCHEDULED' }],
  };
}

function makeProgression(fromBracketId: string, toBracketId: string): Progression {
  return {
    id: `prog-${fromBracketId}-to-${toBracketId}`,
    rules: [
      {
        fromBracketId,
        fromMatchId: `${fromBracketId}-m1`,
        toBracketId,
        toMatchId: `${toBracketId}-m1`,
        toSlot: 'teamA',
        trigger: 'AFTER_MATCH_END',
        condition: 'WINNER',
      },
    ],
  };
}

// ── Empty input ────────────────────────────────────────────────────────────────

describe('layoutSingleElimination — empty input', () => {
  it('returns an empty array when no brackets are provided', () => {
    expect(layoutSingleElimination([], [], {})).toEqual([]);
  });
});

// ── Single bracket ─────────────────────────────────────────────────────────────

describe('layoutSingleElimination — single bracket', () => {
  it('positions the bracket at (baseX, baseY + leafSpacing/2)', () => {
    const bracket = makeBracket('b1', 1);
    const [result] = layoutSingleElimination([bracket], [], {
      baseX: 60,
      baseY: 80,
      leafSpacing: 320,
    });
    expect(result!.position.x).toBe(60);
    expect(result!.position.y).toBe(80 + 320 / 2); // 240
  });
});

// ── Leaf spacing (round 1) ─────────────────────────────────────────────────────

describe('layoutSingleElimination — leaf spacing', () => {
  it('stacks round-1 brackets vertically at exactly leafSpacing apart', () => {
    const brackets = [makeBracket('b1', 1), makeBracket('b2', 1), makeBracket('b3', 1)];
    const opts = { baseX: 0, baseY: 0, leafSpacing: 200, columnSpacing: 500 };
    const result = layoutSingleElimination(brackets, [], opts);

    const ys = result.filter((b) => b.round === 1).map((b) => b.position.y);
    expect(ys[1]! - ys[0]!).toBeCloseTo(200);
    expect(ys[2]! - ys[1]!).toBeCloseTo(200);
  });

  it('places all round-1 brackets in the first column (x = baseX)', () => {
    const brackets = [makeBracket('b1', 1), makeBracket('b2', 1)];
    const result = layoutSingleElimination(brackets, [], { baseX: 60 });
    for (const b of result.filter((b) => b.round === 1)) {
      expect(b.position.x).toBe(60);
    }
  });
});

// ── Column spacing ─────────────────────────────────────────────────────────────

describe('layoutSingleElimination — column spacing', () => {
  it('places round-2 brackets one columnSpacing to the right of round-1', () => {
    const b1 = makeBracket('b1', 1);
    const b2 = makeBracket('b2', 1);
    const parent = makeBracket('p1', 2);
    const progs = [makeProgression('b1', 'p1'), makeProgression('b2', 'p1')];
    const opts = { baseX: 60, baseY: 0, leafSpacing: 200, columnSpacing: 480 };
    const result = layoutSingleElimination([b1, b2, parent], progs, opts);

    const r1Xs = result.filter((b) => b.round === 1).map((b) => b.position.x);
    const r2Xs = result.filter((b) => b.round === 2).map((b) => b.position.x);
    for (const x1 of r1Xs) expect(x1).toBe(60);
    for (const x2 of r2Xs) expect(x2).toBe(60 + 480);
  });
});

// ── Parent centering ───────────────────────────────────────────────────────────

describe('layoutSingleElimination — parent centering', () => {
  it('centers a parent bracket between its two feeder Y positions', () => {
    const b1 = makeBracket('b1', 1);
    const b2 = makeBracket('b2', 1);
    const parent = makeBracket('p1', 2);
    const progs = [makeProgression('b1', 'p1'), makeProgression('b2', 'p1')];
    const opts = { baseX: 0, baseY: 0, leafSpacing: 300 };
    const result = layoutSingleElimination([b1, b2, parent], progs, opts);

    const r1 = result.filter((b) => b.round === 1).sort((a, b) => a.position.y - b.position.y);
    const p = result.find((b) => b.id === 'p1')!;
    const expectedY = (r1[0]!.position.y + r1[1]!.position.y) / 2;
    expect(p.position.y).toBeCloseTo(expectedY);
  });

  it('centers a parent between three feeders (average)', () => {
    const b1 = makeBracket('b1', 1);
    const b2 = makeBracket('b2', 1);
    const b3 = makeBracket('b3', 1);
    const parent = makeBracket('p1', 2);
    const progs = [
      makeProgression('b1', 'p1'),
      makeProgression('b2', 'p1'),
      makeProgression('b3', 'p1'),
    ];
    const opts = { baseX: 0, baseY: 0, leafSpacing: 200 };
    const result = layoutSingleElimination([b1, b2, b3, parent], progs, opts);

    const r1 = result.filter((b) => b.round === 1).sort((a, b) => a.position.y - b.position.y);
    const p = result.find((b) => b.id === 'p1')!;
    const ys = r1.map((b) => b.position.y);
    const avg = ys.reduce((s, v) => s + v, 0) / ys.length;
    expect(p.position.y).toBeCloseTo(avg);
  });
});

// ── Orphan handling ────────────────────────────────────────────────────────────

describe('layoutSingleElimination — orphan brackets', () => {
  it('places an orphan round-2 bracket near the vertical centre without crashing', () => {
    // A round-2 bracket with no progressions pointing to it
    const b1 = makeBracket('b1', 1);
    const orphan = makeBracket('orphan', 2);
    // No progressions
    const result = layoutSingleElimination([b1, orphan], [], {
      baseX: 0,
      baseY: 0,
      leafSpacing: 200,
      columnSpacing: 480,
    });
    const orphanNode = result.find((b) => b.id === 'orphan')!;
    expect(orphanNode).toBeDefined();
    // x should be columnSpacing ahead of round-1
    expect(orphanNode.position.x).toBe(480);
  });
});

// ── Does not mutate input ──────────────────────────────────────────────────────

describe('layoutSingleElimination — immutability', () => {
  it('does not mutate the original bracket objects', () => {
    const bracket = makeBracket('b1', 1);
    const original = { ...bracket.position };
    layoutSingleElimination([bracket], [], { baseX: 999, baseY: 999 });
    expect(bracket.position.x).toBe(original.x);
    expect(bracket.position.y).toBe(original.y);
  });
});
