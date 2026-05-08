import { describe, expect, it } from 'vitest';

import type { SimpleTournament } from '../../types';
import { applyListLevelFilter } from '../applyFilters';

function row(partial: Partial<SimpleTournament> & { id: string; name: string }): SimpleTournament {
  return {
    id: partial.id,
    name: partial.name,
    sportId: partial.sportId ?? 'sp-soccer',
    categoryId: partial.categoryId ?? 'cat-soccer-club',
    monitoringCategoryId: '',
    uniqueTournamentId: partial.uniqueTournamentId ?? '',
    startTime: '',
    endTime: '',
    competitionType: 'league',
    addedToImport: false,
    scoutProposalVisible: false,
    disabled: false,
    venueId: '',
    reducedAttendance: false,
    defaultTimezone: '',
    prizeMoney: '',
    prizeCurrency: '',
    running: false,
  };
}

describe('applyListLevelFilter', () => {
  const rows: SimpleTournament[] = [
    row({ id: 't-1', name: 'Champions League final', uniqueTournamentId: 'ut-cl' }),
    row({ id: 't-2', name: 'Local cup', uniqueTournamentId: '' }),
    row({ id: 't-3', name: 'Premier League', uniqueTournamentId: 'ut-pl' }),
    row({ id: 't-4', name: 'Friendly match', uniqueTournamentId: '' }),
  ];

  it('returns all rows when both classes are visible and search is empty', () => {
    const out = applyListLevelFilter(rows, { search: '', showUnique: true, showSimple: true });
    expect(out).toHaveLength(4);
  });

  it('filters out unique-class rows when showUnique is false', () => {
    const out = applyListLevelFilter(rows, { search: '', showUnique: false, showSimple: true });
    expect(out.map((r) => r.id)).toEqual(['t-2', 't-4']);
  });

  it('filters out simple-class rows when showSimple is false', () => {
    const out = applyListLevelFilter(rows, { search: '', showUnique: true, showSimple: false });
    expect(out.map((r) => r.id)).toEqual(['t-1', 't-3']);
  });

  it('returns nothing when both classes are hidden', () => {
    const out = applyListLevelFilter(rows, { search: '', showUnique: false, showSimple: false });
    expect(out).toEqual([]);
  });

  it('matches search against name (case-insensitive)', () => {
    const out = applyListLevelFilter(rows, { search: 'CHAMPIONS', showUnique: true, showSimple: true });
    expect(out.map((r) => r.id)).toEqual(['t-1']);
  });

  it('matches search against id', () => {
    const out = applyListLevelFilter(rows, { search: 't-3', showUnique: true, showSimple: true });
    expect(out.map((r) => r.id)).toEqual(['t-3']);
  });

  it('combines class filter and search', () => {
    const out = applyListLevelFilter(rows, { search: 'league', showUnique: true, showSimple: false });
    expect(out.map((r) => r.id)).toEqual(['t-1', 't-3']);
  });
});
