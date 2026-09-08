import { Markdown } from '@storybook/addon-docs/blocks';
import type { ModuleExports } from 'storybook/internal/types';
import { FlatMarkdownWithStoryEmbeds } from './patternDocEmbeds';
import React from 'react';

const STORY2_HEADING = /^### Story 2:/m;
const INTRO_HEADING = /^# UX Flows$/m;

/**
 * Renders `UX_PATTERN_STORIES.md` in two passes so each Story canvas appears directly above
 * that story’s prose (see `renderMarkdownWithStoryEmbeds`: canvas first, then markdown before the embed).
 */
export function PatternStoriesDoc({
  markdown,
  storiesModule,
}: {
  markdown: string;
  storiesModule: ModuleExports;
}) {
  const story2Start = markdown.search(STORY2_HEADING);
  if (story2Start === -1) {
    return <FlatMarkdownWithStoryEmbeds markdown={markdown} storiesModule={storiesModule} />;
  }

  const block1 = markdown.slice(0, story2Start).trimEnd();
  const fromStory2 = markdown.slice(story2Start);
  const introStart = fromStory2.search(INTRO_HEADING);
  const block2 =
    introStart === -1 ? fromStory2.trimEnd() : fromStory2.slice(0, introStart).trimEnd();
  const introMarkdown = introStart === -1 ? '' : fromStory2.slice(introStart).trimStart();

  return (
    <>
      <FlatMarkdownWithStoryEmbeds markdown={block1} storiesModule={storiesModule} />
      <FlatMarkdownWithStoryEmbeds markdown={block2} storiesModule={storiesModule} />
      {introMarkdown ? <Markdown>{introMarkdown}</Markdown> : null}
    </>
  );
}
