import { FILTER_OPTION_ALL } from '../constants';
import type { SimpleTournament, TournamentFilters } from '../types';
import { simpleTournamentOverlapsDateRange } from './validation';

export function applyTournamentFilters(
  rows: SimpleTournament[],
  f: TournamentFilters,
): SimpleTournament[] {
  const q = f.nameOrId.trim().toLowerCase();
  return rows.filter((st) => {
    if (f.sportId !== FILTER_OPTION_ALL && st.sportId !== f.sportId) return false;
    if (f.categoryId !== FILTER_OPTION_ALL && st.categoryId !== f.categoryId) return false;
    if (f.uniqueTournamentId !== FILTER_OPTION_ALL && st.uniqueTournamentId !== f.uniqueTournamentId) {
      return false;
    }
    if (f.onlyRunning && !st.running) return false;
    if (!simpleTournamentOverlapsDateRange(st, f.dateFrom, f.dateTo)) return false;
    if (q) {
      const hit =
        st.name.toLowerCase().includes(q) || st.id.toLowerCase().includes(q);
      if (!hit) return false;
    }
    return true;
  });
}

export interface ListLevelFilter {
  /** Free-text search applied to name + id. */
  search: string;
  /** When false, hide tournaments linked to a unique tournament. */
  showUnique: boolean;
  /** When false, hide tournaments without a unique tournament link. */
  showSimple: boolean;
}

/**
 * Per-table filter applied inside `ListView` / `SportManagementView`.
 * Combines the local search query with the Unique/Simple class checkboxes.
 * Class is derived from `uniqueTournamentId`: empty string → Simple, otherwise → Unique.
 */
export function applyListLevelFilter(
  rows: SimpleTournament[],
  f: ListLevelFilter,
): SimpleTournament[] {
  const q = f.search.trim().toLowerCase();
  return rows.filter((row) => {
    const isUnique = row.uniqueTournamentId !== '';
    if (isUnique && !f.showUnique) return false;
    if (!isUnique && !f.showSimple) return false;
    if (q && !`${row.name} ${row.id}`.toLowerCase().includes(q)) return false;
    return true;
  });
}
