# P9 — Filters

Filter controls can appear above a data table (see P2.1 — Table Structure) or in the UPL filter query row (see P1.2.1 — Filter Row). This pattern covers their complete behaviour in both contexts.

## Related patterns

- UPL filter row structure: **P1.2.1** (Filter Row).
- Table toolbar search: **P2.1** (Table structure).
- Sidebar/main coupling: **P1.2.2** (Sidebar).
- Filter chip UI semantics: **U5** (Tables, filters, row actions).
- Filter-region spacing: **U6** (Spacing).

---

## Rules

113. Filter controls appear above a data table (P2.1) or in the UPL filter query row (P1.2.1).
114. All active filters apply as AND conditions simultaneously.
115. Every filter set includes a **Clear all** control that resets all fields and dependent state (sidebar, main interface, table content).
116. Individual field clears (✕) are local — they clear one dimension only, no cascading reset.
117. **Debounce search** (default): triggers automatically 300–500 ms after the user stops typing. Use an explicit **Search** button when the backend is slow, specific, or unstable. **Coexistence:** a screen may use debounced table search **and** an explicit Search in the UPL filter row when both contexts exist.
118. Allowed control families (compose with Podium / your component library): search text (names + IDs), **select** for fixed sets, date / range pickers, optional **autocomplete / typeahead** for open-ended entities, **multiselect** where the spec requires multiple values from a set, binary **switch** for flags such as "Active only".
119. Active filters may be shown as dismissible chips below the filter row (active-filter strip). Each chip represents one active filter; a "Clear all" chip at the end removes everything.
120. Filter change → sidebar updates → if current selection no longer matches, clear the main interface view and show an empty state. Never retain a stale selection.
121. When **all** filters are cleared, the sidebar returns to its unfiltered shape; if no leaf remains selected, the main interface shows a **no-selection** empty state.

---

## Common mistakes (P9)

- ❌ Silently retaining a sidebar selection that no longer matches active filters — clear the main interface view (P9.120).
- ❌ Not providing a "Clear all" button in the filter row — always include this (P9.115).
- ❌ Adding a "Select all" option to a filtered list — filter results always show what matches, not a select-all affordance.
