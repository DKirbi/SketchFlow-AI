# UI Patterns — Agent rules (machine-optimised)

> Terse, numbered, imperative rules for LLM/coding-agent consumption (**high-fidelity / Podium** semantic props).
> For vocabulary tables, Storybook embeds, gap analysis, and **`Pds*`** inventory see [`UI_PATTERNS.md`](UI_PATTERNS.md).
> For **UX flow** behaviour (**P1–P10**) see [`UX_PATTERNS_AGENT.md`](UX_PATTERNS_AGENT.md) — that document wins on **interaction** when the two differ.

---

## How to use

1. Load [`UX_PATTERNS_AGENT.md`](UX_PATTERNS_AGENT.md) first for **interaction** constraints (P1–P10).
2. Apply every numbered rule below when choosing **Podium** semantics: `color`, `rank`, `surface`, `size`, typography roles, and composition calls in [**`UI_PATTERNS.md`**](UI_PATTERNS.md) §1–§5.
3. **`Pds*` prop names and allowed unions** — verify against installed `@podium-design-system/react-components` typings or **future high-fidelity API documentation**; refresh [`UI_PATTERNS.md`](UI_PATTERNS.md) when the package drifts.
4. When a visual rule here appears to conflict with **P1–P10**, follow **UX** for behaviour and reconcile props after (e.g. modal footer order, P7 destructive flow).

---

## U0 — Imports and internal-tool baseline

1. Prefer **`PdsMantine*`** over non-Mantine **`Pds*`** for the same role when both exist — the plain `Pds*` entry is often deprecated.
2. Carry meaning with **structure** and **semantic state**, not decorative chroma.
3. Reserve colour for **semantic intent**; if you cannot name the intent, use **`neutral`**.
4. **`brand-primary`** is **not** the default operator **action** colour — use **`action`** (`#1F58CF` in the canonical table).
5. Default posture for internal tools: **`neutral` or `action`**, **`md`**, **`outline` or `subtle`**, **`on-light`**.

---

## U1 — Buttons + feedback

6. Apply **exactly one** semantic `color` token per button or badge; default **`neutral`** when role is unclear.
7. Use **`action`** for controls that **trigger work** (confirm, save, submit, apply) — **agnostic** of good/bad outcome.
8. Do **not** use **`attention` / `warning` / `success`** as arbitrary decorative paints on buttons — they encode **status**.
9. **`success`** is **almost never** a button — use for **state** (toast, badge, check).
10. Use **`warning`** for **destructive verbs** and hard errors — **not** for reversible ops (**Hide**, **Archive** → **`neutral`**).
11. Allow **one `fill`** per **action cluster**; if two controls need `fill`, **split or reorder** the cluster.
12. Use **`outline`** as the default **secondary** rank for utilities and toolbar actions.
13. Use **`subtle`** as the default rank for **Cancel / dismiss** in modal footers — more visibly tappable than **`ghost`**.
14. Reserve **`ghost`** for **back**, **tertiary**, and **deprioritised** destructive affordances in dense lists.
15. Choose **`rank` from the control’s role in the cluster**, **not** from hue alone.
16. Pair **`warning`** destructive colour with **`subtle`**, **`outline`**, or **`ghost`** rank **by default** in rows and menus.
17. Use **`fill` + `warning`** **only** on the **confirm** button **inside P7** after the operator has opted in.
18. Never promote **`brand-primary`** to default primary **commit** colour.
19. On **`brand-secondary`** surfaces, set nested components to **`surface="on-dark"`** where the API requires it — **do not** mix `on-light` and `on-dark` inside one overlay surface.
20. Map outcomes: success toast → **`success`**; error toast → **`warning`**; soft caution → **`attention`**.
21. Keep informational badges and **counters** **`neutral`** — do not sentiment-tint generic counts.
22. Default button **`size`** → **`md`**; use **`sm`** one **hierarchy level** deeper; **`xs`** **only** for **icon-only** dense row controls.
23. Treat **“primary”** as **situational**: the **single** most important control **in that cluster**, via **`rank` + `color`**, not a global component preset.
24. Keep **emphasis monotonic** within a cluster — **no** rank zig-zag (“wavy” outline–subtle–outline patterns).
25. When three distinct levels are justified, ladder **`ghost` → `subtle` → `fill`** within **one** semantic colour family.
26. Do **not** make **`outline`** the visually **strongest** neighbour of **`subtle`** as “secondary” — **`subtle` can outweigh `outline`**; use **`fill`** for the real commit when **`subtle`** is cancel/dismiss beside it.
27. Do **not** place **`neutral`-coloured** and **`action`-coloured** buttons **side by side** in one **horizontal** cluster — pick **one** family for that strip.
28. **`outline`** **may** be the cluster primary when context warrants — transparent or **opaque/tinted** outline per Podium — valid **local** emphasis.
29. Do **not** add **decorative** rank differences unrelated to **real** task importance.
30. When **one** action is clearly dominant, use **one** clear step up (e.g. **`ghost` / `outline` peers + `fill`** or strong **`outline`** for the single primary) — **avoid** gratuitous **three-rank** stacks.
31. **Start** new compositions **`neutral`**; move the **entire** relevant cluster to **`action`** when the **CTA is urgent and habitual**.
32. Do **not** pair **two `fill`** buttons **adjacently** — **at most one `fill` per coherent view or cluster**.
33. On **light gray** toolbars/cards, **outline + opaque/tint** can read as **local** primary against **`ghost`** siblings.
34. In **icon-dense** strips, keep peers **`ghost`**; elevate **exactly one** key action by **rank** (e.g. **`subtle`**), **not** by colour alone at the **same** rank.
35. For **equal-importance** utilities, default **`ghost`** + **optional leading icon**.
36. Prefer **text-first**; add icons only when they **disambiguate** or **speed scanning** — reject **icon + multi-rank** noise in footers without cause.
37. Use **`intensity`** only to **nudge** emphasis — **never** as a substitute for fixing **`rank`**.

---

## U2 — Typography

38. Set default body copy to **`PdsFontSize` `700`** (~16px) for all internal-tool paragraphs.
39. Keep routine body/interface text in **`500`–`900`**; treat **`1100`+** as hero/display — **rare** in internal tools.
40. Map roles: **`body`** → paragraphs; **`interface`** → labels/metadata; **`table`** → cells; **`eyebrow`** → tiny section kicker, **sparing**; **`monospace`** → IDs/codes only.
41. In dense tables allow cell text at **`600`**; headers **`600`–`700`**; **never** body **below `500`**.
42. Use **`strong` weight** for **single-token** emphasis — carry hierarchy with **size**, not whole-paragraph bold.

---

## U3 — Forms + inputs

43. Default every field **`neutral` + `outline` + `md`** unless the spec narrows further.
44. Use **`action`** in **focus** chrome to mean **“this field is live”** — not ambient decoration.
45. **Read-only** fields lose the editable-border affordance; rely on **read-only text contrast**, not recolouring valid data green.
46. **Hard** validation → **`warning`** messages **adjacent** to the field (**P6** contract).
47. **Soft / unusual but accepted** values → **`attention`**.
48. Do **not** flood valid fields with **`success`** — only explicit positive cues (e.g. “username available”).
49. Mark **required** fields **typographically** — asterisk + label; **never** colour-only required signalling.
50. Keep editable fields **`md`**; step to **`sm`** only for **filter strips** or **table-inline** edits.
51. Group related inputs with **layout + labels** — **not** arbitrary background tints per field.
52. **Modal** submit footer: **`action` + `fill`** commit + **`subtle` + `neutral`** cancel — order per **P5**.
53. **Inline workspace** Save: **`action` + `fill`** + **P3 state machine**; **Reset** → **`outline` + `neutral`** — **do not** recolour the Save button across **idle/loading/success**.

---

## U4 — Overlays + navigation

54. Default modal/drawer/chrome to **`surface="on-light"`** unless the parent is explicitly dark.
55. For **`on-dark`** parents, flip **all** nested Podium controls consistently — **no** mixed-surface overlays.
56. **Modal** commit: **`fill` + `action`** rightmost; **`subtle` + `neutral`** cancel immediately **left** of commit.
57. **P7 destructive confirm** confirm button: **`fill` + `warning`** — **only** in that stacked confirmation surface.
58. Treat drawers/popovers as **structural** — **neutral**, low rank; **escalate** real commits to **P5** modals, not crowded popovers.
59. **Tabs**: carry selection with **underline/active chrome**; keep tab **label text `neutral`**; optional **`attention`** on **“needs review”** counters when specified.
60. **Menu** rows stay **`neutral`**; **destructive** row → **`warning` + `ghost`**.
61. **P7** dialog: title/message sizes per [`UI_PATTERNS.md`](UI_PATTERNS.md) §4.5; confirm **`action`** (affirmative) or **`warning`** (destructive); cancel **`subtle` + `neutral`**.

---

## U5 — Tables, filters, row actions

62. Colour **status** cells **only** with semantic meaning — **always** show a **text label** with the status colour.
63. Place **status** adornment at **`sm` or `xs`**, **`subtle`** rank inside cells.
64. **Edit / View** row primaries → **`outline` or `subtle`**, **`neutral`** — **avoid** repeating **`fill`** down a column.
65. **Remove / Delete** in-row → **`ghost` + `warning`** or **`subtle` + `warning`** — **never `fill` + `warning`** in the row.
66. **Reversible** row toggles (**Hide**, **Map**) → **`neutral`** + **P3** semantics — **no** hue swap across states.
67. Table **header** controls → **`sm`**; **body** controls → **`sm`**; **inline icon-only** → **`xs`**.
68. Body **cell text** → **`table`** role at **`600`–`700`** per density rules.
69. **Filter chips**: inactive **`outline` + `neutral`**; active **`subtle`**; apply **`action`** **only** when the chip encodes an **active mutation filter** — generic “selected” ≠ automatic **`action`** colour.
70. **Clear-all** chip → **`ghost` + `neutral`** at the **end** of the active strip.
71. **Bulk destructive** → **`warning`** + **`outline` or `subtle`**, **disabled** until a selection exists.
72. **Bulk import** CTA → **`action` + `outline`** — **do not `fill`** beside another competing primary.
73. **`~10%` neutral** loading blanket over the table body during bulk processing — block interaction underneath.
74. Row **expand** control → **`ghost` + `neutral`** without chroma state.
75. **Sticky** expanded parent row (**P10**) keeps ordinary row chrome — **chevron/rotation** shows expansion, not a new background colour.

---

## Global

76. When installed Podium types or **MCP** disagree with these rules, **update the source** in [`UI_PATTERNS.md`](UI_PATTERNS.md) first, then mirror here in the same change-set.
77. **`Subtle` in a modal footer** is almost always **Cancel** beside **`fill` commit**; **`subtle` in a ghost-heavy toolbar** may instead mean **primary among equals** (same semantic colour as peer **ghosts**) — see [`UI_PATTERNS.md`](UI_PATTERNS.md) §1.2. [`UI_PATTERNS.md`](UI_PATTERNS.md), [`UX_PATTERNS_AGENT.md`](UX_PATTERNS_AGENT.md), [`NL_COMPONENT_MAPPING_HI_FI.md`](NL_COMPONENT_MAPPING_HI_FI.md)._
