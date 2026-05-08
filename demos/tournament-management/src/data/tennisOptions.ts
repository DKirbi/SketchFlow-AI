/** Tennis surfaces (Section 6) — value keys for LOFISelect */

export const TENNIS_SURFACE_OPTIONS = [
  { value: 'grass', label: 'Grass' },
  { value: 'redClay', label: 'Red clay' },
  { value: 'greenClay', label: 'Green clay' },
  { value: 'hardcourtIndoor', label: 'Hardcourt indoor' },
  { value: 'hardcourtOutdoor', label: 'Hardcourt outdoor' },
  { value: 'carpetIndoor', label: 'Carpet indoor' },
  { value: 'synIndoor', label: 'Synthetics indoor' },
  { value: 'synOutdoor', label: 'Synthetics outdoor' },
  { value: 'synGrass', label: 'Synthetics grass' },
  { value: 'redClayIndoor', label: 'Red clay indoor' },
];

export const TENNIS_PLAYER_COUNT_OPTIONS = [
  '2',
  '3',
  '4',
  '8',
  '16',
  '24',
  '28',
  '32',
  '48',
  '64',
  '96',
  '128',
  '256',
].map((n) => ({ value: n, label: n }));

export const TENNIS_BEST_OF_OPTIONS = [
  { value: 'bo3', label: 'Best of 3' },
  { value: 'bo3-finals', label: 'Best of 3, Best of 5 in final' },
  { value: 'bo5', label: 'Best of 5' },
];

export const CURRENCY_OPTIONS = [
  { value: 'EUR', label: 'EUR' },
  { value: 'GBP', label: 'GBP' },
  { value: 'USD', label: 'USD' },
  { value: 'AUD', label: 'AUD' },
];
