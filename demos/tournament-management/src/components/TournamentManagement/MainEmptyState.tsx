import { LOFIButton, LOFIText } from 'lofi-kit';

export interface MainEmptyStateProps {
  /** First-use / pick navigation targets */
  variant: 'pick-sidebar' | 'pick-browse' | 'no-matching-data';
  onClearAll?: () => void;
}

export function MainEmptyState({ variant, onClearAll }: MainEmptyStateProps) {
  if (variant === 'no-matching-data') {
    return (
      <div className="tmgmt__empty-main">
        <LOFIText variant="body">No tournaments match the current filters.</LOFIText>
        <LOFIText variant="description">
          The sidebar is empty for this Search. Clear filters or widen the query, then run Search again.
        </LOFIText>
        {onClearAll ? (
          <LOFIButton type="button" variant="primary" onClick={onClearAll}>
            Clear all filters
          </LOFIButton>
        ) : null}
      </div>
    );
  }

  if (variant === 'pick-sidebar') {
    return (
      <div className="tmgmt__empty-main">
        <LOFIText variant="body">Pick a Sport, Unique Tournament, or Tournament from the sidebar to start.</LOFIText>
        <LOFIText variant="description">
          Sport and Unique Tournament parents are selectable management views. Expand the tree to drill down
          into categories and open simple tournament details.
        </LOFIText>
        {onClearAll ? (
          <LOFIButton type="button" variant="dismiss" onClick={onClearAll}>
            Clear all filters
          </LOFIButton>
        ) : null}
      </div>
    );
  }

  return (
    <div className="tmgmt__empty-main">
      <LOFIText variant="body">Choose a selectable sidebar node.</LOFIText>
      <LOFIText variant="description">
        Categories organize navigation only. Pick a sport for grouped management, a unique tournament for child
        row management, or a simple tournament leaf for detail view.
      </LOFIText>
    </div>
  );
}
