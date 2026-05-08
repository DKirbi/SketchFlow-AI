import { Markdown } from '@storybook/addon-docs/blocks';
import React from 'react';
import type { ModuleExports } from 'storybook/internal/types';
import {
  PatternAccordion,
  renderMarkdownWithEmbeds,
  splitMarkdownByH3,
} from './patternDocEmbeds';

const H2_PATTERNS = /^## Patterns$/m;
const H2_HOW_TO_USE = /^## How to use this file$/m;
const H2_INTERACTION = /^## Interaction rules$/m;
const H2_UX_FLOWS = /^## UX Flows$/m;

/**
 * Renders `docs/UX_PATTERNS.md` with:
 *
 * 1. `<!-- storybook:embed ExportName -->` markers replaced by live Story embeds (each **example above** the prose that preceded the marker in `UX_PATTERNS.md`).
 * 2. Every `### ` under **Patterns** (P1–P10) in a collapsible accordion; `#### ` nested.
 * 3. **How to use** + **Lo-fidelity UX testing** as flat Markdown between Patterns and Interaction rules.
 * 4. Every `### ` under **Interaction rules** (R1–R7) in a second accordion block.
 * 5. **UX Flows** onward as flat Markdown.
 */
export function UxPatternsWithStoryEmbeds({
  markdown,
  storiesModule,
}: {
  markdown: string;
  storiesModule: ModuleExports;
}) {
  const patternsStart = markdown.search(H2_PATTERNS);
  const howToUseStart = markdown.search(H2_HOW_TO_USE);
  const interactionStart = markdown.search(H2_INTERACTION);
  const uxFlowsStart = markdown.search(H2_UX_FLOWS);

  if (patternsStart === -1) {
    return <>{renderMarkdownWithEmbeds(markdown, storiesModule, 'all')}</>;
  }

  const patternsLineEnd = markdown.indexOf('\n', patternsStart) + 1;
  const pre = markdown.slice(0, patternsLineEnd);

  // Patterns zone: after "## Patterns" through (exclusive) "## How to use this file"
  if (howToUseStart === -1 || howToUseStart <= patternsLineEnd) {
    return <>{renderMarkdownWithEmbeds(markdown, storiesModule, 'all')}</>;
  }

  const patternsBody = markdown.slice(patternsLineEnd, howToUseStart);
  const { intro: patternsIntro, sections: patternSections } = splitMarkdownByH3(patternsBody);

  const mid =
    interactionStart !== -1 && interactionStart > howToUseStart
      ? markdown.slice(howToUseStart, interactionStart)
      : '';

  const postUxFlows = uxFlowsStart !== -1 ? markdown.slice(uxFlowsStart) : '';

  const interactionInner =
    interactionStart !== -1 && uxFlowsStart !== -1 && uxFlowsStart > interactionStart
      ? markdown.slice(markdown.indexOf('\n', interactionStart) + 1, uxFlowsStart)
      : interactionStart !== -1 && uxFlowsStart === -1
        ? markdown.slice(markdown.indexOf('\n', interactionStart) + 1)
        : '';

  const { intro: interactionIntro, sections: interactionSections } =
    interactionInner.length > 0 ? splitMarkdownByH3(interactionInner) : { intro: '', sections: [] };

  return (
    <>
      {renderMarkdownWithEmbeds(pre, storiesModule, 'pre')}
      {patternsIntro.trim() ? <Markdown>{patternsIntro}</Markdown> : null}
      <div className="pattern-accordion-list">
        {patternSections.map(({ header, body }, idx) => (
          <PatternAccordion
            key={header}
            header={header}
            body={body}
            storiesModule={storiesModule}
            idx={idx}
          />
        ))}
      </div>
      {mid ? renderMarkdownWithEmbeds(mid, storiesModule, 'mid') : null}
      {interactionIntro.trim() ? <Markdown>{interactionIntro}</Markdown> : null}
      {interactionSections.length > 0 ? (
        <div className="pattern-accordion-list">
          {interactionSections.map(({ header, body }, idx) => (
            <PatternAccordion
              key={`ir-${header}`}
              header={header}
              body={body}
              storiesModule={storiesModule}
              idx={idx + 100}
            />
          ))}
        </div>
      ) : null}
      {interactionStart !== -1 && uxFlowsStart === -1
        ? renderMarkdownWithEmbeds(
            markdown.slice(interactionStart),
            storiesModule,
            'post-no-stories',
          )
        : postUxFlows
          ? renderMarkdownWithEmbeds(postUxFlows, storiesModule, 'post')
          : null}
    </>
  );
}
