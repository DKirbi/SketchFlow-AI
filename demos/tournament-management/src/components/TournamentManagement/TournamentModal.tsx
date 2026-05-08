import { useMemo, useState } from 'react';
import { LOFIButton, LOFIModal, LOFIText } from 'lofi-kit';

import { createNewSimpleTournamentId, snapshotToTournament } from '../../lib/tournamentFormMappers';
import { validateSnapshot } from '../../lib/modalValidate';
import { validateTournamentName } from '../../lib/validation';
import type { ModalMode, SimpleTournament, TournamentFormSnapshot } from '../../types';
import { ConfirmDialog } from './ConfirmDialog';
import { TournamentForm } from './TournamentForm';

export interface TournamentModalProps {
  open: boolean;
  onClose: () => void;
  mode: ModalMode;
  seed: TournamentFormSnapshot;
  sourceTournament?: SimpleTournament;
  onCommit: (mode: ModalMode, tournament: SimpleTournament, previousId?: string) => Promise<boolean>;
}

export function TournamentModal({
  open,
  onClose,
  mode,
  seed,
  sourceTournament,
  onCommit,
}: TournamentModalProps) {
  const [snapshot, setSnapshot] = useState(seed);
  const [nameBlurred, setNameBlurred] = useState(false);
  const [saveConfirmOpen, setSaveConfirmOpen] = useState(false);
  const [discardOpen, setDiscardOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  const baseline = useMemo(() => JSON.stringify(seed), [seed]);
  const dirty = JSON.stringify(snapshot) !== baseline;

  const baseErr = validateSnapshot(snapshot, mode);
  const nameErr = nameBlurred ? validateTournamentName(snapshot.name) : undefined;
  const fieldErrors =
    nameErr === undefined ? baseErr : { ...baseErr, name: nameErr };

  const valid = Object.keys(validateSnapshot(snapshot, mode)).length === 0 && !nameErr;

  /** Create / clone commits once validations pass — dirty optional for untouched defaults; edit requires dirty */
  const canPrimary =
    !busy &&
    valid &&
    (mode === 'edit'
      ? dirty
      : true);

  const requestClose = () => {
    if (dirty && !busy) {
      setDiscardOpen(true);
      return;
    }
    onClose();
  };

  const title =
    mode === 'edit'
      ? `Edit — ${sourceTournament?.name ?? 'tournament'}`
      : mode === 'clone'
        ? 'Clone simple tournament'
        : 'Create simple tournament';

  const runSave = async () => {
    if (!valid) return;
    setBusy(true);
    try {
      const id = mode === 'edit' && sourceTournament ? sourceTournament.id : createNewSimpleTournamentId();
      const running =
        sourceTournament?.running ??
        (snapshot.competitionType === 'league' ||
          snapshot.name.toLowerCase().includes('friendly'));
      const prev = mode === 'edit' && sourceTournament ? sourceTournament.id : undefined;

      const st = snapshotToTournament(id, snapshot, running);
      const ok = await onCommit(mode, st, prev);
      setSaveConfirmOpen(false);
      if (ok) onClose();
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <LOFIModal
        open={open}
        onClose={requestClose}
        title={title}
        size="wide"
        footer={
          <>
            <LOFIButton type="button" variant="dismiss" disabled={busy} onClick={requestClose}>
              Cancel
            </LOFIButton>
            <LOFIButton
              type="button"
              variant="primary"
              disabled={!canPrimary}
              onClick={() => {
                setNameBlurred(true);
                if (!valid) return;
                setSaveConfirmOpen(true);
              }}
            >
              {busy ? 'Saving…' : mode === 'edit' ? 'Save' : 'Create'}
            </LOFIButton>
          </>
        }
      >
        <LOFIText variant="description">
          Section numbering follows brief (Section 5 omitted by product). Classification prefills mirror sidebar Browse selection.
        </LOFIText>
        <TournamentForm
          mode={mode}
          snapshot={snapshot}
          onChange={setSnapshot}
          errors={fieldErrors}
          onBlurName={() => setNameBlurred(true)}
        />
      </LOFIModal>

      <ConfirmDialog
        open={saveConfirmOpen}
        onClose={() => setSaveConfirmOpen(false)}
        title={
          mode === 'edit' ? 'Save changes?' : mode === 'clone' ? 'Create clone?' : 'Create tournament?'
        }
        message={`Commit "${snapshot.name}" to mocked workspace storage?`}
        confirmLabel={mode === 'edit' ? 'Save' : 'Create'}
        onConfirm={() => {
          void runSave();
        }}
      />

      <ConfirmDialog
        open={discardOpen}
        onClose={() => setDiscardOpen(false)}
        title="Discard changes?"
        message="Close without applying edits?"
        confirmLabel="Discard"
        destructive
        onConfirm={() => {
          setDiscardOpen(false);
          onClose();
        }}
      />
    </>
  );
}
