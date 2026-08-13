import { FILTER_ALL } from './catalog';
import type { MappingFilters, MappingItem } from './mockData';

function matchesQuery(item: MappingItem, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const haystack = [
    item.id,
    item.internalValue,
    item.externalSuggestion,
    item.tournamentId,
    item.tournamentLabel,
    item.sportLabel,
  ]
    .join(' ')
    .toLowerCase();
  return haystack.includes(q);
}

/** Apply sport + tournament search filters (AND). */
export function applyMappingFilters(items: MappingItem[], filters: MappingFilters): MappingItem[] {
  return items.filter((item) => {
    if (filters.sportId !== FILTER_ALL && item.sportId !== filters.sportId) return false;
    if (!matchesQuery(item, filters.tournamentQuery)) return false;
    return true;
  });
}

export function filtersAreDefault(filters: MappingFilters): boolean {
  return filters.sportId === FILTER_ALL && filters.tournamentQuery.trim() === '';
}
