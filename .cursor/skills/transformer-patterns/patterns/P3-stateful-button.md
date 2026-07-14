# P3 — Stateful Button

Controls whose **label**, **visual weight**, and/or **disabled** state encode async **commit progress** or the **current reversible mode** of an action (so the operator always knows what will happen next).

## Related patterns

- Inline workspace Save (no P7): **P1.2.3.2** (Footer), **P4** (Toast), **P6** (Inline Validation).
- Modal Save after P7: **P5** (Modal), **P7** (Confirmation), **P4** (Toast).
- Reversible row toggles (Hide/Map): **P2.2** (Row actions).
- Button UI semantics: **U1** (Buttons + feedback), **U3** (Forms — inline Save styling).

---

## Rules

65. **Async commit (inline workspace Save, row Map→Mapped):** use **stateful button** (idle/loading/success states) — **no P7** before save. Sequence: `idle` (primary, "Save changes", enabled when dirty / action allowed) → `loading` (disabled, "Saving…" + dots) → `success` (dismiss, "Saved" / "Mapped", disabled). Revert-to-saved: editing back to last-persisted returns to `success` without a new save.
66. **Reversible label toggle (e.g. Hide/Unhide):** one secondary control; label **states current mode**. Use **button** or **stateful button** (idle/loading/success states) in `idle` only; do **not** use `success` as the only reverse target — it disables clicks.
67. **Map/Mapped (P2.2):** compact **stateful button** (idle/loading/success states) + separate dismiss **button** for Unmap.
68. On inline save **error:** return button to `idle`, show **error toast notification** (**P4**), keep footer visible with pending edits, re-enable Save.
69. Simulate **500ms–1.5s** delay in prototypes so loading states are visible.
70. **After P7** on a **P5** modal commit: show loading on the **confirm** control in the **P7** overlay. On **success:** close **both** the P7 overlay and the underlying **P5** modal, **P4** success toast + refresh affected data. On **error:** keep the **P5** modal open, **P4** error toast or warning per **P6** modal rules, re-enable commit.

---

## Common mistakes (P3)

- ❌ Using P7 before inline-workspace Save — inline save uses P3, not P7; only modal saves use P7 (P3.65, P7.102).
- ❌ Recolouring the Save button across idle/loading/success — keep `action` + `fill` throughout (see U3.53).
