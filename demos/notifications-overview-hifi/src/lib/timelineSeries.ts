import type { NotificationRow } from '../types';
import { operatorById } from '../data/operators';

export interface TimelineBucket {
  /** 0-based slot index within the window (used as numeric X for Recharts). */
  hourIndex: number;
  hour: string;
  hourMs: number;
  high: number;
  low: number;
  resolved: number;
  highIds: string[];
  lowIds: string[];
  resolvedIds: string[];
}

/** Per-issue dot for timeline navigation (click → table row). */
export interface IssueScatterPoint {
  /** Numeric position on the X-axis (may be fractional within an hour slot). */
  hourIndex: number;
  y: number;
  notificationId: string;
  /** Retained for backward compat; prefer structured fields below. */
  tooltip: string;
  initials?: string;
  // Structured fields used by the unified tooltip component
  messageName: string;
  matchLabel: string;
  priority: number;
  generatedAtMs: number;
  resolvedAtMs?: number;
  assigneeDisplayName?: string;
  resolvedByDisplayName?: string;
  /** How long the issue has been / was active, pre-formatted. */
  activeDuration: string;
  kind: 'high' | 'low' | 'resolved';
}

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h << 5) - h + s.charCodeAt(i);
  return Math.abs(h);
}

function formatDuration(ms: number): string {
  const totalMin = Math.round(ms / 60_000);
  if (totalMin < 60) return `${totalMin}m`;
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

/**
 * Build clickable scatter points.
 *
 * Pending issues are anchored to the **right edge** of the window (X ≈ windowHours - 0.25)
 * so they read as "active right now" regardless of when they were first created.
 * They are sorted high-priority first (descending priority), then low-priority, so the
 * most urgent work appears highest on the chart and first in tab order.
 *
 * Resolved issues retain a historical X position derived from `resolvedAt` (or `generatedAt`)
 * so they appear as events distributed across the timeline.
 */
export function buildIssueScatterPoints(
  pending: NotificationRow[],
  resolved: NotificationRow[],
  nowMs: number,
  windowHours = 12,
): { high: IssueScatterPoint[]; low: IssueScatterPoint[]; resolved: IssueScatterPoint[] } {
  const windowStart = nowMs - windowHours * 3_600_000;
  const inWindow = (ms: number) => ms >= windowStart && ms <= nowMs;

  // Collect all pending issues that fall within the window, split by tier
  const pendingInWindow = pending.filter((r) => inWindow(Date.parse(r.generatedAt)));
  const highPending = pendingInWindow
    .filter((r) => r.priority > 5)
    .sort((a, b) => b.priority - a.priority);
  const lowPending = pendingInWindow
    .filter((r) => r.priority <= 5)
    .sort((a, b) => b.priority - a.priority);

  const BASE_X = windowHours - 0.25; // right-hand edge of the chart window

  const toPoint = (
    r: NotificationRow,
    i: number,
    kind: 'high' | 'low',
  ): IssueScatterPoint => {
    const generatedAtMs = Date.parse(r.generatedAt);
    const assignee = operatorById(r.assignedOperatorId);
    const activeDuration = formatDuration(nowMs - generatedAtMs);
    // Nudge X slightly so stacked dots don't land on top of each other
    const hourIndex = BASE_X - i * 0.05;
    return {
      hourIndex,
      y: Math.max(1, Math.min(10, r.priority)),
      notificationId: r.id,
      tooltip: `${r.messageName}\n${r.matchLabel}\nActive for ${activeDuration}`,
      kind,
      messageName: r.messageName,
      matchLabel: r.matchLabel,
      priority: r.priority,
      generatedAtMs,
      assigneeDisplayName: assignee?.displayName,
      activeDuration,
    };
  };

  const high: IssueScatterPoint[] = highPending.map((r, i) => toPoint(r, i, 'high'));
  const low: IssueScatterPoint[] = lowPending.map((r, i) => toPoint(r, i, 'low'));

  // Resolved: place at historical resolution time along the timeline
  const res: IssueScatterPoint[] = [];
  for (const r of resolved) {
    const resolvedAtMs = r.resolvedAt ? Date.parse(r.resolvedAt) : undefined;
    const t = resolvedAtMs ?? Date.parse(r.generatedAt);
    if (!inWindow(t)) continue;
    const slotIdx = Math.min(
      windowHours - 1,
      Math.max(0, Math.floor((t - windowStart) / 3_600_000)),
    );
    const jitter = (hashString(`${r.id}-resolved`) % 80) / 400;
    const op = operatorById(r.resolvedByOperatorId);
    const generatedAtMs = Date.parse(r.generatedAt);
    const activeDuration = resolvedAtMs
      ? formatDuration(resolvedAtMs - generatedAtMs)
      : formatDuration(0);
    res.push({
      hourIndex: slotIdx + jitter,
      y: Math.max(1, Math.min(10, r.priority)),
      notificationId: r.id,
      initials: op?.initials,
      tooltip: `${r.messageName}\n${r.matchLabel}\nResolved by: ${op?.displayName ?? '—'}`,
      kind: 'resolved',
      messageName: r.messageName,
      matchLabel: r.matchLabel,
      priority: r.priority,
      generatedAtMs,
      resolvedAtMs,
      resolvedByDisplayName: op?.displayName,
      activeDuration,
    });
  }

  return { high, low, resolved: res };
}

/** Mantine `AreaChart` rows: numeric x slot + stacked series (keys match `series[].name`). */
export function mantineStackedAreaData(
  buckets: TimelineBucket[],
): Record<string, string | number>[] {
  return buckets.map((b) => ({
    slot: b.hourIndex,
    hour: b.hour,
    'High Priority': b.high,
    'Low Priority': b.low,
    Resolved: b.resolved,
  }));
}

/** Split `type="split"` area: net new issues in the hour vs resolutions (`series[].name` = `net`). */
export function mantineSplitNetData(
  buckets: TimelineBucket[],
): Record<string, string | number>[] {
  return buckets.map((b) => ({
    slot: b.hourIndex,
    hour: b.hour,
    net: b.high + b.low - b.resolved,
  }));
}

// ── Absolute-time scatter (01:00–22:00 day range) ───────────────────────────

export interface AbsoluteScatterPoint {
  /** Minutes from midnight, clamped to [60, 1320] (01:00–22:00). */
  xMin: number;
  /** Priority 1–10 with small per-id jitter to avoid exact overlap. */
  y: number;
  notificationId: string;
  kind: 'pending-high' | 'pending-low' | 'resolved';
  messageName: string;
  matchLabel: string;
  priority: number;
  generatedAtMs: number;
  resolvedAtMs?: number;
  assigneeDisplayName?: string;
  resolvedByDisplayName?: string;
  activeDuration: string;
}

const DAY_START_MIN = 60;   // 01:00
const DAY_END_MIN = 1320;   // 22:00

function msToMinutesOfDay(ms: number): number {
  const d = new Date(ms);
  return d.getHours() * 60 + d.getMinutes();
}

/**
 * Build scatter points anchored to real clock time (01:00–22:00).
 * Pending dots use `generatedAt` as X; resolved dots use `resolvedAt` (fallback `generatedAt`).
 */
export function buildAbsoluteScatterPoints(
  pending: NotificationRow[],
  resolved: NotificationRow[],
  nowMs: number,
): AbsoluteScatterPoint[] {
  const points: AbsoluteScatterPoint[] = [];

  for (const r of pending) {
    const genMs = Date.parse(r.generatedAt);
    const xRaw = msToMinutesOfDay(genMs);
    if (xRaw < DAY_START_MIN || xRaw > DAY_END_MIN) continue;
    const jitter = ((hashString(r.id) % 60) - 30) / 100; // ±0.30
    const kind = r.priority > 5 ? 'pending-high' : 'pending-low';
    const assignee = operatorById(r.assignedOperatorId);
    points.push({
      xMin: xRaw,
      y: Math.max(1, Math.min(10, r.priority)) + jitter,
      notificationId: r.id,
      kind,
      messageName: r.messageName,
      matchLabel: r.matchLabel,
      priority: r.priority,
      generatedAtMs: genMs,
      assigneeDisplayName: assignee?.displayName,
      activeDuration: formatDuration(nowMs - genMs),
    });
  }

  for (const r of resolved) {
    const resolvedAtMs = r.resolvedAt ? Date.parse(r.resolvedAt) : undefined;
    const anchorMs = resolvedAtMs ?? Date.parse(r.generatedAt);
    const xRaw = msToMinutesOfDay(anchorMs);
    if (xRaw < DAY_START_MIN || xRaw > DAY_END_MIN) continue;
    const jitter = ((hashString(`${r.id}-res`) % 60) - 30) / 100;
    const genMs = Date.parse(r.generatedAt);
    const op = operatorById(r.resolvedByOperatorId);
    points.push({
      xMin: xRaw,
      y: Math.max(1, Math.min(10, r.priority)) + jitter,
      notificationId: r.id,
      kind: 'resolved',
      messageName: r.messageName,
      matchLabel: r.matchLabel,
      priority: r.priority,
      generatedAtMs: genMs,
      resolvedAtMs,
      resolvedByDisplayName: op?.displayName,
      activeDuration: resolvedAtMs ? formatDuration(resolvedAtMs - genMs) : '—',
    });
  }

  return points;
}

/** Summary counts for the dual bar chart panel. */
export function buildBarSummary(
  pending: NotificationRow[],
  resolved: NotificationRow[],
): { pendingHigh: number; pendingLow: number; resolvedHigh: number; resolvedLow: number } {
  let pendingHigh = 0;
  let pendingLow = 0;
  let resolvedHigh = 0;
  let resolvedLow = 0;
  for (const r of pending) {
    if (r.priority > 5) pendingHigh++;
    else pendingLow++;
  }
  for (const r of resolved) {
    if (r.priority > 5) resolvedHigh++;
    else resolvedLow++;
  }
  return { pendingHigh, pendingLow, resolvedHigh, resolvedLow };
}

/**
 * Same placement as `buildIssueScatterPoints`, but only rows with `issueUntouched === true`
 * (pending high/low only; resolved excluded).
 */
export function buildUntouchedIssueScatterPoints(
  pending: NotificationRow[],
  resolved: NotificationRow[],
  nowMs: number,
  windowHours = 12,
): { high: IssueScatterPoint[]; low: IssueScatterPoint[] } {
  const all = buildIssueScatterPoints(pending, resolved, nowMs, windowHours);
  const pendingById = new Map(pending.map((r) => [r.id, r]));
  const keep = (pt: IssueScatterPoint) =>
    pt.kind !== 'resolved' && pendingById.get(pt.notificationId)?.issueUntouched === true;
  return {
    high: all.high.filter(keep),
    low: all.low.filter(keep),
  };
}

/**
 * Bucket `pending` rows by `generatedAt` and `resolved` rows by `resolvedAt`
 * into `windowHours` one-hour slots ending at `nowMs`.
 */
export function bucketByHour(
  pending: NotificationRow[],
  resolved: NotificationRow[],
  nowMs: number,
  windowHours = 12,
): TimelineBucket[] {
  const buckets: TimelineBucket[] = [];
  const windowStart = nowMs - windowHours * 3_600_000;

  for (let i = 0; i < windowHours; i++) {
    const slotStart = windowStart + i * 3_600_000;
    const slotEnd = slotStart + 3_600_000;
    const d = new Date(slotStart);
    const hour = `${String(d.getHours()).padStart(2, '0')}:00`;

    const pendingSlot = pending.filter((r) => {
      const t = Date.parse(r.generatedAt);
      return t >= slotStart && t < slotEnd;
    });

    const resolvedSlot = resolved.filter((r) => {
      const t = r.resolvedAt ? Date.parse(r.resolvedAt) : Date.parse(r.generatedAt);
      return t >= slotStart && t < slotEnd;
    });

    const highRows = pendingSlot.filter((r) => r.priority > 5);
    const lowRows = pendingSlot.filter((r) => r.priority <= 5);

    buckets.push({
      hourIndex: i,
      hour,
      hourMs: slotStart,
      high: highRows.length,
      low: lowRows.length,
      resolved: resolvedSlot.length,
      highIds: highRows.map((r) => r.id),
      lowIds: lowRows.map((r) => r.id),
      resolvedIds: resolvedSlot.map((r) => r.id),
    });
  }

  return buckets;
}
