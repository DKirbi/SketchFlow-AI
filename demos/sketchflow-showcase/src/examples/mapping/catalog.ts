/** Sports catalog — aligned with demos/tournament-management/src/data/catalog.ts */

export interface SportOption {
  id: string;
  label: string;
}

export const FILTER_ALL = 'all';

export const SPORTS: SportOption[] = [
  { id: 'sp-soccer', label: 'Soccer' },
  { id: 'sp-cricket', label: 'Cricket' },
  { id: 'sp-tennis', label: 'Tennis' },
];

export function sportLabel(sportId: string): string {
  return SPORTS.find((sport) => sport.id === sportId)?.label ?? sportId;
}
