import { useCallback, useEffect, useMemo, useState } from 'react';
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
import type { ShowcaseExampleProps } from './metadata';
import { computeAutomatedSnapshot } from './automatedPreview';
import { applyMappingFilters, filtersAreDefault } from './applyFilters';
import { FILTER_ALL, SPORTS } from './catalog';
import { MappingPreviewCursor } from './MappingPreviewCursor';
import { previewTargetAttr, resolveCursorTarget } from './previewCursor';
import { detectReducedMotion } from '../../runtime/previewStateMachine';
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

function isAutomatedMode(mode: ShowcaseExampleProps['mode']): boolean {
  return mode === 'preview' || mode === 'ready';
}

function resolveAutomatedMapState(
  item: MappingItem,
  snapshot: ReturnType<typeof computeAutomatedSnapshot>,
): StatefulButtonState {
  if (snapshot.loadingIds.has(item.id)) {
    return 'loading';
  }
  if (item.status === 'mapped') {
    return 'success';
  }
  return 'idle';
}

function statusLabel(item: MappingItem): string {
  if (item.status === 'mapped' && item.mappedBy) {
    return `mapped (${item.mappedBy})`;
  }
  return item.status === 'mapped' ? 'mapped' : 'pending';
}

function coerceSportValue(value: string): string {
  return value === '' ? FILTER_ALL : value;
}

export function MappingExample({
  mode,
  previewStepIndex,
  previewSteps,
  onInteractionComplete,
}: ShowcaseExampleProps) {
  const automated = isAutomatedMode(mode);
  const reducedMotion = useMemo(() => detectReducedMotion(), []);

  const automatedSnapshot = useMemo(
    () => computeAutomatedSnapshot(previewSteps, previewStepIndex),
    [previewStepIndex, previewSteps],
  );

  const cursorTarget = useMemo(() => {
    if (!automated || previewStepIndex < 0) return null;
    return resolveCursorTarget(previewSteps[previewStepIndex]);
  }, [automated, previewStepIndex, previewSteps]);

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
  const [hasCompletedInteraction, setHasCompletedInteraction] = useState(false);

  const resetState = useCallback(() => {
    const initial = createInitialState();
    setItems(initial.items);
    setSelected(initial.selected);
    setLoadingIds(initial.loadingIds);
    setUnmapConfirmId(initial.unmapConfirmId);
    setBulkConfirmOpen(initial.bulkConfirmOpen);
    setStatusMessage(initial.statusMessage);
    setFiltersDraft(initial.filtersDraft);
    setFiltersApplied(initial.filtersApplied);
    setHasCompletedInteraction(false);
  }, []);

  useEffect(() => {
    if (mode === 'interactive') {
      resetState();
    }
  }, [mode, resetState]);

  const sourceItems = automated ? automatedSnapshot.items : items;
  const displayItems = automated
    ? sourceItems
    : applyMappingFilters(sourceItems, filtersApplied);
  const displaySelected = automated ? automatedSnapshot.selected : selected;
  const displayLoadingIds = automated ? automatedSnapshot.loadingIds : loadingIds;
  const displayBulkConfirmOpen = automated ? automatedSnapshot.bulkConfirmOpen : bulkConfirmOpen;
  const displayStatusMessage = automated ? automatedSnapshot.statusMessage : statusMessage;

  const filtersMatch =
    filtersDraft.sportId === filtersApplied.sportId &&
    filtersDraft.tournamentQuery === filtersApplied.tournamentQuery;

  const pendingCount = displayItems.filter((item) => item.status === 'pending').length;
  const mappedCount = displayItems.filter((item) => item.status === 'mapped').length;
  const selectedCount = displaySelected.size;
  const allSelected = displayItems.length > 0 && displaySelected.size === displayItems.length;
  const someSelected = displaySelected.size > 0 && !allSelected;

  const patchFiltersDraft = useCallback((partial: Partial<MappingFilters>) => {
    setFiltersDraft((prev) => ({ ...prev, ...partial }));
  }, []);

  const commitSearch = useCallback(() => {
    if (automated) return;
    setFiltersApplied({ ...filtersDraft });
  }, [automated, filtersDraft]);

  const clearAllFilters = useCallback(() => {
    if (automated) return;
    setFiltersDraft({ ...DEFAULT_FILTERS });
    setFiltersApplied({ ...DEFAULT_FILTERS });
  }, [automated]);

  const toggleRow = useCallback(
    (id: string) => {
      if (automated) return;
      setSelected((prev) => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        return next;
      });
    },
    [automated],
  );

  const toggleAll = useCallback(() => {
    if (automated) return;
    if (allSelected || someSelected) {
      setSelected(new Set());
    } else {
      setSelected(new Set(displayItems.map((item) => item.id)));
    }
  }, [allSelected, automated, displayItems, someSelected]);

  const applyMap = useCallback(
    (id: string) => {
      if (automated) return;
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
        if (!hasCompletedInteraction) {
          setHasCompletedInteraction(true);
          onInteractionComplete();
        }
      }, MAP_DELAY_MS);
    },
    [automated, hasCompletedInteraction, onInteractionComplete],
  );

  const applyUnmap = useCallback(
    (id: string) => {
      if (automated) return;
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
    [automated],
  );

  const applyBulkMap = useCallback(() => {
    if (automated) return;
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
      if (!hasCompletedInteraction) {
        setHasCompletedInteraction(true);
        onInteractionComplete();
      }
    }, BULK_MAP_DELAY_MS);
  }, [automated, hasCompletedInteraction, onInteractionComplete, selected]);

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
            disabled={automated}
          />
        ),
        cell: ({ row }) => (
          <span
            data-preview-target={previewTargetAttr({
              kind: 'row-checkbox',
              rowId: row.original.id,
            })}
          >
            <LOFICheckbox
              id={`sel-${row.original.id}`}
              label=""
              size="default"
              checked={displaySelected.has(row.original.id)}
              onChange={() => toggleRow(row.original.id)}
              disabled={automated}
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
          <span
            className="mapping-example__internal"
            data-preview-target={previewTargetAttr({ kind: 'row', rowId: row.original.id })}
          >
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
          const mapState: StatefulButtonState = automated
            ? resolveAutomatedMapState(item, automatedSnapshot)
            : isLoading
              ? 'loading'
              : item.status === 'mapped'
                ? 'success'
                : 'idle';

          const isMapHighlight =
            automated && automatedSnapshot.highlightRowId === item.id && item.status === 'pending';

          const isUnmapHighlight =
            automated &&
            (automatedSnapshot.unmapHighlightRowId === item.id ||
              (automatedSnapshot.loadingIds.has(item.id) && item.status === 'mapped'));

          if (!automated && unmapConfirmId === item.id) {
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
            <span
              className={
                isMapHighlight || isUnmapHighlight
                  ? 'mapping-example__actions mapping-example__actions-col mapping-example__actions--highlight'
                  : 'mapping-example__actions mapping-example__actions-col'
              }
            >
              <span data-preview-target={previewTargetAttr({ kind: 'row-map', rowId: item.id })}>
                <LOFIStatefulButton
                  state={mapState}
                  idleLabel="Map"
                  successLabel="Mapped"
                  loadingLabel="Working"
                  size="compact"
                  onClick={() => {
                    if (!automated && item.status === 'pending' && !isLoading) {
                      applyMap(item.id);
                    }
                  }}
                />
              </span>
              {(automated ? item.status === 'mapped' : item.status === 'mapped' && !isLoading) && (
                <span
                  data-preview-target={previewTargetAttr({ kind: 'row-unmap', rowId: item.id })}
                >
                  <LOFIButton
                    variant="dismiss"
                    size="compact"
                    disabled={automated}
                    onClick={() => {
                      if (!automated) setUnmapConfirmId(item.id);
                    }}
                  >
                    {automated && isLoading ? 'Working' : 'Unmap'}
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
      automated,
      automatedSnapshot,
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
      <MappingPreviewCursor
        target={cursorTarget}
        visible={automated}
        reducedMotion={reducedMotion}
      />

      <LOFIToolbar
        left={
          <span className="mapping-example__identity">
            <LOFIText variant="sm">{CURRENT_USER.handle}</LOFIText>
            <LOFIBadge variant="tag" label={CURRENT_USER.role} />
          </span>
        }
        center={
          <LOFIText as="h1" variant="body">
            Value Mapping
          </LOFIText>
        }
        right={
          <span className="mapping-example__counts">
            <LOFIBadge variant="status" active label={`${mappedCount} mapped`} />
            <LOFIBadge variant="status" active={false} label={`${pendingCount} pending`} />
          </span>
        }
      />

      <div className="mapping-example__content">
        <div className="mapping-example__filters" role="search">
          <LOFIField label="Sport" htmlFor="map-sport">
            <LOFISelect
              id="map-sport"
              allowClear
              placeholder="All sports"
              disabled={automated}
              value={filtersDraft.sportId === FILTER_ALL ? FILTER_ALL : filtersDraft.sportId}
              onChange={(value) => patchFiltersDraft({ sportId: coerceSportValue(value) })}
              options={[
                { value: FILTER_ALL, label: 'All sports' },
                ...SPORTS.map((sport) => ({ value: sport.id, label: sport.label })),
              ]}
            />
          </LOFIField>
          <LOFIField label="Tournament" htmlFor="map-tournament">
            <LOFIInput
              id="map-tournament"
              type="search"
              allowClear
              disabled={automated}
              placeholder="Search by name or id…"
              value={filtersDraft.tournamentQuery}
              onChange={(value) => patchFiltersDraft({ tournamentQuery: value })}
            />
          </LOFIField>
          <div className="mapping-example__filters-actions">
            <LOFIButton
              type="button"
              variant="primary"
              disabled={automated || filtersMatch}
              onClick={commitSearch}
            >
              Search
            </LOFIButton>
            <LOFIButton
              type="button"
              variant="dismiss"
              disabled={automated || filtersAreDefault(filtersDraft)}
              onClick={clearAllFilters}
            >
              Clear all
            </LOFIButton>
          </div>
        </div>

        <div
          className={
            automated && automatedSnapshot.highlightBulkToolbar
              ? 'mapping-example__toolbar mapping-example__toolbar--highlight'
              : 'mapping-example__toolbar'
          }
          data-preview-target={previewTargetAttr({ kind: 'bulk-toolbar' })}
        >
          <LOFIButton
            variant="primary"
            disabled={automated || selectedCount === 0}
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
            <span data-preview-target={previewTargetAttr({ kind: 'bulk-confirm' })}>
              <LOFIButton variant="primary" onClick={applyBulkMap}>
                Apply to {selectedCount} item{selectedCount !== 1 ? 's' : ''}
              </LOFIButton>
            </span>
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
