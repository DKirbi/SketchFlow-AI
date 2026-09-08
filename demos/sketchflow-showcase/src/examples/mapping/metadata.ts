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
      body: 'Actions hosts Map and Unmap. Map is the row commit; Unmap is the separate reverse with a confirm.',
    },
    {
      id: 'P3',
      title: 'P3 — Stateful Button',
      body: 'Zeigarnik Effect / Peak-End Rule — Map runs idle → loading → success on one control. No confirmation before Map.',
    },
    {
      id: 'P9',
      title: 'P9 — Filters',
      body: 'Hick’s Law / Choice Overload — genre + title search above the table; Search applies, Clear all resets.',
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
