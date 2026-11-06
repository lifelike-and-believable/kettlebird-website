// Loads comic series with their chapters and pages at build time.
// From Sanity normally; from tests/fixtures/comics.ts when KETTLEBIRD_FIXTURES=1 (tests and tutorials).
// Spec: docs/specs/comic-reader-start-and-turn.md.
import { sanityClient, urlFor } from '../sanity';
import type { ComicImage, ComicSeries, OpenOn, SeriesStatus, SeriesType } from './model';
import { pictureWidths, readLargestPageWidth, readPageSize } from './page-size';

// Widths the reader requests from the image service are pictureWidths(): never the print-resolution original
// beyond 3200, nor wider than the picture (docs/specs/comic-reader-page-size.md AC-6).
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
  twoUp?: unknown;
  pageFlip?: unknown;
  pageSize?: unknown;
  largestPageWidth?: unknown;
  chapters?: { number?: number; title?: string; openOn?: OpenOn; pages?: (SanityImage & { altText?: string; spread?: boolean; panels?: { x?: number; y?: number; width?: number; height?: number }[]; panelsBy?: string })[] }[];
}

export const COMIC_SERIES_WITH_CHAPTERS_QUERY = `*[_type == "comicSeries"] | order(title asc) {
  title, slug, description, status, type, twoUp, pageFlip, pageSize, largestPageWidth,
  coverImage { asset, hotspot, "dimensions": asset->metadata.dimensions },
  "chapters": *[_type == "comicChapter" && series._ref == ^._id] | order(number asc) {
    number, title, openOn,
    "pages": pages[] { asset, altText, spread, panels[] { x, y, width, height }, panelsBy, "dimensions": asset->metadata.dimensions }
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
  return { ...cover, social: urlFor(image).ignoreImageParams().width(1200).height(630).fit('fill').bg('f5f1e8').format('jpg').url() };
}

// A page's panels and who set them (docs/specs/comic-reader-panels.md AC-1).
function panelsOf(p: { panels?: { x?: number; y?: number; width?: number; height?: number }[]; panelsBy?: string }) {
  const panelsBy: 'site' | 'star' | undefined = p.panelsBy === 'site' || p.panelsBy === 'star' ? p.panelsBy : undefined;
  const panels = (p.panels ?? []).map((q) => ({ x: Number(q.x) || 0, y: Number(q.y) || 0, width: Number(q.width) || 0, height: Number(q.height) || 0 }));
  return panelsBy ? { panels, panelsBy } : {};
}

export function fromSanity(raw: SanitySeries): ComicSeries {
  return {
    title: raw.title,
    slug: raw.slug?.current || undefined,
    description: raw.description,
    status: raw.status,
    type: raw.type,
    cover: withSocial(sanityImage(raw.coverImage, COVER_WIDTHS), raw.coverImage),
    // How it reads: on only when Star ticked it (comic-reader-comic-settings AC-1).
    twoUp: raw.twoUp === true,
    pageFlip: raw.pageFlip === true,
    // How pages fit on a computer (docs/specs/comic-reader-page-size.md AC-4).
    pageSize: readPageSize(raw.pageSize),
    largestPageWidth: readLargestPageWidth(raw.largestPageWidth),
    chapters: (raw.chapters ?? []).map((c) => ({
      number: c.number ?? 0,
      title: c.title || undefined,
      // Two-page spreads (docs/specs/comic-reader-spread-and-flip.md AC-1): the right unless Star chose the left.
      openOn: c.openOn === 'left' ? 'left' : 'right',
      pages: (c.pages ?? []).flatMap((p) => {
        const image = sanityImage(p, pictureWidths(p.dimensions?.width ?? 800));
        const thumb = sanityImage(p, THUMB_WIDTHS);
        return image ? [{ image: { ...image, thumb: thumb && { src: thumb.src, srcset: thumb.srcset } }, altText: p.altText, spread: p.spread === true, ...panelsOf(p) }] : [];
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
