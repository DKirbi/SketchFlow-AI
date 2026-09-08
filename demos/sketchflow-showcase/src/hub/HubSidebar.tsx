import { useNavigate } from 'react-router-dom';
import {
  LOFIButton,
  LOFICard,
  LOFIChevronLeftIcon,
  LOFIChevronRightIcon,
  LOFIChevronUpIcon,
  LOFIText,
} from 'lofi-kit';
import { HubStorybookNav } from './HubStorybookNav';
import { STORYBOOK_SLUG, projectPath, type HubProject } from './catalog';

interface HubSidebarProps {
  companyId: string;
  sectionLabel: string;
  projects: HubProject[];
  selectedSlug: string;
  collapsed: boolean;
  onToggle: () => void;
  storybookPath: string;
  onStorybookPathChange: (path: string) => void;
}

export function HubSidebar({
  companyId,
  sectionLabel,
  projects,
  selectedSlug,
  collapsed,
  onToggle,
  storybookPath,
  onStorybookPathChange,
}: HubSidebarProps) {
  const navigate = useNavigate();
  const storybookMode = selectedSlug === STORYBOOK_SLUG;
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

  const collapseControl = (
    <LOFIButton
      variant="default"
      size="compact"
      className="hub-sidebar__collapse"
      aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      onClick={onToggle}
    >
      {collapsed ? <LOFIChevronRightIcon size={14} /> : <LOFIChevronLeftIcon size={14} />}
    </LOFIButton>
  );

  return (
    <nav className={navClass} aria-label="Showcase navigation">
      <LOFICard className="hub-sidebar__card">
        {collapsed ? (
          <div className="hub-sidebar__rail">
            {collapseControl}
            <LOFIText as="span" variant="inherit" className="hub-sidebar__rail-label">
              SketchflowAI Showcase
            </LOFIText>
            <div className="hub-sidebar__rail-items">
              {railProjects.map((project) => {
                const selected = project.slug === selectedSlug;
                return (
                  <LOFIButton
                    key={project.slug}
                    variant={selected ? 'primary' : 'default'}
                    size="compact"
                    className="hub-sidebar__item hub-sidebar__item--rail"
                    aria-label={project.railAbbrev}
                    onClick={() => navigate(projectPath(companyId, project.slug))}
                  >
                    {project.railAbbrev}
                  </LOFIButton>
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
                    SketchFlowAI
                  </LOFIText>
                  <LOFIText as="span" variant="body" className="hub-sidebar__subtitle">
                    Showcase
                  </LOFIText>
                </div>

                <div className="hub-sidebar__section">
                  <div className="hub-sidebar__section-heading">
                    <LOFIChevronUpIcon size={12} />
                    <LOFIText as="span" variant="strong" className="hub-sidebar__section-label">
                      {sectionLabel}
                    </LOFIText>
                  </div>
                </div>

                <div className="hub-sidebar__items">
                  {projects.map((project) => {
                    const selected = project.slug === selectedSlug;
                    return (
                      <LOFIButton
                        key={project.slug}
                        variant={selected ? 'primary' : 'default'}
                        className="hub-sidebar__item"
                        onClick={() => navigate(projectPath(companyId, project.slug))}
                      >
                        <span className="hub-sidebar__item-inner">
                          <LOFIText as="span" variant="inherit">
                            {project.title}
                          </LOFIText>
                          <LOFIChevronRightIcon size={12} />
                        </span>
                      </LOFIButton>
                    );
                  })}
                </div>
              </>
            )}
          </>
        )}
      </LOFICard>
    </nav>
  );
}
