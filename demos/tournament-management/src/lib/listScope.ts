import type { SimpleTournament } from '../types';
import { buildSidebarTree, collectTreeItemIds } from './sidebarTree';
import {
  isBrowseCategory,
  isBrowseUt,
  parseBrowseCategoryId,
  parseBrowseUtId,
} from './tournamentFormMappers';
import type { NavTreeItem } from 'lofi-kit';

export type NavSelectionKind =
  | 'none'
  | 'simple'
  | 'sport'
  | 'category'
  | 'unique'
  | 'browse-category'
  | 'browse-unique'
  | 'unknown';

function isSportSelection(selectedNavId: string, filtered: SimpleTournament[]): boolean {
  return filtered.some((t) => t.sportId === selectedNavId);
}

function isCategorySelection(selectedNavId: string, filtered: SimpleTournament[]): boolean {
  return filtered.some((t) => t.categoryId === selectedNavId);
}

function isUniqueSelection(selectedNavId: string, filtered: SimpleTournament[]): boolean {
  if (selectedNavId.startsWith('ut-none-')) {
    const categoryId = selectedNavId.slice('ut-none-'.length);
    return filtered.some((t) => t.categoryId === categoryId && !t.uniqueTournamentId);
  }
  return filtered.some((t) => t.uniqueTournamentId === selectedNavId);
}

/** True when the selection still exists under current filtered data (nav tree + list scope). */
export function isNavigationSelectionValid(
  selectedNavId: string | undefined,
  filtered: SimpleTournament[],
): boolean {
  if (!selectedNavId) return false;
  const tree = buildSidebarTree(filtered);
  return collectTreeItemIds(tree).has(selectedNavId);
}

/** Rows for the list view when a browse Category or browse Unique Tournament leaf is selected. */
export function tournamentsForListSelection(
  selectedNavId: string,
  filtered: SimpleTournament[],
): SimpleTournament[] {
  if (isBrowseCategory(selectedNavId)) {
    const cid = parseBrowseCategoryId(selectedNavId);
    return filtered.filter((t) => t.categoryId === cid);
  }
  if (isBrowseUt(selectedNavId)) {
    const branchId = parseBrowseUtId(selectedNavId);
    if (branchId.startsWith('ut-none-')) {
      const catRest = branchId.slice('ut-none-'.length);
      return filtered.filter((t) => t.categoryId === catRest && !t.uniqueTournamentId);
    }
    return filtered.filter((t) => t.uniqueTournamentId === branchId);
  }
  return [];
}

export function detectSelectionKind(
  selectedNavId: string | undefined,
  filtered: SimpleTournament[],
): NavSelectionKind {
  if (!selectedNavId) return 'none';
  if (isBrowseCategory(selectedNavId)) return 'browse-category';
  if (isBrowseUt(selectedNavId)) return 'browse-unique';
  if (filtered.some((t) => t.id === selectedNavId)) return 'simple';
  if (isSportSelection(selectedNavId, filtered)) return 'sport';
  if (isUniqueSelection(selectedNavId, filtered)) return 'unique';
  if (isCategorySelection(selectedNavId, filtered)) return 'category';
  return 'unknown';
}

export function listForNavigationSelection(
  filtered: SimpleTournament[],
  selectedNavId: string | undefined,
): SimpleTournament[] | undefined {
  if (!selectedNavId) return undefined;
  if (isSportSelection(selectedNavId, filtered)) {
    return filtered.filter((t) => t.sportId === selectedNavId);
  }
  if (isUniqueSelection(selectedNavId, filtered)) {
    if (selectedNavId.startsWith('ut-none-')) {
      const categoryId = selectedNavId.slice('ut-none-'.length);
      return filtered.filter((t) => t.categoryId === categoryId && !t.uniqueTournamentId);
    }
    return filtered.filter((t) => t.uniqueTournamentId === selectedNavId);
  }
  if (isCategorySelection(selectedNavId, filtered)) {
    return filtered.filter((t) => t.categoryId === selectedNavId);
  }
  if (!isBrowseCategory(selectedNavId) && !isBrowseUt(selectedNavId)) return undefined;
  return tournamentsForListSelection(selectedNavId, filtered);
}

export function selectedSimpleTournamentId(
  selectedNavId: string | undefined,
  filtered: SimpleTournament[],
): string | undefined {
  if (!selectedNavId || isBrowseCategory(selectedNavId) || isBrowseUt(selectedNavId)) {
    return undefined;
  }
  return filtered.some((t) => t.id === selectedNavId) ? selectedNavId : undefined;
}

export function selectionIsSimpleTournamentLeaf(
  selectedNavId: string | undefined,
  filtered: SimpleTournament[],
): SimpleTournament | undefined {
  const stId = selectedSimpleTournamentId(selectedNavId, filtered);
  if (!stId) return undefined;
  return filtered.find((t) => t.id === stId);
}

/** Folder rows that have no list of their own — currently nothing under the new flat model. */
export function isIntermediateNavSelection(
  selectedNavId: string,
  filtered: SimpleTournament[],
): boolean {
  if (isBrowseCategory(selectedNavId) || isBrowseUt(selectedNavId)) return false;
  if (isSportSelection(selectedNavId, filtered)) return false;
  if (isUniqueSelection(selectedNavId, filtered)) return false;
  if (isCategorySelection(selectedNavId, filtered)) return false;
  if (filtered.some((t) => t.id === selectedNavId)) return false;
  return true;
}

export function firstSidebarSelectionId(items: NavTreeItem[]): string | undefined {
  return items[0]?.id;
}

export function normalizeNavigationSelection(
  selectedNavId: string | undefined,
  filtered: SimpleTournament[],
): string | undefined {
  if (isNavigationSelectionValid(selectedNavId, filtered)) return selectedNavId;
  return firstSidebarSelectionId(buildSidebarTree(filtered));
}
