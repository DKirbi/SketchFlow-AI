# U0 — Imports and internal-tool baseline

Podium ships with a **minimalistic, "invisible" base appearance** on purpose — for heavy data interfaces operators use daily.

## Internal-tool UX baseline

1. **Lower cognitive load.** Meaning via **structure, typography, and semantic state** — not decorative chroma.
2. **Color = semantic intent only.** If colour does not signal status (`success`, `warning`, `attention`) or action (`action`), use `neutral`.
3. **Brand colour is rare.** `brand-primary` / `brand-secondary` are contextual accents — never default primary action colour.

**Default posture:** `neutral` or `action`, `md`, `outline` or `subtle`, `on-light`. Exceptions must justify themselves.

### Prefer Mantine-backed Podium components

When the package exposes **two** exports for the same role (e.g. `PdsButton` and `PdsMantineButton`), **prefer `PdsMantine*`** — plain `Pds*` is often deprecated. Where **no** `PdsMantine*` exists yet, use the shipped `Pds*` API normally. Semantic props apply the same either way.

---

## Core semantic vocabulary

The seven types below are the **only** Podium semantic props this rulebook treats as load-bearing. Every UI Pattern in §1–§6 is expressed in terms of these.

### `PdsColor` — semantic intent

| Token       | Hex           | Meaning                                                                               |
| ----------- | ------------- | ------------------------------------------------------------------------------------- |
| `action`    | `#1F58CF` | Active/primary action. Triggers an effect; **agnostic of consequence** (good or bad). |
| `attention` | `#E69000` | Soft warning. Something needs care, may need follow-up — **not** an error.            |
| `warning`   | `#D20300` | Hard error / destructive. Urgent attention; reserved for irreversible action verbs.   |
| `success`   | `#087A27` | Operation finished. Almost always a **state**, rarely an action. Pair with a check.   |
| `neutral`   | `#000000` | Default text/state. Often on a **7% black** background to mark "agnostic / not yet".  |

**When to use:**

- Use exactly one semantic token per element. If you cannot pick one, the answer is `neutral`.
- `success` is almost never a button — it is a finished state.
- `warning` is reserved for destructive verbs (Delete, Remove, Discard) and hard errors. It is **not** a "bad outcome" colour — see UX **P7** confirmation.

### `PdsBrandColor` — rare brand accents

| Token             | Used as                                                                                                                                                                             |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `brand-secondary` | Dark blue. Occasional surface/accent — accordion headers grouping heavy data, sidebar menus signalling a sport or top-level domain. Triggers `on-dark` surface for nested controls. |
| `brand-primary`   | Red. **Marketing only** in practice. Avoid as the primary action colour — red carries error semantics in interface design.                                                          |

**When to use:**

- Default answer is **don't**. Reach for `brand-secondary` only when the surface signals a **major hierarchical context** (sport rail, app-level header strip).
- Never use `brand-primary` as the active/primary action colour. That role belongs to `action` (`#1F58CF`).

### `PdsRank` — emphasis ladder

| Rank      | Treatment                                        | Default home                                                        |
| --------- | ------------------------------------------------ | ------------------------------------------------------------------- |
| `fill`    | Solid background, **highest emphasis**.          | Primary confirmation actions (modal commit, primary form submit).   |
| `outline` | Bordered, transparent fill, **medium emphasis**. | Secondary buttons, utility actions, default form fields.            |
| `subtle`  | 7% black background, **low emphasis**.           | Cancel, dismiss — secondary cluster more common than `ghost`.       |
| `ghost`   | Minimal chrome, **lowest emphasis**.             | Back, tertiary actions, deprioritised remove/delete in dense lists. |

**When to use:**

- Pick rank from the **role** in the cluster, not from the colour. A destructive action in `warning` colour is still usually `subtle` or `outline` rank — never a screaming `fill warning` button.
- One `fill` per cluster. If two controls compete for `fill`, the cluster is wrong, not the rank.

### `PdsIntensity` — human emphasis tuning

`low | high`. A **human-perspective** dial: occasionally a control needs to read at a glance in a dense layout, regardless of rank. Do not use `intensity` to substitute for rank — use it to nudge a single control inside an already-correct hierarchy.

### `PdsSurface` — runtime contrast context

`on-light | on-dark`. The active runtime guidance for components placed on dark surfaces (e.g. on `brand-secondary` backgrounds, sidebar rails, dark mode). When dark mode ships, every component on the dark surface flips to `on-dark`.

### `PdsSize` — hierarchy and density

`xs | sm | md | lg | xl`. Default `md`.

- `md` — outermost / canonical control level.
- `sm` — one hierarchy level below (nested action, secondary toolbar).
- `xs` — dense rows, inline icon buttons inside tables, repeating chips.
- **`lg` / `xl`** — rarely used in internal tools. Reserve for hero / marketing contexts.

Size also encodes **density**: dense data tables can drop to `sm` for headers and row controls, `xs` for inline-edit cells. It is **not** a visual variety dial.

On **`PdsBox`**, padding props (`topPadding`, `bottomPadding`, `leftPadding`, `rightPadding`, `verticalPadding`, `horizontalPadding`) map to CSS tokens:

| Prop | rem | px |
|------|-----|-----|
| `xs` | 0.25rem | 4px |
| `sm` | 0.5rem | 8px |
| `md` | 1rem | 16px |
| `lg` | 1.5rem | 24px |
| `xl` | 2rem | 32px |

The `gap` prop uses a **separate, finer scale** (e.g. `lg` ≈ 0.5rem = 8px). When a gap value does not map cleanly on that scale, use `fixedGap="Xrem"` instead of a CSS custom property.

### `PdsFontSize` — typography scale

Numeric ladder. **`700` is the default body** (~16px). Range used in internal tools: roughly **`500`–`900`** for body and interface text; reserve `1100+` for hero/headline contexts that internal tools rarely need.

> Web defaults still apply: prefer `rem`/`px` thinking when reasoning about scale; the numeric token just maps to one of those values.

---

## Rules

1. Prefer `PdsMantine*` over non-Mantine `Pds*` for the same role when both exist — the plain `Pds*` entry is often deprecated.
2. Carry meaning with **structure** and **semantic state**, not decorative chroma.
3. Reserve colour for **semantic intent**; if you cannot name the intent, use `neutral`.
4. `brand-primary` is **not** the default operator **action** colour — use `action` (`#1F58CF`).
5. Default posture for internal tools: **`neutral` or `action`**, `md`, **`outline` or `subtle`**, `on-light`.
6. When installed Podium types disagree with these rules, **update the source** in vocabulary tables in this file first, then mirror here in the same change-set.

---

## Common mistakes (U0)

- ❌ Using `brand-primary` for primary actions — primary actions use `action` colour (U0.4).
- ❌ Using decorative chroma instead of structure and semantic state (U0.2).
