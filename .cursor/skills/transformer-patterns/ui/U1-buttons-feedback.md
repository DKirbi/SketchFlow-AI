# U1 — Buttons + feedback

## Related patterns

- Stateful button commit flows: **P3** (Stateful Button).
- Toast outcome colours: **P4** (Toast).
- P7 destructive confirm button: **P7** (Confirmation Dialog), **U4** (Overlays).
- Inline/modal Save button styling: **U3** (Forms), **U4** (Overlays).

---

## Rules

7. Apply **exactly one** semantic `color` token per button or badge; default `neutral` when role is unclear.
8. Use `action` for controls that **trigger work** (confirm, save, submit, apply) — **agnostic** of good/bad outcome. This is the primary action colour.
9. Do **not** use **`attention` / `warning` / `success`** as arbitrary decorative paints on buttons — they encode **status** and must carry semantic weight.
10. `success` is **almost never** a button — use for **state** (toast, badge, check mark). Exception: explicit positive cues like "username available".
11. Use `warning` for **destructive verbs** and hard errors — **not** for reversible ops (**Hide**, **Archive** → `neutral`). Pair with subtle/outline/ghost ranks by default; `fill warning` only on P7 confirm buttons after operator opts in.
12. Allow **one `fill`** per **action cluster**; if two controls need `fill`, **split or reorder** the cluster.
13. Use `outline` as the default **secondary** rank for utilities and toolbar actions. Valid as local primary on gray panels with opaque/tinted outline.
14. Use `subtle` as the default rank for **Cancel / dismiss** in modal footers — more visibly tappable than `ghost`. Also valid as primary among equals in ghost-heavy toolbars when using the same semantic colour.
15. Reserve `ghost` for **back**, **tertiary**, and **deprioritised** destructive affordances in dense lists. Default for icon-only rows where most peers are also `ghost`.
16. Choose **`rank` from the control's role in the cluster**, **not** from hue alone.
17. Pair `warning` destructive colour with `subtle`, `outline`, or `ghost` rank **by default** in rows and menus. Exception: **`fill` + `warning`** **only** on the **confirm** button **inside P7** after the operator has opted in.
18. Never promote `brand-primary` to default primary **commit** colour.
19. On `brand-secondary` surfaces, set nested components to `surface="on-dark"` where the API requires it — **do not** mix `on-light` and `on-dark` inside one overlay surface.
20. Map outcomes: success toast → `success`; error toast → `warning`; soft caution → `attention`.
21. Keep informational badges and **counters** `neutral` — do not sentiment-tint generic counts.
22. Default button `size` → `md`; use `sm` one **hierarchy level** deeper; `xs` **only** for **icon-only** dense row controls.
23. Treat **"primary"** as **situational**: the **single** most important control **in that cluster**, via **`rank` + `color`**, not a global component preset.
24. Keep **emphasis monotonic** within a cluster — **no** rank zig-zag ("wavy" outline–subtle–outline patterns).
25. When three distinct levels are justified, ladder **`ghost` → `subtle` → `fill`** within **one** semantic colour family.
26. Do **not** make `outline` the visually **strongest** neighbour of `subtle` as "secondary" — **`subtle` can outweigh `outline`**; use `fill` for the real commit when `subtle` is cancel/dismiss beside it.
27. Do **not** place **`neutral`-coloured** and **`action`-coloured** buttons **side by side** in one **horizontal** cluster — pick **one** family for that strip.
28. `outline` **may** be the cluster primary when context warrants — transparent or **opaque/tinted** outline per Podium — valid **local** emphasis.
29. Do **not** add **decorative** rank differences unrelated to **real** task importance.
30. When **one** action is clearly dominant, use **one** clear step up (e.g. **`ghost` / `outline` peers + `fill`** or strong `outline` for the single primary) — **avoid** gratuitous **three-rank** stacks.
31. **Start** new compositions `neutral`; move the **entire** relevant cluster to `action` when the **CTA is urgent and habitual**.
32. Do **not** pair **two `fill`** buttons **adjacently** — **at most one `fill` per coherent view or cluster**.
33. On **light gray** toolbars/cards, **outline + opaque/tint** can read as **local** primary against `ghost` siblings.
34. In **icon-dense** strips, keep peers `ghost`; elevate **exactly one** key action by **rank** (e.g. `subtle`), **not** by colour alone at the **same** rank.
35. For **equal-importance** utilities, default `ghost` + **optional leading icon**.
36. Prefer **text-first**; add icons only when they **disambiguate** or **speed scanning** — reject **icon + multi-rank** noise in footers without cause.
37. Use `intensity` only to **nudge** emphasis — **never** as a substitute for fixing `rank`.

---

## Common mistakes (U1)

- ❌ Using `success` as a button colour — it's a state, not an action (U1.10).
- ❌ Making two `fill` buttons side by side — one `fill` per cluster maximum (U1.12, U1.32).
- ❌ Placing `neutral` and `action` buttons in the same horizontal row — pick one semantic family (U1.27).
- ❌ Using `fill warning` in table rows — `fill warning` is only for P7 confirm buttons (U1.17).
- ❌ Using "wavy" rank patterns (outline-subtle-outline) — emphasis should be monotonic (U1.24).
