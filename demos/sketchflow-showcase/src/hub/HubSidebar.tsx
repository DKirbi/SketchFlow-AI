import { useHubNavigate } from '../appearance/navigation';
import { useAppearance } from '../appearance/AppearanceProvider';
import {
  LOFIButton,
  LOFICard,
  LOFIChevronLeftIcon,
  LOFIChevronRightIcon,
  LOFIText,
} from 'lofi-kit';
import { HubStorybookNav } from './HubStorybookNav';
import { STORYBOOK_SLUG, projectPath, type HubProject } from './catalog';

interface HubSidebarProps {
  companyId: string;
  projects: HubProject[];
  selectedSlug: string;
  collapsed: boolean;
  onToggle: () => void;
  storybookPath: string;
  onStorybookPathChange: (path: string) => void;
}

export function HubSidebar({
  companyId,
  projects,
  selectedSlug,
  collapsed,
  onToggle,
  storybookPath,
  onStorybookPathChange,
}: HubSidebarProps) {
  const navigate = useHubNavigate();
  const { chrome } = useAppearance();
  const storybookMode = selectedSlug === STORYBOOK_SLUG;
  const exampleProjects = projects.filter((project) => project.slug !== STORYBOOK_SLUG);
  const docsProject = projects.find((project) => project.slug === STORYBOOK_SLUG);
  const railProjects = storybookMode
    ? projects.filter((project) => project.slug === STORYBOOK_SLUG)
    : projects;

  const navClass = [
    'hub-shell__sidebar',
    'hub-sidebar',
    collapsed ? 'hub-sidebar--collapsed' : '',
    storybookMode ? 'hub-sidebar--storybook' : '',
  ]
    .filter(Boolean)
    .join(' ');

  function leaveStorybook() {
    const first = projects[0];
    if (!first) return;
    navigate(projectPath(companyId, first.slug));
  }

  function goToProject(slug: string) {
    navigate(projectPath(companyId, slug));
  }

  const collapseControl = (
    <LOFIButton
      variant="default"
      size="compact"
      className="hub-sidebar__collapse"
      aria-label={collapsed ? chrome.expandSidebar : chrome.collapseSidebar}
      onClick={onToggle}
    >
      {collapsed ? <LOFIChevronRightIcon size={14} /> : <LOFIChevronLeftIcon size={14} />}
    </LOFIButton>
  );

  return (
    <nav className={navClass} aria-label={chrome.navLabel}>
      <LOFICard className="hub-sidebar__card">
        {collapsed ? (
          <div className="hub-sidebar__rail">
            {collapseControl}
            <LOFIText as="span" variant="inherit" className="hub-sidebar__rail-label">
              {chrome.railBrand}
            </LOFIText>
            <div className="hub-sidebar__rail-items">
              {railProjects.map((project) => {
                const selected = project.slug === selectedSlug;
                const docsRule = project.slug === STORYBOOK_SLUG && !storybookMode;
                return (
                  <div key={project.slug} className="hub-sidebar__rail-slot">
                    {docsRule ? <div className="hub-sidebar__docs-rule" aria-hidden="true" /> : null}
                    <LOFIButton
                      variant={selected ? 'primary' : 'default'}
                      size="compact"
                      className="hub-sidebar__item hub-sidebar__item--rail"
                      aria-label={project.railAbbrev}
                      onClick={() => goToProject(project.slug)}
                    >
                      {project.railAbbrev}
                    </LOFIButton>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <>
            <div className="hub-sidebar__toolbar">{collapseControl}</div>
            {storybookMode ? (
              <HubStorybookNav
                storybookPath={storybookPath}
                onStorybookPathChange={onStorybookPathChange}
                onLeaveStorybook={leaveStorybook}
              />
            ) : (
              <>
                <div className="hub-sidebar__brand">
                  <LOFIText as="span" variant="strong" className="hub-sidebar__title">
                    {chrome.brandTitle}
                  </LOFIText>
                  <LOFIText as="span" variant="body" className="hub-sidebar__subtitle">
                    {chrome.brandSubtitle}
                  </LOFIText>
                </div>

                <div className="hub-sidebar__items">
                  {exampleProjects.map((project) => (
                    <ProjectNavButton
                      key={project.slug}
                      project={project}
                      selected={project.slug === selectedSlug}
                      onSelect={goToProject}
                    />
                  ))}
                  {docsProject ? (
                    <>
                      <div className="hub-sidebar__docs-rule" aria-hidden="true" />
                      <ProjectNavButton
                        project={docsProject}
                        selected={docsProject.slug === selectedSlug}
                        onSelect={goToProject}
                      />
                    </>
                  ) : null}
                </div>
              </>
            )}
          </>
        )}
      </LOFICard>
    </nav>
  );
}

function ProjectNavButton({
  project,
  selected,
  onSelect,
}: {
  project: HubProject;
  selected: boolean;
  onSelect: (slug: string) => void;
}) {
  return (
    <LOFIButton
      variant={selected ? 'primary' : 'default'}
      className="hub-sidebar__item"
      onClick={() => onSelect(project.slug)}
    >
      <span className="hub-sidebar__item-inner">
        <LOFIText as="span" variant="inherit">
          {project.title}
        </LOFIText>
        <LOFIChevronRightIcon size={12} />
      </span>
    </LOFIButton>
  );
}
