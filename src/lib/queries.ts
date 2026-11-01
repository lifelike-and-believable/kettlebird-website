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
  return sanityClient.fetch(NEWS_QUERY);
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
  return sanityClient.fetch(PRODUCTS_QUERY);
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
  return sanityClient.fetch(COMMISSIONS_QUERY);
}

// ── Comics ─────────────────────────────────────────────────────────────────

// Comic series, chapters, and pages: see src/lib/comics/source.ts.
