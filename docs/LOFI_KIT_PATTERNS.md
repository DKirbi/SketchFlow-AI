# lofi-kit — component reference

**LOFI Kit** is a low-fidelity design tool: a grayscale, monospace component
library for fast prototyping. It is used alongside **Transformers Patterns** when
building lo-fi prototypes. It is **not** the production design system —
production UIs use **Podium** (the high-fidelity design system).

UI primitives are exported with a **`LOFI` prefix** (e.g. `LOFIButton`,
`LOFIModal`). If a primitive is missing, add it to `lib/src/ui/` first (see
"Adding a new component" below).

---

## Companion documentation

| File | Contents |
|------|----------|
| [`COMPOSITION_PATTERNS.md`](COMPOSITION_PATTERNS.md) | Control selection rules, composition recipes (modal form, tables, UPL), filter query row, sidebar, `LOFIMainWorkspace`. Required reading when building a prototype. |
| [`NL_COMPONENT_MAPPING_LO_FI.md`](NL_COMPONENT_MAPPING_LO_FI.md) | Signal phrase → LOFI / `lofi-kit` lookup. Use when translating a prose brief into a lo-fi component list. |
| [`NL_COMPONENT_MAPPING_HI_FI.md`](NL_COMPONENT_MAPPING_HI_FI.md) | Signal phrase → Podium / Mantine starting map; use with Podium MCP for hi-fi work (`/high-fidelity`). |
| [`UX_PATTERNS.md`](UX_PATTERNS.md) | P1–P10 interaction behaviour: P1 = Workspace structural shell (UPL), P2–P10 = data table, stateful button, toast notification messages, modal, inline validation, confirmation, tab navigation, filters, sticky disclosure while scrolling. |
| [`LOFI_BLOCKS.md`](LOFI_BLOCKS.md) | One-line component quick-reference table. |

---

## Visual rules (strict)

1. **Monochrome** — `#111` ink on `#fff` paper. Grays from `_tokens.scss` for borders,
   backgrounds, and muted text. No color ramp.
2. **Monospace** — `Courier New, Courier, monospace` everywhere. The `LOFIText`
   component enforces this.
3. **Square corners** — `$radius-none` on all surfaces except `Badge` and `Steps`
   (pill radius for chip shapes).
4. **Three button roles** — `primary` (black fill), `default` (outlined),
   `dismiss` (ghost/text).
5. **Dashed = incomplete** — Dashed borders signal inactive, pending, or
   work-in-progress states.
6. **Unicode icons only** — `✕ + − ▶ ▼ ✎ ✓ ↑ ↓ → ↗ ⚙ ℹ`
7. **Paper-prototype test** — if the screen reads in grayscale print, it fits.

---

## Token reference (`lib/src/styles/_tokens.scss`)

### Typography

| Token | Value |
|-------|-------|
| `$text-font-family` | `'Courier New', Courier, monospace` |
| `$font-size-micro` | 9 px |
| `$font-size-xs` | 10 px |
| `$font-size-sm` | 11 px |
| `$font-size-base` | 13 px |
| `$font-size-md` | 16 px |

### Color

| Token | Hex |
|-------|-----|
| `$color-ink` | `#111` |
| `$color-paper` | `#fff` |
| `$color-ink-muted` | `#666` |
| `$color-ink-subtle` | `#888` |
| `$color-ink-ghost` | `#aaa` |
| `$color-border` | `#bbb` |
| `$color-border-subtle` | `#ddd` |
| `$color-surface` | `#fafafa` |
| `$color-overlay` | `rgba(0,0,0,0.35)` |

### Spacing

`$space-1` (2 px) through `$space-16` (32 px), even increments.

### Shadow

| Token | Value |
|-------|-------|
| `$shadow-sm` | `2px 2px 0 $color-border` |
| `$shadow-md` | `4px 4px 0 $color-border` |
| `$shadow-lg` | `6px 6px 0 $color-ink-ghost` |

---

## Component catalog (18 primitives)

### Layout

| Export | BEM root | When to use |
|-----------|----------|-------------|
| **LOFIToolbar** | `toolbar` | Top-level horizontal bar — left / centre / right slots. Use for app chrome, step navigation headers. |
| **LOFICard** | `card` | Bordered content block. Optional `title`, `footer`, `empty` state. Use for any self-contained unit (bracket node, match card, preview). |
| **LOFIPanel** | `panel` | Anchored side panel. No overlay. Use near a row or node for contextual detail. |
| **LOFIModal** | `modal` | Overlay dialog. Backdrop dismiss + Escape. Sizes: `default`, `wide`. |
| **LOFIFieldset** | `fieldset` | Bordered group with `legend`. Use inside forms/modals for section grouping. |
| **LOFIField** | `field` | Label + control wrapper. `inline` for side-by-side. `hint` for helper text. |
| **LOFINavTree** | `nav-tree` | Hierarchical sidebar navigation — expand/collapse branches (Radix Collapsible, bundled), single-leaf selection. |
| **LOFIMainWorkspace** | `main-workspace` | UPL main pane — breadcrumb, title + badges, optional tabs, scrollable body, sticky footer. |

### Controls

| Export | BEM root | When to use |
|-----------|----------|-------------|
| **LOFIButton** | `btn` | Any action. Variants: `primary`, `default`, `dismiss`. Sizes: `default`, `small`, `compact`. |
| **LOFIInput** | `input` | Single-line text entry. Sizes: `default`, `compact`. Types: `text`, `number`, `email`, `search`, `password`, `date`. Pass `allowClear` to show a ✕ button when the field has a value. |
| **LOFITextarea** | `textarea` | Multi-line resizable text entry (notes, descriptions). Sizes: `default`, `compact`. Pass `allowClear` to show a top-right ✕ button. Wrap in `LOFIField` like `LOFIInput`. |
| **LOFISelect** | `select` | Dropdown for a fixed option set. Use when options exceed 3 items or space is constrained. Sizes: `default`, `compact`. Pass `allowClear` to replace the chevron with a ✕ button when a value is selected. |
| **LOFISwitch** | `switch` | Single boolean on/off toggle. Use for enabling or disabling a named setting or feature. Always has a visible label. |
| **LOFICheckbox** | `checkbox` | Multi-select from a fixed set. Use when 2 or more independent options can each be on or off. Sizes: `default` (30x30) and `sm` (20x20). |
| **LOFIRadio** | `radio-group` | Mutually exclusive choice from a fixed set of 2–3 options shown in full. Use when all options should be visible simultaneously. Layout: `row`, `column`; sizes: `default` (30x30) and `sm` (20x20). |
| **LOFIToggle** | `toggle` | Segmented control for switching **mode or scenario** on a surface (e.g. "Grid / List"). Use `LOFITabs` for **named parallel sections** (e.g. General / Changelog) instead. |

### Data & typography

| Export | BEM root | When to use |
|-----------|----------|-------------|
| **LOFITable** | `table` | Dense data list (TanStack Table). `sortable`, `expandable` with detail rows. |
| **LOFIPagination** | `pagination` | Footer for paginated tables: record count, prev/next, page indicator, optional page-size `LOFISelect`. Pair with TanStack pagination state. |
| **LOFISteps** | `steps` | **Sequential** step/wizard nav (order matters, past/future steps differ). States: `active`, `default`, `muted`. Use in **app chrome** for multi-step flows — not for picking sections inside a child panel (use `LOFIToggle`). |
| **LOFITabs** | `tabs` | Underline **tab strip** for named parallel views: badges, leading icons, disabled tabs. Use for shell/sub-view/editor navigation when tab affordance matters. **Inside modals/panels**, prefer **`LOFIToggle`** for simple 2–4 exclusive sections (segmented control). |
| **LOFIBadge** | `badge` | Inline chip. Variants: `status` (solid/dashed), `id` (record ref), `tag` (label). |
| **LOFIText** | `text` | Typography primitive. Variants: `body`, `sm`, `micro`, `muted`, `description`, `subtle`, `ghost`, `secondary`, `strong`, `caps`, `inherit`. |
| **LOFILoader** | `loader` | Animated ellipsis indicator. Optional `label` prefix (e.g. `Saving…`). Use for async save/loading feedback. |
| **LOFIStatefulButton** | `btn` (shared with Button) | Button whose label, variant, and interactivity change across `idle`, `loading`, and `success` states. All three states are one logical control — the `state` prop switches them; no separate buttons. **Patterns: P3, P2.2.** — **P3 async inline-workspace Save:** `idle` (`variant="primary"`, "Save changes", enabled when dirty) → `loading` (disabled, animated dots, "Saving…") → `success` (`variant="dismiss"`, "Saved", disabled). No confirmation dialog (P6) — the StatefulButton is the complete feedback mechanism. Contrast: modal saves (P4) do require P6. **P2.2 row toggle:** compact Map → Mapped; compose with a separate `LOFIButton` for Unmap / Undo. Reversible Hide/Unhide label toggles are **P3** (often `LOFIButton`, not `success`-state). |

### Diagram canvas components

React Flow canvas components — pass `nodeTypes` and `edgeTypes` from `lofi-kit` to `<ReactFlow>`.
These are **unprefixed** (no `LOFI` prefix); they are diagram helpers, not UI primitives.

| Export | BEM root | Node type key | Use when |
|---|---|---|---|
| `StepNode` | `flow-node flow-node--step` | `"step"` | Any atomic action or task in a process |
| `DecisionNode` | `flow-node flow-node--decision` | `"decision"` | Branch point — yes/no, condition, gateway |
| `MessageNode` | `flow-node flow-node--message` | `"message"` | Notification, trigger, or external event |
| `ActorNode` | `flow-node flow-node--actor` | `"actor"` | Person, team, or system that owns a step |
| `StartNode` | `flow-terminal flow-terminal--start` | `"start"` | Flow entry point (one per diagram) |
| `EndNode` | `flow-terminal flow-terminal--end` | `"end"` | Flow exit point (may have multiple) |
| `AnnotationNode` | `flow-node flow-node--annotation` | `"annotation"` | Freeform planning note, outside flow logic |
| `Edge` | `flow-edge` | `"labeled"` (edgeTypes) | Directed connection with editable condition label |

Directed and dashed edges need no custom component — set `type: 'default'` or pass `style={{ strokeDasharray: '6 3' }}` inline.

```tsx
import { edgeTypes, nodeTypes } from 'lofi-kit';

<ReactFlow nodeTypes={nodeTypes} edgeTypes={edgeTypes} nodes={nodes} edges={edges} />
```

---

## Decision guide — which component?

| Need | Use |
|------|-----|
| User triggers an action | `LOFIButton` (variant = primary / default / dismiss) |
| Async commit whose label/state changes (idle → loading → success) — inline save or row toggle | `LOFIStatefulButton` (P3 inline save, P2.2 row toggle) |
| User turns a single named setting on or off | `LOFISwitch` |
| User selects multiple independent options | `LOFICheckbox` per option, in `LOFIFieldset` |
| User picks one of 2–3 mutually exclusive options | `LOFIRadio` |
| User picks one of 4+ mutually exclusive options | `LOFISelect` |
| User switches **mode or scenario** on the surface (not named document sections) | `LOFIToggle` |
| User navigates **named parallel sections** with tab chrome (badges, icons, many tabs) | `LOFITabs` |
| User switches **a few sections** inside a modal or child panel (segmented buttons) | `LOFIToggle` |
| User navigates between sequential steps | `LOFISteps` |
| Inline label: record id | `LOFIBadge variant="id"` |
| Inline label: status | `LOFIBadge variant="status"` |
| Inline label: category / tag | `LOFIBadge variant="tag"` |
| Full-screen blocking dialog | `LOFIModal` |
| Contextual detail near content | `LOFIPanel` |
| Grouped form section with a title | `LOFIFieldset` + `LOFIField` children |
| Label + control pair | `LOFIField` |
| Dense list with sorting | `LOFITable` |
| Free-form content block | `LOFICard` |
| Top-of-page horizontal chrome | `LOFIToolbar` |
| Async operation in progress | `LOFILoader` |
| Async operation completed | `LOFIToast` |
| Zero-data state in a container | `LOFIEmptyState` |
| Multi-view navigation within a surface (named sections) | `LOFITabs` |
| Large dataset page navigation | `LOFIPagination` |
| Active filter token strip | `LOFIFilterBar` _(backlog)_ |
| Multi-line text entry | `LOFITextarea` |
| Embedded contextual alert / inline form error | `LOFIInlineAlert` |
| Determinate async progress with known percentage | `LOFIProgressBar` _(backlog)_ |
| Hierarchical sidebar navigation (UPL) | `LOFINavTree` |
| Stable main pane hosting a feature interface (UPL) | `LOFIMainWorkspace` |

---

## Adding a new component

1. Create `lib/src/ui/ComponentName/ComponentName.tsx` + `.scss`.
2. Import tokens with `@use '../../styles/tokens' as *;` in the SCSS file.
3. Follow BEM: `.component-name`, `.component-name__element`, `.component-name--modifier`.
4. Export from `lib/src/ui/index.ts` (component + types) with a **LOFI-prefixed**
   public alias (e.g. `export { Button as LOFIButton } from './Button/Button'`).
5. Add a row to the component catalog table in this file and in `docs/LOFI_BLOCKS.md`.
6. Run `npm run build:lofi` to verify.

---

## Compliance — forbidden raw HTML

Every raw HTML control under **`demos/*/src/`** must be replaced with its `lofi-kit`
equivalent. This table is the canonical mapping. If you see raw HTML in an
existing file, it is compliance debt — flag it or migrate it. Never copy the
pattern into new code.

| Raw HTML | Use instead |
|----------|-------------|
| `<button>` | `LOFIButton` (variant + size) |
| `<input>` | `LOFIInput` (inside `LOFIField`) |
| `<textarea>` | `LOFITextarea` |
| `<select>` / `<option>` | `LOFISelect` (with `options` array) |
| `<input type="checkbox">` | `LOFICheckbox` (multi-option) or `LOFISwitch` (single boolean) |
| `<input type="radio">` | `LOFIRadio` (2–3 mutually exclusive options) |
| `<input type="range">` | `LOFISelect` or `LOFIRadio` as appropriate — no range sliders |
| `<table>` / `<thead>` / `<tbody>` | `LOFITable` (TanStack columns) |
| `<fieldset>` / `<legend>` | `LOFIFieldset` |
| `<label>` + control | `LOFIField` wrapping the control |
| Raw text / `<span>` / `<p>` / `<h1>` for copy | `LOFIText` (with appropriate `variant` and `as`) |
| Custom modal overlay | `LOFIModal` |
| Custom segmented buttons | `LOFIToggle` |
| Custom step navigation | `LOFISteps` |
| Custom top bar / header | `LOFIToolbar` (left / center / right) |
| Custom tab strip | `LOFITabs` |
| Custom toast / snackbar | `LOFIToast` |
| `<nav>` / `<ul>` / `<li>` for hierarchical sidebar | `LOFINavTree` |
| Custom main pane / production frame / workspace wrapper | `LOFIMainWorkspace` |
| Inline `style={{...}}` | BEM class + SCSS with tokens |

### Self-check

Before finishing work on any `.tsx` file, verify:

1. The file imports at least one component from `lofi-kit`.
2. It contains zero raw `<button>`, `<input>`, `<select>`, `<textarea>`, or `<table>` elements.
3. All rendered copy uses `LOFIText` (no raw `<span>` or `<p>` for display text).
4. No inline `style={{}}` attributes — use BEM classes with SCSS tokens.
5. Every boolean field uses `LOFISwitch`, not `LOFICheckbox`.
6. Every multi-option exclusive field with 4+ options uses `LOFISelect`, not `LOFIRadio`.
