import {
  ArrowDownIcon,
  ArrowUpIcon,
  CaretSortIcon,
  CheckCircledIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  Cross1Icon,
  CrossCircledIcon,
  ExclamationTriangleIcon,
  InfoCircledIcon,
} from '@radix-ui/react-icons';
import './LofiRadixIcons.scss';

export type LofiFeedbackIconSeverity = 'success' | 'info' | 'warning' | 'error';

type RadixGlyphIcon = typeof CheckCircledIcon;

const SEVERITY_ICONS: Record<LofiFeedbackIconSeverity, RadixGlyphIcon> = {
  success: CheckCircledIcon,
  info: InfoCircledIcon,
  warning: CrossCircledIcon,
  error: ExclamationTriangleIcon,
};

export interface FeedbackSeverityIconProps {
  severity: LofiFeedbackIconSeverity;
  className?: string;
  'aria-hidden'?: boolean | 'true' | 'false';
}

/** Severity glyph for toasts, inline alerts, and other feedback — [Radix Icons](https://www.radix-ui.com/icons), 25×25, inherits `color`. */
export function FeedbackSeverityIcon({
  severity,
  className,
  'aria-hidden': ariaHidden = true,
}: FeedbackSeverityIconProps) {
  const Cmp = SEVERITY_ICONS[severity];
  const cls = ['lofi-icon', className].filter(Boolean).join(' ');
  return <Cmp className={cls} width={25} height={25} aria-hidden={ariaHidden} />;
}

export interface DismissIconProps {
  className?: string;
  'aria-hidden'?: boolean | 'true' | 'false';
}

/** Cross 1 from [Radix Icons](https://www.radix-ui.com/icons) — dismiss affordance, 15×15, inherits `color`. */
export function DismissIcon({ className, 'aria-hidden': ariaHidden = true }: DismissIconProps) {
  const cls = ['lofi-icon', className].filter(Boolean).join(' ');
  return <Cross1Icon className={cls} width={15} height={15} aria-hidden={ariaHidden} />;
}

export interface LofiIconProps {
  className?: string;
  /** Pixel size for both width and height. Default 16. */
  size?: number;
  'aria-hidden'?: boolean | 'true' | 'false';
}

interface InternalIconProps extends LofiIconProps {
  Icon: RadixGlyphIcon;
}

function RadixGlyph({
  Icon,
  className,
  size = 16,
  'aria-hidden': ariaHidden = true,
}: InternalIconProps) {
  const cls = ['lofi-icon', 'lofi-icon--svg', className].filter(Boolean).join(' ');
  return (
    <Icon
      className={cls}
      width={size}
      height={size}
      aria-hidden={ariaHidden}
      style={{ width: size, height: size }}
    />
  );
}

/** Radix `CheckIcon`. Used for checkbox marks and selected dropdown items. */
export function LofiCheckIcon(props: LofiIconProps) {
  return <RadixGlyph Icon={CheckIcon} {...props} />;
}

/** Radix `ChevronDownIcon`. Used for select triggers, expand affordances, resize hints. */
export function LofiChevronDownIcon(props: LofiIconProps) {
  return <RadixGlyph Icon={ChevronDownIcon} {...props} />;
}

/** Radix `ChevronRightIcon`. Used for collapsed branches and rows. */
export function LofiChevronRightIcon(props: LofiIconProps) {
  return <RadixGlyph Icon={ChevronRightIcon} {...props} />;
}

/** Radix `ChevronUpIcon`. Reserved for inverted chevrons. */
export function LofiChevronUpIcon(props: LofiIconProps) {
  return <RadixGlyph Icon={ChevronUpIcon} {...props} />;
}

/** Radix `ArrowUpIcon`. Used for ascending sort indicators. */
export function LofiArrowUpIcon(props: LofiIconProps) {
  return <RadixGlyph Icon={ArrowUpIcon} {...props} />;
}

/** Radix `ArrowDownIcon`. Used for descending sort indicators. */
export function LofiArrowDownIcon(props: LofiIconProps) {
  return <RadixGlyph Icon={ArrowDownIcon} {...props} />;
}

/** Radix `CaretSortIcon`. Used for unsorted/sortable indicators. */
export function LofiCaretSortIcon(props: LofiIconProps) {
  return <RadixGlyph Icon={CaretSortIcon} {...props} />;
}

/** Radix `Cross1Icon`. Used for inline close/clear buttons. */
export function LofiCloseIcon(props: LofiIconProps) {
  return <RadixGlyph Icon={Cross1Icon} {...props} />;
}
