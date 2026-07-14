# P2 — Data Table

P2 covers the data table pattern across five sub-patterns: **P2.1** (table structure), **P2.2** (row actions), **P2.3** (column controls), **P2.4** (bulk operations), and **P2.5** (expandable rows).

## Related patterns

- Row destructive actions: **P7** (Confirmation Dialog).
- Row editor actions: **P5** (Modal).
- Reversible Hide / Map toggles: **P3** (Stateful Button).
- Expandable row sticky behaviour: **P10** (Sticky Disclosure).
- Table search/filters above table: **P9** (Filters).
- Row action UI semantics: **U5** (Tables, filters, row actions).

---

## P2.1 — Table structure

41. Define every column from the feature spec. Do not invent columns. If the feature spec omits columns, use: entity name, ID, status, Actions.
42. Tables with ~15+ expected rows must have a persistent, visible search control above the table. Never collapse search behind an icon-only control.
43. When the search control is **not** part of a larger filter set, the toolbar shows: a bounded-width text input (max ~200px) with a ✕ clear control (visible when value non-empty) + a **Search** button immediately to the right.
44. Column headers support sorting where specified; see P2.3 for non-sortable exceptions.
45. **Empty state — first-use:** Show the table shell (toolbar with controls; filters/search disabled; full column headers) + an informational message ("No [entity] yet. Create one to get started."). The primary create action on the toolbar stays **enabled**. Do not hide the table structure.
46. **Empty state — no-results:** Show table shell + headers + message ("No results match your filters."). Provide a **Clear filters** action to reset the filter row and reload the table.
47. **Empty state — error:** Show table shell + headers + message ("Failed to load data."). Provide a **Retry** action to reload.
48. **Loading:** show a loading indicator inside the table body. Do not block the full page. For lazy/infinite scroll: show a blank loading row with a centred indicator at the bottom of the scroll area, or a **Load more** control when the backend or use case fits.
49. Tables may appear inside modals (P5) one level deep. A table inside a modal does not open another modal — except for a **confirmation-only** overlay (P7) triggered by a destructive or save action inside the modal.

## P2.2 — Row actions

50. Canonical row actions: **Edit**, **Remove**, **View**, **Hide**. Do not invent actions not in the feature spec.
51. Destructive actions (Remove, Delete) must not be the most prominent control in the row.
52. Destructive row actions require a confirmation dialog (P7) before executing.
53. Row actions that open an editor follow P5.
54. Reversible Hide on a row: label may switch **Hide** / **Unhide** to state the mode (**P3** label-toggle variant); no P7.
55. Role-gated actions are **hidden** (not disabled) for unauthorised users.

## P2.3 — Table column controls

56. The **Actions** column is never sortable.
57. **Multi-select column:** header = select-all master; rows = checkboxes.
58. **Single-select column:** when only one row may be selected and checkboxes are inappropriate, use radio buttons in rows; the column header is not sortable.
59. Any column where sorting provides no value (status-only, badge-only, action cells) may be declared non-sortable; omit the sort indicator.

## P2.4 — Bulk operations

60. Bulk destructive actions require a selection (P2.3 multi-select). Keep bulk-destructive controls disabled until a selection exists.
61. **Bulk import:** provide a Browse button and/or drag-and-drop zone above the table. Enable a Confirm/Upload action after files are chosen.
62. During import processing: show a **loading overlay over the table area**. Overlay styling: semi-transparent white background (~10% opacity), positioned absolutely over the table body, z-index above the table but below any modals. The table is visibly inactive; block all interactions (click, keyboard) until the import completes. Show a centred loading indicator with label ("Uploading…", "Processing…") in the overlay.

## P2.5 — Expandable rows

63. Prefer **row expansion** for read-mostly or supplementary secondary context inline. Do **not** stack a second **P5** modal on an existing modal — use **P7**-only stacking per P5 rules.
64. When expanded detail is taller than a comfortable band: **max-height** + **scroll** on the detail body. **Expand/collapse** only on the **parent table row** (chevron / row). **Sticky** the **parent data row** in the scroll container so cells and actions stay visible — **P10**. Do **not** add a duplicate collapse strip inside the detail.

---

## Common mistakes (P2)

- ❌ Hiding the table structure in first-use empty state — show table shell, headers, and columns with the empty message (P2.45).
- ❌ Using "No data" message for both first-use and no-results — use different messages and provide appropriate actions (P2.45, P2.46).
- ❌ Making Actions column sortable — it never is (P2.56).
- ❌ Hiding destructive row actions behind a menu without prominence — remove/delete must be available and confirmable (P2.52).
- ❌ Disabling instead of hiding role-gated actions — always hide actions the user cannot perform (P2.55).
