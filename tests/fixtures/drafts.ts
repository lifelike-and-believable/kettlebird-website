// Fixture drafts for the preview route in the fixture build (KETTLEBIRD_FIXTURES=1): published
// documents and drafts as Sanity stores them, and the key that stands in for a preview secret.
// Spec: docs/specs/content-editing-preview.md.
import type { RawDoc } from '../../src/lib/preview/targets';

export const FIXTURE_PREVIEW_KEY = 'fixture-preview-key';

const img = (ref: string) => ({ _type: 'image', asset: { _ref: ref }, dimensions: { width: 800, height: 1200 } });

const links = [
  { _key: 'bsky', name: 'Bluesky', url: 'https://bsky.app/profile/kettlebird.bsky.social' },
  { _key: 'tumblr', name: 'Tumblr', url: 'https://kettlebird.tumblr.com' },
  { _key: 'insta', name: 'Instagram', url: 'https://www.instagram.com/kettlebird' },
];

const block = (text: string) => ({ _type: 'block', _key: text.slice(0, 8), style: 'normal', markDefs: [], children: [{ _type: 'span', text, marks: [] }] });
const storyRef = (id: string) => ({ _type: 'reference', _ref: id });

export const FIXTURE_PUBLISHED: RawDoc[] = [
  // Art pieces for the portfolio's preview (docs/specs/portfolio-full-screen.md): a large picture, one in
  // two sections, one without a picture; the draft piece-moon comes after them in Original Work.
  // Dated newest first, so the row keeps this order (portfolio-folders AC-4 puts undated pieces in title order).
  { _id: 'piece-lantern', _type: 'galleryItem', title: 'Night Market', date: '2024-05-01', image: { _type: 'image', asset: { _ref: 'image-Lantern1aaaaaaaaaaaaaaaa-3000x2000-jpg' } }, category: ['original'], altText: 'Lanterns over the river stalls.' },
  { _id: 'piece-alibi', _type: 'galleryItem', title: 'Late Night Alibi', date: '2024-04-01', image: { _type: 'image', asset: { _ref: 'image-Alibi1aaaaaaaaaaaaaaaaaa-1200x1200-jpg' } }, category: ['original', 'fanart'] },
  { _id: 'piece-blank', _type: 'galleryItem', title: 'Coming Soon', date: '2024-03-01', category: ['original'] },
  { _id: 'piece-jungle', _type: 'galleryItem', title: 'Jungle Eyes', date: '2024-02-01', image: { _type: 'image', asset: { _ref: 'image-Jungle1aaaaaaaaaaaaaaaaa-1600x2000-jpg' } }, category: ['original'] },
  // Past Clients, for the portfolio's folders (docs/specs/portfolio-folders.md): a subfolder, Book
  // covers (2 × 2), holding two pieces, and a loose 16:9 piece.
  { _id: 'sub-books', _type: 'portfolioSubfolder', name: 'Book covers', slug: { current: 'book-covers' }, section: 'commission', gridSize: 2 },
  { _id: 'piece-cover1', _type: 'galleryItem', title: 'Harbour Cover', date: '2025-05-01', image: { _type: 'image', asset: { _ref: 'image-Cover1aaaaaaaaaaaaaaaaaa-1200x1600-jpg' } }, category: ['commission'], subfolders: [{ _type: 'reference', _ref: 'sub-books', _weak: true, _key: 'c' }] },
  { _id: 'piece-cover2', _type: 'galleryItem', title: 'Orchard Cover', date: '2025-04-01', image: { _type: 'image', asset: { _ref: 'image-Cover2aaaaaaaaaaaaaaaaaa-1200x1600-jpg' } }, category: ['commission'], subfolders: [{ _type: 'reference', _ref: 'sub-books', _weak: true, _key: 'c' }] },
  { _id: 'piece-wide', _type: 'galleryItem', title: 'Shopfront', date: '2025-03-01', image: { _type: 'image', asset: { _ref: 'image-Wide1aaaaaaaaaaaaaaaaaaa-1600x900-jpg' } }, category: ['commission'], altText: 'A long shopfront at dusk.' },
  // A comic with pairs off and the flip on, whose draft turns pairs on, and a chapter of it
  // (docs/specs/comic-reader-comic-settings.md AC-8, AC-9).
  { _id: 'series-sheets', _type: 'comicSeries', title: 'Single Sheets', slug: { current: 'single-sheets' }, status: 'ongoing', type: 'original', twoUp: false, pageFlip: true },
  // Stories (docs/specs/story-reader-pages.md AC-12): a one-shot, and a story in chapters.
  { _id: 'story-song', _type: 'writtenWork', title: "The Kettle's Song", slug: { current: 'the-kettles-song' }, publishDate: '2026-10-01', content: [block('Published text.')] },
  { _id: 'story-road', _type: 'writtenWork', title: 'The Long Road', slug: { current: 'the-long-road' }, status: 'inProgress', publishDate: '2026-09-01' },
  { _id: 'road-1', _type: 'storyChapter', story: storyRef('story-road'), number: 1, title: 'Setting Out', publishDate: '2026-09-01', content: [block('She left at dawn.')] },
  { _id: 'road-2', _type: 'storyChapter', story: storyRef('story-road'), number: 2, title: 'Over the Ridge', publishDate: '2026-10-20', content: [block('The ridge was steep.')] },
  { _id: 'story-elsewhere', _type: 'writtenWork', title: 'Elsewhere Tale', slug: { current: 'elsewhere-tale' }, externalLink: 'https://kettlebird.tumblr.com/post/1' },
  { _id: 'commissionSettings', _type: 'commissionSettings', status: 'open' },
  { _id: 'contactSettings', _type: 'contactSettings', email: 'kettlebirdillustration@gmail.com', links },
  {
    _id: 'series-kettle',
    _type: 'comicSeries',
    title: 'Kettle Tales',
    slug: { current: 'kettle-tales' },
    description: 'A fox and a kettle set out across the hills.',
    status: 'ongoing',
    type: 'original',
    chapters: [{ number: 1, title: 'The Kettle', pages: [{ ...img('image-Kettle1aaaaaaaaaaaaaaaaa-800x1200-png'), altText: 'A fox looks up at a kettle.' }] }],
  },
];

export const FIXTURE_DRAFTS: RawDoc[] = [
  { _id: 'drafts.series-sheets', _type: 'comicSeries', title: 'Single Sheets', slug: { current: 'single-sheets' }, status: 'ongoing', type: 'original', twoUp: true, pageFlip: true, pageSize: 'height', largestPageWidth: 1200 },
  {
    _id: 'drafts.sheets-1',
    _type: 'comicChapter',
    number: 1,
    series: { _ref: 'series-sheets' },
    pages: [
      { _key: 's1', ...img('image-Sheet1aaaaaaaaaaaaaaaaaa-800x1200-png'), altText: 'A lamp.', panelsBy: 'site', panels: [{ x: 5, y: 3, width: 90, height: 45 }, { x: 5, y: 52, width: 90, height: 45 }] },
      { _key: 's2', ...img('image-Sheet2aaaaaaaaaaaaaaaaaa-800x1200-png'), altText: 'A window.', panelsBy: 'site', panels: [{ x: 5, y: 3, width: 90, height: 45 }, { x: 5, y: 52, width: 90, height: 45 }] },
      { _key: 's3', ...img('image-Sheet3aaaaaaaaaaaaaaaaaa-800x1200-png'), altText: 'A door.' },
    ],
  },
  // A Mature draft of a published one-shot: the preview shows its text without asking first.
  { _id: 'drafts.story-song', _type: 'writtenWork', title: "The Kettle's Song", slug: { current: 'the-kettles-song' }, mature: true, publishDate: '2026-10-01', content: [block('Draft text.')] },
  { _id: 'drafts.road-2', _type: 'storyChapter', story: storyRef('story-road'), number: 2, title: 'Over the Ridge', publishDate: '2026-10-20', content: [block('The ridge was steeper.')] },
  { _id: 'drafts.road-5', _type: 'storyChapter', story: storyRef('story-road'), number: 5, content: [] },
  // A story never published, with its first chapter, and a story without a web address.
  { _id: 'drafts.story-new', _type: 'writtenWork', title: 'New Story', slug: { current: 'new-story' }, status: 'inProgress' },
  { _id: 'drafts.new-1', _type: 'storyChapter', story: storyRef('story-new'), number: 1, title: 'Hello', content: [block('A first line.')] },
  { _id: 'drafts.story-nameless', _type: 'writtenWork', title: 'Nameless', content: [block('Words.')] },
  { _id: 'drafts.commissionSettings', _type: 'commissionSettings', status: 'closed', note: 'Back in March.' },
  { _id: 'drafts.contactSettings', _type: 'contactSettings', email: 'kettlebirdillustration@gmail.com', links: links.filter((l) => l._key !== 'insta') },
  {
    _id: 'drafts.series-kettle',
    _type: 'comicSeries',
    title: 'Kettle Tales',
    slug: { current: 'kettle-tales' },
    description: 'A fox and a kettle set out across the hills, and keep going.',
    status: 'ongoing',
    type: 'original',
    chapters: [{ number: 1, title: 'The Kettle', pages: [{ ...img('image-Kettle1aaaaaaaaaaaaaaaaa-800x1200-png'), altText: 'A fox looks up at a kettle.' }] }],
  },
  // A subfolder never published, with no pieces yet (docs/specs/portfolio-folders.md AC-23).
  { _id: 'drafts.sub-new', _type: 'portfolioSubfolder', name: 'Murderbot', slug: { current: 'murderbot' }, section: 'fanart', gridSize: 2 },
  // An art piece never published, with a long title, for the portfolio at phone width with large
  // text (tests/e2e/portfolio-reflow.spec.ts).
  {
    _id: 'drafts.piece-moon',
    _type: 'galleryItem',
    title: 'Crooked Moon Party Portrait',
    date: '2024-01-01',
    image: img('image-Moon1aaaaaaaaaaaaaaaaaaa-800x1200-png'),
    category: ['original'],
    altText: 'Friends at a party under a crooked moon.',
  },
  // A series never published, and a chapter in it.
  { _id: 'drafts.series-new', _type: 'comicSeries', title: 'New Story', slug: { current: 'new-story' }, status: 'ongoing', type: 'original' },
  {
    _id: 'drafts.chapter-new',
    _type: 'comicChapter',
    number: 1,
    title: 'Beginnings',
    series: { _ref: 'series-new' },
    pages: [{ _key: 'p1', ...img('image-New1aaaaaaaaaaaaaaaaaaaa-800x1200-png'), altText: 'A door opens.' }, { _key: 'p2', ...img('image-New2aaaaaaaaaaaaaaaaaaaa-800x1200-png'), altText: 'Light spills out.' }],
  },
];
