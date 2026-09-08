import { Route, Routes, useParams, useSearchParams } from 'react-router-dom';
import { AppearanceNavigate } from './appearance/navigation';
import { AppearanceProvider } from './appearance/AppearanceProvider';
import { ProjectPage } from './hub/ProjectPage';
import { ShowcaseLayout } from './hub/ShowcaseLayout';
import {
  DEFAULT_PROJECT_SLUG,
  defaultProjectPath,
  getCompany,
  projectPath,
} from './hub/catalog';

/** `/` → default project. Legacy `?slug=` portfolio embeds keep their nested path. */
function RootRedirect() {
  const [params] = useSearchParams();
  const slug = params.get('slug');
  if (slug) {
    return <AppearanceNavigate to={projectPath('Sportradar', slug)} />;
  }
  return <AppearanceNavigate to={defaultProjectPath()} />;
}

function CompanyRedirect() {
  const { companyId = '' } = useParams();
  const company = getCompany(companyId);
  if (!company?.enabled) {
    return <AppearanceNavigate to={defaultProjectPath()} />;
  }
  return <AppearanceNavigate to={projectPath(company.id, DEFAULT_PROJECT_SLUG)} />;
}

export function App() {
  return (
    <AppearanceProvider>
      <Routes>
        <Route path="/" element={<RootRedirect />} />
        <Route path="/:companyId" element={<CompanyRedirect />} />
        <Route element={<ShowcaseLayout />}>
          <Route path="/:companyId/:projectSlug" element={<ProjectPage />} />
        </Route>
        <Route path="*" element={<AppearanceNavigate to={defaultProjectPath()} />} />
      </Routes>
    </AppearanceProvider>
  );
}
