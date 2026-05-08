import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CanvasToolbar } from '../CanvasToolbar';
import type { Tournament } from '../../types';

vi.mock('../ScenarioToggle', () => ({
  ScenarioToggle: ({ value, onChange }: { value: string; onChange: (s: string) => void }) => (
    <div data-testid="scenario-toggle" data-value={value}>
      <button onClick={() => onChange('placeholders')}>Placeholders</button>
      <button onClick={() => onChange('finished')}>Finished</button>
    </div>
  ),
}));

function makeTournament(overrides: Partial<Tournament> = {}): Tournament {
  return {
    id: 't1',
    sport: 'Football',
    name: 'Champions League',
    brackets: [],
    progressions: [],
    ...overrides,
  };
}

describe('CanvasToolbar — tournament identity', () => {
  it('renders the sport', () => {
    render(
      <CanvasToolbar
        tournament={makeTournament()}
        scenario="placeholders"
        onScenarioChange={vi.fn()}
        onAddProgression={vi.fn()}
      />
    );
    expect(screen.getByText('Football')).toBeInTheDocument();
  });

  it('renders the tournament name', () => {
    render(
      <CanvasToolbar
        tournament={makeTournament()}
        scenario="placeholders"
        onScenarioChange={vi.fn()}
        onAddProgression={vi.fn()}
      />
    );
    expect(screen.getByText('Champions League')).toBeInTheDocument();
  });

  it('renders the season when provided', () => {
    render(
      <CanvasToolbar
        tournament={makeTournament({ season: '2025/26' })}
        scenario="placeholders"
        onScenarioChange={vi.fn()}
        onAddProgression={vi.fn()}
      />
    );
    expect(screen.getByText('Season 2025/26')).toBeInTheDocument();
  });

  it('does not render a season element when season is omitted', () => {
    render(
      <CanvasToolbar
        tournament={makeTournament()}
        scenario="placeholders"
        onScenarioChange={vi.fn()}
        onAddProgression={vi.fn()}
      />
    );
    expect(screen.queryByText(/Season/)).not.toBeInTheDocument();
  });
});

describe('CanvasToolbar — tab navigation', () => {
  it('renders "Structure setup" as a clickable tab when onBackToStructure is provided', () => {
    render(
      <CanvasToolbar
        tournament={makeTournament()}
        scenario="placeholders"
        onScenarioChange={vi.fn()}
        onAddProgression={vi.fn()}
        onBackToStructure={vi.fn()}
      />
    );
    const tab = screen.getByRole('tab', { name: 'Structure setup' });
    expect(tab).toBeInTheDocument();
    expect(tab).not.toBeDisabled();
  });

  it('renders "Structure setup" as a disabled tab when onBackToStructure is omitted', () => {
    render(
      <CanvasToolbar
        tournament={makeTournament()}
        scenario="placeholders"
        onScenarioChange={vi.fn()}
        onAddProgression={vi.fn()}
      />
    );
    expect(screen.getByRole('tab', { name: 'Structure setup' })).toBeDisabled();
  });

  it('calls onBackToStructure when the Structure setup tab is clicked', async () => {
    const onBackToStructure = vi.fn();
    const user = userEvent.setup();
    render(
      <CanvasToolbar
        tournament={makeTournament()}
        scenario="placeholders"
        onScenarioChange={vi.fn()}
        onAddProgression={vi.fn()}
        onBackToStructure={onBackToStructure}
      />
    );
    await user.click(screen.getByRole('tab', { name: 'Structure setup' }));
    expect(onBackToStructure).toHaveBeenCalledOnce();
  });

  it('shows "Bracket view" as the active tab', () => {
    render(
      <CanvasToolbar
        tournament={makeTournament()}
        scenario="placeholders"
        onScenarioChange={vi.fn()}
        onAddProgression={vi.fn()}
      />
    );
    expect(screen.getByRole('tab', { name: 'Bracket view' })).toHaveAttribute('aria-selected', 'true');
  });
});

describe('CanvasToolbar — actions', () => {
  it('calls onAddProgression when "+ Add Progression" is clicked', async () => {
    const onAddProgression = vi.fn();
    const user = userEvent.setup();
    render(
      <CanvasToolbar
        tournament={makeTournament()}
        scenario="placeholders"
        onScenarioChange={vi.fn()}
        onAddProgression={onAddProgression}
      />
    );
    await user.click(screen.getByRole('button', { name: /Add Progression/i }));
    expect(onAddProgression).toHaveBeenCalledOnce();
  });

  it('forwards the scenario value to ScenarioToggle', () => {
    render(
      <CanvasToolbar
        tournament={makeTournament()}
        scenario="finished"
        onScenarioChange={vi.fn()}
        onAddProgression={vi.fn()}
      />
    );
    expect(screen.getByTestId('scenario-toggle')).toHaveAttribute('data-value', 'finished');
  });

  it('calls onScenarioChange when the ScenarioToggle fires', async () => {
    const onScenarioChange = vi.fn();
    const user = userEvent.setup();
    render(
      <CanvasToolbar
        tournament={makeTournament()}
        scenario="placeholders"
        onScenarioChange={onScenarioChange}
        onAddProgression={vi.fn()}
      />
    );
    await user.click(screen.getByRole('button', { name: 'Finished' }));
    expect(onScenarioChange).toHaveBeenCalledWith('finished');
  });
});
