import type { MappingEntity, MappingTabId } from '../data/wizardingCatalog';

export type ChipScope = 'all' | 'unmapped' | 'mapped';

export function isEntityMapped(
  entityId: string,
  accepted: Record<string, string>,
): boolean {
  return Boolean(accepted[entityId]);
}

export function applyMappingFilters(
  entities: MappingEntity[],
  options: {
    tab: MappingTabId;
    query: string;
    scope: ChipScope;
    accepted: Record<string, string>;
    heldUnmappedIds?: string[];
  },
): MappingEntity[] {
  const needle = options.query.trim().toLowerCase();
  const held = new Set(options.heldUnmappedIds ?? []);

  return entities.filter((entity) => {
    if (entity.tab !== options.tab) return false;
    if (needle) {
      const hay = `${entity.id} ${entity.name}`.toLowerCase();
      if (!hay.includes(needle)) return false;
    }

    const mapped = isEntityMapped(entity.id, options.accepted);
    const treatAsUnmapped = !mapped || held.has(entity.id);

    if (options.scope === 'mapped') return mapped && !held.has(entity.id);
    if (options.scope === 'unmapped') return treatAsUnmapped;
    return true;
  });
}

export function mappingChipCounts(
  entities: MappingEntity[],
  options: {
    tab: MappingTabId;
    query: string;
    accepted: Record<string, string>;
    heldUnmappedIds?: string[];
  },
): { all: number; unmapped: number; mapped: number } {
  const base = {
    tab: options.tab,
    query: options.query,
    accepted: options.accepted,
    heldUnmappedIds: options.heldUnmappedIds,
  };
  return {
    all: applyMappingFilters(entities, { ...base, scope: 'all' }).length,
    unmapped: applyMappingFilters(entities, { ...base, scope: 'unmapped' }).length,
    mapped: applyMappingFilters(entities, { ...base, scope: 'mapped' }).length,
  };
}
