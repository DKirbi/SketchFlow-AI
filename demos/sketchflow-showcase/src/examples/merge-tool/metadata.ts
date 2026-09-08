import type { ShowcaseExampleConfig } from '../../runtime/types';

export const mergeToolExampleConfig: ShowcaseExampleConfig = {
  slug: 'merge-tool',
  experienceKey: 'film-catalogue',
  title: 'Merge Tool',
  summary:
    'Stacked entity reconciliation: pick a database title and a crawled match, review field-by-field overrides in a modal, and commit the merge.',
  patterns: ['P2', 'P2.3', 'P2.5', 'P5', 'P6', 'P7', 'P8'],
  patternSummaries: [
    {
      id: 'P2 / P2.3',
      title: 'P2 / P2.3 — Data table + single-select',
      body: 'Both the database and crawler-match tables use a single radio column so exactly one row per table can be chosen before merging.',
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
    'LOFIPagination',
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
};
