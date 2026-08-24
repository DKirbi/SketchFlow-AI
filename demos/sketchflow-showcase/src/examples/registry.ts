import type { ComponentType } from 'react';
import type { ShowcaseExampleConfig } from '../runtime/types';
import type { ShowcaseExampleProps } from './mapping/metadata';
import { mappingExampleConfig } from './mapping/metadata';
import { MappingExample } from './mapping/MappingExample';
import { mergeToolExampleConfig } from './merge-tool/metadata';
import { MergeToolExample } from './merge-tool/MergeToolExample';

export type { ShowcaseExampleConfig, ShowcaseExampleProps };

export interface RegisteredExample {
  config: ShowcaseExampleConfig;
  Component: ComponentType<ShowcaseExampleProps>;
}

const EXAMPLES: RegisteredExample[] = [
  {
    config: mappingExampleConfig,
    Component: MappingExample,
  },
  {
    config: mergeToolExampleConfig,
    Component: MergeToolExample,
  },
];

export function getExampleBySlug(slug: string): RegisteredExample | undefined {
  return EXAMPLES.find((entry) => entry.config.slug === slug);
}

export function getDefaultExample(): RegisteredExample {
  return EXAMPLES[0]!;
}

export function listExamples(): ShowcaseExampleConfig[] {
  return EXAMPLES.map((entry) => entry.config);
}
