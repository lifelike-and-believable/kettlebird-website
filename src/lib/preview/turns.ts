// Turning pages in a chapter's preview (docs/specs/comic-reader-comic-settings.md AC-9): Previous
// and Next move within the previewed chapter, at the preview's own address with page=N. Pure.
import type { ReaderPage } from '../comics/model';

/** The preview address for a turn from `entry` to `to`, or undefined when it leaves the chapter. */
export function previewTurn(previewUrl: URL, entry: ReaderPage, to: string | undefined): string | undefined {
  if (!to) return undefined;
  const chapter = `${entry.path.slice(0, entry.path.lastIndexOf('/'))}/`;
  if (!to.startsWith(chapter)) return undefined;
  const page = to.slice(chapter.length);
  if (!/^[1-9]\d*$/.test(page)) return undefined;
  const url = new URL(previewUrl.href);
  url.searchParams.set('page', page);
  return `${url.pathname}${url.search}`;
}
