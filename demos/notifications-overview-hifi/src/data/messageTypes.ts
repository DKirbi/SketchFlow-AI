import type { MessageCategory } from '../types';

export interface IssueTypeDef {
  slug: string;
  label: string;
  category: MessageCategory;
}

export const CATEGORY_LABELS: Record<MessageCategory, string> = {
  'match-state': 'Match State',
  'missing-data': 'Missing data',
  'markets-state': 'Markets state',
  'incorrect-data': 'Incorrect data',
};

/** Verbatim labels from the design brief (Betstart spelling vs screenshot). */
export const ISSUE_TYPES: IssueTypeDef[] = [
  { slug: 'connection-issues', label: 'Connection issues', category: 'match-state' },
  { slug: 'no-scouting-entries', label: 'No scouting entries', category: 'match-state' },
  { slug: 'period-lasting-too-long', label: 'Period lasting too long', category: 'match-state' },
  { slug: 'period-ended-early', label: 'Period ended early', category: 'match-state' },
  { slug: 'period-delayed', label: 'Period delayed', category: 'match-state' },
  {
    slug: 'extraordinary-time-adjustment',
    label: 'Extraordinary time adjustment',
    category: 'match-state',
  },

  { slug: 'goal-scorer', label: 'Goal — Scorer', category: 'missing-data' },
  { slug: 'booking-yellow-card', label: 'Booking — Yellow card', category: 'missing-data' },
  { slug: 'missing-player-info', label: 'Missing player info', category: 'missing-data' },
  { slug: 'corner', label: 'Corner', category: 'missing-data' },

  { slug: 'betstart-not-set', label: 'Betstart not set', category: 'markets-state' },
  { slug: 'extended-betstop', label: 'Extended betstop', category: 'markets-state' },

  {
    slug: 'deleted-events-impacting-markets',
    label: 'Deleted events impacting markets',
    category: 'incorrect-data',
  },
  {
    slug: 'player-assigned-not-on-field',
    label: 'Player assigned not on field',
    category: 'incorrect-data',
  },
  {
    slug: 'discrepancy-between-scouts',
    label: 'Discrepancy between scouts',
    category: 'incorrect-data',
  },
  { slug: 'illogical-entries', label: 'Illogical entries', category: 'incorrect-data' },
];

export function issueTypeBySlug(slug: string): IssueTypeDef | undefined {
  return ISSUE_TYPES.find((i) => i.slug === slug);
}
