// Search engines and link previews: whether the site is listed, canonical addresses, robots.txt, the
// sitemap, the site card, the Commissions page's description and structured data.
// Design: docs/design/site-search.md. Spec: docs/specs/site-search.md. Pure functions only.
import { chapterLabel as comicChapterLabel, pagePath, seriesPath, showsChapterList, type ComicSeries, type ReaderPage } from './comics/model';
import { chapterLabel as storyChapterLabel, chapterPath, storyPath, type Story, type StoryChapter } from './stories/model';

/** The one address at which search engines may list the site (the lead, 2026-11-07). */
export const LISTED_ORIGIN = 'https://kettlebird.com';
const SITE_NAME = 'Kettlebird Creations';

/** The site's address, or a local one when a page is rendered without one (as unit tests render pages). */
export function siteHref(site: URL | undefined): string {
  return site?.href ?? 'http://localhost/';
}

/** AC-1: listed only at https://kettlebird.com. */
export function isListed(site: string | URL | undefined): boolean {
  try {
    return new URL(site ?? '').origin === LISTED_ORIGIN;
  } catch {
    return false;
  }
}

/** AC-1: every page asks not to be listed until the move; pages that ask for it, always. */
export function pageNoindex(site: string | URL | undefined, noindex: boolean): boolean {
  return noindex || !isListed(site);
}

/** AC-4: the site's address and the path, without a closing slash; the site itself for the home page. */
export function canonicalUrl(site: string, path: string): string {
  const trimmed = path.replace(/^\/+|\/+$/g, '');
  return new URL(trimmed ? `/${trimmed}` : '/', site).href;
}

/** AC-2 */
export function robotsTxt(site: string): string {
  const lines = 'User-agent: *\nAllow: /\n';
  return isListed(site) ? `${lines}\nSitemap: ${canonicalUrl(site, 'sitemap-index.xml')}\n` : lines;
}

/** Built pages that aren't public: help, previews, the All pages sheets, Page not found and the editor. */
const UNLISTED = [/^help(\/|$)/, /^preview(\/|$)/, /^studio(\/|$)/, /^404(\.html)?$/, /^comics\/[^/]+\/\d+(\/\d+)?\/pages$/];

/** AC-3: the paths of the public pages among those built, each once, as their canonical paths, sorted. */
export function sitemapPaths(built: string[]): string[] {
  const paths = new Set<string>();
  for (const page of built) {
    const trimmed = page.replace(/^\/+|\/+$/g, '');
    if (UNLISTED.some((pattern) => pattern.test(trimmed))) continue;
    paths.add(`/${trimmed}`);
  }
  return [...paths].sort();
}

const xml = (text: string) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const XML_HEAD = '<?xml version="1.0" encoding="UTF-8"?>\n';
const SITEMAP_NS = 'xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"';

/** AC-3 */
export function sitemapIndex(site: string): string {
  return `${XML_HEAD}<sitemapindex ${SITEMAP_NS}>\n<sitemap><loc>${xml(canonicalUrl(site, 'sitemap-0.xml'))}</loc></sitemap>\n</sitemapindex>\n`;
}

/** AC-3: the canonical address of each path, and nothing more. */
export function sitemapXml(site: string, paths: string[]): string {
  const urls = paths.map((path) => `<url><loc>${xml(canonicalUrl(site, path))}</loc></url>\n`).join('');
  return `${XML_HEAD}<urlset ${SITEMAP_NS}>\n${urls}</urlset>\n`;
}

/** AC-6: the site card (docs/design/mockups/site-search/site-card.jpg). */
export const SITE_CARD = {
  path: '/assets/images/site-card.jpg',
  width: 1200,
  height: 630,
  alt: 'Kettlebird Creations: illustration, comics and stories by Star Goldberg',
} as const;

/** AC-6: the site card's own alt text, or a cover's. */
export function previewImageAlt(image: string, title: string): string {
  return image.endsWith(SITE_CARD.path) ? SITE_CARD.alt : `Cover of ${title}`;
}

/** AC-8 */
export function commissionsDescription(open: boolean): string {
  return open
    ? 'Commissions are open. Commission artwork from Kettlebird Creations: pricing, examples, and how to order.'
    : 'Commissions are closed for now. Pricing and examples of artwork from Kettlebird Creations.';
}

// ── Structured data (AC-9) ────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Data = Record<string, any>;
const CONTEXT = 'https://schema.org';
const starId = (site: string) => `${canonicalUrl(site, '/')}#star`;
const author = (site: string) => ({ '@id': starId(site) });
/** Only the keys whose values are given. */
const given = (data: Data): Data => Object.fromEntries(Object.entries(data).filter(([, v]) => v !== undefined && !(Array.isArray(v) && v.length === 0)));

function person(site: string, links: { url: string }[], image?: string): Data {
  return given({
    '@type': 'Person',
    '@id': starId(site),
    name: 'Star Goldberg',
    alternateName: 'Kettlebird',
    url: canonicalUrl(site, '/'),
    image,
    sameAs: links.map((l) => l.url),
  });
}

function breadcrumbs(site: string, steps: [name: string, path: string][]): Data {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: steps.map(([name, path], i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name,
      item: canonicalUrl(site, path),
    })),
  };
}

export function homeData(site: string, links: { url: string }[]): Data {
  return {
    '@context': CONTEXT,
    '@graph': [{ '@type': 'WebSite', name: SITE_NAME, url: canonicalUrl(site, '/') }, person(site, links)],
  };
}

export function aboutData(site: string, links: { url: string }[], portrait?: string): Data {
  return {
    '@context': CONTEXT,
    '@type': 'ProfilePage',
    url: canonicalUrl(site, '/about'),
    mainEntity: person(site, links, portrait),
  };
}

export function seriesData(site: string, series: ComicSeries): Data {
  const path = seriesPath(series.slug!);
  return {
    '@context': CONTEXT,
    '@graph': [
      given({
        '@type': 'ComicSeries',
        name: series.title,
        description: series.description?.trim() || undefined,
        image: series.cover?.social,
        author: author(site),
        url: canonicalUrl(site, path),
      }),
      breadcrumbs(site, [
        ['Comics', '/comics'],
        [series.title, path],
      ]),
    ],
  };
}

export function readerPageData(site: string, entry: ReaderPage): Data {
  const slug = entry.series.slug!;
  const steps: [string, string][] = [
    ['Comics', '/comics'],
    [entry.series.title, seriesPath(slug)],
  ];
  if (showsChapterList(entry.series)) steps.push([comicChapterLabel(entry.chapter), pagePath(slug, entry.chapter.number, 1)]);
  steps.push([`Page ${entry.pageNumber}`, entry.path]);
  return { '@context': CONTEXT, ...breadcrumbs(site, steps) };
}

export function storyData(site: string, story: Story): Data {
  const path = storyPath(story.slug!);
  return {
    '@context': CONTEXT,
    '@graph': [
      given({
        '@type': 'CreativeWork',
        name: story.title,
        description: story.description?.trim() || undefined,
        genre: story.genres,
        image: story.cover?.social,
        author: author(site),
        datePublished: story.date,
        url: canonicalUrl(site, path),
      }),
      breadcrumbs(site, [
        ['Writing', '/writing'],
        [story.title, path],
      ]),
    ],
  };
}

export function chapterData(site: string, story: Story, chapter: StoryChapter): Data {
  const slug = story.slug!;
  return {
    '@context': CONTEXT,
    ...breadcrumbs(site, [
      ['Writing', '/writing'],
      [story.title, storyPath(slug)],
      [storyChapterLabel(chapter), chapterPath(slug, chapter.number)],
    ]),
  };
}

/** JSON for a script element: `<` escaped, so the text can't close the script. */
export function jsonLd(data: Data): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
