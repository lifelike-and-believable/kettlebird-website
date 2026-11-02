// A series' Delete: deletes its chapters with it, after saying how many (AC-16). Chapters point to
// their series, so Sanity refuses to delete a series on its own while it has any; deleting them all
// in one transaction keeps that check happy and never leaves a comic half-deleted.
import { useState } from 'react';
import { useClient, type DocumentActionComponent } from 'sanity';
import { deleteSeriesDialog, idsToDelete, publishedIds, type PublishDialog } from '../lib/comic-pages';

export function withChapters(original: DocumentActionComponent): DocumentActionComponent {
  const DeleteSeries: DocumentActionComponent = (props) => {
    const base = original(props);
    const client = useClient({ apiVersion: '2024-01-01' });
    const [pending, setPending] = useState<{ chapterIds: string[]; dialog: PublishDialog } | null>(null);
    const [busy, setBusy] = useState(false);
    if (!base) return base;

    const id = props.id;
    const title = (props.draft ?? props.published)?.title as string | undefined;

    return {
      ...base,
      disabled: busy || base.disabled,
      onHandle: async () => {
        const chapterIds = await client.fetch<string[]>(
          '*[_type == "comicChapter" && series._ref == $id]._id',
          { id },
          { perspective: 'raw' },
        );
        setPending({ chapterIds, dialog: deleteSeriesDialog(title, publishedIds(chapterIds).length) });
      },
      dialog: pending
        ? {
            type: 'confirm',
            tone: 'critical',
            message: (
              <div>
                <strong>{pending.dialog.title}</strong>
                {pending.dialog.lines.map((line) => <p key={line}>{line}</p>)}
              </div>
            ),
            confirmButtonText: pending.dialog.confirm,
            cancelButtonText: 'Cancel',
            onCancel: () => setPending(null),
            onConfirm: async () => {
              setBusy(true);
              const tx = client.transaction();
              for (const doc of idsToDelete(id, pending.chapterIds)) tx.delete(doc);
              try {
                await tx.commit();
              } finally {
                setBusy(false);
                setPending(null);
              }
              props.onComplete();
            },
          }
        : base.dialog,
    };
  };
  DeleteSeries.action = original.action;
  DeleteSeries.displayName = 'DeleteSeries';
  return DeleteSeries;
}
