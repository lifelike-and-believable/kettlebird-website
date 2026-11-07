// Loads stories with their chapters at build time: from Sanity normally (published only, src/lib/sanity.ts),
// from tests/fixtures/stories.ts when KETTLEBIRD_FIXTURES=1. Spec: docs/specs/story-reader-pages.md AC-1, AC-14.
import { sanityClient, urlFor } from '../sanity';
import { RATING_TITLES, STATUS_TITLES, type Rating, type Story, type StoryImage, type StoryPicture, type StoryStatus, type TextBlock } from './model';
import { pictureWidths } from './text';

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

// A text's blocks, with each picture's size (story-import-word AC-21).
const CONTENT = 'content[]{ ..., _type == "storyPicture" => { _key, _type, alt, decorative, image, "dimensions": image.asset->metadata.dimensions } }';

export const STORIES_QUERY = `*[_type == "writtenWork"] {
  _id, title, slug, excerpt, genre, rating, contentNotes, status, externalLink, publishDate, ${CONTENT},
  coverImage { asset, hotspot, "dimensions": asset->metadata.dimensions },
  "chapters": *[_type == "storyChapter" && story._ref == ^._id] | order(number asc) { number, title, publishDate, ${CONTENT} }
}`;

const COVER_WIDTHS = [300, 500, 800];

function cover(image: SanityImage | undefined): StoryImage | undefined {
  if (!image?.asset) return undefined;
  const at = (w: number) => urlFor(image).width(w).auto('format').url();
  return {
    src: at(500),
    srcset: COVER_WIDTHS.map((w) => `${at(w)} ${w}w`).join(', '),
    width: image.dimensions?.width ?? 500,
    height: image.dimensions?.height ?? 700,
    // Link previews: the whole cover on a paper-coloured 1200 × 630 background, as comics do.
    social: urlFor(image).ignoreImageParams().width(1200).height(630).fit('fill').bg('f5f1e8').format('jpg').url(),
  };
}

const known = <T extends string>(value: string | undefined, values: Record<T, string>): T | undefined =>
  value && value in values ? (value as T) : undefined;
interface SanityPicture { _type: 'storyPicture'; _key?: string; image?: SanityImage; dimensions?: { width: number; height: number }; alt?: string; decorative?: boolean }

/** AC-21: a stored picture as the model's, at the widths the site makes; none without an image or a size. */
function picture(raw: SanityPicture): StoryPicture | undefined {
  const size = raw.dimensions;
  if (!raw.image?.asset?._ref || !size?.width || !size.height) return undefined;
  const at = (w: number) => urlFor(raw.image!).width(w).auto('format').url();
  const widths = pictureWidths(size.width);
  return {
    _type: 'storyPicture',
    _key: raw._key,
    src: at(Math.min(800, size.width)),
    srcset: widths.map((w) => `${at(w)} ${w}w`).join(', '),
    width: size.width,
    height: size.height,
    alt: raw.alt,
    decorative: !!raw.decorative,
  };
}

const blocks = (value: unknown[] | undefined): TextBlock[] =>
  (value ?? []).flatMap((block) => {
    if ((block as { _type?: string })?._type !== 'storyPicture') return [block as TextBlock];
    const made = picture(block as SanityPicture);
    return made ? [made] : [];
  });

export function fromSanity(raw: SanityStory): Story {
  return {
    id: raw._id,
    slug: raw.slug?.current || undefined,
    title: raw.title,
    description: raw.excerpt,
    cover: cover(raw.coverImage),
    genres: raw.genre ?? [],
    rating: known<Rating>(raw.rating, RATING_TITLES),
    contentNotes: raw.contentNotes,
    status: known<StoryStatus>(raw.status, STATUS_TITLES),
    link: raw.externalLink,
    date: raw.publishDate,
    text: blocks(raw.content),
    chapters: (raw.chapters ?? []).map((c) => ({ number: c.number ?? 0, title: c.title || undefined, date: c.publishDate, text: blocks(c.content) })),
  };
}

let cache: Promise<Story[]> | undefined;

/** Every story, read once per build. */
export function getStories(): Promise<Story[]> {
  cache ??= load();
  return cache;
}

async function load(): Promise<Story[]> {
  if (import.meta.env.KETTLEBIRD_FIXTURES === '1' || process.env.KETTLEBIRD_FIXTURES === '1') {
    const { FIXTURE_STORIES } = await import('../../../tests/fixtures/stories');
    return FIXTURE_STORIES;
  }
  try {
    const raw: SanityStory[] = await sanityClient.fetch(STORIES_QUERY);
    return raw.map(fromSanity);
  } catch (e) {
    console.warn('[stories] Could not fetch stories:', e);
    return [];
  }
}
