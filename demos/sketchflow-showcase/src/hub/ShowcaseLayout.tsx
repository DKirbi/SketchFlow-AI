import { useEffect, useState } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import { LOFICard } from 'lofi-kit';
import { localizedProject } from '../appearance/briefs';
import { useAppearance } from '../appearance/AppearanceProvider';
import { AppearanceNavigate, useHubNavigate } from '../appearance/navigation';
import { HubBriefBar, type HubReturnTo } from './HubBriefBar';
import { HubMobileDisclaimer } from './HubMobileDisclaimer';
import { HubSidebar } from './HubSidebar';
import {
  STORYBOOK_SLUG,
  defaultProjectPath,
  getCompany,
  getProject,
  listProjectsForCompany,
  projectPath,
  resolveEmbedSrc,
} from './catalog';
import { DEFAULT_STORYBOOK_PATH, withStorybookPath } from './storybookNav';
import './ShowcaseLayout.scss';

const DESKTOP_OK_KEY = 'sketchflow-hub-desktop-ok';
const MOBILE_QUERY = '(max-width: 767px)';

export interface ShowcaseOutletContext {
  storybookIframeSrc: string;
}

function useMobileViewport() {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia
      ? window.matchMedia(MOBILE_QUERY).matches
      : false,
  );

  useEffect(() => {
    if (!window.matchMedia) return undefined;
    const media = window.matchMedia(MOBILE_QUERY);
    const onChange = () => setIsMobile(media.matches);
    onChange();
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  return isMobile;
}

export function ShowcaseLayout() {
  const { companyId = '', projectSlug = '' } = useParams();
  const navigate = useHubNavigate();
  const { locale } = useAppearance();
  const company = getCompany(companyId);
  const catalogProject = getProject(companyId, projectSlug);
  const project = catalogProject ? localizedProject(catalogProject, locale) : catalogProject;
  const isMobile = useMobileViewport();
  const isStorybook = projectSlug === STORYBOOK_SLUG;
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [briefCollapsed, setBriefCollapsed] = useState(false);
  const [returnTo, setReturnTo] = useState<HubReturnTo | null>(null);
  const [storybookPath, setStorybookPath] = useState(DEFAULT_STORYBOOK_PATH);
  const [desktopOk, setDesktopOk] = useState(
    () => sessionStorage.getItem(DESKTOP_OK_KEY) === '1',
  );

  useEffect(() => {
    if (!returnTo) return;
    if (projectSlug !== STORYBOOK_SLUG && projectSlug !== returnTo.slug) {
      setReturnTo(null);
    }
  }, [projectSlug, returnTo]);

  useEffect(() => {
    if (projectSlug === STORYBOOK_SLUG) {
      setStorybookPath(DEFAULT_STORYBOOK_PATH);
    }
  }, [projectSlug]);

  if (!company?.enabled) {
    return <AppearanceNavigate to={defaultProjectPath()} />;
  }

  const activeCompany = company;
  const projects = listProjectsForCompany(activeCompany.id);
  const storybookProject = getProject(activeCompany.id, STORYBOOK_SLUG);
  const storybookIframeSrc =
    storybookProject && isStorybook
      ? withStorybookPath(resolveEmbedSrc(storybookProject), storybookPath)
      : '';
  const shellClass = [
    'hub-shell',
    sidebarCollapsed ? 'hub-shell--sidebar-collapsed' : '',
    isStorybook ? 'hub-shell--storybook' : '',
  ]
    .filter(Boolean)
    .join(' ');

  function proceedDesktop() {
    sessionStorage.setItem(DESKTOP_OK_KEY, '1');
    setDesktopOk(true);
  }

  function goHome() {
    sessionStorage.setItem(DESKTOP_OK_KEY, '1');
    setDesktopOk(true);
    navigate('/');
  }

  function showMorePatterns() {
    if (!project) return;
    setReturnTo({ companyId: activeCompany.id, slug: project.slug, title: project.title });
    navigate(projectPath(activeCompany.id, STORYBOOK_SLUG));
  }

  function returnToInterface() {
    if (!returnTo) return;
    const target = returnTo;
    setReturnTo(null);
    navigate(projectPath(target.companyId, target.slug));
  }

  const outletContext: ShowcaseOutletContext = { storybookIframeSrc };

  return (
    <div className={shellClass}>
      <HubSidebar
        companyId={activeCompany.id}
        sectionLabel={activeCompany.label}
        projects={projects}
        selectedSlug={projectSlug}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((current) => !current)}
        storybookPath={storybookPath}
        onStorybookPathChange={setStorybookPath}
      />
      <div className="hub-shell__stage">
        <LOFICard className="hub-shell__content">
          <Outlet context={outletContext} />
        </LOFICard>
        {!isStorybook || returnTo ? (
          <HubBriefBar
            project={project}
            collapsed={briefCollapsed}
            onToggle={() => setBriefCollapsed((current) => !current)}
            returnTo={returnTo}
            onShowMore={showMorePatterns}
            onReturnToInterface={returnToInterface}
            onDismissReturn={() => setReturnTo(null)}
          />
        ) : null}
      </div>
      <HubMobileDisclaimer
        open={isMobile && !desktopOk}
        onProceed={proceedDesktop}
        onGoHome={goHome}
      />
    </div>
  );
}
