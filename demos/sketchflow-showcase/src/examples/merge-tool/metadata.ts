import type { ShowcaseExampleConfig, ShowcaseMode, PreviewStep } from '../../runtime/types';

export interface ShowcaseExampleProps {
  mode: ShowcaseMode;
  previewStepIndex: number;
  previewSteps: PreviewStep[];
  onInteractionComplete: () => void;
}

export const mergeToolExampleConfig: ShowcaseExampleConfig = {
  slug: 'merge-tool',
  experienceKey: 'film-catalogue',
  title: 'Merge Tool',
  summary:
    'Two-column entity reconciliation: pick a database title and a crawled match, review field-by-field overrides in a modal, and commit the merge.',
  patterns: ['P2', 'P2.3', 'P2.5', 'P5', 'P6', 'P7', 'P8'],
  patternSummaries: [
    {
      id: 'P2 / P2.3',
      title: 'P2 / P2.3 — Data table + single-select',
      body: 'Both the database and crawler-match tables use a single radio column so exactly one row per side can be chosen before merging.',
    },
    {
      id: 'P2.5 / P8',
      title: 'P2.5 / P8 — Expandable rows + tabs',
      body: 'Rows expand (chevron, or the "…" next to Top Cast) into a tabbed Cast / Staff / Filming Locations detail view, independent of row selection.',
    },
    {
      id: 'P5 / P6',
      title: 'P5 / P6 — Modal + commit gating',
      body: 'Merge opens a review modal comparing the kept record against the crawled match; its Merge action stays disabled until at least one field is overridden.',
    },
    {
      id: 'P7',
      title: 'P7 — Confirmation dialog',
      body: 'A confirmation-only overlay stacks on the review modal before the merge commits — the one permitted modal-stacking exception.',
    },
  ],
  controls: [
    'LOFITable',
    'LOFIRadio',
    'LOFICheckbox',
    'LOFIModal',
    'LOFITabs',
    'LOFIBadge',
    'LOFIToolbar',
    'LOFIField',
    'LOFIInput',
    'LOFIButton',
    'LOFIToast',
    'LOFIEmptyState',
    'LOFIInlineAlert',
    'LOFILoader',
  ],
  iframePath: '/Sportradar/merge-tool',
  previewSteps: [
    { id: 'peek-db-row', delayMs: 900, action: 'expand-row', targetId: 'FSD-1003' },
    { id: 'settle-db-row', delayMs: 700, action: 'collapse-row', targetId: 'FSD-1003' },
    { id: 'select-db', delayMs: 800, action: 'select-db-row', targetId: 'FSD-1003' },
    { id: 'show-suggestions', delayMs: 700, action: 'show-suggestions', targetId: 'FSD-1003' },
    { id: 'select-crawled', delayMs: 900, action: 'select-crawled-row', targetId: 'CRWL-2008' },
    { id: 'highlight-merge', delayMs: 700, action: 'highlight-merge-button' },
    { id: 'open-modal', delayMs: 800, action: 'open-merge-modal' },
    { id: 'toggle-title', delayMs: 700, action: 'toggle-field-override', targetId: 'title' },
    { id: 'toggle-genre', delayMs: 700, action: 'toggle-field-override', targetId: 'genre' },
    { id: 'highlight-modal-merge', delayMs: 700, action: 'highlight-modal-merge' },
    { id: 'open-confirm', delayMs: 800, action: 'open-merge-confirm' },
    { id: 'confirm-loading', delayMs: 1200, action: 'confirm-merge-loading' },
    {
      id: 'confirm-success',
      delayMs: 1100,
      action: 'confirm-merge-success',
      message: 'Oldboy merged into the database.',
    },
  ],
};
