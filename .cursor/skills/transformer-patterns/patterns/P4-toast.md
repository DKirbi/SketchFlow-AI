# P4 — Toast notification messages

Transient **success**, **error**, and optional **informational** feedback for async outcomes — especially **inline workspace** saves and resets coordinated with **P1.2.3.2 Footer**, **P3 (Stateful Button)**, and **P7 (Confirmation)** for discard.

## Related patterns

- Inline workspace Save outcomes: **P1.2.3.2** (Footer), **P3** (Stateful Button).
- Modal Save outcomes: **P5** (Modal), **P7** (Confirmation).
- Field-level validation messages: **P6** (Inline Validation) — P4 owns operation outcomes, not blur copy.
- Toast colour semantics: **U1** (Buttons + feedback).

---

## Rules

71. Use **toast notification** for transient **success**, **error**, and optional **info** after async operations — especially inline workspace **Save** / **Reset** outcomes with **P1.2.3.2 Footer** and **P3**.
72. Default placement: **upper-right** fixed layer. Auto-dismiss success toasts when the spec allows.
73. **Inline save success:** success toast; clear dirty → **hide footer** (no longer pending).
74. **Inline save failure:** error toast; **keep footer**; edits stay pending; operator retries or uses Reset (**P7**).
75. **Reset after P7 confirm:** optional success/info toast; footer hides when clean.
76. **Modal save (P5) after P7:** success → close modals + success toast; error → error toast (preferred) or inline above footer for persistent detail.
77. **P6** still owns **per-field** validation messages (**inline alert**). **P4** owns **operation outcomes** (saved / failed to save), not blur copy.
78. Stack or replace multiple toasts per product spec; prototypes often show one at a time.

---

## Common mistakes (P4)

- ❌ Using a top-of-form banner for operation outcomes — P4 toasts for save/fail; P6 for per-field errors (P4.77).
- ❌ Hiding footer on inline save failure — keep footer with pending edits (P4.74).
