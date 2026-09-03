import { FILTER_ALL } from './catalog';
import type { MappingFilters, MappingItem } from './mockData';

function matchesQuery(item: MappingItem, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const haystack = [item.id, item.internalValue, item.externalSuggestion, item.genreLabel]
    .join(' ')
    .toLowerCase();
  return haystack.includes(q);
}

/** Apply genre + title search filters (AND). */
export function applyMappingFilters(items: MappingItem[], filters: MappingFilters): MappingItem[] {
  return items.filter((item) => {
    if (filters.genreId !== FILTER_ALL && item.genreId !== filters.genreId) return false;
    if (!matchesQuery(item, filters.titleQuery)) return false;
    return true;
  });
}

export function filtersAreDefault(filters: MappingFilters): boolean {
  return filters.genreId === FILTER_ALL && filters.titleQuery.trim() === '';
}
