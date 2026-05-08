import type { Bracket, RoundsetRow, TournamentEntrant } from '../types';

/** ISO string for Match.scheduledAt, or undefined if empty / unparseable. */
export function scheduledAtFromRoundsetDate(input: string): string | undefined {
  const s = input.trim();
  if (!s) return undefined;
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return undefined;
  return d.toISOString();
}

export function scheduleFromEntrantPair(
  a: TournamentEntrant,
  b?: TournamentEntrant,
): { scheduledAt?: string; week?: number } {
  const pair = b ? [a, b] : [a];
  let earliest: string | undefined;
  let week: number | undefined;
  for (const e of pair) {
    const t = e.firstMatchAt?.trim();
    if (!t) continue;
    if (!earliest || t < earliest) {
      earliest = t;
      week = e.week ?? week;
    }
  }
  const out: { scheduledAt?: string; week?: number } = {};
  if (earliest) out.scheduledAt = earliest;
  if (week != null) out.week = week;
  return out;
}

/** Attach firstMatchDate / venue from sorted roundset rows to brackets (1-based round index). */
export function applyRoundsetRowsToBrackets(
  brackets: Bracket[],
  sortedRows: RoundsetRow[],
): Bracket[] {
  return brackets.map((b) => {
    const row = sortedRows[b.round - 1];
    if (!row) return b;
    const fromRowAt = scheduledAtFromRoundsetDate(row.firstMatchDate);
    const venueName = row.venue.trim() || undefined;
    if (!fromRowAt && !venueName) return b;
    return {
      ...b,
      matches: b.matches.map((m) => ({
        ...m,
        ...(fromRowAt ? { scheduledAt: fromRowAt } : {}),
        ...(venueName ? { venueName } : {}),
      })),
    };
  });
}
