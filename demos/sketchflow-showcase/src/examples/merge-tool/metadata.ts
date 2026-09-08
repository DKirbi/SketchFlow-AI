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
      body: 'Two tables, one radio each (Chunking / Miller’s Law) so you hold one database row and one crawled match before Merge.',
    },
    {
      id: 'P2.5 / P8',
      title: 'P2.5 / P8 — Expandable rows + tabs',
      body: 'Expand a row into Cast / Staff / Locations tabs (Chunking / Zeigarnik Effect) without losing the selected merge rows.',
    },
    {
      id: 'P5 / P6',
      title: 'P5 / P6 — Modal + commit gating',
      body: 'Merge opens one review modal (Cognitive Load). Commit stays off until an override (Postel’s Law).',
    },
    {
      id: 'P7',
      title: 'P7 — Confirmation dialog',
      body: 'Tesler’s Law / Hick’s Law — a two-answer confirmation stacks on the review modal before commit, the only allowed stack.',
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
