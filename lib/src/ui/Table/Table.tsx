import {
  useReactTable,
  getCoreRowModel,
  getExpandedRowModel,
  getSortedRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type Row,
} from '@tanstack/react-table';
import { useState, type ReactNode } from 'react';
import { Text } from '../Text/Text';
import {
  LofiArrowDownIcon,
  LofiArrowUpIcon,
  LofiCaretSortIcon,
  LofiChevronDownIcon,
  LofiChevronRightIcon,
} from '../Util/LofiRadixIcons';
import './Table.scss';

export type { ColumnDef };

/**
 * Place in `ColumnDef.meta` to control column layout behaviour.
 *
 * - `shrink: true`  — column wraps tightly around its content (use for action
 *   clusters, badges, and other fixed-width cells). Renders `table__th--shrink`
 *   / `table__td--shrink` (CSS: `width: 1%; white-space: nowrap`).
 *
 * - No meta + no `size` — column is *fluid*: it absorbs the remaining table
 *   width. Renders `table__th--fluid` / `table__td--fluid` (`min-width: 0`
 *   enables truncation on deeply nested text). Only one fluid column per table
 *   is recommended; use it for the primary entity/name column.
 */
export interface TableColumnMeta {
  shrink?: boolean;
}

export interface TableProps<T> {
  /** TanStack column definitions (headers, accessors, cells). */
  columns:         ColumnDef<T, unknown>[];
  /** Row data array; shape matches column accessors. */
  rows:            T[];
  /** Stable row id key for expand/sort identity; recommend a unique id field on T. */
  keyField?:       keyof T;
  /** If true, rows toggle expansion; requires renderExpanded. */
  expandable?:     boolean;
  /** Renders detail content below the row when expanded; required if expandable. */
  renderExpanded?: (row: Row<T>) => ReactNode;
  /** Message in the table body when rows is empty (default "No data"). */
  emptyText?:      string;
  /**
   * Rich content rendered inside the empty cell when rows is empty.
   * Takes precedence over emptyText. Use to embed an empty-state component
   * (e.g. LOFIEmptyState) while keeping table headers visible —
   * the first-use chrome pattern.
   */
  emptySlot?:      ReactNode;
  /** Optional line above the table (instructions, filter summary). */
  hint?:           string;
  /** If true, clickable headers cycle sort asc/desc. */
  sortable?:       boolean;
  /**
   * When expandable, constrains the detail body with max-height + scroll and keeps the
   * **parent data row** sticky while the surrounding region scrolls (P2.5, P9).
   * Default: true when `expandable` is true.
   */
  expandableStickyDetail?: boolean;
  /** CSS max-height for the scrollable detail body (e.g. `min(70vh, 28rem)`). */
  expandableDetailMaxHeight?: string;
}

export function Table<T>({
  columns,
  rows,
  keyField,
  expandable,
  renderExpanded,
  emptyText = 'No data',
  emptySlot,
  hint,
  sortable,
  expandableStickyDetail,
  expandableDetailMaxHeight = 'min(70vh, 28rem)',
}: TableProps<T>) {
  'use no memo';
  const [sorting, setSorting] = useState<SortingState>([]);

  const stickyDetail =
    expandable && expandableStickyDetail !== false;

  // TanStack Table exposes unstable function identities from getters — acceptable for this wrapper.
  // eslint-disable-next-line react-hooks/incompatible-library -- TanStack React Table + React Compiler compatibility note
  const table = useReactTable({
    data: rows,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getSortedRowModel: sortable ? getSortedRowModel() : undefined,
    getRowCanExpand: () => Boolean(expandable && renderExpanded),
    getRowId: keyField ? (row) => String(row[keyField]) : undefined,
  });

  return (
    <div className="table-wrap">
      {hint && (
        <div className="table-wrap__hint">
          <Text as="span" variant="inherit">{hint}</Text>
        </div>
      )}
      <div className="table-wrap__scroll">
        <table className="table">
          <thead>
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {expandable && <th className="table__th" style={{ width: 28 }} />}
                {hg.headers.map((header) => {
                  const canSort = sortable && header.column.getCanSort();
                  const sorted  = header.column.getIsSorted();
                  const def     = header.column.columnDef;
                  const meta    = def.meta as TableColumnMeta | undefined;
                  const isShrink = meta?.shrink === true;
                  const hasSize  = def.size !== undefined;
                  const thClass = [
                    'table__th',
                    canSort   ? 'table__th--sortable' : '',
                    sorted    ? 'table__th--sorted'   : '',
                    isShrink  ? 'table__th--shrink'   : (!hasSize ? 'table__th--fluid' : ''),
                  ].filter(Boolean).join(' ');
                  return (
                    <th
                      key={header.id}
                      className={thClass}
                      style={hasSize ? { width: `${def.size}px` } : undefined}
                      onClick={canSort ? header.column.getToggleSortingHandler() : undefined}
                    >
                      {flexRender(def.header, header.getContext())}
                      {canSort && (
                        <span
                          className={[
                            'table__sort-indicator',
                            sorted ? 'table__sort-indicator--active' : '',
                          ].filter(Boolean).join(' ')}
                          aria-hidden="true"
                        >
                          {sorted === 'asc' ? (
                            <LofiArrowUpIcon size={12} />
                          ) : sorted === 'desc' ? (
                            <LofiArrowDownIcon size={12} />
                          ) : (
                            <LofiCaretSortIcon size={12} />
                          )}
                        </span>
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowCount() === 0 ? (
              <tr>
                <td
                  className={['table__empty', emptySlot ? 'table__empty--slot' : ''].filter(Boolean).join(' ')}
                  colSpan={columns.length + (expandable ? 1 : 0)}
                >
                  {emptySlot ?? <Text as="span" variant="inherit">{emptyText}</Text>}
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.flatMap((row) => {
                const expandedSticky =
                  Boolean(expandable && stickyDetail && row.getIsExpanded());
                const mainRow = (
                  <tr
                    key={row.id}
                    className={[
                      'table__row',
                      expandable ? 'table__row--expandable' : '',
                      expandedSticky ? 'table__row--expanded-sticky' : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    onClick={expandable ? () => row.toggleExpanded() : undefined}
                  >
                    {expandable && (
                      <td className="table__td table__td--expand">
                        {row.getIsExpanded() ? (
                          <LofiChevronDownIcon size={12} />
                        ) : (
                          <LofiChevronRightIcon size={12} />
                        )}
                      </td>
                    )}
                    {row.getVisibleCells().map((cell) => {
                      const cdef     = cell.column.columnDef;
                      const cmeta    = cdef.meta as TableColumnMeta | undefined;
                      const cShrink  = cmeta?.shrink === true;
                      const cHasSize = cdef.size !== undefined;
                      const tdClass  = [
                        'table__td',
                        cShrink  ? 'table__td--shrink' : (!cHasSize ? 'table__td--fluid' : ''),
                      ].filter(Boolean).join(' ');
                      return (
                        <td key={cell.id} className={tdClass}>
                          {flexRender(cdef.cell, cell.getContext())}
                        </td>
                      );
                    })}
                  </tr>
                );

                if (expandable && row.getIsExpanded() && renderExpanded) {
                  const detailInner = stickyDetail ? (
                    <div className="table__detail-content">
                      <div
                        className="table__detail-scroll"
                        style={{ maxHeight: expandableDetailMaxHeight }}
                      >
                        {renderExpanded(row)}
                      </div>
                    </div>
                  ) : (
                    <div className="table__detail-content">{renderExpanded(row)}</div>
                  );

                  return [
                    mainRow,
                    <tr key={`${row.id}-detail`} className="table__row table__row--detail">
                      <td />
                      <td colSpan={columns.length}>{detailInner}</td>
                    </tr>,
                  ];
                }
                return [mainRow];
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
