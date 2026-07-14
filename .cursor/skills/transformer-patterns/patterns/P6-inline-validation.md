# P6 — Inline Validation

Form and field validation behaviour, and feedback during and after save operations.

## Related patterns

- Inline workspace Save sequence: **P3** (Stateful Button) — no P7 before save.
- Modal Save sequence: **P5** (Modal) + **P7** (Confirmation).
- Operation outcomes (not field errors): **P4** (Toast).
- Footer commit gating: **P1.2.3.2** (Footer).
- Field error UI semantics: **U3** (Forms + inputs).

---

## Rules

92. Validation runs on **blur** (when the user leaves the field). **Do not validate on every keystroke.**
93. For fields already showing an error, re-validate on each change. When the input is corrected and passes validation, the error message disappears immediately (before the user leaves the field).
94. Each field validates independently; error message appears adjacent to the field (not in a top-of-form banner). Required fields are visually marked.
95. Commit actions start **disabled**. Enable when: all required validations pass. For edit flows: also require at least one change from saved values (dirty check).
96. **Inline-workspace saves:** control sequence and Stateful Button rules live under **P3** — no P7 before save. Outcome toasts: **P4**.
97. **Modal saves (P5 context) do use P7** before the async operation: confirm dialog → loading state on button → success (close modal, refresh table, **P4** success toast) or error (keep modal open, **P4** error toast or inline alert).
98. Simulate 500ms–1.5s delay in prototypes so loading is visible.
99. On error (inline persist): return button to `idle`, **P4** error toast, footer stays until fixed. Field validation errors stay adjacent and visible per rules 92–94.
100. On error (modal): keep modal open, **P4** error toast or warning above modal footer, re-enable commit action.

---

## Common mistakes (P6)

- ❌ Validating on every keystroke — validate on blur only; re-validate on change only for already-errored fields (P6.92).
- ❌ Showing a validation error banner at the top of the form — show errors adjacent to each field (P6.94).
- ❌ Clearing validation errors immediately on keystroke without re-validating — error persists until the field passes validation (P6.93).
