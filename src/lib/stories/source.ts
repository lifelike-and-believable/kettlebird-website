// Loads stories with their chapters at build time: from Sanity normally, from tests/fixtures/stories.ts
// when KETTLEBIRD_FIXTURES=1. Spec: docs/specs/story-reader-pages.md AC-1, AC-14. STUB (tests first).
import type { Story } from './model';

interface SanityImage { asset?: { _ref: string }; hotspot?: { x: number; y: number }; dimensions?: { width: number; height: number } }

/** A story as the query returns it. */
export interface SanityStory {
  _id: string;
  title: string;
  slug?: { current?: string };
  excerpt?: string;
  coverImage?: SanityImage;
  genre?: string[];
  rating?: string;
  contentNotes?: string;
  status?: string;
  externalLink?: string;
  publishDate?: string;
  content?: unknown[];
  chapters?: { number?: number; title?: string; publishDate?: string; content?: unknown[] }[];
}

export const STORIES_QUERY = '';

export function fromSanity(_raw: SanityStory): Story {
  throw new Error('Not built yet');
}

export async function getStories(): Promise<Story[]> {
  return [];
}
