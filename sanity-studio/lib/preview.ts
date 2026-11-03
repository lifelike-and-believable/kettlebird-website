// The editor's side of the preview: which items have it, the pane's words, widths and timing.
// Design: docs/design/preview.md. Spec: docs/specs/content-editing-preview.md (AC-1, AC-2, AC-6, AC-10, AC-11).
// Pure; no `sanity` imports.

export const PREVIEWABLE_TYPES: string[] = [
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

export const PREVIEW_TEXT = {
  preview: 'Preview',
  hide: 'Hide preview',
  computer: 'Computer',
  phone: 'Phone',
  showOpened: 'Show it opened',
  ribbon: "Preview: not on the site yet. This item's unpublished changes are shown, outlined; everything else is as published.",
  published: 'Published. The site matches this preview once the status at the top right says Live.',
  updated: 'Updated just now',
  cantLoad: "Can't show the preview right now.",
  tryAgain: 'Try again',
  saved: 'Your changes are saved. You can still publish.',
  linksOff: "Links don't work in the preview",
  announced: 'Preview updated',
} as const;

export const WIDTHS = { computer: 1280, phone: 375 } as const;

/** Renew the one-hour preview key this often while the preview is open. */
export const SECRET_RENEW_MS = 50 * 60 * 1000;

/** Reload this long after the draft was last saved. */
export const SETTLE_MS = 1500;

export function isPreviewable(type: string): boolean {
  return PREVIEWABLE_TYPES.includes(type);
}

export function previewUrl(origin: string, type: string, id: string, params: { secret: string; page?: number; opened?: boolean }): string {
  const query = new URLSearchParams({ 'sanity-preview-secret': params.secret });
  if (params.page) query.set('page', String(params.page));
  if (params.opened) query.set('opened', '1');
  return `${origin.replace(/\/+$/, '')}/preview/${encodeURIComponent(type)}/${encodeURIComponent(id)}?${query}`;
}

/** How much to shrink a page of `width` to fit `available` pixels; never enlarge. */
export function scaleToFit(available: number, width: number): number {
  return Math.min(1, available / width);
}

/** "Preview of the Commissions page", the region's name for screen readers. */
export function regionName(pageName: string): string {
  return `Preview of ${pageName}`;
}

/** The page number open in a chapter's page panel, from the form pane's `path` parameter. */
export function pageFromPath(path: string | undefined, pages: { _key?: string }[] | undefined): number | undefined {
  const key = path && /pages\[_key=="([^"]+)"\]/.exec(path)?.[1];
  if (!key) return undefined;
  const index = pages?.findIndex((p) => p._key === key) ?? -1;
  return index === -1 ? undefined : index + 1;
}
