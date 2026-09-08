# P1 — Workspace (UPL)

The structural shell of a UPL interface. "Workspace" here means the complete operator environment — the containing frame and its sub-regions. This is not to be confused with a browser window; the term describes the product concept only.

## Related patterns

- Filter row behaviour: also see **P9** (Filters).
- Internal tabs in main content: **P8** (Tab Navigation).
- Footer Save/Reset: **P3** (Stateful Button), **P4** (Toast), **P6** (Inline Validation), **P7** (Confirmation for Reset only).
- Main content tables: **P2** (Data Table).
- Filter-region spacing: **U6** (Spacing).

---

## P1.1 — UPL Shell

1. The **upper bar is always visible** — never collapses, hides, or changes based on navigation state.
2. Upper bar composition (left to right): logo → interface name → optional subtitle → [Applications] [Configuration] [username].
3. **User identity strip** (far right of upper bar): username in `j.smith` format + role label (Operator / Supervisor / Admin). Informational only in production. In prototypes it acts as a **role switcher** — label it clearly as prototype-only.
4. A **module context strip** (tab row) below the upper bar is optional. Include it only when the interface groups multiple modules (e.g. Tournaments / Competitors / Venues). Switching modules resets filter, sidebar, and main interface.
5. Use real brand assets and High Fidelity Design System styling in production UPL chrome per your design system; the shell structure (regions and affordances) stays as defined here.

## P1.2 — Internal Workspace

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
14a. UPL filter-region spacing baseline: filter block top padding is 16 px and bottom padding is 8 px, controls in one row are spaced by 16 px, wrapped filter rows are separated by 8 px, and sidebar↔main gap is 16 px; UPL shell has 46 px left/right insets (left rail reserved for collapse button).

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

#### P1.2.3.1 — Heading Bar

25. Heading bar contains: optional leading icon → naming element (title or breadcrumb) → optional badges/labels.
26. Use a **breadcrumb** when the sidebar has a hierarchy (e.g. "Soccer > Intl Youth > U20 AFC. Group C. Women (ID 180564)").
27. Breadcrumb is **interactive** only when the interface supports sidebar-linked navigation; otherwise it is a non-interactive label.
28. In **multi-pane interfaces** (e.g. Resulting), place the Save/Confirm action in the heading bar far right instead of the footer.
29. Heading bars in multi-pane layouts may be individually **collapsible**.
30. Separate the heading bar from the content area with a divider line or distinct background shade.

#### P1.2.3.2 — Footer

31. Footer contains: [Reset changes] (secondary) and [Save / Confirm] (primary).
32. Save/Confirm is **disabled when the form is not dirty** or when validation fails.
33. Footer uses **P6** for field-level validation and commit gating (blur validation, dirty check, required marks).
34. **Inline workspace Save** (main pane footer): **no P7** before save. Use **P3 (Stateful Button)** sequence only: `idle` → `loading` → `success`/error. **P4** toasts for outcomes. On error, return to idle and keep the footer visible with pending edits.
35. **Modal Save** (P5 footer): use **P7** confirmation before the async operation. After confirm, loading on commit → close P7 + P5 + **P4** success toast on success; keep P5 open + error toast on failure.
36. **Reset changes**: always **P7** ("Discard unsaved changes to [entity]?") before reverting. On confirm, revert to last saved state and hide the footer when clean. Show the footer only when the form is dirty or after a failed save with pending edits.

#### P1.2.3.3 — Main Content

37. An **internal tab strip** (optional) at the top of the content area switches parallel content sections within the current entity. Follows P8 (Tab Navigation) rules — no discard on tab switch.
38. The internal tab strip spans the full width of the content area.
39. The last internal tab is "Change log" whenever a changelog is present (append-only, read-only).
40. Content types: table (P2), form fields, or mixed fieldsets. Every data mutation generates a changelog entry.

---

## Common mistakes (P1)

- ❌ Silently retaining a sidebar selection that no longer matches active filters — clear the main interface view (P1.14).
- ❌ Not providing a "Clear all" button in the filter row — always include this (P1.12).
- ❌ Showing Save/Reset footer when the form is clean — hide it when there are no pending edits (P1.36).
- ❌ Enabling Save button before the form is dirty (edit mode) — commit stays disabled until the user changes at least one field (P1.32).
- ❌ Using Reset without a P7 confirmation — Reset always confirms before reverting (P1.36).
