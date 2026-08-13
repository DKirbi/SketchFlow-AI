import { useState } from 'react';
import { LOFIBadge, LOFIButton, LOFIInlineAlert, LOFIText } from 'lofi-kit';
import type { RegisteredExample } from '../examples/registry';
import { ShowcaseLockClosedIcon, ShowcaseLockOpenIcon } from './ShowcaseControlIcons';
import { useShowcaseRuntime } from './useShowcaseRuntime';
import './ShowcaseShell.scss';

interface ShowcaseShellProps {
  example: RegisteredExample;
}

export function ShowcaseShell({ example }: ShowcaseShellProps) {
  const { config, Component } = example;
  const { state, startInteractive, replay, completeInteraction } = useShowcaseRuntime({
    config,
  });
  const [expandedPattern, setExpandedPattern] = useState<string | null>(null);

  const isInteractive = state.mode === 'interactive' || state.mode === 'complete';
  const isAutomateMode = !isInteractive;

  const togglePattern = (patternId: string) => {
    setExpandedPattern((current) => (current === patternId ? null : patternId));
  };

  return (
    <div className="showcase-shell">
      <header className="showcase-shell__meta">
        <div className="showcase-shell__meta-copy">
          <LOFIText as="h1" variant="body">
            {config.title}
          </LOFIText>
          <LOFIText variant="description">{config.summary}</LOFIText>
          <div className="showcase-shell__patterns">
            {config.patternSummaries.map((pattern) => {
              const expanded = expandedPattern === pattern.id;
              return (
                <div key={pattern.id} className="showcase-shell__pattern">
                  <LOFIBadge
                    variant="tag"
                    label={`${pattern.id}${expanded ? ' ▼' : ' ▶'}`}
                    onClick={() => togglePattern(pattern.id)}
                    title={`${expanded ? 'Hide' : 'Show'} ${pattern.title}`}
                  />
                  {expanded && (
                    <div className="showcase-shell__pattern-body">
                      <LOFIText variant="strong">{pattern.title}</LOFIText>
                      <LOFIText variant="description">{pattern.body}</LOFIText>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="showcase-shell__aside">
          <div className="showcase-shell__control-slot">
            {isInteractive ? (
              <LOFIButton variant="primary" onClick={replay}>
                <span className="showcase-shell__btn-label">
                  <ShowcaseLockClosedIcon />
                  <LOFIText as="span" variant="inherit">
                    Automate
                  </LOFIText>
                </span>
              </LOFIButton>
            ) : (
              <LOFIButton variant="primary" onClick={startInteractive}>
                <span className="showcase-shell__btn-label">
                  <ShowcaseLockOpenIcon />
                  <LOFIText as="span" variant="inherit">
                    Interact with prototype
                  </LOFIText>
                </span>
              </LOFIButton>
            )}
          </div>
          {isInteractive ? (
            <LOFIInlineAlert
              severity="info"
              title="Interactive prototype"
              message="Select rows to bulk-map. Use Map / Unmap to manage individual entries."
            />
          ) : (
            <LOFIInlineAlert
              severity="info"
              title="Automated preview"
              message="Watch map, unmap, and bulk-map flows. Click Interact with prototype to take control."
            />
          )}
        </div>
      </header>

      <div
        className={
          isAutomateMode
            ? 'showcase-shell__stage showcase-shell__stage--locked'
            : 'showcase-shell__stage'
        }
        aria-live="polite"
        aria-disabled={isAutomateMode}
      >
        <Component
          mode={state.mode}
          previewStepIndex={state.previewStepIndex}
          previewSteps={config.previewSteps}
          onInteractionComplete={completeInteraction}
        />
      </div>
    </div>
  );
}
