import type { MockCatalogId } from 'shared-catalogs';
import {
  cloneDbMovies,
  CRAWLED_RECORDS,
  SUGGESTIONS,
  type CrawledRecord,
  type DbFilmRecord,
  type SuggestionCandidate,
} from './mockData';
import {
  cloneWizardingDb,
  WIZARDING_CRAWLED,
  WIZARDING_SUGGESTIONS,
} from './wizardingMockData';

export interface MergeCatalogSource {
  id: MockCatalogId;
  cloneDb: () => DbFilmRecord[];
  crawled: CrawledRecord[];
  suggestions: Record<string, SuggestionCandidate[]>;
}

export function getMergeCatalog(id: MockCatalogId): MergeCatalogSource {
  if (id === 'wizarding') {
    return {
      id,
      cloneDb: cloneWizardingDb,
      crawled: WIZARDING_CRAWLED,
      suggestions: WIZARDING_SUGGESTIONS,
    };
  }
  return {
    id: 'film',
    cloneDb: cloneDbMovies,
    crawled: CRAWLED_RECORDS,
    suggestions: SUGGESTIONS,
  };
}
