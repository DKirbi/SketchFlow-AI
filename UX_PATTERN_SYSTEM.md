# UX Pattern System

The pattern engine is a document-driven planning system for AI-assisted prototype generation.

## Canonical Files

- `docs/UX_PATTERNS.md`: human-readable P1-P10 inventory and interaction rules.
- `docs/UX_PATTERNS_AGENT.md`: terse machine rules for agents.
- `docs/UX_PATTERN_STORIES.md`: story/reference flows.
- `docs/patterns-registry.json`: canonical P1-P10 and R1-R7 order.
- `docs/BRIEF_AUTHORING_GUIDE.md`: how to write useful prototype briefs.

## Generation Tactics

1. Start from a brief, not from components.
2. Parse language through `docs/NL_COMPONENT_MAPPING_LO_FI.md`.
3. Ask focused questions for ambiguous terms.
4. Map behavior to P1-P10.
5. Select LoFi components from `docs/LOFI_BLOCKS.md`.
6. Apply composition recipes from `docs/COMPOSITION_PATTERNS.md`.
7. Plan states before code: empty, loading, disabled, error, validation, confirmation, success, role-gated, no-results.
8. Use realistic mock data and changelog behavior.

## Validation

Run:

```bash
npm run ux-patterns:check
```

This validates P1-P10/R1-R7 ordering and Storybook embed exports.
