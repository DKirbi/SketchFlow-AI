import { useEffect, useRef, useState, type RefObject } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';
import { SHOWCASE_PROTOCOL_VERSION } from '../runtime/protocol';
import { useAppearance } from '../appearance/AppearanceProvider';
import { AppearanceNavigate } from '../appearance/navigation';
import { appendAppearanceParams } from '../appearance/params';
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
  const { theme, locale } = useAppearance();
  const company = getCompany(companyId);
  const project = getProject(companyId, projectSlug);
  const frameRef = useRef<HTMLIFrameElement>(null);

  if (!company?.enabled || !project) {
    return <AppearanceNavigate to={defaultProjectPath()} />;
  }

  if (project.kind === 'spa') {
    const example = getExampleBySlug(project.slug);
    if (!example) {
      return <AppearanceNavigate to={defaultProjectPath()} />;
    }
    return <ShowcaseShell example={example} />;
  }

  const baseSrc = isStorybookProject(project) ? storybookIframeSrc : resolveEmbedSrc(project);
  const src = appendAppearanceParams(baseSrc, theme, locale);

  return (
    <EmbedFrame
      frameRef={frameRef}
      src={src}
      baseSrc={baseSrc}
      title={project.title}
      theme={theme}
      locale={locale}
    />
  );
}

function EmbedFrame({
  frameRef,
  src,
  baseSrc,
  title,
  theme,
  locale,
}: {
  frameRef: RefObject<HTMLIFrameElement | null>;
  src: string;
  baseSrc: string;
  title: string;
  theme: string;
  locale: string;
}) {
  const [iframeSrc, setIframeSrc] = useState(src);
  const committedBase = useRef(baseSrc);

  useEffect(() => {
    if (committedBase.current !== baseSrc) {
      committedBase.current = baseSrc;
      setIframeSrc(src);
    }
  }, [baseSrc, src]);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame?.contentWindow) return undefined;
    const payload = {
      type: 'showcase:set-appearance' as const,
      version: SHOWCASE_PROTOCOL_VERSION,
      theme,
      locale,
    };
    const send = () => {
      frame.contentWindow?.postMessage(payload, window.location.origin);
    };
    send();
    frame.addEventListener('load', send);
    return () => frame.removeEventListener('load', send);
  }, [frameRef, locale, theme]);

  return (
    <iframe
      ref={frameRef}
      className="hub-shell__frame"
      src={iframeSrc}
      title={title}
      loading="lazy"
    />
  );
}
