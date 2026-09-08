import { COMPONENT_SET_KIND_NAV, type NavTreeItem } from 'lofi-kit';

export interface StorybookNavNode {
  id: string;
  label: string;
  /** Storybook `?path=` value. Omit for expand-only groups. */
  path?: string;
  children?: StorybookNavNode[];
}

const UX_TITLE = 'PATTERNS/UX Patterns';
const UI_TITLE = 'PATTERNS/UI Patterns';

function sanitize(value: string): string {
  return value
    .toLowerCase()
    .replace(/[ ’–—―′¿'`~!@#$%^&*()_|+\-=?;:'",.<>{}[\]\\/]/gi, '-')
    .replace(/-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

/** Matches Storybook CSF `storyNameFromExport` / `toStartCaseStr`. */
function storyNameFromExport(key: string): string {
  return key
    .replace(/_/g, ' ')
    .replace(/-/g, ' ')
    .replace(/\./g, ' ')
    .replace(/([^\n])([A-Z])([a-z])/g, (_m, a: string, b: string, c: string) => `${a} ${b}${c}`)
    .replace(/([a-z])([A-Z])/g, (_m, a: string, b: string) => `${a} ${b}`)
    .replace(/([a-z])([0-9])/gi, (_m, a: string, b: string) => `${a} ${b}`)
    .replace(/([0-9])([a-z])/gi, (_m, a: string, b: string) => `${a} ${b}`)
    .replace(/(\s|^)(\w)/g, (_m, a: string, b: string) => `${a}${b.toUpperCase()}`)
    .replace(/ +/g, ' ')
    .trim();
}

export function docsPath(title: string): string {
  return `/docs/${sanitize(title)}--docs`;
}

/** Storybook 10 ids are `toId(title, storyNameFromExport(exportName))`. */
export function canvasPath(title: string, exportName: string): string {
  return `/story/${sanitize(title)}--${sanitize(storyNameFromExport(exportName))}`;
}

export function withStorybookPath(base: string, path: string): string {
  const normalized = base.endsWith('/') ? base : `${base}/`;
  return `${normalized}?path=${path}`;
}

function leaf(id: string, label: string, path: string): StorybookNavNode {
  return { id, label, path };
}

function branch(
  id: string,
  label: string,
  children: StorybookNavNode[],
  path?: string,
): StorybookNavNode {
  return { id, label, path, children };
}

export const UX_PATTERN_PAGES = [
  {
    id: 'P1',
    navId: 'ux-p1',
    slug: 'P1 Workspace',
    subsections: [
      { navId: 'ux-p1-1', slug: 'P1.1: UPL Shell' },
      { navId: 'ux-p1-2', slug: 'P1.2: Internal Workspace' },
      { navId: 'ux-p1-2-1', slug: 'P1.2.1: Filter Row' },
      { navId: 'ux-p1-2-2', slug: 'P1.2.2: Sidebar' },
      { navId: 'ux-p1-2-3', slug: 'P1.2.3: Main Interface View' },
      { navId: 'ux-p1-2-3-1', slug: 'P1.2.3.1: Heading Bar' },
      { navId: 'ux-p1-2-3-2', slug: 'P1.2.3.2: Footer' },
      { navId: 'ux-p1-2-3-3', slug: 'P1.2.3.3: Main Content' },
    ],
  },
  {
    id: 'P2',
    navId: 'ux-p2',
    slug: 'P2 Data Table',
    subsections: [
      { navId: 'ux-p2-1', slug: 'P2.1: Table Structure' },
      { navId: 'ux-p2-2', slug: 'P2.2: Row Actions' },
      { navId: 'ux-p2-3', slug: 'P2.3: Table Column Controls' },
      { navId: 'ux-p2-4', slug: 'P2.4: Bulk Operations' },
      { navId: 'ux-p2-5', slug: 'P2.5: Expandable rows' },
    ],
  },
  { id: 'P3', navId: 'ux-p3', slug: 'P3 Stateful Button' },
  { id: 'P4', navId: 'ux-p4', slug: 'P4 Toast notification' },
  { id: 'P5', navId: 'ux-p5', slug: 'P5 Modal' },
  { id: 'P6', navId: 'ux-p6', slug: 'P6 Inline Validation' },
  { id: 'P7', navId: 'ux-p7', slug: 'P7 Confirmation dialog' },
  { id: 'P8', navId: 'ux-p8', slug: 'P8 Tab navigation' },
  { id: 'P9', navId: 'ux-p9', slug: 'P9 Filters' },
  { id: 'P10', navId: 'ux-p10', slug: 'P10 Sticky disclosure' },
] as const;

export function uxPatternDocsPath(patternId?: string): string {
  if (!patternId) return docsPath(UX_TITLE);
  const match = /^P(\d+)/.exec(patternId);
  if (!match) return docsPath(UX_TITLE);
  const page = UX_PATTERN_PAGES.find((entry) => entry.id === `P${match[1]}`);
  return page ? docsPath(`${UX_TITLE}/${page.slug}`) : docsPath(UX_TITLE);
}

function uxPatternNode(page: (typeof UX_PATTERN_PAGES)[number]): StorybookNavNode {
  const title = `${UX_TITLE}/${page.slug}`;
  const path = docsPath(title);
  const subsections = 'subsections' in page ? page.subsections : undefined;
  if (!subsections?.length) {
    return leaf(page.navId, page.slug, path);
  }
  return branch(
    page.navId,
    page.slug,
    subsections.map((sub) => leaf(sub.navId, sub.slug, docsPath(`${title}/${sub.slug}`))),
    path,
  );
}

function uiStory(id: string, label: string, exportName: string): StorybookNavNode {
  return leaf(id, label, canvasPath(UI_TITLE, exportName));
}

const PRIMITIVE_NAMES = [
  'Badge',
  'Button',
  'Card',
  'Checkbox',
  'Chip',
  'EmptyState',
  'Field',
  'Fieldset',
  'InlineAlert',
  'Input',
  'Loader',
  'MainWorkspace',
  'Modal',
  'MultiSelect',
  'NavTree',
  'Pagination',
  'Panel',
  'Radio',
  'Select',
  'StatefulButton',
  'Steps',
  'Switch',
  'Table',
  'Tabs',
  'Text',
  'Textarea',
  'Toast',
  'Toggle',
  'Toolbar',
] as const;

function primitive(name: string): StorybookNavNode {
  return leaf(
    `lofi-primitive-${name.toLowerCase()}`,
    name,
    docsPath(`LOW FI Design system/Primitives/${name}`),
  );
}

const SET_FIRST_STORY: Record<string, string> = {
  'action-cluster': 'WorkspaceFooter',
  'upper-bar': 'UplUpperBar',
  'filter-query-row': 'FilterCommit',
  'filter-chip-group': 'MappingStatus',
  sidebar: 'SidebarUpl',
  'main-workspace': 'MainWorkspaceDetail',
  'summary-card': 'SummaryCard',
  'list-header': 'ListHeader',
  'table-chrome': 'TableMapping',
  'suggestion-row': 'HighConfidence',
  'modal-editor': 'ModalCreateTournament',
  'p7-confirm': 'P7Save',
  'tool-shell': 'ToolShellMapping',
  'upl-shell': 'UplShellTournament',
};

function componentSet(nav: string, kind: string): StorybookNavNode {
  const firstExport = SET_FIRST_STORY[kind];
  if (!firstExport) throw new Error(`Missing first Storybook export for set kind: ${kind}`);
  return leaf(
    `lofi-set-${kind}`,
    nav,
    canvasPath(`LOW FI Design system/Component sets/${nav}`, firstExport),
  );
}

function flowNode(name: string): StorybookNavNode {
  return leaf(
    `lofi-diagram-${name.toLowerCase()}`,
    name,
    docsPath(`LOW FI Design system/Diagram/Flow nodes/${name}`),
  );
}

export const STORYBOOK_NAV: StorybookNavNode[] = [
  leaf('introduction', 'Introduction', docsPath('Introduction')),
  branch(
    'ux-patterns',
    'UX Patterns',
    UX_PATTERN_PAGES.map((page) => uxPatternNode(page)),
    docsPath(UX_TITLE),
  ),
  branch(
    'ui-patterns',
    'UI Patterns',
    [
      branch('ui-s1', '§1 Buttons + badges', [
        uiStory('ui-s1-7', "§1.7 Button hierarchy Do / Don't", 'UI_ButtonHierarchyDoDont'),
        uiStory('ui-s1-1', '§1.1–1.3 Button colour + rank', 'UI_ButtonColorRank'),
        uiStory('ui-s1-4', '§1.4–1.5 Brand + feedback badges', 'UI_BrandAndFeedbackBadges'),
      ]),
      uiStory('ui-s2', '§2 Typography roles + scale', 'UI_TypographyRoles'),
      uiStory('ui-s3', '§3 Form fields + validation tone', 'UI_FormFieldValidation'),
      uiStory('ui-s4-modal', '§4 Modal commit + P7 chrome', 'UI_ModalCommitAndP7'),
      uiStory('ui-s4-tabs', '§4 Tabs + neutral labels', 'UI_TabsAndMenus'),
      uiStory('ui-s5', '§5 Table, filters, bulk', 'UI_TableFiltersBulk'),
    ],
    docsPath(UI_TITLE),
  ),
  branch('low-fi-design-system', 'LOW FI Design system', [
    leaf('lofi-kit-docs', 'LOFI Kit', docsPath('LOW FI Design system/LOFI Kit')),
    branch(
      'lofi-primitives',
      'Primitives',
      [
        leaf(
          'lofi-primitives-overview',
          'Overview',
          docsPath('LOW FI Design system/Primitives/Overview'),
        ),
        ...PRIMITIVE_NAMES.map((name) => primitive(name)),
      ],
      docsPath('LOW FI Design system/Primitives/Overview'),
    ),
    branch(
      'lofi-component-sets',
      'Component sets',
      [
        leaf(
          'lofi-sets-overview',
          'Overview',
          docsPath('LOW FI Design system/Component sets/Overview'),
        ),
        ...COMPONENT_SET_KIND_NAV.map((entry) => componentSet(entry.nav, entry.kind)),
      ],
      docsPath('LOW FI Design system/Component sets/Overview'),
    ),
    branch('lofi-diagram', 'Diagram', [
      leaf('lofi-diagram-canvas', 'Canvas', docsPath('LOW FI Design system/Diagram/Canvas')),
      flowNode('Start'),
      flowNode('End'),
      flowNode('Step'),
      flowNode('Decision'),
      flowNode('Actor'),
      flowNode('Message'),
      flowNode('Annotation'),
    ]),
  ]),
];

export const DEFAULT_STORYBOOK_PATH = docsPath('Introduction');
export const DEFAULT_STORYBOOK_SELECTED_ID = 'introduction';
export const DEFAULT_EXPANDED_IDS = ['ux-patterns', 'ui-patterns'];
export const LOW_FI_DESIGN_SYSTEM_ID = 'low-fi-design-system';

export function toNavTreeItems(nodes: StorybookNavNode[]): NavTreeItem[] {
  return nodes.map((node) => ({
    id: node.id,
    label: node.label,
    children: node.children ? toNavTreeItems(node.children) : undefined,
  }));
}

export function localizeStorybookNav(
  nodes: StorybookNavNode[],
  labels: Record<string, string>,
): StorybookNavNode[] {
  return nodes.map((node) => ({
    ...node,
    label: labels[node.id] ?? node.label,
    children: node.children ? localizeStorybookNav(node.children, labels) : undefined,
  }));
}

export function findNodeById(
  nodes: StorybookNavNode[],
  id: string,
): StorybookNavNode | undefined {
  for (const node of nodes) {
    if (node.id === id) return node;
    if (node.children) {
      const nested = findNodeById(node.children, id);
      if (nested) return nested;
    }
  }
  return undefined;
}

export function findNodeByPath(
  nodes: StorybookNavNode[],
  path: string,
): StorybookNavNode | undefined {
  for (const node of nodes) {
    if (node.path === path) return node;
    if (node.children) {
      const nested = findNodeByPath(node.children, path);
      if (nested) return nested;
    }
  }
  return undefined;
}

export function ancestorIds(nodes: StorybookNavNode[], targetId: string): string[] {
  const trail: string[] = [];

  function walk(items: StorybookNavNode[]): boolean {
    for (const item of items) {
      if (item.id === targetId) return true;
      if (item.children && walk(item.children)) {
        trail.unshift(item.id);
        return true;
      }
    }
    return false;
  }

  walk(nodes);
  return trail;
}
