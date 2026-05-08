import type { ModalMode, TournamentFormSnapshot } from '../types';
import { cricketShowDaysPlayed } from './cricketDefaults';
import { briefSportKeyForSnapshot } from './tournamentFormMappers';
import {
  validateMaxOversPerBowler,
  validateNonNegativeIntField,
  validatePrizePair,
  validateQualificationRounds,
  validateTournamentName,
  oversIsNumeric,
} from './validation';

export function cricketDaysVisible(matchType: string): boolean {
  return cricketShowDaysPlayed(matchType);
}

export function validateSnapshot(
  s: TournamentFormSnapshot,
  mode: ModalMode,
): Partial<Record<string, string>> {
  const errs: Partial<Record<string, string>> = {};

  const nameErr = validateTournamentName(s.name);
  if (nameErr) errs.name = nameErr;

  const prizeErr = validatePrizePair(s.prizeMoney, s.prizeCurrency);
  if (prizeErr) errs.prizePair = prizeErr;

  const sportKey = briefSportKeyForSnapshot(s);

  if (sportKey === 'cricket') {
    if (!s.cricketMatchType.trim()) errs.cricketMatchType = 'Match type is mandatory for cricket.';
    const chk = (
      field: keyof typeof errs,
      label: string,
      raw: string,
    ): void => {
      const msg = validateNonNegativeIntField(label, raw);
      if (msg) errs[field] = msg;
    };
    chk('cricketMp', 'Mandatory powerplay', s.cricketMandatoryPowerplay);
    chk('cricketBp', 'Batting powerplay', s.cricketBattingPowerplay);
    chk('cricketRev', 'Reviews', s.cricketReviews);
    chk('cricketMob', 'Max overs per bowler', s.cricketMaxOversPerBowler);
    chk('cricketOvers', 'Overs', s.cricketOvers);
    if (cricketShowDaysPlayed(s.cricketMatchType)) {
      chk('cricketDays', 'Days played', s.cricketDaysPlayed);
    }
    if (oversIsNumeric(s.cricketOvers)) {
      const mob = validateMaxOversPerBowler(s.cricketMaxOversPerBowler, s.cricketOvers);
      if (mob) errs.maxOvers = mob;
    }
  }

  if (sportKey === 'tennis') {
    const q = validateQualificationRounds(s.tennisQualRounds);
    if (q) errs.tennisQual = q;
  }

  if ((mode === 'create' || mode === 'clone') && (!s.categoryId || !s.monitoringCategoryId)) {
    if (!s.categoryId) errs.category = 'Pick a category.';
    if (!s.monitoringCategoryId) errs.monitoring = 'Pick a monitoring category.';
  }

  return errs;
}
