---
name: transformer-patterns
description: >-
  Apply P1–P10 interaction patterns and UI semantics (U0–U6) for Transformer Patterns /
  Common Lib interfaces: UPL workspace shell, data tables, stateful buttons, toasts, modals,
  validation, confirmations, tabs, filters, sticky disclosure, plus color, rank, surface,
  size, typography, spacing. Use when building or reviewing Common Lib screens, flows, props,
  or Figma/PRs. Prefer @pet-transformers/common-react; pair with Podium MCP (pds-mcp) for raw
  Pds* when needed. When UX behaviour and UI semantics conflict, UX wins.
---

# Transformer Patterns — Orchestrator

> **Modular rulebook.** Pattern knowledge lives in `patterns/`, `ui/`, and `references/`.
> This file is the **planner only** — do not assume full-audit scope unless the user confirms.

**Precedence:** when UX behaviour and UI semantics conflict, **UX wins** — reconcile props afterward.

---

## Workflow (every invocation)

1. **Determine intent** — classify the request (see Intent detection).
2. **Determine scope** — infer which P* and U* documents are relevant (see Scope detection).
3. **If ambiguous** — ask clarifying questions; do not read pattern files yet.
4. **If scope > 3 pattern documents** — pause for Full audit protection (see below).
5. **Load only required documents** — Read the resolved files from this skill directory.
6. **Execute** — apply rules; cite rule numbers (e.g. P7.101, U1.17).
7. **Optional** — load `references/quick-reference.md` for lookup tables; load `references/common-mistakes.md` before finalizing reviews.

---

## Intent detection

| Intent | Signals | Behaviour |
|--------|---------|-----------|
| **Explain** | "Why is…", "What does…", "How should…" | Answer with cited rules; minimal file load |
| **Review** | "Review this modal/table/…", scoped component | Load scope patterns only; findings as rule # → location → issue → fix |
| **Audit** | "Audit this screen", "Check compliance" | May need many patterns — trigger Full audit protection |
| **Implement** | "Add a…", "Build…", "Implement…" | Load scope patterns; apply mode — patch behaviour and props |
| **Refactor** | "Refactor…", "Migrate…", "Fix…" | Load scope patterns; preserve semantics |
| **Generate** | "Create a prototype", "Generate…" | Load scope patterns + U0 baseline; apply design system integration |

---

## Scope detection

Map user signals to documents. Load **only** what applies.

| Signal | Patterns | UI |
|--------|----------|-----|
| Workspace / shell / sidebar / filter row / footer | P1 | U0, U6 |
| Table / list / rows / bulk / expandable | P2 | U5 |
| Save button / commit / inline save / stateful | P3 | U1 |
| Toast / notification / outcome feedback | P4 | U1 |
| Modal / dialog / editor overlay | P5 | U4 |
| Validation / error / required field / dirty | P6 | U3 |
| Delete / remove / destructive / confirm / discard | P7 | U1, U4 |
| Tabs / tab switching | P8 | U4 |
| Filters / search / chips / clear all | P9 | U5 |
| Sticky / expandable / disclosure / scroll | P10 | U5 |

### Composite shortcuts

| Scenario | Load |
|----------|------|
| Delete button | P2, P7, U1 |
| Modal editor | P5, P6, U1, U4 |
| Filter bar | P9, U5 (+ P1 if UPL filter row) |
| Inline Save | P3, P4, P6 (+ P1 footer if workspace) |
| Row Remove | P2, P7, U1, U5 |
| Discard unsaved | P1, P7 |
| Full workspace screen | P1, P9 (+ P2/P5/P8 as content dictates) |

Always add **U0** when choosing `color`, `rank`, `surface`, or `size` props.
Add **U6** when reviewing layout spacing or filter-region composition.

### Document paths

```
patterns/P1-workspace.md … patterns/P10-sticky-disclosure.md
ui/U0-baseline.md … ui/U6-spacing.md
references/quick-reference.md
references/common-mistakes.md
```

---

## Ambiguity guardrail

If the request does not map to a clear pattern (e.g. "Analyze this screen", "Check this UI"):

> This could involve multiple UX patterns. Which area should I focus on?
>
> - Workspace shell
> - Tables
> - Modals
> - Validation
> - Filters
> - Buttons / feedback
> - Spacing
> - **Full UX Audit**

**Wait for the user's answer** before reading any pattern file.

---

## Full audit protection

A full audit is intentionally expensive. **Never perform one automatically.**

If resolved scope requires **more than ~3 pattern documents** (P* or U*), pause and offer:

1. **Narrow scope** — pick the most relevant area from the list above.
2. **Full sequential audit** — user confirms; then load all relevant documents in one pass.
3. **Parallel agents (plan mode)** — split into subagent tasks (one per pattern area); produce a dispatch list the user can run in parallel.

Only proceed with option 2 or 3 after explicit confirmation.

---

## Design system integration

**Common Lib** (`@pet-transformers/common-react`) is the **primary** component library.

**Reuse-first order:**

1. **Common Lib** — `COMPONENT_REFERENCE.md` in the package.
2. **Raw Podium** (`Pds*`) — only when Common Lib has no wrapper.
3. **Discuss before building new** — extend Common Lib, compose Podium, or net-new?

- Verify props: Common Lib types first; for raw Podium, use Podium MCP (`pds-mcp`) or `@podium-design-system/react-components` typings — do not invent prop names.
- `Pds*` names describe semantic types; Common Lib `Field` configs follow the same vocabulary.

---

## Apply and audit modes

- **Apply mode:** implement or patch behaviour and props; cite rule numbers.
- **Audit mode:** output **rule #** → **location** → **issue** → **recommended fix**.
- **Spacing gate:** run `npm run spacing:check` on touched demo paths; include U6 rule references in remediation notes.

---

## Pattern index (routing only)

| ID | File | One-line summary |
|----|------|------------------|
| **P1** | `patterns/P1-workspace.md` | UPL shell: upper bar → filter row → sidebar → main interface view |
| **P2** | `patterns/P2-data-table.md` | Entity lists: structure, row actions, columns, bulk, expandable rows |
| **P3** | `patterns/P3-stateful-button.md` | Async commit without P7 (idle → loading → success/error) |
| **P4** | `patterns/P4-toast.md` | Transient operation outcomes after async work |
| **P5** | `patterns/P5-modal.md` | Blocking editor/viewer; stacking limited to P7 confirm only |
| **P6** | `patterns/P6-inline-validation.md` | Blur validation, dirty gating, field-adjacent errors |
| **P7** | `patterns/P7-confirmation-dialog.md` | Irreversible/destructive/modal-save confirm; never generic "OK" |
| **P8** | `patterns/P8-tab-navigation.md` | Parallel views; state persists across tab switches |
| **P9** | `patterns/P9-filters.md` | AND logic, debounce search, chips, sidebar coupling |
| **P10** | `patterns/P10-sticky-disclosure.md` | Sticky parent row/header while detail scrolls |

| Section | File | Topic |
|---------|------|-------|
| **U0** | `ui/U0-baseline.md` | Imports and internal-tool baseline |
| **U1** | `ui/U1-buttons-feedback.md` | Buttons + feedback (`color`, `rank`, emphasis, toasts) |
| **U2** | `ui/U2-typography.md` | Typography (`PdsFontSize`, text roles) |
| **U3** | `ui/U3-forms.md` | Forms + inputs |
| **U4** | `ui/U4-overlays-navigation.md` | Overlays + navigation (modals, drawers, tabs, menus) |
| **U5** | `ui/U5-tables-filters.md` | Tables, filters, row actions |
| **U6** | `ui/U6-spacing.md` | Spacing (4 / 8 px grid; Mantine theme tokens) |

For pattern connections, global rules R1–R15, and cheat sheets → `references/quick-reference.md`.
For anti-patterns → `references/common-mistakes.md`.
