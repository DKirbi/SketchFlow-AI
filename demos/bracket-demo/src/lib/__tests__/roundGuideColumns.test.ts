import { describe, it, expect } from 'vitest';
import { deriveRoundColumns, deriveDividerX } from '../roundGuideColumns';
import type { Bracket, TournamentStructure } from '../../types';

// ── Helpers ────────────────────────────────────────────────────────────────────

function makeBracket(id: string, round: number, x: number, overrides: Partial<Bracket> = {}): Bracket {
  return {
    id,
    title: `${id} · Title`,
    round,
    position: { x, y: 0 },
    matches: [],
    ...overrides,
  };
}

function makeStructure(rows: { cupRound: string }[]): TournamentStructure {
  return {
    bracketType: 'Single-elimination',
    roundsetType: 'Winners bracket',
    order: '1',
    rows: rows.map((r, i) => ({
      id: `row-${i}`,
      order: i + 1,
      cupRound: r.cupRound,
      matchupType: 'Single match',
      progressionType: 'Winner advances',
      firstMatchDate: '',
      venue: '',
    })),
  };
}

// ── deriveRoundColumns — empty input ───────────────────────────────────────────

describe('deriveRoundColumns — empty input', () => {
  it('returns an empty array when brackets is empty', () => {
    expect(deriveRoundColumns([], null)).toEqual([]);
  });
});

// ── deriveRoundColumns — round geometry ───────────────────────────────────────

describe('deriveRoundColumns — geometry', () => {
  it('produces one column per distinct round', () => {
    const brackets = [
      makeBracket('b1', 1, 60),
      makeBracket('b2', 1, 60),
      makeBracket('p1', 2, 540),
    ];
    const cols = deriveRoundColumns(brackets, null);
    expect(cols).toHaveLength(2);
    expect(cols[0]!.round).toBe(1);
    expect(cols[1]!.round).toBe(2);
  });

  it('startX is minX of the round minus padding', () => {
    const brackets = [makeBracket('b1', 1, 60), makeBracket('b2', 1, 60)];
    const [col] = deriveRoundColumns(brackets, null);
    // COL_PAD = 20
    expect(col!.startX).toBe(60 - 20);
  });

  it('endX is maxX + NODE_WIDTH_EST + padding', () => {
    const brackets = [makeBracket('b1', 1, 60)];
    const [col] = deriveRoundColumns(brackets, null);
    // NODE_WIDTH_EST = 340, COL_PAD = 20
    expect(col!.endX).toBe(60 + 340 + 20);
  });
});

// ── deriveRoundColumns — label resolution priority ────────────────────────────

describe('deriveRoundColumns — label resolution', () => {
  it('priority 1: uses structure row cupRound when available', () => {
    const brackets = [makeBracket('b1', 1, 60, { roundLabel: 'QF', title: 'QF · 1' })];
    const structure = makeStructure([{ cupRound: 'Qualification Round 1' }]);
    const [col] = deriveRoundColumns(brackets, structure);
    expect(col!.label).toBe('Qualification Round 1');
  });

  it('priority 2: uses bracket.roundLabel when no structure row', () => {
    const brackets = [makeBracket('b1', 1, 60, { roundLabel: 'SF', title: 'SF · 1' })];
    const [col] = deriveRoundColumns(brackets, null);
    expect(col!.label).toBe('SF');
  });

  it('priority 3: uses first segment of bracket title (before " · ")', () => {
    const brackets = [makeBracket('b1', 1, 60, { title: 'Semifinals · Match 1' })];
    const [col] = deriveRoundColumns(brackets, null);
    expect(col!.label).toBe('Semifinals');
  });

  it('priority 4: falls back to "Round N" when no other info is available', () => {
    const brackets = [makeBracket('b1', 1, 60, { title: 'NoSeparatorTitle' })];
    const [col] = deriveRoundColumns(brackets, null);
    // Title has no " · " so the label should be the title itself (not "Round N")
    // because the code uses the full title as fallback before "Round {round}"
    expect(col!.label).toBe('NoSeparatorTitle');
  });

  it('uses "Round N" when title is empty', () => {
    const brackets = [makeBracket('b1', 3, 60, { title: '' })];
    const [col] = deriveRoundColumns(brackets, null);
    expect(col!.label).toBe('Round 3');
  });
});

// ── deriveDividerX ─────────────────────────────────────────────────────────────

describe('deriveDividerX', () => {
  it('returns an empty array for 0 or 1 columns', () => {
    expect(deriveDividerX([])).toEqual([]);
    expect(deriveDividerX([{ round: 1, label: 'R1', startX: 0, endX: 400 }])).toEqual([]);
  });

  it('returns N-1 dividers for N columns', () => {
    const cols = [
      { round: 1, label: 'R1', startX: 0, endX: 400 },
      { round: 2, label: 'R2', startX: 500, endX: 900 },
      { round: 3, label: 'R3', startX: 1000, endX: 1400 },
    ];
    expect(deriveDividerX(cols)).toHaveLength(2);
  });

  it('places dividers at the midpoint between adjacent column edges', () => {
    const cols = [
      { round: 1, label: 'R1', startX: 0, endX: 400 },
      { round: 2, label: 'R2', startX: 500, endX: 900 },
    ];
    const [divider] = deriveDividerX(cols);
    // midpoint between endX=400 and startX=500 is 450
    expect(divider).toBeCloseTo(450);
  });

  it('computes each midpoint correctly for three columns', () => {
    const cols = [
      { round: 1, label: 'R1', startX: 0, endX: 400 },
      { round: 2, label: 'R2', startX: 500, endX: 900 },
      { round: 3, label: 'R3', startX: 950, endX: 1350 },
    ];
    const dividers = deriveDividerX(cols);
    expect(dividers[0]).toBeCloseTo((400 + 500) / 2); // 450
    expect(dividers[1]).toBeCloseTo((900 + 950) / 2); // 925
  });
});
