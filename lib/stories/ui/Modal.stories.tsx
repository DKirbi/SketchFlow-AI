import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { LOFIButton, LOFIField, LOFIInput, LOFIModal, LOFISelect } from 'lofi-kit';
import { fixedLayerCanvasDecorator } from '../decorators/fixedLayerCanvas';

const meta: Meta<typeof LOFIModal> = {
  title: 'UI / Modal',
  component: LOFIModal,
  tags: ['autodocs'],
  decorators: [fixedLayerCanvasDecorator(540)],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'An overlay dialog that pauses the current flow to focus on a discrete task. Always has a title, close action, and an optional footer with buttons.',
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof LOFIModal>;

function ModalPlaygroundDemo() {
  const [name, setName] = useState('');
  return (
    <LOFIModal
      open
      onClose={() => {}}
      title="Dialog title"
      description="Supporting line — one or two sentences of neutral copy for layout."
      size="default"
      footer={
        <>
          <LOFIButton variant="primary" type="button">Primary action</LOFIButton>
          <LOFIButton variant="dismiss" type="button">Dismiss</LOFIButton>
        </>
      }
    >
      <LOFIField label="Text field" htmlFor="modal-play-input" required>
        <LOFIInput id="modal-play-input" value={name} placeholder="Placeholder…" onChange={setName} />
      </LOFIField>
    </LOFIModal>
  );
}

export const Playground: Story = {
  render: () => <ModalPlaygroundDemo />,
};

function ModalDefaultDemo() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  return (
    <>
      <LOFIButton onClick={() => setOpen(true)}>Open dialog</LOFIButton>
      <LOFIModal
        open={open}
        onClose={() => setOpen(false)}
        title="Dialog title"
        description="Short supporting description for this pattern."
        footer={
          <>
            <LOFIButton variant="primary" type="submit">Primary action</LOFIButton>
            <LOFIButton variant="dismiss" onClick={() => setOpen(false)}>Dismiss</LOFIButton>
          </>
        }
      >
        <LOFIField label="Text field" htmlFor="modal-default-input" required>
          <LOFIInput id="modal-default-input" value={value} placeholder="Type here…" onChange={setValue} />
        </LOFIField>
      </LOFIModal>
    </>
  );
}

export const Default: Story = {
  render: () => <ModalDefaultDemo />,
  parameters: { docs: { description: { story: 'Create or edit flow that stays in context without navigating away.' } } },
};

function ModalWideDemo() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('Editable title');
  const [variant, setVariant] = useState('one');
  return (
    <>
      <LOFIButton onClick={() => setOpen(true)}>Open wide dialog</LOFIButton>
      <LOFIModal
        open={open}
        onClose={() => setOpen(false)}
        title="Wide layout"
        size="wide"
        footer={
          <>
            <LOFIButton variant="primary">Save</LOFIButton>
            <LOFIButton variant="dismiss" onClick={() => setOpen(false)}>Dismiss</LOFIButton>
          </>
        }
      >
        <LOFIField label="Line one"><LOFIInput value={title} onChange={setTitle} /></LOFIField>
        <LOFIField label="Line two">
          <LOFISelect
            value={variant}
            onChange={setVariant}
            options={[
              { value: 'one', label: 'Variant · one' },
              { value: 'two', label: 'Variant · two' },
            ]}
          />
        </LOFIField>
      </LOFIModal>
    </>
  );
}

export const Wide: Story = {
  render: () => <ModalWideDemo />,
  parameters: { docs: { description: { story: 'Wider variant for more fields or grouped content.' } } },
};

function ModalConfirmationDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <LOFIButton onClick={() => setOpen(true)}>Open confirm</LOFIButton>
      <LOFIModal
        open={open}
        onClose={() => setOpen(false)}
        title="Remove item?"
        description="This action is shown for layout only — copy is neutral."
        footer={
          <>
            <LOFIButton variant="primary" onClick={() => setOpen(false)}>Confirm</LOFIButton>
            <LOFIButton variant="dismiss" onClick={() => setOpen(false)}>Dismiss</LOFIButton>
          </>
        }
      >
        <p style={{ fontSize: 13, color: '#333' }}>
          Extra detail paragraph: <strong>Label A</strong> → <strong>Label B</strong> for visual rhythm.
        </p>
      </LOFIModal>
    </>
  );
}

export const Confirmation: Story = {
  render: () => <ModalConfirmationDemo />,
  parameters: { docs: { description: { story: 'Destructive or high-friction flows — confirm before committing.' } } },
};
