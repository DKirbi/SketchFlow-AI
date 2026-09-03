import type { ShowcaseExampleConfig, ShowcaseMode } from '../../runtime/types';
import type { PreviewStep } from '../../runtime/types';

export interface ShowcaseExampleProps {
  mode: ShowcaseMode;
  previewStepIndex: number;
  previewSteps: PreviewStep[];
  onInteractionComplete: () => void;
}

export const mappingExampleConfig: ShowcaseExampleConfig = {
  slug: 'mapping',
  experienceKey: 'sportradar',
  title: 'Mapping',
  summary:
    'Row-level entity mapping with a stateful Map control — idle, loading, and mapped feedback without a confirmation dialog.',
  patterns: ['P2.2', 'P3', 'P9'],
  patternSummaries: [
    {
      id: 'P2.2',
      title: 'P2.2 — Row actions',
      body: 'The Actions column hosts Map and Unmap. Map uses a compact stateful control; Unmap is a separate dismiss action with inline confirmation before remove.',
    },
    {
      id: 'P3',
      title: 'P3 — Stateful Button',
      body: 'Async row Map runs idle → loading → success on one control. No confirmation dialog before Map — the button state is the feedback mechanism.',
    },
    {
      id: 'P9',
      title: 'P9 — Filters',
      body: 'Genre and title search filters sit above the table. Operators commit criteria with Search; Clear all resets dependent table content.',
    },
  ],
  controls: [
    'LOFITable',
    'LOFIStatefulButton',
    'LOFICheckbox',
    'LOFIModal',
    'LOFIBadge',
    'LOFIToolbar',
    'LOFIField',
    'LOFIInput',
    'LOFISelect',
    'LOFIInlineAlert',
  ],
  iframePath: '/Sportradar/mapping',
  previewSteps: [
    { id: 'map-highlight', delayMs: 900, action: 'highlight-row', targetId: 'FSD-1003' },
    { id: 'map-loading', delayMs: 700, action: 'map-row-loading', targetId: 'FSD-1003' },
    {
      id: 'map-success',
      delayMs: 1100,
      action: 'map-row-success',
      targetId: 'FSD-1003',
      message: 'Oldboy mapped to external catalogue entry.',
    },
    {
      id: 'unmap-highlight',
      delayMs: 1000,
      action: 'unmap-row-highlight',
      targetId: 'FSD-1003',
    },
    { id: 'unmap-loading', delayMs: 900, action: 'unmap-row-loading', targetId: 'FSD-1003' },
    {
      id: 'unmap-success',
      delayMs: 1100,
      action: 'unmap-row-success',
      targetId: 'FSD-1003',
      message: 'Mapping removed.',
    },
    {
      id: 'select-rows',
      delayMs: 900,
      action: 'select-rows',
      targetIds: ['FSD-1006', 'FSD-1007'],
    },
    { id: 'bulk-highlight', delayMs: 800, action: 'bulk-map-highlight' },
    { id: 'bulk-confirm', delayMs: 900, action: 'bulk-map-confirm' },
    {
      id: 'bulk-loading',
      delayMs: 1200,
      action: 'bulk-map-loading',
      targetIds: ['FSD-1006', 'FSD-1007'],
    },
    {
      id: 'bulk-success',
      delayMs: 1000,
      action: 'bulk-map-success',
      targetIds: ['FSD-1006', 'FSD-1007'],
      message: '2 items bulk-mapped.',
    },
  ],
};
