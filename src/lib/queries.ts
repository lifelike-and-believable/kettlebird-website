import { sanityClient } from './sanity';
import type { Subfolder } from './portfolio/folders';

/** The fixture build (KETTLEBIRD_FIXTURES=1) lists no content, so its pages never depend on what is live. */
const isFixtureBuild = () => import.meta.env.KETTLEBIRD_FIXTURES === '1' || process.env.KETTLEBIRD_FIXTURES === '1';
const list = <T>(query: string): Promise<T[]> => (isFixtureBuild() ? Promise.resolve([]) : sanityClient.fetch(query));

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
  /** The ids of the subfolders it's in (portfolio-folders AC-20), weak references. */
  subfolders?: string[];
}

export const GALLERY_QUERY = `*[_type == "galleryItem"] | order(date desc) {
  _id, title, slug, image { asset, hotspot },
  description, category, tags, date, featured, altText,
  "subfolders": subfolders[]._ref
}`;

/** portfolio-folders AC-8, AC-12: the subfolders; the page leaves out those with no pieces. */
export const SUBFOLDERS_QUERY = `*[_type == "portfolioSubfolder"] { _id, name, slug, section, gridSize, order }`;

export async function getAllSubfolders(): Promise<Subfolder[]> {
  return list(SUBFOLDERS_QUERY);
}

export const FEATURED_GALLERY_QUERY = `*[_type == "galleryItem" && featured == true] | order(date desc) {
  _id, title, slug, image { asset, hotspot },
  description, category, tags, date, altText
}`;

export async function getAllGalleryItems(): Promise<GalleryItem[]> {
  return list(GALLERY_QUERY);
}

export async function getFeaturedGalleryItems(): Promise<GalleryItem[]> {
  return list(FEATURED_GALLERY_QUERY);
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
  return list(WRITTEN_WORKS_QUERY);
}

// ── News Posts ─────────────────────────────────────────────────────────────
// Using galleryItem + writtenWork as news sources isn't ideal long-term;
// a dedicated 'newsPost' schema would be cleaner. For now we surface recent
// written works and gallery items as a combined feed. A newsPost schema can
// be added later without changing this interface.

export interface NewsPost {
  _id: string;
  _type: string;
  title: string;
  slug: { current: string };
  excerpt?: string;
  publishDate?: string;
  coverImage?: { asset: { _ref: string } };
  externalLink?: string;
}

export const NEWS_QUERY = `*[_type in ["writtenWork", "galleryItem"]] | order(coalesce(publishDate, date) desc) [0...20] {
  _id, _type, title, slug,
  "excerpt": select(_type == "writtenWork" => excerpt, _type == "galleryItem" => description),
  "publishDate": select(_type == "writtenWork" => publishDate, _type == "galleryItem" => date),
  "coverImage": select(_type == "writtenWork" => coverImage, _type == "galleryItem" => image),
  externalLink
}`;

export async function getNewsFeed(): Promise<NewsPost[]> {
  return list(NEWS_QUERY);
}

// ── Shop ───────────────────────────────────────────────────────────────────

export interface Product {
  _id: string;
  name: string;
  slug: { current: string };
  price?: string;
  description?: string;
  category?: string;
  images?: { asset: { _ref: string } }[];
  kofiLink?: string;
  tags?: string[];
}

export const PRODUCTS_QUERY = `*[_type == "product"] | order(name asc) {
  _id, name, slug, price, description, category,
  images[] { asset }, kofiLink, tags
}`;

export async function getAllProducts(): Promise<Product[]> {
  return list(PRODUCTS_QUERY);
}

// ── Commissions ────────────────────────────────────────────────────────────

export interface CommissionType {
  _id: string;
  name: string;
  priceRange?: string;
  description?: string;
  exampleImages?: { asset: { _ref: string } }[];
  deliveryTime?: string;
  order?: number;
}

export const COMMISSIONS_QUERY = `*[_type == "commissionType"] | order(order asc) {
  _id, name, priceRange, description,
  exampleImages[] { asset }, deliveryTime, order
}`;

export async function getAllCommissionTypes(): Promise<CommissionType[]> {
  return list(COMMISSIONS_QUERY);
}

// ── Comics ─────────────────────────────────────────────────────────────────

// Comic series, chapters, and pages: see src/lib/comics/source.ts.
