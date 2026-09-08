import { describe, expect, it } from 'vitest';
import { WIZARDING_ENTITIES, seedAccepted } from '../data/wizardingCatalog';
import { applyMappingFilters, mappingChipCounts } from './applyMappingFilters';

const harry = WIZARDING_ENTITIES.find((entity) => entity.name === 'Harry Potter');

describe('wizarding catalog', () => {
  it('gives every entity at least ten suggestions high to low', () => {
    expect(harry).toBeDefined();
    for (const entity of WIZARDING_ENTITIES) {
      expect(entity.suggestions.length).toBeGreaterThanOrEqual(10);
      const percents = entity.suggestions.map((row) => row.confidence);
      expect(percents).toEqual([...percents].sort((a, b) => b - a));
    }
  });
});

describe('applyMappingFilters', () => {
  const accepted = seedAccepted();

  it('filters by tab and commit query on name or id', () => {
    const players = applyMappingFilters(WIZARDING_ENTITIES, {
      tab: 'players',
      query: '',
      scope: 'all',
      accepted,
    });
    expect(players.every((entity) => entity.tab === 'players')).toBe(true);

    const krum = applyMappingFilters(WIZARDING_ENTITIES, {
      tab: 'players',
      query: 'krum',
      scope: 'all',
      accepted,
    });
    expect(krum.map((entity) => entity.name)).toEqual(['Viktor Krum']);

    const byId = applyMappingFilters(WIZARDING_ENTITIES, {
      tab: 'players',
      query: 'hp-pl-002',
      scope: 'all',
      accepted,
    });
    expect(byId.map((entity) => entity.name)).toEqual(['Harry Potter']);
  });

  it('scopes All / Unmapped / Mapped and holds a mapped row on Unmapped', () => {
    const counts = mappingChipCounts(WIZARDING_ENTITIES, {
      tab: 'players',
      query: '',
      accepted,
    });
    expect(counts.all).toBe(counts.unmapped + counts.mapped);

    const cedric = WIZARDING_ENTITIES.find((entity) => entity.name === 'Cedric Diggory');
    expect(cedric).toBeDefined();
    const afterMap = { ...accepted, [cedric!.id]: cedric!.suggestions[0]!.id };

    const unmappedHeld = applyMappingFilters(WIZARDING_ENTITIES, {
      tab: 'players',
      query: '',
      scope: 'unmapped',
      accepted: afterMap,
      heldUnmappedIds: [cedric!.id],
    });
    expect(unmappedHeld.some((entity) => entity.id === cedric!.id)).toBe(true);

    const unmappedGone = applyMappingFilters(WIZARDING_ENTITIES, {
      tab: 'players',
      query: '',
      scope: 'unmapped',
      accepted: afterMap,
    });
    expect(unmappedGone.some((entity) => entity.id === cedric!.id)).toBe(false);

    const allKeeps = applyMappingFilters(WIZARDING_ENTITIES, {
      tab: 'players',
      query: '',
      scope: 'all',
      accepted: afterMap,
    });
    expect(allKeeps.some((entity) => entity.id === cedric!.id)).toBe(true);
  });
});
