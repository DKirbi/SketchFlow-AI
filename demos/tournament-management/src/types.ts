import { FILTER_OPTION_ALL } from './constants';

export type FilterAll = typeof FILTER_OPTION_ALL;

export type Role = 'operator' | 'supervisor' | 'admin';

export type BriefSportKey = 'soccer' | 'cricket' | 'tennis';

export interface Sport {
  id: string;
  label: string;
  briefSportKey: BriefSportKey;
}

export interface CategoryRec {
  id: string;
  sportId: string;
  label: string;
}

export interface MonitoringCategoryRec {
  id: string;
  sportId: string;
  categoryId: string;
  label: string;
}

export interface UniqueTournamentRec {
  id: string;
  sportId: string;
  categoryId: string;
  label: string;
}

export type CompetitionType = 'league' | 'cup' | 'neither';

/** Section 4 — Cricket. Brief Section 5 intentionally skipped in product copy. */
export interface CricketInfo {
  matchType: string;
  daysPlayed: string;
  overs: string;
  mandatoryPowerplay: string;
  maxOversPerBowler: string;
  battingPowerplay: string;
  reviews: string;
}

/** Section 6 — Racket sports. */
export interface TennisInfo {
  tennisStartTime: string;
  tennisEndTime: string;
  surface: string;
  numPlayers: string;
  bestOf: string;
  qualificationRounds: string;
}

export interface SimpleTournament {
  id: string;
  sportId: string;
  categoryId: string;
  monitoringCategoryId: string;
  /** Optional cross-season grouping; empty string when unlinked */
  uniqueTournamentId: string;
  name: string;
  startTime: string;
  endTime: string;
  competitionType: CompetitionType;
  addedToImport: boolean;
  scoutProposalVisible: boolean;
  disabled: boolean;
  venueId: string;
  reducedAttendance: boolean;
  defaultTimezone: string;
  prizeMoney: string;
  prizeCurrency: string;
  /** Part of "Only running" mocked filter */
  running: boolean;
  cricket?: CricketInfo;
  tennis?: TennisInfo;
}

export interface ChangelogEntry {
  id: string;
  timestamp: string;
  userHandle: string;
  userRole: Role;
  entityId: string;
  action: string;
  summary: string;
}

export interface TournamentFilters {
  nameOrId: string;
  sportId: string | FilterAll;
  categoryId: string | FilterAll;
  uniqueTournamentId: string | FilterAll;
  dateFrom: string;
  dateTo: string;
  onlyRunning: boolean;
  /** Demo-only: next modal save/move/remove fails once */
  demoFailNextMutation: boolean;
}

export type ModalMode = 'create' | 'clone' | 'edit';

export interface TournamentFormSnapshot {
  sportId: string;
  categoryId: string;
  monitoringCategoryId: string;
  uniqueTournamentId: string;
  name: string;
  startTime: string;
  endTime: string;
  competitionType: CompetitionType;
  addedToImport: boolean;
  scoutProposalVisible: boolean;
  disabled: boolean;
  venueId: string;
  reducedAttendance: boolean;
  defaultTimezone: string;
  prizeMoney: string;
  prizeCurrency: string;
  cricketMatchType: string;
  cricketDaysPlayed: string;
  cricketOvers: string;
  cricketMandatoryPowerplay: string;
  cricketMaxOversPerBowler: string;
  cricketBattingPowerplay: string;
  cricketReviews: string;
  tennisStart: string;
  tennisEnd: string;
  tennisSurface: string;
  tennisNumPlayers: string;
  tennisBestOf: string;
  tennisQualRounds: string;
}
