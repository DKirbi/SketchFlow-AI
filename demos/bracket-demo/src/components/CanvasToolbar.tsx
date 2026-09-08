import { LOFIToolbar, LOFIText, LOFIButton, LOFITabs, LOFIBadge } from 'lofi-kit';
import { ScenarioToggle } from './ScenarioToggle';
import { useTeamStore } from './TeamManagement/useTeamStore';
import type { Scenario } from '../store/useTournamentStore';
import type { Tournament } from '../types';

interface CanvasToolbarProps {
  /** The active tournament — sport, name, and season are shown in the centre. */
  tournament: Tournament;
  /** Currently active scenario (Placeholders or Finished). */
  scenario: Scenario;
  /** Called when the user switches scenario via the toggle. */
  onScenarioChange: (s: Scenario) => void;
  /** Called when the user clicks "+ Add Progression". */
  onAddProgression: () => void;
  /**
   * When provided, "Structure setup" renders as a clickable tab that navigates
   * back to step 1. Omit (or pass undefined) to disable that tab.
   */
  onBackToStructure?: () => void;
}

/**
 * Top header for the bracket canvas (step 2). Shows tournament identity and
 * actions on the first row; view-navigation tabs on the second row.
 */
export function CanvasToolbar({
  tournament,
  scenario,
  onScenarioChange,
  onAddProgression,
  onBackToStructure,
}: CanvasToolbarProps) {
  const currentUser = useTeamStore((s) => s.currentUser);
  const cycleRole = useTeamStore((s) => s.cycleRole);

  return (
    <div className="canvas-header">
      <LOFIToolbar
        className="canvas-toolbar"
        left={(
          <span className="tool-identity">
            <LOFIText variant="sm">{currentUser.handle}</LOFIText>
            <LOFIBadge
              variant="tag"
              label={currentUser.role}
              onClick={cycleRole}
              title="Prototype role — click to switch"
            />
          </span>
        )}
        center={(
          <div className="toolbar-left">
            <LOFIText as="span" variant="caps" className="tournament-sport">{tournament.sport}</LOFIText>
            <LOFIText as="h1" variant="body" className="tournament-name">{tournament.name}</LOFIText>
            {tournament.season && (
              <LOFIText as="span" variant="inherit" className="tournament-season">Season {tournament.season}</LOFIText>
            )}
          </div>
        )}
        right={(
          <>
            <ScenarioToggle value={scenario} onChange={onScenarioChange} />
            <LOFIButton type="button" className="btn-add-progression" onClick={onAddProgression}>
              + Add Progression
            </LOFIButton>
          </>
        )}
      />
      <div className="canvas-nav-tabs">
        <LOFITabs
          value="bracket"
          onChange={(v) => { if (v === 'setup') onBackToStructure?.(); }}
          tabs={[
            { value: 'setup',   label: 'Structure setup', disabled: !onBackToStructure },
            { value: 'bracket', label: 'Bracket view' },
          ]}
          ariaLabel="App navigation"
        />
      </div>
    </div>
  );
}
