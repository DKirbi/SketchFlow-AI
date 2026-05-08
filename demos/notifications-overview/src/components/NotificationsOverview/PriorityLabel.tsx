import { LOFIBadge } from 'lofi-kit';
import type { NotificationRow } from '../../types';

export interface PriorityLabelProps {
  row: NotificationRow;
}

/** Text-only priority — no colour emphasis (lo-fi). */
export function PriorityLabel({ row }: PriorityLabelProps) {
  if (row.dataset === 'BETTING') {
    return <LOFIBadge variant="tag" label="BETTING" />;
  }
  const band = row.priority <= 5 ? 'LOW' : 'HIGH';
  return <LOFIBadge variant="tag" label={`${band} ${row.priority}`} />;
}
