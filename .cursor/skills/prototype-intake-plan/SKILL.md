---
name: prototype-intake-plan
description: >-
  Transforms lo-fi prototype requests into structured plans using docs/UX_PATTERNS_AGENT.md, docs/NL_COMPONENT_MAPPING_LO_FI.md, and docs/LOFI_BLOCKS.md. Use when the user wants a lo-fi prototype, demo screen, UX brief, bracket-demo, or plan-before-code. If the user starts with /high-fidelity, follow high-fidelity-prototype instead. Negative scope: do not use for editing canonical pattern inventory or agent docs; if the user starts with /new-pattern or @ux-pattern-authoring, follow the ux-pattern-authoring skill instead. Refuse edits to docs/UX_PATTERNS*.md, docs/NL_COMPONENT_MAPPING_LO_FI.md, docs/NL_COMPONENT_MAPPING_HI_FI.md, LOFI blocks, lofi kit patterns, .cursor/rules, or .github/copilot-instructions.md unless those authoring triggers are present — point the user to /new-pattern.
---

# Prototype intake and planning (lo-fi)

Transformer Patterns — use this skill to **reshape the prompt and produce a plan** before implementation. This skill is **not** for writing application code by itself; after the user confirms the plan, follow `.cursor/rules/lofi-prototyping.mdc` for build steps.

## Gateway (first check)

- If the user message **starts with** **`/high-fidelity`**, **stop** and follow **`.cursor/skills/high-fidelity-prototype/SKILL.md`**.
- If the user message **starts with** `/new-pattern` or **`@ux-pattern-authoring`**, you are in **pattern-authoring** mode. **Stop** this workflow and follow **`.cursor/skills/ux-pattern-authoring/SKILL.md`** (canonical doc edits, Copilot/Confluence parity).
- If the user asks to edit `docs/UX_PATTERNS.md`, `docs/UX_PATTERNS_AGENT.md`, NL mapping, LOFI docs, or Cursor rules **without** those triggers, **refuse** and tell them to start with `/new-pattern` or `@ux-pattern-authoring`.

## Authority (read; do not rewrite)

Load and apply these files when planning a prototype (optional shortcut table: `.cursor/rules/nl-component-mapping.mdc` — not a second source of truth):

| Priority | File |
|----------|------|
| P1–P10 behaviour | `docs/UX_PATTERNS_AGENT.md` (and `docs/UX_PATTERNS.md` for rationale) |
| Phrase → components | `docs/NL_COMPONENT_MAPPING_LO_FI.md` |
| lofi-kit names + forbidden HTML | `docs/LOFI_BLOCKS.md` |
| Full catalog + visual rules | `docs/LOFI_KIT_PATTERNS.md` |
| Screen recipes | `docs/COMPOSITION_PATTERNS.md` |
| Feature briefs | `docs/briefs/<name>.md` if relevant |

**Read-only in this mode:** all of the above paths, plus `.cursor/rules/**`, and `.github/copilot-instructions.md` — **no edits** here unless the user uses the pattern-authoring triggers.

## P1–P10 one-line index (disambiguation only)

Open the docs for full rules. Quick labels: **P1** Workspace/UPL, **P2** Data table, **P3** Stateful button, **P4** Toast, **P5** Modal, **P6** Inline validation, **P7** Confirmation dialog, **P8** Tab navigation, **P9** Filters, **P10** Sticky disclosure.

## Rules

1. **No invention** — Do not add features, personas, entities, or flows the user did not state or confirm. If information is missing, list **gaps** and **ask** (one cluster at a time: goal, primary surface, actors, key entities, destructive actions, required UI states, navigation).
2. **Thin brief** — Output gaps + questions before a full plan when the request is underspecified.
3. **Novel “pattern” gate** — If the request does not map to existing **P1–P10** (or a clear composition of them), name the **closest** existing pattern(s) in one sentence each, ask which applies, and **do not** assume a new inventory pattern. Only proceed to implementation planning when the user maps to P1–P10 or **explicitly** accepts stakeholder-approved new pattern work (then **documentation** may follow under `/new-pattern` — not silent doc edits from this skill).

## Deliverables (in chat, before code)

1. **Restated brief** — facts + assumptions labeled *Assumption (confirmed)* vs *Open*.
2. **Pattern map** — user phrase/area → P1–P10 (or ambiguous).
3. **Component checklist** — from NL mapping + `LOFI_BLOCKS.md`; if a needed primitive is missing from lofi-kit, say **stop — add to lofi-kit** per `docs/LOFI_KIT_PATTERNS.md`.
4. **Plan skeleton** — same sections as `lofi-prototyping.mdc` Step 2: patterns involved, component map, files to create, mocked data, states (empty, loading, error, validation, confirmation, success), open questions.

## After confirmation

When the user approves the plan, continue with **`.cursor/rules/lofi-prototyping.mdc`** (compliance check, then execute, then self-check). Default repo fidelity is **lo-fi** per `.cursor/rules/project.mdc`.

## Related

- **Pattern doc authoring:** `../ux-pattern-authoring/SKILL.md`
