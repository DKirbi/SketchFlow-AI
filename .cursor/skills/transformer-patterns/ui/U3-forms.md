# U3 — Forms + inputs

## Related patterns

- Field validation behaviour: **P6** (Inline Validation).
- Modal footer commit order: **P5** (Modal).
- Inline workspace Save state machine: **P3** (Stateful Button), **P1.2.3.2** (Footer).

---

## Rules

43. Default every field **`neutral` + `outline` + `md`** unless the spec narrows further.
44. Use `action` in **focus** chrome to mean **"this field is live"** — not ambient decoration.
45. **Read-only** fields lose the editable-border affordance; rely on **read-only text contrast**, not recolouring valid data green.
46. **Hard** validation → `warning` messages **adjacent** to the field (**P6** contract from P-rules above).
47. **Soft / unusual but accepted** values → `attention`.
48. Do **not** flood valid fields with `success` — only explicit positive cues (e.g. "username available").
49. Mark **required** fields **typographically** — asterisk + label; **never** colour-only required signalling.
50. Keep editable fields `md`; step to `sm` only for **filter strips** or **table-inline** edits.
51. Group related inputs with **layout + labels** — **not** arbitrary background tints per field.
52. **Modal** submit footer: **`action` + `fill`** commit + **`subtle` + `neutral`** cancel — order per **P5** (see P-rules above).
53. **Inline workspace** Save: **`action` + `fill`** + **P3 state machine** (see P-rules above); **Reset** → **`outline` + `neutral`** — **do not** recolour the Save button across **idle/loading/success**.

---

## Common mistakes (U3)

- ❌ Colour-only required marking — use asterisk + label typographically (U3.49).
- ❌ Flooding valid fields with `success` — only use for explicit positive confirmation (U3.48).
- ❌ Using `success` colour in form errors — hard errors are `warning`, soft cautions are `attention` (U3.46, U3.47).
