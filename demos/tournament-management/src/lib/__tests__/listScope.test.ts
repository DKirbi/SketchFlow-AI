import { describe, expect, it } from 'vitest';

import { SEED_SIMPLE_TOURNAMENTS } from '../../data/tournaments';
import {
  detectSelectionKind,
  firstSidebarSelectionId,
  isIntermediateNavSelection,
  listForNavigationSelection,
  normalizeNavigationSelection,
} from '../listScope';
import { buildSidebarTree } from '../sidebarTree';

describe('listScope parent selection support', () => {
  it('returns sport rows when sport parent is selected', () => {
    const rows = listForNavigationSelection(SEED_SIMPLE_TOURNAMENTS, 'sp-soccer');
    expect(rows).toBeDefined();
    expect(rows?.length).toBeGreaterThan(1);
    expect(rows?.every((row) => row.sportId === 'sp-soccer')).toBe(true);
  });

  it('returns category rows when category parent is selected', () => {
    const rows = listForNavigationSelection(SEED_SIMPLE_TOURNAMENTS, 'cat-intl-clubs');
    expect(rows).toBeDefined();
    expect(rows?.length).toBeGreaterThan(0);
    expect(rows?.every((row) => row.categoryId === 'cat-intl-clubs')).toBe(true);
  });

  it('returns rows when unique tournament parent is selected', () => {
    const rows = listForNavigationSelection(SEED_SIMPLE_TOURNAMENTS, 'ut-wimbledon');
    expect(rows).toBeDefined();
    expect(rows?.length).toBeGreaterThan(0);
    expect(rows?.every((row) => row.uniqueTournamentId === 'ut-wimbledon')).toBe(true);
  });

  it('marks sport, category, and unique selections as non-intermediate', () => {
    expect(isIntermediateNavSelection('sp-soccer', SEED_SIMPLE_TOURNAMENTS)).toBe(false);
    expect(isIntermediateNavSelection('cat-intl-clubs', SEED_SIMPLE_TOURNAMENTS)).toBe(false);
    expect(isIntermediateNavSelection('ut-wimbledon', SEED_SIMPLE_TOURNAMENTS)).toBe(false);
  });

  it('detects the parent selection kinds', () => {
    expect(detectSelectionKind('sp-soccer', SEED_SIMPLE_TOURNAMENTS)).toBe('sport');
    expect(detectSelectionKind('cat-intl-clubs', SEED_SIMPLE_TOURNAMENTS)).toBe('category');
    expect(detectSelectionKind('ut-wimbledon', SEED_SIMPLE_TOURNAMENTS)).toBe('unique');
  });

  it('picks first sidebar selection as default', () => {
    const tree = buildSidebarTree(SEED_SIMPLE_TOURNAMENTS);
    const firstId = firstSidebarSelectionId(tree);
    expect(firstId).toBe(tree[0]?.id);
  });

  it('normalizes invalid selection to first tree node', () => {
    const normalized = normalizeNavigationSelection(
      'does-not-exist',
      SEED_SIMPLE_TOURNAMENTS,
    );
    const tree = buildSidebarTree(SEED_SIMPLE_TOURNAMENTS);
    expect(normalized).toBe(tree[0]?.id);
  });
});
