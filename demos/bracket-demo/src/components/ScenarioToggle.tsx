import { LOFIToggle } from 'lofi-kit';
import type { Scenario } from '../store/useTournamentStore';

interface ScenarioToggleProps {
  /** Currently active scenario shown in the bracket canvas. */
  value: Scenario;
  /**
   * Called when the user clicks the inactive scenario button.
   * The store resets the full tournament data to the corresponding mock dataset,
   * so any session edits are discarded when the scenario changes.
   */
  onChange: (s: Scenario) => void;
}

const SCENARIOS: { value: Scenario; label: string }[] = [
  { value: 'placeholders', label: 'Placeholders' },
  { value: 'finished', label: 'Finished' },
];

/**
 * Toggle between the "Placeholders" (upcoming) and "Finished" scenario views
 * in the bracket canvas toolbar.
 */
export function ScenarioToggle({ value, onChange }: ScenarioToggleProps) {
  return (
    <LOFIToggle
      value={value}
      onChange={(v) => onChange(v as Scenario)}
      options={SCENARIOS.map((s) => ({ value: s.value, label: s.label }))}
      ariaLabel="Scenario"
    />
  );
}
