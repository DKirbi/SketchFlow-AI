interface ShowcaseIconProps {
  className?: string;
  size?: number;
}

/** Unlocked padlock — interactive mode available. */
export function ShowcaseLockOpenIcon({ className, size = 14 }: ShowcaseIconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect x="3.5" y="7" width="9" height="7" stroke="currentColor" strokeWidth="1.25" />
      <path
        d="M5.5 7V5a2.5 2.5 0 0 1 5 0"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="square"
      />
    </svg>
  );
}

/** Locked padlock — automated preview, prototype not interactive. */
export function ShowcaseLockClosedIcon({ className, size = 14 }: ShowcaseIconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect x="3.5" y="7" width="9" height="7" stroke="currentColor" strokeWidth="1.25" />
      <path
        d="M5.5 7V5.5a2.5 2.5 0 0 1 5 0V7"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="square"
      />
    </svg>
  );
}
