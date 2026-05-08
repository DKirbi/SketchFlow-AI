/**
 * Tests for useTournamentStore Zustand actions.
 *
 * Strategy: reset the store to a minimal, fully-controlled tournament before
 * each test so the large tennis/champions mock data never bleeds across cases.
 * We call actions via `getState()` and assert on `getState().tournament` to
 * stay completely in the synchronous Zustand world — no React rendering needed.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { useTournamentStore } from '../useTournamentStore';
import type { Bracket, Match, Progression, Team, Tournament } from '../../types';

// ── Fixture builders ───────────────────────────────────────────────────────────

function makeTeam(id: string, name: string): Team {
  return { id, name };
}

function makeMatch(overrides: Partial<Match> = {}): Match {
  return {
    id: 'match-1',
    teamA: makeTeam('team-a', 'Team A'),
    teamB: makeTeam('team-b', 'Team B'),
    status: 'SCHEDULED',
    ...overrides,
  };
}

function makeBracket(overrides: Partial<Bracket> = {}): Bracket {
  return {
    id: 'bracket-1',
    title: 'Group A',
    round: 1,
    position: { x: 0, y: 0 },
    matches: [makeMatch()],
    ...overrides,
  };
}

function makeProgression(
  fromBracketId: string,
  fromMatchId: string,
  toBracketId: string,
  toMatchId: string,
  condition: 'WINNER' | 'LOSER' = 'WINNER',
): Progression {
  return {
    id: `prog-${fromBracketId}-${toBracketId}`,
    rules: [
      {
        fromBracketId,
        fromMatchId,
        toBracketId,
        toMatchId,
        toSlot: 'teamA',
        trigger: 'AFTER_MATCH_END',
        condition,
      },
    ],
  };
}

function makeTournament(overrides: Partial<Tournament> = {}): Tournament {
  return {
    id: 'test-tournament',
    sport: 'Soccer',
    name: 'Test Cup',
    brackets: [makeBracket()],
    progressions: [],
    ...overrides,
  };
}

/** Replaces store state with a clean tournament for isolation. */
function resetStore(tournament?: Tournament) {
  useTournamentStore.setState({
    scenario: 'placeholders',
    tournament: tournament ?? makeTournament(),
    tournamentStructure: null,
  });
}

// ── advanceMatchStatus ─────────────────────────────────────────────────────────

describe('advanceMatchStatus', () => {
  beforeEach(() => resetStore());

  it('advances SCHEDULED → LIVE', () => {
    useTournamentStore.getState().advanceMatchStatus('bracket-1', 'match-1');
    const match = useTournamentStore.getState().tournament.brackets[0]!.matches[0]!;
    expect(match.status).toBe('LIVE');
  });

  it('advances LIVE → FINISHED', () => {
    resetStore(makeTournament({
      brackets: [makeBracket({ matches: [makeMatch({ status: 'LIVE' })] })],
    }));
    useTournamentStore.getState().advanceMatchStatus('bracket-1', 'match-1');
    const match = useTournamentStore.getState().tournament.brackets[0]!.matches[0]!;
    expect(match.status).toBe('FINISHED');
  });

  it('wraps FINISHED → SCHEDULED and clears winner', () => {
    resetStore(makeTournament({
      brackets: [makeBracket({
        matches: [makeMatch({
          status: 'FINISHED',
          winner: makeTeam('team-a', 'Team A'),
        })],
      })],
    }));
    useTournamentStore.getState().advanceMatchStatus('bracket-1', 'match-1');
    const match = useTournamentStore.getState().tournament.brackets[0]!.matches[0]!;
    expect(match.status).toBe('SCHEDULED');
    expect(match.winner).toBeUndefined();
  });

  it('does not touch other brackets or matches', () => {
    const b2 = makeBracket({ id: 'bracket-2', matches: [makeMatch({ id: 'match-2' })] });
    resetStore(makeTournament({ brackets: [makeBracket(), b2] }));
    useTournamentStore.getState().advanceMatchStatus('bracket-1', 'match-1');
    const b2Match = useTournamentStore.getState().tournament.brackets[1]!.matches[0]!;
    expect(b2Match.status).toBe('SCHEDULED');
  });
});

// ── setWinner ──────────────────────────────────────────────────────────────────

describe('setWinner', () => {
  beforeEach(() => resetStore());

  it('sets the winner and marks the match FINISHED', () => {
    useTournamentStore.getState().setWinner('bracket-1', 'match-1', makeTeam('team-a', 'Team A'));
    const match = useTournamentStore.getState().tournament.brackets[0]!.matches[0]!;
    expect(match.winner?.id).toBe('team-a');
    expect(match.status).toBe('FINISHED');
  });

  it('propagates the WINNER through a linked progression', () => {
    const srcBracket = makeBracket({ id: 'bracket-src' });
    const dstBracket = makeBracket({
      id: 'bracket-dst',
      matches: [makeMatch({ id: 'match-dst', teamA: null, teamB: null })],
    });
    const prog = makeProgression('bracket-src', 'match-1', 'bracket-dst', 'match-dst', 'WINNER');

    resetStore(makeTournament({
      brackets: [srcBracket, dstBracket],
      progressions: [prog],
    }));

    useTournamentStore.getState().setWinner('bracket-src', 'match-1', makeTeam('team-a', 'Team A'));

    const dstMatch = useTournamentStore.getState().tournament.brackets[1]!.matches[0]!;
    expect(dstMatch.teamA?.id).toBe('team-a');
  });

  it('propagates the LOSER through a LOSER progression', () => {
    const srcBracket = makeBracket({ id: 'bracket-src' });
    const dstBracket = makeBracket({
      id: 'bracket-dst',
      matches: [makeMatch({ id: 'match-dst', teamA: null, teamB: null })],
    });
    const prog = makeProgression('bracket-src', 'match-1', 'bracket-dst', 'match-dst', 'LOSER');

    resetStore(makeTournament({
      brackets: [srcBracket, dstBracket],
      progressions: [prog],
    }));

    // Team A wins → Team B is the loser
    useTournamentStore.getState().setWinner('bracket-src', 'match-1', makeTeam('team-a', 'Team A'));

    const dstMatch = useTournamentStore.getState().tournament.brackets[1]!.matches[0]!;
    expect(dstMatch.teamA?.id).toBe('team-b');
  });
});

// ── deleteProgression ──────────────────────────────────────────────────────────

describe('deleteProgression', () => {
  beforeEach(() => resetStore());

  it('removes the progression with the given id', () => {
    const prog = makeProgression('bracket-1', 'match-1', 'bracket-2', 'match-2');
    resetStore(makeTournament({ progressions: [prog] }));
    useTournamentStore.getState().deleteProgression(prog.id);
    expect(useTournamentStore.getState().tournament.progressions).toHaveLength(0);
  });

  it('leaves other progressions intact', () => {
    const prog1 = makeProgression('bracket-1', 'match-1', 'bracket-2', 'match-2');
    const prog2 = { ...makeProgression('bracket-2', 'match-2', 'bracket-3', 'match-3'), id: 'prog-2' };
    resetStore(makeTournament({ progressions: [prog1, prog2] }));
    useTournamentStore.getState().deleteProgression(prog1.id);
    const remaining = useTournamentStore.getState().tournament.progressions;
    expect(remaining).toHaveLength(1);
    expect(remaining[0]!.id).toBe('prog-2');
  });

  it('does nothing when the id does not exist', () => {
    const prog = makeProgression('bracket-1', 'match-1', 'bracket-2', 'match-2');
    resetStore(makeTournament({ progressions: [prog] }));
    useTournamentStore.getState().deleteProgression('non-existent-id');
    expect(useTournamentStore.getState().tournament.progressions).toHaveLength(1);
  });
});

// ── updateBracket ──────────────────────────────────────────────────────────────

describe('updateBracket', () => {
  beforeEach(() => resetStore());

  it('merges new participants into the bracket', () => {
    const newParticipants = [makeTeam('p1', 'Player 1'), makeTeam('p2', 'Player 2')];
    useTournamentStore.getState().updateBracket('bracket-1', { participants: newParticipants });
    const bracket = useTournamentStore.getState().tournament.brackets[0]!;
    expect(bracket.participants).toEqual(newParticipants);
  });

  it('replaces the matches list when new matches are provided', () => {
    const newMatches = [makeMatch({ id: 'new-match', status: 'LIVE' })];
    useTournamentStore.getState().updateBracket('bracket-1', { matches: newMatches });
    const bracket = useTournamentStore.getState().tournament.brackets[0]!;
    expect(bracket.matches).toHaveLength(1);
    expect(bracket.matches[0]!.id).toBe('new-match');
  });

  it('does not affect other brackets', () => {
    const b2 = makeBracket({ id: 'bracket-2', title: 'Group B' });
    resetStore(makeTournament({ brackets: [makeBracket(), b2] }));
    useTournamentStore.getState().updateBracket('bracket-1', { participants: [] });
    const b2After = useTournamentStore.getState().tournament.brackets[1]!;
    expect(b2After.title).toBe('Group B');
  });
});

// ── updateBracketPosition ──────────────────────────────────────────────────────

describe('updateBracketPosition', () => {
  beforeEach(() => resetStore());

  it('updates the bracket position', () => {
    useTournamentStore.getState().updateBracketPosition('bracket-1', 200, 350);
    const bracket = useTournamentStore.getState().tournament.brackets[0]!;
    expect(bracket.position.x).toBe(200);
    expect(bracket.position.y).toBe(350);
  });

  it('does not modify other brackets', () => {
    const b2 = makeBracket({ id: 'bracket-2', position: { x: 500, y: 500 } });
    resetStore(makeTournament({ brackets: [makeBracket(), b2] }));
    useTournamentStore.getState().updateBracketPosition('bracket-1', 999, 999);
    const b2After = useTournamentStore.getState().tournament.brackets[1]!;
    expect(b2After.position.x).toBe(500);
    expect(b2After.position.y).toBe(500);
  });
});

// ── addProgression ─────────────────────────────────────────────────────────────

describe('addProgression', () => {
  beforeEach(() => resetStore());

  it('adds a new progression entry to the store', () => {
    const rule = {
      fromBracketId: 'bracket-1',
      fromMatchId: 'match-1',
      toBracketId: 'bracket-new-abc',
      toMatchId: 'match-new-1',
      toSlot: 'teamA' as const,
      trigger: 'AFTER_MATCH_END' as const,
      condition: 'WINNER' as const,
    };
    useTournamentStore.getState().addProgression([rule], 'Finals');
    const { progressions } = useTournamentStore.getState().tournament;
    expect(progressions).toHaveLength(1);
    expect(progressions[0]!.rules).toHaveLength(1);
  });

  it('auto-creates a new destination bracket when it does not exist', () => {
    const rule = {
      fromBracketId: 'bracket-1',
      fromMatchId: 'match-1',
      toBracketId: 'brand-new-bracket',
      toMatchId: 'brand-new-match',
      toSlot: 'teamA' as const,
      trigger: 'AFTER_MATCH_END' as const,
      condition: 'WINNER' as const,
    };
    useTournamentStore.getState().addProgression([rule], 'Finals');
    const { brackets } = useTournamentStore.getState().tournament;
    const newBracket = brackets.find((b) => b.id === 'brand-new-bracket');
    expect(newBracket).toBeDefined();
    expect(newBracket!.title).toBe('Finals');
  });

  it('does NOT create a duplicate bracket when destination already exists', () => {
    const existingDest = makeBracket({ id: 'bracket-dest', title: 'Existing Dest' });
    resetStore(makeTournament({ brackets: [makeBracket(), existingDest] }));

    const rule = {
      fromBracketId: 'bracket-1',
      fromMatchId: 'match-1',
      toBracketId: 'bracket-dest',
      toMatchId: 'match-1',
      toSlot: 'teamA' as const,
      trigger: 'AFTER_MATCH_END' as const,
      condition: 'WINNER' as const,
    };
    useTournamentStore.getState().addProgression([rule]);
    const { brackets } = useTournamentStore.getState().tournament;
    const destBrackets = brackets.filter((b) => b.id === 'bracket-dest');
    expect(destBrackets).toHaveLength(1);
  });
});

// ── editProgression ────────────────────────────────────────────────────────────

describe('editProgression', () => {
  beforeEach(() => resetStore());

  it('updates the rules on an existing progression', () => {
    const prog = makeProgression('bracket-1', 'match-1', 'bracket-2', 'match-2');
    resetStore(makeTournament({
      brackets: [makeBracket(), makeBracket({ id: 'bracket-2' })],
      progressions: [prog],
    }));

    const newRule = {
      ...prog.rules[0]!,
      condition: 'LOSER' as const,
    };
    useTournamentStore.getState().editProgression(prog.id, [newRule]);

    const updated = useTournamentStore.getState().tournament.progressions[0]!;
    expect(updated.rules[0]!.condition).toBe('LOSER');
  });

  it('does not affect other progressions', () => {
    const prog1 = makeProgression('bracket-1', 'match-1', 'bracket-2', 'match-2');
    const prog2 = { ...makeProgression('bracket-2', 'match-1', 'bracket-3', 'match-3'), id: 'prog-2' };
    resetStore(makeTournament({
      brackets: [makeBracket(), makeBracket({ id: 'bracket-2' }), makeBracket({ id: 'bracket-3' })],
      progressions: [prog1, prog2],
    }));

    useTournamentStore.getState().editProgression(prog1.id, [{ ...prog1.rules[0]!, condition: 'LOSER' }]);

    const remaining = useTournamentStore.getState().tournament.progressions[1]!;
    expect(remaining.rules[0]!.condition).toBe('WINNER');
  });
});
