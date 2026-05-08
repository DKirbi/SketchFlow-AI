import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MatchCard } from '../MatchCard';
import { useTournamentStore } from '../../store/useTournamentStore';
import type { Match } from '../../types';

vi.mock('../../store/useTournamentStore', () => ({
  useTournamentStore: vi.fn(),
}));
vi.mock('../../lib/matchDisplay', () => ({
  getMatchDisplayId: () => 'ID001',
}));

const mockAdvanceMatchStatus = vi.fn();
const mockSetWinner = vi.fn();

function setupStoreMock() {
  vi.mocked(useTournamentStore).mockImplementation(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (selector: (s: any) => any) =>
      selector({ advanceMatchStatus: mockAdvanceMatchStatus, setWinner: mockSetWinner })
  );
}

function makeMatch(overrides: Partial<Match> = {}): Match {
  return {
    id: 'match-1',
    teamA: { id: 'team-a', name: 'Team A' },
    teamB: { id: 'team-b', name: 'Team B' },
    status: 'SCHEDULED',
    ...overrides,
  };
}

beforeEach(() => {
  vi.clearAllMocks();
  setupStoreMock();
});

// ---------------------------------------------------------------------------
// STATUS_LABEL mapping
// ---------------------------------------------------------------------------

describe('STATUS_LABEL display', () => {
  it('shows UPCOMING for a SCHEDULED match', () => {
    render(<MatchCard bracketId="b1" match={makeMatch({ status: 'SCHEDULED' })} />);
    expect(screen.getByTitle('Click to advance status')).toHaveTextContent('UPCOMING');
  });

  it('shows LIVE for a LIVE match', () => {
    render(<MatchCard bracketId="b1" match={makeMatch({ status: 'LIVE' })} />);
    expect(screen.getByTitle('Click to advance status')).toHaveTextContent('LIVE');
  });

  it('shows COMPLETED for a FINISHED match', () => {
    render(<MatchCard bracketId="b1" match={makeMatch({ status: 'FINISHED' })} />);
    expect(screen.getByTitle('Click to advance status')).toHaveTextContent('COMPLETED');
  });

  it('does not render a status badge for a BYE match', () => {
    render(<MatchCard bracketId="b1" match={makeMatch({ isBye: true })} />);
    expect(screen.queryByTitle('Click to advance status')).not.toBeInTheDocument();
    expect(screen.getByText('BYE')).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Single-click behaviour
// ---------------------------------------------------------------------------

describe('status badge click', () => {
  it('calls advanceMatchStatus exactly once per click', async () => {
    const user = userEvent.setup();
    render(<MatchCard bracketId="b1" match={makeMatch()} />);
    await user.click(screen.getByTitle('Click to advance status'));
    expect(mockAdvanceMatchStatus).toHaveBeenCalledTimes(1);
    expect(mockAdvanceMatchStatus).toHaveBeenCalledWith('b1', 'match-1');
  });

  it('does not call advanceMatchStatus for BYE matches', async () => {
    render(<MatchCard bracketId="b1" match={makeMatch({ isBye: true })} />);
    expect(mockAdvanceMatchStatus).not.toHaveBeenCalled();
  });

  it('renders Date:/Time: labels in the when-bar when scheduledAt is set', () => {
    render(
      <MatchCard
        bracketId="b1"
        match={makeMatch({ scheduledAt: '2026-05-14T12:00:00Z' })}
      />
    );
    const when = document.querySelector('.match-card-b__when');
    expect(when).toBeTruthy();
    expect(when).toHaveTextContent('Date:');
    expect(when).toHaveTextContent('Time:');
    expect(when?.textContent).toMatch(/\d{4}\/\d{2}\/\d{2}/);
    expect(when?.textContent).toMatch(/\d{1,2}:\d{2}/);
  });

  it('renders venueName in the venue bar (separate from the when-bar)', () => {
    render(
      <MatchCard
        bracketId="b1"
        match={makeMatch({ venueName: 'Test Arena' })}
      />
    );
    const venue = document.querySelector('.match-card-b__venue');
    expect(venue).toBeTruthy();
    expect(venue).toHaveTextContent('Test Arena');
    expect(document.querySelector('.match-card-b__when')).not.toBeInTheDocument();
  });

  it('passes the correct bracketId and matchId', async () => {
    const user = userEvent.setup();
    render(<MatchCard bracketId="bracket-xyz" match={makeMatch({ id: 'match-abc' })} />);
    await user.click(screen.getByTitle('Click to advance status'));
    expect(mockAdvanceMatchStatus).toHaveBeenCalledWith('bracket-xyz', 'match-abc');
  });
});
