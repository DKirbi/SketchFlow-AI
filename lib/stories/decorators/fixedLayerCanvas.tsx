import type { Decorator } from '@storybook/react';

/**
 * Decorator for stories that render fixed-position components (modals, toasts,
 * drawers). Because `position: fixed` elements are out of normal flow, the
 * Storybook iframe collapses to zero height unless an in-flow container
 * reserves space. This decorator adds a wrapper with a declared min-height and
 * 20px vertical padding so the canvas is tall enough to display the overlay.
 *
 * @param minTotalHeightPx  Total container height in pixels (padding included).
 */
export function fixedLayerCanvasDecorator(minTotalHeightPx: number): Decorator {
  return (Story) => (
    <div
      style={{
        minHeight: minTotalHeightPx,
        paddingTop: 20,
        paddingBottom: 20,
        boxSizing: 'border-box',
        width: '100%',
      }}
    >
      <Story />
    </div>
  );
}
