export type MockCatalogId = 'wizarding' | 'film';

export const MOCK_CATALOG_OPTIONS: { value: MockCatalogId; label: string }[] = [
  { value: 'wizarding', label: 'Wizarding world' },
  { value: 'film', label: 'Film catalogue' },
];

export const MAPPING_EXPAND_HINT =
  'Expand a row to rank AI suggestions. Map one suggestion per entity.';
