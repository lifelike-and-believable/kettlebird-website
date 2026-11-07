// Removing pictures from Word documents that nothing uses any more (docs/specs/story-import-word.md AC-18), once a
// publish or delete has actually reached the dataset: a cancelled Delete, or a Publish stopped by validation, never
// gets that far, so nothing is removed for it. The choice of pictures is pure (lib/word/pictures.ts); this file
// talks to the dataset.
import type { SanityClient } from 'sanity';
import { inUndoCopies, pictureAssets, unusedPictures } from './pictures';

type Doc = Record<string, unknown> | null | undefined;
const content = (doc: Doc) => doc?.content as Parameters<typeof pictureAssets>[0];
export const discarded = (doc: Doc): string[] =>
  ((doc?.textUpload as { discarded?: unknown[] } | undefined)?.discarded ?? []).filter((id): id is string => typeof id === 'string');
/** Every picture a document's text uses, or has given up. */
export const picturesOf = (doc: Doc): string[] => [...pictureAssets(content(doc)), ...discarded(doc)];
export { content as textOf };

const WAIT_MS = 2 * 60 * 1000;
const EVERY_MS = 2000;

/** Waits until `done` is true, checking every 2 seconds for up to 2 minutes; false if it never is. */
export async function waitFor(done: () => Promise<boolean>, timeout = WAIT_MS, every = EVERY_MS): Promise<boolean> {
  const until = Date.now() + timeout;
  while (Date.now() < until) {
    try {
      if (await done()) return true;
    } catch {
      // Try again.
    }
    await new Promise((resolve) => setTimeout(resolve, every));
  }
  return false;
}

/**
 * Removes each picture that nothing refers to and no draft's Undo copy holds. The library itself refuses to delete
 * a picture that's in use, so a mistake here can't break a published text.
 */
export async function removeUnused(client: SanityClient, candidates: string[]): Promise<string[]> {
  const ids = [...new Set(candidates)];
  if (!ids.length) return [];
  const copies = await client.fetch<string[]>('*[_id in path("drafts.**") && defined(textUpload.previous)].textUpload.previous', {}, { perspective: 'raw' });
  const referenced = new Set(inUndoCopies(ids, copies));
  for (const id of ids) {
    if (referenced.has(id)) continue;
    const refs = await client.fetch<number>('count(*[references($id)])', { id }, { perspective: 'raw' });
    if (refs > 0) referenced.add(id);
  }
  const unused = unusedPictures({ discarded: ids, before: [], after: [], referenced });
  for (const id of unused) {
    try {
      await client.delete(id);
    } catch {
      // Already gone, or still in use.
    }
  }
  return unused;
}

/** After a publish: once the published version has changed, the pictures it gave up. */
export async function cleanUpAfterPublish(client: SanityClient, id: string, before: Doc): Promise<void> {
  const rev = before?._rev as string | undefined;
  let published: Doc;
  const changed = await waitFor(async () => {
    published = await client.fetch<Doc>('*[_id == $id][0]{ _rev, content, textUpload }', { id }, { perspective: 'raw' });
    return !!published?._rev && published._rev !== rev;
  });
  if (!changed) return;
  const candidates = unusedPictures({
    discarded: discarded(published),
    before: pictureAssets(content(before)),
    after: pictureAssets(content(published)),
    referenced: new Set(),
  });
  await removeUnused(client, candidates);
}

/** After a delete: once the documents are gone, the pictures they used. */
export async function cleanUpAfterDelete(client: SanityClient, ids: string[], candidates: string[]): Promise<void> {
  if (!candidates.length) return;
  const all = ids.flatMap((id) => [id, `drafts.${id}`]);
  const gone = await waitFor(async () => (await client.fetch<number>('count(*[_id in $all])', { all }, { perspective: 'raw' })) === 0);
  if (gone) await removeUnused(client, candidates);
}
