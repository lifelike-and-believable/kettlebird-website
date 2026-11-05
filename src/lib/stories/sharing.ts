// Stories' link previews, news entries, and the story an unknown address belongs to.
// Spec: docs/specs/story-reader-pages.md AC-9 to AC-11. Pure. STUB (tests first).
import type { NewsPost } from '../queries';
import type { Story, StoryChapter } from './model';
import type { LinkPreview } from '../comics/sharing';

export type NewsEntry =
  | { kind: 'post'; post: NewsPost; href: string; external: boolean; date?: string }
  | { kind: 'chapter'; story: Story; chapter: StoryChapter; title: string; href: string; date?: string };

const stub = (): never => { throw new Error('Not built yet'); };

export function storyPreview(_story: Story, _site: string): LinkPreview { return stub(); }
export function chapterPreview(_story: Story, _chapter: StoryChapter, _site: string): LinkPreview { return stub(); }
export function newsEntries(_posts: NewsPost[], _stories: Story[], _limit?: number): NewsEntry[] { return stub(); }
export function storyForMissingPath(_path: string, _stories: { slug: string; title: string }[]): { title: string; path: string } | undefined { return stub(); }
