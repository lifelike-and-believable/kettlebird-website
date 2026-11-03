// Loads comic series with their chapters and pages at build time.
// From Sanity normally; from tests/fixtures/comics.ts when KETTLEBIRD_FIXTURES=1 (tests and tutorials).
// Spec: docs/specs/comic-reader-start-and-turn.md.
import { sanityClient, urlFor } from '../sanity';
import type { ComicImage, ComicSeries, SeriesStatus, SeriesType } from './model';

// Widths the reader requests from the image service; never the print-resolution original.
const PAGE_WIDTHS = [480, 800, 1200, 1600];
const COVER_WIDTHS = [300, 500, 800];
// The contact sheet's small pictures (design-comic-sheet-and-controls): never the full pages.
const THUMB_WIDTHS = [150, 300];

interface SanityImage {
  asset?: { _ref: string };
  hotspot?: { x: number; y: number };
  dimensions?: { width: number; height: number };
}

export interface SanitySeries {
  title: string;
  slug?: { current?: string };
  description?: string;
  status?: SeriesStatus;
  type?: SeriesType;
  coverImage?: SanityImage;
  chapters?: { number?: number; title?: string; pages?: (SanityImage & { altText?: string })[] }[];
}

export const COMIC_SERIES_WITH_CHAPTERS_QUERY = `*[_type == "comicSeries"] | order(title asc) {
  title, slug, description, status, type,
  coverImage { asset, hotspot, "dimensions": asset->metadata.dimensions },
  "chapters": *[_type == "comicChapter" && series._ref == ^._id] | order(number asc) {
    number, title,
    "pages": pages[] { asset, altText, "dimensions": asset->metadata.dimensions }
  }
}`;

function sanityImage(image: SanityImage | undefined, widths: number[]): ComicImage | undefined {
  if (!image?.asset) return undefined;
  const width = image.dimensions?.width ?? 800;
  const height = image.dimensions?.height ?? 1200;
  const at = (w: number) => urlFor(image).width(w).auto('format').url();
  return {
    src: at(widths[1] ?? widths[0]),
    srcset: widths.map((w) => `${at(w)} ${w}w`).join(', '),
    width,
    height,
  };
}

// Link previews (design-comic-share-and-announce): the whole cover on a paper-coloured 1200 × 630
// background, so a tall cover isn't cut to a strip.
function withSocial(cover: ComicImage | undefined, image: SanityImage | undefined): ComicImage | undefined {
  if (!cover || !image?.asset) return cover;
  return { ...cover, social: urlFor(image).width(1200).height(630).fit('fill').bg('f5f1e8').format('jpg').url() };
}

export function fromSanity(raw: SanitySeries): ComicSeries {
  return {
    title: raw.title,
    slug: raw.slug?.current || undefined,
    description: raw.description,
    status: raw.status,
    type: raw.type,
    cover: withSocial(sanityImage(raw.coverImage, COVER_WIDTHS), raw.coverImage),
    chapters: (raw.chapters ?? []).map((c) => ({
      number: c.number ?? 0,
      title: c.title || undefined,
      pages: (c.pages ?? []).flatMap((p) => {
        const image = sanityImage(p, PAGE_WIDTHS);
        const thumb = sanityImage(p, THUMB_WIDTHS);
        return image ? [{ image: { ...image, thumb: thumb && { src: thumb.src, srcset: thumb.srcset } }, altText: p.altText }] : [];
      }),
    })),
  };
}

let cache: Promise<ComicSeries[]> | undefined;

export function getComicSeries(): Promise<ComicSeries[]> {
  cache ??= load();
  return cache;
}

async function load(): Promise<ComicSeries[]> {
  if (import.meta.env.KETTLEBIRD_FIXTURES === '1' || process.env.KETTLEBIRD_FIXTURES === '1') {
    const { FIXTURE_SERIES } = await import('../../../tests/fixtures/comics');
    return FIXTURE_SERIES;
  }
  try {
    const raw: SanitySeries[] = await sanityClient.fetch(COMIC_SERIES_WITH_CHAPTERS_QUERY);
    return raw.map(fromSanity);
  } catch (e) {
    console.warn('[comics] Could not fetch comic series:', e);
    return [];
  }
}
