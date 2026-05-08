# Brief Authoring Guide

> How to use the `@lofi-prototyping` Cursor workflow and write compact,
> effective UX planning briefs that generate working prototypes.

This guide is for designers and developers who want to produce LoFidelity
prototype screens using `lofi-kit` and an AI coding agent (Cursor). It
teaches you how to write the **inputs** — the briefs — that drive the system.

---

## Part 1 — Using `@lofi-prototyping` in Cursor

### What is `@lofi-prototyping`?

It is a **Cursor rule file** stored at `.cursor/rules/lofi-prototyping.mdc`.
Cursor rule files (`.mdc`) inject instructions into the AI agent's context so it
follows project-specific conventions automatically.

There are two kinds of rule files:

| Kind | When loaded | Example |
|------|-------------|---------|
| **Always-applied** | Every conversation | `.cursor/rules/project.mdc` |
| **On-demand** | When you `@`-mention them | `.cursor/rules/lofi-prototyping.mdc` |

`lofi-prototyping.mdc` is on-demand. You activate it by typing
**`@lofi-prototyping`** in the Cursor chat, then pasting or referencing your
brief.

**Cursor project skills (optional, recommended for large briefs):** see
**`.cursor/skills/README.md`**. The **prototype intake** skill helps reshape a
brief into a plan (P1–P10, components, open questions) before code; to **edit
pattern docs** (not demos), use **`/new-pattern`** or **`@ux-pattern-authoring`**
as documented there. GitHub Copilot users: same modes are in
**`.github/copilot-instructions.md`** under **Agent modes: prototype brief vs pattern authoring**.

### The three-step contract

When activated, the rule enforces a strict sequence:

```
Step 1 — Read docs    Agent reads LOFI_KIT_PATTERNS.md, UX_LOFI_KIT_PATTERNS.md, and any
                      feature brief. No code is written.

Step 2 — Plan         Agent outputs a plan in the chat:
                      • Patterns involved (P1–P10)
                      • Component map
                      • Files to create
                      • Mocked data
                      • States to implement
                      • Open questions
                      You review and confirm before code generation starts.

Step 3 — Execute      Agent writes code. All data is mocked. Every state in
                      the plan must be reachable by clicking through.
```

**You always get a chance to review before code is generated.** Use the plan
step to catch scope misunderstandings, missing states, or wrong component
choices.

### What the agent reads automatically

When the rule is active, the agent loads:

1. **`docs/LOFI_KIT_LOFI_KIT_PATTERNS.md`** — visual rules, component catalog (17 primitives),
   composition patterns, decision guide, token reference.
2. **`docs/UX_LOFI_KIT_PATTERNS.md`** — P1–P10 behavioural patterns, interaction
   rules (validation, confirmations, save gating, destructive action
   escalation, changelog, mocked data), UX flows.
3. **`LOFI_BLOCKS.md`** — quick-lookup table of every `lofi-kit` component.

You do not need to paste these files into the chat. The agent reads them
itself.

### Feature-specific briefs

For larger features, create a dedicated brief file at
`docs/briefs/<feature-name>.md`. The agent checks for briefs in that folder
and loads them when matched. Feature briefs take precedence over any embedded
brief in a general instructions file.

### The iteration workflow

Not every change requires the full three-step sequence:

| Change type | What to `@`-reference |
|-------------|----------------------|
| Visual / component tweak | `@lofi-prototyping` + mention `LOFI_KIT_PATTERNS.md` |
| Flow / behaviour change | `@lofi-prototyping` + mention `UX_LOFI_KIT_PATTERNS.md` |
| Both | `@lofi-prototyping` (agent loads both) |
| Small fix | Often no `@` needed — just describe the change |

For small tweaks the agent can skip the plan step and edit directly. For
anything that touches multiple components or changes interaction flows, always
go through the plan.

### Steering the plan step

Tips for getting a better plan:

- **Ask for a flow tree.** Request that the agent outputs a nested tree (like
  the ones in `UX_LOFI_KIT_PATTERNS.md` Story 1) showing how patterns compose.
- **Challenge the component map.** If the plan proposes a component that does
  not exist in `lofi-kit`, ask the agent to flag it as a library addition
  before proceeding.
- **Check the state list.** Every meaningful state (empty, loading, disabled,
  error, confirmation, success) should be listed. If one is missing, add it
  before confirming.
- **Count the confirmations.** Every data-modifying action needs a confirmation
  dialog. If the plan omits one, call it out.

---

## Part 2 — Anatomy of a UX Planning Brief

A brief is a structured markdown document that tells the agent **what to
build**. It does not describe visual design — it describes **data, layout,
actions, and flows**.

Below is a section-by-section breakdown. Each heading maps to a recommended
section in your brief. Use `§` section numbers for cross-referencing.

### §1 — Context block

One paragraph. State:

- What the feature is
- Which library it uses (`lofi-kit`)
- Hard constraints (grayscale, monospace, BEM + SCSS + tokens, no external
  UI libraries)

```markdown
## Context

Build a **Team Management** prototype screen using the `lofi-kit` component
library. All UI must be assembled exclusively from `lofi-kit` primitives
following the rules in `LOFI_KIT_PATTERNS.md` and `LOFI_BLOCKS.md`. No external UI
libraries. Grayscale only. Monospace everywhere. BEM + SCSS + tokens throughout.
```

### §2 — Top-level layout

Describe the page structure: toolbar slots, view toggles, primary content area.
Name components explicitly.

```markdown
## 1. Top-level layout

- Use `LOFIToolbar` for app chrome.
  - **Left slot**: current user identity — `j.smith` format with `LOFIBadge
    variant="tag"` for role.
  - **Centre slot**: page title via `LOFIText as="h1" variant="body"`.
  - **Right slot**: any global actions.
- Below the `LOFIToolbar`, render a `LOFIToggle` to switch between:
  - **Teams** (default) — the main data table.
  - **Changelog** — audit log view (see §6).
```

### §3 — Data tables

Use small markdown tables to define columns. Be explicit about which component
renders each cell.

```markdown
| Column    | Content                                                     |
|-----------|-------------------------------------------------------------|
| ID        | `LOFIBadge variant="id"`                                        |
| Team name | `LOFIText variant="body"`                                       |
| Status    | `LOFIBadge variant="status"` — solid = active, dashed = pending |
| Actions   | See §3                                                      |
```

### §4 — Actions and modals

For each action button in the table, describe:

- The trigger (which button, which variant/size)
- What opens (modal? inline confirmation?)
- Modal zones (header, body tabs, footer buttons)
- Footer button labels and behaviour

### §5 — Nested data

If a modal contains its own data table (e.g. a player roster inside a team
edit modal), describe:

- Search bar: placeholder text, what it filters
- Filter / sort controls: which fields, which component
- Per-row actions: +Add / −Remove semantics, confirmation rules
- Bulk import: CSV button, validation rules, how invalid rows display

### §6 — Destructive flows

Spell out the full escalation chain:

1. Who initiates (operator), what control, what inline confirmation text
2. What changes on confirm (status badge, row appearance)
3. Who approves (supervisor), what controls appear, what confirmation dialog
4. What happens on final approval (row removed, changelog entry)

### §7 — Changelog

Define columns, what generates entries, and default sort order. The agent will
wire real-time changelog appending for every data-modifying action.

### §8 — User identity and role gating

Describe:

- How the logged-in user displays (handle format, role badge)
- Which roles exist
- What each role can and cannot see (hidden vs. disabled)
- How the prototype lets the tester switch roles

### §9 — Component constraints

A checklist section at the end of the brief. Think of it as a safety net:

```markdown
## 8. Component constraints and reminders

- All primitives from `lofi-kit` only. No external UI libs.
- `LOFIText` for all copy. `LOFIButton` for all actions. Never raw `<button>`.
- `LOFIModal` for all overlays. `LOFIPanel` for contextual side detail.
- `LOFIField` + `LOFIInput`/`LOFISelect` for all form layouts.
- BEM naming throughout. SCSS with `@use '../../styles/tokens' as *;`.
- No hardcoded colors or sizes — tokens only.
- Dashed borders / dashed `LOFIBadge` = incomplete, pending, or soft-deleted.
- Destructive actions always `variant="dismiss"`.
- If a required component does not exist in `lib/src/ui/`, add it first.
```

---

## Part 3 — Brief Formatting Cheat Sheet

| Rule | Why |
|------|-----|
| Use markdown tables for column definitions | Compact, scannable, unambiguous |
| Number sections with `§` | Enables cross-referencing between sections |
| Name components explicitly with variant and size | `LOFIBadge variant="status"`, not "a status indicator" |
| State every variant/size on buttons | `LOFIButton variant="dismiss" size="compact"` |
| Call out missing library primitives explicitly | "If `Loader` does not exist in `lib/src/ui/`, add one (export as `LOFILoader`)" |
| Keep briefs under ~200 lines for a single feature | Longer briefs lose focus; split multi-feature work |
| Place feature briefs in `docs/briefs/` | Agent auto-discovers them there |
| Include a constraints footer | Catches rule violations the agent might otherwise miss |
| Use real-world entity examples in the brief | "FC Barcelona", not "Team A" — sets the tone for mocked data |
| Describe states, not just happy paths | Empty, loading, error, disabled, confirmation, success |

### Template skeleton

```markdown
# Feature Name — LoFi Prototype Feature Brief

## Context
[One paragraph: what, which library, hard constraints]

## 1. Top-level layout
[Toolbar slots, view toggles, content area]

## 2. Primary data table
[Column table, create button, row actions]

## 3. Actions column
[Per-row actions, variant/size, destructive ordering]

## 4. Edit / Create modal
[Modal size, tab structure, fields, validation, footer]

## 5. Destructive flow
[Initiate → confirm → approve → remove chain]

## 6. Changelog view
[Column table, sort order, read-only]

## 7. User identity
[Handle format, role badge, role gating, role switcher]

## 8. Component constraints and reminders
[Safety checklist]
```

---

## Part 4 — Anti-patterns

Avoid these common mistakes when writing briefs:

### Describing visual design instead of flow and data

> Bad: "The header should be 64px tall with a subtle drop shadow and a
> warm gray background."

The prototype uses token-based styling from `lofi-kit`. You never need to
specify pixel values, shadows, or colours. Describe **structure** (toolbar
left/centre/right slots) and **data** (what goes in each slot), not appearance.

### Vague action descriptions

> Bad: "There should be some kind of delete button."

> Good: "`LOFIButton variant="dismiss" size="compact"` — **Mark redundant** —
> initiates the soft-delete/supervisor approval flow (§5)."

Name the component, the variant, the label, and what happens on click.

### Omitting states

A brief that only describes the happy path (table is populated, modal saves
successfully) will produce a prototype that breaks on edge cases. Explicitly
list:

- Empty table state
- Loading / saving state
- Validation error state
- Disabled state (progressive enablement)
- Confirmation state
- Success notification

### Assuming the agent knows the domain

Always include mocked-data guidance. Specify real team names, real player
names, realistic ID formats, and timestamp conventions. The agent will use
whatever examples you provide as the template for all generated data.

### Exceeding single-screen scope

One brief = one prototype screen. If a feature spans multiple screens (e.g.
a tournament setup wizard followed by a bracket canvas), split it into separate
briefs and build them sequentially. Each brief should be self-contained enough
to produce a working, clickable prototype on its own.

---

## Reference

| Document | Purpose |
|----------|---------|
| [`.cursor/rules/lofi-prototyping.mdc`](../.cursor/rules/lofi-prototyping.mdc) | Cursor rule that enforces the three-step workflow |
| [`docs/LOFI_KIT_LOFI_KIT_PATTERNS.md`](LOFI_KIT_PATTERNS.md) | Component catalog, visual rules, composition patterns |
| [`docs/UX_LOFI_KIT_PATTERNS.md`](UX_LOFI_KIT_PATTERNS.md) | P1–P10 flow patterns, interaction rules, UX flows |
| [`LOFI_BLOCKS.md`](../LOFI_BLOCKS.md) | Quick-lookup component table |
| [`CLAUDE.md`](../CLAUDE.md) | Architecture, project structure, adding components |

### Worked examples

| Brief | Prompt style | What it demonstrates |
|-------|-------------|----------------------|
| [`docs/briefs/mapping-prototype.md`](briefs/mapping-prototype.md) | Conversational (2 messages) | Table with row actions, checkbox multi-select, bulk action, confidence badge, async loading, inline confirm, modal confirm |

---

*Brief Authoring Guide — v1.0*
*For use with: Transformer Patterns + `lofi-kit` + Cursor AI agent*
