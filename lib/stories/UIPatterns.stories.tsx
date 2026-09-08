/**
 * ShadCN reference demos for `docs/UI_PATTERNS.md` — embedded via
 * `<!-- storybook:embed ExportName -->`.
 *
 * These are visual illustrations of High Fidelity Design System semantic rules (rank, color, surface).
 * Production code uses a High Fidelity Design System; this file provides
 * portable reference demos that run without a private design-system registry.
 */
import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from './shadcn/button';
import { Badge } from './shadcn/badge';
import { Input } from './shadcn/input';
import { Label } from './shadcn/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from './shadcn/dialog';
import { Tabs, TabsList, TabsTrigger } from './shadcn/tabs';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from './shadcn/table';
import { Toggle } from './shadcn/toggle';

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
  <p className="text-sm font-semibold">
    {kind === 'do' ? 'Do — ' : "Don't — "}
    {text}
  </p>
);

/* ─── §1.7 Button hierarchy Do / Don't ─────────────────────────────────────── */

function UI_ButtonHierarchyDoDontDemo() {
  return (
    <div style={flexCol(20)}>
      <p className="text-base font-semibold">§1.7 — button hierarchy (abbreviated visuals; full pairs in doc)</p>

      {cap('do', 'Monotonic ladder: ghost → subtle → fill (same semantic colour).')}
      {strip(
        <>
          <Button variant="ghost">Tertiary</Button>
          <Button variant="subtle">Secondary</Button>
          <Button variant="action">Primary</Button>
        </>,
      )}

      {cap('dont', 'Outline as strongest beside subtle — subtle can read heavier than outline.')}
      {strip(
        <>
          <Button variant="ghost">Back</Button>
          <Button variant="subtle">Secondary</Button>
          <Button variant="outline">"Primary" outline</Button>
        </>,
      )}

      {cap('do', 'One semantic family per strip (all neutral here).')}
      {strip(
        <>
          <Button variant="ghost">⚙</Button>
          <Button variant="ghost">Edit</Button>
          <Button variant="subtle">+ Add</Button>
        </>,
      )}

      {cap('dont', 'Mixed neutral utilities + action fill in one cluster.')}
      {strip(
        <>
          <Button variant="ghost">Edit</Button>
          <Button variant="outline">Filter</Button>
          <Button variant="action">Save</Button>
        </>,
      )}

      {cap('dont', 'Wavy ranks: outline → subtle → outline.')}
      {strip(
        <>
          <Button variant="outline">A</Button>
          <Button variant="subtle">B</Button>
          <Button variant="outline">C</Button>
        </>,
      )}

      {cap('dont', 'Two fills adjacent.')}
      {strip(
        <>
          <Button variant="action">Edit</Button>
          <Button variant="action">Publish</Button>
        </>,
      )}

      {cap('do', 'Equal-importance ghosts (optional leading glyph in label).')}
      {strip(
        <>
          <Button variant="ghost">⏷ Filter</Button>
          <Button variant="ghost">⎙ Print</Button>
          <Button variant="ghost">⬇ Download</Button>
        </>,
      )}
    </div>
  );
}

/* ─── §1.1–1.3, 1.6 Button colour + rank ───────────────────────────────────── */

function UI_ButtonColorRankDemo() {
  return (
    <div style={flexCol(16)}>
      <p className="text-base font-semibold">§1.1–1.3, 1.6 — one fill per cluster; ranks + sizes</p>
      <div style={flexRow(8)}>
        <Button variant="outline">Secondary outline</Button>
        <Button variant="action">Primary commit</Button>
        <Button variant="subtle">Cancel subtle</Button>
        <Button variant="ghost">Back ghost</Button>
      </div>
      <div style={flexRow(8)}>
        <Button variant="outline">Hide reversible</Button>
        <Button variant="outline-warning">Remove outline</Button>
        <Button variant="ghost-warning">Delete ghost</Button>
      </div>
    </div>
  );
}

/* ─── §1.4–1.5 Brand + feedback badges ─────────────────────────────────────── */

function UI_BrandAndFeedbackBadgesDemo() {
  return (
    <div style={flexCol(16)}>
      <p className="text-sm">§1.4–1.5 — semantic badge / counter treatment (colour + label, not decoration).</p>
      <div style={flexRow(8, { alignItems: 'center' })}>
        <Badge variant="success">Saved</Badge>
        <Badge variant="neutral">Draft</Badge>
        <Badge variant="neutral">Count neutral · 12</Badge>
        <Badge variant="attention">Soft follow-up</Badge>
        <Badge variant="warning">Hard block</Badge>
      </div>
    </div>
  );
}

/* ─── §2 Typography roles + scale ──────────────────────────────────────────── */

function UI_TypographyRolesDemo() {
  return (
    <div style={flexCol(16)}>
      <p className="text-base">Default body — internal-tool baseline (§2.1–2.3).</p>
      <p className="text-sm text-neutral-600">Interface — labels and metadata beside controls.</p>
      <p className="text-sm font-mono text-neutral-700">j.smith · ID 180564 — monospace IDs only</p>
      <p className="text-xl font-semibold">Strong on a phrase — not whole paragraphs (§2.5).</p>
    </div>
  );
}

/* ─── §3 Form fields + validation tone ─────────────────────────────────────── */

function UI_FormFieldValidationDemo() {
  const [soft, setSoft] = useState('2025-06-31');
  return (
    <div style={flexCol(24, { maxWidth: 420 })}>
      <div style={flexCol(4)}>
        <Label htmlFor="team-name">
          Team name <span className="text-red-500">*</span>
        </Label>
        <Input id="team-name" placeholder="Knockout Bracket CL 24/25" aria-invalid />
        <p className="text-xs text-red-600">Cannot be blank</p>
      </div>

      <div style={flexCol(4)}>
        <Label htmlFor="venue-code">Venue code</Label>
        <Input id="venue-code" placeholder="VEN-9931" readOnly className="bg-neutral-50 cursor-default" />
      </div>

      <div style={flexCol(4)}>
        <Label htmlFor="start-date">Start date</Label>
        <Input
          id="start-date"
          value={soft}
          onChange={(e) => setSoft(e.currentTarget.value)}
        />
        <p className="text-xs text-amber-600">Starts before season — confirm with ops</p>
      </div>
    </div>
  );
}

/* ─── §4 Modal commit + P7 chrome ──────────────────────────────────────────── */

function UI_ModalCommitAndP7Demo() {
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  return (
    <div style={flexCol(16)}>
      <div style={flexRow(8)}>
        <Button variant="outline" onClick={() => setOpenEdit(true)}>
          Modal commit cluster (§4.2)
        </Button>
        <Button variant="outline" onClick={() => setOpenDelete(true)}>
          P7 destructive confirm (§4.5)
        </Button>
      </div>

      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit tournament</DialogTitle>
            <DialogDescription>
              Primary commit is rightmost; Cancel is subtle neutral immediately left (same cluster).
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="subtle" onClick={() => setOpenEdit(false)}>
              Cancel
            </Button>
            <Button variant="action" onClick={() => setOpenEdit(false)}>
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={openDelete} onOpenChange={setOpenDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove team from bracket?</DialogTitle>
            <DialogDescription>
              This cannot be undone. Confirm uses warning fill — only here after explicit opt-in (§4.2).
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="subtle" onClick={() => setOpenDelete(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => setOpenDelete(false)}>
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ─── §4.4 Tabs + neutral labels ───────────────────────────────────────────── */

function UI_TabsAndMenusDemo() {
  return (
    <div style={flexCol(8)}>
      <p className="text-sm text-neutral-600">
        §4.4 — tab labels stay neutral; attention only for status chips in labels.
      </p>
      <Tabs defaultValue="teams">
        <TabsList>
          <TabsTrigger value="teams">Teams</TabsTrigger>
          <TabsTrigger value="venues">Venues</TabsTrigger>
          <TabsTrigger value="review">Review</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}

/* ─── §5 Table, filters, bulk ──────────────────────────────────────────────── */

function UI_TableFiltersBulkDemo() {
  const [mine, setMine] = useState(true);
  const [loading, setLoading] = useState(false);

  return (
    <div style={flexCol(16)}>
      <div style={flexRow(8, { alignItems: 'center' })}>
        <Toggle pressed={mine} onPressedChange={setMine} aria-label="Show only mine">
          Show only mine
        </Toggle>
        <Toggle pressed={false} aria-label="Competition">
          Competition
        </Toggle>
        <Button variant="ghost" size="sm">
          Clear all
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Team</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="text-sm">FC Barcelona</TableCell>
            <TableCell>
              <Badge variant="success">Active</Badge>
            </TableCell>
            <TableCell>
              <div style={flexRow(4, { wrap: false, justifyContent: 'flex-end', alignItems: 'center' })}>
                <Button variant="outline" size="sm">
                  Edit
                </Button>
                <Button variant="ghost-warning" size="sm">
                  Remove
                </Button>
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <div style={flexCol(8, { alignItems: 'flex-start' })}>
        <p className="text-sm text-neutral-600">§5.5–5.6 — bulk overlay + expand affordance (ghost neutral).</p>
        <div style={{ position: 'relative', minHeight: 72, border: '1px solid #ccc', padding: 8, width: '100%' }}>
          {loading ? (
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
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm text-neutral-600">Importing…</span>
            </div>
          ) : null}
          <div style={flexRow(8)}>
            <Button variant="outline-warning">Bulk remove selected</Button>
            <Button variant="outline-action">Bulk import</Button>
            <Button variant="ghost" onClick={() => setLoading((v) => !v)}>
              Toggle bulk overlay demo
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Storybook meta ────────────────────────────────────────────────────────── */

const meta: Meta = {
  title: 'PATTERNS/UI Patterns',
  parameters: {
    layout: 'padded',
    controls: { disable: true },
    docs: {
      description: {
        component:
          'Reference visuals use ShadCN components as portable illustrations. Production semantics (rank, color, surface) follow High Fidelity Design System props documented in the sections below.',
      },
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
  name: "§1.7 Button hierarchy Do / Don't",
  render: () => storyStage(<UI_ButtonHierarchyDoDontDemo />),
};

export const UI_ButtonColorRank: Story = {
  name: '§1.1–1.3 Button colour + rank',
  render: () => storyStage(<UI_ButtonColorRankDemo />),
};

export const UI_BrandAndFeedbackBadges: Story = {
  name: '§1.4–1.5 Brand + feedback badges',
  render: () => storyStage(<UI_BrandAndFeedbackBadgesDemo />),
};

export const UI_TypographyRoles: Story = {
  name: '§2 Typography roles + scale',
  render: () => storyStage(<UI_TypographyRolesDemo />),
};

export const UI_FormFieldValidation: Story = {
  name: '§3 Form fields + validation tone',
  render: () => storyStage(<UI_FormFieldValidationDemo />),
};

export const UI_ModalCommitAndP7: Story = {
  name: '§4 Modal commit + P7 chrome',
  render: () => storyStage(<UI_ModalCommitAndP7Demo />),
};

export const UI_TabsAndMenus: Story = {
  name: '§4 Tabs + neutral labels',
  render: () => storyStage(<UI_TabsAndMenusDemo />),
};

export const UI_TableFiltersBulk: Story = {
  name: '§5 Table, filters, bulk',
  render: () => storyStage(<UI_TableFiltersBulkDemo />),
};
