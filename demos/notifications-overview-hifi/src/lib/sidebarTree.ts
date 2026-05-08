import type { GroupByMode, NotificationRow, Sport } from '../types';
import { CATEGORY_LABELS, ISSUE_TYPES, issueTypeBySlug } from '../data/messageTypes';

/** Hierarchical sidebar nodes (category or match branch → issue leaves). */
export interface NavTreeItem {
  id: string;
  label: string;
  /** Populated only in match-grouping mode; undefined for category branches. */
  sport?: Sport;
  children?: NavTreeItem[];
  /** Row counts per priority band (high = >5, low = ≤5) for leaf chips. */
  leafBandCounts?: { high: number; low: number };
}

function countMap(
  rows: NotificationRow[],
  keyFn: (r: NotificationRow) => string,
): Map<string, number> {
  const m = new Map<string, number>();
  for (const r of rows) {
    const k = keyFn(r);
    m.set(k, (m.get(k) ?? 0) + 1);
  }
  return m;
}

function bandCounts(rows: NotificationRow[]): { high: number; low: number } {
  let high = 0;
  let low = 0;
  for (const r of rows) {
    if (r.priority > 5) high++;
    else low++;
  }
  return { high, low };
}

export function buildMessageTypeTree(filteredPending: NotificationRow[]): NavTreeItem[] {
  const byIssue = countMap(filteredPending, (r) => r.issueTypeSlug);
  const categories = ['match-state', 'missing-data', 'markets-state', 'incorrect-data'] as const;

  const branches: NavTreeItem[] = [];
  for (const cat of categories) {
    const issues = ISSUE_TYPES.filter((i) => i.category === cat);
    const children: NavTreeItem[] = [];
    for (const issue of issues) {
      const c = byIssue.get(issue.slug) ?? 0;
      if (c === 0) continue;
      const matching = filteredPending.filter((r) => r.issueTypeSlug === issue.slug);
      children.push({
        id: `msgtype-${cat}-${issue.slug}`,
        label: `${issue.label} (${c})`,
        sport: matching[0]?.sport,
        leafBandCounts: bandCounts(matching),
      });
    }
    if (children.length === 0) continue;
    const total = issues.reduce((acc, issue) => acc + (byIssue.get(issue.slug) ?? 0), 0);
    /** Representative sport icon (first pending row in category). */
    const catSport = filteredPending.find((r) => r.category === cat)?.sport;
    branches.push({
      id: `cat-${cat}`,
      label: `${CATEGORY_LABELS[cat]} (${total})`,
      sport: catSport,
      children,
    });
  }
  return branches;
}

export function buildMatchTree(filteredPending: NotificationRow[]): NavTreeItem[] {
  const matchIds = [...new Set(filteredPending.map((r) => r.matchId))];
  const byMatch = new Map<string, NotificationRow[]>();
  for (const r of filteredPending) {
    const arr = byMatch.get(r.matchId) ?? [];
    arr.push(r);
    byMatch.set(r.matchId, arr);
  }

  const branches: NavTreeItem[] = [];
  for (const mid of matchIds) {
    const rows = byMatch.get(mid) ?? [];
    if (rows.length === 0) continue;
    const labelBase = rows[0]?.matchLabel ?? mid;
    const matchSport = rows[0]?.sport;
    const slugSet = [...new Set(rows.map((r) => r.issueTypeSlug))];
    const children: NavTreeItem[] = slugSet.map((slug) => {
      const def = issueTypeBySlug(slug);
      const matchRows = rows.filter((r) => r.issueTypeSlug === slug);
      const c = matchRows.length;
      const title = def?.label ?? slug;
      return {
        id: `match-${mid}--${slug}`,
        label: `${title} (${c})`,
        sport: matchSport,
        leafBandCounts: bandCounts(matchRows),
      };
    });
    branches.push({
      id: `match-branch-${mid}`,
      label: `${labelBase} (${rows.length})`,
      sport: matchSport,
      children,
    });
  }
  return branches;
}

export function buildNavTreeForMode(
  mode: GroupByMode,
  filteredPending: NotificationRow[],
): NavTreeItem[] {
  return mode === 'message-type'
    ? buildMessageTypeTree(filteredPending)
    : buildMatchTree(filteredPending);
}

/** Leaf id as used in {@link filterRowsBySelection} and sidebar buttons — keep in sync with tree builders. */
export function sidebarLeafIdFromRow(row: NotificationRow, mode: GroupByMode): string {
  if (mode === 'message-type') {
    return `msgtype-${row.category}-${row.issueTypeSlug}`;
  }
  return `match-${row.matchId}--${row.issueTypeSlug}`;
}
