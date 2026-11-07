// The Portfolio's link preview: the newest piece in its Featured section, fitted whole on paper
// (site-search AC-7; design-site-search, Link previews).
import { urlFor } from './sanity';
import type { GalleryItem } from './queries';

/** The newest piece by date whose Portfolio sections include Featured; the old `featured` switch is ignored. */
export function featuredPiece(items: GalleryItem[]): GalleryItem | undefined {
  const featured = items.filter((item) => item.category?.includes('featured'));
  return featured.reduce<GalleryItem | undefined>((newest, item) => (!newest || (item.date ?? '') > (newest.date ?? '') ? item : newest), undefined);
}

/** The piece whole on the paper colour, 1200 × 630, with its alt text, else its title. */
export function portfolioPreviewImage(item: GalleryItem): { image: string; alt: string } {
  return {
    image: urlFor(item.image).ignoreImageParams().width(1200).height(630).fit('fill').bg('f5f1e8').format('jpg').url(),
    alt: item.altText?.trim() || item.title,
  };
}
