import { useState, useMemo, useCallback } from 'react';
import {
  LOFIModal, LOFIButton, LOFIText, LOFIToggle, LOFIFieldset, LOFIField, LOFIInput, LOFISelect, LOFITable, LOFIBadge, LOFILoader,
} from 'lofi-kit';
import type { ColumnDef, TableColumnMeta } from 'lofi-kit';
import { ConfirmDialog } from './ConfirmDialog';
import { useTeamStore } from './useTeamStore';
import type { ManagedTeam, Player } from './types';

type ModalMode = 'create' | 'edit';

interface TeamModalProps {
  open: boolean;
  onClose: () => void;
  mode: ModalMode;
  team?: ManagedTeam;
}

const SORT_OPTIONS = [
  { value: 'name',        label: 'Name' },
  { value: 'goals',       label: 'Goals' },
  { value: 'appearances', label: 'Appearances' },
  { value: 'points',      label: 'Points' },
];

type SortKey = 'name' | 'goals' | 'appearances' | 'points';

export function TeamModal({ open, onClose, mode, team }: TeamModalProps) {
  const { allPlayers, createTeam, updateTeamRoster, importCsvPlayers } = useTeamStore();

  // ── Tab state ──
  const [activeTab, setActiveTab] = useState<string>(() => (mode === 'edit' ? 'players' : 'info'));

  // ── Team info state ──
  const [teamName, setTeamName] = useState(() => team?.name ?? '');
  const [nameError, setNameError] = useState('');
  const [nameTouched, setNameTouched] = useState(false);

  // ── Player roster state ──
  const [rosterIds, setRosterIds] = useState<string[]>(() => team?.playerIds ?? []);
  /** Frozen snapshot from mount; parent remounts this modal via `key` when the session changes. */
  const [initialRosterSnapshot] = useState<string[]>(() => [...(team?.playerIds ?? [])]);

  // ── Search & filter state ──
  const [search, setSearch] = useState('');
  const [sortDir, setSortDir] = useState<string>('az');
  const [sortKey, setSortKey] = useState<SortKey>('name');

  // ── CSV import state ──
  const [csvRows, setCsvRows] = useState<Player[]>([]);
  const [csvImported, setCsvImported] = useState(false);

  // ── Remove player confirmation ──
  const [removingPlayer, setRemovingPlayer] = useState<Player | null>(null);

  // ── Save flow state ──
  const [saving, setSaving] = useState(false);
  const [confirmAction, setConfirmAction] = useState<'save' | 'discard' | null>(null);

  // ── Validation ──
  const nameIsValid = teamName.trim().length > 0;
  const metadataValid = nameIsValid;

  const validateName = useCallback(() => {
    setNameTouched(true);
    if (!teamName.trim()) {
      setNameError('Team name is required');
    } else {
      setNameError('');
    }
  }, [teamName]);

  const handleNameChange = useCallback((val: string) => {
    setTeamName(val);
    if (nameTouched && !val.trim()) {
      setNameError('Team name is required');
    } else if (nameTouched) {
      setNameError('');
    }
  }, [nameTouched]);

  // ── Dirty tracking ──
  const isDirty = useMemo(() => {
    if (mode === 'create') return teamName.trim().length > 0 || rosterIds.length > 0;
    const initialSet = new Set(initialRosterSnapshot);
    const currentSet = new Set(rosterIds);
    if (initialSet.size !== currentSet.size) return true;
    for (const id of initialSet) if (!currentSet.has(id)) return true;
    return false;
  }, [mode, teamName, rosterIds, initialRosterSnapshot]);

  const canSave = mode === 'create'
    ? metadataValid && isDirty
    : isDirty;

  // ── Merged player list (base + csv) ──
  const mergedPlayers = useMemo(() => {
    const base = [...allPlayers];
    for (const cp of csvRows) {
      if (!base.some(p => p.id === cp.id)) base.push(cp);
    }
    return base;
  }, [allPlayers, csvRows]);

  // ── Filtered & sorted players ──
  const filteredPlayers = useMemo(() => {
    let list = mergedPlayers;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q),
      );
    }
    list = [...list].sort((a, b) => {
      if (sortKey === 'name') {
        const cmp = a.name.localeCompare(b.name);
        return sortDir === 'az' ? cmp : -cmp;
      }
      const diff = (b[sortKey] as number) - (a[sortKey] as number);
      return sortDir === 'az' ? diff : -diff;
    });
    return list;
  }, [mergedPlayers, search, sortDir, sortKey]);

  // ── Actions ──
  const addPlayer = (playerId: string) => {
    setRosterIds(prev => [...prev, playerId]);
  };

  const doRemovePlayer = (playerId: string) => {
    setRosterIds(prev => prev.filter(id => id !== playerId));
    setRemovingPlayer(null);
  };

  const handleCsvImport = () => {
    const imported = importCsvPlayers();
    setCsvRows(imported);
    setCsvImported(true);
  };

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      if (mode === 'create') {
        createTeam(teamName.trim(), rosterIds);
      } else if (team) {
        updateTeamRoster(team.id, rosterIds);
      }
      setSaving(false);
      onClose();
    }, 800);
  };

  const handleClose = () => {
    if (isDirty) {
      setConfirmAction('discard');
    } else {
      onClose();
    }
  };

  // ── Player table columns ──
  const playerColumns: ColumnDef<Player, unknown>[] = useMemo(() => [
    {
      accessorKey: 'id',
      header: 'ID',
      cell: ({ row }) => <LOFIBadge variant="id" label={row.original.id} />,
      size: 100,
    },
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => (
        <span>
          <LOFIText variant="body">{row.original.name || '—'}</LOFIText>
          {row.original.importError && (
            <LOFIText variant="sm"> {row.original.importError}</LOFIText>
          )}
        </span>
      ),
    },
    {
      accessorKey: 'position',
      header: 'Pos',
      size: 60,
      meta: { shrink: true } satisfies TableColumnMeta,
      cell: ({ row }) => <LOFIText variant="sm">{row.original.position}</LOFIText>,
    },
    {
      id: 'stats',
      header: 'Stats',
      meta: { shrink: true } satisfies TableColumnMeta,
      cell: ({ row }) => (
        <LOFIText variant="sm">
          {row.original.goals}G / {row.original.appearances}A / {row.original.points}pts
        </LOFIText>
      ),
    },
    {
      id: 'status',
      header: 'Status',
      meta: { shrink: true } satisfies TableColumnMeta,
      cell: ({ row }) => {
        const onTeam = rosterIds.includes(row.original.id);
        const isPending = row.original.isPending;
        const hasError = Boolean(row.original.importError);
        if (hasError) return <LOFIBadge variant="status" active={false} label="error" />;
        if (isPending) return <LOFIBadge variant="status" active={false} label="pending" />;
        return onTeam
          ? <LOFIBadge variant="status" active label="on team" />
          : <LOFIBadge variant="status" active={false} label="available" />;
      },
    },
    {
      id: 'action',
      header: 'Action',
      meta: { shrink: true } satisfies TableColumnMeta,
      cell: ({ row }) => {
        const p = row.original;
        if (p.importError) return null;
        const onTeam = rosterIds.includes(p.id);
        return onTeam ? (
          <LOFIButton
            variant="dismiss"
            size="compact"
            onClick={(e) => { e.stopPropagation(); setRemovingPlayer(p); }}
          >
            − Remove
          </LOFIButton>
        ) : (
          <LOFIButton
            variant="default"
            size="compact"
            onClick={(e) => { e.stopPropagation(); addPlayer(p.id); }}
          >
            + Add
          </LOFIButton>
        );
      },
    },
  ], [rosterIds]);

  // ── Render ──
  const playersDisabled = mode === 'create' && !metadataValid;

  const footer = (
    <>
      <LOFIButton variant="dismiss" onClick={handleClose} disabled={saving}>
        Cancel
      </LOFIButton>
      {saving ? (
        <LOFIButton variant="primary" disabled>
          <LOFILoader label={mode === 'create' ? 'Creating' : 'Saving'} />
        </LOFIButton>
      ) : (
        <LOFIButton
          variant="primary"
          disabled={!canSave}
          onClick={() => setConfirmAction('save')}
        >
          {mode === 'create' ? 'Create Team' : 'Save'}
        </LOFIButton>
      )}
    </>
  );

  const modalTitle = mode === 'create'
    ? 'New Team'
    : `Edit — ${team?.name ?? ''}`;

  return (
    <>
      <LOFIModal open={open} onClose={handleClose} title={modalTitle} footer={footer} size="wide">
        <LOFIToggle
          value={activeTab}
          onChange={setActiveTab}
          options={[
            { value: 'info', label: 'Team Info' },
            { value: 'players', label: 'Players' },
          ]}
          ariaLabel="Modal section"
        />

        {activeTab === 'info' && (
          <LOFIFieldset legend="Team Details">
            <LOFIField label="Team name" required htmlFor="team-name" error={nameError || undefined}>
              <LOFIInput
                id="team-name"
                value={teamName}
                onChange={handleNameChange}
                onBlur={() => validateName()}
                readOnly={mode === 'edit'}
                placeholder="e.g. FC Barcelona"
              />
            </LOFIField>
          </LOFIFieldset>
        )}

        {activeTab === 'players' && (
          <div style={{ opacity: playersDisabled ? 0.4 : 1, pointerEvents: playersDisabled ? 'none' : 'auto' }}>
            {playersDisabled && (
              <LOFIText variant="muted">Complete team info before managing players.</LOFIText>
            )}

            <div className="team-modal__controls">
              <LOFIField label="Search" htmlFor="player-search">
                <LOFIInput
                  id="player-search"
                  type="search"
                  value={search}
                  onChange={setSearch}
                  placeholder="Search by ID or player name…"
                />
              </LOFIField>
              <div className="team-modal__filters">
                <LOFIToggle
                  value={sortDir}
                  onChange={setSortDir}
                  options={[
                    { value: 'az', label: 'A–Z' },
                    { value: 'za', label: 'Z–A' },
                  ]}
                  ariaLabel="Sort direction"
                />
                <LOFISelect
                  value={sortKey}
                  onChange={(v) => setSortKey(v as SortKey)}
                  options={SORT_OPTIONS}
                  size="compact"
                />
              </div>
            </div>

            <LOFITable<Player>
              columns={playerColumns}
              rows={filteredPlayers}
              keyField="id"
              sortable
              emptyText="No players match your search."
            />

            <div className="team-modal__csv">
              <LOFIButton variant="default" onClick={handleCsvImport} disabled={csvImported}>
                {csvImported ? '✓ CSV Imported' : '↑ Import CSV'}
              </LOFIButton>
            </div>
          </div>
        )}
      </LOFIModal>

      {/* Remove player confirmation */}
      <ConfirmDialog
        open={removingPlayer !== null}
        onClose={() => setRemovingPlayer(null)}
        title="Remove Player"
        message={`Remove ${removingPlayer?.name ?? ''} from the roster?`}
        confirmLabel="Remove"
        destructive
        onConfirm={() => removingPlayer && doRemovePlayer(removingPlayer.id)}
      />

      {/* Save / Create confirmation */}
      <ConfirmDialog
        open={confirmAction === 'save'}
        onClose={() => setConfirmAction(null)}
        title={mode === 'create' ? 'Create Team' : 'Save Changes'}
        message={
          mode === 'create'
            ? `Create team "${teamName.trim()}"?`
            : `Save changes to ${team?.name ?? ''}?`
        }
        confirmLabel={mode === 'create' ? 'Create Team' : 'Save'}
        onConfirm={handleSave}
      />

      {/* Discard changes confirmation */}
      <ConfirmDialog
        open={confirmAction === 'discard'}
        onClose={() => setConfirmAction(null)}
        title="Unsaved Changes"
        message="You have unsaved changes. Discard?"
        confirmLabel="Discard"
        destructive
        onConfirm={onClose}
      />
    </>
  );
}
