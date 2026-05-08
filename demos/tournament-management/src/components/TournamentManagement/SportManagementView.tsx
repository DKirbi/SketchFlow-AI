import { useMemo, useState, type ReactNode } from 'react';
import {
  LOFIBadge,
  LOFIButton,
  LOFICheckbox,
  LOFIEmptyState,
  LOFIMainWorkspace,
  LOFIStatefulButton,
  LOFITable,
  LOFIText,
  type ColumnDef,
  type TableColumnMeta,
} from 'lofi-kit';

import { categoryById } from '../../data/catalog';
import { applyListLevelFilter } from '../../lib/applyFilters';
import type { Role, SimpleTournament } from '../../types';
import { ListHeader } from './ListHeader';

interface UniqueGroupRow {
  id: string;
  categoryLabel: string;
  uniqueLabel: string;
  rows: SimpleTournament[];
}

export interface SportManagementViewProps {
  title: string;
  breadcrumb?: ReactNode;
  rows: SimpleTournament[];
  uniqueTournamentLabels: Map<string, string>;
  role: Role;
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

export function SportManagementView({
  title,
  breadcrumb,
  rows,
  uniqueTournamentLabels,
  role,
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
}: SportManagementViewProps) {
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
  const firstSelectedId = selectedRows[0]?.id;
  const disableAnyActive = selectedRows.some((row) => !row.disabled);
  const disableSelectedLabel =
    selectedCount === 0
      ? 'Disable selected'
      : disableAnyActive
        ? `Disable selected (${selectedCount})`
        : `Enable selected (${selectedCount})`;

  const groupRows = useMemo<UniqueGroupRow[]>(() => {
    const grouped = new Map<string, UniqueGroupRow>();
    for (const row of visibleRows) {
      const branchId = row.uniqueTournamentId || `ut-none-${row.categoryId}`;
      const key = `${row.categoryId}:${branchId}`;
      const categoryLabel = categoryById(row.categoryId)?.label ?? row.categoryId;
      const uniqueLabel =
        row.uniqueTournamentId === ''
          ? 'No cross-season grouping'
          : uniqueTournamentLabels.get(row.uniqueTournamentId) ?? row.uniqueTournamentId;
      const rec = grouped.get(key);
      if (rec) {
        rec.rows.push(row);
      } else {
        grouped.set(key, {
          id: key,
          categoryLabel,
          uniqueLabel,
          rows: [row],
        });
      }
    }
    return [...grouped.values()].sort((a, b) => {
      const catDiff = a.categoryLabel.localeCompare(b.categoryLabel);
      if (catDiff !== 0) return catDiff;
      return a.uniqueLabel.localeCompare(b.uniqueLabel);
    });
  }, [visibleRows, uniqueTournamentLabels]);

  const simpleColumns: ColumnDef<SimpleTournament, unknown>[] = useMemo(
    () => [
      {
        id: 'selected',
        header: () => (
          <LOFICheckbox
            size="sm"
            checked={visibleRows.length > 0 && selectedCount === visibleRows.length}
            onChange={onToggleAllRows}
            label=""
            id="sport-select-all"
          />
        ),
        meta: { shrink: true } satisfies TableColumnMeta,
        cell: ({ row }) => (
          <LOFICheckbox
            size="sm"
            checked={selectedRowIds.has(row.original.id)}
            onChange={(checked) => onToggleRowSelection(row.original.id, checked)}
            label=""
            id={`sport-select-${row.original.id}`}
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
        header: 'Simple tournament',
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
                {st.disabled ? 'Enable' : 'Disable'}
              </LOFIButton>
              {canDanger && (
                <>
                  <LOFIButton type="button" variant="dismiss" size="small" onClick={() => onMove(st.id)}>
                    Move
                  </LOFIButton>
                  <LOFIButton type="button" variant="primary" size="small" onClick={() => onRemove(st.id)}>
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
      canDanger,
      onClone,
      onEdit,
      onMove,
      onRemove,
      onToggleAllRows,
      onToggleDisabled,
      onToggleRowSelection,
      visibleRows.length,
      selectedCount,
      selectedRowIds,
    ],
  );

  const groupColumns: ColumnDef<UniqueGroupRow, unknown>[] = useMemo(
    () => [
      {
        accessorKey: 'categoryLabel',
        header: 'Category',
      },
      {
        accessorKey: 'uniqueLabel',
        header: 'Unique tournament',
      },
      {
        id: 'count',
        header: 'Simple tournaments',
        meta: { shrink: true } satisfies TableColumnMeta,
        cell: ({ row }) => <LOFIBadge variant="tag" label={String(row.original.rows.length)} />,
      },
    ],
    [],
  );

  return (
    <LOFIMainWorkspace breadcrumb={breadcrumb} title={title}>
      <div className="tmgmt__list">
        <ListHeader
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
          Unique tournaments expand to simple tournament rows. Move, Disable / Enable, and Remove use confirmation. Clone applies immediately.
        </LOFIText>

        <LOFITable
          keyField="id"
          columns={groupColumns}
          rows={groupRows}
          sortable
          expandable
          renderExpanded={(groupRow) => (
            <LOFITable
              keyField="id"
              columns={simpleColumns}
              rows={groupRow.original.rows}
              sortable
              emptySlot={
                <LOFIEmptyState
                  variant="no-results"
                  title="No simple tournaments"
                  description="There are no rows in this unique tournament yet."
                />
              }
            />
          )}
          emptySlot={
            <LOFIEmptyState
              variant="no-results"
              title="No unique tournaments in this sport"
              description="Widen filters or add a new simple tournament."
            />
          }
        />
      </div>
    </LOFIMainWorkspace>
  );
}
