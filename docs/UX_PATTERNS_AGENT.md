# UX Patterns — Agent rules (machine-optimised)

> Terse, numbered, imperative rules for LLM/coding-agent consumption.
> For full rationale, context, and UX flows see [`UX_PATTERNS.md`](UX_PATTERNS.md).
> For component implementation see [`LOFI_KIT_PATTERNS.md`](LOFI_KIT_PATTERNS.md).

---

## How to use

1. Identify which patterns apply to the feature spec.
2. Follow every numbered rule for each pattern — rules are constraints, not suggestions.
3. When in doubt about a rule, read the full explanation in [`UX_PATTERNS.md`](UX_PATTERNS.md).

---

## P1 — Workspace (UPL)

The structural shell. All UPL interfaces start here. "Workspace" is the product term; it is not a reference to a browser.

### P1.1 — UPL Shell

1. The **upper bar is always visible** — never collapses, hides, or changes based on navigation state.
2. Upper bar composition (left to right): logo placeholder (bordered box, no colour, no real brand assets) → interface name → optional subtitle → [Applications] [Configuration] [username].
3. **User identity strip** (far right of upper bar): username in `j.smith` format + role label (Operator / Supervisor / Admin). Informational only in production. In prototypes it acts as a **role switcher** — label it clearly as prototype-only.
4. A **module context strip** (tab row) below the upper bar is optional. Include it only when the interface groups multiple modules (e.g. Tournaments / Competitors / Venues). Switching modules resets filter, sidebar, and main interface.
5. Do not add colour, brand assets, or real logos to the upper bar in any lo-fi prototype.

### P1.2 — Internal Workspace

6. Below the UPL Shell the workspace contains up to three regions in fixed order: **filter row** → **sidebar** → **main interface view**. Not every region is required on every screen.

### P1.2.1 — Filter Row

7. The filter row manipulates everything below it (sidebar tree + main interface view content).
8. Filters apply AND logic — results must match every active filter simultaneously.
9. Search accepts both names and IDs. Default mode is **debounce** (300–500 ms). Use an explicit **Search** button when the backend is slow or unstable.
10. Never collapse the search input behind an icon or a toggle — it must always be visible.
11. Every non-required filter input has a ✕ clear control that clears only that field (no cascading reset).
12. A **Clear all** button at the far right of the filter row resets every active filter and all dependent state (sidebar, main interface).
13. Date / time inputs use a date picker; they can represent a single date or a date range.
14. If a filter change invalidates the current sidebar selection, **clear the main interface view** and show an empty state. Never silently retain an invalid selection.

### P1.2.2 — Sidebar

15. Sidebar content is driven by the filter row state. When filters change, the sidebar updates.
16. Leaf nodes are selectable; selecting a leaf loads the entity into the main interface view.
17. Branch nodes carry a **trailing chevron** (▶ closed, ▼ open). Leading icons are optional.
18. Items may display a **counter badge** (number of children) and an **ID label** for identification.
19. **Hierarchy level indicators** must always be present — operators must know at which level they are currently located. Use indentation, level prefix, or breadcrumb as appropriate.
20. A collapse button (◀) hides the sidebar and gives the main interface view full remaining width.
21. Collapsing does NOT trigger confirmation, reset data, or clear the selection. Expanding restores the exact tree and selection state.
22. When no leaf is selected, the main interface view shows a first-use empty state.

### P1.2.3 — Main Interface View

23. The main interface view is a persistent pane — no dismiss button; zones do not reposition when data changes.
24. Fixed zones (top to bottom): **heading bar** → **main content** (scrollable) → **footer** (sticky).

### P1.2.3.1 — Heading Bar

25. Heading bar contains: optional leading icon → naming element (title or breadcrumb) → optional badges/labels.
26. Use a **breadcrumb** when the sidebar has a hierarchy (e.g. "Soccer > Intl Youth > U20 AFC. Group C. Women (ID 180564)").
27. Breadcrumb is **interactive** only when the interface supports sidebar-linked navigation; otherwise it is a non-interactive label.
28. In **multi-pane interfaces** (e.g. Resulting), place the Save/Confirm action in the heading bar far right instead of the footer.
29. Heading bars in multi-pane layouts may be individually **collapsible**.
30. Separate the heading bar from the content area with a divider line or distinct background shade.

### P1.2.3.2 — Footer

31. Footer contains: [Reset changes] (secondary) and [Save / Confirm] (primary).
32. Save/Confirm is **disabled when the form is not dirty** or when validation fails.
33. Footer uses **P6** for the same **field-level validation and commit gating** as a modal (blur, dirty check, required marks). **Reset changes** → **P7** → revert. **Save / Confirm** here is **inline workspace** → **P3** only — **no P7** before save. Do not treat the main-pane footer like a **P5** modal footer for confirmation.
34. Reset → Confirmation Dialog (P7) → reverts all edits in current tab to last saved state.
35. **Footer Save (inline workspace):** use **P3 (Stateful Button)** flow (idle → loading → success/error) — no P7. Outcome feedback: **P4** toasts. **Modal Save/Create (P5):** Confirmation Dialog (P7) → loading state → success/close or error/keep-open.
36. In multi-pane interfaces, Save may appear in the heading bar (P1.2.3.1) instead of the footer.

### P1.2.3.3 — Main Content

37. An **internal tab strip** (optional) at the top of the content area switches parallel content sections within the current entity. Follows P8 (Tab Navigation) rules — no discard on tab switch.
38. The internal tab strip spans the full width of the content area.
39. The last internal tab is "Change log" whenever a changelog is present (append-only, read-only).
40. Content types: table (P2), form fields, or mixed fieldsets. Every data mutation generates a changelog entry.

---

## P2 — Data Table

### P2.1 — Table structure

41. Define every column from the feature spec. Do not invent columns. If the feature spec omits columns, use: entity name, ID, status, Actions.
42. Tables with ~15+ expected rows must have a persistent, visible search control above the table. Never collapse search behind an icon-only control.
43. When the search control is **not** part of a larger filter set, the toolbar shows: a bounded-width text input (max ~200px) with a ✕ clear control (visible when value non-empty) + a **Search** button immediately to the right.
44. Column headers support sorting where specified; see P2.3 for non-sortable exceptions.
45. **Empty — first-use:** show the table shell (toolbar with controls; filters/search disabled; full column headers) + an informational message. The primary create action on the toolbar stays **enabled**. Do not hide the table or leave the body blank.
46. **Empty — no-results:** show table shell + headers + message; provide a clear-filters action.
47. **Empty — error:** show table shell + headers + message; provide a retry action.
48. **Loading:** show a loading indicator inside the table body. Do not block the full page. For lazy/infinite scroll: show a blank loading row with a centred indicator at the bottom of the scroll area, or a **Load more** control when the backend or use case fits.
49. Tables may appear inside modals (P5) one level deep. A table inside a modal does not open another modal — except for a **confirmation-only** overlay (P7) triggered by a destructive or save action inside the modal.

### P2.2 — Row actions

50. Canonical row actions: **Edit**, **Remove**, **View**, **Hide**. Do not invent actions not in the feature spec.
51. Destructive actions (Remove, Delete) must not be the most prominent control in the row.
52. Destructive row actions require a confirmation dialog (P7) before executing.
53. Row actions that open an editor follow P5.
54. Reversible Hide on a row: label may switch **Hide** / **Unhide** to state the mode (**P3** label-toggle variant); no P7.
55. Role-gated actions are **hidden** (not disabled) for unauthorised users.

### P2.3 — Table column controls

56. The **Actions** column is never sortable.
57. **Multi-select column:** header = select-all master; rows = checkboxes.
58. **Single-select column:** when only one row may be selected and checkboxes are inappropriate, use radio buttons in rows; the column header is not sortable.
59. Any column where sorting provides no value (status-only, badge-only, action cells) may be declared non-sortable; omit the sort indicator.

### P2.4 — Bulk operations

60. Bulk destructive actions require a selection (P2.3 multi-select). Keep bulk-destructive controls disabled until a selection exists.
61. **Bulk import:** provide a Browse button and/or drag-and-drop zone above the table. Enable a Confirm/Upload action after files are chosen.
62. During import processing: show a **loading overlay over the table area** (semi-transparent white background, ~10% opacity). The table is inactive; block all interactions until complete.

### P2.5 — Expandable rows

63. Prefer **row expansion** for read-mostly or supplementary secondary context inline. Do **not** stack a second **P5** modal on an existing modal — use **P7**-only stacking per P5 rules.
64. When expanded detail is taller than a comfortable band: **max-height** + **scroll** on the detail body. **Expand/collapse** only on the **parent table row** (chevron / row). **Sticky** the **parent data row** in the scroll container so cells and actions stay visible — **P10**. Do **not** add a duplicate collapse strip inside the detail.

---

## P3 — Stateful Button

65. **Async commit (inline workspace Save, row Map→Mapped):** use `LOFIStatefulButton` — **no P7** before save. Sequence: `idle` (primary, "Save changes", enabled when dirty / action allowed) → `loading` (disabled, "Saving…" + dots) → `success` (dismiss, "Saved" / "Mapped", disabled). Revert-to-saved: editing back to last-persisted returns to `success` without a new save.
66. **Reversible label toggle (e.g. Hide/Unhide):** one secondary control; label **states current mode**. Use `LOFIButton` or `LOFIStatefulButton` in `idle` only; do **not** use `success` as the only reverse target — it disables clicks.
67. **Map/Mapped (P2.2):** compact `LOFIStatefulButton` + separate dismiss `LOFIButton` for Unmap.
68. On inline save **error:** return button to `idle`, show **`LOFIToast`** **error** (**P4**), keep footer visible with pending edits, re-enable Save.
69. Simulate **500ms–1.5s** delay in prototypes so loading states are visible.
70. **After P7** on a **P5** modal commit: show loading on the **confirm** control in the **P7** overlay. On **success:** close **both** the P7 overlay and the underlying **P5** modal, **P4** success toast + refresh affected data. On **error:** keep the **P5** modal open, **P4** error toast or warning per **P6** modal rules, re-enable commit.

---

## P4 — Toast notification messages

71. Use **`LOFIToast`** for transient **success**, **error**, and optional **info** after async operations — especially inline workspace **Save** / **Reset** outcomes with **P1.2.3.2 Footer** and **P3**.
72. Default placement: **upper-right** fixed layer. Auto-dismiss success toasts when the spec allows.
73. **Inline save success:** success toast; clear dirty → **hide footer** (no longer pending).
74. **Inline save failure:** error toast; **keep footer**; edits stay pending; operator retries or uses Reset (**P7**).
75. **Reset after P7 confirm:** optional success/info toast; footer hides when clean.
76. **Modal save (P5) after P7:** success → close modals + success toast; error → error toast (preferred) or inline above footer for persistent detail.
77. **P6** still owns **per-field** validation messages (`LOFIInlineAlert`). **P4** owns **operation outcomes** (saved / failed to save), not blur copy.
78. Stack or replace multiple toasts per product spec; prototypes often show one at a time.

---

## P5 — Modal

79. Three zones: **Header** (title, dismiss), **Body** (content), **Footer** (actions).
80. Tabs (if any) appear at the **top of the body content**. Use `LOFITabs` — never a segmented toggle — for modal section switching.
81. Footer: the **commit action is the rightmost** control. Cancel/dismiss is immediately to its left, secondary weight.
82. The left of the footer is rarely used; use it only for tertiary/ghost non-commit actions.
83. Primary label matches the trigger intent: Add flow → **Add**; Edit flow → **Save**; destructive → the action verb (**Remove**, **Delete**).
84. The commit button is **disabled until the form is dirty** (edit mode) or required fields pass (create mode).
85. Read-only modals: no primary commit; only a Close/Cancel to dismiss.
86. Cancel and Close dismiss without committing — same as pressing ×. Modal should respond to Escape.
87. **Wizard exception:** a Back button moves to the previous step without dismissing; Cancel sits to the **left of Back**.
88. **Edit mode:** all editable fields are **prefilled** with current saved values. Commit stays disabled until the form is dirty.
89. **Create mode:** fields are empty. Commit disabled until required fields validate. Commit label matches the trigger (Add, Create, etc.).
90. Closing a half-edited modal does **not** prompt a second stacked confirmation by default.
91. **Stacking rule (agent-specific): Default is no stacking.** The only permitted exception is a **confirmation-only** overlay (**P7**) triggered by a destructive or save action inside the modal. This second surface must contain only a title, message, and two buttons — no forms, tables, or complex content. Any other stacking scenario requires explicit stakeholder sign-off before implementation.

---

## P6 — Inline Validation

92. Validation runs on **blur**. For already-errored fields, re-validate on each change.
93. Each field validates independently; error appears adjacent to the field (not in a top-of-form banner).
94. Required fields are visually marked.
95. Commit actions start **disabled**. Enable when: all required validations pass. For edit flows: also require at least one change from saved values (dirty check).
96. **Inline-workspace saves:** control sequence and `LOFIStatefulButton` rules live under **P3** — no P7 before save. Outcome toasts: **P4**.
97. **Modal saves (P5 context) do use P7** before the async operation: confirm dialog → loading state on button → success (close modal, refresh table, **P4** success toast) or error (keep modal open, **P4** error toast or inline alert).
98. Simulate 500ms–1.5s delay in prototypes so loading is visible.
99. On error (inline persist): return button to `idle`, **P4** error toast, footer stays until fixed. Field validation errors stay adjacent per rules 92–94.
100. On error (modal): keep modal open, **P4** error toast or warning above modal footer, re-enable commit action.

---

## P7 — Confirmation Dialog

101. **Required for:** Remove, Delete, **bulk destructive** actions on selected rows, Discard unsaved changes, modal-context Save/Create, and any action the feature spec marks as significant or difficult to undo.
102. **NOT required for:** reversible actions (Hide — can be un-hidden), inline-workspace saves (**P3**), navigation/view changes.
103. Anatomy: title (action being confirmed) + brief message (what will happen) + two buttons: confirm (specific verb) + cancel.
104. **Never** use generic OK or Yes as the confirm label.
105. Destructive confirmations use `variant="primary"` on the confirm button.
106. Dialogs contain only a question and two answers — no forms, tables, or complex content.

---

## P8 — Tab Navigation

107. Tabs appear **above the content area** they control.
108. One tab active at a time, visually indicated (underline convention).
109. Switching tabs does **not discard state**. Unsaved work in one tab persists when the user returns.
110. **Use tabs for parallel views** — including inside modals (**P5**). Use a stepper/wizard for sequential flows. Use a compact segmented control only inside dense non-modal panels.
111. Tabs can be disabled (role-gated); never set the active value to a disabled tab.
112. Tab labels may include optional **counts or status** indicators when the spec requires them.

---

## P9 — Filters

113. Filter controls appear above a data table (P2.1) or in the UPL filter query row (P1.2.1).
114. All active filters apply as AND conditions simultaneously.
115. Every filter set includes a **Clear all** control that resets all fields and dependent state (sidebar, main interface, table content).
116. Individual field clears (✕) are local — they clear one dimension only, no cascading reset.
117. **Debounce search** (default): triggers automatically 300–500 ms after the user stops typing. Use an explicit **Search** button when the backend is slow, specific, or unstable. **Coexistence:** a screen may use debounced table search **and** an explicit Search in the UPL filter row when both contexts exist.
118. Allowed control families (compose with `lofi-kit`): search text (names + IDs), **select** for fixed sets, date / range pickers, optional **autocomplete / typeahead** for open-ended entities, **multiselect** where the spec requires multiple values from a set, binary **switch** for flags such as "Active only".
119. Active filters may be shown as dismissible chips below the filter row (active-filter strip). Each chip represents one active filter; a "Clear all" chip at the end removes everything.
120. Filter change → sidebar updates → if current selection no longer matches, clear the main interface view and show an empty state. Never retain a stale selection.
121. When **all** filters are cleared, the sidebar returns to its unfiltered shape; if no leaf remains selected, the main interface shows a **no-selection** empty state.

---

## P10 — Sticky disclosure while scrolling

122. For **tall disclosed content** (P2.5 expansion, accordions, nested expandables), identify the **scroll ancestor**; sticky positioning is relative to it.
123. **Sticky target = disclosure header or parent table row** — the surface that carries **collapse** and **identity** (and **Actions** on tables). Do **not** duplicate collapse in a separate strip inside the detail body.
124. Constrain long bodies with **max-height** + **scroll**; keep the header/parent row **sticky** within the scroll container.
125. **Nested expansion:** each expanded **parent** row (or section header) is sticky **within its own** scroll context; sub-tables repeat the same pattern level by level.
126. Default **`LOFITable` `expandable`** applies sticky parent row + scrollable detail body (`expandableStickyDetail`); set `expandableStickyDetail={false}` only when the product explicitly opts out.

---

## Global interaction rules

### Confirmation
- R1: Irreversible/destructive actions (Remove, Delete, **bulk destructive** on a selection, Discard changes, modal-context Save/Create) require **P7** confirmation. Reversible actions (Hide) and inline-workspace saves (**P3**) do not.
- R2: Confirmation dialog names the action and affected entity. Never "Are you sure?"
- R3: Cancel in a confirmation returns to prior state with no changes.

### Loading
- R4: Inline-workspace Save uses **P3** StatefulButton (idle→loading→success) and **P4** toasts for outcomes. Modal Save/Create uses **P7** → loading state → success/error + **P4**.
- R5: Simulate 500ms–1.5s async delay in prototypes.
- R6: On success (inline) → **P4** success toast; clear dirty / hide footer when appropriate. On success (modal) → close **P5** modal **and** any stacked **P7** overlay, **P4** success toast, refresh table.
- R7: On error → **P4** error toast; keep context open; re-enable commit.

### Destructive
- R8: Inline remove always → **P7** confirmation, even when change is staged. Hide never requires **P7**.
- R9: Role-gated actions are **hidden** (not disabled) for unauthorised users.

### Data and mocking
- R10: Use real-world entity names (not "Player 1" or "Test Team").
- R11: User handles: `j.smith` format.
- R12: Timestamps: `DD MMM YYYY, HH:mm`.
- R13: Generate enough mock data to demonstrate all states: populated, empty, filtered/no-results, errors.

### Changelog
- R14: Every data mutation appends a changelog entry (append-only, newest-first, read-only).
- R15: Entry format: `[Action] [entity] [detail]`.
