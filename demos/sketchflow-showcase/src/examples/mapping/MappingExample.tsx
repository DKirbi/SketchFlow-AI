import { useCallback, useMemo, useState } from 'react';
import {
  LOFIToolbar,
  LOFITable,
  LOFICheckbox,
  LOFIButton,
  LOFIStatefulButton,
  LOFIBadge,
  LOFIText,
  LOFIModal,
  LOFIField,
  LOFIInput,
  LOFISelect,
} from 'lofi-kit';
import type { ColumnDef, TableColumnMeta, StatefulButtonState } from 'lofi-kit';
import { MOCK_CATALOG_OPTIONS, getMappingCatalog, type MockCatalogId } from 'shared-catalogs';
import { applyMappingFilters, filtersAreDefault } from './applyFilters';
import { FILTER_ALL, GENRES, type GenreOption } from './catalog';
import {
  cloneItems,
  createInitialState,
  CURRENT_USER,
  DEFAULT_FILTERS,
  INITIAL_ITEMS,
  nowTimestamp,
  type MappingFilters,
  type MappingItem,
} from './mockData';
import './MappingExample.scss';

const MAP_DELAY_MS = 1200;
const BULK_MAP_DELAY_MS = 1400;



function statusLabel(item: MappingItem): string {
  if (item.status === 'mapped' && item.mappedBy) {
    return `mapped (${item.mappedBy})`;
  }
  return item.status === 'mapped' ? 'mapped' : 'pending';
}

function coerceGenreValue(value: string): string {
  return value === '' ? FILTER_ALL : value;
}

function itemsForCatalog(id: MockCatalogId): MappingItem[] {
  if (id === 'film') return cloneItems(INITIAL_ITEMS);
  const catalog = getMappingCatalog('wizarding');
  const labels = Object.fromEntries(catalog.tabs.map((tab) => [tab.value, tab.label]));
  return catalog.entities.map((entity) => ({
    id: entity.id,
    genreId: entity.tab,
    genreLabel: labels[entity.tab] ?? entity.tab,
    internalValue: entity.name,
    externalSuggestion: entity.suggestions[0]?.externalLabel ?? entity.name,
    confidence: entity.suggestions[0]?.confidence ?? 0,
    status: entity.seedMappedId ? 'mapped' : 'pending',
    mappedAt: entity.seedMappedId ? '02 Apr 2026, 09:14' : undefined,
    mappedBy: entity.seedMappedId ? 'j.smith' : undefined,
  }));
}

function genresForCatalog(id: MockCatalogId): GenreOption[] {
  if (id === 'film') return GENRES;
  return getMappingCatalog('wizarding').tabs.map((tab) => ({ id: tab.value, label: tab.label }));
}

export function MappingExample() {
  const [catalogId, setCatalogId] = useState<MockCatalogId>('film');
  const [items, setItems] = useState<MappingItem[]>(() => cloneItems(INITIAL_ITEMS));
  const [selected, setSelected] = useState<Set<string>>(() => new Set());
  const [loadingIds, setLoadingIds] = useState<Set<string>>(() => new Set());
  const [unmapConfirmId, setUnmapConfirmId] = useState<string | null>(null);
  const [bulkConfirmOpen, setBulkConfirmOpen] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [filtersDraft, setFiltersDraft] = useState<MappingFilters>(() => ({ ...DEFAULT_FILTERS }));
  const [filtersApplied, setFiltersApplied] = useState<MappingFilters>(() => ({
    ...DEFAULT_FILTERS,
  }));

  const applyCatalog = useCallback((nextId: MockCatalogId) => {
    const initial = createInitialState();
    setCatalogId(nextId);
    setItems(itemsForCatalog(nextId));
    setSelected(initial.selected);
    setLoadingIds(initial.loadingIds);
    setUnmapConfirmId(initial.unmapConfirmId);
    setBulkConfirmOpen(initial.bulkConfirmOpen);
    setStatusMessage(null);
    setFiltersDraft({ ...DEFAULT_FILTERS });
    setFiltersApplied({ ...DEFAULT_FILTERS });
  }, []);

  const effectiveCatalogId = catalogId;
  const catalogGenres = genresForCatalog(effectiveCatalogId);
  const sourceItems = items;
  const displayItems = applyMappingFilters(sourceItems, filtersApplied);
  const displaySelected = selected;
  const displayLoadingIds = loadingIds;
  const displayBulkConfirmOpen = bulkConfirmOpen;
  const displayStatusMessage = statusMessage;

  const filtersMatch =
    filtersDraft.genreId === filtersApplied.genreId &&
    filtersDraft.titleQuery === filtersApplied.titleQuery;

  const pendingCount = displayItems.filter((item) => item.status === 'pending').length;
  const mappedCount = displayItems.filter((item) => item.status === 'mapped').length;
  const selectedCount = displaySelected.size;
  const allSelected = displayItems.length > 0 && displaySelected.size === displayItems.length;
  const someSelected = displaySelected.size > 0 && !allSelected;

  const patchFiltersDraft = useCallback((partial: Partial<MappingFilters>) => {
    setFiltersDraft((prev) => ({ ...prev, ...partial }));
  }, []);

  const commitSearch = useCallback(() => {
    setFiltersApplied({ ...filtersDraft });
  }, [filtersDraft]);

  const clearAllFilters = useCallback(() => {
    setFiltersDraft({ ...DEFAULT_FILTERS });
    setFiltersApplied({ ...DEFAULT_FILTERS });
  }, []);

  const toggleRow = useCallback(
    (id: string) => {
        setSelected((prev) => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        return next;
      });
    },
    [],
  );

  const toggleAll = useCallback(() => {
    if (allSelected || someSelected) {
      setSelected(new Set());
    } else {
      setSelected(new Set(displayItems.map((item) => item.id)));
    }
  }, [allSelected, displayItems, someSelected]);

  const applyMap = useCallback(
    (id: string) => {
        setLoadingIds((prev) => new Set(prev).add(id));
      setStatusMessage(null);
      setTimeout(() => {
        setItems((prev) =>
          prev.map((item) =>
            item.id === id
              ? {
                  ...item,
                  status: 'mapped',
                  mappedAt: nowTimestamp(),
                  mappedBy: CURRENT_USER.handle,
                }
              : item,
          ),
        );
        setLoadingIds((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
        setSelected((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
        setStatusMessage('Mapping saved to external catalogue.');
      }, MAP_DELAY_MS);
    },
    [],
  );

  const applyUnmap = useCallback(
    (id: string) => {
        setLoadingIds((prev) => new Set(prev).add(id));
      setUnmapConfirmId(null);
      setTimeout(() => {
        setItems((prev) =>
          prev.map((item) =>
            item.id === id
              ? { ...item, status: 'pending', mappedAt: undefined, mappedBy: undefined }
              : item,
          ),
        );
        setLoadingIds((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
        setStatusMessage('Mapping removed.');
      }, MAP_DELAY_MS);
    },
    [],
  );

  const applyBulkMap = useCallback(() => {
    const ids = Array.from(selected);
    setBulkConfirmOpen(false);
    ids.forEach((id) => {
      setLoadingIds((prev) => new Set(prev).add(id));
    });
    setTimeout(() => {
      const ts = nowTimestamp();
      setItems((prev) =>
        prev.map((item) =>
          ids.includes(item.id)
            ? { ...item, status: 'mapped', mappedAt: ts, mappedBy: CURRENT_USER.handle }
            : item,
        ),
      );
      setLoadingIds((prev) => {
        const next = new Set(prev);
        ids.forEach((id) => next.delete(id));
        return next;
      });
      setSelected(new Set());
      setStatusMessage(`${ids.length} item${ids.length !== 1 ? 's' : ''} bulk-mapped.`);
    }, BULK_MAP_DELAY_MS);
  }, [selected]);

  const columns: ColumnDef<MappingItem, unknown>[] = useMemo(
    () => [
      {
        id: 'select',
        header: () => (
          <LOFICheckbox
            id="select-all"
            label=""
            size="default"
            checked={allSelected || someSelected}
            onChange={toggleAll}
          />
        ),
        cell: ({ row }) => (
          <span>
            <LOFICheckbox
              id={`sel-${row.original.id}`}
              label=""
              size="default"
              checked={displaySelected.has(row.original.id)}
              onChange={() => toggleRow(row.original.id)}
            />
          </span>
        ),
        size: 44,
        meta: { shrink: true } satisfies TableColumnMeta,
      },
      {
        id: 'internalValue',
        header: 'Internal Value',
        cell: ({ row }) => (
          <span className="mapping-example__internal">
            <LOFIBadge variant="id" label={row.original.id} />
            <LOFIText variant="body" className="mapping-example__internal-value">
              {row.original.internalValue}
            </LOFIText>
          </span>
        ),
      },
      {
        id: 'externalSuggestion',
        header: 'External Suggestion',
        cell: ({ row }) => (
          <span className="mapping-example__suggestion">
            <LOFIText variant="body">{row.original.externalSuggestion}</LOFIText>
            <LOFIBadge variant="tag" label={`${row.original.confidence}%`} />
          </span>
        ),
      },
      {
        id: 'status',
        header: 'Status',
        meta: { shrink: true } satisfies TableColumnMeta,
        cell: ({ row }) => (
          <LOFIBadge
            variant="status"
            active={row.original.status === 'mapped'}
            label={statusLabel(row.original)}
          />
        ),
      },
      {
        id: 'actions',
        header: 'Actions',
        size: 176,
        meta: { shrink: true } satisfies TableColumnMeta,
        cell: ({ row }) => {
          const item = row.original;
          const isLoading = displayLoadingIds.has(item.id);
          const mapState: StatefulButtonState = isLoading
            ? 'loading'
            : item.status === 'mapped'
              ? 'success'
              : 'idle';

          if (unmapConfirmId === item.id) {
            return (
              <span className="mapping-example__inline-confirm mapping-example__actions-col">
                <LOFIText variant="sm">Remove mapping?</LOFIText>
                <LOFIButton variant="primary" size="compact" onClick={() => applyUnmap(item.id)}>
                  Yes, remove
                </LOFIButton>
                <LOFIButton
                  variant="dismiss"
                  size="compact"
                  onClick={() => setUnmapConfirmId(null)}
                >
                  Cancel
                </LOFIButton>
              </span>
            );
          }

          return (
            <span className="mapping-example__actions mapping-example__actions-col">
              <span>
                <LOFIStatefulButton
                  state={mapState}
                  idleLabel="Map"
                  successLabel="Mapped"
                  loadingLabel="Working"
                  size="compact"
                  onClick={() => {
                    if (item.status === 'pending' && !isLoading) {
                      applyMap(item.id);
                    }
                  }}
                />
              </span>
              {item.status === 'mapped' && !isLoading && (
                <span>
                  <LOFIButton
                    variant="dismiss"
                    size="compact"
                    onClick={() => {
                      setUnmapConfirmId(item.id);
                    }}
                  >
                    Unmap
                  </LOFIButton>
                </span>
              )}
            </span>
          );
        },
      },
    ],
    [
      allSelected,
      applyMap,
      applyUnmap,
      displayLoadingIds,
      displaySelected,
      someSelected,
      toggleAll,
      toggleRow,
      unmapConfirmId,
    ],
  );

  return (
    <div className="mapping-example">
      <LOFIToolbar
        left={
          <span className="mapping-example__identity">
            <LOFIText variant="sm">{CURRENT_USER.handle}</LOFIText>
            <LOFIBadge variant="tag" label={CURRENT_USER.role} />
          </span>
        }
        center={
          <LOFIText as="h1" variant="body">
            Mapping
          </LOFIText>
        }
        right={
          <span className="mapping-example__toolbar-right">
            <LOFIField label="Mock database" htmlFor="map-catalog" inline>
              <LOFISelect
                id="map-catalog"
                size="compact"
                value={effectiveCatalogId}
                options={MOCK_CATALOG_OPTIONS.map((option) => ({
                  value: option.value,
                  label: option.label,
                }))}
                onChange={(value) => applyCatalog(value as MockCatalogId)}
              />
            </LOFIField>
            <span className="mapping-example__counts">
              <LOFIBadge variant="status" active label={`${mappedCount} mapped`} />
              <LOFIBadge variant="status" active={false} label={`${pendingCount} pending`} />
            </span>
          </span>
        }
      />

      <div className="mapping-example__content">
        <div className="mapping-example__filters" role="search">
          <LOFIField label="Genre" htmlFor="map-genre">
            <LOFISelect
              id="map-genre"
              allowClear
              placeholder="All genres"
              value={filtersDraft.genreId === FILTER_ALL ? FILTER_ALL : filtersDraft.genreId}
              onChange={(value) => patchFiltersDraft({ genreId: coerceGenreValue(value) })}
              options={[
                { value: FILTER_ALL, label: 'All genres' },
                ...catalogGenres.map((genre) => ({ value: genre.id, label: genre.label })),
              ]}
            />
          </LOFIField>
          <LOFIField label="Title" htmlFor="map-title">
            <LOFIInput
              id="map-title"
              type="search"
              allowClear
              placeholder="Search by name or id…"
              value={filtersDraft.titleQuery}
              onChange={(value) => patchFiltersDraft({ titleQuery: value })}
            />
          </LOFIField>
          <div className="mapping-example__filters-actions">
            <LOFIButton
              type="button"
              variant="primary"
              disabled={filtersMatch}
              onClick={commitSearch}
            >
              Search
            </LOFIButton>
            <LOFIButton
              type="button"
              variant="dismiss"
              disabled={filtersAreDefault(filtersDraft)}
              onClick={clearAllFilters}
            >
              Clear all
            </LOFIButton>
          </div>
        </div>

        <div className="mapping-example__toolbar">
          <LOFIButton
            variant="primary"
            disabled={selectedCount === 0}
            onClick={() => setBulkConfirmOpen(true)}
          >
            {selectedCount > 0 ? `Bulk Map (${selectedCount})` : 'Bulk Map'}
          </LOFIButton>
          {selectedCount > 0 && (
            <LOFIText variant="muted">
              {selectedCount} row{selectedCount !== 1 ? 's' : ''} selected
            </LOFIText>
          )}
        </div>

        <LOFITable<MappingItem>
          columns={columns}
          rows={displayItems}
          keyField="id"
          sortable
          emptyText="No mapping items match the current filters."
        />

        {displayStatusMessage && (
          <div className="mapping-example__status" role="status">
            <LOFIText variant="sm">{displayStatusMessage}</LOFIText>
          </div>
        )}
      </div>

      <LOFIModal
        open={displayBulkConfirmOpen}
        onClose={() => setBulkConfirmOpen(false)}
        title="Confirm Bulk Map"
        footer={
          <>
            <LOFIButton variant="dismiss" onClick={() => setBulkConfirmOpen(false)}>
              Cancel
            </LOFIButton>
            <LOFIButton variant="primary" onClick={applyBulkMap}>
              Apply to {selectedCount} item{selectedCount !== 1 ? 's' : ''}
            </LOFIButton>
          </>
        }
      >
        <LOFIText variant="body">
          Apply the external suggestion to {selectedCount} selected item
          {selectedCount !== 1 ? 's' : ''}?
        </LOFIText>
        <LOFIText variant="muted">
          This will mark each selected row as mapped using the suggested external value. Individual
          mappings can be removed using Unmap.
        </LOFIText>
      </LOFIModal>
    </div>
  );
}
