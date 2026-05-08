import { useState } from 'react';
import {
  LOFIModal,
  LOFIButton,
  LOFIText,
  LOFIFieldset,
  LOFIField,
  LOFISelect,
  LOFIRadio,
  LOFIInput,
} from 'lofi-kit';
import { useTournamentStore } from '../store/useTournamentStore';
import type { ProgressionCondition, ProgressionRule, ProgressionSlot, ProgressionTrigger } from '../types';

interface Props {
  /**
   * Called when the modal should close — either after a successful submission
   * or when the user cancels (✕ button or backdrop click).
   */
  onClose: () => void;
}

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

const TRIGGER_OPTIONS = [{ value: 'AFTER_MATCH_END', label: 'AFTER_MATCH_END' }] as const;
const CONDITION_OPTIONS = [
  { value: 'WINNER', label: 'WINNER — advance the winner' },
  { value: 'LOSER', label: 'LOSER — advance the loser' },
] as const;
const SLOT_OPTIONS = [
  { value: 'teamA', label: 'Team A (left side of match)' },
  { value: 'teamB', label: 'Team B (right side of match)' },
] as const;

export function ProgressionModal({ onClose }: Props) {
  const tournament = useTournamentStore((s) => s.tournament);
  const addProgression = useTournamentStore((s) => s.addProgression);

  const brackets = tournament.brackets;

  const [fromBracketId, setFromBracketId] = useState(brackets[0]?.id ?? '');
  const [fromMatchId, setFromMatchId] = useState(brackets[0]?.matches[0]?.id ?? '');
  const [trigger, setTrigger] = useState<ProgressionTrigger>('AFTER_MATCH_END');
  const [condition, setCondition] = useState<ProgressionCondition>('WINNER');
  const [toBracketMode, setToBracketMode] = useState<'existing' | 'new'>('new');
  const [toBracketId, setToBracketId] = useState('');
  const [newBracketTitle, setNewBracketTitle] = useState('');
  const [toSlot, setToSlot] = useState<ProgressionSlot>('teamA');

  const fromBracket = brackets.find((b) => b.id === fromBracketId);
  const fromMatches = fromBracket?.matches ?? [];

  const existingBracketsForDest = brackets.filter((b) => b.id !== fromBracketId);

  const destBracket = brackets.find((b) => b.id === toBracketId);

  const bracketSelectOptions = brackets.map((b) => ({ value: b.id, label: b.title }));

  const fromMatchOptions = fromMatches.length === 0
    ? [{ value: '', label: 'No matches in this bracket', disabled: true }]
    : fromMatches.map((m) => {
        const nameA = m.teamA?.name ?? m.teamAPlaceholder ?? '???';
        const nameB = m.teamB?.name ?? m.teamBPlaceholder ?? '???';
        return { value: m.id, label: `${nameA} vs ${nameB}` };
      });

  const destBracketOptions = existingBracketsForDest.map((b) => ({ value: b.id, label: b.title }));

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!fromBracketId || !fromMatchId) return;

    const destBracketId =
      toBracketMode === 'new' ? `bracket-new-${uid()}` : toBracketId;

    const destMatchId =
      toBracketMode === 'new'
        ? `match-${uid()}`
        : destBracket?.matches[0]?.id ?? `match-${uid()}`;

    const rule: ProgressionRule = {
      fromBracketId,
      fromMatchId,
      toBracketId: destBracketId,
      toMatchId: destMatchId,
      toSlot,
      trigger,
      condition,
    };

    addProgression([rule], toBracketMode === 'new' ? newBracketTitle || 'Finals' : undefined);
    onClose();
  }

  return (
    <LOFIModal
      open
      onClose={onClose}
      title="Add Progression"
      description="Define how a team moves from one bracket to another after a match result."
      size="wide"
      footer={(
        <>
          <LOFIButton variant="dismiss" type="button" onClick={onClose}>Cancel</LOFIButton>
          <LOFIButton variant="primary" type="submit" form="progression-form">Create Progression</LOFIButton>
        </>
      )}
    >
      <form id="progression-form" onSubmit={handleSubmit} className="modal-form">
        <LOFIFieldset legend="Source">
          <LOFIField label="From Bracket" htmlFor="prog-from-bracket">
            <LOFISelect
              id="prog-from-bracket"
              value={fromBracketId}
              onChange={(v) => {
                setFromBracketId(v);
                const b = brackets.find((br) => br.id === v);
                setFromMatchId(b?.matches[0]?.id ?? '');
              }}
              options={bracketSelectOptions}
            />
          </LOFIField>

          <LOFIField label="From Match" htmlFor="prog-from-match">
            <LOFISelect
              id="prog-from-match"
              value={fromMatchId}
              onChange={setFromMatchId}
              options={fromMatchOptions}
            />
          </LOFIField>
        </LOFIFieldset>

        <LOFIFieldset legend="Progression Rules">
          <LOFIField label="Trigger" htmlFor="prog-trigger">
            <LOFISelect
              id="prog-trigger"
              value={trigger}
              onChange={(v) => setTrigger(v as ProgressionTrigger)}
              options={[...TRIGGER_OPTIONS]}
            />
          </LOFIField>

          <LOFIField label="Condition" htmlFor="prog-condition">
            <LOFISelect
              id="prog-condition"
              value={condition}
              onChange={(v) => setCondition(v as ProgressionCondition)}
              options={[...CONDITION_OPTIONS]}
            />
          </LOFIField>

          <LOFIField label="Slot" htmlFor="prog-slot">
            <LOFISelect
              id="prog-slot"
              value={toSlot}
              onChange={(v) => setToSlot(v as ProgressionSlot)}
              options={[...SLOT_OPTIONS]}
            />
          </LOFIField>
        </LOFIFieldset>

        <LOFIFieldset legend="Destination Bracket">
          <LOFIRadio
            name="toBracketMode"
            value={toBracketMode}
            onChange={(v) => setToBracketMode(v as 'existing' | 'new')}
            options={[
              { value: 'new', label: 'Create new bracket' },
              { value: 'existing', label: 'Use existing bracket' },
            ]}
            layout="column"
          />

          {toBracketMode === 'new' && (
            <LOFIField label="New Bracket Title" htmlFor="prog-new-title">
              <LOFIInput
                id="prog-new-title"
                type="text"
                placeholder="e.g. Finals, Semi-Finals..."
                value={newBracketTitle}
                onChange={setNewBracketTitle}
              />
            </LOFIField>
          )}

          {toBracketMode === 'existing' && (
            <LOFIField label="To Bracket" htmlFor="prog-to-bracket">
              <LOFISelect
                id="prog-to-bracket"
                value={toBracketId}
                onChange={setToBracketId}
                placeholder="— select —"
                options={destBracketOptions}
              />
            </LOFIField>
          )}
        </LOFIFieldset>

        <div className="modal-preview">
          <LOFIText as="strong" variant="secondary">Preview:</LOFIText>
          <LOFIText as="span" variant="muted" className="preview-text">
            {condition} of &ldquo;{fromMatches.find((m) => m.id === fromMatchId)
              ? (() => {
                  const m = fromMatches.find((m) => m.id === fromMatchId)!;
                  return `${m.teamA?.name ?? m.teamAPlaceholder ?? '???'} vs ${m.teamB?.name ?? m.teamBPlaceholder ?? '???'}`;
                })()
              : '...'}
            &rdquo; → {toBracketMode === 'new' ? (newBracketTitle || 'New Bracket') : (brackets.find((b) => b.id === toBracketId)?.title ?? '...')} ({toSlot === 'teamA' ? 'left slot' : 'right slot'})
          </LOFIText>
        </div>
      </form>
    </LOFIModal>
  );
}
