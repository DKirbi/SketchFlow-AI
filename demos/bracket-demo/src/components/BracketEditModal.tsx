import { useState } from 'react';
import {
  LOFIModal,
  LOFIButton,
  LOFIText,
  LOFIField,
  LOFISelect,
  LOFIInput,
  LOFICheckbox,
} from 'lofi-kit';
import { useTournamentStore } from '../store/useTournamentStore';
import { generateMatchDisplayId, shortLabelForMatch } from '../lib/matchDisplay';
import type {
  Bracket,
  Match,
  Progression,
  ProgressionCondition,
  ProgressionRule,
  ProgressionSlot,
  ProgressionTrigger,
  Team,
} from '../types';

interface Props {
  /** The bracket being edited; used to seed local participant/match state. */
  bracket: Bracket;
  /** Called when the modal should close (Cancel, Save, or backdrop click). */
  onClose: () => void;
}

function genId() {
  return Math.random().toString(36).slice(2, 9);
}

// ── Inline add-progression form ───────────────────────────────────────────────

interface AddProgressionFormProps {
  /** The bracket from which the new progression originates — the "from bracket" is locked. */
  fromBracket: Bracket;
  /** All brackets in the tournament, used to populate the destination selector. */
  allBrackets: Bracket[];
  /**
   * Called with the composed rule when the user submits the form.
   * `newBracketTitle` is provided only when the destination mode is "new bracket".
   */
  onAdd: (rule: ProgressionRule, newBracketTitle?: string) => void;
  /** Called when the user cancels without submitting. */
  onCancel: () => void;
}

function AddProgressionForm({ fromBracket, allBrackets, onAdd, onCancel }: AddProgressionFormProps) {
  const fromMatches = fromBracket.matches;
  const [fromMatchId, setFromMatchId] = useState(fromMatches[0]?.id ?? '');
  const [trigger] = useState<ProgressionTrigger>('AFTER_MATCH_END');
  const [condition, setCondition] = useState<ProgressionCondition>('WINNER');
  const [toSlot, setToSlot] = useState<ProgressionSlot>('teamA');
  const [toBracketMode, setToBracketMode] = useState<'existing' | 'new'>('new');
  const [toBracketId, setToBracketId] = useState('');
  const [newBracketTitle, setNewBracketTitle] = useState('');

  const existingDest = allBrackets.filter((b) => b.id !== fromBracket.id);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!fromMatchId) return;

    const destBracketId =
      toBracketMode === 'new' ? `bracket-new-${genId()}` : toBracketId;
    if (!destBracketId) return;

    const destBracket = allBrackets.find((b) => b.id === destBracketId);
    const destMatchId =
      toBracketMode === 'new'
        ? `match-${genId()}`
        : destBracket?.matches[0]?.id ?? `match-${genId()}`;

    const rule: ProgressionRule = {
      fromBracketId: fromBracket.id,
      fromMatchId,
      toBracketId: destBracketId,
      toMatchId: destMatchId,
      toSlot,
      trigger,
      condition,
    };

    onAdd(rule, toBracketMode === 'new' ? newBracketTitle || 'Finals' : undefined);
  }

  const previewMatch = fromMatches.find((m) => m.id === fromMatchId);
  const previewMatchLabel = previewMatch
    ? `${previewMatch.teamA?.name ?? previewMatch.teamAPlaceholder ?? '???'} vs ${previewMatch.teamB?.name ?? previewMatch.teamBPlaceholder ?? '???'}`
    : '…';
  const previewDest =
    toBracketMode === 'new'
      ? newBracketTitle || 'New Bracket'
      : allBrackets.find((b) => b.id === toBracketId)?.title ?? '…';

  const fromMatchOptions = fromMatches.length === 0
    ? [{ value: '', label: 'No matches', disabled: true }]
    : fromMatches.map((m) => {
        const a = m.teamA?.name ?? m.teamAPlaceholder ?? '???';
        const b = m.teamB?.name ?? m.teamBPlaceholder ?? '???';
        return { value: m.id, label: `${a} vs ${b}` };
      });

  return (
    <form className="prog-add-form" onSubmit={handleSubmit}>
      <div className="prog-add-fields">
        <LOFIField label="From match" htmlFor="add-prog-from-match">
          <LOFISelect
            id="add-prog-from-match"
            value={fromMatchId}
            onChange={setFromMatchId}
            options={fromMatchOptions}
          />
        </LOFIField>

        <LOFIField label="Condition" htmlFor="add-prog-condition">
          <LOFISelect
            id="add-prog-condition"
            value={condition}
            onChange={(v) => setCondition(v as ProgressionCondition)}
            options={[
              { value: 'WINNER', label: 'WINNER' },
              { value: 'LOSER', label: 'LOSER' },
            ]}
          />
        </LOFIField>

        <LOFIField label="Slot" htmlFor="add-prog-slot">
          <LOFISelect
            id="add-prog-slot"
            value={toSlot}
            onChange={(v) => setToSlot(v as ProgressionSlot)}
            options={[
              { value: 'teamA', label: 'Team A (left)' },
              { value: 'teamB', label: 'Team B (right)' },
            ]}
          />
        </LOFIField>

        <LOFIField label="Destination" htmlFor="add-prog-dest-mode">
          <LOFISelect
            id="add-prog-dest-mode"
            value={toBracketMode}
            onChange={(v) => setToBracketMode(v as 'existing' | 'new')}
            options={[
              { value: 'new', label: 'Create new bracket' },
              { value: 'existing', label: 'Existing bracket' },
            ]}
          />
        </LOFIField>

        {toBracketMode === 'new' && (
          <LOFIField label="New bracket title" htmlFor="add-prog-new-title">
            <LOFIInput
              id="add-prog-new-title"
              type="text"
              placeholder="e.g. Semi-Finals"
              value={newBracketTitle}
              onChange={setNewBracketTitle}
            />
          </LOFIField>
        )}

        {toBracketMode === 'existing' && (
          <LOFIField label="To bracket" htmlFor="add-prog-to-b">
            <LOFISelect
              id="add-prog-to-b"
              value={toBracketId}
              onChange={setToBracketId}
              placeholder="— select —"
              options={existingDest.map((b) => ({ value: b.id, label: b.title }))}
            />
          </LOFIField>
        )}
      </div>

      <div className="prog-add-preview">
        <LOFIText as="span" variant="muted">
          {condition} of &ldquo;{previewMatchLabel}&rdquo; → {previewDest} ({toSlot === 'teamA' ? 'left slot' : 'right slot'})
        </LOFIText>
      </div>

      <div className="prog-add-actions">
        <LOFIButton type="submit" variant="primary" className="btn-save">Add Progression</LOFIButton>
        <LOFIButton type="button" variant="dismiss" className="btn-cancel" onClick={onCancel}>Cancel</LOFIButton>
      </div>
    </form>
  );
}

// ── Progression row summary ────────────────────────────────────────────────────

interface ProgressionRowProps {
  /** The progression to summarise in this row. Uses `rules[0]` for display. */
  prog: Progression;
  /** Full bracket list — used to resolve bracket titles from ids. */
  brackets: Bracket[];
  /**
   * Returns `true` when the bracket id matches the bracket currently being edited.
   * Determines whether the progression is labelled "outgoing" (↗ OUT) or "incoming" (↘ IN).
   */
  isSelf: (bracketId: string) => boolean;
  /** Called with the progression id after the user confirms removal. */
  onDelete: (id: string) => void;
}

function ProgressionRow({ prog, brackets, isSelf, onDelete }: ProgressionRowProps) {
  const [confirming, setConfirming] = useState(false);
  const rule = prog.rules[0];
  if (!rule) return null;

  const fromBracket = brackets.find((b) => b.id === rule.fromBracketId);
  const toBracket = brackets.find((b) => b.id === rule.toBracketId);
  const fromMatch = fromBracket?.matches.find((m) => m.id === rule.fromMatchId);
  const matchLabel = fromMatch
    ? `${fromMatch.teamA?.name ?? fromMatch.teamAPlaceholder ?? '???'} vs ${fromMatch.teamB?.name ?? fromMatch.teamBPlaceholder ?? '???'}`
    : rule.fromMatchId;

  const direction = isSelf(rule.fromBracketId) ? 'outgoing' : 'incoming';

  return (
    <div className={`prog-row prog-row--${direction}`}>
      <div className="prog-row-summary">
        <span className="prog-row-dir">{direction === 'outgoing' ? '↗ OUT' : '↘ IN'}</span>
        <span className="prog-row-text">
          <LOFIText as="strong" variant="inherit">{rule.condition}</LOFIText>
          <LOFIText as="span" variant="inherit"> of &ldquo;{matchLabel}&rdquo;{' '}</LOFIText>
          {direction === 'outgoing'
            ? (
              <LOFIText as="span" variant="inherit">
                → <em>{toBracket?.title ?? rule.toBracketId}</em> ({rule.toSlot})
              </LOFIText>
            )
            : (
              <LOFIText as="span" variant="inherit">
                from <em>{fromBracket?.title ?? rule.fromBracketId}</em>
              </LOFIText>
            )}
        </span>
      </div>
      {confirming ? (
        <div className="prog-row-confirm">
          <LOFIText as="span" variant="sm">Remove?</LOFIText>
          <LOFIButton type="button" variant="dismiss" size="compact" className="prog-row-btn prog-row-btn--danger" onClick={() => onDelete(prog.id)}>Yes</LOFIButton>
          <LOFIButton type="button" variant="default" size="compact" className="prog-row-btn" onClick={() => setConfirming(false)}>No</LOFIButton>
        </div>
      ) : (
        <LOFIButton type="button" variant="default" size="compact" className="prog-row-btn prog-row-btn--remove" onClick={() => setConfirming(true)}>
          Remove
        </LOFIButton>
      )}
    </div>
  );
}

// ── Main modal ────────────────────────────────────────────────────────────────

export function BracketEditModal({ bracket, onClose }: Props) {
  const updateBracket = useTournamentStore((s) => s.updateBracket);
  const addProgression = useTournamentStore((s) => s.addProgression);
  const deleteProgression = useTournamentStore((s) => s.deleteProgression);
  const tournament = useTournamentStore((s) => s.tournament);

  const [participants, setParticipants] = useState<Team[]>(bracket.participants ?? []);
  const [matches, setMatches] = useState<Match[]>(bracket.matches);
  const [newName, setNewName] = useState('');
  const [showAddProg, setShowAddProg] = useState(false);

  const relevantProgressions = tournament.progressions.filter(
    (p) => p.rules[0]?.fromBracketId === bracket.id || p.rules[0]?.toBracketId === bracket.id
  );

  const participantOptions  = participants.map((p) => ({ value: p.id, label: p.name }));
  const participantOptionsB = participants.map((p) => ({ value: p.id, label: p.name }));

  const addParticipant = () => {
    const name = newName.trim();
    if (!name) return;
    setParticipants((prev) => [...prev, { id: `team-${genId()}`, name }]);
    setNewName('');
  };

  const removeParticipant = (teamId: string) => {
    setParticipants((prev) => prev.filter((p) => p.id !== teamId));
    setMatches((prev) =>
      prev.map((m) => ({
        ...m,
        teamA: m.teamA?.id === teamId ? null : m.teamA,
        teamB: m.teamB?.id === teamId ? null : m.teamB,
      }))
    );
  };

  const addMatch = () => {
    setMatches((prev) => {
      const idx = prev.length;
      return [
        ...prev,
        {
          id: `match-${genId()}`,
          teamA: null,
          teamB: null,
          teamAPlaceholder: 'TBD',
          teamBPlaceholder: 'TBD',
          status: 'SCHEDULED' as const,
          displayId: generateMatchDisplayId(),
          shortLabel: shortLabelForMatch(bracket, idx),
        },
      ];
    });
  };

  const removeMatch = (matchId: string) => {
    setMatches((prev) => prev.filter((m) => m.id !== matchId));
  };

  const setMatchTeam = (matchId: string, slot: 'teamA' | 'teamB', teamId: string) => {
    setMatches((prev) =>
      prev.map((m) => {
        if (m.id !== matchId) return m;
        const team = participants.find((p) => p.id === teamId) ?? null;
        if (slot === 'teamA') {
          return { ...m, teamA: team, teamAPlaceholder: team ? undefined : 'TBD' };
        }
        return { ...m, teamB: team, teamBPlaceholder: team ? undefined : 'TBD' };
      })
    );
  };

  const setMatchBye = (matchId: string, isBye: boolean) => {
    setMatches((prev) =>
      prev.map((m) => {
        if (m.id !== matchId) return m;
        return {
          ...m,
          isBye,
          teamB: isBye ? null : m.teamB,
          teamBPlaceholder: isBye ? undefined : (m.teamB ? undefined : 'TBD'),
          status: isBye ? 'FINISHED' : 'SCHEDULED',
          winner: isBye && m.teamA ? m.teamA : undefined,
        };
      })
    );
  };

  const handleSave = () => {
    updateBracket(bracket.id, { participants, matches });
    onClose();
  };

  function handleAddProgression(rule: ProgressionRule, newBracketTitle?: string) {
    addProgression([rule], newBracketTitle);
    setShowAddProg(false);
  }

  return (
    <LOFIModal
      open
      onClose={onClose}
      title={`Edit — ${bracket.title}`}
      size="wide"
      footer={(
        <>
          <LOFIButton variant="dismiss" type="button" onClick={onClose}>Cancel</LOFIButton>
          <LOFIButton variant="primary" type="button" onClick={handleSave}>Save Changes</LOFIButton>
        </>
      )}
    >
      {/* Participants */}
      <section className="edit-section">
        <LOFIText as="div" variant="caps" className="edit-section-title">
          Participants ({participants.length})
        </LOFIText>
        {participants.length > 0 ? (
          <ol className="edit-list">
            {participants.map((p, i) => (
              <li key={p.id} className="edit-row">
                <span className="edit-row-num">{i + 1}.</span>
                <span className="edit-row-name">{p.name}</span>
                <LOFIButton
                  type="button"
                  variant="dismiss"
                  size="compact"
                  className="edit-remove-btn"
                  onClick={() => removeParticipant(p.id)}
                  title="Remove participant"
                >
                  ✕
                </LOFIButton>
              </li>
            ))}
          </ol>
        ) : (
          <LOFIText as="p" variant="muted" className="edit-empty">No participants yet.</LOFIText>
        )}
        <div className="edit-add-row">
          <LOFIInput
            type="text"
            className="edit-input"
            placeholder="Team / participant name…"
            value={newName}
            onChange={setNewName}
            onKeyDown={(e) => { if (e.key === 'Enter') addParticipant(); }}
          />
          <LOFIButton type="button" variant="primary" className="btn-save" onClick={addParticipant}>Add</LOFIButton>
        </div>
      </section>

      {/* Matches */}
      <section className="edit-section">
        <LOFIText as="div" variant="caps" className="edit-section-title">
          Matches ({matches.length})
        </LOFIText>
        {matches.length > 0 ? (
          <div className="edit-matches">
            {matches.map((m, i) => (
              <div key={m.id} className="edit-match-card">
                <div className="edit-match-header">
                  <span className="edit-match-num">Match {i + 1}</span>
                  <LOFIButton
                    type="button"
                    variant="dismiss"
                    size="compact"
                    className="edit-remove-btn"
                    onClick={() => removeMatch(m.id)}
                    title="Remove match"
                  >
                    ✕
                  </LOFIButton>
                </div>
                <div className="edit-match-body">
                  <LOFISelect
                    className="edit-select"
                    value={m.teamA?.id ?? ''}
                    onChange={(v) => setMatchTeam(m.id, 'teamA', v)}
                    placeholder="— Team A (TBD) —"
                    options={participantOptions}
                  />
                  <span className="edit-vs">vs</span>
                  {m.isBye ? (
                    <span className="edit-bye-chip">BYE</span>
                  ) : (
                    <LOFISelect
                      className="edit-select"
                      value={m.teamB?.id ?? ''}
                      onChange={(v) => setMatchTeam(m.id, 'teamB', v)}
                      placeholder="— Team B (TBD) —"
                      options={participantOptionsB}
                    />
                  )}
                </div>
                <div className="edit-match-footer">
                  <LOFICheckbox
                    id={`bye-${m.id}`}
                    checked={!!m.isBye}
                    onChange={(c) => setMatchBye(m.id, c)}
                    label="BYE — auto-advance Team A"
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <LOFIText as="p" variant="muted" className="edit-empty">No matches yet.</LOFIText>
        )}
        <LOFIButton type="button" variant="default" className="edit-add-match-btn" onClick={addMatch}>
          + Add Match
        </LOFIButton>
      </section>

      {/* Progressions */}
      <section className="edit-section">
        <div className="edit-section-title-row">
          <LOFIText as="span" variant="caps" className="edit-section-title">Progressions ({relevantProgressions.length})</LOFIText>
          {!showAddProg && (
            <LOFIButton type="button" variant="default" className="edit-prog-add-btn" onClick={() => setShowAddProg(true)}>
              + Add Progression
            </LOFIButton>
          )}
        </div>

        {relevantProgressions.length === 0 && !showAddProg && (
          <LOFIText as="p" variant="muted" className="edit-empty">No progressions linked to this bracket yet.</LOFIText>
        )}

        {relevantProgressions.map((p) => (
          <ProgressionRow
            key={p.id}
            prog={p}
            brackets={tournament.brackets}
            isSelf={(bid) => bid === bracket.id}
            onDelete={deleteProgression}
          />
        ))}

        {showAddProg && (
          <AddProgressionForm
            fromBracket={bracket}
            allBrackets={tournament.brackets}
            onAdd={handleAddProgression}
            onCancel={() => setShowAddProg(false)}
          />
        )}
      </section>
    </LOFIModal>
  );
}
