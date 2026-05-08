import type { ReactNode } from 'react';
import './PatternShowcase.scss';
import React from 'react';

export interface PatternShowcaseProps {
  title: string;
  description: ReactNode;
  children: ReactNode;
  /** Label shown above the live stage (e.g. "Example", "Variant A"). Defaults to "Example". */
  stageLabel?: string;
  /** Minimum height of the stage in px — use for modals and other fixed-position layers. */
  minHeight?: number;
  /** Stage layout variant:
   * - `default` — left-aligned column, padded
   * - `centered` — centered for isolated components
   * - `fullwidth` — no padding, full-bleed
   * - `canvas` — no padding, light gray background (React Flow diagrams)
   */
  variant?: 'default' | 'centered' | 'fullwidth' | 'canvas';
}

/**
 * Storybook-only layout wrapper for UX pattern documentation.
 * Renders pattern title, description, and a live lo-fi example in one block.
 *
 * Not exported from lofi-kit — this is documentation chrome, not a kit primitive.
 * Supports multiple instances per story by stacking with a divider between them.
 */
export function PatternShowcase({
  title,
  description,
  children,
  stageLabel = 'Example',
  minHeight,
  variant = 'default',
}: PatternShowcaseProps) {
  const stageClass = [
    'pattern-showcase__stage',
    variant !== 'default' ? `pattern-showcase__stage--${variant}` : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className="pattern-showcase">
      <div>
        <div className="pattern-showcase__stage-label">{stageLabel}</div>
        <div className={stageClass} style={minHeight ? { minHeight } : undefined}>
          {children}
        </div>
      </div>
      <div className="pattern-showcase__header">
        <h2 className="pattern-showcase__title">{title}</h2>
        <p className="pattern-showcase__description">{description}</p>
      </div>
    </div>
  );
}
