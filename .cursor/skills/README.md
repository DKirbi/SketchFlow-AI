# Cursor project skills (Transformer Patterns)

This folder holds **Cursor Agent Skills**: each skill is a directory with a `SKILL.md` file. The YAML frontmatter `name` and `description` help Cursor choose when to load the skill automatically; you can also `@`-mention a skill file for a hard guarantee.

**Do not** put team-authored skills in `~/.cursor/skills-cursor/` — that directory is reserved for Cursor’s built-in skills.

**GitHub Copilot** does not load these `SKILL.md` files automatically. Equivalent behaviour for Copilot Chat is defined in **`.github/copilot-instructions.md`** → **Agent modes: prototype brief vs pattern authoring**. Keep them in sync when behaviour changes (see **`.cursor/rules/ux-patterns-copilot-parity.mdc`**).

---

## Skills in this repo

| Skill folder                                                   | Purpose                                                                                                                                                                                 | Triggers                                                                                                                                              |
| -------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`prototype-intake-plan/`](prototype-intake-plan/SKILL.md)     | Restate lo-fi prototype briefs into a **plan** (P1–P10 map, NL → LOFI, LOFI checklist, open questions) before code. **Read-only** on canonical docs unless you use the authoring skill. | Default for “build a prototype / demo / screen from a brief” — or `@prototype-intake-plan` / open `SKILL.md`. **Not** for editing the pattern system. |
| [`high-fidelity-prototype/`](high-fidelity-prototype/SKILL.md) | Plan-first **High Fidelity Design System** prototypes: `docs/NL_COMPONENT_MAPPING_HI_FI.md`; new packages under `demos/` only.                                                              | **First line** **`/high-fidelity`**.                                                                                                                  |
| [`ux-pattern-authoring/`](ux-pattern-authoring/SKILL.md)       | Edit **canonical** UX/LOFI/NL docs, Cursor rules, and Copilot instructions; reconcile with `docs/PET-Patterns-Confluence.md`.                                                           | **Primary:** first line `/new-pattern` — **backup:** `@ux-pattern-authoring`. For VS Code Copilot, use `/new-pattern` or attach this `SKILL.md`.      |
| [`ui-patterns-agent/`](ui-patterns-agent/SKILL.md)             | **Apply or audit** SketchFlowAI UI semantics (**U0–U6**); reuse-first vs raw `Pds*`; spacing pass, prop review — **read-only** on canon unless `/new-pattern`.          | **Primary:** first line **`/ui-patterns`** — **backup:** `@ui-patterns-agent`. Pair with `UX_PATTERNS_AGENT.md` when behaviour is in scope.           |
| [`transformer-patterns/`](transformer-patterns/SKILL.md)     | **Consolidated** P1–P10 + U0–U6 rulebook (generated from `docs/UX_PATTERNS*.md` + `docs/UI_PATTERNS*.md`). High Fidelity Design System for raw `Pds*`.                                      | Load automatically or `@transformer-patterns`; regenerate locally with `npm run generate:skills`.                                                       |

### Default vs authoring (short)

- **No trigger** (normal message) → **prototype / brief** mode: treat the text as a demo brief, **read** `docs/UX_PATTERNS_AGENT.md`, `docs/NL_COMPONENT_MAPPING_LO_FI.md`, `docs/LOFI_BLOCKS.md`, etc. **Do not** edit those files, `.cursor/rules`, or `.github/copilot-instructions.md` to “improve patterns” from a brief. Point maintainers to `/new-pattern` or `@ux-pattern-authoring` if they need doc edits.
- **`/new-pattern`** or **`@ux-pattern-authoring`** → **pattern-authoring** mode: allowed to change the listed canon and apply Copilot/Confluence parity.
- **`/high-fidelity`** → **high-fidelity prototype** mode: follow [`high-fidelity-prototype/SKILL.md`](high-fidelity-prototype/SKILL.md) + `docs/NL_COMPONENT_MAPPING_HI_FI.md`.
- **`/ui-patterns`** → **UI apply/audit** mode: follow [`ui-patterns-agent/SKILL.md`](ui-patterns-agent/SKILL.md); load `docs/UI_PATTERNS_AGENT.md` + `docs/UI_PATTERNS.md` §1–§6. Consolidated rules: [`transformer-patterns/SKILL.md`](transformer-patterns/SKILL.md). Not for editing the rulebook — use `/new-pattern`.

After a confirmed **prototype plan**, implementation follows **`.cursor/rules/lofi-prototyping.mdc`** and **`.cursor/rules/project.mdc`** for lo-fi work (default: `lofi-kit`). Hi-fi implementation follows **`high-fidelity-prototype`** + High Fidelity Design System rules in `project.mdc`.

---

## High Fidelity Design System API docs (repo-local)

High-fidelity API documentation MCP is **not configured in this export**. Restore the target design-system runtime and its API documentation when implementing `/high-fidelity` work.

---

## See also

- **High Fidelity Design System prop vocabulary:** [`docs/UI_PATTERNS.md`](../../docs/UI_PATTERNS.md) and terse agent rules in [`docs/UI_PATTERNS_AGENT.md`](../../docs/UI_PATTERNS_AGENT.md) (hi-fi semantic types + `Pds*` list for the installed package). Legacy filename `PODIUM_SEMANTIC_TYPES.md` is not shipped in this repo.
- **Parity rule:** [`.cursor/rules/ux-patterns-copilot-parity.mdc`](../rules/ux-patterns-copilot-parity.mdc)
- **On-demand prototyping rule:** [`.cursor/rules/lofi-prototyping.mdc`](../rules/lofi-prototyping.mdc)
