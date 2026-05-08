import { useState, useMemo, useEffect } from 'react';
import {
  LOFIToolbar, LOFIText, LOFIBadge, LOFIButton, LOFIToggle, LOFITable,
} from 'lofi-kit';
import type { ColumnDef, TableColumnMeta } from 'lofi-kit';
import { ConfirmDialog } from './ConfirmDialog';
import { TeamModal } from './TeamModal';
import { useTeamStore } from './useTeamStore';
import type { ManagedTeam, ChangelogEntry } from './types';
import './TeamManagement.scss';

interface TeamManagementProps {
  onBack?: () => void;
}

export function TeamManagement({ onBack }: TeamManagementProps) {
  const {
    teams, changelog, currentUser,
    cycleRole, markRedundant, confirmRemoval, rejectRemoval,
    notification, clearNotification,
  } = useTeamStore();

  // ── View toggle ──
  const [view, setView] = useState<string>('teams');

  // ── Modal state ──
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [editingTeam, setEditingTeam] = useState<ManagedTeam | undefined>();

  // ── Inline confirmation per-row ──
  const [confirmingRedundant, setConfirmingRedundant] = useState<string | null>(null);
  const [confirmRemoveDialog, setConfirmRemoveDialog] = useState<ManagedTeam | null>(null);

  // ── Notification auto-dismiss ──
  useEffect(() => {
    if (!notification) return;
    const t = setTimeout(clearNotification, 3000);
    return () => clearTimeout(t);
  }, [notification, clearNotification]);

  // ── Open modals ──
  const openCreate = () => {
    setModalMode('create');
    setEditingTeam(undefined);
    setModalOpen(true);
  };

  const openEdit = (team: ManagedTeam) => {
    setModalMode('edit');
    setEditingTeam(team);
    setModalOpen(true);
  };

  // ── Teams table columns ──
  const teamColumns: ColumnDef<ManagedTeam, unknown>[] = useMemo(() => [
    {
      accessorKey: 'id',
      header: 'ID',
      cell: ({ row }) => <LOFIBadge variant="id" label={row.original.id} />,
      size: 100,
    },
    {
      accessorKey: 'name',
      header: 'Team Name',
      cell: ({ row }) => <LOFIText variant="body">{row.original.name}</LOFIText>,
    },
    {
      accessorKey: 'status',
      header: 'Status',
      meta: { shrink: true } satisfies TableColumnMeta,
      cell: ({ row }) => {
        const t = row.original;
        return (
          <LOFIBadge
            variant="status"
            active={t.status === 'active'}
            label={t.status}
          />
        );
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      meta: { shrink: true } satisfies TableColumnMeta,
      cell: ({ row }) => {
        const t = row.original;
        const isOperator = currentUser.role === 'operator';
        const isSupervisor = currentUser.role === 'supervisor' || currentUser.role === 'admin';

        if (confirmingRedundant === t.id) {
          return (
            <span className="team-mgmt__inline-confirm">
              <LOFIText variant="sm">Mark this team as redundant?</LOFIText>
              <LOFIButton
                variant="primary"
                size="compact"
                onClick={() => { markRedundant(t.id); setConfirmingRedundant(null); }}
              >
                Yes
              </LOFIButton>
              <LOFIButton
                variant="dismiss"
                size="compact"
                onClick={() => setConfirmingRedundant(null)}
              >
                No
              </LOFIButton>
            </span>
          );
        }

        return (
          <span className="team-mgmt__actions">
            <LOFIButton variant="default" size="compact" onClick={() => openEdit(t)}>
              ✎ Edit
            </LOFIButton>
            {t.status === 'active' && isOperator && (
              <LOFIButton
                variant="dismiss"
                size="compact"
                onClick={() => setConfirmingRedundant(t.id)}
              >
                Mark redundant
              </LOFIButton>
            )}
            {t.status === 'redundant' && isSupervisor && (
              <>
                <LOFIButton
                  variant="primary"
                  size="compact"
                  onClick={() => setConfirmRemoveDialog(t)}
                >
                  ✓ Confirm removal
                </LOFIButton>
                <LOFIButton
                  variant="dismiss"
                  size="compact"
                  onClick={() => rejectRemoval(t.id)}
                >
                  ✕ Reject
                </LOFIButton>
              </>
            )}
            {t.status === 'redundant' && (
              <LOFIText variant="sm">
                flagged by {t.markedRedundantBy} — {t.markedRedundantAt}
              </LOFIText>
            )}
          </span>
        );
      },
    },
  ], [currentUser.role, confirmingRedundant, markRedundant, rejectRemoval]);

  // ── Changelog columns ──
  const logColumns: ColumnDef<ChangelogEntry, unknown>[] = useMemo(() => [
    {
      accessorKey: 'timestamp',
      header: 'Date / Time',
      meta: { shrink: true } satisfies TableColumnMeta,
      cell: ({ row }) => <LOFIText variant="sm">{row.original.timestamp}</LOFIText>,
    },
    {
      accessorKey: 'userHandle',
      header: 'User',
      meta: { shrink: true } satisfies TableColumnMeta,
      cell: ({ row }) => <LOFIText variant="sm">{row.original.userHandle}</LOFIText>,
    },
    {
      accessorKey: 'userRole',
      header: 'Role',
      meta: { shrink: true } satisfies TableColumnMeta,
      cell: ({ row }) => <LOFIBadge variant="tag" label={row.original.userRole} />,
    },
    {
      accessorKey: 'entityId',
      header: 'Entity',
      meta: { shrink: true } satisfies TableColumnMeta,
      cell: ({ row }) => <LOFIBadge variant="id" label={row.original.entityId} />,
    },
    {
      accessorKey: 'action',
      header: 'Action',
      meta: { shrink: true } satisfies TableColumnMeta,
      cell: ({ row }) => (
        <LOFIBadge
          variant="status"
          active={!['marked redundant', 'removed'].includes(row.original.action)}
          label={row.original.action}
        />
      ),
    },
    {
      accessorKey: 'summary',
      header: 'Summary',
      cell: ({ row }) => <LOFIText variant="muted">{row.original.summary}</LOFIText>,
    },
  ], []);

  return (
    <div className="team-mgmt">
      <LOFIToolbar
        left={
          <span className="team-mgmt__identity">
            {onBack && (
              <LOFIButton variant="dismiss" size="compact" onClick={onBack}>← Back</LOFIButton>
            )}
            <LOFIText variant="sm">{currentUser.handle}</LOFIText>
            <LOFIBadge
              variant="tag"
              label={currentUser.role}
              onClick={cycleRole}
            />
            <LOFIText variant="ghost">(click role to switch)</LOFIText>
          </span>
        }
        center={<LOFIText as="h1" variant="body">Team Management</LOFIText>}
      />

      <div className="team-mgmt__bar">
        <LOFIToggle
          value={view}
          onChange={setView}
          options={[
            { value: 'teams', label: 'Teams' },
            { value: 'changelog', label: 'Changelog' },
          ]}
          ariaLabel="View"
        />
      </div>

      {notification && (
        <div className="team-mgmt__notification">
          <LOFIText variant="sm">{notification}</LOFIText>
          <LOFIButton variant="dismiss" size="compact" onClick={clearNotification}>✕</LOFIButton>
        </div>
      )}

      {view === 'teams' && (
        <div className="team-mgmt__content">
          <div className="team-mgmt__header">
            <LOFIButton variant="primary" onClick={openCreate}>+ Create Team</LOFIButton>
          </div>
          <LOFITable<ManagedTeam>
            columns={teamColumns}
            rows={teams}
            keyField="id"
            sortable
            emptyText="No teams yet. Click '+ Create Team' to add one."
          />
        </div>
      )}

      {view === 'changelog' && (
        <div className="team-mgmt__content">
          <LOFITable<ChangelogEntry>
            columns={logColumns}
            rows={changelog}
            keyField="id"
            sortable
            emptyText="No changelog entries."
          />
        </div>
      )}

      {/* Team create/edit modal */}
      {modalOpen && (
        <TeamModal
          key={modalMode === 'create' ? 'create' : editingTeam?.id ?? 'edit'}
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          mode={modalMode}
          team={editingTeam}
        />
      )}

      {/* Supervisor confirm removal dialog */}
      <ConfirmDialog
        open={confirmRemoveDialog !== null}
        onClose={() => setConfirmRemoveDialog(null)}
        title="Confirm Removal"
        message={
          confirmRemoveDialog
            ? `Remove ${confirmRemoveDialog.name}? Flagged by ${confirmRemoveDialog.markedRedundantBy} on ${confirmRemoveDialog.markedRedundantAt}.`
            : ''
        }
        confirmLabel="Remove Team"
        destructive
        onConfirm={() => {
          if (confirmRemoveDialog) confirmRemoval(confirmRemoveDialog.id);
        }}
      />
    </div>
  );
}
