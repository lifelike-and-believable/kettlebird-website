// Pure logic for publishing comic pages in the editor (no `sanity` imports, so the site's Vitest
// can test it). Spec: docs/specs/comic-publish-pages.md.
import { aloneBeforeSpread, type OpenOn } from './pairing';

export interface FileLike { name: string; type: string }
export type QueueState = 'waiting' | 'uploading' | 'done' | 'failed' | 'rejected';
export interface QueueItem { name: string; state: QueueState }
export interface PageLike { _key: string; altText?: string; spread?: boolean }
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

/** organised-editor AC-14: the heading of a chapter's pane, beside its series. */
export function chapterPaneTitle(seriesTitle: string | undefined, chapter: { number: number; title?: string } | null): string {
  const series = seriesTitle?.trim() || 'Untitled series';
  return `${series} · ${chapter ? chapterLabel(chapter) : 'New chapter'}`;
}

// Two-page spreads (docs/specs/comic-reader-spread-and-flip.md AC-1, AC-10; design-comic-spread-and-flip,
// "What Star enters").

/** A chapter's Open on field. */
export const OPEN_ON_FIELD = {
  name: 'openOn',
  title: 'Open on',
  type: 'string',
  description: 'How pages pair up on a wide screen. A printed comic opens on the right, so its facing pages are 2 and 3, 4 and 5.',
  initialValue: 'right',
  options: {
    layout: 'radio',
    list: [
      { value: 'right', title: 'The right, like a printed comic: Page 1 alone on the right, then 2 and 3, 4 and 5.' },
      { value: 'left', title: 'The left, pairing from page 1: Pages 1 and 2 together, then 3 and 4.' },
    ],
  },
} as const;

/** A page's Two-page spread tick box. */
export const SPREAD_FIELD = {
  name: 'spread',
  title: 'Two-page spread',
  type: 'boolean',
  description: "One picture drawn across two facing pages. On a wide screen it covers both pages; on a phone it's shrunk to fit. It's never split across a page turn.",
} as const;

/** A comic's How it reads group and its two settings (docs/specs/comic-reader-comic-settings.md AC-1). */
export const HOW_IT_READS = {
  name: 'howItReads',
  title: 'How it reads',
  // The preview's frame named (docs/specs/comic-reader-page-size.md AC-1).
  description: 'Preview a chapter to see how it reads. The preview at Computer is a 1280 × 800 laptop, shown smaller to fit beside the editor.',
} as const;

export const TWO_UP_FIELD = {
  name: 'twoUp',
  title: 'Two pages side by side',
  type: 'boolean',
  fieldset: 'howItReads',
  initialValue: false,
  description: 'On a laptop, or a tablet held sideways, show facing pages together, like an open comic. Off: one page at a time on every screen.',
} as const;

export const PAGE_FLIP_FIELD = {
  name: 'pageFlip',
  title: 'Page-flip',
  type: 'boolean',
  fieldset: 'howItReads',
  initialValue: false,
  description: 'Turn pages with an animation of a page turning over. Off: pages change at once.',
} as const;

/** How pages fit on a computer (docs/specs/comic-reader-page-size.md AC-1). */
export const PAGE_SIZE_FIELD = {
  name: 'pageSize',
  title: 'Page size on a computer',
  type: 'string',
  fieldset: 'howItReads',
  initialValue: 'screen',
  description:
    'How big pages show on a laptop or desktop, one at a time or two side by side. Readers on a computer can choose another size for themselves. Phones and tablets always fit the screen.',
  options: {
    layout: 'radio',
    list: [
      { value: 'screen', title: 'Fit the screen: The whole page and the buttons show at once, without scrolling, as now. In a 1440 × 780 laptop window a page is about 390 pixels wide.' },
      { value: 'width', title: 'Fit the width: Each page shows as wide as its picture, or as Largest page width, narrowed to fit the window. Readers scroll down each page to the buttons.' },
      { value: 'height', title: "Fit the height: Each page's height matches the window's, never wider than its picture or Largest page width. Readers scroll down a little to the buttons." },
    ],
  },
} as const;

export const LARGEST_PAGE_WIDTH_ERROR = 'Choose a whole number of pixels between 400 and 3200, or leave it empty.';

/** What's wrong with a Largest page width, if anything: empty, or a whole number from 400 to 3200 (AC-2). */
export function largestPageWidthProblem(value: unknown): string | undefined {
  if (value === undefined || value === null) return undefined;
  const ok = typeof value === 'number' && Number.isInteger(value) && value >= 400 && value <= 3200;
  return ok ? undefined : LARGEST_PAGE_WIDTH_ERROR;
}

/** The parts of Sanity's validation Rule that the Largest page width uses. */
interface CustomRule<R> { custom(fn: (value: unknown) => true | string): R }

export const LARGEST_PAGE_WIDTH_FIELD = {
  name: 'largestPageWidth',
  title: 'Largest page width',
  type: 'number',
  fieldset: 'howItReads',
  description:
    "In screen pixels. A number wider than a page's picture enlarges the picture, and it may look soft. Leave it empty to show each page no wider than its picture. A two-page spread shows up to twice this. Fit the screen ignores it.",
  validation: <R extends CustomRule<R>>(rule: R): R => rule.custom((value) => largestPageWidthProblem(value) ?? true),
} as const;

const SHARP_SCREENS = 'On sharp (high-density) screens, a picture looks sharpest at half its width or less.';
const range = (widths: number[]) => {
  const low = Math.min(...widths);
  const high = Math.max(...widths);
  return low === high ? `${low}` : `${low} to ${high}`;
};

/** The line under Largest page width: how wide the comic's pictures are (AC-3). None without pages' sizes. */
export function picturesSizesLine(pages: readonly { width?: number; height?: number; spread?: boolean }[]): string | undefined {
  const sized = pages.filter((p): p is { width: number; spread?: boolean } => typeof p.width === 'number' && p.width > 0);
  const singles = sized.filter((p) => !p.spread).map((p) => p.width);
  const spreads = sized.filter((p) => p.spread).map((p) => p.width);
  if (!singles.length && !spreads.length) return undefined;
  if (!singles.length) {
    return spreads.length === 1 ? `This comic's spread is ${spreads[0]} pixels wide. ${SHARP_SCREENS}` : `This comic's spreads are ${range(spreads)} pixels wide. ${SHARP_SCREENS}`;
  }
  const spreadPart = spreads.length ? `, and its ${spreads.length === 1 ? 'spread' : 'spreads'} ${range(spreads)}` : '';
  return `This comic's pages are ${range(singles)} pixels wide${spreadPart}. ${SHARP_SCREENS}`;
}

/** Under a chapter's Open on when its comic has pairs off (AC-7). */
export const OPEN_ON_OFF_NOTE = "Two pages side by side is off for this comic, so this has no effect. Turn it on in the comic's How it reads.";

export const WIDE_PICTURE_QUESTION =
  'This picture is wider than it is tall. Is it a two-page spread? If so, tick Two-page spread; otherwise it shows small, on one side.';

/** The note under a page's Two-page spread tick box, if any. `page` counts from 1. */
export function pageNote(
  pages: { spread?: boolean; width?: number; height?: number }[],
  openOn: OpenOn | undefined,
  page: number,
  /** The comic's Two pages side by side; the note about a page left alone only matters with it on. */
  twoUp = true,
): string | undefined {
  const current = pages[page - 1];
  if (!current) return undefined;
  const side = openOn === 'left' ? 'left' : 'right';
  if (current.spread) {
    if (!twoUp) return undefined;
    const alone = aloneBeforeSpread(pages.map((p) => Boolean(p.spread)), side, page);
    return alone ? `This chapter opens on the ${side}, so page ${alone} shows alone on the left, before this spread.` : undefined;
  }
  return (current.width ?? 0) > (current.height ?? Infinity) ? WIDE_PICTURE_QUESTION : undefined;
}

/** What a page's tile in the pages grid says under its file name. */
export function pageGridSubtitle(page: { spread?: boolean; altText?: string }): string | undefined {
  const parts = [page.spread ? 'Two-page spread' : undefined, page.altText?.trim() ? undefined : '⚠ Alt text'].filter(Boolean);
  return parts.length ? parts.join(' · ') : undefined;
}

/** A Sanity image asset's size from its id ("image-<hash>-1600x1200-png"), without fetching it. */
export function imageSize(ref: string | undefined): { width: number; height: number } | undefined {
  const match = ref?.match(/-(\d+)x(\d+)-[a-z0-9]+$/);
  return match ? { width: Number(match[1]), height: Number(match[2]) } : undefined;
}
