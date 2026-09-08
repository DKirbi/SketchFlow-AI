import { Markdown } from '@storybook/addon-docs/blocks';
import React from 'react';
import type { ModuleExports } from 'storybook/internal/types';
import {
  PatternSectionPage,
  renderMarkdownWithEmbeds,
  splitMarkdownByH3,
  splitMarkdownByH4,
} from './patternDocEmbeds';

const H2_PATTERNS = /^## Patterns$/m;
const H2_HOW_TO_USE = /^## How to use this file$/m;

function patternsBody(markdown: string): string {
  const patternsStart = markdown.search(H2_PATTERNS);
  if (patternsStart === -1) return markdown;
  const patternsLineEnd = markdown.indexOf('\n', patternsStart) + 1;
  const howToUseStart = markdown.search(H2_HOW_TO_USE);
  if (howToUseStart === -1 || howToUseStart <= patternsLineEnd) {
    return markdown.slice(patternsLineEnd);
  }
  return markdown.slice(patternsLineEnd, howToUseStart);
}

/** Intro + Laws of UX only — nothing after `## Patterns`. */
export function UxPatternsIndex({ markdown }: { markdown: string }) {
  const patternsStart = markdown.search(H2_PATTERNS);
  const intro = patternsStart === -1 ? markdown : markdown.slice(0, patternsStart).trimEnd();
  return <Markdown>{intro}</Markdown>;
}

/** One P1–P10 heading block, rendered flat (#### stay as sub-accordions). */
export function UxPatternSection({
  markdown,
  storiesModule,
  patternId,
}: {
  markdown: string;
  storiesModule: ModuleExports;
  patternId: string;
}) {
  const { sections } = splitMarkdownByH3(patternsBody(markdown));
  const prefix = `${patternId}:`;
  const section = sections.find((entry) => entry.header.startsWith(prefix));

  if (!section) {
    return (
      <Markdown>{`> **Storybook:** missing \`${prefix}\` section in \`UX_PATTERNS.md\`.`}</Markdown>
    );
  }

  return (
    <PatternSectionPage
      header={section.header}
      body={section.body}
      storiesModule={storiesModule}
      idx={0}
    />
  );
}

/** One #### accordion block from a P1–P10 section, rendered flat. */
export function UxPatternSubsection({
  markdown,
  storiesModule,
  patternId,
  subsection,
}: {
  markdown: string;
  storiesModule: ModuleExports;
  patternId: string;
  subsection: string;
}) {
  const { sections } = splitMarkdownByH3(patternsBody(markdown));
  const prefix = `${patternId}:`;
  const section = sections.find((entry) => entry.header.startsWith(prefix));

  if (!section) {
    return (
      <Markdown>{`> **Storybook:** missing \`${prefix}\` section in \`UX_PATTERNS.md\`.`}</Markdown>
    );
  }

  const { sections: subsections } = splitMarkdownByH4(section.body);
  const block = subsections.find((entry) => entry.header === subsection);

  if (!block) {
    return (
      <Markdown>{`> **Storybook:** missing \`${subsection}\` in \`${prefix}\`.`}</Markdown>
    );
  }

  return (
    <PatternSectionPage
      header={block.header}
      body={block.body}
      storiesModule={storiesModule}
      idx={0}
      headingLevel={4}
    />
  );
}

/** @deprecated Full stacked page — UI Patterns still uses the sibling accordion helper. */
export function UxPatternsWithStoryEmbeds({
  markdown,
  storiesModule,
}: {
  markdown: string;
  storiesModule: ModuleExports;
}) {
  return <>{renderMarkdownWithEmbeds(markdown, storiesModule, 'all')}</>;
}
