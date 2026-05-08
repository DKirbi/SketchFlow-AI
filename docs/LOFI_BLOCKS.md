# LOFI_BLOCKS — Component Catalog

Low Fidelity Fast Prototyping system. All components are BEM + SCSS + grayscale.
Import UI primitives from the **`lofi-kit`** npm package (`lib/` in this repo).

**Naming:** Every UI primitive is exported with a **`LOFI` prefix** (e.g. `LOFIButton`, `LOFIModal`) so consumers can co-exist with other design systems. **Diagram helpers** (`nodeTypes`, `edgeTypes`, types) keep unprefixed names. **TypeScript prop types** keep their original names (`ButtonProps`, `ModalProps`, ...).

---

Visual rules, token reference, and control selection rules -> **[LOFI_KIT_PATTERNS.md — Visual rules](LOFI_KIT_PATTERNS.md)**

---

## Surface A — Diagram canvas

React Flow canvas components. Pass `nodeTypes` and `edgeTypes` from `lofi-kit` to `<ReactFlow>`.

| Component | BEM root | Node type key | Use when |
|---|---|---|---|
| `StepNode` | `flow-node flow-node--step` | `"step"` | Any atomic action or task in a process |
| `DecisionNode` | `flow-node flow-node--decision` | `"decision"` | Branch point — yes/no, condition, gateway |
| `MessageNode` | `flow-node flow-node--message` | `"message"` | Notification, trigger, or external event |
| `ActorNode` | `flow-node flow-node--actor` | `"actor"` | Person, team, or system that owns a step |
| `StartNode` | `flow-terminal flow-terminal--start` | `"start"` | Flow entry point (one per diagram) |
| `EndNode` | `flow-terminal flow-terminal--end` | `"end"` | Flow exit point (may have multiple) |
| `AnnotationNode` | `flow-node flow-node--annotation` | `"annotation"` | Freeform planning note, outside flow logic |
| `Edge` | `flow-edge` | `"labeled"` (edgeTypes) | Directed connection with editable condition label |

Directed and dashed edges need no custom component — set `type: 'default'` or inline `style={{ strokeDasharray: '6 3' }}`.

---

## Unified Production Landscape (UPL) — quick map

The UPL is an umbrella product pattern that groups related interfaces under one
hierarchical shell. Use this map when building or documenting any UPL-style
demo; full composition rules -> **[LOFI_KIT_PATTERNS.md — Unified Production Landscape](LOFI_KIT_PATTERNS.md)**.

| UPL region | Primary component(s) | Notes |
|---|---|---|
| **Upper bar / information view** | `LOFIToolbar` (left / right slots) + `LOFIText` | Left: logo placeholder + interface/module title. Right: Applications button, Configuration link, user strip (P1.1). |
| **Module context strip** (optional) | `LOFITabs` or `LOFIToolbar` sub-row | Secondary tab row (e.g. "Tournaments") below the upper bar when multiple modules coexist. |
| **Filter query row** | `LOFIField` + `LOFIInput` / `LOFISelect` / `LOFIInput type="date"` + `LOFIButton` | Operator enters criteria (text, dropdowns, date). Ends with **Search** + **Reset** buttons. **Composition only** — not a named component. Use `allowClear` on each field for per-field resets. See LOFI_KIT_PATTERNS.md "Filter query row." |
| **Active filter summary** | `LOFIFilterBar` _(backlog)_ | Dismissible chip strip that appears **after** the query runs. Separate concern from the query row above. |
| **Sidebar (collapsible)** | `LOFINavTree` + collapse toggle | Tree nav gated by filter state; collapse preserves selection (P1.2.2). |
| **Main interface view** | `LOFIMainWorkspace` | Stable frame: breadcrumb + title + optional tabs + scrollable body + sticky footer. |
| **Feature interface body** | `LOFIFieldset`, `LOFIField`, `LOFISwitch`, `LOFITabs`, `LOFITable`, ... | Content slotted into `LOFIMainWorkspace` body. Last tab is often "Change log." |
| **Editor footer (sticky)** | `LOFIButton` (primary + dismiss) inside workspace `footer` slot | "Save changes" / "Reset changes." Same button semantics as `LOFIModal` footer (P4). |

---

## Surface B — UI Primitives

| Export (`lofi-kit`) | BEM root | Source file | Use when |
|---|---|---|---|
| `LOFIButton` | `btn` | `ui/Button` | Triggers any action. Variants: `primary`, `default`, `dismiss`. Sizes: `default`, `small`, `compact` (`small` is the default for dense row/bulk action clusters). |
| `LOFIStatefulButton` | `btn` (shared) | `ui/StatefulButton` | Button that transitions `idle -> loading -> success`. Labels, variant, and interactivity change per state — all three are one logical control. **P3** (inline workspace async save: `idle` "Save" → `loading` "Save…" → `success` "Saved" — no P7 confirmation required). **P2.2** (compact row toggle actions: Map → Mapped; compose with a separate `LOFIButton` for the Unmap/Undo reverse). Contrast: modal saves (**P5** context) still require a **P7** confirmation dialog before the async operation. Pair with **P4** toasts for save outcomes. |
| `LOFIInput` | `input` | `ui/Input` | Single-line text entry. Size: `compact` for table cells. Types include `date`. `allowClear` shows a ✕ button when value is non-empty. |
| `LOFITextarea` | `textarea` | `ui/Textarea` | Multi-line resizable text entry (notes, descriptions). Always wrap in `LOFIField`. `allowClear` shows a top-right ✕ button when value is non-empty. |
| `LOFISelect` | `select` | `ui/Select` | Dropdown for a fixed set of options. Size: `compact` for table cells. `allowClear` replaces the chevron with ✕ when a value is selected. |
| `LOFISwitch` | `switch` | `ui/Switch` | Single boolean on/off toggle. Use for enabling or disabling a named setting. Always has a visible label. |
| `LOFICheckbox` | `checkbox` | `ui/Checkbox` | Multi-select from a fixed set. Use when 2+ independent options can each be on/off. Sizes: `default` (30x30) and `sm` (20x20). |
| `LOFIRadio` | `radio-group` | `ui/Radio` | Mutually exclusive choice from a fixed set of 2-3 options shown in full. Layout: `row` or `column`; sizes: `default` (30x30) and `sm` (20x20). |
| `LOFIField` | `field` | `ui/Field` | Label + control wrapper. `inline` for side-by-side. `hint` for helper text. |
| `LOFIFieldset` | `fieldset` | `ui/Fieldset` | Bordered section grouping related fields under a legend. |
| `LOFIModal` | `modal` / `modal-overlay` | `ui/Modal` | Overlay dialog for create/edit/confirm. Size: `default` or `wide`. |
| `LOFIPanel` | `panel` | `ui/Panel` | Anchored contextual panel near a row or node. |
| `LOFIToast` | `toast` | `ui/Toast` | Transient action feedback (**P4**): default **upper-right** in prototypes; severity via border style and shared Radix feedback icons (25×25). Auto-dismissible. |
| `LOFIInlineAlert` | `inline-alert` | `ui/InlineAlert` | Persistent, contextual message embedded in a form or panel. 2px left border acts as severity indicator; same severity icons as `LOFIToast`. Use for form errors, unsaved-change warnings, locked-section notices. |
| `LOFIEmptyState` | `empty-state` | `ui/EmptyState` | Centred placeholder for tables, cards, and panels with no data. Three variants: `first-use`, `no-results`, `error`. Dashed border signals the empty state. |
| `LOFIMainWorkspace` | `main-workspace` | `ui/MainWorkspace` | UPL main pane — stable frame (breadcrumb, title + badges, optional tabs, scrollable body, sticky footer) that hosts feature interfaces. Slots don't move; only content updates. |
| `LOFINavTree` | `nav-tree` | `ui/NavTree` | Hierarchical sidebar navigation. Expand/collapse branch nodes (Radix Collapsible, bundled); single-leaf selection; optional controlled expand state. Replaces ad-hoc `<nav>/<ul>/<li>` markup (compliance debt). |
| `LOFITable` | `table` / `table-wrap` | `ui/Table` | Dense data list powered by TanStack Table. `expandable` for detail rows. `sortable` for column sorting. Set `size: N` for fixed-width columns, `meta: { shrink: true }` for action/badge columns, no size for the primary name/entity column (fluid). |
| `LOFIBadge` | `badge` | `ui/Badge` | Inline label chip. Variants: `status` (solid=active, dashed=inactive), `id` (record ref), `tag` (category). |
| `LOFISteps` | `steps` | `ui/Steps` | Step navigation strip. States: `active`, `default`, `muted`. |
| `LOFITabs` | `tabs` | `ui/Tabs` | Underline tab strip when tab affordance matters (`icon`, `badge`, `disabled`). Prefer `LOFIToggle` for simple in-modal section switches. |
| `LOFICard` | `card` | `ui/Card` | Bordered content block with optional `title`, `footer`, and `empty` state. |
| `LOFIText` | `text` | `ui/Text` | Typography primitive: Courier stack from `$text-font-family`, variants `inherit` (match parent BEM) or semantic sizes (`body`, `sm`, `micro`, `muted`, `description`, etc.). |
| `LOFIToggle` | `toggle` | `ui/Toggle` | Segmented button group — exclusive options as adjacent buttons. Scenario switches, filters, **and** switching sections inside modals/panels (default over `LOFITabs` for 2-4 segments). |
| `LOFIToolbar` | `toolbar` | `ui/Toolbar` | Horizontal bar with left / centre / right slots. Use for app-level chrome and step-navigation headers. |
| `LOFILoader` | `loader` | `ui/Loader` | Animated ellipsis indicator. Optional `label` prefix (e.g. `Saving...`). Use for async feedback on buttons and inline loading states. |
| `LOFIFeedbackSeverityIcon` | `lofi-icon` | `ui/Util/LofiRadixIcons` | Shared 25×25 severity glyph ([Radix Icons](https://www.radix-ui.com/icons)). Use with `LOFIToast`, `LOFIInlineAlert`, or any custom feedback strip — pass `severity`: `success` \| `info` \| `warning` \| `error`. |
| `LOFIDismissIcon` | `lofi-icon` | `ui/Util/LofiRadixIcons` | Shared 25×25 dismiss glyph (Radix **Cross 1**). Pair with `LOFIButton` for icon-only dismiss, same as toast / inline-alert dismiss. |

**Feedback icon mapping** (global across LOFI Kit):

| `severity` | Radix icon |
|---|---|
| `success` | Check circled |
| `info` | Info circled |
| `warning` | Cross circled |
| `error` | Exclamation triangle (attention / critical) |

---

## Natural language -> component

Full signal grammar, worked examples, and control disambiguation -> **[LOFI_KIT_PATTERNS.md — Natural language -> component mapping](LOFI_KIT_PATTERNS.md)**

Quick reference — common confusion points:

| User intent | Right component | Wrong component |
|---|---|---|
| "a toggle" for a single on/off setting | `LOFISwitch` | not `LOFIToggle` |
| "a toggle" for switching views / modes | `LOFIToggle` | not `LOFISwitch` |
| "checkboxes" for a single active/inactive flag | `LOFISwitch` | not `LOFICheckbox` |
| "a dropdown" for 2-3 exclusive options | `LOFIRadio` | not `LOFISelect` |
| "a section" in a form | `LOFIFieldset` | not `LOFICard` |
| "a section" of free-form content | `LOFICard` | not `LOFIFieldset` |
| "steps" / sequential wizard | `LOFISteps` | not `LOFITabs` |
| "tabs" / underline strip / badges on sections | `LOFITabs` | not `LOFISteps` |
| "two (or a few) sections in a modal / panel" | `LOFIToggle` | not `LOFITabs` unless tab chrome is required |
| "a tree" / "hierarchy" / "sidebar navigation" / "collapsible nav" | `LOFINavTree` | not `LOFIPanel` (row-adjacent detail only) |
| "the main production pane" / "the feature surface" / "UPL main view" | `LOFIMainWorkspace` | not `LOFICard` (no scroll/tab/footer) or `LOFIModal` (blocking) |
| "filter inputs" / "the search fields row" / "Sport, Category dropdowns + Search" | `LOFIField` + `LOFISelect`/`LOFIInput` + `LOFIButton` (composition) | not `LOFIFilterBar` — that is the chip strip shown **after** search runs |
| "active filters" / "filter chips" / "clear all filters" / "14 results strip" | `LOFIFilterBar` _(backlog)_ | not the query-input row above the table |
| "breadcrumbs" / "path trail" / "entity path" | `LOFIText` segments + separator (composition) | no separate component needed; see LOFI_KIT_PATTERNS.md "Breadcrumbs" |
| "save succeeded" / "action completed" / "transient notification" | `LOFIToast` | not `LOFIModal` (blocking) or `LOFIBadge` (persistent inline) |
| "form error" / "validation failed" / "unsaved changes warning" | `LOFIInlineAlert` | not `LOFIToast` (transient, positional) or `LOFIModal` (blocking) |
| "no data" / "empty table" / "nothing here yet" | `LOFIEmptyState` | not a blank table or an empty `LOFICard` with no message |

---

### Static GitLab Pages hub (`/`)

The repo root generator [`scripts/generate-hub.mjs`](scripts/generate-hub.mjs) builds a **plain HTML** launcher (no React) that still follows this catalog:

- **`LOFIButton`**: demo tiles use `btn btn--default`; the "New Project" slot uses `span.btn.btn--dismiss.hub__placeholder` (non-interactive) for dashed incomplete styling — no React, same BEM as `LOFIButton`.
- **`LOFIText`**: titles use `text text--caps`; labels use `text text--inherit` inside buttons; descriptions use `text text--description`; Storybook footer link uses `text text--muted`.
- **Stylesheets**: `lofi-kit.css` from `lib/dist/` (full primitive CSS) plus `hub-layout.css` compiled from [`scripts/hub-layout.scss`](scripts/hub-layout.scss) (tokens-only layout; no duplicate hex).

---

## Quick usage pattern

```tsx
// UI primitives
import {
  LOFIBadge, LOFIButton, LOFIEmptyState, LOFIField, LOFIInlineAlert, LOFIInput,
  LOFIMainWorkspace, LOFIModal, LOFISteps, LOFISwitch, LOFITable, LOFITabs,
  LOFIToast, LOFIToggle, LOFIToolbar,
} from 'lofi-kit';
// Backlog (not yet exported): LOFIFilterBar, LOFIProgressBar
import { edgeTypes, nodeTypes } from 'lofi-kit';
```

For a React Flow canvas:
```tsx
<ReactFlow nodeTypes={nodeTypes} edgeTypes={edgeTypes} nodes={nodes} edges={edges} />
```

For a form inside a modal:
```tsx
<LOFIModal open={open} onClose={close} title="Add Record" footer={<LOFIButton variant="primary" type="submit">Save</LOFIButton>}>
  <LOFIField label="Name" htmlFor="name"><LOFIInput id="name" value={name} onChange={setName} /></LOFIField>
  <LOFIField label="Status"><LOFISelect value={status} onChange={setStatus} options={statusOptions} /></LOFIField>
</LOFIModal>
```

For a toolbar with steps and toggle:
```tsx
<LOFIToolbar
  left={<LOFIText as="h1" variant="body">Tournament Name</LOFIText>}
  center={<LOFISteps items={[{ label: '1. Setup', state: 'muted', onClick: goBack },
                          { label: '2. Bracket', state: 'active' }]} />}
  right={<LOFIToggle value={scenario} onChange={setScenario} ariaLabel="Scenario"
                 options={[{ value: 'a', label: 'Option A' },
                           { value: 'b', label: 'Option B' }]} />}
/>
```

For composition patterns, decision guides, and token reference, see **[`LOFI_KIT_PATTERNS.md`](LOFI_KIT_PATTERNS.md)**.

---

## Forbidden raw HTML — use lofi-kit instead

Full compliance table and self-check -> **[LOFI_KIT_PATTERNS.md — Compliance — forbidden raw HTML](LOFI_KIT_PATTERNS.md)**

Every raw HTML control under **`demos/*/src/`** must be replaced with its `lofi-kit` equivalent.
If you see raw HTML in an existing file, it is compliance debt — flag it or migrate it. Do not copy the pattern.
