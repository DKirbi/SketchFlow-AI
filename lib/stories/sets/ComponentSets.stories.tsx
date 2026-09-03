import type { Meta, StoryObj } from '@storybook/react';
import { LOFIBadge, LOFIComponentSet, LOFIText, COMPONENT_SET_EXAMPLES } from 'lofi-kit';
import { fixedLayerCanvasDecorator } from '../decorators/fixedLayerCanvas';

const meta: Meta = {
  title: 'Sets / Component sets',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Config-driven compositions extracted from demos. Each example is a JSON-serialisable set: action roles map to LOFI variants and to UI Pattern color/rank. Bind `id` values to handlers at render time.',
      },
    },
  },
};
export default meta;
type Story = StoryObj;

function ExampleFrame({
  id,
  framed,
}: {
  id: string;
  framed?: boolean;
}) {
  const example = COMPONENT_SET_EXAMPLES.find((item) => item.id === id);
  if (!example) {
    return <LOFIText variant="muted">Unknown example: {id}</LOFIText>;
  }
  const isOverlay = example.set.kind === 'modal-editor' || example.set.kind === 'p7-confirm';
  return (
    <div className={framed ? 'set-gallery set-gallery--padded' : 'set-gallery'}>
      <div className="set-gallery__meta">
        <LOFIText as="h2" variant="body">
          {example.title}
        </LOFIText>
        <LOFIText variant="micro">{example.source}</LOFIText>
        <div className="set-gallery__tags">
          {example.ux.map((tag) => (
            <LOFIBadge key={tag} variant="id" label={tag} />
          ))}
          {example.ui.map((tag) => (
            <LOFIBadge key={tag} variant="tag" label={tag} />
          ))}
        </div>
      </div>
      <div className={isOverlay ? undefined : 'set-gallery__view'}>
        <LOFIComponentSet set={example.set} />
      </div>
    </div>
  );
}

export const Catalog: Story = {
  render: () => (
    <div className="set-gallery set-gallery--catalog">
      {COMPONENT_SET_EXAMPLES.filter(
        (example) => example.set.kind !== 'modal-editor' && example.set.kind !== 'p7-confirm',
      ).map((example) => (
        <ExampleFrame key={example.id} id={example.id} framed />
      ))}
    </div>
  ),
};

export const P7Save: Story = {
  decorators: [fixedLayerCanvasDecorator(420)],
  render: () => <ExampleFrame id="p7-save" />,
};

export const P7Discard: Story = {
  decorators: [fixedLayerCanvasDecorator(420)],
  render: () => <ExampleFrame id="p7-discard" />,
};

export const ModalCreate: Story = {
  decorators: [fixedLayerCanvasDecorator(560)],
  render: () => <ExampleFrame id="modal-create-tournament" />,
};

export const ModalTeam: Story = {
  decorators: [fixedLayerCanvasDecorator(560)],
  render: () => <ExampleFrame id="modal-team" />,
};

export const ModalMergeReview: Story = {
  decorators: [fixedLayerCanvasDecorator(560)],
  render: () => <ExampleFrame id="modal-merge-review" />,
};

export const UplShell: Story = {
  render: () => <ExampleFrame id="upl-shell-tournament" />,
};

export const ToolShell: Story = {
  render: () => <ExampleFrame id="tool-shell-mapping" />,
};

export const FilterCommit: Story = {
  render: () => <ExampleFrame id="filter-commit" framed />,
};

export const SummaryCard: Story = {
  render: () => <ExampleFrame id="summary-card" framed />,
};
