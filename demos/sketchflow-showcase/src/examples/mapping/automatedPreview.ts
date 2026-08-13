import { cloneItems, CURRENT_USER, INITIAL_ITEMS, type MappingItem } from './mockData';
import type { PreviewStep } from '../../runtime/types';

export interface AutomatedSnapshot {
  items: MappingItem[];
  selected: Set<string>;
  loadingIds: Set<string>;
  bulkConfirmOpen: boolean;
  highlightRowId: string | null;
  highlightBulkToolbar: boolean;
  unmapHighlightRowId: string | null;
  statusMessage: string | null;
}

const AUTO_TS = '10 Aug 2026, 14:22';

function mapItem(item: MappingItem): MappingItem {
  return {
    ...item,
    status: 'mapped',
    mappedAt: AUTO_TS,
    mappedBy: CURRENT_USER.handle,
  };
}

function unmapItem(item: MappingItem): MappingItem {
  return {
    ...item,
    status: 'pending',
    mappedAt: undefined,
    mappedBy: undefined,
  };
}

/** Derive the in-prototype UI snapshot after applying preview steps 0..stepIndex. */
export function computeAutomatedSnapshot(
  steps: PreviewStep[],
  stepIndex: number,
): AutomatedSnapshot {
  let items = cloneItems(INITIAL_ITEMS);
  let selected = new Set<string>();
  let loadingIds = new Set<string>();
  let bulkConfirmOpen = false;
  let highlightRowId: string | null = null;
  let highlightBulkToolbar = false;
  let unmapHighlightRowId: string | null = null;
  let statusMessage: string | null = null;

  const end = Math.min(stepIndex, steps.length - 1);
  for (let i = 0; i <= end; i += 1) {
    const step = steps[i]!;
    highlightRowId = null;
    highlightBulkToolbar = false;
    unmapHighlightRowId = null;

    switch (step.action) {
      case 'highlight-row':
        highlightRowId = step.targetId ?? null;
        break;
      case 'map-row-loading':
        loadingIds = new Set(step.targetId ? [step.targetId] : []);
        statusMessage = null;
        break;
      case 'map-row-success':
        loadingIds = new Set();
        if (step.targetId) {
          items = items.map((item) => (item.id === step.targetId ? mapItem(item) : item));
          selected = new Set([...selected].filter((id) => id !== step.targetId));
        }
        statusMessage = step.message ?? null;
        break;
      case 'unmap-row-highlight':
        unmapHighlightRowId = step.targetId ?? null;
        break;
      case 'unmap-row-loading':
        loadingIds = new Set(step.targetId ? [step.targetId] : []);
        unmapHighlightRowId = step.targetId ?? null;
        statusMessage = null;
        break;
      case 'unmap-row-success':
        loadingIds = new Set();
        if (step.targetId) {
          items = items.map((item) => (item.id === step.targetId ? unmapItem(item) : item));
        }
        statusMessage = step.message ?? null;
        break;
      case 'select-rows':
        selected = new Set(step.targetIds ?? []);
        break;
      case 'bulk-map-highlight':
        highlightBulkToolbar = true;
        break;
      case 'bulk-map-confirm':
        bulkConfirmOpen = true;
        highlightBulkToolbar = true;
        break;
      case 'bulk-map-loading':
        bulkConfirmOpen = false;
        loadingIds = new Set(step.targetIds ?? []);
        highlightBulkToolbar = true;
        statusMessage = null;
        break;
      case 'bulk-map-success':
        loadingIds = new Set();
        bulkConfirmOpen = false;
        highlightBulkToolbar = false;
        if (step.targetIds?.length) {
          items = items.map((item) => (step.targetIds!.includes(item.id) ? mapItem(item) : item));
        }
        selected = new Set();
        statusMessage = step.message ?? null;
        break;
      default:
        break;
    }
  }

  return {
    items,
    selected,
    loadingIds,
    bulkConfirmOpen,
    highlightRowId,
    highlightBulkToolbar,
    unmapHighlightRowId,
    statusMessage,
  };
}
