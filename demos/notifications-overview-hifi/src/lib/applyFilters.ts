import { FILTER_OPTION_ALL } from '../constants';
import type { CityOfficeId, NotificationFilters, NotificationRow } from '../types';
import { DEMO_NOW_MS } from '../data/notifications';

function isAllOptionalFilter(v: string): boolean {
  return v === '' || v === FILTER_OPTION_ALL;
}

function parseGenerated(iso: string): number {
  return Date.parse(iso);
}

function cutoffMs(daysBack: number): number {
  const d = new Date(DEMO_NOW_MS);
  if (daysBack === 0) {
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  }
  return DEMO_NOW_MS - daysBack * 24 * 60 * 60 * 1000;
}

export function passesFilters(row: NotificationRow, filters: NotificationFilters): boolean {
  const t = parseGenerated(row.generatedAt);
  const days = Number(filters.daysBack);
  const cutoff = cutoffMs(Number.isNaN(days) ? 7 : days);
  if (t < cutoff) return false;

  if (!isAllOptionalFilter(filters.sport) && row.sport !== filters.sport) return false;

  if (!isAllOptionalFilter(filters.lsLevel) && row.lsLevel !== filters.lsLevel) return false;

  if (!isAllOptionalFilter(filters.issueType) && row.issueTypeSlug !== filters.issueType) {
    return false;
  }

  if (
    !isAllOptionalFilter(filters.cityOffice) &&
    row.cityOfficeId !== (filters.cityOffice as CityOfficeId)
  ) {
    return false;
  }

  if (filters.priorityBand === 'high' && row.priority <= 5) return false;
  if (filters.priorityBand === 'low' && row.priority > 5) return false;

  return true;
}

export function applyFilters(
  rows: NotificationRow[],
  filters: NotificationFilters,
): NotificationRow[] {
  return rows.filter((r) => passesFilters(r, filters));
}

/** Same as full filter row but ignores priority band (for band toggle badge counts). */
export function applyFiltersExceptPriority(
  rows: NotificationRow[],
  filters: NotificationFilters,
): NotificationRow[] {
  return rows.filter((r) => passesFilters(r, { ...filters, priorityBand: 'all' }));
}

export { parseGenerated };
