import { sanityClient } from './sanity';

// ── Gallery ────────────────────────────────────────────────────────────────

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
  _id, title, slug, image { asset, hotspot },
  description, category, tags, date, featured, altText
}`;

export const FEATURED_GALLERY_QUERY = `*[_type == "galleryItem" && featured == true] | order(date desc) {
  _id, title, slug, image { asset, hotspot },
  description, category, tags, date, altText
}`;

export async function getAllGalleryItems(): Promise<GalleryItem[]> {
  return sanityClient.fetch(GALLERY_QUERY);
}

export async function getFeaturedGalleryItems(): Promise<GalleryItem[]> {
  return sanityClient.fetch(FEATURED_GALLERY_QUERY);
}

// ── Written Works ──────────────────────────────────────────────────────────

export interface WrittenWork {
  _id: string;
  title: string;
  slug: { current: string };
  coverImage?: { asset: { _ref: string }; hotspot?: { x: number; y: number } };
  excerpt?: string;
  genre?: string[];
  externalLink?: string;
  publishDate?: string;
}

export const WRITTEN_WORKS_QUERY = `*[_type == "writtenWork"] | order(publishDate desc) {
  _id, title, slug, coverImage { asset, hotspot },
  excerpt, genre, externalLink, publishDate
}`;

export async function getAllWrittenWorks(): Promise<WrittenWork[]> {
  return sanityClient.fetch(WRITTEN_WORKS_QUERY);
}

// ── Comics ─────────────────────────────────────────────────────────────────

export interface ComicSeries {
  _id: string;
  title: string;
  slug: { current: string };
  coverImage?: { asset: { _ref: string }; hotspot?: { x: number; y: number } };
  description?: string;
  type?: 'original' | 'fancomic';
  status?: 'ongoing' | 'complete' | 'hiatus';
  pageCount?: number;
}

export const COMIC_SERIES_QUERY = `*[_type == "comicSeries"] | order(title asc) {
  _id, title, slug, coverImage { asset, hotspot },
  description, type, status,
  "pageCount": count(pages)
}`;

export async function getAllComicSeries(): Promise<ComicSeries[]> {
  return sanityClient.fetch(COMIC_SERIES_QUERY);
}
