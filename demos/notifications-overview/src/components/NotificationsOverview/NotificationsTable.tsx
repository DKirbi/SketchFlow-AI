import { useMemo, type ReactNode } from 'react';
import type { ColumnDef, TableColumnMeta } from 'lofi-kit';
import {
  LOFIButton,
  LOFIEmptyState,
  LOFIMainWorkspace,
  LOFIStatefulButton,
  LOFITable,
  LOFIText,
} from 'lofi-kit';
import type { NotificationRow } from '../../types';
import { formatGenerated } from '../../lib/formatGenerated';
import { sortValueForTable } from '../../lib/sortNotifications';
import { PriorityLabel } from './PriorityLabel';
import './NotificationsOverview.scss';

export type TableVariant = 'pending' | 'resolved';

export type EmptyReason = 'no-selection' | 'no-results' | null;

export interface NotificationsTableProps {
  variant: TableVariant;
  title: string;
  displayRows: NotificationRow[];
  totalAfterFilters: number;
  emptyReason: EmptyReason;
  onClearFilters: () => void;
  onResolve: (id: string) => void;
  resolvingId: string | null;
}

function pendingColumns(
  onResolve: (id: string) => void,
  resolvingId: string | null,
): ColumnDef<NotificationRow, unknown>[] {
  return [
    {
      id: 'priority',
      header: 'Priority',
      accessorFn: (row) => sortValueForTable(row),
      meta: { shrink: true } satisfies TableColumnMeta,
      cell: ({ row }) => <PriorityLabel row={row.original} />,
    },
    {
      accessorKey: 'messageName',
      header: 'Message Name',
      cell: ({ row }) => <LOFIText variant="body">{row.original.messageName}</LOFIText>,
    },
    {
      accessorKey: 'matchLabel',
      header: 'Match',
      cell: ({ row }) => <LOFIText variant="sm">{row.original.matchLabel}</LOFIText>,
    },
    {
      accessorKey: 'tournament',
      header: 'Category / Tournament',
      cell: ({ row }) => <LOFIText variant="sm">{row.original.tournament}</LOFIText>,
    },
    {
      accessorKey: 'sport',
      header: 'Sport',
      meta: { shrink: true } satisfies TableColumnMeta,
      cell: ({ row }) => <LOFIText variant="micro">{row.original.sport}</LOFIText>,
    },
    {
      id: 'generated',
      header: 'Generated',
      accessorFn: (row) => Date.parse(row.generatedAt),
      meta: { shrink: true } satisfies TableColumnMeta,
      cell: ({ row }) => (
        <LOFIText variant="micro">{formatGenerated(row.original.generatedAt)}</LOFIText>
      ),
    },
    {
      id: 'assign',
      header: 'Assign',
      meta: { shrink: true } satisfies TableColumnMeta,
      cell: ({ row }) => {
        const id = row.original.id;
        const st = resolvingId === id ? 'loading' : 'idle';
        return (
          <LOFIStatefulButton
            state={st}
            idleLabel="Resolve"
            successLabel="Resolved"
            loadingLabel="Resolving"
            size="compact"
            variant="primary"
            onClick={() => onResolve(id)}
          />
        );
      },
    },
  ];
}

function resolvedColumns(): ColumnDef<NotificationRow, unknown>[] {
  return [
    {
      id: 'priority',
      header: 'Priority',
      accessorFn: (row) => sortValueForTable(row),
      meta: { shrink: true } satisfies TableColumnMeta,
      cell: ({ row }) => <PriorityLabel row={row.original} />,
    },
    {
      accessorKey: 'messageName',
      header: 'Message Name',
      cell: ({ row }) => <LOFIText variant="body">{row.original.messageName}</LOFIText>,
    },
    {
      accessorKey: 'matchLabel',
      header: 'Match',
      cell: ({ row }) => <LOFIText variant="sm">{row.original.matchLabel}</LOFIText>,
    },
    {
      accessorKey: 'tournament',
      header: 'Category / Tournament',
      cell: ({ row }) => <LOFIText variant="sm">{row.original.tournament}</LOFIText>,
    },
    {
      accessorKey: 'sport',
      header: 'Sport',
      meta: { shrink: true } satisfies TableColumnMeta,
      cell: ({ row }) => <LOFIText variant="micro">{row.original.sport}</LOFIText>,
    },
    {
      id: 'generated',
      header: 'Generated',
      accessorFn: (row) => Date.parse(row.generatedAt),
      meta: { shrink: true } satisfies TableColumnMeta,
      cell: ({ row }) => (
        <LOFIText variant="micro">{formatGenerated(row.original.generatedAt)}</LOFIText>
      ),
    },
    {
      id: 'resolved',
      header: 'Resolved',
      accessorFn: (row) => (row.resolvedAt ? Date.parse(row.resolvedAt) : 0),
      meta: { shrink: true } satisfies TableColumnMeta,
      cell: ({ row }) => (
        <LOFIText variant="micro">
          {row.original.resolvedAt ? formatGenerated(row.original.resolvedAt) : '—'}
        </LOFIText>
      ),
    },
  ];
}

export function NotificationsTable({
  variant,
  title,
  displayRows,
  totalAfterFilters,
  emptyReason,
  onClearFilters,
  onResolve,
  resolvingId,
}: NotificationsTableProps) {
  const displayN = displayRows.length;

  const columns = useMemo(
    () => (variant === 'pending' ? pendingColumns(onResolve, resolvingId) : resolvedColumns()),
    [variant, onResolve, resolvingId],
  );

  let emptySlot: ReactNode | undefined;
  if (emptyReason === 'no-selection') {
    emptySlot = (
      <LOFIEmptyState
        variant="first-use"
        title="Select a group in the sidebar"
        description="Pick the betting urgency bucket or expand message types or matches, then choose a leaf to load the table."
      />
    );
  } else if (emptyReason === 'no-results') {
    emptySlot = (
      <LOFIEmptyState
        variant="no-results"
        title="No notifications match the current filters"
        description="Adjust filters or clear them to see the list again."
        action={
          <LOFIButton type="button" variant="default" onClick={onClearFilters}>
            Clear all
          </LOFIButton>
        }
      />
    );
  } else {
    emptySlot = undefined;
  }

  return (
    <LOFIMainWorkspace
      breadcrumb={
        <LOFIText variant="muted">
          Displaying {displayN} / {totalAfterFilters} notifications
        </LOFIText>
      }
      title={title}
    >
      <LOFITable<NotificationRow>
        keyField="id"
        columns={columns}
        rows={displayRows}
        sortable
        emptySlot={emptySlot}
        emptyText="No data"
      />
    </LOFIMainWorkspace>
  );
}
