import React, { useMemo, useState, type ReactNode } from 'react';
import {
  PdsBox,
  PdsMantineBadge,
  PdsMantineButton,
  PdsMantineText,
  PdsTable,
  PdsTBody,
  PdsTBodyCell,
  PdsTBodyRow,
  PdsTHead,
  PdsTHeadCell,
  PdsTHeadRow,
} from '@podium-design-system/react-components';
import { Group } from '@mantine/core';
import type { NotificationRow } from '../../types';
import { operatorById } from '../../data/operators';
import { formatGenerated } from '../../lib/formatGenerated';

export type TableVariant = 'pending' | 'resolved';

export type EmptyReason = 'no-results' | null;

export interface NotificationsTableProps {
  variant: TableVariant;
  title: string;
  displayRows: NotificationRow[];
  totalAfterFilters: number;
  /** IDs of sidebar-selected rows — pinned to top and visually emphasised. */
  highlightedIds: Set<string>;
  emptyReason: EmptyReason;
  onClearFilters: () => void;
  onResolve: (id: string) => void;
  resolvingId: string | null;
  /** When false the Resolve button is hidden (Supervisor view). */
  canResolve: boolean;
  /** Highlight this row ID when set (timeline selection). */
  selectedNotificationId: string | null;
}

type SortColumnId =
  | 'priority'
  | 'messageName'
  | 'matchLabel'
  | 'tournament'
  | 'sport'
  | 'generated'
  | 'resolved'
  | 'operator';

type SortState = { id: SortColumnId; desc: boolean };

function sortRows(rows: NotificationRow[], sort: SortState | null): NotificationRow[] {
  if (!sort || rows.length === 0) return rows;

  const getVal = (r: NotificationRow): string | number => {
    switch (sort.id) {
      case 'priority':
        return r.priority;
      case 'messageName':
        return r.messageName;
      case 'matchLabel':
        return r.matchLabel;
      case 'tournament':
        return r.tournament;
      case 'sport':
        return r.sport;
      case 'generated':
        return Date.parse(r.generatedAt);
      case 'resolved':
        return r.resolvedAt ? Date.parse(r.resolvedAt) : 0;
      case 'operator':
        return r.assignedOperatorId ?? '';
      default:
        return 0;
    }
  };

  return [...rows].sort((a, b) => {
    const va = getVal(a);
    const vb = getVal(b);
    let cmp = 0;
    if (typeof va === 'number' && typeof vb === 'number') {
      cmp = va - vb;
    } else {
      cmp = String(va).localeCompare(String(vb));
    }
    return sort.desc ? -cmp : cmp;
  });
}

export function NotificationsTable({
  variant,
  title,
  displayRows,
  totalAfterFilters,
  highlightedIds,
  emptyReason,
  onClearFilters,
  onResolve,
  resolvingId,
  canResolve,
  selectedNotificationId,
}: NotificationsTableProps) {
  const displayN = displayRows.length;
  const [sort, setSort] = useState<SortState | null>(null);

  const sortedRows = useMemo(() => {
    const sorted = sortRows(displayRows, sort);
    if (highlightedIds.size === 0) return sorted;
    const top: NotificationRow[] = [];
    const rest: NotificationRow[] = [];
    for (const r of sorted) (highlightedIds.has(r.id) ? top : rest).push(r);
    return [...top, ...rest];
  }, [displayRows, sort, highlightedIds]);

  const headerClick = (id: SortColumnId, sortable: boolean) => {
    if (!sortable) return;
    setSort((prev) => {
      if (prev?.id === id) {
        return { id, desc: !prev.desc };
      }
      return { id, desc: false };
    });
  };

  const sortIndicator = (id: SortColumnId): false | 'asc' | 'desc' => {
    if (!sort || sort.id !== id) return false;
    return sort.desc ? 'desc' : 'asc';
  };

  if (emptyReason) {
    return (
      <PdsBox
        padding="lg"
        direction="column"
        gap="md"
        stretchHorizontal
        stretchVertical
        surface="on-light"
        style={{ flex: 1, minHeight: 0 }}
      >
        <PdsBox direction="column" gap="xs">
          <PdsMantineText type="body" fontSize="900" fontWeight="strong" surface="on-light">
            {title}
          </PdsMantineText>
          <PdsMantineText type="interface" fontSize="500" surface="on-light">
            Displaying {displayN} / {totalAfterFilters} notifications
          </PdsMantineText>
        </PdsBox>
        <PdsBox padding="lg" direction="column" gap="sm">
          <PdsMantineText type="body" fontSize="700" fontWeight="strong" surface="on-light">
            No notifications match the current filters
          </PdsMantineText>
          <PdsMantineText type="interface" fontSize="600" surface="on-light">
            Adjust filters or clear them to see the list again.
          </PdsMantineText>
          <PdsMantineButton rank="outline" color="neutral" surface="on-light" onClick={onClearFilters}>
            Clear all
          </PdsMantineButton>
        </PdsBox>
      </PdsBox>
    );
  }

  return (
    <PdsBox
      padding="lg"
      direction="column"
      gap="md"
      stretchHorizontal
      stretchVertical
      surface="on-light"
      style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}
    >
      <PdsBox direction="column" gap="xs">
        <PdsMantineText type="body" fontSize="900" fontWeight="strong" surface="on-light">
          {title}
        </PdsMantineText>
        <PdsMantineText type="interface" fontSize="500" surface="on-light">
          Displaying {displayN} / {totalAfterFilters} notifications
          {highlightedIds.size > 0 ? ` · ${highlightedIds.size} highlighted` : ''}
        </PdsMantineText>
      </PdsBox>

      <PdsMantineScrollShim>
        <PdsTable size="sm" stretch hasBorder borderIntensity="subtle">
          <PdsTHead>
            <PdsTHeadRow>
              <PdsTHeadCell
                enableSorting
                isSorted={sortIndicator('priority')}
                onToggleSort={() => headerClick('priority', true)}
              >
                <PdsMantineText type="interface" fontSize="600" surface="on-light">
                  Priority
                </PdsMantineText>
              </PdsTHeadCell>
              <PdsTHeadCell
                enableSorting
                isSorted={sortIndicator('messageName')}
                onToggleSort={() => headerClick('messageName', true)}
              >
                <PdsMantineText type="interface" fontSize="600" surface="on-light">
                  Message name
                </PdsMantineText>
              </PdsTHeadCell>
              <PdsTHeadCell
                enableSorting
                isSorted={sortIndicator('matchLabel')}
                onToggleSort={() => headerClick('matchLabel', true)}
              >
                <PdsMantineText type="interface" fontSize="600" surface="on-light">
                  Match
                </PdsMantineText>
              </PdsTHeadCell>
              <PdsTHeadCell
                enableSorting
                isSorted={sortIndicator('tournament')}
                onToggleSort={() => headerClick('tournament', true)}
              >
                <PdsMantineText type="interface" fontSize="600" surface="on-light">
                  Category / Tournament
                </PdsMantineText>
              </PdsTHeadCell>
              <PdsTHeadCell
                enableSorting
                isSorted={sortIndicator('sport')}
                onToggleSort={() => headerClick('sport', true)}
              >
                <PdsMantineText type="interface" fontSize="600" surface="on-light">
                  Sport
                </PdsMantineText>
              </PdsTHeadCell>
              <PdsTHeadCell
                enableSorting
                isSorted={sortIndicator('generated')}
                onToggleSort={() => headerClick('generated', true)}
              >
                <PdsMantineText type="interface" fontSize="600" surface="on-light">
                  Generated
                </PdsMantineText>
              </PdsTHeadCell>
              {variant === 'resolved' ? (
                <>
                  <PdsTHeadCell
                    enableSorting
                    isSorted={sortIndicator('resolved')}
                    onToggleSort={() => headerClick('resolved', true)}
                  >
                    <PdsMantineText type="interface" fontSize="600" surface="on-light">
                      Resolved
                    </PdsMantineText>
                  </PdsTHeadCell>
                  <PdsTHeadCell
                    enableSorting
                    isSorted={sortIndicator('operator')}
                    onToggleSort={() => headerClick('operator', true)}
                  >
                    <PdsMantineText type="interface" fontSize="600" surface="on-light">
                      Resolved by
                    </PdsMantineText>
                  </PdsTHeadCell>
                </>
              ) : (
                <>
                  <PdsTHeadCell
                    enableSorting
                    isSorted={sortIndicator('operator')}
                    onToggleSort={() => headerClick('operator', true)}
                  >
                    <PdsMantineText type="interface" fontSize="600" surface="on-light">
                      Assigned to
                    </PdsMantineText>
                  </PdsTHeadCell>
                  {canResolve && (
                    <PdsTHeadCell enableSorting={false}>
                      <PdsMantineText type="interface" fontSize="600" surface="on-light">
                        Action
                      </PdsMantineText>
                    </PdsTHeadCell>
                  )}
                </>
              )}
            </PdsTHeadRow>
          </PdsTHead>
          <PdsTBody>
            {sortedRows.map((row) => {
              const isSidebarHighlighted = highlightedIds.has(row.id);
              const isPinned = selectedNotificationId === row.id;
              const rowStyle: React.CSSProperties = {
                ...(isSidebarHighlighted && {
                  background: 'var(--pds-alias--color--info-100, #eff6ff)',
                  boxShadow: 'inset 3px 0 0 0 var(--pds-alias--color--info-700, #1d4ed8)',
                }),
                ...(isPinned && {
                  outline: '2px solid #0284c7',
                  outlineOffset: -2,
                }),
              };
              return (
                <PdsTBodyRow
                  key={row.id}
                  style={Object.keys(rowStyle).length > 0 ? rowStyle : undefined}
                >
                  <PdsTBodyCell>
                    <Group gap={6} wrap="nowrap" align="center">
                      <PdsMantineText
                        type="table"
                        fontSize="600"
                        fontWeight="strong"
                        surface="on-light"
                      >
                        {row.priority}
                      </PdsMantineText>
                      <PdsMantineBadge
                        color={row.priority > 5 ? 'warning' : 'attention'}
                        surface="on-light"
                        variant="filled"
                        size="sm"
                        aria-hidden
                      >
                        {'\u00A0'}
                      </PdsMantineBadge>
                    </Group>
                  </PdsTBodyCell>
                  <PdsTBodyCell>
                    <PdsMantineText
                      type="table"
                      fontSize="600"
                      fontWeight={isSidebarHighlighted ? 'strong' : undefined}
                      surface="on-light"
                    >
                      {row.messageName}
                    </PdsMantineText>
                  </PdsTBodyCell>
                  <PdsTBodyCell>
                    <PdsMantineText
                      type="table"
                      fontSize="600"
                      fontWeight={isSidebarHighlighted ? 'strong' : undefined}
                      surface="on-light"
                    >
                      {row.matchLabel}
                    </PdsMantineText>
                  </PdsTBodyCell>
                  <PdsTBodyCell>
                    <PdsMantineText type="table" fontSize="600" surface="on-light">
                      {row.tournament}
                    </PdsMantineText>
                  </PdsTBodyCell>
                  <PdsTBodyCell>
                    <PdsMantineText type="table" fontSize="600" surface="on-light">
                      {row.sport}
                    </PdsMantineText>
                  </PdsTBodyCell>
                  <PdsTBodyCell>
                    <PdsMantineText type="table" fontSize="600" surface="on-light">
                      {formatGenerated(row.generatedAt)}
                    </PdsMantineText>
                  </PdsTBodyCell>
                  {variant === 'resolved' ? (
                    <>
                      <PdsTBodyCell>
                        <PdsMantineText type="table" fontSize="600" surface="on-light">
                          {row.resolvedAt ? formatGenerated(row.resolvedAt) : '—'}
                        </PdsMantineText>
                      </PdsTBodyCell>
                      <PdsTBodyCell>
                        <PdsMantineText
                          type="table"
                          fontSize="600"
                          fontWeight={isSidebarHighlighted ? 'strong' : undefined}
                          surface="on-light"
                        >
                          {operatorById(row.resolvedByOperatorId)?.displayName ?? '—'}
                        </PdsMantineText>
                      </PdsTBodyCell>
                    </>
                  ) : (
                    <>
                      <PdsTBodyCell>
                        <PdsMantineText type="table" fontSize="600" surface="on-light">
                          {operatorById(row.assignedOperatorId)?.displayName ?? '—'}
                        </PdsMantineText>
                      </PdsTBodyCell>
                      {canResolve && (
                        <PdsTBodyCell>
                          <PdsMantineButton
                            size="sm"
                            rank="fill"
                            color="action"
                            surface="on-light"
                            loading={resolvingId === row.id}
                            onClick={() => onResolve(row.id)}
                          >
                            Resolve
                          </PdsMantineButton>
                        </PdsTBodyCell>
                      )}
                    </>
                  )}
                </PdsTBodyRow>
              );
            })}
          </PdsTBody>
        </PdsTable>
      </PdsMantineScrollShim>
    </PdsBox>
  );
}

/** Local scroll wrapper so the table does not blow past the workspace height. */
function PdsMantineScrollShim({ children }: { children: ReactNode }) {
  return (
    <div style={{ flex: 1, minHeight: 0, overflow: 'auto', width: '100%' }}>{children}</div>
  );
}
