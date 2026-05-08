import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EdgeContextMenu } from '../EdgeContextMenu';
import { useTournamentStore } from '../../store/useTournamentStore';
import type { Bracket, Progression, Tournament } from '../../types';

vi.mock('../../store/useTournamentStore', () => ({
  useTournamentStore: vi.fn(),
}));

const mockEditProgression = vi.fn();

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

function makeProgression(fromBracketId: string, toBracketId: string): Progression {
  return {
    id: `prog-${fromBracketId}-${toBracketId}`,
    rules: [
      {
        fromBracketId,
        fromMatchId: `${fromBracketId}-m1`,
        toBracketId,
        toMatchId: `${toBracketId}-m1`,
        toSlot: 'teamA',
        trigger: 'AFTER_MATCH_END',
        condition: 'WINNER',
      },
    ],
  };
}

const b1 = makeBracket('b1', 'Group A');
const b2 = makeBracket('b2', 'Finals');
const defaultTournament = makeTournament([b1, b2]);
const defaultProgression = makeProgression('b1', 'b2');

function setupStoreMock(tournament: Tournament = defaultTournament) {
  vi.mocked(useTournamentStore).mockImplementation(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (selector: (s: any) => any) =>
      selector({ editProgression: mockEditProgression, tournament })
  );
}

beforeEach(() => {
  vi.clearAllMocks();
  setupStoreMock();
});

const bracketTitles = { b1: 'Group A', b2: 'Finals' };

// ── Rendering ──────────────────────────────────────────────────────────────────

describe('EdgeContextMenu — rendering', () => {
  it('renders "Edit Progression" as the modal title', () => {
    render(
      <EdgeContextMenu
        progression={defaultProgression}
        bracketTitles={bracketTitles}
        onClose={vi.fn()}
        onDelete={vi.fn()}
      />
    );
    expect(screen.getByText('Edit Progression')).toBeInTheDocument();
  });

  it('renders one rule block for a single-rule progression', () => {
    render(
      <EdgeContextMenu
        progression={defaultProgression}
        bracketTitles={bracketTitles}
        onClose={vi.fn()}
        onDelete={vi.fn()}
      />
    );
    expect(screen.getByText('Rule 1')).toBeInTheDocument();
  });

  it('renders Save, Cancel, and Delete progression buttons', () => {
    render(
      <EdgeContextMenu
        progression={defaultProgression}
        bracketTitles={bracketTitles}
        onClose={vi.fn()}
        onDelete={vi.fn()}
      />
    );
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Delete progression' })).toBeInTheDocument();
  });

  it('disables the Remove rule button when there is only one rule', () => {
    render(
      <EdgeContextMenu
        progression={defaultProgression}
        bracketTitles={bracketTitles}
        onClose={vi.fn()}
        onDelete={vi.fn()}
      />
    );
    expect(screen.getByRole('button', { name: /Remove rule 1/i })).toBeDisabled();
  });
});

// ── Close behaviour ────────────────────────────────────────────────────────────

describe('EdgeContextMenu — close', () => {
  it('calls onClose when the ✕ button is clicked', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(
      <EdgeContextMenu
        progression={defaultProgression}
        bracketTitles={bracketTitles}
        onClose={onClose}
        onDelete={vi.fn()}
      />
    );
    await user.click(screen.getByRole('button', { name: 'Close' }));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('calls onClose when the Cancel button is clicked', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(
      <EdgeContextMenu
        progression={defaultProgression}
        bracketTitles={bracketTitles}
        onClose={onClose}
        onDelete={vi.fn()}
      />
    );
    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(onClose).toHaveBeenCalledOnce();
  });
});

// ── Save ───────────────────────────────────────────────────────────────────────

describe('EdgeContextMenu — save', () => {
  it('calls editProgression with the progression id and current rules on Save', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(
      <EdgeContextMenu
        progression={defaultProgression}
        bracketTitles={bracketTitles}
        onClose={onClose}
        onDelete={vi.fn()}
      />
    );
    await user.click(screen.getByRole('button', { name: 'Save' }));
    expect(mockEditProgression).toHaveBeenCalledOnce();
    expect(mockEditProgression).toHaveBeenCalledWith(
      defaultProgression.id,
      expect.arrayContaining([
        expect.objectContaining({ fromBracketId: 'b1', toBracketId: 'b2' }),
      ])
    );
  });

  it('calls onClose after saving', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(
      <EdgeContextMenu
        progression={defaultProgression}
        bracketTitles={bracketTitles}
        onClose={onClose}
        onDelete={vi.fn()}
      />
    );
    await user.click(screen.getByRole('button', { name: 'Save' }));
    expect(onClose).toHaveBeenCalledOnce();
  });
});

// ── Delete confirmation flow ───────────────────────────────────────────────────

describe('EdgeContextMenu — delete confirmation', () => {
  it('shows "Delete this progression?" after clicking "Delete progression"', async () => {
    const user = userEvent.setup();
    render(
      <EdgeContextMenu
        progression={defaultProgression}
        bracketTitles={bracketTitles}
        onClose={vi.fn()}
        onDelete={vi.fn()}
      />
    );
    await user.click(screen.getByRole('button', { name: 'Delete progression' }));
    expect(screen.getByText('Delete this progression?')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Yes, delete' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'No, cancel' })).toBeInTheDocument();
  });

  it('calls onDelete when "Yes, delete" is confirmed', async () => {
    const onDelete = vi.fn();
    const user = userEvent.setup();
    render(
      <EdgeContextMenu
        progression={defaultProgression}
        bracketTitles={bracketTitles}
        onClose={vi.fn()}
        onDelete={onDelete}
      />
    );
    await user.click(screen.getByRole('button', { name: 'Delete progression' }));
    await user.click(screen.getByRole('button', { name: 'Yes, delete' }));
    expect(onDelete).toHaveBeenCalledOnce();
  });

  it('cancels deletion and restores the default action bar on "No, cancel"', async () => {
    const user = userEvent.setup();
    render(
      <EdgeContextMenu
        progression={defaultProgression}
        bracketTitles={bracketTitles}
        onClose={vi.fn()}
        onDelete={vi.fn()}
      />
    );
    await user.click(screen.getByRole('button', { name: 'Delete progression' }));
    await user.click(screen.getByRole('button', { name: 'No, cancel' }));
    expect(screen.queryByText('Delete this progression?')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Delete progression' })).toBeInTheDocument();
  });
});

// ── Add / remove rules ─────────────────────────────────────────────────────────

describe('EdgeContextMenu — add rule', () => {
  it('adds a new rule block when "+ Add rule" is clicked', async () => {
    const user = userEvent.setup();
    render(
      <EdgeContextMenu
        progression={defaultProgression}
        bracketTitles={bracketTitles}
        onClose={vi.fn()}
        onDelete={vi.fn()}
      />
    );
    await user.click(screen.getByRole('button', { name: '+ Add rule' }));
    expect(screen.getByText('Rule 2')).toBeInTheDocument();
  });

  it('enables the Remove button for rule 1 once there are 2 rules', async () => {
    const user = userEvent.setup();
    render(
      <EdgeContextMenu
        progression={defaultProgression}
        bracketTitles={bracketTitles}
        onClose={vi.fn()}
        onDelete={vi.fn()}
      />
    );
    await user.click(screen.getByRole('button', { name: '+ Add rule' }));
    // The component enters wizard mode for the new rule — navigate back to list to see both rules
    await user.click(screen.getByRole('button', { name: 'Progression rules' }));
    expect(screen.getByRole('button', { name: /Remove rule 1/i })).not.toBeDisabled();
  });

  it('removes a rule when its Remove button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <EdgeContextMenu
        progression={defaultProgression}
        bracketTitles={bracketTitles}
        onClose={vi.fn()}
        onDelete={vi.fn()}
      />
    );
    await user.click(screen.getByRole('button', { name: '+ Add rule' }));
    // Navigate back to the list view so both rules are visible
    await user.click(screen.getByRole('button', { name: 'Progression rules' }));
    await user.click(screen.getByRole('button', { name: /Remove rule 1/i }));
    // Rule 1 was removed; the remaining rule is renumbered to Rule 1
    expect(screen.queryByText('Rule 2')).not.toBeInTheDocument();
    expect(screen.getByText('Rule 1')).toBeInTheDocument();
  });
});
