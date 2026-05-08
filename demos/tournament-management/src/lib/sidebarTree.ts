import type { NavTreeItem } from 'lofi-kit';

import { SPORTS, categoryById, sportById, uniqueTournamentById } from '../data/catalog';
import type { SimpleTournament } from '../types';

/** Flatten every node id in the sidebar tree for selection invalidation. */
export function collectTreeItemIds(items: NavTreeItem[]): Set<string> {
  const ids = new Set<string>();
  const walk = (nodes: NavTreeItem[]): void => {
    for (const n of nodes) {
      ids.add(n.id);
      if (n.children?.length) walk(n.children);
    }
  };
  walk(items);
  return ids;
}

function sortItemsByLabel(items: NavTreeItem[]): NavTreeItem[] {
  return [...items].sort((a, b) => a.label.localeCompare(b.label));
}

function noneBranchId(categoryId: string): string {
  return `ut-none-${categoryId}`;
}

/** Build sidebar tree from tournaments that already passed applied filters. */
export function buildSidebarTree(filteredTournaments: SimpleTournament[]): NavTreeItem[] {
  const bySport = new Map<string, SimpleTournament[]>();
  for (const st of filteredTournaments) {
    const list = bySport.get(st.sportId);
    if (list) list.push(st);
    else bySport.set(st.sportId, [st]);
  }

  const sportNodes: NavTreeItem[] = [];

  for (const sport of sortItemsByLabel(SPORTS.filter((s) => bySport.has(s.id)))) {
    const sts = bySport.get(sport.id) ?? [];
    const catIds = [...new Set(sts.map((x) => x.categoryId))];

    const catNodes: NavTreeItem[] = [];

    for (const catId of [...catIds].sort((a, b) => {
      const ca = categoryById(a)?.label ?? a;
      const cb = categoryById(b)?.label ?? b;
      return ca.localeCompare(cb);
    })) {
      const cat = categoryById(catId);
      if (!cat) continue;
      const stsInCat = sts.filter((x) => x.categoryId === catId);
      const utKeys = [...new Set(stsInCat.map((x) => x.uniqueTournamentId))];

      const utNodes: NavTreeItem[] = [];

      for (const utIdRaw of [...utKeys].sort((a, b) => {
        if (a === '' && b !== '') return 1;
        if (b === '' && a !== '') return -1;
        const la = a ? uniqueTournamentById(a)?.label ?? a : 'No cross-season grouping';
        const lb = b ? uniqueTournamentById(b)?.label ?? b : 'No cross-season grouping';
        return la.localeCompare(lb);
      })) {
        const hasUt = utIdRaw !== '';
        const utRec = hasUt ? uniqueTournamentById(utIdRaw) : undefined;
        const branchId = hasUt && utRec ? utRec.id : noneBranchId(catId);
        const label = hasUt && utRec ? utRec.label : 'No cross-season grouping';
        const stsInUt = stsInCat.filter((x) => (x.uniqueTournamentId || '') === utIdRaw);
        const stLeaves: NavTreeItem[] = sortItemsByLabel(
          stsInUt.map((st) => ({
            id: st.id,
            label: st.name,
          })),
        );

        utNodes.push({
          id: branchId,
          label,
          children: stLeaves,
        });
      }

      catNodes.push({
        id: cat.id,
        label: cat.label,
        children: sortItemsByLabel(utNodes),
      });
    }

    sportNodes.push({
      id: sport.id,
      label: sport.label,
      children: sortItemsByLabel(catNodes),
    });
  }

  return sortItemsByLabel(sportNodes);
}

export function breadcrumbPartsForLeaf(
  st: SimpleTournament,
): { sport: string; category: string; ut: string; st: string } {
  const utLabel = st.uniqueTournamentId
    ? uniqueTournamentById(st.uniqueTournamentId)?.label ?? st.uniqueTournamentId
    : 'No cross-season grouping';
  return {
    sport: sportById(st.sportId)?.label ?? st.sportId,
    category: categoryById(st.categoryId)?.label ?? st.categoryId,
    ut: utLabel,
    st: st.name,
  };
}

export function noneUtBranchIdForCategory(categoryId: string): string {
  return noneBranchId(categoryId);
}

export function allBranchIdsForTree(items: NavTreeItem[]): string[] {
  const out: string[] = [];
  const walk = (nodes: NavTreeItem[]) => {
    for (const n of nodes) {
      if (n.children !== undefined) {
        out.push(n.id);
        walk(n.children);
      }
    }
  };
  walk(items);
  return out;
}
