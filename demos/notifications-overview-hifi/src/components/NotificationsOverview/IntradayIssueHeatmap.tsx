import { useMemo, useState } from 'react';
import { Tooltip } from '@mantine/core';
import {
  PdsMantineMultiselect,
  PdsMantineText,
  type PdsMantineMultiselectDataObject,
} from '@podium-design-system/react-components';
import type { NotificationRow } from '../../types';
import { DEMO_NOW_MS } from '../../data/notifications';
import {
  buildIntradayBuckets,
  cellFillColor,
  CELL_EMPTY_COLOR,
  CELL_EMPTY_BORDER,
  HEATMAP_HOURS,
  HEATMAP_START_HOUR,
  intradayDayOptions,
  pendingCellColor,
  priorityLabel,
  QUARTERS_PER_HOUR,
} from '../../lib/intradayHeatmapBuckets';
import type { IntradayCell } from '../../lib/intradayHeatmapBuckets';

const CELL_SIZE = 20;
const CELL_GAP = 2;
const LABEL_COL_WIDTH = 28;
const HEADER_ROW_HEIGHT = 18;
const QUARTER_LABELS = [':00', ':15', ':30', ':45'];

interface IntradayIssueHeatmapProps {
  pending: NotificationRow[];
  resolved: NotificationRow[];
  onSelectNotification: (id: string | null) => void;
  selectedNotificationId: string | null;
}

// ── Tooltip content ───────────────────────────────────────────────────────────

function PriorityChip({ row, forResolved }: { row: NotificationRow; forResolved: boolean }) {
  const color = forResolved
    ? pendingCellColor(row.priority) // show original pending color in tooltip for resolved issues
    : pendingCellColor(row.priority);
  const label = priorityLabel(row.priority);
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 3,
        padding: '1px 5px',
        borderRadius: 3,
        backgroundColor: color,
        color: row.priority > 5 ? '#fff' : '#333',
        fontSize: 10,
        fontWeight: 600,
        lineHeight: '14px',
        flexShrink: 0,
      }}
    >
      P{row.priority} {label}
    </span>
  );
}

function IssueRow({
  row,
  kind,
}: {
  row: NotificationRow;
  kind: 'resolved' | 'pending';
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: '2px 0',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      <PriorityChip row={row} forResolved={kind === 'resolved'} />
      <div style={{ minWidth: 0 }}>
        <div
          style={{
            fontSize: 11,
            fontWeight: 500,
            color: '#f1f5f9',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: 200,
          }}
        >
          {row.messageName}
        </div>
        <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 1 }}>{row.matchLabel}</div>
      </div>
    </div>
  );
}

function CellTooltipContent({ cell, timeLabel }: { cell: IntradayCell; timeLabel: string }) {
  const hasResolved = cell.resolvedRows.length > 0;
  const hasPending = cell.pendingRows.length > 0;

  if (!hasResolved && !hasPending) return null;

  const sortByPriority = (rows: NotificationRow[]) =>
    [...rows].sort((a, b) => b.priority - a.priority);

  return (
    <div style={{ minWidth: 220, maxWidth: 260, padding: '4px 2px' }}>
      <div
        style={{
          fontSize: 10,
          color: '#94a3b8',
          marginBottom: 6,
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
        }}
      >
        {timeLabel}
      </div>

      {hasResolved && (
        <div style={{ marginBottom: hasPending ? 8 : 0 }}>
          <div
            style={{
              fontSize: 10,
              color: 'var(--mantine-color-green-4)',
              fontWeight: 700,
              marginBottom: 3,
            }}
          >
            Resolved ({cell.resolvedRows.length})
          </div>
          {sortByPriority(cell.resolvedRows).map((r) => (
            <IssueRow key={r.id} row={r} kind="resolved" />
          ))}
        </div>
      )}

      {hasPending && (
        <div>
          <div
            style={{
              fontSize: 10,
              color: 'var(--mantine-color-yellow-4)',
              fontWeight: 700,
              marginBottom: 3,
            }}
          >
            Pending ({cell.pendingRows.length})
          </div>
          {sortByPriority(cell.pendingRows).map((r) => (
            <IssueRow key={r.id} row={r} kind="pending" />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Legend ────────────────────────────────────────────────────────────────────

function HeatmapLegend() {
  const swatches = [
    { color: 'var(--mantine-color-yellow-3)', label: 'Low pending' },
    { color: 'var(--mantine-color-yellow-5)', label: '' },
    { color: 'var(--mantine-color-red-4)', label: 'High pending' },
    { color: 'var(--mantine-color-red-7)', label: '' },
    { color: 'var(--mantine-color-green-4)', label: 'Low resolved' },
    { color: 'var(--mantine-color-green-7)', label: 'High resolved' },
  ];
  return (
    <div
      style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6, flexWrap: 'wrap' }}
    >
      {swatches.map((s, i) => (
        <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: 2,
              backgroundColor: s.color,
              display: 'inline-block',
              flexShrink: 0,
            }}
          />
          {s.label && (
            <span
              style={{ fontSize: 9, color: 'var(--mantine-color-gray-6)', whiteSpace: 'nowrap' }}
            >
              {s.label}
            </span>
          )}
        </span>
      ))}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function IntradayIssueHeatmap({
  pending,
  resolved,
  onSelectNotification,
  selectedNotificationId,
}: IntradayIssueHeatmapProps) {
  const dayOptions = useMemo(() => intradayDayOptions(DEMO_NOW_MS), []);

  const daySelectData: PdsMantineMultiselectDataObject[] = dayOptions.map((o) => ({
    title: o.label,
    value: o.dayKey,
  }));

  const [selectedDay, setSelectedDay] = useState(dayOptions[0]!.dayKey);

  const grid = useMemo(
    () => buildIntradayBuckets(pending, resolved, selectedDay),
    [pending, resolved, selectedDay],
  );

  const hasAnyData = useMemo(
    () => grid.some((row) => row.some((c) => c.pendingRows.length > 0 || c.resolvedRows.length > 0)),
    [grid],
  );

  const handleCellClick = (cell: IntradayCell) => {
    // Prefer resolved rows (resolved wins for fill); among those take highest priority.
    // Fall back to pending rows.
    const candidates =
      cell.resolvedRows.length > 0 ? cell.resolvedRows : cell.pendingRows;
    if (candidates.length === 0) return;
    const top = [...candidates].sort((a, b) => b.priority - a.priority)[0]!;
    onSelectNotification(
      selectedNotificationId === top.id ? null : top.id,
    );
  };

  const totalWidth =
    LABEL_COL_WIDTH + HEATMAP_HOURS * CELL_SIZE + (HEATMAP_HOURS - 1) * CELL_GAP;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {/* Header row */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <PdsMantineText type="interface" fontSize="300" surface="on-light" style={{ color: 'var(--mantine-color-gray-6)' }}>
          08:00 – 22:00 · 15 min buckets
        </PdsMantineText>
        <div style={{ width: 160 }}>
          <PdsMantineMultiselect
            size="xs"
            surface="on-light"
            opaqueBackground
            data={daySelectData}
            predValue={selectedDay}
            maxDisplayValues={1}
            onSelect={(opt) => setSelectedDay(opt.value)}
          />
        </div>
      </div>

      {!hasAnyData && (
        <div
          style={{
            padding: '20px 0',
            textAlign: 'center',
          }}
        >
          <PdsMantineText type="interface" fontSize="400" surface="on-light" style={{ color: 'var(--mantine-color-gray-5)' }}>
            No issues recorded for this day
          </PdsMantineText>
        </div>
      )}

      {/* Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `${LABEL_COL_WIDTH}px repeat(${HEATMAP_HOURS}, ${CELL_SIZE}px)`,
          gridTemplateRows: `${HEADER_ROW_HEIGHT}px repeat(${QUARTERS_PER_HOUR}, ${CELL_SIZE}px)`,
          gap: `${CELL_GAP}px`,
          width: totalWidth,
        }}
      >
        {/* Corner */}
        <div />

        {/* Column headers: 08..21 */}
        {Array.from({ length: HEATMAP_HOURS }, (_, i) => (
          <div
            key={`col-${i}`}
            style={{
              fontSize: 9,
              textAlign: 'center',
              color: 'var(--mantine-color-gray-6)',
              lineHeight: `${HEADER_ROW_HEIGHT}px`,
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {String(HEATMAP_START_HOUR + i).padStart(2, '0')}
          </div>
        ))}

        {/* Rows: q=0..3 */}
        {Array.from({ length: QUARTERS_PER_HOUR }, (_, q) => {
          const row = grid[q]!;
          return (
            <>
              {/* Row label */}
              <div
                key={`rl-${q}`}
                style={{
                  fontSize: 9,
                  color: 'var(--mantine-color-gray-5)',
                  lineHeight: `${CELL_SIZE}px`,
                  textAlign: 'right',
                  paddingRight: 4,
                }}
              >
                {QUARTER_LABELS[q]}
              </div>

              {/* Cells */}
              {row.map((cell, h) => {
                const fill = cellFillColor(cell);
                const isEmpty = fill === CELL_EMPTY_COLOR;
                const isSelected =
                  !isEmpty &&
                  (cell.resolvedRows.some((r) => r.id === selectedNotificationId) ||
                    cell.pendingRows.some((r) => r.id === selectedNotificationId));
                const timeLabel = `${String(cell.hour).padStart(2, '0')}${QUARTER_LABELS[q]}`;

                const cellEl = (
                  <div
                    key={`${q}-${h}`}
                    onClick={() => !isEmpty && handleCellClick(cell)}
                    style={{
                      width: CELL_SIZE,
                      height: CELL_SIZE,
                      backgroundColor: fill,
                      borderRadius: 3,
                      cursor: isEmpty ? 'default' : 'pointer',
                      outline: isSelected
                        ? '2px solid var(--mantine-color-blue-5)'
                        : isEmpty
                        ? `1px solid ${CELL_EMPTY_BORDER}`
                        : 'none',
                      outlineOffset: 1,
                      transition: 'filter 80ms ease',
                    }}
                    onMouseEnter={(e) => {
                      if (!isEmpty)
                        (e.currentTarget as HTMLDivElement).style.filter = 'brightness(1.15)';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLDivElement).style.filter = '';
                    }}
                  />
                );

                if (isEmpty) return cellEl;

                return (
                  <Tooltip
                    key={`tip-${q}-${h}`}
                    label={<CellTooltipContent cell={cell} timeLabel={timeLabel} />}
                    position="top"
                    withArrow
                    multiline
                    maw={280}
                    color="dark"
                    offset={6}
                    openDelay={80}
                  >
                    {cellEl}
                  </Tooltip>
                );
              })}
            </>
          );
        })}
      </div>

      <HeatmapLegend />
    </div>
  );
}
