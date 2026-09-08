import type { ShowcaseExampleConfig } from '../../runtime/types';

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
  ],
  iframePath: '/Sportradar/mapping',
};
