import { useEffect, useRef } from 'react';
import type { PreviewCursorTarget } from './previewCursor';
import { previewTargetSelector } from './previewCursor';
import './MergeToolPreviewCursor.scss';

interface MergeToolPreviewCursorProps {
  target: PreviewCursorTarget | null;
  visible: boolean;
  reducedMotion: boolean;
}

export function MergeToolPreviewCursor({ target, visible, reducedMotion }: MergeToolPreviewCursorProps) {
  const cursorRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = cursorRef.current;
    if (!node) return;

    if (!visible || !target) {
      node.classList.remove('merge-tool-preview-cursor--visible');
      return;
    }

    const updatePosition = () => {
      const el = document.querySelector(previewTargetSelector(target));
      const root = document.querySelector('.merge-tool-example');
      if (!el || !root) {
        node.classList.remove('merge-tool-preview-cursor--visible');
        return;
      }
      const elRect = el.getBoundingClientRect();
      const rootRect = root.getBoundingClientRect();
      node.style.setProperty('--cursor-top', `${elRect.top - rootRect.top + elRect.height / 2}px`);
      node.style.setProperty('--cursor-left', `${elRect.left - rootRect.left + elRect.width / 2}px`);
      node.classList.add('merge-tool-preview-cursor--visible');
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    return () => window.removeEventListener('resize', updatePosition);
  }, [target, visible]);

  if (!visible) return null;

  return (
    <span
      ref={cursorRef}
      className={
        reducedMotion
          ? 'merge-tool-preview-cursor merge-tool-preview-cursor--reduced'
          : 'merge-tool-preview-cursor'
      }
      aria-hidden="true"
    />
  );
}
