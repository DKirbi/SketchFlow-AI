import { LOFIButton, LOFIField, LOFIInput, LOFISelect, LOFISwitch, LOFIText } from 'lofi-kit';

import { FILTER_OPTION_ALL } from '../../constants';
import type { TournamentFilters } from '../../types';
import {
  CATEGORIES,
  SPORTS,
  UNIQUE_TOURNAMENTS,
  categoriesForSport,
  uniqueTournamentsForCategory,
} from '../../data/catalog';

export interface FilterRowProps {
  draft: TournamentFilters;
  applied: TournamentFilters;
  onPatchDraft: (partial: Partial<TournamentFilters>) => void;
  onCommitSearch: () => void;
  onClearAll: () => void;
  onToggleDemoFailNext: () => void;
}

function selectStored(v: string): string {
  return v === FILTER_OPTION_ALL ? FILTER_OPTION_ALL : v;
}

function coerce(v: string): typeof FILTER_OPTION_ALL | string {
  return v === '' ? FILTER_OPTION_ALL : v;
}

export function FilterRow({
  draft,
  applied,
  onPatchDraft,
  onCommitSearch,
  onClearAll,
  onToggleDemoFailNext,
}: FilterRowProps) {
  const sportSel = draft.sportId === FILTER_OPTION_ALL ? FILTER_OPTION_ALL : draft.sportId;

  const categoryChoices =
    draft.sportId === FILTER_OPTION_ALL ? CATEGORIES : categoriesForSport(draft.sportId);

  const utChoices =
    draft.categoryId === FILTER_OPTION_ALL
      ? UNIQUE_TOURNAMENTS
      : uniqueTournamentsForCategory(draft.categoryId);

  const countsMatch =
    draft.nameOrId === applied.nameOrId &&
    draft.sportId === applied.sportId &&
    draft.categoryId === applied.categoryId &&
    draft.uniqueTournamentId === applied.uniqueTournamentId &&
    draft.dateFrom === applied.dateFrom &&
    draft.dateTo === applied.dateTo &&
    draft.onlyRunning === applied.onlyRunning &&
    draft.demoFailNextMutation === applied.demoFailNextMutation;

  return (
    <div className="tmgmt__filters" role="search">
      <LOFIText variant="micro" className="tmgmt__filters-legend">
        Filters combine with AND logic. Clear each field with ✕ or reset everything with Clear
        all. Changes apply after Search.
      </LOFIText>
      <div className="tmgmt__filters-grid">
        <LOFIField label="Simple tournament name or ID" htmlFor="tm-q">
          <LOFIInput
            id="tm-q"
            allowClear
            placeholder="Search by name or id…"
            type="search"
            value={draft.nameOrId}
            onChange={(val) => onPatchDraft({ nameOrId: val })}
          />
        </LOFIField>
        <LOFIField label="Sport" htmlFor="tm-sp">
          <LOFISelect
            allowClear
            placeholder="All sports"
            id="tm-sp"
            size="compact"
            value={selectStored(draft.sportId)}
            onChange={(v) =>
              onPatchDraft({
                sportId: coerce(v),
                categoryId: FILTER_OPTION_ALL,
                uniqueTournamentId: FILTER_OPTION_ALL,
              })
            }
            options={[
              { value: FILTER_OPTION_ALL, label: 'All sports' },
              ...SPORTS.map((s) => ({ value: s.id, label: s.label })),
            ]}
          />
        </LOFIField>
        <LOFIField label="Category" htmlFor="tm-cat">
          <LOFISelect
            allowClear
            placeholder="All categories"
            id="tm-cat"
            size="compact"
            disabled={sportSel === FILTER_OPTION_ALL}
            value={selectStored(draft.categoryId)}
            onChange={(v) =>
              onPatchDraft({
                categoryId: coerce(v),
                uniqueTournamentId: FILTER_OPTION_ALL,
              })
            }
            options={[
              { value: FILTER_OPTION_ALL, label: 'All categories' },
              ...categoryChoices.map((c) => ({ value: c.id, label: c.label })),
            ]}
          />
        </LOFIField>
        <LOFIField label="Unique tournament ID" htmlFor="tm-ut">
          <LOFISelect
            allowClear
            placeholder="All tournaments"
            id="tm-ut"
            size="compact"
            disabled={draft.categoryId === FILTER_OPTION_ALL}
            value={selectStored(draft.uniqueTournamentId)}
            onChange={(v) => onPatchDraft({ uniqueTournamentId: coerce(v) })}
            options={[
              { value: FILTER_OPTION_ALL, label: 'All unique tournaments' },
              ...utChoices.map((u) => ({ value: u.id, label: `${u.label} (${u.id})` })),
            ]}
          />
        </LOFIField>
        <LOFIField label="Date from" htmlFor="tm-df">
          <LOFIInput
            id="tm-df"
            type="date"
            allowClear
            value={draft.dateFrom}
            onChange={(v) => onPatchDraft({ dateFrom: v })}
          />
        </LOFIField>
        <LOFIField label="Date to" htmlFor="tm-dt">
          <LOFIInput
            id="tm-dt"
            type="date"
            allowClear
            value={draft.dateTo}
            onChange={(v) => onPatchDraft({ dateTo: v })}
          />
        </LOFIField>
        <LOFIField label="Only running" hint="Mocked “running” flag on each simple tournament">
          <LOFISwitch
            label="Only running"
            checked={draft.onlyRunning}
            onChange={(v) => onPatchDraft({ onlyRunning: v })}
          />
        </LOFIField>
        <LOFIField
          label="Demo"
          hint="Forces the next save / move / remove attempt to fail once (resets after Search commits draft)"
        >
          <LOFISwitch
            label="Fail next mutation (demo)"
            checked={draft.demoFailNextMutation}
            onChange={() => onToggleDemoFailNext()}
          />
        </LOFIField>
        <div className="tmgmt__filters-actions">
          <LOFIButton type="button" variant="primary" onClick={onCommitSearch} disabled={countsMatch}>
            Search
          </LOFIButton>
          <LOFIButton type="button" variant="dismiss" onClick={onClearAll}>
            Clear all
          </LOFIButton>
        </div>
      </div>
    </div>
  );
}
