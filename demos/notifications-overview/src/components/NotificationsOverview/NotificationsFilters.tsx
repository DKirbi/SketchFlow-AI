import { LOFIButton, LOFIField, LOFISelect, LOFIText } from 'lofi-kit';
import { FILTER_OPTION_ALL } from '../../constants';
import type { NotificationFilters } from '../../types';
import { ISSUE_TYPES } from '../../data/messageTypes';
import './NotificationsOverview.scss';

export interface NotificationsFiltersProps {
  value: NotificationFilters;
  onChange: (next: NotificationFilters) => void;
  onClearAll: () => void;
}

const daysOptions = [
  { value: '0', label: '0 days' },
  { value: '1', label: '1 day' },
  { value: '7', label: '7 days' },
  { value: '30', label: '30 days' },
];

const sportOptions = [
  { value: FILTER_OPTION_ALL, label: 'All sports' },
  { value: 'Soccer', label: 'Soccer' },
  { value: 'Tennis', label: 'Tennis' },
  { value: 'Volleyball', label: 'Volleyball' },
];

const lsOptions = [
  { value: FILTER_OPTION_ALL, label: 'All levels' },
  { value: 'LS1', label: 'LS1' },
  { value: 'LS2', label: 'LS2' },
  { value: 'LS3', label: 'LS3' },
];

const issueTypeOptions = [
  { value: FILTER_OPTION_ALL, label: 'All types' },
  ...ISSUE_TYPES.map((i) => ({ value: i.slug, label: i.label })),
];

/** Radix item values cannot be empty; persist clears as FILTER_OPTION_ALL. */
function coalesceSelectValue(v: string): string {
  return v === '' ? FILTER_OPTION_ALL : v;
}

function selectValue(stored: string): string {
  return stored === '' ? FILTER_OPTION_ALL : stored;
}

export function NotificationsFilters({ value, onChange, onClearAll }: NotificationsFiltersProps) {
  const patch = (partial: Partial<NotificationFilters>) => {
    onChange({ ...value, ...partial });
  };

  return (
    <div className="notifications-overview__filters" role="search">
      <LOFIText as="p" variant="micro" className="notifications-overview__filters-legend">
        Filters apply together (AND). Each field can be cleared independently.
      </LOFIText>
      <div className="notifications-overview__filters-grid">
        <LOFIField label="Days back" htmlFor="f-days">
          <LOFISelect
            id="f-days"
            value={value.daysBack}
            onChange={(v) => patch({ daysBack: v })}
            options={daysOptions}
            size="compact"
          />
        </LOFIField>
        <LOFIField label="Sport" htmlFor="f-sport">
          <LOFISelect
            id="f-sport"
            value={selectValue(value.sport)}
            onChange={(v) => patch({ sport: coalesceSelectValue(v) })}
            options={sportOptions}
            placeholder="All sports"
            allowClear
            size="compact"
          />
        </LOFIField>
        <LOFIField label="LS level" htmlFor="f-ls">
          <LOFISelect
            id="f-ls"
            value={selectValue(value.lsLevel)}
            onChange={(v) => patch({ lsLevel: coalesceSelectValue(v) })}
            options={lsOptions}
            placeholder="All levels"
            allowClear
            size="compact"
          />
        </LOFIField>
        <LOFIField label="Type" htmlFor="f-type">
          <LOFISelect
            id="f-type"
            value={selectValue(value.issueType)}
            onChange={(v) => patch({ issueType: coalesceSelectValue(v) })}
            options={issueTypeOptions}
            placeholder="All types"
            allowClear
            size="compact"
          />
        </LOFIField>
        <div className="notifications-overview__filters-actions">
          <LOFIButton type="button" variant="dismiss" onClick={onClearAll}>
            Clear all
          </LOFIButton>
        </div>
      </div>
    </div>
  );
}
