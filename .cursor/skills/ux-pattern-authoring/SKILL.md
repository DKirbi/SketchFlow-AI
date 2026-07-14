---
name: ux-pattern-authoring
description: >-
  When the user types /new-pattern at the start of a message or uses @ux-pattern-authoring, maintain canonical UX pattern docs, NL component mapping, LOFI blocks, LOFI kit patterns, Cursor rules, and GitHub Copilot instructions; reconcile with `docs/PET-Patterns-Confluence.md` and `docs/UI-Patterns-Confluence.md` when Podium UI copy changes. Use for editing P1–P10 text, adding pattern inventory, or cross-surface agent parity — not for ordinary lo-fi demo briefs. VS Code Copilot users without @-mention should start with /new-pattern or attach this file.
---

# UX pattern authoring (infrastructure)

Use this skill only when the user **explicitly** invokes pattern maintenance:

- **Primary:** first line or start of message is **`/new-pattern`**
- **Backup:** **`@ux-pattern-authoring`** (Cursor)

This skill **authorizes** edits to canonical docs and agent surfaces. It is **not** for inventing product features; it aligns **documentation and agent instructions**.

## When not to use

If the user wants a **demo or screen** without editing the pattern system, use **`.cursor/skills/prototype-intake-plan/SKILL.md`** + `.cursor/rules/lofi-prototyping.mdc` instead.

## Full reload list (read before editing)

Open the current versions of these paths, then apply the user’s requested changes and **parity**:

| Area | Paths |
|------|--------|
| Human + machine patterns | `docs/UX_PATTERNS.md`, `docs/UX_PATTERNS_AGENT.md`, `docs/UX_PATTERN_STORIES.md` (if story text is affected); `docs/UI_PATTERNS.md`, `docs/UI_PATTERNS_AGENT.md` (Podium semantics — if hi-fi rules change) |
| NL → components (lo-fi + hi-fi) | `docs/NL_COMPONENT_MAPPING_LO_FI.md`, `docs/NL_COMPONENT_MAPPING_HI_FI.md` |
| LOFI catalog | `docs/LOFI_BLOCKS.md`, `docs/LOFI_KIT_PATTERNS.md` |
| Cursor rules | `.cursor/rules/project.mdc`, `lofi-prototyping.mdc`, `nl-component-mapping.mdc`, and any other `.cursor/rules/*.mdc` that duplicate those semantics |
| Copilot | `.github/copilot-instructions.md` |
| Confluence mirrors (repo export) | `docs/PET-Patterns-Confluence.md`, `docs/UI-Patterns-Confluence.md` |

## Reconciliation workflow

1. **Compare** `docs/PET-Patterns-Confluence.md`, `docs/UI-Patterns-Confluence.md`, and `.github/copilot-instructions.md` against the Cursor-facing docs and rules for **gaps** or **divergence**.
2. **Propagate** missing or updated rules so **Cursor rules**, **Copilot instructions**, and **docs** stay aligned — prefer a **single change-set** per `.cursor/rules/ux-patterns-copilot-parity.mdc`.
3. If parity is **deferred**, add an explicit **TODO** in-repo and note it in the PR message — **no silent drift**.

**Confluence note:** this repo holds **static exports** in `docs/PET-Patterns-Confluence.md` and `docs/UI-Patterns-Confluence.md`. The agent cannot fetch live Confluence. If the source of truth in Confluence is newer, refresh those files (or paste updates) before reconciling.

## After doc work

When the user returns to building a demo, hand off to **`prototype-intake-plan`** + **`lofi-prototyping.mdc`**.

## Related

- **Prototype planning (read-only on canon):** `../prototype-intake-plan/SKILL.md`
