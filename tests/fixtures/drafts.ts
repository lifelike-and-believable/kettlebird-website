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

export const FIXTURE_PUBLISHED: RawDoc[] = [
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
    chapters: [{ number: 1, title: 'The Kettle', pages: [{ ...img('image-k1'), altText: 'A fox looks up at a kettle.' }] }],
  },
];

export const FIXTURE_DRAFTS: RawDoc[] = [
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
    chapters: [{ number: 1, title: 'The Kettle', pages: [{ ...img('image-k1'), altText: 'A fox looks up at a kettle.' }] }],
  },
  // A series never published, and a chapter in it.
  { _id: 'drafts.series-new', _type: 'comicSeries', title: 'New Story', slug: { current: 'new-story' }, status: 'ongoing', type: 'original' },
  {
    _id: 'drafts.chapter-new',
    _type: 'comicChapter',
    number: 1,
    title: 'Beginnings',
    series: { _ref: 'series-new' },
    pages: [{ _key: 'p1', ...img('image-n1'), altText: 'A door opens.' }, { _key: 'p2', ...img('image-n2'), altText: 'Light spills out.' }],
  },
];
