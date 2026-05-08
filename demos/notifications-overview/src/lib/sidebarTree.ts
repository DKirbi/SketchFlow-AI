import type { NavTreeItem } from 'lofi-kit';
import type { GroupByMode, NotificationRow } from '../types';
import { CATEGORY_LABELS, ISSUE_TYPES, issueTypeBySlug } from '../data/messageTypes';

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
      children.push({
        id: `msgtype-${cat}-${issue.slug}`,
        label: `${issue.label} (${c})`,
      });
    }
    if (children.length === 0) continue;
    const total = issues.reduce((acc, issue) => acc + (byIssue.get(issue.slug) ?? 0), 0);
    branches.push({
      id: `cat-${cat}`,
      label: `${CATEGORY_LABELS[cat]} (${total})`,
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
    const slugSet = [...new Set(rows.map((r) => r.issueTypeSlug))];
    const children: NavTreeItem[] = slugSet.map((slug) => {
      const def = issueTypeBySlug(slug);
      const c = rows.filter((r) => r.issueTypeSlug === slug).length;
      const title = def?.label ?? slug;
      return {
        id: `match-${mid}--${slug}`,
        label: `${title} (${c})`,
      };
    });
    branches.push({
      id: `match-branch-${mid}`,
      label: `${labelBase} (${rows.length})`,
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
