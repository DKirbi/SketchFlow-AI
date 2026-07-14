# Quick reference

Lightweight lookup tables, pattern connections, and global rules. Load when routing is resolved but you need a cheat sheet — not as a substitute for pattern-specific rules.

---

## Pattern index

| ID | Name | One-line summary |
|----|------|------------------|
| **P1** | Workspace (UPL) | Structural shell: upper bar → optional module strip → filter row → sidebar → main interface view |
| **P2** | Data table | Entity lists: structure, row actions, columns, bulk ops, expandable rows |
| **P3** | Stateful button | Async commit without P7 (idle → loading → success/error) |
| **P4** | Toast | Transient operation outcomes after async work |
| **P5** | Modal | Blocking editor/viewer; stacking limited to P7 confirm only |
| **P6** | Inline validation | Blur validation, dirty gating, field-adjacent errors |
| **P7** | Confirmation dialog | Irreversible/destructive/modal-save confirm; never generic "OK" |
| **P8** | Tab navigation | Parallel views; state persists across tab switches |
| **P9** | Filters | AND logic, debounce search, chips, sidebar coupling |
| **P10** | Sticky disclosure | Sticky parent row/header while detail scrolls |

## UI rule sections

| Section | Topic |
| ------- | ----- |
| **U0** | Imports and internal-tool baseline |
| **U1** | Buttons + feedback (`color`, `rank`, emphasis, toasts) |
| **U2** | Typography (`PdsFontSize`, text roles) |
| **U3** | Forms + inputs |
| **U4** | Overlays + navigation (modals, drawers, tabs, menus) |
| **U5** | Tables, filters, row actions |
| **U6** | Spacing (4 / 8 px grid; Mantine theme tokens) |

---

## Pattern connections (read before implementing save flows)

| Scenario | Patterns involved | Key rule |
|----------|-------------------|----------|
| Inline workspace Save (main pane footer) | P1.2.3.2, P3, P4, P6 | **No P7** before save; P3 state machine + P4 toast |
| Modal Save / Create | P5, P6, P7, P4 | **P7 required** before async; close modal + toast on success |
| Row Remove / Delete | P2.2, P7 | P7 always; destructive not most prominent in row |
| Discard unsaved changes | P1.2.3.2, P7 | Reset always confirms |
| Reversible Hide on row | P2.2, P3 | Label toggle; **no P7** |
| Filter invalidates sidebar selection | P1.2.1, P1.2.2, P9 | Clear main interface; never retain stale selection |

---

## Global interaction rules

### Confirmation

- **R1:** Irreversible/destructive actions (Remove, Delete, **bulk destructive** on a selection, Discard changes, modal-context Save/Create) require **P7** confirmation. Reversible actions (Hide) and inline-workspace saves (**P3**) do not.
- **R2:** Confirmation dialog names the action and affected entity. Never "Are you sure?"
- **R3:** Cancel in a confirmation returns to prior state with no changes.

### Loading

- **R4:** Inline-workspace Save uses **P3** stateful button (idle→loading→success) and **P4** toasts for outcomes. Modal Save/Create uses **P7** → loading state → success/error + **P4**.
- **R5:** Simulate 500ms–1.5s async delay in prototypes.
- **R6:** On success (inline) → **P4** success toast; clear dirty / hide footer when appropriate. On success (modal) → close **P5** modal **and** any stacked **P7** overlay, **P4** success toast, refresh table.
- **R7:** On error → **P4** error toast; keep context open; re-enable commit.

### Destructive

- **R8:** Inline remove always → **P7** confirmation, even when change is staged. Hide never requires **P7**.
- **R9:** Role-gated actions are **hidden** (not disabled) for unauthorised users.

### Data and mocking

- **R10:** Use real-world entity names (not "Player 1" or "Test Team").
- **R11:** User handles: `j.smith` format.
- **R12:** Timestamps: `DD MMM YYYY, HH:mm`.
- **R13:** Generate enough mock data to demonstrate all states: populated, empty, filtered/no-results, errors.

### Changelog

- **R14:** Every data mutation appends a changelog entry (append-only, newest-first, read-only).
- **R15:** Entry format: `[Action] [entity] [detail]`.

---

## When to use each colour

| Colour | When | Example |
|--------|------|---------|
| `action` | Primary action, CTA, default focus state, active indicators | Save, Confirm, Submit, focused field chrome |
| `attention` | Soft warning, caution, "needs review" indicators | "Needs review" counter, caution toast |
| `warning` | Hard error, destructive verb, error toast, validation failure | Delete button (subtle rank), error message, failed validation |
| `success` | Success state, completion, positive outcome | Success toast, "saved" state, check mark |
| `neutral` | Default text, cancel/dismiss, reversible actions, normal state | Most labels, Cancel button, Hide action, regular data |

## When to use each rank

| Rank | When | Example |
|------|------|---------|
| `fill` | One primary per cluster, highest emphasis action | Modal commit, primary form submit (only one per cluster) |
| `outline` | Secondary actions, default form fields, utility toolbars | Edit button, secondary action, filter input |
| `subtle` | Cancel/dismiss (modal footer), primary-among-ghosts (toolbar) | Cancel button beside `fill` commit, key action in dense ghost row |
| `ghost` | Back, tertiary, deprioritised, dense icon rows | Back button, deprioritised delete, most icon-only pairs |

## When to use each size

| Size | When | Example |
|------|------|---------|
| `md` | Default / canonical level | Primary buttons, form fields, most controls |
| `sm` | One level below canonical | Row actions, nested toolbars, table headers/controls |
| `xs` | Dense rows, icon-only inline controls | Icon-only table row edits, repeating chips |

---

## UX ↔ UI pairing (common flows)

| UX pattern | UI expression |
| ---------- | -------------------- |
| **P5** modal footer | `fill` + `action` commit; `subtle` + `neutral` cancel |
| **P7** destructive confirm | `fill` + `warning` confirm only here |
| **P3** inline Save | `action` + `fill`; no colour change across idle/loading/success |
| **P4** success/error toast | `success` / `warning` colour on toast |
| **P6** field error | `warning` adjacent message; focus chrome `action` |
| **P2.2** row delete | `ghost` or `subtle` + `warning` — not `fill` |
| **P9** filter chips | inactive `outline`+`neutral`; active `subtle` |
| **P10** sticky expanded row | ordinary row chrome; expansion via chevron, not new bg colour |
