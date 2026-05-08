# Tournament management (lo-fi prototype)

Frontend-only demo: Zustand + seed data, no APIs. See [`src/store/useTournamentStore.ts`](src/store/useTournamentStore.ts) for the 5-step flow comment.

## Manual verification checklist

Walk these states once after UI changes:

1. **First use + preselection** — Run Search with default filters and confirm the first valid sidebar item is auto-selected, so main pane is not empty.
2. **Sport parent view** — Select a sport parent and verify grouped management content renders by category, with unique tournaments and expandable simple rows.
3. **Unique parent view** — Select a unique tournament parent and verify child simple tournaments render as selectable table rows.
4. **Simple tournament detail** — Select a simple tournament leaf and verify Overview + **Change log** tabs remain scoped to that entity.
5. **Breadcrumb navigation** — In sport, unique, and simple scopes, verify breadcrumbs render correct hierarchy and let you navigate back to parent management scopes.
6. **Scope-local controls** — Verify action buttons reflect only the currently selected sidebar scope (sport, unique, or simple), not hidden scopes.
7. **Row selection + bulk bar** — In list-style views, use row checkboxes and select-all; verify action labels and enabled states update with selection count/status mix.
8. **Bulk move/remove confirms** — Run bulk Move and Remove and verify confirmation modals appear before mutation is applied.
9. **Bulk clone + disable/enable** — Run bulk Clone and bulk Disable/Enable; confirm disable/enable applies immediately (no confirmation) and clone creates new rows.
10. **No matches / clear filters** — Narrow filters until no matches and verify `no-matching-data` empty state copy plus Clear all behavior.
11. **Role gating + failure path** — Cycle role in header (Remove/Move gating) and toggle “fail next mutation” to verify error toast behavior.

Build/lint: `npm run build -w tournament-management` and `npx eslint "demos/tournament-management/src/**/*.{ts,tsx}"` from repo root.
