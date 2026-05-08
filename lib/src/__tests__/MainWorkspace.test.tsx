import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MainWorkspace } from '../ui/MainWorkspace/MainWorkspace';

describe('MainWorkspace', () => {
  it('renders the title', () => {
    render(<MainWorkspace title="Knockout Bracket">content</MainWorkspace>);
    expect(screen.getByText('Knockout Bracket')).toBeInTheDocument();
  });

  it('renders children in the body', () => {
    render(<MainWorkspace title="Title">body content</MainWorkspace>);
    expect(screen.getByText('body content')).toBeInTheDocument();
  });

  it('renders optional breadcrumb', () => {
    render(
      <MainWorkspace title="Title" breadcrumb={<span>International Clubs › CL</span>}>
        content
      </MainWorkspace>,
    );
    expect(screen.getByText('International Clubs › CL')).toBeInTheDocument();
  });

  it('does not render breadcrumb element when omitted', () => {
    const { container } = render(<MainWorkspace title="Title">content</MainWorkspace>);
    expect(container.querySelector('.main-workspace__breadcrumb')).not.toBeInTheDocument();
  });

  it('renders optional titleBadges', () => {
    render(
      <MainWorkspace title="Title" titleBadges={<span>SIMPLE</span>}>
        content
      </MainWorkspace>,
    );
    expect(screen.getByText('SIMPLE')).toBeInTheDocument();
  });

  it('does not render badges element when omitted', () => {
    const { container } = render(<MainWorkspace title="Title">content</MainWorkspace>);
    expect(container.querySelector('.main-workspace__badges')).not.toBeInTheDocument();
  });

  it('renders optional tabs slot', () => {
    render(
      <MainWorkspace title="Title" tabs={<div role="tablist">tabs here</div>}>
        content
      </MainWorkspace>,
    );
    expect(screen.getByRole('tablist')).toBeInTheDocument();
  });

  it('does not render tabs element when omitted', () => {
    const { container } = render(<MainWorkspace title="Title">content</MainWorkspace>);
    expect(container.querySelector('.main-workspace__tabs')).not.toBeInTheDocument();
  });

  it('renders optional footer', () => {
    render(
      <MainWorkspace title="Title" footer={<button type="button">Save</button>}>
        content
      </MainWorkspace>,
    );
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
  });

  it('does not render footer element when omitted', () => {
    const { container } = render(<MainWorkspace title="Title">content</MainWorkspace>);
    expect(container.querySelector('.main-workspace__footer')).not.toBeInTheDocument();
  });
});
