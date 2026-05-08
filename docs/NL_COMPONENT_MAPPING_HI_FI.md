# Natural language → high-fidelity (Podium) component mapping

> **Hi-fi companion.** This file is the **phrase → Podium / Mantine** counterpart to [`NL_COMPONENT_MAPPING_LO_FI.md`](NL_COMPONENT_MAPPING_LO_FI.md) (LOFI Kit prototypes in this repo). **Authoritative props, types, examples, accessibility, and Mantine integration** for Podium components come from the **future high-fidelity API documentation** server in Cursor (`future design-system API source`) and official PDS documentation — **consult the installed design-system API documentation** before locking APIs. The tables below still mirror LOFI signal grammar as a **starting point**; evolve rows toward `Pds*` / Mantine components as the team extends this doc.

**PDS semantic props (draft vocabulary):** reusable TypeScript unions (`PdsColor`, `PdsSize`, `PdsRank`, …), a full **`Pds*`** export list for the installed package, and the numbered UI rulebook live in [`UI_PATTERNS.md`](UI_PATTERNS.md). Terse agent rules: [`UI_PATTERNS_AGENT.md`](UI_PATTERNS_AGENT.md). Use those docs when mapping natural language to **hi-fi prop choices**; extend the phrase tables _here_ via **`/new-pattern`** when team definitions are ready.

---

## Starting point (LOFI-aligned tables)

Parse briefs phrase by phrase as in [`NL_COMPONENT_MAPPING_LO_FI.md`](NL_COMPONENT_MAPPING_LO_FI.md). For **implementation**, map the same signals to **Podium / Mantine** using **future high-fidelity API documentation** (`future design-system API source`), then align with [`COMPOSITION_PATTERNS.md`](COMPOSITION_PATTERNS.md) and [`UX_PATTERNS.md`](UX_PATTERNS.md) for behaviour (P1–P10).

---

## Signal grammar

| Signal phrase                                                                                | Pattern implied                     | Components                                                                      |
| -------------------------------------------------------------------------------------------- | ----------------------------------- | ------------------------------------------------------------------------------- |
| "a list of X" / "a table of X" / "manage X"                                                  | Entity list                         | `LOFITable`                                                                     |
| "add / create a new X"                                                                       | Create action                       | `LOFIButton` (primary) + `LOFIModal` (form)                                     |
| "edit / update an existing X"                                                                | Edit action per row                 | `LOFIButton` (compact, `✎`) + `LOFIModal` (form)                                |
| "delete / remove X"                                                                          | Destructive row action              | `LOFIButton` (dismiss, compact) + confirmation pattern                          |
| "opens in a modal" / "opens up" / "view details"                                             | Blocking detail view                | `LOFIModal`                                                                     |
| "side panel" / "contextual detail" / "next to the row"                                       | Non-blocking detail                 | `LOFIPanel`                                                                     |
| "basic information" / "name, type, status" / "fill in"                                       | Form fields                         | `LOFIFieldset` + `LOFIField` × N                                                |
| free text attribute                                                                          | Text entry field                    | `LOFIInput` (inside `LOFIField`)                                                |
| on/off attribute, enabled/disabled, yes/no                                                   | Boolean setting                     | `LOFISwitch`                                                                    |
| attribute with 2–3 exclusive options                                                         | Mutually exclusive short list       | `LOFIRadio`                                                                     |
| attribute with 4+ exclusive options                                                          | Mutually exclusive long list        | `LOFISelect`                                                                    |
| "multiple options can be selected" / "choose all that apply"                                 | Multi-select                        | `LOFICheckbox` per option                                                       |
| "save" / "confirm" / "submit"                                                                | Primary form action                 | `LOFIButton` (primary)                                                          |
| "cancel" / "discard" / "close"                                                               | Secondary form action               | `LOFIButton` (dismiss)                                                          |
| "X belongs to Y" / "X has many Y" / "nested Y inside X"                                      | Parent–child relationship           | nested `LOFITable` inside `LOFIModal` or `LOFIPanel`                            |
| "steps" / "first… then…" / "wizard"                                                          | Sequential flow                     | `LOFISteps`                                                                     |
| "switch between views" / "grid or list" / "scenario A or B"                                  | View mode toggle                    | `LOFIToggle`                                                                    |
| "status" / "type label" / "tag" / "category chip"                                            | Inline metadata label               | `LOFIBadge`                                                                     |
| "saving…" / "loading…" / "processing"                                                        | Async in-progress state             | `LOFILoader`                                                                    |
| "after it saves" / "confirm it worked" / "success message"                                   | Async completion feedback           | `LOFIToast` (**P4**)                                                            |
| "toast" / "snackbar" / "notification upper right" / "saved successfully" / "failed to save"  | Transient operation outcome         | `LOFIToast` + **P4**                                                            |
| "if there are no X yet" / "no results" / "empty list"                                        | Zero-data state                     | `LOFIEmptyState`                                                                |
| "filter by" / "search within" / "showing N results"                                          | Table controls                      | `LOFIInput` (search) + `LOFISelect`/`LOFIToggle` (filters)                      |
| "page 3 of 47" / "next page" / "paginate"                                                    | Large dataset navigation            | `LOFIPagination`                                                                |
| "a long description" / "notes field" / "comments" / "multi-line text"                        | Multi-line text entry               | `LOFITextarea`                                                                  |
| "an error in the form" / "validation failed" / "a warning message" / "alert below the field" | Embedded contextual alert           | `LOFIInlineAlert`                                                               |
| "how far along" / "percentage complete" / "progress bar"                                     | Determinate progress                | `LOFIProgressBar` _(backlog)_                                                   |
| "active filter chips" / "clear all filters" / "N results" label strip                        | Active filter state                 | `LOFIFilterBar` _(backlog)_                                                     |
| "filter criteria" / "Sport dropdown" / "Search + Reset" / "filter inputs"                    | Filter query row (composition)      | `LOFIField` + `LOFISelect`/`LOFIInput` + `LOFIButton` — **not** `LOFIFilterBar` |
| "hierarchy" / "tree nav" / "collapsible sidebar nav" / "accordion categories"                | Hierarchical sidebar navigation     | `LOFINavTree`                                                                   |
| "the main pane" / "production pane" / "feature surface" / "UPL main view"                    | Stable main workspace frame         | `LOFIMainWorkspace`                                                             |
| "breadcrumb" / "path trail" / "entity path"                                                  | Navigation breadcrumb (composition) | `LOFIText` segments + `›` separators — no new component                         |

---

## Layout and surface phrases

These phrases refer to structural containers and chrome rather than controls or data. Parse them separately from action / data phrases above.

| Signal phrase                                                                          | Pattern implied                               | Component                               |
| -------------------------------------------------------------------------------------- | --------------------------------------------- | --------------------------------------- |
| "a popup" / "a dialog" / "opens in a modal" / "opens up"                               | Blocking overlay                              | `LOFIModal`                             |
| "a sidebar" / "a panel next to it" / "show detail beside the row"                      | Non-blocking contextual detail (row-adjacent) | `LOFIPanel`                             |
| "a sidebar with categories" / "a tree in the sidebar" / "collapsible navigation"       | Full-height hierarchical sidebar              | `LOFINavTree`                           |
| "the main view" / "the pane where the editor lives" / "the production main pane"       | UPL main workspace frame                      | `LOFIMainWorkspace`                     |
| "a box" / "a content block" / "wrap it in something" / "a card"                        | Free-form content surface                     | `LOFICard`                              |
| "a header" / "top bar" / "app bar" / "nav bar at the top"                              | Top-of-page chrome                            | `LOFIToolbar`                           |
| "group these fields" / "a section in the form" / "a form block with a title"           | Grouped form section                          | `LOFIFieldset` (+ `LOFIField` children) |
| "a chip" / "a pill" / "a tag" / "a label" / "a status badge"                           | Inline metadata label                         | `LOFIBadge`                             |
| "tabs inside the modal" / "sections within a panel" (few segments, segmented control)  | Exclusive sections in a child surface         | `LOFIToggle`                            |
| "tab strip" / "underline tabs" / "badges on tab labels" / many named parallel sections | Named non-linear navigation with tab chrome   | `LOFITabs`                              |

---

## Control disambiguation phrases

These phrases are ambiguous in natural language and require a clarifying question before mapping to a component.

| Phrase heard                  | Clarifying question                                                                                  | Resolution                                                                                     |
| ----------------------------- | ---------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| "a toggle"                    | "Is it switching a view/mode on the whole screen, or turning a single setting on/off?"               | view/mode → `LOFIToggle`; single setting → `LOFISwitch`                                        |
| "a switch"                    | Same as above                                                                                        | Same resolution                                                                                |
| "a section"                   | "Is it a group of form fields, or a block of free-form content?"                                     | form fields → `LOFIFieldset`; free-form → `LOFICard`                                           |
| "a checkbox"                  | "Is it one flag (active/inactive), or several independent options?"                                  | single flag → `LOFISwitch`; multiple independent → `LOFICheckbox`                              |
| "a dropdown"                  | "How many options? 2–3 or more?"                                                                     | 2–3 → `LOFIRadio`; 4+ → `LOFISelect`                                                           |
| "steps" / "tabs" / "sections" | "Ordered wizard (1 then 2), or parallel sections? If parallel, tab-strip chrome or simple segments?" | ordered → `LOFISteps`; tab strip / badges → `LOFITabs`; 2–4 segments in a modal → `LOFIToggle` |

---

## Worked example

> "We need a table of teams with adding and editing functionality. Every team
> when added or edited opens up in a modal, describing basic information about
> it. Players belong to every team and they can be visible inside the team via
> another table."

Parsed phrase by phrase:

| Phrase                         | Signal                    | Components                                                      |
| ------------------------------ | ------------------------- | --------------------------------------------------------------- |
| "table of teams"               | Entity list               | `LOFITable`                                                     |
| "adding functionality"         | Create action             | `LOFIButton` (primary, "+ Add team")                            |
| "editing existing teams"       | Edit action per row       | `LOFIButton` (compact, `✎`) per row                             |
| "opens up in a modal"          | Blocking detail/form      | `LOFIModal` (wide)                                              |
| "basic information about it"   | Form fields               | `LOFIFieldset` + `LOFIField` × N                                |
| name, type etc. as free text   | Text attributes           | `LOFIInput` per attribute                                       |
| active/inactive status         | Boolean setting           | `LOFISwitch`                                                    |
| "players belong to every team" | Parent–child relationship | nested `LOFITable` inside `LOFIModal`                           |
| "visible via another table"    | Child entity list         | nested `LOFITable`                                              |
| implied: saving the form       | Form actions              | `LOFIButton` (primary "Save") + `LOFIButton` (dismiss "Cancel") |
| implied: save confirmation     | Completion feedback       | `LOFIToast`                                                     |
| implied: no players yet        | Zero-data in nested table | `LOFIEmptyState`                                                |

**Checklist:** `LOFITable` × 2, `LOFIButton` × 4, `LOFIModal`, `LOFIFieldset`, `LOFIField` × N, `LOFIInput` × N, `LOFISwitch`, `LOFIToast`, `LOFIEmptyState`

---

_Companion files: [`LOFI_KIT_PATTERNS.md`](LOFI_KIT_PATTERNS.md) (component catalog), [`COMPOSITION_PATTERNS.md`](COMPOSITION_PATTERNS.md) (control selection + composition), [`UX_PATTERNS.md`](UX_PATTERNS.md) (interaction rules)_
