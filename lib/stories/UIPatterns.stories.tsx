/**
 * Podium (high-fidelity) UI Pattern demos — embedded in `docs/UI_PATTERNS.md` via
 * `<!-- storybook:embed ExportName -->`.
 */
import {
  PodiumProvider,
  PdsFilterChip,
  PdsLoader,
  PdsMantineBadge,
  PdsMantineButton,
  PdsMantineText,
  PdsModal,
  PdsModalBody,
  PdsModalFooter,
  PdsModalHeader,
  PdsTab,
  PdsTabGroup,
  PdsTable,
  PdsTBody,
  PdsTBodyCell,
  PdsTBodyRow,
  PdsTextField,
  PdsTHead,
  PdsTHeadCell,
  PdsTHeadRow,
} from '@podium-design-system/react-components';
import '@podium-design-system/react-components/pds-mantine-styles.css';
import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';

const flexCol = (gap: number, extra?: React.CSSProperties) =>
  ({
    display: 'flex',
    flexDirection: 'column' as const,
    gap,
    ...extra,
  }) satisfies React.CSSProperties;

const flexRow = (
  gap: number,
  opts?: {
    wrap?: boolean;
    alignItems?: React.CSSProperties['alignItems'];
    justifyContent?: React.CSSProperties['justifyContent'];
  },
) =>
  ({
    display: 'flex',
    flexDirection: 'row' as const,
    gap,
    flexWrap: opts?.wrap === false ? ('nowrap' as const) : ('wrap' as const),
    alignItems: opts?.alignItems,
    justifyContent: opts?.justifyContent,
  }) satisfies React.CSSProperties;

const storyStage = (children: React.ReactNode) => (
  <div style={{ maxWidth: 960, width: '100%' }}>{children}</div>
);

function UI_ButtonHierarchyDoDontDemo() {
  const strip = (children: React.ReactNode) => (
    <div
      style={{
        padding: 12,
        borderRadius: 4,
        border: '1px solid rgba(0,0,0,0.12)',
        background: 'rgba(0,0,0,0.04)',
      }}
    >
      <div style={flexRow(8, { alignItems: 'center', wrap: false })}>{children}</div>
    </div>
  );

  const cap = (kind: 'do' | 'dont', text: string) => (
    <PdsMantineText type="interface" fontSize="500" fontWeight="strong">
      {kind === 'do' ? 'Do — ' : "Don't — "}
      {text}
    </PdsMantineText>
  );

  return (
    <div style={flexCol(20)}>
      <PdsMantineText type="interface" fontSize="600" fontWeight="strong">
        §1.7 — button hierarchy (abbreviated visuals; full pairs in doc)
      </PdsMantineText>

      {cap('do', 'Monotonic ladder: ghost → subtle → fill (same semantic colour).')}
      {strip(
        <>
          <PdsMantineButton rank="ghost" color="action" surface="on-light">
            Tertiary
          </PdsMantineButton>
          <PdsMantineButton rank="subtle" color="action" surface="on-light">
            Secondary
          </PdsMantineButton>
          <PdsMantineButton rank="fill" color="action" surface="on-light">
            Primary
          </PdsMantineButton>
        </>,
      )}

      {cap('dont', 'Outline as strongest beside subtle — subtle can read heavier than outline.')}
      {strip(
        <>
          <PdsMantineButton rank="ghost" color="action" surface="on-light">
            Back
          </PdsMantineButton>
          <PdsMantineButton rank="subtle" color="neutral" surface="on-light">
            Secondary
          </PdsMantineButton>
          <PdsMantineButton rank="outline" color="action" surface="on-light">
            “Primary” outline
          </PdsMantineButton>
        </>,
      )}

      {cap('do', 'One semantic family per strip (all neutral here).')}
      {strip(
        <>
          <PdsMantineButton rank="ghost" color="neutral" surface="on-light">
            ⚙
          </PdsMantineButton>
          <PdsMantineButton rank="ghost" color="neutral" surface="on-light">
            Edit
          </PdsMantineButton>
          <PdsMantineButton rank="subtle" color="neutral" surface="on-light">
            + Add
          </PdsMantineButton>
        </>,
      )}

      {cap('dont', 'Mixed neutral utilities + action fill in one cluster.')}
      {strip(
        <>
          <PdsMantineButton rank="ghost" color="neutral" surface="on-light">
            Edit
          </PdsMantineButton>
          <PdsMantineButton rank="outline" color="neutral" surface="on-light">
            Filter
          </PdsMantineButton>
          <PdsMantineButton rank="fill" color="action" surface="on-light">
            Save
          </PdsMantineButton>
        </>,
      )}

      {cap('dont', 'Wavy ranks: outline → subtle → outline.')}
      {strip(
        <>
          <PdsMantineButton rank="outline" color="action" surface="on-light">
            A
          </PdsMantineButton>
          <PdsMantineButton rank="subtle" color="action" surface="on-light">
            B
          </PdsMantineButton>
          <PdsMantineButton rank="outline" color="action" surface="on-light">
            C
          </PdsMantineButton>
        </>,
      )}

      {cap('dont', 'Two fills adjacent.')}
      {strip(
        <>
          <PdsMantineButton rank="fill" color="action" surface="on-light">
            Edit
          </PdsMantineButton>
          <PdsMantineButton rank="fill" color="action" surface="on-light">
            Publish
          </PdsMantineButton>
        </>,
      )}

      {cap('do', 'Equal-importance ghosts (optional leading glyph in label).')}
      {strip(
        <>
          <PdsMantineButton rank="ghost" color="neutral" surface="on-light">
            ⏷ Filter
          </PdsMantineButton>
          <PdsMantineButton rank="ghost" color="neutral" surface="on-light">
            ⎙ Print
          </PdsMantineButton>
          <PdsMantineButton rank="ghost" color="neutral" surface="on-light">
            ⬇ Download
          </PdsMantineButton>
        </>,
      )}
    </div>
  );
}

function UI_ButtonColorRankDemo() {
  return (
    <div style={flexCol(16)}>
      <PdsMantineText type="interface" fontSize="600" fontWeight="strong">
        §1.1–1.3, 1.6 — one fill per cluster; ranks + sizes
      </PdsMantineText>
      <div style={flexRow(8)}>
        <PdsMantineButton rank="outline" color="neutral" surface="on-light">
          Secondary outline
        </PdsMantineButton>
        <PdsMantineButton rank="fill" color="action" surface="on-light">
          Primary commit
        </PdsMantineButton>
        <PdsMantineButton rank="subtle" color="neutral" surface="on-light">
          Cancel subtle
        </PdsMantineButton>
        <PdsMantineButton rank="ghost" color="neutral" surface="on-light">
          Back ghost
        </PdsMantineButton>
      </div>
      <div style={flexRow(8)}>
        <PdsMantineButton rank="outline" color="neutral" surface="on-light">
          Hide reversible
        </PdsMantineButton>
        <PdsMantineButton rank="outline" color="warning" surface="on-light">
          Remove outline
        </PdsMantineButton>
        <PdsMantineButton rank="ghost" color="warning" surface="on-light">
          Delete ghost
        </PdsMantineButton>
      </div>
    </div>
  );
}

function UI_BrandAndFeedbackBadgesDemo() {
  return (
    <div style={flexCol(16)}>
      <PdsMantineText type="body" fontSize="700">
        §1.4–1.5 — semantic badge / counter treatment (colour + label, not decoration).
      </PdsMantineText>
      <div style={flexRow(8, { alignItems: 'center' })}>
        <PdsMantineBadge color="success" surface="on-light">
          Saved
        </PdsMantineBadge>
        <PdsMantineBadge color="neutral" surface="on-light">
          Draft
        </PdsMantineBadge>
        <PdsMantineBadge color="neutral" surface="on-light" value={12}>
          Count neutral
        </PdsMantineBadge>
        <PdsMantineBadge color="attention" surface="on-light">
          Soft follow-up
        </PdsMantineBadge>
        <PdsMantineBadge color="warning" surface="on-light">
          Hard block
        </PdsMantineBadge>
      </div>
    </div>
  );
}

function UI_TypographyRolesDemo() {
  return (
    <div style={flexCol(16)}>
      <PdsMantineText type="body" fontSize="700">
        Default body 700 — internal-tool baseline (§2.1–2.3).
      </PdsMantineText>
      <PdsMantineText type="interface" fontSize="600">
        Interface 600 — labels and metadata beside controls.
      </PdsMantineText>
      <PdsMantineText type="table" fontSize="600">
        Table role 600 — dense cell line.
      </PdsMantineText>
      <PdsMantineText type="monospace" fontSize="500">
        j.smith · ID 180564 — monospace IDs only
      </PdsMantineText>
      <PdsMantineText type="body" fontSize="900" fontWeight="strong">
        Strong on a phrase — not whole paragraphs (§2.5).
      </PdsMantineText>
    </div>
  );
}

function UI_FormFieldValidationDemo() {
  const [soft, setSoft] = useState('2025-06-31');
  return (
    <div style={flexCol(24, { maxWidth: 420 })}>
      <PdsTextField
        label="Team name"
        placeholder="Knockout Bracket CL 24/25"
        required
        helperTextMessage="Cannot be blank"
        helperTextType="error"
        color="neutral"
      />
      <PdsTextField label="Venue code" placeholder="VEN-9931" readOnly />
      <PdsTextField
        label="Start date"
        value={soft}
        onChange={(e) => setSoft(e.currentTarget.value)}
        helperTextMessage="Starts before season — confirm with ops"
        helperTextType="attention"
      />
    </div>
  );
}

function UI_ModalCommitAndP7Demo() {
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  return (
    <div style={flexCol(16)}>
      <div style={flexRow(8)}>
        <PdsMantineButton rank="outline" color="neutral" surface="on-light" onClick={() => setOpenEdit(true)}>
          Modal commit cluster (§4.2)
        </PdsMantineButton>
        <PdsMantineButton rank="outline" color="neutral" surface="on-light" onClick={() => setOpenDelete(true)}>
          P7 destructive confirm (§4.5)
        </PdsMantineButton>
      </div>

      <PdsModal
        show={openEdit}
        onDismiss={() => setOpenEdit(false)}
        surface="on-light"
        dismissible
        closeOnClickout={false}
      >
        <PdsModalHeader headline="Edit tournament" surface="on-light" />
        <PdsModalBody surface="on-light">
          Primary commit is rightmost; Cancel is subtle neutral immediately left (same cluster).
        </PdsModalBody>
        <PdsModalFooter justifyContent="end" surface="on-light" divider>
          <>
            <PdsMantineButton rank="subtle" color="neutral" surface="on-light" onClick={() => setOpenEdit(false)}>
              Cancel
            </PdsMantineButton>
            <PdsMantineButton rank="fill" color="action" surface="on-light" onClick={() => setOpenEdit(false)}>
              Save changes
            </PdsMantineButton>
          </>
        </PdsModalFooter>
      </PdsModal>

      <PdsModal
        show={openDelete}
        onDismiss={() => setOpenDelete(false)}
        surface="on-light"
        dismissible
        closeOnClickout={false}
      >
        <PdsModalHeader headline="Remove team from bracket?" surface="on-light" />
        <PdsModalBody surface="on-light">
          This cannot be undone. Confirm uses warning fill — only here after explicit opt-in (§4.2).
        </PdsModalBody>
        <PdsModalFooter justifyContent="end" surface="on-light" divider>
          <>
            <PdsMantineButton rank="subtle" color="neutral" surface="on-light" onClick={() => setOpenDelete(false)}>
              Cancel
            </PdsMantineButton>
            <PdsMantineButton rank="fill" color="warning" surface="on-light" onClick={() => setOpenDelete(false)}>
              Remove
            </PdsMantineButton>
          </>
        </PdsModalFooter>
      </PdsModal>
    </div>
  );
}

function UI_TabsAndMenusDemo() {
  return (
    <div style={flexCol(8)}>
      <PdsMantineText type="interface" fontSize="600">
        §4.4 — tab labels stay neutral; attention only for status chips in labels.
      </PdsMantineText>
      <PdsTabGroup preSelectedTabValue="teams" surface="on-light" color="neutral" onSelect={() => {}}>
        <PdsTab value="teams">Teams</PdsTab>
        <PdsTab value="venues">Venues</PdsTab>
        <PdsTab value="review">Review</PdsTab>
      </PdsTabGroup>
    </div>
  );
}

function UI_TableFiltersBulkDemo() {
  const [mine, setMine] = useState(true);
  const [open, setOpen] = useState(false);
  return (
    <div style={flexCol(16)}>
      <div style={flexRow(8, { alignItems: 'center' })}>
        <PdsFilterChip
          selected={mine}
          onSelectionChange={setMine}
          color="neutral"
          surface="on-light"
        >
          Show only mine
        </PdsFilterChip>
        <PdsFilterChip selected={false} color="neutral" surface="on-light">
          Competition
        </PdsFilterChip>
        <PdsMantineButton rank="ghost" color="neutral" surface="on-light">
          Clear all
        </PdsMantineButton>
      </div>

      <PdsTable size="sm" stretch hasBorder>
        <PdsTHead>
          <PdsTHeadRow>
            <PdsTHeadCell>Team</PdsTHeadCell>
            <PdsTHeadCell>Status</PdsTHeadCell>
            <PdsTHeadCell align="right">Actions</PdsTHeadCell>
          </PdsTHeadRow>
        </PdsTHead>
        <PdsTBody>
          <PdsTBodyRow>
            <PdsTBodyCell>
              <PdsMantineText type="table" fontSize="600">
                FC Barcelona
              </PdsMantineText>
            </PdsTBodyCell>
            <PdsTBodyCell>
              <PdsMantineBadge color="success" surface="on-light">
                Active
              </PdsMantineBadge>
            </PdsTBodyCell>
            <PdsTBodyCell align="right">
              <div style={flexRow(4, { wrap: false, justifyContent: 'flex-end', alignItems: 'center' })}>
                <PdsMantineButton rank="outline" color="neutral" surface="on-light">
                  Edit
                </PdsMantineButton>
                <PdsMantineButton rank="ghost" color="warning" surface="on-light">
                  Remove
                </PdsMantineButton>
              </div>
            </PdsTBodyCell>
          </PdsTBodyRow>
        </PdsTBody>
      </PdsTable>

      <div style={flexCol(8, { alignItems: 'flex-start' })}>
        <PdsMantineText type="interface" fontSize="600">
          §5.5–5.6 — bulk overlay + expand affordance (ghost neutral).
        </PdsMantineText>
        <div style={{ position: 'relative', minHeight: 72, border: '1px solid #ccc', padding: 8 }}>
          {open ? (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(0,0,0,0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              <PdsLoader />
              <PdsMantineText type="interface" fontSize="600">
                Importing…
              </PdsMantineText>
            </div>
          ) : null}
          <div style={flexRow(8)}>
            <PdsMantineButton rank="outline" color="warning" surface="on-light">
              Bulk remove selected
            </PdsMantineButton>
            <PdsMantineButton rank="outline" color="action" surface="on-light">
              Bulk import
            </PdsMantineButton>
            <PdsMantineButton rank="ghost" color="neutral" surface="on-light" onClick={() => setOpen((v) => !v)}>
              Toggle bulk overlay demo
            </PdsMantineButton>
          </div>
        </div>
      </div>
    </div>
  );
}

const withPodium = (Story: () => React.ReactNode) => (
  <PodiumProvider>{storyStage(<Story />)}</PodiumProvider>
);

const meta: Meta = {
  title: 'PATTERNS/UI Patterns',
  decorators: [withPodium],
  parameters: {
    layout: 'padded',
    controls: { disable: true },
    docs: {
      toc: {
        title: 'Table of Contents',
        headingSelector: 'h1, h2, h3, h4',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const UI_ButtonHierarchyDoDont: Story = {
  name: '§1.7 Button hierarchy Do / Don’t',
  render: () => <UI_ButtonHierarchyDoDontDemo />,
};

export const UI_ButtonColorRank: Story = {
  name: '§1.1–1.3 Button colour + rank',
  render: () => <UI_ButtonColorRankDemo />,
};

export const UI_BrandAndFeedbackBadges: Story = {
  name: '§1.4–1.5 Brand + feedback badges',
  render: () => <UI_BrandAndFeedbackBadgesDemo />,
};

export const UI_TypographyRoles: Story = {
  name: '§2 Typography roles + scale',
  render: () => <UI_TypographyRolesDemo />,
};

export const UI_FormFieldValidation: Story = {
  name: '§3 Form fields + validation tone',
  render: () => <UI_FormFieldValidationDemo />,
};

export const UI_ModalCommitAndP7: Story = {
  name: '§4 Modal commit + P7 chrome',
  render: () => <UI_ModalCommitAndP7Demo />,
};

export const UI_TabsAndMenus: Story = {
  name: '§4 Tabs + neutral labels',
  render: () => <UI_TabsAndMenusDemo />,
};

export const UI_TableFiltersBulk: Story = {
  name: '§5 Table, filters, bulk',
  render: () => <UI_TableFiltersBulkDemo />,
};
