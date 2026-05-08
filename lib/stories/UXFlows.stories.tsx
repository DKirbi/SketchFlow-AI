/**
 * UX Flow pattern demos for Storybook and for embedding in `UXFlows.mdx` via
 * `<!-- storybook:embed ExportName -->` markers in `docs/UX_PATTERNS.md`.
 *
 * To add an example: export a new `StoryObj` named `P#_…` (see existing exports),
 * then add a matching HTML comment in `docs/UX_PATTERNS.md` where the canvas should appear.
 * Reference flows (Story 1 / Story 2) export as `Story1_TeamManagement` / `Story2_TournamentAdmin`
 * below; prose and embeds live in `docs/UX_PATTERN_STORIES.md`.
 */
import type { Meta, StoryObj } from '@storybook/react';
import { useEffect, useRef, useState } from 'react';
import React from 'react';
import type { ColumnDef, StatefulButtonState, TableColumnMeta } from 'lofi-kit';
import {
  LOFIBadge,
  LOFIButton,
  LOFICheckbox,
  LOFIEmptyState,
  LOFIField,
  LOFIFieldset,
  LOFIInlineAlert,
  LOFIInput,
  LOFILoader,
  LOFIMainWorkspace,
  LOFIModal,
  LOFINavTree,
  LOFISelect,
  LOFIStatefulButton,
  LOFITable,
  LOFITabs,
  LOFIText,
  LOFIToast,
  LOFIToolbar,
} from 'lofi-kit';
// ---------------------------------------------------------------------------
// P1: Workspace
// ---------------------------------------------------------------------------

function LogoPlaceholder() {
  return (
    <div
      aria-label="Company logo"
      style={{
        width: 32,
        height: 24,
        border: '1px solid #bbb',
        flexShrink: 0,
        display: 'inline-block',
      }}
    />
  );
}

function UPLShellDemo() {
  const [activeModule, setActiveModule] = useState('tournaments');
  return (
    <div style={{ border: '1px solid #ddd' }}>
      <LOFIToolbar
        left={
          <>
            <LogoPlaceholder />
            <LOFIText as="span" variant="body">
              Production Landscape
            </LOFIText>
            <LOFIText as="span" variant="muted">
              {' '}
              | Sport Admin
            </LOFIText>
          </>
        }
        right={
          <>
            <LOFIButton variant="dismiss">Applications ▾</LOFIButton>
            <LOFIButton variant="dismiss">Configuration</LOFIButton>
            <LOFIText as="span" variant="muted">
              j.smith
            </LOFIText>
          </>
        }
      />
      <LOFITabs
        value={activeModule}
        onChange={setActiveModule}
        tabs={[
          { value: 'tournaments', label: 'Tournaments' },
          { value: 'competitors', label: 'Competitors' },
          { value: 'venues', label: 'Venues' },
        ]}
      />
    </div>
  );
}

const SIDEBAR_ITEMS = [
  {
    id: 'soccer',
    label: 'Soccer',
    children: [
      {
        id: 'intl-clubs',
        label: 'International Clubs',
        children: [
          {
            id: 'ucl',
            label: 'Champions League',
            children: [
              { id: 'ucl-ko', label: 'Knockout Bracket — CL 24/25 (ID 1801)' },
              { id: 'ucl-gs', label: 'Group Stage — CL 24/25 (ID 1802)' },
            ],
          },
          {
            id: 'uel',
            label: 'Europa League',
            children: [{ id: 'uel-ko', label: 'Knockout Bracket — UEL 24/25 (ID 1851)' }],
          },
        ],
      },
      {
        id: 'intl-nt',
        label: 'International (NT)',
        children: [{ id: 'wc-q', label: 'World Cup Qualifiers 2026 (ID 5501)' }],
      },
    ],
  },
  {
    id: 'basketball',
    label: 'Basketball',
    children: [{ id: 'nba', label: 'NBA Playoffs 2025 (ID 2201)' }],
  },
];

function SidebarDemo() {
  const [selectedId, setSelectedId] = useState<string | undefined>('ucl-ko');
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div
      style={{
        display: 'flex',
        gap: 0,
        border: '1px solid #ddd',
        height: 320,
        fontFamily: 'monospace',
      }}
    >
      {!collapsed && (
        <div style={{ width: 240, borderRight: '1px solid #ddd', overflow: 'auto', flexShrink: 0 }}>
          <div
            style={{
              padding: '6px 8px',
              borderBottom: '1px solid #eee',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <LOFIText variant="muted" as="span">
              Sidebar
            </LOFIText>
            <LOFIButton
              size="compact"
              variant="dismiss"
              onClick={() => setCollapsed(true)}
              aria-label="Collapse sidebar"
            >
              ◀
            </LOFIButton>
          </div>
          <LOFINavTree items={SIDEBAR_ITEMS} selectedId={selectedId} onSelect={setSelectedId} />
        </div>
      )}
      <div style={{ flex: 1, padding: 16, display: 'flex', alignItems: 'flex-start', gap: 8 }}>
        {collapsed && (
          <LOFIButton
            size="compact"
            variant="dismiss"
            onClick={() => setCollapsed(false)}
            aria-label="Expand sidebar"
          >
            ▶
          </LOFIButton>
        )}
        <LOFIText variant="muted" as="span">
          {selectedId
            ? `Selected: ${selectedId}`
            : 'No item selected — select a leaf to load the main interface.'}
        </LOFIText>
      </div>
    </div>
  );
}

const FILTER_SPORTS = [
  { value: 'soccer', label: 'Soccer' },
  { value: 'basketball', label: 'Basketball' },
  { value: 'tennis', label: 'Tennis' },
];

const FILTER_CATS = [
  { value: 'clubs', label: 'International Clubs' },
  { value: 'nt', label: 'National Teams' },
];

function FilterRowDemo() {
  const [sport, setSport] = useState('');
  const [cat, setCat] = useState('');
  const [search, setSearch] = useState('');
  const anyActive = sport || cat || search;
  return (
    <div
      style={{
        border: '1px solid #ddd',
        padding: '10px 12px',
        display: 'flex',
        gap: 8,
        alignItems: 'flex-end',
        flexWrap: 'wrap',
        fontFamily: 'monospace',
      }}
    >
      <LOFIField label="Sport">
        <LOFISelect value={sport} onChange={setSport} placeholder="Sport" options={FILTER_SPORTS} />
      </LOFIField>
      <LOFIField label="Category">
        <LOFISelect value={cat} onChange={setCat} placeholder="Category" options={FILTER_CATS} />
      </LOFIField>
      <LOFIField label="ID / Name">
        <LOFIInput value={search} onChange={setSearch} placeholder="Search…" />
      </LOFIField>
      <LOFIButton variant="primary">Search</LOFIButton>
      <LOFIButton
        variant="dismiss"
        disabled={!anyActive}
        onClick={() => {
          setSport('');
          setCat('');
          setSearch('');
        }}
      >
        Clear all
      </LOFIButton>
    </div>
  );
}

const TOURNAMENT_LEAF_MAIN: Record<
  string,
  { breadcrumb: React.ReactNode; title: string; badge?: string; sport: string }
> = {
  'ucl-ko': {
    breadcrumb: <span>International Clubs › Champions League</span>,
    title: 'Knockout Bracket — Champions League 24/25',
    badge: 'SIMPLE TOURNAMENT',
    sport: 'Soccer',
  },
  'ucl-gs': {
    breadcrumb: <span>International Clubs › Champions League</span>,
    title: 'Group Stage — Champions League 24/25',
    badge: 'SIMPLE TOURNAMENT',
    sport: 'Soccer',
  },
  'uel-ko': {
    breadcrumb: <span>International Clubs › Europa League</span>,
    title: 'Knockout Bracket — Europa League 24/25',
    badge: 'SIMPLE TOURNAMENT',
    sport: 'Soccer',
  },
  'wc-q': {
    breadcrumb: <span>International (NT)</span>,
    title: 'World Cup Qualifiers 2026',
    sport: 'Soccer',
  },
  nba: {
    breadcrumb: <span>Basketball › NBA</span>,
    title: 'NBA Playoffs 2025',
    sport: 'Basketball',
  },
};

const TEAM_WORKSPACE_NAV: Array<{ id: string; label: string }> = [
  { id: 'teams', label: 'Teams' },
  { id: 'changelog', label: 'Changelog' },
];

function TournamentSidebarWithMirroredMain() {
  const [selectedId, setSelectedId] = useState<string | undefined>('ucl-ko');
  const [collapsed, setCollapsed] = useState(false);
  const [tab, setTab] = useState('admin');
  const [dirty, setDirty] = useState(false);
  const [name, setName] = useState(
    () => TOURNAMENT_LEAF_MAIN['ucl-ko']?.title ?? 'Knockout Bracket — Champions League 24/25',
  );

  const mainCfg = selectedId ? TOURNAMENT_LEAF_MAIN[selectedId] : undefined;

  function handleSelectLeaf(id: string) {
    setSelectedId(id);
    const cfg = TOURNAMENT_LEAF_MAIN[id];
    if (cfg) {
      setName(cfg.title);
      setDirty(false);
      setTab('admin');
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        gap: 0,
        border: '1px solid #ddd',
        minHeight: 380,
        fontFamily: 'monospace',
      }}
    >
      {!collapsed && (
        <div style={{ width: 240, borderRight: '1px solid #ddd', overflow: 'auto', flexShrink: 0 }}>
          <div
            style={{
              padding: '6px 8px',
              borderBottom: '1px solid #eee',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <LOFIText variant="muted" as="span">
              Sidebar (P1.2.2)
            </LOFIText>
            <LOFIButton
              size="compact"
              variant="dismiss"
              onClick={() => setCollapsed(true)}
              aria-label="Collapse sidebar"
            >
              ◀
            </LOFIButton>
          </div>
          <LOFINavTree items={SIDEBAR_ITEMS} selectedId={selectedId} onSelect={handleSelectLeaf} />
        </div>
      )}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        {collapsed && (
          <div style={{ padding: 8, borderBottom: '1px solid #eee' }}>
            <LOFIButton
              size="compact"
              variant="dismiss"
              onClick={() => setCollapsed(false)}
              aria-label="Expand sidebar"
            >
              ▶
            </LOFIButton>
          </div>
        )}
        {mainCfg ? (
          <LOFIMainWorkspace
            breadcrumb={mainCfg.breadcrumb}
            title={name}
            titleBadges={
              mainCfg.badge ? <LOFIBadge variant="tag" label={mainCfg.badge} /> : undefined
            }
            tabs={
              <LOFITabs
                value={tab}
                onChange={setTab}
                tabs={[
                  { value: 'admin', label: 'Admin' },
                  { value: 'competitors', label: 'Competitors' },
                  { value: 'matches', label: 'Matches' },
                  { value: 'changelog', label: 'Change log' },
                ]}
              />
            }
            footer={
              <>
                <LOFIButton variant="dismiss" disabled={!dirty} onClick={() => setDirty(false)}>
                  Reset changes
                </LOFIButton>
                <LOFIButton variant="primary" disabled={!dirty}>
                  Save changes
                </LOFIButton>
              </>
            }
          >
            {tab === 'admin' && (
              <LOFIFieldset legend="General">
                <LOFIField label="Display name">
                  <LOFIInput
                    value={name}
                    onChange={(v) => {
                      setName(v);
                      setDirty(true);
                    }}
                  />
                </LOFIField>
                <LOFIField label="Sport">
                  <LOFIInput value={mainCfg.sport} disabled onChange={() => {}} />
                </LOFIField>
              </LOFIFieldset>
            )}
            {tab !== 'admin' && (
              <LOFIText variant="muted">
                {tab === 'changelog'
                  ? 'Changelog — append-only, newest first.'
                  : `${tab.charAt(0).toUpperCase()}${tab.slice(1)} content goes here.`}
              </LOFIText>
            )}
          </LOFIMainWorkspace>
        ) : (
          <div style={{ padding: 24, flex: 1 }}>
            <LOFIText variant="muted">
              No tournament leaf selected — pick a leaf in the sidebar to load the main interface
              view (P1.2.3).
            </LOFIText>
          </div>
        )}
      </div>
    </div>
  );
}

function MainInterfaceDemo() {
  const [tab, setTab] = useState('admin');
  const [dirty, setDirty] = useState(false);
  const [name, setName] = useState('Knockout Bracket — Champions League 24/25');
  return (
    <LOFIMainWorkspace
      breadcrumb={<span>International Clubs › Champions League</span>}
      title={name}
      titleBadges={<LOFIBadge variant="tag" label="SIMPLE TOURNAMENT" />}
      tabs={
        <LOFITabs
          value={tab}
          onChange={setTab}
          tabs={[
            { value: 'admin', label: 'Admin' },
            { value: 'competitors', label: 'Competitors' },
            { value: 'matches', label: 'Matches' },
            { value: 'changelog', label: 'Change log' },
          ]}
        />
      }
      footer={
        <>
          <LOFIButton variant="dismiss" disabled={!dirty} onClick={() => setDirty(false)}>
            Reset changes
          </LOFIButton>
          <LOFIButton variant="primary" disabled={!dirty}>
            Save changes
          </LOFIButton>
        </>
      }
    >
      {tab === 'admin' && (
        <LOFIFieldset legend="General">
          <LOFIField label="Display name">
            <LOFIInput
              value={name}
              onChange={(v) => {
                setName(v);
                setDirty(true);
              }}
            />
          </LOFIField>
          <LOFIField label="Sport">
            <LOFIInput value="Soccer" disabled onChange={() => {}} />
          </LOFIField>
        </LOFIFieldset>
      )}
      {tab !== 'admin' && (
        <LOFIText variant="muted">
          {tab === 'changelog'
            ? 'Changelog — append-only, newest first.'
            : `${tab.charAt(0).toUpperCase()}${tab.slice(1)} content goes here.`}
        </LOFIText>
      )}
    </LOFIMainWorkspace>
  );
}

// ---------------------------------------------------------------------------
// P2: Data Table  (was P1 before reorder)
// ---------------------------------------------------------------------------

type Team = {
  id: string;
  name: string;
  sport: string;
  status: 'Active' | 'Redundant' | 'Pending';
  players: number;
};

const ALL_TEAMS: Team[] = [
  { id: 'T-001', name: 'FC Barcelona', sport: 'Soccer', status: 'Active', players: 25 },
  { id: 'T-002', name: 'Real Madrid CF', sport: 'Soccer', status: 'Active', players: 26 },
  { id: 'T-003', name: 'Atletico Madrid', sport: 'Soccer', status: 'Active', players: 24 },
  { id: 'T-004', name: 'Sevilla FC', sport: 'Soccer', status: 'Redundant', players: 0 },
  { id: 'T-005', name: 'Valencia CF', sport: 'Soccer', status: 'Pending', players: 18 },
  { id: 'T-006', name: 'Villarreal CF', sport: 'Soccer', status: 'Active', players: 22 },
];

const STATUS_VARIANT: Record<Team['status'], 'status' | 'tag'> = {
  Active: 'status',
  Redundant: 'status',
  Pending: 'tag',
};

const TEAM_STATUS_TO_SLUG: Record<Team['status'], string> = {
  Active: 'active',
  Redundant: 'redundant',
  Pending: 'pending',
};

const SLUG_TO_TEAM_STATUS: Record<string, Team['status']> = {
  active: 'Active',
  redundant: 'Redundant',
  pending: 'Pending',
};

const TEAM_SPORT_TO_SLUG: Record<string, string> = {
  Soccer: 'soccer',
  Basketball: 'basketball',
  Tennis: 'tennis',
};

function teamSportToSlug(sport: string): string {
  return TEAM_SPORT_TO_SLUG[sport] ?? 'soccer';
}

function slugToTeamSport(slug: string): string {
  const back: Record<string, string> = {
    soccer: 'Soccer',
    basketball: 'Basketball',
    tennis: 'Tennis',
  };
  return back[slug] ?? 'Soccer';
}

function makeTeamColumns(rowActionsDisabled: boolean): ColumnDef<Team>[] {
  return [
    { accessorKey: 'id', header: 'ID', size: 80 },
    { accessorKey: 'name', header: 'Team name' },
    { accessorKey: 'sport', header: 'Sport', size: 100 },
    {
      accessorKey: 'status',
      header: 'Status',
      meta: { shrink: true } satisfies TableColumnMeta,
      cell: ({ row }) => (
        <LOFIBadge
          variant={STATUS_VARIANT[row.original.status]}
          label={row.original.status}
          active={row.original.status === 'Active'}
        />
      ),
    },
    { accessorKey: 'players', header: 'Players', size: 80 },
    {
      id: 'actions',
      header: 'Actions',
      meta: { shrink: true } satisfies TableColumnMeta,
      cell: () => (
        <span style={{ display: 'flex', gap: 4 }}>
          <LOFIButton size="compact" variant="default" disabled={rowActionsDisabled}>
            Edit
          </LOFIButton>
          <LOFIButton size="compact" variant="dismiss" disabled={rowActionsDisabled}>
            − Remove
          </LOFIButton>
        </span>
      ),
    },
  ];
}

function DisabledTeamAddTrigger({
  showAddButton,
  addDisabled,
}: {
  showAddButton: boolean;
  addDisabled: boolean;
}) {
  return (
    <>
      {showAddButton && (
        <LOFIButton variant="primary" disabled={addDisabled}>
          + Add team
        </LOFIButton>
      )}
    </>
  );
}

function TeamToolbar({
  search,
  onSearchChange,
  onSearch,
  searchDisabled = false,
  addDisabled = false,
  showAddButton = true,
  showSearchButton = true,
  searchFieldLabel,
  searchPlaceholder,
  searchInputId = 'team-toolbar-search',
}: {
  search: string;
  onSearchChange: (v: string) => void;
  onSearch: () => void;
  searchDisabled?: boolean;
  showAddButton?: boolean;
  addDisabled?: boolean;
  /** When false, omits the Search button (e.g. debounced-only filter). */
  showSearchButton?: boolean;
  /** When set, wraps the search input in LOFIField (label above the field). */
  searchFieldLabel?: string;
  searchPlaceholder?: string;
  searchInputId?: string;
}) {
  function handleSearchKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key !== 'Enter' || searchDisabled || e.nativeEvent.isComposing) return;
    e.preventDefault();
    onSearch();
  }

  const searchInput = (
    <LOFIInput
      id={searchFieldLabel ? searchInputId : undefined}
      value={search}
      onChange={onSearchChange}
      onKeyDown={handleSearchKeyDown}
      placeholder={searchPlaceholder ?? 'Search by ID or name…'}
      allowClear
      disabled={searchDisabled}
    />
  );

  return (
    <LOFIToolbar
      left={
        <span
          style={{ display: 'flex', alignItems: searchFieldLabel ? 'flex-end' : 'center', gap: 8 }}
        >
          <span style={{ maxWidth: 200, minWidth: 0, flex: '0 0 auto' }}>
            {searchFieldLabel ? (
              <LOFIField label={searchFieldLabel} htmlFor={searchInputId}>
                {searchInput}
              </LOFIField>
            ) : (
              searchInput
            )}
          </span>
          {showSearchButton ? (
            <LOFIButton variant="default" onClick={onSearch} disabled={searchDisabled}>
              Search
            </LOFIButton>
          ) : null}
        </span>
      }
      right={
        addDisabled ? (
          <DisabledTeamAddTrigger showAddButton={showAddButton} addDisabled={addDisabled} />
        ) : (
          NewTeamTrigger()
        )
      }
    />
  );
}

function TeamTable({
  rowActionsDisabled = false,
  addDisabled = false,
}: {
  rowActionsDisabled?: boolean;
  addDisabled?: boolean;
} = {}) {
  const columns = makeTeamColumns(rowActionsDisabled);
  const [input, setInput] = useState('');
  const [search, setSearch] = useState('');

  const filtered = ALL_TEAMS.filter(
    (t) => t.name.toLowerCase().includes(search.toLowerCase()) || t.id.includes(search),
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%' }}>
      <TeamToolbar
        search={input}
        onSearchChange={setInput}
        onSearch={() => setSearch(input)}
        addDisabled={addDisabled}
      />
      {filtered.length === 0 ? (
        <LOFIEmptyState
          variant="no-results"
          title={`No results for "${search}"`}
          description="Try clearing your search."
          action={
            <LOFIButton
              variant="dismiss"
              onClick={() => {
                setInput('');
                setSearch('');
              }}
            >
              Clear search
            </LOFIButton>
          }
        />
      ) : (
        <LOFITable columns={columns} rows={filtered} keyField="id" sortable />
      )}
    </div>
  );
}

/** P1.2 — Edit row in a modal; parent applies updates to table state. */
function TeamRowEditModal({
  team,
  onClose,
  onSave,
}: {
  team: Team;
  onClose: () => void;
  onSave: (updated: Team) => void;
}) {
  const [name, setName] = useState(() => team.name);
  const [sportSlug, setSportSlug] = useState(() => teamSportToSlug(team.sport));
  const [statusSlug, setStatusSlug] = useState(() => TEAM_STATUS_TO_SLUG[team.status]);

  const dirty =
    name.trim() !== team.name ||
    sportSlug !== teamSportToSlug(team.sport) ||
    statusSlug !== TEAM_STATUS_TO_SLUG[team.status];

  function handleSave() {
    const nextStatus = (SLUG_TO_TEAM_STATUS[statusSlug] ?? team.status) as Team['status'];
    const trimmed = name.trim() || team.name;
    onSave({
      id: team.id,
      name: trimmed,
      sport: slugToTeamSport(sportSlug),
      status: nextStatus,
      players: team.players,
    });
    onClose();
  }

  return (
    <LOFIModal
      open
      onClose={onClose}
      title={team.name}
      description="Edit team details."
      footer={
        <>
          <LOFIButton variant="dismiss" onClick={onClose}>
            Cancel
          </LOFIButton>
          <LOFIButton variant="primary" onClick={handleSave} disabled={!dirty}>
            Save changes
          </LOFIButton>
        </>
      }
    >
      <LOFIFieldset legend="Team details">
        <LOFIField label="Team name" htmlFor="p12-team-name" required>
          <LOFIInput id="p12-team-name" value={name} onChange={setName} />
        </LOFIField>
        <LOFIField label="Sport" htmlFor="p12-team-sport">
          <LOFISelect
            id="p12-team-sport"
            value={sportSlug}
            onChange={setSportSlug}
            options={SPORT_OPTIONS}
          />
        </LOFIField>
        <LOFIField label="Status" htmlFor="p12-team-status">
          <LOFISelect
            id="p12-team-status"
            value={statusSlug}
            onChange={setStatusSlug}
            options={STATUS_OPTIONS}
          />
        </LOFIField>
      </LOFIFieldset>
    </LOFIModal>
  );
}

function makeInteractiveTeamColumns(handlers: {
  onEdit: (team: Team) => void;
  onRemove: (team: Team) => void;
}): ColumnDef<Team>[] {
  return [
    { accessorKey: 'id', header: 'ID', size: 80 },
    { accessorKey: 'name', header: 'Team name' },
    { accessorKey: 'sport', header: 'Sport', size: 100 },
    {
      accessorKey: 'status',
      header: 'Status',
      meta: { shrink: true } satisfies TableColumnMeta,
      cell: ({ row }) => (
        <LOFIBadge
          variant={STATUS_VARIANT[row.original.status]}
          label={row.original.status}
          active={row.original.status === 'Active'}
        />
      ),
    },
    { accessorKey: 'players', header: 'Players', size: 80 },
    {
      id: 'actions',
      header: 'Actions',
      meta: { shrink: true } satisfies TableColumnMeta,
      cell: ({ row }) => (
        <span style={{ display: 'flex', gap: 4 }}>
          <LOFIButton
            size="compact"
            variant="default"
            onClick={() => handlers.onEdit(row.original)}
          >
            Edit
          </LOFIButton>
          <LOFIButton
            size="compact"
            variant="dismiss"
            onClick={() => handlers.onRemove(row.original)}
          >
            − Remove
          </LOFIButton>
        </span>
      ),
    },
  ];
}

/** P1.2 — Searchable table with working Edit (modal) and Remove (confirm → row deleted until empty). */
function TeamTableWithRowActions() {
  const [teams, setTeams] = useState<Team[]>(() => [...ALL_TEAMS]);
  const [input, setInput] = useState('');
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<Team | null>(null);
  const [removing, setRemoving] = useState<Team | null>(null);

  const columns = makeInteractiveTeamColumns({
    onEdit: (team) => setEditing(team),
    onRemove: (team) => setRemoving(team),
  });

  const filtered = teams.filter(
    (t) => t.name.toLowerCase().includes(search.toLowerCase()) || t.id.includes(search),
  );

  function confirmRemove() {
    if (!removing) return;
    const id = removing.id;
    setTeams((prev) => prev.filter((t) => t.id !== id));
    setRemoving(null);
  }

  return (
    <>
      <LOFIModal
        open={removing !== null}
        onClose={() => setRemoving(null)}
        title={removing ? `Remove ${removing.name}?` : ''}
        description={
          removing
            ? 'This will permanently remove the team from the list. This action cannot be undone.'
            : ''
        }
        footer={
          <>
            <LOFIButton variant="dismiss" onClick={() => setRemoving(null)}>
              Cancel
            </LOFIButton>
            <LOFIButton variant="primary" onClick={confirmRemove}>
              Remove
            </LOFIButton>
          </>
        }
        children={undefined}
      />

      {editing && (
        <TeamRowEditModal
          key={editing.id}
          team={editing}
          onClose={() => setEditing(null)}
          onSave={(updated) => {
            setTeams((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
          }}
        />
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%' }}>
        <TeamToolbar search={input} onSearchChange={setInput} onSearch={() => setSearch(input)} />
        {teams.length === 0 ? (
          <LOFITable
            columns={columns}
            rows={[]}
            keyField="id"
            sortable
            emptySlot={
              <LOFIEmptyState
                variant="first-use"
                title="No teams yet"
                description="Add your first team to get started."
              />
            }
          />
        ) : filtered.length === 0 ? (
          <LOFIEmptyState
            variant="no-results"
            title={`No results for "${search}"`}
            description="Try clearing your search."
            action={
              <LOFIButton
                variant="dismiss"
                onClick={() => {
                  setInput('');
                  setSearch('');
                }}
              >
                Clear search
              </LOFIButton>
            }
          />
        ) : (
          <LOFITable columns={columns} rows={filtered} keyField="id" sortable />
        )}
      </div>
    </>
  );
}

function EmptyTeamTable() {
  const columns = makeTeamColumns(true);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%' }}>
      <TeamToolbar
        search=""
        onSearchChange={() => {}}
        onSearch={() => {}}
        searchDisabled
        showAddButton={false}
        addDisabled={true}
      />
      <LOFIInlineAlert
        severity="warning"
        title="No teams yet"
        message="No Teams found in the system."
      />
      <LOFITable
        columns={columns}
        rows={[]}
        keyField="id"
        sortable
        emptySlot={
          <LOFIEmptyState
            variant="first-use"
            title="No teams yet"
            description="Add your first team to get started."
          />
        }
      />
    </div>
  );
}

/** Deterministic failed removes for R4 demo (Sevilla FC, Villarreal CF). */
const R4_REMOVE_FAIL_IDS = new Set<string>(['T-004', 'T-006']);

const R4_FILTER_DELAY_MS = 1500;
const R4_REMOVE_DELAY_MS = 1300;
const R4_SEARCH_DEBOUNCE_MS = 1000;

function makeR4TeamColumns(opts: {
  loadingRemoveId: string | null;
  onRemoveRequest: (team: Team) => void;
}): ColumnDef<Team>[] {
  const { loadingRemoveId, onRemoveRequest } = opts;
  return [
    { accessorKey: 'id', header: 'ID', size: 80 },
    { accessorKey: 'name', header: 'Team name' },
    { accessorKey: 'sport', header: 'Sport', size: 100 },
    {
      accessorKey: 'status',
      header: 'Status',
      meta: { shrink: true } satisfies TableColumnMeta,
      cell: ({ row }) => (
        <LOFIBadge
          variant={STATUS_VARIANT[row.original.status]}
          label={row.original.status}
          active={row.original.status === 'Active'}
        />
      ),
    },
    { accessorKey: 'players', header: 'Players', size: 80 },
    {
      id: 'actions',
      header: 'Actions',
      meta: { shrink: true } satisfies TableColumnMeta,
      cell: ({ row }) => {
        const id = row.original.id;
        const busyElsewhere = loadingRemoveId !== null && loadingRemoveId !== id;
        return (
          <span style={{ display: 'flex', gap: 4 }}>
            <LOFIButton size="compact" variant="default" disabled>
              Edit
            </LOFIButton>
            {busyElsewhere ? (
              <LOFIButton size="compact" variant="dismiss" disabled>
                − Remove
              </LOFIButton>
            ) : (
              <LOFIStatefulButton
                state={loadingRemoveId === id ? 'loading' : 'idle'}
                idleLabel="− Remove"
                successLabel="Removed"
                size="compact"
                variant="dismiss"
                onClick={() => onRemoveRequest(row.original)}
              />
            )}
          </span>
        );
      },
    },
  ];
}

type R4SearchMode = 'explicit' | 'debounced';

/**
 * One R4 table instance: team name filter (async skeleton), remove flow, optional debounce.
 */
function R4SearchExampleBlock({
  mode,
  searchInputId,
}: {
  mode: R4SearchMode;
  searchInputId: string;
}) {
  const inputRef = useRef('');
  const filterBusyRef = useRef(false);
  const debounceMountSkipRef = useRef(true);
  /** When true, the next input-driven debounce effect is skipped (e.g. programmatic clear). */
  const skipDebounceRef = useRef(false);

  const [teams, setTeams] = useState<Team[]>(() => [...ALL_TEAMS]);
  const [input, setInput] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');
  const [filterLoading, setFilterLoading] = useState(false);
  const [removing, setRemoving] = useState<Team | null>(null);
  const [loadingRemoveId, setLoadingRemoveId] = useState<string | null>(null);
  const [removeToast, setRemoveToast] = useState<string | null>(null);

  const columns = makeR4TeamColumns({
    loadingRemoveId,
    onRemoveRequest: (team) => setRemoving(team),
  });

  const filtered = teams.filter(
    (t) =>
      appliedSearch.trim() === '' ||
      t.name.toLowerCase().includes(appliedSearch.trim().toLowerCase()),
  );

  function handleInputChange(v: string) {
    inputRef.current = v;
    setInput(v);
  }

  function startAsyncApply(query: string) {
    if (filterBusyRef.current) return;
    filterBusyRef.current = true;
    setFilterLoading(true);
    window.setTimeout(() => {
      setAppliedSearch(query);
      setFilterLoading(false);
      filterBusyRef.current = false;
    }, R4_FILTER_DELAY_MS);
  }

  function runExplicitSearch() {
    startAsyncApply(inputRef.current);
  }

  useEffect(() => {
    if (mode !== 'debounced') return;
    if (debounceMountSkipRef.current) {
      debounceMountSkipRef.current = false;
      return;
    }
    if (skipDebounceRef.current) {
      skipDebounceRef.current = false;
      return;
    }
    const t = window.setTimeout(() => {
      startAsyncApply(inputRef.current);
    }, R4_SEARCH_DEBOUNCE_MS);
    return () => window.clearTimeout(t);
  }, [input, mode]);

  function confirmRemoveFromModal() {
    if (!removing) return;
    const team = removing;
    setRemoving(null);
    setLoadingRemoveId(team.id);
    window.setTimeout(() => {
      if (R4_REMOVE_FAIL_IDS.has(team.id)) {
        setLoadingRemoveId(null);
        setRemoveToast('The team could not be removed. Try again.');
      } else {
        setTeams((prev) => prev.filter((t) => t.id !== team.id));
        setLoadingRemoveId(null);
      }
    }, R4_REMOVE_DELAY_MS);
  }

  const tableShell = (
    <div style={{ position: 'relative', minHeight: 280 }}>
      {removeToast ? (
        <LOFIToast
          severity="error"
          message={removeToast}
          onDismiss={() => setRemoveToast(null)}
          autoDismiss={5000}
          style={{
            position: 'absolute',
            left: '50%',
            bottom: 12,
            transform: 'translateX(-50%)',
            right: 'auto',
            zIndex: 2,
            maxWidth: 'min(360px, 92%)',
          }}
        />
      ) : null}
      {filterLoading ? (
        <LOFITable
          columns={columns}
          rows={[]}
          keyField="id"
          sortable
          emptySlot={
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                minHeight: 240,
                padding: 24,
              }}
            >
              <LOFILoader label="Filtering teams" />
              <LOFIText variant="muted">Matching by team name…</LOFIText>
            </div>
          }
        />
      ) : teams.length === 0 ? (
        <LOFITable
          columns={columns}
          rows={[]}
          keyField="id"
          sortable
          emptySlot={
            <LOFIEmptyState
              variant="first-use"
              title="No teams yet"
              description="All teams were removed in this session."
            />
          }
        />
      ) : filtered.length === 0 ? (
        <div style={{ minHeight: 200 }}>
          <LOFIEmptyState
            variant="no-results"
            title={`No results for "${appliedSearch.trim()}"`}
            description="Try a different team name or clear the search."
            action={
              <LOFIButton
                variant="dismiss"
                onClick={() => {
                  if (mode === 'debounced') {
                    skipDebounceRef.current = true;
                  }
                  handleInputChange('');
                  setAppliedSearch('');
                }}
              >
                Clear search
              </LOFIButton>
            }
          />
        </div>
      ) : (
        <LOFITable columns={columns} rows={filtered} keyField="id" sortable />
      )}
    </div>
  );

  return (
    <>
      <LOFIModal
        open={removing !== null}
        onClose={() => setRemoving(null)}
        title={removing ? `Remove ${removing.name}?` : ''}
        description={
          removing
            ? 'This will permanently remove the team from the list. This action cannot be undone.'
            : ''
        }
        footer={
          <>
            <LOFIButton variant="dismiss" onClick={() => setRemoving(null)}>
              Cancel
            </LOFIButton>
            <LOFIButton variant="primary" onClick={confirmRemoveFromModal}>
              Remove
            </LOFIButton>
          </>
        }
        children={undefined}
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%' }}>
        <TeamToolbar
          search={input}
          onSearchChange={handleInputChange}
          onSearch={runExplicitSearch}
          searchDisabled={filterLoading}
          addDisabled
          showSearchButton={mode === 'explicit'}
          searchFieldLabel="Team name"
          searchPlaceholder="Type team name…"
          searchInputId={searchInputId}
        />
        {tableShell}
      </div>
    </>
  );
}

/**
 * P2.1 / R4 — Async filter skeleton (team name), disabled Add/Edit, P7 remove → row StatefulButton
 * loading → row removed or error toast. Two sub-patterns: explicit (button + Enter) vs debounced (no button).
 */
function TeamTableR4LoadingFeedbackDemo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: '100%' }}>
      <div>
        <LOFIText variant="strong" as="div" style={{ marginBottom: 8 }}>
          Explicit search (button or Enter)
        </LOFIText>
        <R4SearchExampleBlock mode="explicit" searchInputId="r4-explicit-team-name" />
      </div>
      <div>
        <LOFIText variant="strong" as="div" style={{ marginBottom: 8 }}>
          Debounced search (no button)
        </LOFIText>
        <R4SearchExampleBlock mode="debounced" searchInputId="r4-debounce-team-name" />
      </div>
      <LOFIText variant="muted">
        Both examples use the same 1.5s in-table loading row after the trigger. The first submits on
        Search or Enter; the second waits ~1s after you stop typing, then runs the same filter.
        Remove opens P7, then the row button loads (~1.3s). Sevilla FC and Villarreal CF fail with a
        dismissible toast; other rows are removed. Edit and Add team are disabled.
      </LOFIText>
    </div>
  );
}

const INDICATOR_STATES = [
  { label: 'Column', indicator: '↑↓', note: 'Sortable — click to sort', active: false },
  { label: 'Column', indicator: '↑', note: 'Sorted ascending', active: true },
  { label: 'Column', indicator: '↓', note: 'Sorted descending', active: true },
  { label: 'Column', indicator: '', note: 'Not sortable — no indicator', active: false },
] as const;

function SortAffordanceDemo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: '100%' }}>
      <div>
        <LOFIText
          variant="ghost"
          as="div"
          style={{ letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 16 }}
        >
          Indicator states
        </LOFIText>
        <div style={{ display: 'flex', gap: 40, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          {INDICATOR_STATES.map(({ label, indicator, note, active }) => (
            <div key={note} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div
                style={{
                  fontFamily: 'monospace',
                  fontWeight: 600,
                  fontSize: 36,
                  lineHeight: 1,
                  color: '#111',
                  whiteSpace: 'nowrap',
                }}
              >
                {label}
                <span
                  style={{
                    fontSize: 26,
                    marginLeft: 5,
                    letterSpacing: '-0.05em',
                    color: active ? '#111' : '#aaa',
                  }}
                >
                  {indicator}
                </span>
              </div>
              <LOFIText variant="muted">{note}</LOFIText>
            </div>
          ))}
        </div>
      </div>
      <div>
        <LOFIText
          variant="ghost"
          as="div"
          style={{ letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}
        >
          Live example
        </LOFIText>
        <TeamTable />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// P5: Detail Modal
// ---------------------------------------------------------------------------

type Player = { id: string; name: string; position: string; nationality: string };

const SPORT_OPTIONS = [
  { value: 'soccer', label: 'Soccer' },
  { value: 'basketball', label: 'Basketball' },
  { value: 'tennis', label: 'Tennis' },
];

const STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'pending', label: 'Pending' },
  { value: 'redundant', label: 'Redundant' },
];

function NewTeamModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [name, setName] = useState('');
  const [sport, setSport] = useState('');
  const [status, setStatus] = useState('');
  const metaValid = name.trim().length > 0 && sport.length > 0;

  return (
    <LOFIModal
      open={open}
      onClose={onClose}
      title="New team"
      description="Fill in the required details to create a new team."
      size="wide"
      footer={
        <>
          <LOFIButton variant="dismiss" onClick={onClose}>
            Cancel
          </LOFIButton>
          <LOFIButton variant="primary" disabled={!metaValid}>
            Add team
          </LOFIButton>
        </>
      }
    >
      <LOFIFieldset legend="Team details">
        <LOFIField label="Team name" htmlFor="new-team-name" required>
          <LOFIInput
            id="new-team-name"
            value={name}
            onChange={setName}
            placeholder="e.g. FC Barcelona"
          />
        </LOFIField>
        <LOFIField label="Sport" htmlFor="new-team-sport" required>
          <LOFISelect
            id="new-team-sport"
            value={sport}
            onChange={setSport}
            options={SPORT_OPTIONS}
            placeholder="Select sport…"
          />
        </LOFIField>
        <LOFIField label="Status" htmlFor="new-team-status">
          <LOFISelect
            id="new-team-status"
            value={status}
            onChange={setStatus}
            options={STATUS_OPTIONS}
            placeholder="Active (default)"
          />
        </LOFIField>
      </LOFIFieldset>

      {!metaValid && (
        <LOFIText variant="muted">Complete the required fields above to enable Add team.</LOFIText>
      )}
    </LOFIModal>
  );
}

function NewTeamTrigger() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <LOFIButton variant="primary" onClick={() => setOpen(true)}>
        + Add team
      </LOFIButton>
      <NewTeamModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}

// ---------------------------------------------------------------------------
// P5 — Modal stacking edge case (soccer team roster)
// ---------------------------------------------------------------------------

const TEAM1_PLAYERS: Player[] = [
  { id: 'P-101', name: 'Antoine Griezmann', position: 'Forward', nationality: 'France' },
  { id: 'P-102', name: 'Marcos Llorente', position: 'Midfielder', nationality: 'Spain' },
  { id: 'P-103', name: 'Jan Oblak', position: 'Goalkeeper', nationality: 'Slovenia' },
  { id: 'P-104', name: 'Nahuel Molina', position: 'Defender', nationality: 'Argentina' },
  { id: 'P-105', name: 'Álvaro Morata', position: 'Forward', nationality: 'Spain' },
];

type RosterSavePhase = 'idle' | 'confirming' | 'saving';

function TeamRosterModal({
  open,
  onClose,
  onSaved,
}: {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [tab, setTab] = useState('players');
  const [players, setPlayers] = useState<Player[]>(TEAM1_PLAYERS);
  const [removeTargetId, setRemoveTargetId] = useState<string | null>(null);
  const [savePhase, setSavePhase] = useState<RosterSavePhase>('idle');

  const isDirty = players.length !== TEAM1_PLAYERS.length;
  const playerToRemove = players.find((p) => p.id === removeTargetId);

  function handleRemoveClick(id: string) {
    setRemoveTargetId(id);
  }

  function handleRemoveConfirm() {
    setPlayers((prev) => prev.filter((p) => p.id !== removeTargetId));
    setRemoveTargetId(null);
  }

  function handleSaveClick() {
    setSavePhase('confirming');
  }

  function handleSaveConfirm() {
    setSavePhase('saving');
    setTimeout(() => {
      setSavePhase('idle');
      onClose();
      onSaved();
    }, 1200);
  }

  const rosterCols: ColumnDef<Player>[] = [
    { accessorKey: 'id', header: 'ID', size: 80 },
    { accessorKey: 'name', header: 'Player name' },
    { accessorKey: 'position', header: 'Position', size: 120 },
    { accessorKey: 'nationality', header: 'Nationality', size: 120 },
    {
      id: 'actions',
      header: 'Actions',
      meta: { shrink: true } satisfies TableColumnMeta,
      cell: ({ row }: { row: { original: Player } }) => (
        <LOFIButton
          size="compact"
          variant="dismiss"
          onClick={() => handleRemoveClick(row.original.id)}
        >
          − Remove
        </LOFIButton>
      ),
    },
  ];

  return (
    <>
      {/* Remove confirmation — stacked above primary modal */}
      <LOFIModal
        open={removeTargetId !== null}
        onClose={() => setRemoveTargetId(null)}
        title={`Remove ${playerToRemove?.name ?? ''}?`}
        description="This player will be removed from Team 1. The change takes effect when you save."
        footer={
          <>
            <LOFIButton variant="dismiss" onClick={() => setRemoveTargetId(null)}>
              Cancel
            </LOFIButton>
            <LOFIButton variant="primary" onClick={handleRemoveConfirm}>
              Remove
            </LOFIButton>
          </>
        }
      >
        <></>
      </LOFIModal>

      {/* Save confirmation — stacked above primary modal */}
      <LOFIModal
        open={savePhase === 'confirming' || savePhase === 'saving'}
        onClose={() => {
          if (savePhase === 'confirming') setSavePhase('idle');
        }}
        title="Save Team 1 changes?"
        description="The updated roster will be applied and a changelog entry will be generated."
        footer={
          <>
            <LOFIButton
              variant="dismiss"
              onClick={() => setSavePhase('idle')}
              disabled={savePhase === 'saving'}
            >
              Go back
            </LOFIButton>
            <LOFIButton
              variant="primary"
              onClick={handleSaveConfirm}
              disabled={savePhase === 'saving'}
            >
              {savePhase === 'saving' ? <LOFILoader label="Saving" /> : 'Save'}
            </LOFIButton>
          </>
        }
      >
        <></>
      </LOFIModal>

      {/* Primary modal */}
      <LOFIModal
        open={open}
        onClose={onClose}
        title="Team 1"
        description="Manage the squad for this soccer team."
        size="wide"
        footer={
          <>
            <LOFIButton variant="dismiss" onClick={onClose}>
              Cancel
            </LOFIButton>
            <LOFIButton variant="primary" disabled={!isDirty} onClick={handleSaveClick}>
              Save changes
            </LOFIButton>
          </>
        }
      >
        <LOFITabs
          value={tab}
          onChange={setTab}
          tabs={[
            { value: 'info', label: 'Team Info' },
            { value: 'players', label: 'Players' },
          ]}
          ariaLabel="Team 1 sections"
        />

        {tab === 'info' && (
          <LOFIFieldset legend="General">
            <LOFIField label="Team name" htmlFor="roster-team-name">
              <LOFIInput id="roster-team-name" value="Team 1" onChange={() => {}} />
            </LOFIField>
            <LOFIField label="Sport" htmlFor="roster-sport">
              <LOFISelect
                id="roster-sport"
                value="soccer"
                onChange={() => {}}
                options={SPORT_OPTIONS}
              />
            </LOFIField>
          </LOFIFieldset>
        )}

        {tab === 'players' && (
          <>
            {players.length === 0 ? (
              <LOFIEmptyState
                variant="no-results"
                title="No players remaining"
                description="All players removed. Save to apply changes."
              />
            ) : (
              <LOFITable columns={rosterCols} rows={players} />
            )}
          </>
        )}
      </LOFIModal>
    </>
  );
}

function TeamRosterTrigger() {
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  function handleSaved() {
    setToast('Team 1 changes have been saved.');
    setTimeout(() => setToast(null), 3500);
  }

  return (
    <div ref={wrapperRef} style={{ position: 'relative', display: 'inline-block' }}>
      <LOFIButton variant="default" onClick={() => setOpen(true)}>
        Edit Team 1
      </LOFIButton>

      <TeamRosterModal open={open} onClose={() => setOpen(false)} onSaved={handleSaved} />

      {toast && (
        <LOFIToast
          severity="success"
          message={toast}
          autoDismiss={3500}
          onDismiss={() => setToast(null)}
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            left: 0,
            right: 'auto',
            bottom: 'auto',
          }}
        />
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// P4: Toast notification messages (inline footer + save/error toasts)
// ---------------------------------------------------------------------------

type P4FlagRow = { id: string; name: string; flag: boolean };

function P4_ToastNotificationMessagesDemo() {
  const initialRows: P4FlagRow[] = [
    { id: '1', name: 'Entry A', flag: false },
    { id: '2', name: 'Entry B', flag: true },
  ];
  const [rows, setRows] = useState<P4FlagRow[]>(() => initialRows.map((r) => ({ ...r })));
  const [saved, setSaved] = useState<P4FlagRow[]>(() => initialRows.map((r) => ({ ...r })));
  const [btn, setBtn] = useState<StatefulButtonState>('idle');
  const [toast, setToast] = useState<{
    severity: 'success' | 'error' | 'info';
    message: string;
  } | null>(null);
  const [resetOpen, setResetOpen] = useState(false);

  const dirty =
    rows.length !== saved.length ||
    rows.some((r, i) => r.flag !== saved[i]?.flag || r.id !== saved[i]?.id);

  function updateRow(id: string, flag: boolean) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, flag } : r)));
    if (btn === 'success') setBtn('idle');
    setToast(null);
  }

  function handleSave() {
    const snapshot = rows.map((r) => ({ ...r }));
    setBtn('loading');
    setToast(null);
    window.setTimeout(() => {
      if (Math.random() > 0.4) {
        setSaved(snapshot);
        setBtn('success');
        setToast({ severity: 'success', message: 'Changes saved.' });
      } else {
        setBtn('idle');
        setToast({ severity: 'error', message: 'Save failed. Your edits are still pending.' });
      }
    }, 900);
  }

  function doReset() {
    setRows(saved.map((r) => ({ ...r })));
    setBtn('idle');
    setResetOpen(false);
    setToast({ severity: 'info', message: 'Changes reverted to last saved state.' });
  }

  return (
    <div style={{ position: 'relative', minHeight: 360 }}>
      {toast && (
        <LOFIToast
          severity={toast.severity}
          message={toast.message}
          autoDismiss={toast.severity === 'error' ? undefined : 4000}
          onDismiss={() => setToast(null)}
          style={{
            position: 'absolute',
            top: 12,
            right: 12,
            zIndex: 2000,
            maxWidth: 360,
            maxHeight: 50,
          }}
        />
      )}

      <LOFIModal
        open={resetOpen}
        onClose={() => setResetOpen(false)}
        title="Discard unsaved changes?"
        description="All edits in this pane will revert to the last saved state."
        footer={
          <>
            <LOFIButton variant="dismiss" onClick={() => setResetOpen(false)}>
              Cancel
            </LOFIButton>
            <LOFIButton variant="primary" onClick={doReset}>
              Discard
            </LOFIButton>
          </>
        }
      >
        {null}
      </LOFIModal>

      <LOFIMainWorkspace
        breadcrumb={<span>Demo › Table flags</span>}
        title="Entries"
        footer={
          dirty ? (
            <>
              <LOFIButton variant="dismiss" onClick={() => setResetOpen(true)}>
                Reset changes
              </LOFIButton>
              <LOFIStatefulButton
                state={btn}
                variant={btn === 'success' ? 'dismiss' : 'primary'}
                idleLabel="Save changes"
                loadingLabel="Save changes"
                successLabel="Saved"
                onClick={() => {
                  if (btn === 'idle') handleSave();
                }}
              />
            </>
          ) : undefined
        }
      >
        <LOFIText variant="muted">
          Toggle a flag to dirty the pane — the footer appears. Save runs P3; success or error uses
          P4 toasts (upper-right). On save error the footer stays; on success it hides when clean.
        </LOFIText>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 12 }}>
          {rows.map((r) => (
            <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <LOFICheckbox
                id={`p4-flag-${r.id}`}
                label={r.name}
                checked={r.flag}
                onChange={(on) => updateRow(r.id, on)}
                disabled={btn === 'loading'}
              />
            </div>
          ))}
        </div>
      </LOFIMainWorkspace>
    </div>
  );
}

// ---------------------------------------------------------------------------
// P6: Inline Validation (async save feedback; no pre-save confirmation in this demo)
// ---------------------------------------------------------------------------

const SAVE_DEMO_INITIAL_NAME = 'FC Barcelona';

function SaveFeedbackDemo() {
  const [name, setName] = useState(SAVE_DEMO_INITIAL_NAME);
  const [savedName, setSavedName] = useState(SAVE_DEMO_INITIAL_NAME);
  // Start in 'success' because name already matches the persisted value.
  const [btnState, setBtnState] = useState<StatefulButtonState>('success');
  const [saveToast, setSaveToast] = useState<{
    severity: 'success' | 'error';
    message: string;
  } | null>(null);

  function handleNameChange(value: string) {
    setName(value);
    setSaveToast(null);
    setBtnState(value === savedName ? 'success' : 'idle');
  }

  function handleSave() {
    const nameToSave = name;
    setBtnState('loading');
    setSaveToast(null);
    setTimeout(() => {
      if (Math.random() > 0.3) {
        setSavedName(nameToSave);
        setBtnState('success');
        setSaveToast({ severity: 'success', message: 'Changes saved.' });
      } else {
        setBtnState('idle');
        setSaveToast({ severity: 'error', message: 'Save failed. Please try again.' });
      }
    }, 1200);
  }

  return (
    <div style={{ position: 'relative', minHeight: 220 }}>
      {saveToast && (
        <LOFIToast
          severity={saveToast.severity}
          message={saveToast.message}
          autoDismiss={4000}
          onDismiss={() => setSaveToast(null)}
          style={{ position: 'absolute', top: 12, right: 12, zIndex: 2000, maxWidth: 360 }}
        />
      )}
      <LOFIFieldset legend="Team details">
        <LOFIField label="Team name" htmlFor="save-demo-name" required>
          <LOFIInput
            id="save-demo-name"
            value={name}
            onChange={handleNameChange}
            placeholder="e.g. FC Barcelona"
            disabled={btnState === 'loading'}
          />
        </LOFIField>
      </LOFIFieldset>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <LOFIStatefulButton
          state={btnState}
          idleLabel="Save changes"
          successLabel="Saved"
          loadingLabel="Saving"
          variant={btnState === 'success' ? 'dismiss' : 'primary'}
          onClick={handleSave}
        />
        {btnState === 'idle' && (
          <LOFIText variant="muted">Unsaved changes — edit the name to see states change.</LOFIText>
        )}
      </div>
    </div>
  );
}

function ConfirmationDemo() {
  const [removeOpen, setRemoveOpen] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  return (
    <>
      <LOFIModal
        open={removeOpen}
        onClose={() => setRemoveOpen(false)}
        title="Remove Valencia CF?"
        description="This will permanently remove the team and cannot be undone. A changelog entry will be generated."
        footer={
          <>
            <LOFIButton variant="dismiss" onClick={() => setRemoveOpen(false)}>
              Cancel
            </LOFIButton>
            <LOFIButton
              variant="primary"
              onClick={() => {
                setRemoveOpen(false);
                setResult('Valencia CF has been removed.');
              }}
            >
              Remove
            </LOFIButton>
          </>
        }
        children={undefined}
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <LOFIText variant="body">Valencia CF</LOFIText>
        <LOFIText variant="muted">
          Hide is reversible — no confirmation needed. Remove is permanent and requires
          confirmation.
        </LOFIText>
        <div style={{ display: 'flex', gap: 8 }}>
          <LOFIButton
            variant="default"
            onClick={() => setResult('Valencia CF is now hidden. You can un-hide it later.')}
          >
            Hide
          </LOFIButton>
          <LOFIButton
            variant="primary"
            onClick={() => {
              setRemoveOpen(true);
              setResult(null);
            }}
          >
            − Remove
          </LOFIButton>
        </div>
        {result && <LOFIText variant="sm">{result}</LOFIText>}
      </div>
    </>
  );
}

// ---------------------------------------------------------------------------
// P2.4: Bulk Operations  (was P1.4 before reorder)
// ---------------------------------------------------------------------------

type TeamWithHidden = Team & { hidden: boolean };

const BULK_TEAMS: TeamWithHidden[] = ALL_TEAMS.map((t) => ({ ...t, hidden: false }));

function TeamTableBulkHide() {
  const [teams, setTeams] = useState<TeamWithHidden[]>(() => [...BULK_TEAMS]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [input, setInput] = useState('');
  const [search, setSearch] = useState('');

  const filtered = teams.filter(
    (t) => t.name.toLowerCase().includes(search.toLowerCase()) || t.id.includes(search),
  );

  const eligibleFiltered = filtered.filter((t) => !t.hidden);

  const allSelected =
    eligibleFiltered.length > 0 && eligibleFiltered.every((t) => selected.has(t.id));
  const someSelected = eligibleFiltered.some((t) => selected.has(t.id)) && !allSelected;

  function toggleAll() {
    if (allSelected || someSelected) {
      setSelected(new Set());
    } else {
      setSelected(new Set(eligibleFiltered.map((t) => t.id)));
    }
  }

  function toggleRow(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function hideRow(id: string) {
    setTeams((prev) => prev.map((t) => (t.id === id ? { ...t, hidden: true } : t)));
    setSelected((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }

  function unhideRow(id: string) {
    setTeams((prev) => prev.map((t) => (t.id === id ? { ...t, hidden: false } : t)));
  }

  function bulkHide() {
    const ids = new Set(selected);
    setTeams((prev) => prev.map((t) => (ids.has(t.id) ? { ...t, hidden: true } : t)));
    setSelected(new Set());
  }

  const selectedCount = eligibleFiltered.filter((t) => selected.has(t.id)).length;

  const columns: ColumnDef<TeamWithHidden>[] = [
    {
      id: 'select',
      header: () => (
        <LOFICheckbox
          id="bulk-select-all"
          label=""
          checked={allSelected || someSelected}
          onChange={toggleAll}
          disabled={eligibleFiltered.length === 0}
        />
      ),
      cell: ({ row }) => (
        <LOFICheckbox
          id={`bulk-sel-${row.original.id}`}
          label=""
          checked={selected.has(row.original.id)}
          onChange={() => toggleRow(row.original.id)}
          disabled={row.original.hidden}
        />
      ),
      size: 36,
      meta: { shrink: true } satisfies TableColumnMeta,
      enableSorting: false,
    },
    { accessorKey: 'id', header: 'ID', size: 80 },
    { accessorKey: 'name', header: 'Team name' },
    { accessorKey: 'sport', header: 'Sport', size: 100 },
    {
      accessorKey: 'status',
      header: 'Status',
      meta: { shrink: true } satisfies TableColumnMeta,
      cell: ({ row }) => {
        if (row.original.hidden) {
          return <LOFIBadge variant="status" label="Hidden" active={false} />;
        }
        return (
          <LOFIBadge
            variant={STATUS_VARIANT[row.original.status]}
            label={row.original.status}
            active={row.original.status === 'Active'}
          />
        );
      },
    },
    { accessorKey: 'players', header: 'Players', size: 80 },
    {
      id: 'actions',
      header: 'Actions',
      meta: { shrink: true } satisfies TableColumnMeta,
      enableSorting: false,
      cell: ({ row }) => (
        <LOFIButton
          size="compact"
          variant="default"
          onClick={() =>
            row.original.hidden ? unhideRow(row.original.id) : hideRow(row.original.id)
          }
        >
          {row.original.hidden ? 'Unhide' : 'Hide'}
        </LOFIButton>
      ),
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%' }}>
      <LOFIText variant="muted">
        Per-row Hide / Unhide follows <strong>P3 (Stateful Button)</strong> — reversible
        label-toggle variant (label states hidden vs visible). No P7 confirmation.
      </LOFIText>
      <LOFIToolbar
        left={
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ maxWidth: 200, minWidth: 0, flex: '0 0 auto' }}>
              <LOFIInput
                value={input}
                onChange={setInput}
                placeholder="Search by ID or name…"
                allowClear
              />
            </span>
            <LOFIButton variant="default" onClick={() => setSearch(input)}>
              Search
            </LOFIButton>
          </span>
        }
        right={
          <LOFIButton variant="primary" disabled={selectedCount <= 1} onClick={bulkHide}>
            Bulk hide{selectedCount > 0 ? ` (${selectedCount})` : ''}
          </LOFIButton>
        }
      />
      {filtered.length === 0 ? (
        <LOFIEmptyState
          variant="no-results"
          title={`No results for "${search}"`}
          description="Try clearing your search."
          action={
            <LOFIButton
              variant="dismiss"
              onClick={() => {
                setInput('');
                setSearch('');
              }}
            >
              Clear search
            </LOFIButton>
          }
        />
      ) : (
        <LOFITable columns={columns} rows={filtered} keyField="id" sortable />
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// P8 / P9 / P1.2.3.x / bulk import / UX flows (embedded in UX_PATTERNS.md)
// ---------------------------------------------------------------------------

function P7TabNavigationDemo() {
  const [tab, setTab] = useState<'details' | 'notes'>('details');
  const [detailsName, setDetailsName] = useState('Knockout Bracket — CL 24/25');
  const [notes, setNotes] = useState('Line-up confirmed for semi-final.');
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        border: '1px solid #ddd',
        padding: 12,
      }}
    >
      <LOFIText variant="muted">
        P8: switching tabs preserves field values. Edit both tabs, then switch back — nothing is
        discarded and no discard prompt appears.
      </LOFIText>
      <LOFITabs
        value={tab}
        onChange={(v) => setTab(v as 'details' | 'notes')}
        tabs={[
          { value: 'details', label: 'Details' },
          { value: 'notes', label: 'Notes' },
        ]}
      />
      {tab === 'details' && (
        <LOFIField label="Display name" htmlFor="p7-details-name">
          <LOFIInput id="p7-details-name" value={detailsName} onChange={setDetailsName} />
        </LOFIField>
      )}
      {tab === 'notes' && (
        <LOFIField label="Operator notes" htmlFor="p7-notes">
          <LOFIInput id="p7-notes" value={notes} onChange={setNotes} />
        </LOFIField>
      )}
    </div>
  );
}

function sportLabel(slug: string) {
  const m: Record<string, string> = {
    soccer: 'Soccer',
    basketball: 'Basketball',
    tennis: 'Tennis',
  };
  return m[slug] ?? slug;
}

function catLabel(slug: string) {
  const m: Record<string, string> = { clubs: 'International Clubs', nt: 'National Teams' };
  return m[slug] ?? slug;
}

function P8FiltersDemo() {
  const [sport, setSport] = useState('');
  const [cat, setCat] = useState('');
  const [search, setSearch] = useState('');
  const anyActive = Boolean(sport || cat || search.trim());

  type Chip = { id: string; label: string; onDismiss: () => void };
  const chips: Chip[] = [];
  if (sport) {
    chips.push({
      id: 'sport',
      label: `Sport: ${sportLabel(sport)}`,
      onDismiss: () => setSport(''),
    });
  }
  if (cat) {
    chips.push({
      id: 'cat',
      label: `Category: ${catLabel(cat)}`,
      onDismiss: () => setCat(''),
    });
  }
  const q = search.trim();
  if (q) {
    chips.push({
      id: 'q',
      label: `Search: ${q}`,
      onDismiss: () => setSearch(''),
    });
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, border: '1px solid #ddd' }}>
      <div
        style={{
          padding: '10px 12px',
          display: 'flex',
          gap: 8,
          alignItems: 'flex-end',
          flexWrap: 'wrap',
          borderBottom: '1px solid #eee',
        }}
      >
        <LOFIField label="Sport">
          <LOFISelect
            value={sport}
            onChange={setSport}
            placeholder="Sport"
            options={FILTER_SPORTS}
          />
        </LOFIField>
        <LOFIField label="Category">
          <LOFISelect value={cat} onChange={setCat} placeholder="Category" options={FILTER_CATS} />
        </LOFIField>
        <LOFIField label="ID / Name">
          <LOFIInput value={search} onChange={setSearch} placeholder="Search…" />
        </LOFIField>
        <LOFIButton variant="primary">Search</LOFIButton>
        <LOFIButton
          variant="dismiss"
          disabled={!anyActive}
          onClick={() => {
            setSport('');
            setCat('');
            setSearch('');
          }}
        >
          Clear all
        </LOFIButton>
      </div>
      {chips.length > 0 && (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 8,
            alignItems: 'center',
            padding: '0 12px 10px',
          }}
        >
          <LOFIText variant="muted" as="span">
            Active filters
          </LOFIText>
          {chips.map((c) => (
            <LOFIBadge key={c.id} variant="id" label={`${c.label}  ✕`} onClick={c.onDismiss} />
          ))}
          <LOFIBadge
            variant="tag"
            label="Clear all"
            onClick={() => {
              setSport('');
              setCat('');
              setSearch('');
            }}
          />
        </div>
      )}
      <div style={{ padding: '0 12px 12px' }}>
        <LOFIText variant="muted">
          P9: AND logic across dimensions; each chip clears one filter; trailing Clear all matches
          the row control.
        </LOFIText>
      </div>
    </div>
  );
}

function P1_2_3_1_HeadingBarDemo() {
  return (
    <LOFIMainWorkspace
      breadcrumb={<span>Soccer › International Clubs › Champions League</span>}
      title="Knockout Bracket — Champions League 24/25"
      titleBadges={<LOFIBadge variant="tag" label="SIMPLE TOURNAMENT" />}
    >
      <LOFIText variant="muted">
        P1.2.3.1: heading bar zone (breadcrumb, title, badges). Footer and tabs are omitted in this
        slice; see P1.2.3 and P1.2.3.2 / P8 for adjacent zones.
      </LOFIText>
    </LOFIMainWorkspace>
  );
}

function P1_2_3_2_FooterDemo() {
  const [name, setName] = useState('Display name');
  const [dirty, setDirty] = useState(false);
  const [btn, setBtn] = useState<StatefulButtonState>('idle');

  function handleSave() {
    setBtn('loading');
    window.setTimeout(() => {
      setBtn('success');
      setDirty(false);
    }, 800);
  }

  return (
    <LOFIMainWorkspace
      breadcrumb={<span>Entity context</span>}
      title="Sample entity"
      footer={
        <>
          <LOFIButton
            variant="dismiss"
            disabled={!dirty}
            onClick={() => {
              setName('Display name');
              setDirty(false);
              setBtn('idle');
            }}
          >
            Reset changes
          </LOFIButton>
          {!dirty && btn === 'idle' ? (
            <LOFIButton variant="primary" disabled>
              Save changes
            </LOFIButton>
          ) : (
            <LOFIStatefulButton
              state={btn}
              variant={btn === 'success' ? 'dismiss' : 'primary'}
              idleLabel="Save changes"
              loadingLabel="Save changes"
              successLabel="Saved"
              onClick={() => {
                if (btn === 'success') return;
                handleSave();
              }}
            />
          )}
        </>
      }
    >
      <LOFIField label="Field (marks dirty)" htmlFor="p1232-name">
        <LOFIInput
          id="p1232-name"
          value={name}
          onChange={(v) => {
            setName(v);
            setDirty(true);
            if (btn === 'success') setBtn('idle');
          }}
        />
      </LOFIField>
      <LOFIText variant="muted">
        P1.2.3.2: sticky footer strip. Reset is enabled when dirty; Save uses P3 StatefulButton
        (inline workspace — no P7 before save).
      </LOFIText>
    </LOFIMainWorkspace>
  );
}

function P1_2_3_3_MainContentDemo() {
  const [tab, setTab] = useState<'admin' | 'changelog'>('admin');
  const [phase, setPhase] = useState('3');
  return (
    <LOFIMainWorkspace
      breadcrumb={<span>Tournament › Bracket</span>}
      title="Bracket admin"
      tabs={
        <LOFITabs
          value={tab}
          onChange={(v) => setTab(v as 'admin' | 'changelog')}
          tabs={[
            { value: 'admin', label: 'Admin' },
            { value: 'changelog', label: 'Change log' },
          ]}
        />
      }
    >
      {tab === 'admin' && (
        <LOFIFieldset legend="Season">
          <LOFIField label="Phase (number)" htmlFor="p1233-phase">
            <LOFIInput id="p1233-phase" value={phase} onChange={setPhase} />
          </LOFIField>
        </LOFIFieldset>
      )}
      {tab === 'changelog' && (
        <LOFIText variant="muted">
          Change log tab — append-only, newest-first (see interaction rules). Pair with a read-only
          table in full prototypes.
        </LOFIText>
      )}
    </LOFIMainWorkspace>
  );
}

function P2_4_BulkImportDemo() {
  const [importing, setImporting] = useState(false);
  const [rows, setRows] = useState<Team[]>(() => ALL_TEAMS.slice(0, 3));

  function runImport() {
    setImporting(true);
    window.setTimeout(() => {
      setRows((prev) => [
        ...prev,
        {
          id: `T-${Date.now()}`,
          name: 'Imported FC',
          sport: 'Soccer',
          status: 'Pending' as const,
          players: 0,
        },
      ]);
      setImporting(false);
    }, 1200);
  }

  const columns = makeTeamColumns(true);

  return (
    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 8 }}>
      <LOFIToolbar
        left={
          <LOFIButton variant="default" onClick={runImport} disabled={importing}>
            Import CSV
          </LOFIButton>
        }
      />
      <div style={{ position: 'relative', minHeight: 200 }}>
        <LOFITable columns={columns} rows={rows} keyField="id" sortable={false} />
        {importing && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(255,255,255,0.88)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'all',
            }}
            aria-busy
            aria-live="polite"
          >
            <LOFILoader label="Importing…" />
          </div>
        )}
      </div>
      <LOFIText variant="muted">
        P2.4: loading overlay covers the table during import; interactions blocked until complete.
      </LOFIText>
    </div>
  );
}

const CHANGELOG_ROWS = [
  { id: '1', ts: '07 Apr 2026, 14:32', user: 'j.smith', action: 'Updated', entity: 'FC Barcelona' },
  {
    id: '2',
    ts: '07 Apr 2026, 12:01',
    user: 'a.khan',
    action: 'Removed',
    entity: 'Test side draft',
  },
];

function Story1ChangelogTable() {
  return (
    <LOFITable
      columns={[
        { accessorKey: 'ts', header: 'Timestamp', size: 160 },
        { accessorKey: 'user', header: 'User', size: 80 },
        { accessorKey: 'action', header: 'Action', size: 100 },
        { accessorKey: 'entity', header: 'Entity' },
      ]}
      rows={CHANGELOG_ROWS}
      keyField="id"
      sortable={false}
    />
  );
}

/** Story 1 — sidebar (Teams | Changelog) + main pane mirroring the active leaf (P1.2.2 + P1.2.3). */
export function Story1TeamManagementMergedDemo() {
  const [selectedId, setSelectedId] = useState('teams');
  const [collapsed, setCollapsed] = useState(false);
  const isTeams = selectedId === 'teams';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, border: '1px solid #ddd' }}>
      <LOFIText variant="strong">Story 1 — Team Management</LOFIText>
      <LOFIText variant="muted">
        Sidebar selection mirrors the main interface view: Teams shows the registry table and flows;
        Changelog shows the read-only audit table.
      </LOFIText>
      <div style={{ display: 'flex', gap: 0, minHeight: 420, fontFamily: 'monospace' }}>
        {!collapsed && (
          <div
            style={{ width: 200, borderRight: '1px solid #ddd', overflow: 'auto', flexShrink: 0 }}
          >
            <div
              style={{
                padding: '6px 8px',
                borderBottom: '1px solid #eee',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <LOFIText variant="muted" as="span">
                Workspace
              </LOFIText>
              <LOFIButton
                size="compact"
                variant="dismiss"
                onClick={() => setCollapsed(true)}
                aria-label="Collapse sidebar"
              >
                ◀
              </LOFIButton>
            </div>
            <LOFINavTree
              items={TEAM_WORKSPACE_NAV.map((n) => ({ id: n.id, label: n.label }))}
              selectedId={selectedId}
              onSelect={setSelectedId}
            />
          </div>
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          {collapsed && (
            <div style={{ padding: 8, borderBottom: '1px solid #eee' }}>
              <LOFIButton
                size="compact"
                variant="dismiss"
                onClick={() => setCollapsed(false)}
                aria-label="Expand sidebar"
              >
                ▶
              </LOFIButton>
            </div>
          )}
          <LOFIMainWorkspace
            breadcrumb={<span>Team Management</span>}
            title={isTeams ? 'Teams' : 'Changelog'}
            tabs={undefined}
            footer={undefined}
          >
            {isTeams ? (
              <TeamTableWithRowActions />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <LOFIText variant="muted">
                  Filters (user, date, action) would sit above the table in a full build.
                </LOFIText>
                <Story1ChangelogTable />
              </div>
            )}
          </LOFIMainWorkspace>
        </div>
      </div>
    </div>
  );
}

/** Story 2 — shell + filter row + single row where sidebar selection drives the main interface view. */
export function Story2TournamentAdminMergedDemo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 960 }}>
      <LOFIText variant="strong">
        Story 2 — Unified Production Landscape — Tournament admin
      </LOFIText>
      <LOFIText variant="muted">
        Upper shell and filter row (P1.1, P1.2.1 / P9), then one workspace row: collapsible sidebar
        (P1.2.2) beside the main interface view (P1.2.3). The selected tree leaf updates breadcrumb,
        title, badge, and read-only sport in the main pane.
      </LOFIText>
      <UPLShellDemo />
      <FilterRowDemo />
      <TournamentSidebarWithMirroredMain />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Stories (embedded in docs/UX_PATTERNS.md + UX_PATTERN_STORIES.md via *.mdx)
// ---------------------------------------------------------------------------

const meta: Meta = {
  title: 'PATTERNS/UX Patterns',
  parameters: {
    layout: 'padded',
    controls: { disable: true },
    docs: {
      toc: {
        title: 'Table of Contents',
        headingSelector: 'h1, h2, h4',
      },
    },
  },
};
export default meta;
type Story = StoryObj;

const storyStage = (children: React.ReactNode) => (
  <div style={{ maxWidth: 960, width: '100%' }}>{children}</div>
);

/** P2.5 — Long expanded detail: scroll body; parent row sticky (P10); expand/collapse on the row only. */
function P2ExpandableRowsLongDetailDemo() {
  const teams = ALL_TEAMS.slice(0, 5);
  const columns: ColumnDef<Team>[] = [
    { accessorKey: 'name', header: 'Team' },
    { accessorKey: 'sport', header: 'Sport', size: 90 },
    {
      id: 'actions',
      header: 'Actions',
      size: 88,
      meta: { shrink: true } satisfies TableColumnMeta,
      cell: () => (
        <LOFIButton variant="dismiss" size="compact" onClick={(e) => e.stopPropagation()}>
          View
        </LOFIButton>
      ),
    },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%' }}>
      <LOFIInlineAlert
        severity="info"
        title="Hint — modality without stacking modals"
        message="Radix Primitives do not include a Callout; Radix Themes does — this workspace uses grayscale LOFIInlineAlert for hints. Prefer row expansion for secondary context instead of stacking P5 modals."
      />
      <LOFITable
        columns={columns}
        rows={teams}
        keyField="id"
        expandable
        expandableDetailMaxHeight="min(50vh, 18rem)"
        renderExpanded={() => (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {Array.from({ length: 12 }, (_, i) => (
              <LOFIText key={i} variant="body">
                Detail block {i + 1} — secondary fields, changelog, or nested entities stay visible
                beside the list without opening another modal.
              </LOFIText>
            ))}
          </div>
        )}
      />
    </div>
  );
}

type P9SquadRow = { id: string; player: string; pos: string };

const P9_SQUAD_BY_TEAM: Record<string, P9SquadRow[]> = {
  'T-001': [
    { id: 'P9-S1', player: 'Marc-André ter Stegen', pos: 'GK' },
    { id: 'P9-S2', player: 'Jules Koundé', pos: 'DF' },
    { id: 'P9-S3', player: 'Robert Lewandowski', pos: 'FW' },
  ],
  'T-002': [
    { id: 'P9-R1', player: 'Thibaut Courtois', pos: 'GK' },
    { id: 'P9-R2', player: 'Vinícius Júnior', pos: 'FW' },
  ],
};

const P9_OUTER_COLUMNS: ColumnDef<Team>[] = [
  { accessorKey: 'name', header: 'Team' },
  { accessorKey: 'sport', header: 'Sport', size: 90 },
  {
    id: 'actions',
    header: 'Actions',
    size: 88,
    meta: { shrink: true } satisfies TableColumnMeta,
    cell: () => (
      <LOFIButton variant="dismiss" size="compact" onClick={(e) => e.stopPropagation()}>
        View
      </LOFIButton>
    ),
  },
];

const P9_SUB_COLUMNS: ColumnDef<P9SquadRow>[] = [
  { accessorKey: 'player', header: 'Player' },
  { accessorKey: 'pos', header: 'Pos', size: 56, meta: { shrink: true } satisfies TableColumnMeta },
];

/** P10 — Sticky disclosure: accordion-style block + nested expandable table (same sticky model per level). */
function P9StickyDisclosureDemo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, width: '100%' }}>
      <LOFIText variant="strong">Accordion-style disclosure</LOFIText>
      <LOFIText variant="muted">
        Header stays pinned while the body scrolls inside a bounded region — same scroll/sticky
        contract as table parent rows.
      </LOFIText>
      <div
        style={{
          maxHeight: 200,
          overflowY: 'auto',
          border: '1px solid #bbb',
          background: '#fafafa',
        }}
      >
        <div
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 1,
            padding: '8px 12px',
            background: '#fff',
            borderBottom: '1px solid #ddd',
          }}
        >
          <LOFIText variant="strong">Section header (disclosure control)</LOFIText>
        </div>
        <div style={{ padding: '8px 12px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {Array.from({ length: 24 }, (_, i) => (
            <LOFIText key={i} variant="body">
              Body line {i + 1} — scrolls under the sticky header.
            </LOFIText>
          ))}
        </div>
      </div>

      <LOFIText variant="strong">Nested expandable table</LOFIText>
      <LOFIText variant="muted">
        Outer row expands to a sub-table; inner rows can expand — each parent row is sticky in its
        scroll context (P2.5 + P10).
      </LOFIText>
      <LOFITable
        columns={P9_OUTER_COLUMNS}
        rows={ALL_TEAMS.slice(0, 2)}
        keyField="id"
        expandable
        expandableDetailMaxHeight="min(55vh, 22rem)"
        renderExpanded={(row) => {
          const squad = P9_SQUAD_BY_TEAM[row.original.id] ?? [];
          return (
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
              onClick={(e) => e.stopPropagation()}
              role="presentation"
            >
              <LOFIText variant="muted">
                Squad list — expand a player for long nested detail.
              </LOFIText>
              <LOFITable
                columns={P9_SUB_COLUMNS}
                rows={squad}
                keyField="id"
                expandable
                expandableDetailMaxHeight="min(35vh, 10rem)"
                renderExpanded={(sub) => (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {Array.from({ length: 8 }, (_, i) => (
                      <LOFIText key={i} variant="body">
                        Scouting note {i + 1} for {sub.original.player} — nested body scrolls; the
                        player row stays sticky above this region.
                      </LOFIText>
                    ))}
                  </div>
                )}
              />
            </div>
          );
        }}
      />
    </div>
  );
}

// P1: Workspace
/** P1.1 — Persistent upper bar (LOFIToolbar) with logo, interface name, global actions, username. Optional module tab strip below. */
export const P1_1_UPLShell: Story = {
  name: 'P1.1 UPL Shell — upper bar + module strip',
  render: () => storyStage(<UPLShellDemo />),
};

/** P1.2.1 — Filter query row: sport + category dropdowns, ID/name search, Search button, Clear all. */
export const P1_2_1_FilterRow: Story = {
  name: 'P1.2.1 Filter row',
  render: () => storyStage(<FilterRowDemo />),
};

/** P1.2.2 — Collapsible sidebar (LOFINavTree) with hierarchy, expand/collapse, active leaf selection. */
export const P1_2_2_Sidebar: Story = {
  name: 'P1.2.2 Sidebar',
  render: () => storyStage(<SidebarDemo />),
};

/** P1.2.3 — Main interface view (LOFIMainWorkspace): breadcrumb, heading + badge, tab strip, content, sticky footer with Save/Reset. */
export const P1_2_3_MainInterface: Story = {
  name: 'P1.2.3 Main interface view',
  render: () => storyStage(<MainInterfaceDemo />),
};

// P2: Data Table
/** P2.1 — Toolbar + sortable grid; row actions and Add team disabled (structure only). */
export const P2_1_TableStructure: Story = {
  name: 'P2.1 Table structure',
  render: () => storyStage(<TeamTable rowActionsDisabled addDisabled />),
};

/** P2.1 — First-use empty: stable chrome, headers, emptySlot. */
export const P2_EmptyState: Story = {
  name: 'P2.1 First-use empty state',
  render: () => storyStage(<EmptyTeamTable />),
};

/** P2.1 / R4 — Async filter skeleton + remove confirmation + StatefulButton + toast. */
export const P2_LoadingState: Story = {
  name: 'P2.1 / R4 — Loading and feedback',
  parameters: {
    docs: {
      description: {
        story:
          'Team name search with a 1.5s in-table loading row, then filtered results. Remove uses P7, then loading on the row control; failures show an error toast above the table footer area.',
      },
    },
  },
  render: () => storyStage(<TeamTableR4LoadingFeedbackDemo />),
};

/** P2.2 — Full row actions + interactive toolbar (search, Add team). */
export const P2_2_RowActions: Story = {
  name: 'P2.2 Row actions',
  render: () => storyStage(<TeamTableWithRowActions />),
};

/** P2.3 — Sort indicators + live table. */
export const P2_3_SortAffordance: Story = {
  name: 'P2.3 Sort affordance',
  render: () => storyStage(<SortAffordanceDemo />),
};

/** P2.4 — Checkbox multi-select, per-row Hide/Unhide (P3 label-toggle), Bulk hide. */
export const P2_4_BulkHide: Story = {
  name: 'P2.4 Bulk hide',
  render: () => storyStage(<TeamTableBulkHide />),
};

/** P2.5 — Expandable rows: long detail scrolls; sticky parent row + row actions (P10). */
export const P2_5_ExpandableRows: Story = {
  name: 'P2.5 Expandable rows — long detail',
  render: () => storyStage(<P2ExpandableRowsLongDetailDemo />),
};

/** P10 — Sticky disclosure: accordion-style block + nested expandable tables. */
export const P10_StickyDisclosure: Story = {
  name: 'P10 Sticky disclosure while scrolling',
  render: () => storyStage(<P9StickyDisclosureDemo />),
};

// P3: Stateful Button — Map/Mapped/Unmap row demo (Variant B, P2.2)
type MapUnmapRowStatus = 'unmapped' | 'mapping' | 'mapped' | 'unmapping';

interface MapUnmapRowItem {
  id: string;
  name: string;
  status: MapUnmapRowStatus;
}

const MAP_UNMAP_INITIAL_ROWS: MapUnmapRowItem[] = [
  { id: '1', name: 'FC Barcelona', status: 'unmapped' },
  { id: '2', name: 'Real Madrid CF', status: 'mapped' },
  { id: '3', name: 'Atlético de Madrid', status: 'unmapped' },
];

function mapUnmapStatusToButtonState(status: MapUnmapRowStatus): StatefulButtonState {
  if (status === 'mapping') return 'loading';
  if (status === 'mapped') return 'success';
  return 'idle';
}

function StatefulButtonVariantBMapUnmapDemo() {
  const [rows, setRows] = useState<MapUnmapRowItem[]>(MAP_UNMAP_INITIAL_ROWS);

  function startMap(id: string) {
    setRows((r) => r.map((row) => (row.id === id ? { ...row, status: 'mapping' } : row)));
    setTimeout(() => {
      setRows((r) => r.map((row) => (row.id === id ? { ...row, status: 'mapped' } : row)));
    }, 900);
  }

  function startUnmap(id: string) {
    setRows((r) => r.map((row) => (row.id === id ? { ...row, status: 'unmapping' } : row)));
    setTimeout(() => {
      setRows((r) => r.map((row) => (row.id === id ? { ...row, status: 'unmapped' } : row)));
    }, 900);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0, border: '1px solid #bbb' }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          padding: '6px 12px',
          borderBottom: '1px solid #bbb',
          background: '#fafafa',
        }}
      >
        <LOFIText variant="caps">Team</LOFIText>
        <LOFIText variant="caps">Actions</LOFIText>
      </div>

      {rows.map((row, i) => (
        <div
          key={row.id}
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr auto',
            alignItems: 'center',
            padding: '8px 12px',
            gap: 12,
            borderBottom: i < rows.length - 1 ? '1px solid #ddd' : undefined,
          }}
        >
          <LOFIText>{row.name}</LOFIText>
          <div style={{ display: 'flex', gap: 8 }}>
            <LOFIStatefulButton
              state={mapUnmapStatusToButtonState(row.status)}
              idleLabel="Map"
              loadingLabel="Working"
              successLabel="Mapped"
              size="compact"
              onClick={() => startMap(row.id)}
            />
            {row.status === 'mapped' && (
              <LOFIButton variant="dismiss" size="compact" onClick={() => startUnmap(row.id)}>
                Unmap
              </LOFIButton>
            )}
          </div>
        </div>
      ))}

      <div style={{ padding: '8px 12px', background: '#fafafa', borderTop: '1px solid #bbb' }}>
        <LOFIText variant="muted">
          <strong>P3 Variant B:</strong> idle → loading → success so the label states the outcome
          (&quot;Mapped&quot;). Because <code>success</code> is non-clickable, reversal is a
          separate <strong>Unmap</strong> (<code>LOFIButton variant=&quot;dismiss&quot;</code>) —
          same structural idea as Hide/Unhide (label states hidden vs visible; **P2.4**). Compact
          row pattern: **P2.2**.
        </LOFIText>
      </div>
    </div>
  );
}

// P3: Stateful Button (Variant A + Variant B; embedded in docs/UX_PATTERNS.md)
function StatefulButtonSaveStatesStrip() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <LOFIText variant="muted">
        Three snapshots of one button — the <code>state</code> prop is the only difference. In a
        real implementation this is a single <code>&lt;LOFIStatefulButton&gt;</code>; no separate
        Save / Saving / Saved components exist.
      </LOFIText>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 180, flexShrink: 0 }}>
            <LOFIStatefulButton
              state="idle"
              variant="primary"
              idleLabel="Save"
              successLabel="Saved"
            />
          </div>
          <LOFIText variant="muted">
            <strong>state=&quot;idle&quot;</strong> — primary variant, enabled when the form is
            dirty. Clicking starts the async save.
          </LOFIText>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 180, flexShrink: 0 }}>
            <LOFIStatefulButton
              state="loading"
              variant="primary"
              idleLabel="Save"
              loadingLabel="Save"
              successLabel="Saved"
            />
          </div>
          <LOFIText variant="muted">
            <strong>state=&quot;loading&quot;</strong> — disabled, animated dots. Set while the
            request runs.
          </LOFIText>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 180, flexShrink: 0 }}>
            <LOFIStatefulButton
              state="success"
              variant="dismiss"
              idleLabel="Save"
              successLabel="Saved"
            />
          </div>
          <LOFIText variant="muted">
            <strong>state=&quot;success&quot;</strong> — dismiss/ghost variant, disabled. Confirms
            save completed. Returns to idle when the user makes a new change.
          </LOFIText>
        </div>
      </div>
    </div>
  );
}

function P3StatefulButtonPatternDemo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <LOFIText variant="strong">Variant A — Async commit</LOFIText>
        <StatefulButtonSaveStatesStrip />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <LOFIText variant="strong">Variant B — Stated mode + reverse control</LOFIText>
        <LOFIText variant="muted">
          Same family as per-row Hide/Unhide in <strong>P2.4 Bulk hide</strong> (the label states
          the current mode). Here <code>success</code> is disabled, so reversal is a separate
          dismiss button — the **P2.2** Map / Mapped / Unmap table below shows the compact row
          pattern.
        </LOFIText>
        <StatefulButtonVariantBMapUnmapDemo />
      </div>
    </div>
  );
}

/** P3 — Stateful Button: Variant A (Save snapshots) + Variant B (Map/Mapped/Unmap row demo). */
export const P3_StatefulButton: Story = {
  name: 'P3 Stateful Button',
  render: () => storyStage(<P3StatefulButtonPatternDemo />),
};

/** P4 — Toast notification messages: sticky footer + upper-right toasts. */
export const P4_ToastNotificationMessages: Story = {
  name: 'P4 Toast notification messages',
  render: () => storyStage(<P4_ToastNotificationMessagesDemo />),
};

// P5: Detail Modal
export const P5_EditModal: Story = {
  name: 'P5 Edit modal',
  render: () => storyStage(<TeamRosterTrigger />),
};

export const P5_CreateModal: Story = {
  name: 'P5 Create modal',
  render: () => storyStage(<NewTeamTrigger />),
};

export const P5_ModalStacking: Story = {
  name: 'P5 Modal stacking (edge case)',
  render: () => storyStage(<TeamRosterTrigger />),
};

// P6: Inline validation (embedded in docs/UX_PATTERNS.md)
export const P6_InlineValidation: Story = {
  name: 'P6 Inline validation — StatefulButton save',
  render: () => storyStage(<SaveFeedbackDemo />),
};

export const P7_Confirmation: Story = {
  name: 'P7 Confirmation dialog — Remove vs Hide',
  render: () => storyStage(<ConfirmationDemo />),
};

/** P8 — Tab navigation: tab-local state preserved, no discard on switch. */
export const P8_TabNavigation: Story = {
  name: 'P8 Tab navigation',
  render: () => storyStage(<P7TabNavigationDemo />),
};

/** P9 — Filters: row + active-filter chips + per-chip dismiss + Clear all. */
export const P9_Filters: Story = {
  name: 'P9 Filters + active chips',
  render: () => storyStage(<P8FiltersDemo />),
};

/** P1.2.3.1 — Heading bar (breadcrumb, title, badges). */
export const P1_2_3_1_HeadingBar: Story = {
  name: 'P1.2.3.1 Heading bar',
  render: () => storyStage(<P1_2_3_1_HeadingBarDemo />),
};

/** P1.2.3.2 — Sticky footer (Reset + P3 save). */
export const P1_2_3_2_Footer: Story = {
  name: 'P1.2.3.2 Footer',
  render: () => storyStage(<P1_2_3_2_FooterDemo />),
};

/** P1.2.3.3 — Main content: in-pane tabs including change log placement. */
export const P1_2_3_3_MainContent: Story = {
  name: 'P1.2.3.3 Main content',
  render: () => storyStage(<P1_2_3_3_MainContentDemo />),
};

/** P2.4 — Bulk import overlay on table during processing. */
export const P2_4_BulkImport: Story = {
  name: 'P2.4 Bulk import overlay',
  render: () => storyStage(<P2_4_BulkImportDemo />),
};

/** Full Story 1 slice — sidebar + main interface view. */
export const Story1_TeamManagement: Story = {
  name: 'Story 1 — Team Management',
  render: () => storyStage(<Story1TeamManagementMergedDemo />),
};

/** Full Story 2 slice — shell, filters, linked sidebar + main interface view. */
export const Story2_TournamentAdmin: Story = {
  name: 'Story 2 — Unified Production Landscape — Tournament admin',
  render: () => storyStage(<Story2TournamentAdminMergedDemo />),
};
