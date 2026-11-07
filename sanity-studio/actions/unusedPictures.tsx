// Pictures from Word documents that nothing uses any more are removed from the picture library when a story or
// chapter is published or deleted (docs/specs/story-import-word.md AC-18). The removal waits until the publish or
// delete has reached the dataset (lib/word/cleanup.ts), so a cancelled Delete or a Publish stopped by validation
// removes nothing. Publishing also drops the upload's Undo copy: once published, an upload can't be undone.
// A story's own Delete (with its chapters) cleans up in actions/deleteSeries.tsx.
import { useClient, useDocumentOperation, type DocumentActionComponent } from 'sanity';
import { cleanUpAfterDelete, cleanUpAfterPublish, picturesOf } from '../lib/word/cleanup';

export function withUnusedPictures(original: DocumentActionComponent): DocumentActionComponent {
  const RemoveUnused: DocumentActionComponent = (props) => {
    const base = original(props);
    const client = useClient({ apiVersion: '2024-01-01' });
    const ops = useDocumentOperation(props.id, props.type);
    if (!base) return base;
    const deleting = original.action === 'delete';
    const onHandle = () => {
      if (deleting) {
        const candidates = [...picturesOf(props.draft), ...picturesOf(props.published)];
        base.onHandle?.();
        void cleanUpAfterDelete(client, [props.id], candidates);
        return;
      }
      if ((props.draft?.textUpload as { previous?: string } | undefined)?.previous) ops.patch.execute([{ unset: ['textUpload.previous'] }]);
      const before = props.published;
      base.onHandle?.();
      void cleanUpAfterPublish(client, props.id, before);
    };
    return { ...base, onHandle };
  };
  RemoveUnused.action = original.action;
  RemoveUnused.displayName = `RemoveUnusedPictures(${original.displayName ?? original.action ?? 'action'})`;
  return RemoveUnused;
}
