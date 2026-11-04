// The story's own checks that need the dataset: whether it has chapters (story-reader-editor AC-2).
import type { ValidationContext } from 'sanity';
import { storyNeeds } from './stories';

const CHAPTERS = 'count(*[_type == "storyChapter" && story._ref == $id]) > 0';

/** What the story in this form still needs before publishing, in Star's words. */
export async function storyNeedsIn(context: ValidationContext): Promise<string[]> {
  const doc = context.document;
  if (!doc) return [];
  const id = doc._id.replace(/^drafts\./, '');
  const hasText = Array.isArray(doc.content) && doc.content.length > 0;
  const hasChapters = hasText
    ? false
    : await context.getClient({ apiVersion: '2024-01-01' }).fetch<boolean>(CHAPTERS, { id }, { perspective: 'raw' });
  return storyNeeds({
    slug: (doc.slug as { current?: string } | undefined)?.current,
    rating: doc.rating as string | undefined,
    hasText,
    hasChapters,
  });
}
