import type { ReactNode } from 'react';
import { Text } from '../Text/Text';
import './EmptyState.scss';

export type EmptyStateVariant = 'first-use' | 'no-results' | 'error';

export interface EmptyStateProps {
  /** Shapes the headline and supporting copy intent. One of: first-use | no-results | error. */
  variant?: EmptyStateVariant;
  /** Short bold headline — "No X yet", "No results for [filter]", "Could not load X". */
  title: string;
  /** One sentence of supporting text below the headline. */
  description?: string;
  /** Optional CTA — LOFIButton for first-use/error, dismiss button to clear filters for no-results. */
  action?: ReactNode;
}

export function EmptyState({ variant = 'first-use', title, description, action }: EmptyStateProps) {
  const cls = ['empty-state', `empty-state--${variant}`].join(' ');

  return (
    <div className={cls}>
      <Text as="p" variant="body">{title}</Text>
      {description && (
        <Text as="p" variant="muted">{description}</Text>
      )}
      {action && (
        <div className="empty-state__action">{action}</div>
      )}
    </div>
  );
}
