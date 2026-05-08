# Agent System

The export works because canonical docs, rules, and skills all point to the same workflow.

## Source Of Truth

1. `docs/UX_PATTERNS_AGENT.md` and `docs/UX_PATTERNS.md`: P1-P10 behavior.
2. `docs/NL_COMPONENT_MAPPING_LO_FI.md`: phrase-to-component parsing.
3. `docs/LOFI_BLOCKS.md` and `docs/LOFI_KIT_PATTERNS.md`: component inventory and visual rules.
4. `docs/COMPOSITION_PATTERNS.md`: recipes for shells, filters, tables, modals, and workspace composition.
5. `.cursor/rules/**`, `.cursor/skills/**`, and `.github/copilot-instructions.md`: agent behavior surfaces.

## Default Prototype Flow

- Parse the brief phrase by phrase.
- Map behavior to P1-P10.
- Produce a component checklist.
- Plan files, mock data, and states before code.
- Build with `lofi-kit` only unless a future high-fidelity runtime is explicitly restored.

## Authoring Flow

Use `/new-pattern` or `@ux-pattern-authoring` before changing canonical docs, mappings, rules, or skills. Keep Cursor and Copilot surfaces aligned.
