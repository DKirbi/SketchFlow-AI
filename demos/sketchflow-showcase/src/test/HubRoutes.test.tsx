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
import {
  DEFAULT_STORYBOOK_PATH,
  ancestorIds,
  canvasPath,
  docsPath,
  uxPatternDocsPath,
} from '../hub/storybookNav';
import { STORYBOOK_NAV } from '../hub/storybookNav';

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
  document.documentElement.removeAttribute('data-theme');
  document.documentElement.classList.remove('dark');
  document.documentElement.removeAttribute('lang');
  document.documentElement.style.removeProperty('color-scheme');
  vi.restoreAllMocks();
});

describe('hub catalog', () => {
  it('lists six projects with About first, SketchFlowAI Patterns last, and rail abbrevs', () => {
    expect(getCompany('Sportradar')?.enabled).toBe(true);
    expect(getCompany('OTHER')?.enabled).toBe(false);
    expect(DEFAULT_PROJECT_SLUG).toBe('about');

    const projects = listProjectsForCompany('Sportradar');
    expect(projects.map((project) => project.slug)).toEqual([
      'about',
      'merge-tool',
      'mapping',
      'bracket-demo',
      'tournament-management',
      'low-fi-ux-ui-patterns',
    ]);
    expect(projects.map((project) => project.railAbbrev)).toEqual([
      'AB',
      'MG',
      'MP',
      'BR',
      'TM',
      'SB',
    ]);
    expect(getProject('Sportradar', 'about')?.kind).toBe('page');
    expect(getProject('Sportradar', 'low-fi-ux-ui-patterns')?.title).toBe('SketchFlowAI Patterns');
    expect(getProject('Sportradar', 'low-fi-ux-ui-patterns')?.patternSummaries).toEqual([]);
    expect(getProject('Sportradar', 'merge-tool')?.patternSummaries.length).toBeGreaterThan(0);
    expect(getProject('Sportradar', 'bracket-demo')?.kind).toBe('embed');
    expect(getProject('Sportradar', 'mapping')?.kind).toBe('spa');
  });
});

describe('App routes', () => {
  it('redirects / to About without a company accordion or project brief', () => {
    renderApp('/');

    const nav = showcaseNav();
    expect(within(nav).getByRole('button', { name: 'About' })).toHaveClass(
      'btn--primary',
    );
    expect(screen.queryByRole('heading', { name: 'About' })).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'What is SketchFlowAI' })).toBeInTheDocument();
    expect(
      screen.getByText(/collection of UX and UI patterns that were used in real production/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/notification-style band under the interface/i)).toBeInTheDocument();
    expect(nav.querySelector('.hub-sidebar__docs-rule')).toBeTruthy();
    expect(screen.queryByLabelText('Project brief')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Collapse sidebar' })).toBeInTheDocument();
    expect(screen.getByText('SketchFlowAI')).toBeInTheDocument();
    expect(screen.getByText('Showcase')).toBeInTheDocument();
    expect(screen.queryByText('Sportradar')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('AI Showcase breadcrumb')).not.toBeInTheDocument();
  });

  it('redirects /Sportradar and legacy ?slug= onto nested project paths', () => {
    const { unmount } = renderApp('/Sportradar');
    expect(within(showcaseNav()).getByRole('button', { name: 'About' })).toHaveClass(
      'btn--primary',
    );
    unmount();

    renderApp('/?slug=mapping');
    expect(within(showcaseNav()).getByRole('button', { name: 'Mapping' })).toHaveClass(
      'btn--primary',
    );
    expect(screen.getByLabelText('Project brief')).toHaveTextContent(/Map messy internal names onto crawled canonical names/i);
  });

  it('resets an embedded Work iframe to About on load', async () => {
    const parent = {} as Window;
    vi.spyOn(window, 'parent', 'get').mockReturnValue(parent);
    renderApp('/Sportradar/merge-tool');

    expect(await screen.findByRole('heading', { name: 'What is SketchFlowAI' })).toBeInTheDocument();
    expect(within(showcaseNav()).getByRole('button', { name: 'About' })).toHaveClass(
      'btn--primary',
    );
  });

  it('navigates in-app items through the URL and updates the brief', async () => {
    const user = userEvent.setup();
    renderApp('/');

    await user.click(within(showcaseNav()).getByRole('button', { name: 'Mapping' }));

    expect(within(showcaseNav()).getByRole('button', { name: 'Mapping' })).toHaveClass(
      'btn--primary',
    );
    expect(within(showcaseNav()).getByRole('button', { name: 'About' })).not.toHaveClass(
      'btn--primary',
    );
    expect(screen.getByLabelText('Project brief')).toHaveTextContent(/Map messy internal names onto crawled canonical names/i);
  });

  it('opens SketchFlowAI Patterns with a breadcrumb and hides sibling examples', async () => {
    const user = userEvent.setup();
    renderApp('/');

    await user.click(within(showcaseNav()).getByRole('button', { name: 'SketchFlowAI Patterns' }));

    const nav = showcaseNav();
    expect(screen.getByTitle('SketchFlowAI Patterns')).toHaveAttribute(
      'src',
      expect.stringContaining(`?path=${DEFAULT_STORYBOOK_PATH}`),
    );
    expect(screen.getByLabelText('AI Showcase breadcrumb')).toBeInTheDocument();
    expect(within(nav).queryByRole('button', { name: 'Merge Tool' })).not.toBeInTheDocument();
    expect(within(nav).queryByRole('button', { name: 'Mapping' })).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Project brief')).not.toBeInTheDocument();
    expect(within(nav).getByRole('button', { name: 'UX Patterns' })).toBeInTheDocument();
    expect(within(nav).getByRole('button', { name: 'P1 Workspace' })).toBeInTheDocument();
    expect(within(nav).getByRole('button', { name: 'P10 Sticky disclosure' })).toBeInTheDocument();
    expect(within(nav).queryByRole('button', { name: 'P1.2.1: Filter Row' })).not.toBeInTheDocument();
    expect(within(nav).queryByRole('button', { name: 'Story 1 — Team Management' })).not.toBeInTheDocument();
    expect(within(nav).queryByRole('button', { name: 'Button' })).not.toBeInTheDocument();
  });

  it('returns to About when AI Showcase is clicked', async () => {
    const user = userEvent.setup();
    renderApp('/');

    await user.click(within(showcaseNav()).getByRole('button', { name: 'SketchFlowAI Patterns' }));
    await user.click(screen.getByRole('button', { name: 'AI Showcase' }));

    expect(within(showcaseNav()).getByRole('button', { name: 'About' })).toHaveClass(
      'btn--primary',
    );
    expect(screen.queryByLabelText('AI Showcase breadcrumb')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Project brief')).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'What is SketchFlowAI' })).toBeInTheDocument();
  });

  it('opens P1 Workspace docs and keeps LOW FI Design system collapsed', async () => {
    const user = userEvent.setup();
    renderApp('/');

    await user.click(within(showcaseNav()).getByRole('button', { name: 'SketchFlowAI Patterns' }));

    const nav = showcaseNav();
    await user.click(within(nav).getByRole('button', { name: 'P1 Workspace' }));

    expect(screen.getByTitle('SketchFlowAI Patterns')).toHaveAttribute(
      'src',
      expect.stringContaining(docsPath('PATTERNS/UX Patterns/P1 Workspace')),
    );

    await user.click(within(nav).getByRole('button', { name: 'P1.2.1: Filter Row' }));
    expect(screen.getByTitle('SketchFlowAI Patterns')).toHaveAttribute(
      'src',
      expect.stringContaining(docsPath('PATTERNS/UX Patterns/P1 Workspace/P1.2.1: Filter Row')),
    );

    await user.click(within(nav).getByRole('button', { name: 'Expand LOW FI Design system' }));
    expect(within(nav).getByRole('button', { name: 'Primitives' })).toBeInTheDocument();
    expect(within(nav).getByRole('button', { name: 'Component sets' })).toBeInTheDocument();
    expect(within(nav).queryByRole('button', { name: 'Button' })).not.toBeInTheDocument();
    expect(within(nav).queryByRole('button', { name: 'P7 confirm' })).not.toBeInTheDocument();

    await user.click(within(nav).getByRole('button', { name: 'Expand Primitives' }));
    expect(within(nav).getByRole('button', { name: 'Button' })).toBeInTheDocument();
    expect(within(nav).getByRole('button', { name: 'Chip' })).toBeInTheDocument();

    await user.click(within(nav).getByRole('button', { name: 'Button' }));
    expect(screen.getByTitle('SketchFlowAI Patterns')).toHaveAttribute(
      'src',
      expect.stringContaining(docsPath('LOW FI Design system/Primitives/Button')),
    );

    await user.click(within(nav).getByRole('button', { name: 'Expand Component sets' }));
    expect(within(nav).getByRole('button', { name: 'P7 confirm' })).toBeInTheDocument();
    expect(within(nav).getByRole('button', { name: 'UPL shell' })).toBeInTheDocument();

    await user.click(within(nav).getByRole('button', { name: 'P7 confirm' }));
    expect(screen.getByTitle('SketchFlowAI Patterns')).toHaveAttribute(
      'src',
      expect.stringContaining(canvasPath('LOW FI Design system/Component sets/P7 confirm', 'P7Save')),
    );
  });

  it('puts the expand control first on the collapsed rail and keeps only SB in Storybook mode', async () => {
    const user = userEvent.setup();
    renderApp('/');

    await user.click(within(showcaseNav()).getByRole('button', { name: 'SketchFlowAI Patterns' }));
    await user.click(screen.getByRole('button', { name: 'Collapse sidebar' }));

    const nav = showcaseNav();
    expect(nav).toHaveClass('hub-sidebar--collapsed');
    const buttons = within(nav).getAllByRole('button');
    expect(buttons[0]).toHaveAccessibleName('Expand sidebar');
    expect(within(nav).getByText('SketchflowAI Showcase')).toBeInTheDocument();
    expect(within(nav).getByRole('button', { name: 'SB' })).toHaveClass('btn--primary');
    expect(within(nav).queryByRole('button', { name: 'MG' })).not.toBeInTheDocument();
    expect(within(nav).queryByRole('button', { name: 'Merge Tool' })).not.toBeInTheDocument();
  });

  it('collapses the brief to the heading, short description, and comma-separated patterns', async () => {
    const user = userEvent.setup();
    renderApp('/Sportradar/merge-tool');

    await user.click(screen.getByRole('button', { name: 'Show less' }));

    const brief = screen.getByLabelText('Project brief');
    expect(brief).toHaveClass('hub-brief--collapsed');
    expect(brief).toHaveTextContent('Merge Tool');
    expect(brief).toHaveTextContent(/Pick a mock catalog, choose one database row/i);
    expect(brief).toHaveTextContent(/P2 \/ P2\.3/);
    expect(brief).not.toHaveTextContent(/Merge stays disabled until you override/i);

    await user.click(screen.getByRole('button', { name: 'Show more' }));
    expect(screen.getByLabelText('Project brief')).toHaveTextContent(
      /Merge stays disabled until you override/i,
    );
  });

  it('expands a pattern accordion and Open pattern docs returns via Get back to the interface', async () => {
    const user = userEvent.setup();
    renderApp('/Sportradar/merge-tool');

    await user.click(screen.getByRole('button', { name: 'P7: Confirmation dialog' }));
    expect(screen.getByRole('button', { name: 'P7: Confirmation dialog' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
    expect(
      screen.getByRole('button', { name: 'P7: Confirmation dialog' }).closest('.hub-brief__pattern'),
    ).toHaveClass('hub-brief__pattern--expanded');
    expect(screen.getByText(/two-answer confirmation stacks on the review modal/i)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Open pattern docs' }));
    expect(screen.getByTitle('SketchFlowAI Patterns')).toHaveAttribute(
      'src',
      expect.stringContaining(docsPath('PATTERNS/UX Patterns/P7 Confirmation dialog')),
    );
    expect(screen.getByRole('button', { name: 'Get back to Merge Tool' })).toBeInTheDocument();
    expect(screen.getByLabelText('AI Showcase breadcrumb')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Get back to Merge Tool' }));
    expect(within(showcaseNav()).getByRole('button', { name: 'Merge Tool' })).toHaveClass(
      'btn--primary',
    );
    expect(screen.queryByRole('button', { name: 'Get back to Merge Tool' })).not.toBeInTheDocument();
  });

  it('dismisses the return-to section and hides the Storybook brief', async () => {
    const user = userEvent.setup();
    renderApp('/Sportradar/merge-tool');

    await user.click(screen.getByRole('button', { name: 'P7: Confirmation dialog' }));
    await user.click(screen.getByRole('button', { name: 'Open pattern docs' }));
    await user.click(screen.getByRole('button', { name: 'Dismiss' }));

    expect(screen.getByTitle('SketchFlowAI Patterns')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Get back to Merge Tool' })).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Project brief')).not.toBeInTheDocument();
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
    expect(within(showcaseNav()).getByRole('button', { name: 'About' })).toHaveClass(
      'btn--primary',
    );
  });

  it('applies locale=de to hub chrome and About headings without translating titles', async () => {
    const user = userEvent.setup();
    renderApp('/?theme=dark&locale=de');

    expect(document.documentElement.dataset.theme).toBe('dark');
    expect(document.documentElement.lang).toBe('de');
    const nav = await screen.findByRole('navigation', { name: 'Showcase-Navigation' });
    expect(screen.getByRole('heading', { name: 'Was ist SketchFlowAI' })).toBeInTheDocument();
    expect(screen.queryByLabelText('Projektkurzinfo')).not.toBeInTheDocument();
    expect(within(nav).getByRole('button', { name: 'Merge Tool' })).toBeInTheDocument();
    expect(screen.queryByText('Sportradar')).not.toBeInTheDocument();

    await user.click(within(nav).getByRole('button', { name: 'Merge Tool' }));
    expect(screen.getByRole('button', { name: 'Weniger anzeigen' })).toBeInTheDocument();
    expect(screen.getByLabelText('Projektkurzinfo')).toHaveTextContent(/Wählen Sie einen Mock-Katalog/i);
  });

  it('passes appearance into the Storybook iframe and localizes hub nav groups', async () => {
    const user = userEvent.setup();
    renderApp('/?theme=dark&locale=de');

    const nav = await screen.findByRole('navigation', { name: 'Showcase-Navigation' });
    await user.click(within(nav).getByRole('button', { name: 'SketchFlowAI Patterns' }));

    expect(screen.getByTitle('SketchFlowAI Patterns')).toHaveAttribute(
      'src',
      expect.stringContaining('locale=de'),
    );
    expect(screen.getByTitle('SketchFlowAI Patterns')).toHaveAttribute(
      'src',
      expect.stringContaining('theme=dark'),
    );
    expect(screen.getByRole('button', { name: 'UX-Muster' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'UI-Muster' })).toBeInTheDocument();
  });
});

describe('storybook nav catalog', () => {
  it('lists P1–P10 as docs leaves under UX Patterns', () => {
    expect(ancestorIds(STORYBOOK_NAV, 'ux-p1')).toEqual(['ux-patterns']);
    expect(ancestorIds(STORYBOOK_NAV, 'ux-p1-2-1')).toEqual(['ux-patterns', 'ux-p1']);
    expect(docsPath('Introduction')).toBe('/docs/introduction--docs');
    expect(docsPath('PATTERNS/UX Patterns/P1 Workspace')).toBe(
      '/docs/patterns-ux-patterns-p1-workspace--docs',
    );
    expect(docsPath('PATTERNS/UX Patterns/P1 Workspace/P1.2.1: Filter Row')).toBe(
      '/docs/patterns-ux-patterns-p1-workspace-p1-2-1-filter-row--docs',
    );
    expect(uxPatternDocsPath('P2 / P2.3')).toBe(docsPath('PATTERNS/UX Patterns/P2 Data Table'));
    expect(uxPatternDocsPath('Role gating')).toBe(docsPath('PATTERNS/UX Patterns'));
    expect(canvasPath('PATTERNS/UI Patterns', 'UI_ModalCommitAndP7')).toBe(
      '/story/patterns-ui-patterns--ui-modal-commit-and-p-7',
    );
  });

  it('nests primitives and component sets under LOW FI Design system', () => {
    expect(ancestorIds(STORYBOOK_NAV, 'lofi-primitive-button')).toEqual([
      'low-fi-design-system',
      'lofi-primitives',
    ]);
    expect(ancestorIds(STORYBOOK_NAV, 'lofi-set-p7-confirm')).toEqual([
      'low-fi-design-system',
      'lofi-component-sets',
    ]);
    expect(docsPath('LOW FI Design system/Primitives/Button')).toBe(
      '/docs/low-fi-design-system-primitives-button--docs',
    );
    expect(docsPath('LOW FI Design system/Component sets/Overview')).toBe(
      '/docs/low-fi-design-system-component-sets-overview--docs',
    );
    expect(canvasPath('LOW FI Design system/Component sets/P7 confirm', 'P7Save')).toBe(
      '/story/low-fi-design-system-component-sets-p7-confirm--p-7-save',
    );
  });
});
