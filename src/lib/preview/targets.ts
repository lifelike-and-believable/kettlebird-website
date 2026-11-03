// What page an item previews, what it's called, where it scrolls, and what stops it being shown.
// Design: docs/design/preview.md. Spec: docs/specs/content-editing-preview.md (AC-1, AC-4, AC-10). Pure.

export type PreviewKind =
  | 'galleryItem'
  | 'comicChapter'
  | 'comicSeries'
  | 'commissionSettings'
  | 'aboutPage'
  | 'homePage'
  | 'contactSettings'
  | 'writtenWork'
  | 'product'
  | 'commissionType';

export type PreviewPage = 'portfolio' | 'reader' | 'series' | 'commissions' | 'about' | 'home' | 'writing' | 'shop';

export const PREVIEW_KINDS: PreviewKind[] = [
  'galleryItem',
  'comicChapter',
  'comicSeries',
  'commissionSettings',
  'aboutPage',
  'homePage',
  'contactSettings',
  'writtenWork',
  'product',
  'commissionType',
];

/** Portfolio section values and their titles, as the portfolio shows them. */
export const PORTFOLIO_SECTION_TITLES: Record<string, string> = {
  original: 'Original Work',
  fanart: 'Fan Work',
  commission: 'Past Clients',
  featured: 'Featured',
  wip: 'Work in Progress',
};

export const PREVIEW_MESSAGES = {
  noSection: 'Choose a portfolio section to see where this piece goes.',
  noPicture: 'Add the picture to preview it.',
  noAddress: 'Add a web address so readers can find this comic. The preview needs it too.',
  noPages: 'Add a page to preview this chapter.',
} as const;

export interface PreviewTarget {
  page: PreviewPage;
  /** "the Commissions page", for "Preview of …" above the page. */
  name: string;
  /** The id of the element the page scrolls to, if not the top. */
  anchor?: string;
  /** Shown instead of the page when it can't be shown. */
  message?: string;
}

/** A Sanity document as stored, with only the fields previewing needs. */
export type RawDoc = { _id: string; _type: string; [field: string]: unknown };

export interface TargetContext {
  /** For a chapter: its series (draft if never published), if it has one. */
  series?: RawDoc;
  /** For a chapter: the page number open in the page panel. */
  page?: number;
  /** For an art piece: whether Show it opened is on. */
  opened?: boolean;
  /** For the about page: the first changed part, to scroll to. */
  firstChanged?: string;
}

export function isPreviewKind(kind: string): kind is PreviewKind {
  return (PREVIEW_KINDS as string[]).includes(kind);
}

const text = (value: unknown): string => (typeof value === 'string' ? value : '');
const list = (value: unknown): unknown[] => (Array.isArray(value) ? value : []);
const slugOf = (doc: RawDoc | undefined): string => text((doc?.slug as { current?: unknown } | undefined)?.current);
const hasImage = (doc: RawDoc): boolean => Boolean((doc.image as { asset?: unknown } | undefined)?.asset);

function chapterName(doc: RawDoc): string {
  const number = typeof doc.number === 'number' ? doc.number : 0;
  return number === 0 ? text(doc.title) || 'Chapter 0' : `Chapter ${number}`;
}

export function previewTarget(doc: RawDoc, context: TargetContext = {}): PreviewTarget {
  switch (doc._type) {
    case 'galleryItem': {
      const sections = list(doc.category).map(text).filter(Boolean);
      const name = context.opened ? 'the Portfolio, with this piece opened' : 'the Portfolio';
      if (sections.length === 0) return { page: 'portfolio', name, message: PREVIEW_MESSAGES.noSection };
      if (!hasImage(doc)) return { page: 'portfolio', name, message: PREVIEW_MESSAGES.noPicture };
      return { page: 'portfolio', name, anchor: `section-${sections[0]}` };
    }
    case 'comicSeries': {
      const name = `the ${text(doc.title)} series page`;
      return slugOf(doc) ? { page: 'series', name } : { page: 'series', name, message: PREVIEW_MESSAGES.noAddress };
    }
    case 'comicChapter': {
      const pages = list(doc.pages).length;
      const page = Math.min(Math.max(context.page ?? 1, 1), Math.max(pages, 1));
      const name = `${chapterName(doc)}, page ${page} in the reader`;
      if (!slugOf(context.series)) return { page: 'reader', name, message: PREVIEW_MESSAGES.noAddress };
      if (pages === 0) return { page: 'reader', name, message: PREVIEW_MESSAGES.noPages };
      return { page: 'reader', name };
    }
    case 'aboutPage':
      return context.firstChanged
        ? { page: 'about', name: 'the about page', anchor: `about-${context.firstChanged}` }
        : { page: 'about', name: 'the about page' };
    case 'homePage':
      return { page: 'home', name: 'the home page', anchor: 'artist-text' };
    case 'contactSettings':
      return { page: 'home', name: 'the home page, scrolled to the social links and footer', anchor: 'social-links' };
    case 'writtenWork':
      return { page: 'writing', name: 'the Writing page', anchor: `item-${doc._id}` };
    case 'product':
      return { page: 'shop', name: 'the shop', anchor: `item-${doc._id}` };
    case 'commissionType':
      return { page: 'commissions', name: 'the Commissions page', anchor: `item-${doc._id}` };
    default:
      return { page: 'commissions', name: 'the Commissions page' };
  }
}
