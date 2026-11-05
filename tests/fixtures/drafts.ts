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
  // A comic with pairs off and the flip on, whose draft turns pairs on, and a chapter of it
  // (docs/specs/comic-reader-comic-settings.md AC-8, AC-9).
  { _id: 'series-sheets', _type: 'comicSeries', title: 'Single Sheets', slug: { current: 'single-sheets' }, status: 'ongoing', type: 'original', twoUp: false, pageFlip: true },
  // Stories (docs/specs/story-reader-pages.md AC-12): a one-shot, and a story in chapters.
  { _id: 'story-song', _type: 'writtenWork', title: "The Kettle's Song", slug: { current: 'the-kettles-song' }, rating: 'teen', publishDate: '2026-10-01', content: [block('Published text.')] },
  { _id: 'story-road', _type: 'writtenWork', title: 'The Long Road', slug: { current: 'the-long-road' }, rating: 'general', status: 'inProgress', publishDate: '2026-09-01' },
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
  { _id: 'drafts.series-sheets', _type: 'comicSeries', title: 'Single Sheets', slug: { current: 'single-sheets' }, status: 'ongoing', type: 'original', twoUp: true, pageFlip: true },
  {
    _id: 'drafts.sheets-1',
    _type: 'comicChapter',
    number: 1,
    series: { _ref: 'series-sheets' },
    pages: [
      { _key: 's1', ...img('image-Sheet1aaaaaaaaaaaaaaaaaa-800x1200-png'), altText: 'A lamp.' },
      { _key: 's2', ...img('image-Sheet2aaaaaaaaaaaaaaaaaa-800x1200-png'), altText: 'A window.' },
      { _key: 's3', ...img('image-Sheet3aaaaaaaaaaaaaaaaaa-800x1200-png'), altText: 'A door.' },
    ],
  },
  // A Mature draft of a published one-shot: the preview shows its text without asking first.
  { _id: 'drafts.story-song', _type: 'writtenWork', title: "The Kettle's Song", slug: { current: 'the-kettles-song' }, rating: 'mature', publishDate: '2026-10-01', content: [block('Draft text.')] },
  { _id: 'drafts.road-2', _type: 'storyChapter', story: storyRef('story-road'), number: 2, title: 'Over the Ridge', publishDate: '2026-10-20', content: [block('The ridge was steeper.')] },
  { _id: 'drafts.road-5', _type: 'storyChapter', story: storyRef('story-road'), number: 5, content: [] },
  // A story never published, with its first chapter, and a story without a web address.
  { _id: 'drafts.story-new', _type: 'writtenWork', title: 'New Story', slug: { current: 'new-story' }, rating: 'general', status: 'inProgress' },
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
  // An art piece never published, with a long title, for the portfolio at phone width with large
  // text (tests/e2e/portfolio-reflow.spec.ts).
  {
    _id: 'drafts.piece-moon',
    _type: 'galleryItem',
    title: 'Crooked Moon Party Portrait',
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
