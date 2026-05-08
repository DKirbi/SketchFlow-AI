# High-Fidelity Documentation Stub

This export preserves high-fidelity documentation and demo source, but it does not include Podium/Mantine dependencies or Podium MCP configuration.

## Included For Later Prompting

- `docs/UI_PATTERNS.md`
- `docs/UI_PATTERNS_AGENT.md`
- `docs/UI-Patterns-Confluence.md`
- `docs/NL_COMPONENT_MAPPING_HI_FI.md`
- `demos/notifications-overview-hifi` source and scripts

## Future Prompt Shape

```markdown
/high-fidelity
Use the existing P1-P10 UX behavior rules from this project, but map the UI to [design system name].
Before coding, create a component mapping table from the LoFi components in the brief to the target high-fidelity components.
Do not change the canonical LoFi Blocks docs unless explicitly asked.
```

Before implementation, restore or replace the missing high-fidelity design-system dependencies and API references.
