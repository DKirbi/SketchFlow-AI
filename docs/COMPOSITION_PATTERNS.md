# Composition patterns — control selection, recipes, and UPL

> This file covers **how to choose controls in context** and **how to compose
> screens and shells** from `lofi-kit` primitives. It is companion reading to:
>
> - [`LOFI_KIT_PATTERNS.md`](LOFI_KIT_PATTERNS.md) — component catalog, tokens, decision guide
> - [`NL_COMPONENT_MAPPING_LO_FI.md`](NL_COMPONENT_MAPPING_LO_FI.md) — NL → LOFI component translation · [`NL_COMPONENT_MAPPING_HI_FI.md`](NL_COMPONENT_MAPPING_HI_FI.md) — hi-fi (Podium) companion + MCP
> - [`UX_PATTERNS.md`](UX_PATTERNS.md) — P1–P10 interaction behaviour rules (P1 = Workspace structural shell, P2–P10 = interaction patterns)
>
> Both this file and `UX_PATTERNS.md` are required when building a prototype.
> A prototype that uses the right components but ignores the flow rules will look
> correct and behave wrong.

---

## Control selection rules

Choosing the right control for a given data type is one of the most common
sources of inconsistency in prototypes. These rules are strict — do not
substitute based on preference or familiarity.

### Boolean values (on / off, yes / no, enabled / disabled)

Always use **`LOFISwitch`**. A Switch communicates a binary state with a visible
on/off affordance and must always carry a label describing what is being toggled.

```
Active status   →  LOFISwitch label="Active"
Notifications   →  LOFISwitch label="Enable notifications"
Published       →  LOFISwitch label="Published"
```

Do **not** use Checkbox for a single boolean setting. Checkbox means "include
this item in a selection set", not "this feature is on".

### Multiple independent options (each can be individually on or off)

Always use **`LOFICheckbox`** per option, grouped under a `LOFIFieldset`. There
is no upper bound — if 8 independent options each need their own on/off state,
that is 8 checkboxes.

```
Notification preferences (email, SMS, push, in-app)  →  4 × LOFICheckbox
Permission flags (read, write, delete, export)        →  4 × LOFICheckbox
```

### Mutually exclusive options (exactly one can be chosen)

The choice of control depends on the number of options:

| Options | Control | Rationale |
|---------|---------|-----------|
| 2–3 options | **`LOFIRadio`** | All choices visible; comparison is possible without opening a dropdown. |
| 4+ options | **`LOFISelect`** | Space-efficient; options are listed, not scanned simultaneously. |

```
Match status: Draft / Live / Completed  (3 options)  →  LOFIRadio
Country (200 options)                                 →  LOFISelect
Confederation: UEFA / CONMEBOL / AFC / CAF / CONCACAF (5 options)  →  LOFISelect
Round type: Group / Knockout  (2 options)             →  LOFIRadio
```

### View mode / scenario switching (affects the whole surface)

Always use **`LOFIToggle`**. Toggle is a segmented control for switching the
active view, mode, or scenario — not for entering a value. The label of each
segment describes the current rendered state, not an abstract category.

```
Placeholders / Finished         →  LOFIToggle
Grid view / List view           →  LOFIToggle
Pre-match / In-game / Post-match →  LOFIToggle (3 segments, acceptable)
```

Do **not** use Toggle for data entry. If a value is being _stored_ on a record,
use Radio or Select. Toggle is for the prototype's rendering state.

### Quick decision tree

```
Is it a single on/off setting?
  → LOFISwitch

Are multiple options independently toggleable?
  → LOFICheckbox (one per option, grouped in LOFIFieldset)

Is exactly one option chosen from a fixed list?
  → 2–3 options  →  LOFIRadio
  → 4+ options   →  LOFISelect

Is it switching the active view or mode of the current surface?
  → LOFIToggle
```

---

## Composition patterns

### Modal form

A standard create/edit dialog:

```tsx
<LOFIModal open={open} onClose={close} title="Edit Record"
       footer={<><LOFIButton variant="dismiss" onClick={close}>Cancel</LOFIButton>
                 <LOFIButton variant="primary" type="submit">Save</LOFIButton></>}>
  <LOFIFieldset legend="General">
    <LOFIField label="Name" htmlFor="name">
      <LOFIInput id="name" value={name} onChange={setName} />
    </LOFIField>
    <LOFIField label="Type">
      <LOFISelect value={type} onChange={setType} options={typeOptions} />
    </LOFIField>
  </LOFIFieldset>
  <LOFIFieldset legend="Options">
    <LOFIField label="Active" inline>
      <LOFISwitch checked={active} onChange={setActive} label="Active" />
    </LOFIField>
    <LOFIField label="Visibility">
      <LOFIRadio value={mode} onChange={setMode} name="mode" options={modeOptions} />
    </LOFIField>
  </LOFIFieldset>
</LOFIModal>
```

### Editable table

A `LOFITable` with inline controls in cells:

```tsx
const columns: ColumnDef<Row>[] = [
  { accessorKey: 'round', header: 'Cup Round',
    cell: ({ row }) => <LOFIInput size="compact" value={row.original.round} onChange={...} /> },
  { accessorKey: 'type',  header: 'Matchup',
    cell: ({ row }) => <LOFISelect size="compact" value={row.original.type}
                               onChange={...} options={matchupOptions} /> },
  { accessorKey: 'active', header: 'Active',
    cell: ({ row }) => <LOFISwitch checked={row.original.active} onChange={...} label="" /> },
];
<LOFITable columns={columns} rows={rows} />
```

### Data table column layout

`LOFITable` maps TanStack column widths to the DOM via three roles. Use `TableColumnMeta` (exported from `lofi-kit`) in `ColumnDef.meta` to declare the role.

| Role | Column def | CSS result | When to use |
|---|---|---|---|
| Fixed | `size: N` | `<th style="width: Npx">` | IDs, badges, timestamps, short codes — bounded, predictable content. |
| Shrink | `meta: { shrink: true }` | `width: 1%` + `white-space: nowrap` | Action clusters and checkbox columns. Column wraps tightly to its content; never steals space from name columns. |
| Fluid | _(no `size`, no `meta.shrink`)_ | `min-width: 0` | The primary entity or name column. One fluid column per table is recommended; it absorbs all remaining width. |

**Convention:** the entity / name column should always be fluid. All other columns should be fixed or shrink.

```tsx
import type { ColumnDef, TableColumnMeta } from 'lofi-kit';

const columns: ColumnDef<Row>[] = [
  { accessorKey: 'id',     header: 'ID',      size: 100 },              // fixed
  { accessorKey: 'name',   header: 'Name' },                            // fluid — takes remaining width
  { accessorKey: 'status', header: 'Status',
    meta: { shrink: true } satisfies TableColumnMeta },                  // shrink — badge
  { id: 'actions',         header: 'Actions',
    meta: { shrink: true } satisfies TableColumnMeta },                  // shrink — button group
];
```

### Stateful row action (Map / Mapped / Unmap) — P2.2

Use `LOFIStatefulButton` for **P2.2** row actions whose label and interactivity change across states (see [UX_PATTERNS.md § P2.2](UX_PATTERNS.md) for the full row-actions rules; async sequencing is **P3**). Compose with a separate `LOFIButton` for the reverse action (Unmap / Undo):

```
idle ──onClick──▶ loading ──async done──▶ success (disabled)
                                               │
                                         [Unmap button]
                                               │
                                           ◀── idle
```

```tsx
import { LOFIStatefulButton, LOFIButton } from 'lofi-kit';
import type { StatefulButtonState } from 'lofi-kit';

const mapState: StatefulButtonState = loadingIds.has(item.id)
  ? 'loading'
  : item.status === 'mapped'
    ? 'success'
    : 'idle';

<span className="component__actions">
  <LOFIStatefulButton
    state={mapState}
    idleLabel="Map"
    successLabel="Mapped"
    loadingLabel="Working"
    size="compact"
    onClick={() => startMap(item.id)}
  />
  {item.status === 'mapped' && (
    <LOFIButton variant="dismiss" size="compact" onClick={() => startUnmap(item.id)}>
      Unmap
    </LOFIButton>
  )}
</span>
```

### Canvas toolbar

The toolbar composes Steps and Toggle for a bracket-canvas header:

```tsx
<LOFIToolbar
  left={<><LOFIBadge variant="tag" label={tournament.sport} />
          <LOFIText as="h1" variant="body">{tournament.name}</LOFIText></>}
  center={<LOFISteps items={[
    { label: '1. Structure setup', state: 'muted', onClick: goBack },
    { label: '2. Bracket view',    state: 'active' },
  ]} />}
  right={<><LOFIToggle value={scenario} onChange={setScenario}
                   options={[{ value: 'placeholders', label: 'Placeholders' },
                             { value: 'finished',     label: 'Finished' }]}
                   ariaLabel="Scenario" />
           <LOFIButton onClick={addProgression}>+ Add Progression</LOFIButton></>}
/>
```

### Match card layout

A match card inside a bracket node:

```tsx
<LOFICard title={match.shortLabel}
      footer={<><LOFIBadge variant="id" label={displayId} />
                <LOFIText variant="muted">{winner ?? 'TBD'}</LOFIText></>}>
  <LOFIBadge variant="status" active={match.status !== 'SCHEDULED'}
         label={STATUS_LABEL[match.status]}
         onClick={() => advanceStatus(match.id)} />
  <LOFIText variant="sm">HOME: {teamA}</LOFIText>
  <LOFIText variant="sm">AWAY: {teamB}</LOFIText>
</LOFICard>
```

### Confirmation pattern

Inline delete confirmation (not a dedicated component — use state toggle):

```tsx
{confirming
  ? <>
      <LOFIText variant="sm">Delete this item?</LOFIText>
      <LOFIButton variant="primary" size="compact" onClick={doDelete}>Yes</LOFIButton>
      <LOFIButton variant="dismiss" size="compact" onClick={() => setConfirming(false)}>No</LOFIButton>
    </>
  : <LOFIButton variant="dismiss" size="compact" onClick={() => setConfirming(true)}>Delete</LOFIButton>
}
```

### Preview / summary box

A read-only dashed-border summary (use `LOFICard` with `empty`):

```tsx
<LOFICard empty>
  <LOFIText variant="muted">{previewText}</LOFIText>
</LOFICard>
```

### Toast feedback

Show a non-blocking notification after a completed action (save, delete, import).
Pair with the Save Feedback flow pattern in `UX_PATTERNS.md`.

```tsx
const [toast, setToast] = useState<{ severity: string; message: string } | null>(null);

async function handleSave() {
  await save(data);
  setToast({ severity: 'success', message: 'Team saved.' });
}

// Render at root level — never nested inside modals or panels
{toast && (
  <LOFIToast
    severity={toast.severity}
    message={toast.message}
    autoDismiss={3000}
    onDismiss={() => setToast(null)}
  />
)}
```

Severity rules: `success` → solid border + `✓`; `warning` → dashed border + `⚠`; `error` → 2px solid + `✕`.

### Inline alert

Embed a persistent contextual message inside a form, table section, or panel.
For **form-level errors**, place directly above the submit button.
For **field-level errors**, place inside the `LOFIField` after the control.

```tsx
// Form-level error above submit
<form onSubmit={handleSubmit}>
  <LOFIFieldset legend="Team details">
    <LOFIField label="Name" htmlFor="name">
      <LOFIInput id="name" value={name} onChange={setName} />
    </LOFIField>
  </LOFIFieldset>
  {formError && (
    <LOFIInlineAlert
      severity="error"
      title="Validation error"
      message={formError}
      onDismiss={() => setFormError(null)}
    />
  )}
  <LOFIButton variant="primary" type="submit" disabled={!!formError}>Save</LOFIButton>
</form>

// Unsaved-changes warning — non-dismissible (omit onDismiss)
{isDirty && (
  <LOFIInlineAlert
    severity="warning"
    title="Unsaved changes"
    message="This record has been edited but not yet saved."
  />
)}
```

### Empty state

Always provide an empty state when a table, card, or panel has no data to show.
Choose the `variant` based on context:

- `first-use` — no records exist yet; the primary create action is the next step
- `no-results` — records exist but the current filter/search returns none; CTA clears filters
- `error` — data load failed; CTA retries

#### First-use empty state in a table (P2.1 rule 5)

For tables, the **first-use** empty state must show stable chrome — toolbar, column
headers, and an informational message — so the operator understands the interface
structure before any data exists. Use `LOFITable` with `emptySlot` to keep headers
visible while placing `LOFIEmptyState` inside the body:

```tsx
{/* Toolbar: search + Search disabled; primary Add action enabled */}
<LOFIToolbar
  left={
    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
      <span style={{ maxWidth: 200 }}>
        <LOFIInput value="" onChange={() => {}} placeholder="Search…" allowClear disabled />
      </span>
      <LOFIButton variant="default" disabled>Search</LOFIButton>
    </span>
  }
  right={<LOFIButton variant="primary">+ Add team</LOFIButton>}
/>
{/* Informational message */}
<LOFIInlineAlert
  severity="info"
  title="No teams yet"
  message="Use '+ Add team' to create the first one."
/>
{/* Table with headers visible; body holds LOFIEmptyState via emptySlot */}
<LOFITable
  columns={columns}
  rows={[]}
  sortable
  emptySlot={
    <LOFIEmptyState
      variant="first-use"
      title="No teams yet"
      description="Add your first team to get started."
    />
  }
/>
```

> **Note:** Do not add the primary create CTA inside `LOFIEmptyState` in this layout —
> the toolbar already carries it. Avoid two competing primary buttons on the same surface.

The `emptySlot` prop renders inside the table's empty `<td>` with `table__empty--slot`
modifier applied, removing italic/ghost text styling so `LOFIEmptyState` renders correctly.

#### Empty state in a card (not a table)

```tsx
<LOFICard title="Teams">
  {teams.length === 0 ? (
    <LOFIEmptyState
      variant="first-use"
      title="No teams yet"
      description="Add your first team to get started."
      action={<LOFIButton variant="primary" onClick={openCreate}>+ Add team</LOFIButton>}
    />
  ) : (
    <LOFITable columns={columns} rows={teams} />
  )}
</LOFICard>
```

The container's dashed border (visual rule: dashed = incomplete/empty) is handled by the `LOFIEmptyState` component — do not add an extra `LOFICard empty` wrapper.

### Textarea in a form (`LOFITextarea`)

Use for any text attribute that is expected to be longer than a single line
(notes, descriptions, incident summaries, scout annotations).
Always wrap in `LOFIField` for label binding — the same as `LOFIInput`.

```tsx
<LOFIField label="Notes" htmlFor="notes" hint="Optional context about this team.">
  <LOFITextarea
    id="notes"
    value={notes}
    onChange={setNotes}
    rows={4}
    placeholder="Add notes…"
  />
</LOFIField>
```

### Field clear affordance (`allowClear`)

`LOFIInput`, `LOFISelect`, and `LOFITextarea` each accept an `allowClear` prop
that renders a ✕ button when the field has a non-empty value. Clicking the button
calls `onChange('')`, returning the control to its empty / placeholder state.

**When to use it:**

- Filter query row fields — lets the operator reset one dimension without hitting the
  row-level **Reset** button.
- Any optional form field where erasing the whole value in one click improves flow.

**Do not use on required fields** where an empty value is invalid.

```tsx
<LOFIField label="Search" htmlFor="q">
  <LOFIInput id="q" value={query} onChange={setQuery} placeholder="Search…" allowClear />
</LOFIField>

<LOFIField label="Status" inline>
  <LOFISelect value={status} onChange={setStatus} options={statusOptions} placeholder="All statuses" allowClear />
</LOFIField>
```

### Section switching in modals / panels (`LOFIToggle` vs `LOFITabs`)

**Default in demos and child interfaces:** use **`LOFIToggle`** — a segmented
button group — to switch between a few exclusive body sections (e.g. "Team Info /
Players").

**Use `LOFITabs`** when the prototype must read as a real tab strip: baseline +
thick active underline, optional badges (counts), icons, disabled tabs,
or many parallel named sections (e.g. feature editor: General → … → Change log).

**`LOFISteps` (stepper)** stays only for sequential flows where step 2 cannot
be read the same as step 1 (wizard progress) — not interchangeable with `LOFIToggle`.

```tsx
// Compact modal sections (LOFIToggle):
<LOFIToggle
  value={activeSection}
  onChange={setActiveSection}
  options={[
    { value: 'info', label: 'Team Info' },
    { value: 'players', label: 'Players' },
  ]}
  ariaLabel="Modal section"
/>

// Feature editor with tab chrome (LOFITabs):
<LOFITabs
  value={activeTab}
  onChange={setActiveTab}
  tabs={[
    { value: 'details',  label: 'Details' },
    { value: 'players',  label: 'Players', badge: '18', badgeVariant: 'id' },
    { value: 'history',  label: 'History' },
  ]}
  ariaLabel="Team sections"
/>
```

Do **not** use `LOFITabs` for sequential steps — use `LOFISteps`.
Do **not** use `LOFITabs` for mode switching (grid/list, scenario A/B) — use `LOFIToggle`.
Do **not** use `LOFISteps` as a segmented control inside child panels — reserve it for wizard chrome.

### Paginated table (`LOFIPagination`)

```tsx
const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 25 });

const table = useReactTable({
  data, columns,
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  state: { pagination },
  onPaginationChange: setPagination,
});

<LOFITable columns={columns} rows={table.getRowModel().rows} />
<LOFIPagination
  page={pagination.pageIndex + 1}
  pageCount={table.getPageCount()}
  total={data.length}
  pageSize={pagination.pageSize}
  pageSizeOptions={[10, 25, 50, 100]}
  onPageChange={(p) => setPagination(prev => ({ ...prev, pageIndex: p - 1 }))}
  onPageSizeChange={(size) => setPagination({ pageIndex: 0, pageSize: size })}
/>
```

### Filter bar + table controls _(backlog: `LOFIFilterBar`)_

```tsx
<div className="data-view">
  <LOFIToolbar
    left={<LOFIInput placeholder="Search…" value={search} onChange={setSearch} />}
    right={<LOFISelect value={statusFilter} onChange={setStatusFilter} options={statusOptions} />}
  />
  {activeFilters.length > 0 && (
    <LOFIFilterBar
      resultCount={filteredRows.length}
      filters={activeFilters.map(f => ({ label: f.label, onRemove: () => removeFilter(f.key) }))}
      onClearAll={clearAllFilters}
    />
  )}
  <LOFITable columns={columns} rows={filteredRows} />
</div>
```

### Progress bar _(backlog: `LOFIProgressBar`)_

Use for determinate async operations where the completion percentage is known — bulk imports, data sync, fixture generation. Distinct from `LOFILoader`, which is indeterminate.

```tsx
{importing && (
  <>
    <LOFIText variant="sm">{importStatus}</LOFIText>
    <LOFIProgressBar value={importProgress} label={`Importing fixtures… ${importProgress}%`} />
  </>
)}
```

---

## Unified Production Landscape (UPL) — composition patterns

> **See also:** [`UX_PATTERNS.md` — P1: Workspace](UX_PATTERNS.md) — full behavioural rules for the UPL structural shell and its sub-regions.

The **Unified Production Landscape** is an umbrella product pattern that groups
related operator interfaces under one consistent hierarchical shell. It is not
a single component — it is a set of composition rules and two shell primitives
(`LOFIMainWorkspace`, `LOFINavTree`) that reduce per-demo reinvention
of the same structural skeleton.

Behaviour rules → **[`UX_PATTERNS.md` — P1: Workspace](UX_PATTERNS.md)**

### Composition vs new widget

| Concern | Resolution |
|---------|-----------|
| Upper bar chrome, filter query row, breadcrumb segments, sticky footer buttons, sidebar collapse toggle | **Composition** — assembled from existing primitives in demo SCSS + BEM; no new kit export needed. |
| Main interface view (stable pane with scrollable body, tab strip, sticky footer) | **`LOFIMainWorkspace`** — one BEM root encodes the structural contract across UPL demos. |
| Hierarchical sidebar navigation | **`LOFINavTree`** — expand/collapse tree; uses Radix Collapsible internally. |

### Region order

A UPL screen reads top-to-bottom as follows. Not every region is required on every screen.

```
┌─────────────────────────────────────────────────────┐
│  UPPER BAR (LOFIToolbar)                            │  identity + global actions
│  [logo placeholder]  Interface name   [Apps][Cfg][User]│
├─────────────────────────────────────────────────────┤
│  MODULE CONTEXT STRIP (LOFITabs / LOFIToolbar)      │  e.g. "Tournaments" tab
├─────────────────────────────────────────────────────┤
│  FILTER QUERY ROW (composition: LOFIField + controls)│  Sport ▼  Category ▼  [Search] Reset
├────────────────┬────────────────────────────────────┤
│ SIDEBAR        │ MAIN INTERFACE VIEW                │
│ LOFINavTree    │ LOFIMainWorkspace                   │
│ _(backlog)_    │  breadcrumb                        │
│                │  Entity title  [BADGE]             │
│ ▼ Soccer       │  [ Tab1 ] [ Tab2 ] [ Tab3 ]        │
│   ▼ Intl Clubs │  ─────────────────────────────     │
│     ▼ UCL      │  (feature interface body)          │
│       └─ KO ◀ │  form / table / editor             │
│                │  ─────────────────────────────     │
│                │  [ Reset changes ] [ Save changes ]│  sticky footer
└────────────────┴────────────────────────────────────┘
```

### Upper bar / information view

```tsx
<LOFIToolbar
  left={
    <>
      <span className="upl__logo-placeholder" aria-label="Company logo" />
      <LOFIText as="span" variant="body">Unified Production Landscape</LOFIText>
      <LOFIText as="span" variant="muted"> | Events &amp; Competitors</LOFIText>
    </>
  }
  right={
    <>
      <LOFIButton variant="dismiss">Applications ▼</LOFIButton>
      <LOFIButton variant="dismiss">⚙ Configuration</LOFIButton>
      <LOFIText variant="muted">m.smith</LOFIText>
      <LOFIBadge variant="tag" label="Admin" />
    </>
  }
/>
```

The logo placeholder is a `$color-border`-bordered box with no fill — sized to `$space-8 × $space-6`. Never use colour or real brand assets in a lofi-kit prototype.

### Module context strip (optional)

When the UPL groups multiple modules (e.g. Events / Competitors / Venues), add a secondary `LOFITabs` strip directly below the upper bar:

```tsx
<LOFITabs
  value={activeModule}
  onChange={setActiveModule}
  tabs={[
    { value: 'tournaments',  label: 'Tournaments' },
    { value: 'competitors',  label: 'Competitors' },
    { value: 'venues',       label: 'Venues' },
  ]}
/>
```

### Filter query row

The filter query row is the horizontal band where operators enter search criteria before triggering a query. It is a composition of existing primitives. The row ends with an explicit **Search** button (applies the criteria) and a **Reset** button (clears all fields and dependent state).

```tsx
<div className="upl__filter-row">
  <LOFIField label="Tournament ID" inline>
    <LOFIInput value={tournamentId} onChange={setTournamentId} placeholder="Unique ID" allowClear />
  </LOFIField>
  <LOFIField label="Sport" inline>
    <LOFISelect value={sport} onChange={setSport} options={sportOptions} placeholder="All sports" allowClear />
  </LOFIField>
  <LOFIField label="From date" inline>
    <LOFIInput type="date" value={fromDate} onChange={setFromDate} allowClear />
  </LOFIField>
  <LOFIButton variant="primary" onClick={runSearch}>Search</LOFIButton>
  <LOFIButton variant="dismiss" onClick={resetFilters}>Reset</LOFIButton>
</div>

{activeFilters.length > 0 && (
  <LOFIFilterBar
    resultCount={results.length}
    filters={activeFilters.map(f => ({ label: f.label, onRemove: () => remove(f.key) }))}
    onClearAll={clearAll}
  />
)}
```

| Layer | Component | When |
|-------|-----------|------|
| **Query row** | Composition (`LOFIField` + `LOFISelect`/`LOFIInput` + `LOFIButton`) | Always visible; operator enters criteria; Search/Reset at end |
| **Active-filter summary** | `LOFIFilterBar` _(backlog)_ | Appears **only** after a search runs; shows applied chips + result count |

### Sidebar — collapsible + tree navigation

```tsx
<LOFINavTree
  items={treeData}
  selectedId={selectedId}
  onSelect={setSelectedId}
/>
```

> **Implementation note:** `LOFINavTree` uses `@radix-ui/react-collapsible` internally. This dependency is bundled into `lofi-kit.js`. Demos must not import Radix directly.

The sidebar content is gated by the filter query row. See `UX_PATTERNS.md` — P1.2.1 (Filter Row) and P1.2.2 (Sidebar) for the behavioural rules.

### Main interface view

`LOFIMainWorkspace` is the standard frame for every UPL feature interface.

#### Zone summary

| Zone | Prop | Rule |
|------|------|------|
| Breadcrumb | `breadcrumb` | Always present — anchors the entity path. Use `LOFIText variant="muted"` segments separated by `›`. |
| Title | `title` (string) | Always present — entity or page name. |
| Title badges | `titleBadges` | Include when a status or type label clarifies the entity. Use `LOFIBadge`. |
| Tab strip | `tabs` | Include when the surface has two or more named parallel sections. Use `LOFITabs`. |
| Scrollable body | `children` | Always present — the feature interface itself. |
| Sticky footer | `footer` | Edit surfaces only. Contains `LOFIButton dismiss` (Reset) + `LOFIButton primary` (Save). Omit for read-only views. |

#### When NOT to use `LOFIMainWorkspace`

| Instead of... | Use |
|---|---|
| Blocking overlay for create/edit | `LOFIModal` |
| Row-adjacent contextual detail | `LOFIPanel` |
| Free-form content block | `LOFICard` |

#### Footer rules

The workspace footer follows the same P6 (Inline Validation) and P7 (Confirmation Dialog) rules as a modal footer for gating and reset — no exceptions. Transient save/reset outcomes use **P4** toasts.

```tsx
<LOFIMainWorkspace
  breadcrumb={
    <>
      <LOFIText variant="muted" as="span">International Clubs</LOFIText>
      <LOFIText variant="muted" as="span"> › Champions League</LOFIText>
    </>
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
      <LOFIButton variant="primary" onClick={saveChanges} disabled={!isDirty}>Save changes</LOFIButton>
    </>
  }
>
  {activeTab === 'admin'       && <TournamentAdminForm />}
  {activeTab === 'competitors' && <LOFITable columns={competitorCols} rows={competitors} />}
  {activeTab === 'matches'     && <LOFITable columns={matchCols} rows={matches} />}
</LOFIMainWorkspace>
```

### Feature interface body — form editor

The scrollable body of `LOFIMainWorkspace` typically contains `LOFIFieldset` sections. Two-column layout is acceptable at the demo SCSS level:

```tsx
<div className="feature-form feature-form--two-col">
  <LOFIFieldset legend="General">
    <LOFIField label="Display name" htmlFor="display-name">
      <LOFIInput id="display-name" value={name} onChange={setName} />
    </LOFIField>
    <LOFIField label="Simple Tournament" htmlFor="simple-tournament">
      <LOFISelect id="simple-tournament" value={st} onChange={setSt} options={stOptions} />
    </LOFIField>
  </LOFIFieldset>

  <LOFIFieldset legend="Settings">
    <LOFIField label="Completed" inline>
      <LOFISwitch checked={completed} onChange={setCompleted} label="Completed" />
    </LOFIField>
    <LOFIField label="Scheduled" inline>
      <LOFISwitch checked={scheduled} onChange={setScheduled} label="Scheduled" />
    </LOFIField>
  </LOFIFieldset>
</div>
```

### Switch grid

When several named boolean settings appear together, group them inside a `LOFIFieldset` and lay them out as a CSS grid at the demo level. Do **not** use `LOFIToggle` for this — each switch is an independent on/off setting.

```tsx
<LOFIFieldset legend="Match settings">
  <div className="switch-grid">
    <LOFIField label="Placeholder matches" inline>
      <LOFISwitch checked={placeholders} onChange={setPlaceholders} label="Placeholder matches" />
    </LOFIField>
    <LOFIField label="Neutral ground" inline>
      <LOFISwitch checked={neutral} onChange={setNeutral} label="Neutral ground" />
    </LOFIField>
  </div>
</LOFIFieldset>
```

### Table + sidebar variant

When the main interface body is a data table rather than a form editor, slot `LOFITable` directly as the workspace children:

```tsx
<LOFIMainWorkspace
  breadcrumb={<LOFIText variant="muted">Competitors</LOFIText>}
  title="UEFA Champions League 24/25 — Competitor list"
  tabs={competitorTabs}
  footer={<LOFIButton variant="primary" onClick={openAddCompetitor}>+ Add competitor</LOFIButton>}
>
  <LOFITable columns={cols} rows={rows} />
  <LOFIPagination page={page} pageCount={pageCount} total={total} onPageChange={setPage} pageSize={25} />
</LOFIMainWorkspace>
```

### Mock field descriptors (config-driven form pattern)

In production systems, forms like the feature interface body are driven by a backend-supplied descriptor. Demos can mirror this concept with a typed field descriptor and a small switch renderer.

> **Industry terms:** schema-driven UI, declarative UI, metadata-driven forms. Sportradar's internal implementation is **Common Lib**, an abstraction over Podium. Transformer Patterns is a lo-fi parallel for prototyping — not a replacement.

```ts
// types/fields.ts — discriminated union, one member per control type
type FieldDescriptor =
  | { type: 'text';     name: string; label: string; value: string;  onChange: (v: string) => void }
  | { type: 'textarea'; name: string; label: string; value: string;  onChange: (v: string) => void; rows?: number }
  | { type: 'select';   name: string; label: string; value: string;  onChange: (v: string) => void; options: SelectOption[] }
  | { type: 'switch';   name: string; label: string; checked: boolean; onChange: (v: boolean) => void }
  | { type: 'checkbox'; name: string; label: string; checked: boolean; onChange: (v: boolean) => void };
```

Keep `FieldFromDescriptor` in the demo's `src/components/` folder — it is not a lofi-kit primitive.

---

*Companion files: [`LOFI_KIT_PATTERNS.md`](LOFI_KIT_PATTERNS.md) · [`NL_COMPONENT_MAPPING_LO_FI.md`](NL_COMPONENT_MAPPING_LO_FI.md) · [`NL_COMPONENT_MAPPING_HI_FI.md`](NL_COMPONENT_MAPPING_HI_FI.md) · [`UX_PATTERNS.md`](UX_PATTERNS.md)*
