---
name: ui-patterns-agent
description: >-
  Apply or audit Transformer Patterns UI semantics from docs/UI_PATTERNS_AGENT.md (U0–U6) and
  docs/UI_PATTERNS.md (§1–§6): color, rank, surface, size, typography, forms, overlays, tables,
  spacing. Prefer Common Lib (@pet-transformers/common-react) per COMPONENT_REFERENCE.md; use raw
  Podium (Pds*) only when Common Lib has no wrapper. Use when the user starts with /ui-patterns,
  asks to review Common Lib or hi-fi UI, or @ui-patterns-agent. Pair with docs/UX_PATTERNS_AGENT.md
  for P1–P10 behaviour. For editing the rulebook, use /new-pattern or @ux-pattern-authoring.
  For full hi-fi prototype intake in this repo, use /high-fidelity.
---

# Transformer UI patterns (agent apply / audit)

Use when the user **explicitly** invokes **UI** semantics work for **Common Lib — Transformer** interfaces:

- **Primary:** first line or start of message is **`/ui-patterns`**
- **Backup:** **`@ui-patterns-agent`** (Cursor)

This skill **loads and applies** the UI pattern rulebook. It is **not** for editing canonical docs (use **`/new-pattern`**) or for full prototype intake (use **`/high-fidelity`** or **`prototype-intake-plan`** for lo-fi in this repo).

## Gateway (first check)

- If the message **starts with** **`/new-pattern`** or **`@ux-pattern-authoring`**, follow **`.cursor/skills/ux-pattern-authoring/SKILL.md`**.
- If the message **starts with** **`/high-fidelity`**, follow **`.cursor/skills/high-fidelity-prototype/SKILL.md`** (UI rules are a subset of that workflow).
- If the user asks to **edit** `docs/UI_PATTERNS*.md`, NL mapping, LOFI docs, or agent surfaces **without** `/new-pattern`, **refuse** and point them to **`/new-pattern`**.

## Authority (read before acting)

| Priority                                          | File / source                                                                                   |
| ------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| UX behaviour (when both apply)                    | `docs/UX_PATTERNS_AGENT.md` — **P1–P10 take precedence** on interaction conflicts               |
| Terse UI rules                                    | **`docs/UI_PATTERNS_AGENT.md`** — U0–U6 numbered rules (load fully)                             |
| Vocabulary, Common Lib priority, `Pds*` inventory | `docs/UI_PATTERNS.md` §1–§6                                                                     |
| **Common Lib component catalog**                  | `COMPONENT_REFERENCE.md` in **`@pet-transformers/common-react`** — primary implementation layer |
| Consolidated UX + UI skill                        | `.cursor/skills/transformer-patterns/SKILL.md` (generated from the docs above)                  |
| Phrase → hi-fi starting map                       | `docs/NL_COMPONENT_MAPPING_HI_FI.md`                                                            |
| Lo-fi spacing tokens (this repo)                  | `docs/LOFI_KIT_PATTERNS.md` → Spacing (maps to UI §6 / U6)                                      |
| Raw Podium / Mantine APIs                         | **Podium MCP** (`pds-mcp`) when working below Common Lib — list tool schemas before calling     |

**Reuse-first:** Common Lib (`Field`, `Table`, `Menu`, `BaseLayout`, …) → raw `Pds*` → discuss net-new with the developer.

**Read-only** on canonical docs unless the user uses pattern-authoring triggers.

## Rule sections (UI_PATTERNS_AGENT.md)

| Section | Topic                                                                             |
| ------- | --------------------------------------------------------------------------------- |
| **U0**  | Imports and internal-tool baseline                                                |
| **U1**  | Buttons + feedback (`color`, `rank`, emphasis, toasts)                            |
| **U2**  | Typography roles and density                                                      |
| **U3**  | Forms + inputs                                                                    |
| **U4**  | Overlays + navigation (modals, drawers, tabs, menus)                              |
| **U5**  | Tables, filters, row actions                                                      |
| **U6**  | Spacing — 4 / 8 px grid; theme tokens in Podium/Mantine; `$space-*` in lo-fi SCSS |

When **UX** and **UI** conflict, follow **UX** for behaviour; reconcile props afterward.

## Modes

### Apply (implementation)

User is building or fixing **Common Lib** or **Podium** UI:

1. Restate the UI task and which **U0–U6** sections apply.
2. **Check Common Lib** `COMPONENT_REFERENCE.md` for an existing component (`Field`, `Table`, etc.).
3. Load **`UI_PATTERNS_AGENT.md`**; cite rule numbers when choosing props.
4. Verify props: Common Lib types first; raw `Pds*` via MCP or installed typings — do not invent prop names.
5. Implement or patch code; flag gaps if the rulebook has no guidance.

### Audit (review)

User asks to **review** Figma, a PR, or existing screens:

1. Scan against **U0–U6** and the **Common mistakes** section in `UI_PATTERNS_AGENT.md`.
2. Output findings as: **rule #** → **location** → **issue** → **recommended fix**.
3. Cross-check **P1–P10** only when interaction behaviour is in scope.
4. Flag unnecessary raw `Pds*` usage when Common Lib already provides a wrapper.

### Spacing pass (common `/ui-patterns` sub-task)

1. Apply **U6** and `UI_PATTERNS.md` §6 decision guide.
2. **Common Lib / Podium:** theme spacing tokens only — no arbitrary px in layout props.
3. Enforce filter-region recipe: top 16 px, bottom 8 px, control-row 16 px, wrapped-row 8 px, sidebar↔main 16 px.
4. UPL shell exception: `46px` left+right insets are allowed only on the main interface shell (left rail includes absolute collapse button).
5. Run `npm run spacing:check` before finalizing changes.
6. **Lo-fi (`lofi-kit`) in this repo:** `$space-4`–`$space-16` for layout; `$space-2` / `$space-6` for fine intra-component work.

## Deliverables

- **Apply:** code changes or a concrete prop checklist per component cluster.
- **Audit:** numbered findings tied to **U0–U6** rules; optional severity (blocker / should-fix / nit).
- **Plan-only:** when MCP or target files are missing, still deliver the rule map and open questions.

## Related

- **Consolidated skill:** `../transformer-patterns/SKILL.md`
- **Hi-fi prototype intake (this repo):** `../high-fidelity-prototype/SKILL.md`
- **Lo-fi prototype intake:** `../prototype-intake-plan/SKILL.md`
- **Edit the rulebook:** `../ux-pattern-authoring/SKILL.md`
