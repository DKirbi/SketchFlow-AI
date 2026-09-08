# U4 — Overlays + navigation

## Related patterns

- Modal behaviour and stacking: **P5** (Modal).
- P7 confirmation anatomy: **P7** (Confirmation Dialog).
- Tab behaviour: **P8** (Tab Navigation).

---

## Rules

54. Default modal/drawer/chrome to `surface="on-light"` unless the parent is explicitly dark.
55. For `on-dark` parents, flip **all** nested High Fidelity Design System controls consistently — **no** mixed-surface overlays.
56. **Modal** commit: **`fill` + `action`** rightmost; **`subtle` + `neutral`** cancel immediately **left** of commit.
57. **P7 destructive confirm** confirm button: **`fill` + `warning`** — **only** in that stacked confirmation surface (P7 from P-rules above).
58. Treat drawers/popovers as **structural** — **neutral**, low rank; **escalate** real commits to **P5** modals, not crowded popovers.
59. **Tabs**: carry selection with **underline/active chrome**; keep tab **label text `neutral`**; optional `attention` on **"needs review"** counters when specified.
60. **Menu** rows stay `neutral`; **destructive** row → **`warning` + `ghost`**.
61. **P7** dialog (see P-rules above): title/message sizes per U2 rules; confirm `action` (affirmative) or `warning` (destructive); cancel **`subtle` + `neutral`**.

---

## Common mistakes (U4)

- ❌ Mixing `on-light` and `on-dark` surfaces in one overlay — flip all nested controls consistently (U4.55).
- ❌ Using `fill warning` outside P7 confirm — default to `subtle` + `warning` or `outline` + `warning` in rows (U4.57).
