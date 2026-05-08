export interface Team {
  id: string;
  name: string;
  /** Seeding position within the tournament (e.g. 1 for top seed) */
  seed?: number;
}

export type MatchStatus = 'SCHEDULED' | 'LIVE' | 'FINISHED';

export interface Match {
  id: string;
  teamA: Team | null;
  teamB: Team | null;
  status: MatchStatus;
  winner?: Team;
  /** Human-readable placeholder when team is not yet determined */
  teamAPlaceholder?: string;
  teamBPlaceholder?: string;
  /** Team faces no opponent — auto-advances to next round */
  isBye?: boolean;
  /** User-facing match id (e.g. ID474339) for bracket cards / exports */
  displayId?: string;
  /** Compact label on match cards (e.g. QF-A1, GA3) */
  shortLabel?: string;
  /** Full human-readable match title (e.g. "Round 64 Match 1", "Quarterfinal Match 2") */
  matchTitleFull?: string;
  /** ISO start time from feed (e.g. tennis) */
  scheduledAt?: string;
  /** Calendar week from feed */
  week?: number;
  /** Display name for arena / stadium (from feed or structure) */
  venueName?: string;
  /** Court name within the venue (e.g. "Court Philippe-Chatrier") */
  courtName?: string;
  /** Tennis-style score string, winner first (e.g. "6-4, 3-6, 7-6(4)") */
  score?: string;
}

export interface Bracket {
  id: string;
  title: string;
  round: number;
  matches: Match[];
  /** Full participant list (used for group-stage display) */
  participants?: Team[];
  /** Position on the canvas */
  position: { x: number; y: number };
  /** Optional visible id for bracket (treatment / integrations) */
  displayId?: string;
  /** Human-readable round name from structure setup (e.g. "Quarterfinals") */
  roundLabel?: string;
}

export type ProgressionTrigger = 'AFTER_MATCH_END';
export type ProgressionCondition = 'WINNER' | 'LOSER';
export type ProgressionSlot = 'teamA' | 'teamB';

export interface ProgressionRule {
  fromBracketId: string;
  fromMatchId: string;
  toBracketId: string;
  toMatchId: string;
  toSlot: ProgressionSlot;
  trigger: ProgressionTrigger;
  condition: ProgressionCondition;
}

export interface Progression {
  id: string;
  rules: ProgressionRule[];
}

export interface TournamentEntrant {
  id: string;
  name: string;
  /** ISO timestamp of their earliest known match */
  firstMatchAt?: string;
  /** Calendar week of their earliest match */
  week?: number;
}

export interface Tournament {
  id: string;
  sport: string;
  name: string;
  /** Season label shown in structure setup / header (e.g. 2025/26) */
  season?: string;
  brackets: Bracket[];
  progressions: Progression[];
  /** Full list of tournament entrants (players / teams) */
  entrants?: TournamentEntrant[];
}

/** One row in the structure-setup roundset table */
export interface RoundsetRow {
  id: string;
  order: number;
  cupRound: string;
  matchupType: string;
  progressionType: string;
  firstMatchDate: string;
  venue: string;
}

/** Captured from step 1 — structure setup */
export interface TournamentStructure {
  bracketType: string;
  roundsetType: string;
  order: string;
  rows: RoundsetRow[];
}
