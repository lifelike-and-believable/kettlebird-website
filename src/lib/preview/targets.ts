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

export const PREVIEW_KINDS: PreviewKind[] = [];

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

export function isPreviewKind(_kind: string): _kind is PreviewKind {
  throw new Error('not implemented');
}

export function previewTarget(_doc: RawDoc, _context?: TargetContext): PreviewTarget {
  throw new Error('not implemented');
}
