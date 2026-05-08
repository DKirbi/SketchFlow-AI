import type { ReactNode } from 'react';
import './Toolbar.scss';

export interface ToolbarProps {
  /** Content for the left slot. */
  left?:       ReactNode;
  /** Content for the centre slot. */
  center?:     ReactNode;
  /** Content for the right slot. */
  right?:      ReactNode;
  /** Optional extra class names on the root `toolbar` element. */
  className?:  string;
}

export function Toolbar({ left, center, right, className }: ToolbarProps) {
  const rootCls = ['toolbar', className].filter(Boolean).join(' ');

  return (
    <header className={rootCls}>
      {left   && <div className="toolbar__left">{left}</div>}
      {center && <nav className="toolbar__center">{center}</nav>}
      {right  && <div className="toolbar__right">{right}</div>}
    </header>
  );
}
