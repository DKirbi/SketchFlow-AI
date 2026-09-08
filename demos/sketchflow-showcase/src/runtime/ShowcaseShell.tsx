import type { RegisteredExample } from '../examples/registry';
import './ShowcaseShell.scss';

interface ShowcaseShellProps {
  example: RegisteredExample;
}

export function ShowcaseShell({ example }: ShowcaseShellProps) {
  const { Component } = example;

  return (
    <div className="showcase-shell">
      <div className="showcase-shell__stage" aria-live="polite">
        <Component />
      </div>
    </div>
  );
}
