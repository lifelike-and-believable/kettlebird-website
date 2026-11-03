// The editor's side of the preview: which items have it, the pane's words, widths and timing.
// Design: docs/design/preview.md. Spec: docs/specs/content-editing-preview.md (AC-1, AC-2, AC-6, AC-10, AC-11).
// Pure; no `sanity` imports.

export const PREVIEWABLE_TYPES: string[] = [];

export const PREVIEW_TEXT = {} as Record<
  | 'preview' | 'hide' | 'computer' | 'phone' | 'showOpened' | 'ribbon' | 'published' | 'updated'
  | 'cantLoad' | 'tryAgain' | 'saved' | 'linksOff' | 'announced',
  string
>;

export const WIDTHS = { computer: 0, phone: 0 };

/** Renew the one-hour preview key this often while the preview is open. */
export const SECRET_RENEW_MS = 0;

/** Reload this long after the draft was last saved. */
export const SETTLE_MS = 0;

export function isPreviewable(_type: string): boolean {
  throw new Error('not implemented');
}

export function previewUrl(
  _origin: string,
  _type: string,
  _id: string,
  _params: { secret: string; page?: number; opened?: boolean },
): string {
  throw new Error('not implemented');
}

/** How much to shrink a page of `width` to fit `available` pixels; never enlarge. */
export function scaleToFit(_available: number, _width: number): number {
  throw new Error('not implemented');
}

/** "Preview of the Commissions page", the region's name for screen readers. */
export function regionName(_pageName: string): string {
  throw new Error('not implemented');
}
