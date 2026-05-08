import { Button } from '../Button/Button';
import { Select } from '../Select/Select';
import { Text } from '../Text/Text';
import './Pagination.scss';

export interface PaginationProps {
  /** Current page (1-based). */
  page:               number;
  /** Total number of pages (0 means no pages; controls show idle state). */
  pageCount:          number;
  /** Total row count across all pages. */
  total:              number;
  /** Rows per page. */
  pageSize:           number;
  /** Called with the new 1-based page index. */
  onPageChange:       (page: number) => void;
  /** Optional page-size choices; when set, shows a compact `LOFISelect` on the right. */
  pageSizeOptions?:   number[];
  /** Called with the new page size when `pageSizeOptions` is provided. */
  onPageSizeChange?:  (pageSize: number) => void;
  /** If true, all controls are non-interactive. */
  disabled?:          boolean;
  /** Extra CSS class on the root `nav`. */
  className?:         string;
}

export function Pagination({
  page,
  pageCount,
  total,
  pageSize,
  onPageChange,
  pageSizeOptions,
  onPageSizeChange,
  disabled,
  className,
}: PaginationProps) {
  const pagesForLabel = pageCount > 0 ? pageCount : 1;
  const prevDisabled = disabled || page <= 1;
  const nextDisabled =
    disabled || pageCount <= 0 || page >= pageCount;

  const showPageSize =
    pageSizeOptions &&
    pageSizeOptions.length > 0 &&
    onPageSizeChange !== undefined;

  const sizeSelectOptions = showPageSize
    ? pageSizeOptions!.map((n) => ({
        value: String(n),
        label: `${n} per page`,
      }))
    : [];

  const classes = ['pagination', className ?? ''].filter(Boolean).join(' ');

  return (
    <nav className={classes} aria-label="Table pagination">
      <div className="pagination__left">
        <Text variant="muted" as="span">
          {total} {total === 1 ? 'record' : 'records'}
        </Text>
      </div>
      <div className="pagination__center">
        <Button
          type="button"
          variant="default"
          size="compact"
          disabled={prevDisabled}
          title="Previous page"
          aria-label="Previous page"
          onClick={() => onPageChange(page - 1)}
        >
          ←
        </Button>
        <Text variant="body" as="span" className="pagination__status">
          Page {page} of {pagesForLabel}
        </Text>
        <Button
          type="button"
          variant="default"
          size="compact"
          disabled={nextDisabled}
          title="Next page"
          aria-label="Next page"
          onClick={() => onPageChange(page + 1)}
        >
          →
        </Button>
      </div>
      {showPageSize ? (
        <div className="pagination__right">
          <Select
            value={String(pageSize)}
            onChange={(v) => onPageSizeChange!(Number(v))}
            options={sizeSelectOptions}
            size="compact"
            disabled={disabled}
          />
        </div>
      ) : null}
    </nav>
  );
}
