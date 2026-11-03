// What changed between an item's published version and its draft: the parts to outline, and the
// notes for the yellow line. Design: docs/design/preview.md (Flow, States and errors).
// Spec: docs/specs/content-editing-preview.md (AC-3, AC-5). Pure.
import type { RawDoc } from './targets';

export interface PreviewChanges {
  /** Top-level fields that changed, which the page outlines. */
  outlined: string[];
  /** Lines for the yellow line, in order. */
  notes: string[];
}

export interface ChangeContext {
  /** For an art piece: the portfolio section titles it's in, after the first. */
  otherSections?: string[];
  /** For a chapter: its series has never been published. */
  seriesUnpublished?: boolean;
  /** For a chapter: another chapter in the series has this chapter's number. */
  duplicateNumber?: number;
}

export function previewChanges(_published: RawDoc | undefined, _draft: RawDoc, _context?: ChangeContext): PreviewChanges {
  throw new Error('not implemented');
}

/** The draft in place of its published version, for the page to render. */
export function overlay(_docs: RawDoc[], _draft: RawDoc): RawDoc[] {
  throw new Error('not implemented');
}
