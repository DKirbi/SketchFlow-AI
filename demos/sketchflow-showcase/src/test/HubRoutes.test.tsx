import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { App } from '../App';
import {
  DEFAULT_PROJECT_SLUG,
  getCompany,
  getProject,
  listProjectsForCompany,
} from '../hub/catalog';

function renderApp(path = '/') {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  );
}

function showcaseNav() {
  return screen.getByRole('navigation', { name: 'Showcase navigation' });
}

function mockMatchMedia(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: query.includes('max-width') ? matches : false,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
    onchange: null,
  }));
}

beforeEach(() => {
  mockMatchMedia(false);
});

afterEach(() => {
  sessionStorage.clear();
});

describe('hub catalog', () => {
  it('lists five Sportradar projects with Merge Tool first, SketchFlow Patterns last, and rail abbrevs', () => {
    expect(getCompany('Sportradar')?.enabled).toBe(true);
    expect(getCompany('OTHER')?.enabled).toBe(false);
    expect(DEFAULT_PROJECT_SLUG).toBe('merge-tool');

    const projects = listProjectsForCompany('Sportradar');
    expect(projects.map((project) => project.slug)).toEqual([
      'merge-tool',
      'mapping',
      'bracket-demo',
      'tournament-management',
      'low-fi-ux-ui-patterns',
    ]);
    expect(projects.map((project) => project.railAbbrev)).toEqual([
      'MG',
      'MP',
      'BR',
      'TM',
      'SB',
    ]);
    expect(getProject('Sportradar', 'low-fi-ux-ui-patterns')?.title).toBe('SketchFlow Patterns');
    expect(getProject('Sportradar', 'low-fi-ux-ui-patterns')?.patternSummaries).toEqual([]);
    expect(getProject('Sportradar', 'merge-tool')?.patternSummaries.length).toBeGreaterThan(0);
    expect(getProject('Sportradar', 'bracket-demo')?.kind).toBe('embed');
    expect(getProject('Sportradar', 'mapping')?.kind).toBe('spa');
  });
});

describe('App routes', () => {
  it('redirects / to Merge Tool selected with its brief in the hub shell', () => {
    renderApp('/');

    const nav = showcaseNav();
    expect(within(nav).getByRole('button', { name: 'Merge Tool' })).toHaveClass(
      'btn--primary',
    );
    expect(screen.getByLabelText('Project brief')).toHaveTextContent(/Reconciles two records/i);
    expect(screen.getByLabelText('Project brief')).toHaveTextContent(/P2/);
    expect(
      screen.getByRole('button', { name: 'P2 / P2.3: Data table + single-select' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Collapse sidebar' })).toBeInTheDocument();
    expect(screen.getByText('SketchFlowAI')).toBeInTheDocument();
    expect(screen.getByText('Showcase')).toBeInTheDocument();
    expect(screen.getByText('Sportradar')).toBeInTheDocument();
    expect(screen.queryByLabelText('UX Showcase breadcrumb')).not.toBeInTheDocument();
  });

  it('redirects /Sportradar and legacy ?slug= onto nested project paths', () => {
    const { unmount } = renderApp('/Sportradar');
    expect(within(showcaseNav()).getByRole('button', { name: 'Merge Tool' })).toHaveClass(
      'btn--primary',
    );
    unmount();

    renderApp('/?slug=mapping');
    expect(within(showcaseNav()).getByRole('button', { name: 'Mapping' })).toHaveClass(
      'btn--primary',
    );
    expect(screen.getByLabelText('Project brief')).toHaveTextContent(/Maps messy or legacy internal names/i);
  });

  it('navigates in-app items through the URL and updates the brief', async () => {
    const user = userEvent.setup();
    renderApp('/');

    await user.click(within(showcaseNav()).getByRole('button', { name: 'Mapping' }));

    expect(within(showcaseNav()).getByRole('button', { name: 'Mapping' })).toHaveClass(
      'btn--primary',
    );
    expect(within(showcaseNav()).getByRole('button', { name: 'Merge Tool' })).not.toHaveClass(
      'btn--primary',
    );
    expect(screen.getByLabelText('Project brief')).toHaveTextContent(/Maps messy or legacy internal names/i);
  });

  it('opens SketchFlow Patterns in the iframe from the last menu item', async () => {
    const user = userEvent.setup();
    renderApp('/');

    await user.click(within(showcaseNav()).getByRole('button', { name: 'SketchFlow Patterns' }));
    expect(screen.getByTitle('SketchFlow Patterns')).toBeInTheDocument();
    expect(screen.getByLabelText('Project brief')).toHaveTextContent(/Storybook documentation/i);
    expect(screen.queryByRole('button', { name: 'Show more' })).not.toBeInTheDocument();
  });

  it('puts the expand control first on the collapsed rail and keeps the selected abbrev', async () => {
    const user = userEvent.setup();
    renderApp('/');

    await user.click(within(showcaseNav()).getByRole('button', { name: 'SketchFlow Patterns' }));
    await user.click(screen.getByRole('button', { name: 'Collapse sidebar' }));

    const nav = showcaseNav();
    expect(nav).toHaveClass('hub-sidebar--collapsed');
    const buttons = within(nav).getAllByRole('button');
    expect(buttons[0]).toHaveAccessibleName('Expand sidebar');
    expect(within(nav).getByText('SketchflowAI Showcase')).toBeInTheDocument();
    expect(within(nav).getByRole('button', { name: 'SB' })).toHaveClass('btn--primary');
    expect(within(nav).queryByRole('button', { name: 'Merge Tool' })).not.toBeInTheDocument();
  });

  it('collapses the brief to the heading, short description, and comma-separated patterns', async () => {
    const user = userEvent.setup();
    renderApp('/');

    await user.click(screen.getByRole('button', { name: 'Collapse project brief' }));

    const brief = screen.getByLabelText('Project brief');
    expect(brief).toHaveClass('hub-brief--collapsed');
    expect(brief).toHaveTextContent('Merge Tool');
    expect(brief).toHaveTextContent(/Reconciles two records/i);
    expect(brief).toHaveTextContent(/P2 \/ P2\.3/);
    expect(brief).not.toHaveTextContent(/Mock data is movie-based/i);

    await user.click(screen.getByRole('button', { name: 'Expand project brief' }));
    expect(screen.getByLabelText('Project brief')).toHaveTextContent(/Mock data is movie-based/i);
  });

  it('expands a pattern accordion and Show more returns via Get back to the interface', async () => {
    const user = userEvent.setup();
    renderApp('/');

    await user.click(screen.getByRole('button', { name: 'P7: Confirmation dialog' }));
    expect(screen.getByRole('button', { name: 'P7: Confirmation dialog' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
    expect(screen.getByText(/confirmation-only overlay/i)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Show more' }));
    expect(screen.getByTitle('SketchFlow Patterns')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Get back to Merge Tool' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Get back to Merge Tool' }));
    expect(within(showcaseNav()).getByRole('button', { name: 'Merge Tool' })).toHaveClass(
      'btn--primary',
    );
    expect(screen.queryByRole('button', { name: 'Get back to Merge Tool' })).not.toBeInTheDocument();
  });

  it('dismisses the return-to section and restores the Storybook brief', async () => {
    const user = userEvent.setup();
    renderApp('/');

    await user.click(screen.getByRole('button', { name: 'P7: Confirmation dialog' }));
    await user.click(screen.getByRole('button', { name: 'Show more' }));
    await user.click(screen.getByRole('button', { name: 'Dismiss' }));

    expect(screen.getByTitle('SketchFlow Patterns')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Get back to Merge Tool' })).not.toBeInTheDocument();
    expect(screen.getByLabelText('Project brief')).toHaveTextContent(/Storybook documentation/i);
  });

  it('shows a desktop-preferred disclaimer on small viewports', async () => {
    mockMatchMedia(true);
    const user = userEvent.setup();
    renderApp('/');

    expect(
      screen.getByRole('dialog', { name: 'Showcase of AI Examples works best on Desktop' }),
    ).toBeInTheDocument();
    expect(screen.getByText(/corporate desktop applications/i)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Proceed in Desktop view' }));
    expect(
      screen.queryByRole('dialog', { name: 'Showcase of AI Examples works best on Desktop' }),
    ).not.toBeInTheDocument();
  });

  it('sends Go back home to the site root from the mobile disclaimer', async () => {
    mockMatchMedia(true);
    const user = userEvent.setup();
    renderApp('/Sportradar/mapping');

    await user.click(screen.getByRole('button', { name: 'Go back home' }));
    expect(within(showcaseNav()).getByRole('button', { name: 'Merge Tool' })).toHaveClass(
      'btn--primary',
    );
  });
});
