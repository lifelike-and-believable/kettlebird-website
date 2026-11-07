// Pictures from Word documents that nothing uses any more are removed from the picture library when a story or
// chapter is published or deleted (docs/specs/story-import-word.md AC-18): those replaced or undone (`discarded`),
// and those the published version used that the new one doesn't. Each is removed only if nothing refers to it.
import { useClient, type DocumentActionComponent } from 'sanity';
import { pictureAssets, unusedPictures } from '../lib/word/pictures';

type Doc = Record<string, unknown> | null | undefined;
const content = (doc: Doc) => doc?.content as Parameters<typeof pictureAssets>[0];
const discarded = (doc: Doc) => ((doc?.textUpload as { discarded?: string[] } | undefined)?.discarded ?? []).filter((id) => typeof id === 'string');
// Long enough for a publish or delete to have reached the dataset, so the published version no longer refers to them.
const SETTLE_MS = 4000;

export function withUnusedPictures(original: DocumentActionComponent): DocumentActionComponent {
  const RemoveUnused: DocumentActionComponent = (props) => {
    const base = original(props);
    const client = useClient({ apiVersion: '2024-01-01' });
    if (!base) return base;
    const deleting = original.action === 'delete';
    const onHandle = () => {
      const after = deleting ? [] : pictureAssets(content(props.draft ?? props.published));
      const before = [...pictureAssets(content(props.published)), ...(deleting ? pictureAssets(content(props.draft)) : [])];
      const candidates = unusedPictures({ discarded: [...discarded(props.draft), ...discarded(props.published)], before, after, referenced: new Set() });
      base.onHandle?.();
      if (!candidates.length) return;
      setTimeout(async () => {
        for (const id of candidates) {
          try {
            const refs = await client.fetch<number>('count(*[references($id)])', { id });
            if (refs === 0) await client.delete(id);
          } catch {
            // Already gone, or still in use: the library refuses to delete a picture in use.
          }
        }
      }, SETTLE_MS);
    };
    return { ...base, onHandle };
  };
  RemoveUnused.action = original.action;
  RemoveUnused.displayName = `RemoveUnusedPictures(${original.displayName ?? original.action ?? 'action'})`;
  return RemoveUnused;
}
