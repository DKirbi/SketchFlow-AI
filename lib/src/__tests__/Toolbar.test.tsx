import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Toolbar } from '../ui/Toolbar/Toolbar';

describe('Toolbar', () => {
  it('renders left slot', () => {
    render(<Toolbar left={<span>Left</span>} />);
    expect(screen.getByText('Left')).toBeInTheDocument();
  });

  it('renders center slot', () => {
    render(<Toolbar center={<span>Center</span>} />);
    expect(screen.getByText('Center')).toBeInTheDocument();
  });

  it('renders right slot', () => {
    render(<Toolbar right={<span>Right</span>} />);
    expect(screen.getByText('Right')).toBeInTheDocument();
  });

  it('renders all three slots simultaneously', () => {
    render(
      <Toolbar
        left={<span>L</span>}
        center={<span>C</span>}
        right={<span>R</span>}
      />,
    );
    expect(screen.getByText('L')).toBeInTheDocument();
    expect(screen.getByText('C')).toBeInTheDocument();
    expect(screen.getByText('R')).toBeInTheDocument();
  });

  it('omits empty slots from the DOM', () => {
    const { container } = render(<Toolbar left={<span>Only left</span>} />);
    expect(container.querySelector('.toolbar__left')).toBeInTheDocument();
    expect(container.querySelector('.toolbar__center')).not.toBeInTheDocument();
    expect(container.querySelector('.toolbar__right')).not.toBeInTheDocument();
  });

  it('uses a header element as root', () => {
    render(<Toolbar left={<span>Left</span>} />);
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  it('merges custom className', () => {
    const { container } = render(<Toolbar className="dark" left={<span>L</span>} />);
    expect(container.querySelector('.toolbar.dark')).toBeInTheDocument();
  });

  it('wraps center slot in a nav element', () => {
    render(<Toolbar center={<span>Nav</span>} />);
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });
});
