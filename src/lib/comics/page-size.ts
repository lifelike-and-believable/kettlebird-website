// How a comic's pages fit on a computer (design-comic-page-width; docs/specs/comic-reader-page-size.md): the
// comic's size and largest page width as read from Sanity, each page's largest width, the chapter's column, and
// the widths the site makes its pictures at.

export type PageSize = 'screen' | 'width' | 'height';

/** The fan's choice, kept in the browser for every comic (AC-19). */
export const PAGE_SIZE_KEY = 'kb-page-size';

/** The widest picture the site makes, and so the widest a page shows without Largest page width. */
export const WIDEST_PICTURE = 3200;
export const LARGEST_PAGE_WIDTH_MIN = 400;

/** Widths the reader's pictures are made at (AC-6). */
export const PICTURE_WIDTHS = [480, 800, 1200, 1600, 2400, WIDEST_PICTURE] as const;

/** The comic's Page size on a computer: Fit the screen unless Star chose the width or the height (AC-4). */
export function readPageSize(raw: unknown): PageSize {
  return raw === 'width' || raw === 'height' ? raw : 'screen';
}

/** Whether a value is an allowed Largest page width: a whole number from 400 to 3200 (AC-2, AC-4). */
export function isLargestPageWidth(raw: unknown): raw is number {
  return typeof raw === 'number' && Number.isInteger(raw) && raw >= LARGEST_PAGE_WIDTH_MIN && raw <= WIDEST_PICTURE;
}

/** The comic's Largest page width, kept only when it's allowed (AC-4). */
export function readLargestPageWidth(raw: unknown): number | undefined {
  return isLargestPageWidth(raw) ? raw : undefined;
}

/** A page's largest width: Largest page width (twice it for a spread), else its picture's own, at most 3200 (AC-5). */
export function pageCap(image: { width: number }, spread: boolean, largest?: number): number {
  if (largest !== undefined) return spread ? largest * 2 : largest;
  return Math.min(image.width, WIDEST_PICTURE);
}

/** The chapter's column: the largest width of its widest page that isn't a spread; 0 with none (AC-5). */
export function chapterColumn(pages: readonly { image: { width: number }; spread?: boolean }[], largest?: number): number {
  return pages.reduce((widest, p) => (p.spread ? widest : Math.max(widest, pageCap(p.image, false, largest))), 0);
}

/** The widths a picture is made at: the site's widths up to its own, and its own if that's between them (AC-6). */
export function pictureWidths(pictureWidth: number): number[] {
  const under = PICTURE_WIDTHS.filter((w) => w < pictureWidth);
  return pictureWidth <= WIDEST_PICTURE ? [...under, pictureWidth] : [...PICTURE_WIDTHS];
}
