import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ScenarioToggle } from '../ScenarioToggle';
import type { Scenario } from '../../store/useTournamentStore';

describe('ScenarioToggle', () => {
  it('renders both scenario buttons', () => {
    render(<ScenarioToggle value="placeholders" onChange={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'Placeholders' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Finished' })).toBeInTheDocument();
  });

  it('applies active class to the currently selected scenario', () => {
    render(<ScenarioToggle value="placeholders" onChange={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'Placeholders' })).toHaveClass(
      'toggle__btn--active'
    );
    expect(screen.getByRole('button', { name: 'Finished' })).not.toHaveClass(
      'toggle__btn--active'
    );
  });

  it('applies active class to "finished" when that is the value', () => {
    render(<ScenarioToggle value="finished" onChange={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'Finished' })).toHaveClass(
      'toggle__btn--active'
    );
    expect(screen.getByRole('button', { name: 'Placeholders' })).not.toHaveClass(
      'toggle__btn--active'
    );
  });

  it('calls onChange with the correct scenario when the inactive button is clicked', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<ScenarioToggle value="placeholders" onChange={onChange} />);
    await user.click(screen.getByRole('button', { name: 'Finished' }));
    expect(onChange).toHaveBeenCalledOnce();
    expect(onChange).toHaveBeenCalledWith<[Scenario]>('finished');
  });

  it('does not call onChange when the already-active button is clicked', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<ScenarioToggle value="placeholders" onChange={onChange} />);
    await user.click(screen.getByRole('button', { name: 'Placeholders' }));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('has a group role with an accessible label', () => {
    render(<ScenarioToggle value="placeholders" onChange={vi.fn()} />);
    expect(screen.getByRole('group', { name: 'Scenario' })).toBeInTheDocument();
  });
});
