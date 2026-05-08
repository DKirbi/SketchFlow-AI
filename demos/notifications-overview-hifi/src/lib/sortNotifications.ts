import type { NotificationRow } from '../types';

/** Betting first, then numeric priority (high first), then recency. */
export function sortNotificationRows(rows: NotificationRow[]): NotificationRow[] {
  return [...rows].sort((a, b) => {
    const ab = a.dataset === 'BETTING' ? 1 : 0;
    const bb = b.dataset === 'BETTING' ? 1 : 0;
    if (ab !== bb) return bb - ab;
    if (a.priority !== b.priority) return b.priority - a.priority;
    return Date.parse(b.generatedAt) - Date.parse(a.generatedAt);
  });
}

export function sortValueForTable(row: NotificationRow): number {
  const bettingBoost = row.dataset === 'BETTING' ? 1000 : 0;
  return bettingBoost + row.priority;
}
