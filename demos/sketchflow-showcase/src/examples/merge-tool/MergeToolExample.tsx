import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  LOFIToolbar,
  LOFITable,
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
} from 'lofi-kit';
import type { ColumnDef, TableColumnMeta } from 'lofi-kit';
import type { ShowcaseExampleProps } from './metadata';
import { computeAutomatedSnapshot } from './automatedPreview';
import { MergeToolPreviewCursor } from './MergeToolPreviewCursor';
import { previewTargetAttr, resolveCursorTarget } from './previewCursor';
import { detectReducedMotion } from '../../runtime/previewStateMachine';
import { FilmRowDetail, DEFAULT_FILM_DETAIL_TAB, type FilmDetailTab } from './FilmRowDetail';
import { MergeToolResetIcon, MergeToolMergeIcon } from './MergeToolIcons';
import {
  applyOverrides,
  cloneDbMovies,
  CRAWLED_RECORDS,
  CURRENT_USER,
  FIELD_KEYS,
  FIELD_LABELS,
  formatFieldValue,
  matchesQuery,
  matchLabel,
  nowTimestamp,
  SUGGESTIONS,
  type CrawledRecord,
  type DbFilmRecord,
  type FieldKey,
  type FilmRecord,
} from './mockData';
import './MergeToolExample.scss';

const MERGE_DELAY_MS = 1200;

interface CrawlerRow extends CrawledRecord {
  confidence?: number;
}

interface ReviewRow {
  id: 'preview' | 'crawled';
  record: FilmRecord;
}

function isAutomatedMode(mode: ShowcaseExampleProps['mode']): boolean {
  return mode === 'preview' || mode === 'ready';
}

export function MergeToolExample({
  mode,
  previewStepIndex,
  previewSteps,
  onInteractionComplete,
}: ShowcaseExampleProps) {
  const automated = isAutomatedMode(mode);
  const reducedMotion = useMemo(() => detectReducedMotion(), []);

  const automatedSnapshot = useMemo(
    () => computeAutomatedSnapshot(previewSteps, previewStepIndex),
    [previewStepIndex, previewSteps],
  );

  const cursorTarget = useMemo(() => {
    if (!automated || previewStepIndex < 0) return null;
    return resolveCursorTarget(previewSteps[previewStepIndex]);
  }, [automated, previewStepIndex, previewSteps]);

  const [dbMovies, setDbMovies] = useState<DbFilmRecord[]>(() => cloneDbMovies());
  const [dbSearchDraft, setDbSearchDraft] = useState('');
  const [dbSearchApplied, setDbSearchApplied] = useState('');
  const [selectedDbId, setSelectedDbId] = useState<string | null>(null);

  const [crawlerSearchDraft, setCrawlerSearchDraft] = useState('');
  const [crawlerSearchApplied, setCrawlerSearchApplied] = useState('');
  const [selectedCrawledId, setSelectedCrawledId] = useState<string | null>(null);

  const [dbExpandedTabs, setDbExpandedTabs] = useState<Record<string, FilmDetailTab>>({});
  const [crawlerExpandedTabs, setCrawlerExpandedTabs] = useState<Record<string, FilmDetailTab>>({});

  const [modalOpen, setModalOpen] = useState(false);
  const [overrides, setOverrides] = useState<Set<FieldKey>>(() => new Set());
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [toast, setToast] = useState<{ severity: 'success'; message: string } | null>(null);
  const [hasCompletedInteraction, setHasCompletedInteraction] = useState(false);

  const resetState = useCallback(() => {
    setDbMovies(cloneDbMovies());
    setDbSearchDraft('');
    setDbSearchApplied('');
    setSelectedDbId(null);
    setCrawlerSearchDraft('');
    setCrawlerSearchApplied('');
    setSelectedCrawledId(null);
    setModalOpen(false);
    setOverrides(new Set());
    setConfirmOpen(false);
    setConfirmLoading(false);
    setToast(null);
    setHasCompletedInteraction(false);
  }, []);

  useEffect(() => {
    if (mode === 'interactive') resetState();
  }, [mode, resetState]);

  const displayDbMovies = automated ? automatedSnapshot.dbMovies : dbMovies;
  const displaySelectedDbId = automated ? automatedSnapshot.selectedDbId : selectedDbId;
  const displaySelectedCrawledId = automated ? automatedSnapshot.selectedCrawledId : selectedCrawledId;
  const displayModalOpen = automated ? automatedSnapshot.modalOpen : modalOpen;
  const displayOverrides = automated ? automatedSnapshot.overrides : overrides;
  const displayConfirmOpen = automated ? automatedSnapshot.confirmOpen : confirmOpen;
  const displayConfirmLoading = automated ? automatedSnapshot.confirmLoading : confirmLoading;
  const displayToast = automated ? automatedSnapshot.toast : toast;
  const displayHighlightMergeButton = automated && automatedSnapshot.highlightMergeButton;
  const displayHighlightModalMerge = automated && automatedSnapshot.highlightModalMerge;

  const selectedDbMovie = useMemo(
    () => displayDbMovies.find((m) => m.id === displaySelectedDbId) ?? null,
    [displayDbMovies, displaySelectedDbId],
  );
  const selectedCrawledRecord = useMemo(
    () => CRAWLED_RECORDS.find((r) => r.id === displaySelectedCrawledId) ?? null,
    [displaySelectedCrawledId],
  );

  const dbRows = useMemo(() => {
    const query = automated ? '' : dbSearchApplied;
    return displayDbMovies.filter((m) => matchesQuery(m, query));
  }, [automated, dbSearchApplied, displayDbMovies]);

  const crawlerQueryActive = !automated && crawlerSearchApplied.trim().length > 0;

  const crawlerRows = useMemo<CrawlerRow[]>(() => {
    if (crawlerQueryActive) {
      return CRAWLED_RECORDS.filter((r) => matchesQuery(r, crawlerSearchApplied)).map((r) => ({ ...r }));
    }
    if (!selectedDbMovie) return [];
    return (SUGGESTIONS[selectedDbMovie.id] ?? []).map((c) => ({ ...c.record, confidence: c.confidence }));
  }, [crawlerQueryActive, crawlerSearchApplied, selectedDbMovie]);

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
    if (automated) return;
    setDbSearchDraft('');
    setDbSearchApplied('');
    setSelectedDbId(null);
    setCrawlerSearchDraft('');
    setCrawlerSearchApplied('');
    setSelectedCrawledId(null);
  }, [automated]);

  const openMergeModal = useCallback(() => {
    if (automated) return;
    if (!selectedDbId || !selectedCrawledId) return;
    setOverrides(new Set());
    setModalOpen(true);
  }, [automated, selectedDbId, selectedCrawledId]);

  const closeModal = useCallback(() => {
    if (automated) return;
    setModalOpen(false);
    setOverrides(new Set());
  }, [automated]);

  const modalReset = useCallback(() => {
    if (automated) return;
    setOverrides(new Set());
  }, [automated]);

  const toggleOverride = useCallback(
    (field: FieldKey) => {
      if (automated) return;
      setOverrides((prev) => {
        const next = new Set(prev);
        if (next.has(field)) next.delete(field);
        else next.add(field);
        return next;
      });
    },
    [automated],
  );

  const toggleMaster = useCallback(() => {
    if (automated) return;
    setOverrides((prev) => (prev.size === FIELD_KEYS.length ? new Set() : new Set(FIELD_KEYS)));
  }, [automated]);

  const requestMerge = useCallback(() => {
    if (automated) return;
    if (overrides.size === 0) return;
    setConfirmOpen(true);
  }, [automated, overrides]);

  const cancelConfirm = useCallback(() => {
    if (automated) return;
    setConfirmOpen(false);
  }, [automated]);

  const commitMerge = useCallback(() => {
    if (automated) return;
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
      if (!hasCompletedInteraction) {
        setHasCompletedInteraction(true);
        onInteractionComplete();
      }
    }, MERGE_DELAY_MS);
  }, [automated, hasCompletedInteraction, onInteractionComplete, overrides, selectedCrawledRecord, selectedDbMovie]);

  const dbColumns = useMemo<ColumnDef<DbFilmRecord, unknown>[]>(
    () => [
      {
        id: 'id',
        header: 'ID',
        size: 96,
        meta: { shrink: true } satisfies TableColumnMeta,
        cell: ({ row }) => (
          <span data-preview-target={previewTargetAttr({ kind: 'db-row', targetId: row.original.id })}>
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
                if (!automated) setSelectedDbId(value);
              }}
              options={[{ value: row.original.id, label: '' }]}
              disabled={automated}
            />
          </span>
        ),
      },
    ],
    [automated, displaySelectedDbId],
  );

  const crawlerColumns = useMemo<ColumnDef<CrawlerRow, unknown>[]>(
    () => [
      {
        id: 'id',
        header: 'ID',
        size: 96,
        meta: { shrink: true } satisfies TableColumnMeta,
        cell: ({ row }) => (
          <span data-preview-target={previewTargetAttr({ kind: 'crawled-row', targetId: row.original.id })}>
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
                if (!automated) setSelectedCrawledId(value);
              }}
              options={[{ value: row.original.id, label: '' }]}
              disabled={automated}
            />
          </span>
        ),
      },
    ],
    [automated, displaySelectedCrawledId],
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
              data-preview-target={previewTargetAttr({ kind: 'field-checkbox', targetId: field })}
            >
              <LOFICheckbox
                size="sm"
                label=""
                id={`override-${field}`}
                checked={displayOverrides.has(field)}
                onChange={() => toggleOverride(field)}
                disabled={automated}
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
                data-preview-target={previewTargetAttr({ kind: 'master-checkbox' })}
              >
                <LOFICheckbox
                  size="sm"
                  label="Override all"
                  id="override-all"
                  checked={allOverridden}
                  onChange={toggleMaster}
                  disabled={automated}
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
  }, [allOverridden, automated, displayOverrides, toggleMaster, toggleOverride]);

  return (
    <div className="merge-tool-example">
      <MergeToolPreviewCursor target={cursorTarget} visible={automated} reducedMotion={reducedMotion} />

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
      />

      <div className="merge-tool-example__content">
        <div className="merge-tool-example__columns">
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
                  disabled={automated}
                  placeholder="Title, ID, director…"
                  value={dbSearchDraft}
                  onChange={setDbSearchDraft}
                />
              </LOFIField>
              <LOFIButton
                variant="primary"
                disabled={automated || dbSearchDraft === dbSearchApplied}
                onClick={() => setDbSearchApplied(dbSearchDraft)}
              >
                Search
              </LOFIButton>
              <LOFIButton
                variant="dismiss"
                disabled={automated || (!dbSearchDraft && !dbSearchApplied)}
                onClick={() => {
                  setDbSearchDraft('');
                  setDbSearchApplied('');
                }}
              >
                Clear
              </LOFIButton>
            </div>
            <LOFITable<DbFilmRecord>
              columns={dbColumns}
              rows={dbRows}
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
          </section>

          <section className="merge-tool-example__column">
            <LOFIText as="h2" variant="strong">
              Crawler Matches
            </LOFIText>
            {showCrawlerFirstUse ? (
              <LOFIEmptyState
                variant="first-use"
                title="Select a title from the database"
                description="Choose a row on the left to see suggested crawl matches, or search the crawler directly."
              />
            ) : (
              <>
                <div className="merge-tool-example__search" role="search">
                  <LOFIField label="Search crawler" htmlFor="crawler-search">
                    <LOFIInput
                      id="crawler-search"
                      type="search"
                      allowClear
                      disabled={automated}
                      placeholder="Search the full crawler database…"
                      value={crawlerSearchDraft}
                      onChange={setCrawlerSearchDraft}
                    />
                  </LOFIField>
                  <LOFIButton
                    variant="primary"
                    disabled={automated || crawlerSearchDraft === crawlerSearchApplied}
                    onClick={() => setCrawlerSearchApplied(crawlerSearchDraft)}
                  >
                    Search
                  </LOFIButton>
                  <LOFIButton
                    variant="dismiss"
                    disabled={automated || (!crawlerSearchDraft && !crawlerSearchApplied)}
                    onClick={() => {
                      setCrawlerSearchDraft('');
                      setCrawlerSearchApplied('');
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
                  rows={crawlerRows}
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
              </>
            )}
          </section>
        </div>
      </div>

      <div className="merge-tool-example__footer">
        <LOFIButton variant="dismiss" onClick={handleReset} disabled={automated}>
          <span className="merge-tool-example__btn-label">
            <MergeToolResetIcon />
            <LOFIText as="span" variant="inherit">
              Reset
            </LOFIText>
          </span>
        </LOFIButton>
        <span
          data-preview-target={previewTargetAttr({ kind: 'merge-button' })}
          className={
            displayHighlightMergeButton
              ? 'merge-tool-example__highlight'
              : undefined
          }
        >
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
            <span
              data-preview-target={previewTargetAttr({ kind: 'modal-merge-button' })}
              className={displayHighlightModalMerge ? 'merge-tool-example__highlight' : undefined}
            >
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
            <span data-preview-target={previewTargetAttr({ kind: 'confirm-button' })}>
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
          autoDismiss={automated ? undefined : 4000}
          onDismiss={() => setToast(null)}
        />
      )}
    </div>
  );
}
