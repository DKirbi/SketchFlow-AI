import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProgressionModal } from '../ProgressionModal';
import { useTournamentStore } from '../../store/useTournamentStore';
import type { Bracket, Tournament } from '../../types';

vi.mock('../../store/useTournamentStore', () => ({
  useTournamentStore: vi.fn(),
}));

const mockAddProgression = vi.fn();

function makeBracket(id: string, title: string): Bracket {
  return {
    id,
    title,
    round: 1,
    position: { x: 0, y: 0 },
    matches: [
      {
        id: `${id}-m1`,
        teamA: { id: 'ta', name: 'Team A' },
        teamB: { id: 'tb', name: 'Team B' },
        status: 'SCHEDULED',
      },
    ],
  };
}

function makeTournament(brackets: Bracket[]): Tournament {
  return {
    id: 't1',
    sport: 'Soccer',
    name: 'Test Cup',
    brackets,
    progressions: [],
  };
}

function setupStoreMock(tournament: Tournament) {
  vi.mocked(useTournamentStore).mockImplementation(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (selector: (s: any) => any) =>
      selector({ tournament, addProgression: mockAddProgression })
  );
}

beforeEach(() => {
  vi.clearAllMocks();
  setupStoreMock(makeTournament([makeBracket('b1', 'Group A'), makeBracket('b2', 'Finals')]));
});

// ── Rendering ──────────────────────────────────────────────────────────────────

describe('ProgressionModal — rendering', () => {
  it('renders the modal title "Add Progression"', () => {
    render(<ProgressionModal onClose={vi.fn()} />);
    expect(screen.getByText('Add Progression')).toBeInTheDocument();
  });

  it('renders the "Create Progression" submit button', () => {
    render(<ProgressionModal onClose={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'Create Progression' })).toBeInTheDocument();
  });

  it('renders source bracket options from the tournament', () => {
    render(<ProgressionModal onClose={vi.fn()} />);
    // Radix renders a native <select aria-hidden> for form purposes; use hidden:true to find its options.
    expect(screen.getByRole('option', { name: 'Group A', hidden: true })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Finals', hidden: true })).toBeInTheDocument();
  });

  it('renders the trigger select with AFTER_MATCH_END', () => {
    render(<ProgressionModal onClose={vi.fn()} />);
    expect(screen.getByRole('option', { name: 'AFTER_MATCH_END', hidden: true })).toBeInTheDocument();
  });

  it('renders condition options: WINNER and LOSER', () => {
    render(<ProgressionModal onClose={vi.fn()} />);
    // Radix renders both a visible trigger span and a hidden native option — use role query to be specific.
    expect(screen.getByRole('option', { name: /WINNER — advance the winner/, hidden: true })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /LOSER — advance the loser/, hidden: true })).toBeInTheDocument();
  });

  it('renders destination radio buttons', () => {
    render(<ProgressionModal onClose={vi.fn()} />);
    expect(screen.getByLabelText('Create new bracket')).toBeInTheDocument();
    expect(screen.getByLabelText('Use existing bracket')).toBeInTheDocument();
  });
});

// ── Close behaviour ────────────────────────────────────────────────────────────

describe('ProgressionModal — close behaviour', () => {
  it('calls onClose when the close button is clicked', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(<ProgressionModal onClose={onClose} />);
    await user.click(screen.getByRole('button', { name: 'Close' }));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('calls onClose when the Cancel button is clicked', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(<ProgressionModal onClose={onClose} />);
    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('calls onClose when clicking the backdrop overlay', async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 });
    const onClose = vi.fn();
    render(<ProgressionModal onClose={onClose} />);
    // Radix renders the overlay into a portal on document.body, outside the render container.
    await user.click(document.querySelector('.modal-overlay')!);
    expect(onClose).toHaveBeenCalled();
  });
});

// ── Destination mode switching ─────────────────────────────────────────────────

describe('ProgressionModal — destination mode', () => {
  it('shows the "New Bracket Title" input when "Create new bracket" is selected', () => {
    render(<ProgressionModal onClose={vi.fn()} />);
    // Default mode is "new"
    expect(screen.getByPlaceholderText(/e\.g\. Finals/)).toBeInTheDocument();
  });

  it('shows the bracket selector when "Use existing bracket" is selected', async () => {
    const user = userEvent.setup();
    render(<ProgressionModal onClose={vi.fn()} />);
    await user.click(screen.getByLabelText('Use existing bracket'));
    // "— select —" is now a placeholder, not an item; verify the To Bracket combobox appears instead.
    expect(screen.getByRole('combobox', { name: 'To Bracket' })).toBeInTheDocument();
  });

  it('hides the "New Bracket Title" input when switching to existing mode', async () => {
    const user = userEvent.setup();
    render(<ProgressionModal onClose={vi.fn()} />);
    await user.click(screen.getByLabelText('Use existing bracket'));
    expect(screen.queryByPlaceholderText(/e\.g\. Finals/)).not.toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: 'To Bracket' })).toBeInTheDocument();
  });
});

// ── Form submission ────────────────────────────────────────────────────────────

describe('ProgressionModal — form submission', () => {
  it('calls addProgression when the form is submitted', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(<ProgressionModal onClose={onClose} />);
    await user.click(screen.getByRole('button', { name: 'Create Progression' }));
    expect(mockAddProgression).toHaveBeenCalledOnce();
  });

  it('calls onClose after a successful submission', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(<ProgressionModal onClose={onClose} />);
    await user.click(screen.getByRole('button', { name: 'Create Progression' }));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('passes the new bracket title to addProgression when in new-bracket mode', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(<ProgressionModal onClose={onClose} />);
    await user.clear(screen.getByPlaceholderText(/e\.g\. Finals/));
    await user.type(screen.getByPlaceholderText(/e\.g\. Finals/), 'My New Bracket');
    await user.click(screen.getByRole('button', { name: 'Create Progression' }));
    expect(mockAddProgression).toHaveBeenCalledWith(
      expect.any(Array),
      'My New Bracket',
    );
  });

  it('uses "Finals" as default title when new bracket title input is left empty', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(<ProgressionModal onClose={onClose} />);
    // Leave new bracket title empty (default)
    await user.click(screen.getByRole('button', { name: 'Create Progression' }));
    expect(mockAddProgression).toHaveBeenCalledWith(expect.any(Array), 'Finals');
  });
});

// ── Preview text ───────────────────────────────────────────────────────────────

describe('ProgressionModal — preview', () => {
  it('renders a preview section with condition text', () => {
    render(<ProgressionModal onClose={vi.fn()} />);
    // The preview shows "WINNER of ..." by default
    const preview = document.querySelector('.modal-preview')!;
    expect(preview).toBeTruthy();
    expect(preview.textContent).toContain('WINNER');
  });
});
