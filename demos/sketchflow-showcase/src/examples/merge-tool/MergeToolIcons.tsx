interface MergeToolIconProps {
  className?: string;
  size?: number;
}

/** Circular reset arrow — decorative, paired with the footer Reset button. */
export function MergeToolResetIcon({ className, size = 14 }: MergeToolIconProps) {
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
      <path
        d="M13.2 5A5.5 5.5 0 1 0 14 9"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="square"
      />
      <path
        d="M13.2 1.8V5h-3.2"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="square"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Two arrows colliding into one — decorative, paired with the footer Merge button. */
export function MergeToolMergeIcon({ className, size = 14 }: MergeToolIconProps) {
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
      <path
        d="M1 4.5 6 8l-5 3.5"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="square"
        strokeLinejoin="round"
      />
      <path
        d="M15 4.5 10 8l5 3.5"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="square"
        strokeLinejoin="round"
      />
      <circle cx="8" cy="8" r="1.3" fill="currentColor" />
    </svg>
  );
}
