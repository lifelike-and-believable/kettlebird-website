import { sanityClient } from './sanity';

export interface GalleryItem {
  _id: string;
  title: string;
  slug: { current: string };
  image: {
    asset: { _ref: string };
    hotspot?: { x: number; y: number };
  };
  description?: string;
  category?: string[];
  tags?: string[];
  date?: string;
  featured?: boolean;
  altText?: string;
}

export const GALLERY_QUERY = `*[_type == "galleryItem"] | order(date desc) {
  _id,
  title,
  slug,
  image { asset, hotspot },
  description,
  category,
  tags,
  date,
  featured,
  altText
}`;

export const FEATURED_GALLERY_QUERY = `*[_type == "galleryItem" && featured == true] | order(date desc) {
  _id,
  title,
  slug,
  image { asset, hotspot },
  description,
  category,
  tags,
  date,
  altText
}`;

export async function getAllGalleryItems(): Promise<GalleryItem[]> {
  return sanityClient.fetch(GALLERY_QUERY);
}

export async function getFeaturedGalleryItems(): Promise<GalleryItem[]> {
  return sanityClient.fetch(FEATURED_GALLERY_QUERY);
}
