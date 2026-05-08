import { useLayoutEffect, useRef, useState } from 'react';
import { useTournamentStore } from '../store/useTournamentStore';
import type {
  Progression,
  ProgressionRule,
  ProgressionCondition,
  ProgressionTrigger,
  Tournament,
} from '../types';

interface Props {
  /** The progression whose rules are being edited. Local state is seeded from this. */
  progression: Progression;
  /** Map of bracketId → display title for all bracket selects. */
  bracketTitles: Record<string, string>;
  /** Called when the user closes the modal without saving (✕, Cancel, or backdrop). */
  onClose: () => void;
  /**
   * Called when the user confirms deletion of the entire progression.
   * The caller is responsible for dispatching `deleteProgression` to the store
   * and closing the modal.
   */
  onDelete: () => void;
}

function createDefaultRule(tournament: Tournament): ProgressionRule {
  const b0 = tournament.brackets[0];
  const b1 = tournament.brackets[1] ?? b0;
  const fromM = b0?.matches[0];
  const toM = b1?.matches[0];
  return {
    fromBracketId: b0?.id ?? '',
    fromMatchId: fromM?.id ?? '',
    toBracketId: b1?.id ?? b0?.id ?? '',
    toMatchId: toM?.id ?? fromM?.id ?? '',
    toSlot: 'teamA',
    trigger: 'AFTER_MATCH_END',
    condition: 'WINNER',
  };
}

export function EdgeContextMenu({ progression, bracketTitles, onClose, onDelete }: Props) {
  const editProgression = useTournamentStore((s) => s.editProgression);
  const tournament = useTournamentStore((s) => s.tournament);

  const [rules, setRules] = useState<ProgressionRule[]>(() =>
    progression.rules.map((r) => ({ ...r }))
  );
  /** `null` = list all rules; number = wizard focused on that rule index */
  const [focusedRuleIndex, setFocusedRuleIndex] = useState<number | null>(null);
  const focusRuleAfterAddRef = useRef<number | null>(null);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  useLayoutEffect(() => {
    const idx = focusRuleAfterAddRef.current;
    if (idx !== null) {
      focusRuleAfterAddRef.current = null;
      setFocusedRuleIndex(idx);
    }
  }, [rules]);

  function updateRule(idx: number, patch: Partial<ProgressionRule>) {
    setRules((prev) =>
      prev.map((r, i) => {
        if (i !== idx) return r;
        let next = { ...r, ...patch };
        if (patch.fromBracketId !== undefined && patch.fromBracketId !== r.fromBracketId) {
          const b = tournament.brackets.find((x) => x.id === patch.fromBracketId);
          next = { ...next, fromMatchId: b?.matches[0]?.id ?? '' };
        }
        if (patch.toBracketId !== undefined && patch.toBracketId !== r.toBracketId) {
          const b = tournament.brackets.find((x) => x.id === patch.toBracketId);
          next = { ...next, toMatchId: b?.matches[0]?.id ?? '' };
        }
        return next;
      })
    );
  }

  function handleAddRule() {
    setRules((prev) => {
      focusRuleAfterAddRef.current = prev.length;
      return [...prev, createDefaultRule(tournament)];
    });
  }

  function removeRule(idx: number) {
    setRules((prev) => prev.filter((_, i) => i !== idx));
    setFocusedRuleIndex((f) => {
      if (f === null) return null;
      if (f === idx) return null;
      if (f > idx) return f - 1;
      return f;
    });
  }

  function handleSave() {
    editProgression(progression.id, rules);
    onClose();
  }

  const visibleIndices =
    focusedRuleIndex === null
      ? rules.map((_, i) => i)
      : focusedRuleIndex < rules.length
        ? [focusedRuleIndex]
        : [];

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <div className="modal-header">
        <h2>Edit Progression</h2>
        <button type="button" className="close-btn" onClick={onClose} aria-label="Close">
          ✕
        </button>
      </div>

      {focusedRuleIndex !== null && rules.length > 0 && focusedRuleIndex < rules.length && (
        <nav className="context-menu-breadcrumb" aria-label="Wizard steps">
          <button
            type="button"
            className="context-menu-crumb context-menu-crumb--link"
            onClick={() => setFocusedRuleIndex(null)}
          >
            Progression rules
          </button>
          <span className="context-menu-crumb-sep" aria-hidden>
            /
          </span>
          <span className="context-menu-crumb context-menu-crumb--current">New Progression Rule</span>
        </nav>
      )}

      <div className="progression-edit-body">
        {visibleIndices.map((idx) => {
          const rule = rules[idx]!;
          const fromBracket = tournament.brackets.find((b) => b.id === rule.fromBracketId);
          const sourceMatches = fromBracket?.matches ?? [];
          const toBracket = tournament.brackets.find((b) => b.id === rule.toBracketId);
          const destMatches = toBracket?.matches ?? [];

          return (
            <div key={`rule-${idx}-${rule.fromMatchId}-${rule.toMatchId}`} className="rule-block">
              <div className="rule-block-header">
                <div className="rule-number">Rule {idx + 1}</div>
                <button
                  type="button"
                  className="rule-remove-btn"
                  aria-label={`Remove rule ${idx + 1}`}
                  onClick={() => removeRule(idx)}
                  disabled={rules.length === 1}
                  title={rules.length === 1 ? 'Delete the progression to remove the last rule' : undefined}
                >
                  Remove
                </button>
              </div>

              <label className="rule-field">
                <span>From Bracket</span>
                <select
                  value={rule.fromBracketId}
                  onChange={(e) => updateRule(idx, { fromBracketId: e.target.value })}
                >
                  {tournament.brackets.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.title}
                    </option>
                  ))}
                </select>
              </label>

              <label className="rule-field">
                <span>From Match</span>
                <select
                  value={rule.fromMatchId}
                  onChange={(e) => updateRule(idx, { fromMatchId: e.target.value })}
                  disabled={sourceMatches.length === 0}
                >
                  {sourceMatches.length === 0 ? (
                    <option value="">No matches</option>
                  ) : (
                    sourceMatches.map((m) => {
                      const nameA = m.teamA?.name ?? m.teamAPlaceholder ?? '???';
                      const nameB = m.teamB?.name ?? m.teamBPlaceholder ?? '???';
                      return (
                        <option key={m.id} value={m.id}>
                          {nameA} vs {nameB}
                        </option>
                      );
                    })
                  )}
                </select>
              </label>

              <label className="rule-field">
                <span>Trigger</span>
                <select
                  value={rule.trigger}
                  onChange={(e) =>
                    updateRule(idx, { trigger: e.target.value as ProgressionTrigger })
                  }
                >
                  <option value="AFTER_MATCH_END">AFTER_MATCH_END</option>
                </select>
              </label>

              <label className="rule-field">
                <span>Condition</span>
                <select
                  value={rule.condition}
                  onChange={(e) =>
                    updateRule(idx, { condition: e.target.value as ProgressionCondition })
                  }
                >
                  <option value="WINNER">WINNER</option>
                  <option value="LOSER">LOSER</option>
                </select>
              </label>

              <label className="rule-field">
                <span>To Bracket</span>
                <select
                  value={rule.toBracketId}
                  onChange={(e) => updateRule(idx, { toBracketId: e.target.value })}
                >
                  {tournament.brackets.map((b) => (
                    <option key={b.id} value={b.id}>
                      {bracketTitles[b.id] ?? b.title}
                    </option>
                  ))}
                </select>
              </label>

              <label className="rule-field">
                <span>To Match</span>
                <select
                  value={rule.toMatchId}
                  onChange={(e) => updateRule(idx, { toMatchId: e.target.value })}
                  disabled={destMatches.length === 0}
                >
                  {destMatches.length === 0 ? (
                    <option value="">No matches</option>
                  ) : (
                    destMatches.map((m) => {
                      const nameA = m.teamA?.name ?? m.teamAPlaceholder ?? '???';
                      const nameB = m.teamB?.name ?? m.teamBPlaceholder ?? '???';
                      return (
                        <option key={m.id} value={m.id}>
                          {nameA} vs {nameB}
                        </option>
                      );
                    })
                  )}
                </select>
              </label>

              <label className="rule-field">
                <span>To Slot</span>
                <select
                  value={rule.toSlot}
                  onChange={(e) =>
                    updateRule(idx, { toSlot: e.target.value as 'teamA' | 'teamB' })
                  }
                >
                  <option value="teamA">Team A (left side)</option>
                  <option value="teamB">Team B (right side)</option>
                </select>
              </label>
            </div>
          );
        })}

        {focusedRuleIndex === null && (
          <button type="button" className="progression-add-rule-btn" onClick={handleAddRule}>
            + Add rule
          </button>
        )}
      </div>

      <div className="modal-actions">
        {confirmingDelete ? (
          <>
            <span className="modal-actions-confirm-text">Delete this progression?</span>
            <button type="button" className="btn-delete" onClick={onDelete}>
              Yes, delete
            </button>
            <button type="button" className="btn-cancel" onClick={() => setConfirmingDelete(false)}>
              No, cancel
            </button>
          </>
        ) : (
          <>
            <button type="button" className="btn-save" onClick={handleSave}>
              Save
            </button>
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button
              type="button"
              className="btn-delete modal-actions-delete"
              onClick={() => setConfirmingDelete(true)}
            >
              Delete progression
            </button>
          </>
        )}
      </div>
    </div>
  );
}
