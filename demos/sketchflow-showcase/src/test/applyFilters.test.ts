import { describe, expect, it } from 'vitest';
import { applyMappingFilters, filtersAreDefault } from '../examples/mapping/applyFilters';
import { FILTER_ALL } from '../examples/mapping/catalog';
import { DEFAULT_FILTERS, INITIAL_ITEMS } from '../examples/mapping/mockData';

describe('applyMappingFilters', () => {
  it('returns all items when filters are default', () => {
    expect(applyMappingFilters(INITIAL_ITEMS, DEFAULT_FILTERS)).toHaveLength(INITIAL_ITEMS.length);
    expect(filtersAreDefault(DEFAULT_FILTERS)).toBe(true);
  });

  it('filters by genre', () => {
    const filtered = applyMappingFilters(INITIAL_ITEMS, {
      genreId: 'gn-thriller',
      titleQuery: '',
    });
    expect(filtered.every((item) => item.genreId === 'gn-thriller')).toBe(true);
    expect(filtered.length).toBeGreaterThan(0);
  });

  it('filters by title search after genre is set', () => {
    const filtered = applyMappingFilters(INITIAL_ITEMS, {
      genreId: FILTER_ALL,
      titleQuery: 'oldboy',
    });
    expect(filtered).toHaveLength(1);
    expect(filtered[0]?.id).toBe('FSD-1003');
  });

  it('combines genre and title with AND logic', () => {
    const filtered = applyMappingFilters(INITIAL_ITEMS, {
      genreId: 'gn-thriller',
      titleQuery: 'para',
    });
    expect(filtered.length).toBeGreaterThan(0);
    expect(filtered.every((item) => item.genreId === 'gn-thriller')).toBe(true);
    expect(
      filtered.every(
        (item) =>
          item.internalValue.toLowerCase().includes('para') ||
          item.externalSuggestion.toLowerCase().includes('para'),
      ),
    ).toBe(true);
  });
});
