import { useState, useMemo, useCallback } from 'react';
import {
  LOFIToolbar,
  LOFITable,
  LOFICheckbox,
  LOFIButton,
  LOFIStatefulButton,
  LOFIBadge,
  LOFIText,
  LOFIModal,
} from 'lofi-kit';
import type { ColumnDef, TableColumnMeta } from 'lofi-kit';
import { INITIAL_ITEMS, CURRENT_USER, nowTimestamp } from './mockData';
import type { MappingItem } from './mockData';
import './MappingView.scss';

export function MappingView() {
  const [items, setItems] = useState<MappingItem[]>(INITIAL_ITEMS);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [loadingIds, setLoadingIds] = useState<Set<string>>(new Set());
  const [unmapConfirmId, setUnmapConfirmId] = useState<string | null>(null);
  const [bulkConfirmOpen, setBulkConfirmOpen] = useState(false);

  const pendingCount = items.filter((i) => i.status === 'pending').length;
  const mappedCount = items.filter((i) => i.status === 'mapped').length;
  const selectedCount = selected.size;
  const allSelected = items.length > 0 && selected.size === items.length;
  const someSelected = selected.size > 0 && !allSelected;

  // ── Selection helpers ──
  const toggleRow = useCallback((id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleAll = useCallback(() => {
    if (allSelected || someSelected) {
      setSelected(new Set());
    } else {
      setSelected(new Set(items.map((i) => i.id)));
    }
  }, [allSelected, someSelected, items]);

  // ── Map / Unmap ──
  const applyMap = useCallback((id: string) => {
    setLoadingIds((prev) => new Set(prev).add(id));
    setTimeout(() => {
      setItems((prev) =>
        prev.map((item) =>
          item.id === id
            ? { ...item, status: 'mapped', mappedAt: nowTimestamp(), mappedBy: CURRENT_USER.handle }
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
    }, 600);
  }, []);

  const applyUnmap = useCallback((id: string) => {
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
    }, 600);
  }, []);

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
    }, 800);
  }, [selected]);

  // ── Column definitions ──
  const columns: ColumnDef<MappingItem, unknown>[] = useMemo(
    () => [
      {
        id: 'select',
        header: () => (
          <LOFICheckbox
            id="select-all"
            label=""
            checked={allSelected || someSelected}
            onChange={toggleAll}
          />
        ),
        cell: ({ row }) => (
          <LOFICheckbox
            id={`sel-${row.original.id}`}
            label=""
            checked={selected.has(row.original.id)}
            onChange={() => toggleRow(row.original.id)}
          />
        ),
        size: 36,
        meta: { shrink: true } satisfies TableColumnMeta,
      },
      {
        id: 'internalValue',
        header: 'Internal Value',
        cell: ({ row }) => (
          <span className="mapping-view__internal">
            <LOFIBadge variant="id" label={row.original.id} />
            <LOFIText variant="body">{row.original.internalValue}</LOFIText>
          </span>
        ),
      },
      {
        id: 'externalSuggestion',
        header: 'External Suggestion',
        cell: ({ row }) => (
          <span className="mapping-view__suggestion">
            <LOFIText variant="body">{row.original.externalSuggestion}</LOFIText>
            <LOFIBadge variant="tag" label={`${row.original.confidence}%`} />
          </span>
        ),
      },
      {
        id: 'status',
        header: 'Status',
        meta: { shrink: true } satisfies TableColumnMeta,
        cell: ({ row }) => {
          const item = row.original;
          if (item.status === 'mapped') {
            return (
              <span className="mapping-view__status-cell">
                <LOFIBadge variant="status" active label="mapped" />
              </span>
            );
          }
          return (
            <span className="mapping-view__status-cell">
              <LOFIBadge variant="status" active={false} label="pending" />
            </span>
          );
        },
      },
      {
        id: 'actions',
        header: 'Actions',
        meta: { shrink: true } satisfies TableColumnMeta,
        cell: ({ row }) => {
          const item = row.original;
          const isLoading = loadingIds.has(item.id);
          const mapState = isLoading
            ? 'loading'
            : item.status === 'mapped'
              ? 'success'
              : 'idle';

          if (unmapConfirmId === item.id) {
            return (
              <span className="mapping-view__inline-confirm">
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
            <span className="mapping-view__actions">
              <LOFIStatefulButton
                state={mapState}
                idleLabel="Map"
                successLabel="Mapped"
                loadingLabel="Working"
                size="compact"
                onClick={() => applyMap(item.id)}
              />
              {item.status === 'mapped' && !isLoading && (
                <LOFIButton
                  variant="dismiss"
                  size="compact"
                  onClick={() => setUnmapConfirmId(item.id)}
                >
                  Unmap
                </LOFIButton>
              )}
            </span>
          );
        },
      },
    ],
    [
      allSelected,
      someSelected,
      selected,
      loadingIds,
      unmapConfirmId,
      toggleAll,
      toggleRow,
      applyMap,
      applyUnmap,
    ],
  );

  return (
    <div className="mapping-view">
      <LOFIToolbar
        left={
          <span className="mapping-view__identity">
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
          <span className="mapping-view__counts">
            <LOFIBadge variant="status" active label={`${mappedCount} mapped`} />
            <LOFIBadge variant="status" active={false} label={`${pendingCount} pending`} />
          </span>
        }
      />

      <div className="mapping-view__content">
        <div className="mapping-view__toolbar">
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
          rows={items}
          keyField="id"
          sortable
          emptyText="No mapping items."
          hint="Select rows to bulk-map. Use Map / Unmap to manage individual entries."
        />
      </div>

      {/* Bulk Map confirmation modal */}
      <LOFIModal
        open={bulkConfirmOpen}
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
