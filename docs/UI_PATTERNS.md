# Podium semantic types — UI Pattern rulebook

**Audience:** agents and humans building **high-fidelity** (`/high-fidelity`) demos with `@podium-design-system/react-components`. **Companion:** [`UI_PATTERNS_AGENT.md`](UI_PATTERNS_AGENT.md) (terse machine rules for this rulebook), [`NL_COMPONENT_MAPPING_HI_FI.md`](NL_COMPONENT_MAPPING_HI_FI.md) (phrase → component starting map), [`UX_PATTERNS_AGENT.md`](UX_PATTERNS_AGENT.md) (P1–P10 behaviour).

**Authority for literals and drift:** this page mirrors **`@podium-design-system/react-components`** (`dist/lib/types/*.d.ts`). When props change in a newer PDS release, update this file. **future high-fidelity API documentation** (`future design-system API source`) remains the source for examples, accessibility notes, and Mantine cross-references.

**Install note:** root `npm install` may require **`--legacy-peer-deps`** because Podium declares a narrow `@types/react` peer while the workspace uses a newer `@types/react`. This export omits Podium/Mantine runtime dependencies and MCP configuration; restore them in a future setup before implementation.

---

## How this doc works

This file does three things:

1. Defines a **small, opinionated vocabulary** of Podium semantic props that carry meaning in internal-tool UI.
2. Encodes that vocabulary as a **numbered UI Pattern rulebook** (1.x → 5.x) you can quote when generating high-fidelity prototypes. The rulebook reinforces — never contradicts — the **UX flow patterns P1–P10** in [`UX_PATTERNS_AGENT.md`](UX_PATTERNS_AGENT.md).
3. Serves as the **source** for [`UI_PATTERNS_AGENT.md`](UI_PATTERNS_AGENT.md) — terse, imperative rules for LLMs derived from this document without duplicating vocabulary tables or the component inventory.

Read in order: **internal-tool UX baseline** → **core semantic vocabulary** → **UI Patterns 1.x–5.x**.

---

## Prefer Mantine-backed Podium components (high-fidelity prompts)

When `@podium-design-system/react-components` exposes **two** exports for the same role — for example **`PdsButton`** and **`PdsMantineButton`**, **`PdsText`** and **`PdsMantineText`**, **`PdsBadge`** and **`PdsMantineBadge`** — **always prefer the `PdsMantine*` component** for high-fidelity prototypes and for agent-generated code. The non-Mantine `Pds*` variants are often **deprecated** in JSDoc (e.g. “Please use `PdsMantine…` instead”) and are expected to be **removed in a future major release**.

**Many primitives still ship only as `Pds*`.** Where there is **no** `PdsMantine*` counterpart yet, that component is **not** legacy by default — it is simply **waiting for its Mantine release**. Use those **`Pds*`** exports as normal during the high-fidelity prototype phase until a matching **`PdsMantine*`** lands in the package.

This is **not** an additional numbered UI Pattern (it does not change P1–P10 behaviour). It is an **implementation and import rule**: semantic props (`color`, `rank`, `surface`, `size`, etc.) still apply the same way — prefer **`PdsMantine*`** **when both APIs exist**; otherwise use the **only shipped** API. Brief writers and agents prompting **`/high-fidelity`** should default to **`PdsMantine*`** whenever both names exist, unless a stakeholder explicitly requests a deprecated `Pds*` for migration testing.

---

## Internal-tool UX baseline

Podium components ship with an intentionally **minimalistic, "invisible" base appearance**. That is not an accident — it is a UX practice for **heavy data interfaces** that operators visit daily. Three principles drive every rule below:

1. **Lower cognitive load.** Meaning is carried by **structure, typography, and semantic state** — not by chroma. The interface should fade into the background so the data and operator's task stay foreground.
2. **Color is reserved for semantic intent**, not decoration. If a colour does not communicate **status** (`success`, `warning`, `attention`) or **action** (`action`), it should be `neutral`.
3. **Brand colour is rare and contextual.** `brand-primary` and `brand-secondary` exist for marketing, hierarchy markers, or surface accents — never as the default colour for primary actions.

In practice this means: most controls in an internal tool surface should be `neutral` or `action`, sized `md`, ranked `outline` or `subtle`, on an `on-light` surface. Anything else is an exception that should justify itself.

---

## Core semantic vocabulary

The seven types below are the **only** Podium semantic props this rulebook treats as load-bearing. Every UI Pattern in §1–§5 is expressed in terms of these.

### `PdsColor` — semantic intent

| Token       | Hex           | Meaning                                                                               |
| ----------- | ------------- | ------------------------------------------------------------------------------------- |
| `action`    | **`#1F58CF`** | Active/primary action. Triggers an effect; **agnostic of consequence** (good or bad). |
| `attention` | **`#E69000`** | Soft warning. Something needs care, may need follow-up — **not** an error.            |
| `warning`   | **`#D20300`** | Hard error / destructive. Urgent attention; reserved for irreversible action verbs.   |
| `success`   | **`#087A27`** | Operation finished. Almost always a **state**, rarely an action. Pair with a check.   |
| `neutral`   | **`#000000`** | Default text/state. Often on a **7% black** background to mark "agnostic / not yet".  |

**When to use:**

- Use exactly one semantic token per element. If you cannot pick one, the answer is `neutral`.
- `success` is almost never a button — it is a finished state.
- `warning` is reserved for destructive verbs (Delete, Remove, Discard) and hard errors. It is **not** a "bad outcome" colour — see UX [`P7` confirmation](UX_PATTERNS_AGENT.md#p7--confirmation-dialog).

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

`xs | sm | md | lg | xl`. Default **`md`**.

- **`md`** — outermost / canonical control level.
- **`sm`** — one hierarchy level below (nested action, secondary toolbar).
- **`xs`** — dense rows, inline icon buttons inside tables, repeating chips.
- **`lg` / `xl`** — rarely used in internal tools. Reserve for hero / marketing contexts.

Size also encodes **density**: dense data tables can drop to `sm` for headers and row controls, `xs` for inline-edit cells. It is **not** a visual variety dial.

### `PdsFontSize` — typography scale

Numeric ladder. **`700` is the default body** (~16px). Range used in internal tools: roughly **`500`–`900`** for body and interface text; reserve `1100+` for hero/headline contexts that internal tools rarely need.

> Web defaults still apply: prefer `rem`/`px` thinking when reasoning about scale; the numeric token just maps to one of those values.

---

## UI Patterns

Numbered rules for how the core semantic vocabulary is applied to components. Ordered by **complexity** so foundational primitives (Buttons, Typography) are settled before they compose into surfaces (Forms, Overlays) and the highest-density compositions (Tables, Filters, Row actions).

Each rule cross-references **UX flow patterns** (P1–P10) where the semantics reinforce the interaction rules in [`UX_PATTERNS_AGENT.md`](UX_PATTERNS_AGENT.md).

---

### 1. Buttons + feedback

Foundational — every other surface composes buttons and status feedback.

#### 1.1 — Action color hierarchy

- Use `action` for **affordances that trigger something**: confirm, save, submit, apply. The result may be positive or negative; `action` does not pre-judge.
- Use `attention`, `warning`, `success` only as **semantic statuses**, not decoration.
- Default colour for any button without a clear semantic role is `neutral`.

> **UX:** [P2 (row actions)](UX_PATTERNS_AGENT.md#p2--data-table), [P3 (stateful button)](UX_PATTERNS_AGENT.md#p3--stateful-button)

#### 1.2 — Rank emphasis ladder

- One `fill` per action cluster. Primary commit only.
- `outline` is the default secondary rank for utility actions and toolbar controls.
- `subtle` is the most common rank for **Cancel** and dismiss controls — preferred over `ghost` because it remains visibly tappable.
- `ghost` is reserved for back, tertiary, and deprioritised destructive actions where you do **not** want the eye to land first.
- Within a **single cluster**, step ranks **monotonically** in one direction (lowest → highest emphasis). **Do not** alternate ranks in a “wavy” sequence (e.g. `outline` → `subtle` → `outline`) — see [§ 1.7](#17--button-hierarchy-podium-do--dont).
- In **dense toolbars** where **most** actions are **`ghost`**, the **one** emphasised utility may use **`subtle`** at the **same** semantic colour (primary among ghosts). That pattern is **different** from the modal footer, where **`subtle`** is **Cancel** beside a **`fill`** commit ([§ 4.2](#42--modal-commit-emphasis)).
- **Icons:** prefer **plain labels**; add **leading icons** only when they **disambiguate** or aid **scanning** (e.g. equal-importance **ghost** utilities). Avoid **icons on every** control **plus** multiple ranks without justification — [§ 1.7](#17--button-hierarchy-podium-do--dont).

> **UX:** [P5 (modal footer)](UX_PATTERNS_AGENT.md#p5--modal), [P7 (confirmation)](UX_PATTERNS_AGENT.md#p7--confirmation-dialog)

#### 1.3 — Destructive action semantics

- Destructive verbs (Delete, Remove, Discard) take `warning` colour.
- Pair `warning` with **lowered rank** (`subtle`, `outline`, or `ghost`) by default. A `fill warning` button is reserved for the **confirm step** of a P7 confirmation dialog where the operator has already opted into the destructive path.
- Never use `warning` for outcomes that are reversible (Hide, Archive). Those are `neutral`.

> **UX:** [P2.2 (destructive row actions)](UX_PATTERNS_AGENT.md#p22--row-actions), [P7.105 (`variant="primary"` on destructive confirm)](UX_PATTERNS_AGENT.md#p7--confirmation-dialog)

<!-- storybook:embed UI_ButtonColorRank -->

#### 1.4 — Brand colour guardrails

- `brand-primary` is **never** the default primary action colour. Primary action = `action` colour.
- `brand-secondary` may appear as a surface accent (sidebar rail, accordion header for a top-level domain). Components placed on `brand-secondary` flip to `surface="on-dark"`.

#### 1.5 — Feedback (toast, notification, badge) follows operation outcome

- Success toasts: `success` colour.
- Error toasts: `warning` colour.
- Caution / soft-warning toasts and notifications: `attention` colour.
- Informational badges and counters: `neutral`. Do not colourise count badges by sentiment.

> **UX:** [P3 → P4 sequencing (loading → toast)](UX_PATTERNS_AGENT.md#p3--stateful-button), [P4 (toast notification messages)](UX_PATTERNS_AGENT.md#p4--toast-notification-messages)

<!-- storybook:embed UI_BrandAndFeedbackBadges -->

#### 1.6 — Size in clusters

- Default button size is `md`. Step down to `sm` when the button lives one hierarchy level below the canonical level (nested toolbar, modal subaction).
- `xs` only for icon-only row buttons inside dense tables.

#### 1.7 — Button hierarchy: Podium Do / Don't

These guidelines align Podium **Ghost / Subtle / Outlined / Filled** with **`PdsRank`** (`ghost` → `subtle` → `outline` → `fill`) and **`PdsColor`** (`neutral` vs `action`). They reinforce [§ 1.1](#11--action-color-hierarchy) and [§ 1.2](#12--rank-emphasis-ladder); they do not override modal footer defaults in [§ 4.2](#42--modal-commit-emphasis) or row-action constraints in [§ 5.2](#52--row-actions).

**Baseline**

- **Primary** means the control that should read as **most important in that cluster**, expressed through **rank** (and semantic colour), not a single global component variant.
- Within a cluster, **visual emphasis should increase monotonically** in one direction (e.g. left-to-right or by a clear primary slot). Avoid “wavy” emphasis where rank jumps back and forth.

**Do / Don't pairs**

| Do | Don't |
| --- | --- |
| For a **classic three-step** ladder when you need tertiary → secondary → strongest, use **`ghost` → `subtle` → `fill`** (same semantic colour family). | Do **not** place **`outline` as the strongest** action **next to `subtle` as “secondary”** — **`subtle` can read heavier than `outline`**, reversing the intended order. Prefer **`fill`** for the true commit when **`subtle`** sits beside it as cancel/dismiss. |
| Keep **one semantic colour per group**: either all **`neutral`** (e.g. ghost secondaries + subtle primary-among-neutrals) or all **`action`**. | Do **not** mix **`neutral` and `action`** in the **same horizontal cluster** (e.g. gray utilities beside a blue primary in one strip). |
| **`outline` is a valid primary** in many contexts; use **transparent** or **opaque / tinted outline** when the surface or Podium API calls for it (local emphasis on gray panels). | Do **not** invent **rank contrast** (e.g. unrelated ghost + subtle pairings) where **task importance** does not warrant hierarchy — no decorative emphasis. |
| When actions are **grouped** and **one** path is clearly strongest, use **one** clear step up (e.g. ghost/outline peers + **`fill`** or strong **outline** for the single primary). | Do **not** stack **three ranks** “for variety” — **ghost + subtle + fill** without need adds noise and cognitive load. |
| **Start** new UI in **`neutral`**; move the **whole cluster** to **`action`** when the CTA is **urgent and frequent** (still one semantic family per cluster). | Do **not** place **two `fill`** buttons **side by side**; **rule of thumb: one `fill` per view** (or per coherent action cluster). |
| On **light gray** toolbars or cards, **outline with an opaque / tinted field** can mark the **local** primary against **`ghost`** neighbours. | Do **not** use **non-monotonic** rank sequences in one cluster (e.g. outline–subtle–outline) — emphasis should **not** zig-zag. |
| For **icon-heavy** rows: keep most controls **`ghost`**; give the **single** key action a **stronger rank** (e.g. **`subtle`**), not merely a different hue at the same rank. | Do **not** distinguish primary **only by colour** while **rank** stays identical for every control (e.g. all **`outline`**, only primary recoloured). |
| For **equally important** actions, prefer **`ghost`** with **optional leading icon** (filter, export, print patterns). | Do **not** overload footers with **icons on every** control **and** multiple ranks without justification — default **text-first**; add icons only when they **disambiguate** or aid **scanning**. |

> **UX:** [P5 (modal footer)](UX_PATTERNS_AGENT.md#p5--modal), [P7 (confirmation)](UX_PATTERNS_AGENT.md#p7--confirmation-dialog), [P2.2 (row actions)](UX_PATTERNS_AGENT.md#p22--row-actions)

<!-- storybook:embed UI_ButtonHierarchyDoDont -->

---

### 2. Typography

A pure visual primitive with no interaction contract — but the readability baseline for every data-heavy screen.

#### 2.1 — Default body size

- `PdsFontSize=700` (~16px) is the body baseline for **all** internal-tool prototypes. Don't decorate paragraphs with smaller sizes.

#### 2.2 — Practical range

- Body and interface text live in **`500`–`900`**. Outside that range is an exception.
- `1100`+ is hero / display only — internal tools rarely need it. If a screen reaches for `1500`, ask whether it is internal or marketing.

#### 2.3 — Text role hierarchy

- `body` for paragraphs and message copy.
- `interface` for labels, inline metadata, control-adjacent text.
- `table` for cells inside data tables (sized so `sm` and `xs` row controls remain legible).
- `eyebrow` for tiny section eyebrows above titles — sparingly.
- `monospace` only for IDs, codes, and structured strings (e.g. `j.smith`, `ID 180564`).

> **UX:** [P1 (workspace shell readability)](UX_PATTERNS_AGENT.md#p1--workspace-upl), [P2 (data table)](UX_PATTERNS_AGENT.md#p2--data-table)

#### 2.4 — Density without sacrificing legibility

- Inside dense tables, body cell text may step down to **`600`** (~14px). Header cells stay at `600`–`700`.
- **Never** drop body text below `500` (~12px) for legibility — even in chips or compact inline edits.

#### 2.5 — Weight discipline

- `PdsFontWeight` is `base | strong`. Use `strong` for **single-token emphasis** (a label, a status word, a counter), not entire sentences.
- Hierarchy is carried by **size**, not weight. If you find yourself bolding paragraphs, the size step is wrong.

<!-- storybook:embed UI_TypographyRoles -->

---

### 3. Forms + inputs

Composes typography, buttons, and status semantics into editable surfaces.

#### 3.1 — Default field state

- Default colour: `neutral`.
- Default rank: `outline` (the editable border carries the affordance).
- Default size: `md`.

> **UX:** [P6 (inline validation)](UX_PATTERNS_AGENT.md#p6--inline-validation)

#### 3.2 — Active and focus

- Focus state uses `action` colour to signal "this field is live", not as decoration.
- Read-only fields lose the editable border and use `text-contrast="read-only"` rather than colour change.

#### 3.3 — Validation messaging

- **Hard error** (required missing, format invalid): `warning` colour, message adjacent to the field per UX P6.
- **Soft warning** (value accepted but unusual, will need follow-up): `attention` colour.
- **Success state** in a form is almost never appropriate — exceptions: explicit confirmation cues (e.g. "username available"). Do not paint every valid field green.
- Required-field marking is **typographic** (asterisk + adjacent label) over colour — colour-only marking fails accessibility.

> **UX:** [P6 (inline validation)](UX_PATTERNS_AGENT.md#p6--inline-validation), [R2 — validation and save gating (UX_PATTERNS.md)](UX_PATTERNS.md#r2-validation-and-save-gating)

#### 3.4 — Field grouping and size

- Editable fields stay at `md` even inside dense forms. Step down to `sm` only for filter strips or table-inline edits where horizontal space is constrained.
- Group related fields with surface contrast and label hierarchy — not by tinting field backgrounds.

#### 3.5 — Submit cluster

- Modal submit cluster: `action` + `fill` (commit) + `subtle neutral` (cancel) — see [§4.2](#42--modal-commit-emphasis).
- Inline workspace footer: `action` + `fill` (Save changes) + `outline neutral` (Reset changes). UX [P3 stateful button](UX_PATTERNS_AGENT.md#p3--stateful-button) controls the loading/success states; colour does not change during the sequence.

> **UX:** [P5 (modal)](UX_PATTERNS_AGENT.md#p5--modal), [P9 (filters)](UX_PATTERNS_AGENT.md#p9--filters)

<!-- storybook:embed UI_FormFieldValidation -->

---

### 4. Overlays + navigation

Adds the surface dimension. Overlays are where `PdsSurface` matters.

#### 4.1 — Surface defaults

- Default surface: `on-light`. Most modals, drawers, popovers, tabs, and menus sit on a white card on a light page.
- Use `on-dark` only when the overlay is rendered on a `brand-secondary` background (rare) or when the application is in a dark theme. The flip is **all-or-nothing** for the components inside that surface — do not mix `on-dark` and `on-light` in the same overlay.

#### 4.2 — Modal commit emphasis

- Primary commit (Save, Add, Submit): `action` + `fill`.
- Cancel / Close: `subtle` + `neutral`, immediately to the left of the commit.
- Destructive confirm inside a P7 stacked overlay: `warning` + `fill` on the confirm button — this is **the** explicit exception to [§1.3](#13--destructive-action-semantics) because the operator has just opted in via P7.

> **UX:** [P5.81 (commit rightmost)](UX_PATTERNS_AGENT.md#p5--modal), [P5.91 (P7 stacking exception)](UX_PATTERNS_AGENT.md#p5--modal), [P7 (confirmation)](UX_PATTERNS_AGENT.md#p7--confirmation-dialog)

#### 4.3 — Drawer and popover defaults

- Neutral surface, no brand colour, minimal rank.
- A drawer is **structural**, not promotional — content inside it follows §3 (forms) and §5 (tables) rules normally.
- Popovers stay tight: avoid placing primary commits inside a popover; if a commit is needed, escalate to a modal (P5).

#### 4.4 — Tabs and menus

- Selection state carries the emphasis — typically an underline (tabs) or a fill background (menu hover). Do not also colourise the label.
- Tab labels stay `neutral` regardless of active state. Counts/status indicators in tab labels follow §1 (e.g. `attention` for "needs review" counters).
- Menu items stay `neutral`; destructive menu items take `warning` colour but `ghost` rank (no fill).

> **UX:** [P8 (tab navigation)](UX_PATTERNS_AGENT.md#p8--tab-navigation), [P5.80 (modal tabs)](UX_PATTERNS_AGENT.md#p5--modal)

<!-- storybook:embed UI_TabsAndMenus -->

#### 4.5 — Confirmation dialog (P7) chrome

- Title: body strong (size `700`).
- Message: body base (size `700`).
- Confirm button colour: `action` for affirmative, `warning` for destructive (per §1.3 exception).
- Cancel: `subtle neutral`.

> **UX:** [P7 (confirmation dialog)](UX_PATTERNS_AGENT.md#p7--confirmation-dialog), [P7.103–106 anatomy and rules](UX_PATTERNS_AGENT.md#p7--confirmation-dialog)

<!-- storybook:embed UI_ModalCommitAndP7 -->

---

### 5. Tables, filters, row actions

Highest-complexity composition. Tables consume every previous rule and add scanning + density constraints.

#### 5.1 — Status cells

- Status colour is **semantic only**: `success`, `warning`, `attention`. Never decorative.
- Status colour is **paired with a label** ("Active", "Failed", "Pending review") — colour alone fails accessibility and fails operators scanning the column.
- Status badges sit at `sm` or `xs` size with `subtle` rank inside cells.

> **UX:** [P2 (data table)](UX_PATTERNS_AGENT.md#p2--data-table), [P2.3 status-only column non-sortable](UX_PATTERNS_AGENT.md#p23--table-column-controls)

#### 5.2 — Row actions

- Primary row action (Edit, View): `outline` or `subtle` rank, `neutral` colour — **rarely** `fill`. Repeating `fill` controls down a column produce a striped emphasis problem.
- Destructive row action (Remove, Delete): `ghost warning` or `subtle warning`. Never `fill warning` in a row — the P7 confirmation dialog is where the destructive emphasis lives.
- Reversible row toggle (Hide / Unhide, Map / Mapped): `neutral`, follows UX P3 stateful button — colour does not change during state transitions, only label and disabled state.

> **UX:** [P2.2 (row actions)](UX_PATTERNS_AGENT.md#p22--row-actions), [P3 (stateful button)](UX_PATTERNS_AGENT.md#p3--stateful-button)

#### 5.3 — Density and sizing

- Header cells: `sm` controls (sort affordance, master select checkbox).
- Body cells: `sm` controls; `xs` only for inline icon buttons (e.g. icon-only Edit, Remove).
- Cell text: `table` text role, size `600`–`700` (per [§2.4](#24--density-without-sacrificing-legibility)).

> **UX:** [P2.1 table structure](UX_PATTERNS_AGENT.md#p2--data-table), [P10 sticky disclosure](UX_PATTERNS_AGENT.md#p10--sticky-disclosure-while-scrolling)

#### 5.4 — Filter chips and toolbar

- Filter chip default: `neutral` colour, `outline` rank when inactive, `subtle` rank when active.
- Active chip uses **`action` colour only when the chip represents an active mutation** (e.g. "Show only mine" actively filtering). Colour ≠ "selected"; selection is shown by rank/treatment.
- Clear-all chip: `ghost neutral`, sits at the end of the active-filter strip.

> **UX:** [P9 (filters)](UX_PATTERNS_AGENT.md#p9--filters), [P9.119 (active-filter chip strip)](UX_PATTERNS_AGENT.md#p9--filters)

#### 5.5 — Bulk operations

- Bulk destructive action: `warning` colour + **constrained rank** (`outline` or `subtle`), gated by selection per UX P2.4.60.
- Bulk import / upload triggers: `action` + `outline`. Do not use `fill action` for bulk import buttons sitting next to a primary table action.
- Loading overlay during bulk processing: `neutral`, ~10% opacity over the table area (UX P2.4.62).

> **UX:** [P2.4 (bulk operations)](UX_PATTERNS_AGENT.md#p24--bulk-operations)

#### 5.6 — Expandable rows

- Expand / collapse chevron: `ghost neutral`, no colour state.
- Sticky parent row inside the scrollport (UX P10) inherits the same colour rules as the body row — no special highlight when the row is expanded; the expansion chevron rotation carries the state.

> **UX:** [P2.5 (expandable rows)](UX_PATTERNS_AGENT.md#p25--expandable-rows), [P10 (sticky disclosure)](UX_PATTERNS_AGENT.md#p10--sticky-disclosure-while-scrolling)

<!-- storybook:embed UI_TableFiltersBulk -->

---

## Gap analysis — questions for the next pass

The rulebook above is the first numbered baseline. Each component family below has **uncovered intents** that would benefit from explicit guidance — please elaborate any you'd like written into the next iteration.

**1. Buttons + feedback**

- Split button (`PdsSplitButton`) rank when the secondary menu contains a destructive item — does the trigger inherit `warning`?
- Toggle button group selection state — colour vs rank vs intensity?
- Skeleton / loader colour discipline (currently implied as `neutral`).

**2. Typography**

- `eyebrow` text — when does it justify itself in an internal tool?
- `code`, `kbd`, `pre` — do these appear anywhere outside developer tooling demos?
- Long-form `display` / `headline` — explicit "do not use" rule, or carve-out cases?

**3. Forms + inputs**

- Datepicker validation — does range invalid use `warning` only, or also `attention` for "soft" out-of-bounds?
- Multiselect chip overflow — when chips don't fit, is the overflow indicator `neutral` or `action`?
- Switch (`PdsSwitch`) "on" colour — `action` always, or `success` for state-of-being toggles?

**4. Overlays + navigation**

- Drawer width and modal width policy — sizing is currently silent.
- Tooltip colour and density on `on-dark` surfaces.
- Breadcrumb interactivity affordance — colour vs underline-on-hover (UX P1.2.3.1.27).

**5. Tables, filters, row actions**

- Tag (`PdsTag`) colour discipline inside table cells (categories vs statuses).
- Avatar / initial-bubble colour rule when avatars represent users in dense rows.
- Notification bell / inline alert inside a table row — does it use `attention`, `warning`, or contextual?

Reply with the families and intents you'd like covered, and I'll extend the rulebook in the next pass.

---

## Pds\* component inventory (main barrel, no icons)

Exported from `dist/lib/main.d.ts` (icons excluded). Prefer **`PdsMantine*`** variants where deprecations indicate.

**Buttons:** `PdsButton`, `PdsDropdownButton`, `PdsIconButton`, `PdsMantineButton`, `PdsMantineDropdownButton`, `PdsMantineIconButton`, `PdsMantineSplitButton`, `PdsMantineSplitButtonButton`, `PdsMantineSplitButtonMenu`, `PdsMantineToggleButton`, `PdsMantineToggleIconButton`, `PdsSplitButton`, `PdsToggleButton`, `PdsToggleButtonGroup`, `PdsToggleIconButton`

**Data display:** `PdsAvatar`, `PdsBadge`, `PdsLabel`, `PdsMantineAccordion`, `PdsMantineAccordionControl`, `PdsMantineAccordionItem`, `PdsMantineAccordionPanel`, `PdsMantineAvatar`, `PdsMantineBadge`, `PdsMantineLabel`, `PdsMantineTag`, `PdsTable`, `PdsTbody`, `PdsTbodyCell`, `PdsTbodyRow`, `PdsThead`, `PdsTheadCell`, `PdsTheadRow`, `PdsTag`

**Feedback:** `PdsLoader`, `PdsNotification`, `PdsSkeleton`, `PdsToast`, `PdsToastActions`, `PdsToastBody`, `PdsToastHeader`

**Inputs:** `PdsAssistChip`, `PdsAutocomplete`, `PdsCheckbox`, `PdsCheckboxControlled`, `PdsDatepicker`, `PdsFilterChip`, `PdsFilterChipGroup`, `PdsFilterChipGroupControlled`, `PdsInputChip`, `PdsMantineAutocomplete`, `PdsMantineDatepicker`, `PdsMantineMultiselect`, `PdsMantineTimepicker`, `PdsMultiselectControlled`, `PdsRadioButton`, `PdsRadioGroup`, `PdsSelect`, `PdsSelectControlled`, `PdsSwitch`, `PdsTextArea`, `PdsTextField`

**Layout:** `PdsBox`, `PdsCard`, `PdsDivider`, `PdsMantineScrollArea`, `PdsSpacer`

**Navigation:** `PdsBreadcrumb`, `PdsDropdownTab`, `PdsLink`, `PdsMantineMenu`, `PdsMantineMenuItem`, `PdsMantineMenuSection`, `PdsMantineMenuSub`, `PdsMenu`, `PdsMenuOption`, `PdsMenuSection`, `PdsTab`, `PdsTabGroup`

**Overlays:** `PdsBackdrop`, `PdsDrawer`, `PdsMantineDrawer`, `PdsMantineTooltip`, `PdsModal`, `PdsModalBody`, `PdsModalFooter`, `PdsModalHeader`, `PdsPopover`, `PdsTooltip`

**Typography:** `PdsBodyText`, `PdsCode`, `PdsDisplayText`, `PdsEyebrowText`, `PdsHeadlineText`, `PdsInterfaceText`, `PdsKbdText`, `PdsListText`, `PdsMantineText`, `PdsMonospaceText`, `PdsPreText`, `PdsSubheadText`, `PdsTableText`, `PdsText`, `PdsTextline`

**Utilities:** `PdsClose2Icon`, `PdsCloseIcon`, `PdsPlaceholderIcon`, `PdsDismissButton`

---

## Package surface (short)

- **Entry:** `@podium-design-system/react-components` exports **`Pds*`** components, **`export *` from `./types`**, **`PodiumProvider`** (alias of Mantine's `MantineProvider`), and **`export *` from `@mantine/core` + `@mantine/hooks`** via the same barrel — layout primitives may be Mantine symbols, not `Pds*` names.
- **Styles:** `@podium-design-system/react-components/pds-mantine-styles.css`
- **Peers (Podium 2.19.4):** `@mantine/core`, `@mantine/dates`, `@mantine/hooks` **8.3.18**, `dayjs`, `react` / `react-dom`.
- **Icons:** ~**915** named `Pds*Icon` exports from the icons barrel (see package `exports["./icons.js"]`).

---

_Related: [`UI_PATTERNS_AGENT.md`](UI_PATTERNS_AGENT.md), [`NL_COMPONENT_MAPPING_HI_FI.md`](NL_COMPONENT_MAPPING_HI_FI.md), [`UX_PATTERNS_AGENT.md`](UX_PATTERNS_AGENT.md), [`UX_PATTERNS.md`](UX_PATTERNS.md), [`.cursor/skills/high-fidelity-prototype/SKILL.md`](../.cursor/skills/high-fidelity-prototype/SKILL.md), [`.cursor/skills/README.md`](../.cursor/skills/README.md) (future high-fidelity API documentation setup)._
