import type { NotificationRow } from '../../../types';

import { priorityToSeverity } from './severity';

export type PressuredMatchEntry = {
  matchId: string;
  matchLabel: string;
  count: number;
  criticalCount: number;
  majorCount: number;
  minorCount: number;
  score: number;
};

export function pressuredMatchEntries(rows: NotificationRow[]): PressuredMatchEntry[] {
  const map = new Map<
    string,
    { matchLabel: string; criticalCount: number; majorCount: number; minorCount: number }
  >();
  for (const r of rows) {
    if (r.resolvedAt) continue;
    const cur = map.get(r.matchId) ?? {
      matchLabel: r.matchLabel,
      criticalCount: 0,
      majorCount: 0,
      minorCount: 0,
    };
    const sev = priorityToSeverity(r.priority);
    if (sev === 'critical') cur.criticalCount++;
    else if (sev === 'major') cur.majorCount++;
    else cur.minorCount++;
    map.set(r.matchId, cur);
  }
  return [...map.entries()]
    .map(([matchId, v]) => {
      const count = v.criticalCount + v.majorCount + v.minorCount;
      return {
        matchId,
        matchLabel: v.matchLabel,
        count,
        criticalCount: v.criticalCount,
        majorCount: v.majorCount,
        minorCount: v.minorCount,
        score: count + v.criticalCount * 2,
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}
