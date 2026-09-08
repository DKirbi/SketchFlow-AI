# U5 — Tables, filters, row actions

## Related patterns

- Table behaviour: **P2** (Data Table).
- Filter behaviour: **P9** (Filters).
- Row stateful toggles: **P3** (Stateful Button).
- Sticky expanded rows: **P10** (Sticky Disclosure).
- Bulk import overlay: **P2.4** (Bulk operations).

---

## Rules

62. Colour **status** cells **only** with semantic meaning — **always** show a **text label** with the status colour.
63. Place **status** adornment at **`sm` or `xs`**, `subtle` rank inside cells.
64. **Edit / View** row primaries → **`outline` or `subtle`**, `neutral` — **avoid** repeating `fill` down a column.
65. **Remove / Delete** in-row → **`ghost` + `warning`** or **`subtle` + `warning`** — **never `fill` + `warning`** in the row (P7 is where the destructive emphasis lives).
66. **Reversible** row toggles (**Hide**, **Map**) → `neutral` + **P3** semantics (see P-rules above) — **no** hue swap across states.
67. Table **header** controls → `sm`; **body** controls → `sm`; **inline icon-only** → `xs`.
68. Body **cell text** → `table` role at **`600`–`700`** per density rules (U2).
69. **Filter chips**: inactive **`outline` + `neutral`**; selected uses the **sticky-pressed invert** (`fill` + `neutral`; lo-fi ink/paper) and **stays pressed** until another chip in the group is chosen; apply `action` **only** when the chip encodes an **active mutation filter** — generic "selected" ≠ automatic `action` colour.
70. **Clear-all** chip → **`ghost` + `neutral`** at the **end** of the active strip.
71. **Bulk destructive** → `warning` + **`outline` or `subtle`**, **disabled** until a selection exists.
72. **Bulk import** CTA → **`action` + `outline`** — **do not `fill`** beside another competing primary.
73. **`~10%` neutral** loading blanket over the table body during bulk processing (P2.4 from P-rules above) — block interaction underneath.
74. Row **expand** control → **`ghost` + `neutral`** without chroma state.
75. **Sticky** expanded parent row (**P10** from P-rules above) keeps ordinary row chrome — **chevron/rotation** shows expansion, not a new background colour.

---

## Common mistakes (U5)

- ❌ Using `action` colour on all "selected" chips — `action` only for active mutation filters; selection is invert (U5.69).
- ❌ Repeating `fill` down a column of row actions — use `outline` or `subtle` to avoid striped emphasis (U5.64).
- ❌ Forgetting text labels on status cells — colour alone fails accessibility (U5.62).
