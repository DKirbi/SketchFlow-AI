import {
  PdsBox,
  PdsMantineButton,
  PdsMantineMultiselect,
  type PdsMantineMultiselectDataObject,
} from '@podium-design-system/react-components';
import { FILTER_OPTION_ALL } from '../../constants';
import type { NotificationFilters } from '../../types';
import { ISSUE_TYPES } from '../../data/messageTypes';

/**
 * Single-select filters using Podium’s Mantine multiselect (there is no `PdsMantineSelect`
 * export in `@podium-design-system/react-components@2.19.4`; `maxDisplayValues={1}` matches
 * select behaviour).
 */
export interface NotificationsFiltersProps {
  value: NotificationFilters;
  onChange: (next: NotificationFilters) => void;
  onClearAll: () => void;
}

const daysData: PdsMantineMultiselectDataObject[] = [
  { title: '0 days', value: '0' },
  { title: '1 day', value: '1' },
  { title: '7 days', value: '7' },
  { title: '30 days', value: '30' },
];

const sportData: PdsMantineMultiselectDataObject[] = [
  { title: 'All sports', value: FILTER_OPTION_ALL },
  { title: 'Soccer', value: 'Soccer' },
  { title: 'Tennis', value: 'Tennis' },
  { title: 'Basketball', value: 'Basketball' },
];

const lsData: PdsMantineMultiselectDataObject[] = [
  { title: 'All levels', value: FILTER_OPTION_ALL },
  { title: 'LS1', value: 'LS1' },
  { title: 'LS2', value: 'LS2' },
  { title: 'LS3', value: 'LS3' },
];

const issueTypeData: PdsMantineMultiselectDataObject[] = [
  { title: 'All types', value: FILTER_OPTION_ALL },
  ...ISSUE_TYPES.map((i) => ({ title: i.label, value: i.slug })),
];

function normOptional(stored: string): string {
  return stored === '' ? FILTER_OPTION_ALL : stored;
}

export function NotificationsFilters({ value, onChange, onClearAll }: NotificationsFiltersProps) {
  const patch = (partial: Partial<NotificationFilters>) => {
    onChange({ ...value, ...partial });
  };

  return (
    <PdsBox padding="md" surface="on-light" direction="column" gap="md" stretchHorizontal>
      <PdsBox direction="row" wrap="wrap" fixedGap={'30px'} alignItems="end" stretchHorizontal>
        <PdsBox fixedWidth="200px">
          <PdsMantineMultiselect
            key={`days-${value.daysBack}`}
            label="Days back"
            labelSize="md"
            size="md"
            surface="on-light"
            opaqueBackground
            data={daysData}
            predValue={value.daysBack}
            maxDisplayValues={1}
            onSelect={(opt) => patch({ daysBack: opt.value })}
          />
        </PdsBox>
        <PdsBox fixedWidth="200px">
          <PdsMantineMultiselect
            key={`sport-${value.sport}`}
            label="Sport"
            labelSize="md"
            size="md"
            surface="on-light"
            opaqueBackground
            data={sportData}
            predValue={normOptional(value.sport) === FILTER_OPTION_ALL ? null : value.sport}
            placeholder="All sports"
            maxDisplayValues={1}
            clearable
            onClear={() => patch({ sport: FILTER_OPTION_ALL })}
            onSelect={(opt) => patch({ sport: opt.value })}
          />
        </PdsBox>
        <PdsBox fixedWidth="200px">
          <PdsMantineMultiselect
            key={`ls-${value.lsLevel}`}
            label="LS level"
            labelSize="md"
            size="md"
            surface="on-light"
            opaqueBackground
            data={lsData}
            predValue={normOptional(value.lsLevel) === FILTER_OPTION_ALL ? null : value.lsLevel}
            placeholder="All levels"
            maxDisplayValues={1}
            clearable
            onClear={() => patch({ lsLevel: FILTER_OPTION_ALL })}
            onSelect={(opt) => patch({ lsLevel: opt.value })}
          />
        </PdsBox>
        <PdsBox fixedWidth="240px">
          <PdsMantineMultiselect
            key={`type-${value.issueType}`}
            label="Type"
            labelSize="md"
            size="md"
            surface="on-light"
            opaqueBackground
            data={issueTypeData}
            predValue={normOptional(value.issueType) === FILTER_OPTION_ALL ? null : value.issueType}
            placeholder="All types"
            maxDisplayValues={1}
            clearable
            onClear={() => patch({ issueType: FILTER_OPTION_ALL })}
            onSelect={(opt) => patch({ issueType: opt.value })}
          />
        </PdsBox>
        <PdsMantineButton rank="subtle" color="neutral" surface="on-light" onClick={onClearAll}>
          Clear all
        </PdsMantineButton>
      </PdsBox>
    </PdsBox>
  );
}
