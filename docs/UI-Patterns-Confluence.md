# Podium UI Patterns — Internal tools

**Version:** 0.1  
**Audience:** Designers, Frontend Engineers, Product Managers, Agents (high-fidelity prototypes)  
**Last updated:** 28 Apr 2026  
**Owner:** Transformer Patterns / Product Engineering (adjust for your space)  
**Canonical repo source:** `docs/UI_PATTERNS.md` (full rulebook)  
**Agent-terse rules:** `docs/UI_PATTERNS_AGENT.md`

**Confluence:** Paste sections below into a page, or use a Markdown importer. If your space uses wiki markup, convert headings manually (`h2.` / `h3.`).

---

## What this page covers

This page summarises **how to apply Podium semantic props** (`color`, `rank`, `surface`, `size`, typography roles) when building **Sportradar internal-tool** interfaces on **`@podium-design-system/react-components`**.

It is **not** a replacement for:

* **UX flow patterns (P1–P10)** — behaviour, sequencing, modal stacking, confirmations: see the UX Patterns Confluence mirror / [`UX_PATTERNS.md`](UX_PATTERNS.md) and [`UX_PATTERNS_AGENT.md`](UX_PATTERNS_AGENT.md).
* **Lo-fi prototyping** — grayscale LOFI Kit (`lofi-kit`) for Transformer Patterns demos.

**Relationship:** UI Patterns describe *visual semantics* that **must not contradict** UX flow rules. If unsure, satisfy **P1–P10** first, then map props.

---

## Table of contents

1. [Baseline principles](#baseline-principles)
2. [Core vocabulary (short)](#core-vocabulary-short)
3. [Buttons: rank, colour, and hierarchy](#buttons-rank-colour-and-hierarchy)
4. [Button hierarchy: Do and Don’t](#button-hierarchy-do-and-dont)
5. [Typography, forms, overlays, tables (pointers)](#typography-forms-overlays-tables-pointers)
6. [Implementation notes](#implementation-notes)
7. [Source of truth](#source-of-truth)

---

## Baseline principles

* **Lower cognitive load** — meaning comes from structure, typography, and semantic state; avoid decorative colour.
* **Colour = intent** — use `action`, `attention`, `warning`, `success`, and `neutral` deliberately. If intent is unclear, default to **`neutral`**.
* **Brand tokens are rare** — `brand-primary` / `brand-secondary` are not the default for everyday operator commits. Primary **action** colour is **`action`**.

---

## Core vocabulary (short)

### Semantic colour (`PdsColor`)

| Token | Role (summary) |
| --- | --- |
| `action` | Triggers an effect (save, submit, apply) — agnostic of good/bad outcome. |
| `neutral` | Default; non-semantic baseline. |
| `warning` | Destructive verbs, hard errors. |
| `attention` | Soft warning / needs follow-up. |
| `success` | Completed state — most often **badges/toasts**, rarely a button. |

### Rank (`PdsRank`) — emphasis ladder

| Rank | Podium label (docs) | Typical use |
| --- | --- | --- |
| `ghost` | Ghost | Lowest emphasis — back, tertiary, subtle row actions. |
| `subtle` | Subtle | Low emphasis — often Cancel/dismiss; **can** be “primary among ghosts” in toolbars when justified. |
| `outline` | Outlined | Medium — utilities, secondaries, **sometimes** primary when surface/context calls for outline. |
| `fill` | Filled | Highest — **one per cluster**; modal commit, strong CTAs. |

### Surface (`PdsSurface`)

* **`on-light`** — default.
* **`on-dark`** — when placed on dark/brand-secondary context; apply **consistently** inside that shell.

### Size (`PdsSize`)

* Default **`md`**. Step down for denser nesting; **`xs`** mainly for **icon-only** controls in tight tables.

---

## Buttons: rank, colour, and hierarchy

* **“Primary” is situational** — the most important control **in that group**, not one global variant.
* **One `fill` per coherent cluster** (and as a rule of thumb, **one per screen/view** where possible).
* **Pick rank from role**, not from **colour alone** — never make the primary differ **only** by hue while rank stays identical for all buttons.
* **Do not mix `neutral` and `action`** in the same **horizontal** button strip — choose **one semantic family** for that cluster.
* **Emphasis should increase monotonically** — avoid “wavy” patterns (e.g. outline–subtle–outline) that confuse scanning.

---

## Button hierarchy: Do and Don’t

Use these pairs when reviewing Figma or PRs. Wording tracks Podium design guidance and the canonical table in [`docs/UI_PATTERNS.md`](UI_PATTERNS.md) §1.7.

### Pair A — Basic three steps

* **Do:** When you need **three** levels, ladder **ghost → subtle → fill** within **one** semantic colour family (all neutral *or* all action).
* **Don’t:** Use **outline** as the **strongest** control **beside subtle** as “secondary” — **subtle can read heavier than outline**. Prefer **fill** for the real commit when subtle is the dismiss neighbour.

### Pair B — One semantic family per cluster

* **Do:** Keep **all neutral** or **all action** for buttons that belong to the **same** grouped strip.
* **Don’t:** Mix **gray** and **blue** action semantics **side by side** in one cluster.

### Pair C — Outline as primary; honest hierarchy

* **Do:** Use **outline** (transparent or **opaque/tinted**) as **primary** when the panel or flow calls for it.
* **Don’t:** Invent **extra** rank contrast that **doesn’t** match real task importance (“decorative hierarchy”).

### Pair D — Grouped actions

* **Do:** When **one** path is clearly dominant, use **one** clear step up (e.g. ghost/outline peers + **fill** or strong **outline** for the single primary).
* **Don’t:** Stack **three** ranks **without need** (ghost + subtle + fill) — adds noise.

### Pair E — Neutral first; one fill

* **Do:** Start **neutral**; move the **whole** cluster to **action** when the CTA is **urgent and frequent**.
* **Don’t:** Place **two fill** buttons **next to each other** — at most **one fill** per coherent cluster/view.

### Pair F — Gray surfaces; linear progression

* **Do:** On **light gray** toolbars/cards, **outline + opaque/tint** can mark a **local** primary against **ghost** neighbours.
* **Don’t:** Let emphasis **zig-zag** (non-monotonic ranks in one strip).

### Pair G — Icon rows

* **Do:** Keep icon peers **ghost**; elevate **one** key action by **rank** (e.g. **subtle**).
* **Don’t:** Distinguish primary by **colour only** while **every** control shares the **same** rank (e.g. all outline).

### Pair H — Equal importance; icons

* **Do:** For **equal** utilities, **ghost** + **optional** leading icon (filter, export, print).
* **Don’t:** Put **icons on every** footer control **and** mix **ghost + subtle + fill** without justification — default **text-first**; icons only when they **disambiguate** or help **scanning**.

---

## Typography, forms, overlays, tables (pointers)

* **Typography** — default body scale **`700`**; practical body/interface **`500`–`900`**; avoid hero sizes in internal tools. Use **size** for hierarchy, **weight** sparingly.
* **Forms** — default fields **`neutral` + `outline` + `md`**; **focus** signals **`action`**; validation colours per **P6** (hard **`warning`**, soft **`attention`**).
* **Modals** — commit **`fill` + `action`**; cancel **`subtle` + `neutral`**; **P7** destructive confirm uses **`fill` + `warning`** on confirm **only** after opt-in.
* **Tables** — row **Edit/View** usually **`outline`/`subtle` + neutral** (not a column of **fills**); destructive rows **lower rank + `warning`**; filter chips follow **neutral/outline** inactive → **subtle** active patterns in the full doc.

Details, Storybook embed IDs, and edge cases live in the repo **only** — keep this Confluence page as an overview.

---

## Implementation notes

* Prefer **`PdsMantine*`** exports when Mantine-backed duplicates exist — non-Mantine `Pds*` may be deprecated.
* Wrap prototypes in **`PodiumProvider`**; load **`pds-mantine-styles.css`** per project setup.
* **Git / package access** — Podium packages may require registry tokens; see team **`.npmrc`** and Podium MCP setup in Cursor where applicable.

---

## Source of truth

| Artefact | Purpose |
| --- | --- |
| [`docs/UI_PATTERNS.md`](UI_PATTERNS.md) | Full numbered rulebook (§1–§5), hex tables, `Pds*` inventory, gap analysis |
| [`docs/UI_PATTERNS_AGENT.md`](UI_PATTERNS_AGENT.md) | Numbered imperative rules for LLMs / Copilot |
| `UX_PATTERNS_AGENT.md` | P1–P10 **behaviour** — takes precedence on interaction conflicts |
| [`docs/NL_COMPONENT_MAPPING_HI_FI.md`](docs/NL_COMPONENT_MAPPING_HI_FI.md) | Phrase → hi-fi starting map |

*End of Confluence-oriented export — maintain parity when [`docs/UI_PATTERNS.md`](UI_PATTERNS.md) changes.*
