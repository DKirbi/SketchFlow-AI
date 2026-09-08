import { useCallback, useMemo, useRef, useState } from 'react';
import {
  LOFIBadge,
  LOFIComponentSet,
  LOFIEmptyState,
  LOFITable,
  LOFIText,
} from 'lofi-kit';
import type { ColumnDef, ComponentSet, TableColumnMeta } from 'lofi-kit';
import {
  CURRENT_USER,
  MAPPING_TABS,
  WIZARDING_ENTITIES,
  seedAccepted,
  type MappingEntity,
  type MappingSuggestion,
  type MappingTabId,
} from '../../data/wizardingCatalog';
import {
  applyMappingFilters,
  mappingChipCounts,
  type ChipScope,
} from '../../lib/applyMappingFilters';
import './MappingView.scss';

const MAP_DELAY_MS = 800;
const UNMAPPED_HOLD_MS = 1100;

export function MappingView() {
  const [tab, setTab] = useState<MappingTabId>('players');
  const [draftQuery, setDraftQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [scope, setScope] = useState<ChipScope>('all');
  const [accepted, setAccepted] = useState<Record<string, string>>(() => seedAccepted());
  const [heldUnmappedIds, setHeldUnmappedIds] = useState<string[]>([]);
  const [loadingKey, setLoadingKey] = useState<string | null>(null);
  const timers = useRef<number[]>([]);

  const queueTimer = useCallback((fn: () => void, ms: number) => {
    const id = window.setTimeout(fn, ms);
    timers.current.push(id);
  }, []);

  const visible = useMemo(
    () =>
      applyMappingFilters(WIZARDING_ENTITIES, {
        tab,
        query: appliedQuery,
        scope,
        accepted,
        heldUnmappedIds,
      }),
    [tab, appliedQuery, scope, accepted, heldUnmappedIds],
  );

  const counts = useMemo(
    () =>
      mappingChipCounts(WIZARDING_ENTITIES, {
        tab,
        query: appliedQuery,
        accepted,
        heldUnmappedIds,
      }),
    [tab, appliedQuery, accepted, heldUnmappedIds],
  );

  const searchIdle = draftQuery === appliedQuery;

  const applyMap = useCallback(
    (entityId: string, suggestionId: string, currentScope: ChipScope) => {
      const key = `${entityId}|${suggestionId}`;
      setLoadingKey(key);
      queueTimer(() => {
        setAccepted((prev) => ({ ...prev, [entityId]: suggestionId }));
        setLoadingKey(null);
        if (currentScope === 'unmapped') {
          setHeldUnmappedIds((prev) => (prev.includes(entityId) ? prev : [...prev, entityId]));
          queueTimer(() => {
            setHeldUnmappedIds((prev) => prev.filter((id) => id !== entityId));
          }, UNMAPPED_HOLD_MS);
        }
      }, MAP_DELAY_MS);
    },
    [queueTimer],
  );

  const applyUnmap = useCallback((entityId: string) => {
    setAccepted((prev) => {
      const next = { ...prev };
      delete next[entityId];
      return next;
    });
    setHeldUnmappedIds((prev) => prev.filter((id) => id !== entityId));
  }, []);

  function suggestionSet(entity: MappingEntity, suggestion: MappingSuggestion): ComponentSet {
    const key = `${entity.id}|${suggestion.id}`;
    const mappedId = accepted[entity.id];
    const isChosen = mappedId === suggestion.id;
    const isLoading = loadingKey === key;
    const parentBusy = loadingKey?.startsWith(`${entity.id}|`) ?? false;

    return {
      kind: 'suggestion-row',
      id: suggestion.id,
      external: suggestion.externalLabel,
      percent: suggestion.confidence,
      map: {
        id: `map|${key}`,
        role: 'commit',
        label: 'Map',
        stateful: true,
        state: isLoading ? 'loading' : isChosen ? 'success' : 'idle',
        loadingLabel: 'Mapping',
        successLabel: 'Mapped',
        disabled: (Boolean(mappedId) && !isChosen) || (parentBusy && !isLoading),
      },
      unmap: {
        id: `unmap|${entity.id}`,
        role: 'secondary',
        label: 'Unmap',
        disabled: !isChosen || isLoading,
      },
    };
  }

  const shell: ComponentSet = {
    kind: 'tool-shell',
    framed: false,
    toolbar: {
      variant: 'tool',
      title: 'Wizarding mapping',
      identity: { handle: CURRENT_USER.handle, role: CURRENT_USER.role },
      rightActions: [],
    },
    filterRow: {
      applyMode: 'commit',
      fields: [
        {
          name: 'nameOrId',
          kind: 'search',
          label: 'Name or ID',
          value: draftQuery,
          placeholder: 'Search by name or id…',
          allowClear: true,
        },
      ],
      actions: [
        { id: 'search', role: 'commit', label: 'Search', disabled: searchIdle },
        { id: 'clear', role: 'dismiss', label: 'Clear all' },
      ],
    },
    chipGroup: {
      ariaLabel: 'Mapping status',
      chips: [
        { id: 'all', label: 'All', count: counts.all, selected: scope === 'all' },
        { id: 'unmapped', label: 'Unmapped', count: counts.unmapped, selected: scope === 'unmapped' },
        { id: 'mapped', label: 'Mapped', count: counts.mapped, selected: scope === 'mapped' },
      ],
    },
    tabs: MAPPING_TABS,
    activeTab: tab,
  };

  const columns: ColumnDef<MappingEntity, unknown>[] = useMemo(
    () => [
      {
        id: 'internal',
        header: 'Internal entity',
        cell: ({ row }) => (
          <div className="mapping-view__entity">
            <LOFIBadge variant="id" label={row.original.id} />
            <LOFIText variant="body">{row.original.name}</LOFIText>
          </div>
        ),
      },
      {
        id: 'status',
        header: 'Status',
        meta: { shrink: true } satisfies TableColumnMeta,
        cell: ({ row }) => {
          const mapped = Boolean(accepted[row.original.id]);
          return (
            <LOFIBadge
              variant="status"
              active={mapped}
              label={mapped ? 'mapped' : 'unmapped'}
            />
          );
        },
      },
    ],
    [accepted],
  );

  return (
    <div className="mapping-view">
      <LOFIComponentSet
        set={shell}
        handlers={{
          onFieldChange: (name, value) => {
            if (name === 'nameOrId') setDraftQuery(String(value));
          },
          onTabChange: (value) => {
            setTab(value as MappingTabId);
          },
          onAction: (id) => {
            if (id === 'search') {
              setAppliedQuery(draftQuery);
              return;
            }
            if (id === 'clear') {
              setDraftQuery('');
              setAppliedQuery('');
              return;
            }
            if (id === 'all' || id === 'unmapped' || id === 'mapped') {
              setScope(id);
              return;
            }
            if (id.startsWith('map|')) {
              const rest = id.slice(4);
              const sep = rest.indexOf('|');
              const entityId = rest.slice(0, sep);
              const suggestionId = rest.slice(sep + 1);
              applyMap(entityId, suggestionId, scope);
              return;
            }
            if (id.startsWith('unmap|')) {
              applyUnmap(id.slice(6));
            }
          },
        }}
      >
        <LOFITable<MappingEntity>
          key={tab}
          columns={columns}
          rows={visible}
          keyField="id"
          expandable
          sortable
          hint="Expand a row to rank AI suggestions. Map one suggestion per entity."
          emptySlot={
            <LOFIEmptyState
              variant="no-results"
              title="No mapping items."
              description="Widen filters or retry Search."
            />
          }
          renderExpanded={(row) => (
            <div className="mapping-view__suggestions">
              {row.original.suggestions.map((suggestion) => (
                <LOFIComponentSet
                  key={suggestion.id}
                  set={suggestionSet(row.original, suggestion)}
                  handlers={{
                    onAction: (id) => {
                      if (id.startsWith('map|')) {
                        const rest = id.slice(4);
                        const sep = rest.indexOf('|');
                        applyMap(rest.slice(0, sep), rest.slice(sep + 1), scope);
                        return;
                      }
                      if (id.startsWith('unmap|')) applyUnmap(id.slice(6));
                    },
                  }}
                />
              ))}
            </div>
          )}
        />
      </LOFIComponentSet>
    </div>
  );
}
