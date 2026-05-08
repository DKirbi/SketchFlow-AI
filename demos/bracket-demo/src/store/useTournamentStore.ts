import { create } from 'zustand';
import {
  tennisMockTournament,
  finishedTennisMockTournament,
  tennisMockOverlayMap,
  finishAllMatches,
  TENNIS_TOURNAMENT_ID,
} from '../data/tennisTournament';
import {
  generateMatchDisplayId,
  shortLabelForMatch,
  seedAllBracketMatchMeta,
} from '../lib/matchDisplay';
import { buildSingleEliminationFromEntrants } from '../lib/singleEliminationBuilder';
import { applyRoundsetRowsToBrackets } from '../lib/roundsetSchedule';
import type {
  Tournament,
  Bracket,
  Match,
  MatchStatus,
  Team,
  Progression,
  ProgressionRule,
  TournamentEntrant,
  TournamentStructure,
} from '../types';

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

function placeholderName(condition: 'WINNER' | 'LOSER', matchId: string, brackets: Bracket[]): string {
  for (const b of brackets) {
    const m = b.matches.find((m) => m.id === matchId);
    if (m) {
      const label = condition === 'WINNER' ? 'Winner' : 'Loser';
      const teams = [m.teamA?.name ?? m.teamAPlaceholder, m.teamB?.name ?? m.teamBPlaceholder]
        .filter(Boolean)
        .join(' vs ');
      return `TBD — ${label} of (${teams || matchId})`;
    }
  }
  return `TBD — ${condition} of ${matchId}`;
}

export type Scenario = 'placeholders' | 'finished';

interface TournamentState {
  scenario: Scenario;
  setScenario: (s: Scenario) => void;

  tournament: Tournament;
  tournamentStructure: TournamentStructure | null;

  applyGenerateFromStructure: (input: {
    sport: string;
    name: string;
    season: string;
    structure: TournamentStructure;
  }) => void;

  applyGenerateFinishedFromStructure: (input: {
    sport: string;
    name: string;
    season: string;
    structure: TournamentStructure;
  }) => void;

  setEntrants: (entrants: TournamentEntrant[]) => void;

  addProgression: (rules: ProgressionRule[], newBracketTitle?: string) => void;
  editProgression: (id: string, rules: ProgressionRule[]) => void;
  deleteProgression: (id: string) => void;

  advanceMatchStatus: (bracketId: string, matchId: string) => void;
  setWinner: (bracketId: string, matchId: string, winner: Team) => void;
  updateBracketPosition: (bracketId: string, x: number, y: number) => void;

  addBracket: (bracket: Bracket) => void;
  updateBracket: (bracketId: string, updates: { participants?: Team[]; matches?: Match[] }) => void;
}

export const useTournamentStore = create<TournamentState>((set) => ({
  scenario: 'placeholders',
  setScenario(s) {
    set({
      scenario: s,
      tournament: s === 'finished' ? finishedTennisMockTournament : tennisMockTournament,
      tournamentStructure: null,
    });
  },

  tournament: tennisMockTournament,
  tournamentStructure: null,

  applyGenerateFromStructure({ sport, name, season, structure }) {
    set((state) => {
      const t = state.tournament;
      const isSingleElim =
        structure.bracketType === 'Single-elimination' ||
        structure.bracketType === 'Single-elimination, dynamic';

      if (isSingleElim && t.entrants && t.entrants.length >= 2) {
        const sortedRows = structure.rows.slice().sort((a, b) => a.order - b.order);
        const roundLabels = sortedRows.map((r) => r.cupRound);

        const overlayMap = t.id === TENNIS_TOURNAMENT_ID ? tennisMockOverlayMap : undefined;
        const { brackets: builtBrackets, progressions } = buildSingleEliminationFromEntrants(
          t.entrants,
          t.id,
          roundLabels,
          overlayMap,
        );
        const brackets = applyRoundsetRowsToBrackets(builtBrackets, sortedRows);

        return {
          tournamentStructure: structure,
          tournament: {
            ...t,
            sport,
            name,
            season: season.trim() || undefined,
            brackets,
            progressions,
          },
        };
      }

      // Non-single-elim or no entrants: preserve existing brackets, just update meta.
      const brackets = seedAllBracketMatchMeta(t.brackets);
      return {
        tournamentStructure: structure,
        tournament: {
          ...t,
          sport,
          name,
          season: season.trim() || undefined,
          brackets,
        },
      };
    });
  },

  applyGenerateFinishedFromStructure({ sport, name, season, structure }) {
    set((state) => {
      const t = state.tournament;
      const isSingleElim =
        structure.bracketType === 'Single-elimination' ||
        structure.bracketType === 'Single-elimination, dynamic';

      let baseTournament: Tournament;

      if (isSingleElim && t.entrants && t.entrants.length >= 2) {
        const sortedRows = structure.rows.slice().sort((a, b) => a.order - b.order);
        const roundLabels = sortedRows.map((r) => r.cupRound);

        const overlayMap = t.id === TENNIS_TOURNAMENT_ID ? tennisMockOverlayMap : undefined;
        const { brackets: builtBrackets, progressions } = buildSingleEliminationFromEntrants(
          t.entrants,
          t.id,
          roundLabels,
          overlayMap,
        );
        const brackets = applyRoundsetRowsToBrackets(builtBrackets, sortedRows);

        baseTournament = {
          ...t,
          sport,
          name,
          season: season.trim() || undefined,
          brackets,
          progressions,
        };
      } else {
        const brackets = seedAllBracketMatchMeta(t.brackets);
        baseTournament = {
          ...t,
          sport,
          name,
          season: season.trim() || undefined,
          brackets,
        };
      }

      return {
        scenario: 'finished',
        tournamentStructure: structure,
        tournament: finishAllMatches(baseTournament),
      };
    });
  },

  setEntrants(entrants) {
    set((state) => ({
      tournament: { ...state.tournament, entrants },
    }));
  },

  addProgression(rules, newBracketTitle) {
    set((state) => {
      const t = state.tournament;
      const progressionId = uid();

      let updatedBrackets = [...t.brackets];

      // Collect unique destination bracket IDs from all rules
      const destBracketIds = [...new Set(rules.map((r) => r.toBracketId))];

      for (const destId of destBracketIds) {
        const exists = updatedBrackets.find((b) => b.id === destId);
        if (!exists) {
          // Auto-create the new bracket
          const sourceBracket = updatedBrackets.find(
            (b) => b.id === rules.find((r) => r.toBracketId === destId)?.fromBracketId
          );
          const newRound = sourceBracket ? sourceBracket.round + 1 : 2;
          const xOffset = 480;
          const sourceX = sourceBracket?.position.x ?? 60;
          const sourceY = sourceBracket?.position.y ?? 200;

          const newBracket: Bracket = {
            id: destId,
            title: newBracketTitle ?? `Round ${newRound} — Finals`,
            round: newRound,
            position: { x: sourceX + xOffset, y: sourceY },
            matches: [],
          };
          updatedBrackets = [...updatedBrackets, newBracket];
        }
      }

      // Apply each rule: create or update the target match slot
      for (const rule of rules) {
        updatedBrackets = updatedBrackets.map((b) => {
          if (b.id !== rule.toBracketId) return b;

          let match = b.matches.find((m) => m.id === rule.toMatchId);

          if (!match) {
            match = {
              id: rule.toMatchId,
              teamA: null,
              teamB: null,
              status: 'SCHEDULED' as MatchStatus,
              displayId: generateMatchDisplayId(),
              shortLabel: shortLabelForMatch(b, b.matches.length),
            };
          }

          // Check if source match already has a winner/result to resolve immediately
          const sourceBracket = updatedBrackets.find((sb) => sb.id === rule.fromBracketId);
          const sourceMatch = sourceBracket?.matches.find((sm) => sm.id === rule.fromMatchId);

          let resolvedTeam: Team | null = null;
          if (sourceMatch?.status === 'FINISHED' && sourceMatch.winner) {
            if (rule.condition === 'WINNER') {
              resolvedTeam = sourceMatch.winner;
            } else {
              const loser =
                sourceMatch.teamA?.id === sourceMatch.winner.id
                  ? sourceMatch.teamB
                  : sourceMatch.teamA;
              resolvedTeam = loser ?? null;
            }
          }

          const placeholder = placeholderName(rule.condition, rule.fromMatchId, updatedBrackets);

          const updatedMatch: Match = {
            ...match,
            teamA: rule.toSlot === 'teamA' ? (resolvedTeam ?? match.teamA) : match.teamA,
            teamB: rule.toSlot === 'teamB' ? (resolvedTeam ?? match.teamB) : match.teamB,
            teamAPlaceholder: rule.toSlot === 'teamA' && !resolvedTeam ? placeholder : match.teamAPlaceholder,
            teamBPlaceholder: rule.toSlot === 'teamB' && !resolvedTeam ? placeholder : match.teamBPlaceholder,
          };

          const matchExists = b.matches.some((m) => m.id === rule.toMatchId);
          const updatedMatches = matchExists
            ? b.matches.map((m) => (m.id === rule.toMatchId ? updatedMatch : m))
            : [...b.matches, updatedMatch];

          return { ...b, matches: updatedMatches };
        });
      }

      const newProgression: Progression = { id: progressionId, rules };

      return {
        tournament: {
          ...t,
          brackets: updatedBrackets,
          progressions: [...t.progressions, newProgression],
        },
      };
    });
  },

  editProgression(id, rules) {
    set((state) => {
      const t = state.tournament;
      let updatedBrackets = [...t.brackets];

      // Re-apply rules to update placeholders
      for (const rule of rules) {
        const sourceBracket = updatedBrackets.find((b) => b.id === rule.fromBracketId);
        const sourceMatch = sourceBracket?.matches.find((m) => m.id === rule.fromMatchId);

        let resolvedTeam: Team | null = null;
        if (sourceMatch?.status === 'FINISHED' && sourceMatch.winner) {
          if (rule.condition === 'WINNER') {
            resolvedTeam = sourceMatch.winner;
          } else {
            const loser =
              sourceMatch.teamA?.id === sourceMatch.winner.id
                ? sourceMatch.teamB
                : sourceMatch.teamA;
            resolvedTeam = loser ?? null;
          }
        }

        const placeholder = placeholderName(rule.condition, rule.fromMatchId, updatedBrackets);

        updatedBrackets = updatedBrackets.map((b) => {
          if (b.id !== rule.toBracketId) return b;
          return {
            ...b,
            matches: b.matches.map((m) => {
              if (m.id !== rule.toMatchId) return m;
              return {
                ...m,
                teamA: rule.toSlot === 'teamA' ? (resolvedTeam ?? m.teamA) : m.teamA,
                teamB: rule.toSlot === 'teamB' ? (resolvedTeam ?? m.teamB) : m.teamB,
                teamAPlaceholder:
                  rule.toSlot === 'teamA' && !resolvedTeam ? placeholder : m.teamAPlaceholder,
                teamBPlaceholder:
                  rule.toSlot === 'teamB' && !resolvedTeam ? placeholder : m.teamBPlaceholder,
              };
            }),
          };
        });
      }

      return {
        tournament: {
          ...t,
          brackets: updatedBrackets,
          progressions: t.progressions.map((p) => (p.id === id ? { ...p, rules } : p)),
        },
      };
    });
  },

  deleteProgression(id) {
    set((state) => ({
      tournament: {
        ...state.tournament,
        progressions: state.tournament.progressions.filter((p) => p.id !== id),
      },
    }));
  },

  advanceMatchStatus(bracketId, matchId) {
    const cycle: MatchStatus[] = ['SCHEDULED', 'LIVE', 'FINISHED'];
    set((state) => ({
      tournament: {
        ...state.tournament,
        brackets: state.tournament.brackets.map((b) => {
          if (b.id !== bracketId) return b;
          return {
            ...b,
            matches: b.matches.map((m) => {
              if (m.id !== matchId) return m;
              const idx = cycle.indexOf(m.status);
              const next = cycle[(idx + 1) % cycle.length];
              return { ...m, status: next, winner: next !== 'FINISHED' ? undefined : m.winner };
            }),
          };
        }),
      },
    }));
  },

  setWinner(bracketId, matchId, winner) {
    set((state) => {
      let updatedBrackets = state.tournament.brackets.map((b) => {
        if (b.id !== bracketId) return b;
        return {
          ...b,
          matches: b.matches.map((m) => {
            if (m.id !== matchId) return m;
            return { ...m, status: 'FINISHED' as MatchStatus, winner };
          }),
        };
      });

      // Propagate winner through any matching progressions
      for (const progression of state.tournament.progressions) {
        for (const rule of progression.rules) {
          if (rule.fromBracketId !== bracketId || rule.fromMatchId !== matchId) continue;

          const sourceMatch = updatedBrackets
            .find((b) => b.id === bracketId)
            ?.matches.find((m) => m.id === matchId);

          if (!sourceMatch) continue;

          let resolvedTeam: Team | null = null;
          if (rule.condition === 'WINNER') {
            resolvedTeam = winner;
          } else {
            const loser =
              sourceMatch.teamA?.id === winner.id ? sourceMatch.teamB : sourceMatch.teamA;
            resolvedTeam = loser ?? null;
          }

          if (!resolvedTeam) continue;

          updatedBrackets = updatedBrackets.map((b) => {
            if (b.id !== rule.toBracketId) return b;
            return {
              ...b,
              matches: b.matches.map((m) => {
                if (m.id !== rule.toMatchId) return m;
                return {
                  ...m,
                  teamA: rule.toSlot === 'teamA' ? resolvedTeam : m.teamA,
                  teamB: rule.toSlot === 'teamB' ? resolvedTeam : m.teamB,
                  teamAPlaceholder: rule.toSlot === 'teamA' ? undefined : m.teamAPlaceholder,
                  teamBPlaceholder: rule.toSlot === 'teamB' ? undefined : m.teamBPlaceholder,
                };
              }),
            };
          });
        }
      }

      return { tournament: { ...state.tournament, brackets: updatedBrackets } };
    });
  },

  updateBracketPosition(bracketId, x, y) {
    set((state) => ({
      tournament: {
        ...state.tournament,
        brackets: state.tournament.brackets.map((b) =>
          b.id === bracketId ? { ...b, position: { x, y } } : b
        ),
      },
    }));
  },

  addBracket(bracket) {
    set((state) => ({
      tournament: {
        ...state.tournament,
        brackets: [...state.tournament.brackets, bracket],
      },
    }));
  },

  updateBracket(bracketId, updates) {
    set((state) => ({
      tournament: {
        ...state.tournament,
        brackets: state.tournament.brackets.map((b) =>
          b.id === bracketId ? { ...b, ...updates } : b
        ),
      },
    }));
  },
}));

// Convenience selector
export const selectTournament = (s: TournamentState) => s.tournament;
