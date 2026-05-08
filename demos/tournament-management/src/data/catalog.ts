/**
 * Canonical catalog for the prototype (no API).
 * Sport / category / monitoring / unique tournament graph.
 */

import type { CategoryRec, MonitoringCategoryRec, Sport, UniqueTournamentRec } from '../types';

export const SPORTS: Sport[] = [
  { id: 'sp-soccer', label: 'Soccer', briefSportKey: 'soccer' },
  { id: 'sp-cricket', label: 'Cricket', briefSportKey: 'cricket' },
  { id: 'sp-tennis', label: 'Tennis', briefSportKey: 'tennis' },
];

export const CATEGORIES: CategoryRec[] = [
  { id: 'cat-intl-clubs', sportId: 'sp-soccer', label: 'International clubs' },
  { id: 'cat-intl-youth', sportId: 'sp-soccer', label: 'International youth' },
  { id: 'cat-england', sportId: 'sp-soccer', label: 'England domestic' },
  { id: 'cat-cricket-intl', sportId: 'sp-cricket', label: 'International' },
  { id: 'cat-cricket-test', sportId: 'sp-cricket', label: 'Test series' },
  { id: 'cat-tennis-gs', sportId: 'sp-tennis', label: 'Grand Slam' },
  { id: 'cat-tennis-atp', sportId: 'sp-tennis', label: 'ATP 1000' },
];

export const MONITORING: MonitoringCategoryRec[] = [
  { id: 'mon-tier1', sportId: 'sp-soccer', categoryId: 'cat-intl-clubs', label: 'Tier 1 — broadcast' },
  { id: 'mon-tier2', sportId: 'sp-soccer', categoryId: 'cat-intl-clubs', label: 'Tier 2 — trading' },
  { id: 'mon-tier1-youth', sportId: 'sp-soccer', categoryId: 'cat-intl-youth', label: 'Tier 1 — youth' },
  { id: 'mon-eng1', sportId: 'sp-soccer', categoryId: 'cat-england', label: 'Tier 1 — domestic' },
  { id: 'mon-cricket-a', sportId: 'sp-cricket', categoryId: 'cat-cricket-intl', label: 'ICC priors' },
  { id: 'mon-cricket-b', sportId: 'sp-cricket', categoryId: 'cat-cricket-test', label: 'First-class core' },
  { id: 'mon-tennis-gs', sportId: 'sp-tennis', categoryId: 'cat-tennis-gs', label: 'Major draw' },
  { id: 'mon-tennis-atp', sportId: 'sp-tennis', categoryId: 'cat-tennis-atp', label: 'Masters draw' },
];

export const UNIQUE_TOURNAMENTS: UniqueTournamentRec[] = [
  { id: 'ut-ucl', sportId: 'sp-soccer', categoryId: 'cat-intl-clubs', label: 'UEFA Champions League' },
  { id: 'ut-pl', sportId: 'sp-soccer', categoryId: 'cat-england', label: 'Premier League' },
  { id: 'ut-wcq-uefa', sportId: 'sp-soccer', categoryId: 'cat-intl-clubs', label: 'World Cup qualification — UEFA' },
  { id: 'ut-icc-wc', sportId: 'sp-cricket', categoryId: 'cat-cricket-intl', label: 'ICC Cricket World Cup' },
  { id: 'ut-ashes', sportId: 'sp-cricket', categoryId: 'cat-cricket-test', label: 'The Ashes' },
  { id: 'ut-wimbledon', sportId: 'sp-tennis', categoryId: 'cat-tennis-gs', label: 'Wimbledon' },
  { id: 'ut-usopen', sportId: 'sp-tennis', categoryId: 'cat-tennis-gs', label: 'US Open' },
  { id: 'ut-rg', sportId: 'sp-tennis', categoryId: 'cat-tennis-gs', label: 'Roland Garros' },
  { id: 'ut-rome', sportId: 'sp-tennis', categoryId: 'cat-tennis-atp', label: 'Internazionali BNL d\'Italia' },
];

export function sportById(id: string): Sport | undefined {
  return SPORTS.find((s) => s.id === id);
}

export function categoriesForSport(sportId: string): CategoryRec[] {
  return CATEGORIES.filter((c) => c.sportId === sportId);
}

export function monitoringForCategory(categoryId: string): MonitoringCategoryRec[] {
  return MONITORING.filter((m) => m.categoryId === categoryId);
}

export function uniqueTournamentsForCategory(categoryId: string): UniqueTournamentRec[] {
  return UNIQUE_TOURNAMENTS.filter((u) => u.categoryId === categoryId);
}

export function uniqueTournamentById(id: string): UniqueTournamentRec | undefined {
  return UNIQUE_TOURNAMENTS.find((u) => u.id === id);
}

export function categoryById(id: string): CategoryRec | undefined {
  return CATEGORIES.find((c) => c.id === id);
}
