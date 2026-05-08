import { LOFIButton, LOFICheckbox, LOFIInput, LOFIText } from 'lofi-kit';

export interface ListHeaderProps {
  /** "+ Add tournament" handler. */
  onCreate: () => void;
  /** Local search query. */
  search: string;
  /** Called with the new query string. */
  onSearchChange: (value: string) => void;
  /** Whether unique-class rows are visible. */
  showUnique: boolean;
  /** Toggle unique-class visibility. */
  onToggleUnique: (checked: boolean) => void;
  /** Whether simple-class rows are visible. */
  showSimple: boolean;
  /** Toggle simple-class visibility. */
  onToggleSimple: (checked: boolean) => void;
  /** Add-button label override; default "+ Add tournament". */
  addLabel?: string;
}

/**
 * Per-table management bar used at every selectable level (sport, category,
 * unique tournament). Search input filters by name/id; checkboxes filter the
 * Unique vs. Simple class derived from `uniqueTournamentId`.
 */
export function ListHeader({
  onCreate,
  search,
  onSearchChange,
  showUnique,
  onToggleUnique,
  showSimple,
  onToggleSimple,
  addLabel = '+ Add tournament',
}: ListHeaderProps) {
  return (
    <div className="tmgmt__list-header">
      <div className="tmgmt__list-header-search">
        <LOFIInput
          type="search"
          value={search}
          onChange={onSearchChange}
          placeholder="Filter by name or ID"
          allowClear
        />
      </div>
      <div className="tmgmt__list-header-filters">
        <LOFIText variant="description" className="tmgmt__list-header-legend">
          Class
        </LOFIText>
        <LOFICheckbox
          checked={showUnique}
          onChange={onToggleUnique}
          label="Unique"
          id="list-filter-unique"
        />
        <LOFICheckbox
          checked={showSimple}
          onChange={onToggleSimple}
          label="Simple"
          id="list-filter-simple"
        />
      </div>
      <LOFIButton type="button" variant="primary" onClick={onCreate}>
        {addLabel}
      </LOFIButton>
    </div>
  );
}
