/** Auto-suggested numeric string fields by match type (Section 4 cricket). */
export interface CricketDefaultRow {
  days: string;
  overs: string;
  powerplay: string;
  maxBowler: string;
  batPp: string;
  reviews: string;
}

/** Match type value → suggested fields (strings; empty means clear / N/A). */
export const CRICKET_DEFAULTS_BY_TYPE: Record<string, CricketDefaultRow> = {
  Test:       { days: '5', overs: '', powerplay: '', maxBowler: '', batPp: '', reviews: '2' },
  ODI:        { days: '', overs: '50', powerplay: '10', maxBowler: '10', batPp: '5', reviews: '1' },
  T20Intl:    { days: '', overs: '20', powerplay: '6', maxBowler: '4', batPp: '', reviews: '' },
  T20Dom:     { days: '', overs: '20', powerplay: '6', maxBowler: '4', batPp: '', reviews: '' },
  FirstClass: { days: '', overs: '', powerplay: '', maxBowler: '', batPp: '', reviews: '2' },
  ListA:      { days: '', overs: '50', powerplay: '10', maxBowler: '10', batPp: '5', reviews: '1' },
  T10:        { days: '', overs: '10', powerplay: '', maxBowler: '2', batPp: '', reviews: '' },
  TheHundred: { days: '', overs: '100-balls', powerplay: '', maxBowler: '20-balls', batPp: '', reviews: '' },
  Friendly:   { days: '', overs: '', powerplay: '', maxBowler: '', batPp: '', reviews: '' },
};

export const CRICKET_MATCH_TYPES = [
  { value: 'Test', label: 'Test' },
  { value: 'ODI', label: 'ODI' },
  { value: 'T20Intl', label: 'T20 International' },
  { value: 'T20Dom', label: 'T20 Domestic' },
  { value: 'FirstClass', label: 'First Class' },
  { value: 'ListA', label: 'List A' },
  { value: 'T10', label: 'T10' },
  { value: 'TheHundred', label: 'The Hundred (balls)' },
  { value: 'Friendly', label: 'Friendly' },
];

export function cricketDefaultsForType(matchType: string): CricketDefaultRow | undefined {
  return CRICKET_DEFAULTS_BY_TYPE[matchType];
}

/** True when Days played applies (Test / First Class). */
export function cricketShowDaysPlayed(matchType: string): boolean {
  return matchType === 'Test' || matchType === 'FirstClass';
}
