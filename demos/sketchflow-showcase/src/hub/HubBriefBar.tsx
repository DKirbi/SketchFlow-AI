import { useState } from 'react';
import { LOFIButton, LOFIChevronRightIcon, LOFIChevronUpIcon, LOFIFeedbackSeverityIcon, LOFIText } from 'lofi-kit';
import { type HubProject } from './catalog';
import type { PatternSummary } from '../runtime/types';

const PATTERN_TITLE_SEPARATOR = ' — ';

function patternAccordionLabel(pattern: PatternSummary): string {
  const separatorIndex = pattern.title.indexOf(PATTERN_TITLE_SEPARATOR);
  const name =
    separatorIndex >= 0
      ? pattern.title.slice(separatorIndex + PATTERN_TITLE_SEPARATOR.length)
      : pattern.title;
  return `${pattern.id}: ${name}`;
}

export interface HubReturnTo {
  companyId: string;
  slug: string;
  title: string;
}

interface HubBriefBarProps {
  project: HubProject | undefined;
  collapsed: boolean;
  onToggle: () => void;
  returnTo: HubReturnTo | null;
  onShowMore: () => void;
  onReturnToInterface: () => void;
  onDismissReturn: () => void;
}

export function HubBriefBar({
  project,
  collapsed,
  onToggle,
  returnTo,
  onShowMore,
  onReturnToInterface,
  onDismissReturn,
}: HubBriefBarProps) {
  const [expandedPatternId, setExpandedPatternId] = useState<string | null>(null);

  if (!project) return null;

  const hasPatterns = project.patternSummaries.length > 0;
  const patternList = project.patternSummaries.map((pattern) => pattern.id).join(', ');
  const briefClass = [
    'hub-shell__brief',
    'hub-brief',
    collapsed ? 'hub-brief--collapsed' : '',
    hasPatterns ? '' : 'hub-brief--full',
    returnTo ? 'hub-brief--return' : '',
  ]
    .filter(Boolean)
    .join(' ');

  function togglePattern(id: string) {
    setExpandedPatternId((current) => (current === id ? null : id));
  }

  return (
    <section className={briefClass} aria-label="Project brief">
      <span className="hub-brief__icon" aria-hidden="true">
        <LOFIFeedbackSeverityIcon severity="info" />
      </span>

      {returnTo ? (
        <div className="hub-brief__return">
          <LOFIText as="p" variant="body" className="hub-brief__return-copy">
            Pattern documentation opened from {returnTo.title}.
          </LOFIText>
          <div className="hub-brief__return-actions">
            <LOFIButton variant="primary" onClick={onReturnToInterface}>
              Get back to {returnTo.title}
            </LOFIButton>
            <LOFIButton variant="dismiss" onClick={onDismissReturn}>
              Dismiss
            </LOFIButton>
          </div>
        </div>
      ) : (
        <div className="hub-brief__columns">
          <div className="hub-brief__copy">
            <div className="hub-brief__heading">
              <LOFIText as="h2" variant="strong" className="hub-brief__title">
                {project.title}
              </LOFIText>
              <LOFIButton
                variant="default"
                size="compact"
                className="hub-brief__more"
                onClick={onToggle}
              >
                {collapsed ? 'Show more' : 'Show less'}
              </LOFIButton>
            </div>
            <LOFIText as="p" variant="description" className="hub-brief__summary">
              {project.summary}
            </LOFIText>
            {!collapsed
              ? project.brief
                  .filter((paragraph) => paragraph !== project.summary)
                  .map((paragraph) => (
                    <LOFIText
                      key={paragraph}
                      as="p"
                      variant="description"
                      className="hub-brief__message"
                    >
                      {paragraph}
                    </LOFIText>
                  ))
              : null}
          </div>

          {hasPatterns ? (
            <div className="hub-brief__patterns">
              {collapsed ? (
                <LOFIText as="p" variant="inherit" className="hub-brief__pattern-list">
                  {patternList}
                </LOFIText>
              ) : (
                project.patternSummaries.map((pattern) => {
                  const expanded = expandedPatternId === pattern.id;
                  return (
                    <div key={pattern.id} className="hub-brief__pattern">
                      <LOFIButton
                        variant="default"
                        size="compact"
                        className="hub-brief__pattern-toggle"
                        aria-expanded={expanded}
                        onClick={() => togglePattern(pattern.id)}
                      >
                        <span className="hub-brief__pattern-toggle-row">
                          <LOFIText as="span" variant="inherit" className="hub-brief__pattern-label">
                            {patternAccordionLabel(pattern)}
                          </LOFIText>
                          {expanded ? (
                            <LOFIChevronUpIcon size={12} />
                          ) : (
                            <LOFIChevronRightIcon size={12} />
                          )}
                        </span>
                      </LOFIButton>
                      {expanded ? (
                        <div className="hub-brief__pattern-body">
                          <LOFIText variant="description">{pattern.body}</LOFIText>
                          <LOFIButton variant="dismiss" size="compact" onClick={onShowMore}>
                            Open pattern docs
                          </LOFIButton>
                        </div>
                      ) : null}
                    </div>
                  );
                })
              )}
            </div>
          ) : null}
        </div>
      )}
    </section>
  );
}
