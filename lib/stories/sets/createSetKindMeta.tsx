import type { Meta, StoryObj } from '@storybook/react';
import { Description, Primary, Stories, Title } from '@storybook/addon-docs/blocks';
import { COMPONENT_SET_KIND_NAV, exampleById, type ComponentSet } from 'lofi-kit';
import { fixedLayerCanvasDecorator } from '../decorators/fixedLayerCanvas';
import { SetExampleFrame } from './SetExampleFrame';
import { isFramedSetKind, setKindMarkdown, setKindUsageSource } from './setKindDocs';

const OVERLAY_HEIGHT: Partial<Record<ComponentSet['kind'], number>> = {
  'p7-confirm': 420,
  'modal-editor': 560,
};

export function SetKindDocsPage() {
  return (
    <>
      <Title />
      <Description />
      <Primary />
      <Stories />
    </>
  );
}

/**
 * Storybook's CSF indexer only accepts `export default` of an object literal
 * (or a variable initialized to one). Do not `export default createSetKindMeta(...)`.
 * Spread into a meta object that also has a string-literal `title`.
 */
export function createSetKindMeta(kind: ComponentSet['kind']): Meta {
  const nav = COMPONENT_SET_KIND_NAV.find((item) => item.kind === kind)?.nav;
  if (!nav) throw new Error(`Unknown set kind: ${kind}`);
  const overlay = OVERLAY_HEIGHT[kind];
  return {
    title: `LOW FI Design system/Component sets/${nav}`,
    tags: ['autodocs'],
    parameters: {
      layout: 'fullscreen',
      controls: { disable: true },
      docs: {
        description: { component: setKindMarkdown(kind) },
        page: SetKindDocsPage,
        canvas: { sourceState: 'shown' },
      },
    },
    ...(overlay ? { decorators: [fixedLayerCanvasDecorator(overlay)] } : {}),
  };
}

export function setExampleStory(id: string): StoryObj {
  const example = exampleById(id);
  if (!example) throw new Error(`Unknown example: ${id}`);
  return {
    name: example.title,
    render: () => <SetExampleFrame id={id} framed={isFramedSetKind(example.set.kind)} />,
    parameters: {
      docs: {
        description: {
          story: `Extracted from \`${example.source}\`. UX: ${example.ux.join(', ')}. UI: ${example.ui.join(', ')}.`,
        },
        source: {
          code: setKindUsageSource(id),
          language: 'tsx',
        },
      },
    },
  };
}
