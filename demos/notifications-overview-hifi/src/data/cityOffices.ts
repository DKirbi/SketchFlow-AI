import type { PdsMantineMultiselectDataObject } from '@podium-design-system/react-components';
import type { CityOfficeId } from '../types';

export const ALL_OFFICES_VALUE = '__all_offices__';

export const CITY_OFFICE_LABELS: Record<CityOfficeId, string> = {
  london: 'London',
  berlin: 'Berlin',
  singapore: 'Singapore',
};

/** Left dock control — grouped labels for a couple of regional offices. */
export const cityOfficeSelectData: PdsMantineMultiselectDataObject[] = [
  { title: 'All city offices', value: ALL_OFFICES_VALUE },
  { title: 'EMEA · London', value: 'london' },
  { title: 'EMEA · Berlin', value: 'berlin' },
  { title: 'APAC · Singapore', value: 'singapore' },
];
