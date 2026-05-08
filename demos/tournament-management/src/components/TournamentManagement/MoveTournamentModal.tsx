import { useMemo, useState } from 'react';
import { LOFIButton, LOFIField, LOFIModal, LOFISelect, LOFIText } from 'lofi-kit';

import { CATEGORIES, uniqueTournamentById, uniqueTournamentsForCategory } from '../../data/catalog';
import { noneUtBranchIdForCategory } from '../../lib/sidebarTree';
import type { SimpleTournament } from '../../types';
import { ConfirmDialog } from './ConfirmDialog';

export interface MoveTournamentModalProps {
  open: boolean;
  tournament: SimpleTournament | undefined;
  onClose: () => void;
  /** Returns whether the mock move succeeded. */
  onMoveCommit: (categoryId: string, utBranchId: string) => Promise<boolean>;
}

export function MoveTournamentModal({
  open,
  tournament,
  onClose,
  onMoveCommit,
}: MoveTournamentModalProps) {
  const [categoryId, setCategoryId] = useState(tournament?.categoryId ?? '');
  const [utBranchId, setUtBranchId] = useState(
    tournament
      ? tournament.uniqueTournamentId === ''
        ? noneUtBranchIdForCategory(tournament.categoryId)
        : tournament.uniqueTournamentId
      : '',
  );
  const [p7, setP7] = useState(false);
  const [moving, setMoving] = useState(false);

  const utOptions = useMemo(() => {
    const none = [
      {
        value: noneUtBranchIdForCategory(categoryId),
        label: 'No cross-season grouping',
      },
    ];
    const uts = uniqueTournamentsForCategory(categoryId).map((u) => ({
      value: u.id,
      label: u.label,
    }));
    return [...none, ...uts];
  }, [categoryId]);

  const catOptions = CATEGORIES.map((c) => ({
    value: c.id,
    label: c.label,
  }));

  const dirty =
    !!tournament &&
    (categoryId !== tournament.categoryId ||
      (tournament.uniqueTournamentId === ''
        ? utBranchId !== noneUtBranchIdForCategory(tournament.categoryId)
        : utBranchId !== tournament.uniqueTournamentId));

  const requestMove = async () => {
    setMoving(true);
    try {
      const ok = await onMoveCommit(categoryId, utBranchId);
      if (ok) onClose();
    } finally {
      setMoving(false);
      setP7(false);
    }
  };

  if (!tournament) return null;

  return (
    <>
      <LOFIModal
        open={open}
        onClose={onClose}
        title={`Move — ${tournament.name}`}
        size="wide"
        footer={
          <>
            <LOFIButton type="button" variant="dismiss" disabled={moving} onClick={onClose}>
              Cancel
            </LOFIButton>
            <LOFIButton
              type="button"
              variant="primary"
              disabled={!dirty || moving}
              onClick={() => setP7(true)}
            >
              Move here
            </LOFIButton>
          </>
        }
      >
        <LOFIText variant="description">
          Reparent mock data; monitoring category aligns with the catalogue defaults after move.
        </LOFIText>
        <div className="tmgmt__move-grid">
          <LOFIField label="Target category" htmlFor="mv-cat">
            <LOFISelect
              id="mv-cat"
              value={categoryId}
              options={catOptions}
              onChange={(v) => {
                setCategoryId(v);
                setUtBranchId(noneUtBranchIdForCategory(v));
              }}
            />
          </LOFIField>
          <LOFIField label="Unique tournament branch" htmlFor="mv-ut">
            <LOFISelect id="mv-ut" value={utBranchId} options={utOptions} onChange={setUtBranchId} />
          </LOFIField>
        </div>
      </LOFIModal>

      <ConfirmDialog
        open={p7}
        onClose={() => setP7(false)}
        title="Confirm move"
        message={`Move ${tournament.name} under ${readableBranch(categoryId, utBranchId)}?`}
        confirmLabel="Move tournament"
        destructive={false}
        onConfirm={() => {
          void requestMove();
        }}
      />
    </>
  );
}

function readableBranch(categoryId: string, branchId: string): string {
  if (branchId.startsWith('ut-none-')) return 'no cross-season grouping';
  const ut =
    uniqueTournamentById(branchId) ??
    uniqueTournamentsForCategory(categoryId).find((x) => x.id === branchId);
  return ut?.label ?? branchId;
}
