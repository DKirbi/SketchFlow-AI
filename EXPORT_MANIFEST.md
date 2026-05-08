# Export Manifest

## Included

- Root npm workspace and TypeScript/tooling config
- `lib/` LoFi Kit source and Storybook stories
- `demos/` LoFi demos
- `demos/notifications-overview-hifi` source as future high-fidelity material
- `docs/` UX, LoFi, and high-fidelity documentation
- `.cursor/rules`, `.cursor/skills`, and `.github/copilot-instructions.md`
- Local hub scripts and GitHub Pages workflow

## Excluded Or Removed

- `node_modules`
- build outputs such as `dist`, `public`, `storybook-static`, and `.hub-dev`
- `.git`, GitLab CI files, logs, caches, generated catalogs
- Podium/Mantine dependencies
- Podium MCP configuration
- package-lock entries that force private dependency resolution

## Notes

The default export is LoFi-runnable. High-fidelity source is present but requires dependency restoration before use.
