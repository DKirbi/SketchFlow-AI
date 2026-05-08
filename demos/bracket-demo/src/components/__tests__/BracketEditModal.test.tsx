import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BracketEditModal } from '../BracketEditModal';
import { useTournamentStore } from '../../store/useTournamentStore';
import type { Bracket, Tournament } from '../../types';

vi.mock('../../store/useTournamentStore', () => ({
  useTournamentStore: vi.fn(),
}));

vi.mock('../../lib/matchDisplay', () => ({
  generateMatchDisplayId: () => 'ID000',
  shortLabelForMatch: () => 'M1',
}));

const mockUpdateBracket = vi.fn();
const mockAddProgression = vi.fn();
const mockDeleteProgression = vi.fn();

function makeTournament(brackets: Bracket[] = []): Tournament {
  return {
    id: 't1',
    sport: 'Football',
    name: 'Test Cup',
    brackets,
    progressions: [],
  };
}

function makeBracket(overrides: Partial<Bracket> = {}): Bracket {
  return {
    id: 'b1',
    title: 'Group A',
    round: 1,
    position: { x: 0, y: 0 },
    matches: [],
    participants: [],
    ...overrides,
  };
}

function setupStoreMock(bracket: Bracket) {
  vi.mocked(useTournamentStore).mockImplementation(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (selector: (s: any) => any) =>
      selector({
        updateBracket: mockUpdateBracket,
        addProgression: mockAddProgression,
        deleteProgression: mockDeleteProgression,
        tournament: makeTournament([bracket]),
      })
  );
}

beforeEach(() => {
  vi.clearAllMocks();
});

// ── Rendering ──────────────────────────────────────────────────────────────────

describe('BracketEditModal — rendering', () => {
  it('shows the bracket title in the modal header', () => {
    const bracket = makeBracket({ title: 'Quarter Finals' });
    setupStoreMock(bracket);
    render(<BracketEditModal bracket={bracket} onClose={vi.fn()} />);
    expect(screen.getByText(/Quarter Finals/)).toBeInTheDocument();
  });

  it('shows "No participants yet." when the bracket has no participants', () => {
    const bracket = makeBracket();
    setupStoreMock(bracket);
    render(<BracketEditModal bracket={bracket} onClose={vi.fn()} />);
    expect(screen.getByText('No participants yet.')).toBeInTheDocument();
  });

  it('lists existing participants', () => {
    const bracket = makeBracket({
      participants: [
        { id: 'p1', name: 'Team Alpha' },
        { id: 'p2', name: 'Team Beta' },
      ],
    });
    setupStoreMock(bracket);
    render(<BracketEditModal bracket={bracket} onClose={vi.fn()} />);
    expect(screen.getByText('Team Alpha')).toBeInTheDocument();
    expect(screen.getByText('Team Beta')).toBeInTheDocument();
  });

  it('shows "No matches yet." when the bracket has no matches', () => {
    const bracket = makeBracket();
    setupStoreMock(bracket);
    render(<BracketEditModal bracket={bracket} onClose={vi.fn()} />);
    expect(screen.getByText('No matches yet.')).toBeInTheDocument();
  });

  it('shows the match count in the section title', () => {
    const bracket = makeBracket({
      matches: [
        {
          id: 'm1',
          teamA: { id: 'p1', name: 'Alpha' },
          teamB: { id: 'p2', name: 'Beta' },
          status: 'SCHEDULED',
        },
      ],
    });
    setupStoreMock(bracket);
    render(<BracketEditModal bracket={bracket} onClose={vi.fn()} />);
    expect(screen.getByText(/Matches \(1\)/)).toBeInTheDocument();
  });
});

// ── Close behaviour ────────────────────────────────────────────────────────────

describe('BracketEditModal — close behaviour', () => {
  it('calls onClose when the close button is clicked', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    const bracket = makeBracket();
    setupStoreMock(bracket);
    render(<BracketEditModal bracket={bracket} onClose={onClose} />);
    await user.click(screen.getByRole('button', { name: 'Close' }));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('calls onClose when clicking the modal backdrop', async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 });
    const onClose = vi.fn();
    const bracket = makeBracket();
    setupStoreMock(bracket);
    render(<BracketEditModal bracket={bracket} onClose={onClose} />);
    // Radix renders the overlay into a portal on document.body, outside the render container.
    await user.click(document.querySelector('.modal-overlay')!);
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('calls onClose when the Cancel button is clicked', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    const bracket = makeBracket();
    setupStoreMock(bracket);
    render(<BracketEditModal bracket={bracket} onClose={onClose} />);
    const buttons = screen.getAllByRole('button', { name: 'Cancel' });
    await user.click(buttons[0]);
    expect(onClose).toHaveBeenCalledOnce();
  });
});

// ── Participants ───────────────────────────────────────────────────────────────

describe('BracketEditModal — participants', () => {
  it('adds a new participant after typing a name and clicking Add', async () => {
    const user = userEvent.setup();
    const bracket = makeBracket();
    setupStoreMock(bracket);
    render(<BracketEditModal bracket={bracket} onClose={vi.fn()} />);
    await user.type(screen.getByPlaceholderText(/Team \/ participant name/i), 'Phoenix FC');
    await user.click(screen.getByRole('button', { name: 'Add' }));
    expect(screen.getByText('Phoenix FC')).toBeInTheDocument();
  });

  it('adds a new participant when Enter is pressed in the input', async () => {
    const user = userEvent.setup();
    const bracket = makeBracket();
    setupStoreMock(bracket);
    render(<BracketEditModal bracket={bracket} onClose={vi.fn()} />);
    await user.type(screen.getByPlaceholderText(/Team \/ participant name/i), 'Phoenix FC{Enter}');
    expect(screen.getByText('Phoenix FC')).toBeInTheDocument();
  });

  it('does not add a participant when the input is blank', async () => {
    const user = userEvent.setup();
    const bracket = makeBracket();
    setupStoreMock(bracket);
    render(<BracketEditModal bracket={bracket} onClose={vi.fn()} />);
    await user.click(screen.getByRole('button', { name: 'Add' }));
    expect(screen.getByText('No participants yet.')).toBeInTheDocument();
  });

  it('removes a participant when its ✕ button is clicked', async () => {
    const user = userEvent.setup();
    const bracket = makeBracket({
      participants: [{ id: 'p1', name: 'Team Alpha' }],
    });
    setupStoreMock(bracket);
    render(<BracketEditModal bracket={bracket} onClose={vi.fn()} />);
    expect(screen.getByText('Team Alpha')).toBeInTheDocument();

    const participantRow = screen.getByText('Team Alpha').closest('li')!;
    const removeBtn = within(participantRow).getByTitle('Remove participant');
    await user.click(removeBtn);
    expect(screen.queryByText('Team Alpha')).not.toBeInTheDocument();
  });
});

// ── Matches ────────────────────────────────────────────────────────────────────

describe('BracketEditModal — matches', () => {
  it('adds a new match when "+ Add Match" is clicked', async () => {
    const user = userEvent.setup();
    const bracket = makeBracket();
    setupStoreMock(bracket);
    render(<BracketEditModal bracket={bracket} onClose={vi.fn()} />);
    await user.click(screen.getByRole('button', { name: '+ Add Match' }));
    expect(screen.getByText(/Matches \(1\)/)).toBeInTheDocument();
    expect(screen.getByText('Match 1')).toBeInTheDocument();
  });

  it('removes a match when its ✕ button is clicked', async () => {
    const user = userEvent.setup();
    const bracket = makeBracket({
      matches: [
        { id: 'm1', teamA: null, teamB: null, status: 'SCHEDULED' },
      ],
    });
    setupStoreMock(bracket);
    render(<BracketEditModal bracket={bracket} onClose={vi.fn()} />);
    const matchCard = screen.getByText('Match 1').closest('.edit-match-card') as HTMLElement;
    const removeBtn = within(matchCard).getByTitle('Remove match');
    await user.click(removeBtn);
    expect(screen.getByText('No matches yet.')).toBeInTheDocument();
  });
});

// ── Save ───────────────────────────────────────────────────────────────────────

describe('BracketEditModal — save', () => {
  it('calls updateBracket with the bracket id on save', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    const bracket = makeBracket();
    setupStoreMock(bracket);
    render(<BracketEditModal bracket={bracket} onClose={onClose} />);
    await user.click(screen.getByRole('button', { name: 'Save Changes' }));
    expect(mockUpdateBracket).toHaveBeenCalledOnce();
    expect(mockUpdateBracket).toHaveBeenCalledWith('b1', expect.any(Object));
  });

  it('calls onClose after saving', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    const bracket = makeBracket();
    setupStoreMock(bracket);
    render(<BracketEditModal bracket={bracket} onClose={onClose} />);
    await user.click(screen.getByRole('button', { name: 'Save Changes' }));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('persists added participants in the updateBracket payload', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    const bracket = makeBracket();
    setupStoreMock(bracket);
    render(<BracketEditModal bracket={bracket} onClose={onClose} />);
    await user.type(screen.getByPlaceholderText(/Team \/ participant name/i), 'Phoenix FC');
    await user.click(screen.getByRole('button', { name: 'Add' }));
    await user.click(screen.getByRole('button', { name: 'Save Changes' }));
    const [, payload] = mockUpdateBracket.mock.calls[0];
    expect(payload.participants).toHaveLength(1);
    expect(payload.participants[0].name).toBe('Phoenix FC');
  });
});
