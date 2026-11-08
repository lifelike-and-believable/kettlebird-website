// Which parts of a page show each field, so the preview can outline the parts Star changed.
// Spec: docs/specs/content-editing-preview.md (AC-5). Pure.
import type { PreviewKind } from './targets';

const part = (name: string) => `[data-part="${name}"]`;

const FIELD_PARTS: Partial<Record<PreviewKind, Record<string, string>>> = {
  commissionSettings: { status: 'commission-banner', note: 'commission-banner' },
  homePage: { artistText: 'artist-text' },
  contactSettings: { links: 'social-links' },
  aboutPage: { portrait: 'about-portrait', bio: 'about-bio', statement: 'about-statement', facts: 'about-facts' },
  comicSeries: { title: 'series-title', description: 'series-description', coverImage: 'series-cover', status: 'series-tags', type: 'series-tags' },
  comicChapter: { pages: 'reader-page', title: 'reader-location', number: 'reader-location' },
  storyChapter: { content: 'story-text', title: 'chapter-title', number: 'chapter-title' },
};

/** Items shown as one card: any change outlines the card. */
const WHOLE_ITEM: Partial<Record<PreviewKind, string>> = {
  galleryItem: 'piece',
  portfolioSubfolder: 'subfolder',
  writtenWork: 'item',
  product: 'item',
  commissionType: 'item',
};

/** The selector for the part of the page that shows `field` of item `id`, or undefined if none does. */
export function partSelector(kind: PreviewKind, field: string, id: string): string | undefined {
  const whole = WHOLE_ITEM[kind];
  if (whole) return part(`${whole}-${id}`);
  const name = FIELD_PARTS[kind]?.[field];
  return name ? part(name) : undefined;
}
