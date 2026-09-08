import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  LOFIToolbar,
  LOFITable,
  LOFIPagination,
  LOFIField,
  LOFIInput,
  LOFIButton,
  LOFIRadio,
  LOFICheckbox,
  LOFIBadge,
  LOFIText,
  LOFIModal,
  LOFILoader,
  LOFIToast,
  LOFIEmptyState,
  LOFIInlineAlert,
  LOFISelect,
} from 'lofi-kit';
import type { ColumnDef, TableColumnMeta } from 'lofi-kit';
import { MOCK_CATALOG_OPTIONS, type MockCatalogId } from 'shared-catalogs';
import { FilmRowDetail, DEFAULT_FILM_DETAIL_TAB, type FilmDetailTab } from './FilmRowDetail';
import { MergeToolResetIcon, MergeToolMergeIcon } from './MergeToolIcons';
import { getMergeCatalog } from './catalogs';
import {
  applyOverrides,
  CURRENT_USER,
  FIELD_KEYS,
  FIELD_LABELS,
  formatFieldValue,
  matchesQuery,
  matchLabel,
  nowTimestamp,
  type CrawledRecord,
  type DbFilmRecord,
  type FieldKey,
  type FilmRecord,
} from './mockData';
import './MergeToolExample.scss';

const MERGE_DELAY_MS = 1200;
const MERGE_PAGE_SIZE = 5;

function pageCount(total: number, pageSize: number): number {
  return Math.ceil(total / pageSize);
}

function slicePage<T>(rows: T[], page: number, pageSize: number): T[] {
  const start = (page - 1) * pageSize;
  return rows.slice(start, start + pageSize);
}

interface CrawlerRow extends CrawledRecord {
  confidence?: number;
}

interface ReviewRow {
  id: 'preview' | 'crawled';
  record: FilmRecord;
}

export function MergeToolExample() {
  const [catalogId, setCatalogId] = useState<MockCatalogId>('film');
  const mergeSource = useMemo(
    () => getMergeCatalog(catalogId),
    [catalogId],
  );

  const [dbMovies, setDbMovies] = useState<DbFilmRecord[]>(() => getMergeCatalog('film').cloneDb());
  const [dbSearchDraft, setDbSearchDraft] = useState('');
  const [dbSearchApplied, setDbSearchApplied] = useState('');
  const [selectedDbId, setSelectedDbId] = useState<string | null>(null);

  const [crawlerSearchDraft, setCrawlerSearchDraft] = useState('');
  const [crawlerSearchApplied, setCrawlerSearchApplied] = useState('');
  const [selectedCrawledId, setSelectedCrawledId] = useState<string | null>(null);
  const [dbPage, setDbPage] = useState(1);
  const [crawlerPage, setCrawlerPage] = useState(1);

  const [dbExpandedTabs, setDbExpandedTabs] = useState<Record<string, FilmDetailTab>>({});
  const [crawlerExpandedTabs, setCrawlerExpandedTabs] = useState<Record<string, FilmDetailTab>>({});

  const [modalOpen, setModalOpen] = useState(false);
  const [overrides, setOverrides] = useState<Set<FieldKey>>(() => new Set());
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [toast, setToast] = useState<{ severity: 'success'; message: string } | null>(null);

  const applyCatalog = useCallback((nextId: MockCatalogId) => {
    const source = getMergeCatalog(nextId);
    setCatalogId(nextId);
    setDbMovies(source.cloneDb());
    setDbSearchDraft('');
    setDbSearchApplied('');
    setSelectedDbId(null);
    setCrawlerSearchDraft('');
    setCrawlerSearchApplied('');
    setSelectedCrawledId(null);
    setDbPage(1);
    setCrawlerPage(1);
    setDbExpandedTabs({});
    setCrawlerExpandedTabs({});
    setModalOpen(false);
    setOverrides(new Set());
    setConfirmOpen(false);
    setConfirmLoading(false);
    setToast(null);
  }, []);

  const displayDbMovies = dbMovies;
  const displaySelectedDbId = selectedDbId;
  const displaySelectedCrawledId = selectedCrawledId;
  const displayModalOpen = modalOpen;
  const displayOverrides = overrides;
  const displayConfirmOpen = confirmOpen;
  const displayConfirmLoading = confirmLoading;
  const displayToast = toast;

  const selectedDbMovie = useMemo(
    () => displayDbMovies.find((m) => m.id === displaySelectedDbId) ?? null,
    [displayDbMovies, displaySelectedDbId],
  );
  const selectedCrawledRecord = useMemo(
    () => mergeSource.crawled.find((r) => r.id === displaySelectedCrawledId) ?? null,
    [displaySelectedCrawledId, mergeSource.crawled],
  );

  const dbRows = useMemo(() => {
    const query = dbSearchApplied;
    return displayDbMovies.filter((m) => matchesQuery(m, query));
  }, [dbSearchApplied, displayDbMovies]);

  const crawlerQueryActive = crawlerSearchApplied.trim().length > 0;

  const crawlerRows = useMemo<CrawlerRow[]>(() => {
    if (crawlerQueryActive) {
      return mergeSource.crawled.filter((r) => matchesQuery(r, crawlerSearchApplied)).map((r) => ({ ...r }));
    }
    if (!selectedDbMovie) return [];
    return (mergeSource.suggestions[selectedDbMovie.id] ?? []).map((c) => ({ ...c.record, confidence: c.confidence }));
  }, [crawlerQueryActive, crawlerSearchApplied, mergeSource, selectedDbMovie]);

  useEffect(() => {
    const count = pageCount(dbRows.length, MERGE_PAGE_SIZE);
    setDbPage((current) => (count === 0 ? 1 : Math.min(current, count)));
  }, [dbRows.length, dbSearchApplied, catalogId]);

  useEffect(() => {
    const count = pageCount(crawlerRows.length, MERGE_PAGE_SIZE);
    setCrawlerPage((current) => (count === 0 ? 1 : Math.min(current, count)));
  }, [crawlerRows.length, crawlerSearchApplied, displaySelectedDbId]);

  const dbPageCount = pageCount(dbRows.length, MERGE_PAGE_SIZE);
  const crawlerPageCount = pageCount(crawlerRows.length, MERGE_PAGE_SIZE);
  const pagedDbRows = slicePage(dbRows, dbPage, MERGE_PAGE_SIZE);
  const pagedCrawlerRows = slicePage(crawlerRows, crawlerPage, MERGE_PAGE_SIZE);

  const showCrawlerFirstUse = !selectedDbMovie && !crawlerQueryActive;

  const canMerge = Boolean(displaySelectedDbId && displaySelectedCrawledId);

  const previewRecord = useMemo(() => {
    if (!selectedDbMovie || !selectedCrawledRecord) return null;
    return applyOverrides(selectedDbMovie, selectedCrawledRecord, displayOverrides);
  }, [selectedDbMovie, selectedCrawledRecord, displayOverrides]);

  const reviewRows = useMemo<ReviewRow[]>(() => {
    if (!previewRecord || !selectedCrawledRecord) return [];
    return [
      { id: 'preview', record: previewRecord },
      { id: 'crawled', record: selectedCrawledRecord },
    ];
  }, [previewRecord, selectedCrawledRecord]);

  const allOverridden = FIELD_KEYS.every((f) => displayOverrides.has(f));

  const handleReset = useCallback(() => {
    setDbSearchDraft('');
    setDbSearchApplied('');
    setSelectedDbId(null);
    setCrawlerSearchDraft('');
    setCrawlerSearchApplied('');
    setSelectedCrawledId(null);
    setDbPage(1);
    setCrawlerPage(1);
  }, []);

  const openMergeModal = useCallback(() => {
    if (!selectedDbId || !selectedCrawledId) return;
    setOverrides(new Set());
    setModalOpen(true);
  }, [selectedDbId, selectedCrawledId]);

  const closeModal = useCallback(() => {
    setModalOpen(false);
    setOverrides(new Set());
  }, []);

  const modalReset = useCallback(() => {
    setOverrides(new Set());
  }, []);

  const toggleOverride = useCallback(
    (field: FieldKey) => {
      setOverrides((prev) => {
        const next = new Set(prev);
        if (next.has(field)) next.delete(field);
        else next.add(field);
        return next;
      });
    },
    [],
  );

  const toggleMaster = useCallback(() => {
    setOverrides((prev) => (prev.size === FIELD_KEYS.length ? new Set() : new Set(FIELD_KEYS)));
  }, []);

  const requestMerge = useCallback(() => {
    if (overrides.size === 0) return;
    setConfirmOpen(true);
  }, [overrides]);

  const cancelConfirm = useCallback(() => {
    setConfirmOpen(false);
  }, []);

  const commitMerge = useCallback(() => {
    if (!selectedDbMovie || !selectedCrawledRecord) return;
    setConfirmLoading(true);
    setTimeout(() => {
      setDbMovies((prev) =>
        prev.map((movie) =>
          movie.id === selectedDbMovie.id
            ? {
                ...applyOverrides(movie, selectedCrawledRecord, overrides),
                merged: true,
                mergedAt: nowTimestamp(),
                mergedBy: CURRENT_USER.handle,
              }
            : movie,
        ),
      );
      setConfirmLoading(false);
      setConfirmOpen(false);
      setModalOpen(false);
      setToast({ severity: 'success', message: `${selectedDbMovie.title} merged into the database.` });
      setSelectedDbId(null);
      setSelectedCrawledId(null);
      setOverrides(new Set());
    }, MERGE_DELAY_MS);
  }, [overrides, selectedCrawledRecord, selectedDbMovie]);

  const dbColumns = useMemo<ColumnDef<DbFilmRecord, unknown>[]>(
    () => [
      {
        id: 'id',
        header: 'ID',
        size: 96,
        meta: { shrink: true } satisfies TableColumnMeta,
        cell: ({ row }) => (
          <span>
            <LOFIBadge variant="id" label={row.original.id} />
          </span>
        ),
      },
      {
        id: 'title',
        header: 'Title',
        cell: ({ row }) => (
          <span className="merge-tool-example__title-cell">
            <LOFIText variant="body">{row.original.title}</LOFIText>
            {row.original.originalTitle && (
              <LOFIText variant="muted">{row.original.originalTitle}</LOFIText>
            )}
            {row.original.merged && <LOFIBadge variant="status" active label="merged" />}
          </span>
        ),
      },
      {
        id: 'releaseDate',
        header: 'Release Date',
        size: 120,
        meta: { shrink: true } satisfies TableColumnMeta,
        cell: ({ row }) => <LOFIText variant="body">{row.original.releaseDate}</LOFIText>,
      },
      {
        id: 'genre',
        header: 'Genre',
        size: 160,
        cell: ({ row }) => <LOFIText variant="body">{row.original.genre}</LOFIText>,
      },
      {
        id: 'origin',
        header: 'Origin',
        size: 140,
        cell: ({ row }) => <LOFIText variant="body">{row.original.origin}</LOFIText>,
      },
      {
        id: 'director',
        header: 'Director',
        size: 180,
        cell: ({ row }) => <LOFIText variant="body">{row.original.director}</LOFIText>,
      },
      {
        id: 'cast',
        header: 'Top Cast',
        size: 220,
        cell: ({ row }) => (
          <span className="merge-tool-example__cast-cell">
            <LOFIText variant="body">{row.original.cast.join(', ')}</LOFIText>
            <LOFIButton
              variant="dismiss"
              size="compact"
              aria-label={`Show full cast, staff, and filming locations for ${row.original.title}`}
              onClick={(e) => {
                e.stopPropagation();
                row.toggleExpanded();
              }}
            >
              …
            </LOFIButton>
          </span>
        ),
      },
      {
        id: 'select',
        header: 'Select',
        meta: { shrink: true } satisfies TableColumnMeta,
        cell: ({ row }) => (
          <span className="merge-tool-example__radio-cell" onClick={(e) => e.stopPropagation()}>
            <LOFIRadio
              name="db-select"
              value={displaySelectedDbId ?? ''}
              onChange={(value) => {
                setSelectedDbId(value);
                setCrawlerPage(1);
              }}
              options={[{ value: row.original.id, label: '' }]}
            />
          </span>
        ),
      },
    ],
    [displaySelectedDbId],
  );

  const crawlerColumns = useMemo<ColumnDef<CrawlerRow, unknown>[]>(
    () => [
      {
        id: 'id',
        header: 'ID',
        size: 96,
        meta: { shrink: true } satisfies TableColumnMeta,
        cell: ({ row }) => (
          <span>
            <LOFIBadge variant="id" label={row.original.id} />
          </span>
        ),
      },
      {
        id: 'title',
        header: 'Title',
        cell: ({ row }) => (
          <span className="merge-tool-example__title-cell">
            <LOFIText variant="body">{row.original.title}</LOFIText>
            {row.original.originalTitle && (
              <LOFIText variant="muted">{row.original.originalTitle}</LOFIText>
            )}
            <LOFIText variant="micro">{row.original.source}</LOFIText>
          </span>
        ),
      },
      {
        id: 'releaseDate',
        header: 'Release Date',
        size: 120,
        meta: { shrink: true } satisfies TableColumnMeta,
        cell: ({ row }) => <LOFIText variant="body">{row.original.releaseDate}</LOFIText>,
      },
      {
        id: 'genre',
        header: 'Genre',
        size: 160,
        cell: ({ row }) => <LOFIText variant="body">{row.original.genre}</LOFIText>,
      },
      {
        id: 'origin',
        header: 'Origin',
        size: 140,
        cell: ({ row }) => <LOFIText variant="body">{row.original.origin}</LOFIText>,
      },
      {
        id: 'director',
        header: 'Director',
        size: 180,
        cell: ({ row }) => <LOFIText variant="body">{row.original.director}</LOFIText>,
      },
      {
        id: 'cast',
        header: 'Top Cast',
        size: 220,
        cell: ({ row }) => (
          <span className="merge-tool-example__cast-cell">
            <LOFIText variant="body">{row.original.cast.join(', ')}</LOFIText>
            <LOFIButton
              variant="dismiss"
              size="compact"
              aria-label={`Show full cast, staff, and filming locations for ${row.original.title}`}
              onClick={(e) => {
                e.stopPropagation();
                row.toggleExpanded();
              }}
            >
              …
            </LOFIButton>
          </span>
        ),
      },
      {
        id: 'match',
        header: 'Match',
        size: 150,
        meta: { shrink: true } satisfies TableColumnMeta,
        cell: ({ row }) =>
          row.original.confidence !== undefined ? (
            <LOFIBadge variant="tag" label={matchLabel(row.original.confidence)} />
          ) : (
            <LOFIText variant="muted">—</LOFIText>
          ),
      },
      {
        id: 'select',
        header: 'Select',
        meta: { shrink: true } satisfies TableColumnMeta,
        cell: ({ row }) => (
          <span className="merge-tool-example__radio-cell" onClick={(e) => e.stopPropagation()}>
            <LOFIRadio
              name="crawled-select"
              value={displaySelectedCrawledId ?? ''}
              onChange={(value) => {
                setSelectedCrawledId(value);
              }}
              options={[{ value: row.original.id, label: '' }]}
            />
          </span>
        ),
      },
    ],
    [displaySelectedCrawledId],
  );

  const reviewColumns = useMemo<ColumnDef<ReviewRow, unknown>[]>(() => {
    const fieldColumn = (field: FieldKey): ColumnDef<ReviewRow, unknown> => ({
      id: field,
      header: FIELD_LABELS[field],
      cell: ({ row }) => {
        const value = formatFieldValue(field, row.original.record);
        if (row.original.id === 'preview') {
          return (
            <div className="merge-tool-example__review-cell">
              <LOFIText variant="body">{value}</LOFIText>
              {displayOverrides.has(field) && <LOFIBadge variant="tag" label="overridden" />}
            </div>
          );
        }
        return (
          <div className="merge-tool-example__review-cell">
            <LOFIText variant="body">{value}</LOFIText>
            <span
              className="merge-tool-example__review-checkbox"
            >
              <LOFICheckbox
                size="sm"
                label=""
                id={`override-${field}`}
                checked={displayOverrides.has(field)}
                onChange={() => toggleOverride(field)}
                />
            </span>
          </div>
        );
      },
    });

    return [
      {
        id: 'rowLabel',
        header: 'Record',
        meta: { shrink: true } satisfies TableColumnMeta,
        cell: ({ row }) =>
          row.original.id === 'preview' ? (
            <LOFIText variant="strong">Preview</LOFIText>
          ) : (
            <div className="merge-tool-example__review-cell">
              <LOFIText variant="strong">Crawled data</LOFIText>
              <span
                className="merge-tool-example__review-checkbox"
              >
                <LOFICheckbox
                  size="sm"
                  label="Override all"
                  id="override-all"
                  checked={allOverridden}
                  onChange={toggleMaster}
                    />
              </span>
            </div>
          ),
      },
      fieldColumn('title'),
      fieldColumn('releaseDate'),
      fieldColumn('genre'),
      fieldColumn('origin'),
      fieldColumn('director'),
      fieldColumn('cast'),
    ];
  }, [allOverridden, displayOverrides, toggleMaster, toggleOverride]);

  return (
    <div className="merge-tool-example">
      <LOFIToolbar
        left={
          <span className="merge-tool-example__identity">
            <LOFIText variant="sm">{CURRENT_USER.handle}</LOFIText>
            <LOFIBadge variant="tag" label={CURRENT_USER.role} />
          </span>
        }
        center={
          <LOFIText as="h1" variant="body">
            Merge Tool
          </LOFIText>
        }
        right={
          <LOFIField label="Mock database" htmlFor="merge-catalog" inline>
            <LOFISelect
              id="merge-catalog"
              size="compact"
              value={catalogId}
              options={MOCK_CATALOG_OPTIONS.map((option) => ({
                value: option.value,
                label: option.label,
              }))}
              onChange={(value) => applyCatalog(value as MockCatalogId)}
            />
          </LOFIField>
        }
      />

      <div className="merge-tool-example__content">
        <div className="merge-tool-example__stack">
          <section className="merge-tool-example__column">
            <LOFIText as="h2" variant="strong">
              Our Database
            </LOFIText>
            <div className="merge-tool-example__search" role="search">
              <LOFIField label="Search" htmlFor="db-search">
                <LOFIInput
                  id="db-search"
                  type="search"
                  allowClear
                      placeholder="Title, ID, director…"
                  value={dbSearchDraft}
                  onChange={setDbSearchDraft}
                />
              </LOFIField>
              <LOFIButton
                variant="primary"
                disabled={dbSearchDraft === dbSearchApplied}
                onClick={() => {
                  setDbSearchApplied(dbSearchDraft);
                  setDbPage(1);
                }}
              >
                Search
              </LOFIButton>
              <LOFIButton
                variant="dismiss"
                disabled={(!dbSearchDraft && !dbSearchApplied)}
                onClick={() => {
                  setDbSearchDraft('');
                  setDbSearchApplied('');
                  setDbPage(1);
                }}
              >
                Clear
              </LOFIButton>
            </div>
            <LOFITable<DbFilmRecord>
              columns={dbColumns}
              rows={pagedDbRows}
              keyField="id"
              expandable
              renderExpanded={(row) => (
                <FilmRowDetail
                  record={row.original}
                  activeTab={dbExpandedTabs[row.original.id] ?? DEFAULT_FILM_DETAIL_TAB}
                  onTabChange={(tab) =>
                    setDbExpandedTabs((prev) => ({ ...prev, [row.original.id]: tab }))
                  }
                />
              )}
              emptySlot={
                <LOFIEmptyState
                  variant="no-results"
                  title="No titles match your search"
                  description="Try a different title, ID, or director."
                />
              }
            />
            <LOFIPagination
              ariaLabel="Our Database pagination"
              page={dbPage}
              pageCount={dbPageCount}
              total={dbRows.length}
              pageSize={MERGE_PAGE_SIZE}
              onPageChange={setDbPage}
            />
          </section>

          <section className="merge-tool-example__column">
            <LOFIText as="h2" variant="strong">
              Crawler Matches
            </LOFIText>
            {showCrawlerFirstUse ? (
              <LOFIEmptyState
                variant="first-use"
                title="Select a title from the database"
                description="Choose a row from Our Database to see suggested crawl matches, or search the crawler directly."
              />
            ) : (
              <>
                <div className="merge-tool-example__search" role="search">
                  <LOFIField label="Search crawler" htmlFor="crawler-search">
                    <LOFIInput
                      id="crawler-search"
                      type="search"
                      allowClear
                              placeholder="Search the full crawler database…"
                      value={crawlerSearchDraft}
                      onChange={setCrawlerSearchDraft}
                    />
                  </LOFIField>
                  <LOFIButton
                    variant="primary"
                    disabled={crawlerSearchDraft === crawlerSearchApplied}
                    onClick={() => {
                      setCrawlerSearchApplied(crawlerSearchDraft);
                      setCrawlerPage(1);
                    }}
                  >
                    Search
                  </LOFIButton>
                  <LOFIButton
                    variant="dismiss"
                    disabled={(!crawlerSearchDraft && !crawlerSearchApplied)}
                    onClick={() => {
                      setCrawlerSearchDraft('');
                      setCrawlerSearchApplied('');
                      setCrawlerPage(1);
                    }}
                  >
                    {crawlerQueryActive ? 'Back to suggestions' : 'Clear'}
                  </LOFIButton>
                </div>
                {!crawlerQueryActive && selectedDbMovie && (
                  <LOFIInlineAlert
                    severity="info"
                    title="Suggested matches"
                    message={`${crawlerRows.length} possible match${crawlerRows.length === 1 ? '' : 'es'} found by the crawler for "${selectedDbMovie.title}".`}
                  />
                )}
                <LOFITable<CrawlerRow>
                  columns={crawlerColumns}
                  rows={pagedCrawlerRows}
                  keyField="id"
                  expandable
                  renderExpanded={(row) => (
                    <FilmRowDetail
                      record={row.original}
                      activeTab={crawlerExpandedTabs[row.original.id] ?? DEFAULT_FILM_DETAIL_TAB}
                      onTabChange={(tab) =>
                        setCrawlerExpandedTabs((prev) => ({ ...prev, [row.original.id]: tab }))
                      }
                    />
                  )}
                  emptySlot={
                    <LOFIEmptyState
                      variant="no-results"
                      title="No crawler matches"
                      description="Try a different search term."
                    />
                  }
                />
                <LOFIPagination
                  ariaLabel="Crawler Matches pagination"
                  page={crawlerPage}
                  pageCount={crawlerPageCount}
                  total={crawlerRows.length}
                  pageSize={MERGE_PAGE_SIZE}
                  onPageChange={setCrawlerPage}
                />
              </>
            )}
          </section>
        </div>
      </div>

      <div className="merge-tool-example__footer">
        <LOFIButton variant="dismiss" onClick={handleReset}>
          <span className="merge-tool-example__btn-label">
            <MergeToolResetIcon />
            <LOFIText as="span" variant="inherit">
              Reset
            </LOFIText>
          </span>
        </LOFIButton>
        <span>
          <LOFIButton variant="primary" onClick={openMergeModal} disabled={!canMerge}>
            <span className="merge-tool-example__btn-label">
              <MergeToolMergeIcon />
              <LOFIText as="span" variant="inherit">
                Merge
              </LOFIText>
            </span>
          </LOFIButton>
        </span>
      </div>

      <LOFIModal
        open={displayModalOpen}
        onClose={closeModal}
        title={selectedDbMovie ? `Review merge — ${selectedDbMovie.title}` : 'Review merge'}
        size="wide"
        footer={
          <>
            <LOFIButton variant="dismiss" onClick={modalReset} disabled={displayOverrides.size === 0}>
              Reset
            </LOFIButton>
            <span>
              <LOFIButton variant="primary" onClick={requestMerge} disabled={displayOverrides.size === 0}>
                Merge
              </LOFIButton>
            </span>
          </>
        }
      >
        <LOFITable<ReviewRow> columns={reviewColumns} rows={reviewRows} keyField="id" />
      </LOFIModal>

      <LOFIModal
        open={displayConfirmOpen}
        onClose={cancelConfirm}
        title="Merge into database?"
        footer={
          <>
            <LOFIButton variant="dismiss" onClick={cancelConfirm} disabled={displayConfirmLoading}>
              Cancel
            </LOFIButton>
            <span>
              <LOFIButton variant="primary" onClick={commitMerge} disabled={displayConfirmLoading}>
                {displayConfirmLoading ? <LOFILoader label="Merging" /> : 'Merge movie'}
              </LOFIButton>
            </span>
          </>
        }
      >
        <LOFIText variant="body">
          {selectedDbMovie && selectedCrawledRecord
            ? `This will update "${selectedDbMovie.title}" with ${displayOverrides.size} field${displayOverrides.size === 1 ? '' : 's'} from ${selectedCrawledRecord.source}. This cannot be undone.`
            : ''}
        </LOFIText>
      </LOFIModal>

      {displayToast && (
        <LOFIToast
          severity={displayToast.severity}
          message={displayToast.message}
          autoDismiss={4000}
          onDismiss={() => setToast(null)}
        />
      )}
    </div>
  );
}
