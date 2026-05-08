import { FILTER_OPTION_ALL } from '../constants';
import type { TournamentFilters } from '../types';

/** True when any list-shaping filter differs from the neutral default. */
export function filtersAreActive(f: TournamentFilters): boolean {
  return (
    f.nameOrId.trim() !== '' ||
    f.sportId !== FILTER_OPTION_ALL ||
    f.categoryId !== FILTER_OPTION_ALL ||
    f.uniqueTournamentId !== FILTER_OPTION_ALL ||
    f.dateFrom !== '' ||
    f.dateTo !== '' ||
    f.onlyRunning === true
  );
}
