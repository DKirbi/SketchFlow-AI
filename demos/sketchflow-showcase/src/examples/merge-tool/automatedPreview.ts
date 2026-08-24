import type { PreviewStep } from '../../runtime/types';
import {
  applyOverrides,
  cloneDbMovies,
  CRAWLED_RECORDS,
  CURRENT_USER,
  type DbFilmRecord,
  type FieldKey,
} from './mockData';

export interface AutomatedSnapshot {
  dbMovies: DbFilmRecord[];
  selectedDbId: string | null;
  selectedCrawledId: string | null;
  highlightMergeButton: boolean;
  modalOpen: boolean;
  overrides: Set<FieldKey>;
  highlightModalMerge: boolean;
  confirmOpen: boolean;
  confirmLoading: boolean;
  toast: { severity: 'success'; message: string } | null;
}

const AUTO_TS = '10 Aug 2026, 14:22';

/** Derive the in-prototype UI snapshot after applying preview steps 0..stepIndex. */
export function computeAutomatedSnapshot(steps: PreviewStep[], stepIndex: number): AutomatedSnapshot {
  let dbMovies = cloneDbMovies();
  let selectedDbId: string | null = null;
  let selectedCrawledId: string | null = null;
  let highlightMergeButton = false;
  let modalOpen = false;
  let overrides = new Set<FieldKey>();
  let highlightModalMerge = false;
  let confirmOpen = false;
  let confirmLoading = false;
  let toast: { severity: 'success'; message: string } | null = null;

  const end = Math.min(stepIndex, steps.length - 1);
  for (let i = 0; i <= end; i += 1) {
    const step = steps[i]!;
    highlightMergeButton = false;
    highlightModalMerge = false;

    switch (step.action) {
      case 'expand-row':
      case 'collapse-row':
      case 'show-suggestions':
        break;
      case 'select-db-row':
        selectedDbId = step.targetId ?? null;
        break;
      case 'select-crawled-row':
        selectedCrawledId = step.targetId ?? null;
        break;
      case 'highlight-merge-button':
        highlightMergeButton = true;
        break;
      case 'open-merge-modal':
        modalOpen = true;
        break;
      case 'toggle-field-override':
        modalOpen = true;
        if (step.targetId) overrides = new Set([...overrides, step.targetId as FieldKey]);
        break;
      case 'toggle-master-override':
        modalOpen = true;
        overrides = new Set(['title', 'releaseDate', 'genre', 'origin', 'director', 'cast']);
        break;
      case 'highlight-modal-merge':
        modalOpen = true;
        highlightModalMerge = true;
        break;
      case 'open-merge-confirm':
        modalOpen = true;
        confirmOpen = true;
        break;
      case 'confirm-merge-loading':
        modalOpen = true;
        confirmOpen = true;
        confirmLoading = true;
        break;
      case 'confirm-merge-success': {
        confirmLoading = false;
        confirmOpen = false;
        modalOpen = false;
        const crawledRecord = selectedCrawledId
          ? CRAWLED_RECORDS.find((r) => r.id === selectedCrawledId)
          : undefined;
        if (selectedDbId && crawledRecord) {
          dbMovies = dbMovies.map((movie) =>
            movie.id === selectedDbId
              ? {
                  ...applyOverrides(movie, crawledRecord, overrides),
                  merged: true,
                  mergedAt: AUTO_TS,
                  mergedBy: CURRENT_USER.handle,
                }
              : movie,
          );
        }
        selectedDbId = null;
        selectedCrawledId = null;
        overrides = new Set();
        toast = { severity: 'success', message: step.message ?? 'Movie merged into the database.' };
        break;
      }
      default:
        break;
    }
  }

  return {
    dbMovies,
    selectedDbId,
    selectedCrawledId,
    highlightMergeButton,
    modalOpen,
    overrides,
    highlightModalMerge,
    confirmOpen,
    confirmLoading,
    toast,
  };
}
