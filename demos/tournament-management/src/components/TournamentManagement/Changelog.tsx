import type { ColumnDef, TableColumnMeta } from 'lofi-kit';
import { LOFIBadge, LOFITable, LOFIText } from 'lofi-kit';

import type { ChangelogEntry } from '../../types';

export interface ChangelogProps {
  entries: ChangelogEntry[];
  entityIdFilter?: string;
}

export function Changelog({ entries, entityIdFilter }: ChangelogProps) {
  const filtered = entityIdFilter
    ? entries.filter((x) => x.entityId === entityIdFilter)
    : entries;

  const columns: ColumnDef<ChangelogEntry, unknown>[] = [
    {
      accessorKey: 'timestamp',
      header: 'When',
      meta: { shrink: true } satisfies TableColumnMeta,
      cell: ({ row }) => <LOFIText variant="micro">{row.original.timestamp}</LOFIText>,
    },
    {
      accessorKey: 'userHandle',
      header: 'User',
      meta: { shrink: true } satisfies TableColumnMeta,
      cell: ({ row }) => <LOFIText variant="sm">{row.original.userHandle}</LOFIText>,
    },
    {
      accessorKey: 'userRole',
      header: 'Role',
      meta: { shrink: true } satisfies TableColumnMeta,
      cell: ({ row }) => <LOFIBadge variant="tag" label={row.original.userRole} />,
    },
    {
      accessorKey: 'entityId',
      header: 'Entity',
      meta: { shrink: true } satisfies TableColumnMeta,
      cell: ({ row }) => <LOFIBadge variant="id" label={row.original.entityId} />,
    },
    {
      accessorKey: 'action',
      header: 'Action',
      meta: { shrink: true } satisfies TableColumnMeta,
      cell: ({ row }) => (
        <LOFIBadge variant="status" active label={row.original.action} />
      ),
    },
    {
      accessorKey: 'summary',
      header: 'Summary',
      cell: ({ row }) => <LOFIText variant="muted">{row.original.summary}</LOFIText>,
    },
  ];

  return (
    <div className="tmgmt__changelog">
      <LOFIText variant="sm" className="tmgmt__changelog-lead">
        {entityIdFilter ? 'Entries for this tournament (newest first).' : 'Workspace log (newest first).'}
      </LOFIText>
      <LOFITable<ChangelogEntry>
        columns={columns}
        rows={filtered}
        keyField="id"
        sortable
        emptyText="No changelog entries yet — perform a mutation."
      />
    </div>
  );
}
