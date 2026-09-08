import {
  COMPONENT_SET_KIND_NAV,
  exampleById,
  type ComponentSet,
  type SetExample,
} from 'lofi-kit';

export interface SetKindDoc {
  kind: ComponentSet['kind'];
  nav: string;
  primitives: string[];
  exampleIds: string[];
  intro: string;
}

const DOCS: Record<ComponentSet['kind'], Omit<SetKindDoc, 'kind' | 'nav'>> = {
  'action-cluster': {
    primitives: ['LOFIActionCluster', 'LOFIButton', 'LOFIStatefulButton'],
    exampleIds: ['workspace-footer', 'page-footer-merge', 'bulk-bar'],
    intro:
      'A host-aware row of actions. The JSON stores **roles** (`commit`, `dismiss`, `secondary`, `destructive`, `tertiary`), not colours. `resolveActionPresentation(role, host)` maps each role onto a LOFI `variant` / `size` for the prototype and onto UI Pattern `color` / `rank` for the hi-fi pass. One `commit` per cluster. Use this kind anywhere a footer, bulk bar, or toolbar-right cluster repeats.',
  },
  'upper-bar': {
    primitives: ['LOFIToolbar', 'LOFIText', 'LOFIButton', 'LOFIBadge'],
    exampleIds: ['upl-upper-bar', 'tool-upper-bar'],
    intro:
      'P1.1 chrome: the product identity strip. `variant: "upl"` is the Unified Production Landscape bar (title, subtitle, Applications / Configuration / role). `variant: "tool"` is a standalone tool identity bar (title, handle, mapped/pending counts). Right-slot controls are `ActionDescriptor`s on host `toolbar-right` — compact dismiss / ghost at hi-fi.',
  },
  'filter-query-row': {
    primitives: ['LOFIField', 'LOFIInput', 'LOFISelect', 'LOFISwitch', 'LOFIButton', 'LOFIText'],
    exampleIds: ['filter-commit', 'filter-immediate'],
    intro:
      'P1.2.1 / P9 query row. Fields are `FieldDescriptor`s (the same schema used in modal bodies). `applyMode: "commit"` waits for Search; `applyMode: "immediate"` applies on change and usually keeps only Clear. Values are not stored as live app state inside the JSON — bind `onFieldChange(name, value)` and `onAction` (`search` / `clear`) at render time.',
  },
  'filter-chip-group': {
    primitives: ['LOFIChip'],
    exampleIds: ['filter-chip-group-mapping'],
    intro:
      'Exclusive status filters built from `LOFIChip` — not `LOFIButton`, not `LOFIFilterBar`. Each chip has `selected` on the active option and **no** `onClear` (no ✕). The selected chip inverts (ink fill) and stays pressed until another chip is chosen; a repeat press is a no-op. Counts belong in the label (`Unmapped (14)`). Gap between chips is `$space-8` (16px). Bind `onAction` to the chip `id`.',
  },
  sidebar: {
    primitives: ['LOFINavTree', 'LOFIToggle', 'LOFIButton', 'LOFIText'],
    exampleIds: ['sidebar-upl', 'sidebar-notifications'],
    intro:
      'P1.2.2 classification rail. UPL sidebars are a collapsible `LOFINavTree`. Tool / notifications sidebars add a heading, optional `LOFIToggle` group-by, and extra actions above the tree. Selection is `selectedId` plus `onSelect`. Collapse is an action id (`collapseActionId`), not a boolean the set mutates by itself.',
  },
  'main-workspace': {
    primitives: ['LOFIMainWorkspace', 'LOFIBadge', 'LOFITabs', 'LOFIButton', 'LOFIText'],
    exampleIds: ['main-workspace-detail'],
    intro:
      'P1.2.3 feature interface: breadcrumb, title + badges, optional tabs, body, sticky footer. The body is a `BodyConfig` (`form`, `table`, `copy`, `placeholder`, or `sections` with a `LOFIToggle`). This set is the centre column of an `upl-shell`, not a full app by itself.',
  },
  'summary-card': {
    primitives: ['LOFICard', 'LOFIBadge', 'LOFIText', 'LOFIButton'],
    exampleIds: ['summary-card'],
    intro:
      'Read-only entity summary used in overview tabs. Title, crumb, badges, label/value pairs, and a compact action cluster (Edit / Clone / Disable / Move / Remove). Row-level verbs stay `secondary` / `tertiary` / `destructive` — never a filled primary down a card column (U5.2).',
  },
  'list-header': {
    primitives: ['LOFIInput', 'LOFICheckbox', 'LOFIButton', 'LOFIField'],
    exampleIds: ['list-header'],
    intro:
      'Per-table management bar: search, class checkboxes, and a small Add commit. Lives above the data table inside the main workspace, not in the P9 filter query row. Add is host `list-header` so it stays compact next to filters.',
  },
  'table-chrome': {
    primitives: ['LOFITable', 'LOFIButton', 'LOFIStatefulButton', 'LOFIEmptyState', 'LOFIText'],
    exampleIds: ['table-mapping'],
    intro:
      'P2 table plus row actions and empty state. Columns / rows are serialisable descriptors. Row actions use host `row-actions` (compact, never fill down the column). Optional `empty` is an `EmptyDescriptor` mapped to `LOFIEmptyState`. Sort affordance is the `sortable` flag — the set does not own sort state.',
  },
  'suggestion-row': {
    primitives: ['LOFIText', 'LOFIBadge', 'LOFIStatefulButton', 'LOFIButton'],
    exampleIds: ['suggestion-row-high', 'suggestion-row-mapped'],
    intro:
      'One AI suggestion under an expanded mapping entity (P2.5 nested body). External label, match %, Map (`LOFIStatefulButton` P3) and Unmap (disabled until that suggestion is the accepted map). Only one suggestion can be mapped per parent; sibling Map buttons disable after success. Use inside the expanded body of a demo `LOFITable`, not as a second modal.',
  },
  'modal-editor': {
    primitives: ['LOFIModal', 'LOFIField', 'LOFIInput', 'LOFISelect', 'LOFITable', 'LOFIButton', 'LOFIText'],
    exampleIds: ['modal-create-tournament', 'modal-team', 'modal-merge-review'],
    intro:
      'P5 create / edit overlay. Title, optional description, body (`form`, `table`, `sections`, …), and a modal-footer cluster (dismiss left of commit). A P7 confirmation may stack on top of this modal when Save / Merge is destructive — that is a separate `p7-confirm` set, not a second editor. Bind footer `id`s with `onAction` and form fields with `onFieldChange`.',
  },
  'p7-confirm': {
    primitives: ['LOFIModal', 'LOFIButton', 'LOFIText'],
    exampleIds: ['p7-save', 'p7-discard', 'p7-bulk-map'],
    intro:
      'P7 confirmation-only overlay: title, message, two actions. No forms, tables, or extra fields. `confirm.destructive` maps to warning + fill at hi-fi (Discard). This is the only overlay allowed to stack on a `modal-editor`. Dismiss and confirm are required `ActionDescriptor`s on host `p7-footer`.',
  },
  'tool-shell': {
    primitives: ['LOFIToolbar', 'LOFITable', 'LOFIButton', 'LOFIStatefulButton', 'LOFIEmptyState', 'LOFIText'],
    exampleIds: ['tool-shell-mapping'],
    intro:
      'Standalone tool layout (mapping, merge): identity upper bar, optional commit search row, optional tabs, optional filter-chip group, optional bulk bar, and a table **or** `children` for a demo-owned expandable table. Full-page demos set `framed: false`. Not a full UPL.',
  },
  'upl-shell': {
    primitives: [
      'LOFIToolbar',
      'LOFIField',
      'LOFINavTree',
      'LOFIMainWorkspace',
      'LOFITabs',
      'LOFIButton',
      'LOFIStatefulButton',
    ],
    exampleIds: ['upl-shell-tournament'],
    intro:
      'Full P1 workspace: upper bar, optional module tabs, filter query row, sidebar, main workspace. This is the default shell for `upl-management` apps. Nested configs reuse the same kinds (`upper-bar`, `filter-query-row`, `sidebar`, `main-workspace`) so you can prototype the shell first and replace body slots later.',
  },
};

function navFor(kind: ComponentSet['kind']): string {
  const entry = COMPONENT_SET_KIND_NAV.find((item) => item.kind === kind);
  if (!entry) throw new Error(`Missing nav label for set kind: ${kind}`);
  return entry.nav;
}

export const SET_KIND_DOCS: Record<ComponentSet['kind'], SetKindDoc> = Object.fromEntries(
  (Object.keys(DOCS) as ComponentSet['kind'][]).map((kind) => [
    kind,
    { kind, nav: navFor(kind), ...DOCS[kind] },
  ]),
) as Record<ComponentSet['kind'], SetKindDoc>;

const FRAMED_KINDS = new Set<ComponentSet['kind']>([
  'action-cluster',
  'upper-bar',
  'filter-query-row',
  'filter-chip-group',
  'sidebar',
  'summary-card',
  'list-header',
  'table-chrome',
  'suggestion-row',
]);

export function isFramedSetKind(kind: ComponentSet['kind']): boolean {
  return FRAMED_KINDS.has(kind);
}

function examplesFor(kind: ComponentSet['kind']): SetExample[] {
  return SET_KIND_DOCS[kind].exampleIds.map((id) => {
    const example = exampleById(id);
    if (!example) throw new Error(`Unknown component-set example: ${id}`);
    return example;
  });
}

function collectIds(
  value: unknown,
  test: (rec: Record<string, unknown>) => string | undefined,
  acc: string[] = [],
): string[] {
  if (value == null || typeof value !== 'object') return acc;
  if (Array.isArray(value)) {
    for (const item of value) collectIds(item, test, acc);
    return acc;
  }
  const rec = value as Record<string, unknown>;
  const hit = test(rec);
  if (hit && !acc.includes(hit)) acc.push(hit);
  for (const nested of Object.values(rec)) collectIds(nested, test, acc);
  return acc;
}

function actionIds(set: ComponentSet): string[] {
  return collectIds(set, (rec) =>
    typeof rec.id === 'string' && typeof rec.role === 'string' ? rec.id : undefined,
  );
}

function fieldNames(set: ComponentSet): string[] {
  return collectIds(set, (rec) =>
    typeof rec.name === 'string' && typeof rec.kind === 'string' ? rec.name : undefined,
  );
}

function handlerSnippet(set: ComponentSet): string {
  const actions = actionIds(set);
  const fields = fieldNames(set);
  const lines = ['  handlers={{'];
  if (actions.length > 0) {
    lines.push(`    onAction: (id) => {`);
    lines.push(`      // ${actions.join(' | ')}`);
    lines.push(`    },`);
  } else if (set.kind === 'filter-chip-group') {
    lines.push(`    onAction: (id) => {`);
    lines.push(`      // ${set.chips.map((chip) => chip.id).join(' | ')}`);
    lines.push(`    },`);
  }
  if (fields.length > 0) {
    lines.push(`    onFieldChange: (name, value) => {`);
    lines.push(`      // ${fields.join(' | ')}`);
    lines.push(`    },`);
  }
  if (set.kind === 'sidebar' || set.kind === 'upl-shell') {
    lines.push(`    onSelect: (id) => { /* nav tree selectedId */ },`);
  }
  if (set.kind === 'main-workspace' || set.kind === 'upl-shell' || set.kind === 'tool-shell') {
    lines.push(`    onTabChange: (value) => { /* workspace / module tabs */ },`);
  }
  if (set.kind === 'sidebar' || set.kind === 'modal-editor' || set.kind === 'upl-shell') {
    lines.push(`    onToggleChange: (name, value) => { /* group-by / body sections */ },`);
  }
  lines.push('  }}');
  return lines.join('\n');
}

export function setKindUsageSource(exampleId: string): string {
  const example = exampleById(exampleId);
  if (!example) throw new Error(`Unknown component-set example: ${exampleId}`);
  const json = JSON.stringify(example.set, null, 2);
  return `import { LOFIComponentSet } from 'lofi-kit';
import type { ComponentSet } from 'lofi-kit';

const set = ${json} satisfies ComponentSet;

<LOFIComponentSet
  set={set}
${handlerSnippet(example.set)}
/>`;
}

export function catalogUsageSource(exampleId: string): string {
  return `import { LOFIComponentSet, exampleById } from 'lofi-kit';

const example = exampleById('${exampleId}');

<LOFIComponentSet
  set={example.set}
  handlers={{
    onAction: (id) => { /* bind action ids from example.set */ },
  }}
/>`;
}

export function setKindMarkdown(kind: ComponentSet['kind']): string {
  const doc = SET_KIND_DOCS[kind];
  const examples = examplesFor(kind);
  const primary = examples[0];
  const sources = examples
    .map((example) => `- **${example.title}** — \`${example.source}\` (UX ${example.ux.join(', ')}; UI ${example.ui.join(', ')})`)
    .join('\n');

  return `${doc.intro}

**Kind:** \`${kind}\`

**Composes:** ${doc.primitives.map((name) => `\`${name}\``).join(', ')}

## Derived from

Configs in \`lib/src/sets/examples.ts\`, extracted from demo compositions:

${sources}

Handlers (\`onAction\`, \`onFieldChange\`, \`onSelect\`, \`onTabChange\`, \`onToggleChange\`) stay **outside** the JSON. Bind \`id\` / \`name\` values at render time.

## Usage — catalog helper

Load a documented example, then replace it with your own config when the screen is real.

\`\`\`tsx
${catalogUsageSource(primary.id)}
\`\`\`

## Usage — inline config

The object below is the live \`${primary.id}\` example. Copy it, change labels, and keep \`kind: '${kind}'\`.

\`\`\`tsx
${setKindUsageSource(primary.id)}
\`\`\`
`;
}
