import { Navigate, Route, Routes, useParams, useSearchParams } from 'react-router-dom';
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
    return <Navigate to={projectPath('Sportradar', slug)} replace />;
  }
  return <Navigate to={defaultProjectPath()} replace />;
}

function CompanyRedirect() {
  const { companyId = '' } = useParams();
  const company = getCompany(companyId);
  if (!company?.enabled) {
    return <Navigate to={defaultProjectPath()} replace />;
  }
  return <Navigate to={projectPath(company.id, DEFAULT_PROJECT_SLUG)} replace />;
}

export function App() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route path="/:companyId" element={<CompanyRedirect />} />
      <Route element={<ShowcaseLayout />}>
        <Route path="/:companyId/:projectSlug" element={<ProjectPage />} />
      </Route>
      <Route path="*" element={<Navigate to={defaultProjectPath()} replace />} />
    </Routes>
  );
}
