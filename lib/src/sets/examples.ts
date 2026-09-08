import type { SetExample } from './types';

const SPORT_OPTIONS = [
  { value: 'all', label: 'All sports' },
  { value: 'soccer', label: 'Soccer' },
  { value: 'tennis', label: 'Tennis' },
];

const SIDEBAR_TREE = [
  {
    id: 'soccer',
    label: 'Soccer',
    children: [
      {
        id: 'intl-clubs',
        label: 'International Clubs',
        children: [
          { id: 'ucl', label: 'UEFA Champions League' },
          { id: 'st-ko', label: 'Knockout 24/25' },
        ],
      },
    ],
  },
];

/**
 * Configs extracted from existing demos. Handlers are not in the JSON —
 * bind `id` values at render time.
 */
export const COMPONENT_SET_EXAMPLES: SetExample[] = [
  {
    id: 'p7-save',
    title: 'P7 confirm — Save',
    source: 'demos/tournament-management/src/components/TournamentManagement/ConfirmDialog.tsx',
    ux: ['P7'],
    ui: ['U1', 'U4.2', 'U4.5'],
    set: {
      kind: 'p7-confirm',
      title: 'Save changes?',
      message: 'Commit "Knockout 24/25" to mocked workspace storage?',
      dismiss: { id: 'cancel', role: 'dismiss', label: 'Cancel' },
      confirm: { id: 'save', role: 'commit', label: 'Save' },
    },
  },
  {
    id: 'p7-discard',
    title: 'P7 confirm — Discard (destructive)',
    source: 'demos/tournament-management/src/components/TournamentManagement/ConfirmDialog.tsx',
    ux: ['P7'],
    ui: ['U1.3', 'U4.5'],
    set: {
      kind: 'p7-confirm',
      title: 'Discard changes?',
      message: 'Close without applying edits?',
      muted: 'Confirm only if downstream teams accept the mocked irreversible wording.',
      dismiss: { id: 'cancel', role: 'dismiss', label: 'Cancel' },
      confirm: { id: 'discard', role: 'commit', label: 'Discard', destructive: true },
    },
  },
  {
    id: 'modal-create-tournament',
    title: 'Modal editor footer — Create',
    source: 'demos/tournament-management/src/components/TournamentManagement/TournamentModal.tsx',
    ux: ['P5', 'P6', 'P7'],
    ui: ['U1', 'U3.5', 'U4.2'],
    set: {
      kind: 'modal-editor',
      title: 'Create simple tournament',
      description: 'Classification prefills mirror sidebar Browse selection.',
      size: 'wide',
      body: {
        type: 'form',
        fields: [
          { name: 'name', kind: 'text', label: 'Name', value: '', required: true, placeholder: 'Tournament name' },
          {
            name: 'type',
            kind: 'select',
            label: 'Competition type',
            value: 'cup',
            options: [
              { value: 'cup', label: 'Cup' },
              { value: 'league', label: 'League' },
              { value: 'neither', label: 'Neither' },
            ],
          },
        ],
      },
      footer: [
        { id: 'cancel', role: 'dismiss', label: 'Cancel' },
        { id: 'create', role: 'commit', label: 'Create' },
      ],
    },
  },
  {
    id: 'modal-team',
    title: 'Modal editor — Team (sections + footer)',
    source: 'demos/bracket-demo/src/components/TeamManagement/TeamModal.tsx',
    ux: ['P5', 'P8'],
    ui: ['U3', 'U4.2', 'U4.4'],
    set: {
      kind: 'modal-editor',
      title: 'New Team',
      size: 'wide',
      body: {
        type: 'sections',
        toggle: {
          name: 'section',
          ariaLabel: 'Modal section',
          value: 'info',
          options: [
            { value: 'info', label: 'Team Info' },
            { value: 'players', label: 'Players' },
          ],
        },
        panels: [
          {
            value: 'info',
            body: {
              type: 'form',
              fields: [
                { name: 'teamName', kind: 'text', label: 'Team name', value: '', required: true, placeholder: 'e.g. FC Barcelona' },
              ],
            },
          },
          {
            value: 'players',
            body: { type: 'placeholder', label: 'Complete team info before managing players.' },
          },
        ],
      },
      footer: [
        { id: 'cancel', role: 'dismiss', label: 'Cancel' },
        { id: 'create', role: 'commit', label: 'Create Team', disabled: true },
      ],
    },
  },
  {
    id: 'modal-merge-review',
    title: 'Modal editor — Merge review',
    source: 'demos/sketchflow-showcase/src/examples/merge-tool/MergeToolExample.tsx',
    ux: ['P5', 'P2'],
    ui: ['U4.2', 'U5'],
    set: {
      kind: 'modal-editor',
      title: 'Review merge — Inception',
      size: 'wide',
      body: {
        type: 'table',
        table: {
          columns: [
            { id: 'field', header: 'Field', field: 'field' },
            { id: 'ours', header: 'Our database', field: 'ours' },
            { id: 'crawler', header: 'Crawler', field: 'crawler', shrink: true },
          ],
          rows: [
            { id: 'title', field: 'Title', ours: 'Inception', crawler: 'Inception' },
            { id: 'genre', field: 'Genre', ours: 'Sci-Fi', crawler: 'Science Fiction' },
          ],
        },
      },
      footer: [
        { id: 'reset', role: 'secondary', label: 'Reset', disabled: true },
        { id: 'merge', role: 'commit', label: 'Merge', disabled: true },
      ],
    },
  },
  {
    id: 'p7-bulk-map',
    title: 'P7 confirm — Bulk Map',
    source: 'demos/mapping-prototype/src/components/MappingView/MappingView.tsx',
    ux: ['P7', 'P2.4'],
    ui: ['U4.5', 'U5.5'],
    set: {
      kind: 'p7-confirm',
      title: 'Confirm Bulk Map',
      message: 'Apply the external suggestion to 3 selected items?',
      muted: 'This will mark each selected row as mapped. Individual mappings can be removed using Unmap.',
      dismiss: { id: 'cancel', role: 'dismiss', label: 'Cancel' },
      confirm: { id: 'apply', role: 'commit', label: 'Apply to 3 items' },
    },
  },
  {
    id: 'workspace-footer',
    title: 'Workspace footer — Reset + Save (P3)',
    source: 'docs/COMPOSITION_PATTERNS.md (UPL sticky footer recipe)',
    ux: ['P1.2.3.2', 'P3', 'P6', 'P7'],
    ui: ['U1', 'U3.5'],
    set: {
      kind: 'action-cluster',
      host: 'workspace-footer',
      actions: [
        { id: 'reset', role: 'secondary', label: 'Reset changes' },
        {
          id: 'save',
          role: 'commit',
          label: 'Save changes',
          stateful: true,
          state: 'idle',
          loadingLabel: 'Saving',
          successLabel: 'Saved',
        },
      ],
    },
  },
  {
    id: 'page-footer-merge',
    title: 'Page footer — Reset + Merge',
    source: 'demos/sketchflow-showcase/src/examples/merge-tool/MergeToolExample.tsx',
    ux: ['P1.2.3.2', 'P5'],
    ui: ['U1', 'U3.5'],
    set: {
      kind: 'action-cluster',
      host: 'page-footer',
      actions: [
        { id: 'reset', role: 'secondary', label: 'Reset' },
        { id: 'merge', role: 'commit', label: 'Merge', disabled: true },
      ],
    },
  },
  {
    id: 'upl-upper-bar',
    title: 'UPL upper bar',
    source: 'demos/tournament-management/src/components/TournamentManagement/UPLToolbar.tsx',
    ux: ['P1.1'],
    ui: ['U1.2', 'U4'],
    set: {
      kind: 'upper-bar',
      variant: 'upl',
      title: 'Unified Production Landscape | Tournament management (prototype shell)',
      subtitle: 'Manage simple tournaments linked to sidebar classification',
      rightActions: [
        { id: 'apps', role: 'dismiss', label: 'Applications' },
        { id: 'config', role: 'dismiss', label: 'Configuration' },
        { id: 'role', role: 'dismiss', label: 'r.operator' },
      ],
    },
  },
  {
    id: 'tool-upper-bar',
    title: 'Tool identity bar',
    source: 'demos/mapping-prototype/src/components/MappingView/MappingView.tsx',
    ux: ['P1.1'],
    ui: ['U2'],
    set: {
      kind: 'upper-bar',
      variant: 'tool',
      title: 'Mapping',
      identity: { handle: 'j.smith', role: 'Operator' },
      counts: [
        { label: '12 mapped', active: true },
        { label: '4 pending', active: false },
      ],
      rightActions: [],
    },
  },
  {
    id: 'filter-commit',
    title: 'Filter query row — Search + Clear (commit)',
    source: 'demos/tournament-management/src/components/TournamentManagement/FilterRow.tsx',
    ux: ['P1.2.1', 'P9'],
    ui: ['U3', 'U5.4', 'U6'],
    set: {
      kind: 'filter-query-row',
      legend: 'Filters combine with AND logic. Changes apply after Search.',
      applyMode: 'commit',
      fields: [
        { name: 'nameOrId', kind: 'search', label: 'Simple tournament name or ID', value: '', placeholder: 'Search by name or id…', allowClear: true },
        { name: 'sport', kind: 'select', label: 'Sport', value: 'all', options: SPORT_OPTIONS, allowClear: true, placeholder: 'All sports' },
        { name: 'dateFrom', kind: 'date', label: 'Date from', value: '', allowClear: true },
        { name: 'onlyRunning', kind: 'switch', label: 'Only running', value: false, hint: 'Mocked running flag' },
      ],
      actions: [
        { id: 'search', role: 'commit', label: 'Search' },
        { id: 'clear', role: 'dismiss', label: 'Clear all' },
      ],
    },
  },
  {
    id: 'filter-immediate',
    title: 'Filter query row — immediate (Clear only)',
    source: 'demos/notifications-overview/src/components/NotificationsOverview/NotificationsFilters.tsx',
    ux: ['P9'],
    ui: ['U5.4'],
    set: {
      kind: 'filter-query-row',
      legend: 'Filters apply together (AND). Each field can be cleared independently.',
      applyMode: 'immediate',
      fields: [
        {
          name: 'daysBack',
          kind: 'select',
          label: 'Days back',
          value: '7',
          options: [
            { value: '1', label: '1 day' },
            { value: '7', label: '7 days' },
            { value: '30', label: '30 days' },
          ],
        },
        { name: 'sport', kind: 'select', label: 'Sport', value: 'all', options: SPORT_OPTIONS, allowClear: true, placeholder: 'All sports' },
      ],
      actions: [{ id: 'clear', role: 'dismiss', label: 'Clear all' }],
    },
  },
  {
    id: 'filter-chip-group-mapping',
    title: 'Filter chip group — All / Unmapped / Mapped',
    source: 'demos/mapping-prototype/src/components/MappingView/MappingView.tsx',
    ux: ['P9'],
    ui: ['U5.4', 'U6'],
    set: {
      kind: 'filter-chip-group',
      ariaLabel: 'Mapping status',
      chips: [
        { id: 'all', label: 'All', count: 20, selected: false },
        { id: 'unmapped', label: 'Unmapped', count: 14, selected: true },
        { id: 'mapped', label: 'Mapped', count: 6, selected: false },
      ],
    },
  },
  {
    id: 'suggestion-row-high',
    title: 'Suggestion row — high confidence, Unmap disabled',
    source: 'demos/mapping-prototype/src/components/MappingView/MappingView.tsx',
    ux: ['P2.2', 'P2.5', 'P3'],
    ui: ['U5.2'],
    set: {
      kind: 'suggestion-row',
      id: 's-high',
      external: 'gryffindor quidditch xi',
      percent: 99,
      map: { id: 'map', role: 'commit', label: 'Map', stateful: true, state: 'idle', successLabel: 'Mapped' },
      unmap: { id: 'unmap', role: 'secondary', label: 'Unmap', disabled: true },
    },
  },
  {
    id: 'suggestion-row-mapped',
    title: 'Suggestion row — mapped, Unmap enabled',
    source: 'demos/mapping-prototype/src/components/MappingView/MappingView.tsx',
    ux: ['P2.2', 'P3'],
    ui: ['U5.2'],
    set: {
      kind: 'suggestion-row',
      id: 's-mapped',
      external: 'HARRY P0TTER',
      percent: 88,
      map: { id: 'map', role: 'commit', label: 'Map', stateful: true, state: 'success', successLabel: 'Mapped', disabled: true },
      unmap: { id: 'unmap', role: 'secondary', label: 'Unmap' },
    },
  },
  {
    id: 'sidebar-upl',
    title: 'UPL sidebar — tree + collapse',
    source: 'demos/tournament-management/src/components/TournamentManagement/Sidebar.tsx',
    ux: ['P1.2.2'],
    ui: ['U4'],
    set: {
      kind: 'sidebar',
      collapsed: false,
      collapseActionId: 'collapse',
      items: SIDEBAR_TREE,
      selectedId: 'st-ko',
    },
  },
  {
    id: 'sidebar-notifications',
    title: 'Notifications sidebar — group-by + bucket',
    source: 'demos/notifications-overview/src/components/NotificationsOverview/NotificationsSidebar.tsx',
    ux: ['P1.2.2', 'P9'],
    ui: ['U4.4'],
    set: {
      kind: 'sidebar',
      heading: 'Sidebar',
      groupBy: {
        name: 'groupBy',
        ariaLabel: 'Group notifications by',
        value: 'message-type',
        options: [
          { value: 'message-type', label: 'Message type' },
          { value: 'match', label: 'Match' },
        ],
      },
      extraActions: [{ id: 'betting', role: 'commit', label: 'Betting — solve immediately (2)' }],
      items: [
        {
          id: 'missing-lineups',
          label: 'Missing lineups',
          children: [{ id: 'n-1', label: 'Arsenal vs Chelsea' }],
        },
      ],
      selectedId: 'n-1',
    },
  },
  {
    id: 'list-header',
    title: 'List header — search + class filters + Add',
    source: 'demos/tournament-management/src/components/TournamentManagement/ListHeader.tsx',
    ux: ['P2', 'P9'],
    ui: ['U5'],
    set: {
      kind: 'list-header',
      search: {
        name: 'search',
        kind: 'search',
        label: 'Filter by name or ID',
        value: '',
        placeholder: 'Filter by name or ID',
        allowClear: true,
      },
      filters: [
        { name: 'showUnique', kind: 'checkbox', label: 'Unique', value: true },
        { name: 'showSimple', kind: 'checkbox', label: 'Simple', value: true },
      ],
      add: { id: 'add', role: 'commit', label: '+ Add tournament' },
    },
  },
  {
    id: 'bulk-bar',
    title: 'Bulk action bar',
    source: 'demos/tournament-management/src/components/TournamentManagement/ListView.tsx',
    ux: ['P2.4'],
    ui: ['U5.5'],
    set: {
      kind: 'action-cluster',
      host: 'bulk-bar',
      actions: [
        { id: 'edit', role: 'secondary', label: 'Edit selected', disabled: true },
        { id: 'move', role: 'secondary', label: 'Move selected', stateful: true, successLabel: 'Moved' },
        { id: 'clone', role: 'secondary', label: 'Clone selected', stateful: true, successLabel: 'Cloned' },
        { id: 'remove', role: 'destructive', label: 'Remove selected', stateful: true, successLabel: 'Removed' },
      ],
    },
  },
  {
    id: 'summary-card',
    title: 'Summary card — entity actions',
    source: 'demos/tournament-management/src/components/TournamentManagement/OverviewPanel.tsx',
    ux: ['P2.2'],
    ui: ['U1.2', 'U5.2'],
    set: {
      kind: 'summary-card',
      title: 'Summary',
      crumb: 'Soccer › International Clubs › UEFA Champions League',
      badges: [
        { label: 'simple tournament', variant: 'tag' },
        { label: 'running', variant: 'tag' },
        { label: 'active', variant: 'status', active: true },
      ],
      pairs: [{ label: 'Unique tournament linkage', value: 'UEFA Champions League' }],
      actions: [
        { id: 'edit', role: 'secondary', label: '✎ Edit' },
        { id: 'clone', role: 'tertiary', label: '⧉ Clone' },
        { id: 'disable', role: 'tertiary', label: 'Disable' },
        { id: 'move', role: 'tertiary', label: 'Move' },
        { id: 'remove', role: 'destructive', label: 'Remove' },
      ],
    },
  },
  {
    id: 'main-workspace-detail',
    title: 'Main workspace — detail + tabs',
    source: 'demos/tournament-management/src/components/TournamentManagement/DetailView.tsx',
    ux: ['P1.2.3', 'P8'],
    ui: ['U2', 'U4.4'],
    set: {
      kind: 'main-workspace',
      breadcrumb: [
        { label: 'Soccer', actionId: 'nav-soccer' },
        { label: 'International Clubs' },
        { label: 'UEFA Champions League', actionId: 'nav-ucl' },
        { label: 'Knockout 24/25' },
      ],
      title: 'Knockout 24/25',
      badges: [{ label: 'st-ko-2425', variant: 'id' }],
      tabs: [
        { value: 'overview', label: 'Overview' },
        { value: 'changelog', label: 'Change log' },
      ],
      activeTab: 'overview',
      body: { type: 'placeholder', label: 'Overview / change-log body slots here — see summary-card set.' },
    },
  },
  {
    id: 'table-mapping',
    title: 'Table chrome — mapping rows',
    source: 'demos/mapping-prototype/src/components/MappingView/MappingView.tsx',
    ux: ['P2', 'P2.2', 'P3'],
    ui: ['U5.1', 'U5.2'],
    set: {
      kind: 'table-chrome',
      hint: 'Expand a row to rank AI suggestions. Map one suggestion per entity.',
      sortable: true,
      columns: [
        { id: 'internal', header: 'Internal entity', field: 'internal' },
        { id: 'status', header: 'Status', field: 'status', shrink: true },
      ],
      rows: [
        { id: 'hp-player-001', internal: 'Harry Potter', status: 'mapped' },
        { id: 'hp-player-002', internal: 'Cedric Diggory', status: 'unmapped' },
      ],
      rowActions: [
        { id: 'map', role: 'commit', label: 'Map', stateful: true, successLabel: 'Mapped' },
        { id: 'unmap', role: 'secondary', label: 'Unmap' },
      ],
    },
  },
  {
    id: 'tool-shell-mapping',
    title: 'Tool shell — Wizarding mapping',
    source: 'demos/mapping-prototype/src/components/MappingView/MappingView.tsx',
    ux: ['P1', 'P2', 'P2.5', 'P9'],
    ui: ['U5', 'U6'],
    set: {
      kind: 'tool-shell',
      toolbar: {
        variant: 'tool',
        title: 'Wizarding mapping',
        identity: { handle: 'j.smith', role: 'Operator' },
        rightActions: [],
      },
      filterRow: {
        applyMode: 'commit',
        fields: [
          {
            name: 'nameOrId',
            kind: 'search',
            label: 'Name or ID',
            value: '',
            placeholder: 'Search by name or id…',
            allowClear: true,
          },
        ],
        actions: [
          { id: 'search', role: 'commit', label: 'Search', disabled: true },
          { id: 'clear', role: 'dismiss', label: 'Clear all' },
        ],
      },
      chipGroup: {
        ariaLabel: 'Mapping status',
        chips: [
          { id: 'all', label: 'All', count: 8, selected: true },
          { id: 'unmapped', label: 'Unmapped', count: 5 },
          { id: 'mapped', label: 'Mapped', count: 3 },
        ],
      },
      tabs: [
        { value: 'players', label: 'Players & houses' },
        { value: 'fixtures', label: 'Fixtures & duels' },
        { value: 'cups', label: 'Cups & tournaments' },
        { value: 'positions', label: 'Positions & bout types' },
      ],
      activeTab: 'players',
      table: {
        hint: 'Expand a row to rank AI suggestions. Map one suggestion per entity.',
        columns: [
          { id: 'internal', header: 'Internal entity', field: 'internal' },
          { id: 'status', header: 'Status', field: 'status', shrink: true },
        ],
        rows: [
          { id: 'hp-player-001', internal: 'Harry Potter', status: 'mapped' },
          { id: 'hp-player-002', internal: 'Cedric Diggory', status: 'unmapped' },
        ],
        empty: {
          variant: 'no-results',
          title: 'No mapping items.',
          description: 'Widen filters or retry Search.',
        },
      },
    },
  },
  {
    id: 'upl-shell-tournament',
    title: 'UPL shell — Tournament management',
    source: 'demos/tournament-management/src/components/TournamentManagement/TournamentManagement.tsx',
    ux: ['P1', 'P2', 'P9'],
    ui: ['U4', 'U5', 'U6'],
    set: {
      kind: 'upl-shell',
      upperBar: {
        variant: 'upl',
        title: 'Unified Production Landscape | Tournament management',
        subtitle: 'Prototype shell',
        rightActions: [
          { id: 'apps', role: 'dismiss', label: 'Applications' },
          { id: 'config', role: 'dismiss', label: 'Configuration' },
          { id: 'role', role: 'dismiss', label: 'r.operator' },
        ],
      },
      filterRow: {
        applyMode: 'commit',
        fields: [
          { name: 'sport', kind: 'select', label: 'Sport', value: 'soccer', options: SPORT_OPTIONS },
        ],
        actions: [
          { id: 'search', role: 'commit', label: 'Search' },
          { id: 'clear', role: 'dismiss', label: 'Clear all' },
        ],
      },
      sidebar: {
        collapseActionId: 'collapse',
        items: SIDEBAR_TREE,
        selectedId: 'st-ko',
      },
      workspace: {
        breadcrumb: [{ label: 'Soccer' }, { label: 'Knockout 24/25' }],
        title: 'Knockout 24/25',
        tabs: [
          { value: 'overview', label: 'Overview' },
          { value: 'changelog', label: 'Change log' },
        ],
        activeTab: 'overview',
        body: { type: 'placeholder', label: 'Feature interface body (form / table / card).' },
        footer: [
          { id: 'reset', role: 'secondary', label: 'Reset changes' },
          { id: 'save', role: 'commit', label: 'Save changes', stateful: true, successLabel: 'Saved' },
        ],
      },
    },
  },
];

export function exampleById(id: string): SetExample | undefined {
  return COMPONENT_SET_EXAMPLES.find((example) => example.id === id);
}
