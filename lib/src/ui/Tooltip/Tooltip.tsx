import type { ReactNode } from 'react';
import * as RadixTooltip from '@radix-ui/react-tooltip';
import { Text } from '../Text/Text';
import './Tooltip.scss';

export type TooltipSide = 'top' | 'right' | 'bottom' | 'left';

export interface TooltipProps {
  /** Copy shown in the hover/focus bubble. */
  content: ReactNode;
  /** Trigger element. Wrap a compact control or an info marker. */
  children: ReactNode;
  /** Preferred placement. One of: top | right | bottom | left. */
  side?: TooltipSide;
  /** Delay before open, in milliseconds. */
  delayDuration?: number;
}

/** Info-marker glyph used next to field labels and switches. */
export function TooltipMarker({ label }: { label: string }) {
  return (
    <span
      className="tooltip__marker"
      tabIndex={0}
      aria-label={`More information about ${label}`}
    >
      ℹ
    </span>
  );
}

export function Tooltip({
  content,
  children,
  side = 'top',
  delayDuration = 200,
}: TooltipProps) {
  return (
    <RadixTooltip.Provider delayDuration={delayDuration}>
      <RadixTooltip.Root>
        <RadixTooltip.Trigger asChild>
          <span className="tooltip__trigger">{children}</span>
        </RadixTooltip.Trigger>
        <RadixTooltip.Portal>
          <RadixTooltip.Content
            className="tooltip"
            side={side}
            sideOffset={4}
            collisionPadding={8}
          >
            <Text as="span" variant="inherit">
              {content}
            </Text>
            <RadixTooltip.Arrow className="tooltip__arrow" width={8} height={4} />
          </RadixTooltip.Content>
        </RadixTooltip.Portal>
      </RadixTooltip.Root>
    </RadixTooltip.Provider>
  );
}
