import type { NotificationRow } from '../types';

export const HEATMAP_START_HOUR = 8;
export const HEATMAP_END_HOUR = 22; // exclusive — cells cover 08:00–21:45
export const HEATMAP_HOURS = HEATMAP_END_HOUR - HEATMAP_START_HOUR; // 14
export const QUARTERS_PER_HOUR = 4;

export interface IntradayCell {
  hour: number;    // 8..21
  quarter: number; // 0..3 → :00, :15, :30, :45
  bucketStartMs: number;
  pendingRows: NotificationRow[];
  resolvedRows: NotificationRow[];
  maxPendingPriority: number;  // 0 if none
  maxResolvedPriority: number; // 0 if none
}

export interface IntradayDayOption {
  label: string;
  dayKey: string; // YYYY-MM-DD
}

function toYmd(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/** Three deterministic demo day options derived from a fixed "now" timestamp. */
export function intradayDayOptions(nowMs: number): IntradayDayOption[] {
  const base = new Date(nowMs);
  const yesterday = new Date(base);
  yesterday.setDate(yesterday.getDate() - 1);
  const dayBefore = new Date(base);
  dayBefore.setDate(dayBefore.getDate() - 2);
  return [
    { label: 'Today (demo)', dayKey: toYmd(base) },
    { label: 'Yesterday', dayKey: toYmd(yesterday) },
    { label: 'Day before', dayKey: toYmd(dayBefore) },
  ];
}

/**
 * Build a [QUARTERS_PER_HOUR][HEATMAP_HOURS] cell grid for the given day.
 * Pending rows are bucketed by `generatedAt`; resolved rows by `resolvedAt`
 * (falling back to `generatedAt`), consistent with `bucketByHour` semantics.
 */
export function buildIntradayBuckets(
  pending: NotificationRow[],
  resolved: NotificationRow[],
  dayKey: string,
): IntradayCell[][] {
  const grid: IntradayCell[][] = Array.from({ length: QUARTERS_PER_HOUR }, (_, q) =>
    Array.from({ length: HEATMAP_HOURS }, (_, h) => ({
      hour: HEATMAP_START_HOUR + h,
      quarter: q,
      bucketStartMs: new Date(
        `${dayKey}T${String(HEATMAP_START_HOUR + h).padStart(2, '0')}:${String(q * 15).padStart(2, '0')}:00`,
      ).getTime(),
      pendingRows: [] as NotificationRow[],
      resolvedRows: [] as NotificationRow[],
      maxPendingPriority: 0,
      maxResolvedPriority: 0,
    })),
  );

  const place = (
    r: NotificationRow,
    isoTs: string,
    arr: 'pendingRows' | 'resolvedRows',
    maxField: 'maxPendingPriority' | 'maxResolvedPriority',
  ) => {
    const d = new Date(isoTs);
    if (toYmd(d) !== dayKey) return;
    const h = d.getHours();
    const q = Math.floor(d.getMinutes() / 15);
    if (h < HEATMAP_START_HOUR || h >= HEATMAP_END_HOUR) return;
    const cell = grid[q]![h - HEATMAP_START_HOUR]!;
    (cell[arr] as NotificationRow[]).push(r);
    if (r.priority > cell[maxField]) cell[maxField] = r.priority;
  };

  for (const r of pending) place(r, r.generatedAt, 'pendingRows', 'maxPendingPriority');
  for (const r of resolved) place(r, r.resolvedAt ?? r.generatedAt, 'resolvedRows', 'maxResolvedPriority');

  return grid;
}

// ── Color ramps ──────────────────────────────────────────────────────────────

/** 10-shade green ramp: P1 = lightest, P10 = darkest. */
const RESOLVED_RAMP = [
  'var(--mantine-color-green-2)', // P1
  'var(--mantine-color-green-3)', // P2
  'var(--mantine-color-green-3)', // P3
  'var(--mantine-color-green-4)', // P4
  'var(--mantine-color-green-5)', // P5
  'var(--mantine-color-green-6)', // P6
  'var(--mantine-color-green-7)', // P7
  'var(--mantine-color-green-7)', // P8
  'var(--mantine-color-green-8)', // P9
  'var(--mantine-color-green-9)', // P10
] as const;

/** Yellow ramp (P1–P5) then red ramp (P6–P10). */
const PENDING_RAMP = [
  'var(--mantine-color-yellow-2)', // P1
  'var(--mantine-color-yellow-3)', // P2
  'var(--mantine-color-yellow-4)', // P3
  'var(--mantine-color-yellow-5)', // P4
  'var(--mantine-color-yellow-6)', // P5
  'var(--mantine-color-red-3)',    // P6
  'var(--mantine-color-red-5)',    // P7
  'var(--mantine-color-red-6)',    // P8
  'var(--mantine-color-red-7)',    // P9
  'var(--mantine-color-red-9)',    // P10
] as const;

export const CELL_EMPTY_COLOR = 'var(--mantine-color-gray-1)';
export const CELL_EMPTY_BORDER = 'var(--mantine-color-gray-3)';

export function resolvedCellColor(priority: number): string {
  return RESOLVED_RAMP[Math.max(0, Math.min(9, priority - 1))]!;
}

export function pendingCellColor(priority: number): string {
  return PENDING_RAMP[Math.max(0, Math.min(9, priority - 1))]!;
}

/**
 * Cell fill color. Resolved green wins when both pending and resolved are present.
 * Returns `CELL_EMPTY_COLOR` for empty cells.
 */
export function cellFillColor(cell: IntradayCell): string {
  if (cell.maxResolvedPriority > 0) return resolvedCellColor(cell.maxResolvedPriority);
  if (cell.maxPendingPriority > 0) return pendingCellColor(cell.maxPendingPriority);
  return CELL_EMPTY_COLOR;
}

export function priorityLabel(priority: number): string {
  return priority > 5 ? 'High' : 'Low';
}
