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

export function docsPath(title: string): string {
  return `/docs/${sanitize(title)}--docs`;
}

export function canvasPath(title: string, exportName: string): string {
  return `/story/${sanitize(title)}--${sanitize(exportName)}`;
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

function uxStory(id: string, label: string, exportName: string): StorybookNavNode {
  return leaf(id, label, canvasPath(UX_TITLE, exportName));
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

function componentSet(nav: string, kind: string): StorybookNavNode {
  return leaf(
    `lofi-set-${kind}`,
    nav,
    docsPath(`LOW FI Design system/Component sets/${nav}`),
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
    [
      branch('ux-p1', 'P1 Workspace', [
        uxStory('ux-p1-1', 'P1.1 Workspace shell', 'P1_1_UPLShell'),
        branch('ux-p1-2', 'P1.2 Filter / sidebar / main', [
          uxStory('ux-p1-2-1', 'P1.2.1 Filter row', 'P1_2_1_FilterRow'),
          uxStory('ux-p1-2-2', 'P1.2.2 Sidebar', 'P1_2_2_Sidebar'),
          branch('ux-p1-2-3', 'P1.2.3 Main interface', [
            uxStory('ux-p1-2-3-view', 'P1.2.3 Main interface view', 'P1_2_3_MainInterface'),
            uxStory('ux-p1-2-3-1', 'P1.2.3.1 Heading bar', 'P1_2_3_1_HeadingBar'),
            uxStory('ux-p1-2-3-2', 'P1.2.3.2 Footer', 'P1_2_3_2_Footer'),
            uxStory('ux-p1-2-3-3', 'P1.2.3.3 Main content', 'P1_2_3_3_MainContent'),
          ]),
        ]),
      ]),
      branch('ux-p2', 'P2 Data table', [
        uxStory('ux-p2-1', 'P2.1 Table structure', 'P2_1_TableStructure'),
        uxStory('ux-p2-empty', 'P2.1 First-use empty state', 'P2_EmptyState'),
        uxStory('ux-p2-loading', 'P2.1 Loading and feedback', 'P2_LoadingState'),
        uxStory('ux-p2-2', 'P2.2 Row actions', 'P2_2_RowActions'),
        uxStory('ux-p2-3', 'P2.3 Sort affordance', 'P2_3_SortAffordance'),
        uxStory('ux-p2-4', 'P2.4 Bulk hide', 'P2_4_BulkHide'),
        uxStory('ux-p2-4-import', 'P2.4 Bulk import overlay', 'P2_4_BulkImport'),
        uxStory('ux-p2-5', 'P2.5 Expandable rows', 'P2_5_ExpandableRows'),
      ]),
      uxStory('ux-p3', 'P3 Stateful Button', 'P3_StatefulButton'),
      uxStory('ux-p4', 'P4 Toast notification', 'P4_ToastNotificationMessages'),
      branch('ux-p5', 'P5 Modal', [
        uxStory('ux-p5-edit', 'P5 Edit modal', 'P5_EditModal'),
        uxStory('ux-p5-create', 'P5 Create modal', 'P5_CreateModal'),
        uxStory('ux-p5-stack', 'P5 Modal stacking', 'P5_ModalStacking'),
      ]),
      uxStory('ux-p6', 'P6 Inline validation', 'P6_InlineValidation'),
      uxStory('ux-p7', 'P7 Confirmation dialog', 'P7_Confirmation'),
      uxStory('ux-p8', 'P8 Tab navigation', 'P8_TabNavigation'),
      uxStory('ux-p9', 'P9 Filters', 'P9_Filters'),
      uxStory('ux-p10', 'P10 Sticky disclosure', 'P10_StickyDisclosure'),
      uxStory('ux-story-1', 'Story 1 — Team Management', 'Story1_TeamManagement'),
      uxStory('ux-story-2', 'Story 2 — Workspace — Tournament admin', 'Story2_TournamentAdmin'),
    ],
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
