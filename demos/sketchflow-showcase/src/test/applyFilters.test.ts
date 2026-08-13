import { describe, expect, it } from 'vitest';
import { applyMappingFilters, filtersAreDefault } from '../examples/mapping/applyFilters';
import { FILTER_ALL } from '../examples/mapping/catalog';
import { DEFAULT_FILTERS, INITIAL_ITEMS } from '../examples/mapping/mockData';

describe('applyMappingFilters', () => {
  it('returns all items when filters are default', () => {
    expect(applyMappingFilters(INITIAL_ITEMS, DEFAULT_FILTERS)).toHaveLength(INITIAL_ITEMS.length);
    expect(filtersAreDefault(DEFAULT_FILTERS)).toBe(true);
  });

  it('filters by sport', () => {
    const filtered = applyMappingFilters(INITIAL_ITEMS, {
      sportId: 'sp-tennis',
      tournamentQuery: '',
    });
    expect(filtered.every((item) => item.sportId === 'sp-tennis')).toBe(true);
    expect(filtered.length).toBeGreaterThan(0);
  });

  it('filters by tournament search after sport is set', () => {
    const filtered = applyMappingFilters(INITIAL_ITEMS, {
      sportId: FILTER_ALL,
      tournamentQuery: 'wimbledon',
    });
    expect(filtered).toHaveLength(1);
    expect(filtered[0]?.id).toBe('COMP-WIMBLEDON');
  });

  it('combines sport and tournament with AND logic', () => {
    const filtered = applyMappingFilters(INITIAL_ITEMS, {
      sportId: 'sp-soccer',
      tournamentQuery: 'liga',
    });
    expect(filtered.length).toBeGreaterThan(0);
    expect(filtered.every((item) => item.sportId === 'sp-soccer')).toBe(true);
    expect(filtered.every((item) => item.tournamentLabel.toLowerCase().includes('liga'))).toBe(
      true,
    );
  });
});
