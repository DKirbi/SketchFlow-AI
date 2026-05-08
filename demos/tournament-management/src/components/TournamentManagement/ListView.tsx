import { useMemo, useState, type ReactNode } from 'react';
import {
  LOFIBadge,
  LOFIButton,
  LOFICheckbox,
  LOFIEmptyState,
  LOFILoader,
  LOFIMainWorkspace,
  LOFIStatefulButton,
  LOFITable,
  LOFIText,
  type ColumnDef,
  type TableColumnMeta,
} from 'lofi-kit';

import { applyListLevelFilter } from '../../lib/applyFilters';
import type { Role, SimpleTournament } from '../../types';
import { ListHeader } from './ListHeader';

export interface ListViewProps {
  title: string;
  breadcrumb?: ReactNode;
  rows: SimpleTournament[];
  uniqueTournamentLabels: Map<string, string>;
  role: Role;
  loading: boolean;
  selectedRowIds: Set<string>;
  onToggleRowSelection: (id: string, checked: boolean) => void;
  onToggleAllRows: (checked: boolean) => void;
  onCreate: () => void;
  onEdit: (id: string) => void;
  onClone: (id: string) => void;
  onRemove: (id: string) => void;
  onMove: (id: string) => void;
  onToggleDisabled: (id: string) => void;
  onBulkMove: (ids: string[]) => void;
  onBulkClone: (ids: string[]) => void;
  onBulkRemove: (ids: string[]) => void;
  onBulkToggleDisabled: (ids: string[]) => void;
  onRetrySearch: () => void;
}

function typeLabel(ct: SimpleTournament['competitionType']): string {
  if (ct === 'league') return 'League';
  if (ct === 'cup') return 'Cup';
  return 'Neither';
}

function visibleRange(st: SimpleTournament): string {
  if (!st.startTime && !st.endTime) return '—';
  return `${st.startTime || '—'} → ${st.endTime || '—'}`;
}

export function ListView({
  title,
  breadcrumb,
  rows,
  uniqueTournamentLabels,
  role,
  loading,
  selectedRowIds,
  onToggleRowSelection,
  onToggleAllRows,
  onCreate,
  onEdit,
  onClone,
  onRemove,
  onMove,
  onToggleDisabled,
  onBulkMove,
  onBulkClone,
  onBulkRemove,
  onBulkToggleDisabled,
  onRetrySearch,
}: ListViewProps) {
  const canDanger = role === 'supervisor' || role === 'admin';

  const [search, setSearch] = useState('');
  const [showUnique, setShowUnique] = useState(true);
  const [showSimple, setShowSimple] = useState(true);

  const visibleRows = useMemo(
    () => applyListLevelFilter(rows, { search, showUnique, showSimple }),
    [rows, search, showUnique, showSimple],
  );

  const selectedRows = visibleRows.filter((row) => selectedRowIds.has(row.id));
  const selectedCount = selectedRows.length;
  const allSelected = visibleRows.length > 0 && selectedCount === visibleRows.length;
  const firstSelectedId = selectedRows[0]?.id;
  const disableAnyActive = selectedRows.some((row) => !row.disabled);
  const disableSelectedLabel =
    selectedCount === 0
      ? 'Disable selected'
      : disableAnyActive
        ? `Disable selected (${selectedCount})`
        : `Enable selected (${selectedCount})`;

  const columns: ColumnDef<SimpleTournament, unknown>[] = useMemo(
    () => [
      {
        id: 'selected',
        header: () => (
          <LOFICheckbox
            size="sm"
            checked={allSelected}
            onChange={onToggleAllRows}
            label=""
            id="list-select-all"
          />
        ),
        meta: { shrink: true } satisfies TableColumnMeta,
        cell: ({ row }) => (
          <LOFICheckbox
            size="sm"
            checked={selectedRowIds.has(row.original.id)}
            onChange={(checked) => onToggleRowSelection(row.original.id, checked)}
            label=""
            id={`list-select-${row.original.id}`}
          />
        ),
      },
      {
        accessorKey: 'id',
        header: 'ID',
        meta: { shrink: true } satisfies TableColumnMeta,
        cell: ({ row }) => <LOFIBadge variant="id" label={row.original.id} />,
      },
      {
        accessorKey: 'name',
        header: 'Name',
        cell: ({ row }) => <LOFIText variant="body">{row.original.name}</LOFIText>,
      },
      {
        id: 'class',
        header: 'Class',
        meta: { shrink: true } satisfies TableColumnMeta,
        cell: ({ row }) => (
          <LOFIBadge
            variant="tag"
            label={row.original.uniqueTournamentId === '' ? 'Simple' : 'Unique'}
          />
        ),
      },
      {
        accessorKey: 'uniqueTournamentId',
        header: 'Unique tournament',
        meta: { shrink: true } satisfies TableColumnMeta,
        cell: ({ row }) => (
          <LOFIText variant="sm">
            {row.original.uniqueTournamentId === ''
              ? '—'
              : uniqueTournamentLabels.get(row.original.uniqueTournamentId) ??
                row.original.uniqueTournamentId}
          </LOFIText>
        ),
      },
      {
        accessorKey: 'visibility',
        header: 'Visible from / to',
        meta: { shrink: true } satisfies TableColumnMeta,
        cell: ({ row }) => <LOFIText variant="micro">{visibleRange(row.original)}</LOFIText>,
      },
      {
        accessorKey: 'competitionType',
        header: 'Type',
        meta: { shrink: true } satisfies TableColumnMeta,
        cell: ({ row }) => (
          <LOFIBadge variant="tag" label={typeLabel(row.original.competitionType)} />
        ),
      },
      {
        accessorKey: 'disabled',
        header: 'Status',
        meta: { shrink: true } satisfies TableColumnMeta,
        cell: ({ row }) => (
          <LOFIBadge
            variant="status"
            active={!row.original.disabled}
            label={row.original.disabled ? 'disabled' : 'active'}
          />
        ),
      },
      {
        id: 'actions',
        header: 'Actions',
        meta: { shrink: true } satisfies TableColumnMeta,
        cell: ({ row }) => {
          const st = row.original;
          const disabledLab = st.disabled ? 'Enable' : 'Disable';
          return (
            <div className="tmgmt__row-actions">
              <LOFIButton type="button" variant="default" size="small" onClick={() => onEdit(st.id)}>
                Edit
              </LOFIButton>
              <LOFIButton type="button" variant="dismiss" size="small" onClick={() => onClone(st.id)}>
                Clone
              </LOFIButton>
              <LOFIButton
                type="button"
                variant="dismiss"
                size="small"
                onClick={() => onToggleDisabled(st.id)}
              >
                {disabledLab}
              </LOFIButton>
              {canDanger && (
                <>
                  <LOFIButton
                    type="button"
                    variant="dismiss"
                    size="small"
                    onClick={() => onMove(st.id)}
                  >
                    Move
                  </LOFIButton>
                  <LOFIButton
                    type="button"
                    variant="primary"
                    size="small"
                    onClick={() => onRemove(st.id)}
                  >
                    Remove
                  </LOFIButton>
                </>
              )}
            </div>
          );
        },
      },
    ],
    [
      allSelected,
      canDanger,
      onClone,
      onEdit,
      onMove,
      onRemove,
      onToggleAllRows,
      onToggleDisabled,
      onToggleRowSelection,
      selectedRowIds,
      uniqueTournamentLabels,
    ],
  );

  if (loading) {
    return (
      <LOFIMainWorkspace breadcrumb={breadcrumb} title={title}>
        <div className="tmgmt__list">
          <ListHeader
            scopeKey="list-loading"
            onCreate={onCreate}
            search={search}
            onSearchChange={setSearch}
            showUnique={showUnique}
            onToggleUnique={setShowUnique}
            showSimple={showSimple}
            onToggleSimple={setShowSimple}
          />
          <div className="tmgmt__loading-bloc">
            <LOFILoader label="Loading" />
            <LOFIText variant="muted">Refreshing list…</LOFIText>
          </div>
        </div>
      </LOFIMainWorkspace>
    );
  }

  return (
    <LOFIMainWorkspace breadcrumb={breadcrumb} title={title}>
      <div className="tmgmt__list">
        <ListHeader
          scopeKey="list"
          onCreate={onCreate}
          search={search}
          onSearchChange={setSearch}
          showUnique={showUnique}
          onToggleUnique={setShowUnique}
          showSimple={showSimple}
          onToggleSimple={setShowSimple}
        />

        <div className="tmgmt__list-actions">
          <LOFIButton
            type="button"
            variant="default"
            size="small"
            disabled={!firstSelectedId || selectedCount > 1}
            onClick={() => firstSelectedId && onEdit(firstSelectedId)}
          >
            Edit selected
          </LOFIButton>
          <LOFIStatefulButton
            state="idle"
            variant="dismiss"
            size="small"
            idleLabel={selectedCount > 0 ? `Move selected (${selectedCount})` : 'Move selected'}
            successLabel="Moved"
            onClick={
              selectedCount > 0
                ? () => onBulkMove(selectedRows.map((row) => row.id))
                : undefined
            }
          />
          <LOFIStatefulButton
            state="idle"
            variant="dismiss"
            size="small"
            idleLabel={selectedCount > 0 ? `Clone selected (${selectedCount})` : 'Clone selected'}
            successLabel="Cloned"
            onClick={
              selectedCount > 0
                ? () => onBulkClone(selectedRows.map((row) => row.id))
                : undefined
            }
          />
          <LOFIStatefulButton
            state="idle"
            variant="dismiss"
            size="small"
            idleLabel={disableSelectedLabel}
            successLabel="Updated"
            onClick={
              selectedCount > 0
                ? () => onBulkToggleDisabled(selectedRows.map((row) => row.id))
                : undefined
            }
          />
          {canDanger && (
            <LOFIStatefulButton
              state="idle"
              variant="primary"
              size="small"
              idleLabel={selectedCount > 0 ? `Remove selected (${selectedCount})` : 'Remove selected'}
              successLabel="Removed"
              onClick={
                selectedCount > 0
                  ? () => onBulkRemove(selectedRows.map((row) => row.id))
                  : undefined
              }
            />
          )}
        </div>

        <LOFIText variant="description" className="tmgmt__list-hint">
          Move, Disable / Enable, and Remove use confirmation. Clone applies immediately.
        </LOFIText>

        <LOFITable
          columns={columns}
          rows={visibleRows}
          sortable
          keyField="id"
          emptySlot={
            <LOFIEmptyState
              variant="no-results"
              title="No tournaments in this selection scope."
              description="Choose another node or widen filters, then Search again."
              action={
                <LOFIButton type="button" variant="default" onClick={onRetrySearch}>
                  Run Search again
                </LOFIButton>
              }
            />
          }
        />
      </div>
    </LOFIMainWorkspace>
  );
}
