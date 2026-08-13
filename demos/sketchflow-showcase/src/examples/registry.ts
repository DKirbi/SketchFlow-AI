import type { ComponentType } from 'react';
import type { ShowcaseExampleConfig } from '../runtime/types';
import type { ShowcaseExampleProps } from './mapping/metadata';
import { mappingExampleConfig } from './mapping/metadata';
import { MappingExample } from './mapping/MappingExample';

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
