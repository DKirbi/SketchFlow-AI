import type { Meta, StoryObj } from '@storybook/react';
import { LOFIStatefulButton, LOFIText } from 'lofi-kit';

const meta: Meta<typeof LOFIStatefulButton> = {
  title: 'UI / StatefulButton',
  component: LOFIStatefulButton,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A button whose label, variant, and interactivity change across three states: ' +
          '`idle` (clickable), `loading` (disabled, animated dots), and `success` ' +
          '(disabled, confirms completion). All three states are one logical control — ' +
          'the `state` prop switches them; there are no separate buttons.\n\n' +
          '**Patterns:**\n\n' +
          '- **P3 — Inline workspace async save.** ' +
          'Sequence: `idle` (primary, "Save changes", enabled when form is dirty) → ' +
          '`loading` (disabled + animated dots, "Saving…") → ' +
          '`success` (dismiss/ghost variant, "Saved", disabled). ' +
          'No P7 confirmation dialog is used before inline save — pair with **P4** toasts for outcomes.\n\n' +
          '- **P2.2 — Row toggle actions.** ' +
          'Compact variant for table action cells: Map → Mapped. ' +
          'Compose with a separate LOFIButton for the reverse action (Unmap / Undo).\n\n' +
          '**Contrast with P5/P7 modal saves:** saves triggered from a P5 modal footer ' +
          'still require a P7 confirmation dialog before the async operation begins.',
      },
    },
  },
  argTypes: {
    state:   { control: 'select', options: ['idle', 'loading', 'success'] },
    variant: { control: 'select', options: ['primary', 'default', 'dismiss'] },
    size:    { control: 'select', options: ['default', 'compact'] },
  },
};
export default meta;
type Story = StoryObj<typeof LOFIStatefulButton>;

export const Idle: Story = {
  args: { state: 'idle', idleLabel: 'Map', successLabel: 'Mapped' },
  parameters: { docs: { description: { story: 'P2.2 row toggle — initial state. `onClick` fires normally. Pair with a compact Unmap button for the reverse.' } } },
};

export const Loading: Story = {
  args: {
    state: 'loading',
    idleLabel: 'Map',
    successLabel: 'Mapped',
    loadingLabel: 'Working',
  },
  parameters: { docs: { description: { story: 'P2.2 row toggle — transition state. Disabled with animated dots. Fires after `onClick` while async work runs.' } } },
};

export const Success: Story = {
  args: { state: 'success', idleLabel: 'Map', successLabel: 'Mapped' },
  parameters: { docs: { description: { story: 'P2.2 row toggle — completed state. Disabled. Pair with a separate LOFIButton (Unmap / Undo) to return to idle.' } } },
};

export const CompactInTable: Story = {
  args: {
    state: 'idle',
    idleLabel: 'Map',
    successLabel: 'Mapped',
    size: 'compact',
  },
  parameters: { docs: { description: { story: 'P2.2 — compact size for table action cells.' } } },
};

export const SuccessCompact: Story = {
  args: {
    state: 'success',
    idleLabel: 'Map',
    successLabel: 'Mapped',
    size: 'compact',
  },
  parameters: { docs: { description: { story: 'P2.2 — compact success state. Rendered alongside an Unmap button in table rows.' } } },
};

/**
 * P3 — Inline workspace save: three static snapshots of the same logical button.
 * The `state` prop is the only thing that changes — no separate Save / Saving / Saved components exist.
 * "Save" (primary, idle) → "Save" with dots (disabled, loading) → "Saved" (dismiss/ghost, disabled).
 */
export const SaveFlowThreeStates: Story = {
  name: 'P3 Save flow — idle / loading / success snapshots',
  parameters: {
    docs: {
      description: {
        story:
          'P3 inline-workspace save rendered as three frozen snapshots. ' +
          'In a real implementation this is a single `<LOFIStatefulButton>` — ' +
          'its `state` prop drives the label, variant, and disabled behaviour. ' +
          'No confirmation dialog (P6) is required; the button is the complete save feedback mechanism.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <LOFIText variant="muted">
        Three snapshots of one button — the <code>state</code> prop is the only difference.
      </LOFIText>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* State 1: idle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 200 }}>
            <LOFIStatefulButton
              state="idle"
              variant="primary"
              idleLabel="Save"
              successLabel="Saved"
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <LOFIText variant="strong">state="idle"</LOFIText>
            <LOFIText variant="muted">
              Primary variant. Enabled only when the form is dirty. Clicking triggers the async save.
            </LOFIText>
          </div>
        </div>

        {/* State 2: loading */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 200 }}>
            <LOFIStatefulButton
              state="loading"
              variant="primary"
              idleLabel="Save"
              loadingLabel="Save"
              successLabel="Saved"
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <LOFIText variant="strong">state="loading"</LOFIText>
            <LOFIText variant="muted">
              Disabled. Shows the label prefix ("Save") with an animated dots indicator. Set while the async operation runs.
            </LOFIText>
          </div>
        </div>

        {/* State 3: success */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 200 }}>
            <LOFIStatefulButton
              state="success"
              variant="dismiss"
              idleLabel="Save"
              successLabel="Saved"
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <LOFIText variant="strong">state="success"</LOFIText>
            <LOFIText variant="muted">
              Dismiss/ghost variant. Disabled. Confirms the save completed. Returns to idle once the user makes a new change.
            </LOFIText>
          </div>
        </div>
      </div>

      <LOFIText variant="muted">
        Usage: pass <code>variant</code> together with <code>state</code> — primary for idle/loading, dismiss for success.
        The component does not manage variant automatically; the caller controls both.
      </LOFIText>
    </div>
  ),
};
