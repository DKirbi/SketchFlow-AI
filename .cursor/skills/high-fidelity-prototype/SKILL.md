---
name: high-fidelity-prototype
description: Documentation/reference workflow for future high-fidelity planning. Use when the user starts with /high-fidelity and wants to map P1-P10 UX behavior to a future design system. In this export, do not install dependencies, call MCP tools, or implement runnable high-fidelity code until the user restores a target design-system runtime.
---

# High-Fidelity Prototype Planning (Reference Only)

This export preserves high-fidelity documentation and demo source, but it does not include High Fidelity Design System dependencies or high-fidelity API documentation configuration. Treat this skill as a planning aid only.

## Authority

1. Load `docs/UX_PATTERNS_AGENT.md` for P1-P10 behavior.
2. Load `docs/UI_PATTERNS_AGENT.md` and `docs/UI_PATTERNS.md` for high-fidelity semantic guidance.
3. Load `docs/NL_COMPONENT_MAPPING_HI_FI.md` for phrase-to-hi-fi mapping.
4. Use `docs/COMPOSITION_PATTERNS.md` for behavior-level composition.

## Workflow

1. Restate the brief and separate facts, assumptions, and open questions.
2. Map requested behavior to P1-P10.
3. Create a LoFi-to-high-fidelity component mapping table.
4. List dependencies/API docs required before implementation.
5. Stop before coding unless the user has explicitly restored the target design-system runtime.

## Guardrails

- Do not add dependencies in this export without an explicit setup request.
- Do not call High Fidelity Design System MCP; it is not configured here.
- Do not edit canonical LoFi docs from a product brief. Use `/new-pattern` for pattern-authoring changes.
