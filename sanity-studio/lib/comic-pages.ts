// Pure logic for publishing comic pages in the editor (no `sanity` imports, so the site's Vitest
// can test it). Spec: docs/specs/comic-publish-pages.md.

export interface FileLike { name: string; type: string }
export type QueueState = 'waiting' | 'uploading' | 'done' | 'failed' | 'rejected';
export interface QueueItem { name: string; state: QueueState }
export interface PageLike { _key: string; altText?: string }
export interface ChapterLike { number: number; title?: string; pages: PageLike[] }
export type LinkChange =
  | { kind: 'none' }
  | { kind: 'moved' | 'removed' | 'inserted'; page: number; lastPage: number }
  | { kind: 'renumbered'; from: number; to: number };
/** `confirm` is set only when it isn't the default, **Publish anyway**. */
export interface PublishDialog { title: string; lines: string[]; confirm?: string }

export const SERIES_SLUG_MESSAGE = 'Add a web address so readers can find this comic.';
export const NOT_AN_IMAGE = "This isn't an image file";
export const DID_NOT_UPLOAD = "Didn't upload";
/** Uploads in flight at once (spec, non-functional requirements). */
export const MAX_PARALLEL_UPLOADS = 3;

const collator = new Intl.Collator('en', { numeric: true, sensitivity: 'base' });

/** AC-1: numbers compared as numbers, case-insensitively. */
export function naturalCompare(a: string, b: string): number {
  return collator.compare(a, b);
}

/** AC-1, AC-2: a sorted copy, by file name. */
export function sortByFileName<T extends { name: string }>(files: T[]): T[] {
  return [...files].sort((a, b) => naturalCompare(a.name, b.name));
}

const IMAGE_TYPES = new Set(['image/png', 'image/jpeg', 'image/tiff', 'image/webp', 'image/gif']);
const IMAGE_EXTENSIONS = /\.(png|jpe?g|tiff?|webp|gif)$/i;

/** AC-3: accepted by MIME type, or by extension when the browser gives no type. */
export function isAcceptedImage(file: FileLike): boolean {
  if (file.type) return IMAGE_TYPES.has(file.type);
  return IMAGE_EXTENSIONS.test(file.name);
}

/** AC-5: "Uploading N of M…" while any upload is waiting or in progress. Rejected files don't count. */
export function publishLabel(queue: QueueItem[]): string {
  const counted = queue.filter((q) => q.state !== 'rejected');
  if (!counted.some((q) => q.state === 'waiting' || q.state === 'uploading')) return 'Publish';
  const done = counted.filter((q) => q.state === 'done').length;
  return `Uploading ${done} of ${counted.length}…`;
}

/** AC-4 */
export function retryable(item: QueueItem): boolean {
  return item.state === 'failed';
}

/** AC-6 */
export function missingAltCount(pages: PageLike[]): number {
  return pages.filter((p) => !p.altText?.trim()).length;
}

export function altTextMessage(count: number): string | null {
  if (count <= 0) return null;
  return count === 1 ? '1 page needs alt text' : `${count} pages need alt text`;
}

/** The site's chapter label (src/lib/comics/model.ts chapterLabel). */
export function chapterLabel(c: { number: number; title?: string }): string {
  const title = c.title?.trim();
  if (c.number === 0 && title) return title;
  return title ? `Chapter ${c.number}: ${title}` : `Chapter ${c.number}`;
}

/** AC-7: how publishing the draft changes the addresses of published pages. */
export function linkChange(published: ChapterLike | null, draft: ChapterLike): LinkChange {
  if (!published) return { kind: 'none' };
  const before = published.pages.map((p) => p._key);
  if (published.number !== draft.number) return { kind: 'renumbered', from: published.number, to: draft.number };
  const after = draft.pages.map((p) => p._key);
  const first = before.findIndex((key, i) => after[i] !== key);
  if (first === -1) return { kind: 'none' };
  const page = first + 1;
  const lastPage = before.length;
  const afterSet = new Set(after);
  if (!afterSet.has(before[first])) return { kind: 'removed', page, lastPage };
  const beforeSet = new Set(before);
  if (!beforeSet.has(after[first])) return { kind: 'inserted', page, lastPage };
  return { kind: 'moved', page, lastPage };
}

/** AC-7, AC-8, AC-15: the dialog shown before publishing, or null to publish straight away. */
export function publishDialog(
  change: LinkChange,
  chapter: ChapterLike,
  series: { newSeriesTitle?: string } = {},
): PublishDialog | null {
  const dialog = changeDialog(change, chapter);
  if (!series.newSeriesTitle) return dialog;
  const line = `${series.newSeriesTitle} isn't on the site yet, so publishing this chapter publishes it too.`;
  if (!dialog) return { title: 'Publish the series too', lines: [line], confirm: 'Publish both' };
  return { ...dialog, lines: [...dialog.lines, line] };
}

function changeDialog(change: LinkChange, chapter: ChapterLike): PublishDialog | null {
  const missing = missingAltCount(chapter.pages);
  const label = chapterLabel(chapter);
  if (change.kind === 'none') {
    if (!missing) return null;
    const pagesWord = missing === 1 ? '1 page' : `${missing} pages`;
    const has = missing === 1 ? 'has' : 'have';
    const them = missing === 1 ? 'it' : 'them';
    return {
      title: 'Some pages have no alt text',
      lines: [`${pagesWord} in ${label} ${has} no alt text, so people using screen readers won't be able to follow ${them}.`],
    };
  }
  let line: string;
  if (change.kind === 'renumbered') {
    const title = chapter.title?.trim();
    const what = title ? `${title} from chapter ${change.from}` : `chapter ${change.from}`;
    line = `You changed ${what} to chapter ${change.to}. Links people have shared to its pages use chapter ${change.from}'s addresses, so they'll stop working, or open a different chapter if you later add a new chapter ${change.from}.`;
  } else {
    const what = change.kind === 'moved' ? `You moved page ${change.page} of`
      : change.kind === 'removed' ? `You removed page ${change.page} of`
      : `You added a page before page ${change.page} of`;
    const range = change.page === change.lastPage ? `page ${change.page}` : `pages ${change.page} to ${change.lastPage}`;
    line = `${what} ${label}. Links people have shared to ${range} of Chapter ${chapter.number} will point to different pages.`;
  }
  const lines = [line];
  if (missing) lines.push(`Reminder: ${missing === 1 ? '1 page in this chapter has' : `${missing} pages in this chapter have`} no alt text.`);
  return { title: 'Some page links will change', lines };
}

/** AC-9 */
export function duplicateChapterMessage(number: number, others: number[]): string | null {
  return others.includes(number) ? `Chapter ${number} already exists in this series. Choose another number.` : null;
}

/** AC-11 */
export function nextChapterNumber(numbers: number[]): number {
  return numbers.length ? Math.max(0, ...numbers) + 1 : 1;
}

export function chapterRow(c: { number: number; title?: string; pageCount: number; published: boolean }): string {
  const pages = c.pageCount === 1 ? '1 page' : `${c.pageCount} pages`;
  const hidden = c.pageCount === 0 ? ' · hidden from readers' : '';
  return `${chapterLabel(c)} · ${pages}${hidden} · ${c.published ? 'On the site' : 'Not published yet'}`;
}

/** AC-16: the documents a chapter or series list names, once each, without draft prefixes. */
export function publishedIds(ids: string[]): string[] {
  return [...new Set(ids.map((id) => id.replace(/^drafts\./, '')))];
}

/** AC-16: the chapter documents to delete before their series: each chapter, published and draft. */
export function chapterDocsToDelete(chapterIds: string[]): string[] {
  return publishedIds(chapterIds).flatMap((id) => [id, `drafts.${id}`]);
}

/** AC-16: the confirmation before a series is deleted with its chapters. */
export function deleteSeriesDialog(title: string | undefined, chapterCount: number): PublishDialog {
  const name = title?.trim() || 'this comic';
  if (chapterCount === 0) {
    return { title: `Delete ${name}?`, lines: ["It comes off the site with the next update. This can't be undone."], confirm: 'Delete' };
  }
  const chapters = chapterCount === 1 ? 'its chapter' : `its ${chapterCount} chapters`;
  return {
    title: `Delete ${name} and ${chapters}?`,
    lines: ["The comic, its chapters and their pages come off the site with the next update. This can't be undone."],
    confirm: 'Delete comic and chapters',
  };
}

export const ALT_TEXT_WARNING = 'Add alt text so people using screen readers can follow the story';

/** The parts of Sanity's validation Rule that altTextRule uses. */
export interface RuleLike<R> { custom(fn: (value: unknown) => true | string): R; warning(): R }

/**
 * AC-8: a page without alt text is a warning, never an error, so Publish stays available. Sanity
 * ignores a `level` returned from a custom check; only `.warning()` on the rule makes it a warning.
 */
export function altTextRule<R extends RuleLike<R>>(rule: R, message: string = ALT_TEXT_WARNING): R {
  return rule.custom((value) => (value && String(value).trim() ? true : message)).warning();
}

/** organised-editor AC-14 (stub for the tests-first commit). */
export function chapterPaneTitle(_seriesTitle: string | undefined, _chapter: { number: number; title?: string } | null): string {
  return 'stub';
}
