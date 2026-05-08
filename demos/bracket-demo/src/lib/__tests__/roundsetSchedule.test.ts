import { describe, it, expect } from 'vitest';
import {
  scheduledAtFromRoundsetDate,
  scheduleFromEntrantPair,
  applyRoundsetRowsToBrackets,
} from '../roundsetSchedule';
import type { Bracket, RoundsetRow, TournamentEntrant } from '../../types';

// ── Helpers ────────────────────────────────────────────────────────────────────

function makeRow(overrides: Partial<RoundsetRow> = {}): RoundsetRow {
  return {
    id: 'row-1',
    order: 1,
    cupRound: 'QF',
    matchupType: 'Single match',
    progressionType: 'Winner advances',
    firstMatchDate: '',
    venue: '',
    ...overrides,
  };
}

function makeBracket(round: number, overrides: Partial<Bracket> = {}): Bracket {
  return {
    id: `bracket-r${round}`,
    title: `Round ${round}`,
    round,
    position: { x: 0, y: 0 },
    matches: [
      { id: `match-r${round}-1`, teamA: null, teamB: null, status: 'SCHEDULED' },
    ],
    ...overrides,
  };
}

function makeEntrant(id: string, firstMatchAt?: string, week?: number): TournamentEntrant {
  return { id, name: id, firstMatchAt, week };
}

// ── scheduledAtFromRoundsetDate ────────────────────────────────────────────────

describe('scheduledAtFromRoundsetDate', () => {
  it('returns undefined for an empty string', () => {
    expect(scheduledAtFromRoundsetDate('')).toBeUndefined();
  });

  it('returns undefined for a whitespace-only string', () => {
    expect(scheduledAtFromRoundsetDate('   ')).toBeUndefined();
  });

  it('returns undefined for an unparseable date string', () => {
    expect(scheduledAtFromRoundsetDate('not-a-date')).toBeUndefined();
    expect(scheduledAtFromRoundsetDate('32.13.2025')).toBeUndefined();
  });

  it('returns an ISO string for a valid ISO date input', () => {
    const result = scheduledAtFromRoundsetDate('2026-05-01');
    expect(result).toBeTruthy();
    expect(result).toContain('2026-05-01');
  });

  it('returns an ISO string for a valid datetime input', () => {
    const result = scheduledAtFromRoundsetDate('2026-05-01T14:00:00Z');
    expect(result).toBe('2026-05-01T14:00:00.000Z');
  });
});

// ── scheduleFromEntrantPair ────────────────────────────────────────────────────

describe('scheduleFromEntrantPair', () => {
  it('returns empty object when neither entrant has a firstMatchAt', () => {
    const a = makeEntrant('a');
    const b = makeEntrant('b');
    expect(scheduleFromEntrantPair(a, b)).toEqual({});
  });

  it('returns scheduledAt from entrant A when only A has a date', () => {
    const a = makeEntrant('a', '2026-01-10T10:00:00Z', 2);
    const b = makeEntrant('b');
    const result = scheduleFromEntrantPair(a, b);
    expect(result.scheduledAt).toBe('2026-01-10T10:00:00Z');
    expect(result.week).toBe(2);
  });

  it('returns scheduledAt from entrant B when only B has a date', () => {
    const a = makeEntrant('a');
    const b = makeEntrant('b', '2026-02-05T08:00:00Z', 5);
    const result = scheduleFromEntrantPair(a, b);
    expect(result.scheduledAt).toBe('2026-02-05T08:00:00Z');
    expect(result.week).toBe(5);
  });

  it('picks the earlier date when both entrants have a firstMatchAt', () => {
    const a = makeEntrant('a', '2026-03-20T09:00:00Z', 12);
    const b = makeEntrant('b', '2026-03-15T09:00:00Z', 11);
    const result = scheduleFromEntrantPair(a, b);
    expect(result.scheduledAt).toBe('2026-03-15T09:00:00Z');
    expect(result.week).toBe(11);
  });

  it('works with only entrant A (no B)', () => {
    const a = makeEntrant('a', '2026-04-01T00:00:00Z', 13);
    const result = scheduleFromEntrantPair(a);
    expect(result.scheduledAt).toBe('2026-04-01T00:00:00Z');
    expect(result.week).toBe(13);
  });

  it('omits week from the result when no entrant carries a week', () => {
    const a = makeEntrant('a', '2026-01-01T00:00:00Z');
    const result = scheduleFromEntrantPair(a);
    expect(result.week).toBeUndefined();
  });
});

// ── applyRoundsetRowsToBrackets ────────────────────────────────────────────────

describe('applyRoundsetRowsToBrackets', () => {
  it('returns brackets unchanged when no rows are provided', () => {
    const brackets = [makeBracket(1)];
    const result = applyRoundsetRowsToBrackets(brackets, []);
    expect(result[0]!.matches[0]!.scheduledAt).toBeUndefined();
    expect(result[0]!.matches[0]!.venueName).toBeUndefined();
  });

  it('attaches scheduledAt to all matches in the corresponding round', () => {
    const bracket = makeBracket(1);
    const row = makeRow({ firstMatchDate: '2026-06-01', venue: '' });
    const result = applyRoundsetRowsToBrackets([bracket], [row]);
    expect(result[0]!.matches[0]!.scheduledAt).toContain('2026-06-01');
  });

  it('attaches venueName to all matches in the corresponding round', () => {
    const bracket = makeBracket(1);
    const row = makeRow({ firstMatchDate: '', venue: 'Wembley Stadium' });
    const result = applyRoundsetRowsToBrackets([bracket], [row]);
    expect(result[0]!.matches[0]!.venueName).toBe('Wembley Stadium');
  });

  it('attaches both scheduledAt and venueName when both are present', () => {
    const bracket = makeBracket(1);
    const row = makeRow({ firstMatchDate: '2026-07-15', venue: 'Stade Roland Garros' });
    const result = applyRoundsetRowsToBrackets([bracket], [row]);
    expect(result[0]!.matches[0]!.scheduledAt).toContain('2026-07-15');
    expect(result[0]!.matches[0]!.venueName).toBe('Stade Roland Garros');
  });

  it('leaves a bracket unchanged when its round index exceeds the rows length', () => {
    const bracket = makeBracket(3); // round 3, but only 2 rows
    const rows = [makeRow({ order: 1 }), makeRow({ order: 2 })];
    const result = applyRoundsetRowsToBrackets([bracket], rows);
    expect(result[0]!.matches[0]!.scheduledAt).toBeUndefined();
    expect(result[0]!.matches[0]!.venueName).toBeUndefined();
  });

  it('applies different rows to different rounds independently', () => {
    const b1 = makeBracket(1);
    const b2 = makeBracket(2);
    const rows = [
      makeRow({ order: 1, firstMatchDate: '2026-01-01', venue: 'Arena A' }),
      makeRow({ order: 2, firstMatchDate: '2026-02-01', venue: 'Arena B' }),
    ];
    const result = applyRoundsetRowsToBrackets([b1, b2], rows);
    expect(result[0]!.matches[0]!.venueName).toBe('Arena A');
    expect(result[1]!.matches[0]!.venueName).toBe('Arena B');
  });

  it('does not mutate the original bracket objects', () => {
    const bracket = makeBracket(1);
    const originalMatch = { ...bracket.matches[0] };
    const row = makeRow({ firstMatchDate: '2026-06-01', venue: 'Test' });
    applyRoundsetRowsToBrackets([bracket], [row]);
    expect(bracket.matches[0]!.scheduledAt).toBeUndefined();
    expect(bracket.matches[0]!.venueName).toBe(originalMatch.venueName);
  });

  it('skips attaching when the date is invalid and venue is blank', () => {
    const bracket = makeBracket(1);
    const row = makeRow({ firstMatchDate: 'not-a-date', venue: '  ' });
    const result = applyRoundsetRowsToBrackets([bracket], [row]);
    // Invalid date → scheduledAtFromRoundsetDate returns undefined
    // Blank venue → venueName not set
    expect(result[0]!.matches[0]!.scheduledAt).toBeUndefined();
    expect(result[0]!.matches[0]!.venueName).toBeUndefined();
  });
});
