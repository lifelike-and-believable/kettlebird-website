// The chapter's Publish: waits for uploads, then shows the shared-link warning and the alt text
// reminder before publishing, and publishes a new series with its first chapter (AC-5, AC-7, AC-8,
// AC-15; design mock-ups 4, 9 and 10).
import { useEffect, useState } from 'react';
import { useDocumentOperation, useEditState, type DocumentActionComponent, type DocumentActionProps } from 'sanity';
import { linkChange, publishDialog, publishLabel, SERIES_SLUG_MESSAGE, type ChapterLike } from '../lib/comic-pages';
import { FIND_WAIT_MS, publishFindingLabel } from '../lib/panels';
import { useFinding, useQueue } from '../lib/upload-store';

const asChapter = (doc: DocumentActionProps['draft']): ChapterLike | null =>
  doc ? { number: Number(doc.number ?? 0), title: doc.title as string | undefined, pages: (doc.pages as ChapterLike['pages']) ?? [] } : null;

export function withChapterChecks(original: DocumentActionComponent): DocumentActionComponent {
  const PublishChapter: DocumentActionComponent = (props) => {
    const base = original(props);
    const queue = useQueue(props.id);
    const finding = useFinding(props.id);
    const [open, setOpen] = useState(false);
    // Publish waits while panels are being found, at most FIND_WAIT_MS (comic-reader-panels AC-5).
    const [, setTick] = useState(0);
    const waitLeft = finding.since ? finding.since + FIND_WAIT_MS - Date.now() : 0;
    useEffect(() => {
      if (waitLeft <= 0) return undefined;
      const t = setTimeout(() => setTick((n) => n + 1), waitLeft + 50);
      return () => clearTimeout(t);
    }, [waitLeft]);
    // The chapter's series, so a series that isn't on the site yet is published with it (AC-15).
    const seriesId = (props.draft?.series as { _ref?: string } | undefined)?._ref ?? 'none';
    const series = useEditState(seriesId, 'comicSeries');
    const seriesOps = useDocumentOperation(seriesId, 'comicSeries');
    if (!base) return base;

    const newSeries = series.draft && !series.published ? series.draft : null;
    const newSeriesTitle = newSeries ? String(newSeries.title || 'This series') : undefined;
    const seriesHasAddress = Boolean((newSeries?.slug as { current?: string } | undefined)?.current);
    const publish = () => {
      if (newSeries && !seriesOps.publish.disabled) seriesOps.publish.execute();
      base.onHandle?.();
    };

    const uploadLabel = publishLabel(queue);
    const findLabel = waitLeft > 0 ? publishFindingLabel(finding.keys.length) : undefined;
    const label = uploadLabel !== 'Publish' ? uploadLabel : findLabel ?? uploadLabel;
    const uploading = label !== 'Publish';
    const draft = asChapter(props.draft);
    const dialog = draft ? publishDialog(linkChange(asChapter(props.published), draft), draft, { newSeriesTitle }) : null;
    const blocked = Boolean(newSeries && !seriesHasAddress);

    return {
      ...base,
      label: uploading ? label : base.label,
      disabled: uploading || blocked || base.disabled,
      title: blocked ? SERIES_SLUG_MESSAGE : base.title,
      onHandle: () => {
        if (dialog) setOpen(true);
        else publish();
      },
      dialog: open && dialog
        ? {
            type: 'confirm',
            tone: 'caution',
            message: (
              <div>
                <strong>{dialog.title}</strong>
                {dialog.lines.map((line) => <p key={line}>{line}</p>)}
              </div>
            ),
            confirmButtonText: dialog.confirm ?? 'Publish anyway',
            cancelButtonText: 'Cancel',
            onCancel: () => setOpen(false),
            onConfirm: () => { setOpen(false); publish(); },
          }
        : base.dialog,
    };
  };
  PublishChapter.action = original.action;
  PublishChapter.displayName = 'PublishChapter';
  return PublishChapter;
}
