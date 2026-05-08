import type { ReactNode } from 'react';
import { Text } from '../Text/Text';
import './MainWorkspace.scss';

export interface MainWorkspaceProps {
  /** Breadcrumb path above the entity title — use LOFIText variant="muted" segments. */
  breadcrumb?: ReactNode;
  /** Entity or page title shown in the header. */
  title: string;
  /** LOFIBadge chips placed after the title (e.g. status or type labels). */
  titleBadges?: ReactNode;
  /** Optional LOFITabs strip between the header and body. */
  tabs?: ReactNode;
  /** Sticky footer actions — LOFIButton (primary + dismiss). Omit for read-only views. */
  footer?: ReactNode;
  /** Feature interface body — form, table, or any content. Scrolls independently. */
  children: ReactNode;
}

export function MainWorkspace({
  breadcrumb,
  title,
  titleBadges,
  tabs,
  footer,
  children,
}: MainWorkspaceProps) {
  return (
    <div className="main-workspace">
      <div className="main-workspace__header">
        {breadcrumb && (
          <div className="main-workspace__breadcrumb">{breadcrumb}</div>
        )}
        <div className="main-workspace__title-row">
          <Text as="h2" variant="body">{title}</Text>
          {titleBadges && (
            <div className="main-workspace__badges">{titleBadges}</div>
          )}
        </div>
      </div>
      {tabs && (
        <div className="main-workspace__tabs">{tabs}</div>
      )}
      <div className="main-workspace__body">
        {children}
      </div>
      {footer && (
        <div className="main-workspace__footer">{footer}</div>
      )}
    </div>
  );
}
