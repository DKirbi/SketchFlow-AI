/**
 * Canonical catalog for the prototype (no API).
 * Sport / category / monitoring / unique tournament graph.
 * Mocked as a Harry Potter sporting world; sport ids stay stable for forms.
 */

import type { CategoryRec, MonitoringCategoryRec, Sport, UniqueTournamentRec } from '../types';

export const SPORTS: Sport[] = [
  { id: 'sp-soccer', label: 'Quidditch', briefSportKey: 'soccer' },
  { id: 'sp-cricket', label: 'Gobstones', briefSportKey: 'cricket' },
  { id: 'sp-tennis', label: 'Magical tennis', briefSportKey: 'tennis' },
];

export const CATEGORIES: CategoryRec[] = [
  { id: 'cat-intl-clubs', sportId: 'sp-soccer', label: 'International Confederation' },
  { id: 'cat-intl-youth', sportId: 'sp-soccer', label: 'Hogwarts youth' },
  { id: 'cat-england', sportId: 'sp-soccer', label: 'British and Irish' },
  { id: 'cat-cricket-intl', sportId: 'sp-cricket', label: 'Gobstones international' },
  { id: 'cat-cricket-test', sportId: 'sp-cricket', label: 'School championships' },
  { id: 'cat-tennis-gs', sportId: 'sp-tennis', label: 'Wizarding majors' },
  { id: 'cat-tennis-atp', sportId: 'sp-tennis', label: 'Ministry invitational' },
];

export const MONITORING: MonitoringCategoryRec[] = [
  { id: 'mon-tier1', sportId: 'sp-soccer', categoryId: 'cat-intl-clubs', label: 'Tier 1 — Daily Prophet' },
  { id: 'mon-tier2', sportId: 'sp-soccer', categoryId: 'cat-intl-clubs', label: 'Tier 2 — betting shops' },
  { id: 'mon-tier1-youth', sportId: 'sp-soccer', categoryId: 'cat-intl-youth', label: 'Tier 1 — Hogwarts' },
  { id: 'mon-eng1', sportId: 'sp-soccer', categoryId: 'cat-england', label: 'Tier 1 — domestic' },
  { id: 'mon-cricket-a', sportId: 'sp-cricket', categoryId: 'cat-cricket-intl', label: 'ICW priors' },
  { id: 'mon-cricket-b', sportId: 'sp-cricket', categoryId: 'cat-cricket-test', label: 'House core' },
  { id: 'mon-tennis-gs', sportId: 'sp-tennis', categoryId: 'cat-tennis-gs', label: 'Major draw' },
  { id: 'mon-tennis-atp', sportId: 'sp-tennis', categoryId: 'cat-tennis-atp', label: 'Ministry draw' },
];

export const UNIQUE_TOURNAMENTS: UniqueTournamentRec[] = [
  { id: 'ut-ucl', sportId: 'sp-soccer', categoryId: 'cat-intl-clubs', label: 'Quidditch World Cup' },
  { id: 'ut-pl', sportId: 'sp-soccer', categoryId: 'cat-england', label: 'Inter-House Quidditch Cup' },
  { id: 'ut-wcq-uefa', sportId: 'sp-soccer', categoryId: 'cat-intl-clubs', label: 'European Quidditch Qualifiers' },
  { id: 'ut-icc-wc', sportId: 'sp-cricket', categoryId: 'cat-cricket-intl', label: 'International Gobstones Cup' },
  { id: 'ut-ashes', sportId: 'sp-cricket', categoryId: 'cat-cricket-test', label: 'Hogwarts–Durmstrang Gobstones' },
  { id: 'ut-wimbledon', sportId: 'sp-tennis', categoryId: 'cat-tennis-gs', label: 'Triwizard Dueling Championship' },
  { id: 'ut-usopen', sportId: 'sp-tennis', categoryId: 'cat-tennis-gs', label: 'Ilvermorny Magical Tennis Open' },
  { id: 'ut-rg', sportId: 'sp-tennis', categoryId: 'cat-tennis-gs', label: 'Beauxbatons Magical Tennis' },
  { id: 'ut-rome', sportId: 'sp-tennis', categoryId: 'cat-tennis-atp', label: 'Ministry Magical Tennis Open' },
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
