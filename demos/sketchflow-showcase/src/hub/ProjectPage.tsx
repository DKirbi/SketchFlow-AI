import { Navigate, useParams } from 'react-router-dom';
import { getExampleBySlug } from '../examples/registry';
import { ShowcaseShell } from '../runtime/ShowcaseShell';
import {
  defaultProjectPath,
  getCompany,
  getProject,
  resolveEmbedSrc,
} from './catalog';

export function ProjectPage() {
  const { companyId = '', projectSlug = '' } = useParams();
  const company = getCompany(companyId);
  const project = getProject(companyId, projectSlug);

  if (!company?.enabled || !project) {
    return <Navigate to={defaultProjectPath()} replace />;
  }

  if (project.kind === 'spa') {
    const example = getExampleBySlug(project.slug);
    if (!example) {
      return <Navigate to={defaultProjectPath()} replace />;
    }
    return <ShowcaseShell example={example} />;
  }

  return (
    <iframe
      className="hub-shell__frame"
      src={resolveEmbedSrc(project)}
      title={project.title}
      loading="lazy"
    />
  );
}
