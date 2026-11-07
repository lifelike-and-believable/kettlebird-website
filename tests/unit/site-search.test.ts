// Search engines and link previews: listing, robots.txt, the sitemap, canonical addresses, the site card,
// the Portfolio's and the Commissions page's previews, structured data, the adult rating, the help text and
// the guides. Criteria: docs/specs/site-search.md.
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { fieldText } from '../../sanity-studio/lib/editor-content';
import { readerPages, type ComicSeries } from '../../src/lib/comics/model';
import { FALLBACK_IMAGE_PATH, pagePreview, seriesPreview } from '../../src/lib/comics/sharing';
import { featuredPiece, portfolioPreviewImage } from '../../src/lib/portfolio-preview';
import type { GalleryItem } from '../../src/lib/queries';
import {
  aboutData,
  canonicalUrl,
  chapterData,
  commissionsDescription,
  homeData,
  isListed,
  jsonLd,
  pageNoindex,
  previewImageAlt,
  readerPageData,
  robotsTxt,
  seriesData,
  SITE_CARD,
  sitemapIndex,
  sitemapPaths,
  sitemapXml,
  storyData,
} from '../../src/lib/seo';
import { shownChapters, type Story } from '../../src/lib/stories/model';
import { storyPreview } from '../../src/lib/stories/sharing';
import { FIXTURE_SERIES } from '../fixtures/comics';
import { FIXTURE_STORIES } from '../fixtures/stories';

const LIVE = 'https://kettlebird.com';
const STAGING = 'https://newsite.kettlebird.com';
const read = (path: string) => readFileSync(path, 'utf8');
const LINKS = [
  { name: 'Bluesky', url: 'https://bsky.app/profile/kettlebird.bsky.social' },
  { name: 'Ko-fi ☕', url: 'https://ko-fi.com/kettlebirdart' },
];
const series = (slug: string) => FIXTURE_SERIES.find((s) => s.slug === slug)!;
const story = (slug: string) => FIXTURE_STORIES.find((s) => s.slug === slug)!;

describe('site-search#AC-1 listing', () => {
  it('lists the site only at https://kettlebird.com', () => {
    for (const site of [LIVE, `${LIVE}/`]) expect(isListed(site), site).toBe(true);
    for (const site of [STAGING, `${STAGING}/`, 'https://www.kettlebird.com', 'http://kettlebird.com', 'https://kettlebird-website-git-x.vercel.app/', 'https://kettlebird.com.evil.test', 'not a url']) {
      expect(isListed(site), site).toBe(false);
    }
  });

  it('asks every page not to be listed until then, and keeps the unlisted pages unlisted after', () => {
    expect(pageNoindex(STAGING, false)).toBe(true);
    expect(pageNoindex(STAGING, true)).toBe(true);
    expect(pageNoindex(LIVE, false)).toBe(false);
    expect(pageNoindex(LIVE, true)).toBe(true);
  });

  it('puts the noindex in the layout from the site\'s address', () => {
    expect(read('src/layouts/BaseLayout.astro')).toMatch(/pageNoindex\(Astro\.site/);
  });
});

describe('site-search#AC-2 robots', () => {
  it('allows everything, and names the sitemap only once listed', () => {
    expect(robotsTxt(STAGING)).toBe('User-agent: *\nAllow: /\n');
    expect(robotsTxt(`${LIVE}/`)).toBe('User-agent: *\nAllow: /\n\nSitemap: https://kettlebird.com/sitemap-index.xml\n');
    expect(robotsTxt(LIVE)).not.toMatch(/Disallow/);
  });
});

describe('site-search#AC-3 sitemap', () => {
  const built = [
    '',
    'portfolio/',
    'writing/the-long-road/3/',
    'comics/kettle-tales/',
    'comics/kettle-tales/2/1/',
    'comics/kettle-tales/2/1/pages/',
    'comics/kettle-tales/2/pages/',
    'help/',
    'help/going-live/',
    'preview/writtenWork/x/',
    '404/',
    '404.html',
    'studio/',
    'portfolio/',
    'about',
  ];

  it('lists every public page once, sorted, and nothing else', () => {
    expect(sitemapPaths(built)).toEqual(['/', '/about', '/comics/kettle-tales', '/comics/kettle-tales/2/1', '/portfolio', '/writing/the-long-road/3']);
  });

  it('writes the index and the list, with the canonical addresses and nothing more', () => {
    expect(sitemapIndex(`${LIVE}/`)).toBe(
      '<?xml version="1.0" encoding="UTF-8"?>\n' +
        '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
        '<sitemap><loc>https://kettlebird.com/sitemap-0.xml</loc></sitemap>\n' +
        '</sitemapindex>\n',
    );
    expect(sitemapXml(LIVE, ['/', '/writing'])).toBe(
      '<?xml version="1.0" encoding="UTF-8"?>\n' +
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
        '<url><loc>https://kettlebird.com/</loc></url>\n' +
        '<url><loc>https://kettlebird.com/writing</loc></url>\n' +
        '</urlset>\n',
    );
    expect(sitemapXml(LIVE, ['/a&b'])).toContain('<loc>https://kettlebird.com/a&amp;b</loc>');
  });

  it('is written by the build, at both addresses', () => {
    expect(read('astro.config.mjs')).toMatch(/seoFiles\(\)/);
    expect(read('src/integrations/seo-files.ts')).toMatch(/astro:build:done/);
  });
});

describe('site-search#AC-4 canonical', () => {
  it('is the site and the path without a closing slash, and the site for the home page', () => {
    expect(canonicalUrl(`${LIVE}/`, '/writing/')).toBe('https://kettlebird.com/writing');
    expect(canonicalUrl(LIVE, '/writing')).toBe('https://kettlebird.com/writing');
    expect(canonicalUrl(LIVE, 'writing/the-long-road/3/')).toBe('https://kettlebird.com/writing/the-long-road/3');
    expect(canonicalUrl(LIVE, '/')).toBe('https://kettlebird.com/');
    expect(canonicalUrl(LIVE, '')).toBe('https://kettlebird.com/');
  });
});

describe('site-search#AC-6 site card', () => {
  it('is the design\'s card, 1200 × 630, with its alt text', () => {
    expect(SITE_CARD).toEqual({ path: '/assets/images/site-card.jpg', width: 1200, height: 630, alt: 'Kettlebird Creations: illustration, comics and stories by Star Goldberg' });
    const jpeg = readFileSync('public/assets/images/site-card.jpg');
    expect(jpeg.equals(readFileSync('docs/design/mockups/site-search/site-card.jpg'))).toBe(true);
    // The frame's size, from the JPEG's start-of-frame marker.
    let i = 2;
    while (i < jpeg.length && !(jpeg[i] === 0xff && jpeg[i + 1] >= 0xc0 && jpeg[i + 1] <= 0xc2)) i += 2 + jpeg.readUInt16BE(i + 2);
    expect([jpeg.readUInt16BE(i + 7), jpeg.readUInt16BE(i + 5)]).toEqual([1200, 630]);
  });

  it('stands in for a missing cover, in place of the square logo', () => {
    expect(FALLBACK_IMAGE_PATH).toBe('/assets/images/site-card.jpg');
    const paused = series('paused');
    expect(seriesPreview(paused, `${STAGING}/`).image).toBe(`${STAGING}/assets/images/site-card.jpg`);
    expect(pagePreview(readerPages(paused)[0], `${STAGING}/`).image).toBe(`${STAGING}/assets/images/site-card.jpg`);
    expect(storyPreview(story('the-long-road'), `${STAGING}/`).image).toBe(`${STAGING}/assets/images/site-card.jpg`);
  });

  it('describes the picture: the card says what it says, a cover is the cover of its work', () => {
    expect(previewImageAlt(`${STAGING}/assets/images/site-card.jpg`, 'Kettle Tales')).toBe(SITE_CARD.alt);
    expect(previewImageAlt('https://cdn.sanity.io/images/p/d/c.jpg?w=1200', 'Kettle Tales')).toBe('Cover of Kettle Tales');
  });
});

describe('site-search#AC-7 portfolio preview', () => {
  const item = (over: Partial<GalleryItem>): GalleryItem => ({
    _id: 'a',
    title: 'A',
    slug: { current: 'a' },
    image: { asset: { _ref: 'image-abc123-1081x1600-jpg' } },
    ...over,
  });

  it('takes the newest piece in the Featured section, not the old switch', () => {
    const items = [
      item({ _id: 'switch', featured: true, category: ['original'], date: '2026-11-01' }),
      item({ _id: 'old', category: ['featured'], date: '2026-01-01' }),
      item({ _id: 'new', category: ['fanart', 'featured'], date: '2026-10-01' }),
      item({ _id: 'undated', category: ['featured'] }),
    ];
    expect(featuredPiece(items)?._id).toBe('new');
    expect(featuredPiece([item({ category: ['original'] }), item({ featured: true })])).toBeUndefined();
    expect(featuredPiece([])).toBeUndefined();
    expect(featuredPiece([item({ _id: 'only', category: ['featured'] })])?._id).toBe('only');
  });

  it('fits the piece whole on paper, 1200 × 630, with its alt text', () => {
    const picture = portfolioPreviewImage(item({ altText: ' A fox in a coat ', category: ['featured'] }));
    expect(picture.image).toMatch(/^https:\/\/cdn\.sanity\.io\/images\/[^/]+\/[^/]+\/abc123-1081x1600\.jpg\?/);
    const params = new URL(picture.image).searchParams;
    expect(Object.fromEntries(params)).toMatchObject({ w: '1200', h: '630', fit: 'fill', bg: 'f5f1e8', fm: 'jpg' });
    expect(picture.alt).toBe('A fox in a coat');
    expect(portfolioPreviewImage(item({ title: 'Night Walk', altText: '  ' })).alt).toBe('Night Walk');
  });
});

describe('site-search#AC-8 commissions description', () => {
  it('says whether commissions are open', () => {
    expect(commissionsDescription(true)).toBe('Commissions are open. Commission artwork from Kettlebird Creations: pricing, examples, and how to order.');
    expect(commissionsDescription(false)).toBe('Commissions are closed for now. Pricing and examples of artwork from Kettlebird Creations.');
  });
});

describe('site-search#AC-9 structured data', () => {
  const star = { '@id': 'https://kettlebird.com/#star' };

  it('describes the site and Star on the home page', () => {
    expect(homeData(`${LIVE}/`, LINKS)).toEqual({
      '@context': 'https://schema.org',
      '@graph': [
        { '@type': 'WebSite', name: 'Kettlebird Creations', url: 'https://kettlebird.com/' },
        {
          '@type': 'Person',
          '@id': 'https://kettlebird.com/#star',
          name: 'Star Goldberg',
          alternateName: 'Kettlebird',
          url: 'https://kettlebird.com/',
          sameAs: ['https://bsky.app/profile/kettlebird.bsky.social', 'https://ko-fi.com/kettlebirdart'],
        },
      ],
    });
    expect(homeData(LIVE, [])['@graph'][1]).not.toHaveProperty('sameAs');
  });

  it('makes the about page Star\'s profile, with the portrait when there is one', () => {
    const data = aboutData(LIVE, LINKS, 'https://cdn.sanity.io/images/p/d/portrait.jpg');
    expect(data).toMatchObject({ '@context': 'https://schema.org', '@type': 'ProfilePage', url: 'https://kettlebird.com/about' });
    expect(data.mainEntity).toMatchObject({ '@type': 'Person', '@id': 'https://kettlebird.com/#star', name: 'Star Goldberg', image: 'https://cdn.sanity.io/images/p/d/portrait.jpg' });
    expect(aboutData(LIVE, LINKS).mainEntity).not.toHaveProperty('image');
  });

  it('describes a comic series and the way to it', () => {
    const kettle: ComicSeries = { ...series('kettle-tales'), cover: { ...series('kettle-tales').cover!, social: 'https://cdn/c.jpg' } };
    expect(seriesData(LIVE, kettle)).toEqual({
      '@context': 'https://schema.org',
      '@graph': [
        { '@type': 'ComicSeries', name: 'Kettle Tales', description: 'A fox and a kettle set out across the hills.', image: 'https://cdn/c.jpg', author: star, url: 'https://kettlebird.com/comics/kettle-tales' },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Comics', item: 'https://kettlebird.com/comics' },
            { '@type': 'ListItem', position: 2, name: 'Kettle Tales', item: 'https://kettlebird.com/comics/kettle-tales' },
          ],
        },
      ],
    });
    const bare = seriesData(LIVE, series('paused'))['@graph'][0];
    expect(bare).not.toHaveProperty('image');
  });

  it('gives a reader page its path, with the chapter only when the series shows chapters', () => {
    const entry = readerPages(series('kettle-tales')).find((e) => e.path === '/comics/kettle-tales/2/2')!;
    expect(readerPageData(LIVE, entry)).toEqual({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Comics', item: 'https://kettlebird.com/comics' },
        { '@type': 'ListItem', position: 2, name: 'Kettle Tales', item: 'https://kettlebird.com/comics/kettle-tales' },
        { '@type': 'ListItem', position: 3, name: 'Chapter 2: The Long Road', item: 'https://kettlebird.com/comics/kettle-tales/2/1' },
        { '@type': 'ListItem', position: 4, name: 'Page 2', item: 'https://kettlebird.com/comics/kettle-tales/2/2' },
      ],
    });
    const one = readerPageData(LIVE, readerPages(series('one-shot'))[1]);
    expect(one.itemListElement.map((i: { name: string }) => i.name)).toEqual(['Comics', 'One Shot', 'Page 2']);
  });

  it('describes a story, and a chapter\'s path', () => {
    const song: Story = { ...story('the-kettles-song'), cover: { src: 'c', width: 1, height: 1, social: 'https://cdn/s.jpg' } };
    const [work, crumbs] = storyData(LIVE, song)['@graph'];
    expect(work).toEqual({
      '@type': 'CreativeWork',
      name: "The Kettle's Song",
      description: 'A kettle that sings at midnight.',
      genre: ['Fantasy', 'Cozy'],
      image: 'https://cdn/s.jpg',
      author: star,
      datePublished: '2026-10-01',
      url: "https://kettlebird.com/writing/the-kettles-song",
    });
    expect(crumbs.itemListElement.map((i: { name: string; item: string }) => [i.name, i.item])).toEqual([
      ['Writing', 'https://kettlebird.com/writing'],
      ["The Kettle's Song", 'https://kettlebird.com/writing/the-kettles-song'],
    ]);
    const plain = storyData(LIVE, { ...story('the-long-road'), genres: [], date: undefined, description: undefined })['@graph'][0];
    for (const key of ['genre', 'datePublished', 'description', 'image']) expect(plain).not.toHaveProperty(key);

    const road = story('the-long-road');
    const chapter = chapterData(LIVE, road, shownChapters(road)[1]);
    expect(chapter['@type']).toBe('BreadcrumbList');
    expect(chapter.itemListElement.map((i: { name: string; item: string }) => [i.name, i.item])).toEqual([
      ['Writing', 'https://kettlebird.com/writing'],
      ['The Long Road', 'https://kettlebird.com/writing/the-long-road'],
      ['Chapter 2: Over the Ridge', 'https://kettlebird.com/writing/the-long-road/2'],
    ]);
  });

  it('writes JSON that can sit in a script', () => {
    expect(jsonLd({ name: '</script><b>' })).toBe('{"name":"\\u003c/script>\\u003cb>"}');
    expect(JSON.parse(jsonLd(homeData(LIVE, LINKS)))).toEqual(homeData(LIVE, LINKS));
  });
});

describe('site-search#AC-10 adult rating', () => {
  it('is asked for by a ticked story\'s page and its chapters only', () => {
    for (const file of ['src/components/pages/StoryPage.astro', 'src/components/pages/StoryChapterPage.astro']) {
      expect(read(file), file).toMatch(/adult=\{story\.mature\}/);
    }
    expect(read('src/layouts/BaseLayout.astro')).toMatch(/adult && <meta name="rating" content="adult" \/>/);
  });
});

describe('site-search#AC-11 help text', () => {
  it('tells Star that search engines are told too', () => {
    expect(fieldText('writtenWork', 'mature').description).toMatch(
      / Search engines are told too, so it can be left out for people searching with safe search on\.$/,
    );
  });
});

describe('site-search#AC-12 guides', () => {
  it('says what search results and link previews show, and what Featured and the tick now also do', () => {
    const live = read('docs/user/going-live.md');
    for (const words of ['## In search results and link previews', 'Until the site moves to kettlebird.com', 'safe search', '**Featured**', 'ask the lead']) {
      expect(live, words).toContain(words);
    }
    expect(read('docs/user/site-settings.md')).toContain('tell search engines which profiles are yours');
    expect(read('docs/user/site-settings.md')).toContain('whether commissions are open');
    expect(read('docs/user/editing-your-site.md')).toContain("Portfolio's link");
    expect(read('docs/user/publishing-stories.md')).toContain('safe search');
  });
});
