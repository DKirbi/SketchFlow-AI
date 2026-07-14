# U6 — Spacing

A shared **4 / 8 px spacing grid** for layout and component internals. All layout spacing should come from this scale so interfaces stay consistent, align cleanly, and render sharply on screen.

## Related patterns

- UPL filter row spacing baseline: **P1.2.1** (Filter Row), **P1.14a**.
- Workspace shell insets: **P1** (Workspace).

---

## 6.1 — Regular spacing (8 px scale)

Use for:

- Padding inside containers, cards, and modals
- Gaps in stacks, grids, and flex layouts
- Margins between sections and components
- Space around page content

| Step | Value | Typical use |
|------|-------|-------------|
| 1 | 8 px | Tight section gaps, compact filter rows |
| 2 | 16 px | Default container padding, field gaps in filter rows |
| 3 | 24 px | Card/modal padding, space between major sections |
| 4 | 32 px | Page content margins, large section separation |

> **UX:** P1 (workspace shell regions), P1.2.1 (filter row)

## 6.2 — Fine spacing (4 px scale)

Use for:

- Space between icon and text
- Internal padding in compact chips, tags, and badges
- Optical alignment tweaks (e.g. nudge icon 4 px)
- Tight spacing inside a single component

| Step | Value | Typical use |
|------|-------|-------------|
| 1 | 4 px | Label-to-control gap, icon-to-text gap, compact chip padding |
| 2 | 12 px | Intra-component tight spacing when 8 px feels too loose |

## 6.3 — Decision guide

1. Start with the **regular 8 px scale** for all layout gaps and padding.
2. If the result feels too loose, try the **next step down** within the 8 px scale (e.g. 16 → 8).
3. If it still feels wrong **inside one component**, try **4 px or 12 px**.
4. If no step fits, **discuss it** — never ship arbitrary pixel values.

## 6.4 — Implementation (Podium / Mantine)

- Use **theme spacing tokens** (`xs`, `sm`, `md`, `lg`, `xl`) or design-system spacing props — not raw px/rem literals in `gap`, `p`, `m`, or `sx` props.
- Map the regular scale to the nearest theme step; reserve 4 px and 12 px for fine intra-component work.

## 6.5 — Filter-region recipe (P1.2.1 + U6)

For UPL screens where the filter region is the first workspace section:

| Zone | Value | PdsBox prop / fallback |
|------|-------|------------------------|
| Filter top padding | 16 px | `topPadding="md"` |
| Filter bottom padding | 8 px | `bottomPadding="sm"` |
| Gap between controls in one filter row | 16 px | `fixedGap="1rem"` |
| Gap between wrapped filter rows | 8 px | `gap="lg"` |
| Sidebar ↔ main pane gap | 16 px | `fixedGap="1rem"` |

Use nested `PdsBox` composition:

- Filter column: `topPadding="md"` + `bottomPadding="sm"` + `gap="lg"` (8 px between wrapped rows)
- Filter control row: `fixedGap="1rem"` (16 px, off gap scale → rem literal)
- Workspace row (sidebar + main): `fixedGap="1rem"` (16 px)

**Prop selection order:** use the `PdsSize` padding prop when the value is exactly 4/8/16/24/32 px. For any even px value not in that set (e.g. 20 px = `1.25rem`, 28 px = `1.75rem`, 36 px = `2.25rem`), use `fixedPaddingTop` / `fixedPaddingBottom` / `fixedPaddingLeft` / `fixedPaddingRight` or `fixedGap` with a plain rem value. Never use `var(--pds-style--space8--N)` in `fixedPadding*` or `fixedGap` — rem literals are preferred.

## 6.6 — UPL shell exception (46 px left/right rails)

The UPL main interface shell uses **46 px left and right insets**:

- Left 46 px rail reserves space for the absolutely positioned sidebar collapse button
- Right 46 px keeps symmetrical page inset

This is an explicit exception to the 4/8 grid. Use `46px` only for UPL shell horizontal insets (`padding-left`, `padding-right`, `fixedPaddingLeft`, `fixedPaddingRight`) — nowhere else.

---

## Rules

76. All layout spacing must sit on the **4 / 8 px grid** — never ship arbitrary pixel values.
77. Use the **regular 8 px scale** (8, 16, 24, 32 px) for container padding, flex/grid gaps, section margins, and page content spacing.
78. Use the **fine 4 px scale** (4, 12 px) for icon-to-text gap, compact chip/tag padding, optical tweaks, and tight intra-component spacing.
79. **Decision order:** start at 8 px scale → step down within 8 px scale (e.g. 16 → 8) → try 4 or 12 px inside one component → discuss if no step fits.
80. For Podium/Mantine: use **theme spacing tokens** (`xs`, `sm`, `md`, `lg`, `xl`) or design-system spacing props — not raw px/rem literals in `gap`, `p`, `m`, or `sx`.
81. Filter-region baseline (P1.2.1): top padding 16 px, bottom padding 8 px, same-row control gap 16 px, wrapped-row gap 8 px.
82. Sidebar ↔ main workspace gap is 16 px.
83. Implement the filter region with nested `PdsBox`: filter column `topPadding="md"` + `bottomPadding="sm"` + `gap="lg"`; row `fixedGap="1rem"`.
84. Use `fixedGap="1rem"` between sidebar and main pane when the gap prop scale cannot express 16 px.
85. **UPL exception:** `46px` left + right shell insets are allowed only on the main interface shell (left rail also hosts absolute sidebar collapse button).
86. Outside that UPL shell exception, never ship raw px/rem literals for layout spacing.

---

## Common mistakes (U6)

- ❌ Hard-coding arbitrary px values (e.g. 14 px, 22 px) — use the 4/8 px grid (U6.76).
- ❌ Using fine spacing (4/12 px) for section-level layout — reserve for intra-component work (U6.78).
- ❌ Skipping the decision guide and inventing one-off gaps — step down the scale first, then discuss (U6.79).
