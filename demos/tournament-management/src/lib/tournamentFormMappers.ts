import {
  categoryById,
  monitoringForCategory,
  sportById,
  uniqueTournamentById,
} from '../data/catalog';
import type { BriefSportKey, SimpleTournament, TournamentFormSnapshot } from '../types';
import { CRICKET_MATCH_TYPES } from './cricketDefaults';

export function isBrowseCategory(navId: string): boolean {
  return navId.startsWith('browse-cat-');
}

export function parseBrowseCategoryId(navId: string): string {
  return navId.slice('browse-cat-'.length);
}

export function isBrowseUt(navId: string): boolean {
  return navId.startsWith('browse-ut-');
}

export function parseBrowseUtId(navId: string): string {
  return navId.slice('browse-ut-'.length);
}

function pickMonitoringCategoryId(categoryId: string): string {
  const m = monitoringForCategory(categoryId);
  if (m.length === 1) return m[0].id;
  return m[0]?.id ?? '';
}

export function tournamentToSnapshot(st: SimpleTournament): TournamentFormSnapshot {
  const ck = sportById(st.sportId)?.briefSportKey ?? 'soccer';
  const cricketFallback = {
    matchType: CRICKET_MATCH_TYPES[0].value,
    daysPlayed: '',
    overs: '',
    mandatoryPowerplay: '',
    maxOversPerBowler: '',
    battingPowerplay: '',
    reviews: '',
  };
  const tennisFallback = {
    tennisStartTime: '',
    tennisEndTime: '',
    surface: 'hardcourtOutdoor',
    numPlayers: '64',
    bestOf: 'bo3',
    qualificationRounds: '0',
  };
  const cricket = ck === 'cricket' && st.cricket ? st.cricket : cricketFallback;
  const tennis = ck === 'tennis' && st.tennis ? st.tennis : tennisFallback;

  return {
    sportId: st.sportId,
    categoryId: st.categoryId,
    monitoringCategoryId: st.monitoringCategoryId,
    uniqueTournamentId: st.uniqueTournamentId,
    name: st.name,
    startTime: st.startTime,
    endTime: st.endTime,
    competitionType: st.competitionType,
    addedToImport: st.addedToImport,
    scoutProposalVisible: st.scoutProposalVisible,
    disabled: st.disabled,
    venueId: st.venueId,
    reducedAttendance: st.reducedAttendance,
    defaultTimezone: st.defaultTimezone,
    prizeMoney: st.prizeMoney,
    prizeCurrency: st.prizeCurrency,
    cricketMatchType: cricket.matchType,
    cricketDaysPlayed: cricket.daysPlayed,
    cricketOvers: cricket.overs,
    cricketMandatoryPowerplay: cricket.mandatoryPowerplay,
    cricketMaxOversPerBowler: cricket.maxOversPerBowler,
    cricketBattingPowerplay: cricket.battingPowerplay,
    cricketReviews: cricket.reviews,
    tennisStart: tennis.tennisStartTime,
    tennisEnd: tennis.tennisEndTime,
    tennisSurface: tennis.surface,
    tennisNumPlayers: tennis.numPlayers,
    tennisBestOf: tennis.bestOf,
    tennisQualRounds: tennis.qualificationRounds,
  };
}

export function emptySnapshot(): TournamentFormSnapshot {
  return {
    sportId: 'sp-soccer',
    categoryId: 'cat-intl-clubs',
    monitoringCategoryId: pickMonitoringCategoryId('cat-intl-clubs'),
    uniqueTournamentId: '',
    name: '',
    startTime: '',
    endTime: '',
    competitionType: 'neither',
    addedToImport: true,
    scoutProposalVisible: false,
    disabled: false,
    venueId: '',
    reducedAttendance: false,
    defaultTimezone: 'Europe/London',
    prizeMoney: '',
    prizeCurrency: '',
    cricketMatchType: CRICKET_MATCH_TYPES[0].value,
    cricketDaysPlayed: '',
    cricketOvers: '',
    cricketMandatoryPowerplay: '',
    cricketMaxOversPerBowler: '',
    cricketBattingPowerplay: '',
    cricketReviews: '',
    tennisStart: '',
    tennisEnd: '',
    tennisSurface: 'grass',
    tennisNumPlayers: '64',
    tennisBestOf: 'bo3',
    tennisQualRounds: '0',
  };
}

export function prefillCreateFromNav(
  base: TournamentFormSnapshot,
  selectedNavId: string | undefined,
): TournamentFormSnapshot {
  if (!selectedNavId) return base;
  if (isBrowseCategory(selectedNavId)) {
    const categoryId = parseBrowseCategoryId(selectedNavId);
    const cat = categoryById(categoryId);
    if (!cat) return base;
    return {
      ...base,
      sportId: cat.sportId,
      categoryId,
      monitoringCategoryId: pickMonitoringCategoryId(categoryId),
      uniqueTournamentId: '',
    };
  }
  if (isBrowseUt(selectedNavId)) {
    const branchId = parseBrowseUtId(selectedNavId);
    if (branchId.startsWith('ut-none-')) {
      const categoryId = branchId.slice('ut-none-'.length);
      const cat = categoryById(categoryId);
      if (!cat) return base;
      return {
        ...base,
        sportId: cat.sportId,
        categoryId,
        monitoringCategoryId: pickMonitoringCategoryId(categoryId),
        uniqueTournamentId: '',
      };
    }
    const ut = uniqueTournamentById(branchId);
    if (!ut) return base;
    return {
      ...base,
      sportId: ut.sportId,
      categoryId: ut.categoryId,
      monitoringCategoryId: pickMonitoringCategoryId(ut.categoryId),
      uniqueTournamentId: ut.id,
    };
  }
  return base;
}

export function snapshotForClone(st: SimpleTournament): TournamentFormSnapshot {
  const s = tournamentToSnapshot(st);
  return { ...s, name: `Copy of ${st.name}` };
}

export function briefSportKeyForSnapshot(s: TournamentFormSnapshot): BriefSportKey {
  return sportById(s.sportId)?.briefSportKey ?? 'soccer';
}

export function snapshotToTournament(
  id: string,
  s: TournamentFormSnapshot,
  running: boolean,
): SimpleTournament {
  const key = briefSportKeyForSnapshot(s);
  const cricket =
    key === 'cricket'
      ? {
          matchType: s.cricketMatchType,
          daysPlayed: s.cricketDaysPlayed,
          overs: s.cricketOvers,
          mandatoryPowerplay: s.cricketMandatoryPowerplay,
          maxOversPerBowler: s.cricketMaxOversPerBowler,
          battingPowerplay: s.cricketBattingPowerplay,
          reviews: s.cricketReviews,
        }
      : undefined;
  const tennis =
    key === 'tennis'
      ? {
          tennisStartTime: s.tennisStart,
          tennisEndTime: s.tennisEnd,
          surface: s.tennisSurface,
          numPlayers: s.tennisNumPlayers,
          bestOf: s.tennisBestOf,
          qualificationRounds: s.tennisQualRounds,
        }
      : undefined;
  return {
    id,
    sportId: s.sportId,
    categoryId: s.categoryId,
    monitoringCategoryId: s.monitoringCategoryId,
    uniqueTournamentId: s.uniqueTournamentId,
    name: s.name.trim(),
    startTime: s.startTime,
    endTime: s.endTime,
    competitionType: s.competitionType,
    addedToImport: s.addedToImport,
    scoutProposalVisible: s.scoutProposalVisible,
    disabled: s.disabled,
    venueId: s.venueId,
    reducedAttendance: s.reducedAttendance,
    defaultTimezone: s.defaultTimezone,
    prizeMoney: s.prizeMoney,
    prizeCurrency: s.prizeCurrency,
    running,
    cricket,
    tennis,
  };
}

export function createNewSimpleTournamentId(): string {
  return `st-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}
