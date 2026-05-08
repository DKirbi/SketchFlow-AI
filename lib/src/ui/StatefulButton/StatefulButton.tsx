import type { PointerEvent } from 'react';
import { Text } from '../Text/Text';
import type { ButtonVariant, ButtonSize } from '../Button/Button';
import './StatefulButton.scss';

export type StatefulButtonState = 'idle' | 'loading' | 'success';

export interface StatefulButtonProps {
  /**
   * Current state of the button.
   * - `idle`    — active; label is `idleLabel`; `onClick` fires normally.
   * - `loading` — disabled; shows `loadingLabel` (if provided) with dots animation.
   * - `success` — disabled; label is `successLabel`.
   */
  state: StatefulButtonState;
  /** Label rendered when `state === 'idle'`. */
  idleLabel: string;
  /** Label rendered when `state === 'success'` (button is disabled). */
  successLabel: string;
  /** Optional label prefix shown while `state === 'loading'` (e.g. "Saving"). */
  loadingLabel?: string;
  /** Visual variant — mirrors LOFIButton. Defaults to `primary`. */
  variant?: ButtonVariant;
  /** Density — mirrors LOFIButton. Defaults to `default`. */
  size?: ButtonSize;
  /** Called on click when `state === 'idle'`. */
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  /** Extra CSS class names on the root element. */
  className?: string;
  /** Native `title` tooltip. */
  title?: string;
  /** Pointer capture (e.g. stop propagation for canvas nodes). */
  onPointerDown?: (e: PointerEvent<HTMLButtonElement>) => void;
}

export function StatefulButton({
  state = 'idle',
  idleLabel,
  successLabel,
  loadingLabel,
  variant = 'primary',
  size = 'default',
  onClick,
  className,
  title,
  onPointerDown,
}: StatefulButtonProps) {
  const isLoading  = state === 'loading';
  const isSuccess  = state === 'success';
  const isDisabled = isLoading || isSuccess;

  const classes = [
    'btn',
    `btn--${variant}`,
    size === 'compact' ? 'btn--compact' : '',
    size === 'small' ? 'btn--small' : '',
    className ?? '',
  ].filter(Boolean).join(' ');

  return (
    <button
      type="button"
      className={classes}
      disabled={isDisabled}
      onClick={isDisabled ? undefined : onClick}
      title={title}
      onPointerDown={onPointerDown}
    >
      {isLoading ? (
        <>
          {loadingLabel && (
            <Text as="span" variant="inherit">{loadingLabel}</Text>
          )}
          <span className="stateful-btn__dots" aria-hidden="true" />
        </>
      ) : (
        <Text as="span" variant="inherit">
          {isSuccess ? successLabel : idleLabel}
        </Text>
      )}
    </button>
  );
}
