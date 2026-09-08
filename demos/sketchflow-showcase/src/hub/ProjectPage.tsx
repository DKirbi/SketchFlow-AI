import { Navigate, useOutletContext, useParams } from 'react-router-dom';
import { getExampleBySlug } from '../examples/registry';
import { ShowcaseShell } from '../runtime/ShowcaseShell';
import {
  defaultProjectPath,
  getCompany,
  getProject,
  isStorybookProject,
  resolveEmbedSrc,
} from './catalog';
import type { ShowcaseOutletContext } from './ShowcaseLayout';

export function ProjectPage() {
  const { companyId = '', projectSlug = '' } = useParams();
  const { storybookIframeSrc } = useOutletContext<ShowcaseOutletContext>();
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

  const src = isStorybookProject(project) ? storybookIframeSrc : resolveEmbedSrc(project);

  return (
    <iframe
      className="hub-shell__frame"
      src={src}
      title={project.title}
      loading="lazy"
    />
  );
}
