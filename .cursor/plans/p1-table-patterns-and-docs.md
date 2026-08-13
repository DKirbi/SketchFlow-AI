# Plan: P1 Data Table — implementation + human / LLM pattern split

## Goals

1. **Ship** the P1 Storybook + `LOFITable` updates (toolbar, first-use chrome, `emptySlot`) as previously scoped.
2. **Split pattern documentation** so **humans** get narrative context and **LLMs/agents** get terse, numbered, imperative rules.
3. **Group Data Table patterns hierarchically** under **P1** with **P1.1–P1.4** (see §B).
4. **Rewrite P3 (Detail Modal)** for footer layout, button vocabulary, wizard exceptions, tabs, dismiss behaviour, and modal stacking — with **agent-specific** instructions for rare stacking.
5. **Retire P4** (duplicate of P1.2); **split old P5** into **P1.3** vs **Filters**; **move old P6 → P1.4**; **rename/refocus old P7** (see §H–§J).

---

## A. Documentation architecture (human vs LLM)

**Problem:** [`docs/UX_PATTERNS.md`](docs/UX_PATTERNS.md) currently mixes audience (it says both "stakeholders" and "consumed by an LLM agent"). That makes it hard to optimize for either reader.

**Approach:**

| Audience | Artefact | Tone |
|----------|----------|------|
| **Humans** (designers, PMs, stakeholders) | **`docs/UX_PATTERNS.md`** — human-oriented rulebook: rationale, when to use patterns, prose rules, UPL vocabulary, extended context. Reframe the intro so it does **not** claim to be agent-only. |
| **LLMs / coding agents** | **`docs/UX_PATTERNS_AGENT.md`** (name TBD) — **numbered rules per pattern**, minimal explanation, imperative voice, checklist-friendly. |

**Cross-linking:** Bidirectional links between the two files; update [`.cursor/rules/project.mdc`](.cursor/rules/project.mdc) and optionally [`.cursor/rules/nl-component-mapping.mdc`](.cursor/rules/nl-component-mapping.mdc).

---

## B. Pattern numbering — Data Table group (P1.1–P1.4)

**Naming:** Use **`P1.1` … `P1.4`** in docs. Alternate compact tags (e.g. **P1A1**) are optional aliases only.

| Id | Name | Source / notes |
|----|------|----------------|
| **P1.1** | Data table — structure, search, sort (high level), empty, loading, table-in-modal | Former **P1** core (not row actions, not inline column controls) |
| **P1.2** | Row actions in the Actions column | Former **P2** |
| **P1.3** | Table controls **inside headers and cells** — what is sortable vs not, selection columns | **New scope** carved from old **P5** “table-specific” parts only (see §H) |
| **P1.4** | Bulk operations on the table and selection / external import | Former **P6** (heavily rewritten; see §I) |

**Umbrella:** **P1: Data Table** covers **P1.1–P1.4** as subsections.

**Downstream cross-ref pass (when implemented):**

- **P2 → P1.2**; **P5 → split** into **P1.3** + **Filters**; **P6 → P1.4**; **P7 → Inline validation** (or agreed id).
- **Remove P4** everywhere it meant “Inline Row Action (Add/Remove)” — replace with **P1.2** where it described the same behaviour.

---

## C. P1.1 — rule mapping (unchanged from prior plan)

### LLM/agent checklist (numbered)

1. **Explicit columns** — Brief-driven; default set if omitted: entity name, ID, status, Actions.
2. **Search visibility at scale** — ~15+ rows → persistent visible search; never icon-only collapse.
3. **Search control shape** — Search always in toolbar; if not part of a larger filter set → bounded text field + clear + **Search** button (~200px field in P1 story).
4. **Sort (summary)** — Column headers support sorting where applicable; full sort behaviour and **non-sortable columns** are **P1.3**; link to live Storybook **Sort affordance** example.

### Shared (humans + LLMs)

- **Empty state** — Empty-state variants; first-use chrome (toolbar, headers, optional informational message); distinguish from layout **skeleton** placeholders (backlog).
- **Loading** — In-body loading; pagination vs lazy/load-more.
- **Table in modal** — One nesting level; table does not open a second modal (still valid; see **P3** for general modal rules).

---

## D. P1.2 — Row actions (former P2) — updated rules

**Definition:** Controls in the **Actions** column for a row’s entity.

**Canonical actions (common):** `Edit`, `Remove`, `View`, `Hide`.

- **Remove** “Mark as Redundant” from the canonical list — it was **demo-specific**, not a general pattern name.

**Remove for now (do not document until clarified):**

- The rule about **only one action vs multiple actions** and primary/overflow grouping — **omit** from both human and agent docs.

**Keep:**

- Destructive actions (`Remove`, `Delete`) are not the most prominent control in the row where the pattern says they must be secondary; destructive commits use **P10** (confirmation).
- Row actions that open an editor follow **P3** (Detail Modal).
- Role-gated actions: **hidden**, not disabled, for unauthorized users.

---

## E. P3 — Detail Modal — expanded rules (human + agent)

*(Unchanged from previous iteration — footer alignment, primary/secondary labels, wizard **Back** + **Cancel**, dismiss without stacked confirm by default, agent must **ask** before stacking modals, view-only modals, tabs at top of body.)*

- Cross-reference **dirty-state / commit** behaviour to the **Inline validation** pattern (former **P7** naming), not “LOFI component names as patterns.”

---

## F. P4 — REMOVED — duplicate of P1.2

**Current `UX_PATTERNS.md` § P4 (Inline Row Action Add/Remove)** — **delete** as a standalone pattern.

- Rationale: behaviour is already covered by **P1.2** (row actions) and related flows (**P3**, **P10**).
- Any unique roster-staging nuance should fold into **P1.2** / **P1.4** prose if still needed after review.

---

## G. Filters — new pattern, **last** in the inventory (deferred detail)

**Purpose:** Group **filter controls** that can sit **above a table** or **on other surfaces**: search bar, custom text inputs, autocomplete, multiselect, switch, **Clear / Reset**, etc.

**Placement:** **Last** pattern in the numbered inventory so it can be **expanded later** without blocking the P1 work.

**Scope for this pass:** Add a **stub section** (title + bullet list of control types + “see future revision”) in `UX_PATTERNS.md` and a one-line pointer in the agent file. **Do not** migrate full old **P5** prose into Filters until the detailed pass.

**Relationship to P1.1:** **P1.1** still says “search in toolbar when not part of a larger filter set”; **Filters** is the home for **full filter rows** and reusable filter behaviour.

---

## H. P1.3 — Table controls (headers & row cells) — from old P5, narrowed

**Only** behaviours that apply to **table structure** — not the general Filters pattern.

**Column types & sort:**

- **Actions** column: **never sortable** (nothing meaningful to sort).
- **Selection — “Select all”** (header): header holds **select all** / master control; rows use **checkboxes** for **multi-select**.
- **Selection — single row** (“Select”): when **only one row** may be selected and a checkbox is **not** appropriate, rows use **radio** controls; header column is **not** a sortable data column.
- Other **non-sortable** header/cell cases: document as **exceptions** (no sort indicator).

**Sort UX / affordance:**

- Describe **sorting** in the **live Storybook example** (existing **Sort affordance** story in [`lib/stories/patterns/P1-DataTable.stories.tsx`](lib/stories/patterns/P1-DataTable.stories.tsx)); **both** human and agent docs must **link** to that story (path + Storybook sidebar title).

**Out of scope for P1.3:** Search bar, filter dropdowns, and **Clear filters** — those live under **Filters** (and **P1.1** for minimal standalone search).

---

## I. P1.4 — Bulk (former P6) — rewritten

**Scope:** Operations that target **the table** and **current selection** and/or **bulk import**.

**Bulk selection (destructive):**

- **Bulk destructive** actions are only valid when **bulk selection** exists (rows selected via P1.3 selection model).

**Bulk import (e.g. CSV):**

- **Browse** button and/or **drag-and-drop** zone — **can appear above the table**.
- After external files are chosen, enable **Confirm** or **Upload** (wording per brief).
- **Multiple items / loading:** show a **loader **inside** the table area**, **overlaying** the table (not only a row beneath it): **semi-transparent white** background (**~10% opacity** or equivalent token) so the table is visibly **inactive** and **interaction is blocked** until the operation completes.

**Remove** the rest of the old **P6** bullets that are **confusing** or redundant (per your direction); **rebuild** the section around the above.

---

## J. Inline validation (rename from P7 “Async Save Feedback”) — paired with Forms

**Rename / reposition:** Former **P7** content becomes **Inline validation** (exact id: **P7** vs new number **TBD**—keep one canonical id in the inventory and cross-link old “P7” mentions).

**Pair with Forms:**

- Document as the **form + validation + save feedback** pattern, not a list of **kit component names** — **patterns must not be defined as LOFI exports**; describe behaviour in product-neutral terms.

**Keep:**

- **Delay simulation** (e.g. 500ms–1.5s) as a **prototype pattern** for **Save** and **modal** flows so loading states are visible.

**Errors:**

- On failure, show a **warning-style notification** **above the footer** of the **modal** or **above the footer** of the **main interface window** (same vertical placement rule; neutral wording in docs).

**Remove:** Treating specific **LOFI** primitives as **the pattern names** in this section.

---

## K. P8 — Modal editing & entity state (rewrite; former “Create Flow” demo)

**Problem:** Current **P8 (Create Flow)** reads like a **one-off demo** (progressive enablement, `Create Team`, etc.), not a durable pattern.

**Rewrite P8** around **modals** and **entity lifecycle**:

- **Edit entity:** fields show **prefilled** values from the loaded entity; the operator changes what they need.
- **Save gating:** the **Save** (or equivalent commit) control stays **disabled until the form is dirty** — i.e. the user has **changed something** from the loaded values. Pair with **Inline validation** for validation/save feedback rules.

- Optional short bullets for **create** flows (open empty form, primary label matches intent) may remain **only** if framed as modal behaviour, not demo-specific copy.

---

## L. P9 — REMOVED / merged — “Destructive with approval” was demo-specific

**Current P9** (two-role redundant → supervisor remove) is a **leftover from a specific demo**; **destructive behaviour** is already covered by **P1.2** (row actions), **P3** (modals), **P10** (confirmation), and **Inline validation**.

**Doc pass:**

- **Delete** standalone **P9** as a numbered pattern **or** replace with a **single cross-reference** sentence pointing to **P10** + row/modal patterns.
- **Interaction rules** § “Destructive action escalation” and any **“P9”** mentions: retarget to **P10** and **P1.2** as appropriate.
- **P12** currently cites P9 for the role switcher — **reword** so the prototype role switcher does **not** depend on a removed P9 id.

**Numbering:** If **P9** is removed outright, either **close the gap** (renumber old P10–P13 → P9–P12) or **keep P10–P13 ids** with no P9 — **decide when implementing** so agent rules and grep stay consistent.

---

## M. P10 — Confirmation dialog (canonical; strengthen cross-refs)

**Keep** P10 as the **authoritative** pattern for **confirmation dialogs**.

**Documentation pass:**

- **Everywhere** the docs say “confirmation dialog”, “confirm before…”, or list actions that need confirmation — add an explicit **“see P10”** (or supersede with P10-only wording).
- Align **Interaction rules** § “Confirmation dialogs” (items 8–10) with **P10** (single source of truth; avoid duplicate contradictory lists).
- Cross-link from **P3** (footer commits), **Inline validation** (errors), **P1.2** / **P1.4** (destructive row/bulk actions), and **P13** (workspace reset) where confirmations apply.

---

## N. P11 — Tab navigation (keep; de-kit; steps vs tabs)

**Keep** the behavioural intent.

**Edits:**

- **Remove LOFI component names** from the pattern definition; describe behaviour in neutral terms.
- Add explicit guidance on **what not to use** for which job (e.g. **segmented controls** for a few sections inside a dense panel vs **primary tab strip** for parallel main views — wording without mandating a kit export).
- **Clearly separate:**
  - **Tabs** — **parallel** views of the same domain; switching does not imply sequence.
  - **Steps / wizard** — **sequential** flow; order matters; not interchangeable with tabs.

---

## O. P12 — User identity bar

**No substantive change** for this pass (“good for now”). After **P9** removal, fix any **cross-reference** that pointed at P9.

---

## P. P13 — Workspace Chrome (UPL) — de-kit; clarify shell vs features

**Keep** most behavioural bullets; **rewrite framing:**

- **Remove LOFI component names** from the **pattern rules** (patterns are not kit exports). **Region names** may stay as **words** (e.g. main workspace, upper bar, sidebar) — **MainWorkspace** as the name of the **main interface feature** / main pane.
- **Persistent shell:** in practice this is usually the **upper bar** (global chrome that does not go away). Do **not** imply that **every** UPL region is “persistent” in the same sense.
- **Collapsible sidebar:** **optional** — depends on the interface; not every layout has it.
- **Re-mention** the **Filters** pattern for the filter query row / filter behaviour (cross-link).
- **Tree selection** and **sidebar** are used **interchangeably** here: the **nav tree** lives in the sidebar; selecting a **leaf** is what drives the main workspace.
- **Footer / tabs / changelog** bullets: retain unless they conflict with **P11** / **Inline validation** / **P10** updates.

---

## Q. Implementation (technical — unchanged)

- **`LOFITable`:** `emptySlot`, SCSS, tests, `npm run props:catalog`.
- **`P1-DataTable.stories.tsx`:** toolbar, first-use story, **ensure Sort affordance story URL is linkable** from docs.
- **`docs/COMPOSITION_PATTERNS.md`**, **`docs/COMPONENTS_BACKLOG.md`:** empty state, skeleton backlog, loader accuracy; **P1.4** overlay loader may need a **composition note** (implementation detail in prototypes).

---

## R. Execution order (updated)

1. **`docs/UX_PATTERNS_AGENT.md`:** P1.1–P1.4, P3, P8 (modal edit), **no P9**, P10, P11, P12, P13, Filters stub, Inline validation; **delete P4**; **LLM: ask before stacking modals**.
2. **`docs/UX_PATTERNS.md`:** Human framing; **restructure P1**; apply **§K–§P**; remove **P4**; **merge/remove P9**; **grep** global refs; **P10** cross-reference sweep (“confirmation” → P10).
3. **`.cursor/rules/project.mdc`**, **`nl-component-mapping.mdc`**, **`CLAUDE.md`**, **`Introduction.mdx`**, **`UXFlows.mdx`**: inventory list updates (pattern count may change if P9 removed).
4. **Code:** `emptySlot` + P1 stories + tests + props catalog.
5. **`COMPOSITION_PATTERNS.md`** + **`COMPONENTS_BACKLOG.md`**.

---

## Todos

- [ ] `UX_PATTERNS_AGENT.md`: P1.1–P1.4, P3, P8, P10, P11, P12, P13, Filters, Inline validation; no P4; no standalone P9; modal stacking rule
- [ ] `UX_PATTERNS.md`: full restructure per §B–§P; P8 rewrite; remove/merge P9; P10 cross-refs everywhere; P11 de-kit; P13 de-kit + shell/sidebar/filters/tree; P5→P1.3+Filters; P6→P1.4; P7→Inline validation
- [ ] Global grep: P2, P4, P5, P6, P7, **P9** references → new targets (**P10**, P1.2, etc.)
- [ ] Grep **“confirmation”** → ensure **P10** cited
- [ ] Link **Sort affordance** from docs to Storybook
- [ ] Cursor rules + MDX
- [ ] `LOFITable` `emptySlot` + tests + props catalog
- [ ] P1-DataTable stories refactor
- [ ] COMPOSITION_PATTERNS + COMPONENTS_BACKLOG
