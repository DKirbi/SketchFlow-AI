/**
 * BracketNode tests
 *
 * Key regression: BracketNode's outer div uses onPointerDownCapture to update
 * the progression-focus highlight when a bracket is activated. That capture
 * listener fires before any child click, scheduling a state update that in
 * turn calls ReactFlow's setNodes during the same render cycle. ReactFlow
 * then replaces its internal node DOM between pointerdown and click, causing
 * the click to be silently dropped — so the status badge required multiple
 * taps before it registered.
 *
 * Fix: skip onBracketActivate when the pointer-down originates from an
 * interactive element (button / input / select / anchor) so that clicking
 * controls inside the bracket does NOT trigger the focus state update.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { BracketNode } from '../BracketNode';
import type { Bracket } from '../../types';

vi.mock('@xyflow/react', () => ({
  Handle: () => null,
  Position: { Left: 'left', Right: 'right' },
}));

vi.mock('../../store/useTournamentStore', () => ({
  useTournamentStore: vi.fn(),
}));

vi.mock('../../lib/matchDisplay', () => ({
  getMatchDisplayId: () => 'ID001',
}));

import { useTournamentStore } from '../../store/useTournamentStore';

vi.mocked(useTournamentStore).mockImplementation(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (selector: (s: any) => any) =>
    selector({ advanceMatchStatus: vi.fn(), setWinner: vi.fn() })
);

function makeBracket(overrides: Partial<Bracket> = {}): Bracket {
  return {
    id: 'b1',
    title: 'Group A',
    round: 1,
    position: { x: 0, y: 0 },
    matches: [
      {
        id: 'm1',
        teamA: { id: 'ta', name: 'Team A' },
        teamB: { id: 'tb', name: 'Team B' },
        status: 'SCHEDULED',
      },
    ],
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// Regression: clicking a button inside the bracket must NOT activate focus
// ---------------------------------------------------------------------------

describe('BracketNode onBracketActivate guard (regression)', () => {
  it('does NOT call onBracketActivate when a button inside the bracket is clicked', () => {
    const onBracketActivate = vi.fn();
    const { container } = render(
      <BracketNode
        data={{ bracket: makeBracket(), onBracketActivate }}
      />
    );

    const button = container.querySelector('button');
    expect(button).not.toBeNull();
    fireEvent.pointerDown(button!);

    expect(onBracketActivate).not.toHaveBeenCalled();
  });

  it('DOES call onBracketActivate when a non-interactive area of the bracket is clicked', () => {
    const onBracketActivate = vi.fn();
    const { container } = render(
      <BracketNode
        data={{ bracket: makeBracket(), onBracketActivate }}
      />
    );

    // Fire on the bracket-node div itself (not a button)
    const bracketNode = container.querySelector('.bracket-node');
    expect(bracketNode).not.toBeNull();
    fireEvent.pointerDown(bracketNode!);

    expect(onBracketActivate).toHaveBeenCalledTimes(1);
  });
});
