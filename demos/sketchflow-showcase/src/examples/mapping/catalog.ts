/** Film genres used by mapping P9 filters — aligned with Merge Tool catalogue. */

export interface GenreOption {
  id: string;
  label: string;
}

export const FILTER_ALL = 'all';

export const GENRES: GenreOption[] = [
  { id: 'gn-drama', label: 'Drama' },
  { id: 'gn-comedy', label: 'Comedy' },
  { id: 'gn-thriller', label: 'Thriller' },
  { id: 'gn-scifi', label: 'Science Fiction' },
  { id: 'gn-animation', label: 'Animation' },
  { id: 'gn-war', label: 'War' },
  { id: 'gn-fantasy', label: 'Fantasy' },
];
