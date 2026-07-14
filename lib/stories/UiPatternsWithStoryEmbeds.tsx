import { Markdown } from '@storybook/addon-docs/blocks';
import React from 'react';
import type { ModuleExports } from 'storybook/internal/types';
import {
  FlatMarkdownWithStoryEmbeds,
  PatternAccordion,
  renderMarkdownWithEmbeds,
  splitMarkdownByH3,
} from './patternDocEmbeds';

const MISSING_HINT = 'UIPatterns.stories.tsx';
const H2_UI_PATTERNS = /^## UI Patterns$/m;
/** Start of "Gap analysis" (and everything after it stays flat-embedded). */
const H2_GAP_ANALYSIS = /^## Gap analysis/m;

/**
 * Renders `docs/UI_PATTERNS.md` with the same embed + accordion rules as `UxPatternsWithStoryEmbeds`,
 * but for **`## UI Patterns`** through (exclusive) **`## Gap analysis`**, then flat markdown for the rest.
 */
export function UiPatternsWithStoryEmbeds({
  markdown,
  storiesModule,
}: {
  markdown: string;
  storiesModule: ModuleExports;
}) {
  const patternsStart = markdown.search(H2_UI_PATTERNS);
  const gapStart = markdown.search(H2_GAP_ANALYSIS);

  if (patternsStart === -1) {
    return (
      <>
        {renderMarkdownWithEmbeds(markdown, storiesModule, 'all-ui', MISSING_HINT)}
      </>
    );
  }

  const patternsLineEnd = markdown.indexOf('\n', patternsStart) + 1;
  const pre = markdown.slice(0, patternsLineEnd);

  if (gapStart === -1 || gapStart <= patternsLineEnd) {
    return (
      <>
        {renderMarkdownWithEmbeds(markdown, storiesModule, 'all-ui-flat', MISSING_HINT)}
      </>
    );
  }

  const patternsBody = markdown.slice(patternsLineEnd, gapStart);
  const post = markdown.slice(gapStart);

  const { intro: patternsIntro, sections: patternSections } = splitMarkdownByH3(patternsBody);

  return (
    <>
      {renderMarkdownWithEmbeds(pre, storiesModule, 'ui-pre', MISSING_HINT)}
      {patternsIntro.trim() ? <Markdown>{patternsIntro}</Markdown> : null}
      <div className="pattern-accordion-list">
        {patternSections.map(({ header, body }, idx) => (
          <PatternAccordion
            key={header}
            header={header}
            body={body}
            storiesModule={storiesModule}
            idx={idx}
            missingStoriesFileHint={MISSING_HINT}
          />
        ))}
      </div>
      <FlatMarkdownWithStoryEmbeds
        markdown={post}
        storiesModule={storiesModule}
        missingStoriesFileHint={MISSING_HINT}
      />
    </>
  );
}
