// Stories' link previews, news entries, and the story an unknown address belongs to.
// Design: docs/design/story-reader.md (Flow: a fan). Spec: docs/specs/story-reader-pages.md AC-9 to AC-11. Pure.
import { absoluteUrl, FALLBACK_IMAGE_PATH, type LinkPreview } from '../comics/sharing';
import type { NewsPost } from '../queries';
import { oneLine } from '../text';
import { chapterLabel, chapterPath, hasPage, shownChapters, storyPath, type Story, type StoryChapter } from './model';

export type NewsEntry =
  | { kind: 'post'; post: NewsPost; href: string; external: boolean; date?: string }
  | { kind: 'chapter'; story: Story; chapter: StoryChapter; title: string; href: string; date?: string };

const image = (story: Story, site: string) => story.cover?.social ?? absoluteUrl(site, FALLBACK_IMAGE_PATH);
const describe = (story: Story) => (story.description?.trim() ? oneLine(story.description) : `${story.title}, a story by Star Goldberg.`);

export function storyPreview(story: Story, site: string): LinkPreview {
  return { title: story.title, description: describe(story), image: image(story, site), url: absoluteUrl(site, storyPath(story.slug!)) };
}

export function chapterPreview(story: Story, chapter: StoryChapter, site: string): LinkPreview {
  return {
    title: `${story.title} · ${chapterLabel(chapter)}`,
    description: describe(story),
    image: image(story, site),
    url: absoluteUrl(site, chapterPath(story.slug!, chapter.number)),
  };
}

/** AC-10: the news page's entries: posts, with stories linked to their pages, and later chapters on their own. */
export function newsEntries(posts: NewsPost[], stories: Story[], limit = 20): NewsEntry[] {
  const byId = new Map(stories.map((s) => [s.id, s]));
  const fromPosts: NewsEntry[] = posts.map((post) => {
    if (post._type !== 'writtenWork') return { kind: 'post', post, href: '/portfolio', external: false, date: post.publishDate };
    const story = byId.get(post._id);
    if (story && hasPage(story)) return { kind: 'post', post, href: storyPath(story.slug!), external: false, date: post.publishDate };
    return post.externalLink
      ? { kind: 'post', post, href: post.externalLink, external: true, date: post.publishDate }
      : { kind: 'post', post, href: '/writing', external: false, date: post.publishDate };
  });
  const chapters: NewsEntry[] = stories.flatMap((story) =>
    hasPage(story)
      ? shownChapters(story)
          .filter((c) => c.date && (!story.date || c.date > story.date))
          .map((chapter) => ({
            kind: 'chapter' as const,
            story,
            chapter,
            title: `${story.title} · ${chapterLabel(chapter)}`,
            href: chapterPath(story.slug!, chapter.number),
            date: chapter.date,
          }))
      : [],
  );
  // Newest first; ties keep their order (the sort is stable).
  return [...fromPosts, ...chapters].sort((a, b) => (b.date ?? '').localeCompare(a.date ?? '')).slice(0, limit);
}

/** AC-11: on Page not found, the story an address under it belongs to, if the story still exists. */
export function storyForMissingPath(path: string, stories: { slug: string; title: string }[]): { title: string; path: string } | undefined {
  const slug = /^\/writing\/([^/]+)\/./.exec(path)?.[1];
  const found = stories.find((s) => s.slug === slug);
  return found && { title: found.title, path: storyPath(found.slug) };
}
