/* eslint-disable react-refresh/only-export-components -- helpers + accordions shared across pattern doc pages */
/**
 * Shared Storybook-docs helpers: markdown splits on `storybook:embed` markers +
 * accordion blocks for numbered pattern sections.
 */
import * as Collapsible from '@radix-ui/react-collapsible';
import { Markdown, Story } from '@storybook/addon-docs/blocks';
import React, { useState } from 'react';
import type { ModuleExport, ModuleExports } from 'storybook/internal/types';
import './UxPatternsWithStoryEmbeds.scss';

const EMBED_SPLIT_RE = /<!--\s*storybook:embed\s+(\w+)\s*-->/;

/**
 * For each marker, live Story renders first, then the markdown that preceded the marker.
 */
export function renderMarkdownWithEmbeds(
  content: string,
  storiesModule: ModuleExports,
  keyPrefix: string,
  missingStoriesFileHint = 'UXFlows.stories.tsx',
): React.ReactNode[] {
  const parts = content.split(EMBED_SPLIT_RE);
  const nodes: React.ReactNode[] = [];
  let nk = 0;

  for (let i = 0; i + 1 < parts.length; i += 2) {
    const textBefore = parts[i] ?? '';
    const exportName = parts[i + 1] as string;
    const storyExport = storiesModule[exportName] as ModuleExport | undefined;
    const storyKey = `${keyPrefix}-${nk++}`;

    if (!storyExport || exportName === 'default') {
      nodes.push(
        <Markdown key={storyKey}>
          {`\n\n> **Storybook:** missing story export \`${exportName}\`. Add it in \`${missingStoriesFileHint}\`.\n\n`}
        </Markdown>,
      );
    } else {
      nodes.push(<Story key={storyKey} of={storyExport} />);
    }

    if (textBefore) {
      nodes.push(<Markdown key={`${keyPrefix}-${nk++}`}>{textBefore}</Markdown>);
    }
  }

  if (parts.length % 2 === 1) {
    const trailing = parts[parts.length - 1] ?? '';
    if (trailing) {
      nodes.push(<Markdown key={`${keyPrefix}-${nk++}`}>{trailing}</Markdown>);
    }
  }

  return nodes;
}

export function FlatMarkdownWithStoryEmbeds({
  markdown,
  storiesModule,
  missingStoriesFileHint,
}: {
  markdown: string;
  storiesModule: ModuleExports;
  missingStoriesFileHint?: string;
}): React.ReactNode {
  return (
    <>{renderMarkdownWithEmbeds(markdown, storiesModule, 'flat', missingStoriesFileHint)}</>
  );
}

const H4_SPLIT_RE = /^(#### .+)$/m;

/** Collapsible subsection (e.g. P1.x or UI §1.1). */
export function PatternSubAccordion({
  header,
  body,
  storiesModule,
  keyPrefix,
  missingStoriesFileHint,
}: {
  header: string;
  body: string;
  storiesModule: ModuleExports;
  keyPrefix: string;
  missingStoriesFileHint?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Collapsible.Root open={open} onOpenChange={setOpen} className="pattern-sub-accordion">
      <Collapsible.Trigger className="pattern-sub-accordion__trigger">
        <span className="pattern-sub-accordion__label">{header}</span>
        <span className="pattern-sub-accordion__chevron" aria-hidden>
          ▼
        </span>
      </Collapsible.Trigger>
      <Collapsible.Content className="pattern-sub-accordion__content">
        {renderMarkdownWithEmbeds(body, storiesModule, keyPrefix, missingStoriesFileHint)}
      </Collapsible.Content>
    </Collapsible.Root>
  );
}

/** Top-level accordion (e.g. P1–P10 or UI §1–§5). */
export function PatternAccordion({
  header,
  body,
  storiesModule,
  idx,
  missingStoriesFileHint,
}: {
  header: string;
  body: string;
  storiesModule: ModuleExports;
  idx: number;
  missingStoriesFileHint?: string;
}) {
  const [open, setOpen] = useState(false);

  const h4Parts = body.split(H4_SPLIT_RE);
  const hasSubsections = h4Parts.length > 1;
  const introBeforeH4 = hasSubsections ? (h4Parts[0] ?? '') : '';
  const subsections: Array<{ subHeader: string; subBody: string }> = [];
  if (hasSubsections) {
    for (let i = 1; i < h4Parts.length; i += 2) {
      subsections.push({
        subHeader: (h4Parts[i] ?? '').replace(/^#### /, ''),
        subBody: h4Parts[i + 1] ?? '',
      });
    }
  }

  const bodyContent =
    hasSubsections && subsections.length > 0 ? (
      <>
        {introBeforeH4.trim() ? (
          <div className="pattern-accordion__intro">
            {renderMarkdownWithEmbeds(
              introBeforeH4,
              storiesModule,
              `p-${idx}-intro`,
              missingStoriesFileHint,
            )}
          </div>
        ) : null}
        <div className="pattern-sub-accordion-list">
          {subsections.map(({ subHeader, subBody }, subIdx) => (
            <PatternSubAccordion
              key={`${header}-${subHeader}`}
              header={subHeader}
              body={subBody}
              storiesModule={storiesModule}
              keyPrefix={`p-${idx}-sub-${subIdx}`}
              missingStoriesFileHint={missingStoriesFileHint}
            />
          ))}
        </div>
      </>
    ) : (
      renderMarkdownWithEmbeds(body, storiesModule, `p-${idx}`, missingStoriesFileHint)
    );

  return (
    <Collapsible.Root open={open} onOpenChange={setOpen} className="pattern-accordion">
      <Collapsible.Trigger className="pattern-accordion__trigger">
        <span className="pattern-accordion__label">{header}</span>
        <span className="pattern-accordion__chevron" aria-hidden>
          ▼
        </span>
      </Collapsible.Trigger>
      <Collapsible.Content className="pattern-accordion__content">{bodyContent}</Collapsible.Content>
    </Collapsible.Root>
  );
}

export function splitMarkdownByH3(body: string): {
  intro: string;
  sections: Array<{ header: string; body: string }>;
} {
  const H3_SPLIT_RE = /^(### .+)$/m;
  const parts = body.split(H3_SPLIT_RE);
  const intro = parts[0] ?? '';
  const sections: Array<{ header: string; body: string }> = [];
  for (let i = 1; i < parts.length; i += 2) {
    sections.push({
      header: (parts[i] ?? '').replace(/^### /, ''),
      body: parts[i + 1] ?? '',
    });
  }
  return { intro, sections };
}
