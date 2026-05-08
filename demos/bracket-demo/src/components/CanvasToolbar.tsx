import { LOFIToolbar, LOFIText, LOFIButton, LOFITabs } from 'lofi-kit';
import { ScenarioToggle } from './ScenarioToggle';
import type { Scenario } from '../store/useTournamentStore';
import type { Tournament } from '../types';

interface CanvasToolbarProps {
  /** The active tournament — sport, name, and season are shown on the left. */
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
  return (
    <div className="canvas-header">
      <LOFIToolbar
        className="canvas-toolbar"
        left={(
          <div className="toolbar-left">
            <span className="tournament-sport">{tournament.sport}</span>
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
