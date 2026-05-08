# Components backlog — lofi-kit

This file documents components that are **planned but not yet implemented**.
They are referenced throughout `Patterns.md` and `UX_FLOW_PATTERNS.md` with
a `_(backlog)_` marker. When a component is built, remove it from this file
and add it to the catalog in `Patterns.md` and `LOFI_BLOCKS.md`.

Each entry defines: the lo-fi prototype use case, the visual representation in
the monochrome/monospace system, the component API surface, and the BEM root.

---

## Build order

**Driver — cross-demo kit completeness.** The kit serves multiple demos
(bracket-demo, mapping-prototype) with different screen shapes. Priority is
given to primitives that unlock consistent feedback, empty states, and boolean
controls across _all_ demos rather than optimising for one demo's screen type.

### Tier 1 sequence

| Step | Export(s) | Unblocks |
|------|-----------|----------|
| 1 | `LOFIToast` + `LOFIInlineAlert` | Consistent **P4** toast outcomes and **P6** inline field / section errors |
| 2 | `LOFIEmptyState` | Zero-data states in tables and panels read as intentional (P1 tables, stakeholder clarity) |
| 3 | `LOFISwitch` | Boolean on/off settings in any form; smaller surface area than the shell components |
| 4 | `LOFIMainWorkspace` | UPL main pane (P1.2.3); `LOFITabs` is already shipped so the frame is the only remaining piece |

### Tier 2 sequence

| Step | Export | Rationale |
|------|--------|-----------|
| 1 | `LOFINavTree` | Full UPL sidebar; depends on `LOFIMainWorkspace` (Tier 1 step 4) hosting the main pane |

### Tier 3

Defer `LOFIFilterBar` and `LOFIProgressBar` until a concrete prototype story requires active-filter chips or determinate progress indication.

| Step | Export | Rationale |
|------|--------|-----------|
| TBD | `LOFISkeleton` | Layout-preserving placeholder for data-fetch to avoid layout shift; distinct from the first-use chrome pattern. See note below. |

---

### Note: `LOFISkeleton` vs first-use chrome

**First-use chrome** (P2.1 rule 5) — the table is genuinely empty (no records exist).
Show real headers and disabled controls so the operator understands the interface structure.
This is a **UX pattern**, not a loading state. Do not use `LOFISkeleton` here.

**`LOFISkeleton`** (this backlog item) — data is being **fetched** and we want to avoid layout
shift while waiting for the response. Placeholder shimmer blocks occupy the space where content
will appear. Use inside the table body or panel body during initial fetch.

**Table lazy-load / infinite scroll row** — when new rows are being appended at the bottom of
an already-populated table (infinite scroll, load-more), show a **blank row with a centred
loading indicator** (`LOFILoader`) spanning all columns. This is a composition pattern using
existing primitives, not a new component. No new kit component required.

---

## Priority 1 — blocks common patterns from being prototyped

These components have no adequate substitution using existing primitives.
Every prototype that reaches a meaningful level of interaction fidelity will
need at least one of these.

---

### `LOFIToast`

**What it represents in a prototype**
The system's response to a completed user action — a save succeeded, a record
was deleted, a process finished. It appears without blocking the user's flow
and disappears after a short interval. It answers the question "did that work?"
without forcing the user to stop and acknowledge anything.

**Why it cannot be composed from existing primitives**
`LOFIModal` blocks. `LOFILoader` is in-progress only. `LOFIBadge` is inline and
persistent. None of these communicates "transient, non-blocking, action-complete
feedback from the corner of the screen."

**Lo-fi visual representation**
A small bordered box, fixed to the bottom-right of the viewport (or top-right —
to be decided consistently across all prototypes). Square corners. Solid 1px
border. `$shadow-sm` offset. Contains a unicode severity prefix and a short
message. Optionally contains a single dismiss action (`✕`). A dashed border
signals a warning-severity toast; a solid border signals info or success.

```
┌─────────────────────────────────┐
│  ✓  Team saved successfully.  ✕ │
└─────────────────────────────────┘
```

**Severity differentiation (no color)**

| Severity | Border style | Prefix icon |
|---|---|---|
| `success` | solid | `✓` |
| `info` | solid | `ℹ` |
| `warning` | dashed | `⚠` |
| `error` | solid, 2px | `✕` |

**API sketch**
```tsx
<LOFIToast
  severity="success"           // 'success' | 'info' | 'warning' | 'error'
  message="Team saved."
  onDismiss={() => setToast(null)}
  autoDismiss={3000}           // ms; omit to require explicit dismiss
/>
```

**BEM root:** `toast`
**Source:** `lib/src/ui/Toast/Toast.tsx`

---

### `LOFIInlineAlert`

**What it represents in a prototype**
A persistent, contextual message embedded in the flow of a form, table section,
or panel. It signals that something about the current view or data requires the
user's attention — without interrupting their flow the way a Modal would. It
lives near the content it describes and stays visible until the condition changes.

**Why it cannot be composed from existing primitives**
`LOFIToast` is transient and positional, not contextual. `LOFIModal` blocks.
`LOFIBadge` carries a label, not a message with context. There is no existing
primitive for "a persistent warning or error message embedded mid-form".

**Typical uses in prototypes**
- Form-level validation errors after a failed submit attempt
- A section of the form that is locked because of a conflicting record
- A warning that the current data has unsaved changes
- A notice that a feature is unavailable in the current context

**Lo-fi visual representation**
A full-width bordered box, placed at the point of relevance (above a form, below
a section heading, within a table header). A 2px solid left border acts as the
severity indicator in lieu of color. Unicode prefix icon. Short headline + optional
body text.

```
┌─ ✕ ──────────────────────────────────────────────────────┐
│  Validation error                                        │
│  Player count exceeds the maximum allowed for this round │
└──────────────────────────────────────────────────────────┘
(2px solid left border = error)

┌ ⚠ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐
│  Unsaved changes                                        ·
│  This record has been edited but not yet saved.         ·
└ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘
(dashed border = warning)
```

**Severity differentiation (no color)**

| Severity | Border | Left rule | Prefix |
|---|---|---|---|
| `error` | solid 1px | solid 2px | `✕` |
| `warning` | dashed 1px | dashed 2px | `⚠` |
| `info` | solid 1px | solid 1px | `ℹ` |
| `success` | solid 1px | solid 1px | `✓` |

**API sketch**
```tsx
<LOFIInlineAlert
  severity="error"             // 'error' | 'warning' | 'info' | 'success'
  title="Validation error"
  message="Player count exceeds the maximum allowed for this round."
  onDismiss={() => clearError()}  // optional; omit for non-dismissible
/>
```

**BEM root:** `inline-alert`
**Source:** `lib/src/ui/InlineAlert/InlineAlert.tsx`

---

### `LOFIEmptyState`

**What it represents in a prototype**
The state of a `LOFITable`, `LOFICard`, or `LOFIPanel` when it contains no data.
The empty state must communicate _why_ there is nothing to show and give the
user a clear next step. A blank table with no message is not an empty state —
it is a broken interface.

**Why it cannot be composed from existing primitives**
`LOFICard` with `empty` prop provides a visual affordance only. It has no
defined slots for a headline, a supporting description, or a recovery action.
The pattern gets reinvented per-screen without it, producing inconsistent
zero-data experiences.

**Three sub-cases — each requires different copy and CTA**

| Sub-case | When | Headline shape | CTA |
|---|---|---|---|
| `first-use` | No records have ever been created | "No X yet" | Primary button to create first record |
| `no-results` | Records exist but current filter returns none | "No results for [filter]" | Dismiss button to clear filters |
| `error` | Data fetch failed | "Could not load X" | Default button to retry |

**Lo-fi visual representation**
Centred within the container that owns it (table body, card body, panel body).
Dashed border around the container signals the empty/pending state per the visual
rules. Short bold headline + one sentence of supporting text + optional action
button.

```
┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐
·                                                         ·
·             No teams yet                                ·
·             Add your first team to get started.         ·
·                                                         ·
·                  [ + Add team ]                         ·
·                                                         ·
└ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘
```

**API sketch**
```tsx
<LOFIEmptyState
  variant="first-use"           // 'first-use' | 'no-results' | 'error'
  title="No teams yet"
  description="Add your first team to get started."
  action={<LOFIButton variant="primary" onClick={openCreate}>+ Add team</LOFIButton>}
/>
```

**BEM root:** `empty-state`
**Source:** `lib/src/ui/EmptyState/EmptyState.tsx`

---

### `LOFISwitch`

**What it represents in a prototype**
A named on/off binary setting. The Switch is the correct control for any
attribute that is either enabled or disabled — distinct from `LOFICheckbox`,
which represents membership in a selection set, not a setting state.

**Why it cannot be composed from existing primitives**
`LOFICheckbox` is semantically and visually wrong for boolean settings. In a
lo-fi prototype, the distinction matters: a Checkbox in a form says "include
this item", a Switch says "this feature is on". Using the wrong control
miscommunicates intent to stakeholders reviewing the prototype.

**Lo-fi visual representation**
A small rectangular track with a sliding indicator — rendered in monochrome
using border, fill, and offset. The label is always visible, placed to the
right of the track. In the `off` state: empty track with outlined indicator.
In the `on` state: filled track with white indicator.

```
[ ─ ○ ]  Inactive    (off: outlined track, indicator left)
[○─── ]  Active      (on: filled track, indicator right)
```

Because this is lo-fi and monochrome, the track fill is `$color-ink` when on
and `$color-surface` when off, with a `$color-border` stroke on the track at
all times.

**API sketch**
```tsx
<LOFISwitch
  checked={active}
  onChange={setActive}
  label="Active"
  size="default"                // 'default' | 'compact'
/>
```

**BEM root:** `switch`
**Source:** `lib/src/ui/Switch/Switch.tsx`

---

### `LOFIMainWorkspace`

**What it represents in a prototype**
The main right-hand pane of a **Unified Production Landscape (UPL)** interface.
It acts as a stable layout frame that hosts feature interfaces — entity context
(breadcrumb path and title with status badges), an optional tab strip, a
scrollable body (form editor, table, or any content), and an optional sticky
footer with primary and secondary actions. The zones never move when data
changes; only their slot contents update. This encodes the UPL contract: "the
structure is fixed, the values flow in."

**Why it cannot be composed from existing primitives**
Without a named component, every UPL-style demo independently reinvents the
same flex structure, scroll containment, border placement, and footer
stickiness. `LOFIModal` is a blocking overlay. `LOFICard` has no scrollable
body, tab slot, or sticky footer. `LOFIPanel` is a row-adjacent contextual
detail drawer, not a full-page primary workspace. The structural contract
("breadcrumb above header above tabs above body above sticky footer") is the
consistent signal that tells stakeholders: "this is the production main pane."
Without it the signal is lost.

**Lo-fi visual representation**
A vertically stacked frame using token borders and `$color-surface` for the
header zone. Square corners throughout. The footer is separated from the body
by a solid 1px `$color-border` top rule; actions are right-aligned.

```
┌──────────────────────────────────────────────────────┐
│  International Clubs › Champions League              │  ← breadcrumb (LOFIText muted)
│  Knockout Bracket — Champions League 24/25  [SIMPLE] │  ← title + LOFIBadge
├──────────────────────────────────────────────────────┤
│  [ Admin ]  [ Competitors ]  [ Matches ]             │  ← LOFITabs
├──────────────────────────────────────────────────────┤
│                                                      │
│  (feature interface body — form, table, etc.)        │  ↕ scrollable
│                                                      │
├──────────────────────────────────────────────────────┤
│                     [ Reset changes ] [ Save changes ]│  ← sticky footer
└──────────────────────────────────────────────────────┘
```

All four zones are optional — omit `tabs` for a single-view surface; omit
`footer` when the feature is read-only. The `breadcrumb` and `title` zones
should always be present to anchor entity context for the operator.

**API sketch**
```tsx
<LOFIMainWorkspace
  breadcrumb={
    <LOFIText variant="muted">International Clubs › Champions League</LOFIText>
  }
  title="Knockout Bracket — Champions League 24/25"
  titleBadges={<LOFIBadge variant="tag" label="SIMPLE TOURNAMENT" />}
  tabs={
    <LOFITabs
      value={activeTab}
      onChange={setActiveTab}
      tabs={[
        { value: 'admin',       label: 'Admin' },
        { value: 'competitors', label: 'Competitors' },
        { value: 'matches',     label: 'Matches' },
      ]}
    />
  }
  footer={
    <>
      <LOFIButton variant="dismiss" onClick={resetChanges}>Reset changes</LOFIButton>
      <LOFIButton variant="primary" onClick={saveChanges}>Save changes</LOFIButton>
    </>
  }
>
  {activeTab === 'admin'       && <AdminForm tournament={tournament} />}
  {activeTab === 'competitors' && <LOFITable columns={competitorCols} rows={competitors} />}
  {activeTab === 'matches'     && <LOFITable columns={matchCols} rows={matches} />}
</LOFIMainWorkspace>
```

**BEM root:** `main-workspace`
**Source:** `lib/src/ui/MainWorkspace/MainWorkspace.tsx`

> **See also:** [`UX_PATTERNS.md` — P1: Workspace](UX_PATTERNS.md) — full behavioural rules for the UPL structural shell and its sub-regions.

---

## Priority 2 — all shipped

`LOFITextarea`, `LOFIPagination`, and `LOFINavTree` are implemented. See the
catalog in `Patterns.md` and `LOFI_BLOCKS.md` for API reference.

---

## Priority 3 — quality-of-life; build when a prototype first needs it

---

### `LOFIFilterBar`

> **Scope note — two separate concepts share the word "filter":**
>
> `LOFIFilterBar` is the **active-filter summary strip** (result count +
> dismissible chip tokens + "Clear all"). It appears **after** a search has
> been run and shows which filters are currently applied.
>
> It is **not** the **filter query row** — the horizontal row of `LOFIField` +
> `LOFIInput` / `LOFISelect` inputs with a Search button and Reset link that
> operators use to enter their filter criteria. That row is a **composition
> pattern** assembled from existing primitives; see [`docs/LOFI_KIT_PATTERNS.md`](PATTERNS.md)
> — "Filter query row" under the UPL composition section.

**What it represents in a prototype**
The active filter state of a data view — a strip showing which filters are
currently applied as dismissible tokens, a result count, and a global clear
action. It makes the current query visible and gives the user a fast path to
remove individual filters or reset to the unfiltered state without reopening
the filter query row above.

**Lo-fi visual representation**
A horizontal strip between the table controls and the table header. Tokens are
`LOFIBadge variant="tag"` with an appended `✕` dismiss button. A result count
on the left. A "Clear all" dismiss button on the right, only visible when at
least one filter is active.

```
14 results    [ Football ✕ ]  [ Round 3 ✕ ]  [ Live ✕ ]    Clear all
```

**API sketch**
```tsx
<LOFIFilterBar
  resultCount={14}
  filters={[
    { label: 'Football', onRemove: () => removeFilter('sport') },
    { label: 'Round 3',  onRemove: () => removeFilter('round') },
    { label: 'Live',     onRemove: () => removeFilter('status') },
  ]}
  onClearAll={clearAllFilters}
/>
```

**BEM root:** `filter-bar`
**Source:** `lib/src/ui/FilterBar/FilterBar.tsx`

---

### `LOFIProgressBar`

**What it represents in a prototype**
A determinate async progress indicator — distinct from `LOFILoader`, which is
indeterminate. Use when a long-running operation has a known completion
percentage (bulk import, data sync, fixture generation for a large competition).

**Why `LOFILoader` is insufficient here**
`LOFILoader` communicates "something is happening, duration unknown". A
progress bar communicates "we are N% done with a known total". These are
meaningfully different for operators managing time-sensitive bulk operations.

**Lo-fi visual representation**
A full-width bordered rectangle with an inner filled rectangle representing
progress. Percentage label centred above or to the right. In monochrome: the
filled portion is `$color-ink`; the empty portion is `$color-surface` with
`$color-border` stroke on the outer track.

```
Importing fixtures…
┌──────────────────────────────────────────────┐
│████████████████████░░░░░░░░░░░░░░░░░░░░░░░░ │  47%
└──────────────────────────────────────────────┘
```

**API sketch**
```tsx
<LOFIProgressBar
  value={47}         // 0–100
  label="Importing fixtures…"
/>
```

**BEM root:** `progress-bar`
**Source:** `lib/src/ui/ProgressBar/ProgressBar.tsx`

---

---

### `LOFIMultiSelect`

**What it represents in a prototype**
A field that lets the user select multiple values from a fixed list — the
multi-value sibling of `LOFISelect`. Typical uses: filtering a table by
several statuses at once, assigning multiple tags or categories, specifying
a set of participants. The key difference from `LOFISelect` is that more
than one option can be active simultaneously.

**Why it cannot be composed from existing primitives**
`LOFISelect` is single-value only. `LOFICheckbox` renders a static list
and has no trigger affordance. `LOFIBadge` carries a static label. There
is no existing primitive that combines a trigger button, a portaled
checkbox list, and a row of clearable value chips.

**Typical uses in prototypes**
- Status filter above a table ("Draft / Active / Archived")
- Category or tag assignment on an entity edit form
- Participant picker in a scheduling or tournament form

**Lo-fi visual representation**

Closed (values selected):
```
┌──────────────────────────────────────────────────┐
│  [ Draft × ]  [ Active × ]  [ Archived × ]       │
└──────────────────────────────────────────────────┘
```

Closed (nothing selected):
```
┌──────────────────────────────────────────────────┐
│  All statuses                                    │
└──────────────────────────────────────────────────┘
```

Open (portaled dropdown below trigger):
```
┌──────────────────────────────────────────────────┐
│  [✓] Draft                                       │
│  [✓] Active                                      │
│  [✓] Archived                                    │
│  [ ] Locked  (disabled)                          │
│  ─────────────────────────────────────────────   │
│  Clear all                                       │
└──────────────────────────────────────────────────┘
```

Each selected value is shown as a `badge--tag` chip with a `✕` clear
button inside the trigger. Clicking `✕` removes that single value.
"Clear all" resets `values` to `[]`. When no values are selected the
placeholder string is rendered instead of chips. The dropdown reuses the
`dropdown-menu` / `dropdown-menu__item` BEM surface from `LOFISelect`.
Each item row contains a `LOFICheckbox` on the left and the option label.

**Visual rules**
- Trigger: same border, padding, and monospace font as `LOFISelect`
- Chips: `badge--tag` style (square corners via `$radius-none` override,
  consistent with `--id` variant sizing)
- Chip clear button: inline `✕`, `$color-ink-muted`, brightens on hover
- Dropdown: `dropdown-menu` panel — same portal, z-index, and shadow as
  `LOFISelect`; items are `dropdown-menu__item` rows
- Sizes: `default` and `compact` matching `LOFISelect` sizes

**API sketch**
```tsx
<LOFIMultiSelect
  values={['draft', 'active']}
  onChange={(values: string[]) => setValues(values)}
  options={[
    { value: 'draft',    label: 'Draft' },
    { value: 'active',   label: 'Active' },
    { value: 'archived', label: 'Archived' },
    { value: 'locked',   label: 'Locked', disabled: true },
  ]}
  placeholder="All statuses"   // shown when values is empty
  size="default"               // 'default' | 'compact'
  disabled={false}
  id="status-filter"
  name="status"                // hidden inputs per selected value
/>
```

**BEM root:** `multi-select`
**Reuses:** `dropdown-menu`, `dropdown-menu__item`, `badge--tag`
**Source:** `lib/src/ui/MultiSelect/MultiSelect.tsx`

---

## Backlog summary

| Export | Priority | Blocks pattern | Status |
|---|---|---|---|
| `LOFIToast` | 1 | Async action feedback | Done |
| `LOFIInlineAlert` | 1 | Form/section error and warning states | Done |
| `LOFIEmptyState` | 1 | Zero-data states in tables and panels | Done |
| `LOFISwitch` | 1 | Boolean on/off fields | Done |
| `LOFIMainWorkspace` | 1 | UPL main pane — stable frame for feature interfaces | Done |
| `LOFITextarea` | 2 | Multi-line text entry | Done |
| `LOFIPagination` | 2 | Large dataset page navigation | Done |
| `LOFINavTree` | 2 | Hierarchical sidebar navigation (UPL sidebar) | Done |
| `LOFIFilterBar` | 3 | Active-filter chip summary strip (post-query state) | Not started |
| `LOFIProgressBar` | 3 | Determinate async progress | Not started |
| `LOFIMultiSelect` | 3 | Multi-value select with checkbox list and clearable badge chips | Not started |

---

## Adding a backlog item

When a new gap is identified during prototyping:

1. Add an entry to this file under the appropriate priority tier.
2. Mark references in `Patterns.md` and `UX_FLOW_PATTERNS.md` with `_(backlog)_`.
3. Add a placeholder row to the compliance table in `Patterns.md`.
4. Do **not** add a placeholder export to `lib/src/ui/index.ts` until the
   component is built — import failures are harder to track than missing entries.

When a backlog item is implemented:

1. Remove its entry from this file (or mark as `Done` if change history is
   needed — delete on next cleanup pass).
2. Add it to the catalog tables in `Patterns.md` and `LOFI_BLOCKS.md`.
3. Remove the `_(backlog)_` marker from all references.
4. Update the compliance table in `Patterns.md` with the new export.
5. Run `npm run build:lofi` to verify the export is clean.
