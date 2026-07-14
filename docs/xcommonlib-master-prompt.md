# Master Prompt: Generate `xcommonlib` From Podium Patterns

Use this prompt with an implementation model/agent to scaffold a portfolio-ready UI library based on Podium semantics, but with fully rebranded public naming.

---

You are a senior design-system engineer. Create a reusable React + TypeScript UI library named **`xcommonlib`** by extracting the same conceptual surface from Podium docs/storybook (tokens, styles, components, props, prop types), then publishing it under a new naming system.

## Goal

Build a portfolio-quality component library that demonstrates:

1. semantic tokens and style system,
2. components in action (including controlled components),
3. Storybook docs with iframe-ready embeds,
4. Figma Code Connect mapping hooks.

Do **not** include CI/CD, GitLab pipelines, or test infrastructure in this generation pass.

## Source-of-truth extraction scope

Extract and normalize these four artifacts:

1. **`tokens`**
   - semantic intent (`action`, `attention`, `warning`, `success`, `neutral`)
   - emphasis/rank (`ghost`, `subtle`, `outline`, `fill`)
   - intensity (`low`, `high`)
   - surface (`on-light`, `on-dark`)
   - size scale (`xs`, `sm`, `md`, `lg`, `xl`)
   - typography scale (`font size ladder`, with body baseline equivalent to Podium `700`)
2. **`styles`**
   - semantic color application rules,
   - rank hierarchy and one-primary-per-cluster behavior,
   - overlay/form/table interaction style conventions.
3. **`components`**
   - grouped inventory: Buttons, Data Display, Feedback, Inputs, Layout, Navigation, Overlays, Typography, Utilities.
4. **`props_and_propTypes`**
   - shared semantic prop unions,
   - component prop contracts,
   - explicit controlled/uncontrolled variants and value/onChange signatures.

## Required rename contract (strict)

Rebrand all public names from Podium to `xcommonlib` conventions.

1. Remove prefixes from public component names:
   - remove `PdsMantine`
   - remove `Pds`
   - remove `Mantine`
2. Normalize collisions:
   - if both `PdsButton` and `PdsMantineButton` map to `Button`, keep one public `Button` API and track source parity internally.
   - if legacy and newer variants differ, expose one canonical `xcommonlib` component and document compatibility notes.
3. Provider rename:
   - `PodiumProvider` -> `XCommonProvider`
4. Shared type rename:
   - `PdsColor` -> `XColor`
   - `PdsBrandColor` -> `XBrandColor`
   - `PdsRank` -> `XRank`
   - `PdsIntensity` -> `XIntensity`
   - `PdsSurface` -> `XSurface`
   - `PdsSize` -> `XSize`
   - `PdsFontSize` -> `XFontSize`
5. Remove Podium/Mantine branding from all exported symbol names, docs headings, examples, and Storybook titles.
6. Preserve behavior semantics and UX rationale even after renaming.

## Output requirements

Produce:

1. **Library structure**
   - `src/tokens`, `src/styles`, `src/components`, `src/types`, `src/provider`
2. **Component APIs**
   - typed props for each component family,
   - controlled variants where relevant (`value` + `onChange`),
   - composable primitives for overlays, table cells, row actions, and filters.
3. **Storybook**
   - stories for each component,
   - docs pages with usage + prop tables,
   - iframe-safe story routes and an embed index page suitable for a portfolio site.
4. **Portfolio demo**
   - at least one composed screen using multiple `xcommonlib` components,
   - examples of form validation, modal confirm flow, table row actions, notification/toast state.
5. **Figma Code Connect readiness**
   - component metadata mapping file(s),
   - clear naming map from design components to `xcommonlib` exports.

## Controlled components rule

For all data-entry and selection primitives (inputs, select, multiselect, checkbox/radio groups, date/time, chips/filters), provide:

- controlled API (`value`, `onChange`),
- optional uncontrolled wrapper when useful,
- clear docs explaining when to choose each.

## Mantine influence rule

Mantine may influence internal implementation patterns, but:

- no public API names may include `Mantine`,
- docs/examples must present only `xcommonlib` naming,
- avoid leaking third-party naming in type aliases and story titles.

## Exclusions (strict)

Do not generate:

- GitLab CI pipelines,
- testing setup/files,
- release automation,
- package publishing workflows.

## Final validation checklist (must pass)

1. No `Pds`, `PdsMantine`, `Mantine`, or `Podium` prefixes in public exports.
2. Shared semantic unions are present under `X*` types.
3. Storybook contains iframe-embeddable examples and a portfolio index.
4. Controlled component docs exist for all relevant form/input primitives.
5. Figma Code Connect mapping exists and references `xcommonlib` component names.
6. Semantic/rank/surface behavior remains equivalent to the source design language.

## Optional MCP enhancement step

If Podium MCP access is available, enrich prop-level docs from live Storybook and typings before finalizing APIs. If MCP is unavailable, proceed from local rulebook + component inventory sources and flag any uncertain prop details as `verify_later`.

---

Return the generated library blueprint first, then implementation-ready file scaffolding and representative code for tokens, provider, 6-10 core components, and Storybook docs pages.
