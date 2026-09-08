import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { resolveActionPresentation } from '../sets/actionRole';
import { ActionCluster } from '../sets/ActionCluster';
import { ComponentSetView } from '../sets/ComponentSet';
import { COMPONENT_SET_EXAMPLES, exampleById } from '../sets/examples';

describe('resolveActionPresentation', () => {
  it('maps modal commit to primary fill / action', () => {
    expect(resolveActionPresentation('commit', 'modal-footer')).toEqual({
      variant: 'primary',
      size: 'default',
      uiColor: 'action',
      uiRank: 'fill',
    });
  });

  it('maps P7 destructive confirm to warning fill', () => {
    expect(resolveActionPresentation('commit', 'p7-footer', { destructive: true })).toEqual({
      variant: 'primary',
      size: 'default',
      uiColor: 'warning',
      uiRank: 'fill',
    });
  });

  it('maps workspace Reset (secondary) to dismiss lo-fi / outline UI', () => {
    expect(resolveActionPresentation('secondary', 'workspace-footer')).toEqual({
      variant: 'dismiss',
      size: 'default',
      uiColor: 'neutral',
      uiRank: 'outline',
    });
  });

  it('maps bulk commit to outline at hi-fi even when lo-fi is primary', () => {
    expect(resolveActionPresentation('commit', 'bulk-bar').uiRank).toBe('outline');
    expect(resolveActionPresentation('commit', 'bulk-bar').variant).toBe('primary');
  });

  it('uses compact size in toolbars and rows', () => {
    expect(resolveActionPresentation('dismiss', 'toolbar-right').size).toBe('compact');
    expect(resolveActionPresentation('secondary', 'row-actions').size).toBe('compact');
  });
});

describe('ActionCluster', () => {
  it('renders actions in config order and fires ids', async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();
    render(
      <ActionCluster
        host="modal-footer"
        actions={[
          { id: 'cancel', role: 'dismiss', label: 'Cancel' },
          { id: 'save', role: 'commit', label: 'Save' },
        ]}
        onAction={onAction}
      />,
    );
    expect(screen.getByRole('button', { name: 'Cancel' })).toHaveClass('btn--dismiss');
    expect(screen.getByRole('button', { name: 'Save' })).toHaveClass('btn--primary');
    await user.click(screen.getByRole('button', { name: 'Save' }));
    expect(onAction).toHaveBeenCalledWith('save');
  });
});

describe('COMPONENT_SET_EXAMPLES', () => {
  it('covers every set kind used by the renderer', () => {
    const kinds = new Set(COMPONENT_SET_EXAMPLES.map((example) => example.set.kind));
    expect(kinds).toEqual(
      new Set([
        'action-cluster',
        'upper-bar',
        'filter-query-row',
        'sidebar',
        'main-workspace',
        'summary-card',
        'list-header',
        'table-chrome',
        'modal-editor',
        'p7-confirm',
        'tool-shell',
        'upl-shell',
        'filter-chip-group',
        'suggestion-row',
      ]),
    );
  });

  it('renders the UPL shell example from tournament-management', () => {
    const example = exampleById('upl-shell-tournament');
    expect(example).toBeDefined();
    render(<ComponentSetView set={example!.set} />);
    expect(screen.getByText(/Tournament Management/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Knockout 24/25' })).toBeInTheDocument();
  });

  it('renders P7 discard with two footer actions only', () => {
    const example = exampleById('p7-discard');
    render(<ComponentSetView set={example!.set} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Discard' })).toBeInTheDocument();
  });

  it('renders filter chips without ✕ and selects by action id', async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();
    const example = exampleById('filter-chip-group-mapping');
    render(<ComponentSetView set={example!.set} handlers={{ onAction }} />);
    expect(screen.queryByRole('button', { name: /Remove filter/ })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Unmapped (14)' })).toHaveAttribute('aria-pressed', 'true');
    await user.click(screen.getByRole('button', { name: 'All (20)' }));
    expect(onAction).toHaveBeenCalledWith('all');
    onAction.mockClear();
    await user.click(screen.getByRole('button', { name: 'Unmapped (14)' }));
    expect(onAction).not.toHaveBeenCalled();
  });

  it('keeps Unmap disabled on an unmapped suggestion row', () => {
    const example = exampleById('suggestion-row-high');
    render(<ComponentSetView set={example!.set} />);
    expect(screen.getByRole('button', { name: 'Unmap' })).toBeDisabled();
    expect(screen.getByText('99%')).toBeInTheDocument();
  });

  it('renders filter legend as a tooltip marker, not persistent copy', () => {
    const example = exampleById('filter-immediate');
    render(<ComponentSetView set={example!.set} />);
    expect(screen.getByLabelText('More information about filters')).toBeInTheDocument();
    expect(screen.queryByText(/Filters apply together/)).not.toBeInTheDocument();
  });

  it('renders tool-shell tabs above filter chips', () => {
    const example = exampleById('tool-shell-mapping');
    render(<ComponentSetView set={example!.set} />);
    const tabs = screen.getByRole('tablist');
    const chips = screen.getByRole('group', { name: 'Mapping status' });
    expect(tabs.compareDocumentPosition(chips) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(screen.getByLabelText('Mock database')).toBeInTheDocument();
  });
});
