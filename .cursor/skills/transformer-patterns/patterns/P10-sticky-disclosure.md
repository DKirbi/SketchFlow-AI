# P10 — Sticky disclosure while scrolling

When a **disclosure** reveals a **large vertical amount of content** (expanded table row, accordion panel, nested blocks), scrolling must not hide the controls and context the operator needs to **collapse**, **act on the row**, or **see which entity** is open.

## Related patterns

- Expandable table rows: **P2.5** (Expandable rows).
- Sticky row UI semantics: **U5** (Tables, filters, row actions).

---

## Rules

122. For **tall disclosed content** (P2.5 expansion, accordions, nested expandables), identify the **scroll ancestor** (the container that actually scrolls); sticky positioning is relative to it.
123. **Sticky target = disclosure header or parent table row** — the surface that carries **collapse**, **identity**, and **Actions** (on tables). **Anti-pattern:** Do **not** add a separate sticky strip inside the detail body that duplicates the collapse button or repeats the row title — this is redundant with the parent row and confuses operators.
124. Constrain long bodies with **max-height** + **scroll**; keep the header/parent row **sticky** within the scroll container. Example markup: parent row (sticky, chevron + title + actions) contains detail row (max-height scrollable body).
125. **Nested expansion:** each expanded **parent** row (or section header) is sticky **within its own** scroll context; sub-tables repeat the same pattern level by level.
126. Use component defaults for sticky parent + scrollable detail. Only customize when the product explicitly opts out.

---

## Common mistakes (P10)

- ❌ Adding a duplicate sticky collapse strip inside the detail body — sticky the parent row only (P10.123).
- ❌ Using a new background colour to show expansion — chevron/rotation shows expansion, not new bg colour (see U5.75).
