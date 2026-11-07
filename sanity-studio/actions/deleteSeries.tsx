// A series' or a story's Delete: deletes its chapters with it, after saying how many
// (comic-publish-pages AC-16; story-reader-editor AC-10). Chapters point to
// their series, so Sanity refuses to delete a series while it has any. The chapters go first, in one
// transaction; then the series goes through Sanity's own delete operation, which the open document
// pane listens for, so the series' Published and Draft tabs close as they do for any deletion. If
// that second step fails, the series is left with no chapters, and Delete can be chosen again.
// A story's pictures from Word documents, and its chapters', are removed from the picture library once the
// deletes have gone through (story-import-word AC-18).
import { useState } from 'react';
import { useClient, useDocumentOperation, type DocumentActionComponent } from 'sanity';
import { chapterDocsToDelete, deleteSeriesDialog, publishedIds, type PublishDialog } from '../lib/comic-pages';
import { deleteStoryDialog } from '../lib/stories';
import { cleanUpAfterDelete, picturesOf } from '../lib/word/cleanup';

interface Kind { query: string; dialog: (title: string | undefined, count: number) => PublishDialog; pictures?: boolean }
const SERIES: Kind = { query: '*[_type == "comicChapter" && series._ref == $id]._id', dialog: deleteSeriesDialog };
const STORY: Kind = { query: '*[_type == "storyChapter" && story._ref == $id]._id', dialog: deleteStoryDialog, pictures: true };

export const withStoryChapters = (original: DocumentActionComponent) => withChapters(original, STORY);

export function withChapters(original: DocumentActionComponent, kind: Kind = SERIES): DocumentActionComponent {
  const DeleteSeries: DocumentActionComponent = (props) => {
    const base = original(props);
    const client = useClient({ apiVersion: '2024-01-01' });
    const ops = useDocumentOperation(props.id, props.type);
    const [pending, setPending] = useState<{ chapterIds: string[]; dialog: PublishDialog } | null>(null);
    const [busy, setBusy] = useState(false);
    if (!base) return base;

    const id = props.id;
    const title = (props.draft ?? props.published)?.title as string | undefined;

    return {
      ...base,
      disabled: busy || base.disabled,
      onHandle: async () => {
        const chapterIds = await client.fetch<string[]>(kind.query, { id }, { perspective: 'raw' });
        setPending({ chapterIds, dialog: kind.dialog(title, publishedIds(chapterIds).length) });
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
              try {
                // The pictures the story and its chapters use, read before they go.
                const docs = kind.pictures
                  ? await client.fetch<Record<string, unknown>[]>('*[_id in $ids]{ content, textUpload }', { ids: [...pending.chapterIds, id, `drafts.${id}`] }, { perspective: 'raw' })
                  : [];
                const chapters = chapterDocsToDelete(pending.chapterIds);
                if (chapters.length) {
                  const tx = client.transaction();
                  for (const doc of chapters) tx.delete(doc);
                  await tx.commit();
                }
                ops.delete.execute();
                const candidates = docs.flatMap(picturesOf);
                if (candidates.length) void cleanUpAfterDelete(client, [id, ...publishedIds(pending.chapterIds)], candidates);
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
