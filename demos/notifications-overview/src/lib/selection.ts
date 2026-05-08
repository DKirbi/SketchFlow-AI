import { BUCKET_BETTING_ID } from '../constants';
import type { NotificationRow } from '../types';
import { issueTypeBySlug } from '../data/messageTypes';
import { sortNotificationRows } from './sortNotifications';

const MSGTYPE_RE = /^msgtype-(match-state|missing-data|markets-state|incorrect-data)-(.+)$/;

export function filterRowsBySelection(
  selectedId: string | undefined,
  rows: NotificationRow[],
): NotificationRow[] {
  if (selectedId === undefined || selectedId === '') {
    return [];
  }

  if (selectedId === BUCKET_BETTING_ID) {
    return sortNotificationRows(rows.filter((r) => r.dataset === 'BETTING'));
  }

  const msg = MSGTYPE_RE.exec(selectedId);
  if (msg) {
    const slug = msg[2];
    return sortNotificationRows(rows.filter((r) => r.issueTypeSlug === slug));
  }

  const match = /^match-(.+)--(.+)$/.exec(selectedId);
  if (match) {
    const matchId = match[1];
    const slug = match[2];
    return sortNotificationRows(
      rows.filter((r) => r.matchId === matchId && r.issueTypeSlug === slug),
    );
  }

  return [];
}

export function selectionTitle(
  selectedId: string | undefined,
  sampleRow: NotificationRow | undefined,
): string {
  if (selectedId === undefined) return 'No selection';
  if (selectedId === BUCKET_BETTING_ID) {
    return 'Betting — solve immediately';
  }
  const msg = MSGTYPE_RE.exec(selectedId);
  if (msg && sampleRow) {
    const def = issueTypeBySlug(msg[2]);
    return def?.label ?? sampleRow.messageName;
  }
  if (sampleRow) {
    const m = /^match-(.+)--(.+)$/.exec(selectedId ?? '');
    if (m) {
      const def = issueTypeBySlug(m[2]);
      return `${sampleRow.matchLabel} › ${def?.label ?? sampleRow.issueTypeLabel}`;
    }
  }
  return 'Notifications';
}
