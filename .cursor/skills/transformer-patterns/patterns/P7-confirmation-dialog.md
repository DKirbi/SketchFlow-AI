# P7 — Confirmation Dialog

A dialog that interrupts a meaningful action to require explicit user confirmation.

## Related patterns

- Modal Save/Create: **P5** (Modal) — P7 required before async.
- Inline workspace Save: **P3** (Stateful Button) — P7 **not** required.
- Row/bulk destructive: **P2** (Data Table).
- Discard unsaved changes: **P1.2.3.2** (Footer).
- Destructive confirm button styling: **U1** (Buttons + feedback), **U4** (Overlays + navigation).

---

## Rules

101. **Required for:** Remove, Delete, **bulk destructive** actions on selected rows, Discard unsaved changes, modal-context Save/Create, and any action the feature spec marks as significant or difficult to undo.
102. **NOT required for:** reversible actions (Hide — can be un-hidden), inline-workspace saves (**P3**), navigation/view changes.
103. Anatomy: title (action being confirmed) + brief message (what will happen) + two buttons: confirm (specific verb) + cancel.
104. **Never** use generic OK or Yes as the confirm label.
105. Destructive confirmations use ``fill` + `warning` (P7 confirm only)` on the confirm button.
106. Dialogs contain only a question and two answers — no forms, tables, or complex content.

---

## Common mistakes (P7)

- ❌ "Are you sure?" — use the specific action name: "Delete team?" or "Discard changes to [entity]?" (P7.103, P7.104).
- ❌ Using P7 for reversible actions like Hide — only for irreversible actions or saves (P7.102).
- ❌ Using P7 before inline-workspace Save — inline save uses P3, not P7; only modal saves use P7 (P7.102).
